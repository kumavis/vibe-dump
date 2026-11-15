var Wd=Object.defineProperty;var jd=(n,t,e)=>t in n?Wd(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var Do=(n,t,e)=>jd(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const qd="modulepreload",Xd=function(n,t){return new URL(n,t).href},hl={},Cn=function(t,e,i){let s=Promise.resolve();if(e&&e.length>0){const a=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(e.map(l=>{if(l=Xd(l,i),l in hl)return;hl[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!i)for(let _=a.length-1;_>=0;_--){const g=a[_];if(g.href===l&&(!h||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const p=document.createElement("link");if(p.rel=h?"stylesheet":qd,h||(p.as="script"),p.crossOrigin="",p.href=l,c&&p.setAttribute("nonce",c),document.head.appendChild(p),h)return new Promise((_,g)=>{p.addEventListener("load",_),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(a){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=a,window.dispatchEvent(r),!r.defaultPrevented)throw a}return s.then(a=>{for(const r of a||[])r.status==="rejected"&&o(r.reason);return t().catch(o)})};function Du(n){let t=n>>>0;return function(){t=t+1831565813>>>0;let i=t;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function nc(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Iu(n,t){let e=n>>>0^Math.imul((t>>>0)+2654435769,2246822507);return e^=e>>>16,e=Math.imul(e,2146121005),e^=e>>>15,e=Math.imul(e,2221713035),e^=e>>>16,e>>>0}class Be{constructor(t=1){this.seed=typeof t=="string"?nc(t):t>>>0,this._next=Du(this.seed)}next(){return this._next()}range(t,e){return t+(e-t)*this._next()}int(t,e){return t+Math.floor((e-t+1)*this._next())}jitter(t){return(this._next()*2-1)*t}gauss(){return this._next()+this._next()+this._next()+this._next()-2}chance(t){return this._next()<t}pick(t){return t[Math.floor(this._next()*t.length)]}fork(t){return new Be(Iu(this.seed,typeof t=="string"?nc(t):t>>>0))}}function Yd(n){return n instanceof Be?n:new Be(n)}let Uu=(n,t)=>{if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(n,t);if(typeof document<"u"){const e=document.createElement("canvas");return e.width=n,e.height=t,e}throw new Error("taotie kit: no Canvas2D available — call setCanvasFactory()")};function br(n,t){return Uu(Math.max(1,n|0),Math.max(1,t|0))}function $d(n){Uu=n}function ic(n){return n.getContext("2d",{willReadFrequently:!0})}const lo=1e20;function ul(n,t,e,i,s,o){let a=-1;for(let c=0;c<t;c++){const l=n[c];if(l>=lo*.5)continue;if(a<0){a=0,s[0]=c,o[0]=-1/0,o[1]=1/0;continue}let h;for(;;){const u=s[a];if(h=(l+c*c-(n[u]+u*u))/(2*c-2*u),h<=o[a]&&a>0)a--;else break}if(h<=o[a]){s[0]=c,o[0]=-1/0,o[1]=1/0;continue}a++,s[a]=c,o[a]=h,o[a+1]=1/0}if(a<0){for(let c=0;c<t;c++)e[c]=lo,i[c]=-1;return}let r=0;for(let c=0;c<t;c++){for(;o[r+1]<c;)r++;const l=s[r];e[c]=(c-l)*(c-l)+n[l],i[c]=l}}function si(n,t,e){const i=Math.max(t,e),s=new Float64Array(i),o=new Float64Array(i),a=new Int32Array(i),r=new Int32Array(i),c=new Float64Array(i+1),l=new Float32Array(t*e),h=new Int32Array(t*e);for(let p=0;p<t;p++){for(let _=0;_<e;_++)s[_]=n[_*t+p]?0:lo;ul(s,e,o,a,r,c);for(let _=0;_<e;_++)l[_*t+p]=o[_],h[_*t+p]=a[_]}const u=new Float32Array(t*e),f=new Int32Array(t*e);for(let p=0;p<e;p++){const _=p*t;for(let g=0;g<t;g++)s[g]=l[_+g];ul(s,t,o,a,r,c);for(let g=0;g<t;g++){const d=a[g];d<0||o[g]>=lo*.5?(u[_+g]=lo,f[_+g]=-1):(u[_+g]=o[g],f[_+g]=h[_+d]*t+d)}}return{dist2:u,nearest:f}}function Kd(n,t,e){return si(n,t,e).dist2}function Zd(n,t,e){if(n===0||t===0)return .5-e;if(n=Math.abs(n),t=Math.abs(t),n<t){const s=n;n=t,t=s}const i=.5*t/n;return e<i?.5*(n+t)-Math.sqrt(2*n*t*e):e<1-i?(.5-e)*n:-.5*(n+t)+Math.sqrt(2*n*t*(1-e))}function Nu(n,t,e){const i=t*e,s=new Uint8Array(i),o=new Float32Array(i),a=new Float32Array(i),r=(f,p)=>f<0||p<0||f>=t||p>=e?0:n[p*t+f],c=Math.SQRT2;let l=!1;for(let f=0;f<e;f++)for(let p=0;p<t;p++){const _=f*t+p,g=n[_],d=g>=.5;let m=g>0&&g<1;if(m||(m=r(p-1,f)>=.5!==d||r(p+1,f)>=.5!==d||r(p,f-1)>=.5!==d||r(p,f+1)>=.5!==d),!m)continue;l=!0,s[_]=1;let y=-r(p-1,f-1)-c*r(p-1,f)-r(p-1,f+1)+r(p+1,f-1)+c*r(p+1,f)+r(p+1,f+1),M=-r(p-1,f-1)-c*r(p,f-1)-r(p+1,f-1)+r(p-1,f+1)+c*r(p,f+1)+r(p+1,f+1);const v=Math.hypot(y,M);v>1e-6?(y/=v,M/=v):(y=0,M=0);const x=v>1e-6?Zd(y,M,g):.5-g;o[_]=p+y*x,a[_]=f+M*x}const h=new Float32Array(i);if(!l){const f=i&&n[0]>=.5?1:-1;return h.fill(f*Math.hypot(t,e)),h}const{nearest:u}=si(s,t,e);for(let f=0;f<e;f++)for(let p=0;p<t;p++){const _=f*t+p,g=u[_],d=Math.hypot(p-o[g],f-a[g]);h[_]=n[_]>=.5?d:-d}return h}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fc="160",Zi={ROTATE:0,DOLLY:1,PAN:2},Ji={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Jd=0,fl=1,Qd=2,Fu=1,Ou=2,Zn=3,wi=0,Ye=1,Un=2,bi=0,Es=1,dl=2,pl=3,ml=4,t0=5,Ni=100,e0=101,n0=102,gl=103,_l=104,i0=200,s0=201,o0=202,r0=203,sc=204,oc=205,a0=206,c0=207,l0=208,h0=209,u0=210,f0=211,d0=212,p0=213,m0=214,g0=0,_0=1,M0=2,wr=3,y0=4,v0=5,x0=6,b0=7,zu=0,w0=1,S0=2,ti=0,E0=1,T0=2,A0=3,Bu=4,R0=5,P0=6,Gu=300,Cs=301,ks=302,rc=303,ac=304,Vr=306,cc=1e3,_n=1001,lc=1002,Oe=1003,Ml=1004,na=1005,rn=1006,L0=1007,Ds=1008,ei=1009,C0=1010,k0=1011,Oc=1012,Hu=1013,Mi=1014,yi=1015,Mo=1016,Vu=1017,Wu=1018,Bi=1020,D0=1021,Mn=1023,I0=1024,U0=1025,Gi=1026,Is=1027,N0=1028,ju=1029,F0=1030,qu=1031,Xu=1033,ia=33776,sa=33777,oa=33778,ra=33779,yl=35840,vl=35841,xl=35842,bl=35843,Yu=36196,wl=37492,Sl=37496,El=37808,Tl=37809,Al=37810,Rl=37811,Pl=37812,Ll=37813,Cl=37814,kl=37815,Dl=37816,Il=37817,Ul=37818,Nl=37819,Fl=37820,Ol=37821,aa=36492,zl=36494,Bl=36495,O0=36283,Gl=36284,Hl=36285,Vl=36286,$u=3e3,Hi=3001,z0=3200,B0=3201,Ku=0,G0=1,cn="",Ae="srgb",oi="srgb-linear",zc="display-p3",Wr="display-p3-linear",Sr="linear",ce="srgb",Er="rec709",Tr="p3",Qi=7680,Wl=519,H0=512,V0=513,W0=514,Zu=515,j0=516,q0=517,X0=518,Y0=519,jl=35044,ql="300 es",hc=1035,Qn=2e3,Ar=2001;class $i{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}}const We=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],gr=Math.PI/180,Rr=180/Math.PI;function Hs(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(We[n&255]+We[n>>8&255]+We[n>>16&255]+We[n>>24&255]+"-"+We[t&255]+We[t>>8&255]+"-"+We[t>>16&15|64]+We[t>>24&255]+"-"+We[e&63|128]+We[e>>8&255]+"-"+We[e>>16&255]+We[e>>24&255]+We[i&255]+We[i>>8&255]+We[i>>16&255]+We[i>>24&255]).toLowerCase()}function ze(n,t,e){return Math.max(t,Math.min(e,n))}function $0(n,t){return(n%t+t)%t}function ca(n,t,e){return(1-e)*n+e*t}function Xl(n){return(n&n-1)===0&&n!==0}function uc(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ks(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Je(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const K0={DEG2RAD:gr};class Lt{constructor(t=0,e=0){Lt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*i-a*s+t.x,this.y=o*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,i,s,o,a,r,c,l){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l)}set(t,e,i,s,o,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=o,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[3],c=i[6],l=i[1],h=i[4],u=i[7],f=i[2],p=i[5],_=i[8],g=s[0],d=s[3],m=s[6],y=s[1],M=s[4],v=s[7],x=s[2],b=s[5],w=s[8];return o[0]=a*g+r*y+c*x,o[3]=a*d+r*M+c*b,o[6]=a*m+r*v+c*w,o[1]=l*g+h*y+u*x,o[4]=l*d+h*M+u*b,o[7]=l*m+h*v+u*w,o[2]=f*g+p*y+_*x,o[5]=f*d+p*M+_*b,o[8]=f*m+p*v+_*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-i*o*h+i*r*c+s*o*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,f=r*c-h*o,p=l*o-a*c,_=e*u+i*f+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=u*g,t[1]=(s*l-h*i)*g,t[2]=(r*i-s*a)*g,t[3]=f*g,t[4]=(h*e-s*c)*g,t[5]=(s*o-r*e)*g,t[6]=p*g,t[7]=(i*c-l*e)*g,t[8]=(a*e-i*o)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,o,a,r){const c=Math.cos(o),l=Math.sin(o);return this.set(i*c,i*l,-i*(c*a+l*r)+a+t,-s*l,s*c,-s*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(la.makeScale(t,e)),this}rotate(t){return this.premultiply(la.makeRotation(-t)),this}translate(t,e){return this.premultiply(la.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const la=new Jt;function Ju(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Pr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Z0(){const n=Pr("canvas");return n.style.display="block",n}const Yl={};function ho(n){n in Yl||(Yl[n]=!0,console.warn(n))}const $l=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Kl=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Io={[oi]:{transfer:Sr,primaries:Er,toReference:n=>n,fromReference:n=>n},[Ae]:{transfer:ce,primaries:Er,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Wr]:{transfer:Sr,primaries:Tr,toReference:n=>n.applyMatrix3(Kl),fromReference:n=>n.applyMatrix3($l)},[zc]:{transfer:ce,primaries:Tr,toReference:n=>n.convertSRGBToLinear().applyMatrix3(Kl),fromReference:n=>n.applyMatrix3($l).convertLinearToSRGB()}},J0=new Set([oi,Wr]),ie={enabled:!0,_workingColorSpace:oi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!J0.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=Io[t].toReference,s=Io[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return Io[n].primaries},getTransfer:function(n){return n===cn?Sr:Io[n].transfer}};function Ts(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ha(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let ts;class Qu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ts===void 0&&(ts=Pr("canvas")),ts.width=t.width,ts.height=t.height;const i=ts.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=ts}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Pr("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=Ts(o[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Ts(e[i]/255)*255):e[i]=Ts(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Q0=0;class tf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Q0++}),this.uuid=Hs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(ua(s[a].image)):o.push(ua(s[a]))}else o=ua(s);i.url=o}return e||(t.images[this.uuid]=i),i}}function ua(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Qu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let tp=0;class Ke extends $i{constructor(t=Ke.DEFAULT_IMAGE,e=Ke.DEFAULT_MAPPING,i=_n,s=_n,o=rn,a=Ds,r=Mn,c=ei,l=Ke.DEFAULT_ANISOTROPY,h=cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=Hs(),this.name="",this.source=new tf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ho("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Hi?Ae:cn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Gu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case cc:t.x=t.x-Math.floor(t.x);break;case _n:t.x=t.x<0?0:1;break;case lc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case cc:t.y=t.y-Math.floor(t.y);break;case _n:t.y=t.y<0?0:1;break;case lc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ho("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ae?Hi:$u}set encoding(t){ho("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Hi?Ae:cn}}Ke.DEFAULT_IMAGE=null;Ke.DEFAULT_MAPPING=Gu;Ke.DEFAULT_ANISOTROPY=1;class De{constructor(t=0,e=0,i=0,s=1){De.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*o,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*o,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*o,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],p=c[5],_=c[9],g=c[2],d=c[6],m=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-g)<.01&&Math.abs(_-d)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+g)<.1&&Math.abs(_+d)<.1&&Math.abs(l+p+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,v=(p+1)/2,x=(m+1)/2,b=(h+f)/4,w=(u+g)/4,L=(_+d)/4;return M>v&&M>x?M<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(M),s=b/i,o=w/i):v>x?v<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(v),i=b/s,o=L/s):x<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(x),i=w/o,s=L/o),this.set(i,s,o,e),this}let y=Math.sqrt((d-_)*(d-_)+(u-g)*(u-g)+(f-h)*(f-h));return Math.abs(y)<.001&&(y=1),this.x=(d-_)/y,this.y=(u-g)/y,this.z=(f-h)/y,this.w=Math.acos((l+p+m-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ep extends $i{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new De(0,0,t,e),this.scissorTest=!1,this.viewport=new De(0,0,t,e);const s={width:t,height:e,depth:1};i.encoding!==void 0&&(ho("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Hi?Ae:cn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new Ke(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new tf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ji extends ep{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class ef extends Ke{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class np extends Ke{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qi{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,o,a,r){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const f=o[a+0],p=o[a+1],_=o[a+2],g=o[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=f,t[e+1]=p,t[e+2]=_,t[e+3]=g;return}if(u!==g||c!==f||l!==p||h!==_){let d=1-r;const m=c*f+l*p+h*_+u*g,y=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){const x=Math.sqrt(M),b=Math.atan2(x,m*y);d=Math.sin(d*b)/x,r=Math.sin(r*b)/x}const v=r*y;if(c=c*d+f*v,l=l*d+p*v,h=h*d+_*v,u=u*d+g*v,d===1-r){const x=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=x,l*=x,h*=x,u*=x}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,o,a){const r=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=o[a],f=o[a+1],p=o[a+2],_=o[a+3];return t[e]=r*_+h*u+c*p-l*f,t[e+1]=c*_+h*f+l*u-r*p,t[e+2]=l*_+h*p+r*f-c*u,t[e+3]=h*_-r*u-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(s/2),u=r(o/2),f=c(i/2),p=c(s/2),_=c(o/2);switch(a){case"XYZ":this._x=f*h*u+l*p*_,this._y=l*p*u-f*h*_,this._z=l*h*_+f*p*u,this._w=l*h*u-f*p*_;break;case"YXZ":this._x=f*h*u+l*p*_,this._y=l*p*u-f*h*_,this._z=l*h*_-f*p*u,this._w=l*h*u+f*p*_;break;case"ZXY":this._x=f*h*u-l*p*_,this._y=l*p*u+f*h*_,this._z=l*h*_+f*p*u,this._w=l*h*u-f*p*_;break;case"ZYX":this._x=f*h*u-l*p*_,this._y=l*p*u+f*h*_,this._z=l*h*_-f*p*u,this._w=l*h*u+f*p*_;break;case"YZX":this._x=f*h*u+l*p*_,this._y=l*p*u+f*h*_,this._z=l*h*_-f*p*u,this._w=l*h*u-f*p*_;break;case"XZY":this._x=f*h*u-l*p*_,this._y=l*p*u-f*h*_,this._z=l*h*_+f*p*u,this._w=l*h*u+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],o=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=i+r+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-c)*p,this._y=(o-l)*p,this._z=(a-s)*p}else if(i>r&&i>u){const p=2*Math.sqrt(1+i-r-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(o+l)/p}else if(r>u){const p=2*Math.sqrt(1+r-i-u);this._w=(o-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-i-r);this._w=(a-s)/p,this._x=(o+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ze(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,o=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*r+s*l-o*c,this._y=s*h+a*c+o*r-i*l,this._z=o*h+a*l+i*c-s*r,this._w=a*h-i*r-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,o=this._z,a=this._w;let r=a*t._w+i*t._x+s*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=s,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(o),i*Math.cos(o),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(t=0,e=0,i=0){X.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6]*s,this.y=o[1]*e+o[4]*i+o[7]*s,this.z=o[2]*e+o[5]*i+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=t.elements,a=1/(o[3]*e+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*i+o[8]*s+o[12])*a,this.y=(o[1]*e+o[5]*i+o[9]*s+o[13])*a,this.z=(o[2]*e+o[6]*i+o[10]*s+o[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*s-r*i),h=2*(r*e-o*s),u=2*(o*i-a*e);return this.x=e+c*l+a*u-r*h,this.y=i+c*h+r*l-o*u,this.z=s+c*u+o*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s,this.y=o[1]*e+o[5]*i+o[9]*s,this.z=o[2]*e+o[6]*i+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,o=t.z,a=e.x,r=e.y,c=e.z;return this.x=s*c-o*r,this.y=o*a-i*c,this.z=i*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return fa.copy(this).projectOnVector(t),this.sub(fa)}reflect(t){return this.sub(fa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fa=new X,Zl=new qi;class An{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const o=i.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,wn):wn.fromBufferAttribute(o,a),wn.applyMatrix4(t.matrixWorld),this.expandByPoint(wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Uo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Uo.copy(i.boundingBox)),Uo.applyMatrix4(t.matrixWorld),this.union(Uo)}const s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,wn),wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Zs),No.subVectors(this.max,Zs),es.subVectors(t.a,Zs),ns.subVectors(t.b,Zs),is.subVectors(t.c,Zs),li.subVectors(ns,es),hi.subVectors(is,ns),Ri.subVectors(es,is);let e=[0,-li.z,li.y,0,-hi.z,hi.y,0,-Ri.z,Ri.y,li.z,0,-li.x,hi.z,0,-hi.x,Ri.z,0,-Ri.x,-li.y,li.x,0,-hi.y,hi.x,0,-Ri.y,Ri.x,0];return!da(e,es,ns,is,No)||(e=[1,0,0,0,1,0,0,0,1],!da(e,es,ns,is,No))?!1:(Fo.crossVectors(li,hi),e=[Fo.x,Fo.y,Fo.z],da(e,es,ns,is,No))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(jn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const jn=[new X,new X,new X,new X,new X,new X,new X,new X],wn=new X,Uo=new An,es=new X,ns=new X,is=new X,li=new X,hi=new X,Ri=new X,Zs=new X,No=new X,Fo=new X,Pi=new X;function da(n,t,e,i,s){for(let o=0,a=n.length-3;o<=a;o+=3){Pi.fromArray(n,o);const r=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),c=t.dot(Pi),l=e.dot(Pi),h=i.dot(Pi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const ip=new An,Js=new X,pa=new X;class Bc{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):ip.setFromPoints(t).getCenter(i);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Js.subVectors(t,this.center);const e=Js.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Js,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Js.copy(t.center).add(pa)),this.expandByPoint(Js.copy(t.center).sub(pa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qn=new X,ma=new X,Oo=new X,ui=new X,ga=new X,zo=new X,_a=new X;class nf{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,qn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=qn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(qn.copy(this.origin).addScaledVector(this.direction,e),qn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ma.copy(t).add(e).multiplyScalar(.5),Oo.copy(e).sub(t).normalize(),ui.copy(this.origin).sub(ma);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Oo),r=ui.dot(this.direction),c=-ui.dot(Oo),l=ui.lengthSq(),h=Math.abs(1-a*a);let u,f,p,_;if(h>0)if(u=a*c-r,f=a*r-c,_=o*h,u>=0)if(f>=-_)if(f<=_){const g=1/h;u*=g,f*=g,p=u*(u+a*f+2*r)+f*(a*u+f+2*c)+l}else f=o,u=Math.max(0,-(a*f+r)),p=-u*u+f*(f+2*c)+l;else f=-o,u=Math.max(0,-(a*f+r)),p=-u*u+f*(f+2*c)+l;else f<=-_?(u=Math.max(0,-(-a*o+r)),f=u>0?-o:Math.min(Math.max(-o,-c),o),p=-u*u+f*(f+2*c)+l):f<=_?(u=0,f=Math.min(Math.max(-o,-c),o),p=f*(f+2*c)+l):(u=Math.max(0,-(a*o+r)),f=u>0?o:Math.min(Math.max(-o,-c),o),p=-u*u+f*(f+2*c)+l);else f=a>0?-o:o,u=Math.max(0,-(a*f+r)),p=-u*u+f*(f+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ma).addScaledVector(Oo,f),p}intersectSphere(t,e){qn.subVectors(t.center,this.origin);const i=qn.dot(this.direction),s=qn.dot(qn)-i*i,o=t.radius*t.radius;if(s>o)return null;const a=Math.sqrt(o-s),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,o,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(i=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(i=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(o=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||o>s||((o>i||isNaN(i))&&(i=o),(a<s||isNaN(s))&&(s=a),u>=0?(r=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(r=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,qn)!==null}intersectTriangle(t,e,i,s,o){ga.subVectors(e,t),zo.subVectors(i,t),_a.crossVectors(ga,zo);let a=this.direction.dot(_a),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;ui.subVectors(this.origin,t);const c=r*this.direction.dot(zo.crossVectors(ui,zo));if(c<0)return null;const l=r*this.direction.dot(ga.cross(ui));if(l<0||c+l>a)return null;const h=-r*ui.dot(_a);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,i,s,o,a,r,c,l,h,u,f,p,_,g,d){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l,h,u,f,p,_,g,d)}set(t,e,i,s,o,a,r,c,l,h,u,f,p,_,g,d){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=o,m[5]=a,m[9]=r,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=f,m[3]=p,m[7]=_,m[11]=g,m[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/ss.setFromMatrixColumn(t,0).length(),o=1/ss.setFromMatrixColumn(t,1).length(),a=1/ss.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*o,e[5]=i[5]*o,e[6]=i[6]*o,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,o=t.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=a*h,p=a*u,_=r*h,g=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+_*l,e[5]=f-g*l,e[9]=-r*c,e[2]=g-f*l,e[6]=_+p*l,e[10]=a*c}else if(t.order==="YXZ"){const f=c*h,p=c*u,_=l*h,g=l*u;e[0]=f+g*r,e[4]=_*r-p,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=p*r-_,e[6]=g+f*r,e[10]=a*c}else if(t.order==="ZXY"){const f=c*h,p=c*u,_=l*h,g=l*u;e[0]=f-g*r,e[4]=-a*u,e[8]=_+p*r,e[1]=p+_*r,e[5]=a*h,e[9]=g-f*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const f=a*h,p=a*u,_=r*h,g=r*u;e[0]=c*h,e[4]=_*l-p,e[8]=f*l+g,e[1]=c*u,e[5]=g*l+f,e[9]=p*l-_,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const f=a*c,p=a*l,_=r*c,g=r*l;e[0]=c*h,e[4]=g-f*u,e[8]=_*u+p,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=p*u+_,e[10]=f-g*u}else if(t.order==="XZY"){const f=a*c,p=a*l,_=r*c,g=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+g,e[5]=a*h,e[9]=p*u-_,e[2]=_*u-p,e[6]=r*h,e[10]=g*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(sp,t,op)}lookAt(t,e,i){const s=this.elements;return sn.subVectors(t,e),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),fi.crossVectors(i,sn),fi.lengthSq()===0&&(Math.abs(i.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),fi.crossVectors(i,sn)),fi.normalize(),Bo.crossVectors(sn,fi),s[0]=fi.x,s[4]=Bo.x,s[8]=sn.x,s[1]=fi.y,s[5]=Bo.y,s[9]=sn.y,s[2]=fi.z,s[6]=Bo.z,s[10]=sn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[4],c=i[8],l=i[12],h=i[1],u=i[5],f=i[9],p=i[13],_=i[2],g=i[6],d=i[10],m=i[14],y=i[3],M=i[7],v=i[11],x=i[15],b=s[0],w=s[4],L=s[8],S=s[12],T=s[1],C=s[5],R=s[9],O=s[13],A=s[2],D=s[6],k=s[10],I=s[14],N=s[3],z=s[7],q=s[11],Z=s[15];return o[0]=a*b+r*T+c*A+l*N,o[4]=a*w+r*C+c*D+l*z,o[8]=a*L+r*R+c*k+l*q,o[12]=a*S+r*O+c*I+l*Z,o[1]=h*b+u*T+f*A+p*N,o[5]=h*w+u*C+f*D+p*z,o[9]=h*L+u*R+f*k+p*q,o[13]=h*S+u*O+f*I+p*Z,o[2]=_*b+g*T+d*A+m*N,o[6]=_*w+g*C+d*D+m*z,o[10]=_*L+g*R+d*k+m*q,o[14]=_*S+g*O+d*I+m*Z,o[3]=y*b+M*T+v*A+x*N,o[7]=y*w+M*C+v*D+x*z,o[11]=y*L+M*R+v*k+x*q,o[15]=y*S+M*O+v*I+x*Z,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],p=t[14],_=t[3],g=t[7],d=t[11],m=t[15];return _*(+o*c*u-s*l*u-o*r*f+i*l*f+s*r*p-i*c*p)+g*(+e*c*p-e*l*f+o*a*f-s*a*p+s*l*h-o*c*h)+d*(+e*l*u-e*r*p-o*a*u+i*a*p+o*r*h-i*l*h)+m*(-s*r*h-e*c*u+e*r*f+s*a*u-i*a*f+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],p=t[11],_=t[12],g=t[13],d=t[14],m=t[15],y=u*d*l-g*f*l+g*c*p-r*d*p-u*c*m+r*f*m,M=_*f*l-h*d*l-_*c*p+a*d*p+h*c*m-a*f*m,v=h*g*l-_*u*l+_*r*p-a*g*p-h*r*m+a*u*m,x=_*u*c-h*g*c-_*r*f+a*g*f+h*r*d-a*u*d,b=e*y+i*M+s*v+o*x;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/b;return t[0]=y*w,t[1]=(g*f*o-u*d*o-g*s*p+i*d*p+u*s*m-i*f*m)*w,t[2]=(r*d*o-g*c*o+g*s*l-i*d*l-r*s*m+i*c*m)*w,t[3]=(u*c*o-r*f*o-u*s*l+i*f*l+r*s*p-i*c*p)*w,t[4]=M*w,t[5]=(h*d*o-_*f*o+_*s*p-e*d*p-h*s*m+e*f*m)*w,t[6]=(_*c*o-a*d*o-_*s*l+e*d*l+a*s*m-e*c*m)*w,t[7]=(a*f*o-h*c*o+h*s*l-e*f*l-a*s*p+e*c*p)*w,t[8]=v*w,t[9]=(_*u*o-h*g*o-_*i*p+e*g*p+h*i*m-e*u*m)*w,t[10]=(a*g*o-_*r*o+_*i*l-e*g*l-a*i*m+e*r*m)*w,t[11]=(h*r*o-a*u*o-h*i*l+e*u*l+a*i*p-e*r*p)*w,t[12]=x*w,t[13]=(h*g*s-_*u*s+_*i*f-e*g*f-h*i*d+e*u*d)*w,t[14]=(_*r*s-a*g*s-_*i*c+e*g*c+a*i*d-e*r*d)*w,t[15]=(a*u*s-h*r*s+h*i*c-e*u*c-a*i*f+e*r*f)*w,this}scale(t){const e=this.elements,i=t.x,s=t.y,o=t.z;return e[0]*=i,e[4]*=s,e[8]*=o,e[1]*=i,e[5]*=s,e[9]*=o,e[2]*=i,e[6]*=s,e[10]*=o,e[3]*=i,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),o=1-i,a=t.x,r=t.y,c=t.z,l=o*a,h=o*r;return this.set(l*a+i,l*r-s*c,l*c+s*r,0,l*r+s*c,h*r+i,h*c-s*a,0,l*c-s*r,h*c+s*a,o*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,o,a){return this.set(1,i,o,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,o=e._x,a=e._y,r=e._z,c=e._w,l=o+o,h=a+a,u=r+r,f=o*l,p=o*h,_=o*u,g=a*h,d=a*u,m=r*u,y=c*l,M=c*h,v=c*u,x=i.x,b=i.y,w=i.z;return s[0]=(1-(g+m))*x,s[1]=(p+v)*x,s[2]=(_-M)*x,s[3]=0,s[4]=(p-v)*b,s[5]=(1-(f+m))*b,s[6]=(d+y)*b,s[7]=0,s[8]=(_+M)*w,s[9]=(d-y)*w,s[10]=(1-(f+g))*w,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let o=ss.set(s[0],s[1],s[2]).length();const a=ss.set(s[4],s[5],s[6]).length(),r=ss.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],Sn.copy(this);const l=1/o,h=1/a,u=1/r;return Sn.elements[0]*=l,Sn.elements[1]*=l,Sn.elements[2]*=l,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,e.setFromRotationMatrix(Sn),i.x=o,i.y=a,i.z=r,this}makePerspective(t,e,i,s,o,a,r=Qn){const c=this.elements,l=2*o/(e-t),h=2*o/(i-s),u=(e+t)/(e-t),f=(i+s)/(i-s);let p,_;if(r===Qn)p=-(a+o)/(a-o),_=-2*a*o/(a-o);else if(r===Ar)p=-a/(a-o),_=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,o,a,r=Qn){const c=this.elements,l=1/(e-t),h=1/(i-s),u=1/(a-o),f=(e+t)*l,p=(i+s)*h;let _,g;if(r===Qn)_=(a+o)*u,g=-2*u;else if(r===Ar)_=o*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=g,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const ss=new X,Sn=new ae,sp=new X(0,0,0),op=new X(1,1,1),fi=new X,Bo=new X,sn=new X,Jl=new ae,Ql=new qi;class jr{constructor(t=0,e=0,i=0,s=jr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,o=s[0],a=s[4],r=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(ze(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,p));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Jl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jl,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ql.setFromEuler(this),this.setFromQuaternion(Ql,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}jr.DEFAULT_ORDER="XYZ";class sf{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rp=0;const th=new X,os=new qi,Xn=new ae,Go=new X,Qs=new X,ap=new X,cp=new qi,eh=new X(1,0,0),nh=new X(0,1,0),ih=new X(0,0,1),lp={type:"added"},hp={type:"removed"};class Re extends $i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rp++}),this.uuid=Hs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const t=new X,e=new jr,i=new qi,s=new X(1,1,1);function o(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Jt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.multiply(os),this}rotateOnWorldAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.premultiply(os),this}rotateX(t){return this.rotateOnAxis(eh,t)}rotateY(t){return this.rotateOnAxis(nh,t)}rotateZ(t){return this.rotateOnAxis(ih,t)}translateOnAxis(t,e){return th.copy(t).applyQuaternion(this.quaternion),this.position.add(th.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(eh,t)}translateY(t){return this.translateOnAxis(nh,t)}translateZ(t){return this.translateOnAxis(ih,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Go.copy(t):Go.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(Qs,Go,this.up):Xn.lookAt(Go,Qs,this.up),this.quaternion.setFromRotationMatrix(Xn),s&&(Xn.extractRotation(s.matrixWorld),os.setFromRotationMatrix(Xn),this.quaternion.premultiply(os.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(lp)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(hp)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Xn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,t,ap),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,cp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++){const o=e[i];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++){const r=s[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));s.material=r}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(o(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),_=a(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Re.DEFAULT_UP=new X(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new X,Yn=new X,Ma=new X,$n=new X,rs=new X,as=new X,sh=new X,ya=new X,va=new X,xa=new X;let Ho=!1;class Tn{constructor(t=new X,e=new X,i=new X){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),En.subVectors(t,e),s.cross(En);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,i,s,o){En.subVectors(s,e),Yn.subVectors(i,e),Ma.subVectors(t,e);const a=En.dot(En),r=En.dot(Yn),c=En.dot(Ma),l=Yn.dot(Yn),h=Yn.dot(Ma),u=a*l-r*r;if(u===0)return o.set(0,0,0),null;const f=1/u,p=(l*c-r*h)*f,_=(a*h-r*c)*f;return o.set(1-p-_,_,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getUV(t,e,i,s,o,a,r,c){return Ho===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ho=!0),this.getInterpolation(t,e,i,s,o,a,r,c)}static getInterpolation(t,e,i,s,o,a,r,c){return this.getBarycoord(t,e,i,s,$n)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,$n.x),c.addScaledVector(a,$n.y),c.addScaledVector(r,$n.z),c)}static isFrontFacing(t,e,i,s){return En.subVectors(i,e),Yn.subVectors(t,e),En.cross(Yn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),En.cross(Yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Tn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,o){return Ho===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ho=!0),Tn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}getInterpolation(t,e,i,s,o){return Tn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}containsPoint(t){return Tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,o=this.c;let a,r;rs.subVectors(s,i),as.subVectors(o,i),ya.subVectors(t,i);const c=rs.dot(ya),l=as.dot(ya);if(c<=0&&l<=0)return e.copy(i);va.subVectors(t,s);const h=rs.dot(va),u=as.dot(va);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(rs,a);xa.subVectors(t,o);const p=rs.dot(xa),_=as.dot(xa);if(_>=0&&p<=_)return e.copy(o);const g=p*l-c*_;if(g<=0&&l>=0&&_<=0)return r=l/(l-_),e.copy(i).addScaledVector(as,r);const d=h*_-p*u;if(d<=0&&u-h>=0&&p-_>=0)return sh.subVectors(o,s),r=(u-h)/(u-h+(p-_)),e.copy(s).addScaledVector(sh,r);const m=1/(d+g+f);return a=g*m,r=f*m,e.copy(i).addScaledVector(rs,a).addScaledVector(as,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const of={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},Vo={h:0,s:0,l:0};function ba(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=i,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ie.workingColorSpace){if(t=$0(t,1),e=ze(e,0,1),i=ze(i,0,1),e===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+e):i+e-i*e,a=2*i-o;this.r=ba(a,o,t+1/3),this.g=ba(a,o,t),this.b=ba(a,o,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=Ae){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){const i=of[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ts(t.r),this.g=Ts(t.g),this.b=Ts(t.b),this}copyLinearToSRGB(t){return this.r=ha(t.r),this.g=ha(t.g),this.b=ha(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return ie.fromWorkingColorSpace(je.copy(this),t),Math.round(ze(je.r*255,0,255))*65536+Math.round(ze(je.g*255,0,255))*256+Math.round(ze(je.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(je.copy(this),e);const i=je.r,s=je.g,o=je.b,a=Math.max(i,s,o),r=Math.min(i,s,o);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case i:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-i)/u+2;break;case o:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Ae){ie.fromWorkingColorSpace(je.copy(this),t);const e=je.r,i=je.g,s=je.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(di),this.setHSL(di.h+t,di.s+e,di.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(di),t.getHSL(Vo);const i=ca(di.h,Vo.h,e),s=ca(di.s,Vo.s,e),o=ca(di.l,Vo.l,e);return this.setHSL(i,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*i+o[6]*s,this.g=o[1]*e+o[4]*i+o[7]*s,this.b=o[2]*e+o[5]*i+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const je=new qt;qt.NAMES=of;let up=0;class Po extends $i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=Hs(),this.name="",this.type="Material",this.blending=Es,this.side=wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sc,this.blendDst=oc,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=wr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qi,this.stencilZFail=Qi,this.stencilZPass=Qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Es&&(i.blending=this.blending),this.side!==wi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sc&&(i.blendSrc=this.blendSrc),this.blendDst!==oc&&(i.blendDst=this.blendDst),this.blendEquation!==Ni&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==wr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Qi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Qi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(e){const o=s(t.textures),a=s(t.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=e[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Fi extends Po{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=zu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ee=new X,Wo=new Lt;class _e{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=jl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=yi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Wo.fromBufferAttribute(this,e),Wo.applyMatrix3(t),this.setXY(e,Wo.x,Wo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ks(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Je(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ks(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ks(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ks(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ks(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array),s=Je(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,o){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array),s=Je(s,this.array),o=Je(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==jl&&(t.usage=this.usage),t}}class Lo extends _e{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Co extends _e{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class fe extends _e{constructor(t,e,i){super(new Float32Array(t),e,i)}}let fp=0;const gn=new ae,wa=new Re,cs=new X,on=new An,to=new An,ke=new X;class Ge extends $i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=Hs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ju(t)?Co:Lo)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Jt().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return gn.makeRotationFromQuaternion(t),this.applyMatrix4(gn),this}rotateX(t){return gn.makeRotationX(t),this.applyMatrix4(gn),this}rotateY(t){return gn.makeRotationY(t),this.applyMatrix4(gn),this}rotateZ(t){return gn.makeRotationZ(t),this.applyMatrix4(gn),this}translate(t,e,i){return gn.makeTranslation(t,e,i),this.applyMatrix4(gn),this}scale(t,e,i){return gn.makeScale(t,e,i),this.applyMatrix4(gn),this}lookAt(t){return wa.lookAt(t),wa.updateMatrix(),this.applyMatrix4(wa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(t){const e=[];for(let i=0,s=t.length;i<s;i++){const o=t[i];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new fe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const o=e[i];on.setFromBufferAttribute(o),this.morphTargetsRelative?(ke.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(ke),ke.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(ke)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bc);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new X,1/0);return}if(t){const i=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];to.setFromBufferAttribute(r),this.morphTargetsRelative?(ke.addVectors(on.min,to.min),on.expandByPoint(ke),ke.addVectors(on.max,to.max),on.expandByPoint(ke)):(on.expandByPoint(to.min),on.expandByPoint(to.max))}on.getCenter(i);let s=0;for(let o=0,a=t.count;o<a;o++)ke.fromBufferAttribute(t,o),s=Math.max(s,i.distanceToSquared(ke));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)ke.fromBufferAttribute(r,l),c&&(cs.fromBufferAttribute(t,l),ke.add(cs)),s=Math.max(s,i.distanceToSquared(ke))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.array,s=e.position.array,o=e.normal.array,a=e.uv.array,r=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _e(new Float32Array(4*r),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let T=0;T<r;T++)l[T]=new X,h[T]=new X;const u=new X,f=new X,p=new X,_=new Lt,g=new Lt,d=new Lt,m=new X,y=new X;function M(T,C,R){u.fromArray(s,T*3),f.fromArray(s,C*3),p.fromArray(s,R*3),_.fromArray(a,T*2),g.fromArray(a,C*2),d.fromArray(a,R*2),f.sub(u),p.sub(u),g.sub(_),d.sub(_);const O=1/(g.x*d.y-d.x*g.y);isFinite(O)&&(m.copy(f).multiplyScalar(d.y).addScaledVector(p,-g.y).multiplyScalar(O),y.copy(p).multiplyScalar(g.x).addScaledVector(f,-d.x).multiplyScalar(O),l[T].add(m),l[C].add(m),l[R].add(m),h[T].add(y),h[C].add(y),h[R].add(y))}let v=this.groups;v.length===0&&(v=[{start:0,count:i.length}]);for(let T=0,C=v.length;T<C;++T){const R=v[T],O=R.start,A=R.count;for(let D=O,k=O+A;D<k;D+=3)M(i[D+0],i[D+1],i[D+2])}const x=new X,b=new X,w=new X,L=new X;function S(T){w.fromArray(o,T*3),L.copy(w);const C=l[T];x.copy(C),x.sub(w.multiplyScalar(w.dot(C))).normalize(),b.crossVectors(L,C);const O=b.dot(h[T])<0?-1:1;c[T*4]=x.x,c[T*4+1]=x.y,c[T*4+2]=x.z,c[T*4+3]=O}for(let T=0,C=v.length;T<C;++T){const R=v[T],O=R.start,A=R.count;for(let D=O,k=O+A;D<k;D+=3)S(i[D+0]),S(i[D+1]),S(i[D+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new _e(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const s=new X,o=new X,a=new X,r=new X,c=new X,l=new X,h=new X,u=new X;if(t)for(let f=0,p=t.count;f<p;f+=3){const _=t.getX(f+0),g=t.getX(f+1),d=t.getX(f+2);s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),a.fromBufferAttribute(e,d),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),r.fromBufferAttribute(i,_),c.fromBufferAttribute(i,g),l.fromBufferAttribute(i,d),r.add(h),c.add(h),l.add(h),i.setXYZ(_,r.x,r.y,r.z),i.setXYZ(g,c.x,c.y,c.z),i.setXYZ(d,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ke.fromBufferAttribute(t,e),ke.normalize(),t.setXYZ(e,ke.x,ke.y,ke.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,f=new l.constructor(c.length*h);let p=0,_=0;for(let g=0,d=c.length;g<d;g++){r.isInterleavedBufferAttribute?p=c[g]*r.data.stride+r.offset:p=c[g]*h;for(let m=0;m<h;m++)f[_++]=l[p++]}return new _e(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ge,i=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,i);e.setAttribute(r,l)}const o=this.morphAttributes;for(const r in o){const c=[],l=o[r];for(let h=0,u=l.length;h<u;h++){const f=l[h],p=t(f,i);c.push(p)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const oh=new ae,Li=new nf,jo=new Bc,rh=new X,ls=new X,hs=new X,us=new X,Sa=new X,qo=new X,Xo=new Lt,Yo=new Lt,$o=new Lt,ah=new X,ch=new X,lh=new X,Ko=new X,Zo=new X;class he extends Re{constructor(t=new Ge,e=new Fi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(o&&r){qo.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=r[c],u=o[c];h!==0&&(Sa.fromBufferAttribute(u,t),a?qo.addScaledVector(Sa,h):qo.addScaledVector(Sa.sub(e),h))}e.add(qo)}return e}raycast(t,e){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),jo.copy(i.boundingSphere),jo.applyMatrix4(o),Li.copy(t.ray).recast(t.near),!(jo.containsPoint(Li.origin)===!1&&(Li.intersectSphere(jo,rh)===null||Li.origin.distanceToSquared(rh)>(t.far-t.near)**2))&&(oh.copy(o).invert(),Li.copy(t.ray).applyMatrix4(oh),!(i.boundingBox!==null&&Li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Li)))}_computeIntersections(t,e,i){let s;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,p=o.drawRange;if(r!==null)if(Array.isArray(a))for(let _=0,g=f.length;_<g;_++){const d=f[_],m=a[d.materialIndex],y=Math.max(d.start,p.start),M=Math.min(r.count,Math.min(d.start+d.count,p.start+p.count));for(let v=y,x=M;v<x;v+=3){const b=r.getX(v),w=r.getX(v+1),L=r.getX(v+2);s=Jo(this,m,t,i,l,h,u,b,w,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=d.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(r.count,p.start+p.count);for(let d=_,m=g;d<m;d+=3){const y=r.getX(d),M=r.getX(d+1),v=r.getX(d+2);s=Jo(this,a,t,i,l,h,u,y,M,v),s&&(s.faceIndex=Math.floor(d/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,g=f.length;_<g;_++){const d=f[_],m=a[d.materialIndex],y=Math.max(d.start,p.start),M=Math.min(c.count,Math.min(d.start+d.count,p.start+p.count));for(let v=y,x=M;v<x;v+=3){const b=v,w=v+1,L=v+2;s=Jo(this,m,t,i,l,h,u,b,w,L),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=d.materialIndex,e.push(s))}}else{const _=Math.max(0,p.start),g=Math.min(c.count,p.start+p.count);for(let d=_,m=g;d<m;d+=3){const y=d,M=d+1,v=d+2;s=Jo(this,a,t,i,l,h,u,y,M,v),s&&(s.faceIndex=Math.floor(d/3),e.push(s))}}}}function dp(n,t,e,i,s,o,a,r){let c;if(t.side===Ye?c=i.intersectTriangle(a,o,s,!0,r):c=i.intersectTriangle(s,o,a,t.side===wi,r),c===null)return null;Zo.copy(r),Zo.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Zo);return l<e.near||l>e.far?null:{distance:l,point:Zo.clone(),object:n}}function Jo(n,t,e,i,s,o,a,r,c,l){n.getVertexPosition(r,ls),n.getVertexPosition(c,hs),n.getVertexPosition(l,us);const h=dp(n,t,e,i,ls,hs,us,Ko);if(h){s&&(Xo.fromBufferAttribute(s,r),Yo.fromBufferAttribute(s,c),$o.fromBufferAttribute(s,l),h.uv=Tn.getInterpolation(Ko,ls,hs,us,Xo,Yo,$o,new Lt)),o&&(Xo.fromBufferAttribute(o,r),Yo.fromBufferAttribute(o,c),$o.fromBufferAttribute(o,l),h.uv1=Tn.getInterpolation(Ko,ls,hs,us,Xo,Yo,$o,new Lt),h.uv2=h.uv1),a&&(ah.fromBufferAttribute(a,r),ch.fromBufferAttribute(a,c),lh.fromBufferAttribute(a,l),h.normal=Tn.getInterpolation(Ko,ls,hs,us,ah,ch,lh,new X),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:c,c:l,normal:new X,materialIndex:0};Tn.getNormal(ls,hs,us,u.normal),h.face=u}return h}class Vs extends Ge{constructor(t=1,e=1,i=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:o,depthSegments:a};const r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const c=[],l=[],h=[],u=[];let f=0,p=0;_("z","y","x",-1,-1,i,e,t,a,o,0),_("z","y","x",1,-1,i,e,-t,a,o,1),_("x","z","y",1,1,t,i,e,s,a,2),_("x","z","y",1,-1,t,i,-e,s,a,3),_("x","y","z",1,-1,t,e,i,s,o,4),_("x","y","z",-1,-1,t,e,-i,s,o,5),this.setIndex(c),this.setAttribute("position",new fe(l,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(u,2));function _(g,d,m,y,M,v,x,b,w,L,S){const T=v/w,C=x/L,R=v/2,O=x/2,A=b/2,D=w+1,k=L+1;let I=0,N=0;const z=new X;for(let q=0;q<k;q++){const Z=q*C-O;for(let Q=0;Q<D;Q++){const U=Q*T-R;z[g]=U*y,z[d]=Z*M,z[m]=A,l.push(z.x,z.y,z.z),z[g]=0,z[d]=0,z[m]=b>0?1:-1,h.push(z.x,z.y,z.z),u.push(Q/w),u.push(1-q/L),I+=1}}for(let q=0;q<L;q++)for(let Z=0;Z<w;Z++){const Q=f+Z+D*q,U=f+Z+D*(q+1),Y=f+(Z+1)+D*(q+1),G=f+(Z+1)+D*q;c.push(Q,U,G),c.push(U,Y,G),N+=6}r.addGroup(p,N,S),p+=N,f+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Us(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function $e(n){const t={};for(let e=0;e<n.length;e++){const i=Us(n[e]);for(const s in i)t[s]=i[s]}return t}function pp(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function rf(n){return n.getRenderTarget()===null?n.outputColorSpace:ie.workingColorSpace}const mp={clone:Us,merge:$e};var gp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_p=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xi extends Po{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gp,this.fragmentShader=_p,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Us(t.uniforms),this.uniformsGroups=pp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class af extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class an extends af{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Rr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(gr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Rr*2*Math.atan(Math.tan(gr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(gr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const fs=-90,ds=1;class Mp extends Re{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(fs,ds,t,e);s.layers=this.layers,this.add(s);const o=new an(fs,ds,t,e);o.layers=this.layers,this.add(o);const a=new an(fs,ds,t,e);a.layers=this.layers,this.add(a);const r=new an(fs,ds,t,e);r.layers=this.layers,this.add(r);const c=new an(fs,ds,t,e);c.layers=this.layers,this.add(c);const l=new an(fs,ds,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,o,a,r,c]=e;for(const l of e)this.remove(l);if(t===Qn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ar)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,o),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=g,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class cf extends Ke{constructor(t,e,i,s,o,a,r,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Cs,super(t,e,i,s,o,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class yp extends ji{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(ho("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Hi?Ae:cn),this.texture=new cf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Vs(5,5,5),o=new Xi({name:"CubemapFromEquirect",uniforms:Us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ye,blending:bi});o.uniforms.tEquirect.value=e;const a=new he(s,o),r=e.minFilter;return e.minFilter===Ds&&(e.minFilter=rn),new Mp(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(o)}}const Ea=new X,vp=new X,xp=new Jt;class _i{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Ea.subVectors(i,e).cross(vp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Ea),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||xp.getNormalMatrix(t),s=this.coplanarPoint(Ea).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ci=new Bc,Qo=new X;class Gc{constructor(t=new _i,e=new _i,i=new _i,s=new _i,o=new _i,a=new _i){this.planes=[t,e,i,s,o,a]}set(t,e,i,s,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Qn){const i=this.planes,s=t.elements,o=s[0],a=s[1],r=s[2],c=s[3],l=s[4],h=s[5],u=s[6],f=s[7],p=s[8],_=s[9],g=s[10],d=s[11],m=s[12],y=s[13],M=s[14],v=s[15];if(i[0].setComponents(c-o,f-l,d-p,v-m).normalize(),i[1].setComponents(c+o,f+l,d+p,v+m).normalize(),i[2].setComponents(c+a,f+h,d+_,v+y).normalize(),i[3].setComponents(c-a,f-h,d-_,v-y).normalize(),i[4].setComponents(c-r,f-u,d-g,v-M).normalize(),e===Qn)i[5].setComponents(c+r,f+u,d+g,v+M).normalize();else if(e===Ar)i[5].setComponents(r,u,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(t){return Ci.center.set(0,0,0),Ci.radius=.7071067811865476,Ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Qo.x=s.normal.x>0?t.max.x:t.min.x,Qo.y=s.normal.y>0?t.max.y:t.min.y,Qo.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Qo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function lf(){let n=null,t=!1,e=null,i=null;function s(o,a){e(o,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){n=o}}}function bp(n,t){const e=t.isWebGL2,i=new WeakMap;function s(l,h){const u=l.array,f=l.usage,p=u.byteLength,_=n.createBuffer();n.bindBuffer(h,_),n.bufferData(h,u,f),l.onUploadCallback();let g;if(u instanceof Float32Array)g=n.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)g=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)g=n.SHORT;else if(u instanceof Uint32Array)g=n.UNSIGNED_INT;else if(u instanceof Int32Array)g=n.INT;else if(u instanceof Int8Array)g=n.BYTE;else if(u instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:_,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:p}}function o(l,h,u){const f=h.array,p=h._updateRange,_=h.updateRanges;if(n.bindBuffer(u,l),p.count===-1&&_.length===0&&n.bufferSubData(u,0,f),_.length!==0){for(let g=0,d=_.length;g<d;g++){const m=_[g];e?n.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f,m.start,m.count):n.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f.subarray(m.start,m.start+m.count))}h.clearUpdateRanges()}p.count!==-1&&(e?n.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):n.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),i.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=i.get(l);h&&(n.deleteBuffer(h.buffer),i.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const f=i.get(l);(!f||f.version<l.version)&&i.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=i.get(l);if(u===void 0)i.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,l,h),u.version=l.version}}return{get:a,remove:r,update:c}}class As extends Ge{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const o=t/2,a=e/2,r=Math.floor(i),c=Math.floor(s),l=r+1,h=c+1,u=t/r,f=e/c,p=[],_=[],g=[],d=[];for(let m=0;m<h;m++){const y=m*f-a;for(let M=0;M<l;M++){const v=M*u-o;_.push(v,-y,0),g.push(0,0,1),d.push(M/r),d.push(1-m/c)}}for(let m=0;m<c;m++)for(let y=0;y<r;y++){const M=y+l*m,v=y+l*(m+1),x=y+1+l*(m+1),b=y+1+l*m;p.push(M,v,b),p.push(v,x,b)}this.setIndex(p),this.setAttribute("position",new fe(_,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new As(t.width,t.height,t.widthSegments,t.heightSegments)}}var wp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sp=`#ifdef USE_ALPHAHASH
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
#endif`,Ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ap=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Rp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Pp=`#ifdef USE_AOMAP
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
#endif`,Lp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cp=`#ifdef USE_BATCHING
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
#endif`,kp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Dp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ip=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Up=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Np=`#ifdef USE_IRIDESCENCE
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
#endif`,Fp=`#ifdef USE_BUMPMAP
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
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Gp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Wp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,jp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,qp=`#define PI 3.141592653589793
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
} // validated`,Xp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yp=`vec3 transformedNormal = objectNormal;
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
#endif`,$p=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Kp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qp="gl_FragColor = linearToOutputTexel( gl_FragColor );",tm=`
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
}`,em=`#ifdef USE_ENVMAP
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
#endif`,nm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,im=`#ifdef USE_ENVMAP
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
#endif`,sm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,om=`#ifdef USE_ENVMAP
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
#endif`,rm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,am=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,cm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,lm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hm=`#ifdef USE_GRADIENTMAP
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
}`,um=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,fm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,pm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,mm=`uniform bool receiveShadow;
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
#endif`,gm=`#ifdef USE_ENVMAP
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
#endif`,_m=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ym=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xm=`PhysicalMaterial material;
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
#endif`,bm=`struct PhysicalMaterial {
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
}`,wm=`
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
#endif`,Sm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Em=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Tm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Am=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Rm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Pm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Lm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,km=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Dm=`#if defined( USE_POINTS_UV )
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
#endif`,Im=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Um=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Nm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Fm=`#ifdef USE_MORPHNORMALS
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
#endif`,Om=`#ifdef USE_MORPHTARGETS
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
#endif`,zm=`#ifdef USE_MORPHTARGETS
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
#endif`,Bm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Gm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,jm=`#ifdef USE_NORMALMAP
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
#endif`,qm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ym=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$m=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Km=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Jm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Qm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,eg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ng=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ig=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,og=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,rg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ag=`float getShadowMask() {
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
}`,cg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,lg=`#ifdef USE_SKINNING
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
#endif`,hg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ug=`#ifdef USE_SKINNING
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
#endif`,fg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,pg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,mg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,gg=`#ifdef USE_TRANSMISSION
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
#endif`,_g=`#ifdef USE_TRANSMISSION
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
#endif`,Mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const bg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wg=`uniform sampler2D t2D;
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
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ag=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`#include <common>
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
}`,Pg=`#if DEPTH_PACKING == 3200
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
}`,Lg=`#define DISTANCE
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
}`,Cg=`#define DISTANCE
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
}`,kg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Dg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ig=`uniform float scale;
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
}`,Ug=`uniform vec3 diffuse;
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
}`,Ng=`#include <common>
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
}`,Fg=`uniform vec3 diffuse;
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
}`,Og=`#define LAMBERT
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
}`,zg=`#define LAMBERT
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
}`,Bg=`#define MATCAP
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
}`,Gg=`#define MATCAP
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
}`,Hg=`#define NORMAL
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
}`,Vg=`#define NORMAL
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
}`,Wg=`#define PHONG
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
}`,jg=`#define PHONG
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
}`,qg=`#define STANDARD
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
}`,Xg=`#define STANDARD
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
}`,Yg=`#define TOON
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
}`,$g=`#define TOON
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
}`,Kg=`uniform float size;
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
}`,Zg=`uniform vec3 diffuse;
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
}`,Jg=`#include <common>
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
}`,Qg=`uniform vec3 color;
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
}`,t1=`uniform float rotation;
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
}`,e1=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:wp,alphahash_pars_fragment:Sp,alphamap_fragment:Ep,alphamap_pars_fragment:Tp,alphatest_fragment:Ap,alphatest_pars_fragment:Rp,aomap_fragment:Pp,aomap_pars_fragment:Lp,batching_pars_vertex:Cp,batching_vertex:kp,begin_vertex:Dp,beginnormal_vertex:Ip,bsdfs:Up,iridescence_fragment:Np,bumpmap_pars_fragment:Fp,clipping_planes_fragment:Op,clipping_planes_pars_fragment:zp,clipping_planes_pars_vertex:Bp,clipping_planes_vertex:Gp,color_fragment:Hp,color_pars_fragment:Vp,color_pars_vertex:Wp,color_vertex:jp,common:qp,cube_uv_reflection_fragment:Xp,defaultnormal_vertex:Yp,displacementmap_pars_vertex:$p,displacementmap_vertex:Kp,emissivemap_fragment:Zp,emissivemap_pars_fragment:Jp,colorspace_fragment:Qp,colorspace_pars_fragment:tm,envmap_fragment:em,envmap_common_pars_fragment:nm,envmap_pars_fragment:im,envmap_pars_vertex:sm,envmap_physical_pars_fragment:gm,envmap_vertex:om,fog_vertex:rm,fog_pars_vertex:am,fog_fragment:cm,fog_pars_fragment:lm,gradientmap_pars_fragment:hm,lightmap_fragment:um,lightmap_pars_fragment:fm,lights_lambert_fragment:dm,lights_lambert_pars_fragment:pm,lights_pars_begin:mm,lights_toon_fragment:_m,lights_toon_pars_fragment:Mm,lights_phong_fragment:ym,lights_phong_pars_fragment:vm,lights_physical_fragment:xm,lights_physical_pars_fragment:bm,lights_fragment_begin:wm,lights_fragment_maps:Sm,lights_fragment_end:Em,logdepthbuf_fragment:Tm,logdepthbuf_pars_fragment:Am,logdepthbuf_pars_vertex:Rm,logdepthbuf_vertex:Pm,map_fragment:Lm,map_pars_fragment:Cm,map_particle_fragment:km,map_particle_pars_fragment:Dm,metalnessmap_fragment:Im,metalnessmap_pars_fragment:Um,morphcolor_vertex:Nm,morphnormal_vertex:Fm,morphtarget_pars_vertex:Om,morphtarget_vertex:zm,normal_fragment_begin:Bm,normal_fragment_maps:Gm,normal_pars_fragment:Hm,normal_pars_vertex:Vm,normal_vertex:Wm,normalmap_pars_fragment:jm,clearcoat_normal_fragment_begin:qm,clearcoat_normal_fragment_maps:Xm,clearcoat_pars_fragment:Ym,iridescence_pars_fragment:$m,opaque_fragment:Km,packing:Zm,premultiplied_alpha_fragment:Jm,project_vertex:Qm,dithering_fragment:tg,dithering_pars_fragment:eg,roughnessmap_fragment:ng,roughnessmap_pars_fragment:ig,shadowmap_pars_fragment:sg,shadowmap_pars_vertex:og,shadowmap_vertex:rg,shadowmask_pars_fragment:ag,skinbase_vertex:cg,skinning_pars_vertex:lg,skinning_vertex:hg,skinnormal_vertex:ug,specularmap_fragment:fg,specularmap_pars_fragment:dg,tonemapping_fragment:pg,tonemapping_pars_fragment:mg,transmission_fragment:gg,transmission_pars_fragment:_g,uv_pars_fragment:Mg,uv_pars_vertex:yg,uv_vertex:vg,worldpos_vertex:xg,background_vert:bg,background_frag:wg,backgroundCube_vert:Sg,backgroundCube_frag:Eg,cube_vert:Tg,cube_frag:Ag,depth_vert:Rg,depth_frag:Pg,distanceRGBA_vert:Lg,distanceRGBA_frag:Cg,equirect_vert:kg,equirect_frag:Dg,linedashed_vert:Ig,linedashed_frag:Ug,meshbasic_vert:Ng,meshbasic_frag:Fg,meshlambert_vert:Og,meshlambert_frag:zg,meshmatcap_vert:Bg,meshmatcap_frag:Gg,meshnormal_vert:Hg,meshnormal_frag:Vg,meshphong_vert:Wg,meshphong_frag:jg,meshphysical_vert:qg,meshphysical_frag:Xg,meshtoon_vert:Yg,meshtoon_frag:$g,points_vert:Kg,points_frag:Zg,shadow_vert:Jg,shadow_frag:Qg,sprite_vert:t1,sprite_frag:e1},Dt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Dn={basic:{uniforms:$e([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:$e([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:$e([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:$e([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:$e([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:$e([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:$e([Dt.points,Dt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:$e([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:$e([Dt.common,Dt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:$e([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:$e([Dt.sprite,Dt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:$e([Dt.common,Dt.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:$e([Dt.lights,Dt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Dn.physical={uniforms:$e([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const tr={r:0,b:0,g:0};function n1(n,t,e,i,s,o,a){const r=new qt(0);let c=o===!0?0:1,l,h,u=null,f=0,p=null;function _(d,m){let y=!1,M=m.isScene===!0?m.background:null;M&&M.isTexture&&(M=(m.backgroundBlurriness>0?e:t).get(M)),M===null?g(r,c):M&&M.isColor&&(g(M,1),y=!0);const v=n.xr.getEnvironmentBlendMode();v==="additive"?i.buffers.color.setClear(0,0,0,1,a):v==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Vr)?(h===void 0&&(h=new he(new Vs(1,1,1),new Xi({name:"BackgroundCubeMaterial",uniforms:Us(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(x,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,h.material.toneMapped=ie.getTransfer(M.colorSpace)!==ce,(u!==M||f!==M.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,p=n.toneMapping),h.layers.enableAll(),d.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new he(new As(2,2),new Xi({name:"BackgroundMaterial",uniforms:Us(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:wi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,l.material.toneMapped=ie.getTransfer(M.colorSpace)!==ce,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,p=n.toneMapping),l.layers.enableAll(),d.unshift(l,l.geometry,l.material,0,0,null))}function g(d,m){d.getRGB(tr,rf(n)),i.buffers.color.setClear(tr.r,tr.g,tr.b,m,a)}return{getClearColor:function(){return r},setClearColor:function(d,m=1){r.set(d),c=m,g(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(d){c=d,g(r,c)},render:_}}function i1(n,t,e,i){const s=n.getParameter(n.MAX_VERTEX_ATTRIBS),o=i.isWebGL2?null:t.get("OES_vertex_array_object"),a=i.isWebGL2||o!==null,r={},c=d(null);let l=c,h=!1;function u(A,D,k,I,N){let z=!1;if(a){const q=g(I,k,D);l!==q&&(l=q,p(l.object)),z=m(A,I,k,N),z&&y(A,I,k,N)}else{const q=D.wireframe===!0;(l.geometry!==I.id||l.program!==k.id||l.wireframe!==q)&&(l.geometry=I.id,l.program=k.id,l.wireframe=q,z=!0)}N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(z||h)&&(h=!1,L(A,D,k,I),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function f(){return i.isWebGL2?n.createVertexArray():o.createVertexArrayOES()}function p(A){return i.isWebGL2?n.bindVertexArray(A):o.bindVertexArrayOES(A)}function _(A){return i.isWebGL2?n.deleteVertexArray(A):o.deleteVertexArrayOES(A)}function g(A,D,k){const I=k.wireframe===!0;let N=r[A.id];N===void 0&&(N={},r[A.id]=N);let z=N[D.id];z===void 0&&(z={},N[D.id]=z);let q=z[I];return q===void 0&&(q=d(f()),z[I]=q),q}function d(A){const D=[],k=[],I=[];for(let N=0;N<s;N++)D[N]=0,k[N]=0,I[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:k,attributeDivisors:I,object:A,attributes:{},index:null}}function m(A,D,k,I){const N=l.attributes,z=D.attributes;let q=0;const Z=k.getAttributes();for(const Q in Z)if(Z[Q].location>=0){const Y=N[Q];let G=z[Q];if(G===void 0&&(Q==="instanceMatrix"&&A.instanceMatrix&&(G=A.instanceMatrix),Q==="instanceColor"&&A.instanceColor&&(G=A.instanceColor)),Y===void 0||Y.attribute!==G||G&&Y.data!==G.data)return!0;q++}return l.attributesNum!==q||l.index!==I}function y(A,D,k,I){const N={},z=D.attributes;let q=0;const Z=k.getAttributes();for(const Q in Z)if(Z[Q].location>=0){let Y=z[Q];Y===void 0&&(Q==="instanceMatrix"&&A.instanceMatrix&&(Y=A.instanceMatrix),Q==="instanceColor"&&A.instanceColor&&(Y=A.instanceColor));const G={};G.attribute=Y,Y&&Y.data&&(G.data=Y.data),N[Q]=G,q++}l.attributes=N,l.attributesNum=q,l.index=I}function M(){const A=l.newAttributes;for(let D=0,k=A.length;D<k;D++)A[D]=0}function v(A){x(A,0)}function x(A,D){const k=l.newAttributes,I=l.enabledAttributes,N=l.attributeDivisors;k[A]=1,I[A]===0&&(n.enableVertexAttribArray(A),I[A]=1),N[A]!==D&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](A,D),N[A]=D)}function b(){const A=l.newAttributes,D=l.enabledAttributes;for(let k=0,I=D.length;k<I;k++)D[k]!==A[k]&&(n.disableVertexAttribArray(k),D[k]=0)}function w(A,D,k,I,N,z,q){q===!0?n.vertexAttribIPointer(A,D,k,N,z):n.vertexAttribPointer(A,D,k,I,N,z)}function L(A,D,k,I){if(i.isWebGL2===!1&&(A.isInstancedMesh||I.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const N=I.attributes,z=k.getAttributes(),q=D.defaultAttributeValues;for(const Z in z){const Q=z[Z];if(Q.location>=0){let U=N[Z];if(U===void 0&&(Z==="instanceMatrix"&&A.instanceMatrix&&(U=A.instanceMatrix),Z==="instanceColor"&&A.instanceColor&&(U=A.instanceColor)),U!==void 0){const Y=U.normalized,G=U.itemSize,$=e.get(U);if($===void 0)continue;const J=$.buffer,it=$.type,ot=$.bytesPerElement,ct=i.isWebGL2===!0&&(it===n.INT||it===n.UNSIGNED_INT||U.gpuType===Hu);if(U.isInterleavedBufferAttribute){const K=U.data,F=K.stride,B=U.offset;if(K.isInstancedInterleavedBuffer){for(let W=0;W<Q.locationSize;W++)x(Q.location+W,K.meshPerAttribute);A.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let W=0;W<Q.locationSize;W++)v(Q.location+W);n.bindBuffer(n.ARRAY_BUFFER,J);for(let W=0;W<Q.locationSize;W++)w(Q.location+W,G/Q.locationSize,it,Y,F*ot,(B+G/Q.locationSize*W)*ot,ct)}else{if(U.isInstancedBufferAttribute){for(let K=0;K<Q.locationSize;K++)x(Q.location+K,U.meshPerAttribute);A.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=U.meshPerAttribute*U.count)}else for(let K=0;K<Q.locationSize;K++)v(Q.location+K);n.bindBuffer(n.ARRAY_BUFFER,J);for(let K=0;K<Q.locationSize;K++)w(Q.location+K,G/Q.locationSize,it,Y,G*ot,G/Q.locationSize*K*ot,ct)}}else if(q!==void 0){const Y=q[Z];if(Y!==void 0)switch(Y.length){case 2:n.vertexAttrib2fv(Q.location,Y);break;case 3:n.vertexAttrib3fv(Q.location,Y);break;case 4:n.vertexAttrib4fv(Q.location,Y);break;default:n.vertexAttrib1fv(Q.location,Y)}}}}b()}function S(){R();for(const A in r){const D=r[A];for(const k in D){const I=D[k];for(const N in I)_(I[N].object),delete I[N];delete D[k]}delete r[A]}}function T(A){if(r[A.id]===void 0)return;const D=r[A.id];for(const k in D){const I=D[k];for(const N in I)_(I[N].object),delete I[N];delete D[k]}delete r[A.id]}function C(A){for(const D in r){const k=r[D];if(k[A.id]===void 0)continue;const I=k[A.id];for(const N in I)_(I[N].object),delete I[N];delete k[A.id]}}function R(){O(),h=!0,l!==c&&(l=c,p(l.object))}function O(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:R,resetDefaultState:O,dispose:S,releaseStatesOfGeometry:T,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:v,disableUnusedAttributes:b}}function s1(n,t,e,i){const s=i.isWebGL2;let o;function a(h){o=h}function r(h,u){n.drawArrays(o,h,u),e.update(u,o,1)}function c(h,u,f){if(f===0)return;let p,_;if(s)p=n,_="drawArraysInstanced";else if(p=t.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[_](o,h,u,f),e.update(u,o,f)}function l(h,u,f){if(f===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<f;_++)this.render(h[_],u[_]);else{p.multiDrawArraysWEBGL(o,h,0,u,0,f);let _=0;for(let g=0;g<f;g++)_+=u[g];e.update(_,o,1)}}this.setMode=a,this.render=r,this.renderInstances=c,this.renderMultiDraw=l}function o1(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const c=o(r);c!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",c,"instead."),r=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),_=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),d=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),m=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,v=a||t.has("OES_texture_float"),x=M&&v,b=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:d,maxVaryings:m,maxFragmentUniforms:y,vertexTextures:M,floatFragmentTextures:v,floatVertexTextures:x,maxSamples:b}}function r1(n){const t=this;let e=null,i=0,s=!1,o=!1;const a=new _i,r=new Jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||i!==0||s;return s=f,i=u.length,p},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const _=u.clippingPlanes,g=u.clipIntersection,d=u.clipShadows,m=n.get(u);if(!s||_===null||_.length===0||o&&!d)o?h(null):l();else{const y=o?0:i,M=y*4;let v=m.clippingState||null;c.value=v,v=h(_,f,M,p);for(let x=0;x!==M;++x)v[x]=e[x];m.clippingState=v,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,p,_){const g=u!==null?u.length:0;let d=null;if(g!==0){if(d=c.value,_!==!0||d===null){const m=p+g*4,y=f.matrixWorldInverse;r.getNormalMatrix(y),(d===null||d.length<m)&&(d=new Float32Array(m));for(let M=0,v=p;M!==g;++M,v+=4)a.copy(u[M]).applyMatrix4(y,r),a.normal.toArray(d,v),d[v+3]=a.constant}c.value=d,c.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,d}}function a1(n){let t=new WeakMap;function e(a,r){return r===rc?a.mapping=Cs:r===ac&&(a.mapping=ks),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===rc||r===ac)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new yp(c.height/2);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}class hf extends af{constructor(t=-1,e=1,i=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-t,a=i+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const vs=4,hh=[.125,.215,.35,.446,.526,.582],Oi=20,Ta=new hf,uh=new qt;let Aa=null,Ra=0,Pa=0;const Ui=(1+Math.sqrt(5))/2,ps=1/Ui,fh=[new X(1,1,1),new X(-1,1,1),new X(1,1,-1),new X(-1,1,-1),new X(0,Ui,ps),new X(0,Ui,-ps),new X(ps,0,Ui),new X(-ps,0,Ui),new X(Ui,ps,0),new X(-Ui,ps,0)];class fc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Aa=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,i,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ph(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Aa,Ra,Pa),t.scissorTest=!1,er(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Cs||t.mapping===ks?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Aa=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel();const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:Mo,format:Mn,colorSpace:oi,depthBuffer:!1},s=dh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dh(t,e,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=c1(o)),this._blurMaterial=l1(o,t,e)}return s}_compileMaterial(t){const e=new he(this._lodPlanes[0],t);this._renderer.compile(e,Ta)}_sceneToCubeUV(t,e,i,s){const r=new an(90,1,e,i),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(uh),h.toneMapping=ti,h.autoClear=!1;const p=new Fi({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1}),_=new he(new Vs,p);let g=!1;const d=t.background;d?d.isColor&&(p.color.copy(d),t.background=null,g=!0):(p.color.copy(uh),g=!0);for(let m=0;m<6;m++){const y=m%3;y===0?(r.up.set(0,c[m],0),r.lookAt(l[m],0,0)):y===1?(r.up.set(0,0,c[m]),r.lookAt(0,l[m],0)):(r.up.set(0,c[m],0),r.lookAt(0,0,l[m]));const M=this._cubeSize;er(s,y*M,m>2?M:0,M,M),h.setRenderTarget(s),g&&h.render(_,r),h.render(t,r)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=d}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Cs||t.mapping===ks;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=mh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ph());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new he(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const c=this._cubeSize;er(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,Ta)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=fh[(s-1)%fh.length];this._blur(t,s-1,s,o,a)}e.autoClear=i}_blur(t,e,i,s,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",o),this._halfBlur(a,t,i,i,s,"longitudinal",o)}_halfBlur(t,e,i,s,o,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new he(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[i]-1,_=isFinite(o)?Math.PI/(2*p):2*Math.PI/(2*Oi-1),g=o/_,d=isFinite(o)?1+Math.floor(h*g):Oi;d>Oi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${Oi}`);const m=[];let y=0;for(let w=0;w<Oi;++w){const L=w/g,S=Math.exp(-L*L/2);m.push(S),w===0?y+=S:w<d&&(y+=2*S)}for(let w=0;w<m.length;w++)m[w]=m[w]/y;f.envMap.value=t.texture,f.samples.value=d,f.weights.value=m,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:M}=this;f.dTheta.value=_,f.mipInt.value=M-i;const v=this._sizeLods[s],x=3*v*(s>M-vs?s-M+vs:0),b=4*(this._cubeSize-v);er(e,x,b,3*v,2*v),c.setRenderTarget(e),c.render(u,Ta)}}function c1(n){const t=[],e=[],i=[];let s=n;const o=n-vs+1+hh.length;for(let a=0;a<o;a++){const r=Math.pow(2,s);e.push(r);let c=1/r;a>n-vs?c=hh[a-n+vs-1]:a===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,_=6,g=3,d=2,m=1,y=new Float32Array(g*_*p),M=new Float32Array(d*_*p),v=new Float32Array(m*_*p);for(let b=0;b<p;b++){const w=b%3*2/3-1,L=b>2?0:-1,S=[w,L,0,w+2/3,L,0,w+2/3,L+1,0,w,L,0,w+2/3,L+1,0,w,L+1,0];y.set(S,g*_*b),M.set(f,d*_*b);const T=[b,b,b,b,b,b];v.set(T,m*_*b)}const x=new Ge;x.setAttribute("position",new _e(y,g)),x.setAttribute("uv",new _e(M,d)),x.setAttribute("faceIndex",new _e(v,m)),t.push(x),s>vs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function dh(n,t,e){const i=new ji(n,t,e);return i.texture.mapping=Vr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function er(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function l1(n,t,e){const i=new Float32Array(Oi),s=new X(0,1,0);return new Xi({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Hc(),fragmentShader:`

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
		`,blending:bi,depthTest:!1,depthWrite:!1})}function ph(){return new Xi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hc(),fragmentShader:`

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
		`,blending:bi,depthTest:!1,depthWrite:!1})}function mh(){return new Xi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bi,depthTest:!1,depthWrite:!1})}function Hc(){return`

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
	`}function h1(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===rc||c===ac,h=c===Cs||c===ks;if(l||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new fc(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new fc(n));const f=l?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,f),r.addEventListener("dispose",o),f.texture}else return null}}}return r}function s(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function o(r){const c=r.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function u1(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){const s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function f1(n,t,e,i){const s={},o=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const _ in f.attributes)t.remove(f.attributes[_]);for(const _ in f.morphAttributes){const g=f.morphAttributes[_];for(let d=0,m=g.length;d<m;d++)t.remove(g[d])}f.removeEventListener("dispose",a),delete s[f.id];const p=o.get(f);p&&(t.remove(p),o.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function r(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const _ in f)t.update(f[_],n.ARRAY_BUFFER);const p=u.morphAttributes;for(const _ in p){const g=p[_];for(let d=0,m=g.length;d<m;d++)t.update(g[d],n.ARRAY_BUFFER)}}function l(u){const f=[],p=u.index,_=u.attributes.position;let g=0;if(p!==null){const y=p.array;g=p.version;for(let M=0,v=y.length;M<v;M+=3){const x=y[M+0],b=y[M+1],w=y[M+2];f.push(x,b,b,w,w,x)}}else if(_!==void 0){const y=_.array;g=_.version;for(let M=0,v=y.length/3-1;M<v;M+=3){const x=M+0,b=M+1,w=M+2;f.push(x,b,b,w,w,x)}}else return;const d=new(Ju(f)?Co:Lo)(f,1);d.version=g;const m=o.get(u);m&&t.remove(m),o.set(u,d)}function h(u){const f=o.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return o.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function d1(n,t,e,i){const s=i.isWebGL2;let o;function a(p){o=p}let r,c;function l(p){r=p.type,c=p.bytesPerElement}function h(p,_){n.drawElements(o,_,r,p*c),e.update(_,o,1)}function u(p,_,g){if(g===0)return;let d,m;if(s)d=n,m="drawElementsInstanced";else if(d=t.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",d===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[m](o,_,r,p*c,g),e.update(_,o,g)}function f(p,_,g){if(g===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<g;m++)this.render(p[m]/c,_[m]);else{d.multiDrawElementsWEBGL(o,_,0,r,p,0,g);let m=0;for(let y=0;y<g;y++)m+=_[y];e.update(m,o,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function p1(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,r){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=r*(o/3);break;case n.LINES:e.lines+=r*(o/2);break;case n.LINE_STRIP:e.lines+=r*(o-1);break;case n.LINE_LOOP:e.lines+=r*o;break;case n.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function m1(n,t){return n[0]-t[0]}function g1(n,t){return Math.abs(t[1])-Math.abs(n[1])}function _1(n,t,e){const i={},s=new Float32Array(8),o=new WeakMap,a=new De,r=[];for(let l=0;l<8;l++)r[l]=[l,0];function c(l,h,u){const f=l.morphTargetInfluences;if(t.isWebGL2===!0){const p=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=p!==void 0?p.length:0;let g=o.get(h);if(g===void 0||g.count!==_){let A=function(){R.dispose(),o.delete(h),h.removeEventListener("dispose",A)};g!==void 0&&g.texture.dispose();const y=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,v=h.morphAttributes.color!==void 0,x=h.morphAttributes.position||[],b=h.morphAttributes.normal||[],w=h.morphAttributes.color||[];let L=0;y===!0&&(L=1),M===!0&&(L=2),v===!0&&(L=3);let S=h.attributes.position.count*L,T=1;S>t.maxTextureSize&&(T=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const C=new Float32Array(S*T*4*_),R=new ef(C,S,T,_);R.type=yi,R.needsUpdate=!0;const O=L*4;for(let D=0;D<_;D++){const k=x[D],I=b[D],N=w[D],z=S*T*4*D;for(let q=0;q<k.count;q++){const Z=q*O;y===!0&&(a.fromBufferAttribute(k,q),C[z+Z+0]=a.x,C[z+Z+1]=a.y,C[z+Z+2]=a.z,C[z+Z+3]=0),M===!0&&(a.fromBufferAttribute(I,q),C[z+Z+4]=a.x,C[z+Z+5]=a.y,C[z+Z+6]=a.z,C[z+Z+7]=0),v===!0&&(a.fromBufferAttribute(N,q),C[z+Z+8]=a.x,C[z+Z+9]=a.y,C[z+Z+10]=a.z,C[z+Z+11]=N.itemSize===4?a.w:1)}}g={count:_,texture:R,size:new Lt(S,T)},o.set(h,g),h.addEventListener("dispose",A)}let d=0;for(let y=0;y<f.length;y++)d+=f[y];const m=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(n,"morphTargetBaseInfluence",m),u.getUniforms().setValue(n,"morphTargetInfluences",f),u.getUniforms().setValue(n,"morphTargetsTexture",g.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",g.size)}else{const p=f===void 0?0:f.length;let _=i[h.id];if(_===void 0||_.length!==p){_=[];for(let M=0;M<p;M++)_[M]=[M,0];i[h.id]=_}for(let M=0;M<p;M++){const v=_[M];v[0]=M,v[1]=f[M]}_.sort(g1);for(let M=0;M<8;M++)M<p&&_[M][1]?(r[M][0]=_[M][0],r[M][1]=_[M][1]):(r[M][0]=Number.MAX_SAFE_INTEGER,r[M][1]=0);r.sort(m1);const g=h.morphAttributes.position,d=h.morphAttributes.normal;let m=0;for(let M=0;M<8;M++){const v=r[M],x=v[0],b=v[1];x!==Number.MAX_SAFE_INTEGER&&b?(g&&h.getAttribute("morphTarget"+M)!==g[x]&&h.setAttribute("morphTarget"+M,g[x]),d&&h.getAttribute("morphNormal"+M)!==d[x]&&h.setAttribute("morphNormal"+M,d[x]),s[M]=b,m+=b):(g&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),d&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),s[M]=0)}const y=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(n,"morphTargetBaseInfluence",y),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:c}}function M1(n,t,e,i){let s=new WeakMap;function o(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:a}}class uf extends Ke{constructor(t,e,i,s,o,a,r,c,l,h){if(h=h!==void 0?h:Gi,h!==Gi&&h!==Is)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Gi&&(i=Mi),i===void 0&&h===Is&&(i=Bi),super(null,s,o,a,r,c,h,i,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Oe,this.minFilter=c!==void 0?c:Oe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ff=new Ke,df=new uf(1,1);df.compareFunction=Zu;const pf=new ef,mf=new np,gf=new cf,gh=[],_h=[],Mh=new Float32Array(16),yh=new Float32Array(9),vh=new Float32Array(4);function Ws(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let o=gh[s];if(o===void 0&&(o=new Float32Array(s),gh[s]=o),t!==0){i.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,n[a].toArray(o,r)}return o}function Pe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Le(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function qr(n,t){let e=_h[t];e===void 0&&(e=new Int32Array(t),_h[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function y1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function v1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2fv(this.addr,t),Le(e,t)}}function x1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;n.uniform3fv(this.addr,t),Le(e,t)}}function b1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4fv(this.addr,t),Le(e,t)}}function w1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;vh.set(i),n.uniformMatrix2fv(this.addr,!1,vh),Le(e,i)}}function S1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;yh.set(i),n.uniformMatrix3fv(this.addr,!1,yh),Le(e,i)}}function E1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;Mh.set(i),n.uniformMatrix4fv(this.addr,!1,Mh),Le(e,i)}}function T1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function A1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2iv(this.addr,t),Le(e,t)}}function R1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3iv(this.addr,t),Le(e,t)}}function P1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4iv(this.addr,t),Le(e,t)}}function L1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function C1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2uiv(this.addr,t),Le(e,t)}}function k1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3uiv(this.addr,t),Le(e,t)}}function D1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4uiv(this.addr,t),Le(e,t)}}function I1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const o=this.type===n.SAMPLER_2D_SHADOW?df:ff;e.setTexture2D(t||o,s)}function U1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||mf,s)}function N1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||gf,s)}function F1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||pf,s)}function O1(n){switch(n){case 5126:return y1;case 35664:return v1;case 35665:return x1;case 35666:return b1;case 35674:return w1;case 35675:return S1;case 35676:return E1;case 5124:case 35670:return T1;case 35667:case 35671:return A1;case 35668:case 35672:return R1;case 35669:case 35673:return P1;case 5125:return L1;case 36294:return C1;case 36295:return k1;case 36296:return D1;case 35678:case 36198:case 36298:case 36306:case 35682:return I1;case 35679:case 36299:case 36307:return U1;case 35680:case 36300:case 36308:case 36293:return N1;case 36289:case 36303:case 36311:case 36292:return F1}}function z1(n,t){n.uniform1fv(this.addr,t)}function B1(n,t){const e=Ws(t,this.size,2);n.uniform2fv(this.addr,e)}function G1(n,t){const e=Ws(t,this.size,3);n.uniform3fv(this.addr,e)}function H1(n,t){const e=Ws(t,this.size,4);n.uniform4fv(this.addr,e)}function V1(n,t){const e=Ws(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function W1(n,t){const e=Ws(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function j1(n,t){const e=Ws(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function q1(n,t){n.uniform1iv(this.addr,t)}function X1(n,t){n.uniform2iv(this.addr,t)}function Y1(n,t){n.uniform3iv(this.addr,t)}function $1(n,t){n.uniform4iv(this.addr,t)}function K1(n,t){n.uniform1uiv(this.addr,t)}function Z1(n,t){n.uniform2uiv(this.addr,t)}function J1(n,t){n.uniform3uiv(this.addr,t)}function Q1(n,t){n.uniform4uiv(this.addr,t)}function t_(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||ff,o[a])}function e_(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||mf,o[a])}function n_(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||gf,o[a])}function i_(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||pf,o[a])}function s_(n){switch(n){case 5126:return z1;case 35664:return B1;case 35665:return G1;case 35666:return H1;case 35674:return V1;case 35675:return W1;case 35676:return j1;case 5124:case 35670:return q1;case 35667:case 35671:return X1;case 35668:case 35672:return Y1;case 35669:case 35673:return $1;case 5125:return K1;case 36294:return Z1;case 36295:return J1;case 36296:return Q1;case 35678:case 36198:case 36298:case 36306:case 35682:return t_;case 35679:case 36299:case 36307:return e_;case 35680:case 36300:case 36308:case 36293:return n_;case 36289:case 36303:case 36311:case 36292:return i_}}class o_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=O1(e.type)}}class r_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=s_(e.type)}}class a_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const r=s[o];r.setValue(t,e[r.id],i)}}}const La=/(\w+)(\])?(\[|\.)?/g;function xh(n,t){n.seq.push(t),n.map[t.id]=t}function c_(n,t,e){const i=n.name,s=i.length;for(La.lastIndex=0;;){const o=La.exec(i),a=La.lastIndex;let r=o[1];const c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===s){xh(e,l===void 0?new o_(r,n,t):new r_(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new a_(r),xh(e,u)),e=u}}}class _r{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=t.getActiveUniform(e,s),a=t.getUniformLocation(e,o.name);c_(o,a,this)}}setValue(t,e,i,s){const o=this.map[e];o!==void 0&&o.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let o=0,a=e.length;o!==a;++o){const r=e[o],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,o=t.length;s!==o;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function bh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const l_=37297;let h_=0;function u_(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=s;a<o;a++){const r=a+1;i.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return i.join(`
`)}function f_(n){const t=ie.getPrimaries(ie.workingColorSpace),e=ie.getPrimaries(n);let i;switch(t===e?i="":t===Tr&&e===Er?i="LinearDisplayP3ToLinearSRGB":t===Er&&e===Tr&&(i="LinearSRGBToLinearDisplayP3"),n){case oi:case Wr:return[i,"LinearTransferOETF"];case Ae:case zc:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function wh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+u_(n.getShaderSource(t),a)}else return s}function d_(n,t){const e=f_(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function p_(n,t){let e;switch(t){case E0:e="Linear";break;case T0:e="Reinhard";break;case A0:e="OptimizedCineon";break;case Bu:e="ACESFilmic";break;case P0:e="AgX";break;case R0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function m_(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xs).join(`
`)}function g_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xs).join(`
`)}function __(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function M_(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=n.getActiveAttrib(t,s),a=o.name;let r=1;o.type===n.FLOAT_MAT2&&(r=2),o.type===n.FLOAT_MAT3&&(r=3),o.type===n.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:n.getAttribLocation(t,a),locationSize:r}}return e}function xs(n){return n!==""}function Sh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Eh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const y_=/^[ \t]*#include +<([\w\d./]+)>/gm;function dc(n){return n.replace(y_,x_)}const v_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function x_(n,t){let e=$t[t];if(e===void 0){const i=v_.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return dc(e)}const b_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Th(n){return n.replace(b_,w_)}function w_(n,t,e,i){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function Ah(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function S_(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Fu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ou?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Zn&&(t="SHADOWMAP_TYPE_VSM"),t}function E_(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Cs:case ks:t="ENVMAP_TYPE_CUBE";break;case Vr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function T_(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ks:t="ENVMAP_MODE_REFRACTION";break}return t}function A_(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case zu:t="ENVMAP_BLENDING_MULTIPLY";break;case w0:t="ENVMAP_BLENDING_MIX";break;case S0:t="ENVMAP_BLENDING_ADD";break}return t}function R_(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function P_(n,t,e,i){const s=n.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=S_(e),l=E_(e),h=T_(e),u=A_(e),f=R_(e),p=e.isWebGL2?"":m_(e),_=g_(e),g=__(o),d=s.createProgram();let m,y,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(xs).join(`
`),m.length>0&&(m+=`
`),y=[p,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(xs).join(`
`),y.length>0&&(y+=`
`)):(m=[Ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xs).join(`
`),y=[p,Ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?$t.tonemapping_pars_fragment:"",e.toneMapping!==ti?p_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,d_("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xs).join(`
`)),a=dc(a),a=Sh(a,e),a=Eh(a,e),r=dc(r),r=Sh(r,e),r=Eh(r,e),a=Th(a),r=Th(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===ql?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ql?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const v=M+m+a,x=M+y+r,b=bh(s,s.VERTEX_SHADER,v),w=bh(s,s.FRAGMENT_SHADER,x);s.attachShader(d,b),s.attachShader(d,w),e.index0AttributeName!==void 0?s.bindAttribLocation(d,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(d,0,"position"),s.linkProgram(d);function L(R){if(n.debug.checkShaderErrors){const O=s.getProgramInfoLog(d).trim(),A=s.getShaderInfoLog(b).trim(),D=s.getShaderInfoLog(w).trim();let k=!0,I=!0;if(s.getProgramParameter(d,s.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,d,b,w);else{const N=wh(s,b,"vertex"),z=wh(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(d,s.VALIDATE_STATUS)+`

Program Info Log: `+O+`
`+N+`
`+z)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(A===""||D==="")&&(I=!1);I&&(R.diagnostics={runnable:k,programLog:O,vertexShader:{log:A,prefix:m},fragmentShader:{log:D,prefix:y}})}s.deleteShader(b),s.deleteShader(w),S=new _r(s,d),T=M_(s,d)}let S;this.getUniforms=function(){return S===void 0&&L(this),S};let T;this.getAttributes=function(){return T===void 0&&L(this),T};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(d,l_)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(d),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=h_++,this.cacheKey=t,this.usedTimes=1,this.program=d,this.vertexShader=b,this.fragmentShader=w,this}let L_=0;class C_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new k_(t),e.set(t,i)),i}}class k_{constructor(t){this.id=L_++,this.code=t,this.usedTimes=0}}function D_(n,t,e,i,s,o,a){const r=new sf,c=new C_,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return S===0?"uv":`uv${S}`}function d(S,T,C,R,O){const A=R.fog,D=O.geometry,k=S.isMeshStandardMaterial?R.environment:null,I=(S.isMeshStandardMaterial?e:t).get(S.envMap||k),N=I&&I.mapping===Vr?I.image.height:null,z=_[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const q=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,Z=q!==void 0?q.length:0;let Q=0;D.morphAttributes.position!==void 0&&(Q=1),D.morphAttributes.normal!==void 0&&(Q=2),D.morphAttributes.color!==void 0&&(Q=3);let U,Y,G,$;if(z){const te=Dn[z];U=te.vertexShader,Y=te.fragmentShader}else U=S.vertexShader,Y=S.fragmentShader,c.update(S),G=c.getVertexShaderID(S),$=c.getFragmentShaderID(S);const J=n.getRenderTarget(),it=O.isInstancedMesh===!0,ot=O.isBatchedMesh===!0,ct=!!S.map,K=!!S.matcap,F=!!I,B=!!S.aoMap,W=!!S.lightMap,et=!!S.bumpMap,st=!!S.normalMap,mt=!!S.displacementMap,ut=!!S.emissiveMap,E=!!S.metalnessMap,P=!!S.roughnessMap,tt=S.anisotropy>0,dt=S.clearcoat>0,at=S.iridescence>0,pt=S.sheen>0,gt=S.transmission>0,vt=tt&&!!S.anisotropyMap,xt=dt&&!!S.clearcoatMap,wt=dt&&!!S.clearcoatNormalMap,St=dt&&!!S.clearcoatRoughnessMap,ft=at&&!!S.iridescenceMap,At=at&&!!S.iridescenceThicknessMap,It=pt&&!!S.sheenColorMap,Ct=pt&&!!S.sheenRoughnessMap,kt=!!S.specularMap,Rt=!!S.specularColorMap,V=!!S.specularIntensityMap,Tt=gt&&!!S.transmissionMap,Ut=gt&&!!S.thicknessMap,nt=!!S.gradientMap,rt=!!S.alphaMap,H=S.alphaTest>0,lt=!!S.alphaHash,bt=!!S.extensions,Et=!!D.attributes.uv1,Pt=!!D.attributes.uv2,Ot=!!D.attributes.uv3;let Bt=ti;return S.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Bt=n.toneMapping),{isWebGL2:h,shaderID:z,shaderType:S.type,shaderName:S.name,vertexShader:U,fragmentShader:Y,defines:S.defines,customVertexShaderID:G,customFragmentShaderID:$,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:ot,instancing:it,instancingColor:it&&O.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:oi,map:ct,matcap:K,envMap:F,envMapMode:F&&I.mapping,envMapCubeUVHeight:N,aoMap:B,lightMap:W,bumpMap:et,normalMap:st,displacementMap:f&&mt,emissiveMap:ut,normalMapObjectSpace:st&&S.normalMapType===G0,normalMapTangentSpace:st&&S.normalMapType===Ku,metalnessMap:E,roughnessMap:P,anisotropy:tt,anisotropyMap:vt,clearcoat:dt,clearcoatMap:xt,clearcoatNormalMap:wt,clearcoatRoughnessMap:St,iridescence:at,iridescenceMap:ft,iridescenceThicknessMap:At,sheen:pt,sheenColorMap:It,sheenRoughnessMap:Ct,specularMap:kt,specularColorMap:Rt,specularIntensityMap:V,transmission:gt,transmissionMap:Tt,thicknessMap:Ut,gradientMap:nt,opaque:S.transparent===!1&&S.blending===Es,alphaMap:rt,alphaTest:H,alphaHash:lt,combine:S.combine,mapUv:ct&&g(S.map.channel),aoMapUv:B&&g(S.aoMap.channel),lightMapUv:W&&g(S.lightMap.channel),bumpMapUv:et&&g(S.bumpMap.channel),normalMapUv:st&&g(S.normalMap.channel),displacementMapUv:mt&&g(S.displacementMap.channel),emissiveMapUv:ut&&g(S.emissiveMap.channel),metalnessMapUv:E&&g(S.metalnessMap.channel),roughnessMapUv:P&&g(S.roughnessMap.channel),anisotropyMapUv:vt&&g(S.anisotropyMap.channel),clearcoatMapUv:xt&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:wt&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ft&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:At&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:It&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&g(S.sheenRoughnessMap.channel),specularMapUv:kt&&g(S.specularMap.channel),specularColorMapUv:Rt&&g(S.specularColorMap.channel),specularIntensityMapUv:V&&g(S.specularIntensityMap.channel),transmissionMapUv:Tt&&g(S.transmissionMap.channel),thicknessMapUv:Ut&&g(S.thicknessMap.channel),alphaMapUv:rt&&g(S.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(st||tt),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,vertexUv1s:Et,vertexUv2s:Pt,vertexUv3s:Ot,pointsUvs:O.isPoints===!0&&!!D.attributes.uv&&(ct||rt),fog:!!A,useFog:S.fog===!0,fogExp2:A&&A.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:O.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:Q,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Bt,useLegacyLights:n._useLegacyLights,decodeVideoTexture:ct&&S.map.isVideoTexture===!0&&ie.getTransfer(S.map.colorSpace)===ce,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Un,flipSided:S.side===Ye,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:bt&&S.extensions.derivatives===!0,extensionFragDepth:bt&&S.extensions.fragDepth===!0,extensionDrawBuffers:bt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:bt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:bt&&S.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function m(S){const T=[];if(S.shaderID?T.push(S.shaderID):(T.push(S.customVertexShaderID),T.push(S.customFragmentShaderID)),S.defines!==void 0)for(const C in S.defines)T.push(C),T.push(S.defines[C]);return S.isRawShaderMaterial===!1&&(y(T,S),M(T,S),T.push(n.outputColorSpace)),T.push(S.customProgramCacheKey),T.join()}function y(S,T){S.push(T.precision),S.push(T.outputColorSpace),S.push(T.envMapMode),S.push(T.envMapCubeUVHeight),S.push(T.mapUv),S.push(T.alphaMapUv),S.push(T.lightMapUv),S.push(T.aoMapUv),S.push(T.bumpMapUv),S.push(T.normalMapUv),S.push(T.displacementMapUv),S.push(T.emissiveMapUv),S.push(T.metalnessMapUv),S.push(T.roughnessMapUv),S.push(T.anisotropyMapUv),S.push(T.clearcoatMapUv),S.push(T.clearcoatNormalMapUv),S.push(T.clearcoatRoughnessMapUv),S.push(T.iridescenceMapUv),S.push(T.iridescenceThicknessMapUv),S.push(T.sheenColorMapUv),S.push(T.sheenRoughnessMapUv),S.push(T.specularMapUv),S.push(T.specularColorMapUv),S.push(T.specularIntensityMapUv),S.push(T.transmissionMapUv),S.push(T.thicknessMapUv),S.push(T.combine),S.push(T.fogExp2),S.push(T.sizeAttenuation),S.push(T.morphTargetsCount),S.push(T.morphAttributeCount),S.push(T.numDirLights),S.push(T.numPointLights),S.push(T.numSpotLights),S.push(T.numSpotLightMaps),S.push(T.numHemiLights),S.push(T.numRectAreaLights),S.push(T.numDirLightShadows),S.push(T.numPointLightShadows),S.push(T.numSpotLightShadows),S.push(T.numSpotLightShadowsWithMaps),S.push(T.numLightProbes),S.push(T.shadowMapType),S.push(T.toneMapping),S.push(T.numClippingPlanes),S.push(T.numClipIntersection),S.push(T.depthPacking)}function M(S,T){r.disableAll(),T.isWebGL2&&r.enable(0),T.supportsVertexTextures&&r.enable(1),T.instancing&&r.enable(2),T.instancingColor&&r.enable(3),T.matcap&&r.enable(4),T.envMap&&r.enable(5),T.normalMapObjectSpace&&r.enable(6),T.normalMapTangentSpace&&r.enable(7),T.clearcoat&&r.enable(8),T.iridescence&&r.enable(9),T.alphaTest&&r.enable(10),T.vertexColors&&r.enable(11),T.vertexAlphas&&r.enable(12),T.vertexUv1s&&r.enable(13),T.vertexUv2s&&r.enable(14),T.vertexUv3s&&r.enable(15),T.vertexTangents&&r.enable(16),T.anisotropy&&r.enable(17),T.alphaHash&&r.enable(18),T.batching&&r.enable(19),S.push(r.mask),r.disableAll(),T.fog&&r.enable(0),T.useFog&&r.enable(1),T.flatShading&&r.enable(2),T.logarithmicDepthBuffer&&r.enable(3),T.skinning&&r.enable(4),T.morphTargets&&r.enable(5),T.morphNormals&&r.enable(6),T.morphColors&&r.enable(7),T.premultipliedAlpha&&r.enable(8),T.shadowMapEnabled&&r.enable(9),T.useLegacyLights&&r.enable(10),T.doubleSided&&r.enable(11),T.flipSided&&r.enable(12),T.useDepthPacking&&r.enable(13),T.dithering&&r.enable(14),T.transmission&&r.enable(15),T.sheen&&r.enable(16),T.opaque&&r.enable(17),T.pointsUvs&&r.enable(18),T.decodeVideoTexture&&r.enable(19),S.push(r.mask)}function v(S){const T=_[S.type];let C;if(T){const R=Dn[T];C=mp.clone(R.uniforms)}else C=S.uniforms;return C}function x(S,T){let C;for(let R=0,O=l.length;R<O;R++){const A=l[R];if(A.cacheKey===T){C=A,++C.usedTimes;break}}return C===void 0&&(C=new P_(n,T,S,o),l.push(C)),C}function b(S){if(--S.usedTimes===0){const T=l.indexOf(S);l[T]=l[l.length-1],l.pop(),S.destroy()}}function w(S){c.remove(S)}function L(){c.dispose()}return{getParameters:d,getProgramCacheKey:m,getUniforms:v,acquireProgram:x,releaseProgram:b,releaseShaderCache:w,programs:l,dispose:L}}function I_(){let n=new WeakMap;function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function e(o){n.delete(o)}function i(o,a,r){n.get(o)[a]=r}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function U_(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Rh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Ph(){const n=[];let t=0;const e=[],i=[],s=[];function o(){t=0,e.length=0,i.length=0,s.length=0}function a(u,f,p,_,g,d){let m=n[t];return m===void 0?(m={id:u.id,object:u,geometry:f,material:p,groupOrder:_,renderOrder:u.renderOrder,z:g,group:d},n[t]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=p,m.groupOrder=_,m.renderOrder=u.renderOrder,m.z=g,m.group=d),t++,m}function r(u,f,p,_,g,d){const m=a(u,f,p,_,g,d);p.transmission>0?i.push(m):p.transparent===!0?s.push(m):e.push(m)}function c(u,f,p,_,g,d){const m=a(u,f,p,_,g,d);p.transmission>0?i.unshift(m):p.transparent===!0?s.unshift(m):e.unshift(m)}function l(u,f){e.length>1&&e.sort(u||U_),i.length>1&&i.sort(f||Rh),s.length>1&&s.sort(f||Rh)}function h(){for(let u=t,f=n.length;u<f;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:o,push:r,unshift:c,finish:h,sort:l}}function N_(){let n=new WeakMap;function t(i,s){const o=n.get(i);let a;return o===void 0?(a=new Ph,n.set(i,[a])):s>=o.length?(a=new Ph,o.push(a)):a=o[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function F_(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new qt};break;case"SpotLight":e={position:new X,direction:new X,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new X,halfWidth:new X,halfHeight:new X};break}return n[t.id]=e,e}}}function O_(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let z_=0;function B_(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function G_(n,t){const e=new F_,i=O_(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new X);const o=new X,a=new ae,r=new ae;function c(h,u){let f=0,p=0,_=0;for(let R=0;R<9;R++)s.probe[R].set(0,0,0);let g=0,d=0,m=0,y=0,M=0,v=0,x=0,b=0,w=0,L=0,S=0;h.sort(B_);const T=u===!0?Math.PI:1;for(let R=0,O=h.length;R<O;R++){const A=h[R],D=A.color,k=A.intensity,I=A.distance,N=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)f+=D.r*k*T,p+=D.g*k*T,_+=D.b*k*T;else if(A.isLightProbe){for(let z=0;z<9;z++)s.probe[z].addScaledVector(A.sh.coefficients[z],k);S++}else if(A.isDirectionalLight){const z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity*T),A.castShadow){const q=A.shadow,Z=i.get(A);Z.shadowBias=q.bias,Z.shadowNormalBias=q.normalBias,Z.shadowRadius=q.radius,Z.shadowMapSize=q.mapSize,s.directionalShadow[g]=Z,s.directionalShadowMap[g]=N,s.directionalShadowMatrix[g]=A.shadow.matrix,v++}s.directional[g]=z,g++}else if(A.isSpotLight){const z=e.get(A);z.position.setFromMatrixPosition(A.matrixWorld),z.color.copy(D).multiplyScalar(k*T),z.distance=I,z.coneCos=Math.cos(A.angle),z.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),z.decay=A.decay,s.spot[m]=z;const q=A.shadow;if(A.map&&(s.spotLightMap[w]=A.map,w++,q.updateMatrices(A),A.castShadow&&L++),s.spotLightMatrix[m]=q.matrix,A.castShadow){const Z=i.get(A);Z.shadowBias=q.bias,Z.shadowNormalBias=q.normalBias,Z.shadowRadius=q.radius,Z.shadowMapSize=q.mapSize,s.spotShadow[m]=Z,s.spotShadowMap[m]=N,b++}m++}else if(A.isRectAreaLight){const z=e.get(A);z.color.copy(D).multiplyScalar(k),z.halfWidth.set(A.width*.5,0,0),z.halfHeight.set(0,A.height*.5,0),s.rectArea[y]=z,y++}else if(A.isPointLight){const z=e.get(A);if(z.color.copy(A.color).multiplyScalar(A.intensity*T),z.distance=A.distance,z.decay=A.decay,A.castShadow){const q=A.shadow,Z=i.get(A);Z.shadowBias=q.bias,Z.shadowNormalBias=q.normalBias,Z.shadowRadius=q.radius,Z.shadowMapSize=q.mapSize,Z.shadowCameraNear=q.camera.near,Z.shadowCameraFar=q.camera.far,s.pointShadow[d]=Z,s.pointShadowMap[d]=N,s.pointShadowMatrix[d]=A.shadow.matrix,x++}s.point[d]=z,d++}else if(A.isHemisphereLight){const z=e.get(A);z.skyColor.copy(A.color).multiplyScalar(k*T),z.groundColor.copy(A.groundColor).multiplyScalar(k*T),s.hemi[M]=z,M++}}y>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Dt.LTC_FLOAT_1,s.rectAreaLTC2=Dt.LTC_FLOAT_2):(s.rectAreaLTC1=Dt.LTC_HALF_1,s.rectAreaLTC2=Dt.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Dt.LTC_FLOAT_1,s.rectAreaLTC2=Dt.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Dt.LTC_HALF_1,s.rectAreaLTC2=Dt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=p,s.ambient[2]=_;const C=s.hash;(C.directionalLength!==g||C.pointLength!==d||C.spotLength!==m||C.rectAreaLength!==y||C.hemiLength!==M||C.numDirectionalShadows!==v||C.numPointShadows!==x||C.numSpotShadows!==b||C.numSpotMaps!==w||C.numLightProbes!==S)&&(s.directional.length=g,s.spot.length=m,s.rectArea.length=y,s.point.length=d,s.hemi.length=M,s.directionalShadow.length=v,s.directionalShadowMap.length=v,s.pointShadow.length=x,s.pointShadowMap.length=x,s.spotShadow.length=b,s.spotShadowMap.length=b,s.directionalShadowMatrix.length=v,s.pointShadowMatrix.length=x,s.spotLightMatrix.length=b+w-L,s.spotLightMap.length=w,s.numSpotLightShadowsWithMaps=L,s.numLightProbes=S,C.directionalLength=g,C.pointLength=d,C.spotLength=m,C.rectAreaLength=y,C.hemiLength=M,C.numDirectionalShadows=v,C.numPointShadows=x,C.numSpotShadows=b,C.numSpotMaps=w,C.numLightProbes=S,s.version=z_++)}function l(h,u){let f=0,p=0,_=0,g=0,d=0;const m=u.matrixWorldInverse;for(let y=0,M=h.length;y<M;y++){const v=h[y];if(v.isDirectionalLight){const x=s.directional[f];x.direction.setFromMatrixPosition(v.matrixWorld),o.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(o),x.direction.transformDirection(m),f++}else if(v.isSpotLight){const x=s.spot[_];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(v.matrixWorld),o.setFromMatrixPosition(v.target.matrixWorld),x.direction.sub(o),x.direction.transformDirection(m),_++}else if(v.isRectAreaLight){const x=s.rectArea[g];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),r.identity(),a.copy(v.matrixWorld),a.premultiply(m),r.extractRotation(a),x.halfWidth.set(v.width*.5,0,0),x.halfHeight.set(0,v.height*.5,0),x.halfWidth.applyMatrix4(r),x.halfHeight.applyMatrix4(r),g++}else if(v.isPointLight){const x=s.point[p];x.position.setFromMatrixPosition(v.matrixWorld),x.position.applyMatrix4(m),p++}else if(v.isHemisphereLight){const x=s.hemi[d];x.direction.setFromMatrixPosition(v.matrixWorld),x.direction.transformDirection(m),d++}}}return{setup:c,setupView:l,state:s}}function Lh(n,t){const e=new G_(n,t),i=[],s=[];function o(){i.length=0,s.length=0}function a(u){i.push(u)}function r(u){s.push(u)}function c(u){e.setup(i,u)}function l(u){e.setupView(i,u)}return{init:o,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:r}}function H_(n,t){let e=new WeakMap;function i(o,a=0){const r=e.get(o);let c;return r===void 0?(c=new Lh(n,t),e.set(o,[c])):a>=r.length?(c=new Lh(n,t),r.push(c)):c=r[a],c}function s(){e=new WeakMap}return{get:i,dispose:s}}class V_ extends Po{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=z0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class W_ extends Po{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const j_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,q_=`uniform sampler2D shadow_pass;
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
}`;function X_(n,t,e){let i=new Gc;const s=new Lt,o=new Lt,a=new De,r=new V_({depthPacking:B0}),c=new W_,l={},h=e.maxTextureSize,u={[wi]:Ye,[Ye]:wi,[Un]:Un},f=new Xi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:j_,fragmentShader:q_}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new Ge;_.setAttribute("position",new _e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new he(_,f),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fu;let m=this.type;this.render=function(b,w,L){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||b.length===0)return;const S=n.getRenderTarget(),T=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),R=n.state;R.setBlending(bi),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const O=m!==Zn&&this.type===Zn,A=m===Zn&&this.type!==Zn;for(let D=0,k=b.length;D<k;D++){const I=b[D],N=I.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",I,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;s.copy(N.mapSize);const z=N.getFrameExtents();if(s.multiply(z),o.copy(N.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/z.x),s.x=o.x*z.x,N.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/z.y),s.y=o.y*z.y,N.mapSize.y=o.y)),N.map===null||O===!0||A===!0){const Z=this.type!==Zn?{minFilter:Oe,magFilter:Oe}:{};N.map!==null&&N.map.dispose(),N.map=new ji(s.x,s.y,Z),N.map.texture.name=I.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const q=N.getViewportCount();for(let Z=0;Z<q;Z++){const Q=N.getViewport(Z);a.set(o.x*Q.x,o.y*Q.y,o.x*Q.z,o.y*Q.w),R.viewport(a),N.updateMatrices(I,Z),i=N.getFrustum(),v(w,L,N.camera,I,this.type)}N.isPointLightShadow!==!0&&this.type===Zn&&y(N,L),N.needsUpdate=!1}m=this.type,d.needsUpdate=!1,n.setRenderTarget(S,T,C)};function y(b,w){const L=t.update(g);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new ji(s.x,s.y)),f.uniforms.shadow_pass.value=b.map.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(w,null,L,f,g,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(w,null,L,p,g,null)}function M(b,w,L,S){let T=null;const C=L.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)T=C;else if(T=L.isPointLight===!0?c:r,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const R=T.uuid,O=w.uuid;let A=l[R];A===void 0&&(A={},l[R]=A);let D=A[O];D===void 0&&(D=T.clone(),A[O]=D,w.addEventListener("dispose",x)),T=D}if(T.visible=w.visible,T.wireframe=w.wireframe,S===Zn?T.side=w.shadowSide!==null?w.shadowSide:w.side:T.side=w.shadowSide!==null?w.shadowSide:u[w.side],T.alphaMap=w.alphaMap,T.alphaTest=w.alphaTest,T.map=w.map,T.clipShadows=w.clipShadows,T.clippingPlanes=w.clippingPlanes,T.clipIntersection=w.clipIntersection,T.displacementMap=w.displacementMap,T.displacementScale=w.displacementScale,T.displacementBias=w.displacementBias,T.wireframeLinewidth=w.wireframeLinewidth,T.linewidth=w.linewidth,L.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const R=n.properties.get(T);R.light=L}return T}function v(b,w,L,S,T){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&T===Zn)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,b.matrixWorld);const O=t.update(b),A=b.material;if(Array.isArray(A)){const D=O.groups;for(let k=0,I=D.length;k<I;k++){const N=D[k],z=A[N.materialIndex];if(z&&z.visible){const q=M(b,z,S,T);b.onBeforeShadow(n,b,w,L,O,q,N),n.renderBufferDirect(L,null,O,q,b,N),b.onAfterShadow(n,b,w,L,O,q,N)}}}else if(A.visible){const D=M(b,A,S,T);b.onBeforeShadow(n,b,w,L,O,D,null),n.renderBufferDirect(L,null,O,D,b,null),b.onAfterShadow(n,b,w,L,O,D,null)}}const R=b.children;for(let O=0,A=R.length;O<A;O++)v(R[O],w,L,S,T)}function x(b){b.target.removeEventListener("dispose",x);for(const L in l){const S=l[L],T=b.target.uuid;T in S&&(S[T].dispose(),delete S[T])}}}function Y_(n,t,e){const i=e.isWebGL2;function s(){let H=!1;const lt=new De;let bt=null;const Et=new De(0,0,0,0);return{setMask:function(Pt){bt!==Pt&&!H&&(n.colorMask(Pt,Pt,Pt,Pt),bt=Pt)},setLocked:function(Pt){H=Pt},setClear:function(Pt,Ot,Bt,Qt,te){te===!0&&(Pt*=Qt,Ot*=Qt,Bt*=Qt),lt.set(Pt,Ot,Bt,Qt),Et.equals(lt)===!1&&(n.clearColor(Pt,Ot,Bt,Qt),Et.copy(lt))},reset:function(){H=!1,bt=null,Et.set(-1,0,0,0)}}}function o(){let H=!1,lt=null,bt=null,Et=null;return{setTest:function(Pt){Pt?ot(n.DEPTH_TEST):ct(n.DEPTH_TEST)},setMask:function(Pt){lt!==Pt&&!H&&(n.depthMask(Pt),lt=Pt)},setFunc:function(Pt){if(bt!==Pt){switch(Pt){case g0:n.depthFunc(n.NEVER);break;case _0:n.depthFunc(n.ALWAYS);break;case M0:n.depthFunc(n.LESS);break;case wr:n.depthFunc(n.LEQUAL);break;case y0:n.depthFunc(n.EQUAL);break;case v0:n.depthFunc(n.GEQUAL);break;case x0:n.depthFunc(n.GREATER);break;case b0:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}bt=Pt}},setLocked:function(Pt){H=Pt},setClear:function(Pt){Et!==Pt&&(n.clearDepth(Pt),Et=Pt)},reset:function(){H=!1,lt=null,bt=null,Et=null}}}function a(){let H=!1,lt=null,bt=null,Et=null,Pt=null,Ot=null,Bt=null,Qt=null,te=null;return{setTest:function(Wt){H||(Wt?ot(n.STENCIL_TEST):ct(n.STENCIL_TEST))},setMask:function(Wt){lt!==Wt&&!H&&(n.stencilMask(Wt),lt=Wt)},setFunc:function(Wt,ee,de){(bt!==Wt||Et!==ee||Pt!==de)&&(n.stencilFunc(Wt,ee,de),bt=Wt,Et=ee,Pt=de)},setOp:function(Wt,ee,de){(Ot!==Wt||Bt!==ee||Qt!==de)&&(n.stencilOp(Wt,ee,de),Ot=Wt,Bt=ee,Qt=de)},setLocked:function(Wt){H=Wt},setClear:function(Wt){te!==Wt&&(n.clearStencil(Wt),te=Wt)},reset:function(){H=!1,lt=null,bt=null,Et=null,Pt=null,Ot=null,Bt=null,Qt=null,te=null}}}const r=new s,c=new o,l=new a,h=new WeakMap,u=new WeakMap;let f={},p={},_=new WeakMap,g=[],d=null,m=!1,y=null,M=null,v=null,x=null,b=null,w=null,L=null,S=new qt(0,0,0),T=0,C=!1,R=null,O=null,A=null,D=null,k=null;const I=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,z=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(q)[1]),N=z>=1):q.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),N=z>=2);let Z=null,Q={};const U=n.getParameter(n.SCISSOR_BOX),Y=n.getParameter(n.VIEWPORT),G=new De().fromArray(U),$=new De().fromArray(Y);function J(H,lt,bt,Et){const Pt=new Uint8Array(4),Ot=n.createTexture();n.bindTexture(H,Ot),n.texParameteri(H,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(H,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Bt=0;Bt<bt;Bt++)i&&(H===n.TEXTURE_3D||H===n.TEXTURE_2D_ARRAY)?n.texImage3D(lt,0,n.RGBA,1,1,Et,0,n.RGBA,n.UNSIGNED_BYTE,Pt):n.texImage2D(lt+Bt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pt);return Ot}const it={};it[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),it[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(it[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),it[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),c.setClear(1),l.setClear(0),ot(n.DEPTH_TEST),c.setFunc(wr),ut(!1),E(fl),ot(n.CULL_FACE),st(bi);function ot(H){f[H]!==!0&&(n.enable(H),f[H]=!0)}function ct(H){f[H]!==!1&&(n.disable(H),f[H]=!1)}function K(H,lt){return p[H]!==lt?(n.bindFramebuffer(H,lt),p[H]=lt,i&&(H===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=lt),H===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=lt)),!0):!1}function F(H,lt){let bt=g,Et=!1;if(H)if(bt=_.get(lt),bt===void 0&&(bt=[],_.set(lt,bt)),H.isWebGLMultipleRenderTargets){const Pt=H.texture;if(bt.length!==Pt.length||bt[0]!==n.COLOR_ATTACHMENT0){for(let Ot=0,Bt=Pt.length;Ot<Bt;Ot++)bt[Ot]=n.COLOR_ATTACHMENT0+Ot;bt.length=Pt.length,Et=!0}}else bt[0]!==n.COLOR_ATTACHMENT0&&(bt[0]=n.COLOR_ATTACHMENT0,Et=!0);else bt[0]!==n.BACK&&(bt[0]=n.BACK,Et=!0);Et&&(e.isWebGL2?n.drawBuffers(bt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(bt))}function B(H){return d!==H?(n.useProgram(H),d=H,!0):!1}const W={[Ni]:n.FUNC_ADD,[e0]:n.FUNC_SUBTRACT,[n0]:n.FUNC_REVERSE_SUBTRACT};if(i)W[gl]=n.MIN,W[_l]=n.MAX;else{const H=t.get("EXT_blend_minmax");H!==null&&(W[gl]=H.MIN_EXT,W[_l]=H.MAX_EXT)}const et={[i0]:n.ZERO,[s0]:n.ONE,[o0]:n.SRC_COLOR,[sc]:n.SRC_ALPHA,[u0]:n.SRC_ALPHA_SATURATE,[l0]:n.DST_COLOR,[a0]:n.DST_ALPHA,[r0]:n.ONE_MINUS_SRC_COLOR,[oc]:n.ONE_MINUS_SRC_ALPHA,[h0]:n.ONE_MINUS_DST_COLOR,[c0]:n.ONE_MINUS_DST_ALPHA,[f0]:n.CONSTANT_COLOR,[d0]:n.ONE_MINUS_CONSTANT_COLOR,[p0]:n.CONSTANT_ALPHA,[m0]:n.ONE_MINUS_CONSTANT_ALPHA};function st(H,lt,bt,Et,Pt,Ot,Bt,Qt,te,Wt){if(H===bi){m===!0&&(ct(n.BLEND),m=!1);return}if(m===!1&&(ot(n.BLEND),m=!0),H!==t0){if(H!==y||Wt!==C){if((M!==Ni||b!==Ni)&&(n.blendEquation(n.FUNC_ADD),M=Ni,b=Ni),Wt)switch(H){case Es:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case dl:n.blendFunc(n.ONE,n.ONE);break;case pl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ml:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case Es:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case dl:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case pl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case ml:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}v=null,x=null,w=null,L=null,S.set(0,0,0),T=0,y=H,C=Wt}return}Pt=Pt||lt,Ot=Ot||bt,Bt=Bt||Et,(lt!==M||Pt!==b)&&(n.blendEquationSeparate(W[lt],W[Pt]),M=lt,b=Pt),(bt!==v||Et!==x||Ot!==w||Bt!==L)&&(n.blendFuncSeparate(et[bt],et[Et],et[Ot],et[Bt]),v=bt,x=Et,w=Ot,L=Bt),(Qt.equals(S)===!1||te!==T)&&(n.blendColor(Qt.r,Qt.g,Qt.b,te),S.copy(Qt),T=te),y=H,C=!1}function mt(H,lt){H.side===Un?ct(n.CULL_FACE):ot(n.CULL_FACE);let bt=H.side===Ye;lt&&(bt=!bt),ut(bt),H.blending===Es&&H.transparent===!1?st(bi):st(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),c.setFunc(H.depthFunc),c.setTest(H.depthTest),c.setMask(H.depthWrite),r.setMask(H.colorWrite);const Et=H.stencilWrite;l.setTest(Et),Et&&(l.setMask(H.stencilWriteMask),l.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),l.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),tt(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?ot(n.SAMPLE_ALPHA_TO_COVERAGE):ct(n.SAMPLE_ALPHA_TO_COVERAGE)}function ut(H){R!==H&&(H?n.frontFace(n.CW):n.frontFace(n.CCW),R=H)}function E(H){H!==Jd?(ot(n.CULL_FACE),H!==O&&(H===fl?n.cullFace(n.BACK):H===Qd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ct(n.CULL_FACE),O=H}function P(H){H!==A&&(N&&n.lineWidth(H),A=H)}function tt(H,lt,bt){H?(ot(n.POLYGON_OFFSET_FILL),(D!==lt||k!==bt)&&(n.polygonOffset(lt,bt),D=lt,k=bt)):ct(n.POLYGON_OFFSET_FILL)}function dt(H){H?ot(n.SCISSOR_TEST):ct(n.SCISSOR_TEST)}function at(H){H===void 0&&(H=n.TEXTURE0+I-1),Z!==H&&(n.activeTexture(H),Z=H)}function pt(H,lt,bt){bt===void 0&&(Z===null?bt=n.TEXTURE0+I-1:bt=Z);let Et=Q[bt];Et===void 0&&(Et={type:void 0,texture:void 0},Q[bt]=Et),(Et.type!==H||Et.texture!==lt)&&(Z!==bt&&(n.activeTexture(bt),Z=bt),n.bindTexture(H,lt||it[H]),Et.type=H,Et.texture=lt)}function gt(){const H=Q[Z];H!==void 0&&H.type!==void 0&&(n.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function vt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function xt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function wt(){try{n.texSubImage2D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function St(){try{n.texSubImage3D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ft(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function At(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function It(){try{n.texStorage2D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ct(){try{n.texStorage3D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function kt(){try{n.texImage2D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Rt(){try{n.texImage3D.apply(n,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function V(H){G.equals(H)===!1&&(n.scissor(H.x,H.y,H.z,H.w),G.copy(H))}function Tt(H){$.equals(H)===!1&&(n.viewport(H.x,H.y,H.z,H.w),$.copy(H))}function Ut(H,lt){let bt=u.get(lt);bt===void 0&&(bt=new WeakMap,u.set(lt,bt));let Et=bt.get(H);Et===void 0&&(Et=n.getUniformBlockIndex(lt,H.name),bt.set(H,Et))}function nt(H,lt){const Et=u.get(lt).get(H);h.get(lt)!==Et&&(n.uniformBlockBinding(lt,Et,H.__bindingPointIndex),h.set(lt,Et))}function rt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},Z=null,Q={},p={},_=new WeakMap,g=[],d=null,m=!1,y=null,M=null,v=null,x=null,b=null,w=null,L=null,S=new qt(0,0,0),T=0,C=!1,R=null,O=null,A=null,D=null,k=null,G.set(0,0,n.canvas.width,n.canvas.height),$.set(0,0,n.canvas.width,n.canvas.height),r.reset(),c.reset(),l.reset()}return{buffers:{color:r,depth:c,stencil:l},enable:ot,disable:ct,bindFramebuffer:K,drawBuffers:F,useProgram:B,setBlending:st,setMaterial:mt,setFlipSided:ut,setCullFace:E,setLineWidth:P,setPolygonOffset:tt,setScissorTest:dt,activeTexture:at,bindTexture:pt,unbindTexture:gt,compressedTexImage2D:vt,compressedTexImage3D:xt,texImage2D:kt,texImage3D:Rt,updateUBOMapping:Ut,uniformBlockBinding:nt,texStorage2D:It,texStorage3D:Ct,texSubImage2D:wt,texSubImage3D:St,compressedTexSubImage2D:ft,compressedTexSubImage3D:At,scissor:V,viewport:Tt,reset:rt}}function $_(n,t,e,i,s,o,a){const r=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(E,P){return p?new OffscreenCanvas(E,P):Pr("canvas")}function g(E,P,tt,dt){let at=1;if((E.width>dt||E.height>dt)&&(at=dt/Math.max(E.width,E.height)),at<1||P===!0)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap){const pt=P?uc:Math.floor,gt=pt(at*E.width),vt=pt(at*E.height);u===void 0&&(u=_(gt,vt));const xt=tt?_(gt,vt):u;return xt.width=gt,xt.height=vt,xt.getContext("2d").drawImage(E,0,0,gt,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+E.width+"x"+E.height+") to ("+gt+"x"+vt+")."),xt}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+E.width+"x"+E.height+")."),E;return E}function d(E){return Xl(E.width)&&Xl(E.height)}function m(E){return r?!1:E.wrapS!==_n||E.wrapT!==_n||E.minFilter!==Oe&&E.minFilter!==rn}function y(E,P){return E.generateMipmaps&&P&&E.minFilter!==Oe&&E.minFilter!==rn}function M(E){n.generateMipmap(E)}function v(E,P,tt,dt,at=!1){if(r===!1)return P;if(E!==null){if(n[E]!==void 0)return n[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let pt=P;if(P===n.RED&&(tt===n.FLOAT&&(pt=n.R32F),tt===n.HALF_FLOAT&&(pt=n.R16F),tt===n.UNSIGNED_BYTE&&(pt=n.R8)),P===n.RED_INTEGER&&(tt===n.UNSIGNED_BYTE&&(pt=n.R8UI),tt===n.UNSIGNED_SHORT&&(pt=n.R16UI),tt===n.UNSIGNED_INT&&(pt=n.R32UI),tt===n.BYTE&&(pt=n.R8I),tt===n.SHORT&&(pt=n.R16I),tt===n.INT&&(pt=n.R32I)),P===n.RG&&(tt===n.FLOAT&&(pt=n.RG32F),tt===n.HALF_FLOAT&&(pt=n.RG16F),tt===n.UNSIGNED_BYTE&&(pt=n.RG8)),P===n.RGBA){const gt=at?Sr:ie.getTransfer(dt);tt===n.FLOAT&&(pt=n.RGBA32F),tt===n.HALF_FLOAT&&(pt=n.RGBA16F),tt===n.UNSIGNED_BYTE&&(pt=gt===ce?n.SRGB8_ALPHA8:n.RGBA8),tt===n.UNSIGNED_SHORT_4_4_4_4&&(pt=n.RGBA4),tt===n.UNSIGNED_SHORT_5_5_5_1&&(pt=n.RGB5_A1)}return(pt===n.R16F||pt===n.R32F||pt===n.RG16F||pt===n.RG32F||pt===n.RGBA16F||pt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),pt}function x(E,P,tt){return y(E,tt)===!0||E.isFramebufferTexture&&E.minFilter!==Oe&&E.minFilter!==rn?Math.log2(Math.max(P.width,P.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?P.mipmaps.length:1}function b(E){return E===Oe||E===Ml||E===na?n.NEAREST:n.LINEAR}function w(E){const P=E.target;P.removeEventListener("dispose",w),S(P),P.isVideoTexture&&h.delete(P)}function L(E){const P=E.target;P.removeEventListener("dispose",L),C(P)}function S(E){const P=i.get(E);if(P.__webglInit===void 0)return;const tt=E.source,dt=f.get(tt);if(dt){const at=dt[P.__cacheKey];at.usedTimes--,at.usedTimes===0&&T(E),Object.keys(dt).length===0&&f.delete(tt)}i.remove(E)}function T(E){const P=i.get(E);n.deleteTexture(P.__webglTexture);const tt=E.source,dt=f.get(tt);delete dt[P.__cacheKey],a.memory.textures--}function C(E){const P=E.texture,tt=i.get(E),dt=i.get(P);if(dt.__webglTexture!==void 0&&(n.deleteTexture(dt.__webglTexture),a.memory.textures--),E.depthTexture&&E.depthTexture.dispose(),E.isWebGLCubeRenderTarget)for(let at=0;at<6;at++){if(Array.isArray(tt.__webglFramebuffer[at]))for(let pt=0;pt<tt.__webglFramebuffer[at].length;pt++)n.deleteFramebuffer(tt.__webglFramebuffer[at][pt]);else n.deleteFramebuffer(tt.__webglFramebuffer[at]);tt.__webglDepthbuffer&&n.deleteRenderbuffer(tt.__webglDepthbuffer[at])}else{if(Array.isArray(tt.__webglFramebuffer))for(let at=0;at<tt.__webglFramebuffer.length;at++)n.deleteFramebuffer(tt.__webglFramebuffer[at]);else n.deleteFramebuffer(tt.__webglFramebuffer);if(tt.__webglDepthbuffer&&n.deleteRenderbuffer(tt.__webglDepthbuffer),tt.__webglMultisampledFramebuffer&&n.deleteFramebuffer(tt.__webglMultisampledFramebuffer),tt.__webglColorRenderbuffer)for(let at=0;at<tt.__webglColorRenderbuffer.length;at++)tt.__webglColorRenderbuffer[at]&&n.deleteRenderbuffer(tt.__webglColorRenderbuffer[at]);tt.__webglDepthRenderbuffer&&n.deleteRenderbuffer(tt.__webglDepthRenderbuffer)}if(E.isWebGLMultipleRenderTargets)for(let at=0,pt=P.length;at<pt;at++){const gt=i.get(P[at]);gt.__webglTexture&&(n.deleteTexture(gt.__webglTexture),a.memory.textures--),i.remove(P[at])}i.remove(P),i.remove(E)}let R=0;function O(){R=0}function A(){const E=R;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),R+=1,E}function D(E){const P=[];return P.push(E.wrapS),P.push(E.wrapT),P.push(E.wrapR||0),P.push(E.magFilter),P.push(E.minFilter),P.push(E.anisotropy),P.push(E.internalFormat),P.push(E.format),P.push(E.type),P.push(E.generateMipmaps),P.push(E.premultiplyAlpha),P.push(E.flipY),P.push(E.unpackAlignment),P.push(E.colorSpace),P.join()}function k(E,P){const tt=i.get(E);if(E.isVideoTexture&&mt(E),E.isRenderTargetTexture===!1&&E.version>0&&tt.__version!==E.version){const dt=E.image;if(dt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(dt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G(tt,E,P);return}}e.bindTexture(n.TEXTURE_2D,tt.__webglTexture,n.TEXTURE0+P)}function I(E,P){const tt=i.get(E);if(E.version>0&&tt.__version!==E.version){G(tt,E,P);return}e.bindTexture(n.TEXTURE_2D_ARRAY,tt.__webglTexture,n.TEXTURE0+P)}function N(E,P){const tt=i.get(E);if(E.version>0&&tt.__version!==E.version){G(tt,E,P);return}e.bindTexture(n.TEXTURE_3D,tt.__webglTexture,n.TEXTURE0+P)}function z(E,P){const tt=i.get(E);if(E.version>0&&tt.__version!==E.version){$(tt,E,P);return}e.bindTexture(n.TEXTURE_CUBE_MAP,tt.__webglTexture,n.TEXTURE0+P)}const q={[cc]:n.REPEAT,[_n]:n.CLAMP_TO_EDGE,[lc]:n.MIRRORED_REPEAT},Z={[Oe]:n.NEAREST,[Ml]:n.NEAREST_MIPMAP_NEAREST,[na]:n.NEAREST_MIPMAP_LINEAR,[rn]:n.LINEAR,[L0]:n.LINEAR_MIPMAP_NEAREST,[Ds]:n.LINEAR_MIPMAP_LINEAR},Q={[H0]:n.NEVER,[Y0]:n.ALWAYS,[V0]:n.LESS,[Zu]:n.LEQUAL,[W0]:n.EQUAL,[X0]:n.GEQUAL,[j0]:n.GREATER,[q0]:n.NOTEQUAL};function U(E,P,tt){if(tt?(n.texParameteri(E,n.TEXTURE_WRAP_S,q[P.wrapS]),n.texParameteri(E,n.TEXTURE_WRAP_T,q[P.wrapT]),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,q[P.wrapR]),n.texParameteri(E,n.TEXTURE_MAG_FILTER,Z[P.magFilter]),n.texParameteri(E,n.TEXTURE_MIN_FILTER,Z[P.minFilter])):(n.texParameteri(E,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(E,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(E===n.TEXTURE_3D||E===n.TEXTURE_2D_ARRAY)&&n.texParameteri(E,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(P.wrapS!==_n||P.wrapT!==_n)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(E,n.TEXTURE_MAG_FILTER,b(P.magFilter)),n.texParameteri(E,n.TEXTURE_MIN_FILTER,b(P.minFilter)),P.minFilter!==Oe&&P.minFilter!==rn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),P.compareFunction&&(n.texParameteri(E,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(E,n.TEXTURE_COMPARE_FUNC,Q[P.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const dt=t.get("EXT_texture_filter_anisotropic");if(P.magFilter===Oe||P.minFilter!==na&&P.minFilter!==Ds||P.type===yi&&t.has("OES_texture_float_linear")===!1||r===!1&&P.type===Mo&&t.has("OES_texture_half_float_linear")===!1)return;(P.anisotropy>1||i.get(P).__currentAnisotropy)&&(n.texParameterf(E,dt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(P.anisotropy,s.getMaxAnisotropy())),i.get(P).__currentAnisotropy=P.anisotropy)}}function Y(E,P){let tt=!1;E.__webglInit===void 0&&(E.__webglInit=!0,P.addEventListener("dispose",w));const dt=P.source;let at=f.get(dt);at===void 0&&(at={},f.set(dt,at));const pt=D(P);if(pt!==E.__cacheKey){at[pt]===void 0&&(at[pt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,tt=!0),at[pt].usedTimes++;const gt=at[E.__cacheKey];gt!==void 0&&(at[E.__cacheKey].usedTimes--,gt.usedTimes===0&&T(P)),E.__cacheKey=pt,E.__webglTexture=at[pt].texture}return tt}function G(E,P,tt){let dt=n.TEXTURE_2D;(P.isDataArrayTexture||P.isCompressedArrayTexture)&&(dt=n.TEXTURE_2D_ARRAY),P.isData3DTexture&&(dt=n.TEXTURE_3D);const at=Y(E,P),pt=P.source;e.bindTexture(dt,E.__webglTexture,n.TEXTURE0+tt);const gt=i.get(pt);if(pt.version!==gt.__version||at===!0){e.activeTexture(n.TEXTURE0+tt);const vt=ie.getPrimaries(ie.workingColorSpace),xt=P.colorSpace===cn?null:ie.getPrimaries(P.colorSpace),wt=P.colorSpace===cn||vt===xt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const St=m(P)&&d(P.image)===!1;let ft=g(P.image,St,!1,s.maxTextureSize);ft=ut(P,ft);const At=d(ft)||r,It=o.convert(P.format,P.colorSpace);let Ct=o.convert(P.type),kt=v(P.internalFormat,It,Ct,P.colorSpace,P.isVideoTexture);U(dt,P,At);let Rt;const V=P.mipmaps,Tt=r&&P.isVideoTexture!==!0&&kt!==Yu,Ut=gt.__version===void 0||at===!0,nt=x(P,ft,At);if(P.isDepthTexture)kt=n.DEPTH_COMPONENT,r?P.type===yi?kt=n.DEPTH_COMPONENT32F:P.type===Mi?kt=n.DEPTH_COMPONENT24:P.type===Bi?kt=n.DEPTH24_STENCIL8:kt=n.DEPTH_COMPONENT16:P.type===yi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),P.format===Gi&&kt===n.DEPTH_COMPONENT&&P.type!==Oc&&P.type!==Mi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),P.type=Mi,Ct=o.convert(P.type)),P.format===Is&&kt===n.DEPTH_COMPONENT&&(kt=n.DEPTH_STENCIL,P.type!==Bi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),P.type=Bi,Ct=o.convert(P.type))),Ut&&(Tt?e.texStorage2D(n.TEXTURE_2D,1,kt,ft.width,ft.height):e.texImage2D(n.TEXTURE_2D,0,kt,ft.width,ft.height,0,It,Ct,null));else if(P.isDataTexture)if(V.length>0&&At){Tt&&Ut&&e.texStorage2D(n.TEXTURE_2D,nt,kt,V[0].width,V[0].height);for(let rt=0,H=V.length;rt<H;rt++)Rt=V[rt],Tt?e.texSubImage2D(n.TEXTURE_2D,rt,0,0,Rt.width,Rt.height,It,Ct,Rt.data):e.texImage2D(n.TEXTURE_2D,rt,kt,Rt.width,Rt.height,0,It,Ct,Rt.data);P.generateMipmaps=!1}else Tt?(Ut&&e.texStorage2D(n.TEXTURE_2D,nt,kt,ft.width,ft.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,ft.width,ft.height,It,Ct,ft.data)):e.texImage2D(n.TEXTURE_2D,0,kt,ft.width,ft.height,0,It,Ct,ft.data);else if(P.isCompressedTexture)if(P.isCompressedArrayTexture){Tt&&Ut&&e.texStorage3D(n.TEXTURE_2D_ARRAY,nt,kt,V[0].width,V[0].height,ft.depth);for(let rt=0,H=V.length;rt<H;rt++)Rt=V[rt],P.format!==Mn?It!==null?Tt?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,rt,0,0,0,Rt.width,Rt.height,ft.depth,It,Rt.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,rt,kt,Rt.width,Rt.height,ft.depth,0,Rt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Tt?e.texSubImage3D(n.TEXTURE_2D_ARRAY,rt,0,0,0,Rt.width,Rt.height,ft.depth,It,Ct,Rt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,rt,kt,Rt.width,Rt.height,ft.depth,0,It,Ct,Rt.data)}else{Tt&&Ut&&e.texStorage2D(n.TEXTURE_2D,nt,kt,V[0].width,V[0].height);for(let rt=0,H=V.length;rt<H;rt++)Rt=V[rt],P.format!==Mn?It!==null?Tt?e.compressedTexSubImage2D(n.TEXTURE_2D,rt,0,0,Rt.width,Rt.height,It,Rt.data):e.compressedTexImage2D(n.TEXTURE_2D,rt,kt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Tt?e.texSubImage2D(n.TEXTURE_2D,rt,0,0,Rt.width,Rt.height,It,Ct,Rt.data):e.texImage2D(n.TEXTURE_2D,rt,kt,Rt.width,Rt.height,0,It,Ct,Rt.data)}else if(P.isDataArrayTexture)Tt?(Ut&&e.texStorage3D(n.TEXTURE_2D_ARRAY,nt,kt,ft.width,ft.height,ft.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ft.width,ft.height,ft.depth,It,Ct,ft.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,kt,ft.width,ft.height,ft.depth,0,It,Ct,ft.data);else if(P.isData3DTexture)Tt?(Ut&&e.texStorage3D(n.TEXTURE_3D,nt,kt,ft.width,ft.height,ft.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ft.width,ft.height,ft.depth,It,Ct,ft.data)):e.texImage3D(n.TEXTURE_3D,0,kt,ft.width,ft.height,ft.depth,0,It,Ct,ft.data);else if(P.isFramebufferTexture){if(Ut)if(Tt)e.texStorage2D(n.TEXTURE_2D,nt,kt,ft.width,ft.height);else{let rt=ft.width,H=ft.height;for(let lt=0;lt<nt;lt++)e.texImage2D(n.TEXTURE_2D,lt,kt,rt,H,0,It,Ct,null),rt>>=1,H>>=1}}else if(V.length>0&&At){Tt&&Ut&&e.texStorage2D(n.TEXTURE_2D,nt,kt,V[0].width,V[0].height);for(let rt=0,H=V.length;rt<H;rt++)Rt=V[rt],Tt?e.texSubImage2D(n.TEXTURE_2D,rt,0,0,It,Ct,Rt):e.texImage2D(n.TEXTURE_2D,rt,kt,It,Ct,Rt);P.generateMipmaps=!1}else Tt?(Ut&&e.texStorage2D(n.TEXTURE_2D,nt,kt,ft.width,ft.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,It,Ct,ft)):e.texImage2D(n.TEXTURE_2D,0,kt,It,Ct,ft);y(P,At)&&M(dt),gt.__version=pt.version,P.onUpdate&&P.onUpdate(P)}E.__version=P.version}function $(E,P,tt){if(P.image.length!==6)return;const dt=Y(E,P),at=P.source;e.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+tt);const pt=i.get(at);if(at.version!==pt.__version||dt===!0){e.activeTexture(n.TEXTURE0+tt);const gt=ie.getPrimaries(ie.workingColorSpace),vt=P.colorSpace===cn?null:ie.getPrimaries(P.colorSpace),xt=P.colorSpace===cn||gt===vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const wt=P.isCompressedTexture||P.image[0].isCompressedTexture,St=P.image[0]&&P.image[0].isDataTexture,ft=[];for(let rt=0;rt<6;rt++)!wt&&!St?ft[rt]=g(P.image[rt],!1,!0,s.maxCubemapSize):ft[rt]=St?P.image[rt].image:P.image[rt],ft[rt]=ut(P,ft[rt]);const At=ft[0],It=d(At)||r,Ct=o.convert(P.format,P.colorSpace),kt=o.convert(P.type),Rt=v(P.internalFormat,Ct,kt,P.colorSpace),V=r&&P.isVideoTexture!==!0,Tt=pt.__version===void 0||dt===!0;let Ut=x(P,At,It);U(n.TEXTURE_CUBE_MAP,P,It);let nt;if(wt){V&&Tt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Ut,Rt,At.width,At.height);for(let rt=0;rt<6;rt++){nt=ft[rt].mipmaps;for(let H=0;H<nt.length;H++){const lt=nt[H];P.format!==Mn?Ct!==null?V?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H,0,0,lt.width,lt.height,Ct,lt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H,Rt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H,0,0,lt.width,lt.height,Ct,kt,lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H,Rt,lt.width,lt.height,0,Ct,kt,lt.data)}}}else{nt=P.mipmaps,V&&Tt&&(nt.length>0&&Ut++,e.texStorage2D(n.TEXTURE_CUBE_MAP,Ut,Rt,ft[0].width,ft[0].height));for(let rt=0;rt<6;rt++)if(St){V?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,ft[rt].width,ft[rt].height,Ct,kt,ft[rt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Rt,ft[rt].width,ft[rt].height,0,Ct,kt,ft[rt].data);for(let H=0;H<nt.length;H++){const bt=nt[H].image[rt].image;V?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H+1,0,0,bt.width,bt.height,Ct,kt,bt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H+1,Rt,bt.width,bt.height,0,Ct,kt,bt.data)}}else{V?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,Ct,kt,ft[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,Rt,Ct,kt,ft[rt]);for(let H=0;H<nt.length;H++){const lt=nt[H];V?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H+1,0,0,Ct,kt,lt.image[rt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+rt,H+1,Rt,Ct,kt,lt.image[rt])}}}y(P,It)&&M(n.TEXTURE_CUBE_MAP),pt.__version=at.version,P.onUpdate&&P.onUpdate(P)}E.__version=P.version}function J(E,P,tt,dt,at,pt){const gt=o.convert(tt.format,tt.colorSpace),vt=o.convert(tt.type),xt=v(tt.internalFormat,gt,vt,tt.colorSpace);if(!i.get(P).__hasExternalTextures){const St=Math.max(1,P.width>>pt),ft=Math.max(1,P.height>>pt);at===n.TEXTURE_3D||at===n.TEXTURE_2D_ARRAY?e.texImage3D(at,pt,xt,St,ft,P.depth,0,gt,vt,null):e.texImage2D(at,pt,xt,St,ft,0,gt,vt,null)}e.bindFramebuffer(n.FRAMEBUFFER,E),st(P)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,dt,at,i.get(tt).__webglTexture,0,et(P)):(at===n.TEXTURE_2D||at>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&at<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,dt,at,i.get(tt).__webglTexture,pt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function it(E,P,tt){if(n.bindRenderbuffer(n.RENDERBUFFER,E),P.depthBuffer&&!P.stencilBuffer){let dt=r===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(tt||st(P)){const at=P.depthTexture;at&&at.isDepthTexture&&(at.type===yi?dt=n.DEPTH_COMPONENT32F:at.type===Mi&&(dt=n.DEPTH_COMPONENT24));const pt=et(P);st(P)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,pt,dt,P.width,P.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,pt,dt,P.width,P.height)}else n.renderbufferStorage(n.RENDERBUFFER,dt,P.width,P.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,E)}else if(P.depthBuffer&&P.stencilBuffer){const dt=et(P);tt&&st(P)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,dt,n.DEPTH24_STENCIL8,P.width,P.height):st(P)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt,n.DEPTH24_STENCIL8,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,E)}else{const dt=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let at=0;at<dt.length;at++){const pt=dt[at],gt=o.convert(pt.format,pt.colorSpace),vt=o.convert(pt.type),xt=v(pt.internalFormat,gt,vt,pt.colorSpace),wt=et(P);tt&&st(P)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,wt,xt,P.width,P.height):st(P)?c.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,wt,xt,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,xt,P.width,P.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ot(E,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,E),!(P.depthTexture&&P.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(P.depthTexture).__webglTexture||P.depthTexture.image.width!==P.width||P.depthTexture.image.height!==P.height)&&(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),k(P.depthTexture,0);const dt=i.get(P.depthTexture).__webglTexture,at=et(P);if(P.depthTexture.format===Gi)st(P)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,dt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,dt,0);else if(P.depthTexture.format===Is)st(P)?c.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,dt,0,at):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function ct(E){const P=i.get(E),tt=E.isWebGLCubeRenderTarget===!0;if(E.depthTexture&&!P.__autoAllocateDepthBuffer){if(tt)throw new Error("target.depthTexture not supported in Cube render targets");ot(P.__webglFramebuffer,E)}else if(tt){P.__webglDepthbuffer=[];for(let dt=0;dt<6;dt++)e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer[dt]),P.__webglDepthbuffer[dt]=n.createRenderbuffer(),it(P.__webglDepthbuffer[dt],E,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer),P.__webglDepthbuffer=n.createRenderbuffer(),it(P.__webglDepthbuffer,E,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function K(E,P,tt){const dt=i.get(E);P!==void 0&&J(dt.__webglFramebuffer,E,E.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),tt!==void 0&&ct(E)}function F(E){const P=E.texture,tt=i.get(E),dt=i.get(P);E.addEventListener("dispose",L),E.isWebGLMultipleRenderTargets!==!0&&(dt.__webglTexture===void 0&&(dt.__webglTexture=n.createTexture()),dt.__version=P.version,a.memory.textures++);const at=E.isWebGLCubeRenderTarget===!0,pt=E.isWebGLMultipleRenderTargets===!0,gt=d(E)||r;if(at){tt.__webglFramebuffer=[];for(let vt=0;vt<6;vt++)if(r&&P.mipmaps&&P.mipmaps.length>0){tt.__webglFramebuffer[vt]=[];for(let xt=0;xt<P.mipmaps.length;xt++)tt.__webglFramebuffer[vt][xt]=n.createFramebuffer()}else tt.__webglFramebuffer[vt]=n.createFramebuffer()}else{if(r&&P.mipmaps&&P.mipmaps.length>0){tt.__webglFramebuffer=[];for(let vt=0;vt<P.mipmaps.length;vt++)tt.__webglFramebuffer[vt]=n.createFramebuffer()}else tt.__webglFramebuffer=n.createFramebuffer();if(pt)if(s.drawBuffers){const vt=E.texture;for(let xt=0,wt=vt.length;xt<wt;xt++){const St=i.get(vt[xt]);St.__webglTexture===void 0&&(St.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&E.samples>0&&st(E)===!1){const vt=pt?P:[P];tt.__webglMultisampledFramebuffer=n.createFramebuffer(),tt.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,tt.__webglMultisampledFramebuffer);for(let xt=0;xt<vt.length;xt++){const wt=vt[xt];tt.__webglColorRenderbuffer[xt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,tt.__webglColorRenderbuffer[xt]);const St=o.convert(wt.format,wt.colorSpace),ft=o.convert(wt.type),At=v(wt.internalFormat,St,ft,wt.colorSpace,E.isXRRenderTarget===!0),It=et(E);n.renderbufferStorageMultisample(n.RENDERBUFFER,It,At,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,tt.__webglColorRenderbuffer[xt])}n.bindRenderbuffer(n.RENDERBUFFER,null),E.depthBuffer&&(tt.__webglDepthRenderbuffer=n.createRenderbuffer(),it(tt.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(at){e.bindTexture(n.TEXTURE_CUBE_MAP,dt.__webglTexture),U(n.TEXTURE_CUBE_MAP,P,gt);for(let vt=0;vt<6;vt++)if(r&&P.mipmaps&&P.mipmaps.length>0)for(let xt=0;xt<P.mipmaps.length;xt++)J(tt.__webglFramebuffer[vt][xt],E,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+vt,xt);else J(tt.__webglFramebuffer[vt],E,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0);y(P,gt)&&M(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(pt){const vt=E.texture;for(let xt=0,wt=vt.length;xt<wt;xt++){const St=vt[xt],ft=i.get(St);e.bindTexture(n.TEXTURE_2D,ft.__webglTexture),U(n.TEXTURE_2D,St,gt),J(tt.__webglFramebuffer,E,St,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,0),y(St,gt)&&M(n.TEXTURE_2D)}e.unbindTexture()}else{let vt=n.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(r?vt=E.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(vt,dt.__webglTexture),U(vt,P,gt),r&&P.mipmaps&&P.mipmaps.length>0)for(let xt=0;xt<P.mipmaps.length;xt++)J(tt.__webglFramebuffer[xt],E,P,n.COLOR_ATTACHMENT0,vt,xt);else J(tt.__webglFramebuffer,E,P,n.COLOR_ATTACHMENT0,vt,0);y(P,gt)&&M(vt),e.unbindTexture()}E.depthBuffer&&ct(E)}function B(E){const P=d(E)||r,tt=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let dt=0,at=tt.length;dt<at;dt++){const pt=tt[dt];if(y(pt,P)){const gt=E.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,vt=i.get(pt).__webglTexture;e.bindTexture(gt,vt),M(gt),e.unbindTexture()}}}function W(E){if(r&&E.samples>0&&st(E)===!1){const P=E.isWebGLMultipleRenderTargets?E.texture:[E.texture],tt=E.width,dt=E.height;let at=n.COLOR_BUFFER_BIT;const pt=[],gt=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,vt=i.get(E),xt=E.isWebGLMultipleRenderTargets===!0;if(xt)for(let wt=0;wt<P.length;wt++)e.bindFramebuffer(n.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,vt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let wt=0;wt<P.length;wt++){pt.push(n.COLOR_ATTACHMENT0+wt),E.depthBuffer&&pt.push(gt);const St=vt.__ignoreDepthValues!==void 0?vt.__ignoreDepthValues:!1;if(St===!1&&(E.depthBuffer&&(at|=n.DEPTH_BUFFER_BIT),E.stencilBuffer&&(at|=n.STENCIL_BUFFER_BIT)),xt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,vt.__webglColorRenderbuffer[wt]),St===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[gt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[gt])),xt){const ft=i.get(P[wt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ft,0)}n.blitFramebuffer(0,0,tt,dt,0,0,tt,dt,at,n.NEAREST),l&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,pt)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),xt)for(let wt=0;wt<P.length;wt++){e.bindFramebuffer(n.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.RENDERBUFFER,vt.__webglColorRenderbuffer[wt]);const St=i.get(P[wt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,vt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wt,n.TEXTURE_2D,St,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}}function et(E){return Math.min(s.maxSamples,E.samples)}function st(E){const P=i.get(E);return r&&E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&P.__useRenderToTexture!==!1}function mt(E){const P=a.render.frame;h.get(E)!==P&&(h.set(E,P),E.update())}function ut(E,P){const tt=E.colorSpace,dt=E.format,at=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||E.format===hc||tt!==oi&&tt!==cn&&(ie.getTransfer(tt)===ce?r===!1?t.has("EXT_sRGB")===!0&&dt===Mn?(E.format=hc,E.minFilter=rn,E.generateMipmaps=!1):P=Qu.sRGBToLinear(P):(dt!==Mn||at!==ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",tt)),P}this.allocateTextureUnit=A,this.resetTextureUnits=O,this.setTexture2D=k,this.setTexture2DArray=I,this.setTexture3D=N,this.setTextureCube=z,this.rebindTextures=K,this.setupRenderTarget=F,this.updateRenderTargetMipmap=B,this.updateMultisampleRenderTarget=W,this.setupDepthRenderbuffer=ct,this.setupFrameBufferTexture=J,this.useMultisampledRTT=st}function K_(n,t,e){const i=e.isWebGL2;function s(o,a=cn){let r;const c=ie.getTransfer(a);if(o===ei)return n.UNSIGNED_BYTE;if(o===Vu)return n.UNSIGNED_SHORT_4_4_4_4;if(o===Wu)return n.UNSIGNED_SHORT_5_5_5_1;if(o===C0)return n.BYTE;if(o===k0)return n.SHORT;if(o===Oc)return n.UNSIGNED_SHORT;if(o===Hu)return n.INT;if(o===Mi)return n.UNSIGNED_INT;if(o===yi)return n.FLOAT;if(o===Mo)return i?n.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===D0)return n.ALPHA;if(o===Mn)return n.RGBA;if(o===I0)return n.LUMINANCE;if(o===U0)return n.LUMINANCE_ALPHA;if(o===Gi)return n.DEPTH_COMPONENT;if(o===Is)return n.DEPTH_STENCIL;if(o===hc)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===N0)return n.RED;if(o===ju)return n.RED_INTEGER;if(o===F0)return n.RG;if(o===qu)return n.RG_INTEGER;if(o===Xu)return n.RGBA_INTEGER;if(o===ia||o===sa||o===oa||o===ra)if(c===ce)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===ia)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===ia)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===sa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===oa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===yl||o===vl||o===xl||o===bl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===yl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===vl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===xl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===bl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Yu)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===wl||o===Sl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(o===wl)return c===ce?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===Sl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===El||o===Tl||o===Al||o===Rl||o===Pl||o===Ll||o===Cl||o===kl||o===Dl||o===Il||o===Ul||o===Nl||o===Fl||o===Ol)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(o===El)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Tl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Al)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Rl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Pl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===Ll)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===Cl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===kl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Dl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===Il)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===Ul)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===Nl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===Fl)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Ol)return c===ce?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===aa||o===zl||o===Bl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(o===aa)return c===ce?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===zl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===Bl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===O0||o===Gl||o===Hl||o===Vl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(o===aa)return r.COMPRESSED_RED_RGTC1_EXT;if(o===Gl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Hl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===Vl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Bi?i?n.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):n[o]!==void 0?n[o]:null}return{convert:s}}class Z_ extends an{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class yn extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const J_={type:"move"};class Ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new yn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new yn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new yn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,o=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const g of t.hand.values()){const d=e.getJointPose(g,i),m=this._getHandJoint(l,g);d!==null&&(m.matrix.fromArray(d.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=d.radius),m.visible=d!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,_=.005;l.inputState.pinching&&f>p+_?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-_&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,i),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(J_)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new yn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Q_ extends $i{constructor(t,e){super();const i=this;let s=null,o=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,f=null,p=null,_=null;const g=e.getContextAttributes();let d=null,m=null;const y=[],M=[],v=new Lt;let x=null;const b=new an;b.layers.enable(1),b.viewport=new De;const w=new an;w.layers.enable(2),w.viewport=new De;const L=[b,w],S=new Z_;S.layers.enable(1),S.layers.enable(2);let T=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let Y=y[U];return Y===void 0&&(Y=new Ca,y[U]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(U){let Y=y[U];return Y===void 0&&(Y=new Ca,y[U]=Y),Y.getGripSpace()},this.getHand=function(U){let Y=y[U];return Y===void 0&&(Y=new Ca,y[U]=Y),Y.getHandSpace()};function R(U){const Y=M.indexOf(U.inputSource);if(Y===-1)return;const G=y[Y];G!==void 0&&(G.update(U.inputSource,U.frame,l||a),G.dispatchEvent({type:U.type,data:U.inputSource}))}function O(){s.removeEventListener("select",R),s.removeEventListener("selectstart",R),s.removeEventListener("selectend",R),s.removeEventListener("squeeze",R),s.removeEventListener("squeezestart",R),s.removeEventListener("squeezeend",R),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",A);for(let U=0;U<y.length;U++){const Y=M[U];Y!==null&&(M[U]=null,y[U].disconnect(Y))}T=null,C=null,t.setRenderTarget(d),p=null,f=null,u=null,s=null,m=null,Q.stop(),i.isPresenting=!1,t.setPixelRatio(x),t.setSize(v.width,v.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){o=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){r=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(U){l=U},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(d=t.getRenderTarget(),s.addEventListener("select",R),s.addEventListener("selectstart",R),s.addEventListener("selectend",R),s.addEventListener("squeeze",R),s.addEventListener("squeezestart",R),s.addEventListener("squeezeend",R),s.addEventListener("end",O),s.addEventListener("inputsourceschange",A),g.xrCompatible!==!0&&await e.makeXRCompatible(),x=t.getPixelRatio(),t.getSize(v),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Y={antialias:s.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};p=new XRWebGLLayer(s,e,Y),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),m=new ji(p.framebufferWidth,p.framebufferHeight,{format:Mn,type:ei,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Y=null,G=null,$=null;g.depth&&($=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=g.stencil?Is:Gi,G=g.stencil?Bi:Mi);const J={colorFormat:e.RGBA8,depthFormat:$,scaleFactor:o};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(J),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),m=new ji(f.textureWidth,f.textureHeight,{format:Mn,type:ei,depthTexture:new uf(f.textureWidth,f.textureHeight,G,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const it=t.properties.get(m);it.__ignoreDepthValues=f.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(r),Q.setContext(s),Q.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function A(U){for(let Y=0;Y<U.removed.length;Y++){const G=U.removed[Y],$=M.indexOf(G);$>=0&&(M[$]=null,y[$].disconnect(G))}for(let Y=0;Y<U.added.length;Y++){const G=U.added[Y];let $=M.indexOf(G);if($===-1){for(let it=0;it<y.length;it++)if(it>=M.length){M.push(G),$=it;break}else if(M[it]===null){M[it]=G,$=it;break}if($===-1)break}const J=y[$];J&&J.connect(G)}}const D=new X,k=new X;function I(U,Y,G){D.setFromMatrixPosition(Y.matrixWorld),k.setFromMatrixPosition(G.matrixWorld);const $=D.distanceTo(k),J=Y.projectionMatrix.elements,it=G.projectionMatrix.elements,ot=J[14]/(J[10]-1),ct=J[14]/(J[10]+1),K=(J[9]+1)/J[5],F=(J[9]-1)/J[5],B=(J[8]-1)/J[0],W=(it[8]+1)/it[0],et=ot*B,st=ot*W,mt=$/(-B+W),ut=mt*-B;Y.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(ut),U.translateZ(mt),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert();const E=ot+mt,P=ct+mt,tt=et-ut,dt=st+($-ut),at=K*ct/P*E,pt=F*ct/P*E;U.projectionMatrix.makePerspective(tt,dt,at,pt,E,P),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}function N(U,Y){Y===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(Y.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;S.near=w.near=b.near=U.near,S.far=w.far=b.far=U.far,(T!==S.near||C!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),T=S.near,C=S.far);const Y=U.parent,G=S.cameras;N(S,Y);for(let $=0;$<G.length;$++)N(G[$],Y);G.length===2?I(S,b,w):S.projectionMatrix.copy(b.projectionMatrix),z(U,S,Y)};function z(U,Y,G){G===null?U.matrix.copy(Y.matrixWorld):(U.matrix.copy(G.matrixWorld),U.matrix.invert(),U.matrix.multiply(Y.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(Y.projectionMatrix),U.projectionMatrixInverse.copy(Y.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Rr*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(U){c=U,f!==null&&(f.fixedFoveation=U),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=U)};let q=null;function Z(U,Y){if(h=Y.getViewerPose(l||a),_=Y,h!==null){const G=h.views;p!==null&&(t.setRenderTargetFramebuffer(m,p.framebuffer),t.setRenderTarget(m));let $=!1;G.length!==S.cameras.length&&(S.cameras.length=0,$=!0);for(let J=0;J<G.length;J++){const it=G[J];let ot=null;if(p!==null)ot=p.getViewport(it);else{const K=u.getViewSubImage(f,it);ot=K.viewport,J===0&&(t.setRenderTargetTextures(m,K.colorTexture,f.ignoreDepthValues?void 0:K.depthStencilTexture),t.setRenderTarget(m))}let ct=L[J];ct===void 0&&(ct=new an,ct.layers.enable(J),ct.viewport=new De,L[J]=ct),ct.matrix.fromArray(it.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(it.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(ot.x,ot.y,ot.width,ot.height),J===0&&(S.matrix.copy(ct.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),$===!0&&S.cameras.push(ct)}}for(let G=0;G<y.length;G++){const $=M[G],J=y[G];$!==null&&J!==void 0&&J.update($,Y,l||a)}q&&q(U,Y),Y.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Y}),_=null}const Q=new lf;Q.setAnimationLoop(Z),this.setAnimationLoop=function(U){q=U},this.dispose=function(){}}}function tM(n,t){function e(d,m){d.matrixAutoUpdate===!0&&d.updateMatrix(),m.value.copy(d.matrix)}function i(d,m){m.color.getRGB(d.fogColor.value,rf(n)),m.isFog?(d.fogNear.value=m.near,d.fogFar.value=m.far):m.isFogExp2&&(d.fogDensity.value=m.density)}function s(d,m,y,M,v){m.isMeshBasicMaterial||m.isMeshLambertMaterial?o(d,m):m.isMeshToonMaterial?(o(d,m),u(d,m)):m.isMeshPhongMaterial?(o(d,m),h(d,m)):m.isMeshStandardMaterial?(o(d,m),f(d,m),m.isMeshPhysicalMaterial&&p(d,m,v)):m.isMeshMatcapMaterial?(o(d,m),_(d,m)):m.isMeshDepthMaterial?o(d,m):m.isMeshDistanceMaterial?(o(d,m),g(d,m)):m.isMeshNormalMaterial?o(d,m):m.isLineBasicMaterial?(a(d,m),m.isLineDashedMaterial&&r(d,m)):m.isPointsMaterial?c(d,m,y,M):m.isSpriteMaterial?l(d,m):m.isShadowMaterial?(d.color.value.copy(m.color),d.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function o(d,m){d.opacity.value=m.opacity,m.color&&d.diffuse.value.copy(m.color),m.emissive&&d.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(d.map.value=m.map,e(m.map,d.mapTransform)),m.alphaMap&&(d.alphaMap.value=m.alphaMap,e(m.alphaMap,d.alphaMapTransform)),m.bumpMap&&(d.bumpMap.value=m.bumpMap,e(m.bumpMap,d.bumpMapTransform),d.bumpScale.value=m.bumpScale,m.side===Ye&&(d.bumpScale.value*=-1)),m.normalMap&&(d.normalMap.value=m.normalMap,e(m.normalMap,d.normalMapTransform),d.normalScale.value.copy(m.normalScale),m.side===Ye&&d.normalScale.value.negate()),m.displacementMap&&(d.displacementMap.value=m.displacementMap,e(m.displacementMap,d.displacementMapTransform),d.displacementScale.value=m.displacementScale,d.displacementBias.value=m.displacementBias),m.emissiveMap&&(d.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,d.emissiveMapTransform)),m.specularMap&&(d.specularMap.value=m.specularMap,e(m.specularMap,d.specularMapTransform)),m.alphaTest>0&&(d.alphaTest.value=m.alphaTest);const y=t.get(m).envMap;if(y&&(d.envMap.value=y,d.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=m.reflectivity,d.ior.value=m.ior,d.refractionRatio.value=m.refractionRatio),m.lightMap){d.lightMap.value=m.lightMap;const M=n._useLegacyLights===!0?Math.PI:1;d.lightMapIntensity.value=m.lightMapIntensity*M,e(m.lightMap,d.lightMapTransform)}m.aoMap&&(d.aoMap.value=m.aoMap,d.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,d.aoMapTransform))}function a(d,m){d.diffuse.value.copy(m.color),d.opacity.value=m.opacity,m.map&&(d.map.value=m.map,e(m.map,d.mapTransform))}function r(d,m){d.dashSize.value=m.dashSize,d.totalSize.value=m.dashSize+m.gapSize,d.scale.value=m.scale}function c(d,m,y,M){d.diffuse.value.copy(m.color),d.opacity.value=m.opacity,d.size.value=m.size*y,d.scale.value=M*.5,m.map&&(d.map.value=m.map,e(m.map,d.uvTransform)),m.alphaMap&&(d.alphaMap.value=m.alphaMap,e(m.alphaMap,d.alphaMapTransform)),m.alphaTest>0&&(d.alphaTest.value=m.alphaTest)}function l(d,m){d.diffuse.value.copy(m.color),d.opacity.value=m.opacity,d.rotation.value=m.rotation,m.map&&(d.map.value=m.map,e(m.map,d.mapTransform)),m.alphaMap&&(d.alphaMap.value=m.alphaMap,e(m.alphaMap,d.alphaMapTransform)),m.alphaTest>0&&(d.alphaTest.value=m.alphaTest)}function h(d,m){d.specular.value.copy(m.specular),d.shininess.value=Math.max(m.shininess,1e-4)}function u(d,m){m.gradientMap&&(d.gradientMap.value=m.gradientMap)}function f(d,m){d.metalness.value=m.metalness,m.metalnessMap&&(d.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,d.metalnessMapTransform)),d.roughness.value=m.roughness,m.roughnessMap&&(d.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,d.roughnessMapTransform)),t.get(m).envMap&&(d.envMapIntensity.value=m.envMapIntensity)}function p(d,m,y){d.ior.value=m.ior,m.sheen>0&&(d.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),d.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(d.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,d.sheenColorMapTransform)),m.sheenRoughnessMap&&(d.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,d.sheenRoughnessMapTransform))),m.clearcoat>0&&(d.clearcoat.value=m.clearcoat,d.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(d.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,d.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(d.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ye&&d.clearcoatNormalScale.value.negate())),m.iridescence>0&&(d.iridescence.value=m.iridescence,d.iridescenceIOR.value=m.iridescenceIOR,d.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(d.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,d.iridescenceMapTransform)),m.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),m.transmission>0&&(d.transmission.value=m.transmission,d.transmissionSamplerMap.value=y.texture,d.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(d.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,d.transmissionMapTransform)),d.thickness.value=m.thickness,m.thicknessMap&&(d.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=m.attenuationDistance,d.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(d.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(d.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=m.specularIntensity,d.specularColor.value.copy(m.specularColor),m.specularColorMap&&(d.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,d.specularColorMapTransform)),m.specularIntensityMap&&(d.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,d.specularIntensityMapTransform))}function _(d,m){m.matcap&&(d.matcap.value=m.matcap)}function g(d,m){const y=t.get(m).light;d.referencePosition.value.setFromMatrixPosition(y.matrixWorld),d.nearDistance.value=y.shadow.camera.near,d.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function eM(n,t,e,i){let s={},o={},a=[];const r=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(y,M){const v=M.program;i.uniformBlockBinding(y,v)}function l(y,M){let v=s[y.id];v===void 0&&(_(y),v=h(y),s[y.id]=v,y.addEventListener("dispose",d));const x=M.program;i.updateUBOMapping(y,x);const b=t.render.frame;o[y.id]!==b&&(f(y),o[y.id]=b)}function h(y){const M=u();y.__bindingPointIndex=M;const v=n.createBuffer(),x=y.__size,b=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,x,b),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,v),v}function u(){for(let y=0;y<r;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const M=s[y.id],v=y.uniforms,x=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let b=0,w=v.length;b<w;b++){const L=Array.isArray(v[b])?v[b]:[v[b]];for(let S=0,T=L.length;S<T;S++){const C=L[S];if(p(C,b,S,x)===!0){const R=C.__offset,O=Array.isArray(C.value)?C.value:[C.value];let A=0;for(let D=0;D<O.length;D++){const k=O[D],I=g(k);typeof k=="number"||typeof k=="boolean"?(C.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,R+A,C.__data)):k.isMatrix3?(C.__data[0]=k.elements[0],C.__data[1]=k.elements[1],C.__data[2]=k.elements[2],C.__data[3]=0,C.__data[4]=k.elements[3],C.__data[5]=k.elements[4],C.__data[6]=k.elements[5],C.__data[7]=0,C.__data[8]=k.elements[6],C.__data[9]=k.elements[7],C.__data[10]=k.elements[8],C.__data[11]=0):(k.toArray(C.__data,A),A+=I.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,R,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(y,M,v,x){const b=y.value,w=M+"_"+v;if(x[w]===void 0)return typeof b=="number"||typeof b=="boolean"?x[w]=b:x[w]=b.clone(),!0;{const L=x[w];if(typeof b=="number"||typeof b=="boolean"){if(L!==b)return x[w]=b,!0}else if(L.equals(b)===!1)return L.copy(b),!0}return!1}function _(y){const M=y.uniforms;let v=0;const x=16;for(let w=0,L=M.length;w<L;w++){const S=Array.isArray(M[w])?M[w]:[M[w]];for(let T=0,C=S.length;T<C;T++){const R=S[T],O=Array.isArray(R.value)?R.value:[R.value];for(let A=0,D=O.length;A<D;A++){const k=O[A],I=g(k),N=v%x;N!==0&&x-N<I.boundary&&(v+=x-N),R.__data=new Float32Array(I.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=v,v+=I.storage}}}const b=v%x;return b>0&&(v+=x-b),y.__size=v,y.__cache={},this}function g(y){const M={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(M.boundary=4,M.storage=4):y.isVector2?(M.boundary=8,M.storage=8):y.isVector3||y.isColor?(M.boundary=16,M.storage=12):y.isVector4?(M.boundary=16,M.storage=16):y.isMatrix3?(M.boundary=48,M.storage=48):y.isMatrix4?(M.boundary=64,M.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),M}function d(y){const M=y.target;M.removeEventListener("dispose",d);const v=a.indexOf(M.__bindingPointIndex);a.splice(v,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete o[M.id]}function m(){for(const y in s)n.deleteBuffer(s[y]);a=[],s={},o={}}return{bind:c,update:l,dispose:m}}class _f{constructor(t={}){const{canvas:e=Z0(),context:i=null,depth:s=!0,stencil:o=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;i!==null?f=i.getContextAttributes().alpha:f=a;const p=new Uint32Array(4),_=new Int32Array(4);let g=null,d=null;const m=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ae,this._useLegacyLights=!1,this.toneMapping=ti,this.toneMappingExposure=1;const M=this;let v=!1,x=0,b=0,w=null,L=-1,S=null;const T=new De,C=new De;let R=null;const O=new qt(0);let A=0,D=e.width,k=e.height,I=1,N=null,z=null;const q=new De(0,0,D,k),Z=new De(0,0,D,k);let Q=!1;const U=new Gc;let Y=!1,G=!1,$=null;const J=new ae,it=new Lt,ot=new X,ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function K(){return w===null?I:1}let F=i;function B(j,ht){for(let _t=0;_t<j.length;_t++){const yt=j[_t],Mt=e.getContext(yt,ht);if(Mt!==null)return Mt}return null}try{const j={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Fc}`),e.addEventListener("webglcontextlost",rt,!1),e.addEventListener("webglcontextrestored",H,!1),e.addEventListener("webglcontextcreationerror",lt,!1),F===null){const ht=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&ht.shift(),F=B(ht,j),F===null)throw B(ht)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&F instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),F.getShaderPrecisionFormat===void 0&&(F.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(j){throw console.error("THREE.WebGLRenderer: "+j.message),j}let W,et,st,mt,ut,E,P,tt,dt,at,pt,gt,vt,xt,wt,St,ft,At,It,Ct,kt,Rt,V,Tt;function Ut(){W=new u1(F),et=new o1(F,W,t),W.init(et),Rt=new K_(F,W,et),st=new Y_(F,W,et),mt=new p1(F),ut=new I_,E=new $_(F,W,st,ut,et,Rt,mt),P=new a1(M),tt=new h1(M),dt=new bp(F,et),V=new i1(F,W,dt,et),at=new f1(F,dt,mt,V),pt=new M1(F,at,dt,mt),It=new _1(F,et,E),St=new r1(ut),gt=new D_(M,P,tt,W,et,V,St),vt=new tM(M,ut),xt=new N_,wt=new H_(W,et),At=new n1(M,P,tt,st,pt,f,c),ft=new X_(M,pt,et),Tt=new eM(F,mt,et,st),Ct=new s1(F,W,mt,et),kt=new d1(F,W,mt,et),mt.programs=gt.programs,M.capabilities=et,M.extensions=W,M.properties=ut,M.renderLists=xt,M.shadowMap=ft,M.state=st,M.info=mt}Ut();const nt=new Q_(M,F);this.xr=nt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const j=W.get("WEBGL_lose_context");j&&j.loseContext()},this.forceContextRestore=function(){const j=W.get("WEBGL_lose_context");j&&j.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(j){j!==void 0&&(I=j,this.setSize(D,k,!1))},this.getSize=function(j){return j.set(D,k)},this.setSize=function(j,ht,_t=!0){if(nt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=j,k=ht,e.width=Math.floor(j*I),e.height=Math.floor(ht*I),_t===!0&&(e.style.width=j+"px",e.style.height=ht+"px"),this.setViewport(0,0,j,ht)},this.getDrawingBufferSize=function(j){return j.set(D*I,k*I).floor()},this.setDrawingBufferSize=function(j,ht,_t){D=j,k=ht,I=_t,e.width=Math.floor(j*_t),e.height=Math.floor(ht*_t),this.setViewport(0,0,j,ht)},this.getCurrentViewport=function(j){return j.copy(T)},this.getViewport=function(j){return j.copy(q)},this.setViewport=function(j,ht,_t,yt){j.isVector4?q.set(j.x,j.y,j.z,j.w):q.set(j,ht,_t,yt),st.viewport(T.copy(q).multiplyScalar(I).floor())},this.getScissor=function(j){return j.copy(Z)},this.setScissor=function(j,ht,_t,yt){j.isVector4?Z.set(j.x,j.y,j.z,j.w):Z.set(j,ht,_t,yt),st.scissor(C.copy(Z).multiplyScalar(I).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(j){st.setScissorTest(Q=j)},this.setOpaqueSort=function(j){N=j},this.setTransparentSort=function(j){z=j},this.getClearColor=function(j){return j.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor.apply(At,arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha.apply(At,arguments)},this.clear=function(j=!0,ht=!0,_t=!0){let yt=0;if(j){let Mt=!1;if(w!==null){const Ft=w.texture.format;Mt=Ft===Xu||Ft===qu||Ft===ju}if(Mt){const Ft=w.texture.type,zt=Ft===ei||Ft===Mi||Ft===Oc||Ft===Bi||Ft===Vu||Ft===Wu,Ht=At.getClearColor(),Vt=At.getClearAlpha(),Kt=Ht.r,jt=Ht.g,Xt=Ht.b;zt?(p[0]=Kt,p[1]=jt,p[2]=Xt,p[3]=Vt,F.clearBufferuiv(F.COLOR,0,p)):(_[0]=Kt,_[1]=jt,_[2]=Xt,_[3]=Vt,F.clearBufferiv(F.COLOR,0,_))}else yt|=F.COLOR_BUFFER_BIT}ht&&(yt|=F.DEPTH_BUFFER_BIT),_t&&(yt|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(yt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",rt,!1),e.removeEventListener("webglcontextrestored",H,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),xt.dispose(),wt.dispose(),ut.dispose(),P.dispose(),tt.dispose(),pt.dispose(),V.dispose(),Tt.dispose(),gt.dispose(),nt.dispose(),nt.removeEventListener("sessionstart",te),nt.removeEventListener("sessionend",Wt),$&&($.dispose(),$=null),ee.stop()};function rt(j){j.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),v=!0}function H(){console.log("THREE.WebGLRenderer: Context Restored."),v=!1;const j=mt.autoReset,ht=ft.enabled,_t=ft.autoUpdate,yt=ft.needsUpdate,Mt=ft.type;Ut(),mt.autoReset=j,ft.enabled=ht,ft.autoUpdate=_t,ft.needsUpdate=yt,ft.type=Mt}function lt(j){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",j.statusMessage)}function bt(j){const ht=j.target;ht.removeEventListener("dispose",bt),Et(ht)}function Et(j){Pt(j),ut.remove(j)}function Pt(j){const ht=ut.get(j).programs;ht!==void 0&&(ht.forEach(function(_t){gt.releaseProgram(_t)}),j.isShaderMaterial&&gt.releaseShaderCache(j))}this.renderBufferDirect=function(j,ht,_t,yt,Mt,Ft){ht===null&&(ht=ct);const zt=Mt.isMesh&&Mt.matrixWorld.determinant()<0,Ht=He(j,ht,_t,yt,Mt);st.setMaterial(yt,zt);let Vt=_t.index,Kt=1;if(yt.wireframe===!0){if(Vt=at.getWireframeAttribute(_t),Vt===void 0)return;Kt=2}const jt=_t.drawRange,Xt=_t.attributes.position;let be=jt.start*Kt,nn=(jt.start+jt.count)*Kt;Ft!==null&&(be=Math.max(be,Ft.start*Kt),nn=Math.min(nn,(Ft.start+Ft.count)*Kt)),Vt!==null?(be=Math.max(be,0),nn=Math.min(nn,Vt.count)):Xt!=null&&(be=Math.max(be,0),nn=Math.min(nn,Xt.count));const Ce=nn-be;if(Ce<0||Ce===1/0)return;V.setup(Mt,yt,Ht,_t,Vt);let Wn,pe=Ct;if(Vt!==null&&(Wn=dt.get(Vt),pe=kt,pe.setIndex(Wn)),Mt.isMesh)yt.wireframe===!0?(st.setLineWidth(yt.wireframeLinewidth*K()),pe.setMode(F.LINES)):pe.setMode(F.TRIANGLES);else if(Mt.isLine){let Zt=yt.linewidth;Zt===void 0&&(Zt=1),st.setLineWidth(Zt*K()),Mt.isLineSegments?pe.setMode(F.LINES):Mt.isLineLoop?pe.setMode(F.LINE_LOOP):pe.setMode(F.LINE_STRIP)}else Mt.isPoints?pe.setMode(F.POINTS):Mt.isSprite&&pe.setMode(F.TRIANGLES);if(Mt.isBatchedMesh)pe.renderMultiDraw(Mt._multiDrawStarts,Mt._multiDrawCounts,Mt._multiDrawCount);else if(Mt.isInstancedMesh)pe.renderInstances(be,Ce,Mt.count);else if(_t.isInstancedBufferGeometry){const Zt=_t._maxInstanceCount!==void 0?_t._maxInstanceCount:1/0,Jr=Math.min(_t.instanceCount,Zt);pe.renderInstances(be,Ce,Jr)}else pe.render(be,Ce)};function Ot(j,ht,_t){j.transparent===!0&&j.side===Un&&j.forceSinglePass===!1?(j.side=Ye,j.needsUpdate=!0,ci(j,ht,_t),j.side=wi,j.needsUpdate=!0,ci(j,ht,_t),j.side=Un):ci(j,ht,_t)}this.compile=function(j,ht,_t=null){_t===null&&(_t=j),d=wt.get(_t),d.init(),y.push(d),_t.traverseVisible(function(Mt){Mt.isLight&&Mt.layers.test(ht.layers)&&(d.pushLight(Mt),Mt.castShadow&&d.pushShadow(Mt))}),j!==_t&&j.traverseVisible(function(Mt){Mt.isLight&&Mt.layers.test(ht.layers)&&(d.pushLight(Mt),Mt.castShadow&&d.pushShadow(Mt))}),d.setupLights(M._useLegacyLights);const yt=new Set;return j.traverse(function(Mt){const Ft=Mt.material;if(Ft)if(Array.isArray(Ft))for(let zt=0;zt<Ft.length;zt++){const Ht=Ft[zt];Ot(Ht,_t,Mt),yt.add(Ht)}else Ot(Ft,_t,Mt),yt.add(Ft)}),y.pop(),d=null,yt},this.compileAsync=function(j,ht,_t=null){const yt=this.compile(j,ht,_t);return new Promise(Mt=>{function Ft(){if(yt.forEach(function(zt){ut.get(zt).currentProgram.isReady()&&yt.delete(zt)}),yt.size===0){Mt(j);return}setTimeout(Ft,10)}W.get("KHR_parallel_shader_compile")!==null?Ft():setTimeout(Ft,10)})};let Bt=null;function Qt(j){Bt&&Bt(j)}function te(){ee.stop()}function Wt(){ee.start()}const ee=new lf;ee.setAnimationLoop(Qt),typeof self<"u"&&ee.setContext(self),this.setAnimationLoop=function(j){Bt=j,nt.setAnimationLoop(j),j===null?ee.stop():ee.start()},nt.addEventListener("sessionstart",te),nt.addEventListener("sessionend",Wt),this.render=function(j,ht){if(ht!==void 0&&ht.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(v===!0)return;j.matrixWorldAutoUpdate===!0&&j.updateMatrixWorld(),ht.parent===null&&ht.matrixWorldAutoUpdate===!0&&ht.updateMatrixWorld(),nt.enabled===!0&&nt.isPresenting===!0&&(nt.cameraAutoUpdate===!0&&nt.updateCamera(ht),ht=nt.getCamera()),j.isScene===!0&&j.onBeforeRender(M,j,ht,w),d=wt.get(j,y.length),d.init(),y.push(d),J.multiplyMatrices(ht.projectionMatrix,ht.matrixWorldInverse),U.setFromProjectionMatrix(J),G=this.localClippingEnabled,Y=St.init(this.clippingPlanes,G),g=xt.get(j,m.length),g.init(),m.push(g),de(j,ht,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(N,z),this.info.render.frame++,Y===!0&&St.beginShadows();const _t=d.state.shadowsArray;if(ft.render(_t,j,ht),Y===!0&&St.endShadows(),this.info.autoReset===!0&&this.info.reset(),At.render(g,j),d.setupLights(M._useLegacyLights),ht.isArrayCamera){const yt=ht.cameras;for(let Mt=0,Ft=yt.length;Mt<Ft;Mt++){const zt=yt[Mt];Vn(g,j,zt,zt.viewport)}}else Vn(g,j,ht);w!==null&&(E.updateMultisampleRenderTarget(w),E.updateRenderTargetMipmap(w)),j.isScene===!0&&j.onAfterRender(M,j,ht),V.resetDefaultState(),L=-1,S=null,y.pop(),y.length>0?d=y[y.length-1]:d=null,m.pop(),m.length>0?g=m[m.length-1]:g=null};function de(j,ht,_t,yt){if(j.visible===!1)return;if(j.layers.test(ht.layers)){if(j.isGroup)_t=j.renderOrder;else if(j.isLOD)j.autoUpdate===!0&&j.update(ht);else if(j.isLight)d.pushLight(j),j.castShadow&&d.pushShadow(j);else if(j.isSprite){if(!j.frustumCulled||U.intersectsSprite(j)){yt&&ot.setFromMatrixPosition(j.matrixWorld).applyMatrix4(J);const zt=pt.update(j),Ht=j.material;Ht.visible&&g.push(j,zt,Ht,_t,ot.z,null)}}else if((j.isMesh||j.isLine||j.isPoints)&&(!j.frustumCulled||U.intersectsObject(j))){const zt=pt.update(j),Ht=j.material;if(yt&&(j.boundingSphere!==void 0?(j.boundingSphere===null&&j.computeBoundingSphere(),ot.copy(j.boundingSphere.center)):(zt.boundingSphere===null&&zt.computeBoundingSphere(),ot.copy(zt.boundingSphere.center)),ot.applyMatrix4(j.matrixWorld).applyMatrix4(J)),Array.isArray(Ht)){const Vt=zt.groups;for(let Kt=0,jt=Vt.length;Kt<jt;Kt++){const Xt=Vt[Kt],be=Ht[Xt.materialIndex];be&&be.visible&&g.push(j,zt,be,_t,ot.z,Xt)}}else Ht.visible&&g.push(j,zt,Ht,_t,ot.z,null)}}const Ft=j.children;for(let zt=0,Ht=Ft.length;zt<Ht;zt++)de(Ft[zt],ht,_t,yt)}function Vn(j,ht,_t,yt){const Mt=j.opaque,Ft=j.transmissive,zt=j.transparent;d.setupLightsView(_t),Y===!0&&St.setGlobalState(M.clippingPlanes,_t),Ft.length>0&&Ue(Mt,Ft,ht,_t),yt&&st.viewport(T.copy(yt)),Mt.length>0&&Ln(Mt,ht,_t),Ft.length>0&&Ln(Ft,ht,_t),zt.length>0&&Ln(zt,ht,_t),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function Ue(j,ht,_t,yt){if((_t.isScene===!0?_t.overrideMaterial:null)!==null)return;const Ft=et.isWebGL2;$===null&&($=new ji(1,1,{generateMipmaps:!0,type:W.has("EXT_color_buffer_half_float")?Mo:ei,minFilter:Ds,samples:Ft?4:0})),M.getDrawingBufferSize(it),Ft?$.setSize(it.x,it.y):$.setSize(uc(it.x),uc(it.y));const zt=M.getRenderTarget();M.setRenderTarget($),M.getClearColor(O),A=M.getClearAlpha(),A<1&&M.setClearColor(16777215,.5),M.clear();const Ht=M.toneMapping;M.toneMapping=ti,Ln(j,_t,yt),E.updateMultisampleRenderTarget($),E.updateRenderTargetMipmap($);let Vt=!1;for(let Kt=0,jt=ht.length;Kt<jt;Kt++){const Xt=ht[Kt],be=Xt.object,nn=Xt.geometry,Ce=Xt.material,Wn=Xt.group;if(Ce.side===Un&&be.layers.test(yt.layers)){const pe=Ce.side;Ce.side=Ye,Ce.needsUpdate=!0,ai(be,_t,yt,nn,Ce,Wn),Ce.side=pe,Ce.needsUpdate=!0,Vt=!0}}Vt===!0&&(E.updateMultisampleRenderTarget($),E.updateRenderTargetMipmap($)),M.setRenderTarget(zt),M.setClearColor(O,A),M.toneMapping=Ht}function Ln(j,ht,_t){const yt=ht.isScene===!0?ht.overrideMaterial:null;for(let Mt=0,Ft=j.length;Mt<Ft;Mt++){const zt=j[Mt],Ht=zt.object,Vt=zt.geometry,Kt=yt===null?zt.material:yt,jt=zt.group;Ht.layers.test(_t.layers)&&ai(Ht,ht,_t,Vt,Kt,jt)}}function ai(j,ht,_t,yt,Mt,Ft){j.onBeforeRender(M,ht,_t,yt,Mt,Ft),j.modelViewMatrix.multiplyMatrices(_t.matrixWorldInverse,j.matrixWorld),j.normalMatrix.getNormalMatrix(j.modelViewMatrix),Mt.onBeforeRender(M,ht,_t,yt,j,Ft),Mt.transparent===!0&&Mt.side===Un&&Mt.forceSinglePass===!1?(Mt.side=Ye,Mt.needsUpdate=!0,M.renderBufferDirect(_t,ht,yt,Mt,j,Ft),Mt.side=wi,Mt.needsUpdate=!0,M.renderBufferDirect(_t,ht,yt,Mt,j,Ft),Mt.side=Un):M.renderBufferDirect(_t,ht,yt,Mt,j,Ft),j.onAfterRender(M,ht,_t,yt,Mt,Ft)}function ci(j,ht,_t){ht.isScene!==!0&&(ht=ct);const yt=ut.get(j),Mt=d.state.lights,Ft=d.state.shadowsArray,zt=Mt.state.version,Ht=gt.getParameters(j,Mt.state,Ft,ht,_t),Vt=gt.getProgramCacheKey(Ht);let Kt=yt.programs;yt.environment=j.isMeshStandardMaterial?ht.environment:null,yt.fog=ht.fog,yt.envMap=(j.isMeshStandardMaterial?tt:P).get(j.envMap||yt.environment),Kt===void 0&&(j.addEventListener("dispose",bt),Kt=new Map,yt.programs=Kt);let jt=Kt.get(Vt);if(jt!==void 0){if(yt.currentProgram===jt&&yt.lightsStateVersion===zt)return Ne(j,Ht),jt}else Ht.uniforms=gt.getUniforms(j),j.onBuild(_t,Ht,M),j.onBeforeCompile(Ht,M),jt=gt.acquireProgram(Ht,Vt),Kt.set(Vt,jt),yt.uniforms=Ht.uniforms;const Xt=yt.uniforms;return(!j.isShaderMaterial&&!j.isRawShaderMaterial||j.clipping===!0)&&(Xt.clippingPlanes=St.uniform),Ne(j,Ht),yt.needsLights=pn(j),yt.lightsStateVersion=zt,yt.needsLights&&(Xt.ambientLightColor.value=Mt.state.ambient,Xt.lightProbe.value=Mt.state.probe,Xt.directionalLights.value=Mt.state.directional,Xt.directionalLightShadows.value=Mt.state.directionalShadow,Xt.spotLights.value=Mt.state.spot,Xt.spotLightShadows.value=Mt.state.spotShadow,Xt.rectAreaLights.value=Mt.state.rectArea,Xt.ltc_1.value=Mt.state.rectAreaLTC1,Xt.ltc_2.value=Mt.state.rectAreaLTC2,Xt.pointLights.value=Mt.state.point,Xt.pointLightShadows.value=Mt.state.pointShadow,Xt.hemisphereLights.value=Mt.state.hemi,Xt.directionalShadowMap.value=Mt.state.directionalShadowMap,Xt.directionalShadowMatrix.value=Mt.state.directionalShadowMatrix,Xt.spotShadowMap.value=Mt.state.spotShadowMap,Xt.spotLightMatrix.value=Mt.state.spotLightMatrix,Xt.spotLightMap.value=Mt.state.spotLightMap,Xt.pointShadowMap.value=Mt.state.pointShadowMap,Xt.pointShadowMatrix.value=Mt.state.pointShadowMatrix),yt.currentProgram=jt,yt.uniformsList=null,jt}function Ys(j){if(j.uniformsList===null){const ht=j.currentProgram.getUniforms();j.uniformsList=_r.seqWithValue(ht.seq,j.uniforms)}return j.uniformsList}function Ne(j,ht){const _t=ut.get(j);_t.outputColorSpace=ht.outputColorSpace,_t.batching=ht.batching,_t.instancing=ht.instancing,_t.instancingColor=ht.instancingColor,_t.skinning=ht.skinning,_t.morphTargets=ht.morphTargets,_t.morphNormals=ht.morphNormals,_t.morphColors=ht.morphColors,_t.morphTargetsCount=ht.morphTargetsCount,_t.numClippingPlanes=ht.numClippingPlanes,_t.numIntersection=ht.numClipIntersection,_t.vertexAlphas=ht.vertexAlphas,_t.vertexTangents=ht.vertexTangents,_t.toneMapping=ht.toneMapping}function He(j,ht,_t,yt,Mt){ht.isScene!==!0&&(ht=ct),E.resetTextureUnits();const Ft=ht.fog,zt=yt.isMeshStandardMaterial?ht.environment:null,Ht=w===null?M.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:oi,Vt=(yt.isMeshStandardMaterial?tt:P).get(yt.envMap||zt),Kt=yt.vertexColors===!0&&!!_t.attributes.color&&_t.attributes.color.itemSize===4,jt=!!_t.attributes.tangent&&(!!yt.normalMap||yt.anisotropy>0),Xt=!!_t.morphAttributes.position,be=!!_t.morphAttributes.normal,nn=!!_t.morphAttributes.color;let Ce=ti;yt.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Ce=M.toneMapping);const Wn=_t.morphAttributes.position||_t.morphAttributes.normal||_t.morphAttributes.color,pe=Wn!==void 0?Wn.length:0,Zt=ut.get(yt),Jr=d.state.lights;if(Y===!0&&(G===!0||j!==S)){const mn=j===S&&yt.id===L;St.setState(yt,j,mn)}let Me=!1;yt.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==Jr.state.version||Zt.outputColorSpace!==Ht||Mt.isBatchedMesh&&Zt.batching===!1||!Mt.isBatchedMesh&&Zt.batching===!0||Mt.isInstancedMesh&&Zt.instancing===!1||!Mt.isInstancedMesh&&Zt.instancing===!0||Mt.isSkinnedMesh&&Zt.skinning===!1||!Mt.isSkinnedMesh&&Zt.skinning===!0||Mt.isInstancedMesh&&Zt.instancingColor===!0&&Mt.instanceColor===null||Mt.isInstancedMesh&&Zt.instancingColor===!1&&Mt.instanceColor!==null||Zt.envMap!==Vt||yt.fog===!0&&Zt.fog!==Ft||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==St.numPlanes||Zt.numIntersection!==St.numIntersection)||Zt.vertexAlphas!==Kt||Zt.vertexTangents!==jt||Zt.morphTargets!==Xt||Zt.morphNormals!==be||Zt.morphColors!==nn||Zt.toneMapping!==Ce||et.isWebGL2===!0&&Zt.morphTargetsCount!==pe)&&(Me=!0):(Me=!0,Zt.__version=yt.version);let Ti=Zt.currentProgram;Me===!0&&(Ti=ci(yt,ht,Mt));let cl=!1,$s=!1,Qr=!1;const Ve=Ti.getUniforms(),Ai=Zt.uniforms;if(st.useProgram(Ti.program)&&(cl=!0,$s=!0,Qr=!0),yt.id!==L&&(L=yt.id,$s=!0),cl||S!==j){Ve.setValue(F,"projectionMatrix",j.projectionMatrix),Ve.setValue(F,"viewMatrix",j.matrixWorldInverse);const mn=Ve.map.cameraPosition;mn!==void 0&&mn.setValue(F,ot.setFromMatrixPosition(j.matrixWorld)),et.logarithmicDepthBuffer&&Ve.setValue(F,"logDepthBufFC",2/(Math.log(j.far+1)/Math.LN2)),(yt.isMeshPhongMaterial||yt.isMeshToonMaterial||yt.isMeshLambertMaterial||yt.isMeshBasicMaterial||yt.isMeshStandardMaterial||yt.isShaderMaterial)&&Ve.setValue(F,"isOrthographic",j.isOrthographicCamera===!0),S!==j&&(S=j,$s=!0,Qr=!0)}if(Mt.isSkinnedMesh){Ve.setOptional(F,Mt,"bindMatrix"),Ve.setOptional(F,Mt,"bindMatrixInverse");const mn=Mt.skeleton;mn&&(et.floatVertexTextures?(mn.boneTexture===null&&mn.computeBoneTexture(),Ve.setValue(F,"boneTexture",mn.boneTexture,E)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Mt.isBatchedMesh&&(Ve.setOptional(F,Mt,"batchingTexture"),Ve.setValue(F,"batchingTexture",Mt._matricesTexture,E));const ta=_t.morphAttributes;if((ta.position!==void 0||ta.normal!==void 0||ta.color!==void 0&&et.isWebGL2===!0)&&It.update(Mt,_t,Ti),($s||Zt.receiveShadow!==Mt.receiveShadow)&&(Zt.receiveShadow=Mt.receiveShadow,Ve.setValue(F,"receiveShadow",Mt.receiveShadow)),yt.isMeshGouraudMaterial&&yt.envMap!==null&&(Ai.envMap.value=Vt,Ai.flipEnvMap.value=Vt.isCubeTexture&&Vt.isRenderTargetTexture===!1?-1:1),$s&&(Ve.setValue(F,"toneMappingExposure",M.toneMappingExposure),Zt.needsLights&&dn(Ai,Qr),Ft&&yt.fog===!0&&vt.refreshFogUniforms(Ai,Ft),vt.refreshMaterialUniforms(Ai,yt,I,k,$),_r.upload(F,Ys(Zt),Ai,E)),yt.isShaderMaterial&&yt.uniformsNeedUpdate===!0&&(_r.upload(F,Ys(Zt),Ai,E),yt.uniformsNeedUpdate=!1),yt.isSpriteMaterial&&Ve.setValue(F,"center",Mt.center),Ve.setValue(F,"modelViewMatrix",Mt.modelViewMatrix),Ve.setValue(F,"normalMatrix",Mt.normalMatrix),Ve.setValue(F,"modelMatrix",Mt.matrixWorld),yt.isShaderMaterial||yt.isRawShaderMaterial){const mn=yt.uniformsGroups;for(let ea=0,Vd=mn.length;ea<Vd;ea++)if(et.isWebGL2){const ll=mn[ea];Tt.update(ll,Ti),Tt.bind(ll,Ti)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ti}function dn(j,ht){j.ambientLightColor.needsUpdate=ht,j.lightProbe.needsUpdate=ht,j.directionalLights.needsUpdate=ht,j.directionalLightShadows.needsUpdate=ht,j.pointLights.needsUpdate=ht,j.pointLightShadows.needsUpdate=ht,j.spotLights.needsUpdate=ht,j.spotLightShadows.needsUpdate=ht,j.rectAreaLights.needsUpdate=ht,j.hemisphereLights.needsUpdate=ht}function pn(j){return j.isMeshLambertMaterial||j.isMeshToonMaterial||j.isMeshPhongMaterial||j.isMeshStandardMaterial||j.isShadowMaterial||j.isShaderMaterial&&j.lights===!0}this.getActiveCubeFace=function(){return x},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(j,ht,_t){ut.get(j.texture).__webglTexture=ht,ut.get(j.depthTexture).__webglTexture=_t;const yt=ut.get(j);yt.__hasExternalTextures=!0,yt.__hasExternalTextures&&(yt.__autoAllocateDepthBuffer=_t===void 0,yt.__autoAllocateDepthBuffer||W.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),yt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(j,ht){const _t=ut.get(j);_t.__webglFramebuffer=ht,_t.__useDefaultFramebuffer=ht===void 0},this.setRenderTarget=function(j,ht=0,_t=0){w=j,x=ht,b=_t;let yt=!0,Mt=null,Ft=!1,zt=!1;if(j){const Vt=ut.get(j);Vt.__useDefaultFramebuffer!==void 0?(st.bindFramebuffer(F.FRAMEBUFFER,null),yt=!1):Vt.__webglFramebuffer===void 0?E.setupRenderTarget(j):Vt.__hasExternalTextures&&E.rebindTextures(j,ut.get(j.texture).__webglTexture,ut.get(j.depthTexture).__webglTexture);const Kt=j.texture;(Kt.isData3DTexture||Kt.isDataArrayTexture||Kt.isCompressedArrayTexture)&&(zt=!0);const jt=ut.get(j).__webglFramebuffer;j.isWebGLCubeRenderTarget?(Array.isArray(jt[ht])?Mt=jt[ht][_t]:Mt=jt[ht],Ft=!0):et.isWebGL2&&j.samples>0&&E.useMultisampledRTT(j)===!1?Mt=ut.get(j).__webglMultisampledFramebuffer:Array.isArray(jt)?Mt=jt[_t]:Mt=jt,T.copy(j.viewport),C.copy(j.scissor),R=j.scissorTest}else T.copy(q).multiplyScalar(I).floor(),C.copy(Z).multiplyScalar(I).floor(),R=Q;if(st.bindFramebuffer(F.FRAMEBUFFER,Mt)&&et.drawBuffers&&yt&&st.drawBuffers(j,Mt),st.viewport(T),st.scissor(C),st.setScissorTest(R),Ft){const Vt=ut.get(j.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+ht,Vt.__webglTexture,_t)}else if(zt){const Vt=ut.get(j.texture),Kt=ht||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Vt.__webglTexture,_t||0,Kt)}L=-1},this.readRenderTargetPixels=function(j,ht,_t,yt,Mt,Ft,zt){if(!(j&&j.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=ut.get(j).__webglFramebuffer;if(j.isWebGLCubeRenderTarget&&zt!==void 0&&(Ht=Ht[zt]),Ht){st.bindFramebuffer(F.FRAMEBUFFER,Ht);try{const Vt=j.texture,Kt=Vt.format,jt=Vt.type;if(Kt!==Mn&&Rt.convert(Kt)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Xt=jt===Mo&&(W.has("EXT_color_buffer_half_float")||et.isWebGL2&&W.has("EXT_color_buffer_float"));if(jt!==ei&&Rt.convert(jt)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_TYPE)&&!(jt===yi&&(et.isWebGL2||W.has("OES_texture_float")||W.has("WEBGL_color_buffer_float")))&&!Xt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}ht>=0&&ht<=j.width-yt&&_t>=0&&_t<=j.height-Mt&&F.readPixels(ht,_t,yt,Mt,Rt.convert(Kt),Rt.convert(jt),Ft)}finally{const Vt=w!==null?ut.get(w).__webglFramebuffer:null;st.bindFramebuffer(F.FRAMEBUFFER,Vt)}}},this.copyFramebufferToTexture=function(j,ht,_t=0){const yt=Math.pow(2,-_t),Mt=Math.floor(ht.image.width*yt),Ft=Math.floor(ht.image.height*yt);E.setTexture2D(ht,0),F.copyTexSubImage2D(F.TEXTURE_2D,_t,0,0,j.x,j.y,Mt,Ft),st.unbindTexture()},this.copyTextureToTexture=function(j,ht,_t,yt=0){const Mt=ht.image.width,Ft=ht.image.height,zt=Rt.convert(_t.format),Ht=Rt.convert(_t.type);E.setTexture2D(_t,0),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,_t.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_t.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,_t.unpackAlignment),ht.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,yt,j.x,j.y,Mt,Ft,zt,Ht,ht.image.data):ht.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,yt,j.x,j.y,ht.mipmaps[0].width,ht.mipmaps[0].height,zt,ht.mipmaps[0].data):F.texSubImage2D(F.TEXTURE_2D,yt,j.x,j.y,zt,Ht,ht.image),yt===0&&_t.generateMipmaps&&F.generateMipmap(F.TEXTURE_2D),st.unbindTexture()},this.copyTextureToTexture3D=function(j,ht,_t,yt,Mt=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ft=j.max.x-j.min.x+1,zt=j.max.y-j.min.y+1,Ht=j.max.z-j.min.z+1,Vt=Rt.convert(yt.format),Kt=Rt.convert(yt.type);let jt;if(yt.isData3DTexture)E.setTexture3D(yt,0),jt=F.TEXTURE_3D;else if(yt.isDataArrayTexture||yt.isCompressedArrayTexture)E.setTexture2DArray(yt,0),jt=F.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,yt.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,yt.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,yt.unpackAlignment);const Xt=F.getParameter(F.UNPACK_ROW_LENGTH),be=F.getParameter(F.UNPACK_IMAGE_HEIGHT),nn=F.getParameter(F.UNPACK_SKIP_PIXELS),Ce=F.getParameter(F.UNPACK_SKIP_ROWS),Wn=F.getParameter(F.UNPACK_SKIP_IMAGES),pe=_t.isCompressedTexture?_t.mipmaps[Mt]:_t.image;F.pixelStorei(F.UNPACK_ROW_LENGTH,pe.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,pe.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,j.min.x),F.pixelStorei(F.UNPACK_SKIP_ROWS,j.min.y),F.pixelStorei(F.UNPACK_SKIP_IMAGES,j.min.z),_t.isDataTexture||_t.isData3DTexture?F.texSubImage3D(jt,Mt,ht.x,ht.y,ht.z,Ft,zt,Ht,Vt,Kt,pe.data):_t.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),F.compressedTexSubImage3D(jt,Mt,ht.x,ht.y,ht.z,Ft,zt,Ht,Vt,pe.data)):F.texSubImage3D(jt,Mt,ht.x,ht.y,ht.z,Ft,zt,Ht,Vt,Kt,pe),F.pixelStorei(F.UNPACK_ROW_LENGTH,Xt),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,be),F.pixelStorei(F.UNPACK_SKIP_PIXELS,nn),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ce),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Wn),Mt===0&&yt.generateMipmaps&&F.generateMipmap(jt),st.unbindTexture()},this.initTexture=function(j){j.isCubeTexture?E.setTextureCube(j,0):j.isData3DTexture?E.setTexture3D(j,0):j.isDataArrayTexture||j.isCompressedArrayTexture?E.setTexture2DArray(j,0):E.setTexture2D(j,0),st.unbindTexture()},this.resetState=function(){x=0,b=0,w=null,st.reset(),V.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===zc?"display-p3":"srgb",e.unpackColorSpace=ie.workingColorSpace===Wr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ae?Hi:$u}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Hi?Ae:oi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class nM extends _f{}nM.prototype.isWebGL1Renderer=!0;class Vc{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=e,this.far=i}clone(){return new Vc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Ch extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class iM extends Ke{constructor(t=null,e=1,i=1,s,o,a,r,c,l=Oe,h=Oe,u,f){super(null,a,r,c,l,h,s,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sM extends Ke{constructor(t,e,i,s,o,a,r,c,l){super(t,e,i,s,o,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Gn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),o+=i.distanceTo(s),e.push(o),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const o=i.length;let a;e?a=e:a=t*i[o-1];let r=0,c=o-1,l;for(;r<=c;)if(s=Math.floor(r+(c-r)/2),l=i[s]-a,l<0)r=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(o-1);const h=i[s],f=i[s+1]-h,p=(a-h)/f;return(s+p)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const a=this.getPoint(s),r=this.getPoint(o),c=e||(a.isVector2?new Lt:new X);return c.copy(r).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new X,s=[],o=[],a=[],r=new X,c=new ae;for(let p=0;p<=t;p++){const _=p/t;s[p]=this.getTangentAt(_,new X)}o[0]=new X,a[0]=new X;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),f<=l&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),o[0].crossVectors(s[0],r),a[0].crossVectors(s[0],o[0]);for(let p=1;p<=t;p++){if(o[p]=o[p-1].clone(),a[p]=a[p-1].clone(),r.crossVectors(s[p-1],s[p]),r.length()>Number.EPSILON){r.normalize();const _=Math.acos(ze(s[p-1].dot(s[p]),-1,1));o[p].applyMatrix4(c.makeRotationAxis(r,_))}a[p].crossVectors(s[p],o[p])}if(e===!0){let p=Math.acos(ze(o[0].dot(o[t]),-1,1));p/=t,s[0].dot(r.crossVectors(o[0],o[t]))>0&&(p=-p);for(let _=1;_<=t;_++)o[_].applyMatrix4(c.makeRotationAxis(s[_],p*_)),a[_].crossVectors(s[_],o[_])}return{tangents:s,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Wc extends Gn{constructor(t=0,e=0,i=1,s=1,o=0,a=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=r,this.aRotation=c}getPoint(t,e){const i=e||new Lt,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(a?o=0:o=s),this.aClockwise===!0&&!a&&(o===s?o=-s:o=o-s);const r=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=l-this.aY;c=f*h-p*u+this.aX,l=f*u+p*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class oM extends Wc{constructor(t,e,i,s,o,a){super(t,e,i,i,s,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function jc(){let n=0,t=0,e=0,i=0;function s(o,a,r,c){n=o,t=r,e=-3*o+3*a-2*r-c,i=2*o-2*a+r+c}return{initCatmullRom:function(o,a,r,c,l){s(a,r,l*(r-o),l*(c-a))},initNonuniformCatmullRom:function(o,a,r,c,l,h,u){let f=(a-o)/l-(r-o)/(l+h)+(r-a)/h,p=(r-a)/h-(c-a)/(h+u)+(c-r)/u;f*=h,p*=h,s(a,r,f,p)},calc:function(o){const a=o*o,r=a*o;return n+t*o+e*a+i*r}}}const nr=new X,ka=new jc,Da=new jc,Ia=new jc;class rM extends Gn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new X){const i=e,s=this.points,o=s.length,a=(o-(this.closed?0:1))*t;let r=Math.floor(a),c=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/o)+1)*o:c===0&&r===o-1&&(r=o-2,c=1);let l,h;this.closed||r>0?l=s[(r-1)%o]:(nr.subVectors(s[0],s[1]).add(s[0]),l=nr);const u=s[r%o],f=s[(r+1)%o];if(this.closed||r+2<o?h=s[(r+2)%o]:(nr.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=nr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let _=Math.pow(l.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(f),p),d=Math.pow(f.distanceToSquared(h),p);g<1e-4&&(g=1),_<1e-4&&(_=g),d<1e-4&&(d=g),ka.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,_,g,d),Da.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,_,g,d),Ia.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,_,g,d)}else this.curveType==="catmullrom"&&(ka.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),Da.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),Ia.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return i.set(ka.calc(c),Da.calc(c),Ia.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new X().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function kh(n,t,e,i,s){const o=(i-t)*.5,a=(s-e)*.5,r=n*n,c=n*r;return(2*e-2*i+o+a)*c+(-3*e+3*i-2*o-a)*r+o*n+e}function aM(n,t){const e=1-n;return e*e*t}function cM(n,t){return 2*(1-n)*n*t}function lM(n,t){return n*n*t}function uo(n,t,e,i){return aM(n,t)+cM(n,e)+lM(n,i)}function hM(n,t){const e=1-n;return e*e*e*t}function uM(n,t){const e=1-n;return 3*e*e*n*t}function fM(n,t){return 3*(1-n)*n*n*t}function dM(n,t){return n*n*n*t}function fo(n,t,e,i,s){return hM(n,t)+uM(n,e)+fM(n,i)+dM(n,s)}class Mf extends Gn{constructor(t=new Lt,e=new Lt,i=new Lt,s=new Lt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Lt){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(fo(t,s.x,o.x,a.x,r.x),fo(t,s.y,o.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class pM extends Gn{constructor(t=new X,e=new X,i=new X,s=new X){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new X){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(fo(t,s.x,o.x,a.x,r.x),fo(t,s.y,o.y,a.y,r.y),fo(t,s.z,o.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yf extends Gn{constructor(t=new Lt,e=new Lt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Lt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Lt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class mM extends Gn{constructor(t=new X,e=new X){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new X){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new X){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class vf extends Gn{constructor(t=new Lt,e=new Lt,i=new Lt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Lt){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(uo(t,s.x,o.x,a.x),uo(t,s.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class gM extends Gn{constructor(t=new X,e=new X,i=new X){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new X){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(uo(t,s.x,o.x,a.x),uo(t,s.y,o.y,a.y),uo(t,s.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class xf extends Gn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Lt){const i=e,s=this.points,o=(s.length-1)*t,a=Math.floor(o),r=o-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(kh(r,c.x,l.x,h.x,u.x),kh(r,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Lt().fromArray(s))}return this}}var pc=Object.freeze({__proto__:null,ArcCurve:oM,CatmullRomCurve3:rM,CubicBezierCurve:Mf,CubicBezierCurve3:pM,EllipseCurve:Wc,LineCurve:yf,LineCurve3:mM,QuadraticBezierCurve:vf,QuadraticBezierCurve3:gM,SplineCurve:xf});class _M extends Gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pc[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=i){const a=s[o]-i,r=this.curves[o],c=r.getLength(),l=c===0?0:1-a/c;return r.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,o=this.curves;s<o.length;s++){const a=o[s],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new pc[s.type]().fromJSON(s))}return this}}class Dh extends _M{constructor(t){super(),this.type="Path",this.currentPoint=new Lt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new yf(this.currentPoint.clone(),new Lt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const o=new vf(this.currentPoint.clone(),new Lt(t,e),new Lt(i,s));return this.curves.push(o),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,o,a){const r=new Mf(this.currentPoint.clone(),new Lt(t,e),new Lt(i,s),new Lt(o,a));return this.curves.push(r),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new xf(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,o,a){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,s,o,a),this}absarc(t,e,i,s,o,a){return this.absellipse(t,e,i,i,s,o,a),this}ellipse(t,e,i,s,o,a,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,o,a,r,c),this}absellipse(t,e,i,s,o,a,r,c){const l=new Wc(t,e,i,s,o,a,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class bf extends Ge{constructor(t=1,e=1,i=1,s=32,o=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:o,openEnded:a,thetaStart:r,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],f=[],p=[];let _=0;const g=[],d=i/2;let m=0;y(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new fe(u,3)),this.setAttribute("normal",new fe(f,3)),this.setAttribute("uv",new fe(p,2));function y(){const v=new X,x=new X;let b=0;const w=(e-t)/i;for(let L=0;L<=o;L++){const S=[],T=L/o,C=T*(e-t)+t;for(let R=0;R<=s;R++){const O=R/s,A=O*c+r,D=Math.sin(A),k=Math.cos(A);x.x=C*D,x.y=-T*i+d,x.z=C*k,u.push(x.x,x.y,x.z),v.set(D,w,k).normalize(),f.push(v.x,v.y,v.z),p.push(O,1-T),S.push(_++)}g.push(S)}for(let L=0;L<s;L++)for(let S=0;S<o;S++){const T=g[S][L],C=g[S+1][L],R=g[S+1][L+1],O=g[S][L+1];h.push(T,C,O),h.push(C,R,O),b+=6}l.addGroup(m,b,0),m+=b}function M(v){const x=_,b=new Lt,w=new X;let L=0;const S=v===!0?t:e,T=v===!0?1:-1;for(let R=1;R<=s;R++)u.push(0,d*T,0),f.push(0,T,0),p.push(.5,.5),_++;const C=_;for(let R=0;R<=s;R++){const A=R/s*c+r,D=Math.cos(A),k=Math.sin(A);w.x=S*k,w.y=d*T,w.z=S*D,u.push(w.x,w.y,w.z),f.push(0,T,0),b.x=D*.5+.5,b.y=k*.5*T+.5,p.push(b.x,b.y),_++}for(let R=0;R<s;R++){const O=x+R,A=C+R;v===!0?h.push(A,A+1,O):h.push(A+1,A,O),L+=3}l.addGroup(m,L,v===!0?1:2),m+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bf(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class wf extends Dh{constructor(t){super(t),this.uuid=Hs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Dh().fromJSON(s))}return this}}const MM={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let o=Sf(n,0,s,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,c,l,h,u,f,p;if(i&&(o=wM(n,t,o,e)),n.length>80*e){r=l=n[0],c=h=n[1];for(let _=e;_<s;_+=e)u=n[_],f=n[_+1],u<r&&(r=u),f<c&&(c=f),u>l&&(l=u),f>h&&(h=f);p=Math.max(l-r,h-c),p=p!==0?32767/p:0}return yo(o,a,e,r,c,p,0),a}};function Sf(n,t,e,i,s){let o,a;if(s===IM(n,t,e,i)>0)for(o=t;o<e;o+=i)a=Ih(o,n[o],n[o+1],a);else for(o=e-i;o>=t;o-=i)a=Ih(o,n[o],n[o+1],a);return a&&Xr(a,a.next)&&(xo(a),a=a.next),a}function Yi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Xr(e,e.next)||me(e.prev,e,e.next)===0)){if(xo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function yo(n,t,e,i,s,o,a){if(!n)return;!a&&o&&RM(n,i,s,o);let r=n,c,l;for(;n.prev!==n.next;){if(c=n.prev,l=n.next,o?vM(n,i,s,o):yM(n)){t.push(c.i/e|0),t.push(n.i/e|0),t.push(l.i/e|0),xo(n),n=l.next,r=l.next;continue}if(n=l,n===r){a?a===1?(n=xM(Yi(n),t,e),yo(n,t,e,i,s,o,2)):a===2&&bM(n,t,e,i,s,o):yo(Yi(n),t,e,i,s,o,1);break}}}function yM(n){const t=n.prev,e=n,i=n.next;if(me(t,e,i)>=0)return!1;const s=t.x,o=e.x,a=i.x,r=t.y,c=e.y,l=i.y,h=s<o?s<a?s:a:o<a?o:a,u=r<c?r<l?r:l:c<l?c:l,f=s>o?s>a?s:a:o>a?o:a,p=r>c?r>l?r:l:c>l?c:l;let _=i.next;for(;_!==t;){if(_.x>=h&&_.x<=f&&_.y>=u&&_.y<=p&&bs(s,r,o,c,a,l,_.x,_.y)&&me(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function vM(n,t,e,i){const s=n.prev,o=n,a=n.next;if(me(s,o,a)>=0)return!1;const r=s.x,c=o.x,l=a.x,h=s.y,u=o.y,f=a.y,p=r<c?r<l?r:l:c<l?c:l,_=h<u?h<f?h:f:u<f?u:f,g=r>c?r>l?r:l:c>l?c:l,d=h>u?h>f?h:f:u>f?u:f,m=mc(p,_,t,e,i),y=mc(g,d,t,e,i);let M=n.prevZ,v=n.nextZ;for(;M&&M.z>=m&&v&&v.z<=y;){if(M.x>=p&&M.x<=g&&M.y>=_&&M.y<=d&&M!==s&&M!==a&&bs(r,h,c,u,l,f,M.x,M.y)&&me(M.prev,M,M.next)>=0||(M=M.prevZ,v.x>=p&&v.x<=g&&v.y>=_&&v.y<=d&&v!==s&&v!==a&&bs(r,h,c,u,l,f,v.x,v.y)&&me(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;M&&M.z>=m;){if(M.x>=p&&M.x<=g&&M.y>=_&&M.y<=d&&M!==s&&M!==a&&bs(r,h,c,u,l,f,M.x,M.y)&&me(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;v&&v.z<=y;){if(v.x>=p&&v.x<=g&&v.y>=_&&v.y<=d&&v!==s&&v!==a&&bs(r,h,c,u,l,f,v.x,v.y)&&me(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function xM(n,t,e){let i=n;do{const s=i.prev,o=i.next.next;!Xr(s,o)&&Ef(s,i,i.next,o)&&vo(s,o)&&vo(o,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(o.i/e|0),xo(i),xo(i.next),i=n=o),i=i.next}while(i!==n);return Yi(i)}function bM(n,t,e,i,s,o){let a=n;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&CM(a,r)){let c=Tf(a,r);a=Yi(a,a.next),c=Yi(c,c.next),yo(a,t,e,i,s,o,0),yo(c,t,e,i,s,o,0);return}r=r.next}a=a.next}while(a!==n)}function wM(n,t,e,i){const s=[];let o,a,r,c,l;for(o=0,a=t.length;o<a;o++)r=t[o]*i,c=o<a-1?t[o+1]*i:n.length,l=Sf(n,r,c,i,!1),l===l.next&&(l.steiner=!0),s.push(LM(l));for(s.sort(SM),o=0;o<s.length;o++)e=EM(s[o],e);return e}function SM(n,t){return n.x-t.x}function EM(n,t){const e=TM(n,t);if(!e)return t;const i=Tf(e,n);return Yi(i,i.next),Yi(e,e.next)}function TM(n,t){let e=t,i=-1/0,s;const o=n.x,a=n.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const f=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>i&&(i=f,s=e.x<e.next.x?e:e.next,f===o))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,c=s.x,l=s.y;let h=1/0,u;e=s;do o>=e.x&&e.x>=c&&o!==e.x&&bs(a<l?o:i,a,c,l,a<l?i:o,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(o-e.x),vo(e,n)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&AM(s,e)))&&(s=e,h=u)),e=e.next;while(e!==r);return s}function AM(n,t){return me(n.prev,n,t.prev)<0&&me(t.next,n,n.next)<0}function RM(n,t,e,i){let s=n;do s.z===0&&(s.z=mc(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,PM(s)}function PM(n){let t,e,i,s,o,a,r,c,l=1;do{for(e=n,n=null,o=null,a=0;e;){for(a++,i=e,r=0,t=0;t<l&&(r++,i=i.nextZ,!!i);t++);for(c=l;r>0||c>0&&i;)r!==0&&(c===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,r--):(s=i,i=i.nextZ,c--),o?o.nextZ=s:n=s,s.prevZ=o,o=s;e=i}o.nextZ=null,l*=2}while(a>1);return n}function mc(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function LM(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function bs(n,t,e,i,s,o,a,r){return(s-a)*(t-r)>=(n-a)*(o-r)&&(n-a)*(i-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(s-a)*(i-r)}function CM(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!kM(n,t)&&(vo(n,t)&&vo(t,n)&&DM(n,t)&&(me(n.prev,n,t.prev)||me(n,t.prev,t))||Xr(n,t)&&me(n.prev,n,n.next)>0&&me(t.prev,t,t.next)>0)}function me(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Xr(n,t){return n.x===t.x&&n.y===t.y}function Ef(n,t,e,i){const s=sr(me(n,t,e)),o=sr(me(n,t,i)),a=sr(me(e,i,n)),r=sr(me(e,i,t));return!!(s!==o&&a!==r||s===0&&ir(n,e,t)||o===0&&ir(n,i,t)||a===0&&ir(e,n,i)||r===0&&ir(e,t,i))}function ir(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function sr(n){return n>0?1:n<0?-1:0}function kM(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Ef(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function vo(n,t){return me(n.prev,n,n.next)<0?me(n,t,n.next)>=0&&me(n,n.prev,t)>=0:me(n,t,n.prev)<0||me(n,n.next,t)<0}function DM(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,o=(n.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Tf(n,t){const e=new gc(n.i,n.x,n.y),i=new gc(t.i,t.x,t.y),s=n.next,o=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,o.next=i,i.prev=o,i}function Ih(n,t,e,i){const s=new gc(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function xo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function gc(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function IM(n,t,e,i){let s=0;for(let o=t,a=e-i;o<e;o+=i)s+=(n[a]-n[o])*(n[o+1]+n[a+1]),a=o;return s}class Vi{static area(t){const e=t.length;let i=0;for(let s=e-1,o=0;o<e;s=o++)i+=t[s].x*t[o].y-t[o].x*t[s].y;return i*.5}static isClockWise(t){return Vi.area(t)<0}static triangulateShape(t,e){const i=[],s=[],o=[];Uh(t),Nh(i,t);let a=t.length;e.forEach(Uh);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Nh(i,e[c]);const r=MM.triangulate(i,s);for(let c=0;c<r.length;c+=3)o.push(r.slice(c,c+3));return o}}function Uh(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Nh(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class qc extends Ge{constructor(t=new wf([new Lt(.5,.5),new Lt(-.5,.5),new Lt(-.5,-.5),new Lt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],o=[];for(let r=0,c=t.length;r<c;r++){const l=t[r];a(l)}this.setAttribute("position",new fe(s,3)),this.setAttribute("uv",new fe(o,2)),this.computeVertexNormals();function a(r){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,_=e.bevelSize!==void 0?e.bevelSize:p-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,d=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,y=e.UVGenerator!==void 0?e.UVGenerator:UM;let M,v=!1,x,b,w,L;m&&(M=m.getSpacedPoints(h),v=!0,f=!1,x=m.computeFrenetFrames(h,!1),b=new X,w=new X,L=new X),f||(d=0,p=0,_=0,g=0);const S=r.extractPoints(l);let T=S.shape;const C=S.holes;if(!Vi.isClockWise(T)){T=T.reverse();for(let F=0,B=C.length;F<B;F++){const W=C[F];Vi.isClockWise(W)&&(C[F]=W.reverse())}}const O=Vi.triangulateShape(T,C),A=T;for(let F=0,B=C.length;F<B;F++){const W=C[F];T=T.concat(W)}function D(F,B,W){return B||console.error("THREE.ExtrudeGeometry: vec does not exist"),F.clone().addScaledVector(B,W)}const k=T.length,I=O.length;function N(F,B,W){let et,st,mt;const ut=F.x-B.x,E=F.y-B.y,P=W.x-F.x,tt=W.y-F.y,dt=ut*ut+E*E,at=ut*tt-E*P;if(Math.abs(at)>Number.EPSILON){const pt=Math.sqrt(dt),gt=Math.sqrt(P*P+tt*tt),vt=B.x-E/pt,xt=B.y+ut/pt,wt=W.x-tt/gt,St=W.y+P/gt,ft=((wt-vt)*tt-(St-xt)*P)/(ut*tt-E*P);et=vt+ut*ft-F.x,st=xt+E*ft-F.y;const At=et*et+st*st;if(At<=2)return new Lt(et,st);mt=Math.sqrt(At/2)}else{let pt=!1;ut>Number.EPSILON?P>Number.EPSILON&&(pt=!0):ut<-Number.EPSILON?P<-Number.EPSILON&&(pt=!0):Math.sign(E)===Math.sign(tt)&&(pt=!0),pt?(et=-E,st=ut,mt=Math.sqrt(dt)):(et=ut,st=E,mt=Math.sqrt(dt/2))}return new Lt(et/mt,st/mt)}const z=[];for(let F=0,B=A.length,W=B-1,et=F+1;F<B;F++,W++,et++)W===B&&(W=0),et===B&&(et=0),z[F]=N(A[F],A[W],A[et]);const q=[];let Z,Q=z.concat();for(let F=0,B=C.length;F<B;F++){const W=C[F];Z=[];for(let et=0,st=W.length,mt=st-1,ut=et+1;et<st;et++,mt++,ut++)mt===st&&(mt=0),ut===st&&(ut=0),Z[et]=N(W[et],W[mt],W[ut]);q.push(Z),Q=Q.concat(Z)}for(let F=0;F<d;F++){const B=F/d,W=p*Math.cos(B*Math.PI/2),et=_*Math.sin(B*Math.PI/2)+g;for(let st=0,mt=A.length;st<mt;st++){const ut=D(A[st],z[st],et);J(ut.x,ut.y,-W)}for(let st=0,mt=C.length;st<mt;st++){const ut=C[st];Z=q[st];for(let E=0,P=ut.length;E<P;E++){const tt=D(ut[E],Z[E],et);J(tt.x,tt.y,-W)}}}const U=_+g;for(let F=0;F<k;F++){const B=f?D(T[F],Q[F],U):T[F];v?(w.copy(x.normals[0]).multiplyScalar(B.x),b.copy(x.binormals[0]).multiplyScalar(B.y),L.copy(M[0]).add(w).add(b),J(L.x,L.y,L.z)):J(B.x,B.y,0)}for(let F=1;F<=h;F++)for(let B=0;B<k;B++){const W=f?D(T[B],Q[B],U):T[B];v?(w.copy(x.normals[F]).multiplyScalar(W.x),b.copy(x.binormals[F]).multiplyScalar(W.y),L.copy(M[F]).add(w).add(b),J(L.x,L.y,L.z)):J(W.x,W.y,u/h*F)}for(let F=d-1;F>=0;F--){const B=F/d,W=p*Math.cos(B*Math.PI/2),et=_*Math.sin(B*Math.PI/2)+g;for(let st=0,mt=A.length;st<mt;st++){const ut=D(A[st],z[st],et);J(ut.x,ut.y,u+W)}for(let st=0,mt=C.length;st<mt;st++){const ut=C[st];Z=q[st];for(let E=0,P=ut.length;E<P;E++){const tt=D(ut[E],Z[E],et);v?J(tt.x,tt.y+M[h-1].y,M[h-1].x+W):J(tt.x,tt.y,u+W)}}}Y(),G();function Y(){const F=s.length/3;if(f){let B=0,W=k*B;for(let et=0;et<I;et++){const st=O[et];it(st[2]+W,st[1]+W,st[0]+W)}B=h+d*2,W=k*B;for(let et=0;et<I;et++){const st=O[et];it(st[0]+W,st[1]+W,st[2]+W)}}else{for(let B=0;B<I;B++){const W=O[B];it(W[2],W[1],W[0])}for(let B=0;B<I;B++){const W=O[B];it(W[0]+k*h,W[1]+k*h,W[2]+k*h)}}i.addGroup(F,s.length/3-F,0)}function G(){const F=s.length/3;let B=0;$(A,B),B+=A.length;for(let W=0,et=C.length;W<et;W++){const st=C[W];$(st,B),B+=st.length}i.addGroup(F,s.length/3-F,1)}function $(F,B){let W=F.length;for(;--W>=0;){const et=W;let st=W-1;st<0&&(st=F.length-1);for(let mt=0,ut=h+d*2;mt<ut;mt++){const E=k*mt,P=k*(mt+1),tt=B+et+E,dt=B+st+E,at=B+st+P,pt=B+et+P;ot(tt,dt,at,pt)}}}function J(F,B,W){c.push(F),c.push(B),c.push(W)}function it(F,B,W){ct(F),ct(B),ct(W);const et=s.length/3,st=y.generateTopUV(i,s,et-3,et-2,et-1);K(st[0]),K(st[1]),K(st[2])}function ot(F,B,W,et){ct(F),ct(B),ct(et),ct(B),ct(W),ct(et);const st=s.length/3,mt=y.generateSideWallUV(i,s,st-6,st-3,st-2,st-1);K(mt[0]),K(mt[1]),K(mt[3]),K(mt[1]),K(mt[2]),K(mt[3])}function ct(F){s.push(c[F*3+0]),s.push(c[F*3+1]),s.push(c[F*3+2])}function K(F){o.push(F.x),o.push(F.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return NM(e,i,t)}static fromJSON(t,e){const i=[];for(let o=0,a=t.shapes.length;o<a;o++){const r=e[t.shapes[o]];i.push(r)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new pc[s.type]().fromJSON(s)),new qc(i,t.options)}}const UM={generateTopUV:function(n,t,e,i,s){const o=t[e*3],a=t[e*3+1],r=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new Lt(o,a),new Lt(r,c),new Lt(l,h)]},generateSideWallUV:function(n,t,e,i,s,o){const a=t[e*3],r=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],f=t[s*3],p=t[s*3+1],_=t[s*3+2],g=t[o*3],d=t[o*3+1],m=t[o*3+2];return Math.abs(r-h)<Math.abs(a-l)?[new Lt(a,1-c),new Lt(l,1-u),new Lt(f,1-_),new Lt(g,1-m)]:[new Lt(r,1-c),new Lt(h,1-u),new Lt(p,1-_),new Lt(d,1-m)]}};function NM(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const o=n[i];e.shapes.push(o.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Lr extends Ge{constructor(t=1,e=32,i=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+r,Math.PI);let l=0;const h=[],u=new X,f=new X,p=[],_=[],g=[],d=[];for(let m=0;m<=i;m++){const y=[],M=m/i;let v=0;m===0&&a===0?v=.5/e:m===i&&c===Math.PI&&(v=-.5/e);for(let x=0;x<=e;x++){const b=x/e;u.x=-t*Math.cos(s+b*o)*Math.sin(a+M*r),u.y=t*Math.cos(a+M*r),u.z=t*Math.sin(s+b*o)*Math.sin(a+M*r),_.push(u.x,u.y,u.z),f.copy(u).normalize(),g.push(f.x,f.y,f.z),d.push(b+v,1-M),y.push(l++)}h.push(y)}for(let m=0;m<i;m++)for(let y=0;y<e;y++){const M=h[m][y+1],v=h[m][y],x=h[m+1][y],b=h[m+1][y+1];(m!==0||a>0)&&p.push(M,v,b),(m!==i-1||c<Math.PI)&&p.push(v,x,b)}this.setIndex(p),this.setAttribute("position",new fe(_,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class po extends Po{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ku,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Xc extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class FM extends Xc{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ua=new ae,Fh=new X,Oh=new X;class Af{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gc,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new De(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Fh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Fh),Oh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Oh),e.updateMatrixWorld(),Ua.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ua),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ua)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class OM extends Af{constructor(){super(new an(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,i=Rr*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,o=t.distance||e.far;(i!==e.fov||s!==e.aspect||o!==e.far)&&(e.fov=i,e.aspect=s,e.far=o,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class zh extends Xc{constructor(t,e,i=0,s=Math.PI/3,o=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.distance=i,this.angle=s,this.penumbra=o,this.decay=a,this.map=null,this.shadow=new OM}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class zM extends Af{constructor(){super(new hf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class BM extends Xc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new zM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Bh{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(ze(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fc);const Hr=class Hr{constructor({cols:t,rows:e,widthMM:i,heightMM:s,ppmm:o,data:a,groove:r,cavity:c}){this.width=t,this.height=e,this.widthMM=i,this.heightMM=s,this.ppmm=o,this.data=a,this.groove=r||null,this.cavityOpts={small:.8,large:4,kSmall:.3,kLarge:.9,kEdge:.12,...c};let l=1/0,h=-1/0;for(let u=0;u<a.length;u++){const f=a[u];f<l&&(l=f),f>h&&(h=f)}h-l<1e-6&&(h=l+1e-6),this.min=l,this.max=h,this._tex={},this._macro=new Map,this._channels=null}sample(t,e){return Hh(this.data,this.width,this.height,t,e)}get heightTexture(){if(!this._tex.height){const{data:t,min:e,max:i}=this,s=t.length,o=new Uint8Array(s*4),a=255/(i-e);for(let r=0;r<s;r++){const c=(t[r]-e)*a;o[r*4]=o[r*4+1]=o[r*4+2]=c,o[r*4+3]=255}this._tex.height=this._texture(o)}return this._tex.height}get normalTexture(){if(!this._tex.normal){const{data:t,width:e,height:i,ppmm:s}=this,o=new Uint8Array(e*i*4),a=s/8;for(let r=0;r<i;r++){const c=r>0?r-1:0,l=r<i-1?r+1:i-1;for(let h=0;h<e;h++){const u=h>0?h-1:0,f=h<e-1?h+1:e-1,p=t[c*e+u],_=t[c*e+h],g=t[c*e+f],d=t[r*e+u],m=t[r*e+f],y=t[l*e+u],M=t[l*e+h],v=t[l*e+f],x=(g+2*m+v-p-2*d-y)*a,b=(y+2*M+v-p-2*_-g)*a,w=1/Math.sqrt(x*x+b*b+1),L=(r*e+h)*4;o[L]=(.5-.5*x*w)*255+.5,o[L+1]=(.5-.5*b*w)*255+.5,o[L+2]=(.5+.5*w)*255+.5,o[L+3]=255}}this._tex.normal=this._texture(o)}return this._tex.normal}get dataTexture(){if(!this._tex.data){const{height01:t,cavity:e,edge:i,groove:s}=this.channels(),o=t.length,a=new Uint8Array(o*4);for(let r=0;r<o;r++)a[r*4]=t[r]*255+.5,a[r*4+1]=e[r]*255+.5,a[r*4+2]=i[r]*255+.5,a[r*4+3]=s[r]*255+.5;this._tex.data=this._texture(a)}return this._tex.data}channels(){if(this._channels)return this._channels;const{data:t,width:e,height:i,ppmm:s,min:o,max:a}=this,r=this.cavityOpts,c=e*i,l=Mr(t,e,i,Math.max(1,Math.round(r.small*s))),h=Mr(t,e,i,Math.max(1,Math.round(r.large*s))),u=new Float32Array(c),f=new Float32Array(c),p=new Float32Array(c),_=new Float32Array(c),g=1/(a-o);for(let d=0;d<c;d++){const m=t[d];u[d]=(m-o)*g;const y=m-l[d],M=m-h[d];f[d]=Gh(1-Math.max(0,-y)/r.kSmall-Math.max(0,-M)/r.kLarge),p[d]=Gh(y/r.kEdge),_[d]=this.groove?this.groove[d]:0}return this._channels={height01:u,cavity:f,edge:p,groove:_},this._channels}macro(t){const e=t.toFixed(3);let i=this._macro.get(e);if(i)return i;const{data:s,width:o,height:a,ppmm:r}=this,c=Math.max(1,Math.round(t*r)),l=Math.max(2,Math.ceil(o/c)),h=Math.max(2,Math.ceil(a/c));let u=new Float32Array(l*h);for(let f=0;f<h;f++)for(let p=0;p<l;p++){let _=0,g=0;const d=Math.min(a,(f+1)*c),m=Math.min(o,(p+1)*c);for(let y=f*c;y<d;y++)for(let M=p*c;M<m;M++)_+=s[y*o+M],g++;u[f*l+p]=_/g}return c>1&&(u=Mr(u,l,h,1,1)),i={cols:l,rows:h,sizeMM:t,data:u,sample:(f,p)=>Hh(u,l,h,f,p)},this._macro.set(e,i),i}setAnisotropy(t){for(const e of Object.values(this._tex))e.anisotropy=t,e.needsUpdate=!0}dispose(){for(const t of Object.values(this._tex))t.dispose();this._tex={}}_texture(t){const e=new iM(t,this.width,this.height,Mn,ei);return e.colorSpace=cn,e.wrapS=e.wrapT=_n,e.magFilter=rn,e.minFilter=Ds,e.generateMipmaps=!0,e.anisotropy=Hr.anisotropy,e.needsUpdate=!0,e}};Do(Hr,"anisotropy",4);let bo=Hr;function Rf(n,t={}){return new bo({cols:n.cols,rows:n.rows,widthMM:n.width,heightMM:n.height,ppmm:n.ppmm,data:Float32Array.from(n.field),groove:Float32Array.from(n.groove),cavity:t.cavity})}function Gh(n){return n<0?0:n>1?1:n}function Hh(n,t,e,i,s){const o=Math.min(Math.max(i*t-.5,0),t-1),a=Math.min(Math.max(s*e-.5,0),e-1),r=Math.floor(o),c=Math.floor(a),l=Math.min(r+1,t-1),h=Math.min(c+1,e-1),u=o-r,f=a-c,p=n[c*t+r]+(n[c*t+l]-n[c*t+r])*u,_=n[h*t+r]+(n[h*t+l]-n[h*t+r])*u;return p+(_-p)*f}function Mr(n,t,e,i,s=3){let o=Float32Array.from(n),a=new Float32Array(n.length);const r=new Float32Array(Math.max(t,e));for(let c=0;c<s;c++)GM(o,a,t,e,i,r),HM(a,o,t,e,i,r);return o}function GM(n,t,e,i,s,o){const a=1/(2*s+1);for(let r=0;r<i;r++){const c=r*e;let l=n[c]*(s+1);for(let h=1;h<=s;h++)l+=n[c+Math.min(h,e-1)];for(let h=0;h<e;h++)o[h]=l*a,l+=n[c+Math.min(h+s+1,e-1)]-n[c+Math.max(h-s,0)];t.set(o.subarray(0,e),c)}}function HM(n,t,e,i,s,o){const a=1/(2*s+1);for(let r=0;r<e;r++){let c=n[r]*(s+1);for(let l=1;l<=s;l++)c+=n[Math.min(l,i-1)*e+r];for(let l=0;l<i;l++)o[l]=c*a,c+=n[Math.min(l+s+1,i-1)*e+r]-n[Math.max(l-s,0)*e+r];for(let l=0;l<i;l++)t[l*e+r]=o[l]}}const Yc={pitch:1.3,line:.5,cell:"auto",turns:"auto",roundness:.15,jitter:.08,mode:"sunk",depth:.4,fillers:!0,pairs:.75,hand:"alternate",eyes:0,echo:0,follow:1,seed:0};function Pf(n={}){const t={...Yc,...n},e=t.pitch;let[i,s]=t.cell==="auto"||!t.cell?[4.2*e,7.8*e]:t.cell;return typeof t.turns=="number"&&(s=Math.min(s,(2*t.turns+1.2)*e)),i=Math.max(i,3*e),s=Math.max(s,i),t.cell=[i,s],t}function Si(n,t={},e={}){const i=rr(),s=Pf(e),o=t.rect??{x:0,y:0,w:n.width,h:n.height},a=n.rng.fork(`leiwen:${s.seed}:${or(o.x)},${or(o.y)},${or(o.w)},${or(o.h)}`),r=WM(n,o,t,s);s.debugOut&&(s.debugOut.gridMs=rr()-i);const c=[];r&&s.echo>0&&qM(r,s,c),r&&s.fillers&&XM(r,s,c);const l=r?jM(r,s,a):[];if(s.debugOut)for(const f of l)s.debugOut.push(f);const h={cells:l.length,spirals:0,pairs:0,fillers:0,ms:0,planMs:0};for(const f of l){if(s.debugCells){const p=(_,g)=>[f.ax+_*f.ux+g*f.vx,f.ay+_*f.uy+g*f.vy];c.push({pts:[p(f.u0,f.v0),p(f.u1,f.v0),p(f.u1,f.v1),p(f.u0,f.v1),p(f.u0,f.v0)],radius:0})}s.debugCells!==!0&&$M(f,s,a,c,h)}const u=rr();return c.length&&JM(n,c,s),h.planMs=Math.round(u-i),h.ms=Math.round(rr()-i),h}function Yr(n,t,e={},{rect:i,margin:s=.5,level:o,avoid:a=null}={}){const r=typeof t=="function"?n.mask(t):t;let c=o;c===void 0&&(r!=null&&r.data)&&(c=QM(n,r.data));const l=e.pitch??Yc.pitch,h=i??(r!=null&&r.data?VM(n,r.data,s+2*l):void 0);return h===null?{cells:0,spirals:0,pairs:0,fillers:0,ms:0,planMs:0}:Si(n,{rect:h,include:r,level:c,avoid:a,margin:s},e)}function VM(n,t,e){const{cols:i,rows:s,ppmm:o}=n;let a=i,r=-1,c=s,l=-1;for(let _=0;_<s;_++){const g=_*i;for(let d=0;d<i;d++)t[g+d]<.5||(d<a&&(a=d),d>r&&(r=d),_<c&&(c=_),_>l&&(l=_))}if(r<0)return null;const h=Math.max(0,a/o-e),u=Math.max(0,c/o-e),f=Math.min(n.width,(r+1)/o+e),p=Math.min(n.height,(l+1)/o+e);return{x:h,y:u,w:f-h,h:p-u}}function WM(n,t,e,i){const s=i.pitch;let o=Math.max(s/3,1/n.ppmm);const a=32e5;t.w/o*(t.h/o)>a&&(o=Math.sqrt(t.w*t.h/a));const r=Math.ceil(t.w/o)+2,c=Math.ceil(t.h/o)+2,l=t.x-o,h=t.y-o,u=r*c,f=new Uint8Array(u);for(let z=0;z<c;z++)for(let q=0;q<r;q++)(q===0||z===0||q===r-1||z===c-1)&&(f[z*r+q]=1);const{cols:p,rows:_,ppmm:g,field:d}=n,m=z=>typeof z=="function"?n.mask(z).data:z&&z.data?z.data:null,y=e.avoid===void 0?e.level!=null?null:"raised":e.avoid,M=y==="raised"?null:m(y),v=y==="raised",x=m(e.include),b=e.level,w=b==null?0:.04+.03*Math.abs(b),L=Math.max(0,Math.floor(t.x*g)),S=Math.min(p,Math.ceil((t.x+t.w)*g)),T=Math.max(0,Math.floor(t.y*g)),C=Math.min(_,Math.ceil((t.y+t.h)*g)),R=new Int32Array(S-L);for(let z=L;z<S;z++)R[z-L]=Math.min(r-2,Math.max(1,Math.floor(((z+.5)/g-l)/o)));let O=0;for(let z=T;z<C;z++){const Z=Math.min(c-2,Math.max(1,Math.floor(((z+.5)/g-h)/o)))*r,Q=z*p;for(let U=L;U<S;U++){const Y=Q+U;let G=!1;v?G=d[Y]>.05:M&&(G=M[Y]>.5),!G&&x&&(G=x[Y]<.5),!G&&b!=null&&(G=Math.abs(d[Y]-b)>w),G&&(f[Z+R[U-L]]=1)}}const A=new Uint8Array(f);for(let z=0;z<c;z++)for(let q=0;q<r;q++)(q===0||z===0||q===r-1||z===c-1)&&(A[z*r+q]=0);const D=si(f,r,c),k=s*(.5-i.line/2),I=Math.max(0,(e.margin??.6)-k)/o+.3,N=I*I;for(let z=0;z<u;z++)D.dist2[z]<=N&&(f[z]=1);for(let z=0;z<u;z++)f[z]||O++;return O<9?null:{gw:r,gh:c,h:o,ox:l,oy:h,blocked:f,hit:A,m:I,nf:D}}function jM(n,t,e){const{gw:i,gh:s,h:o,ox:a,oy:r,blocked:c}=n,l=i*s,h=t.pitch,[u,f]=t.cell;let p;if(n.dirty)p=si(c,i,s);else{const B=new Float32Array(l);for(let W=0;W<l;W++){const et=Math.sqrt(n.nf.dist2[W])-n.m;B[W]=et>0?et*et:0}p={dist2:B,nearest:n.nf.nearest}}const _=new Float32Array(l),g=new Float32Array(l),d=new Float32Array(l),m=new Float32Array(l),y=new Float32Array(l);for(let B=0;B<l;B++)y[B]=Math.sqrt(p.dist2[B]);for(let B=0;B<l;B++){if(c[B])continue;const W=p.nearest[B];if(W<0)continue;const et=B%i,st=B/i|0;let mt=et-W%i,ut=st-(W/i|0);const E=Math.hypot(mt,ut)||1;if(et>1&&st>1&&et<i-2&&st<s-2){const at=y[B+2]-y[B-2],pt=y[B+2*i]-y[B-2*i];Math.hypot(at,pt)>1.2&&(mt=at,ut=pt)}const P=Math.hypot(mt,ut)||1;d[B]=mt/P,m[B]=ut/P;const tt=4*Math.atan2(ut,mt),dt=Math.exp(-E*o/(3*h));_[B]=Math.cos(tt)*dt,g[B]=Math.sin(tt)*dt}const M=new Float32Array(l);for(let B=0;B<l;B++)c[B]||(M[B]=Math.hypot(_[B],g[B]));const v=_,x=g,b=Math.max(2,Math.round(u*.5/o));Na(v,i,s,b,c),Na(x,i,s,b,c),Na(M,i,s,b,c);const w=Math.max(0,Math.min(1,t.follow)),L=B=>{const W=M[B]>1e-6?Math.hypot(v[B],x[B])/M[B]:1,et=Math.max(0,Math.min(1,(W-.8)/.13));return w*et*Math.atan2(x[B],v[B])/4},S=new Uint8Array(c),T=new Int32Array(l).fill(-1),C=new Uint8Array(l),R=[],O=(B,W)=>{const et=Math.floor((B-a)/o),st=Math.floor((W-r)/o);return et<0||st<0||et>=i||st>=s?-1:st*i+et},A=(B,W)=>{const et=O(B,W);return et>=0&&S[et]===0},D=o*.7,k=(B,W,et,st)=>{const mt=Math.hypot(et-B,st-W),ut=Math.max(1,Math.ceil(mt/D));for(let E=0;E<=ut;E++){const P=E/ut;if(!A(B+(et-B)*P,W+(st-W)*P))return!1}return!0},I=(B,W,et,st,mt,[ut,E],P,tt=0)=>{let dt=Math.cos(et),at=Math.sin(et),pt=-2,gt=[dt,at];for(let H=0;H<4;H++){const lt=-at,bt=dt,Et=lt*st+bt*mt;Et>pt&&(pt=Et,gt=[dt,at]);const Pt=dt;dt=-at,at=Pt}[dt,at]=gt;const vt=-at,xt=dt,wt=(H,lt)=>[B+H*dt+lt*vt,W+H*at+lt*xt];let St=-o*.5,ft=o*.5,At=-o*.5,It=o*.5;{const H=wt(St,At),lt=wt(ft,It),bt=wt(St,It),Et=wt(ft,At);if(!A(H[0],H[1])||!A(lt[0],lt[1])||!A(bt[0],bt[1])||!A(Et[0],Et[1]))return null}const Ct=o,kt=H=>{const lt=H>0?ft+Ct:St-Ct,bt=wt(lt,At),Et=wt(lt,It);return k(bt[0],bt[1],Et[0],Et[1])?(H>0?ft=lt:St=lt,!0):!1},Rt=H=>{const lt=H>0?It+Ct:At-Ct,bt=wt(St,lt),Et=wt(ft,lt);return k(bt[0],bt[1],Et[0],Et[1])?(H>0?It=lt:At=lt,!0):!1},V=[!1,!1,!1,!1];for(let H=0;H<4e3;H++){let lt=!1;if(!V[0]&&It-At<E&&(Rt(1)?lt=!0:V[0]=!0),!V[1]&&ft-St<ut&&(kt(1)?lt=!0:V[1]=!0),!V[2]&&ft-St<ut&&(kt(-1)?lt=!0:V[2]=!0),!V[3]&&It-At<E&&(Rt(-1)?lt=!0:V[3]=!0),!lt)break}let Tt=ft-St,Ut=It-At;const nt=Math.min(ut,E);if(Math.min(Tt,Ut)<nt*.85){const H=Tt>=Ut;for(let lt=0;lt<4e3;lt++){let bt=!1;if(H){if(ft-St>=P)break;V[1]||(kt(1)?bt=!0:V[1]=!0),!V[2]&&ft-St<P&&(kt(-1)?bt=!0:V[2]=!0)}else{if(It-At>=P)break;V[0]||(Rt(1)?bt=!0:V[0]=!0),!V[3]&&It-At<P&&(Rt(-1)?bt=!0:V[3]=!0)}if(!bt)break}Tt=ft-St,Ut=It-At}const rt=tt;if(rt>0){const H=lt=>{let bt=0;for(;bt<rt;){if(!(lt===0?Rt(1):lt===1?kt(1):lt===2?kt(-1):Rt(-1)))return bt;bt+=Ct}return-bt};for(const lt of[0,1,2,3]){const bt=[St,ft,At,It];H(lt)<0&&([St,ft,At,It]=bt)}}return St-=o*.5,ft+=o*.5,At-=o*.5,It+=o*.5,{ax:B,ay:W,ux:dt,uy:at,vx:vt,vy:xt,u0:St,u1:ft,v0:At,v1:It,w:ft-St,h:It-At,theta:Math.atan2(at,dt)}},N=(B,W)=>{const st=[[B.u0,B.v0],[B.u1,B.v0],[B.u0,B.v1],[B.u1,B.v1]].map(([gt,vt])=>[B.ax+gt*B.ux+vt*B.vx,B.ay+gt*B.uy+vt*B.vy]);let mt=1/0,ut=-1/0,E=1/0,P=-1/0;for(const[gt,vt]of st)mt=Math.min(mt,gt),ut=Math.max(ut,gt),E=Math.min(E,vt),P=Math.max(P,vt);const tt=Math.max(0,Math.floor((mt-a)/o)-1),dt=Math.min(i-1,Math.ceil((ut-a)/o)+1),at=Math.max(0,Math.floor((E-r)/o)-1),pt=Math.min(s-1,Math.ceil((P-r)/o)+1);for(let gt=at;gt<=pt;gt++)for(let vt=tt;vt<=dt;vt++){const xt=gt*i+vt;if(S[xt])continue;const wt=a+(vt+.5)*o-B.ax,St=r+(gt+.5)*o-B.ay,ft=wt*B.ux+St*B.uy,At=wt*B.vx+St*B.vy;ft>=B.u0-0&&ft<=B.u1+0&&At>=B.v0-0&&At<=B.v1+0&&(S[xt]=2,T[xt]=W)}},z=3*h*.97,q=1.25*h,Z=z*.9,Q=t.cellTypical??(u+f)/2,U=B=>Math.min(f,Math.max(u,B)),Y=()=>{let B=U(Q*(1+e.jitter(.22))),W=U(Q*(1+e.jitter(.22)));const et=e.next();return t.maxAspect?[B,W]:(et<.22?B=Q*e.range(1.6,2.5):et<.34&&(W=Q*e.range(1.6,2.5)),[B,W])},G=B=>t.hand==="left"?1:t.hand==="right"?-1:t.hand==="random"||B==null?e.chance(.5)?1:-1:-B,$=()=>e.jitter(t.jitter/.08*1.5*Math.PI/180),J=[];for(let B=0;B<l;B++)c[B]||p.dist2[B]>2.3||J.push({k:B,x:a+(B%i+.5)*o,y:r+((B/i|0)+.5)*o,contour:!0,hand:null});const it=Math.max(4,Math.round(f/o)),ot=new Map,ct=B=>{const W=Math.floor(B.k%i/it)+Math.floor(B.k/i/it)*100003;return ot.has(W)||ot.set(W,e.next()),ot.get(W)};J.sort((B,W)=>ct(B)-ct(W)||B.k-W.k);const K=(B,W,et)=>{if(!B||Math.min(B.w,B.h)<et)return null;const st=R.length;return B.hand=W,R.push(B),N(B,st),B},F=B=>{const W=[],et=(mt,ut)=>[B.ax+mt*B.ux+ut*B.vx,B.ay+mt*B.uy+ut*B.vy],st=o*1.2;for(const[mt,ut,E,P]of[[B.u1+st,B.v0+o,B.vx,B.vy],[B.u0-st,B.v0+o,B.vx,B.vy],[B.u0+o,B.v1+st,B.vx,B.vy],[B.u1-o,B.v1+st,B.vx,B.vy]]){const[tt,dt]=et(mt,ut),at=O(tt,dt);at>=0&&S[at]===0&&W.push({k:at,x:tt,y:dt,theta:B.theta,nx:E,ny:P,hand:-B.hand,contour:!1})}return W};for(let B=0;B<J.length;B++){const W=J[B];if(S[W.k]||C[W.k])continue;C[W.k]=1;let et,st,mt;const ut=Math.sqrt(p.dist2[W.k])*o<u*.6;W.contour||ut&&w>0?(et=L(W.k),st=d[W.k],mt=m[W.k]):(et=0,st=W.nx,mt=W.ny);const E=I(W.x,W.y,et+$(),st,mt,Y(),f*4,Z),P=K(E,G(W.hand),z);if(P)for(const tt of F(P))J.push(tt)}for(let B=0;B<2;B++){const W=new Uint8Array(l);for(let ut=0;ut<l;ut++)W[ut]=S[ut]?1:0;const et=si(W,i,s),st=[],mt=B===0?(z/2/o)**2:(q/2/o)**2*.8;for(let ut=0;ut<l;ut++)!S[ut]&&et.dist2[ut]>=mt&&st.push(ut);st.sort((ut,E)=>et.dist2[E]-et.dist2[ut]),C.fill(0);for(const ut of st){if(S[ut]||C[ut])continue;C[ut]=1;const E=et.nearest[ut],P=a+(ut%i+.5)*o,tt=r+((ut/i|0)+.5)*o;let dt=ut%i-E%i,at=(ut/i|0)-(E/i|0);const pt=Math.hypot(dt,at)||1;dt/=pt,at/=pt;const gt=E>=0?T[E]:-1,vt=Math.sqrt(p.dist2[ut])*o<u*.6?L(ut):gt>=0?R[gt].theta:0,xt=gt>=0?R[gt].hand:null,wt=I(P,tt,vt+$(),dt,at,B===0?Y():[u,u],f*4,Z);K(wt,G(xt),B===0?z:t.fillers?q:z)}}return R}function qM(n,t,e){const{gw:i,gh:s,h:o,ox:a,oy:r,blocked:c,hit:l,m:h}=n,u=i*s,f=t.pitch,p=si(l,i,s).dist2,_=new Float32Array(u);for(let m=0;m<u;m++)_[m]=Math.sqrt(p[m]);const g=(m,y)=>Math.min(m,y,i-1-m,s-1-y)>=h+.5;for(let m=0;m<t.echo;m++){const y=h+(f/2+m*f)/o;for(const M of kf(_,i,s,y)){let v=M;for(let w=0;w<3;w++)v=Cf(v,M.closed);let x=[];const b=()=>{x.length>1&&Lf(x)*o>=2.5*f&&e.push({pts:x.map(([w,L])=>[a+(w+.5)*o,r+(L+.5)*o]),radius:0}),x=[]};for(const w of v)g(w[0],w[1])?x.push(w):b();b()}}const d=h+t.echo*f/o;for(let m=0;m<u;m++)_[m]<d&&(c[m]=1);n.dirty=!0}function XM(n,t,e){const{gw:i,gh:s,h:o,ox:a,oy:r,blocked:c}=n,l=i*s,h=t.pitch,u=si(c,i,s),f=new Float32Array(l);for(let v=0;v<l;v++)f[v]=c[v]?0:Math.sqrt(u.dist2[v]);const p=Math.max(2,Math.round(1.8*h/o)),_=YM(f,i,s,p),g=1.35*h/o,d=new Uint8Array(l);let m=!1;for(let v=0;v<l;v++)!c[v]&&_[v]<g&&(d[v]=1,m=!0);if(!m)return;const y=(v,x)=>[a+(v+.5)*o,r+(x+.5)*o],M=(v,x,b)=>v[Math.min(s-1,Math.max(0,Math.round(b)))*i+Math.min(i-1,Math.max(0,Math.round(x)))];for(let v=0;v<3;v++){const x=(h/2+v*h)/o;for(const b of kf(f,i,s,x)){let w=b;for(let T=0;T<3;T++)w=Cf(w,b.closed);let L=[];const S=()=>{L.length>1&&Lf(L)*o>=2.2*h&&e.push({pts:L.map(([T,C])=>y(T,C)),radius:0}),L=[]};for(const T of w)M(d,T[0],T[1])&&x<=M(_,T[0],T[1])-.45*h/o?L.push(T):S();S()}}for(let v=0;v<l;v++)d[v]&&(c[v]=1);n.dirty=!0}function YM(n,t,e,i){const s=new Float32Array(t*e),o=new Float32Array(t*e);for(let a=0;a<e;a++){const r=a*t;for(let c=0;c<t;c++){let l=0;const h=Math.max(0,c-i),u=Math.min(t-1,c+i);for(let f=h;f<=u;f++)n[r+f]>l&&(l=n[r+f]);s[r+c]=l}}for(let a=0;a<t;a++)for(let r=0;r<e;r++){let c=0;const l=Math.max(0,r-i),h=Math.min(e-1,r+i);for(let u=l;u<=h;u++)s[u*t+a]>c&&(c=s[u*t+a]);o[r*t+a]=c}return o}function Lf(n){let t=0;for(let e=1;e<n.length;e++)t+=Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]);return t}function Cf(n,t){const e=n.length;if(e<3)return n;const i=new Array(e);for(let s=0;s<e;s++){if(!t&&(s===0||s===e-1)){i[s]=n[s];continue}const o=n[(s-1+e)%e],a=n[s],r=n[(s+1)%e];i[s]=[(o[0]+2*a[0]+r[0])/4,(o[1]+2*a[1]+r[1])/4]}return i}function kf(n,t,e,i){const s=[],o=new Map,a=(u,f,p)=>{const _=2*(f*t+u)+(p?0:1);if(!o.has(_)){const g=n[f*t+u],d=p?n[f*t+u+1]:n[(f+1)*t+u],m=Math.min(1,Math.max(0,(i-g)/(d-g)));o.set(_,p?[u+m,f]:[u,f+m])}return _};for(let u=0;u<e-1;u++)for(let f=0;f<t-1;f++){const p=n[u*t+f]>=i,_=n[u*t+f+1]>=i,g=n[(u+1)*t+f+1]>=i,d=n[(u+1)*t+f]>=i,m=(p?1:0)|(_?2:0)|(g?4:0)|(d?8:0);if(m===0||m===15)continue;const y=()=>a(f,u,!0),M=()=>a(f,u+1,!0),v=()=>a(f,u,!1),x=()=>a(f+1,u,!1);switch(m){case 1:case 14:s.push([v(),y()]);break;case 2:case 13:s.push([y(),x()]);break;case 3:case 12:s.push([v(),x()]);break;case 4:case 11:s.push([x(),M()]);break;case 6:case 9:s.push([y(),M()]);break;case 7:case 8:s.push([v(),M()]);break;case 5:s.push([v(),M()],[y(),x()]);break;case 10:s.push([v(),y()],[x(),M()]);break}}const r=new Map;s.forEach(([u,f],p)=>{r.has(u)||r.set(u,[]),r.has(f)||r.set(f,[]),r.get(u).push(p),r.get(f).push(p)});const c=new Uint8Array(s.length),l=[],h=(u,f)=>{const p=[u];let _=u,g=f;for(;g>=0&&!c[g];){c[g]=1;const[d,m]=s[g];_=d===_?m:d,p.push(_),g=-1;for(const y of r.get(_))if(!c[y]){g=y;break}}return p};for(const[u,f]of r)f.length!==1||c[f[0]]||l.push(h(u,f[0]));for(let u=0;u<s.length;u++){if(c[u])continue;const f=h(s[u][0],u);f.closed=!0,l.push(f)}return l.map(u=>{const f=u.map(p=>o.get(p));return(u.closed||u[0]===u[u.length-1])&&(f.closed=!0),f})}function Na(n,t,e,i,s){const o=new Float32Array(Math.max(t,e));for(let a=0;a<2;a++){for(let r=0;r<e;r++){const c=r*t;let l=0;for(let h=-i;h<=i;h++)h>=0&&h<t&&(l+=n[c+h]);for(let h=0;h<t;h++){o[h]=l;const u=h-i,f=h+i+1;u>=0&&(l-=n[c+u]),f<t&&(l+=n[c+f])}for(let h=0;h<t;h++)n[c+h]=s[c+h]?0:o[h]}for(let r=0;r<t;r++){let c=0;for(let l=-i;l<=i;l++)l>=0&&l<e&&(c+=n[l*t+r]);for(let l=0;l<e;l++){o[l]=c;const h=l-i,u=l+i+1;h>=0&&(c-=n[h*t+r]),u<e&&(c+=n[u*t+r])}for(let l=0;l<e;l++)n[l*t+r]=s[l*t+r]?0:o[l]}}}function $M(n,t,e,i,s){let o=[n.ux,n.uy],a=[n.vx,n.vy],r=n.w,c=n.h,l=[n.ax+n.u0*n.ux+n.v0*n.vx,n.ay+n.u0*n.uy+n.v0*n.vy];if(c>r){l=[l[0]+r*o[0],l[1]+r*o[1]];const d=a,m=[-o[0],-o[1]];o=d,a=m,[r,c]=[c,r]}const h=t.pitch,u=e.chance(.5),f=n.hand??1,p={fu:u,fv:u};_c({p:h,o:t,rng:e,strokes:i,toPanel:(d,m)=>(p.fu&&(d=r-d),p.fv&&(m=c-m),[l[0]+d*o[0]+m*a[0],l[1]+d*o[1]+m*a[1]]),stats:s},0,0,r,c,f,0)}function _c(n,t,e,i,s,o,a){const{p:r,o:c,rng:l}=n,h=Math.min(i,s),u=Math.max(i,s);if(h<2.6*r){c.fillers&&KM(n,t,e,i,s);return}const f=u/h;if(c.maxAspect&&f>c.maxAspect){const d=Math.round(f);if(d<=1||u/d<2.6*r){eo(n,t,e,i,s,o);return}for(let m=0;m<d;m++){const y=u*m/d,M=u*(m+1)/d;i>=s?eo(n,t+y,e,M-y,s,m%2?-o:o):eo(n,t,e+y,i,M-y,m%2?-o:o)}return}if(f<1.6||a>2){eo(n,t,e,i,s,o);return}if(f<3.2){l.chance(c.pairs)?If(n,t,e,i,s,o):eo(n,t,e,i,s,o);return}const p=h*l.range(1.15,2.1),_=Math.max(2,Math.round(u/p)),g=[0];for(let d=1;d<_;d++)g.push(u*(d+l.jitter(.18))/_);g.push(u);for(let d=0;d<_;d++){const m=g[d],y=g[d+1];i>=s?_c(n,t+m,e,y-m,s,d%2?-o:o,a+1):_c(n,t,e+m,i,y-m,d%2?-o:o,a+1)}}function Df(n,t){const e=Math.max(1,Math.round(n/t));return Math.min(t*1.15,Math.max(t*.87,n/e))}function eo(n,t,e,i,s,o){const{p:a,o:r,rng:c}=n,l=Math.min(i,s),h=Df(l-a,a),u=t+a/2,f=e+a/2,p=t+i-a/2,_=e+s-a/2,g=r.eyes>0&&l>=6*a&&c.chance(r.eyes),d=g?2.6*h:0,m=[[u,f,[1,0],[0,1]],[p,f,[0,1],[-1,0]],[p,_,[-1,0],[0,-1]],[u,_,[0,-1],[1,0]]],[y,M,v,x]=m[c.int(0,3)],b=Math.abs(v[0])*(p-u)+Math.abs(v[1])*(_-f),w=Math.abs(x[0])*(p-u)+Math.abs(x[1])*(_-f),L=yr(b,w,h,d).map(([S,T])=>[y+S*v[0]+T*x[0],M+S*v[1]+T*x[1]]);if(o<0)for(const S of L)S[0]=u+p-S[0];Cr(n,L,h),n.stats.spirals++,g&&ZM(n,(u+p)/2,(f+_)/2,h*.7)}function yr(n,t,e,i=0){let s=0,o=n,a=0,r=t,c=0,l=0;const h=[[0,0]],u=e*.5;for(let f=0;f<200&&!(o-c<u||(c=o,h.push([c,l]),a+=e,r-l<u)||(l=r,h.push([c,l]),o-=e,c-s<u)||(c=s,h.push([c,l]),r-=e,l-a<u)||(l=a,h.push([c,l]),s+=e,i&&(o-s<i||r-a<i)));f++);return h}function If(n,t,e,i,s,o){const{p:a,rng:r}=n;if(s>i){const y=n.toPanel,M={...n,toPanel:(v,x)=>y(t+(x-e),e+(v-t))};If(M,t,e,s,i,-o);return}const c=Df(s-a,a),l=t+a/2,h=e+a/2,u=t+i-a/2,f=e+s-a/2,p=l+(u-l-c)/2*r.range(.9,1.1),_=yr(f-h,p-l,c).map(([y,M])=>[p-M,h+y]);let g;r.chance(.5)?g=yr(u-(p+c),f-h,c).map(([y,M])=>[p+c+y,h+M]):g=yr(f-h,u-(p+c),c).map(([y,M])=>[p+c+M,h+y]);const m=_.reverse().concat(g);if(o<0)for(const y of m)y[1]=e+s-(y[1]-e);Cr(n,m,c),n.stats.pairs++}function KM(n,t,e,i,s){const{p:o,rng:a}=n,r=Math.min(i,s),c=Math.max(i,s),l=i>=s,h=(f,p)=>l?[t+f,e+p]:[t+p,e+f],u=r-o;if(u>=.6*o&&c>=2.2*o){const f=u,p=o/2,_=c-o/2,g=o/2,d=r-o/2,m=Math.min(f,(_-p)*.3),y=a.chance(.5)?[h(_-m,d),h(p,d),h(p,g),h(_,g)]:[h(p+m,d),h(_,d),h(_,g),h(p,g)];Cr(n,y,f)}else if(c-o>=.9*o){const f=r/2;Cr(n,[h(o/2,f),h(c-o/2,f)],o)}else return;n.stats.fillers++}function ZM(n,t,e,i){const o=[];for(let a=0;a<=12;a++){const r=a/12*Math.PI*2;o.push([t+i*Math.cos(r),e+i*Math.sin(r)])}n.strokes.push({pts:o.map(([a,r])=>n.toPanel(a,r)),radius:0,closed:!0})}function Cr(n,t,e){const{o:i,rng:s}=n,o=i.jitter*e,a=t.map(([c,l])=>n.toPanel(c+s.jitter(o),l+s.jitter(o))),r=e*(.12+.88*Math.max(0,Math.min(1,i.roundness)));n.strokes.push({pts:a,radius:r})}function JM(n,t,e){const i=e.debugCells===!0?.2:e.pitch*e.line,s=o=>{o.lineWidth=i,o.lineCap="round",o.lineJoin="round",o.beginPath();for(const a of t){const r=a.pts;if(r.length<2)continue;if(o.moveTo(r[0][0],r[0][1]),a.closed){for(let l=1;l<r.length;l++)o.lineTo(r[l][0],r[l][1]);o.closePath(),o.moveTo(r[0][0],r[0][1]);continue}for(let l=1;l<r.length-1;l++){const h=r[l-1],u=r[l],f=r[l+1],p=Math.hypot(u[0]-h[0],u[1]-h[1]),_=Math.hypot(f[0]-u[0],f[1]-u[1]),g=Math.min(a.radius,l===1?p:p/2,l===r.length-2?_:_/2);g>.001?o.arcTo(u[0],u[1],f[0],f[1],g):o.lineTo(u[0],u[1])}const c=r[r.length-1];o.lineTo(c[0],c[1])}o.stroke()};e.mode==="thread"?n.add(s,{height:e.depth,profile:"ridge"}):n.sink(s,{depth:e.depth,shoulder:i*.4,profile:"u"})}function QM(n,t){const e=new Map,i=n.field;for(let a=0;a<i.length;a+=3){if(t[a]<.5)continue;const r=Math.round(i[a]/.02);e.set(r,(e.get(r)||0)+1)}let s=0,o=-1;for(const[a,r]of e)r>o&&(o=r,s=a);return s*.02}const or=n=>Math.round(n*1e3)/1e3,rr=()=>typeof performance<"u"?performance.now():Date.now(),ty=1024,pi=4,Ns={plateau(n,t){if(n<=0)return 0;if(n>=t)return 1;const e=1-n/t;return 1-e*e*Math.sqrt(e)},dome(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return Math.sqrt(1-(1-e)*(1-e))},ridge(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return 1-(1-e)*(1-e)},u(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return Math.sqrt(1-(1-e)*(1-e))},v(n,t){return n<=0?0:Math.min(n/t,1)}},ey=new Set(["dome","ridge","v"]),Ss=class Ss{constructor({width:t,height:e,ppmm:i=8,maxSize:s=Ss.maxSize,seed:o=1}={}){if(!(t>0&&e>0))throw new Error("ReliefPanel: width and height (mm) required");this.width=t,this.height=e,s=Math.min(s,Ss.maxSizeCap),this.ppmm=Math.min(i,s/t,s/e),this.cols=Math.max(2,Math.round(t*this.ppmm)),this.rows=Math.max(2,Math.round(e*this.ppmm)),this.ppmm=this.cols/t,this.field=new Float32Array(this.cols*this.rows),this.groove=new Float32Array(this.cols*this.rows),this.seed=o,this.rng=new Be(o),this.stats={ops:0,ms:0},this._canvas=null,this._probeCanvas=null}raise(t,{height:e=1.2,shoulder:i,profile:s="plateau"}={}){const o=this._profile(s);return this._apply(t,s,i,.5,(a,r)=>{const c=e*r;c>this.field[a]&&(this.field[a]=c)},o),this}sink(t,{depth:e=.5,shoulder:i,profile:s="u"}={}){const o=this._profile(s);return this._apply(t,s,i,.25,(a,r)=>{this.field[a]-=e*r,r>this.groove[a]&&(this.groove[a]=r)},o),this}add(t,{height:e=.3,shoulder:i,profile:s="ridge"}={}){const o=this._profile(s);return this._apply(t,s,i,.25,(a,r)=>{this.field[a]+=e*r},o),this}mask(t){const e=new Float32Array(this.cols*this.rows),i=this._rasterize(t);if(i){const{cov:s,x0:o,y0:a,bw:r,bh:c}=i;for(let l=0;l<c;l++){const h=a+l;if(!(h<0||h>=this.rows))for(let u=0;u<r;u++){const f=o+u;f<0||f>=this.cols||(e[h*this.cols+f]=s[l*r+u])}}}return{data:e,cols:this.cols,rows:this.rows,ppmm:this.ppmm}}fillGround(t={},{avoid:e="raised",margin:i=.6,rect:s}={}){return Si(this,{rect:s??{x:0,y:0,w:this.width,h:this.height},avoid:e,margin:i},t)}mirrorX(t){const{cols:e,field:i,groove:s}=this,o=t??{x:0,y:0,w:this.width,h:this.height},a=Math.max(0,Math.round(o.x*this.ppmm)),r=Math.min(e,Math.round((o.x+o.w)*this.ppmm)),c=Math.max(0,Math.round(o.y*this.ppmm)),l=Math.min(this.rows,Math.round((o.y+o.h)*this.ppmm)),h=r-a>>1;for(let u=c;u<l;u++){const f=u*e;for(let p=0;p<h;p++)i[f+r-1-p]=i[f+a+p],s[f+r-1-p]=s[f+a+p]}return this}heightAt(t,e){const i=Math.min(this.cols-1,Math.max(0,Math.floor(t*this.ppmm))),s=Math.min(this.rows-1,Math.max(0,Math.floor(e*this.ppmm)));return this.field[s*this.cols+i]}bake(t={}){return Rf(this,t)}_profile(t){if(typeof t=="function")return t;const e=Ns[t];if(!e)throw new Error(`ReliefPanel: unknown profile "${t}"`);return e}_apply(t,e,i,s,o,a){const r=performance.now(),c=this._rasterize(t);if(!c)return;const{cov:l,x0:h,y0:u,bw:f,bh:p}=c,_=Nu(l,f,p),g=1/this.ppmm;let d=i??(ey.has(e)?null:s);if(d==null){let M=0;for(let v=0;v<_.length;v++)_[v]>M&&(M=_[v]);d=Math.max(M*g,.001)}const{cols:m,rows:y}=this;for(let M=0;M<p;M++){const v=u+M;if(!(v<0||v>=y))for(let x=0;x<f;x++){const b=h+x;if(b<0||b>=m)continue;const w=_[M*f+x];w<=0||o(v*m+b,a(w*g,d))}}this.stats.ops++,this.stats.ms+=performance.now()-r}_rasterize(t){const{cols:e,rows:i,ppmm:s}=this,o=Math.max(1,Math.ceil(Math.max(e,i)/ty)),a=Math.ceil(e/o),r=Math.ceil(i/o);this._probeCanvas||(this._probeCanvas=br(a,r));const c=this._probeCanvas;c.width=a,c.height=r;const l=ic(c);Vh(l),l.setTransform(s/o,0,0,-s/o,0,i/o);const h=[];if(t(ny(l,h)),!h.length)return null;const u=l.getImageData(0,0,a,r).data;let f=a,p=r,_=-1,g=-1;for(let R=0;R<r;R++){const O=R*a*4;for(let A=0;A<a;A++)u[O+A*4+3]!==0&&(A<f&&(f=A),A>_&&(_=A),R<p&&(p=R),R>g&&(g=R))}if(_<0)return null;const d=Math.max(-pi,f*o-pi-o),m=Math.min(e+pi,(_+1)*o+pi+o),y=p*o-pi-o,M=(g+1)*o+pi+o,v=Math.max(-pi,i-M),x=Math.min(i+pi,i-y),b=m-d,w=x-v;this._canvas||(this._canvas=br(b,w));const L=this._canvas;L.width=b,L.height=w;const S=ic(L);Vh(S),S.setTransform(s,0,0,-s,-d,x),iy(S,h);const T=S.getImageData(0,0,b,w).data,C=new Float32Array(b*w);for(let R=0;R<w;R++){const O=R*b*4,A=(w-1-R)*b;for(let D=0;D<b;D++)C[A+D]=T[O+D*4+3]/255}return{cov:C,x0:d,y0:v,bw:b,bh:w}}};Do(Ss,"maxSize",4096),Do(Ss,"maxSizeCap",1/0);let wo=Ss;function Vh(n){n.setTransform(1,0,0,1,0,0),n.globalCompositeOperation="source-over",n.globalAlpha=1,n.fillStyle="#fff",n.strokeStyle="#fff",n.lineCap="round",n.lineJoin="round",n.miterLimit=4,n.lineWidth=1}function ny(n,t){return new Proxy(n,{get(e,i){const s=e[i];return typeof s=="function"?(...o)=>(t.push([i,o]),s.apply(e,o)):s},set(e,i,s){return t.push([i,s,!0]),e[i]=s,!0}})}function iy(n,t){for(const e of t)e[2]?n[e[0]]=e[1]:n[e[0]](...e[1])}const ge=Math.PI/180;function Uf(n,t,e=!1,i=.5){const s=t.length;if(n.beginPath(),s===0)return;if(s<3){n.moveTo(t[0][0],t[0][1]);for(let c=1;c<s;c++)n.lineTo(t[c][0],t[c][1]);e&&n.closePath();return}const o=c=>e?t[(c+s)%s]:t[Math.max(0,Math.min(s-1,c))],a=i/3;n.moveTo(t[0][0],t[0][1]);const r=e?s:s-1;for(let c=0;c<r;c++){const l=o(c-1),h=o(c),u=o(c+1),f=o(c+2);n.bezierCurveTo(h[0]+(u[0]-l[0])*a,h[1]+(u[1]-l[1])*a,u[0]-(f[0]-h[0])*a,u[1]-(f[1]-h[1])*a,u[0],u[1])}e&&n.closePath()}function Fs(n,t,e=!1){n.beginPath(),t.forEach((i,s)=>s?n.lineTo(i[0],i[1]):n.moveTo(i[0],i[1])),e&&n.closePath()}function Rn(n){let t=0;for(let e=1;e<n.length;e++)t+=Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]);return t}function un(n,t=.5){if(n.length<2)return n.slice();const e=Rn(n),i=Math.max(1,Math.ceil(e/t)),s=[n[0].slice()];let o=1,a=0,r=Math.hypot(n[1][0]-n[0][0],n[1][1]-n[0][1]);for(let c=1;c<i;c++){const l=c/i*e;for(;a+r<l&&o<n.length-1;)a+=r,o++,r=Math.hypot(n[o][0]-n[o-1][0],n[o][1]-n[o-1][1]);const h=r>0?(l-a)/r:0,u=n[o-1],f=n[o];s.push([u[0]+(f[0]-u[0])*h,u[1]+(f[1]-u[1])*h])}return s.push(n[n.length-1].slice()),s}function Nf(n,t=0,e=0){const i=Rn(n);return t+e>=i?[]:$r(n,t,i-e)}function $r(n,t,e){const i=[];let s=0;for(let o=1;o<n.length;o++){const a=n[o-1],r=n[o],c=Math.hypot(r[0]-a[0],r[1]-a[1]),l=s,h=s+c;if(h>=t&&l<=e&&c>0){const u=Math.max(0,(t-l)/c),f=Math.min(1,(e-l)/c);i.length||i.push([a[0]+(r[0]-a[0])*u,a[1]+(r[1]-a[1])*u]),i.push([a[0]+(r[0]-a[0])*f,a[1]+(r[1]-a[1])*f])}s=h}return i}function Mc(n,t=.4,e=.5){const i=n.length;if(i<3)return un(n,t);const s=r=>n[Math.max(0,Math.min(i-1,r))],o=e/3,a=[n[0].slice()];for(let r=0;r<i-1;r++){const c=s(r-1),l=s(r),h=s(r+1),u=s(r+2),f=[l[0]+(h[0]-c[0])*o,l[1]+(h[1]-c[1])*o],p=[h[0]-(u[0]-l[0])*o,h[1]-(u[1]-l[1])*o],_=Math.max(4,Math.ceil(Math.hypot(h[0]-l[0],h[1]-l[1])/(t*.5)));for(let g=1;g<=_;g++){const d=g/_,m=1-d;a.push([m*m*m*l[0]+3*m*m*d*f[0]+3*m*d*d*p[0]+d*d*d*h[0],m*m*m*l[1]+3*m*m*d*f[1]+3*m*d*d*p[1]+d*d*d*h[1]])}}return un(a,t)}function Ff(n){const t=n.length,e=new Array(t);for(let i=0;i<t;i++){const s=n[Math.max(0,i-1)],o=n[Math.min(t-1,i+1)];let a=o[0]-s[0],r=o[1]-s[1];const c=Math.hypot(a,r)||1;a/=c,r/=c,e[i]=[-r,a]}return e}function Of(n,t=!1){const e=n.length,[i,s]=t?[n[0],n[Math.min(1,e-1)]]:[n[Math.max(0,e-2)],n[e-1]];return Math.atan2(s[1]-i[1],s[0]-i[0])/ge}function Ze(n,t,{closed:e=!1,step:i=.35}={}){const s=n.length;if(s<3)return n.map(c=>c.slice());const o=[],a=c=>Array.isArray(t)?t[c]??0:t,r=e?[...Array(s).keys()]:[...Array(s).keys()].slice(1,s-1);e||o.push(n[0].slice());for(const c of r){const l=n[c],h=n[(c-1+s)%s],u=n[(c+1)%s],f=Math.hypot(h[0]-l[0],h[1]-l[1]),p=Math.hypot(u[0]-l[0],u[1]-l[1]),_=a(c);if(!(_>0)||f<1e-6||p<1e-6){o.push(l.slice());continue}const g=[(h[0]-l[0])/f,(h[1]-l[1])/f],d=[(u[0]-l[0])/p,(u[1]-l[1])/p],m=Math.max(-1,Math.min(1,g[0]*d[0]+g[1]*d[1])),y=Math.acos(m);if(y>Math.PI-.001){o.push(l.slice());continue}const M=Math.tan(y/2);let v=_/M;const x=e||c-1>0?.5:1,b=e||c+1<s-1?.5:1;v=Math.min(v,f*x,p*b);const w=v*M,L=[l[0]+g[0]*v,l[1]+g[1]*v],S=[l[0]+d[0]*v,l[1]+d[1]*v],T=[g[0]+d[0],g[1]+d[1]],C=Math.hypot(T[0],T[1])||1,R=w/Math.sin(y/2),O=[l[0]+T[0]/C*R,l[1]+T[1]/C*R];let A=Math.atan2(L[1]-O[1],L[0]-O[0]),k=Math.atan2(S[1]-O[1],S[0]-O[0])-A;for(;k>Math.PI;)k-=2*Math.PI;for(;k<-Math.PI;)k+=2*Math.PI;const I=Math.max(2,Math.ceil(Math.abs(k)*w/i));for(let N=0;N<=I;N++){const z=A+k*N/I;o.push([O[0]+Math.cos(z)*w,O[1]+Math.sin(z)*w])}}return e||o.push(n[s-1].slice()),o}function zf(n,t,e=.08,i=14){if(!t||!(e>0)||n.length<3)return n;const s=t.range(0,6.283),o=t.range(0,6.283),a=6.283/i,r=6.283/(i*.43),c=Ff(n);let l=0;return n.map((h,u)=>{u&&(l+=Math.hypot(h[0]-n[u-1][0],h[1]-n[u-1][1]));const f=e*(.7*Math.sin(l*a+s)+.3*Math.sin(l*r+o));return[h[0]+c[u][0]*f,h[1]+c[u][1]*f]})}class re{constructor(t,e=0){this.v=[[t[0],t[1]]],this.r=[0],this.h=e,this.marks={}}get pos(){return this.v[this.v.length-1]}fwd(t){const[e,i]=this.pos;return this.v.push([e+Math.cos(this.h*ge)*t,i+Math.sin(this.h*ge)*t]),this.r.push(0),this}turn(t,e=0){return this.h+=t,this.r[this.r.length-1]=e,this}head(t,e=0){return this.h=t,this.r[this.r.length-1]=e,this}to(t,e){e!==void 0&&(this.r[this.r.length-1]=e);const[i,s]=this.pos;return this.h=Math.atan2(t[1]-s,t[0]-i)/ge,this.v.push([t[0],t[1]]),this.r.push(0),this}mark(t){return this.marks[t]=this.v.length-1,this}curl({dir:t=1,size:e=10,pitch:i=4,turns:s=1,r:o=2,shrink:a=1}={}){const[r,c]=Array.isArray(e)?e:[e,e],l=Math.max(1,Math.round(s*4));let h=r,u=c;for(let f=0;f<l;f++){const p=f%2===0?h:u;if(p<i*.35)break;this.turn(90*t,o),this.fwd(p),f%2===1&&(h=(h-i)*a,u=(u-i)*a),o=Math.min(o,Math.max(.2,Math.min(h,u)*.5))}return this}spine(t=.4){return un(Ze(this.v,this.r),t)}}function So(n,t,e,i,s=.4){const o=(i-e)*ge,a=Math.max(2,Math.ceil(Math.abs(o)*t/s)),r=[];for(let c=0;c<=a;c++){const l=e*ge+o*c/a;r.push([n[0]+Math.cos(l)*t,n[1]+Math.sin(l)*t])}return r}function kr(n,t,{start:e=0,sweep:i=270,dir:s=1,shrink:o=.15,step:a=.4}={}){const r=[],c=Math.abs(i)*ge,l=Math.max(4,Math.ceil(c*t/a));for(let h=0;h<=l;h++){const u=h/l,f=e*ge+s*c*u,p=t*Math.pow(1-o,c*u/(Math.PI/2));r.push([n[0]+Math.cos(f)*p,n[1]+Math.sin(f)*p])}return r}function sy(n,{pitch:t=2,turns:e=2,dir:i=1,rCorner:s=.3,startHeading:o=0,step:a=.3}={}){const r=Math.max(2,Math.round(e*4)),c=[];for(let p=0;p<r;p++)c.push(t*Math.ceil((p+1)/2));let l=o+180+i*90*(r-1);const h=[[n[0],n[1]]];let u=n[0],f=n[1];for(let p=0;p<r;p++)u+=Math.cos(l*ge)*c[p],f+=Math.sin(l*ge)*c[p],h.push([u,f]),l-=i*90;return h.reverse(),un(Ze(h,s*t),a)}function Ie(n,t,e,{curl:i=90,radius:s=2,dir:o=1,step:a=.3}={}){const r=new re(n,t).fwd(e),c=r.spine(a),l=r.h,h=r.pos[0]+Math.cos((l+90*o)*ge)*s,u=r.pos[1]+Math.sin((l+90*o)*ge)*s,f=l-90*o,p=So([h,u],s,f,f+i*o,a);return c.concat(p.slice(1))}function oy(n,t,e,{sweep:i=240,shrink:s=.15,step:o=.4}={}){const a=Math.atan2(t[1]-n[1],t[0]-n[0])/ge,r=[n[0]+Math.cos((a+90)*ge)*e,n[1]+Math.sin((a+90)*ge)*e],c=[t[0]+Math.cos((a-90)*ge)*e,t[1]+Math.sin((a-90)*ge)*e],l=kr(r,e,{start:a-90,sweep:i,dir:-1,shrink:s,step:o}).reverse(),h=kr(c,e,{start:a+90,sweep:i,dir:-1,shrink:s,step:o});return l.concat(un([n,t],o).slice(1,-1),h)}const fn=(n,t,e=0)=>i=>i<e?n:n+(t-n)*((i-e)/(1-e)),Rs=(n,t=.4,e=.35)=>i=>i<1-t?n:n*(1-(1-e)*((i-(1-t))/t)),$c=(n,t,e="round",i="round",s={})=>({kind:"band",pts:n,w:t,capA:e,capB:i,...s}),Nn=(n,t={})=>({kind:"poly",pts:n,...t}),On=(n,t,e={})=>({kind:"circle",c:n,r:t,...e}),Dr=(n,t,e,i=0,s={})=>({kind:"ellipse",c:n,rx:t,ry:e,rot:i,...s}),zi=(n,t,e,i,s=0,o={})=>({kind:"rrect",c:n,w:t,h:e,r:i,rot:s,...o});function Kc(n,t,e,i=0,s=.3){const o=t/2,a=e/2,r=(o*o+a*a)/(2*a),c=Math.asin(Math.min(1,o/r))/ge,l=So([0,a-r],r,90+c,90-c,s),h=So([0,r-a],r,-90+c,-90-c,s),u=Math.cos(i*ge),f=Math.sin(i*ge);return l.concat(h.slice(1,-1)).map(([p,_])=>[n[0]+p*u-_*f,n[1]+p*f+_*u])}function Bf(n,t){const e={...n};return e.pts&&(e.pts=e.pts.map(t)),e.c&&(e.c=t(e.c)),e}function Ps(n,t,e=0){switch(t.kind){case"band":return ry(n,t,e);case"poly":if(t.pts.length<3)return;Fs(n,t.pts,!0),n.fill(),e>0&&(n.lineWidth=e*2,n.lineJoin="round",n.stroke());return;case"circle":n.beginPath(),n.arc(t.c[0],t.c[1],t.r+e,0,Math.PI*2),n.fill();return;case"ellipse":n.beginPath(),n.ellipse(t.c[0],t.c[1],t.rx+e,t.ry+e,(t.rot||0)*ge,0,Math.PI*2),n.fill();return;case"rrect":{const i=t.w+e*2,s=t.h+e*2,o=Math.min(t.r+e,i/2,s/2);n.save(),n.translate(t.c[0],t.c[1]),t.rot&&n.rotate(t.rot*ge),n.beginPath(),n.moveTo(-i/2+o,-s/2),n.arcTo(i/2,-s/2,i/2,s/2,o),n.arcTo(i/2,s/2,-i/2,s/2,o),n.arcTo(-i/2,s/2,-i/2,-s/2,o),n.arcTo(-i/2,-s/2,i/2,-s/2,o),n.closePath(),n.fill(),n.restore();return}}}function Wh(n,t,e){if(e<=0||n.length<2)return n;const i=Of(n,t)*ge;if(t){const o=n[0];return[[o[0]-Math.cos(i)*e,o[1]-Math.sin(i)*e],...n]}const s=n[n.length-1];return[...n,[s[0]+Math.cos(i)*e,s[1]+Math.sin(i)*e]]}function ry(n,t,e){let i=t.pts;if(!i||i.length<2)return;const s=typeof t.w=="number",o=s?()=>t.w:t.w;t.capA==="square"&&(i=Wh(i,!0,o(0)*.18)),t.capB==="square"&&(i=Wh(i,!1,o(1)*.18));const a=t.capA==="round",r=t.capB==="round";if(s&&t.capA!=="point"&&t.capB!=="point")n.lineWidth=t.w+e*2,n.lineJoin="round",n.lineCap="butt",Fs(n,i,!1),n.stroke();else{const l=Rn(i);let h=1/0;for(let _=0;_<=8;_++)h=Math.min(h,Math.max(.3,o(_/8)));const u=un(i,Math.max(.08,Math.min(.35,h*.12))),f=Rn(u);let p=0;n.beginPath();for(let _=0;_<u.length;_++){_&&(p+=Math.hypot(u[_][0]-u[_-1][0],u[_][1]-u[_-1][1]));const g=f>0?p/f:0;let d=o(g);t.capA==="point"&&(d*=Math.min(1,g*l/Math.max(.5,o(0)*1.2))),t.capB==="point"&&(d*=Math.min(1,(1-g)*l/Math.max(.5,o(1)*1.2)));const m=d/2+e;m<=.02||(n.moveTo(u[_][0]+m,u[_][1]),n.arc(u[_][0],u[_][1],m,0,Math.PI*2))}n.fill();for(const[_,g]of[[!0,t.capA],[!1,t.capB]]){if(g==="round"||g==="point")continue;const d=o(_?0:1)+e*2,m=_?u.slice(0,3):u.slice(-3);n.lineWidth=d,n.lineCap="butt",Fs(n,m,!1),n.stroke()}}const c=(l,h)=>{n.beginPath(),n.arc(i[l][0],i[l][1],h/2+e,0,Math.PI*2),n.fill()};a&&c(0,o(0)),r&&c(i.length-1,o(1)),e>0&&!a&&c(0,0),e>0&&!r&&c(i.length-1,0)}function yc(n,t,e,i="round"){!t||t.length<2||(n.lineWidth=e,n.lineCap=i,n.lineJoin="round",Fs(n,t,!1),n.stroke())}function Gf(n,{faceW:t=.66,spread:e=1,reserve:i=0,invert:s=!1,taper:o=0}={}){const a=n.h,r=n.w/2,c=Math.min(a,r/(t*e+i)),l={rect:n,H:a,hw:r,s:c,spread:e,invert:s,taper:o,cx:n.x+r,X:h=>h*c*e,Y:h=>h*a,P:(h,u)=>[h*c*e,u*a],u:h=>h*c,taperAt:h=>{const u=Math.max(0,Math.min(1,h/a));return o>=0?1-o*u:1+o*(1-u)},widthAt:h=>r*l.taperAt(h),warp:h=>o?[h[0]*l.taperAt(h[1]),h[1]]:h,toPanel:h=>{const u=l.warp(h);return[l.cx-u[0],n.y+(s?a-u[1]:u[1])]},apply(h){h.translate(l.cx,n.y),h.scale(-1,1),s&&(h.translate(0,a),h.scale(1,-1))}};return l}const ay=Object.freeze(Object.defineProperty({__proto__:null,Turtle:re,arcPts:So,band:$c,cScroll:kr,circle:On,drawShape:Ps,ellipse:Dr,fillet:Ze,halfMaskFrame:Gf,headingAt:Of,hookSpine:Ie,lens:Kc,mapShape:Bf,normals:Ff,poly:Nn,polyLength:Rn,polyPath:Fs,resample:un,rrect:zi,sScroll:oy,smoothPath:Uf,spline:Mc,sqSpiral:sy,strokeLine:yc,subPath:$r,tail:Rs,taper:fn,trim:Nf,wobble:zf},Symbol.toStringTag,{value:"Module"})),ni=Math.PI/180,Ki=(n,t,e)=>Math.max(t,Math.min(e,n));function vr(n,t,e){const i=n.length;if(t==null)return Array(i).fill(e);if(typeof t=="number")return Array(i).fill(t);if(Array.isArray(t))return n.map((s,o)=>t[Math.min(o,t.length-1)]??e);if(typeof t=="function"){const s=Rn(n)||1;let o=0;return n.map((a,r)=>(r&&(o+=Math.hypot(a[0]-n[r-1][0],a[1]-n[r-1][1])),t(o/s)))}return Array(i).fill(e)}function vc(n){let t=0;for(let e=0;e<n.length;e++){const i=n[e],s=n[(e+1)%n.length];t+=i[0]*s[1]-s[0]*i[1]}return t/2}function jh(n,t,e=!0){let i=1/0;const s=t.length,o=e?s:s-1;for(let a=0;a<o;a++){const r=t[a],c=t[(a+1)%s],l=c[0]-r[0],h=c[1]-r[1],u=l*l+h*h;let f=u>0?((n[0]-r[0])*l+(n[1]-r[1])*h)/u:0;f=Ki(f,0,1);const p=Math.hypot(r[0]+l*f-n[0],r[1]+h*f-n[1]);p<i&&(i=p)}return i}function cy(n,t){let e=1/0,i=t[0];const s=t.length;for(let o=0;o<s;o++){const a=t[o],r=t[(o+1)%s],c=r[0]-a[0],l=r[1]-a[1],h=c*c+l*l,u=h>0?Ki(((n[0]-a[0])*c+(n[1]-a[1])*l)/h,0,1):0,f=[a[0]+c*u,a[1]+l*u],p=Math.hypot(f[0]-n[0],f[1]-n[1]);p<e&&(e=p,i=f)}return{d:e,p:i}}function qh(n,t){let e=!1;for(let i=0,s=t.length-1;i<t.length;s=i++){const o=t[i],a=t[s];o[1]>n[1]!=a[1]>n[1]&&n[0]<(a[0]-o[0])*(n[1]-o[1])/(a[1]-o[1]||1e-12)+o[0]&&(e=!e)}return e}function mo(n,t,e=!0){if(!(!t||t.length<2)){n.moveTo(t[0][0],t[0][1]);for(let i=1;i<t.length;i++)n.lineTo(t[i][0],t[i][1]);e&&n.closePath()}}function Kr(n,t,e,i=!1){if(!(e>0)||!t||n.length<3)return n;const s=t.range(0,6.283),o=t.range(0,6.283),a=6.283/t.range(9,16),r=6.283/t.range(3.5,6),c=n.length;let l=0;return n.map((h,u)=>{u&&(l+=Math.hypot(h[0]-n[u-1][0],h[1]-n[u-1][1]));const f=n[i?(u-1+c)%c:Math.max(0,u-1)],p=n[i?(u+1)%c:Math.min(c-1,u+1)];let _=p[0]-f[0],g=p[1]-f[1];const d=Math.hypot(_,g)||1,m=e*(.7*Math.sin(l*a+s)+.3*Math.sin(l*r+o));return[h[0]-g/d*m,h[1]+_/d*m]})}function js(n,t,e){const i=n.length,s=[];for(let l=0;l<i-1;l++){const h=n[l+1][0]-n[l][0],u=n[l+1][1]-n[l][1],f=Math.hypot(h,u)||1e-9;s.push([h/f,u/f])}const o=[],a=[],r=[],c=[];for(let l=0;l<i;l++){const h=s[Math.max(0,l-1)],u=s[Math.min(i-2,l)],f=[-h[1],h[0]],p=[-u[1],u[0]];let _=f[0]+p[0],g=f[1]+p[1],d=Math.hypot(_,g);d<1e-6&&(_=f[0],g=f[1],d=1),_/=d,g/=d;const m=1/Math.max(.3,_*f[0]+g*f[1]);c.push([_*m,g*m]),o.push([n[l][0]+_*t[l]*m,n[l][1]+g*t[l]*m]),a.push([n[l][0]-_*e[l]*m,n[l][1]-g*e[l]*m]),r.push(l>0&&l<i-1?h[0]*u[1]-h[1]*u[0]:0)}return{L:o,R:a,turn:r,M:c,d:s}}function Xh(n,t,e,i){const s=i.gap??Math.max(.5,e*.16),o=i.turns??1.25,a=i.dir??1,r=i.taper??1,c=e*(1+r)/2+s,l=i.R??o*c+.42*e,h=[-t[1]*a,t[0]*a],u=[n[0]+h[0]*l,n[1]+h[1]*l],f=[-h[0],-h[1]],p=[],_=[],g=Math.max(.55*e*r,.3),d=Math.min(o*2*Math.PI,2*Math.PI*(l-g)/c);let m=0;for(;m<d;){const y=.3/Math.max(.5,l-c*m/(2*Math.PI));m=Math.min(d,m+y);const M=l-c*m/(2*Math.PI),v=a*m,x=Math.cos(v),b=Math.sin(v);p.push([u[0]+M*(f[0]*x-f[1]*b),u[1]+M*(f[0]*b+f[1]*x)]),_.push(e*(1+(r-1)*(m/d)))}return{pts:p,ws:_,centre:u}}function kn(n,t={}){n=n.map(p=>[p[0],p[1]]);let e=vr(n,t.width,3),i=vr(n,t.round,.5),s=vr(n,t.inner,.15),o=n.map(()=>!1);const a=t.start??"blunt",r=t.end??"blunt";let c=n,l=[];const h=(p,_)=>{const[g,d]=_?[p[1],p[0]]:[p[p.length-2],p[p.length-1]],m=Math.hypot(d[0]-g[0],d[1]-g[1])||1;return[(d[0]-g[0])/m,(d[1]-g[1])/m]};let u={a:0,b:n.length};if(r==="spiral"){const p=Xh(c[c.length-1],h(c,!1),e[e.length-1],t.spiral||{});c=c.concat(p.pts),e=e.concat(p.ws),i=i.concat(p.pts.map(()=>0)),s=s.concat(p.pts.map(()=>0)),o=o.concat(p.pts.map(()=>!0)),l.push(p.centre)}if(a==="spiral"){const p=t.startSpiral||t.spiral||{},_=Xh(c[0],h(c,!0),e[0],{...p,dir:-(p.dir??1)}),g=_.pts.length;c=_.pts.slice().reverse().concat(c),e=_.ws.slice().reverse().concat(e),i=Array(g).fill(0).concat(i),s=Array(g).fill(0).concat(s),o=Array(g).fill(!0).concat(o),u={a:g,b:u.b+g},l.push(_.centre)}r==="point"&&(e[e.length-1]=Math.min(e[e.length-1],.08)),a==="point"&&(e[0]=Math.min(e[0],.08));const f={kind:"stroke",ctrl:n,spine:c,widths:e,dense:o,coil:l,body:u,start:a,end:r,opts:t,roundOut:i,roundIn:s,capRound:t.capRound??.3};return f.outline=Hf(f,0,0),f}function Hf(n,t,e,i=0){let s=n.spine;const o=s.length,a=Os(n,t),r=Os(n,e),c=n.widths.map((g,d)=>Math.max(.02,g/2-a[d])),l=n.widths.map((g,d)=>Math.max(.02,g/2-r[d])),h=a.map((g,d)=>(g+r[d])/2),u=n.widths.map((g,d)=>Math.max(0,n.roundOut[d]*g-h[d])),f=n.widths.map((g,d)=>Math.max(0,n.roundIn[d]*g+h[d])),p=(h[0]+h[o-1])/2,_=[n.start,n.end].map((g,d)=>g==="flat"?0:Math.max(0,n.capRound*n.widths[d?o-1:0]-p*.5));if(i>0){s=s.map(g=>g.slice());for(const[g,d]of[[!0,n.start],[!1,n.end]]){if(d!=="blunt"&&d!=="flat")continue;const m=g?0:o-1,y=g?1:o-2,M=s[m][0]-s[y][0],v=s[m][1]-s[y][1],x=Math.hypot(M,v),b=Math.min(i,x*.45);s[m]=[s[m][0]-M/x*b,s[m][1]-v/x*b]}}return ly(s,c,l,u,f,[n.start,n.end],_,n.dense)}function Os(n,t){const e=n.spine.length;if(!Array.isArray(t))return Array(e).fill(t);const i=n.ctrl.length,s=n.body.a;return Array.from({length:e},(o,a)=>t[Math.max(0,Math.min(i-1,a-s))]??t[t.length-1])}const In=n=>Array.isArray(n)?n.reduce((t,e)=>t+e,0)/n.length:n;function ly(n,t,e,i,s,o,a,r){const c=n.length,{L:l,R:h,turn:u,d:f}=js(n,t,e),p=.02,_=[],g=[];for(let M=0;M<c;M++)_.push(l[M]),g.push(r[M]?0:u[M]>p?s[M]:u[M]<-p?i[M]:0);const d=(M,v,x,b)=>{const w=x+b,L=[-v[1],v[0]],S=[M[0]+L[0]*(x-b)/2,M[1]+L[1]*(x-b)/2],T=Math.atan2(v[1],v[0]),C=Math.max(4,Math.ceil(Math.PI*w/2/.25));for(let R=1;R<C;R++){const O=T+Math.PI/2-Math.PI*R/C;_.push([S[0]+Math.cos(O)*w/2,S[1]+Math.sin(O)*w/2]),g.push(0)}};o[1]==="round"||o[1]==="spiral"?d(n[c-1],f[c-2],t[c-1],e[c-1]):o[1]!=="point"&&(g[g.length-1]=a[1]);for(let M=c-1;M>=0;M--)_.push(h[M]),g.push(r[M]?0:u[M]<-p?s[M]:u[M]>p?i[M]:0),M===c-1&&o[1]!=="round"&&o[1]!=="spiral"&&o[1]!=="point"&&(g[g.length-1]=a[1]);o[0]==="round"||o[0]==="spiral"?d(n[0],[-f[0][0],-f[0][1]],e[0],t[0]):o[0]!=="point"&&(g[g.length-1]=a[0],g[0]=a[0]);let m=_,y=g;return vc(m)<0&&(m=m.slice().reverse(),y=y.slice().reverse()),Ze(m,y,{closed:!0,step:.2})}function xc(n={}){const{c:t=[0,0],w:e=10,h:i=8,rot:s=0}=n,o=n.r??(n.round??.3)*Math.min(e,i),a={kind:"plate",c:t,w:e,h:i,r:o,rot:s,opts:n};return a.outline=Vf(a,0),a}function Vf(n,t){const e=n.w-2*t,i=n.h-2*t,s=Ki(n.r-t,0,Math.min(e,i)/2),o=Math.cos(n.rot*ni),a=Math.sin(n.rot*ni),r=[[-e/2,-i/2],[e/2,-i/2],[e/2,i/2],[-e/2,i/2]];return Ze(r,s,{closed:!0,step:.2}).map(([l,h])=>[n.c[0]+l*o-h*a,n.c[1]+l*a+h*o])}function hy(n,t={}){const e=n.map(a=>[a[0],a[1]]),i=vr(e,t.round,0),s=vc(e)<0?e.slice().reverse():e,o={kind:"poly",pts:s,opts:t};return o.radii=vc(e)<0?i.slice().reverse():i,o.outline=Ze(s,o.radii,{closed:!0,step:.2}),o}function Wf(n,t){const[e,i]=Array.isArray(t)?t:[t,t];if(n.kind==="stroke")return Hf(n,e,i,(In(e)+In(i))/2);if(n.kind==="plate")return Vf(n,(In(e)+In(i))/2);const s=(In(e)+In(i))/2,o=n.pts.length,a=[];for(let r=0;r<o;r++){const c=n.pts[(r-1+o)%o],l=n.pts[r],h=n.pts[(r+1)%o],u=Fa([l[0]-c[0],l[1]-c[1]]),f=Fa([h[0]-l[0],h[1]-l[1]]),p=[-u[1],u[0]],_=[-f[1],f[0]];let g=Fa([p[0]+_[0],p[1]+_[1]]);const d=1/Math.max(.3,g[0]*p[0]+g[1]*p[1]);a.push([l[0]+g[0]*s*d,l[1]+g[1]*s*d])}return Ze(a,n.radii.map(r=>Math.max(0,r-s)),{closed:!0,step:.2})}const Fa=n=>{const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]};function jf(n,t=0){return e=>{for(const i of n)e.beginPath(),mo(e,i.outline,!0),e.fill(),t>0&&(e.lineWidth=t*2,e.lineJoin="round",e.stroke())}}const Oa={inset:1,line:.42};function ws(n,t,e={}){var f,p,_;const i=typeof performance<"u"?performance.now():0,s=Array.isArray(t)?t:[t],o=e.height??1.2,a=e.depth??.35,r=new Be(`carve:${e.seed??0}:${s.length}:${(_=(p=(f=s[0])==null?void 0:f.outline)==null?void 0:p[0])==null?void 0:_.map(g=>g.toFixed(2)).join(",")}`),c=.05*(e.irregularity??1);if(e.raise!==!1){const g=e.shoulder??Ki(o*.35,.2,.6);n.raise(jf(s),{height:o,shoulder:g,profile:"plateau"})}const l=[],h=[],u=[];for(const g of s){const d=g.opts||{},m=d.contour!==void 0?d.contour:e.contour!==void 0?e.contour:Oa,y=d.fill!==void 0?d.fill:e.fill??null,M=d.ticks!==void 0?d.ticks:e.ticks??null,v=m?m.line??Oa.line:0,x=m?m.inset??Oa.inset:.6,[b,w]=Array.isArray(x)?x:[x,x],L=Wf(g,[b,w]),S=In(b),T=In(w);if(m&&l.push({pts:Kr(L,r,c,!0),w:v,closed:!0}),M&&py(g,L,[b,w],M,v,l),!y||y.kind==="none")continue;const C=y.line??v??.4,R=y.gap??Math.max(.35,C*.9);y.kind==="leiwen"?h.push({C:L,fill:y}):y.kind==="spirals"?u.push(...fy(g,L,{...y,_insets:[b,w]},C,m?v:0,R,r,c,l)):y.kind==="lines"?qf(g,[S,T],y,C,R,m?v:0,l,r,c):y.kind==="scales"?gy(g,L,y,C,l):y.kind==="coil"&&Xf(g,[S,T],y,C,m?v:0,R,l,r,c)}if(l.length){let g=0;for(const d of l)g=Math.max(g,d.w);n.sink(d=>{d.lineCap="round",d.lineJoin="round";let m=null;for(const y of l)y.clip!==m&&(m&&d.restore(),m=y.clip||null,m&&(d.save(),d.beginPath(),mo(d,m,!0),d.clip())),d.lineWidth=y.w,d.beginPath(),mo(d,y.pts,!!y.closed),d.stroke();m&&d.restore()},{depth:a,shoulder:g*.45,profile:"u"})}for(const{C:g,fill:d}of h)Yr(n,m=>{m.beginPath(),mo(m,g,!0),m.fill()},{pitch:d.pitch??1,line:d.lineFrac??.45,depth:d.depth??a,roundness:d.roundness??.15,echo:0,eyes:0,seed:e.seed??0,...d.leiwen||{}},{margin:d.margin??.35,level:o});return{spirals:u,grooves:l.length,ms:Math.round((typeof performance<"u"?performance.now():0)-i)}}function uy(n,t){if(n.kind==="stroke"){const c=Math.max(...n.widths),l=un(n.spine.slice(n.body.a,Math.max(n.body.a+2,n.body.b)),Math.max(.3,c/24)),{M:h}=js(l,l.map(()=>0),l.map(()=>0)),u=[];for(let f=-c/2;f<=c/2;f+=Math.max(.3,c/24))for(let p=0;p<l.length;p++)u.push([l[p][0]+h[p][0]*f,l[p][1]+h[p][1]*f]);return u}let e=1/0,i=1/0,s=-1/0,o=-1/0;for(const[c,l]of t)e=Math.min(e,c),i=Math.min(i,l),s=Math.max(s,c),o=Math.max(o,l);const a=[],r=Math.max(.3,Math.min(s-e,o-i)/30);for(let c=i;c<=o;c+=r)for(let l=e;l<=s;l+=r)a.push([l,c]);return a}function fy(n,t,e,i,s,o,a,r,c){const l=e.pitch??i*2.3,h=(e.size??1/0)/2,u=(e.min??Math.max(2.2*l,1.4))/2,f=n.kind==="stroke"?Math.max(...n.widths):Math.min(n.w??10,n.h??10);t=un(t.concat([t[0]]),Math.max(.2,f/35));const _=x=>qh(x,t)?jh(x,t)-s/2-o-i/2:-1,g=[];if(n.kind==="stroke"&&e.chain!==!1){const[x,b]=e._insets||[0,0],w=un(n.spine.slice(n.body.a,Math.max(n.body.a+2,n.body.b)),.25),{M:L}=js(w,w.map(()=>0),w.map(()=>0)),S=Os(n,x).slice(n.body.a,n.body.b),T=Os(n,b).slice(n.body.a,n.body.b),C=go(n.spine.slice(n.body.a,n.body.b),T.map((I,N)=>(I-S[N])/2),w),R=w.map((I,N)=>[I[0]+L[N][0]*C[N],I[1]+L[N][1]*C[N]]),O=R.map(I=>Math.min(_(I),h)),A=[0];for(let I=1;I<R.length;I++)A.push(A[I-1]+Math.hypot(R[I][0]-R[I-1][0],R[I][1]-R[I-1][1]));let D=O.findIndex(I=>I>=u),k=O.length-1-[...O].reverse().findIndex(I=>I>=u);if(D>=0&&k>D){const I=[];for(let z=D;z<=k;z++){const q=O[z];if(q<u)continue;const Z=I[I.length-1];Z&&A[z]-Z.s<Z.r+q+i+o||Z&&Math.hypot(R[z][0]-Z.c[0],R[z][1]-Z.c[1])<Z.r+q+i+o||!Z&&A[z]-A[D]<q-.5*i||I.push({s:A[z],c:R[z],r:q})}const N=I.length;if(N){const z=I[0].s,q=I[N-1].s,Z=Math.max(0,A[k]-(q+I[N-1].r)),Q=q+Z*.5*(N>1?1:0),U=G=>{let $=0;for(;$<A.length-1&&A[$]<G;)$++;return $},Y=I.map((G,$)=>N>1?U(z+(Q-z)*$/(N-1)):U(G.s));for(let G=0;G<N;G++){const $=R[Y[G]];let J=Math.min(O[Y[G]],h);for(const it of g)J=Math.min(J,Math.hypot(it.c[0]-$[0],it.c[1]-$[1])-it.r-i-o);G+1<N&&(J=Math.min(J,(Math.hypot(R[Y[G+1]][0]-$[0],R[Y[G+1]][1]-$[1])-i-o)/2)),J>=u*.85&&g.push({c:$,r:J,k:G})}if(e.joints){const G=g.filter($=>$.k!==void 0);for(let $=0;$+1<G.length;$++){const J=Math.round((Y[G[$].k]+Y[G[$+1].k])/2),it=Math.max(...n.widths);c.push({pts:[[R[J][0]+L[J][0]*it,R[J][1]+L[J][1]*it],[R[J][0]-L[J][0]*it,R[J][1]-L[J][1]*it]],w:e.jointLine??i,clip:t})}}}}}const d=uy(n,t).filter(x=>qh(x,t)),m=d.map(x=>{let b=Math.min(jh(x,t)-s/2-o-i/2,h);for(const w of g)b=Math.min(b,Math.hypot(w.c[0]-x[0],w.c[1]-x[1])-w.r-i-o);return b});for(;;){let x=-1,b=u;for(let S=0;S<d.length;S++)m[S]>=b&&(b=m[S],x=S);if(x<0)break;const w=d[x],L=Math.min(b,h);g.push({c:w,r:L});for(let S=0;S<d.length;S++){const T=Math.hypot(d[S][0]-w[0],d[S][1]-w[1])-L-i-o;T<m[S]&&(m[S]=T)}}let y=e.hand==="left"?1:-1;const M=Ki(e.square??0,0,1),v=2+M*3;for(const x of g){const{d:b,p:w}=cy(x.c,t),L=Math.atan2(w[1]-x.c[1],w[0]-x.c[0]),S=Math.max(i*.55,l*.35),C=Math.max(.75,(x.r-S)/l)*2*Math.PI,R=[],O=e.tail??"merge",A=O==="merge"&&s>0?b-s*.15:x.r,D=Math.PI*(e.lead??.4);O==="radial"&&s>0&&R.push([x.c[0]+Math.cos(L)*(b-s*.2),x.c[1]+Math.sin(L)*(b-s*.2)]);for(let k=0;k<=C+1e-6;){let I=x.r-(x.r-S)*k/C;if(k<D){const Q=k/D;I+=(A-x.r)*(1-Q)*(1-Q)}const N=L+y*k,z=Math.cos(N),q=Math.sin(N),Z=M>0?1/Math.pow(Math.pow(Math.abs(z),v)+Math.pow(Math.abs(q),v),1/v):1;R.push([x.c[0]+z*I*Z,x.c[1]+q*I*Z]),k+=Math.min(.3,Math.max(.22,l*.25)/Math.max(.3,I))}c.push({pts:Kr(R,a,r*.5),w:i}),e.hand!=="left"&&e.hand!=="right"&&(y=-y)}return g}function qf(n,[t,e],i,s,o,a,r,c,l){const h=i.pitch??s*2.4;if(n.kind!=="stroke")return Xf(n,[t,e],{...i,closed:!0},s,a,o,r,c,l);const f=(Math.min(...n.widths)-t-e)/2-a/2-o-s/2;if(f<0)return;const p=Math.max(0,Math.floor(f/h+1e-6)),_=(e-t)/2,g=[];for(let M=-p;M<=p;M++)g.push(_+M*h*(i.count==="odd"||p%1===0,1));const d=n.spine,{M:m}=js(d,d.map(()=>0),d.map(()=>0)),y=(t+e)/2+a+o;for(const M of g){let v=d.map((L,S)=>[L[0]+m[S][0]*M,L[1]+m[S][1]*M]);v=Ze(v,v.map((L,S)=>n.dense[S]?0:Math.max(.2,n.widths[S]*.45-Math.abs(M))),{step:.2});const x=Rn(v),b=n.start==="spiral"?0:y,w=n.end==="spiral"?0:y;x-b-w<h||r.push({pts:Kr(dy(v,b,x-w),c,l*.6),w:s})}}function dy(n,t,e){const i=[];let s=0;for(let o=1;o<n.length;o++){const a=n[o-1],r=n[o],c=Math.hypot(r[0]-a[0],r[1]-a[1]),l=s,h=s+c;if(h>=t&&l<=e&&c>0){const u=Math.max(0,(t-l)/c),f=Math.min(1,(e-l)/c);i.length||i.push([a[0]+(r[0]-a[0])*u,a[1]+(r[1]-a[1])*u]),i.push([a[0]+(r[0]-a[0])*f,a[1]+(r[1]-a[1])*f])}s=h}return i}function Xf(n,[t,e],i,s,o,a,r,c,l){if(n.kind==="stroke")return qf(n,[t,e],{...i,kind:"lines"},s,a,o,r,c,l);if(n.kind!=="plate")return;const h=i.pitch??s*2.4,u=(t+e)/2+(o?o/2+a+s/2:0);let f=n.w/2-u,p=n.h/2-u;const _=Math.max(0,n.r-u),g=i.hand==="right"?-1:1,d=[],m=[];let y=0;const M=(T,C,R)=>{d.push([T,C*g]),m.push(R)},v=i.offset??[0,0];for(;f>h*.55&&p>h*.55&&y<60;){const T=Math.max(h*.3,Math.min(_-y*h,f,p));y===0&&M(-f,-p+(i.closed?0:h),T),M(f,-p,T),M(f,p,T),M(-f,p,T);const C=f-h,R=p-h;if(M(-f,-R+(i.closed,0),Math.max(h*.3,Math.min(_-(y+.5)*h,C,R))),f=C,p=R,y++,i.rings&&y>=i.rings)break}if(d.length<3)return;const x=d[d.length-1];d.push([x[0]+Math.max(0,f)*2*.6,x[1]]),m.push(0),m[0]=0;const b=Ze(d,m,{step:.2}),w=Math.cos(n.rot*ni),L=Math.sin(n.rot*ni),S=b.map(([T,C])=>[n.c[0]+v[0]+T*w-C*L,n.c[1]+v[1]+T*L+C*w]);r.push({pts:Kr(S,c,l*.6),w:s})}function py(n,t,[e,i],s,o,a){if(n.kind!=="stroke"){const d=un(n.outline.concat([n.outline[0]]),s.pitch??2.2),m=(In(e)+In(i))/2;for(const y of d){let M=1/0,v=null;for(const L of t){const S=Math.hypot(L[0]-y[0],L[1]-y[1]);S<M&&(M=S,v=L)}const x=s.length??m,b=(v[0]-y[0])/(M||1),w=(v[1]-y[1])/(M||1);a.push({pts:[[y[0]-b*.4,y[1]-w*.4],[y[0]+b*x,y[1]+w*x]],w:s.line??o*.9,clip:n.outline})}return}const r=n.spine.slice(n.body.a,n.body.b);if(r.length<2)return;const c=s.side==="both"?[1,-1]:s.side==="right"?[-1]:s.side==="outer"?[my(r)]:[1],l=s.pitch??2.2,h=un(r,l),{M:u}=js(h,h.map(()=>0),h.map(()=>0)),f=go(r,n.widths.slice(n.body.a,n.body.b),h),p=go(r,Os(n,e).slice(n.body.a,n.body.b),h),_=go(r,Os(n,i).slice(n.body.a,n.body.b),h),g=s.skipEnds??1;for(let d=g;d<h.length-g;d++)for(const m of c){const y=f[d]/2,M=m>0?p[d]:_[d],v=s.length??M,x=y+.4,b=y-v;a.push({pts:[[h[d][0]+u[d][0]*m*x,h[d][1]+u[d][1]*m*x],[h[d][0]+u[d][0]*m*b,h[d][1]+u[d][1]*m*b]],w:s.line??o*.9,clip:n.outline})}}function my(n){let t=0;for(let e=1;e<n.length-1;e++){const i=n[e-1],s=n[e],o=n[e+1];t+=(s[0]-i[0])*(o[1]-s[1])-(s[1]-i[1])*(o[0]-s[0])}return t>0?-1:1}function go(n,t,e){return e.map(i=>{let s=1/0,o=t[0];for(let a=0;a<n.length;a++){const r=Math.hypot(n[a][0]-i[0],n[a][1]-i[1]);r<s&&(s=r,o=t[a])}return o})}function gy(n,t,e,i,s){const o=e.pitch??2.6;if(n.kind!=="stroke")return;const a=n.spine.slice(n.body.a,n.body.b),r=un(a,o*.62),{M:c,d:l}=js(r,r.map(()=>0),r.map(()=>0)),h=go(a,n.widths.slice(n.body.a,n.body.b),r);for(let u=0;u<r.length;u++){const f=h[u]/2,p=Math.ceil(f/o)+1,_=l[Math.min(u,l.length-1)],g=Math.atan2(_[1],_[0]);for(let d=-p;d<=p;d++){const m=(d+u%2*.5)*o;if(Math.abs(m)>f+o)continue;const y=[r[u][0]+c[u][0]*m,r[u][1]+c[u][1]*m],M=[];for(let v=0;v<=12;v++){const x=g-Math.PI/2+Math.PI*v/12;M.push([y[0]+Math.cos(x)*(o/2-i*.3),y[1]+Math.sin(x)*(o/2-i*.3)])}s.push({pts:M,w:i,clip:t})}}}function Ir(n,t={}){const{c:e=[0,0],w:i=12,h:s=10,rot:o=0}=t,r=2+(1-Ki(t.round??.45,0,1))*6,c=t.height??2,l=1.6+(1-(t.crown??.5))*5,h=t.base==="field"?n.heightAt(e[0],e[1]):t.base??0,{cols:u,rows:f,ppmm:p,field:_}=n,g=Math.hypot(i,s)/2+1,d=Math.max(0,Math.floor((e[0]-g)*p)),m=Math.min(u-1,Math.ceil((e[0]+g)*p)),y=Math.max(0,Math.floor((e[1]-g)*p)),M=Math.min(f-1,Math.ceil((e[1]+g)*p)),v=Math.cos(-o*ni),x=Math.sin(-o*ni),b=i/2,w=s/2,L=t.tilt??0,S=[-.25,.25];for(let T=y;T<=M;T++)for(let C=d;C<=m;C++){let R=0,O=0;for(const k of S)for(const I of S){const N=(C+.5+I)/p-e[0],z=(T+.5+k)/p-e[1],q=N*v-z*x,Z=N*x+z*v,Q=Math.pow(Math.pow(Math.abs(q/b),r)+Math.pow(Math.abs(Z/w),r),1/r);Q>=1||(O++,R+=Math.sqrt(1-Math.pow(Q,l))*(1+L*Z/(w*Math.max(c,.001))*.5))}if(!O)continue;const A=h+c*R/4,D=T*u+C;A>_[D]&&(_[D]=A)}if(t.ring){const T=t.ring.gap??.8,C=t.ring.line??.45,R=Yf(e,b+T+C/2,w+T+C/2,r,o);n.sink(O=>{O.lineWidth=C,O.beginPath(),mo(O,R,!0),O.stroke()},{depth:t.ring.depth??.35,shoulder:C*.45,profile:"u"})}if(t.slit!==!1){const T=t.slit||{},C=T.len??i*.32,R=T.width??Math.max(.5,s*.09),O=(T.rot??o)*ni,A=T.offset??[0,0];n.sink(D=>{D.save(),D.translate(e[0]+A[0],e[1]+A[1]),D.rotate(O),D.beginPath();const k=Math.min(R*.35,C/2);D.moveTo(-C/2+k,-R/2),D.arcTo(C/2,-R/2,C/2,R/2,k),D.arcTo(C/2,R/2,-C/2,R/2,k),D.arcTo(-C/2,R/2,-C/2,-R/2,k),D.arcTo(-C/2,-R/2,C/2,-R/2,k),D.closePath(),D.fill(),D.restore()},{depth:T.depth??c*.35,shoulder:Math.min(.3,R*.4),profile:"u"})}return{a:b,b:w,ex:r}}function Yf(n,t,e,i,s=0,o=96){const a=Math.cos(s*ni),r=Math.sin(s*ni),c=[];for(let l=0;l<o;l++){const h=l/o*Math.PI*2,u=Math.cos(h),f=Math.sin(h),p=t*Math.sign(u)*Math.pow(Math.abs(u),2/i),_=e*Math.sign(f)*Math.pow(Math.abs(f),2/i);c.push([n[0]+p*a-_*r,n[1]+p*r+_*a])}return c}function _y(n={}){const t=Ki(n.round??.45,0,1);return Yf(n.c??[0,0],(n.w??12)/2,(n.h??10)/2,2+(1-t)*6,n.rot??0)}const $f={lattice:"diagonal",size:9,levels:2,fill:"nested",pitch:.9,line:.48,depth:.4,outline:!0,clip:!0,minFree:.35,roundness:.1,jitter:.04,offset:[0,0],mode:"sunk",seed:0};function Kf(n={}){return{...$f,...n}}function Zc(n,t={},e={}){const i=Yh(),s=Kf(e),o=t.rect??{x:0,y:0,w:n.width,h:n.height},a=new Be(`lozenge:${s.seed}:${o.x.toFixed(2)},${o.y.toFixed(2)},${o.w.toFixed(2)}`),r=s.pitch*s.line,c=yy(n,o,t,Math.max(0,t.margin??.6)+r/2);if(!c)return{cells:0,clipped:0,ms:0};const[l,h]=Array.isArray(s.size)?s.size:[s.size,s.size],u=s.lattice!=="square",f=u?[l/2,h/2]:[l,0],p=u?[-l/2,h/2]:[0,h],_=[o.x+o.w/2+s.offset[0],o.y+o.h/2+s.offset[1]];u||(_[0]-=l/2),_[1]-=h/2;const g=f[0]*p[1]-f[1]*p[0],d=(O,A)=>{const D=O-_[0],k=A-_[1];return[(D*p[1]-k*p[0])/g,(f[0]*k-f[1]*D)/g]};let m=1/0,y=-1/0,M=1/0,v=-1/0;for(const[O,A]of[[o.x,o.y],[o.x+o.w,o.y],[o.x,o.y+o.h],[o.x+o.w,o.y+o.h]]){const[D,k]=d(O,A);m=Math.min(m,Math.floor(D)),y=Math.max(y,Math.ceil(D)),M=Math.min(M,Math.floor(k)),v=Math.max(v,Math.ceil(k))}const x=[],b={cells:0,clipped:0},w=[0,.25,.5,.75,1],L=(O,A,D,k)=>{const I=(q,Z)=>[_[0]+(O+q*D)*f[0]+(A+Z*D)*p[0],_[1]+(O+q*D)*f[1]+(A+Z*D)*p[1]];let N=0,z=0;for(const q of w)for(const Z of w){if(q>0&&q<1&&Z>0&&Z<1&&!(q===.5&&Z===.5))continue;z++;const[Q,U]=I(q,Z);c.free(Q,U)&&N++}if(N===z){R(I,D,!1);return}if(!(N===0&&k>0)){if(k<s.levels){const q=D/2;L(O,A,q,k+1),L(O+q,A,q,k+1),L(O,A+q,q,k+1),L(O+q,A+q,q,k+1);return}s.clip&&N/z>=s.minFree&&R(I,D,!0)}},S=Math.abs(g),T=S/Math.hypot(p[0],p[1]),C=S/Math.hypot(f[0],f[1]),R=(O,A,D)=>{b.cells++,D&&b.clipped++;const k=s.pitch/(T*A),I=s.pitch/(C*A),N=s.jitter*s.pitch,z=U=>[U[0]+a.jitter(N),U[1]+a.jitter(N)],q=s.roundness*s.pitch,Z=U=>[O(U*k,U*I),O(1-U*k,U*I),O(1-U*k,1-U*I),O(U*k,1-U*I)];s.outline&&x.push({pts:Z(0),closed:!0,r:0});const Q=Math.floor(Math.min(.5/k,.5/I)-.35);if(s.fill==="nested"){for(let U=1;U<=Q;U++)x.push({pts:Z(U).map(z),closed:!0,r:q});Q>=0&&Math.min(.5/k,.5/I)-Q>.85&&x.push({dot:O(.5,.5),r:r*.6})}else if(s.fill==="squared"){const U=[];let Y=1;for(U.push(O(Y*k,Y*I));Y<=Q;){const G=Y,$=Y;U.push(O(1-$*k,G*I),O(1-$*k,1-$*I),O(G*k,1-$*I),O(G*k,(Y+1)*I)),Y++}U.length>2&&x.push({pts:U.map(z),closed:!1,r:q})}else if(s.fill==="spiral"){const U=O(.5,.5),Y=Math.min(T,C)*A*.5-s.pitch*.9;if(Y>s.pitch){const G=[],$=(Y-r)/s.pitch,J=a.next()<.5?1:-1,it=a.range(0,6.283);for(let ot=0;ot<=$*2*Math.PI;ot+=.2){const ct=Y-s.pitch*ot/(2*Math.PI);G.push([U[0]+Math.cos(it+J*ot)*ct,U[1]+Math.sin(it+J*ot)*ct])}x.push({pts:G,closed:!1,r:0})}else x.push({dot:U,r:r*.8})}else s.fill==="dot"&&x.push({dot:O(.5,.5),r:Math.max(r,Math.min(T,C)*A*.12)})};for(let O=M;O<=v;O++)for(let A=m;A<=y;A++)L(A,O,1,0);return x.length&&My(n,o,c,x,s,r),{...b,ms:Math.round(Yh()-i)}}function My(n,t,e,i,s,o){const a=e.gateCanvas(),r=c=>{c.save(),c.beginPath(),c.rect(t.x,t.y,t.w,t.h),c.clip(),c.lineWidth=o,c.lineCap="round",c.lineJoin="round",c.beginPath();for(const l of i){if(l.dot)continue;let h=l.pts;l.r>0&&(h=Ze((l.closed,h),l.r,{closed:l.closed,step:Math.max(.1,o*.4)})),c.moveTo(h[0][0],h[0][1]);for(let u=1;u<h.length;u++)c.lineTo(h[u][0],h[u][1]);l.closed&&c.closePath()}c.stroke(),c.beginPath();for(const l of i)l.dot&&(c.moveTo(l.dot[0]+l.r,l.dot[1]),c.arc(l.dot[0],l.dot[1],l.r,0,Math.PI*2));c.fill(),c.globalCompositeOperation="destination-in",c.imageSmoothingEnabled=!0,c.drawImage(a.canvas,a.x,a.y,a.w,a.h),c.restore()};s.mode==="thread"?n.add(r,{height:s.depth,profile:"ridge"}):n.sink(r,{depth:s.depth,shoulder:o*.4,profile:"u"})}function yy(n,t,e,i){const{cols:s,rows:o,ppmm:a,field:r}=n;let c=Math.max(1/a,.2);t.w/c*(t.h/c)>32e5&&(c=Math.sqrt(t.w*t.h/32e5));const l=Math.ceil(t.w/c)+2,h=Math.ceil(t.h/c)+2,u=t.x-c,f=t.y-c,p=new Uint8Array(l*h);for(let A=0;A<h;A++)for(let D=0;D<l;D++)(!D||!A||D===l-1||A===h-1)&&(p[A*l+D]=1);const _=A=>typeof A=="function"?n.mask(A).data:A&&A.data?A.data:null,g=e.avoid===void 0?e.level!=null?null:"raised":e.avoid,d=g==="raised"?null:_(g),m=_(e.include),y=e.level,M=y==null?0:.04+.03*Math.abs(y),v=Math.max(0,Math.floor(t.x*a)),x=Math.min(s,Math.ceil((t.x+t.w)*a)),b=Math.max(0,Math.floor(t.y*a)),w=Math.min(o,Math.ceil((t.y+t.h)*a));for(let A=b;A<w;A++){const D=Math.min(h-2,Math.max(1,Math.floor(((A+.5)/a-f)/c)));for(let k=v;k<x;k++){const I=A*s+k;let N=!1;g==="raised"?N=r[I]>.05:d&&(N=d[I]>.5),!N&&m&&(N=m[I]<.5),!N&&y!=null&&(N=Math.abs(r[I]-y)>M),N&&(p[D*l+Math.min(l-2,Math.max(1,Math.floor(((k+.5)/a-u)/c)))]=1)}}const L=si(p,l,h),S=i/c,T=S*S,C=(A,D)=>{const k=Math.floor((A-u)/c),I=Math.floor((D-f)/c);return k<0||I<0||k>=l||I>=h?!1:L.dist2[I*l+k]>T};let R=null;return{free:C,gateCanvas:()=>{if(R)return R;const A=br(l,h),D=ic(A),k=D.createImageData(l,h);for(let I=0;I<h;I++)for(let N=0;N<l;N++){const z=Math.sqrt(L.dist2[I*l+N])-S,q=Math.max(0,Math.min(1,z+.5)),Z=(I*l+N)*4;k.data[Z]=k.data[Z+1]=k.data[Z+2]=255,k.data[Z+3]=Math.round(q*255)}return D.putImageData(k,0,0),R={canvas:A,x:u,y:f,w:l*c,h:h*c},R},h:c,gw:l,gh:h}}const Yh=()=>typeof performance<"u"?performance.now():Date.now();let vy=class{constructor(){this.islands=[],this.bosses=[],this.tips=[],this.grooves=[],this.cuts=[],this.centres=[]}island(t){let e=this.islands.find(i=>i.id===t);return e||this.islands.push(e={id:t,shapes:[]}),e}add(t,e){return this.island(t).shapes.push(e),e}};const Jc=(n,t,e)=>Math.max(t,Math.min(e,n)),xe=(n,t,e)=>n+(t-n)*e;function Zf(n,t,e){const i=e.edge&&e.edge!=="none"?.2:0,s=Gf(t,{faceW:.66,spread:e.spread??1,reserve:i,invert:!!e.invert,taper:e.taper||0}),o=`taotie:${e.seed??0}:${t.x.toFixed(1)},${t.y.toFixed(1)}`,a=n.rng.fork(o),r=e.irregularity??1,c=e.lineWeight,l=Math.max(3.2*c,2.2),h={f:s,p:e,rng:a,panel:n,rect:t,sheet:new vy,s:s.s,H:s.H,lw:c,irr:r,edgeW:i*s.s,marks:{},dissolved:e.body==="dissolved",sq:Jc(e.square??.5,0,1),u:u=>u*s.s,bw:Math.max(Math.sqrt(s.s*Math.min(s.H,1.6*s.s))*.082*(e.bandWidth??1)*(e.body==="kui"?1.4:1),l),A(u,f,p=.008){return[s.X(u+a.jitter(p*r)),s.Y(f+a.jitter(p*r*.8))]},rc(u,f=2.6){return xe(u*f,u*.12,h.sq)},rcurl(u){return h.sq>.85?u*.2:xe(u*9,u*.2,h.sq*h.sq)},wob(u,f=.08){return zf(u,a,f*r,Math.max(6,s.s*.12))},wj(u){return u*(1+a.jitter(.03*r))},band(u,f,p,_="square",g="square",{centre:d=!0}={}){const m=h.wob(f),y=typeof p=="number"?h.wj(p):p;return h.sheet.add(u,$c(m,y,_,g)),d&&h.sheet.centres.push({pts:m,w:typeof y=="number"?y:y(.3)}),m},xmax(){return s.hw}};return h.ext=Math.max(h.u(.06),(e.echoInset??1.4)+2*c+1),h}function xy(n,t,e,i=0){const s=[];for(let l=0;l<72;l++){const h=l/72*Math.PI*2,u=Math.cos(h),f=Math.sin(h),p=f>=0?1:.85,_=f*p*Math.pow(Math.max(0,1-u*u),.15)*(.92+.08*Math.abs(f));s.push([u*t*.5,_*e*.5])}const a=i*Math.PI/180,r=Math.cos(a),c=Math.sin(a);return s.map(([l,h])=>[n[0]+l*r-h*c,n[1]+l*c+h*r])}function qs(n){const t=n.p,e=t.jaw==="split";return{lip:e?Math.max(.21,t.lipY??0):t.lipY??.15,nostril:(e?Math.max(.21,t.lipY??0):t.lipY??.15)+.13,eye:t.eyeY??.5,hornRoot:.735,top:.955}}const hn=(n,t,e)=>n&&n[t]!==void 0?n[t]:e.p[t];function by(n,t={}){const e=hn(t,"nose",n);if(e==="none")return;const i=qs(n),s=e==="flange",o=s?Math.max((t.width??.42)*n.bw,3.2):(t.width??.8)*n.bw,a=n.f.Y(t.from??(s?i.lip:i.nostril-.035)),r=n.marks.crestBottom??n.f.Y(t.to??(s?.92:.8));if(n.marks.noseHalf=o,e==="stack"){const l=n.u(.12),h=Math.max(2,Math.round((r-a)/l)),u=(r-a)/h;for(let f=0;f<h;f++){const p=a+f*u+u*.12,_=a+(f+1)*u-u*.12,g=new re([-n.ext,_-n.bw*.4],0).to([o*1.1,_-n.bw*.4]).turn(-90,n.rc(n.bw*.6)).fwd(Math.max(1,_-p-n.bw*.8));n.band("nose"+(n.dissolved?f:""),g.spine(),n.bw*.6,"flat","square",{centre:!1})}return}const c=Ze([[-n.ext,a],[o*1.12,a],[o,a+(r-a)*.25],[o*.96,r],[-n.ext,r]],[0,n.rc(o*.6),n.rc(o),0,0],{closed:!0});if(n.sheet.add("nose",Nn(n.wob(c,.05))),e==="ridge"&&n.p.carving==="dense"){const l=Math.max(n.lw*4.5,n.u(.045)),h=o-(n.p.echoInset??1.4)-n.lw*1.2;if(h>n.lw*2)for(let u=a+l;u<r-l*.6;u+=l)n.sheet.grooves.push({pts:[[-n.lw,u],[h,u]]})}}function wy(n,t={}){let e=hn(t,"crest",n);if(e===!0&&(e="lozenge"),!e||e==="none")return;const i=n.f.Y(t.y??.83),s=n.u(.075)*(t.size??1),o=n.u(.085)*(t.size??1);if(e==="lozenge"){const a=Ze([[0,i-o],[s,i],[0,i+o],[-s,i]],n.rc(n.bw*.5,1),{closed:!0});n.sheet.add("crest",Nn(n.wob(a,.04)));const r=.42;n.p.carving!=="none"&&n.sheet.grooves.push({pts:[[-n.lw,i-o*r],[s*r,i],[-n.lw,i+o*r]]}),n.marks.crestBottom=i-o*.55}else if(e==="shield"){const a=Ze([[-n.ext,i+o],[s*1.15,i+o],[s*.55,i-o],[-n.ext,i-o]],[0,n.rc(n.bw*.5),n.rc(n.bw*.6),0],{closed:!0});n.sheet.add("crest",Nn(n.wob(a,.04))),n.p.carving!=="none"&&n.sheet.grooves.push({pts:[[0,i-o*.4],[0,i+o*.5]]}),n.marks.crestBottom=i-o*.8}else if(e==="cicada"){const a=Ze([[-n.ext,i+o],[s*1.1,i+o],[s*.35,i-o*1.3],[-n.ext,i-o*1.3]],[0,n.rc(n.bw*.4),n.rc(n.bw*.3),0],{closed:!0});n.sheet.add("crest",Nn(a)),n.sheet.bosses.push({shape:On([s*.6,i+o*.45],s*.26),base:"plateau"});for(let r=1;r<=3;r++){const c=i+o*.2-r*o*.42;n.sheet.grooves.push({pts:[[-n.lw,c-o*.18],[s*(.75-r*.12),c]]})}n.marks.crestBottom=i-o}else if(e==="hooks"){const a=n.f.Y(.74),r=n.f.Y(.985);n.sheet.add("crest",Nn([[-n.ext,a],[n.bw*.45,a],[n.bw*.45,r],[-n.ext,r]]));const c=Math.max(2,Math.round((r-a)/n.u(.08)));for(let l=0;l<c;l++){const h=a+(l+.6)/c*(r-a);n.band("crest",Ie([n.bw*.3,h],0,n.bw*.6,{curl:120,radius:n.bw*.45,dir:-1}),n.bw*.55,"flat","round",{centre:!1})}n.marks.crestBottom=a}}function Sy(n,t={}){const e=hn(t,"nostril",n);if(e==="none")return;const i=qs(n),s=n.f.Y(t.y??i.nostril),o=n.bw*(t.width??1),a=n.dissolved?(n.marks.noseHalf??n.bw)+n.u(.035):0;if(e==="bulb"){n.sheet.add("nostril",Dr([n.u(.04),s+n.u(.01)],n.u(.085),n.u(.05))),n.band("nostril",Ie([n.u(.11),s],-90,n.u(.02),{curl:140,radius:n.u(.03),dir:-1}),o*.8,"square","round",{centre:!1});return}const r=n.f.X(t.reach??.16),c=Jc(n.u(.085),o*1.4,n.f.Y(.42)-s),l=new re([a,s],0).to([r,s]).curl({dir:1,size:[Math.max(o*2,Math.min(c,n.u(.075))),Math.max(o*2,Math.min(n.u(.08),r-a-o*.9))],pitch:o*1.4,turns:t.turns??.6,r:n.rcurl(o)});n.band("nostril",l.spine(),o,"flat","square")}function Ey(n,t={}){const e=hn(t,"jaw",n);if(e==="none")return;const i=qs(n),s=n.f.Y(t.y??i.lip),o=n.bw*(t.width??1.05),a=Math.min(n.f.X(t.corner??n.p.mouthCorner??.38),n.f.hw-n.edgeW-o),r=n.dissolved?(n.marks.noseHalf??n.bw)+n.u(.03):0,c=Jc(Math.max(n.u(.1),(s-o*.6)*.85),o*1.2,s-o*.55),l=new re([r,s],0).to([a,s]).curl({dir:-1,size:[c,Math.max(o*1.5,Math.min(n.u(.17),(a-r)*.6))],pitch:o*1.5,turns:t.turns??n.p.jawTurns??.85,r:n.rcurl(o)});if(n.band("lip",l.spine(),o,"flat","square"),n.marks.mouthCorner=[a,s],e==="double"){const h=[a-n.u(.05),s+o*.4];n.band("lip2",Ie(h,90,n.u(.035),{curl:200,radius:n.u(.032),dir:-1}),o*.8,"flat","round",{centre:!1})}e==="split"&&Qf(n,t),e==="fanged"&&Jf(n,t)}function Jf(n,t={}){const e=qs(n),i=n.f.Y(t.y??e.lip)-n.bw*.45,s=t.count??2,o=n.bw*1,a=Ie([n.f.X(.14),i],-90,Math.max(1,n.u(.06)),{curl:45,radius:n.u(.04),dir:-1});if(n.band("lip",a,fn(o,o*.18),"flat","point",{centre:!1}),s>1){const r=Ie([n.f.X(.3),i],-98,Math.max(1,n.u(.08)),{curl:35,radius:n.u(.06),dir:1});n.band("lip",r,fn(o*1.15,o*.18),"flat","point",{centre:!1})}}function Qf(n,t={}){const e=n.bw*.9,i=Math.max(e*.6,n.f.Y(t.lowerY??.055)),s=n.dissolved?n.u(.06):-n.ext,o=new re([s,i],0).to([n.f.X(.3),i]).curl({dir:1,size:[n.u(.07),n.u(.08)],pitch:e*1.5,turns:.6,r:n.rcurl(e)});n.band("jaw",o.spine(),e,"flat","square"),n.band("jaw",Ie([n.f.X(.15),i+e*.4],90,n.u(.035),{curl:30,radius:n.u(.05),dir:-1}),fn(e,e*.2),"flat","point",{centre:!1})}function td(n,t={}){const e=hn(t,"eye",n),i=qs(n),s=t.size??n.p.eyeSize,[o,a]=t.at??[n.p.eyeX??.27,i.eye],r=n.A(o,a,.004),c=hn(t,"pupil",n),l=n.bw*.95;let h;if(e==="chen"){const u=n.u(.32)*s,f=n.u(.17)*s,p=t.tilt??8,_=xy(r,u,f,p);n.sheet.add("eye",Nn(_));const g=p*Math.PI/180,d=[r[0]-Math.cos(g)*u*.47,r[1]-Math.sin(g)*u*.47],m=[r[0]+Math.cos(g)*u*.47,r[1]+Math.sin(g)*u*.47],y=Math.max(n.f.X(.085),(n.marks.noseHalf??0)+l*.8+(n.dissolved?n.u(.035):0)),M=Math.max(l*1.2,Math.min(n.u(.11),d[1]-n.f.Y(.37))),v=new re(d,180).to([y,d[1]-Math.tan(g)*(d[0]-y)*.3]).turn(105,n.rc(l)).fwd(M).turn(40,n.rc(l*.6)).fwd(l*.5);n.band("eye",v.spine(),l,"flat","square");const x=new re(m,p*.6).fwd(n.u(.08)*s).turn(-95,n.rc(l*.8)).fwd(l*.7);n.band("eye",x.spine(),l*.88,"flat","square"),h=n.u(.07)*s,n.sheet.bosses.push({shape:On(r,h),base:"plateau",r:h}),n.marks.eyeTop=r[1]+f*.5,n.marks.eyeOuter=m[0]+n.u(.08)*s}else if(e==="square"){const u=n.u(.2)*s,f=n.u(.155)*s,p=Math.min(u,f)*.32;n.sheet.bosses.push({shape:zi(r,u,f,p,0),base:"ground",r:Math.min(u,f)*.5});const _=t.socket?l*.45:0;return t.socket&&n.sheet.add("eye",zi(r,u+l*.9,f+l*.9,p+l*.45,0)),h=f*.42,n.marks.eyeTop=r[1]+f*.5+_,n.marks.eyeOuter=r[0]+u*.5,c==="slit"?n.sheet.cuts.push(zi(r,u*.42,Math.max(n.lw*1.3,f*.1),n.lw*.6)):c==="dot"&&n.sheet.cuts.push(On(r,Math.max(n.lw,f*.12))),r}else{const u=e==="oval",f=n.u(u?.125:.105)*s,p=n.u(u?.09:.105)*s;n.sheet.add("eye",Dr(r,f,p,u?6:0));const _=f-l*.75,g=p-l*.75;if(n.sheet.bosses.push({shape:Dr(r,Math.max(_,f*.55),Math.max(g,p*.55),u?6:0),base:"plateau",r:Math.max(g,p*.55)}),h=Math.min(Math.max(_,f*.55),Math.max(g,p*.55)),t.canthus??n.p.eye!=="round"){const d=[r[0]-f*.92,r[1]-p*.2],m=new re(d,190).fwd(Math.max(l*.6,d[0]-Math.max(n.f.X(.1),(n.marks.noseHalf??0)+l))).turn(100,n.rc(l)).fwd(Math.max(l,n.u(.06)));n.band("eye",m.spine(),l*.9,"flat","square")}n.marks.eyeTop=r[1]+p,n.marks.eyeOuter=r[0]+f}return c==="slit"?n.sheet.cuts.push(zi(r,h*2.3,Math.max(n.lw*1.25,h*.18),n.lw*.6)):c==="dot"?n.sheet.cuts.push(On(r,Math.max(n.lw*.9,h*.3))):c==="ring"&&n.sheet.grooves.push({pts:So(r,h*.6,0,360),boss:!0}),n.marks.eye=r,r}function Ty(n,t={}){const e=hn(t,"brow",n);if(!e||e==="none")return;const i=n.bw*.78,s=Math.max(n.f.Y(t.y??.685),(n.marks.eyeTop??0)+i*1.15+(n.dissolved?n.u(.02):0)),o=Math.max(n.f.X(.09),(n.marks.noseHalf??0)+(n.dissolved?n.u(.04):i*.2)),a=n.f.X(t.reach??.42);if(e==="L"){const r=n.marks.eye??n.A(.27,.5),c=(n.marks.eyeTop??r[1])+i*.9,l=Math.max((n.marks.noseHalf??0)+i*.9,n.f.X(.07)),h=new re([xe(l,r[0],.75),c],180).to([l,c]).turn(90,n.rc(i)).fwd(Math.max(i,c-r[1]+n.u(.02)));n.band("brow",h.spine(),i,"square","square"),n.marks.browTop=c+i*.5;return}else{const r=new re([o,s],8).to([xe(o,a,.55),s+n.u(.02)],0).to([a,s+n.u(.012)],n.rc(i));e==="hooked"?r.curl({dir:1,size:[n.u(.05),n.u(.05)],pitch:i*1.5,turns:.6,r:n.rcurl(i)}):r.turn(-90,n.rc(i)).fwd(n.u(.04)),n.band("brow",r.spine(),i,"square","square"),e==="kui"&&(n.sheet.bosses.push({shape:On([o+i*1.4,s],i*.42),base:"plateau",r:i*.42}),n.band("brow",Ie([o,s-i*.2],200,i*.4,{curl:90,radius:i*.5,dir:1}),i*.6,"flat","round",{centre:!1}))}n.marks.browTop=s+i*.6}function Ay(n,t={}){const e=hn(t,"horn",n);if(!e||e==="none")return;const i=bc[e]||bc.c,s=t.size??n.p.hornSize??1,o=Math.max(n.f.Y(qs(n).hornRoot),(n.marks.browTop??0)+n.bw*.25+(n.dissolved?n.u(.03):0),(n.marks.eyeTop??0)+n.bw*.9),a=t.rootX??(e==="bottle"||e==="knob"||e==="t"?.17:.11),r=t.root?n.A(t.root[0],t.root[1],.004):[Math.max(n.f.X(a),n.dissolved?(n.marks.noseHalf??0)+n.u(.05):0),o],c=Math.min(n.f.Y(.985),n.H-n.bw*.15),l=n.bw*(t.width??1.3);n.marks.hornRoot=r[1];const h=i(n,{root:r,top:c,w:l,hs:s,o:t});h&&n.p.hornTip>0&&n.sheet.tips.push({shape:$c($r(h,Rn(h)*.7,Rn(h)),l*.62,"round","round"),lift:n.p.hornTip})}const bc={c(n,{root:t,top:e,w:i,hs:s}){const o=e-i/2,a=Math.min(Math.max(n.u(.1),i*2.3),(n.xmax(o)-t[0])*.38),r=Math.max(t[0]+i*2,Math.min(n.f.X(.46*s),n.xmax(o)-a-i*.6)),c=new re(t,72).to([n.f.X(.17),o]).to([r,o],n.rc(i,3)).turn(-90,n.rc(i));return c.fwd(Math.max(i*.4,o-n.f.Y(.84)-i)).curl({dir:1,size:[a,a*.95],pitch:i*1.3,turns:1.1,r:n.rcurl(i)}),n.band("horn",c.spine(),Rs(i,.25,.75),"flat","square")},ram(n,{root:t,top:e,w:i,hs:s,o}){const a=e-i/2,r=Math.min(n.f.X(.5*s),n.xmax(a)-i*.7),c=Math.max(t[1]-i*.2,n.f.Y(.73)),l=new re(t,85).to([t[0]+i*.1,a]).to([r,a],n.rc(i,2)).turn(-90,n.rc(i));return l.fwd(Math.max(i,a-c)).curl({dir:-1,size:[Math.max(i*2.2,(r-t[0])*.58),Math.max(i*1.8,(a-c)*.62)],pitch:i*1.38,turns:o.turns??1.25,r:n.rcurl(i)}),n.band("horn",l.spine(),Rs(i,.3,.8),"flat","square")},buffalo(n,{root:t,top:e,w:i,hs:s}){const o=Mc([[t[0]-i*.4,t[1]],n.A(.3,.775),n.A(.5*s,.84),[Math.min(n.f.X(.64*s),n.xmax(e)-i),e-i*.6],[Math.min(n.f.X(.58*s),n.xmax(e)-i*1.6),e-i*.15]]);return n.band("horn",o,r=>i*(1.6-1.45*Math.pow(r,1.6)),"flat","point")},bottle(n,{root:t,top:e,w:i,hs:s}){const o=t[0],a=t[1]-i*.2,r=e,c=r-a,l=Math.max(n.u(.04),i*.4)*s,h=Math.max(n.u(.1),i)*s,u=n.u(.015),f=[[0,l],[.22,l],[.45,h*.95],[.7,h],[.88,h*.75],[1,h*.35]],p=f.map(([d,m])=>[o+m+u*d,a+d*c]),_=f.map(([d,m])=>[o-m+u*d,a+d*c]).reverse(),g=Ze([...p,..._],n.rc(i*.5,2),{closed:!0});return n.sheet.add("horn",Nn(n.wob(g,.05))),n.p.carving!=="none"&&n.sheet.centres.push({pts:[[o,a+c*.25],[o+u*.8,a+c*.85]],w:h*2,force:!0}),[[o,a],[o+u,r]]},t(n,{root:t,top:e,w:i,hs:s}){const o=t[0],a=n.u(.22)*s,r=Math.max(n.bw*.85,n.u(.06)),c=e-r/2;n.band("horn",[[o,t[1]],[o,c]],n.bw*.75,"flat","flat",{centre:!1});for(const l of[-1,1]){const h=new re([o,c],l>0?0:180).fwd(a/2-r*.4).turn(l>0?-90:90,n.rc(r,1.4)).fwd(r*.9).turn(l>0?-90:90,n.rc(r*.6,1)).fwd(r*.35);n.band("horn",h.spine(),r,"flat","square",{centre:l>0})}return null},kui(n,{root:t,top:e,w:i,hs:s}){const o=e-i*.55,a=t[0]+i*.3,r=Math.min(n.f.X(.72*s),n.xmax(o)-i*1.2),c=i,l=new re([a,o],0).to([r,o]).curl({dir:-1,size:[i*2.2,i*2.4],pitch:c*1.4,turns:.75,r:n.rcurl(c)});return n.band("horn",l.spine(),c,"square","square"),n.sheet.add("horn",zi([a+i*.2,o-i*.15],i*1.6,i*1.3,i*.35)),n.sheet.bosses.push({shape:On([a+i*.35,o],i*.32),base:"plateau",r:i*.32}),n.band("horn",Ie([a-i*.5,o-i*.5],180,i*.4,{curl:140,radius:i*.45,dir:-1}),c*.8,"flat","round",{centre:!1}),n.band("horn",[t,[a+i*.2,o-i*.5]],c,"flat","flat",{centre:!1}),null},coiled(n,{root:t,top:e,w:i,hs:s}){const o=Math.min(n.u(.17)*s,(e-t[1])*.75),a=new re(t,80).fwd(Math.max(i,e-t[1]-o*1.1-i*.5)).turn(-80,n.rc(i)).curl({dir:-1,size:[o*1.7,o*1.4],pitch:i*1.45,turns:1.9,r:n.rcurl(i)});return n.band("horn",a.spine(),Rs(i*.9,.4,.6),"flat","round")},knob(n,{root:t,top:e,w:i,hs:s}){const o=n.u(.048)*s,a=e-o;return n.band("horn",[[t[0],t[1]],[t[0]+n.u(.01),a]],n.u(.05),"flat","flat",{centre:!1}),n.sheet.add("horn",On([t[0]+n.u(.01),a],o)),n.sheet.bosses.push({shape:On([t[0]+n.u(.01),a],o*.7),base:"plateau",r:o*.7}),null},antler(n,{root:t,top:e,w:i,hs:s}){const o=[Math.min(n.f.X(.4*s),n.xmax(e)-i),e-i*.4],a=Mc([t,[xe(t[0],o[0],.35),xe(t[1],o[1],.6)],o]);n.band("horn",a,fn(i,i*.5),"flat","round");const r=Rn(a);for(const c of[.38,.68]){const l=$r(a,0,r*c),h=l[l.length-1];n.band("horn",Ie(h,125,n.u(.06)*s,{curl:50,radius:n.u(.04),dir:-1}),fn(i*.7,i*.25),"flat","point",{centre:!1})}return a},crook(n,{root:t,top:e,w:i,hs:s}){const o=e-i/2,a=n.marks.eye??n.A(.27,.5),r=Math.min((n.marks.eyeOuter??a[0]+n.u(.1))+i*.1,n.f.hw-n.edgeW-i*.8),c=(n.marks.eyeTop??a[1])+i*(n.dissolved?1.2:.4),l=Math.max((n.marks.noseHalf??0)+i*1.2,n.f.X(.07)),h=new re([r,c],90).to([r,o]).turn(90,n.rc(i)).to([l,o]);return h.curl({dir:1,size:[Math.max(i*1.6,(o-c)*.7*s),Math.max(i*1.6,(r-l)*.55)],pitch:i*1.5,turns:1.2,r:n.rcurl(i)}),n.band("horn",h.spine(),i,"square","square")},zigzag(n,{root:t,top:e,w:i,hs:s}){const o=e-i/2,a=n.f.X(.28*s),r=Math.min(n.f.X(.5*s),n.xmax(o)-i),c=new re(t,0).to([a,t[1]]).to([a,o],n.rc(i)).to([r,o],n.rc(i)).turn(-90,n.rc(i)).fwd(n.u(.06));return n.band("horn",c.spine(),i,"flat","square")},leaf(n,{root:t,top:e,w:i,hs:s}){const o=[Math.min(n.f.X(.4*s),n.xmax(e)-i*.5),e-i*.2],a=Math.hypot(o[0]-t[0],o[1]-t[1]),r=Math.atan2(o[1]-t[1],o[0]-t[0])*180/Math.PI,c=[(t[0]+o[0])/2,(t[1]+o[1])/2];return n.sheet.add("horn",Nn(Kc(c,a,Math.max(i*1.4,a*.32),r))),n.sheet.centres.push({pts:[[xe(t[0],o[0],.15),xe(t[1],o[1],.15)],[xe(t[0],o[0],.8),xe(t[1],o[1],.8)]],w:i*1.4,force:!0}),null}},Ry=Object.keys(bc);function Py(n,t={}){let e=hn(t,"ear",n);if(e===!0&&(e="leaf"),!e||e==="none")return;const i=Math.max(n.f.X(.44),(n.marks.eyeOuter??0)+n.bw*(n.dissolved?1.2:.3)),s=n.f.Y(.56);if(i>n.xmax(s)-n.bw*1.2)return;if(e==="c"){const l=n.u(.05),h=[i+l,n.f.Y(.64)];n.band("ear",kr(h,l,{start:200,sweep:250,dir:-1,shrink:.18}),n.bw*.8,"square","round");return}const o=[Math.min(i+n.u(.09),n.xmax(n.f.Y(.74))-n.bw*.4),n.f.Y(.735)],a=[i,s],r=Math.hypot(o[0]-a[0],o[1]-a[1]),c=Math.atan2(o[1]-a[1],o[0]-a[0])*180/Math.PI;n.sheet.add("ear",Nn(Kc([(a[0]+o[0])/2,(a[1]+o[1])/2],r,Math.max(n.bw*1.2,n.u(.075)),c))),n.sheet.centres.push({pts:[[xe(a[0],o[0],.2),xe(a[1],o[1],.2)],[xe(a[0],o[0],.75),xe(a[1],o[1],.75)]],w:n.u(.075),force:!0}),n.marks.earOuter=Math.max(a[0],o[0])}function Ly(n,t){const e=Math.max(n.f.X(n.p.body==="kui"?.34:.5),(n.marks.eyeOuter??0)+n.bw*.6),i=n.xmax(t)-n.edgeW-n.u(.02);return[e,i]}function Cy(n,t={}){const e=hn(t,"body",n);if(e==="none")return!1;const i=n.f.Y(t.y??(e==="kui"?.6:.62)),[s,o]=Ly(n,i),a=n.bw*(t.width??1.55);if(o-s<n.u(.26))return!1;const r=hn(t,"tail",n),c=Math.min(n.u(.17),n.H-i-a*.6),l=o-a*.5,h=[];if(e==="dissolved"){const g=xe(s,l,.48),d=n.u(.035),m=new re([s,i],0).to([g-d,i]).turn(-90,n.rc(a)).fwd(a*.8);n.band("body0",m.spine(),a,"square","square"),h.push(["body1",g+d])}else h.push(["body",s]);const[u,f]=h[0],p=new re([f,i],0).to([l,i]);if(r==="up"||r==="spiral"){const g=r==="spiral";p.curl({dir:1,size:[c,Math.min(n.u(.13),(o-s)*.3)],pitch:a*1.4,turns:g?1.5:.8,r:g?a*6:n.rcurl(a)})}else r==="down"?p.curl({dir:-1,size:[Math.min(n.u(.17),i-a),Math.min(n.u(.13),(o-s)*.3)],pitch:a*1.4,turns:.8,r:n.rcurl(a)}):p.fwd(Math.max(0,o-l-a*1.4));const _=n.band(u,p.spine(),Rs(a,.3,.75),"square","square");if(r==="forked"){const g=_[_.length-1];n.band(u,Ie([g[0]-a*.2,g[1]+a*.3],70,n.u(.08),{curl:150,radius:n.u(.04),dir:1}),fn(a*.8,a*.4),"flat","square",{centre:!1}),n.band(u,Ie([g[0]-a*.2,g[1]-a*.3],-70,n.u(.08),{curl:150,radius:n.u(.04),dir:-1}),fn(a*.8,a*.4),"flat","square",{centre:!1})}return n.marks.body={x0:s,x1:o,xt:l,yc:i,wB:a},(t.quills??!0)&&ed(n,t),hn(t,"leg",n)&&nd(n,t),!0}function ed(n,t={}){const e=n.marks.body;if(!e)return;let i=t.count??n.p.quills;if(i===!0&&(i=3),!i)return;const s=e.yc+e.wB*.45,o=n.H-s-n.bw*.4;if(o<n.u(.04))return;const a=Math.min(n.u(.085),o*.8),r=e.x0+n.u(.08),c=e.xt-n.u(.05);if(c<=r)return;i=Math.min(i,Math.max(1,Math.floor((c-r)/n.u(.075))));const l=n.bw*.82;for(let h=0;h<i;h++){const f=[(i===1?(r+c)/2:xe(r,c,h/(i-1)))+n.rng.jitter(n.u(.008)),n.dissolved?s+n.u(.035):s-l*.3],p=Ie(f,100,a*.55,{curl:105,radius:a*.35,dir:-1});n.band(n.dissolved?"quill"+h:n.marks.body&&n.p.body==="dissolved"?"body1":"body",p,fn(l,l*.45),"flat","round",{centre:!1})}}function nd(n,t={}){const e=n.marks.body;if(!e)return;const i=n.bw*1.15,s=xe(e.x0,e.xt,t.legAt??.3),o=Math.max(n.f.Y(.1),i*1.4),a=e.yc-(n.dissolved?e.wB*.5+n.u(.035):0);if(a-o<n.u(.12))return;const r=new re([s,a],-90).to([s-n.u(.025),xe(a,o,.5)],0).to([s,o],n.rc(i,2)),c=n.dissolved?"leg":n.p.body==="dissolved"?"body1":"body";n.band(c,r.spine(),i,"flat","square");const l=t.claw??n.p.claw??3,h=i*.75;for(let u=0;u<l;u++){const f=[s-i*.2,o+i*.25-u*h*1.05];if(f[1]<h*.6)break;n.band(c,Ie(f,180,n.u(.045+.015*(l-u)),{curl:100,radius:n.u(.026),dir:1}),fn(h,h*.3),"flat","point",{centre:!1})}n.band(c,Ie([s+i*.3,o-i*.2],-20,n.u(.025),{curl:80,radius:n.u(.02),dir:-1}),fn(h*.8,h*.3),"flat","point",{centre:!1})}function ky(n,t={}){const e=n.bw,i=t.eyeY??.56;td(n,{at:[.25,i],eye:n.p.eye,size:(t.eyeSize??n.p.eyeSize)*1.2});const s=n.marks.eye,o=Math.min(s[1]-n.u(.09),n.f.Y(.42)),a=n.dissolved?n.u(.06):n.u(.035),r=new re([s[0]+n.u(.08),o],180).to([a+e,o]).curl({dir:-1,size:[Math.min(n.u(.09),s[1]-o),e*1.3],pitch:e*1.5,turns:.55,r:n.rcurl(e)});n.band("jaw",r.spine(),e,"square","square");const c=Math.max(e*.8,o-n.u(.15)),l=new re([s[0]+n.u(.04),c],180).to([a+e*1.4,c]).curl({dir:1,size:[Math.min(n.u(.07),c-e*.6),e*1.3],pitch:e*1.5,turns:.5,r:n.rcurl(e)});n.band("jaw2",l.spine(),e*.9,"square","square"),n.marks.eyeOuter=s[0]+n.u(.06)}function Dy(n,t={}){const e=hn(t,"edge",n);if(!e||e==="none")return;const i=n.bw*.9;if(e==="scrolls"){const s=n.f.Y(.05),o=Math.min(n.f.Y(.97),(n.marks.hornRoot??n.H)-n.u(.02)),a=Math.max(n.u(.15),i*3.4),r=Math.max(2,Math.floor((o-s)/a)),c=(o-s)/r;for(let l=0;l<r;l++){const h=s+(l+.5)*c,u=n.xmax(h)-i*.7,f=Math.min(n.edgeW||n.u(.18),u-n.f.X(.4)),p=u-f,_="edge"+l,g=h+c*.5-i*.75,d=h-c*.5+i*.75,m=l%2===0,y=m?p+i*.5:u-i*.5,M=m?u-i*.5:p+i*.5,v=new re([y,g],m?0:180).to([M,g]).turn(m?-90:90,n.rc(i)).to([M,d]).turn(m?-90:90,n.rc(i)).fwd(Math.max(i,Math.abs(M-y)*.62)).turn(m?-90:90,n.rc(i)).fwd(Math.max(i*.6,(g-d)*.42));n.band(_,v.spine(),i,"square","square")}return}if(e==="kui"){const s=Math.max((n.marks.earOuter??n.marks.eyeOuter??n.f.X(.5))+n.bw*1.2,n.f.X(.6)),o=n.f.Y(.94);n.f.Y(.2);const a=n.xmax(o)-i*.7;if(a-s<n.u(.16))return;const r=a-s,c=xe(s,a,.5),l=Math.min(i*1.25,r*.32),h=Math.max(l*2.6,n.u(.16)),u=Math.max(l*.7,n.f.Y(.06)),f=new re([c,u+h*.8],90).to([c,o-l*.5]).curl({dir:1,size:[Math.max(l*2.2,r*.55),Math.max(l*2,n.u(.1))],pitch:l*1.4,turns:.85,r:n.rcurl(l)});n.band("sidekui",f.spine(),Rs(l,.3,.75),"square","square");const p=[c,u+h*.5];n.sheet.add("sidekui",zi(p,Math.min(r,l*2.6),h,l*.6)),n.sheet.bosses.push({shape:On([p[0],p[1]+h*.08],l*.55),base:"plateau",r:l*.55}),n.band("sidekui",Ie([p[0]-l*.6,u+l*.3],200,Math.max(l*.8,r*.25),{curl:110,radius:l*.8,dir:1}),l*.85,"flat","square",{centre:!1});const _=xe(u+h,o,.45);n.band("sidekui",Ie([c-l*.3,_],180,Math.max(l,r*.35),{curl:100,radius:l*.7,dir:1}),fn(l*.9,l*.35),"flat","point",{centre:!1});for(let g=0;g<2;g++)n.band("sidekui",Ie([c+l*.4,xe(_,o,.25+g*.3)],15,l*.9,{curl:100,radius:l*.5,dir:1}),fn(l*.75,l*.3),"flat","point",{centre:!1});n.marks.sideKui=s}}function Iy(n,t={}){const e=n.marks.body;if(!e)return;const i=t.count??2,s=n.bw*.75,o=n.f.Y(.3),a=e.x0+e.wB*2.6,r=e.xt;for(let c=0;c<i;c++){const l=xe(a,r,(c+.5)/i);if(l>n.xmax(o)-s*2)continue;const h=new re([l-n.u(.04),o],0).fwd(n.u(.06)).curl({dir:c%2?1:-1,size:[n.u(.05),n.u(.05)],pitch:s*1.5,turns:.7,r:n.rcurl(s)});n.band("frag"+c,h.spine(),s,"square","square")}}const Uy=.12;function Ny(n,t){const e=n.f,i=n.dissolved?Math.max(n.u(.03),n.lw*2.2):0;return s=>{s.save(),e.apply(s),wc(s,n);for(const o of t){if(i){s.globalCompositeOperation="destination-out";for(const a of o.shapes)Ps(s,a,i);s.globalCompositeOperation="source-over"}for(const a of o.shapes)Ps(s,a,0)}s.restore()}}function wc(n,t){const e=t.f,i=e.H;n.beginPath(),n.moveTo(-t.ext,0),n.lineTo(e.widthAt(0),0),n.lineTo(e.widthAt(i),i),n.lineTo(-t.ext,i),n.closePath(),n.clip()}const ar=(n,t)=>Math.abs(n)>=t?0:Math.sqrt(1-n/t*(n/t));function id(n,t){const e=t.p,i=t.f,s=t.sheet,o=e.style==="flush",a=e.relief,r=e.lineWeight,c=o?Uy:a.motif,l=e.carving||"dense",h=i.taper?C=>i.warp(C):null,u=C=>h?Bf(C,h):C,f=s.islands.map(C=>({id:C.id,shapes:C.shapes.map(u)})),p=s.bosses.map(C=>({...C,shape:u(C.shape)})),_=s.tips.map(C=>({...C,shape:u(C.shape)})),g=s.cuts.map(u),d=s.grooves.map(C=>({...C,pts:h?C.pts.map(h):C.pts})),m=s.centres.map(C=>({...C,pts:h?C.pts.map(h):C.pts})),y=o?.08:Math.max(.22,Math.min(.55,c*.42)),M=o?0:e.crown||0,v=Math.max(1.5,t.bw*.45),x=M?(C,R)=>Ns.plateau(C,R)*(1-M+M*Math.min(1,C/v)):"plateau",b=Ny(t,f);if(n.raise(b,{height:c,shoulder:y,profile:x}),!o&&_.length)for(const C of _){const R=c+C.lift*Math.max(0,a.boss-c)*.7;n.raise(O=>{O.save(),i.apply(O),wc(O,t),Ps(O,C.shape),O.restore()},{height:R,shoulder:Math.max(.6,t.bw*.35),profile:"plateau"})}const w=e.echoInset??1.4,L=r/2;if(o)n.sink(b,{depth:a.groove,profile:C=>ar(C-L*1.1,L)});else if(l==="dense"){const C=w+Math.max(r*2.6,1.6);n.sink(b,{depth:a.groove,profile:R=>Math.max(ar(R-w,L),ar(R-C,L))})}else l==="sparse"&&n.sink(b,{depth:a.groove*.8,profile:C=>ar(C-w,L)});const S=[];for(const C of d)C.boss||S.push(C.pts);if(l!=="none")for(const C of m){const R=C.w/2;let O;if(o?O=l==="dense"&&R>r*2.6:C.force?O=!0:l==="dense"?O=R>w*2+r*1.5||R<w-r*.9&&R>r*1.6:O=!1,!O)continue;const A=Rn(C.pts),D=Math.min(R*1.2,A*.3),k=Nf(C.pts,D,D);k.length>1&&S.push(k)}S.length&&n.sink(C=>{C.save(),i.apply(C),wc(C,t);for(const R of S)yc(C,R,r);C.restore()},{depth:a.groove,shoulder:L,profile:"u"});for(const C of p){const R=Math.max(.5,C.r??2),O=C.base==="plateau"?Math.min(.95,c/Math.max(a.boss,.001)):.3,A=o?Math.max(a.boss,c):Math.max(a.boss,c*1.2),D=Math.max(.3,Math.min(.6,R*.12));n.raise(k=>{k.save(),i.apply(k),Ps(k,C.shape),k.restore()},{height:A,shoulder:R,profile:(k,I)=>{if(k<=0)return 0;const N=Math.min(1,k/I),z=Math.sqrt(1-(1-N)*(1-N));return Ns.plateau(k,D)*(O+(1-O)*z)}})}const T=d.filter(C=>C.boss);(g.length||T.length)&&n.sink(C=>{C.save(),i.apply(C);for(const R of g)Ps(C,R);for(const R of T)yc(C,R.pts,r);C.restore()},{depth:a.groove*1.4,shoulder:r*.45,profile:"u"})}const sd={nose:by,crest:wy,nostril:Sy,jaw:Ey,fangs:Jf,lowerJaw:Qf,eye:td,brow:Ty,horn:Ay,ear:Py,body:Cy,quills:ed,leg:nd,kuiHead:ky,edge:Dy,fragments:Iy},Qe=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),ye=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),od={style:Qe(["relief","flush"],"relief","Style (V relief / IV flush)"),carving:Qe(["dense","sparse","none"],"dense","Plateau line work (V-a / V-b)"),nose:Qe(["ridge","plain","flange","stack","none"],"ridge","Nose"),nostril:Qe(["scroll","bulb","none"],"scroll","Nostrils"),crest:Qe(["lozenge","shield","cicada","hooks","none"],"lozenge","Forehead crest"),eye:Qe(["chen","oval","round","square"],"chen","Eye"),eyeSize:ye(.6,1.6,.05,1,"Eye size"),eyeX:ye(.18,.36,.01,.27,"Eye x (face units)"),eyeY:ye(.3,.62,.01,.5,"Eye height"),pupil:Qe(["slit","dot","ring","none"],"slit","Pupil"),brow:Qe(["none","band","hooked","kui","L"],"none","Brow"),horn:Qe(Ry.concat("none"),"c","Horn"),hornSize:ye(.6,1.5,.05,1,"Horn size"),hornTip:ye(0,1,.05,0,"Horn tip high relief"),ear:Qe(["leaf","c","none"],"leaf","Ear (when no body)"),jaw:Qe(["hooked","double","split","fanged","none"],"hooked","Jaw"),lipY:ye(.08,.36,.01,.15,"Lip height"),mouthCorner:ye(.25,.7,.01,.38,"Mouth corner x"),jawTurns:ye(.5,1.6,.05,.85,"Jaw curl turns"),body:Qe(["band","kui","dissolved","none"],"band","Body"),tail:Qe(["up","down","forked","spiral"],"up","Tail"),leg:{type:"bool",default:!0,label:"Leg & claw"},claw:ye(2,3,1,3,"Claw toes"),quills:ye(0,6,1,3,"Dorsal quills"),edge:Qe(["none","scrolls","kui"],"none","Outer edge filler"),square:ye(0,1,.05,.55,"Squareness (云纹 → 雷纹)"),bandWidth:ye(.6,2,.05,1,"Band width"),spread:ye(.7,1.4,.05,1,"Face spread"),taper:ye(-.6,.95,.05,0,"Panel taper"),invert:{type:"bool",default:!1,label:"Inverted (lid)"},crown:ye(0,.5,.05,0,"Plateau crown (V-b)"),irregularity:ye(0,2,.1,1,"Hand irregularity"),seed:ye(0,99,1,0,"Seed"),lineWeight:ye(.3,1.6,.05,.6,"Line weight","mm"),echoInset:ye(.6,3,.05,1.4,"Contour echo inset","mm"),relief:{type:"group",label:"Relief levels",fields:{motif:ye(.2,6,.1,1.5,"Motif (L1)","mm"),boss:ye(.5,10,.1,3.4,"Boss (L2)","mm"),groove:ye(.1,1.2,.05,.45,"Groove","mm")}}},Fy={"T1-classic":{},"T2-ram":{horn:"ram",square:.65,quills:2},"T3-ox-heavy":{horn:"buffalo",eye:"round",pupil:"ring",crest:"shield",body:"none",ear:"none",jaw:"fanged",nostril:"bulb",carving:"sparse",crown:.3,hornTip:.6,bandWidth:1.25,square:.3,relief:{motif:2.4,boss:5}},"T4-bottle-horn":{horn:"bottle",body:"none",ear:"none",edge:"kui"},"T5-kui-horn":{horn:"kui",crest:"hooks",body:"none",ear:"leaf"},"T6-t-horn":{horn:"t",body:"none",ear:"none",edge:"kui",brow:"band"},"T7-dissolved":{body:"dissolved",horn:"zigzag",nose:"plain",brow:"band",square:.75,quills:2},"T8-two-kui":{body:"kui",horn:"t",nose:"flange",crest:"none",eye:"chen",quills:2,square:.7},"T9-flat-band":{style:"flush",horn:"c",lineWeight:.7,bandWidth:1.2,relief:{motif:.4,boss:1.4,groove:.45}},"T10-blade":{taper:.92,body:"none",ear:"none",horn:"c",hornSize:.8,nose:"plain",crest:"none",spread:.85},"houmuwu-frieze":{body:"kui",horn:"t",nose:"flange",crest:"none",eye:"round",pupil:"dot",eyeSize:.85,tail:"up",quills:2,leg:!0,claw:2,square:.85,bandWidth:1.15,lineWeight:1,echoInset:2,relief:{motif:2.6,boss:5,groove:.75}},"houmuwu-leg":{body:"none",horn:"c",hornSize:1,hornTip:.5,nose:"flange",crest:"none",eye:"oval",pupil:"ring",eyeSize:1.15,ear:"none",nostril:"none",jaw:"double",lipY:.24,mouthCorner:.42,jawTurns:1.15,carving:"sparse",crown:.35,square:.12,bandWidth:1.55,lineWeight:1.1,echoInset:2.4,relief:{motif:3.6,boss:7.5,groove:.8}},"fangyi-body":{body:"dissolved",horn:"ram",hornSize:1.15,nose:"none",crest:"none",nostril:"none",eye:"square",pupil:"slit",eyeSize:1.1,eyeX:.36,eyeY:.47,brow:"L",jaw:"hooked",lipY:.3,mouthCorner:.62,jawTurns:1.3,ear:"none",edge:"scrolls",square:.92,bandWidth:1.6,spread:.92,lineWeight:.55,echoInset:1.1,relief:{motif:1.6,boss:3.2,groove:.4}},"fangyi-lid":{body:"dissolved",horn:"ram",hornSize:1.1,nose:"none",crest:"none",nostril:"none",eye:"square",pupil:"slit",eyeX:.36,eyeY:.5,brow:"L",jaw:"hooked",lipY:.27,mouthCorner:.55,jawTurns:1.1,ear:"none",edge:"scrolls",invert:!0,taper:-.3,square:.92,bandWidth:1.6,spread:.95,lineWeight:.55,echoInset:1.1,relief:{motif:1.5,boss:3,groove:.4}},"zun-belly":{style:"flush",body:"dissolved",horn:"ram",hornSize:1.15,nose:"flange",crest:"none",eye:"round",pupil:"none",eyeSize:.62,eyeX:.3,eyeY:.42,jaw:"hooked",lipY:.2,mouthCorner:.45,nostril:"none",brow:"L",quills:1,leg:!1,square:.92,bandWidth:1.3,lineWeight:.55,relief:{motif:.4,boss:1.8,groove:.4}},"zun-foot":{style:"flush",body:"none",horn:"crook",nose:"flange",crest:"none",eye:"round",pupil:"none",eyeSize:.62,eyeX:.3,eyeY:.4,jaw:"hooked",lipY:.17,nostril:"none",ear:"none",edge:"scrolls",taper:.18,square:.92,bandWidth:1.3,spread:.9,lineWeight:.5,relief:{motif:.4,boss:1.6,groove:.35}},"gu-waist":{body:"none",horn:"crook",nose:"flange",crest:"none",eye:"round",pupil:"dot",eyeSize:.8,eyeX:.3,eyeY:.36,jaw:"hooked",lipY:.12,nostril:"none",ear:"none",square:.9,bandWidth:1.05,carving:"sparse",lineWeight:.45,echoInset:.9,relief:{motif:.8,boss:2,groove:.3}},"gu-foot":{style:"flush",body:"none",horn:"crook",nose:"flange",crest:"none",eye:"square",pupil:"dot",eyeSize:.85,eyeX:.33,eyeY:.47,jaw:"hooked",lipY:.2,mouthCorner:.5,jawTurns:1.2,nostril:"none",ear:"c",taper:.3,square:.95,bandWidth:1.3,lineWeight:.45,relief:{motif:.35,boss:1.6,groove:.3}}},Oy={"houmuwu-frieze":{w:320,h:80},"houmuwu-leg":{w:170,h:130},"fangyi-body":{w:150,h:120},"fangyi-lid":{w:190,h:100},"zun-belly":{w:200,h:100},"zun-foot":{w:150,h:100},"gu-waist":{w:60,h:66},"gu-foot":{w:90,h:64},"T8-two-kui":{w:280,h:80},"T10-blade":{w:80,h:160}};function zy(n){const t={...n};t.ear===!0&&(t.ear="leaf"),t.ear===!1&&(t.ear="none"),t.crest===!0&&(t.crest="lozenge"),t.crest===!1&&(t.crest="none"),t.quills===!0&&(t.quills=3),t.quills===!1&&(t.quills=0),t.relief={motif:1.5,boss:3.4,groove:.45,...t.relief||{}};for(const[e,i]of Object.entries(od))t[e]===void 0&&i.type!=="group"&&(t[e]=i.default);return t}function rd(n){const t=sd,e=n.p;if(e.body==="kui")e.nose!=="none"&&t.nose(n,{nose:e.nose,from:.3,to:.72,width:.55}),t.kuiHead(n),t.horn(n,{rootX:.25}),t.body(n)||t.ear(n);else{t.crest(n),t.nose(n),t.nostril(n),t.jaw(n),t.eye(n),t.brow(n),t.horn(n);const i=t.body(n);i||t.ear(n),i&&e.body==="dissolved"&&t.fragments(n)}return t.edge(n),n}function By(n,t,e){const i=zy(e),s=Zf(n,t,i);return rd(s),id(n,s),s}const Gy={name:"taotie",label:"Taotie mask",schema:od,presets:Fy,presetPlaques:Oy,draw:By,plaque:{w:240,h:120}};function Qc(n={}){const t={};for(const[e,i]of Object.entries(n))t[e]=i.type==="group"?Qc(i.fields):i.default;return t}const ki=Math.PI/180,ad=.12,Yt=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),Gt=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}});function Pn({motif:n=1.5,boss:t=3,groove:e=.45,lineWeight:i=.55,echoInset:s=1.2,carving:o="dense"}={}){return{style:Yt(["relief","flush"],"relief","Style (V relief / IV flush)"),carving:Yt(["dense","sparse","spirals","none"],o,"Plateau line work (spirals = V-a carved plateau)"),lineWeight:Gt(.3,1.6,.05,i,"Line weight","mm"),echoInset:Gt(.5,3,.05,s,"Contour echo inset","mm"),irregularity:Gt(0,2,.1,1,"Hand irregularity"),seed:Gt(0,99,1,0,"Seed"),relief:{type:"group",label:"Relief levels",fields:{motif:Gt(.2,6,.1,n,"Motif (L1)","mm"),boss:Gt(.5,10,.1,t,"Boss (L2)","mm"),groove:Gt(.1,1.2,.05,e,"Groove","mm")}}}}function bn(n){return{style:"relief",carving:"dense",lineWeight:.55,echoInset:1.2,irregularity:1,seed:0,...n,relief:{motif:1.5,boss:3,groove:.45,...n.relief||{}}}}function Hn(n,t,e){return new Be(`${n}:${e.seed|0}:${t.x.toFixed(2)},${t.y.toFixed(2)},${t.w.toFixed(2)}`)}function zn(n,{rot:t=0,flip:e=!1,flipY:i=!1,unit:s}={}){const o=t===0?n.w:n.h,a=t===0?n.h:n.w,r=s??a,c=o/r,l=a/r,h=([u,f],p=[0,0])=>{const _=e?c-u:u,g=i?l-f:f;return t===0?(p[0]=n.x+_*r,p[1]=n.y+g*r):t===90?(p[0]=n.x+n.w-g*r,p[1]=n.y+_*r):(p[0]=n.x+g*r,p[1]=n.y+n.h-_*r),p};return{rect:n,rot:t,flip:e,flipY:i,unit:r,A:c,H:l,map:h,pts:u=>u.map(f=>h(f,[0,0]))}}class we{constructor(t,e,i=0,s=.012){this.x=t,this.y=e,this.h=i,this.step=s,this.pts=[[t,e]]}get at(){return[this.x,this.y]}fd(t){if(t<=0)return this;const e=Math.max(1,Math.ceil(t/this.step)),i=Math.cos(this.h*ki),s=Math.sin(this.h*ki),o=this.x,a=this.y;for(let r=1;r<=e;r++)this.pts.push([o+i*t*r/e,a+s*t*r/e]);return this.x=o+i*t,this.y=a+s*t,this}arc(t,e){if(!t)return this;const i=Math.sign(t),s=(this.h-i*90)*ki,o=this.x-Math.cos(s)*e,a=this.y-Math.sin(s)*e,r=Math.max(2,Math.ceil(Math.abs(t)*ki*e/this.step));for(let l=1;l<=r;l++){const h=s+t*ki*l/r;this.pts.push([o+Math.cos(h)*e,a+Math.sin(h)*e])}this.h+=t;const c=s+t*ki;return this.x=o+Math.cos(c)*e,this.y=a+Math.sin(c)*e,this}to(t,e){return this.h=Math.atan2(e-this.y,t-this.x)/ki,this.fd(Math.hypot(t-this.x,e-this.y))}spiral({a:t,b:e=t,d:i,dir:s=1,turns:o=1.5,r:a=.5,min:r=.02}={}){const c=Math.round(o*4);let l=t,h=e;for(let u=0;u<c;u++){const f=u%2===0?l:h;if(f<r)break;const p=Math.max(.003,Math.min(f*.4,a*i*.5));this.fd(Math.max(0,f-(u?p:0)-p)),u<c-1&&this.arc(s*90,p),u%2===1&&(l-=i,h-=i)}return this}curl(t,e,i=.35,s=1){let o=e,a=Math.abs(t);for(;a>0;){const r=Math.min(45,a);this.arc(s*r,o),o*=1-i*r/360,a-=r}return this}}function cd(n,t,e){if(!e)return n;const i=t.range(0,6.28),s=t.range(0,6.28),o=t.range(4,9),a=t.range(9,17);let r=0;const c=[n[0].slice()];for(let l=1;l<n.length;l++){const h=n[l][0]-n[l-1][0],u=n[l][1]-n[l-1][1],f=Math.hypot(h,u)||1e-9;r+=f;const p=e*(.6*Math.sin(r*o+i)+.4*Math.sin(r*a+s));c.push([n[l][0]-u/f*p,n[l][1]+h/f*p])}return c}function zs(n,t,e=!1){n.beginPath();for(let i=0;i<t.length;i++)i?n.lineTo(t[i][0],t[i][1]):n.moveTo(t[i][0],t[i][1]);e&&n.closePath()}function Hy(n,t,e,i,s,o){o=Math.max(0,Math.min(o,i/2,s/2)),n.moveTo(t+o,e),n.arcTo(t+i,e,t+i,e+s,o),n.arcTo(t+i,e+s,t,e+s,o),n.arcTo(t,e+s,t,e,o),n.arcTo(t,e,t+i,e,o),n.closePath()}function Eo(n,t,e=0){switch(t.kind){case"band":{if(n.lineJoin="round",typeof t.w=="function"){n.lineCap="round";const i=t.pts.length;let s=0;const o=[0];for(let a=1;a<i;a++)o.push(s+=Math.hypot(t.pts[a][0]-t.pts[a-1][0],t.pts[a][1]-t.pts[a-1][1]));for(let a=1;a<i;a++)n.lineWidth=Math.max(.05,t.w(o[a]/(s||1))+e*2),n.beginPath(),n.moveTo(t.pts[a-1][0],t.pts[a-1][1]),n.lineTo(t.pts[a][0],t.pts[a][1]),n.stroke();return}n.lineCap=t.cap==="flat"?"butt":t.cap==="square"?"square":"round",n.lineWidth=t.w+e*2,zs(n,t.pts),n.stroke();return}case"poly":zs(n,t.pts,!0),n.fill(),e&&(n.lineWidth=e*2,n.lineJoin="round",n.stroke());return;case"circle":n.beginPath(),n.arc(t.c[0],t.c[1],t.r+e,0,Math.PI*2),n.fill();return;case"rrect":{n.save(),n.translate(t.c[0],t.c[1]),t.rot&&n.rotate(t.rot),n.beginPath(),Hy(n,-t.w/2-e,-t.h/2-e,t.w+2*e,t.h+2*e,t.r+e),n.fill(),n.restore();return}case"ellipse":n.beginPath(),n.ellipse(t.c[0],t.c[1],t.rx+e,t.ry+e,t.rot||0,0,Math.PI*2),n.fill();return}}function Sc(n,t,e,i="round"){n.lineCap=i,n.lineJoin="round",n.lineWidth=e,zs(n,t),n.stroke()}class Bn{constructor(t,{rng:e,wobble:i=0}={}){this.f=t,this.rng=e||new Be(1),this.amp=i,this.plateau=[],this.holes=[],this.bosses=[],this.lines=[],this.cuts=[],this.ground=[]}P(t){return this.f.pts(this.amp?cd(t,this.rng,this.amp):t)}u(t){return t*this.f.unit}band(t,e,i="round"){return t.length>1&&this.plateau.push({kind:"band",pts:this.P(t),w:this.u(e),cap:i}),this}taper(t,e,i,s=0){const o=this.u(e),a=this.u(i);return t.length>1&&this.plateau.push({kind:"band",pts:this.P(t),w:r=>r<s?o:o+(a-o)*((r-s)/(1-s))}),this}poly(t){return this.plateau.push({kind:"poly",pts:this.f.pts(t)}),this}circle(t,e){return this.plateau.push({kind:"circle",c:this.f.map(t),r:this.u(e)}),this}rrect(t,e,i,s){return this.plateau.push(this._rrect(t,e,i,s)),this}hole(t){return this.holes.push(t),this}_rrect(t,e,i,s){const o=this.f.rot!==0;return{kind:"rrect",c:this.f.map(t),w:this.u(o?i:e),h:this.u(o?e:i),r:this.u(s)}}_ellipse(t,e,i){const s=this.f.rot!==0;return{kind:"ellipse",c:this.f.map(t),rx:this.u(s?i:e),ry:this.u(s?e:i),rot:0}}boss(t,e,{kind:i="round",base:s="plateau",pupil:o="none",aspect:a=1.35}={}){const r=i==="square"?this._rrect(t,e*2*1.08,e*2,e*.55):i==="oval"?this._ellipse(t,e*a,e):{kind:"circle",c:this.f.map(t),r:this.u(e)};if(this.bosses.push({shape:r,r:this.u(e),base:s}),o==="slit"){const c=e*.95;this.cuts.push({kind:"band",pts:this.f.pts([[t[0]-c/2,t[1]],[t[0]+c/2,t[1]]]),w:Math.max(.3,this.u(e*.16)),cap:"round"})}else o==="dot"?this.cuts.push({kind:"circle",c:this.f.map(t),r:Math.max(.25,this.u(e*.3))}):o==="ring"&&(this.ringCuts=this.ringCuts||[],this.ringCuts.push({c:this.f.map(t),r:this.u(e*.62)}));return this}line(t,e){return t.length>1&&this.lines.push({pts:this.P(t),w:e}),this}groundLine(t,e){return t.length>1&&this.ground.push({pts:this.P(t),w:e}),this}}function ld(n,t){return e=>{e.save(),t&&(t(e),e.clip());for(const i of n.plateau)Eo(e,i);if(n.holes.length){e.globalCompositeOperation="destination-out";for(const i of n.holes)Eo(e,i);e.globalCompositeOperation="source-over"}e.restore()}}const Ei=n=>t=>{t.beginPath(),t.rect(n.x,n.y,n.w,n.h)},cr=(n,t)=>Math.abs(n)>=t?0:Math.sqrt(1-n/t*(n/t));function ri(n,t,e,{clip:i,echo:s=!0}={}){var f;const o=e.style==="flush",a=e.relief,r=e.lineWeight,c=o?ad:a.motif,l=e.carving||"dense",h=ld(t,i),u=p=>_=>{_.save(),i&&(i(_),_.clip()),p(_),_.restore()};if(t.plateau.length){const p=o?.08:Math.max(.2,Math.min(.55,c*.4));n.raise(h,{height:c,shoulder:p,profile:"plateau"});const _=e.echoInset??1.2,g=r/2;if(s)if(o)n.sink(h,{depth:a.groove,profile:d=>cr(d-g*1.1,g)});else if(l==="dense"){const d=_+Math.max(r*2.6,1.5);n.sink(h,{depth:a.groove,profile:m=>Math.max(cr(m-_,g),cr(m-d,g))})}else l==="sparse"?n.sink(h,{depth:a.groove*.8,profile:d=>cr(d-_,g)}):l==="spirals"&&Yr(n,h,{pitch:e.spiralPitch??Math.max(.7,r*2),depth:a.groove,echo:1,eyes:0,line:.48},{margin:Math.max(.35,r*.7),level:c})}t.lines.length&&n.sink(u(p=>{for(const _ of t.lines)Sc(p,_.pts,_.w??r)}),{depth:a.groove,shoulder:r/2,profile:"u"}),t.ground.length&&n.sink(u(p=>{for(const _ of t.ground)Sc(p,_.pts,_.w??r)}),{depth:a.groove,shoulder:r/2,profile:"u"});for(const p of t.bosses){const _=Math.max(.5,p.r),g=p.base==="plateau"?Math.min(.95,c/Math.max(a.boss,.001)):.25,d=o?Math.max(a.boss,c):Math.max(a.boss,c*1.2),m=Math.max(.3,Math.min(.6,_*.12));n.raise(y=>Eo(y,p.shape),{height:d,shoulder:_,profile:(y,M)=>{if(y<=0)return 0;const v=Math.min(1,y/M);return Ns.plateau(y,m)*(g+(1-g)*Math.sqrt(1-(1-v)*(1-v)))}})}return(t.cuts.length||(f=t.ringCuts)!=null&&f.length)&&n.sink(p=>{for(const _ of t.cuts)Eo(p,_);for(const _ of t.ringCuts||[])p.lineWidth=r,p.beginPath(),p.arc(_.c[0],_.c[1],_.r,0,Math.PI*2),p.stroke()},{depth:a.groove*1.4,shoulder:r*.45,profile:"u"}),t}const Vy=Object.freeze(Object.defineProperty({__proto__:null,E:Yt,FLUSH_LIFT:ad,Pen:we,R:Gt,Sheet:Bn,drawShape:Eo,makeFrame:zn,motifRng:Hn,plateauPaint:ld,polyPath:zs,rectClip:Ei,reliefSchema:Pn,renderSheet:ri,strokeLine:Sc,withRelief:bn,wobble:cd},Symbol.toStringTag,{value:"Module"})),Wy={kind:Yt(["bowstrings","border","step"],"bowstrings","Kind"),count:Gt(1,4,1,2,"Ribs"),width:Gt(.6,5,.1,1.5,"Rib width","mm"),height:Gt(.3,2.5,.05,.8,"Rib height","mm"),spacing:Gt(2,12,.1,4.5,"Spacing (centre to centre)","mm"),profile:Yt(["round","flat"],"round","Rib top"),vertical:{type:"bool",default:!1,label:"Vertical"}},jy={"two-bowstrings":{},"three-bowstrings":{count:3,spacing:4},"single-bowstring":{count:1},monumental:{count:2,width:3.2,height:1.6,spacing:9,profile:"flat"},"gu-waist":{count:3,width:1.6,height:1.1,spacing:3.4},border:{kind:"border",width:4,height:.9},step:{kind:"step",width:5,height:1.2}},qy={border:{w:160,h:14},step:{w:160,h:14}},Xy=n=>t=>t<=0?0:Math.min(1,Math.sqrt(Math.min(1,t/Math.min(.45,n*.3)))),Yy=(n,t)=>n<=0?0:Math.sqrt(1-(1-Math.min(1,n/t))**2);function $y(n,t,e){const i=e.vertical||t.h>t.w*1.5,s=i?t.w:t.h,o=i?t.x+t.w/2:t.y+t.h/2,a=(h,u,f)=>{h.beginPath(),i?h.rect(u-f/2,t.y,f,t.h):h.rect(t.x,u-f/2,t.w,f),h.fill()};if(e.kind==="border"){const h=Math.min(e.width,s);n.raise(u=>a(u,o,h),{height:e.height,profile:Xy(h)});return}if(e.kind==="step"){const h=Math.min(e.width,s);n.raise(u=>a(u,o,h),{height:e.height,profile:(u,f)=>u<=0?0:Math.min(1,u/Math.min(.6,h*.25))});return}const r=e.count|0,c=Math.min(e.spacing,r>1?(s-e.width)/(r-1):e.spacing),l=o-c*(r-1)/2;n.raise(h=>{for(let u=0;u<r;u++)a(h,l+u*c,e.width)},{height:e.height,shoulder:e.profile==="flat"?Math.min(.4,e.width*.3):e.width/2,profile:e.profile==="flat"?"plateau":Yy})}const Ky={name:"bands",label:"Bowstrings & borders",schema:Wy,presets:jy,presetPlaques:qy,draw:$y,symmetric:!1,ground:!1,plaque:{w:160,h:16}},Zy={arrangement:Yt(["pair","single"],"pair","Arrangement"),facing:Yt(["right","left"],"right","Facing (single)"),crest:Yt(["hook","t","none"],"hook","Crest"),tail:Yt(["hook","fork"],"hook","Tail"),eye:Yt(["round","chen"],"round","Eye"),length:Gt(1.3,2.2,.05,1.7,"Length : height"),bandWidth:Gt(.1,.22,.01,.15,"Band width (× H)"),centreGap:Gt(0,15,.5,1.5,"Gap at centre line","mm"),...Pn({motif:1.2,boss:2.4,groove:.36,lineWeight:.45,echoInset:.8,carving:"sparse"})},Jy={pair:{},single:{arrangement:"single"},"t-crest":{crest:"t",tail:"hook"},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.35}}},Qy={single:{w:40,h:22}};function tv(n,t,e){const i=Math.min(t,e.length),s=Math.max(0,t-i-.02),o=g=>s+g*i,a=e.bandWidth,r=.46,c=[];for(let g=0;g<=48;g++){const d=g/48*Math.PI*2,m=Math.cos(d)>0,y=(m?.15:.2)*i,M=Math.sin(d)>0?.23:.2;c.push([o(.58)+Math.cos(d)*y,r+Math.sin(d)*M-(m?0:.03*Math.cos(d))])}n.poly(c);const l=[o(.8),.72],h=.16;n.band([[o(.68),r+.08],[l[0]-.03,l[1]-.05]],.18),n.circle(l,h);const u=new we(l[0]+h*.7,l[1]+.02,-5,.006).fd(Math.max(.05,.1*i)).arc(-120,.05);if(n.taper(u.pts,.14,.03,.3),n.boss(l,.075,{kind:e.eye==="chen"?"oval":"round",pupil:"dot",base:"plateau",aspect:1.4}),e.crest==="hook"){const g=new we(l[0]-.03,l[1]+h*.8,105,.006).fd(.07).arc(90,.04).fd(.02);n.taper(g.pts,a*.9,a*.45,.4)}else if(e.crest==="t"){n.band([[l[0],l[1]+h*.8],[l[0],.96-a*.4]],a*.7,"flat");const g=new we(l[0]-.08,.96-a*.4-.04,90,.006).fd(.02).arc(-90,.02).fd(.12).arc(-90,.02).fd(.02);n.band(g.pts,a*.7)}const f=new we(o(.7),r+.1,188,.006).fd(.24*i).arc(70,.07).fd(.04).arc(110,.035);n.taper(f.pts,a*1.1,a*.5,.55);const p=new we(o(.44),r,192,.006).fd(.2*i).arc(62,.16).fd(Math.max(.02,r-.3)).arc(150,.04);if(n.taper(p.pts,a*1.5,a*.55,.35),e.tail==="fork"){const g=new we(o(.4),r+.02,195,.006).fd(.16*i).arc(-50,.05).fd(.02);n.taper(g.pts,a*.9,a*.4,.5)}const _=new we(o(.56),r-.12,-95,.006).fd(r-.12-.12).arc(95,.04).fd(.08).arc(-110,.03);return n.taper(_.pts,a*.75,a*.4,.6),n}function ev(n,t,e){const i=bn(e),s=i.arrangement==="pair",o=s?Math.min(i.centreGap,t.w*.1):0,a=s?{x:t.x,y:t.y,w:t.w/2-o/2,h:t.h}:t,r=zn(a,{flip:!s&&i.facing==="left"}),c=new Bn(r,{rng:Hn("bird",t,i),wobble:.003*i.irregularity});return tv(c,r.A,i),ri(n,c,i,{clip:Ei(s?{...t,w:t.w/2}:t)}),c}const nv={name:"bird",label:"Bird (Shang)",schema:Zy,presets:Jy,presetPlaques:Qy,draw:ev,symmetric:n=>n.arrangement!=="single",facing:!0,plaque:{w:80,h:22},groundOptions:(n,t)=>({pitch:Math.max(.8,Math.min(2,t.h*.05))})},iv={orient:Yt(["right","left","up","down"],"right","Head toward"),facing:Yt(["auto","right","left"],"auto","Facing (set by friezes)"),length:Gt(2,4,.05,3,"Length : width"),chevrons:Gt(2,6,1,4,"Chevrons"),eyeSize:Gt(.6,1.4,.05,1,"Eye size"),legs:{type:"bool",default:!0,label:"Leg hooks"},concave:Gt(0,.3,.01,.12,"Side concavity"),...Pn({motif:1.2,boss:2.4,groove:.38,lineWeight:.45,echoInset:.8,carving:"sparse"})},sv={standard:{},"row-unit":{orient:"right",length:2.6},"blade-fill":{orient:"down",length:3.2,legs:!1,chevrons:5},slender:{length:3.6,chevrons:6,eyeSize:.85},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.35}}};function hd(n,t,e){const i=Math.min(t,e.length),s=(t-i)/2,o=s+i,a=.5,r=.3,c=o-r,l=.13*e.eyeSize;n.rrect([o-r/2,a],r,.7,.1);const h=Math.min(.5-l-.01,.33);n.circle([o-r*.5,a+h],l*1.12),n.circle([o-r*.5,a-h],l*1.12),n.boss([o-r*.5,a+h],l,{kind:"round",base:"plateau",pupil:"none"}),n.boss([o-r*.5,a-h],l,{kind:"round",base:"plateau",pupil:"none"});const u=[],f=.42,p=24;for(let d=0;d<=p;d++){const m=d/p,y=c+.01-m*(c+.01-s),M=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))+.012;u.push([y,a+M])}for(let d=p;d>=0;d--){const m=d/p,y=c+.01-m*(c+.01-s),M=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))+.012;u.push([y,a-M])}n.poly(u);const _=c-.04-s;n.line([[c-.1,a],[s+_*.12,a]]);const g=e.chevrons|0;for(let d=0;d<g;d++){const m=.12+.7*(d+.5)/g,y=c-.04-m*_,M=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))*.62,v=Math.min(.2,M*.9);n.line([[y-v,a+M],[y,a],[y-v,a-M]])}if(n.line([[c-.02,a+.3],[c-.02,a-.3]]),e.legs&&_>1)for(const d of[1,-1]){const m=new we(c-.32,a+d*(f*.8),d*120,.006).fd(.06).arc(d*70,.03);n.taper(m.pts,.08,.03,.3)}return n}const ov={right:0,left:0,up:90,down:-90};function rv(n,t,e){const i=bn(e);let s=i.orient;(s==="right"||s==="left")&&(i.facing==="left"||i.facing==="right")&&(s=i.facing);const o=zn(t,{rot:ov[s],flip:s==="left"}),a=new Bn(o,{rng:Hn("cicada",t,i),wobble:.003*i.irregularity});return hd(a,o.A,i),ri(n,a,i,{clip:Ei(t)}),a}function av(n,t){return{pitch:Math.max(.8,Math.min(2.2,Math.min(t.w,t.h)*.06))}}const cv={name:"cicada",label:"Cicada",schema:iv,presets:sv,draw:rv,groundOptions:av,symmetric:!1,facing:!0,plaque:{w:90,h:30}},lv={direction:Yt(["rising","hanging"],"rising","Direction"),shape:Yt(["triangle","ogive"],"ogive","Outline"),concave:Gt(0,.2,.01,.05,"Side concavity"),border:Yt(["band","lines","none"],"band","Border"),borderLines:Gt(1,5,1,3,"Contour lines"),borderWidth:Gt(.8,6,.1,2,"Border band width","mm"),fill:Yt(["mask","cicada","leiwen"],"mask","Fill"),maskHeight:Gt(.25,.75,.01,.48,"Mask height (of blade)"),eye:Yt(["round","square","chen","none"],"round","Mask eye"),pupil:Yt(["dot","slit","none"],"dot","Pupil"),pitch:Gt(.6,3,.05,1.1,"Leiwen pitch","mm"),leiwenTop:Gt(.3,1,.01,1,"Leiwen up to (of blade); contour lines above"),...Pn({motif:1.1,boss:2.2,groove:.35,lineWeight:.45,echoInset:.8,carving:"sparse"})},hv={"rising-mask":{},"hanging-mask":{direction:"hanging"},"rising-cicada":{fill:"cicada"},"leiwen-only":{fill:"leiwen",border:"lines",borderLines:2},"gu-trumpet":{shape:"ogive",border:"lines",borderLines:4,fill:"mask",maskHeight:.26,style:"flush",eye:"round",pupil:"none",leiwenTop:.6,pitch:.9,lineWeight:.4,relief:{motif:.35,boss:.9,groove:.3}},"zun-neck":{shape:"ogive",border:"lines",borderLines:3,fill:"mask",maskHeight:.5,style:"flush",eye:"none",pupil:"none",leiwenTop:.62,pitch:1.1,lineWeight:.5,relief:{motif:.4,boss:1.2,groove:.35}}},uv={"gu-trumpet":{w:34,h:130},"zun-neck":{w:60,h:100}};function fv(n,t,e){return e>=1?0:n.shape==="ogive"?t/2*Math.sqrt(1-e*e)*(1-.42*e)*(1-n.concave*Math.sin(Math.PI*e)):t/2*(1-e)*(1-n.concave*Math.sin(Math.PI*e))}function ud(n,t){const e=n.x+n.w/2,i=n.w,s=n.h,o=t.direction==="hanging";return{cx:e,W:i,Hh:s,Y:c=>o?n.y+n.h-c*s:n.y+c*s,hw:c=>fv(t,i,c),hanging:o}}function ro(n,t,e=80){const i=[];for(let s=0;s<=e;s++){const o=s/e,a=n.hw(o)-t;if(a<=0){i.push([n.cx,n.Y(o)]);break}i.push([n.cx-a,n.Y(o)])}return i}function dv(n,t,e,i=0){const s=bn(e),o=ud(t,s),a=ro(o,i),r=a.map(([c,l])=>[2*o.cx-c,l]).reverse();zs(n,a.concat(r),!0),n.fill()}function pv(n,t,e,i,s,o){const a=v=>Math.max(.5,t.hw(Math.min(.999,(o+v*s)/t.Hh))-i),r=([v,x])=>[t.cx-v*a(x),t.Y((o+x*s)/t.Hh)],c=v=>v.map(r),l=a(0),h=Math.max(.8,Math.min(l*.2,s*.11)),u=(v,x,b)=>new we(v,x,b,.008);n.band([r([0,.12]),r([0,.66])].map(v=>[v[0]-n.f.rect.x,v[1]-n.f.rect.y]),h*1.1/n.f.unit,"round");const f=u(.02,.1,0).fd(.64).arc(90,.08).fd(.06).arc(90,.05);n.band(vi(n,c(f.pts)),h/n.f.unit);const p=.38,_=.46,g=Math.min(l*.2,s*.12),d=r([_,p]);n.plateau.push({kind:"ellipse",c:d,rx:g*1.9,ry:g*1.35,rot:0}),e.eye==="none"?n.lines.push({pts:Array.from({length:25},(v,x)=>[d[0]+Math.cos(x/24*Math.PI*2)*g*.8,d[1]+Math.sin(x/24*Math.PI*2)*g*.8])}):n.bosses.push({shape:e.eye==="square"?{kind:"rrect",c:d,w:g*2.2,h:g*2,r:g*.55}:{kind:"circle",c:d,r:g},r:g,base:"plateau"}),e.pupil==="dot"&&n.cuts.push({kind:"circle",c:d,r:Math.max(.25,g*.3)}),e.pupil==="slit"&&n.cuts.push({kind:"band",pts:[[d[0]-g*.5,d[1]],[d[0]+g*.5,d[1]]],w:Math.max(.3,g*.18),cap:"round"});const m=u(_-.3,p+.02,180).fd(.06).arc(90,.05).fd(.04);n.band(vi(n,c(m.pts)),h*.75/n.f.unit);const y=u(.26,.58,90).fd(.16).arc(-90,.12).fd(.2).arc(-90,.1).fd(.06).arc(-90,.06).fd(.04);n.band(vi(n,c(y.pts)),h/n.f.unit);const M=u(.92,.28,90).fd(.2).arc(90,.08).fd(.1);return n.band(vi(n,c(M.pts)),h*.8/n.f.unit),{top:o+s*1.02}}function vi(n,t){return t.map(([e,i])=>[e-n.f.rect.x,i-n.f.rect.y])}function mv(n,t,e){const i=bn(e),s=ud(t,i),o=zn(t,{unit:1}),a=new Bn(o,{rng:Hn("blade",t,i),wobble:.04*i.irregularity}),r={x:t.x,y:t.y,w:t.w/2,h:t.h},c=i.lineWeight;let l=0;if(i.border==="band"){const _=Math.min(i.borderWidth,t.w*.12);a.band(vi(a,ro(s,_/2)),_,"flat"),l=_+Math.max(.8,i.pitch*.6)}else if(i.border==="lines"){const _=i.borderLines|0,g=Math.max(c*2.2,i.pitch);for(let d=0;d<_;d++)a.groundLine(vi(a,ro(s,c*.8+d*g)),c);l=c*.8+(_-1)*g+g*.9}if(i.leiwenTop<1&&i.border!=="none"){const _=Math.max(c*2.2,i.pitch),g=i.leiwenTop;for(let m=l+c*.5;m<t.w/2;m+=_){const y=ro(s,m).filter(([,M])=>(s.hanging?s.Y(0)-M:M-s.Y(0))>=g*s.Hh);if(y.length>1)a.groundLine(vi(a,y),c);else break}const d=s.hw(g)-l;d>0&&a.groundLine(vi(a,[[s.cx-d,s.Y(g)-(s.hanging?-1:1)*_*.5],[s.cx+.4,s.Y(g)-(s.hanging?-1:1)*_*.5]]),c)}const h=Math.max(1,l*.6)+.5,u=t.h-h-l;if(i.fill==="mask")pv(a,s,i,l+.4,Math.max(4,u*i.maskHeight),h);else if(i.fill==="cicada"){const _=s.hw(h/s.Hh)-l-.4,g=u*.8,d={x:s.cx-_,y:s.hanging?t.y+t.h-h-g:t.y+h,w:_*2,h:g},m=zn(d,{rot:s.hanging?90:-90}),y=new Bn(m,{rng:a.rng,wobble:.003*i.irregularity});hd(y,m.A,{length:m.A*.97,chevrons:5,eyeSize:1,legs:!1,concave:.06});for(const M of["plateau","bosses","lines","cuts"])a[M].push(...y[M])}return ri(n,a,i,{clip:_=>{_.beginPath(),_.rect(r.x,r.y,r.w+.01,r.h)}}),Si(n,{rect:r,include:_=>{const g=ro(s,l).filter(([,d])=>i.leiwenTop>=1||(s.hanging?s.Y(0)-d:d-s.Y(0))<=i.leiwenTop*s.Hh-Math.max(c*2.2,i.pitch));zs(_,g.concat([[s.cx+.5,g[g.length-1][1]],[s.cx+.5,s.Y(0)]]),!0),_.fill()},avoid:"raised",margin:Math.max(.4,i.pitch*.4)},{pitch:i.pitch,depth:i.relief.groove,echo:i.border==="lines"?0:1}),a}function gv(n){return{pitch:n.pitch}}const _v={name:"blade",label:"Rising / hanging blade",schema:lv,presets:hv,presetPlaques:uv,draw:mv,outline:dv,groundOptions:gv,ground:!1,plaque:{w:50,h:120}},Mv={layout:Yt(["lattice","grid","row","single"],"lattice","Layout"),side:Gt(8,30,.5,20,"Lozenge side / spacing","mm"),angle:Gt(45,75,1,64,"Lattice angle","°"),lines:Yt(["double","single"],"double","Lattice lines"),ridge:Gt(.6,2.5,.05,1.1,"Ridge width","mm"),ridgeHeight:Gt(.3,2,.05,.9,"Ridge height","mm"),nipple:Gt(1.5,6,.1,2.6,"Nipple base radius","mm"),nippleHeight:Gt(1,8,.1,3.4,"Nipple height","mm"),shape:Yt(["pointed","dome"],"pointed","Nipple shape"),rows:Gt(1,4,1,3,"Rows (grid)"),...Pn({motif:1,boss:3.4,groove:.4,lineWeight:.5})},yv={lattice:{},"single-lines":{lines:"single",angle:60,side:14},"gui-belly":{side:20,nipple:3.4,nippleHeight:5.5,ridge:1.3},"fangding-frame":{layout:"grid",side:14,rows:3,nipple:3.2,nippleHeight:3.6,shape:"dome"},row:{layout:"row",side:12,nipple:3,nippleHeight:3.2,shape:"dome"},single:{layout:"single",nipple:4,nippleHeight:5}},vv={row:{w:140,h:18},single:{w:30,h:30},"fangding-frame":{w:160,h:46}};function xv(n){return n==="dome"?(t,e)=>t<=0?0:Math.sqrt(1-(1-Math.min(1,t/e))**2):(t,e)=>{if(t<=0)return 0;const i=Math.min(1,t/e),s=Math.min(1,t/(e*.12));return Math.min(s,.25+.75*Math.pow(i,.85))*(1-.08*Math.pow(i,6))}}function lr(n,t,e){const i=e.nipple;n.raise(s=>{for(const[o,a]of t)s.beginPath(),s.arc(o,a,i,0,Math.PI*2),s.fill()},{height:e.nippleHeight,shoulder:i,profile:xv(e.shape)})}function bv(n,t,e){const i=bn(e),s=t.x+t.w/2,o=t.y+t.h/2;if(i.layout==="single")return lr(n,[[s,o]],i);if(i.layout==="row"){const g=t.w>=t.h,d=g?t.w:t.h,m=Math.max(1,Math.round(d/i.side)),y=[];for(let M=0;M<m;M++){const v=(M+.5)/m;y.push(g?[t.x+v*t.w,o]:[s,t.y+v*t.h])}return lr(n,y,i)}if(i.layout==="grid"){const g=i.side,d=Math.max(1,Math.round(t.w/g)),m=Math.max(1,Math.min(i.rows|0,Math.round(t.h/g))),y=t.w/d,M=t.h/m,v=[];for(let x=0;x<m;x++){const b=x%2?.5:0;for(let w=0;w<d-(b?1:0);w++)v.push([t.x+(w+.5+b)*y,t.y+(x+.5)*M])}return lr(n,v,i)}const a=i.angle*Math.PI/180,r=Math.sin(a),c=Math.cos(a),l=i.side*Math.sin(Math.PI-2*a)||i.side,h=Math.hypot(t.w,t.h),u=Math.ceil(h/l)+1,f=i.ridge*1.15;n.raise(g=>{g.save(),g.beginPath(),g.rect(t.x,t.y,t.w,t.h),g.clip(),g.lineWidth=i.ridge,g.lineCap="butt";const d=i.lines==="double"?[-f/2,f/2]:[0];for(let m=-u;m<=u;m++)for(const y of d){const M=(m+.5)*l+y,v=s+M*r,x=o-M*c;g.beginPath(),g.moveTo(v-c*h,x-r*h),g.lineTo(v+c*h,x+r*h),g.stroke();const b=s+M*r,w=o+M*c;g.beginPath(),g.moveTo(b-c*h,w+r*h),g.lineTo(b+c*h,w-r*h),g.stroke()}g.restore()},{height:i.ridgeHeight,profile:"ridge"});const p=[],_=i.nipple+i.ridge;for(let g=-u;g<=u;g++)for(let d=-u;d<=u;d++){const m=g*l,y=d*l,M=s+(m+y)/(2*r),v=o+(y-m)/(2*c);M-_<t.x||M+_>t.x+t.w||v-_<t.y||v+_>t.y+t.h||p.push([M,v])}lr(n,p,i)}const wv={name:"boss",label:"Bosses / boss lattice",schema:Mv,presets:yv,presetPlaques:vv,draw:bv,symmetric:!1,plaque:{w:120,h:80},groundOptions:n=>({pitch:Math.max(.8,Math.min(1.8,n.side*.075))})},Sv={eyes:Gt(1,12,1,4,"Eyes"),eye:Yt(["chen","round"],"chen","Eye"),eyeSize:Gt(.6,1.4,.05,1,"Eye size"),slope:Gt(30,60,1,45,"Diagonal angle","°"),rib:Gt(.06,.2,.01,.1,"Rib width (× H)"),...Pn({motif:1.1,boss:2.2,groove:.35,lineWeight:.45,echoInset:.8,carving:"none"})},Ev={chen:{},round:{eye:"round",eyes:5},flush:{style:"flush",relief:{motif:.35,boss:1.1,groove:.35}}};function Tv(n,t,e){const i=bn(e),s=zn(t),o=s.A,a=new Bn(s,{rng:Hn("eyeband",t,i),wobble:.003*i.irregularity}),r=Math.max(1,i.eyes|0),c=o/r,l=i.rib,h=1/Math.tan(i.slope*Math.PI/180),u=.17*i.eyeSize,f=i.eye==="chen"?u*1.6:u;for(let g=0;g<r;g++){const d=(g+.5)*c;i.eye==="chen"?(a.plateau.push({kind:"ellipse",c:s.map([d,.5]),rx:s.unit*f*1.15,ry:s.unit*u*1.35,rot:0}),a.band([[d-f*1.1,.5],[d-f*1.5,.5],[d-f*1.5,.36]],l*.9),a.band([[d+f*1.1,.5],[d+f*1.5,.5],[d+f*1.5,.36]],l*.9)):a.circle([d,.5],u*1.45),a.boss([d,.5],u,{kind:i.eye==="chen"?"oval":"round",aspect:1.5,pupil:"dot",base:"plateau"})}const p=.94,_=.06;for(let g=0;g<=r;g++){const d=g*c,m=Math.min(h*(p-_),c/2-f*1.6);g>0&&a.band([[d-m,p],[d-.02,_]],l,"flat"),g<r&&a.band([[d+.02,_],[d+m,p]],l,"flat")}return ri(n,a,i,{clip:Ei(t)}),a}const Av={name:"eyeband",label:"Eye-and-diagonal band",schema:Sv,presets:Ev,draw:Tv,symmetric:!1,plaque:{w:180,h:18},groundOptions:(n,t)=>({pitch:Math.max(.7,Math.min(1.6,t.h*.06))})},Ec=(n,t)=>typeof n.symmetric=="function"?n.symmetric(t):n.symmetric!==!1;function ko(n,t,e,i={},{preset:s,ground:o={},margin:a=.6}={}){var h;const r=Gs(t),c=To(r,i,s),l=Ec(r,c);if(r.draw(n,e,c),o!==!1&&r.ground!==!1){const u=l?{x:e.x,y:e.y,w:e.w/2,h:e.h}:e;n.fillGround({...((h=r.groundOptions)==null?void 0:h.call(r,c,e))||{},...o},{rect:u,margin:a})}return l&&n.mirrorX(e),c}function $h(n){return typeof n=="string"?{motif:n}:n}function xi(n,t,e,i,s,o){var b;if(typeof e=="string"||e&&typeof e.draw=="function"){const w=i,L=s||{},S=o||{},T=t.w/w;for(let C=0;C<w;C++)ko(n,e,{x:t.x+C*T,y:t.y,w:T,h:t.h},L,S);return{slots:[]}}const a={unit:"kui",count:2,facing:"centre",gap:0,centre:null,params:{},preset:void 0,ground:{},margin:.6,...e||{}},r=(Array.isArray(a.unit)?a.unit:[a.unit]).map($h),c=Math.max(1,a.count|0),l=[];for(let w=0;w<c;w++)l.push(r[w%r.length]);const h=a.facing==="centre",u=h&&c%2===1?(c-1)/2:-1;u>=0&&(l[u]=a.centre?$h(a.centre):null);const f=a.gap*(c-1);let p=0,_=0;const g=l.map(w=>{const L=w==null?void 0:w.w;if(L==null)return _++,null;const S=L<=1?L*(t.w-f):L;return p+=S,S}),d=_?Math.max(0,t.w-f-p)/_:0,m=[];let y=t.x;for(let w=0;w<c;w++){const L=g[w]??d;m.push({rect:{x:y,y:t.y,w:L,h:t.h},spec:l[w],i:w}),y+=L+a.gap}const M=t.x+t.w/2;let v=null;for(const w of m){if(!w.spec)continue;const L=Gs(w.spec.motif),S=h?w.rect.x+w.rect.w/2<M-1e-6?"right":w.i===u?null:"left":a.facing;if(h&&S==="left")continue;const T=To(L,{...a.params,...w.spec.params||{},...S?{facing:S,arrangement:"single"}:{}},w.spec.preset??a.preset);h&&w.i===u&&!Ec(L,T)&&(v={m:L,p:T,rect:w.rect,snap:Rv(n,w.rect)}),L.draw(n,w.rect,T),Ec(L,T)&&!(h&&w.i===u)&&n.mirrorX(w.rect)}const x=h?{...t,w:t.w/2}:t;if(a.ground!==!1){const w=l.find(Boolean),L=w?Gs(w.motif):null,S=L?To(L,a.params,w.preset??a.preset):{};n.fillGround({...((b=L==null?void 0:L.groundOptions)==null?void 0:b.call(L,S,t))||{},...a.ground},{rect:x,margin:a.margin})}return h&&n.mirrorX(t),v&&(Pv(n,v.snap),v.m.draw(n,v.rect,v.p)),{slots:m}}function Rv(n,t){const{cols:e,ppmm:i}=n,s=Math.max(0,Math.floor(t.x*i)),o=Math.min(e,Math.ceil((t.x+t.w)*i)),a=Math.max(0,Math.floor(t.y*i)),r=Math.min(n.rows,Math.ceil((t.y+t.h)*i)),c=o-s,l=new Float32Array(c*(r-a)),h=new Float32Array(c*(r-a));for(let u=a;u<r;u++)for(let f=s;f<o;f++)l[(u-a)*c+f-s]=n.field[u*e+f],h[(u-a)*c+f-s]=n.groove[u*e+f];return{x0:s,x1:o,y0:a,y1:r,w:c,f:l,g:h,after:null}}function Pv(n,t){const{cols:e}=n;for(let i=t.y0;i<t.y1;i++)for(let s=t.x0;s<t.x1;s++){const o=i*e+s,a=(i-t.y0)*t.w+s-t.x0;n.field[o]>t.f[a]+.03&&(n.field[o]=t.f[a],n.groove[o]=t.g[a])}}function Lv(n,t,e="kui",i={}){return xi(n,t,{...i,unit:e,count:2,facing:"centre"})}function fd(n,t,{count:e=2,width:i=1.5,height:s=.8,spacing:o,profile:a="ridge",vertical:r=!1}={}){const c=r?t.w:t.h,l=o??Math.min(c/Math.max(1,e),i*3),h=l*(e-1),u=(r?t.x+t.w/2:t.y+t.h/2)-h/2;n.raise(f=>{for(let p=0;p<e;p++){const _=u+p*l;f.beginPath(),r?f.rect(_-i/2,t.y,i,t.h):f.rect(t.x,_-i/2,t.w,i),f.fill()}},{height:s,profile:a,...a==="plateau"?{shoulder:Math.min(.4,i*.3)}:{}})}function za(n){if(!n||n.kind==="none")return 0;if(n.h!=null)return n.h;if(n.kind==="bowstrings"){const t=n.width??1.5;return(n.count??2)*(n.spacing??t*3)+(n.pad??1)}return n.kind==="line"?(n.width??1.4)+(n.pad??1.5):4}function Ba(n,t,e){!e||e.kind==="none"||e.kind==="plain"||(e.kind==="bowstrings"?fd(n,t,e):e.kind==="line"&&Ur(n,{x:t.x,y:t.y+t.h/2,w:t.w,h:0},{width:e.width??1.4,height:e.height??.7,sides:"b"}))}function Ms(n,t,e,{separator:i={kind:"bowstrings",count:2},edges:s=!1,inset:o=.8,ground:a={}}={}){const r=e.map((g,d)=>d<e.length-1?g.sep??i:null),c=s?za(i):0;let l=2*c;for(let g=0;g<e.length;g++)l+=za(r[g])+(e[g].h??0);const h=e.reduce((g,d)=>g+(d.h==null?d.weight??1:0),0),u=Math.max(0,t.h-l);let f=t.y+t.h;const p=[],_={};s&&(Ba(n,{x:t.x,y:f-c,w:t.w,h:c},i),f-=c);for(let g=0;g<e.length;g++){const d=e[g],m=d.h??u*(d.weight??1)/(h||1),y={x:t.x,y:f-m,w:t.w,h:m},M={x:y.x,y:y.y+(r[g]||s&&g===e.length-1?o:0),w:y.w,h:0};if(M.h=y.y+y.h-(g>0||s?o:0)-M.y,p.push(M),d.name&&(_[d.name]=M),d.draw?d.draw(n,M):d.frieze?xi(n,M,{ground:a,...d.frieze}):d.blades?dd(n,M,d.blades):d.motif&&ko(n,d.motif,M,d.params||{},{preset:d.preset,ground:d.ground??a}),f-=m,r[g]){const v=za(r[g]);Ba(n,{x:t.x,y:f-v,w:t.w,h:v},r[g]),f-=v}}return s&&Ba(n,{x:t.x,y:f-c,w:t.w,h:c},i),{rows:p,byName:_}}function dd(n,t,{count:e=4,direction:i="rising",gap:s=0,params:o={},preset:a,between:r="plain",ground:c={}}={}){var u;const l=(t.w-s*(e-1))/e,h=[];for(let f=0;f<e;f++){const p={x:t.x+f*(l+s),y:t.y,w:l,h:t.h};h.push(p),ko(n,"blade",p,{...o,direction:i},{preset:a,ground:c})}if(r==="leiwen"){const f=Gs("blade"),p=To(f,{...o,direction:i},a),_=n.mask(g=>{for(const d of h)f.outline(g,d,p)});n.fillGround({...((u=f.groundOptions)==null?void 0:u.call(f,p,t))||{},...c},{rect:t,avoid:_,margin:.6})}return h}function pd(n,t,{width:e=20,top:i,bottom:s,sides:o="kui",sideHeads:a="down",line:r=!0,lineWidth:c=1.4,lineHeight:l=.7,params:h={},preset:u,bosses:f={},ground:p={}}={}){const _=typeof e=="number"?{t:e,b:e,l:e,r:e}:{t:20,b:20,l:20,r:20,...e},g={x:t.x+_.l,y:t.y+_.b,w:t.w-_.l-_.r,h:t.h-_.t-_.b},d=(y,M)=>{if(y!=="plain"){if(y==="bosses")return Tc(n,M,f);xi(n,M,{unit:"kui",count:2,facing:"centre",params:h,preset:u,ground:p,...y||{}})}},m=r?c*1.4:0;_.t&&d(i,{x:g.x,y:g.y+g.h+m*.5,w:g.w,h:_.t-m}),_.b&&d(s??i,{x:g.x,y:t.y+m*.5,w:g.w,h:_.b-m});for(const y of["l","r"]){if(!_[y])continue;const M=y==="l"?{x:t.x+m*.5,y:t.y+m*.5,w:_.l-m,h:t.h-m}:{x:t.x+t.w-_.r+m*.5,y:t.y+m*.5,w:_.r-m,h:t.h-m};if(o!=="plain"){if(o==="bosses"){Tc(n,M,f);continue}ko(n,"kui",M,{...h,arrangement:"single",orient:a,facing:y==="l"?"right":"left"},{preset:u,ground:p})}}return r&&(Ur(n,t,{width:c,height:l,sides:"tblr"}),Ur(n,g,{width:c,height:l,sides:"tblr"})),g}function Tc(n,t,{radius:e,height:i,spacing:s,rows:o}={}){const a=Math.min(t.w,t.h),r=o??Math.max(1,Math.round(a/(s??a))),c=s??a/r,l=e??c*.28,h=i??l*.9,u=Math.max(1,Math.floor(t.w/c)),f=Math.max(1,Math.floor(t.h/c)),p=t.w/u,_=t.h/f;n.raise(g=>{for(let d=0;d<u;d++)for(let m=0;m<f;m++)g.beginPath(),g.arc(t.x+(d+.5)*p,t.y+(m+.5)*_,l,0,Math.PI*2),g.fill()},{height:h,profile:(g,d)=>Math.pow(Math.min(1,g/d),.8),shoulder:l})}function Cv(n,t){const e={};let i=n.y;for(const s of t)e[s.name]={x:n.x,y:i,w:n.w,h:s.h},i+=s.h;return e}function kv(n,t){const e=typeof t=="number"?{l:t,r:t,t,b:t}:{l:0,r:0,t:0,b:0,...t};return{x:n.x+e.l,y:n.y+e.b,w:n.w-e.l-e.r,h:n.h-e.t-e.b}}function Dv(n,t,e,{count:i,radius:s=4,height:o=3}={}){const a=i??Math.max(1,Math.floor(Math.hypot(e[0]-t[0],e[1]-t[1])/(s*3)));n.raise(r=>{for(let c=0;c<a;c++){const l=a===1?.5:(c+.5)/a;r.beginPath(),r.arc(t[0]+(e[0]-t[0])*l,t[1]+(e[1]-t[1])*l,s,0,Math.PI*2),r.fill()}},{height:o,profile:"dome"})}function Ur(n,t,{width:e=1.2,height:i=.6,sides:s="tb"}={}){n.raise(o=>{o.lineWidth=e,o.lineCap="butt",o.beginPath(),s.includes("b")&&(o.moveTo(t.x,t.y),o.lineTo(t.x+t.w,t.y)),s.includes("t")&&(o.moveTo(t.x,t.y+t.h),o.lineTo(t.x+t.w,t.y+t.h)),s.includes("l")&&(o.moveTo(t.x,t.y),o.lineTo(t.x,t.y+t.h)),s.includes("r")&&(o.moveTo(t.x+t.w,t.y),o.lineTo(t.x+t.w,t.y+t.h)),o.stroke()},{height:i,profile:"ridge"})}const md=["kui-frieze","bird-frieze","cicada-row","whorl-kui","eye-band","neck-belly","blade-row","houmuwu-wall","boss-belly","fangyi-face"],Iv={layout:Yt(md,"neck-belly","Layout"),style:Yt(["relief","flush"],"relief","Style (V relief / IV flush)"),fit:{type:"bool",default:!0,label:"Keep natural proportions"}},Uv=Object.fromEntries(md.map(n=>[n,{layout:n}])),gd={"kui-frieze":{w:200,h:34},"bird-frieze":{w:160,h:26},"cicada-row":{w:180,h:22},"whorl-kui":{w:220,h:26},"eye-band":{w:180,h:30},"neck-belly":{w:200,h:150},"blade-row":{w:170,h:150},"houmuwu-wall":{w:240,h:118},"boss-belly":{w:180,h:120},"fangyi-face":{w:150,h:170}},Ga={kind:"bowstrings",count:2,width:1.4,height:.8,spacing:3.6};function Nv(n,t){const e=gd[t];if(!e)return n;const i=Math.min(n.w/e.w,n.h/e.h),s=e.w*i,o=e.h*i;return{x:n.x+(n.w-s)/2,y:n.y+(n.h-o)/2,w:s,h:o}}function Fv(n,t,e){const i=e.fit===!1?t:Nv(t,e.layout),s={style:e.style};switch(e.layout){case"kui-frieze":return xi(n,i,{unit:"kui",count:2,facing:"centre",params:s});case"bird-frieze":return xi(n,i,{unit:"bird",count:4,facing:"centre",gap:2,params:s});case"cicada-row":return xi(n,i,{unit:{motif:"cicada",params:{length:2.8}},count:6,facing:"centre",gap:3,params:s});case"whorl-kui":{const o={motif:"whorl",w:i.h*.98};return xi(n,i,{unit:[o,{motif:"kui",params:{quills:1,crest:"hook"}}],count:5,facing:"centre",centre:o,gap:1.5,params:s})}case"eye-band":return Ms(n,i,[{motif:"eyeband",params:{...s,eyes:4}}],{separator:Ga,edges:!0});case"neck-belly":return Ms(n,i,[{weight:.2,frieze:{unit:"kui",count:2,facing:"centre",params:s}},{weight:.62,motif:"taotie",preset:"T1-classic",params:s},{weight:.18,frieze:{unit:"bird",count:4,facing:"centre",gap:2,params:s}}],{separator:Ga});case"blade-row":return Ms(n,i,[{weight:.8,blades:{count:4,direction:"rising",gap:3,params:s}},{weight:.2,frieze:{unit:{motif:"cicada",params:{length:2.8}},count:6,facing:"centre",gap:3,params:s}}],{separator:{kind:"bowstrings",count:2,width:1.3,height:.8,spacing:3.2},edges:!1});case"houmuwu-wall":{const o=i.h*.2,a=i.w*.14;return pd(n,i,{width:{t:o,b:o,l:a,r:a},top:{unit:"kui",count:2,facing:"centre",params:{quills:2,tail:"forked",marks:"c-marks",square:.9,...s},ground:{pitch:1.3}},sides:"kui",sideHeads:"down",params:{...s,quills:1,crest:"hook"},ground:{pitch:1.3}})}case"boss-belly":return Ms(n,i,[{weight:.18,motif:"eyeband",params:{...s,eyes:4}},{weight:.82,motif:"boss",params:s}],{separator:Ga,edges:!0});case"fangyi-face":return Ms(n,i,[{weight:.17,frieze:{unit:"kui",count:2,facing:"centre",params:{...s,eye:"square",pupil:"slit",centreGap:6}}},{weight:.64,motif:"taotie",preset:"fangyi-body",params:s},{weight:.19,frieze:{unit:"kui",count:2,facing:"centre",params:{...s,eye:"square",pupil:"slit",centreGap:6}}}],{separator:{kind:"line",width:1.2,height:.7}})}return null}const Ov={name:"frieze",label:"Friezes & registers (composed)",schema:Iv,presets:Uv,presetPlaques:gd,draw:Fv,symmetric:!1,ground:!1,plaque:{w:200,h:150}},zv={arrangement:Yt(["pair","single"],"pair","Arrangement"),facing:Yt(["right","left"],"right","Facing (single)"),orient:Yt(["horizontal","up","down"],"horizontal","Orientation"),head:Yt(["gaping","beaked","trunked"],"gaping","Head"),turned:{type:"bool",default:!1,label:"Head turned back"},tail:Yt(["up","down","forked"],"up","Tail (forked = 歧尾)"),crest:Yt(["t","bottle","hook","none"],"t","Crest"),eye:Yt(["round","square","chen"],"round","Eye"),pupil:Yt(["dot","slit","none"],"dot","Pupil"),eyeSize:Gt(.6,1.5,.05,1,"Eye size"),quills:Gt(0,4,1,2,"Dorsal quills"),leg:{type:"bool",default:!0,label:"Leg & claw"},bandWidth:Gt(.12,.32,.01,.23,"Band width (× H)"),square:Gt(0,1,.05,.7,"Squareness"),marks:Yt(["none","c-marks"],"none","Body marks"),centreGap:Gt(0,20,.5,1.5,"Gap at centre line","mm"),...Pn({motif:1.4,boss:2.8,groove:.4,lineWeight:.5,echoInset:1,carving:"sparse"})},Bv={"k1-tail-up":{},"k2-tail-down":{tail:"down",crest:"hook"},"k3-trunked":{head:"trunked",crest:"none",quills:1},"k4-beaked":{head:"beaked",crest:"hook",eye:"round"},"carved-plateau":{carving:"spirals",bandWidth:.27,square:.9},"turned-back":{turned:!0,crest:"none",quills:1},single:{arrangement:"single"},"vertical-head-up":{arrangement:"single",orient:"up",quills:1,crest:"hook"},flush:{style:"flush",lineWeight:.55,relief:{motif:.4,boss:1.5,groove:.4}},"fangyi-band":{eye:"square",pupil:"slit",eyeSize:1.15,crest:"t",quills:1,square:.9,bandWidth:.27,carving:"spirals",lineWeight:.5,echoInset:.95,relief:{motif:1.3,boss:2.6,groove:.38}},forked:{tail:"forked",quills:3},houmuwu:{tail:"forked",eye:"round",pupil:"dot",crest:"t",quills:2,square:.92,bandWidth:.2,marks:"c-marks",lineWeight:1,echoInset:2,centreGap:6,relief:{motif:3,boss:6,groove:.8}}},Gv={single:{w:100,h:24},"vertical-head-up":{w:26,h:110},houmuwu:{w:330,h:80}};function Hv(n,t,e){const i=e.bandWidth,s=e.square,o=(G=1)=>i*G*(.55-.42*s),a=G=>t-G,r=!!e.turned,c=e.head==="trunked",l=.14*e.eyeSize,h=r?.62:1,u=c?.16:0,f=a(r?.86:u),p=r?.4:0,_=r?-1:1,g=([G,$])=>[f-_*G*h,p+$*h],d=G=>G.map(g),m=(G,$,J)=>new we(G,$,J,.01),y=G=>d(G.map(([$,J])=>[-$,J])),M=.56,v=.4,x=.5,b=.54;n.rrect(g([x,b]),M*h,v*h,o(1.1)*h+.02);const w=b-v/2,L=x-M/2,S=i*.8*h;if(e.head==="beaked"){const G=m(-L-.02,b-.06,0).fd(L-.06).arc(-70,.09).arc(-80,.05);n.taper(y(G.pts),i*1.25*h,i*.2*h,.3)}else if(c){const G=m(-L-.04,w+S*.5,0).fd(L+u-.14).arc(90,.1).fd(.3).arc(90,.08).fd(.04).arc(90,.05);n.taper(y(G.pts),S,S*.6,.65)}else{const G=m(-L-.04,w+S*.5,0).fd(L-.12).arc(90,.075).fd(.1).arc(90,.055).fd(.02);n.taper(y(G.pts),S,S*.6,.7)}if(e.head!=="beaked"){const J=m(-.38,w+.02,-90).fd(Math.max(.02,w-.13-o())).arc(90,o()).fd(Math.max(.05,.18)).arc(-90,.04).fd(.01).arc(-90,.03);n.taper(y(J.pts),S*.85,S*.5,.75)}else{const G=m(-.3,w+.02,-90).fd(.08).arc(90,.04).fd(.06).arc(-90,.03);n.taper(y(G.pts),S*.7,S*.35,.6)}const T=i*.52*h,C=b+v/2,R=Math.max(.08,(.97-p)/h-C);if(e.crest==="t"){const G=C+R-T/h*.5-.01,$=m(-x,C-.02,90).fd(Math.max(.02,G-C-.02));n.band(y($.pts),T,"flat");const J=Math.max(0,Math.min(.03,G-.03-T/h-.04-C)),it=m(-x-.15,G-J-.03,90).fd(J).arc(-90,.03).fd(.24).arc(-90,.03).fd(J);n.band(y(it.pts),T)}else if(e.crest==="bottle"){const G=m(-x,C-.02,90).fd(R*.35);n.band(y(G.pts),T,"flat"),n.rrect(g([x,C+R*.62]),.22,R*.62,.06)}else if(e.crest==="hook"){const G=m(-x-.06,C-.02,90).fd(R*.3).arc(-90,R*.35).fd(.12).arc(-90,.04).fd(.01);n.taper(y(G.pts),T,T*.55,.6)}const O=e.eye==="square"?"square":e.eye==="chen"?"oval":"round";if(n.boss(g([x,b]),l*h,{kind:O,pupil:e.pupil,base:"plateau",aspect:1.45}),e.eye==="chen"){const G=g([x,b]),$=l*1.45*h;n.line([[G[0]+_*$*.9,G[1]],[G[0]+_*$*1.35,G[1]-.04*h],[G[0]+_*$*1.35,G[1]-.09*h]]),n.line([[G[0]-_*$*.9,G[1]],[G[0]-_*$*1.4,G[1]+.03*h]])}const A=r?.34:.45,D=.42,k=D*.5+i*.5+.02,I=a(r?.2:x+.1),N=new we(I,A,180,.01);if(r){const G=new we(a(.2),A,90,.01).fd(.3);n.band(G.pts,i*.9)}N.fd(Math.max(.05,I-k));const z=o(1.2),q=i*.82+.07,Z=s>.5;if(e.tail!=="down"?(N.arc(-90,z),Z?N.spiral({a:.95-A-i*.5-z,b:D,d:q,dir:-1,turns:1.75,r:1.6-s}):N.fd(.12).curl(330,.19,.55,-1)):(N.arc(90,z),Z?N.spiral({a:A-.05-i*.5-z,b:D,d:q,dir:1,turns:1.75,r:1.6-s}):N.fd(.08).curl(330,.17,.55,1)),n.taper(N.pts,i,i*.62,.5),e.tail==="forked"){const G=new we(k+i*.9,A-i*.3,250,.008).fd(Math.max(.05,A-i*.5-.2)).arc(100,.06).fd(.05).arc(110,.035);n.taper(G.pts,i*.8,i*.35,.4)}if(e.marks==="c-marks"){const G=Math.floor((I-k-.3)/(i*1.3));for(let $=0;$<G;$++){const J=I-.3-$*i*1.3,it=i*.22,ot=[];for(let ct=60;ct<=300;ct+=20)ot.push([J+Math.cos(ct*Math.PI/180)*it,A+Math.sin(ct*Math.PI/180)*it]);n.line(ot)}}const Q=e.quills|0,U=a(r?1.25:x+.4),Y=Math.max(.2,U-k-D*.5-.2);for(let G=0;G<Q;G++){const $=U-(Q===1?Y*.4:Y*G/Math.max(1,Q-1)),J=new we($,A+i*.3,118,.008).fd(.12+i*.3).arc(70,.05);n.taper(J.pts,i*.55,i*.2,.2)}if(e.leg){const G=a(r?.72:x+.5),$=.17,J=o(.9),it=new we(G,A,-86,.01).fd(Math.max(.05,A-$-J)).arc(86,J).fd(.07).arc(-100,.04);n.taper(it.pts,i*.78,i*.4,.6);const ot=new we(G+J*.6,$-i*.25,-30,.008).fd(.04).arc(-80,.025);n.taper(ot.pts,i*.38,i*.16,.3);const ct=new we(G-i*.2,$+.02,200,.008).fd(.05).arc(80,.025);n.taper(ct.pts,i*.4,i*.15,.3)}return n}function Vv(n,t,e){const i=bn(e),s=i.arrangement==="pair",o=s?Math.min(i.centreGap,t.w*.1):0,a=s?{x:t.x,y:t.y,w:t.w/2-o/2,h:t.h}:t,r=i.orient==="up"?90:i.orient==="down"?-90:0,c=r===0&&!s&&i.facing==="left",l=r===90?i.facing==="left":r===-90?i.facing!=="left":!1,h=zn(a,{rot:r,flip:c,flipY:l}),u=Hn("kui",t,i),f=new Bn(h,{rng:u,wobble:.004*i.irregularity});return Hv(f,h.A,i),ri(n,f,i,{clip:Ei(s?{...t,w:t.w/2}:t)}),f}function Wv(n,t){const e=n.orient==="horizontal"||!n.orient?t.h:t.w;return{pitch:Math.max(.9,Math.min(2.6,e*.035))}}const jv={name:"kui",label:"Kui dragon",schema:zv,presets:Bv,presetPlaques:Gv,draw:Vv,groundOptions:Wv,symmetric:n=>n.arrangement!=="single",facing:!0,plaque:{w:200,h:44}},qv={pitch:{type:"range",min:.6,max:3,step:.05,default:1.3,label:"Pitch",unit:"mm"},line:{type:"range",min:.3,max:.7,step:.02,default:.5,label:"Groove : pitch"},cellMin:{type:"range",min:3,max:8,step:.1,default:4.2,label:"Cell min (× pitch)"},cellMax:{type:"range",min:4,max:12,step:.1,default:7.8,label:"Cell max (× pitch)"},roundness:{type:"range",min:0,max:1,step:.05,default:.15,label:"Roundness"},jitter:{type:"range",min:0,max:.3,step:.01,default:.08,label:"Jitter"},pairs:{type:"range",min:0,max:1,step:.05,default:.75,label:"S-pairs"},hand:{type:"enum",options:["alternate","random","left","right"],default:"alternate",label:"Handedness"},eyes:{type:"range",min:0,max:1,step:.05,default:0,label:"Eyed centres"},echo:{type:"range",min:0,max:3,step:1,default:0,label:"Contour echoes"},follow:{type:"range",min:0,max:1,step:.05,default:1,label:"Follow contours"},mode:{type:"enum",options:["sunk","thread"],default:"sunk",label:"Mode"},depth:{type:"range",min:.1,max:1.2,step:.05,default:.45,label:"Depth",unit:"mm"},demo:{type:"enum",options:["none","blobs"],default:"none",label:"Dummy motif"},secondary:{type:"bool",default:!1,label:"Fill plateau tops"}},Xv={fine:{pitch:1,depth:.35},standard:{},monumental:{pitch:2.4,depth:.9,jitter:.1},"thread-relief":{mode:"thread",depth:.35,pitch:1.4,line:.42},cloud:{roundness:.85,pitch:1.3,pairs:.9},leftover:{demo:"blobs",pitch:1.1,echo:1,secondary:!0}};function Yv(n){const t=n.cellMin*n.pitch;return{pitch:n.pitch,line:n.line,cell:[t,Math.max(t,n.cellMax*n.pitch)],roundness:n.roundness,jitter:n.jitter,pairs:n.pairs,hand:n.hand,eyes:n.eyes,echo:n.echo,follow:n.follow,mode:n.mode,depth:n.depth}}function $v(n){const t=s=>n.x+s*n.w,e=s=>n.y+s*n.h,i=Math.min(n.w,n.h);return s=>{const o=.075*i;s.save(),s.lineWidth=o,s.lineCap="round",s.lineJoin="round",s.beginPath();const a=.06*i;s.moveTo(t(.36),e(.78)),s.arcTo(t(.1),e(.78),t(.1),e(.5),a),s.arcTo(t(.1),e(.3),t(.3),e(.3),a),s.lineTo(t(.3),e(.3)),s.lineTo(t(.3),e(.48)),s.stroke(),s.restore(),s.beginPath(),s.ellipse(t(.56),e(.62),.13*n.w,.12*n.h,-.25,0,Math.PI*2),s.fill(),s.beginPath(),s.moveTo(t(.74),e(.08)),s.lineTo(t(.94),e(.08)),s.lineTo(t(.86),e(.6)),s.closePath(),s.fill(),s.beginPath(),s.arc(t(.48),e(.2),.07*i,0,Math.PI*2),s.fill()}}function Kv(n,t,e){const i=Yv(e);if(e.demo==="blobs"){const s=$v(t),o=Math.max(1.2,e.pitch*1.3);n.raise(s,{height:o,shoulder:.45}),n.fillGround(i,{rect:t,avoid:"raised",margin:e.pitch*.5}),e.secondary&&Yr(n,s,{...i,echo:1,eyes:0,mode:"sunk",depth:Math.min(e.depth,.4)},{margin:e.pitch*.5,level:o});return}n.fillGround(i,{rect:t,avoid:"raised",margin:e.pitch*.5})}const Zv={name:"leiwen",label:"Leiwen ground",schema:qv,presets:Xv,draw:Kv,symmetric:!1,ground:!1,plaque:{w:120,h:80}},Kh=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),Di=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),Jv={lattice:Kh(["diagonal","square"],"diagonal","Lattice"),size:Di(3,30,.5,9,"Cell width","mm"),aspect:Di(.5,2,.05,1,"Cell height : width"),fill:Kh(["nested","squared","spiral","dot","plain"],"nested","Cell fill"),pitch:Di(.5,2.5,.05,.9,"Ring pitch","mm"),line:Di(.3,.7,.02,.48,"Groove : pitch"),depth:Di(.1,1,.05,.4,"Depth","mm"),levels:Di(0,3,1,2,"Halvings at the motif"),clip:{type:"bool",default:!0,label:"Cut off at the motif"},outline:{type:"bool",default:!0,label:"Lattice lines"},demo:{type:"bool",default:!0,label:"Dummy motif"},seed:Di(0,99,1,0,"Seed")},Qv={"met-gui-nested":{size:19,pitch:1,levels:1,fill:"nested"},"lozenge-spiral":{size:9,aspect:.78,fill:"spiral",pitch:.9,levels:0},"lozenge-dot":{size:7,aspect:.8,fill:"dot",pitch:.9,levels:1},"lozenge-nested-fine":{size:8,fill:"nested",pitch:.7,levels:1},"square-squared":{lattice:"square",size:9,fill:"squared",pitch:.75},"square-nested":{lattice:"square",size:10,fill:"nested",pitch:.7,levels:1}};function tx(n,t,e){if(e.demo){const i=Math.min(t.w/60,t.h/30),o=kn((a=>a.map(([r,c])=>[t.x+r*i,t.y+c*i]))([[4,4],[4,20],[30,20],[30,12],[18,12]]),{width:6*i,round:.5,inner:.15,end:"spiral",spiral:{turns:1,dir:1}});ws(n,[o],{height:1.2,contour:{inset:.8,line:.45},fill:{kind:"lines",pitch:1.1,line:.42}})}Zc(n,{rect:t,margin:.6},{lattice:e.lattice,size:[e.size,e.size*e.aspect],fill:e.fill,pitch:e.pitch,line:e.line,depth:e.depth,levels:e.levels,clip:e.clip,outline:e.outline,seed:e.seed})}const ex={name:"lozenge",label:"Lattice ground (lozenge / 回)",schema:Jv,presets:Qv,draw:tx,symmetric:!1,ground:!1,plaque:{w:60,h:30}},nx=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),Kn=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),ix={w:Kn(3,40,.1,14.4,"Width","mm"),h:Kn(3,40,.1,13.5,"Height","mm"),round:Kn(0,1,.01,.42,"Roundness (1 = ellipse)"),height:Kn(.5,8,.1,2.4,"Relief","mm"),crown:Kn(0,1,.05,.9,"Crown (0 flat top … 1 domed)"),slit:{type:"bool",default:!0,label:"Slit pupil"},slitLen:Kn(.1,.8,.01,.33,"Slit length (× width)"),slitWidth:Kn(.3,3,.05,.95,"Slit width","mm"),slitY:Kn(-.3,.3,.01,-.07,"Slit offset (× height)"),ring:{type:"bool",default:!1,label:"Sunk ring"},ground:nx(["leiwen-big","leiwen","none"],"leiwen-big","Ground"),pitch:Kn(.5,2,.01,.72,"Ground pitch","mm")},sx={"met-fangyi":{},"met-fangyi-kui":{w:5.6,h:5,round:.5,height:1.5,slitLen:.45,slitWidth:.6,slitY:0,pitch:.6},"met-gui":{w:15,h:11,round:.75,crown:1,slitLen:.22,slitWidth:.9,slitY:0},"met-fangding":{w:16,h:11,round:.55,crown:.75,slitLen:.28,slitWidth:.8,slitY:0,pitch:.9},ringed:{w:12,h:10,round:.6,ring:!0,slitLen:.3}};function ox(n,t,e){const i=[t.x+t.w/2,t.y+t.h/2];Ir(n,{c:i,w:e.w,h:e.h,round:e.round,height:e.height,crown:e.crown,slit:e.slit?{len:e.w*e.slitLen,width:e.slitWidth,depth:Math.min(.9,e.height*.3),offset:[-e.w*.035,e.h*e.slitY]}:!1,ring:e.ring?{gap:.9,line:.45,depth:.35}:!1}),e.ground==="leiwen-big"?Si(n,{rect:t,margin:.5},{pitch:e.pitch,depth:.3,line:.5,cell:[6,11],pairs:0,maxAspect:1.35,jitter:.05}):e.ground==="leiwen"&&Si(n,{rect:t,margin:.5},{pitch:e.pitch,depth:.3})}const rx={name:"pillow",label:"Pillow eye boss",schema:ix,presets:sx,draw:ox,symmetric:!1,ground:!1,plaque:{w:34,h:30}},Zh=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),ms=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),ax={unit:Zh(["met-fangyi-horn","met-fangyi-eye","shapes","fills","met-fangding-band"],"met-fangyi-horn","Traced unit"),height:ms(.4,3,.05,1.2,"Plateau height","mm"),depth:ms(.1,.8,.02,.32,"Groove depth","mm"),line:ms(.25,.9,.01,.5,"Line width","mm"),ground:Zh(["leiwen-big","leiwen","lozenge","none"],"leiwen-big","Ground"),pitch:ms(.5,2,.01,.72,"Ground pitch","mm"),irregularity:ms(0,2,.1,1,"Hand irregularity"),seed:ms(0,99,1,0,"Seed")},cx={"met-fangyi-horn":{unit:"met-fangyi-horn"},"met-fangyi-eye":{unit:"met-fangyi-eye",height:2.4},shapes:{unit:"shapes",ground:"leiwen",pitch:.8},fills:{unit:"fills",ground:"none"},"met-fangding-band":{unit:"met-fangding-band",ground:"leiwen",pitch:.9,height:1.6,line:.6}},lx={"met-fangyi-horn":{w:46,h:36},"met-fangyi-eye":{w:34,h:30},shapes:{w:132,h:44},fills:{w:132,h:52},"met-fangding-band":{w:70,h:40}},hx={band:{ctrl:[[50.4,57.6],[50.4,77],[50.4,83.05],[17,83.05],[17,77],[17,62.8],[22.6,62.8]],width:[9.4,9.4,11.1,10.4,9.6,6.4,6.4],round:.5,inner:.18,start:"blunt",end:"flat",capRound:.3,contour:{inset:[.6,[1.4,1.4,2.5,2.5,1.8,1.6,1.6]],line:.5},ticks:{side:"right",pitch:4.2,line:.42},fill:{kind:"spirals",line:.5,pitch:.95,gap:.3,square:.3,tail:!1,min:3.6}},block:{c:[30.6,69.8],w:16,h:18.6,r:6,contour:!1,fill:{kind:"coil",pitch:1.35,line:.45,offset:[-1.2,1.4]}},origin:[10,56]},ux={c:[45.1,36.5],w:14.4,h:13.5,round:.42,height:2.4,crown:.9,slit:{len:4.8,width:.95,depth:.7,offset:[-.5,-.9]},origin:[30,22]},mi=(n,t,e)=>n.map(([i,s])=>[i+t,s+e]);function fx(n,t,e){const i=e,s=i.line,o={height:i.height,depth:i.depth,irregularity:i.irregularity,seed:i.seed};let a=.5;switch(i.unit){case"met-fangyi-horn":{const r=hx,c=t.x-r.origin[0],l=t.y-r.origin[1],h=r.band,u=kn(mi(h.ctrl,c,l),{...h,contour:{...h.contour,line:s},fill:{...h.fill,line:s}}),f=xc({...r.block,c:[r.block.c[0]+c,r.block.c[1]+l]});ws(n,[u,f],o);break}case"met-fangyi-eye":{const r=ux;Ir(n,{...r,height:i.height,c:[r.c[0]+t.x-r.origin[0],r.c[1]+t.y-r.origin[1]]});break}case"shapes":{const r=t.x,c=t.y,l={contour:{inset:.9,line:s},fill:{kind:"spirals",line:s*.9,pitch:.95,square:.25,tail:!1,min:2.6}},h=[kn(mi([[20,8],[4,8],[4,36],[20,36]],r,c),{width:[6,8,8,6],round:.6,inner:.2,start:"blunt",end:"blunt",...l}),kn(mi([[44,36],[28,36],[28,8],[46,8],[46,20],[38,20]],r,c),{width:[6,8,8,7,6,5],round:.6,inner:.2,start:"blunt",end:"round",...l}),kn(mi([[58,33],[66,33],[78,11],[86,11]],r,c),{width:[5,7,7,5],round:.8,inner:.3,start:"spiral",end:"spiral",spiral:{turns:.6,dir:1,gap:.7},startSpiral:{turns:.6,dir:-1,gap:.7},contour:{inset:.8,line:s},fill:{kind:"lines",line:s*.9,pitch:1.2}}),kn(mi([[96,38],[96,10],[106,6],[110,14]],r,c),{width:[5,6,5,3],round:.9,inner:.4,start:"blunt",end:"round",contour:{inset:.8,line:s}}),kn(mi([[116,6],[116,28],[128,34],[128,24]],r,c),{width:[6,6,4.5,1],round:.7,inner:.3,start:"blunt",end:"point",contour:{inset:.8,line:s}})];ws(n,h,o);break}case"fills":{const r=t.x,c=t.y,h=[{contour:{inset:.9,line:s},fill:null},{contour:{inset:[2.2,.7],line:s},ticks:{side:"left",pitch:2.6,line:s*.85},fill:{kind:"spirals",line:s,pitch:.95,square:.3,tail:!1,min:3}},{contour:{inset:.8,line:s},fill:{kind:"lines",line:s*.9,pitch:1.25}},{contour:{inset:.8,line:s},fill:{kind:"scales",line:s*.85,pitch:2.4}},{contour:{inset:.8,line:s},fill:{kind:"leiwen",pitch:.8,line:.45}}].map((u,f)=>kn(mi([[f*26+22,6],[f*26+4,6],[f*26+4,46],[f*26+22,46]],r,c),{width:9,round:.55,inner:.15,start:"blunt",end:"blunt",...u}));ws(n,h,o);break}case"met-fangding-band":{const r=t.x,c=t.y,l=kn(mi([[7,8],[7,31],[40,31],[53,24],[53,17]],r,c),{width:[9,11,10,9.5,8.5],round:[.5,.7,.9,.9,.5],inner:.25,start:"blunt",end:"spiral",spiral:{turns:.75,dir:-1,gap:.9},contour:{inset:1.1,line:s}}),h=xc({c:[r+26,c+16],w:14,h:10,r:4,contour:{inset:1,line:s}});ws(n,[l,h],o),Ir(n,{c:[r+26,c+16],w:8.5,h:6.4,round:.55,height:i.height*1.6,base:"field",crown:.8,slit:{len:3,width:.7,depth:.5}}),a=.6;break}}i.ground==="leiwen-big"?Si(n,{rect:t,margin:a},{pitch:i.pitch,depth:.3,line:.5,cell:[6,11],pairs:0,maxAspect:1.35,jitter:.05,seed:i.seed}):i.ground==="leiwen"?Si(n,{rect:t,margin:a},{pitch:i.pitch,depth:.3,seed:i.seed}):i.ground==="lozenge"&&Zc(n,{rect:t,margin:a},{size:9,fill:"nested",pitch:i.pitch*1.2,seed:i.seed})}const dx={name:"rounded",label:"Rounded bands (traced)",schema:ax,presets:cx,presetPlaques:lx,draw:fx,symmetric:!1,ground:!1,plaque:{w:46,h:36}},px={scale:Gt(2,8,.1,3.6,"Scale width","mm"),open:Yt(["down","up"],"down","Scales open"),body:{type:"bool",default:!0,label:"Raised body band"},...Pn({motif:1.2,boss:2,groove:.38,lineWeight:.45,carving:"none"})},mx={standard:{},fine:{scale:2.6},"handle-band":{scale:3,open:"up"}};function gx(n,t,e){const i=bn(e),o=i.style==="flush"?.12:i.relief.motif;i.body&&n.raise(l=>{l.beginPath(),l.rect(t.x,t.y,t.w,t.h),l.fill()},{height:o,shoulder:Math.min(.5,o*.4)});const a=i.scale,r=a*.62,c=i.open==="down"?1:-1;n.sink(l=>{l.save(),l.beginPath(),l.rect(t.x+.6,t.y+.6,t.w-1.2,t.h-1.2),l.clip(),l.lineWidth=i.lineWeight,l.lineCap="round";const h=Math.ceil(t.h/r)+1;for(let u=0;u<h;u++){const f=t.y+u*r,p=u%2*a/2;for(let _=t.x-a+p;_<t.x+t.w+a;_+=a)l.beginPath(),l.arc(_+a/2,f,a/2-i.lineWeight*.3,c>0?Math.PI:0,c>0?2*Math.PI:Math.PI),l.stroke()}l.restore()},{depth:i.relief.groove,shoulder:i.lineWeight/2,profile:"u"})}const _x={name:"scales",label:"Scale band",schema:px,presets:mx,draw:gx,symmetric:!1,ground:!1,plaque:{w:120,h:24}},Mx={facing:Yt(["right","left"],"right","Facing"),segments:Gt(3,9,1,6,"Segments"),bend:Gt(-.25,.25,.01,.1,"Bend"),girth:Gt(.35,.7,.01,.5,"Girth (× H)"),...Pn({motif:1.2,boss:2,groove:.38,lineWeight:.5,echoInset:.8,carving:"none"})},yx={standard:{},straight:{bend:0,segments:7},flush:{style:"flush",relief:{motif:.35,boss:1,groove:.35}}};function vx(n,t,e){const i=bn(e),s=zn(t,{flip:i.facing==="left"}),o=new Bn(s,{rng:Hn("silkworm",t,i),wobble:.003*i.irregularity}),a=s.A,r=i.girth,c=r*.55,l=r*.5+.04,h=a-c*2-.02,u=g=>.5-i.bend*Math.sin(Math.PI*g)+i.bend*.5,f=[];for(let g=0;g<=60;g++){const d=g/60;f.push([l+(h-l)*d,u(d)])}o.taper(f,r*.75,r,0);const p=[a-c-.02,u(1)+.02];o.circle(p,c),o.boss([p[0]+c*.25,p[1]+c*.35],c*.22,{kind:"round",pupil:"none",base:"plateau"}),o.boss([p[0]+c*.25,p[1]-c*.35],c*.22,{kind:"round",pupil:"none",base:"plateau"});const _=i.segments|0;for(let g=1;g<=_;g++){const d=g/(_+1),m=l+(h-l)*d,y=r*(.75+.25*d)/2*.9;o.line([[m-.03,u(d)+y],[m+.03,u(d)],[m-.03,u(d)-y]])}return o.line([[p[0]-c*.95,p[1]+c*.7],[p[0]-c*.95,p[1]-c*.7]]),ri(n,o,i,{clip:Ei(t)}),o}const xx={name:"silkworm",label:"Silkworm",schema:Mx,presets:yx,draw:vx,symmetric:!1,facing:!0,plaque:{w:60,h:18}},bx={form:Yt(["sinuous","coiled"],"sinuous","Form"),facing:Yt(["right","left"],"right","Facing"),waves:Gt(.5,3,.25,1.5,"Waves"),amplitude:Gt(.05,.3,.01,.18,"Amplitude (× H)"),bandWidth:Gt(.15,.4,.01,.26,"Body width (× H)"),marks:Yt(["c-hooks","scales","none"],"c-hooks","Body marks"),...Pn({motif:1.2,boss:2.2,groove:.36,lineWeight:.45,echoInset:.8,carving:"sparse"})},wx={sinuous:{},coiled:{form:"coiled",marks:"none"},flush:{style:"flush",relief:{motif:.35,boss:1.1,groove:.35}}},Sx={coiled:{w:50,h:50}};function Ex(n,t,e){const i=bn(e),s=zn(t,{flip:i.facing==="left"}),o=new Bn(s,{rng:Hn("snake",t,i),wobble:.003*i.irregularity}),a=i.bandWidth;let r,c,l;if(i.form==="coiled"){const d=s.A/2,m=new we(d+.44,.5,90,.006).curl(560,.44,.55,1);r=m.pts,c=m.at,l=m.h}else{r=[];const d=.08,m=s.A-.42;for(let y=0;y<=120;y++){const M=y/120;r.push([d+(m-d)*M,.5+i.amplitude*Math.sin(M*i.waves*Math.PI*2)*Math.min(1,M*4)])}c=r[r.length-1],l=0}o.taper(r,a*.3,a,0);const h=l*Math.PI/180,u=Math.cos(h),f=Math.sin(h),p=.34,_=.24,g=(d,m)=>[c[0]+u*d-f*m,c[1]+f*d+u*m];o.poly([g(-.04,_*.55),g(p*.55,_),g(p,_*.25),g(p*1.06,0),g(p,-_*.25),g(p*.55,-_),g(-.04,-_*.55)]);for(const d of[1,-1])o.boss(g(p*.5,d*_*.55),.06,{kind:"round",pupil:"none",base:"plateau"});if(i.marks!=="none"&&i.form==="sinuous")for(let d=8;d<r.length-10;d+=9){const[m,y]=r[d],M=a*.24,v=[];if(i.marks==="c-hooks")for(let x=0;x<=10;x++){const b=Math.PI*(.35+1.3*x/10);v.push([m+Math.cos(b)*M,y+Math.sin(b)*M])}else for(let x=0;x<=10;x++){const b=Math.PI*(1+x/10);v.push([m+Math.cos(b)*M,y+M*.6+Math.sin(b)*M])}o.line(v)}return ri(n,o,i,{clip:Ei(t)}),o}const Tx={name:"snake",label:"Snake",schema:bx,presets:wx,presetPlaques:Sx,draw:Ex,symmetric:!1,facing:!0,plaque:{w:110,h:24}},Ax={kind:Yt(["whorl","petal"],"whorl","Kind (火纹 / 四瓣目纹)"),spokes:Gt(3,7,1,5,"Spokes"),turn:Yt(["ccw","cw"],"ccw","Sweep"),sweep:Gt(40,110,5,75,"Spoke sweep","°"),size:Gt(.5,1,.01,.92,"Diameter (of rect)"),centre:Yt(["circle","boss","ring"],"circle","Centre"),dome:Gt(0,1,.05,.6,"Doming"),...Pn({motif:1.6,boss:2.6,groove:.5,lineWeight:.6,echoInset:.9,carving:"none"})},Rx={"five-spokes":{},"four-spokes":{spokes:4,sweep:85},"six-spokes":{spokes:6,sweep:65},"post-cap":{spokes:6,size:.98,centre:"boss",dome:.9,relief:{motif:3,boss:4.5,groove:.6}},petal:{kind:"petal",carving:"sparse"},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.4}}};function Px(n,t,e,i,s,o,a,r,c=40){const l=[],h=[];for(let f=0;f<=c;f++){const p=f/c,_=e+(i-e)*p,g=s+o*p,d=(a+(r-a)*Math.pow(p,.8))/2,m=Math.cos(g),y=Math.sin(g),M=-Math.sin(g)*Math.sign(o),v=Math.cos(g)*Math.sign(o),x=(m*.35+M)*d,b=(y*.35+v)*d;l.push([n+m*_+x,t+y*_+b]),h.push([n+m*_-x,t+y*_-b])}const u=[];for(let f=1;f<8;f++){const p=s+Math.PI/2+f/8*Math.PI;u.push([n+Math.cos(s)*e+Math.cos(p)*a*.5*Math.sign(o),t+Math.sin(s)*e+Math.sin(p)*a*.5*Math.sign(o)])}return l.concat(h.reverse(),u)}function Lx(n,t,e){const i=bn(e),s=t.x+t.w/2,o=t.y+t.h/2,a=Math.min(t.w,t.h)/2*i.size,r=i.style==="flush",c=i.relief,l=i.lineWeight;if(i.kind==="petal")return Cx(n,t,i,s,o,a);const h=r?.12:c.motif,u=r?0:i.dome,f=Math.max(.3,Math.min(.7,h*.4));n.raise(M=>{M.beginPath(),M.arc(s,o,a,0,Math.PI*2),M.fill()},{height:h*(1+u*.5),shoulder:a,profile:(M,v)=>Ns.plateau(M,f)*(1-u*.33+u*.33*Math.sqrt(Math.max(0,1-(1-M/v)**2)))}),r&&n.sink(M=>{M.beginPath(),M.arc(s,o,a-l,0,Math.PI*2),M.lineWidth=l,M.stroke()},{depth:c.groove,shoulder:l/2});const p=i.spokes|0,_=i.turn==="cw"?-1:1,g=a*.24,m=Hn("whorl",t,i).range(0,Math.PI*2),y=Math.min(a*.24,2*Math.PI*a/p*.17);n.sink(M=>{for(let v=0;v<p;v++){const x=m+v/p*Math.PI*2,b=Px(s,o,g+l*1.4,a-Math.max(.5,l*.9),x,_*(i.sweep*Math.PI)/180,l*1.3,y);M.beginPath(),b.forEach((w,L)=>L?M.lineTo(w[0],w[1]):M.moveTo(w[0],w[1])),M.closePath(),M.fill()}},{depth:c.groove*1.2,shoulder:l*.6,profile:"u"}),i.centre==="boss"&&n.raise(M=>{M.beginPath(),M.arc(s,o,g*.85,0,Math.PI*2),M.fill()},{height:Math.max(c.boss,h*1.6),profile:"dome"}),n.sink(M=>{M.beginPath(),M.arc(s,o,g,0,Math.PI*2),M.lineWidth=l,M.stroke()},{depth:c.groove,shoulder:l/2}),i.centre==="ring"&&n.sink(M=>{M.beginPath(),M.arc(s,o,g*.45,0,Math.PI*2),M.fill()},{depth:c.groove*.8,shoulder:l/2})}function Cx(n,t,e,i,s,o){const a=o*2,r=zn({x:i-o,y:s-o,w:a,h:a}),c=new Bn(r,{rng:Hn("petal",t,e),wobble:.003*e.irregularity}),l=.12,h=new we(.5,l/2,0,.006).fd(.5-l/2-.08).arc(90,.08).fd(1-l-.16).arc(90,.08).fd(1-l-.16).arc(90,.08).fd(1-l-.16).arc(90,.08).fd(.5-l/2-.08);c.band(h.pts,l);for(let u=0;u<4;u++){const f=45+u*90,p=f*Math.PI/180,_=new we(.5+Math.cos(p)*.2,.5+Math.sin(p)*.2,f,.006).fd(.1).arc(90,.07).fd(.03).arc(90,.045);c.taper(_.pts,l*1.1,l*.7,.4)}c.circle([.5,.5],.17),c.boss([.5,.5],.12,{kind:"round",pupil:"dot",base:"plateau"}),ri(n,c,e,{clip:Ei(t)})}const kx={name:"whorl",label:"Whorl circle",schema:Ax,presets:Rx,draw:Lx,symmetric:!1,plaque:{w:60,h:60},groundOptions:(n,t)=>({pitch:Math.max(.8,Math.min(2,Math.min(t.w,t.h)*.045))})},Dx=Object.freeze(Object.defineProperty({__proto__:null,bands:Ky,bird:nv,blade:_v,boss:wv,cicada:cv,eyeband:Av,frieze:Ov,kui:jv,leiwen:Zv,lozenge:ex,pillow:rx,rounded:dx,scales:_x,silkworm:xx,snake:Tx,taotie:Gy,whorl:kx},Symbol.toStringTag,{value:"Module"})),Bs={};function _d(n){if(!n||!n.name||typeof n.draw!="function")throw new Error("registerMotif: needs { name, draw }");return Bs[n.name]=n,n}function Gs(n){if(typeof n=="object")return n;const t=Bs[n];if(!t)throw new Error(`unknown motif "${n}" (have: ${Object.keys(Bs).join(", ")})`);return t}function To(n,t={},e){var a;const i=Gs(n),s=Qc(i.schema),o=e?((a=i.presets)==null?void 0:a[e])??{}:{};return Ac(Ac(s,o),t)}function Ac(n,t){const e={...n};for(const[i,s]of Object.entries(t||{}))e[i]=s&&typeof s=="object"&&!Array.isArray(s)&&n[i]&&typeof n[i]=="object"?Ac(n[i],s):s;return e}for(const n of Object.values(Dx))_d(n);const gi={pos:new X,nrm:new X},Ii=[0,0,1];function oe({surface:n,segments:t={density:1},relief:e=null,reliefRect:i={u0:0,v0:0,u1:1,v1:1},back:s=null,fade:o=1.5,normals:a="surface",maxVerts:r=4e5,reliefScale:c=1,panelMap:l=null,samples:h=null}){const u=Jh(n,!0),f=Jh(n,!1);let p,_;if(h!=null&&h.u&&(h!=null&&h.v))p=h.u.length-1,_=h.v.length-1,r=1/0;else if(Array.isArray(t))[p,_]=t;else{const it=t.density??1;p=Math.max(1,Math.ceil(u*it)),_=Math.max(1,Math.ceil(f*it))}const g=s?r/2:r;if((p+1)*(_+1)>g){const it=Math.sqrt(g/((p+1)*(_+1)));p=Math.max(1,Math.floor(p*it)),_=Math.max(1,Math.floor(_*it))}const d=p+1,m=d*(_+1),y=Math.max(u/p,f/_),M=h!=null&&h.u&&(h!=null&&h.v)?h.u:null,v=h!=null&&h.u&&(h!=null&&h.v)?h.v:null,x=it=>M?M[it]:it/p,b=it=>v?v[it]:it/_,w=new Float32Array(m*3),L=new Float32Array(m*3);for(let it=0;it<=_;it++)for(let ot=0;ot<=p;ot++){const ct=(it*d+ot)*3;gi.nrm.set(0,0,0),n(x(ot),b(it),gi),w[ct]=gi.pos.x,w[ct+1]=gi.pos.y,w[ct+2]=gi.pos.z,L[ct]=gi.nrm.x,L[ct+1]=gi.nrm.y,L[ct+2]=gi.nrm.z}const S=new Float32Array(m*3),T=new Float32Array(m*3);Qh(w,p,_,S,T);for(let it=0;it<m;it++){const ot=it*3;if(L[ot]*L[ot]+L[ot+1]*L[ot+1]+L[ot+2]*L[ot+2]<1e-12){const ct=no(S[ot],S[ot+1],S[ot+2],T[ot],T[ot+1],T[ot+2]);Ha(ct),L[ot]=ct[0],L[ot+1]=ct[1],L[ot+2]=ct[2]}}const C=new Float32Array(m*3),R=new Float32Array(m*2),O=i,A=typeof o=="number"?{u0:o,u1:o,v0:o,v1:o}:{u0:0,u1:0,v0:0,v1:0,...o},D=e?e.macro(y):null;for(let it=0;it<=_;it++)for(let ot=0;ot<=p;ot++){const ct=it*d+ot,K=ct*3,F=x(ot),B=b(it);let W=(F-O.u0)/(O.u1-O.u0),et=(B-O.v0)/(O.v1-O.v0),st=1;l&&(Ii[0]=W,Ii[1]=et,Ii[2]=1,l(F,B,Ii),W=Ii[0],et=Ii[1],st=Ii[2]),R[ct*2]=e?W:F,R[ct*2+1]=e?et:B;let mt=0;if(D&&W>=0&&W<=1&&et>=0&&et<=1){const ut=e.widthMM,E=e.heightMM,P=Math.min(ur(W*ut,A.u0),ur((1-W)*ut,A.u1)),tt=Math.min(ur(et*E,A.v0),ur((1-et)*E,A.v1));mt=D.sample(W,et)*P*tt*st*c}C[K]=w[K]+L[K]*mt,C[K+1]=w[K+1]+L[K+1]*mt,C[K+2]=w[K+2]+L[K+2]*mt}let k=L;if(a==="displaced"&&D){const it=new Float32Array(m*3),ot=new Float32Array(m*3);Qh(C,p,_,it,ot),k=new Float32Array(m*3);for(let ct=0;ct<m;ct++){const K=ct*3,F=no(it[K],it[K+1],it[K+2],ot[K],ot[K+1],ot[K+2]);Ha(F);const B=F[0]*L[K]+F[1]*L[K+1]+F[2]*L[K+2]<0?-1:1;k[K]=F[0]*B,k[K+1]=F[1]*B,k[K+2]=F[2]*B}}const I=new Float32Array(m*4);for(let it=0;it<m;it++){const ot=it*3;let ct=S[ot],K=S[ot+1],F=S[ot+2];const B=k[ot],W=k[ot+1],et=k[ot+2],st=ct*B+K*W+F*et;ct-=B*st,K-=W*st,F-=et*st;const mt=Math.hypot(ct,K,F)||1;ct/=mt,K/=mt,F/=mt;const ut=no(B,W,et,ct,K,F),E=ut[0]*T[ot]+ut[1]*T[ot+1]+ut[2]*T[ot+2]<0?-1:1;I[it*4]=ct,I[it*4+1]=K,I[it*4+2]=F,I[it*4+3]=E}const N=((_>>1)*d+(p>>1))*3,z=no(S[N],S[N+1],S[N+2],T[N],T[N+1],T[N+2]),q=z[0]*L[N]+z[1]*L[N+1]+z[2]*L[N+2]>=0,Z=[];for(let it=0;it<_;it++)for(let ot=0;ot<p;ot++){const ct=it*d+ot,K=ct+1,F=ct+d+1,B=ct+d;q?Z.push(ct,K,F,ct,F,B):Z.push(ct,F,K,ct,B,F)}const Q=[C],U=[k],Y=[R],G=[I];let $=m;if(s&&s.thickness>0){const it=s.thickness,ot=new Float32Array(m*3),ct=new Float32Array(m*3),K=new Float32Array(m*2).fill(-1),F=new Float32Array(m*4);for(let W=0;W<m;W++){const et=W*3;ot[et]=w[et]-L[et]*it,ot[et+1]=w[et+1]-L[et+1]*it,ot[et+2]=w[et+2]-L[et+2]*it,ct[et]=-L[et],ct[et+1]=-L[et+1],ct[et+2]=-L[et+2],F[W*4]=I[W*4],F[W*4+1]=I[W*4+1],F[W*4+2]=I[W*4+2],F[W*4+3]=-I[W*4+3]}for(let W=0;W<_;W++)for(let et=0;et<p;et++){const st=$+W*d+et,mt=st+1,ut=st+d+1,E=st+d;q?Z.push(st,ut,mt,st,E,ut):Z.push(st,mt,ut,st,ut,E)}Q.push(ot),U.push(ct),Y.push(K),G.push(F),$+=m;const B=s.rims??["u0","u1","v0","v1"];for(const W of B){const et=[];if(W==="v0")for(let at=0;at<=p;at++)et.push(at);if(W==="v1")for(let at=0;at<=p;at++)et.push(_*d+at);if(W==="u0")for(let at=0;at<=_;at++)et.push(at*d);if(W==="u1")for(let at=0;at<=_;at++)et.push(at*d+p);const st=W[0]==="u"?S:T,mt=W[1]==="0"?-1:1,ut=et.length,E=new Float32Array(ut*2*3),P=new Float32Array(ut*2*3),tt=new Float32Array(ut*2*2).fill(-1),dt=new Float32Array(ut*2*4);for(let at=0;at<ut;at++){const gt=et[at]*3,vt=[st[gt]*mt,st[gt+1]*mt,st[gt+2]*mt];Ha(vt);for(let xt=0;xt<2;xt++){const wt=xt===0?C:ot,St=(at*2+xt)*3;E[St]=wt[gt],E[St+1]=wt[gt+1],E[St+2]=wt[gt+2],P[St]=vt[0],P[St+1]=vt[1],P[St+2]=vt[2];const ft=(at*2+xt)*4;dt[ft]=L[gt],dt[ft+1]=L[gt+1],dt[ft+2]=L[gt+2],dt[ft+3]=1}}for(let at=0;at<ut-1;at++){const pt=$+at*2,gt=pt+1,vt=pt+3,xt=pt+2,wt=at*2*3,St=(at*2+1)*3,ft=(at*2+2)*3,At=no(E[St]-E[wt],E[St+1]-E[wt+1],E[St+2]-E[wt+2],E[ft]-E[wt],E[ft+1]-E[wt+1],E[ft+2]-E[wt+2]);At[0]*P[wt]+At[1]*P[wt+1]+At[2]*P[wt+2]>=0?Z.push(pt,gt,vt,pt,vt,xt):Z.push(pt,vt,gt,pt,xt,vt)}Q.push(E),U.push(P),Y.push(tt),G.push(dt),$+=ut*2}}const J=new Ge;return J.setAttribute("position",new _e(fr(Q),3)),J.setAttribute("normal",new _e(fr(U),3)),J.setAttribute("uv",new _e(fr(Y),2)),J.setAttribute("tangent",new _e(fr(G),4)),J.setIndex($>65535?new Co(Z,1):new Lo(Z,1)),J.computeBoundingBox(),J.computeBoundingSphere(),J.userData={nu:p,nv:_,spacing:y,lenU:u,lenV:f},J}function Ix(n,t,e,i){const s=hr(n),o=hr(t),a=hr(e),r=hr(i);return(c,l,h)=>{h.pos.set((1-l)*((1-c)*s.x+c*o.x)+l*((1-c)*a.x+c*r.x),(1-l)*((1-c)*s.y+c*o.y)+l*((1-c)*a.y+c*r.y),(1-l)*((1-c)*s.z+c*o.z)+l*((1-c)*a.z+c*r.z))}}function hr(n){return Array.isArray(n)?new X(n[0],n[1],n[2]):n}function ur(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Jh(n,t){const e={pos:new X,nrm:new X};let i=0;for(const s of[0,.5,1]){let o=0,a=null;for(let r=0;r<=24;r++){const c=r/24;n(t?c:s,t?s:c,e),a&&(o+=a.distanceTo(e.pos)),a=e.pos.clone()}i=Math.max(i,o)}return Math.max(i,.001)}function Qh(n,t,e,i,s){const o=t+1;for(let a=0;a<=e;a++)for(let r=0;r<=t;r++){const c=(a*o+r)*3,l=Math.max(0,r-1),h=Math.min(t,r+1),u=Math.max(0,a-1),f=Math.min(e,a+1),p=(a*o+l)*3,_=(a*o+h)*3,g=(u*o+r)*3,d=(f*o+r)*3;for(let m=0;m<3;m++)i[c+m]=n[_+m]-n[p+m],s[c+m]=n[d+m]-n[g+m]}}function no(n,t,e,i,s,o){return[t*o-e*s,e*i-n*o,n*s-t*i]}function Ha(n){const t=Math.hypot(n[0],n[1],n[2])||1;return n[0]/=t,n[1]/=t,n[2]/=t,n}function fr(n){const t=n.reduce((s,o)=>s+o.length,0),e=new Float32Array(t);let i=0;for(const s of n)e.set(s,i),i+=s.length;return e}function tu(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),o={},a={},r=n[0].morphTargetsRelative,c=new Ge;let l=0;for(let h=0;h<n.length;++h){const u=n[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!i.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.attributes[p]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(r!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[p]===void 0&&(a[p]=[]),a[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,h),l+=p}}if(e){let h=0;const u=[];for(let f=0;f<n.length;++f){const p=n[f].index;for(let _=0;_<p.count;++_)u.push(p.getX(_)+h);h+=n[f].attributes.position.count}c.setIndex(u)}for(const h in o){const u=eu(o[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const p=[];for(let g=0;g<a[h].length;++g)p.push(a[h][g][f]);const _=eu(p);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(_)}}return c}function eu(n){let t,e,i,s=-1,o=0;for(let l=0;l<n.length;++l){const h=n[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=h.array.length}const a=new t(o);let r=0;for(let l=0;l<n.length;++l)a.set(n[l].array,r),r+=n[l].array.length;const c=new _e(a,e,i);return s!==void 0&&(c.gpuType=s),c}const Ux=`
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
`,Nx=`
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
`,Fx=`
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
`,Ox=Ux+Nx+Fx,ii={age:{group:"master",label:"Time in the ground",min:0,max:1,step:.005,default:1},tin:{group:"Alloy",label:"Tin (Sn wt)",min:0,max:.3,step:.005,default:.14,hint:"F0 from the §1.2 table: copper-pink → warm gold (0.12) → pale gold → speculum"},lead:{group:"Alloy",label:"Lead (Pb wt)",min:0,max:.25,step:.005,default:.03,hint:"greys and dulls the metal"},polish:{group:"Alloy",label:"Polish",min:0,max:1,step:.01,default:.6,hint:"abraded fields / relief tops: roughness 0.40 → 0.12; recesses stay as-cast"},tarnish:{group:"Alloy",label:"Tarnish",min:0,max:1,step:.01,default:.5,hint:"thin oxide film: gold → brown-gold"},malachite:{group:"Carbonates & blue",key:!0,label:"Carbonate crust",min:0,max:1,step:.01,default:.6,hint:"how much of the surface the copper carbonates take"},carbonate:{group:"Carbonates & blue",key:!0,label:"Carbonate balance",min:0,max:1,step:.01,default:0,hint:"0 malachite green · 0.5 pale blue-green / turquoise phase · 1 azurite blue — by territory, never a teal blend"},azurite:{group:"Carbonates & blue",key:!0,label:"Azurite",min:0,max:.6,step:.01,default:.05,hint:"blue islands on top of / among the carbonates"},azuriteDepth:{group:"Carbonates & blue",label:"Depth of blue",min:0,max:1,step:.01,default:.5,hint:"pale powdery sky blue → deep crystalline ultramarine"},azuriteScale:{group:"Carbonates & blue",label:"Azurite patch",min:3,max:60,step:.5,default:14,unit:"mm"},blueHabitat:{group:"Carbonates & blue",label:"Blue lives in",min:0,max:1,step:.01,default:.5,hint:"0 recesses and grooves · 1 open crust patches"},turquoiseTone:{group:"Carbonates & blue",label:"Blue-green tone",min:0,max:1,step:.01,default:.3,hint:"the turquoise / chrysocolla-like phase: pale chalky → deep sea blue-green"},malachiteHue:{group:"Carbonates & blue",label:"Malachite hue",min:0,max:1,step:.01,default:.45,hint:"blue-green → yellow-green"},malachiteTone:{group:"Carbonates & blue",label:"Malachite tone",min:0,max:1,step:.01,default:.5,hint:"dark compact wet-looking → pale earthy crust"},islands:{group:"Carbonates & blue",label:"Film ↔ islands",min:0,max:1,step:.01,default:.6,hint:"0 thin translucent films that fade out · 1 sharp-edged crust islands"},malachiteScale:{group:"Carbonates & blue",label:"Crust grain",min:.5,max:8,step:.1,default:2,unit:"mm",hint:"botryoidal dome size"},crust:{group:"Carbonates & blue",label:"Crust thickness",min:0,max:4,step:.05,default:1,unit:"mm",hint:"thick crust fills the line work"},tinOxide:{group:"Other corrosion",label:"Noble patina",min:0,max:1,step:.01,default:.2,hint:"Type I tin-oxide skin territories (water patina): dark, smooth, keeps the cast surface"},tinOxideTone:{group:"Other corrosion",label:"Noble tone",min:0,max:2,step:.01,default:1,hint:"0 black 黑漆古 · 1 olive · 2 grey 水银古"},nobleRelief:{group:"Other corrosion",label:"Noble on raised décor",min:-1,max:1,step:.01,default:1,hint:"how much paler the noble skin is on raised décor than on the ground: 1 paler plateaus · 0 the field tone · −1 darker plateaus (Houmuwu: friezes read darker than the plain field)"},nobleWarmth:{group:"Other corrosion",label:"Noble warmth",min:0,max:1,step:.01,default:0,hint:"olive-green skin → warm grey-brown (a thin sheet with the cuprite glowing through)"},cuprite:{group:"Other corrosion",label:"Cuprite",min:0,max:1,step:.01,default:.7,hint:"red-brown Cu₂O on the metal, shows where the crust is thin or worn"},cupriteTone:{group:"Other corrosion",label:"Cuprite tone",min:0,max:1,step:.01,default:0,hint:"0 compact liver / oxblood · 1 pale powdery brick-pink, unveiled (cuprite blotches under a lime bloom, Houmuwu fields)"},chloride:{group:"Other corrosion",label:"Chloride",min:0,max:1,step:.01,default:.08,hint:"bronze disease: pale powdery pustules over pits"},soot:{group:"Other corrosion",label:"Soot",min:0,max:1,step:.01,default:0,hint:"tenorite/soot on the lower body and legs (fire)"},crevice:{group:"Other corrosion",label:"Crevice bias",min:0,max:1,step:.01,default:.7,hint:"how strongly crust prefers recesses"},patchScale:{group:"Other corrosion",label:"Territory size",min:20,max:200,step:1,default:70,unit:"mm"},mottleScale:{group:"Other corrosion",label:"Mottle size",min:3,max:40,step:.5,default:12,unit:"mm"},patchiness:{group:"Other corrosion",label:"Territories ↔ fine mottle",min:0,max:1,step:.01,default:1,hint:"1 broad territories and crust islands · 0 every layer breaks up at the mottle size instead (a fine speckled skin, no large blotches)"},softness:{group:"Other corrosion",label:"Soft mottle",min:0,max:1,step:.01,default:0,hint:"0 crisp layer edges · 1 every layer edge feathers into the next and the fine grain drops to a whisper: low-contrast blended mottle, no dots"},drift:{group:"Other corrosion",label:"Slow tone drift",min:0,max:1,step:.01,default:0,hint:"a slow drift of lightness and warmth across the skin at the territory size (50–200 mm)"},lowerBody:{group:"Other corrosion",label:"Lower body",min:0,max:1,step:.01,default:0,hint:"legs and foot below the lower-body height: darker and greener skin (Houmuwu legs)"},lowerHeight:{group:"Other corrosion",label:"Lower body height",min:0,max:1,step:.01,default:.35,hint:"fraction of the vessel height where the lower-body skin fades out"},lowerColor:{group:"Other corrosion",label:"Lower body tint",type:"color",default:"#a1bea3",hint:"multiplies the lower-body skin: green-grey darkens and greens it (Houmuwu legs), a warm tint gives a red-brown foot band (Met fangyi)"},plainTone:{group:"Other corrosion",label:"Plain parts tone",min:.2,max:1.5,step:.01,default:1,hint:"multiplies the skin on plain, undecorated surfaces (knob stem, neck band, plain fields): < 1 darker than the décor (Nezu)"},upperTone:{group:"Other corrosion",label:"Upper body tone",min:.4,max:1.4,step:.01,default:1,hint:"multiplies the skin above the upper-body height: < 1 a darker lid (fangyi) or trumpet (gu) than the body"},upperHeight:{group:"Other corrosion",label:"Upper body height",min:0,max:1,step:.01,default:.65,hint:"fraction of the vessel height where the upper-body tone starts"},rimCalm:{group:"Other corrosion",label:"Calm rim & handles",min:0,max:1,step:.01,default:0,hint:"the upper part of the vessel (above ~60 % of its height): plain parts (rim, handles) and up-facing faces lose the wall mottle: one worn skin; plain parts anywhere (flanges, legs) also lose the fine speckle"},speckle:{group:"Grain & crust",key:!0,label:"Fine speckle",min:0,max:1,step:.01,default:0,hint:"a dense mm-scale speckle of a second mineral interleaved with the skin (Houmuwu red cuprite, Met fangyi dark-green specks); amount ≈ area"},speckleScale:{group:"Grain & crust",label:"Speckle grain",min:.5,max:8,step:.1,default:2,unit:"mm"},speckleColor:{group:"Grain & crust",label:"Speckle colour",type:"color",default:"#8f5a48"},speckleDecor:{group:"Grain & crust",label:"Speckle avoids décor",min:0,max:1,step:.01,default:0,hint:"0 everywhere · 1 only on the plain fields, off the décor bands (Houmuwu: red panels, greyer friezes)"},crustIsles:{group:"Grain & crust",key:!0,label:"Crust islands",min:0,max:1,step:.01,default:0,hint:"hard-edged, ragged, fully matte islands of pale earthy crust (grey-green, buff); amount ≈ area where they live"},crustScale:{group:"Grain & crust",label:"Crust island size",min:2,max:30,step:.5,default:8,unit:"mm"},crustColor:{group:"Grain & crust",label:"Crust colour",type:"color",default:"#8b8e78"},crustPlace:{group:"Grain & crust",label:"Crust lives on",min:0,max:1,step:.01,default:.6,hint:"0 décor recesses and friezes · 1 arrises, plain bands, rim, flanges and the lower body"},pustules:{group:"Grain & crust",label:"Malachite pustules",min:0,max:1,step:.01,default:0,hint:"saturated emerald pustules (2–10 mm) in clusters, weighted to the rim lip, the foot and recesses"},pustuleScale:{group:"Grain & crust",label:"Pustule size",min:2,max:14,step:.5,default:5,unit:"mm"},pustuleColor:{group:"Grain & crust",label:"Pustule colour",type:"color",default:"#2e7658"},grain:{group:"Grain & crust",label:"Skin grain",min:0,max:1,step:.01,default:0,hint:"soft multi-scale breathing of lightness, hue and roughness at 2–10 mm on every surface (no dots): plain walls stop reading as dead-flat paint"},tint:{group:"Grain & crust",label:"Skin tint",type:"color",default:"#ffffff",hint:"multiplies the whole corroded skin: a last hue correction (white = none)"},matte:{group:"Surface",key:!0,label:"Matte (dry skin)",min:0,max:1,step:.01,default:0,hint:"micro-pitted, dusty excavated skin: no broad glossy highlights. 0 keeps each layer’s own sheen (as-cast, heirloom)"},dulling:{group:"Surface",label:"Dulling",min:0,max:1,step:.01,default:0,hint:"dust, old wax and fine soil in the pores grey every mineral colour down"},tops:{group:"Surface",key:!0,label:"Relief tops",min:0,max:1,step:.01,default:0,hint:"relief tops rubbed clean: darker, warmer, smoother skin — the décor reads"},topsTone:{group:"Surface",label:"Relief tops tone",min:0,max:1,step:.01,default:0,hint:"0 rubbed darker & warmer · 1 paler silvery-grey bands (flush décor read by colour: Met zun / gu, Houmuwu plateaus)"},earth:{group:"Surface",label:"Burial soil",min:0,max:1,step:.01,default:.3},earthColor:{group:"Surface",label:"Soil colour",type:"color",default:"#8f7048"},calcite:{group:"Surface",label:"Calcareous film",min:0,max:1,step:.01,default:.15,hint:"whitish lime dusting that pales the crust"},streaks:{group:"Surface",label:"Streaks & tide line",min:0,max:1,step:.01,default:0,hint:"runs of groundwater down the walls, one pale tide line"},burialSide:{group:"Surface",label:"Burial side",min:0,max:1,step:.01,default:.3,hint:"one side lay in the soil"},recessDirt:{group:"Surface",label:"Recess dirt",min:0,max:1,step:.01,default:.3},ledgeMatte:{group:"Surface",label:"Dusty ledges",min:0,max:1,step:.01,default:0,hint:"up-facing ledges and eaves hold dust: fully matte, no glossy sheen catching the lights (never brighter than the lit walls)"},interiorTone:{group:"Surface",label:"Interior skin",min:0,max:1,step:.01,default:.3,hint:"inside the vessel: dark grey-brown → pale green corroded skin"},wax:{group:"Surface",label:"Museum wax",min:0,max:1,step:.01,default:0},inlay:{group:"Surface",label:"Black inlay",min:0,max:1,step:.01,default:0,hint:"paste in the sunk lines (as made)"},inlayGround:{group:"Surface",label:"Inlay fills the ground",min:0,max:1,step:.01,default:0,hint:"the black paste fills the whole sunk ground of the décor, not only the lines: flush bands read light on black (Met zun)"},wear:{group:"Surface",key:!0,label:"Wear",min:0,max:1,step:.01,default:.2,hint:"erases from the top down on arrises"},seed:{group:"Surface",label:"Seed",min:0,max:99,step:1,default:7}},Ls={"as-cast":{age:1,tin:.14,lead:.03,polish:.65,tarnish:.12,cuprite:0,tinOxide:0,malachite:0,azurite:0,chloride:0,soot:0,earth:0,calcite:0,recessDirt:.15,wax:0,inlay:.85,wear:0,crust:0},"excavated-green":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.7,cuprite:.75,tinOxide:.75,tinOxideTone:.8,malachite:.45,carbonate:.15,azurite:.03,azuriteScale:10,blueHabitat:.3,turquoiseTone:.15,malachiteHue:.45,malachiteTone:.6,islands:.55,malachiteScale:2,crust:.6,chloride:.08,soot:.05,crevice:.85,patchScale:70,mottleScale:10,patchiness:.6,earth:.1,earthColor:"#7d6a50",calcite:.2,streaks:.35,burialSide:.3,recessDirt:.2,interiorTone:.3,wax:0,inlay:0,wear:.2,dulling:.5,tops:.45,nobleWarmth:.4,matte:.6},"malachite-crust":{age:1,tin:.14,lead:.03,polish:.4,tarnish:.6,cuprite:.9,tinOxide:0,tinOxideTone:1,malachite:.95,malachiteHue:.42,malachiteTone:.12,malachiteScale:1.6,crust:.9,islands:.8,azurite:.05,chloride:.03,soot:0,crevice:.6,patchScale:60,mottleScale:10,earth:.08,earthColor:"#6e5b42",calcite:0,burialSide:.2,recessDirt:.45,wax:.2,inlay:0,wear:.3,dulling:.3,tops:.3,matte:.4},"olive-museum":{age:1,tin:.14,lead:.05,polish:.5,tarnish:.8,cuprite:.45,tinOxide:.88,tinOxideTone:1.25,malachite:.35,malachiteHue:.4,malachiteTone:.55,malachiteScale:1.5,crust:.2,islands:.4,azurite:.02,chloride:.02,soot:0,crevice:.95,patchScale:80,mottleScale:9,patchiness:.5,earth:.1,earthColor:"#6b5a42",calcite:.12,burialSide:.1,recessDirt:.55,wax:.25,inlay:0,wear:.25,dulling:.25,tops:.2,streaks:.15,matte:.45,nobleWarmth:.3},"water-black":{age:1,tin:.16,lead:.02,polish:.5,tarnish:.9,cuprite:.7,tinOxide:.8,tinOxideTone:0,malachite:.08,malachiteHue:.35,malachiteScale:1.5,crust:.1,islands:.5,azurite:0,chloride:.03,soot:0,crevice:.6,patchScale:110,mottleScale:16,earth:.05,earthColor:"#5a4a38",calcite:.12,streaks:.4,burialSide:.2,recessDirt:.4,wax:.15,inlay:0,wear:.15,dulling:.15,matte:.3},"bronze-disease":{age:1,tin:.13,lead:.05,polish:.4,tarnish:.7,cuprite:.8,tinOxide:.55,tinOxideTone:1.2,malachite:.45,malachiteHue:.45,malachiteScale:2,crust:.6,azurite:.03,chloride:.7,soot:0,crevice:.8,patchScale:70,mottleScale:10,patchiness:.7,earth:.15,earthColor:"#7a6548",calcite:.1,burialSide:.3,recessDirt:.45,wax:0,inlay:0,wear:.15,dulling:.35,tops:.3,matte:.65,nobleWarmth:.3},heirloom:{age:1,tin:.13,lead:.04,polish:.7,tarnish:.75,cuprite:.5,tinOxide:.8,tinOxideTone:.25,malachite:.1,malachiteHue:.5,malachiteScale:1.5,crust:.15,azurite:0,chloride:0,soot:.05,crevice:.9,patchScale:80,mottleScale:12,earth:0,calcite:0,burialSide:0,recessDirt:.8,wax:.3,inlay:.2,wear:.75},"blue-green-excavated":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.7,cuprite:.9,tinOxide:.35,tinOxideTone:1.3,malachite:.82,carbonate:.52,azurite:.06,azuriteDepth:.35,azuriteScale:10,blueHabitat:.35,turquoiseTone:.12,malachiteHue:.3,malachiteTone:.75,islands:.45,malachiteScale:2.2,crust:.9,chloride:.1,soot:0,crevice:.75,patchScale:65,mottleScale:10,patchiness:.6,earth:.3,earthColor:"#8a7354",calcite:.35,streaks:.3,burialSide:.3,recessDirt:.15,interiorTone:.4,wax:0,inlay:0,wear:.15,dulling:.25,tops:.5,matte:.65,nobleWarmth:.3},"azurite-bloom":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.6,cuprite:.9,tinOxide:.3,tinOxideTone:1,malachite:.8,carbonate:.65,azurite:.28,azuriteDepth:.8,azuriteScale:18,blueHabitat:.8,turquoiseTone:.5,malachiteHue:.42,malachiteTone:.45,islands:.85,malachiteScale:2.2,crust:1.2,chloride:.08,soot:0,crevice:.7,patchScale:70,mottleScale:12,earth:.25,earthColor:"#8a7354",calcite:.2,streaks:.2,burialSide:.3,recessDirt:.25,interiorTone:.3,wax:0,inlay:0,wear:.15,dulling:.1,tops:.35,matte:.55,nobleWarmth:.3},houmuwu:{age:1,tin:.12,lead:.04,polish:.3,tarnish:.6,cuprite:1,cupriteTone:.25,tinOxide:.7,tinOxideTone:1.45,malachite:0,carbonate:.4,azurite:0,azuriteScale:8,blueHabitat:.3,turquoiseTone:.2,malachiteHue:.3,malachiteTone:.5,islands:0,malachiteScale:1,crust:.2,chloride:0,soot:0,crevice:.5,patchScale:110,mottleScale:30,patchiness:.3,softness:1,drift:.5,lowerBody:.9,lowerHeight:.38,lowerColor:"#bcc4b0",rimCalm:.8,earth:0,earthColor:"#857256",calcite:0,streaks:.15,burialSide:.2,recessDirt:.6,interiorTone:.35,wax:0,inlay:.7,wear:.1,dulling:.1,tops:.15,matte:1,topsTone:0,ledgeMatte:.5,nobleRelief:-1,speckle:.42,speckleScale:1.6,speckleColor:"#c07078",speckleDecor:.5,crustIsles:.2,crustScale:14,crustColor:"#b8a8a4",crustPlace:.65,plainTone:1,tint:"#bfeee4",grain:1},"met-fangyi":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.8,cuprite:.8,cupriteTone:.3,tinOxide:.95,tinOxideTone:1,malachite:0,carbonate:.05,azurite:0,malachiteHue:.7,malachiteTone:.4,islands:.3,malachiteScale:1,crust:.1,chloride:0,soot:0,crevice:.9,patchScale:80,mottleScale:14,patchiness:.6,softness:.8,drift:.25,earth:.05,earthColor:"#6a4a2c",calcite:0,streaks:.1,burialSide:.05,recessDirt:.9,interiorTone:.6,wax:.1,inlay:0,wear:.1,dulling:.05,tops:.25,nobleWarmth:.35,matte:1,topsTone:.05,ledgeMatte:1,lowerBody:.35,lowerHeight:.1,lowerColor:"#d89a78",upperTone:.9,upperHeight:.66,speckle:.13,speckleScale:1.2,speckleColor:"#3c4630",pustules:.06,pustuleScale:3,pustuleColor:"#3e5a36",tint:"#dfe8cc",grain:.8,crustIsles:0,crustScale:6,crustColor:"#5a3426",crustPlace:0,nobleRelief:.2},"met-zun":{age:1,tin:.14,lead:.05,polish:.45,tarnish:.2,cuprite:.45,cupriteTone:0,tinOxide:.65,tinOxideTone:.7,malachite:.2,carbonate:.2,azurite:.02,azuriteDepth:.4,azuriteScale:10,blueHabitat:.5,turquoiseTone:.5,malachiteHue:.35,malachiteTone:.35,islands:.35,malachiteScale:1.5,crust:.15,chloride:0,soot:0,crevice:.6,patchScale:40,mottleScale:22,patchiness:.6,softness:.75,drift:.4,earth:.05,earthColor:"#9a978c",calcite:.05,streaks:.1,burialSide:.1,recessDirt:.6,interiorTone:.5,wax:0,inlay:1,inlayGround:.65,wear:.2,dulling:.8,tops:.85,nobleWarmth:0,matte:1,topsTone:1,ledgeMatte:1,tint:"#d4e6f2",speckle:0,speckleScale:1.5,speckleColor:"#3d5a48",crustIsles:.15,crustScale:14,crustColor:"#a2a69e",crustPlace:.8,pustules:.15,pustuleScale:5,pustuleColor:"#2a6e50",lowerBody:1,lowerHeight:.1,lowerColor:"#cccccc",plainTone:1.12,grain:.5},"met-fangding":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.25,cuprite:.85,cupriteTone:.2,tinOxide:.7,tinOxideTone:1.1,malachite:.42,carbonate:.1,azurite:0,azuriteScale:10,blueHabitat:.5,turquoiseTone:.4,malachiteHue:.3,malachiteTone:.3,islands:.6,malachiteScale:1.4,crust:.2,chloride:0,soot:0,crevice:.6,patchScale:45,mottleScale:16,patchiness:.8,softness:.7,drift:.3,earth:.08,earthColor:"#7a5a40",calcite:.04,streaks:.1,burialSide:.1,recessDirt:.6,interiorTone:.45,wax:0,inlay:1,inlayGround:.7,wear:.15,dulling:.55,tops:.8,nobleWarmth:.1,matte:1,topsTone:1,ledgeMatte:1,tint:"#bed2be",speckle:.06,speckleScale:1.4,speckleColor:"#7a4a38",crustIsles:.14,crustScale:4,crustColor:"#2f8a5a",crustPlace:.7,pustules:.06,pustuleScale:3,pustuleColor:"#1f8a52",lowerBody:.6,lowerHeight:.35,lowerColor:"#c8bca8",plainTone:.9,grain:.6},"met-gu":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.4,cuprite:.4,cupriteTone:.3,tinOxide:.9,tinOxideTone:1.8,malachite:.02,carbonate:.05,azurite:0,malachiteHue:.45,malachiteTone:.3,islands:.5,malachiteScale:1.2,crust:.2,chloride:0,soot:.3,crevice:.9,patchScale:45,mottleScale:14,patchiness:1,softness:1,drift:.2,earth:.1,earthColor:"#6b5a42",calcite:.05,streaks:.45,burialSide:.05,recessDirt:.9,interiorTone:.6,wax:0,inlay:.85,inlayGround:.15,wear:.2,dulling:.25,tops:1,nobleWarmth:.1,matte:1,topsTone:1,ledgeMatte:1,lowerBody:.7,lowerHeight:.1,lowerColor:"#7a7468",upperTone:.5,upperHeight:.55,tint:"#c4d0b8",speckle:.14,speckleScale:1.5,speckleColor:"#7d4a3e",crustIsles:.18,crustScale:10,crustColor:"#8a8578",crustPlace:.9,pustules:.12,pustuleScale:4,pustuleColor:"#2e6f4a",grain:.5},"met-gui":{age:1,tin:.14,lead:.06,polish:.35,tarnish:.5,cuprite:.75,cupriteTone:.3,tinOxide:.85,tinOxideTone:1.15,malachite:.32,carbonate:.06,azurite:0,malachiteHue:.5,malachiteTone:.6,islands:.1,malachiteScale:2.5,crust:.1,chloride:0,soot:0,crevice:.9,patchScale:30,mottleScale:15,patchiness:.85,softness:.95,drift:.3,earth:.15,earthColor:"#6a4428",calcite:0,streaks:.05,burialSide:.05,recessDirt:1,interiorTone:.55,wax:.05,inlay:0,wear:.15,dulling:.15,tops:.55,nobleWarmth:.25,matte:1,topsTone:.35,ledgeMatte:1,lowerBody:.25,lowerHeight:.18,lowerColor:"#b9a88e",speckle:0,speckleScale:1.3,speckleColor:"#6a3a30",crustIsles:0,crustScale:8,crustColor:"#7fa060",crustPlace:.6,pustules:0,pustuleScale:3,pustuleColor:"#3f7a40",tint:"#c2c6aa",grain:.7,nobleRelief:.35},"nezu-olive":{age:1,tin:.15,lead:.06,polish:.55,tarnish:.9,cuprite:.7,cupriteTone:.4,tinOxide:.88,tinOxideTone:.8,malachite:0,carbonate:.1,azurite:0,malachiteHue:.6,malachiteTone:.8,islands:.1,malachiteScale:1.5,crust:.1,chloride:0,soot:.25,crevice:1,patchScale:60,mottleScale:14,patchiness:.9,softness:.8,drift:.2,earth:0,earthColor:"#8a8270",calcite:0,streaks:.1,burialSide:.15,recessDirt:.8,interiorTone:.2,wax:0,inlay:0,inlayGround:.1,wear:.1,dulling:0,tops:.15,matte:1,nobleWarmth:.75,topsTone:.25,ledgeMatte:1,nobleRelief:1,tint:"#c8cac4",upperTone:.55,upperHeight:.62,speckle:.08,speckleScale:1.5,speckleColor:"#6e4535",crustIsles:.25,crustScale:6,crustColor:"#686656",crustPlace:1,plainTone:.2,lowerHeight:.15,grain:.8},"nezu-blue":{age:1,tin:.15,lead:.05,polish:.45,tarnish:.85,cuprite:.6,cupriteTone:.3,tinOxide:.95,tinOxideTone:.6,malachite:.3,carbonate:.6,azurite:.12,azuriteDepth:.6,azuriteScale:8,blueHabitat:.05,turquoiseTone:.6,malachiteHue:.12,malachiteTone:.55,islands:.25,malachiteScale:1.2,crust:.2,chloride:.03,soot:0,crevice:.9,patchScale:55,mottleScale:10,patchiness:.8,softness:.7,earth:.05,earthColor:"#5f6460",calcite:0,streaks:.15,burialSide:.2,recessDirt:.3,interiorTone:.2,wax:.05,inlay:0,wear:.1,dulling:.35,tops:.8,nobleWarmth:.8,matte:.5,topsTone:.6,ledgeMatte:1},"yachou-yue":{age:1,tin:.15,lead:.06,polish:.2,tarnish:.6,cuprite:.45,cupriteTone:.1,tinOxide:.9,tinOxideTone:.45,malachite:.85,carbonate:.08,azurite:0,malachiteHue:.25,malachiteTone:.12,turquoiseTone:.7,islands:.35,malachiteScale:.9,crust:.4,chloride:0,soot:0,crevice:1,patchScale:70,mottleScale:5,patchiness:.5,softness:.45,drift:.35,earth:.2,earthColor:"#2b2f27",calcite:0,streaks:0,burialSide:.1,recessDirt:1,interiorTone:.3,wax:.05,inlay:0,wear:.08,dulling:.2,tops:1,topsTone:.85,nobleWarmth:.55,matte:1,ledgeMatte:1,speckle:.04,speckleScale:1,speckleColor:"#3a8a5a",speckleDecor:.3,pustules:.03,pustuleScale:2.5,pustuleColor:"#2f9a5e",crustIsles:.12,grain:.95,tint:"#4a7458",nobleRelief:.8,upperTone:.75,upperHeight:.86}},Md={Vessels:["houmuwu","met-fangyi","met-zun","met-gu","nezu-olive","met-fangding","met-gui","yachou-yue"],Looks:["excavated-green","olive-museum","malachite-crust","water-black","bronze-disease","heirloom","as-cast"],Blue:["nezu-blue","blue-green-excavated","azurite-bloom"]},nu=n=>"u"+n[0].toUpperCase()+n.slice(1),le={};for(const[n,t]of Object.entries(ii))le[n]={value:t.type==="color"?new qt(t.default):t.default};le.mode={value:0};le.vesselInverse={value:new ae};le.vesselMin={value:new X(-150,0,-150)};le.vesselSize={value:new X(300,300,300)};function Nr(n={}){for(const[t,e]of Object.entries(n))!le[t]||!(t in ii)||(le[t].value instanceof qt?le[t].value.set(e):le[t].value=e)}function ao(){const n={};for(const t of Object.keys(ii)){const e=le[t].value;n[t]=e instanceof qt?"#"+e.getHexString():e}return n}const yd={beauty:0,clay:1,height:2,mask:3};function vd(n){le.mode.value=yd[n]??0}function xd(n){if(n)if(n.isObject3D){n.updateMatrixWorld(!0),le.vesselInverse.value.copy(n.matrixWorld).invert();const t=new An,e=le.vesselInverse.value;if(n.traverse(i=>{if(!i.isMesh||!i.geometry)return;i.geometry.boundingBox||i.geometry.computeBoundingBox();const s=i.geometry.boundingBox.clone().applyMatrix4(new ae().multiplyMatrices(e,i.matrixWorld));t.union(s)}),t.isEmpty())return;le.vesselMin.value.copy(t.min),t.getSize(le.vesselSize.value)}else le.vesselInverse.value.identity(),le.vesselMin.value.fromArray(n.min),le.vesselSize.value.fromArray(n.max).sub(le.vesselMin.value)}class Se extends po{constructor({relief:t=null,cavityAttribute:e=!1,cavity:i=.8,interior:s=0,normalStrength:o=1,...a}={}){super({color:16777215,roughness:.5,metalness:1,envMapIntensity:1,...a}),this.isPatinaMaterial=!0,this.relief=t,this.cavityAttribute=e,this.defines=this.defines||{},t&&(this.normalMap=t.normalTexture,this.normalScale=new Lt(o,o),this.defines.PATINA_RELIEF=""),e&&(this.defines.PATINA_CAVITY_ATTR=""),this.local={uReliefData:{value:t?t.dataTexture:null},uReliefRange:{value:new Lt(t?t.min:0,t?t.max:1)},uConstCavity:{value:i},uInterior:{value:s}},this.onBeforeCompile=r=>zx(r,this)}customProgramCacheKey(){return"patina2:"+(this.relief?"R":"")+(this.cavityAttribute?"C":"")}}function zx(n,t){for(const i of Object.keys(ii))n.uniforms[nu(i)]=le[i];n.uniforms.uPatinaMode=le.mode,n.uniforms.uVesselInv=le.vesselInverse,n.uniforms.uVesselMin=le.vesselMin,n.uniforms.uVesselSize=le.vesselSize,Object.assign(n.uniforms,t.local),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
#endif`);const e=Object.entries(ii).map(([i,s])=>`uniform ${s.type==="color"?"vec3":"float"} ${nu(i)};`).join(`
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
${Ox}
${Bx}`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
${Gx}`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.specularColor = mix(vec3(ttF0), diffuseColor.rgb, metalnessFactor);`)}const Bx=`
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

// softness: every layer edge feathers (cover soft band widened toward 0.3)
float tt_soft(float sharp) { return mix(sharp, max(sharp, 0.3), clamp(uSoftness, 0.0, 1.0)); }

float layerCuprite(Surf S, float amt) {
  // a near-continuous film on the metal: territory only thins it at low amounts
  return tt_cover(amt, 0.5 * S.T + 0.3 * S.M + 0.2 * S.rec + 0.08 * (S.G - 0.5), tt_soft(0.18));
}

float layerNoble(Surf S, float amt) {
  // Type I sheet: broad smooth territories, indifferent to relief, better on the exterior;
  // kind-0 cells are noble-skin territories, kind-2 cells crust territories
  // (with fine mottle — patchiness < 1 — the kind borders soften: speckle has no cut edges)
  float kw = 0.22 * (1.0 - clamp(uPatchiness, 0.0, 1.0));
  float kNob = 1.0 - tt_ss(0.25 - kw, 0.4 + kw, S.K);
  float f = 0.5 * (1.0 - S.T) + 0.22 * S.T2 + 0.24 * (S.M - 0.5) + 0.12 - 0.15 * S.inside + 0.2 * kNob - 0.12 * tt_ss(0.62 - kw, 0.75 + kw, S.K) + 1.6 * kw * (S.G - 0.5);
  return tt_cover(amt, f, tt_soft(0.12));
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
  float soft = tt_soft(mix(0.12, 0.022, uIslands));
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
  return tt_cover(frac, f, tt_soft(0.03));
}

float layerAzurite(Surf S, float amt) {
  // discrete islands from a thresholded warped field at the azurite patch scale; habitat
  // 0 binds them to the recesses / grooves, 1 lets them sit as open crust patches
  float hab = uBlueHabitat;
  float f = 0.62 * S.A + 0.16 * S.T2 + 0.12 * S.M + 0.08 * S.inside + 0.05 * (S.G - 0.5)
          + mix(0.6 * (S.rec - 0.5), 0.0, hab) - mix(0.25 * S.edge, 0.0, hab);
  return tt_cover(amt, f, tt_soft(0.025));
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
  float hi = S.edge * 0.9 + 0.3 * tt_ss(0.7, 1.0, S.h01) * tt_ss(0.75, 1.0, S.cav) + 0.15 * tt_ss(0.9, 1.0, S.hgt) * (1.0 - S.inside);
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
`,Gx=`
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
  float decorD = 0.0; // local décor density (blurred grooves + arrises, ~50 mm), 0 on plain fields
  #ifdef PATINA_RELIEF
    if (vNormalMapUv.x > -0.5) {
      vec4 rd = texture2D(uReliefData, vNormalMapUv);
      S.h01 = rd.r; S.cav = rd.g; S.edge = rd.b; S.groove = rd.a;
      vec4 rdB = texture2D(uReliefData, vNormalMapUv, 6.0); // a far mip: the neighbourhood
      decorD = tt_ss(0.03, 0.22, rdB.a + 0.6 * rdB.b + 0.8 * (1.0 - rdB.g));
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
  float Tb = S.T, T2b = S.T2; // the broad territory fields, kept for the slow tone drift
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
  // rimCalm: rim, handles (plain parts) and up-facing faces high on the vessel: one worn skin
  float rimK = clamp(uRimCalm, 0.0, 1.0) * (plain ? 1.0 : tt_ss(0.55, 0.85, S.up)) * tt_ss(0.55, 0.75, S.hgt) * (1.0 - S.calm);
  S.M = mix(S.M, 0.5 + 0.25 * (S.M - 0.5), rimK); S.T = mix(S.T, 0.5 + 0.2 * (S.T - 0.5), rimK);
  S.T2 = mix(S.T2, 0.5, 0.8 * rimK); S.K = mix(S.K, 0.45, rimK);
  // softness: the grain that ragged every layer edge into dots drops to a whisper
  float soft = clamp(uSoftness, 0.0, 1.0);
  S.G = mix(S.G, 0.5, 0.9 * max(soft, rimK));
  // (the territory KIND is a cell id — a step at every Voronoi border: soft mottle swaps it for a
  // continuous field so no layer is cut along a cell edge)
  S.K = mix(S.K, clamp(0.5 + 0.7 * (S.T2 - 0.5) + 0.5 * (S.M - 0.5), 0.0, 1.0), soft);
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
  float cChlRaw = uChloride * (1.0 - 0.75 * soft) * aL * clus * step(wc.y, 0.15 + 0.45 * uChloride) * (1.0 - S.calm);
  float cChl = cChlRaw * (1.0 - tt_ss(spotR, spotR + 0.12, wc.x)) * gLod;
  float pitRing = cChlRaw * (tt_ss(spotR, spotR + 0.08, wc.x) - tt_ss(spotR + 0.1, spotR + 0.3, wc.x)) * gLod;
  // calcareous film: whitish dusting within soil territories, on up-facing crust, along the runs
  // — mostly sharp crusty islands (amount ≈ area), plus a faint general dust
  float calF = 0.45 * S.M + 0.3 * S.T2 + 0.2 * max(S.up, 0.0) + 0.15 * S.rec + 0.1 * uStreaks * S.st + 0.05 * (S.G - 0.5);
  float cCal = clamp(tt_cover(uCalcite * aL * 0.8, calF + 0.15, mix(0.05, 0.12, clamp(uSoftness, 0.0, 1.0))) * 0.9 + 0.2 * uCalcite * aL * tt_ss(0.3, 0.8, calF), 0.0, 1.0);

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
  float nobT = clamp(0.36 + 0.12 * (S.M - 0.5) + 0.5 * uNobleRelief * (1.0 - S.rec) * (S.h01 - 0.4) - 0.25 * S.rec + 0.12 * (S.T2 - 0.5) - 0.12 * uStreaks * aL * S.st, 0.0, 1.0);
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

  // ---- grain & crust (round 4b). (colour uniforms are linear already: THREE.Color converts the sRGB pick) Each layer is thresholded (hard-edged close up) and blended to
  // its local mean coverage once its grain is under ~a pixel, so at vessel distance it is a tone
  float hiZ = tt_ss(0.86, 0.99, S.hgt);                                        // rim lip / top
  float loZ = 1.0 - tt_ss(0.6 * max(uLowerHeight, 0.08), max(uLowerHeight, 0.08), S.hgt); // foot / legs
  float cSpk = 0.0, cIsl = 0.0, cPus = 0.0;
  if (uSpeckle > 0.001) {
    float sS = max(uSpeckleScale, 0.3);
    float sl = 1.0 - tt_ss(0.5, 1.5, S.px / sS);
    float fine = 0.5 + 0.5 * (0.7 * snoise(S.p / sS + so.zxy) + 0.3 * sl * snoise(S.p / (sS * 0.45) - so.yzx));
    float dens = 0.75 * fbm2(S.p / (sS * 6.0) + so) + 0.25 * (S.M - 0.5) * 2.0; // clumps 10–40 mm
    // (round 4c: thinner on the lower body — it read as a red camouflage on the Houmuwu legs —
    // and, with softness, a feathered stipple that blends rather than a hard-edged dot)
    float loc = clamp(uSpeckle * aL * (1.0 + 1.5 * dens) * (1.0 - uSpeckleDecor * decorD) * (1.0 - 0.6 * S.rec) * (1.0 - 0.8 * hiZ) * (1.0 - 0.75 * loZ * uLowerBody) * (plain ? 1.0 - 0.8 * clamp(uRimCalm, 0.0, 1.0) : 1.0), 0.0, 1.0);
    float sw = mix(0.07, 0.15, soft);
    cSpk = mix(loc, tt_ss(1.0 - loc - sw, 1.0 - loc + sw, fine), sl) * mix(1.0, 0.8, soft);
    vec3 sc = uSpeckleColor * (0.8 + 0.4 * fine);
    col = mix(col, sc, cSpk); rough = mix(rough, 0.85, cSpk); metal = mix(metal, 0.0, cSpk); f0 = mix(f0, 0.05, cSpk);
  }
  if (uCrustIsles > 0.001) {
    float cS = max(uCrustScale, 1.0);
    float il = 1.0 - tt_ss(0.35, 1.2, S.px / cS);
    // (round 4c: multi-octave — patches 0.5–3× the island size — and, with softness, a feathered
    // edge several mm wide: a bloom that fades into the skin, not a camouflage cut-out)
    float fi = 0.5 + 0.5 * (0.55 * snoise(S.p / cS + 0.25 * w - so.zyx) + 0.3 * snoise(S.p / (cS * 2.7) + so.yzx) + 0.2 * il * snoise(S.p / (cS * 0.45) + so.xzy));
    float pl = clamp(uCrustPlace, 0.0, 1.0);
    float wLo = clamp(0.15 + 0.8 * S.rec + 0.5 * decorD, 0.0, 1.0);
    // (lives on up-facing flats — ledges, steps, the lid's lower edge — more than on raised arrises:
    // arris weighting traced plateau rims with lines of green)
    float wHi = clamp(0.1 + mix(0.6, 0.2, soft) * S.edge + 0.45 * soft * tt_ss(0.35, 0.8, S.up) * (1.0 - S.edge) + 0.35 * (1.0 - decorD) * (plain ? 1.0 : 0.5) + hiZ * (1.0 - S.inside) + loZ, 0.0, 1.0);
    // clustered: crusted territories (~5 islands across) and clean ones between them
    float clu = tt_ss(0.2, 0.7, 0.5 + 0.5 * snoise(S.p / (cS * 5.0) + so.yxz) + 0.35 * (S.T2 - 0.5));
    float loc = clamp(uCrustIsles * aL * tt_ss(0.25, 0.7, mix(wLo, wHi, pl)) * 1.8 * clu * (1.0 - 0.6 * cInl), 0.0, 0.95);
    float iw = mix(0.025, 0.2, soft);
    cIsl = mix(loc * mix(1.0, 0.8, soft), tt_ss(1.0 - loc - iw, 1.0 - loc + iw, fi) * mix(1.0, 0.85, soft), il);
    float ct = clamp(0.5 + mix(1.4, 0.6, soft) * (fi - 0.5) + 0.3 * (S.G - 0.5), 0.0, 1.0);
    vec3 cc = uCrustColor * (0.78 + 0.4 * ct);
    col = mix(col, cc, cIsl); rough = mix(rough, 0.97, cIsl); metal = mix(metal, 0.0, cIsl); f0 = mix(f0, 0.035, cIsl);
  }
  if (uPustules > 0.001) {
    float pS = max(uPustuleScale, 1.0);
    float pl2 = 1.0 - tt_ss(0.4, 1.3, S.px / pS);
    vec2 wp = worley8(S.p / pS + 0.15 * w + so.yzx);
    // (round 4c: lodged in recesses and along flange / rim edges, never on a plateau top like a decal)
    float clu = tt_ss(0.35, 0.75, 0.5 + 0.5 * snoise(S.p / (pS * 7.0) - so.zxy) + 0.5 * hiZ + 0.35 * loZ + 0.45 * S.rec + 0.25 * S.edge - 0.25);
    float loc = clamp(uPustules * aL * 2.2 * clu * (1.0 - 0.85 * (plain ? 0.0 : tt_ss(0.04, 0.22, hMM) * (1.0 - S.edge))), 0.0, 1.0);
    float rr = 0.3 + 0.12 * snoise(S.p / (pS * 0.4));
    float disc = (1.0 - tt_ss(rr - 0.06, rr + 0.06, wp.x)) * step(wp.y, loc);
    cPus = mix(loc * 0.28, disc, pl2);
    vec3 pc = uPustuleColor * (0.75 + 0.5 * clamp(1.0 - wp.x / max(rr, 0.05), 0.0, 1.0));
    col = mix(col, pc, cPus); rough = mix(rough, 0.8, cPus); metal = mix(metal, 0.0, cPus); f0 = mix(f0, 0.06, cPus);
  }
  // ---- grain (round 4c): the soft, multi-scale breathing of a real skin — 2.5 mm and 9 mm octaves of
  // lightness, a little warm↔cool hue at 9 mm, roughness following the grain. Smooth noise, no
  // threshold: it can never read as dots, and it fades to its mean under a pixel. Two simplex taps.
  if (uGrain > 0.001) {
    float g1 = tt_lod(2.5, S.px) * snoise(S.p / 2.5 + so.yzx * 1.7);
    float g2 = tt_lod(9.0, S.px) * snoise(S.p / 9.0 - so.zxy * 1.3);
    float gk = uGrain * a * (1.0 - S.calm) * (1.0 - 0.7 * cInl);
    col *= (1.0 + gk * (0.2 * g1 + 0.2 * g2)) * (vec3(1.0) + gk * 0.08 * g2 * vec3(1.0, -0.15, -0.9));
    rough += gk * 0.1 * g1;
  }

  // ---- slow tone drift (50–200 mm): lightness and warmth breathe across the skin
  float dr = clamp(uDrift, 0.0, 1.0) * a * (1.0 - S.calm);
  col *= (1.0 + 0.9 * dr * (Tb - 0.5)) * mix(vec3(1.0), vec3(1.08, 1.0, 0.88), dr * clamp(1.6 * (T2b - 0.5), -1.0, 1.0));

  // ---- dulling: dust, old wax and fine soil in the pores grey the minerals down
  float dull = uDulling * a * (1.0 - metal) * (1.0 - 0.8 * cPus); // (crystalline pustules stay saturated: round 4c)
  float lumD = tt_lum(col);
  col = mix(col, vec3(lumD) * vec3(1.0, 1.01, 0.985), dull * 0.72);

  // ---- lower body: legs and foot carry a darker, greener skin (closer to the ground water)
  float lowK = clamp(uLowerBody, 0.0, 1.0) * a * (1.0 - tt_ss(uLowerHeight - 0.06, uLowerHeight + 0.06, S.hgt)) * (1.0 - S.calm);
  col = mix(col, col * uLowerColor, lowK);
  float upK = a * (1.0 - S.calm) * tt_ss(uUpperHeight - 0.04, uUpperHeight + 0.04, S.hgt);
  col *= mix(1.0, uUpperTone, upK);
  col *= mix(1.0, uPlainTone, (plain ? 1.0 : 1.0 - decorD) * (1.0 - S.calm) * a);
  col *= uTint; // (after the dulling, which would grey a tint away)

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
  // dusty ledges: up-facing faces are fully matte (dust kills the grazing sheen that read as white lines)
  float ldg = clamp(uLedgeMatte, 0.0, 1.0) * tt_ss(0.45, 0.8, S.up) * (1.0 - S.calm) * tt_ss(0.1, 0.6, a);
  col = mix(col, col * 0.3, ldg * metal); // (bare worn metal under the dust: a dark diffuse grey, not a mirror)
  rough = mix(rough, 0.98, ldg); f0 = mix(f0, 0.02, ldg); metal = mix(metal, 0.0, ldg);

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
      m = mix(m, vec3(0.80, 0.35, 0.30), cSpk);                                       // fine speckle salmon
      m = mix(m, vec3(0.80, 0.80, 0.60), cIsl);                                       // crust islands buff
      m = mix(m, vec3(0.00, 0.55, 0.20), cPus);                                       // pustules emerald
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
    bumpH *= 1.0 - 0.75 * soft; // soft mottle: no grain-sized glints either
    normal = tt_bump(normal, bumpH, vp);
  }

  diffuseColor.rgb = col;
  roughnessFactor = clamp(rough, 0.04, 1.0);
  metalnessFactor = clamp(metal, 0.0, 1.0);
}
`,Va=Math.PI/180;function tl(n){var gt,vt;const{from:t,to:e,out:i,height:s=10,thickness:o=4,notches:a={every:22,depth:.4,width:3},hook:r=0,ends:c={},embed:l,taper:h=3,bevel:u,waver:f=.5,seed:p=1,incise:_="auto",material:g,part:d="flanges"}=n,m=n.path||wd(t,e,i),y=m.length,M=new Be(p),v=typeof s=="function"?s:()=>s,x=Td(xt=>v(xt),24),b=l??Math.max(.6,Math.min(o*.6,2)),w={start:Fr(c.start),end:Fr(c.end??(r>0?{type:"beak",length:r}:"square"))},L=n.outline?{...Hx(n.outline,n.grooves),...n.grooveStyle?{groove:n.grooveStyle}:{}}:bd({length:y,height:v,notches:a,ends:w,embed:b,waver:f,rng:M.fork("outline")}),S=L.points;let T=1/0,C=-1/0,R=0;for(const[xt,wt]of S)T=Math.min(T,xt),C=Math.max(C,xt),R=Math.max(R,wt);const O=jx(m,T-1,C+1,.5),A=Rc(M.fork("sway"),T,C,Math.max(12,y/4)),D=Rc(M.fork("thick"),T,C,Math.max(15,y/3)),k=.25*f*Math.min(1,o/4),I=(xt,wt)=>{const St=o/2*(1+.1*f*D(xt));return Math.max(St*.45,St-Math.tan(h*Va)*Math.max(0,wt))},N=Math.tan(h*Va),z=u??Math.min(.8,Math.max(.25,o*.12)),q=(xt,wt,St,ft)=>{const At=O(xt),It=St+k*A(xt);return ft.set(At.p.x+At.n.x*wt+At.b.x*It,At.p.y+At.n.y*wt+At.b.y*It,At.p.z+At.n.z*wt+At.b.z*It),ft},Z=el(S,z),Q=O((T+C)/2),U={p:Q.p.clone(),n:Q.n.clone(),d:Q.d.clone()},Y=new X,G=Z.map(([xt,wt])=>(q(xt,wt,0,Y).sub(U.p),new Lt(Y.dot(U.d),Y.dot(U.n)))),$=Vi.triangulateShape(G,[]),J=C-T,it=R+b,ot=!g||g.isPatinaMaterial;let ct=null,K=g;(_==="auto"?ot:_)&&L.grooves.length&&(ct=Vx(L,{w:J,h:it,sMin:T,e:b,thickness:o,seed:p}),K=new Se({relief:ct,cavity:((vt=(gt=g==null?void 0:g.local)==null?void 0:gt.uConstCavity)==null?void 0:vt.value)??.8})),K||(K=new Se);const F=(xt,wt)=>[(xt-T)/J,(wt+b)/it],B=[],W=[],et=[],st=[],mt=[],ut=new X,E=(xt,wt,St,ft,At,It)=>(q(xt,wt,St,ut),B.push(ut.x,ut.y,ut.z),W.push(ft.x,ft.y,ft.z),et.push(At[0],At[1]),st.push(It.x,It.y,It.z,It.w),B.length/3-1),P=(xt,wt)=>{const St=O(xt);return new X().copy(St.b).multiplyScalar(wt).addScaledVector(St.n,N).normalize()};for(const xt of[1,-1]){const wt=B.length/3;for(const[St,ft]of Z){const At=O(St);E(St,ft,xt*I(St,ft),P(St,xt),F(St,ft),{x:At.d.x,y:At.d.y,z:At.d.z,w:xt})}for(const[St,ft,At]of $){const It=new X().fromArray(B,(wt+St)*3),Ct=new X().fromArray(B,(wt+ft)*3),kt=new X().fromArray(B,(wt+At)*3),Rt=Ct.sub(It).cross(kt.sub(It)),V=P(Z[St][0],xt);Rt.dot(V)>=0?mt.push(wt+St,wt+ft,wt+At):mt.push(wt+St,wt+At,wt+ft)}}const tt=Sd(S),dt=S.length;for(let xt=0;xt<dt;xt++){const wt=(xt+1)%dt,St=[xt,wt].map((Ct,kt)=>{const Rt=tt[kt===0?(Ct-1+dt)%dt:wt];let V=tt[xt];Rt[0]*V[0]+Rt[1]*V[1]>Math.cos(40*Va)&&(V=Ed([Rt[0]+V[0],Rt[1]+V[1]]));const[Tt,Ut]=S[Ct],nt=O(Tt),rt=new X().copy(nt.d).multiplyScalar(V[0]).addScaledVector(nt.n,V[1]).normalize();return{q:Ct,s:Tt,t:Ut,side3:rt,F:{d:nt.d.clone()}}}),ft=(Ct,kt)=>{const{q:Rt,s:V,t:Tt,side3:Ut,F:nt}=Ct,rt={x:nt.d.x,y:nt.d.y,z:nt.d.z,w:1},H=I(V,Tt),[lt,bt]=Z[Rt];return kt===0?E(lt,bt,H,new X().copy(Ut).add(P(V,1)).normalize(),F(lt,bt),rt):kt===1?E(V,Tt,H-z,new X().copy(Ut).multiplyScalar(2).add(P(V,1)).normalize(),F(V,Tt),rt):kt===2?E(V,Tt,-(H-z),new X().copy(Ut).multiplyScalar(2).add(P(V,-1)).normalize(),F(V,Tt),rt):E(lt,bt,-H,new X().copy(Ut).add(P(V,-1)).normalize(),F(lt,bt),rt)},At=[0,1,2,3].map(Ct=>ft(St[0],Ct)),It=[0,1,2,3].map(Ct=>ft(St[1],Ct));for(let Ct=0;Ct<3;Ct++){const kt=At[Ct],Rt=At[Ct+1],V=It[Ct+1],Tt=It[Ct],Ut=new X().fromArray(B,kt*3),nt=new X().fromArray(B,Rt*3),H=new X().fromArray(B,Tt*3).clone().sub(Ut).cross(nt.clone().sub(Ut)),lt=new X().fromArray(W,kt*3);H.dot(lt)>=0?mt.push(kt,Tt,V,kt,V,Rt):mt.push(kt,Rt,V,kt,V,Tt)}}const at=new Ge;at.setAttribute("position",new fe(B,3)),at.setAttribute("normal",new fe(W,3)),at.setAttribute("uv",new fe(et,2)),at.setAttribute("tangent",new fe(st,4)),at.setIndex(mt),at.computeBoundingBox(),at.computeBoundingSphere();const pt=new he(at,K);return pt.userData.part=d,pt.userData.flange={length:y,outline:S,relief:ct,height:x},pt.castShadow=pt.receiveShadow=!0,pt}function Fr(n){return n?typeof n=="string"?{type:n}:{type:"square",...n}:{type:"square"}}function bd({length:n,height:t,notches:e,ends:i,embed:s,waver:o=.5,rng:a=new Be(1)}){const r=typeof t=="function"?t:()=>t,c=Td(r,16),l=Rc(a.fork("crest"),-n,2*n,Math.max(8,n/6)),h=q=>Math.max(.5,r(Math.min(1,Math.max(0,q/n)))*(1+.035*o*l(q))),u=Fr(i==null?void 0:i.start),f=Fr(i==null?void 0:i.end),p=q=>{let Z=1;return u.type==="taper"&&(Z=Math.min(Z,.2+.8*su(q/(u.length??c*1.5)))),f.type==="taper"&&(Z=Math.min(Z,.2+.8*su((n-q)/(f.length??c*1.5)))),Z},_=q=>h(q)*p(q),g=e===null||e===!1?{shape:"none"}:{shape:"square",...e};g.every!=null&&g.pitch==null&&(g.pitch=g.every);const d=g.shape||"square",m=g.pitch??(d==="score"?Math.max(3,c*.45):Math.max(6,c*1.5)),y=g.depth??(d==="score"?.28:d==="hook"?.5:.42),M=g.width??(d==="score"?Math.max(1,m*.38):Math.max(1.5,m*.3)),v=iu(f,n,_(n),c,1),x=v.length?v[v.length-1][0]:n,b=iu(u,0,_(0),c,-1).reverse(),w=b.length?b[0][0]:0,L=Math.max(0,w),S=Math.min(n,x),T=d==="none"?1:Math.max(1,Math.round((S-L)/m)),C=(S-L)/T,R=[];for(let q=1;q<T;q++)R.push(L+q*C+(a.next()-.5)*.12*C*o);const O=[];for(let q=0;q<T;q++)O.push([q===0?L:R[q-1]+M/2,q===T-1?S:R[q]-M/2]);const A=[],D=(q,Z)=>{const Q=A[A.length-1];(!Q||Math.abs(Q[0]-q)>1e-4||Math.abs(Q[1]-Z)>1e-4)&&A.push([q,Z])},k=(q,Z,Q)=>{const U=Math.max(1,Math.ceil(Math.abs(q-Z)/1.2));for(let Y=0;Y<=U;Y++){const G=q+(Z-q)*Y/U;D(G,Q(G))}};D(0,-s),D(n,-s);for(const q of v)D(q[0],q[1]);v.length||D(n,_(n));const I=[],N=q=>y*_(q);for(let q=T-1;q>=0;q--){const[Z,Q]=O[q],U=q===T-1?Math.min(x,n):Q,Y=q===0?Math.max(w,0):Z;if(d==="hook"&&q<T-1){const G=Q-Z,$=Math.min(G*.45,c*.9),J=Math.min(G*.22,$*.6),it=.24,ot=.3;D(Q,_(Q)),k(Q,Q-$,_),D(Q-$,_(Q-$)*(1-it)),D(Q-$+J,_(Q-$+J)*(1-it)),D(Q-$+J,_(Q-$+J)*(1-ot)),k(Q-$+J,Y,ct=>_(ct)*(1-ot))}else d==="hook"?k(U,Y,G=>_(G)*(q===T-1?1:.7)):k(U,Y,_);if(q>0){const G=R[q-1],$=G+M/2,J=G-M/2;D($,_($)-N($)),D(J,_(J)-N(J)),D(J,_(J))}}for(const q of b)D(q[0],q[1]);D(b.length?b[b.length-1][0]:0,-s),A.length>2&&Math.hypot(A[0][0]-A[A.length-1][0],A[0][1]-A[A.length-1][1])<1e-4&&A.pop();const z=Math.min(1.5,c*.18);if(d==="score"){const q=g.rungs==="full";if(!q){const Z=[],Q=Math.max(0,w),U=Math.min(n,x),Y=Math.max(2,Math.ceil((U-Q)/1.5));for(let G=0;G<=Y;G++){const $=Q+(U-Q)*G/Y;Z.push([$,_($)-N($)-z*.8])}I.push(Z)}for(const Z of R)I.push([[Z,_(Z)-N(Z)],[Z,q?Math.min(.4,_(Z)*.1):_(Z)-N(Z)-z*.8]])}else if(d!=="none"){const q=el(A,z);let Z=[];for(let U=0;U<q.length;U++){const[Y,G]=q[U];G>Math.max(z,.3*c)&&Y>w+z*.5&&Y<x-z*.5?Z.push([Y,G]):Z.length&&(Z.length>1&&I.push(Z),Z=[])}Z.length>1&&I.push(Z);const Q=g.pattern||(d==="T"||d==="square"?["T"]:d==="L"?["L","J"]:[]);O.forEach(([U,Y],G)=>{const $=Q.length?Q[G%Q.length]:null;if(!$||Y-U<z*4)return;const J=$==="T"?(U+Y)/2:$==="L"?U+z*1.6:Y-z*1.6,it=_(J)-z*1.1,ot=Math.max(.2*c,it-.55*_(J));it-ot>z&&I.push([[J,it],[J,ot]])})}return{points:A,grooves:I,segments:O,cuts:R,width:M,depth:y,pitch:m,shape:d,groove:g.groove}}function Hx(n,t){const e=n.map(([r,c])=>[r,c]);if(t)return{points:e,grooves:t,segments:[]};let i=0;for(const[,r]of e)i=Math.max(i,r);const s=Math.min(1.5,i*.18),o=[];let a=[];for(const[r,c]of el(e,s))c>Math.max(s,.3*i)?a.push([r,c]):a.length&&(a.length>1&&o.push(a),a=[]);return a.length>1&&o.push(a),{points:e,grooves:o,segments:[]}}function iu(n,t,e,i,s){const o=n.length??i*.8;switch(n.type){case"beak":return[[t+s*o*.15,e*.55],[t+s*o,e]];case"hook":{const a=n.height??e*1.15;return[[t,e*.35],[t+s*o*.55,a*.55],[t+s*o,a*.85],[t+s*o*.85,a],[t+s*o*.2,a*.98]]}case"step":{const a=n.under??Math.max(.5,e*.12),r=Math.min(o*.3,e*.15);return[[t,a],[t+s*(o-r),a],[t+s*o,a+r],[t+s*o,e-r],[t+s*(o-r),e]]}case"spur":{const a=n.height??e*2,r=n.length??i*.7,c=n.sweep??Math.max(r*2.2,(a-e)*1.4),l=u=>t-s*u,h=[];for(let u=1;u<=6;u++){const f=u/6;h.push([l(r*Math.pow(f,1.6)),a*.94*f])}h.push([l(r+.5),a]);for(let u=1;u<=8;u++){const f=u/8;h.push([l(r+.5+c*f),e+(a-e)*(1-f)*(1-f)])}return h}default:return[]}}function Vx(n,{w:t,h:e,sMin:i,e:s,thickness:o,seed:a}){var u,f;const r=Math.min(8,1e3/t,500/e),c=new wo({width:t,height:e,ppmm:r,seed:a}),l=Math.min(1.3,Math.max(.7,o/4)),h=((u=n.groove)==null?void 0:u.width)??.55*l;return c.sink(p=>{p.lineWidth=h,p.lineCap="round",p.lineJoin="round";for(const _ of n.grooves)p.beginPath(),_.forEach(([g,d],m)=>m?p.lineTo(g-i,d+s):p.moveTo(g-i,d+s)),p.stroke()},{depth:((f=n.groove)==null?void 0:f.depth)??.35*l,profile:"u"}),c.bake()}function wd(n,t,e){const i=new X().subVectors(t,n),s=i.length();i.normalize();const o=e.clone().addScaledVector(i,-e.dot(i)).normalize(),a=new X().crossVectors(i,o);return{isPath:!0,planar:!0,kind:"straight",length:s,frame:r=>({p:n.clone().addScaledVector(i,r),n:o,d:i,b:a})}}function Wx(n,t,e){return wd(n,t,e)}function jx(n,t,e,i){const s=Math.max(2,Math.ceil((e-t)/i)),o=[];for(let r=0;r<=s;r++){const c=t+(e-t)*r/s,l=n.frame(c);o.push({p:l.p.clone(),n:l.n.clone(),d:l.d.clone(),b:(l.b||new X().crossVectors(l.d,l.n)).clone()})}const a={p:new X,n:new X,d:new X,b:new X};return r=>{const c=Math.min(s,Math.max(0,(r-t)/(e-t)*s)),l=Math.min(s-1,Math.floor(c)),h=c-l,u=o[l],f=o[l+1];return a.p.lerpVectors(u.p,f.p,h),a.n.lerpVectors(u.n,f.n,h).normalize(),a.d.lerpVectors(u.d,f.d,h).normalize(),a.b.lerpVectors(u.b,f.b,h).normalize(),a}}function Sd(n){const t=n.length,e=[];for(let i=0;i<t;i++){const s=n[i],o=n[(i+1)%t];e.push(Ed([o[1]-s[1],-(o[0]-s[0])]))}return e}function Ed(n){const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]}function el(n,t){const e=n.length,i=Sd(n);return n.map((s,o)=>{const a=i[(o-1+e)%e],r=i[o];let c=a[0]+r[0],l=a[1]+r[1];const h=Math.hypot(c,l);h<1e-6?(c=r[0],l=r[1]):(c/=h,l/=h);const u=Math.max(.35,c*r[0]+l*r[1]),f=t/u;return[s[0]-c*f,s[1]-l*f]})}function su(n){return n=Math.min(1,Math.max(0,n)),n*n*(3-2*n)}function Td(n,t){let e=0;for(let i=0;i<=t;i++)e=Math.max(e,n(i/t));return e}function Rc(n,t,e,i){const s=Math.max(2,Math.ceil((e-t)/i)+2),o=[];for(let a=0;a<=s;a++)o.push(n.next()*2-1);return a=>{const r=Math.min(s-1e-6,Math.max(0,(a-t)/i)),c=Math.floor(r),l=r-c,h=l*l*(3-2*l);return o[c]*(1-h)+o[c+1]*h}}const Wa={C:"corner",c:"corner",corner:"corner",L:"lip",l:"lip",lip:"lip",S:"smooth",s:"smooth",smooth:"smooth"};function qx(n){return Array.isArray(n)?{r:+n[0],y:+n[1],join:Wa[n[2]]||"smooth",name:n[3]??(typeof n[2]=="string"&&!Wa[n[2]]?n[2]:null)}:{r:+n.r,y:+n.y,join:Wa[n.join]||(n.corner?"corner":"smooth"),name:n.name??null}}function Xx(n,t,e,i,s,o){const a=(u,f)=>Math.max(1e-6,Math.pow(Math.hypot(f[0]-u[0],f[1]-u[1]),.5)),c=0+a(n,t),l=c+a(t,e),h=l+a(e,i);for(let u=1;u<=s;u++){const f=c+(l-c)*u/s,p=[0,0];for(let _=0;_<2;_++){const g=(c-f)/(c-0)*n[_]+(f-0)/(c-0)*t[_],d=(l-f)/(l-c)*t[_]+(f-c)/(l-c)*e[_],m=(h-f)/(h-l)*e[_]+(f-l)/(h-l)*i[_],y=(l-f)/(l-0)*g+(f-0)/(l-0)*d,M=(h-f)/(h-c)*d+(f-c)/(h-c)*m;p[_]=(l-f)/(l-c)*y+(f-c)/(l-c)*M}o.push(p)}}function Yx(n,t,e){const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)}function $x(n,t,e){const i=Math.abs(t)/e;return i>=1?0:n==="flat"?Yx(1,.6,i):n==="v"?1-i:n==="step"?1:Math.sqrt(1-i*i)}class Xs{constructor(t,{registers:e={},ridges:i=[],step:s=.15,mode:o="spline",smooth:a=0}={}){if(this.isProfile=!0,this.source=t.map(qx),this.source.length<2)throw new Error("Profile: need at least two points");this.step=s,this.mode=o,this._build(o,a),this.labels={},this.source.forEach((r,c)=>{r.name&&(this.labels[r.name]=this._srcS[c])}),this.ridges=[],this.registers={};for(const r of i)this.addRidges(r);for(const[r,c]of Object.entries(e))this.setRegister(r,c)}_build(t,e){const i=this.source,s=[];let o=[0];for(let l=1;l<i.length;l++)o.push(l),i[l].join==="corner"&&l<i.length-1&&(s.push(o),o=[l]);s.push(o);const a=[],r=new Set,c=new Array(i.length).fill(0);for(const l of s){const h=l.map(u=>[i[u].r,i[u].y]);a.length?r.add(a.length-1):(a.push(h[0]),c[l[0]]=0);for(let u=0;u<h.length-1;u++){const f=h[u],p=h[u+1],_=Math.max(1,Math.ceil(Math.hypot(p[0]-f[0],p[1]-f[1])/this.step));if(t==="polyline"||h.length<3)for(let g=1;g<=_;g++)a.push([f[0]+(p[0]-f[0])*g/_,f[1]+(p[1]-f[1])*g/_]);else{const g=u>0?h[u-1]:[2*f[0]-p[0],2*f[1]-p[1]],d=u+2<h.length?h[u+2]:[2*p[0]-f[0],2*p[1]-f[1]];Xx(g,f,p,d,_,a)}c[l[u+1]]=a.length-1}}t==="polyline"&&e>0&&ou(a,r,e,this.step),this._pts=a,this._corners=r,this._srcIdx=c,this._finish(),this._srcS=c.map(l=>this.S[l])}_finish(){const t=this._pts,e=t.length,i=new Float64Array(e);for(let c=1;c<e;c++)i[c]=i[c-1]+Math.hypot(t[c][0]-t[c-1][0],t[c][1]-t[c-1][1]);this.S=i,this.length=i[e-1];const s=[];for(let c=0;c<e-1;c++){const l=t[c+1][0]-t[c][0],h=t[c+1][1]-t[c][1],u=Math.hypot(l,h)||1;s.push([l/u,h/u])}this._T=s,this.cornerS=[...this._corners].sort((c,l)=>c-l).map(c=>i[c]);let o=1/0,a=-1/0,r=0;for(const c of t)o=Math.min(o,c[1]),a=Math.max(a,c[1]),r=Math.max(r,c[0]);this.bounds={yMin:o,yMax:a,rMax:r,height:a-o}}_seg(t){const e=this.S;if(t<=0)return 0;if(t>=this.length)return e.length-2;let i=0,s=e.length-1;for(;s-i>1;){const o=i+s>>1;e[o]<=t?i=o:s=o}return i}_vtan(t,e){const i=this._T;if(t<=0)return i[0];if(t>=i.length)return i[i.length-1];if(this._corners.has(t))return e<0?i[t-1]:i[t];const s=i[t-1],o=i[t],a=s[0]+o[0],r=s[1]+o[1],c=Math.hypot(a,r)||1;return[a/c,r/c]}at(t,e=0){t=Math.min(Math.max(t,0),this.length);const i=this._seg(t),s=this.S,o=this._pts[i],a=this._pts[i+1],r=s[i+1]>s[i]?(t-s[i])/(s[i+1]-s[i]):0,c=e||(t>=this.length?-1:1);let l,h;r<=1e-9&&this._corners.has(i)?l=h=this._vtan(i,c):r>=1-1e-9&&this._corners.has(i+1)?l=h=this._vtan(i+1,c):(l=this._vtan(i,1),h=this._vtan(i+1,-1));let u=l[0]+(h[0]-l[0])*r,f=l[1]+(h[1]-l[1])*r;const p=Math.hypot(u,f)||1;return u/=p,f/=p,{s:t,r:o[0]+(a[0]-o[0])*r,y:o[1]+(a[1]-o[1])*r,nr:f,ny:-u,tr:u,ty:f}}atT(t,e){return this.at(t*this.length,e)}sAtY(t,{from:e="bottom"}={}){const i=this._pts,s=i.length,o=e==="top"?[...Array(s-1).keys()].reverse():[...Array(s-1).keys()];for(const a of o){const r=i[a][1],c=i[a+1][1];if((r-t)*(c-t)<=0&&r!==c){const l=(t-r)/(c-r);return this.S[a]+l*(this.S[a+1]-this.S[a])}}return t<=this.bounds.yMin?0:this.length}rAtY(t,e){return this.at(this.sAtY(t,e)).r}resolveS(t,e){if(t==null)return null;if(typeof t=="string"){if(!(t in this.labels))throw new Error(`Profile: no point labelled '${t}'`);return this.labels[t]}return typeof t=="object"&&"s"in t?t.s:this.sAtY(+t,{from:e})}setRegister(t,e){let i,s;Array.isArray(e)?(i=this.resolveS(e[0]),s=this.resolveS(e[1],"top")):"s0"in e?(i=e.s0,s=e.s1):"y0"in e?(i=this.sAtY(e.y0),s=this.sAtY(e.y1,{from:"top"})):(i=this.resolveS(e.from),s=this.resolveS(e.to,"top")),s<i&&([i,s]=[s,i]);const o={name:t,s0:i,s1:s,length:s-i,y0:this.at(i).y,y1:this.at(s).y};return this.registers[t]=o,o}register(t){const e=this.registers[t];if(!e)throw new Error(`Profile: no register '${t}'`);return e}addRidges({y:t,s:e,count:i=1,width:s=1.6,height:o=1,spacing:a,shape:r="round"}){const c=e??this.sAtY(t),l=a??s*2.1,h=s/2,u=[];for(let v=0;v<i;v++)u.push(c+(v-(i-1)/2)*l);const f=u[0]-h-.5,p=u[u.length-1]+h+.5;this._refine(f,p,Math.min(this.step,s/12));const _=this._pts,g=_.map((v,x)=>{const b=this.S[x];let w=0;for(const L of u)w=Math.max(w,$x(r,b-L,h)*o);return w}),d=_.map((v,x)=>{const b=this._vtan(x,1);return[b[1],-b[0]]});for(let v=0;v<_.length;v++)g[v]&&(_[v]=[_[v][0]+d[v][0]*g[v],_[v][1]+d[v][1]*g[v]]);const m=this.S;this._finish();const y=this.S,M=v=>{let x=0,b=m.length-1;if(v<=0)return 0;if(v>=m[b])return y[b]+(v-m[b]);for(;b-x>1;){const L=x+b>>1;m[L]<=v?x=L:b=L}const w=m[b]>m[x]?(v-m[x])/(m[b]-m[x]):0;return y[x]+w*(y[b]-y[x])};for(const v of Object.keys(this.labels))this.labels[v]=M(this.labels[v]);this._srcS=this._srcS.map(M);for(const v of Object.values(this.registers))v.s0=M(v.s0),v.s1=M(v.s1),v.length=v.s1-v.s0;for(const v of this.ridges)v.s0=M(v.s0),v.s1=M(v.s1),v.centres=v.centres.map(M);return this.ridges.push({s0:M(f),s1:M(p),centres:u.map(M),width:s,height:o,shape:r,count:i}),this}_refine(t,e,i){const s=this._pts,o=this.S,a=[],r=new Set;for(let c=0;c<s.length;c++)if(this._corners.has(c)&&r.add(a.length),a.push(s[c]),c<s.length-1&&o[c+1]>t&&o[c]<e){const l=Math.ceil((o[c+1]-o[c])/i);for(let h=1;h<l;h++)a.push([s[c][0]+(s[c+1][0]-s[c][0])*h/l,s[c][1]+(s[c+1][1]-s[c][1])*h/l])}this._pts=a,this._corners=r,this._finish()}breaks(){const t=new Set(this.cornerS);for(const e of this.ridges)t.add(e.s0),t.add(e.s1);return[...t].filter(e=>e>1e-6&&e<this.length-1e-6).sort((e,i)=>e-i)}samples(t,e,{maxAngle:i=.06,maxLen:s=6,minRows:o=1}={}){const a=[t],r=this.S;let c=this._seg(t)+1,l=t,h=this.at(t,1);for(let u=0;u<1e6;u++){const f=c<r.length?Math.min(r[c],e):e;if(f-l>s){if(l+=s,e-l<s*.25)break;a.push(l),h=this.at(l,1);continue}if(f>=e-1e-6)break;const p=this._vtan(c,-1);Math.acos(Math.min(1,Math.max(-1,p[0]*h.tr+p[1]*h.ty)))>i&&r[c]-l>.02&&(a.push(r[c]),l=r[c],h=this.at(r[c],1)),c++}if(a.push(e),a.length-1<o){const u=[];for(let f=0;f<=o;f++)u.push(t+(e-t)*f/o);return u}return a}offset(t,{smooth:e=3}={}){const i=this._pts.map(r=>r.slice());e>0&&ou(i,new Set,e,this.step);const s=[],o=i.length;for(let r=0;r<o;r++){const c=i[Math.max(0,r-1)],l=i[Math.min(o-1,r+1)],h=l[0]-c[0],u=l[1]-c[1],f=Math.hypot(h,u)||1,p=typeof t=="function"?t(this.S[r],i[r][1]):t;s.push([Math.max(0,i[r][0]-u/f*p),i[r][1]+h/f*p,this.S[r]])}const a=[s[0]];for(let r=1;r<o;r++){const c=a[a.length-1],l=i[Math.max(0,r-1)],h=i[Math.min(o-1,r+1)];(s[r][0]-c[0])*(h[0]-l[0])+(s[r][1]-c[1])*(h[1]-l[1])>1e-9&&a.push(s[r])}return a}scaled(t){return new Xs(this.source.map(e=>({...e,r:e.r*t,y:e.y*t})),{step:this.step,mode:this.mode,ridges:this.ridges.map(e=>({s:e.centres.reduce((i,s)=>i+s,0)/e.centres.length*t,count:e.count,width:e.width*t,height:e.height*t,spacing:e.centres.length>1?(e.centres[1]-e.centres[0])*t:void 0,shape:e.shape})),registers:Object.fromEntries(Object.entries(this.registers).map(([e,i])=>[e,{s0:i.s0*t,s1:i.s1*t}]))})}get points(){return this._pts}}function ou(n,t,e,i){const s=[0,...[...t].sort((r,c)=>r-c),n.length-1],o=Math.max(1,Math.round(e*2.5/i)),a=[];for(let r=-o;r<=o;r++)a.push(Math.exp(-.5*(r*i/e)**2));for(let r=0;r<s.length-1;r++){const c=s[r],l=s[r+1],h=n.slice(c,l+1).map(u=>u.slice());for(let u=c+1;u<l;u++){let f=0,p=0,_=0;for(let g=-o;g<=o;g++){const d=u+g;if(d<c||d>l)continue;const m=a[g+o];f+=h[d-c][0]*m,p+=h[d-c][1]*m,_+=m}n[u]=[f/_,p/_]}}}function Ad(n,t){return n!=null&&n.isProfile?n:new Xs(n,t)}function Kx(n,{scale:t=1,height:e,corners:i="auto",cornerAngle:s=32,window:o=2.5,smooth:a=.8,ground:r=!0,flipY:c=!1,...l}={}){let h=n.map(_=>[Math.abs(+_[0])*t,(c?-1:1)*+_[1]*t]);if(h[0][1]>h[h.length-1][1]&&h.reverse(),r){const _=Math.min(...h.map(g=>g[1]));h=h.map(g=>[g[0],g[1]-_])}if(e){const _=Math.max(...h.map(d=>d[1]))-Math.min(...h.map(d=>d[1])),g=e/_;h=h.map(d=>[d[0]*g,d[1]*g])}h=h.filter((_,g)=>g===0||Math.hypot(_[0]-h[g-1][0],_[1]-h[g-1][1])>1e-6);let u=new Set;if(Array.isArray(i))u=new Set(i);else if(i==="auto"){const _=[0];for(let d=1;d<h.length;d++)_.push(_[d-1]+Math.hypot(h[d][0]-h[d-1][0],h[d][1]-h[d-1][1]));const g=h.map((d,m)=>{if(m===0||m===h.length-1)return 0;const y=Zx(h,_,m,o),M=Jx(h,_,m,o);return Math.acos(Math.max(-1,Math.min(1,y[0]*M[0]+y[1]*M[1])))*(180/Math.PI)});for(let d=1;d<h.length-1;d++){if(g[d]<s)continue;let m=!0;for(let y=d-1;y>=0&&_[d]-_[y]<=o;y--)g[y]>g[d]&&(m=!1);for(let y=d+1;y<h.length&&_[y]-_[d]<=o;y++)g[y]>=g[d]&&(m=!1);m&&u.add(d)}}const f=h.map((_,g)=>[_[0],_[1],u.has(g)?"corner":"smooth"]),p=l.step??.15;return new Xs(f,{mode:"polyline",smooth:a,step:p,...l})}function Zx(n,t,e,i){let s=e-1;for(;s>0&&t[e]-t[s]<i;)s--;const o=n[e][0]-n[s][0],a=n[e][1]-n[s][1],r=Math.hypot(o,a)||1;return[o/r,a/r]}function Jx(n,t,e,i){let s=e+1;for(;s<n.length-1&&t[s]-t[e]<i;)s++;const o=n[s][0]-n[e][0],a=n[s][1]-n[e][1],r=Math.hypot(o,a)||1;return[o/r,a/r]}const Te=Math.PI*2,xn=Math.PI/180;function nl(n){if(n!=null&&n.isProfileCurve)return n;const t=Ad(n);return{isProfileCurve:!0,profile:t,length:t.length,points:t.points.map(e=>new X(e[0],e[1],0)),at(e,i){const s=t.at(Math.min(Math.max(e,0),1)*t.length,i);return{r:s.r,y:s.y,nr:s.nr,ny:s.ny}}}}function Rd(n,{u0:t=0,u1:e=1,v0:i=0,v1:s=1}={}){const o=nl(n);return(a,r,c)=>{const l=(t+(e-t)*a-.5)*Te,h=o.at(i+(s-i)*r),u=Math.sin(l),f=Math.cos(l);c.pos.set(h.r*u,h.y,h.r*f),c.nrm.set(h.nr*u,h.ny,h.nr*f)}}function Qx({profile:n,material:t,part:e="body",segments:i={density:.5},thickness:s=0,rims:o=["v1"],relief:a=null,reliefRect:r,fade:c,maxVerts:l}){const h=nl(n),u=oe({surface:Rd(h),segments:i,relief:a,reliefRect:r,fade:c??{u0:0,u1:0,v0:1.5,v1:1.5},back:s>0?{thickness:s,rims:o}:null,maxVerts:l}),f=new he(u,t);return f.userData.part=e,f.castShadow=f.receiveShadow=!0,f}const tb=["wall","registers","sectors","floor","holes","tolerance","lip","foot","ridges"];function il(n){return tb.some(t=>t in n)?eb(n):Qx(n)}function eb({profile:n,sectors:t=4,registers:e={},wall:i=3,lip:s={},floor:o,foot:a={},holes:r=[],tolerance:c=null,oval:l=1,ridges:h=null,density:u=1,quality:f=1,chord:p=.05,fade:_=1.5,material:g,interiorMaterial:d,materialFor:m,part:y="body",name:M}){var Ut;const v=n!=null&&n.isProfile?n:new Xs(n);if(h)for(const nt of h)v.addRidges(nt);const x=v.length,b=v.bounds.yMax,w=typeof i=="function"?i:()=>i,L=u*Math.sqrt(f),S=[];for(const[nt,rt]of Object.entries(e)){const H=rt||{},bt=Array.isArray(H)||["y0","s0","from"].some(Et=>Et in H)?v.setRegister(nt,(Array.isArray(H),H)):v.register(nt);S.push({...bt,name:nt,spec:Array.isArray(H)?{}:H})}for(const[nt,rt]of Object.entries(v.registers))S.find(H=>H.name===nt)||S.push({...rt,name:nt,spec:{}});S.sort((nt,rt)=>nt.s0-rt.s0);const T=Lc(t),C=nt=>{var rt;return((rt=nt==null?void 0:nt.spec)==null?void 0:rt.sectors)!=null?Lc(nt.spec.sectors):T},R=ob(c,b,l),O=r.map(nt=>ab(nt,v,b)),A=[];for(const nt of[T,...S.map(C)])for(const[rt]of nt)A.push(rt);for(const nt of O)A.push(...nt.thetas);let D=0;for(const nt of S)if(nt.spec.relief)for(let rt=nt.s0;rt<=nt.s1;rt+=Math.max(1,nt.length/40))D=Math.max(D,v.at(rt).r);const k=v.bounds.rMax,I=p/Math.max(.25,f),N=Math.ceil(Te/(2*Math.sqrt(2*I/Math.max(k,1)))),z=Math.ceil(Te*D*L),q=Math.max(64,N,z),Z=sb(q,A),Q=Z[0],U=Z.concat(Z.slice(1).map(nt=>nt+Te)),Y=(nt,rt)=>{let H=Q+Or(nt-Q,Te);H>Q+Te-1e-9&&(H-=Te);const lt=H+(rt-nt),bt=Pc(U,H),Et=Pc(U,lt),Pt=U.slice(bt,Et+1);return Pt[0]=H,Pt[Pt.length-1]=lt,Pt},G=new Set([0,x,...v.breaks()]);for(const nt of S)G.add(nt.s0),G.add(nt.s1);for(const nt of O)for(const rt of nt.ss)G.add(rt);const $=[...G].filter(nt=>nt>=0&&nt<=x).sort((nt,rt)=>nt-rt),J=[];for(let nt=0;nt<$.length-1;nt++)$[nt+1]-$[nt]>.02&&J.push([$[nt],$[nt+1]]);const it={isLatheInfo:!0,profile:v,height:b,length:x,columns:Z.length-1,sectors:T.map(([nt,rt])=>[nt/xn,rt/xn]),registers:{},deform:R};for(const nt of S){const rt=C(nt),H=v.at(nt.s0,1),lt=v.at(nt.s1,-1),bt=v.at((nt.s0+nt.s1)/2);let Et=0;for(let Pt=nt.s0;Pt<=nt.s1;Pt+=Math.max(.5,nt.length/60))Et=Math.max(Et,v.at(Pt).r);it.registers[nt.name]={name:nt.name,s0:nt.s0,s1:nt.s1,y0:nt.y0,y1:nt.y1,height:nt.length,rBottom:H.r,rTop:lt.r,rMid:bt.r,rMax:Et,sectors:rt.map(([Pt,Ot],Bt)=>rb(v,nt,Bt,rt.length,Pt,Ot))}}const ot=g||new Se,ct=d||new Se({interior:.45}),K=d||new Se({interior:1}),F=new Map,B=(nt,rt)=>{if(rt.spec.material)return rt.spec.material;if(F.has(nt))return F.get(nt);const H=m?m(nt,rt.name):new Se({relief:nt});return F.set(nt,H),H},W=s.thickness??w(x,b)*1.6,et=s.length??Math.max(6,W*3),st=(nt,rt)=>{const H=w(nt,rt);return H+(W-H)*ib((nt-(x-et))/et)},ut=v.at(0).r;let E=o;E===void 0&&(E=ut>.5?{y:w(0,0)*1.4,thickness:w(0,0)*1.4}:null);const P=E?E.y:null,tt=E?E.thickness??w(0,0)*1.5:0,dt=a.wall??w(0,0),at=E?(a.hollow??!0)&&P-tt>dt*1.5:!1;function pt(nt){const rt=v.at(nt).y;return(E&&at&&rt<P-tt?dt:st(nt,rt))+.15}it.wallAt=nt=>st(nt,v.at(nt).y),it.floorY=P;const gt=new Map,vt=[],xt=new Map,wt=nt=>S.find(rt=>nt>rt.s0+1e-6&&nt<rt.s1-1e-6)||null;for(const[nt,rt]of J){const H=wt((nt+rt)/2),lt=!!((Ut=H==null?void 0:H.spec)!=null&&Ut.relief),Et=v.samples(nt,rt,lt?{maxAngle:.05/Math.sqrt(f),maxLen:1/L}:{maxAngle:.06/Math.sqrt(f),maxLen:8/Math.sqrt(f)}).map(Ot=>(Ot-nt)/(rt-nt));Et[0]=0,Et[Et.length-1]=1,C(H).forEach(([Ot,Bt],Qt)=>{var Ys;const te=Y(Ot,Bt),Wt=te.map(Ne=>(Ne-te[0])/(te[te.length-1]-te[0]));Wt[0]=0,Wt[Wt.length-1]=1;const ee=te[0],de=te[te.length-1],Vn=(Ne,He,dn)=>{const pn=Ne<=0?ee:Ne>=1?de:ee+Ne*(de-ee),j=He<=0?nt:He>=1?rt:nt+He*(rt-nt),ht=v.at(j,He<=0?1:He>=1?-1:0),_t=Math.sin(pn),yt=Math.cos(pn);dn.pos.set(ht.r*_t,ht.y,ht.r*yt),R(dn.pos),dn.nrm.set(ht.nr*_t,ht.ny,ht.nr*yt)};let Ue=null;if(lt){const Ne=H.name+"#"+Qt;if(!xt.has(Ne)){const He=H.spec.relief,dn=it.registers[H.name].sectors[Qt];xt.set(Ne,typeof He=="function"?He(Qt,dn)||null:Array.isArray(He)?He[Qt]||null:He)}Ue=xt.get(Ne)}let Ln=null;if(Ue&&H.spec.map==="true"){const Ne=it.registers[H.name].sectors[Qt],He=H.spec.mapWidth??Math.max(Ne.widthBottom,Ne.widthTop,Ne.width),dn=(ee+de)/2;Ln=(pn,j,ht)=>{const _t=ee+Math.min(1,Math.max(0,pn))*(de-ee),yt=nt+Math.min(1,Math.max(0,j))*(rt-nt);ht[0]=.5+(_t-dn)*v.at(yt).r/He}}const ai=oe({surface:Vn,samples:{u:Wt,v:Et},relief:Ue,reliefRect:Ue?{u0:0,u1:1,v0:(H.s0-nt)/(rt-nt),v1:(H.s1-nt)/(rt-nt)}:void 0,fade:((Ys=H==null?void 0:H.spec)==null?void 0:Ys.fade)??_,normals:"surface",panelMap:Ln});if(O.length){const dn=lb(ai,O,pn=>ee+Wt[pn]*(de-ee),pn=>nt+Et[pn]*(rt-nt),Wt.length-1,Et.length-1,pn=>pt(pn));dn&&vt.push(dn)}const ci=Ue||"plain";gt.has(ci)||gt.set(ci,{geos:[],material:Ue?B(Ue,H):ot,register:H==null?void 0:H.name}),gt.get(ci).geos.push(ai)})}const St=new yn;St.name=M||y,St.userData.part=y;const ft=(nt,rt,H)=>{const lt=new he(nt,rt);return lt.userData.role=H,lt.castShadow=lt.receiveShadow=!0,St.add(lt),lt};for(const[nt,rt]of gt){const H=rt.geos.length===1?rt.geos[0]:tu(rt.geos,!1);H.computeBoundingBox(),H.computeBoundingSphere(),ft(H,rt.material,nt==="plain"?"outer":"panel:"+rt.register)}const At=v.offset((nt,rt)=>st(nt,rt),{smooth:Math.max(2,w(x/2,b/2))}),It=v.at(x,-1),Ct=At[At.length-1],kt=[];{const rt=s.shape==="flat"?.3:1,H=s.bulge??(s.shape==="flat"?.45:.6),lt=[It.r,It.y],bt=Math.hypot(lt[0]-Ct[0],lt[1]-Ct[1]),Et=[(lt[0]+Ct[0])/2,(lt[1]+Ct[1])/2],Pt=(lt[0]-Ct[0])/bt,Ot=(lt[1]-Ct[1])/bt;let Bt=It.tr,Qt=It.ty;const te=Bt*Pt+Qt*Ot;Bt-=Pt*te,Qt-=Ot*te;const Wt=Math.hypot(Bt,Qt)||1;Bt/=Wt,Qt/=Wt;for(let ee=0;ee<=14;ee++){const de=Math.PI*ee/14,Vn=Math.cos(de),Ue=Math.sin(de),Ln=Math.sign(Vn)*Math.pow(Math.abs(Vn),rt)*(bt/2),ai=Math.sign(Ue)*Math.pow(Math.abs(Ue),rt)*(bt/2)*H;kt.push([Et[0]+Pt*Ln+Bt*ai,Et[1]+Ot*Ln+Qt*ai])}kt[0]=lt,kt[14]=[Ct[0],Ct[1]]}ft(ys(kt,Z,R,{split:50}),ot,"lip");const Rt=[];for(let nt=At.length-1;nt>=0;nt--){const rt=At[nt];if(E&&rt[1]<=P){const H=At[nt+1]||rt,lt=H[1]!==rt[1]?(P-rt[1])/(H[1]-rt[1]):0;Rt.push([rt[0]+(H[0]-rt[0])*lt,P]);break}if(!E&&rt[0]<=.01){Rt.push([0,rt[1]]);break}Rt.push([rt[0],rt[1]])}let V=ru(Rt,.07,5);if(E){const rt=V[V.length-1][0],H=E.dome??Math.min(2.5,rt*.04),lt=Math.min(w(0,P)*1.2,rt*.3);for(V=V.slice(0,-1);V.length>1&&V[V.length-1][1]<P+lt;)V.pop();V.push([rt,P+lt]);for(let Et=1;Et<=4;Et++){const Pt=Et/4*(Math.PI/2);V.push([rt-lt+lt*Math.cos(Pt),P+lt-lt*Math.sin(Pt)])}const bt=10;for(let Et=1;Et<=bt;Et++){const Pt=(rt-lt)*(1-Et/bt);V.push([Pt,P+H*(1-(Pt/Math.max(.001,rt-lt))**2)])}}if(ft(ys([[Ct[0],Ct[1]],...V.slice(1)],Z,R,{split:40}),ct,"inner"),ut>.01){const nt=[];if(at){const rt=P-tt,H=v.offset(dt,{smooth:Math.max(1.5,dt)}),lt=[];for(const Ot of H){if(Ot[1]>=rt)break;lt.push([Ot[0],Math.max(0,Ot[1])])}const bt=lt.length?lt[lt.length-1][0]:ut-dt;nt.push([0,rt-Math.min(1.5,bt*.02)]);for(let Ot=1;Ot<=6;Ot++){const Bt=bt*Ot/6;nt.push([Bt,rt-Math.min(1.5,bt*.02)*(1-(Bt/bt)**2)])}const Et=ru(lt.slice().reverse(),.07,5);for(const Ot of Et)Ot[1]<rt-.05&&nt.push(Ot);const Pt=nt[nt.length-1];Pt[1]>.001&&nt.push([Pt[0],0]),nt.push([ut,0]),ft(ys(nt.slice(0,-2).concat([nt[nt.length-2]]),Z,R,{split:40}),K,"foot-inner"),ft(ys(nt.slice(-2),Z,R,{split:40}),ot,"foot-ring")}else ft(ys([[0,0],[ut,0]],Z,R,{split:40}),ot,"base")}vt.length&&ft(vt.length===1?vt[0]:tu(vt,!1),K,"holes");const Tt=new X;return it.frame=(nt,rt,H=0)=>{const lt=nt*xn,bt=Math.min(Math.max(rt,0),x),Et=v.at(bt,H),Pt=Math.sin(lt),Ot=Math.cos(lt),Bt=rt-bt,Qt=new X((Et.r+Et.tr*Bt)*Pt,Et.y+Et.ty*Bt,(Et.r+Et.tr*Bt)*Ot),te=R(Qt.clone()),Wt=new X(Et.nr*Pt,Et.ny,Et.nr*Ot),ee=new X(Et.tr*Pt,Et.ty,Et.tr*Ot),de=R(Tt.copy(Qt).addScaledVector(ee,1)).sub(te).normalize(),Vn=new X(Ot,0,-Pt),Ue=new X().crossVectors(Vn,de).normalize();return Ue.dot(Wt)<0&&Ue.negate(),{p:te,n:Ue,d:de,b:new X().crossVectors(de,Ue).normalize(),r:Et.r,y:Et.y}},it.sAtY=(nt,rt)=>v.sAtY(nt,rt),it.range=nt=>Cc(v,it,nt),it.meridian=(nt,rt)=>{const[H,lt]=Cc(v,it,rt);return{isPath:!0,planar:!0,kind:"meridian",theta:nt,s0:H,s1:lt,length:lt-H,frame:bt=>{const Et=lt-H,Pt=Math.min(Math.max(bt,0),Et),Ot=it.frame(nt,H+Pt,Pt<=0?1:Pt>=Et?-1:0);return bt!==Pt&&Ot.p.addScaledVector(Ot.d,bt-Pt),Ot}}},St.userData.lathe=it,St.userData.registers=it.registers,St}function nb(n,{azimuths:t=[0,90,180,270],ranges:e,gap:i=1.5,seed:s=1,...o}={}){const a=n.userData.lathe,r=[];let c=0;for(const l of t)for(const h of e||[null]){const u=h&&typeof h=="object"&&"range"in h?h:{range:h},{range:f,gap:p=i,..._}=u,[g,d]=a.range(f),m=a.meridian(l,{s0:g+(_.gap0??p),s1:d-(_.gap1??p)});delete _.gap0,delete _.gap1;const y={...o,..._};r.push(tl({...y,path:m,seed:s*7919+c++*131+Math.round(l)}))}return r}function ib(n){return n=Math.min(1,Math.max(0,n)),n*n*(3-2*n)}function Or(n,t){return(n%t+t)%t}function Pc(n,t){let e=0,i=n.length-1;for(;i-e>1;){const s=e+i>>1;n[s]<=t?e=s:i=s}return Math.abs(n[e]-t)<=Math.abs(n[i]-t)?e:i}function Lc(n){let t;if(typeof n=="number"||(n==null?void 0:n.count)!=null){const i=typeof n=="number"?n:n.count,s=((n==null?void 0:n.center)??0)*xn;t=[];for(let o=0;o<i;o++)t.push(s+(o-.5)*(Te/i))}else if(n!=null&&n.bounds)t=n.bounds.map(i=>i*xn);else if(Array.isArray(n))t=n.map(i=>i*xn);else throw new Error("lathe: bad sectors spec");const e=[];for(let i=0;i<t.length;i++){const s=t[i];let o=i+1<t.length?t[i+1]:t[0]+Te;for(;o<=s;)o+=Te;e.push([s,o])}return e}function sb(n,t){const e=[...new Set(t.map(a=>Or(a,Te)))].sort((a,r)=>a-r),i=e.length?e[0]:0,s=Te/n,o=[];for(let a=0;a<=n;a++)o.push(i+a*s);for(const a of e){const r=i+Or(a-i,Te),c=Pc(o,r);Math.abs(o[c]-r)<s*.35&&c!==0&&c!==o.length-1?o[c]=r:Math.abs(o[c]-r)>1e-9&&o.splice(o[c]<r?c+1:c,0,r)}return o[o.length-1]=o[0]+Te,o}function ob(n,t,e=1){if(!n&&e===1)return p=>p;if(!n)return p=>(p.z/=e,p);const i={seed:1,ovality:0,rim:0,lean:0,...n},s=new Be(i.seed),o=s.range(0,Te),a=s.range(0,Te),r=s.range(0,Te),c=s.range(0,Te),l=s.range(.55,1),h=s.range(.35,.8),u=i.rim*t/2,f=Math.tan((i.lean||0)*xn);return p=>{const _=Math.atan2(p.x,p.z),g=1+i.ovality*Math.cos(2*(_-o));if(p.x*=g,p.z*=g,u){const d=Math.max(0,p.y/t)**2;p.y+=u*d*(l*Math.cos(_-a)+h*Math.cos(2*(_-r)))/(l+h)}return f&&(p.x+=p.y*f*Math.sin(c),p.z+=p.y*f*Math.cos(c)),e!==1&&(p.z/=e),p}}function Cc(n,t,e){if(e==null)return[0,n.length];if(typeof e=="string"){const i=t.registers[e]||n.registers[e];if(!i)throw new Error(`lathe: no register '${e}'`);return[i.s0,i.s1]}if(Array.isArray(e))return[n.sAtY(e[0]),n.sAtY(e[1],{from:"top"})];if("s0"in e)return[e.s0,e.s1];if("y0"in e)return[n.sAtY(e.y0),n.sAtY(e.y1,{from:"top"})];if("register"in e){const[i,s]=Cc(n,t,e.register);return[i+(e.inset0??e.inset??0),s-(e.inset1??e.inset??0)]}throw new Error("lathe: bad range")}function rb(n,t,e,i,s,o){const a=o-s,r=u=>n.at(t.s0+Math.min(Math.max(u,0),t.length)),c=u=>r(u).r*a,l=c(t.length/2),h={register:t.name,sector:e,sectors:i,theta0:s/xn,theta1:o/xn,center:(s+o)/2/xn,width:l,height:t.length,widthBottom:c(0),widthTop:c(t.length),rBottom:r(0).r,rTop:r(t.length).r,rMid:r(t.length/2).r,widthAt:c,toPanel:(u,f=l)=>[f/2+u[0]*f/c(u[1]),u[1]],fromPanel:(u,f=l)=>[(u[0]-f/2)*c(u[1])/f,u[1]]};return h.map=(u,f=l)=>u.map(p=>h.toPanel(p,f)),h}function ab(n,t,e){const i=n.s??t.sAtY(n.y),s=t.at(i).r,o=(n.azimuth??0)*xn,a=n.shape||"cross",r=n.arm??e*.02,c=n.width??Math.max(2,e*.008);let l,h;a==="cross"?(l=[r,c/2],h=[c/2,r]):(l=[(n.w??c)/2],h=[(n.h??r*2)/2]);const u=[],f=[];for(const _ of l)u.push(o-_/s,o+_/s);for(const _ of h)f.push(i-_,i+_);return{thetas:u,ss:f,inside:(_,g)=>{const d=cb(_,o)*s,m=g-i;for(let y=0;y<l.length;y++)if(Math.abs(d)<l[y]&&Math.abs(m)<h[y])return!0;return!1}}}function cb(n,t){return Or(n-t+Math.PI,Te)-Math.PI}function lb(n,t,e,i,s,o,a){const r=(y,M)=>t.some(v=>v.inside(y,M)),c=n.index.array,l=[],h=n.attributes.position.array,u=n.attributes.normal.array,f=s+1,p=[],_=[],g=1e-5;let d=!1;for(let y=0;y<o;y++)for(let M=0;M<s;M++){const v=(y*s+M)*6,x=(e(M)+e(M+1))/2,b=(i(y)+i(y+1))/2;if(!r(x,b)){for(let S=0;S<6;S++)l.push(c[v+S]);continue}d=!0;const w=hb(h,[y*f+M,y*f+M+1,(y+1)*f+M,(y+1)*f+M+1]),L=[[y*f+M,y*f+M+1,x,i(y)-g],[y*f+M+1,(y+1)*f+M+1,e(M+1)+g,b],[(y+1)*f+M+1,(y+1)*f+M,x,i(y+1)+g],[(y+1)*f+M,y*f+M,e(M)-g,b]];for(const[S,T,C,R]of L){if(r(C,R))continue;const O=a(b),A=[h[S*3],h[S*3+1],h[S*3+2]],D=[h[T*3],h[T*3+1],h[T*3+2]],k=[A[0]-u[S*3]*O,A[1]-u[S*3+1]*O,A[2]-u[S*3+2]*O],I=[D[0]-u[T*3]*O,D[1]-u[T*3+1]*O,D[2]-u[T*3+2]*O],N=ja(D,A),z=ja(k,A);let q=fb(N,z);const Z=[(A[0]+D[0])/2,(A[1]+D[1])/2,(A[2]+D[2])/2],Q=ja(w,Z);let U=[A,D,I,k];ub(q,Q)<0&&(U=[D,A,k,I],q=q.map(G=>-G));const Y=Math.hypot(...q)||1;for(const G of[0,1,2,0,2,3])p.push(...U[G]),_.push(q[0]/Y,q[1]/Y,q[2]/Y)}}if(!d)return null;n.setIndex(l);const m=new Ge;return m.setAttribute("position",new fe(p,3)),m.setAttribute("normal",new fe(_,3)),m.setAttribute("uv",new fe(new Float32Array(p.length/3*2).fill(-1),2)),m.setIndex([...Array(p.length/3).keys()]),m}function hb(n,t){const e=[0,0,0];for(const i of t)e[0]+=n[i*3],e[1]+=n[i*3+1],e[2]+=n[i*3+2];return e.map(i=>i/t.length)}const ja=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],ub=(n,t)=>n[0]*t[0]+n[1]*t[1]+n[2]*t[2],fb=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]];function ru(n,t,e){if(n.length<3)return n.slice();const i=[n[0]];let s=n[0],o=null;for(let a=1;a<n.length-1;a++){const r=n[a],c=r[0]-s[0],l=r[1]-s[1],h=Math.hypot(c,l);if(h<1e-6)continue;const u=[c/h,l/h];if(o||(o=u),Math.acos(Math.max(-1,Math.min(1,u[0]*o[0]+u[1]*o[1])))>t||h>e){const p=n[a-1]!==s?n[a-1]:r;i.push(p),s=p,o=null}}return i.push(n[n.length-1]),i}function ys(n,t,e=s=>s,{split:i=40}={}){const s=n.length,o=[];for(let y=0;y<s-1;y++){const M=n[y+1][0]-n[y][0],v=n[y+1][1]-n[y][1],x=Math.hypot(M,v)||1;o.push([M/x,v/x,x])}const a=[];let r=0;const c=Math.cos(i*xn);for(let y=0;y<s;y++){y>0&&(r+=o[y-1][2]);const M=o[y-1],v=o[y],x=b=>[b[1],-b[0]];if(M&&v&&M[0]*v[0]+M[1]*v[1]<c)a.push({r:n[y][0],y:n[y][1],n:x(M),s:r}),a.push({r:n[y][0],y:n[y][1],n:x(v),s:r,gap:!0});else{const b=M&&v?[M[0]+v[0],M[1]+v[1]]:M||v,w=Math.hypot(b[0],b[1])||1;a.push({r:n[y][0],y:n[y][1],n:x([b[0]/w,b[1]/w]),s:r})}}const l=t.length,h=a.length*l,u=new Float32Array(h*3),f=new Float32Array(h*3),p=new Float32Array(h*2),_=new X,g=Math.max(r,1e-6);a.forEach((y,M)=>{for(let v=0;v<l;v++){const x=t[v],b=Math.sin(x),w=Math.cos(x);_.set(y.r*b,y.y,y.r*w),e(_);const L=(M*l+v)*3;u[L]=_.x,u[L+1]=_.y,u[L+2]=_.z,f[L]=y.n[0]*b,f[L+1]=y.n[1],f[L+2]=y.n[0]*w,p[(M*l+v)*2]=(x-t[0])/Te,p[(M*l+v)*2+1]=y.s/g}});const d=[];for(let y=0;y<a.length-1;y++)if(!a[y+1].gap)for(let M=0;M<l-1;M++){const v=y*l+M,x=v+1,b=v+l+1,w=v+l;d.push(v,x,b,v,b,w)}const m=new Ge;return m.setAttribute("position",new _e(u,3)),m.setAttribute("normal",new _e(f,3)),m.setAttribute("uv",new _e(p,2)),m.setIndex(h>65535?new Co(d,1):new Lo(d,1)),m.computeBoundingBox(),m.computeBoundingSphere(),m}const ue=["front","right","back","left"],Ao=["front-right","right-back","back-left","left-front"],ln=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]],zr=[[1,0,0],[0,0,-1],[-1,0,0],[0,0,1]],vn=-1e9,Fn=(n,t,e)=>Math.min(e,Math.max(t,n)),se=(n,t,e)=>n+(t-n)*e,co=n=>n*Math.PI/180;function kc(n,t){if(t<=0)return n>0?1:0;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Pd({width:n,depth:t,height:e,taper:i=0,top:s=null,flare:o=0,at:a="bottom",bulge:r=0,bulgeAt:c=.5,cornerRadius:l=0,profile:h=null}){const u=e,f=typeof i=="number"?i:i.x??0,p=typeof i=="number"?i:i.z??0;let _,g,d,m;s?(_=n/2,g=t/2,d=s.width/2,m=s.depth/2):o?(_=n/2,g=t/2,d=_*(1+o),m=g*(1+o)):a==="top"?(d=n/2,m=t/2,_=d-u*Math.tan(co(f)),g=m-u*Math.tan(co(p))):(_=n/2,g=t/2,d=_+u*Math.tan(co(f)),m=g+u*Math.tan(co(p)));const y=c>0&&c<1?Math.log(.5)/Math.log(c):1,M=typeof r=="number"?r:r.x??0,v=typeof r=="number"?r:r.z??0,x={a:0,b:0,r:0},b=w=>{const L=Fn(w/u,0,1),S=Math.sin(Math.PI*Math.pow(L,y));let T=se(_,d,L)+M*S,C=se(g,m,L)+v*S;if(h){const R=h(L);T+=R.dx??R.d??0,C+=R.dz??R.d??0}return x.a=T,x.b=C,x.r=Math.min(l,T,C),x};return b.H=u,b.dims={a0:_,b0:g,a1:d,b1:m},b}function Dc(n,t,e,i){const s=Math.min(n.a,n.b);t<-s&&(t=-s);const o=Math.max(0,n.a+t),a=Math.max(0,n.b+t);let r=n.r>0?Math.max(0,n.r+t):0;return t<0&&e>0&&(r=Math.max(r,e*Math.min(1,-t/Math.max(i,1e-6)))),r=Math.min(r,o,a),{A:o,B:a,R:r,d:t}}function db(n){const t=(e,i)=>{let s=e*374761393+i*668265263+n*1442695041|0;return s=Math.imul(s^s>>>13,1274126177),((s^s>>>16)>>>0)/4294967296};return(e,i)=>{const s=Math.floor(e),o=Math.floor(i),a=e-s,r=i-o,c=a*a*(3-2*a),l=r*r*(3-2*r),h=t(s,o),u=t(s+1,o),f=t(s,o+1),p=t(s+1,o+1);return(h+(u-h)*c+(f-h)*l+(h-u-f+p)*c*l)*2-1}}function pb(n,t,e){if(!n)return null;const i=n===!0?{}:n,s=new Be(i.seed??7),o=t/300,a={sagK:[0,1,2,3].map(()=>(i.sag??.003)*s.range(.5,1.2)),rim:i.rim??.006*t,wave:i.wave??Math.min(.6,.15*Math.max(1,o)),waveLength:i.waveLength??40*Math.max(1,Math.sqrt(o)),skew:Math.tan(co(i.skew??s.jitter(.6))),noise:db(s.int(1,1e6))},r=s.range(0,Math.PI*2),c=s.range(-.6,.6);return a.level=[Math.cos(r)*.5*a.rim,Math.sin(r)*.5*a.rim,c*.5*a.rim],a.a=Math.max(e.a0,e.a1),a.b=Math.max(e.b0,e.b1),a}function Ld({sec:n,H:t,cast:e,innerR:i,wall:s,yBase:o=0,span:a}){const r=new X;function c(u,f,p,_,g=r){const d=n(Fn(_,0,t)),{A:m,B:y,R:M}=Dc(d,p,i,s),v=(u&1)===0,x=v?y:m,b=(v?m:y)-M,w=(2*f-1)*b,L=ln[u],S=zr[u];if(g.set(L[0]*x+S[0]*w,_,L[2]*x+S[2]*w),e){const T=Math.min(d.a,d.b),C=Fn(1+Math.max(p,-T)/T,0,1.3),R=a[u],O=4*f*(1-f);let A=e.sagK[u]*R*O;e.wave&&(A+=e.wave*Math.min(1,2*O)*e.noise(f*R/e.waveLength+u*17.3,_/e.waveLength)),g.x+=L[0]*A*C,g.z+=L[2]*A*C}return h(g,_)}function l(u,f,p,_,g=r){const d=n(Fn(_,0,t)),{A:m,B:y,R:M}=Dc(d,p,i,s),v=(u&1)===0,x=v?y:m,b=(v?m:y)-M,w=ln[u],L=zr[u],S=f*Math.PI*.5,T=w[0]*(x-M)+L[0]*b,C=w[2]*(x-M)+L[2]*b;return g.set(T+M*(w[0]*Math.cos(S)+L[0]*Math.sin(S)),_,C+M*(w[2]*Math.cos(S)+L[2]*Math.sin(S))),h(g,_)}function h(u,f){if(e){const p=Fn(f/t,0,1),_=u.x/e.a,g=u.z/e.b;u.y+=p*(e.level[0]*_+e.level[1]*g+e.level[2]*_*g),u.x+=e.skew*u.z}return u.y+=o,u}return{side:c,corner:l,field:h,sec:n,H:t}}function au(n){const t=n.filter((s,o)=>o===0||Math.hypot(s[0]-n[o-1][0],s[1]-n[o-1][1])>1e-6||s[0]===vn),e=[];let i=[[t[0][0],t[0][1]]];for(let s=1;s<t.length;s++){const o=t[s],a=o[2]??0,r=s===t.length-1;if(!r&&a>0&&o[0]!==vn&&t[s-1][0]!==vn&&t[s+1][0]!==vn){const c=t[s-1],l=t[s+1],h=qa([c[0]-o[0],c[1]-o[1]]),u=qa([l[0]-o[0],l[1]-o[1]]),f=Math.hypot(c[0]-o[0],c[1]-o[1]),p=Math.hypot(l[0]-o[0],l[1]-o[1]),_=Fn(h[0]*u[0]+h[1]*u[1],-1,1),g=Math.acos(_);if(g>.001&&g<Math.PI-.001){let d=a/Math.tan(g/2);const m=.49*Math.min(f,p),y=d>m?m*Math.tan(g/2):a;d=Math.min(d,m);const M=[o[0]+h[0]*d,o[1]+h[1]*d],v=[o[0]+u[0]*d,o[1]+u[1]*d],x=qa([h[0]+u[0],h[1]+u[1]]),b=y/Math.sin(g/2),w=[o[0]+x[0]*b,o[1]+x[1]*b];let L=Math.atan2(M[1]-w[1],M[0]-w[0]),T=Math.atan2(v[1]-w[1],v[0]-w[0])-L;for(;T>Math.PI;)T-=2*Math.PI;for(;T<-Math.PI;)T+=2*Math.PI;const C=Math.max(3,Math.ceil(Math.abs(T)/(Math.PI/10)));for(let R=0;R<=C;R++){const O=L+T*R/C;i.push([w[0]+y*Math.cos(O),w[1]+y*Math.sin(O)]),o[3]==="split"&&R===C>>1&&(e.push(i),i=[i[i.length-1]])}continue}}i.push([o[0],o[1]]),!r&&!(a>0)&&(e.push(i),i=[[o[0],o[1]]])}return i.length>1&&e.push(i),e}function qa(n){const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]}function cu(n,t){const e=[n[0]];for(let i=1;i<n.length;i++){const s=n[i-1],o=n[i];if(s[0]===vn||o[0]===vn){e.push(o);continue}const a=Math.max(1,Math.ceil(Math.hypot(o[0]-s[0],o[1]-s[1])/t));for(let r=1;r<=a;r++)e.push([se(s[0],o[0],r/a),se(s[1],o[1],r/a)])}return e}const io=new X,lu=new X,so=new X,hu=new X;function Xe(n,t){return(i,s,o)=>{n(i,s,o.pos),n(Math.min(1,i+.001),s,io),n(Math.max(0,i-.001),s,lu),n(i,Math.min(1,s+.001),so),n(i,Math.max(0,s-.001),hu),io.sub(lu),so.sub(hu),o.nrm.crossVectors(io,so);const a=o.nrm.length();a>1e-9*Math.max(1,io.lengthSq(),so.lengthSq())&&io.lengthSq()>1e-12&&so.lengthSq()>1e-12?o.nrm.multiplyScalar(1/a):t?t(i,s,o.nrm):o.nrm.set(0,1,0)}}function Wi(n,t,e,i){const s=new he(n,t);return s.name=i,s.userData.part=e,s.castShadow=s.receiveShadow=!0,s}function xr(n,t,{material:e,part:i,name:s,segLen:o=40,sides:a=!0,corners:r=!0,hasCorners:c,profileNormal:l=!0}){const h=[],u=t.length-1,f=_=>{const g=_*u,d=Math.min(u-1,Math.floor(g)),m=g-d,y=t[d],M=t[d+1];return[y[0]===vn||M[0]===vn?m<.5?y[0]:M[0]:se(y[0],M[0],m),se(y[1],M[1],m),d]},p=(_,g,d)=>(m,y,M)=>{const[,,v]=f(y),x=t[v],b=t[v+1];let w=b[0]-x[0];b[0]===vn&&(w=-1),x[0]===vn&&(w=1);const L=b[1]-x[1],S=Math.hypot(w,L)||1,T=L/S,C=-w/S;let R=ln[_][0],O=ln[_][2];if(g){const A=m*Math.PI*.5;R=ln[_][0]*Math.cos(A)+zr[_][0]*Math.sin(A),O=ln[_][2]*Math.cos(A)+zr[_][2]*Math.sin(A)}M.set(T*R,C,T*O).normalize()};for(let _=0;_<4;_++){if(a){const g=n.span[_],d=Math.max(2,Math.ceil(g/o)),m=oe({surface:Xe((y,M,v)=>{const[x,b]=f(M);n.side(_,y,x,b,v)},p(_,!1)),segments:[d,u]});h.push(Wi(m,e,i,`${s}-${ue[_]}`))}if(r&&c){const g=oe({surface:Xe((d,m,y)=>{const[M,v]=f(m);n.corner(_,d,M,v,y)},p(_,!0)),segments:[6,u]});h.push(Wi(g,e,i,`${s}-${Ao[_]}`))}}return h}function uu(n,t){const e=n.map(h=>typeof h=="number"?{mm:h}:h.weight!=null?{weight:h.weight}:{mm:h.h??h.w??h.mm}),i=e.reduce((h,u)=>h+(u.mm??0),0),s=e.reduce((h,u)=>h+(u.weight??0),0);let o=1,a=t-i;s===0&&(o=t/(i||1));const r=e.map(h=>h.mm!=null?h.mm*(s===0?o:1):Math.max(0,a)*h.weight/s),c=[];let l=0;for(const h of r)c.push([l/t,(l+h)/t]),l+=h;return c.length&&(c[c.length-1][1]=1),c}function Zr(n,t){if(!n)return;const e=ue[t];if(n[e]!==void 0)return n[e];const i=t%2===0?"long":"short";return n[i]!==void 0?n[i]:n.all}function Cd(n){const t=Pd(n),e=n.height,i=n.grid??n.grids??null,s={sides:{},section:t,H:e},o=(a,r)=>{const c=t(Fn(r,0,e));return(a&1?c.b:c.a)-c.r};for(let a=0;a<4;a++){let r=Zr(i,a);i&&(i.rows||i.cols)&&!r&&(r=i),r=r||{};const c=r.rows||[{weight:1}],l=r.cols||[{weight:1}],h=2*o(a,e/2),u=uu(c,e),f=uu(l,h),p=u.map(([d,m])=>({y0:e*(1-m),y1:e*(1-d)})),_=f.map(([d,m])=>({s0:d,s1:m})),g=p.map((d,m)=>_.map((y,M)=>{const v=[];for(let S=0;S<=8;S++)v.push(se(d.y0,d.y1,S/8));const x=v.map(S=>(y.s1-y.s0)*2*o(a,S)),b=Math.max(...x);let w=0;for(let S=1;S<v.length;S++){const T=o(a,v[S])-o(a,v[S-1]),C=a&1?t(v[S]).a-t(v[S-1]).a:t(v[S]).b-t(v[S-1]).b;w+=Math.hypot(v[S]-v[S-1],C,T*(y.s0+y.s1-1))}const L=[];v.forEach((S,T)=>L.push([(b-x[T])/2,w*T/8]));for(let S=v.length-1;S>=0;S--)L.push([(b+x[S])/2,w*S/8]);return{side:ue[a],row:m,col:M,s0:y.s0,s1:y.s1,y0:d.y0,y1:d.y1,w:x[4],h:w,wBottom:x[0],wTop:x[8],wMax:b,outline:L}}));s.sides[ue[a]]={rows:p,cols:_,cells:g}}return n.foot&&(s.foot=Mb(n,t)),s}function mb(n){var Z,Q;const{height:t,wall:e=8,cornerRadius:i=0,material:s=new Se,density:o=1,plainDensity:a=.06,part:r="body",panels:c=null}=n,l=n.interiorMaterial||new Se({interior:1}),h=n.innerRadius??e*.5,u=Cd(n),f=u.section,p=n.foot?n.foot.height:0,_=pb(n.cast,t,f.dims),g=[0,1,2,3].map(U=>{const Y=f(t/2);return 2*((U&1?Y.b:Y.a)-Y.r)}),d=Ld({sec:f,H:t,cast:_,innerR:h,wall:e,yBase:p,span:g});d.span=g;const m=i>0||h>0,y=new yn;y.name="fang-body",y.userData.part=r;const M=((Z=n.floor)==null?void 0:Z.thickness)??e,v=((Q=n.floor)==null?void 0:Q.round)??e*.8,x=n.rim===!1?{kind:"none"}:{kind:"plain",...n.rim},b=x.round??Math.max(.6,e*.12),w=x.inner??0,L=[[0,t,0]];let S=t,T=0;if(x.kind==="slab"){const U=x.height??e*2,Y=x.overhang??e*.5;L.push([Y,t,b*.6],[Y,t+U,b],[-(e+w),t+U,b,"split"]),S=t+U,T=Y,w>0&&L.push([-(e+w),t+U-Math.min(U*.5,w),e*.3],[-e,t+U-Math.min(U*.5,w)-w*1.2,e*.6])}else if(x.kind==="plain"){const U=x.height??0;U>0&&L.push([0,t+U,b]),L.push([-(e+w),t+U,b,"split"]),S=t+U,w>0&&L.push([-e,t+U-w*1.5,e*.5])}else L.push([-e,t,0]);L.push([-e,M,v],[vn,M,0]);const C=[[vn,0,0],[0,0,0]],R=1/a;for(const U of au(C))y.add(...xr(d,U,{material:s,part:r,name:"underside",segLen:R*1.5,hasCorners:m}));au(L).forEach((U,Y)=>{const G=Y>0;y.add(...xr(d,cu(U,R),{material:G?l:s,part:r,name:G?"inner":"rim",segLen:R,hasCorners:m}))}),i>0&&y.add(...xr(d,cu([[0,0],[0,t]],R),{material:s,part:r,name:"arris",sides:!1,hasCorners:!0}));const A=new Map,D=U=>U.material?U.material:(A.has(U.relief)||A.set(U.relief,new Se({relief:U.relief})),A.get(U.relief));for(let U=0;U<4;U++){const Y=u.sides[ue[U]],G=c&&c[ue[U]],$=Zr(n.cells,U);Y.cells.forEach((J,it)=>J.forEach((ot,ct)=>{var F;let K=G&&Y.cells.length===1&&J.length===1?G:(F=$==null?void 0:$[it])==null?void 0:F[ct];K===void 0&&n.relief&&(K=n.relief(ot)),K&&K.macro&&(K={relief:K}),K&&!K.relief&&(K=K.material?K:null),ot.mesh=gb(d,U,ot,K,{density:o,plainSeg:R,material:s,matFor:D,part:r,H:t}),y.add(ot.mesh)}))}let k=null;n.foot&&(k=xb(n,f,u.foot,{material:s,interiorMaterial:l,part:n.foot.part??"foot",density:o,plainSeg:R,cast:_,matFor:D}),y.add(k));const I=U=>U.clone(),N={};for(let U=0;U<4;U++){const Y=u.sides[ue[U]],G=[d.side(U,0,0,0).clone(),d.side(U,1,0,0).clone(),d.side(U,0,0,t).clone(),d.side(U,1,0,t).clone()],$=new X().subVectors(G[1],G[0]).cross(new X().subVectors(G[2],G[0])).normalize();N[ue[U]]={corners:G,normal:$,axis:[I(d.side(U,.5,0,0)),I(d.side(U,.5,0,t))],registers:Y.rows.map(J=>[J.y0+p,J.y1+p]),columns:Y.cols.map(J=>[J.s0,J.s1]),cells:Y.cells.map(J=>J.map(({mesh:it,...ot})=>ot))}}const z={};for(let U=0;U<4;U++){const Y=ot=>i>0?d.corner(U,.5,0,ot).clone():d.side(U,1,0,ot).clone(),G=Y(0),$=Y(t),J=ln[U],it=ln[(U+1)%4];z[Ao[U]]={bottom:G,top:$,out:new X(J[0]+it[0],0,J[2]+it[2]).normalize()}}const q=f(t);return y.userData.walls=N,y.userData.corners=z,y.userData.layout=u,y.userData.rim={kind:x.kind,y:S+p,wallTop:t+p,outer:{a:q.a+T,b:q.b+T},inner:{a:q.a-e-w,b:q.b-e-w}},y.userData.floorY=M+p,y.userData.footHeight=p,y.userData.at=(U,Y,G,$=0)=>d.side(typeof U=="number"?U:ue.indexOf(U),Y,$,G).clone(),y.userData.rimTop=(U,Y,G=.5)=>{const $=typeof U=="number"?U:ue.indexOf(U);return d.side($,Y,se(T,-(e+w),G),S).clone()},y.userData.legSeat=(U,Y)=>{const G=typeof U=="number"?U:Ao.indexOf(U),$=f(0),J=ln[G],it=ln[(G+1)%4],ot=(J[0]+it[0])*($.a-Y),ct=(J[2]+it[2])*($.b-Y),K=new X(ot,0,ct);return d.field(K,0),K},y}function gb(n,t,e,i,{density:s,plainSeg:o,material:a,matFor:r,part:c,H:l}){const{s0:h,s1:u,y0:f,y1:p}=e,g=Xe((x,b,w)=>n.side(t,se(h,u,x),0,se(f,p,b),w)),d=`wall-${ue[t]}-r${e.row}c${e.col}`;if(!i){const x=Math.max(2,Math.ceil(e.w/o)),b=Math.max(2,Math.ceil(e.h/o));return Wi(oe({surface:g,segments:[x,b]}),a,c,d)}let m=null;const y=i.fade??1.5;if(i.map==="true"){const x=(h+u)/2,b=e.wMax;m=(w,L,S)=>{const T=se(f,p,L),C=_b(n,t,T),R=se(h,u,w);S[0]=.5+(R-x)*2*C/b,S[2]=kc(Math.min(R-h,u-R)*2*C,y)}}const M=oe({surface:g,segments:{density:i.density??s},relief:i.relief,reliefRect:i.reliefRect,fade:i.map==="true"?{u0:0,u1:0,v0:y,v1:y}:y,reliefScale:i.reliefScale??1,panelMap:m,maxVerts:i.maxVerts}),v=Wi(M,r(i),c,d);return v.userData.cell={side:ue[t],row:e.row,col:e.col},v}function _b(n,t,e){const i=n.sec(Fn(e,0,n.H));return(t&1?i.b:i.a)-i.r}function Mb(n,t){const e=n.foot,i=e.height,s=t(0),o=e.inset??0,a=e.flare??0,r={};for(let c=0;c<4;c++){const l=(c&1?s.b:s.a)-o+a,h=Math.max(0,Math.min(s.r-o+a,l)),u=l-h,f=Zr(e.notch&&(e.notch.width!=null||e.notch.height!=null)?{all:e.notch}:e.notch,c);let p=null;if(f){const _=f.width<=1?f.width*2*((c&1?s.b:s.a)-o-Math.max(0,s.r-o)):f.width,g=f.height<=1?f.height*i:f.height;p={w:_,h:g,shape:f.shape??"arch",spring:f.spring??.55,round:f.round??Math.min(_,g)*.12},p.outline=yb(p)}r[ue[c]]={w:2*u,h:i,notch:p,panelOutline:p?p.outline.map(([_,g])=>[_+u,g]):null}}return{height:i,sides:r}}function Ic(n,t){const e=n.w/2,i=Math.min(1,Math.abs(t)/e);if(n.shape==="rect"){const o=Math.min(n.round,e*.9,n.h*.9),a=Math.abs(t)-(e-o);return a<=0?n.h:n.h-o+Math.sqrt(Math.max(0,o*o-a*a))}const s=n.h*n.spring;return s+(n.h-s)*Math.sqrt(Math.max(0,1-i*i))}function yb(n,t=24){const e=n.w/2,i=[[-e,0]];for(let s=0;s<=t;s++){const o=-e+n.w*s/t;i.push([o,Ic(n,o)])}return i.push([e,0]),i}function vb(n,t,e){let i=1/0;for(let s=1;s<n.length;s++){const o=n[s-1],a=n[s],r=a[0]-o[0],c=a[1]-o[1],l=r*r+c*c||1,h=Fn(((t-o[0])*r+(e-o[1])*c)/l,0,1);i=Math.min(i,Math.hypot(t-o[0]-r*h,e-o[1]-c*h))}return i}function xb(n,t,e,{material:i,interiorMaterial:s,part:o,density:a,plainSeg:r,cast:c,matFor:l}){const h=n.foot,u=h.height,f=h.thickness??n.wall??6,p=h.inset??0,_=h.flare??0,g=t(0),d=n.cornerRadius>0?Math.max(0,h.cornerRadius??n.cornerRadius-p):h.cornerRadius??0,m=R=>{const O=_*(1-Fn(R/u,0,1));return{a:g.a-p+O,b:g.b-p+O,r:d>0?d+O:0}};m.H=u;const y=c?c.skew:0,M=Ld({sec:m,H:u,cast:null,innerR:0,wall:f,yBase:0,span:[0,0,0,0]}),v=M.side;M.side=(R,O,A,D,k)=>{const I=v(R,O,A,D,k);return I.x+=y*I.z,I};const x=M.corner;M.corner=(R,O,A,D,k)=>{const I=x(R,O,A,D,k);return I.x+=y*I.z,I},M.span=[0,1,2,3].map(R=>2*((R&1?m(u/2).b:m(u/2).a)-m(u/2).r));const b=new yn;b.name="fang-foot",b.userData.part=o;const w=d>0,L=(R,O,A=0)=>{const D=m(O),{A:k,B:I,R:N}=Dc(D,A,0,f);return(R&1?I:k)-N},S=(R,O,A,D)=>{const k=L(R,A,D);return k>0?(O/k+1)/2:.5};for(let R=0;R<4;R++){const O=e.sides[ue[R]],A=O.notch;let D=Zr(h.relief,R);D&&D.macro&&(D={relief:D});const k=O.w,I=(Q,U)=>D?(Y,G,$)=>{const J=Q(Y,G),it=U(Y,G);$[0]=(J+k/2)/k,$[1]=it/u;let ot=kc(Math.min(J+L(R,it),L(R,it)-J),D.fade??1.5);A&&(ot*=kc(vb(A.outline,J,it),D.notchFade??3)),$[2]=ot}:null,N=(Q,U,Y,G,$,J)=>{const it=(F,B,W)=>{const et=U(F,B),st=Y(F,B);return M.side(R,S(R,et,st,G),G,st,W)},ot=L(R,0),ct=J&&D?{density:D.density??a}:[Math.max(2,Math.ceil(2*ot/r)),Math.max(2,Math.ceil(u/Math.min(r,6)))],K=oe({surface:Xe(it),segments:ct,relief:J&&D?D.relief:null,fade:0,panelMap:J?I(U,Y):null});b.add(Wi(K,$,o,`foot-${Q}-${ue[R]}`))},z=A?A.w/2:0,q=(Q,U)=>L(R,Q,U);if(A){for(const[Q,U,Y]of[["l",(G,$)=>-q(G,$),()=>-z],["r",()=>z,(G,$)=>q(G,$)]])N(`outer-${Q}`,(G,$)=>se(U($*u,0),Y($*u,0),G),(G,$)=>$*u,0,D?l(D):i,!0),N(`inner-${Q}`,(G,$)=>se(U((1-$)*u,-f),Y((1-$)*u,-f),G),(G,$)=>(1-$)*u,-f,s,!1);N("outer-m",Q=>se(-z,z,Q),(Q,U)=>se(Ic(A,se(-z,z,Q)),u,U),0,D?l(D):i,!0),N("inner-m",Q=>se(-z,z,Q),(Q,U)=>se(u,Ic(A,se(-z,z,Q)),U),-f,s,!1)}else N("outer",(Q,U)=>se(-q(U*u,0),q(U*u,0),Q),(Q,U)=>U*u,0,D?l(D):i,!0),N("inner",(Q,U)=>se(-q((1-U)*u,-f),q((1-U)*u,-f),Q),(Q,U)=>(1-U)*u,-f,s,!1);const Z=(Q,U,Y)=>{const G=($,J,it)=>{const ot=se(-f,0,J),ct=se(U(ot),Y(ot),$);return M.side(R,S(R,ct,0,ot),ot,0,it)};b.add(Wi(oe({surface:Xe(G),segments:[Math.max(2,Math.ceil(2*L(R,0)/r)),1]}),i,o,`foot-bottom-${Q}-${ue[R]}`))};if(A){Z("l",J=>-L(R,0,J),()=>-z),Z("r",()=>z,J=>L(R,0,J));const Q=A.outline,U=[0];for(let J=1;J<Q.length;J++)U.push(U[J-1]+Math.hypot(Q[J][0]-Q[J-1][0],Q[J][1]-Q[J-1][1]));const Y=U[U.length-1],G=J=>{const it=J*Y;let ot=1;for(;ot<U.length-1&&U[ot]<it;)ot++;const ct=(it-U[ot-1])/(U[ot]-U[ot-1]||1);return[se(Q[ot-1][0],Q[ot][0],ct),se(Q[ot-1][1],Q[ot][1],ct)]},$=(J,it,ot)=>{const[ct,K]=G(J),F=se(-f,0,it);return M.side(R,S(R,ct,K,F),F,K,ot)};b.add(Wi(oe({surface:Xe($),segments:[Q.length*2,1]}),i,o,`foot-reveal-${ue[R]}`))}else Z("full",Q=>-L(R,0,Q),Q=>L(R,0,Q))}if(w)for(const R of[[[0,0],[0,u]],[[-f,u],[-f,0]],[[-f,0],[0,0]]])b.add(...xr(M,R,{material:i,part:o,name:"foot",sides:!1,hasCorners:!0}));const T={};for(let R=0;R<4;R++){const O=ln[R],A=ln[(R+1)%4],D=k=>w?M.corner(R,.5,0,k).clone():M.side(R,1,0,k).clone();T[Ao[R]]={bottom:D(0),top:D(u),out:new X(O[0]+A[0],0,O[2]+A[2]).normalize()}}const C={};for(let R=0;R<4;R++){const O=e.sides[ue[R]].notch;C[ue[R]]={bottom:M.side(R,.5,0,O?O.h:0).clone(),top:M.side(R,.5,0,u).clone(),normal:new X(...ln[R])}}return b.userData.corners=T,b.userData.axes=C,b.userData.layout=e,b}const Ro=(n,t,e)=>Math.sqrt(n*n+t*t+e*e);function gs(n,t,e,i,s,o){const a=Ro(n/i,t/s,e/o),r=Ro(n/(i*i),t/(s*s),e/(o*o));return r>1e-9?a*(a-1)/r:-Math.min(i,s,o)}function bb(n,t,e,i,s,o,a){const r=Math.abs(n)-i+a,c=Math.abs(t)-s+a,l=Math.abs(e)-o+a;return Ro(Math.max(r,0),Math.max(c,0),Math.max(l,0))+Math.min(Math.max(r,c,l),0)-a}function kd(n,t,e,i,s,o,a){const r=s[0]-i[0],c=s[1]-i[1],l=s[2]-i[2],h=r*r+c*c+l*l,u=o-a,f=h-u*u,p=1/h,_=n-i[0],g=t-i[1],d=e-i[2],m=_*r+g*c+d*l,y=m-h,M=Ro(_*h-r*m,g*h-c*m,d*h-l*m),v=M*M,x=m*m*h,b=y*y*h,w=Math.sign(u)*u*u*v;return Math.sign(y)*f*b>w?Math.sqrt(v+b)*p-a:Math.sign(m)*f*x<w?Math.sqrt(v+x)*p-o:(Math.sqrt(v*f*p)+m*u)*p-o}function Jn(n,t,e){if(e<=0)return Math.min(n,t);const i=Math.max(e-Math.abs(n-t),0)/e;return Math.min(n,t)-i*i*e*.25}function fu(n,t,e){return-Jn(-n,-t,e)}function Xa(n,t,e,i){let s=1/0;for(let o=0;o<i.length-1;o++){const a=i[o],r=i[o+1];s=Math.min(s,kd(n,t,e,a,r,a[3],r[3]))}return s}function du(n,t){const e=t.hornSize,i=t.hornCurl;if(n==="ram"){const s=[],o=.85+.35*i;for(let a=0;a<=14;a++){const r=a/14,c=-.4+r*o*Math.PI*2,l=(.36-.2*r)*e;s.push([.3+.18*r*e,.22+l*Math.cos(c)*.9,.02+l*Math.sin(c)-.1*e*(1-r),(.13-.085*r)*Math.sqrt(e)])}return s}return n==="bottle"?[[.22,.36,.06,.09],[.28,.5,.05,.1*e],[.31,.62*e,.05,.075*e],[.3,.7*e,.05,.05]]:n==="buffalo"?[[.26,.32,.04,.12],[.55*e,.4,-.04,.1],[.85*e,.5,.02,.075],[1.02*e,.66*i+.2,.12,.045],[1*e,.82*i+.2,.22,.03]]:[[.24,.3,.05,.14],[.38*e,.48+.08*i,.03,.135],[.57*e,.56+.12*i,.01,.12],[.72*e,.48+.1*i,.01,.105],[.75*e,.32,.04,.085],[.67*e,.2-.08*i,.08,.06]]}const sl={kind:"bovine",width:40,projection:.62,droop:28,hornSize:1,hornCurl:.5,eyeSize:1,ears:!0,embed:4,detail:0,seed:1,brow:!0,nostrils:!0};function Dd(n){const t={...sl,...n},e=t.width,i=new Be(t.seed),s=()=>1+(i.next()-.5)*.04,o=t.projection,a=t.droop*Math.PI/180,r=Math.cos(a),c=Math.sin(a),h=(t.kind==="tiger"?du("bottle",t):du(t.kind==="ram"?"ram":t.kind==="buffalo"?"buffalo":"bovine",t)).map(v=>[v[0]*e*s(),v[1]*e,v[2]*e,v[3]*e]),u=h.map(v=>[-v[0],v[1],v[2],v[3]]),f=.1*e*t.eyeSize,p=(t.kind==="tiger"?.2:.25)*e,_=.16*e,g=(.17+.35*o*.4)*e,d=[0,.14*e,.12*e],m=o*e*1.15,y=[0,d[1]-m*c,d[2]+m*r],M=.07*e;return{bounds:{min:[Math.min(...u.map(v=>v[0]-v[3]))-2,Math.min(-.5*e,y[1]-.25*e)-2,-t.embed-1],max:[Math.max(...h.map(v=>v[0]+v[3]))+2,Math.max(.55*e,...h.map(v=>v[1]+v[3]))+2,Math.max(y[2]+.2*e,...h.map(v=>v[2]+v[3]))+2]},F:e,p:t,sd(v,x,b){let w=bb(v,x+.02*e,b+t.embed*.5-.03*e,.36*e,.38*e,t.embed*.5+.12*e,.12*e);w=Jn(w,gs(v,x-.16*e,b-.1*e,.38*e,.3*e,.22*e),M),w=Jn(w,kd(v,x,b,d,y,.29*e,(t.kind==="ram"?.16:.22)*e),M*1.2);const L=v,S=x-y[1],T=b-y[2];w=Jn(w,gs(L,S-.01*e,T,(t.kind==="ram"?.19:.27)*e,.14*e,.15*e),M*.7),t.brow&&(w=Jn(w,Xa(v,x,b,[[-p*1.25,_+f*1.2,g-.02*e,.05*e],[0,_+f*1.7,g+.02*e,.06*e],[p*1.25,_+f*1.2,g-.02*e,.05*e]]),M*.5));for(const C of[-1,1]){const R=v-C*p,O=x-_,A=b-g;w=Jn(w,gs(R,O,A,f*1.15,f*.85,f),M*.35),w=fu(w,-gs(R-C*f*.05,O,A-f*.95,f*.42,f*.36,f*.28),.25)}if(t.nostrils)for(const C of[-1,1])w=fu(w,-gs(v-C*.09*e,x-y[1]+.02*e,b-y[2]-.14*e,.045*e,.06*e,.06*e),.4);if(t.ears&&t.kind!=="ram")for(const C of[-1,1])w=Jn(w,gs(v-C*.42*e,x-.1*e,b-.04*e,.15*e,.07*e,.05*e),M*.5);return w=Jn(w,Xa(v,x,b,h),M*.6),w=Jn(w,Xa(v,x,b,u),M*.6),w}}}function Id(n,{voxel:t=.8,clipZ:e=null}={}){const[i,s,o]=n.bounds.min,[a,r,c]=n.bounds.max,l=Math.ceil((a-i)/t)+1,h=Math.ceil((r-s)/t)+1,u=Math.ceil((c-o)/t)+1,f=new Float32Array(l*h*u),p=(k,I,N)=>(N*h+I)*l+k,_=(k,I,N)=>{const z=n.sd(k,I,N);return e!=null?Math.max(z,e-N):z},g=4,d=Math.ceil((l-1)/g)+1,m=Math.ceil((h-1)/g)+1,y=Math.ceil((u-1)/g)+1,M=new Float32Array(d*m*y);for(let k=0;k<y;k++)for(let I=0;I<m;I++)for(let N=0;N<d;N++)M[(k*m+I)*d+N]=_(i+N*g*t,s+I*g*t,o+k*g*t);const v=g*t*1.8;for(let k=0;k<u;k++)for(let I=0;I<h;I++)for(let N=0;N<l;N++){const z=Math.min(d-1,Math.round(N/g)),q=Math.min(m-1,Math.round(I/g)),Z=Math.min(y-1,Math.round(k/g)),Q=M[(Z*m+q)*d+z];f[p(N,I,k)]=Math.abs(Q)>v?Q:_(i+N*t,s+I*t,o+k*t)}const x=new Int32Array((l-1)*(h-1)*(u-1)).fill(-1),b=(k,I,N)=>(N*(h-1)+I)*(l-1)+k,w=[],L=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]],S=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],T=new Float64Array(8);for(let k=0;k<u-1;k++)for(let I=0;I<h-1;I++)for(let N=0;N<l-1;N++){let z=0;for(let Y=0;Y<8;Y++)T[Y]=f[p(N+L[Y][0],I+L[Y][1],k+L[Y][2])],T[Y]<0&&(z|=1<<Y);if(z===0||z===255)continue;let q=0,Z=0,Q=0,U=0;for(const[Y,G]of S){if(T[Y]<0==T[G]<0)continue;const $=T[Y]/(T[Y]-T[G]);q+=L[Y][0]+(L[G][0]-L[Y][0])*$,Z+=L[Y][1]+(L[G][1]-L[Y][1])*$,Q+=L[Y][2]+(L[G][2]-L[Y][2])*$,U++}x[b(N,I,k)]=w.length/3,w.push(i+(N+q/U)*t,s+(I+Z/U)*t,o+(k+Q/U)*t)}const C=[],R=(k,I,N,z,q)=>{k<0||I<0||N<0||z<0||(q?C.push(k,N,I,k,z,N):C.push(k,I,N,k,N,z))};for(let k=1;k<u-1;k++)for(let I=1;I<h-1;I++)for(let N=0;N<l-1;N++){const z=f[p(N,I,k)]<0,q=f[p(N+1,I,k)]<0;z!==q&&R(x[b(N,I-1,k-1)],x[b(N,I,k-1)],x[b(N,I,k)],x[b(N,I-1,k)],q)}for(let k=1;k<u-1;k++)for(let I=0;I<h-1;I++)for(let N=1;N<l-1;N++){const z=f[p(N,I,k)]<0,q=f[p(N,I+1,k)]<0;z!==q&&R(x[b(N-1,I,k-1)],x[b(N-1,I,k)],x[b(N,I,k)],x[b(N,I,k-1)],q)}for(let k=0;k<u-1;k++)for(let I=1;I<h-1;I++)for(let N=1;N<l-1;N++){const z=f[p(N,I,k)]<0,q=f[p(N,I,k+1)]<0;z!==q&&R(x[b(N-1,I-1,k)],x[b(N,I-1,k)],x[b(N,I,k)],x[b(N-1,I,k)],q)}const O=new Float32Array(w.length),A=t*.5;for(let k=0;k<w.length;k+=3){const I=w[k],N=w[k+1],z=w[k+2],q=(G,$,J)=>{let it=n.sd(G,$,J);return e!=null&&(it=Math.max(it,e-J)),it},Z=q(I+A,N,z)-q(I-A,N,z),Q=q(I,N+A,z)-q(I,N-A,z),U=q(I,N,z+A)-q(I,N,z-A),Y=Ro(Z,Q,U)||1;O[k]=Z/Y,O[k+1]=Q/Y,O[k+2]=U/Y}const D=new Ge;return D.setAttribute("position",new fe(w,3)),D.setAttribute("normal",new _e(O,3)),D.setAttribute("uv",new fe(new Float32Array(w.length/3*2),2)),D.setIndex(C),wb(D),D.computeBoundingBox(),D.computeBoundingSphere(),D}function wb(n){const t=n.attributes.position.array,e=n.attributes.normal.array,i=n.index.array;for(let s=0;s<i.length;s+=3){const o=i[s]*3,a=i[s+1]*3,r=i[s+2]*3,c=t[a]-t[o],l=t[a+1]-t[o+1],h=t[a+2]-t[o+2],u=t[r]-t[o],f=t[r+1]-t[o+1],p=t[r+2]-t[o+2],_=l*p-h*f,g=h*u-c*p,d=c*f-l*u,m=e[o]+e[a]+e[r],y=e[o+1]+e[a+1]+e[r+1],M=e[o+2]+e[a+2]+e[r+2];if(_*m+g*y+d*M<0){const v=i[s+1];i[s+1]=i[s+2],i[s+2]=v}}n.index.needsUpdate=!0}const pu=new Map;function Sb(n={}){const{material:t,part:e="heads",quality:i=1,...s}=n,o={...sl,...s},a=o.detail||Math.max(.35,o.width/(55*Math.sqrt(i))),r=JSON.stringify({...o,voxel:a});let c=pu.get(r);c||(c=Id(Dd(o),{voxel:a,clipZ:-o.embed}),pu.set(r,c));const l=new he(c,t||new Se);return l.userData.part=e,l.userData.head=o,l.castShadow=l.receiveShadow=!0,l}function Eb(n,t,{azimuth:e=0,y:i,s,pitch:o=0,lift:a=0,follow:r=.35}={}){const c=n.userData.lathe,l=s??c.sAtY(i),h=c.frame(e,l),f=new X(Math.sin(e*Math.PI/180),0,Math.cos(e*Math.PI/180)).clone().lerp(h.n,r).normalize(),p=h.b.clone();f.applyAxisAngle(p,o*Math.PI/180);const _=new X().crossVectors(f,p).normalize();_.y<0&&_.negate();const g=new X().crossVectors(_,f).normalize();return t.matrix.makeBasis(g,_,f),t.matrix.setPosition(h.p.clone().addScaledVector(h.n,a)),t.matrix.decompose(t.position,t.quaternion,t.scale),t.matrixWorldNeedsUpdate=!0,t}const Uc=(n,t,e)=>Math.min(e,Math.max(t,n)),en=(n,t,e)=>n+(t-n)*e,_o=n=>n*Math.PI/180,dr=n=>n<=0?0:n>=1?1:n*n*(3-2*n);function ol({height:n,radius:t,taper:e=0,entasis:i=.04,entasisAt:s=.7,foot:o={swell:.04,height:.06},top:a=null,collar:r=null,rings:c=null,embed:l=8}){const h=n,u=t,f=o||{swell:0,height:0},p=(f.height??.06)<=1?(f.height??.06)*h:f.height,_={flare:.22,height:u*.55,...a||{}},g=[];if(c&&c.count>0){const d=c.width??u*.12,m=c.spacing??d*2.2,y=(c.at??.5)<=1?(c.at??.5)*h:c.at;for(let M=0;M<c.count;M++)g.push({y:y+(M-(c.count-1)/2)*m,w:d,hh:c.height??u*.06,soft:!!c.soft})}return d=>{const m=Uc(d/h,0,1);let y=u*(1+e*m);const M=s>0&&s<1?Math.log(.5)/Math.log(s):1;if(y+=u*i*Math.sin(Math.PI*Math.pow(m,M)),f.swell&&(f.step?y+=u*f.swell*(1-dr((d-p)/Math.max(1,u*.06))):y+=u*f.swell*(1-dr(d/Math.max(1,p)))),r){const x=r.from<=1?r.from*h:r.from,b=r.to!=null?r.to<=1?r.to*h:r.to:h+l,w=r.shoulder??u*.08;y+=(r.amount??u*.08)*dr((d-x)/w)*(1-dr((d-b)/w))}for(const x of g){const b=Math.abs(d-x.y)/(x.w/2);b<1&&(y+=x.hh*(x.soft?.5+.5*Math.cos(Math.PI*b):Math.sqrt(1-b*b)))}const v=(d-(h-_.height))/_.height;return v>0&&(y+=u*_.flare*Math.pow(Uc(v,0,1),2.2)),y}}function Ud(n){var r,c;const t=ol(n),[e,i]=((r=n.relief)==null?void 0:r.zone)??n.zone,s=_o(((c=n.relief)==null?void 0:c.arc)??n.arc??180);let o=0;const a=24;for(let l=1;l<=a;l++){const h=en(e,i,(l-1)/a),u=en(e,i,l/a);o+=Math.hypot(u-h,t(u)-t(h))}return{w:s*t((e+i)/2),h:o,rMid:t((e+i)/2)}}function Tb(n){var A,D;const{height:t,radius:e,material:i=new Se,part:s="legs",density:o=.5,embed:a=8,relief:r=null,hollow:c=null,segments:l=null}=n;let h=t,u=((A=n.splay)==null?void 0:A.angle)??0,f=((D=n.splay)==null?void 0:D.toward)??[0,1],p=0;if(n.cast){const k=new Be(n.cast.seed??11);h*=1+k.jitter(n.cast.length??.004),u+=k.jitter(n.cast.splay??1.2),p=k.jitter(n.cast.twist??2)}const _=ol({...n,height:h,embed:a}),g=h+a,d=new yn;d.name="column-leg",d.userData.part=s;const m=_o(((r==null?void 0:r.facing)??0)+p),y=_o((r==null?void 0:r.arc)??180),M=(k,I,N,z,q=1)=>Xe((Z,Q,U)=>{const Y=en(k,I,Z),G=en(N,z,Q),$=_(G)*q;U.set(Math.sin(Y)*$,G,Math.cos(Y)*$)}),v=2*Math.PI*e,x=(k,I)=>{const N=(l==null?void 0:l.v)??Math.ceil((I-k)/Math.max(1.5,Math.min(6,e*.05)));return Math.max(2,N)},b=k=>Math.max(8,Math.ceil(((l==null?void 0:l.u)??Math.max(48,v*.25))*k)),w=(k,I,N)=>{const z=new he(k,I);return z.name=N,z.userData.part=s,z.castShadow=z.receiveShadow=!0,d.add(z),z},L=(c&&c.open==="bottom",0);if(r&&r.map){const[k,I]=r.zone,N=r.material||new Se({relief:r.map}),z=r.fade??2,q=y>=Math.PI*2-1e-6;w(oe({surface:M(m-y/2,m+y/2,k,I),segments:{density:r.density??o},relief:r.map,fade:q?{u0:0,u1:0,v0:z,v1:z}:z,maxVerts:r.maxVerts}),N,"leg-relief"),q||w(oe({surface:M(m+y/2,m-y/2+Math.PI*2,k,I),segments:[b(1-y/(Math.PI*2)),x(k,I)]}),i,"leg-back"),k>L&&w(oe({surface:M(m-Math.PI,m+Math.PI,L,k),segments:[b(1),x(L,k)]}),i,"leg-lower"),I<g&&w(oe({surface:M(m-Math.PI,m+Math.PI,I,g),segments:[b(1),x(I,g)]}),i,"leg-upper")}else w(oe({surface:M(m-Math.PI,m+Math.PI,L,g),segments:[b(1),x(L,g)]}),i,"leg-shaft");const S=c?c.wall??e*.3:0,T=c&&c.open==="bottom"?Math.max(1,_(0)-S):0;if(w(oe({surface:(k,I,N)=>{const z=en(Math.PI,-Math.PI,k),q=en(_(0),T,I);N.pos.set(Math.sin(z)*q,0,Math.cos(z)*q),N.nrm.set(0,-1,0)},segments:[b(1),1]}),i,"leg-sole"),c&&c.open==="bottom"){const k=new Se({interior:1}),I=h-S*.5,N=z=>Math.max(1,_(Math.min(z,h*.85))-S);w(oe({surface:Xe((z,q,Z)=>{const Q=en(Math.PI,-Math.PI,z),U=en(0,I,q),Y=N(U);Z.set(Math.sin(Q)*Y,U,Math.cos(Q)*Y)}),segments:[b(1),8]}),k,"leg-core"),w(oe({surface:(z,q,Z)=>{const Q=en(Math.PI,-Math.PI,z),U=en(N(I),0,q);Z.pos.set(Math.sin(Q)*U,I,Math.cos(Q)*U),Z.nrm.set(0,-1,0)},segments:[b(1),1]}),k,"leg-core-top")}const C=new X(Math.sin(m),0,Math.cos(m)),R=k=>C.clone().multiplyScalar(_(k)).setY(k),O=(r==null?void 0:r.zone)??[h*.55,h];if(n.flange){const k=n.flange.from??O[0]+4,I=n.flange.to??O[1]-2,N=tl({material:i,notches:{every:18,depth:.42,width:3},...n.flange,from:R(k),to:R(I),out:C.clone()});d.add(N)}if(u){const k=new X(f[0],0,f[1]).normalize(),I=new X(0,1,0).cross(k).normalize().negate(),N=new ae().makeTranslation(0,h,0).multiply(new ae().makeRotationAxis(I,_o(u))).multiply(new ae().makeTranslation(0,-h,0));for(const z of d.children)z.geometry.applyMatrix4(N),z.geometry.computeBoundingBox(),z.geometry.computeBoundingSphere()}return d.userData.radius=_,d.userData.height=h,d.userData.axis={bottom:R(O[0]),top:R(O[1]),out:C},r&&(d.userData.panel=Ud({...n,height:h})),d}function Ab({height:n,chord:t,thickness:e,tipChord:i=.25,splay:s=0,outCurve:o=0,embed:a=6,material:r=new Se,part:c="legs"}){const l=n+a,h=f=>{const p=Uc(f/n,0,1),_=t*en(i,1,Math.pow(p,.8)),g=e*en(.35,1,p),d=o*Math.sin(Math.PI*p);return[[0,d+_*.55],[g/2,d-_*.45],[-g/2,d-_*.45]]},u=new yn;u.userData.part=c;for(let f=0;f<3;f++){const p=(f+1)%3,_=oe({surface:Xe((d,m,y)=>{const M=m*l,v=h(M),x=v[f],b=v[p];y.set(en(x[0],b[0],d),M,en(x[1],b[1],d))}),segments:[2,24]}),g=new he(_,r);g.userData.part=c,g.castShadow=g.receiveShadow=!0,u.add(g)}return s&&(u.rotation.x=_o(s)),u}const Fe=(n,t,e)=>n+(t-n)*e,Rb=n=>n*Math.PI/180;function _s(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Br(n,t,e,i,s){return(o,a)=>{const[r,c,l,h]=s;if(o<=r)a[0]=-n,a[1]=Fe(i,t-e,o/r);else if(o<=c){const u=(o-r)/(c-r)*Math.PI*.5;a[0]=-n+e-e*Math.cos(u),a[1]=t-e+e*Math.sin(u)}else if(o<=l)a[0]=Fe(-n+e,n-e,(o-c)/(l-c)),a[1]=t;else if(o<=h){const u=(o-l)/(h-l)*Math.PI*.5;a[0]=n-e+e*Math.sin(u),a[1]=t-e+e*Math.cos(u)}else a[0]=n,a[1]=Fe(t-e,i,(o-h)/(1-h));return a}}function Gr(n,t,e,i){const s=Math.max(.001,t-e-i),o=Math.max(.001,2*(n-e)),a=Math.max(.001,Math.PI/2*e),r=2*s+o+2*a,c=s/r,l=c+a/r,h=l+o/r,u=h+a/r;return[c,l,h,u]}function Nd(n){var M;const{width:t,height:e,bar:i,depth:s}=n,o=t/2,a=n.radius??i*.6,r=n.barTop??i,c=o-i,l=Math.min(((M=n.aperture)==null?void 0:M.radius)??c*.5,c),h=e-r,u=e-a,f=Math.PI/2*a,p=2*(o-a),_=[],g=[],d=Br(o,e,a,0,Gr(o,e,a,0)),m=Br(c,h,l,0,Gr(c,h,l,0));for(let v=0;v<=64;v++){const x=d(v/64,[0,0]),b=m(v/64,[0,0]);_.push([x[0]+o,x[1]]),g.push([b[0]+o,b[1]])}const y=n.root?{w:n.root.width??i*1.06,h:(n.root.height??i)+(n.root.rise??i*.35)}:null;return{outer:{w:t,h:e,outline:{outer:_,inner:g}},edge:{w:2*u+2*f+p,h:s,legLength:u,arcLength:f,topLength:p},root:y}}function Pb(n){var Y;const{width:t,bar:e,depth:i,material:s=new Se,part:o="handles",density:a=.6,faces:r={},channel:c=null}=n;let l=n.height,h=n.lean??0;if(n.cast){const G=new Be(n.cast.seed??5);h+=G.jitter(n.cast.lean??1.5),l*=1+G.jitter(n.cast.height??.008)}const u=n.embed??Math.min(e,20),f=t/2,p=Math.min(n.radius??e*.6,f,l),_=n.barTop??e,g=f-e,d=l-_,m=Math.min(((Y=n.aperture)==null?void 0:Y.radius)??g*.5,g,d),y=i/2,M=Gr(f,l,p,-u),v=Gr(g,d,m,-u),x=(G,$,J)=>{const it=[0,...$,1],ot=[0,...J,1];for(let ct=0;ct<5;ct++)if(G<=it[ct+1])return Fe(ot[ct],ot[ct+1],(G-it[ct])/(it[ct+1]-it[ct]));return 1},b=Br(f,l,p,-u,M),w=Br(g,d,m,-u,v),L=[0,0],S=[0,0],T=G=>{b(G,L),w(x(G,M,v),S)},C=new Map,R=G=>G?G.macro?{relief:G}:G:null,O=G=>G?G.material?G.material:(C.has(G.relief)||C.set(G.relief,new Se({relief:G.relief})),C.get(G.relief)):s,A=new yn;A.name="upright-handle",A.userData.part=o;const D=(G,$,J)=>{const it=new he(G,$);return it.name=J,it.userData.part=o,it.castShadow=it.receiveShadow=!0,A.add(it),it},k=2*(l+u)+2*f,I=Math.max(48,Math.ceil(k/6)),N=G=>{if(!c)return 0;const $=(c.width??e*.3)/2,J=Math.abs(G-.5)*e/$;return J<1?-(c.depth??2)*(.5+.5*Math.cos(Math.PI*J)):0},z=R(r.outer);{const G=(J,it,ot)=>{T(J),ot.set(Fe(S[0],L[0],it),Fe(S[1],L[1],it),y+N(it))},$=(z==null?void 0:z.fade)??1.5;D(oe({surface:Xe(G),segments:z?{density:z.density??a}:[I,c?12:2],relief:(z==null?void 0:z.relief)??null,fade:0,panelMap:z?(J,it,ot)=>{T(J);const ct=Fe(S[0],L[0],it),K=Fe(S[1],L[1],it),F=Math.hypot(L[0]-S[0],L[1]-S[1]);ot[0]=(ct+f)/t,ot[1]=K/l,ot[2]=_s(Math.min(it,1-it)*F,$)*_s(K,$)}:null}),O(z),"handle-outer")}const q=R(r.back);D(oe({surface:Xe((G,$,J)=>{T(G),J.set(Fe(L[0],S[0],$),Fe(L[1],S[1],$),-y)}),segments:q?{density:a}:[I,2],relief:(q==null?void 0:q.relief)??null,fade:0,panelMap:q?(G,$,J)=>{T(G);const it=Fe(L[0],S[0],$),ot=Fe(L[1],S[1],$);J[0]=(f-it)/t,J[1]=ot/l,J[2]=_s(Math.min($,1-$)*e,1.5)*_s(ot,1.5)}:null}),O(q),"handle-back");const Z=Nd({...n,height:l}),Q=R(r.edge);{const $=new Float32Array(513),J=[0,0],it=[0,0];b(0,it);for(let K=1;K<=512;K++)b(K/512,J),$[K]=$[K-1]+Math.hypot(J[0]-it[0],J[1]-it[1]),it[0]=J[0],it[1]=J[1];const ot=K=>{const F=K*512,B=Math.min(511,Math.floor(F));return Fe($[B],$[B+1],F-B)},ct=(Q==null?void 0:Q.fade)??1.2;D(oe({surface:Xe((K,F,B)=>{b(K,L),B.set(L[0],L[1],Fe(y,-y,F))}),segments:Q?{density:Q.density??a}:[I,2],relief:(Q==null?void 0:Q.relief)??null,fade:0,panelMap:Q?(K,F,B)=>{b(K,L),B[0]=(ot(K)-u)/Z.edge.w,B[1]=1-F,B[2]=_s(Math.min(F,1-F)*i,ct)*_s(L[1],ct)}:null}),O(Q),"handle-edge")}const U=R(r.inner);D(oe({surface:Xe((G,$,J)=>{T(G),J.set(S[0],S[1],Fe(-y,y,$))}),segments:[I,2]}),O(U&&!U.relief?U:null),"handle-inner");for(const G of[0,1]){T(G);const $=[L[0],L[1]],J=[S[0],S[1]],it=G===0;D(oe({surface:Xe((ot,ct,K)=>{const F=Fe(it?$[0]:J[0],it?J[0]:$[0],ot);K.set(F,-u,Fe(-y,y,ct))}),segments:[1,1]}),s,"handle-cap")}if(n.root){const G=n.root,$=G.width??e*1.06,J=G.height??e,it=G.rise??e*.35,ot=y+(G.outset??i*.3),ct=-y-(G.inset??0),K=R(r.root);for(const F of[-1,1]){const B=F*(f-e/2),W=B-$/2,et=B+$/2,st=-J,mt=it,ut=[{n:"front",c:[[W,st,ot],[et,st,ot],[W,mt,ot],[et,mt,ot]],sp:K},{n:"back",c:[[et,st,ct],[W,st,ct],[et,mt,ct],[W,mt,ct]]},{n:"left",c:[[W,st,ct],[W,st,ot],[W,mt,ct],[W,mt,ot]]},{n:"right",c:[[et,st,ot],[et,st,ct],[et,mt,ot],[et,mt,ct]]},{n:"top",c:[[W,mt,ot],[et,mt,ot],[W,mt,ct],[et,mt,ct]]},{n:"bottom",c:[[W,st,ct],[et,st,ct],[W,st,ot],[et,st,ot]]}];for(const E of ut){const[P,tt,dt,at]=E.c.map(vt=>new X(...vt)),pt=(vt,xt,wt)=>wt.set(0,0,0).addScaledVector(P,(1-vt)*(1-xt)).addScaledVector(tt,vt*(1-xt)).addScaledVector(dt,(1-vt)*xt).addScaledVector(at,vt*xt),gt=E.sp;D(oe({surface:Xe(pt),segments:gt?{density:gt.density??a}:[2,2],relief:(gt==null?void 0:gt.relief)??null,fade:(gt==null?void 0:gt.fade)??1.5}),O(gt),`handle-root-${E.n}`).userData.root=!0}}}if(h){const G=new ae().makeRotationX(Rb(h));for(const $ of A.children)$.userData.root||($.geometry.applyMatrix4(G),$.geometry.computeBoundingBox(),$.geometry.computeBoundingSphere())}return A.userData.layout=Z,A.userData.lean=h,A}const Lb=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]],Cb=[[1,0,0],[0,0,-1],[-1,0,0],[0,0,1]],ve=(n,t,e)=>n+(t-n)*e,kb=n=>n*Math.PI/180;function Db(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Ib(n,t){if(!n)return;if(n[ue[t]]!==void 0)return n[ue[t]];const e=t%2===0?"long":"short";return n[e]!==void 0?n[e]:n.all}function rl(n,t,e,i){const s=(n&1)===0,o=s?t.b:t.a,a=s?t.a:t.b,r=(2*e-1)*a,c=Lb[n],l=Cb[n];return i.set(c[0]*o+l[0]*r,t.y,c[2]*o+l[2]*r)}function qe(n,t,{material:e,part:i,name:s,segV:o=1,segU:a=4,faces:r=null,map:c=null,density:l=.6}){const h=[];for(let u=0;u<4;u++){const f={a:0,b:0,y:0},p=(M,v,x)=>{const b=t(v);return f.a=b.a,f.b=b.b,f.y=b.y,rl(u,f,M,x)},_=r?Ib(r,u):null,g=_?_.macro?{relief:_}:_:null,d=g?g.material||Ub(g.relief):e,m=oe({surface:Xe(p),segments:g?{density:g.density??l}:[a,o],relief:(g==null?void 0:g.relief)??null,fade:g?{u0:0,u1:0,v0:g.fade??1.5,v1:g.fade??1.5}:0,panelMap:g&&c?c(u,g):null}),y=new he(m,d);y.name=`${s}-${ue[u]}`,y.userData.part=i,y.castShadow=y.receiveShadow=!0,n.add(y),h.push(y)}return h}const Ya=new WeakMap;function Ub(n){return Ya.has(n)||Ya.set(n,new Se({relief:n})),Ya.get(n)}function al(n){const t=n.width,e=n.depth,i=t/2,s=e/2,o=((n.ridge??.4)<=1?(n.ridge??.4)*t:n.ridge)/2,a=Math.min(o,i-.001),r=n.rise??s*Math.tan(kb(n.slope??38)),c=n.concave??0,l=m=>(1-c)*m+c*m*m,h={height:0,overhang:0,fascia:0,...n.skirt||{}},u=h.height+(h.fascia??0),f=m=>({a:ve(i,a,m),b:ve(s,0,m),y:u+r*l(m)}),p=48,_=new Float32Array(p+1),g=new Float32Array(p+1);for(let m=1;m<=p;m++){const y=f((m-1)/p),M=f(m/p);_[m]=_[m-1]+Math.hypot(M.b-y.b,M.y-y.y),g[m]=g[m-1]+Math.hypot(M.a-y.a,M.y-y.y)}return{A:i,B:s,rh:a,rise:r,level:f,arc:(m,y)=>{const M=m&1?g:_,v=y*p,x=Math.min(p-1,Math.floor(v));return ve(M[x],M[x+1],v-x)},y0:u,sk:h,top:u+r}}function Fd(n){const t=al(n),e={};for(let i=0;i<4;i++){const s=(i&1)===0,o=2*(s?t.A:t.B),a=t.arc(i,1),r=[];for(let c=0;c<=12;c++){const l=t.level(c/12);r.push([o/2-(s?l.a:l.b),t.arc(i,c/12)])}for(let c=12;c>=0;c--){const l=t.level(c/12);r.push([o/2+(s?l.a:l.b),t.arc(i,c/12)])}e[ue[i]]={w:o,h:a,outline:r,shape:s&&t.rh>0?"trapezoid":"triangle"}}return{faces:e,rise:t.rise,top:t.top,ridge:2*t.rh}}function Nb(n){const{material:t=new Se,part:e="lid",thickness:i=4,density:s=.6}=n,o=n.interiorMaterial||new Se({interior:1}),a=al(n),{A:r,B:c,rh:l,level:h,sk:u}=a,f=u.overhang??0,p=r-f,_=c-f,g=new yn;g.name="hipped-lid",g.userData.part=e;const d=i,m=u.height,y=a.y0,M=Math.max(12,Math.ceil(a.arc(0,1)/6)),v=(A,D,k)=>({a:A,b:D,y:k}),x=(A,D)=>{const k=(A&1)===0,I=2*(k?r:c),N=a.arc(A,1),z=N/Math.hypot(N,k?r-l:c),q=D.fade??1.5;return(Z,Q,U)=>{const Y=h(Q),G=k?Y.a:Y.b,$=(2*Z-1)*G;U[0]=.5+$/I,U[1]=a.arc(A,Q)/N,U[2]=Db((G-Math.abs($))*z,q)}};qe(g,h,{material:t,part:e,name:"lid-roof",segV:M,faces:n.faces,map:x,density:s}),(u.fascia??0)>0&&qe(g,A=>v(r,c,ve(m,y,A)),{material:t,part:e,name:"lid-fascia",segV:1}),f>0&&qe(g,A=>v(ve(p,r,A),ve(_,c,A),m),{material:t,part:e,name:"lid-soffit",segV:1}),m>0&&qe(g,A=>v(p,_,ve(0,m,A)),{material:t,part:e,name:"lid-skirt",segV:2}),qe(g,A=>v(ve(p-d,p,A),ve(_-d,_,A),0),{material:t,part:e,name:"lid-bottom",segV:1});const b=p-d,w=_-d,L=Math.max(d,y-d*.3);L>0&&qe(g,A=>v(b,w,ve(L,0,A)),{material:o,part:e,name:"lid-inner-skirt",segV:1});const S=a.top-d*1.6,T=Math.max(0,l-d);if(qe(g,A=>{const D=1-A,k=n.concave??0;return v(ve(b,T,D),ve(w,0,D),L+(S-L)*((1-k)*D+k*D*D))},{material:o,part:e,name:"lid-underside",segV:8}),n.seat){const A=n.seat.depth??8,D=n.seat.clearance??.8,k=n.seat.thickness??d,I=(n.seat.width??2*(b-D))/2,N=(n.seat.depth2??2*(w-D))/2;qe(g,z=>v(I,N,ve(-A,.5,z)),{material:o,part:e,name:"lid-seat-out",segV:1}),qe(g,z=>v(ve(I-k,I,z),ve(N-k,N,z),-A),{material:o,part:e,name:"lid-seat-bottom",segV:1}),qe(g,z=>v(I-k,N-k,ve(.5,-A,z)),{material:o,part:e,name:"lid-seat-in",segV:1})}const C=(A,D,k)=>rl(A,h(k),D,new X),R=[],O={};for(let A=0;A<4;A++){const D=[];for(let I=0;I<=12;I++)D.push(C(A,1,I/12));R.push(D);const k=[];for(let I=0;I<=12;I++)k.push(C(A,.5,I/12));O[ue[A]]=k}if(g.userData.hips=R,g.userData.midlines=O,g.userData.ridge=[new X(-l,a.top,0),new X(l,a.top,0)],g.userData.top=a.top,g.userData.layout=Fd(n),n.knob){const A=Od({material:t,part:e,...n.knob});A.position.y=a.top,g.add(A),g.userData.knob=A}return g}function Od(n){const{material:t=new Se,part:e="lid"}=n,i=new yn;i.name="roof-knob",i.userData.part=e;const s={height:n.depth*.6,width:n.depth*.45,waist:.12,...n.post||{}},o=s.depth??s.width,a=n.embed??Math.max(4,s.height*.4),r=s.height;qe(i,_=>{const g=ve(-a,r+1,_),d=Math.max(0,Math.min(1,g/r)),m=1-(s.waist??0)*Math.sin(Math.PI*d);return{a:s.width/2*m,b:o/2*m,y:g}},{material:t,part:e,name:"knob-post",segV:10});const c=al(n),l=r,h=c.sk,u=_=>{const g=c.level(_);return{a:g.a,b:g.b,y:g.y+l}};if(qe(i,u,{material:t,part:e,name:"knob-roof",segV:10,faces:n.faces}),h.height>0){const _=h.overhang??0;qe(i,g=>({a:c.A-_,b:c.B-_,y:l+g*h.height}),{material:t,part:e,name:"knob-skirt",segV:1}),_>0&&qe(i,g=>({a:ve(c.A-_,c.A,g),b:ve(c.B-_,c.B,g),y:l+h.height}),{material:t,part:e,name:"knob-soffit",segV:1}),(h.fascia??0)>0&&qe(i,g=>({a:c.A,b:c.B,y:l+ve(h.height,c.y0,g)}),{material:t,part:e,name:"knob-fascia",segV:1})}const f=h.overhang??0;qe(i,_=>({a:ve(0,c.A-f,_)+(c.A-c.B)*(1-_)*0,b:ve(0,c.B-f,_),y:l}),{material:t,part:e,name:"knob-base",segV:1});const p=[];for(let _=0;_<4;_++){const g=[];for(let d=0;d<=8;d++)g.push(rl(_,u(d/8),1,new X));p.push(g)}return i.userData.hips=p,i.userData.top=l+c.top,i}function Fb({height:n,radius:t,swell:e=.12,waist:i=.06,material:s,part:o="legs",density:a=.6}){const r=t,c=n;return il({profile:[[0,0],[r*1.03,0,"corner"],[r,c*.06],[r*(1-i),c*.45],[r*(1-i*.4),c*.78],[r*(1+e),c*.96],[r*(1+e),c,"corner"],[0,c]],material:s,part:o,segments:{density:a}})}function Ob({width:n,height:t,bar:e,thickness:i,material:s,part:o="handles"}){const a=n/2,r=Math.min(a,t)*.45,c=Math.max(.5,r-e),l=new wf;l.moveTo(-a,0),l.lineTo(-a,t-r),l.quadraticCurveTo(-a,t,-a+r,t),l.lineTo(a-r,t),l.quadraticCurveTo(a,t,a,t-r),l.lineTo(a,0),l.lineTo(a-e,0),l.lineTo(a-e,t-e-c),l.quadraticCurveTo(a-e,t-e,a-e-c,t-e),l.lineTo(-a+e+c,t-e),l.quadraticCurveTo(-a+e,t-e,-a+e,t-e-c),l.lineTo(-a+e,0),l.closePath();const h=Math.min(1.5,i*.15),u=new qc(l,{depth:Math.max(.1,i-2*h),bevelEnabled:!0,bevelThickness:h,bevelSize:h,bevelSegments:2,curveSegments:10});u.translate(0,0,-(i-2*h)/2),u.computeBoundingBox();const f=new he(u,s);return f.userData.part=o,f.castShadow=f.receiveShadow=!0,f}function zb({radius:n,height:t,thickness:e=5,flare:i=.08,material:s,part:o="foot",density:a=.5}){return il({profile:[[n,0],[n*(1-i*.7),t*.6],[n*(1-i),t]],thickness:e,rims:["v0","v1"],material:s,part:o,segments:{density:a}})}function Bb({outline:n,holes:t=[],thickness:e=8,front:i=null,back:s=null,spacing:o=6,reliefSpacing:a=1.2,refine:r=null,crease:c=35,material:l=null,part:h="body",maxTriangles:u=4e5}){const f=xu(),p=typeof e=="function"?e:()=>e,_=mu(i,null),g=mu(s==="front"?{relief:"front"}:s,_,!0),d=yu(Mu(n,!0)),m=t.map(K=>yu(Mu(K,!1))),y=[],M=K=>(y.push(K[0],K[1]),y.length/2-1);for(const K of d)M(K);for(const K of m)for(const F of K)M(F);const v=Vi.triangulateShape(d.map(K=>new Lt(K[0],K[1])),m.map(K=>K.map(F=>new Lt(F[0],F[1])))),x=[];for(const[K,F,B]of v)(y[2*F]-y[2*K])*(y[2*B+1]-y[2*K+1])-(y[2*B]-y[2*K])*(y[2*F+1]-y[2*K+1])>=0?x.push(K,F,B):x.push(K,B,F);const b=Gb([_,g],2),w=(K,F)=>{let B=o;return b.at(K,F)&&(B=Math.min(B,a)),r&&(B=Math.min(B,r(K,F))),Math.max(B,.2)};gu(y,x);for(let K=0;K<4;K++){const F=x.length;if(Hb(y,x,w,u),gu(y,x),x.length===F)break}const L=y.length/2,S=x.length/3,T=new Float32Array(L);for(let K=0;K<L;K++)T[K]=p(y[2*K],y[2*K+1]);const C=new Float32Array(L),R=new Float32Array(L),O=new Float32Array(L*2).fill(-1),A=new Float32Array(L*2).fill(-1),D=_?_.relief.macro(a*.75):null,k=g?g.relief===(_==null?void 0:_.relief)?D:g.relief.macro(a*.75):null;for(let K=0;K<L;K++){const F=y[2*K],B=y[2*K+1];if(_){const[W,et]=_.uv(F,B);O[2*K]=W,O[2*K+1]=et,W>=0&&W<=1&&et>=0&&et<=1&&(C[K]=D.sample(W,et)*_.scale)}if(g){const[W,et]=g.uv(F,B);A[2*K]=W,A[2*K+1]=et,W>=0&&W<=1&&et>=0&&et<=1&&(R[K]=k.sample(W,et)*g.scale)}}const I=new Float32Array(L*3);for(let K=0;K<S;K++){const F=x[3*K],B=x[3*K+1],W=x[3*K+2],et=y[2*F],st=y[2*F+1],mt=T[F]/2,ut=y[2*B]-et,E=y[2*B+1]-st,P=T[B]/2-mt,tt=y[2*W]-et,dt=y[2*W+1]-st,at=T[W]/2-mt,pt=E*at-P*dt,gt=P*tt-ut*at,vt=ut*dt-E*tt;for(const xt of[F,B,W])I[3*xt]+=pt,I[3*xt+1]+=gt,I[3*xt+2]+=vt}for(let K=0;K<L;K++){const F=Math.hypot(I[3*K],I[3*K+1],I[3*K+2])||1;I[3*K]/=F,I[3*K+1]/=F,I[3*K+2]/=F}const N=new Map;{const K=new Map,F=(B,W)=>B<W?B*L+W:W*L+B;for(let B=0;B<S;B++)for(let W=0;W<3;W++){const et=x[3*B+W],st=x[3*B+(W+1)%3],mt=F(et,st);K.set(mt,(K.get(mt)||0)+1)}for(let B=0;B<S;B++)for(let W=0;W<3;W++){const et=x[3*B+W],st=x[3*B+(W+1)%3];K.get(F(et,st))===1&&N.set(et,st)}}const z=[];{const K=new Set;for(const F of N.keys()){if(K.has(F))continue;const B=[];let W=F;for(;!K.has(W)&&N.has(W);)K.add(W),B.push(W),W=N.get(W);B.length>2&&z.push(B)}}let q=0;for(const K of z)q+=K.length*4;const Z=L*2+q,Q=new Float32Array(Z*3),U=new Float32Array(Z*3),Y=new Float32Array(Z*2),G=new Float32Array(Z*4),$=[];for(let K=0;K<L;K++){const F=y[2*K],B=y[2*K+1];Q.set([F,B,T[K]/2+C[K]],K*3),U.set([I[3*K],I[3*K+1],I[3*K+2]],K*3),Y.set([O[2*K],O[2*K+1]],K*2),G.set(_u(I,K,_&&_.mirror?-1:1,1),K*4);const W=L+K;Q.set([F,B,-T[K]/2-R[K]],W*3),U.set([I[3*K],I[3*K+1],-I[3*K+2]],W*3),Y.set([A[2*K],A[2*K+1]],W*2),G.set(_u(I,K,g&&g.mirror?-1:1,-1),W*4)}for(let K=0;K<S;K++){const F=x[3*K],B=x[3*K+1],W=x[3*K+2];$.push(F,B,W),$.push(L+F,L+W,L+B)}let J=L*2;const it=Math.cos(c*Math.PI/180);for(const K of z){const F=K.length,B=[];for(let W=0;W<F;W++){const et=K[W],st=K[(W+1)%F],mt=y[2*st]-y[2*et],ut=y[2*st+1]-y[2*et+1],E=Math.hypot(mt,ut)||1;B.push([ut/E,-mt/E])}for(let W=0;W<F;W++){const et=K[W],st=K[(W+1)%F],mt=B[W],ut=B[(W-1+F)%F],E=B[(W+1)%F],P=mt[0]*ut[0]+mt[1]*ut[1]>it?vu(mt[0]+ut[0],mt[1]+ut[1]):mt,tt=mt[0]*E[0]+mt[1]*E[1]>it?vu(mt[0]+E[0],mt[1]+E[1]):mt,dt=-mt[1],at=mt[0],pt=[[et,1,P],[st,1,tt],[st,-1,tt],[et,-1,P]];for(let gt=0;gt<4;gt++){const[vt,xt,wt]=pt[gt],St=xt>0?T[vt]/2+C[vt]:-T[vt]/2-R[vt];Q.set([y[2*vt],y[2*vt+1],St],(J+gt)*3),U.set([wt[0],wt[1],0],(J+gt)*3),xt>0?Y.set([O[2*vt],O[2*vt+1]],(J+gt)*2):Y.set([A[2*vt],A[2*vt+1]],(J+gt)*2),G.set([dt,at,0,1],(J+gt)*4)}$.push(J,J+3,J+2,J,J+2,J+1),J+=4}}const ot=new Ge;ot.setAttribute("position",new _e(Q,3)),ot.setAttribute("normal",new _e(U,3)),ot.setAttribute("uv",new _e(Y,2)),ot.setAttribute("tangent",new _e(G,4)),ot.setIndex(Z>65535?new Co($,1):new Lo($,1)),ot.computeBoundingBox(),ot.computeBoundingSphere();const ct=new he(ot,l||new po({color:7044954}));return ct.castShadow=ct.receiveShadow=!0,ct.userData.part=h,ct.userData.plate={triangles:$.length/3,vertices:Z,boundaryLoops:z.length,ms:Math.round(xu()-f),thicknessAt:(K,F)=>p(K,F),surfaceAt:(K,F,B=1)=>{let W=0;const et=B>0?_:g;if(et){const[st,mt]=et.uv(K,F);st>=0&&st<=1&&mt>=0&&mt<=1&&(W=et.relief.sample(st,mt)*et.scale)}return B*(p(K,F)/2+W)}},ct}function mu(n,t,e=!1){if(!n)return null;if(n.relief==="front"){if(!t)return null;n={...n,relief:t.relief,rect:n.rect||t.rect,scale:n.scale??t.scale}}if(!n.relief)return null;const i=n.rect||{x:0,y:0,w:n.relief.widthMM,h:n.relief.heightMM},s=n.mirror??e;return{relief:n.relief,rect:i,scale:n.scale??1,mirror:s,uv:(o,a)=>[((s?-o:o)-i.x)/i.w,(a-i.y)/i.h]}}function Gb(n,t,e=.12){const i=[];for(const s of n){if(!s)continue;const o=s.relief,a=Math.ceil(s.rect.w/t),r=Math.ceil(s.rect.h/t),c=new Float32Array(a*r).fill(1/0),l=new Float32Array(a*r).fill(-1/0),h=o.width,u=o.height,f=o.data;for(let g=0;g<u;g++){const d=Math.min(r-1,Math.floor((g+.5)/u*r));for(let m=0;m<h;m++){const y=d*a+Math.min(a-1,Math.floor((m+.5)/h*a)),M=f[g*h+m];M<c[y]&&(c[y]=M),M>l[y]&&(l[y]=M)}}const p=new Uint8Array(a*r);for(let g=0;g<p.length;g++)p[g]=l[g]-c[g]>e?1:0;const _=new Uint8Array(p);for(let g=0;g<r;g++)for(let d=0;d<a;d++)if(p[g*a+d])for(let m=-1;m<=1;m++)for(let y=-1;y<=1;y++){const M=d+y,v=g+m;M>=0&&v>=0&&M<a&&v<r&&(_[v*a+M]=1)}i.push({f:s,cols:a,rows:r,d:_})}return{at(s,o){for(const{f:a,cols:r,rows:c,d:l}of i){const[h,u]=a.uv(s,o);if(!(h<0||h>1||u<0||u>1)&&l[Math.min(c-1,Math.floor(u*c))*r+Math.min(r-1,Math.floor(h*r))])return!0}return!1}}}function Hb(n,t,e,i){const s=new Map,o=(d,m)=>d<m?`${d},${m}`:`${m},${d}`,a=d=>{for(let m=0;m<3;m++){const y=o(t[3*d+m],t[3*d+(m+1)%3]),M=s.get(y);M?M.push(d):s.set(y,[d])}},r=d=>{for(let m=0;m<3;m++){const y=o(t[3*d+m],t[3*d+(m+1)%3]),M=s.get(y),v=M.indexOf(d);v>=0&&M.splice(v,1),M.length||s.delete(y)}},c=(d,m)=>(n[2*d]-n[2*m])**2+(n[2*d+1]-n[2*m+1])**2,l=d=>{let m=-1,y=0,M="";for(let v=0;v<3;v++){const x=t[3*d+v],b=t[3*d+(v+1)%3],w=c(x,b),L=o(x,b);(w>m+1e-9||Math.abs(w-m)<=1e-9&&L<M)&&(m=w,y=v,M=L)}return y},h=t.length/3;for(let d=0;d<h;d++)a(d);const u=new Map,f=(d,m)=>{const y=o(d,m);let M=u.get(y);M===void 0&&(n.push((n[2*d]+n[2*m])/2,(n[2*d+1]+n[2*m+1])/2),M=n.length/2-1,u.set(y,M));const v=(s.get(y)||[]).slice();for(const x of v){let b=0;for(;b<3;b++){const C=t[3*x+b],R=t[3*x+(b+1)%3];if(C===d&&R===m||C===m&&R===d)break}const w=t[3*x+b],L=t[3*x+(b+1)%3],S=t[3*x+(b+2)%3];r(x),t[3*x]=w,t[3*x+1]=M,t[3*x+2]=S,a(x);const T=t.length/3;t.push(M,L,S),a(T),g.push(x,T)}},p=d=>{const m=l(d),y=t[3*d+m],M=t[3*d+(m+1)%3],v=t[3*d+(m+2)%3],x=(n[2*y]+n[2*M]+n[2*v])/3,b=(n[2*y+1]+n[2*M+1]+n[2*v+1])/3,w=Math.min(e(x,b),e((n[2*y]+n[2*M])/2,(n[2*y+1]+n[2*M+1])/2));return c(y,M)>w*w},_=(d,m=0)=>{for(let y=0;y<64;y++){const M=l(d),v=t[3*d+M],x=t[3*d+(M+1)%3],b=s.get(o(v,x)),w=b.length>1?b[0]===d?b[1]:b[0]:-1;if(w<0){f(v,x);return}const L=l(w),S=t[3*w+L],T=t[3*w+(L+1)%3];if(o(S,T)===o(v,x)){f(v,x);return}if(m>48){f(v,x);return}_(w,m+1)}},g=[];for(let d=0;d<t.length/3;d++)g.push(d);for(;g.length&&!(t.length/3>=i);){const d=g.pop();p(d)&&(_(d),g.push(d))}}function gu(n,t){const e=t.length/3,i=new Map,s=(p,_)=>p<_?p*4194304+_:_*4194304+p,o=p=>{for(let _=0;_<3;_++){const g=s(t[3*p+_],t[3*p+(_+1)%3]),d=i.get(g);d?d.includes(p)||d.push(p):i.set(g,[p])}},a=p=>{for(let _=0;_<3;_++){const g=s(t[3*p+_],t[3*p+(_+1)%3]),d=i.get(g);if(!d)continue;const m=d.indexOf(p);m>=0&&d.splice(m,1),d.length||i.delete(g)}};for(let p=0;p<e;p++)o(p);const r=p=>n[2*p],c=p=>n[2*p+1],l=(p,_,g,d)=>{const m=r(p)-r(d),y=c(p)-c(d),M=r(_)-r(d),v=c(_)-c(d),x=r(g)-r(d),b=c(g)-c(d);return(m*m+y*y)*(M*b-x*v)-(M*M+v*v)*(m*b-x*y)+(x*x+b*b)*(m*v-M*y)},h=(p,_,g)=>(r(_)-r(p))*(c(g)-c(p))-(r(g)-r(p))*(c(_)-c(p)),u=[];for(let p=0;p<e;p++)u.push(p);let f=e*30;for(;u.length&&f-- >0;){const p=u.pop();for(let _=0;_<3;_++){const g=t[3*p+_],d=t[3*p+(_+1)%3],m=t[3*p+(_+2)%3],y=i.get(s(g,d));if(!y||y.length!==2)continue;const M=y[0]===p?y[1]:y[0];let v=-1;for(let x=0;x<3;x++){const b=t[3*M+x];b!==g&&b!==d&&(v=b)}if(!(v<0)&&!(l(g,d,m,v)<=1e-9)&&!(h(m,g,v)<=1e-9||h(m,v,d)<=1e-9)){a(p),a(M),t[3*p]=m,t[3*p+1]=g,t[3*p+2]=v,t[3*M]=m,t[3*M+1]=v,t[3*M+2]=d,o(p),o(M),u.push(p,M);break}}}}function _u(n,t,e,i){const s=n[3*t],o=n[3*t+1],a=n[3*t+2]*i;let r=e,c=0,l=0;const h=r*s;r-=s*h,c-=o*h,l-=a*h;const u=Math.hypot(r,c,l)||1;r/=u,c/=u,l/=u;const f=a*r-s*l;return[r,c,l,f<0?-1:1]}function Mu(n,t){let e=0;for(let i=0;i<n.length;i++){const s=n[i],o=n[(i+1)%n.length];e+=s[0]*o[1]-o[0]*s[1]}return e>0===t?n.slice():n.slice().reverse()}function yu(n){let t=n.slice();for(let e=0;e<3;e++){const i=[],s=t.length;for(let o=0;o<s;o++){const a=t[(o-1+s)%s],r=t[o],c=t[(o+1)%s],l=r[0]-a[0],h=r[1]-a[1],u=c[0]-r[0],f=c[1]-r[1],p=Math.hypot(l,h),_=Math.hypot(u,f);if(p<1e-6)continue;const g=(l*f-h*u)/(p*_||1),d=(l*u+h*f)/(p*_||1);Math.abs(g)<.005&&d>0||i.push(r)}if(i.length===t.length)break;t=i}return t}function vu(n,t){const e=Math.hypot(n,t)||1;return[n/e,t/e]}function xu(){return typeof performance<"u"?performance.now():Date.now()}const zd=Object.freeze(Object.defineProperty({__proto__:null,FANG_CORNERS:Ao,FANG_SIDES:ue,HEAD_DEFAULTS:sl,LEIWEN_DEFAULTS:Yc,LOZENGE_DEFAULTS:$f,MOTIFS:Bs,PATINA_MODES:yd,PATINA_PARAMS:ii,PATINA_PRESETS:Ls,PATINA_PRESET_GROUPS:Md,PROFILES:Ns,PatinaMaterial:Se,Profile:Xs,ReliefMap:bo,ReliefPanel:wo,Rng:Be,animalHead:Sb,bakeRelief:Rf,bladeLeg:Ab,bladeRow:dd,blur:Mr,borderLine:Ur,bossField:Tc,bossRow:Dv,bowstrings:fd,buildSurface:oe,buildTaotie:rd,carve:ws,columnLeg:Tb,columnarLeg:Fb,companions:Vy,createCanvas:br,drawMotif:ko,edgePath:Wx,edt:Kd,elementContour:Wf,fangBody:mb,fangLayout:Cd,fangSection:Pd,flange:tl,flangeOutline:bd,frame:pd,frieze:xi,getMotif:Gs,getPatina:ao,handleLayout:Nd,hashString:nc,headSDF:Dd,hippedLid:Nb,hippedLidLayout:Fd,inset:kv,lathe:il,latheFlanges:nb,latheSurface:Rd,legPanelSize:Ud,legRadius:ol,leiwenFill:Si,leiwenFillMask:Yr,leiwenOptions:Pf,loopHandle:Ob,lozengeFill:Zc,lozengeOptions:Kf,meshSDF:Id,mirrorPair:Lv,mixSeed:Iu,motifDefaults:Qc,mountOnLathe:Eb,mulberry32:Du,nearestFeature:si,paintElements:jf,parseSectors:Lc,patina:le,pillowBoss:Ir,pillowOutline:_y,plate:Bb,polyPath:Fs,profile:Ad,profileCurve:nl,profileFromTable:Kx,quadSurface:Ix,register:Ms,registerMotif:_d,registers:Cv,renderTaotie:id,resolveMotifParams:To,revolve:ys,ringFoot:zb,rng:Yd,roofKnob:Od,roundPlate:xc,roundPoly:hy,roundStroke:kn,setCanvasFactory:$d,setPatina:Nr,setPatinaMode:vd,setPatinaVessel:xd,shapes:ay,signedDistance:Nu,smoothPath:Uf,taotieContext:Zf,taotieParts:sd,uprightHandle:Pb},Symbol.toStringTag,{value:"Module"})),bu={type:"change"},$a={type:"start"},wu={type:"end"},pr=new nf,Su=new _i,Vb=Math.cos(70*K0.DEG2RAD);class Wb extends $i{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new X,this.cursor=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Zi.ROTATE,MIDDLE:Zi.DOLLY,RIGHT:Zi.PAN},this.touches={ONE:Ji.ROTATE,TWO:Ji.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return r.phi},this.getAzimuthalAngle=function(){return r.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(V){V.addEventListener("keydown",wt),this._domElementKeyEvents=V},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",wt),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(bu),i.update(),o=s.NONE},this.update=function(){const V=new X,Tt=new qi().setFromUnitVectors(t.up,new X(0,1,0)),Ut=Tt.clone().invert(),nt=new X,rt=new qi,H=new X,lt=2*Math.PI;return function(Et=null){const Pt=i.object.position;V.copy(Pt).sub(i.target),V.applyQuaternion(Tt),r.setFromVector3(V),i.autoRotate&&o===s.NONE&&R(T(Et)),i.enableDamping?(r.theta+=c.theta*i.dampingFactor,r.phi+=c.phi*i.dampingFactor):(r.theta+=c.theta,r.phi+=c.phi);let Ot=i.minAzimuthAngle,Bt=i.maxAzimuthAngle;isFinite(Ot)&&isFinite(Bt)&&(Ot<-Math.PI?Ot+=lt:Ot>Math.PI&&(Ot-=lt),Bt<-Math.PI?Bt+=lt:Bt>Math.PI&&(Bt-=lt),Ot<=Bt?r.theta=Math.max(Ot,Math.min(Bt,r.theta)):r.theta=r.theta>(Ot+Bt)/2?Math.max(Ot,r.theta):Math.min(Bt,r.theta)),r.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,r.phi)),r.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&b||i.object.isOrthographicCamera?r.radius=q(r.radius):r.radius=q(r.radius*l),V.setFromSpherical(r),V.applyQuaternion(Ut),Pt.copy(i.target).add(V),i.object.lookAt(i.target),i.enableDamping===!0?(c.theta*=1-i.dampingFactor,c.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let Qt=!1;if(i.zoomToCursor&&b){let te=null;if(i.object.isPerspectiveCamera){const Wt=V.length();te=q(Wt*l);const ee=Wt-te;i.object.position.addScaledVector(v,ee),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){const Wt=new X(x.x,x.y,0);Wt.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),Qt=!0;const ee=new X(x.x,x.y,0);ee.unproject(i.object),i.object.position.sub(ee).add(Wt),i.object.updateMatrixWorld(),te=V.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;te!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(te).add(i.object.position):(pr.origin.copy(i.object.position),pr.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(pr.direction))<Vb?t.lookAt(i.target):(Su.setFromNormalAndCoplanarPoint(i.object.up,i.target),pr.intersectPlane(Su,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/l)),i.object.updateProjectionMatrix(),Qt=!0);return l=1,b=!1,Qt||nt.distanceToSquared(i.object.position)>a||8*(1-rt.dot(i.object.quaternion))>a||H.distanceToSquared(i.target)>0?(i.dispatchEvent(bu),nt.copy(i.object.position),rt.copy(i.object.quaternion),H.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",At),i.domElement.removeEventListener("pointerdown",E),i.domElement.removeEventListener("pointercancel",tt),i.domElement.removeEventListener("wheel",pt),i.domElement.removeEventListener("pointermove",P),i.domElement.removeEventListener("pointerup",tt),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",wt),i._domElementKeyEvents=null)};const i=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let o=s.NONE;const a=1e-6,r=new Bh,c=new Bh;let l=1;const h=new X,u=new Lt,f=new Lt,p=new Lt,_=new Lt,g=new Lt,d=new Lt,m=new Lt,y=new Lt,M=new Lt,v=new X,x=new Lt;let b=!1;const w=[],L={};let S=!1;function T(V){return V!==null?2*Math.PI/60*i.autoRotateSpeed*V:2*Math.PI/60/60*i.autoRotateSpeed}function C(V){const Tt=Math.abs(V*.01);return Math.pow(.95,i.zoomSpeed*Tt)}function R(V){c.theta-=V}function O(V){c.phi-=V}const A=function(){const V=new X;return function(Ut,nt){V.setFromMatrixColumn(nt,0),V.multiplyScalar(-Ut),h.add(V)}}(),D=function(){const V=new X;return function(Ut,nt){i.screenSpacePanning===!0?V.setFromMatrixColumn(nt,1):(V.setFromMatrixColumn(nt,0),V.crossVectors(i.object.up,V)),V.multiplyScalar(Ut),h.add(V)}}(),k=function(){const V=new X;return function(Ut,nt){const rt=i.domElement;if(i.object.isPerspectiveCamera){const H=i.object.position;V.copy(H).sub(i.target);let lt=V.length();lt*=Math.tan(i.object.fov/2*Math.PI/180),A(2*Ut*lt/rt.clientHeight,i.object.matrix),D(2*nt*lt/rt.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(A(Ut*(i.object.right-i.object.left)/i.object.zoom/rt.clientWidth,i.object.matrix),D(nt*(i.object.top-i.object.bottom)/i.object.zoom/rt.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function I(V){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l/=V:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function N(V){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?l*=V:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function z(V,Tt){if(!i.zoomToCursor)return;b=!0;const Ut=i.domElement.getBoundingClientRect(),nt=V-Ut.left,rt=Tt-Ut.top,H=Ut.width,lt=Ut.height;x.x=nt/H*2-1,x.y=-(rt/lt)*2+1,v.set(x.x,x.y,1).unproject(i.object).sub(i.object.position).normalize()}function q(V){return Math.max(i.minDistance,Math.min(i.maxDistance,V))}function Z(V){u.set(V.clientX,V.clientY)}function Q(V){z(V.clientX,V.clientX),m.set(V.clientX,V.clientY)}function U(V){_.set(V.clientX,V.clientY)}function Y(V){f.set(V.clientX,V.clientY),p.subVectors(f,u).multiplyScalar(i.rotateSpeed);const Tt=i.domElement;R(2*Math.PI*p.x/Tt.clientHeight),O(2*Math.PI*p.y/Tt.clientHeight),u.copy(f),i.update()}function G(V){y.set(V.clientX,V.clientY),M.subVectors(y,m),M.y>0?I(C(M.y)):M.y<0&&N(C(M.y)),m.copy(y),i.update()}function $(V){g.set(V.clientX,V.clientY),d.subVectors(g,_).multiplyScalar(i.panSpeed),k(d.x,d.y),_.copy(g),i.update()}function J(V){z(V.clientX,V.clientY),V.deltaY<0?N(C(V.deltaY)):V.deltaY>0&&I(C(V.deltaY)),i.update()}function it(V){let Tt=!1;switch(V.code){case i.keys.UP:V.ctrlKey||V.metaKey||V.shiftKey?O(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):k(0,i.keyPanSpeed),Tt=!0;break;case i.keys.BOTTOM:V.ctrlKey||V.metaKey||V.shiftKey?O(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):k(0,-i.keyPanSpeed),Tt=!0;break;case i.keys.LEFT:V.ctrlKey||V.metaKey||V.shiftKey?R(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):k(i.keyPanSpeed,0),Tt=!0;break;case i.keys.RIGHT:V.ctrlKey||V.metaKey||V.shiftKey?R(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):k(-i.keyPanSpeed,0),Tt=!0;break}Tt&&(V.preventDefault(),i.update())}function ot(V){if(w.length===1)u.set(V.pageX,V.pageY);else{const Tt=Rt(V),Ut=.5*(V.pageX+Tt.x),nt=.5*(V.pageY+Tt.y);u.set(Ut,nt)}}function ct(V){if(w.length===1)_.set(V.pageX,V.pageY);else{const Tt=Rt(V),Ut=.5*(V.pageX+Tt.x),nt=.5*(V.pageY+Tt.y);_.set(Ut,nt)}}function K(V){const Tt=Rt(V),Ut=V.pageX-Tt.x,nt=V.pageY-Tt.y,rt=Math.sqrt(Ut*Ut+nt*nt);m.set(0,rt)}function F(V){i.enableZoom&&K(V),i.enablePan&&ct(V)}function B(V){i.enableZoom&&K(V),i.enableRotate&&ot(V)}function W(V){if(w.length==1)f.set(V.pageX,V.pageY);else{const Ut=Rt(V),nt=.5*(V.pageX+Ut.x),rt=.5*(V.pageY+Ut.y);f.set(nt,rt)}p.subVectors(f,u).multiplyScalar(i.rotateSpeed);const Tt=i.domElement;R(2*Math.PI*p.x/Tt.clientHeight),O(2*Math.PI*p.y/Tt.clientHeight),u.copy(f)}function et(V){if(w.length===1)g.set(V.pageX,V.pageY);else{const Tt=Rt(V),Ut=.5*(V.pageX+Tt.x),nt=.5*(V.pageY+Tt.y);g.set(Ut,nt)}d.subVectors(g,_).multiplyScalar(i.panSpeed),k(d.x,d.y),_.copy(g)}function st(V){const Tt=Rt(V),Ut=V.pageX-Tt.x,nt=V.pageY-Tt.y,rt=Math.sqrt(Ut*Ut+nt*nt);y.set(0,rt),M.set(0,Math.pow(y.y/m.y,i.zoomSpeed)),I(M.y),m.copy(y);const H=(V.pageX+Tt.x)*.5,lt=(V.pageY+Tt.y)*.5;z(H,lt)}function mt(V){i.enableZoom&&st(V),i.enablePan&&et(V)}function ut(V){i.enableZoom&&st(V),i.enableRotate&&W(V)}function E(V){i.enabled!==!1&&(w.length===0&&(i.domElement.setPointerCapture(V.pointerId),i.domElement.addEventListener("pointermove",P),i.domElement.addEventListener("pointerup",tt)),It(V),V.pointerType==="touch"?St(V):dt(V))}function P(V){i.enabled!==!1&&(V.pointerType==="touch"?ft(V):at(V))}function tt(V){Ct(V),w.length===0&&(i.domElement.releasePointerCapture(V.pointerId),i.domElement.removeEventListener("pointermove",P),i.domElement.removeEventListener("pointerup",tt)),i.dispatchEvent(wu),o=s.NONE}function dt(V){let Tt;switch(V.button){case 0:Tt=i.mouseButtons.LEFT;break;case 1:Tt=i.mouseButtons.MIDDLE;break;case 2:Tt=i.mouseButtons.RIGHT;break;default:Tt=-1}switch(Tt){case Zi.DOLLY:if(i.enableZoom===!1)return;Q(V),o=s.DOLLY;break;case Zi.ROTATE:if(V.ctrlKey||V.metaKey||V.shiftKey){if(i.enablePan===!1)return;U(V),o=s.PAN}else{if(i.enableRotate===!1)return;Z(V),o=s.ROTATE}break;case Zi.PAN:if(V.ctrlKey||V.metaKey||V.shiftKey){if(i.enableRotate===!1)return;Z(V),o=s.ROTATE}else{if(i.enablePan===!1)return;U(V),o=s.PAN}break;default:o=s.NONE}o!==s.NONE&&i.dispatchEvent($a)}function at(V){switch(o){case s.ROTATE:if(i.enableRotate===!1)return;Y(V);break;case s.DOLLY:if(i.enableZoom===!1)return;G(V);break;case s.PAN:if(i.enablePan===!1)return;$(V);break}}function pt(V){i.enabled===!1||i.enableZoom===!1||o!==s.NONE||(V.preventDefault(),i.dispatchEvent($a),J(gt(V)),i.dispatchEvent(wu))}function gt(V){const Tt=V.deltaMode,Ut={clientX:V.clientX,clientY:V.clientY,deltaY:V.deltaY};switch(Tt){case 1:Ut.deltaY*=16;break;case 2:Ut.deltaY*=100;break}return V.ctrlKey&&!S&&(Ut.deltaY*=10),Ut}function vt(V){V.key==="Control"&&(S=!0,document.addEventListener("keyup",xt,{passive:!0,capture:!0}))}function xt(V){V.key==="Control"&&(S=!1,document.removeEventListener("keyup",xt,{passive:!0,capture:!0}))}function wt(V){i.enabled===!1||i.enablePan===!1||it(V)}function St(V){switch(kt(V),w.length){case 1:switch(i.touches.ONE){case Ji.ROTATE:if(i.enableRotate===!1)return;ot(V),o=s.TOUCH_ROTATE;break;case Ji.PAN:if(i.enablePan===!1)return;ct(V),o=s.TOUCH_PAN;break;default:o=s.NONE}break;case 2:switch(i.touches.TWO){case Ji.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;F(V),o=s.TOUCH_DOLLY_PAN;break;case Ji.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;B(V),o=s.TOUCH_DOLLY_ROTATE;break;default:o=s.NONE}break;default:o=s.NONE}o!==s.NONE&&i.dispatchEvent($a)}function ft(V){switch(kt(V),o){case s.TOUCH_ROTATE:if(i.enableRotate===!1)return;W(V),i.update();break;case s.TOUCH_PAN:if(i.enablePan===!1)return;et(V),i.update();break;case s.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;mt(V),i.update();break;case s.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;ut(V),i.update();break;default:o=s.NONE}}function At(V){i.enabled!==!1&&V.preventDefault()}function It(V){w.push(V.pointerId)}function Ct(V){delete L[V.pointerId];for(let Tt=0;Tt<w.length;Tt++)if(w[Tt]==V.pointerId){w.splice(Tt,1);return}}function kt(V){let Tt=L[V.pointerId];Tt===void 0&&(Tt=new Lt,L[V.pointerId]=Tt),Tt.set(V.pageX,V.pageY)}function Rt(V){const Tt=V.pointerId===w[0]?w[1]:w[0];return L[Tt]}i.domElement.addEventListener("contextmenu",At),i.domElement.addEventListener("pointerdown",E),i.domElement.addEventListener("pointercancel",tt),i.domElement.addEventListener("wheel",pt,{passive:!1}),document.addEventListener("keydown",vt,{passive:!0,capture:!0}),this.update()}}const mr=new qt("#0b0a09"),Eu=Bu,Tu=1.15,tn=Math.PI/180;class jb{constructor(t,{deterministic:e=!1,pixelRatio:i=null}={}){this.deterministic=e,this.pixelRatio=i;const s=new _f({canvas:t,antialias:!0,powerPreference:"high-performance"});s.setPixelRatio(i??Math.min(window.devicePixelRatio||1,2)),s.outputColorSpace=Ae,s.toneMapping=Eu,s.toneMappingExposure=Tu,s.shadowMap.enabled=!0,s.shadowMap.type=Ou,this.renderer=s;const o=new Ch;o.background=mr.clone(),this.scene=o,this.camera=new an(30,1,5,2e5),this.camera.position.set(0,300,1500),this.controls=new Wb(this.camera,t),this.controls.enableDamping=!e,this.controls.dampingFactor=.08,this.controls.autoRotateSpeed=.35,this.controls.autoRotate=!e,this.controls.addEventListener("start",()=>{this.controls.autoRotate=!1}),this.controls.addEventListener("change",()=>this.dirty=!0),this._buildEnvironment(),this._buildRoom(),this._buildLights(),this.content=null,this.box=new An(new X(-100,0,-100),new X(100,200,100)),this.mode="beauty",this.rig="vitrine",this.insets={left:0,right:0,top:0,bottom:0},this.fitScale=e?1:1.18,this.dirty=!0,this._frameWaiters=[],this.onFrame=null,this.resize(),window.addEventListener("resize",()=>this.resize());const a=()=>{requestAnimationFrame(a),(this.controls.update()||this.dirty||this._frameWaiters.length)&&this.render()};requestAnimationFrame(a)}_buildEnvironment(){const t=e=>{const i=new Ch,s=g=>{const d=new qt(g);return e?d.setScalar(.2126*d.r+.7152*d.g+.0722*d.b):d},o=(g,d)=>new Fi({color:s(g).multiplyScalar(d),side:Un}),a=new Lr(16,32,16),r=[],c=a.attributes.position,l=s("#121211"),h=s("#343230"),u=s("#43413e");for(let g=0;g<c.count;g++){const d=c.getY(g)/16,m=d<0?l.clone().lerp(h,d+1):h.clone().lerp(u,Math.min(1,d*1.4));r.push(m.r,m.g,m.b)}a.setAttribute("color",new fe(r,3)),i.add(new he(a,new Fi({vertexColors:!0,side:Ye})));const f=(g,d,m,y,M,v,x)=>{const b=new he(new As(g,d),o(m,y));return b.position.set(...M),b.lookAt(...v),i.add(b),b};f(7,4.5,"#fff0e2",3.5,[-5.5,7,6],[0,.5,0]),f(9,6,"#fff0e0",.8,[0,9.5,0],[0,0,0]);for(let g=0;g<5;g++)f(.5,.5,"#fff0dc",14,[-6+g*3,11,-3+g%2*5],[0,0,0]);f(1.3,8,"#b9cde6",2.2,[8,4,-6],[0,2,0]),f(6,2.2,"#ffe2c4",.9,[-2,3.5,-10],[0,2,0]),f(5,4,"#ffe6d2",1.6,[9,3,5],[0,1.5,0]),f(6,4,"#ffeadb",1.4,[-10,3,-1],[0,1.5,0]);for(const g of[-7.5,7.5])f(.08,12,"#e8e0d4",1.2,[g,3,7.5],[g,3,0]);f(10,10,"#1e1d1b",1,[0,-2.5,0],[0,0,0]),f(18,7,"#5f5b56",2.2,[0,3,13],[0,3,0]),f(3.5,2.2,"#ffeedd",3,[2.5,4.5,11],[0,1.5,0]);const p=new fc(this.renderer),_=p.fromScene(i,.015).texture;return p.dispose(),_};this.envMap=t(!1),this.envNeutral=t(!0),this.scene.environment=this.envMap}_buildRoom(){this.backdrop=new he(new Lr(1,32,16),new Fi({color:mr,side:Ye,fog:!1,depthWrite:!1,toneMapped:!1})),this.backdrop.renderOrder=-1,this.scene.add(this.backdrop),this.floor=new he(new As(1,1),new po({color:"#141210",roughness:.97,metalness:0,envMapIntensity:.2})),this.floor.rotation.x=-Math.PI/2,this.floor.receiveShadow=!0,this.scene.add(this.floor);const t=new po({color:"#2b2722",roughness:.9,metalness:0,envMapIntensity:.3}),e=new po({color:"#1a1714",roughness:.93,metalness:0,envMapIntensity:.25});this.plinth=new he(new Vs(1,1,1),[e,e,t,e,e,e]),this.plinth.receiveShadow=!0,this.plinth.castShadow=!0,this.scene.add(this.plinth);const i=document.createElement("canvas");i.width=i.height=128;const s=i.getContext("2d"),o=s.createRadialGradient(64,64,0,64,64,64);o.addColorStop(0,"rgba(0,0,0,0.75)"),o.addColorStop(.45,"rgba(0,0,0,0.42)"),o.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=o,s.fillRect(0,0,128,128);const a=new sM(i);a.colorSpace=Ae,this.contact=new he(new As(1,1),new Fi({map:a,transparent:!0,depthWrite:!1,toneMapped:!1,fog:!1})),this.contact.rotation.x=-Math.PI/2,this.contact.renderOrder=1,this.scene.add(this.contact),this._fog=new Vc(mr,1e3,5e3),this.scene.fog=this._fog}_buildLights(){this.key=new zh("#fff6ee",4.2,0,.5,.6,0),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048),this.key.shadow.bias=-2e-4,this.key.shadow.radius=4,this.scene.add(this.key,this.key.target),this.fill=new BM("#d6d4ce",.3),this.scene.add(this.fill,this.fill.target),this.rim=new zh("#dfe6f0",2.6,0,.45,.95,0),this.scene.add(this.rim,this.rim.target),this.ambient=new FM("#7d7a74","#5a5651",1.45),this.scene.add(this.ambient),this._lightLook={key:this.key.color.clone(),fill:this.fill.color.clone(),rim:this.rim.color.clone()}}setContent(t,{rig:e="vitrine"}={}){this.content&&this.scene.remove(this.content),this.content=t,this.rig=e,t&&(this.scene.add(t),t.updateMatrixWorld(!0),this.box=new An().setFromObject(t),xd(t)),this._layoutRoom(),this.dirty=!0}_layoutRoom(){const t=this.box,e=t.getSize(new X),i=t.getCenter(new X),s=Math.max(e.length()/2,10);this.R=s;const o=Math.max(12,Math.min(60,e.y*.08)),a=Math.max(e.x,e.z*.6)*1.32+40,r=Math.max(e.z,e.x*.5)*1.32+40;this.plinth.scale.set(a,o,r),this.plinth.position.set(i.x,t.min.y-o/2,i.z),this.floor.scale.set(s*60,s*60,1),this.floor.position.set(i.x,t.min.y-o,i.z),this.backdrop.scale.setScalar(s*40),this.backdrop.position.copy(i),this.contact.scale.set(e.x*1.25+20,e.z*1.25+20,1),this.contact.position.set(i.x,t.min.y+.3,i.z);const c=new X(i.x,t.min.y+e.y*.45,i.z),l=(p,_)=>new X(Math.sin(p*tn)*Math.cos(_*tn),Math.sin(_*tn),Math.cos(p*tn)*Math.cos(_*tn)),h=s*4.2,u=this.rig==="raking"?0:this._lightAz||0;this.rig==="raking"?(this.key.position.copy(c).addScaledVector(l(-74,22),h),this.key.angle=Math.atan(s*1.6/h),this.key.intensity=5.2,this.rim.intensity=.6,this.fill.intensity=.2,this.contact.visible=!1):(this.key.position.copy(c).addScaledVector(l(u-36,24),h),this.key.angle=Math.atan(s*2.4/h),this.key.intensity=4.2,this.rim.intensity=3.2,this.fill.intensity=2.4,this.contact.visible=!0),this.key.target.position.copy(c);const f=this.key.shadow.camera;f.near=h*.4,f.far=h*2,f.updateProjectionMatrix(),this.key.shadow.normalBias=s*.0015,this.key.shadow.needsUpdate=!0,this.rim.position.copy(c).addScaledVector(l(u+165,32),h),this.rim.angle=Math.atan(s*1.5/h),this.rim.target.position.copy(c),this.fill.position.copy(c).addScaledVector(l(u+50,18),h),this.fill.target.position.copy(c),this._face&&this.rig!=="raking"&&this._layoutFaceLights(h)}_layoutFaceLights(t){var h,u;const e=this._face,i=(((h=e.light)==null?void 0:h.elevation)??35)*tn,s=(((u=e.light)==null?void 0:u.azimuth)??135)*tn,o=e.center,r=e.right.clone().multiplyScalar(Math.cos(s)).addScaledVector(e.up,Math.sin(s)).multiplyScalar(Math.cos(i)).addScaledVector(e.normal,Math.sin(i)).normalize();this.key.position.copy(o).addScaledVector(r,t),this.key.target.position.copy(o),this.key.angle=Math.atan(this.R*2.4/t);const c=e.right.clone().multiplyScalar(.5).addScaledVector(e.up,-.3).addScaledVector(e.normal,.8).normalize();this.fill.position.copy(o).addScaledVector(c,t),this.fill.target.position.copy(o),this.fill.intensity=.8,this.rim.intensity=0,this.contact.visible=!1;const l=this.key.shadow.camera;l.near=t*.4,l.far=t*2,l.updateProjectionMatrix(),this.key.shadow.needsUpdate=!0}_setFaceView(t){const e=t.face,i=new X(...e.normal).normalize(),s=new X(...e.up||[0,1,0]),o=s.addScaledVector(i,-s.dot(i)).normalize(),a=new X().crossVectors(o,i).normalize(),r=new X(...e.center);this._face={center:r,normal:i,up:o,right:a,width:e.width,height:e.height,light:e.light||t.light};const c=t.fov??1,l=(t.fit??1)*this.fitScale,h=this.camera;h.fov=c;const{w:u,h:f}=this._effectiveSize(),p=Math.tan(c*tn/2)/(this.height/2),_=p*(f/2),g=p*(u/2),d=Math.max(e.width/2/g,e.height/2/_)*l;h.up.copy(o),h.position.copy(r).addScaledVector(i,d),this.controls.target.copy(r);const m=this.R||100;h.near=Math.max(1,d-m*3),h.far=d+m*6,h.updateProjectionMatrix(),this.controls.minDistance=d*.05,this.controls.maxDistance=d*3,this.controls.maxPolarAngle=Math.PI,this.controls.update(),h.lookAt(r),this._fog.near=d+m*1.4,this._fog.far=d+m*9,this._layoutRoom(),this._applyViewOffset(),this.dirty=!0}get faceView(){const t=this._face;return t&&{center:t.center.toArray(),normal:t.normal.toArray(),up:t.up.toArray(),right:t.right.toArray(),width:t.width,height:t.height}}setView(t={}){if(t.face)return this._setFaceView(t);this._face&&(this._face=null,this.camera.up.set(0,1,0),this._lightAz=void 0);const{azimuth:e=25,elevation:i=12,fov:s=30}=t;this.rig!=="raking"&&this._lightAz!==e&&(this._lightAz=e,this._layoutRoom());const o=(t.fit??1.1)*this.fitScale,a=this.camera;a.fov=s;const r=this.box,c=t.target?new X(...t.target):r.getCenter(new X),l=new X(Math.sin(e*tn)*Math.cos(i*tn),Math.sin(i*tn),Math.cos(e*tn)*Math.cos(i*tn)),h=new X().crossVectors(new X(0,1,0),l).normalize();h.lengthSq()<1e-6&&h.set(1,0,0);const u=new X().crossVectors(l,h).normalize(),{w:f,h:p}=this._effectiveSize(),_=Math.tan(s*tn/2)/(this.height/2),g=_*(p/2),d=_*(f/2);let m=0;if(t.target)m=this.R*o/Math.min(g,d);else{for(let y=0;y<8;y++){const M=new X(y&1?r.max.x:r.min.x,y&2?r.max.y:r.min.y,y&4?r.max.z:r.min.z).sub(c),v=Math.abs(M.dot(h)),x=Math.abs(M.dot(u)),b=M.dot(l);m=Math.max(m,b+v/d,b+x/g)}m*=o}a.position.copy(c).addScaledVector(l,m),this.controls.target.copy(c),a.near=Math.max(1,m/100),a.far=this.R*80,a.updateProjectionMatrix(),this.controls.minDistance=this.R*.25,this.controls.maxDistance=this.R*12,this.controls.maxPolarAngle=Math.PI*.5-.02,this.controls.update(),this._fog.near=m+this.R*1.4,this._fog.far=m+this.R*9,this._applyViewOffset(),this.dirty=!0}setInsets(t){this.insets={left:0,right:0,top:0,bottom:0,...t},this._applyViewOffset(),this.dirty=!0}_effectiveSize(){const t=this.width||1,e=this.height||1;return{w:Math.max(100,t-this.insets.left-this.insets.right),h:Math.max(100,e-this.insets.top-this.insets.bottom)}}_applyViewOffset(){const t=this.width,e=this.height,i=(this.insets.right-this.insets.left)/2,s=(this.insets.bottom-this.insets.top)/2;Math.abs(i)<.5&&Math.abs(s)<.5?this.camera.clearViewOffset():this.camera.setViewOffset(t,e,i,s,t,e),this.camera.aspect=t/e,this.camera.updateProjectionMatrix()}setMode(t){this.mode=t;const e=t==="beauty"||t==="clay",i=t==="clay";vd(t==="silhouette"?"beauty":t),this.renderer.toneMapping=e?Eu:ti,this.renderer.toneMappingExposure=i?1:Tu,this.scene.overrideMaterial=t==="silhouette"?this._white??(this._white=new Fi({color:16777215})):null;for(const s of[this.floor,this.plinth,this.backdrop])s.visible=e;this.contact.visible=e&&this.rig!=="raking";for(const s of[this.key,this.fill,this.rim,this.ambient])s.visible=e;this.key.color.copy(i?new qt("#ffffff"):this._lightLook.key),this.fill.color.copy(i?new qt("#d8d8d8"):this._lightLook.fill),this.rim.color.copy(i?new qt("#ffffff"):this._lightLook.rim),this.scene.environment=e?i?this.envNeutral:this.envMap:null,this.scene.fog=e?this._fog:null,this.scene.background=e?mr:new qt(0),this.dirty=!0}resize(){const t=window.innerWidth,e=window.innerHeight,i=this.pixelRatio??Math.min(window.devicePixelRatio||1,2);i!==this.renderer.getPixelRatio()&&this.renderer.setPixelRatio(i),this.width=t,this.height=e,this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this._applyViewOffset(),this.dirty=!0}restoreContext(){var t;for(const e of[this.envMap,this.envNeutral])(t=e==null?void 0:e.dispose)==null||t.call(e);this._buildEnvironment(),this.setMode(this.mode),this.key.shadow.needsUpdate=!0,this.dirty=!0}render(){this.dirty=!1,this.renderer.render(this.scene,this.camera);const t=this._frameWaiters;this._frameWaiters=[];for(const e of t)e();this.onFrame&&this.onFrame()}frame(){return new Promise(t=>{this._frameWaiters.push(t),this.dirty=!0})}setAutoRotate(t){this.controls.autoRotate=t&&!this.deterministic}}const qb=["beauty","clay","silhouette","height","mask"];function Nc(n=location.hash){let t=String(n||"").replace(/^#/,"");try{t=decodeURIComponent(t)}catch{return null}return t=t.trim(),/^[A-Za-z0-9-]{1,80}$/.test(t)?t:null}function Xb(){const n=e=>{try{return window.matchMedia(e).matches}catch{return!1}},t=Math.min((screen==null?void 0:screen.width)||9999,(screen==null?void 0:screen.height)||9999);return n("(pointer: coarse)")&&t<=820||Math.min(window.innerWidth,window.innerHeight)<=500||window.innerWidth<=720}const Bd={get(n){var t;try{return((t=window.localStorage)==null?void 0:t.getItem(n))??null}catch{return null}},set(n,t){var e,i;try{t==null?(e=window.localStorage)==null||e.removeItem(n):(i=window.localStorage)==null||i.setItem(n,String(t))}catch{}}},Gd="taotie-bronze.quality";function Yb(n=location.search,t=location.hash){const e=new URLSearchParams(n),i=f=>{const p=parseFloat(e.get(f));return Number.isFinite(p)?p:null},s=e.get("mode"),o=Xb(),a=Nc(t),r=parseFloat(Bd.get(Gd)),c=i("q"),l=c??(Number.isFinite(r)?r:o?.5:1),h=i("dpr"),u=e.get("tab");return{a:e.get("a"),view:e.get("view"),patina:e.get("patina"),mode:qb.includes(s)?s:"beauty",ui:e.get("ui")!=="0",q:Math.min(4,Math.max(.25,l)),qExplicit:c!=null,compact:o,dpr:Math.min(3,Math.max(.5,h??Math.min(window.devicePixelRatio||1,2))),tab:u==="atlas"||!u&&!e.get("a")&&a==="atlas"?"atlas":"vessels",motif:e.get("motif"),preset:e.get("preset"),route:a}}const $b=`// The artifact registry: one line per artifact, alphabetical by file name.
// Each module's default export follows the artifact contract in KIT.md.
export { default as demoFangding } from './demo-fangding.js'
export { default as houmuwuDing } from './houmuwu-ding.js'
export { default as metFangding } from './met-fangding.js'
export { default as metFangyi } from './met-fangyi.js'
export { default as metGui } from './met-gui.js'
export { default as metGu } from './met-gu.js'
export { default as metZun } from './met-zun.js'
export { default as nezuFangyi } from './nezu-fangyi.js'
export { default as yachouYue } from './yachou-yue.js'
`,Kb=Object.assign({"../artifacts/demo-fangding.js":()=>Cn(()=>import("./demo-fangding-CMiYNAUj.js"),[],import.meta.url).then(n=>n.default),"../artifacts/houmuwu-ding.js":()=>Cn(()=>import("./houmuwu-ding-BmZcQcgf.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-fangding.js":()=>Cn(()=>import("./met-fangding-Cd7wYauC.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-fangyi.js":()=>Cn(()=>import("./met-fangyi-Bkr4TE4b.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-gu.js":()=>Cn(()=>import("./met-gu-C7e29Mkm.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-gui.js":()=>Cn(()=>import("./met-gui-C1hEb9VF.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-zun.js":()=>Cn(()=>import("./met-zun-CE3EIt_V.js"),[],import.meta.url).then(n=>n.default),"../artifacts/nezu-fangyi.js":()=>Cn(()=>import("./nezu-fangyi-3XbC0fUJ.js"),[],import.meta.url).then(n=>n.default),"../artifacts/yachou-yue.js":()=>Cn(()=>import("./yachou-yue-DHP6R9WN.js"),[],import.meta.url).then(n=>n.default)}),Au=(n,t)=>(n.order??0)-(t.order??0)||String(n.title).localeCompare(String(t.title));function Zb(){const n=[...$b.matchAll(/^\s*export\s*\{\s*default\s+as\s+\w+\s*\}\s*from\s*['"]\.\/([^'"]+\.js)['"]/gm)].map(c=>c[1]),t=[];for(const c of n){const l=Kb["../artifacts/"+c];if(!l){console.warn(`[taotie] ${c} is registered but not lazily loadable (study files starting with "_" are skipped)`);continue}t.push({file:c,id:c.replace(/\.js$/,""),loader:l,artifact:null,promise:null})}const e=t.map(c=>c.id),i=new Set;let s=null;const o=c=>t.find(l=>{var h;return l.id===c||((h=l.artifact)==null?void 0:h.id)===c});function a(c){return c.promise??(c.promise=c.loader().then(l=>{c.artifact=l,l!=null&&l.id&&l.id!==c.id&&(e[e.indexOf(c.id)]=l.id,c.id=l.id);for(const h of i)h(l);return l})),c.promise}function r(){return s??(s=Promise.all(t.map(c=>a(c))).then(()=>{const c=t.map(l=>l.artifact).sort(Au);return e.splice(0,e.length,...c.map(l=>l.id)),c})),s}return{ids:e,get loaded(){return t.filter(c=>c.artifact).map(c=>c.artifact).sort(Au)},has:c=>!!o(c),get:c=>{var l;return((l=o(c))==null?void 0:l.artifact)||null},async load(c){var h;const l=o(c);return l?a(l):(await r(),((h=o(c))==null?void 0:h.artifact)||null)},loadAll:r,async first(){return(await r())[0]},onLoad(c){i.add(c)}}}function Nt(n,t={},...e){const i=document.createElement(n);for(const[s,o]of Object.entries(t))o==null||o===!1||(s==="class"?i.className=o:s==="text"?i.textContent=o:s.startsWith("on")?i.addEventListener(s.slice(2),o):i.setAttribute(s,o===!0?"":o));for(const s of e.flat())s!=null&&i.append(s);return i}const Ka=(n,t,e)=>{const i=t>=1?0:t>=.1?1:2;return Number(n).toFixed(i)+(e?" "+e:"")};function Ru({label:n,min:t,max:e,step:i=.01,value:s,unit:o,onInput:a,cls:r}){const c=Nt("span",{class:"ctl-val",text:Ka(s,i,o)}),l=Nt("input",{type:"range",min:t,max:e,step:i,value:s,"aria-label":n});return l.addEventListener("input",()=>{const u=parseFloat(l.value);c.textContent=Ka(u,i,o),a(u)}),{el:Nt("div",{class:"ctl"+(r?" "+r:"")},Nt("div",{class:"ctl-row"},Nt("span",{class:"ctl-label",text:n}),c),l),set(u){l.value=u,c.textContent=Ka(u,i,o)}}}function Jb({label:n,value:t,onInput:e}){const i=Nt("input",{type:"color",value:t,"aria-label":n});return i.addEventListener("input",()=>e(i.value)),{el:Nt("div",{class:"ctl"},Nt("div",{class:"ctl-row"},Nt("span",{class:"ctl-label",text:n}),i)),set:o=>i.value=o}}function wS({label:n,options:t,value:e,onInput:i}){const s=Nt("select",{"aria-label":n},t.map(a=>Nt("option",{value:a,text:a,selected:a===e})));return s.addEventListener("change",()=>i(s.value)),{el:Nt("div",{class:"ctl"},Nt("div",{class:"ctl-row"},Nt("span",{class:"ctl-label",text:n})),s),set:a=>s.value=a}}function SS({label:n,value:t,onInput:e}){const i=Nt("input",{type:"checkbox",checked:!!t,"aria-label":n});return i.addEventListener("change",()=>e(i.checked)),{el:Nt("label",{class:"ctl toggle"},Nt("span",{class:"ctl-label",text:n}),i),set:o=>i.checked=!!o}}function Za(n,t,{value:e,onPick:i,seg:s=!1}={}){const o=n||Nt("div");o.classList.add(s?"seg":"chips"),o.replaceChildren();const a=t.map(c=>{const l=Nt("button",{type:"button",text:c.label??c.id,"data-id":c.id});return l.addEventListener("click",()=>{r(c.id),i==null||i(c.id)}),o.append(l),l});function r(c){for(const l of a)l.classList.toggle("on",l.dataset.id===c)}return r(e),{el:o,set:r}}const Qb=()=>new Promise(n=>setTimeout(n,0)),oo=n=>Math.round(n*10)/10,Pu=n=>{const t=n.getSize(new X);return{min:n.min.toArray().map(oo),max:n.max.toArray().map(oo),w:oo(t.x),h:oo(t.y),d:oo(t.z)}};function tw(n){if(!n)return null;n.updateMatrixWorld(!0);const t=new An().setFromObject(n),e={};n.traverse(s=>{var c;if(!s.isMesh)return;let o=null,a=null;for(let l=s;l;l=l.parent){if((c=l.userData)!=null&&c.part)if(o||(o=l.userData.part),l.userData.part===o)a=l;else break;if(l===n)break}if(!o)return;const r=e[o]??(e[o]={box:new An,roots:new Set});r.box.union(new An().setFromObject(s)),r.roots.add(a)});const i={overall:Pu(t),parts:{}};for(const[s,o]of Object.entries(e))i.parts[s]={...Pu(o.box),count:o.roots.size};return i}function Hd(n){const t={triangles:0,vertices:0,meshes:0};return n==null||n.traverse(e=>{var o,a;if(!e.isMesh||!e.geometry)return;const i=e.geometry,s=i.index?i.index.count:((o=i.attributes.position)==null?void 0:o.count)||0;t.triangles+=Math.floor(s/3),t.vertices+=((a=i.attributes.position)==null?void 0:a.count)||0,t.meshes++}),t}function ew(n){const t=Hd(n),e=i=>i>=1e6?(i/1e6).toFixed(2)+" M":i>=1e4?Math.round(i/1e3)+" k":i>=1e3?(i/1e3).toFixed(1)+" k":String(i);return`${e(t.triangles)} triangles · ${e(t.vertices)} vertices · ${t.meshes} meshes`}function nw(n){const t=n.stage;return t!=null&&t.setView?{async setFace(e,i={}){var s;(s=t.setAutoRotate)==null||s.call(t,!1),t.setView({...i,face:e}),await t.frame()},faceView:()=>t.faceView??null}:{}}function iw(n){let t;const e=new Promise(i=>t=i);return window.__taotie={ready:e,...nw(n),...n},{markReady(){document.documentElement.dataset.ready="1",t(!0)}}}const sw=n=>{const t=n/10;return(t>=100?Math.round(t):Math.round(t*10)/10).toString()},Lu=n=>String(n.collection||"").split(/\s+—\s+|\s+-\s+/)[0],Cu=n=>n&&!/^(unknown|not published|n\/a|none)$/i.test(String(n).trim()),Ja=n=>(n.order??0)>=90;function ow({stage:n,catalog:t,quality:e,cacheMax:i=2,progress:s,listEl:o,labelEl:a,onShown:r,onPick:c}){const l=new Map;let h=null,u=0,f=null;const p={};let _=!1,g=null,d=e,m=null;const y=new Map;function M(){const R=t.loaded,O=t.ids.filter(D=>!t.get(D));o.replaceChildren();let A=!1;for(const D of R){Ja(D)&&!A&&(A=!0,o.append(Nt("li",{class:"sep","aria-hidden":"true"},Nt("span",{class:"cap",text:"Kit test piece"}))));const k=Nt("span",{class:"v-sub"}),I=Nt("button",{type:"button",class:"vessel","data-id":D.id,onclick:()=>c(D.id)},Nt("span",{class:"v-line"},Nt("span",{class:"v-title",text:D.title}),D.titleZh?Nt("span",{class:"v-zh",lang:"zh-Hans",text:D.titleZh}):null),k);y.set(D.id,{btn:I,sub:k,a:D}),o.append(Nt("li",{},I)),v(D.id)}for(const D of O)o.append(Nt("li",{class:"pending"},Nt("span",{class:"v-title",text:D.replace(/-/g," ")})));x()}function v(R,O){const A=y.get(R);if(!A)return;const D=A.a,k=Cu(D.accession)&&String(D.accession).length<=18?" · "+D.accession:"";A.sub.textContent=O??(Ja(D)?"Procedural · not an excavated object":Lu(D)+k),A.sub.classList.toggle("busy",O!=null)}function x(){const R=(h==null?void 0:h.artifact.id)??g;for(const[O,A]of y)O===R?A.btn.setAttribute("aria-current","true"):A.btn.removeAttribute("aria-current")}t.onLoad(()=>M()),M();function b(R){const O=R.dimensions||{},A=["h","w","d"].filter(I=>O[I]).map(I=>`${I.toUpperCase()} ${sw(O[I])}`).join(" × ")+(Object.keys(O).length?" cm":""),D=(I,N)=>N?Nt("div",{class:"row"},Nt("dt",{text:I}),Nt("dd",{text:N})):null,k=Nt("button",{type:"button",class:"label-head","aria-expanded":String(_),"aria-controls":"label-body",onclick:()=>w(!_)},R.titleZh?Nt("span",{class:"zh",lang:"zh-Hans",text:R.titleZh}):null,Nt("span",{class:"title",text:R.title}),Nt("span",{class:"line",text:[R.date,Lu(R)].filter(Boolean).join(" · ")}),Nt("span",{class:"status","aria-live":"polite"}),Nt("span",{class:"more","aria-hidden":"true"}));a.replaceChildren(k,Nt("div",{class:"label-body",id:"label-body"},Nt("dl",{class:"meta"},D("Date",R.date),D("Period",R.period),D("Findspot",R.findspot),D("Collection",R.collection),D("Accession",Cu(R.accession)?R.accession:R.accession?"not published":null),D("Size",A),Nt("div",{class:"row mesh-row",hidden:!0},Nt("dt",{text:"Mesh"}),Nt("dd",{class:"mesh"}))),R.blurb?Nt("p",{class:"blurb",text:R.blurb}):null,Ja(R)?Nt("p",{class:"note",text:"A procedural test piece for the Taotie Kit — not a copy of any one object."}):null)),a.classList.toggle("open",_)}function w(R){var O;_=R,a.classList.toggle("open",R),(O=a.querySelector(".label-head"))==null||O.setAttribute("aria-expanded",String(R)),m==null||m()}function L(R){const O=a.querySelector(".status");O&&(O.textContent=R||""),a.classList.toggle("busy",!!R)}function S(R){for(const[O,A]of l){if(l.size<=i)break;O===R||!A.result||(h==null?void 0:h.result)===A.result||(l.delete(O),Qa(A.result))}}function T(R){const O=l.get(R.id);if(O)return l.delete(R.id),l.set(R.id,O),O.promise;const A=performance.now(),D={};return D.promise=(async()=>{const k=await R.build(zd,{quality:d,onProgress:async(I,N)=>{if(f===R.id){const z=Math.round(Math.max(0,Math.min(1,I))*100);s.set(I,N),L(`Casting${N?" · "+N:""} — ${z}%`),v(R.id,`casting · ${z}%`)}await Qb()}});return k.object.userData.artifact=R.id,k.object.traverse(I=>{I.isMesh&&(I.castShadow=I.receiveShadow=!0)}),p[R.id]=Math.round(performance.now()-A),D.result=k,k})(),D.promise.catch(()=>l.delete(R.id)),l.set(R.id,D),D.promise}async function C(R,{view:O}={}){var Q,U,Y,G;const A=++u;g=R,x();const D=await t.load(R);if(A!==u)return null;if(!D)throw new Error(`unknown artifact "${R}"`);g=D.id,x(),b(D),document.documentElement.dataset.ready="0",((Q=l.get(D.id))==null?void 0:Q.result)||(f=D.id,s.start(D.title),L("Casting…"),v(D.id,"casting…"));let I;try{I=await T(D)}catch($){throw A===u&&(s.done(),L("This vessel could not be built."),v(D.id)),$}if(f===D.id&&(f=null),v(D.id),A!==u)return null;s.done(),L("");const N=h;h={artifact:D,result:I},n.setContent(I.object,{rig:"vitrine"});const z=a.querySelector(".mesh-row");z&&(z.querySelector(".mesh").textContent=ew(I.object),z.hidden=!1),x(),S(D.id),N&&N.result!==I&&((U=l.get(N.artifact.id))==null?void 0:U.result)!==N.result&&Qa(N.result);const q=Object.keys(D.views||{}),Z=O&&((Y=D.views)!=null&&Y[O])?O:q[0];return n.setView(((G=D.views)==null?void 0:G[Z])||{}),r==null||r(D,Z),h}return{show:C,renderList:M,get current(){return h},get requested(){return g},get quality(){return d},timings:p,setView(R){var A;const O=h==null?void 0:h.artifact;(A=O==null?void 0:O.views)!=null&&A[R]&&n.setView(O.views[R])},setLabelOpen:w,get labelOpen(){return _},set onLayout(R){m=R},setQuality(R){d=R;for(const[O,A]of l)A.result&&A.result!==(h==null?void 0:h.result)&&Qa(A.result),l.delete(O)}}}function Qa(n){var e;if(!n||n.disposed)return;n.disposed=!0;const t=new Set(Object.values(n.panels||{}));n.object.traverse(i=>{var o,a,r;if(!i.isMesh&&!i.isLine&&!i.isPoints)return;(o=i.geometry)==null||o.dispose();const s=Array.isArray(i.material)?i.material:[i.material];for(const c of s)if(c){c.relief&&t.add(c.relief);for(const l of["map","normalMap","roughnessMap","metalnessMap","aoMap","bumpMap","displacementMap","emissiveMap"])(r=(a=c[l])==null?void 0:a.dispose)==null||r.call(a);c.dispose()}});for(const i of t)(e=i==null?void 0:i.dispose)==null||e.call(i)}const rw=""+new URL("detail-frieze-bottom-centre-B0wXWedd.jpg",import.meta.url).href,aw=""+new URL("detail-frieze-top-centre-DTP8pGr8.jpg",import.meta.url).href,cw=""+new URL("detail-handle-front-BuWrTtle.jpg",import.meta.url).href,lw=""+new URL("detail-handle-roots-D9Zsh3ou.jpg",import.meta.url).href,hw=""+new URL("detail-handle-BcCO0NS_.jpg",import.meta.url).href,uw=""+new URL("detail-leg-b-CIUEqyks.jpg",import.meta.url).href,fw=""+new URL("detail-leg-c-Cmd1UVyM.jpg",import.meta.url).href,dw=""+new URL("detail-leg-d-gUaqHbhL.jpg",import.meta.url).href,pw=""+new URL("detail-leg-CuxR3i4M.jpg",import.meta.url).href,mw=""+new URL("detail-short-wall-CFJCrCOX.jpg",import.meta.url).href,gw=""+new URL("face-long-bottom-frieze-BwvqP2ZZ.jpg",import.meta.url).href,_w=""+new URL("face-long-column-CgZmo0-N.jpg",import.meta.url).href,Mw=""+new URL("face-long-top-frieze-RHrxpQUK.jpg",import.meta.url).href,yw=""+new URL("face-long-CJPfl1Qq.jpg",import.meta.url).href,vw=""+new URL("face-rubbing-long-DabtWI9P.jpg",import.meta.url).href,xw=""+new URL("face-short-DQ7GEcii.jpg",import.meta.url).href,bw=""+new URL("front-CitwosNZ.jpg",import.meta.url).href,ww=""+new URL("side-low-CmX23HbI.jpg",import.meta.url).href,Sw=""+new URL("side-ObckiVDM.jpg",import.meta.url).href,Ew=""+new URL("three-quarter-left-low-BviVl0eT.jpg",import.meta.url).href,Tw=""+new URL("three-quarter-right-b-Cwu1h8HP.jpg",import.meta.url).href,Aw=""+new URL("three-quarter-right-d97FAjgy.jpg",import.meta.url).href,Rw=""+new URL("three-quarter-A9i1SPi4.jpg",import.meta.url).href,Pw=""+new URL("detail-face-short-gaCmK_qK.jpg",import.meta.url).href,Lw=""+new URL("detail-flange-centre-C9okRFus.jpg",import.meta.url).href,Cw=""+new URL("detail-flange-corner-BtFxBxX9.jpg",import.meta.url).href,kw=""+new URL("detail-frieze-long-DSBwyu2A.jpg",import.meta.url).href,Dw=""+new URL("detail-handle-TlBf82JQ.jpg",import.meta.url).href,Iw=""+new URL("detail-leg-BMHJAwuS.jpg",import.meta.url).href,Uw=""+new URL("detail-mask-long-Wx7XwQ6o.jpg",import.meta.url).href,Nw=""+new URL("face-long-frieze-WkF2UQil.jpg",import.meta.url).href,Fw=""+new URL("face-long-main-Du3SluEt.jpg",import.meta.url).href,Ow=""+new URL("face-long-C_qdfl1E.jpg",import.meta.url).href,zw=""+new URL("face-short-main-D6pwYpPT.jpg",import.meta.url).href,Bw=""+new URL("face-short-Wp_YnBPL.jpg",import.meta.url).href,Gw=""+new URL("front-Bbc7Fx-O.jpg",import.meta.url).href,Hw=""+new URL("side-C-4S0EIZ.jpg",import.meta.url).href,Vw=""+new URL("three-quarter-B9hAArMG.jpg",import.meta.url).href,Ww=""+new URL("detail-face-long-BAD2txtd.jpg",import.meta.url).href,jw=""+new URL("detail-face-short-D_HEsXeg.jpg",import.meta.url).href,qw=""+new URL("detail-flanges-Dnmd43RN.jpg",import.meta.url).href,Xw=""+new URL("detail-foot-long-WaOhdBNC.jpg",import.meta.url).href,Yw=""+new URL("detail-foot-short--wLT1VKJ.jpg",import.meta.url).href,$w=""+new URL("detail-frieze-long-BmLSRg_-.jpg",import.meta.url).href,Kw=""+new URL("detail-frieze-short-B_6JotH8.jpg",import.meta.url).href,Zw=""+new URL("detail-knob-CYmBp5d_.jpg",import.meta.url).href,Jw=""+new URL("detail-lid-end-yPIYmy6i.jpg",import.meta.url).href,Qw=""+new URL("detail-lid-long-CEYrDkRW.jpg",import.meta.url).href,t2=""+new URL("face-end-aS0B8k4G.jpg",import.meta.url).href,e2=""+new URL("face-lid-end-n9Nah1yf.jpg",import.meta.url).href,n2=""+new URL("face-lid-long-Cu8ndTwk.jpg",import.meta.url).href,i2=""+new URL("face-long-foot-BEHQ9msq.jpg",import.meta.url).href,s2=""+new URL("face-long-frieze-y5zXE_qZ.jpg",import.meta.url).href,o2=""+new URL("face-long-main-Cb5CzBbC.jpg",import.meta.url).href,r2=""+new URL("face-long-BUuFU4tc.jpg",import.meta.url).href,a2=""+new URL("side-RGqLPIbj.jpg",import.meta.url).href,c2=""+new URL("three-quarter-BsVisZv3.jpg",import.meta.url).href,l2=""+new URL("detail-blade-DHv8hS9R.jpg",import.meta.url).href,h2=""+new URL("detail-collar-J8ixw7q2.jpg",import.meta.url).href,u2=""+new URL("detail-flange-ladder-BQustu1H.jpg",import.meta.url).href,f2=""+new URL("detail-foot-front-C1eWMavt.jpg",import.meta.url).href,d2=""+new URL("detail-foot-halfmask-e5l_VeAG.jpg",import.meta.url).href,p2=""+new URL("detail-foot-ring-DZA52jf0.jpg",import.meta.url).href,m2=""+new URL("detail-foot-seam-xGFwv8jl.jpg",import.meta.url).href,g2=""+new URL("detail-neck-band-b-BNWoeBXt.jpg",import.meta.url).href,_2=""+new URL("detail-neck-band-DlPk7Z8p.jpg",import.meta.url).href,M2=""+new URL("detail-rim-lip-B41YkLS9.jpg",import.meta.url).href,y2=""+new URL("detail-waist-b-KjqSyoF5.jpg",import.meta.url).href,v2=""+new URL("detail-waist-DYYQLm4z.jpg",import.meta.url).href,x2=""+new URL("side-left-PE-NSFwu.jpg",import.meta.url).href,b2=""+new URL("side-1R7nNys7.jpg",import.meta.url).href,w2=""+new URL("back-DIPfeyw-.jpg",import.meta.url).href,S2=""+new URL("detail-foot-band-F7itUupf.jpg",import.meta.url).href,E2=""+new URL("detail-handle-end-D4XamGnv.jpg",import.meta.url).href,T2=""+new URL("detail-handle-Bs8HL3tz.jpg",import.meta.url).href,A2=""+new URL("detail-mask-DQCo5yK1.jpg",import.meta.url).href,R2=""+new URL("detail-neck-band-Bl1WAayS.jpg",import.meta.url).href,P2=""+new URL("face-foot-DPuE3lqz.jpg",import.meta.url).href,L2=""+new URL("face-front-DEkYJSMC.jpg",import.meta.url).href,C2=""+new URL("face-mask-0-IQibD7.jpg",import.meta.url).href,k2=""+new URL("face-neck-BGr3XoBL.jpg",import.meta.url).href,D2=""+new URL("front-CalSH-or.jpg",import.meta.url).href,I2=""+new URL("side-b-CMzafB5T.jpg",import.meta.url).href,U2=""+new URL("side-D1RqdUaI.jpg",import.meta.url).href,N2=""+new URL("top-KW9dWpHx.jpg",import.meta.url).href,F2=""+new URL("detail-belly-half-CNSwmJqN.jpg",import.meta.url).href,O2=""+new URL("detail-belly-mask-7xtgS9h0.jpg",import.meta.url).href,z2=""+new URL("detail-belly-seam-BiTeU3Gb.jpg",import.meta.url).href,B2=""+new URL("detail-foot-front-DrMTvYHr.jpg",import.meta.url).href,G2=""+new URL("detail-foot-mask-Cm9IINmD.jpg",import.meta.url).href,H2=""+new URL("detail-foot-seam-D722EZxX.jpg",import.meta.url).href,V2=""+new URL("detail-neck-blades-JThLxAGu.jpg",import.meta.url).href,W2=""+new URL("detail-neck-seam-CIg4wbu4.jpg",import.meta.url).href,j2=""+new URL("detail-shoulder-head-By0YPWRo.jpg",import.meta.url).href,q2=""+new URL("detail-shoulder-seam-DEFSDui9.jpg",import.meta.url).href,X2=""+new URL("detail-waist-CDdJHb7b.jpg",import.meta.url).href,Y2=""+new URL("front-BND45tEH.jpg",import.meta.url).href,$2=""+new URL("three-quarter-B2_zFfuz.jpg",import.meta.url).href,K2=""+new URL("face-belly-Bs5M5JiX.jpg",import.meta.url).href,Z2=""+new URL("face-foot-frieze-Dn2E6-07.jpg",import.meta.url).href,J2=""+new URL("face-lid-broad-Di3RdxE6.jpg",import.meta.url).href,Q2=""+new URL("face-neck-frieze-DXwoalNG.jpg",import.meta.url).href,tS=""+new URL("three-quarter-t_ktZRpa.jpg",import.meta.url).href,eS=""+new URL("detail-eye-ear-U0vMUMGu.jpg",import.meta.url).href,nS=""+new URL("detail-face-C8uAeCPJ.jpg",import.meta.url).href,iS=""+new URL("detail-inscription-CECFPUbu.jpg",import.meta.url).href,sS=""+new URL("detail-mount-C-yj8hkE.jpg",import.meta.url).href,oS=""+new URL("detail-mouth-DAP68-tB.jpg",import.meta.url).href,rS=""+new URL("detail-slots-B5LeizPa.jpg",import.meta.url).href,aS=""+new URL("face-front-B6ywTXS4.jpg",import.meta.url).href,cS=""+new URL("face-mask-DdaC5ulM.jpg",import.meta.url).href,lS=""+new URL("front-CmgWpsti.jpg",import.meta.url).href,hS=""+new URL("three-quarter-DUD1l403.jpg",import.meta.url).href,uS=Object.assign({"../../reference/houmuwu-ding/detail-frieze-bottom-centre.jpg":rw,"../../reference/houmuwu-ding/detail-frieze-top-centre.jpg":aw,"../../reference/houmuwu-ding/detail-handle-front.jpg":cw,"../../reference/houmuwu-ding/detail-handle-roots.jpg":lw,"../../reference/houmuwu-ding/detail-handle.jpg":hw,"../../reference/houmuwu-ding/detail-leg-b.jpg":uw,"../../reference/houmuwu-ding/detail-leg-c.jpg":fw,"../../reference/houmuwu-ding/detail-leg-d.jpg":dw,"../../reference/houmuwu-ding/detail-leg.jpg":pw,"../../reference/houmuwu-ding/detail-short-wall.jpg":mw,"../../reference/houmuwu-ding/faces/face-long-bottom-frieze.jpg":gw,"../../reference/houmuwu-ding/faces/face-long-column.jpg":_w,"../../reference/houmuwu-ding/faces/face-long-top-frieze.jpg":Mw,"../../reference/houmuwu-ding/faces/face-long.jpg":yw,"../../reference/houmuwu-ding/faces/face-rubbing-long.jpg":vw,"../../reference/houmuwu-ding/faces/face-short.jpg":xw,"../../reference/houmuwu-ding/front.jpg":bw,"../../reference/houmuwu-ding/side-low.jpg":ww,"../../reference/houmuwu-ding/side.jpg":Sw,"../../reference/houmuwu-ding/three-quarter-left-low.jpg":Ew,"../../reference/houmuwu-ding/three-quarter-right-b.jpg":Tw,"../../reference/houmuwu-ding/three-quarter-right.jpg":Aw,"../../reference/houmuwu-ding/three-quarter.jpg":Rw,"../../reference/met-fangding/detail-face-short.jpg":Pw,"../../reference/met-fangding/detail-flange-centre.jpg":Lw,"../../reference/met-fangding/detail-flange-corner.jpg":Cw,"../../reference/met-fangding/detail-frieze-long.jpg":kw,"../../reference/met-fangding/detail-handle.jpg":Dw,"../../reference/met-fangding/detail-leg.jpg":Iw,"../../reference/met-fangding/detail-mask-long.jpg":Uw,"../../reference/met-fangding/faces/face-long-frieze.jpg":Nw,"../../reference/met-fangding/faces/face-long-main.jpg":Fw,"../../reference/met-fangding/faces/face-long.jpg":Ow,"../../reference/met-fangding/faces/face-short-main.jpg":zw,"../../reference/met-fangding/faces/face-short.jpg":Bw,"../../reference/met-fangding/front.jpg":Gw,"../../reference/met-fangding/side.jpg":Hw,"../../reference/met-fangding/three-quarter.jpg":Vw,"../../reference/met-fangyi/detail-face-long.jpg":Ww,"../../reference/met-fangyi/detail-face-short.jpg":jw,"../../reference/met-fangyi/detail-flanges.jpg":qw,"../../reference/met-fangyi/detail-foot-long.jpg":Xw,"../../reference/met-fangyi/detail-foot-short.jpg":Yw,"../../reference/met-fangyi/detail-frieze-long.jpg":$w,"../../reference/met-fangyi/detail-frieze-short.jpg":Kw,"../../reference/met-fangyi/detail-knob.jpg":Zw,"../../reference/met-fangyi/detail-lid-end.jpg":Jw,"../../reference/met-fangyi/detail-lid-long.jpg":Qw,"../../reference/met-fangyi/faces/face-end.jpg":t2,"../../reference/met-fangyi/faces/face-lid-end.jpg":e2,"../../reference/met-fangyi/faces/face-lid-long.jpg":n2,"../../reference/met-fangyi/faces/face-long-foot.jpg":i2,"../../reference/met-fangyi/faces/face-long-frieze.jpg":s2,"../../reference/met-fangyi/faces/face-long-main.jpg":o2,"../../reference/met-fangyi/faces/face-long.jpg":r2,"../../reference/met-fangyi/side.jpg":a2,"../../reference/met-fangyi/three-quarter.jpg":c2,"../../reference/met-gu/detail-blade.jpg":l2,"../../reference/met-gu/detail-collar.jpg":h2,"../../reference/met-gu/detail-flange-ladder.jpg":u2,"../../reference/met-gu/detail-foot-front.jpg":f2,"../../reference/met-gu/detail-foot-halfmask.jpg":d2,"../../reference/met-gu/detail-foot-ring.jpg":p2,"../../reference/met-gu/detail-foot-seam.jpg":m2,"../../reference/met-gu/detail-neck-band-b.jpg":g2,"../../reference/met-gu/detail-neck-band.jpg":_2,"../../reference/met-gu/detail-rim-lip.jpg":M2,"../../reference/met-gu/detail-waist-b.jpg":y2,"../../reference/met-gu/detail-waist.jpg":v2,"../../reference/met-gu/side-left.jpg":x2,"../../reference/met-gu/side.jpg":b2,"../../reference/met-gui/back.jpg":w2,"../../reference/met-gui/detail-foot-band.jpg":S2,"../../reference/met-gui/detail-handle-end.jpg":E2,"../../reference/met-gui/detail-handle.jpg":T2,"../../reference/met-gui/detail-mask.jpg":A2,"../../reference/met-gui/detail-neck-band.jpg":R2,"../../reference/met-gui/faces/face-foot.jpg":P2,"../../reference/met-gui/faces/face-front.jpg":L2,"../../reference/met-gui/faces/face-mask.jpg":C2,"../../reference/met-gui/faces/face-neck.jpg":k2,"../../reference/met-gui/front.jpg":D2,"../../reference/met-gui/side-b.jpg":I2,"../../reference/met-gui/side.jpg":U2,"../../reference/met-gui/top.jpg":N2,"../../reference/met-zun/detail-belly-half.jpg":F2,"../../reference/met-zun/detail-belly-mask.jpg":O2,"../../reference/met-zun/detail-belly-seam.jpg":z2,"../../reference/met-zun/detail-foot-front.jpg":B2,"../../reference/met-zun/detail-foot-mask.jpg":G2,"../../reference/met-zun/detail-foot-seam.jpg":H2,"../../reference/met-zun/detail-neck-blades.jpg":V2,"../../reference/met-zun/detail-neck-seam.jpg":W2,"../../reference/met-zun/detail-shoulder-head.jpg":j2,"../../reference/met-zun/detail-shoulder-seam.jpg":q2,"../../reference/met-zun/detail-waist.jpg":X2,"../../reference/met-zun/front.jpg":Y2,"../../reference/met-zun/three-quarter.jpg":$2,"../../reference/nezu-fangyi/faces/face-belly.jpg":K2,"../../reference/nezu-fangyi/faces/face-foot-frieze.jpg":Z2,"../../reference/nezu-fangyi/faces/face-lid-broad.jpg":J2,"../../reference/nezu-fangyi/faces/face-neck-frieze.jpg":Q2,"../../reference/nezu-fangyi/three-quarter.jpg":tS,"../../reference/yachou-yue/detail-eye-ear.jpg":eS,"../../reference/yachou-yue/detail-face.jpg":nS,"../../reference/yachou-yue/detail-inscription.jpg":iS,"../../reference/yachou-yue/detail-mount.jpg":sS,"../../reference/yachou-yue/detail-mouth.jpg":oS,"../../reference/yachou-yue/detail-slots.jpg":rS,"../../reference/yachou-yue/faces/face-front.jpg":aS,"../../reference/yachou-yue/faces/face-mask.jpg":cS,"../../reference/yachou-yue/front.jpg":lS,"../../reference/yachou-yue/three-quarter.jpg":hS}),fS={"houmuwu-ding/detail-frieze-bottom-centre.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-frieze-top-centre.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle-front.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle-roots.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-b.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-c.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-d.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-short-wall.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/faces/face-long-bottom-frieze.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-long-column.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-long-top-frieze.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-long.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-rubbing-long.jpg":"Rubbing, anonymous. Commons cites the Shanghai Museum (shanghaimuseum.net, article CI00159337) as its source. · Public domain (per Commons) · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-short.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/front.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons","houmuwu-ding/side-low.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/side.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-left-low.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-right-b.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-right.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter.jpg":"Mlogic / Wikimedia Commons, CC BY-SA 3.0","met-fangding/detail-face-short.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-flange-centre.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-flange-corner.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-frieze-long.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-handle.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-leg.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-mask-long.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/faces/face-long-frieze.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-long-main.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-long.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-short-main.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-short.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/front.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/side.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangyi/detail-face-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-face-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-flanges.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-foot-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-foot-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-frieze-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-frieze-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-knob.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-lid-end.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-lid-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/faces/face-end.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-lid-end.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-lid-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long-foot.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long-frieze.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long-main.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/side.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-gu/detail-blade.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-collar.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-flange-ladder.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-front.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-halfmask.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-ring.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-seam.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-neck-band-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-neck-band.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-rim-lip.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-waist-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-waist.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/side-left.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/side.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gui/back.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-foot-band.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-handle-end.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-handle.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-mask.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-neck-band.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/faces/face-foot.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/faces/face-front.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/faces/face-mask.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/faces/face-neck.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/front.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/side-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/side.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/top.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-zun/detail-belly-half.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-belly-mask.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-belly-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-front.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-mask.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-neck-blades.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-neck-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-shoulder-head.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-shoulder-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-waist.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/front.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","nezu-fangyi/faces/face-belly.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/faces/face-foot-frieze.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/faces/face-lid-broad.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/faces/face-neck-frieze.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/three-quarter.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project","yachou-yue/detail-eye-ear.jpg":"Gary Todd · CC0 1.0","yachou-yue/detail-face.jpg":"Gary Todd · CC0 1.0","yachou-yue/detail-inscription.jpg":"Gary Todd · CC0 1.0","yachou-yue/detail-mount.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","yachou-yue/detail-mouth.jpg":"Gary Todd · CC0 1.0","yachou-yue/detail-slots.jpg":"Gary Todd · CC0 1.0","yachou-yue/faces/face-front.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","yachou-yue/faces/face-mask.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","yachou-yue/front.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","yachou-yue/three-quarter.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons"},dS=(n,t)=>{const e=uS[`../../reference/${n}/${t}`];return e?()=>Promise.resolve(e):null},pS=(n,t)=>fS[`${n}/${t}`]||"",tc=(n,t)=>/^detail/.test(n)||((t==null?void 0:t.fit)??1)<.6||!!(t!=null&&t.face),ec=n=>n.replace(/^detail-/,"").replace(/^face-/,"flat ").replace(/-/g," ");function mS({chipsEl:n,detailEl:t,detailToggle:e,compareToggle:i,figure:s,onView:o,onLayout:a}){let r=null,c=null,l=!1,h=!1,u=0;const f=s.querySelector("img"),p=s.querySelector("figcaption");function _(M,v){return Nt("button",{type:"button",class:"view"+(v.ref?" has-ref":""),"data-view":M,"aria-pressed":String(M===c),title:v.ref?"Has a reference photograph":null,text:ec(M),onclick:()=>o(M)})}function g(){const M=Object.entries((r==null?void 0:r.views)||{}),v=M.filter(([b,w])=>!tc(b,w)),x=M.filter(([b,w])=>tc(b,w));n.replaceChildren(...v.map(([b,w])=>_(b,w))),t.replaceChildren(...x.map(([b,w])=>_(b,w))),x.some(([b])=>b===c)&&(l=!0),e.hidden=!x.length,e.querySelector(".n").textContent=x.length?String(x.length):"",d(),y()}function d(){t.hidden=!l||!t.childElementCount,e.setAttribute("aria-expanded",String(l&&!t.hidden))}e.addEventListener("click",()=>{l=!l,d(),a()}),i.addEventListener("click",()=>{i.getAttribute("aria-disabled")!=="true"&&(h=!h,y(),a())});function m(){var M,v;return((v=(M=r==null?void 0:r.views)==null?void 0:M[c])==null?void 0:v.ref)||null}function y(){const M=m(),v=M?dS(r.id,M):null;i.setAttribute("aria-disabled",String(!v)),i.setAttribute("aria-pressed",String(h&&!!v)),i.title=v?"Show the reference photograph beside the render":"No reference photograph for this view";const x=h&&!!v;if(s.hidden=!x,document.documentElement.classList.toggle("comparing",x),!x)return;const b=++u;s.classList.add("loading"),p.replaceChildren(Nt("span",{class:"cap",text:"Reference photograph · "+ec(c)}),Nt("span",{class:"credit",text:pS(r.id,M)})),v().then(w=>{b===u&&(f.onload=()=>b===u&&s.classList.remove("loading"),f.onerror=()=>{b===u&&(s.classList.remove("loading"),p.prepend(Nt("span",{class:"fine",text:"The photograph could not be loaded."})))},f.alt=`Reference photograph: ${r.title}, ${ec(c)}`,f.src=w)})}return{setArtifact(M,v){r=M,c=v,l=!1,g()},setView(M){var v;c=M;for(const x of[...n.children,...t.children])x.setAttribute("aria-pressed",String(x.dataset.view===M));tc(M,(v=r==null?void 0:r.views)==null?void 0:v[M])&&!l&&(l=!0,d()),y()},get comparing(){return h&&!s.hidden},setCompare(M){h=!!M,y()}}}const gS=`
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
`;function _S({body:n,stateLabel:t,onChange:e,onMode:i,onView:s}){document.getElementById("patina-drawer-css")||document.head.append(Nt("style",{id:"patina-drawer-css",text:gS}));const o={};let a=null;const r=(T,C)=>(o[T]||(o[T]=[])).push(C),c=ii.age,l=Ru({label:c.label,min:c.min,max:c.max,step:c.step,value:ao().age,cls:"master-ctl",onInput:T=>b({age:T})});r("age",l);const h=Nt("div",{class:"group master"},l.el,Nt("div",{class:"ends"},Nt("span",{text:"out of the mould · 1200 BC"}),Nt("span",{text:"out of the ground · 1939"}))),u=Nt("div",{class:"group"},Nt("span",{class:"cap",text:"Presets"})),f=Object.fromEntries(Object.entries(Md||{}).map(([T,C])=>[T,C.filter(R=>Ls[R])])),p=new Set(Object.values(f).flat()),_=Object.keys(Ls).filter(T=>!p.has(T));_.length&&(f.Looks=[...f.Looks||[],..._]);const g=[];for(const[T,C]of Object.entries(f)){if(!C.length)continue;const R=Za(Nt("div"),C.map(O=>({id:O,label:O.replace(/-/g," ")})),{onPick:O=>S(O)});g.push(R),u.append(Nt("div",{class:"patina-sub"},Nt("span",{class:"cap",text:T}),R.el))}const d=Nt("div",{class:"group"},Nt("span",{class:"cap",text:"View"})),m=Za(Nt("div"),["beauty","clay","height","mask"].map(T=>({id:T})),{value:"beauty",seg:!0,onPick:T=>i(T)}),y=Nt("div",{class:"chips",style:"margin-top:8px"});d.append(m.el,y);const M=(T,C)=>{const R=ao()[T],O=C.type==="color"?Jb({label:C.label,value:R,onInput:A=>b({[T]:A})}):Ru({label:C.label,min:C.min,max:C.max,step:C.step,unit:C.unit,value:R,onInput:A=>b({[T]:A})});return C.hint&&(O.el.title=C.hint),r(T,O),O.el},v=Nt("div",{class:"group"},Nt("span",{class:"cap",text:"Main"})),x={};for(const[T,C]of Object.entries(ii)){if(C.group==="master")continue;if(C.key&&v.append(M(T,C)),!x[C.group]){const O=Nt("span",{class:"n"}),A=Nt("div",{class:"body"});x[C.group]={el:Nt("details",{class:"patina-fold"},Nt("summary",{},Nt("span",{class:"cap",text:C.group}),O),A),n:O,b:A,count:0}}const R=x[C.group];R.b.append(M(T,C)),R.n.textContent=++R.count+""}n.replaceChildren(h,u,d,v,...Object.values(x).map(T=>T.el));function b(T){Nr(T),"age"in T&&Object.keys(T).length===1||L(null);const C=ao();for(const R of Object.keys(T))for(const O of o[R]||[])O.set(C[R]);e==null||e()}function w(){const T=ao();for(const[C,R]of Object.entries(o))for(const O of R)O.set(T[C])}function L(T){a=T;for(const C of g)C.set(T);t.textContent=T?T.replace(/-/g," "):"custom"}function S(T){const C=Ls[T];if(!C)return;const R=Object.fromEntries(Object.entries(ii).map(([O,A])=>[O,A.default]));Nr({...R,...C}),w(),L(T),e==null||e()}return{applyPreset:S,refresh:w,get preset(){return a},setMode:T=>m.set(T),setViews(T,C){if(y.replaceChildren(),!T.length)return;const R=Za(y,T.map(O=>({id:O,label:O.replace(/-/g," ")})),{value:C,onPick:O=>s(O)});this._views=R},setView(T){var C;(C=this._views)==null||C.set(T)}}}function MS(n=window.innerWidth,t=window.innerHeight){return t<=520&&n>t?"land":n<960?"phone":"desk"}function ku(){const n=MS();return document.documentElement.dataset.layout=n,n}const yS=[{q:.5,label:"Light"},{q:1,label:"Standard"},{q:1.5,label:"Fine",desk:!0}],ne=n=>document.getElementById(n);async function vS(){var ut;const n=Yb(),t=document.documentElement;t.dataset.ready="0",n.ui||t.classList.add("ui-off");let e=ku();const i=ne("gl"),s=()=>{ne("fallback").hidden=!1,t.dataset.ready="error"};let o=null;try{o=i.getContext("webgl2")}catch{o=null}if(!o)return s();const a=i.cloneNode();i.replaceWith(a);let r;try{r=new jb(a,{deterministic:!n.ui,pixelRatio:n.dpr})}catch(E){return console.warn(E),s()}a.addEventListener("webglcontextlost",E=>{E.preventDefault(),ne("glmsg").hidden=!1}),a.addEventListener("webglcontextrestored",()=>{r.restoreContext(),ne("glmsg").hidden=!0});const c=r.renderer.capabilities.maxTextureSize||4096;wo.maxSizeCap=Math.min(c,n.compact?2048:8192),bo.anisotropy=Math.min(n.compact?4:8,r.renderer.capabilities.getMaxAnisotropy());const l=Zb(),h=n.a||(n.route&&n.route!=="atlas"?n.route:null),u=h&&l.has(h)?h:null;let f=n.tab,p=null;const _=ne("progress"),g={start(E){_.classList.add("on"),_.querySelector("i").style.width="2%",_.querySelector("span").textContent="casting "+E},set(E,P){_.querySelector("i").style.width=Math.round(Math.max(2,E*100))+"%",P&&(_.querySelector("span").textContent=P)},done(){_.querySelector("i").style.width="100%",_.querySelector("span").textContent="",setTimeout(()=>_.classList.remove("on"),250)}},d=ne("drawer"),m=_S({body:ne("drawer-body"),stateLabel:ne("drawer-preset"),onChange:()=>r.dirty=!0,onMode:E=>x(E),onView:E=>A(E)});n.patina&&Ls[n.patina]&&m.applyPreset(n.patina);const y=ne("drawer-toggle"),M=E=>{d.classList.toggle("open",E),t.classList.toggle("drawer-open",E),y.setAttribute("aria-expanded",String(E)),E&&C(!1),B(330)};{const E=e==="desk"&&window.innerWidth>=1200;d.classList.toggle("open",E),t.classList.toggle("drawer-open",E),y.setAttribute("aria-expanded",String(E))}y.addEventListener("click",()=>M(!d.classList.contains("open")));const v=E=>{console.error(E),t.dataset.ready="error"};function x(E){r.setMode(E),m.setMode(E)}x(n.mode);const b=ne("column"),w=ne("dock"),L=ne("vessel-nav"),S=ne("label"),T=ne("nav-open");function C(E){var P,tt;t.classList.toggle("nav-open",E),T.setAttribute("aria-expanded",String(E)),E&&e!=="desk"&&M(!1),E&&((tt=(P=L.querySelector("[aria-current]"))==null?void 0:P.focus)==null||tt.call(P,{preventScroll:!0}))}T.addEventListener("click",()=>C(!t.classList.contains("nav-open"))),ne("nav-close").addEventListener("click",()=>C(!1)),document.addEventListener("keydown",E=>{E.key==="Escape"&&t.classList.contains("nav-open")&&C(!1)});const R=ow({stage:r,catalog:l,quality:n.q,cacheMax:n.compact?1:2,progress:g,listEl:ne("vessel-list"),labelEl:S,onPick:E=>{C(!1),(f!=="vessels"?$("vessels",{user:!0,want:E}):G(E,{user:!0})).catch(v)},onShown:(E,P)=>{p=P,O.setArtifact(E,P),m.setViews([]),n.patina||m.applyPreset(E.defaultPatina&&Ls[E.defaultPatina]?E.defaultPatina:"excavated-green"),r.setAutoRotate(n.ui)}});R.onLayout=()=>B(0);const O=mS({chipsEl:ne("view-chips"),detailEl:ne("detail-chips"),detailToggle:ne("details-toggle"),compareToggle:ne("compare-toggle"),figure:ne("compare"),onView:E=>A(E),onLayout:()=>{O.comparing&&e==="desk"&&window.innerWidth<1500&&d.classList.contains("open")&&M(!1),ct({refit:!0})}});function A(E){var tt,dt;const P=(tt=R.current)==null?void 0:tt.artifact;(dt=P==null?void 0:P.views)!=null&&dt[E]&&(p=E,R.setView(E),O.setView(E),r.setAutoRotate(!1),ct({refit:!1}))}const D=ne("quality").querySelector(".qseg");function k(){D.replaceChildren(...yS.filter(E=>!E.desk||!n.compact||R.quality===E.q).map(E=>Nt("button",{type:"button","aria-pressed":String(Math.abs(R.quality-E.q)<.001),text:E.label,onclick:()=>I(E.q)})))}async function I(E){var tt;if(Math.abs(E-R.quality)<.001)return;Bd.set(Gd,E),R.setQuality(E),k(),N&&N.setQuality(E);const P=(tt=R.current)==null?void 0:tt.artifact.id;f==="vessels"&&P&&await G(P,{view:p})}k();let N=null,z=null;function q(){return z??(z=Cn(async()=>{const{createAtlas:E}=await import("./atlas-BZnGIO7_.js");return{createAtlas:E}},[],import.meta.url).then(({createAtlas:E})=>(N=E({stage:r,quality:R.quality,progress:g,onBuilt:()=>f==="atlas"&&U(),dom:{picker:ne("motif-picker"),presets:ne("motif-presets"),viewToggle:ne("atlas-view"),params:ne("motif-params"),stats:ne("atlas-stats"),heightmap:ne("heightmap")}}),N))),z}let Z=null,Q=0;async function U(){const E=Q;await r.frame(),E===Q&&!Y&&Z.markReady()}let Y=0;async function G(E,{view:P,user:tt}={}){tt&&J(E);const dt=++Q;Y++;let at;try{at=await R.show(E,{view:P})}finally{Y--}return!at||dt!==Q||(ct({refit:!0}),await U()),at}async function $(E,{user:P,want:tt}={}){var at;f=E,document.body.dataset.tab=E;for(const pt of document.querySelectorAll(".tabs button"))pt.setAttribute("aria-selected",String(pt.dataset.tab===E));P&&J(E==="atlas"?"atlas":tt||((at=R.current)==null?void 0:at.artifact.id)),C(!1),ct({refit:!1}),t.dataset.ready="0";const dt=++Q;if(E==="atlas"){const pt=await q();if(f!=="atlas")return;Y++;try{await pt.activate()}finally{Y--}m.setViews([]),ct({refit:!1}),dt===Q&&await U()}else{N==null||N.deactivate();const pt=R.current;pt&&(!tt||tt===pt.artifact.id)?(r.setContent(pt.result.object,{rig:"vitrine"}),ct({refit:!0}),r.setAutoRotate(n.ui),await U()):await G(tt||await mt())}}for(const E of document.querySelectorAll(".tabs button"))E.addEventListener("click",()=>E.dataset.tab!==f&&$(E.dataset.tab,{user:!0}));function J(E){if(!(!n.ui||!E||Nc()===E))try{history.replaceState(history.state,"","#"+E)}catch{try{location.hash=E}catch{}}}window.addEventListener("hashchange",()=>{var P;const E=Nc();E&&(E==="atlas"?f!=="atlas"&&$("atlas").catch(v):l.has(E)&&(f!=="vessels"?$("vessels",{want:E}).catch(v):R.requested!==E&&((P=R.current)==null?void 0:P.artifact.id)!==E&&G(E).catch(v)))});let it=null;function ot(){const E=d.classList.contains("open");return e==="phone"?E?d.offsetHeight:y.offsetHeight:E?d.offsetWidth:y.offsetWidth||44}function ct({refit:E=!1}={}){const P=window.innerWidth,tt=window.innerHeight,dt=ne("compare");if(!n.ui){r.setInsets({});return}const at=wt=>wt.getBoundingClientRect(),pt=at(ne("masthead"));let gt={left:0,right:0,top:0,bottom:0};if(f==="atlas"){const wt=at(ne("atlas-top")),St=at(ne("atlas-controls"));e==="phone"?gt={top:wt.bottom+6,bottom:Math.max(tt-St.top,ot())+6}:gt={left:St.right+16,right:ot()+8,top:wt.bottom+8,bottom:16}}else e==="phone"?gt={top:pt.bottom+4,bottom:Math.max(tt-at(w).top,ot())+4}:e==="land"?gt={left:at(w).right+12,right:ot()+8,top:8,bottom:8}:gt={left:at(b).right+16,right:ot()+8,top:pt.bottom+6,bottom:tt-at(w).top+6};if(gt={left:0,right:0,top:0,bottom:0,...gt},f==="vessels"&&O.comparing){const wt=P-gt.left-gt.right,St=tt-gt.top-gt.bottom,ft=10;let At;St>wt*1.05?(At={left:gt.left+8,top:gt.top,width:wt-16,height:St*.5-ft},gt.top+=St*.5):(At={left:gt.left,top:gt.top,width:wt*.5-ft,height:St},gt.left+=wt*.5),Object.assign(dt.style,{left:At.left+"px",top:At.top+"px",width:At.width+"px",height:At.height+"px"})}gt={left:0,right:0,top:0,bottom:0,...gt},r.setInsets(gt);const vt={w:P-gt.left-gt.right,h:tt-gt.top-gt.bottom},xt=!it||Math.abs(vt.w/it.w-1)>.15||Math.abs(vt.h/it.h-1)>.15;it=vt,(E||xt)&&K()}function K(){f==="atlas"?N==null||N.frame():R.current&&R.setView(p)}let F=null;function B(E=0){clearTimeout(F),F=setTimeout(()=>requestAnimationFrame(()=>ct()),E)}function W(){e==="desk"?S.parentNode!==b&&b.append(S):S.parentNode!==w&&w.append(S)}W();const et=()=>{const E=e;e=ku(),e!==E&&(W(),C(!1),e==="desk"&&!d.classList.contains("open")&&E!=="desk"&&window.innerWidth>=1200&&M(!0),e!=="desk"&&d.classList.contains("open")&&M(!1),k()),B(60)};window.addEventListener("resize",et),window.addEventListener("orientationchange",()=>setTimeout(et,200)),(ut=window.visualViewport)==null||ut.addEventListener("resize",()=>B(120));const st=()=>f==="atlas"?(N==null?void 0:N.plaque)&&{object:N.plaque.group,id:"atlas"}:R.current&&{object:R.current.result.object,id:R.current.artifact.id};Z=iw({artifacts:l.ids,motifs:Object.keys(Bs),motifPresets:E=>{var P;return Object.keys(((P=Bs[E])==null?void 0:P.presets)||{})},views:async E=>{var P;return Object.keys(((P=await l.load(E))==null?void 0:P.views)||{})},viewRefs:async E=>{var P;return Object.fromEntries(Object.entries(((P=await l.load(E))==null?void 0:P.views)||{}).filter(([,tt])=>tt.ref).map(([tt,dt])=>[tt,dt.ref]))},catalog:()=>l.loadAll().then(E=>E.map(P=>({id:P.id,title:P.title,order:P.order??0}))),metrics:()=>{const E=st();return E?{id:E.id,...tw(E.object),mesh:Hd(E.object),buildMs:R.timings[E.id]}:null},timings:R.timings,kit:zd,stage:r,frame:()=>r.frame(),async show(E,P){f!=="vessels"&&await $("vessels",{want:E}),await G(E,{view:P}),await r.frame()},async setView(E){A(E),await r.frame()},async setMode(E){x(E),await r.frame()},async setPatina(E){typeof E=="string"?m.applyPreset(E):Nr(E),r.dirty=!0,await r.frame()},async showMotif(E,P){f!=="atlas"&&await $("atlas");const tt=await q();Y++;try{await tt.setMotif(E,P)}finally{Y--}await U()},atlasStats:()=>{var E;return(E=N==null?void 0:N.plaque)==null?void 0:E.stats},setCompare:async E=>{O.setCompare(E),ct({refit:!0}),await r.frame()},layout:()=>e});async function mt(){var E;return u||((E=await l.first())==null?void 0:E.id)}u?l.load(u).then(()=>l.loadAll()):l.loadAll(),document.body.dataset.tab=f;for(const E of document.querySelectorAll(".tabs button"))E.setAttribute("aria-selected",String(E.dataset.tab===f));if(ct(),f==="atlas"){const E=await q();Y++;try{(n.motif||n.preset)&&await E.setMotif(n.motif||"taotie",n.preset),await E.activate()}finally{Y--}ct({refit:!0}),await U()}else if(!await G(await mt(),{view:n.view}))throw new Error("no vessel to show")}vS().catch(n=>{console.error(n),document.documentElement.dataset.ready="error"});export{Vs as B,bf as C,yn as G,Bs as M,Se as P,wo as R,X as V,oe as a,Ur as b,Za as c,ko as d,he as e,Nt as f,wS as g,ae as h,po as i,Ix as q,To as r,Ru as s,SS as t,Qb as y};
