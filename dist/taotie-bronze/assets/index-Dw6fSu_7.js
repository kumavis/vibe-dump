var Nd=Object.defineProperty;var Fd=(n,t,e)=>t in n?Nd(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var Lo=(n,t,e)=>Fd(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const Od="modulepreload",zd=function(n,t){return new URL(n,t).href},hc={},Kn=function(t,e,i){let s=Promise.resolve();if(e&&e.length>0){const a=document.getElementsByTagName("link"),r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(e.map(c=>{if(c=zd(c,i),c in hc)return;hc[c]=!0;const h=c.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!i)for(let _=a.length-1;_>=0;_--){const g=a[_];if(g.href===c&&(!h||g.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":Od,h||(d.as="script"),d.crossOrigin="",d.href=c,l&&d.setAttribute("nonce",l),document.head.appendChild(d),h)return new Promise((_,g)=>{d.addEventListener("load",_),d.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(a){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=a,window.dispatchEvent(r),!r.defaultPrevented)throw a}return s.then(a=>{for(const r of a||[])r.status==="rejected"&&o(r.reason);return t().catch(o)})};function Tu(n){let t=n>>>0;return function(){t=t+1831565813>>>0;let i=t;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function nl(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Au(n,t){let e=n>>>0^Math.imul((t>>>0)+2654435769,2246822507);return e^=e>>>16,e=Math.imul(e,2146121005),e^=e>>>15,e=Math.imul(e,2221713035),e^=e>>>16,e>>>0}class Be{constructor(t=1){this.seed=typeof t=="string"?nl(t):t>>>0,this._next=Tu(this.seed)}next(){return this._next()}range(t,e){return t+(e-t)*this._next()}int(t,e){return t+Math.floor((e-t+1)*this._next())}jitter(t){return(this._next()*2-1)*t}gauss(){return this._next()+this._next()+this._next()+this._next()-2}chance(t){return this._next()<t}pick(t){return t[Math.floor(this._next()*t.length)]}fork(t){return new Be(Au(this.seed,typeof t=="string"?nl(t):t>>>0))}}function Bd(n){return n instanceof Be?n:new Be(n)}let Ru=(n,t)=>{if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(n,t);if(typeof document<"u"){const e=document.createElement("canvas");return e.width=n,e.height=t,e}throw new Error("taotie kit: no Canvas2D available — call setCanvasFactory()")};function xr(n,t){return Ru(Math.max(1,n|0),Math.max(1,t|0))}function Gd(n){Ru=n}function il(n){return n.getContext("2d",{willReadFrequently:!0})}const co=1e20;function uc(n,t,e,i,s,o){let a=-1;for(let l=0;l<t;l++){const c=n[l];if(c>=co*.5)continue;if(a<0){a=0,s[0]=l,o[0]=-1/0,o[1]=1/0;continue}let h;for(;;){const u=s[a];if(h=(c+l*l-(n[u]+u*u))/(2*l-2*u),h<=o[a]&&a>0)a--;else break}if(h<=o[a]){s[0]=l,o[0]=-1/0,o[1]=1/0;continue}a++,s[a]=l,o[a]=h,o[a+1]=1/0}if(a<0){for(let l=0;l<t;l++)e[l]=co,i[l]=-1;return}let r=0;for(let l=0;l<t;l++){for(;o[r+1]<l;)r++;const c=s[r];e[l]=(l-c)*(l-c)+n[c],i[l]=c}}function si(n,t,e){const i=Math.max(t,e),s=new Float64Array(i),o=new Float64Array(i),a=new Int32Array(i),r=new Int32Array(i),l=new Float64Array(i+1),c=new Float32Array(t*e),h=new Int32Array(t*e);for(let d=0;d<t;d++){for(let _=0;_<e;_++)s[_]=n[_*t+d]?0:co;uc(s,e,o,a,r,l);for(let _=0;_<e;_++)c[_*t+d]=o[_],h[_*t+d]=a[_]}const u=new Float32Array(t*e),f=new Int32Array(t*e);for(let d=0;d<e;d++){const _=d*t;for(let g=0;g<t;g++)s[g]=c[_+g];uc(s,t,o,a,r,l);for(let g=0;g<t;g++){const p=a[g];p<0||o[g]>=co*.5?(u[_+g]=co,f[_+g]=-1):(u[_+g]=o[g],f[_+g]=h[_+p]*t+p)}}return{dist2:u,nearest:f}}function Hd(n,t,e){return si(n,t,e).dist2}function Vd(n,t,e){if(n===0||t===0)return .5-e;if(n=Math.abs(n),t=Math.abs(t),n<t){const s=n;n=t,t=s}const i=.5*t/n;return e<i?.5*(n+t)-Math.sqrt(2*n*t*e):e<1-i?(.5-e)*n:-.5*(n+t)+Math.sqrt(2*n*t*(1-e))}function Pu(n,t,e){const i=t*e,s=new Uint8Array(i),o=new Float32Array(i),a=new Float32Array(i),r=(f,d)=>f<0||d<0||f>=t||d>=e?0:n[d*t+f],l=Math.SQRT2;let c=!1;for(let f=0;f<e;f++)for(let d=0;d<t;d++){const _=f*t+d,g=n[_],p=g>=.5;let m=g>0&&g<1;if(m||(m=r(d-1,f)>=.5!==p||r(d+1,f)>=.5!==p||r(d,f-1)>=.5!==p||r(d,f+1)>=.5!==p),!m)continue;c=!0,s[_]=1;let v=-r(d-1,f-1)-l*r(d-1,f)-r(d-1,f+1)+r(d+1,f-1)+l*r(d+1,f)+r(d+1,f+1),M=-r(d-1,f-1)-l*r(d,f-1)-r(d+1,f-1)+r(d-1,f+1)+l*r(d,f+1)+r(d+1,f+1);const x=Math.hypot(v,M);x>1e-6?(v/=x,M/=x):(v=0,M=0);const y=x>1e-6?Vd(v,M,g):.5-g;o[_]=d+v*y,a[_]=f+M*y}const h=new Float32Array(i);if(!c){const f=i&&n[0]>=.5?1:-1;return h.fill(f*Math.hypot(t,e)),h}const{nearest:u}=si(s,t,e);for(let f=0;f<e;f++)for(let d=0;d<t;d++){const _=f*t+d,g=u[_],p=Math.hypot(d-o[g],f-a[g]);h[_]=n[_]>=.5?p:-p}return h}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fl="160",Ki={ROTATE:0,DOLLY:1,PAN:2},Zi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Wd=0,fc=1,jd=2,Lu=1,Cu=2,Zn=3,wi=0,Xe=1,kn=2,bi=0,Ss=1,dc=2,pc=3,mc=4,qd=5,Ni=100,Xd=101,Yd=102,gc=103,_c=104,$d=200,Kd=201,Zd=202,Jd=203,sl=204,ol=205,Qd=206,t0=207,e0=208,n0=209,i0=210,s0=211,o0=212,r0=213,a0=214,l0=0,c0=1,h0=2,yr=3,u0=4,f0=5,d0=6,p0=7,Du=0,m0=1,g0=2,ti=0,_0=1,M0=2,v0=3,Iu=4,x0=5,y0=6,ku=300,Cs=301,Ds=302,rl=303,al=304,Gr=306,ll=1e3,_n=1001,cl=1002,Oe=1003,Mc=1004,na=1005,rn=1006,b0=1007,Is=1008,ei=1009,w0=1010,S0=1011,Ol=1012,Uu=1013,Mi=1014,vi=1015,_o=1016,Nu=1017,Fu=1018,Bi=1020,E0=1021,Mn=1023,T0=1024,A0=1025,Gi=1026,ks=1027,R0=1028,Ou=1029,P0=1030,zu=1031,Bu=1033,ia=33776,sa=33777,oa=33778,ra=33779,vc=35840,xc=35841,yc=35842,bc=35843,Gu=36196,wc=37492,Sc=37496,Ec=37808,Tc=37809,Ac=37810,Rc=37811,Pc=37812,Lc=37813,Cc=37814,Dc=37815,Ic=37816,kc=37817,Uc=37818,Nc=37819,Fc=37820,Oc=37821,aa=36492,zc=36494,Bc=36495,L0=36283,Gc=36284,Hc=36285,Vc=36286,Hu=3e3,Hi=3001,C0=3200,D0=3201,Vu=0,I0=1,ln="",Te="srgb",oi="srgb-linear",zl="display-p3",Hr="display-p3-linear",br="linear",le="srgb",wr="rec709",Sr="p3",Ji=7680,Wc=519,k0=512,U0=513,N0=514,Wu=515,F0=516,O0=517,z0=518,B0=519,jc=35044,qc="300 es",hl=1035,Qn=2e3,Er=2001;class Yi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}}const Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dr=Math.PI/180,Tr=180/Math.PI;function Hs(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]+"-"+Ve[t&255]+Ve[t>>8&255]+"-"+Ve[t>>16&15|64]+Ve[t>>24&255]+"-"+Ve[e&63|128]+Ve[e>>8&255]+"-"+Ve[e>>16&255]+Ve[e>>24&255]+Ve[i&255]+Ve[i>>8&255]+Ve[i>>16&255]+Ve[i>>24&255]).toLowerCase()}function ze(n,t,e){return Math.max(t,Math.min(e,n))}function G0(n,t){return(n%t+t)%t}function la(n,t,e){return(1-e)*n+e*t}function Xc(n){return(n&n-1)===0&&n!==0}function ul(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Ks(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Je(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const H0={DEG2RAD:dr};class Lt{constructor(t=0,e=0){Lt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*i-a*s+t.x,this.y=o*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jt{constructor(t,e,i,s,o,a,r,l,c){Jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,l,c)}set(t,e,i,s,o,a,r,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=o,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],d=i[5],_=i[8],g=s[0],p=s[3],m=s[6],v=s[1],M=s[4],x=s[7],y=s[2],w=s[5],b=s[8];return o[0]=a*g+r*v+l*y,o[3]=a*p+r*M+l*w,o[6]=a*m+r*x+l*b,o[1]=c*g+h*v+u*y,o[4]=c*p+h*M+u*w,o[7]=c*m+h*x+u*b,o[2]=f*g+d*v+_*y,o[5]=f*p+d*M+_*w,o[8]=f*m+d*x+_*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*r*c-i*o*h+i*r*l+s*o*c-s*a*l}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=h*a-r*c,f=r*l-h*o,d=c*o-a*l,_=e*u+i*f+s*d;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=u*g,t[1]=(s*c-h*i)*g,t[2]=(r*i-s*a)*g,t[3]=f*g,t[4]=(h*e-s*l)*g,t[5]=(s*o-r*e)*g,t[6]=d*g,t[7]=(i*l-c*e)*g,t[8]=(a*e-i*o)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,o,a,r){const l=Math.cos(o),c=Math.sin(o);return this.set(i*l,i*c,-i*(l*a+c*r)+a+t,-s*c,s*l,-s*(-c*a+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(ca.makeScale(t,e)),this}rotate(t){return this.premultiply(ca.makeRotation(-t)),this}translate(t,e){return this.premultiply(ca.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ca=new Jt;function ju(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Ar(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function V0(){const n=Ar("canvas");return n.style.display="block",n}const Yc={};function ho(n){n in Yc||(Yc[n]=!0,console.warn(n))}const $c=new Jt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Kc=new Jt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Co={[oi]:{transfer:br,primaries:wr,toReference:n=>n,fromReference:n=>n},[Te]:{transfer:le,primaries:wr,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Hr]:{transfer:br,primaries:Sr,toReference:n=>n.applyMatrix3(Kc),fromReference:n=>n.applyMatrix3($c)},[zl]:{transfer:le,primaries:Sr,toReference:n=>n.convertSRGBToLinear().applyMatrix3(Kc),fromReference:n=>n.applyMatrix3($c).convertLinearToSRGB()}},W0=new Set([oi,Hr]),ie={enabled:!0,_workingColorSpace:oi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!W0.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=Co[t].toReference,s=Co[e].fromReference;return s(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return Co[n].primaries},getTransfer:function(n){return n===ln?br:Co[n].transfer}};function Es(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ha(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Qi;class qu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Qi===void 0&&(Qi=Ar("canvas")),Qi.width=t.width,Qi.height=t.height;const i=Qi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ar("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=Es(o[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Es(e[i]/255)*255):e[i]=Es(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let j0=0;class Xu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:j0++}),this.uuid=Hs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(ua(s[a].image)):o.push(ua(s[a]))}else o=ua(s);i.url=o}return e||(t.images[this.uuid]=i),i}}function ua(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?qu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let q0=0;class $e extends Yi{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,i=_n,s=_n,o=rn,a=Is,r=Mn,l=ei,c=$e.DEFAULT_ANISOTROPY,h=ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:q0++}),this.uuid=Hs(),this.name="",this.source=new Xu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ho("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Hi?Te:ln),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ku)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ll:t.x=t.x-Math.floor(t.x);break;case _n:t.x=t.x<0?0:1;break;case cl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ll:t.y=t.y-Math.floor(t.y);break;case _n:t.y=t.y<0?0:1;break;case cl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ho("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Te?Hi:Hu}set encoding(t){ho("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Hi?Te:ln}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=ku;$e.DEFAULT_ANISOTROPY=1;class Ie{constructor(t=0,e=0,i=0,s=1){Ie.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*o,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*o,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*o,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,o;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],_=l[9],g=l[2],p=l[6],m=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-g)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+g)<.1&&Math.abs(_+p)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,x=(d+1)/2,y=(m+1)/2,w=(h+f)/4,b=(u+g)/4,D=(_+p)/4;return M>x&&M>y?M<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(M),s=w/i,o=b/i):x>y?x<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(x),i=w/s,o=D/s):y<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(y),i=b/o,s=D/o),this.set(i,s,o,e),this}let v=Math.sqrt((p-_)*(p-_)+(u-g)*(u-g)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(p-_)/v,this.y=(u-g)/v,this.z=(f-h)/v,this.w=Math.acos((c+d+m-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class X0 extends Yi{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ie(0,0,t,e),this.scissorTest=!1,this.viewport=new Ie(0,0,t,e);const s={width:t,height:e,depth:1};i.encoding!==void 0&&(ho("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Hi?Te:ln),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new $e(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(t,e,i=1){(this.width!==t||this.height!==e||this.depth!==i)&&(this.width=t,this.height=e,this.depth=i,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Xu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wi extends X0{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Yu extends $e{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Y0 extends $e{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=_n,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ji{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,o,a,r){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3];const f=o[a+0],d=o[a+1],_=o[a+2],g=o[a+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=f,t[e+1]=d,t[e+2]=_,t[e+3]=g;return}if(u!==g||l!==f||c!==d||h!==_){let p=1-r;const m=l*f+c*d+h*_+u*g,v=m>=0?1:-1,M=1-m*m;if(M>Number.EPSILON){const y=Math.sqrt(M),w=Math.atan2(y,m*v);p=Math.sin(p*w)/y,r=Math.sin(r*w)/y}const x=r*v;if(l=l*p+f*x,c=c*p+d*x,h=h*p+_*x,u=u*p+g*x,p===1-r){const y=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=y,c*=y,h*=y,u*=y}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,o,a){const r=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=o[a],f=o[a+1],d=o[a+2],_=o[a+3];return t[e]=r*_+h*u+l*d-c*f,t[e+1]=l*_+h*f+c*u-r*d,t[e+2]=c*_+h*d+r*f-l*u,t[e+3]=h*_-r*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,o=t._z,a=t._order,r=Math.cos,l=Math.sin,c=r(i/2),h=r(s/2),u=r(o/2),f=l(i/2),d=l(s/2),_=l(o/2);switch(a){case"XYZ":this._x=f*h*u+c*d*_,this._y=c*d*u-f*h*_,this._z=c*h*_+f*d*u,this._w=c*h*u-f*d*_;break;case"YXZ":this._x=f*h*u+c*d*_,this._y=c*d*u-f*h*_,this._z=c*h*_-f*d*u,this._w=c*h*u+f*d*_;break;case"ZXY":this._x=f*h*u-c*d*_,this._y=c*d*u+f*h*_,this._z=c*h*_+f*d*u,this._w=c*h*u-f*d*_;break;case"ZYX":this._x=f*h*u-c*d*_,this._y=c*d*u+f*h*_,this._z=c*h*_-f*d*u,this._w=c*h*u+f*d*_;break;case"YZX":this._x=f*h*u+c*d*_,this._y=c*d*u+f*h*_,this._z=c*h*_-f*d*u,this._w=c*h*u-f*d*_;break;case"XZY":this._x=f*h*u-c*d*_,this._y=c*d*u-f*h*_,this._z=c*h*_+f*d*u,this._w=c*h*u+f*d*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],o=e[8],a=e[1],r=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=i+r+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(o-c)*d,this._z=(a-s)*d}else if(i>r&&i>u){const d=2*Math.sqrt(1+i-r-u);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(o+c)/d}else if(r>u){const d=2*Math.sqrt(1+r-i-u);this._w=(o-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-i-r);this._w=(a-s)/d,this._x=(o+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ze(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,o=t._z,a=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*r+s*c-o*l,this._y=s*h+a*l+o*r-i*c,this._z=o*h+a*c+i*l-s*r,this._w=a*h-i*r-s*l-o*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,o=this._z,a=this._w;let r=a*t._w+i*t._x+s*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=s,this._z=o,this;const l=1-r*r;if(l<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*i+e*this._x,this._y=d*s+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=Math.random(),e=Math.sqrt(1-t),i=Math.sqrt(t),s=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(s),i*Math.sin(o),i*Math.cos(o),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(t=0,e=0,i=0){q.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6]*s,this.y=o[1]*e+o[4]*i+o[7]*s,this.z=o[2]*e+o[5]*i+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=t.elements,a=1/(o[3]*e+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*i+o[8]*s+o[12])*a,this.y=(o[1]*e+o[5]*i+o[9]*s+o[13])*a,this.z=(o[2]*e+o[6]*i+o[10]*s+o[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,o=t.x,a=t.y,r=t.z,l=t.w,c=2*(a*s-r*i),h=2*(r*e-o*s),u=2*(o*i-a*e);return this.x=e+l*c+a*u-r*h,this.y=i+l*h+r*c-o*u,this.z=s+l*u+o*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s,this.y=o[1]*e+o[5]*i+o[9]*s,this.z=o[2]*e+o[6]*i+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,o=t.z,a=e.x,r=e.y,l=e.z;return this.x=s*l-o*r,this.y=o*a-i*l,this.z=i*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return fa.copy(this).projectOnVector(t),this.sub(fa)}reflect(t){return this.sub(fa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ze(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,i=Math.sqrt(1-t**2);return this.x=i*Math.cos(e),this.y=i*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fa=new q,Zc=new ji;class An{constructor(t=new q(1/0,1/0,1/0),e=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(wn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(wn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=wn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const o=i.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,wn):wn.fromBufferAttribute(o,a),wn.applyMatrix4(t.matrixWorld),this.expandByPoint(wn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Do.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Do.copy(i.boundingBox)),Do.applyMatrix4(t.matrixWorld),this.union(Do)}const s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,wn),wn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Zs),Io.subVectors(this.max,Zs),ts.subVectors(t.a,Zs),es.subVectors(t.b,Zs),ns.subVectors(t.c,Zs),ci.subVectors(es,ts),hi.subVectors(ns,es),Ri.subVectors(ts,ns);let e=[0,-ci.z,ci.y,0,-hi.z,hi.y,0,-Ri.z,Ri.y,ci.z,0,-ci.x,hi.z,0,-hi.x,Ri.z,0,-Ri.x,-ci.y,ci.x,0,-hi.y,hi.x,0,-Ri.y,Ri.x,0];return!da(e,ts,es,ns,Io)||(e=[1,0,0,0,1,0,0,0,1],!da(e,ts,es,ns,Io))?!1:(ko.crossVectors(ci,hi),e=[ko.x,ko.y,ko.z],da(e,ts,es,ns,Io))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,wn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(wn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Wn=[new q,new q,new q,new q,new q,new q,new q,new q],wn=new q,Do=new An,ts=new q,es=new q,ns=new q,ci=new q,hi=new q,Ri=new q,Zs=new q,Io=new q,ko=new q,Pi=new q;function da(n,t,e,i,s){for(let o=0,a=n.length-3;o<=a;o+=3){Pi.fromArray(n,o);const r=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),l=t.dot(Pi),c=e.dot(Pi),h=i.dot(Pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const $0=new An,Js=new q,pa=new q;class Bl{constructor(t=new q,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):$0.setFromPoints(t).getCenter(i);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Js.subVectors(t,this.center);const e=Js.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(Js,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Js.copy(t.center).add(pa)),this.expandByPoint(Js.copy(t.center).sub(pa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const jn=new q,ma=new q,Uo=new q,ui=new q,ga=new q,No=new q,_a=new q;class $u{constructor(t=new q,e=new q(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,jn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=jn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(jn.copy(this.origin).addScaledVector(this.direction,e),jn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ma.copy(t).add(e).multiplyScalar(.5),Uo.copy(e).sub(t).normalize(),ui.copy(this.origin).sub(ma);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Uo),r=ui.dot(this.direction),l=-ui.dot(Uo),c=ui.lengthSq(),h=Math.abs(1-a*a);let u,f,d,_;if(h>0)if(u=a*l-r,f=a*r-l,_=o*h,u>=0)if(f>=-_)if(f<=_){const g=1/h;u*=g,f*=g,d=u*(u+a*f+2*r)+f*(a*u+f+2*l)+c}else f=o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*l)+c;else f=-o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*l)+c;else f<=-_?(u=Math.max(0,-(-a*o+r)),f=u>0?-o:Math.min(Math.max(-o,-l),o),d=-u*u+f*(f+2*l)+c):f<=_?(u=0,f=Math.min(Math.max(-o,-l),o),d=f*(f+2*l)+c):(u=Math.max(0,-(a*o+r)),f=u>0?o:Math.min(Math.max(-o,-l),o),d=-u*u+f*(f+2*l)+c);else f=a>0?-o:o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ma).addScaledVector(Uo,f),d}intersectSphere(t,e){jn.subVectors(t.center,this.origin);const i=jn.dot(this.direction),s=jn.dot(jn)-i*i,o=t.radius*t.radius;if(s>o)return null;const a=Math.sqrt(o-s),r=i-a,l=i+a;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,o,a,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(t.min.x-f.x)*c,s=(t.max.x-f.x)*c):(i=(t.max.x-f.x)*c,s=(t.min.x-f.x)*c),h>=0?(o=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),i>a||o>s||((o>i||isNaN(i))&&(i=o),(a<s||isNaN(s))&&(s=a),u>=0?(r=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(r=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),i>l||r>s)||((r>i||i!==i)&&(i=r),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,jn)!==null}intersectTriangle(t,e,i,s,o){ga.subVectors(e,t),No.subVectors(i,t),_a.crossVectors(ga,No);let a=this.direction.dot(_a),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;ui.subVectors(this.origin,t);const l=r*this.direction.dot(No.crossVectors(ui,No));if(l<0)return null;const c=r*this.direction.dot(ga.cross(ui));if(c<0||l+c>a)return null;const h=-r*ui.dot(_a);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,i,s,o,a,r,l,c,h,u,f,d,_,g,p){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,l,c,h,u,f,d,_,g,p)}set(t,e,i,s,o,a,r,l,c,h,u,f,d,_,g,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=i,m[12]=s,m[1]=o,m[5]=a,m[9]=r,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=_,m[11]=g,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/is.setFromMatrixColumn(t,0).length(),o=1/is.setFromMatrixColumn(t,1).length(),a=1/is.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*o,e[5]=i[5]*o,e[6]=i[6]*o,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,o=t.z,a=Math.cos(i),r=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=a*h,d=a*u,_=r*h,g=r*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+_*c,e[5]=f-g*c,e[9]=-r*l,e[2]=g-f*c,e[6]=_+d*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,_=c*h,g=c*u;e[0]=f+g*r,e[4]=_*r-d,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=d*r-_,e[6]=g+f*r,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,_=c*h,g=c*u;e[0]=f-g*r,e[4]=-a*u,e[8]=_+d*r,e[1]=d+_*r,e[5]=a*h,e[9]=g-f*r,e[2]=-a*c,e[6]=r,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,d=a*u,_=r*h,g=r*u;e[0]=l*h,e[4]=_*c-d,e[8]=f*c+g,e[1]=l*u,e[5]=g*c+f,e[9]=d*c-_,e[2]=-c,e[6]=r*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,d=a*c,_=r*l,g=r*c;e[0]=l*h,e[4]=g-f*u,e[8]=_*u+d,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-c*h,e[6]=d*u+_,e[10]=f-g*u}else if(t.order==="XZY"){const f=a*l,d=a*c,_=r*l,g=r*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+g,e[5]=a*h,e[9]=d*u-_,e[2]=_*u-d,e[6]=r*h,e[10]=g*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(K0,t,Z0)}lookAt(t,e,i){const s=this.elements;return sn.subVectors(t,e),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),fi.crossVectors(i,sn),fi.lengthSq()===0&&(Math.abs(i.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),fi.crossVectors(i,sn)),fi.normalize(),Fo.crossVectors(sn,fi),s[0]=fi.x,s[4]=Fo.x,s[8]=sn.x,s[1]=fi.y,s[5]=Fo.y,s[9]=sn.y,s[2]=fi.z,s[6]=Fo.z,s[10]=sn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],d=i[13],_=i[2],g=i[6],p=i[10],m=i[14],v=i[3],M=i[7],x=i[11],y=i[15],w=s[0],b=s[4],D=s[8],E=s[12],T=s[1],L=s[5],R=s[9],O=s[13],A=s[2],I=s[6],C=s[10],k=s[14],N=s[3],F=s[7],V=s[11],K=s[15];return o[0]=a*w+r*T+l*A+c*N,o[4]=a*b+r*L+l*I+c*F,o[8]=a*D+r*R+l*C+c*V,o[12]=a*E+r*O+l*k+c*K,o[1]=h*w+u*T+f*A+d*N,o[5]=h*b+u*L+f*I+d*F,o[9]=h*D+u*R+f*C+d*V,o[13]=h*E+u*O+f*k+d*K,o[2]=_*w+g*T+p*A+m*N,o[6]=_*b+g*L+p*I+m*F,o[10]=_*D+g*R+p*C+m*V,o[14]=_*E+g*O+p*k+m*K,o[3]=v*w+M*T+x*A+y*N,o[7]=v*b+M*L+x*I+y*F,o[11]=v*D+M*R+x*C+y*V,o[15]=v*E+M*O+x*k+y*K,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],o=t[12],a=t[1],r=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],_=t[3],g=t[7],p=t[11],m=t[15];return _*(+o*l*u-s*c*u-o*r*f+i*c*f+s*r*d-i*l*d)+g*(+e*l*d-e*c*f+o*a*f-s*a*d+s*c*h-o*l*h)+p*(+e*c*u-e*r*d-o*a*u+i*a*d+o*r*h-i*c*h)+m*(-s*r*h-e*l*u+e*r*f+s*a*u-i*a*f+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],_=t[12],g=t[13],p=t[14],m=t[15],v=u*p*c-g*f*c+g*l*d-r*p*d-u*l*m+r*f*m,M=_*f*c-h*p*c-_*l*d+a*p*d+h*l*m-a*f*m,x=h*g*c-_*u*c+_*r*d-a*g*d-h*r*m+a*u*m,y=_*u*l-h*g*l-_*r*f+a*g*f+h*r*p-a*u*p,w=e*v+i*M+s*x+o*y;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/w;return t[0]=v*b,t[1]=(g*f*o-u*p*o-g*s*d+i*p*d+u*s*m-i*f*m)*b,t[2]=(r*p*o-g*l*o+g*s*c-i*p*c-r*s*m+i*l*m)*b,t[3]=(u*l*o-r*f*o-u*s*c+i*f*c+r*s*d-i*l*d)*b,t[4]=M*b,t[5]=(h*p*o-_*f*o+_*s*d-e*p*d-h*s*m+e*f*m)*b,t[6]=(_*l*o-a*p*o-_*s*c+e*p*c+a*s*m-e*l*m)*b,t[7]=(a*f*o-h*l*o+h*s*c-e*f*c-a*s*d+e*l*d)*b,t[8]=x*b,t[9]=(_*u*o-h*g*o-_*i*d+e*g*d+h*i*m-e*u*m)*b,t[10]=(a*g*o-_*r*o+_*i*c-e*g*c-a*i*m+e*r*m)*b,t[11]=(h*r*o-a*u*o-h*i*c+e*u*c+a*i*d-e*r*d)*b,t[12]=y*b,t[13]=(h*g*s-_*u*s+_*i*f-e*g*f-h*i*p+e*u*p)*b,t[14]=(_*r*s-a*g*s-_*i*l+e*g*l+a*i*p-e*r*p)*b,t[15]=(a*u*s-h*r*s+h*i*l-e*u*l-a*i*f+e*r*f)*b,this}scale(t){const e=this.elements,i=t.x,s=t.y,o=t.z;return e[0]*=i,e[4]*=s,e[8]*=o,e[1]*=i,e[5]*=s,e[9]*=o,e[2]*=i,e[6]*=s,e[10]*=o,e[3]*=i,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),o=1-i,a=t.x,r=t.y,l=t.z,c=o*a,h=o*r;return this.set(c*a+i,c*r-s*l,c*l+s*r,0,c*r+s*l,h*r+i,h*l-s*a,0,c*l-s*r,h*l+s*a,o*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,o,a){return this.set(1,i,o,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,o=e._x,a=e._y,r=e._z,l=e._w,c=o+o,h=a+a,u=r+r,f=o*c,d=o*h,_=o*u,g=a*h,p=a*u,m=r*u,v=l*c,M=l*h,x=l*u,y=i.x,w=i.y,b=i.z;return s[0]=(1-(g+m))*y,s[1]=(d+x)*y,s[2]=(_-M)*y,s[3]=0,s[4]=(d-x)*w,s[5]=(1-(f+m))*w,s[6]=(p+v)*w,s[7]=0,s[8]=(_+M)*b,s[9]=(p-v)*b,s[10]=(1-(f+g))*b,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let o=is.set(s[0],s[1],s[2]).length();const a=is.set(s[4],s[5],s[6]).length(),r=is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],Sn.copy(this);const c=1/o,h=1/a,u=1/r;return Sn.elements[0]*=c,Sn.elements[1]*=c,Sn.elements[2]*=c,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,e.setFromRotationMatrix(Sn),i.x=o,i.y=a,i.z=r,this}makePerspective(t,e,i,s,o,a,r=Qn){const l=this.elements,c=2*o/(e-t),h=2*o/(i-s),u=(e+t)/(e-t),f=(i+s)/(i-s);let d,_;if(r===Qn)d=-(a+o)/(a-o),_=-2*a*o/(a-o);else if(r===Er)d=-a/(a-o),_=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,o,a,r=Qn){const l=this.elements,c=1/(e-t),h=1/(i-s),u=1/(a-o),f=(e+t)*c,d=(i+s)*h;let _,g;if(r===Qn)_=(a+o)*u,g=-2*u;else if(r===Er)_=o*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=g,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const is=new q,Sn=new ae,K0=new q(0,0,0),Z0=new q(1,1,1),fi=new q,Fo=new q,sn=new q,Jc=new ae,Qc=new ji;class Vr{constructor(t=0,e=0,i=0,s=Vr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,o=s[0],a=s[4],r=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(ze(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,d));break;case"XZY":this._z=Math.asin(-ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Jc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Qc.setFromEuler(this),this.setFromQuaternion(Qc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vr.DEFAULT_ORDER="XYZ";class Ku{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let J0=0;const th=new q,ss=new ji,qn=new ae,Oo=new q,Qs=new q,Q0=new q,tp=new ji,eh=new q(1,0,0),nh=new q(0,1,0),ih=new q(0,0,1),ep={type:"added"},np={type:"removed"};class Re extends Yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:J0++}),this.uuid=Hs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Re.DEFAULT_UP.clone();const t=new q,e=new Vr,i=new ji,s=new q(1,1,1);function o(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Jt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=Re.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ku,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.multiply(ss),this}rotateOnWorldAxis(t,e){return ss.setFromAxisAngle(t,e),this.quaternion.premultiply(ss),this}rotateX(t){return this.rotateOnAxis(eh,t)}rotateY(t){return this.rotateOnAxis(nh,t)}rotateZ(t){return this.rotateOnAxis(ih,t)}translateOnAxis(t,e){return th.copy(t).applyQuaternion(this.quaternion),this.position.add(th.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(eh,t)}translateY(t){return this.translateOnAxis(nh,t)}translateZ(t){return this.translateOnAxis(ih,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(qn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Oo.copy(t):Oo.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Qs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qn.lookAt(Qs,Oo,this.up):qn.lookAt(Oo,Qs,this.up),this.quaternion.setFromRotationMatrix(qn),s&&(qn.extractRotation(s.matrixWorld),ss.setFromRotationMatrix(qn),this.quaternion.premultiply(ss.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(ep)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(np)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),qn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),qn.multiply(t.parent.matrixWorld)),t.applyMatrix4(qn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,t,Q0),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qs,tp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++){const o=e[i];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++){const r=s[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];o(t.shapes,u)}else o(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(o(t.materials,this.material[l]));s.material=r}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];s.animations.push(o(t.animations,l))}}if(e){const r=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),_=a(t.nodes);r.length>0&&(i.geometries=r),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),d.length>0&&(i.animations=d),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}Re.DEFAULT_UP=new q(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const En=new q,Xn=new q,Ma=new q,Yn=new q,os=new q,rs=new q,sh=new q,va=new q,xa=new q,ya=new q;let zo=!1;class Tn{constructor(t=new q,e=new q,i=new q){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),En.subVectors(t,e),s.cross(En);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,i,s,o){En.subVectors(s,e),Xn.subVectors(i,e),Ma.subVectors(t,e);const a=En.dot(En),r=En.dot(Xn),l=En.dot(Ma),c=Xn.dot(Xn),h=Xn.dot(Ma),u=a*c-r*r;if(u===0)return o.set(0,0,0),null;const f=1/u,d=(c*l-r*h)*f,_=(a*h-r*l)*f;return o.set(1-d-_,_,d)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getUV(t,e,i,s,o,a,r,l){return zo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),zo=!0),this.getInterpolation(t,e,i,s,o,a,r,l)}static getInterpolation(t,e,i,s,o,a,r,l){return this.getBarycoord(t,e,i,s,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,Yn.x),l.addScaledVector(a,Yn.y),l.addScaledVector(r,Yn.z),l)}static isFrontFacing(t,e,i,s){return En.subVectors(i,e),Xn.subVectors(t,e),En.cross(Xn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return En.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),En.cross(Xn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Tn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Tn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,i,s,o){return zo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),zo=!0),Tn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}getInterpolation(t,e,i,s,o){return Tn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}containsPoint(t){return Tn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Tn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,o=this.c;let a,r;os.subVectors(s,i),rs.subVectors(o,i),va.subVectors(t,i);const l=os.dot(va),c=rs.dot(va);if(l<=0&&c<=0)return e.copy(i);xa.subVectors(t,s);const h=os.dot(xa),u=rs.dot(xa);if(h>=0&&u<=h)return e.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(os,a);ya.subVectors(t,o);const d=os.dot(ya),_=rs.dot(ya);if(_>=0&&d<=_)return e.copy(o);const g=d*c-l*_;if(g<=0&&c>=0&&_<=0)return r=c/(c-_),e.copy(i).addScaledVector(rs,r);const p=h*_-d*u;if(p<=0&&u-h>=0&&d-_>=0)return sh.subVectors(o,s),r=(u-h)/(u-h+(d-_)),e.copy(s).addScaledVector(sh,r);const m=1/(p+g+f);return a=g*m,r=f*m,e.copy(i).addScaledVector(os,a).addScaledVector(rs,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Zu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},Bo={h:0,s:0,l:0};function ba(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class qt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Te){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.toWorkingColorSpace(this,e),this}setRGB(t,e,i,s=ie.workingColorSpace){return this.r=t,this.g=e,this.b=i,ie.toWorkingColorSpace(this,s),this}setHSL(t,e,i,s=ie.workingColorSpace){if(t=G0(t,1),e=ze(e,0,1),i=ze(i,0,1),e===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+e):i+e-i*e,a=2*i-o;this.r=ba(a,o,t+1/3),this.g=ba(a,o,t),this.b=ba(a,o,t-1/3)}return ie.toWorkingColorSpace(this,s),this}setStyle(t,e=Te){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Te){const i=Zu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Es(t.r),this.g=Es(t.g),this.b=Es(t.b),this}copyLinearToSRGB(t){return this.r=ha(t.r),this.g=ha(t.g),this.b=ha(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Te){return ie.fromWorkingColorSpace(We.copy(this),t),Math.round(ze(We.r*255,0,255))*65536+Math.round(ze(We.g*255,0,255))*256+Math.round(ze(We.b*255,0,255))}getHexString(t=Te){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.fromWorkingColorSpace(We.copy(this),e);const i=We.r,s=We.g,o=We.b,a=Math.max(i,s,o),r=Math.min(i,s,o);let l,c;const h=(r+a)/2;if(r===a)l=0,c=0;else{const u=a-r;switch(c=h<=.5?u/(a+r):u/(2-a-r),a){case i:l=(s-o)/u+(s<o?6:0);break;case s:l=(o-i)/u+2;break;case o:l=(i-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.fromWorkingColorSpace(We.copy(this),e),t.r=We.r,t.g=We.g,t.b=We.b,t}getStyle(t=Te){ie.fromWorkingColorSpace(We.copy(this),t);const e=We.r,i=We.g,s=We.b;return t!==Te?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(di),this.setHSL(di.h+t,di.s+e,di.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(di),t.getHSL(Bo);const i=la(di.h,Bo.h,e),s=la(di.s,Bo.s,e),o=la(di.l,Bo.l,e);return this.setHSL(i,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*i+o[6]*s,this.g=o[1]*e+o[4]*i+o[7]*s,this.b=o[2]*e+o[5]*i+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const We=new qt;qt.NAMES=Zu;let ip=0;class Ro extends Yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=Hs(),this.name="",this.type="Material",this.blending=Ss,this.side=wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sl,this.blendDst=ol,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ss&&(i.blending=this.blending),this.side!==wi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sl&&(i.blendSrc=this.blendSrc),this.blendDst!==ol&&(i.blendDst=this.blendDst),this.blendEquation!==Ni&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==yr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const a=[];for(const r in o){const l=o[r];delete l.metadata,a.push(l)}return a}if(e){const o=s(t.textures),a=s(t.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=e[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Fi extends Ro{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Du,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Se=new q,Go=new Lt;class Ae{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=jc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Go.fromBufferAttribute(this,e),Go.applyMatrix3(t),this.setXY(e,Go.x,Go.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Ks(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Je(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ks(e,this.array)),e}setX(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ks(e,this.array)),e}setY(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ks(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ks(e,this.array)),e}setW(t,e){return this.normalized&&(e=Je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array),s=Je(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,o){return t*=this.itemSize,this.normalized&&(e=Je(e,this.array),i=Je(i,this.array),s=Je(s,this.array),o=Je(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==jc&&(t.usage=this.usage),t}}class Wr extends Ae{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class jr extends Ae{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class xe extends Ae{constructor(t,e,i){super(new Float32Array(t),e,i)}}let sp=0;const gn=new ae,wa=new Re,as=new q,on=new An,to=new An,De=new q;class Ze extends Yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sp++}),this.uuid=Hs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ju(t)?jr:Wr)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Jt().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return gn.makeRotationFromQuaternion(t),this.applyMatrix4(gn),this}rotateX(t){return gn.makeRotationX(t),this.applyMatrix4(gn),this}rotateY(t){return gn.makeRotationY(t),this.applyMatrix4(gn),this}rotateZ(t){return gn.makeRotationZ(t),this.applyMatrix4(gn),this}translate(t,e,i){return gn.makeTranslation(t,e,i),this.applyMatrix4(gn),this}scale(t,e,i){return gn.makeScale(t,e,i),this.applyMatrix4(gn),this}lookAt(t){return wa.lookAt(t),wa.updateMatrix(),this.applyMatrix4(wa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(t){const e=[];for(let i=0,s=t.length;i<s;i++){const o=t[i];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new xe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const o=e[i];on.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,on.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,on.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(on.min),this.boundingBox.expandByPoint(on.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bl);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new q,1/0);return}if(t){const i=this.boundingSphere.center;if(on.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];to.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(on.min,to.min),on.expandByPoint(De),De.addVectors(on.max,to.max),on.expandByPoint(De)):(on.expandByPoint(to.min),on.expandByPoint(to.max))}on.getCenter(i);let s=0;for(let o=0,a=t.count;o<a;o++)De.fromBufferAttribute(t,o),s=Math.max(s,i.distanceToSquared(De));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)De.fromBufferAttribute(r,c),l&&(as.fromBufferAttribute(t,c),De.add(as)),s=Math.max(s,i.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.array,s=e.position.array,o=e.normal.array,a=e.uv.array,r=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ae(new Float32Array(4*r),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<r;T++)c[T]=new q,h[T]=new q;const u=new q,f=new q,d=new q,_=new Lt,g=new Lt,p=new Lt,m=new q,v=new q;function M(T,L,R){u.fromArray(s,T*3),f.fromArray(s,L*3),d.fromArray(s,R*3),_.fromArray(a,T*2),g.fromArray(a,L*2),p.fromArray(a,R*2),f.sub(u),d.sub(u),g.sub(_),p.sub(_);const O=1/(g.x*p.y-p.x*g.y);isFinite(O)&&(m.copy(f).multiplyScalar(p.y).addScaledVector(d,-g.y).multiplyScalar(O),v.copy(d).multiplyScalar(g.x).addScaledVector(f,-p.x).multiplyScalar(O),c[T].add(m),c[L].add(m),c[R].add(m),h[T].add(v),h[L].add(v),h[R].add(v))}let x=this.groups;x.length===0&&(x=[{start:0,count:i.length}]);for(let T=0,L=x.length;T<L;++T){const R=x[T],O=R.start,A=R.count;for(let I=O,C=O+A;I<C;I+=3)M(i[I+0],i[I+1],i[I+2])}const y=new q,w=new q,b=new q,D=new q;function E(T){b.fromArray(o,T*3),D.copy(b);const L=c[T];y.copy(L),y.sub(b.multiplyScalar(b.dot(L))).normalize(),w.crossVectors(D,L);const O=w.dot(h[T])<0?-1:1;l[T*4]=y.x,l[T*4+1]=y.y,l[T*4+2]=y.z,l[T*4+3]=O}for(let T=0,L=x.length;T<L;++T){const R=x[T],O=R.start,A=R.count;for(let I=O,C=O+A;I<C;I+=3)E(i[I+0]),E(i[I+1]),E(i[I+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ae(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let f=0,d=i.count;f<d;f++)i.setXYZ(f,0,0,0);const s=new q,o=new q,a=new q,r=new q,l=new q,c=new q,h=new q,u=new q;if(t)for(let f=0,d=t.count;f<d;f+=3){const _=t.getX(f+0),g=t.getX(f+1),p=t.getX(f+2);s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,g),a.fromBufferAttribute(e,p),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),r.fromBufferAttribute(i,_),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,p),r.add(h),l.add(h),c.add(h),i.setXYZ(_,r.x,r.y,r.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)s.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,u=r.normalized,f=new c.constructor(l.length*h);let d=0,_=0;for(let g=0,p=l.length;g<p;g++){r.isInterleavedBufferAttribute?d=l[g]*r.data.stride+r.offset:d=l[g]*h;for(let m=0;m<h;m++)f[_++]=c[d++]}return new Ae(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ze,i=this.index.array,s=this.attributes;for(const r in s){const l=s[r],c=t(l,i);e.setAttribute(r,c)}const o=this.morphAttributes;for(const r in o){const l=[],c=o[r];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,i);l.push(d)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,l=a.length;r<l;r++){const c=a[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const o=t.morphAttributes;for(const c in o){const h=[],u=o[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const oh=new ae,Li=new $u,Ho=new Bl,rh=new q,ls=new q,cs=new q,hs=new q,Sa=new q,Vo=new q,Wo=new Lt,jo=new Lt,qo=new Lt,ah=new q,lh=new q,ch=new q,Xo=new q,Yo=new q;class ue extends Re{constructor(t=new Ze,e=new Fi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(o&&r){Vo.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=r[l],u=o[l];h!==0&&(Sa.fromBufferAttribute(u,t),a?Vo.addScaledVector(Sa,h):Vo.addScaledVector(Sa.sub(e),h))}e.add(Vo)}return e}raycast(t,e){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ho.copy(i.boundingSphere),Ho.applyMatrix4(o),Li.copy(t.ray).recast(t.near),!(Ho.containsPoint(Li.origin)===!1&&(Li.intersectSphere(Ho,rh)===null||Li.origin.distanceToSquared(rh)>(t.far-t.near)**2))&&(oh.copy(o).invert(),Li.copy(t.ray).applyMatrix4(oh),!(i.boundingBox!==null&&Li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Li)))}_computeIntersections(t,e,i){let s;const o=this.geometry,a=this.material,r=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,d=o.drawRange;if(r!==null)if(Array.isArray(a))for(let _=0,g=f.length;_<g;_++){const p=f[_],m=a[p.materialIndex],v=Math.max(p.start,d.start),M=Math.min(r.count,Math.min(p.start+p.count,d.start+d.count));for(let x=v,y=M;x<y;x+=3){const w=r.getX(x),b=r.getX(x+1),D=r.getX(x+2);s=$o(this,m,t,i,c,h,u,w,b,D),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const _=Math.max(0,d.start),g=Math.min(r.count,d.start+d.count);for(let p=_,m=g;p<m;p+=3){const v=r.getX(p),M=r.getX(p+1),x=r.getX(p+2);s=$o(this,a,t,i,c,h,u,v,M,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,g=f.length;_<g;_++){const p=f[_],m=a[p.materialIndex],v=Math.max(p.start,d.start),M=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let x=v,y=M;x<y;x+=3){const w=x,b=x+1,D=x+2;s=$o(this,m,t,i,c,h,u,w,b,D),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{const _=Math.max(0,d.start),g=Math.min(l.count,d.start+d.count);for(let p=_,m=g;p<m;p+=3){const v=p,M=p+1,x=p+2;s=$o(this,a,t,i,c,h,u,v,M,x),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}}function op(n,t,e,i,s,o,a,r){let l;if(t.side===Xe?l=i.intersectTriangle(a,o,s,!0,r):l=i.intersectTriangle(s,o,a,t.side===wi,r),l===null)return null;Yo.copy(r),Yo.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Yo);return c<e.near||c>e.far?null:{distance:c,point:Yo.clone(),object:n}}function $o(n,t,e,i,s,o,a,r,l,c){n.getVertexPosition(r,ls),n.getVertexPosition(l,cs),n.getVertexPosition(c,hs);const h=op(n,t,e,i,ls,cs,hs,Xo);if(h){s&&(Wo.fromBufferAttribute(s,r),jo.fromBufferAttribute(s,l),qo.fromBufferAttribute(s,c),h.uv=Tn.getInterpolation(Xo,ls,cs,hs,Wo,jo,qo,new Lt)),o&&(Wo.fromBufferAttribute(o,r),jo.fromBufferAttribute(o,l),qo.fromBufferAttribute(o,c),h.uv1=Tn.getInterpolation(Xo,ls,cs,hs,Wo,jo,qo,new Lt),h.uv2=h.uv1),a&&(ah.fromBufferAttribute(a,r),lh.fromBufferAttribute(a,l),ch.fromBufferAttribute(a,c),h.normal=Tn.getInterpolation(Xo,ls,cs,hs,ah,lh,ch,new q),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:l,c,normal:new q,materialIndex:0};Tn.getNormal(ls,cs,hs,u.normal),h.face=u}return h}class Vs extends Ze{constructor(t=1,e=1,i=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:o,depthSegments:a};const r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;_("z","y","x",-1,-1,i,e,t,a,o,0),_("z","y","x",1,-1,i,e,-t,a,o,1),_("x","z","y",1,1,t,i,e,s,a,2),_("x","z","y",1,-1,t,i,-e,s,a,3),_("x","y","z",1,-1,t,e,i,s,o,4),_("x","y","z",-1,-1,t,e,-i,s,o,5),this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(h,3)),this.setAttribute("uv",new xe(u,2));function _(g,p,m,v,M,x,y,w,b,D,E){const T=x/b,L=y/D,R=x/2,O=y/2,A=w/2,I=b+1,C=D+1;let k=0,N=0;const F=new q;for(let V=0;V<C;V++){const K=V*L-O;for(let Z=0;Z<I;Z++){const U=Z*T-R;F[g]=U*v,F[p]=K*M,F[m]=A,c.push(F.x,F.y,F.z),F[g]=0,F[p]=0,F[m]=w>0?1:-1,h.push(F.x,F.y,F.z),u.push(Z/b),u.push(1-V/D),k+=1}}for(let V=0;V<D;V++)for(let K=0;K<b;K++){const Z=f+K+I*V,U=f+K+I*(V+1),X=f+(K+1)+I*(V+1),z=f+(K+1)+I*V;l.push(Z,U,z),l.push(U,X,z),N+=6}r.addGroup(d,N,E),d+=N,f+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Us(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ye(n){const t={};for(let e=0;e<n.length;e++){const i=Us(n[e]);for(const s in i)t[s]=i[s]}return t}function rp(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Ju(n){return n.getRenderTarget()===null?n.outputColorSpace:ie.workingColorSpace}const ap={clone:Us,merge:Ye};var lp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qi extends Ro{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lp,this.fragmentShader=cp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Us(t.uniforms),this.uniformsGroups=rp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Qu extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class an extends Qu{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Tr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(dr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Tr*2*Math.atan(Math.tan(dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,i,s,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(dr*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;o+=a.offsetX*s/l,e-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const us=-90,fs=1;class hp extends Re{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(us,fs,t,e);s.layers=this.layers,this.add(s);const o=new an(us,fs,t,e);o.layers=this.layers,this.add(o);const a=new an(us,fs,t,e);a.layers=this.layers,this.add(a);const r=new an(us,fs,t,e);r.layers=this.layers,this.add(r);const l=new an(us,fs,t,e);l.layers=this.layers,this.add(l);const c=new an(us,fs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,o,a,r,l]=e;for(const c of e)this.remove(c);if(t===Qn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Er)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,o),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,l),t.setRenderTarget(i,4,s),t.render(e,c),i.texture.generateMipmaps=g,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class tf extends $e{constructor(t,e,i,s,o,a,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Cs,super(t,e,i,s,o,a,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class up extends Wi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];e.encoding!==void 0&&(ho("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Hi?Te:ln),this.texture=new tf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Vs(5,5,5),o=new qi({name:"CubemapFromEquirect",uniforms:Us(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Xe,blending:bi});o.uniforms.tEquirect.value=e;const a=new ue(s,o),r=e.minFilter;return e.minFilter===Is&&(e.minFilter=rn),new hp(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,s){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(o)}}const Ea=new q,fp=new q,dp=new Jt;class _i{constructor(t=new q(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=Ea.subVectors(i,e).cross(fp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Ea),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||dp.getNormalMatrix(t),s=this.coplanarPoint(Ea).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ci=new Bl,Ko=new q;class Gl{constructor(t=new _i,e=new _i,i=new _i,s=new _i,o=new _i,a=new _i){this.planes=[t,e,i,s,o,a]}set(t,e,i,s,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Qn){const i=this.planes,s=t.elements,o=s[0],a=s[1],r=s[2],l=s[3],c=s[4],h=s[5],u=s[6],f=s[7],d=s[8],_=s[9],g=s[10],p=s[11],m=s[12],v=s[13],M=s[14],x=s[15];if(i[0].setComponents(l-o,f-c,p-d,x-m).normalize(),i[1].setComponents(l+o,f+c,p+d,x+m).normalize(),i[2].setComponents(l+a,f+h,p+_,x+v).normalize(),i[3].setComponents(l-a,f-h,p-_,x-v).normalize(),i[4].setComponents(l-r,f-u,p-g,x-M).normalize(),e===Qn)i[5].setComponents(l+r,f+u,p+g,x+M).normalize();else if(e===Er)i[5].setComponents(r,u,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(t){return Ci.center.set(0,0,0),Ci.radius=.7071067811865476,Ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(Ko.x=s.normal.x>0?t.max.x:t.min.x,Ko.y=s.normal.y>0?t.max.y:t.min.y,Ko.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ko)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ef(){let n=null,t=!1,e=null,i=null;function s(o,a){e(o,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){n=o}}}function pp(n,t){const e=t.isWebGL2,i=new WeakMap;function s(c,h){const u=c.array,f=c.usage,d=u.byteLength,_=n.createBuffer();n.bindBuffer(h,_),n.bufferData(h,u,f),c.onUploadCallback();let g;if(u instanceof Float32Array)g=n.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)g=n.SHORT;else if(u instanceof Uint32Array)g=n.UNSIGNED_INT;else if(u instanceof Int32Array)g=n.INT;else if(u instanceof Int8Array)g=n.BYTE;else if(u instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:_,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:d}}function o(c,h,u){const f=h.array,d=h._updateRange,_=h.updateRanges;if(n.bindBuffer(u,c),d.count===-1&&_.length===0&&n.bufferSubData(u,0,f),_.length!==0){for(let g=0,p=_.length;g<p;g++){const m=_[g];e?n.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f,m.start,m.count):n.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f.subarray(m.start,m.start+m.count))}h.clearUpdateRanges()}d.count!==-1&&(e?n.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):n.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h&&(n.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=i.get(c);(!f||f.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);if(u===void 0)i.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,c,h),u.version=c.version}}return{get:a,remove:r,update:l}}class Ts extends Ze{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const o=t/2,a=e/2,r=Math.floor(i),l=Math.floor(s),c=r+1,h=l+1,u=t/r,f=e/l,d=[],_=[],g=[],p=[];for(let m=0;m<h;m++){const v=m*f-a;for(let M=0;M<c;M++){const x=M*u-o;_.push(x,-v,0),g.push(0,0,1),p.push(M/r),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let v=0;v<r;v++){const M=v+c*m,x=v+c*(m+1),y=v+1+c*(m+1),w=v+1+c*m;d.push(M,x,w),d.push(x,y,w)}this.setIndex(d),this.setAttribute("position",new xe(_,3)),this.setAttribute("normal",new xe(g,3)),this.setAttribute("uv",new xe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ts(t.width,t.height,t.widthSegments,t.heightSegments)}}var mp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gp=`#ifdef USE_ALPHAHASH
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
#endif`,_p=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vp=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,xp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yp=`#ifdef USE_AOMAP
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
#endif`,bp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wp=`#ifdef USE_BATCHING
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
#endif`,Sp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ep=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ap=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Rp=`#ifdef USE_IRIDESCENCE
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
#endif`,Pp=`#ifdef USE_BUMPMAP
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
#endif`,Lp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Up=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Np=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Fp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Op=`#define PI 3.141592653589793
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
} // validated`,zp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Bp=`vec3 transformedNormal = objectNormal;
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
#endif`,Gp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jp="gl_FragColor = linearToOutputTexel( gl_FragColor );",qp=`
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
}`,Xp=`#ifdef USE_ENVMAP
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
#endif`,Yp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,$p=`#ifdef USE_ENVMAP
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
#endif`,Kp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Zp=`#ifdef USE_ENVMAP
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
#endif`,Jp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,em=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,nm=`#ifdef USE_GRADIENTMAP
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
}`,im=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,sm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,om=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,rm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,am=`uniform bool receiveShadow;
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
#endif`,lm=`#ifdef USE_ENVMAP
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
#endif`,cm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,um=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dm=`PhysicalMaterial material;
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
#endif`,pm=`struct PhysicalMaterial {
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
}`,mm=`
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
#endif`,gm=`#if defined( RE_IndirectDiffuse )
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
#endif`,_m=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,vm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,ym=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,bm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Sm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Em=`#if defined( USE_POINTS_UV )
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
#endif`,Tm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Am=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Pm=`#ifdef USE_MORPHNORMALS
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
#endif`,Lm=`#ifdef USE_MORPHTARGETS
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
#endif`,Cm=`#ifdef USE_MORPHTARGETS
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
#endif`,Dm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Im=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,km=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Um=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Fm=`#ifdef USE_NORMALMAP
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
#endif`,Om=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,zm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Gm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Hm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Wm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ym=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$m=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Km=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Jm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Qm=`float getShadowMask() {
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
}`,tg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,eg=`#ifdef USE_SKINNING
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
#endif`,ng=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ig=`#ifdef USE_SKINNING
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
#endif`,sg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,og=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ag=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,lg=`#ifdef USE_TRANSMISSION
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
#endif`,cg=`#ifdef USE_TRANSMISSION
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
#endif`,hg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mg=`uniform sampler2D t2D;
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_g=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`#include <common>
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
}`,yg=`#if DEPTH_PACKING == 3200
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
}`,bg=`#define DISTANCE
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
}`,wg=`#define DISTANCE
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
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Eg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tg=`uniform float scale;
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
}`,Ag=`uniform vec3 diffuse;
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
}`,Rg=`#include <common>
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
}`,Pg=`uniform vec3 diffuse;
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
}`,Lg=`#define LAMBERT
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
}`,Cg=`#define LAMBERT
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
}`,Dg=`#define MATCAP
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
}`,Ig=`#define MATCAP
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
}`,kg=`#define NORMAL
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
}`,Ug=`#define NORMAL
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
}`,Ng=`#define PHONG
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
}`,Fg=`#define PHONG
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
}`,Og=`#define STANDARD
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
}`,zg=`#define STANDARD
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
}`,Bg=`#define TOON
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
}`,Gg=`#define TOON
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
}`,Hg=`uniform float size;
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
}`,Vg=`uniform vec3 diffuse;
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
}`,Wg=`#include <common>
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
}`,jg=`uniform vec3 color;
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
}`,qg=`uniform float rotation;
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
}`,Xg=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:mp,alphahash_pars_fragment:gp,alphamap_fragment:_p,alphamap_pars_fragment:Mp,alphatest_fragment:vp,alphatest_pars_fragment:xp,aomap_fragment:yp,aomap_pars_fragment:bp,batching_pars_vertex:wp,batching_vertex:Sp,begin_vertex:Ep,beginnormal_vertex:Tp,bsdfs:Ap,iridescence_fragment:Rp,bumpmap_pars_fragment:Pp,clipping_planes_fragment:Lp,clipping_planes_pars_fragment:Cp,clipping_planes_pars_vertex:Dp,clipping_planes_vertex:Ip,color_fragment:kp,color_pars_fragment:Up,color_pars_vertex:Np,color_vertex:Fp,common:Op,cube_uv_reflection_fragment:zp,defaultnormal_vertex:Bp,displacementmap_pars_vertex:Gp,displacementmap_vertex:Hp,emissivemap_fragment:Vp,emissivemap_pars_fragment:Wp,colorspace_fragment:jp,colorspace_pars_fragment:qp,envmap_fragment:Xp,envmap_common_pars_fragment:Yp,envmap_pars_fragment:$p,envmap_pars_vertex:Kp,envmap_physical_pars_fragment:lm,envmap_vertex:Zp,fog_vertex:Jp,fog_pars_vertex:Qp,fog_fragment:tm,fog_pars_fragment:em,gradientmap_pars_fragment:nm,lightmap_fragment:im,lightmap_pars_fragment:sm,lights_lambert_fragment:om,lights_lambert_pars_fragment:rm,lights_pars_begin:am,lights_toon_fragment:cm,lights_toon_pars_fragment:hm,lights_phong_fragment:um,lights_phong_pars_fragment:fm,lights_physical_fragment:dm,lights_physical_pars_fragment:pm,lights_fragment_begin:mm,lights_fragment_maps:gm,lights_fragment_end:_m,logdepthbuf_fragment:Mm,logdepthbuf_pars_fragment:vm,logdepthbuf_pars_vertex:xm,logdepthbuf_vertex:ym,map_fragment:bm,map_pars_fragment:wm,map_particle_fragment:Sm,map_particle_pars_fragment:Em,metalnessmap_fragment:Tm,metalnessmap_pars_fragment:Am,morphcolor_vertex:Rm,morphnormal_vertex:Pm,morphtarget_pars_vertex:Lm,morphtarget_vertex:Cm,normal_fragment_begin:Dm,normal_fragment_maps:Im,normal_pars_fragment:km,normal_pars_vertex:Um,normal_vertex:Nm,normalmap_pars_fragment:Fm,clearcoat_normal_fragment_begin:Om,clearcoat_normal_fragment_maps:zm,clearcoat_pars_fragment:Bm,iridescence_pars_fragment:Gm,opaque_fragment:Hm,packing:Vm,premultiplied_alpha_fragment:Wm,project_vertex:jm,dithering_fragment:qm,dithering_pars_fragment:Xm,roughnessmap_fragment:Ym,roughnessmap_pars_fragment:$m,shadowmap_pars_fragment:Km,shadowmap_pars_vertex:Zm,shadowmap_vertex:Jm,shadowmask_pars_fragment:Qm,skinbase_vertex:tg,skinning_pars_vertex:eg,skinning_vertex:ng,skinnormal_vertex:ig,specularmap_fragment:sg,specularmap_pars_fragment:og,tonemapping_fragment:rg,tonemapping_pars_fragment:ag,transmission_fragment:lg,transmission_pars_fragment:cg,uv_pars_fragment:hg,uv_pars_vertex:ug,uv_vertex:fg,worldpos_vertex:dg,background_vert:pg,background_frag:mg,backgroundCube_vert:gg,backgroundCube_frag:_g,cube_vert:Mg,cube_frag:vg,depth_vert:xg,depth_frag:yg,distanceRGBA_vert:bg,distanceRGBA_frag:wg,equirect_vert:Sg,equirect_frag:Eg,linedashed_vert:Tg,linedashed_frag:Ag,meshbasic_vert:Rg,meshbasic_frag:Pg,meshlambert_vert:Lg,meshlambert_frag:Cg,meshmatcap_vert:Dg,meshmatcap_frag:Ig,meshnormal_vert:kg,meshnormal_frag:Ug,meshphong_vert:Ng,meshphong_frag:Fg,meshphysical_vert:Og,meshphysical_frag:zg,meshtoon_vert:Bg,meshtoon_frag:Gg,points_vert:Hg,points_frag:Vg,shadow_vert:Wg,shadow_frag:jg,sprite_vert:qg,sprite_frag:Xg},It={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Jt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Jt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0},uvTransform:{value:new Jt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Jt},alphaMap:{value:null},alphaMapTransform:{value:new Jt},alphaTest:{value:0}}},Dn={basic:{uniforms:Ye([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Ye([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new qt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Ye([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Ye([It.common,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.roughnessmap,It.metalnessmap,It.fog,It.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Ye([It.common,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.gradientmap,It.fog,It.lights,{emissive:{value:new qt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Ye([It.common,It.bumpmap,It.normalmap,It.displacementmap,It.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Ye([It.points,It.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Ye([It.common,It.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Ye([It.common,It.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Ye([It.common,It.bumpmap,It.normalmap,It.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Ye([It.sprite,It.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Ye([It.common,It.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Ye([It.lights,It.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Dn.physical={uniforms:Ye([Dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Jt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Jt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Jt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Jt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Jt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Jt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Jt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const Zo={r:0,b:0,g:0};function Yg(n,t,e,i,s,o,a){const r=new qt(0);let l=o===!0?0:1,c,h,u=null,f=0,d=null;function _(p,m){let v=!1,M=m.isScene===!0?m.background:null;M&&M.isTexture&&(M=(m.backgroundBlurriness>0?e:t).get(M)),M===null?g(r,l):M&&M.isColor&&(g(M,1),v=!0);const x=n.xr.getEnvironmentBlendMode();x==="additive"?i.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Gr)?(h===void 0&&(h=new ue(new Vs(1,1,1),new qi({name:"BackgroundCubeMaterial",uniforms:Us(Dn.backgroundCube.uniforms),vertexShader:Dn.backgroundCube.vertexShader,fragmentShader:Dn.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,w,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,h.material.toneMapped=ie.getTransfer(M.colorSpace)!==le,(u!==M||f!==M.version||d!==n.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,d=n.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new ue(new Ts(2,2),new qi({name:"BackgroundMaterial",uniforms:Us(Dn.background.uniforms),vertexShader:Dn.background.vertexShader,fragmentShader:Dn.background.fragmentShader,side:wi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,c.material.toneMapped=ie.getTransfer(M.colorSpace)!==le,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,u=M,f=M.version,d=n.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function g(p,m){p.getRGB(Zo,Ju(n)),i.buffers.color.setClear(Zo.r,Zo.g,Zo.b,m,a)}return{getClearColor:function(){return r},setClearColor:function(p,m=1){r.set(p),l=m,g(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,g(r,l)},render:_}}function $g(n,t,e,i){const s=n.getParameter(n.MAX_VERTEX_ATTRIBS),o=i.isWebGL2?null:t.get("OES_vertex_array_object"),a=i.isWebGL2||o!==null,r={},l=p(null);let c=l,h=!1;function u(A,I,C,k,N){let F=!1;if(a){const V=g(k,C,I);c!==V&&(c=V,d(c.object)),F=m(A,k,C,N),F&&v(A,k,C,N)}else{const V=I.wireframe===!0;(c.geometry!==k.id||c.program!==C.id||c.wireframe!==V)&&(c.geometry=k.id,c.program=C.id,c.wireframe=V,F=!0)}N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(F||h)&&(h=!1,D(A,I,C,k),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function f(){return i.isWebGL2?n.createVertexArray():o.createVertexArrayOES()}function d(A){return i.isWebGL2?n.bindVertexArray(A):o.bindVertexArrayOES(A)}function _(A){return i.isWebGL2?n.deleteVertexArray(A):o.deleteVertexArrayOES(A)}function g(A,I,C){const k=C.wireframe===!0;let N=r[A.id];N===void 0&&(N={},r[A.id]=N);let F=N[I.id];F===void 0&&(F={},N[I.id]=F);let V=F[k];return V===void 0&&(V=p(f()),F[k]=V),V}function p(A){const I=[],C=[],k=[];for(let N=0;N<s;N++)I[N]=0,C[N]=0,k[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:C,attributeDivisors:k,object:A,attributes:{},index:null}}function m(A,I,C,k){const N=c.attributes,F=I.attributes;let V=0;const K=C.getAttributes();for(const Z in K)if(K[Z].location>=0){const X=N[Z];let z=F[Z];if(z===void 0&&(Z==="instanceMatrix"&&A.instanceMatrix&&(z=A.instanceMatrix),Z==="instanceColor"&&A.instanceColor&&(z=A.instanceColor)),X===void 0||X.attribute!==z||z&&X.data!==z.data)return!0;V++}return c.attributesNum!==V||c.index!==k}function v(A,I,C,k){const N={},F=I.attributes;let V=0;const K=C.getAttributes();for(const Z in K)if(K[Z].location>=0){let X=F[Z];X===void 0&&(Z==="instanceMatrix"&&A.instanceMatrix&&(X=A.instanceMatrix),Z==="instanceColor"&&A.instanceColor&&(X=A.instanceColor));const z={};z.attribute=X,X&&X.data&&(z.data=X.data),N[Z]=z,V++}c.attributes=N,c.attributesNum=V,c.index=k}function M(){const A=c.newAttributes;for(let I=0,C=A.length;I<C;I++)A[I]=0}function x(A){y(A,0)}function y(A,I){const C=c.newAttributes,k=c.enabledAttributes,N=c.attributeDivisors;C[A]=1,k[A]===0&&(n.enableVertexAttribArray(A),k[A]=1),N[A]!==I&&((i.isWebGL2?n:t.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](A,I),N[A]=I)}function w(){const A=c.newAttributes,I=c.enabledAttributes;for(let C=0,k=I.length;C<k;C++)I[C]!==A[C]&&(n.disableVertexAttribArray(C),I[C]=0)}function b(A,I,C,k,N,F,V){V===!0?n.vertexAttribIPointer(A,I,C,N,F):n.vertexAttribPointer(A,I,C,k,N,F)}function D(A,I,C,k){if(i.isWebGL2===!1&&(A.isInstancedMesh||k.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const N=k.attributes,F=C.getAttributes(),V=I.defaultAttributeValues;for(const K in F){const Z=F[K];if(Z.location>=0){let U=N[K];if(U===void 0&&(K==="instanceMatrix"&&A.instanceMatrix&&(U=A.instanceMatrix),K==="instanceColor"&&A.instanceColor&&(U=A.instanceColor)),U!==void 0){const X=U.normalized,z=U.itemSize,Y=e.get(U);if(Y===void 0)continue;const J=Y.buffer,et=Y.type,it=Y.bytesPerElement,at=i.isWebGL2===!0&&(et===n.INT||et===n.UNSIGNED_INT||U.gpuType===Uu);if(U.isInterleavedBufferAttribute){const _t=U.data,W=_t.stride,j=U.offset;if(_t.isInstancedInterleavedBuffer){for(let $=0;$<Z.locationSize;$++)y(Z.location+$,_t.meshPerAttribute);A.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let $=0;$<Z.locationSize;$++)x(Z.location+$);n.bindBuffer(n.ARRAY_BUFFER,J);for(let $=0;$<Z.locationSize;$++)b(Z.location+$,z/Z.locationSize,et,X,W*it,(j+z/Z.locationSize*$)*it,at)}else{if(U.isInstancedBufferAttribute){for(let _t=0;_t<Z.locationSize;_t++)y(Z.location+_t,U.meshPerAttribute);A.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=U.meshPerAttribute*U.count)}else for(let _t=0;_t<Z.locationSize;_t++)x(Z.location+_t);n.bindBuffer(n.ARRAY_BUFFER,J);for(let _t=0;_t<Z.locationSize;_t++)b(Z.location+_t,z/Z.locationSize,et,X,z*it,z/Z.locationSize*_t*it,at)}}else if(V!==void 0){const X=V[K];if(X!==void 0)switch(X.length){case 2:n.vertexAttrib2fv(Z.location,X);break;case 3:n.vertexAttrib3fv(Z.location,X);break;case 4:n.vertexAttrib4fv(Z.location,X);break;default:n.vertexAttrib1fv(Z.location,X)}}}}w()}function E(){R();for(const A in r){const I=r[A];for(const C in I){const k=I[C];for(const N in k)_(k[N].object),delete k[N];delete I[C]}delete r[A]}}function T(A){if(r[A.id]===void 0)return;const I=r[A.id];for(const C in I){const k=I[C];for(const N in k)_(k[N].object),delete k[N];delete I[C]}delete r[A.id]}function L(A){for(const I in r){const C=r[I];if(C[A.id]===void 0)continue;const k=C[A.id];for(const N in k)_(k[N].object),delete k[N];delete C[A.id]}}function R(){O(),h=!0,c!==l&&(c=l,d(c.object))}function O(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:R,resetDefaultState:O,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:L,initAttributes:M,enableAttribute:x,disableUnusedAttributes:w}}function Kg(n,t,e,i){const s=i.isWebGL2;let o;function a(h){o=h}function r(h,u){n.drawArrays(o,h,u),e.update(u,o,1)}function l(h,u,f){if(f===0)return;let d,_;if(s)d=n,_="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[_](o,h,u,f),e.update(u,o,f)}function c(h,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let _=0;_<f;_++)this.render(h[_],u[_]);else{d.multiDrawArraysWEBGL(o,h,0,u,0,f);let _=0;for(let g=0;g<f;g++)_+=u[g];e.update(_,o,1)}}this.setMode=a,this.render=r,this.renderInstances=l,this.renderMultiDraw=c}function Zg(n,t,e){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");i=n.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(b){if(b==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const l=o(r);l!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",l,"instead."),r=l);const c=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_TEXTURE_SIZE),_=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),g=n.getParameter(n.MAX_VERTEX_ATTRIBS),p=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),m=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,x=a||t.has("OES_texture_float"),y=M&&x,w=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:_,maxAttributes:g,maxVertexUniforms:p,maxVaryings:m,maxFragmentUniforms:v,vertexTextures:M,floatFragmentTextures:x,floatVertexTextures:y,maxSamples:w}}function Jg(n){const t=this;let e=null,i=0,s=!1,o=!1;const a=new _i,r=new Jt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||i!==0||s;return s=f,i=u.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const _=u.clippingPlanes,g=u.clipIntersection,p=u.clipShadows,m=n.get(u);if(!s||_===null||_.length===0||o&&!p)o?h(null):c();else{const v=o?0:i,M=v*4;let x=m.clippingState||null;l.value=x,x=h(_,f,M,d);for(let y=0;y!==M;++y)x[y]=e[y];m.clippingState=x,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,f,d,_){const g=u!==null?u.length:0;let p=null;if(g!==0){if(p=l.value,_!==!0||p===null){const m=d+g*4,v=f.matrixWorldInverse;r.getNormalMatrix(v),(p===null||p.length<m)&&(p=new Float32Array(m));for(let M=0,x=d;M!==g;++M,x+=4)a.copy(u[M]).applyMatrix4(v,r),a.normal.toArray(p,x),p[x+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function Qg(n){let t=new WeakMap;function e(a,r){return r===rl?a.mapping=Cs:r===al&&(a.mapping=Ds),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===rl||r===al)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new up(l.height/2);return c.fromEquirectangularTexture(n,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}class nf extends Qu{constructor(t=-1,e=1,i=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-t,a=i+t,r=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,a=o+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const vs=4,hh=[.125,.215,.35,.446,.526,.582],Oi=20,Ta=new nf,uh=new qt;let Aa=null,Ra=0,Pa=0;const Ui=(1+Math.sqrt(5))/2,ds=1/Ui,fh=[new q(1,1,1),new q(-1,1,1),new q(1,1,-1),new q(-1,1,-1),new q(0,Ui,ds),new q(0,Ui,-ds),new q(ds,0,Ui),new q(-ds,0,Ui),new q(Ui,ds,0),new q(-Ui,ds,0)];class fl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100){Aa=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,i,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ph(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Aa,Ra,Pa),t.scissorTest=!1,Jo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Cs||t.mapping===Ds?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Aa=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel();const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:_o,format:Mn,colorSpace:oi,depthBuffer:!1},s=dh(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dh(t,e,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=t1(o)),this._blurMaterial=e1(o,t,e)}return s}_compileMaterial(t){const e=new ue(this._lodPlanes[0],t);this._renderer.compile(e,Ta)}_sceneToCubeUV(t,e,i,s){const r=new an(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(uh),h.toneMapping=ti,h.autoClear=!1;const d=new Fi({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),_=new ue(new Vs,d);let g=!1;const p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,g=!0):(d.color.copy(uh),g=!0);for(let m=0;m<6;m++){const v=m%3;v===0?(r.up.set(0,l[m],0),r.lookAt(c[m],0,0)):v===1?(r.up.set(0,0,l[m]),r.lookAt(0,c[m],0)):(r.up.set(0,l[m],0),r.lookAt(0,0,c[m]));const M=this._cubeSize;Jo(s,v*M,m>2?M:0,M,M),h.setRenderTarget(s),g&&h.render(_,r),h.render(t,r)}_.geometry.dispose(),_.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Cs||t.mapping===Ds;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=mh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ph());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new ue(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const l=this._cubeSize;Jo(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,Ta)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=fh[(s-1)%fh.length];this._blur(t,s-1,s,o,a)}e.autoClear=i}_blur(t,e,i,s,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",o),this._halfBlur(a,t,i,i,s,"longitudinal",o)}_halfBlur(t,e,i,s,o,a,r){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ue(this._lodPlanes[s],c),f=c.uniforms,d=this._sizeLods[i]-1,_=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*Oi-1),g=o/_,p=isFinite(o)?1+Math.floor(h*g):Oi;p>Oi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Oi}`);const m=[];let v=0;for(let b=0;b<Oi;++b){const D=b/g,E=Math.exp(-D*D/2);m.push(E),b===0?v+=E:b<p&&(v+=2*E)}for(let b=0;b<m.length;b++)m[b]=m[b]/v;f.envMap.value=t.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:M}=this;f.dTheta.value=_,f.mipInt.value=M-i;const x=this._sizeLods[s],y=3*x*(s>M-vs?s-M+vs:0),w=4*(this._cubeSize-x);Jo(e,y,w,3*x,2*x),l.setRenderTarget(e),l.render(u,Ta)}}function t1(n){const t=[],e=[],i=[];let s=n;const o=n-vs+1+hh.length;for(let a=0;a<o;a++){const r=Math.pow(2,s);e.push(r);let l=1/r;a>n-vs?l=hh[a-n+vs-1]:a===0&&(l=0),i.push(l);const c=1/(r-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,_=6,g=3,p=2,m=1,v=new Float32Array(g*_*d),M=new Float32Array(p*_*d),x=new Float32Array(m*_*d);for(let w=0;w<d;w++){const b=w%3*2/3-1,D=w>2?0:-1,E=[b,D,0,b+2/3,D,0,b+2/3,D+1,0,b,D,0,b+2/3,D+1,0,b,D+1,0];v.set(E,g*_*w),M.set(f,p*_*w);const T=[w,w,w,w,w,w];x.set(T,m*_*w)}const y=new Ze;y.setAttribute("position",new Ae(v,g)),y.setAttribute("uv",new Ae(M,p)),y.setAttribute("faceIndex",new Ae(x,m)),t.push(y),s>vs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function dh(n,t,e){const i=new Wi(n,t,e);return i.texture.mapping=Gr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Jo(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function e1(n,t,e){const i=new Float32Array(Oi),s=new q(0,1,0);return new qi({name:"SphericalGaussianBlur",defines:{n:Oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Hl(),fragmentShader:`

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
		`,blending:bi,depthTest:!1,depthWrite:!1})}function ph(){return new qi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hl(),fragmentShader:`

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
		`,blending:bi,depthTest:!1,depthWrite:!1})}function mh(){return new qi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bi,depthTest:!1,depthWrite:!1})}function Hl(){return`

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
	`}function n1(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const l=r.mapping,c=l===rl||l===al,h=l===Cs||l===Ds;if(c||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new fl(n)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new fl(n));const f=c?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,f),r.addEventListener("dispose",o),f.texture}else return null}}}return r}function s(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function o(r){const l=r.target;l.removeEventListener("dispose",o);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function i1(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(i){i.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(i){const s=e(i);return s===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function s1(n,t,e,i){const s={},o=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const _ in f.attributes)t.remove(f.attributes[_]);for(const _ in f.morphAttributes){const g=f.morphAttributes[_];for(let p=0,m=g.length;p<m;p++)t.remove(g[p])}f.removeEventListener("dispose",a),delete s[f.id];const d=o.get(f);d&&(t.remove(d),o.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function r(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const _ in f)t.update(f[_],n.ARRAY_BUFFER);const d=u.morphAttributes;for(const _ in d){const g=d[_];for(let p=0,m=g.length;p<m;p++)t.update(g[p],n.ARRAY_BUFFER)}}function c(u){const f=[],d=u.index,_=u.attributes.position;let g=0;if(d!==null){const v=d.array;g=d.version;for(let M=0,x=v.length;M<x;M+=3){const y=v[M+0],w=v[M+1],b=v[M+2];f.push(y,w,w,b,b,y)}}else if(_!==void 0){const v=_.array;g=_.version;for(let M=0,x=v.length/3-1;M<x;M+=3){const y=M+0,w=M+1,b=M+2;f.push(y,w,w,b,b,y)}}else return;const p=new(ju(f)?jr:Wr)(f,1);p.version=g;const m=o.get(u);m&&t.remove(m),o.set(u,p)}function h(u){const f=o.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return o.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function o1(n,t,e,i){const s=i.isWebGL2;let o;function a(d){o=d}let r,l;function c(d){r=d.type,l=d.bytesPerElement}function h(d,_){n.drawElements(o,_,r,d*l),e.update(_,o,1)}function u(d,_,g){if(g===0)return;let p,m;if(s)p=n,m="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[m](o,_,r,d*l,g),e.update(_,o,g)}function f(d,_,g){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<g;m++)this.render(d[m]/l,_[m]);else{p.multiDrawElementsWEBGL(o,_,0,r,d,0,g);let m=0;for(let v=0;v<g;v++)m+=_[v];e.update(m,o,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function r1(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,r){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=r*(o/3);break;case n.LINES:e.lines+=r*(o/2);break;case n.LINE_STRIP:e.lines+=r*(o-1);break;case n.LINE_LOOP:e.lines+=r*o;break;case n.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function a1(n,t){return n[0]-t[0]}function l1(n,t){return Math.abs(t[1])-Math.abs(n[1])}function c1(n,t,e){const i={},s=new Float32Array(8),o=new WeakMap,a=new Ie,r=[];for(let c=0;c<8;c++)r[c]=[c,0];function l(c,h,u){const f=c.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,_=d!==void 0?d.length:0;let g=o.get(h);if(g===void 0||g.count!==_){let A=function(){R.dispose(),o.delete(h),h.removeEventListener("dispose",A)};g!==void 0&&g.texture.dispose();const v=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,x=h.morphAttributes.color!==void 0,y=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],b=h.morphAttributes.color||[];let D=0;v===!0&&(D=1),M===!0&&(D=2),x===!0&&(D=3);let E=h.attributes.position.count*D,T=1;E>t.maxTextureSize&&(T=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const L=new Float32Array(E*T*4*_),R=new Yu(L,E,T,_);R.type=vi,R.needsUpdate=!0;const O=D*4;for(let I=0;I<_;I++){const C=y[I],k=w[I],N=b[I],F=E*T*4*I;for(let V=0;V<C.count;V++){const K=V*O;v===!0&&(a.fromBufferAttribute(C,V),L[F+K+0]=a.x,L[F+K+1]=a.y,L[F+K+2]=a.z,L[F+K+3]=0),M===!0&&(a.fromBufferAttribute(k,V),L[F+K+4]=a.x,L[F+K+5]=a.y,L[F+K+6]=a.z,L[F+K+7]=0),x===!0&&(a.fromBufferAttribute(N,V),L[F+K+8]=a.x,L[F+K+9]=a.y,L[F+K+10]=a.z,L[F+K+11]=N.itemSize===4?a.w:1)}}g={count:_,texture:R,size:new Lt(E,T)},o.set(h,g),h.addEventListener("dispose",A)}let p=0;for(let v=0;v<f.length;v++)p+=f[v];const m=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(n,"morphTargetBaseInfluence",m),u.getUniforms().setValue(n,"morphTargetInfluences",f),u.getUniforms().setValue(n,"morphTargetsTexture",g.texture,e),u.getUniforms().setValue(n,"morphTargetsTextureSize",g.size)}else{const d=f===void 0?0:f.length;let _=i[h.id];if(_===void 0||_.length!==d){_=[];for(let M=0;M<d;M++)_[M]=[M,0];i[h.id]=_}for(let M=0;M<d;M++){const x=_[M];x[0]=M,x[1]=f[M]}_.sort(l1);for(let M=0;M<8;M++)M<d&&_[M][1]?(r[M][0]=_[M][0],r[M][1]=_[M][1]):(r[M][0]=Number.MAX_SAFE_INTEGER,r[M][1]=0);r.sort(a1);const g=h.morphAttributes.position,p=h.morphAttributes.normal;let m=0;for(let M=0;M<8;M++){const x=r[M],y=x[0],w=x[1];y!==Number.MAX_SAFE_INTEGER&&w?(g&&h.getAttribute("morphTarget"+M)!==g[y]&&h.setAttribute("morphTarget"+M,g[y]),p&&h.getAttribute("morphNormal"+M)!==p[y]&&h.setAttribute("morphNormal"+M,p[y]),s[M]=w,m+=w):(g&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),p&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),s[M]=0)}const v=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(n,"morphTargetBaseInfluence",v),u.getUniforms().setValue(n,"morphTargetInfluences",s)}}return{update:l}}function h1(n,t,e,i){let s=new WeakMap;function o(l){const c=i.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),s.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:o,dispose:a}}class sf extends $e{constructor(t,e,i,s,o,a,r,l,c,h){if(h=h!==void 0?h:Gi,h!==Gi&&h!==ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Gi&&(i=Mi),i===void 0&&h===ks&&(i=Bi),super(null,s,o,a,r,l,h,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Oe,this.minFilter=l!==void 0?l:Oe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const of=new $e,rf=new sf(1,1);rf.compareFunction=Wu;const af=new Yu,lf=new Y0,cf=new tf,gh=[],_h=[],Mh=new Float32Array(16),vh=new Float32Array(9),xh=new Float32Array(4);function Ws(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let o=gh[s];if(o===void 0&&(o=new Float32Array(s),gh[s]=o),t!==0){i.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,n[a].toArray(o,r)}return o}function Pe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Le(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function qr(n,t){let e=_h[t];e===void 0&&(e=new Int32Array(t),_h[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function u1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function f1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2fv(this.addr,t),Le(e,t)}}function d1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Pe(e,t))return;n.uniform3fv(this.addr,t),Le(e,t)}}function p1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4fv(this.addr,t),Le(e,t)}}function m1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;xh.set(i),n.uniformMatrix2fv(this.addr,!1,xh),Le(e,i)}}function g1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;vh.set(i),n.uniformMatrix3fv(this.addr,!1,vh),Le(e,i)}}function _1(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Pe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Pe(e,i))return;Mh.set(i),n.uniformMatrix4fv(this.addr,!1,Mh),Le(e,i)}}function M1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function v1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2iv(this.addr,t),Le(e,t)}}function x1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3iv(this.addr,t),Le(e,t)}}function y1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4iv(this.addr,t),Le(e,t)}}function b1(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function w1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Pe(e,t))return;n.uniform2uiv(this.addr,t),Le(e,t)}}function S1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Pe(e,t))return;n.uniform3uiv(this.addr,t),Le(e,t)}}function E1(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Pe(e,t))return;n.uniform4uiv(this.addr,t),Le(e,t)}}function T1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);const o=this.type===n.SAMPLER_2D_SHADOW?rf:of;e.setTexture2D(t||o,s)}function A1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||lf,s)}function R1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||cf,s)}function P1(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||af,s)}function L1(n){switch(n){case 5126:return u1;case 35664:return f1;case 35665:return d1;case 35666:return p1;case 35674:return m1;case 35675:return g1;case 35676:return _1;case 5124:case 35670:return M1;case 35667:case 35671:return v1;case 35668:case 35672:return x1;case 35669:case 35673:return y1;case 5125:return b1;case 36294:return w1;case 36295:return S1;case 36296:return E1;case 35678:case 36198:case 36298:case 36306:case 35682:return T1;case 35679:case 36299:case 36307:return A1;case 35680:case 36300:case 36308:case 36293:return R1;case 36289:case 36303:case 36311:case 36292:return P1}}function C1(n,t){n.uniform1fv(this.addr,t)}function D1(n,t){const e=Ws(t,this.size,2);n.uniform2fv(this.addr,e)}function I1(n,t){const e=Ws(t,this.size,3);n.uniform3fv(this.addr,e)}function k1(n,t){const e=Ws(t,this.size,4);n.uniform4fv(this.addr,e)}function U1(n,t){const e=Ws(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function N1(n,t){const e=Ws(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function F1(n,t){const e=Ws(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function O1(n,t){n.uniform1iv(this.addr,t)}function z1(n,t){n.uniform2iv(this.addr,t)}function B1(n,t){n.uniform3iv(this.addr,t)}function G1(n,t){n.uniform4iv(this.addr,t)}function H1(n,t){n.uniform1uiv(this.addr,t)}function V1(n,t){n.uniform2uiv(this.addr,t)}function W1(n,t){n.uniform3uiv(this.addr,t)}function j1(n,t){n.uniform4uiv(this.addr,t)}function q1(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||of,o[a])}function X1(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||lf,o[a])}function Y1(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||cf,o[a])}function $1(n,t,e){const i=this.cache,s=t.length,o=qr(e,s);Pe(i,o)||(n.uniform1iv(this.addr,o),Le(i,o));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||af,o[a])}function K1(n){switch(n){case 5126:return C1;case 35664:return D1;case 35665:return I1;case 35666:return k1;case 35674:return U1;case 35675:return N1;case 35676:return F1;case 5124:case 35670:return O1;case 35667:case 35671:return z1;case 35668:case 35672:return B1;case 35669:case 35673:return G1;case 5125:return H1;case 36294:return V1;case 36295:return W1;case 36296:return j1;case 35678:case 36198:case 36298:case 36306:case 35682:return q1;case 35679:case 36299:case 36307:return X1;case 35680:case 36300:case 36308:case 36293:return Y1;case 36289:case 36303:case 36311:case 36292:return $1}}class Z1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=L1(e.type)}}class J1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=K1(e.type)}}class Q1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const r=s[o];r.setValue(t,e[r.id],i)}}}const La=/(\w+)(\])?(\[|\.)?/g;function yh(n,t){n.seq.push(t),n.map[t.id]=t}function t_(n,t,e){const i=n.name,s=i.length;for(La.lastIndex=0;;){const o=La.exec(i),a=La.lastIndex;let r=o[1];const l=o[2]==="]",c=o[3];if(l&&(r=r|0),c===void 0||c==="["&&a+2===s){yh(e,c===void 0?new Z1(r,n,t):new J1(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new Q1(r),yh(e,u)),e=u}}}class pr{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=t.getActiveUniform(e,s),a=t.getUniformLocation(e,o.name);t_(o,a,this)}}setValue(t,e,i,s){const o=this.map[e];o!==void 0&&o.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let o=0,a=e.length;o!==a;++o){const r=e[o],l=i[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,o=t.length;s!==o;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function bh(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const e_=37297;let n_=0;function i_(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=s;a<o;a++){const r=a+1;i.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return i.join(`
`)}function s_(n){const t=ie.getPrimaries(ie.workingColorSpace),e=ie.getPrimaries(n);let i;switch(t===e?i="":t===Sr&&e===wr?i="LinearDisplayP3ToLinearSRGB":t===wr&&e===Sr&&(i="LinearSRGBToLinearDisplayP3"),n){case oi:case Hr:return[i,"LinearTransferOETF"];case Te:case zl:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function wh(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=n.getShaderInfoLog(t).trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+i_(n.getShaderSource(t),a)}else return s}function o_(n,t){const e=s_(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function r_(n,t){let e;switch(t){case _0:e="Linear";break;case M0:e="Reinhard";break;case v0:e="OptimizedCineon";break;case Iu:e="ACESFilmic";break;case y0:e="AgX";break;case x0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function a_(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xs).join(`
`)}function l_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xs).join(`
`)}function c_(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function h_(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=n.getActiveAttrib(t,s),a=o.name;let r=1;o.type===n.FLOAT_MAT2&&(r=2),o.type===n.FLOAT_MAT3&&(r=3),o.type===n.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:n.getAttribLocation(t,a),locationSize:r}}return e}function xs(n){return n!==""}function Sh(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Eh(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const u_=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(n){return n.replace(u_,d_)}const f_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function d_(n,t){let e=$t[t];if(e===void 0){const i=f_.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return dl(e)}const p_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Th(n){return n.replace(p_,m_)}function m_(n,t,e,i){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function Ah(n){let t="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function g_(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Lu?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===Cu?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Zn&&(t="SHADOWMAP_TYPE_VSM"),t}function __(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Cs:case Ds:t="ENVMAP_TYPE_CUBE";break;case Gr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function M_(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ds:t="ENVMAP_MODE_REFRACTION";break}return t}function v_(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Du:t="ENVMAP_BLENDING_MULTIPLY";break;case m0:t="ENVMAP_BLENDING_MIX";break;case g0:t="ENVMAP_BLENDING_ADD";break}return t}function x_(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function y_(n,t,e,i){const s=n.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const l=g_(e),c=__(e),h=M_(e),u=v_(e),f=x_(e),d=e.isWebGL2?"":a_(e),_=l_(e),g=c_(o),p=s.createProgram();let m,v,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(xs).join(`
`),m.length>0&&(m+=`
`),v=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(xs).join(`
`),v.length>0&&(v+=`
`)):(m=[Ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xs).join(`
`),v=[d,Ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?$t.tonemapping_pars_fragment:"",e.toneMapping!==ti?r_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,o_("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xs).join(`
`)),a=dl(a),a=Sh(a,e),a=Eh(a,e),r=dl(r),r=Sh(r,e),r=Eh(r,e),a=Th(a),r=Th(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===qc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===qc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const x=M+m+a,y=M+v+r,w=bh(s,s.VERTEX_SHADER,x),b=bh(s,s.FRAGMENT_SHADER,y);s.attachShader(p,w),s.attachShader(p,b),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function D(R){if(n.debug.checkShaderErrors){const O=s.getProgramInfoLog(p).trim(),A=s.getShaderInfoLog(w).trim(),I=s.getShaderInfoLog(b).trim();let C=!0,k=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(C=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,p,w,b);else{const N=wh(s,w,"vertex"),F=wh(s,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+O+`
`+N+`
`+F)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(A===""||I==="")&&(k=!1);k&&(R.diagnostics={runnable:C,programLog:O,vertexShader:{log:A,prefix:m},fragmentShader:{log:I,prefix:v}})}s.deleteShader(w),s.deleteShader(b),E=new pr(s,p),T=h_(s,p)}let E;this.getUniforms=function(){return E===void 0&&D(this),E};let T;this.getAttributes=function(){return T===void 0&&D(this),T};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(p,e_)),L},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=n_++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=b,this}let b_=0;class w_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new S_(t),e.set(t,i)),i}}class S_{constructor(t){this.id=b_++,this.code=t,this.usedTimes=0}}function E_(n,t,e,i,s,o,a){const r=new Ku,l=new w_,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let d=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(E){return E===0?"uv":`uv${E}`}function p(E,T,L,R,O){const A=R.fog,I=O.geometry,C=E.isMeshStandardMaterial?R.environment:null,k=(E.isMeshStandardMaterial?e:t).get(E.envMap||C),N=k&&k.mapping===Gr?k.image.height:null,F=_[E.type];E.precision!==null&&(d=s.getMaxPrecision(E.precision),d!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",d,"instead."));const V=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,K=V!==void 0?V.length:0;let Z=0;I.morphAttributes.position!==void 0&&(Z=1),I.morphAttributes.normal!==void 0&&(Z=2),I.morphAttributes.color!==void 0&&(Z=3);let U,X,z,Y;if(F){const te=Dn[F];U=te.vertexShader,X=te.fragmentShader}else U=E.vertexShader,X=E.fragmentShader,l.update(E),z=l.getVertexShaderID(E),Y=l.getFragmentShaderID(E);const J=n.getRenderTarget(),et=O.isInstancedMesh===!0,it=O.isBatchedMesh===!0,at=!!E.map,_t=!!E.matcap,W=!!k,j=!!E.aoMap,$=!!E.lightMap,st=!!E.bumpMap,ot=!!E.normalMap,wt=!!E.displacementMap,ut=!!E.emissiveMap,S=!!E.metalnessMap,P=!!E.roughnessMap,Q=E.anisotropy>0,ft=E.clearcoat>0,rt=E.iridescence>0,dt=E.sheen>0,Mt=E.transmission>0,bt=Q&&!!E.anisotropyMap,xt=ft&&!!E.clearcoatMap,yt=ft&&!!E.clearcoatNormalMap,St=ft&&!!E.clearcoatRoughnessMap,ht=rt&&!!E.iridescenceMap,At=rt&&!!E.iridescenceThicknessMap,kt=dt&&!!E.sheenColorMap,Ct=dt&&!!E.sheenRoughnessMap,Dt=!!E.specularMap,Rt=!!E.specularColorMap,G=!!E.specularIntensityMap,Tt=Mt&&!!E.transmissionMap,Ut=Mt&&!!E.thicknessMap,tt=!!E.gradientMap,nt=!!E.alphaMap,B=E.alphaTest>0,lt=!!E.alphaHash,vt=!!E.extensions,Et=!!I.attributes.uv1,Pt=!!I.attributes.uv2,Ot=!!I.attributes.uv3;let Bt=ti;return E.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Bt=n.toneMapping),{isWebGL2:h,shaderID:F,shaderType:E.type,shaderName:E.name,vertexShader:U,fragmentShader:X,defines:E.defines,customVertexShaderID:z,customFragmentShaderID:Y,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:d,batching:it,instancing:et,instancingColor:et&&O.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:J===null?n.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:oi,map:at,matcap:_t,envMap:W,envMapMode:W&&k.mapping,envMapCubeUVHeight:N,aoMap:j,lightMap:$,bumpMap:st,normalMap:ot,displacementMap:f&&wt,emissiveMap:ut,normalMapObjectSpace:ot&&E.normalMapType===I0,normalMapTangentSpace:ot&&E.normalMapType===Vu,metalnessMap:S,roughnessMap:P,anisotropy:Q,anisotropyMap:bt,clearcoat:ft,clearcoatMap:xt,clearcoatNormalMap:yt,clearcoatRoughnessMap:St,iridescence:rt,iridescenceMap:ht,iridescenceThicknessMap:At,sheen:dt,sheenColorMap:kt,sheenRoughnessMap:Ct,specularMap:Dt,specularColorMap:Rt,specularIntensityMap:G,transmission:Mt,transmissionMap:Tt,thicknessMap:Ut,gradientMap:tt,opaque:E.transparent===!1&&E.blending===Ss,alphaMap:nt,alphaTest:B,alphaHash:lt,combine:E.combine,mapUv:at&&g(E.map.channel),aoMapUv:j&&g(E.aoMap.channel),lightMapUv:$&&g(E.lightMap.channel),bumpMapUv:st&&g(E.bumpMap.channel),normalMapUv:ot&&g(E.normalMap.channel),displacementMapUv:wt&&g(E.displacementMap.channel),emissiveMapUv:ut&&g(E.emissiveMap.channel),metalnessMapUv:S&&g(E.metalnessMap.channel),roughnessMapUv:P&&g(E.roughnessMap.channel),anisotropyMapUv:bt&&g(E.anisotropyMap.channel),clearcoatMapUv:xt&&g(E.clearcoatMap.channel),clearcoatNormalMapUv:yt&&g(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:St&&g(E.clearcoatRoughnessMap.channel),iridescenceMapUv:ht&&g(E.iridescenceMap.channel),iridescenceThicknessMapUv:At&&g(E.iridescenceThicknessMap.channel),sheenColorMapUv:kt&&g(E.sheenColorMap.channel),sheenRoughnessMapUv:Ct&&g(E.sheenRoughnessMap.channel),specularMapUv:Dt&&g(E.specularMap.channel),specularColorMapUv:Rt&&g(E.specularColorMap.channel),specularIntensityMapUv:G&&g(E.specularIntensityMap.channel),transmissionMapUv:Tt&&g(E.transmissionMap.channel),thicknessMapUv:Ut&&g(E.thicknessMap.channel),alphaMapUv:nt&&g(E.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(ot||Q),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,vertexUv1s:Et,vertexUv2s:Pt,vertexUv3s:Ot,pointsUvs:O.isPoints===!0&&!!I.attributes.uv&&(at||nt),fog:!!A,useFog:E.fog===!0,fogExp2:A&&A.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:O.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:K,morphTextureStride:Z,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Bt,useLegacyLights:n._useLegacyLights,decodeVideoTexture:at&&E.map.isVideoTexture===!0&&ie.getTransfer(E.map.colorSpace)===le,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===kn,flipSided:E.side===Xe,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionDerivatives:vt&&E.extensions.derivatives===!0,extensionFragDepth:vt&&E.extensions.fragDepth===!0,extensionDrawBuffers:vt&&E.extensions.drawBuffers===!0,extensionShaderTextureLOD:vt&&E.extensions.shaderTextureLOD===!0,extensionClipCullDistance:vt&&E.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()}}function m(E){const T=[];if(E.shaderID?T.push(E.shaderID):(T.push(E.customVertexShaderID),T.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)T.push(L),T.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(v(T,E),M(T,E),T.push(n.outputColorSpace)),T.push(E.customProgramCacheKey),T.join()}function v(E,T){E.push(T.precision),E.push(T.outputColorSpace),E.push(T.envMapMode),E.push(T.envMapCubeUVHeight),E.push(T.mapUv),E.push(T.alphaMapUv),E.push(T.lightMapUv),E.push(T.aoMapUv),E.push(T.bumpMapUv),E.push(T.normalMapUv),E.push(T.displacementMapUv),E.push(T.emissiveMapUv),E.push(T.metalnessMapUv),E.push(T.roughnessMapUv),E.push(T.anisotropyMapUv),E.push(T.clearcoatMapUv),E.push(T.clearcoatNormalMapUv),E.push(T.clearcoatRoughnessMapUv),E.push(T.iridescenceMapUv),E.push(T.iridescenceThicknessMapUv),E.push(T.sheenColorMapUv),E.push(T.sheenRoughnessMapUv),E.push(T.specularMapUv),E.push(T.specularColorMapUv),E.push(T.specularIntensityMapUv),E.push(T.transmissionMapUv),E.push(T.thicknessMapUv),E.push(T.combine),E.push(T.fogExp2),E.push(T.sizeAttenuation),E.push(T.morphTargetsCount),E.push(T.morphAttributeCount),E.push(T.numDirLights),E.push(T.numPointLights),E.push(T.numSpotLights),E.push(T.numSpotLightMaps),E.push(T.numHemiLights),E.push(T.numRectAreaLights),E.push(T.numDirLightShadows),E.push(T.numPointLightShadows),E.push(T.numSpotLightShadows),E.push(T.numSpotLightShadowsWithMaps),E.push(T.numLightProbes),E.push(T.shadowMapType),E.push(T.toneMapping),E.push(T.numClippingPlanes),E.push(T.numClipIntersection),E.push(T.depthPacking)}function M(E,T){r.disableAll(),T.isWebGL2&&r.enable(0),T.supportsVertexTextures&&r.enable(1),T.instancing&&r.enable(2),T.instancingColor&&r.enable(3),T.matcap&&r.enable(4),T.envMap&&r.enable(5),T.normalMapObjectSpace&&r.enable(6),T.normalMapTangentSpace&&r.enable(7),T.clearcoat&&r.enable(8),T.iridescence&&r.enable(9),T.alphaTest&&r.enable(10),T.vertexColors&&r.enable(11),T.vertexAlphas&&r.enable(12),T.vertexUv1s&&r.enable(13),T.vertexUv2s&&r.enable(14),T.vertexUv3s&&r.enable(15),T.vertexTangents&&r.enable(16),T.anisotropy&&r.enable(17),T.alphaHash&&r.enable(18),T.batching&&r.enable(19),E.push(r.mask),r.disableAll(),T.fog&&r.enable(0),T.useFog&&r.enable(1),T.flatShading&&r.enable(2),T.logarithmicDepthBuffer&&r.enable(3),T.skinning&&r.enable(4),T.morphTargets&&r.enable(5),T.morphNormals&&r.enable(6),T.morphColors&&r.enable(7),T.premultipliedAlpha&&r.enable(8),T.shadowMapEnabled&&r.enable(9),T.useLegacyLights&&r.enable(10),T.doubleSided&&r.enable(11),T.flipSided&&r.enable(12),T.useDepthPacking&&r.enable(13),T.dithering&&r.enable(14),T.transmission&&r.enable(15),T.sheen&&r.enable(16),T.opaque&&r.enable(17),T.pointsUvs&&r.enable(18),T.decodeVideoTexture&&r.enable(19),E.push(r.mask)}function x(E){const T=_[E.type];let L;if(T){const R=Dn[T];L=ap.clone(R.uniforms)}else L=E.uniforms;return L}function y(E,T){let L;for(let R=0,O=c.length;R<O;R++){const A=c[R];if(A.cacheKey===T){L=A,++L.usedTimes;break}}return L===void 0&&(L=new y_(n,T,E,o),c.push(L)),L}function w(E){if(--E.usedTimes===0){const T=c.indexOf(E);c[T]=c[c.length-1],c.pop(),E.destroy()}}function b(E){l.remove(E)}function D(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:x,acquireProgram:y,releaseProgram:w,releaseShaderCache:b,programs:c,dispose:D}}function T_(){let n=new WeakMap;function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function e(o){n.delete(o)}function i(o,a,r){n.get(o)[a]=r}function s(){n=new WeakMap}return{get:t,remove:e,update:i,dispose:s}}function A_(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Rh(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Ph(){const n=[];let t=0;const e=[],i=[],s=[];function o(){t=0,e.length=0,i.length=0,s.length=0}function a(u,f,d,_,g,p){let m=n[t];return m===void 0?(m={id:u.id,object:u,geometry:f,material:d,groupOrder:_,renderOrder:u.renderOrder,z:g,group:p},n[t]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=d,m.groupOrder=_,m.renderOrder=u.renderOrder,m.z=g,m.group=p),t++,m}function r(u,f,d,_,g,p){const m=a(u,f,d,_,g,p);d.transmission>0?i.push(m):d.transparent===!0?s.push(m):e.push(m)}function l(u,f,d,_,g,p){const m=a(u,f,d,_,g,p);d.transmission>0?i.unshift(m):d.transparent===!0?s.unshift(m):e.unshift(m)}function c(u,f){e.length>1&&e.sort(u||A_),i.length>1&&i.sort(f||Rh),s.length>1&&s.sort(f||Rh)}function h(){for(let u=t,f=n.length;u<f;u++){const d=n[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:i,transparent:s,init:o,push:r,unshift:l,finish:h,sort:c}}function R_(){let n=new WeakMap;function t(i,s){const o=n.get(i);let a;return o===void 0?(a=new Ph,n.set(i,[a])):s>=o.length?(a=new Ph,o.push(a)):a=o[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function P_(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new q,color:new qt};break;case"SpotLight":e={position:new q,direction:new q,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new q,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new q,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new q,halfWidth:new q,halfHeight:new q};break}return n[t.id]=e,e}}}function L_(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let C_=0;function D_(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function I_(n,t){const e=new P_,i=L_(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new q);const o=new q,a=new ae,r=new ae;function l(h,u){let f=0,d=0,_=0;for(let R=0;R<9;R++)s.probe[R].set(0,0,0);let g=0,p=0,m=0,v=0,M=0,x=0,y=0,w=0,b=0,D=0,E=0;h.sort(D_);const T=u===!0?Math.PI:1;for(let R=0,O=h.length;R<O;R++){const A=h[R],I=A.color,C=A.intensity,k=A.distance,N=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)f+=I.r*C*T,d+=I.g*C*T,_+=I.b*C*T;else if(A.isLightProbe){for(let F=0;F<9;F++)s.probe[F].addScaledVector(A.sh.coefficients[F],C);E++}else if(A.isDirectionalLight){const F=e.get(A);if(F.color.copy(A.color).multiplyScalar(A.intensity*T),A.castShadow){const V=A.shadow,K=i.get(A);K.shadowBias=V.bias,K.shadowNormalBias=V.normalBias,K.shadowRadius=V.radius,K.shadowMapSize=V.mapSize,s.directionalShadow[g]=K,s.directionalShadowMap[g]=N,s.directionalShadowMatrix[g]=A.shadow.matrix,x++}s.directional[g]=F,g++}else if(A.isSpotLight){const F=e.get(A);F.position.setFromMatrixPosition(A.matrixWorld),F.color.copy(I).multiplyScalar(C*T),F.distance=k,F.coneCos=Math.cos(A.angle),F.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),F.decay=A.decay,s.spot[m]=F;const V=A.shadow;if(A.map&&(s.spotLightMap[b]=A.map,b++,V.updateMatrices(A),A.castShadow&&D++),s.spotLightMatrix[m]=V.matrix,A.castShadow){const K=i.get(A);K.shadowBias=V.bias,K.shadowNormalBias=V.normalBias,K.shadowRadius=V.radius,K.shadowMapSize=V.mapSize,s.spotShadow[m]=K,s.spotShadowMap[m]=N,w++}m++}else if(A.isRectAreaLight){const F=e.get(A);F.color.copy(I).multiplyScalar(C),F.halfWidth.set(A.width*.5,0,0),F.halfHeight.set(0,A.height*.5,0),s.rectArea[v]=F,v++}else if(A.isPointLight){const F=e.get(A);if(F.color.copy(A.color).multiplyScalar(A.intensity*T),F.distance=A.distance,F.decay=A.decay,A.castShadow){const V=A.shadow,K=i.get(A);K.shadowBias=V.bias,K.shadowNormalBias=V.normalBias,K.shadowRadius=V.radius,K.shadowMapSize=V.mapSize,K.shadowCameraNear=V.camera.near,K.shadowCameraFar=V.camera.far,s.pointShadow[p]=K,s.pointShadowMap[p]=N,s.pointShadowMatrix[p]=A.shadow.matrix,y++}s.point[p]=F,p++}else if(A.isHemisphereLight){const F=e.get(A);F.skyColor.copy(A.color).multiplyScalar(C*T),F.groundColor.copy(A.groundColor).multiplyScalar(C*T),s.hemi[M]=F,M++}}v>0&&(t.isWebGL2?n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=It.LTC_FLOAT_1,s.rectAreaLTC2=It.LTC_FLOAT_2):(s.rectAreaLTC1=It.LTC_HALF_1,s.rectAreaLTC2=It.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=It.LTC_FLOAT_1,s.rectAreaLTC2=It.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=It.LTC_HALF_1,s.rectAreaLTC2=It.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=d,s.ambient[2]=_;const L=s.hash;(L.directionalLength!==g||L.pointLength!==p||L.spotLength!==m||L.rectAreaLength!==v||L.hemiLength!==M||L.numDirectionalShadows!==x||L.numPointShadows!==y||L.numSpotShadows!==w||L.numSpotMaps!==b||L.numLightProbes!==E)&&(s.directional.length=g,s.spot.length=m,s.rectArea.length=v,s.point.length=p,s.hemi.length=M,s.directionalShadow.length=x,s.directionalShadowMap.length=x,s.pointShadow.length=y,s.pointShadowMap.length=y,s.spotShadow.length=w,s.spotShadowMap.length=w,s.directionalShadowMatrix.length=x,s.pointShadowMatrix.length=y,s.spotLightMatrix.length=w+b-D,s.spotLightMap.length=b,s.numSpotLightShadowsWithMaps=D,s.numLightProbes=E,L.directionalLength=g,L.pointLength=p,L.spotLength=m,L.rectAreaLength=v,L.hemiLength=M,L.numDirectionalShadows=x,L.numPointShadows=y,L.numSpotShadows=w,L.numSpotMaps=b,L.numLightProbes=E,s.version=C_++)}function c(h,u){let f=0,d=0,_=0,g=0,p=0;const m=u.matrixWorldInverse;for(let v=0,M=h.length;v<M;v++){const x=h[v];if(x.isDirectionalLight){const y=s.directional[f];y.direction.setFromMatrixPosition(x.matrixWorld),o.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(o),y.direction.transformDirection(m),f++}else if(x.isSpotLight){const y=s.spot[_];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),o.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(o),y.direction.transformDirection(m),_++}else if(x.isRectAreaLight){const y=s.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),r.identity(),a.copy(x.matrixWorld),a.premultiply(m),r.extractRotation(a),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(r),y.halfHeight.applyMatrix4(r),g++}else if(x.isPointLight){const y=s.point[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const y=s.hemi[p];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),p++}}}return{setup:l,setupView:c,state:s}}function Lh(n,t){const e=new I_(n,t),i=[],s=[];function o(){i.length=0,s.length=0}function a(u){i.push(u)}function r(u){s.push(u)}function l(u){e.setup(i,u)}function c(u){e.setupView(i,u)}return{init:o,state:{lightsArray:i,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:r}}function k_(n,t){let e=new WeakMap;function i(o,a=0){const r=e.get(o);let l;return r===void 0?(l=new Lh(n,t),e.set(o,[l])):a>=r.length?(l=new Lh(n,t),r.push(l)):l=r[a],l}function s(){e=new WeakMap}return{get:i,dispose:s}}class U_ extends Ro{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=C0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class N_ extends Ro{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const F_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,O_=`uniform sampler2D shadow_pass;
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
}`;function z_(n,t,e){let i=new Gl;const s=new Lt,o=new Lt,a=new Ie,r=new U_({depthPacking:D0}),l=new N_,c={},h=e.maxTextureSize,u={[wi]:Xe,[Xe]:wi,[kn]:kn},f=new qi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:F_,fragmentShader:O_}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const _=new Ze;_.setAttribute("position",new Ae(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ue(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lu;let m=this.type;this.render=function(w,b,D){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const E=n.getRenderTarget(),T=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),R=n.state;R.setBlending(bi),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const O=m!==Zn&&this.type===Zn,A=m===Zn&&this.type!==Zn;for(let I=0,C=w.length;I<C;I++){const k=w[I],N=k.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",k,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;s.copy(N.mapSize);const F=N.getFrameExtents();if(s.multiply(F),o.copy(N.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/F.x),s.x=o.x*F.x,N.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/F.y),s.y=o.y*F.y,N.mapSize.y=o.y)),N.map===null||O===!0||A===!0){const K=this.type!==Zn?{minFilter:Oe,magFilter:Oe}:{};N.map!==null&&N.map.dispose(),N.map=new Wi(s.x,s.y,K),N.map.texture.name=k.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const V=N.getViewportCount();for(let K=0;K<V;K++){const Z=N.getViewport(K);a.set(o.x*Z.x,o.y*Z.y,o.x*Z.z,o.y*Z.w),R.viewport(a),N.updateMatrices(k,K),i=N.getFrustum(),x(b,D,N.camera,k,this.type)}N.isPointLightShadow!==!0&&this.type===Zn&&v(N,D),N.needsUpdate=!1}m=this.type,p.needsUpdate=!1,n.setRenderTarget(E,T,L)};function v(w,b){const D=t.update(g);f.defines.VSM_SAMPLES!==w.blurSamples&&(f.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Wi(s.x,s.y)),f.uniforms.shadow_pass.value=w.map.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(b,null,D,f,g,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(b,null,D,d,g,null)}function M(w,b,D,E){let T=null;const L=D.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)T=L;else if(T=D.isPointLight===!0?l:r,n.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const R=T.uuid,O=b.uuid;let A=c[R];A===void 0&&(A={},c[R]=A);let I=A[O];I===void 0&&(I=T.clone(),A[O]=I,b.addEventListener("dispose",y)),T=I}if(T.visible=b.visible,T.wireframe=b.wireframe,E===Zn?T.side=b.shadowSide!==null?b.shadowSide:b.side:T.side=b.shadowSide!==null?b.shadowSide:u[b.side],T.alphaMap=b.alphaMap,T.alphaTest=b.alphaTest,T.map=b.map,T.clipShadows=b.clipShadows,T.clippingPlanes=b.clippingPlanes,T.clipIntersection=b.clipIntersection,T.displacementMap=b.displacementMap,T.displacementScale=b.displacementScale,T.displacementBias=b.displacementBias,T.wireframeLinewidth=b.wireframeLinewidth,T.linewidth=b.linewidth,D.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const R=n.properties.get(T);R.light=D}return T}function x(w,b,D,E,T){if(w.visible===!1)return;if(w.layers.test(b.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&T===Zn)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,w.matrixWorld);const O=t.update(w),A=w.material;if(Array.isArray(A)){const I=O.groups;for(let C=0,k=I.length;C<k;C++){const N=I[C],F=A[N.materialIndex];if(F&&F.visible){const V=M(w,F,E,T);w.onBeforeShadow(n,w,b,D,O,V,N),n.renderBufferDirect(D,null,O,V,w,N),w.onAfterShadow(n,w,b,D,O,V,N)}}}else if(A.visible){const I=M(w,A,E,T);w.onBeforeShadow(n,w,b,D,O,I,null),n.renderBufferDirect(D,null,O,I,w,null),w.onAfterShadow(n,w,b,D,O,I,null)}}const R=w.children;for(let O=0,A=R.length;O<A;O++)x(R[O],b,D,E,T)}function y(w){w.target.removeEventListener("dispose",y);for(const D in c){const E=c[D],T=w.target.uuid;T in E&&(E[T].dispose(),delete E[T])}}}function B_(n,t,e){const i=e.isWebGL2;function s(){let B=!1;const lt=new Ie;let vt=null;const Et=new Ie(0,0,0,0);return{setMask:function(Pt){vt!==Pt&&!B&&(n.colorMask(Pt,Pt,Pt,Pt),vt=Pt)},setLocked:function(Pt){B=Pt},setClear:function(Pt,Ot,Bt,Qt,te){te===!0&&(Pt*=Qt,Ot*=Qt,Bt*=Qt),lt.set(Pt,Ot,Bt,Qt),Et.equals(lt)===!1&&(n.clearColor(Pt,Ot,Bt,Qt),Et.copy(lt))},reset:function(){B=!1,vt=null,Et.set(-1,0,0,0)}}}function o(){let B=!1,lt=null,vt=null,Et=null;return{setTest:function(Pt){Pt?it(n.DEPTH_TEST):at(n.DEPTH_TEST)},setMask:function(Pt){lt!==Pt&&!B&&(n.depthMask(Pt),lt=Pt)},setFunc:function(Pt){if(vt!==Pt){switch(Pt){case l0:n.depthFunc(n.NEVER);break;case c0:n.depthFunc(n.ALWAYS);break;case h0:n.depthFunc(n.LESS);break;case yr:n.depthFunc(n.LEQUAL);break;case u0:n.depthFunc(n.EQUAL);break;case f0:n.depthFunc(n.GEQUAL);break;case d0:n.depthFunc(n.GREATER);break;case p0:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}vt=Pt}},setLocked:function(Pt){B=Pt},setClear:function(Pt){Et!==Pt&&(n.clearDepth(Pt),Et=Pt)},reset:function(){B=!1,lt=null,vt=null,Et=null}}}function a(){let B=!1,lt=null,vt=null,Et=null,Pt=null,Ot=null,Bt=null,Qt=null,te=null;return{setTest:function(Wt){B||(Wt?it(n.STENCIL_TEST):at(n.STENCIL_TEST))},setMask:function(Wt){lt!==Wt&&!B&&(n.stencilMask(Wt),lt=Wt)},setFunc:function(Wt,ee,fe){(vt!==Wt||Et!==ee||Pt!==fe)&&(n.stencilFunc(Wt,ee,fe),vt=Wt,Et=ee,Pt=fe)},setOp:function(Wt,ee,fe){(Ot!==Wt||Bt!==ee||Qt!==fe)&&(n.stencilOp(Wt,ee,fe),Ot=Wt,Bt=ee,Qt=fe)},setLocked:function(Wt){B=Wt},setClear:function(Wt){te!==Wt&&(n.clearStencil(Wt),te=Wt)},reset:function(){B=!1,lt=null,vt=null,Et=null,Pt=null,Ot=null,Bt=null,Qt=null,te=null}}}const r=new s,l=new o,c=new a,h=new WeakMap,u=new WeakMap;let f={},d={},_=new WeakMap,g=[],p=null,m=!1,v=null,M=null,x=null,y=null,w=null,b=null,D=null,E=new qt(0,0,0),T=0,L=!1,R=null,O=null,A=null,I=null,C=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let N=!1,F=0;const V=n.getParameter(n.VERSION);V.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(V)[1]),N=F>=1):V.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),N=F>=2);let K=null,Z={};const U=n.getParameter(n.SCISSOR_BOX),X=n.getParameter(n.VIEWPORT),z=new Ie().fromArray(U),Y=new Ie().fromArray(X);function J(B,lt,vt,Et){const Pt=new Uint8Array(4),Ot=n.createTexture();n.bindTexture(B,Ot),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Bt=0;Bt<vt;Bt++)i&&(B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY)?n.texImage3D(lt,0,n.RGBA,1,1,Et,0,n.RGBA,n.UNSIGNED_BYTE,Pt):n.texImage2D(lt+Bt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Pt);return Ot}const et={};et[n.TEXTURE_2D]=J(n.TEXTURE_2D,n.TEXTURE_2D,1),et[n.TEXTURE_CUBE_MAP]=J(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(et[n.TEXTURE_2D_ARRAY]=J(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),et[n.TEXTURE_3D]=J(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),l.setClear(1),c.setClear(0),it(n.DEPTH_TEST),l.setFunc(yr),ut(!1),S(fc),it(n.CULL_FACE),ot(bi);function it(B){f[B]!==!0&&(n.enable(B),f[B]=!0)}function at(B){f[B]!==!1&&(n.disable(B),f[B]=!1)}function _t(B,lt){return d[B]!==lt?(n.bindFramebuffer(B,lt),d[B]=lt,i&&(B===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=lt),B===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=lt)),!0):!1}function W(B,lt){let vt=g,Et=!1;if(B)if(vt=_.get(lt),vt===void 0&&(vt=[],_.set(lt,vt)),B.isWebGLMultipleRenderTargets){const Pt=B.texture;if(vt.length!==Pt.length||vt[0]!==n.COLOR_ATTACHMENT0){for(let Ot=0,Bt=Pt.length;Ot<Bt;Ot++)vt[Ot]=n.COLOR_ATTACHMENT0+Ot;vt.length=Pt.length,Et=!0}}else vt[0]!==n.COLOR_ATTACHMENT0&&(vt[0]=n.COLOR_ATTACHMENT0,Et=!0);else vt[0]!==n.BACK&&(vt[0]=n.BACK,Et=!0);Et&&(e.isWebGL2?n.drawBuffers(vt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(vt))}function j(B){return p!==B?(n.useProgram(B),p=B,!0):!1}const $={[Ni]:n.FUNC_ADD,[Xd]:n.FUNC_SUBTRACT,[Yd]:n.FUNC_REVERSE_SUBTRACT};if(i)$[gc]=n.MIN,$[_c]=n.MAX;else{const B=t.get("EXT_blend_minmax");B!==null&&($[gc]=B.MIN_EXT,$[_c]=B.MAX_EXT)}const st={[$d]:n.ZERO,[Kd]:n.ONE,[Zd]:n.SRC_COLOR,[sl]:n.SRC_ALPHA,[i0]:n.SRC_ALPHA_SATURATE,[e0]:n.DST_COLOR,[Qd]:n.DST_ALPHA,[Jd]:n.ONE_MINUS_SRC_COLOR,[ol]:n.ONE_MINUS_SRC_ALPHA,[n0]:n.ONE_MINUS_DST_COLOR,[t0]:n.ONE_MINUS_DST_ALPHA,[s0]:n.CONSTANT_COLOR,[o0]:n.ONE_MINUS_CONSTANT_COLOR,[r0]:n.CONSTANT_ALPHA,[a0]:n.ONE_MINUS_CONSTANT_ALPHA};function ot(B,lt,vt,Et,Pt,Ot,Bt,Qt,te,Wt){if(B===bi){m===!0&&(at(n.BLEND),m=!1);return}if(m===!1&&(it(n.BLEND),m=!0),B!==qd){if(B!==v||Wt!==L){if((M!==Ni||w!==Ni)&&(n.blendEquation(n.FUNC_ADD),M=Ni,w=Ni),Wt)switch(B){case Ss:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case dc:n.blendFunc(n.ONE,n.ONE);break;case pc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case mc:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Ss:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case dc:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case pc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case mc:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}x=null,y=null,b=null,D=null,E.set(0,0,0),T=0,v=B,L=Wt}return}Pt=Pt||lt,Ot=Ot||vt,Bt=Bt||Et,(lt!==M||Pt!==w)&&(n.blendEquationSeparate($[lt],$[Pt]),M=lt,w=Pt),(vt!==x||Et!==y||Ot!==b||Bt!==D)&&(n.blendFuncSeparate(st[vt],st[Et],st[Ot],st[Bt]),x=vt,y=Et,b=Ot,D=Bt),(Qt.equals(E)===!1||te!==T)&&(n.blendColor(Qt.r,Qt.g,Qt.b,te),E.copy(Qt),T=te),v=B,L=!1}function wt(B,lt){B.side===kn?at(n.CULL_FACE):it(n.CULL_FACE);let vt=B.side===Xe;lt&&(vt=!vt),ut(vt),B.blending===Ss&&B.transparent===!1?ot(bi):ot(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),l.setFunc(B.depthFunc),l.setTest(B.depthTest),l.setMask(B.depthWrite),r.setMask(B.colorWrite);const Et=B.stencilWrite;c.setTest(Et),Et&&(c.setMask(B.stencilWriteMask),c.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),c.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Q(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?it(n.SAMPLE_ALPHA_TO_COVERAGE):at(n.SAMPLE_ALPHA_TO_COVERAGE)}function ut(B){R!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),R=B)}function S(B){B!==Wd?(it(n.CULL_FACE),B!==O&&(B===fc?n.cullFace(n.BACK):B===jd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):at(n.CULL_FACE),O=B}function P(B){B!==A&&(N&&n.lineWidth(B),A=B)}function Q(B,lt,vt){B?(it(n.POLYGON_OFFSET_FILL),(I!==lt||C!==vt)&&(n.polygonOffset(lt,vt),I=lt,C=vt)):at(n.POLYGON_OFFSET_FILL)}function ft(B){B?it(n.SCISSOR_TEST):at(n.SCISSOR_TEST)}function rt(B){B===void 0&&(B=n.TEXTURE0+k-1),K!==B&&(n.activeTexture(B),K=B)}function dt(B,lt,vt){vt===void 0&&(K===null?vt=n.TEXTURE0+k-1:vt=K);let Et=Z[vt];Et===void 0&&(Et={type:void 0,texture:void 0},Z[vt]=Et),(Et.type!==B||Et.texture!==lt)&&(K!==vt&&(n.activeTexture(vt),K=vt),n.bindTexture(B,lt||et[B]),Et.type=B,Et.texture=lt)}function Mt(){const B=Z[K];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function bt(){try{n.compressedTexImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function xt(){try{n.compressedTexImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function yt(){try{n.texSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function St(){try{n.texSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ht(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function At(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function kt(){try{n.texStorage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ct(){try{n.texStorage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Dt(){try{n.texImage2D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Rt(){try{n.texImage3D.apply(n,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function G(B){z.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),z.copy(B))}function Tt(B){Y.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),Y.copy(B))}function Ut(B,lt){let vt=u.get(lt);vt===void 0&&(vt=new WeakMap,u.set(lt,vt));let Et=vt.get(B);Et===void 0&&(Et=n.getUniformBlockIndex(lt,B.name),vt.set(B,Et))}function tt(B,lt){const Et=u.get(lt).get(B);h.get(lt)!==Et&&(n.uniformBlockBinding(lt,Et,B.__bindingPointIndex),h.set(lt,Et))}function nt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},K=null,Z={},d={},_=new WeakMap,g=[],p=null,m=!1,v=null,M=null,x=null,y=null,w=null,b=null,D=null,E=new qt(0,0,0),T=0,L=!1,R=null,O=null,A=null,I=null,C=null,z.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),r.reset(),l.reset(),c.reset()}return{buffers:{color:r,depth:l,stencil:c},enable:it,disable:at,bindFramebuffer:_t,drawBuffers:W,useProgram:j,setBlending:ot,setMaterial:wt,setFlipSided:ut,setCullFace:S,setLineWidth:P,setPolygonOffset:Q,setScissorTest:ft,activeTexture:rt,bindTexture:dt,unbindTexture:Mt,compressedTexImage2D:bt,compressedTexImage3D:xt,texImage2D:Dt,texImage3D:Rt,updateUBOMapping:Ut,uniformBlockBinding:tt,texStorage2D:kt,texStorage3D:Ct,texSubImage2D:yt,texSubImage3D:St,compressedTexSubImage2D:ht,compressedTexSubImage3D:At,scissor:G,viewport:Tt,reset:nt}}function G_(n,t,e,i,s,o,a){const r=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(S,P){return d?new OffscreenCanvas(S,P):Ar("canvas")}function g(S,P,Q,ft){let rt=1;if((S.width>ft||S.height>ft)&&(rt=ft/Math.max(S.width,S.height)),rt<1||P===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){const dt=P?ul:Math.floor,Mt=dt(rt*S.width),bt=dt(rt*S.height);u===void 0&&(u=_(Mt,bt));const xt=Q?_(Mt,bt):u;return xt.width=Mt,xt.height=bt,xt.getContext("2d").drawImage(S,0,0,Mt,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+Mt+"x"+bt+")."),xt}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function p(S){return Xc(S.width)&&Xc(S.height)}function m(S){return r?!1:S.wrapS!==_n||S.wrapT!==_n||S.minFilter!==Oe&&S.minFilter!==rn}function v(S,P){return S.generateMipmaps&&P&&S.minFilter!==Oe&&S.minFilter!==rn}function M(S){n.generateMipmap(S)}function x(S,P,Q,ft,rt=!1){if(r===!1)return P;if(S!==null){if(n[S]!==void 0)return n[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let dt=P;if(P===n.RED&&(Q===n.FLOAT&&(dt=n.R32F),Q===n.HALF_FLOAT&&(dt=n.R16F),Q===n.UNSIGNED_BYTE&&(dt=n.R8)),P===n.RED_INTEGER&&(Q===n.UNSIGNED_BYTE&&(dt=n.R8UI),Q===n.UNSIGNED_SHORT&&(dt=n.R16UI),Q===n.UNSIGNED_INT&&(dt=n.R32UI),Q===n.BYTE&&(dt=n.R8I),Q===n.SHORT&&(dt=n.R16I),Q===n.INT&&(dt=n.R32I)),P===n.RG&&(Q===n.FLOAT&&(dt=n.RG32F),Q===n.HALF_FLOAT&&(dt=n.RG16F),Q===n.UNSIGNED_BYTE&&(dt=n.RG8)),P===n.RGBA){const Mt=rt?br:ie.getTransfer(ft);Q===n.FLOAT&&(dt=n.RGBA32F),Q===n.HALF_FLOAT&&(dt=n.RGBA16F),Q===n.UNSIGNED_BYTE&&(dt=Mt===le?n.SRGB8_ALPHA8:n.RGBA8),Q===n.UNSIGNED_SHORT_4_4_4_4&&(dt=n.RGBA4),Q===n.UNSIGNED_SHORT_5_5_5_1&&(dt=n.RGB5_A1)}return(dt===n.R16F||dt===n.R32F||dt===n.RG16F||dt===n.RG32F||dt===n.RGBA16F||dt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function y(S,P,Q){return v(S,Q)===!0||S.isFramebufferTexture&&S.minFilter!==Oe&&S.minFilter!==rn?Math.log2(Math.max(P.width,P.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?P.mipmaps.length:1}function w(S){return S===Oe||S===Mc||S===na?n.NEAREST:n.LINEAR}function b(S){const P=S.target;P.removeEventListener("dispose",b),E(P),P.isVideoTexture&&h.delete(P)}function D(S){const P=S.target;P.removeEventListener("dispose",D),L(P)}function E(S){const P=i.get(S);if(P.__webglInit===void 0)return;const Q=S.source,ft=f.get(Q);if(ft){const rt=ft[P.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&T(S),Object.keys(ft).length===0&&f.delete(Q)}i.remove(S)}function T(S){const P=i.get(S);n.deleteTexture(P.__webglTexture);const Q=S.source,ft=f.get(Q);delete ft[P.__cacheKey],a.memory.textures--}function L(S){const P=S.texture,Q=i.get(S),ft=i.get(P);if(ft.__webglTexture!==void 0&&(n.deleteTexture(ft.__webglTexture),a.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(Q.__webglFramebuffer[rt]))for(let dt=0;dt<Q.__webglFramebuffer[rt].length;dt++)n.deleteFramebuffer(Q.__webglFramebuffer[rt][dt]);else n.deleteFramebuffer(Q.__webglFramebuffer[rt]);Q.__webglDepthbuffer&&n.deleteRenderbuffer(Q.__webglDepthbuffer[rt])}else{if(Array.isArray(Q.__webglFramebuffer))for(let rt=0;rt<Q.__webglFramebuffer.length;rt++)n.deleteFramebuffer(Q.__webglFramebuffer[rt]);else n.deleteFramebuffer(Q.__webglFramebuffer);if(Q.__webglDepthbuffer&&n.deleteRenderbuffer(Q.__webglDepthbuffer),Q.__webglMultisampledFramebuffer&&n.deleteFramebuffer(Q.__webglMultisampledFramebuffer),Q.__webglColorRenderbuffer)for(let rt=0;rt<Q.__webglColorRenderbuffer.length;rt++)Q.__webglColorRenderbuffer[rt]&&n.deleteRenderbuffer(Q.__webglColorRenderbuffer[rt]);Q.__webglDepthRenderbuffer&&n.deleteRenderbuffer(Q.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let rt=0,dt=P.length;rt<dt;rt++){const Mt=i.get(P[rt]);Mt.__webglTexture&&(n.deleteTexture(Mt.__webglTexture),a.memory.textures--),i.remove(P[rt])}i.remove(P),i.remove(S)}let R=0;function O(){R=0}function A(){const S=R;return S>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+s.maxTextures),R+=1,S}function I(S){const P=[];return P.push(S.wrapS),P.push(S.wrapT),P.push(S.wrapR||0),P.push(S.magFilter),P.push(S.minFilter),P.push(S.anisotropy),P.push(S.internalFormat),P.push(S.format),P.push(S.type),P.push(S.generateMipmaps),P.push(S.premultiplyAlpha),P.push(S.flipY),P.push(S.unpackAlignment),P.push(S.colorSpace),P.join()}function C(S,P){const Q=i.get(S);if(S.isVideoTexture&&wt(S),S.isRenderTargetTexture===!1&&S.version>0&&Q.__version!==S.version){const ft=S.image;if(ft===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ft.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{z(Q,S,P);return}}e.bindTexture(n.TEXTURE_2D,Q.__webglTexture,n.TEXTURE0+P)}function k(S,P){const Q=i.get(S);if(S.version>0&&Q.__version!==S.version){z(Q,S,P);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Q.__webglTexture,n.TEXTURE0+P)}function N(S,P){const Q=i.get(S);if(S.version>0&&Q.__version!==S.version){z(Q,S,P);return}e.bindTexture(n.TEXTURE_3D,Q.__webglTexture,n.TEXTURE0+P)}function F(S,P){const Q=i.get(S);if(S.version>0&&Q.__version!==S.version){Y(Q,S,P);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture,n.TEXTURE0+P)}const V={[ll]:n.REPEAT,[_n]:n.CLAMP_TO_EDGE,[cl]:n.MIRRORED_REPEAT},K={[Oe]:n.NEAREST,[Mc]:n.NEAREST_MIPMAP_NEAREST,[na]:n.NEAREST_MIPMAP_LINEAR,[rn]:n.LINEAR,[b0]:n.LINEAR_MIPMAP_NEAREST,[Is]:n.LINEAR_MIPMAP_LINEAR},Z={[k0]:n.NEVER,[B0]:n.ALWAYS,[U0]:n.LESS,[Wu]:n.LEQUAL,[N0]:n.EQUAL,[z0]:n.GEQUAL,[F0]:n.GREATER,[O0]:n.NOTEQUAL};function U(S,P,Q){if(Q?(n.texParameteri(S,n.TEXTURE_WRAP_S,V[P.wrapS]),n.texParameteri(S,n.TEXTURE_WRAP_T,V[P.wrapT]),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,V[P.wrapR]),n.texParameteri(S,n.TEXTURE_MAG_FILTER,K[P.magFilter]),n.texParameteri(S,n.TEXTURE_MIN_FILTER,K[P.minFilter])):(n.texParameteri(S,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(S,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(S===n.TEXTURE_3D||S===n.TEXTURE_2D_ARRAY)&&n.texParameteri(S,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(P.wrapS!==_n||P.wrapT!==_n)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(S,n.TEXTURE_MAG_FILTER,w(P.magFilter)),n.texParameteri(S,n.TEXTURE_MIN_FILTER,w(P.minFilter)),P.minFilter!==Oe&&P.minFilter!==rn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),P.compareFunction&&(n.texParameteri(S,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(S,n.TEXTURE_COMPARE_FUNC,Z[P.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const ft=t.get("EXT_texture_filter_anisotropic");if(P.magFilter===Oe||P.minFilter!==na&&P.minFilter!==Is||P.type===vi&&t.has("OES_texture_float_linear")===!1||r===!1&&P.type===_o&&t.has("OES_texture_half_float_linear")===!1)return;(P.anisotropy>1||i.get(P).__currentAnisotropy)&&(n.texParameterf(S,ft.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(P.anisotropy,s.getMaxAnisotropy())),i.get(P).__currentAnisotropy=P.anisotropy)}}function X(S,P){let Q=!1;S.__webglInit===void 0&&(S.__webglInit=!0,P.addEventListener("dispose",b));const ft=P.source;let rt=f.get(ft);rt===void 0&&(rt={},f.set(ft,rt));const dt=I(P);if(dt!==S.__cacheKey){rt[dt]===void 0&&(rt[dt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,Q=!0),rt[dt].usedTimes++;const Mt=rt[S.__cacheKey];Mt!==void 0&&(rt[S.__cacheKey].usedTimes--,Mt.usedTimes===0&&T(P)),S.__cacheKey=dt,S.__webglTexture=rt[dt].texture}return Q}function z(S,P,Q){let ft=n.TEXTURE_2D;(P.isDataArrayTexture||P.isCompressedArrayTexture)&&(ft=n.TEXTURE_2D_ARRAY),P.isData3DTexture&&(ft=n.TEXTURE_3D);const rt=X(S,P),dt=P.source;e.bindTexture(ft,S.__webglTexture,n.TEXTURE0+Q);const Mt=i.get(dt);if(dt.version!==Mt.__version||rt===!0){e.activeTexture(n.TEXTURE0+Q);const bt=ie.getPrimaries(ie.workingColorSpace),xt=P.colorSpace===ln?null:ie.getPrimaries(P.colorSpace),yt=P.colorSpace===ln||bt===xt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const St=m(P)&&p(P.image)===!1;let ht=g(P.image,St,!1,s.maxTextureSize);ht=ut(P,ht);const At=p(ht)||r,kt=o.convert(P.format,P.colorSpace);let Ct=o.convert(P.type),Dt=x(P.internalFormat,kt,Ct,P.colorSpace,P.isVideoTexture);U(ft,P,At);let Rt;const G=P.mipmaps,Tt=r&&P.isVideoTexture!==!0&&Dt!==Gu,Ut=Mt.__version===void 0||rt===!0,tt=y(P,ht,At);if(P.isDepthTexture)Dt=n.DEPTH_COMPONENT,r?P.type===vi?Dt=n.DEPTH_COMPONENT32F:P.type===Mi?Dt=n.DEPTH_COMPONENT24:P.type===Bi?Dt=n.DEPTH24_STENCIL8:Dt=n.DEPTH_COMPONENT16:P.type===vi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),P.format===Gi&&Dt===n.DEPTH_COMPONENT&&P.type!==Ol&&P.type!==Mi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),P.type=Mi,Ct=o.convert(P.type)),P.format===ks&&Dt===n.DEPTH_COMPONENT&&(Dt=n.DEPTH_STENCIL,P.type!==Bi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),P.type=Bi,Ct=o.convert(P.type))),Ut&&(Tt?e.texStorage2D(n.TEXTURE_2D,1,Dt,ht.width,ht.height):e.texImage2D(n.TEXTURE_2D,0,Dt,ht.width,ht.height,0,kt,Ct,null));else if(P.isDataTexture)if(G.length>0&&At){Tt&&Ut&&e.texStorage2D(n.TEXTURE_2D,tt,Dt,G[0].width,G[0].height);for(let nt=0,B=G.length;nt<B;nt++)Rt=G[nt],Tt?e.texSubImage2D(n.TEXTURE_2D,nt,0,0,Rt.width,Rt.height,kt,Ct,Rt.data):e.texImage2D(n.TEXTURE_2D,nt,Dt,Rt.width,Rt.height,0,kt,Ct,Rt.data);P.generateMipmaps=!1}else Tt?(Ut&&e.texStorage2D(n.TEXTURE_2D,tt,Dt,ht.width,ht.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,ht.width,ht.height,kt,Ct,ht.data)):e.texImage2D(n.TEXTURE_2D,0,Dt,ht.width,ht.height,0,kt,Ct,ht.data);else if(P.isCompressedTexture)if(P.isCompressedArrayTexture){Tt&&Ut&&e.texStorage3D(n.TEXTURE_2D_ARRAY,tt,Dt,G[0].width,G[0].height,ht.depth);for(let nt=0,B=G.length;nt<B;nt++)Rt=G[nt],P.format!==Mn?kt!==null?Tt?e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,Rt.width,Rt.height,ht.depth,kt,Rt.data,0,0):e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,nt,Dt,Rt.width,Rt.height,ht.depth,0,Rt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Tt?e.texSubImage3D(n.TEXTURE_2D_ARRAY,nt,0,0,0,Rt.width,Rt.height,ht.depth,kt,Ct,Rt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,nt,Dt,Rt.width,Rt.height,ht.depth,0,kt,Ct,Rt.data)}else{Tt&&Ut&&e.texStorage2D(n.TEXTURE_2D,tt,Dt,G[0].width,G[0].height);for(let nt=0,B=G.length;nt<B;nt++)Rt=G[nt],P.format!==Mn?kt!==null?Tt?e.compressedTexSubImage2D(n.TEXTURE_2D,nt,0,0,Rt.width,Rt.height,kt,Rt.data):e.compressedTexImage2D(n.TEXTURE_2D,nt,Dt,Rt.width,Rt.height,0,Rt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Tt?e.texSubImage2D(n.TEXTURE_2D,nt,0,0,Rt.width,Rt.height,kt,Ct,Rt.data):e.texImage2D(n.TEXTURE_2D,nt,Dt,Rt.width,Rt.height,0,kt,Ct,Rt.data)}else if(P.isDataArrayTexture)Tt?(Ut&&e.texStorage3D(n.TEXTURE_2D_ARRAY,tt,Dt,ht.width,ht.height,ht.depth),e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ht.width,ht.height,ht.depth,kt,Ct,ht.data)):e.texImage3D(n.TEXTURE_2D_ARRAY,0,Dt,ht.width,ht.height,ht.depth,0,kt,Ct,ht.data);else if(P.isData3DTexture)Tt?(Ut&&e.texStorage3D(n.TEXTURE_3D,tt,Dt,ht.width,ht.height,ht.depth),e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ht.width,ht.height,ht.depth,kt,Ct,ht.data)):e.texImage3D(n.TEXTURE_3D,0,Dt,ht.width,ht.height,ht.depth,0,kt,Ct,ht.data);else if(P.isFramebufferTexture){if(Ut)if(Tt)e.texStorage2D(n.TEXTURE_2D,tt,Dt,ht.width,ht.height);else{let nt=ht.width,B=ht.height;for(let lt=0;lt<tt;lt++)e.texImage2D(n.TEXTURE_2D,lt,Dt,nt,B,0,kt,Ct,null),nt>>=1,B>>=1}}else if(G.length>0&&At){Tt&&Ut&&e.texStorage2D(n.TEXTURE_2D,tt,Dt,G[0].width,G[0].height);for(let nt=0,B=G.length;nt<B;nt++)Rt=G[nt],Tt?e.texSubImage2D(n.TEXTURE_2D,nt,0,0,kt,Ct,Rt):e.texImage2D(n.TEXTURE_2D,nt,Dt,kt,Ct,Rt);P.generateMipmaps=!1}else Tt?(Ut&&e.texStorage2D(n.TEXTURE_2D,tt,Dt,ht.width,ht.height),e.texSubImage2D(n.TEXTURE_2D,0,0,0,kt,Ct,ht)):e.texImage2D(n.TEXTURE_2D,0,Dt,kt,Ct,ht);v(P,At)&&M(ft),Mt.__version=dt.version,P.onUpdate&&P.onUpdate(P)}S.__version=P.version}function Y(S,P,Q){if(P.image.length!==6)return;const ft=X(S,P),rt=P.source;e.bindTexture(n.TEXTURE_CUBE_MAP,S.__webglTexture,n.TEXTURE0+Q);const dt=i.get(rt);if(rt.version!==dt.__version||ft===!0){e.activeTexture(n.TEXTURE0+Q);const Mt=ie.getPrimaries(ie.workingColorSpace),bt=P.colorSpace===ln?null:ie.getPrimaries(P.colorSpace),xt=P.colorSpace===ln||Mt===bt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,P.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,P.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt);const yt=P.isCompressedTexture||P.image[0].isCompressedTexture,St=P.image[0]&&P.image[0].isDataTexture,ht=[];for(let nt=0;nt<6;nt++)!yt&&!St?ht[nt]=g(P.image[nt],!1,!0,s.maxCubemapSize):ht[nt]=St?P.image[nt].image:P.image[nt],ht[nt]=ut(P,ht[nt]);const At=ht[0],kt=p(At)||r,Ct=o.convert(P.format,P.colorSpace),Dt=o.convert(P.type),Rt=x(P.internalFormat,Ct,Dt,P.colorSpace),G=r&&P.isVideoTexture!==!0,Tt=dt.__version===void 0||ft===!0;let Ut=y(P,At,kt);U(n.TEXTURE_CUBE_MAP,P,kt);let tt;if(yt){G&&Tt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Ut,Rt,At.width,At.height);for(let nt=0;nt<6;nt++){tt=ht[nt].mipmaps;for(let B=0;B<tt.length;B++){const lt=tt[B];P.format!==Mn?Ct!==null?G?e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B,0,0,lt.width,lt.height,Ct,lt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B,Rt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B,0,0,lt.width,lt.height,Ct,Dt,lt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B,Rt,lt.width,lt.height,0,Ct,Dt,lt.data)}}}else{tt=P.mipmaps,G&&Tt&&(tt.length>0&&Ut++,e.texStorage2D(n.TEXTURE_CUBE_MAP,Ut,Rt,ht[0].width,ht[0].height));for(let nt=0;nt<6;nt++)if(St){G?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,ht[nt].width,ht[nt].height,Ct,Dt,ht[nt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Rt,ht[nt].width,ht[nt].height,0,Ct,Dt,ht[nt].data);for(let B=0;B<tt.length;B++){const vt=tt[B].image[nt].image;G?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B+1,0,0,vt.width,vt.height,Ct,Dt,vt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B+1,Rt,vt.width,vt.height,0,Ct,Dt,vt.data)}}else{G?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,Ct,Dt,ht[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Rt,Ct,Dt,ht[nt]);for(let B=0;B<tt.length;B++){const lt=tt[B];G?e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B+1,0,0,Ct,Dt,lt.image[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,B+1,Rt,Ct,Dt,lt.image[nt])}}}v(P,kt)&&M(n.TEXTURE_CUBE_MAP),dt.__version=rt.version,P.onUpdate&&P.onUpdate(P)}S.__version=P.version}function J(S,P,Q,ft,rt,dt){const Mt=o.convert(Q.format,Q.colorSpace),bt=o.convert(Q.type),xt=x(Q.internalFormat,Mt,bt,Q.colorSpace);if(!i.get(P).__hasExternalTextures){const St=Math.max(1,P.width>>dt),ht=Math.max(1,P.height>>dt);rt===n.TEXTURE_3D||rt===n.TEXTURE_2D_ARRAY?e.texImage3D(rt,dt,xt,St,ht,P.depth,0,Mt,bt,null):e.texImage2D(rt,dt,xt,St,ht,0,Mt,bt,null)}e.bindFramebuffer(n.FRAMEBUFFER,S),ot(P)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ft,rt,i.get(Q).__webglTexture,0,st(P)):(rt===n.TEXTURE_2D||rt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ft,rt,i.get(Q).__webglTexture,dt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function et(S,P,Q){if(n.bindRenderbuffer(n.RENDERBUFFER,S),P.depthBuffer&&!P.stencilBuffer){let ft=r===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(Q||ot(P)){const rt=P.depthTexture;rt&&rt.isDepthTexture&&(rt.type===vi?ft=n.DEPTH_COMPONENT32F:rt.type===Mi&&(ft=n.DEPTH_COMPONENT24));const dt=st(P);ot(P)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,dt,ft,P.width,P.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,dt,ft,P.width,P.height)}else n.renderbufferStorage(n.RENDERBUFFER,ft,P.width,P.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,S)}else if(P.depthBuffer&&P.stencilBuffer){const ft=st(P);Q&&ot(P)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,ft,n.DEPTH24_STENCIL8,P.width,P.height):ot(P)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ft,n.DEPTH24_STENCIL8,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,S)}else{const ft=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let rt=0;rt<ft.length;rt++){const dt=ft[rt],Mt=o.convert(dt.format,dt.colorSpace),bt=o.convert(dt.type),xt=x(dt.internalFormat,Mt,bt,dt.colorSpace),yt=st(P);Q&&ot(P)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,yt,xt,P.width,P.height):ot(P)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,yt,xt,P.width,P.height):n.renderbufferStorage(n.RENDERBUFFER,xt,P.width,P.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function it(S,P){if(P&&P.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,S),!(P.depthTexture&&P.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(P.depthTexture).__webglTexture||P.depthTexture.image.width!==P.width||P.depthTexture.image.height!==P.height)&&(P.depthTexture.image.width=P.width,P.depthTexture.image.height=P.height,P.depthTexture.needsUpdate=!0),C(P.depthTexture,0);const ft=i.get(P.depthTexture).__webglTexture,rt=st(P);if(P.depthTexture.format===Gi)ot(P)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ft,0);else if(P.depthTexture.format===ks)ot(P)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0,rt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ft,0);else throw new Error("Unknown depthTexture format")}function at(S){const P=i.get(S),Q=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!P.__autoAllocateDepthBuffer){if(Q)throw new Error("target.depthTexture not supported in Cube render targets");it(P.__webglFramebuffer,S)}else if(Q){P.__webglDepthbuffer=[];for(let ft=0;ft<6;ft++)e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer[ft]),P.__webglDepthbuffer[ft]=n.createRenderbuffer(),et(P.__webglDepthbuffer[ft],S,!1)}else e.bindFramebuffer(n.FRAMEBUFFER,P.__webglFramebuffer),P.__webglDepthbuffer=n.createRenderbuffer(),et(P.__webglDepthbuffer,S,!1);e.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(S,P,Q){const ft=i.get(S);P!==void 0&&J(ft.__webglFramebuffer,S,S.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Q!==void 0&&at(S)}function W(S){const P=S.texture,Q=i.get(S),ft=i.get(P);S.addEventListener("dispose",D),S.isWebGLMultipleRenderTargets!==!0&&(ft.__webglTexture===void 0&&(ft.__webglTexture=n.createTexture()),ft.__version=P.version,a.memory.textures++);const rt=S.isWebGLCubeRenderTarget===!0,dt=S.isWebGLMultipleRenderTargets===!0,Mt=p(S)||r;if(rt){Q.__webglFramebuffer=[];for(let bt=0;bt<6;bt++)if(r&&P.mipmaps&&P.mipmaps.length>0){Q.__webglFramebuffer[bt]=[];for(let xt=0;xt<P.mipmaps.length;xt++)Q.__webglFramebuffer[bt][xt]=n.createFramebuffer()}else Q.__webglFramebuffer[bt]=n.createFramebuffer()}else{if(r&&P.mipmaps&&P.mipmaps.length>0){Q.__webglFramebuffer=[];for(let bt=0;bt<P.mipmaps.length;bt++)Q.__webglFramebuffer[bt]=n.createFramebuffer()}else Q.__webglFramebuffer=n.createFramebuffer();if(dt)if(s.drawBuffers){const bt=S.texture;for(let xt=0,yt=bt.length;xt<yt;xt++){const St=i.get(bt[xt]);St.__webglTexture===void 0&&(St.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&S.samples>0&&ot(S)===!1){const bt=dt?P:[P];Q.__webglMultisampledFramebuffer=n.createFramebuffer(),Q.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Q.__webglMultisampledFramebuffer);for(let xt=0;xt<bt.length;xt++){const yt=bt[xt];Q.__webglColorRenderbuffer[xt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Q.__webglColorRenderbuffer[xt]);const St=o.convert(yt.format,yt.colorSpace),ht=o.convert(yt.type),At=x(yt.internalFormat,St,ht,yt.colorSpace,S.isXRRenderTarget===!0),kt=st(S);n.renderbufferStorageMultisample(n.RENDERBUFFER,kt,At,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+xt,n.RENDERBUFFER,Q.__webglColorRenderbuffer[xt])}n.bindRenderbuffer(n.RENDERBUFFER,null),S.depthBuffer&&(Q.__webglDepthRenderbuffer=n.createRenderbuffer(),et(Q.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(rt){e.bindTexture(n.TEXTURE_CUBE_MAP,ft.__webglTexture),U(n.TEXTURE_CUBE_MAP,P,Mt);for(let bt=0;bt<6;bt++)if(r&&P.mipmaps&&P.mipmaps.length>0)for(let xt=0;xt<P.mipmaps.length;xt++)J(Q.__webglFramebuffer[bt][xt],S,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+bt,xt);else J(Q.__webglFramebuffer[bt],S,P,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0);v(P,Mt)&&M(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(dt){const bt=S.texture;for(let xt=0,yt=bt.length;xt<yt;xt++){const St=bt[xt],ht=i.get(St);e.bindTexture(n.TEXTURE_2D,ht.__webglTexture),U(n.TEXTURE_2D,St,Mt),J(Q.__webglFramebuffer,S,St,n.COLOR_ATTACHMENT0+xt,n.TEXTURE_2D,0),v(St,Mt)&&M(n.TEXTURE_2D)}e.unbindTexture()}else{let bt=n.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(r?bt=S.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(bt,ft.__webglTexture),U(bt,P,Mt),r&&P.mipmaps&&P.mipmaps.length>0)for(let xt=0;xt<P.mipmaps.length;xt++)J(Q.__webglFramebuffer[xt],S,P,n.COLOR_ATTACHMENT0,bt,xt);else J(Q.__webglFramebuffer,S,P,n.COLOR_ATTACHMENT0,bt,0);v(P,Mt)&&M(bt),e.unbindTexture()}S.depthBuffer&&at(S)}function j(S){const P=p(S)||r,Q=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let ft=0,rt=Q.length;ft<rt;ft++){const dt=Q[ft];if(v(dt,P)){const Mt=S.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,bt=i.get(dt).__webglTexture;e.bindTexture(Mt,bt),M(Mt),e.unbindTexture()}}}function $(S){if(r&&S.samples>0&&ot(S)===!1){const P=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],Q=S.width,ft=S.height;let rt=n.COLOR_BUFFER_BIT;const dt=[],Mt=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,bt=i.get(S),xt=S.isWebGLMultipleRenderTargets===!0;if(xt)for(let yt=0;yt<P.length;yt++)e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let yt=0;yt<P.length;yt++){dt.push(n.COLOR_ATTACHMENT0+yt),S.depthBuffer&&dt.push(Mt);const St=bt.__ignoreDepthValues!==void 0?bt.__ignoreDepthValues:!1;if(St===!1&&(S.depthBuffer&&(rt|=n.DEPTH_BUFFER_BIT),S.stencilBuffer&&(rt|=n.STENCIL_BUFFER_BIT)),xt&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,bt.__webglColorRenderbuffer[yt]),St===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[Mt]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[Mt])),xt){const ht=i.get(P[yt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ht,0)}n.blitFramebuffer(0,0,Q,ft,0,0,Q,ft,rt,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,dt)}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),xt)for(let yt=0;yt<P.length;yt++){e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.RENDERBUFFER,bt.__webglColorRenderbuffer[yt]);const St=i.get(P[yt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,bt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+yt,n.TEXTURE_2D,St,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}}function st(S){return Math.min(s.maxSamples,S.samples)}function ot(S){const P=i.get(S);return r&&S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&P.__useRenderToTexture!==!1}function wt(S){const P=a.render.frame;h.get(S)!==P&&(h.set(S,P),S.update())}function ut(S,P){const Q=S.colorSpace,ft=S.format,rt=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===hl||Q!==oi&&Q!==ln&&(ie.getTransfer(Q)===le?r===!1?t.has("EXT_sRGB")===!0&&ft===Mn?(S.format=hl,S.minFilter=rn,S.generateMipmaps=!1):P=qu.sRGBToLinear(P):(ft!==Mn||rt!==ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Q)),P}this.allocateTextureUnit=A,this.resetTextureUnits=O,this.setTexture2D=C,this.setTexture2DArray=k,this.setTexture3D=N,this.setTextureCube=F,this.rebindTextures=_t,this.setupRenderTarget=W,this.updateRenderTargetMipmap=j,this.updateMultisampleRenderTarget=$,this.setupDepthRenderbuffer=at,this.setupFrameBufferTexture=J,this.useMultisampledRTT=ot}function H_(n,t,e){const i=e.isWebGL2;function s(o,a=ln){let r;const l=ie.getTransfer(a);if(o===ei)return n.UNSIGNED_BYTE;if(o===Nu)return n.UNSIGNED_SHORT_4_4_4_4;if(o===Fu)return n.UNSIGNED_SHORT_5_5_5_1;if(o===w0)return n.BYTE;if(o===S0)return n.SHORT;if(o===Ol)return n.UNSIGNED_SHORT;if(o===Uu)return n.INT;if(o===Mi)return n.UNSIGNED_INT;if(o===vi)return n.FLOAT;if(o===_o)return i?n.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===E0)return n.ALPHA;if(o===Mn)return n.RGBA;if(o===T0)return n.LUMINANCE;if(o===A0)return n.LUMINANCE_ALPHA;if(o===Gi)return n.DEPTH_COMPONENT;if(o===ks)return n.DEPTH_STENCIL;if(o===hl)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===R0)return n.RED;if(o===Ou)return n.RED_INTEGER;if(o===P0)return n.RG;if(o===zu)return n.RG_INTEGER;if(o===Bu)return n.RGBA_INTEGER;if(o===ia||o===sa||o===oa||o===ra)if(l===le)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===ia)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===ia)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===sa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===oa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===vc||o===xc||o===yc||o===bc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===vc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===xc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===yc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===bc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Gu)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===wc||o===Sc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(o===wc)return l===le?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===Sc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===Ec||o===Tc||o===Ac||o===Rc||o===Pc||o===Lc||o===Cc||o===Dc||o===Ic||o===kc||o===Uc||o===Nc||o===Fc||o===Oc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(o===Ec)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Tc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Ac)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Rc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Pc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===Lc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===Cc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===Dc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Ic)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===kc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===Uc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===Nc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===Fc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Oc)return l===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===aa||o===zc||o===Bc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(o===aa)return l===le?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===zc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===Bc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===L0||o===Gc||o===Hc||o===Vc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(o===aa)return r.COMPRESSED_RED_RGTC1_EXT;if(o===Gc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Hc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===Vc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Bi?i?n.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):n[o]!==void 0?n[o]:null}return{convert:s}}class V_ extends an{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class vn extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}}const W_={type:"move"};class Ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,o=null,a=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,i),m=this._getHandJoint(c,g);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,_=.005;c.inputState.pinching&&f>d+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,i),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(W_)))}return r!==null&&(r.visible=s!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new vn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class j_ extends Yi{constructor(t,e){super();const i=this;let s=null,o=1,a=null,r="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,_=null;const g=e.getContextAttributes();let p=null,m=null;const v=[],M=[],x=new Lt;let y=null;const w=new an;w.layers.enable(1),w.viewport=new Ie;const b=new an;b.layers.enable(2),b.viewport=new Ie;const D=[w,b],E=new V_;E.layers.enable(1),E.layers.enable(2);let T=null,L=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let X=v[U];return X===void 0&&(X=new Ca,v[U]=X),X.getTargetRaySpace()},this.getControllerGrip=function(U){let X=v[U];return X===void 0&&(X=new Ca,v[U]=X),X.getGripSpace()},this.getHand=function(U){let X=v[U];return X===void 0&&(X=new Ca,v[U]=X),X.getHandSpace()};function R(U){const X=M.indexOf(U.inputSource);if(X===-1)return;const z=v[X];z!==void 0&&(z.update(U.inputSource,U.frame,c||a),z.dispatchEvent({type:U.type,data:U.inputSource}))}function O(){s.removeEventListener("select",R),s.removeEventListener("selectstart",R),s.removeEventListener("selectend",R),s.removeEventListener("squeeze",R),s.removeEventListener("squeezestart",R),s.removeEventListener("squeezeend",R),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",A);for(let U=0;U<v.length;U++){const X=M[U];X!==null&&(M[U]=null,v[U].disconnect(X))}T=null,L=null,t.setRenderTarget(p),d=null,f=null,u=null,s=null,m=null,Z.stop(),i.isPresenting=!1,t.setPixelRatio(y),t.setSize(x.width,x.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){o=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){r=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",R),s.addEventListener("selectstart",R),s.addEventListener("selectend",R),s.addEventListener("squeeze",R),s.addEventListener("squeezestart",R),s.addEventListener("squeezeend",R),s.addEventListener("end",O),s.addEventListener("inputsourceschange",A),g.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(x),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const X={antialias:s.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(s,e,X),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),m=new Wi(d.framebufferWidth,d.framebufferHeight,{format:Mn,type:ei,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let X=null,z=null,Y=null;g.depth&&(Y=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,X=g.stencil?ks:Gi,z=g.stencil?Bi:Mi);const J={colorFormat:e.RGBA8,depthFormat:Y,scaleFactor:o};u=new XRWebGLBinding(s,e),f=u.createProjectionLayer(J),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),m=new Wi(f.textureWidth,f.textureHeight,{format:Mn,type:ei,depthTexture:new sf(f.textureWidth,f.textureHeight,z,void 0,void 0,void 0,void 0,void 0,void 0,X),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const et=t.properties.get(m);et.__ignoreDepthValues=f.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(r),Z.setContext(s),Z.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function A(U){for(let X=0;X<U.removed.length;X++){const z=U.removed[X],Y=M.indexOf(z);Y>=0&&(M[Y]=null,v[Y].disconnect(z))}for(let X=0;X<U.added.length;X++){const z=U.added[X];let Y=M.indexOf(z);if(Y===-1){for(let et=0;et<v.length;et++)if(et>=M.length){M.push(z),Y=et;break}else if(M[et]===null){M[et]=z,Y=et;break}if(Y===-1)break}const J=v[Y];J&&J.connect(z)}}const I=new q,C=new q;function k(U,X,z){I.setFromMatrixPosition(X.matrixWorld),C.setFromMatrixPosition(z.matrixWorld);const Y=I.distanceTo(C),J=X.projectionMatrix.elements,et=z.projectionMatrix.elements,it=J[14]/(J[10]-1),at=J[14]/(J[10]+1),_t=(J[9]+1)/J[5],W=(J[9]-1)/J[5],j=(J[8]-1)/J[0],$=(et[8]+1)/et[0],st=it*j,ot=it*$,wt=Y/(-j+$),ut=wt*-j;X.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(ut),U.translateZ(wt),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert();const S=it+wt,P=at+wt,Q=st-ut,ft=ot+(Y-ut),rt=_t*at/P*S,dt=W*at/P*S;U.projectionMatrix.makePerspective(Q,ft,rt,dt,S,P),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}function N(U,X){X===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(X.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;E.near=b.near=w.near=U.near,E.far=b.far=w.far=U.far,(T!==E.near||L!==E.far)&&(s.updateRenderState({depthNear:E.near,depthFar:E.far}),T=E.near,L=E.far);const X=U.parent,z=E.cameras;N(E,X);for(let Y=0;Y<z.length;Y++)N(z[Y],X);z.length===2?k(E,w,b):E.projectionMatrix.copy(w.projectionMatrix),F(U,E,X)};function F(U,X,z){z===null?U.matrix.copy(X.matrixWorld):(U.matrix.copy(z.matrixWorld),U.matrix.invert(),U.matrix.multiply(X.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(X.projectionMatrix),U.projectionMatrixInverse.copy(X.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Tr*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return E},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(U){l=U,f!==null&&(f.fixedFoveation=U),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=U)};let V=null;function K(U,X){if(h=X.getViewerPose(c||a),_=X,h!==null){const z=h.views;d!==null&&(t.setRenderTargetFramebuffer(m,d.framebuffer),t.setRenderTarget(m));let Y=!1;z.length!==E.cameras.length&&(E.cameras.length=0,Y=!0);for(let J=0;J<z.length;J++){const et=z[J];let it=null;if(d!==null)it=d.getViewport(et);else{const _t=u.getViewSubImage(f,et);it=_t.viewport,J===0&&(t.setRenderTargetTextures(m,_t.colorTexture,f.ignoreDepthValues?void 0:_t.depthStencilTexture),t.setRenderTarget(m))}let at=D[J];at===void 0&&(at=new an,at.layers.enable(J),at.viewport=new Ie,D[J]=at),at.matrix.fromArray(et.transform.matrix),at.matrix.decompose(at.position,at.quaternion,at.scale),at.projectionMatrix.fromArray(et.projectionMatrix),at.projectionMatrixInverse.copy(at.projectionMatrix).invert(),at.viewport.set(it.x,it.y,it.width,it.height),J===0&&(E.matrix.copy(at.matrix),E.matrix.decompose(E.position,E.quaternion,E.scale)),Y===!0&&E.cameras.push(at)}}for(let z=0;z<v.length;z++){const Y=M[z],J=v[z];Y!==null&&J!==void 0&&J.update(Y,X,c||a)}V&&V(U,X),X.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:X}),_=null}const Z=new ef;Z.setAnimationLoop(K),this.setAnimationLoop=function(U){V=U},this.dispose=function(){}}}function q_(n,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,Ju(n)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,v,M,x){m.isMeshBasicMaterial||m.isMeshLambertMaterial?o(p,m):m.isMeshToonMaterial?(o(p,m),u(p,m)):m.isMeshPhongMaterial?(o(p,m),h(p,m)):m.isMeshStandardMaterial?(o(p,m),f(p,m),m.isMeshPhysicalMaterial&&d(p,m,x)):m.isMeshMatcapMaterial?(o(p,m),_(p,m)):m.isMeshDepthMaterial?o(p,m):m.isMeshDistanceMaterial?(o(p,m),g(p,m)):m.isMeshNormalMaterial?o(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&r(p,m)):m.isPointsMaterial?l(p,m,v,M):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function o(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Xe&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Xe&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const v=t.get(m).envMap;if(v&&(p.envMap.value=v,p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap){p.lightMap.value=m.lightMap;const M=n._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=m.lightMapIntensity*M,e(m.lightMap,p.lightMapTransform)}m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function r(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,v,M){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*v,p.scale.value=M*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),t.get(m).envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,v){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Xe&&p.clearcoatNormalScale.value.negate())),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,m){m.matcap&&(p.matcap.value=m.matcap)}function g(p,m){const v=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function X_(n,t,e,i){let s={},o={},a=[];const r=e.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(v,M){const x=M.program;i.uniformBlockBinding(v,x)}function c(v,M){let x=s[v.id];x===void 0&&(_(v),x=h(v),s[v.id]=x,v.addEventListener("dispose",p));const y=M.program;i.updateUBOMapping(v,y);const w=t.render.frame;o[v.id]!==w&&(f(v),o[v.id]=w)}function h(v){const M=u();v.__bindingPointIndex=M;const x=n.createBuffer(),y=v.__size,w=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,y,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,x),x}function u(){for(let v=0;v<r;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const M=s[v.id],x=v.uniforms,y=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let w=0,b=x.length;w<b;w++){const D=Array.isArray(x[w])?x[w]:[x[w]];for(let E=0,T=D.length;E<T;E++){const L=D[E];if(d(L,w,E,y)===!0){const R=L.__offset,O=Array.isArray(L.value)?L.value:[L.value];let A=0;for(let I=0;I<O.length;I++){const C=O[I],k=g(C);typeof C=="number"||typeof C=="boolean"?(L.__data[0]=C,n.bufferSubData(n.UNIFORM_BUFFER,R+A,L.__data)):C.isMatrix3?(L.__data[0]=C.elements[0],L.__data[1]=C.elements[1],L.__data[2]=C.elements[2],L.__data[3]=0,L.__data[4]=C.elements[3],L.__data[5]=C.elements[4],L.__data[6]=C.elements[5],L.__data[7]=0,L.__data[8]=C.elements[6],L.__data[9]=C.elements[7],L.__data[10]=C.elements[8],L.__data[11]=0):(C.toArray(L.__data,A),A+=k.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,R,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function d(v,M,x,y){const w=v.value,b=M+"_"+x;if(y[b]===void 0)return typeof w=="number"||typeof w=="boolean"?y[b]=w:y[b]=w.clone(),!0;{const D=y[b];if(typeof w=="number"||typeof w=="boolean"){if(D!==w)return y[b]=w,!0}else if(D.equals(w)===!1)return D.copy(w),!0}return!1}function _(v){const M=v.uniforms;let x=0;const y=16;for(let b=0,D=M.length;b<D;b++){const E=Array.isArray(M[b])?M[b]:[M[b]];for(let T=0,L=E.length;T<L;T++){const R=E[T],O=Array.isArray(R.value)?R.value:[R.value];for(let A=0,I=O.length;A<I;A++){const C=O[A],k=g(C),N=x%y;N!==0&&y-N<k.boundary&&(x+=y-N),R.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=x,x+=k.storage}}}const w=x%y;return w>0&&(x+=y-w),v.__size=x,v.__cache={},this}function g(v){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),M}function p(v){const M=v.target;M.removeEventListener("dispose",p);const x=a.indexOf(M.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete o[M.id]}function m(){for(const v in s)n.deleteBuffer(s[v]);a=[],s={},o={}}return{bind:l,update:c,dispose:m}}class hf{constructor(t={}){const{canvas:e=V0(),context:i=null,depth:s=!0,stencil:o=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;i!==null?f=i.getContextAttributes().alpha:f=a;const d=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const m=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Te,this._useLegacyLights=!1,this.toneMapping=ti,this.toneMappingExposure=1;const M=this;let x=!1,y=0,w=0,b=null,D=-1,E=null;const T=new Ie,L=new Ie;let R=null;const O=new qt(0);let A=0,I=e.width,C=e.height,k=1,N=null,F=null;const V=new Ie(0,0,I,C),K=new Ie(0,0,I,C);let Z=!1;const U=new Gl;let X=!1,z=!1,Y=null;const J=new ae,et=new Lt,it=new q,at={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function _t(){return b===null?k:1}let W=i;function j(H,ct){for(let pt=0;pt<H.length;pt++){const gt=H[pt],mt=e.getContext(gt,ct);if(mt!==null)return mt}return null}try{const H={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Fl}`),e.addEventListener("webglcontextlost",nt,!1),e.addEventListener("webglcontextrestored",B,!1),e.addEventListener("webglcontextcreationerror",lt,!1),W===null){const ct=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&ct.shift(),W=j(ct,H),W===null)throw j(ct)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&W instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),W.getShaderPrecisionFormat===void 0&&(W.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(H){throw console.error("THREE.WebGLRenderer: "+H.message),H}let $,st,ot,wt,ut,S,P,Q,ft,rt,dt,Mt,bt,xt,yt,St,ht,At,kt,Ct,Dt,Rt,G,Tt;function Ut(){$=new i1(W),st=new Zg(W,$,t),$.init(st),Rt=new H_(W,$,st),ot=new B_(W,$,st),wt=new r1(W),ut=new T_,S=new G_(W,$,ot,ut,st,Rt,wt),P=new Qg(M),Q=new n1(M),ft=new pp(W,st),G=new $g(W,$,ft,st),rt=new s1(W,ft,wt,G),dt=new h1(W,rt,ft,wt),kt=new c1(W,st,S),St=new Jg(ut),Mt=new E_(M,P,Q,$,st,G,St),bt=new q_(M,ut),xt=new R_,yt=new k_($,st),At=new Yg(M,P,Q,ot,dt,f,l),ht=new z_(M,dt,st),Tt=new X_(W,wt,st,ot),Ct=new Kg(W,$,wt,st),Dt=new o1(W,$,wt,st),wt.programs=Mt.programs,M.capabilities=st,M.extensions=$,M.properties=ut,M.renderLists=xt,M.shadowMap=ht,M.state=ot,M.info=wt}Ut();const tt=new j_(M,W);this.xr=tt,this.getContext=function(){return W},this.getContextAttributes=function(){return W.getContextAttributes()},this.forceContextLoss=function(){const H=$.get("WEBGL_lose_context");H&&H.loseContext()},this.forceContextRestore=function(){const H=$.get("WEBGL_lose_context");H&&H.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(H){H!==void 0&&(k=H,this.setSize(I,C,!1))},this.getSize=function(H){return H.set(I,C)},this.setSize=function(H,ct,pt=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}I=H,C=ct,e.width=Math.floor(H*k),e.height=Math.floor(ct*k),pt===!0&&(e.style.width=H+"px",e.style.height=ct+"px"),this.setViewport(0,0,H,ct)},this.getDrawingBufferSize=function(H){return H.set(I*k,C*k).floor()},this.setDrawingBufferSize=function(H,ct,pt){I=H,C=ct,k=pt,e.width=Math.floor(H*pt),e.height=Math.floor(ct*pt),this.setViewport(0,0,H,ct)},this.getCurrentViewport=function(H){return H.copy(T)},this.getViewport=function(H){return H.copy(V)},this.setViewport=function(H,ct,pt,gt){H.isVector4?V.set(H.x,H.y,H.z,H.w):V.set(H,ct,pt,gt),ot.viewport(T.copy(V).multiplyScalar(k).floor())},this.getScissor=function(H){return H.copy(K)},this.setScissor=function(H,ct,pt,gt){H.isVector4?K.set(H.x,H.y,H.z,H.w):K.set(H,ct,pt,gt),ot.scissor(L.copy(K).multiplyScalar(k).floor())},this.getScissorTest=function(){return Z},this.setScissorTest=function(H){ot.setScissorTest(Z=H)},this.setOpaqueSort=function(H){N=H},this.setTransparentSort=function(H){F=H},this.getClearColor=function(H){return H.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor.apply(At,arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha.apply(At,arguments)},this.clear=function(H=!0,ct=!0,pt=!0){let gt=0;if(H){let mt=!1;if(b!==null){const Ft=b.texture.format;mt=Ft===Bu||Ft===zu||Ft===Ou}if(mt){const Ft=b.texture.type,zt=Ft===ei||Ft===Mi||Ft===Ol||Ft===Bi||Ft===Nu||Ft===Fu,Ht=At.getClearColor(),Vt=At.getClearAlpha(),Kt=Ht.r,jt=Ht.g,Xt=Ht.b;zt?(d[0]=Kt,d[1]=jt,d[2]=Xt,d[3]=Vt,W.clearBufferuiv(W.COLOR,0,d)):(_[0]=Kt,_[1]=jt,_[2]=Xt,_[3]=Vt,W.clearBufferiv(W.COLOR,0,_))}else gt|=W.COLOR_BUFFER_BIT}ct&&(gt|=W.DEPTH_BUFFER_BIT),pt&&(gt|=W.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W.clear(gt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",nt,!1),e.removeEventListener("webglcontextrestored",B,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),xt.dispose(),yt.dispose(),ut.dispose(),P.dispose(),Q.dispose(),dt.dispose(),G.dispose(),Tt.dispose(),Mt.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",te),tt.removeEventListener("sessionend",Wt),Y&&(Y.dispose(),Y=null),ee.stop()};function nt(H){H.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function B(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const H=wt.autoReset,ct=ht.enabled,pt=ht.autoUpdate,gt=ht.needsUpdate,mt=ht.type;Ut(),wt.autoReset=H,ht.enabled=ct,ht.autoUpdate=pt,ht.needsUpdate=gt,ht.type=mt}function lt(H){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",H.statusMessage)}function vt(H){const ct=H.target;ct.removeEventListener("dispose",vt),Et(ct)}function Et(H){Pt(H),ut.remove(H)}function Pt(H){const ct=ut.get(H).programs;ct!==void 0&&(ct.forEach(function(pt){Mt.releaseProgram(pt)}),H.isShaderMaterial&&Mt.releaseShaderCache(H))}this.renderBufferDirect=function(H,ct,pt,gt,mt,Ft){ct===null&&(ct=at);const zt=mt.isMesh&&mt.matrixWorld.determinant()<0,Ht=Ge(H,ct,pt,gt,mt);ot.setMaterial(gt,zt);let Vt=pt.index,Kt=1;if(gt.wireframe===!0){if(Vt=rt.getWireframeAttribute(pt),Vt===void 0)return;Kt=2}const jt=pt.drawRange,Xt=pt.attributes.position;let ye=jt.start*Kt,nn=(jt.start+jt.count)*Kt;Ft!==null&&(ye=Math.max(ye,Ft.start*Kt),nn=Math.min(nn,(Ft.start+Ft.count)*Kt)),Vt!==null?(ye=Math.max(ye,0),nn=Math.min(nn,Vt.count)):Xt!=null&&(ye=Math.max(ye,0),nn=Math.min(nn,Xt.count));const Ce=nn-ye;if(Ce<0||Ce===1/0)return;G.setup(mt,gt,Ht,pt,Vt);let Vn,de=Ct;if(Vt!==null&&(Vn=ft.get(Vt),de=Dt,de.setIndex(Vn)),mt.isMesh)gt.wireframe===!0?(ot.setLineWidth(gt.wireframeLinewidth*_t()),de.setMode(W.LINES)):de.setMode(W.TRIANGLES);else if(mt.isLine){let Zt=gt.linewidth;Zt===void 0&&(Zt=1),ot.setLineWidth(Zt*_t()),mt.isLineSegments?de.setMode(W.LINES):mt.isLineLoop?de.setMode(W.LINE_LOOP):de.setMode(W.LINE_STRIP)}else mt.isPoints?de.setMode(W.POINTS):mt.isSprite&&de.setMode(W.TRIANGLES);if(mt.isBatchedMesh)de.renderMultiDraw(mt._multiDrawStarts,mt._multiDrawCounts,mt._multiDrawCount);else if(mt.isInstancedMesh)de.renderInstances(ye,Ce,mt.count);else if(pt.isInstancedBufferGeometry){const Zt=pt._maxInstanceCount!==void 0?pt._maxInstanceCount:1/0,Jr=Math.min(pt.instanceCount,Zt);de.renderInstances(ye,Ce,Jr)}else de.render(ye,Ce)};function Ot(H,ct,pt){H.transparent===!0&&H.side===kn&&H.forceSinglePass===!1?(H.side=Xe,H.needsUpdate=!0,li(H,ct,pt),H.side=wi,H.needsUpdate=!0,li(H,ct,pt),H.side=kn):li(H,ct,pt)}this.compile=function(H,ct,pt=null){pt===null&&(pt=H),p=yt.get(pt),p.init(),v.push(p),pt.traverseVisible(function(mt){mt.isLight&&mt.layers.test(ct.layers)&&(p.pushLight(mt),mt.castShadow&&p.pushShadow(mt))}),H!==pt&&H.traverseVisible(function(mt){mt.isLight&&mt.layers.test(ct.layers)&&(p.pushLight(mt),mt.castShadow&&p.pushShadow(mt))}),p.setupLights(M._useLegacyLights);const gt=new Set;return H.traverse(function(mt){const Ft=mt.material;if(Ft)if(Array.isArray(Ft))for(let zt=0;zt<Ft.length;zt++){const Ht=Ft[zt];Ot(Ht,pt,mt),gt.add(Ht)}else Ot(Ft,pt,mt),gt.add(Ft)}),v.pop(),p=null,gt},this.compileAsync=function(H,ct,pt=null){const gt=this.compile(H,ct,pt);return new Promise(mt=>{function Ft(){if(gt.forEach(function(zt){ut.get(zt).currentProgram.isReady()&&gt.delete(zt)}),gt.size===0){mt(H);return}setTimeout(Ft,10)}$.get("KHR_parallel_shader_compile")!==null?Ft():setTimeout(Ft,10)})};let Bt=null;function Qt(H){Bt&&Bt(H)}function te(){ee.stop()}function Wt(){ee.start()}const ee=new ef;ee.setAnimationLoop(Qt),typeof self<"u"&&ee.setContext(self),this.setAnimationLoop=function(H){Bt=H,tt.setAnimationLoop(H),H===null?ee.stop():ee.start()},tt.addEventListener("sessionstart",te),tt.addEventListener("sessionend",Wt),this.render=function(H,ct){if(ct!==void 0&&ct.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),ct.parent===null&&ct.matrixWorldAutoUpdate===!0&&ct.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(ct),ct=tt.getCamera()),H.isScene===!0&&H.onBeforeRender(M,H,ct,b),p=yt.get(H,v.length),p.init(),v.push(p),J.multiplyMatrices(ct.projectionMatrix,ct.matrixWorldInverse),U.setFromProjectionMatrix(J),z=this.localClippingEnabled,X=St.init(this.clippingPlanes,z),g=xt.get(H,m.length),g.init(),m.push(g),fe(H,ct,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(N,F),this.info.render.frame++,X===!0&&St.beginShadows();const pt=p.state.shadowsArray;if(ht.render(pt,H,ct),X===!0&&St.endShadows(),this.info.autoReset===!0&&this.info.reset(),At.render(g,H),p.setupLights(M._useLegacyLights),ct.isArrayCamera){const gt=ct.cameras;for(let mt=0,Ft=gt.length;mt<Ft;mt++){const zt=gt[mt];Hn(g,H,zt,zt.viewport)}}else Hn(g,H,ct);b!==null&&(S.updateMultisampleRenderTarget(b),S.updateRenderTargetMipmap(b)),H.isScene===!0&&H.onAfterRender(M,H,ct),G.resetDefaultState(),D=-1,E=null,v.pop(),v.length>0?p=v[v.length-1]:p=null,m.pop(),m.length>0?g=m[m.length-1]:g=null};function fe(H,ct,pt,gt){if(H.visible===!1)return;if(H.layers.test(ct.layers)){if(H.isGroup)pt=H.renderOrder;else if(H.isLOD)H.autoUpdate===!0&&H.update(ct);else if(H.isLight)p.pushLight(H),H.castShadow&&p.pushShadow(H);else if(H.isSprite){if(!H.frustumCulled||U.intersectsSprite(H)){gt&&it.setFromMatrixPosition(H.matrixWorld).applyMatrix4(J);const zt=dt.update(H),Ht=H.material;Ht.visible&&g.push(H,zt,Ht,pt,it.z,null)}}else if((H.isMesh||H.isLine||H.isPoints)&&(!H.frustumCulled||U.intersectsObject(H))){const zt=dt.update(H),Ht=H.material;if(gt&&(H.boundingSphere!==void 0?(H.boundingSphere===null&&H.computeBoundingSphere(),it.copy(H.boundingSphere.center)):(zt.boundingSphere===null&&zt.computeBoundingSphere(),it.copy(zt.boundingSphere.center)),it.applyMatrix4(H.matrixWorld).applyMatrix4(J)),Array.isArray(Ht)){const Vt=zt.groups;for(let Kt=0,jt=Vt.length;Kt<jt;Kt++){const Xt=Vt[Kt],ye=Ht[Xt.materialIndex];ye&&ye.visible&&g.push(H,zt,ye,pt,it.z,Xt)}}else Ht.visible&&g.push(H,zt,Ht,pt,it.z,null)}}const Ft=H.children;for(let zt=0,Ht=Ft.length;zt<Ht;zt++)fe(Ft[zt],ct,pt,gt)}function Hn(H,ct,pt,gt){const mt=H.opaque,Ft=H.transmissive,zt=H.transparent;p.setupLightsView(pt),X===!0&&St.setGlobalState(M.clippingPlanes,pt),Ft.length>0&&Ue(mt,Ft,ct,pt),gt&&ot.viewport(T.copy(gt)),mt.length>0&&Ln(mt,ct,pt),Ft.length>0&&Ln(Ft,ct,pt),zt.length>0&&Ln(zt,ct,pt),ot.buffers.depth.setTest(!0),ot.buffers.depth.setMask(!0),ot.buffers.color.setMask(!0),ot.setPolygonOffset(!1)}function Ue(H,ct,pt,gt){if((pt.isScene===!0?pt.overrideMaterial:null)!==null)return;const Ft=st.isWebGL2;Y===null&&(Y=new Wi(1,1,{generateMipmaps:!0,type:$.has("EXT_color_buffer_half_float")?_o:ei,minFilter:Is,samples:Ft?4:0})),M.getDrawingBufferSize(et),Ft?Y.setSize(et.x,et.y):Y.setSize(ul(et.x),ul(et.y));const zt=M.getRenderTarget();M.setRenderTarget(Y),M.getClearColor(O),A=M.getClearAlpha(),A<1&&M.setClearColor(16777215,.5),M.clear();const Ht=M.toneMapping;M.toneMapping=ti,Ln(H,pt,gt),S.updateMultisampleRenderTarget(Y),S.updateRenderTargetMipmap(Y);let Vt=!1;for(let Kt=0,jt=ct.length;Kt<jt;Kt++){const Xt=ct[Kt],ye=Xt.object,nn=Xt.geometry,Ce=Xt.material,Vn=Xt.group;if(Ce.side===kn&&ye.layers.test(gt.layers)){const de=Ce.side;Ce.side=Xe,Ce.needsUpdate=!0,ai(ye,pt,gt,nn,Ce,Vn),Ce.side=de,Ce.needsUpdate=!0,Vt=!0}}Vt===!0&&(S.updateMultisampleRenderTarget(Y),S.updateRenderTargetMipmap(Y)),M.setRenderTarget(zt),M.setClearColor(O,A),M.toneMapping=Ht}function Ln(H,ct,pt){const gt=ct.isScene===!0?ct.overrideMaterial:null;for(let mt=0,Ft=H.length;mt<Ft;mt++){const zt=H[mt],Ht=zt.object,Vt=zt.geometry,Kt=gt===null?zt.material:gt,jt=zt.group;Ht.layers.test(pt.layers)&&ai(Ht,ct,pt,Vt,Kt,jt)}}function ai(H,ct,pt,gt,mt,Ft){H.onBeforeRender(M,ct,pt,gt,mt,Ft),H.modelViewMatrix.multiplyMatrices(pt.matrixWorldInverse,H.matrixWorld),H.normalMatrix.getNormalMatrix(H.modelViewMatrix),mt.onBeforeRender(M,ct,pt,gt,H,Ft),mt.transparent===!0&&mt.side===kn&&mt.forceSinglePass===!1?(mt.side=Xe,mt.needsUpdate=!0,M.renderBufferDirect(pt,ct,gt,mt,H,Ft),mt.side=wi,mt.needsUpdate=!0,M.renderBufferDirect(pt,ct,gt,mt,H,Ft),mt.side=kn):M.renderBufferDirect(pt,ct,gt,mt,H,Ft),H.onAfterRender(M,ct,pt,gt,mt,Ft)}function li(H,ct,pt){ct.isScene!==!0&&(ct=at);const gt=ut.get(H),mt=p.state.lights,Ft=p.state.shadowsArray,zt=mt.state.version,Ht=Mt.getParameters(H,mt.state,Ft,ct,pt),Vt=Mt.getProgramCacheKey(Ht);let Kt=gt.programs;gt.environment=H.isMeshStandardMaterial?ct.environment:null,gt.fog=ct.fog,gt.envMap=(H.isMeshStandardMaterial?Q:P).get(H.envMap||gt.environment),Kt===void 0&&(H.addEventListener("dispose",vt),Kt=new Map,gt.programs=Kt);let jt=Kt.get(Vt);if(jt!==void 0){if(gt.currentProgram===jt&&gt.lightsStateVersion===zt)return Ne(H,Ht),jt}else Ht.uniforms=Mt.getUniforms(H),H.onBuild(pt,Ht,M),H.onBeforeCompile(Ht,M),jt=Mt.acquireProgram(Ht,Vt),Kt.set(Vt,jt),gt.uniforms=Ht.uniforms;const Xt=gt.uniforms;return(!H.isShaderMaterial&&!H.isRawShaderMaterial||H.clipping===!0)&&(Xt.clippingPlanes=St.uniform),Ne(H,Ht),gt.needsLights=pn(H),gt.lightsStateVersion=zt,gt.needsLights&&(Xt.ambientLightColor.value=mt.state.ambient,Xt.lightProbe.value=mt.state.probe,Xt.directionalLights.value=mt.state.directional,Xt.directionalLightShadows.value=mt.state.directionalShadow,Xt.spotLights.value=mt.state.spot,Xt.spotLightShadows.value=mt.state.spotShadow,Xt.rectAreaLights.value=mt.state.rectArea,Xt.ltc_1.value=mt.state.rectAreaLTC1,Xt.ltc_2.value=mt.state.rectAreaLTC2,Xt.pointLights.value=mt.state.point,Xt.pointLightShadows.value=mt.state.pointShadow,Xt.hemisphereLights.value=mt.state.hemi,Xt.directionalShadowMap.value=mt.state.directionalShadowMap,Xt.directionalShadowMatrix.value=mt.state.directionalShadowMatrix,Xt.spotShadowMap.value=mt.state.spotShadowMap,Xt.spotLightMatrix.value=mt.state.spotLightMatrix,Xt.spotLightMap.value=mt.state.spotLightMap,Xt.pointShadowMap.value=mt.state.pointShadowMap,Xt.pointShadowMatrix.value=mt.state.pointShadowMatrix),gt.currentProgram=jt,gt.uniformsList=null,jt}function Ys(H){if(H.uniformsList===null){const ct=H.currentProgram.getUniforms();H.uniformsList=pr.seqWithValue(ct.seq,H.uniforms)}return H.uniformsList}function Ne(H,ct){const pt=ut.get(H);pt.outputColorSpace=ct.outputColorSpace,pt.batching=ct.batching,pt.instancing=ct.instancing,pt.instancingColor=ct.instancingColor,pt.skinning=ct.skinning,pt.morphTargets=ct.morphTargets,pt.morphNormals=ct.morphNormals,pt.morphColors=ct.morphColors,pt.morphTargetsCount=ct.morphTargetsCount,pt.numClippingPlanes=ct.numClippingPlanes,pt.numIntersection=ct.numClipIntersection,pt.vertexAlphas=ct.vertexAlphas,pt.vertexTangents=ct.vertexTangents,pt.toneMapping=ct.toneMapping}function Ge(H,ct,pt,gt,mt){ct.isScene!==!0&&(ct=at),S.resetTextureUnits();const Ft=ct.fog,zt=gt.isMeshStandardMaterial?ct.environment:null,Ht=b===null?M.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:oi,Vt=(gt.isMeshStandardMaterial?Q:P).get(gt.envMap||zt),Kt=gt.vertexColors===!0&&!!pt.attributes.color&&pt.attributes.color.itemSize===4,jt=!!pt.attributes.tangent&&(!!gt.normalMap||gt.anisotropy>0),Xt=!!pt.morphAttributes.position,ye=!!pt.morphAttributes.normal,nn=!!pt.morphAttributes.color;let Ce=ti;gt.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(Ce=M.toneMapping);const Vn=pt.morphAttributes.position||pt.morphAttributes.normal||pt.morphAttributes.color,de=Vn!==void 0?Vn.length:0,Zt=ut.get(gt),Jr=p.state.lights;if(X===!0&&(z===!0||H!==E)){const mn=H===E&&gt.id===D;St.setState(gt,H,mn)}let ge=!1;gt.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==Jr.state.version||Zt.outputColorSpace!==Ht||mt.isBatchedMesh&&Zt.batching===!1||!mt.isBatchedMesh&&Zt.batching===!0||mt.isInstancedMesh&&Zt.instancing===!1||!mt.isInstancedMesh&&Zt.instancing===!0||mt.isSkinnedMesh&&Zt.skinning===!1||!mt.isSkinnedMesh&&Zt.skinning===!0||mt.isInstancedMesh&&Zt.instancingColor===!0&&mt.instanceColor===null||mt.isInstancedMesh&&Zt.instancingColor===!1&&mt.instanceColor!==null||Zt.envMap!==Vt||gt.fog===!0&&Zt.fog!==Ft||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==St.numPlanes||Zt.numIntersection!==St.numIntersection)||Zt.vertexAlphas!==Kt||Zt.vertexTangents!==jt||Zt.morphTargets!==Xt||Zt.morphNormals!==ye||Zt.morphColors!==nn||Zt.toneMapping!==Ce||st.isWebGL2===!0&&Zt.morphTargetsCount!==de)&&(ge=!0):(ge=!0,Zt.__version=gt.version);let Ti=Zt.currentProgram;ge===!0&&(Ti=li(gt,ct,mt));let lc=!1,$s=!1,Qr=!1;const He=Ti.getUniforms(),Ai=Zt.uniforms;if(ot.useProgram(Ti.program)&&(lc=!0,$s=!0,Qr=!0),gt.id!==D&&(D=gt.id,$s=!0),lc||E!==H){He.setValue(W,"projectionMatrix",H.projectionMatrix),He.setValue(W,"viewMatrix",H.matrixWorldInverse);const mn=He.map.cameraPosition;mn!==void 0&&mn.setValue(W,it.setFromMatrixPosition(H.matrixWorld)),st.logarithmicDepthBuffer&&He.setValue(W,"logDepthBufFC",2/(Math.log(H.far+1)/Math.LN2)),(gt.isMeshPhongMaterial||gt.isMeshToonMaterial||gt.isMeshLambertMaterial||gt.isMeshBasicMaterial||gt.isMeshStandardMaterial||gt.isShaderMaterial)&&He.setValue(W,"isOrthographic",H.isOrthographicCamera===!0),E!==H&&(E=H,$s=!0,Qr=!0)}if(mt.isSkinnedMesh){He.setOptional(W,mt,"bindMatrix"),He.setOptional(W,mt,"bindMatrixInverse");const mn=mt.skeleton;mn&&(st.floatVertexTextures?(mn.boneTexture===null&&mn.computeBoneTexture(),He.setValue(W,"boneTexture",mn.boneTexture,S)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}mt.isBatchedMesh&&(He.setOptional(W,mt,"batchingTexture"),He.setValue(W,"batchingTexture",mt._matricesTexture,S));const ta=pt.morphAttributes;if((ta.position!==void 0||ta.normal!==void 0||ta.color!==void 0&&st.isWebGL2===!0)&&kt.update(mt,pt,Ti),($s||Zt.receiveShadow!==mt.receiveShadow)&&(Zt.receiveShadow=mt.receiveShadow,He.setValue(W,"receiveShadow",mt.receiveShadow)),gt.isMeshGouraudMaterial&&gt.envMap!==null&&(Ai.envMap.value=Vt,Ai.flipEnvMap.value=Vt.isCubeTexture&&Vt.isRenderTargetTexture===!1?-1:1),$s&&(He.setValue(W,"toneMappingExposure",M.toneMappingExposure),Zt.needsLights&&dn(Ai,Qr),Ft&&gt.fog===!0&&bt.refreshFogUniforms(Ai,Ft),bt.refreshMaterialUniforms(Ai,gt,k,C,Y),pr.upload(W,Ys(Zt),Ai,S)),gt.isShaderMaterial&&gt.uniformsNeedUpdate===!0&&(pr.upload(W,Ys(Zt),Ai,S),gt.uniformsNeedUpdate=!1),gt.isSpriteMaterial&&He.setValue(W,"center",mt.center),He.setValue(W,"modelViewMatrix",mt.modelViewMatrix),He.setValue(W,"normalMatrix",mt.normalMatrix),He.setValue(W,"modelMatrix",mt.matrixWorld),gt.isShaderMaterial||gt.isRawShaderMaterial){const mn=gt.uniformsGroups;for(let ea=0,Ud=mn.length;ea<Ud;ea++)if(st.isWebGL2){const cc=mn[ea];Tt.update(cc,Ti),Tt.bind(cc,Ti)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ti}function dn(H,ct){H.ambientLightColor.needsUpdate=ct,H.lightProbe.needsUpdate=ct,H.directionalLights.needsUpdate=ct,H.directionalLightShadows.needsUpdate=ct,H.pointLights.needsUpdate=ct,H.pointLightShadows.needsUpdate=ct,H.spotLights.needsUpdate=ct,H.spotLightShadows.needsUpdate=ct,H.rectAreaLights.needsUpdate=ct,H.hemisphereLights.needsUpdate=ct}function pn(H){return H.isMeshLambertMaterial||H.isMeshToonMaterial||H.isMeshPhongMaterial||H.isMeshStandardMaterial||H.isShadowMaterial||H.isShaderMaterial&&H.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(H,ct,pt){ut.get(H.texture).__webglTexture=ct,ut.get(H.depthTexture).__webglTexture=pt;const gt=ut.get(H);gt.__hasExternalTextures=!0,gt.__hasExternalTextures&&(gt.__autoAllocateDepthBuffer=pt===void 0,gt.__autoAllocateDepthBuffer||$.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),gt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(H,ct){const pt=ut.get(H);pt.__webglFramebuffer=ct,pt.__useDefaultFramebuffer=ct===void 0},this.setRenderTarget=function(H,ct=0,pt=0){b=H,y=ct,w=pt;let gt=!0,mt=null,Ft=!1,zt=!1;if(H){const Vt=ut.get(H);Vt.__useDefaultFramebuffer!==void 0?(ot.bindFramebuffer(W.FRAMEBUFFER,null),gt=!1):Vt.__webglFramebuffer===void 0?S.setupRenderTarget(H):Vt.__hasExternalTextures&&S.rebindTextures(H,ut.get(H.texture).__webglTexture,ut.get(H.depthTexture).__webglTexture);const Kt=H.texture;(Kt.isData3DTexture||Kt.isDataArrayTexture||Kt.isCompressedArrayTexture)&&(zt=!0);const jt=ut.get(H).__webglFramebuffer;H.isWebGLCubeRenderTarget?(Array.isArray(jt[ct])?mt=jt[ct][pt]:mt=jt[ct],Ft=!0):st.isWebGL2&&H.samples>0&&S.useMultisampledRTT(H)===!1?mt=ut.get(H).__webglMultisampledFramebuffer:Array.isArray(jt)?mt=jt[pt]:mt=jt,T.copy(H.viewport),L.copy(H.scissor),R=H.scissorTest}else T.copy(V).multiplyScalar(k).floor(),L.copy(K).multiplyScalar(k).floor(),R=Z;if(ot.bindFramebuffer(W.FRAMEBUFFER,mt)&&st.drawBuffers&&gt&&ot.drawBuffers(H,mt),ot.viewport(T),ot.scissor(L),ot.setScissorTest(R),Ft){const Vt=ut.get(H.texture);W.framebufferTexture2D(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,W.TEXTURE_CUBE_MAP_POSITIVE_X+ct,Vt.__webglTexture,pt)}else if(zt){const Vt=ut.get(H.texture),Kt=ct||0;W.framebufferTextureLayer(W.FRAMEBUFFER,W.COLOR_ATTACHMENT0,Vt.__webglTexture,pt||0,Kt)}D=-1},this.readRenderTargetPixels=function(H,ct,pt,gt,mt,Ft,zt){if(!(H&&H.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=ut.get(H).__webglFramebuffer;if(H.isWebGLCubeRenderTarget&&zt!==void 0&&(Ht=Ht[zt]),Ht){ot.bindFramebuffer(W.FRAMEBUFFER,Ht);try{const Vt=H.texture,Kt=Vt.format,jt=Vt.type;if(Kt!==Mn&&Rt.convert(Kt)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Xt=jt===_o&&($.has("EXT_color_buffer_half_float")||st.isWebGL2&&$.has("EXT_color_buffer_float"));if(jt!==ei&&Rt.convert(jt)!==W.getParameter(W.IMPLEMENTATION_COLOR_READ_TYPE)&&!(jt===vi&&(st.isWebGL2||$.has("OES_texture_float")||$.has("WEBGL_color_buffer_float")))&&!Xt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}ct>=0&&ct<=H.width-gt&&pt>=0&&pt<=H.height-mt&&W.readPixels(ct,pt,gt,mt,Rt.convert(Kt),Rt.convert(jt),Ft)}finally{const Vt=b!==null?ut.get(b).__webglFramebuffer:null;ot.bindFramebuffer(W.FRAMEBUFFER,Vt)}}},this.copyFramebufferToTexture=function(H,ct,pt=0){const gt=Math.pow(2,-pt),mt=Math.floor(ct.image.width*gt),Ft=Math.floor(ct.image.height*gt);S.setTexture2D(ct,0),W.copyTexSubImage2D(W.TEXTURE_2D,pt,0,0,H.x,H.y,mt,Ft),ot.unbindTexture()},this.copyTextureToTexture=function(H,ct,pt,gt=0){const mt=ct.image.width,Ft=ct.image.height,zt=Rt.convert(pt.format),Ht=Rt.convert(pt.type);S.setTexture2D(pt,0),W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,pt.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,pt.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,pt.unpackAlignment),ct.isDataTexture?W.texSubImage2D(W.TEXTURE_2D,gt,H.x,H.y,mt,Ft,zt,Ht,ct.image.data):ct.isCompressedTexture?W.compressedTexSubImage2D(W.TEXTURE_2D,gt,H.x,H.y,ct.mipmaps[0].width,ct.mipmaps[0].height,zt,ct.mipmaps[0].data):W.texSubImage2D(W.TEXTURE_2D,gt,H.x,H.y,zt,Ht,ct.image),gt===0&&pt.generateMipmaps&&W.generateMipmap(W.TEXTURE_2D),ot.unbindTexture()},this.copyTextureToTexture3D=function(H,ct,pt,gt,mt=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ft=H.max.x-H.min.x+1,zt=H.max.y-H.min.y+1,Ht=H.max.z-H.min.z+1,Vt=Rt.convert(gt.format),Kt=Rt.convert(gt.type);let jt;if(gt.isData3DTexture)S.setTexture3D(gt,0),jt=W.TEXTURE_3D;else if(gt.isDataArrayTexture||gt.isCompressedArrayTexture)S.setTexture2DArray(gt,0),jt=W.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}W.pixelStorei(W.UNPACK_FLIP_Y_WEBGL,gt.flipY),W.pixelStorei(W.UNPACK_PREMULTIPLY_ALPHA_WEBGL,gt.premultiplyAlpha),W.pixelStorei(W.UNPACK_ALIGNMENT,gt.unpackAlignment);const Xt=W.getParameter(W.UNPACK_ROW_LENGTH),ye=W.getParameter(W.UNPACK_IMAGE_HEIGHT),nn=W.getParameter(W.UNPACK_SKIP_PIXELS),Ce=W.getParameter(W.UNPACK_SKIP_ROWS),Vn=W.getParameter(W.UNPACK_SKIP_IMAGES),de=pt.isCompressedTexture?pt.mipmaps[mt]:pt.image;W.pixelStorei(W.UNPACK_ROW_LENGTH,de.width),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,de.height),W.pixelStorei(W.UNPACK_SKIP_PIXELS,H.min.x),W.pixelStorei(W.UNPACK_SKIP_ROWS,H.min.y),W.pixelStorei(W.UNPACK_SKIP_IMAGES,H.min.z),pt.isDataTexture||pt.isData3DTexture?W.texSubImage3D(jt,mt,ct.x,ct.y,ct.z,Ft,zt,Ht,Vt,Kt,de.data):pt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),W.compressedTexSubImage3D(jt,mt,ct.x,ct.y,ct.z,Ft,zt,Ht,Vt,de.data)):W.texSubImage3D(jt,mt,ct.x,ct.y,ct.z,Ft,zt,Ht,Vt,Kt,de),W.pixelStorei(W.UNPACK_ROW_LENGTH,Xt),W.pixelStorei(W.UNPACK_IMAGE_HEIGHT,ye),W.pixelStorei(W.UNPACK_SKIP_PIXELS,nn),W.pixelStorei(W.UNPACK_SKIP_ROWS,Ce),W.pixelStorei(W.UNPACK_SKIP_IMAGES,Vn),mt===0&&gt.generateMipmaps&&W.generateMipmap(jt),ot.unbindTexture()},this.initTexture=function(H){H.isCubeTexture?S.setTextureCube(H,0):H.isData3DTexture?S.setTexture3D(H,0):H.isDataArrayTexture||H.isCompressedArrayTexture?S.setTexture2DArray(H,0):S.setTexture2D(H,0),ot.unbindTexture()},this.resetState=function(){y=0,w=0,b=null,ot.reset(),G.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===zl?"display-p3":"srgb",e.unpackColorSpace=ie.workingColorSpace===Hr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Te?Hi:Hu}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Hi?Te:oi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Y_ extends hf{}Y_.prototype.isWebGL1Renderer=!0;class Vl{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=e,this.far=i}clone(){return new Vl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Ch extends Re{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class $_ extends $e{constructor(t=null,e=1,i=1,s,o,a,r,l,c=Oe,h=Oe,u,f){super(null,a,r,l,c,h,s,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class K_ extends $e{constructor(t,e,i,s,o,a,r,l,c){super(t,e,i,s,o,a,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),o+=i.distanceTo(s),e.push(o),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const i=this.getLengths();let s=0;const o=i.length;let a;e?a=e:a=t*i[o-1];let r=0,l=o-1,c;for(;r<=l;)if(s=Math.floor(r+(l-r)/2),c=i[s]-a,c<0)r=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(o-1);const h=i[s],f=i[s+1]-h,d=(a-h)/f;return(s+d)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const a=this.getPoint(s),r=this.getPoint(o),l=e||(a.isVector2?new Lt:new q);return l.copy(r).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e){const i=new q,s=[],o=[],a=[],r=new q,l=new ae;for(let d=0;d<=t;d++){const _=d/t;s[d]=this.getTangentAt(_,new q)}o[0]=new q,a[0]=new q;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),o[0].crossVectors(s[0],r),a[0].crossVectors(s[0],o[0]);for(let d=1;d<=t;d++){if(o[d]=o[d-1].clone(),a[d]=a[d-1].clone(),r.crossVectors(s[d-1],s[d]),r.length()>Number.EPSILON){r.normalize();const _=Math.acos(ze(s[d-1].dot(s[d]),-1,1));o[d].applyMatrix4(l.makeRotationAxis(r,_))}a[d].crossVectors(s[d],o[d])}if(e===!0){let d=Math.acos(ze(o[0].dot(o[t]),-1,1));d/=t,s[0].dot(r.crossVectors(o[0],o[t]))>0&&(d=-d);for(let _=1;_<=t;_++)o[_].applyMatrix4(l.makeRotationAxis(s[_],d*_)),a[_].crossVectors(s[_],o[_])}return{tangents:s,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Wl extends Bn{constructor(t=0,e=0,i=1,s=1,o=0,a=Math.PI*2,r=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=r,this.aRotation=l}getPoint(t,e){const i=e||new Lt,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(a?o=0:o=s),this.aClockwise===!0&&!a&&(o===s?o=-s:o=o-s);const r=this.aStartAngle+t*o;let l=this.aX+this.xRadius*Math.cos(r),c=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,d=c-this.aY;l=f*h-d*u+this.aX,c=f*u+d*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Z_ extends Wl{constructor(t,e,i,s,o,a){super(t,e,i,i,s,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function jl(){let n=0,t=0,e=0,i=0;function s(o,a,r,l){n=o,t=r,e=-3*o+3*a-2*r-l,i=2*o-2*a+r+l}return{initCatmullRom:function(o,a,r,l,c){s(a,r,c*(r-o),c*(l-a))},initNonuniformCatmullRom:function(o,a,r,l,c,h,u){let f=(a-o)/c-(r-o)/(c+h)+(r-a)/h,d=(r-a)/h-(l-a)/(h+u)+(l-r)/u;f*=h,d*=h,s(a,r,f,d)},calc:function(o){const a=o*o,r=a*o;return n+t*o+e*a+i*r}}}const Qo=new q,Da=new jl,Ia=new jl,ka=new jl;class J_ extends Bn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new q){const i=e,s=this.points,o=s.length,a=(o-(this.closed?0:1))*t;let r=Math.floor(a),l=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/o)+1)*o:l===0&&r===o-1&&(r=o-2,l=1);let c,h;this.closed||r>0?c=s[(r-1)%o]:(Qo.subVectors(s[0],s[1]).add(s[0]),c=Qo);const u=s[r%o],f=s[(r+1)%o];if(this.closed||r+2<o?h=s[(r+2)%o]:(Qo.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=Qo),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(u),d),g=Math.pow(u.distanceToSquared(f),d),p=Math.pow(f.distanceToSquared(h),d);g<1e-4&&(g=1),_<1e-4&&(_=g),p<1e-4&&(p=g),Da.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,_,g,p),Ia.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,_,g,p),ka.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,_,g,p)}else this.curveType==="catmullrom"&&(Da.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Ia.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),ka.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(Da.calc(l),Ia.calc(l),ka.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new q().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Dh(n,t,e,i,s){const o=(i-t)*.5,a=(s-e)*.5,r=n*n,l=n*r;return(2*e-2*i+o+a)*l+(-3*e+3*i-2*o-a)*r+o*n+e}function Q_(n,t){const e=1-n;return e*e*t}function tM(n,t){return 2*(1-n)*n*t}function eM(n,t){return n*n*t}function uo(n,t,e,i){return Q_(n,t)+tM(n,e)+eM(n,i)}function nM(n,t){const e=1-n;return e*e*e*t}function iM(n,t){const e=1-n;return 3*e*e*n*t}function sM(n,t){return 3*(1-n)*n*n*t}function oM(n,t){return n*n*n*t}function fo(n,t,e,i,s){return nM(n,t)+iM(n,e)+sM(n,i)+oM(n,s)}class uf extends Bn{constructor(t=new Lt,e=new Lt,i=new Lt,s=new Lt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Lt){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(fo(t,s.x,o.x,a.x,r.x),fo(t,s.y,o.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class rM extends Bn{constructor(t=new q,e=new q,i=new q,s=new q){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new q){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(fo(t,s.x,o.x,a.x,r.x),fo(t,s.y,o.y,a.y,r.y),fo(t,s.z,o.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ff extends Bn{constructor(t=new Lt,e=new Lt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Lt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Lt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class aM extends Bn{constructor(t=new q,e=new q){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new q){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new q){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class df extends Bn{constructor(t=new Lt,e=new Lt,i=new Lt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Lt){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(uo(t,s.x,o.x,a.x),uo(t,s.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lM extends Bn{constructor(t=new q,e=new q,i=new q){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new q){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(uo(t,s.x,o.x,a.x),uo(t,s.y,o.y,a.y),uo(t,s.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class pf extends Bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Lt){const i=e,s=this.points,o=(s.length-1)*t,a=Math.floor(o),r=o-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Dh(r,l.x,c.x,h.x,u.x),Dh(r,l.y,c.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Lt().fromArray(s))}return this}}var pl=Object.freeze({__proto__:null,ArcCurve:Z_,CatmullRomCurve3:J_,CubicBezierCurve:uf,CubicBezierCurve3:rM,EllipseCurve:Wl,LineCurve:ff,LineCurve3:aM,QuadraticBezierCurve:df,QuadraticBezierCurve3:lM,SplineCurve:pf});class cM extends Bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new pl[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=i){const a=s[o]-i,r=this.curves[o],l=r.getLength(),c=l===0?0:1-a/l;return r.getPointAt(c,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,o=this.curves;s<o.length;s++){const a=o[s],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(r);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new pl[s.type]().fromJSON(s))}return this}}class Ih extends cM{constructor(t){super(),this.type="Path",this.currentPoint=new Lt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new ff(this.currentPoint.clone(),new Lt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const o=new df(this.currentPoint.clone(),new Lt(t,e),new Lt(i,s));return this.curves.push(o),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,o,a){const r=new uf(this.currentPoint.clone(),new Lt(t,e),new Lt(i,s),new Lt(o,a));return this.curves.push(r),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new pf(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,o,a){const r=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+r,e+l,i,s,o,a),this}absarc(t,e,i,s,o,a){return this.absellipse(t,e,i,i,s,o,a),this}ellipse(t,e,i,s,o,a,r,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,s,o,a,r,l),this}absellipse(t,e,i,s,o,a,r,l){const c=new Wl(t,e,i,s,o,a,r,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class mf extends Ih{constructor(t){super(t),this.uuid=Hs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Ih().fromJSON(s))}return this}}const hM={triangulate:function(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let o=gf(n,0,s,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,l,c,h,u,f,d;if(i&&(o=mM(n,t,o,e)),n.length>80*e){r=c=n[0],l=h=n[1];for(let _=e;_<s;_+=e)u=n[_],f=n[_+1],u<r&&(r=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);d=Math.max(c-r,h-l),d=d!==0?32767/d:0}return Mo(o,a,e,r,l,d,0),a}};function gf(n,t,e,i,s){let o,a;if(s===TM(n,t,e,i)>0)for(o=t;o<e;o+=i)a=kh(o,n[o],n[o+1],a);else for(o=e-i;o>=t;o-=i)a=kh(o,n[o],n[o+1],a);return a&&Xr(a,a.next)&&(xo(a),a=a.next),a}function Xi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(Xr(e,e.next)||pe(e.prev,e,e.next)===0)){if(xo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Mo(n,t,e,i,s,o,a){if(!n)return;!a&&o&&xM(n,i,s,o);let r=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,o?fM(n,i,s,o):uM(n)){t.push(l.i/e|0),t.push(n.i/e|0),t.push(c.i/e|0),xo(n),n=c.next,r=c.next;continue}if(n=c,n===r){a?a===1?(n=dM(Xi(n),t,e),Mo(n,t,e,i,s,o,2)):a===2&&pM(n,t,e,i,s,o):Mo(Xi(n),t,e,i,s,o,1);break}}}function uM(n){const t=n.prev,e=n,i=n.next;if(pe(t,e,i)>=0)return!1;const s=t.x,o=e.x,a=i.x,r=t.y,l=e.y,c=i.y,h=s<o?s<a?s:a:o<a?o:a,u=r<l?r<c?r:c:l<c?l:c,f=s>o?s>a?s:a:o>a?o:a,d=r>l?r>c?r:c:l>c?l:c;let _=i.next;for(;_!==t;){if(_.x>=h&&_.x<=f&&_.y>=u&&_.y<=d&&ys(s,r,o,l,a,c,_.x,_.y)&&pe(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function fM(n,t,e,i){const s=n.prev,o=n,a=n.next;if(pe(s,o,a)>=0)return!1;const r=s.x,l=o.x,c=a.x,h=s.y,u=o.y,f=a.y,d=r<l?r<c?r:c:l<c?l:c,_=h<u?h<f?h:f:u<f?u:f,g=r>l?r>c?r:c:l>c?l:c,p=h>u?h>f?h:f:u>f?u:f,m=ml(d,_,t,e,i),v=ml(g,p,t,e,i);let M=n.prevZ,x=n.nextZ;for(;M&&M.z>=m&&x&&x.z<=v;){if(M.x>=d&&M.x<=g&&M.y>=_&&M.y<=p&&M!==s&&M!==a&&ys(r,h,l,u,c,f,M.x,M.y)&&pe(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=d&&x.x<=g&&x.y>=_&&x.y<=p&&x!==s&&x!==a&&ys(r,h,l,u,c,f,x.x,x.y)&&pe(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=m;){if(M.x>=d&&M.x<=g&&M.y>=_&&M.y<=p&&M!==s&&M!==a&&ys(r,h,l,u,c,f,M.x,M.y)&&pe(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=v;){if(x.x>=d&&x.x<=g&&x.y>=_&&x.y<=p&&x!==s&&x!==a&&ys(r,h,l,u,c,f,x.x,x.y)&&pe(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function dM(n,t,e){let i=n;do{const s=i.prev,o=i.next.next;!Xr(s,o)&&_f(s,i,i.next,o)&&vo(s,o)&&vo(o,s)&&(t.push(s.i/e|0),t.push(i.i/e|0),t.push(o.i/e|0),xo(i),xo(i.next),i=n=o),i=i.next}while(i!==n);return Xi(i)}function pM(n,t,e,i,s,o){let a=n;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&wM(a,r)){let l=Mf(a,r);a=Xi(a,a.next),l=Xi(l,l.next),Mo(a,t,e,i,s,o,0),Mo(l,t,e,i,s,o,0);return}r=r.next}a=a.next}while(a!==n)}function mM(n,t,e,i){const s=[];let o,a,r,l,c;for(o=0,a=t.length;o<a;o++)r=t[o]*i,l=o<a-1?t[o+1]*i:n.length,c=gf(n,r,l,i,!1),c===c.next&&(c.steiner=!0),s.push(bM(c));for(s.sort(gM),o=0;o<s.length;o++)e=_M(s[o],e);return e}function gM(n,t){return n.x-t.x}function _M(n,t){const e=MM(n,t);if(!e)return t;const i=Mf(e,n);return Xi(i,i.next),Xi(e,e.next)}function MM(n,t){let e=t,i=-1/0,s;const o=n.x,a=n.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const f=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>i&&(i=f,s=e.x<e.next.x?e:e.next,f===o))return s}e=e.next}while(e!==t);if(!s)return null;const r=s,l=s.x,c=s.y;let h=1/0,u;e=s;do o>=e.x&&e.x>=l&&o!==e.x&&ys(a<c?o:i,a,l,c,a<c?i:o,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(o-e.x),vo(e,n)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&vM(s,e)))&&(s=e,h=u)),e=e.next;while(e!==r);return s}function vM(n,t){return pe(n.prev,n,t.prev)<0&&pe(t.next,n,n.next)<0}function xM(n,t,e,i){let s=n;do s.z===0&&(s.z=ml(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,yM(s)}function yM(n){let t,e,i,s,o,a,r,l,c=1;do{for(e=n,n=null,o=null,a=0;e;){for(a++,i=e,r=0,t=0;t<c&&(r++,i=i.nextZ,!!i);t++);for(l=c;r>0||l>0&&i;)r!==0&&(l===0||!i||e.z<=i.z)?(s=e,e=e.nextZ,r--):(s=i,i=i.nextZ,l--),o?o.nextZ=s:n=s,s.prevZ=o,o=s;e=i}o.nextZ=null,c*=2}while(a>1);return n}function ml(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function bM(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function ys(n,t,e,i,s,o,a,r){return(s-a)*(t-r)>=(n-a)*(o-r)&&(n-a)*(i-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(s-a)*(i-r)}function wM(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!SM(n,t)&&(vo(n,t)&&vo(t,n)&&EM(n,t)&&(pe(n.prev,n,t.prev)||pe(n,t.prev,t))||Xr(n,t)&&pe(n.prev,n,n.next)>0&&pe(t.prev,t,t.next)>0)}function pe(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function Xr(n,t){return n.x===t.x&&n.y===t.y}function _f(n,t,e,i){const s=er(pe(n,t,e)),o=er(pe(n,t,i)),a=er(pe(e,i,n)),r=er(pe(e,i,t));return!!(s!==o&&a!==r||s===0&&tr(n,e,t)||o===0&&tr(n,i,t)||a===0&&tr(e,n,i)||r===0&&tr(e,t,i))}function tr(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function er(n){return n>0?1:n<0?-1:0}function SM(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&_f(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function vo(n,t){return pe(n.prev,n,n.next)<0?pe(n,t,n.next)>=0&&pe(n,n.prev,t)>=0:pe(n,t,n.prev)<0||pe(n,n.next,t)<0}function EM(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,o=(n.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Mf(n,t){const e=new gl(n.i,n.x,n.y),i=new gl(t.i,t.x,t.y),s=n.next,o=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,o.next=i,i.prev=o,i}function kh(n,t,e,i){const s=new gl(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function xo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function gl(n,t,e){this.i=n,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function TM(n,t,e,i){let s=0;for(let o=t,a=e-i;o<e;o+=i)s+=(n[a]-n[o])*(n[o+1]+n[a+1]),a=o;return s}class As{static area(t){const e=t.length;let i=0;for(let s=e-1,o=0;o<e;s=o++)i+=t[s].x*t[o].y-t[o].x*t[s].y;return i*.5}static isClockWise(t){return As.area(t)<0}static triangulateShape(t,e){const i=[],s=[],o=[];Uh(t),Nh(i,t);let a=t.length;e.forEach(Uh);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Nh(i,e[l]);const r=hM.triangulate(i,s);for(let l=0;l<r.length;l+=3)o.push(r.slice(l,l+3));return o}}function Uh(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Nh(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class ql extends Ze{constructor(t=new mf([new Lt(.5,.5),new Lt(-.5,.5),new Lt(-.5,-.5),new Lt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],o=[];for(let r=0,l=t.length;r<l;r++){const c=t[r];a(c)}this.setAttribute("position",new xe(s,3)),this.setAttribute("uv",new xe(o,2)),this.computeVertexNormals();function a(r){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,_=e.bevelSize!==void 0?e.bevelSize:d-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:AM;let M,x=!1,y,w,b,D;m&&(M=m.getSpacedPoints(h),x=!0,f=!1,y=m.computeFrenetFrames(h,!1),w=new q,b=new q,D=new q),f||(p=0,d=0,_=0,g=0);const E=r.extractPoints(c);let T=E.shape;const L=E.holes;if(!As.isClockWise(T)){T=T.reverse();for(let W=0,j=L.length;W<j;W++){const $=L[W];As.isClockWise($)&&(L[W]=$.reverse())}}const O=As.triangulateShape(T,L),A=T;for(let W=0,j=L.length;W<j;W++){const $=L[W];T=T.concat($)}function I(W,j,$){return j||console.error("THREE.ExtrudeGeometry: vec does not exist"),W.clone().addScaledVector(j,$)}const C=T.length,k=O.length;function N(W,j,$){let st,ot,wt;const ut=W.x-j.x,S=W.y-j.y,P=$.x-W.x,Q=$.y-W.y,ft=ut*ut+S*S,rt=ut*Q-S*P;if(Math.abs(rt)>Number.EPSILON){const dt=Math.sqrt(ft),Mt=Math.sqrt(P*P+Q*Q),bt=j.x-S/dt,xt=j.y+ut/dt,yt=$.x-Q/Mt,St=$.y+P/Mt,ht=((yt-bt)*Q-(St-xt)*P)/(ut*Q-S*P);st=bt+ut*ht-W.x,ot=xt+S*ht-W.y;const At=st*st+ot*ot;if(At<=2)return new Lt(st,ot);wt=Math.sqrt(At/2)}else{let dt=!1;ut>Number.EPSILON?P>Number.EPSILON&&(dt=!0):ut<-Number.EPSILON?P<-Number.EPSILON&&(dt=!0):Math.sign(S)===Math.sign(Q)&&(dt=!0),dt?(st=-S,ot=ut,wt=Math.sqrt(ft)):(st=ut,ot=S,wt=Math.sqrt(ft/2))}return new Lt(st/wt,ot/wt)}const F=[];for(let W=0,j=A.length,$=j-1,st=W+1;W<j;W++,$++,st++)$===j&&($=0),st===j&&(st=0),F[W]=N(A[W],A[$],A[st]);const V=[];let K,Z=F.concat();for(let W=0,j=L.length;W<j;W++){const $=L[W];K=[];for(let st=0,ot=$.length,wt=ot-1,ut=st+1;st<ot;st++,wt++,ut++)wt===ot&&(wt=0),ut===ot&&(ut=0),K[st]=N($[st],$[wt],$[ut]);V.push(K),Z=Z.concat(K)}for(let W=0;W<p;W++){const j=W/p,$=d*Math.cos(j*Math.PI/2),st=_*Math.sin(j*Math.PI/2)+g;for(let ot=0,wt=A.length;ot<wt;ot++){const ut=I(A[ot],F[ot],st);J(ut.x,ut.y,-$)}for(let ot=0,wt=L.length;ot<wt;ot++){const ut=L[ot];K=V[ot];for(let S=0,P=ut.length;S<P;S++){const Q=I(ut[S],K[S],st);J(Q.x,Q.y,-$)}}}const U=_+g;for(let W=0;W<C;W++){const j=f?I(T[W],Z[W],U):T[W];x?(b.copy(y.normals[0]).multiplyScalar(j.x),w.copy(y.binormals[0]).multiplyScalar(j.y),D.copy(M[0]).add(b).add(w),J(D.x,D.y,D.z)):J(j.x,j.y,0)}for(let W=1;W<=h;W++)for(let j=0;j<C;j++){const $=f?I(T[j],Z[j],U):T[j];x?(b.copy(y.normals[W]).multiplyScalar($.x),w.copy(y.binormals[W]).multiplyScalar($.y),D.copy(M[W]).add(b).add(w),J(D.x,D.y,D.z)):J($.x,$.y,u/h*W)}for(let W=p-1;W>=0;W--){const j=W/p,$=d*Math.cos(j*Math.PI/2),st=_*Math.sin(j*Math.PI/2)+g;for(let ot=0,wt=A.length;ot<wt;ot++){const ut=I(A[ot],F[ot],st);J(ut.x,ut.y,u+$)}for(let ot=0,wt=L.length;ot<wt;ot++){const ut=L[ot];K=V[ot];for(let S=0,P=ut.length;S<P;S++){const Q=I(ut[S],K[S],st);x?J(Q.x,Q.y+M[h-1].y,M[h-1].x+$):J(Q.x,Q.y,u+$)}}}X(),z();function X(){const W=s.length/3;if(f){let j=0,$=C*j;for(let st=0;st<k;st++){const ot=O[st];et(ot[2]+$,ot[1]+$,ot[0]+$)}j=h+p*2,$=C*j;for(let st=0;st<k;st++){const ot=O[st];et(ot[0]+$,ot[1]+$,ot[2]+$)}}else{for(let j=0;j<k;j++){const $=O[j];et($[2],$[1],$[0])}for(let j=0;j<k;j++){const $=O[j];et($[0]+C*h,$[1]+C*h,$[2]+C*h)}}i.addGroup(W,s.length/3-W,0)}function z(){const W=s.length/3;let j=0;Y(A,j),j+=A.length;for(let $=0,st=L.length;$<st;$++){const ot=L[$];Y(ot,j),j+=ot.length}i.addGroup(W,s.length/3-W,1)}function Y(W,j){let $=W.length;for(;--$>=0;){const st=$;let ot=$-1;ot<0&&(ot=W.length-1);for(let wt=0,ut=h+p*2;wt<ut;wt++){const S=C*wt,P=C*(wt+1),Q=j+st+S,ft=j+ot+S,rt=j+ot+P,dt=j+st+P;it(Q,ft,rt,dt)}}}function J(W,j,$){l.push(W),l.push(j),l.push($)}function et(W,j,$){at(W),at(j),at($);const st=s.length/3,ot=v.generateTopUV(i,s,st-3,st-2,st-1);_t(ot[0]),_t(ot[1]),_t(ot[2])}function it(W,j,$,st){at(W),at(j),at(st),at(j),at($),at(st);const ot=s.length/3,wt=v.generateSideWallUV(i,s,ot-6,ot-3,ot-2,ot-1);_t(wt[0]),_t(wt[1]),_t(wt[3]),_t(wt[1]),_t(wt[2]),_t(wt[3])}function at(W){s.push(l[W*3+0]),s.push(l[W*3+1]),s.push(l[W*3+2])}function _t(W){o.push(W.x),o.push(W.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return RM(e,i,t)}static fromJSON(t,e){const i=[];for(let o=0,a=t.shapes.length;o<a;o++){const r=e[t.shapes[o]];i.push(r)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new pl[s.type]().fromJSON(s)),new ql(i,t.options)}}const AM={generateTopUV:function(n,t,e,i,s){const o=t[e*3],a=t[e*3+1],r=t[i*3],l=t[i*3+1],c=t[s*3],h=t[s*3+1];return[new Lt(o,a),new Lt(r,l),new Lt(c,h)]},generateSideWallUV:function(n,t,e,i,s,o){const a=t[e*3],r=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],u=t[i*3+2],f=t[s*3],d=t[s*3+1],_=t[s*3+2],g=t[o*3],p=t[o*3+1],m=t[o*3+2];return Math.abs(r-h)<Math.abs(a-c)?[new Lt(a,1-l),new Lt(c,1-u),new Lt(f,1-_),new Lt(g,1-m)]:[new Lt(r,1-l),new Lt(h,1-u),new Lt(d,1-_),new Lt(p,1-m)]}};function RM(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const o=n[i];e.shapes.push(o.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Rr extends Ze{constructor(t=1,e=32,i=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+r,Math.PI);let c=0;const h=[],u=new q,f=new q,d=[],_=[],g=[],p=[];for(let m=0;m<=i;m++){const v=[],M=m/i;let x=0;m===0&&a===0?x=.5/e:m===i&&l===Math.PI&&(x=-.5/e);for(let y=0;y<=e;y++){const w=y/e;u.x=-t*Math.cos(s+w*o)*Math.sin(a+M*r),u.y=t*Math.cos(a+M*r),u.z=t*Math.sin(s+w*o)*Math.sin(a+M*r),_.push(u.x,u.y,u.z),f.copy(u).normalize(),g.push(f.x,f.y,f.z),p.push(w+x,1-M),v.push(c++)}h.push(v)}for(let m=0;m<i;m++)for(let v=0;v<e;v++){const M=h[m][v+1],x=h[m][v],y=h[m+1][v],w=h[m+1][v+1];(m!==0||a>0)&&d.push(M,x,w),(m!==i-1||l<Math.PI)&&d.push(x,y,w)}this.setIndex(d),this.setAttribute("position",new xe(_,3)),this.setAttribute("normal",new xe(g,3)),this.setAttribute("uv",new xe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class mr extends Ro{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vu,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Xl extends Re{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class PM extends Xl{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ua=new ae,Fh=new q,Oh=new q;class vf{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Gl,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new Ie(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Fh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Fh),Oh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Oh),e.updateMatrixWorld(),Ua.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ua),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ua)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class LM extends vf{constructor(){super(new an(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,i=Tr*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,o=t.distance||e.far;(i!==e.fov||s!==e.aspect||o!==e.far)&&(e.fov=i,e.aspect=s,e.far=o,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class zh extends Xl{constructor(t,e,i=0,s=Math.PI/3,o=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.distance=i,this.angle=s,this.penumbra=o,this.decay=a,this.map=null,this.shadow=new LM}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class CM extends vf{constructor(){super(new nf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class DM extends Xl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new CM}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Bh{constructor(t=1,e=0,i=0){return this.radius=t,this.phi=e,this.theta=i,this}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(ze(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fl);const Br=class Br{constructor({cols:t,rows:e,widthMM:i,heightMM:s,ppmm:o,data:a,groove:r,cavity:l}){this.width=t,this.height=e,this.widthMM=i,this.heightMM=s,this.ppmm=o,this.data=a,this.groove=r||null,this.cavityOpts={small:.8,large:4,kSmall:.3,kLarge:.9,kEdge:.12,...l};let c=1/0,h=-1/0;for(let u=0;u<a.length;u++){const f=a[u];f<c&&(c=f),f>h&&(h=f)}h-c<1e-6&&(h=c+1e-6),this.min=c,this.max=h,this._tex={},this._macro=new Map,this._channels=null}sample(t,e){return Hh(this.data,this.width,this.height,t,e)}get heightTexture(){if(!this._tex.height){const{data:t,min:e,max:i}=this,s=t.length,o=new Uint8Array(s*4),a=255/(i-e);for(let r=0;r<s;r++){const l=(t[r]-e)*a;o[r*4]=o[r*4+1]=o[r*4+2]=l,o[r*4+3]=255}this._tex.height=this._texture(o)}return this._tex.height}get normalTexture(){if(!this._tex.normal){const{data:t,width:e,height:i,ppmm:s}=this,o=new Uint8Array(e*i*4),a=s/8;for(let r=0;r<i;r++){const l=r>0?r-1:0,c=r<i-1?r+1:i-1;for(let h=0;h<e;h++){const u=h>0?h-1:0,f=h<e-1?h+1:e-1,d=t[l*e+u],_=t[l*e+h],g=t[l*e+f],p=t[r*e+u],m=t[r*e+f],v=t[c*e+u],M=t[c*e+h],x=t[c*e+f],y=(g+2*m+x-d-2*p-v)*a,w=(v+2*M+x-d-2*_-g)*a,b=1/Math.sqrt(y*y+w*w+1),D=(r*e+h)*4;o[D]=(.5-.5*y*b)*255+.5,o[D+1]=(.5-.5*w*b)*255+.5,o[D+2]=(.5+.5*b)*255+.5,o[D+3]=255}}this._tex.normal=this._texture(o)}return this._tex.normal}get dataTexture(){if(!this._tex.data){const{height01:t,cavity:e,edge:i,groove:s}=this.channels(),o=t.length,a=new Uint8Array(o*4);for(let r=0;r<o;r++)a[r*4]=t[r]*255+.5,a[r*4+1]=e[r]*255+.5,a[r*4+2]=i[r]*255+.5,a[r*4+3]=s[r]*255+.5;this._tex.data=this._texture(a)}return this._tex.data}channels(){if(this._channels)return this._channels;const{data:t,width:e,height:i,ppmm:s,min:o,max:a}=this,r=this.cavityOpts,l=e*i,c=gr(t,e,i,Math.max(1,Math.round(r.small*s))),h=gr(t,e,i,Math.max(1,Math.round(r.large*s))),u=new Float32Array(l),f=new Float32Array(l),d=new Float32Array(l),_=new Float32Array(l),g=1/(a-o);for(let p=0;p<l;p++){const m=t[p];u[p]=(m-o)*g;const v=m-c[p],M=m-h[p];f[p]=Gh(1-Math.max(0,-v)/r.kSmall-Math.max(0,-M)/r.kLarge),d[p]=Gh(v/r.kEdge),_[p]=this.groove?this.groove[p]:0}return this._channels={height01:u,cavity:f,edge:d,groove:_},this._channels}macro(t){const e=t.toFixed(3);let i=this._macro.get(e);if(i)return i;const{data:s,width:o,height:a,ppmm:r}=this,l=Math.max(1,Math.round(t*r)),c=Math.max(2,Math.ceil(o/l)),h=Math.max(2,Math.ceil(a/l));let u=new Float32Array(c*h);for(let f=0;f<h;f++)for(let d=0;d<c;d++){let _=0,g=0;const p=Math.min(a,(f+1)*l),m=Math.min(o,(d+1)*l);for(let v=f*l;v<p;v++)for(let M=d*l;M<m;M++)_+=s[v*o+M],g++;u[f*c+d]=_/g}return l>1&&(u=gr(u,c,h,1,1)),i={cols:c,rows:h,sizeMM:t,data:u,sample:(f,d)=>Hh(u,c,h,f,d)},this._macro.set(e,i),i}setAnisotropy(t){for(const e of Object.values(this._tex))e.anisotropy=t,e.needsUpdate=!0}dispose(){for(const t of Object.values(this._tex))t.dispose();this._tex={}}_texture(t){const e=new $_(t,this.width,this.height,Mn,ei);return e.colorSpace=ln,e.wrapS=e.wrapT=_n,e.magFilter=rn,e.minFilter=Is,e.generateMipmaps=!0,e.anisotropy=Br.anisotropy,e.needsUpdate=!0,e}};Lo(Br,"anisotropy",4);let yo=Br;function xf(n,t={}){return new yo({cols:n.cols,rows:n.rows,widthMM:n.width,heightMM:n.height,ppmm:n.ppmm,data:Float32Array.from(n.field),groove:Float32Array.from(n.groove),cavity:t.cavity})}function Gh(n){return n<0?0:n>1?1:n}function Hh(n,t,e,i,s){const o=Math.min(Math.max(i*t-.5,0),t-1),a=Math.min(Math.max(s*e-.5,0),e-1),r=Math.floor(o),l=Math.floor(a),c=Math.min(r+1,t-1),h=Math.min(l+1,e-1),u=o-r,f=a-l,d=n[l*t+r]+(n[l*t+c]-n[l*t+r])*u,_=n[h*t+r]+(n[h*t+c]-n[h*t+r])*u;return d+(_-d)*f}function gr(n,t,e,i,s=3){let o=Float32Array.from(n),a=new Float32Array(n.length);const r=new Float32Array(Math.max(t,e));for(let l=0;l<s;l++)IM(o,a,t,e,i,r),kM(a,o,t,e,i,r);return o}function IM(n,t,e,i,s,o){const a=1/(2*s+1);for(let r=0;r<i;r++){const l=r*e;let c=n[l]*(s+1);for(let h=1;h<=s;h++)c+=n[l+Math.min(h,e-1)];for(let h=0;h<e;h++)o[h]=c*a,c+=n[l+Math.min(h+s+1,e-1)]-n[l+Math.max(h-s,0)];t.set(o.subarray(0,e),l)}}function kM(n,t,e,i,s,o){const a=1/(2*s+1);for(let r=0;r<e;r++){let l=n[r]*(s+1);for(let c=1;c<=s;c++)l+=n[Math.min(c,i-1)*e+r];for(let c=0;c<i;c++)o[c]=l*a,l+=n[Math.min(c+s+1,i-1)*e+r]-n[Math.max(c-s,0)*e+r];for(let c=0;c<i;c++)t[c*e+r]=o[c]}}const Yl={pitch:1.3,line:.5,cell:"auto",turns:"auto",roundness:.15,jitter:.08,mode:"sunk",depth:.4,fillers:!0,pairs:.75,hand:"alternate",eyes:0,echo:0,follow:1,seed:0};function yf(n={}){const t={...Yl,...n},e=t.pitch;let[i,s]=t.cell==="auto"||!t.cell?[4.2*e,7.8*e]:t.cell;return typeof t.turns=="number"&&(s=Math.min(s,(2*t.turns+1.2)*e)),i=Math.max(i,3*e),s=Math.max(s,i),t.cell=[i,s],t}function Si(n,t={},e={}){const i=ir(),s=yf(e),o=t.rect??{x:0,y:0,w:n.width,h:n.height},a=n.rng.fork(`leiwen:${s.seed}:${nr(o.x)},${nr(o.y)},${nr(o.w)},${nr(o.h)}`),r=NM(n,o,t,s);s.debugOut&&(s.debugOut.gridMs=ir()-i);const l=[];r&&s.echo>0&&OM(r,s,l),r&&s.fillers&&zM(r,s,l);const c=r?FM(r,s,a):[];if(s.debugOut)for(const f of c)s.debugOut.push(f);const h={cells:c.length,spirals:0,pairs:0,fillers:0,ms:0,planMs:0};for(const f of c){if(s.debugCells){const d=(_,g)=>[f.ax+_*f.ux+g*f.vx,f.ay+_*f.uy+g*f.vy];l.push({pts:[d(f.u0,f.v0),d(f.u1,f.v0),d(f.u1,f.v1),d(f.u0,f.v1),d(f.u0,f.v0)],radius:0})}s.debugCells!==!0&&GM(f,s,a,l,h)}const u=ir();return l.length&&WM(n,l,s),h.planMs=Math.round(u-i),h.ms=Math.round(ir()-i),h}function Yr(n,t,e={},{rect:i,margin:s=.5,level:o,avoid:a=null}={}){const r=typeof t=="function"?n.mask(t):t;let l=o;l===void 0&&(r!=null&&r.data)&&(l=jM(n,r.data));const c=e.pitch??Yl.pitch,h=i??(r!=null&&r.data?UM(n,r.data,s+2*c):void 0);return h===null?{cells:0,spirals:0,pairs:0,fillers:0,ms:0,planMs:0}:Si(n,{rect:h,include:r,level:l,avoid:a,margin:s},e)}function UM(n,t,e){const{cols:i,rows:s,ppmm:o}=n;let a=i,r=-1,l=s,c=-1;for(let _=0;_<s;_++){const g=_*i;for(let p=0;p<i;p++)t[g+p]<.5||(p<a&&(a=p),p>r&&(r=p),_<l&&(l=_),_>c&&(c=_))}if(r<0)return null;const h=Math.max(0,a/o-e),u=Math.max(0,l/o-e),f=Math.min(n.width,(r+1)/o+e),d=Math.min(n.height,(c+1)/o+e);return{x:h,y:u,w:f-h,h:d-u}}function NM(n,t,e,i){const s=i.pitch;let o=Math.max(s/3,1/n.ppmm);const a=32e5;t.w/o*(t.h/o)>a&&(o=Math.sqrt(t.w*t.h/a));const r=Math.ceil(t.w/o)+2,l=Math.ceil(t.h/o)+2,c=t.x-o,h=t.y-o,u=r*l,f=new Uint8Array(u);for(let F=0;F<l;F++)for(let V=0;V<r;V++)(V===0||F===0||V===r-1||F===l-1)&&(f[F*r+V]=1);const{cols:d,rows:_,ppmm:g,field:p}=n,m=F=>typeof F=="function"?n.mask(F).data:F&&F.data?F.data:null,v=e.avoid===void 0?e.level!=null?null:"raised":e.avoid,M=v==="raised"?null:m(v),x=v==="raised",y=m(e.include),w=e.level,b=w==null?0:.04+.03*Math.abs(w),D=Math.max(0,Math.floor(t.x*g)),E=Math.min(d,Math.ceil((t.x+t.w)*g)),T=Math.max(0,Math.floor(t.y*g)),L=Math.min(_,Math.ceil((t.y+t.h)*g)),R=new Int32Array(E-D);for(let F=D;F<E;F++)R[F-D]=Math.min(r-2,Math.max(1,Math.floor(((F+.5)/g-c)/o)));let O=0;for(let F=T;F<L;F++){const K=Math.min(l-2,Math.max(1,Math.floor(((F+.5)/g-h)/o)))*r,Z=F*d;for(let U=D;U<E;U++){const X=Z+U;let z=!1;x?z=p[X]>.05:M&&(z=M[X]>.5),!z&&y&&(z=y[X]<.5),!z&&w!=null&&(z=Math.abs(p[X]-w)>b),z&&(f[K+R[U-D]]=1)}}const A=new Uint8Array(f);for(let F=0;F<l;F++)for(let V=0;V<r;V++)(V===0||F===0||V===r-1||F===l-1)&&(A[F*r+V]=0);const I=si(f,r,l),C=s*(.5-i.line/2),k=Math.max(0,(e.margin??.6)-C)/o+.3,N=k*k;for(let F=0;F<u;F++)I.dist2[F]<=N&&(f[F]=1);for(let F=0;F<u;F++)f[F]||O++;return O<9?null:{gw:r,gh:l,h:o,ox:c,oy:h,blocked:f,hit:A,m:k,nf:I}}function FM(n,t,e){const{gw:i,gh:s,h:o,ox:a,oy:r,blocked:l}=n,c=i*s,h=t.pitch,[u,f]=t.cell;let d;if(n.dirty)d=si(l,i,s);else{const j=new Float32Array(c);for(let $=0;$<c;$++){const st=Math.sqrt(n.nf.dist2[$])-n.m;j[$]=st>0?st*st:0}d={dist2:j,nearest:n.nf.nearest}}const _=new Float32Array(c),g=new Float32Array(c),p=new Float32Array(c),m=new Float32Array(c),v=new Float32Array(c);for(let j=0;j<c;j++)v[j]=Math.sqrt(d.dist2[j]);for(let j=0;j<c;j++){if(l[j])continue;const $=d.nearest[j];if($<0)continue;const st=j%i,ot=j/i|0;let wt=st-$%i,ut=ot-($/i|0);const S=Math.hypot(wt,ut)||1;if(st>1&&ot>1&&st<i-2&&ot<s-2){const rt=v[j+2]-v[j-2],dt=v[j+2*i]-v[j-2*i];Math.hypot(rt,dt)>1.2&&(wt=rt,ut=dt)}const P=Math.hypot(wt,ut)||1;p[j]=wt/P,m[j]=ut/P;const Q=4*Math.atan2(ut,wt),ft=Math.exp(-S*o/(3*h));_[j]=Math.cos(Q)*ft,g[j]=Math.sin(Q)*ft}const M=new Float32Array(c);for(let j=0;j<c;j++)l[j]||(M[j]=Math.hypot(_[j],g[j]));const x=_,y=g,w=Math.max(2,Math.round(u*.5/o));Na(x,i,s,w,l),Na(y,i,s,w,l),Na(M,i,s,w,l);const b=Math.max(0,Math.min(1,t.follow)),D=j=>{const $=M[j]>1e-6?Math.hypot(x[j],y[j])/M[j]:1,st=Math.max(0,Math.min(1,($-.8)/.13));return b*st*Math.atan2(y[j],x[j])/4},E=new Uint8Array(l),T=new Int32Array(c).fill(-1),L=new Uint8Array(c),R=[],O=(j,$)=>{const st=Math.floor((j-a)/o),ot=Math.floor(($-r)/o);return st<0||ot<0||st>=i||ot>=s?-1:ot*i+st},A=(j,$)=>{const st=O(j,$);return st>=0&&E[st]===0},I=o*.7,C=(j,$,st,ot)=>{const wt=Math.hypot(st-j,ot-$),ut=Math.max(1,Math.ceil(wt/I));for(let S=0;S<=ut;S++){const P=S/ut;if(!A(j+(st-j)*P,$+(ot-$)*P))return!1}return!0},k=(j,$,st,ot,wt,[ut,S],P,Q=0)=>{let ft=Math.cos(st),rt=Math.sin(st),dt=-2,Mt=[ft,rt];for(let B=0;B<4;B++){const lt=-rt,vt=ft,Et=lt*ot+vt*wt;Et>dt&&(dt=Et,Mt=[ft,rt]);const Pt=ft;ft=-rt,rt=Pt}[ft,rt]=Mt;const bt=-rt,xt=ft,yt=(B,lt)=>[j+B*ft+lt*bt,$+B*rt+lt*xt];let St=-o*.5,ht=o*.5,At=-o*.5,kt=o*.5;{const B=yt(St,At),lt=yt(ht,kt),vt=yt(St,kt),Et=yt(ht,At);if(!A(B[0],B[1])||!A(lt[0],lt[1])||!A(vt[0],vt[1])||!A(Et[0],Et[1]))return null}const Ct=o,Dt=B=>{const lt=B>0?ht+Ct:St-Ct,vt=yt(lt,At),Et=yt(lt,kt);return C(vt[0],vt[1],Et[0],Et[1])?(B>0?ht=lt:St=lt,!0):!1},Rt=B=>{const lt=B>0?kt+Ct:At-Ct,vt=yt(St,lt),Et=yt(ht,lt);return C(vt[0],vt[1],Et[0],Et[1])?(B>0?kt=lt:At=lt,!0):!1},G=[!1,!1,!1,!1];for(let B=0;B<4e3;B++){let lt=!1;if(!G[0]&&kt-At<S&&(Rt(1)?lt=!0:G[0]=!0),!G[1]&&ht-St<ut&&(Dt(1)?lt=!0:G[1]=!0),!G[2]&&ht-St<ut&&(Dt(-1)?lt=!0:G[2]=!0),!G[3]&&kt-At<S&&(Rt(-1)?lt=!0:G[3]=!0),!lt)break}let Tt=ht-St,Ut=kt-At;const tt=Math.min(ut,S);if(Math.min(Tt,Ut)<tt*.85){const B=Tt>=Ut;for(let lt=0;lt<4e3;lt++){let vt=!1;if(B){if(ht-St>=P)break;G[1]||(Dt(1)?vt=!0:G[1]=!0),!G[2]&&ht-St<P&&(Dt(-1)?vt=!0:G[2]=!0)}else{if(kt-At>=P)break;G[0]||(Rt(1)?vt=!0:G[0]=!0),!G[3]&&kt-At<P&&(Rt(-1)?vt=!0:G[3]=!0)}if(!vt)break}Tt=ht-St,Ut=kt-At}const nt=Q;if(nt>0){const B=lt=>{let vt=0;for(;vt<nt;){if(!(lt===0?Rt(1):lt===1?Dt(1):lt===2?Dt(-1):Rt(-1)))return vt;vt+=Ct}return-vt};for(const lt of[0,1,2,3]){const vt=[St,ht,At,kt];B(lt)<0&&([St,ht,At,kt]=vt)}}return St-=o*.5,ht+=o*.5,At-=o*.5,kt+=o*.5,{ax:j,ay:$,ux:ft,uy:rt,vx:bt,vy:xt,u0:St,u1:ht,v0:At,v1:kt,w:ht-St,h:kt-At,theta:Math.atan2(rt,ft)}},N=(j,$)=>{const ot=[[j.u0,j.v0],[j.u1,j.v0],[j.u0,j.v1],[j.u1,j.v1]].map(([Mt,bt])=>[j.ax+Mt*j.ux+bt*j.vx,j.ay+Mt*j.uy+bt*j.vy]);let wt=1/0,ut=-1/0,S=1/0,P=-1/0;for(const[Mt,bt]of ot)wt=Math.min(wt,Mt),ut=Math.max(ut,Mt),S=Math.min(S,bt),P=Math.max(P,bt);const Q=Math.max(0,Math.floor((wt-a)/o)-1),ft=Math.min(i-1,Math.ceil((ut-a)/o)+1),rt=Math.max(0,Math.floor((S-r)/o)-1),dt=Math.min(s-1,Math.ceil((P-r)/o)+1);for(let Mt=rt;Mt<=dt;Mt++)for(let bt=Q;bt<=ft;bt++){const xt=Mt*i+bt;if(E[xt])continue;const yt=a+(bt+.5)*o-j.ax,St=r+(Mt+.5)*o-j.ay,ht=yt*j.ux+St*j.uy,At=yt*j.vx+St*j.vy;ht>=j.u0-0&&ht<=j.u1+0&&At>=j.v0-0&&At<=j.v1+0&&(E[xt]=2,T[xt]=$)}},F=3*h*.97,V=1.25*h,K=F*.9,Z=t.cellTypical??(u+f)/2,U=j=>Math.min(f,Math.max(u,j)),X=()=>{let j=U(Z*(1+e.jitter(.22))),$=U(Z*(1+e.jitter(.22)));const st=e.next();return t.maxAspect?[j,$]:(st<.22?j=Z*e.range(1.6,2.5):st<.34&&($=Z*e.range(1.6,2.5)),[j,$])},z=j=>t.hand==="left"?1:t.hand==="right"?-1:t.hand==="random"||j==null?e.chance(.5)?1:-1:-j,Y=()=>e.jitter(t.jitter/.08*1.5*Math.PI/180),J=[];for(let j=0;j<c;j++)l[j]||d.dist2[j]>2.3||J.push({k:j,x:a+(j%i+.5)*o,y:r+((j/i|0)+.5)*o,contour:!0,hand:null});const et=Math.max(4,Math.round(f/o)),it=new Map,at=j=>{const $=Math.floor(j.k%i/et)+Math.floor(j.k/i/et)*100003;return it.has($)||it.set($,e.next()),it.get($)};J.sort((j,$)=>at(j)-at($)||j.k-$.k);const _t=(j,$,st)=>{if(!j||Math.min(j.w,j.h)<st)return null;const ot=R.length;return j.hand=$,R.push(j),N(j,ot),j},W=j=>{const $=[],st=(wt,ut)=>[j.ax+wt*j.ux+ut*j.vx,j.ay+wt*j.uy+ut*j.vy],ot=o*1.2;for(const[wt,ut,S,P]of[[j.u1+ot,j.v0+o,j.vx,j.vy],[j.u0-ot,j.v0+o,j.vx,j.vy],[j.u0+o,j.v1+ot,j.vx,j.vy],[j.u1-o,j.v1+ot,j.vx,j.vy]]){const[Q,ft]=st(wt,ut),rt=O(Q,ft);rt>=0&&E[rt]===0&&$.push({k:rt,x:Q,y:ft,theta:j.theta,nx:S,ny:P,hand:-j.hand,contour:!1})}return $};for(let j=0;j<J.length;j++){const $=J[j];if(E[$.k]||L[$.k])continue;L[$.k]=1;let st,ot,wt;const ut=Math.sqrt(d.dist2[$.k])*o<u*.6;$.contour||ut&&b>0?(st=D($.k),ot=p[$.k],wt=m[$.k]):(st=0,ot=$.nx,wt=$.ny);const S=k($.x,$.y,st+Y(),ot,wt,X(),f*4,K),P=_t(S,z($.hand),F);if(P)for(const Q of W(P))J.push(Q)}for(let j=0;j<2;j++){const $=new Uint8Array(c);for(let ut=0;ut<c;ut++)$[ut]=E[ut]?1:0;const st=si($,i,s),ot=[],wt=j===0?(F/2/o)**2:(V/2/o)**2*.8;for(let ut=0;ut<c;ut++)!E[ut]&&st.dist2[ut]>=wt&&ot.push(ut);ot.sort((ut,S)=>st.dist2[S]-st.dist2[ut]),L.fill(0);for(const ut of ot){if(E[ut]||L[ut])continue;L[ut]=1;const S=st.nearest[ut],P=a+(ut%i+.5)*o,Q=r+((ut/i|0)+.5)*o;let ft=ut%i-S%i,rt=(ut/i|0)-(S/i|0);const dt=Math.hypot(ft,rt)||1;ft/=dt,rt/=dt;const Mt=S>=0?T[S]:-1,bt=Math.sqrt(d.dist2[ut])*o<u*.6?D(ut):Mt>=0?R[Mt].theta:0,xt=Mt>=0?R[Mt].hand:null,yt=k(P,Q,bt+Y(),ft,rt,j===0?X():[u,u],f*4,K);_t(yt,z(xt),j===0?F:t.fillers?V:F)}}return R}function OM(n,t,e){const{gw:i,gh:s,h:o,ox:a,oy:r,blocked:l,hit:c,m:h}=n,u=i*s,f=t.pitch,d=si(c,i,s).dist2,_=new Float32Array(u);for(let m=0;m<u;m++)_[m]=Math.sqrt(d[m]);const g=(m,v)=>Math.min(m,v,i-1-m,s-1-v)>=h+.5;for(let m=0;m<t.echo;m++){const v=h+(f/2+m*f)/o;for(const M of Sf(_,i,s,v)){let x=M;for(let b=0;b<3;b++)x=wf(x,M.closed);let y=[];const w=()=>{y.length>1&&bf(y)*o>=2.5*f&&e.push({pts:y.map(([b,D])=>[a+(b+.5)*o,r+(D+.5)*o]),radius:0}),y=[]};for(const b of x)g(b[0],b[1])?y.push(b):w();w()}}const p=h+t.echo*f/o;for(let m=0;m<u;m++)_[m]<p&&(l[m]=1);n.dirty=!0}function zM(n,t,e){const{gw:i,gh:s,h:o,ox:a,oy:r,blocked:l}=n,c=i*s,h=t.pitch,u=si(l,i,s),f=new Float32Array(c);for(let x=0;x<c;x++)f[x]=l[x]?0:Math.sqrt(u.dist2[x]);const d=Math.max(2,Math.round(1.8*h/o)),_=BM(f,i,s,d),g=1.35*h/o,p=new Uint8Array(c);let m=!1;for(let x=0;x<c;x++)!l[x]&&_[x]<g&&(p[x]=1,m=!0);if(!m)return;const v=(x,y)=>[a+(x+.5)*o,r+(y+.5)*o],M=(x,y,w)=>x[Math.min(s-1,Math.max(0,Math.round(w)))*i+Math.min(i-1,Math.max(0,Math.round(y)))];for(let x=0;x<3;x++){const y=(h/2+x*h)/o;for(const w of Sf(f,i,s,y)){let b=w;for(let T=0;T<3;T++)b=wf(b,w.closed);let D=[];const E=()=>{D.length>1&&bf(D)*o>=2.2*h&&e.push({pts:D.map(([T,L])=>v(T,L)),radius:0}),D=[]};for(const T of b)M(p,T[0],T[1])&&y<=M(_,T[0],T[1])-.45*h/o?D.push(T):E();E()}}for(let x=0;x<c;x++)p[x]&&(l[x]=1);n.dirty=!0}function BM(n,t,e,i){const s=new Float32Array(t*e),o=new Float32Array(t*e);for(let a=0;a<e;a++){const r=a*t;for(let l=0;l<t;l++){let c=0;const h=Math.max(0,l-i),u=Math.min(t-1,l+i);for(let f=h;f<=u;f++)n[r+f]>c&&(c=n[r+f]);s[r+l]=c}}for(let a=0;a<t;a++)for(let r=0;r<e;r++){let l=0;const c=Math.max(0,r-i),h=Math.min(e-1,r+i);for(let u=c;u<=h;u++)s[u*t+a]>l&&(l=s[u*t+a]);o[r*t+a]=l}return o}function bf(n){let t=0;for(let e=1;e<n.length;e++)t+=Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]);return t}function wf(n,t){const e=n.length;if(e<3)return n;const i=new Array(e);for(let s=0;s<e;s++){if(!t&&(s===0||s===e-1)){i[s]=n[s];continue}const o=n[(s-1+e)%e],a=n[s],r=n[(s+1)%e];i[s]=[(o[0]+2*a[0]+r[0])/4,(o[1]+2*a[1]+r[1])/4]}return i}function Sf(n,t,e,i){const s=[],o=new Map,a=(u,f,d)=>{const _=2*(f*t+u)+(d?0:1);if(!o.has(_)){const g=n[f*t+u],p=d?n[f*t+u+1]:n[(f+1)*t+u],m=Math.min(1,Math.max(0,(i-g)/(p-g)));o.set(_,d?[u+m,f]:[u,f+m])}return _};for(let u=0;u<e-1;u++)for(let f=0;f<t-1;f++){const d=n[u*t+f]>=i,_=n[u*t+f+1]>=i,g=n[(u+1)*t+f+1]>=i,p=n[(u+1)*t+f]>=i,m=(d?1:0)|(_?2:0)|(g?4:0)|(p?8:0);if(m===0||m===15)continue;const v=()=>a(f,u,!0),M=()=>a(f,u+1,!0),x=()=>a(f,u,!1),y=()=>a(f+1,u,!1);switch(m){case 1:case 14:s.push([x(),v()]);break;case 2:case 13:s.push([v(),y()]);break;case 3:case 12:s.push([x(),y()]);break;case 4:case 11:s.push([y(),M()]);break;case 6:case 9:s.push([v(),M()]);break;case 7:case 8:s.push([x(),M()]);break;case 5:s.push([x(),M()],[v(),y()]);break;case 10:s.push([x(),v()],[y(),M()]);break}}const r=new Map;s.forEach(([u,f],d)=>{r.has(u)||r.set(u,[]),r.has(f)||r.set(f,[]),r.get(u).push(d),r.get(f).push(d)});const l=new Uint8Array(s.length),c=[],h=(u,f)=>{const d=[u];let _=u,g=f;for(;g>=0&&!l[g];){l[g]=1;const[p,m]=s[g];_=p===_?m:p,d.push(_),g=-1;for(const v of r.get(_))if(!l[v]){g=v;break}}return d};for(const[u,f]of r)f.length!==1||l[f[0]]||c.push(h(u,f[0]));for(let u=0;u<s.length;u++){if(l[u])continue;const f=h(s[u][0],u);f.closed=!0,c.push(f)}return c.map(u=>{const f=u.map(d=>o.get(d));return(u.closed||u[0]===u[u.length-1])&&(f.closed=!0),f})}function Na(n,t,e,i,s){const o=new Float32Array(Math.max(t,e));for(let a=0;a<2;a++){for(let r=0;r<e;r++){const l=r*t;let c=0;for(let h=-i;h<=i;h++)h>=0&&h<t&&(c+=n[l+h]);for(let h=0;h<t;h++){o[h]=c;const u=h-i,f=h+i+1;u>=0&&(c-=n[l+u]),f<t&&(c+=n[l+f])}for(let h=0;h<t;h++)n[l+h]=s[l+h]?0:o[h]}for(let r=0;r<t;r++){let l=0;for(let c=-i;c<=i;c++)c>=0&&c<e&&(l+=n[c*t+r]);for(let c=0;c<e;c++){o[c]=l;const h=c-i,u=c+i+1;h>=0&&(l-=n[h*t+r]),u<e&&(l+=n[u*t+r])}for(let c=0;c<e;c++)n[c*t+r]=s[c*t+r]?0:o[c]}}}function GM(n,t,e,i,s){let o=[n.ux,n.uy],a=[n.vx,n.vy],r=n.w,l=n.h,c=[n.ax+n.u0*n.ux+n.v0*n.vx,n.ay+n.u0*n.uy+n.v0*n.vy];if(l>r){c=[c[0]+r*o[0],c[1]+r*o[1]];const p=a,m=[-o[0],-o[1]];o=p,a=m,[r,l]=[l,r]}const h=t.pitch,u=e.chance(.5),f=n.hand??1,d={fu:u,fv:u};_l({p:h,o:t,rng:e,strokes:i,toPanel:(p,m)=>(d.fu&&(p=r-p),d.fv&&(m=l-m),[c[0]+p*o[0]+m*a[0],c[1]+p*o[1]+m*a[1]]),stats:s},0,0,r,l,f,0)}function _l(n,t,e,i,s,o,a){const{p:r,o:l,rng:c}=n,h=Math.min(i,s),u=Math.max(i,s);if(h<2.6*r){l.fillers&&HM(n,t,e,i,s);return}const f=u/h;if(l.maxAspect&&f>l.maxAspect){const p=Math.round(f);if(p<=1||u/p<2.6*r){eo(n,t,e,i,s,o);return}for(let m=0;m<p;m++){const v=u*m/p,M=u*(m+1)/p;i>=s?eo(n,t+v,e,M-v,s,m%2?-o:o):eo(n,t,e+v,i,M-v,m%2?-o:o)}return}if(f<1.6||a>2){eo(n,t,e,i,s,o);return}if(f<3.2){c.chance(l.pairs)?Tf(n,t,e,i,s,o):eo(n,t,e,i,s,o);return}const d=h*c.range(1.15,2.1),_=Math.max(2,Math.round(u/d)),g=[0];for(let p=1;p<_;p++)g.push(u*(p+c.jitter(.18))/_);g.push(u);for(let p=0;p<_;p++){const m=g[p],v=g[p+1];i>=s?_l(n,t+m,e,v-m,s,p%2?-o:o,a+1):_l(n,t,e+m,i,v-m,p%2?-o:o,a+1)}}function Ef(n,t){const e=Math.max(1,Math.round(n/t));return Math.min(t*1.15,Math.max(t*.87,n/e))}function eo(n,t,e,i,s,o){const{p:a,o:r,rng:l}=n,c=Math.min(i,s),h=Ef(c-a,a),u=t+a/2,f=e+a/2,d=t+i-a/2,_=e+s-a/2,g=r.eyes>0&&c>=6*a&&l.chance(r.eyes),p=g?2.6*h:0,m=[[u,f,[1,0],[0,1]],[d,f,[0,1],[-1,0]],[d,_,[-1,0],[0,-1]],[u,_,[0,-1],[1,0]]],[v,M,x,y]=m[l.int(0,3)],w=Math.abs(x[0])*(d-u)+Math.abs(x[1])*(_-f),b=Math.abs(y[0])*(d-u)+Math.abs(y[1])*(_-f),D=_r(w,b,h,p).map(([E,T])=>[v+E*x[0]+T*y[0],M+E*x[1]+T*y[1]]);if(o<0)for(const E of D)E[0]=u+d-E[0];Pr(n,D,h),n.stats.spirals++,g&&VM(n,(u+d)/2,(f+_)/2,h*.7)}function _r(n,t,e,i=0){let s=0,o=n,a=0,r=t,l=0,c=0;const h=[[0,0]],u=e*.5;for(let f=0;f<200&&!(o-l<u||(l=o,h.push([l,c]),a+=e,r-c<u)||(c=r,h.push([l,c]),o-=e,l-s<u)||(l=s,h.push([l,c]),r-=e,c-a<u)||(c=a,h.push([l,c]),s+=e,i&&(o-s<i||r-a<i)));f++);return h}function Tf(n,t,e,i,s,o){const{p:a,rng:r}=n;if(s>i){const v=n.toPanel,M={...n,toPanel:(x,y)=>v(t+(y-e),e+(x-t))};Tf(M,t,e,s,i,-o);return}const l=Ef(s-a,a),c=t+a/2,h=e+a/2,u=t+i-a/2,f=e+s-a/2,d=c+(u-c-l)/2*r.range(.9,1.1),_=_r(f-h,d-c,l).map(([v,M])=>[d-M,h+v]);let g;r.chance(.5)?g=_r(u-(d+l),f-h,l).map(([v,M])=>[d+l+v,h+M]):g=_r(f-h,u-(d+l),l).map(([v,M])=>[d+l+M,h+v]);const m=_.reverse().concat(g);if(o<0)for(const v of m)v[1]=e+s-(v[1]-e);Pr(n,m,l),n.stats.pairs++}function HM(n,t,e,i,s){const{p:o,rng:a}=n,r=Math.min(i,s),l=Math.max(i,s),c=i>=s,h=(f,d)=>c?[t+f,e+d]:[t+d,e+f],u=r-o;if(u>=.6*o&&l>=2.2*o){const f=u,d=o/2,_=l-o/2,g=o/2,p=r-o/2,m=Math.min(f,(_-d)*.3),v=a.chance(.5)?[h(_-m,p),h(d,p),h(d,g),h(_,g)]:[h(d+m,p),h(_,p),h(_,g),h(d,g)];Pr(n,v,f)}else if(l-o>=.9*o){const f=r/2;Pr(n,[h(o/2,f),h(l-o/2,f)],o)}else return;n.stats.fillers++}function VM(n,t,e,i){const o=[];for(let a=0;a<=12;a++){const r=a/12*Math.PI*2;o.push([t+i*Math.cos(r),e+i*Math.sin(r)])}n.strokes.push({pts:o.map(([a,r])=>n.toPanel(a,r)),radius:0,closed:!0})}function Pr(n,t,e){const{o:i,rng:s}=n,o=i.jitter*e,a=t.map(([l,c])=>n.toPanel(l+s.jitter(o),c+s.jitter(o))),r=e*(.12+.88*Math.max(0,Math.min(1,i.roundness)));n.strokes.push({pts:a,radius:r})}function WM(n,t,e){const i=e.debugCells===!0?.2:e.pitch*e.line,s=o=>{o.lineWidth=i,o.lineCap="round",o.lineJoin="round",o.beginPath();for(const a of t){const r=a.pts;if(r.length<2)continue;if(o.moveTo(r[0][0],r[0][1]),a.closed){for(let c=1;c<r.length;c++)o.lineTo(r[c][0],r[c][1]);o.closePath(),o.moveTo(r[0][0],r[0][1]);continue}for(let c=1;c<r.length-1;c++){const h=r[c-1],u=r[c],f=r[c+1],d=Math.hypot(u[0]-h[0],u[1]-h[1]),_=Math.hypot(f[0]-u[0],f[1]-u[1]),g=Math.min(a.radius,c===1?d:d/2,c===r.length-2?_:_/2);g>.001?o.arcTo(u[0],u[1],f[0],f[1],g):o.lineTo(u[0],u[1])}const l=r[r.length-1];o.lineTo(l[0],l[1])}o.stroke()};e.mode==="thread"?n.add(s,{height:e.depth,profile:"ridge"}):n.sink(s,{depth:e.depth,shoulder:i*.4,profile:"u"})}function jM(n,t){const e=new Map,i=n.field;for(let a=0;a<i.length;a+=3){if(t[a]<.5)continue;const r=Math.round(i[a]/.02);e.set(r,(e.get(r)||0)+1)}let s=0,o=-1;for(const[a,r]of e)r>o&&(o=r,s=a);return s*.02}const nr=n=>Math.round(n*1e3)/1e3,ir=()=>typeof performance<"u"?performance.now():Date.now(),qM=1024,pi=4,Ns={plateau(n,t){if(n<=0)return 0;if(n>=t)return 1;const e=1-n/t;return 1-e*e*Math.sqrt(e)},dome(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return Math.sqrt(1-(1-e)*(1-e))},ridge(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return 1-(1-e)*(1-e)},u(n,t){if(n<=0)return 0;const e=Math.min(n/t,1);return Math.sqrt(1-(1-e)*(1-e))},v(n,t){return n<=0?0:Math.min(n/t,1)}},XM=new Set(["dome","ridge","v"]),ws=class ws{constructor({width:t,height:e,ppmm:i=8,maxSize:s=ws.maxSize,seed:o=1}={}){if(!(t>0&&e>0))throw new Error("ReliefPanel: width and height (mm) required");this.width=t,this.height=e,s=Math.min(s,ws.maxSizeCap),this.ppmm=Math.min(i,s/t,s/e),this.cols=Math.max(2,Math.round(t*this.ppmm)),this.rows=Math.max(2,Math.round(e*this.ppmm)),this.ppmm=this.cols/t,this.field=new Float32Array(this.cols*this.rows),this.groove=new Float32Array(this.cols*this.rows),this.seed=o,this.rng=new Be(o),this.stats={ops:0,ms:0},this._canvas=null,this._probeCanvas=null}raise(t,{height:e=1.2,shoulder:i,profile:s="plateau"}={}){const o=this._profile(s);return this._apply(t,s,i,.5,(a,r)=>{const l=e*r;l>this.field[a]&&(this.field[a]=l)},o),this}sink(t,{depth:e=.5,shoulder:i,profile:s="u"}={}){const o=this._profile(s);return this._apply(t,s,i,.25,(a,r)=>{this.field[a]-=e*r,r>this.groove[a]&&(this.groove[a]=r)},o),this}add(t,{height:e=.3,shoulder:i,profile:s="ridge"}={}){const o=this._profile(s);return this._apply(t,s,i,.25,(a,r)=>{this.field[a]+=e*r},o),this}mask(t){const e=new Float32Array(this.cols*this.rows),i=this._rasterize(t);if(i){const{cov:s,x0:o,y0:a,bw:r,bh:l}=i;for(let c=0;c<l;c++){const h=a+c;if(!(h<0||h>=this.rows))for(let u=0;u<r;u++){const f=o+u;f<0||f>=this.cols||(e[h*this.cols+f]=s[c*r+u])}}}return{data:e,cols:this.cols,rows:this.rows,ppmm:this.ppmm}}fillGround(t={},{avoid:e="raised",margin:i=.6,rect:s}={}){return Si(this,{rect:s??{x:0,y:0,w:this.width,h:this.height},avoid:e,margin:i},t)}mirrorX(t){const{cols:e,field:i,groove:s}=this,o=t??{x:0,y:0,w:this.width,h:this.height},a=Math.max(0,Math.round(o.x*this.ppmm)),r=Math.min(e,Math.round((o.x+o.w)*this.ppmm)),l=Math.max(0,Math.round(o.y*this.ppmm)),c=Math.min(this.rows,Math.round((o.y+o.h)*this.ppmm)),h=r-a>>1;for(let u=l;u<c;u++){const f=u*e;for(let d=0;d<h;d++)i[f+r-1-d]=i[f+a+d],s[f+r-1-d]=s[f+a+d]}return this}heightAt(t,e){const i=Math.min(this.cols-1,Math.max(0,Math.floor(t*this.ppmm))),s=Math.min(this.rows-1,Math.max(0,Math.floor(e*this.ppmm)));return this.field[s*this.cols+i]}bake(t={}){return xf(this,t)}_profile(t){if(typeof t=="function")return t;const e=Ns[t];if(!e)throw new Error(`ReliefPanel: unknown profile "${t}"`);return e}_apply(t,e,i,s,o,a){const r=performance.now(),l=this._rasterize(t);if(!l)return;const{cov:c,x0:h,y0:u,bw:f,bh:d}=l,_=Pu(c,f,d),g=1/this.ppmm;let p=i??(XM.has(e)?null:s);if(p==null){let M=0;for(let x=0;x<_.length;x++)_[x]>M&&(M=_[x]);p=Math.max(M*g,.001)}const{cols:m,rows:v}=this;for(let M=0;M<d;M++){const x=u+M;if(!(x<0||x>=v))for(let y=0;y<f;y++){const w=h+y;if(w<0||w>=m)continue;const b=_[M*f+y];b<=0||o(x*m+w,a(b*g,p))}}this.stats.ops++,this.stats.ms+=performance.now()-r}_rasterize(t){const{cols:e,rows:i,ppmm:s}=this,o=Math.max(1,Math.ceil(Math.max(e,i)/qM)),a=Math.ceil(e/o),r=Math.ceil(i/o);this._probeCanvas||(this._probeCanvas=xr(a,r));const l=this._probeCanvas;l.width=a,l.height=r;const c=il(l);Vh(c),c.setTransform(s/o,0,0,-s/o,0,i/o);const h=[];if(t(YM(c,h)),!h.length)return null;const u=c.getImageData(0,0,a,r).data;let f=a,d=r,_=-1,g=-1;for(let R=0;R<r;R++){const O=R*a*4;for(let A=0;A<a;A++)u[O+A*4+3]!==0&&(A<f&&(f=A),A>_&&(_=A),R<d&&(d=R),R>g&&(g=R))}if(_<0)return null;const p=Math.max(-pi,f*o-pi-o),m=Math.min(e+pi,(_+1)*o+pi+o),v=d*o-pi-o,M=(g+1)*o+pi+o,x=Math.max(-pi,i-M),y=Math.min(i+pi,i-v),w=m-p,b=y-x;this._canvas||(this._canvas=xr(w,b));const D=this._canvas;D.width=w,D.height=b;const E=il(D);Vh(E),E.setTransform(s,0,0,-s,-p,y),$M(E,h);const T=E.getImageData(0,0,w,b).data,L=new Float32Array(w*b);for(let R=0;R<b;R++){const O=R*w*4,A=(b-1-R)*w;for(let I=0;I<w;I++)L[A+I]=T[O+I*4+3]/255}return{cov:L,x0:p,y0:x,bw:w,bh:b}}};Lo(ws,"maxSize",4096),Lo(ws,"maxSizeCap",1/0);let bo=ws;function Vh(n){n.setTransform(1,0,0,1,0,0),n.globalCompositeOperation="source-over",n.globalAlpha=1,n.fillStyle="#fff",n.strokeStyle="#fff",n.lineCap="round",n.lineJoin="round",n.miterLimit=4,n.lineWidth=1}function YM(n,t){return new Proxy(n,{get(e,i){const s=e[i];return typeof s=="function"?(...o)=>(t.push([i,o]),s.apply(e,o)):s},set(e,i,s){return t.push([i,s,!0]),e[i]=s,!0}})}function $M(n,t){for(const e of t)e[2]?n[e[0]]=e[1]:n[e[0]](...e[1])}const me=Math.PI/180;function Af(n,t,e=!1,i=.5){const s=t.length;if(n.beginPath(),s===0)return;if(s<3){n.moveTo(t[0][0],t[0][1]);for(let l=1;l<s;l++)n.lineTo(t[l][0],t[l][1]);e&&n.closePath();return}const o=l=>e?t[(l+s)%s]:t[Math.max(0,Math.min(s-1,l))],a=i/3;n.moveTo(t[0][0],t[0][1]);const r=e?s:s-1;for(let l=0;l<r;l++){const c=o(l-1),h=o(l),u=o(l+1),f=o(l+2);n.bezierCurveTo(h[0]+(u[0]-c[0])*a,h[1]+(u[1]-c[1])*a,u[0]-(f[0]-h[0])*a,u[1]-(f[1]-h[1])*a,u[0],u[1])}e&&n.closePath()}function Fs(n,t,e=!1){n.beginPath(),t.forEach((i,s)=>s?n.lineTo(i[0],i[1]):n.moveTo(i[0],i[1])),e&&n.closePath()}function Rn(n){let t=0;for(let e=1;e<n.length;e++)t+=Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]);return t}function un(n,t=.5){if(n.length<2)return n.slice();const e=Rn(n),i=Math.max(1,Math.ceil(e/t)),s=[n[0].slice()];let o=1,a=0,r=Math.hypot(n[1][0]-n[0][0],n[1][1]-n[0][1]);for(let l=1;l<i;l++){const c=l/i*e;for(;a+r<c&&o<n.length-1;)a+=r,o++,r=Math.hypot(n[o][0]-n[o-1][0],n[o][1]-n[o-1][1]);const h=r>0?(c-a)/r:0,u=n[o-1],f=n[o];s.push([u[0]+(f[0]-u[0])*h,u[1]+(f[1]-u[1])*h])}return s.push(n[n.length-1].slice()),s}function Rf(n,t=0,e=0){const i=Rn(n);return t+e>=i?[]:$r(n,t,i-e)}function $r(n,t,e){const i=[];let s=0;for(let o=1;o<n.length;o++){const a=n[o-1],r=n[o],l=Math.hypot(r[0]-a[0],r[1]-a[1]),c=s,h=s+l;if(h>=t&&c<=e&&l>0){const u=Math.max(0,(t-c)/l),f=Math.min(1,(e-c)/l);i.length||i.push([a[0]+(r[0]-a[0])*u,a[1]+(r[1]-a[1])*u]),i.push([a[0]+(r[0]-a[0])*f,a[1]+(r[1]-a[1])*f])}s=h}return i}function Ml(n,t=.4,e=.5){const i=n.length;if(i<3)return un(n,t);const s=r=>n[Math.max(0,Math.min(i-1,r))],o=e/3,a=[n[0].slice()];for(let r=0;r<i-1;r++){const l=s(r-1),c=s(r),h=s(r+1),u=s(r+2),f=[c[0]+(h[0]-l[0])*o,c[1]+(h[1]-l[1])*o],d=[h[0]-(u[0]-c[0])*o,h[1]-(u[1]-c[1])*o],_=Math.max(4,Math.ceil(Math.hypot(h[0]-c[0],h[1]-c[1])/(t*.5)));for(let g=1;g<=_;g++){const p=g/_,m=1-p;a.push([m*m*m*c[0]+3*m*m*p*f[0]+3*m*p*p*d[0]+p*p*p*h[0],m*m*m*c[1]+3*m*m*p*f[1]+3*m*p*p*d[1]+p*p*p*h[1]])}}return un(a,t)}function Pf(n){const t=n.length,e=new Array(t);for(let i=0;i<t;i++){const s=n[Math.max(0,i-1)],o=n[Math.min(t-1,i+1)];let a=o[0]-s[0],r=o[1]-s[1];const l=Math.hypot(a,r)||1;a/=l,r/=l,e[i]=[-r,a]}return e}function Lf(n,t=!1){const e=n.length,[i,s]=t?[n[0],n[Math.min(1,e-1)]]:[n[Math.max(0,e-2)],n[e-1]];return Math.atan2(s[1]-i[1],s[0]-i[0])/me}function Ke(n,t,{closed:e=!1,step:i=.35}={}){const s=n.length;if(s<3)return n.map(l=>l.slice());const o=[],a=l=>Array.isArray(t)?t[l]??0:t,r=e?[...Array(s).keys()]:[...Array(s).keys()].slice(1,s-1);e||o.push(n[0].slice());for(const l of r){const c=n[l],h=n[(l-1+s)%s],u=n[(l+1)%s],f=Math.hypot(h[0]-c[0],h[1]-c[1]),d=Math.hypot(u[0]-c[0],u[1]-c[1]),_=a(l);if(!(_>0)||f<1e-6||d<1e-6){o.push(c.slice());continue}const g=[(h[0]-c[0])/f,(h[1]-c[1])/f],p=[(u[0]-c[0])/d,(u[1]-c[1])/d],m=Math.max(-1,Math.min(1,g[0]*p[0]+g[1]*p[1])),v=Math.acos(m);if(v>Math.PI-.001){o.push(c.slice());continue}const M=Math.tan(v/2);let x=_/M;const y=e||l-1>0?.5:1,w=e||l+1<s-1?.5:1;x=Math.min(x,f*y,d*w);const b=x*M,D=[c[0]+g[0]*x,c[1]+g[1]*x],E=[c[0]+p[0]*x,c[1]+p[1]*x],T=[g[0]+p[0],g[1]+p[1]],L=Math.hypot(T[0],T[1])||1,R=b/Math.sin(v/2),O=[c[0]+T[0]/L*R,c[1]+T[1]/L*R];let A=Math.atan2(D[1]-O[1],D[0]-O[0]),C=Math.atan2(E[1]-O[1],E[0]-O[0])-A;for(;C>Math.PI;)C-=2*Math.PI;for(;C<-Math.PI;)C+=2*Math.PI;const k=Math.max(2,Math.ceil(Math.abs(C)*b/i));for(let N=0;N<=k;N++){const F=A+C*N/k;o.push([O[0]+Math.cos(F)*b,O[1]+Math.sin(F)*b])}}return e||o.push(n[s-1].slice()),o}function Cf(n,t,e=.08,i=14){if(!t||!(e>0)||n.length<3)return n;const s=t.range(0,6.283),o=t.range(0,6.283),a=6.283/i,r=6.283/(i*.43),l=Pf(n);let c=0;return n.map((h,u)=>{u&&(c+=Math.hypot(h[0]-n[u-1][0],h[1]-n[u-1][1]));const f=e*(.7*Math.sin(c*a+s)+.3*Math.sin(c*r+o));return[h[0]+l[u][0]*f,h[1]+l[u][1]*f]})}class re{constructor(t,e=0){this.v=[[t[0],t[1]]],this.r=[0],this.h=e,this.marks={}}get pos(){return this.v[this.v.length-1]}fwd(t){const[e,i]=this.pos;return this.v.push([e+Math.cos(this.h*me)*t,i+Math.sin(this.h*me)*t]),this.r.push(0),this}turn(t,e=0){return this.h+=t,this.r[this.r.length-1]=e,this}head(t,e=0){return this.h=t,this.r[this.r.length-1]=e,this}to(t,e){e!==void 0&&(this.r[this.r.length-1]=e);const[i,s]=this.pos;return this.h=Math.atan2(t[1]-s,t[0]-i)/me,this.v.push([t[0],t[1]]),this.r.push(0),this}mark(t){return this.marks[t]=this.v.length-1,this}curl({dir:t=1,size:e=10,pitch:i=4,turns:s=1,r:o=2,shrink:a=1}={}){const[r,l]=Array.isArray(e)?e:[e,e],c=Math.max(1,Math.round(s*4));let h=r,u=l;for(let f=0;f<c;f++){const d=f%2===0?h:u;if(d<i*.35)break;this.turn(90*t,o),this.fwd(d),f%2===1&&(h=(h-i)*a,u=(u-i)*a),o=Math.min(o,Math.max(.2,Math.min(h,u)*.5))}return this}spine(t=.4){return un(Ke(this.v,this.r),t)}}function wo(n,t,e,i,s=.4){const o=(i-e)*me,a=Math.max(2,Math.ceil(Math.abs(o)*t/s)),r=[];for(let l=0;l<=a;l++){const c=e*me+o*l/a;r.push([n[0]+Math.cos(c)*t,n[1]+Math.sin(c)*t])}return r}function Lr(n,t,{start:e=0,sweep:i=270,dir:s=1,shrink:o=.15,step:a=.4}={}){const r=[],l=Math.abs(i)*me,c=Math.max(4,Math.ceil(l*t/a));for(let h=0;h<=c;h++){const u=h/c,f=e*me+s*l*u,d=t*Math.pow(1-o,l*u/(Math.PI/2));r.push([n[0]+Math.cos(f)*d,n[1]+Math.sin(f)*d])}return r}function KM(n,{pitch:t=2,turns:e=2,dir:i=1,rCorner:s=.3,startHeading:o=0,step:a=.3}={}){const r=Math.max(2,Math.round(e*4)),l=[];for(let d=0;d<r;d++)l.push(t*Math.ceil((d+1)/2));let c=o+180+i*90*(r-1);const h=[[n[0],n[1]]];let u=n[0],f=n[1];for(let d=0;d<r;d++)u+=Math.cos(c*me)*l[d],f+=Math.sin(c*me)*l[d],h.push([u,f]),c-=i*90;return h.reverse(),un(Ke(h,s*t),a)}function ke(n,t,e,{curl:i=90,radius:s=2,dir:o=1,step:a=.3}={}){const r=new re(n,t).fwd(e),l=r.spine(a),c=r.h,h=r.pos[0]+Math.cos((c+90*o)*me)*s,u=r.pos[1]+Math.sin((c+90*o)*me)*s,f=c-90*o,d=wo([h,u],s,f,f+i*o,a);return l.concat(d.slice(1))}function ZM(n,t,e,{sweep:i=240,shrink:s=.15,step:o=.4}={}){const a=Math.atan2(t[1]-n[1],t[0]-n[0])/me,r=[n[0]+Math.cos((a+90)*me)*e,n[1]+Math.sin((a+90)*me)*e],l=[t[0]+Math.cos((a-90)*me)*e,t[1]+Math.sin((a-90)*me)*e],c=Lr(r,e,{start:a-90,sweep:i,dir:-1,shrink:s,step:o}).reverse(),h=Lr(l,e,{start:a+90,sweep:i,dir:-1,shrink:s,step:o});return c.concat(un([n,t],o).slice(1,-1),h)}const fn=(n,t,e=0)=>i=>i<e?n:n+(t-n)*((i-e)/(1-e)),Rs=(n,t=.4,e=.35)=>i=>i<1-t?n:n*(1-(1-e)*((i-(1-t))/t)),$l=(n,t,e="round",i="round",s={})=>({kind:"band",pts:n,w:t,capA:e,capB:i,...s}),Un=(n,t={})=>({kind:"poly",pts:n,...t}),Fn=(n,t,e={})=>({kind:"circle",c:n,r:t,...e}),Cr=(n,t,e,i=0,s={})=>({kind:"ellipse",c:n,rx:t,ry:e,rot:i,...s}),zi=(n,t,e,i,s=0,o={})=>({kind:"rrect",c:n,w:t,h:e,r:i,rot:s,...o});function Kl(n,t,e,i=0,s=.3){const o=t/2,a=e/2,r=(o*o+a*a)/(2*a),l=Math.asin(Math.min(1,o/r))/me,c=wo([0,a-r],r,90+l,90-l,s),h=wo([0,r-a],r,-90+l,-90-l,s),u=Math.cos(i*me),f=Math.sin(i*me);return c.concat(h.slice(1,-1)).map(([d,_])=>[n[0]+d*u-_*f,n[1]+d*f+_*u])}function Df(n,t){const e={...n};return e.pts&&(e.pts=e.pts.map(t)),e.c&&(e.c=t(e.c)),e}function Ps(n,t,e=0){switch(t.kind){case"band":return JM(n,t,e);case"poly":if(t.pts.length<3)return;Fs(n,t.pts,!0),n.fill(),e>0&&(n.lineWidth=e*2,n.lineJoin="round",n.stroke());return;case"circle":n.beginPath(),n.arc(t.c[0],t.c[1],t.r+e,0,Math.PI*2),n.fill();return;case"ellipse":n.beginPath(),n.ellipse(t.c[0],t.c[1],t.rx+e,t.ry+e,(t.rot||0)*me,0,Math.PI*2),n.fill();return;case"rrect":{const i=t.w+e*2,s=t.h+e*2,o=Math.min(t.r+e,i/2,s/2);n.save(),n.translate(t.c[0],t.c[1]),t.rot&&n.rotate(t.rot*me),n.beginPath(),n.moveTo(-i/2+o,-s/2),n.arcTo(i/2,-s/2,i/2,s/2,o),n.arcTo(i/2,s/2,-i/2,s/2,o),n.arcTo(-i/2,s/2,-i/2,-s/2,o),n.arcTo(-i/2,-s/2,i/2,-s/2,o),n.closePath(),n.fill(),n.restore();return}}}function Wh(n,t,e){if(e<=0||n.length<2)return n;const i=Lf(n,t)*me;if(t){const o=n[0];return[[o[0]-Math.cos(i)*e,o[1]-Math.sin(i)*e],...n]}const s=n[n.length-1];return[...n,[s[0]+Math.cos(i)*e,s[1]+Math.sin(i)*e]]}function JM(n,t,e){let i=t.pts;if(!i||i.length<2)return;const s=typeof t.w=="number",o=s?()=>t.w:t.w;t.capA==="square"&&(i=Wh(i,!0,o(0)*.18)),t.capB==="square"&&(i=Wh(i,!1,o(1)*.18));const a=t.capA==="round",r=t.capB==="round";if(s&&t.capA!=="point"&&t.capB!=="point")n.lineWidth=t.w+e*2,n.lineJoin="round",n.lineCap="butt",Fs(n,i,!1),n.stroke();else{const c=Rn(i);let h=1/0;for(let _=0;_<=8;_++)h=Math.min(h,Math.max(.3,o(_/8)));const u=un(i,Math.max(.08,Math.min(.35,h*.12))),f=Rn(u);let d=0;n.beginPath();for(let _=0;_<u.length;_++){_&&(d+=Math.hypot(u[_][0]-u[_-1][0],u[_][1]-u[_-1][1]));const g=f>0?d/f:0;let p=o(g);t.capA==="point"&&(p*=Math.min(1,g*c/Math.max(.5,o(0)*1.2))),t.capB==="point"&&(p*=Math.min(1,(1-g)*c/Math.max(.5,o(1)*1.2)));const m=p/2+e;m<=.02||(n.moveTo(u[_][0]+m,u[_][1]),n.arc(u[_][0],u[_][1],m,0,Math.PI*2))}n.fill();for(const[_,g]of[[!0,t.capA],[!1,t.capB]]){if(g==="round"||g==="point")continue;const p=o(_?0:1)+e*2,m=_?u.slice(0,3):u.slice(-3);n.lineWidth=p,n.lineCap="butt",Fs(n,m,!1),n.stroke()}}const l=(c,h)=>{n.beginPath(),n.arc(i[c][0],i[c][1],h/2+e,0,Math.PI*2),n.fill()};a&&l(0,o(0)),r&&l(i.length-1,o(1)),e>0&&!a&&l(0,0),e>0&&!r&&l(i.length-1,0)}function vl(n,t,e,i="round"){!t||t.length<2||(n.lineWidth=e,n.lineCap=i,n.lineJoin="round",Fs(n,t,!1),n.stroke())}function If(n,{faceW:t=.66,spread:e=1,reserve:i=0,invert:s=!1,taper:o=0}={}){const a=n.h,r=n.w/2,l=Math.min(a,r/(t*e+i)),c={rect:n,H:a,hw:r,s:l,spread:e,invert:s,taper:o,cx:n.x+r,X:h=>h*l*e,Y:h=>h*a,P:(h,u)=>[h*l*e,u*a],u:h=>h*l,taperAt:h=>{const u=Math.max(0,Math.min(1,h/a));return o>=0?1-o*u:1+o*(1-u)},widthAt:h=>r*c.taperAt(h),warp:h=>o?[h[0]*c.taperAt(h[1]),h[1]]:h,toPanel:h=>{const u=c.warp(h);return[c.cx-u[0],n.y+(s?a-u[1]:u[1])]},apply(h){h.translate(c.cx,n.y),h.scale(-1,1),s&&(h.translate(0,a),h.scale(1,-1))}};return c}const QM=Object.freeze(Object.defineProperty({__proto__:null,Turtle:re,arcPts:wo,band:$l,cScroll:Lr,circle:Fn,drawShape:Ps,ellipse:Cr,fillet:Ke,halfMaskFrame:If,headingAt:Lf,hookSpine:ke,lens:Kl,mapShape:Df,normals:Pf,poly:Un,polyLength:Rn,polyPath:Fs,resample:un,rrect:zi,sScroll:ZM,smoothPath:Af,spline:Ml,sqSpiral:KM,strokeLine:vl,subPath:$r,tail:Rs,taper:fn,trim:Rf,wobble:Cf},Symbol.toStringTag,{value:"Module"})),ni=Math.PI/180,$i=(n,t,e)=>Math.max(t,Math.min(e,n));function Mr(n,t,e){const i=n.length;if(t==null)return Array(i).fill(e);if(typeof t=="number")return Array(i).fill(t);if(Array.isArray(t))return n.map((s,o)=>t[Math.min(o,t.length-1)]??e);if(typeof t=="function"){const s=Rn(n)||1;let o=0;return n.map((a,r)=>(r&&(o+=Math.hypot(a[0]-n[r-1][0],a[1]-n[r-1][1])),t(o/s)))}return Array(i).fill(e)}function xl(n){let t=0;for(let e=0;e<n.length;e++){const i=n[e],s=n[(e+1)%n.length];t+=i[0]*s[1]-s[0]*i[1]}return t/2}function jh(n,t,e=!0){let i=1/0;const s=t.length,o=e?s:s-1;for(let a=0;a<o;a++){const r=t[a],l=t[(a+1)%s],c=l[0]-r[0],h=l[1]-r[1],u=c*c+h*h;let f=u>0?((n[0]-r[0])*c+(n[1]-r[1])*h)/u:0;f=$i(f,0,1);const d=Math.hypot(r[0]+c*f-n[0],r[1]+h*f-n[1]);d<i&&(i=d)}return i}function tv(n,t){let e=1/0,i=t[0];const s=t.length;for(let o=0;o<s;o++){const a=t[o],r=t[(o+1)%s],l=r[0]-a[0],c=r[1]-a[1],h=l*l+c*c,u=h>0?$i(((n[0]-a[0])*l+(n[1]-a[1])*c)/h,0,1):0,f=[a[0]+l*u,a[1]+c*u],d=Math.hypot(f[0]-n[0],f[1]-n[1]);d<e&&(e=d,i=f)}return{d:e,p:i}}function qh(n,t){let e=!1;for(let i=0,s=t.length-1;i<t.length;s=i++){const o=t[i],a=t[s];o[1]>n[1]!=a[1]>n[1]&&n[0]<(a[0]-o[0])*(n[1]-o[1])/(a[1]-o[1]||1e-12)+o[0]&&(e=!e)}return e}function po(n,t,e=!0){if(!(!t||t.length<2)){n.moveTo(t[0][0],t[0][1]);for(let i=1;i<t.length;i++)n.lineTo(t[i][0],t[i][1]);e&&n.closePath()}}function Kr(n,t,e,i=!1){if(!(e>0)||!t||n.length<3)return n;const s=t.range(0,6.283),o=t.range(0,6.283),a=6.283/t.range(9,16),r=6.283/t.range(3.5,6),l=n.length;let c=0;return n.map((h,u)=>{u&&(c+=Math.hypot(h[0]-n[u-1][0],h[1]-n[u-1][1]));const f=n[i?(u-1+l)%l:Math.max(0,u-1)],d=n[i?(u+1)%l:Math.min(l-1,u+1)];let _=d[0]-f[0],g=d[1]-f[1];const p=Math.hypot(_,g)||1,m=e*(.7*Math.sin(c*a+s)+.3*Math.sin(c*r+o));return[h[0]-g/p*m,h[1]+_/p*m]})}function js(n,t,e){const i=n.length,s=[];for(let c=0;c<i-1;c++){const h=n[c+1][0]-n[c][0],u=n[c+1][1]-n[c][1],f=Math.hypot(h,u)||1e-9;s.push([h/f,u/f])}const o=[],a=[],r=[],l=[];for(let c=0;c<i;c++){const h=s[Math.max(0,c-1)],u=s[Math.min(i-2,c)],f=[-h[1],h[0]],d=[-u[1],u[0]];let _=f[0]+d[0],g=f[1]+d[1],p=Math.hypot(_,g);p<1e-6&&(_=f[0],g=f[1],p=1),_/=p,g/=p;const m=1/Math.max(.3,_*f[0]+g*f[1]);l.push([_*m,g*m]),o.push([n[c][0]+_*t[c]*m,n[c][1]+g*t[c]*m]),a.push([n[c][0]-_*e[c]*m,n[c][1]-g*e[c]*m]),r.push(c>0&&c<i-1?h[0]*u[1]-h[1]*u[0]:0)}return{L:o,R:a,turn:r,M:l,d:s}}function Xh(n,t,e,i){const s=i.gap??Math.max(.5,e*.16),o=i.turns??1.25,a=i.dir??1,r=i.taper??1,l=e*(1+r)/2+s,c=i.R??o*l+.42*e,h=[-t[1]*a,t[0]*a],u=[n[0]+h[0]*c,n[1]+h[1]*c],f=[-h[0],-h[1]],d=[],_=[],g=Math.max(.55*e*r,.3),p=Math.min(o*2*Math.PI,2*Math.PI*(c-g)/l);let m=0;for(;m<p;){const v=.3/Math.max(.5,c-l*m/(2*Math.PI));m=Math.min(p,m+v);const M=c-l*m/(2*Math.PI),x=a*m,y=Math.cos(x),w=Math.sin(x);d.push([u[0]+M*(f[0]*y-f[1]*w),u[1]+M*(f[0]*w+f[1]*y)]),_.push(e*(1+(r-1)*(m/p)))}return{pts:d,ws:_,centre:u}}function Cn(n,t={}){n=n.map(d=>[d[0],d[1]]);let e=Mr(n,t.width,3),i=Mr(n,t.round,.5),s=Mr(n,t.inner,.15),o=n.map(()=>!1);const a=t.start??"blunt",r=t.end??"blunt";let l=n,c=[];const h=(d,_)=>{const[g,p]=_?[d[1],d[0]]:[d[d.length-2],d[d.length-1]],m=Math.hypot(p[0]-g[0],p[1]-g[1])||1;return[(p[0]-g[0])/m,(p[1]-g[1])/m]};let u={a:0,b:n.length};if(r==="spiral"){const d=Xh(l[l.length-1],h(l,!1),e[e.length-1],t.spiral||{});l=l.concat(d.pts),e=e.concat(d.ws),i=i.concat(d.pts.map(()=>0)),s=s.concat(d.pts.map(()=>0)),o=o.concat(d.pts.map(()=>!0)),c.push(d.centre)}if(a==="spiral"){const d=t.startSpiral||t.spiral||{},_=Xh(l[0],h(l,!0),e[0],{...d,dir:-(d.dir??1)}),g=_.pts.length;l=_.pts.slice().reverse().concat(l),e=_.ws.slice().reverse().concat(e),i=Array(g).fill(0).concat(i),s=Array(g).fill(0).concat(s),o=Array(g).fill(!0).concat(o),u={a:g,b:u.b+g},c.push(_.centre)}r==="point"&&(e[e.length-1]=Math.min(e[e.length-1],.08)),a==="point"&&(e[0]=Math.min(e[0],.08));const f={kind:"stroke",ctrl:n,spine:l,widths:e,dense:o,coil:c,body:u,start:a,end:r,opts:t,roundOut:i,roundIn:s,capRound:t.capRound??.3};return f.outline=kf(f,0,0),f}function kf(n,t,e,i=0){let s=n.spine;const o=s.length,a=Os(n,t),r=Os(n,e),l=n.widths.map((g,p)=>Math.max(.02,g/2-a[p])),c=n.widths.map((g,p)=>Math.max(.02,g/2-r[p])),h=a.map((g,p)=>(g+r[p])/2),u=n.widths.map((g,p)=>Math.max(0,n.roundOut[p]*g-h[p])),f=n.widths.map((g,p)=>Math.max(0,n.roundIn[p]*g+h[p])),d=(h[0]+h[o-1])/2,_=[n.start,n.end].map((g,p)=>g==="flat"?0:Math.max(0,n.capRound*n.widths[p?o-1:0]-d*.5));if(i>0){s=s.map(g=>g.slice());for(const[g,p]of[[!0,n.start],[!1,n.end]]){if(p!=="blunt"&&p!=="flat")continue;const m=g?0:o-1,v=g?1:o-2,M=s[m][0]-s[v][0],x=s[m][1]-s[v][1],y=Math.hypot(M,x),w=Math.min(i,y*.45);s[m]=[s[m][0]-M/y*w,s[m][1]-x/y*w]}}return ev(s,l,c,u,f,[n.start,n.end],_,n.dense)}function Os(n,t){const e=n.spine.length;if(!Array.isArray(t))return Array(e).fill(t);const i=n.ctrl.length,s=n.body.a;return Array.from({length:e},(o,a)=>t[Math.max(0,Math.min(i-1,a-s))]??t[t.length-1])}const In=n=>Array.isArray(n)?n.reduce((t,e)=>t+e,0)/n.length:n;function ev(n,t,e,i,s,o,a,r){const l=n.length,{L:c,R:h,turn:u,d:f}=js(n,t,e),d=.02,_=[],g=[];for(let M=0;M<l;M++)_.push(c[M]),g.push(r[M]?0:u[M]>d?s[M]:u[M]<-d?i[M]:0);const p=(M,x,y,w)=>{const b=y+w,D=[-x[1],x[0]],E=[M[0]+D[0]*(y-w)/2,M[1]+D[1]*(y-w)/2],T=Math.atan2(x[1],x[0]),L=Math.max(4,Math.ceil(Math.PI*b/2/.25));for(let R=1;R<L;R++){const O=T+Math.PI/2-Math.PI*R/L;_.push([E[0]+Math.cos(O)*b/2,E[1]+Math.sin(O)*b/2]),g.push(0)}};o[1]==="round"||o[1]==="spiral"?p(n[l-1],f[l-2],t[l-1],e[l-1]):o[1]!=="point"&&(g[g.length-1]=a[1]);for(let M=l-1;M>=0;M--)_.push(h[M]),g.push(r[M]?0:u[M]<-d?s[M]:u[M]>d?i[M]:0),M===l-1&&o[1]!=="round"&&o[1]!=="spiral"&&o[1]!=="point"&&(g[g.length-1]=a[1]);o[0]==="round"||o[0]==="spiral"?p(n[0],[-f[0][0],-f[0][1]],e[0],t[0]):o[0]!=="point"&&(g[g.length-1]=a[0],g[0]=a[0]);let m=_,v=g;return xl(m)<0&&(m=m.slice().reverse(),v=v.slice().reverse()),Ke(m,v,{closed:!0,step:.2})}function yl(n={}){const{c:t=[0,0],w:e=10,h:i=8,rot:s=0}=n,o=n.r??(n.round??.3)*Math.min(e,i),a={kind:"plate",c:t,w:e,h:i,r:o,rot:s,opts:n};return a.outline=Uf(a,0),a}function Uf(n,t){const e=n.w-2*t,i=n.h-2*t,s=$i(n.r-t,0,Math.min(e,i)/2),o=Math.cos(n.rot*ni),a=Math.sin(n.rot*ni),r=[[-e/2,-i/2],[e/2,-i/2],[e/2,i/2],[-e/2,i/2]];return Ke(r,s,{closed:!0,step:.2}).map(([c,h])=>[n.c[0]+c*o-h*a,n.c[1]+c*a+h*o])}function nv(n,t={}){const e=n.map(a=>[a[0],a[1]]),i=Mr(e,t.round,0),s=xl(e)<0?e.slice().reverse():e,o={kind:"poly",pts:s,opts:t};return o.radii=xl(e)<0?i.slice().reverse():i,o.outline=Ke(s,o.radii,{closed:!0,step:.2}),o}function Nf(n,t){const[e,i]=Array.isArray(t)?t:[t,t];if(n.kind==="stroke")return kf(n,e,i,(In(e)+In(i))/2);if(n.kind==="plate")return Uf(n,(In(e)+In(i))/2);const s=(In(e)+In(i))/2,o=n.pts.length,a=[];for(let r=0;r<o;r++){const l=n.pts[(r-1+o)%o],c=n.pts[r],h=n.pts[(r+1)%o],u=Fa([c[0]-l[0],c[1]-l[1]]),f=Fa([h[0]-c[0],h[1]-c[1]]),d=[-u[1],u[0]],_=[-f[1],f[0]];let g=Fa([d[0]+_[0],d[1]+_[1]]);const p=1/Math.max(.3,g[0]*d[0]+g[1]*d[1]);a.push([c[0]+g[0]*s*p,c[1]+g[1]*s*p])}return Ke(a,n.radii.map(r=>Math.max(0,r-s)),{closed:!0,step:.2})}const Fa=n=>{const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]};function Ff(n,t=0){return e=>{for(const i of n)e.beginPath(),po(e,i.outline,!0),e.fill(),t>0&&(e.lineWidth=t*2,e.lineJoin="round",e.stroke())}}const Oa={inset:1,line:.42};function bs(n,t,e={}){var f,d,_;const i=typeof performance<"u"?performance.now():0,s=Array.isArray(t)?t:[t],o=e.height??1.2,a=e.depth??.35,r=new Be(`carve:${e.seed??0}:${s.length}:${(_=(d=(f=s[0])==null?void 0:f.outline)==null?void 0:d[0])==null?void 0:_.map(g=>g.toFixed(2)).join(",")}`),l=.05*(e.irregularity??1);if(e.raise!==!1){const g=e.shoulder??$i(o*.35,.2,.6);n.raise(Ff(s),{height:o,shoulder:g,profile:"plateau"})}const c=[],h=[],u=[];for(const g of s){const p=g.opts||{},m=p.contour!==void 0?p.contour:e.contour!==void 0?e.contour:Oa,v=p.fill!==void 0?p.fill:e.fill??null,M=p.ticks!==void 0?p.ticks:e.ticks??null,x=m?m.line??Oa.line:0,y=m?m.inset??Oa.inset:.6,[w,b]=Array.isArray(y)?y:[y,y],D=Nf(g,[w,b]),E=In(w),T=In(b);if(m&&c.push({pts:Kr(D,r,l,!0),w:x,closed:!0}),M&&rv(g,D,[w,b],M,x,c),!v||v.kind==="none")continue;const L=v.line??x??.4,R=v.gap??Math.max(.35,L*.9);v.kind==="leiwen"?h.push({C:D,fill:v}):v.kind==="spirals"?u.push(...sv(g,D,{...v,_insets:[w,b]},L,m?x:0,R,r,l,c)):v.kind==="lines"?Of(g,[E,T],v,L,R,m?x:0,c,r,l):v.kind==="scales"?lv(g,D,v,L,c):v.kind==="coil"&&zf(g,[E,T],v,L,m?x:0,R,c,r,l)}if(c.length){let g=0;for(const p of c)g=Math.max(g,p.w);n.sink(p=>{p.lineCap="round",p.lineJoin="round";let m=null;for(const v of c)v.clip!==m&&(m&&p.restore(),m=v.clip||null,m&&(p.save(),p.beginPath(),po(p,m,!0),p.clip())),p.lineWidth=v.w,p.beginPath(),po(p,v.pts,!!v.closed),p.stroke();m&&p.restore()},{depth:a,shoulder:g*.45,profile:"u"})}for(const{C:g,fill:p}of h)Yr(n,m=>{m.beginPath(),po(m,g,!0),m.fill()},{pitch:p.pitch??1,line:p.lineFrac??.45,depth:p.depth??a,roundness:p.roundness??.15,echo:0,eyes:0,seed:e.seed??0,...p.leiwen||{}},{margin:p.margin??.35,level:o});return{spirals:u,grooves:c.length,ms:Math.round((typeof performance<"u"?performance.now():0)-i)}}function iv(n,t){if(n.kind==="stroke"){const l=Math.max(...n.widths),c=un(n.spine.slice(n.body.a,Math.max(n.body.a+2,n.body.b)),Math.max(.3,l/24)),{M:h}=js(c,c.map(()=>0),c.map(()=>0)),u=[];for(let f=-l/2;f<=l/2;f+=Math.max(.3,l/24))for(let d=0;d<c.length;d++)u.push([c[d][0]+h[d][0]*f,c[d][1]+h[d][1]*f]);return u}let e=1/0,i=1/0,s=-1/0,o=-1/0;for(const[l,c]of t)e=Math.min(e,l),i=Math.min(i,c),s=Math.max(s,l),o=Math.max(o,c);const a=[],r=Math.max(.3,Math.min(s-e,o-i)/30);for(let l=i;l<=o;l+=r)for(let c=e;c<=s;c+=r)a.push([c,l]);return a}function sv(n,t,e,i,s,o,a,r,l){const c=e.pitch??i*2.3,h=(e.size??1/0)/2,u=(e.min??Math.max(2.2*c,1.4))/2,f=n.kind==="stroke"?Math.max(...n.widths):Math.min(n.w??10,n.h??10);t=un(t.concat([t[0]]),Math.max(.2,f/35));const _=y=>qh(y,t)?jh(y,t)-s/2-o-i/2:-1,g=[];if(n.kind==="stroke"&&e.chain!==!1){const[y,w]=e._insets||[0,0],b=un(n.spine.slice(n.body.a,Math.max(n.body.a+2,n.body.b)),.25),{M:D}=js(b,b.map(()=>0),b.map(()=>0)),E=Os(n,y).slice(n.body.a,n.body.b),T=Os(n,w).slice(n.body.a,n.body.b),L=mo(n.spine.slice(n.body.a,n.body.b),T.map((k,N)=>(k-E[N])/2),b),R=b.map((k,N)=>[k[0]+D[N][0]*L[N],k[1]+D[N][1]*L[N]]),O=R.map(k=>Math.min(_(k),h)),A=[0];for(let k=1;k<R.length;k++)A.push(A[k-1]+Math.hypot(R[k][0]-R[k-1][0],R[k][1]-R[k-1][1]));let I=O.findIndex(k=>k>=u),C=O.length-1-[...O].reverse().findIndex(k=>k>=u);if(I>=0&&C>I){const k=[];for(let F=I;F<=C;F++){const V=O[F];if(V<u)continue;const K=k[k.length-1];K&&A[F]-K.s<K.r+V+i+o||K&&Math.hypot(R[F][0]-K.c[0],R[F][1]-K.c[1])<K.r+V+i+o||!K&&A[F]-A[I]<V-.5*i||k.push({s:A[F],c:R[F],r:V})}const N=k.length;if(N){const F=k[0].s,V=k[N-1].s,K=Math.max(0,A[C]-(V+k[N-1].r)),Z=V+K*.5*(N>1?1:0),U=z=>{let Y=0;for(;Y<A.length-1&&A[Y]<z;)Y++;return Y},X=k.map((z,Y)=>N>1?U(F+(Z-F)*Y/(N-1)):U(z.s));for(let z=0;z<N;z++){const Y=R[X[z]];let J=Math.min(O[X[z]],h);for(const et of g)J=Math.min(J,Math.hypot(et.c[0]-Y[0],et.c[1]-Y[1])-et.r-i-o);z+1<N&&(J=Math.min(J,(Math.hypot(R[X[z+1]][0]-Y[0],R[X[z+1]][1]-Y[1])-i-o)/2)),J>=u*.85&&g.push({c:Y,r:J,k:z})}if(e.joints){const z=g.filter(Y=>Y.k!==void 0);for(let Y=0;Y+1<z.length;Y++){const J=Math.round((X[z[Y].k]+X[z[Y+1].k])/2),et=Math.max(...n.widths);l.push({pts:[[R[J][0]+D[J][0]*et,R[J][1]+D[J][1]*et],[R[J][0]-D[J][0]*et,R[J][1]-D[J][1]*et]],w:e.jointLine??i,clip:t})}}}}}const p=iv(n,t).filter(y=>qh(y,t)),m=p.map(y=>{let w=Math.min(jh(y,t)-s/2-o-i/2,h);for(const b of g)w=Math.min(w,Math.hypot(b.c[0]-y[0],b.c[1]-y[1])-b.r-i-o);return w});for(;;){let y=-1,w=u;for(let E=0;E<p.length;E++)m[E]>=w&&(w=m[E],y=E);if(y<0)break;const b=p[y],D=Math.min(w,h);g.push({c:b,r:D});for(let E=0;E<p.length;E++){const T=Math.hypot(p[E][0]-b[0],p[E][1]-b[1])-D-i-o;T<m[E]&&(m[E]=T)}}let v=e.hand==="left"?1:-1;const M=$i(e.square??0,0,1),x=2+M*3;for(const y of g){const{d:w,p:b}=tv(y.c,t),D=Math.atan2(b[1]-y.c[1],b[0]-y.c[0]),E=Math.max(i*.55,c*.35),L=Math.max(.75,(y.r-E)/c)*2*Math.PI,R=[],O=e.tail??"merge",A=O==="merge"&&s>0?w-s*.15:y.r,I=Math.PI*(e.lead??.4);O==="radial"&&s>0&&R.push([y.c[0]+Math.cos(D)*(w-s*.2),y.c[1]+Math.sin(D)*(w-s*.2)]);for(let C=0;C<=L+1e-6;){let k=y.r-(y.r-E)*C/L;if(C<I){const Z=C/I;k+=(A-y.r)*(1-Z)*(1-Z)}const N=D+v*C,F=Math.cos(N),V=Math.sin(N),K=M>0?1/Math.pow(Math.pow(Math.abs(F),x)+Math.pow(Math.abs(V),x),1/x):1;R.push([y.c[0]+F*k*K,y.c[1]+V*k*K]),C+=Math.min(.3,Math.max(.22,c*.25)/Math.max(.3,k))}l.push({pts:Kr(R,a,r*.5),w:i}),e.hand!=="left"&&e.hand!=="right"&&(v=-v)}return g}function Of(n,[t,e],i,s,o,a,r,l,c){const h=i.pitch??s*2.4;if(n.kind!=="stroke")return zf(n,[t,e],{...i,closed:!0},s,a,o,r,l,c);const f=(Math.min(...n.widths)-t-e)/2-a/2-o-s/2;if(f<0)return;const d=Math.max(0,Math.floor(f/h+1e-6)),_=(e-t)/2,g=[];for(let M=-d;M<=d;M++)g.push(_+M*h*(i.count==="odd"||d%1===0,1));const p=n.spine,{M:m}=js(p,p.map(()=>0),p.map(()=>0)),v=(t+e)/2+a+o;for(const M of g){let x=p.map((D,E)=>[D[0]+m[E][0]*M,D[1]+m[E][1]*M]);x=Ke(x,x.map((D,E)=>n.dense[E]?0:Math.max(.2,n.widths[E]*.45-Math.abs(M))),{step:.2});const y=Rn(x),w=n.start==="spiral"?0:v,b=n.end==="spiral"?0:v;y-w-b<h||r.push({pts:Kr(ov(x,w,y-b),l,c*.6),w:s})}}function ov(n,t,e){const i=[];let s=0;for(let o=1;o<n.length;o++){const a=n[o-1],r=n[o],l=Math.hypot(r[0]-a[0],r[1]-a[1]),c=s,h=s+l;if(h>=t&&c<=e&&l>0){const u=Math.max(0,(t-c)/l),f=Math.min(1,(e-c)/l);i.length||i.push([a[0]+(r[0]-a[0])*u,a[1]+(r[1]-a[1])*u]),i.push([a[0]+(r[0]-a[0])*f,a[1]+(r[1]-a[1])*f])}s=h}return i}function zf(n,[t,e],i,s,o,a,r,l,c){if(n.kind==="stroke")return Of(n,[t,e],{...i,kind:"lines"},s,a,o,r,l,c);if(n.kind!=="plate")return;const h=i.pitch??s*2.4,u=(t+e)/2+(o?o/2+a+s/2:0);let f=n.w/2-u,d=n.h/2-u;const _=Math.max(0,n.r-u),g=i.hand==="right"?-1:1,p=[],m=[];let v=0;const M=(T,L,R)=>{p.push([T,L*g]),m.push(R)},x=i.offset??[0,0];for(;f>h*.55&&d>h*.55&&v<60;){const T=Math.max(h*.3,Math.min(_-v*h,f,d));v===0&&M(-f,-d+(i.closed?0:h),T),M(f,-d,T),M(f,d,T),M(-f,d,T);const L=f-h,R=d-h;if(M(-f,-R+(i.closed,0),Math.max(h*.3,Math.min(_-(v+.5)*h,L,R))),f=L,d=R,v++,i.rings&&v>=i.rings)break}if(p.length<3)return;const y=p[p.length-1];p.push([y[0]+Math.max(0,f)*2*.6,y[1]]),m.push(0),m[0]=0;const w=Ke(p,m,{step:.2}),b=Math.cos(n.rot*ni),D=Math.sin(n.rot*ni),E=w.map(([T,L])=>[n.c[0]+x[0]+T*b-L*D,n.c[1]+x[1]+T*D+L*b]);r.push({pts:Kr(E,l,c*.6),w:s})}function rv(n,t,[e,i],s,o,a){if(n.kind!=="stroke"){const p=un(n.outline.concat([n.outline[0]]),s.pitch??2.2),m=(In(e)+In(i))/2;for(const v of p){let M=1/0,x=null;for(const D of t){const E=Math.hypot(D[0]-v[0],D[1]-v[1]);E<M&&(M=E,x=D)}const y=s.length??m,w=(x[0]-v[0])/(M||1),b=(x[1]-v[1])/(M||1);a.push({pts:[[v[0]-w*.4,v[1]-b*.4],[v[0]+w*y,v[1]+b*y]],w:s.line??o*.9,clip:n.outline})}return}const r=n.spine.slice(n.body.a,n.body.b);if(r.length<2)return;const l=s.side==="both"?[1,-1]:s.side==="right"?[-1]:s.side==="outer"?[av(r)]:[1],c=s.pitch??2.2,h=un(r,c),{M:u}=js(h,h.map(()=>0),h.map(()=>0)),f=mo(r,n.widths.slice(n.body.a,n.body.b),h),d=mo(r,Os(n,e).slice(n.body.a,n.body.b),h),_=mo(r,Os(n,i).slice(n.body.a,n.body.b),h),g=s.skipEnds??1;for(let p=g;p<h.length-g;p++)for(const m of l){const v=f[p]/2,M=m>0?d[p]:_[p],x=s.length??M,y=v+.4,w=v-x;a.push({pts:[[h[p][0]+u[p][0]*m*y,h[p][1]+u[p][1]*m*y],[h[p][0]+u[p][0]*m*w,h[p][1]+u[p][1]*m*w]],w:s.line??o*.9,clip:n.outline})}}function av(n){let t=0;for(let e=1;e<n.length-1;e++){const i=n[e-1],s=n[e],o=n[e+1];t+=(s[0]-i[0])*(o[1]-s[1])-(s[1]-i[1])*(o[0]-s[0])}return t>0?-1:1}function mo(n,t,e){return e.map(i=>{let s=1/0,o=t[0];for(let a=0;a<n.length;a++){const r=Math.hypot(n[a][0]-i[0],n[a][1]-i[1]);r<s&&(s=r,o=t[a])}return o})}function lv(n,t,e,i,s){const o=e.pitch??2.6;if(n.kind!=="stroke")return;const a=n.spine.slice(n.body.a,n.body.b),r=un(a,o*.62),{M:l,d:c}=js(r,r.map(()=>0),r.map(()=>0)),h=mo(a,n.widths.slice(n.body.a,n.body.b),r);for(let u=0;u<r.length;u++){const f=h[u]/2,d=Math.ceil(f/o)+1,_=c[Math.min(u,c.length-1)],g=Math.atan2(_[1],_[0]);for(let p=-d;p<=d;p++){const m=(p+u%2*.5)*o;if(Math.abs(m)>f+o)continue;const v=[r[u][0]+l[u][0]*m,r[u][1]+l[u][1]*m],M=[];for(let x=0;x<=12;x++){const y=g-Math.PI/2+Math.PI*x/12;M.push([v[0]+Math.cos(y)*(o/2-i*.3),v[1]+Math.sin(y)*(o/2-i*.3)])}s.push({pts:M,w:i,clip:t})}}}function Dr(n,t={}){const{c:e=[0,0],w:i=12,h:s=10,rot:o=0}=t,r=2+(1-$i(t.round??.45,0,1))*6,l=t.height??2,c=1.6+(1-(t.crown??.5))*5,h=t.base==="field"?n.heightAt(e[0],e[1]):t.base??0,{cols:u,rows:f,ppmm:d,field:_}=n,g=Math.hypot(i,s)/2+1,p=Math.max(0,Math.floor((e[0]-g)*d)),m=Math.min(u-1,Math.ceil((e[0]+g)*d)),v=Math.max(0,Math.floor((e[1]-g)*d)),M=Math.min(f-1,Math.ceil((e[1]+g)*d)),x=Math.cos(-o*ni),y=Math.sin(-o*ni),w=i/2,b=s/2,D=t.tilt??0,E=[-.25,.25];for(let T=v;T<=M;T++)for(let L=p;L<=m;L++){let R=0,O=0;for(const C of E)for(const k of E){const N=(L+.5+k)/d-e[0],F=(T+.5+C)/d-e[1],V=N*x-F*y,K=N*y+F*x,Z=Math.pow(Math.pow(Math.abs(V/w),r)+Math.pow(Math.abs(K/b),r),1/r);Z>=1||(O++,R+=Math.sqrt(1-Math.pow(Z,c))*(1+D*K/(b*Math.max(l,.001))*.5))}if(!O)continue;const A=h+l*R/4,I=T*u+L;A>_[I]&&(_[I]=A)}if(t.ring){const T=t.ring.gap??.8,L=t.ring.line??.45,R=Bf(e,w+T+L/2,b+T+L/2,r,o);n.sink(O=>{O.lineWidth=L,O.beginPath(),po(O,R,!0),O.stroke()},{depth:t.ring.depth??.35,shoulder:L*.45,profile:"u"})}if(t.slit!==!1){const T=t.slit||{},L=T.len??i*.32,R=T.width??Math.max(.5,s*.09),O=(T.rot??o)*ni,A=T.offset??[0,0];n.sink(I=>{I.save(),I.translate(e[0]+A[0],e[1]+A[1]),I.rotate(O),I.beginPath();const C=Math.min(R*.35,L/2);I.moveTo(-L/2+C,-R/2),I.arcTo(L/2,-R/2,L/2,R/2,C),I.arcTo(L/2,R/2,-L/2,R/2,C),I.arcTo(-L/2,R/2,-L/2,-R/2,C),I.arcTo(-L/2,-R/2,L/2,-R/2,C),I.closePath(),I.fill(),I.restore()},{depth:T.depth??l*.35,shoulder:Math.min(.3,R*.4),profile:"u"})}return{a:w,b,ex:r}}function Bf(n,t,e,i,s=0,o=96){const a=Math.cos(s*ni),r=Math.sin(s*ni),l=[];for(let c=0;c<o;c++){const h=c/o*Math.PI*2,u=Math.cos(h),f=Math.sin(h),d=t*Math.sign(u)*Math.pow(Math.abs(u),2/i),_=e*Math.sign(f)*Math.pow(Math.abs(f),2/i);l.push([n[0]+d*a-_*r,n[1]+d*r+_*a])}return l}function cv(n={}){const t=$i(n.round??.45,0,1);return Bf(n.c??[0,0],(n.w??12)/2,(n.h??10)/2,2+(1-t)*6,n.rot??0)}const Gf={lattice:"diagonal",size:9,levels:2,fill:"nested",pitch:.9,line:.48,depth:.4,outline:!0,clip:!0,minFree:.35,roundness:.1,jitter:.04,offset:[0,0],mode:"sunk",seed:0};function Hf(n={}){return{...Gf,...n}}function Zl(n,t={},e={}){const i=Yh(),s=Hf(e),o=t.rect??{x:0,y:0,w:n.width,h:n.height},a=new Be(`lozenge:${s.seed}:${o.x.toFixed(2)},${o.y.toFixed(2)},${o.w.toFixed(2)}`),r=s.pitch*s.line,l=uv(n,o,t,Math.max(0,t.margin??.6)+r/2);if(!l)return{cells:0,clipped:0,ms:0};const[c,h]=Array.isArray(s.size)?s.size:[s.size,s.size],u=s.lattice!=="square",f=u?[c/2,h/2]:[c,0],d=u?[-c/2,h/2]:[0,h],_=[o.x+o.w/2+s.offset[0],o.y+o.h/2+s.offset[1]];u||(_[0]-=c/2),_[1]-=h/2;const g=f[0]*d[1]-f[1]*d[0],p=(O,A)=>{const I=O-_[0],C=A-_[1];return[(I*d[1]-C*d[0])/g,(f[0]*C-f[1]*I)/g]};let m=1/0,v=-1/0,M=1/0,x=-1/0;for(const[O,A]of[[o.x,o.y],[o.x+o.w,o.y],[o.x,o.y+o.h],[o.x+o.w,o.y+o.h]]){const[I,C]=p(O,A);m=Math.min(m,Math.floor(I)),v=Math.max(v,Math.ceil(I)),M=Math.min(M,Math.floor(C)),x=Math.max(x,Math.ceil(C))}const y=[],w={cells:0,clipped:0},b=[0,.25,.5,.75,1],D=(O,A,I,C)=>{const k=(V,K)=>[_[0]+(O+V*I)*f[0]+(A+K*I)*d[0],_[1]+(O+V*I)*f[1]+(A+K*I)*d[1]];let N=0,F=0;for(const V of b)for(const K of b){if(V>0&&V<1&&K>0&&K<1&&!(V===.5&&K===.5))continue;F++;const[Z,U]=k(V,K);l.free(Z,U)&&N++}if(N===F){R(k,I,!1);return}if(!(N===0&&C>0)){if(C<s.levels){const V=I/2;D(O,A,V,C+1),D(O+V,A,V,C+1),D(O,A+V,V,C+1),D(O+V,A+V,V,C+1);return}s.clip&&N/F>=s.minFree&&R(k,I,!0)}},E=Math.abs(g),T=E/Math.hypot(d[0],d[1]),L=E/Math.hypot(f[0],f[1]),R=(O,A,I)=>{w.cells++,I&&w.clipped++;const C=s.pitch/(T*A),k=s.pitch/(L*A),N=s.jitter*s.pitch,F=U=>[U[0]+a.jitter(N),U[1]+a.jitter(N)],V=s.roundness*s.pitch,K=U=>[O(U*C,U*k),O(1-U*C,U*k),O(1-U*C,1-U*k),O(U*C,1-U*k)];s.outline&&y.push({pts:K(0),closed:!0,r:0});const Z=Math.floor(Math.min(.5/C,.5/k)-.35);if(s.fill==="nested"){for(let U=1;U<=Z;U++)y.push({pts:K(U).map(F),closed:!0,r:V});Z>=0&&Math.min(.5/C,.5/k)-Z>.85&&y.push({dot:O(.5,.5),r:r*.6})}else if(s.fill==="squared"){const U=[];let X=1;for(U.push(O(X*C,X*k));X<=Z;){const z=X,Y=X;U.push(O(1-Y*C,z*k),O(1-Y*C,1-Y*k),O(z*C,1-Y*k),O(z*C,(X+1)*k)),X++}U.length>2&&y.push({pts:U.map(F),closed:!1,r:V})}else if(s.fill==="spiral"){const U=O(.5,.5),X=Math.min(T,L)*A*.5-s.pitch*.9;if(X>s.pitch){const z=[],Y=(X-r)/s.pitch,J=a.next()<.5?1:-1,et=a.range(0,6.283);for(let it=0;it<=Y*2*Math.PI;it+=.2){const at=X-s.pitch*it/(2*Math.PI);z.push([U[0]+Math.cos(et+J*it)*at,U[1]+Math.sin(et+J*it)*at])}y.push({pts:z,closed:!1,r:0})}else y.push({dot:U,r:r*.8})}else s.fill==="dot"&&y.push({dot:O(.5,.5),r:Math.max(r,Math.min(T,L)*A*.12)})};for(let O=M;O<=x;O++)for(let A=m;A<=v;A++)D(A,O,1,0);return y.length&&hv(n,o,l,y,s,r),{...w,ms:Math.round(Yh()-i)}}function hv(n,t,e,i,s,o){const a=e.gateCanvas(),r=l=>{l.save(),l.beginPath(),l.rect(t.x,t.y,t.w,t.h),l.clip(),l.lineWidth=o,l.lineCap="round",l.lineJoin="round",l.beginPath();for(const c of i){if(c.dot)continue;let h=c.pts;c.r>0&&(h=Ke((c.closed,h),c.r,{closed:c.closed,step:Math.max(.1,o*.4)})),l.moveTo(h[0][0],h[0][1]);for(let u=1;u<h.length;u++)l.lineTo(h[u][0],h[u][1]);c.closed&&l.closePath()}l.stroke(),l.beginPath();for(const c of i)c.dot&&(l.moveTo(c.dot[0]+c.r,c.dot[1]),l.arc(c.dot[0],c.dot[1],c.r,0,Math.PI*2));l.fill(),l.globalCompositeOperation="destination-in",l.imageSmoothingEnabled=!0,l.drawImage(a.canvas,a.x,a.y,a.w,a.h),l.restore()};s.mode==="thread"?n.add(r,{height:s.depth,profile:"ridge"}):n.sink(r,{depth:s.depth,shoulder:o*.4,profile:"u"})}function uv(n,t,e,i){const{cols:s,rows:o,ppmm:a,field:r}=n;let l=Math.max(1/a,.2);t.w/l*(t.h/l)>32e5&&(l=Math.sqrt(t.w*t.h/32e5));const c=Math.ceil(t.w/l)+2,h=Math.ceil(t.h/l)+2,u=t.x-l,f=t.y-l,d=new Uint8Array(c*h);for(let A=0;A<h;A++)for(let I=0;I<c;I++)(!I||!A||I===c-1||A===h-1)&&(d[A*c+I]=1);const _=A=>typeof A=="function"?n.mask(A).data:A&&A.data?A.data:null,g=e.avoid===void 0?e.level!=null?null:"raised":e.avoid,p=g==="raised"?null:_(g),m=_(e.include),v=e.level,M=v==null?0:.04+.03*Math.abs(v),x=Math.max(0,Math.floor(t.x*a)),y=Math.min(s,Math.ceil((t.x+t.w)*a)),w=Math.max(0,Math.floor(t.y*a)),b=Math.min(o,Math.ceil((t.y+t.h)*a));for(let A=w;A<b;A++){const I=Math.min(h-2,Math.max(1,Math.floor(((A+.5)/a-f)/l)));for(let C=x;C<y;C++){const k=A*s+C;let N=!1;g==="raised"?N=r[k]>.05:p&&(N=p[k]>.5),!N&&m&&(N=m[k]<.5),!N&&v!=null&&(N=Math.abs(r[k]-v)>M),N&&(d[I*c+Math.min(c-2,Math.max(1,Math.floor(((C+.5)/a-u)/l)))]=1)}}const D=si(d,c,h),E=i/l,T=E*E,L=(A,I)=>{const C=Math.floor((A-u)/l),k=Math.floor((I-f)/l);return C<0||k<0||C>=c||k>=h?!1:D.dist2[k*c+C]>T};let R=null;return{free:L,gateCanvas:()=>{if(R)return R;const A=xr(c,h),I=il(A),C=I.createImageData(c,h);for(let k=0;k<h;k++)for(let N=0;N<c;N++){const F=Math.sqrt(D.dist2[k*c+N])-E,V=Math.max(0,Math.min(1,F+.5)),K=(k*c+N)*4;C.data[K]=C.data[K+1]=C.data[K+2]=255,C.data[K+3]=Math.round(V*255)}return I.putImageData(C,0,0),R={canvas:A,x:u,y:f,w:c*l,h:h*l},R},h:l,gw:c,gh:h}}const Yh=()=>typeof performance<"u"?performance.now():Date.now();let fv=class{constructor(){this.islands=[],this.bosses=[],this.tips=[],this.grooves=[],this.cuts=[],this.centres=[]}island(t){let e=this.islands.find(i=>i.id===t);return e||this.islands.push(e={id:t,shapes:[]}),e}add(t,e){return this.island(t).shapes.push(e),e}};const Jl=(n,t,e)=>Math.max(t,Math.min(e,n)),ve=(n,t,e)=>n+(t-n)*e;function Vf(n,t,e){const i=e.edge&&e.edge!=="none"?.2:0,s=If(t,{faceW:.66,spread:e.spread??1,reserve:i,invert:!!e.invert,taper:e.taper||0}),o=`taotie:${e.seed??0}:${t.x.toFixed(1)},${t.y.toFixed(1)}`,a=n.rng.fork(o),r=e.irregularity??1,l=e.lineWeight,c=Math.max(3.2*l,2.2),h={f:s,p:e,rng:a,panel:n,rect:t,sheet:new fv,s:s.s,H:s.H,lw:l,irr:r,edgeW:i*s.s,marks:{},dissolved:e.body==="dissolved",sq:Jl(e.square??.5,0,1),u:u=>u*s.s,bw:Math.max(Math.sqrt(s.s*Math.min(s.H,1.6*s.s))*.082*(e.bandWidth??1)*(e.body==="kui"?1.4:1),c),A(u,f,d=.008){return[s.X(u+a.jitter(d*r)),s.Y(f+a.jitter(d*r*.8))]},rc(u,f=2.6){return ve(u*f,u*.12,h.sq)},rcurl(u){return h.sq>.85?u*.2:ve(u*9,u*.2,h.sq*h.sq)},wob(u,f=.08){return Cf(u,a,f*r,Math.max(6,s.s*.12))},wj(u){return u*(1+a.jitter(.03*r))},band(u,f,d,_="square",g="square",{centre:p=!0}={}){const m=h.wob(f),v=typeof d=="number"?h.wj(d):d;return h.sheet.add(u,$l(m,v,_,g)),p&&h.sheet.centres.push({pts:m,w:typeof v=="number"?v:v(.3)}),m},xmax(){return s.hw}};return h.ext=Math.max(h.u(.06),(e.echoInset??1.4)+2*l+1),h}function dv(n,t,e,i=0){const s=[];for(let c=0;c<72;c++){const h=c/72*Math.PI*2,u=Math.cos(h),f=Math.sin(h),d=f>=0?1:.85,_=f*d*Math.pow(Math.max(0,1-u*u),.15)*(.92+.08*Math.abs(f));s.push([u*t*.5,_*e*.5])}const a=i*Math.PI/180,r=Math.cos(a),l=Math.sin(a);return s.map(([c,h])=>[n[0]+c*r-h*l,n[1]+c*l+h*r])}function qs(n){const t=n.p,e=t.jaw==="split";return{lip:e?Math.max(.21,t.lipY??0):t.lipY??.15,nostril:(e?Math.max(.21,t.lipY??0):t.lipY??.15)+.13,eye:t.eyeY??.5,hornRoot:.735,top:.955}}const hn=(n,t,e)=>n&&n[t]!==void 0?n[t]:e.p[t];function pv(n,t={}){const e=hn(t,"nose",n);if(e==="none")return;const i=qs(n),s=e==="flange",o=s?Math.max((t.width??.42)*n.bw,3.2):(t.width??.8)*n.bw,a=n.f.Y(t.from??(s?i.lip:i.nostril-.035)),r=n.marks.crestBottom??n.f.Y(t.to??(s?.92:.8));if(n.marks.noseHalf=o,e==="stack"){const c=n.u(.12),h=Math.max(2,Math.round((r-a)/c)),u=(r-a)/h;for(let f=0;f<h;f++){const d=a+f*u+u*.12,_=a+(f+1)*u-u*.12,g=new re([-n.ext,_-n.bw*.4],0).to([o*1.1,_-n.bw*.4]).turn(-90,n.rc(n.bw*.6)).fwd(Math.max(1,_-d-n.bw*.8));n.band("nose"+(n.dissolved?f:""),g.spine(),n.bw*.6,"flat","square",{centre:!1})}return}const l=Ke([[-n.ext,a],[o*1.12,a],[o,a+(r-a)*.25],[o*.96,r],[-n.ext,r]],[0,n.rc(o*.6),n.rc(o),0,0],{closed:!0});if(n.sheet.add("nose",Un(n.wob(l,.05))),e==="ridge"&&n.p.carving==="dense"){const c=Math.max(n.lw*4.5,n.u(.045)),h=o-(n.p.echoInset??1.4)-n.lw*1.2;if(h>n.lw*2)for(let u=a+c;u<r-c*.6;u+=c)n.sheet.grooves.push({pts:[[-n.lw,u],[h,u]]})}}function mv(n,t={}){let e=hn(t,"crest",n);if(e===!0&&(e="lozenge"),!e||e==="none")return;const i=n.f.Y(t.y??.83),s=n.u(.075)*(t.size??1),o=n.u(.085)*(t.size??1);if(e==="lozenge"){const a=Ke([[0,i-o],[s,i],[0,i+o],[-s,i]],n.rc(n.bw*.5,1),{closed:!0});n.sheet.add("crest",Un(n.wob(a,.04)));const r=.42;n.p.carving!=="none"&&n.sheet.grooves.push({pts:[[-n.lw,i-o*r],[s*r,i],[-n.lw,i+o*r]]}),n.marks.crestBottom=i-o*.55}else if(e==="shield"){const a=Ke([[-n.ext,i+o],[s*1.15,i+o],[s*.55,i-o],[-n.ext,i-o]],[0,n.rc(n.bw*.5),n.rc(n.bw*.6),0],{closed:!0});n.sheet.add("crest",Un(n.wob(a,.04))),n.p.carving!=="none"&&n.sheet.grooves.push({pts:[[0,i-o*.4],[0,i+o*.5]]}),n.marks.crestBottom=i-o*.8}else if(e==="cicada"){const a=Ke([[-n.ext,i+o],[s*1.1,i+o],[s*.35,i-o*1.3],[-n.ext,i-o*1.3]],[0,n.rc(n.bw*.4),n.rc(n.bw*.3),0],{closed:!0});n.sheet.add("crest",Un(a)),n.sheet.bosses.push({shape:Fn([s*.6,i+o*.45],s*.26),base:"plateau"});for(let r=1;r<=3;r++){const l=i+o*.2-r*o*.42;n.sheet.grooves.push({pts:[[-n.lw,l-o*.18],[s*(.75-r*.12),l]]})}n.marks.crestBottom=i-o}else if(e==="hooks"){const a=n.f.Y(.74),r=n.f.Y(.985);n.sheet.add("crest",Un([[-n.ext,a],[n.bw*.45,a],[n.bw*.45,r],[-n.ext,r]]));const l=Math.max(2,Math.round((r-a)/n.u(.08)));for(let c=0;c<l;c++){const h=a+(c+.6)/l*(r-a);n.band("crest",ke([n.bw*.3,h],0,n.bw*.6,{curl:120,radius:n.bw*.45,dir:-1}),n.bw*.55,"flat","round",{centre:!1})}n.marks.crestBottom=a}}function gv(n,t={}){const e=hn(t,"nostril",n);if(e==="none")return;const i=qs(n),s=n.f.Y(t.y??i.nostril),o=n.bw*(t.width??1),a=n.dissolved?(n.marks.noseHalf??n.bw)+n.u(.035):0;if(e==="bulb"){n.sheet.add("nostril",Cr([n.u(.04),s+n.u(.01)],n.u(.085),n.u(.05))),n.band("nostril",ke([n.u(.11),s],-90,n.u(.02),{curl:140,radius:n.u(.03),dir:-1}),o*.8,"square","round",{centre:!1});return}const r=n.f.X(t.reach??.16),l=Jl(n.u(.085),o*1.4,n.f.Y(.42)-s),c=new re([a,s],0).to([r,s]).curl({dir:1,size:[Math.max(o*2,Math.min(l,n.u(.075))),Math.max(o*2,Math.min(n.u(.08),r-a-o*.9))],pitch:o*1.4,turns:t.turns??.6,r:n.rcurl(o)});n.band("nostril",c.spine(),o,"flat","square")}function _v(n,t={}){const e=hn(t,"jaw",n);if(e==="none")return;const i=qs(n),s=n.f.Y(t.y??i.lip),o=n.bw*(t.width??1.05),a=Math.min(n.f.X(t.corner??n.p.mouthCorner??.38),n.f.hw-n.edgeW-o),r=n.dissolved?(n.marks.noseHalf??n.bw)+n.u(.03):0,l=Jl(Math.max(n.u(.1),(s-o*.6)*.85),o*1.2,s-o*.55),c=new re([r,s],0).to([a,s]).curl({dir:-1,size:[l,Math.max(o*1.5,Math.min(n.u(.17),(a-r)*.6))],pitch:o*1.5,turns:t.turns??n.p.jawTurns??.85,r:n.rcurl(o)});if(n.band("lip",c.spine(),o,"flat","square"),n.marks.mouthCorner=[a,s],e==="double"){const h=[a-n.u(.05),s+o*.4];n.band("lip2",ke(h,90,n.u(.035),{curl:200,radius:n.u(.032),dir:-1}),o*.8,"flat","round",{centre:!1})}e==="split"&&jf(n,t),e==="fanged"&&Wf(n,t)}function Wf(n,t={}){const e=qs(n),i=n.f.Y(t.y??e.lip)-n.bw*.45,s=t.count??2,o=n.bw*1,a=ke([n.f.X(.14),i],-90,Math.max(1,n.u(.06)),{curl:45,radius:n.u(.04),dir:-1});if(n.band("lip",a,fn(o,o*.18),"flat","point",{centre:!1}),s>1){const r=ke([n.f.X(.3),i],-98,Math.max(1,n.u(.08)),{curl:35,radius:n.u(.06),dir:1});n.band("lip",r,fn(o*1.15,o*.18),"flat","point",{centre:!1})}}function jf(n,t={}){const e=n.bw*.9,i=Math.max(e*.6,n.f.Y(t.lowerY??.055)),s=n.dissolved?n.u(.06):-n.ext,o=new re([s,i],0).to([n.f.X(.3),i]).curl({dir:1,size:[n.u(.07),n.u(.08)],pitch:e*1.5,turns:.6,r:n.rcurl(e)});n.band("jaw",o.spine(),e,"flat","square"),n.band("jaw",ke([n.f.X(.15),i+e*.4],90,n.u(.035),{curl:30,radius:n.u(.05),dir:-1}),fn(e,e*.2),"flat","point",{centre:!1})}function qf(n,t={}){const e=hn(t,"eye",n),i=qs(n),s=t.size??n.p.eyeSize,[o,a]=t.at??[n.p.eyeX??.27,i.eye],r=n.A(o,a,.004),l=hn(t,"pupil",n),c=n.bw*.95;let h;if(e==="chen"){const u=n.u(.32)*s,f=n.u(.17)*s,d=t.tilt??8,_=dv(r,u,f,d);n.sheet.add("eye",Un(_));const g=d*Math.PI/180,p=[r[0]-Math.cos(g)*u*.47,r[1]-Math.sin(g)*u*.47],m=[r[0]+Math.cos(g)*u*.47,r[1]+Math.sin(g)*u*.47],v=Math.max(n.f.X(.085),(n.marks.noseHalf??0)+c*.8+(n.dissolved?n.u(.035):0)),M=Math.max(c*1.2,Math.min(n.u(.11),p[1]-n.f.Y(.37))),x=new re(p,180).to([v,p[1]-Math.tan(g)*(p[0]-v)*.3]).turn(105,n.rc(c)).fwd(M).turn(40,n.rc(c*.6)).fwd(c*.5);n.band("eye",x.spine(),c,"flat","square");const y=new re(m,d*.6).fwd(n.u(.08)*s).turn(-95,n.rc(c*.8)).fwd(c*.7);n.band("eye",y.spine(),c*.88,"flat","square"),h=n.u(.07)*s,n.sheet.bosses.push({shape:Fn(r,h),base:"plateau",r:h}),n.marks.eyeTop=r[1]+f*.5,n.marks.eyeOuter=m[0]+n.u(.08)*s}else if(e==="square"){const u=n.u(.2)*s,f=n.u(.155)*s,d=Math.min(u,f)*.32;n.sheet.bosses.push({shape:zi(r,u,f,d,0),base:"ground",r:Math.min(u,f)*.5});const _=t.socket?c*.45:0;return t.socket&&n.sheet.add("eye",zi(r,u+c*.9,f+c*.9,d+c*.45,0)),h=f*.42,n.marks.eyeTop=r[1]+f*.5+_,n.marks.eyeOuter=r[0]+u*.5,l==="slit"?n.sheet.cuts.push(zi(r,u*.42,Math.max(n.lw*1.3,f*.1),n.lw*.6)):l==="dot"&&n.sheet.cuts.push(Fn(r,Math.max(n.lw,f*.12))),r}else{const u=e==="oval",f=n.u(u?.125:.105)*s,d=n.u(u?.09:.105)*s;n.sheet.add("eye",Cr(r,f,d,u?6:0));const _=f-c*.75,g=d-c*.75;if(n.sheet.bosses.push({shape:Cr(r,Math.max(_,f*.55),Math.max(g,d*.55),u?6:0),base:"plateau",r:Math.max(g,d*.55)}),h=Math.min(Math.max(_,f*.55),Math.max(g,d*.55)),t.canthus??n.p.eye!=="round"){const p=[r[0]-f*.92,r[1]-d*.2],m=new re(p,190).fwd(Math.max(c*.6,p[0]-Math.max(n.f.X(.1),(n.marks.noseHalf??0)+c))).turn(100,n.rc(c)).fwd(Math.max(c,n.u(.06)));n.band("eye",m.spine(),c*.9,"flat","square")}n.marks.eyeTop=r[1]+d,n.marks.eyeOuter=r[0]+f}return l==="slit"?n.sheet.cuts.push(zi(r,h*2.3,Math.max(n.lw*1.25,h*.18),n.lw*.6)):l==="dot"?n.sheet.cuts.push(Fn(r,Math.max(n.lw*.9,h*.3))):l==="ring"&&n.sheet.grooves.push({pts:wo(r,h*.6,0,360),boss:!0}),n.marks.eye=r,r}function Mv(n,t={}){const e=hn(t,"brow",n);if(!e||e==="none")return;const i=n.bw*.78,s=Math.max(n.f.Y(t.y??.685),(n.marks.eyeTop??0)+i*1.15+(n.dissolved?n.u(.02):0)),o=Math.max(n.f.X(.09),(n.marks.noseHalf??0)+(n.dissolved?n.u(.04):i*.2)),a=n.f.X(t.reach??.42);if(e==="L"){const r=n.marks.eye??n.A(.27,.5),l=(n.marks.eyeTop??r[1])+i*.9,c=Math.max((n.marks.noseHalf??0)+i*.9,n.f.X(.07)),h=new re([ve(c,r[0],.75),l],180).to([c,l]).turn(90,n.rc(i)).fwd(Math.max(i,l-r[1]+n.u(.02)));n.band("brow",h.spine(),i,"square","square"),n.marks.browTop=l+i*.5;return}else{const r=new re([o,s],8).to([ve(o,a,.55),s+n.u(.02)],0).to([a,s+n.u(.012)],n.rc(i));e==="hooked"?r.curl({dir:1,size:[n.u(.05),n.u(.05)],pitch:i*1.5,turns:.6,r:n.rcurl(i)}):r.turn(-90,n.rc(i)).fwd(n.u(.04)),n.band("brow",r.spine(),i,"square","square"),e==="kui"&&(n.sheet.bosses.push({shape:Fn([o+i*1.4,s],i*.42),base:"plateau",r:i*.42}),n.band("brow",ke([o,s-i*.2],200,i*.4,{curl:90,radius:i*.5,dir:1}),i*.6,"flat","round",{centre:!1}))}n.marks.browTop=s+i*.6}function vv(n,t={}){const e=hn(t,"horn",n);if(!e||e==="none")return;const i=bl[e]||bl.c,s=t.size??n.p.hornSize??1,o=Math.max(n.f.Y(qs(n).hornRoot),(n.marks.browTop??0)+n.bw*.25+(n.dissolved?n.u(.03):0),(n.marks.eyeTop??0)+n.bw*.9),a=t.rootX??(e==="bottle"||e==="knob"||e==="t"?.17:.11),r=t.root?n.A(t.root[0],t.root[1],.004):[Math.max(n.f.X(a),n.dissolved?(n.marks.noseHalf??0)+n.u(.05):0),o],l=Math.min(n.f.Y(.985),n.H-n.bw*.15),c=n.bw*(t.width??1.3);n.marks.hornRoot=r[1];const h=i(n,{root:r,top:l,w:c,hs:s,o:t});h&&n.p.hornTip>0&&n.sheet.tips.push({shape:$l($r(h,Rn(h)*.7,Rn(h)),c*.62,"round","round"),lift:n.p.hornTip})}const bl={c(n,{root:t,top:e,w:i,hs:s}){const o=e-i/2,a=Math.min(Math.max(n.u(.1),i*2.3),(n.xmax(o)-t[0])*.38),r=Math.max(t[0]+i*2,Math.min(n.f.X(.46*s),n.xmax(o)-a-i*.6)),l=new re(t,72).to([n.f.X(.17),o]).to([r,o],n.rc(i,3)).turn(-90,n.rc(i));return l.fwd(Math.max(i*.4,o-n.f.Y(.84)-i)).curl({dir:1,size:[a,a*.95],pitch:i*1.3,turns:1.1,r:n.rcurl(i)}),n.band("horn",l.spine(),Rs(i,.25,.75),"flat","square")},ram(n,{root:t,top:e,w:i,hs:s,o}){const a=e-i/2,r=Math.min(n.f.X(.5*s),n.xmax(a)-i*.7),l=Math.max(t[1]-i*.2,n.f.Y(.73)),c=new re(t,85).to([t[0]+i*.1,a]).to([r,a],n.rc(i,2)).turn(-90,n.rc(i));return c.fwd(Math.max(i,a-l)).curl({dir:-1,size:[Math.max(i*2.2,(r-t[0])*.58),Math.max(i*1.8,(a-l)*.62)],pitch:i*1.38,turns:o.turns??1.25,r:n.rcurl(i)}),n.band("horn",c.spine(),Rs(i,.3,.8),"flat","square")},buffalo(n,{root:t,top:e,w:i,hs:s}){const o=Ml([[t[0]-i*.4,t[1]],n.A(.3,.775),n.A(.5*s,.84),[Math.min(n.f.X(.64*s),n.xmax(e)-i),e-i*.6],[Math.min(n.f.X(.58*s),n.xmax(e)-i*1.6),e-i*.15]]);return n.band("horn",o,r=>i*(1.6-1.45*Math.pow(r,1.6)),"flat","point")},bottle(n,{root:t,top:e,w:i,hs:s}){const o=t[0],a=t[1]-i*.2,r=e,l=r-a,c=Math.max(n.u(.04),i*.4)*s,h=Math.max(n.u(.1),i)*s,u=n.u(.015),f=[[0,c],[.22,c],[.45,h*.95],[.7,h],[.88,h*.75],[1,h*.35]],d=f.map(([p,m])=>[o+m+u*p,a+p*l]),_=f.map(([p,m])=>[o-m+u*p,a+p*l]).reverse(),g=Ke([...d,..._],n.rc(i*.5,2),{closed:!0});return n.sheet.add("horn",Un(n.wob(g,.05))),n.p.carving!=="none"&&n.sheet.centres.push({pts:[[o,a+l*.25],[o+u*.8,a+l*.85]],w:h*2,force:!0}),[[o,a],[o+u,r]]},t(n,{root:t,top:e,w:i,hs:s}){const o=t[0],a=n.u(.22)*s,r=Math.max(n.bw*.85,n.u(.06)),l=e-r/2;n.band("horn",[[o,t[1]],[o,l]],n.bw*.75,"flat","flat",{centre:!1});for(const c of[-1,1]){const h=new re([o,l],c>0?0:180).fwd(a/2-r*.4).turn(c>0?-90:90,n.rc(r,1.4)).fwd(r*.9).turn(c>0?-90:90,n.rc(r*.6,1)).fwd(r*.35);n.band("horn",h.spine(),r,"flat","square",{centre:c>0})}return null},kui(n,{root:t,top:e,w:i,hs:s}){const o=e-i*.55,a=t[0]+i*.3,r=Math.min(n.f.X(.72*s),n.xmax(o)-i*1.2),l=i,c=new re([a,o],0).to([r,o]).curl({dir:-1,size:[i*2.2,i*2.4],pitch:l*1.4,turns:.75,r:n.rcurl(l)});return n.band("horn",c.spine(),l,"square","square"),n.sheet.add("horn",zi([a+i*.2,o-i*.15],i*1.6,i*1.3,i*.35)),n.sheet.bosses.push({shape:Fn([a+i*.35,o],i*.32),base:"plateau",r:i*.32}),n.band("horn",ke([a-i*.5,o-i*.5],180,i*.4,{curl:140,radius:i*.45,dir:-1}),l*.8,"flat","round",{centre:!1}),n.band("horn",[t,[a+i*.2,o-i*.5]],l,"flat","flat",{centre:!1}),null},coiled(n,{root:t,top:e,w:i,hs:s}){const o=Math.min(n.u(.17)*s,(e-t[1])*.75),a=new re(t,80).fwd(Math.max(i,e-t[1]-o*1.1-i*.5)).turn(-80,n.rc(i)).curl({dir:-1,size:[o*1.7,o*1.4],pitch:i*1.45,turns:1.9,r:n.rcurl(i)});return n.band("horn",a.spine(),Rs(i*.9,.4,.6),"flat","round")},knob(n,{root:t,top:e,w:i,hs:s}){const o=n.u(.048)*s,a=e-o;return n.band("horn",[[t[0],t[1]],[t[0]+n.u(.01),a]],n.u(.05),"flat","flat",{centre:!1}),n.sheet.add("horn",Fn([t[0]+n.u(.01),a],o)),n.sheet.bosses.push({shape:Fn([t[0]+n.u(.01),a],o*.7),base:"plateau",r:o*.7}),null},antler(n,{root:t,top:e,w:i,hs:s}){const o=[Math.min(n.f.X(.4*s),n.xmax(e)-i),e-i*.4],a=Ml([t,[ve(t[0],o[0],.35),ve(t[1],o[1],.6)],o]);n.band("horn",a,fn(i,i*.5),"flat","round");const r=Rn(a);for(const l of[.38,.68]){const c=$r(a,0,r*l),h=c[c.length-1];n.band("horn",ke(h,125,n.u(.06)*s,{curl:50,radius:n.u(.04),dir:-1}),fn(i*.7,i*.25),"flat","point",{centre:!1})}return a},crook(n,{root:t,top:e,w:i,hs:s}){const o=e-i/2,a=n.marks.eye??n.A(.27,.5),r=Math.min((n.marks.eyeOuter??a[0]+n.u(.1))+i*.1,n.f.hw-n.edgeW-i*.8),l=(n.marks.eyeTop??a[1])+i*(n.dissolved?1.2:.4),c=Math.max((n.marks.noseHalf??0)+i*1.2,n.f.X(.07)),h=new re([r,l],90).to([r,o]).turn(90,n.rc(i)).to([c,o]);return h.curl({dir:1,size:[Math.max(i*1.6,(o-l)*.7*s),Math.max(i*1.6,(r-c)*.55)],pitch:i*1.5,turns:1.2,r:n.rcurl(i)}),n.band("horn",h.spine(),i,"square","square")},zigzag(n,{root:t,top:e,w:i,hs:s}){const o=e-i/2,a=n.f.X(.28*s),r=Math.min(n.f.X(.5*s),n.xmax(o)-i),l=new re(t,0).to([a,t[1]]).to([a,o],n.rc(i)).to([r,o],n.rc(i)).turn(-90,n.rc(i)).fwd(n.u(.06));return n.band("horn",l.spine(),i,"flat","square")},leaf(n,{root:t,top:e,w:i,hs:s}){const o=[Math.min(n.f.X(.4*s),n.xmax(e)-i*.5),e-i*.2],a=Math.hypot(o[0]-t[0],o[1]-t[1]),r=Math.atan2(o[1]-t[1],o[0]-t[0])*180/Math.PI,l=[(t[0]+o[0])/2,(t[1]+o[1])/2];return n.sheet.add("horn",Un(Kl(l,a,Math.max(i*1.4,a*.32),r))),n.sheet.centres.push({pts:[[ve(t[0],o[0],.15),ve(t[1],o[1],.15)],[ve(t[0],o[0],.8),ve(t[1],o[1],.8)]],w:i*1.4,force:!0}),null}},xv=Object.keys(bl);function yv(n,t={}){let e=hn(t,"ear",n);if(e===!0&&(e="leaf"),!e||e==="none")return;const i=Math.max(n.f.X(.44),(n.marks.eyeOuter??0)+n.bw*(n.dissolved?1.2:.3)),s=n.f.Y(.56);if(i>n.xmax(s)-n.bw*1.2)return;if(e==="c"){const c=n.u(.05),h=[i+c,n.f.Y(.64)];n.band("ear",Lr(h,c,{start:200,sweep:250,dir:-1,shrink:.18}),n.bw*.8,"square","round");return}const o=[Math.min(i+n.u(.09),n.xmax(n.f.Y(.74))-n.bw*.4),n.f.Y(.735)],a=[i,s],r=Math.hypot(o[0]-a[0],o[1]-a[1]),l=Math.atan2(o[1]-a[1],o[0]-a[0])*180/Math.PI;n.sheet.add("ear",Un(Kl([(a[0]+o[0])/2,(a[1]+o[1])/2],r,Math.max(n.bw*1.2,n.u(.075)),l))),n.sheet.centres.push({pts:[[ve(a[0],o[0],.2),ve(a[1],o[1],.2)],[ve(a[0],o[0],.75),ve(a[1],o[1],.75)]],w:n.u(.075),force:!0}),n.marks.earOuter=Math.max(a[0],o[0])}function bv(n,t){const e=Math.max(n.f.X(n.p.body==="kui"?.34:.5),(n.marks.eyeOuter??0)+n.bw*.6),i=n.xmax(t)-n.edgeW-n.u(.02);return[e,i]}function wv(n,t={}){const e=hn(t,"body",n);if(e==="none")return!1;const i=n.f.Y(t.y??(e==="kui"?.6:.62)),[s,o]=bv(n,i),a=n.bw*(t.width??1.55);if(o-s<n.u(.26))return!1;const r=hn(t,"tail",n),l=Math.min(n.u(.17),n.H-i-a*.6),c=o-a*.5,h=[];if(e==="dissolved"){const g=ve(s,c,.48),p=n.u(.035),m=new re([s,i],0).to([g-p,i]).turn(-90,n.rc(a)).fwd(a*.8);n.band("body0",m.spine(),a,"square","square"),h.push(["body1",g+p])}else h.push(["body",s]);const[u,f]=h[0],d=new re([f,i],0).to([c,i]);if(r==="up"||r==="spiral"){const g=r==="spiral";d.curl({dir:1,size:[l,Math.min(n.u(.13),(o-s)*.3)],pitch:a*1.4,turns:g?1.5:.8,r:g?a*6:n.rcurl(a)})}else r==="down"?d.curl({dir:-1,size:[Math.min(n.u(.17),i-a),Math.min(n.u(.13),(o-s)*.3)],pitch:a*1.4,turns:.8,r:n.rcurl(a)}):d.fwd(Math.max(0,o-c-a*1.4));const _=n.band(u,d.spine(),Rs(a,.3,.75),"square","square");if(r==="forked"){const g=_[_.length-1];n.band(u,ke([g[0]-a*.2,g[1]+a*.3],70,n.u(.08),{curl:150,radius:n.u(.04),dir:1}),fn(a*.8,a*.4),"flat","square",{centre:!1}),n.band(u,ke([g[0]-a*.2,g[1]-a*.3],-70,n.u(.08),{curl:150,radius:n.u(.04),dir:-1}),fn(a*.8,a*.4),"flat","square",{centre:!1})}return n.marks.body={x0:s,x1:o,xt:c,yc:i,wB:a},(t.quills??!0)&&Xf(n,t),hn(t,"leg",n)&&Yf(n,t),!0}function Xf(n,t={}){const e=n.marks.body;if(!e)return;let i=t.count??n.p.quills;if(i===!0&&(i=3),!i)return;const s=e.yc+e.wB*.45,o=n.H-s-n.bw*.4;if(o<n.u(.04))return;const a=Math.min(n.u(.085),o*.8),r=e.x0+n.u(.08),l=e.xt-n.u(.05);if(l<=r)return;i=Math.min(i,Math.max(1,Math.floor((l-r)/n.u(.075))));const c=n.bw*.82;for(let h=0;h<i;h++){const f=[(i===1?(r+l)/2:ve(r,l,h/(i-1)))+n.rng.jitter(n.u(.008)),n.dissolved?s+n.u(.035):s-c*.3],d=ke(f,100,a*.55,{curl:105,radius:a*.35,dir:-1});n.band(n.dissolved?"quill"+h:n.marks.body&&n.p.body==="dissolved"?"body1":"body",d,fn(c,c*.45),"flat","round",{centre:!1})}}function Yf(n,t={}){const e=n.marks.body;if(!e)return;const i=n.bw*1.15,s=ve(e.x0,e.xt,t.legAt??.3),o=Math.max(n.f.Y(.1),i*1.4),a=e.yc-(n.dissolved?e.wB*.5+n.u(.035):0);if(a-o<n.u(.12))return;const r=new re([s,a],-90).to([s-n.u(.025),ve(a,o,.5)],0).to([s,o],n.rc(i,2)),l=n.dissolved?"leg":n.p.body==="dissolved"?"body1":"body";n.band(l,r.spine(),i,"flat","square");const c=t.claw??n.p.claw??3,h=i*.75;for(let u=0;u<c;u++){const f=[s-i*.2,o+i*.25-u*h*1.05];if(f[1]<h*.6)break;n.band(l,ke(f,180,n.u(.045+.015*(c-u)),{curl:100,radius:n.u(.026),dir:1}),fn(h,h*.3),"flat","point",{centre:!1})}n.band(l,ke([s+i*.3,o-i*.2],-20,n.u(.025),{curl:80,radius:n.u(.02),dir:-1}),fn(h*.8,h*.3),"flat","point",{centre:!1})}function Sv(n,t={}){const e=n.bw,i=t.eyeY??.56;qf(n,{at:[.25,i],eye:n.p.eye,size:(t.eyeSize??n.p.eyeSize)*1.2});const s=n.marks.eye,o=Math.min(s[1]-n.u(.09),n.f.Y(.42)),a=n.dissolved?n.u(.06):n.u(.035),r=new re([s[0]+n.u(.08),o],180).to([a+e,o]).curl({dir:-1,size:[Math.min(n.u(.09),s[1]-o),e*1.3],pitch:e*1.5,turns:.55,r:n.rcurl(e)});n.band("jaw",r.spine(),e,"square","square");const l=Math.max(e*.8,o-n.u(.15)),c=new re([s[0]+n.u(.04),l],180).to([a+e*1.4,l]).curl({dir:1,size:[Math.min(n.u(.07),l-e*.6),e*1.3],pitch:e*1.5,turns:.5,r:n.rcurl(e)});n.band("jaw2",c.spine(),e*.9,"square","square"),n.marks.eyeOuter=s[0]+n.u(.06)}function Ev(n,t={}){const e=hn(t,"edge",n);if(!e||e==="none")return;const i=n.bw*.9;if(e==="scrolls"){const s=n.f.Y(.05),o=Math.min(n.f.Y(.97),(n.marks.hornRoot??n.H)-n.u(.02)),a=Math.max(n.u(.15),i*3.4),r=Math.max(2,Math.floor((o-s)/a)),l=(o-s)/r;for(let c=0;c<r;c++){const h=s+(c+.5)*l,u=n.xmax(h)-i*.7,f=Math.min(n.edgeW||n.u(.18),u-n.f.X(.4)),d=u-f,_="edge"+c,g=h+l*.5-i*.75,p=h-l*.5+i*.75,m=c%2===0,v=m?d+i*.5:u-i*.5,M=m?u-i*.5:d+i*.5,x=new re([v,g],m?0:180).to([M,g]).turn(m?-90:90,n.rc(i)).to([M,p]).turn(m?-90:90,n.rc(i)).fwd(Math.max(i,Math.abs(M-v)*.62)).turn(m?-90:90,n.rc(i)).fwd(Math.max(i*.6,(g-p)*.42));n.band(_,x.spine(),i,"square","square")}return}if(e==="kui"){const s=Math.max((n.marks.earOuter??n.marks.eyeOuter??n.f.X(.5))+n.bw*1.2,n.f.X(.6)),o=n.f.Y(.94);n.f.Y(.2);const a=n.xmax(o)-i*.7;if(a-s<n.u(.16))return;const r=a-s,l=ve(s,a,.5),c=Math.min(i*1.25,r*.32),h=Math.max(c*2.6,n.u(.16)),u=Math.max(c*.7,n.f.Y(.06)),f=new re([l,u+h*.8],90).to([l,o-c*.5]).curl({dir:1,size:[Math.max(c*2.2,r*.55),Math.max(c*2,n.u(.1))],pitch:c*1.4,turns:.85,r:n.rcurl(c)});n.band("sidekui",f.spine(),Rs(c,.3,.75),"square","square");const d=[l,u+h*.5];n.sheet.add("sidekui",zi(d,Math.min(r,c*2.6),h,c*.6)),n.sheet.bosses.push({shape:Fn([d[0],d[1]+h*.08],c*.55),base:"plateau",r:c*.55}),n.band("sidekui",ke([d[0]-c*.6,u+c*.3],200,Math.max(c*.8,r*.25),{curl:110,radius:c*.8,dir:1}),c*.85,"flat","square",{centre:!1});const _=ve(u+h,o,.45);n.band("sidekui",ke([l-c*.3,_],180,Math.max(c,r*.35),{curl:100,radius:c*.7,dir:1}),fn(c*.9,c*.35),"flat","point",{centre:!1});for(let g=0;g<2;g++)n.band("sidekui",ke([l+c*.4,ve(_,o,.25+g*.3)],15,c*.9,{curl:100,radius:c*.5,dir:1}),fn(c*.75,c*.3),"flat","point",{centre:!1});n.marks.sideKui=s}}function Tv(n,t={}){const e=n.marks.body;if(!e)return;const i=t.count??2,s=n.bw*.75,o=n.f.Y(.3),a=e.x0+e.wB*2.6,r=e.xt;for(let l=0;l<i;l++){const c=ve(a,r,(l+.5)/i);if(c>n.xmax(o)-s*2)continue;const h=new re([c-n.u(.04),o],0).fwd(n.u(.06)).curl({dir:l%2?1:-1,size:[n.u(.05),n.u(.05)],pitch:s*1.5,turns:.7,r:n.rcurl(s)});n.band("frag"+l,h.spine(),s,"square","square")}}const Av=.12;function Rv(n,t){const e=n.f,i=n.dissolved?Math.max(n.u(.03),n.lw*2.2):0;return s=>{s.save(),e.apply(s),wl(s,n);for(const o of t){if(i){s.globalCompositeOperation="destination-out";for(const a of o.shapes)Ps(s,a,i);s.globalCompositeOperation="source-over"}for(const a of o.shapes)Ps(s,a,0)}s.restore()}}function wl(n,t){const e=t.f,i=e.H;n.beginPath(),n.moveTo(-t.ext,0),n.lineTo(e.widthAt(0),0),n.lineTo(e.widthAt(i),i),n.lineTo(-t.ext,i),n.closePath(),n.clip()}const sr=(n,t)=>Math.abs(n)>=t?0:Math.sqrt(1-n/t*(n/t));function $f(n,t){const e=t.p,i=t.f,s=t.sheet,o=e.style==="flush",a=e.relief,r=e.lineWeight,l=o?Av:a.motif,c=e.carving||"dense",h=i.taper?L=>i.warp(L):null,u=L=>h?Df(L,h):L,f=s.islands.map(L=>({id:L.id,shapes:L.shapes.map(u)})),d=s.bosses.map(L=>({...L,shape:u(L.shape)})),_=s.tips.map(L=>({...L,shape:u(L.shape)})),g=s.cuts.map(u),p=s.grooves.map(L=>({...L,pts:h?L.pts.map(h):L.pts})),m=s.centres.map(L=>({...L,pts:h?L.pts.map(h):L.pts})),v=o?.08:Math.max(.22,Math.min(.55,l*.42)),M=o?0:e.crown||0,x=Math.max(1.5,t.bw*.45),y=M?(L,R)=>Ns.plateau(L,R)*(1-M+M*Math.min(1,L/x)):"plateau",w=Rv(t,f);if(n.raise(w,{height:l,shoulder:v,profile:y}),!o&&_.length)for(const L of _){const R=l+L.lift*Math.max(0,a.boss-l)*.7;n.raise(O=>{O.save(),i.apply(O),wl(O,t),Ps(O,L.shape),O.restore()},{height:R,shoulder:Math.max(.6,t.bw*.35),profile:"plateau"})}const b=e.echoInset??1.4,D=r/2;if(o)n.sink(w,{depth:a.groove,profile:L=>sr(L-D*1.1,D)});else if(c==="dense"){const L=b+Math.max(r*2.6,1.6);n.sink(w,{depth:a.groove,profile:R=>Math.max(sr(R-b,D),sr(R-L,D))})}else c==="sparse"&&n.sink(w,{depth:a.groove*.8,profile:L=>sr(L-b,D)});const E=[];for(const L of p)L.boss||E.push(L.pts);if(c!=="none")for(const L of m){const R=L.w/2;let O;if(o?O=c==="dense"&&R>r*2.6:L.force?O=!0:c==="dense"?O=R>b*2+r*1.5||R<b-r*.9&&R>r*1.6:O=!1,!O)continue;const A=Rn(L.pts),I=Math.min(R*1.2,A*.3),C=Rf(L.pts,I,I);C.length>1&&E.push(C)}E.length&&n.sink(L=>{L.save(),i.apply(L),wl(L,t);for(const R of E)vl(L,R,r);L.restore()},{depth:a.groove,shoulder:D,profile:"u"});for(const L of d){const R=Math.max(.5,L.r??2),O=L.base==="plateau"?Math.min(.95,l/Math.max(a.boss,.001)):.3,A=o?Math.max(a.boss,l):Math.max(a.boss,l*1.2),I=Math.max(.3,Math.min(.6,R*.12));n.raise(C=>{C.save(),i.apply(C),Ps(C,L.shape),C.restore()},{height:A,shoulder:R,profile:(C,k)=>{if(C<=0)return 0;const N=Math.min(1,C/k),F=Math.sqrt(1-(1-N)*(1-N));return Ns.plateau(C,I)*(O+(1-O)*F)}})}const T=p.filter(L=>L.boss);(g.length||T.length)&&n.sink(L=>{L.save(),i.apply(L);for(const R of g)Ps(L,R);for(const R of T)vl(L,R.pts,r);L.restore()},{depth:a.groove*1.4,shoulder:r*.45,profile:"u"})}const Kf={nose:pv,crest:mv,nostril:gv,jaw:_v,fangs:Wf,lowerJaw:jf,eye:qf,brow:Mv,horn:vv,ear:yv,body:wv,quills:Xf,leg:Yf,kuiHead:Sv,edge:Ev,fragments:Tv},Qe=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),_e=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),Zf={style:Qe(["relief","flush"],"relief","Style (V relief / IV flush)"),carving:Qe(["dense","sparse","none"],"dense","Plateau line work (V-a / V-b)"),nose:Qe(["ridge","plain","flange","stack","none"],"ridge","Nose"),nostril:Qe(["scroll","bulb","none"],"scroll","Nostrils"),crest:Qe(["lozenge","shield","cicada","hooks","none"],"lozenge","Forehead crest"),eye:Qe(["chen","oval","round","square"],"chen","Eye"),eyeSize:_e(.6,1.6,.05,1,"Eye size"),eyeX:_e(.18,.36,.01,.27,"Eye x (face units)"),eyeY:_e(.3,.62,.01,.5,"Eye height"),pupil:Qe(["slit","dot","ring","none"],"slit","Pupil"),brow:Qe(["none","band","hooked","kui","L"],"none","Brow"),horn:Qe(xv.concat("none"),"c","Horn"),hornSize:_e(.6,1.5,.05,1,"Horn size"),hornTip:_e(0,1,.05,0,"Horn tip high relief"),ear:Qe(["leaf","c","none"],"leaf","Ear (when no body)"),jaw:Qe(["hooked","double","split","fanged","none"],"hooked","Jaw"),lipY:_e(.08,.36,.01,.15,"Lip height"),mouthCorner:_e(.25,.7,.01,.38,"Mouth corner x"),jawTurns:_e(.5,1.6,.05,.85,"Jaw curl turns"),body:Qe(["band","kui","dissolved","none"],"band","Body"),tail:Qe(["up","down","forked","spiral"],"up","Tail"),leg:{type:"bool",default:!0,label:"Leg & claw"},claw:_e(2,3,1,3,"Claw toes"),quills:_e(0,6,1,3,"Dorsal quills"),edge:Qe(["none","scrolls","kui"],"none","Outer edge filler"),square:_e(0,1,.05,.55,"Squareness (云纹 → 雷纹)"),bandWidth:_e(.6,2,.05,1,"Band width"),spread:_e(.7,1.4,.05,1,"Face spread"),taper:_e(-.6,.95,.05,0,"Panel taper"),invert:{type:"bool",default:!1,label:"Inverted (lid)"},crown:_e(0,.5,.05,0,"Plateau crown (V-b)"),irregularity:_e(0,2,.1,1,"Hand irregularity"),seed:_e(0,99,1,0,"Seed"),lineWeight:_e(.3,1.6,.05,.6,"Line weight","mm"),echoInset:_e(.6,3,.05,1.4,"Contour echo inset","mm"),relief:{type:"group",label:"Relief levels",fields:{motif:_e(.2,6,.1,1.5,"Motif (L1)","mm"),boss:_e(.5,10,.1,3.4,"Boss (L2)","mm"),groove:_e(.1,1.2,.05,.45,"Groove","mm")}}},Pv={"T1-classic":{},"T2-ram":{horn:"ram",square:.65,quills:2},"T3-ox-heavy":{horn:"buffalo",eye:"round",pupil:"ring",crest:"shield",body:"none",ear:"none",jaw:"fanged",nostril:"bulb",carving:"sparse",crown:.3,hornTip:.6,bandWidth:1.25,square:.3,relief:{motif:2.4,boss:5}},"T4-bottle-horn":{horn:"bottle",body:"none",ear:"none",edge:"kui"},"T5-kui-horn":{horn:"kui",crest:"hooks",body:"none",ear:"leaf"},"T6-t-horn":{horn:"t",body:"none",ear:"none",edge:"kui",brow:"band"},"T7-dissolved":{body:"dissolved",horn:"zigzag",nose:"plain",brow:"band",square:.75,quills:2},"T8-two-kui":{body:"kui",horn:"t",nose:"flange",crest:"none",eye:"chen",quills:2,square:.7},"T9-flat-band":{style:"flush",horn:"c",lineWeight:.7,bandWidth:1.2,relief:{motif:.4,boss:1.4,groove:.45}},"T10-blade":{taper:.92,body:"none",ear:"none",horn:"c",hornSize:.8,nose:"plain",crest:"none",spread:.85},"houmuwu-frieze":{body:"kui",horn:"t",nose:"flange",crest:"none",eye:"round",pupil:"dot",eyeSize:.85,tail:"up",quills:2,leg:!0,claw:2,square:.85,bandWidth:1.15,lineWeight:1,echoInset:2,relief:{motif:2.6,boss:5,groove:.75}},"houmuwu-leg":{body:"none",horn:"c",hornSize:1,hornTip:.5,nose:"flange",crest:"none",eye:"oval",pupil:"ring",eyeSize:1.15,ear:"none",nostril:"none",jaw:"double",lipY:.24,mouthCorner:.42,jawTurns:1.15,carving:"sparse",crown:.35,square:.12,bandWidth:1.55,lineWeight:1.1,echoInset:2.4,relief:{motif:3.6,boss:7.5,groove:.8}},"fangyi-body":{body:"dissolved",horn:"ram",hornSize:1.15,nose:"none",crest:"none",nostril:"none",eye:"square",pupil:"slit",eyeSize:1.1,eyeX:.36,eyeY:.47,brow:"L",jaw:"hooked",lipY:.3,mouthCorner:.62,jawTurns:1.3,ear:"none",edge:"scrolls",square:.92,bandWidth:1.6,spread:.92,lineWeight:.55,echoInset:1.1,relief:{motif:1.6,boss:3.2,groove:.4}},"fangyi-lid":{body:"dissolved",horn:"ram",hornSize:1.1,nose:"none",crest:"none",nostril:"none",eye:"square",pupil:"slit",eyeX:.36,eyeY:.5,brow:"L",jaw:"hooked",lipY:.27,mouthCorner:.55,jawTurns:1.1,ear:"none",edge:"scrolls",invert:!0,taper:-.3,square:.92,bandWidth:1.6,spread:.95,lineWeight:.55,echoInset:1.1,relief:{motif:1.5,boss:3,groove:.4}},"zun-belly":{style:"flush",body:"dissolved",horn:"ram",hornSize:1.15,nose:"flange",crest:"none",eye:"round",pupil:"none",eyeSize:.62,eyeX:.3,eyeY:.42,jaw:"hooked",lipY:.2,mouthCorner:.45,nostril:"none",brow:"L",quills:1,leg:!1,square:.92,bandWidth:1.3,lineWeight:.55,relief:{motif:.4,boss:1.8,groove:.4}},"zun-foot":{style:"flush",body:"none",horn:"crook",nose:"flange",crest:"none",eye:"round",pupil:"none",eyeSize:.62,eyeX:.3,eyeY:.4,jaw:"hooked",lipY:.17,nostril:"none",ear:"none",edge:"scrolls",taper:.18,square:.92,bandWidth:1.3,spread:.9,lineWeight:.5,relief:{motif:.4,boss:1.6,groove:.35}},"gu-waist":{body:"none",horn:"crook",nose:"flange",crest:"none",eye:"round",pupil:"dot",eyeSize:.8,eyeX:.3,eyeY:.36,jaw:"hooked",lipY:.12,nostril:"none",ear:"none",square:.9,bandWidth:1.05,carving:"sparse",lineWeight:.45,echoInset:.9,relief:{motif:.8,boss:2,groove:.3}},"gu-foot":{style:"flush",body:"none",horn:"crook",nose:"flange",crest:"none",eye:"square",pupil:"dot",eyeSize:.85,eyeX:.33,eyeY:.47,jaw:"hooked",lipY:.2,mouthCorner:.5,jawTurns:1.2,nostril:"none",ear:"c",taper:.3,square:.95,bandWidth:1.3,lineWeight:.45,relief:{motif:.35,boss:1.6,groove:.3}}},Lv={"houmuwu-frieze":{w:320,h:80},"houmuwu-leg":{w:170,h:130},"fangyi-body":{w:150,h:120},"fangyi-lid":{w:190,h:100},"zun-belly":{w:200,h:100},"zun-foot":{w:150,h:100},"gu-waist":{w:60,h:66},"gu-foot":{w:90,h:64},"T8-two-kui":{w:280,h:80},"T10-blade":{w:80,h:160}};function Cv(n){const t={...n};t.ear===!0&&(t.ear="leaf"),t.ear===!1&&(t.ear="none"),t.crest===!0&&(t.crest="lozenge"),t.crest===!1&&(t.crest="none"),t.quills===!0&&(t.quills=3),t.quills===!1&&(t.quills=0),t.relief={motif:1.5,boss:3.4,groove:.45,...t.relief||{}};for(const[e,i]of Object.entries(Zf))t[e]===void 0&&i.type!=="group"&&(t[e]=i.default);return t}function Jf(n){const t=Kf,e=n.p;if(e.body==="kui")e.nose!=="none"&&t.nose(n,{nose:e.nose,from:.3,to:.72,width:.55}),t.kuiHead(n),t.horn(n,{rootX:.25}),t.body(n)||t.ear(n);else{t.crest(n),t.nose(n),t.nostril(n),t.jaw(n),t.eye(n),t.brow(n),t.horn(n);const i=t.body(n);i||t.ear(n),i&&e.body==="dissolved"&&t.fragments(n)}return t.edge(n),n}function Dv(n,t,e){const i=Cv(e),s=Vf(n,t,i);return Jf(s),$f(n,s),s}const Iv={name:"taotie",label:"Taotie mask",schema:Zf,presets:Pv,presetPlaques:Lv,draw:Dv,plaque:{w:240,h:120}};function Ql(n={}){const t={};for(const[e,i]of Object.entries(n))t[e]=i.type==="group"?Ql(i.fields):i.default;return t}const Di=Math.PI/180,Qf=.12,Yt=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),Gt=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}});function Pn({motif:n=1.5,boss:t=3,groove:e=.45,lineWeight:i=.55,echoInset:s=1.2,carving:o="dense"}={}){return{style:Yt(["relief","flush"],"relief","Style (V relief / IV flush)"),carving:Yt(["dense","sparse","spirals","none"],o,"Plateau line work (spirals = V-a carved plateau)"),lineWeight:Gt(.3,1.6,.05,i,"Line weight","mm"),echoInset:Gt(.5,3,.05,s,"Contour echo inset","mm"),irregularity:Gt(0,2,.1,1,"Hand irregularity"),seed:Gt(0,99,1,0,"Seed"),relief:{type:"group",label:"Relief levels",fields:{motif:Gt(.2,6,.1,n,"Motif (L1)","mm"),boss:Gt(.5,10,.1,t,"Boss (L2)","mm"),groove:Gt(.1,1.2,.05,e,"Groove","mm")}}}}function bn(n){return{style:"relief",carving:"dense",lineWeight:.55,echoInset:1.2,irregularity:1,seed:0,...n,relief:{motif:1.5,boss:3,groove:.45,...n.relief||{}}}}function Gn(n,t,e){return new Be(`${n}:${e.seed|0}:${t.x.toFixed(2)},${t.y.toFixed(2)},${t.w.toFixed(2)}`)}function On(n,{rot:t=0,flip:e=!1,flipY:i=!1,unit:s}={}){const o=t===0?n.w:n.h,a=t===0?n.h:n.w,r=s??a,l=o/r,c=a/r,h=([u,f],d=[0,0])=>{const _=e?l-u:u,g=i?c-f:f;return t===0?(d[0]=n.x+_*r,d[1]=n.y+g*r):t===90?(d[0]=n.x+n.w-g*r,d[1]=n.y+_*r):(d[0]=n.x+g*r,d[1]=n.y+n.h-_*r),d};return{rect:n,rot:t,flip:e,flipY:i,unit:r,A:l,H:c,map:h,pts:u=>u.map(f=>h(f,[0,0]))}}class be{constructor(t,e,i=0,s=.012){this.x=t,this.y=e,this.h=i,this.step=s,this.pts=[[t,e]]}get at(){return[this.x,this.y]}fd(t){if(t<=0)return this;const e=Math.max(1,Math.ceil(t/this.step)),i=Math.cos(this.h*Di),s=Math.sin(this.h*Di),o=this.x,a=this.y;for(let r=1;r<=e;r++)this.pts.push([o+i*t*r/e,a+s*t*r/e]);return this.x=o+i*t,this.y=a+s*t,this}arc(t,e){if(!t)return this;const i=Math.sign(t),s=(this.h-i*90)*Di,o=this.x-Math.cos(s)*e,a=this.y-Math.sin(s)*e,r=Math.max(2,Math.ceil(Math.abs(t)*Di*e/this.step));for(let c=1;c<=r;c++){const h=s+t*Di*c/r;this.pts.push([o+Math.cos(h)*e,a+Math.sin(h)*e])}this.h+=t;const l=s+t*Di;return this.x=o+Math.cos(l)*e,this.y=a+Math.sin(l)*e,this}to(t,e){return this.h=Math.atan2(e-this.y,t-this.x)/Di,this.fd(Math.hypot(t-this.x,e-this.y))}spiral({a:t,b:e=t,d:i,dir:s=1,turns:o=1.5,r:a=.5,min:r=.02}={}){const l=Math.round(o*4);let c=t,h=e;for(let u=0;u<l;u++){const f=u%2===0?c:h;if(f<r)break;const d=Math.max(.003,Math.min(f*.4,a*i*.5));this.fd(Math.max(0,f-(u?d:0)-d)),u<l-1&&this.arc(s*90,d),u%2===1&&(c-=i,h-=i)}return this}curl(t,e,i=.35,s=1){let o=e,a=Math.abs(t);for(;a>0;){const r=Math.min(45,a);this.arc(s*r,o),o*=1-i*r/360,a-=r}return this}}function td(n,t,e){if(!e)return n;const i=t.range(0,6.28),s=t.range(0,6.28),o=t.range(4,9),a=t.range(9,17);let r=0;const l=[n[0].slice()];for(let c=1;c<n.length;c++){const h=n[c][0]-n[c-1][0],u=n[c][1]-n[c-1][1],f=Math.hypot(h,u)||1e-9;r+=f;const d=e*(.6*Math.sin(r*o+i)+.4*Math.sin(r*a+s));l.push([n[c][0]-u/f*d,n[c][1]+h/f*d])}return l}function zs(n,t,e=!1){n.beginPath();for(let i=0;i<t.length;i++)i?n.lineTo(t[i][0],t[i][1]):n.moveTo(t[i][0],t[i][1]);e&&n.closePath()}function kv(n,t,e,i,s,o){o=Math.max(0,Math.min(o,i/2,s/2)),n.moveTo(t+o,e),n.arcTo(t+i,e,t+i,e+s,o),n.arcTo(t+i,e+s,t,e+s,o),n.arcTo(t,e+s,t,e,o),n.arcTo(t,e,t+i,e,o),n.closePath()}function So(n,t,e=0){switch(t.kind){case"band":{if(n.lineJoin="round",typeof t.w=="function"){n.lineCap="round";const i=t.pts.length;let s=0;const o=[0];for(let a=1;a<i;a++)o.push(s+=Math.hypot(t.pts[a][0]-t.pts[a-1][0],t.pts[a][1]-t.pts[a-1][1]));for(let a=1;a<i;a++)n.lineWidth=Math.max(.05,t.w(o[a]/(s||1))+e*2),n.beginPath(),n.moveTo(t.pts[a-1][0],t.pts[a-1][1]),n.lineTo(t.pts[a][0],t.pts[a][1]),n.stroke();return}n.lineCap=t.cap==="flat"?"butt":t.cap==="square"?"square":"round",n.lineWidth=t.w+e*2,zs(n,t.pts),n.stroke();return}case"poly":zs(n,t.pts,!0),n.fill(),e&&(n.lineWidth=e*2,n.lineJoin="round",n.stroke());return;case"circle":n.beginPath(),n.arc(t.c[0],t.c[1],t.r+e,0,Math.PI*2),n.fill();return;case"rrect":{n.save(),n.translate(t.c[0],t.c[1]),t.rot&&n.rotate(t.rot),n.beginPath(),kv(n,-t.w/2-e,-t.h/2-e,t.w+2*e,t.h+2*e,t.r+e),n.fill(),n.restore();return}case"ellipse":n.beginPath(),n.ellipse(t.c[0],t.c[1],t.rx+e,t.ry+e,t.rot||0,0,Math.PI*2),n.fill();return}}function Sl(n,t,e,i="round"){n.lineCap=i,n.lineJoin="round",n.lineWidth=e,zs(n,t),n.stroke()}class zn{constructor(t,{rng:e,wobble:i=0}={}){this.f=t,this.rng=e||new Be(1),this.amp=i,this.plateau=[],this.holes=[],this.bosses=[],this.lines=[],this.cuts=[],this.ground=[]}P(t){return this.f.pts(this.amp?td(t,this.rng,this.amp):t)}u(t){return t*this.f.unit}band(t,e,i="round"){return t.length>1&&this.plateau.push({kind:"band",pts:this.P(t),w:this.u(e),cap:i}),this}taper(t,e,i,s=0){const o=this.u(e),a=this.u(i);return t.length>1&&this.plateau.push({kind:"band",pts:this.P(t),w:r=>r<s?o:o+(a-o)*((r-s)/(1-s))}),this}poly(t){return this.plateau.push({kind:"poly",pts:this.f.pts(t)}),this}circle(t,e){return this.plateau.push({kind:"circle",c:this.f.map(t),r:this.u(e)}),this}rrect(t,e,i,s){return this.plateau.push(this._rrect(t,e,i,s)),this}hole(t){return this.holes.push(t),this}_rrect(t,e,i,s){const o=this.f.rot!==0;return{kind:"rrect",c:this.f.map(t),w:this.u(o?i:e),h:this.u(o?e:i),r:this.u(s)}}_ellipse(t,e,i){const s=this.f.rot!==0;return{kind:"ellipse",c:this.f.map(t),rx:this.u(s?i:e),ry:this.u(s?e:i),rot:0}}boss(t,e,{kind:i="round",base:s="plateau",pupil:o="none",aspect:a=1.35}={}){const r=i==="square"?this._rrect(t,e*2*1.08,e*2,e*.55):i==="oval"?this._ellipse(t,e*a,e):{kind:"circle",c:this.f.map(t),r:this.u(e)};if(this.bosses.push({shape:r,r:this.u(e),base:s}),o==="slit"){const l=e*.95;this.cuts.push({kind:"band",pts:this.f.pts([[t[0]-l/2,t[1]],[t[0]+l/2,t[1]]]),w:Math.max(.3,this.u(e*.16)),cap:"round"})}else o==="dot"?this.cuts.push({kind:"circle",c:this.f.map(t),r:Math.max(.25,this.u(e*.3))}):o==="ring"&&(this.ringCuts=this.ringCuts||[],this.ringCuts.push({c:this.f.map(t),r:this.u(e*.62)}));return this}line(t,e){return t.length>1&&this.lines.push({pts:this.P(t),w:e}),this}groundLine(t,e){return t.length>1&&this.ground.push({pts:this.P(t),w:e}),this}}function ed(n,t){return e=>{e.save(),t&&(t(e),e.clip());for(const i of n.plateau)So(e,i);if(n.holes.length){e.globalCompositeOperation="destination-out";for(const i of n.holes)So(e,i);e.globalCompositeOperation="source-over"}e.restore()}}const Ei=n=>t=>{t.beginPath(),t.rect(n.x,n.y,n.w,n.h)},or=(n,t)=>Math.abs(n)>=t?0:Math.sqrt(1-n/t*(n/t));function ri(n,t,e,{clip:i,echo:s=!0}={}){var f;const o=e.style==="flush",a=e.relief,r=e.lineWeight,l=o?Qf:a.motif,c=e.carving||"dense",h=ed(t,i),u=d=>_=>{_.save(),i&&(i(_),_.clip()),d(_),_.restore()};if(t.plateau.length){const d=o?.08:Math.max(.2,Math.min(.55,l*.4));n.raise(h,{height:l,shoulder:d,profile:"plateau"});const _=e.echoInset??1.2,g=r/2;if(s)if(o)n.sink(h,{depth:a.groove,profile:p=>or(p-g*1.1,g)});else if(c==="dense"){const p=_+Math.max(r*2.6,1.5);n.sink(h,{depth:a.groove,profile:m=>Math.max(or(m-_,g),or(m-p,g))})}else c==="sparse"?n.sink(h,{depth:a.groove*.8,profile:p=>or(p-_,g)}):c==="spirals"&&Yr(n,h,{pitch:e.spiralPitch??Math.max(.7,r*2),depth:a.groove,echo:1,eyes:0,line:.48},{margin:Math.max(.35,r*.7),level:l})}t.lines.length&&n.sink(u(d=>{for(const _ of t.lines)Sl(d,_.pts,_.w??r)}),{depth:a.groove,shoulder:r/2,profile:"u"}),t.ground.length&&n.sink(u(d=>{for(const _ of t.ground)Sl(d,_.pts,_.w??r)}),{depth:a.groove,shoulder:r/2,profile:"u"});for(const d of t.bosses){const _=Math.max(.5,d.r),g=d.base==="plateau"?Math.min(.95,l/Math.max(a.boss,.001)):.25,p=o?Math.max(a.boss,l):Math.max(a.boss,l*1.2),m=Math.max(.3,Math.min(.6,_*.12));n.raise(v=>So(v,d.shape),{height:p,shoulder:_,profile:(v,M)=>{if(v<=0)return 0;const x=Math.min(1,v/M);return Ns.plateau(v,m)*(g+(1-g)*Math.sqrt(1-(1-x)*(1-x)))}})}return(t.cuts.length||(f=t.ringCuts)!=null&&f.length)&&n.sink(d=>{for(const _ of t.cuts)So(d,_);for(const _ of t.ringCuts||[])d.lineWidth=r,d.beginPath(),d.arc(_.c[0],_.c[1],_.r,0,Math.PI*2),d.stroke()},{depth:a.groove*1.4,shoulder:r*.45,profile:"u"}),t}const Uv=Object.freeze(Object.defineProperty({__proto__:null,E:Yt,FLUSH_LIFT:Qf,Pen:be,R:Gt,Sheet:zn,drawShape:So,makeFrame:On,motifRng:Gn,plateauPaint:ed,polyPath:zs,rectClip:Ei,reliefSchema:Pn,renderSheet:ri,strokeLine:Sl,withRelief:bn,wobble:td},Symbol.toStringTag,{value:"Module"})),Nv={kind:Yt(["bowstrings","border","step"],"bowstrings","Kind"),count:Gt(1,4,1,2,"Ribs"),width:Gt(.6,5,.1,1.5,"Rib width","mm"),height:Gt(.3,2.5,.05,.8,"Rib height","mm"),spacing:Gt(2,12,.1,4.5,"Spacing (centre to centre)","mm"),profile:Yt(["round","flat"],"round","Rib top"),vertical:{type:"bool",default:!1,label:"Vertical"}},Fv={"two-bowstrings":{},"three-bowstrings":{count:3,spacing:4},"single-bowstring":{count:1},monumental:{count:2,width:3.2,height:1.6,spacing:9,profile:"flat"},"gu-waist":{count:3,width:1.6,height:1.1,spacing:3.4},border:{kind:"border",width:4,height:.9},step:{kind:"step",width:5,height:1.2}},Ov={border:{w:160,h:14},step:{w:160,h:14}},zv=n=>t=>t<=0?0:Math.min(1,Math.sqrt(Math.min(1,t/Math.min(.45,n*.3)))),Bv=(n,t)=>n<=0?0:Math.sqrt(1-(1-Math.min(1,n/t))**2);function Gv(n,t,e){const i=e.vertical||t.h>t.w*1.5,s=i?t.w:t.h,o=i?t.x+t.w/2:t.y+t.h/2,a=(h,u,f)=>{h.beginPath(),i?h.rect(u-f/2,t.y,f,t.h):h.rect(t.x,u-f/2,t.w,f),h.fill()};if(e.kind==="border"){const h=Math.min(e.width,s);n.raise(u=>a(u,o,h),{height:e.height,profile:zv(h)});return}if(e.kind==="step"){const h=Math.min(e.width,s);n.raise(u=>a(u,o,h),{height:e.height,profile:(u,f)=>u<=0?0:Math.min(1,u/Math.min(.6,h*.25))});return}const r=e.count|0,l=Math.min(e.spacing,r>1?(s-e.width)/(r-1):e.spacing),c=o-l*(r-1)/2;n.raise(h=>{for(let u=0;u<r;u++)a(h,c+u*l,e.width)},{height:e.height,shoulder:e.profile==="flat"?Math.min(.4,e.width*.3):e.width/2,profile:e.profile==="flat"?"plateau":Bv})}const Hv={name:"bands",label:"Bowstrings & borders",schema:Nv,presets:Fv,presetPlaques:Ov,draw:Gv,symmetric:!1,ground:!1,plaque:{w:160,h:16}},Vv={arrangement:Yt(["pair","single"],"pair","Arrangement"),facing:Yt(["right","left"],"right","Facing (single)"),crest:Yt(["hook","t","none"],"hook","Crest"),tail:Yt(["hook","fork"],"hook","Tail"),eye:Yt(["round","chen"],"round","Eye"),length:Gt(1.3,2.2,.05,1.7,"Length : height"),bandWidth:Gt(.1,.22,.01,.15,"Band width (× H)"),centreGap:Gt(0,15,.5,1.5,"Gap at centre line","mm"),...Pn({motif:1.2,boss:2.4,groove:.36,lineWeight:.45,echoInset:.8,carving:"sparse"})},Wv={pair:{},single:{arrangement:"single"},"t-crest":{crest:"t",tail:"hook"},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.35}}},jv={single:{w:40,h:22}};function qv(n,t,e){const i=Math.min(t,e.length),s=Math.max(0,t-i-.02),o=g=>s+g*i,a=e.bandWidth,r=.46,l=[];for(let g=0;g<=48;g++){const p=g/48*Math.PI*2,m=Math.cos(p)>0,v=(m?.15:.2)*i,M=Math.sin(p)>0?.23:.2;l.push([o(.58)+Math.cos(p)*v,r+Math.sin(p)*M-(m?0:.03*Math.cos(p))])}n.poly(l);const c=[o(.8),.72],h=.16;n.band([[o(.68),r+.08],[c[0]-.03,c[1]-.05]],.18),n.circle(c,h);const u=new be(c[0]+h*.7,c[1]+.02,-5,.006).fd(Math.max(.05,.1*i)).arc(-120,.05);if(n.taper(u.pts,.14,.03,.3),n.boss(c,.075,{kind:e.eye==="chen"?"oval":"round",pupil:"dot",base:"plateau",aspect:1.4}),e.crest==="hook"){const g=new be(c[0]-.03,c[1]+h*.8,105,.006).fd(.07).arc(90,.04).fd(.02);n.taper(g.pts,a*.9,a*.45,.4)}else if(e.crest==="t"){n.band([[c[0],c[1]+h*.8],[c[0],.96-a*.4]],a*.7,"flat");const g=new be(c[0]-.08,.96-a*.4-.04,90,.006).fd(.02).arc(-90,.02).fd(.12).arc(-90,.02).fd(.02);n.band(g.pts,a*.7)}const f=new be(o(.7),r+.1,188,.006).fd(.24*i).arc(70,.07).fd(.04).arc(110,.035);n.taper(f.pts,a*1.1,a*.5,.55);const d=new be(o(.44),r,192,.006).fd(.2*i).arc(62,.16).fd(Math.max(.02,r-.3)).arc(150,.04);if(n.taper(d.pts,a*1.5,a*.55,.35),e.tail==="fork"){const g=new be(o(.4),r+.02,195,.006).fd(.16*i).arc(-50,.05).fd(.02);n.taper(g.pts,a*.9,a*.4,.5)}const _=new be(o(.56),r-.12,-95,.006).fd(r-.12-.12).arc(95,.04).fd(.08).arc(-110,.03);return n.taper(_.pts,a*.75,a*.4,.6),n}function Xv(n,t,e){const i=bn(e),s=i.arrangement==="pair",o=s?Math.min(i.centreGap,t.w*.1):0,a=s?{x:t.x,y:t.y,w:t.w/2-o/2,h:t.h}:t,r=On(a,{flip:!s&&i.facing==="left"}),l=new zn(r,{rng:Gn("bird",t,i),wobble:.003*i.irregularity});return qv(l,r.A,i),ri(n,l,i,{clip:Ei(s?{...t,w:t.w/2}:t)}),l}const Yv={name:"bird",label:"Bird (Shang)",schema:Vv,presets:Wv,presetPlaques:jv,draw:Xv,symmetric:n=>n.arrangement!=="single",facing:!0,plaque:{w:80,h:22},groundOptions:(n,t)=>({pitch:Math.max(.8,Math.min(2,t.h*.05))})},$v={orient:Yt(["right","left","up","down"],"right","Head toward"),facing:Yt(["auto","right","left"],"auto","Facing (set by friezes)"),length:Gt(2,4,.05,3,"Length : width"),chevrons:Gt(2,6,1,4,"Chevrons"),eyeSize:Gt(.6,1.4,.05,1,"Eye size"),legs:{type:"bool",default:!0,label:"Leg hooks"},concave:Gt(0,.3,.01,.12,"Side concavity"),...Pn({motif:1.2,boss:2.4,groove:.38,lineWeight:.45,echoInset:.8,carving:"sparse"})},Kv={standard:{},"row-unit":{orient:"right",length:2.6},"blade-fill":{orient:"down",length:3.2,legs:!1,chevrons:5},slender:{length:3.6,chevrons:6,eyeSize:.85},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.35}}};function nd(n,t,e){const i=Math.min(t,e.length),s=(t-i)/2,o=s+i,a=.5,r=.3,l=o-r,c=.13*e.eyeSize;n.rrect([o-r/2,a],r,.7,.1);const h=Math.min(.5-c-.01,.33);n.circle([o-r*.5,a+h],c*1.12),n.circle([o-r*.5,a-h],c*1.12),n.boss([o-r*.5,a+h],c,{kind:"round",base:"plateau",pupil:"none"}),n.boss([o-r*.5,a-h],c,{kind:"round",base:"plateau",pupil:"none"});const u=[],f=.42,d=24;for(let p=0;p<=d;p++){const m=p/d,v=l+.01-m*(l+.01-s),M=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))+.012;u.push([v,a+M])}for(let p=d;p>=0;p--){const m=p/d,v=l+.01-m*(l+.01-s),M=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))+.012;u.push([v,a-M])}n.poly(u);const _=l-.04-s;n.line([[l-.1,a],[s+_*.12,a]]);const g=e.chevrons|0;for(let p=0;p<g;p++){const m=.12+.7*(p+.5)/g,v=l-.04-m*_,M=f*(1-m)*(1-e.concave*Math.sin(Math.PI*m))*.62,x=Math.min(.2,M*.9);n.line([[v-x,a+M],[v,a],[v-x,a-M]])}if(n.line([[l-.02,a+.3],[l-.02,a-.3]]),e.legs&&_>1)for(const p of[1,-1]){const m=new be(l-.32,a+p*(f*.8),p*120,.006).fd(.06).arc(p*70,.03);n.taper(m.pts,.08,.03,.3)}return n}const Zv={right:0,left:0,up:90,down:-90};function Jv(n,t,e){const i=bn(e);let s=i.orient;(s==="right"||s==="left")&&(i.facing==="left"||i.facing==="right")&&(s=i.facing);const o=On(t,{rot:Zv[s],flip:s==="left"}),a=new zn(o,{rng:Gn("cicada",t,i),wobble:.003*i.irregularity});return nd(a,o.A,i),ri(n,a,i,{clip:Ei(t)}),a}function Qv(n,t){return{pitch:Math.max(.8,Math.min(2.2,Math.min(t.w,t.h)*.06))}}const tx={name:"cicada",label:"Cicada",schema:$v,presets:Kv,draw:Jv,groundOptions:Qv,symmetric:!1,facing:!0,plaque:{w:90,h:30}},ex={direction:Yt(["rising","hanging"],"rising","Direction"),shape:Yt(["triangle","ogive"],"ogive","Outline"),concave:Gt(0,.2,.01,.05,"Side concavity"),border:Yt(["band","lines","none"],"band","Border"),borderLines:Gt(1,5,1,3,"Contour lines"),borderWidth:Gt(.8,6,.1,2,"Border band width","mm"),fill:Yt(["mask","cicada","leiwen"],"mask","Fill"),maskHeight:Gt(.25,.75,.01,.48,"Mask height (of blade)"),eye:Yt(["round","square","chen","none"],"round","Mask eye"),pupil:Yt(["dot","slit","none"],"dot","Pupil"),pitch:Gt(.6,3,.05,1.1,"Leiwen pitch","mm"),leiwenTop:Gt(.3,1,.01,1,"Leiwen up to (of blade); contour lines above"),...Pn({motif:1.1,boss:2.2,groove:.35,lineWeight:.45,echoInset:.8,carving:"sparse"})},nx={"rising-mask":{},"hanging-mask":{direction:"hanging"},"rising-cicada":{fill:"cicada"},"leiwen-only":{fill:"leiwen",border:"lines",borderLines:2},"gu-trumpet":{shape:"ogive",border:"lines",borderLines:4,fill:"mask",maskHeight:.26,style:"flush",eye:"round",pupil:"none",leiwenTop:.6,pitch:.9,lineWeight:.4,relief:{motif:.35,boss:.9,groove:.3}},"zun-neck":{shape:"ogive",border:"lines",borderLines:3,fill:"mask",maskHeight:.5,style:"flush",eye:"none",pupil:"none",leiwenTop:.62,pitch:1.1,lineWeight:.5,relief:{motif:.4,boss:1.2,groove:.35}}},ix={"gu-trumpet":{w:34,h:130},"zun-neck":{w:60,h:100}};function sx(n,t,e){return e>=1?0:n.shape==="ogive"?t/2*Math.sqrt(1-e*e)*(1-.42*e)*(1-n.concave*Math.sin(Math.PI*e)):t/2*(1-e)*(1-n.concave*Math.sin(Math.PI*e))}function id(n,t){const e=n.x+n.w/2,i=n.w,s=n.h,o=t.direction==="hanging";return{cx:e,W:i,Hh:s,Y:l=>o?n.y+n.h-l*s:n.y+l*s,hw:l=>sx(t,i,l),hanging:o}}function ro(n,t,e=80){const i=[];for(let s=0;s<=e;s++){const o=s/e,a=n.hw(o)-t;if(a<=0){i.push([n.cx,n.Y(o)]);break}i.push([n.cx-a,n.Y(o)])}return i}function ox(n,t,e,i=0){const s=bn(e),o=id(t,s),a=ro(o,i),r=a.map(([l,c])=>[2*o.cx-l,c]).reverse();zs(n,a.concat(r),!0),n.fill()}function rx(n,t,e,i,s,o){const a=x=>Math.max(.5,t.hw(Math.min(.999,(o+x*s)/t.Hh))-i),r=([x,y])=>[t.cx-x*a(y),t.Y((o+y*s)/t.Hh)],l=x=>x.map(r),c=a(0),h=Math.max(.8,Math.min(c*.2,s*.11)),u=(x,y,w)=>new be(x,y,w,.008);n.band([r([0,.12]),r([0,.66])].map(x=>[x[0]-n.f.rect.x,x[1]-n.f.rect.y]),h*1.1/n.f.unit,"round");const f=u(.02,.1,0).fd(.64).arc(90,.08).fd(.06).arc(90,.05);n.band(xi(n,l(f.pts)),h/n.f.unit);const d=.38,_=.46,g=Math.min(c*.2,s*.12),p=r([_,d]);n.plateau.push({kind:"ellipse",c:p,rx:g*1.9,ry:g*1.35,rot:0}),e.eye==="none"?n.lines.push({pts:Array.from({length:25},(x,y)=>[p[0]+Math.cos(y/24*Math.PI*2)*g*.8,p[1]+Math.sin(y/24*Math.PI*2)*g*.8])}):n.bosses.push({shape:e.eye==="square"?{kind:"rrect",c:p,w:g*2.2,h:g*2,r:g*.55}:{kind:"circle",c:p,r:g},r:g,base:"plateau"}),e.pupil==="dot"&&n.cuts.push({kind:"circle",c:p,r:Math.max(.25,g*.3)}),e.pupil==="slit"&&n.cuts.push({kind:"band",pts:[[p[0]-g*.5,p[1]],[p[0]+g*.5,p[1]]],w:Math.max(.3,g*.18),cap:"round"});const m=u(_-.3,d+.02,180).fd(.06).arc(90,.05).fd(.04);n.band(xi(n,l(m.pts)),h*.75/n.f.unit);const v=u(.26,.58,90).fd(.16).arc(-90,.12).fd(.2).arc(-90,.1).fd(.06).arc(-90,.06).fd(.04);n.band(xi(n,l(v.pts)),h/n.f.unit);const M=u(.92,.28,90).fd(.2).arc(90,.08).fd(.1);return n.band(xi(n,l(M.pts)),h*.8/n.f.unit),{top:o+s*1.02}}function xi(n,t){return t.map(([e,i])=>[e-n.f.rect.x,i-n.f.rect.y])}function ax(n,t,e){const i=bn(e),s=id(t,i),o=On(t,{unit:1}),a=new zn(o,{rng:Gn("blade",t,i),wobble:.04*i.irregularity}),r={x:t.x,y:t.y,w:t.w/2,h:t.h},l=i.lineWeight;let c=0;if(i.border==="band"){const _=Math.min(i.borderWidth,t.w*.12);a.band(xi(a,ro(s,_/2)),_,"flat"),c=_+Math.max(.8,i.pitch*.6)}else if(i.border==="lines"){const _=i.borderLines|0,g=Math.max(l*2.2,i.pitch);for(let p=0;p<_;p++)a.groundLine(xi(a,ro(s,l*.8+p*g)),l);c=l*.8+(_-1)*g+g*.9}if(i.leiwenTop<1&&i.border!=="none"){const _=Math.max(l*2.2,i.pitch),g=i.leiwenTop;for(let m=c+l*.5;m<t.w/2;m+=_){const v=ro(s,m).filter(([,M])=>(s.hanging?s.Y(0)-M:M-s.Y(0))>=g*s.Hh);if(v.length>1)a.groundLine(xi(a,v),l);else break}const p=s.hw(g)-c;p>0&&a.groundLine(xi(a,[[s.cx-p,s.Y(g)-(s.hanging?-1:1)*_*.5],[s.cx+.4,s.Y(g)-(s.hanging?-1:1)*_*.5]]),l)}const h=Math.max(1,c*.6)+.5,u=t.h-h-c;if(i.fill==="mask")rx(a,s,i,c+.4,Math.max(4,u*i.maskHeight),h);else if(i.fill==="cicada"){const _=s.hw(h/s.Hh)-c-.4,g=u*.8,p={x:s.cx-_,y:s.hanging?t.y+t.h-h-g:t.y+h,w:_*2,h:g},m=On(p,{rot:s.hanging?90:-90}),v=new zn(m,{rng:a.rng,wobble:.003*i.irregularity});nd(v,m.A,{length:m.A*.97,chevrons:5,eyeSize:1,legs:!1,concave:.06});for(const M of["plateau","bosses","lines","cuts"])a[M].push(...v[M])}return ri(n,a,i,{clip:_=>{_.beginPath(),_.rect(r.x,r.y,r.w+.01,r.h)}}),Si(n,{rect:r,include:_=>{const g=ro(s,c).filter(([,p])=>i.leiwenTop>=1||(s.hanging?s.Y(0)-p:p-s.Y(0))<=i.leiwenTop*s.Hh-Math.max(l*2.2,i.pitch));zs(_,g.concat([[s.cx+.5,g[g.length-1][1]],[s.cx+.5,s.Y(0)]]),!0),_.fill()},avoid:"raised",margin:Math.max(.4,i.pitch*.4)},{pitch:i.pitch,depth:i.relief.groove,echo:i.border==="lines"?0:1}),a}function lx(n){return{pitch:n.pitch}}const cx={name:"blade",label:"Rising / hanging blade",schema:ex,presets:nx,presetPlaques:ix,draw:ax,outline:ox,groundOptions:lx,ground:!1,plaque:{w:50,h:120}},hx={layout:Yt(["lattice","grid","row","single"],"lattice","Layout"),side:Gt(8,30,.5,20,"Lozenge side / spacing","mm"),angle:Gt(45,75,1,64,"Lattice angle","°"),lines:Yt(["double","single"],"double","Lattice lines"),ridge:Gt(.6,2.5,.05,1.1,"Ridge width","mm"),ridgeHeight:Gt(.3,2,.05,.9,"Ridge height","mm"),nipple:Gt(1.5,6,.1,2.6,"Nipple base radius","mm"),nippleHeight:Gt(1,8,.1,3.4,"Nipple height","mm"),shape:Yt(["pointed","dome"],"pointed","Nipple shape"),rows:Gt(1,4,1,3,"Rows (grid)"),...Pn({motif:1,boss:3.4,groove:.4,lineWeight:.5})},ux={lattice:{},"single-lines":{lines:"single",angle:60,side:14},"gui-belly":{side:20,nipple:3.4,nippleHeight:5.5,ridge:1.3},"fangding-frame":{layout:"grid",side:14,rows:3,nipple:3.2,nippleHeight:3.6,shape:"dome"},row:{layout:"row",side:12,nipple:3,nippleHeight:3.2,shape:"dome"},single:{layout:"single",nipple:4,nippleHeight:5}},fx={row:{w:140,h:18},single:{w:30,h:30},"fangding-frame":{w:160,h:46}};function dx(n){return n==="dome"?(t,e)=>t<=0?0:Math.sqrt(1-(1-Math.min(1,t/e))**2):(t,e)=>{if(t<=0)return 0;const i=Math.min(1,t/e),s=Math.min(1,t/(e*.12));return Math.min(s,.25+.75*Math.pow(i,.85))*(1-.08*Math.pow(i,6))}}function rr(n,t,e){const i=e.nipple;n.raise(s=>{for(const[o,a]of t)s.beginPath(),s.arc(o,a,i,0,Math.PI*2),s.fill()},{height:e.nippleHeight,shoulder:i,profile:dx(e.shape)})}function px(n,t,e){const i=bn(e),s=t.x+t.w/2,o=t.y+t.h/2;if(i.layout==="single")return rr(n,[[s,o]],i);if(i.layout==="row"){const g=t.w>=t.h,p=g?t.w:t.h,m=Math.max(1,Math.round(p/i.side)),v=[];for(let M=0;M<m;M++){const x=(M+.5)/m;v.push(g?[t.x+x*t.w,o]:[s,t.y+x*t.h])}return rr(n,v,i)}if(i.layout==="grid"){const g=i.side,p=Math.max(1,Math.round(t.w/g)),m=Math.max(1,Math.min(i.rows|0,Math.round(t.h/g))),v=t.w/p,M=t.h/m,x=[];for(let y=0;y<m;y++){const w=y%2?.5:0;for(let b=0;b<p-(w?1:0);b++)x.push([t.x+(b+.5+w)*v,t.y+(y+.5)*M])}return rr(n,x,i)}const a=i.angle*Math.PI/180,r=Math.sin(a),l=Math.cos(a),c=i.side*Math.sin(Math.PI-2*a)||i.side,h=Math.hypot(t.w,t.h),u=Math.ceil(h/c)+1,f=i.ridge*1.15;n.raise(g=>{g.save(),g.beginPath(),g.rect(t.x,t.y,t.w,t.h),g.clip(),g.lineWidth=i.ridge,g.lineCap="butt";const p=i.lines==="double"?[-f/2,f/2]:[0];for(let m=-u;m<=u;m++)for(const v of p){const M=(m+.5)*c+v,x=s+M*r,y=o-M*l;g.beginPath(),g.moveTo(x-l*h,y-r*h),g.lineTo(x+l*h,y+r*h),g.stroke();const w=s+M*r,b=o+M*l;g.beginPath(),g.moveTo(w-l*h,b+r*h),g.lineTo(w+l*h,b-r*h),g.stroke()}g.restore()},{height:i.ridgeHeight,profile:"ridge"});const d=[],_=i.nipple+i.ridge;for(let g=-u;g<=u;g++)for(let p=-u;p<=u;p++){const m=g*c,v=p*c,M=s+(m+v)/(2*r),x=o+(v-m)/(2*l);M-_<t.x||M+_>t.x+t.w||x-_<t.y||x+_>t.y+t.h||d.push([M,x])}rr(n,d,i)}const mx={name:"boss",label:"Bosses / boss lattice",schema:hx,presets:ux,presetPlaques:fx,draw:px,symmetric:!1,plaque:{w:120,h:80},groundOptions:n=>({pitch:Math.max(.8,Math.min(1.8,n.side*.075))})},gx={eyes:Gt(1,12,1,4,"Eyes"),eye:Yt(["chen","round"],"chen","Eye"),eyeSize:Gt(.6,1.4,.05,1,"Eye size"),slope:Gt(30,60,1,45,"Diagonal angle","°"),rib:Gt(.06,.2,.01,.1,"Rib width (× H)"),...Pn({motif:1.1,boss:2.2,groove:.35,lineWeight:.45,echoInset:.8,carving:"none"})},_x={chen:{},round:{eye:"round",eyes:5},flush:{style:"flush",relief:{motif:.35,boss:1.1,groove:.35}}};function Mx(n,t,e){const i=bn(e),s=On(t),o=s.A,a=new zn(s,{rng:Gn("eyeband",t,i),wobble:.003*i.irregularity}),r=Math.max(1,i.eyes|0),l=o/r,c=i.rib,h=1/Math.tan(i.slope*Math.PI/180),u=.17*i.eyeSize,f=i.eye==="chen"?u*1.6:u;for(let g=0;g<r;g++){const p=(g+.5)*l;i.eye==="chen"?(a.plateau.push({kind:"ellipse",c:s.map([p,.5]),rx:s.unit*f*1.15,ry:s.unit*u*1.35,rot:0}),a.band([[p-f*1.1,.5],[p-f*1.5,.5],[p-f*1.5,.36]],c*.9),a.band([[p+f*1.1,.5],[p+f*1.5,.5],[p+f*1.5,.36]],c*.9)):a.circle([p,.5],u*1.45),a.boss([p,.5],u,{kind:i.eye==="chen"?"oval":"round",aspect:1.5,pupil:"dot",base:"plateau"})}const d=.94,_=.06;for(let g=0;g<=r;g++){const p=g*l,m=Math.min(h*(d-_),l/2-f*1.6);g>0&&a.band([[p-m,d],[p-.02,_]],c,"flat"),g<r&&a.band([[p+.02,_],[p+m,d]],c,"flat")}return ri(n,a,i,{clip:Ei(t)}),a}const vx={name:"eyeband",label:"Eye-and-diagonal band",schema:gx,presets:_x,draw:Mx,symmetric:!1,plaque:{w:180,h:18},groundOptions:(n,t)=>({pitch:Math.max(.7,Math.min(1.6,t.h*.06))})},El=(n,t)=>typeof n.symmetric=="function"?n.symmetric(t):n.symmetric!==!1;function Po(n,t,e,i={},{preset:s,ground:o={},margin:a=.6}={}){var h;const r=Gs(t),l=Eo(r,i,s),c=El(r,l);if(r.draw(n,e,l),o!==!1&&r.ground!==!1){const u=c?{x:e.x,y:e.y,w:e.w/2,h:e.h}:e;n.fillGround({...((h=r.groundOptions)==null?void 0:h.call(r,l,e))||{},...o},{rect:u,margin:a})}return c&&n.mirrorX(e),l}function $h(n){return typeof n=="string"?{motif:n}:n}function yi(n,t,e,i,s,o){var w;if(typeof e=="string"||e&&typeof e.draw=="function"){const b=i,D=s||{},E=o||{},T=t.w/b;for(let L=0;L<b;L++)Po(n,e,{x:t.x+L*T,y:t.y,w:T,h:t.h},D,E);return{slots:[]}}const a={unit:"kui",count:2,facing:"centre",gap:0,centre:null,params:{},preset:void 0,ground:{},margin:.6,...e||{}},r=(Array.isArray(a.unit)?a.unit:[a.unit]).map($h),l=Math.max(1,a.count|0),c=[];for(let b=0;b<l;b++)c.push(r[b%r.length]);const h=a.facing==="centre",u=h&&l%2===1?(l-1)/2:-1;u>=0&&(c[u]=a.centre?$h(a.centre):null);const f=a.gap*(l-1);let d=0,_=0;const g=c.map(b=>{const D=b==null?void 0:b.w;if(D==null)return _++,null;const E=D<=1?D*(t.w-f):D;return d+=E,E}),p=_?Math.max(0,t.w-f-d)/_:0,m=[];let v=t.x;for(let b=0;b<l;b++){const D=g[b]??p;m.push({rect:{x:v,y:t.y,w:D,h:t.h},spec:c[b],i:b}),v+=D+a.gap}const M=t.x+t.w/2;let x=null;for(const b of m){if(!b.spec)continue;const D=Gs(b.spec.motif),E=h?b.rect.x+b.rect.w/2<M-1e-6?"right":b.i===u?null:"left":a.facing;if(h&&E==="left")continue;const T=Eo(D,{...a.params,...b.spec.params||{},...E?{facing:E,arrangement:"single"}:{}},b.spec.preset??a.preset);h&&b.i===u&&!El(D,T)&&(x={m:D,p:T,rect:b.rect,snap:xx(n,b.rect)}),D.draw(n,b.rect,T),El(D,T)&&!(h&&b.i===u)&&n.mirrorX(b.rect)}const y=h?{...t,w:t.w/2}:t;if(a.ground!==!1){const b=c.find(Boolean),D=b?Gs(b.motif):null,E=D?Eo(D,a.params,b.preset??a.preset):{};n.fillGround({...((w=D==null?void 0:D.groundOptions)==null?void 0:w.call(D,E,t))||{},...a.ground},{rect:y,margin:a.margin})}return h&&n.mirrorX(t),x&&(yx(n,x.snap),x.m.draw(n,x.rect,x.p)),{slots:m}}function xx(n,t){const{cols:e,ppmm:i}=n,s=Math.max(0,Math.floor(t.x*i)),o=Math.min(e,Math.ceil((t.x+t.w)*i)),a=Math.max(0,Math.floor(t.y*i)),r=Math.min(n.rows,Math.ceil((t.y+t.h)*i)),l=o-s,c=new Float32Array(l*(r-a)),h=new Float32Array(l*(r-a));for(let u=a;u<r;u++)for(let f=s;f<o;f++)c[(u-a)*l+f-s]=n.field[u*e+f],h[(u-a)*l+f-s]=n.groove[u*e+f];return{x0:s,x1:o,y0:a,y1:r,w:l,f:c,g:h,after:null}}function yx(n,t){const{cols:e}=n;for(let i=t.y0;i<t.y1;i++)for(let s=t.x0;s<t.x1;s++){const o=i*e+s,a=(i-t.y0)*t.w+s-t.x0;n.field[o]>t.f[a]+.03&&(n.field[o]=t.f[a],n.groove[o]=t.g[a])}}function bx(n,t,e="kui",i={}){return yi(n,t,{...i,unit:e,count:2,facing:"centre"})}function sd(n,t,{count:e=2,width:i=1.5,height:s=.8,spacing:o,profile:a="ridge",vertical:r=!1}={}){const l=r?t.w:t.h,c=o??Math.min(l/Math.max(1,e),i*3),h=c*(e-1),u=(r?t.x+t.w/2:t.y+t.h/2)-h/2;n.raise(f=>{for(let d=0;d<e;d++){const _=u+d*c;f.beginPath(),r?f.rect(_-i/2,t.y,i,t.h):f.rect(t.x,_-i/2,t.w,i),f.fill()}},{height:s,profile:a,...a==="plateau"?{shoulder:Math.min(.4,i*.3)}:{}})}function za(n){if(!n||n.kind==="none")return 0;if(n.h!=null)return n.h;if(n.kind==="bowstrings"){const t=n.width??1.5;return(n.count??2)*(n.spacing??t*3)+(n.pad??1)}return n.kind==="line"?(n.width??1.4)+(n.pad??1.5):4}function Ba(n,t,e){!e||e.kind==="none"||e.kind==="plain"||(e.kind==="bowstrings"?sd(n,t,e):e.kind==="line"&&Ir(n,{x:t.x,y:t.y+t.h/2,w:t.w,h:0},{width:e.width??1.4,height:e.height??.7,sides:"b"}))}function _s(n,t,e,{separator:i={kind:"bowstrings",count:2},edges:s=!1,inset:o=.8,ground:a={}}={}){const r=e.map((g,p)=>p<e.length-1?g.sep??i:null),l=s?za(i):0;let c=2*l;for(let g=0;g<e.length;g++)c+=za(r[g])+(e[g].h??0);const h=e.reduce((g,p)=>g+(p.h==null?p.weight??1:0),0),u=Math.max(0,t.h-c);let f=t.y+t.h;const d=[],_={};s&&(Ba(n,{x:t.x,y:f-l,w:t.w,h:l},i),f-=l);for(let g=0;g<e.length;g++){const p=e[g],m=p.h??u*(p.weight??1)/(h||1),v={x:t.x,y:f-m,w:t.w,h:m},M={x:v.x,y:v.y+(r[g]||s&&g===e.length-1?o:0),w:v.w,h:0};if(M.h=v.y+v.h-(g>0||s?o:0)-M.y,d.push(M),p.name&&(_[p.name]=M),p.draw?p.draw(n,M):p.frieze?yi(n,M,{ground:a,...p.frieze}):p.blades?od(n,M,p.blades):p.motif&&Po(n,p.motif,M,p.params||{},{preset:p.preset,ground:p.ground??a}),f-=m,r[g]){const x=za(r[g]);Ba(n,{x:t.x,y:f-x,w:t.w,h:x},r[g]),f-=x}}return s&&Ba(n,{x:t.x,y:f-l,w:t.w,h:l},i),{rows:d,byName:_}}function od(n,t,{count:e=4,direction:i="rising",gap:s=0,params:o={},preset:a,between:r="plain",ground:l={}}={}){var u;const c=(t.w-s*(e-1))/e,h=[];for(let f=0;f<e;f++){const d={x:t.x+f*(c+s),y:t.y,w:c,h:t.h};h.push(d),Po(n,"blade",d,{...o,direction:i},{preset:a,ground:l})}if(r==="leiwen"){const f=Gs("blade"),d=Eo(f,{...o,direction:i},a),_=n.mask(g=>{for(const p of h)f.outline(g,p,d)});n.fillGround({...((u=f.groundOptions)==null?void 0:u.call(f,d,t))||{},...l},{rect:t,avoid:_,margin:.6})}return h}function rd(n,t,{width:e=20,top:i,bottom:s,sides:o="kui",sideHeads:a="down",line:r=!0,lineWidth:l=1.4,lineHeight:c=.7,params:h={},preset:u,bosses:f={},ground:d={}}={}){const _=typeof e=="number"?{t:e,b:e,l:e,r:e}:{t:20,b:20,l:20,r:20,...e},g={x:t.x+_.l,y:t.y+_.b,w:t.w-_.l-_.r,h:t.h-_.t-_.b},p=(v,M)=>{if(v!=="plain"){if(v==="bosses")return Tl(n,M,f);yi(n,M,{unit:"kui",count:2,facing:"centre",params:h,preset:u,ground:d,...v||{}})}},m=r?l*1.4:0;_.t&&p(i,{x:g.x,y:g.y+g.h+m*.5,w:g.w,h:_.t-m}),_.b&&p(s??i,{x:g.x,y:t.y+m*.5,w:g.w,h:_.b-m});for(const v of["l","r"]){if(!_[v])continue;const M=v==="l"?{x:t.x+m*.5,y:t.y+m*.5,w:_.l-m,h:t.h-m}:{x:t.x+t.w-_.r+m*.5,y:t.y+m*.5,w:_.r-m,h:t.h-m};if(o!=="plain"){if(o==="bosses"){Tl(n,M,f);continue}Po(n,"kui",M,{...h,arrangement:"single",orient:a,facing:v==="l"?"right":"left"},{preset:u,ground:d})}}return r&&(Ir(n,t,{width:l,height:c,sides:"tblr"}),Ir(n,g,{width:l,height:c,sides:"tblr"})),g}function Tl(n,t,{radius:e,height:i,spacing:s,rows:o}={}){const a=Math.min(t.w,t.h),r=o??Math.max(1,Math.round(a/(s??a))),l=s??a/r,c=e??l*.28,h=i??c*.9,u=Math.max(1,Math.floor(t.w/l)),f=Math.max(1,Math.floor(t.h/l)),d=t.w/u,_=t.h/f;n.raise(g=>{for(let p=0;p<u;p++)for(let m=0;m<f;m++)g.beginPath(),g.arc(t.x+(p+.5)*d,t.y+(m+.5)*_,c,0,Math.PI*2),g.fill()},{height:h,profile:(g,p)=>Math.pow(Math.min(1,g/p),.8),shoulder:c})}function wx(n,t){const e={};let i=n.y;for(const s of t)e[s.name]={x:n.x,y:i,w:n.w,h:s.h},i+=s.h;return e}function Sx(n,t){const e=typeof t=="number"?{l:t,r:t,t,b:t}:{l:0,r:0,t:0,b:0,...t};return{x:n.x+e.l,y:n.y+e.b,w:n.w-e.l-e.r,h:n.h-e.t-e.b}}function Ex(n,t,e,{count:i,radius:s=4,height:o=3}={}){const a=i??Math.max(1,Math.floor(Math.hypot(e[0]-t[0],e[1]-t[1])/(s*3)));n.raise(r=>{for(let l=0;l<a;l++){const c=a===1?.5:(l+.5)/a;r.beginPath(),r.arc(t[0]+(e[0]-t[0])*c,t[1]+(e[1]-t[1])*c,s,0,Math.PI*2),r.fill()}},{height:o,profile:"dome"})}function Ir(n,t,{width:e=1.2,height:i=.6,sides:s="tb"}={}){n.raise(o=>{o.lineWidth=e,o.lineCap="butt",o.beginPath(),s.includes("b")&&(o.moveTo(t.x,t.y),o.lineTo(t.x+t.w,t.y)),s.includes("t")&&(o.moveTo(t.x,t.y+t.h),o.lineTo(t.x+t.w,t.y+t.h)),s.includes("l")&&(o.moveTo(t.x,t.y),o.lineTo(t.x,t.y+t.h)),s.includes("r")&&(o.moveTo(t.x+t.w,t.y),o.lineTo(t.x+t.w,t.y+t.h)),o.stroke()},{height:i,profile:"ridge"})}const ad=["kui-frieze","bird-frieze","cicada-row","whorl-kui","eye-band","neck-belly","blade-row","houmuwu-wall","boss-belly","fangyi-face"],Tx={layout:Yt(ad,"neck-belly","Layout"),style:Yt(["relief","flush"],"relief","Style (V relief / IV flush)"),fit:{type:"bool",default:!0,label:"Keep natural proportions"}},Ax=Object.fromEntries(ad.map(n=>[n,{layout:n}])),ld={"kui-frieze":{w:200,h:34},"bird-frieze":{w:160,h:26},"cicada-row":{w:180,h:22},"whorl-kui":{w:220,h:26},"eye-band":{w:180,h:30},"neck-belly":{w:200,h:150},"blade-row":{w:170,h:150},"houmuwu-wall":{w:240,h:118},"boss-belly":{w:180,h:120},"fangyi-face":{w:150,h:170}},Ga={kind:"bowstrings",count:2,width:1.4,height:.8,spacing:3.6};function Rx(n,t){const e=ld[t];if(!e)return n;const i=Math.min(n.w/e.w,n.h/e.h),s=e.w*i,o=e.h*i;return{x:n.x+(n.w-s)/2,y:n.y+(n.h-o)/2,w:s,h:o}}function Px(n,t,e){const i=e.fit===!1?t:Rx(t,e.layout),s={style:e.style};switch(e.layout){case"kui-frieze":return yi(n,i,{unit:"kui",count:2,facing:"centre",params:s});case"bird-frieze":return yi(n,i,{unit:"bird",count:4,facing:"centre",gap:2,params:s});case"cicada-row":return yi(n,i,{unit:{motif:"cicada",params:{length:2.8}},count:6,facing:"centre",gap:3,params:s});case"whorl-kui":{const o={motif:"whorl",w:i.h*.98};return yi(n,i,{unit:[o,{motif:"kui",params:{quills:1,crest:"hook"}}],count:5,facing:"centre",centre:o,gap:1.5,params:s})}case"eye-band":return _s(n,i,[{motif:"eyeband",params:{...s,eyes:4}}],{separator:Ga,edges:!0});case"neck-belly":return _s(n,i,[{weight:.2,frieze:{unit:"kui",count:2,facing:"centre",params:s}},{weight:.62,motif:"taotie",preset:"T1-classic",params:s},{weight:.18,frieze:{unit:"bird",count:4,facing:"centre",gap:2,params:s}}],{separator:Ga});case"blade-row":return _s(n,i,[{weight:.8,blades:{count:4,direction:"rising",gap:3,params:s}},{weight:.2,frieze:{unit:{motif:"cicada",params:{length:2.8}},count:6,facing:"centre",gap:3,params:s}}],{separator:{kind:"bowstrings",count:2,width:1.3,height:.8,spacing:3.2},edges:!1});case"houmuwu-wall":{const o=i.h*.2,a=i.w*.14;return rd(n,i,{width:{t:o,b:o,l:a,r:a},top:{unit:"kui",count:2,facing:"centre",params:{quills:2,tail:"forked",marks:"c-marks",square:.9,...s},ground:{pitch:1.3}},sides:"kui",sideHeads:"down",params:{...s,quills:1,crest:"hook"},ground:{pitch:1.3}})}case"boss-belly":return _s(n,i,[{weight:.18,motif:"eyeband",params:{...s,eyes:4}},{weight:.82,motif:"boss",params:s}],{separator:Ga,edges:!0});case"fangyi-face":return _s(n,i,[{weight:.17,frieze:{unit:"kui",count:2,facing:"centre",params:{...s,eye:"square",pupil:"slit",centreGap:6}}},{weight:.64,motif:"taotie",preset:"fangyi-body",params:s},{weight:.19,frieze:{unit:"kui",count:2,facing:"centre",params:{...s,eye:"square",pupil:"slit",centreGap:6}}}],{separator:{kind:"line",width:1.2,height:.7}})}return null}const Lx={name:"frieze",label:"Friezes & registers (composed)",schema:Tx,presets:Ax,presetPlaques:ld,draw:Px,symmetric:!1,ground:!1,plaque:{w:200,h:150}},Cx={arrangement:Yt(["pair","single"],"pair","Arrangement"),facing:Yt(["right","left"],"right","Facing (single)"),orient:Yt(["horizontal","up","down"],"horizontal","Orientation"),head:Yt(["gaping","beaked","trunked"],"gaping","Head"),turned:{type:"bool",default:!1,label:"Head turned back"},tail:Yt(["up","down","forked"],"up","Tail (forked = 歧尾)"),crest:Yt(["t","bottle","hook","none"],"t","Crest"),eye:Yt(["round","square","chen"],"round","Eye"),pupil:Yt(["dot","slit","none"],"dot","Pupil"),eyeSize:Gt(.6,1.5,.05,1,"Eye size"),quills:Gt(0,4,1,2,"Dorsal quills"),leg:{type:"bool",default:!0,label:"Leg & claw"},bandWidth:Gt(.12,.32,.01,.23,"Band width (× H)"),square:Gt(0,1,.05,.7,"Squareness"),marks:Yt(["none","c-marks"],"none","Body marks"),centreGap:Gt(0,20,.5,1.5,"Gap at centre line","mm"),...Pn({motif:1.4,boss:2.8,groove:.4,lineWeight:.5,echoInset:1,carving:"sparse"})},Dx={"k1-tail-up":{},"k2-tail-down":{tail:"down",crest:"hook"},"k3-trunked":{head:"trunked",crest:"none",quills:1},"k4-beaked":{head:"beaked",crest:"hook",eye:"round"},"carved-plateau":{carving:"spirals",bandWidth:.27,square:.9},"turned-back":{turned:!0,crest:"none",quills:1},single:{arrangement:"single"},"vertical-head-up":{arrangement:"single",orient:"up",quills:1,crest:"hook"},flush:{style:"flush",lineWeight:.55,relief:{motif:.4,boss:1.5,groove:.4}},"fangyi-band":{eye:"square",pupil:"slit",eyeSize:1.15,crest:"t",quills:1,square:.9,bandWidth:.27,carving:"spirals",lineWeight:.5,echoInset:.95,relief:{motif:1.3,boss:2.6,groove:.38}},forked:{tail:"forked",quills:3},houmuwu:{tail:"forked",eye:"round",pupil:"dot",crest:"t",quills:2,square:.92,bandWidth:.2,marks:"c-marks",lineWeight:1,echoInset:2,centreGap:6,relief:{motif:3,boss:6,groove:.8}}},Ix={single:{w:100,h:24},"vertical-head-up":{w:26,h:110},houmuwu:{w:330,h:80}};function kx(n,t,e){const i=e.bandWidth,s=e.square,o=(z=1)=>i*z*(.55-.42*s),a=z=>t-z,r=!!e.turned,l=e.head==="trunked",c=.14*e.eyeSize,h=r?.62:1,u=l?.16:0,f=a(r?.86:u),d=r?.4:0,_=r?-1:1,g=([z,Y])=>[f-_*z*h,d+Y*h],p=z=>z.map(g),m=(z,Y,J)=>new be(z,Y,J,.01),v=z=>p(z.map(([Y,J])=>[-Y,J])),M=.56,x=.4,y=.5,w=.54;n.rrect(g([y,w]),M*h,x*h,o(1.1)*h+.02);const b=w-x/2,D=y-M/2,E=i*.8*h;if(e.head==="beaked"){const z=m(-D-.02,w-.06,0).fd(D-.06).arc(-70,.09).arc(-80,.05);n.taper(v(z.pts),i*1.25*h,i*.2*h,.3)}else if(l){const z=m(-D-.04,b+E*.5,0).fd(D+u-.14).arc(90,.1).fd(.3).arc(90,.08).fd(.04).arc(90,.05);n.taper(v(z.pts),E,E*.6,.65)}else{const z=m(-D-.04,b+E*.5,0).fd(D-.12).arc(90,.075).fd(.1).arc(90,.055).fd(.02);n.taper(v(z.pts),E,E*.6,.7)}if(e.head!=="beaked"){const J=m(-.38,b+.02,-90).fd(Math.max(.02,b-.13-o())).arc(90,o()).fd(Math.max(.05,.18)).arc(-90,.04).fd(.01).arc(-90,.03);n.taper(v(J.pts),E*.85,E*.5,.75)}else{const z=m(-.3,b+.02,-90).fd(.08).arc(90,.04).fd(.06).arc(-90,.03);n.taper(v(z.pts),E*.7,E*.35,.6)}const T=i*.52*h,L=w+x/2,R=Math.max(.08,(.97-d)/h-L);if(e.crest==="t"){const z=L+R-T/h*.5-.01,Y=m(-y,L-.02,90).fd(Math.max(.02,z-L-.02));n.band(v(Y.pts),T,"flat");const J=Math.max(0,Math.min(.03,z-.03-T/h-.04-L)),et=m(-y-.15,z-J-.03,90).fd(J).arc(-90,.03).fd(.24).arc(-90,.03).fd(J);n.band(v(et.pts),T)}else if(e.crest==="bottle"){const z=m(-y,L-.02,90).fd(R*.35);n.band(v(z.pts),T,"flat"),n.rrect(g([y,L+R*.62]),.22,R*.62,.06)}else if(e.crest==="hook"){const z=m(-y-.06,L-.02,90).fd(R*.3).arc(-90,R*.35).fd(.12).arc(-90,.04).fd(.01);n.taper(v(z.pts),T,T*.55,.6)}const O=e.eye==="square"?"square":e.eye==="chen"?"oval":"round";if(n.boss(g([y,w]),c*h,{kind:O,pupil:e.pupil,base:"plateau",aspect:1.45}),e.eye==="chen"){const z=g([y,w]),Y=c*1.45*h;n.line([[z[0]+_*Y*.9,z[1]],[z[0]+_*Y*1.35,z[1]-.04*h],[z[0]+_*Y*1.35,z[1]-.09*h]]),n.line([[z[0]-_*Y*.9,z[1]],[z[0]-_*Y*1.4,z[1]+.03*h]])}const A=r?.34:.45,I=.42,C=I*.5+i*.5+.02,k=a(r?.2:y+.1),N=new be(k,A,180,.01);if(r){const z=new be(a(.2),A,90,.01).fd(.3);n.band(z.pts,i*.9)}N.fd(Math.max(.05,k-C));const F=o(1.2),V=i*.82+.07,K=s>.5;if(e.tail!=="down"?(N.arc(-90,F),K?N.spiral({a:.95-A-i*.5-F,b:I,d:V,dir:-1,turns:1.75,r:1.6-s}):N.fd(.12).curl(330,.19,.55,-1)):(N.arc(90,F),K?N.spiral({a:A-.05-i*.5-F,b:I,d:V,dir:1,turns:1.75,r:1.6-s}):N.fd(.08).curl(330,.17,.55,1)),n.taper(N.pts,i,i*.62,.5),e.tail==="forked"){const z=new be(C+i*.9,A-i*.3,250,.008).fd(Math.max(.05,A-i*.5-.2)).arc(100,.06).fd(.05).arc(110,.035);n.taper(z.pts,i*.8,i*.35,.4)}if(e.marks==="c-marks"){const z=Math.floor((k-C-.3)/(i*1.3));for(let Y=0;Y<z;Y++){const J=k-.3-Y*i*1.3,et=i*.22,it=[];for(let at=60;at<=300;at+=20)it.push([J+Math.cos(at*Math.PI/180)*et,A+Math.sin(at*Math.PI/180)*et]);n.line(it)}}const Z=e.quills|0,U=a(r?1.25:y+.4),X=Math.max(.2,U-C-I*.5-.2);for(let z=0;z<Z;z++){const Y=U-(Z===1?X*.4:X*z/Math.max(1,Z-1)),J=new be(Y,A+i*.3,118,.008).fd(.12+i*.3).arc(70,.05);n.taper(J.pts,i*.55,i*.2,.2)}if(e.leg){const z=a(r?.72:y+.5),Y=.17,J=o(.9),et=new be(z,A,-86,.01).fd(Math.max(.05,A-Y-J)).arc(86,J).fd(.07).arc(-100,.04);n.taper(et.pts,i*.78,i*.4,.6);const it=new be(z+J*.6,Y-i*.25,-30,.008).fd(.04).arc(-80,.025);n.taper(it.pts,i*.38,i*.16,.3);const at=new be(z-i*.2,Y+.02,200,.008).fd(.05).arc(80,.025);n.taper(at.pts,i*.4,i*.15,.3)}return n}function Ux(n,t,e){const i=bn(e),s=i.arrangement==="pair",o=s?Math.min(i.centreGap,t.w*.1):0,a=s?{x:t.x,y:t.y,w:t.w/2-o/2,h:t.h}:t,r=i.orient==="up"?90:i.orient==="down"?-90:0,l=r===0&&!s&&i.facing==="left",c=r===90?i.facing==="left":r===-90?i.facing!=="left":!1,h=On(a,{rot:r,flip:l,flipY:c}),u=Gn("kui",t,i),f=new zn(h,{rng:u,wobble:.004*i.irregularity});return kx(f,h.A,i),ri(n,f,i,{clip:Ei(s?{...t,w:t.w/2}:t)}),f}function Nx(n,t){const e=n.orient==="horizontal"||!n.orient?t.h:t.w;return{pitch:Math.max(.9,Math.min(2.6,e*.035))}}const Fx={name:"kui",label:"Kui dragon",schema:Cx,presets:Dx,presetPlaques:Ix,draw:Ux,groundOptions:Nx,symmetric:n=>n.arrangement!=="single",facing:!0,plaque:{w:200,h:44}},Ox={pitch:{type:"range",min:.6,max:3,step:.05,default:1.3,label:"Pitch",unit:"mm"},line:{type:"range",min:.3,max:.7,step:.02,default:.5,label:"Groove : pitch"},cellMin:{type:"range",min:3,max:8,step:.1,default:4.2,label:"Cell min (× pitch)"},cellMax:{type:"range",min:4,max:12,step:.1,default:7.8,label:"Cell max (× pitch)"},roundness:{type:"range",min:0,max:1,step:.05,default:.15,label:"Roundness"},jitter:{type:"range",min:0,max:.3,step:.01,default:.08,label:"Jitter"},pairs:{type:"range",min:0,max:1,step:.05,default:.75,label:"S-pairs"},hand:{type:"enum",options:["alternate","random","left","right"],default:"alternate",label:"Handedness"},eyes:{type:"range",min:0,max:1,step:.05,default:0,label:"Eyed centres"},echo:{type:"range",min:0,max:3,step:1,default:0,label:"Contour echoes"},follow:{type:"range",min:0,max:1,step:.05,default:1,label:"Follow contours"},mode:{type:"enum",options:["sunk","thread"],default:"sunk",label:"Mode"},depth:{type:"range",min:.1,max:1.2,step:.05,default:.45,label:"Depth",unit:"mm"},demo:{type:"enum",options:["none","blobs"],default:"none",label:"Dummy motif"},secondary:{type:"bool",default:!1,label:"Fill plateau tops"}},zx={fine:{pitch:1,depth:.35},standard:{},monumental:{pitch:2.4,depth:.9,jitter:.1},"thread-relief":{mode:"thread",depth:.35,pitch:1.4,line:.42},cloud:{roundness:.85,pitch:1.3,pairs:.9},leftover:{demo:"blobs",pitch:1.1,echo:1,secondary:!0}};function Bx(n){const t=n.cellMin*n.pitch;return{pitch:n.pitch,line:n.line,cell:[t,Math.max(t,n.cellMax*n.pitch)],roundness:n.roundness,jitter:n.jitter,pairs:n.pairs,hand:n.hand,eyes:n.eyes,echo:n.echo,follow:n.follow,mode:n.mode,depth:n.depth}}function Gx(n){const t=s=>n.x+s*n.w,e=s=>n.y+s*n.h,i=Math.min(n.w,n.h);return s=>{const o=.075*i;s.save(),s.lineWidth=o,s.lineCap="round",s.lineJoin="round",s.beginPath();const a=.06*i;s.moveTo(t(.36),e(.78)),s.arcTo(t(.1),e(.78),t(.1),e(.5),a),s.arcTo(t(.1),e(.3),t(.3),e(.3),a),s.lineTo(t(.3),e(.3)),s.lineTo(t(.3),e(.48)),s.stroke(),s.restore(),s.beginPath(),s.ellipse(t(.56),e(.62),.13*n.w,.12*n.h,-.25,0,Math.PI*2),s.fill(),s.beginPath(),s.moveTo(t(.74),e(.08)),s.lineTo(t(.94),e(.08)),s.lineTo(t(.86),e(.6)),s.closePath(),s.fill(),s.beginPath(),s.arc(t(.48),e(.2),.07*i,0,Math.PI*2),s.fill()}}function Hx(n,t,e){const i=Bx(e);if(e.demo==="blobs"){const s=Gx(t),o=Math.max(1.2,e.pitch*1.3);n.raise(s,{height:o,shoulder:.45}),n.fillGround(i,{rect:t,avoid:"raised",margin:e.pitch*.5}),e.secondary&&Yr(n,s,{...i,echo:1,eyes:0,mode:"sunk",depth:Math.min(e.depth,.4)},{margin:e.pitch*.5,level:o});return}n.fillGround(i,{rect:t,avoid:"raised",margin:e.pitch*.5})}const Vx={name:"leiwen",label:"Leiwen ground",schema:Ox,presets:zx,draw:Hx,symmetric:!1,ground:!1,plaque:{w:120,h:80}},Kh=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),Ii=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),Wx={lattice:Kh(["diagonal","square"],"diagonal","Lattice"),size:Ii(3,30,.5,9,"Cell width","mm"),aspect:Ii(.5,2,.05,1,"Cell height : width"),fill:Kh(["nested","squared","spiral","dot","plain"],"nested","Cell fill"),pitch:Ii(.5,2.5,.05,.9,"Ring pitch","mm"),line:Ii(.3,.7,.02,.48,"Groove : pitch"),depth:Ii(.1,1,.05,.4,"Depth","mm"),levels:Ii(0,3,1,2,"Halvings at the motif"),clip:{type:"bool",default:!0,label:"Cut off at the motif"},outline:{type:"bool",default:!0,label:"Lattice lines"},demo:{type:"bool",default:!0,label:"Dummy motif"},seed:Ii(0,99,1,0,"Seed")},jx={"met-gui-nested":{size:19,pitch:1,levels:1,fill:"nested"},"lozenge-spiral":{size:9,aspect:.78,fill:"spiral",pitch:.9,levels:0},"lozenge-dot":{size:7,aspect:.8,fill:"dot",pitch:.9,levels:1},"lozenge-nested-fine":{size:8,fill:"nested",pitch:.7,levels:1},"square-squared":{lattice:"square",size:9,fill:"squared",pitch:.75},"square-nested":{lattice:"square",size:10,fill:"nested",pitch:.7,levels:1}};function qx(n,t,e){if(e.demo){const i=Math.min(t.w/60,t.h/30),o=Cn((a=>a.map(([r,l])=>[t.x+r*i,t.y+l*i]))([[4,4],[4,20],[30,20],[30,12],[18,12]]),{width:6*i,round:.5,inner:.15,end:"spiral",spiral:{turns:1,dir:1}});bs(n,[o],{height:1.2,contour:{inset:.8,line:.45},fill:{kind:"lines",pitch:1.1,line:.42}})}Zl(n,{rect:t,margin:.6},{lattice:e.lattice,size:[e.size,e.size*e.aspect],fill:e.fill,pitch:e.pitch,line:e.line,depth:e.depth,levels:e.levels,clip:e.clip,outline:e.outline,seed:e.seed})}const Xx={name:"lozenge",label:"Lattice ground (lozenge / 回)",schema:Wx,presets:jx,draw:qx,symmetric:!1,ground:!1,plaque:{w:60,h:30}},Yx=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),$n=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),$x={w:$n(3,40,.1,14.4,"Width","mm"),h:$n(3,40,.1,13.5,"Height","mm"),round:$n(0,1,.01,.42,"Roundness (1 = ellipse)"),height:$n(.5,8,.1,2.4,"Relief","mm"),crown:$n(0,1,.05,.9,"Crown (0 flat top … 1 domed)"),slit:{type:"bool",default:!0,label:"Slit pupil"},slitLen:$n(.1,.8,.01,.33,"Slit length (× width)"),slitWidth:$n(.3,3,.05,.95,"Slit width","mm"),slitY:$n(-.3,.3,.01,-.07,"Slit offset (× height)"),ring:{type:"bool",default:!1,label:"Sunk ring"},ground:Yx(["leiwen-big","leiwen","none"],"leiwen-big","Ground"),pitch:$n(.5,2,.01,.72,"Ground pitch","mm")},Kx={"met-fangyi":{},"met-fangyi-kui":{w:5.6,h:5,round:.5,height:1.5,slitLen:.45,slitWidth:.6,slitY:0,pitch:.6},"met-gui":{w:15,h:11,round:.75,crown:1,slitLen:.22,slitWidth:.9,slitY:0},"met-fangding":{w:16,h:11,round:.55,crown:.75,slitLen:.28,slitWidth:.8,slitY:0,pitch:.9},ringed:{w:12,h:10,round:.6,ring:!0,slitLen:.3}};function Zx(n,t,e){const i=[t.x+t.w/2,t.y+t.h/2];Dr(n,{c:i,w:e.w,h:e.h,round:e.round,height:e.height,crown:e.crown,slit:e.slit?{len:e.w*e.slitLen,width:e.slitWidth,depth:Math.min(.9,e.height*.3),offset:[-e.w*.035,e.h*e.slitY]}:!1,ring:e.ring?{gap:.9,line:.45,depth:.35}:!1}),e.ground==="leiwen-big"?Si(n,{rect:t,margin:.5},{pitch:e.pitch,depth:.3,line:.5,cell:[6,11],pairs:0,maxAspect:1.35,jitter:.05}):e.ground==="leiwen"&&Si(n,{rect:t,margin:.5},{pitch:e.pitch,depth:.3})}const Jx={name:"pillow",label:"Pillow eye boss",schema:$x,presets:Kx,draw:Zx,symmetric:!1,ground:!1,plaque:{w:34,h:30}},Zh=(n,t,e)=>({type:"enum",options:n,default:t,label:e}),ps=(n,t,e,i,s,o)=>({type:"range",min:n,max:t,step:e,default:i,label:s,...o?{unit:o}:{}}),Qx={unit:Zh(["met-fangyi-horn","met-fangyi-eye","shapes","fills","met-fangding-band"],"met-fangyi-horn","Traced unit"),height:ps(.4,3,.05,1.2,"Plateau height","mm"),depth:ps(.1,.8,.02,.32,"Groove depth","mm"),line:ps(.25,.9,.01,.5,"Line width","mm"),ground:Zh(["leiwen-big","leiwen","lozenge","none"],"leiwen-big","Ground"),pitch:ps(.5,2,.01,.72,"Ground pitch","mm"),irregularity:ps(0,2,.1,1,"Hand irregularity"),seed:ps(0,99,1,0,"Seed")},ty={"met-fangyi-horn":{unit:"met-fangyi-horn"},"met-fangyi-eye":{unit:"met-fangyi-eye",height:2.4},shapes:{unit:"shapes",ground:"leiwen",pitch:.8},fills:{unit:"fills",ground:"none"},"met-fangding-band":{unit:"met-fangding-band",ground:"leiwen",pitch:.9,height:1.6,line:.6}},ey={"met-fangyi-horn":{w:46,h:36},"met-fangyi-eye":{w:34,h:30},shapes:{w:132,h:44},fills:{w:132,h:52},"met-fangding-band":{w:70,h:40}},ny={band:{ctrl:[[50.4,57.6],[50.4,77],[50.4,83.05],[17,83.05],[17,77],[17,62.8],[22.6,62.8]],width:[9.4,9.4,11.1,10.4,9.6,6.4,6.4],round:.5,inner:.18,start:"blunt",end:"flat",capRound:.3,contour:{inset:[.6,[1.4,1.4,2.5,2.5,1.8,1.6,1.6]],line:.5},ticks:{side:"right",pitch:4.2,line:.42},fill:{kind:"spirals",line:.5,pitch:.95,gap:.3,square:.3,tail:!1,min:3.6}},block:{c:[30.6,69.8],w:16,h:18.6,r:6,contour:!1,fill:{kind:"coil",pitch:1.35,line:.45,offset:[-1.2,1.4]}},origin:[10,56]},iy={c:[45.1,36.5],w:14.4,h:13.5,round:.42,height:2.4,crown:.9,slit:{len:4.8,width:.95,depth:.7,offset:[-.5,-.9]},origin:[30,22]},mi=(n,t,e)=>n.map(([i,s])=>[i+t,s+e]);function sy(n,t,e){const i=e,s=i.line,o={height:i.height,depth:i.depth,irregularity:i.irregularity,seed:i.seed};let a=.5;switch(i.unit){case"met-fangyi-horn":{const r=ny,l=t.x-r.origin[0],c=t.y-r.origin[1],h=r.band,u=Cn(mi(h.ctrl,l,c),{...h,contour:{...h.contour,line:s},fill:{...h.fill,line:s}}),f=yl({...r.block,c:[r.block.c[0]+l,r.block.c[1]+c]});bs(n,[u,f],o);break}case"met-fangyi-eye":{const r=iy;Dr(n,{...r,height:i.height,c:[r.c[0]+t.x-r.origin[0],r.c[1]+t.y-r.origin[1]]});break}case"shapes":{const r=t.x,l=t.y,c={contour:{inset:.9,line:s},fill:{kind:"spirals",line:s*.9,pitch:.95,square:.25,tail:!1,min:2.6}},h=[Cn(mi([[20,8],[4,8],[4,36],[20,36]],r,l),{width:[6,8,8,6],round:.6,inner:.2,start:"blunt",end:"blunt",...c}),Cn(mi([[44,36],[28,36],[28,8],[46,8],[46,20],[38,20]],r,l),{width:[6,8,8,7,6,5],round:.6,inner:.2,start:"blunt",end:"round",...c}),Cn(mi([[58,33],[66,33],[78,11],[86,11]],r,l),{width:[5,7,7,5],round:.8,inner:.3,start:"spiral",end:"spiral",spiral:{turns:.6,dir:1,gap:.7},startSpiral:{turns:.6,dir:-1,gap:.7},contour:{inset:.8,line:s},fill:{kind:"lines",line:s*.9,pitch:1.2}}),Cn(mi([[96,38],[96,10],[106,6],[110,14]],r,l),{width:[5,6,5,3],round:.9,inner:.4,start:"blunt",end:"round",contour:{inset:.8,line:s}}),Cn(mi([[116,6],[116,28],[128,34],[128,24]],r,l),{width:[6,6,4.5,1],round:.7,inner:.3,start:"blunt",end:"point",contour:{inset:.8,line:s}})];bs(n,h,o);break}case"fills":{const r=t.x,l=t.y,h=[{contour:{inset:.9,line:s},fill:null},{contour:{inset:[2.2,.7],line:s},ticks:{side:"left",pitch:2.6,line:s*.85},fill:{kind:"spirals",line:s,pitch:.95,square:.3,tail:!1,min:3}},{contour:{inset:.8,line:s},fill:{kind:"lines",line:s*.9,pitch:1.25}},{contour:{inset:.8,line:s},fill:{kind:"scales",line:s*.85,pitch:2.4}},{contour:{inset:.8,line:s},fill:{kind:"leiwen",pitch:.8,line:.45}}].map((u,f)=>Cn(mi([[f*26+22,6],[f*26+4,6],[f*26+4,46],[f*26+22,46]],r,l),{width:9,round:.55,inner:.15,start:"blunt",end:"blunt",...u}));bs(n,h,o);break}case"met-fangding-band":{const r=t.x,l=t.y,c=Cn(mi([[7,8],[7,31],[40,31],[53,24],[53,17]],r,l),{width:[9,11,10,9.5,8.5],round:[.5,.7,.9,.9,.5],inner:.25,start:"blunt",end:"spiral",spiral:{turns:.75,dir:-1,gap:.9},contour:{inset:1.1,line:s}}),h=yl({c:[r+26,l+16],w:14,h:10,r:4,contour:{inset:1,line:s}});bs(n,[c,h],o),Dr(n,{c:[r+26,l+16],w:8.5,h:6.4,round:.55,height:i.height*1.6,base:"field",crown:.8,slit:{len:3,width:.7,depth:.5}}),a=.6;break}}i.ground==="leiwen-big"?Si(n,{rect:t,margin:a},{pitch:i.pitch,depth:.3,line:.5,cell:[6,11],pairs:0,maxAspect:1.35,jitter:.05,seed:i.seed}):i.ground==="leiwen"?Si(n,{rect:t,margin:a},{pitch:i.pitch,depth:.3,seed:i.seed}):i.ground==="lozenge"&&Zl(n,{rect:t,margin:a},{size:9,fill:"nested",pitch:i.pitch*1.2,seed:i.seed})}const oy={name:"rounded",label:"Rounded bands (traced)",schema:Qx,presets:ty,presetPlaques:ey,draw:sy,symmetric:!1,ground:!1,plaque:{w:46,h:36}},ry={scale:Gt(2,8,.1,3.6,"Scale width","mm"),open:Yt(["down","up"],"down","Scales open"),body:{type:"bool",default:!0,label:"Raised body band"},...Pn({motif:1.2,boss:2,groove:.38,lineWeight:.45,carving:"none"})},ay={standard:{},fine:{scale:2.6},"handle-band":{scale:3,open:"up"}};function ly(n,t,e){const i=bn(e),o=i.style==="flush"?.12:i.relief.motif;i.body&&n.raise(c=>{c.beginPath(),c.rect(t.x,t.y,t.w,t.h),c.fill()},{height:o,shoulder:Math.min(.5,o*.4)});const a=i.scale,r=a*.62,l=i.open==="down"?1:-1;n.sink(c=>{c.save(),c.beginPath(),c.rect(t.x+.6,t.y+.6,t.w-1.2,t.h-1.2),c.clip(),c.lineWidth=i.lineWeight,c.lineCap="round";const h=Math.ceil(t.h/r)+1;for(let u=0;u<h;u++){const f=t.y+u*r,d=u%2*a/2;for(let _=t.x-a+d;_<t.x+t.w+a;_+=a)c.beginPath(),c.arc(_+a/2,f,a/2-i.lineWeight*.3,l>0?Math.PI:0,l>0?2*Math.PI:Math.PI),c.stroke()}c.restore()},{depth:i.relief.groove,shoulder:i.lineWeight/2,profile:"u"})}const cy={name:"scales",label:"Scale band",schema:ry,presets:ay,draw:ly,symmetric:!1,ground:!1,plaque:{w:120,h:24}},hy={facing:Yt(["right","left"],"right","Facing"),segments:Gt(3,9,1,6,"Segments"),bend:Gt(-.25,.25,.01,.1,"Bend"),girth:Gt(.35,.7,.01,.5,"Girth (× H)"),...Pn({motif:1.2,boss:2,groove:.38,lineWeight:.5,echoInset:.8,carving:"none"})},uy={standard:{},straight:{bend:0,segments:7},flush:{style:"flush",relief:{motif:.35,boss:1,groove:.35}}};function fy(n,t,e){const i=bn(e),s=On(t,{flip:i.facing==="left"}),o=new zn(s,{rng:Gn("silkworm",t,i),wobble:.003*i.irregularity}),a=s.A,r=i.girth,l=r*.55,c=r*.5+.04,h=a-l*2-.02,u=g=>.5-i.bend*Math.sin(Math.PI*g)+i.bend*.5,f=[];for(let g=0;g<=60;g++){const p=g/60;f.push([c+(h-c)*p,u(p)])}o.taper(f,r*.75,r,0);const d=[a-l-.02,u(1)+.02];o.circle(d,l),o.boss([d[0]+l*.25,d[1]+l*.35],l*.22,{kind:"round",pupil:"none",base:"plateau"}),o.boss([d[0]+l*.25,d[1]-l*.35],l*.22,{kind:"round",pupil:"none",base:"plateau"});const _=i.segments|0;for(let g=1;g<=_;g++){const p=g/(_+1),m=c+(h-c)*p,v=r*(.75+.25*p)/2*.9;o.line([[m-.03,u(p)+v],[m+.03,u(p)],[m-.03,u(p)-v]])}return o.line([[d[0]-l*.95,d[1]+l*.7],[d[0]-l*.95,d[1]-l*.7]]),ri(n,o,i,{clip:Ei(t)}),o}const dy={name:"silkworm",label:"Silkworm",schema:hy,presets:uy,draw:fy,symmetric:!1,facing:!0,plaque:{w:60,h:18}},py={form:Yt(["sinuous","coiled"],"sinuous","Form"),facing:Yt(["right","left"],"right","Facing"),waves:Gt(.5,3,.25,1.5,"Waves"),amplitude:Gt(.05,.3,.01,.18,"Amplitude (× H)"),bandWidth:Gt(.15,.4,.01,.26,"Body width (× H)"),marks:Yt(["c-hooks","scales","none"],"c-hooks","Body marks"),...Pn({motif:1.2,boss:2.2,groove:.36,lineWeight:.45,echoInset:.8,carving:"sparse"})},my={sinuous:{},coiled:{form:"coiled",marks:"none"},flush:{style:"flush",relief:{motif:.35,boss:1.1,groove:.35}}},gy={coiled:{w:50,h:50}};function _y(n,t,e){const i=bn(e),s=On(t,{flip:i.facing==="left"}),o=new zn(s,{rng:Gn("snake",t,i),wobble:.003*i.irregularity}),a=i.bandWidth;let r,l,c;if(i.form==="coiled"){const p=s.A/2,m=new be(p+.44,.5,90,.006).curl(560,.44,.55,1);r=m.pts,l=m.at,c=m.h}else{r=[];const p=.08,m=s.A-.42;for(let v=0;v<=120;v++){const M=v/120;r.push([p+(m-p)*M,.5+i.amplitude*Math.sin(M*i.waves*Math.PI*2)*Math.min(1,M*4)])}l=r[r.length-1],c=0}o.taper(r,a*.3,a,0);const h=c*Math.PI/180,u=Math.cos(h),f=Math.sin(h),d=.34,_=.24,g=(p,m)=>[l[0]+u*p-f*m,l[1]+f*p+u*m];o.poly([g(-.04,_*.55),g(d*.55,_),g(d,_*.25),g(d*1.06,0),g(d,-_*.25),g(d*.55,-_),g(-.04,-_*.55)]);for(const p of[1,-1])o.boss(g(d*.5,p*_*.55),.06,{kind:"round",pupil:"none",base:"plateau"});if(i.marks!=="none"&&i.form==="sinuous")for(let p=8;p<r.length-10;p+=9){const[m,v]=r[p],M=a*.24,x=[];if(i.marks==="c-hooks")for(let y=0;y<=10;y++){const w=Math.PI*(.35+1.3*y/10);x.push([m+Math.cos(w)*M,v+Math.sin(w)*M])}else for(let y=0;y<=10;y++){const w=Math.PI*(1+y/10);x.push([m+Math.cos(w)*M,v+M*.6+Math.sin(w)*M])}o.line(x)}return ri(n,o,i,{clip:Ei(t)}),o}const My={name:"snake",label:"Snake",schema:py,presets:my,presetPlaques:gy,draw:_y,symmetric:!1,facing:!0,plaque:{w:110,h:24}},vy={kind:Yt(["whorl","petal"],"whorl","Kind (火纹 / 四瓣目纹)"),spokes:Gt(3,7,1,5,"Spokes"),turn:Yt(["ccw","cw"],"ccw","Sweep"),sweep:Gt(40,110,5,75,"Spoke sweep","°"),size:Gt(.5,1,.01,.92,"Diameter (of rect)"),centre:Yt(["circle","boss","ring"],"circle","Centre"),dome:Gt(0,1,.05,.6,"Doming"),...Pn({motif:1.6,boss:2.6,groove:.5,lineWeight:.6,echoInset:.9,carving:"none"})},xy={"five-spokes":{},"four-spokes":{spokes:4,sweep:85},"six-spokes":{spokes:6,sweep:65},"post-cap":{spokes:6,size:.98,centre:"boss",dome:.9,relief:{motif:3,boss:4.5,groove:.6}},petal:{kind:"petal",carving:"sparse"},flush:{style:"flush",relief:{motif:.4,boss:1.2,groove:.4}}};function yy(n,t,e,i,s,o,a,r,l=40){const c=[],h=[];for(let f=0;f<=l;f++){const d=f/l,_=e+(i-e)*d,g=s+o*d,p=(a+(r-a)*Math.pow(d,.8))/2,m=Math.cos(g),v=Math.sin(g),M=-Math.sin(g)*Math.sign(o),x=Math.cos(g)*Math.sign(o),y=(m*.35+M)*p,w=(v*.35+x)*p;c.push([n+m*_+y,t+v*_+w]),h.push([n+m*_-y,t+v*_-w])}const u=[];for(let f=1;f<8;f++){const d=s+Math.PI/2+f/8*Math.PI;u.push([n+Math.cos(s)*e+Math.cos(d)*a*.5*Math.sign(o),t+Math.sin(s)*e+Math.sin(d)*a*.5*Math.sign(o)])}return c.concat(h.reverse(),u)}function by(n,t,e){const i=bn(e),s=t.x+t.w/2,o=t.y+t.h/2,a=Math.min(t.w,t.h)/2*i.size,r=i.style==="flush",l=i.relief,c=i.lineWeight;if(i.kind==="petal")return wy(n,t,i,s,o,a);const h=r?.12:l.motif,u=r?0:i.dome,f=Math.max(.3,Math.min(.7,h*.4));n.raise(M=>{M.beginPath(),M.arc(s,o,a,0,Math.PI*2),M.fill()},{height:h*(1+u*.5),shoulder:a,profile:(M,x)=>Ns.plateau(M,f)*(1-u*.33+u*.33*Math.sqrt(Math.max(0,1-(1-M/x)**2)))}),r&&n.sink(M=>{M.beginPath(),M.arc(s,o,a-c,0,Math.PI*2),M.lineWidth=c,M.stroke()},{depth:l.groove,shoulder:c/2});const d=i.spokes|0,_=i.turn==="cw"?-1:1,g=a*.24,m=Gn("whorl",t,i).range(0,Math.PI*2),v=Math.min(a*.24,2*Math.PI*a/d*.17);n.sink(M=>{for(let x=0;x<d;x++){const y=m+x/d*Math.PI*2,w=yy(s,o,g+c*1.4,a-Math.max(.5,c*.9),y,_*(i.sweep*Math.PI)/180,c*1.3,v);M.beginPath(),w.forEach((b,D)=>D?M.lineTo(b[0],b[1]):M.moveTo(b[0],b[1])),M.closePath(),M.fill()}},{depth:l.groove*1.2,shoulder:c*.6,profile:"u"}),i.centre==="boss"&&n.raise(M=>{M.beginPath(),M.arc(s,o,g*.85,0,Math.PI*2),M.fill()},{height:Math.max(l.boss,h*1.6),profile:"dome"}),n.sink(M=>{M.beginPath(),M.arc(s,o,g,0,Math.PI*2),M.lineWidth=c,M.stroke()},{depth:l.groove,shoulder:c/2}),i.centre==="ring"&&n.sink(M=>{M.beginPath(),M.arc(s,o,g*.45,0,Math.PI*2),M.fill()},{depth:l.groove*.8,shoulder:c/2})}function wy(n,t,e,i,s,o){const a=o*2,r=On({x:i-o,y:s-o,w:a,h:a}),l=new zn(r,{rng:Gn("petal",t,e),wobble:.003*e.irregularity}),c=.12,h=new be(.5,c/2,0,.006).fd(.5-c/2-.08).arc(90,.08).fd(1-c-.16).arc(90,.08).fd(1-c-.16).arc(90,.08).fd(1-c-.16).arc(90,.08).fd(.5-c/2-.08);l.band(h.pts,c);for(let u=0;u<4;u++){const f=45+u*90,d=f*Math.PI/180,_=new be(.5+Math.cos(d)*.2,.5+Math.sin(d)*.2,f,.006).fd(.1).arc(90,.07).fd(.03).arc(90,.045);l.taper(_.pts,c*1.1,c*.7,.4)}l.circle([.5,.5],.17),l.boss([.5,.5],.12,{kind:"round",pupil:"dot",base:"plateau"}),ri(n,l,e,{clip:Ei(t)})}const Sy={name:"whorl",label:"Whorl circle",schema:vy,presets:xy,draw:by,symmetric:!1,plaque:{w:60,h:60},groundOptions:(n,t)=>({pitch:Math.max(.8,Math.min(2,Math.min(t.w,t.h)*.045))})},Ey=Object.freeze(Object.defineProperty({__proto__:null,bands:Hv,bird:Yv,blade:cx,boss:mx,cicada:tx,eyeband:vx,frieze:Lx,kui:Fx,leiwen:Vx,lozenge:Xx,pillow:Jx,rounded:oy,scales:cy,silkworm:dy,snake:My,taotie:Iv,whorl:Sy},Symbol.toStringTag,{value:"Module"})),Bs={};function cd(n){if(!n||!n.name||typeof n.draw!="function")throw new Error("registerMotif: needs { name, draw }");return Bs[n.name]=n,n}function Gs(n){if(typeof n=="object")return n;const t=Bs[n];if(!t)throw new Error(`unknown motif "${n}" (have: ${Object.keys(Bs).join(", ")})`);return t}function Eo(n,t={},e){var a;const i=Gs(n),s=Ql(i.schema),o=e?((a=i.presets)==null?void 0:a[e])??{}:{};return Al(Al(s,o),t)}function Al(n,t){const e={...n};for(const[i,s]of Object.entries(t||{}))e[i]=s&&typeof s=="object"&&!Array.isArray(s)&&n[i]&&typeof n[i]=="object"?Al(n[i],s):s;return e}for(const n of Object.values(Ey))cd(n);const gi={pos:new q,nrm:new q},ki=[0,0,1];function oe({surface:n,segments:t={density:1},relief:e=null,reliefRect:i={u0:0,v0:0,u1:1,v1:1},back:s=null,fade:o=1.5,normals:a="surface",maxVerts:r=4e5,reliefScale:l=1,panelMap:c=null,samples:h=null}){const u=Jh(n,!0),f=Jh(n,!1);let d,_;if(h!=null&&h.u&&(h!=null&&h.v))d=h.u.length-1,_=h.v.length-1,r=1/0;else if(Array.isArray(t))[d,_]=t;else{const et=t.density??1;d=Math.max(1,Math.ceil(u*et)),_=Math.max(1,Math.ceil(f*et))}const g=s?r/2:r;if((d+1)*(_+1)>g){const et=Math.sqrt(g/((d+1)*(_+1)));d=Math.max(1,Math.floor(d*et)),_=Math.max(1,Math.floor(_*et))}const p=d+1,m=p*(_+1),v=Math.max(u/d,f/_),M=h!=null&&h.u&&(h!=null&&h.v)?h.u:null,x=h!=null&&h.u&&(h!=null&&h.v)?h.v:null,y=et=>M?M[et]:et/d,w=et=>x?x[et]:et/_,b=new Float32Array(m*3),D=new Float32Array(m*3);for(let et=0;et<=_;et++)for(let it=0;it<=d;it++){const at=(et*p+it)*3;gi.nrm.set(0,0,0),n(y(it),w(et),gi),b[at]=gi.pos.x,b[at+1]=gi.pos.y,b[at+2]=gi.pos.z,D[at]=gi.nrm.x,D[at+1]=gi.nrm.y,D[at+2]=gi.nrm.z}const E=new Float32Array(m*3),T=new Float32Array(m*3);Qh(b,d,_,E,T);for(let et=0;et<m;et++){const it=et*3;if(D[it]*D[it]+D[it+1]*D[it+1]+D[it+2]*D[it+2]<1e-12){const at=no(E[it],E[it+1],E[it+2],T[it],T[it+1],T[it+2]);Ha(at),D[it]=at[0],D[it+1]=at[1],D[it+2]=at[2]}}const L=new Float32Array(m*3),R=new Float32Array(m*2),O=i,A=typeof o=="number"?{u0:o,u1:o,v0:o,v1:o}:{u0:0,u1:0,v0:0,v1:0,...o},I=e?e.macro(v):null;for(let et=0;et<=_;et++)for(let it=0;it<=d;it++){const at=et*p+it,_t=at*3,W=y(it),j=w(et);let $=(W-O.u0)/(O.u1-O.u0),st=(j-O.v0)/(O.v1-O.v0),ot=1;c&&(ki[0]=$,ki[1]=st,ki[2]=1,c(W,j,ki),$=ki[0],st=ki[1],ot=ki[2]),R[at*2]=e?$:W,R[at*2+1]=e?st:j;let wt=0;if(I&&$>=0&&$<=1&&st>=0&&st<=1){const ut=e.widthMM,S=e.heightMM,P=Math.min(lr($*ut,A.u0),lr((1-$)*ut,A.u1)),Q=Math.min(lr(st*S,A.v0),lr((1-st)*S,A.v1));wt=I.sample($,st)*P*Q*ot*l}L[_t]=b[_t]+D[_t]*wt,L[_t+1]=b[_t+1]+D[_t+1]*wt,L[_t+2]=b[_t+2]+D[_t+2]*wt}let C=D;if(a==="displaced"&&I){const et=new Float32Array(m*3),it=new Float32Array(m*3);Qh(L,d,_,et,it),C=new Float32Array(m*3);for(let at=0;at<m;at++){const _t=at*3,W=no(et[_t],et[_t+1],et[_t+2],it[_t],it[_t+1],it[_t+2]);Ha(W);const j=W[0]*D[_t]+W[1]*D[_t+1]+W[2]*D[_t+2]<0?-1:1;C[_t]=W[0]*j,C[_t+1]=W[1]*j,C[_t+2]=W[2]*j}}const k=new Float32Array(m*4);for(let et=0;et<m;et++){const it=et*3;let at=E[it],_t=E[it+1],W=E[it+2];const j=C[it],$=C[it+1],st=C[it+2],ot=at*j+_t*$+W*st;at-=j*ot,_t-=$*ot,W-=st*ot;const wt=Math.hypot(at,_t,W)||1;at/=wt,_t/=wt,W/=wt;const ut=no(j,$,st,at,_t,W),S=ut[0]*T[it]+ut[1]*T[it+1]+ut[2]*T[it+2]<0?-1:1;k[et*4]=at,k[et*4+1]=_t,k[et*4+2]=W,k[et*4+3]=S}const N=((_>>1)*p+(d>>1))*3,F=no(E[N],E[N+1],E[N+2],T[N],T[N+1],T[N+2]),V=F[0]*D[N]+F[1]*D[N+1]+F[2]*D[N+2]>=0,K=[];for(let et=0;et<_;et++)for(let it=0;it<d;it++){const at=et*p+it,_t=at+1,W=at+p+1,j=at+p;V?K.push(at,_t,W,at,W,j):K.push(at,W,_t,at,j,W)}const Z=[L],U=[C],X=[R],z=[k];let Y=m;if(s&&s.thickness>0){const et=s.thickness,it=new Float32Array(m*3),at=new Float32Array(m*3),_t=new Float32Array(m*2).fill(-1),W=new Float32Array(m*4);for(let $=0;$<m;$++){const st=$*3;it[st]=b[st]-D[st]*et,it[st+1]=b[st+1]-D[st+1]*et,it[st+2]=b[st+2]-D[st+2]*et,at[st]=-D[st],at[st+1]=-D[st+1],at[st+2]=-D[st+2],W[$*4]=k[$*4],W[$*4+1]=k[$*4+1],W[$*4+2]=k[$*4+2],W[$*4+3]=-k[$*4+3]}for(let $=0;$<_;$++)for(let st=0;st<d;st++){const ot=Y+$*p+st,wt=ot+1,ut=ot+p+1,S=ot+p;V?K.push(ot,ut,wt,ot,S,ut):K.push(ot,wt,ut,ot,ut,S)}Z.push(it),U.push(at),X.push(_t),z.push(W),Y+=m;const j=s.rims??["u0","u1","v0","v1"];for(const $ of j){const st=[];if($==="v0")for(let rt=0;rt<=d;rt++)st.push(rt);if($==="v1")for(let rt=0;rt<=d;rt++)st.push(_*p+rt);if($==="u0")for(let rt=0;rt<=_;rt++)st.push(rt*p);if($==="u1")for(let rt=0;rt<=_;rt++)st.push(rt*p+d);const ot=$[0]==="u"?E:T,wt=$[1]==="0"?-1:1,ut=st.length,S=new Float32Array(ut*2*3),P=new Float32Array(ut*2*3),Q=new Float32Array(ut*2*2).fill(-1),ft=new Float32Array(ut*2*4);for(let rt=0;rt<ut;rt++){const Mt=st[rt]*3,bt=[ot[Mt]*wt,ot[Mt+1]*wt,ot[Mt+2]*wt];Ha(bt);for(let xt=0;xt<2;xt++){const yt=xt===0?L:it,St=(rt*2+xt)*3;S[St]=yt[Mt],S[St+1]=yt[Mt+1],S[St+2]=yt[Mt+2],P[St]=bt[0],P[St+1]=bt[1],P[St+2]=bt[2];const ht=(rt*2+xt)*4;ft[ht]=D[Mt],ft[ht+1]=D[Mt+1],ft[ht+2]=D[Mt+2],ft[ht+3]=1}}for(let rt=0;rt<ut-1;rt++){const dt=Y+rt*2,Mt=dt+1,bt=dt+3,xt=dt+2,yt=rt*2*3,St=(rt*2+1)*3,ht=(rt*2+2)*3,At=no(S[St]-S[yt],S[St+1]-S[yt+1],S[St+2]-S[yt+2],S[ht]-S[yt],S[ht+1]-S[yt+1],S[ht+2]-S[yt+2]);At[0]*P[yt]+At[1]*P[yt+1]+At[2]*P[yt+2]>=0?K.push(dt,Mt,bt,dt,bt,xt):K.push(dt,bt,Mt,dt,xt,bt)}Z.push(S),U.push(P),X.push(Q),z.push(ft),Y+=ut*2}}const J=new Ze;return J.setAttribute("position",new Ae(cr(Z),3)),J.setAttribute("normal",new Ae(cr(U),3)),J.setAttribute("uv",new Ae(cr(X),2)),J.setAttribute("tangent",new Ae(cr(z),4)),J.setIndex(Y>65535?new jr(K,1):new Wr(K,1)),J.computeBoundingBox(),J.computeBoundingSphere(),J.userData={nu:d,nv:_,spacing:v,lenU:u,lenV:f},J}function Ty(n,t,e,i){const s=ar(n),o=ar(t),a=ar(e),r=ar(i);return(l,c,h)=>{h.pos.set((1-c)*((1-l)*s.x+l*o.x)+c*((1-l)*a.x+l*r.x),(1-c)*((1-l)*s.y+l*o.y)+c*((1-l)*a.y+l*r.y),(1-c)*((1-l)*s.z+l*o.z)+c*((1-l)*a.z+l*r.z))}}function ar(n){return Array.isArray(n)?new q(n[0],n[1],n[2]):n}function lr(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Jh(n,t){const e={pos:new q,nrm:new q};let i=0;for(const s of[0,.5,1]){let o=0,a=null;for(let r=0;r<=24;r++){const l=r/24;n(t?l:s,t?s:l,e),a&&(o+=a.distanceTo(e.pos)),a=e.pos.clone()}i=Math.max(i,o)}return Math.max(i,.001)}function Qh(n,t,e,i,s){const o=t+1;for(let a=0;a<=e;a++)for(let r=0;r<=t;r++){const l=(a*o+r)*3,c=Math.max(0,r-1),h=Math.min(t,r+1),u=Math.max(0,a-1),f=Math.min(e,a+1),d=(a*o+c)*3,_=(a*o+h)*3,g=(u*o+r)*3,p=(f*o+r)*3;for(let m=0;m<3;m++)i[l+m]=n[_+m]-n[d+m],s[l+m]=n[p+m]-n[g+m]}}function no(n,t,e,i,s,o){return[t*o-e*s,e*i-n*o,n*s-t*i]}function Ha(n){const t=Math.hypot(n[0],n[1],n[2])||1;return n[0]/=t,n[1]/=t,n[2]/=t,n}function cr(n){const t=n.reduce((s,o)=>s+o.length,0),e=new Float32Array(t);let i=0;for(const s of n)e.set(s,i),i+=s.length;return e}function tu(n,t=!1){const e=n[0].index!==null,i=new Set(Object.keys(n[0].attributes)),s=new Set(Object.keys(n[0].morphAttributes)),o={},a={},r=n[0].morphTargetsRelative,l=new Ze;let c=0;for(let h=0;h<n.length;++h){const u=n[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in u.attributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;o[d]===void 0&&(o[d]=[]),o[d].push(u.attributes[d]),f++}if(f!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(r!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(t){let d;if(e)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const u=[];for(let f=0;f<n.length;++f){const d=n[f].index;for(let _=0;_<d.count;++_)u.push(d.getX(_)+h);h+=n[f].attributes.position.count}l.setIndex(u)}for(const h in o){const u=eu(o[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let f=0;f<u;++f){const d=[];for(let g=0;g<a[h].length;++g)d.push(a[h][g][f]);const _=eu(d);if(!_)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(_)}}return l}function eu(n){let t,e,i,s=-1,o=0;for(let c=0;c<n.length;++c){const h=n[c];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;o+=h.array.length}const a=new t(o);let r=0;for(let c=0;c<n.length;++c)a.set(n[c].array,r),r+=n[c].array.length;const l=new Ae(a,e,i);return s!==void 0&&(l.gpuType=s),l}const Ay=`
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
`,Ry=`
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
`,Py=`
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
`,Ly=Ay+Ry+Py,ii={age:{group:"master",label:"Time in the ground",min:0,max:1,step:.005,default:1},tin:{group:"Alloy",label:"Tin (Sn wt)",min:0,max:.3,step:.005,default:.14,hint:"F0 from the §1.2 table: copper-pink → warm gold (0.12) → pale gold → speculum"},lead:{group:"Alloy",label:"Lead (Pb wt)",min:0,max:.25,step:.005,default:.03,hint:"greys and dulls the metal"},polish:{group:"Alloy",label:"Polish",min:0,max:1,step:.01,default:.6,hint:"abraded fields / relief tops: roughness 0.40 → 0.12; recesses stay as-cast"},tarnish:{group:"Alloy",label:"Tarnish",min:0,max:1,step:.01,default:.5,hint:"thin oxide film: gold → brown-gold"},malachite:{group:"Carbonates & blue",key:!0,label:"Carbonate crust",min:0,max:1,step:.01,default:.6,hint:"how much of the surface the copper carbonates take"},carbonate:{group:"Carbonates & blue",key:!0,label:"Carbonate balance",min:0,max:1,step:.01,default:0,hint:"0 malachite green · 0.5 pale blue-green / turquoise phase · 1 azurite blue — by territory, never a teal blend"},azurite:{group:"Carbonates & blue",key:!0,label:"Azurite",min:0,max:.6,step:.01,default:.05,hint:"blue islands on top of / among the carbonates"},azuriteDepth:{group:"Carbonates & blue",label:"Depth of blue",min:0,max:1,step:.01,default:.5,hint:"pale powdery sky blue → deep crystalline ultramarine"},azuriteScale:{group:"Carbonates & blue",label:"Azurite patch",min:3,max:60,step:.5,default:14,unit:"mm"},blueHabitat:{group:"Carbonates & blue",label:"Blue lives in",min:0,max:1,step:.01,default:.5,hint:"0 recesses and grooves · 1 open crust patches"},turquoiseTone:{group:"Carbonates & blue",label:"Blue-green tone",min:0,max:1,step:.01,default:.3,hint:"the turquoise / chrysocolla-like phase: pale chalky → deep sea blue-green"},malachiteHue:{group:"Carbonates & blue",label:"Malachite hue",min:0,max:1,step:.01,default:.45,hint:"blue-green → yellow-green"},malachiteTone:{group:"Carbonates & blue",label:"Malachite tone",min:0,max:1,step:.01,default:.5,hint:"dark compact wet-looking → pale earthy crust"},islands:{group:"Carbonates & blue",label:"Film ↔ islands",min:0,max:1,step:.01,default:.6,hint:"0 thin translucent films that fade out · 1 sharp-edged crust islands"},malachiteScale:{group:"Carbonates & blue",label:"Crust grain",min:.5,max:8,step:.1,default:2,unit:"mm",hint:"botryoidal dome size"},crust:{group:"Carbonates & blue",label:"Crust thickness",min:0,max:4,step:.05,default:1,unit:"mm",hint:"thick crust fills the line work"},tinOxide:{group:"Other corrosion",label:"Noble patina",min:0,max:1,step:.01,default:.2,hint:"Type I tin-oxide skin territories (water patina): dark, smooth, keeps the cast surface"},tinOxideTone:{group:"Other corrosion",label:"Noble tone",min:0,max:2,step:.01,default:1,hint:"0 black 黑漆古 · 1 olive · 2 grey 水银古"},nobleRelief:{group:"Other corrosion",label:"Noble on raised décor",min:-1,max:1,step:.01,default:1,hint:"how much paler the noble skin is on raised décor than on the ground: 1 paler plateaus · 0 the field tone · −1 darker plateaus (Houmuwu: friezes read darker than the plain field)"},nobleWarmth:{group:"Other corrosion",label:"Noble warmth",min:0,max:1,step:.01,default:0,hint:"olive-green skin → warm grey-brown (a thin sheet with the cuprite glowing through)"},cuprite:{group:"Other corrosion",label:"Cuprite",min:0,max:1,step:.01,default:.7,hint:"red-brown Cu₂O on the metal, shows where the crust is thin or worn"},cupriteTone:{group:"Other corrosion",label:"Cuprite tone",min:0,max:1,step:.01,default:0,hint:"0 compact liver / oxblood · 1 pale powdery brick-pink, unveiled (cuprite blotches under a lime bloom, Houmuwu fields)"},chloride:{group:"Other corrosion",label:"Chloride",min:0,max:1,step:.01,default:.08,hint:"bronze disease: pale powdery pustules over pits"},soot:{group:"Other corrosion",label:"Soot",min:0,max:1,step:.01,default:0,hint:"tenorite/soot on the lower body and legs (fire)"},crevice:{group:"Other corrosion",label:"Crevice bias",min:0,max:1,step:.01,default:.7,hint:"how strongly crust prefers recesses"},patchScale:{group:"Other corrosion",label:"Territory size",min:20,max:200,step:1,default:70,unit:"mm"},mottleScale:{group:"Other corrosion",label:"Mottle size",min:3,max:40,step:.5,default:12,unit:"mm"},patchiness:{group:"Other corrosion",label:"Territories ↔ fine mottle",min:0,max:1,step:.01,default:1,hint:"1 broad territories and crust islands · 0 every layer breaks up at the mottle size instead (a fine speckled skin, no large blotches)"},softness:{group:"Other corrosion",label:"Soft mottle",min:0,max:1,step:.01,default:0,hint:"0 crisp layer edges · 1 every layer edge feathers into the next and the fine grain drops to a whisper: low-contrast blended mottle, no dots"},drift:{group:"Other corrosion",label:"Slow tone drift",min:0,max:1,step:.01,default:0,hint:"a slow drift of lightness and warmth across the skin at the territory size (50–200 mm)"},lowerBody:{group:"Other corrosion",label:"Lower body",min:0,max:1,step:.01,default:0,hint:"legs and foot below the lower-body height: darker and greener skin (Houmuwu legs)"},lowerHeight:{group:"Other corrosion",label:"Lower body height",min:0,max:1,step:.01,default:.35,hint:"fraction of the vessel height where the lower-body skin fades out"},lowerColor:{group:"Other corrosion",label:"Lower body tint",type:"color",default:"#a1bea3",hint:"multiplies the lower-body skin: green-grey darkens and greens it (Houmuwu legs), a warm tint gives a red-brown foot band (Met fangyi)"},plainTone:{group:"Other corrosion",label:"Plain parts tone",min:.2,max:1.5,step:.01,default:1,hint:"multiplies the skin on plain, undecorated surfaces (knob stem, neck band, plain fields): < 1 darker than the décor (Nezu)"},upperTone:{group:"Other corrosion",label:"Upper body tone",min:.4,max:1.4,step:.01,default:1,hint:"multiplies the skin above the upper-body height: < 1 a darker lid (fangyi) or trumpet (gu) than the body"},upperHeight:{group:"Other corrosion",label:"Upper body height",min:0,max:1,step:.01,default:.65,hint:"fraction of the vessel height where the upper-body tone starts"},rimCalm:{group:"Other corrosion",label:"Calm rim & handles",min:0,max:1,step:.01,default:0,hint:"the upper part of the vessel (above ~60 % of its height): plain parts (rim, handles) and up-facing faces lose the wall mottle: one worn skin; plain parts anywhere (flanges, legs) also lose the fine speckle"},speckle:{group:"Grain & crust",key:!0,label:"Fine speckle",min:0,max:1,step:.01,default:0,hint:"a dense mm-scale speckle of a second mineral interleaved with the skin (Houmuwu red cuprite, Met fangyi dark-green specks); amount ≈ area"},speckleScale:{group:"Grain & crust",label:"Speckle grain",min:.5,max:8,step:.1,default:2,unit:"mm"},speckleColor:{group:"Grain & crust",label:"Speckle colour",type:"color",default:"#8f5a48"},speckleDecor:{group:"Grain & crust",label:"Speckle avoids décor",min:0,max:1,step:.01,default:0,hint:"0 everywhere · 1 only on the plain fields, off the décor bands (Houmuwu: red panels, greyer friezes)"},crustIsles:{group:"Grain & crust",key:!0,label:"Crust islands",min:0,max:1,step:.01,default:0,hint:"hard-edged, ragged, fully matte islands of pale earthy crust (grey-green, buff); amount ≈ area where they live"},crustScale:{group:"Grain & crust",label:"Crust island size",min:2,max:30,step:.5,default:8,unit:"mm"},crustColor:{group:"Grain & crust",label:"Crust colour",type:"color",default:"#8b8e78"},crustPlace:{group:"Grain & crust",label:"Crust lives on",min:0,max:1,step:.01,default:.6,hint:"0 décor recesses and friezes · 1 arrises, plain bands, rim, flanges and the lower body"},pustules:{group:"Grain & crust",label:"Malachite pustules",min:0,max:1,step:.01,default:0,hint:"saturated emerald pustules (2–10 mm) in clusters, weighted to the rim lip, the foot and recesses"},pustuleScale:{group:"Grain & crust",label:"Pustule size",min:2,max:14,step:.5,default:5,unit:"mm"},pustuleColor:{group:"Grain & crust",label:"Pustule colour",type:"color",default:"#2e7658"},grain:{group:"Grain & crust",label:"Skin grain",min:0,max:1,step:.01,default:0,hint:"soft multi-scale breathing of lightness, hue and roughness at 2–10 mm on every surface (no dots): plain walls stop reading as dead-flat paint"},tint:{group:"Grain & crust",label:"Skin tint",type:"color",default:"#ffffff",hint:"multiplies the whole corroded skin: a last hue correction (white = none)"},matte:{group:"Surface",key:!0,label:"Matte (dry skin)",min:0,max:1,step:.01,default:0,hint:"micro-pitted, dusty excavated skin: no broad glossy highlights. 0 keeps each layer’s own sheen (as-cast, heirloom)"},dulling:{group:"Surface",label:"Dulling",min:0,max:1,step:.01,default:0,hint:"dust, old wax and fine soil in the pores grey every mineral colour down"},tops:{group:"Surface",key:!0,label:"Relief tops",min:0,max:1,step:.01,default:0,hint:"relief tops rubbed clean: darker, warmer, smoother skin — the décor reads"},topsTone:{group:"Surface",label:"Relief tops tone",min:0,max:1,step:.01,default:0,hint:"0 rubbed darker & warmer · 1 paler silvery-grey bands (flush décor read by colour: Met zun / gu, Houmuwu plateaus)"},earth:{group:"Surface",label:"Burial soil",min:0,max:1,step:.01,default:.3},earthColor:{group:"Surface",label:"Soil colour",type:"color",default:"#8f7048"},calcite:{group:"Surface",label:"Calcareous film",min:0,max:1,step:.01,default:.15,hint:"whitish lime dusting that pales the crust"},streaks:{group:"Surface",label:"Streaks & tide line",min:0,max:1,step:.01,default:0,hint:"runs of groundwater down the walls, one pale tide line"},burialSide:{group:"Surface",label:"Burial side",min:0,max:1,step:.01,default:.3,hint:"one side lay in the soil"},recessDirt:{group:"Surface",label:"Recess dirt",min:0,max:1,step:.01,default:.3},ledgeMatte:{group:"Surface",label:"Dusty ledges",min:0,max:1,step:.01,default:0,hint:"up-facing ledges and eaves hold dust: fully matte, no glossy sheen catching the lights (never brighter than the lit walls)"},interiorTone:{group:"Surface",label:"Interior skin",min:0,max:1,step:.01,default:.3,hint:"inside the vessel: dark grey-brown → pale green corroded skin"},wax:{group:"Surface",label:"Museum wax",min:0,max:1,step:.01,default:0},inlay:{group:"Surface",label:"Black inlay",min:0,max:1,step:.01,default:0,hint:"paste in the sunk lines (as made)"},inlayGround:{group:"Surface",label:"Inlay fills the ground",min:0,max:1,step:.01,default:0,hint:"the black paste fills the whole sunk ground of the décor, not only the lines: flush bands read light on black (Met zun)"},wear:{group:"Surface",key:!0,label:"Wear",min:0,max:1,step:.01,default:.2,hint:"erases from the top down on arrises"},seed:{group:"Surface",label:"Seed",min:0,max:99,step:1,default:7}},Ls={"as-cast":{age:1,tin:.14,lead:.03,polish:.65,tarnish:.12,cuprite:0,tinOxide:0,malachite:0,azurite:0,chloride:0,soot:0,earth:0,calcite:0,recessDirt:.15,wax:0,inlay:.85,wear:0,crust:0},"excavated-green":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.7,cuprite:.75,tinOxide:.75,tinOxideTone:.8,malachite:.45,carbonate:.15,azurite:.03,azuriteScale:10,blueHabitat:.3,turquoiseTone:.15,malachiteHue:.45,malachiteTone:.6,islands:.55,malachiteScale:2,crust:.6,chloride:.08,soot:.05,crevice:.85,patchScale:70,mottleScale:10,patchiness:.6,earth:.1,earthColor:"#7d6a50",calcite:.2,streaks:.35,burialSide:.3,recessDirt:.2,interiorTone:.3,wax:0,inlay:0,wear:.2,dulling:.5,tops:.45,nobleWarmth:.4,matte:.6},"malachite-crust":{age:1,tin:.14,lead:.03,polish:.4,tarnish:.6,cuprite:.9,tinOxide:0,tinOxideTone:1,malachite:.95,malachiteHue:.42,malachiteTone:.12,malachiteScale:1.6,crust:.9,islands:.8,azurite:.05,chloride:.03,soot:0,crevice:.6,patchScale:60,mottleScale:10,earth:.08,earthColor:"#6e5b42",calcite:0,burialSide:.2,recessDirt:.45,wax:.2,inlay:0,wear:.3,dulling:.3,tops:.3,matte:.4},"olive-museum":{age:1,tin:.14,lead:.05,polish:.5,tarnish:.8,cuprite:.45,tinOxide:.88,tinOxideTone:1.25,malachite:.35,malachiteHue:.4,malachiteTone:.55,malachiteScale:1.5,crust:.2,islands:.4,azurite:.02,chloride:.02,soot:0,crevice:.95,patchScale:80,mottleScale:9,patchiness:.5,earth:.1,earthColor:"#6b5a42",calcite:.12,burialSide:.1,recessDirt:.55,wax:.25,inlay:0,wear:.25,dulling:.25,tops:.2,streaks:.15,matte:.45,nobleWarmth:.3},"water-black":{age:1,tin:.16,lead:.02,polish:.5,tarnish:.9,cuprite:.7,tinOxide:.8,tinOxideTone:0,malachite:.08,malachiteHue:.35,malachiteScale:1.5,crust:.1,islands:.5,azurite:0,chloride:.03,soot:0,crevice:.6,patchScale:110,mottleScale:16,earth:.05,earthColor:"#5a4a38",calcite:.12,streaks:.4,burialSide:.2,recessDirt:.4,wax:.15,inlay:0,wear:.15,dulling:.15,matte:.3},"bronze-disease":{age:1,tin:.13,lead:.05,polish:.4,tarnish:.7,cuprite:.8,tinOxide:.55,tinOxideTone:1.2,malachite:.45,malachiteHue:.45,malachiteScale:2,crust:.6,azurite:.03,chloride:.7,soot:0,crevice:.8,patchScale:70,mottleScale:10,patchiness:.7,earth:.15,earthColor:"#7a6548",calcite:.1,burialSide:.3,recessDirt:.45,wax:0,inlay:0,wear:.15,dulling:.35,tops:.3,matte:.65,nobleWarmth:.3},heirloom:{age:1,tin:.13,lead:.04,polish:.7,tarnish:.75,cuprite:.5,tinOxide:.8,tinOxideTone:.25,malachite:.1,malachiteHue:.5,malachiteScale:1.5,crust:.15,azurite:0,chloride:0,soot:.05,crevice:.9,patchScale:80,mottleScale:12,earth:0,calcite:0,burialSide:0,recessDirt:.8,wax:.3,inlay:.2,wear:.75},"blue-green-excavated":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.7,cuprite:.9,tinOxide:.35,tinOxideTone:1.3,malachite:.82,carbonate:.52,azurite:.06,azuriteDepth:.35,azuriteScale:10,blueHabitat:.35,turquoiseTone:.12,malachiteHue:.3,malachiteTone:.75,islands:.45,malachiteScale:2.2,crust:.9,chloride:.1,soot:0,crevice:.75,patchScale:65,mottleScale:10,patchiness:.6,earth:.3,earthColor:"#8a7354",calcite:.35,streaks:.3,burialSide:.3,recessDirt:.15,interiorTone:.4,wax:0,inlay:0,wear:.15,dulling:.25,tops:.5,matte:.65,nobleWarmth:.3},"azurite-bloom":{age:1,tin:.13,lead:.04,polish:.4,tarnish:.6,cuprite:.9,tinOxide:.3,tinOxideTone:1,malachite:.8,carbonate:.65,azurite:.28,azuriteDepth:.8,azuriteScale:18,blueHabitat:.8,turquoiseTone:.5,malachiteHue:.42,malachiteTone:.45,islands:.85,malachiteScale:2.2,crust:1.2,chloride:.08,soot:0,crevice:.7,patchScale:70,mottleScale:12,earth:.25,earthColor:"#8a7354",calcite:.2,streaks:.2,burialSide:.3,recessDirt:.25,interiorTone:.3,wax:0,inlay:0,wear:.15,dulling:.1,tops:.35,matte:.55,nobleWarmth:.3},houmuwu:{age:1,tin:.12,lead:.04,polish:.3,tarnish:.6,cuprite:1,cupriteTone:.25,tinOxide:.7,tinOxideTone:1.45,malachite:0,carbonate:.4,azurite:0,azuriteScale:8,blueHabitat:.3,turquoiseTone:.2,malachiteHue:.3,malachiteTone:.5,islands:0,malachiteScale:1,crust:.2,chloride:0,soot:0,crevice:.5,patchScale:110,mottleScale:30,patchiness:.3,softness:1,drift:.5,lowerBody:.9,lowerHeight:.38,lowerColor:"#bcc4b0",rimCalm:.8,earth:0,earthColor:"#857256",calcite:0,streaks:.15,burialSide:.2,recessDirt:.6,interiorTone:.35,wax:0,inlay:.7,wear:.1,dulling:.1,tops:.15,matte:1,topsTone:0,ledgeMatte:.5,nobleRelief:-1,speckle:.42,speckleScale:1.6,speckleColor:"#c07078",speckleDecor:.5,crustIsles:.2,crustScale:14,crustColor:"#b8a8a4",crustPlace:.65,plainTone:1,tint:"#bfeee4",grain:1},"met-fangyi":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.8,cuprite:.8,cupriteTone:.3,tinOxide:.95,tinOxideTone:1,malachite:0,carbonate:.05,azurite:0,malachiteHue:.7,malachiteTone:.4,islands:.3,malachiteScale:1,crust:.1,chloride:0,soot:0,crevice:.9,patchScale:80,mottleScale:14,patchiness:.6,softness:.8,drift:.25,earth:.05,earthColor:"#6a4a2c",calcite:0,streaks:.1,burialSide:.05,recessDirt:.9,interiorTone:.6,wax:.1,inlay:0,wear:.1,dulling:.05,tops:.25,nobleWarmth:.35,matte:1,topsTone:.05,ledgeMatte:1,lowerBody:.35,lowerHeight:.1,lowerColor:"#d89a78",upperTone:.9,upperHeight:.66,speckle:.13,speckleScale:1.2,speckleColor:"#3c4630",pustules:.06,pustuleScale:3,pustuleColor:"#3e5a36",tint:"#dfe8cc",grain:.8,crustIsles:0,crustScale:6,crustColor:"#5a3426",crustPlace:0,nobleRelief:.2},"met-zun":{age:1,tin:.14,lead:.05,polish:.45,tarnish:.2,cuprite:.45,cupriteTone:0,tinOxide:.65,tinOxideTone:.7,malachite:.2,carbonate:.2,azurite:.02,azuriteDepth:.4,azuriteScale:10,blueHabitat:.5,turquoiseTone:.5,malachiteHue:.35,malachiteTone:.35,islands:.35,malachiteScale:1.5,crust:.15,chloride:0,soot:0,crevice:.6,patchScale:40,mottleScale:22,patchiness:.6,softness:.75,drift:.4,earth:.05,earthColor:"#9a978c",calcite:.05,streaks:.1,burialSide:.1,recessDirt:.6,interiorTone:.5,wax:0,inlay:1,inlayGround:.65,wear:.2,dulling:.8,tops:.85,nobleWarmth:0,matte:1,topsTone:1,ledgeMatte:1,tint:"#d4e6f2",speckle:0,speckleScale:1.5,speckleColor:"#3d5a48",crustIsles:.15,crustScale:14,crustColor:"#a2a69e",crustPlace:.8,pustules:.15,pustuleScale:5,pustuleColor:"#2a6e50",lowerBody:1,lowerHeight:.1,lowerColor:"#cccccc",plainTone:1.12,grain:.5},"met-fangding":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.25,cuprite:.85,cupriteTone:.2,tinOxide:.7,tinOxideTone:1.1,malachite:.42,carbonate:.1,azurite:0,azuriteScale:10,blueHabitat:.5,turquoiseTone:.4,malachiteHue:.3,malachiteTone:.3,islands:.6,malachiteScale:1.4,crust:.2,chloride:0,soot:0,crevice:.6,patchScale:45,mottleScale:16,patchiness:.8,softness:.7,drift:.3,earth:.08,earthColor:"#7a5a40",calcite:.04,streaks:.1,burialSide:.1,recessDirt:.6,interiorTone:.45,wax:0,inlay:1,inlayGround:.7,wear:.15,dulling:.55,tops:.8,nobleWarmth:.1,matte:1,topsTone:1,ledgeMatte:1,tint:"#bed2be",speckle:.06,speckleScale:1.4,speckleColor:"#7a4a38",crustIsles:.14,crustScale:4,crustColor:"#2f8a5a",crustPlace:.7,pustules:.06,pustuleScale:3,pustuleColor:"#1f8a52",lowerBody:.6,lowerHeight:.35,lowerColor:"#c8bca8",plainTone:.9,grain:.6},"met-gu":{age:1,tin:.14,lead:.05,polish:.4,tarnish:.4,cuprite:.4,cupriteTone:.3,tinOxide:.9,tinOxideTone:1.8,malachite:.02,carbonate:.05,azurite:0,malachiteHue:.45,malachiteTone:.3,islands:.5,malachiteScale:1.2,crust:.2,chloride:0,soot:.3,crevice:.9,patchScale:45,mottleScale:14,patchiness:1,softness:1,drift:.2,earth:.1,earthColor:"#6b5a42",calcite:.05,streaks:.45,burialSide:.05,recessDirt:.9,interiorTone:.6,wax:0,inlay:.85,inlayGround:.15,wear:.2,dulling:.25,tops:1,nobleWarmth:.1,matte:1,topsTone:1,ledgeMatte:1,lowerBody:.7,lowerHeight:.1,lowerColor:"#7a7468",upperTone:.5,upperHeight:.55,tint:"#c4d0b8",speckle:.14,speckleScale:1.5,speckleColor:"#7d4a3e",crustIsles:.18,crustScale:10,crustColor:"#8a8578",crustPlace:.9,pustules:.12,pustuleScale:4,pustuleColor:"#2e6f4a",grain:.5},"met-gui":{age:1,tin:.14,lead:.06,polish:.35,tarnish:.5,cuprite:.75,cupriteTone:.3,tinOxide:.85,tinOxideTone:1.15,malachite:.32,carbonate:.06,azurite:0,malachiteHue:.5,malachiteTone:.6,islands:.1,malachiteScale:2.5,crust:.1,chloride:0,soot:0,crevice:.9,patchScale:30,mottleScale:15,patchiness:.85,softness:.95,drift:.3,earth:.15,earthColor:"#6a4428",calcite:0,streaks:.05,burialSide:.05,recessDirt:1,interiorTone:.55,wax:.05,inlay:0,wear:.15,dulling:.15,tops:.55,nobleWarmth:.25,matte:1,topsTone:.35,ledgeMatte:1,lowerBody:.25,lowerHeight:.18,lowerColor:"#b9a88e",speckle:0,speckleScale:1.3,speckleColor:"#6a3a30",crustIsles:0,crustScale:8,crustColor:"#7fa060",crustPlace:.6,pustules:0,pustuleScale:3,pustuleColor:"#3f7a40",tint:"#c2c6aa",grain:.7,nobleRelief:.35},"nezu-olive":{age:1,tin:.15,lead:.06,polish:.55,tarnish:.9,cuprite:.7,cupriteTone:.4,tinOxide:.88,tinOxideTone:.8,malachite:0,carbonate:.1,azurite:0,malachiteHue:.6,malachiteTone:.8,islands:.1,malachiteScale:1.5,crust:.1,chloride:0,soot:.25,crevice:1,patchScale:60,mottleScale:14,patchiness:.9,softness:.8,drift:.2,earth:0,earthColor:"#8a8270",calcite:0,streaks:.1,burialSide:.15,recessDirt:.8,interiorTone:.2,wax:0,inlay:0,inlayGround:.1,wear:.1,dulling:0,tops:.15,matte:1,nobleWarmth:.75,topsTone:.25,ledgeMatte:1,nobleRelief:1,tint:"#c8cac4",upperTone:.55,upperHeight:.62,speckle:.08,speckleScale:1.5,speckleColor:"#6e4535",crustIsles:.25,crustScale:6,crustColor:"#686656",crustPlace:1,plainTone:.2,lowerHeight:.15,grain:.8},"nezu-blue":{age:1,tin:.15,lead:.05,polish:.45,tarnish:.85,cuprite:.6,cupriteTone:.3,tinOxide:.95,tinOxideTone:.6,malachite:.3,carbonate:.6,azurite:.12,azuriteDepth:.6,azuriteScale:8,blueHabitat:.05,turquoiseTone:.6,malachiteHue:.12,malachiteTone:.55,islands:.25,malachiteScale:1.2,crust:.2,chloride:.03,soot:0,crevice:.9,patchScale:55,mottleScale:10,patchiness:.8,softness:.7,earth:.05,earthColor:"#5f6460",calcite:0,streaks:.15,burialSide:.2,recessDirt:.3,interiorTone:.2,wax:.05,inlay:0,wear:.1,dulling:.35,tops:.8,nobleWarmth:.8,matte:.5,topsTone:.6,ledgeMatte:1}},hd={Vessels:["houmuwu","met-fangyi","met-zun","met-gu","nezu-olive","met-fangding","met-gui"],Looks:["excavated-green","olive-museum","malachite-crust","water-black","bronze-disease","heirloom","as-cast"],Blue:["nezu-blue","blue-green-excavated","azurite-bloom"]},nu=n=>"u"+n[0].toUpperCase()+n.slice(1),ce={};for(const[n,t]of Object.entries(ii))ce[n]={value:t.type==="color"?new qt(t.default):t.default};ce.mode={value:0};ce.vesselInverse={value:new ae};ce.vesselMin={value:new q(-150,0,-150)};ce.vesselSize={value:new q(300,300,300)};function kr(n={}){for(const[t,e]of Object.entries(n))!ce[t]||!(t in ii)||(ce[t].value instanceof qt?ce[t].value.set(e):ce[t].value=e)}function ao(){const n={};for(const t of Object.keys(ii)){const e=ce[t].value;n[t]=e instanceof qt?"#"+e.getHexString():e}return n}const ud={beauty:0,clay:1,height:2,mask:3};function fd(n){ce.mode.value=ud[n]??0}function dd(n){if(n)if(n.isObject3D){n.updateMatrixWorld(!0),ce.vesselInverse.value.copy(n.matrixWorld).invert();const t=new An,e=ce.vesselInverse.value;if(n.traverse(i=>{if(!i.isMesh||!i.geometry)return;i.geometry.boundingBox||i.geometry.computeBoundingBox();const s=i.geometry.boundingBox.clone().applyMatrix4(new ae().multiplyMatrices(e,i.matrixWorld));t.union(s)}),t.isEmpty())return;ce.vesselMin.value.copy(t.min),t.getSize(ce.vesselSize.value)}else ce.vesselInverse.value.identity(),ce.vesselMin.value.fromArray(n.min),ce.vesselSize.value.fromArray(n.max).sub(ce.vesselMin.value)}class we extends mr{constructor({relief:t=null,cavityAttribute:e=!1,cavity:i=.8,interior:s=0,normalStrength:o=1,...a}={}){super({color:16777215,roughness:.5,metalness:1,envMapIntensity:1,...a}),this.isPatinaMaterial=!0,this.relief=t,this.cavityAttribute=e,this.defines=this.defines||{},t&&(this.normalMap=t.normalTexture,this.normalScale=new Lt(o,o),this.defines.PATINA_RELIEF=""),e&&(this.defines.PATINA_CAVITY_ATTR=""),this.local={uReliefData:{value:t?t.dataTexture:null},uReliefRange:{value:new Lt(t?t.min:0,t?t.max:1)},uConstCavity:{value:i},uInterior:{value:s}},this.onBeforeCompile=r=>Cy(r,this)}customProgramCacheKey(){return"patina2:"+(this.relief?"R":"")+(this.cavityAttribute?"C":"")}}function Cy(n,t){for(const i of Object.keys(ii))n.uniforms[nu(i)]=ce[i];n.uniforms.uPatinaMode=ce.mode,n.uniforms.uVesselInv=ce.vesselInverse,n.uniforms.uVesselMin=ce.vesselMin,n.uniforms.uVesselSize=ce.vesselSize,Object.assign(n.uniforms,t.local),n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
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
${Ly}
${Dy}`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
${Iy}`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
material.specularColor = mix(vec3(ttF0), diffuseColor.rgb, metalnessFactor);`)}const Dy=`
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
`,Iy=`
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
`,Va=Math.PI/180;function tc(n){var Mt,bt;const{from:t,to:e,out:i,height:s=10,thickness:o=4,notches:a={every:22,depth:.4,width:3},hook:r=0,ends:l={},embed:c,taper:h=3,bevel:u,waver:f=.5,seed:d=1,incise:_="auto",material:g,part:p="flanges"}=n,m=n.path||md(t,e,i),v=m.length,M=new Be(d),x=typeof s=="function"?s:()=>s,y=Md(xt=>x(xt),24),w=c??Math.max(.6,Math.min(o*.6,2)),b={start:Ur(l.start),end:Ur(l.end??(r>0?{type:"beak",length:r}:"square"))},D=n.outline?{...ky(n.outline,n.grooves),...n.grooveStyle?{groove:n.grooveStyle}:{}}:pd({length:v,height:x,notches:a,ends:b,embed:w,waver:f,rng:M.fork("outline")}),E=D.points;let T=1/0,L=-1/0,R=0;for(const[xt,yt]of E)T=Math.min(T,xt),L=Math.max(L,xt),R=Math.max(R,yt);const O=Fy(m,T-1,L+1,.5),A=Rl(M.fork("sway"),T,L,Math.max(12,v/4)),I=Rl(M.fork("thick"),T,L,Math.max(15,v/3)),C=.25*f*Math.min(1,o/4),k=(xt,yt)=>{const St=o/2*(1+.1*f*I(xt));return Math.max(St*.45,St-Math.tan(h*Va)*Math.max(0,yt))},N=Math.tan(h*Va),F=u??Math.min(.8,Math.max(.25,o*.12)),V=(xt,yt,St,ht)=>{const At=O(xt),kt=St+C*A(xt);return ht.set(At.p.x+At.n.x*yt+At.b.x*kt,At.p.y+At.n.y*yt+At.b.y*kt,At.p.z+At.n.z*yt+At.b.z*kt),ht},K=ec(E,F),Z=O((T+L)/2),U={p:Z.p.clone(),n:Z.n.clone(),d:Z.d.clone()},X=new q,z=K.map(([xt,yt])=>(V(xt,yt,0,X).sub(U.p),new Lt(X.dot(U.d),X.dot(U.n)))),Y=As.triangulateShape(z,[]),J=L-T,et=R+w,it=!g||g.isPatinaMaterial;let at=null,_t=g;(_==="auto"?it:_)&&D.grooves.length&&(at=Uy(D,{w:J,h:et,sMin:T,e:w,thickness:o,seed:d}),_t=new we({relief:at,cavity:((bt=(Mt=g==null?void 0:g.local)==null?void 0:Mt.uConstCavity)==null?void 0:bt.value)??.8})),_t||(_t=new we);const W=(xt,yt)=>[(xt-T)/J,(yt+w)/et],j=[],$=[],st=[],ot=[],wt=[],ut=new q,S=(xt,yt,St,ht,At,kt)=>(V(xt,yt,St,ut),j.push(ut.x,ut.y,ut.z),$.push(ht.x,ht.y,ht.z),st.push(At[0],At[1]),ot.push(kt.x,kt.y,kt.z,kt.w),j.length/3-1),P=(xt,yt)=>{const St=O(xt);return new q().copy(St.b).multiplyScalar(yt).addScaledVector(St.n,N).normalize()};for(const xt of[1,-1]){const yt=j.length/3;for(const[St,ht]of K){const At=O(St);S(St,ht,xt*k(St,ht),P(St,xt),W(St,ht),{x:At.d.x,y:At.d.y,z:At.d.z,w:xt})}for(const[St,ht,At]of Y){const kt=new q().fromArray(j,(yt+St)*3),Ct=new q().fromArray(j,(yt+ht)*3),Dt=new q().fromArray(j,(yt+At)*3),Rt=Ct.sub(kt).cross(Dt.sub(kt)),G=P(K[St][0],xt);Rt.dot(G)>=0?wt.push(yt+St,yt+ht,yt+At):wt.push(yt+St,yt+At,yt+ht)}}const Q=gd(E),ft=E.length;for(let xt=0;xt<ft;xt++){const yt=(xt+1)%ft,St=[xt,yt].map((Ct,Dt)=>{const Rt=Q[Dt===0?(Ct-1+ft)%ft:yt];let G=Q[xt];Rt[0]*G[0]+Rt[1]*G[1]>Math.cos(40*Va)&&(G=_d([Rt[0]+G[0],Rt[1]+G[1]]));const[Tt,Ut]=E[Ct],tt=O(Tt),nt=new q().copy(tt.d).multiplyScalar(G[0]).addScaledVector(tt.n,G[1]).normalize();return{q:Ct,s:Tt,t:Ut,side3:nt,F:{d:tt.d.clone()}}}),ht=(Ct,Dt)=>{const{q:Rt,s:G,t:Tt,side3:Ut,F:tt}=Ct,nt={x:tt.d.x,y:tt.d.y,z:tt.d.z,w:1},B=k(G,Tt),[lt,vt]=K[Rt];return Dt===0?S(lt,vt,B,new q().copy(Ut).add(P(G,1)).normalize(),W(lt,vt),nt):Dt===1?S(G,Tt,B-F,new q().copy(Ut).multiplyScalar(2).add(P(G,1)).normalize(),W(G,Tt),nt):Dt===2?S(G,Tt,-(B-F),new q().copy(Ut).multiplyScalar(2).add(P(G,-1)).normalize(),W(G,Tt),nt):S(lt,vt,-B,new q().copy(Ut).add(P(G,-1)).normalize(),W(lt,vt),nt)},At=[0,1,2,3].map(Ct=>ht(St[0],Ct)),kt=[0,1,2,3].map(Ct=>ht(St[1],Ct));for(let Ct=0;Ct<3;Ct++){const Dt=At[Ct],Rt=At[Ct+1],G=kt[Ct+1],Tt=kt[Ct],Ut=new q().fromArray(j,Dt*3),tt=new q().fromArray(j,Rt*3),B=new q().fromArray(j,Tt*3).clone().sub(Ut).cross(tt.clone().sub(Ut)),lt=new q().fromArray($,Dt*3);B.dot(lt)>=0?wt.push(Dt,Tt,G,Dt,G,Rt):wt.push(Dt,Rt,G,Dt,G,Tt)}}const rt=new Ze;rt.setAttribute("position",new xe(j,3)),rt.setAttribute("normal",new xe($,3)),rt.setAttribute("uv",new xe(st,2)),rt.setAttribute("tangent",new xe(ot,4)),rt.setIndex(wt),rt.computeBoundingBox(),rt.computeBoundingSphere();const dt=new ue(rt,_t);return dt.userData.part=p,dt.userData.flange={length:v,outline:E,relief:at,height:y},dt.castShadow=dt.receiveShadow=!0,dt}function Ur(n){return n?typeof n=="string"?{type:n}:{type:"square",...n}:{type:"square"}}function pd({length:n,height:t,notches:e,ends:i,embed:s,waver:o=.5,rng:a=new Be(1)}){const r=typeof t=="function"?t:()=>t,l=Md(r,16),c=Rl(a.fork("crest"),-n,2*n,Math.max(8,n/6)),h=V=>Math.max(.5,r(Math.min(1,Math.max(0,V/n)))*(1+.035*o*c(V))),u=Ur(i==null?void 0:i.start),f=Ur(i==null?void 0:i.end),d=V=>{let K=1;return u.type==="taper"&&(K=Math.min(K,.2+.8*su(V/(u.length??l*1.5)))),f.type==="taper"&&(K=Math.min(K,.2+.8*su((n-V)/(f.length??l*1.5)))),K},_=V=>h(V)*d(V),g=e===null||e===!1?{shape:"none"}:{shape:"square",...e};g.every!=null&&g.pitch==null&&(g.pitch=g.every);const p=g.shape||"square",m=g.pitch??(p==="score"?Math.max(3,l*.45):Math.max(6,l*1.5)),v=g.depth??(p==="score"?.28:p==="hook"?.5:.42),M=g.width??(p==="score"?Math.max(1,m*.38):Math.max(1.5,m*.3)),x=iu(f,n,_(n),l,1),y=x.length?x[x.length-1][0]:n,w=iu(u,0,_(0),l,-1).reverse(),b=w.length?w[0][0]:0,D=Math.max(0,b),E=Math.min(n,y),T=p==="none"?1:Math.max(1,Math.round((E-D)/m)),L=(E-D)/T,R=[];for(let V=1;V<T;V++)R.push(D+V*L+(a.next()-.5)*.12*L*o);const O=[];for(let V=0;V<T;V++)O.push([V===0?D:R[V-1]+M/2,V===T-1?E:R[V]-M/2]);const A=[],I=(V,K)=>{const Z=A[A.length-1];(!Z||Math.abs(Z[0]-V)>1e-4||Math.abs(Z[1]-K)>1e-4)&&A.push([V,K])},C=(V,K,Z)=>{const U=Math.max(1,Math.ceil(Math.abs(V-K)/1.2));for(let X=0;X<=U;X++){const z=V+(K-V)*X/U;I(z,Z(z))}};I(0,-s),I(n,-s);for(const V of x)I(V[0],V[1]);x.length||I(n,_(n));const k=[],N=V=>v*_(V);for(let V=T-1;V>=0;V--){const[K,Z]=O[V],U=V===T-1?Math.min(y,n):Z,X=V===0?Math.max(b,0):K;if(p==="hook"&&V<T-1){const z=Z-K,Y=Math.min(z*.45,l*.9),J=Math.min(z*.22,Y*.6),et=.24,it=.3;I(Z,_(Z)),C(Z,Z-Y,_),I(Z-Y,_(Z-Y)*(1-et)),I(Z-Y+J,_(Z-Y+J)*(1-et)),I(Z-Y+J,_(Z-Y+J)*(1-it)),C(Z-Y+J,X,at=>_(at)*(1-it))}else p==="hook"?C(U,X,z=>_(z)*(V===T-1?1:.7)):C(U,X,_);if(V>0){const z=R[V-1],Y=z+M/2,J=z-M/2;I(Y,_(Y)-N(Y)),I(J,_(J)-N(J)),I(J,_(J))}}for(const V of w)I(V[0],V[1]);I(w.length?w[w.length-1][0]:0,-s),A.length>2&&Math.hypot(A[0][0]-A[A.length-1][0],A[0][1]-A[A.length-1][1])<1e-4&&A.pop();const F=Math.min(1.5,l*.18);if(p==="score"){const V=g.rungs==="full";if(!V){const K=[],Z=Math.max(0,b),U=Math.min(n,y),X=Math.max(2,Math.ceil((U-Z)/1.5));for(let z=0;z<=X;z++){const Y=Z+(U-Z)*z/X;K.push([Y,_(Y)-N(Y)-F*.8])}k.push(K)}for(const K of R)k.push([[K,_(K)-N(K)],[K,V?Math.min(.4,_(K)*.1):_(K)-N(K)-F*.8]])}else if(p!=="none"){const V=ec(A,F);let K=[];for(let U=0;U<V.length;U++){const[X,z]=V[U];z>Math.max(F,.3*l)&&X>b+F*.5&&X<y-F*.5?K.push([X,z]):K.length&&(K.length>1&&k.push(K),K=[])}K.length>1&&k.push(K);const Z=g.pattern||(p==="T"||p==="square"?["T"]:p==="L"?["L","J"]:[]);O.forEach(([U,X],z)=>{const Y=Z.length?Z[z%Z.length]:null;if(!Y||X-U<F*4)return;const J=Y==="T"?(U+X)/2:Y==="L"?U+F*1.6:X-F*1.6,et=_(J)-F*1.1,it=Math.max(.2*l,et-.55*_(J));et-it>F&&k.push([[J,et],[J,it]])})}return{points:A,grooves:k,segments:O,cuts:R,width:M,depth:v,pitch:m,shape:p,groove:g.groove}}function ky(n,t){const e=n.map(([r,l])=>[r,l]);if(t)return{points:e,grooves:t,segments:[]};let i=0;for(const[,r]of e)i=Math.max(i,r);const s=Math.min(1.5,i*.18),o=[];let a=[];for(const[r,l]of ec(e,s))l>Math.max(s,.3*i)?a.push([r,l]):a.length&&(a.length>1&&o.push(a),a=[]);return a.length>1&&o.push(a),{points:e,grooves:o,segments:[]}}function iu(n,t,e,i,s){const o=n.length??i*.8;switch(n.type){case"beak":return[[t+s*o*.15,e*.55],[t+s*o,e]];case"hook":{const a=n.height??e*1.15;return[[t,e*.35],[t+s*o*.55,a*.55],[t+s*o,a*.85],[t+s*o*.85,a],[t+s*o*.2,a*.98]]}case"step":{const a=n.under??Math.max(.5,e*.12),r=Math.min(o*.3,e*.15);return[[t,a],[t+s*(o-r),a],[t+s*o,a+r],[t+s*o,e-r],[t+s*(o-r),e]]}case"spur":{const a=n.height??e*2,r=n.length??i*.7,l=n.sweep??Math.max(r*2.2,(a-e)*1.4),c=u=>t-s*u,h=[];for(let u=1;u<=6;u++){const f=u/6;h.push([c(r*Math.pow(f,1.6)),a*.94*f])}h.push([c(r+.5),a]);for(let u=1;u<=8;u++){const f=u/8;h.push([c(r+.5+l*f),e+(a-e)*(1-f)*(1-f)])}return h}default:return[]}}function Uy(n,{w:t,h:e,sMin:i,e:s,thickness:o,seed:a}){var u,f;const r=Math.min(8,1e3/t,500/e),l=new bo({width:t,height:e,ppmm:r,seed:a}),c=Math.min(1.3,Math.max(.7,o/4)),h=((u=n.groove)==null?void 0:u.width)??.55*c;return l.sink(d=>{d.lineWidth=h,d.lineCap="round",d.lineJoin="round";for(const _ of n.grooves)d.beginPath(),_.forEach(([g,p],m)=>m?d.lineTo(g-i,p+s):d.moveTo(g-i,p+s)),d.stroke()},{depth:((f=n.groove)==null?void 0:f.depth)??.35*c,profile:"u"}),l.bake()}function md(n,t,e){const i=new q().subVectors(t,n),s=i.length();i.normalize();const o=e.clone().addScaledVector(i,-e.dot(i)).normalize(),a=new q().crossVectors(i,o);return{isPath:!0,planar:!0,kind:"straight",length:s,frame:r=>({p:n.clone().addScaledVector(i,r),n:o,d:i,b:a})}}function Ny(n,t,e){return md(n,t,e)}function Fy(n,t,e,i){const s=Math.max(2,Math.ceil((e-t)/i)),o=[];for(let r=0;r<=s;r++){const l=t+(e-t)*r/s,c=n.frame(l);o.push({p:c.p.clone(),n:c.n.clone(),d:c.d.clone(),b:(c.b||new q().crossVectors(c.d,c.n)).clone()})}const a={p:new q,n:new q,d:new q,b:new q};return r=>{const l=Math.min(s,Math.max(0,(r-t)/(e-t)*s)),c=Math.min(s-1,Math.floor(l)),h=l-c,u=o[c],f=o[c+1];return a.p.lerpVectors(u.p,f.p,h),a.n.lerpVectors(u.n,f.n,h).normalize(),a.d.lerpVectors(u.d,f.d,h).normalize(),a.b.lerpVectors(u.b,f.b,h).normalize(),a}}function gd(n){const t=n.length,e=[];for(let i=0;i<t;i++){const s=n[i],o=n[(i+1)%t];e.push(_d([o[1]-s[1],-(o[0]-s[0])]))}return e}function _d(n){const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]}function ec(n,t){const e=n.length,i=gd(n);return n.map((s,o)=>{const a=i[(o-1+e)%e],r=i[o];let l=a[0]+r[0],c=a[1]+r[1];const h=Math.hypot(l,c);h<1e-6?(l=r[0],c=r[1]):(l/=h,c/=h);const u=Math.max(.35,l*r[0]+c*r[1]),f=t/u;return[s[0]-l*f,s[1]-c*f]})}function su(n){return n=Math.min(1,Math.max(0,n)),n*n*(3-2*n)}function Md(n,t){let e=0;for(let i=0;i<=t;i++)e=Math.max(e,n(i/t));return e}function Rl(n,t,e,i){const s=Math.max(2,Math.ceil((e-t)/i)+2),o=[];for(let a=0;a<=s;a++)o.push(n.next()*2-1);return a=>{const r=Math.min(s-1e-6,Math.max(0,(a-t)/i)),l=Math.floor(r),c=r-l,h=c*c*(3-2*c);return o[l]*(1-h)+o[l+1]*h}}const Wa={C:"corner",c:"corner",corner:"corner",L:"lip",l:"lip",lip:"lip",S:"smooth",s:"smooth",smooth:"smooth"};function Oy(n){return Array.isArray(n)?{r:+n[0],y:+n[1],join:Wa[n[2]]||"smooth",name:n[3]??(typeof n[2]=="string"&&!Wa[n[2]]?n[2]:null)}:{r:+n.r,y:+n.y,join:Wa[n.join]||(n.corner?"corner":"smooth"),name:n.name??null}}function zy(n,t,e,i,s,o){const a=(u,f)=>Math.max(1e-6,Math.pow(Math.hypot(f[0]-u[0],f[1]-u[1]),.5)),l=0+a(n,t),c=l+a(t,e),h=c+a(e,i);for(let u=1;u<=s;u++){const f=l+(c-l)*u/s,d=[0,0];for(let _=0;_<2;_++){const g=(l-f)/(l-0)*n[_]+(f-0)/(l-0)*t[_],p=(c-f)/(c-l)*t[_]+(f-l)/(c-l)*e[_],m=(h-f)/(h-c)*e[_]+(f-c)/(h-c)*i[_],v=(c-f)/(c-0)*g+(f-0)/(c-0)*p,M=(h-f)/(h-l)*p+(f-l)/(h-l)*m;d[_]=(c-f)/(c-l)*v+(f-l)/(c-l)*M}o.push(d)}}function By(n,t,e){const i=Math.min(1,Math.max(0,(e-n)/(t-n)));return i*i*(3-2*i)}function Gy(n,t,e){const i=Math.abs(t)/e;return i>=1?0:n==="flat"?By(1,.6,i):n==="v"?1-i:n==="step"?1:Math.sqrt(1-i*i)}class Xs{constructor(t,{registers:e={},ridges:i=[],step:s=.15,mode:o="spline",smooth:a=0}={}){if(this.isProfile=!0,this.source=t.map(Oy),this.source.length<2)throw new Error("Profile: need at least two points");this.step=s,this.mode=o,this._build(o,a),this.labels={},this.source.forEach((r,l)=>{r.name&&(this.labels[r.name]=this._srcS[l])}),this.ridges=[],this.registers={};for(const r of i)this.addRidges(r);for(const[r,l]of Object.entries(e))this.setRegister(r,l)}_build(t,e){const i=this.source,s=[];let o=[0];for(let c=1;c<i.length;c++)o.push(c),i[c].join==="corner"&&c<i.length-1&&(s.push(o),o=[c]);s.push(o);const a=[],r=new Set,l=new Array(i.length).fill(0);for(const c of s){const h=c.map(u=>[i[u].r,i[u].y]);a.length?r.add(a.length-1):(a.push(h[0]),l[c[0]]=0);for(let u=0;u<h.length-1;u++){const f=h[u],d=h[u+1],_=Math.max(1,Math.ceil(Math.hypot(d[0]-f[0],d[1]-f[1])/this.step));if(t==="polyline"||h.length<3)for(let g=1;g<=_;g++)a.push([f[0]+(d[0]-f[0])*g/_,f[1]+(d[1]-f[1])*g/_]);else{const g=u>0?h[u-1]:[2*f[0]-d[0],2*f[1]-d[1]],p=u+2<h.length?h[u+2]:[2*d[0]-f[0],2*d[1]-f[1]];zy(g,f,d,p,_,a)}l[c[u+1]]=a.length-1}}t==="polyline"&&e>0&&ou(a,r,e,this.step),this._pts=a,this._corners=r,this._srcIdx=l,this._finish(),this._srcS=l.map(c=>this.S[c])}_finish(){const t=this._pts,e=t.length,i=new Float64Array(e);for(let l=1;l<e;l++)i[l]=i[l-1]+Math.hypot(t[l][0]-t[l-1][0],t[l][1]-t[l-1][1]);this.S=i,this.length=i[e-1];const s=[];for(let l=0;l<e-1;l++){const c=t[l+1][0]-t[l][0],h=t[l+1][1]-t[l][1],u=Math.hypot(c,h)||1;s.push([c/u,h/u])}this._T=s,this.cornerS=[...this._corners].sort((l,c)=>l-c).map(l=>i[l]);let o=1/0,a=-1/0,r=0;for(const l of t)o=Math.min(o,l[1]),a=Math.max(a,l[1]),r=Math.max(r,l[0]);this.bounds={yMin:o,yMax:a,rMax:r,height:a-o}}_seg(t){const e=this.S;if(t<=0)return 0;if(t>=this.length)return e.length-2;let i=0,s=e.length-1;for(;s-i>1;){const o=i+s>>1;e[o]<=t?i=o:s=o}return i}_vtan(t,e){const i=this._T;if(t<=0)return i[0];if(t>=i.length)return i[i.length-1];if(this._corners.has(t))return e<0?i[t-1]:i[t];const s=i[t-1],o=i[t],a=s[0]+o[0],r=s[1]+o[1],l=Math.hypot(a,r)||1;return[a/l,r/l]}at(t,e=0){t=Math.min(Math.max(t,0),this.length);const i=this._seg(t),s=this.S,o=this._pts[i],a=this._pts[i+1],r=s[i+1]>s[i]?(t-s[i])/(s[i+1]-s[i]):0,l=e||(t>=this.length?-1:1);let c,h;r<=1e-9&&this._corners.has(i)?c=h=this._vtan(i,l):r>=1-1e-9&&this._corners.has(i+1)?c=h=this._vtan(i+1,l):(c=this._vtan(i,1),h=this._vtan(i+1,-1));let u=c[0]+(h[0]-c[0])*r,f=c[1]+(h[1]-c[1])*r;const d=Math.hypot(u,f)||1;return u/=d,f/=d,{s:t,r:o[0]+(a[0]-o[0])*r,y:o[1]+(a[1]-o[1])*r,nr:f,ny:-u,tr:u,ty:f}}atT(t,e){return this.at(t*this.length,e)}sAtY(t,{from:e="bottom"}={}){const i=this._pts,s=i.length,o=e==="top"?[...Array(s-1).keys()].reverse():[...Array(s-1).keys()];for(const a of o){const r=i[a][1],l=i[a+1][1];if((r-t)*(l-t)<=0&&r!==l){const c=(t-r)/(l-r);return this.S[a]+c*(this.S[a+1]-this.S[a])}}return t<=this.bounds.yMin?0:this.length}rAtY(t,e){return this.at(this.sAtY(t,e)).r}resolveS(t,e){if(t==null)return null;if(typeof t=="string"){if(!(t in this.labels))throw new Error(`Profile: no point labelled '${t}'`);return this.labels[t]}return typeof t=="object"&&"s"in t?t.s:this.sAtY(+t,{from:e})}setRegister(t,e){let i,s;Array.isArray(e)?(i=this.resolveS(e[0]),s=this.resolveS(e[1],"top")):"s0"in e?(i=e.s0,s=e.s1):"y0"in e?(i=this.sAtY(e.y0),s=this.sAtY(e.y1,{from:"top"})):(i=this.resolveS(e.from),s=this.resolveS(e.to,"top")),s<i&&([i,s]=[s,i]);const o={name:t,s0:i,s1:s,length:s-i,y0:this.at(i).y,y1:this.at(s).y};return this.registers[t]=o,o}register(t){const e=this.registers[t];if(!e)throw new Error(`Profile: no register '${t}'`);return e}addRidges({y:t,s:e,count:i=1,width:s=1.6,height:o=1,spacing:a,shape:r="round"}){const l=e??this.sAtY(t),c=a??s*2.1,h=s/2,u=[];for(let x=0;x<i;x++)u.push(l+(x-(i-1)/2)*c);const f=u[0]-h-.5,d=u[u.length-1]+h+.5;this._refine(f,d,Math.min(this.step,s/12));const _=this._pts,g=_.map((x,y)=>{const w=this.S[y];let b=0;for(const D of u)b=Math.max(b,Gy(r,w-D,h)*o);return b}),p=_.map((x,y)=>{const w=this._vtan(y,1);return[w[1],-w[0]]});for(let x=0;x<_.length;x++)g[x]&&(_[x]=[_[x][0]+p[x][0]*g[x],_[x][1]+p[x][1]*g[x]]);const m=this.S;this._finish();const v=this.S,M=x=>{let y=0,w=m.length-1;if(x<=0)return 0;if(x>=m[w])return v[w]+(x-m[w]);for(;w-y>1;){const D=y+w>>1;m[D]<=x?y=D:w=D}const b=m[w]>m[y]?(x-m[y])/(m[w]-m[y]):0;return v[y]+b*(v[w]-v[y])};for(const x of Object.keys(this.labels))this.labels[x]=M(this.labels[x]);this._srcS=this._srcS.map(M);for(const x of Object.values(this.registers))x.s0=M(x.s0),x.s1=M(x.s1),x.length=x.s1-x.s0;for(const x of this.ridges)x.s0=M(x.s0),x.s1=M(x.s1),x.centres=x.centres.map(M);return this.ridges.push({s0:M(f),s1:M(d),centres:u.map(M),width:s,height:o,shape:r,count:i}),this}_refine(t,e,i){const s=this._pts,o=this.S,a=[],r=new Set;for(let l=0;l<s.length;l++)if(this._corners.has(l)&&r.add(a.length),a.push(s[l]),l<s.length-1&&o[l+1]>t&&o[l]<e){const c=Math.ceil((o[l+1]-o[l])/i);for(let h=1;h<c;h++)a.push([s[l][0]+(s[l+1][0]-s[l][0])*h/c,s[l][1]+(s[l+1][1]-s[l][1])*h/c])}this._pts=a,this._corners=r,this._finish()}breaks(){const t=new Set(this.cornerS);for(const e of this.ridges)t.add(e.s0),t.add(e.s1);return[...t].filter(e=>e>1e-6&&e<this.length-1e-6).sort((e,i)=>e-i)}samples(t,e,{maxAngle:i=.06,maxLen:s=6,minRows:o=1}={}){const a=[t],r=this.S;let l=this._seg(t)+1,c=t,h=this.at(t,1);for(let u=0;u<1e6;u++){const f=l<r.length?Math.min(r[l],e):e;if(f-c>s){if(c+=s,e-c<s*.25)break;a.push(c),h=this.at(c,1);continue}if(f>=e-1e-6)break;const d=this._vtan(l,-1);Math.acos(Math.min(1,Math.max(-1,d[0]*h.tr+d[1]*h.ty)))>i&&r[l]-c>.02&&(a.push(r[l]),c=r[l],h=this.at(r[l],1)),l++}if(a.push(e),a.length-1<o){const u=[];for(let f=0;f<=o;f++)u.push(t+(e-t)*f/o);return u}return a}offset(t,{smooth:e=3}={}){const i=this._pts.map(r=>r.slice());e>0&&ou(i,new Set,e,this.step);const s=[],o=i.length;for(let r=0;r<o;r++){const l=i[Math.max(0,r-1)],c=i[Math.min(o-1,r+1)],h=c[0]-l[0],u=c[1]-l[1],f=Math.hypot(h,u)||1,d=typeof t=="function"?t(this.S[r],i[r][1]):t;s.push([Math.max(0,i[r][0]-u/f*d),i[r][1]+h/f*d,this.S[r]])}const a=[s[0]];for(let r=1;r<o;r++){const l=a[a.length-1],c=i[Math.max(0,r-1)],h=i[Math.min(o-1,r+1)];(s[r][0]-l[0])*(h[0]-c[0])+(s[r][1]-l[1])*(h[1]-c[1])>1e-9&&a.push(s[r])}return a}scaled(t){return new Xs(this.source.map(e=>({...e,r:e.r*t,y:e.y*t})),{step:this.step,mode:this.mode,ridges:this.ridges.map(e=>({s:e.centres.reduce((i,s)=>i+s,0)/e.centres.length*t,count:e.count,width:e.width*t,height:e.height*t,spacing:e.centres.length>1?(e.centres[1]-e.centres[0])*t:void 0,shape:e.shape})),registers:Object.fromEntries(Object.entries(this.registers).map(([e,i])=>[e,{s0:i.s0*t,s1:i.s1*t}]))})}get points(){return this._pts}}function ou(n,t,e,i){const s=[0,...[...t].sort((r,l)=>r-l),n.length-1],o=Math.max(1,Math.round(e*2.5/i)),a=[];for(let r=-o;r<=o;r++)a.push(Math.exp(-.5*(r*i/e)**2));for(let r=0;r<s.length-1;r++){const l=s[r],c=s[r+1],h=n.slice(l,c+1).map(u=>u.slice());for(let u=l+1;u<c;u++){let f=0,d=0,_=0;for(let g=-o;g<=o;g++){const p=u+g;if(p<l||p>c)continue;const m=a[g+o];f+=h[p-l][0]*m,d+=h[p-l][1]*m,_+=m}n[u]=[f/_,d/_]}}}function vd(n,t){return n!=null&&n.isProfile?n:new Xs(n,t)}function Hy(n,{scale:t=1,height:e,corners:i="auto",cornerAngle:s=32,window:o=2.5,smooth:a=.8,ground:r=!0,flipY:l=!1,...c}={}){let h=n.map(_=>[Math.abs(+_[0])*t,(l?-1:1)*+_[1]*t]);if(h[0][1]>h[h.length-1][1]&&h.reverse(),r){const _=Math.min(...h.map(g=>g[1]));h=h.map(g=>[g[0],g[1]-_])}if(e){const _=Math.max(...h.map(p=>p[1]))-Math.min(...h.map(p=>p[1])),g=e/_;h=h.map(p=>[p[0]*g,p[1]*g])}h=h.filter((_,g)=>g===0||Math.hypot(_[0]-h[g-1][0],_[1]-h[g-1][1])>1e-6);let u=new Set;if(Array.isArray(i))u=new Set(i);else if(i==="auto"){const _=[0];for(let p=1;p<h.length;p++)_.push(_[p-1]+Math.hypot(h[p][0]-h[p-1][0],h[p][1]-h[p-1][1]));const g=h.map((p,m)=>{if(m===0||m===h.length-1)return 0;const v=Vy(h,_,m,o),M=Wy(h,_,m,o);return Math.acos(Math.max(-1,Math.min(1,v[0]*M[0]+v[1]*M[1])))*(180/Math.PI)});for(let p=1;p<h.length-1;p++){if(g[p]<s)continue;let m=!0;for(let v=p-1;v>=0&&_[p]-_[v]<=o;v--)g[v]>g[p]&&(m=!1);for(let v=p+1;v<h.length&&_[v]-_[p]<=o;v++)g[v]>=g[p]&&(m=!1);m&&u.add(p)}}const f=h.map((_,g)=>[_[0],_[1],u.has(g)?"corner":"smooth"]),d=c.step??.15;return new Xs(f,{mode:"polyline",smooth:a,step:d,...c})}function Vy(n,t,e,i){let s=e-1;for(;s>0&&t[e]-t[s]<i;)s--;const o=n[e][0]-n[s][0],a=n[e][1]-n[s][1],r=Math.hypot(o,a)||1;return[o/r,a/r]}function Wy(n,t,e,i){let s=e+1;for(;s<n.length-1&&t[s]-t[e]<i;)s++;const o=n[s][0]-n[e][0],a=n[s][1]-n[e][1],r=Math.hypot(o,a)||1;return[o/r,a/r]}const Ee=Math.PI*2,yn=Math.PI/180;function nc(n){if(n!=null&&n.isProfileCurve)return n;const t=vd(n);return{isProfileCurve:!0,profile:t,length:t.length,points:t.points.map(e=>new q(e[0],e[1],0)),at(e,i){const s=t.at(Math.min(Math.max(e,0),1)*t.length,i);return{r:s.r,y:s.y,nr:s.nr,ny:s.ny}}}}function xd(n,{u0:t=0,u1:e=1,v0:i=0,v1:s=1}={}){const o=nc(n);return(a,r,l)=>{const c=(t+(e-t)*a-.5)*Ee,h=o.at(i+(s-i)*r),u=Math.sin(c),f=Math.cos(c);l.pos.set(h.r*u,h.y,h.r*f),l.nrm.set(h.nr*u,h.ny,h.nr*f)}}function jy({profile:n,material:t,part:e="body",segments:i={density:.5},thickness:s=0,rims:o=["v1"],relief:a=null,reliefRect:r,fade:l,maxVerts:c}){const h=nc(n),u=oe({surface:xd(h),segments:i,relief:a,reliefRect:r,fade:l??{u0:0,u1:0,v0:1.5,v1:1.5},back:s>0?{thickness:s,rims:o}:null,maxVerts:c}),f=new ue(u,t);return f.userData.part=e,f.castShadow=f.receiveShadow=!0,f}const qy=["wall","registers","sectors","floor","holes","tolerance","lip","foot","ridges"];function ic(n){return qy.some(t=>t in n)?Xy(n):jy(n)}function Xy({profile:n,sectors:t=4,registers:e={},wall:i=3,lip:s={},floor:o,foot:a={},holes:r=[],tolerance:l=null,oval:c=1,ridges:h=null,density:u=1,quality:f=1,chord:d=.05,fade:_=1.5,material:g,interiorMaterial:p,materialFor:m,part:v="body",name:M}){var Ut;const x=n!=null&&n.isProfile?n:new Xs(n);if(h)for(const tt of h)x.addRidges(tt);const y=x.length,w=x.bounds.yMax,b=typeof i=="function"?i:()=>i,D=u*Math.sqrt(f),E=[];for(const[tt,nt]of Object.entries(e)){const B=nt||{},vt=Array.isArray(B)||["y0","s0","from"].some(Et=>Et in B)?x.setRegister(tt,(Array.isArray(B),B)):x.register(tt);E.push({...vt,name:tt,spec:Array.isArray(B)?{}:B})}for(const[tt,nt]of Object.entries(x.registers))E.find(B=>B.name===tt)||E.push({...nt,name:tt,spec:{}});E.sort((tt,nt)=>tt.s0-nt.s0);const T=Ll(t),L=tt=>{var nt;return((nt=tt==null?void 0:tt.spec)==null?void 0:nt.sectors)!=null?Ll(tt.spec.sectors):T},R=Zy(l,w,c),O=r.map(tt=>Qy(tt,x,w)),A=[];for(const tt of[T,...E.map(L)])for(const[nt]of tt)A.push(nt);for(const tt of O)A.push(...tt.thetas);let I=0;for(const tt of E)if(tt.spec.relief)for(let nt=tt.s0;nt<=tt.s1;nt+=Math.max(1,tt.length/40))I=Math.max(I,x.at(nt).r);const C=x.bounds.rMax,k=d/Math.max(.25,f),N=Math.ceil(Ee/(2*Math.sqrt(2*k/Math.max(C,1)))),F=Math.ceil(Ee*I*D),V=Math.max(64,N,F),K=Ky(V,A),Z=K[0],U=K.concat(K.slice(1).map(tt=>tt+Ee)),X=(tt,nt)=>{let B=Z+Nr(tt-Z,Ee);B>Z+Ee-1e-9&&(B-=Ee);const lt=B+(nt-tt),vt=Pl(U,B),Et=Pl(U,lt),Pt=U.slice(vt,Et+1);return Pt[0]=B,Pt[Pt.length-1]=lt,Pt},z=new Set([0,y,...x.breaks()]);for(const tt of E)z.add(tt.s0),z.add(tt.s1);for(const tt of O)for(const nt of tt.ss)z.add(nt);const Y=[...z].filter(tt=>tt>=0&&tt<=y).sort((tt,nt)=>tt-nt),J=[];for(let tt=0;tt<Y.length-1;tt++)Y[tt+1]-Y[tt]>.02&&J.push([Y[tt],Y[tt+1]]);const et={isLatheInfo:!0,profile:x,height:w,length:y,columns:K.length-1,sectors:T.map(([tt,nt])=>[tt/yn,nt/yn]),registers:{},deform:R};for(const tt of E){const nt=L(tt),B=x.at(tt.s0,1),lt=x.at(tt.s1,-1),vt=x.at((tt.s0+tt.s1)/2);let Et=0;for(let Pt=tt.s0;Pt<=tt.s1;Pt+=Math.max(.5,tt.length/60))Et=Math.max(Et,x.at(Pt).r);et.registers[tt.name]={name:tt.name,s0:tt.s0,s1:tt.s1,y0:tt.y0,y1:tt.y1,height:tt.length,rBottom:B.r,rTop:lt.r,rMid:vt.r,rMax:Et,sectors:nt.map(([Pt,Ot],Bt)=>Jy(x,tt,Bt,nt.length,Pt,Ot))}}const it=g||new we,at=p||new we({interior:.45}),_t=p||new we({interior:1}),W=new Map,j=(tt,nt)=>{if(nt.spec.material)return nt.spec.material;if(W.has(tt))return W.get(tt);const B=m?m(tt,nt.name):new we({relief:tt});return W.set(tt,B),B},$=s.thickness??b(y,w)*1.6,st=s.length??Math.max(6,$*3),ot=(tt,nt)=>{const B=b(tt,nt);return B+($-B)*$y((tt-(y-st))/st)},ut=x.at(0).r;let S=o;S===void 0&&(S=ut>.5?{y:b(0,0)*1.4,thickness:b(0,0)*1.4}:null);const P=S?S.y:null,Q=S?S.thickness??b(0,0)*1.5:0,ft=a.wall??b(0,0),rt=S?(a.hollow??!0)&&P-Q>ft*1.5:!1;function dt(tt){const nt=x.at(tt).y;return(S&&rt&&nt<P-Q?ft:ot(tt,nt))+.15}et.wallAt=tt=>ot(tt,x.at(tt).y),et.floorY=P;const Mt=new Map,bt=[],xt=new Map,yt=tt=>E.find(nt=>tt>nt.s0+1e-6&&tt<nt.s1-1e-6)||null;for(const[tt,nt]of J){const B=yt((tt+nt)/2),lt=!!((Ut=B==null?void 0:B.spec)!=null&&Ut.relief),Et=x.samples(tt,nt,lt?{maxAngle:.05/Math.sqrt(f),maxLen:1/D}:{maxAngle:.06/Math.sqrt(f),maxLen:8/Math.sqrt(f)}).map(Ot=>(Ot-tt)/(nt-tt));Et[0]=0,Et[Et.length-1]=1,L(B).forEach(([Ot,Bt],Qt)=>{var Ys;const te=X(Ot,Bt),Wt=te.map(Ne=>(Ne-te[0])/(te[te.length-1]-te[0]));Wt[0]=0,Wt[Wt.length-1]=1;const ee=te[0],fe=te[te.length-1],Hn=(Ne,Ge,dn)=>{const pn=Ne<=0?ee:Ne>=1?fe:ee+Ne*(fe-ee),H=Ge<=0?tt:Ge>=1?nt:tt+Ge*(nt-tt),ct=x.at(H,Ge<=0?1:Ge>=1?-1:0),pt=Math.sin(pn),gt=Math.cos(pn);dn.pos.set(ct.r*pt,ct.y,ct.r*gt),R(dn.pos),dn.nrm.set(ct.nr*pt,ct.ny,ct.nr*gt)};let Ue=null;if(lt){const Ne=B.name+"#"+Qt;if(!xt.has(Ne)){const Ge=B.spec.relief,dn=et.registers[B.name].sectors[Qt];xt.set(Ne,typeof Ge=="function"?Ge(Qt,dn)||null:Array.isArray(Ge)?Ge[Qt]||null:Ge)}Ue=xt.get(Ne)}let Ln=null;if(Ue&&B.spec.map==="true"){const Ne=et.registers[B.name].sectors[Qt],Ge=B.spec.mapWidth??Math.max(Ne.widthBottom,Ne.widthTop,Ne.width),dn=(ee+fe)/2;Ln=(pn,H,ct)=>{const pt=ee+Math.min(1,Math.max(0,pn))*(fe-ee),gt=tt+Math.min(1,Math.max(0,H))*(nt-tt);ct[0]=.5+(pt-dn)*x.at(gt).r/Ge}}const ai=oe({surface:Hn,samples:{u:Wt,v:Et},relief:Ue,reliefRect:Ue?{u0:0,u1:1,v0:(B.s0-tt)/(nt-tt),v1:(B.s1-tt)/(nt-tt)}:void 0,fade:((Ys=B==null?void 0:B.spec)==null?void 0:Ys.fade)??_,normals:"surface",panelMap:Ln});if(O.length){const dn=eb(ai,O,pn=>ee+Wt[pn]*(fe-ee),pn=>tt+Et[pn]*(nt-tt),Wt.length-1,Et.length-1,pn=>dt(pn));dn&&bt.push(dn)}const li=Ue||"plain";Mt.has(li)||Mt.set(li,{geos:[],material:Ue?j(Ue,B):it,register:B==null?void 0:B.name}),Mt.get(li).geos.push(ai)})}const St=new vn;St.name=M||v,St.userData.part=v;const ht=(tt,nt,B)=>{const lt=new ue(tt,nt);return lt.userData.role=B,lt.castShadow=lt.receiveShadow=!0,St.add(lt),lt};for(const[tt,nt]of Mt){const B=nt.geos.length===1?nt.geos[0]:tu(nt.geos,!1);B.computeBoundingBox(),B.computeBoundingSphere(),ht(B,nt.material,tt==="plain"?"outer":"panel:"+nt.register)}const At=x.offset((tt,nt)=>ot(tt,nt),{smooth:Math.max(2,b(y/2,w/2))}),kt=x.at(y,-1),Ct=At[At.length-1],Dt=[];{const nt=s.shape==="flat"?.3:1,B=s.bulge??(s.shape==="flat"?.45:.6),lt=[kt.r,kt.y],vt=Math.hypot(lt[0]-Ct[0],lt[1]-Ct[1]),Et=[(lt[0]+Ct[0])/2,(lt[1]+Ct[1])/2],Pt=(lt[0]-Ct[0])/vt,Ot=(lt[1]-Ct[1])/vt;let Bt=kt.tr,Qt=kt.ty;const te=Bt*Pt+Qt*Ot;Bt-=Pt*te,Qt-=Ot*te;const Wt=Math.hypot(Bt,Qt)||1;Bt/=Wt,Qt/=Wt;for(let ee=0;ee<=14;ee++){const fe=Math.PI*ee/14,Hn=Math.cos(fe),Ue=Math.sin(fe),Ln=Math.sign(Hn)*Math.pow(Math.abs(Hn),nt)*(vt/2),ai=Math.sign(Ue)*Math.pow(Math.abs(Ue),nt)*(vt/2)*B;Dt.push([Et[0]+Pt*Ln+Bt*ai,Et[1]+Ot*Ln+Qt*ai])}Dt[0]=lt,Dt[14]=[Ct[0],Ct[1]]}ht(Ms(Dt,K,R,{split:50}),it,"lip");const Rt=[];for(let tt=At.length-1;tt>=0;tt--){const nt=At[tt];if(S&&nt[1]<=P){const B=At[tt+1]||nt,lt=B[1]!==nt[1]?(P-nt[1])/(B[1]-nt[1]):0;Rt.push([nt[0]+(B[0]-nt[0])*lt,P]);break}if(!S&&nt[0]<=.01){Rt.push([0,nt[1]]);break}Rt.push([nt[0],nt[1]])}let G=ru(Rt,.07,5);if(S){const nt=G[G.length-1][0],B=S.dome??Math.min(2.5,nt*.04),lt=Math.min(b(0,P)*1.2,nt*.3);for(G=G.slice(0,-1);G.length>1&&G[G.length-1][1]<P+lt;)G.pop();G.push([nt,P+lt]);for(let Et=1;Et<=4;Et++){const Pt=Et/4*(Math.PI/2);G.push([nt-lt+lt*Math.cos(Pt),P+lt-lt*Math.sin(Pt)])}const vt=10;for(let Et=1;Et<=vt;Et++){const Pt=(nt-lt)*(1-Et/vt);G.push([Pt,P+B*(1-(Pt/Math.max(.001,nt-lt))**2)])}}if(ht(Ms([[Ct[0],Ct[1]],...G.slice(1)],K,R,{split:40}),at,"inner"),ut>.01){const tt=[];if(rt){const nt=P-Q,B=x.offset(ft,{smooth:Math.max(1.5,ft)}),lt=[];for(const Ot of B){if(Ot[1]>=nt)break;lt.push([Ot[0],Math.max(0,Ot[1])])}const vt=lt.length?lt[lt.length-1][0]:ut-ft;tt.push([0,nt-Math.min(1.5,vt*.02)]);for(let Ot=1;Ot<=6;Ot++){const Bt=vt*Ot/6;tt.push([Bt,nt-Math.min(1.5,vt*.02)*(1-(Bt/vt)**2)])}const Et=ru(lt.slice().reverse(),.07,5);for(const Ot of Et)Ot[1]<nt-.05&&tt.push(Ot);const Pt=tt[tt.length-1];Pt[1]>.001&&tt.push([Pt[0],0]),tt.push([ut,0]),ht(Ms(tt.slice(0,-2).concat([tt[tt.length-2]]),K,R,{split:40}),_t,"foot-inner"),ht(Ms(tt.slice(-2),K,R,{split:40}),it,"foot-ring")}else ht(Ms([[0,0],[ut,0]],K,R,{split:40}),it,"base")}bt.length&&ht(bt.length===1?bt[0]:tu(bt,!1),_t,"holes");const Tt=new q;return et.frame=(tt,nt,B=0)=>{const lt=tt*yn,vt=Math.min(Math.max(nt,0),y),Et=x.at(vt,B),Pt=Math.sin(lt),Ot=Math.cos(lt),Bt=nt-vt,Qt=new q((Et.r+Et.tr*Bt)*Pt,Et.y+Et.ty*Bt,(Et.r+Et.tr*Bt)*Ot),te=R(Qt.clone()),Wt=new q(Et.nr*Pt,Et.ny,Et.nr*Ot),ee=new q(Et.tr*Pt,Et.ty,Et.tr*Ot),fe=R(Tt.copy(Qt).addScaledVector(ee,1)).sub(te).normalize(),Hn=new q(Ot,0,-Pt),Ue=new q().crossVectors(Hn,fe).normalize();return Ue.dot(Wt)<0&&Ue.negate(),{p:te,n:Ue,d:fe,b:new q().crossVectors(fe,Ue).normalize(),r:Et.r,y:Et.y}},et.sAtY=(tt,nt)=>x.sAtY(tt,nt),et.range=tt=>Cl(x,et,tt),et.meridian=(tt,nt)=>{const[B,lt]=Cl(x,et,nt);return{isPath:!0,planar:!0,kind:"meridian",theta:tt,s0:B,s1:lt,length:lt-B,frame:vt=>{const Et=lt-B,Pt=Math.min(Math.max(vt,0),Et),Ot=et.frame(tt,B+Pt,Pt<=0?1:Pt>=Et?-1:0);return vt!==Pt&&Ot.p.addScaledVector(Ot.d,vt-Pt),Ot}}},St.userData.lathe=et,St.userData.registers=et.registers,St}function Yy(n,{azimuths:t=[0,90,180,270],ranges:e,gap:i=1.5,seed:s=1,...o}={}){const a=n.userData.lathe,r=[];let l=0;for(const c of t)for(const h of e||[null]){const u=h&&typeof h=="object"&&"range"in h?h:{range:h},{range:f,gap:d=i,..._}=u,[g,p]=a.range(f),m=a.meridian(c,{s0:g+(_.gap0??d),s1:p-(_.gap1??d)});delete _.gap0,delete _.gap1;const v={...o,..._};r.push(tc({...v,path:m,seed:s*7919+l++*131+Math.round(c)}))}return r}function $y(n){return n=Math.min(1,Math.max(0,n)),n*n*(3-2*n)}function Nr(n,t){return(n%t+t)%t}function Pl(n,t){let e=0,i=n.length-1;for(;i-e>1;){const s=e+i>>1;n[s]<=t?e=s:i=s}return Math.abs(n[e]-t)<=Math.abs(n[i]-t)?e:i}function Ll(n){let t;if(typeof n=="number"||(n==null?void 0:n.count)!=null){const i=typeof n=="number"?n:n.count,s=((n==null?void 0:n.center)??0)*yn;t=[];for(let o=0;o<i;o++)t.push(s+(o-.5)*(Ee/i))}else if(n!=null&&n.bounds)t=n.bounds.map(i=>i*yn);else if(Array.isArray(n))t=n.map(i=>i*yn);else throw new Error("lathe: bad sectors spec");const e=[];for(let i=0;i<t.length;i++){const s=t[i];let o=i+1<t.length?t[i+1]:t[0]+Ee;for(;o<=s;)o+=Ee;e.push([s,o])}return e}function Ky(n,t){const e=[...new Set(t.map(a=>Nr(a,Ee)))].sort((a,r)=>a-r),i=e.length?e[0]:0,s=Ee/n,o=[];for(let a=0;a<=n;a++)o.push(i+a*s);for(const a of e){const r=i+Nr(a-i,Ee),l=Pl(o,r);Math.abs(o[l]-r)<s*.35&&l!==0&&l!==o.length-1?o[l]=r:Math.abs(o[l]-r)>1e-9&&o.splice(o[l]<r?l+1:l,0,r)}return o[o.length-1]=o[0]+Ee,o}function Zy(n,t,e=1){if(!n&&e===1)return d=>d;if(!n)return d=>(d.z/=e,d);const i={seed:1,ovality:0,rim:0,lean:0,...n},s=new Be(i.seed),o=s.range(0,Ee),a=s.range(0,Ee),r=s.range(0,Ee),l=s.range(0,Ee),c=s.range(.55,1),h=s.range(.35,.8),u=i.rim*t/2,f=Math.tan((i.lean||0)*yn);return d=>{const _=Math.atan2(d.x,d.z),g=1+i.ovality*Math.cos(2*(_-o));if(d.x*=g,d.z*=g,u){const p=Math.max(0,d.y/t)**2;d.y+=u*p*(c*Math.cos(_-a)+h*Math.cos(2*(_-r)))/(c+h)}return f&&(d.x+=d.y*f*Math.sin(l),d.z+=d.y*f*Math.cos(l)),e!==1&&(d.z/=e),d}}function Cl(n,t,e){if(e==null)return[0,n.length];if(typeof e=="string"){const i=t.registers[e]||n.registers[e];if(!i)throw new Error(`lathe: no register '${e}'`);return[i.s0,i.s1]}if(Array.isArray(e))return[n.sAtY(e[0]),n.sAtY(e[1],{from:"top"})];if("s0"in e)return[e.s0,e.s1];if("y0"in e)return[n.sAtY(e.y0),n.sAtY(e.y1,{from:"top"})];if("register"in e){const[i,s]=Cl(n,t,e.register);return[i+(e.inset0??e.inset??0),s-(e.inset1??e.inset??0)]}throw new Error("lathe: bad range")}function Jy(n,t,e,i,s,o){const a=o-s,r=u=>n.at(t.s0+Math.min(Math.max(u,0),t.length)),l=u=>r(u).r*a,c=l(t.length/2),h={register:t.name,sector:e,sectors:i,theta0:s/yn,theta1:o/yn,center:(s+o)/2/yn,width:c,height:t.length,widthBottom:l(0),widthTop:l(t.length),rBottom:r(0).r,rTop:r(t.length).r,rMid:r(t.length/2).r,widthAt:l,toPanel:(u,f=c)=>[f/2+u[0]*f/l(u[1]),u[1]],fromPanel:(u,f=c)=>[(u[0]-f/2)*l(u[1])/f,u[1]]};return h.map=(u,f=c)=>u.map(d=>h.toPanel(d,f)),h}function Qy(n,t,e){const i=n.s??t.sAtY(n.y),s=t.at(i).r,o=(n.azimuth??0)*yn,a=n.shape||"cross",r=n.arm??e*.02,l=n.width??Math.max(2,e*.008);let c,h;a==="cross"?(c=[r,l/2],h=[l/2,r]):(c=[(n.w??l)/2],h=[(n.h??r*2)/2]);const u=[],f=[];for(const _ of c)u.push(o-_/s,o+_/s);for(const _ of h)f.push(i-_,i+_);return{thetas:u,ss:f,inside:(_,g)=>{const p=tb(_,o)*s,m=g-i;for(let v=0;v<c.length;v++)if(Math.abs(p)<c[v]&&Math.abs(m)<h[v])return!0;return!1}}}function tb(n,t){return Nr(n-t+Math.PI,Ee)-Math.PI}function eb(n,t,e,i,s,o,a){const r=(v,M)=>t.some(x=>x.inside(v,M)),l=n.index.array,c=[],h=n.attributes.position.array,u=n.attributes.normal.array,f=s+1,d=[],_=[],g=1e-5;let p=!1;for(let v=0;v<o;v++)for(let M=0;M<s;M++){const x=(v*s+M)*6,y=(e(M)+e(M+1))/2,w=(i(v)+i(v+1))/2;if(!r(y,w)){for(let E=0;E<6;E++)c.push(l[x+E]);continue}p=!0;const b=nb(h,[v*f+M,v*f+M+1,(v+1)*f+M,(v+1)*f+M+1]),D=[[v*f+M,v*f+M+1,y,i(v)-g],[v*f+M+1,(v+1)*f+M+1,e(M+1)+g,w],[(v+1)*f+M+1,(v+1)*f+M,y,i(v+1)+g],[(v+1)*f+M,v*f+M,e(M)-g,w]];for(const[E,T,L,R]of D){if(r(L,R))continue;const O=a(w),A=[h[E*3],h[E*3+1],h[E*3+2]],I=[h[T*3],h[T*3+1],h[T*3+2]],C=[A[0]-u[E*3]*O,A[1]-u[E*3+1]*O,A[2]-u[E*3+2]*O],k=[I[0]-u[T*3]*O,I[1]-u[T*3+1]*O,I[2]-u[T*3+2]*O],N=ja(I,A),F=ja(C,A);let V=sb(N,F);const K=[(A[0]+I[0])/2,(A[1]+I[1])/2,(A[2]+I[2])/2],Z=ja(b,K);let U=[A,I,k,C];ib(V,Z)<0&&(U=[I,A,C,k],V=V.map(z=>-z));const X=Math.hypot(...V)||1;for(const z of[0,1,2,0,2,3])d.push(...U[z]),_.push(V[0]/X,V[1]/X,V[2]/X)}}if(!p)return null;n.setIndex(c);const m=new Ze;return m.setAttribute("position",new xe(d,3)),m.setAttribute("normal",new xe(_,3)),m.setAttribute("uv",new xe(new Float32Array(d.length/3*2).fill(-1),2)),m.setIndex([...Array(d.length/3).keys()]),m}function nb(n,t){const e=[0,0,0];for(const i of t)e[0]+=n[i*3],e[1]+=n[i*3+1],e[2]+=n[i*3+2];return e.map(i=>i/t.length)}const ja=(n,t)=>[n[0]-t[0],n[1]-t[1],n[2]-t[2]],ib=(n,t)=>n[0]*t[0]+n[1]*t[1]+n[2]*t[2],sb=(n,t)=>[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]];function ru(n,t,e){if(n.length<3)return n.slice();const i=[n[0]];let s=n[0],o=null;for(let a=1;a<n.length-1;a++){const r=n[a],l=r[0]-s[0],c=r[1]-s[1],h=Math.hypot(l,c);if(h<1e-6)continue;const u=[l/h,c/h];if(o||(o=u),Math.acos(Math.max(-1,Math.min(1,u[0]*o[0]+u[1]*o[1])))>t||h>e){const d=n[a-1]!==s?n[a-1]:r;i.push(d),s=d,o=null}}return i.push(n[n.length-1]),i}function Ms(n,t,e=s=>s,{split:i=40}={}){const s=n.length,o=[];for(let v=0;v<s-1;v++){const M=n[v+1][0]-n[v][0],x=n[v+1][1]-n[v][1],y=Math.hypot(M,x)||1;o.push([M/y,x/y,y])}const a=[];let r=0;const l=Math.cos(i*yn);for(let v=0;v<s;v++){v>0&&(r+=o[v-1][2]);const M=o[v-1],x=o[v],y=w=>[w[1],-w[0]];if(M&&x&&M[0]*x[0]+M[1]*x[1]<l)a.push({r:n[v][0],y:n[v][1],n:y(M),s:r}),a.push({r:n[v][0],y:n[v][1],n:y(x),s:r,gap:!0});else{const w=M&&x?[M[0]+x[0],M[1]+x[1]]:M||x,b=Math.hypot(w[0],w[1])||1;a.push({r:n[v][0],y:n[v][1],n:y([w[0]/b,w[1]/b]),s:r})}}const c=t.length,h=a.length*c,u=new Float32Array(h*3),f=new Float32Array(h*3),d=new Float32Array(h*2),_=new q,g=Math.max(r,1e-6);a.forEach((v,M)=>{for(let x=0;x<c;x++){const y=t[x],w=Math.sin(y),b=Math.cos(y);_.set(v.r*w,v.y,v.r*b),e(_);const D=(M*c+x)*3;u[D]=_.x,u[D+1]=_.y,u[D+2]=_.z,f[D]=v.n[0]*w,f[D+1]=v.n[1],f[D+2]=v.n[0]*b,d[(M*c+x)*2]=(y-t[0])/Ee,d[(M*c+x)*2+1]=v.s/g}});const p=[];for(let v=0;v<a.length-1;v++)if(!a[v+1].gap)for(let M=0;M<c-1;M++){const x=v*c+M,y=x+1,w=x+c+1,b=x+c;p.push(x,y,w,x,w,b)}const m=new Ze;return m.setAttribute("position",new Ae(u,3)),m.setAttribute("normal",new Ae(f,3)),m.setAttribute("uv",new Ae(d,2)),m.setIndex(h>65535?new jr(p,1):new Wr(p,1)),m.computeBoundingBox(),m.computeBoundingSphere(),m}const he=["front","right","back","left"],To=["front-right","right-back","back-left","left-front"],cn=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]],Fr=[[1,0,0],[0,0,-1],[-1,0,0],[0,0,1]],xn=-1e9,Nn=(n,t,e)=>Math.min(e,Math.max(t,n)),se=(n,t,e)=>n+(t-n)*e,lo=n=>n*Math.PI/180;function Dl(n,t){if(t<=0)return n>0?1:0;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function yd({width:n,depth:t,height:e,taper:i=0,top:s=null,flare:o=0,at:a="bottom",bulge:r=0,bulgeAt:l=.5,cornerRadius:c=0,profile:h=null}){const u=e,f=typeof i=="number"?i:i.x??0,d=typeof i=="number"?i:i.z??0;let _,g,p,m;s?(_=n/2,g=t/2,p=s.width/2,m=s.depth/2):o?(_=n/2,g=t/2,p=_*(1+o),m=g*(1+o)):a==="top"?(p=n/2,m=t/2,_=p-u*Math.tan(lo(f)),g=m-u*Math.tan(lo(d))):(_=n/2,g=t/2,p=_+u*Math.tan(lo(f)),m=g+u*Math.tan(lo(d)));const v=l>0&&l<1?Math.log(.5)/Math.log(l):1,M=typeof r=="number"?r:r.x??0,x=typeof r=="number"?r:r.z??0,y={a:0,b:0,r:0},w=b=>{const D=Nn(b/u,0,1),E=Math.sin(Math.PI*Math.pow(D,v));let T=se(_,p,D)+M*E,L=se(g,m,D)+x*E;if(h){const R=h(D);T+=R.dx??R.d??0,L+=R.dz??R.d??0}return y.a=T,y.b=L,y.r=Math.min(c,T,L),y};return w.H=u,w.dims={a0:_,b0:g,a1:p,b1:m},w}function Il(n,t,e,i){const s=Math.min(n.a,n.b);t<-s&&(t=-s);const o=Math.max(0,n.a+t),a=Math.max(0,n.b+t);let r=n.r>0?Math.max(0,n.r+t):0;return t<0&&e>0&&(r=Math.max(r,e*Math.min(1,-t/Math.max(i,1e-6)))),r=Math.min(r,o,a),{A:o,B:a,R:r,d:t}}function ob(n){const t=(e,i)=>{let s=e*374761393+i*668265263+n*1442695041|0;return s=Math.imul(s^s>>>13,1274126177),((s^s>>>16)>>>0)/4294967296};return(e,i)=>{const s=Math.floor(e),o=Math.floor(i),a=e-s,r=i-o,l=a*a*(3-2*a),c=r*r*(3-2*r),h=t(s,o),u=t(s+1,o),f=t(s,o+1),d=t(s+1,o+1);return(h+(u-h)*l+(f-h)*c+(h-u-f+d)*l*c)*2-1}}function rb(n,t,e){if(!n)return null;const i=n===!0?{}:n,s=new Be(i.seed??7),o=t/300,a={sagK:[0,1,2,3].map(()=>(i.sag??.003)*s.range(.5,1.2)),rim:i.rim??.006*t,wave:i.wave??Math.min(.6,.15*Math.max(1,o)),waveLength:i.waveLength??40*Math.max(1,Math.sqrt(o)),skew:Math.tan(lo(i.skew??s.jitter(.6))),noise:ob(s.int(1,1e6))},r=s.range(0,Math.PI*2),l=s.range(-.6,.6);return a.level=[Math.cos(r)*.5*a.rim,Math.sin(r)*.5*a.rim,l*.5*a.rim],a.a=Math.max(e.a0,e.a1),a.b=Math.max(e.b0,e.b1),a}function bd({sec:n,H:t,cast:e,innerR:i,wall:s,yBase:o=0,span:a}){const r=new q;function l(u,f,d,_,g=r){const p=n(Nn(_,0,t)),{A:m,B:v,R:M}=Il(p,d,i,s),x=(u&1)===0,y=x?v:m,w=(x?m:v)-M,b=(2*f-1)*w,D=cn[u],E=Fr[u];if(g.set(D[0]*y+E[0]*b,_,D[2]*y+E[2]*b),e){const T=Math.min(p.a,p.b),L=Nn(1+Math.max(d,-T)/T,0,1.3),R=a[u],O=4*f*(1-f);let A=e.sagK[u]*R*O;e.wave&&(A+=e.wave*Math.min(1,2*O)*e.noise(f*R/e.waveLength+u*17.3,_/e.waveLength)),g.x+=D[0]*A*L,g.z+=D[2]*A*L}return h(g,_)}function c(u,f,d,_,g=r){const p=n(Nn(_,0,t)),{A:m,B:v,R:M}=Il(p,d,i,s),x=(u&1)===0,y=x?v:m,w=(x?m:v)-M,b=cn[u],D=Fr[u],E=f*Math.PI*.5,T=b[0]*(y-M)+D[0]*w,L=b[2]*(y-M)+D[2]*w;return g.set(T+M*(b[0]*Math.cos(E)+D[0]*Math.sin(E)),_,L+M*(b[2]*Math.cos(E)+D[2]*Math.sin(E))),h(g,_)}function h(u,f){if(e){const d=Nn(f/t,0,1),_=u.x/e.a,g=u.z/e.b;u.y+=d*(e.level[0]*_+e.level[1]*g+e.level[2]*_*g),u.x+=e.skew*u.z}return u.y+=o,u}return{side:l,corner:c,field:h,sec:n,H:t}}function au(n){const t=n.filter((s,o)=>o===0||Math.hypot(s[0]-n[o-1][0],s[1]-n[o-1][1])>1e-6||s[0]===xn),e=[];let i=[[t[0][0],t[0][1]]];for(let s=1;s<t.length;s++){const o=t[s],a=o[2]??0,r=s===t.length-1;if(!r&&a>0&&o[0]!==xn&&t[s-1][0]!==xn&&t[s+1][0]!==xn){const l=t[s-1],c=t[s+1],h=qa([l[0]-o[0],l[1]-o[1]]),u=qa([c[0]-o[0],c[1]-o[1]]),f=Math.hypot(l[0]-o[0],l[1]-o[1]),d=Math.hypot(c[0]-o[0],c[1]-o[1]),_=Nn(h[0]*u[0]+h[1]*u[1],-1,1),g=Math.acos(_);if(g>.001&&g<Math.PI-.001){let p=a/Math.tan(g/2);const m=.49*Math.min(f,d),v=p>m?m*Math.tan(g/2):a;p=Math.min(p,m);const M=[o[0]+h[0]*p,o[1]+h[1]*p],x=[o[0]+u[0]*p,o[1]+u[1]*p],y=qa([h[0]+u[0],h[1]+u[1]]),w=v/Math.sin(g/2),b=[o[0]+y[0]*w,o[1]+y[1]*w];let D=Math.atan2(M[1]-b[1],M[0]-b[0]),T=Math.atan2(x[1]-b[1],x[0]-b[0])-D;for(;T>Math.PI;)T-=2*Math.PI;for(;T<-Math.PI;)T+=2*Math.PI;const L=Math.max(3,Math.ceil(Math.abs(T)/(Math.PI/10)));for(let R=0;R<=L;R++){const O=D+T*R/L;i.push([b[0]+v*Math.cos(O),b[1]+v*Math.sin(O)]),o[3]==="split"&&R===L>>1&&(e.push(i),i=[i[i.length-1]])}continue}}i.push([o[0],o[1]]),!r&&!(a>0)&&(e.push(i),i=[[o[0],o[1]]])}return i.length>1&&e.push(i),e}function qa(n){const t=Math.hypot(n[0],n[1])||1;return[n[0]/t,n[1]/t]}function lu(n,t){const e=[n[0]];for(let i=1;i<n.length;i++){const s=n[i-1],o=n[i];if(s[0]===xn||o[0]===xn){e.push(o);continue}const a=Math.max(1,Math.ceil(Math.hypot(o[0]-s[0],o[1]-s[1])/t));for(let r=1;r<=a;r++)e.push([se(s[0],o[0],r/a),se(s[1],o[1],r/a)])}return e}const io=new q,cu=new q,so=new q,hu=new q;function qe(n,t){return(i,s,o)=>{n(i,s,o.pos),n(Math.min(1,i+.001),s,io),n(Math.max(0,i-.001),s,cu),n(i,Math.min(1,s+.001),so),n(i,Math.max(0,s-.001),hu),io.sub(cu),so.sub(hu),o.nrm.crossVectors(io,so);const a=o.nrm.length();a>1e-9*Math.max(1,io.lengthSq(),so.lengthSq())&&io.lengthSq()>1e-12&&so.lengthSq()>1e-12?o.nrm.multiplyScalar(1/a):t?t(i,s,o.nrm):o.nrm.set(0,1,0)}}function Vi(n,t,e,i){const s=new ue(n,t);return s.name=i,s.userData.part=e,s.castShadow=s.receiveShadow=!0,s}function vr(n,t,{material:e,part:i,name:s,segLen:o=40,sides:a=!0,corners:r=!0,hasCorners:l,profileNormal:c=!0}){const h=[],u=t.length-1,f=_=>{const g=_*u,p=Math.min(u-1,Math.floor(g)),m=g-p,v=t[p],M=t[p+1];return[v[0]===xn||M[0]===xn?m<.5?v[0]:M[0]:se(v[0],M[0],m),se(v[1],M[1],m),p]},d=(_,g,p)=>(m,v,M)=>{const[,,x]=f(v),y=t[x],w=t[x+1];let b=w[0]-y[0];w[0]===xn&&(b=-1),y[0]===xn&&(b=1);const D=w[1]-y[1],E=Math.hypot(b,D)||1,T=D/E,L=-b/E;let R=cn[_][0],O=cn[_][2];if(g){const A=m*Math.PI*.5;R=cn[_][0]*Math.cos(A)+Fr[_][0]*Math.sin(A),O=cn[_][2]*Math.cos(A)+Fr[_][2]*Math.sin(A)}M.set(T*R,L,T*O).normalize()};for(let _=0;_<4;_++){if(a){const g=n.span[_],p=Math.max(2,Math.ceil(g/o)),m=oe({surface:qe((v,M,x)=>{const[y,w]=f(M);n.side(_,v,y,w,x)},d(_,!1)),segments:[p,u]});h.push(Vi(m,e,i,`${s}-${he[_]}`))}if(r&&l){const g=oe({surface:qe((p,m,v)=>{const[M,x]=f(m);n.corner(_,p,M,x,v)},d(_,!0)),segments:[6,u]});h.push(Vi(g,e,i,`${s}-${To[_]}`))}}return h}function uu(n,t){const e=n.map(h=>typeof h=="number"?{mm:h}:h.weight!=null?{weight:h.weight}:{mm:h.h??h.w??h.mm}),i=e.reduce((h,u)=>h+(u.mm??0),0),s=e.reduce((h,u)=>h+(u.weight??0),0);let o=1,a=t-i;s===0&&(o=t/(i||1));const r=e.map(h=>h.mm!=null?h.mm*(s===0?o:1):Math.max(0,a)*h.weight/s),l=[];let c=0;for(const h of r)l.push([c/t,(c+h)/t]),c+=h;return l.length&&(l[l.length-1][1]=1),l}function Zr(n,t){if(!n)return;const e=he[t];if(n[e]!==void 0)return n[e];const i=t%2===0?"long":"short";return n[i]!==void 0?n[i]:n.all}function wd(n){const t=yd(n),e=n.height,i=n.grid??n.grids??null,s={sides:{},section:t,H:e},o=(a,r)=>{const l=t(Nn(r,0,e));return(a&1?l.b:l.a)-l.r};for(let a=0;a<4;a++){let r=Zr(i,a);i&&(i.rows||i.cols)&&!r&&(r=i),r=r||{};const l=r.rows||[{weight:1}],c=r.cols||[{weight:1}],h=2*o(a,e/2),u=uu(l,e),f=uu(c,h),d=u.map(([p,m])=>({y0:e*(1-m),y1:e*(1-p)})),_=f.map(([p,m])=>({s0:p,s1:m})),g=d.map((p,m)=>_.map((v,M)=>{const x=[];for(let E=0;E<=8;E++)x.push(se(p.y0,p.y1,E/8));const y=x.map(E=>(v.s1-v.s0)*2*o(a,E)),w=Math.max(...y);let b=0;for(let E=1;E<x.length;E++){const T=o(a,x[E])-o(a,x[E-1]),L=a&1?t(x[E]).a-t(x[E-1]).a:t(x[E]).b-t(x[E-1]).b;b+=Math.hypot(x[E]-x[E-1],L,T*(v.s0+v.s1-1))}const D=[];x.forEach((E,T)=>D.push([(w-y[T])/2,b*T/8]));for(let E=x.length-1;E>=0;E--)D.push([(w+y[E])/2,b*E/8]);return{side:he[a],row:m,col:M,s0:v.s0,s1:v.s1,y0:p.y0,y1:p.y1,w:y[4],h:b,wBottom:y[0],wTop:y[8],wMax:w,outline:D}}));s.sides[he[a]]={rows:d,cols:_,cells:g}}return n.foot&&(s.foot=hb(n,t)),s}function ab(n){var K,Z;const{height:t,wall:e=8,cornerRadius:i=0,material:s=new we,density:o=1,plainDensity:a=.06,part:r="body",panels:l=null}=n,c=n.interiorMaterial||new we({interior:1}),h=n.innerRadius??e*.5,u=wd(n),f=u.section,d=n.foot?n.foot.height:0,_=rb(n.cast,t,f.dims),g=[0,1,2,3].map(U=>{const X=f(t/2);return 2*((U&1?X.b:X.a)-X.r)}),p=bd({sec:f,H:t,cast:_,innerR:h,wall:e,yBase:d,span:g});p.span=g;const m=i>0||h>0,v=new vn;v.name="fang-body",v.userData.part=r;const M=((K=n.floor)==null?void 0:K.thickness)??e,x=((Z=n.floor)==null?void 0:Z.round)??e*.8,y=n.rim===!1?{kind:"none"}:{kind:"plain",...n.rim},w=y.round??Math.max(.6,e*.12),b=y.inner??0,D=[[0,t,0]];let E=t,T=0;if(y.kind==="slab"){const U=y.height??e*2,X=y.overhang??e*.5;D.push([X,t,w*.6],[X,t+U,w],[-(e+b),t+U,w,"split"]),E=t+U,T=X,b>0&&D.push([-(e+b),t+U-Math.min(U*.5,b),e*.3],[-e,t+U-Math.min(U*.5,b)-b*1.2,e*.6])}else if(y.kind==="plain"){const U=y.height??0;U>0&&D.push([0,t+U,w]),D.push([-(e+b),t+U,w,"split"]),E=t+U,b>0&&D.push([-e,t+U-b*1.5,e*.5])}else D.push([-e,t,0]);D.push([-e,M,x],[xn,M,0]);const L=[[xn,0,0],[0,0,0]],R=1/a;for(const U of au(L))v.add(...vr(p,U,{material:s,part:r,name:"underside",segLen:R*1.5,hasCorners:m}));au(D).forEach((U,X)=>{const z=X>0;v.add(...vr(p,lu(U,R),{material:z?c:s,part:r,name:z?"inner":"rim",segLen:R,hasCorners:m}))}),i>0&&v.add(...vr(p,lu([[0,0],[0,t]],R),{material:s,part:r,name:"arris",sides:!1,hasCorners:!0}));const A=new Map,I=U=>U.material?U.material:(A.has(U.relief)||A.set(U.relief,new we({relief:U.relief})),A.get(U.relief));for(let U=0;U<4;U++){const X=u.sides[he[U]],z=l&&l[he[U]],Y=Zr(n.cells,U);X.cells.forEach((J,et)=>J.forEach((it,at)=>{var W;let _t=z&&X.cells.length===1&&J.length===1?z:(W=Y==null?void 0:Y[et])==null?void 0:W[at];_t===void 0&&n.relief&&(_t=n.relief(it)),_t&&_t.macro&&(_t={relief:_t}),_t&&!_t.relief&&(_t=_t.material?_t:null),it.mesh=lb(p,U,it,_t,{density:o,plainSeg:R,material:s,matFor:I,part:r,H:t}),v.add(it.mesh)}))}let C=null;n.foot&&(C=db(n,f,u.foot,{material:s,interiorMaterial:c,part:n.foot.part??"foot",density:o,plainSeg:R,cast:_,matFor:I}),v.add(C));const k=U=>U.clone(),N={};for(let U=0;U<4;U++){const X=u.sides[he[U]],z=[p.side(U,0,0,0).clone(),p.side(U,1,0,0).clone(),p.side(U,0,0,t).clone(),p.side(U,1,0,t).clone()],Y=new q().subVectors(z[1],z[0]).cross(new q().subVectors(z[2],z[0])).normalize();N[he[U]]={corners:z,normal:Y,axis:[k(p.side(U,.5,0,0)),k(p.side(U,.5,0,t))],registers:X.rows.map(J=>[J.y0+d,J.y1+d]),columns:X.cols.map(J=>[J.s0,J.s1]),cells:X.cells.map(J=>J.map(({mesh:et,...it})=>it))}}const F={};for(let U=0;U<4;U++){const X=it=>i>0?p.corner(U,.5,0,it).clone():p.side(U,1,0,it).clone(),z=X(0),Y=X(t),J=cn[U],et=cn[(U+1)%4];F[To[U]]={bottom:z,top:Y,out:new q(J[0]+et[0],0,J[2]+et[2]).normalize()}}const V=f(t);return v.userData.walls=N,v.userData.corners=F,v.userData.layout=u,v.userData.rim={kind:y.kind,y:E+d,wallTop:t+d,outer:{a:V.a+T,b:V.b+T},inner:{a:V.a-e-b,b:V.b-e-b}},v.userData.floorY=M+d,v.userData.footHeight=d,v.userData.at=(U,X,z,Y=0)=>p.side(typeof U=="number"?U:he.indexOf(U),X,Y,z).clone(),v.userData.rimTop=(U,X,z=.5)=>{const Y=typeof U=="number"?U:he.indexOf(U);return p.side(Y,X,se(T,-(e+b),z),E).clone()},v.userData.legSeat=(U,X)=>{const z=typeof U=="number"?U:To.indexOf(U),Y=f(0),J=cn[z],et=cn[(z+1)%4],it=(J[0]+et[0])*(Y.a-X),at=(J[2]+et[2])*(Y.b-X),_t=new q(it,0,at);return p.field(_t,0),_t},v}function lb(n,t,e,i,{density:s,plainSeg:o,material:a,matFor:r,part:l,H:c}){const{s0:h,s1:u,y0:f,y1:d}=e,g=qe((y,w,b)=>n.side(t,se(h,u,y),0,se(f,d,w),b)),p=`wall-${he[t]}-r${e.row}c${e.col}`;if(!i){const y=Math.max(2,Math.ceil(e.w/o)),w=Math.max(2,Math.ceil(e.h/o));return Vi(oe({surface:g,segments:[y,w]}),a,l,p)}let m=null;const v=i.fade??1.5;if(i.map==="true"){const y=(h+u)/2,w=e.wMax;m=(b,D,E)=>{const T=se(f,d,D),L=cb(n,t,T),R=se(h,u,b);E[0]=.5+(R-y)*2*L/w,E[2]=Dl(Math.min(R-h,u-R)*2*L,v)}}const M=oe({surface:g,segments:{density:i.density??s},relief:i.relief,reliefRect:i.reliefRect,fade:i.map==="true"?{u0:0,u1:0,v0:v,v1:v}:v,reliefScale:i.reliefScale??1,panelMap:m,maxVerts:i.maxVerts}),x=Vi(M,r(i),l,p);return x.userData.cell={side:he[t],row:e.row,col:e.col},x}function cb(n,t,e){const i=n.sec(Nn(e,0,n.H));return(t&1?i.b:i.a)-i.r}function hb(n,t){const e=n.foot,i=e.height,s=t(0),o=e.inset??0,a=e.flare??0,r={};for(let l=0;l<4;l++){const c=(l&1?s.b:s.a)-o+a,h=Math.max(0,Math.min(s.r-o+a,c)),u=c-h,f=Zr(e.notch&&(e.notch.width!=null||e.notch.height!=null)?{all:e.notch}:e.notch,l);let d=null;if(f){const _=f.width<=1?f.width*2*((l&1?s.b:s.a)-o-Math.max(0,s.r-o)):f.width,g=f.height<=1?f.height*i:f.height;d={w:_,h:g,shape:f.shape??"arch",spring:f.spring??.55,round:f.round??Math.min(_,g)*.12},d.outline=ub(d)}r[he[l]]={w:2*u,h:i,notch:d,panelOutline:d?d.outline.map(([_,g])=>[_+u,g]):null}}return{height:i,sides:r}}function kl(n,t){const e=n.w/2,i=Math.min(1,Math.abs(t)/e);if(n.shape==="rect"){const o=Math.min(n.round,e*.9,n.h*.9),a=Math.abs(t)-(e-o);return a<=0?n.h:n.h-o+Math.sqrt(Math.max(0,o*o-a*a))}const s=n.h*n.spring;return s+(n.h-s)*Math.sqrt(Math.max(0,1-i*i))}function ub(n,t=24){const e=n.w/2,i=[[-e,0]];for(let s=0;s<=t;s++){const o=-e+n.w*s/t;i.push([o,kl(n,o)])}return i.push([e,0]),i}function fb(n,t,e){let i=1/0;for(let s=1;s<n.length;s++){const o=n[s-1],a=n[s],r=a[0]-o[0],l=a[1]-o[1],c=r*r+l*l||1,h=Nn(((t-o[0])*r+(e-o[1])*l)/c,0,1);i=Math.min(i,Math.hypot(t-o[0]-r*h,e-o[1]-l*h))}return i}function db(n,t,e,{material:i,interiorMaterial:s,part:o,density:a,plainSeg:r,cast:l,matFor:c}){const h=n.foot,u=h.height,f=h.thickness??n.wall??6,d=h.inset??0,_=h.flare??0,g=t(0),p=n.cornerRadius>0?Math.max(0,h.cornerRadius??n.cornerRadius-d):h.cornerRadius??0,m=R=>{const O=_*(1-Nn(R/u,0,1));return{a:g.a-d+O,b:g.b-d+O,r:p>0?p+O:0}};m.H=u;const v=l?l.skew:0,M=bd({sec:m,H:u,cast:null,innerR:0,wall:f,yBase:0,span:[0,0,0,0]}),x=M.side;M.side=(R,O,A,I,C)=>{const k=x(R,O,A,I,C);return k.x+=v*k.z,k};const y=M.corner;M.corner=(R,O,A,I,C)=>{const k=y(R,O,A,I,C);return k.x+=v*k.z,k},M.span=[0,1,2,3].map(R=>2*((R&1?m(u/2).b:m(u/2).a)-m(u/2).r));const w=new vn;w.name="fang-foot",w.userData.part=o;const b=p>0,D=(R,O,A=0)=>{const I=m(O),{A:C,B:k,R:N}=Il(I,A,0,f);return(R&1?k:C)-N},E=(R,O,A,I)=>{const C=D(R,A,I);return C>0?(O/C+1)/2:.5};for(let R=0;R<4;R++){const O=e.sides[he[R]],A=O.notch;let I=Zr(h.relief,R);I&&I.macro&&(I={relief:I});const C=O.w,k=(Z,U)=>I?(X,z,Y)=>{const J=Z(X,z),et=U(X,z);Y[0]=(J+C/2)/C,Y[1]=et/u;let it=Dl(Math.min(J+D(R,et),D(R,et)-J),I.fade??1.5);A&&(it*=Dl(fb(A.outline,J,et),I.notchFade??3)),Y[2]=it}:null,N=(Z,U,X,z,Y,J)=>{const et=(W,j,$)=>{const st=U(W,j),ot=X(W,j);return M.side(R,E(R,st,ot,z),z,ot,$)},it=D(R,0),at=J&&I?{density:I.density??a}:[Math.max(2,Math.ceil(2*it/r)),Math.max(2,Math.ceil(u/Math.min(r,6)))],_t=oe({surface:qe(et),segments:at,relief:J&&I?I.relief:null,fade:0,panelMap:J?k(U,X):null});w.add(Vi(_t,Y,o,`foot-${Z}-${he[R]}`))},F=A?A.w/2:0,V=(Z,U)=>D(R,Z,U);if(A){for(const[Z,U,X]of[["l",(z,Y)=>-V(z,Y),()=>-F],["r",()=>F,(z,Y)=>V(z,Y)]])N(`outer-${Z}`,(z,Y)=>se(U(Y*u,0),X(Y*u,0),z),(z,Y)=>Y*u,0,I?c(I):i,!0),N(`inner-${Z}`,(z,Y)=>se(U((1-Y)*u,-f),X((1-Y)*u,-f),z),(z,Y)=>(1-Y)*u,-f,s,!1);N("outer-m",Z=>se(-F,F,Z),(Z,U)=>se(kl(A,se(-F,F,Z)),u,U),0,I?c(I):i,!0),N("inner-m",Z=>se(-F,F,Z),(Z,U)=>se(u,kl(A,se(-F,F,Z)),U),-f,s,!1)}else N("outer",(Z,U)=>se(-V(U*u,0),V(U*u,0),Z),(Z,U)=>U*u,0,I?c(I):i,!0),N("inner",(Z,U)=>se(-V((1-U)*u,-f),V((1-U)*u,-f),Z),(Z,U)=>(1-U)*u,-f,s,!1);const K=(Z,U,X)=>{const z=(Y,J,et)=>{const it=se(-f,0,J),at=se(U(it),X(it),Y);return M.side(R,E(R,at,0,it),it,0,et)};w.add(Vi(oe({surface:qe(z),segments:[Math.max(2,Math.ceil(2*D(R,0)/r)),1]}),i,o,`foot-bottom-${Z}-${he[R]}`))};if(A){K("l",J=>-D(R,0,J),()=>-F),K("r",()=>F,J=>D(R,0,J));const Z=A.outline,U=[0];for(let J=1;J<Z.length;J++)U.push(U[J-1]+Math.hypot(Z[J][0]-Z[J-1][0],Z[J][1]-Z[J-1][1]));const X=U[U.length-1],z=J=>{const et=J*X;let it=1;for(;it<U.length-1&&U[it]<et;)it++;const at=(et-U[it-1])/(U[it]-U[it-1]||1);return[se(Z[it-1][0],Z[it][0],at),se(Z[it-1][1],Z[it][1],at)]},Y=(J,et,it)=>{const[at,_t]=z(J),W=se(-f,0,et);return M.side(R,E(R,at,_t,W),W,_t,it)};w.add(Vi(oe({surface:qe(Y),segments:[Z.length*2,1]}),i,o,`foot-reveal-${he[R]}`))}else K("full",Z=>-D(R,0,Z),Z=>D(R,0,Z))}if(b)for(const R of[[[0,0],[0,u]],[[-f,u],[-f,0]],[[-f,0],[0,0]]])w.add(...vr(M,R,{material:i,part:o,name:"foot",sides:!1,hasCorners:!0}));const T={};for(let R=0;R<4;R++){const O=cn[R],A=cn[(R+1)%4],I=C=>b?M.corner(R,.5,0,C).clone():M.side(R,1,0,C).clone();T[To[R]]={bottom:I(0),top:I(u),out:new q(O[0]+A[0],0,O[2]+A[2]).normalize()}}const L={};for(let R=0;R<4;R++){const O=e.sides[he[R]].notch;L[he[R]]={bottom:M.side(R,.5,0,O?O.h:0).clone(),top:M.side(R,.5,0,u).clone(),normal:new q(...cn[R])}}return w.userData.corners=T,w.userData.axes=L,w.userData.layout=e,w}const Ao=(n,t,e)=>Math.sqrt(n*n+t*t+e*e);function ms(n,t,e,i,s,o){const a=Ao(n/i,t/s,e/o),r=Ao(n/(i*i),t/(s*s),e/(o*o));return r>1e-9?a*(a-1)/r:-Math.min(i,s,o)}function pb(n,t,e,i,s,o,a){const r=Math.abs(n)-i+a,l=Math.abs(t)-s+a,c=Math.abs(e)-o+a;return Ao(Math.max(r,0),Math.max(l,0),Math.max(c,0))+Math.min(Math.max(r,l,c),0)-a}function Sd(n,t,e,i,s,o,a){const r=s[0]-i[0],l=s[1]-i[1],c=s[2]-i[2],h=r*r+l*l+c*c,u=o-a,f=h-u*u,d=1/h,_=n-i[0],g=t-i[1],p=e-i[2],m=_*r+g*l+p*c,v=m-h,M=Ao(_*h-r*m,g*h-l*m,p*h-c*m),x=M*M,y=m*m*h,w=v*v*h,b=Math.sign(u)*u*u*x;return Math.sign(v)*f*w>b?Math.sqrt(x+w)*d-a:Math.sign(m)*f*y<b?Math.sqrt(x+y)*d-o:(Math.sqrt(x*f*d)+m*u)*d-o}function Jn(n,t,e){if(e<=0)return Math.min(n,t);const i=Math.max(e-Math.abs(n-t),0)/e;return Math.min(n,t)-i*i*e*.25}function fu(n,t,e){return-Jn(-n,-t,e)}function Xa(n,t,e,i){let s=1/0;for(let o=0;o<i.length-1;o++){const a=i[o],r=i[o+1];s=Math.min(s,Sd(n,t,e,a,r,a[3],r[3]))}return s}function du(n,t){const e=t.hornSize,i=t.hornCurl;if(n==="ram"){const s=[],o=.85+.35*i;for(let a=0;a<=14;a++){const r=a/14,l=-.4+r*o*Math.PI*2,c=(.36-.2*r)*e;s.push([.3+.18*r*e,.22+c*Math.cos(l)*.9,.02+c*Math.sin(l)-.1*e*(1-r),(.13-.085*r)*Math.sqrt(e)])}return s}return n==="bottle"?[[.22,.36,.06,.09],[.28,.5,.05,.1*e],[.31,.62*e,.05,.075*e],[.3,.7*e,.05,.05]]:n==="buffalo"?[[.26,.32,.04,.12],[.55*e,.4,-.04,.1],[.85*e,.5,.02,.075],[1.02*e,.66*i+.2,.12,.045],[1*e,.82*i+.2,.22,.03]]:[[.24,.3,.05,.14],[.38*e,.48+.08*i,.03,.135],[.57*e,.56+.12*i,.01,.12],[.72*e,.48+.1*i,.01,.105],[.75*e,.32,.04,.085],[.67*e,.2-.08*i,.08,.06]]}const sc={kind:"bovine",width:40,projection:.62,droop:28,hornSize:1,hornCurl:.5,eyeSize:1,ears:!0,embed:4,detail:0,seed:1,brow:!0,nostrils:!0};function Ed(n){const t={...sc,...n},e=t.width,i=new Be(t.seed),s=()=>1+(i.next()-.5)*.04,o=t.projection,a=t.droop*Math.PI/180,r=Math.cos(a),l=Math.sin(a),h=(t.kind==="tiger"?du("bottle",t):du(t.kind==="ram"?"ram":t.kind==="buffalo"?"buffalo":"bovine",t)).map(x=>[x[0]*e*s(),x[1]*e,x[2]*e,x[3]*e]),u=h.map(x=>[-x[0],x[1],x[2],x[3]]),f=.1*e*t.eyeSize,d=(t.kind==="tiger"?.2:.25)*e,_=.16*e,g=(.17+.35*o*.4)*e,p=[0,.14*e,.12*e],m=o*e*1.15,v=[0,p[1]-m*l,p[2]+m*r],M=.07*e;return{bounds:{min:[Math.min(...u.map(x=>x[0]-x[3]))-2,Math.min(-.5*e,v[1]-.25*e)-2,-t.embed-1],max:[Math.max(...h.map(x=>x[0]+x[3]))+2,Math.max(.55*e,...h.map(x=>x[1]+x[3]))+2,Math.max(v[2]+.2*e,...h.map(x=>x[2]+x[3]))+2]},F:e,p:t,sd(x,y,w){let b=pb(x,y+.02*e,w+t.embed*.5-.03*e,.36*e,.38*e,t.embed*.5+.12*e,.12*e);b=Jn(b,ms(x,y-.16*e,w-.1*e,.38*e,.3*e,.22*e),M),b=Jn(b,Sd(x,y,w,p,v,.29*e,(t.kind==="ram"?.16:.22)*e),M*1.2);const D=x,E=y-v[1],T=w-v[2];b=Jn(b,ms(D,E-.01*e,T,(t.kind==="ram"?.19:.27)*e,.14*e,.15*e),M*.7),t.brow&&(b=Jn(b,Xa(x,y,w,[[-d*1.25,_+f*1.2,g-.02*e,.05*e],[0,_+f*1.7,g+.02*e,.06*e],[d*1.25,_+f*1.2,g-.02*e,.05*e]]),M*.5));for(const L of[-1,1]){const R=x-L*d,O=y-_,A=w-g;b=Jn(b,ms(R,O,A,f*1.15,f*.85,f),M*.35),b=fu(b,-ms(R-L*f*.05,O,A-f*.95,f*.42,f*.36,f*.28),.25)}if(t.nostrils)for(const L of[-1,1])b=fu(b,-ms(x-L*.09*e,y-v[1]+.02*e,w-v[2]-.14*e,.045*e,.06*e,.06*e),.4);if(t.ears&&t.kind!=="ram")for(const L of[-1,1])b=Jn(b,ms(x-L*.42*e,y-.1*e,w-.04*e,.15*e,.07*e,.05*e),M*.5);return b=Jn(b,Xa(x,y,w,h),M*.6),b=Jn(b,Xa(x,y,w,u),M*.6),b}}}function Td(n,{voxel:t=.8,clipZ:e=null}={}){const[i,s,o]=n.bounds.min,[a,r,l]=n.bounds.max,c=Math.ceil((a-i)/t)+1,h=Math.ceil((r-s)/t)+1,u=Math.ceil((l-o)/t)+1,f=new Float32Array(c*h*u),d=(C,k,N)=>(N*h+k)*c+C,_=(C,k,N)=>{const F=n.sd(C,k,N);return e!=null?Math.max(F,e-N):F},g=4,p=Math.ceil((c-1)/g)+1,m=Math.ceil((h-1)/g)+1,v=Math.ceil((u-1)/g)+1,M=new Float32Array(p*m*v);for(let C=0;C<v;C++)for(let k=0;k<m;k++)for(let N=0;N<p;N++)M[(C*m+k)*p+N]=_(i+N*g*t,s+k*g*t,o+C*g*t);const x=g*t*1.8;for(let C=0;C<u;C++)for(let k=0;k<h;k++)for(let N=0;N<c;N++){const F=Math.min(p-1,Math.round(N/g)),V=Math.min(m-1,Math.round(k/g)),K=Math.min(v-1,Math.round(C/g)),Z=M[(K*m+V)*p+F];f[d(N,k,C)]=Math.abs(Z)>x?Z:_(i+N*t,s+k*t,o+C*t)}const y=new Int32Array((c-1)*(h-1)*(u-1)).fill(-1),w=(C,k,N)=>(N*(h-1)+k)*(c-1)+C,b=[],D=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,1,1],[1,1,1]],E=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]],T=new Float64Array(8);for(let C=0;C<u-1;C++)for(let k=0;k<h-1;k++)for(let N=0;N<c-1;N++){let F=0;for(let X=0;X<8;X++)T[X]=f[d(N+D[X][0],k+D[X][1],C+D[X][2])],T[X]<0&&(F|=1<<X);if(F===0||F===255)continue;let V=0,K=0,Z=0,U=0;for(const[X,z]of E){if(T[X]<0==T[z]<0)continue;const Y=T[X]/(T[X]-T[z]);V+=D[X][0]+(D[z][0]-D[X][0])*Y,K+=D[X][1]+(D[z][1]-D[X][1])*Y,Z+=D[X][2]+(D[z][2]-D[X][2])*Y,U++}y[w(N,k,C)]=b.length/3,b.push(i+(N+V/U)*t,s+(k+K/U)*t,o+(C+Z/U)*t)}const L=[],R=(C,k,N,F,V)=>{C<0||k<0||N<0||F<0||(V?L.push(C,N,k,C,F,N):L.push(C,k,N,C,N,F))};for(let C=1;C<u-1;C++)for(let k=1;k<h-1;k++)for(let N=0;N<c-1;N++){const F=f[d(N,k,C)]<0,V=f[d(N+1,k,C)]<0;F!==V&&R(y[w(N,k-1,C-1)],y[w(N,k,C-1)],y[w(N,k,C)],y[w(N,k-1,C)],V)}for(let C=1;C<u-1;C++)for(let k=0;k<h-1;k++)for(let N=1;N<c-1;N++){const F=f[d(N,k,C)]<0,V=f[d(N,k+1,C)]<0;F!==V&&R(y[w(N-1,k,C-1)],y[w(N-1,k,C)],y[w(N,k,C)],y[w(N,k,C-1)],V)}for(let C=0;C<u-1;C++)for(let k=1;k<h-1;k++)for(let N=1;N<c-1;N++){const F=f[d(N,k,C)]<0,V=f[d(N,k,C+1)]<0;F!==V&&R(y[w(N-1,k-1,C)],y[w(N,k-1,C)],y[w(N,k,C)],y[w(N-1,k,C)],V)}const O=new Float32Array(b.length),A=t*.5;for(let C=0;C<b.length;C+=3){const k=b[C],N=b[C+1],F=b[C+2],V=(z,Y,J)=>{let et=n.sd(z,Y,J);return e!=null&&(et=Math.max(et,e-J)),et},K=V(k+A,N,F)-V(k-A,N,F),Z=V(k,N+A,F)-V(k,N-A,F),U=V(k,N,F+A)-V(k,N,F-A),X=Ao(K,Z,U)||1;O[C]=K/X,O[C+1]=Z/X,O[C+2]=U/X}const I=new Ze;return I.setAttribute("position",new xe(b,3)),I.setAttribute("normal",new Ae(O,3)),I.setAttribute("uv",new xe(new Float32Array(b.length/3*2),2)),I.setIndex(L),mb(I),I.computeBoundingBox(),I.computeBoundingSphere(),I}function mb(n){const t=n.attributes.position.array,e=n.attributes.normal.array,i=n.index.array;for(let s=0;s<i.length;s+=3){const o=i[s]*3,a=i[s+1]*3,r=i[s+2]*3,l=t[a]-t[o],c=t[a+1]-t[o+1],h=t[a+2]-t[o+2],u=t[r]-t[o],f=t[r+1]-t[o+1],d=t[r+2]-t[o+2],_=c*d-h*f,g=h*u-l*d,p=l*f-c*u,m=e[o]+e[a]+e[r],v=e[o+1]+e[a+1]+e[r+1],M=e[o+2]+e[a+2]+e[r+2];if(_*m+g*v+p*M<0){const x=i[s+1];i[s+1]=i[s+2],i[s+2]=x}}n.index.needsUpdate=!0}const pu=new Map;function gb(n={}){const{material:t,part:e="heads",quality:i=1,...s}=n,o={...sc,...s},a=o.detail||Math.max(.35,o.width/(55*Math.sqrt(i))),r=JSON.stringify({...o,voxel:a});let l=pu.get(r);l||(l=Td(Ed(o),{voxel:a,clipZ:-o.embed}),pu.set(r,l));const c=new ue(l,t||new we);return c.userData.part=e,c.userData.head=o,c.castShadow=c.receiveShadow=!0,c}function _b(n,t,{azimuth:e=0,y:i,s,pitch:o=0,lift:a=0,follow:r=.35}={}){const l=n.userData.lathe,c=s??l.sAtY(i),h=l.frame(e,c),f=new q(Math.sin(e*Math.PI/180),0,Math.cos(e*Math.PI/180)).clone().lerp(h.n,r).normalize(),d=h.b.clone();f.applyAxisAngle(d,o*Math.PI/180);const _=new q().crossVectors(f,d).normalize();_.y<0&&_.negate();const g=new q().crossVectors(_,f).normalize();return t.matrix.makeBasis(g,_,f),t.matrix.setPosition(h.p.clone().addScaledVector(h.n,a)),t.matrix.decompose(t.position,t.quaternion,t.scale),t.matrixWorldNeedsUpdate=!0,t}const Ul=(n,t,e)=>Math.min(e,Math.max(t,n)),en=(n,t,e)=>n+(t-n)*e,go=n=>n*Math.PI/180,hr=n=>n<=0?0:n>=1?1:n*n*(3-2*n);function oc({height:n,radius:t,taper:e=0,entasis:i=.04,entasisAt:s=.7,foot:o={swell:.04,height:.06},top:a=null,collar:r=null,rings:l=null,embed:c=8}){const h=n,u=t,f=o||{swell:0,height:0},d=(f.height??.06)<=1?(f.height??.06)*h:f.height,_={flare:.22,height:u*.55,...a||{}},g=[];if(l&&l.count>0){const p=l.width??u*.12,m=l.spacing??p*2.2,v=(l.at??.5)<=1?(l.at??.5)*h:l.at;for(let M=0;M<l.count;M++)g.push({y:v+(M-(l.count-1)/2)*m,w:p,hh:l.height??u*.06,soft:!!l.soft})}return p=>{const m=Ul(p/h,0,1);let v=u*(1+e*m);const M=s>0&&s<1?Math.log(.5)/Math.log(s):1;if(v+=u*i*Math.sin(Math.PI*Math.pow(m,M)),f.swell&&(f.step?v+=u*f.swell*(1-hr((p-d)/Math.max(1,u*.06))):v+=u*f.swell*(1-hr(p/Math.max(1,d)))),r){const y=r.from<=1?r.from*h:r.from,w=r.to!=null?r.to<=1?r.to*h:r.to:h+c,b=r.shoulder??u*.08;v+=(r.amount??u*.08)*hr((p-y)/b)*(1-hr((p-w)/b))}for(const y of g){const w=Math.abs(p-y.y)/(y.w/2);w<1&&(v+=y.hh*(y.soft?.5+.5*Math.cos(Math.PI*w):Math.sqrt(1-w*w)))}const x=(p-(h-_.height))/_.height;return x>0&&(v+=u*_.flare*Math.pow(Ul(x,0,1),2.2)),v}}function Ad(n){var r,l;const t=oc(n),[e,i]=((r=n.relief)==null?void 0:r.zone)??n.zone,s=go(((l=n.relief)==null?void 0:l.arc)??n.arc??180);let o=0;const a=24;for(let c=1;c<=a;c++){const h=en(e,i,(c-1)/a),u=en(e,i,c/a);o+=Math.hypot(u-h,t(u)-t(h))}return{w:s*t((e+i)/2),h:o,rMid:t((e+i)/2)}}function Mb(n){var A,I;const{height:t,radius:e,material:i=new we,part:s="legs",density:o=.5,embed:a=8,relief:r=null,hollow:l=null,segments:c=null}=n;let h=t,u=((A=n.splay)==null?void 0:A.angle)??0,f=((I=n.splay)==null?void 0:I.toward)??[0,1],d=0;if(n.cast){const C=new Be(n.cast.seed??11);h*=1+C.jitter(n.cast.length??.004),u+=C.jitter(n.cast.splay??1.2),d=C.jitter(n.cast.twist??2)}const _=oc({...n,height:h,embed:a}),g=h+a,p=new vn;p.name="column-leg",p.userData.part=s;const m=go(((r==null?void 0:r.facing)??0)+d),v=go((r==null?void 0:r.arc)??180),M=(C,k,N,F,V=1)=>qe((K,Z,U)=>{const X=en(C,k,K),z=en(N,F,Z),Y=_(z)*V;U.set(Math.sin(X)*Y,z,Math.cos(X)*Y)}),x=2*Math.PI*e,y=(C,k)=>{const N=(c==null?void 0:c.v)??Math.ceil((k-C)/Math.max(1.5,Math.min(6,e*.05)));return Math.max(2,N)},w=C=>Math.max(8,Math.ceil(((c==null?void 0:c.u)??Math.max(48,x*.25))*C)),b=(C,k,N)=>{const F=new ue(C,k);return F.name=N,F.userData.part=s,F.castShadow=F.receiveShadow=!0,p.add(F),F},D=(l&&l.open==="bottom",0);if(r&&r.map){const[C,k]=r.zone,N=r.material||new we({relief:r.map}),F=r.fade??2,V=v>=Math.PI*2-1e-6;b(oe({surface:M(m-v/2,m+v/2,C,k),segments:{density:r.density??o},relief:r.map,fade:V?{u0:0,u1:0,v0:F,v1:F}:F,maxVerts:r.maxVerts}),N,"leg-relief"),V||b(oe({surface:M(m+v/2,m-v/2+Math.PI*2,C,k),segments:[w(1-v/(Math.PI*2)),y(C,k)]}),i,"leg-back"),C>D&&b(oe({surface:M(m-Math.PI,m+Math.PI,D,C),segments:[w(1),y(D,C)]}),i,"leg-lower"),k<g&&b(oe({surface:M(m-Math.PI,m+Math.PI,k,g),segments:[w(1),y(k,g)]}),i,"leg-upper")}else b(oe({surface:M(m-Math.PI,m+Math.PI,D,g),segments:[w(1),y(D,g)]}),i,"leg-shaft");const E=l?l.wall??e*.3:0,T=l&&l.open==="bottom"?Math.max(1,_(0)-E):0;if(b(oe({surface:(C,k,N)=>{const F=en(Math.PI,-Math.PI,C),V=en(_(0),T,k);N.pos.set(Math.sin(F)*V,0,Math.cos(F)*V),N.nrm.set(0,-1,0)},segments:[w(1),1]}),i,"leg-sole"),l&&l.open==="bottom"){const C=new we({interior:1}),k=h-E*.5,N=F=>Math.max(1,_(Math.min(F,h*.85))-E);b(oe({surface:qe((F,V,K)=>{const Z=en(Math.PI,-Math.PI,F),U=en(0,k,V),X=N(U);K.set(Math.sin(Z)*X,U,Math.cos(Z)*X)}),segments:[w(1),8]}),C,"leg-core"),b(oe({surface:(F,V,K)=>{const Z=en(Math.PI,-Math.PI,F),U=en(N(k),0,V);K.pos.set(Math.sin(Z)*U,k,Math.cos(Z)*U),K.nrm.set(0,-1,0)},segments:[w(1),1]}),C,"leg-core-top")}const L=new q(Math.sin(m),0,Math.cos(m)),R=C=>L.clone().multiplyScalar(_(C)).setY(C),O=(r==null?void 0:r.zone)??[h*.55,h];if(n.flange){const C=n.flange.from??O[0]+4,k=n.flange.to??O[1]-2,N=tc({material:i,notches:{every:18,depth:.42,width:3},...n.flange,from:R(C),to:R(k),out:L.clone()});p.add(N)}if(u){const C=new q(f[0],0,f[1]).normalize(),k=new q(0,1,0).cross(C).normalize().negate(),N=new ae().makeTranslation(0,h,0).multiply(new ae().makeRotationAxis(k,go(u))).multiply(new ae().makeTranslation(0,-h,0));for(const F of p.children)F.geometry.applyMatrix4(N),F.geometry.computeBoundingBox(),F.geometry.computeBoundingSphere()}return p.userData.radius=_,p.userData.height=h,p.userData.axis={bottom:R(O[0]),top:R(O[1]),out:L},r&&(p.userData.panel=Ad({...n,height:h})),p}function vb({height:n,chord:t,thickness:e,tipChord:i=.25,splay:s=0,outCurve:o=0,embed:a=6,material:r=new we,part:l="legs"}){const c=n+a,h=f=>{const d=Ul(f/n,0,1),_=t*en(i,1,Math.pow(d,.8)),g=e*en(.35,1,d),p=o*Math.sin(Math.PI*d);return[[0,p+_*.55],[g/2,p-_*.45],[-g/2,p-_*.45]]},u=new vn;u.userData.part=l;for(let f=0;f<3;f++){const d=(f+1)%3,_=oe({surface:qe((p,m,v)=>{const M=m*c,x=h(M),y=x[f],w=x[d];v.set(en(y[0],w[0],p),M,en(y[1],w[1],p))}),segments:[2,24]}),g=new ue(_,r);g.userData.part=l,g.castShadow=g.receiveShadow=!0,u.add(g)}return s&&(u.rotation.x=go(s)),u}const Fe=(n,t,e)=>n+(t-n)*e,xb=n=>n*Math.PI/180;function gs(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Or(n,t,e,i,s){return(o,a)=>{const[r,l,c,h]=s;if(o<=r)a[0]=-n,a[1]=Fe(i,t-e,o/r);else if(o<=l){const u=(o-r)/(l-r)*Math.PI*.5;a[0]=-n+e-e*Math.cos(u),a[1]=t-e+e*Math.sin(u)}else if(o<=c)a[0]=Fe(-n+e,n-e,(o-l)/(c-l)),a[1]=t;else if(o<=h){const u=(o-c)/(h-c)*Math.PI*.5;a[0]=n-e+e*Math.sin(u),a[1]=t-e+e*Math.cos(u)}else a[0]=n,a[1]=Fe(t-e,i,(o-h)/(1-h));return a}}function zr(n,t,e,i){const s=Math.max(.001,t-e-i),o=Math.max(.001,2*(n-e)),a=Math.max(.001,Math.PI/2*e),r=2*s+o+2*a,l=s/r,c=l+a/r,h=c+o/r,u=h+a/r;return[l,c,h,u]}function Rd(n){var M;const{width:t,height:e,bar:i,depth:s}=n,o=t/2,a=n.radius??i*.6,r=n.barTop??i,l=o-i,c=Math.min(((M=n.aperture)==null?void 0:M.radius)??l*.5,l),h=e-r,u=e-a,f=Math.PI/2*a,d=2*(o-a),_=[],g=[],p=Or(o,e,a,0,zr(o,e,a,0)),m=Or(l,h,c,0,zr(l,h,c,0));for(let x=0;x<=64;x++){const y=p(x/64,[0,0]),w=m(x/64,[0,0]);_.push([y[0]+o,y[1]]),g.push([w[0]+o,w[1]])}const v=n.root?{w:n.root.width??i*1.06,h:(n.root.height??i)+(n.root.rise??i*.35)}:null;return{outer:{w:t,h:e,outline:{outer:_,inner:g}},edge:{w:2*u+2*f+d,h:s,legLength:u,arcLength:f,topLength:d},root:v}}function yb(n){var X;const{width:t,bar:e,depth:i,material:s=new we,part:o="handles",density:a=.6,faces:r={},channel:l=null}=n;let c=n.height,h=n.lean??0;if(n.cast){const z=new Be(n.cast.seed??5);h+=z.jitter(n.cast.lean??1.5),c*=1+z.jitter(n.cast.height??.008)}const u=n.embed??Math.min(e,20),f=t/2,d=Math.min(n.radius??e*.6,f,c),_=n.barTop??e,g=f-e,p=c-_,m=Math.min(((X=n.aperture)==null?void 0:X.radius)??g*.5,g,p),v=i/2,M=zr(f,c,d,-u),x=zr(g,p,m,-u),y=(z,Y,J)=>{const et=[0,...Y,1],it=[0,...J,1];for(let at=0;at<5;at++)if(z<=et[at+1])return Fe(it[at],it[at+1],(z-et[at])/(et[at+1]-et[at]));return 1},w=Or(f,c,d,-u,M),b=Or(g,p,m,-u,x),D=[0,0],E=[0,0],T=z=>{w(z,D),b(y(z,M,x),E)},L=new Map,R=z=>z?z.macro?{relief:z}:z:null,O=z=>z?z.material?z.material:(L.has(z.relief)||L.set(z.relief,new we({relief:z.relief})),L.get(z.relief)):s,A=new vn;A.name="upright-handle",A.userData.part=o;const I=(z,Y,J)=>{const et=new ue(z,Y);return et.name=J,et.userData.part=o,et.castShadow=et.receiveShadow=!0,A.add(et),et},C=2*(c+u)+2*f,k=Math.max(48,Math.ceil(C/6)),N=z=>{if(!l)return 0;const Y=(l.width??e*.3)/2,J=Math.abs(z-.5)*e/Y;return J<1?-(l.depth??2)*(.5+.5*Math.cos(Math.PI*J)):0},F=R(r.outer);{const z=(J,et,it)=>{T(J),it.set(Fe(E[0],D[0],et),Fe(E[1],D[1],et),v+N(et))},Y=(F==null?void 0:F.fade)??1.5;I(oe({surface:qe(z),segments:F?{density:F.density??a}:[k,l?12:2],relief:(F==null?void 0:F.relief)??null,fade:0,panelMap:F?(J,et,it)=>{T(J);const at=Fe(E[0],D[0],et),_t=Fe(E[1],D[1],et),W=Math.hypot(D[0]-E[0],D[1]-E[1]);it[0]=(at+f)/t,it[1]=_t/c,it[2]=gs(Math.min(et,1-et)*W,Y)*gs(_t,Y)}:null}),O(F),"handle-outer")}const V=R(r.back);I(oe({surface:qe((z,Y,J)=>{T(z),J.set(Fe(D[0],E[0],Y),Fe(D[1],E[1],Y),-v)}),segments:V?{density:a}:[k,2],relief:(V==null?void 0:V.relief)??null,fade:0,panelMap:V?(z,Y,J)=>{T(z);const et=Fe(D[0],E[0],Y),it=Fe(D[1],E[1],Y);J[0]=(f-et)/t,J[1]=it/c,J[2]=gs(Math.min(Y,1-Y)*e,1.5)*gs(it,1.5)}:null}),O(V),"handle-back");const K=Rd({...n,height:c}),Z=R(r.edge);{const Y=new Float32Array(513),J=[0,0],et=[0,0];w(0,et);for(let _t=1;_t<=512;_t++)w(_t/512,J),Y[_t]=Y[_t-1]+Math.hypot(J[0]-et[0],J[1]-et[1]),et[0]=J[0],et[1]=J[1];const it=_t=>{const W=_t*512,j=Math.min(511,Math.floor(W));return Fe(Y[j],Y[j+1],W-j)},at=(Z==null?void 0:Z.fade)??1.2;I(oe({surface:qe((_t,W,j)=>{w(_t,D),j.set(D[0],D[1],Fe(v,-v,W))}),segments:Z?{density:Z.density??a}:[k,2],relief:(Z==null?void 0:Z.relief)??null,fade:0,panelMap:Z?(_t,W,j)=>{w(_t,D),j[0]=(it(_t)-u)/K.edge.w,j[1]=1-W,j[2]=gs(Math.min(W,1-W)*i,at)*gs(D[1],at)}:null}),O(Z),"handle-edge")}const U=R(r.inner);I(oe({surface:qe((z,Y,J)=>{T(z),J.set(E[0],E[1],Fe(-v,v,Y))}),segments:[k,2]}),O(U&&!U.relief?U:null),"handle-inner");for(const z of[0,1]){T(z);const Y=[D[0],D[1]],J=[E[0],E[1]],et=z===0;I(oe({surface:qe((it,at,_t)=>{const W=Fe(et?Y[0]:J[0],et?J[0]:Y[0],it);_t.set(W,-u,Fe(-v,v,at))}),segments:[1,1]}),s,"handle-cap")}if(n.root){const z=n.root,Y=z.width??e*1.06,J=z.height??e,et=z.rise??e*.35,it=v+(z.outset??i*.3),at=-v-(z.inset??0),_t=R(r.root);for(const W of[-1,1]){const j=W*(f-e/2),$=j-Y/2,st=j+Y/2,ot=-J,wt=et,ut=[{n:"front",c:[[$,ot,it],[st,ot,it],[$,wt,it],[st,wt,it]],sp:_t},{n:"back",c:[[st,ot,at],[$,ot,at],[st,wt,at],[$,wt,at]]},{n:"left",c:[[$,ot,at],[$,ot,it],[$,wt,at],[$,wt,it]]},{n:"right",c:[[st,ot,it],[st,ot,at],[st,wt,it],[st,wt,at]]},{n:"top",c:[[$,wt,it],[st,wt,it],[$,wt,at],[st,wt,at]]},{n:"bottom",c:[[$,ot,at],[st,ot,at],[$,ot,it],[st,ot,it]]}];for(const S of ut){const[P,Q,ft,rt]=S.c.map(bt=>new q(...bt)),dt=(bt,xt,yt)=>yt.set(0,0,0).addScaledVector(P,(1-bt)*(1-xt)).addScaledVector(Q,bt*(1-xt)).addScaledVector(ft,(1-bt)*xt).addScaledVector(rt,bt*xt),Mt=S.sp;I(oe({surface:qe(dt),segments:Mt?{density:Mt.density??a}:[2,2],relief:(Mt==null?void 0:Mt.relief)??null,fade:(Mt==null?void 0:Mt.fade)??1.5}),O(Mt),`handle-root-${S.n}`).userData.root=!0}}}if(h){const z=new ae().makeRotationX(xb(h));for(const Y of A.children)Y.userData.root||(Y.geometry.applyMatrix4(z),Y.geometry.computeBoundingBox(),Y.geometry.computeBoundingSphere())}return A.userData.layout=K,A.userData.lean=h,A}const bb=[[0,0,1],[1,0,0],[0,0,-1],[-1,0,0]],wb=[[1,0,0],[0,0,-1],[-1,0,0],[0,0,1]],Me=(n,t,e)=>n+(t-n)*e,Sb=n=>n*Math.PI/180;function Eb(n,t){if(t<=0)return 1;if(n<=0)return 0;if(n>=t)return 1;const e=n/t;return e*e*(3-2*e)}function Tb(n,t){if(!n)return;if(n[he[t]]!==void 0)return n[he[t]];const e=t%2===0?"long":"short";return n[e]!==void 0?n[e]:n.all}function rc(n,t,e,i){const s=(n&1)===0,o=s?t.b:t.a,a=s?t.a:t.b,r=(2*e-1)*a,l=bb[n],c=wb[n];return i.set(l[0]*o+c[0]*r,t.y,l[2]*o+c[2]*r)}function je(n,t,{material:e,part:i,name:s,segV:o=1,segU:a=4,faces:r=null,map:l=null,density:c=.6}){const h=[];for(let u=0;u<4;u++){const f={a:0,b:0,y:0},d=(M,x,y)=>{const w=t(x);return f.a=w.a,f.b=w.b,f.y=w.y,rc(u,f,M,y)},_=r?Tb(r,u):null,g=_?_.macro?{relief:_}:_:null,p=g?g.material||Ab(g.relief):e,m=oe({surface:qe(d),segments:g?{density:g.density??c}:[a,o],relief:(g==null?void 0:g.relief)??null,fade:g?{u0:0,u1:0,v0:g.fade??1.5,v1:g.fade??1.5}:0,panelMap:g&&l?l(u,g):null}),v=new ue(m,p);v.name=`${s}-${he[u]}`,v.userData.part=i,v.castShadow=v.receiveShadow=!0,n.add(v),h.push(v)}return h}const Ya=new WeakMap;function Ab(n){return Ya.has(n)||Ya.set(n,new we({relief:n})),Ya.get(n)}function ac(n){const t=n.width,e=n.depth,i=t/2,s=e/2,o=((n.ridge??.4)<=1?(n.ridge??.4)*t:n.ridge)/2,a=Math.min(o,i-.001),r=n.rise??s*Math.tan(Sb(n.slope??38)),l=n.concave??0,c=m=>(1-l)*m+l*m*m,h={height:0,overhang:0,fascia:0,...n.skirt||{}},u=h.height+(h.fascia??0),f=m=>({a:Me(i,a,m),b:Me(s,0,m),y:u+r*c(m)}),d=48,_=new Float32Array(d+1),g=new Float32Array(d+1);for(let m=1;m<=d;m++){const v=f((m-1)/d),M=f(m/d);_[m]=_[m-1]+Math.hypot(M.b-v.b,M.y-v.y),g[m]=g[m-1]+Math.hypot(M.a-v.a,M.y-v.y)}return{A:i,B:s,rh:a,rise:r,level:f,arc:(m,v)=>{const M=m&1?g:_,x=v*d,y=Math.min(d-1,Math.floor(x));return Me(M[y],M[y+1],x-y)},y0:u,sk:h,top:u+r}}function Pd(n){const t=ac(n),e={};for(let i=0;i<4;i++){const s=(i&1)===0,o=2*(s?t.A:t.B),a=t.arc(i,1),r=[];for(let l=0;l<=12;l++){const c=t.level(l/12);r.push([o/2-(s?c.a:c.b),t.arc(i,l/12)])}for(let l=12;l>=0;l--){const c=t.level(l/12);r.push([o/2+(s?c.a:c.b),t.arc(i,l/12)])}e[he[i]]={w:o,h:a,outline:r,shape:s&&t.rh>0?"trapezoid":"triangle"}}return{faces:e,rise:t.rise,top:t.top,ridge:2*t.rh}}function Rb(n){const{material:t=new we,part:e="lid",thickness:i=4,density:s=.6}=n,o=n.interiorMaterial||new we({interior:1}),a=ac(n),{A:r,B:l,rh:c,level:h,sk:u}=a,f=u.overhang??0,d=r-f,_=l-f,g=new vn;g.name="hipped-lid",g.userData.part=e;const p=i,m=u.height,v=a.y0,M=Math.max(12,Math.ceil(a.arc(0,1)/6)),x=(A,I,C)=>({a:A,b:I,y:C}),y=(A,I)=>{const C=(A&1)===0,k=2*(C?r:l),N=a.arc(A,1),F=N/Math.hypot(N,C?r-c:l),V=I.fade??1.5;return(K,Z,U)=>{const X=h(Z),z=C?X.a:X.b,Y=(2*K-1)*z;U[0]=.5+Y/k,U[1]=a.arc(A,Z)/N,U[2]=Eb((z-Math.abs(Y))*F,V)}};je(g,h,{material:t,part:e,name:"lid-roof",segV:M,faces:n.faces,map:y,density:s}),(u.fascia??0)>0&&je(g,A=>x(r,l,Me(m,v,A)),{material:t,part:e,name:"lid-fascia",segV:1}),f>0&&je(g,A=>x(Me(d,r,A),Me(_,l,A),m),{material:t,part:e,name:"lid-soffit",segV:1}),m>0&&je(g,A=>x(d,_,Me(0,m,A)),{material:t,part:e,name:"lid-skirt",segV:2}),je(g,A=>x(Me(d-p,d,A),Me(_-p,_,A),0),{material:t,part:e,name:"lid-bottom",segV:1});const w=d-p,b=_-p,D=Math.max(p,v-p*.3);D>0&&je(g,A=>x(w,b,Me(D,0,A)),{material:o,part:e,name:"lid-inner-skirt",segV:1});const E=a.top-p*1.6,T=Math.max(0,c-p);if(je(g,A=>{const I=1-A,C=n.concave??0;return x(Me(w,T,I),Me(b,0,I),D+(E-D)*((1-C)*I+C*I*I))},{material:o,part:e,name:"lid-underside",segV:8}),n.seat){const A=n.seat.depth??8,I=n.seat.clearance??.8,C=n.seat.thickness??p,k=(n.seat.width??2*(w-I))/2,N=(n.seat.depth2??2*(b-I))/2;je(g,F=>x(k,N,Me(-A,.5,F)),{material:o,part:e,name:"lid-seat-out",segV:1}),je(g,F=>x(Me(k-C,k,F),Me(N-C,N,F),-A),{material:o,part:e,name:"lid-seat-bottom",segV:1}),je(g,F=>x(k-C,N-C,Me(.5,-A,F)),{material:o,part:e,name:"lid-seat-in",segV:1})}const L=(A,I,C)=>rc(A,h(C),I,new q),R=[],O={};for(let A=0;A<4;A++){const I=[];for(let k=0;k<=12;k++)I.push(L(A,1,k/12));R.push(I);const C=[];for(let k=0;k<=12;k++)C.push(L(A,.5,k/12));O[he[A]]=C}if(g.userData.hips=R,g.userData.midlines=O,g.userData.ridge=[new q(-c,a.top,0),new q(c,a.top,0)],g.userData.top=a.top,g.userData.layout=Pd(n),n.knob){const A=Ld({material:t,part:e,...n.knob});A.position.y=a.top,g.add(A),g.userData.knob=A}return g}function Ld(n){const{material:t=new we,part:e="lid"}=n,i=new vn;i.name="roof-knob",i.userData.part=e;const s={height:n.depth*.6,width:n.depth*.45,waist:.12,...n.post||{}},o=s.depth??s.width,a=n.embed??Math.max(4,s.height*.4),r=s.height;je(i,_=>{const g=Me(-a,r+1,_),p=Math.max(0,Math.min(1,g/r)),m=1-(s.waist??0)*Math.sin(Math.PI*p);return{a:s.width/2*m,b:o/2*m,y:g}},{material:t,part:e,name:"knob-post",segV:10});const l=ac(n),c=r,h=l.sk,u=_=>{const g=l.level(_);return{a:g.a,b:g.b,y:g.y+c}};if(je(i,u,{material:t,part:e,name:"knob-roof",segV:10,faces:n.faces}),h.height>0){const _=h.overhang??0;je(i,g=>({a:l.A-_,b:l.B-_,y:c+g*h.height}),{material:t,part:e,name:"knob-skirt",segV:1}),_>0&&je(i,g=>({a:Me(l.A-_,l.A,g),b:Me(l.B-_,l.B,g),y:c+h.height}),{material:t,part:e,name:"knob-soffit",segV:1}),(h.fascia??0)>0&&je(i,g=>({a:l.A,b:l.B,y:c+Me(h.height,l.y0,g)}),{material:t,part:e,name:"knob-fascia",segV:1})}const f=h.overhang??0;je(i,_=>({a:Me(0,l.A-f,_)+(l.A-l.B)*(1-_)*0,b:Me(0,l.B-f,_),y:c}),{material:t,part:e,name:"knob-base",segV:1});const d=[];for(let _=0;_<4;_++){const g=[];for(let p=0;p<=8;p++)g.push(rc(_,u(p/8),1,new q));d.push(g)}return i.userData.hips=d,i.userData.top=c+l.top,i}function Pb({height:n,radius:t,swell:e=.12,waist:i=.06,material:s,part:o="legs",density:a=.6}){const r=t,l=n;return ic({profile:[[0,0],[r*1.03,0,"corner"],[r,l*.06],[r*(1-i),l*.45],[r*(1-i*.4),l*.78],[r*(1+e),l*.96],[r*(1+e),l,"corner"],[0,l]],material:s,part:o,segments:{density:a}})}function Lb({width:n,height:t,bar:e,thickness:i,material:s,part:o="handles"}){const a=n/2,r=Math.min(a,t)*.45,l=Math.max(.5,r-e),c=new mf;c.moveTo(-a,0),c.lineTo(-a,t-r),c.quadraticCurveTo(-a,t,-a+r,t),c.lineTo(a-r,t),c.quadraticCurveTo(a,t,a,t-r),c.lineTo(a,0),c.lineTo(a-e,0),c.lineTo(a-e,t-e-l),c.quadraticCurveTo(a-e,t-e,a-e-l,t-e),c.lineTo(-a+e+l,t-e),c.quadraticCurveTo(-a+e,t-e,-a+e,t-e-l),c.lineTo(-a+e,0),c.closePath();const h=Math.min(1.5,i*.15),u=new ql(c,{depth:Math.max(.1,i-2*h),bevelEnabled:!0,bevelThickness:h,bevelSize:h,bevelSegments:2,curveSegments:10});u.translate(0,0,-(i-2*h)/2),u.computeBoundingBox();const f=new ue(u,s);return f.userData.part=o,f.castShadow=f.receiveShadow=!0,f}function Cb({radius:n,height:t,thickness:e=5,flare:i=.08,material:s,part:o="foot",density:a=.5}){return ic({profile:[[n,0],[n*(1-i*.7),t*.6],[n*(1-i),t]],thickness:e,rims:["v0","v1"],material:s,part:o,segments:{density:a}})}const Cd=Object.freeze(Object.defineProperty({__proto__:null,FANG_CORNERS:To,FANG_SIDES:he,HEAD_DEFAULTS:sc,LEIWEN_DEFAULTS:Yl,LOZENGE_DEFAULTS:Gf,MOTIFS:Bs,PATINA_MODES:ud,PATINA_PARAMS:ii,PATINA_PRESETS:Ls,PATINA_PRESET_GROUPS:hd,PROFILES:Ns,PatinaMaterial:we,Profile:Xs,ReliefMap:yo,ReliefPanel:bo,Rng:Be,animalHead:gb,bakeRelief:xf,bladeLeg:vb,bladeRow:od,blur:gr,borderLine:Ir,bossField:Tl,bossRow:Ex,bowstrings:sd,buildSurface:oe,buildTaotie:Jf,carve:bs,columnLeg:Mb,columnarLeg:Pb,companions:Uv,createCanvas:xr,drawMotif:Po,edgePath:Ny,edt:Hd,elementContour:Nf,fangBody:ab,fangLayout:wd,fangSection:yd,flange:tc,flangeOutline:pd,frame:rd,frieze:yi,getMotif:Gs,getPatina:ao,handleLayout:Rd,hashString:nl,headSDF:Ed,hippedLid:Rb,hippedLidLayout:Pd,inset:Sx,lathe:ic,latheFlanges:Yy,latheSurface:xd,legPanelSize:Ad,legRadius:oc,leiwenFill:Si,leiwenFillMask:Yr,leiwenOptions:yf,loopHandle:Lb,lozengeFill:Zl,lozengeOptions:Hf,meshSDF:Td,mirrorPair:bx,mixSeed:Au,motifDefaults:Ql,mountOnLathe:_b,mulberry32:Tu,nearestFeature:si,paintElements:Ff,parseSectors:Ll,patina:ce,pillowBoss:Dr,pillowOutline:cv,polyPath:Fs,profile:vd,profileCurve:nc,profileFromTable:Hy,quadSurface:Ty,register:_s,registerMotif:cd,registers:wx,renderTaotie:$f,resolveMotifParams:Eo,revolve:Ms,ringFoot:Cb,rng:Bd,roofKnob:Ld,roundPlate:yl,roundPoly:nv,roundStroke:Cn,setCanvasFactory:Gd,setPatina:kr,setPatinaMode:fd,setPatinaVessel:dd,shapes:QM,signedDistance:Pu,smoothPath:Af,taotieContext:Vf,taotieParts:Kf,uprightHandle:yb},Symbol.toStringTag,{value:"Module"})),mu={type:"change"},$a={type:"start"},gu={type:"end"},ur=new $u,_u=new _i,Db=Math.cos(70*H0.DEG2RAD);class Ib extends Yi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new q,this.cursor=new q,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ki.ROTATE,MIDDLE:Ki.DOLLY,RIGHT:Ki.PAN},this.touches={ONE:Zi.ROTATE,TWO:Zi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return r.phi},this.getAzimuthalAngle=function(){return r.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(G){G.addEventListener("keydown",yt),this._domElementKeyEvents=G},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",yt),this._domElementKeyEvents=null},this.saveState=function(){i.target0.copy(i.target),i.position0.copy(i.object.position),i.zoom0=i.object.zoom},this.reset=function(){i.target.copy(i.target0),i.object.position.copy(i.position0),i.object.zoom=i.zoom0,i.object.updateProjectionMatrix(),i.dispatchEvent(mu),i.update(),o=s.NONE},this.update=function(){const G=new q,Tt=new ji().setFromUnitVectors(t.up,new q(0,1,0)),Ut=Tt.clone().invert(),tt=new q,nt=new ji,B=new q,lt=2*Math.PI;return function(Et=null){const Pt=i.object.position;G.copy(Pt).sub(i.target),G.applyQuaternion(Tt),r.setFromVector3(G),i.autoRotate&&o===s.NONE&&R(T(Et)),i.enableDamping?(r.theta+=l.theta*i.dampingFactor,r.phi+=l.phi*i.dampingFactor):(r.theta+=l.theta,r.phi+=l.phi);let Ot=i.minAzimuthAngle,Bt=i.maxAzimuthAngle;isFinite(Ot)&&isFinite(Bt)&&(Ot<-Math.PI?Ot+=lt:Ot>Math.PI&&(Ot-=lt),Bt<-Math.PI?Bt+=lt:Bt>Math.PI&&(Bt-=lt),Ot<=Bt?r.theta=Math.max(Ot,Math.min(Bt,r.theta)):r.theta=r.theta>(Ot+Bt)/2?Math.max(Ot,r.theta):Math.min(Bt,r.theta)),r.phi=Math.max(i.minPolarAngle,Math.min(i.maxPolarAngle,r.phi)),r.makeSafe(),i.enableDamping===!0?i.target.addScaledVector(h,i.dampingFactor):i.target.add(h),i.target.sub(i.cursor),i.target.clampLength(i.minTargetRadius,i.maxTargetRadius),i.target.add(i.cursor),i.zoomToCursor&&w||i.object.isOrthographicCamera?r.radius=V(r.radius):r.radius=V(r.radius*c),G.setFromSpherical(r),G.applyQuaternion(Ut),Pt.copy(i.target).add(G),i.object.lookAt(i.target),i.enableDamping===!0?(l.theta*=1-i.dampingFactor,l.phi*=1-i.dampingFactor,h.multiplyScalar(1-i.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let Qt=!1;if(i.zoomToCursor&&w){let te=null;if(i.object.isPerspectiveCamera){const Wt=G.length();te=V(Wt*c);const ee=Wt-te;i.object.position.addScaledVector(x,ee),i.object.updateMatrixWorld()}else if(i.object.isOrthographicCamera){const Wt=new q(y.x,y.y,0);Wt.unproject(i.object),i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),Qt=!0;const ee=new q(y.x,y.y,0);ee.unproject(i.object),i.object.position.sub(ee).add(Wt),i.object.updateMatrixWorld(),te=G.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),i.zoomToCursor=!1;te!==null&&(this.screenSpacePanning?i.target.set(0,0,-1).transformDirection(i.object.matrix).multiplyScalar(te).add(i.object.position):(ur.origin.copy(i.object.position),ur.direction.set(0,0,-1).transformDirection(i.object.matrix),Math.abs(i.object.up.dot(ur.direction))<Db?t.lookAt(i.target):(_u.setFromNormalAndCoplanarPoint(i.object.up,i.target),ur.intersectPlane(_u,i.target))))}else i.object.isOrthographicCamera&&(i.object.zoom=Math.max(i.minZoom,Math.min(i.maxZoom,i.object.zoom/c)),i.object.updateProjectionMatrix(),Qt=!0);return c=1,w=!1,Qt||tt.distanceToSquared(i.object.position)>a||8*(1-nt.dot(i.object.quaternion))>a||B.distanceToSquared(i.target)>0?(i.dispatchEvent(mu),tt.copy(i.object.position),nt.copy(i.object.quaternion),B.copy(i.target),!0):!1}}(),this.dispose=function(){i.domElement.removeEventListener("contextmenu",At),i.domElement.removeEventListener("pointerdown",S),i.domElement.removeEventListener("pointercancel",Q),i.domElement.removeEventListener("wheel",dt),i.domElement.removeEventListener("pointermove",P),i.domElement.removeEventListener("pointerup",Q),i._domElementKeyEvents!==null&&(i._domElementKeyEvents.removeEventListener("keydown",yt),i._domElementKeyEvents=null)};const i=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let o=s.NONE;const a=1e-6,r=new Bh,l=new Bh;let c=1;const h=new q,u=new Lt,f=new Lt,d=new Lt,_=new Lt,g=new Lt,p=new Lt,m=new Lt,v=new Lt,M=new Lt,x=new q,y=new Lt;let w=!1;const b=[],D={};let E=!1;function T(G){return G!==null?2*Math.PI/60*i.autoRotateSpeed*G:2*Math.PI/60/60*i.autoRotateSpeed}function L(G){const Tt=Math.abs(G*.01);return Math.pow(.95,i.zoomSpeed*Tt)}function R(G){l.theta-=G}function O(G){l.phi-=G}const A=function(){const G=new q;return function(Ut,tt){G.setFromMatrixColumn(tt,0),G.multiplyScalar(-Ut),h.add(G)}}(),I=function(){const G=new q;return function(Ut,tt){i.screenSpacePanning===!0?G.setFromMatrixColumn(tt,1):(G.setFromMatrixColumn(tt,0),G.crossVectors(i.object.up,G)),G.multiplyScalar(Ut),h.add(G)}}(),C=function(){const G=new q;return function(Ut,tt){const nt=i.domElement;if(i.object.isPerspectiveCamera){const B=i.object.position;G.copy(B).sub(i.target);let lt=G.length();lt*=Math.tan(i.object.fov/2*Math.PI/180),A(2*Ut*lt/nt.clientHeight,i.object.matrix),I(2*tt*lt/nt.clientHeight,i.object.matrix)}else i.object.isOrthographicCamera?(A(Ut*(i.object.right-i.object.left)/i.object.zoom/nt.clientWidth,i.object.matrix),I(tt*(i.object.top-i.object.bottom)/i.object.zoom/nt.clientHeight,i.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),i.enablePan=!1)}}();function k(G){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c/=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function N(G){i.object.isPerspectiveCamera||i.object.isOrthographicCamera?c*=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),i.enableZoom=!1)}function F(G,Tt){if(!i.zoomToCursor)return;w=!0;const Ut=i.domElement.getBoundingClientRect(),tt=G-Ut.left,nt=Tt-Ut.top,B=Ut.width,lt=Ut.height;y.x=tt/B*2-1,y.y=-(nt/lt)*2+1,x.set(y.x,y.y,1).unproject(i.object).sub(i.object.position).normalize()}function V(G){return Math.max(i.minDistance,Math.min(i.maxDistance,G))}function K(G){u.set(G.clientX,G.clientY)}function Z(G){F(G.clientX,G.clientX),m.set(G.clientX,G.clientY)}function U(G){_.set(G.clientX,G.clientY)}function X(G){f.set(G.clientX,G.clientY),d.subVectors(f,u).multiplyScalar(i.rotateSpeed);const Tt=i.domElement;R(2*Math.PI*d.x/Tt.clientHeight),O(2*Math.PI*d.y/Tt.clientHeight),u.copy(f),i.update()}function z(G){v.set(G.clientX,G.clientY),M.subVectors(v,m),M.y>0?k(L(M.y)):M.y<0&&N(L(M.y)),m.copy(v),i.update()}function Y(G){g.set(G.clientX,G.clientY),p.subVectors(g,_).multiplyScalar(i.panSpeed),C(p.x,p.y),_.copy(g),i.update()}function J(G){F(G.clientX,G.clientY),G.deltaY<0?N(L(G.deltaY)):G.deltaY>0&&k(L(G.deltaY)),i.update()}function et(G){let Tt=!1;switch(G.code){case i.keys.UP:G.ctrlKey||G.metaKey||G.shiftKey?O(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):C(0,i.keyPanSpeed),Tt=!0;break;case i.keys.BOTTOM:G.ctrlKey||G.metaKey||G.shiftKey?O(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):C(0,-i.keyPanSpeed),Tt=!0;break;case i.keys.LEFT:G.ctrlKey||G.metaKey||G.shiftKey?R(2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):C(i.keyPanSpeed,0),Tt=!0;break;case i.keys.RIGHT:G.ctrlKey||G.metaKey||G.shiftKey?R(-2*Math.PI*i.rotateSpeed/i.domElement.clientHeight):C(-i.keyPanSpeed,0),Tt=!0;break}Tt&&(G.preventDefault(),i.update())}function it(G){if(b.length===1)u.set(G.pageX,G.pageY);else{const Tt=Rt(G),Ut=.5*(G.pageX+Tt.x),tt=.5*(G.pageY+Tt.y);u.set(Ut,tt)}}function at(G){if(b.length===1)_.set(G.pageX,G.pageY);else{const Tt=Rt(G),Ut=.5*(G.pageX+Tt.x),tt=.5*(G.pageY+Tt.y);_.set(Ut,tt)}}function _t(G){const Tt=Rt(G),Ut=G.pageX-Tt.x,tt=G.pageY-Tt.y,nt=Math.sqrt(Ut*Ut+tt*tt);m.set(0,nt)}function W(G){i.enableZoom&&_t(G),i.enablePan&&at(G)}function j(G){i.enableZoom&&_t(G),i.enableRotate&&it(G)}function $(G){if(b.length==1)f.set(G.pageX,G.pageY);else{const Ut=Rt(G),tt=.5*(G.pageX+Ut.x),nt=.5*(G.pageY+Ut.y);f.set(tt,nt)}d.subVectors(f,u).multiplyScalar(i.rotateSpeed);const Tt=i.domElement;R(2*Math.PI*d.x/Tt.clientHeight),O(2*Math.PI*d.y/Tt.clientHeight),u.copy(f)}function st(G){if(b.length===1)g.set(G.pageX,G.pageY);else{const Tt=Rt(G),Ut=.5*(G.pageX+Tt.x),tt=.5*(G.pageY+Tt.y);g.set(Ut,tt)}p.subVectors(g,_).multiplyScalar(i.panSpeed),C(p.x,p.y),_.copy(g)}function ot(G){const Tt=Rt(G),Ut=G.pageX-Tt.x,tt=G.pageY-Tt.y,nt=Math.sqrt(Ut*Ut+tt*tt);v.set(0,nt),M.set(0,Math.pow(v.y/m.y,i.zoomSpeed)),k(M.y),m.copy(v);const B=(G.pageX+Tt.x)*.5,lt=(G.pageY+Tt.y)*.5;F(B,lt)}function wt(G){i.enableZoom&&ot(G),i.enablePan&&st(G)}function ut(G){i.enableZoom&&ot(G),i.enableRotate&&$(G)}function S(G){i.enabled!==!1&&(b.length===0&&(i.domElement.setPointerCapture(G.pointerId),i.domElement.addEventListener("pointermove",P),i.domElement.addEventListener("pointerup",Q)),kt(G),G.pointerType==="touch"?St(G):ft(G))}function P(G){i.enabled!==!1&&(G.pointerType==="touch"?ht(G):rt(G))}function Q(G){Ct(G),b.length===0&&(i.domElement.releasePointerCapture(G.pointerId),i.domElement.removeEventListener("pointermove",P),i.domElement.removeEventListener("pointerup",Q)),i.dispatchEvent(gu),o=s.NONE}function ft(G){let Tt;switch(G.button){case 0:Tt=i.mouseButtons.LEFT;break;case 1:Tt=i.mouseButtons.MIDDLE;break;case 2:Tt=i.mouseButtons.RIGHT;break;default:Tt=-1}switch(Tt){case Ki.DOLLY:if(i.enableZoom===!1)return;Z(G),o=s.DOLLY;break;case Ki.ROTATE:if(G.ctrlKey||G.metaKey||G.shiftKey){if(i.enablePan===!1)return;U(G),o=s.PAN}else{if(i.enableRotate===!1)return;K(G),o=s.ROTATE}break;case Ki.PAN:if(G.ctrlKey||G.metaKey||G.shiftKey){if(i.enableRotate===!1)return;K(G),o=s.ROTATE}else{if(i.enablePan===!1)return;U(G),o=s.PAN}break;default:o=s.NONE}o!==s.NONE&&i.dispatchEvent($a)}function rt(G){switch(o){case s.ROTATE:if(i.enableRotate===!1)return;X(G);break;case s.DOLLY:if(i.enableZoom===!1)return;z(G);break;case s.PAN:if(i.enablePan===!1)return;Y(G);break}}function dt(G){i.enabled===!1||i.enableZoom===!1||o!==s.NONE||(G.preventDefault(),i.dispatchEvent($a),J(Mt(G)),i.dispatchEvent(gu))}function Mt(G){const Tt=G.deltaMode,Ut={clientX:G.clientX,clientY:G.clientY,deltaY:G.deltaY};switch(Tt){case 1:Ut.deltaY*=16;break;case 2:Ut.deltaY*=100;break}return G.ctrlKey&&!E&&(Ut.deltaY*=10),Ut}function bt(G){G.key==="Control"&&(E=!0,document.addEventListener("keyup",xt,{passive:!0,capture:!0}))}function xt(G){G.key==="Control"&&(E=!1,document.removeEventListener("keyup",xt,{passive:!0,capture:!0}))}function yt(G){i.enabled===!1||i.enablePan===!1||et(G)}function St(G){switch(Dt(G),b.length){case 1:switch(i.touches.ONE){case Zi.ROTATE:if(i.enableRotate===!1)return;it(G),o=s.TOUCH_ROTATE;break;case Zi.PAN:if(i.enablePan===!1)return;at(G),o=s.TOUCH_PAN;break;default:o=s.NONE}break;case 2:switch(i.touches.TWO){case Zi.DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;W(G),o=s.TOUCH_DOLLY_PAN;break;case Zi.DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;j(G),o=s.TOUCH_DOLLY_ROTATE;break;default:o=s.NONE}break;default:o=s.NONE}o!==s.NONE&&i.dispatchEvent($a)}function ht(G){switch(Dt(G),o){case s.TOUCH_ROTATE:if(i.enableRotate===!1)return;$(G),i.update();break;case s.TOUCH_PAN:if(i.enablePan===!1)return;st(G),i.update();break;case s.TOUCH_DOLLY_PAN:if(i.enableZoom===!1&&i.enablePan===!1)return;wt(G),i.update();break;case s.TOUCH_DOLLY_ROTATE:if(i.enableZoom===!1&&i.enableRotate===!1)return;ut(G),i.update();break;default:o=s.NONE}}function At(G){i.enabled!==!1&&G.preventDefault()}function kt(G){b.push(G.pointerId)}function Ct(G){delete D[G.pointerId];for(let Tt=0;Tt<b.length;Tt++)if(b[Tt]==G.pointerId){b.splice(Tt,1);return}}function Dt(G){let Tt=D[G.pointerId];Tt===void 0&&(Tt=new Lt,D[G.pointerId]=Tt),Tt.set(G.pageX,G.pageY)}function Rt(G){const Tt=G.pointerId===b[0]?b[1]:b[0];return D[Tt]}i.domElement.addEventListener("contextmenu",At),i.domElement.addEventListener("pointerdown",S),i.domElement.addEventListener("pointercancel",Q),i.domElement.addEventListener("wheel",dt,{passive:!1}),document.addEventListener("keydown",bt,{passive:!0,capture:!0}),this.update()}}const fr=new qt("#0b0a09"),Mu=Iu,vu=1.15,tn=Math.PI/180;class kb{constructor(t,{deterministic:e=!1,pixelRatio:i=null}={}){this.deterministic=e,this.pixelRatio=i;const s=new hf({canvas:t,antialias:!0,powerPreference:"high-performance"});s.setPixelRatio(i??Math.min(window.devicePixelRatio||1,2)),s.outputColorSpace=Te,s.toneMapping=Mu,s.toneMappingExposure=vu,s.shadowMap.enabled=!0,s.shadowMap.type=Cu,this.renderer=s;const o=new Ch;o.background=fr.clone(),this.scene=o,this.camera=new an(30,1,5,2e5),this.camera.position.set(0,300,1500),this.controls=new Ib(this.camera,t),this.controls.enableDamping=!e,this.controls.dampingFactor=.08,this.controls.autoRotateSpeed=.35,this.controls.autoRotate=!e,this.controls.addEventListener("start",()=>{this.controls.autoRotate=!1}),this.controls.addEventListener("change",()=>this.dirty=!0),this._buildEnvironment(),this._buildRoom(),this._buildLights(),this.content=null,this.box=new An(new q(-100,0,-100),new q(100,200,100)),this.mode="beauty",this.rig="vitrine",this.insets={left:0,right:0,top:0,bottom:0},this.fitScale=e?1:1.18,this.dirty=!0,this._frameWaiters=[],this.onFrame=null,this.resize(),window.addEventListener("resize",()=>this.resize());const a=()=>{requestAnimationFrame(a),(this.controls.update()||this.dirty||this._frameWaiters.length)&&this.render()};requestAnimationFrame(a)}_buildEnvironment(){const t=e=>{const i=new Ch,s=g=>{const p=new qt(g);return e?p.setScalar(.2126*p.r+.7152*p.g+.0722*p.b):p},o=(g,p)=>new Fi({color:s(g).multiplyScalar(p),side:kn}),a=new Rr(16,32,16),r=[],l=a.attributes.position,c=s("#121211"),h=s("#343230"),u=s("#43413e");for(let g=0;g<l.count;g++){const p=l.getY(g)/16,m=p<0?c.clone().lerp(h,p+1):h.clone().lerp(u,Math.min(1,p*1.4));r.push(m.r,m.g,m.b)}a.setAttribute("color",new xe(r,3)),i.add(new ue(a,new Fi({vertexColors:!0,side:Xe})));const f=(g,p,m,v,M,x,y)=>{const w=new ue(new Ts(g,p),o(m,v));return w.position.set(...M),w.lookAt(...x),i.add(w),w};f(7,4.5,"#fff0e2",3.5,[-5.5,7,6],[0,.5,0]),f(9,6,"#fff0e0",.8,[0,9.5,0],[0,0,0]);for(let g=0;g<5;g++)f(.5,.5,"#fff0dc",14,[-6+g*3,11,-3+g%2*5],[0,0,0]);f(1.3,8,"#b9cde6",2.2,[8,4,-6],[0,2,0]),f(6,2.2,"#ffe2c4",.9,[-2,3.5,-10],[0,2,0]),f(5,4,"#ffe6d2",1.6,[9,3,5],[0,1.5,0]),f(6,4,"#ffeadb",1.4,[-10,3,-1],[0,1.5,0]);for(const g of[-7.5,7.5])f(.08,12,"#e8e0d4",1.2,[g,3,7.5],[g,3,0]);f(10,10,"#1e1d1b",1,[0,-2.5,0],[0,0,0]),f(18,7,"#5f5b56",2.2,[0,3,13],[0,3,0]),f(3.5,2.2,"#ffeedd",3,[2.5,4.5,11],[0,1.5,0]);const d=new fl(this.renderer),_=d.fromScene(i,.015).texture;return d.dispose(),_};this.envMap=t(!1),this.envNeutral=t(!0),this.scene.environment=this.envMap}_buildRoom(){this.backdrop=new ue(new Rr(1,32,16),new Fi({color:fr,side:Xe,fog:!1,depthWrite:!1,toneMapped:!1})),this.backdrop.renderOrder=-1,this.scene.add(this.backdrop),this.floor=new ue(new Ts(1,1),new mr({color:"#141210",roughness:.97,metalness:0,envMapIntensity:.2})),this.floor.rotation.x=-Math.PI/2,this.floor.receiveShadow=!0,this.scene.add(this.floor);const t=new mr({color:"#2b2722",roughness:.9,metalness:0,envMapIntensity:.3}),e=new mr({color:"#1a1714",roughness:.93,metalness:0,envMapIntensity:.25});this.plinth=new ue(new Vs(1,1,1),[e,e,t,e,e,e]),this.plinth.receiveShadow=!0,this.plinth.castShadow=!0,this.scene.add(this.plinth);const i=document.createElement("canvas");i.width=i.height=128;const s=i.getContext("2d"),o=s.createRadialGradient(64,64,0,64,64,64);o.addColorStop(0,"rgba(0,0,0,0.75)"),o.addColorStop(.45,"rgba(0,0,0,0.42)"),o.addColorStop(1,"rgba(0,0,0,0)"),s.fillStyle=o,s.fillRect(0,0,128,128);const a=new K_(i);a.colorSpace=Te,this.contact=new ue(new Ts(1,1),new Fi({map:a,transparent:!0,depthWrite:!1,toneMapped:!1,fog:!1})),this.contact.rotation.x=-Math.PI/2,this.contact.renderOrder=1,this.scene.add(this.contact),this._fog=new Vl(fr,1e3,5e3),this.scene.fog=this._fog}_buildLights(){this.key=new zh("#fff6ee",4.2,0,.5,.6,0),this.key.castShadow=!0,this.key.shadow.mapSize.set(2048,2048),this.key.shadow.bias=-2e-4,this.key.shadow.radius=4,this.scene.add(this.key,this.key.target),this.fill=new DM("#d6d4ce",.3),this.scene.add(this.fill,this.fill.target),this.rim=new zh("#dfe6f0",2.6,0,.45,.95,0),this.scene.add(this.rim,this.rim.target),this.ambient=new PM("#7d7a74","#5a5651",1.45),this.scene.add(this.ambient),this._lightLook={key:this.key.color.clone(),fill:this.fill.color.clone(),rim:this.rim.color.clone()}}setContent(t,{rig:e="vitrine"}={}){this.content&&this.scene.remove(this.content),this.content=t,this.rig=e,t&&(this.scene.add(t),t.updateMatrixWorld(!0),this.box=new An().setFromObject(t),dd(t)),this._layoutRoom(),this.dirty=!0}_layoutRoom(){const t=this.box,e=t.getSize(new q),i=t.getCenter(new q),s=Math.max(e.length()/2,10);this.R=s;const o=Math.max(12,Math.min(60,e.y*.08)),a=Math.max(e.x,e.z*.6)*1.32+40,r=Math.max(e.z,e.x*.5)*1.32+40;this.plinth.scale.set(a,o,r),this.plinth.position.set(i.x,t.min.y-o/2,i.z),this.floor.scale.set(s*60,s*60,1),this.floor.position.set(i.x,t.min.y-o,i.z),this.backdrop.scale.setScalar(s*40),this.backdrop.position.copy(i),this.contact.scale.set(e.x*1.25+20,e.z*1.25+20,1),this.contact.position.set(i.x,t.min.y+.3,i.z);const l=new q(i.x,t.min.y+e.y*.45,i.z),c=(d,_)=>new q(Math.sin(d*tn)*Math.cos(_*tn),Math.sin(_*tn),Math.cos(d*tn)*Math.cos(_*tn)),h=s*4.2,u=this.rig==="raking"?0:this._lightAz||0;this.rig==="raking"?(this.key.position.copy(l).addScaledVector(c(-74,22),h),this.key.angle=Math.atan(s*1.6/h),this.key.intensity=5.2,this.rim.intensity=.6,this.fill.intensity=.2,this.contact.visible=!1):(this.key.position.copy(l).addScaledVector(c(u-36,24),h),this.key.angle=Math.atan(s*2.4/h),this.key.intensity=4.2,this.rim.intensity=3.2,this.fill.intensity=2.4,this.contact.visible=!0),this.key.target.position.copy(l);const f=this.key.shadow.camera;f.near=h*.4,f.far=h*2,f.updateProjectionMatrix(),this.key.shadow.normalBias=s*.0015,this.key.shadow.needsUpdate=!0,this.rim.position.copy(l).addScaledVector(c(u+165,32),h),this.rim.angle=Math.atan(s*1.5/h),this.rim.target.position.copy(l),this.fill.position.copy(l).addScaledVector(c(u+50,18),h),this.fill.target.position.copy(l),this._face&&this.rig!=="raking"&&this._layoutFaceLights(h)}_layoutFaceLights(t){var h,u;const e=this._face,i=(((h=e.light)==null?void 0:h.elevation)??35)*tn,s=(((u=e.light)==null?void 0:u.azimuth)??135)*tn,o=e.center,r=e.right.clone().multiplyScalar(Math.cos(s)).addScaledVector(e.up,Math.sin(s)).multiplyScalar(Math.cos(i)).addScaledVector(e.normal,Math.sin(i)).normalize();this.key.position.copy(o).addScaledVector(r,t),this.key.target.position.copy(o),this.key.angle=Math.atan(this.R*2.4/t);const l=e.right.clone().multiplyScalar(.5).addScaledVector(e.up,-.3).addScaledVector(e.normal,.8).normalize();this.fill.position.copy(o).addScaledVector(l,t),this.fill.target.position.copy(o),this.fill.intensity=.8,this.rim.intensity=0,this.contact.visible=!1;const c=this.key.shadow.camera;c.near=t*.4,c.far=t*2,c.updateProjectionMatrix(),this.key.shadow.needsUpdate=!0}_setFaceView(t){const e=t.face,i=new q(...e.normal).normalize(),s=new q(...e.up||[0,1,0]),o=s.addScaledVector(i,-s.dot(i)).normalize(),a=new q().crossVectors(o,i).normalize(),r=new q(...e.center);this._face={center:r,normal:i,up:o,right:a,width:e.width,height:e.height,light:e.light||t.light};const l=t.fov??1,c=(t.fit??1)*this.fitScale,h=this.camera;h.fov=l;const{w:u,h:f}=this._effectiveSize(),d=Math.tan(l*tn/2)/(this.height/2),_=d*(f/2),g=d*(u/2),p=Math.max(e.width/2/g,e.height/2/_)*c;h.up.copy(o),h.position.copy(r).addScaledVector(i,p),this.controls.target.copy(r);const m=this.R||100;h.near=Math.max(1,p-m*3),h.far=p+m*6,h.updateProjectionMatrix(),this.controls.minDistance=p*.05,this.controls.maxDistance=p*3,this.controls.maxPolarAngle=Math.PI,this.controls.update(),h.lookAt(r),this._fog.near=p+m*1.4,this._fog.far=p+m*9,this._layoutRoom(),this._applyViewOffset(),this.dirty=!0}get faceView(){const t=this._face;return t&&{center:t.center.toArray(),normal:t.normal.toArray(),up:t.up.toArray(),right:t.right.toArray(),width:t.width,height:t.height}}setView(t={}){if(t.face)return this._setFaceView(t);this._face&&(this._face=null,this.camera.up.set(0,1,0),this._lightAz=void 0);const{azimuth:e=25,elevation:i=12,fov:s=30}=t;this.rig!=="raking"&&this._lightAz!==e&&(this._lightAz=e,this._layoutRoom());const o=(t.fit??1.1)*this.fitScale,a=this.camera;a.fov=s;const r=this.box,l=t.target?new q(...t.target):r.getCenter(new q),c=new q(Math.sin(e*tn)*Math.cos(i*tn),Math.sin(i*tn),Math.cos(e*tn)*Math.cos(i*tn)),h=new q().crossVectors(new q(0,1,0),c).normalize();h.lengthSq()<1e-6&&h.set(1,0,0);const u=new q().crossVectors(c,h).normalize(),{w:f,h:d}=this._effectiveSize(),_=Math.tan(s*tn/2)/(this.height/2),g=_*(d/2),p=_*(f/2);let m=0;if(t.target)m=this.R*o/Math.min(g,p);else{for(let v=0;v<8;v++){const M=new q(v&1?r.max.x:r.min.x,v&2?r.max.y:r.min.y,v&4?r.max.z:r.min.z).sub(l),x=Math.abs(M.dot(h)),y=Math.abs(M.dot(u)),w=M.dot(c);m=Math.max(m,w+x/p,w+y/g)}m*=o}a.position.copy(l).addScaledVector(c,m),this.controls.target.copy(l),a.near=Math.max(1,m/100),a.far=this.R*80,a.updateProjectionMatrix(),this.controls.minDistance=this.R*.25,this.controls.maxDistance=this.R*12,this.controls.maxPolarAngle=Math.PI*.5-.02,this.controls.update(),this._fog.near=m+this.R*1.4,this._fog.far=m+this.R*9,this._applyViewOffset(),this.dirty=!0}setInsets(t){this.insets={left:0,right:0,top:0,bottom:0,...t},this._applyViewOffset(),this.dirty=!0}_effectiveSize(){const t=this.width||1,e=this.height||1;return{w:Math.max(100,t-this.insets.left-this.insets.right),h:Math.max(100,e-this.insets.top-this.insets.bottom)}}_applyViewOffset(){const t=this.width,e=this.height,i=(this.insets.right-this.insets.left)/2,s=(this.insets.bottom-this.insets.top)/2;Math.abs(i)<.5&&Math.abs(s)<.5?this.camera.clearViewOffset():this.camera.setViewOffset(t,e,i,s,t,e),this.camera.aspect=t/e,this.camera.updateProjectionMatrix()}setMode(t){this.mode=t;const e=t==="beauty"||t==="clay",i=t==="clay";fd(t==="silhouette"?"beauty":t),this.renderer.toneMapping=e?Mu:ti,this.renderer.toneMappingExposure=i?1:vu,this.scene.overrideMaterial=t==="silhouette"?this._white??(this._white=new Fi({color:16777215})):null;for(const s of[this.floor,this.plinth,this.backdrop])s.visible=e;this.contact.visible=e&&this.rig!=="raking";for(const s of[this.key,this.fill,this.rim,this.ambient])s.visible=e;this.key.color.copy(i?new qt("#ffffff"):this._lightLook.key),this.fill.color.copy(i?new qt("#d8d8d8"):this._lightLook.fill),this.rim.color.copy(i?new qt("#ffffff"):this._lightLook.rim),this.scene.environment=e?i?this.envNeutral:this.envMap:null,this.scene.fog=e?this._fog:null,this.scene.background=e?fr:new qt(0),this.dirty=!0}resize(){const t=window.innerWidth,e=window.innerHeight,i=this.pixelRatio??Math.min(window.devicePixelRatio||1,2);i!==this.renderer.getPixelRatio()&&this.renderer.setPixelRatio(i),this.width=t,this.height=e,this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this._applyViewOffset(),this.dirty=!0}restoreContext(){var t;for(const e of[this.envMap,this.envNeutral])(t=e==null?void 0:e.dispose)==null||t.call(e);this._buildEnvironment(),this.setMode(this.mode),this.key.shadow.needsUpdate=!0,this.dirty=!0}render(){this.dirty=!1,this.renderer.render(this.scene,this.camera);const t=this._frameWaiters;this._frameWaiters=[];for(const e of t)e();this.onFrame&&this.onFrame()}frame(){return new Promise(t=>{this._frameWaiters.push(t),this.dirty=!0})}setAutoRotate(t){this.controls.autoRotate=t&&!this.deterministic}}const Ub=["beauty","clay","silhouette","height","mask"];function Nl(n=location.hash){let t=String(n||"").replace(/^#/,"");try{t=decodeURIComponent(t)}catch{return null}return t=t.trim(),/^[A-Za-z0-9-]{1,80}$/.test(t)?t:null}function Nb(){const n=e=>{try{return window.matchMedia(e).matches}catch{return!1}},t=Math.min((screen==null?void 0:screen.width)||9999,(screen==null?void 0:screen.height)||9999);return n("(pointer: coarse)")&&t<=820||Math.min(window.innerWidth,window.innerHeight)<=500||window.innerWidth<=720}const Dd={get(n){var t;try{return((t=window.localStorage)==null?void 0:t.getItem(n))??null}catch{return null}},set(n,t){var e,i;try{t==null?(e=window.localStorage)==null||e.removeItem(n):(i=window.localStorage)==null||i.setItem(n,String(t))}catch{}}},Id="taotie-bronze.quality";function Fb(n=location.search,t=location.hash){const e=new URLSearchParams(n),i=f=>{const d=parseFloat(e.get(f));return Number.isFinite(d)?d:null},s=e.get("mode"),o=Nb(),a=Nl(t),r=parseFloat(Dd.get(Id)),l=i("q"),c=l??(Number.isFinite(r)?r:o?.5:1),h=i("dpr"),u=e.get("tab");return{a:e.get("a"),view:e.get("view"),patina:e.get("patina"),mode:Ub.includes(s)?s:"beauty",ui:e.get("ui")!=="0",q:Math.min(4,Math.max(.25,c)),qExplicit:l!=null,compact:o,dpr:Math.min(3,Math.max(.5,h??Math.min(window.devicePixelRatio||1,2))),tab:u==="atlas"||!u&&!e.get("a")&&a==="atlas"?"atlas":"vessels",motif:e.get("motif"),preset:e.get("preset"),route:a}}const Ob=`// The artifact registry: one line per artifact, alphabetical by file name.
// Each module's default export follows the artifact contract in KIT.md.
export { default as demoFangding } from './demo-fangding.js'
export { default as houmuwuDing } from './houmuwu-ding.js'
export { default as metFangding } from './met-fangding.js'
export { default as metFangyi } from './met-fangyi.js'
export { default as metGui } from './met-gui.js'
export { default as metGu } from './met-gu.js'
export { default as metZun } from './met-zun.js'
export { default as nezuFangyi } from './nezu-fangyi.js'
`,zb=Object.assign({"../artifacts/demo-fangding.js":()=>Kn(()=>import("./demo-fangding-BT_1opzW.js"),[],import.meta.url).then(n=>n.default),"../artifacts/houmuwu-ding.js":()=>Kn(()=>import("./houmuwu-ding-ookUdqup.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-fangding.js":()=>Kn(()=>import("./met-fangding-Dw2ES76C.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-fangyi.js":()=>Kn(()=>import("./met-fangyi-BI-LTS0f.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-gu.js":()=>Kn(()=>import("./met-gu-BsbUDVdt.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-gui.js":()=>Kn(()=>import("./met-gui-BCWT3KBp.js"),[],import.meta.url).then(n=>n.default),"../artifacts/met-zun.js":()=>Kn(()=>import("./met-zun-DJry_alp.js"),[],import.meta.url).then(n=>n.default),"../artifacts/nezu-fangyi.js":()=>Kn(()=>import("./nezu-fangyi-DRMC1KJ8.js"),[],import.meta.url).then(n=>n.default)}),xu=(n,t)=>(n.order??0)-(t.order??0)||String(n.title).localeCompare(String(t.title));function Bb(){const n=[...Ob.matchAll(/^\s*export\s*\{\s*default\s+as\s+\w+\s*\}\s*from\s*['"]\.\/([^'"]+\.js)['"]/gm)].map(l=>l[1]),t=[];for(const l of n){const c=zb["../artifacts/"+l];if(!c){console.warn(`[taotie] ${l} is registered but not lazily loadable (study files starting with "_" are skipped)`);continue}t.push({file:l,id:l.replace(/\.js$/,""),loader:c,artifact:null,promise:null})}const e=t.map(l=>l.id),i=new Set;let s=null;const o=l=>t.find(c=>{var h;return c.id===l||((h=c.artifact)==null?void 0:h.id)===l});function a(l){return l.promise??(l.promise=l.loader().then(c=>{l.artifact=c,c!=null&&c.id&&c.id!==l.id&&(e[e.indexOf(l.id)]=c.id,l.id=c.id);for(const h of i)h(c);return c})),l.promise}function r(){return s??(s=Promise.all(t.map(l=>a(l))).then(()=>{const l=t.map(c=>c.artifact).sort(xu);return e.splice(0,e.length,...l.map(c=>c.id)),l})),s}return{ids:e,get loaded(){return t.filter(l=>l.artifact).map(l=>l.artifact).sort(xu)},has:l=>!!o(l),get:l=>{var c;return((c=o(l))==null?void 0:c.artifact)||null},async load(l){var h;const c=o(l);return c?a(c):(await r(),((h=o(l))==null?void 0:h.artifact)||null)},loadAll:r,async first(){return(await r())[0]},onLoad(l){i.add(l)}}}function Nt(n,t={},...e){const i=document.createElement(n);for(const[s,o]of Object.entries(t))o==null||o===!1||(s==="class"?i.className=o:s==="text"?i.textContent=o:s.startsWith("on")?i.addEventListener(s.slice(2),o):i.setAttribute(s,o===!0?"":o));for(const s of e.flat())s!=null&&i.append(s);return i}const Ka=(n,t,e)=>{const i=t>=1?0:t>=.1?1:2;return Number(n).toFixed(i)+(e?" "+e:"")};function yu({label:n,min:t,max:e,step:i=.01,value:s,unit:o,onInput:a,cls:r}){const l=Nt("span",{class:"ctl-val",text:Ka(s,i,o)}),c=Nt("input",{type:"range",min:t,max:e,step:i,value:s,"aria-label":n});return c.addEventListener("input",()=>{const u=parseFloat(c.value);l.textContent=Ka(u,i,o),a(u)}),{el:Nt("div",{class:"ctl"+(r?" "+r:"")},Nt("div",{class:"ctl-row"},Nt("span",{class:"ctl-label",text:n}),l),c),set(u){c.value=u,l.textContent=Ka(u,i,o)}}}function Gb({label:n,value:t,onInput:e}){const i=Nt("input",{type:"color",value:t,"aria-label":n});return i.addEventListener("input",()=>e(i.value)),{el:Nt("div",{class:"ctl"},Nt("div",{class:"ctl-row"},Nt("span",{class:"ctl-label",text:n}),i)),set:o=>i.value=o}}function n2({label:n,options:t,value:e,onInput:i}){const s=Nt("select",{"aria-label":n},t.map(a=>Nt("option",{value:a,text:a,selected:a===e})));return s.addEventListener("change",()=>i(s.value)),{el:Nt("div",{class:"ctl"},Nt("div",{class:"ctl-row"},Nt("span",{class:"ctl-label",text:n})),s),set:a=>s.value=a}}function i2({label:n,value:t,onInput:e}){const i=Nt("input",{type:"checkbox",checked:!!t,"aria-label":n});return i.addEventListener("change",()=>e(i.checked)),{el:Nt("label",{class:"ctl toggle"},Nt("span",{class:"ctl-label",text:n}),i),set:o=>i.checked=!!o}}function Za(n,t,{value:e,onPick:i,seg:s=!1}={}){const o=n||Nt("div");o.classList.add(s?"seg":"chips"),o.replaceChildren();const a=t.map(l=>{const c=Nt("button",{type:"button",text:l.label??l.id,"data-id":l.id});return c.addEventListener("click",()=>{r(l.id),i==null||i(l.id)}),o.append(c),c});function r(l){for(const c of a)c.classList.toggle("on",c.dataset.id===l)}return r(e),{el:o,set:r}}const Hb=()=>new Promise(n=>setTimeout(n,0)),oo=n=>Math.round(n*10)/10,bu=n=>{const t=n.getSize(new q);return{min:n.min.toArray().map(oo),max:n.max.toArray().map(oo),w:oo(t.x),h:oo(t.y),d:oo(t.z)}};function Vb(n){if(!n)return null;n.updateMatrixWorld(!0);const t=new An().setFromObject(n),e={};n.traverse(s=>{var l;if(!s.isMesh)return;let o=null,a=null;for(let c=s;c;c=c.parent){if((l=c.userData)!=null&&l.part)if(o||(o=c.userData.part),c.userData.part===o)a=c;else break;if(c===n)break}if(!o)return;const r=e[o]??(e[o]={box:new An,roots:new Set});r.box.union(new An().setFromObject(s)),r.roots.add(a)});const i={overall:bu(t),parts:{}};for(const[s,o]of Object.entries(e))i.parts[s]={...bu(o.box),count:o.roots.size};return i}function kd(n){const t={triangles:0,vertices:0,meshes:0};return n==null||n.traverse(e=>{var o,a;if(!e.isMesh||!e.geometry)return;const i=e.geometry,s=i.index?i.index.count:((o=i.attributes.position)==null?void 0:o.count)||0;t.triangles+=Math.floor(s/3),t.vertices+=((a=i.attributes.position)==null?void 0:a.count)||0,t.meshes++}),t}function Wb(n){const t=kd(n),e=i=>i>=1e6?(i/1e6).toFixed(2)+" M":i>=1e4?Math.round(i/1e3)+" k":i>=1e3?(i/1e3).toFixed(1)+" k":String(i);return`${e(t.triangles)} triangles · ${e(t.vertices)} vertices · ${t.meshes} meshes`}function jb(n){const t=n.stage;return t!=null&&t.setView?{async setFace(e,i={}){var s;(s=t.setAutoRotate)==null||s.call(t,!1),t.setView({...i,face:e}),await t.frame()},faceView:()=>t.faceView??null}:{}}function qb(n){let t;const e=new Promise(i=>t=i);return window.__taotie={ready:e,...jb(n),...n},{markReady(){document.documentElement.dataset.ready="1",t(!0)}}}const Xb=n=>{const t=n/10;return(t>=100?Math.round(t):Math.round(t*10)/10).toString()},wu=n=>String(n.collection||"").split(/\s+—\s+|\s+-\s+/)[0],Su=n=>n&&!/^(unknown|not published|n\/a|none)$/i.test(String(n).trim()),Ja=n=>(n.order??0)>=90;function Yb({stage:n,catalog:t,quality:e,cacheMax:i=2,progress:s,listEl:o,labelEl:a,onShown:r,onPick:l}){const c=new Map;let h=null,u=0,f=null;const d={};let _=!1,g=null,p=e,m=null;const v=new Map;function M(){const R=t.loaded,O=t.ids.filter(I=>!t.get(I));o.replaceChildren();let A=!1;for(const I of R){Ja(I)&&!A&&(A=!0,o.append(Nt("li",{class:"sep","aria-hidden":"true"},Nt("span",{class:"cap",text:"Kit test piece"}))));const C=Nt("span",{class:"v-sub"}),k=Nt("button",{type:"button",class:"vessel","data-id":I.id,onclick:()=>l(I.id)},Nt("span",{class:"v-line"},Nt("span",{class:"v-title",text:I.title}),I.titleZh?Nt("span",{class:"v-zh",lang:"zh-Hans",text:I.titleZh}):null),C);v.set(I.id,{btn:k,sub:C,a:I}),o.append(Nt("li",{},k)),x(I.id)}for(const I of O)o.append(Nt("li",{class:"pending"},Nt("span",{class:"v-title",text:I.replace(/-/g," ")})));y()}function x(R,O){const A=v.get(R);if(!A)return;const I=A.a,C=Su(I.accession)&&String(I.accession).length<=18?" · "+I.accession:"";A.sub.textContent=O??(Ja(I)?"Procedural · not an excavated object":wu(I)+C),A.sub.classList.toggle("busy",O!=null)}function y(){const R=(h==null?void 0:h.artifact.id)??g;for(const[O,A]of v)O===R?A.btn.setAttribute("aria-current","true"):A.btn.removeAttribute("aria-current")}t.onLoad(()=>M()),M();function w(R){const O=R.dimensions||{},A=["h","w","d"].filter(k=>O[k]).map(k=>`${k.toUpperCase()} ${Xb(O[k])}`).join(" × ")+(Object.keys(O).length?" cm":""),I=(k,N)=>N?Nt("div",{class:"row"},Nt("dt",{text:k}),Nt("dd",{text:N})):null,C=Nt("button",{type:"button",class:"label-head","aria-expanded":String(_),"aria-controls":"label-body",onclick:()=>b(!_)},R.titleZh?Nt("span",{class:"zh",lang:"zh-Hans",text:R.titleZh}):null,Nt("span",{class:"title",text:R.title}),Nt("span",{class:"line",text:[R.date,wu(R)].filter(Boolean).join(" · ")}),Nt("span",{class:"status","aria-live":"polite"}),Nt("span",{class:"more","aria-hidden":"true"}));a.replaceChildren(C,Nt("div",{class:"label-body",id:"label-body"},Nt("dl",{class:"meta"},I("Date",R.date),I("Period",R.period),I("Findspot",R.findspot),I("Collection",R.collection),I("Accession",Su(R.accession)?R.accession:R.accession?"not published":null),I("Size",A),Nt("div",{class:"row mesh-row",hidden:!0},Nt("dt",{text:"Mesh"}),Nt("dd",{class:"mesh"}))),R.blurb?Nt("p",{class:"blurb",text:R.blurb}):null,Ja(R)?Nt("p",{class:"note",text:"A procedural test piece for the Taotie Kit — not a copy of any one object."}):null)),a.classList.toggle("open",_)}function b(R){var O;_=R,a.classList.toggle("open",R),(O=a.querySelector(".label-head"))==null||O.setAttribute("aria-expanded",String(R)),m==null||m()}function D(R){const O=a.querySelector(".status");O&&(O.textContent=R||""),a.classList.toggle("busy",!!R)}function E(R){for(const[O,A]of c){if(c.size<=i)break;O===R||!A.result||(h==null?void 0:h.result)===A.result||(c.delete(O),Qa(A.result))}}function T(R){const O=c.get(R.id);if(O)return c.delete(R.id),c.set(R.id,O),O.promise;const A=performance.now(),I={};return I.promise=(async()=>{const C=await R.build(Cd,{quality:p,onProgress:async(k,N)=>{if(f===R.id){const F=Math.round(Math.max(0,Math.min(1,k))*100);s.set(k,N),D(`Casting${N?" · "+N:""} — ${F}%`),x(R.id,`casting · ${F}%`)}await Hb()}});return C.object.userData.artifact=R.id,C.object.traverse(k=>{k.isMesh&&(k.castShadow=k.receiveShadow=!0)}),d[R.id]=Math.round(performance.now()-A),I.result=C,C})(),I.promise.catch(()=>c.delete(R.id)),c.set(R.id,I),I.promise}async function L(R,{view:O}={}){var Z,U,X,z;const A=++u;g=R,y();const I=await t.load(R);if(A!==u)return null;if(!I)throw new Error(`unknown artifact "${R}"`);g=I.id,y(),w(I),document.documentElement.dataset.ready="0",((Z=c.get(I.id))==null?void 0:Z.result)||(f=I.id,s.start(I.title),D("Casting…"),x(I.id,"casting…"));let k;try{k=await T(I)}catch(Y){throw A===u&&(s.done(),D("This vessel could not be built."),x(I.id)),Y}if(f===I.id&&(f=null),x(I.id),A!==u)return null;s.done(),D("");const N=h;h={artifact:I,result:k},n.setContent(k.object,{rig:"vitrine"});const F=a.querySelector(".mesh-row");F&&(F.querySelector(".mesh").textContent=Wb(k.object),F.hidden=!1),y(),E(I.id),N&&N.result!==k&&((U=c.get(N.artifact.id))==null?void 0:U.result)!==N.result&&Qa(N.result);const V=Object.keys(I.views||{}),K=O&&((X=I.views)!=null&&X[O])?O:V[0];return n.setView(((z=I.views)==null?void 0:z[K])||{}),r==null||r(I,K),h}return{show:L,renderList:M,get current(){return h},get requested(){return g},get quality(){return p},timings:d,setView(R){var A;const O=h==null?void 0:h.artifact;(A=O==null?void 0:O.views)!=null&&A[R]&&n.setView(O.views[R])},setLabelOpen:b,get labelOpen(){return _},set onLayout(R){m=R},setQuality(R){p=R;for(const[O,A]of c)A.result&&A.result!==(h==null?void 0:h.result)&&Qa(A.result),c.delete(O)}}}function Qa(n){var e;if(!n||n.disposed)return;n.disposed=!0;const t=new Set(Object.values(n.panels||{}));n.object.traverse(i=>{var o,a,r;if(!i.isMesh&&!i.isLine&&!i.isPoints)return;(o=i.geometry)==null||o.dispose();const s=Array.isArray(i.material)?i.material:[i.material];for(const l of s)if(l){l.relief&&t.add(l.relief);for(const c of["map","normalMap","roughnessMap","metalnessMap","aoMap","bumpMap","displacementMap","emissiveMap"])(r=(a=l[c])==null?void 0:a.dispose)==null||r.call(a);l.dispose()}});for(const i of t)(e=i==null?void 0:i.dispose)==null||e.call(i)}const $b=""+new URL("detail-frieze-bottom-centre-B0wXWedd.jpg",import.meta.url).href,Kb=""+new URL("detail-frieze-top-centre-DTP8pGr8.jpg",import.meta.url).href,Zb=""+new URL("detail-handle-front-BuWrTtle.jpg",import.meta.url).href,Jb=""+new URL("detail-handle-roots-D9Zsh3ou.jpg",import.meta.url).href,Qb=""+new URL("detail-handle-BcCO0NS_.jpg",import.meta.url).href,tw=""+new URL("detail-leg-b-CIUEqyks.jpg",import.meta.url).href,ew=""+new URL("detail-leg-c-Cmd1UVyM.jpg",import.meta.url).href,nw=""+new URL("detail-leg-d-gUaqHbhL.jpg",import.meta.url).href,iw=""+new URL("detail-leg-CuxR3i4M.jpg",import.meta.url).href,sw=""+new URL("detail-short-wall-CFJCrCOX.jpg",import.meta.url).href,ow=""+new URL("face-long-bottom-frieze-BwvqP2ZZ.jpg",import.meta.url).href,rw=""+new URL("face-long-column-CgZmo0-N.jpg",import.meta.url).href,aw=""+new URL("face-long-top-frieze-RHrxpQUK.jpg",import.meta.url).href,lw=""+new URL("face-long-CJPfl1Qq.jpg",import.meta.url).href,cw=""+new URL("face-rubbing-long-DabtWI9P.jpg",import.meta.url).href,hw=""+new URL("face-short-DQ7GEcii.jpg",import.meta.url).href,uw=""+new URL("front-CitwosNZ.jpg",import.meta.url).href,fw=""+new URL("side-low-CmX23HbI.jpg",import.meta.url).href,dw=""+new URL("side-ObckiVDM.jpg",import.meta.url).href,pw=""+new URL("three-quarter-left-low-BviVl0eT.jpg",import.meta.url).href,mw=""+new URL("three-quarter-right-b-Cwu1h8HP.jpg",import.meta.url).href,gw=""+new URL("three-quarter-right-d97FAjgy.jpg",import.meta.url).href,_w=""+new URL("three-quarter-A9i1SPi4.jpg",import.meta.url).href,Mw=""+new URL("detail-face-short-gaCmK_qK.jpg",import.meta.url).href,vw=""+new URL("detail-flange-centre-C9okRFus.jpg",import.meta.url).href,xw=""+new URL("detail-flange-corner-BtFxBxX9.jpg",import.meta.url).href,yw=""+new URL("detail-frieze-long-DSBwyu2A.jpg",import.meta.url).href,bw=""+new URL("detail-handle-TlBf82JQ.jpg",import.meta.url).href,ww=""+new URL("detail-leg-BMHJAwuS.jpg",import.meta.url).href,Sw=""+new URL("detail-mask-long-Wx7XwQ6o.jpg",import.meta.url).href,Ew=""+new URL("face-long-frieze-WkF2UQil.jpg",import.meta.url).href,Tw=""+new URL("face-long-main-Du3SluEt.jpg",import.meta.url).href,Aw=""+new URL("face-long-C_qdfl1E.jpg",import.meta.url).href,Rw=""+new URL("face-short-main-D6pwYpPT.jpg",import.meta.url).href,Pw=""+new URL("face-short-Wp_YnBPL.jpg",import.meta.url).href,Lw=""+new URL("front-Bbc7Fx-O.jpg",import.meta.url).href,Cw=""+new URL("side-C-4S0EIZ.jpg",import.meta.url).href,Dw=""+new URL("three-quarter-B9hAArMG.jpg",import.meta.url).href,Iw=""+new URL("detail-face-long-BAD2txtd.jpg",import.meta.url).href,kw=""+new URL("detail-face-short-D_HEsXeg.jpg",import.meta.url).href,Uw=""+new URL("detail-flanges-Dnmd43RN.jpg",import.meta.url).href,Nw=""+new URL("detail-foot-long-WaOhdBNC.jpg",import.meta.url).href,Fw=""+new URL("detail-foot-short--wLT1VKJ.jpg",import.meta.url).href,Ow=""+new URL("detail-frieze-long-BmLSRg_-.jpg",import.meta.url).href,zw=""+new URL("detail-frieze-short-B_6JotH8.jpg",import.meta.url).href,Bw=""+new URL("detail-knob-CYmBp5d_.jpg",import.meta.url).href,Gw=""+new URL("detail-lid-end-yPIYmy6i.jpg",import.meta.url).href,Hw=""+new URL("detail-lid-long-CEYrDkRW.jpg",import.meta.url).href,Vw=""+new URL("face-end-aS0B8k4G.jpg",import.meta.url).href,Ww=""+new URL("face-lid-end-n9Nah1yf.jpg",import.meta.url).href,jw=""+new URL("face-lid-long-Cu8ndTwk.jpg",import.meta.url).href,qw=""+new URL("face-long-foot-BEHQ9msq.jpg",import.meta.url).href,Xw=""+new URL("face-long-frieze-y5zXE_qZ.jpg",import.meta.url).href,Yw=""+new URL("face-long-main-Cb5CzBbC.jpg",import.meta.url).href,$w=""+new URL("face-long-BUuFU4tc.jpg",import.meta.url).href,Kw=""+new URL("side-RGqLPIbj.jpg",import.meta.url).href,Zw=""+new URL("three-quarter-BsVisZv3.jpg",import.meta.url).href,Jw=""+new URL("detail-blade-DHv8hS9R.jpg",import.meta.url).href,Qw=""+new URL("detail-collar-J8ixw7q2.jpg",import.meta.url).href,tS=""+new URL("detail-flange-ladder-BQustu1H.jpg",import.meta.url).href,eS=""+new URL("detail-foot-front-C1eWMavt.jpg",import.meta.url).href,nS=""+new URL("detail-foot-halfmask-e5l_VeAG.jpg",import.meta.url).href,iS=""+new URL("detail-foot-ring-DZA52jf0.jpg",import.meta.url).href,sS=""+new URL("detail-foot-seam-xGFwv8jl.jpg",import.meta.url).href,oS=""+new URL("detail-neck-band-b-BNWoeBXt.jpg",import.meta.url).href,rS=""+new URL("detail-neck-band-DlPk7Z8p.jpg",import.meta.url).href,aS=""+new URL("detail-rim-lip-B41YkLS9.jpg",import.meta.url).href,lS=""+new URL("detail-waist-b-KjqSyoF5.jpg",import.meta.url).href,cS=""+new URL("detail-waist-DYYQLm4z.jpg",import.meta.url).href,hS=""+new URL("side-left-PE-NSFwu.jpg",import.meta.url).href,uS=""+new URL("side-1R7nNys7.jpg",import.meta.url).href,fS=""+new URL("back-DIPfeyw-.jpg",import.meta.url).href,dS=""+new URL("detail-foot-band-F7itUupf.jpg",import.meta.url).href,pS=""+new URL("detail-handle-end-D4XamGnv.jpg",import.meta.url).href,mS=""+new URL("detail-handle-Bs8HL3tz.jpg",import.meta.url).href,gS=""+new URL("detail-mask-DQCo5yK1.jpg",import.meta.url).href,_S=""+new URL("detail-neck-band-Bl1WAayS.jpg",import.meta.url).href,MS=""+new URL("face-foot-DPuE3lqz.jpg",import.meta.url).href,vS=""+new URL("face-front-DEkYJSMC.jpg",import.meta.url).href,xS=""+new URL("face-mask-0-IQibD7.jpg",import.meta.url).href,yS=""+new URL("face-neck-BGr3XoBL.jpg",import.meta.url).href,bS=""+new URL("front-CalSH-or.jpg",import.meta.url).href,wS=""+new URL("side-b-CMzafB5T.jpg",import.meta.url).href,SS=""+new URL("side-D1RqdUaI.jpg",import.meta.url).href,ES=""+new URL("top-KW9dWpHx.jpg",import.meta.url).href,TS=""+new URL("detail-belly-half-CNSwmJqN.jpg",import.meta.url).href,AS=""+new URL("detail-belly-mask-7xtgS9h0.jpg",import.meta.url).href,RS=""+new URL("detail-belly-seam-BiTeU3Gb.jpg",import.meta.url).href,PS=""+new URL("detail-foot-front-DrMTvYHr.jpg",import.meta.url).href,LS=""+new URL("detail-foot-mask-Cm9IINmD.jpg",import.meta.url).href,CS=""+new URL("detail-foot-seam-D722EZxX.jpg",import.meta.url).href,DS=""+new URL("detail-neck-blades-JThLxAGu.jpg",import.meta.url).href,IS=""+new URL("detail-neck-seam-CIg4wbu4.jpg",import.meta.url).href,kS=""+new URL("detail-shoulder-head-By0YPWRo.jpg",import.meta.url).href,US=""+new URL("detail-shoulder-seam-DEFSDui9.jpg",import.meta.url).href,NS=""+new URL("detail-waist-CDdJHb7b.jpg",import.meta.url).href,FS=""+new URL("front-BND45tEH.jpg",import.meta.url).href,OS=""+new URL("three-quarter-B2_zFfuz.jpg",import.meta.url).href,zS=""+new URL("face-belly-Bs5M5JiX.jpg",import.meta.url).href,BS=""+new URL("face-foot-frieze-Dn2E6-07.jpg",import.meta.url).href,GS=""+new URL("face-lid-broad-Di3RdxE6.jpg",import.meta.url).href,HS=""+new URL("face-neck-frieze-DXwoalNG.jpg",import.meta.url).href,VS=""+new URL("three-quarter-t_ktZRpa.jpg",import.meta.url).href,WS=Object.assign({"../../reference/houmuwu-ding/detail-frieze-bottom-centre.jpg":$b,"../../reference/houmuwu-ding/detail-frieze-top-centre.jpg":Kb,"../../reference/houmuwu-ding/detail-handle-front.jpg":Zb,"../../reference/houmuwu-ding/detail-handle-roots.jpg":Jb,"../../reference/houmuwu-ding/detail-handle.jpg":Qb,"../../reference/houmuwu-ding/detail-leg-b.jpg":tw,"../../reference/houmuwu-ding/detail-leg-c.jpg":ew,"../../reference/houmuwu-ding/detail-leg-d.jpg":nw,"../../reference/houmuwu-ding/detail-leg.jpg":iw,"../../reference/houmuwu-ding/detail-short-wall.jpg":sw,"../../reference/houmuwu-ding/faces/face-long-bottom-frieze.jpg":ow,"../../reference/houmuwu-ding/faces/face-long-column.jpg":rw,"../../reference/houmuwu-ding/faces/face-long-top-frieze.jpg":aw,"../../reference/houmuwu-ding/faces/face-long.jpg":lw,"../../reference/houmuwu-ding/faces/face-rubbing-long.jpg":cw,"../../reference/houmuwu-ding/faces/face-short.jpg":hw,"../../reference/houmuwu-ding/front.jpg":uw,"../../reference/houmuwu-ding/side-low.jpg":fw,"../../reference/houmuwu-ding/side.jpg":dw,"../../reference/houmuwu-ding/three-quarter-left-low.jpg":pw,"../../reference/houmuwu-ding/three-quarter-right-b.jpg":mw,"../../reference/houmuwu-ding/three-quarter-right.jpg":gw,"../../reference/houmuwu-ding/three-quarter.jpg":_w,"../../reference/met-fangding/detail-face-short.jpg":Mw,"../../reference/met-fangding/detail-flange-centre.jpg":vw,"../../reference/met-fangding/detail-flange-corner.jpg":xw,"../../reference/met-fangding/detail-frieze-long.jpg":yw,"../../reference/met-fangding/detail-handle.jpg":bw,"../../reference/met-fangding/detail-leg.jpg":ww,"../../reference/met-fangding/detail-mask-long.jpg":Sw,"../../reference/met-fangding/faces/face-long-frieze.jpg":Ew,"../../reference/met-fangding/faces/face-long-main.jpg":Tw,"../../reference/met-fangding/faces/face-long.jpg":Aw,"../../reference/met-fangding/faces/face-short-main.jpg":Rw,"../../reference/met-fangding/faces/face-short.jpg":Pw,"../../reference/met-fangding/front.jpg":Lw,"../../reference/met-fangding/side.jpg":Cw,"../../reference/met-fangding/three-quarter.jpg":Dw,"../../reference/met-fangyi/detail-face-long.jpg":Iw,"../../reference/met-fangyi/detail-face-short.jpg":kw,"../../reference/met-fangyi/detail-flanges.jpg":Uw,"../../reference/met-fangyi/detail-foot-long.jpg":Nw,"../../reference/met-fangyi/detail-foot-short.jpg":Fw,"../../reference/met-fangyi/detail-frieze-long.jpg":Ow,"../../reference/met-fangyi/detail-frieze-short.jpg":zw,"../../reference/met-fangyi/detail-knob.jpg":Bw,"../../reference/met-fangyi/detail-lid-end.jpg":Gw,"../../reference/met-fangyi/detail-lid-long.jpg":Hw,"../../reference/met-fangyi/faces/face-end.jpg":Vw,"../../reference/met-fangyi/faces/face-lid-end.jpg":Ww,"../../reference/met-fangyi/faces/face-lid-long.jpg":jw,"../../reference/met-fangyi/faces/face-long-foot.jpg":qw,"../../reference/met-fangyi/faces/face-long-frieze.jpg":Xw,"../../reference/met-fangyi/faces/face-long-main.jpg":Yw,"../../reference/met-fangyi/faces/face-long.jpg":$w,"../../reference/met-fangyi/side.jpg":Kw,"../../reference/met-fangyi/three-quarter.jpg":Zw,"../../reference/met-gu/detail-blade.jpg":Jw,"../../reference/met-gu/detail-collar.jpg":Qw,"../../reference/met-gu/detail-flange-ladder.jpg":tS,"../../reference/met-gu/detail-foot-front.jpg":eS,"../../reference/met-gu/detail-foot-halfmask.jpg":nS,"../../reference/met-gu/detail-foot-ring.jpg":iS,"../../reference/met-gu/detail-foot-seam.jpg":sS,"../../reference/met-gu/detail-neck-band-b.jpg":oS,"../../reference/met-gu/detail-neck-band.jpg":rS,"../../reference/met-gu/detail-rim-lip.jpg":aS,"../../reference/met-gu/detail-waist-b.jpg":lS,"../../reference/met-gu/detail-waist.jpg":cS,"../../reference/met-gu/side-left.jpg":hS,"../../reference/met-gu/side.jpg":uS,"../../reference/met-gui/back.jpg":fS,"../../reference/met-gui/detail-foot-band.jpg":dS,"../../reference/met-gui/detail-handle-end.jpg":pS,"../../reference/met-gui/detail-handle.jpg":mS,"../../reference/met-gui/detail-mask.jpg":gS,"../../reference/met-gui/detail-neck-band.jpg":_S,"../../reference/met-gui/faces/face-foot.jpg":MS,"../../reference/met-gui/faces/face-front.jpg":vS,"../../reference/met-gui/faces/face-mask.jpg":xS,"../../reference/met-gui/faces/face-neck.jpg":yS,"../../reference/met-gui/front.jpg":bS,"../../reference/met-gui/side-b.jpg":wS,"../../reference/met-gui/side.jpg":SS,"../../reference/met-gui/top.jpg":ES,"../../reference/met-zun/detail-belly-half.jpg":TS,"../../reference/met-zun/detail-belly-mask.jpg":AS,"../../reference/met-zun/detail-belly-seam.jpg":RS,"../../reference/met-zun/detail-foot-front.jpg":PS,"../../reference/met-zun/detail-foot-mask.jpg":LS,"../../reference/met-zun/detail-foot-seam.jpg":CS,"../../reference/met-zun/detail-neck-blades.jpg":DS,"../../reference/met-zun/detail-neck-seam.jpg":IS,"../../reference/met-zun/detail-shoulder-head.jpg":kS,"../../reference/met-zun/detail-shoulder-seam.jpg":US,"../../reference/met-zun/detail-waist.jpg":NS,"../../reference/met-zun/front.jpg":FS,"../../reference/met-zun/three-quarter.jpg":OS,"../../reference/nezu-fangyi/faces/face-belly.jpg":zS,"../../reference/nezu-fangyi/faces/face-foot-frieze.jpg":BS,"../../reference/nezu-fangyi/faces/face-lid-broad.jpg":GS,"../../reference/nezu-fangyi/faces/face-neck-frieze.jpg":HS,"../../reference/nezu-fangyi/three-quarter.jpg":VS}),jS={"houmuwu-ding/detail-frieze-bottom-centre.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-frieze-top-centre.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle-front.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle-roots.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-handle.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-b.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-c.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg-d.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-leg.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/detail-short-wall.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/faces/face-long-bottom-frieze.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-long-column.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-long-top-frieze.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-long.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-rubbing-long.jpg":"Rubbing, anonymous. Commons cites the Shanghai Museum (shanghaimuseum.net, article CI00159337) as its source. · Public domain (per Commons) · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/faces/face-short.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons · flattened to a head-on face","houmuwu-ding/front.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons","houmuwu-ding/side-low.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/side.jpg":"Gary Todd from Xinzheng, China (via Flickr) · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-left-low.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-right-b.jpg":"Gary Todd from Xinzheng, China · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter-right.jpg":"Gary Todd · CC0 1.0 · Wikimedia Commons","houmuwu-ding/three-quarter.jpg":"Mlogic / Wikimedia Commons, CC BY-SA 3.0","met-fangding/detail-face-short.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-flange-centre.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-flange-corner.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-frieze-long.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-handle.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-leg.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/detail-mask-long.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/faces/face-long-frieze.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-long-main.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-long.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-short-main.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/faces/face-short.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0). · flattened to a head-on face","met-fangding/front.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/side.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangding/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Bequest of Addie W. Kahn, 1949 (acc. 49.135.2). Public domain (CC0 1.0).","met-fangyi/detail-face-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-face-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-flanges.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-foot-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-foot-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-frieze-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-frieze-short.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-knob.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-lid-end.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/detail-lid-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/faces/face-end.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-lid-end.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-lid-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long-foot.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long-frieze.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long-main.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/faces/face-long.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0). · flattened to a head-on face","met-fangyi/side.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-fangyi/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Purchase, Arthur M. Sackler Gift, 1974 (acc. 1974.268.2a, b). Public domain (CC0 1.0).","met-gu/detail-blade.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-collar.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-flange-ladder.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-front.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-halfmask.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-ring.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-foot-seam.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-neck-band-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-neck-band.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-rim-lip.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-waist-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/detail-waist.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/side-left.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gu/side.jpg":"The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985 (acc. 1985.214.4). Public domain (CC0 1.0).","met-gui/back.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-foot-band.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-handle-end.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-handle.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-mask.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/detail-neck-band.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/faces/face-foot.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/faces/face-front.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/faces/face-mask.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/faces/face-neck.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0). · flattened to a head-on face","met-gui/front.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/side-b.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/side.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-gui/top.jpg":"The Metropolitan Museum of Art, New York. Gift of Count and Countess Bernard d'Escayrac, 1962 (acc. 62.217). Public domain (CC0 1.0).","met-zun/detail-belly-half.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-belly-mask.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-belly-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-front.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-mask.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-foot-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-neck-blades.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-neck-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-shoulder-head.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-shoulder-seam.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/detail-waist.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/front.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","met-zun/three-quarter.jpg":"The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).","nezu-fangyi/faces/face-belly.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/faces/face-foot-frieze.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/faces/face-lid-broad.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/faces/face-neck-frieze.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project · flattened to a head-on face","nezu-fangyi/three-quarter.jpg":"photograph by the project owner, Nezu Museum, 2026 · owner's own photograph, used with permission for this project"},qS=(n,t)=>{const e=WS[`../../reference/${n}/${t}`];return e?()=>Promise.resolve(e):null},XS=(n,t)=>jS[`${n}/${t}`]||"",tl=(n,t)=>/^detail/.test(n)||((t==null?void 0:t.fit)??1)<.6||!!(t!=null&&t.face),el=n=>n.replace(/^detail-/,"").replace(/^face-/,"flat ").replace(/-/g," ");function YS({chipsEl:n,detailEl:t,detailToggle:e,compareToggle:i,figure:s,onView:o,onLayout:a}){let r=null,l=null,c=!1,h=!1,u=0;const f=s.querySelector("img"),d=s.querySelector("figcaption");function _(M,x){return Nt("button",{type:"button",class:"view"+(x.ref?" has-ref":""),"data-view":M,"aria-pressed":String(M===l),title:x.ref?"Has a reference photograph":null,text:el(M),onclick:()=>o(M)})}function g(){const M=Object.entries((r==null?void 0:r.views)||{}),x=M.filter(([w,b])=>!tl(w,b)),y=M.filter(([w,b])=>tl(w,b));n.replaceChildren(...x.map(([w,b])=>_(w,b))),t.replaceChildren(...y.map(([w,b])=>_(w,b))),y.some(([w])=>w===l)&&(c=!0),e.hidden=!y.length,e.querySelector(".n").textContent=y.length?String(y.length):"",p(),v()}function p(){t.hidden=!c||!t.childElementCount,e.setAttribute("aria-expanded",String(c&&!t.hidden))}e.addEventListener("click",()=>{c=!c,p(),a()}),i.addEventListener("click",()=>{i.getAttribute("aria-disabled")!=="true"&&(h=!h,v(),a())});function m(){var M,x;return((x=(M=r==null?void 0:r.views)==null?void 0:M[l])==null?void 0:x.ref)||null}function v(){const M=m(),x=M?qS(r.id,M):null;i.setAttribute("aria-disabled",String(!x)),i.setAttribute("aria-pressed",String(h&&!!x)),i.title=x?"Show the reference photograph beside the render":"No reference photograph for this view";const y=h&&!!x;if(s.hidden=!y,document.documentElement.classList.toggle("comparing",y),!y)return;const w=++u;s.classList.add("loading"),d.replaceChildren(Nt("span",{class:"cap",text:"Reference photograph · "+el(l)}),Nt("span",{class:"credit",text:XS(r.id,M)})),x().then(b=>{w===u&&(f.onload=()=>w===u&&s.classList.remove("loading"),f.onerror=()=>{w===u&&(s.classList.remove("loading"),d.prepend(Nt("span",{class:"fine",text:"The photograph could not be loaded."})))},f.alt=`Reference photograph: ${r.title}, ${el(l)}`,f.src=b)})}return{setArtifact(M,x){r=M,l=x,c=!1,g()},setView(M){var x;l=M;for(const y of[...n.children,...t.children])y.setAttribute("aria-pressed",String(y.dataset.view===M));tl(M,(x=r==null?void 0:r.views)==null?void 0:x[M])&&!c&&(c=!0,p()),v()},get comparing(){return h&&!s.hidden},setCompare(M){h=!!M,v()}}}const $S=`
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
`;function KS({body:n,stateLabel:t,onChange:e,onMode:i,onView:s}){document.getElementById("patina-drawer-css")||document.head.append(Nt("style",{id:"patina-drawer-css",text:$S}));const o={};let a=null;const r=(T,L)=>(o[T]||(o[T]=[])).push(L),l=ii.age,c=yu({label:l.label,min:l.min,max:l.max,step:l.step,value:ao().age,cls:"master-ctl",onInput:T=>w({age:T})});r("age",c);const h=Nt("div",{class:"group master"},c.el,Nt("div",{class:"ends"},Nt("span",{text:"out of the mould · 1200 BC"}),Nt("span",{text:"out of the ground · 1939"}))),u=Nt("div",{class:"group"},Nt("span",{class:"cap",text:"Presets"})),f=Object.fromEntries(Object.entries(hd||{}).map(([T,L])=>[T,L.filter(R=>Ls[R])])),d=new Set(Object.values(f).flat()),_=Object.keys(Ls).filter(T=>!d.has(T));_.length&&(f.Looks=[...f.Looks||[],..._]);const g=[];for(const[T,L]of Object.entries(f)){if(!L.length)continue;const R=Za(Nt("div"),L.map(O=>({id:O,label:O.replace(/-/g," ")})),{onPick:O=>E(O)});g.push(R),u.append(Nt("div",{class:"patina-sub"},Nt("span",{class:"cap",text:T}),R.el))}const p=Nt("div",{class:"group"},Nt("span",{class:"cap",text:"View"})),m=Za(Nt("div"),["beauty","clay","height","mask"].map(T=>({id:T})),{value:"beauty",seg:!0,onPick:T=>i(T)}),v=Nt("div",{class:"chips",style:"margin-top:8px"});p.append(m.el,v);const M=(T,L)=>{const R=ao()[T],O=L.type==="color"?Gb({label:L.label,value:R,onInput:A=>w({[T]:A})}):yu({label:L.label,min:L.min,max:L.max,step:L.step,unit:L.unit,value:R,onInput:A=>w({[T]:A})});return L.hint&&(O.el.title=L.hint),r(T,O),O.el},x=Nt("div",{class:"group"},Nt("span",{class:"cap",text:"Main"})),y={};for(const[T,L]of Object.entries(ii)){if(L.group==="master")continue;if(L.key&&x.append(M(T,L)),!y[L.group]){const O=Nt("span",{class:"n"}),A=Nt("div",{class:"body"});y[L.group]={el:Nt("details",{class:"patina-fold"},Nt("summary",{},Nt("span",{class:"cap",text:L.group}),O),A),n:O,b:A,count:0}}const R=y[L.group];R.b.append(M(T,L)),R.n.textContent=++R.count+""}n.replaceChildren(h,u,p,x,...Object.values(y).map(T=>T.el));function w(T){kr(T),"age"in T&&Object.keys(T).length===1||D(null);const L=ao();for(const R of Object.keys(T))for(const O of o[R]||[])O.set(L[R]);e==null||e()}function b(){const T=ao();for(const[L,R]of Object.entries(o))for(const O of R)O.set(T[L])}function D(T){a=T;for(const L of g)L.set(T);t.textContent=T?T.replace(/-/g," "):"custom"}function E(T){const L=Ls[T];if(!L)return;const R=Object.fromEntries(Object.entries(ii).map(([O,A])=>[O,A.default]));kr({...R,...L}),b(),D(T),e==null||e()}return{applyPreset:E,refresh:b,get preset(){return a},setMode:T=>m.set(T),setViews(T,L){if(v.replaceChildren(),!T.length)return;const R=Za(v,T.map(O=>({id:O,label:O.replace(/-/g," ")})),{value:L,onPick:O=>s(O)});this._views=R},setView(T){var L;(L=this._views)==null||L.set(T)}}}function ZS(n=window.innerWidth,t=window.innerHeight){return t<=520&&n>t?"land":n<960?"phone":"desk"}function Eu(){const n=ZS();return document.documentElement.dataset.layout=n,n}const JS=[{q:.5,label:"Light"},{q:1,label:"Standard"},{q:1.5,label:"Fine",desk:!0}],ne=n=>document.getElementById(n);async function QS(){var ut;const n=Fb(),t=document.documentElement;t.dataset.ready="0",n.ui||t.classList.add("ui-off");let e=Eu();const i=ne("gl"),s=()=>{ne("fallback").hidden=!1,t.dataset.ready="error"};let o=null;try{o=i.getContext("webgl2")}catch{o=null}if(!o)return s();const a=i.cloneNode();i.replaceWith(a);let r;try{r=new kb(a,{deterministic:!n.ui,pixelRatio:n.dpr})}catch(S){return console.warn(S),s()}a.addEventListener("webglcontextlost",S=>{S.preventDefault(),ne("glmsg").hidden=!1}),a.addEventListener("webglcontextrestored",()=>{r.restoreContext(),ne("glmsg").hidden=!0});const l=r.renderer.capabilities.maxTextureSize||4096;bo.maxSizeCap=Math.min(l,n.compact?2048:8192),yo.anisotropy=Math.min(n.compact?4:8,r.renderer.capabilities.getMaxAnisotropy());const c=Bb(),h=n.a||(n.route&&n.route!=="atlas"?n.route:null),u=h&&c.has(h)?h:null;let f=n.tab,d=null;const _=ne("progress"),g={start(S){_.classList.add("on"),_.querySelector("i").style.width="2%",_.querySelector("span").textContent="casting "+S},set(S,P){_.querySelector("i").style.width=Math.round(Math.max(2,S*100))+"%",P&&(_.querySelector("span").textContent=P)},done(){_.querySelector("i").style.width="100%",_.querySelector("span").textContent="",setTimeout(()=>_.classList.remove("on"),250)}},p=ne("drawer"),m=KS({body:ne("drawer-body"),stateLabel:ne("drawer-preset"),onChange:()=>r.dirty=!0,onMode:S=>y(S),onView:S=>A(S)});n.patina&&Ls[n.patina]&&m.applyPreset(n.patina);const v=ne("drawer-toggle"),M=S=>{p.classList.toggle("open",S),t.classList.toggle("drawer-open",S),v.setAttribute("aria-expanded",String(S)),S&&L(!1),j(330)};{const S=e==="desk"&&window.innerWidth>=1200;p.classList.toggle("open",S),t.classList.toggle("drawer-open",S),v.setAttribute("aria-expanded",String(S))}v.addEventListener("click",()=>M(!p.classList.contains("open")));const x=S=>{console.error(S),t.dataset.ready="error"};function y(S){r.setMode(S),m.setMode(S)}y(n.mode);const w=ne("column"),b=ne("dock"),D=ne("vessel-nav"),E=ne("label"),T=ne("nav-open");function L(S){var P,Q;t.classList.toggle("nav-open",S),T.setAttribute("aria-expanded",String(S)),S&&e!=="desk"&&M(!1),S&&((Q=(P=D.querySelector("[aria-current]"))==null?void 0:P.focus)==null||Q.call(P,{preventScroll:!0}))}T.addEventListener("click",()=>L(!t.classList.contains("nav-open"))),ne("nav-close").addEventListener("click",()=>L(!1)),document.addEventListener("keydown",S=>{S.key==="Escape"&&t.classList.contains("nav-open")&&L(!1)});const R=Yb({stage:r,catalog:c,quality:n.q,cacheMax:n.compact?1:2,progress:g,listEl:ne("vessel-list"),labelEl:E,onPick:S=>{L(!1),(f!=="vessels"?Y("vessels",{user:!0,want:S}):z(S,{user:!0})).catch(x)},onShown:(S,P)=>{d=P,O.setArtifact(S,P),m.setViews([]),n.patina||m.applyPreset(S.defaultPatina&&Ls[S.defaultPatina]?S.defaultPatina:"excavated-green"),r.setAutoRotate(n.ui)}});R.onLayout=()=>j(0);const O=YS({chipsEl:ne("view-chips"),detailEl:ne("detail-chips"),detailToggle:ne("details-toggle"),compareToggle:ne("compare-toggle"),figure:ne("compare"),onView:S=>A(S),onLayout:()=>{O.comparing&&e==="desk"&&window.innerWidth<1500&&p.classList.contains("open")&&M(!1),at({refit:!0})}});function A(S){var Q,ft;const P=(Q=R.current)==null?void 0:Q.artifact;(ft=P==null?void 0:P.views)!=null&&ft[S]&&(d=S,R.setView(S),O.setView(S),r.setAutoRotate(!1),at({refit:!1}))}const I=ne("quality").querySelector(".qseg");function C(){I.replaceChildren(...JS.filter(S=>!S.desk||!n.compact||R.quality===S.q).map(S=>Nt("button",{type:"button","aria-pressed":String(Math.abs(R.quality-S.q)<.001),text:S.label,onclick:()=>k(S.q)})))}async function k(S){var Q;if(Math.abs(S-R.quality)<.001)return;Dd.set(Id,S),R.setQuality(S),C(),N&&N.setQuality(S);const P=(Q=R.current)==null?void 0:Q.artifact.id;f==="vessels"&&P&&await z(P,{view:d})}C();let N=null,F=null;function V(){return F??(F=Kn(async()=>{const{createAtlas:S}=await import("./atlas-CzNsuXe_.js");return{createAtlas:S}},[],import.meta.url).then(({createAtlas:S})=>(N=S({stage:r,quality:R.quality,progress:g,onBuilt:()=>f==="atlas"&&U(),dom:{picker:ne("motif-picker"),presets:ne("motif-presets"),viewToggle:ne("atlas-view"),params:ne("motif-params"),stats:ne("atlas-stats"),heightmap:ne("heightmap")}}),N))),F}let K=null,Z=0;async function U(){const S=Z;await r.frame(),S===Z&&!X&&K.markReady()}let X=0;async function z(S,{view:P,user:Q}={}){Q&&J(S);const ft=++Z;X++;let rt;try{rt=await R.show(S,{view:P})}finally{X--}return!rt||ft!==Z||(at({refit:!0}),await U()),rt}async function Y(S,{user:P,want:Q}={}){var rt;f=S,document.body.dataset.tab=S;for(const dt of document.querySelectorAll(".tabs button"))dt.setAttribute("aria-selected",String(dt.dataset.tab===S));P&&J(S==="atlas"?"atlas":Q||((rt=R.current)==null?void 0:rt.artifact.id)),L(!1),at({refit:!1}),t.dataset.ready="0";const ft=++Z;if(S==="atlas"){const dt=await V();if(f!=="atlas")return;X++;try{await dt.activate()}finally{X--}m.setViews([]),at({refit:!1}),ft===Z&&await U()}else{N==null||N.deactivate();const dt=R.current;dt&&(!Q||Q===dt.artifact.id)?(r.setContent(dt.result.object,{rig:"vitrine"}),at({refit:!0}),r.setAutoRotate(n.ui),await U()):await z(Q||await wt())}}for(const S of document.querySelectorAll(".tabs button"))S.addEventListener("click",()=>S.dataset.tab!==f&&Y(S.dataset.tab,{user:!0}));function J(S){if(!(!n.ui||!S||Nl()===S))try{history.replaceState(history.state,"","#"+S)}catch{try{location.hash=S}catch{}}}window.addEventListener("hashchange",()=>{var P;const S=Nl();S&&(S==="atlas"?f!=="atlas"&&Y("atlas").catch(x):c.has(S)&&(f!=="vessels"?Y("vessels",{want:S}).catch(x):R.requested!==S&&((P=R.current)==null?void 0:P.artifact.id)!==S&&z(S).catch(x)))});let et=null;function it(){const S=p.classList.contains("open");return e==="phone"?S?p.offsetHeight:v.offsetHeight:S?p.offsetWidth:v.offsetWidth||44}function at({refit:S=!1}={}){const P=window.innerWidth,Q=window.innerHeight,ft=ne("compare");if(!n.ui){r.setInsets({});return}const rt=yt=>yt.getBoundingClientRect(),dt=rt(ne("masthead"));let Mt={left:0,right:0,top:0,bottom:0};if(f==="atlas"){const yt=rt(ne("atlas-top")),St=rt(ne("atlas-controls"));e==="phone"?Mt={top:yt.bottom+6,bottom:Math.max(Q-St.top,it())+6}:Mt={left:St.right+16,right:it()+8,top:yt.bottom+8,bottom:16}}else e==="phone"?Mt={top:dt.bottom+4,bottom:Math.max(Q-rt(b).top,it())+4}:e==="land"?Mt={left:rt(b).right+12,right:it()+8,top:8,bottom:8}:Mt={left:rt(w).right+16,right:it()+8,top:dt.bottom+6,bottom:Q-rt(b).top+6};if(Mt={left:0,right:0,top:0,bottom:0,...Mt},f==="vessels"&&O.comparing){const yt=P-Mt.left-Mt.right,St=Q-Mt.top-Mt.bottom,ht=10;let At;St>yt*1.05?(At={left:Mt.left+8,top:Mt.top,width:yt-16,height:St*.5-ht},Mt.top+=St*.5):(At={left:Mt.left,top:Mt.top,width:yt*.5-ht,height:St},Mt.left+=yt*.5),Object.assign(ft.style,{left:At.left+"px",top:At.top+"px",width:At.width+"px",height:At.height+"px"})}Mt={left:0,right:0,top:0,bottom:0,...Mt},r.setInsets(Mt);const bt={w:P-Mt.left-Mt.right,h:Q-Mt.top-Mt.bottom},xt=!et||Math.abs(bt.w/et.w-1)>.15||Math.abs(bt.h/et.h-1)>.15;et=bt,(S||xt)&&_t()}function _t(){f==="atlas"?N==null||N.frame():R.current&&R.setView(d)}let W=null;function j(S=0){clearTimeout(W),W=setTimeout(()=>requestAnimationFrame(()=>at()),S)}function $(){e==="desk"?E.parentNode!==w&&w.append(E):E.parentNode!==b&&b.append(E)}$();const st=()=>{const S=e;e=Eu(),e!==S&&($(),L(!1),e==="desk"&&!p.classList.contains("open")&&S!=="desk"&&window.innerWidth>=1200&&M(!0),e!=="desk"&&p.classList.contains("open")&&M(!1),C()),j(60)};window.addEventListener("resize",st),window.addEventListener("orientationchange",()=>setTimeout(st,200)),(ut=window.visualViewport)==null||ut.addEventListener("resize",()=>j(120));const ot=()=>f==="atlas"?(N==null?void 0:N.plaque)&&{object:N.plaque.group,id:"atlas"}:R.current&&{object:R.current.result.object,id:R.current.artifact.id};K=qb({artifacts:c.ids,motifs:Object.keys(Bs),motifPresets:S=>{var P;return Object.keys(((P=Bs[S])==null?void 0:P.presets)||{})},views:async S=>{var P;return Object.keys(((P=await c.load(S))==null?void 0:P.views)||{})},viewRefs:async S=>{var P;return Object.fromEntries(Object.entries(((P=await c.load(S))==null?void 0:P.views)||{}).filter(([,Q])=>Q.ref).map(([Q,ft])=>[Q,ft.ref]))},catalog:()=>c.loadAll().then(S=>S.map(P=>({id:P.id,title:P.title,order:P.order??0}))),metrics:()=>{const S=ot();return S?{id:S.id,...Vb(S.object),mesh:kd(S.object),buildMs:R.timings[S.id]}:null},timings:R.timings,kit:Cd,stage:r,frame:()=>r.frame(),async show(S,P){f!=="vessels"&&await Y("vessels",{want:S}),await z(S,{view:P}),await r.frame()},async setView(S){A(S),await r.frame()},async setMode(S){y(S),await r.frame()},async setPatina(S){typeof S=="string"?m.applyPreset(S):kr(S),r.dirty=!0,await r.frame()},async showMotif(S,P){f!=="atlas"&&await Y("atlas");const Q=await V();X++;try{await Q.setMotif(S,P)}finally{X--}await U()},atlasStats:()=>{var S;return(S=N==null?void 0:N.plaque)==null?void 0:S.stats},setCompare:async S=>{O.setCompare(S),at({refit:!0}),await r.frame()},layout:()=>e});async function wt(){var S;return u||((S=await c.first())==null?void 0:S.id)}u?c.load(u).then(()=>c.loadAll()):c.loadAll(),document.body.dataset.tab=f;for(const S of document.querySelectorAll(".tabs button"))S.setAttribute("aria-selected",String(S.dataset.tab===f));if(at(),f==="atlas"){const S=await V();X++;try{(n.motif||n.preset)&&await S.setMotif(n.motif||"taotie",n.preset),await S.activate()}finally{X--}at({refit:!0}),await U()}else if(!await z(await wt(),{view:n.view}))throw new Error("no vessel to show")}QS().catch(n=>{console.error(n),document.documentElement.dataset.ready="error"});export{vn as G,Bs as M,we as P,bo as R,q as V,oe as a,Ir as b,Za as c,Po as d,ue as e,Nt as f,n2 as g,ae as h,Ty as q,Eo as r,yu as s,i2 as t,Hb as y};
