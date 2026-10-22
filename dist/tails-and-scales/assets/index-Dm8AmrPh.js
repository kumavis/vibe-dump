(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Wd="modulepreload",Gd=function(i,t){return new URL(i,t).href},ol={},$d=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),c=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(e.map(l=>{if(l=Gd(l,n),l in ol)return;ol[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let g=o.length-1;g>=0;g--){const v=o[g];if(v.href===l&&(!h||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${l}"]${u}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":Wd,h||(f.as="script"),f.crossOrigin="",f.href=l,c&&f.setAttribute("nonce",c),document.head.appendChild(f),h)return new Promise((g,v)=>{f.addEventListener("load",g),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cc="160",Wn={ROTATE:0,DOLLY:1,PAN:2},ji={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},jd=0,al=1,Xd=2,Ku=1,Ju=2,Hn=3,pi=0,Je=1,rn=2,ai=0,_s=1,cl=2,ll=3,hl=4,qd=5,Ai=100,Yd=101,Kd=102,ul=103,fl=104,Jd=200,Zd=201,Qd=202,tp=203,ic=204,sc=205,ep=206,np=207,ip=208,sp=209,rp=210,op=211,ap=212,cp=213,lp=214,hp=0,up=1,fp=2,Mo=3,dp=4,pp=5,mp=6,gp=7,Pc=0,vp=1,xp=2,ci=0,_p=1,yp=2,Mp=3,Zu=4,bp=5,Sp=6,Qu=300,Es=301,Ts=302,rc=303,oc=304,Io=306,bo=1e3,yn=1001,ac=1002,Oe=1003,dl=1004,ea=1005,Ke=1006,wp=1007,fr=1008,li=1009,Ep=1010,Tp=1011,Lc=1012,tf=1013,ri=1014,oi=1015,dr=1016,ef=1017,nf=1018,Li=1020,Ap=1021,hn=1023,Rp=1024,Cp=1025,Di=1026,As=1027,Pp=1028,sf=1029,Lp=1030,rf=1031,of=1033,na=33776,ia=33777,sa=33778,ra=33779,pl=35840,ml=35841,gl=35842,vl=35843,af=36196,xl=37492,_l=37496,yl=37808,Ml=37809,bl=37810,Sl=37811,wl=37812,El=37813,Tl=37814,Al=37815,Rl=37816,Cl=37817,Pl=37818,Ll=37819,Dl=37820,Il=37821,oa=36492,Ul=36494,Ol=36495,Dp=36283,Nl=36284,zl=36285,kl=36286,cf=3e3,Ii=3001,Ip=3200,Up=3201,Dc=0,Op=1,un="",Se="srgb",Kn="srgb-linear",Ic="display-p3",Uo="display-p3-linear",So="linear",ce="srgb",wo="rec709",Eo="p3",Xi=7680,Fl=519,Np=512,zp=513,kp=514,lf=515,Fp=516,Bp=517,Hp=518,Vp=519,Bl=35044,Wp=35048,Hl="300 es",cc=1035,jn=2e3,To=2001;class Hi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],uo=Math.PI/180,lc=180/Math.PI;function Mr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function Le(i,t,e){return Math.max(t,Math.min(e,i))}function Gp(i,t){return(i%t+t)%t}function aa(i,t,e){return(1-e)*i+e*t}function Vl(i){return(i&i-1)===0&&i!==0}function hc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ws(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function qe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const $p={DEG2RAD:uo};class pt{constructor(t=0,e=0){pt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,n,s,r,o,a,c,l){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],x=s[1],_=s[4],y=s[7],R=s[2],S=s[5],E=s[8];return r[0]=o*v+a*x+c*R,r[3]=o*m+a*_+c*S,r[6]=o*p+a*y+c*E,r[1]=l*v+h*x+u*R,r[4]=l*m+h*_+u*S,r[7]=l*p+h*y+u*E,r[2]=d*v+f*x+g*R,r[5]=d*m+f*_+g*S,r[8]=d*p+f*y+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ca.makeScale(t,e)),this}rotate(t){return this.premultiply(ca.makeRotation(-t)),this}translate(t,e){return this.premultiply(ca.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ca=new Zt;function hf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ao(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function jp(){const i=Ao("canvas");return i.style.display="block",i}const Wl={};function ir(i){i in Wl||(Wl[i]=!0,console.warn(i))}const Gl=new Zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),$l=new Zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Lr={[Kn]:{transfer:So,primaries:wo,toReference:i=>i,fromReference:i=>i},[Se]:{transfer:ce,primaries:wo,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Uo]:{transfer:So,primaries:Eo,toReference:i=>i.applyMatrix3($l),fromReference:i=>i.applyMatrix3(Gl)},[Ic]:{transfer:ce,primaries:Eo,toReference:i=>i.convertSRGBToLinear().applyMatrix3($l),fromReference:i=>i.applyMatrix3(Gl).convertLinearToSRGB()}},Xp=new Set([Kn,Uo]),ae={enabled:!0,_workingColorSpace:Kn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Xp.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Lr[t].toReference,s=Lr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Lr[i].primaries},getTransfer:function(i){return i===un?So:Lr[i].transfer}};function ys(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function la(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let qi;class uf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{qi===void 0&&(qi=Ao("canvas")),qi.width=t.width,qi.height=t.height;const n=qi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=qi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ao("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ys(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ys(e[n]/255)*255):e[n]=ys(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let qp=0;class ff{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=Mr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ha(s[o].image)):r.push(ha(s[o]))}else r=ha(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ha(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?uf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Yp=0;class $e extends Hi{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,n=yn,s=yn,r=Ke,o=fr,a=hn,c=li,l=$e.DEFAULT_ANISOTROPY,h=un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=Mr(),this.name="",this.source=new ff(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new pt(0,0),this.repeat=new pt(1,1),this.center=new pt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Ii?Se:un),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Qu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case bo:t.x=t.x-Math.floor(t.x);break;case yn:t.x=t.x<0?0:1;break;case ac:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case bo:t.y=t.y-Math.floor(t.y);break;case yn:t.y=t.y<0?0:1;break;case ac:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Se?Ii:cf}set encoding(t){ir("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Ii?Se:un}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=Qu;$e.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(l+1)/2,y=(f+1)/2,R=(p+1)/2,S=(h+d)/4,E=(u+v)/4,O=(g+m)/4;return _>y&&_>R?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=S/n,r=E/n):y>R?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=S/s,r=O/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=E/r,s=O/r),this.set(n,s,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-v)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Kp extends Hi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(ir("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Ii?Se:un),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ke,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new $e(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ff(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ni extends Kp{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class df extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Jp extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=yn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Cn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-a;const p=c*d+l*f+h*g+u*v,x=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){const R=Math.sqrt(_),S=Math.atan2(R,p*x);m=Math.sin(m*S)/R,a=Math.sin(a*S)/R}const y=a*x;if(c=c*m+d*y,l=l*m+f*y,h=h*m+g*y,u=u*m+v*y,m===1-a){const R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-a*f,t[e+2]=l*g+h*f+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(jl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(jl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ua.copy(this).projectOnVector(t),this.sub(ua)}reflect(t){return this.sub(ua.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ua=new C,jl=new Cn;class Vi{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(pn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(pn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=pn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,pn):pn.fromBufferAttribute(r,o),pn.applyMatrix4(t.matrixWorld),this.expandByPoint(pn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Dr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Dr.copy(n.boundingBox)),Dr.applyMatrix4(t.matrixWorld),this.union(Dr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,pn),pn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Gs),Ir.subVectors(this.max,Gs),Yi.subVectors(t.a,Gs),Ki.subVectors(t.b,Gs),Ji.subVectors(t.c,Gs),Zn.subVectors(Ki,Yi),Qn.subVectors(Ji,Ki),_i.subVectors(Yi,Ji);let e=[0,-Zn.z,Zn.y,0,-Qn.z,Qn.y,0,-_i.z,_i.y,Zn.z,0,-Zn.x,Qn.z,0,-Qn.x,_i.z,0,-_i.x,-Zn.y,Zn.x,0,-Qn.y,Qn.x,0,-_i.y,_i.x,0];return!fa(e,Yi,Ki,Ji,Ir)||(e=[1,0,0,0,1,0,0,0,1],!fa(e,Yi,Ki,Ji,Ir))?!1:(Ur.crossVectors(Zn,Qn),e=[Ur.x,Ur.y,Ur.z],fa(e,Yi,Ki,Ji,Ir))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,pn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(pn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Nn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Nn=[new C,new C,new C,new C,new C,new C,new C,new C],pn=new C,Dr=new Vi,Yi=new C,Ki=new C,Ji=new C,Zn=new C,Qn=new C,_i=new C,Gs=new C,Ir=new C,Ur=new C,yi=new C;function fa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){yi.fromArray(i,r);const a=s.x*Math.abs(yi.x)+s.y*Math.abs(yi.y)+s.z*Math.abs(yi.z),c=t.dot(yi),l=e.dot(yi),h=n.dot(yi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Zp=new Vi,$s=new C,da=new C;class Ns{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Zp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;$s.subVectors(t,this.center);const e=$s.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector($s,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(da.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint($s.copy(t.center).add(da)),this.expandByPoint($s.copy(t.center).sub(da))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const zn=new C,pa=new C,Or=new C,ti=new C,ma=new C,Nr=new C,ga=new C;class Oo{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,zn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=zn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(zn.copy(this.origin).addScaledVector(this.direction,e),zn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){pa.copy(t).add(e).multiplyScalar(.5),Or.copy(e).sub(t).normalize(),ti.copy(this.origin).sub(pa);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Or),a=ti.dot(this.direction),c=-ti.dot(Or),l=ti.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(pa).addScaledVector(Or,d),f}intersectSphere(t,e){zn.subVectors(t.center,this.origin);const n=zn.dot(this.direction),s=zn.dot(zn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,zn)!==null}intersectTriangle(t,e,n,s,r){ma.subVectors(e,t),Nr.subVectors(n,t),ga.crossVectors(ma,Nr);let o=this.direction.dot(ga),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ti.subVectors(this.origin,t);const c=a*this.direction.dot(Nr.crossVectors(ti,Nr));if(c<0)return null;const l=a*this.direction.dot(ma.cross(ti));if(l<0||c+l>o)return null;const h=-a*ti.dot(ga);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m)}set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Zi.setFromMatrixColumn(t,0).length(),r=1/Zi.setFromMatrixColumn(t,1).length(),o=1/Zi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-a*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*a,e[4]=g*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Qp,t,tm)}lookAt(t,e,n){const s=this.elements;return en.subVectors(t,e),en.lengthSq()===0&&(en.z=1),en.normalize(),ei.crossVectors(n,en),ei.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),ei.crossVectors(n,en)),ei.normalize(),zr.crossVectors(en,ei),s[0]=ei.x,s[4]=zr.x,s[8]=en.x,s[1]=ei.y,s[5]=zr.y,s[9]=en.y,s[2]=ei.z,s[6]=zr.z,s[10]=en.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],x=n[3],_=n[7],y=n[11],R=n[15],S=s[0],E=s[4],O=s[8],M=s[12],w=s[1],z=s[5],j=s[9],et=s[13],U=s[2],F=s[6],q=s[10],Z=s[14],K=s[3],Y=s[7],Q=s[11],nt=s[15];return r[0]=o*S+a*w+c*U+l*K,r[4]=o*E+a*z+c*F+l*Y,r[8]=o*O+a*j+c*q+l*Q,r[12]=o*M+a*et+c*Z+l*nt,r[1]=h*S+u*w+d*U+f*K,r[5]=h*E+u*z+d*F+f*Y,r[9]=h*O+u*j+d*q+f*Q,r[13]=h*M+u*et+d*Z+f*nt,r[2]=g*S+v*w+m*U+p*K,r[6]=g*E+v*z+m*F+p*Y,r[10]=g*O+v*j+m*q+p*Q,r[14]=g*M+v*et+m*Z+p*nt,r[3]=x*S+_*w+y*U+R*K,r[7]=x*E+_*z+y*F+R*Y,r[11]=x*O+_*j+y*q+R*Q,r[15]=x*M+_*et+y*Z+R*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+v*(+e*c*f-e*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+m*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*d+s*o*u-n*o*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],x=u*m*l-v*d*l+v*c*f-a*m*f-u*c*p+a*d*p,_=g*d*l-h*m*l-g*c*f+o*m*f+h*c*p-o*d*p,y=h*v*l-g*u*l+g*a*f-o*v*f-h*a*p+o*u*p,R=g*u*c-h*v*c-g*a*d+o*v*d+h*a*m-o*u*m,S=e*x+n*_+s*y+r*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=x*E,t[1]=(v*d*r-u*m*r-v*s*f+n*m*f+u*s*p-n*d*p)*E,t[2]=(a*m*r-v*c*r+v*s*l-n*m*l-a*s*p+n*c*p)*E,t[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*E,t[4]=_*E,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*E,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*p-e*c*p)*E,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*f+e*c*f)*E,t[8]=y*E,t[9]=(g*u*r-h*v*r-g*n*f+e*v*f+h*n*p-e*u*p)*E,t[10]=(o*v*r-g*a*r+g*n*l-e*v*l-o*n*p+e*a*p)*E,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*E,t[12]=R*E,t[13]=(h*v*s-g*u*s+g*n*d-e*v*d-h*n*m+e*u*m)*E,t[14]=(g*a*s-o*v*s-g*n*c+e*v*c+o*n*m-e*a*m)*E,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*d+e*a*d)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,v=o*h,m=o*u,p=a*u,x=c*l,_=c*h,y=c*u,R=n.x,S=n.y,E=n.z;return s[0]=(1-(v+p))*R,s[1]=(f+y)*R,s[2]=(g-_)*R,s[3]=0,s[4]=(f-y)*S,s[5]=(1-(d+p))*S,s[6]=(m+x)*S,s[7]=0,s[8]=(g+_)*E,s[9]=(m-x)*E,s[10]=(1-(d+v))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Zi.set(s[0],s[1],s[2]).length();const o=Zi.set(s[4],s[5],s[6]).length(),a=Zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],mn.copy(this);const l=1/r,h=1/o,u=1/a;return mn.elements[0]*=l,mn.elements[1]*=l,mn.elements[2]*=l,mn.elements[4]*=h,mn.elements[5]*=h,mn.elements[6]*=h,mn.elements[8]*=u,mn.elements[9]*=u,mn.elements[10]*=u,e.setFromRotationMatrix(mn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=jn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(a===jn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===To)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=jn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*l,f=(n+s)*h;let g,v;if(a===jn)g=(o+r)*u,v=-2*u;else if(a===To)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Zi=new C,mn=new re,Qp=new C(0,0,0),tm=new C(1,1,1),ei=new C,zr=new C,en=new C,Xl=new re,ql=new Cn;class zs{constructor(t=0,e=0,n=0,s=zs.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Le(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Le(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Le(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Xl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Xl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ql.setFromEuler(this),this.setFromQuaternion(ql,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zs.DEFAULT_ORDER="XYZ";class Uc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let em=0;const Yl=new C,Qi=new Cn,kn=new re,kr=new C,js=new C,nm=new C,im=new Cn,Kl=new C(1,0,0),Jl=new C(0,1,0),Zl=new C(0,0,1),sm={type:"added"},rm={type:"removed"};class De extends Hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:em++}),this.uuid=Mr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=De.DEFAULT_UP.clone();const t=new C,e=new zs,n=new Cn,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new re},normalMatrix:{value:new Zt}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=De.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Uc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Qi.setFromAxisAngle(t,e),this.quaternion.multiply(Qi),this}rotateOnWorldAxis(t,e){return Qi.setFromAxisAngle(t,e),this.quaternion.premultiply(Qi),this}rotateX(t){return this.rotateOnAxis(Kl,t)}rotateY(t){return this.rotateOnAxis(Jl,t)}rotateZ(t){return this.rotateOnAxis(Zl,t)}translateOnAxis(t,e){return Yl.copy(t).applyQuaternion(this.quaternion),this.position.add(Yl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Kl,t)}translateY(t){return this.translateOnAxis(Jl,t)}translateZ(t){return this.translateOnAxis(Zl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(kn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?kr.copy(t):kr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),js.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?kn.lookAt(js,kr,this.up):kn.lookAt(kr,js,this.up),this.quaternion.setFromRotationMatrix(kn),s&&(kn.extractRotation(s.matrixWorld),Qi.setFromRotationMatrix(kn),this.quaternion.premultiply(Qi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(sm)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(rm)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),kn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),kn.multiply(t.parent.matrixWorld)),t.applyMatrix4(kn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,t,nm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,im,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}De.DEFAULT_UP=new C(0,1,0);De.DEFAULT_MATRIX_AUTO_UPDATE=!0;De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gn=new C,Fn=new C,va=new C,Bn=new C,ts=new C,es=new C,Ql=new C,xa=new C,_a=new C,ya=new C;let Fr=!1;class _n{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),gn.subVectors(t,e),s.cross(gn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){gn.subVectors(s,e),Fn.subVectors(n,e),va.subVectors(t,e);const o=gn.dot(gn),a=gn.dot(Fn),c=gn.dot(va),l=Fn.dot(Fn),h=Fn.dot(va),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Bn)===null?!1:Bn.x>=0&&Bn.y>=0&&Bn.x+Bn.y<=1}static getUV(t,e,n,s,r,o,a,c){return Fr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Fr=!0),this.getInterpolation(t,e,n,s,r,o,a,c)}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Bn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Bn.x),c.addScaledVector(o,Bn.y),c.addScaledVector(a,Bn.z),c)}static isFrontFacing(t,e,n,s){return gn.subVectors(n,e),Fn.subVectors(t,e),gn.cross(Fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return gn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),gn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return _n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return _n.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Fr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Fr=!0),_n.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return _n.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return _n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return _n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ts.subVectors(s,n),es.subVectors(r,n),xa.subVectors(t,n);const c=ts.dot(xa),l=es.dot(xa);if(c<=0&&l<=0)return e.copy(n);_a.subVectors(t,s);const h=ts.dot(_a),u=es.dot(_a);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(ts,o);ya.subVectors(t,r);const f=ts.dot(ya),g=es.dot(ya);if(g>=0&&f<=g)return e.copy(r);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(es,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Ql.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Ql,a);const p=1/(m+v+d);return o=v*p,a=d*p,e.copy(n).addScaledVector(ts,o).addScaledVector(es,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const pf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},Br={h:0,s:0,l:0};function Ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Se){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ae.workingColorSpace){if(t=Gp(t,1),e=Le(e,0,1),n=Le(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ma(o,r,t+1/3),this.g=Ma(o,r,t),this.b=Ma(o,r,t-1/3)}return ae.toWorkingColorSpace(this,s),this}setStyle(t,e=Se){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Se){const n=pf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ys(t.r),this.g=ys(t.g),this.b=ys(t.b),this}copyLinearToSRGB(t){return this.r=la(t.r),this.g=la(t.g),this.b=la(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Se){return ae.fromWorkingColorSpace(Fe.copy(this),t),Math.round(Le(Fe.r*255,0,255))*65536+Math.round(Le(Fe.g*255,0,255))*256+Math.round(Le(Fe.b*255,0,255))}getHexString(t=Se){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.fromWorkingColorSpace(Fe.copy(this),e);const n=Fe.r,s=Fe.g,r=Fe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.fromWorkingColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Se){ae.fromWorkingColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,s=Fe.b;return t!==Se?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ni),this.setHSL(ni.h+t,ni.s+e,ni.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ni),t.getHSL(Br);const n=aa(ni.h,Br.h,e),s=aa(ni.s,Br.s,e),r=aa(ni.l,Br.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new qt;qt.NAMES=pf;let om=0;class Wi extends Hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=Mr(),this.name="",this.type="Material",this.blending=_s,this.side=pi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ic,this.blendDst=sc,this.blendEquation=Ai,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=Mo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xi,this.stencilZFail=Xi,this.stencilZPass=Xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_s&&(n.blending=this.blending),this.side!==pi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ic&&(n.blendSrc=this.blendSrc),this.blendDst!==sc&&(n.blendDst=this.blendDst),this.blendEquation!==Ai&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Mo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class We extends Wi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Pc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new C,Hr=new pt;class an{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Bl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=oi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Hr.fromBufferAttribute(this,e),Hr.applyMatrix3(t),this.setXY(e,Hr.x,Hr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ws(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ws(e,this.array)),e}setX(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ws(e,this.array)),e}setY(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ws(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ws(e,this.array)),e}setW(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array),r=qe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bl&&(t.usage=this.usage),t}}class mf extends an{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class gf extends an{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class se extends an{constructor(t,e,n){super(new Float32Array(t),e,n)}}let am=0;const ln=new re,ba=new De,ns=new C,nn=new Vi,Xs=new Vi,Pe=new C;class de extends Hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:am++}),this.uuid=Mr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(hf(t)?gf:mf)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ln.makeRotationFromQuaternion(t),this.applyMatrix4(ln),this}rotateX(t){return ln.makeRotationX(t),this.applyMatrix4(ln),this}rotateY(t){return ln.makeRotationY(t),this.applyMatrix4(ln),this}rotateZ(t){return ln.makeRotationZ(t),this.applyMatrix4(ln),this}translate(t,e,n){return ln.makeTranslation(t,e,n),this.applyMatrix4(ln),this}scale(t,e,n){return ln.makeScale(t,e,n),this.applyMatrix4(ln),this}lookAt(t){return ba.lookAt(t),ba.updateMatrix(),this.applyMatrix4(ba.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ns).negate(),this.translate(ns.x,ns.y,ns.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new se(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ns);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Xs.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(nn.min,Xs.min),nn.expandByPoint(Pe),Pe.addVectors(nn.max,Xs.max),nn.expandByPoint(Pe)):(nn.expandByPoint(Xs.min),nn.expandByPoint(Xs.max))}nn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Pe.fromBufferAttribute(a,l),c&&(ns.fromBufferAttribute(t,l),Pe.add(ns)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new an(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let w=0;w<a;w++)l[w]=new C,h[w]=new C;const u=new C,d=new C,f=new C,g=new pt,v=new pt,m=new pt,p=new C,x=new C;function _(w,z,j){u.fromArray(s,w*3),d.fromArray(s,z*3),f.fromArray(s,j*3),g.fromArray(o,w*2),v.fromArray(o,z*2),m.fromArray(o,j*2),d.sub(u),f.sub(u),v.sub(g),m.sub(g);const et=1/(v.x*m.y-m.x*v.y);isFinite(et)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-v.y).multiplyScalar(et),x.copy(f).multiplyScalar(v.x).addScaledVector(d,-m.x).multiplyScalar(et),l[w].add(p),l[z].add(p),l[j].add(p),h[w].add(x),h[z].add(x),h[j].add(x))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let w=0,z=y.length;w<z;++w){const j=y[w],et=j.start,U=j.count;for(let F=et,q=et+U;F<q;F+=3)_(n[F+0],n[F+1],n[F+2])}const R=new C,S=new C,E=new C,O=new C;function M(w){E.fromArray(r,w*3),O.copy(E);const z=l[w];R.copy(z),R.sub(E.multiplyScalar(E.dot(z))).normalize(),S.crossVectors(O,z);const et=S.dot(h[w])<0?-1:1;c[w*4]=R.x,c[w*4+1]=R.y,c[w*4+2]=R.z,c[w*4+3]=et}for(let w=0,z=y.length;w<z;++w){const j=y[w],et=j.start,U=j.count;for(let F=et,q=et+U;F<q;F+=3)M(n[F+0]),M(n[F+1]),M(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new an(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,o=new C,a=new C,c=new C,l=new C,h=new C,u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new an(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new de,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const th=new re,Mi=new Oo,Vr=new Ns,eh=new C,is=new C,ss=new C,rs=new C,Sa=new C,Wr=new C,Gr=new pt,$r=new pt,jr=new pt,nh=new C,ih=new C,sh=new C,Xr=new C,qr=new C;class Gt extends De{constructor(t=new de,e=new We){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Wr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(Sa.fromBufferAttribute(u,t),o?Wr.addScaledVector(Sa,h):Wr.addScaledVector(Sa.sub(e),h))}e.add(Wr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vr.copy(n.boundingSphere),Vr.applyMatrix4(r),Mi.copy(t.ray).recast(t.near),!(Vr.containsPoint(Mi.origin)===!1&&(Mi.intersectSphere(Vr,eh)===null||Mi.origin.distanceToSquared(eh)>(t.far-t.near)**2))&&(th.copy(r).invert(),Mi.copy(t.ray).applyMatrix4(th),!(n.boundingBox!==null&&Mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Mi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),_=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,R=_;y<R;y+=3){const S=a.getX(y),E=a.getX(y+1),O=a.getX(y+2);s=Yr(this,p,t,n,l,h,u,S,E,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=a.getX(m),_=a.getX(m+1),y=a.getX(m+2);s=Yr(this,o,t,n,l,h,u,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],x=Math.max(m.start,f.start),_=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=x,R=_;y<R;y+=3){const S=y,E=y+1,O=y+2;s=Yr(this,p,t,n,l,h,u,S,E,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const x=m,_=m+1,y=m+2;s=Yr(this,o,t,n,l,h,u,x,_,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function cm(i,t,e,n,s,r,o,a){let c;if(t.side===Je?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===pi,a),c===null)return null;qr.copy(a),qr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(qr);return l<e.near||l>e.far?null:{distance:l,point:qr.clone(),object:i}}function Yr(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,is),i.getVertexPosition(c,ss),i.getVertexPosition(l,rs);const h=cm(i,t,e,n,is,ss,rs,Xr);if(h){s&&(Gr.fromBufferAttribute(s,a),$r.fromBufferAttribute(s,c),jr.fromBufferAttribute(s,l),h.uv=_n.getInterpolation(Xr,is,ss,rs,Gr,$r,jr,new pt)),r&&(Gr.fromBufferAttribute(r,a),$r.fromBufferAttribute(r,c),jr.fromBufferAttribute(r,l),h.uv1=_n.getInterpolation(Xr,is,ss,rs,Gr,$r,jr,new pt),h.uv2=h.uv1),o&&(nh.fromBufferAttribute(o,a),ih.fromBufferAttribute(o,c),sh.fromBufferAttribute(o,l),h.normal=_n.getInterpolation(Xr,is,ss,rs,nh,ih,sh,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new C,materialIndex:0};_n.getNormal(is,ss,rs,u.normal),h.face=u}return h}class Pn extends de{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new se(l,3)),this.setAttribute("normal",new se(h,3)),this.setAttribute("uv",new se(u,2));function g(v,m,p,x,_,y,R,S,E,O,M){const w=y/E,z=R/O,j=y/2,et=R/2,U=S/2,F=E+1,q=O+1;let Z=0,K=0;const Y=new C;for(let Q=0;Q<q;Q++){const nt=Q*z-et;for(let gt=0;gt<F;gt++){const G=gt*w-j;Y[v]=G*x,Y[m]=nt*_,Y[p]=U,l.push(Y.x,Y.y,Y.z),Y[v]=0,Y[m]=0,Y[p]=S>0?1:-1,h.push(Y.x,Y.y,Y.z),u.push(gt/E),u.push(1-Q/O),Z+=1}}for(let Q=0;Q<O;Q++)for(let nt=0;nt<E;nt++){const gt=d+nt+F*Q,G=d+nt+F*(Q+1),J=d+(nt+1)+F*(Q+1),mt=d+(nt+1)+F*Q;c.push(gt,G,mt),c.push(G,J,mt),K+=6}a.addGroup(f,K,M),f+=K,d+=Z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Rs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){const t={};for(let e=0;e<i.length;e++){const n=Rs(i[e]);for(const s in n)t[s]=n[s]}return t}function lm(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function vf(i){return i.getRenderTarget()===null?i.outputColorSpace:ae.workingColorSpace}const hm={clone:Rs,merge:Ve};var um=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zi extends Wi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=um,this.fragmentShader=fm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Rs(t.uniforms),this.uniformsGroups=lm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class xf extends De{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=jn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class sn extends xf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=lc*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(uo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return lc*2*Math.atan(Math.tan(uo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(uo*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const os=-90,as=1;class dm extends De{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(os,as,t,e);s.layers=this.layers,this.add(s);const r=new sn(os,as,t,e);r.layers=this.layers,this.add(r);const o=new sn(os,as,t,e);o.layers=this.layers,this.add(o);const a=new sn(os,as,t,e);a.layers=this.layers,this.add(a);const c=new sn(os,as,t,e);c.layers=this.layers,this.add(c);const l=new sn(os,as,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===To)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class _f extends $e{constructor(t,e,n,s,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Es,super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class pm extends Ni{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(ir("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Ii?Se:un),this.texture=new _f(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ke}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Pn(5,5,5),r=new zi({name:"CubemapFromEquirect",uniforms:Rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Je,blending:ai});r.uniforms.tEquirect.value=e;const o=new Gt(s,r),a=e.minFilter;return e.minFilter===fr&&(e.minFilter=Ke),new dm(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const wa=new C,mm=new C,gm=new Zt;class si{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=wa.subVectors(n,e).cross(mm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(wa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||gm.getNormalMatrix(t),s=this.coplanarPoint(wa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const bi=new Ns,Kr=new C;class Oc{constructor(t=new si,e=new si,n=new si,s=new si,r=new si,o=new si){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=jn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],v=s[10],m=s[11],p=s[12],x=s[13],_=s[14],y=s[15];if(n[0].setComponents(c-r,d-l,m-f,y-p).normalize(),n[1].setComponents(c+r,d+l,m+f,y+p).normalize(),n[2].setComponents(c+o,d+h,m+g,y+x).normalize(),n[3].setComponents(c-o,d-h,m-g,y-x).normalize(),n[4].setComponents(c-a,d-u,m-v,y-_).normalize(),e===jn)n[5].setComponents(c+a,d+u,m+v,y+_).normalize();else if(e===To)n[5].setComponents(a,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bi)}intersectsSprite(t){return bi.center.set(0,0,0),bi.radius=.7071067811865476,bi.applyMatrix4(t.matrixWorld),this.intersectsSphere(bi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Kr.x=s.normal.x>0?t.max.x:t.min.x,Kr.y=s.normal.y>0?t.max.y:t.min.y,Kr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Kr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function yf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function vm(i,t){const e=t.isWebGL2,n=new WeakMap;function s(l,h){const u=l.array,d=l.usage,f=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let v;if(u instanceof Float32Array)v=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=i.SHORT;else if(u instanceof Uint32Array)v=i.UNSIGNED_INT;else if(u instanceof Int32Array)v=i.INT;else if(u instanceof Int8Array)v=i.BYTE;else if(u instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:f}}function r(l,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),f.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let v=0,m=g.length;v<m;v++){const p=g[v];e?i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}class hi extends de{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const x=p*d-o;for(let _=0;_<l;_++){const y=_*u-r;g.push(y,-x,0),v.push(0,0,1),m.push(_/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const _=x+l*p,y=x+l*(p+1),R=x+1+l*(p+1),S=x+1+l*p;f.push(_,y,S),f.push(y,R,S)}this.setIndex(f),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hi(t.width,t.height,t.widthSegments,t.heightSegments)}}var xm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_m=`#ifdef USE_ALPHAHASH
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
#endif`,ym=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bm=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Sm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wm=`#ifdef USE_AOMAP
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
#endif`,Em=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tm=`#ifdef USE_BATCHING
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
#endif`,Am=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Rm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Pm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Lm=`#ifdef USE_IRIDESCENCE
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
#endif`,Dm=`#ifdef USE_BUMPMAP
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
#endif`,Im=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Um=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,km=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Fm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Bm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Hm=`#define PI 3.141592653589793
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
} // validated`,Vm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wm=`vec3 transformedNormal = objectNormal;
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
#endif`,Gm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$m=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ym=`
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
}`,Km=`#ifdef USE_ENVMAP
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
#endif`,Jm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zm=`#ifdef USE_ENVMAP
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
#endif`,Qm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,t0=`#ifdef USE_ENVMAP
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
#endif`,e0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,n0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,i0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,s0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,r0=`#ifdef USE_GRADIENTMAP
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
}`,o0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,a0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,c0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,l0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,h0=`uniform bool receiveShadow;
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
#endif`,u0=`#ifdef USE_ENVMAP
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
#endif`,f0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,d0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,p0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,m0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,g0=`PhysicalMaterial material;
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
#endif`,v0=`struct PhysicalMaterial {
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
}`,x0=`
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
#endif`,_0=`#if defined( RE_IndirectDiffuse )
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
#endif`,y0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,M0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,b0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,S0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,w0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,E0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,T0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,A0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,R0=`#if defined( USE_POINTS_UV )
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
#endif`,C0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,P0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,L0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,D0=`#ifdef USE_MORPHNORMALS
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
#endif`,I0=`#ifdef USE_MORPHTARGETS
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
#endif`,U0=`#ifdef USE_MORPHTARGETS
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
#endif`,O0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,N0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,z0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,k0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,F0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,B0=`#ifdef USE_NORMALMAP
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
#endif`,H0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,V0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,W0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,G0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,j0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,X0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,q0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Y0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,K0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,J0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Z0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Q0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,eg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,ng=`float getShadowMask() {
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
}`,ig=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sg=`#ifdef USE_SKINNING
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
#endif`,rg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,og=`#ifdef USE_SKINNING
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
#endif`,ag=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,cg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ug=`#ifdef USE_TRANSMISSION
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
#endif`,fg=`#ifdef USE_TRANSMISSION
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
#endif`,dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const vg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,xg=`uniform sampler2D t2D;
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
}`,_g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,yg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sg=`#include <common>
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
}`,wg=`#if DEPTH_PACKING == 3200
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
}`,Eg=`#define DISTANCE
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
}`,Tg=`#define DISTANCE
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
}`,Ag=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cg=`uniform float scale;
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
}`,Pg=`uniform vec3 diffuse;
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
}`,Lg=`#include <common>
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
}`,Dg=`uniform vec3 diffuse;
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
}`,Ig=`#define LAMBERT
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
}`,Ug=`#define LAMBERT
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
}`,Og=`#define MATCAP
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
}`,Ng=`#define MATCAP
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
}`,zg=`#define NORMAL
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
}`,kg=`#define NORMAL
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
}`,Fg=`#define PHONG
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
}`,Bg=`#define PHONG
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
}`,Hg=`#define STANDARD
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
}`,Vg=`#define STANDARD
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
}`,Wg=`#define TOON
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
}`,$g=`uniform float size;
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
}`,jg=`uniform vec3 diffuse;
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
}`,Xg=`#include <common>
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
}`,qg=`uniform vec3 color;
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
}`,Yg=`uniform float rotation;
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
}`,Kg=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:xm,alphahash_pars_fragment:_m,alphamap_fragment:ym,alphamap_pars_fragment:Mm,alphatest_fragment:bm,alphatest_pars_fragment:Sm,aomap_fragment:wm,aomap_pars_fragment:Em,batching_pars_vertex:Tm,batching_vertex:Am,begin_vertex:Rm,beginnormal_vertex:Cm,bsdfs:Pm,iridescence_fragment:Lm,bumpmap_pars_fragment:Dm,clipping_planes_fragment:Im,clipping_planes_pars_fragment:Um,clipping_planes_pars_vertex:Om,clipping_planes_vertex:Nm,color_fragment:zm,color_pars_fragment:km,color_pars_vertex:Fm,color_vertex:Bm,common:Hm,cube_uv_reflection_fragment:Vm,defaultnormal_vertex:Wm,displacementmap_pars_vertex:Gm,displacementmap_vertex:$m,emissivemap_fragment:jm,emissivemap_pars_fragment:Xm,colorspace_fragment:qm,colorspace_pars_fragment:Ym,envmap_fragment:Km,envmap_common_pars_fragment:Jm,envmap_pars_fragment:Zm,envmap_pars_vertex:Qm,envmap_physical_pars_fragment:u0,envmap_vertex:t0,fog_vertex:e0,fog_pars_vertex:n0,fog_fragment:i0,fog_pars_fragment:s0,gradientmap_pars_fragment:r0,lightmap_fragment:o0,lightmap_pars_fragment:a0,lights_lambert_fragment:c0,lights_lambert_pars_fragment:l0,lights_pars_begin:h0,lights_toon_fragment:f0,lights_toon_pars_fragment:d0,lights_phong_fragment:p0,lights_phong_pars_fragment:m0,lights_physical_fragment:g0,lights_physical_pars_fragment:v0,lights_fragment_begin:x0,lights_fragment_maps:_0,lights_fragment_end:y0,logdepthbuf_fragment:M0,logdepthbuf_pars_fragment:b0,logdepthbuf_pars_vertex:S0,logdepthbuf_vertex:w0,map_fragment:E0,map_pars_fragment:T0,map_particle_fragment:A0,map_particle_pars_fragment:R0,metalnessmap_fragment:C0,metalnessmap_pars_fragment:P0,morphcolor_vertex:L0,morphnormal_vertex:D0,morphtarget_pars_vertex:I0,morphtarget_vertex:U0,normal_fragment_begin:O0,normal_fragment_maps:N0,normal_pars_fragment:z0,normal_pars_vertex:k0,normal_vertex:F0,normalmap_pars_fragment:B0,clearcoat_normal_fragment_begin:H0,clearcoat_normal_fragment_maps:V0,clearcoat_pars_fragment:W0,iridescence_pars_fragment:G0,opaque_fragment:$0,packing:j0,premultiplied_alpha_fragment:X0,project_vertex:q0,dithering_fragment:Y0,dithering_pars_fragment:K0,roughnessmap_fragment:J0,roughnessmap_pars_fragment:Z0,shadowmap_pars_fragment:Q0,shadowmap_pars_vertex:tg,shadowmap_vertex:eg,shadowmask_pars_fragment:ng,skinbase_vertex:ig,skinning_pars_vertex:sg,skinning_vertex:rg,skinnormal_vertex:og,specularmap_fragment:ag,specularmap_pars_fragment:cg,tonemapping_fragment:lg,tonemapping_pars_fragment:hg,transmission_fragment:ug,transmission_pars_fragment:fg,uv_pars_fragment:dg,uv_pars_vertex:pg,uv_vertex:mg,worldpos_vertex:gg,background_vert:vg,background_frag:xg,backgroundCube_vert:_g,backgroundCube_frag:yg,cube_vert:Mg,cube_frag:bg,depth_vert:Sg,depth_frag:wg,distanceRGBA_vert:Eg,distanceRGBA_frag:Tg,equirect_vert:Ag,equirect_frag:Rg,linedashed_vert:Cg,linedashed_frag:Pg,meshbasic_vert:Lg,meshbasic_frag:Dg,meshlambert_vert:Ig,meshlambert_frag:Ug,meshmatcap_vert:Og,meshmatcap_frag:Ng,meshnormal_vert:zg,meshnormal_frag:kg,meshphong_vert:Fg,meshphong_frag:Bg,meshphysical_vert:Hg,meshphysical_frag:Vg,meshtoon_vert:Wg,meshtoon_frag:Gg,points_vert:$g,points_frag:jg,shadow_vert:Xg,shadow_frag:qg,sprite_vert:Yg,sprite_frag:Kg},dt={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new pt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new pt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},En={basic:{uniforms:Ve([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ve([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ve([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ve([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ve([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new qt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ve([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ve([dt.points,dt.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ve([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ve([dt.common,dt.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ve([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ve([dt.sprite,dt.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ve([dt.common,dt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ve([dt.lights,dt.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};En.physical={uniforms:Ve([En.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new pt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new pt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new pt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const Jr={r:0,b:0,g:0};function Jg(i,t,e,n,s,r,o){const a=new qt(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(m,p){let x=!1,_=p.isScene===!0?p.background:null;_&&_.isTexture&&(_=(p.backgroundBlurriness>0?e:t).get(_)),_===null?v(a,c):_&&_.isColor&&(v(_,1),x=!0);const y=i.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Io)?(h===void 0&&(h=new Gt(new Pn(1,1,1),new zi({name:"BackgroundCubeMaterial",uniforms:Rs(En.backgroundCube.uniforms),vertexShader:En.backgroundCube.vertexShader,fragmentShader:En.backgroundCube.fragmentShader,side:Je,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=ae.getTransfer(_.colorSpace)!==ce,(u!==_||d!==_.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,f=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Gt(new hi(2,2),new zi({name:"BackgroundMaterial",uniforms:Rs(En.background.uniforms),vertexShader:En.background.vertexShader,fragmentShader:En.background.fragmentShader,side:pi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=ae.getTransfer(_.colorSpace)!==ce,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,f=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function v(m,p){m.getRGB(Jr,vf(i)),n.buffers.color.setClear(Jr.r,Jr.g,Jr.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),c=p,v(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,v(a,c)},render:g}}function Zg(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},c=m(null);let l=c,h=!1;function u(U,F,q,Z,K){let Y=!1;if(o){const Q=v(Z,q,F);l!==Q&&(l=Q,f(l.object)),Y=p(U,Z,q,K),Y&&x(U,Z,q,K)}else{const Q=F.wireframe===!0;(l.geometry!==Z.id||l.program!==q.id||l.wireframe!==Q)&&(l.geometry=Z.id,l.program=q.id,l.wireframe=Q,Y=!0)}K!==null&&e.update(K,i.ELEMENT_ARRAY_BUFFER),(Y||h)&&(h=!1,O(U,F,q,Z),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(U){return n.isWebGL2?i.bindVertexArray(U):r.bindVertexArrayOES(U)}function g(U){return n.isWebGL2?i.deleteVertexArray(U):r.deleteVertexArrayOES(U)}function v(U,F,q){const Z=q.wireframe===!0;let K=a[U.id];K===void 0&&(K={},a[U.id]=K);let Y=K[F.id];Y===void 0&&(Y={},K[F.id]=Y);let Q=Y[Z];return Q===void 0&&(Q=m(d()),Y[Z]=Q),Q}function m(U){const F=[],q=[],Z=[];for(let K=0;K<s;K++)F[K]=0,q[K]=0,Z[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:q,attributeDivisors:Z,object:U,attributes:{},index:null}}function p(U,F,q,Z){const K=l.attributes,Y=F.attributes;let Q=0;const nt=q.getAttributes();for(const gt in nt)if(nt[gt].location>=0){const J=K[gt];let mt=Y[gt];if(mt===void 0&&(gt==="instanceMatrix"&&U.instanceMatrix&&(mt=U.instanceMatrix),gt==="instanceColor"&&U.instanceColor&&(mt=U.instanceColor)),J===void 0||J.attribute!==mt||mt&&J.data!==mt.data)return!0;Q++}return l.attributesNum!==Q||l.index!==Z}function x(U,F,q,Z){const K={},Y=F.attributes;let Q=0;const nt=q.getAttributes();for(const gt in nt)if(nt[gt].location>=0){let J=Y[gt];J===void 0&&(gt==="instanceMatrix"&&U.instanceMatrix&&(J=U.instanceMatrix),gt==="instanceColor"&&U.instanceColor&&(J=U.instanceColor));const mt={};mt.attribute=J,J&&J.data&&(mt.data=J.data),K[gt]=mt,Q++}l.attributes=K,l.attributesNum=Q,l.index=Z}function _(){const U=l.newAttributes;for(let F=0,q=U.length;F<q;F++)U[F]=0}function y(U){R(U,0)}function R(U,F){const q=l.newAttributes,Z=l.enabledAttributes,K=l.attributeDivisors;q[U]=1,Z[U]===0&&(i.enableVertexAttribArray(U),Z[U]=1),K[U]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](U,F),K[U]=F)}function S(){const U=l.newAttributes,F=l.enabledAttributes;for(let q=0,Z=F.length;q<Z;q++)F[q]!==U[q]&&(i.disableVertexAttribArray(q),F[q]=0)}function E(U,F,q,Z,K,Y,Q){Q===!0?i.vertexAttribIPointer(U,F,q,K,Y):i.vertexAttribPointer(U,F,q,Z,K,Y)}function O(U,F,q,Z){if(n.isWebGL2===!1&&(U.isInstancedMesh||Z.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();const K=Z.attributes,Y=q.getAttributes(),Q=F.defaultAttributeValues;for(const nt in Y){const gt=Y[nt];if(gt.location>=0){let G=K[nt];if(G===void 0&&(nt==="instanceMatrix"&&U.instanceMatrix&&(G=U.instanceMatrix),nt==="instanceColor"&&U.instanceColor&&(G=U.instanceColor)),G!==void 0){const J=G.normalized,mt=G.itemSize,St=e.get(G);if(St===void 0)continue;const Mt=St.buffer,Ft=St.type,kt=St.bytesPerElement,Lt=n.isWebGL2===!0&&(Ft===i.INT||Ft===i.UNSIGNED_INT||G.gpuType===tf);if(G.isInterleavedBufferAttribute){const Kt=G.data,B=Kt.stride,ge=G.offset;if(Kt.isInstancedInterleavedBuffer){for(let Et=0;Et<gt.locationSize;Et++)R(gt.location+Et,Kt.meshPerAttribute);U.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=Kt.meshPerAttribute*Kt.count)}else for(let Et=0;Et<gt.locationSize;Et++)y(gt.location+Et);i.bindBuffer(i.ARRAY_BUFFER,Mt);for(let Et=0;Et<gt.locationSize;Et++)E(gt.location+Et,mt/gt.locationSize,Ft,J,B*kt,(ge+mt/gt.locationSize*Et)*kt,Lt)}else{if(G.isInstancedBufferAttribute){for(let Kt=0;Kt<gt.locationSize;Kt++)R(gt.location+Kt,G.meshPerAttribute);U.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let Kt=0;Kt<gt.locationSize;Kt++)y(gt.location+Kt);i.bindBuffer(i.ARRAY_BUFFER,Mt);for(let Kt=0;Kt<gt.locationSize;Kt++)E(gt.location+Kt,mt/gt.locationSize,Ft,J,mt*kt,mt/gt.locationSize*Kt*kt,Lt)}}else if(Q!==void 0){const J=Q[nt];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(gt.location,J);break;case 3:i.vertexAttrib3fv(gt.location,J);break;case 4:i.vertexAttrib4fv(gt.location,J);break;default:i.vertexAttrib1fv(gt.location,J)}}}}S()}function M(){j();for(const U in a){const F=a[U];for(const q in F){const Z=F[q];for(const K in Z)g(Z[K].object),delete Z[K];delete F[q]}delete a[U]}}function w(U){if(a[U.id]===void 0)return;const F=a[U.id];for(const q in F){const Z=F[q];for(const K in Z)g(Z[K].object),delete Z[K];delete F[q]}delete a[U.id]}function z(U){for(const F in a){const q=a[F];if(q[U.id]===void 0)continue;const Z=q[U.id];for(const K in Z)g(Z[K].object),delete Z[K];delete q[U.id]}}function j(){et(),h=!0,l!==c&&(l=c,f(l.object))}function et(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:j,resetDefaultState:et,dispose:M,releaseStatesOfGeometry:w,releaseStatesOfProgram:z,initAttributes:_,enableAttribute:y,disableUnusedAttributes:S}}function Qg(i,t,e,n){const s=n.isWebGL2;let r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function tv(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=r(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=d>0,y=o||t.has("OES_texture_float"),R=_&&y,S=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:x,vertexTextures:_,floatFragmentTextures:y,floatVertexTextures:R,maxSamples:S}}function ev(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new si,a=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const x=r?0:n,_=x*4;let y=p.clippingState||null;c.value=y,y=h(g,d,_,f);for(let R=0;R!==_;++R)y[R]=e[R];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(m===null||m.length<p)&&(m=new Float32Array(p));for(let _=0,y=f;_!==v;++_,y+=4)o.copy(u[_]).applyMatrix4(x,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function nv(i){let t=new WeakMap;function e(o,a){return a===rc?o.mapping=Es:a===oc&&(o.mapping=Ts),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===rc||a===oc)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new pm(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Mf extends xf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ms=4,rh=[.125,.215,.35,.446,.526,.582],Ri=20,Ea=new Mf,oh=new qt;let Ta=null,Aa=0,Ra=0;const Si=(1+Math.sqrt(5))/2,cs=1/Si,ah=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,Si,cs),new C(0,Si,-cs),new C(cs,0,Si),new C(-cs,0,Si),new C(Si,cs,0),new C(-Si,cs,0)];class ch{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ta=this._renderer.getRenderTarget(),Aa=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ta,Aa,Ra),t.scissorTest=!1,Zr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Es||t.mapping===Ts?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ta=this._renderer.getRenderTarget(),Aa=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ke,minFilter:Ke,generateMipmaps:!1,type:dr,format:hn,colorSpace:Kn,depthBuffer:!1},s=lh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=lh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=iv(r)),this._blurMaterial=sv(r,t,e)}return s}_compileMaterial(t){const e=new Gt(this._lodPlanes[0],t);this._renderer.compile(e,Ea)}_sceneToCubeUV(t,e,n,s){const a=new sn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(oh),h.toneMapping=ci,h.autoClear=!1;const f=new We({name:"PMREM.Background",side:Je,depthWrite:!1,depthTest:!1}),g=new Gt(new Pn,f);let v=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,v=!0):(f.color.copy(oh),v=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):x===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const _=this._cubeSize;Zr(s,x*_,p>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Es||t.mapping===Ts;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=uh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hh());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Gt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Zr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Ea)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=ah[(s-1)%ah.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Gt(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ri-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):Ri;m>Ri&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ri}`);const p=[];let x=0;for(let E=0;E<Ri;++E){const O=E/v,M=Math.exp(-O*O/2);p.push(M),E===0?x+=M:E<m&&(x+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/x;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-n;const y=this._sizeLods[s],R=3*y*(s>_-ms?s-_+ms:0),S=4*(this._cubeSize-y);Zr(e,R,S,3*y,2*y),c.setRenderTarget(e),c.render(u,Ea)}}function iv(i){const t=[],e=[],n=[];let s=i;const r=i-ms+1+rh.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-ms?c=rh[o-i+ms-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,x=new Float32Array(v*g*f),_=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let S=0;S<f;S++){const E=S%3*2/3-1,O=S>2?0:-1,M=[E,O,0,E+2/3,O,0,E+2/3,O+1,0,E,O,0,E+2/3,O+1,0,E,O+1,0];x.set(M,v*g*S),_.set(d,m*g*S);const w=[S,S,S,S,S,S];y.set(w,p*g*S)}const R=new de;R.setAttribute("position",new an(x,v)),R.setAttribute("uv",new an(_,m)),R.setAttribute("faceIndex",new an(y,p)),t.push(R),s>ms&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function lh(i,t,e){const n=new Ni(i,t,e);return n.texture.mapping=Io,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function sv(i,t,e){const n=new Float32Array(Ri),s=new C(0,1,0);return new zi({name:"SphericalGaussianBlur",defines:{n:Ri,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Nc(),fragmentShader:`

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
		`,blending:ai,depthTest:!1,depthWrite:!1})}function hh(){return new zi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nc(),fragmentShader:`

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
		`,blending:ai,depthTest:!1,depthWrite:!1})}function uh(){return new zi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ai,depthTest:!1,depthWrite:!1})}function Nc(){return`

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
	`}function rv(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===rc||c===oc,h=c===Es||c===Ts;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new ch(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new ch(i));const d=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function ov(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function av(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],i.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const x=f.array;v=f.version;for(let _=0,y=x.length;_<y;_+=3){const R=x[_+0],S=x[_+1],E=x[_+2];d.push(R,S,S,E,E,R)}}else if(g!==void 0){const x=g.array;v=g.version;for(let _=0,y=x.length/3-1;_<y;_+=3){const R=_+0,S=_+1,E=_+2;d.push(R,S,S,E,E,R)}}else return;const m=new(hf(d)?gf:mf)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function cv(i,t,e,n){const s=n.isWebGL2;let r;function o(f){r=f}let a,c;function l(f){a=f.type,c=f.bytesPerElement}function h(f,g){i.drawElements(r,g,a,f*c),e.update(g,r,1)}function u(f,g,v){if(v===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,f*c,v),e.update(g,r,v)}function d(f,g,v){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<v;p++)this.render(f[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,f,0,v);let p=0;for(let x=0;x<v;x++)p+=g[x];e.update(p,r,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function lv(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function hv(i,t){return i[0]-t[0]}function uv(i,t){return Math.abs(t[1])-Math.abs(i[1])}function fv(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new le,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(t.isWebGL2===!0){const f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=f!==void 0?f.length:0;let v=r.get(h);if(v===void 0||v.count!==g){let U=function(){j.dispose(),r.delete(h),h.removeEventListener("dispose",U)};v!==void 0&&v.texture.dispose();const x=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let O=0;x===!0&&(O=1),_===!0&&(O=2),y===!0&&(O=3);let M=h.attributes.position.count*O,w=1;M>t.maxTextureSize&&(w=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const z=new Float32Array(M*w*4*g),j=new df(z,M,w,g);j.type=oi,j.needsUpdate=!0;const et=O*4;for(let F=0;F<g;F++){const q=R[F],Z=S[F],K=E[F],Y=M*w*4*F;for(let Q=0;Q<q.count;Q++){const nt=Q*et;x===!0&&(o.fromBufferAttribute(q,Q),z[Y+nt+0]=o.x,z[Y+nt+1]=o.y,z[Y+nt+2]=o.z,z[Y+nt+3]=0),_===!0&&(o.fromBufferAttribute(Z,Q),z[Y+nt+4]=o.x,z[Y+nt+5]=o.y,z[Y+nt+6]=o.z,z[Y+nt+7]=0),y===!0&&(o.fromBufferAttribute(K,Q),z[Y+nt+8]=o.x,z[Y+nt+9]=o.y,z[Y+nt+10]=o.z,z[Y+nt+11]=K.itemSize===4?o.w:1)}}v={count:g,texture:j,size:new pt(M,w)},r.set(h,v),h.addEventListener("dispose",U)}let m=0;for(let x=0;x<d.length;x++)m+=d[x];const p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",p),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{const f=d===void 0?0:d.length;let g=n[h.id];if(g===void 0||g.length!==f){g=[];for(let _=0;_<f;_++)g[_]=[_,0];n[h.id]=g}for(let _=0;_<f;_++){const y=g[_];y[0]=_,y[1]=d[_]}g.sort(uv);for(let _=0;_<8;_++)_<f&&g[_][1]?(a[_][0]=g[_][0],a[_][1]=g[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort(hv);const v=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let _=0;_<8;_++){const y=a[_],R=y[0],S=y[1];R!==Number.MAX_SAFE_INTEGER&&S?(v&&h.getAttribute("morphTarget"+_)!==v[R]&&h.setAttribute("morphTarget"+_,v[R]),m&&h.getAttribute("morphNormal"+_)!==m[R]&&h.setAttribute("morphNormal"+_,m[R]),s[_]=S,p+=S):(v&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),m&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),s[_]=0)}const x=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function dv(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class bf extends $e{constructor(t,e,n,s,r,o,a,c,l,h){if(h=h!==void 0?h:Di,h!==Di&&h!==As)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Di&&(n=ri),n===void 0&&h===As&&(n=Li),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Oe,this.minFilter=c!==void 0?c:Oe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Sf=new $e,wf=new bf(1,1);wf.compareFunction=lf;const Ef=new df,Tf=new Jp,Af=new _f,fh=[],dh=[],ph=new Float32Array(16),mh=new Float32Array(9),gh=new Float32Array(4);function ks(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=fh[s];if(r===void 0&&(r=new Float32Array(s),fh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ae(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function No(i,t){let e=dh[t];e===void 0&&(e=new Int32Array(t),dh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function pv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function mv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function gv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function vv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function xv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;gh.set(n),i.uniformMatrix2fv(this.addr,!1,gh),Re(e,n)}}function _v(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;mh.set(n),i.uniformMatrix3fv(this.addr,!1,mh),Re(e,n)}}function yv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;ph.set(n),i.uniformMatrix4fv(this.addr,!1,ph),Re(e,n)}}function Mv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function bv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function Sv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function wv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function Ev(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Tv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function Av(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function Rv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function Cv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?wf:Sf;e.setTexture2D(t||r,s)}function Pv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Tf,s)}function Lv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Af,s)}function Dv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ef,s)}function Iv(i){switch(i){case 5126:return pv;case 35664:return mv;case 35665:return gv;case 35666:return vv;case 35674:return xv;case 35675:return _v;case 35676:return yv;case 5124:case 35670:return Mv;case 35667:case 35671:return bv;case 35668:case 35672:return Sv;case 35669:case 35673:return wv;case 5125:return Ev;case 36294:return Tv;case 36295:return Av;case 36296:return Rv;case 35678:case 36198:case 36298:case 36306:case 35682:return Cv;case 35679:case 36299:case 36307:return Pv;case 35680:case 36300:case 36308:case 36293:return Lv;case 36289:case 36303:case 36311:case 36292:return Dv}}function Uv(i,t){i.uniform1fv(this.addr,t)}function Ov(i,t){const e=ks(t,this.size,2);i.uniform2fv(this.addr,e)}function Nv(i,t){const e=ks(t,this.size,3);i.uniform3fv(this.addr,e)}function zv(i,t){const e=ks(t,this.size,4);i.uniform4fv(this.addr,e)}function kv(i,t){const e=ks(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Fv(i,t){const e=ks(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Bv(i,t){const e=ks(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Hv(i,t){i.uniform1iv(this.addr,t)}function Vv(i,t){i.uniform2iv(this.addr,t)}function Wv(i,t){i.uniform3iv(this.addr,t)}function Gv(i,t){i.uniform4iv(this.addr,t)}function $v(i,t){i.uniform1uiv(this.addr,t)}function jv(i,t){i.uniform2uiv(this.addr,t)}function Xv(i,t){i.uniform3uiv(this.addr,t)}function qv(i,t){i.uniform4uiv(this.addr,t)}function Yv(i,t,e){const n=this.cache,s=t.length,r=No(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Sf,r[o])}function Kv(i,t,e){const n=this.cache,s=t.length,r=No(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Tf,r[o])}function Jv(i,t,e){const n=this.cache,s=t.length,r=No(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Af,r[o])}function Zv(i,t,e){const n=this.cache,s=t.length,r=No(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Ef,r[o])}function Qv(i){switch(i){case 5126:return Uv;case 35664:return Ov;case 35665:return Nv;case 35666:return zv;case 35674:return kv;case 35675:return Fv;case 35676:return Bv;case 5124:case 35670:return Hv;case 35667:case 35671:return Vv;case 35668:case 35672:return Wv;case 35669:case 35673:return Gv;case 5125:return $v;case 36294:return jv;case 36295:return Xv;case 36296:return qv;case 35678:case 36198:case 36298:case 36306:case 35682:return Yv;case 35679:case 36299:case 36307:return Kv;case 35680:case 36300:case 36308:case 36293:return Jv;case 36289:case 36303:case 36311:case 36292:return Zv}}class tx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Iv(e.type)}}class ex{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Qv(e.type)}}class nx{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Ca=/(\w+)(\])?(\[|\.)?/g;function vh(i,t){i.seq.push(t),i.map[t.id]=t}function ix(i,t,e){const n=i.name,s=n.length;for(Ca.lastIndex=0;;){const r=Ca.exec(n),o=Ca.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){vh(e,l===void 0?new tx(a,i,t):new ex(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new nx(a),vh(e,u)),e=u}}}class fo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);ix(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function xh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const sx=37297;let rx=0;function ox(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function ax(i){const t=ae.getPrimaries(ae.workingColorSpace),e=ae.getPrimaries(i);let n;switch(t===e?n="":t===Eo&&e===wo?n="LinearDisplayP3ToLinearSRGB":t===wo&&e===Eo&&(n="LinearSRGBToLinearDisplayP3"),i){case Kn:case Uo:return[n,"LinearTransferOETF"];case Se:case Ic:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function _h(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+ox(i.getShaderSource(t),o)}else return s}function cx(i,t){const e=ax(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function lx(i,t){let e;switch(t){case _p:e="Linear";break;case yp:e="Reinhard";break;case Mp:e="OptimizedCineon";break;case Zu:e="ACESFilmic";break;case Sp:e="AgX";break;case bp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function hx(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(gs).join(`
`)}function ux(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(gs).join(`
`)}function fx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function dx(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function gs(i){return i!==""}function yh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Mh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const px=/^[ \t]*#include +<([\w\d./]+)>/gm;function uc(i){return i.replace(px,gx)}const mx=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function gx(i,t){let e=Xt[t];if(e===void 0){const n=mx.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return uc(e)}const vx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bh(i){return i.replace(vx,xx)}function xx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sh(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function _x(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ku?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ju?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Hn&&(t="SHADOWMAP_TYPE_VSM"),t}function yx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Es:case Ts:t="ENVMAP_TYPE_CUBE";break;case Io:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Mx(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ts:t="ENVMAP_MODE_REFRACTION";break}return t}function bx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Pc:t="ENVMAP_BLENDING_MULTIPLY";break;case vp:t="ENVMAP_BLENDING_MIX";break;case xp:t="ENVMAP_BLENDING_ADD";break}return t}function Sx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function wx(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=_x(e),l=yx(e),h=Mx(e),u=bx(e),d=Sx(e),f=e.isWebGL2?"":hx(e),g=ux(e),v=fx(r),m=s.createProgram();let p,x,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(gs).join(`
`),p.length>0&&(p+=`
`),x=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(gs).join(`
`),x.length>0&&(x+=`
`)):(p=[Sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(gs).join(`
`),x=[f,Sh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ci?"#define TONE_MAPPING":"",e.toneMapping!==ci?Xt.tonemapping_pars_fragment:"",e.toneMapping!==ci?lx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,cx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(gs).join(`
`)),o=uc(o),o=yh(o,e),o=Mh(o,e),a=uc(a),a=yh(a,e),a=Mh(a,e),o=bh(o),a=bh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,x=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Hl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Hl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const y=_+p+o,R=_+x+a,S=xh(s,s.VERTEX_SHADER,y),E=xh(s,s.FRAGMENT_SHADER,R);s.attachShader(m,S),s.attachShader(m,E),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function O(j){if(i.debug.checkShaderErrors){const et=s.getProgramInfoLog(m).trim(),U=s.getShaderInfoLog(S).trim(),F=s.getShaderInfoLog(E).trim();let q=!0,Z=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,S,E);else{const K=_h(s,S,"vertex"),Y=_h(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+et+`
`+K+`
`+Y)}else et!==""?console.warn("THREE.WebGLProgram: Program Info Log:",et):(U===""||F==="")&&(Z=!1);Z&&(j.diagnostics={runnable:q,programLog:et,vertexShader:{log:U,prefix:p},fragmentShader:{log:F,prefix:x}})}s.deleteShader(S),s.deleteShader(E),M=new fo(s,m),w=dx(s,m)}let M;this.getUniforms=function(){return M===void 0&&O(this),M};let w;this.getAttributes=function(){return w===void 0&&O(this),w};let z=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=s.getProgramParameter(m,sx)),z},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=rx++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=E,this}let Ex=0;class Tx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Ax(t),e.set(t,n)),n}}class Ax{constructor(t){this.id=Ex++,this.code=t,this.usedTimes=0}}function Rx(i,t,e,n,s,r,o){const a=new Uc,c=new Tx,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return M===0?"uv":`uv${M}`}function m(M,w,z,j,et){const U=j.fog,F=et.geometry,q=M.isMeshStandardMaterial?j.environment:null,Z=(M.isMeshStandardMaterial?e:t).get(M.envMap||q),K=Z&&Z.mapping===Io?Z.image.height:null,Y=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const Q=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,nt=Q!==void 0?Q.length:0;let gt=0;F.morphAttributes.position!==void 0&&(gt=1),F.morphAttributes.normal!==void 0&&(gt=2),F.morphAttributes.color!==void 0&&(gt=3);let G,J,mt,St;if(Y){const ve=En[Y];G=ve.vertexShader,J=ve.fragmentShader}else G=M.vertexShader,J=M.fragmentShader,c.update(M),mt=c.getVertexShaderID(M),St=c.getFragmentShaderID(M);const Mt=i.getRenderTarget(),Ft=et.isInstancedMesh===!0,kt=et.isBatchedMesh===!0,Lt=!!M.map,Kt=!!M.matcap,B=!!Z,ge=!!M.aoMap,Et=!!M.lightMap,It=!!M.bumpMap,_t=!!M.normalMap,ee=!!M.displacementMap,Dt=!!M.emissiveMap,A=!!M.metalnessMap,b=!!M.roughnessMap,k=M.anisotropy>0,it=M.clearcoat>0,tt=M.iridescence>0,ot=M.sheen>0,I=M.transmission>0,D=k&&!!M.anisotropyMap,$=it&&!!M.clearcoatMap,ht=it&&!!M.clearcoatNormalMap,ut=it&&!!M.clearcoatRoughnessMap,X=tt&&!!M.iridescenceMap,Wt=tt&&!!M.iridescenceThicknessMap,Ut=ot&&!!M.sheenColorMap,Ot=ot&&!!M.sheenRoughnessMap,Tt=!!M.specularMap,yt=!!M.specularColorMap,P=!!M.specularIntensityMap,at=I&&!!M.transmissionMap,Rt=I&&!!M.thicknessMap,wt=!!M.gradientMap,st=!!M.alphaMap,L=M.alphaTest>0,ct=!!M.alphaHash,vt=!!M.extensions,Nt=!!F.attributes.uv1,Pt=!!F.attributes.uv2,Qt=!!F.attributes.uv3;let te=ci;return M.toneMapped&&(Mt===null||Mt.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:h,shaderID:Y,shaderType:M.type,shaderName:M.name,vertexShader:G,fragmentShader:J,defines:M.defines,customVertexShaderID:mt,customFragmentShaderID:St,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:kt,instancing:Ft,instancingColor:Ft&&et.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:Mt===null?i.outputColorSpace:Mt.isXRRenderTarget===!0?Mt.texture.colorSpace:Kn,map:Lt,matcap:Kt,envMap:B,envMapMode:B&&Z.mapping,envMapCubeUVHeight:K,aoMap:ge,lightMap:Et,bumpMap:It,normalMap:_t,displacementMap:d&&ee,emissiveMap:Dt,normalMapObjectSpace:_t&&M.normalMapType===Op,normalMapTangentSpace:_t&&M.normalMapType===Dc,metalnessMap:A,roughnessMap:b,anisotropy:k,anisotropyMap:D,clearcoat:it,clearcoatMap:$,clearcoatNormalMap:ht,clearcoatRoughnessMap:ut,iridescence:tt,iridescenceMap:X,iridescenceThicknessMap:Wt,sheen:ot,sheenColorMap:Ut,sheenRoughnessMap:Ot,specularMap:Tt,specularColorMap:yt,specularIntensityMap:P,transmission:I,transmissionMap:at,thicknessMap:Rt,gradientMap:wt,opaque:M.transparent===!1&&M.blending===_s,alphaMap:st,alphaTest:L,alphaHash:ct,combine:M.combine,mapUv:Lt&&v(M.map.channel),aoMapUv:ge&&v(M.aoMap.channel),lightMapUv:Et&&v(M.lightMap.channel),bumpMapUv:It&&v(M.bumpMap.channel),normalMapUv:_t&&v(M.normalMap.channel),displacementMapUv:ee&&v(M.displacementMap.channel),emissiveMapUv:Dt&&v(M.emissiveMap.channel),metalnessMapUv:A&&v(M.metalnessMap.channel),roughnessMapUv:b&&v(M.roughnessMap.channel),anisotropyMapUv:D&&v(M.anisotropyMap.channel),clearcoatMapUv:$&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:ht&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ut&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:Wt&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&v(M.sheenRoughnessMap.channel),specularMapUv:Tt&&v(M.specularMap.channel),specularColorMapUv:yt&&v(M.specularColorMap.channel),specularIntensityMapUv:P&&v(M.specularIntensityMap.channel),transmissionMapUv:at&&v(M.transmissionMap.channel),thicknessMapUv:Rt&&v(M.thicknessMap.channel),alphaMapUv:st&&v(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(_t||k),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Nt,vertexUv2s:Pt,vertexUv3s:Qt,pointsUvs:et.isPoints===!0&&!!F.attributes.uv&&(Lt||st),fog:!!U,useFog:M.fog===!0,fogExp2:U&&U.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:et.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:gt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Lt&&M.map.isVideoTexture===!0&&ae.getTransfer(M.map.colorSpace)===ce,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===rn,flipSided:M.side===Je,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:vt&&M.extensions.derivatives===!0,extensionFragDepth:vt&&M.extensions.fragDepth===!0,extensionDrawBuffers:vt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:vt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:vt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function p(M){const w=[];if(M.shaderID?w.push(M.shaderID):(w.push(M.customVertexShaderID),w.push(M.customFragmentShaderID)),M.defines!==void 0)for(const z in M.defines)w.push(z),w.push(M.defines[z]);return M.isRawShaderMaterial===!1&&(x(w,M),_(w,M),w.push(i.outputColorSpace)),w.push(M.customProgramCacheKey),w.join()}function x(M,w){M.push(w.precision),M.push(w.outputColorSpace),M.push(w.envMapMode),M.push(w.envMapCubeUVHeight),M.push(w.mapUv),M.push(w.alphaMapUv),M.push(w.lightMapUv),M.push(w.aoMapUv),M.push(w.bumpMapUv),M.push(w.normalMapUv),M.push(w.displacementMapUv),M.push(w.emissiveMapUv),M.push(w.metalnessMapUv),M.push(w.roughnessMapUv),M.push(w.anisotropyMapUv),M.push(w.clearcoatMapUv),M.push(w.clearcoatNormalMapUv),M.push(w.clearcoatRoughnessMapUv),M.push(w.iridescenceMapUv),M.push(w.iridescenceThicknessMapUv),M.push(w.sheenColorMapUv),M.push(w.sheenRoughnessMapUv),M.push(w.specularMapUv),M.push(w.specularColorMapUv),M.push(w.specularIntensityMapUv),M.push(w.transmissionMapUv),M.push(w.thicknessMapUv),M.push(w.combine),M.push(w.fogExp2),M.push(w.sizeAttenuation),M.push(w.morphTargetsCount),M.push(w.morphAttributeCount),M.push(w.numDirLights),M.push(w.numPointLights),M.push(w.numSpotLights),M.push(w.numSpotLightMaps),M.push(w.numHemiLights),M.push(w.numRectAreaLights),M.push(w.numDirLightShadows),M.push(w.numPointLightShadows),M.push(w.numSpotLightShadows),M.push(w.numSpotLightShadowsWithMaps),M.push(w.numLightProbes),M.push(w.shadowMapType),M.push(w.toneMapping),M.push(w.numClippingPlanes),M.push(w.numClipIntersection),M.push(w.depthPacking)}function _(M,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),M.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function y(M){const w=g[M.type];let z;if(w){const j=En[w];z=hm.clone(j.uniforms)}else z=M.uniforms;return z}function R(M,w){let z;for(let j=0,et=l.length;j<et;j++){const U=l[j];if(U.cacheKey===w){z=U,++z.usedTimes;break}}return z===void 0&&(z=new wx(i,w,M,r),l.push(z)),z}function S(M){if(--M.usedTimes===0){const w=l.indexOf(M);l[w]=l[l.length-1],l.pop(),M.destroy()}}function E(M){c.remove(M)}function O(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:R,releaseProgram:S,releaseShaderCache:E,programs:l,dispose:O}}function Cx(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Px(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function wh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Eh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Px),n.length>1&&n.sort(d||wh),s.length>1&&s.sort(d||wh)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function Lx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Eh,i.set(n,[o])):s>=r.length?(o=new Eh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Dx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new qt};break;case"SpotLight":e={position:new C,direction:new C,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function Ix(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Ux=0;function Ox(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Nx(i,t){const e=new Dx,n=Ix(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new C);const r=new C,o=new re,a=new re;function c(h,u){let d=0,f=0,g=0;for(let j=0;j<9;j++)s.probe[j].set(0,0,0);let v=0,m=0,p=0,x=0,_=0,y=0,R=0,S=0,E=0,O=0,M=0;h.sort(Ox);const w=u===!0?Math.PI:1;for(let j=0,et=h.length;j<et;j++){const U=h[j],F=U.color,q=U.intensity,Z=U.distance,K=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)d+=F.r*q*w,f+=F.g*q*w,g+=F.b*q*w;else if(U.isLightProbe){for(let Y=0;Y<9;Y++)s.probe[Y].addScaledVector(U.sh.coefficients[Y],q);M++}else if(U.isDirectionalLight){const Y=e.get(U);if(Y.color.copy(U.color).multiplyScalar(U.intensity*w),U.castShadow){const Q=U.shadow,nt=n.get(U);nt.shadowBias=Q.bias,nt.shadowNormalBias=Q.normalBias,nt.shadowRadius=Q.radius,nt.shadowMapSize=Q.mapSize,s.directionalShadow[v]=nt,s.directionalShadowMap[v]=K,s.directionalShadowMatrix[v]=U.shadow.matrix,y++}s.directional[v]=Y,v++}else if(U.isSpotLight){const Y=e.get(U);Y.position.setFromMatrixPosition(U.matrixWorld),Y.color.copy(F).multiplyScalar(q*w),Y.distance=Z,Y.coneCos=Math.cos(U.angle),Y.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),Y.decay=U.decay,s.spot[p]=Y;const Q=U.shadow;if(U.map&&(s.spotLightMap[E]=U.map,E++,Q.updateMatrices(U),U.castShadow&&O++),s.spotLightMatrix[p]=Q.matrix,U.castShadow){const nt=n.get(U);nt.shadowBias=Q.bias,nt.shadowNormalBias=Q.normalBias,nt.shadowRadius=Q.radius,nt.shadowMapSize=Q.mapSize,s.spotShadow[p]=nt,s.spotShadowMap[p]=K,S++}p++}else if(U.isRectAreaLight){const Y=e.get(U);Y.color.copy(F).multiplyScalar(q),Y.halfWidth.set(U.width*.5,0,0),Y.halfHeight.set(0,U.height*.5,0),s.rectArea[x]=Y,x++}else if(U.isPointLight){const Y=e.get(U);if(Y.color.copy(U.color).multiplyScalar(U.intensity*w),Y.distance=U.distance,Y.decay=U.decay,U.castShadow){const Q=U.shadow,nt=n.get(U);nt.shadowBias=Q.bias,nt.shadowNormalBias=Q.normalBias,nt.shadowRadius=Q.radius,nt.shadowMapSize=Q.mapSize,nt.shadowCameraNear=Q.camera.near,nt.shadowCameraFar=Q.camera.far,s.pointShadow[m]=nt,s.pointShadowMap[m]=K,s.pointShadowMatrix[m]=U.shadow.matrix,R++}s.point[m]=Y,m++}else if(U.isHemisphereLight){const Y=e.get(U);Y.skyColor.copy(U.color).multiplyScalar(q*w),Y.groundColor.copy(U.groundColor).multiplyScalar(q*w),s.hemi[_]=Y,_++}}x>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=dt.LTC_FLOAT_1,s.rectAreaLTC2=dt.LTC_FLOAT_2):(s.rectAreaLTC1=dt.LTC_HALF_1,s.rectAreaLTC2=dt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=dt.LTC_FLOAT_1,s.rectAreaLTC2=dt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=dt.LTC_HALF_1,s.rectAreaLTC2=dt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;const z=s.hash;(z.directionalLength!==v||z.pointLength!==m||z.spotLength!==p||z.rectAreaLength!==x||z.hemiLength!==_||z.numDirectionalShadows!==y||z.numPointShadows!==R||z.numSpotShadows!==S||z.numSpotMaps!==E||z.numLightProbes!==M)&&(s.directional.length=v,s.spot.length=p,s.rectArea.length=x,s.point.length=m,s.hemi.length=_,s.directionalShadow.length=y,s.directionalShadowMap.length=y,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=S,s.spotShadowMap.length=S,s.directionalShadowMatrix.length=y,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=S+E-O,s.spotLightMap.length=E,s.numSpotLightShadowsWithMaps=O,s.numLightProbes=M,z.directionalLength=v,z.pointLength=m,z.spotLength=p,z.rectAreaLength=x,z.hemiLength=_,z.numDirectionalShadows=y,z.numPointShadows=R,z.numSpotShadows=S,z.numSpotMaps=E,z.numLightProbes=M,s.version=Ux++)}function l(h,u){let d=0,f=0,g=0,v=0,m=0;const p=u.matrixWorldInverse;for(let x=0,_=h.length;x<_;x++){const y=h[x];if(y.isDirectionalLight){const R=s.directional[d];R.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),d++}else if(y.isSpotLight){const R=s.spot[g];R.position.setFromMatrixPosition(y.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),g++}else if(y.isRectAreaLight){const R=s.rectArea[v];R.position.setFromMatrixPosition(y.matrixWorld),R.position.applyMatrix4(p),a.identity(),o.copy(y.matrixWorld),o.premultiply(p),a.extractRotation(o),R.halfWidth.set(y.width*.5,0,0),R.halfHeight.set(0,y.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){const R=s.point[f];R.position.setFromMatrixPosition(y.matrixWorld),R.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const R=s.hemi[m];R.direction.setFromMatrixPosition(y.matrixWorld),R.direction.transformDirection(p),m++}}}return{setup:c,setupView:l,state:s}}function Th(i,t){const e=new Nx(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function zx(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let c;return a===void 0?(c=new Th(i,t),e.set(r,[c])):o>=a.length?(c=new Th(i,t),a.push(c)):c=a[o],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class kx extends Wi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ip,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Fx extends Wi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Bx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hx=`uniform sampler2D shadow_pass;
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
}`;function Vx(i,t,e){let n=new Oc;const s=new pt,r=new pt,o=new le,a=new kx({depthPacking:Up}),c=new Fx,l={},h=e.maxTextureSize,u={[pi]:Je,[Je]:pi,[rn]:rn},d=new zi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pt},radius:{value:4}},vertexShader:Bx,fragmentShader:Hx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new de;g.setAttribute("position",new an(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Gt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ku;let p=this.type;this.render=function(S,E,O){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const M=i.getRenderTarget(),w=i.getActiveCubeFace(),z=i.getActiveMipmapLevel(),j=i.state;j.setBlending(ai),j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);const et=p!==Hn&&this.type===Hn,U=p===Hn&&this.type!==Hn;for(let F=0,q=S.length;F<q;F++){const Z=S[F],K=Z.shadow;if(K===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;s.copy(K.mapSize);const Y=K.getFrameExtents();if(s.multiply(Y),r.copy(K.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Y.x),s.x=r.x*Y.x,K.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Y.y),s.y=r.y*Y.y,K.mapSize.y=r.y)),K.map===null||et===!0||U===!0){const nt=this.type!==Hn?{minFilter:Oe,magFilter:Oe}:{};K.map!==null&&K.map.dispose(),K.map=new Ni(s.x,s.y,nt),K.map.texture.name=Z.name+".shadowMap",K.camera.updateProjectionMatrix()}i.setRenderTarget(K.map),i.clear();const Q=K.getViewportCount();for(let nt=0;nt<Q;nt++){const gt=K.getViewport(nt);o.set(r.x*gt.x,r.y*gt.y,r.x*gt.z,r.y*gt.w),j.viewport(o),K.updateMatrices(Z,nt),n=K.getFrustum(),y(E,O,K.camera,Z,this.type)}K.isPointLightShadow!==!0&&this.type===Hn&&x(K,O),K.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,w,z)};function x(S,E){const O=t.update(v);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Ni(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,O,d,v,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,O,f,v,null)}function _(S,E,O,M){let w=null;const z=O.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(z!==void 0)w=z;else if(w=O.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const j=w.uuid,et=E.uuid;let U=l[j];U===void 0&&(U={},l[j]=U);let F=U[et];F===void 0&&(F=w.clone(),U[et]=F,E.addEventListener("dispose",R)),w=F}if(w.visible=E.visible,w.wireframe=E.wireframe,M===Hn?w.side=E.shadowSide!==null?E.shadowSide:E.side:w.side=E.shadowSide!==null?E.shadowSide:u[E.side],w.alphaMap=E.alphaMap,w.alphaTest=E.alphaTest,w.map=E.map,w.clipShadows=E.clipShadows,w.clippingPlanes=E.clippingPlanes,w.clipIntersection=E.clipIntersection,w.displacementMap=E.displacementMap,w.displacementScale=E.displacementScale,w.displacementBias=E.displacementBias,w.wireframeLinewidth=E.wireframeLinewidth,w.linewidth=E.linewidth,O.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const j=i.properties.get(w);j.light=O}return w}function y(S,E,O,M,w){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&w===Hn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,S.matrixWorld);const et=t.update(S),U=S.material;if(Array.isArray(U)){const F=et.groups;for(let q=0,Z=F.length;q<Z;q++){const K=F[q],Y=U[K.materialIndex];if(Y&&Y.visible){const Q=_(S,Y,M,w);S.onBeforeShadow(i,S,E,O,et,Q,K),i.renderBufferDirect(O,null,et,Q,S,K),S.onAfterShadow(i,S,E,O,et,Q,K)}}}else if(U.visible){const F=_(S,U,M,w);S.onBeforeShadow(i,S,E,O,et,F,null),i.renderBufferDirect(O,null,et,F,S,null),S.onAfterShadow(i,S,E,O,et,F,null)}}const j=S.children;for(let et=0,U=j.length;et<U;et++)y(j[et],E,O,M,w)}function R(S){S.target.removeEventListener("dispose",R);for(const O in l){const M=l[O],w=S.target.uuid;w in M&&(M[w].dispose(),delete M[w])}}}function Wx(i,t,e){const n=e.isWebGL2;function s(){let L=!1;const ct=new le;let vt=null;const Nt=new le(0,0,0,0);return{setMask:function(Pt){vt!==Pt&&!L&&(i.colorMask(Pt,Pt,Pt,Pt),vt=Pt)},setLocked:function(Pt){L=Pt},setClear:function(Pt,Qt,te,pe,ve){ve===!0&&(Pt*=pe,Qt*=pe,te*=pe),ct.set(Pt,Qt,te,pe),Nt.equals(ct)===!1&&(i.clearColor(Pt,Qt,te,pe),Nt.copy(ct))},reset:function(){L=!1,vt=null,Nt.set(-1,0,0,0)}}}function r(){let L=!1,ct=null,vt=null,Nt=null;return{setTest:function(Pt){Pt?kt(i.DEPTH_TEST):Lt(i.DEPTH_TEST)},setMask:function(Pt){ct!==Pt&&!L&&(i.depthMask(Pt),ct=Pt)},setFunc:function(Pt){if(vt!==Pt){switch(Pt){case hp:i.depthFunc(i.NEVER);break;case up:i.depthFunc(i.ALWAYS);break;case fp:i.depthFunc(i.LESS);break;case Mo:i.depthFunc(i.LEQUAL);break;case dp:i.depthFunc(i.EQUAL);break;case pp:i.depthFunc(i.GEQUAL);break;case mp:i.depthFunc(i.GREATER);break;case gp:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}vt=Pt}},setLocked:function(Pt){L=Pt},setClear:function(Pt){Nt!==Pt&&(i.clearDepth(Pt),Nt=Pt)},reset:function(){L=!1,ct=null,vt=null,Nt=null}}}function o(){let L=!1,ct=null,vt=null,Nt=null,Pt=null,Qt=null,te=null,pe=null,ve=null;return{setTest:function(ne){L||(ne?kt(i.STENCIL_TEST):Lt(i.STENCIL_TEST))},setMask:function(ne){ct!==ne&&!L&&(i.stencilMask(ne),ct=ne)},setFunc:function(ne,ye,Sn){(vt!==ne||Nt!==ye||Pt!==Sn)&&(i.stencilFunc(ne,ye,Sn),vt=ne,Nt=ye,Pt=Sn)},setOp:function(ne,ye,Sn){(Qt!==ne||te!==ye||pe!==Sn)&&(i.stencilOp(ne,ye,Sn),Qt=ne,te=ye,pe=Sn)},setLocked:function(ne){L=ne},setClear:function(ne){ve!==ne&&(i.clearStencil(ne),ve=ne)},reset:function(){L=!1,ct=null,vt=null,Nt=null,Pt=null,Qt=null,te=null,pe=null,ve=null}}}const a=new s,c=new r,l=new o,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,v=[],m=null,p=!1,x=null,_=null,y=null,R=null,S=null,E=null,O=null,M=new qt(0,0,0),w=0,z=!1,j=null,et=null,U=null,F=null,q=null;const Z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,Y=0;const Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(Q)[1]),K=Y>=1):Q.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),K=Y>=2);let nt=null,gt={};const G=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),mt=new le().fromArray(G),St=new le().fromArray(J);function Mt(L,ct,vt,Nt){const Pt=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(L,Qt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<vt;te++)n&&(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)?i.texImage3D(ct,0,i.RGBA,1,1,Nt,0,i.RGBA,i.UNSIGNED_BYTE,Pt):i.texImage2D(ct+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Pt);return Qt}const Ft={};Ft[i.TEXTURE_2D]=Mt(i.TEXTURE_2D,i.TEXTURE_2D,1),Ft[i.TEXTURE_CUBE_MAP]=Mt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ft[i.TEXTURE_2D_ARRAY]=Mt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ft[i.TEXTURE_3D]=Mt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),kt(i.DEPTH_TEST),c.setFunc(Mo),Dt(!1),A(al),kt(i.CULL_FACE),_t(ai);function kt(L){d[L]!==!0&&(i.enable(L),d[L]=!0)}function Lt(L){d[L]!==!1&&(i.disable(L),d[L]=!1)}function Kt(L,ct){return f[L]!==ct?(i.bindFramebuffer(L,ct),f[L]=ct,n&&(L===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ct),L===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ct)),!0):!1}function B(L,ct){let vt=v,Nt=!1;if(L)if(vt=g.get(ct),vt===void 0&&(vt=[],g.set(ct,vt)),L.isWebGLMultipleRenderTargets){const Pt=L.texture;if(vt.length!==Pt.length||vt[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=Pt.length;Qt<te;Qt++)vt[Qt]=i.COLOR_ATTACHMENT0+Qt;vt.length=Pt.length,Nt=!0}}else vt[0]!==i.COLOR_ATTACHMENT0&&(vt[0]=i.COLOR_ATTACHMENT0,Nt=!0);else vt[0]!==i.BACK&&(vt[0]=i.BACK,Nt=!0);Nt&&(e.isWebGL2?i.drawBuffers(vt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(vt))}function ge(L){return m!==L?(i.useProgram(L),m=L,!0):!1}const Et={[Ai]:i.FUNC_ADD,[Yd]:i.FUNC_SUBTRACT,[Kd]:i.FUNC_REVERSE_SUBTRACT};if(n)Et[ul]=i.MIN,Et[fl]=i.MAX;else{const L=t.get("EXT_blend_minmax");L!==null&&(Et[ul]=L.MIN_EXT,Et[fl]=L.MAX_EXT)}const It={[Jd]:i.ZERO,[Zd]:i.ONE,[Qd]:i.SRC_COLOR,[ic]:i.SRC_ALPHA,[rp]:i.SRC_ALPHA_SATURATE,[ip]:i.DST_COLOR,[ep]:i.DST_ALPHA,[tp]:i.ONE_MINUS_SRC_COLOR,[sc]:i.ONE_MINUS_SRC_ALPHA,[sp]:i.ONE_MINUS_DST_COLOR,[np]:i.ONE_MINUS_DST_ALPHA,[op]:i.CONSTANT_COLOR,[ap]:i.ONE_MINUS_CONSTANT_COLOR,[cp]:i.CONSTANT_ALPHA,[lp]:i.ONE_MINUS_CONSTANT_ALPHA};function _t(L,ct,vt,Nt,Pt,Qt,te,pe,ve,ne){if(L===ai){p===!0&&(Lt(i.BLEND),p=!1);return}if(p===!1&&(kt(i.BLEND),p=!0),L!==qd){if(L!==x||ne!==z){if((_!==Ai||S!==Ai)&&(i.blendEquation(i.FUNC_ADD),_=Ai,S=Ai),ne)switch(L){case _s:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cl:i.blendFunc(i.ONE,i.ONE);break;case ll:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case _s:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ll:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}y=null,R=null,E=null,O=null,M.set(0,0,0),w=0,x=L,z=ne}return}Pt=Pt||ct,Qt=Qt||vt,te=te||Nt,(ct!==_||Pt!==S)&&(i.blendEquationSeparate(Et[ct],Et[Pt]),_=ct,S=Pt),(vt!==y||Nt!==R||Qt!==E||te!==O)&&(i.blendFuncSeparate(It[vt],It[Nt],It[Qt],It[te]),y=vt,R=Nt,E=Qt,O=te),(pe.equals(M)===!1||ve!==w)&&(i.blendColor(pe.r,pe.g,pe.b,ve),M.copy(pe),w=ve),x=L,z=!1}function ee(L,ct){L.side===rn?Lt(i.CULL_FACE):kt(i.CULL_FACE);let vt=L.side===Je;ct&&(vt=!vt),Dt(vt),L.blending===_s&&L.transparent===!1?_t(ai):_t(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),c.setFunc(L.depthFunc),c.setTest(L.depthTest),c.setMask(L.depthWrite),a.setMask(L.colorWrite);const Nt=L.stencilWrite;l.setTest(Nt),Nt&&(l.setMask(L.stencilWriteMask),l.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),l.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),k(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?kt(i.SAMPLE_ALPHA_TO_COVERAGE):Lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Dt(L){j!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),j=L)}function A(L){L!==jd?(kt(i.CULL_FACE),L!==et&&(L===al?i.cullFace(i.BACK):L===Xd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Lt(i.CULL_FACE),et=L}function b(L){L!==U&&(K&&i.lineWidth(L),U=L)}function k(L,ct,vt){L?(kt(i.POLYGON_OFFSET_FILL),(F!==ct||q!==vt)&&(i.polygonOffset(ct,vt),F=ct,q=vt)):Lt(i.POLYGON_OFFSET_FILL)}function it(L){L?kt(i.SCISSOR_TEST):Lt(i.SCISSOR_TEST)}function tt(L){L===void 0&&(L=i.TEXTURE0+Z-1),nt!==L&&(i.activeTexture(L),nt=L)}function ot(L,ct,vt){vt===void 0&&(nt===null?vt=i.TEXTURE0+Z-1:vt=nt);let Nt=gt[vt];Nt===void 0&&(Nt={type:void 0,texture:void 0},gt[vt]=Nt),(Nt.type!==L||Nt.texture!==ct)&&(nt!==vt&&(i.activeTexture(vt),nt=vt),i.bindTexture(L,ct||Ft[L]),Nt.type=L,Nt.texture=ct)}function I(){const L=gt[nt];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function D(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function $(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ht(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ut(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function X(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Wt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ut(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ot(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Tt(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function yt(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function P(L){mt.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),mt.copy(L))}function at(L){St.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),St.copy(L))}function Rt(L,ct){let vt=u.get(ct);vt===void 0&&(vt=new WeakMap,u.set(ct,vt));let Nt=vt.get(L);Nt===void 0&&(Nt=i.getUniformBlockIndex(ct,L.name),vt.set(L,Nt))}function wt(L,ct){const Nt=u.get(ct).get(L);h.get(ct)!==Nt&&(i.uniformBlockBinding(ct,Nt,L.__bindingPointIndex),h.set(ct,Nt))}function st(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},nt=null,gt={},f={},g=new WeakMap,v=[],m=null,p=!1,x=null,_=null,y=null,R=null,S=null,E=null,O=null,M=new qt(0,0,0),w=0,z=!1,j=null,et=null,U=null,F=null,q=null,mt.set(0,0,i.canvas.width,i.canvas.height),St.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:kt,disable:Lt,bindFramebuffer:Kt,drawBuffers:B,useProgram:ge,setBlending:_t,setMaterial:ee,setFlipSided:Dt,setCullFace:A,setLineWidth:b,setPolygonOffset:k,setScissorTest:it,activeTexture:tt,bindTexture:ot,unbindTexture:I,compressedTexImage2D:D,compressedTexImage3D:$,texImage2D:Tt,texImage3D:yt,updateUBOMapping:Rt,uniformBlockBinding:wt,texStorage2D:Ut,texStorage3D:Ot,texSubImage2D:ht,texSubImage3D:ut,compressedTexSubImage2D:X,compressedTexSubImage3D:Wt,scissor:P,viewport:at,reset:st}}function Gx(i,t,e,n,s,r,o){const a=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,b){return f?new OffscreenCanvas(A,b):Ao("canvas")}function v(A,b,k,it){let tt=1;if((A.width>it||A.height>it)&&(tt=it/Math.max(A.width,A.height)),tt<1||b===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const ot=b?hc:Math.floor,I=ot(tt*A.width),D=ot(tt*A.height);u===void 0&&(u=g(I,D));const $=k?g(I,D):u;return $.width=I,$.height=D,$.getContext("2d").drawImage(A,0,0,I,D),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+I+"x"+D+")."),$}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function m(A){return Vl(A.width)&&Vl(A.height)}function p(A){return a?!1:A.wrapS!==yn||A.wrapT!==yn||A.minFilter!==Oe&&A.minFilter!==Ke}function x(A,b){return A.generateMipmaps&&b&&A.minFilter!==Oe&&A.minFilter!==Ke}function _(A){i.generateMipmap(A)}function y(A,b,k,it,tt=!1){if(a===!1)return b;if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let ot=b;if(b===i.RED&&(k===i.FLOAT&&(ot=i.R32F),k===i.HALF_FLOAT&&(ot=i.R16F),k===i.UNSIGNED_BYTE&&(ot=i.R8)),b===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(ot=i.R8UI),k===i.UNSIGNED_SHORT&&(ot=i.R16UI),k===i.UNSIGNED_INT&&(ot=i.R32UI),k===i.BYTE&&(ot=i.R8I),k===i.SHORT&&(ot=i.R16I),k===i.INT&&(ot=i.R32I)),b===i.RG&&(k===i.FLOAT&&(ot=i.RG32F),k===i.HALF_FLOAT&&(ot=i.RG16F),k===i.UNSIGNED_BYTE&&(ot=i.RG8)),b===i.RGBA){const I=tt?So:ae.getTransfer(it);k===i.FLOAT&&(ot=i.RGBA32F),k===i.HALF_FLOAT&&(ot=i.RGBA16F),k===i.UNSIGNED_BYTE&&(ot=I===ce?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(ot=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(ot=i.RGB5_A1)}return(ot===i.R16F||ot===i.R32F||ot===i.RG16F||ot===i.RG32F||ot===i.RGBA16F||ot===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function R(A,b,k){return x(A,k)===!0||A.isFramebufferTexture&&A.minFilter!==Oe&&A.minFilter!==Ke?Math.log2(Math.max(b.width,b.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?b.mipmaps.length:1}function S(A){return A===Oe||A===dl||A===ea?i.NEAREST:i.LINEAR}function E(A){const b=A.target;b.removeEventListener("dispose",E),M(b),b.isVideoTexture&&h.delete(b)}function O(A){const b=A.target;b.removeEventListener("dispose",O),z(b)}function M(A){const b=n.get(A);if(b.__webglInit===void 0)return;const k=A.source,it=d.get(k);if(it){const tt=it[b.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&w(A),Object.keys(it).length===0&&d.delete(k)}n.remove(A)}function w(A){const b=n.get(A);i.deleteTexture(b.__webglTexture);const k=A.source,it=d.get(k);delete it[b.__cacheKey],o.memory.textures--}function z(A){const b=A.texture,k=n.get(A),it=n.get(b);if(it.__webglTexture!==void 0&&(i.deleteTexture(it.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(k.__webglFramebuffer[tt]))for(let ot=0;ot<k.__webglFramebuffer[tt].length;ot++)i.deleteFramebuffer(k.__webglFramebuffer[tt][ot]);else i.deleteFramebuffer(k.__webglFramebuffer[tt]);k.__webglDepthbuffer&&i.deleteRenderbuffer(k.__webglDepthbuffer[tt])}else{if(Array.isArray(k.__webglFramebuffer))for(let tt=0;tt<k.__webglFramebuffer.length;tt++)i.deleteFramebuffer(k.__webglFramebuffer[tt]);else i.deleteFramebuffer(k.__webglFramebuffer);if(k.__webglDepthbuffer&&i.deleteRenderbuffer(k.__webglDepthbuffer),k.__webglMultisampledFramebuffer&&i.deleteFramebuffer(k.__webglMultisampledFramebuffer),k.__webglColorRenderbuffer)for(let tt=0;tt<k.__webglColorRenderbuffer.length;tt++)k.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(k.__webglColorRenderbuffer[tt]);k.__webglDepthRenderbuffer&&i.deleteRenderbuffer(k.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let tt=0,ot=b.length;tt<ot;tt++){const I=n.get(b[tt]);I.__webglTexture&&(i.deleteTexture(I.__webglTexture),o.memory.textures--),n.remove(b[tt])}n.remove(b),n.remove(A)}let j=0;function et(){j=0}function U(){const A=j;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),j+=1,A}function F(A){const b=[];return b.push(A.wrapS),b.push(A.wrapT),b.push(A.wrapR||0),b.push(A.magFilter),b.push(A.minFilter),b.push(A.anisotropy),b.push(A.internalFormat),b.push(A.format),b.push(A.type),b.push(A.generateMipmaps),b.push(A.premultiplyAlpha),b.push(A.flipY),b.push(A.unpackAlignment),b.push(A.colorSpace),b.join()}function q(A,b){const k=n.get(A);if(A.isVideoTexture&&ee(A),A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){const it=A.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{mt(k,A,b);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+b)}function Z(A,b){const k=n.get(A);if(A.version>0&&k.__version!==A.version){mt(k,A,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+b)}function K(A,b){const k=n.get(A);if(A.version>0&&k.__version!==A.version){mt(k,A,b);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+b)}function Y(A,b){const k=n.get(A);if(A.version>0&&k.__version!==A.version){St(k,A,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+b)}const Q={[bo]:i.REPEAT,[yn]:i.CLAMP_TO_EDGE,[ac]:i.MIRRORED_REPEAT},nt={[Oe]:i.NEAREST,[dl]:i.NEAREST_MIPMAP_NEAREST,[ea]:i.NEAREST_MIPMAP_LINEAR,[Ke]:i.LINEAR,[wp]:i.LINEAR_MIPMAP_NEAREST,[fr]:i.LINEAR_MIPMAP_LINEAR},gt={[Np]:i.NEVER,[Vp]:i.ALWAYS,[zp]:i.LESS,[lf]:i.LEQUAL,[kp]:i.EQUAL,[Hp]:i.GEQUAL,[Fp]:i.GREATER,[Bp]:i.NOTEQUAL};function G(A,b,k){if(k?(i.texParameteri(A,i.TEXTURE_WRAP_S,Q[b.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Q[b.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Q[b.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,nt[b.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,nt[b.minFilter])):(i.texParameteri(A,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(A,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(b.wrapS!==yn||b.wrapT!==yn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(A,i.TEXTURE_MAG_FILTER,S(b.magFilter)),i.texParameteri(A,i.TEXTURE_MIN_FILTER,S(b.minFilter)),b.minFilter!==Oe&&b.minFilter!==Ke&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,gt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const it=t.get("EXT_texture_filter_anisotropic");if(b.magFilter===Oe||b.minFilter!==ea&&b.minFilter!==fr||b.type===oi&&t.has("OES_texture_float_linear")===!1||a===!1&&b.type===dr&&t.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||n.get(b).__currentAnisotropy)&&(i.texParameterf(A,it.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy)}}function J(A,b){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,b.addEventListener("dispose",E));const it=b.source;let tt=d.get(it);tt===void 0&&(tt={},d.set(it,tt));const ot=F(b);if(ot!==A.__cacheKey){tt[ot]===void 0&&(tt[ot]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,k=!0),tt[ot].usedTimes++;const I=tt[A.__cacheKey];I!==void 0&&(tt[A.__cacheKey].usedTimes--,I.usedTimes===0&&w(b)),A.__cacheKey=ot,A.__webglTexture=tt[ot].texture}return k}function mt(A,b,k){let it=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(it=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(it=i.TEXTURE_3D);const tt=J(A,b),ot=b.source;e.bindTexture(it,A.__webglTexture,i.TEXTURE0+k);const I=n.get(ot);if(ot.version!==I.__version||tt===!0){e.activeTexture(i.TEXTURE0+k);const D=ae.getPrimaries(ae.workingColorSpace),$=b.colorSpace===un?null:ae.getPrimaries(b.colorSpace),ht=b.colorSpace===un||D===$?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ht);const ut=p(b)&&m(b.image)===!1;let X=v(b.image,ut,!1,s.maxTextureSize);X=Dt(b,X);const Wt=m(X)||a,Ut=r.convert(b.format,b.colorSpace);let Ot=r.convert(b.type),Tt=y(b.internalFormat,Ut,Ot,b.colorSpace,b.isVideoTexture);G(it,b,Wt);let yt;const P=b.mipmaps,at=a&&b.isVideoTexture!==!0&&Tt!==af,Rt=I.__version===void 0||tt===!0,wt=R(b,X,Wt);if(b.isDepthTexture)Tt=i.DEPTH_COMPONENT,a?b.type===oi?Tt=i.DEPTH_COMPONENT32F:b.type===ri?Tt=i.DEPTH_COMPONENT24:b.type===Li?Tt=i.DEPTH24_STENCIL8:Tt=i.DEPTH_COMPONENT16:b.type===oi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===Di&&Tt===i.DEPTH_COMPONENT&&b.type!==Lc&&b.type!==ri&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=ri,Ot=r.convert(b.type)),b.format===As&&Tt===i.DEPTH_COMPONENT&&(Tt=i.DEPTH_STENCIL,b.type!==Li&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=Li,Ot=r.convert(b.type))),Rt&&(at?e.texStorage2D(i.TEXTURE_2D,1,Tt,X.width,X.height):e.texImage2D(i.TEXTURE_2D,0,Tt,X.width,X.height,0,Ut,Ot,null));else if(b.isDataTexture)if(P.length>0&&Wt){at&&Rt&&e.texStorage2D(i.TEXTURE_2D,wt,Tt,P[0].width,P[0].height);for(let st=0,L=P.length;st<L;st++)yt=P[st],at?e.texSubImage2D(i.TEXTURE_2D,st,0,0,yt.width,yt.height,Ut,Ot,yt.data):e.texImage2D(i.TEXTURE_2D,st,Tt,yt.width,yt.height,0,Ut,Ot,yt.data);b.generateMipmaps=!1}else at?(Rt&&e.texStorage2D(i.TEXTURE_2D,wt,Tt,X.width,X.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,X.width,X.height,Ut,Ot,X.data)):e.texImage2D(i.TEXTURE_2D,0,Tt,X.width,X.height,0,Ut,Ot,X.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){at&&Rt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Tt,P[0].width,P[0].height,X.depth);for(let st=0,L=P.length;st<L;st++)yt=P[st],b.format!==hn?Ut!==null?at?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,yt.width,yt.height,X.depth,Ut,yt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,st,Tt,yt.width,yt.height,X.depth,0,yt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?e.texSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,yt.width,yt.height,X.depth,Ut,Ot,yt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,st,Tt,yt.width,yt.height,X.depth,0,Ut,Ot,yt.data)}else{at&&Rt&&e.texStorage2D(i.TEXTURE_2D,wt,Tt,P[0].width,P[0].height);for(let st=0,L=P.length;st<L;st++)yt=P[st],b.format!==hn?Ut!==null?at?e.compressedTexSubImage2D(i.TEXTURE_2D,st,0,0,yt.width,yt.height,Ut,yt.data):e.compressedTexImage2D(i.TEXTURE_2D,st,Tt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?e.texSubImage2D(i.TEXTURE_2D,st,0,0,yt.width,yt.height,Ut,Ot,yt.data):e.texImage2D(i.TEXTURE_2D,st,Tt,yt.width,yt.height,0,Ut,Ot,yt.data)}else if(b.isDataArrayTexture)at?(Rt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Tt,X.width,X.height,X.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,X.width,X.height,X.depth,Ut,Ot,X.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,X.width,X.height,X.depth,0,Ut,Ot,X.data);else if(b.isData3DTexture)at?(Rt&&e.texStorage3D(i.TEXTURE_3D,wt,Tt,X.width,X.height,X.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,X.width,X.height,X.depth,Ut,Ot,X.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,X.width,X.height,X.depth,0,Ut,Ot,X.data);else if(b.isFramebufferTexture){if(Rt)if(at)e.texStorage2D(i.TEXTURE_2D,wt,Tt,X.width,X.height);else{let st=X.width,L=X.height;for(let ct=0;ct<wt;ct++)e.texImage2D(i.TEXTURE_2D,ct,Tt,st,L,0,Ut,Ot,null),st>>=1,L>>=1}}else if(P.length>0&&Wt){at&&Rt&&e.texStorage2D(i.TEXTURE_2D,wt,Tt,P[0].width,P[0].height);for(let st=0,L=P.length;st<L;st++)yt=P[st],at?e.texSubImage2D(i.TEXTURE_2D,st,0,0,Ut,Ot,yt):e.texImage2D(i.TEXTURE_2D,st,Tt,Ut,Ot,yt);b.generateMipmaps=!1}else at?(Rt&&e.texStorage2D(i.TEXTURE_2D,wt,Tt,X.width,X.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Ut,Ot,X)):e.texImage2D(i.TEXTURE_2D,0,Tt,Ut,Ot,X);x(b,Wt)&&_(it),I.__version=ot.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function St(A,b,k){if(b.image.length!==6)return;const it=J(A,b),tt=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+k);const ot=n.get(tt);if(tt.version!==ot.__version||it===!0){e.activeTexture(i.TEXTURE0+k);const I=ae.getPrimaries(ae.workingColorSpace),D=b.colorSpace===un?null:ae.getPrimaries(b.colorSpace),$=b.colorSpace===un||I===D?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);const ht=b.isCompressedTexture||b.image[0].isCompressedTexture,ut=b.image[0]&&b.image[0].isDataTexture,X=[];for(let st=0;st<6;st++)!ht&&!ut?X[st]=v(b.image[st],!1,!0,s.maxCubemapSize):X[st]=ut?b.image[st].image:b.image[st],X[st]=Dt(b,X[st]);const Wt=X[0],Ut=m(Wt)||a,Ot=r.convert(b.format,b.colorSpace),Tt=r.convert(b.type),yt=y(b.internalFormat,Ot,Tt,b.colorSpace),P=a&&b.isVideoTexture!==!0,at=ot.__version===void 0||it===!0;let Rt=R(b,Wt,Ut);G(i.TEXTURE_CUBE_MAP,b,Ut);let wt;if(ht){P&&at&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Rt,yt,Wt.width,Wt.height);for(let st=0;st<6;st++){wt=X[st].mipmaps;for(let L=0;L<wt.length;L++){const ct=wt[L];b.format!==hn?Ot!==null?P?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,0,0,ct.width,ct.height,Ot,ct.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,yt,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,0,0,ct.width,ct.height,Ot,Tt,ct.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,yt,ct.width,ct.height,0,Ot,Tt,ct.data)}}}else{wt=b.mipmaps,P&&at&&(wt.length>0&&Rt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Rt,yt,X[0].width,X[0].height));for(let st=0;st<6;st++)if(ut){P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,X[st].width,X[st].height,Ot,Tt,X[st].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,yt,X[st].width,X[st].height,0,Ot,Tt,X[st].data);for(let L=0;L<wt.length;L++){const vt=wt[L].image[st].image;P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,0,0,vt.width,vt.height,Ot,Tt,vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,yt,vt.width,vt.height,0,Ot,Tt,vt.data)}}else{P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Ot,Tt,X[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,yt,Ot,Tt,X[st]);for(let L=0;L<wt.length;L++){const ct=wt[L];P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,0,0,Ot,Tt,ct.image[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,yt,Ot,Tt,ct.image[st])}}}x(b,Ut)&&_(i.TEXTURE_CUBE_MAP),ot.__version=tt.version,b.onUpdate&&b.onUpdate(b)}A.__version=b.version}function Mt(A,b,k,it,tt,ot){const I=r.convert(k.format,k.colorSpace),D=r.convert(k.type),$=y(k.internalFormat,I,D,k.colorSpace);if(!n.get(b).__hasExternalTextures){const ut=Math.max(1,b.width>>ot),X=Math.max(1,b.height>>ot);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,ot,$,ut,X,b.depth,0,I,D,null):e.texImage2D(tt,ot,$,ut,X,0,I,D,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),_t(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,tt,n.get(k).__webglTexture,0,It(b)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,it,tt,n.get(k).__webglTexture,ot),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(A,b,k){if(i.bindRenderbuffer(i.RENDERBUFFER,A),b.depthBuffer&&!b.stencilBuffer){let it=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(k||_t(b)){const tt=b.depthTexture;tt&&tt.isDepthTexture&&(tt.type===oi?it=i.DEPTH_COMPONENT32F:tt.type===ri&&(it=i.DEPTH_COMPONENT24));const ot=It(b);_t(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,it,b.width,b.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,it,b.width,b.height)}else i.renderbufferStorage(i.RENDERBUFFER,it,b.width,b.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,A)}else if(b.depthBuffer&&b.stencilBuffer){const it=It(b);k&&_t(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,b.width,b.height):_t(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,A)}else{const it=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let tt=0;tt<it.length;tt++){const ot=it[tt],I=r.convert(ot.format,ot.colorSpace),D=r.convert(ot.type),$=y(ot.internalFormat,I,D,ot.colorSpace),ht=It(b);k&&_t(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,$,b.width,b.height):_t(b)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,$,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,$,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function kt(A,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q(b.depthTexture,0);const it=n.get(b.depthTexture).__webglTexture,tt=It(b);if(b.depthTexture.format===Di)_t(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(b.depthTexture.format===As)_t(b)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function Lt(A){const b=n.get(A),k=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!b.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");kt(b.__webglFramebuffer,A)}else if(k){b.__webglDepthbuffer=[];for(let it=0;it<6;it++)e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[it]),b.__webglDepthbuffer[it]=i.createRenderbuffer(),Ft(b.__webglDepthbuffer[it],A,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=i.createRenderbuffer(),Ft(b.__webglDepthbuffer,A,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Kt(A,b,k){const it=n.get(A);b!==void 0&&Mt(it.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Lt(A)}function B(A){const b=A.texture,k=n.get(A),it=n.get(b);A.addEventListener("dispose",O),A.isWebGLMultipleRenderTargets!==!0&&(it.__webglTexture===void 0&&(it.__webglTexture=i.createTexture()),it.__version=b.version,o.memory.textures++);const tt=A.isWebGLCubeRenderTarget===!0,ot=A.isWebGLMultipleRenderTargets===!0,I=m(A)||a;if(tt){k.__webglFramebuffer=[];for(let D=0;D<6;D++)if(a&&b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer[D]=[];for(let $=0;$<b.mipmaps.length;$++)k.__webglFramebuffer[D][$]=i.createFramebuffer()}else k.__webglFramebuffer[D]=i.createFramebuffer()}else{if(a&&b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer=[];for(let D=0;D<b.mipmaps.length;D++)k.__webglFramebuffer[D]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(ot)if(s.drawBuffers){const D=A.texture;for(let $=0,ht=D.length;$<ht;$++){const ut=n.get(D[$]);ut.__webglTexture===void 0&&(ut.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&_t(A)===!1){const D=ot?b:[b];k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let $=0;$<D.length;$++){const ht=D[$];k.__webglColorRenderbuffer[$]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[$]);const ut=r.convert(ht.format,ht.colorSpace),X=r.convert(ht.type),Wt=y(ht.internalFormat,ut,X,ht.colorSpace,A.isXRRenderTarget===!0),Ut=It(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,Wt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$,i.RENDERBUFFER,k.__webglColorRenderbuffer[$])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Ft(k.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,it.__webglTexture),G(i.TEXTURE_CUBE_MAP,b,I);for(let D=0;D<6;D++)if(a&&b.mipmaps&&b.mipmaps.length>0)for(let $=0;$<b.mipmaps.length;$++)Mt(k.__webglFramebuffer[D][$],A,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+D,$);else Mt(k.__webglFramebuffer[D],A,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+D,0);x(b,I)&&_(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){const D=A.texture;for(let $=0,ht=D.length;$<ht;$++){const ut=D[$],X=n.get(ut);e.bindTexture(i.TEXTURE_2D,X.__webglTexture),G(i.TEXTURE_2D,ut,I),Mt(k.__webglFramebuffer,A,ut,i.COLOR_ATTACHMENT0+$,i.TEXTURE_2D,0),x(ut,I)&&_(i.TEXTURE_2D)}e.unbindTexture()}else{let D=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?D=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(D,it.__webglTexture),G(D,b,I),a&&b.mipmaps&&b.mipmaps.length>0)for(let $=0;$<b.mipmaps.length;$++)Mt(k.__webglFramebuffer[$],A,b,i.COLOR_ATTACHMENT0,D,$);else Mt(k.__webglFramebuffer,A,b,i.COLOR_ATTACHMENT0,D,0);x(b,I)&&_(D),e.unbindTexture()}A.depthBuffer&&Lt(A)}function ge(A){const b=m(A)||a,k=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let it=0,tt=k.length;it<tt;it++){const ot=k[it];if(x(ot,b)){const I=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,D=n.get(ot).__webglTexture;e.bindTexture(I,D),_(I),e.unbindTexture()}}}function Et(A){if(a&&A.samples>0&&_t(A)===!1){const b=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],k=A.width,it=A.height;let tt=i.COLOR_BUFFER_BIT;const ot=[],I=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,D=n.get(A),$=A.isWebGLMultipleRenderTargets===!0;if($)for(let ht=0;ht<b.length;ht++)e.bindFramebuffer(i.FRAMEBUFFER,D.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,D.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,D.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,D.__webglFramebuffer);for(let ht=0;ht<b.length;ht++){ot.push(i.COLOR_ATTACHMENT0+ht),A.depthBuffer&&ot.push(I);const ut=D.__ignoreDepthValues!==void 0?D.__ignoreDepthValues:!1;if(ut===!1&&(A.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),$&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,D.__webglColorRenderbuffer[ht]),ut===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[I]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[I])),$){const X=n.get(b[ht]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,X,0)}i.blitFramebuffer(0,0,k,it,0,0,k,it,tt,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),$)for(let ht=0;ht<b.length;ht++){e.bindFramebuffer(i.FRAMEBUFFER,D.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,D.__webglColorRenderbuffer[ht]);const ut=n.get(b[ht]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,D.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,ut,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,D.__webglMultisampledFramebuffer)}}function It(A){return Math.min(s.maxSamples,A.samples)}function _t(A){const b=n.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ee(A){const b=o.render.frame;h.get(A)!==b&&(h.set(A,b),A.update())}function Dt(A,b){const k=A.colorSpace,it=A.format,tt=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===cc||k!==Kn&&k!==un&&(ae.getTransfer(k)===ce?a===!1?t.has("EXT_sRGB")===!0&&it===hn?(A.format=cc,A.minFilter=Ke,A.generateMipmaps=!1):b=uf.sRGBToLinear(b):(it!==hn||tt!==li)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),b}this.allocateTextureUnit=U,this.resetTextureUnits=et,this.setTexture2D=q,this.setTexture2DArray=Z,this.setTexture3D=K,this.setTextureCube=Y,this.rebindTextures=Kt,this.setupRenderTarget=B,this.updateRenderTargetMipmap=ge,this.updateMultisampleRenderTarget=Et,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=_t}function $x(i,t,e){const n=e.isWebGL2;function s(r,o=un){let a;const c=ae.getTransfer(o);if(r===li)return i.UNSIGNED_BYTE;if(r===ef)return i.UNSIGNED_SHORT_4_4_4_4;if(r===nf)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Ep)return i.BYTE;if(r===Tp)return i.SHORT;if(r===Lc)return i.UNSIGNED_SHORT;if(r===tf)return i.INT;if(r===ri)return i.UNSIGNED_INT;if(r===oi)return i.FLOAT;if(r===dr)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Ap)return i.ALPHA;if(r===hn)return i.RGBA;if(r===Rp)return i.LUMINANCE;if(r===Cp)return i.LUMINANCE_ALPHA;if(r===Di)return i.DEPTH_COMPONENT;if(r===As)return i.DEPTH_STENCIL;if(r===cc)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Pp)return i.RED;if(r===sf)return i.RED_INTEGER;if(r===Lp)return i.RG;if(r===rf)return i.RG_INTEGER;if(r===of)return i.RGBA_INTEGER;if(r===na||r===ia||r===sa||r===ra)if(c===ce)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===na)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ia)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ra)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===na)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ia)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===sa)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ra)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===pl||r===ml||r===gl||r===vl)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===pl)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ml)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===gl)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===vl)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===af)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===xl||r===_l)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===xl)return c===ce?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===_l)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===yl||r===Ml||r===bl||r===Sl||r===wl||r===El||r===Tl||r===Al||r===Rl||r===Cl||r===Pl||r===Ll||r===Dl||r===Il)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===yl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ml)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===bl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Sl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===wl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===El)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Tl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Al)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Rl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Cl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Pl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Ll)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Dl)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Il)return c===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===oa||r===Ul||r===Ol)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===oa)return c===ce?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ul)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Ol)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Dp||r===Nl||r===zl||r===kl)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===oa)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Nl)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===zl)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===kl)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Li?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class jx extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ht extends De{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Xx={type:"move"};class Pa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Xx)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ht;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class qx extends Hi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=e.getContextAttributes();let m=null,p=null;const x=[],_=[],y=new pt;let R=null;const S=new sn;S.layers.enable(1),S.viewport=new le;const E=new sn;E.layers.enable(2),E.viewport=new le;const O=[S,E],M=new jx;M.layers.enable(1),M.layers.enable(2);let w=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let J=x[G];return J===void 0&&(J=new Pa,x[G]=J),J.getTargetRaySpace()},this.getControllerGrip=function(G){let J=x[G];return J===void 0&&(J=new Pa,x[G]=J),J.getGripSpace()},this.getHand=function(G){let J=x[G];return J===void 0&&(J=new Pa,x[G]=J),J.getHandSpace()};function j(G){const J=_.indexOf(G.inputSource);if(J===-1)return;const mt=x[J];mt!==void 0&&(mt.update(G.inputSource,G.frame,l||o),mt.dispatchEvent({type:G.type,data:G.inputSource}))}function et(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",et),s.removeEventListener("inputsourceschange",U);for(let G=0;G<x.length;G++){const J=_[G];J!==null&&(_[G]=null,x[G].disconnect(J))}w=null,z=null,t.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,gt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(y.width,y.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(G){l=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",et),s.addEventListener("inputsourceschange",U),v.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(y),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const J={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new Ni(f.framebufferWidth,f.framebufferHeight,{format:hn,type:li,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let J=null,mt=null,St=null;v.depth&&(St=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=v.stencil?As:Di,mt=v.stencil?Li:ri);const Mt={colorFormat:e.RGBA8,depthFormat:St,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Mt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new Ni(d.textureWidth,d.textureHeight,{format:hn,type:li,depthTexture:new bf(d.textureWidth,d.textureHeight,mt,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const Ft=t.properties.get(p);Ft.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),gt.setContext(s),gt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function U(G){for(let J=0;J<G.removed.length;J++){const mt=G.removed[J],St=_.indexOf(mt);St>=0&&(_[St]=null,x[St].disconnect(mt))}for(let J=0;J<G.added.length;J++){const mt=G.added[J];let St=_.indexOf(mt);if(St===-1){for(let Ft=0;Ft<x.length;Ft++)if(Ft>=_.length){_.push(mt),St=Ft;break}else if(_[Ft]===null){_[Ft]=mt,St=Ft;break}if(St===-1)break}const Mt=x[St];Mt&&Mt.connect(mt)}}const F=new C,q=new C;function Z(G,J,mt){F.setFromMatrixPosition(J.matrixWorld),q.setFromMatrixPosition(mt.matrixWorld);const St=F.distanceTo(q),Mt=J.projectionMatrix.elements,Ft=mt.projectionMatrix.elements,kt=Mt[14]/(Mt[10]-1),Lt=Mt[14]/(Mt[10]+1),Kt=(Mt[9]+1)/Mt[5],B=(Mt[9]-1)/Mt[5],ge=(Mt[8]-1)/Mt[0],Et=(Ft[8]+1)/Ft[0],It=kt*ge,_t=kt*Et,ee=St/(-ge+Et),Dt=ee*-ge;J.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(Dt),G.translateZ(ee),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const A=kt+ee,b=Lt+ee,k=It-Dt,it=_t+(St-Dt),tt=Kt*Lt/b*A,ot=B*Lt/b*A;G.projectionMatrix.makePerspective(k,it,tt,ot,A,b),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function K(G,J){J===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(J.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;M.near=E.near=S.near=G.near,M.far=E.far=S.far=G.far,(w!==M.near||z!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),w=M.near,z=M.far);const J=G.parent,mt=M.cameras;K(M,J);for(let St=0;St<mt.length;St++)K(mt[St],J);mt.length===2?Z(M,S,E):M.projectionMatrix.copy(S.projectionMatrix),Y(G,M,J)};function Y(G,J,mt){mt===null?G.matrix.copy(J.matrixWorld):(G.matrix.copy(mt.matrixWorld),G.matrix.invert(),G.matrix.multiply(J.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(J.projectionMatrix),G.projectionMatrixInverse.copy(J.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=lc*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(G){c=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)};let Q=null;function nt(G,J){if(h=J.getViewerPose(l||o),g=J,h!==null){const mt=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let St=!1;mt.length!==M.cameras.length&&(M.cameras.length=0,St=!0);for(let Mt=0;Mt<mt.length;Mt++){const Ft=mt[Mt];let kt=null;if(f!==null)kt=f.getViewport(Ft);else{const Kt=u.getViewSubImage(d,Ft);kt=Kt.viewport,Mt===0&&(t.setRenderTargetTextures(p,Kt.colorTexture,d.ignoreDepthValues?void 0:Kt.depthStencilTexture),t.setRenderTarget(p))}let Lt=O[Mt];Lt===void 0&&(Lt=new sn,Lt.layers.enable(Mt),Lt.viewport=new le,O[Mt]=Lt),Lt.matrix.fromArray(Ft.transform.matrix),Lt.matrix.decompose(Lt.position,Lt.quaternion,Lt.scale),Lt.projectionMatrix.fromArray(Ft.projectionMatrix),Lt.projectionMatrixInverse.copy(Lt.projectionMatrix).invert(),Lt.viewport.set(kt.x,kt.y,kt.width,kt.height),Mt===0&&(M.matrix.copy(Lt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),St===!0&&M.cameras.push(Lt)}}for(let mt=0;mt<x.length;mt++){const St=_[mt],Mt=x[mt];St!==null&&Mt!==void 0&&Mt.update(St,J,l||o)}Q&&Q(G,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const gt=new yf;gt.setAnimationLoop(nt),this.setAnimationLoop=function(G){Q=G},this.dispose=function(){}}}function Yx(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,vf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,x,_,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,x,_):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Je&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Je&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const x=t.get(p).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const _=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*_,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,x,_){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*x,m.scale.value=_*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,x){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Je&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const x=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Kx(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(x,_){const y=_.program;n.uniformBlockBinding(x,y)}function l(x,_){let y=s[x.id];y===void 0&&(g(x),y=h(x),s[x.id]=y,x.addEventListener("dispose",m));const R=_.program;n.updateUBOMapping(x,R);const S=t.render.frame;r[x.id]!==S&&(d(x),r[x.id]=S)}function h(x){const _=u();x.__bindingPointIndex=_;const y=i.createBuffer(),R=x.__size,S=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,R,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,y),y}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const _=s[x.id],y=x.uniforms,R=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let S=0,E=y.length;S<E;S++){const O=Array.isArray(y[S])?y[S]:[y[S]];for(let M=0,w=O.length;M<w;M++){const z=O[M];if(f(z,S,M,R)===!0){const j=z.__offset,et=Array.isArray(z.value)?z.value:[z.value];let U=0;for(let F=0;F<et.length;F++){const q=et[F],Z=v(q);typeof q=="number"||typeof q=="boolean"?(z.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,j+U,z.__data)):q.isMatrix3?(z.__data[0]=q.elements[0],z.__data[1]=q.elements[1],z.__data[2]=q.elements[2],z.__data[3]=0,z.__data[4]=q.elements[3],z.__data[5]=q.elements[4],z.__data[6]=q.elements[5],z.__data[7]=0,z.__data[8]=q.elements[6],z.__data[9]=q.elements[7],z.__data[10]=q.elements[8],z.__data[11]=0):(q.toArray(z.__data,U),U+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,j,z.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(x,_,y,R){const S=x.value,E=_+"_"+y;if(R[E]===void 0)return typeof S=="number"||typeof S=="boolean"?R[E]=S:R[E]=S.clone(),!0;{const O=R[E];if(typeof S=="number"||typeof S=="boolean"){if(O!==S)return R[E]=S,!0}else if(O.equals(S)===!1)return O.copy(S),!0}return!1}function g(x){const _=x.uniforms;let y=0;const R=16;for(let E=0,O=_.length;E<O;E++){const M=Array.isArray(_[E])?_[E]:[_[E]];for(let w=0,z=M.length;w<z;w++){const j=M[w],et=Array.isArray(j.value)?j.value:[j.value];for(let U=0,F=et.length;U<F;U++){const q=et[U],Z=v(q),K=y%R;K!==0&&R-K<Z.boundary&&(y+=R-K),j.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),j.__offset=y,y+=Z.storage}}}const S=y%R;return S>0&&(y+=R-S),x.__size=y,x.__cache={},this}function v(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function m(x){const _=x.target;_.removeEventListener("dispose",m);const y=o.indexOf(_.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function p(){for(const x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class Rf{constructor(t={}){const{canvas:e=jp(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Se,this._useLegacyLights=!1,this.toneMapping=ci,this.toneMappingExposure=1;const _=this;let y=!1,R=0,S=0,E=null,O=-1,M=null;const w=new le,z=new le;let j=null;const et=new qt(0);let U=0,F=e.width,q=e.height,Z=1,K=null,Y=null;const Q=new le(0,0,F,q),nt=new le(0,0,F,q);let gt=!1;const G=new Oc;let J=!1,mt=!1,St=null;const Mt=new re,Ft=new pt,kt=new C,Lt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Kt(){return E===null?Z:1}let B=n;function ge(T,N){for(let V=0;V<T.length;V++){const W=T[V],H=e.getContext(W,N);if(H!==null)return H}return null}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Cc}`),e.addEventListener("webglcontextlost",st,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",ct,!1),B===null){const N=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&N.shift(),B=ge(N,T),B===null)throw ge(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&B instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),B.getShaderPrecisionFormat===void 0&&(B.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Et,It,_t,ee,Dt,A,b,k,it,tt,ot,I,D,$,ht,ut,X,Wt,Ut,Ot,Tt,yt,P,at;function Rt(){Et=new ov(B),It=new tv(B,Et,t),Et.init(It),yt=new $x(B,Et,It),_t=new Wx(B,Et,It),ee=new lv(B),Dt=new Cx,A=new Gx(B,Et,_t,Dt,It,yt,ee),b=new nv(_),k=new rv(_),it=new vm(B,It),P=new Zg(B,Et,it,It),tt=new av(B,it,ee,P),ot=new dv(B,tt,it,ee),Ut=new fv(B,It,A),ut=new ev(Dt),I=new Rx(_,b,k,Et,It,P,ut),D=new Yx(_,Dt),$=new Lx,ht=new zx(Et,It),Wt=new Jg(_,b,k,_t,ot,d,c),X=new Vx(_,ot,It),at=new Kx(B,ee,It,_t),Ot=new Qg(B,Et,ee,It),Tt=new cv(B,Et,ee,It),ee.programs=I.programs,_.capabilities=It,_.extensions=Et,_.properties=Dt,_.renderLists=$,_.shadowMap=X,_.state=_t,_.info=ee}Rt();const wt=new qx(_,B);this.xr=wt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const T=Et.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Et.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(T){T!==void 0&&(Z=T,this.setSize(F,q,!1))},this.getSize=function(T){return T.set(F,q)},this.setSize=function(T,N,V=!0){if(wt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=T,q=N,e.width=Math.floor(T*Z),e.height=Math.floor(N*Z),V===!0&&(e.style.width=T+"px",e.style.height=N+"px"),this.setViewport(0,0,T,N)},this.getDrawingBufferSize=function(T){return T.set(F*Z,q*Z).floor()},this.setDrawingBufferSize=function(T,N,V){F=T,q=N,Z=V,e.width=Math.floor(T*V),e.height=Math.floor(N*V),this.setViewport(0,0,T,N)},this.getCurrentViewport=function(T){return T.copy(w)},this.getViewport=function(T){return T.copy(Q)},this.setViewport=function(T,N,V,W){T.isVector4?Q.set(T.x,T.y,T.z,T.w):Q.set(T,N,V,W),_t.viewport(w.copy(Q).multiplyScalar(Z).floor())},this.getScissor=function(T){return T.copy(nt)},this.setScissor=function(T,N,V,W){T.isVector4?nt.set(T.x,T.y,T.z,T.w):nt.set(T,N,V,W),_t.scissor(z.copy(nt).multiplyScalar(Z).floor())},this.getScissorTest=function(){return gt},this.setScissorTest=function(T){_t.setScissorTest(gt=T)},this.setOpaqueSort=function(T){K=T},this.setTransparentSort=function(T){Y=T},this.getClearColor=function(T){return T.copy(Wt.getClearColor())},this.setClearColor=function(){Wt.setClearColor.apply(Wt,arguments)},this.getClearAlpha=function(){return Wt.getClearAlpha()},this.setClearAlpha=function(){Wt.setClearAlpha.apply(Wt,arguments)},this.clear=function(T=!0,N=!0,V=!0){let W=0;if(T){let H=!1;if(E!==null){const bt=E.texture.format;H=bt===of||bt===rf||bt===sf}if(H){const bt=E.texture.type,Ct=bt===li||bt===ri||bt===Lc||bt===Li||bt===ef||bt===nf,zt=Wt.getClearColor(),Bt=Wt.getClearAlpha(),Yt=zt.r,$t=zt.g,jt=zt.b;Ct?(f[0]=Yt,f[1]=$t,f[2]=jt,f[3]=Bt,B.clearBufferuiv(B.COLOR,0,f)):(g[0]=Yt,g[1]=$t,g[2]=jt,g[3]=Bt,B.clearBufferiv(B.COLOR,0,g))}else W|=B.COLOR_BUFFER_BIT}N&&(W|=B.DEPTH_BUFFER_BIT),V&&(W|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",st,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",ct,!1),$.dispose(),ht.dispose(),Dt.dispose(),b.dispose(),k.dispose(),ot.dispose(),P.dispose(),at.dispose(),I.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",ve),wt.removeEventListener("sessionend",ne),St&&(St.dispose(),St=null),ye.stop()};function st(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const T=ee.autoReset,N=X.enabled,V=X.autoUpdate,W=X.needsUpdate,H=X.type;Rt(),ee.autoReset=T,X.enabled=N,X.autoUpdate=V,X.needsUpdate=W,X.type=H}function ct(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function vt(T){const N=T.target;N.removeEventListener("dispose",vt),Nt(N)}function Nt(T){Pt(T),Dt.remove(T)}function Pt(T){const N=Dt.get(T).programs;N!==void 0&&(N.forEach(function(V){I.releaseProgram(V)}),T.isShaderMaterial&&I.releaseShaderCache(T))}this.renderBufferDirect=function(T,N,V,W,H,bt){N===null&&(N=Lt);const Ct=H.isMesh&&H.matrixWorld.determinant()<0,zt=Fd(T,N,V,W,H);_t.setMaterial(W,Ct);let Bt=V.index,Yt=1;if(W.wireframe===!0){if(Bt=tt.getWireframeAttribute(V),Bt===void 0)return;Yt=2}const $t=V.drawRange,jt=V.attributes.position;let xe=$t.start*Yt,tn=($t.start+$t.count)*Yt;bt!==null&&(xe=Math.max(xe,bt.start*Yt),tn=Math.min(tn,(bt.start+bt.count)*Yt)),Bt!==null?(xe=Math.max(xe,0),tn=Math.min(tn,Bt.count)):jt!=null&&(xe=Math.max(xe,0),tn=Math.min(tn,jt.count));const Ce=tn-xe;if(Ce<0||Ce===1/0)return;P.setup(H,W,zt,V,Bt);let On,he=Ot;if(Bt!==null&&(On=it.get(Bt),he=Tt,he.setIndex(On)),H.isMesh)W.wireframe===!0?(_t.setLineWidth(W.wireframeLinewidth*Kt()),he.setMode(B.LINES)):he.setMode(B.TRIANGLES);else if(H.isLine){let Jt=W.linewidth;Jt===void 0&&(Jt=1),_t.setLineWidth(Jt*Kt()),H.isLineSegments?he.setMode(B.LINES):H.isLineLoop?he.setMode(B.LINE_LOOP):he.setMode(B.LINE_STRIP)}else H.isPoints?he.setMode(B.POINTS):H.isSprite&&he.setMode(B.TRIANGLES);if(H.isBatchedMesh)he.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else if(H.isInstancedMesh)he.renderInstances(xe,Ce,H.count);else if(V.isInstancedBufferGeometry){const Jt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Jo=Math.min(V.instanceCount,Jt);he.renderInstances(xe,Ce,Jo)}else he.render(xe,Ce)};function Qt(T,N,V){T.transparent===!0&&T.side===rn&&T.forceSinglePass===!1?(T.side=Je,T.needsUpdate=!0,Pr(T,N,V),T.side=pi,T.needsUpdate=!0,Pr(T,N,V),T.side=rn):Pr(T,N,V)}this.compile=function(T,N,V=null){V===null&&(V=T),m=ht.get(V),m.init(),x.push(m),V.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),T!==V&&T.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights(_._useLegacyLights);const W=new Set;return T.traverse(function(H){const bt=H.material;if(bt)if(Array.isArray(bt))for(let Ct=0;Ct<bt.length;Ct++){const zt=bt[Ct];Qt(zt,V,H),W.add(zt)}else Qt(bt,V,H),W.add(bt)}),x.pop(),m=null,W},this.compileAsync=function(T,N,V=null){const W=this.compile(T,N,V);return new Promise(H=>{function bt(){if(W.forEach(function(Ct){Dt.get(Ct).currentProgram.isReady()&&W.delete(Ct)}),W.size===0){H(T);return}setTimeout(bt,10)}Et.get("KHR_parallel_shader_compile")!==null?bt():setTimeout(bt,10)})};let te=null;function pe(T){te&&te(T)}function ve(){ye.stop()}function ne(){ye.start()}const ye=new yf;ye.setAnimationLoop(pe),typeof self<"u"&&ye.setContext(self),this.setAnimationLoop=function(T){te=T,wt.setAnimationLoop(T),T===null?ye.stop():ye.start()},wt.addEventListener("sessionstart",ve),wt.addEventListener("sessionend",ne),this.render=function(T,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(N),N=wt.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,N,E),m=ht.get(T,x.length),m.init(),x.push(m),Mt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),G.setFromProjectionMatrix(Mt),mt=this.localClippingEnabled,J=ut.init(this.clippingPlanes,mt),v=$.get(T,p.length),v.init(),p.push(v),Sn(T,N,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(K,Y),this.info.render.frame++,J===!0&&ut.beginShadows();const V=m.state.shadowsArray;if(X.render(V,T,N),J===!0&&ut.endShadows(),this.info.autoReset===!0&&this.info.reset(),Wt.render(v,T),m.setupLights(_._useLegacyLights),N.isArrayCamera){const W=N.cameras;for(let H=0,bt=W.length;H<bt;H++){const Ct=W[H];tl(v,T,Ct,Ct.viewport)}}else tl(v,T,N);E!==null&&(A.updateMultisampleRenderTarget(E),A.updateRenderTargetMipmap(E)),T.isScene===!0&&T.onAfterRender(_,T,N),P.resetDefaultState(),O=-1,M=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function Sn(T,N,V,W){if(T.visible===!1)return;if(T.layers.test(N.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(N);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||G.intersectsSprite(T)){W&&kt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Mt);const Ct=ot.update(T),zt=T.material;zt.visible&&v.push(T,Ct,zt,V,kt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||G.intersectsObject(T))){const Ct=ot.update(T),zt=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),kt.copy(T.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),kt.copy(Ct.boundingSphere.center)),kt.applyMatrix4(T.matrixWorld).applyMatrix4(Mt)),Array.isArray(zt)){const Bt=Ct.groups;for(let Yt=0,$t=Bt.length;Yt<$t;Yt++){const jt=Bt[Yt],xe=zt[jt.materialIndex];xe&&xe.visible&&v.push(T,Ct,xe,V,kt.z,jt)}}else zt.visible&&v.push(T,Ct,zt,V,kt.z,null)}}const bt=T.children;for(let Ct=0,zt=bt.length;Ct<zt;Ct++)Sn(bt[Ct],N,V,W)}function tl(T,N,V,W){const H=T.opaque,bt=T.transmissive,Ct=T.transparent;m.setupLightsView(V),J===!0&&ut.setGlobalState(_.clippingPlanes,V),bt.length>0&&kd(H,bt,N,V),W&&_t.viewport(w.copy(W)),H.length>0&&Cr(H,N,V),bt.length>0&&Cr(bt,N,V),Ct.length>0&&Cr(Ct,N,V),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function kd(T,N,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const bt=It.isWebGL2;St===null&&(St=new Ni(1,1,{generateMipmaps:!0,type:Et.has("EXT_color_buffer_half_float")?dr:li,minFilter:fr,samples:bt?4:0})),_.getDrawingBufferSize(Ft),bt?St.setSize(Ft.x,Ft.y):St.setSize(hc(Ft.x),hc(Ft.y));const Ct=_.getRenderTarget();_.setRenderTarget(St),_.getClearColor(et),U=_.getClearAlpha(),U<1&&_.setClearColor(16777215,.5),_.clear();const zt=_.toneMapping;_.toneMapping=ci,Cr(T,V,W),A.updateMultisampleRenderTarget(St),A.updateRenderTargetMipmap(St);let Bt=!1;for(let Yt=0,$t=N.length;Yt<$t;Yt++){const jt=N[Yt],xe=jt.object,tn=jt.geometry,Ce=jt.material,On=jt.group;if(Ce.side===rn&&xe.layers.test(W.layers)){const he=Ce.side;Ce.side=Je,Ce.needsUpdate=!0,el(xe,V,W,tn,Ce,On),Ce.side=he,Ce.needsUpdate=!0,Bt=!0}}Bt===!0&&(A.updateMultisampleRenderTarget(St),A.updateRenderTargetMipmap(St)),_.setRenderTarget(Ct),_.setClearColor(et,U),_.toneMapping=zt}function Cr(T,N,V){const W=N.isScene===!0?N.overrideMaterial:null;for(let H=0,bt=T.length;H<bt;H++){const Ct=T[H],zt=Ct.object,Bt=Ct.geometry,Yt=W===null?Ct.material:W,$t=Ct.group;zt.layers.test(V.layers)&&el(zt,N,V,Bt,Yt,$t)}}function el(T,N,V,W,H,bt){T.onBeforeRender(_,N,V,W,H,bt),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),H.onBeforeRender(_,N,V,W,T,bt),H.transparent===!0&&H.side===rn&&H.forceSinglePass===!1?(H.side=Je,H.needsUpdate=!0,_.renderBufferDirect(V,N,W,H,T,bt),H.side=pi,H.needsUpdate=!0,_.renderBufferDirect(V,N,W,H,T,bt),H.side=rn):_.renderBufferDirect(V,N,W,H,T,bt),T.onAfterRender(_,N,V,W,H,bt)}function Pr(T,N,V){N.isScene!==!0&&(N=Lt);const W=Dt.get(T),H=m.state.lights,bt=m.state.shadowsArray,Ct=H.state.version,zt=I.getParameters(T,H.state,bt,N,V),Bt=I.getProgramCacheKey(zt);let Yt=W.programs;W.environment=T.isMeshStandardMaterial?N.environment:null,W.fog=N.fog,W.envMap=(T.isMeshStandardMaterial?k:b).get(T.envMap||W.environment),Yt===void 0&&(T.addEventListener("dispose",vt),Yt=new Map,W.programs=Yt);let $t=Yt.get(Bt);if($t!==void 0){if(W.currentProgram===$t&&W.lightsStateVersion===Ct)return il(T,zt),$t}else zt.uniforms=I.getUniforms(T),T.onBuild(V,zt,_),T.onBeforeCompile(zt,_),$t=I.acquireProgram(zt,Bt),Yt.set(Bt,$t),W.uniforms=zt.uniforms;const jt=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(jt.clippingPlanes=ut.uniform),il(T,zt),W.needsLights=Hd(T),W.lightsStateVersion=Ct,W.needsLights&&(jt.ambientLightColor.value=H.state.ambient,jt.lightProbe.value=H.state.probe,jt.directionalLights.value=H.state.directional,jt.directionalLightShadows.value=H.state.directionalShadow,jt.spotLights.value=H.state.spot,jt.spotLightShadows.value=H.state.spotShadow,jt.rectAreaLights.value=H.state.rectArea,jt.ltc_1.value=H.state.rectAreaLTC1,jt.ltc_2.value=H.state.rectAreaLTC2,jt.pointLights.value=H.state.point,jt.pointLightShadows.value=H.state.pointShadow,jt.hemisphereLights.value=H.state.hemi,jt.directionalShadowMap.value=H.state.directionalShadowMap,jt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,jt.spotShadowMap.value=H.state.spotShadowMap,jt.spotLightMatrix.value=H.state.spotLightMatrix,jt.spotLightMap.value=H.state.spotLightMap,jt.pointShadowMap.value=H.state.pointShadowMap,jt.pointShadowMatrix.value=H.state.pointShadowMatrix),W.currentProgram=$t,W.uniformsList=null,$t}function nl(T){if(T.uniformsList===null){const N=T.currentProgram.getUniforms();T.uniformsList=fo.seqWithValue(N.seq,T.uniforms)}return T.uniformsList}function il(T,N){const V=Dt.get(T);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function Fd(T,N,V,W,H){N.isScene!==!0&&(N=Lt),A.resetTextureUnits();const bt=N.fog,Ct=W.isMeshStandardMaterial?N.environment:null,zt=E===null?_.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Kn,Bt=(W.isMeshStandardMaterial?k:b).get(W.envMap||Ct),Yt=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,$t=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),jt=!!V.morphAttributes.position,xe=!!V.morphAttributes.normal,tn=!!V.morphAttributes.color;let Ce=ci;W.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ce=_.toneMapping);const On=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,he=On!==void 0?On.length:0,Jt=Dt.get(W),Jo=m.state.lights;if(J===!0&&(mt===!0||T!==M)){const cn=T===M&&W.id===O;ut.setState(W,T,cn)}let me=!1;W.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==Jo.state.version||Jt.outputColorSpace!==zt||H.isBatchedMesh&&Jt.batching===!1||!H.isBatchedMesh&&Jt.batching===!0||H.isInstancedMesh&&Jt.instancing===!1||!H.isInstancedMesh&&Jt.instancing===!0||H.isSkinnedMesh&&Jt.skinning===!1||!H.isSkinnedMesh&&Jt.skinning===!0||H.isInstancedMesh&&Jt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Jt.instancingColor===!1&&H.instanceColor!==null||Jt.envMap!==Bt||W.fog===!0&&Jt.fog!==bt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==ut.numPlanes||Jt.numIntersection!==ut.numIntersection)||Jt.vertexAlphas!==Yt||Jt.vertexTangents!==$t||Jt.morphTargets!==jt||Jt.morphNormals!==xe||Jt.morphColors!==tn||Jt.toneMapping!==Ce||It.isWebGL2===!0&&Jt.morphTargetsCount!==he)&&(me=!0):(me=!0,Jt.__version=W.version);let vi=Jt.currentProgram;me===!0&&(vi=Pr(W,N,H));let sl=!1,Vs=!1,Zo=!1;const ze=vi.getUniforms(),xi=Jt.uniforms;if(_t.useProgram(vi.program)&&(sl=!0,Vs=!0,Zo=!0),W.id!==O&&(O=W.id,Vs=!0),sl||M!==T){ze.setValue(B,"projectionMatrix",T.projectionMatrix),ze.setValue(B,"viewMatrix",T.matrixWorldInverse);const cn=ze.map.cameraPosition;cn!==void 0&&cn.setValue(B,kt.setFromMatrixPosition(T.matrixWorld)),It.logarithmicDepthBuffer&&ze.setValue(B,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ze.setValue(B,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,Vs=!0,Zo=!0)}if(H.isSkinnedMesh){ze.setOptional(B,H,"bindMatrix"),ze.setOptional(B,H,"bindMatrixInverse");const cn=H.skeleton;cn&&(It.floatVertexTextures?(cn.boneTexture===null&&cn.computeBoneTexture(),ze.setValue(B,"boneTexture",cn.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}H.isBatchedMesh&&(ze.setOptional(B,H,"batchingTexture"),ze.setValue(B,"batchingTexture",H._matricesTexture,A));const Qo=V.morphAttributes;if((Qo.position!==void 0||Qo.normal!==void 0||Qo.color!==void 0&&It.isWebGL2===!0)&&Ut.update(H,V,vi),(Vs||Jt.receiveShadow!==H.receiveShadow)&&(Jt.receiveShadow=H.receiveShadow,ze.setValue(B,"receiveShadow",H.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(xi.envMap.value=Bt,xi.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),Vs&&(ze.setValue(B,"toneMappingExposure",_.toneMappingExposure),Jt.needsLights&&Bd(xi,Zo),bt&&W.fog===!0&&D.refreshFogUniforms(xi,bt),D.refreshMaterialUniforms(xi,W,Z,q,St),fo.upload(B,nl(Jt),xi,A)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(fo.upload(B,nl(Jt),xi,A),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ze.setValue(B,"center",H.center),ze.setValue(B,"modelViewMatrix",H.modelViewMatrix),ze.setValue(B,"normalMatrix",H.normalMatrix),ze.setValue(B,"modelMatrix",H.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const cn=W.uniformsGroups;for(let ta=0,Vd=cn.length;ta<Vd;ta++)if(It.isWebGL2){const rl=cn[ta];at.update(rl,vi),at.bind(rl,vi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return vi}function Bd(T,N){T.ambientLightColor.needsUpdate=N,T.lightProbe.needsUpdate=N,T.directionalLights.needsUpdate=N,T.directionalLightShadows.needsUpdate=N,T.pointLights.needsUpdate=N,T.pointLightShadows.needsUpdate=N,T.spotLights.needsUpdate=N,T.spotLightShadows.needsUpdate=N,T.rectAreaLights.needsUpdate=N,T.hemisphereLights.needsUpdate=N}function Hd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(T,N,V){Dt.get(T.texture).__webglTexture=N,Dt.get(T.depthTexture).__webglTexture=V;const W=Dt.get(T);W.__hasExternalTextures=!0,W.__hasExternalTextures&&(W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||Et.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,N){const V=Dt.get(T);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(T,N=0,V=0){E=T,R=N,S=V;let W=!0,H=null,bt=!1,Ct=!1;if(T){const Bt=Dt.get(T);Bt.__useDefaultFramebuffer!==void 0?(_t.bindFramebuffer(B.FRAMEBUFFER,null),W=!1):Bt.__webglFramebuffer===void 0?A.setupRenderTarget(T):Bt.__hasExternalTextures&&A.rebindTextures(T,Dt.get(T.texture).__webglTexture,Dt.get(T.depthTexture).__webglTexture);const Yt=T.texture;(Yt.isData3DTexture||Yt.isDataArrayTexture||Yt.isCompressedArrayTexture)&&(Ct=!0);const $t=Dt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray($t[N])?H=$t[N][V]:H=$t[N],bt=!0):It.isWebGL2&&T.samples>0&&A.useMultisampledRTT(T)===!1?H=Dt.get(T).__webglMultisampledFramebuffer:Array.isArray($t)?H=$t[V]:H=$t,w.copy(T.viewport),z.copy(T.scissor),j=T.scissorTest}else w.copy(Q).multiplyScalar(Z).floor(),z.copy(nt).multiplyScalar(Z).floor(),j=gt;if(_t.bindFramebuffer(B.FRAMEBUFFER,H)&&It.drawBuffers&&W&&_t.drawBuffers(T,H),_t.viewport(w),_t.scissor(z),_t.setScissorTest(j),bt){const Bt=Dt.get(T.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+N,Bt.__webglTexture,V)}else if(Ct){const Bt=Dt.get(T.texture),Yt=N||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Bt.__webglTexture,V||0,Yt)}O=-1},this.readRenderTargetPixels=function(T,N,V,W,H,bt,Ct){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let zt=Dt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ct!==void 0&&(zt=zt[Ct]),zt){_t.bindFramebuffer(B.FRAMEBUFFER,zt);try{const Bt=T.texture,Yt=Bt.format,$t=Bt.type;if(Yt!==hn&&yt.convert(Yt)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const jt=$t===dr&&(Et.has("EXT_color_buffer_half_float")||It.isWebGL2&&Et.has("EXT_color_buffer_float"));if($t!==li&&yt.convert($t)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_TYPE)&&!($t===oi&&(It.isWebGL2||Et.has("OES_texture_float")||Et.has("WEBGL_color_buffer_float")))&&!jt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=T.width-W&&V>=0&&V<=T.height-H&&B.readPixels(N,V,W,H,yt.convert(Yt),yt.convert($t),bt)}finally{const Bt=E!==null?Dt.get(E).__webglFramebuffer:null;_t.bindFramebuffer(B.FRAMEBUFFER,Bt)}}},this.copyFramebufferToTexture=function(T,N,V=0){const W=Math.pow(2,-V),H=Math.floor(N.image.width*W),bt=Math.floor(N.image.height*W);A.setTexture2D(N,0),B.copyTexSubImage2D(B.TEXTURE_2D,V,0,0,T.x,T.y,H,bt),_t.unbindTexture()},this.copyTextureToTexture=function(T,N,V,W=0){const H=N.image.width,bt=N.image.height,Ct=yt.convert(V.format),zt=yt.convert(V.type);A.setTexture2D(V,0),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,V.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,V.unpackAlignment),N.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,W,T.x,T.y,H,bt,Ct,zt,N.image.data):N.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,W,T.x,T.y,N.mipmaps[0].width,N.mipmaps[0].height,Ct,N.mipmaps[0].data):B.texSubImage2D(B.TEXTURE_2D,W,T.x,T.y,Ct,zt,N.image),W===0&&V.generateMipmaps&&B.generateMipmap(B.TEXTURE_2D),_t.unbindTexture()},this.copyTextureToTexture3D=function(T,N,V,W,H=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const bt=T.max.x-T.min.x+1,Ct=T.max.y-T.min.y+1,zt=T.max.z-T.min.z+1,Bt=yt.convert(W.format),Yt=yt.convert(W.type);let $t;if(W.isData3DTexture)A.setTexture3D(W,0),$t=B.TEXTURE_3D;else if(W.isDataArrayTexture||W.isCompressedArrayTexture)A.setTexture2DArray(W,0),$t=B.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,W.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,W.unpackAlignment);const jt=B.getParameter(B.UNPACK_ROW_LENGTH),xe=B.getParameter(B.UNPACK_IMAGE_HEIGHT),tn=B.getParameter(B.UNPACK_SKIP_PIXELS),Ce=B.getParameter(B.UNPACK_SKIP_ROWS),On=B.getParameter(B.UNPACK_SKIP_IMAGES),he=V.isCompressedTexture?V.mipmaps[H]:V.image;B.pixelStorei(B.UNPACK_ROW_LENGTH,he.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,he.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,T.min.x),B.pixelStorei(B.UNPACK_SKIP_ROWS,T.min.y),B.pixelStorei(B.UNPACK_SKIP_IMAGES,T.min.z),V.isDataTexture||V.isData3DTexture?B.texSubImage3D($t,H,N.x,N.y,N.z,bt,Ct,zt,Bt,Yt,he.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),B.compressedTexSubImage3D($t,H,N.x,N.y,N.z,bt,Ct,zt,Bt,he.data)):B.texSubImage3D($t,H,N.x,N.y,N.z,bt,Ct,zt,Bt,Yt,he),B.pixelStorei(B.UNPACK_ROW_LENGTH,jt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,xe),B.pixelStorei(B.UNPACK_SKIP_PIXELS,tn),B.pixelStorei(B.UNPACK_SKIP_ROWS,Ce),B.pixelStorei(B.UNPACK_SKIP_IMAGES,On),H===0&&W.generateMipmaps&&B.generateMipmap($t),_t.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?A.setTextureCube(T,0):T.isData3DTexture?A.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?A.setTexture2DArray(T,0):A.setTexture2D(T,0),_t.unbindTexture()},this.resetState=function(){R=0,S=0,E=null,_t.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ic?"display-p3":"srgb",e.unpackColorSpace=ae.workingColorSpace===Uo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Se?Ii:cf}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Ii?Se:Kn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Jx extends Rf{}Jx.prototype.isWebGL1Renderer=!0;class zc{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=e,this.far=n}clone(){return new zc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Cf extends De{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Zx extends $e{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Oe,h=Oe,u,d){super(null,o,a,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ah extends an{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ls=new re,Rh=new re,Qr=[],Ch=new Vi,Qx=new re,qs=new Gt,Ys=new Ns;class sr extends Gt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ah(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Qx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ls),Ch.copy(t.boundingBox).applyMatrix4(ls),this.boundingBox.union(Ch)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ns),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ls),Ys.copy(t.boundingSphere).applyMatrix4(ls),this.boundingSphere.union(Ys)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(qs.geometry=this.geometry,qs.material=this.material,qs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ys.copy(this.boundingSphere),Ys.applyMatrix4(n),t.ray.intersectsSphere(Ys)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ls),Rh.multiplyMatrices(n,ls),qs.matrixWorld=Rh,qs.raycast(t,Qr);for(let o=0,a=Qr.length;o<a;o++){const c=Qr[o];c.instanceId=r,c.object=this,e.push(c)}Qr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ah(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class zo extends Wi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ph=new C,Lh=new C,Dh=new re,La=new Oo,to=new Ns;class po extends De{constructor(t=new de,e=new zo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Ph.fromBufferAttribute(e,s-1),Lh.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Ph.distanceTo(Lh);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),to.copy(n.boundingSphere),to.applyMatrix4(s),to.radius+=r,t.ray.intersectsSphere(to)===!1)return;Dh.copy(s).invert(),La.copy(t.ray).applyMatrix4(Dh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new C,h=new C,u=new C,d=new C,f=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),x=Math.min(g.count,o.start+o.count);for(let _=p,y=x-1;_<y;_+=f){const R=g.getX(_),S=g.getX(_+1);if(l.fromBufferAttribute(m,R),h.fromBufferAttribute(m,S),La.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const O=t.ray.origin.distanceTo(d);O<t.near||O>t.far||e.push({distance:O,point:u.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),x=Math.min(m.count,o.start+o.count);for(let _=p,y=x-1;_<y;_+=f){if(l.fromBufferAttribute(m,_),h.fromBufferAttribute(m,_+1),La.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const S=t.ray.origin.distanceTo(d);S<t.near||S>t.far||e.push({distance:S,point:u.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const Ih=new C,Uh=new C;class t_ extends po{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Ih.fromBufferAttribute(e,s),Uh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ih.distanceTo(Uh);t.setAttribute("lineDistance",new se(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class kc extends $e{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Un{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new pt:new C);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],o=[],a=new C,c=new re;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Le(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Le(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Fc extends Un{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const n=e||new pt,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class e_ extends Fc{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Bc(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const eo=new C,Da=new Bc,Ia=new Bc,Ua=new Bc;class Hc extends Un{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(eo.subVectors(s[0],s[1]).add(s[0]),l=eo);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(eo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=eo),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Da.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),Ia.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),Ua.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Da.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ia.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Ua.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Da.calc(c),Ia.calc(c),Ua.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Oh(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function n_(i,t){const e=1-i;return e*e*t}function i_(i,t){return 2*(1-i)*i*t}function s_(i,t){return i*i*t}function rr(i,t,e,n){return n_(i,t)+i_(i,e)+s_(i,n)}function r_(i,t){const e=1-i;return e*e*e*t}function o_(i,t){const e=1-i;return 3*e*e*i*t}function a_(i,t){return 3*(1-i)*i*i*t}function c_(i,t){return i*i*i*t}function or(i,t,e,n,s){return r_(i,t)+o_(i,e)+a_(i,n)+c_(i,s)}class Pf extends Un{constructor(t=new pt,e=new pt,n=new pt,s=new pt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new pt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(or(t,s.x,r.x,o.x,a.x),or(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class l_ extends Un{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(or(t,s.x,r.x,o.x,a.x),or(t,s.y,r.y,o.y,a.y),or(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Lf extends Un{constructor(t=new pt,e=new pt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new pt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new pt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class h_ extends Un{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Df extends Un{constructor(t=new pt,e=new pt,n=new pt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new pt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(rr(t,s.x,r.x,o.x),rr(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class u_ extends Un{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(rr(t,s.x,r.x,o.x),rr(t,s.y,r.y,o.y),rr(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class If extends Un{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new pt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Oh(a,c.x,l.x,h.x,u.x),Oh(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new pt().fromArray(s))}return this}}var Nh=Object.freeze({__proto__:null,ArcCurve:e_,CatmullRomCurve3:Hc,CubicBezierCurve:Pf,CubicBezierCurve3:l_,EllipseCurve:Fc,LineCurve:Lf,LineCurve3:h_,QuadraticBezierCurve:Df,QuadraticBezierCurve3:u_,SplineCurve:If});class f_ extends Un{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Nh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Nh[s.type]().fromJSON(s))}return this}}class d_ extends f_{constructor(t){super(),this.type="Path",this.currentPoint=new pt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Lf(this.currentPoint.clone(),new pt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Df(this.currentPoint.clone(),new pt(t,e),new pt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Pf(this.currentPoint.clone(),new pt(t,e),new pt(n,s),new pt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new If(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new Fc(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Vc extends de{constructor(t=[new pt(0,-.5),new pt(.5,0),new pt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Le(s,0,Math.PI*2);const r=[],o=[],a=[],c=[],l=[],h=1/e,u=new C,d=new pt,f=new C,g=new C,v=new C;let m=0,p=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(v.x,v.y,v.z);break;default:m=t[x+1].x-t[x].x,p=t[x+1].y-t[x].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(g)}for(let x=0;x<=e;x++){const _=n+x*h*s,y=Math.sin(_),R=Math.cos(_);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*y,u.y=t[S].y,u.z=t[S].x*R,o.push(u.x,u.y,u.z),d.x=x/e,d.y=S/(t.length-1),a.push(d.x,d.y);const E=c[3*S+0]*y,O=c[3*S+1],M=c[3*S+0]*R;l.push(E,O,M)}}for(let x=0;x<e;x++)for(let _=0;_<t.length-1;_++){const y=_+x*t.length,R=y,S=y+t.length,E=y+t.length+1,O=y+1;r.push(R,S,O),r.push(E,O,S)}this.setIndex(r),this.setAttribute("position",new se(o,3)),this.setAttribute("uv",new se(a,2)),this.setAttribute("normal",new se(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vc(t.points,t.segments,t.phiStart,t.phiLength)}}class Wc extends Vc{constructor(t=1,e=1,n=4,s=8){const r=new d_;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Wc(t.radius,t.length,t.capSegments,t.radialSegments)}}class ki extends de{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new C,h=new pt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new se(o,3)),this.setAttribute("normal",new se(a,3)),this.setAttribute("uv",new se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ki(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ze extends de{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;x(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new se(u,3)),this.setAttribute("normal",new se(d,3)),this.setAttribute("uv",new se(f,2));function x(){const y=new C,R=new C;let S=0;const E=(e-t)/n;for(let O=0;O<=r;O++){const M=[],w=O/r,z=w*(e-t)+t;for(let j=0;j<=s;j++){const et=j/s,U=et*c+a,F=Math.sin(U),q=Math.cos(U);R.x=z*F,R.y=-w*n+m,R.z=z*q,u.push(R.x,R.y,R.z),y.set(F,E,q).normalize(),d.push(y.x,y.y,y.z),f.push(et,1-w),M.push(g++)}v.push(M)}for(let O=0;O<s;O++)for(let M=0;M<r;M++){const w=v[M][O],z=v[M+1][O],j=v[M+1][O+1],et=v[M][O+1];h.push(w,z,et),h.push(z,j,et),S+=6}l.addGroup(p,S,0),p+=S}function _(y){const R=g,S=new pt,E=new C;let O=0;const M=y===!0?t:e,w=y===!0?1:-1;for(let j=1;j<=s;j++)u.push(0,m*w,0),d.push(0,w,0),f.push(.5,.5),g++;const z=g;for(let j=0;j<=s;j++){const U=j/s*c+a,F=Math.cos(U),q=Math.sin(U);E.x=M*q,E.y=m*w,E.z=M*F,u.push(E.x,E.y,E.z),d.push(0,w,0),S.x=F*.5+.5,S.y=q*.5*w+.5,f.push(S.x,S.y),g++}for(let j=0;j<s;j++){const et=R+j,U=z+j;y===!0?h.push(U,U+1,et):h.push(U+1,U,et),O+=3}l.addGroup(p,O,y===!0?1:2),p+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ze(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ln extends Ze{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ln(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class br extends de{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new se(r,3)),this.setAttribute("normal",new se(r.slice(),3)),this.setAttribute("uv",new se(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const _=new C,y=new C,R=new C;for(let S=0;S<e.length;S+=3)f(e[S+0],_),f(e[S+1],y),f(e[S+2],R),c(_,y,R,x)}function c(x,_,y,R){const S=R+1,E=[];for(let O=0;O<=S;O++){E[O]=[];const M=x.clone().lerp(y,O/S),w=_.clone().lerp(y,O/S),z=S-O;for(let j=0;j<=z;j++)j===0&&O===S?E[O][j]=M:E[O][j]=M.clone().lerp(w,j/z)}for(let O=0;O<S;O++)for(let M=0;M<2*(S-O)-1;M++){const w=Math.floor(M/2);M%2===0?(d(E[O][w+1]),d(E[O+1][w]),d(E[O][w])):(d(E[O][w+1]),d(E[O+1][w+1]),d(E[O+1][w]))}}function l(x){const _=new C;for(let y=0;y<r.length;y+=3)_.x=r[y+0],_.y=r[y+1],_.z=r[y+2],_.normalize().multiplyScalar(x),r[y+0]=_.x,r[y+1]=_.y,r[y+2]=_.z}function h(){const x=new C;for(let _=0;_<r.length;_+=3){x.x=r[_+0],x.y=r[_+1],x.z=r[_+2];const y=m(x)/2/Math.PI+.5,R=p(x)/Math.PI+.5;o.push(y,1-R)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){const _=o[x+0],y=o[x+2],R=o[x+4],S=Math.max(_,y,R),E=Math.min(_,y,R);S>.9&&E<.1&&(_<.2&&(o[x+0]+=1),y<.2&&(o[x+2]+=1),R<.2&&(o[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,_){const y=x*3;_.x=t[y+0],_.y=t[y+1],_.z=t[y+2]}function g(){const x=new C,_=new C,y=new C,R=new C,S=new pt,E=new pt,O=new pt;for(let M=0,w=0;M<r.length;M+=9,w+=6){x.set(r[M+0],r[M+1],r[M+2]),_.set(r[M+3],r[M+4],r[M+5]),y.set(r[M+6],r[M+7],r[M+8]),S.set(o[w+0],o[w+1]),E.set(o[w+2],o[w+3]),O.set(o[w+4],o[w+5]),R.copy(x).add(_).add(y).divideScalar(3);const z=m(R);v(S,w+0,x,z),v(E,w+2,_,z),v(O,w+4,y,z)}}function v(x,_,y,R){R<0&&x.x===1&&(o[_]=x.x-1),y.x===0&&y.z===0&&(o[_]=R/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function p(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new br(t.vertices,t.indices,t.radius,t.details)}}class Ro extends br{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ro(t.radius,t.detail)}}class Dn extends br{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Dn(t.radius,t.detail)}}class ko extends br{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ko(t.radius,t.detail)}}class Fi extends de{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,f=new C,g=new pt;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(n+1);for(let p=0;p<n;p++){const x=p+m,_=x,y=x+n+1,R=x+n+2,S=x+1;a.push(_,y,S),a.push(y,R,S)}}this.setIndex(a),this.setAttribute("position",new se(c,3)),this.setAttribute("normal",new se(l,3)),this.setAttribute("uv",new se(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class on extends de{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new C,d=new C,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const x=[],_=p/n;let y=0;p===0&&o===0?y=.5/e:p===n&&c===Math.PI&&(y=-.5/e);for(let R=0;R<=e;R++){const S=R/e;u.x=-t*Math.cos(s+S*r)*Math.sin(o+_*a),u.y=t*Math.cos(o+_*a),u.z=t*Math.sin(s+S*r)*Math.sin(o+_*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(S+y,1-_),x.push(l++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<e;x++){const _=h[p][x+1],y=h[p][x],R=h[p+1][x],S=h[p+1][x+1];(p!==0||o>0)&&f.push(_,y,S),(p!==n-1||c<Math.PI)&&f.push(y,R,S)}this.setIndex(f),this.setAttribute("position",new se(g,3)),this.setAttribute("normal",new se(v,3)),this.setAttribute("uv",new se(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new on(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class bn extends de{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const v=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const v=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,x=(s+1)*f+g;o.push(v,m,x),o.push(m,p,x)}this.setIndex(o),this.setAttribute("position",new se(a,3)),this.setAttribute("normal",new se(c,3)),this.setAttribute("uv",new se(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Mn extends Wi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dc,this.normalScale=new pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class p_ extends Wi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dc,this.normalScale=new pt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Pc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class m_ extends zo{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class Gc extends De{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class g_ extends Gc{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Oa=new re,zh=new C,kh=new C;class Uf{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pt(512,512),this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oc,this._frameExtents=new pt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;zh.setFromMatrixPosition(t.matrixWorld),e.position.copy(zh),kh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(kh),e.updateMatrixWorld(),Oa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Oa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Oa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Fh=new re,Ks=new C,Na=new C;class v_ extends Uf{constructor(){super(new sn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new pt(4,2),this._viewportCount=6,this._viewports=[new le(2,1,1,1),new le(0,1,1,1),new le(3,1,1,1),new le(1,1,1,1),new le(3,0,1,1),new le(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ks.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ks),Na.copy(n.position),Na.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Na),n.updateMatrixWorld(),s.makeTranslation(-Ks.x,-Ks.y,-Ks.z),Fh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fh)}}class x_ extends Gc{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new v_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class __ extends Uf{constructor(){super(new Mf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Bh extends Gc{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.target=new De,this.shadow=new __}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class y_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Hh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Hh();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Hh(){return(typeof performance>"u"?Date:performance).now()}class M_{constructor(t,e,n=0,s=1/0){this.ray=new Oo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Uc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return fc(t,this,n,e),n.sort(Vh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)fc(t[s],this,n,e);return n.sort(Vh),n}}function Vh(i,t){return i.distance-t.distance}function fc(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)fc(s[r],t,e,!0)}}class Wh{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Le(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cc);function b_(i){return{a:i>>>0,n:0,h:0,locked:!1}}function ar(i){if(i.locked)throw new Error("a dice draw while the rng is locked (a preview or legality check must never roll)");let t=i.a|0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;const n=((e^e>>>14)>>>0)/4294967296;return i.a=t,i.n++,i.h=Math.imul(i.h,31)+Math.floor(n*4294967296)>>>0,n}const Fo=i=>`${i.n}#${i.h.toString(36)}`;function Of(i){i.locked=!0}function Nf(i){i.locked=!1}const Jn=Object.freeze({W:40,H:28,deploy:8}),ui=1,Sr=12,Bo=3,zf=5,wr=6,Cs=Object.freeze([{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}].map(Object.freeze)),$c=i=>1+Math.floor(ar(i.rng)*6),He=(i,t)=>Array.from({length:t},()=>$c(i)),Xn=(i,t)=>i.filter(e=>e>=t).length,S_=(i,t,e)=>i<t?t:i>e?e:i,mo=i=>i>6?0:i<=1?1:(7-i)/6;function Bi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function Er(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function Tr(i,t,e){return Math.max(2,i+t-(e?1:0))}const pr=(i,t)=>S_(i+t,2,6);function Ps(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function Co(i,t,e,n,s){const r=n.t,o=mo(t),a=mo(Er(e.S,r.T,e.poison)),c=1-mo(Tr(r.Sv,e.AP,s)),l=i*o*a*c,h=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,l*h);return{wounds:l,kills:u,value:u*r.pts}}function kf(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const fn=(i,t,e)=>i+(t-i)*e,je=(i,t)=>i[Math.floor(t()*i.length)],ie=(i,t,e)=>t+i()*(e-t);function dn(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))dn(t)}return i}function Ho(i,t=0){let e=3735928559^t,n=1103547991^t;for(let s=0;s<i.length;s++){const r=i.charCodeAt(s);e=Math.imul(e^r,2654435761),n=Math.imul(n^r,1597334677)}return e=Math.imul(e^e>>>16,2246822507),e^=Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507),n^=Math.imul(e^e>>>13,3266489909),4294967296*(2097151&n)+(e>>>0)}function Ls(i){var t;if(i===null||typeof i=="boolean"||typeof i=="string")return JSON.stringify(i);if(typeof i=="number"){if(!Number.isFinite(i))throw new Error(`canonicalJSON: ${i} is not a finite number`);return JSON.stringify(i)}if(Array.isArray(i))return`[${i.map(e=>{if(e===void 0)throw new Error("canonicalJSON: undefined in an array");return Ls(e)}).join(",")}]`;if(typeof i=="object"&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null))return`{${Object.keys(i).filter(n=>i[n]!==void 0).sort().map(n=>`${JSON.stringify(n)}:${Ls(i[n])}`).join(",")}}`;throw new Error(`canonicalJSON: can't encode ${typeof i=="object"?((t=i.constructor)==null?void 0:t.name)??"object":typeof i}`)}const Gh={name:"Twig knives",S:3,AP:0,D:1},w_={key:"squirrel",name:"Bushtail Clans",short:"Bushtails",icon:"🐿️",look:{team:"#ec8a34",dark:"#7a3d12",alt:"#c75ad6",gore:["#cf6d2a","#f1dcb5"],voice:"squeak",models:"squirrel",anim:"squirrel"},army:["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],units:{nutkin:{name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",ai:"shooter",models:6,base:.3,pts:7,stats:"M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2",ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:Gh,abilities:["Scurry — may shoot after Advancing."]},grenadier:{name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",ai:"shooter",models:5,base:.3,pts:11,stats:"M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:Gh,abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{name:"Oak Guard",short:"Oak Guard",role:"Elite",ai:"melee",models:5,base:.34,pts:22,stats:"M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1",ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{name:"Glider Wing",short:"Gliders",role:"Fast",ai:"raider",models:4,base:.32,pts:15,fly:!0,stats:"M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1",ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:95,big:!0,stats:"M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0",ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{name:"Elder Chitterwick",short:"Elder",role:"Hero",ai:"hero",models:1,base:.42,pts:80,hero:!0,stats:"M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${wr}" use his Ld 9.`]}}},E_={key:"serpent",name:"Coil of Ssithra",short:"Serpents",icon:"🐍",look:{team:"#46c27a",dark:"#14532d",alt:"#4aa8e8",gore:["#3f8f4a","#d9cf86"],voice:"hiss",models:"serpent",anim:"serpent"},army:["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"],units:{scaleguard:{name:"Scaleguard",short:"Scaleguard",role:"Troops",ai:"line",models:6,base:.32,pts:10,stats:"M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2",ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{name:"Venom Spitters",short:"Spitters",role:"Troops",ai:"shooter",models:5,base:.32,pts:12,stats:"M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",ai:"melee",models:4,base:.34,pts:24,chargeAfterAdvance:!0,stats:"M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1",ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{name:"Constrictor Brute",short:"Brute",role:"Monster",ai:"melee",models:1,base:.95,pts:125,big:!0,wrecker:!0,stats:"M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4",ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."]},engine:{name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:100,big:!0,stats:"M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0",ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,corrodes:!0,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",ai:"hero",models:1,base:.45,pts:85,hero:!0,stats:"M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${wr}" use her Ld 9.`]}}},$h=Object.freeze(["M","WS","BS","S","T","W","A","Ld","Sv","OC"]),jh=Object.freeze(["Troops","Elite","Fast","Hero","Monster","Artillery"]),Xh=Object.freeze(["melee","raider","line","shooter","hero","artillery"]),Ff=Object.freeze(["fly","big","hero","wrecker","burrow","chargeAfterAdvance","noCharge","brawler"]),T_=new Set(["name","short","role","ai","models","base","pts","stats","ranged","melee","abilities",...Ff,"move","deployRow","eye","chest","swarm","swoop"]),Bf=["range","shots","S","AP","D","blast","scenery","poison","spell"],Hf=["assault","heavy","indirect","corrodes","mesmerize"],A_=new Set(["name","fx",...Bf,...Hf]),qh=["walk","fly","wreck","burrow"],Yh=["front","mid","back"],Kh=/^#[0-9a-f]{6}$/i,Jh=/^[a-z][a-z0-9-]*$/;function R_(i){const t={};for(const n of String(i).trim().split(/\s+/)){const s=/^([A-Za-z]+)(\d+)$/.exec(n);if(!s||!$h.includes(s[1]))throw new Error(`bad stat "${n}" in "${i}"`);if(s[1]in t)throw new Error(`${s[1]} given twice in "${i}"`);t[s[1]]=Number(s[2])}const e=$h.filter(n=>!(n in t));if(e.length)throw new Error(`"${i}" lacks ${e.join(", ")}`);return t}function Zh(i,t,e){const n=r=>new Error(`${t}: ${r}`);if(!i||typeof i!="object")throw n("must be a weapon object");for(const r of Object.keys(i))if(!A_.has(r))throw n(`unknown field "${r}"`);if(typeof i.name!="string"||!i.name)throw n("needs a name");if(i.fx!==void 0&&typeof i.fx!="string")throw n("fx is a string");for(const r of Bf)if(i[r]!==void 0&&!(Number.isFinite(i[r])&&i[r]>=0))throw n(`${r} must be a number ≥ 0`);for(const r of Hf)if(i[r]!==void 0&&typeof i[r]!="boolean")throw n(`${r} must be true or false`);for(const r of["shots","S","AP","D","scenery","poison","spell"])if(i[r]!==void 0&&!Number.isInteger(i[r]))throw n(`${r} must be a whole number`);const s=["S","AP","D"];if(e){for(const r of s)if(i[r]===void 0)throw n(`a melee weapon needs ${r}`);for(const r of["range","shots","blast","spell","mesmerize","indirect","heavy","assault"])if(i[r]!==void 0)throw n(`a melee weapon has no ${r}`)}else{if(i.range===void 0)throw n("a ranged weapon needs a range");if(!i.mesmerize){for(const r of["shots",...s])if(i[r]===void 0)throw n(`a ranged weapon needs ${r}`)}if(i.mesmerize&&!i.spell)throw n("mesmerize is a spell: give it a cast value")}return{...i}}function C_(i,t,e){var v,m;const n=`race ${i}, unit ${t}`,s=p=>new Error(`${n}: ${p}`);if(!e||typeof e!="object")throw s("must be an object");for(const p of Object.keys(e))if(!T_.has(p))throw s(`unknown field "${p}"`);for(const p of["name","short"])if(typeof e[p]!="string"||!e[p])throw s(`needs a ${p}`);if(!jh.includes(e.role))throw s(`role must be one of ${jh.join(", ")}`);if(!Xh.includes(e.ai))throw s(`ai must be one of ${Xh.join(", ")}`);if(!Number.isInteger(e.models)||e.models<1)throw s("models must be a whole number ≥ 1");if(!(Number.isFinite(e.base)&&e.base>0))throw s("base must be a radius > 0");if(!Number.isInteger(e.pts)||e.pts<0)throw s("pts must be a whole number ≥ 0");if(!Array.isArray(e.abilities)||e.abilities.some(p=>typeof p!="string"))throw s("abilities is a list of card text");for(const p of Ff)if(e[p]!==void 0&&typeof e[p]!="boolean")throw s(`${p} must be true or false`);if(e.move!==void 0&&!qh.includes(e.move))throw s(`move must be one of ${qh.join(", ")}`);if(e.deployRow!==void 0&&!Yh.includes(e.deployRow))throw s(`deployRow must be one of ${Yh.join(", ")}`);for(const p of["eye","chest"])if(e[p]!==void 0&&!(Number.isFinite(e[p])&&e[p]>0))throw s(`${p} must be a height > 0`);if(e.swarm!==void 0&&!Number.isInteger((v=e.swarm)==null?void 0:v.min))throw s("swarm is { min }");if(e.swoop!==void 0&&!Number.isInteger((m=e.swoop)==null?void 0:m.chargeS))throw s("swoop is { chargeS }");let r;try{r=R_(e.stats)}catch(p){throw s(p.message)}const o=e.ranged===null?null:Zh(e.ranged,`${n}, ranged`,!1),a=Zh(e.melee,`${n}, melee`,!0),c=(p,x)=>e[p]===void 0?x:e[p],l=c("fly",!1),h=c("big",!1),u=c("wrecker",!1),d=c("burrow",!1),f=c("hero",e.role==="Hero"),g={key:t,race:i,name:e.name,short:e.short,role:e.role,ai:e.ai,models:e.models,base:e.base,pts:e.pts,...r,ranged:o,melee:a,abilities:[...e.abilities],fly:l,big:h,hero:f,wrecker:u,burrow:d,chargeAfterAdvance:c("chargeAfterAdvance",!1),noCharge:c("noCharge",e.role==="Artillery"),brawler:c("brawler",!o||u),move:e.move??(l?"fly":u?"wreck":d?"burrow":"walk"),deployRow:e.deployRow??(e.role==="Artillery"?"back":f?"mid":"front"),eye:e.eye??(h?1.9:l?1.5:.95),chest:e.chest??(h||l?1:.55)};return e.swarm&&(g.swarm={min:e.swarm.min}),e.swoop&&(g.swoop={chargeS:e.swoop.chargeS}),g}function P_(i){if(!i||typeof i!="object")throw new Error("defineRace needs a race object");const{key:t}=i;if(typeof t!="string"||!Jh.test(t))throw new Error(`race key "${t}" must be lower-case letters, digits and dashes`);const e=r=>new Error(`race ${t}: ${r}`);for(const r of Object.keys(i))if(!["key","name","short","icon","look","army","units"].includes(r))throw e(`unknown field "${r}"`);for(const r of["name","short","icon"])if(typeof i[r]!="string"||!i[r])throw e(`needs a ${r}`);const n=i.look;if(!n||typeof n!="object")throw e("needs a look");for(const r of["team","dark","alt"])if(!Kh.test(n[r]??""))throw e(`look.${r} must be a #rrggbb colour`);if(!Array.isArray(n.gore)||n.gore.length!==2||!n.gore.every(r=>Kh.test(r)))throw e("look.gore is two #rrggbb colours");for(const r of["voice","models","anim"])if(typeof n[r]!="string"||!n[r])throw e(`look.${r} must be named`);if(!i.units||typeof i.units!="object"||!Object.keys(i.units).length)throw e("needs units");const s=Object.create(null);for(const[r,o]of Object.entries(i.units)){if(!Jh.test(r))throw e(`unit key "${r}" must be lower-case letters, digits and dashes`);s[r]=C_(t,r,o)}if(!Array.isArray(i.army)||!i.army.length)throw e("needs an army list");for(const r of i.army)if(!s[r])throw e(`army lists "${r}", which is not one of its units`);return dn({key:t,name:i.name,short:i.short,icon:i.icon,look:{...n,gore:[...n.gore]},army:[...i.army],units:s})}function L_(i){const t=i.map(s=>P_(s)),e=t.map(s=>s.key),n=e.find((s,r)=>e.indexOf(s)!==r);if(n!==void 0)throw new Error(`two races use the key "${n}"`);return dn(Object.assign(Object.create(null),Object.fromEntries(t.map(s=>[s.key,s]))))}const Tn=L_([w_,E_]),Ds=dn(Object.assign(Object.create(null),{classic:{objectives:[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],rounds:zf,deploy:Jn.deploy}})),Qh=Object.freeze(["squirrel","serpent"]);function Vt(i,t){const e=Math.abs(i),n=Math.abs(t);if(e===1/0||n===1/0)return 1/0;const s=Math.max(e,n);return s!==s?NaN:s===0?0:Math.sqrt(e/s*(e/s)+n/s*(n/s))*s}function D_(i,t,e){const n=Math.abs(i),s=Math.abs(t),r=Math.abs(e);if(n===1/0||s===1/0||r===1/0)return 1/0;const o=Math.max(Math.max(n,s),r);if(o!==o)return NaN;if(o===0)return 0;const a=n/o*(n/o),c=s/o*(s/o),l=a+c-a-c,h=r/o*(r/o)-l;return Math.sqrt(a+c+h)*o}const Ui=new DataView(new ArrayBuffer(8)),An=i=>(Ui.setFloat64(0,i),Ui.getInt32(0)),dc=i=>(Ui.setFloat64(0,i),Ui.getUint32(4)),At=(i,t)=>(Ui.setUint32(0,i>>>0),Ui.setUint32(4,t>>>0),Ui.getFloat64(0));function no(i,t){for(;t>1023;)i*=At(2145386496,0),t-=1023;for(;t<-1022;)i*=At(1048576,0),t+=1022;return i*At(t+1023<<20,0)}const tu=Object.freeze([10680707,7228996,1387004,2578385,16069853,12639074,9804092,4427841,16666979,11263675,12935607,2387514,4345298,14681673,3074569,13734428,16653803,1880361,10960616,8533493,3062596,8710556,7349940,6258241,3772886,3769171,3798172,8675211,12450088,3874808,9961438,366607,15675153,9132554,7151469,3571407,2607881,12013382,4155038,6285869,7677882,13102053,15825725,473591,9065106,15363067,6271263,9264392,5636912,4652155,7056368,13614112,10155062,1944035,9527646,15080200,6658437,6231200,6832269,16767104,5075751,3212806,1398474,7579849,6349435,12618859]),I_=Object.freeze([1073291771,1074340347,1074977148,1075388923,1075800698,1076025724,1076231611,1076437499,1076643386,1076849274,1076971356,1077074300,1077177244,1077280187,1077383131,1077486075,1077589019,1077691962,1077794906,1077897850,1077968460,1078019932,1078071404,1078122876,1078174348,1078225820,1078277292,1078328763,1078380235,1078431707,1078483179,1078534651]),U_=Object.freeze([At(1073291771,1073741824),At(1047807021,0),At(1022903960,2147483648),At(997772369,1610612736),At(972036995,2147483648),At(947528992,1073741824),At(920879650,2147483648),At(896135965,0)]),go=At(1097859072,0),za=At(1047527424,0),O_=At(1071931184,1841940611),eu=At(1073291771,1413480448),ka=At(1037087841,442655537),nu=At(1037087841,442499072),Fa=At(1000544650,771977331),N_=At(1000544650,771751936),z_=At(964395930,622873025);function k_(i,t,e,n){const o=new Array(20).fill(0),a=new Array(20).fill(0),c=new Array(20).fill(0),l=new Array(20).fill(0),h=n-1,u=Math.max(0,Math.trunc((e-3)/24));let d=e-24*(u+1);for(let x=0,_=u-h;x<=h+4;x++,_++)o[x]=_<0?0:tu[_];for(let x=0;x<=4;x++){let _=0;for(let y=0;y<=h;y++)_+=i[y]*o[h+x-y];a[x]=_}let f=4,g,v,m,p;for(;;){g=a[f];for(let y=0,R=f;R>0;y++,R--)p=Math.trunc(za*g),l[y]=Math.trunc(g-go*p),g=a[R-1]+p;if(g=no(g,d),g-=8*Math.floor(g*.125),v=Math.trunc(g),g-=v,m=0,d>0){const y=l[f-1]>>24-d;v+=y,l[f-1]-=y<<24-d,m=l[f-1]>>23-d}else d===0?m=l[f-1]>>23:g>=.5&&(m=2);if(m>0){v+=1;let y=0;for(let R=0;R<f;R++){const S=l[R];y===0?S!==0&&(y=1,l[R]=16777216-S):l[R]=16777215-S}d===1?l[f-1]&=8388607:d===2&&(l[f-1]&=4194303),m===2&&(g=1-g,y!==0&&(g-=no(1,d)))}if(g!==0)break;let x=0;for(let y=f-1;y>=4;y--)x|=l[y];if(x!==0)break;let _=1;for(;4>=_&&l[4-_]===0;)_++;for(let y=f+1;y<=f+_;y++){o[h+y]=tu[u+y];let R=0;for(let S=0;S<=h;S++)R+=i[S]*o[h+y-S];a[y]=R}f+=_}if(g===0)for(f-=1,d-=24;l[f]===0;)f--,d-=24;else g=no(g,-d),g>=go?(p=Math.trunc(za*g),l[f]=Math.trunc(g-go*p),f+=1,d+=24,l[f]=p):l[f]=Math.trunc(g);p=no(1,d);for(let x=f;x>=0;x--)a[x]=p*l[x],p*=za;for(let x=f;x>=0;x--){let _=0;for(let y=0;y<=4&&y<=f-x;y++)_+=U_[y]*a[x+y];c[f-x]=_}p=0;for(let x=f;x>=0;x--)p+=c[x];t[0]=m===0?p:-p,p=c[0]-p;for(let x=1;x<=f;x++)p+=c[x];return t[1]=m===0?p:-p,v&7}function Vf(i,t){const e=An(i),n=e&2147483647;if(n<=1072243195)return t[0]=i,t[1]=0,0;if(n<1073928572){const l=e>0?1:-1;let h=i-l*eu;return n!==1073291771?(t[0]=h-l*ka,t[1]=h-t[0]-l*ka):(h-=l*nu,t[0]=h-l*Fa,t[1]=h-t[0]-l*Fa),l}if(n<=1094263291){let l=Math.abs(i);const h=Math.trunc(l*O_+.5);let u=l-h*eu,d=h*ka;if(t[0]=u-d,h>=32||n===I_[h-1]){const f=n>>20;f-(An(t[0])>>20&2047)>16&&(l=u,d=h*nu,u=l-d,d=h*Fa-(l-u-d),t[0]=u-d,f-(An(t[0])>>20&2047)>49&&(l=u,d=h*N_,u=l-d,d=h*z_-(l-u-d),t[0]=u-d))}return t[1]=u-t[0]-d,e<0?(t[0]=-t[0],t[1]=-t[1],-h):h}if(n>=2146435072)return t[0]=t[1]=i-i,0;const s=(n>>20)-1046;let r=At(n-(s<<20),dc(i));const o=[0,0,0];for(let l=0;l<2;l++)o[l]=Math.trunc(r),r=(r-o[l])*go;o[2]=r;let a=3;for(;o[a-1]===0;)a--;const c=k_(o,t,s,a);return e<0?(t[0]=-t[0],t[1]=-t[1],-c):c}const iu=At(3217380693,1431655753),F_=At(1065423121,286324902),B_=At(3207201184,432103893),H_=At(1053236707,1471282813),V_=At(3193628134,2318114027),W_=At(1038473530,1523570044);function cr(i,t,e){if((An(i)&2147483647)<1044381696&&Math.trunc(i)===0)return i;const n=i*i,s=n*i,r=F_+n*(B_+n*(H_+n*(V_+n*W_)));return e===0?i+s*(iu+n*r):i-(n*(.5*t-s*r)-t-s*iu)}const G_=At(1067799893,1431655756),$_=At(3210133868,381768055),j_=At(1056571808,432739728),X_=At(3197271631,2157728429),q_=At(1042411166,3182735812),Y_=At(3181968105,3196598484);function lr(i,t){const e=An(i)&2147483647;if(e<1044381696&&Math.trunc(i)===0)return 1;const n=i*i,s=n*(G_+n*($_+n*(j_+n*(X_+n*(q_+n*Y_)))));if(e<1070805811)return 1-(.5*n-(n*s-i*t));const r=e>1072234496?.28125:At(e-2097152,0);return 1-r-(.5*n-r-(n*s-i*t))}function Ne(i){const t=An(i)&2147483647;if(t<=1072243195)return cr(i,0,0);if(t>=2146435072)return i-i;const e=[0,0];switch(Vf(i,e)&3){case 0:return cr(e[0],e[1],1);case 1:return lr(e[0],e[1]);case 2:return-cr(e[0],e[1],1);default:return-lr(e[0],e[1])}}function Xe(i){const t=An(i)&2147483647;if(t<=1072243195)return lr(i,0);if(t>=2146435072)return i-i;const e=[0,0];switch(Vf(i,e)&3){case 0:return lr(e[0],e[1]);case 1:return-cr(e[0],e[1],1);case 2:return-lr(e[0],e[1]);default:return cr(e[0],e[1],1)}}const Ba=Object.freeze([At(1071492199,90291023),At(1072243195,1413754136),At(1072657163,3531732635),At(1073291771,1413754136)]),Ha=Object.freeze([At(1014639487,573531618),At(1015129638,856972295),At(1013974920,2062601149),At(1016178214,856972295)]),vn=Object.freeze([At(1070945621,1431655693),At(3217660313,2576935876),At(1069697316,2449507327),At(3216798150,4263712369),At(1068975565,3310100590),At(3216224498,2943654509),At(1068567910,2698001745),At(3215842861,1390345626),At(1068071755,611716587),At(3215111236,745172015),At(1066446138,3810712081)]);function pc(i){const t=An(i),e=t&2147483647;let n;if(e>=1141899264)return i!==i?i+i:t>0?Ba[3]+Ha[3]:-Ba[3]-Ha[3];if(e<1071382528){if(e<1044381696)return i;n=-1}else i=Math.abs(i),e<1072889856?e<1072037888?(n=0,i=(2*i-1)/(2+i)):(n=1,i=(i-1)/(i+1)):e<1073971200?(n=2,i=(i-1.5)/(1+1.5*i)):(n=3,i=-1/i);const s=i*i,r=s*s,o=s*(vn[0]+r*(vn[2]+r*(vn[4]+r*(vn[6]+r*(vn[8]+r*vn[10]))))),a=r*(vn[1]+r*(vn[3]+r*(vn[5]+r*(vn[7]+r*vn[9]))));if(n<0)return i-i*(o+a);const c=Ba[n]-(i*(o+a)-Ha[n]-i);return t<0?-c:c}const io=At(1072243195,1413754136),Js=At(1073291771,1413754136),hs=At(1074340347,1413754136),Va=At(1017226790,856972295);function Is(i,t){if(t!==t||i!==i)return t+i;const e=An(t),n=dc(t),s=e&2147483647,r=An(i),o=dc(i),a=r&2147483647;if(t===1)return pc(i);let c=r>>31&1|e>>30&2;if(!(a|o))return c<2?i:c===2?hs:-hs;if(!(s|n))return r<0?-Js:Js;if(s===2146435072)return a===2146435072?[io,-io,3*io,-3*io][c]:[0,-0,hs,-hs][c];if(a===2146435072)return r<0?-Js:Js;const l=a-s>>20;let h;switch(l>60?(h=Js+.5*Va,c&=1):e<0&&l<-60?h=0:h=pc(Math.abs(i/t)),c){case 0:return h;case 1:return-h;case 2:return hs-(h-Va);default:return h-Va-hs}}const su=Math.SQRT2,Wf=(i,t,e)=>({nx:Math.round(i/e),nz:Math.round(t/e)});class K_{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n;const{nx:s,nz:r}=Wf(t,e,n);this.nx=s,this.nz=r;const o=this.N=this.nx*this.nz;this.hard=new Uint8Array(o),this.soft=new Uint8Array(o),this.diff=new Uint8Array(o),this.cover=new Uint8Array(o),this.clearAll=new Float32Array(o),this.clearHard=new Float32Array(o),this.tmp=new Float32Array(o)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Vt(t.hx,t.hz)+e,r=Xe(t.yaw),o=Ne(t.yaw),a=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),c=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),l=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),h=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=l;u<=h;u++)for(let d=a;d<=c;d++){const f=u*this.nx+d,g=this.x(f)-t.x,v=this.z(f)-t.z,m=g*r-v*o,p=g*o+v*r;Math.abs(m)<=t.hx+e&&Math.abs(p)<=t.hz+e&&(n[f]=1)}}field(t,e,n){const{nx:s,nz:r,cell:o}=this,a=1e6,c=o,l=o*su;for(let h=0;h<this.N;h++)n[h]=t[h]||e&&e[h]?0:a;for(let h=0;h<r;h++)for(let u=0;u<s;u++){const d=h*s+u;let f=n[d];u>0&&(f=Math.min(f,n[d-1]+c)),h>0&&(f=Math.min(f,n[d-s]+c),u>0&&(f=Math.min(f,n[d-s-1]+l)),u<s-1&&(f=Math.min(f,n[d-s+1]+l))),n[d]=f}for(let h=r-1;h>=0;h--)for(let u=s-1;u>=0;u--){const d=h*s+u;let f=n[d];u<s-1&&(f=Math.min(f,n[d+1]+c)),h<r-1&&(f=Math.min(f,n[d+s]+c),u<s-1&&(f=Math.min(f,n[d+s+1]+l)),u>0&&(f=Math.min(f,n[d+s-1]+l))),n[d]=f}for(let h=0;h<this.N;h++){const u=this.x(h),d=this.z(h),f=Math.min(u+this.W/2,this.W/2-u,d+this.H/2,this.H/2-d);n[h]=Math.min(n[h]>0?n[h]-o*.5:0,f)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:o=null}){const a=this.N,c=new Float64Array(a).fill(1/0),l=new Int32Array(a).fill(-1),h=this.index(t,e),u={dist:c,prev:l,start:h,mode:r,sx:t,sz:e};if(h<0)return u;if(r==="fly"){for(let x=0;x<a;x++){const _=Vt(this.x(x)-t,this.z(x)-e);_<=s&&(c[x]=_)}return u}const d=Vt(t-this.x(h),e-this.z(h));c[h]=d;const f=new Z_;f.push(h,d);const{nx:g,nz:v,cell:m}=this,p=this.clearance(h,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;f.size;){const[x,_]=f.pop();if(_>c[x])continue;const y=x%g,R=x/g|0;for(let S=-1;S<=1;S++)for(let E=-1;E<=1;E++){if(!E&&!S)continue;const O=y+E,M=R+S;if(O<0||M<0||O>=g||M>=v)continue;const w=M*g+O;if(o&&o[w])continue;const z=this.clearance(w,r==="wreck"?"wreck":"all");if(z<n-.06&&!(p&&z>.05&&Vt(this.x(w)-t,this.z(w)-e)<p))continue;let j=this.diff[w]?2:1;r==="wreck"&&this.clearAll[w]<n-.06&&(j=2);const et=_+(E&&S?su:1)*m*j;et<=s&&et<c[w]&&(c[w]=et,l[w]=x,f.push(w,et))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let l=e;l!==-1&&(r.push(l),l!==t.start);l=t.prev[l]);r.reverse();const o=r.map(l=>({x:this.x(l),z:this.z(l)}));if(o[0]={x:t.sx,z:t.sz},o.length<3)return o;const a=[o[0]];let c=0;for(;c<o.length-1;){let l=c+1;for(let h=o.length-1;h>c+1;h--)if(this.walkable(o[c],o[h],n,t.mode,s)){l=h;break}a.push(o[l]),c=l}return a}walkable(t,e,n,s,r){const o=Vt(e.x-t.x,e.z-t.z),a=Math.ceil(o/(this.cell*.5)),c=this.diff[this.index(t.x,t.z)];for(let l=1;l<a;l++){const h=l/a,u=this.index(t.x+(e.x-t.x)*h,t.z+(e.z-t.z)*h);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==c||s==="wreck"&&this.clearAll[u]<n-.06)return!1}if(r!=null&&r.discs){for(const l of r.discs)if(J_(t,e,l)<l.R)return!1}return!0}}function J_(i,t,e){const n=t.x-i.x,s=t.z-i.z,r=n*n+s*s;let o=r>0?((e.x-i.x)*n+(e.z-i.z)*s)/r:0;return o=o<0?0:o>1?1:o,Vt(i.x+n*o-e.x,i.z+s*o-e.z)}const Gf=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Vt(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class Z_{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const o=r-1>>1;if(s[o]<=e)break;n[r]=n[o],s[r]=s[o],r=o}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let o=0;const a=t.length;for(;;){let c=2*o+1;if(c>=a||(c+1<a&&e[c+1]<e[c]&&c++,e[c]>=r))break;t[o]=t[c],e[o]=e[c],o=c}t[o]=s,e[o]=r}return n}}function wi(i,t,e){i&&i.push({t,...e})}function lt(i,t,e={}){wi(i.out,t,e)}function $f(i,t){var e;i.journal.trace.push(t),(e=i.onTrace)==null||e.call(i,t,i)}function Vo(i,t){const e=i.units.map(n=>`${n.id}:${n.pos.x.toFixed(3)},${n.pos.z.toFixed(3)},${n.models.map(s=>s.w).join("/")}`).join(" ");$f(i,`${t} ${e} chunks:${i.terrain.chunks.filter(n=>n.alive).length} vp:${i.turn.vp.join("-")} rng:${Fo(i.rng)}`)}function Q_(i,t,e){$f(i,`log ${t} ${e.replace(/<[^>]+>/g,"")} rng:${Fo(i.rng)}`)}function _e(i,t,e,n=""){Q_(i,t,e),lt(i,"log",{side:t,html:e,cls:n,traced:!0,at:i.journal.trace.length}),jf(i)}function jf(i){for(const[t,e,n]of i.journal.pendingLog.splice(0))lt(i,"log",{side:t,html:e,cls:n,traced:!1,at:i.journal.trace.length})}const Xf=dn({stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}}),ty=dn({oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]}),ey=dn(["#7a5232","#5f3e24","#9a7048","#b08a5a"]),ny=Object.freeze(["#6b4a2e","#5a3d24","#7a5638"]),iy=Object.freeze(["#3f7a34","#4a8a3a","#386c2e"]),sy=Object.freeze(["#4f8f3e","#5c9a46","#3f7a34"]),ry=Object.freeze(["#3f7a34","#5c9a46","#2f5f28"]),oy=Object.freeze(["#7d7a74","#8c8880","#6e6b66","#96918a"]),ay=Object.freeze(["#9a7048","#8a6038","#a77d50"]),cy=Object.freeze(["#8a5a34","#7a4c2a"]),ly=Object.freeze(["#c0392b","#d35a1f","#8e44ad","#b03050"]),ru=22;function hr(i,t,e,n){const s=kf(n),r=Xe(e.yaw),o=Ne(e.yaw),a={p:(c,l)=>({x:e.x+r*c+o*l,z:e.z-o*c+r*l}),yaw:(c=0)=>e.yaw+c};vo[t](i,a,s)}function mr(i,t,e,n,s,r,o,a,{holes:c=[],cap:l=!1,bw:h,bt:u}={}){const d=Xf[a],f=h??d.bw,g=u??d.bt,v=t.p(n,s),m=t.yaw(r),p={blocks:[],x:v.x,z:v.z,yaw:m,style:a,by:d.by,rubble:null,w:f,t:g};for(let x=0;x<o;x++){if(c.includes(x))continue;const _=je(d.colors,e),y=m+(e()-.5)*.06,R=d.look==="log"?[f*1.02,d.by,g]:[f*(.95+e()*.04),d.by*.96,g*(.9+e()*.1)],S=i.add({kind:"block",hp:d.hp,shape:{x:v.x,y:d.by*(x+.5),z:v.z,hx:f/2,hy:d.by/2,hz:g/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:x,look:{piece:d.look,color:_,chip:_,scale:R,yaw:y}});p.blocks.push(S)}if(l&&o>0){const x=je(d.colors,e),_=d.by*o+f*.55,y=i.add({kind:"block",hp:d.hp,shape:{x:v.x,y:_,z:v.z,hx:f/2,hy:f*.55,hz:f/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:o,look:{piece:"cap",color:x,chip:x,r:f*.72,h:f*1.1,yaw:m}});p.blocks.push(y)}return p}function hy(i,t,e,n,s,r){const o=t.p(n,s),a=ie(e,1.5,2.4),c=ie(e,.17,.26),l=je(ny,e),h=ty[r],u=[];let d;if(r==="pine"){for(let g=0;g<3;g++){const v=1.05-g*.26,m=1.3-g*.15;u.push({cone:!0,r:v,h:m,color:je(h,e),y:a*.45+g*.75+m/2,yaw:e()*3})}d=a*.45+2.5}else{const g=3+Math.floor(e()*3);for(let v=0;v<g;v++){const m=ie(e,.55,.9);u.push({r:m,color:je(h,e),pos:[ie(e,-.5,.5),a+ie(e,-.1,.6),ie(e,-.5,.5)]})}d=a+1.2}const f=e()*6;return i.add({kind:"tree",hp:3,shape:{x:o.x,y:d/2,z:o.z,hx:.7,hy:d/2,hz:.7,yaw:0},nav:{x:o.x,z:o.z,hx:c+.12,hz:c+.12,yaw:0},coverShape:{x:o.x,z:o.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0,trunkH:a,trunkR:c,look:{piece:"tree",trunk:{h:a,r:c},bark:l,canopy:u,yaw:f,leaves:h}})}function uy(i,t,e,n,s,r){const o=t.p(n,s),a=t.yaw(r),c=je(iy,e),l=[];for(let u=0;u<3;u++)l.push({color:je(sy,e),pos:[-.4+u*.4,.62+e()*.08,ie(e,-.08,.08)]});const h=[];if(e()<.4)for(let u=0;u<4;u++)h.push([ie(e,-.5,.5),ie(e,.35,.75),.29]);return i.add({kind:"hedge",hp:1,shape:{x:o.x,y:.42,z:o.z,hx:.6,hy:.42,hz:.3,yaw:a},navKind:"diff",los:"obscure",cover:!0,look:{piece:"hedge",color:c,tufts:l,berries:h,yaw:a,leaves:ry}})}function mc(i,t,e,n,s,r){const o=t.p(n,s),a=ie(e,.65,1.25),c=je(oy,e),l=[1,a,ie(e,.75,1.1)],h=[e()*.6,e()*6,e()*.6],u=r*a,d=e()<.6,f=u*1.5;return i.add({kind:"rock",hp:1/0,shape:{x:o.x,y:f/2,z:o.z,hx:r*.85,hy:f/2,hz:r*.85,yaw:0},navKind:"hard",los:f>1.2?"block":"obscure",cover:!0,look:{piece:"boulder",size:r,color:c,scale:l,rot:h,y:u*.55,moss:d}})}function jc(i,t,e,n,s){const r=t.p(n,s),o=t.yaw(e()*6),a=e();let c,l;if(a<.45){const h=ie(e,.55,.75),u=je(ay,e),d=e()<.4;c={piece:"crate",s:h,color:u,stacked:d},l=d?h*1.7:h}else if(a<.8)c={piece:"barrel",color:je(cy,e)},l=.75;else{const h=[];for(let u=0;u<4;u++)h.push([ie(e,-.12,.12),ie(e,-.12,.12)]);c={piece:"sack",acorns:h},l=.78}return i.add({kind:"crate",hp:1,shape:{x:r.x,y:l/2,z:r.z,hx:.36,hy:l/2,hz:.36,yaw:o},navKind:"diff",los:"obscure",cover:!0,look:{...c,yaw:o,chip:"#9a7048"}})}function fy(i,t,e,n,s){const r=t.p(n,s),o=ie(e,.9,1.9),a=ie(e,.5,.95),c=ie(e,.12,.2),l=je(ly,e),h=[];for(let f=0;f<6;f++){const g=e()*6,v=ie(e,.25,1.1);h.push([g,v])}const u=ie(e,-.12,.12),d=o+a*.7;return i.add({kind:"mushroom",hp:2,shape:{x:r.x,y:d/2,z:r.z,hx:a*.6,hy:d/2,hz:a*.6,yaw:0},nav:{x:r.x,z:r.z,hx:c+.12,hz:c+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0,look:{piece:"mushroom",h:o,r:a,sr:c,cap:l,dots:h,tilt:u,leaves:[l,"#fff6e0","#efe6d0"]}})}function dy(i,t,e,n,s){const r=t.p(0,0),o=[];for(let a=1;a<ru+2;a++)o.push(.78+e()*.3);return i.add({kind:"floor",hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0,look:{piece:"floor",r:n,segments:ru,color:s,rim:o}})}function py(i,t,e){const n=je(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),o=-s/2+.5,a=-r/2+.5,c=1+Math.floor(e()*(s-2));for(let h=0;h<s;h++){if(h===c)continue;let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)-(e()<.3?1:0)));const d=u===3&&e()<.35?[1]:[];mr(i,t,e,o+h,a,0,u,n,{holes:d})}for(let h=1;h<=r;h++){let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)));if(e()<.15)continue;const d=u===3&&e()<.35?[1]:[];mr(i,t,e,o,a+.3+.5+(h-1),Math.PI/2,u,n,{holes:d})}const l=Math.floor(e()*3);for(let h=0;h<l;h++)jc(i,t,e,o+ie(e,1.5,s-1),a+ie(e,1.6,r-.5))}function my(i,t,e){const n=je(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let o=0;o<s;o++){if(o===r&&s>5)continue;const a=1+Math.floor(e()*3);mr(i,t,e,o-(s-1)/2,0,0,a,n,{holes:a===3&&e()<.4?[1]:[]})}e()<.6&&jc(i,t,e,ie(e,-2,2),ie(e,.9,1.4))}function gy(i,t,e){const n=je(["stone","sand"],e),s=18,r=3.4,o=[];for(let l=0;l<s/2;l++)o.push(1+Math.floor(e()*3));const a=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),c=o.map(l=>l===3&&e()<.4);for(let l=0;l<s;l++){const h=l%(s/2);if(a.has(h))continue;const u=l/s*Math.PI*2,d=Is(-Xe(u),-Ne(u));mr(i,t,e,Xe(u)*r,Ne(u)*r,d,o[h],n,{holes:c[h]?[1]:[],bw:1.12})}}function vy(i,t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";dy(i,t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let o=0;o<60&&s.length<r;o++){const a=e()*Math.PI*2,c=Math.sqrt(e())*2.2,l=Xe(a)*c,h=Ne(a)*c;s.some(u=>Vt(u.x-l,u.z-h)<1.55)||s.push({x:l,z:h})}for(const o of s)hy(i,t,e,o.x,o.z,n)}function xy(i,t,e){const n=5+Math.floor(e()*3),s=ie(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let o=0;o<n;o++){if(o===r&&e()<.7)continue;const a=(o-(n-1)/2)*1.12,c=s*a*a;uy(i,t,e,a,c,-pc(2*s*a))}}function _y(i,t,e){const n=2+Math.floor(e()*3);mc(i,t,e,0,0,ie(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;mc(i,t,e,Xe(r)*ie(e,.9,1.4),Ne(r)*ie(e,.9,1.4),ie(e,.35,.7))}}function yy(i,t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)jc(i,t,e,(s-(n-1)/2)*.8+ie(e,-.1,.1),ie(e,-.3,.3))}function My(i,t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const o=e()*6,a=Math.sqrt(e())*1.5,c=Xe(o)*a,l=Ne(o)*a;s.some(h=>Vt(h.x-c,h.z-l)<.9)||(s.push({x:c,z:l}),fy(i,t,e,c,l))}}function by(i,t,e){mr(i,t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&mc(i,t,e,1,.4,.4)}const vo=dn(Object.assign(Object.create(null),{ruin:py,wall:my,tower:gy,forest:vy,hedgerow:xy,rocks:_y,barricade:yy,mushrooms:My,obelisk:by})),gc=dn(Object.assign(Object.create(null),{tower(i,t,e){hr(i,"tower",{x:0,z:0,yaw:t()*Math.PI},t()*1e9|0),e.push({x:0,z:0,r:4.6,hollow:!0})},rockbox(i,t,e){const n=t()*Math.PI;for(const s of[0,1]){const r=n+s*(Math.PI/2),o=Xe(r)*4.2,a=Ne(r)*4.2,c=t()*1e9|0;hr(i,"rocks",{x:o,z:a,yaw:r},c),hr(i,"rocks",{x:-o,z:-a,yaw:r+Math.PI},c),e.push({x:o,z:a,r:1.8},{x:-o,z:-a,r:1.8})}}}));function Sy(i,t,e,n,s){const r=kf(e),{W:o,H:a}=i,c=[],l=r(),h=t.centre.find(([,v])=>l<v);h&&gc[h[0]](i,r,c);const u=t.kinds,d=u.reduce((v,m)=>v+m[2],0),f=t.pairs[0]+Math.floor(r()*t.pairs[1]);let g=0;for(let v=0;v<t.attempts&&g<f;v++){let m=r()*d,p=u[0];for(const w of u)if((m-=w[2])<=0){p=w;break}const[x,_]=p,y=ie(r,-o/2+_+t.margin,o/2-_-t.margin),R=ie(r,-a/2+_+t.margin,a/2-_-t.margin);if(Vt(y,R)<_+t.selfGap||Math.abs(y)>o/2-s-t.deployMargin&&(_>t.bigNotInDeploy||t.notInDeploy.includes(x))||n.some(w=>Vt(w.x-y,w.z-R)<_+t.objectiveGap))continue;const E=t.gap;if(c.some(w=>Vt(w.x-y,w.z-R)<w.r+_+E||Vt(w.x+y,w.z+R)<w.r+_+E))continue;const O=r()*Math.PI*2,M=r()*1e9|0;hr(i,x,{x:y,z:R,yaw:O},M),hr(i,x,{x:-y,z:-R,yaw:O+Math.PI},M),c.push({x:y,z:R,r:_},{x:-y,z:-R,r:_}),g++}return c}const ou=Object.freeze(["centre","kinds","pairs","attempts","mirror","margin","selfGap","deployMargin","bigNotInDeploy","notInDeploy","objectiveGap","gap"]),au=Object.freeze(["point"]);function wy(i,t){const e=r=>{throw new Error(`terrain set "${i}": ${r}`)},n=r=>typeof r=="number"&&Number.isFinite(r),s=r=>Number.isInteger(r)&&r>=0;(!t||typeof t!="object")&&e("is not a table");for(const r of Object.keys(t))ou.includes(r)||e(`unknown field "${r}"`);for(const r of ou)r in t||e(`no "${r}"`);(!Array.isArray(t.kinds)||!t.kinds.length)&&e("kinds must list at least one feature"),t.kinds.forEach((r,o)=>{(!Array.isArray(r)||r.length!==3)&&e(`kinds[${o}] must be [feature, radius, weight]`),r[0]in vo||e(`kinds[${o}]: no feature "${r[0]}" (there are ${Object.keys(vo).join(", ")})`),(!n(r[1])||r[1]<=0)&&e(`kinds[${o}] (${r[0]}): radius ${r[1]} must be a number above 0`),(!n(r[2])||r[2]<=0)&&e(`kinds[${o}] (${r[0]}): weight ${r[2]} must be a number above 0`)}),Array.isArray(t.centre)||e("centre must be a list of [piece, threshold]"),t.centre.forEach((r,o)=>{(!Array.isArray(r)||r.length!==2)&&e(`centre[${o}] must be [piece, threshold]`),r[0]in gc||e(`centre[${o}]: no centre piece "${r[0]}" (there are ${Object.keys(gc).join(", ")})`),(!n(r[1])||r[1]<=0||r[1]>1)&&e(`centre[${o}] (${r[0]}): threshold ${r[1]} must be in (0, 1]`),o&&r[1]<=t.centre[o-1][1]&&e(`centre[${o}] (${r[0]}): thresholds must rise (the first one above the draw wins)`)}),(!Array.isArray(t.pairs)||t.pairs.length!==2||!t.pairs.every(s))&&e("pairs must be two whole numbers, 0 or more"),s(t.attempts)||e(`attempts ${t.attempts} must be a whole number, 0 or more`),au.includes(t.mirror)||e(`mirror "${t.mirror}" is not one scatter knows (${au.join(", ")})`);for(const r of["margin","selfGap","deployMargin","bigNotInDeploy","objectiveGap","gap"])n(t[r])||e(`${r} ${t[r]} must be a finite number`);Array.isArray(t.notInDeploy)||e("notInDeploy must be a list of features");for(const r of t.notInDeploy)r in vo||e(`notInDeploy: no feature "${r}"`);return t}const Ms=dn(Object.assign(Object.create(null),{classic:{centre:[["tower",.55],["rockbox",.8]],kinds:[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],pairs:[6,3],attempts:1200,mirror:"point",margin:.5,selfGap:1.4,deployMargin:1,bigNotInDeploy:2.1,notInDeploy:["forest"],objectiveGap:2.2,gap:2.1}}));for(const i of Object.keys(Ms))wy(i,Ms[i]);function Ey(i,t,e,n,s){const r=Xe(s.yaw),o=Ne(s.yaw),a=i.x-s.x,c=i.y-s.y,l=i.z-s.z,h=[a*r-l*o,c,a*o+l*r],u=[t*r-n*o,e,t*o+n*r],d=[s.hx,s.hy,s.hz];let f=0,g=1;for(let v=0;v<3;v++)if(Math.abs(u[v])<1e-9){if(Math.abs(h[v])>d[v])return!1}else{let m=(-d[v]-h[v])/u[v],p=(d[v]-h[v])/u[v];if(m>p&&([m,p]=[p,m]),m>f&&(f=m),p<g&&(g=p),f>g)return!1}return!0}function Ty(i,t,e,n){const s=Xe(n.yaw),r=Ne(n.yaw),o=i-n.x,a=t-n.y,c=e-n.z,l=o*s-c*r,h=o*r+c*s,u=Math.max(0,Math.abs(l)-n.hx),d=Math.max(0,Math.abs(a)-n.hy),f=Math.max(0,Math.abs(h)-n.hz);return D_(u,d,f)}const cu=i=>({x:i.shape.x,y:i.shape.y,z:i.shape.z}),Ay=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});class Ry{constructor(t,e){this.W=t,this.H=e,this.chunks=[],this.features=[],this.dirty=!0,this.nextId=1}clear(t=null){this.chunks=[],this.features=[],this.nextId=1,this.dirty=!0,wi(t,"terrain.clear",{})}add(t,e=null){const n={id:this.nextId++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},s=n.shape;return s.reach=Vt(s.hx,s.hz)+.05,this.chunks.push(n),wi(e,"terrain.add",{def:Ay(n)}),n}generate(t,e,n,s="classic",r=null){if(!(s in Ms))throw new Error(`no terrain set "${s}" (there are ${Object.keys(Ms).join(", ")})`);this.clear(r);const o={W:this.W,H:this.H,add:a=>this.add(a,r)};this.features=Sy(o,Ms[s],t,e,n),this.dirty=!0}los(t,e,n=1.3){let s=0;const r=e.x-t.x,o=e.y-t.y,a=e.z-t.z,c=r*r+a*a;for(const l of this.chunks){if(!l.alive||!l.los)continue;const h=l.shape;let u=c>0?((h.x-t.x)*r+(h.z-t.z)*a)/c:0;u=u<0?0:u>1?1:u;const d=t.x+r*u-h.x,f=t.z+a*u-h.z;if(!(d*d+f*f>h.reach*h.reach)&&Ey(t,r,o,a,h)){if(l.los==="block")return{blocked:!0,obscure:s};Vt(h.x-t.x,h.z-t.z)<n+h.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={},o=null){const a=[];for(const c of[...this.chunks]){if(!c.alive||!c.destructible)continue;const l=Ty(t,.5,e,c.shape);if(l>n)continue;let h=l<n*.6?s:Math.ceil(s/2);r&&c.kind==="block"&&(h+=1),this.hurt(c,h,{x:t,z:e},o,a)}return a}hurt(t,e,n,s=null,r=[]){return!t.alive||!t.destructible||(t.hp-=e,t.hp<=0?(this.destroy(t,n,s),r.push(t)):wi(s,"terrain.hurt",{id:t.id,from:n,at:cu(t)})),r}destroy(t,e,n=null){switch(t.alive=!1,this.dirty=!0,wi(n,"terrain.destroy",{id:t.id,kind:t.kind,from:e,at:cu(t)}),t.kind){case"block":this.collapse(t.col,n),this.rubble(t.col,e,n);break;case"tree":this.topple(t,e,n);break}}collapse(t,e=null){t.blocks=t.blocks.filter(r=>r.alive).sort((r,o)=>r.level-o.level);const n=[];let s=0;for(const r of t.blocks){if(r.level>s){const o=(r.level-s)*t.by;r.level=s,r.shape.y-=o,n.push({id:r.id,dy:o})}s=r.level+1}n.length&&wi(e,"terrain.collapse",{drops:n,by:t.by})}rubble(t,e,n=null){let s=t.rubble;if(!s){const r=t.style;s=t.rubble=this.add({kind:"rubble",hp:1/0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0,look:{piece:"rubble",style:r}},n),this.dirty=!0}wi(n,"terrain.rubble",{id:s.id,from:e})}topple(t,e,n=null){const s=t.shape;let r=s.x-((e==null?void 0:e.x)??s.x-1),o=s.z-((e==null?void 0:e.z)??s.z);const a=Vt(r,o)||1;r/=a,o/=a;const c=t.trunkH,l=this.add({kind:"log",hp:2,shape:{x:s.x+r*c*.5,y:t.trunkR,z:s.z+o*c*.5,hx:c*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Is(-o,r)},navKind:"diff",los:"obscure",cover:!0,look:{piece:"fallen",tree:t.id,dx:r,dz:o}},n);return this.dirty=!0,l}}function Cy(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Ne(Math.PI/i));return Array.from({length:i},(o,a)=>[Xe(a/i*Math.PI*2+.4)*r,Ne(a/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Ne(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,o)=>[Xe(o/n*Math.PI*2+.3)*s,Ne(o/n*Math.PI*2+.3)*s])]}function Py(i,t,e){const n=qn(i,e),s=n.units[t],r={id:i.nextUnitId++,key:t,t:s,side:e,race:n.key,pos:{x:0,z:0},models:[],alive:s.models,r:0,flags:{},lost:0,mesmerized:!1};for(let o=0;o<s.models;o++)r.models.push({w:s.W,alive:!0,ox:0,oz:0});return qf(r),r}function qf(i){const t=i.models.filter(n=>n.alive),e=Cy(t.length,i.t.base);t.sort((n,s)=>Is(n.oz,n.ox)-Is(s.oz,s.ox)),e.forEach(([n,s],r)=>{t[r].ox=n,t[r].oz=s}),i.r=e.reduce((n,[s,r])=>Math.max(n,Vt(s,r)),0)+i.t.base}function Wo(i,t,e){i.pos.x=t,i.pos.z=e}function Yf(i,t){const{W:e}=Jn,n=vr(i,t),s=n*(e/2),r=n*(e/2-gr(i.setup).deploy);return{minX:Math.min(s,r),maxX:Math.max(s,r)}}function Kf(i,t,e,{minX:n,maxX:s},r){const o=i.nav,a=o.x(e),c=o.z(e);return!(a-t.r<n-.01||a+t.r>s+.01||!o.standable(e,t.r,"walk")||r.some(l=>Vt(l.pos.x-a,l.pos.z-c)<l.r+t.r+.4))}function Ly(i,t,e){return Number.isInteger(e)&&e>=0&&e<i.nav.N&&Kf(i,t,e,Yf(i,t.side),i.units.filter(n=>n!==t))}function Jf(i,t,e,n,s,r){const o=i.nav;let a=null,c=1/0;const l=Yf(i,s);for(let h=0;h<o.N;h++){if(!Kf(i,t,h,l,r))continue;const u=o.x(h),d=o.z(h),f=Vt(u-e,d-n);f<c&&(c=f,a={x:u,z:d})}return a}function Dy(i){const{W:t,H:e}=Jn;for(const n of[0,1]){const s=vr(i,n),r=i.units.filter(d=>d.side===n),o=[],a=r.filter(d=>d.t.deployRow==="back"),c=r.filter(d=>d.t.deployRow==="mid"),l=r.filter(d=>d.t.deployRow==="front"),h=gr(i.setup).deploy,u=[[l,t/2-h+1.8],[c,t/2-h+3.6],[a,t/2-2.4]];for(const[d,f]of u)d.forEach((g,v)=>{const m=((v+.5)/d.length-.5)*(e-6)*-s,p=Jf(i,g,s*f,m,n,o)||{x:s*f,z:m};Wo(g,p.x,p.z),o.push(g)})}}const Zf=Object.freeze([-1,1]),gr=i=>Ds.classic,Qf=.5;function Iy(i,t){if(i.length!==2||t.length!==2)throw new Error("a match has two seats");return i.map((e,n)=>{if(typeof e!="string"||!Tn[e])throw new Error(`seat ${n}: no race "${e}" (there are ${Object.keys(Tn).join(", ")})`);if(t[n]!=="human"&&t[n]!=="ai")throw new Error(`seat ${n}: controller "${t[n]}" is neither human nor ai`);return{seat:n,race:e,edge:Zf[n],ctrl:t[n]}})}const Uy=i=>({...i,seats:i.seats.map(t=>({...t}))}),qn=(i,t)=>Tn[i.seats[t].race],vr=(i,t)=>i.seats[t].edge,td=(i,t)=>i.seats[t].ctrl;function Oy(i,{out:t=null,onTrace:e=null}={}){const{W:n,H:s}=Jn,r={setup:dn(Uy(i)),rng:b_(i.dice),seats:Iy(i.seats.map(o=>o.race),i.seats.map(o=>o.ctrl)),units:[],nextUnitId:1,objectives:gr().objectives.map((o,a)=>({i:a,x:o.x,z:o.z})),terrain:new Ry(n,s),nav:new K_(n,s,Qf),turn:{stage:"deploy",step:"rolloff",round:1,t:0,active:0,first:0,ph:0,vp:[0,0],wiped:-1,result:null,overtime:0},pending:null,journal:{trace:[],pendingLog:[]},out:t,onTrace:e,strict:!1};r.terrain.generate(i.board,r.objectives,gr().deploy,i.terrain,t),Gi(r);for(const o of[0,1])for(const a of qn(r,o).army)r.units.push(Py(r,a,o));return Dy(r),r}function Gi(i){i.terrain.dirty&&(i.terrain.dirty=!1,i.nav.rebuild(i.terrain.chunks))}function Go(i,t,e,n,s,r=null){let o=0;for(let a=0;a<e;a++){const c=t.models.filter(f=>f.alive);if(!c.length)break;let l=r?c.filter(f=>r.includes(f)):[];l.length||(l=c);const h=l.filter(f=>f.w<t.t.W);let u;if(h.length)u=h[0];else{const f=g=>Vt(Bs(t,g)-s.pos.x,Hs(t,g)-s.pos.z);u=l.reduce((g,v)=>f(g)<f(v)?g:v)}u.w-=n;const d=Math.min(n,n+Math.min(0,u.w));u.w<=0?(Ny(i,t,u,s,d),o++):lt(i,"unit.wound",{u:t.id,m:t.models.indexOf(u),dmg:d}),lt(i,"pause",{s:.06})}return o&&(t.lost+=o,lt(i,"pause",{s:.25}),oe(t)&&ed(i,t),i.out&&lt(i,"objectives",{owners:$i(i)})),i.out&&lt(i,"status",gi(i)),o}function ed(i,t){const e=Rr(i,t);if(qf(t),e.length&&!Qe(i,t)){const n=e.reduce((o,a)=>fi(t,o)<fi(t,a)?o:a),s=Xo(t,n),r=fi(t,n)-(ui-.3);Wo(t,t.pos.x+(n.pos.x-t.pos.x)/s*r,t.pos.z+(n.pos.z-t.pos.z)/s*r)}lt(i,"unit.formation",{u:t.id,offs:t.models.map(n=>[n.ox,n.oz]),r:t.r,pos:{x:t.pos.x,z:t.pos.z}})}function Ny(i,t,e,n,s){e.alive=!1,e.w=0,t.alive--,lt(i,"unit.slain",{u:t.id,m:t.models.indexOf(e),by:n?n.id:null,dmg:s}),oe(t)||nd(i,t,n)}function nd(i,t,e){i.journal.pendingLog.push([t.side,`<b>${t.t.name}</b> ${t.t.models>1?"are":"is"} destroyed!`,"big"]),lt(i,"unit.destroyed",{u:t.id,by:e?e.id:null})}function Us(i,t){const e=t.t.ranged;return!(!e||!oe(t)||t.flags.shot||t.mesmerized||t.flags.fellBack||Qe(i,t)||t.flags.advanced&&!e.assault)}function $o(i,t,e){const n=t.t.ranged,s=fi(t,e);if(s>n.range)return{ok:!1,why:`out of range (${s.toFixed(1)}" / ${n.range}")`};if(Qe(i,e)&&!n.spell)return{ok:!1,why:"locked in combat"};const r=Zc(i,t,e);if(!r.visible&&!n.indirect)return{ok:!1,why:"no line of sight"};let o=0;return n.heavy&&t.flags.moved&&o++,n.indirect&&!r.visible&&o++,{ok:!0,range:s,...r,mod:o,need:pr(t.t.BS,o)}}function Xc(i,t){return Us(i,t)?In(i,t).filter(e=>$o(i,t,e).ok):[]}function zy(i,t,e){const n=t.t.ranged,s=$o(i,t,e);if(t.flags.shot=!0,lt(i,"unit.face",{u:t.id,tg:e.id}),lt(i,"tray.open",{title:`${t.t.short} → ${e.t.short} · ${n.name}`}),n.spell){const v=He(i,2),m=v[0]+v[1]>=n.spell;if(lt(i,"dice",{label:`Cast ${n.spell}+ (2D6)`,dice:v,need:0,sum:!0,pass:m}),!m){lt(i,"spell.fizzle",{u:t.id}),_e(i,t.side,`<b>${t.t.short}</b> tries ${n.name} — it fizzles (${v[0]+v[1]}).`);return}return lt(i,"spell.cast",{u:t.id}),n.mesmerize?By(i,t,e):(_e(i,t.side,`<b>${t.t.short}</b> casts <b>${n.name}</b> on ${e.t.short}!`),Fy(i,t,e,n))}if(n.blast)return ky(i,t,e,n,s);const r=Ps(t,n,!1);lt(i,"volley",{u:t.id,tg:e.id,fx:n.fx,n:r});const o=He(i,r),a=Xn(o,s.need);lt(i,"dice",{label:`Hit ${s.need}+`,dice:o,need:s.need});const c=Er(n.S,e.t.T,n.poison),l=He(i,a),h=Xn(l,c);a&&lt(i,"dice",{label:`Wound ${c}+`,dice:l,need:c});const u=Tr(e.t.Sv,n.AP,s.cover),d=He(i,h),f=u>6?h:h-Xn(d,u);h&&lt(i,"dice",{label:u>6?"No save":`Save ${u}+${s.cover?" (cover)":""}`,dice:u>6?[]:d,need:u,save:!0});const g=Go(i,e,f,n.D,t);_e(i,t.side,`<b>${t.t.short}</b> shoot ${e.t.short}: ${a} hit, ${h} wound, ${f} unsaved${g?` — <b>${g} slain</b>`:""}.`)}function ky(i,t,e,n,s){const{W:r,H:o}=Jn,a=Ps(t,n,!1);_e(i,t.side,`<b>${t.t.short}</b> fire ${n.name} at ${e.t.short} (${s.need}+${s.visible?"":", unseen"}).`);for(let c=0;c<a&&!(!oe(t)||!oe(e)&&c>0);c++){const l=ar(i.rng)*Math.PI*2,h=ar(i.rng)*e.r*.5,u={x:e.pos.x+Xe(l)*h,z:e.pos.z+Ne(l)*h};lt(i,"blast.aim",{x:u.x,z:u.z,r:n.blast});const d=He(i,1),f=d[0]>=s.need;lt(i,"dice",{label:a>1?`Template ${c+1}: hit ${s.need}+`:`Hit ${s.need}+`,dice:d,need:s.need});let g=u;if(!f){const v=He(i,1)[0]+1,m=ar(i.rng)*Math.PI*2;g={x:Math.max(-r/2+.3,Math.min(r/2-.3,u.x+Xe(m)*v)),z:Math.max(-o/2+.3,Math.min(o/2-.3,u.z+Ne(m)*v))},lt(i,"dice",{label:"Scatter D6+1",dice:[v-1],need:0,sum:!0,note:`${v}"`}),lt(i,"blast.scatter",{from:{x:u.x,z:u.z},to:{x:g.x,z:g.z},d:v})}lt(i,"blast.fire",{u:t.id,to:{x:g.x,z:g.z},fx:n.fx}),id(i,t,g,n)}}function Fy(i,t,e,n){const s={x:e.pos.x,z:e.pos.z};lt(i,"spell.thorns",{u:t.id,x:s.x,z:s.z,r:n.blast}),id(i,t,s,n),lt(i,"spell.fade",{u:t.id})}function id(i,t,e,n){lt(i,"blast.land",{x:e.x,z:e.z,r:n.blast,fx:n.fx});const s=[];for(const o of i.units){if(!oe(o))continue;const a=o.models.filter(c=>c.alive&&Vt(Bs(o,c)-e.x,Hs(o,c)-e.z)<=n.blast+o.t.base*.6);a.length&&s.push({v:o,under:a})}for(const{v:o,under:a}of s){let c=a.length;o.t.big&&(c=Math.ceil($c(i)/2)+1);const l=o.side===t.side,h=Er(n.S,o.t.T,n.poison),u=He(i,c),d=Xn(u,h);lt(i,"dice",{label:`${l?"⚠ ":""}${o.t.short}: ${c} hit${c>1?"s":""} · wound ${h}+`,dice:u,need:h});const f=qo(i,o),g=Tr(o.t.Sv,n.AP,f),v=He(i,d),m=g>6?d:d-Xn(v,g);d&&g<=6&&lt(i,"dice",{label:`Save ${g}+${f?" (cover)":""}`,dice:v,need:g,save:!0});const p=Go(i,o,m,n.D,t,a);_e(i,t.side,`${l?"<b>Friendly fire!</b> ":""}${n.name} hits ${o.t.short}: ${d} wound, ${m} unsaved${p?` — <b>${p} slain</b>`:""}.`)}s.length||lt(i,"pause",{s:.25});const r=i.terrain.blast(e.x,e.z,n.blast,n.scenery||1,{acid:!!n.corrodes},i.out);r.length&&_e(i,t.side,`…and ${r.length} piece${r.length>1?"s":""} of scenery ${r.length>1?"are":"is"} wrecked.`),Gi(i)}function By(i,t,e){lt(i,"spell.gaze",{u:t.id,tg:e.id});const n=Math.ceil($c(i)/2);lt(i,"dice",{label:"Mortal wounds D3",dice:[n],need:0,sum:!0,note:`${n}`});const s=Go(i,e,n,1,t);e.mesmerized=!0,i.out&&lt(i,"status",gi(i)),lt(i,"spell.mesmerized",{u:t.id,tg:e.id}),_e(i,t.side,`<b>${t.t.short}</b> mesmerizes ${e.t.short}: ${n} mortal wound${n>1?"s":""}${s?`, <b>${s} slain</b>`:""}. It can't shoot or charge next turn.`)}function qc(i){return i.t.move}function Po(i,t,e,n=[]){const{W:s,H:r}=Jn,o=i.nav,a=new Uint8Array(o.N);a.discs=[];for(const c of In(i,t)){const l=c.r+t.r+(n.includes(c)?.02:e);a.discs.push({x:c.pos.x,z:c.pos.z,R:l-.02});const h=Math.max(0,Math.floor((c.pos.x-l+s/2)/o.cell)),u=Math.min(o.nx-1,Math.floor((c.pos.x+l+s/2)/o.cell)),d=Math.max(0,Math.floor((c.pos.z-l+r/2)/o.cell)),f=Math.min(o.nz-1,Math.floor((c.pos.z+l+r/2)/o.cell));for(let g=d;g<=f;g++)for(let v=h;v<=u;v++){const m=g*o.nx+v;Vt(o.x(m)-c.pos.x,o.z(m)-c.pos.z)<l&&(a[m]=1)}}return a}function bs(i,t,e=0){Gi(i);const n=Qe(i,t),s=t.t.M+e,r=qc(t),o=In(i,t),a=Po(i,t,ui+.05,n?o:[]),c=Po(i,t,ui+.05),l=i.nav.reach(t.pos.x,t.pos.z,{r:t.r,max:s,mode:r==="fly"?"fly":r,forbid:r==="fly"?null:a});return{u:t,res:l,max:s,mode:r,forbid:a,endForbid:c,fallback:n}}function Ar(i,t,e){const{u:n,res:s,mode:r,endForbid:o}=t,a=i.nav;if(e<0||!isFinite(s.dist[e])||!a.standable(e,n.r,r==="wreck"?"wreck":"walk",o))return!1;const c=a.x(e),l=a.z(e);for(const h of i.units)if(h!==n&&oe(h)&&Vt(h.pos.x-c,h.pos.z-l)<h.r+n.r+.08)return!1;return!0}function Hy(i,t,e,n,s=2.4){const r=i.nav;let o=-1,a=s;const c=r.index(e,n);if(c<0)return-1;const l=Math.ceil(s/r.cell),h=c%r.nx,u=c/r.nx|0;for(let d=-l;d<=l;d++)for(let f=-l;f<=l;f++){const g=h+f,v=u+d;if(g<0||v<0||g>=r.nx||v>=r.nz)continue;const m=v*r.nx+g,p=Vt(r.x(m)-e,r.z(m)-n);p<a&&Ar(i,t,m)&&(a=p,o=m)}return o}function Vy(i,t,e,n=bs(i,t,t.flags.advanced?t.flags.advRoll:0)){const s=i.nav.path(n.res,e,t.r,n.mode==="fly"?null:n.forbid);t.flags.moved=!0,n.fallback&&(t.flags.fellBack=!0);const r=Gf(s);_e(i,t.side,`<b>${t.t.short}</b> ${n.fallback?"fall back":t.flags.advanced?"advance":"move"} ${r.toFixed(1)}".`),sd(i,t,s,{fly:n.mode==="fly",stomp:t.t.wrecker&&r>.1}),Gi(i)}function Wy(i,t){lt(i,"tray.open",{title:`${t.t.short} — Advance`});const e=He(i,1);return lt(i,"dice",{label:"Advance D6",dice:e,need:0,sum:!0,note:`+${e[0]}"`}),t.flags.advanced=!0,t.flags.advRoll=e[0],_e(i,t.side,`<b>${t.t.short}</b> advance: +${e[0]}".`),e[0]}function Gy(i,t){t.flags.moved=!0}function sd(i,t,e,{speed:n=7,fly:s=!1,stomp:r=!1}={}){const o=Gf(e);if(o<.05)return;const a=[];let c=0;for(let d=1;d<e.length;d++){const f=Vt(e[d].x-e[d-1].x,e[d].z-e[d-1].z);a.push({a:e[d-1],b:e[d],s:c,l:f}),c+=f}const l=[];if(t.t.wrecker){const d=[];for(const g of a)for(let v=0;v<g.l;v+=.25)d.push({s:g.s+v,x:g.a.x+(g.b.x-g.a.x)*v/g.l,z:g.a.z+(g.b.z-g.a.z)*v/g.l,dir:Is(g.b.x-g.a.x,g.b.z-g.a.z)});const f=a[a.length-1];d.push({s:o,x:e[e.length-1].x,z:e[e.length-1].z,dir:Is(f.b.x-f.a.x,f.b.z-f.a.z)});for(const g of d){const v=i.out?[]:null;$y(i,t,g,v)&&v&&l.push({s:g.s,ev:v})}}const h=a.find(d=>o<=d.s+d.l)||a[a.length-1],u=h.l>0?(o-h.s)/h.l:1;Wo(t,fn(h.a.x,h.b.x,u),fn(h.a.z,h.b.z,u)),i.out&&(lt(i,"unit.move",{u:t.id,path:e.map(d=>({x:d.x,z:d.z})),L:o,speed:n,fly:s,stomp:r,smashes:l,to:{x:t.pos.x,z:t.pos.z}}),lt(i,"objectives",{owners:$i(i)}),lt(i,"status",gi(i)))}function $y(i,t,{x:e,z:n,dir:s},r){let o=0;for(const a of i.terrain.chunks){if(!a.alive||!a.destructible)continue;const c=a.nav||a.shape;Vt(c.x-e,c.z-n)<t.r+Math.max(c.hx,c.hz)*.8&&(i.terrain.hurt(a,99,{x:e-Ne(s),z:n-Xe(s)},r),o++)}return o}function xr(i,t){return!(!oe(t)||t.flags.charged||t.flags.chargeTried||t.t.noCharge||t.mesmerized||t.flags.fellBack||Qe(i,t)||t.flags.advanced&&!t.t.chargeAfterAdvance)}function jo(i,t){return xr(i,t)?In(i,t).filter(e=>fi(t,e)<=Sr):[]}function Fs(i,t,e){Gi(i);const n=i.nav,s=In(i,t).filter(m=>m!==e),r=qc(t),o=Po(i,t,ui+.05,[e]),a=n.reach(t.pos.x,t.pos.z,{r:t.r,max:Sr+.5,mode:r,forbid:r==="fly"?null:o}),c=[];let l=-1,h=1/0;const u=e.r+t.r+ui-.08,d=Math.ceil((u+1)/n.cell),f=n.index(e.pos.x,e.pos.z),g=f%n.nx,v=f/n.nx|0;for(let m=-d;m<=d;m++)for(let p=-d;p<=d;p++){const x=g+p,_=v+m;if(x<0||_<0||x>=n.nx||_>=n.nz)continue;const y=_*n.nx+x,R=a.dist[y];if(!isFinite(R))continue;const S=Vt(n.x(y)-e.pos.x,n.z(y)-e.pos.z);S>u||S<e.r+t.r+.02||n.standable(y,t.r,r==="wreck"?"wreck":"walk",o)&&(s.some(E=>Vt(n.x(y)-E.pos.x,n.z(y)-E.pos.z)<E.r+t.r+ui)||i.units.some(E=>E!==t&&E!==e&&oe(E)&&E.side===t.side&&Vt(E.pos.x-n.x(y),E.pos.z-n.z(y))<E.r+t.r+.05)||(c.push({i:y,d:R}),R<h&&(l=y,h=R)))}return l<0?null:{cell:l,need:Math.max(2,Math.ceil(h-.01)),res:a,forbid:o,mode:r,dist:h,spots:c}}function rd(i,t){const e=new Uint8Array(i.res.dist.length);for(const n of i.spots)n.d<=t+.011&&(e[n.i]=1);return e[i.cell]=1,e}function jy(i,t,e,n){const s=Fs(i,t,e);if(t.flags.chargeTried=!0,lt(i,"tray.open",{title:`${t.t.short} charge ${e.t.short}`}),!s)return _e(i,t.side,`<b>${t.t.short}</b> can't find a way to ${e.t.short}.`),null;const r=He(i,2),o=r[0]+r[1],a=o>=s.need;return lt(i,"dice",{label:`Charge ${s.need}" (2D6)`,dice:r,need:0,sum:!0,pass:a}),lt(i,"unit.face",{u:t.id,tg:e.id}),a?(t.flags.charged=!0,t.flags.chargeTarget=e.id,lt(i,"charge.result",{u:t.id,tg:e.id,ok:a}),_e(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o} vs ${s.need}. <b>Contact!</b>`),n!=="ai"?{plan:s,rolled:o}:(od(i,t,e,s.cell,s),null)):(lt(i,"charge.result",{u:t.id,tg:e.id,ok:a}),_e(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o}, needed ${s.need}. Failed.`),null)}function od(i,t,e,n,s=Fs(i,t,e)){const r=i.nav.path(s.res,n,t.r,s.mode==="fly"?null:s.forbid);sd(i,t,r,{speed:11,fly:s.mode==="fly"}),Gi(i)}const oe=i=>i.alive>0,In=(i,t)=>i.units.filter(e=>e.side!==t.side&&oe(e)),Yc=(i,t)=>i.units.filter(e=>e.side===t.side&&oe(e)&&e!==t),Xo=(i,t)=>Vt(i.pos.x-t.pos.x,i.pos.z-t.pos.z),fi=(i,t)=>Xo(i,t)-i.r-t.r,Rr=(i,t)=>In(i,t).filter(e=>fi(t,e)<=ui+.05),Bs=(i,t)=>i.pos.x+t.ox,Hs=(i,t)=>i.pos.z+t.oz,Qe=(i,t)=>Rr(i,t).length>0,Kc=i=>i.t.eye,Jc=i=>i.t.chest;function qo(i,t){const e=t.models.filter(s=>s.alive);if(t.t.fly)return!1;let n=0;for(const s of e)i.nav.cover[i.nav.index(Bs(t,s),Hs(t,s))]&&n++;return n*2>=e.length&&n>0}function Zc(i,t,e,n=t.pos){const s={x:n.x,y:Kc(t),z:n.z};let r=0,o=0,a=0;for(const c of e.models){if(!c.alive)continue;a++;const l=i.terrain.los(s,{x:Bs(e,c),y:Jc(e),z:Hs(e,c)});l.blocked||(r++,l.obscure&&o++)}return{visible:r>0,cover:r>0&&(o>0||r<a||qo(i,e)),seen:r,total:a}}function ad(i,t){let e=t.t.Ld;for(const n of Yc(i,t))n.t.hero&&Xo(t,n)<=wr+t.r&&(e=Math.max(e,n.t.Ld));return e}function Yo(i,t){const e=[0,0];for(const n of i.units)if(oe(n))for(const s of n.models)s.alive&&Vt(Bs(n,s)-t.x,Hs(n,s)-t.z)<=Bo+n.t.base&&(e[n.side]+=n.t.OC);return e[0]>e[1]?0:e[1]>e[0]?1:-1}const $i=i=>i.objectives.map(t=>Yo(i,t)),gi=i=>({engaged:i.units.filter(t=>oe(t)&&Qe(i,t)).map(t=>t.id),mesmerized:i.units.filter(t=>t.mesmerized).map(t=>t.id)}),Yn=i=>Cs[Math.min(i.turn.ph,Cs.length-1)].key;function cd(i,t){if(!oe(t)||t.side!==i.turn.active)return!1;switch(Yn(i)){case"move":return!t.flags.moved;case"shoot":return Us(i,t)&&Xc(i,t).length>0;case"charge":return xr(i,t)&&jo(i,t).length>0}return!1}const ld=(i,t)=>i.units.some(e=>e.side===t&&cd(i,e)),hd=Object.freeze(Object.defineProperty({__proto__:null,alive:oe,anyCanAct:ld,canAct:cd,canCharge:xr,canShoot:Us,chargePlan:Fs,chargeSpots:rd,chargeTargets:jo,chestY:Jc,controlOf:Yo,dist:Xo,enemiesOf:In,engagedWith:Rr,eyeY:Kc,forbidMask:Po,freeSpot:Jf,friendsOf:Yc,gap:fi,inCover:qo,isEngaged:Qe,leadership:ad,moveMode:qc,movePlan:bs,mx:Bs,mz:Hs,nearestValid:Hy,ownersOf:$i,phaseKey:Yn,rngState:Fo,shootTargets:Xc,shotInfo:$o,sight:Zc,statusOf:gi,validEnd:Ar},Symbol.toStringTag,{value:"Module"}));function lu(i,t){if(!oe(t)||t.flags.fought)return;const e=Rr(i,t);if(!e.length)return;t.flags.fought=!0;const n=e.find(p=>p.id===t.flags.chargeTarget)||e.reduce((p,x)=>p.alive*p.t.W<x.alive*x.t.W?p:x),s=t.t.melee,r=t.mesmerized?1:0,o=pr(t.t.WS,r);lt(i,"unit.face",{u:t.id,tg:n.id}),lt(i,"focus",{x:t.pos.x*.5+n.pos.x*.5,z:t.pos.z*.5+n.pos.z*.5}),lt(i,"tray.open",{title:`${t.t.short} fight ${n.t.short} · ${s.name}`});const a=Ps(t,s,!0),c=He(i,a),l=Xn(c,o);lt(i,"melee",{u:t.id,tg:n.id,n:a,hits:l}),lt(i,"dice",{label:`Hit ${o}+${r?" (mesmerized)":""}`,dice:c,need:o});const h=Er(s.S,n.t.T,s.poison),u=He(i,l),d=Xn(u,h);l&&lt(i,"dice",{label:`Wound ${h}+`,dice:u,need:h});const f=Tr(n.t.Sv,s.AP,!1),g=He(i,d),v=f>6?d:d-Xn(g,f);d&&lt(i,"dice",{label:f>6?"No save":`Save ${f}+`,dice:f>6?[]:g,need:f,save:!0});const m=Go(i,n,v,s.D,t);_e(i,t.side,`<b>${t.t.short}</b> fight ${n.t.short}: ${l} hit, ${d} wound, ${v} unsaved${m?` — <b>${m} slain</b>`:""}.`),lt(i,"pause",{s:.3})}function Xy(i,t){const e=i.units.filter(s=>s.side===t&&s.flags.charged&&oe(s));for(const s of e)lu(i,s);let n=1-t;for(let s=0;s<30;s++){const r=i.units.find(a=>a.side===n&&oe(a)&&!a.flags.fought&&Qe(i,a)),o=i.units.find(a=>a.side===1-n&&oe(a)&&!a.flags.fought&&Qe(i,a));if(!r&&!o)break;r&&lu(i,r),n=1-n}for(const s of i.units)s.flags.fought=!1;i.out&&lt(i,"status",gi(i))}function qy(i){let t=!1;for(const e of i.units){if(!oe(e)||!e.lost||e.t.models===1)continue;t||lt(i,"tray.open",{title:"Morale"}),t=!0;const n=ad(i,e),s=He(i,1),r=s[0]+e.lost,o=s[0]===1?0:Math.max(0,r-n);if(lt(i,"dice",{label:`${e.t.short}: D6 + ${e.lost} lost vs Ld ${n}`,dice:s,need:0,sum:!0,pass:o===0,note:`${r}`}),o){const a=Math.min(o,e.alive),c=e.models.filter(l=>l.alive).slice(-a);for(const l of c)Yy(i,e,l);_e(i,e.side,`<b>${e.t.short}</b> lose their nerve — <b>${a} flee</b>.`),oe(e)?ed(i,e):nd(i,e,null),i.out&&(lt(i,"objectives",{owners:$i(i)}),lt(i,"status",gi(i))),lt(i,"pause",{s:.5})}else _e(i,e.side,`<b>${e.t.short}</b> hold firm (${r} vs Ld ${n}).`)}}function Yy(i,t,e){e.alive=!1,e.w=0,t.alive--,lt(i,"unit.flee",{u:t.id,m:t.models.indexOf(e)})}const ud=i=>i.t.pts*i.alive/i.t.models;function Oi(i,t){return i.t.melee?Co(i.alive*i.t.A,pr(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function fd(i,t,e,n,s){var l;const r=t.t.ranged;if(!r||Vt(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||Qe(i,e)&&!r.spell)return 0;const a=Zc(i,t,e,n);if(!a.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return a.visible?Bi(r.spell)*(ud(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((l=e.t.ranged)!=null&&l.blast?8:0)):0;let c=0;if(r.heavy&&s&&c++,r.indirect&&!a.visible&&c++,r.blast){const h=r.spell?Bi(r.spell):mo(pr(t.t.BS,c)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Ps(t,r,!1)*h*Co(u,1,r,e,a.cover).value}return Co(Ps(t,r,!1),pr(t.t.BS,c),r,e,a.cover).value}function hu(i,t,e,n){const{nav:s}=i,r=In(i,t),o=Yc(i,t),a=i.objectives.map(f=>Yo(i,f)),c=t.t.ai,l={enemies:r,friends:o,owners:a,claimed:n,role:c};let h={cell:-1,score:uu(i,t,t.pos.x,t.pos.z,l,!1),dist:0,...l.last};const u=t.t.M>8?3:2,d=e.res;for(let f=0;f<s.nz;f+=u)for(let g=f/u%2?1:0;g<s.nx;g+=u){const v=f*s.nx+g;if(!isFinite(d.dist[v])||!Ar(i,e,v))continue;const m=s.x(v),p=s.z(v),x=uu(i,t,m,p,l,!0)+ar(i.rng)*.05;x>h.score&&(h={cell:v,score:x,dist:Vt(m-t.pos.x,p-t.pos.z),...l.last})}return h}function uu(i,t,e,n,s,r){const{enemies:o,friends:a,owners:c,claimed:l,role:h}=s,u=t.t,d={x:e,z:n},f=r&&Vt(e-t.pos.x,n-t.pos.z)>.3;let g=0,v=!1,m=-1;if(u.OC>0){const y=h==="line"||h==="shooter"?5:h==="melee"?2:2.5;let R=0;for(const S of i.objectives){const E=Vt(S.x-e,S.z-n),O=c[S.i]===t.side?.45:1,M=l.has(S.i)?.25:1;let w;E<=2.6?w=y*O*M*1.4:w=y*O*M*Math.max(0,1-(E-2.6)/16)*.7,w>R&&(R=w,E<=2.6?(v=!0,m=S.i):v||(m=-1))}g+=R}let p=!1;if(u.ranged&&h!=="melee"){let y=0;for(const S of o){const E=fd(i,t,S,d,f);E>y&&(y=E)}y>0&&(p=!0),g+=y*(h==="artillery"?.25:h==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(h==="melee"||h==="line"||h==="raider"||h==="hero"){let y=0;for(const S of o){const E=Vt(S.pos.x-e,S.pos.z-n)-t.r-S.r;if(E>Sr)continue;const O=E<=1?1:Bi(Math.ceil(E)),M=Oi(S,t)*.4,w=O*(Oi(t,S)-M+(S.t.role==="Artillery"?10:0));w>y&&(y=w)}if(g+=y*(h==="melee"?.3:h==="raider"?.18:h==="hero"?.06:.15),y===0&&h!=="hero"){const S=Math.min(...o.map(E=>Vt(E.pos.x-e,E.pos.z-n)));g-=S*(h==="melee"?.12:.05)}}const x=h==="shooter"||h==="artillery"||h==="hero";for(const y of o){const R=Vt(y.pos.x-e,y.pos.z-n)-t.r-y.r;y.t.brawler&&R<y.t.M+7&&(g-=Oi(y,t)*(x?.16:.05)*(1-R/(y.t.M+7)))}const _=i.nav.index(e,n);if(_>=0&&i.nav.cover[_]&&(g+=x?1.5:.5),h==="artillery"&&f&&(g-=2.5),h==="hero"){let y=0;for(const S of a)Vt(S.pos.x-e,S.pos.z-n)<=wr+S.r&&y++;g+=Math.min(3,y)*.9;const R=Math.min(...o.map(S=>Vt(S.pos.x-e,S.pos.z-n)));R<8&&(g-=(8-R)*.6)}for(const y of a){const R=Vt(y.pos.x-e,y.pos.z-n)-y.r-t.r;R<1.5&&(g-=(1.5-R)*.6)}return s.last={onObjective:v,obj:m,canShoot:p},g}const Os=Object.freeze(["melee","raider","line","shooter","hero","artillery"]);function*Ky(i,t,e){e==="move"?yield*Jy(i,t):e==="shoot"?yield*Zy(i,t):e==="charge"&&(yield*Qy(i,t))}function*Jy(i,t){const e=i.units.filter(s=>s.side===t&&oe(s));e.sort((s,r)=>Os.indexOf(s.t.ai)-Os.indexOf(r.t.ai));const n=new Set;for(const s of e){if(!oe(s)||s.flags.moved)continue;const r=s.t.ai;if(Qe(i,s)){const h=Rr(i,s),u=h.reduce((m,p)=>m+Oi(p,s),0),d=h.reduce((m,p)=>Math.max(m,Oi(s,p)),0);if(r==="melee"||r==="line"||d>=u*.8)continue;const f=bs(i,s);let g=-1,v=-1/0;for(let m=0;m<i.nav.N;m+=2){if(!Ar(i,f,m))continue;const p=i.nav.x(m),x=i.nav.z(m),_=Math.min(...In(i,s).map(y=>Vt(y.pos.x-p,y.pos.z-x)-y.r));_>v&&(v=_,g=m)}g>=0&&(lt(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:g});continue}let o=bs(i,s,s.flags.advanced?s.flags.advRoll:0),a=hu(i,s,o,n);const c=Math.min(...In(i,s).map(h=>fi(s,h)));let l=!1;if(r==="melee"||r==="line"||r==="raider"?l=c>s.t.M+8&&!(r==="line"&&a.onObjective)&&!(r==="raider"&&a.canShoot):r==="shooter"&&(l=!a.canShoot&&!a.onObjective&&(s.t.ranged.assault||c>s.t.ranged.range+s.t.M+3)),l&&!s.flags.advanced){lt(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"advance",u:s.id},o=bs(i,s,s.flags.advRoll);const h=hu(i,s,o,n);h.cell>=0&&(a=h)}a.obj>=0&&n.add(a.obj),a.cell>=0&&a.dist>.4?(lt(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:a.cell}):s.flags.advanced&&Gy(i,s),lt(i,"pause",{s:.05})}}function*Zy(i,t){const e=i.units.filter(n=>n.side===t&&Us(i,n));e.sort((n,s)=>Os.indexOf(s.t.ai)-Os.indexOf(n.t.ai));for(const n of e){if(!Us(i,n))continue;const s=Xc(i,n);let r=null,o=.4;for(const a of s){let c=fd(i,n,a,n.pos,n.flags.moved);const l=n.t.ranged;if(l.blast)for(const h of i.units){if(h.side!==n.side||!oe(h))continue;const u=Vt(h.pos.x-a.pos.x,h.pos.z-a.pos.z)-h.r;u<l.blast+2.5&&(c-=ud(h)*.25*(1-Math.max(0,u)/(l.blast+2.5)))}l.mesmerize&&a.mesmerized&&(c*=.2),c>o&&(o=c,r=a)}r&&(lt(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"shoot",u:n.id,tg:r.id},lt(i,"pause",{s:.1}))}}function*Qy(i,t){const e=i.units.filter(n=>n.side===t&&xr(i,n));e.sort((n,s)=>Os.indexOf(n.t.ai)-Os.indexOf(s.t.ai));for(const n of e){if(!xr(i,n))continue;const s=n.t.ai;let r=null,o=0;for(const a of jo(i,n)){const c=Fs(i,n,a);if(!c)continue;const l=Bi(c.need),h=Oi(n,a)+(a.t.role==="Artillery"?12:0)+(a.alive<=2?6:0),u=Oi(a,n);if(l<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&h<u*1.4)continue;const f=l*(h-u*.4);f>o&&(o=f,r=a)}r&&(lt(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"charge",u:n.id,tg:r.id},lt(i,"pause",{s:.1}))}}const be=(i,t)=>i.units.find(e=>e.id===t),vc=Object.freeze({place(i,t,{u:e,c:n}){const s=be(i,e);Wo(s,i.nav.x(n),i.nav.z(n)),lt(i,"unit.place",{u:e,x:s.pos.x,z:s.pos.z})},deployed(i,t){const e=i.pending.seats.filter(n=>n!==t);i.pending=e.length?{...i.pending,seats:e}:null},advance(i,t,{u:e}){Wy(i,be(i,e))},move(i,t,{u:e,c:n}){Vy(i,be(i,e),n),so(i)},shoot(i,t,{u:e,tg:n}){zy(i,be(i,e),be(i,n)),so(i)},charge(i,t,{u:e,tg:n},s){const r=jy(i,be(i,e),be(i,n),s);if(!r)return so(i);i.pending={k:"chargeEnd",seats:[t],u:e,tg:n,rolled:r.rolled,cell:r.plan.cell}},chargeEnd(i,t,{c:e}){const n=i.pending;od(i,be(i,n.u),be(i,n.tg),e===-1?n.cell:e),i.pending={k:"phase",seats:n.seats,phase:Yn(i)},so(i)},end(i){i.pending=null},auto(i,t){vd(i,t,i.pending.phase),i.pending=null},vote(i,t,{more:e}){const n=i.pending,s={...n.votes,[t]:e},r=n.seats.filter(a=>a!==t);if(lt(i,"vote",{seat:t,more:e}),r.length){i.pending={...n,seats:r,votes:s};return}for(const a of Object.keys(s).map(Number).sort((c,l)=>c-l))_e(i,a,`<b>${qn(i,a).name}</b> ${s[a]?"want to keep playing":"want to end the battle"}.`);i.pending=null;const o=i.turn;if(!Object.values(s).every(Boolean))return Lo(i);o.round++,o.overtime++,o.t=0,o.step="turnStart",_e(i,-1,`Overtime: round ${o.round}.`,"big")},concede(i,t){Lo(i,t)}}),xc=dn({place:{k:"deploy",fields:["u","c"],ok:(i,t,{u:e,c:n})=>Zs(i,t,e)??(Ly(i,be(i,e),n)?null:`cell ${n} is no free spot in seat ${t}'s zone for unit ${e}`)},deployed:{k:"deploy",fields:[]},advance:{k:"phase",phase:"move",fields:["u"],ok:(i,t,{u:e})=>Zs(i,t,e)??iM(i,be(i,e))},move:{k:"phase",phase:"move",fields:["u","c"],ok:(i,t,{u:e,c:n})=>Zs(i,t,e)??sM(i,be(i,e),n)},shoot:{k:"phase",phase:"shoot",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>Zs(i,t,e)??fu(i,t,n)??rM(i,be(i,e),be(i,n))},charge:{k:"phase",phase:"charge",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>Zs(i,t,e)??fu(i,t,n)??oM(i,be(i,e),be(i,n))},chargeEnd:{k:"chargeEnd",fields:["c"],ok:(i,t,{c:e},n)=>aM(i,n,e)},end:{k:"phase",fields:[]},auto:{k:"phase",fields:[]},vote:{k:"roundLimit",fields:[],bools:["more"]},concede:{k:null,fields:[],ok:(i,t)=>nM(i,t)}}),tM=Object.freeze(Object.keys(xc));function _c(i,t,e){return dd(i,t,e,i.pending)}function dd(i,t,e,n){const s=i.rng.locked;Of(i.rng);try{return eM(i,t,e,n)}finally{s||Nf(i.rng)}}function eM(i,t,e,n){var a;if(!e||typeof e!="object"||Array.isArray(e))return"not a command";const s=typeof e.t=="string"&&Object.hasOwn(xc,e.t)?xc[e.t]:null;if(!s)return`no command "${e.t}"`;if(!Number.isInteger(t)||t<0||t>=i.seats.length)return`no seat ${t}`;const r=s.opt??[],o=s.bools??[];for(const c of Object.keys(e))if(c!=="t"&&!s.fields.includes(c)&&!r.includes(c)&&!o.includes(c))return`${e.t} takes no field "${c}"`;for(const c of s.fields)if(!Number.isInteger(e[c]))return`${e.t} takes a whole number ${c}`;for(const c of r)if(e[c]!==void 0&&!Number.isInteger(e[c]))return`${e.t} takes a whole number ${c}, or none`;for(const c of o)if(typeof e[c]!="boolean")return`${e.t} takes ${c} true or false`;return i.turn.stage==="over"?"the battle is over":s.k?!n||!n.seats.includes(t)?`seat ${t} has no decision to make now`:n.k!==s.k?`${e.t} doesn't answer the ${n.k} decision`:s.phase&&n.phase!==s.phase?`${e.t} belongs to the ${s.phase} phase, not the ${n.phase}`:((a=s.ok)==null?void 0:a.call(s,i,t,e,n))??null:s.ok(i,t,e)}function Zs(i,t,e){const n=be(i,e);return n&&oe(n)&&n.side===t?null:`unit ${e} is no standing unit of seat ${t}`}function fu(i,t,e){const n=be(i,e);return n&&oe(n)&&n.side!==t?null:`unit ${e} is no standing enemy of seat ${t}`}const pd=(i,t)=>t>=0&&t<i.nav.N;function nM(i,t){return td(i,t)!=="human"?`seat ${t} is the AI's: only a human seat concedes`:i.turn.wiped>=0?`the battle is decided: seat ${i.turn.wiped} is wiped out`:null}function iM(i,t){return t.flags.moved?`${t.t.short} has moved`:t.flags.advanced?`${t.t.short} has advanced`:Qe(i,t)?`${t.t.short} is in combat`:null}function sM(i,t,e){return t.flags.moved?`${t.t.short} has moved`:!pd(i,e)||!Ar(i,bs(i,t,t.flags.advanced?t.flags.advRoll:0),e)?`${t.t.short} can't end its move on cell ${e}`:null}function rM(i,t,e){if(!Us(i,t))return`${t.t.short} can't shoot now`;const n=$o(i,t,e);return n.ok?null:`${t.t.short} can't shoot ${e.t.short}: ${n.why}`}function oM(i,t,e){return jo(i,t).includes(e)?Fs(i,t,e)?null:`${t.t.short} has no way to ${e.t.short}`:`${t.t.short} can't charge ${e.t.short}`}function aM(i,t,e){if(e===-1)return null;const n=pd(i,e)&&Fs(i,be(i,t.u),be(i,t.tg));return n&&rd(n,t.rolled)[e]?null:`the charge can't end on cell ${e} (rolled ${t.rolled}")`}const yc=i=>i.seats.filter(t=>t.ctrl==="human").map(t=>t.seat);function md(i){const t=i.turn;for(;!i.pending&&t.stage!=="over";)switch(t.step){case"rolloff":t.stage="battle",lt(i,"stage",{stage:"battle"}),i.out&&lt(i,"objectives",{owners:$i(i)}),cM(i),t.round=1,t.t=0,t.step="turnStart";break;case"turnStart":t.active=(t.first+t.t)%2,lM(i,t.active),t.ph=0,t.step="phase";break;case"phase":{const e=Yn(i);lt(i,"phase.start",{side:t.active,phase:e,round:t.round}),t.step="phaseEnd",e==="fight"?i.units.some(n=>oe(n)&&Qe(i,n))&&Xy(i,t.active):e==="morale"?qy(i):ld(i,t.active)?td(i,t.active)==="human"?i.pending={k:"phase",seats:[t.active],phase:e}:vd(i,t.active,e):lt(i,"pause",{s:.2});break}case"phaseEnd":if(Vo(i,`phase ${t.active}:${Yn(i)}`),gd(i),t.wiped>=0){Lo(i);break}t.step=++t.ph<Cs.length?"phase":"turnEnd";break;case"turnEnd":hM(i,t.active),t.step=++t.t<2?"turnStart":"score";break;case"score":uM(i),t.round<i.setup.rounds?(t.round++,t.t=0,t.step="turnStart"):i.setup.overtime==="vote"&&yc(i).length?(_e(i,-1,`Round ${t.round} is over: play another round?`),i.pending={k:"roundLimit",seats:yc(i),votes:{}}):Lo(i);break;default:throw new Error(`the engine has no step "${t.step}"`)}i.pending&&i.out&&lt(i,"pending",{k:i.pending.k,seats:[...i.pending.seats]})}function cM(i){const t=i.turn;lt(i,"tray.open",{title:"Roll-off for the first turn"});let e,n;do e=He(i,1),n=He(i,1),lt(i,"dice",{label:qn(i,0).short,dice:e,need:0,sum:!0}),lt(i,"dice",{label:qn(i,1).short,dice:n,need:0,sum:!0});while(e[0]===n[0]);t.first=e[0]>n[0]?0:1,_e(i,t.first,`<b>${qn(i,t.first).name}</b> win the roll-off and take the first turn.`,"big")}function lM(i,t){for(const e of i.units)e.lost=0,e.side===t&&(e.flags={})}function hM(i,t){for(const e of i.units)e.side===t&&e.mesmerized&&(e.mesmerized=!1);i.out&&lt(i,"status",gi(i))}function so(i){Vo(i,"act"),i.out&&(lt(i,"objectives",{owners:$i(i)}),lt(i,"status",gi(i))),lt(i,"act",{tag:"act"}),gd(i)}function gd(i){for(const t of[0,1])i.units.some(e=>e.side===t&&oe(e))||(i.turn.wiped=t)}function uM(i){const t=i.turn,e=$i(i),n=[0,0];for(const o of e)o>=0&&n[o]++;t.vp[0]+=n[0],t.vp[1]+=n[1],Vo(i,`round ${t.round}`);const s=qn(i,0).short,r=qn(i,1).short;_e(i,-1,`End of round ${t.round}: ${s} hold ${n[0]} objective${n[0]===1?"":"s"}, ${r} hold ${n[1]}. Score ${t.vp[0]}–${t.vp[1]}.`,"big"),lt(i,"round.scored",{round:t.round,held:[...n],vp:[...t.vp],owners:e})}function Lo(i,t=-1){const e=i.turn,n=e.stage==="deploy"?0:e.round;jf(i),Vo(i,"over"),e.stage="over",i.pending=null,lt(i,"stage",{stage:"over"});const s=t>=0?1-t:e.wiped>=0?1-e.wiped:e.vp[0]>e.vp[1]?0:e.vp[1]>e.vp[0]?1:-1,r=t>=0?"concede":e.wiped>=0?"wipe":"score";e.result={win:s,why:r},lt(i,"game.over",{win:s,why:r,vp:[...e.vp],rounds:n})}function vd(i,t,e){const n=i.pending,s={k:"phase",seats:[t],phase:e};for(const r of Ky(i,t,e)){if(i.strict){const o=dd(i,t,r,s);if(o)throw new Error(`the AI (seat ${t}, ${e} phase) asked for ${JSON.stringify(r)}, which is illegal: ${o}`)}if(vc[r.t](i,t,r,"ai"),i.pending!==n)throw new Error(`the AI's ${JSON.stringify(r)} left a decision open: ${JSON.stringify(i.pending)}`)}}const fM=new Set(["name","short","icon","look","abilities","fx"]),Do=i=>Array.isArray(i)?i.map(Do):i&&typeof i=="object"?Object.fromEntries(Object.entries(i).filter(([t])=>!fM.has(t)).map(([t,e])=>[t,Do(e)])):i,du=(i,t)=>Object.fromEntries(Object.entries(i).map(([e,n])=>[e,t(n)])),dM=Object.freeze({BOARD:Jn,ENGAGE:ui,CHARGE_RANGE:Sr,OBJECTIVE_RANGE:Bo,ROUNDS:zf,AURA:wr});function pM({races:i=Tn,constants:t=dM,phases:e=Cs.map(r=>r.key),sets:n=Ms,missions:s=Ds}={}){return{races:du(i,({units:r,...o})=>({...Do(o),units:du(r,Do)})),constants:t,phases:e,sets:n,missions:s}}const mM=i=>Ho(Ls(pM(i))).toString(36),xo=mM(),_o=2,Vn=i=>Object.is(i,-0)?"-0":String(i),gM=i=>typeof i=="number"?Vn(i):String(i),vM=i=>Object.keys(i).filter(t=>i[t]!==void 0).sort().map(t=>`${t}=${String(i[t])}`).join(","),xd=Object.freeze({}),xM=(i,t=xd)=>Object.keys(t).sort().filter(e=>i[e]!==void 0&&!Object.is(i[e],t[e])).map(e=>`${e}=${gM(i[e])}`).join(",");function _d(i,t=xd){const e=i.turn,n=[e.stage,e.step,e.round,e.t,e.first,e.active,e.ph,e.vp.join("-"),e.wiped,e.overtime].map(String).join(","),s=i.units.map(o=>{const a=xM(o,t);return[o.id,Vn(o.pos.x),Vn(o.pos.z),Vn(o.r),o.alive,o.lost,o.mesmerized,`{${vM(o.flags)}}`,o.models.map(c=>`${Vn(c.w)}/${c.alive}/${Vn(c.ox)}/${Vn(c.oz)}`).join(" "),...a?[`[${a}]`]:[]].join(",")}).join(";"),r=i.terrain.chunks.map(o=>`${o.id},${o.alive},${Vn(o.hp)},${Vn(o.shape.y)}`).join(";");return`turn ${n}
pending ${Ls(i.pending)}
units ${s}
chunks ${r}
rng ${Fo(i.rng)} ${i.rng.a}`}const vs=i=>Ho(_d(i)).toString(36),_M=i=>{var t;return[...((t=i.pending)==null?void 0:t.seats)??[]]},pu=99;function yd(i){const t={};for(const[s,r]of Object.entries(i??{}))r!=null&&(t[s]=r);const e={terrain:"classic",rounds:gr().rounds,overtime:"never",diceMode:"shared"};for(const[s,r]of Object.entries(e))t[s]??(t[s]=r);const n=s=>Number.isInteger(s)&&s>=0&&s<=4294967295;if(!n(t.board)||!n(t.dice))throw new Error(`a setup's board and dice are whole numbers from 0 to 2^32 - 1, not ${t.board} and ${t.dice}`);if(!Number.isInteger(t.rounds)||t.rounds<1||t.rounds>pu)throw new Error(`a battle lasts a whole number of rounds, from 1 to ${pu}, not ${t.rounds}`);if(t.overtime!=="never"&&t.overtime!=="vote")throw new Error(`overtime "${t.overtime}": a battle ends after its rounds ('never') or its human seats vote on more ('vote')`);if(t.diceMode!=="shared")throw new Error(`dice mode "${t.diceMode}": only 'shared' dice so far`);if(!Array.isArray(t.seats))throw new Error("a setup names its seats");return t}function Md(i,{out:t=null,onTrace:e=null,strict:n=!1}={}){const s=Oy(yd(i),{out:t,onTrace:e});s.strict=n;const r=yc(s);if(r.length){lt(s,"stage",{stage:"deploy"});for(const o of r)_e(s,o,`<b>${qn(s,o).name}</b>: deploy your army.`);s.pending={k:"deploy",seats:r}}return md(s),s}function _r(i,t){const e=i.rng.locked;Of(i.rng);try{return t(i,hd)}finally{e||Nf(i.rng)}}function mu(i,t,e){if(!Object.hasOwn(vc,e.t))throw new Error(`no command "${e.t}"`);vc[e.t](i,t,e,"seat"),md(i)}const yM=i=>i.objectives.map(t=>i.turn.stage==="battle"||i.turn.stage==="over"?Yo(i,t):-1);function di(i){const t=i.turn,e={};for(const s of i.units)e[s.id]={pos:{x:s.pos.x,z:s.pos.z},r:s.r,models:s.models.map(r=>({w:r.w,alive:r.alive,ox:r.ox,oz:r.oz})),alive:s.alive,mesmerized:s.mesmerized,engaged:oe(s)&&Qe(i,s)};const n={};for(const s of i.terrain.chunks)n[s.id]={alive:s.alive,y:s.shape.y};return{units:e,chunks:n,owners:yM(i),vp:[...t.vp],round:t.round,active:t.active,phase:Yn(i),stage:t.stage}}function bd(i,t){const e=t.u===void 0?null:i.units[t.u];switch(t.t){case"unit.place":e.pos={x:t.x,z:t.z};break;case"unit.move":e.pos={x:t.to.x,z:t.to.z};for(const{ev:n}of t.smashes)for(const s of n)bd(i,s);break;case"unit.formation":e.pos={x:t.pos.x,z:t.pos.z},e.r=t.r,t.offs.forEach(([n,s],r)=>{e.models[r].ox=n,e.models[r].oz=s});break;case"unit.wound":e.models[t.m].w-=t.dmg;break;case"unit.slain":case"unit.flee":e.models[t.m].w=0,e.models[t.m].alive=!1,e.alive--;break;case"status":{const n=new Set(t.engaged),s=new Set(t.mesmerized);for(const[r,o]of Object.entries(i.units))o.engaged=n.has(Number(r)),o.mesmerized=s.has(Number(r));break}case"objectives":i.owners=[...t.owners];break;case"round.scored":i.vp=[...t.vp],i.owners=[...t.owners];break;case"phase.start":i.round=t.round,i.active=t.side,i.phase=t.phase;break;case"stage":i.stage=t.stage;break;case"terrain.clear":i.chunks={};break;case"terrain.add":i.chunks[t.def.id]={alive:!0,y:t.def.shape.y};break;case"terrain.destroy":i.chunks[t.id].alive=!1;break;case"terrain.collapse":for(const{id:n,dy:s}of t.drops)i.chunks[n].y-=s;break}return i}const mi=Object.freeze({phaseStart:(i,t)=>i||t!=="battle"?.9:.6,dice:i=>.38+Math.min(i,14)*.035,pause:i=>i,beat:.3,cost:i=>{var t;return i.t==="unit.move"?(i.L??0)/(i.speed||6)+.3:i.t==="pause"?i.s??0:i.t==="dice"?mi.dice(((t=i.dice)==null?void 0:t.length)??1):i.t==="phase.start"||i.t==="round.scored"?.9:/^(volley|blast\.|spell\.)/.test(i.t)?.5:0}}),MM=(i,t=Math.random)=>je(i,t),Ss=i=>1-Math.pow(1-i,3),bM=i=>i*i*i,Mc=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,SM=i=>Math.atan2(Math.sin(i),Math.cos(i));function wM(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const we={speed:1,time:0,boost:1,rate:1},bc=new Set;function Te(i,t,e=n=>n){return new Promise(n=>{bc.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const Rn=i=>Te(i,()=>{});function EM(i){for(const t of[...bc]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(bc.delete(t),t.resolve())}}class TM{constructor({lowfi:t=!1,fast:e=!1}={}){this.fast=e;const n=this.renderer=new Rf({antialias:!0});n.setPixelRatio(t?.5:Math.min(devicePixelRatio,2)),n.setSize(innerWidth,innerHeight),n.shadowMap.enabled=!t,n.shadowMap.type=Ju,n.toneMapping=Zu,n.toneMappingExposure=1.05,document.body.prepend(n.domElement);const s=this.scene=new Cf;s.background=new qt("#1c1712"),s.fog=new zc("#1c1712",70,140),addEventListener("resize",()=>n.setSize(innerWidth,innerHeight)),this.overlay=document.querySelector("#labels")}light(){const t=this.scene;t.add(new g_("#d6e6ff","#3b2a1a",.85));const e=new Bh("#fff0d6",2.3);e.position.set(-16,34,20),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),Object.assign(e.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90}),e.shadow.bias=-4e-4,e.shadow.normalBias=.02,t.add(e);const n=new Bh("#9fb8ff",.35);n.position.set(18,12,-16),t.add(n)}run({parts:t,rig:e,shake:n}){const s=new y_,r=()=>{requestAnimationFrame(r),this.fast&&(we.speed=1e4);const o=s.getDelta(),a=Math.min(o,.05);o>0&&(we.rate+=(a/o-we.rate)*.05);const c=a*we.speed*we.boost;we.time+=c,EM(c),t(c,we.time),e.update(a),e.render(this.renderer,this.scene,n(),!this.fast)};r()}}const gu={type:"change"},Wa={type:"start"},vu={type:"end"},ro=new Oo,xu=new si,AM=Math.cos(70*$p.DEG2RAD);class RM extends Hi{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Wn.ROTATE,MIDDLE:Wn.DOLLY,RIGHT:Wn.PAN},this.touches={ONE:ji.ROTATE,TWO:ji.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",ht),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ht),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(gu),n.update(),r=s.NONE},this.update=function(){const P=new C,at=new Cn().setFromUnitVectors(t.up,new C(0,1,0)),Rt=at.clone().invert(),wt=new C,st=new Cn,L=new C,ct=2*Math.PI;return function(Nt=null){const Pt=n.object.position;P.copy(Pt).sub(n.target),P.applyQuaternion(at),a.setFromVector3(P),n.autoRotate&&r===s.NONE&&j(w(Nt)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let Qt=n.minAzimuthAngle,te=n.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=ct:Qt>Math.PI&&(Qt-=ct),te<-Math.PI?te+=ct:te>Math.PI&&(te-=ct),Qt<=te?a.theta=Math.max(Qt,Math.min(te,a.theta)):a.theta=a.theta>(Qt+te)/2?Math.max(Qt,a.theta):Math.min(te,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&S||n.object.isOrthographicCamera?a.radius=Q(a.radius):a.radius=Q(a.radius*l),P.setFromSpherical(a),P.applyQuaternion(Rt),Pt.copy(n.target).add(P),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let pe=!1;if(n.zoomToCursor&&S){let ve=null;if(n.object.isPerspectiveCamera){const ne=P.length();ve=Q(ne*l);const ye=ne-ve;n.object.position.addScaledVector(y,ye),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ne=new C(R.x,R.y,0);ne.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),pe=!0;const ye=new C(R.x,R.y,0);ye.unproject(n.object),n.object.position.sub(ye).add(ne),n.object.updateMatrixWorld(),ve=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ve!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ve).add(n.object.position):(ro.origin.copy(n.object.position),ro.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(ro.direction))<AM?t.lookAt(n.target):(xu.setFromNormalAndCoplanarPoint(n.object.up,n.target),ro.intersectPlane(xu,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),pe=!0);return l=1,S=!1,pe||wt.distanceToSquared(n.object.position)>o||8*(1-st.dot(n.object.quaternion))>o||L.distanceToSquared(n.target)>0?(n.dispatchEvent(gu),wt.copy(n.object.position),st.copy(n.object.quaternion),L.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Wt),n.domElement.removeEventListener("pointerdown",A),n.domElement.removeEventListener("pointercancel",k),n.domElement.removeEventListener("wheel",ot),n.domElement.removeEventListener("pointermove",b),n.domElement.removeEventListener("pointerup",k),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ht),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new Wh,c=new Wh;let l=1;const h=new C,u=new pt,d=new pt,f=new pt,g=new pt,v=new pt,m=new pt,p=new pt,x=new pt,_=new pt,y=new C,R=new pt;let S=!1;const E=[],O={};let M=!1;function w(P){return P!==null?2*Math.PI/60*n.autoRotateSpeed*P:2*Math.PI/60/60*n.autoRotateSpeed}function z(P){const at=Math.abs(P*.01);return Math.pow(.95,n.zoomSpeed*at)}function j(P){c.theta-=P}function et(P){c.phi-=P}const U=function(){const P=new C;return function(Rt,wt){P.setFromMatrixColumn(wt,0),P.multiplyScalar(-Rt),h.add(P)}}(),F=function(){const P=new C;return function(Rt,wt){n.screenSpacePanning===!0?P.setFromMatrixColumn(wt,1):(P.setFromMatrixColumn(wt,0),P.crossVectors(n.object.up,P)),P.multiplyScalar(Rt),h.add(P)}}(),q=function(){const P=new C;return function(Rt,wt){const st=n.domElement;if(n.object.isPerspectiveCamera){const L=n.object.position;P.copy(L).sub(n.target);let ct=P.length();ct*=Math.tan(n.object.fov/2*Math.PI/180),U(2*Rt*ct/st.clientHeight,n.object.matrix),F(2*wt*ct/st.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(U(Rt*(n.object.right-n.object.left)/n.object.zoom/st.clientWidth,n.object.matrix),F(wt*(n.object.top-n.object.bottom)/n.object.zoom/st.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function Z(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function K(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Y(P,at){if(!n.zoomToCursor)return;S=!0;const Rt=n.domElement.getBoundingClientRect(),wt=P-Rt.left,st=at-Rt.top,L=Rt.width,ct=Rt.height;R.x=wt/L*2-1,R.y=-(st/ct)*2+1,y.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function Q(P){return Math.max(n.minDistance,Math.min(n.maxDistance,P))}function nt(P){u.set(P.clientX,P.clientY)}function gt(P){Y(P.clientX,P.clientX),p.set(P.clientX,P.clientY)}function G(P){g.set(P.clientX,P.clientY)}function J(P){d.set(P.clientX,P.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const at=n.domElement;j(2*Math.PI*f.x/at.clientHeight),et(2*Math.PI*f.y/at.clientHeight),u.copy(d),n.update()}function mt(P){x.set(P.clientX,P.clientY),_.subVectors(x,p),_.y>0?Z(z(_.y)):_.y<0&&K(z(_.y)),p.copy(x),n.update()}function St(P){v.set(P.clientX,P.clientY),m.subVectors(v,g).multiplyScalar(n.panSpeed),q(m.x,m.y),g.copy(v),n.update()}function Mt(P){Y(P.clientX,P.clientY),P.deltaY<0?K(z(P.deltaY)):P.deltaY>0&&Z(z(P.deltaY)),n.update()}function Ft(P){let at=!1;switch(P.code){case n.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?et(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):q(0,n.keyPanSpeed),at=!0;break;case n.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?et(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):q(0,-n.keyPanSpeed),at=!0;break;case n.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?j(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):q(n.keyPanSpeed,0),at=!0;break;case n.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?j(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):q(-n.keyPanSpeed,0),at=!0;break}at&&(P.preventDefault(),n.update())}function kt(P){if(E.length===1)u.set(P.pageX,P.pageY);else{const at=yt(P),Rt=.5*(P.pageX+at.x),wt=.5*(P.pageY+at.y);u.set(Rt,wt)}}function Lt(P){if(E.length===1)g.set(P.pageX,P.pageY);else{const at=yt(P),Rt=.5*(P.pageX+at.x),wt=.5*(P.pageY+at.y);g.set(Rt,wt)}}function Kt(P){const at=yt(P),Rt=P.pageX-at.x,wt=P.pageY-at.y,st=Math.sqrt(Rt*Rt+wt*wt);p.set(0,st)}function B(P){n.enableZoom&&Kt(P),n.enablePan&&Lt(P)}function ge(P){n.enableZoom&&Kt(P),n.enableRotate&&kt(P)}function Et(P){if(E.length==1)d.set(P.pageX,P.pageY);else{const Rt=yt(P),wt=.5*(P.pageX+Rt.x),st=.5*(P.pageY+Rt.y);d.set(wt,st)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const at=n.domElement;j(2*Math.PI*f.x/at.clientHeight),et(2*Math.PI*f.y/at.clientHeight),u.copy(d)}function It(P){if(E.length===1)v.set(P.pageX,P.pageY);else{const at=yt(P),Rt=.5*(P.pageX+at.x),wt=.5*(P.pageY+at.y);v.set(Rt,wt)}m.subVectors(v,g).multiplyScalar(n.panSpeed),q(m.x,m.y),g.copy(v)}function _t(P){const at=yt(P),Rt=P.pageX-at.x,wt=P.pageY-at.y,st=Math.sqrt(Rt*Rt+wt*wt);x.set(0,st),_.set(0,Math.pow(x.y/p.y,n.zoomSpeed)),Z(_.y),p.copy(x);const L=(P.pageX+at.x)*.5,ct=(P.pageY+at.y)*.5;Y(L,ct)}function ee(P){n.enableZoom&&_t(P),n.enablePan&&It(P)}function Dt(P){n.enableZoom&&_t(P),n.enableRotate&&Et(P)}function A(P){n.enabled!==!1&&(E.length===0&&(n.domElement.setPointerCapture(P.pointerId),n.domElement.addEventListener("pointermove",b),n.domElement.addEventListener("pointerup",k)),Ut(P),P.pointerType==="touch"?ut(P):it(P))}function b(P){n.enabled!==!1&&(P.pointerType==="touch"?X(P):tt(P))}function k(P){Ot(P),E.length===0&&(n.domElement.releasePointerCapture(P.pointerId),n.domElement.removeEventListener("pointermove",b),n.domElement.removeEventListener("pointerup",k)),n.dispatchEvent(vu),r=s.NONE}function it(P){let at;switch(P.button){case 0:at=n.mouseButtons.LEFT;break;case 1:at=n.mouseButtons.MIDDLE;break;case 2:at=n.mouseButtons.RIGHT;break;default:at=-1}switch(at){case Wn.DOLLY:if(n.enableZoom===!1)return;gt(P),r=s.DOLLY;break;case Wn.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enablePan===!1)return;G(P),r=s.PAN}else{if(n.enableRotate===!1)return;nt(P),r=s.ROTATE}break;case Wn.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enableRotate===!1)return;nt(P),r=s.ROTATE}else{if(n.enablePan===!1)return;G(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Wa)}function tt(P){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;J(P);break;case s.DOLLY:if(n.enableZoom===!1)return;mt(P);break;case s.PAN:if(n.enablePan===!1)return;St(P);break}}function ot(P){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(P.preventDefault(),n.dispatchEvent(Wa),Mt(I(P)),n.dispatchEvent(vu))}function I(P){const at=P.deltaMode,Rt={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(at){case 1:Rt.deltaY*=16;break;case 2:Rt.deltaY*=100;break}return P.ctrlKey&&!M&&(Rt.deltaY*=10),Rt}function D(P){P.key==="Control"&&(M=!0,document.addEventListener("keyup",$,{passive:!0,capture:!0}))}function $(P){P.key==="Control"&&(M=!1,document.removeEventListener("keyup",$,{passive:!0,capture:!0}))}function ht(P){n.enabled===!1||n.enablePan===!1||Ft(P)}function ut(P){switch(Tt(P),E.length){case 1:switch(n.touches.ONE){case ji.ROTATE:if(n.enableRotate===!1)return;kt(P),r=s.TOUCH_ROTATE;break;case ji.PAN:if(n.enablePan===!1)return;Lt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case ji.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;B(P),r=s.TOUCH_DOLLY_PAN;break;case ji.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ge(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Wa)}function X(P){switch(Tt(P),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Et(P),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;It(P),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;ee(P),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Dt(P),n.update();break;default:r=s.NONE}}function Wt(P){n.enabled!==!1&&P.preventDefault()}function Ut(P){E.push(P.pointerId)}function Ot(P){delete O[P.pointerId];for(let at=0;at<E.length;at++)if(E[at]==P.pointerId){E.splice(at,1);return}}function Tt(P){let at=O[P.pointerId];at===void 0&&(at=new pt,O[P.pointerId]=at),at.set(P.pageX,P.pageY)}function yt(P){const at=P.pointerId===E[0]?E[1]:E[0];return O[at]}n.domElement.addEventListener("contextmenu",Wt),n.domElement.addEventListener("pointerdown",A),n.domElement.addEventListener("pointercancel",k),n.domElement.addEventListener("wheel",ot,{passive:!1}),document.addEventListener("keydown",D,{passive:!0,capture:!0}),this.update()}}const{W:CM,H:PM}=Jn,LM=Object.freeze({cx:0,cz:0,w:CM,h:PM}),Ye=Object.freeze({title:Object.freeze({orbit:Object.freeze({centre:Object.freeze([-5,0,0]),radius:25,y:13,speed:.035,angle:-1.02})}),landscape:Object.freeze({pos:Object.freeze([0,30,31]),target:Object.freeze([0,0,1.5]),fov:40}),portrait:Object.freeze({pos:Object.freeze([-36,46,0]),target:Object.freeze([-1,0,0]),fov:56}),broadside:Object.freeze({azimuth:0,elevation:.77,max:105}),behind:i=>Object.freeze({azimuth:i<0?-Math.PI/2:Math.PI/2,elevation:.9,max:80}),overview:Object.freeze({azimuth:0,elevation:1.45,max:100})}),DM=i=>!(i<1);function _u({localSeats:i=[],edges:t=[]}){if(i.length===1){const e=t[i[0]];return[Ye.behind(e),Ye.broadside,Ye.behind(-e),Ye.overview]}return[Ye.broadside,Ye.behind(-1),Ye.behind(1),Ye.overview]}const Sd=i=>DM(i)?Ye.landscape.fov:Ye.portrait.fov;function IM(i,t,e=i.angle){const n=e+t*i.speed,s=i.centre;return{pos:[s[0]+Math.sin(n)*i.radius,i.y,s[2]+Math.cos(n)*i.radius],target:[s[0],s[1],s[2]]}}const UM=({follow:i,stage:t,active:e,localSeats:n})=>!!i&&t==="battle"&&!(n.length===1&&n.includes(e));function OM(i,t,e=LM){if(i.pos)return i;const n=Sd(t),s=Math.tan(n*Math.PI/360),r=s*t,{azimuth:o,elevation:a}=i,c=[Math.sin(o)*Math.cos(a),Math.sin(a),Math.cos(o)*Math.cos(a)],l=c.map(y=>-y),h=zM([-l[2],0,l[0]]),u=NM(h,l),{cx:d,cz:f,w:g,h:v}=e,m=[[-g/2,-v/2],[g/2,-v/2],[-g/2,v/2],[g/2,v/2]].map(([y,R])=>[y,0,R]),p=y=>m.every(R=>{const S=[R[0]-c[0]*y,R[1]-c[1]*y,R[2]-c[2]*y],E=Ga(S,l);return E>0&&Math.abs(Ga(S,h))*1.12<=E*r&&Math.abs(Ga(S,u))*1.12<=E*s});let x=1,_=i.max;if(p(x))_=x;else if(p(_))for(let y=0;y<60;y++){const R=(x+_)/2;p(R)?_=R:x=R}return{pos:[d+c[0]*_,c[1]*_,f+c[2]*_],target:[d,0,f],fov:n}}const Ga=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],NM=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],zM=i=>{const t=Math.hypot(i[0],i[1],i[2]);return i.map(e=>e/t)},yu=i=>new C(i[0],i[1],i[2]),oo=75;class kM{constructor(t){const e=Ye.landscape;this.camera=new sn(e.fov,innerWidth/innerHeight,.1,400),this.camera.position.set(...e.pos);const n=this.controls=new RM(this.camera,t.domElement);n.target.set(...e.target),n.enableDamping=!0,n.dampingFactor=.08,n.maxPolarAngle=1.32,n.minDistance=5,n.maxDistance=oo,n.screenSpacePanning=!1,n.mouseButtons={LEFT:Wn.ROTATE,MIDDLE:Wn.DOLLY,RIGHT:Wn.PAN},this.follow=!0,this.titleSpin=!0,this.titleAngle=Ye.title.orbit.angle,this.viewShift=1,this.focusTween=null,this.views=[],this.viewAt=0,this.keys=new Set,addEventListener("keydown",s=>{s.target.tagName!=="INPUT"&&(!s.repeat&&(s.key==="v"||s.key==="V")?this.nextView():s.key==="Home"&&this.toOverview(),this.keys.add(s.key.toLowerCase()))}),addEventListener("keyup",s=>this.keys.delete(s.key.toLowerCase())),this.fitFov(),addEventListener("resize",()=>{this.fitFov(),this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix()})}fitFov(){const t=this.camera;t.fov=Sd(innerWidth/innerHeight),t.aspect=innerWidth/innerHeight,t.updateProjectionMatrix()}fit(t,e=innerWidth/innerHeight){return OM(t,e)}setViews(t){this.views=t,this.viewAt=0,this.goTo(t[0])}nextView(){this.views.length&&(this.viewAt=(this.viewAt+1)%this.views.length,this.goTo(this.views[this.viewAt],.9))}toOverview(){this.views.length&&(this.viewAt=this.views.length-1,this.goTo(this.views[this.viewAt],.9))}goTo(t,e=1.4){this.titleSpin=!1;const n=this.camera,s=this.controls,r=this.fit(t);s.maxDistance=Math.max(oo,t.max??oo);const o=n.position.clone(),a=s.target.clone(),c=yu(r.pos),l=yu(r.target);Te(e,h=>{this.viewShift=1-h,n.position.lerpVectors(o,c,h),s.target.lerpVectors(a,l,h)},Mc)}toTitle(){this.views=[],this.titleSpin=!0,this.controls.maxDistance=oo,this.titleAngle-=we.time*Ye.title.orbit.speed,this.viewShift=1}focus(t,e,{stage:n,active:s,localSeats:r}){if(!UM({follow:this.follow,stage:n,active:s,localSeats:r}))return;const o=this.camera,a=this.controls,c=a.target.clone();if(Math.hypot(t-c.x,e-c.z)<6)return;const h=o.position.clone().sub(c),u=new C(fn(c.x,t,.6),0,fn(c.z,e,.6)),d=this.focusTween={};Te(.9,f=>{this.focusTween===d&&(a.target.lerpVectors(c,u,f),o.position.copy(a.target).add(h))},Mc)}panKeys(t){const e=this.camera,n=this.controls,s=this.keys,r=new C,o=new C().subVectors(n.target,e.position).setY(0).normalize(),a=new C(-o.z,0,o.x);(s.has("w")||s.has("arrowup"))&&r.add(o),(s.has("s")||s.has("arrowdown"))&&r.sub(o),(s.has("d")||s.has("arrowright"))&&r.add(a),(s.has("a")||s.has("arrowleft"))&&r.sub(a),r.lengthSq()&&(r.normalize().multiplyScalar(t*18),n.target.add(r),e.position.add(r))}update(t){var s;const e=this.camera;if(this.titleSpin){const r=IM(Ye.title.orbit,we.time,this.titleAngle);e.position.set(...r.pos),this.controls.target.set(...r.target)}const n=innerWidth>900?this.viewShift:0;n>.001?e.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*n,0,innerWidth,innerHeight):(s=e.view)!=null&&s.enabled&&e.clearViewOffset(),this.panKeys(t),this.controls.update()}render(t,e,n,s=!0){const r=this.camera,o=new C((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);r.position.add(o),s&&t.render(e,r),r.position.sub(o)}}function FM(i,t,e){const n=document.createElement("canvas");n.width=2048,n.height=Math.round(2048*t/i);const s=n.getContext("2d");s.fillStyle="#5b7a36",s.fillRect(0,0,n.width,n.height);const r=(a,c,l,h,u)=>{for(let d=0;d<c;d++)s.globalAlpha=u*(.4+Math.random()*.6),s.fillStyle=a[Math.random()*a.length|0],s.beginPath(),s.ellipse(Math.random()*n.width,Math.random()*n.height,l+Math.random()*(h-l),l+Math.random()*(h-l),Math.random()*3,0,Math.PI*2),s.fill()};r(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),r(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),r(["#8fa65a","#a4b46a"],300,4,14,.4);for(let a=0;a<14e3;a++)s.globalAlpha=.35,s.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",s.fillRect(Math.random()*n.width,Math.random()*n.height,2,4+Math.random()*4);s.globalAlpha=1;const o=new kc(n);return o.colorSpace=Se,o.anisotropy=e.capabilities.getMaxAnisotropy(),o}function BM(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new kc(i);return e.colorSpace=Se,e.wrapS=e.wrapT=bo,e.repeat.set(6,6),e}class HM{constructor(t,e,{W:n,H:s,deploy:r,edges:o}){this.W=n,this.H=s;const a=new Mn({map:FM(n,s,e),roughness:.95}),c=this.board=new Gt(new hi(n,s).rotateX(-Math.PI/2),a);c.receiveShadow=!0,t.add(c);const l=new Gt(new hi(220,220).rotateX(-Math.PI/2),new Mn({map:BM(),roughness:.7}));l.position.y=-.62,l.receiveShadow=!0,t.add(l);{const h=new Mn({color:"#5a3a22",roughness:.6}),u=[[n+1.6,.8,.8,0,-s/2-.4],[n+1.6,.8,.8,0,s/2+.4],[.8,.8,s,-n/2-.4,0],[.8,.8,s,n/2+.4,0]];for(const[f,g,v,m,p]of u){const x=new Gt(new Pn(f,g,v),h);x.position.set(m,-.22,p),x.castShadow=x.receiveShadow=!0,t.add(x)}const d=new Gt(new Pn(n,.6,s),h);d.position.y=-.31,t.add(d)}this.zoneMats=[],this.zoneLineMats=[];for(const h of[0,1]){const u=o[h],d=new We({transparent:!0,opacity:.07,depthWrite:!1});this.zoneMats.push(d);const f=new Gt(new hi(r,s).rotateX(-Math.PI/2),d);f.position.set(u*(n/2-r/2),.008,0),f.renderOrder=1,t.add(f);const g=[];for(let m=-s/2;m<s/2;m+=1)g.push(new C(u*(n/2-r),.02,m),new C(u*(n/2-r),.02,m+.5));const v=new zo({transparent:!0,opacity:.5});this.zoneLineMats.push(v),t.add(new t_(new de().setFromPoints(g),v))}this.tufts=new sr(new Ln(.035,.13,3),new Mn({color:"#ffffff",roughness:1}),700),this.flowers=new sr(new Dn(.05,0),new Mn({roughness:.6}),140),t.add(this.tufts,this.flowers)}paint(t){for(const e of[0,1])this.zoneMats[e].color.set(t[e]),this.zoneLineMats[e].color.set(t[e])}zones(t){for(const e of[0,1])this.zoneMats[e].opacity=t[e]}scatterTufts(){const{W:t,H:e,tufts:n,flowers:s}=this,r=new re,o=new Cn,a=new zs,c=new qt;for(let h=0;h<n.count;h++){const u=(Math.random()-.5)*(t-.4),d=(Math.random()-.5)*(e-.4),f=.6+Math.random()*1.2;o.setFromEuler(a.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),r.compose(new C(u,.08*f,d),o,new C(f,f,f)),n.setMatrixAt(h,r),n.setColorAt(h,c.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][h%4]))}const l=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let h=0;h<s.count;h++){const u=(Math.random()-.5)*(t-.4),d=(Math.random()-.5)*(e-.4);r.compose(new C(u,.08,d),o.identity(),new C(1,.6,1)),s.setMatrixAt(h,r),s.setColorAt(h,c.set(l[h%l.length]))}n.instanceMatrix.needsUpdate=s.instanceMatrix.needsUpdate=!0,n.instanceColor.needsUpdate=s.instanceColor.needsUpdate=!0}}const $a=new Map;function xt(i,t={}){const e=i+JSON.stringify(t);return $a.has(e)||$a.set(e,new Mn({color:i,roughness:.72,flatShading:!0,...t})),$a.get(e)}const Pi=i=>xt(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),Be=i=>xt(i,{metalness:.65,roughness:.35}),ft={ico:new Dn(1,1),ico0:new Dn(1,0),sph:new on(1,10,8),box:new Pn(1,1,1),cyl:new Ze(1,1,1,10),cone:new Ln(1,1,8),cap:new on(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new ki(1,12).rotateX(Math.PI/2),oct:new ko(1,0)};function rt(i,t,e=0,n=0,s=0,r=1,o=r,a=r){const c=new Gt(i,t);return c.position.set(e,n,s),c.scale.set(r,o,a),c.castShadow=!0,c}function Ei(i,t,e,n){const s=new C(...i),r=new C(...t),o=rt(ft.cyl,n);return o.position.copy(s).add(r).multiplyScalar(.5),o.scale.set(e,s.distanceTo(r),e),o.quaternion.setFromUnitVectors(new C(0,1,0),r.clone().sub(s).normalize()),o}function VM(i,t){const e=new Ht,n=rt(new Ze(i,i*1.05,.09,28),xt("#262422"),0,.045,0);n.receiveShadow=!0;const s=rt(new Ze(i*.96,i*.96,.012,28),xt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=rt(new bn(i*1.02,.028,4,32).rotateX(Math.PI/2),xt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let o=0;o<Math.round(i*9);o++){const a=Math.random()*6,c=Math.sqrt(Math.random())*i*.85;e.add(rt(ft.cone,xt("#6a8a3a"),Math.cos(a)*c,.13,Math.sin(a)*c,.035,.08,.035))}return e}function WM(i,t,e,n,s=8,r=40){const o=new Hc(i.map(p=>new C(...p))),a=o.computeFrenetFrames(r,!1),c=[],l=[];for(let p=0;p<=r;p++){const x=p/r,_=o.getPointAt(x),y=t+(e-t)*Math.pow(x,.6),R=a.normals[p],S=a.binormals[p];for(let E=0;E<=s;E++){const O=E/s*Math.PI*2,M=Math.cos(O),w=Math.sin(O);c.push(_.x+y*(M*R.x+w*S.x),_.y+y*(M*R.y+w*S.y),_.z+y*(M*R.z+w*S.z))}}for(let p=0;p<r;p++)for(let x=0;x<s;x++){const _=p*(s+1)+x,y=_+s+1;l.push(_,_+1,y,y,_+1,y+1)}const h=o.getPointAt(0),u=c.length/3;c.push(h.x,h.y,h.z);for(let p=0;p<s;p++)l.push(u,p+1,p);const d=o.getPointAt(1),f=c.length/3;c.push(d.x,d.y,d.z);const g=r*(s+1);for(let p=0;p<s;p++)l.push(f,g+p,g+p+1);const v=new de;v.setAttribute("position",new se(c,3)),v.setIndex(l),v.computeVertexNormals();const m=new Gt(v,n);return m.castShadow=!0,m}const tr=()=>xt("#7a5232");function GM(i=1.1,t="#c9a24a"){const e=new Ht;return e.add(rt(ft.cyl,tr(),0,0,0,.022,i,.022)),e.add(rt(ft.cone,Be(t),0,i/2+.07,0,.04,.14,.04)),e}function wd(i,t,e){const n=new Ht,s=rt(ft.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(rt(ft.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const er=(i,t)=>{const e=new qt(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function Gn(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function Ed(i,t,e,n){const s=new Ht,r=rt(ft.cyl,xt("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const o=rt(ft.cyl,Be("#444"),0,0,0,i*.3,.13,i*.3);return o.rotation.z=Math.PI/2,s.add(r,o),s.position.set(t,e,n),s}class $M{constructor(t,e,n,s){this.colorOf=s,this.items=e.map((r,o)=>{const a=new Ht;a.position.set(r.x,0,r.z);const c=new Gt(new Ze(.55,.65,.16,8),xt("#8a8478"));c.position.y=.08,c.castShadow=c.receiveShadow=!0;const l=new Gt(new ko(.2,0),new Mn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));l.position.y=.42;const h=new Gt(new Ze(.03,.03,2.1,6),xt("#5a3d24"));h.position.set(.35,1.1,0),h.castShadow=!0;const u=new Mn({color:"#e8e0d0",side:rn,roughness:.8}),d=new Gt(new hi(.8,.5,6,1).translate(.4,0,0),u);d.position.set(.35,1.85,0),d.castShadow=!0;const f=new Gt(new Fi(n-.06,n,64).rotateX(-Math.PI/2),new We({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return f.position.y=.03,a.add(c,l,h,d,f),t.add(a),{i:o,g:a,gem:l,flag:d,flagMat:u,ring:f,owner:-1}})}paint(t,e){t.owner=e,t.flagMat.color.set(e<0?"#e8e0d0":this.colorOf(e)),t.ring.material.color.set(e<0?"#fff3c0":this.colorOf(e))}reset(){for(const t of this.items)this.paint(t,-1)}animate(t,e,n){for(const s of this.items){const r=n[s.i];r!==s.owner&&this.paint(s,r),s.gem.rotation.y=e*1.2,s.gem.position.y=.45+Math.sin(e*2+s.i)*.05,s.flag.rotation.y=Math.sin(e*2.2+s.i)*.25,s.ring.material.opacity=.3+Math.sin(e*2+s.i)*.08}}}let Ge=null,ws=null,$n=!1;try{$n=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function yr(){if(!Ge)try{Ge=new(window.AudioContext||window.webkitAudioContext),ws=Ge.createGain(),ws.gain.value=$n?0:.5,ws.connect(Ge.destination)}catch{Ge=null}}function jM(){$n=!$n;try{localStorage.setItem("tails-and-scales:muted",$n?"1":"0")}catch{}return ws&&(ws.gain.value=$n?0:.5),$n}const XM=()=>$n;function qM(i){const t=Math.floor(Ge.sampleRate*i),e=Ge.createBuffer(1,t,Ge.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=Ge.createBufferSource();return s.buffer=e,s}function Td(i,t,e,n,s){const r=Ge.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(ws),r}function ps({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const o=Ge.currentTime+s,a=qM(i),c=Ge.createBiquadFilter();c.type=e,c.frequency.value=t,c.Q.value=r,a.connect(c),Td(c,o,.005,n,i),a.start(o)}function Ti({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const o=Ge.currentTime+r,a=Ge.createOscillator();a.type=n,a.frequency.setValueAtTime(i,o),a.frequency.exponentialRampToValueAtTime(Math.max(20,t),o+e),Td(a,o,.01,s,e),a.start(o),a.stop(o+e+.05)}const Mu={squeak(){Ti({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){ps({dur:.35,freq:5e3,type:"highpass",peak:.18})}},YM={voice(i){Object.hasOwn(Mu,i)&&Mu[i]()},dice(i=3){for(let t=0;t<Math.min(6,i);t++)ps({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){ps({dur:.5+i*.5,freq:300+200/i,peak:.8}),Ti({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Ti({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){ps({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},crumble(){ps({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)ps({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Ti({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Ti({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Ti({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Ti({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},Ee=new Proxy(YM,{get(i,t){return(...e)=>{if(!(!Ge||$n))try{i[t](...e)}catch{}}}}),Ci=new Pn(1,1,1),Ad=new Ze(.5,.5,1,8).rotateZ(Math.PI/2),ja=new Map;function ue(i,t={}){const e=i+JSON.stringify(t);return ja.has(e)||ja.set(e,new Mn({color:i,roughness:.9,flatShading:!0,...t})),ja.get(e)}function fe(i,t,{shadow:e=!0}={}){const n=new Gt(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const Xa={box:i=>bu(i,Ci),log:i=>bu(i,Ad),cap(i){const{look:t,shape:e}=i,n=fe(new Ln(t.r,t.h,4).rotateY(Math.PI/4),ue(t.color));return n.position.set(e.x,e.y,e.z),n.rotation.y=t.yaw,{obj:n}},tree(i){const{look:t,shape:e}=i,{h:n,r:s}=t.trunk,r=new Ht;r.position.set(e.x,0,e.z);const o=fe(new Ze(s*.75,s,n,7).translate(0,n/2,0),ue(t.bark));r.add(o);const a=new Ht;r.add(a);for(const c of t.canopy)if(c.cone){const l=fe(new Ln(c.r,c.h,8),ue(c.color));l.position.y=c.y,l.rotation.y=c.yaw,a.add(l)}else{const l=fe(new Dn(c.r,1),ue(c.color));l.position.set(...c.pos),l.scale.y=.8,a.add(l)}return r.rotation.y=t.yaw,{obj:r,canopy:a}},hedge(i){const{look:t,shape:e}=i,n=new Ht;n.position.set(e.x,0,e.z),n.rotation.y=t.yaw;const s=fe(Ci,ue(t.color));s.scale.set(1.15,.62,.55),s.position.y=.31,n.add(s);for(const r of t.tufts){const o=fe(new Dn(.3,0),ue(r.color));o.position.set(...r.pos),n.add(o)}for(const r of t.berries){const o=fe(new on(.05,5,4),ue("#c0302a"),{shadow:!1});o.position.set(...r),n.add(o)}return{obj:n}},boulder(i){const{look:t,shape:e}=i,n=fe(new Ro(t.size,0),ue(t.color));if(n.scale.set(...t.scale),n.rotation.set(...t.rot),n.position.set(e.x,t.y,e.z),t.moss){const s=fe(new Ro(t.size*.55,0),ue("#5d7a3a"),{shadow:!1});s.position.set(0,t.size*.55,0),s.scale.set(1.1,.4,1.1),n.add(s)}return{obj:n}},crate(i){const{look:t}=i,e=new Ht,n=t.s,s=fe(Ci,ue(t.color));s.scale.setScalar(n),s.position.y=n/2;const r=fe(Ci,ue("#5f3e24"));if(r.scale.set(n*1.02,n*.14,n*1.02),r.position.y=n/2,e.add(s,r),t.stacked){const o=fe(Ci,ue("#9a7048"));o.scale.setScalar(n*.7),o.position.set(0,n+n*.35,0),o.rotation.y=.5,e.add(o)}return qa(i,e)},barrel(i){const t=new Ht,e=fe(new Ze(.28,.24,.75,10),ue(i.look.color));e.position.y=.375;const n=fe(new bn(.29,.025,4,14).rotateX(Math.PI/2),ue("#3a3a3a",{metalness:.4}));return n.position.y=.55,t.add(e,n),qa(i,t)},sack(i){const t=new Ht,e=fe(new on(.34,9,7),ue("#c2a77a"));e.scale.set(1,1.15,.9),e.position.y=.36,t.add(e);for(const[n,s]of i.look.acorns){const r=fe(new on(.08,6,5),ue("#8a5a2a"));r.position.set(n,.72,s),t.add(r)}return qa(i,t)},mushroom(i){const{look:t,shape:e}=i,{h:n,r:s,sr:r}=t,o=new Ht;o.position.set(e.x,0,e.z);const a=fe(new Ze(r*.8,r*1.2,n,8).translate(0,n/2,0),ue("#efe6d0")),c=fe(new on(s,14,8,0,Math.PI*2,0,Math.PI/2),ue(t.cap));c.position.y=n-.05,c.scale.y=.7;const l=fe(new ki(s,14).rotateX(Math.PI/2),ue("#e9dcc0"));l.position.y=n-.05,o.add(a,c,l);for(const[h,u]of t.dots){const d=fe(new on(s*.12,5,4),ue("#fff6e0"),{shadow:!1});d.position.set(Math.cos(h)*Math.sin(u)*s,n-.05+Math.cos(u)*s*.7,Math.sin(h)*Math.sin(u)*s),o.add(d)}return o.rotation.z=t.tilt,{obj:o}},floor(i){const{look:t,shape:e}=i,n=new ki(t.r,t.segments),s=n.attributes.position;if(t.rim.length!==s.count-1)throw new Error(`a forest floor of ${s.count} vertices with ${t.rim.length} rim draws`);for(let o=1;o<s.count;o++){const a=t.rim[o-1];s.setXY(o,s.getX(o)*a,s.getY(o)*a)}n.rotateX(-Math.PI/2);const r=fe(n,ue(t.color,{flatShading:!1}),{shadow:!1});return r.position.set(e.x,.012,e.z),{obj:r}},rubble(i){const t=new Ht;return t.position.set(i.shape.x,0,i.shape.z),{obj:t,pieces:0}}};function bu(i,t){const{look:e,shape:n}=i,s=fe(t,ue(e.color));return s.scale.set(...e.scale),s.position.set(n.x,n.y,n.z),s.rotation.y=e.yaw,{obj:s}}function qa(i,t){return t.position.set(i.shape.x,0,i.shape.z),t.rotation.y=i.look.yaw,{obj:t}}class Rd{constructor(t,e){this.scene=t,this.effects=e,this.group=new Ht,t.add(this.group),this.items=new Map,this.spares=new Map}object(t){var e;return(e=this.items.get(t))==null?void 0:e.obj}apply(t,e){switch(t.t){case"terrain.clear":return this.clear();case"terrain.add":return this.add(t.def);case"terrain.hurt":return this.hurt(this.items.get(t.id).c,t.from,t.at);case"terrain.destroy":return this.destroy(this.items.get(t.id).c,t.from,t.at);case"terrain.collapse":return this.collapse(t.drops,t.by,e);case"terrain.rubble":return this.rubble(this.items.get(t.id).c,t.from)}throw new Error(`TerrainView: no handler for ${t.t}`)}clear(){this.freeSpares(),this.scene.remove(this.group),this.group=new Ht,this.scene.add(this.group),this.spares=this.items,this.items=new Map}add(t){const e=this.spares.get(t.id);if(e!=null&&e.obj&&!e.touched&&!e.shared&&wu(e.c,t,!0)){this.spares.delete(t.id),this.items.set(t.id,{...e,c:t}),this.group.add(e.obj);return}if(t.look.piece==="fallen")return this.fell(t);const n={c:t,...Xa[t.look.piece](t)};this.items.set(t.id,n),this.group.add(n.obj)}dispose(){this.freeSpares();for(const t of this.items.values())this.free(t);this.items.clear(),this.scene.remove(this.group),this.group=new Ht,this.scene.add(this.group)}sync(t){var n;this.freeSpares();const e=new Map(t.map(s=>[s.id,s]));for(const[s,r]of[...this.items]){const o=e.get(s);o&&wu(r.c,o,!1)&&(o.alive?this.shows(r):!this.shows(r))||(this.free(r),this.items.delete(s))}for(const s of t){const r=this.items.get(s.id);if(r){s.alive&&KM.has(s.look.piece)&&(r.fall=null,r.obj.position.y=s.shape.y,r.c=Qs(s));continue}if(!s.alive){this.items.has(s.id)||this.items.set(s.id,{c:Qs(s),obj:null});continue}if(s.look.piece==="fallen"){this.fallen(Qs(s),e.get(s.look.tree));continue}const o=Qs(s),a={c:o,...Xa[s.look.piece](o)};if(this.items.set(s.id,a),this.group.add(a.obj),s.kind==="rubble")for(const c of t)c.kind==="block"&&!c.alive&&((n=c.col)==null?void 0:n.rubble)===s&&this.rubble(o,null)}}shows(t){var e;return!t.obj||t.obj.parent!==this.group?!1:t.c.kind==="tree"?((e=t.canopy)==null?void 0:e.parent)===t.obj:!0}state(t){const e=this.items.get(t),n=!!e&&this.shows(e);if(!n)return{shown:n};const s=e.obj;return{shown:n,x:s.position.x,y:s.position.y,z:s.position.z,q:s.quaternion.toArray()}}free(t){t.canopy&&t.canopy.parent!==t.obj&&Su(t.canopy),t.canopy=null,!(!t.obj||t.shared)&&(t.obj.parent&&t.obj.parent.remove(t.obj),Su(t.obj),t.ownMat&&t.obj.material.dispose(),t.obj=null)}freeSpares(){for(const t of this.spares.values())this.free(t);this.spares.clear()}hurt(t,e,n){const s=this.items.get(t.id),r=s.obj;s.touched=!0,r.isMesh&&(s.ownMat||(r.material=r.material.clone(),s.ownMat=!0),r.material.color.multiplyScalar(.8));const o=r.position.clone();Te(.25,a=>{const c=(1-a)*.06;r.position.x=o.x+(Math.random()-.5)*c,r.position.z=o.z+(Math.random()-.5)*c}).then(()=>{r.position.x=o.x,r.position.z=o.z}),this.effects.debris(n.x,n.y,n.z,[t.look.chip||"#888","#666"],3,{from:e,power:3,size:.08})}destroy(t,e,n){const s=this.items.get(t.id);s.touched=!0;const r=n,o=this.effects;switch(t.kind){case"block":{this.group.remove(s.obj),o.debris(r.x,r.y,r.z,[t.look.chip,t.look.chip,"#5a5650"],12,{from:e,power:6}),o.smoke({x:r.x,y:r.y,z:r.z,size:.4,color:"#a09a8a",life:1.5});break}case"tree":{for(const a of s.canopy.children){const c=new C;a.getWorldPosition(c),o.leaves(c.x,c.y,c.z,t.look.leaves,14,1)}s.obj.remove(s.canopy);break}case"hedge":case"mushroom":if(this.group.remove(s.obj),o.leaves(r.x,r.y,r.z,t.look.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let a=0;a<16;a++)o.mote({x:r.x,y:r.y*1.5,z:r.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(s.obj),o.debris(r.x,r.y,r.z,ey,14,{from:e,power:6,size:.12});break}t.kind==="block"?Ee.crumble():Ee.thwack()}collapse(t,e,n){for(const{id:s,dy:r}of t){const o=this.items.get(s),{c:a,obj:c}=o;o.touched=!0;const l=n.chunks[s].y,h=c.position.y,u=l,d=o.fall={};Te(.18+r*.15,f=>o.fall===d&&(c.position.y=h+(u-h)*f),wM).then(()=>{this.effects.debris(a.shape.x,l-e/2,a.shape.z,["#8a8478"],3,{power:2,size:.07})})}}rubble(t,e){const n=this.items.get(t.id),s=n.obj;n.touched=!0;const r=Xf[t.look.style],o=4+Math.floor(Math.random()*3);for(let a=0;a<o;a++){const c=fe(Ci,ue(MM(r.colors))),l=.18+Math.random()*.22;c.scale.set(l*(r.look==="log"?2.4:1.2),l*.7,l);const h=Math.random()*6,u=Math.random()*.6,d=e?t.shape.x-e.x:0,f=e?t.shape.z-e.z:0,g=Math.hypot(d,f)||1;c.position.set(Math.cos(h)*u+d/g*.25,l*.3+Math.min(.2,n.pieces*.012),Math.sin(h)*u+f/g*.25),c.rotation.set(Math.random(),Math.random()*6,Math.random()),s.add(c)}n.pieces+=o}fell(t){const e=this.items.get(t.look.tree),n=e.c,s=n.shape,r=n.look.trunk,{dx:o,dz:a}=t.look,c=e.obj,l=c.quaternion.clone(),h=Eu(c,l,t.look,r);Te(.9,h,bM).then(()=>{this.effects.debris(s.x+o*r.h,.2,s.z+a*r.h,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.effects.shake=Math.max(this.effects.shake,.05)}),e.shared=!0,this.items.set(t.id,{c:t,obj:c,touched:!0}),this.group.add(c)}fallen(t,e){const n=Qs(e),{obj:s,canopy:r}=Xa.tree(n);s.remove(r),Eu(s,s.quaternion.clone(),t.look,n.look.trunk)(1),this.items.set(n.id,{c:n,obj:s,canopy:r,shared:!0}),this.items.set(t.id,{c:t,obj:s,touched:!0}),this.group.add(s)}}function Su(i){i.traverse(t=>{t.geometry&&t.geometry!==Ci&&t.geometry!==Ad&&t.geometry.dispose()})}const KM=new Set(["box","log","cap"]),Qs=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});function wu(i,t,e){const n=s=>JSON.stringify({id:s.id,kind:s.kind,look:s.look,shape:e?s.shape:{...s.shape,y:0}});return n(i)===n(t)}function Eu(i,t,{dx:e,dz:n},s){const r=new C(n,0,-e).normalize(),o=new Cn;return a=>{o.setFromAxisAngle(r,(Math.PI/2-.12)*a),i.quaternion.copy(t).premultiply(o),i.position.y=Math.sin(a*Math.PI)*.05+s.r*a}}function JM(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new de;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=Tu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);const g=Tu(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function Tu(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const o=new t(r);let a=0;for(let l=0;l<i.length;++l)o.set(i[l].array,a),a+=i[l].array.length;const c=new an(o,e,n);return s!==void 0&&(c.gpuType=s),c}function ZM(i){for(const t of["position","normal"]){const e=i.getAttribute(t);for(let n=0;n<e.count;n+=3){const s=e.getX(n+1),r=e.getY(n+1),o=e.getZ(n+1);e.setXYZ(n+1,e.getX(n+2),e.getY(n+2),e.getZ(n+2)),e.setXYZ(n+2,s,r,o)}}}const Ya=new Map;function QM(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function Sc(i){i.updateMatrixWorld(!0);const t=new re().copy(i.matrixWorld).invert(),e=new re,n=new Map,s=[],r=o=>{for(const a of o.children){if(a.userData.keep){Sc(a);continue}if(a.isMesh){const c=a.material,l=QM(c);n.has(l)||n.set(l,{m:c,geos:[]});const h=a.geometry.index?a.geometry.toNonIndexed():a.geometry,u=new de;u.setAttribute("position",h.getAttribute("position").clone()),u.setAttribute("normal",h.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,a.matrixWorld)),e.determinant()<0&&ZM(u);const d=u.getAttribute("position").count,f=new Float32Array(d*3);for(let g=0;g<d;g++)f.set([c.color.r,c.color.g,c.color.b],g*3);u.setAttribute("color",new an(f,3)),n.get(l).geos.push(u),s.push(a)}r(a)}};r(i);for(const o of s)o.parent.remove(o);for(const[o,{m:a,geos:c}]of n)Ya.has(o)||Ya.set(o,new Mn({vertexColors:!0,metalness:a.metalness,roughness:a.roughness,flatShading:a.flatShading,emissive:a.emissive,emissiveIntensity:a.emissiveIntensity,transparent:a.transparent,opacity:a.opacity,side:a.side})),i.add(new Gt(JM(c),Ya.get(o)))}function us({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new Ht,o=new Ht;r.add(o);const a=xt(i),c=xt(t),l=xt("#1b1410");for(const p of[-1,1])o.add(rt(ft.ico,a,p*.1,.05,.07,.08,.045,.13)),o.add(rt(ft.ico,a,p*.12,.17,-.02,.14));o.add(rt(ft.ico,a,0,.38,0,.21,.28,.19)),o.add(rt(ft.ico,c,0,.36,.1,.14,.2,.09));const h=new Ht;h.position.set(0,.72,.05),o.add(h),h.add(rt(ft.ico,a,0,0,0,.17)),h.add(rt(ft.ico,c,0,-.05,.12,.09,.075,.08)),h.add(rt(ft.sph,l,0,-.02,.2,.028));for(const p of[-1,1]){h.add(rt(ft.sph,l,p*.075,.04,.13,.034)),h.add(rt(ft.sph,xt("#ffffff"),p*.068,.055,.155,.01));const x=rt(ft.cone,a,p*.09,.16,-.02,.05,.13,.04);x.rotation.z=-p*.25,h.add(x);const _=rt(ft.cone,xt(er(i,-.25)),p*.1,.25,-.02,.025,.07,.02);_.rotation.z=-p*.3,h.add(_)}e==="acorn"&&(h.add(rt(ft.cap,xt(n),0,.07,0,.19,.13,.19)),h.add(rt(ft.brim,xt(n),0,.07,0,.19,1,.19)),h.add(rt(ft.cyl,xt(er(n,-.2)),0,.22,0,.02,.06,.02)));const u=new Ht;u.position.set(0,.22,-.18),o.add(u);const d=new Hc([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(p=>new C(...p))),f=xt(er(i,.08)),g=xt(er(i,.2)),v=12;for(let p=0;p<v;p++){const x=p/(v-1),_=.085+Math.sin(Math.min(1,x*1.15)*Math.PI)*.11,y=d.getPointAt(x);u.add(rt(ft.ico,x>.75?g:f,y.x,y.y,y.z,_,_*1.1,_))}const m=[];for(const p of[-1,1]){const x=new Ht;x.position.set(p*.17,.52,.04),x.add(rt(ft.ico,a,0,-.1,0,.05,.12,.05));const _=new Ht;_.position.set(0,-.21,0),_.add(rt(ft.ico,a,0,0,0,.045)),x.add(_),x.userData.hand=_,x.rotation.x=-.9,o.add(x),m.push(x)}return r.userData.anim={kind:"squirrel",body:o,tail:u,head:h,armL:m[0],armR:m[1]},r}const Cd={nutkin(){const i=us({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=rt(ft.cone,xt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new Ht;return n.add(Ei([0,-.08,0],[0,.04,0],.018,tr())),n.add(Ei([0,.04,0],[-.05,.13,0],.014,tr())),n.add(Ei([0,.04,0],[.05,.13,0],.014,tr())),Gn(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=us({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=rt(new bn(.21,.025,4,16),xt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(rt(ft.sph,xt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(rt(new bn(.04,.012,4,10),Be("#c9a24a"),s*.07,.07,.14));const n=new Ht;return n.add(rt(ft.sph,xt("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(rt(ft.cap,xt("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(rt(ft.brim,xt("#4f3a22"),0,.03,0,.065,1,.065)),n.add(rt(ft.sph,Pi("#ffb030"),0,.1,0,.022)),Gn(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=us({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(rt(ft.ico,xt("#5b4330"),0,.42,.05,.2,.22,.16));const e=rt(ft.cone,xt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=wd(.22,xt("#6b4a2e"),xt("#3e7a2a"));Gn(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new Ht;return s.add(rt(ft.cyl,tr(),0,.2,0,.022,1.15,.022)),s.add(rt(ft.box,Be("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(rt(ft.cone,xt("#6b4a26"),0,.85,0,.06,.18,.06)),Gn(t.armR,s,.9),i},glider(){const i=us({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(rt(new bn(.045,.015,4,10),Be("#c9a24a"),n*.07,.07,.14));t.head.add(rt(ft.cap,xt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(rt(ft.brim,xt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=xt(er("#9a8a78",-.12),{side:rn});for(const n of[-1,1]){const s=new de;s.setAttribute("position",new se([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new Gt(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(rt(ft.cyl,xt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new Ht,t=new Ht;i.add(t);const e=xt("#7a5232"),n=xt("#5f3e24");for(const l of[-1,1])t.add(rt(ft.box,n,l*.38,.2,0,.1,.1,1.6)),t.add(Ei([l*.38,.2,-.55],[l*.38,1.25,0],.045,e)),t.add(Ei([l*.38,.2,.55],[l*.38,1.25,0],.045,e));t.add(rt(ft.box,n,0,.2,.6,.86,.08,.1)),t.add(rt(ft.box,n,0,.2,-.6,.86,.08,.1));const s=rt(ft.cyl,Be("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const l of[-1,1])for(const h of[-.6,.6]){const u=Ed(.17,l*.5,.17,h);t.add(u),r.push(u)}const o=new Ht;o.position.set(0,1.25,0),o.add(rt(ft.box,e,0,0,.35,.08,.08,1.7));const a=rt(ft.box,n,0,-.18,-.45,.32,.3,.3);o.add(a);for(let l=0;l<5;l++)o.add(rt(ft.sph,xt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const c=rt(ft.cone,xt("#6b4a26"),0,0,1.25,.11,.24,.11);c.rotation.x=Math.PI/2,o.add(c),o.add(rt(ft.sph,Pi("#ff8a2a"),0,.06,1.25,.05)),o.rotation.x=.75,o.rotation.y=Math.PI,t.add(o);for(const l of[-1,1]){const h=us({fur:"#c96a2d"});h.scale.setScalar(.72),h.position.set(l*.72,.05,-.25),h.rotation.y=-l*.5,h.userData.anim.armR.rotation.x=-2.2,t.add(h)}o.userData.keep=!0;for(const l of r)l.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:o,rest:.75},i},elder(){const i=us({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=rt(new Ln(.3,.55,10,1,!0),xt("#5a6b34",{side:rn}),0,.3,0);t.body.add(e),t.head.add(rt(ft.cone,xt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,o=rt(ft.cone,xt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);o.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(o)}const n=new Ht;n.add(rt(ft.cyl,xt("#5a3d24"),0,.25,0,.025,1,.025)),n.add(rt(ft.oct,Pi("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(Ei([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,xt("#5a3d24")))}return Gn(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i}},tb=new Set([Cd.trebuchet]);function fs({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const o=new Ht,a=new Ht;o.add(a);const c=xt(i),l=xt(t);let h;if(s)h=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{h=[];for(let v=0;v<=10;v++){const m=v/10,p=-.6+m*Math.PI*2.3,x=.3-m*.17;h.push([Math.cos(p)*x,.06+m*.1,Math.sin(p)*x-.04])}h.push([0,.3,.02],[0,.42,.03])}a.add(WM(h,.025,.115*r,c));const u=rt(new Wc(.12*r,.2,3,8),c,0,.53,.04);u.rotation.x=.12,a.add(u),a.add(rt(ft.ico,l,0,.5,.12*r,.085*r,.17,.05));const d=new Ht;if(d.position.set(0,.79,.08),a.add(d),e){const v=rt(ft.ico,xt(e),0,-.02,-.07,.21*n,.24*n,.05);d.add(v);for(const m of[-1,1])d.add(rt(ft.sph,xt(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}d.add(rt(ft.ico,c,0,0,.02,.11,.09,.15)),d.add(rt(ft.ico,l,0,-.04,.06,.08,.04,.11));for(const v of[-1,1])d.add(rt(ft.sph,xt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),v*.065,.035,.09,.03)),d.add(rt(ft.sph,xt("#111111"),v*.079,.037,.1,.008,.024,.012));const f=new Ht;f.position.set(0,-.03,.16);for(const v of[-1,1]){const m=rt(ft.cyl,xt("#d0304a"),v*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=v*.3,f.add(m)}f.scale.setScalar(.001),d.add(f);const g=[];for(const v of[-1,1]){const m=new Ht;m.position.set(v*.15*r,.64,.05),m.add(rt(ft.ico,c,0,-.1,0,.045*r,.12,.045*r));const p=new Ht;p.position.set(0,-.21,0),p.add(rt(ft.ico,c,0,0,0,.042*r)),m.add(p),m.userData.hand=p,m.rotation.x=-.9,a.add(m),g.push(m)}return o.userData.anim={kind:"naga",body:a,head:d,tongue:f,armL:g[0],armR:g[1]},o}const eb={scaleguard(){const i=fs({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(rt(ft.cap,Be("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(rt(ft.brim,Be("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(rt(ft.box,Be("#b8862e"),0,.12,-.02,.015,.06,.18)),Gn(t.armR,GM(1.15),.9);const e=wd(.2,Be("#a8762a"),Be("#e0b050"));return Gn(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=fs({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(rt(ft.sph,Pi("#8aff5a"),0,-.04,.16,.035)),t.body.add(rt(ft.ico,xt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(rt(ft.sph,Pi("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=fs({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(rt(ft.oct,xt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=rt(ft.cone,xt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=rt(new bn(.13,.014,4,12,Math.PI*.9),Be("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,Gn(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=fs({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=rt(ft.cone,xt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=rt(ft.cone,xt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(rt(new bn(.06,.015,4,10).rotateX(Math.PI/2),Be("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new Ht,t=new Ht;i.add(t);const e=xt("#4a3a2a"),n=xt("#3a2c20");t.add(rt(ft.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const c of[-1,1])for(const l of[-.45,.45]){const h=Ed(.21,c*.47,.21,l);t.add(h),s.push(h)}const r=rt(ft.ico,xt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const c of[-1,1])t.add(rt(ft.cone,xt("#f4ecd8"),c*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(rt(ft.sph,Pi("#8aff5a"),c*.1,.62,.88,.035));for(const c of[-1,1])t.add(Ei([c*.3,.45,-.3],[c*.2,1.05,-.1],.04,n));const o=new Ht;o.position.set(0,1.05,-.1),o.add(rt(ft.box,e,0,0,.35,.08,.08,.9)),o.add(rt(ft.cap,xt("#3a2c20",{side:rn}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const a=rt(ft.sph,xt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);a.userData.keep=!0,o.add(a),o.rotation.x=-.55,t.add(o);for(let c=0;c<3;c++)t.add(rt(ft.sph,xt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+c*.2,.55,-.55,.08));for(const c of[-1,1]){const l=fs({scale:"#3f8f4a",belly:"#d9cf86"});l.scale.setScalar(.72),l.position.set(c*.72,.05,-.35),l.rotation.y=-c*.5,t.add(l)}o.userData.keep=!0;for(const c of s)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:o,rest:-.55,globe:a},i},hierophant(){const i=fs({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=rt(ft.cone,Be("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(rt(new bn(.05,.014,4,10).rotateX(Math.PI/2),Be("#e0b040"),n*.15,.45,.05));const e=new Ht;return e.add(rt(ft.cyl,xt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(rt(ft.sph,Pi("#c070ff"),0,.82,0,.08)),e.add(rt(new bn(.1,.012,4,14),Be("#e0b040"),0,.82,0)),Gn(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}},nb=new Set,Ka=Object.freeze({squirrel:Cd,serpent:eb}),ib=new Set([...tb,...nb]),Ja=new Map;function Au(i,t,e,n){if(!Object.hasOwn(Ka,i)||!Object.hasOwn(Ka[i],t))throw new Error(`no figure for unit "${t}" in the "${i}" kit`);const s=`${i}/${t}`,r=Ka[i][t],o=ib.has(r),a=new Ht,c=VM(e.base,n);a.add(c);const l=o||!Ja.has(s),h=l?r():Ru(Ja.get(s));h.position.y=e.big?.09:.06,h.userData.y0=h.position.y,a.add(h),a.userData.fig=h,a.userData.anim=h.userData.anim,a.userData.phase=Math.random()*10,a.userData.drawn=o,Sc(c),l&&Sc(h),a.traverse(f=>{f.isMesh&&(f.castShadow=!0)}),c.traverse(f=>{f.isMesh&&(f.receiveShadow=!0)});const u=new Set,d=f=>f.traverse(g=>g.isMesh&&u.add(g.geometry));return d(c),o&&d(h),a.userData.own=[...u],l&&!o&&Ja.set(s,Ru(h)),a}function sb(i){for(const t of i.userData.own??[])t.dispose();i.userData.own=[]}function Ru(i){const t=new Map;i.traverse(o=>{t.set(o,o.userData),o.userData={}});let e;try{e=i.clone(!0)}finally{for(const[o,a]of t)o.userData=a}const n=new Map,s=(o,a)=>{n.set(o,a),o.children.forEach((c,l)=>s(c,a.children[l]))};s(i,e);const r=o=>o!=null&&o.isObject3D?n.get(o)??o:Array.isArray(o)?o.map(r):o&&typeof o=="object"?Object.fromEntries(Object.entries(o).map(([a,c])=>[a,r(c)])):o;for(const[o,a]of t)n.get(o).userData=r(a);return e}let rb=null;const ob=()=>rb??(rb={ring:new Fi(.88,1,48).rotateX(-Math.PI/2),hit:new Ze(1,1,1,12)}),ao=new C;class Pd{constructor({scene:t,labels:e,fx:n,mirror:s,colorOf:r,W:o}){this.scene=t,this.W=o,this.labels=e,this.effects=n,this.mirror=s,this.colorOf=r,this.views=new Map,this.gen=0}get(t){return this.views.get(t)}unit(t){return this.views.get(t).u}shown(t){return this.mirror().units[t]}standing(t){const e=this.shown(t);return this.views.get(t).models.filter((n,s)=>e.models[s].alive)}top(t){const e=this.shown(t).pos;return{x:e.x,y:this.unit(t).t.big?2.6:1.6,z:e.z}}gone(t,e,n){return this.views.get(t)!==e||this.gen!==n}make(t,e,n){const s=-e*Math.PI/2,r=this.shown(t.id),o={id:t.id,u:t,edge:e,color:n,facing:s,moving:!1,at:null,models:[]},a=Tn[t.race].look.models;for(let h=0;h<t.t.models;h++){if(!r.models[h].alive){o.models.push({mesh:null,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0});continue}const u=Au(a,t.key,t.t,n);this.scene.add(u),o.models.push({mesh:u,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0})}const{ring:c,hit:l}=ob();return o.ring=new Gt(c,new We({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),o.ring.position.y=.04,o.ring.renderOrder=2,this.scene.add(o.ring),o.hit=new Gt(l,new We({visible:!1})),o.hit.userData.id=t.id,this.scene.add(o.hit),o.label=document.createElement("div"),o.label.className=`ulabel s${t.side}`,this.labels.appendChild(o.label),this.views.set(t.id,o),this.disc(t.id),this.stands(o,r.alive>0),this.place(o),o}stands(t,e){t.ring.visible=e,t.hit.visible=e,e&&!t.hit.parent&&this.scene.add(t.hit),e||this.scene.remove(t.hit)}place(t){const e=this.shown(t.id);e.models.forEach((n,s)=>{const r=t.models[s];r.mesh&&(r.x=e.pos.x+n.ox,r.z=e.pos.z+n.oz,r.mesh.position.set(r.x,0,r.z),r.mesh.rotation.y=r.yaw)})}unfigure(t){t.mesh&&(this.scene.remove(t.mesh),sb(t.mesh))}drop(t){for(const e of t.models)this.unfigure(e);this.scene.remove(t.ring,t.hit),t.ring.material.dispose(),t.hit.material.dispose(),t.label.remove(),this.views.delete(t.id)}dispose(){for(const t of[...this.views.values()])this.drop(t);this.gen++}sync(t,e){this.gen++;const n=this.mirror(),s=new Set(t.map(r=>r.id));for(const r of[...this.views.values()])s.has(r.id)||this.drop(r);for(const r of t){const o=e(r.side),a=this.colorOf(r.side);let c=this.views.get(r.id);if(c&&(c.u.t!==r.t||c.u.side!==r.side||c.edge!==o||c.color!==a)&&(this.drop(c),c=null),!c){this.make(r,o,a);continue}const l=n.units[r.id],h=Tn[r.race].look.models;c.at=null,c.moving=!1,c.facing=-o*Math.PI/2,c.models.forEach((u,d)=>{if(!l.models[d].alive){this.unfigure(u),c.models[d]={mesh:null,x:u.x,z:u.z,yaw:c.facing,lunge:0,lungeDir:0,lift:0};return}if(!u.mesh||u.dying||u.fleeing||!u.mesh.parent){this.unfigure(u);const g=Au(h,r.key,r.t,a);this.scene.add(g),u=c.models[d]={mesh:g,x:0,z:0,yaw:c.facing,lunge:0,lungeDir:0,lift:0}}Object.assign(u,{yaw:c.facing,look:void 0,lunge:0,lift:0,flash:0,flying:!1,moving:!1}),u.mesh.position.y=0,u.mesh.userData.fig.position.x=0;const f=u.mesh.userData.anim;f!=null&&f.throwArm&&(f.throwArm.rotation.x=f.rest),f!=null&&f.globe&&(f.globe.visible=!0)}),this.disc(r.id),this.stands(c,l.alive>0),this.place(c)}this.labelAll()}disc(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=e.at??s.pos;e.ring.scale.setScalar(s.r+.18);const o=n.t.big?2.4:n.t.fly?1.8:1.3;e.hit.scale.set(s.r,o,s.r),e.ring.position.x=e.hit.position.x=r.x,e.ring.position.z=e.hit.position.z=r.z,e.hit.position.y=e.hit.scale.y/2}label(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=s.models.filter(a=>a.alive);let o=`<span class="nm">${n.t.short}</span>`;n.t.models>1?o+=`<span class="ct">${s.alive}/${n.t.models}</span>`:o+=`<span class="ct">${r[0]?r[0].w:0}/${n.t.W}♥</span>`,s.mesmerized&&(o+='<span class="st" title="Mesmerized">🌀</span>'),s.alive>0&&s.engaged&&(o+='<span class="st" title="In combat">⚔</span>'),e.label.innerHTML=o,e.label.style.display=s.alive>0?"":"none"}labelAll(){for(const t of this.views.keys())this.label(t)}paintRings(t){for(const e of this.views.values()){if(!(this.shown(e.id).alive>0))continue;const[n,s]=t(e);e.ring.material.opacity=s,e.ring.material.color.set(n)}}pickables(){return[...this.views.values()].filter(t=>this.shown(t.id).alive>0).map(t=>t.hit)}animate(t,e,{fast:n,camera:s,sel:r}){const o=this.mirror();for(const a of this.views.values()){const c=a.u,l=o.units[c.id],h=a.at??l.pos;for(const[u,d]of l.models.entries()){const f=a.models[u];if(!d.alive&&!f.dying)continue;const g=f.mesh.userData.anim;if(d.alive){const p=h.x+d.ox,x=h.z+d.oz,_=1-Math.exp(-t*(a.moving?16:7)),y=f.x,R=f.z;f.x+=(p-f.x)*_,f.z+=(x-f.z)*_;const S=Math.hypot(f.x-y,f.z-R)/Math.max(t,1e-4),E=S>.6?Math.atan2(f.x-y,f.z-R):f.look??a.facing;f.yaw+=SM(E-f.yaw)*(1-Math.exp(-t*8)),f.moving=S>.6;let O=0,M=0;if(f.lunge>0){f.lunge=Math.max(0,f.lunge-t*2.5);const w=Math.sin((1-f.lunge)*Math.PI)*.35;O=Math.sin(f.lungeDir)*w,M=Math.cos(f.lungeDir)*w}f.mesh.position.set(f.x+O,f.lift||0,f.z+M),f.mesh.rotation.y=f.yaw}if(!g||!d.alive)continue;const v=e+f.mesh.userData.phase,m=f.mesh.userData.fig;if(g.kind==="squirrel"){const p=f.moving?Math.abs(Math.sin(v*13))*.16:0;m.position.y=m.userData.y0+p,m.scale.y=1+(f.moving?0:Math.sin(v*2.4)*.018),m.rotation.x=f.moving?.12:0}else if(g.kind==="naga")m.rotation.z=Math.sin(v*(f.moving?9:1.4))*(f.moving?.12:.035),m.scale.y=1+Math.sin(v*1.4)*.015;else if(g.kind==="machine"&&f.moving)for(const p of g.wheels)p.rotation.x+=t*6;g.gem&&(g.gem.rotation.y=v*2),f.flash>0&&(f.flash-=t,m.position.x=Math.sin(e*60)*.04*(f.flash>0?1:0))}if(l.alive>0&&!n){ao.set(h.x,c.t.big?2.7:c.t.fly?2.3:1.7,h.z).project(s);const u=ao.z<1;a.label.style.transform=`translate(${(ao.x*.5+.5)*innerWidth}px, ${(-ao.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,a.label.style.visibility=u&&o.stage!=="title"?"visible":"hidden",a.label.classList.toggle("sel",c.id===r)}}}wounded(t){const e=this.views.get(t.u),n=e.u,s=e.models[t.m];this.effects.text({x:s.x,y:n.t.big?2.3:1.3,z:s.z},`-${t.dmg}`,"#ff5a4a",{size:n.t.big?24:18}),s.flash=.4}slain(t,e){const n=this.views.get(t.u),s=n.u,r=n.models[t.m];this.effects.text({x:r.x,y:s.t.big?2.3:1.3,z:r.z},`-${t.dmg}`,"#ff5a4a",{size:s.t.big?24:18}),r.dying=!0;const o=Tn[s.race].look;Ee.voice(o.voice);const a=r.mesh.userData.fig,c=t.by===null?null:e.units[t.by],l=c?Math.atan2(r.x-c.pos.x,r.z-c.pos.z)-r.yaw:0,h=Math.sin(l)>=0?1:-1;this.effects.debris(r.x,.5,r.z,o.gore,6,{power:2,size:.07}),Te(.6,u=>{a.rotation.z=h*u*1.45,a.position.y=(s.t.big?.09:.06)+Math.sin(u*Math.PI)*.15},Ss).then(()=>Rn(1.4)).then(()=>Te(.8,u=>r.mesh.position.y=-u*1.4)).then(()=>{this.unfigure(r),r.dying=!1})}fled(t){const e=this.views.get(t.u),n=e.models[t.m];n.dying=!0;const s=e.edge,r=s*(this.W/2+3),o=n.x,a=n.z;n.fleeing=!0,this.effects.text({x:n.x,y:1.4,z:n.z},"flees!","#e0e0e0",{size:14}),n.yaw=s*Math.PI/2,Te(2.2,c=>{n.x=fn(o,r,c),n.z=a,n.mesh.position.set(n.x,Math.abs(Math.sin(c*30))*.2,n.z),n.mesh.rotation.y=n.yaw}).then(()=>{this.unfigure(n),n.dying=!1})}destroyed(t,e){const n=this.views.get(t.u),s=n.u,r=e.units[t.u].pos;n.label.style.display="none",n.ring.visible=!1,n.hit.visible=!1,this.scene.remove(n.hit),this.effects.text({x:r.x,y:2.2,z:r.z},`${s.t.short} destroyed`,this.colorOf(t.by!==null?this.unit(t.by).side:1-s.side),{size:20,life:2})}face(t){const e=this.views.get(t.u),n=this.shown(t.tg).pos,s=this.shown(t.u).pos;e.facing=Math.atan2(n.x-s.x,n.z-s.z);for(const r of e.models)r.look=Math.atan2(n.x-r.x,n.z-r.z)}shout(t){const e=this.unit(t.u);t.ok?this.effects.text(this.top(t.u),"CHARGE!",this.colorOf(e.side),{size:22}):this.effects.text(this.top(t.u),"Charge failed","#d0d0d0")}lunge(t){const e=this.views.get(t.tg),n=this.gen,s=this.shown(t.tg).pos;for(const r of this.standing(t.u))r.lunge=1,r.lungeDir=Math.atan2(s.x-r.x,s.z-r.z);Ee.thwack(),t.hits&&Rn(mi.dice(t.n)).then(()=>{if(!this.gone(t.tg,e,n))for(let r=0;r<Math.min(t.hits,8);r++){const o=this.standing(t.tg)[r%Math.max(1,this.shown(t.tg).alive)];if(o)for(let a=0;a<4;a++)this.effects.mote({x:o.x,y:.6,z:o.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}})}async walk(t,e,n){const s=this.views.get(t.u),r=this.gen,{path:o,L:a,speed:c,fly:l,smashes:h}=t;if(t.stomp&&Ee.boom(.4),s.moving=!0,l)for(const m of s.models)m.flying=!0;const u=[];let d=0;for(let m=1;m<o.length;m++){const p=Vt(o[m].x-o[m-1].x,o[m].z-o[m-1].z);u.push({a:o[m-1],b:o[m],s:d,l:p}),d+=p}let f=0;const g=({ev:m})=>{n(m),this.effects.shake=Math.max(this.effects.shake,.08)},v=()=>this.gone(t.u,s,r);if(await Te(a/c+.15,m=>{if(v())return;const p=Math.min(a,m*(a+c*.15)),x=u.find(y=>p<=y.s+y.l)||u[u.length-1],_=x.l>0?(p-x.s)/x.l:1;if(s.facing=Math.atan2(x.b.x-x.a.x,x.b.z-x.a.z),s.at={x:fn(x.a.x,x.b.x,_),z:fn(x.a.z,x.b.z,_)},this.disc(t.u),l)for(const y of s.models)y.lift=Math.sin(Math.min(1,p/a)*Math.PI)*Math.min(3,a*.3);for(;f<h.length&&h[f].s<=p;)g(h[f++])},Mc),!v()){for(;f<h.length;)g(h[f++]);if(s.at=null,this.disc(t.u),s.moving=!1,l)for(const m of s.models)m.flying=!1,m.lift=0;await Rn(.15)}}}class ab{constructor(t,{W:e,H:n,grid:s}){this.scene=t,this.data=new Uint8Array(s.nx*s.nz*4);const r=this.tex=new Zx(this.data,s.nx,s.nz,hn);r.magFilter=Ke,r.minFilter=Ke;const o=this.mesh=new Gt(new hi(e,n).rotateX(-Math.PI/2),new We({map:r,transparent:!0,depthWrite:!1,toneMapped:!1}));o.position.y=.035,o.renderOrder=2,o.visible=!1,t.add(o);const a=this.rangeRing=new Gt(new Fi(.985,1,96).rotateX(-Math.PI/2),new We({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));a.position.y=.04,a.visible=!1,t.add(a);const c=this.pathLine=new po(new de,new zo({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));c.visible=!1,c.renderOrder=4,t.add(c);const l=this.ghost=new Gt(new Fi(.9,1,40).rotateX(-Math.PI/2),new We({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));l.position.y=.05,l.visible=!1,t.add(l)}reach(t,e){const n=t.u.flags.advanced,{u:s,res:r,mode:o,endForbid:a}=t,c=new Uint8Array(e.N);for(let l=0;l<e.N;l++)isFinite(r.dist[l])&&e.standable(l,s.r,o==="wreck"?"wreck":"walk",a)&&(c[l]=1);this.mask(c,t.fallback?[255,120,90]:n?[255,190,70]:[90,180,255],e)}mask(t,e,n,s=80){const r=this.data;r.fill(0);for(let o=0;o<n.N;o++){if(!t[o])continue;const a=o%n.nx,c=o/n.nx|0,l=a===0||c===0||a===n.nx-1||c===n.nz-1||!t[o-1]||!t[o+1]||!t[o-n.nx]||!t[o+n.nx],h=((n.nz-1-c)*n.nx+a)*4;r[h]=e[0],r[h+1]=e[1],r[h+2]=e[2],r[h+3]=l?210:n.diff[o]?Math.round(s*.7):s}this.tex.needsUpdate=!0,this.mesh.visible=!0}clear(){this.mesh.visible=!1,this.pathLine.visible=!1,this.rangeRing.visible=!1}range({x:t,z:e},n,s,r){const o=this.rangeRing;o.position.x=t,o.position.z=e,o.scale.setScalar(n+s),o.material.color.set(r),o.visible=!0}path(t){this.pathLine.geometry.setFromPoints(t.map(e=>new C(e.x,.08,e.z))),this.pathLine.visible=!0}peer(t,e=null,n="#ffffff"){if(!t){this.peerRing&&(this.peerRing.visible=this.peerLine.visible=!1);return}if(!this.peerRing){const o=Array.from({length:49},(c,l)=>new C(Math.cos(l/48*Math.PI*2),0,Math.sin(l/48*Math.PI*2))),a=()=>new m_({color:"#ffffff",dashSize:.35,gapSize:.25,transparent:!0,opacity:.9,toneMapped:!1});this.peerRing=new po(new de().setFromPoints(o),a()),this.peerRing.material.dashSize=.12,this.peerRing.material.gapSize=.08,this.peerRing.computeLineDistances(),this.peerLine=new po(new de,a());for(const c of[this.peerRing,this.peerLine])c.renderOrder=4,this.scene.add(c)}const s=this.peerRing,r=this.peerLine;s.position.set(t.x,.07,t.z),s.scale.setScalar(t.r*1.25),s.material.color.set(n),s.visible=!0,r.visible=!!e,e&&(r.geometry.setFromPoints([new C(t.x,.09,t.z),new C(e.x,.09,e.z)]),r.computeLineDistances(),r.material.color.set(n))}ghostAt(t,e,n){const s=this.ghost;s.position.x=t.x(e),s.position.z=t.z(e),s.scale.setScalar(n),s.visible=!0}}const Cu=900,Pu=700,Lu=260,ds=new re,Du=new Cn,cb=new zs,yo=new C,lb=new C,Iu=new qt;class Za{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(Wp),t.frustumCulled=!1,ds.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,ds),t.setColorAt(n,Iu.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,Iu.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){ds.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,ds),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,o=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);Du.setFromEuler(cb.set(n.rx,n.ry,0)),ds.compose(yo.set(n.x,n.y,n.z),Du,lb.set(o*n.sx,o*n.sy,o*n.sz)),this.mesh.setMatrixAt(n.i,ds),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function Qa(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function Uu(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let o=0;o<90;o++){const a=Math.random()*Math.PI*2,c=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(a)*c,64+Math.sin(a)*c,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new kc(e);return r.colorSpace=Se,r}class hb{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new sr(new Pn(1,1,1),new Mn({roughness:.85}),Cu);s.castShadow=!0;const r=new sr(new Dn(1,0),new We({toneMapped:!1}),Pu),o=new sr(new Dn(1,1),new p_({transparent:!0,opacity:.55,depthWrite:!1}),Lu);t.add(s,r,o),this.cubes=new Za(s,Cu),this.glow=new Za(r,Pu),this.puff=new Za(o,Lu),this.lights=[];for(let a=0;a<3;a++){const c=new x_(16755285,0,14,1.6);c.position.set(0,-50,0),t.add(c),this.lights.push({l:c,until:0})}this.scorchTex=Uu("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=Uu("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new ki(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new on(1,20,12),this.ringGeo=new Fi(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new ki(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(Qa(t))}mote(t){this.glow.spawn(Qa({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(Qa({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:o,power:a=7,size:c=.16}={}){for(let l=0;l<r;l++){let h=Math.random()-.5,u=Math.random()-.5;o&&(h+=(t-o.x)*.35,u+=(n-o.z)*.35);const d=Math.hypot(h,u)||1,f=a*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:h/d*f,vy:3+Math.random()*a,vz:u/d*f,size:c*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,o=1){for(let a=0;a<r;a++){const c=Math.random()*Math.PI*2,l=1+Math.random()*4*o;this.cube({x:t+Math.cos(c)*.5*o,y:e+Math.random()*o,z:n+Math.sin(c)*.5*o,vx:Math.cos(c)*l,vy:2+Math.random()*4,vz:Math.sin(c)*l,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,o){const a=this.lights.reduce((c,l)=>c.until<l.until?c:l);a.until=we.time+o,a.l.color.set(s),a.l.position.set(t,e,n),Te(o,c=>a.l.intensity=r*(1-c)*(1-c))}decal(t,e,n,s,r=.8){const o=new Gt(this.decalGeo,new We({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(o.position.set(t,.015+this.decals.length*4e-4,e),o.rotation.y=Math.random()*6,o.scale.setScalar(n),o.renderOrder=1,this.scene.add(o),this.decals.push(o),this.decals.length>40){const a=this.decals.shift();this.scene.remove(a),a.material.dispose()}return o}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,n,s,{life:r=1.2,fill:o=.18,hold:a=!1}={}){const c=new Ht,l=new Gt(this.ringGeo,new We({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),h=new Gt(this.discGeo,new We({color:s,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1}));c.add(l,h),c.position.set(t,.05,e),c.scale.setScalar(n),c.renderOrder=3,this.scene.add(c);const u=()=>{this.scene.remove(c),l.material.dispose(),h.material.dispose()};return a||Te(r,d=>{l.material.opacity=.95*(1-d),h.material.opacity=o*(1-d)}).then(u),c.userData.remove=u,c}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],o=new Gt(this.flashGeo,new We({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));o.position.set(t,.3,e),this.scene.add(o),Te(.45,c=>{o.scale.setScalar(.2+n*.85*Ss(c)),o.material.opacity=.9*(1-c)}).then(()=>{this.scene.remove(o),o.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const a=Math.round(18+n*14);for(let c=0;c<a;c++){const l=Math.random()*Math.PI*2,h=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(l)*h,vy:2+Math.random()*6,vz:Math.sin(l)*h,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[c%r.glow.length],life:.5+Math.random()*.7})}for(let c=0;c<6+n*3;c++){const l=Math.random()*Math.PI*2,h=Math.random()*n*.6;this.smoke({x:t+Math.cos(l)*h,y:.3+Math.random()*.4,z:e+Math.sin(l)*h,vx:Math.cos(l)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(l)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:o=null,spin:a=10}={}){const c=Math.hypot(e.x-t.x,e.z-t.z),l=c*s;this.scene.add(n);let h=0;await Te(Math.max(.12,c/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*l*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=a*.016,n.rotation.z+=a*.011,o&&u-h>.03&&(h=u,o(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:o=1.4}={}){const a=document.createElement("div");a.className="float-text",a.textContent=e,a.style.color=n,a.style.fontSize=s+"px",this.overlay.appendChild(a),this.texts.push({el:a,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:o})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return yo.set(s.x,s.y+s.rise*Ss(r),s.z).project(this.camera),s.el.style.transform=`translate(${(yo.x*.5+.5)*e}px, ${(-yo.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}const ub=()=>({acorn:new on(.07,6,5),dart:new Ln(.03,.3,4).rotateX(Math.PI/2),javelin:new Ze(.02,.02,.9,4).rotateX(Math.PI/2),spit:new Dn(.08,0),bomb:new on(.11,8,6),pinecone:new Ln(.2,.42,7),acid:new on(.24,12,8)}),Ou=new Map,Nu=i=>Ou.get(i)??Ou.set(i,new We({color:i,toneMapped:!1})).get(i);class fb{constructor({scene:t,fx:e,units:n}){this.scene=t,this.effects=e,this.units=n,this.projGeo=ub(),this.thorn=null,this.blastMarker=null,this.spikesOf=new Map}projectileStyle(t){const e=this.effects,n=this.projGeo;switch(t){case"acorn":return{mesh:new Gt(n.acorn,xt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new Gt(n.dart,xt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new Gt(n.javelin,xt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new Gt(n.spit,Nu("#9aff5a")),arc:.12,speed:18,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new Gt(n.bomb,xt("#7a4a22")),arc:.45,speed:14,trail:s=>e.mote({x:s.x,y:s.y+.1,z:s.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new Gt(n.pinecone,xt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:s=>{e.mote({x:s.x,y:s.y,z:s.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),e.smoke({x:s.x,y:s.y,z:s.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new Gt(n.acid,Nu("#8aff5a")),arc:.5,speed:15,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new Gt(n.acorn,xt("#888"))}}fly(t,e,n){return this.effects.projectile(t,e,this.projectileStyle(n))}async volley(t){const e=this.units,n=this.effects,s=e.unit(t.u),r=e.unit(t.tg),o=e.get(t.u),a=e.gen,c=()=>e.gone(t.u,o,a),l=e.standing(t.u),h=e.standing(t.tg),u=[],d=Math.min(10,t.n);for(let f=0;f<d;f++){const g=l[f%l.length],v=h[Math.random()*h.length|0],m={x:g.x,y:Kc(s)*.8+g.lift,z:g.z},p={x:v.x+(Math.random()-.5)*.6,y:Jc(r)*.8,z:v.z+(Math.random()-.5)*.6};u.push(Rn(f*.06).then(()=>{if(!c())return Ee.shot(),this.fly(m,p,t.fx)}).then(()=>{if(!c())for(let x=0;x<5;x++)n.mote({x:p.x,y:p.y,z:p.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:t.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(u)}aimed(t){this.blastMarker=this.effects.ring(t.x,t.z,t.r,"#ffffff",{hold:!0,fill:.12})}async scattered(t){const e=this.blastMarker;this.effects.text({x:t.from.x,y:1.5,z:t.from.z},`scatter ${t.d}"`,"#ffd36e",{size:15}),await Te(.35,n=>e==null?void 0:e.position.set(fn(t.from.x,t.to.x,n),.05,fn(t.from.z,t.to.z,n)),Ss)}async fired(t){var r;const e=this.units,n=e.get(t.u),s=e.gen;await this.artilleryFire(t),!e.gone(t.u,n,s)&&((r=this.blastMarker)==null||r.userData.remove(),this.blastMarker=null)}async artilleryFire(t){const e=this.units,n=e.unit(t.u),s=e.get(t.u),r=e.gen,o=t.to,a=()=>e.gone(t.u,s,r),c=e.standing(t.u)[0],l=c.mesh.userData.anim;if(l!=null&&l.throwArm){const d=l.rest;if(Ee.thwack(),Te(.25,f=>l.throwArm.rotation.x=d-2.1*Ss(f)).then(()=>Te(.8,f=>l.throwArm.rotation.x=d-2.1*(1-f))),l.globe&&(l.globe.visible=!1),await Rn(.15),a())return}else c.lunge=1,c.lungeDir=Math.atan2(o.x-c.x,o.z-c.z);const h={x:c.x,y:n.t.big?1.8:.9,z:c.z},u={x:o.x,y:.15,z:o.z};Ee.shot(),await this.fly(h,u,t.fx),!a()&&l!=null&&l.globe&&(l.globe.visible=!0)}landed(t){const e=this.effects;t.fx!=="thorns"&&(e.explode(t.x,t.z,t.r,t.fx==="acid"?"acid":"fire"),Ee.boom(t.r/2)),e.ring(t.x,t.z,t.r,t.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2})}cast(){Ee.magic()}fizzled(t){Ee.fizzle(),this.effects.text(this.units.top(t.u),"Fizzle…","#c8b8ff")}async thorns(t){const e=this.units,n=this.effects,s=e.get(t.u),r=e.gen,o=s.models[0].mesh.userData.anim.gem;if(o){const c=new C;o.getWorldPosition(c);for(let l=0;l<20;l++)n.mote({x:c.x,y:c.y,z:c.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const a=[];this.thorn??(this.thorn=new Ln(.12,1,5));for(let c=0;c<26;c++){const l=Math.random()*Math.PI*2,h=Math.sqrt(Math.random())*t.r,u=new Gt(this.thorn,xt(c%3?"#5a7a2a":"#7a5a2a"));u.position.set(t.x+Math.cos(l)*h,-.6,t.z+Math.sin(l)*h),u.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),u.scale.set(1,.6+Math.random()*1.1,1),u.castShadow=!0,this.scene.add(u),a.push(u)}this.spikesOf.set(t.u,a),await Te(.3,c=>a.forEach(l=>l.position.y=-.6+Ss(c)*(.3+l.scale.y*.4))),!e.gone(t.u,s,r)&&n.explode(t.x,t.z,t.r,"thorns")}faded(t){const e=this.spikesOf.get(t.u)??[];this.spikesOf.delete(t.u),Te(1.2,n=>e.forEach(s=>s.position.y-=.02*n)).then(()=>e.forEach(n=>this.scene.remove(n)))}async gaze(t){const e=this.units,n=this.effects,s=e.get(t.tg),r=e.gen,o=()=>e.gone(t.tg,s,r),a=e.top(t.u),c=e.top(t.tg),l=[];for(let u=0;u<=16;u++){const d=u/16;l.push(Rn(d*.3).then(()=>o()||n.mote({x:fn(a.x,c.x,d),y:fn(a.y,c.y,d)+Math.sin(d*Math.PI)*.8,z:fn(a.z,c.z,d),size:.09,color:"#c070ff",life:.7,g:0})))}if(await Promise.all(l),o())return;const h=e.shown(t.tg);for(let u=0;u<3;u++)n.ring(h.pos.x,h.pos.z,h.r*(.6+u*.35),"#c070ff",{life:1.2+u*.3,fill:.08})}mesmerized(t){this.effects.text(this.units.top(t.tg),"Mesmerized!","#e0a0ff",{size:20})}held(){return{marker:!!this.blastMarker,thorns:[...this.spikesOf.values()].reduce((t,e)=>t+e.length,0)}}clear(){var t;(t=this.blastMarker)==null||t.userData.remove(),this.blastMarker=null;for(const e of this.spikesOf.values())for(const n of e)this.scene.remove(n);this.spikesOf.clear()}}class db{constructor({lowfi:t=!1,fast:e=!1,W:n,H:s,deploy:r,edges:o,objectives:a,range:c,colorOf:l}){this.fast=e,this.stage=new TM({lowfi:t,fast:e});const{renderer:h,scene:u}=this.stage;this.renderer=h,this.scene=u,this.rig=new kM(h),this.camera=this.rig.camera,this.controls=this.rig.controls,this.stage.light(),this.effects=new hb(u,this.camera,this.stage.overlay),this.table=new HM(u,h,{W:n,H:s,deploy:r,edges:o}),this.objectives=new $M(u,a,c,l),this.terrain=new Rd(u,this.effects)}figures({mirror:t,colorOf:e,W:n,H:s,grid:r}){this.units=new Pd({scene:this.scene,labels:this.stage.overlay,fx:this.effects,mirror:t,colorOf:e,W:n}),this.shots=new fb({scene:this.scene,fx:this.effects,units:this.units}),this.overlay=new ab(this.scene,{W:n,H:s,grid:r})}handlers({localSeats:t}){const{rig:e,units:n,shots:s,terrain:r}=this;return{pause:o=>Rn(mi.pause(o.s)),focus:(o,a)=>e.focus(o.x,o.z,{stage:a.stage,active:a.active,localSeats:t()}),"unit.place":o=>n.disc(o.u),"unit.formation":o=>{n.disc(o.u),n.label(o.u)},"unit.wound":o=>n.wounded(o),"unit.slain":(o,a)=>n.slain(o,a),"unit.flee":o=>n.fled(o),"unit.destroyed":(o,a)=>n.destroyed(o,a),"unit.face":o=>n.face(o),"unit.move":(o,a)=>n.walk(o,a,c=>{for(const l of c)r.apply(l,a)}),melee:o=>n.lunge(o),"charge.result":o=>n.shout(o),volley:o=>s.volley(o),"blast.aim":o=>s.aimed(o),"blast.scatter":o=>s.scattered(o),"blast.fire":o=>s.fired(o),"blast.land":o=>s.landed(o),"spell.cast":()=>s.cast(),"spell.fizzle":o=>s.fizzled(o),"spell.thorns":o=>s.thorns(o),"spell.fade":o=>s.faded(o),"spell.gaze":o=>s.gaze(o),"spell.mesmerized":o=>s.mesmerized(o),status:()=>n.labelAll(),objectives:()=>{},"terrain.clear":(o,a)=>r.apply(o,a),"terrain.add":(o,a)=>r.apply(o,a),"terrain.hurt":(o,a)=>r.apply(o,a),"terrain.destroy":(o,a)=>r.apply(o,a),"terrain.collapse":(o,a)=>r.apply(o,a),"terrain.rubble":(o,a)=>r.apply(o,a)}}rebuild(t,e,n={}){const{chunks:s=t.terrain.chunks,terrain:r=this.terrain,units:o=this.units,shots:a=this.shots,effects:c=this.effects}=n;r.sync(s),o.sync(t.units,l=>vr(t,l)),a.clear(),c.clearDecals()}text(t,e,n){this.effects.text(t,e,n)}run({mirror:t,sel:e}){const{effects:n,units:s,objectives:r,camera:o}=this;this.stage.run({parts:(a,c)=>{n.update(a),s.animate(a,c,{fast:this.fast,camera:o,sel:e()}),r.animate(a,c,t().owners)},rig:this.rig,shake:()=>n.shake})}}class pb{constructor({camera:t,units:e,board:n,unitOf:s}){this.camera=t,this.units=e,this.board=n,this.unitOf=s,this.ray=new M_,this.ptr=new pt}pick(t){const{ray:e,ptr:n}=this;n.set(t.clientX/innerWidth*2-1,-(t.clientY/innerHeight)*2+1),e.setFromCamera(n,this.camera);const s=e.intersectObjects(this.units.pickables(),!1),r=s.length?this.unitOf(s[0].object.userData.id):null,o=e.intersectObject(this.board,!1)[0];return{unit:r,ground:o?o.point:null}}}const zu=new WeakMap;function mb(i){var n;const t=(n=i.G)==null?void 0:n.pending;if((t==null?void 0:t.k)!=="chargeEnd")return null;let e=zu.get(t);return e||(e=i.preview((s,r)=>{const o=s.units.find(l=>l.id===t.u),a=s.units.find(l=>l.id===t.tg),c=r.chargePlan(s,o,a);return{seat:t.seats[0],u:o,tg:a,rolled:t.rolled,cell:t.cell,plan:c,ok:r.chargeSpots(c,t.rolled)}}),zu.set(t,e)),e}function ku(i,t,e,n,s=2.4){let r=-1,o=s;for(let a=0;a<i.N;a++){if(!t[a])continue;const c=Vt(i.x(a)-e,i.z(a)-n);c<o&&(o=c,r=a)}return r}const gb=-1,vb=i=>({t:"chargeEnd",c:i});function xb(i,t,e,n){return i((s,r)=>{const o=r.freeSpot(s,t,e.x,e.z,n,s.units.filter(a=>a!==t));return o&&Math.hypot(o.x-e.x,o.z-e.z)<2.5?s.nav.index(o.x,o.z):-1})}const _b=(i,t)=>({t:"place",u:i.id,c:t}),yb=(i,t)=>i((e,n)=>n.movePlan(e,t,t.flags.advanced?t.flags.advRoll:0)),Mb=(i,t,e)=>i((n,s)=>s.nearestValid(n,t,e.x,e.z));function bb(i,t,e,n,s,r){const o=t.nearestValid(i,e,s.x,s.z);return o<0?"":(r(i.nav.path(e.res,o,n.r,e.mode==="fly"?null:e.forbid),o,n.r),`${e.res.dist[o].toFixed(1)}" of ${e.max}"`)}const Sb=(i,t)=>({t:"move",u:i.id,c:t}),wb=i=>({t:"advance",u:i.id});class Eb{constructor(t){this.el=t}hide(){this.el.style.display="none"}show(t,e){const n=this.el;n.innerHTML=t,n.style.display="block",n.style.left=e.x+16+"px",n.style.top=e.y+14+"px"}}function Tb(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(Bi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(Bi(n.spell)*100)}%)`);const r=Ps(i,n,!1),o=Er(n.S,t.t.T,n.poison),a=Tr(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${o}+ · save ${a>6?"—":a+"+"}`);const c=[];if(c.push(`${e.range.toFixed(1)}"`),e.cover&&c.push("cover"),e.visible?e.seen<e.total&&c.push(`${e.seen}/${e.total} visible`):c.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&c.push("moved (heavy −1)"),!n.blast){const l=Co(r,e.need,n,t,e.cover);c.push(`≈${l.kills.toFixed(1)} slain`)}return s.push(c.join(" · ")),s.join("<br>")}function Ab(i,t,e,n){const s=t.shotInfo(i,e,n);return s.ok?Tb(e,n,s):`✖ ${s.why}`}const Rb=(i,t)=>({t:"shoot",u:i.id,tg:t.id});function Cb(i,t,e,n){if(!t.chargeTargets(i,e).includes(n))return`✖ out of charge range (${t.gap(e,n).toFixed(1)}")`;const s=t.chargePlan(i,e,n);return s?`Charge: need ${s.need}" on 2D6 — ${Math.round(Bi(s.need)*100)}%`:"✖ no route"}const Pb=(i,t)=>({t:"charge",u:i.id,tg:t.id});class Lb{constructor({flow:t,view:e,card:n,tooltip:s,picker:r}){this.flow=t,this.view=e,this.card=n,this.tooltip=s,this.picker=r,this.sel=null,this.reach=null,this.hover=null,this.hoverPick=null,this.mouse=null,this.pickShown=null,this.downAt=null}get session(){return this.flow.session}get G(){return this.flow.G}localSeat(){return this.session?this.session.decisionFor():-1}localDecision(){return this.localSeat()>=0?this.G.pending:null}mode(){return this.flow.player.idle&&this.localSeat()>=0?this.G.pending.k:"watch"}deploySeat(){var t;return((t=this.localDecision())==null?void 0:t.k)==="deploy"?this.localSeat():-1}myTurn(){return this.mode()==="phase"}picking(){return this.mode()==="chargeEnd"?mb(this.session):null}ask(t){return this.session.preview(t)}state(){return{idle:this.flow.player.idle,decision:this.localDecision(),mode:this.mode(),deploy:this.deploySeat(),sel:this.sel,pick:this.picking(),hover:this.hover}}send(t,e){const n=this.session,s=n?n.legal(t,e):"no battle";return s||(n.submit(t,e),this.flow.refreshUI(),null)}moveTo(t,e){return this.view.overlay.clear(),this.send(this.localSeat(),Sb(t,e))}advance(t){return this.send(this.localSeat(),wb(t))}shoot(t,e){return this.send(this.localSeat(),Rb(t,e))}charge(t,e){return this.send(this.localSeat(),Pb(t,e))}placeCharge(t){const e=this.picking();return e?t>=0&&e.ok[t]?this.endCharge(e,t):`cell ${t} is no spot the roll reaches`:"no charge to end"}takeShortest(){const t=this.picking();return t?this.endCharge(t,gb):"no charge to end"}endCharge(t,e){const n=this.view.overlay;return this.pickShown=null,n.clear(),n.ghost.visible=!1,this.tooltip.hide(),this.send(t.seat,vb(e))}end(){if(this.deploySeat()>=0){const t=this.send(this.deploySeat(),{t:"deployed"});return t||(this.sel=null,this.card.show(null),this.flow.refreshUI()),t}return this.myTurn()?(this.select(null),this.send(this.localSeat(),{t:"end"})):"no phase of a seat played here to end now"}auto(){return this.myTurn()?(this.select(null),this.send(this.localSeat(),{t:"auto"})):"no phase of a seat played here to play out now"}voters(){var e;const t=(e=this.G)==null?void 0:e.pending;return(t==null?void 0:t.k)==="roundLimit"&&this.session?this.session.localSeats.filter(n=>t.seats.includes(n)):[]}vote(t,e=null){if(this.mode()!=="roundLimit")return"no round-limit vote to make now";const n=this.voters().filter(s=>!e||e.includes(s));if(!n.length)return"no seat played here is still to vote";for(const s of n){const r=this.send(s,{t:"vote",more:t});if(r)return r}return null}advanceSel(){const t=this.sel;return!t||!this.myTurn()?"no unit of a seat played here to advance now":this.advance(t)}idled(){const t=this.view.overlay;this.sel&&this.myTurn()&&this.select(this.ask((n,s)=>s.canAct(n,this.sel))?this.sel:null);const e=this.picking();e&&this.pickShown!==e&&(this.pickShown=e,t.rangeRing.visible=!1,t.mask(e.ok,[255,150,60],this.G.nav,150),t.ghostAt(this.G.nav,e.cell,e.u.r))}listen(t){t.addEventListener("pointerdown",e=>{yr(),this.downAt={x:e.clientX,y:e.clientY,b:e.button}}),t.addEventListener("pointerup",e=>{if(!this.downAt||e.button!==0)return;const n=Math.hypot(e.clientX-this.downAt.x,e.clientY-this.downAt.y);this.downAt=null,!(n>6)&&this.click(this.picker.pick(e))}),t.addEventListener("pointerleave",()=>{this.hoverPick=null,this.hover=null,this.pointed(),this.flow.refreshRings()}),t.addEventListener("pointermove",e=>{this.mouse={x:e.clientX,y:e.clientY},this.hoverPick=this.picker.pick(e),this.pointed()}),addEventListener("keydown",e=>{e.target.tagName!=="INPUT"&&e.key==="Escape"&&!this.picking()&&this.select(null)})}click({unit:t,ground:e}){if(this.tooltip.hide(),this.deploySeat()>=0)return this.deployClick(t,e);const n=this.picking();if(n){if(e){const o=ku(this.G.nav,n.ok,e.x,e.z);o>=0&&this.placeCharge(o)}return}if(!this.myTurn()){t&&this.card.show(t);return}const s=this.sel,r=Yn(this.G);if(t&&t.side===this.localSeat()){this.ask((o,a)=>a.canAct(o,t))?(Ee.click(),this.select(t)):this.card.show(t);return}if(r==="move"&&s&&e){const o=Mb(a=>this.ask(a),this.reach,e);o>=0&&this.moveTo(s,o);return}if(r==="shoot"&&s&&t&&t.side!==s.side)return void this.shoot(s,t);if(r==="charge"&&s&&t&&t.side!==s.side)return void this.charge(s,t);t?this.card.show(t):e&&this.select(null)}deployClick(t,e){const n=this.deploySeat();if(n<0)return"no seat deploying here";if(t&&t.side===n)return Ee.click(),this.sel=t,this.card.show(t),this.flow.refreshRings(),null;if(this.sel&&e){const s=this.sel,r=xb(o=>this.ask(o),s,e,n);if(r>=0){const o=this.send(n,_b(s,r));return o||(Ee.click(),this.view.units.labelAll()),o}}return null}select(t){const e=this.G,n=this.view.overlay;if(this.sel=t,this.reach=null,n.clear(),t&&e){const s=Yn(e);e.turn.stage==="battle"&&s==="move"&&!t.flags.moved&&(this.reach=yb(r=>this.ask(r),t),n.reach(this.reach,e.nav)),s==="shoot"&&t.t.ranged&&this.showRange(t,t.t.ranged.range),s==="charge"&&this.showRange(t,Sr)}this.card.show(t),this.flow.refreshUI()}showRange(t,e){this.view.overlay.range(t.pos,t.r,e,Yn(this.G)==="charge"?"#ffb070":"#ffffff")}pointed(){const t=this.view.overlay,e=this.G;this.tooltip.hide(),t.pathLine.visible=!1,t.ghost.visible=!1;const n=this.hoverPick,s=this.picking();if(!n){s&&t.ghostAt(e.nav,s.cell,s.u.r);return}this.hover=n.unit;let r="";const o=this.sel,a=(c,l,h)=>{t.path(c),t.ghostAt(e.nav,l,h)};if(s&&n.ground){const c=ku(e.nav,s.ok,n.ground.x,n.ground.z);c>=0?(a(this.ask(l=>l.nav.path(s.plan.res,c,s.u.r,s.plan.mode==="fly"?null:s.plan.forbid)),c,s.u.r),r=`End charge here · ${s.plan.res.dist[c].toFixed(1)}" of ${s.rolled}"`):r="✖ out of reach — pick a spot in the orange area"}else this.myTurn()&&o&&(r=this.ask((c,l)=>{const h=l.phaseKey(c);return h==="move"&&this.reach&&n.ground&&!n.unit?bb(c,l,this.reach,o,n.ground,a):h==="shoot"&&n.unit&&n.unit.side!==o.side?Ab(c,l,o,n.unit):h==="charge"&&n.unit&&n.unit.side!==o.side?Cb(c,l,o,n.unit):""}));if(!r&&n.unit){const c=this.view.units.shown(n.unit.id);r=`${n.unit.t.name} · ${n.unit.t.models>1?`${c.alive}/${n.unit.t.models} models`:`${c.models[0].w}/${n.unit.t.W} wounds`}`}r&&this.mouse&&this.tooltip.show(r,this.mouse)}}const Ld=i=>i.length===2&&i[0].race===i[1].race;function Fu(i){const t=Ld(i);return Object.freeze(i.map(({seat:e,race:n})=>{const s=Tn[n];return Object.freeze({name:s.name,short:s.short,icon:s.icon,color:t&&e===1?s.look.alt:s.look.team,dark:s.look.dark})}))}const nr=i=>i.map((t,e)=>({seat:e,race:t}));let co=null;const Bu=i=>`rgba(${[1,3,5].map(t=>parseInt(i.slice(t,t+2),16)).join(", ")}, 0.45)`;function Db(i){const t=e=>document.querySelector(e);co||(co=document.createElement("style"),document.body.appendChild(co)),co.textContent=`#hud, #labels, #log, #card { --s0: ${i[0].color}; --s1: ${i[1].color}; --s0-glow: ${Bu(i[0].color)}; --s1-glow: ${Bu(i[1].color)}; }`;for(const e of[0,1]){const n=e?"#sideB":"#sideA";t(`${n} .ic`).textContent=i[e].icon,t(`${n} .nm`).textContent=i[e].name}}const Ib=(i,t,e)=>e>=0&&Ld(i)?t[e].color:"",Ub={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function Ob(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");Ub[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}class Nb{constructor(t){this.el=t}clear(t){this.el.innerHTML="";const e=document.createElement("div");e.className="tray-title",e.textContent=t,this.el.appendChild(e),this.el.classList.add("show")}hide(){this.el.classList.remove("show")}async row(t,e,n,{sum:s=!1,pass:r,note:o="",save:a=!1}={}){Ee.dice(e.length);const c=document.createElement("div");c.className="tray-row";const l=document.createElement("span");l.className="lbl",l.textContent=t,c.appendChild(l);const h=document.createElement("span");h.className="dice",c.appendChild(h),e.slice(0,30).forEach((f,g)=>{const v=n?f>=n?a?"saved":"ok":"fail":r===!1?"fail":r?"ok":"plain",m=Ob(f,v);m.style.animationDelay=`${g*.025/we.speed}s`,h.appendChild(m)});const d=document.createElement("span");if(d.className="res",n){const f=Xn(e,n);d.textContent=a?`${f} saved`:`${f} ✓`,e.length>30&&(d.textContent+=` (of ${e.length})`)}else s&&(d.textContent=o||`= ${e.reduce((f,g)=>f+g,0)}`,r===!0&&d.classList.add("good"),r===!1&&d.classList.add("bad"));for(c.appendChild(d),this.el.appendChild(c);this.el.children.length>7;)this.el.children[1].remove();await Rn(mi.dice(e.length))}}class zb{constructor(t,e=()=>null){this.list=t,this.listener=e}write(t,e,n,s){const r=this.list,o=document.createElement("div");o.className=`entry s${t} ${n}`,o.innerHTML=e;const a=this.listener();for(a&&(a.reach(s),o.dataset.at=s),r.prepend(o);r.children.length>80;)r.lastChild.remove()}clear(){this.list.innerHTML=""}}const Dd=Object.fromEntries(Cs.map(i=>[i.key,i.name])),[kb]=Cs.map(i=>i.key),Fb=i=>({phaseShown:i.stage==="battle",buttonsUp:!1});function Bb({G:i,mirror:t,session:e,input:n,hud:s}){var E,O;const{idle:r,decision:o,deploy:a,sel:c,pick:l}=n,{phaseShown:h,sides:u}=s,d=i.setup.rounds,f=M=>e.preview(M),g=(e==null?void 0:e.G)??null,v=(o==null?void 0:o.k)==="deploy",m=h&&(o==null?void 0:o.k)==="phase"&&t.stage==="battle"&&t.active===o.seats[0]&&t.phase===o.phase&&t.round===g.turn.round,p=h&&(o==null?void 0:o.k)==="chargeEnd"&&t.stage==="battle"&&t.active===o.seats[0]&&t.phase==="charge"&&t.round===g.turn.round,x=!m&&!p?!1:r?!0:s.buttonsUp,_=x&&!l,y={show:v||_,label:v?"Begin battle ▸":m?`End ${Dd[o.phase]} ▸`:null,busy:!r,ready:m&&r?!f((M,w)=>w.anyCanAct(M,o.seats[0])):!1};y.lit=v||y.ready;const R={show:m?r?o.phase==="move"&&!!c&&!c.flags.moved&&!c.flags.advanced&&!f((M,w)=>w.isEngaged(M,c)):null:!1,label:c?c.t.chargeAfterAdvance?'Advance (+D6") — can still charge':`Advance (+D6") — no ${(E=c.t.ranged)!=null&&E.assault?"charge":"shooting or charge"} after`:null,busy:!r};let S=s.hint;return l?S=`Charge! Rolled ${l.rolled}" — click the orange area to place ${l.u.t.short}, or take the shortest move.`:v?S="Deployment — click one of your units, then click inside your shaded zone to move it there.":g&&h&&t.stage==="battle"&&g.seats[t.active].ctrl!=="human"?S=`${u[t.active].name} (AI) are taking their turn…`:g&&h&&t.stage==="battle"&&!e.localSeats.includes(t.active)?S=`${u[t.active].name} are taking their turn…`:g&&t.stage==="deploy"&&((O=g.pending)==null?void 0:O.k)==="deploy"&&e.localSeats.length&&!v?S="Waiting for the other side to finish deploying…":m&&(r||!c)?S={move:c?f((M,w)=>w.isEngaged(M,c))?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:c?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:c?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[o.phase]||"":m||(S=""),{vp:[t.vp[0],t.vp[1]],round:t.stage==="deploy"?"Deployment":t.round>d?`Round ${t.round} · overtime`:`Round ${t.round} / ${d}`,phase:t.stage==="battle"?t.phase:null,active:t.stage==="battle"?t.active:-1,end:y,auto:{show:_,busy:!r},advance:R,shortest:{show:!!l},zones:[0,1].map(M=>t.stage==="battle"||t.stage==="over"?.05:M===a?.2:.07),hint:S,rings:Id({session:e,input:n}),buttonsUp:x}}function Id({session:i,input:t}){const{mode:e,deploy:n,pick:s,sel:r,hover:o}=t,a=e!=="phase"?new Map:i.preview((c,l)=>{const h=l.phaseKey(c),u=new Map;for(const d of c.units)!l.alive(d)||d===r||(l.canAct(c,d)?u.set(d.id,["#ffffff",.75]):r&&h==="shoot"&&d.side!==r.side&&l.shotInfo(c,r,d).ok?u.set(d.id,["#ff5a4a",.95]):r&&h==="charge"&&d.side!==r.side&&l.chargeTargets(c,r).includes(d)&&u.set(d.id,["#ffa040",.95]));return u});return c=>c.id===(r==null?void 0:r.id)?["#ffe680",1]:n>=0&&c.u.side===n?["#ffffff",.5]:s&&c.id===s.tg.id?["#ffa040",.95]:a.has(c.id)?a.get(c.id):c.id===(o==null?void 0:o.id)?["#ffffff",.35]:["#ffffff",0]}const Ud=(i,t)=>({side:t.side,moved:!!t.flags.moved,fellBack:!!t.flags.fellBack,advanced:!!t.flags.advanced,advRoll:t.flags.advRoll,shot:!!t.flags.shot,charged:!!t.flags.charged,cover:qo(i,t)});function tc(i){const t={};for(const e of i.units)t[e.id]=Ud(i,e);return t}function Hb(i,t){if(t.phase!==kb)return i;const e={};for(const[n,s]of Object.entries(i))e[n]=s.side===t.side?{...s,moved:!1,fellBack:!1,advanced:!1,advRoll:void 0,shot:!1,charged:!1}:s;return e}function Vb(i,t,e){const n=[];e.moved&&n.push(e.fellBack?"fell back":e.advanced?`advanced +${e.advRoll}"`:"moved"),e.shot&&n.push("shot"),e.charged&&n.push("charged"),t.mesmerized&&n.push("🌀 mesmerized"),t.alive>0&&t.engaged&&n.push("⚔ in combat"),t.alive>0&&e.cover&&n.push("🛡 in cover");const s=i.models>1?`${t.alive}/${i.models} models`:`${t.models[0].w}/${i.W} wounds`;return`${t.alive>0?s:"destroyed"}${n.length?" · "+n.join(" · "):""}`}function Wb(i){const t=i.turn;return{win:t.result.win,why:t.result.why,vp:[...t.vp],rounds:t.step==="rolloff"?0:t.round}}const Hu=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];class Gb{constructor({el:t,sides:e,shown:n,live:s,ask:r,facts:o}){this.el=t,this.sides=e,this.shown=n,this.live=s,this.ask=r,this.facts=o,this.unit=null}get open(){return this.el.classList.contains("show")}show(t){var c;const e=this.el;if(this.unit=t,!t){e.classList.remove("show");return}const n=t.t,s=l=>l==="M"?`${n.M}"`:["WS","BS","Sv"].includes(l)?`${n[l]}+`:n[l],r=(l,h)=>{if(!l)return"";if(l.mesmerize)return`<div class="wpn"><span>${h} ${l.name}</span><em>spell ${l.spell}+ · ${l.range}" · D3 mortal + mesmerize</em></div>`;const u=[];return l.range&&u.push(`${l.range}"`),l.spell&&u.push(`spell ${l.spell}+`),l.blast?u.push(`blast ${l.blast}" ×${l.shots}`):l.shots&&u.push(`A${l.shots}`),u.push(`S${l.S}`,`AP-${l.AP}`,`D${l.D}`),l.poison&&u.push(`poison ${l.poison}+`),l.indirect&&u.push("indirect"),l.heavy&&u.push("heavy"),l.assault&&u.push("assault"),`<div class="wpn"><span>${h} ${l.name}</span><em>${u.join(" · ")}</em></div>`},o=this.shown(t),a=this.live()?this.ask(l=>Ud(l,t)):this.facts()[t.id];e.innerHTML=`
    <div class="card-head s${t.side}"><b>${n.name}</b><span>${this.sides()[t.side].short} · ${n.role}</span></div>
    <div class="card-sub">${Vb(n,o,a)}</div>
    <table class="stats"><tr>${Hu.map(l=>`<th>${l}</th>`).join("")}</tr><tr>${Hu.map(l=>`<td>${s(l)}</td>`).join("")}</tr></table>
    ${r(n.ranged,(c=n.ranged)!=null&&c.spell?"✦":"➹")}${r({...n.melee,range:0},"⚔")}
    <ul class="abil">${(n.abilities||[]).map(l=>`<li>${l}</li>`).join("")}</ul>`,e.classList.add("show")}}class $b{constructor(t){this.el=t}async show(t,e,n,s){const r=this.el;r.innerHTML=`<div class="b1">${t}</div><div class="b2">${e}</div>`,r.querySelector(".b1").style.color=n,r.classList.remove("show"),r.offsetWidth,r.classList.add("show"),await Rn(s)}}class jb{constructor(t){this.el=t,this.timer=0}show(t,e=4e3){this.el.textContent=t,this.el.classList.add("show"),clearTimeout(this.timer),this.timer=setTimeout(()=>this.el.classList.remove("show"),e)}}const Ie=i=>document.querySelector(i);class Xb{render(t){Ie("#vp0").textContent=t.vp[0],Ie("#vp1").textContent=t.vp[1],Ie("#round").textContent=t.round,document.querySelectorAll("#phases .ph").forEach(e=>{e.classList.toggle("on",e.dataset.k===t.phase)}),Ie("#sideA").classList.toggle("active",t.active===0),Ie("#sideB").classList.toggle("active",t.active===1),Ie("#hint").textContent=t.hint,Ie("#hint").style.display=t.hint?"":"none"}wire({rig:t}){const e=[1,2,4];Ie("#speed").onclick=()=>{we.speed=e[(e.indexOf(we.speed)+1)%e.length],Ie("#speed").textContent=`⏩ ${we.speed}×`},Ie("#view").onclick=()=>t.nextView(),Ie("#follow").onclick=()=>{t.follow=!t.follow,Ie("#follow").classList.toggle("off",!t.follow)},Ie("#mute").textContent=XM()?"🔇":"🔊",Ie("#mute").onclick=()=>{yr(),Ie("#mute").textContent=jM()?"🔇":"🔊"},Ie("#logToggle").onclick=()=>Ie("#log").classList.toggle("collapsed")}}const ii=i=>document.querySelector(i);class qb{render(t){const e=ii("#endPhase"),n=ii("#autoPhase"),s=ii("#advance");e.style.display=t.end.show?"":"none",n.style.display=t.auto.show?"":"none",ii("#closestSpot").style.display=t.shortest.show?"":"none",t.end.label!==null&&(e.textContent=t.end.label),e.disabled=t.end.busy,e.classList.toggle("ready",t.end.lit),n.disabled=t.auto.busy,s.disabled=t.advance.busy,t.advance.show!==null&&(s.style.display=t.advance.show?"":"none"),t.advance.label!==null&&(s.textContent=t.advance.label)}wire(t){ii("#endPhase").onclick=()=>(yr(),Ee.click(),t.end()),ii("#closestSpot").onclick=()=>(Ee.click(),t.takeShortest()),ii("#autoPhase").onclick=()=>t.auto(),ii("#advance").onclick=()=>t.advanceSel()}}const xn=i=>document.querySelector(i);class Yb{note(t){const e=document.createElement("p");e.className="small",e.textContent=t,xn("#title .modes").before(e)}hide(){xn("#title").classList.add("hidden"),document.body.classList.add("playing"),innerWidth<700&&xn("#log").classList.add("collapsed")}show(){xn("#title").classList.remove("hidden"),document.body.classList.remove("playing")}wire({S:t,showTable:e,start:n,online:s}){xn("#online").onclick=()=>{yr(),Ee.click(),s()},xn("#seed").value=t.seed,xn("#reroll").onclick=()=>{t.seed=Math.random()*1e6|0,xn("#seed").value=t.seed,e(t.seed)},xn("#seed").onchange=()=>{const r=(Number(xn("#seed").value)||1)>>>0;e(r),t.seed=r,xn("#seed").value=r},document.querySelectorAll("[data-mode]").forEach(r=>{r.onclick=()=>{yr(),Ee.click(),n(r.dataset.mode)}})}}const Ue=i=>document.querySelector(i);class Kb{get up(){return!Ue("#over").classList.contains("hidden")}get voting(){return this.up&&!Ue("#overVote").classList.contains("hidden")}show({win:t,why:e,vp:n,rounds:s},r,o){const a=t<0?"A bloody draw":`${r[t].name} win!`,c=s?`in round ${s}`:"in the deployment",l=e==="wipe"?`${r[1-t].name} have been wiped from the table ${c}.`:e==="concede"?`${r[1-t].name} conceded ${c}.`:`Final score ${n[0]} – ${n[1]} after ${s} round${s===1?"":"s"}.`,h=Ue("#overTitle");h.textContent=`${t>=0?r[t].icon+" ":""}${a}`,h.style.color=o,Ue("#overWhy").textContent=l,this.parts(!1),Ue("#over").classList.remove("hidden"),Ee.fanfare()}showVote({round:t,vp:e,votes:n,voters:s,canMore:r},o){const a=e[0]===e[1]?`Level at ${e[0]} – ${e[1]}.`:`${o[e[0]>e[1]?0:1].name} lead ${Math.max(...e)} – ${Math.min(...e)}.`,c=Ue("#overTitle");c.textContent=`Round ${t} is over`,c.style.color="",Ue("#overWhy").textContent=`${a} Play another round? It takes everyone's yes.`;const l=s.map(h=>`${o[h].name}: ${n[h]===void 0?"deciding…":n[h]?"keep playing":"end it"}`);Ue("#overVotes").textContent=r?l.join(" · "):`The battle's log is nearly full: this round is the last. ${l.join(" · ")}`,Ue("#keepPlaying").classList.toggle("hidden",!r),this.parts(!0),Ue("#over").classList.remove("hidden")}hide(){Ue("#over").classList.add("hidden")}parts(t){Ue("#overVote").classList.toggle("hidden",!t),Ue("#overVotes").classList.toggle("hidden",!t),Ue("#again").classList.toggle("hidden",t)}wire(t,e){Ue("#again").onclick=t,Ue("#keepPlaying").onclick=()=>e(!0),Ue("#endBattle").onclick=()=>e(!1)}}const lo=i=>document.querySelector(i);function Jb(){lo("#helpBtn").onclick=()=>lo("#help").classList.remove("hidden"),lo("#helpClose").onclick=()=>lo("#help").classList.add("hidden")}const wc=Object.freeze(["id","s","d","p","h"]),Vu=1024,Od=64,Wu=Object.freeze({open:Object.freeze({commit:"string"}),start:Object.freeze({core:"int",rules:"string",setup:"object",a:"string?"}),desync:Object.freeze({at:"string",mine:"string"}),final:Object.freeze({})}),Zb=Object.freeze({final:Object.freeze(["p","h"])}),Qb=Object.freeze(["desync","final"]),Ec=i=>Number.isSafeInteger(i),ur=i=>typeof i=="string"&&i.length>0&&i.length<=Od,Qc=i=>!!i&&typeof i=="object"&&!Array.isArray(i),tS=Object.freeze({int:Ec,string:i=>typeof i=="string",object:Qc}),eS=(i,t,e)=>`${i}.${t.toString(36)}.${e}`,nS=(i,t)=>({...i,...t}),Tc=i=>Ls(i),Gu=i=>Object.fromEntries(Object.entries(i).filter(([t])=>!wc.includes(t)));function iS(i){if(!Qc(i))return"not an object";if(!ur(i.id))return"no id";if(!Ec(i.s)||i.s<-1)return"no seat";if(!ur(i.d))return"no device";for(const e of["p","h"])if(Object.hasOwn(i,e)&&!ur(i[e]))return`${e} is not a name`;const t=typeof i.t=="string"&&Object.hasOwn(Wu,i.t)?Wu[i.t]:null;if(t){if(i.s===-1===Qb.includes(i.t))return`${i.t} for seat ${i.s}`;for(const e of Zb[i.t]??[])if(!Object.hasOwn(i,e))return`${i.t} takes a ${e}`;for(const e of Object.keys(i))if(e!=="t"&&!wc.includes(e)&&!Object.hasOwn(t,e))return`${i.t} takes no field "${e}"`;for(const[e,n]of Object.entries(t)){const s=n[n.length-1]==="?",r=n.replace("?","");if(Object.hasOwn(i,e)?!tS[r](i[e]):!s)return`${i.t} takes a ${r} ${e}`}return null}if(!tM.includes(i.t))return`no kind ${JSON.stringify(i.t)}`;if(i.s<0)return`${i.t} for seat ${i.s}`;for(const e of Object.keys(i))if(!(e==="t"||wc.includes(e))&&!Ec(i[e])&&typeof i[e]!="boolean")return`${i.t}'s ${e} is not a whole number`;return null}function sS(i){let t=0;for(let e=0;e<i.length;e++){const n=i.charCodeAt(e);n<128?t+=1:n<2048?t+=2:n>=55296&&n<56320&&(i.charCodeAt(e+1)&64512)===56320?(t+=4,e++):t+=3}return t}function Nd(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))Nd(t)}return i}function zd(i){if(typeof i!="string")return{bad:"not text",id:null};if(sS(i)>Vu)return{bad:`over ${Vu} bytes`,id:null};let t;try{t=JSON.parse(i)}catch{return{bad:"not JSON",id:null}}const e=Qc(t)&&ur(t.id)?t.id:null,n=iS(t);if(n)return{bad:n,id:e};let s;try{s=Ls(t)}catch{return{bad:"not canonical JSON",id:e}}return s!==i?{bad:"not canonical JSON",id:e}:Nd(t)}const Ac=Object.freeze(["deploy","roundLimit"]),rS=Object.freeze(["concede","desync","final"]),Rc=5e3,$u=i=>{const t=i.turn;return`${t.stage}/${t.step}/${t.round}/${t.t}/${t.ph}/${t.overtime}`},oS=({id:i,heads:t,seats:e})=>Ho(JSON.stringify(e.map(n=>t[n]??i))).toString(36),ju=(i,t)=>i===t||!!i&&!!t&&i.id===t.id&&JSON.stringify(i)===JSON.stringify(t);class Ko{constructor({out:t=null,onTrace:e=null,strict:n=!1}={}){this.opts={out:t,onTrace:e,strict:n},this.G=null,this.status="lobby",this.accepted=[],this.rejected=[],this.error=null,this.report=null,this.pushed=[],this.seen=new Set,this.openBy=null,this.last=null,this.simul=null,this.finals=new Set,this.syncing=!1,this.busy=!1}head(t){return this.simul?this.simul.heads[t]??this.simul.id:this.last}get count(){return this.pushed.length}push(t){if(this.busy)throw new Error("Folder.push is not reentrant: it was called while an entry was being folded or its events handed on");this.busy=!0;try{this.judge(t)}finally{this.busy=!1}}judge(t){if(this.pushed.push(t),this.pushed.length>Rc)return(this.status==="lobby"||this.status==="live")&&this.halt("full",{at:t.id??null,why:`the log ran past ${Rc} entries`}),this.inert(t);if(t.bad)return this.reject(t,`envelope: ${t.bad}`);if(this.seen.has(t.id))return this.reject(t,"envelope: an id seen before");if(this.seen.add(t.id),this.status==="lobby")return t.t==="open"&&this.openBy===null?(this.openBy=t.d,this.accept(t)):t.t==="start"&&(this.openBy===null||t.d===this.openBy)?this.begin(t):(t.t==="start"&&(this.error=`the log was opened by device ${this.openBy}: only its start counts`),this.inert(t));if(this.status==="over"){if(t.t==="desync"||t.t==="final")return this.outOfBand(t);const a=this.G.setup.seats[t.s];if(t.h!==void 0&&t.p===this.last&&t.t!=="concede"&&(a==null?void 0:a.ctrl)==="human"&&t.d===a.dev&&t.h!==vs(this.G))return this.freeze(t)}if(this.status!=="live")return this.inert(t);if(t.t==="open"||t.t==="start")return this.reject(t,`turn: the match has begun, so no ${t.t}`);if(rS.includes(t.t))return this.outOfBand(t);const e=this.G,n=e.pending;if(!n.seats.includes(t.s))return this.reject(t,`turn: seat ${t.s} has no decision to make`);if(t.d!==e.setup.seats[t.s].dev)return this.reject(t,`device: seat ${t.s} is not played from ${t.d}`);if(t.p!==this.head(t.s))return this.reject(t,`stale: seat ${t.s}'s head is ${this.head(t.s)}, not ${t.p}`);if(!Ac.includes(n.k)&&t.h!==vs(e))return this.freeze(t);const s=Gu(t),r=_c(e,t.s,s);if(r)return this.reject(t,`illegal: ${r}`);const o=$u(e);return mu(e,t.s,s),this.accept(t,n,o)}begin(t){if(t.core!==_o||t.rules!==xo)return this.error=`this battle was made with another version of the game (core ${t.core}, rules ${t.rules}; this is core ${_o}, rules ${xo})`,this.reject(t,`skew: ${this.error}`),this.halt("skew",{at:t.id,why:this.error});const e=Array.isArray(t.setup.seats)?t.setup.seats:[],n=e.findIndex(s=>(s==null?void 0:s.ctrl)==="human"&&!ur(s.dev));if(n>=0){const s=e[n].dev;return this.error=typeof s=="string"&&s?`seat ${n} names a device no entry can carry (${s.length} characters; at most ${Od})`:`seat ${n} is a human seat that names no device`,this.reject(t,`start: ${this.error}`)}try{this.G=Md(t.setup,{out:this.opts.out,onTrace:this.opts.onTrace,strict:this.opts.strict})}catch(s){return this.error=s.message,this.reject(t,`start: ${s.message}`)}return this.error=null,this.status="live",this.accept(t)}outOfBand(t){const e=this.G,n=e.setup.seats[t.s];if(!n||n.ctrl!=="human")return this.reject(t,`seat: ${t.t} from seat ${t.s}, which no human plays`);if(t.d!==n.dev)return this.reject(t,`device: seat ${t.s} is not played from ${t.d}`);if(t.t==="desync"){const a=this.pushed.find(c=>c.id===t.at&&!c.bad);return this.accept(t),this.halt("desync",{at:t.at,theirs:t.mine,mine:(a==null?void 0:a.h)??null,by:t.id,seat:t.s})}if(t.t==="final")return this.closing(t);const s=Gu(t),r=_c(e,t.s,s);if(r)return this.reject(t,`illegal: ${r}`);const o=this.last;mu(e,t.s,s),this.accept(t),this.last=Ho(JSON.stringify([o,this.last,t.id])).toString(36)}closing(t){return this.finals.add(`${t.d} ${t.p}`),t.p!==this.last?this.reject(t,`stale: the match's head is ${this.last}, not ${t.p}`):t.h!==vs(this.G)?this.freeze(t):this.reject(t,`inert: the match is ${this.status}, its closing hash agreeing`)}freeze(t){return this.halt("desync",{at:t.id,theirs:t.h??null,mine:vs(this.G),by:"hash",seat:t.s})}halt(t,e){this.status=t;const n=this.G;this.report={status:t,...e,core:_o,rules:xo,count:this.pushed.length,setup:(n==null?void 0:n.setup)??null,entries:this.pushed.slice(),accepted:this.accepted.slice(),rejected:this.rejected.map(s=>({...s})),trace:n?n.journal.trace.slice(-50):[],state:n?_d(n):null}}accept(t,e=null,n=null){this.accepted.push(t.id),this.last=t.id;const s=this.G,r=s==null?void 0:s.pending,o=this.simul,a=!!r&&Ac.includes(r.k);o&&a&&(e==null?void 0:e.k)===r.k&&$u(s)===n?o.heads[t.s]=t.id:(o&&(e&&(o.heads[t.s]=t.id),this.last=oS(o)),this.simul=a?{id:this.last,seats:[...r.seats],heads:{}}:null),s&&s.turn.stage==="over"&&this.status==="live"&&(this.status="over")}reject(t,e){this.rejected.push({id:t.id??null,why:e})}inert(t){this.reject(t,this.status==="lobby"?"inert: the match has not started":`inert: the match is ${this.status}`)}step(t,e,n){var o;const s=this.accepted.length;if(this.push(t),this.accepted.length===s||!((o=this.G)!=null&&o.out))return;const r=this.G.out.splice(0);if(e.push(...r),!!n){this.busy=!0;try{n(r,t)}finally{this.busy=!1}}}sync(t,e=null){if(this.syncing)throw new Error("Folder.sync is not reentrant: it was called again while it handed on an entry's events");this.syncing=!0;try{return this.fold(t,e)}finally{this.syncing=!1}}refoldFrom(){return{next:new Ko({...this.opts,out:null,onTrace:null}),from:0}}fold(t,e){const n=[];if(this.status==="tamper")return{events:n,reset:!1,undone:0};const s=t.length,r=this.pushed.length;let o=s>=r;for(let y=0;o&&y<r;y++)o=ju(t[y],this.pushed[y]);if(o){for(let y=r;y<s;y++)this.step(t[y],n,e);return{events:n,reset:!1,undone:0}}const a=(y,R)=>{const S=new Map;for(let E=0;E<R;E++)!y[E].bad&&!S.has(y[E].id)&&S.set(y[E].id,{e:y[E],i:E});return S},c=a(t,s),l=a(this.pushed,r),h=this.accepted.filter(y=>!c.has(y)||!ju(c.get(y).e,l.get(y).e)),u=this.accepted.filter((y,R)=>{var S,E;return R>0&&((S=c.get(y))==null?void 0:S.i)<((E=c.get(this.accepted[R-1]))==null?void 0:E.i)});if(h.length||u.length)return this.halt("tamper",h.length?{at:h[0],gone:h}:{at:u[0],moved:u}),{events:n,reset:!1,undone:0};const d=this.accepted,{next:f,from:g}=this.refoldFrom();let v=!1,m=!1;const p=()=>{v=!0,f.G&&Object.assign(f.G,{out:this.opts.out?[]:null,onTrace:this.opts.onTrace}),Object.assign(this,{...f,opts:this.opts,syncing:!0})};d.length||p();for(let y=g;y<s;y++){const R=t[y];if(v){this.step(R,n,e);continue}const S=f.accepted.length;f.push(R),!(m||f.accepted.length===S)&&(f.accepted[S]!==d[S]?m=!0:S+1===d.length&&p())}const x=!v;x&&p();const _=new Set(this.accepted);return{events:n,reset:x,undone:x?d.filter(y=>!_.has(y)).length:0}}}class aS{constructor({store:t,localSeats:e=[],dev:n="local",rand:s=()=>"0",sink:r=null,onTrace:o=null,strict:a=!1,closing:c=!1}){if(!Number.isInteger(t.length))throw new Error("a MatchStore tells its length (match/store.js)");this.store=t,this.localSeats=Object.freeze([...e]),this.dev=n,this.rand=s,this.sink=r,this.closing=c,this.folder=new Ko({out:[],onTrace:o,strict:a}),this.told=null,this.unsent=null,this.saidAt=null,this.n=t.length,this.folding=!1,this.again=!1,this.dirty=!1,this.shown=this.folder.status,this.queue=[],this.off=t.subscribe(()=>this.onChange()),this.onChange()}get G(){return this.folder.G}get status(){return this.folder.status}get error(){return this.unsent??this.folder.error}get report(){return this.folder.report}get accepted(){return this.folder.accepted}get rejected(){return this.folder.rejected}get count(){return this.folder.count}decisionFor(){var e;const t=(e=this.G)==null?void 0:e.pending;return(t==null?void 0:t.seats.find(n=>this.localSeats.includes(n)))??-1}preview(t){if(!this.G)throw new Error("no match to preview: the store has no start yet");return _r(this.G,t)}legal(t,e){var n;return this.status!=="live"?`the match is ${this.status}`:this.localSeats.includes(t)?((n=this.G.setup.seats[t])==null?void 0:n.dev)!==this.dev?`seat ${t} is played from another device`:(e==null?void 0:e.t)!=="concede"&&!_M(this.G).includes(t)?`seat ${t} has no decision to make now`:_c(this.G,t,e):`seat ${t} is not played on this device`}submit(t,e){!this.folding&&this.queue.length&&this.onChange();const n=this.legal(t,e);if(n)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: ${n}`);if(this.folding){this.queue.push({seat:t,body:{...e}});return}const s=this.send(t,e);if(s)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: its entry would be refused (${s})`)}send(t,e){const n=this.G.pending,s=e.t==="concede";return this.append(e,{s:t,p:s?void 0:this.folder.head(t),h:s||Ac.includes(n.k)?void 0:vs(this.G)})}open(t){if(this.store.length)throw new Error("an online log opens before anything else is written to it");const e=this.append({t:"open",commit:t},{s:-1});if(e)throw new Error(`the log can't open: ${e}`)}start(t,{a:e}={}){if(this.status!=="lobby")throw new Error(`the match has started already (${this.status})`);if(this.folding){this.queue.push({seat:-1,body:{t:"start",setup:t,a:e}});return}this.begin(t,e)}begin(t,e){this.unsent=null,this.unsent=this.append({t:"start",core:_o,rules:xo,setup:t,a:e},{s:-1,p:this.folder.head(-1)??void 0})}append(t,e){const n=nS(t,{id:eS(this.dev,this.n,this.rand()),d:this.dev,...e});let s;try{s=Tc(n)}catch(o){return o.message}const r=zd(s);return r.bad?r.bad:(this.n++,this.store.append(s),null)}drain(){const{seat:t,body:e}=this.queue.shift();if(t===-1&&e.t==="start"){this.status!=="lobby"?this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.dropped)==null?void 0:r.call(s,t,e,`the match has started already (${this.status})`,this)}):this.begin(e.setup,e.a);return}const n=this.legal(t,e)??this.send(t,e);n&&this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.dropped)==null?void 0:r.call(s,t,e,n,this)})}call(t){try{t()}catch(e){return this.failed??(this.failed=e),!1}return!0}onChange(){if(this.folding){this.again=!0;return}this.folding=!0,this.again=!0,this.failed=null;try{for(;;)if(this.again)this.call(()=>this.pass())||(this.dirty=!0);else if(this.status!==this.shown)this.shown=this.status,this.call(()=>{var e,n;return(n=(e=this.sink)==null?void 0:e.status)==null?void 0:n.call(e,this.status,this)});else if(!this.tell()&&!this.final())if(this.queue.length)this.drain();else if(this.dirty)this.dirty=!1,this.call(()=>{var e,n;return(n=(e=this.sink)==null?void 0:e.settled)==null?void 0:n.call(e,this)});else break}finally{this.folding=!1}const t=this.failed;if(this.failed=null,t)throw t}pass(){this.again=!1;const t=this.folder.count,{reset:e,undone:n}=this.folder.sync(this.store.entries(),s=>this.call(()=>{var r,o;return(o=(r=this.sink)==null?void 0:r.events)==null?void 0:o.call(r,s,this)}));e&&this.G&&this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.reset)==null?void 0:r.call(s,this.G,this,{undone:n})}),(e||this.folder.count!==t)&&(this.dirty=!0),this.status!=="lobby"&&(this.unsent=null)}tell(){const t=this.folder.report;if(this.status!=="desync"||(t==null?void 0:t.by)!=="hash"||this.told===t.at)return!1;const e=this.localSeats.find(n=>{var s;return((s=this.G.setup.seats[n])==null?void 0:s.dev)===this.dev});return e===void 0?!1:(this.told=t.at,this.append({t:"desync",at:t.at,mine:t.mine},{s:e}),!0)}final(){const t=this.folder.last;if(!this.closing||this.status!=="over"||this.saidAt===t||this.folder.finals.has(`${this.dev} ${t}`))return!1;const e=this.localSeats.find(n=>{var s;return((s=this.G.setup.seats[n])==null?void 0:s.dev)===this.dev});return e===void 0?!1:(this.saidAt=t,!this.append({t:"final"},{s:e,p:t,h:vs(this.G)}))}close(){this.off()}}class cS{constructor(t=[]){this.kind="local",this.log=t.map(e=>typeof e=="string"?e:Tc(e)),this.decoded=[],this.subs=new Set}get length(){return this.log.length}entries(){for(let t=this.decoded.length;t<this.log.length;t++)this.decoded.push(zd(this.log[t]));return this.decoded}append(t){this.log.push(typeof t=="string"?t:Tc(t));for(const e of[...this.subs])e()}subscribe(t){return this.subs.add(t),()=>this.subs.delete(t)}export(){return JSON.stringify(this.log)}}class lS{constructor({handlers:t,view:e=null,mirror:n=null,onIdle:s=null}){this.handlers={fallback:(r,o)=>this.fallback(r,o),...t},this.view=e,this.mirror=n,this.onIdle=s,this.observer=null,this.q=[],this.running=!1,this.table=0}get idle(){return!this.running&&!this.q.length}backlog(){let t=0;for(const e of this.q)t+=mi.cost(e);return t}push(t){for(const e of t)this.q.push(e);this.running||this.run()}snap(t,e=di(t)){var n,s,r,o;this.table++,this.q.length=0,this.running=!1,this.mirror=e,(n=this.view)==null||n.rebuild(t,e),(r=(s=this.observer)==null?void 0:s.reset)==null||r.call(s,e),(o=this.onIdle)==null||o.call(this,{snap:!0,G:t})}run(){var e,n,s;const t=this.table;this.running=!0;try{for(;this.q.length;){const r=this.q.shift();this.mirror=bd(this.mirror,r),(n=(e=this.observer)==null?void 0:e.event)==null||n.call(e,r,this.mirror);const o=(this.handlers[r.t]??this.handlers.fallback)(r,this.mirror);if(o&&typeof o.then=="function"){o.then(()=>t===this.table&&this.run(),a=>t===this.table&&this.fail(a));return}}}catch(r){return this.fail(r)}this.running=!1,(s=this.onIdle)==null||s.call(this)}fallback(t,e){var s,r;const n=t.u!==void 0&&e.units[t.u]?e.units[t.u].pos:{x:t.x??0,z:t.z??0};return t.text&&((r=(s=this.view)==null?void 0:s.text)==null||r.call(s,{x:n.x,y:1.6,z:n.z},t.text,"#ffffff")),Rn(t.beat??mi.beat)}fail(t){throw this.running=!1,this.q.length=0,t}}const ec={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]},hS=Math.floor(.8*Rc),Xu="local",xs=i=>{const t=yd(i);return{board:t.board,terrain:t.terrain,races:t.seats.map(e=>e.race)}},qu=(i,t)=>JSON.stringify(xs(i))===JSON.stringify(xs(t)),Yu=i=>({...di(i),stage:"title"});class uS{constructor({view:t,ui:e,params:n,seed:s,races:r}){this.view=t,this.ui=e,this.params=n,this.races=r,this.S={seed:s,control:["human","ai"]},this.session=null,this.G=null,this.backdrop=null,this.backdropAsDrawn=!0,this.traceListener=null,this.checkHook=null,this.sides=Fu(nr(r)),this.hud={phaseShown:!1,buttonsUp:!1,hint:""},this.shownHud=null,this.facts={},this.acted=[],this.onTrace=(o,a)=>{var c;/^act /.test(o)&&this.acted.push(_r(a,tc)),(c=this.traceListener)==null||c.line(o,a)},this.sink={events:(o,a)=>{this.G!==a.G&&(this.G=a.G,this.sameUnits(this.G));const c=this.acted.splice(0);o=o.map(l=>l.t==="act"?{...l,facts:c.shift()}:l.t==="pending"?{...l,facts:a.preview(tc)}:l),this.traceListener&&(o=this.traceListener.present(o,this.G)),this.player.push(o),this.online&&this.catchUp(a)},reset:(o,a,{undone:c=0}={})=>{var l,h,u;this.G&&!qu(this.G.setup,o.setup)&&this.redraw(),this.G=a.G,this.sameUnits(this.G),this.acted.length=0,(h=(l=this.traceListener)==null?void 0:l.rejoin)==null||h.call(l,o),this.player.snap(o,di(o)),this.relog(a.folder.pushed),c>0&&((u=this.ui.toast)==null||u.show(`History changed: ${c} move${c===1?"":"s"} undone`))},status:(o,a)=>{var c,l;return(l=(c=this.online)==null?void 0:c.status)==null?void 0:l.call(c,o,a)}},this.online=null,this.human=null,this.player=null}play(t){const{view:e,ui:n}=this;this.human=t;const s={...e.handlers({localSeats:()=>{var r;return((r=this.session)==null?void 0:r.localSeats)??[]}}),log:r=>n.log.write(r.side,r.html,r.cls,r.at),"tray.open":r=>n.tray.clear(r.title),dice:r=>n.tray.row(r.label,r.dice,r.need,r),act:r=>{r.facts&&(this.facts=r.facts)},pending:r=>{r.facts&&(this.facts=r.facts)},stage:r=>this.staged(r),"phase.start":r=>this.phaseBegun(r),"round.scored":r=>this.scored(r),"game.over":r=>this.over(r),check:r=>{var o;return(o=this.checkHook)==null?void 0:o.call(this,r)}};return this.player=new lS({handlers:s,view:e,onIdle:r=>this.idled(r)}),this.player}atTable(){return this.G??this.backdrop}unitById(t){return this.atTable().units.find(e=>e.id===t)}local(t){var e;return!!((e=this.session)!=null&&e.localSeats.includes(t))}ink(t){return Ib(this.atTable().seats,this.sides,t)}seatPlayers(t){this.sides=Fu(t),Db(this.sides),this.view.table.paint(this.sides.map(e=>e.color))}staged(t){this.hud.phaseShown=!1,t.stage!=="deploy"&&this.human.select(null),this.refreshUI()}phaseBegun(t){this.facts=Hb(this.facts,t),this.hud.phaseShown=!0,this.human.select(null),this.ui.tray.hide(),this.refreshUI();const e=this.player.mirror;return this.ui.banner.show(`${this.sides[t.side].icon} ${this.sides[t.side].name}`,Dd[t.phase],this.ink(t.side),mi.phaseStart(this.local(e.active),e.stage))}scored(t){t.owners.forEach((n,s)=>{const r=Ds.classic.objectives[s];n>=0&&this.view.effects.ring(r.x,r.z,Bo,this.sides[n].color,{life:1.6,fill:.15})}),this.refreshUI();const e=this.player.mirror;return this.ui.banner.show(`End of round ${t.round}`,`VP ${t.vp[0]} – ${t.vp[1]}`,this.ink(-1),mi.phaseStart(this.local(e.active),e.stage))}over(t){this.human.select(null),this.refreshUI(),this.ui.result.show(t,this.sides,this.ink(t.win))}idled({snap:t=!1,G:e=null}={}){const n=this.traceListener,s=this.ui.card;we.boost=1,n==null||n.idle(),t&&this.snapped(e);const r=!t&&s.unit&&this.unitById(s.unit.id);r&&r.t===s.unit.t&&r.side===s.unit.side&&s.open&&s.show(r),this.human.idled(),this.refreshUI(),n==null||n.settled()}snapped(t){const e=this.player.mirror,n=this.view.overlay,s=this.human;Object.assign(this.hud,Fb(e)),s.sel=(s.sel&&t.units.find(r=>r.id===s.sel.id))??null,s.reach=null,s.hover=s.hoverPick=null,s.pickShown=null,n.clear(),n.ghost.visible=!1,this.facts=_r(t,tc),e.stage==="over"&&(!this.ui.result.up||this.ui.result.voting)&&this.over(Wb(t))}refreshUI(){var r,o;const{ui:t,view:e}=this,n=Bb({G:this.atTable(),mirror:this.player.mirror,session:this.session,input:this.human.state(),hud:{...this.hud,sides:this.sides}});this.hud.buttonsUp=n.buttonsUp,this.hud.hint=n.hint,this.shownHud=n,t.hud.render(n),t.actions.render(n);const s=(o=(r=this.session)==null?void 0:r.G)==null?void 0:o.pending;if(this.player.idle&&(s==null?void 0:s.k)==="roundLimit"&&this.session.decisionFor()>=0){const a=this.session.G,c=[...Object.keys(s.votes).map(Number),...s.seats].sort((l,h)=>l-h);t.result.showVote({round:a.turn.round,vp:a.turn.vp,votes:s.votes,voters:c,canMore:this.session.count<hS},this.sides)}else t.result.voting&&t.result.hide();e.table.zones(n.zones),e.units.paintRings(n.rings)}refreshRings(){this.view.units.paintRings(this.rings())}rings(){return Id({session:this.session,input:this.human.state()})}sameUnits(t){const e=this.view.units,n=r=>!e.get(r.id)||e.unit(r.id).t!==r.t||e.unit(r.id).side!==r.side,s=t.units.find(n);if(s||t.units.length!==e.views.size)throw new Error(`the battle's units are not the table's (${s?`unit ${s.id}, ${s.key} of seat ${s.side}`:`${t.units.length} units, ${e.views.size} figures`}): a battle starts on its own table (start())`)}showTable(t,{terrain:e="classic",races:n=this.races}={}){var c;const{view:s,ui:r,human:o}=this,a=Md({board:t,dice:0,terrain:e,seats:n.map(l=>({race:l,ctrl:"human"}))},{out:null});(c=this.session)==null||c.close(),this.session=null,this.G=null,this.backdrop=a,this.backdropAsDrawn=!0,this.seatPlayers(nr(n)),s.units.dispose(),s.terrain.dispose(),o.sel=null,o.reach=null,s.overlay.clear(),r.log.clear(),r.tray.hide(),s.terrain.sync(a.terrain.chunks),s.table.scatterTufts(),this.player.snap(a,Yu(a)),s.objectives.reset(),this.refreshUI()}start(t){var h;const{view:e,ui:n,human:s}=this;if(!Object.hasOwn(ec,t))throw new Error(`no mode "${t}" (there are ${Object.keys(ec).join(", ")})`);const r=ec[t];this.online&&this.leaveOnline(),this.session&&this.showTable(this.S.seed);const o=(Number(this.params.get("dice"))||Math.random()*1e9|0)>>>0,a=r.includes("human")&&this.params.get("overtime")!=="never"?"vote":"never",c={board:this.S.seed,dice:o,terrain:"classic",rounds:Ds.classic.rounds,overtime:a,diceMode:"shared",seats:this.races.map((u,d)=>r[d]==="human"?{race:u,ctrl:r[d],dev:Xu}:{race:u,ctrl:r[d]})};(!this.backdropAsDrawn||!qu(this.backdrop.setup,c))&&this.showTable(c.board,xs(c)),this.S.control=[...r],s.sel=null,s.reach=null,this.seatPlayers(nr(c.seats.map(u=>u.race))),(h=this.traceListener)==null||h.begin(),this.acted.length=0,this.player.snap(this.backdrop,Yu(this.backdrop));const l=new cS;if(this.session=new aS({store:l,localSeats:r.flatMap((u,d)=>u==="human"?[d]:[]),dev:Xu,sink:this.sink,onTrace:this.onTrace}),this.session.start(c),this.session.status!=="live"&&this.session.status!=="over"){const u=this.session.error;throw this.session.close(),this.session=null,this.showTable(this.backdrop.setup.board,xs(this.backdrop.setup)),new Error(`the battle could not start: ${u}`)}n.title.hide(),e.rig.setViews(_u({localSeats:this.session.localSeats,edges:[0,1].map(u=>vr(this.session.G,u))})),this.refreshUI()}follow(t,e){var a,c,l;const{view:n,ui:s,human:r}=this,o=t.G;this.online&&this.leaveOnline(),this.showTable(o.setup.board,xs(o.setup)),this.session=t,this.G=o,this.S.control=o.setup.seats.map(h=>h.ctrl),this.seatPlayers(nr(o.setup.seats.map(h=>h.race))),r.sel=null,r.reach=null,(a=this.traceListener)==null||a.begin(),(l=(c=this.traceListener)==null?void 0:c.rejoin)==null||l.call(c,o),this.acted.length=0,this.online=e,t.sink=this.sink,this.player.snap(o,di(o)),this.relog(t.folder.pushed),s.title.hide(),n.rig.setViews(_u({localSeats:t.localSeats,edges:[0,1].map(h=>vr(o,h))})),this.refreshUI()}redraw(){const t=this.session;this.session=null;try{this.showTable(t.G.setup.board,xs(t.G.setup))}finally{this.session=t,this.G=t.G}}leaveOnline(){const t=this.online;this.online=null,we.boost=1,t==null||t.leave()}relog(t){var s,r;const e=new Ko({out:[]}),n=[];for(const o of t){e.push(o);for(const a of((r=(s=e.G)==null?void 0:s.out)==null?void 0:r.splice(0))??[])a.t==="log"&&n.push(a)}this.ui.log.clear();for(const o of n.slice(-80))this.ui.log.write(o.side,o.html,o.cls,o.at)}catchUp(t){const e=this.player.backlog()/(we.speed*Math.max(we.rate,.05));e>30?(this.acted.length=0,this.player.snap(t.G,di(t.G)),this.relog(t.folder.pushed)):we.boost=e>16?4:e>8?2:1}back(){this.online&&this.leaveOnline(),this.ui.result.hide(),this.ui.title.show(),this.view.rig.toTitle(),this.showTable(this.S.seed)}}const{W:ho,H:nc}=Jn,wn=i=>document.querySelector(i);function fS(i,t){if(!i.has("races"))return Qh;const e=i.get("races").split(",").map(s=>s.trim().toLowerCase());if(e.length===2&&e.every(s=>Tn[s]))return e;const n=`?races= takes two of ${Object.keys(Tn).join(", ")}, comma-separated, not "${i.get("races")}"`;return console.warn(`${n}: playing the classic matchup`),t.note(`${n}, so this is the classic matchup.`),Qh}function dS(i){const t=new URLSearchParams(i.search),e=t.has("fast");let n=null;const s=v=>n.sides[v].color,r=new db({lowfi:t.has("lowfi"),fast:e,W:ho,H:nc,deploy:Ds.classic.deploy,edges:Zf,objectives:Ds.classic.objectives,range:Bo,colorOf:s}),o=(Number(t.get("seed"))||Math.random()*1e6|0)>>>0,a=new Yb,c=fS(t,a),l={tray:new Nb(wn("#tray")),log:new zb(wn("#logList"),()=>n.traceListener),card:new Gb({el:wn("#card"),sides:()=>n.sides,shown:v=>r.units.shown(v.id),live:()=>n.player.idle,ask:v=>_r(n.atTable(),v),facts:()=>n.facts}),tooltip:new Eb(wn("#tooltip")),banner:new $b(wn("#banner")),toast:new jb(wn("#toast")),hud:new Xb,actions:new qb,title:a,result:new Kb};n=new uS({view:r,ui:l,params:t,seed:o,races:c}),n.seatPlayers(nr(c)),r.figures({mirror:()=>n.player.mirror,colorOf:s,W:ho,H:nc,grid:Wf(ho,nc,Qf)});const h=new pb({camera:r.camera,units:r.units,board:r.table.board,unitOf:v=>n.unitById(v)}),u=new Lb({flow:n,view:r,card:l.card,tooltip:l.tooltip,picker:h}),d=n.play(u);u.listen(r.renderer.domElement),l.actions.wire(u),l.hud.wire({rig:r.rig}),Jb();let f=null;const g=v=>(async()=>{if(!f){const{Online:p,loadNet:x}=await $d(async()=>{const{Online:_,loadNet:y}=await import("./online-D_zrYSxx.js");return{Online:_,loadNet:y}},[],import.meta.url);await x(),f??(f=new p({flow:n,params:t}))}return v==="host"?f.host():f.route()})().catch(p=>{console.error(p),l.toast.show(`Online play failed: ${p.message}`,8e3)});if(a.wire({S:n.S,showTable:v=>n.showTable(v),start:v=>n.start(v),online:()=>g("host")}),l.result.wire(()=>n.back(),v=>u.vote(v)),n.showTable(n.S.seed),r.run({mirror:()=>d.mirror,sel:()=>{var v;return(v=u.sel)==null?void 0:v.id}}),t.has("watch")&&n.start("watch"),addEventListener("hashchange",()=>{(f||/[#&]m=/.test(i.hash))&&g()}),/[#&]m=/.test(i.hash)&&g(),t.has("debug")){const{alive:v,isEngaged:m,phaseKey:p,canAct:x,movePlan:_,validEnd:y,freeSpot:R,shotInfo:S,shootTargets:E,chargeTargets:O,chargePlan:M,rngState:w}=hd,{rig:z,scene:j,camera:et,controls:U,renderer:F,effects:q,units:Z,terrain:K,shots:Y}=r,Q=()=>n.atTable(),nt=new Set(["stage","round","active","first","phase","vp","wiped"]),gt=new Set(["titleSpin","titleAngle","viewShift","follow"]),G=new Set(["sel","reach","hover","hoverPick","mouse"]),J={busy:()=>!d.idle,auto:()=>!d.idle,deploySide:()=>u.deploySeat()<0?void 0:u.deploySeat()},mt=[],St=[];let Mt=null;const Ft=()=>d.idle&&!St.length,kt=I=>{if(Mt)return Mt.turn[I];const D=Q(),$=D.turn;return I==="stage"?n.G?$.stage==="over"&&!Ft()?"battle":$.stage:"title":I==="wiped"?$.wiped<0?void 0:$.wiped:I==="phase"?p(D):$[I]},Lt=new Proxy(n.S,{get:(I,D)=>nt.has(D)?kt(D):Object.hasOwn(J,D)?J[D]():gt.has(D)?z[D]:G.has(D)?u[D]:I[D],has:(I,D)=>nt.has(D)||Object.hasOwn(J,D)||gt.has(D)||G.has(D)||D in I,set:(I,D,$)=>{if(nt.has(D))throw new Error(`__ts.S.${D} is the match's ${D==="phase"?"G.turn.ph (phaseKey)":`G.turn.${D}`}: it can't be set through S`);if(Object.hasOwn(J,D))throw new Error(`__ts.S.${D} is derived from the Session and the player: it can't be set`);return gt.has(D)?z[D]=$:G.has(D)?u[D]=$:I[D]=$,!0},ownKeys:I=>[...new Set([...Reflect.ownKeys(I),...G,...nt,...Object.keys(J),...gt])],getOwnPropertyDescriptor:(I,D)=>nt.has(D)?{value:kt(D),enumerable:!0,configurable:!0,writable:!1}:Object.hasOwn(J,D)?{value:J[D](),enumerable:!0,configurable:!0,writable:!1}:gt.has(D)?{value:z[D],enumerable:!0,configurable:!0,writable:!0}:G.has(D)?{value:u[D],enumerable:!0,configurable:!0,writable:!0}:Reflect.getOwnPropertyDescriptor(I,D)}),Kt=I=>{var D;return!!((D=I.out)!=null&&D.length)||!d.idle},B=(I,D)=>{const $=I.turn,ht=/^over /.test(D)&&$.step==="score";return{turn:{stage:$.stage,round:ht?$.round+1:$.round,active:$.active,phase:p(I),first:$.first,vp:[...$.vp],wiped:$.wiped<0?void 0:$.wiped},rng:w(I.rng),units:I.units.map(ut=>({...ut,pos:{...ut.pos},flags:{...ut.flags},models:ut.models.map(X=>({...X}))})),chunks:I.terrain.chunks.map(ut=>({id:ut.id,kind:ut.kind,alive:ut.alive,hp:ut.hp,shape:{...ut.shape}}))}},ge=(I,D)=>{Mt=D;try{mt.push(I)}finally{Mt=null}},Et=[],It=[],_t=(I=()=>!0)=>new Promise(D=>{It.push({until:I,resolve:D}),n.traceListener.settled()});n.traceListener={rejoin:I=>{mt.splice(0,mt.length,...I.journal.trace),St.length=0,Et.length=0},begin:()=>{mt.length=0,St.length=0,Et.length=0;for(const I of It.splice(0))I.resolve()},line:(I,D)=>{const $=/^log /.test(I)?null:B(D,I);/^(act|phase|over) /.test(I)&&Et.push({at:D.out.length,proj:di(D),act:/^act /.test(I)}),St.length||Kt(D)?St.push([I,$]):ge(I,$)},reach:I=>{for(;mt.length<I&&St.length;)ge(...St.shift())},idle:()=>{for(;St.length;)ge(...St.shift())},settled:()=>{if(d.idle)for(const I of It.splice(0)){let D=!0;try{D=I.until()}catch{}D?I.resolve():It.push(I)}},present:(I,D)=>{const $=[],ht=Et.filter(X=>X.act).map(X=>X.proj);let ut=0;for(I.forEach((X,Wt)=>{for(;ut<Et.length&&Et[ut].at<=Wt;)$.push({t:"check",proj:Et[ut++].proj});$.push(X.t==="act"?{...X,proj:ht.shift()}:X)});ut<Et.length;)$.push({t:"check",proj:Et[ut++].proj});return $.push({t:"check",proj:di(D)}),Et.length=0,$}};const ee=(I,D)=>{if(I)throw new Error(`?debug ${D}: ${I}`)},Dt=I=>_r(Q(),I),A=()=>{const I=new Cf,D=new Proxy({},{get:()=>()=>{}}),$={M:null},ht=new Pd({scene:I,labels:document.createElement("div"),fx:D,mirror:()=>$.M,colorOf:X=>n.sides[X].color,W:ho}),ut={clear(){},held:()=>({marker:!1,thorns:0})};return{at:$,units:ht,terrain:new Rd(I,D),shots:ut,effects:D}},b=(I,D,$)=>{I.at.M=$??di(D);const ht=$?D.terrain.chunks.filter(ut=>$.chunks[ut.id]).map(ut=>({...ut,alive:$.chunks[ut.id].alive,shape:{...ut.shape,y:$.chunks[ut.id].y}})):D.terrain.chunks;return r.rebuild(D,I.at.M,{chunks:ht,terrain:I.terrain,units:I.units,shots:I.shots,effects:I.effects}),I.units.paintRings(n.rings()),I},k=(I,D,$,ht)=>({units:ht.units.map(ut=>{const X=I.get(ut.id);if(!X)return{id:ut.id,view:null};const Wt=X.ring,Ut=X.hit;return{id:ut.id,ring:Wt.visible?{x:Wt.position.x,z:Wt.position.z,s:Wt.scale.x,op:Wt.material.opacity,col:Wt.material.color.getHexString()}:null,hit:Ut.visible&&Ut.parent?{x:Ut.position.x,y:Ut.position.y,z:Ut.position.z,sx:Ut.scale.x,sy:Ut.scale.y}:null,figures:X.models.map(Ot=>{var Tt;return(Tt=Ot.mesh)!=null&&Tt.parent?{x:Ot.mesh.position.x,y:Ot.mesh.position.y,z:Ot.mesh.position.z}:null}),label:{html:X.label.innerHTML,display:X.label.style.display||""}}}),chunks:ht.terrain.chunks.map(ut=>({id:ut.id,...D.state(ut.id)})),shots:$.held()}),it=(I,D,$,ht)=>{if(typeof I=="number"&&typeof D=="number")Math.abs(I-D)<=1e-6||ht.push(`${$}: ${I} | ${D}`);else if(I&&D&&typeof I=="object"&&typeof D=="object"){const ut=[...new Set([...Object.keys(I),...Object.keys(D)])];for(const X of ut)it(I[X],D[X],`${$}.${X}`,ht)}else I!==D&&ht.push(`${$}: ${JSON.stringify(I)} | ${JSON.stringify(D)}`);return ht};let tt=null;const ot=(I=null)=>{const D=Q();if(!I&&!d.idle)throw new Error("?debug view.snapDiff: the player is still playing");const $=k(Z,K,Y,D),ht=b(A(),D,I);tt=b(tt??A(),D,I);const ut=[...it($,k(ht.units,ht.terrain,ht.shots,D),"fresh",[]),...it($,k(tt.units,tt.terrain,tt.shots,D),"kept",[])];return ht.units.dispose(),ht.terrain.dispose(),{diffs:ut.slice(0,12),n:ut.length,units:$.units.length,figures:$.units.reduce((X,Wt)=>{var Ut;return X+(((Ut=Wt.figures)==null?void 0:Ut.filter(Boolean).length)??0)},0),chunks:$.chunks.length,shown:$.chunks.filter(X=>X.shown).length}};window.__ts={S:Lt,clock:we,camera:et,controls:U,renderer:F,trace:mt,get G(){return n.G},get session(){return n.session},get net(){return f},goOnline:g,get hud(){return n.shownHud},get player(){return d},present:{listen(I){d.observer=I},card(I){var D;return l.card.show(I),((D=/class="card-sub">([^<]*)</.exec(wn("#card").innerHTML))==null?void 0:D[1])??null}},get units(){return Mt?Mt.units:Q().units},get nav(){return Q().nav},scenery:{get chunks(){return Mt?Mt.chunks:Q().terrain.chunks},scene:j,blast(I,D,$,ht,ut){if(n.G)throw new Error("?debug scenery.blast: only on the title screen (no battle)");const X=[],Wt=n.backdrop.terrain.blast(I,D,$,ht,ut,X);return n.backdropAsDrawn=!1,d.push(X),Gi(n.backdrop),Wt}},validEnd:(I,D)=>Dt($=>y($,I,D)),get phaseResolve(){return u.myTurn()||null},get chargePick(){const I=u.picking();return I&&{u:I.u,plan:I.plan,ok:I.ok}},get roundLimit(){return u.mode()==="roundLimit"?u.voters():null},start:I=>n.start(I),select:I=>u.select(I),doMove:(I,D)=>(ee(u.moveTo(I,D),"doMove"),_t()),doAdvance:I=>(ee(u.advance(I),"doAdvance"),_t()),doShoot:(I,D)=>(ee(u.shoot(I,D),"doShoot"),_t()),doCharge:(I,D)=>{ee(u.charge(I,D),"doCharge");const $=n.session;return _t(()=>{var ht;return $!==n.session||((ht=$.G.pending)==null?void 0:ht.k)!=="chargeEnd"})},placeCharge:I=>(ee(u.placeCharge(I),"placeCharge"),_t()),deployClick:(I,D)=>ee(u.deployClick(I,D),"deployClick"),endPhase:()=>(ee(wn("#endPhase").onclick(),"endPhase"),_t()),autoPhase:()=>(ee(wn("#autoPhase").onclick(),"autoPhase"),_t()),vote:(I,D)=>(ee(D===void 0?wn(I?"#keepPlaying":"#endBattle").onclick():u.vote(I,[D]),"vote"),_t()),q:{alive:v,isEngaged:I=>Dt(D=>m(D,I)),canAct:I=>Dt(D=>x(D,I)),movePlan:(I,D)=>Dt($=>_($,I,D)),freeSpot:(I,D,$,ht,ut)=>Dt(X=>R(X,I,D,$,ht,ut)),shootTargets:I=>Dt(D=>E(D,I)),shotInfo:(I,D)=>Dt($=>S($,I,D)),chargeTargets:I=>Dt(D=>O(D,I)),chargePlan:(I,D)=>Dt($=>M($,I,D)),rngState:()=>Mt?Mt.rng:w(Q().rng)},screen(I,D,$){const ht=new C(I,D,$).project(et);return[(ht.x*.5+.5)*innerWidth,(-ht.y*.5+.5)*innerHeight]},view:{snapDiff:ot,pauseAtChecks(I){n.checkHook=I},counts:()=>{let I=0;return j.traverse(D=>D.userData.fig&&I++),{scene:j.children.length,terrain:K.group.children.length,figures:I,labels:r.stage.overlay.children.length,marks:q.decals.length}}}}}}dS(location);export{_o as C,Ds as M,Tn as R,aS as S,$d as _,xo as a,Ac as b,Md as c,zd as d,Tc as e,Ls as f,vs as s};
