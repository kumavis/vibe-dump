(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Xd="modulepreload",qd=function(i,t){return new URL(i,t).href},hc={},Yd=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){const o=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));s=Promise.allSettled(e.map(c=>{if(c=qd(c,n),c in hc)return;hc[c]=!0;const h=c.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(!!n)for(let g=o.length-1;g>=0;g--){const v=o[g];if(v.href===c&&(!h||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${u}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":Xd,h||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),h)return new Promise((g,v)=>{f.addEventListener("load",g),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})};/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ll="160",Gn={ROTATE:0,DOLLY:1,PAN:2},Ki={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Kd=0,uc=1,Jd=2,Qu=1,tf=2,Vn=3,mi=0,Ze=1,an=2,ci=0,Ms=1,fc=2,dc=3,pc=4,Zd=5,Ri=100,Qd=101,tp=102,mc=103,gc=104,ep=200,np=201,ip=202,sp=203,rl=204,ol=205,rp=206,op=207,ap=208,lp=209,cp=210,hp=211,up=212,fp=213,dp=214,pp=0,mp=1,gp=2,So=3,vp=4,xp=5,_p=6,yp=7,Dl=0,bp=1,Mp=2,hi=0,Sp=1,wp=2,Ep=3,ef=4,Tp=5,Ap=6,nf=300,Rs=301,Cs=302,al=303,ll=304,Oo=306,wo=1e3,bn=1001,cl=1002,Oe=1003,vc=1004,na=1005,Je=1006,Rp=1007,gr=1008,ui=1009,Cp=1010,Pp=1011,Il=1012,sf=1013,ai=1014,li=1015,vr=1016,rf=1017,of=1018,Oi=1020,Lp=1021,fn=1023,Dp=1024,Ip=1025,Ni=1026,Ps=1027,Up=1028,af=1029,Op=1030,lf=1031,cf=1033,ia=33776,sa=33777,ra=33778,oa=33779,xc=35840,_c=35841,yc=35842,bc=35843,hf=36196,Mc=37492,Sc=37496,wc=37808,Ec=37809,Tc=37810,Ac=37811,Rc=37812,Cc=37813,Pc=37814,Lc=37815,Dc=37816,Ic=37817,Uc=37818,Oc=37819,Nc=37820,zc=37821,aa=36492,kc=36494,Fc=36495,Np=36283,Bc=36284,Hc=36285,Vc=36286,uf=3e3,zi=3001,zp=3200,kp=3201,Ul=0,Fp=1,dn="",we="srgb",Zn="srgb-linear",Ol="display-p3",No="display-p3-linear",Eo="linear",le="srgb",To="rec709",Ao="p3",Ji=7680,Wc=519,Bp=512,Hp=513,Vp=514,ff=515,Wp=516,Gp=517,$p=518,jp=519,Gc=35044,Xp=35048,$c="300 es",hl=1035,Xn=2e3,Ro=2001;class $i{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const ke=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],go=Math.PI/180,ul=180/Math.PI;function wr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ke[i&255]+ke[i>>8&255]+ke[i>>16&255]+ke[i>>24&255]+"-"+ke[t&255]+ke[t>>8&255]+"-"+ke[t>>16&15|64]+ke[t>>24&255]+"-"+ke[e&63|128]+ke[e>>8&255]+"-"+ke[e>>16&255]+ke[e>>24&255]+ke[n&255]+ke[n>>8&255]+ke[n>>16&255]+ke[n>>24&255]).toLowerCase()}function De(i,t,e){return Math.max(t,Math.min(e,i))}function qp(i,t){return(i%t+t)%t}function la(i,t,e){return(1-e)*i+e*t}function jc(i){return(i&i-1)===0&&i!==0}function fl(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function js(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function qe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Yp={DEG2RAD:go};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,n,s,r,o,a,l,c){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],_=s[1],x=s[4],y=s[7],R=s[2],S=s[5],E=s[8];return r[0]=o*v+a*_+l*R,r[3]=o*m+a*x+l*S,r[6]=o*p+a*y+l*E,r[1]=c*v+h*_+u*R,r[4]=c*m+h*x+u*S,r[7]=c*p+h*y+u*E,r[2]=d*v+f*_+g*R,r[5]=d*m+f*x+g*S,r[8]=d*p+f*y+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*c-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=d*v,t[4]=(h*e-s*l)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*l-c*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ca.makeScale(t,e)),this}rotate(t){return this.premultiply(ca.makeRotation(-t)),this}translate(t,e){return this.premultiply(ca.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ca=new Zt;function df(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Co(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Kp(){const i=Co("canvas");return i.style.display="block",i}const Xc={};function rr(i){i in Xc||(Xc[i]=!0,console.warn(i))}const qc=new Zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Yc=new Zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Or={[Zn]:{transfer:Eo,primaries:To,toReference:i=>i,fromReference:i=>i},[we]:{transfer:le,primaries:To,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[No]:{transfer:Eo,primaries:Ao,toReference:i=>i.applyMatrix3(Yc),fromReference:i=>i.applyMatrix3(qc)},[Ol]:{transfer:le,primaries:Ao,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Yc),fromReference:i=>i.applyMatrix3(qc).convertLinearToSRGB()}},Jp=new Set([Zn,No]),ae={enabled:!0,_workingColorSpace:Zn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Jp.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Or[t].toReference,s=Or[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Or[i].primaries},getTransfer:function(i){return i===dn?Eo:Or[i].transfer}};function Ss(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ha(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Zi;class pf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Zi===void 0&&(Zi=Co("canvas")),Zi.width=t.width,Zi.height=t.height;const n=Zi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Zi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Co("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ss(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ss(e[n]/255)*255):e[n]=Ss(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Zp=0;class mf{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=wr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ua(s[o].image)):r.push(ua(s[o]))}else r=ua(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ua(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?pf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qp=0;class $e extends $i{constructor(t=$e.DEFAULT_IMAGE,e=$e.DEFAULT_MAPPING,n=bn,s=bn,r=Je,o=gr,a=fn,l=ui,c=$e.DEFAULT_ANISOTROPY,h=dn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=wr(),this.name="",this.source=new mf(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(rr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===zi?we:dn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==nf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case wo:t.x=t.x-Math.floor(t.x);break;case bn:t.x=t.x<0?0:1;break;case cl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case wo:t.y=t.y-Math.floor(t.y);break;case bn:t.y=t.y<0?0:1;break;case cl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return rr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===we?zi:uf}set encoding(t){rr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===zi?we:dn}}$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=nf;$e.DEFAULT_ANISOTROPY=1;class ce{constructor(t=0,e=0,n=0,s=1){ce.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,y=(f+1)/2,R=(p+1)/2,S=(h+d)/4,E=(u+v)/4,O=(g+m)/4;return x>y&&x>R?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=S/n,r=E/n):y>R?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=S/s,r=O/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=E/r,s=O/r),this.set(n,s,r,e),this}let _=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(u-v)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tm extends $i{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ce(0,0,t,e),this.scissorTest=!1,this.viewport=new ce(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(rr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===zi?we:dn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Je,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new $e(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new mf(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Bi extends tm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class gf extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class em extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Oe,this.minFilter=Oe,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||l!==d||c!==f||h!==g){let m=1-a;const p=l*d+c*f+h*g+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const R=Math.sqrt(x),S=Math.atan2(R,p*_);m=Math.sin(m*S)/R,a=Math.sin(a*S)/R}const y=a*_;if(l=l*m+d*y,c=c*m+f*y,h=h*m+g*y,u=u*m+v*y,m===1-a){const R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(De(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Kc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Kc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return fa.copy(this).projectOnVector(t),this.sub(fa)}reflect(t){return this.sub(fa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(De(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fa=new C,Kc=new Pn;class ji{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(gn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(gn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=gn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,gn):gn.fromBufferAttribute(r,o),gn.applyMatrix4(t.matrixWorld),this.expandByPoint(gn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Nr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Nr.copy(n.boundingBox)),Nr.applyMatrix4(t.matrixWorld),this.union(Nr)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,gn),gn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Xs),zr.subVectors(this.max,Xs),Qi.subVectors(t.a,Xs),ts.subVectors(t.b,Xs),es.subVectors(t.c,Xs),ti.subVectors(ts,Qi),ei.subVectors(es,ts),yi.subVectors(Qi,es);let e=[0,-ti.z,ti.y,0,-ei.z,ei.y,0,-yi.z,yi.y,ti.z,0,-ti.x,ei.z,0,-ei.x,yi.z,0,-yi.x,-ti.y,ti.x,0,-ei.y,ei.x,0,-yi.y,yi.x,0];return!da(e,Qi,ts,es,zr)||(e=[1,0,0,0,1,0,0,0,1],!da(e,Qi,ts,es,zr))?!1:(kr.crossVectors(ti,ei),e=[kr.x,kr.y,kr.z],da(e,Qi,ts,es,zr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const zn=[new C,new C,new C,new C,new C,new C,new C,new C],gn=new C,Nr=new ji,Qi=new C,ts=new C,es=new C,ti=new C,ei=new C,yi=new C,Xs=new C,zr=new C,kr=new C,bi=new C;function da(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){bi.fromArray(i,r);const a=s.x*Math.abs(bi.x)+s.y*Math.abs(bi.y)+s.z*Math.abs(bi.z),l=t.dot(bi),c=e.dot(bi),h=n.dot(bi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const nm=new ji,qs=new C,pa=new C;class Fs{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):nm.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;qs.subVectors(t,this.center);const e=qs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(qs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(qs.copy(t.center).add(pa)),this.expandByPoint(qs.copy(t.center).sub(pa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const kn=new C,ma=new C,Fr=new C,ni=new C,ga=new C,Br=new C,va=new C;class zo{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ma.copy(t).add(e).multiplyScalar(.5),Fr.copy(e).sub(t).normalize(),ni.copy(this.origin).sub(ma);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Fr),a=ni.dot(this.direction),l=-ni.dot(Fr),c=ni.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ma).addScaledVector(Fr,d),f}intersectSphere(t,e){kn.subVectors(t.center,this.origin);const n=kn.dot(this.direction),s=kn.dot(kn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,n,s,r){ga.subVectors(e,t),Br.subVectors(n,t),va.crossVectors(ga,Br);let o=this.direction.dot(va),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ni.subVectors(this.origin,t);const l=a*this.direction.dot(Br.crossVectors(ni,Br));if(l<0)return null;const c=a*this.direction.dot(ga.cross(ni));if(c<0||l+c>o)return null;const h=-a*ni.dot(va);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,n,s,r,o,a,l,c,h,u,d,f,g,v,m){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,v,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/ns.setFromMatrixColumn(t,0).length(),r=1/ns.setFromMatrixColumn(t,1).length(),o=1/ns.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-v*c,e[9]=-a*l,e[2]=v-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,v=c*u;e[0]=d+v*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,v=c*u;e[0]=d-v*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+v,e[1]=l*u,e[5]=v*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=a*l,v=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(im,t,sm)}lookAt(t,e,n){const s=this.elements;return nn.subVectors(t,e),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),ii.crossVectors(n,nn),ii.lengthSq()===0&&(Math.abs(n.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),ii.crossVectors(n,nn)),ii.normalize(),Hr.crossVectors(nn,ii),s[0]=ii.x,s[4]=Hr.x,s[8]=nn.x,s[1]=ii.y,s[5]=Hr.y,s[9]=nn.y,s[2]=ii.z,s[6]=Hr.z,s[10]=nn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],_=n[3],x=n[7],y=n[11],R=n[15],S=s[0],E=s[4],O=s[8],b=s[12],w=s[1],k=s[5],$=s[9],et=s[13],I=s[2],F=s[6],X=s[10],J=s[14],Y=s[3],q=s[7],Q=s[11],ot=s[15];return r[0]=o*S+a*w+l*I+c*Y,r[4]=o*E+a*k+l*F+c*q,r[8]=o*O+a*$+l*X+c*Q,r[12]=o*b+a*et+l*J+c*ot,r[1]=h*S+u*w+d*I+f*Y,r[5]=h*E+u*k+d*F+f*q,r[9]=h*O+u*$+d*X+f*Q,r[13]=h*b+u*et+d*J+f*ot,r[2]=g*S+v*w+m*I+p*Y,r[6]=g*E+v*k+m*F+p*q,r[10]=g*O+v*$+m*X+p*Q,r[14]=g*b+v*et+m*J+p*ot,r[3]=_*S+x*w+y*I+R*Y,r[7]=_*E+x*k+y*F+R*q,r[11]=_*O+x*$+y*X+R*Q,r[15]=_*b+x*et+y*J+R*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+v*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],_=u*m*c-v*d*c+v*l*f-a*m*f-u*l*p+a*d*p,x=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,y=h*v*c-g*u*c+g*a*f-o*v*f-h*a*p+o*u*p,R=g*u*l-h*v*l-g*a*d+o*v*d+h*a*m-o*u*m,S=e*_+n*x+s*y+r*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/S;return t[0]=_*E,t[1]=(v*d*r-u*m*r-v*s*f+n*m*f+u*s*p-n*d*p)*E,t[2]=(a*m*r-v*l*r+v*s*c-n*m*c-a*s*p+n*l*p)*E,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*E,t[4]=x*E,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*E,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*E,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*f+e*l*f)*E,t[8]=y*E,t[9]=(g*u*r-h*v*r-g*n*f+e*v*f+h*n*p-e*u*p)*E,t[10]=(o*v*r-g*a*r+g*n*c-e*v*c-o*n*p+e*a*p)*E,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*E,t[12]=R*E,t[13]=(h*v*s-g*u*s+g*n*d-e*v*d-h*n*m+e*u*m)*E,t[14]=(g*a*s-o*v*s-g*n*l+e*v*l+o*n*m-e*a*m)*E,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,v=o*h,m=o*u,p=a*u,_=l*c,x=l*h,y=l*u,R=n.x,S=n.y,E=n.z;return s[0]=(1-(v+p))*R,s[1]=(f+y)*R,s[2]=(g-x)*R,s[3]=0,s[4]=(f-y)*S,s[5]=(1-(d+p))*S,s[6]=(m+_)*S,s[7]=0,s[8]=(g+x)*E,s[9]=(m-_)*E,s[10]=(1-(d+v))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=ns.set(s[0],s[1],s[2]).length();const o=ns.set(s[4],s[5],s[6]).length(),a=ns.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],vn.copy(this);const c=1/r,h=1/o,u=1/a;return vn.elements[0]*=c,vn.elements[1]*=c,vn.elements[2]*=c,vn.elements[4]*=h,vn.elements[5]*=h,vn.elements[6]*=h,vn.elements[8]*=u,vn.elements[9]*=u,vn.elements[10]*=u,e.setFromRotationMatrix(vn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Xn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(a===Xn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ro)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Xn){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,f=(n+s)*h;let g,v;if(a===Xn)g=(o+r)*u,v=-2*u;else if(a===Ro)g=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ns=new C,vn=new re,im=new C(0,0,0),sm=new C(1,1,1),ii=new C,Hr=new C,nn=new C,Jc=new re,Zc=new Pn;class Bs{constructor(t=0,e=0,n=0,s=Bs.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(De(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-De(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(De(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-De(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(De(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-De(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Jc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Zc.setFromEuler(this),this.setFromQuaternion(Zc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Bs.DEFAULT_ORDER="XYZ";class Nl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rm=0;const Qc=new C,is=new Pn,Fn=new re,Vr=new C,Ys=new C,om=new C,am=new Pn,th=new C(1,0,0),eh=new C(0,1,0),nh=new C(0,0,1),lm={type:"added"},cm={type:"removed"};class Ie extends $i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=wr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ie.DEFAULT_UP.clone();const t=new C,e=new Bs,n=new Pn,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new re},normalMatrix:{value:new Zt}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=Ie.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ie.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.multiply(is),this}rotateOnWorldAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.premultiply(is),this}rotateX(t){return this.rotateOnAxis(th,t)}rotateY(t){return this.rotateOnAxis(eh,t)}rotateZ(t){return this.rotateOnAxis(nh,t)}translateOnAxis(t,e){return Qc.copy(t).applyQuaternion(this.quaternion),this.position.add(Qc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(th,t)}translateY(t){return this.translateOnAxis(eh,t)}translateZ(t){return this.translateOnAxis(nh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Vr.copy(t):Vr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(Ys,Vr,this.up):Fn.lookAt(Vr,Ys,this.up),this.quaternion.setFromRotationMatrix(Fn),s&&(Fn.extractRotation(s.matrixWorld),is.setFromRotationMatrix(Fn),this.quaternion.premultiply(is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(lm)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(cm)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,t,om),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ys,am,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ie.DEFAULT_UP=new C(0,1,0);Ie.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ie.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const xn=new C,Bn=new C,xa=new C,Hn=new C,ss=new C,rs=new C,ih=new C,_a=new C,ya=new C,ba=new C;let Wr=!1;class yn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),xn.subVectors(t,e),s.cross(xn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){xn.subVectors(s,e),Bn.subVectors(n,e),xa.subVectors(t,e);const o=xn.dot(xn),a=xn.dot(Bn),l=xn.dot(xa),c=Bn.dot(Bn),h=Bn.dot(xa),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Hn)===null?!1:Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getUV(t,e,n,s,r,o,a,l){return Wr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Wr=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Hn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Hn.x),l.addScaledVector(o,Hn.y),l.addScaledVector(a,Hn.z),l)}static isFrontFacing(t,e,n,s){return xn.subVectors(n,e),Bn.subVectors(t,e),xn.cross(Bn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return xn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),xn.cross(Bn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return yn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return yn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Wr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Wr=!0),yn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return yn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return yn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return yn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ss.subVectors(s,n),rs.subVectors(r,n),_a.subVectors(t,n);const l=ss.dot(_a),c=rs.dot(_a);if(l<=0&&c<=0)return e.copy(n);ya.subVectors(t,s);const h=ss.dot(ya),u=rs.dot(ya);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(ss,o);ba.subVectors(t,r);const f=ss.dot(ba),g=rs.dot(ba);if(g>=0&&f<=g)return e.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(rs,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return ih.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(ih,a);const p=1/(m+v+d);return o=v*p,a=d*p,e.copy(n).addScaledVector(ss,o).addScaledVector(rs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const vf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},si={h:0,s:0,l:0},Gr={h:0,s:0,l:0};function Ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=we){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=ae.workingColorSpace){if(t=qp(t,1),e=De(e,0,1),n=De(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ma(o,r,t+1/3),this.g=Ma(o,r,t),this.b=Ma(o,r,t-1/3)}return ae.toWorkingColorSpace(this,s),this}setStyle(t,e=we){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=we){const n=vf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ss(t.r),this.g=Ss(t.g),this.b=Ss(t.b),this}copyLinearToSRGB(t){return this.r=ha(t.r),this.g=ha(t.g),this.b=ha(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=we){return ae.fromWorkingColorSpace(Fe.copy(this),t),Math.round(De(Fe.r*255,0,255))*65536+Math.round(De(Fe.g*255,0,255))*256+Math.round(De(Fe.b*255,0,255))}getHexString(t=we){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.fromWorkingColorSpace(Fe.copy(this),e);const n=Fe.r,s=Fe.g,r=Fe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ae.workingColorSpace){return ae.fromWorkingColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=we){ae.fromWorkingColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,s=Fe.b;return t!==we?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(si),this.setHSL(si.h+t,si.s+e,si.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(si),t.getHSL(Gr);const n=la(si.h,Gr.h,e),s=la(si.s,Gr.s,e),r=la(si.l,Gr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new qt;qt.NAMES=vf;let hm=0;class Xi extends $i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=wr(),this.name="",this.type="Material",this.blending=Ms,this.side=mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rl,this.blendDst=ol,this.blendEquation=Ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=So,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Wc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ms&&(n.blending=this.blending),this.side!==mi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==rl&&(n.blendSrc=this.blendSrc),this.blendDst!==ol&&(n.blendDst=this.blendDst),this.blendEquation!==Ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==So&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Wc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class We extends Xi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new C,$r=new ft;class cn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Gc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)$r.fromBufferAttribute(this,e),$r.applyMatrix3(t),this.setXY(e,$r.x,$r.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=js(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=js(e,this.array)),e}setX(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=js(e,this.array)),e}setY(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=js(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=js(e,this.array)),e}setW(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),n=qe(n,this.array),s=qe(s,this.array),r=qe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Gc&&(t.usage=this.usage),t}}class xf extends cn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class _f extends cn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends cn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let um=0;const un=new re,Sa=new Ie,os=new C,sn=new ji,Ks=new ji,Le=new C;class de extends $i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=wr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(df(t)?_f:xf)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return un.makeRotationFromQuaternion(t),this.applyMatrix4(un),this}rotateX(t){return un.makeRotationX(t),this.applyMatrix4(un),this}rotateY(t){return un.makeRotationY(t),this.applyMatrix4(un),this}rotateZ(t){return un.makeRotationZ(t),this.applyMatrix4(un),this}translate(t,e,n){return un.makeTranslation(t,e,n),this.applyMatrix4(un),this}scale(t,e,n){return un.makeScale(t,e,n),this.applyMatrix4(un),this}lookAt(t){return Sa.lookAt(t),Sa.updateMatrix(),this.applyMatrix4(Sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(os).negate(),this.translate(os.x,os.y,os.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ie(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ji);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];sn.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(sn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Ks.setFromBufferAttribute(a),this.morphTargetsRelative?(Le.addVectors(sn.min,Ks.min),sn.expandByPoint(Le),Le.addVectors(sn.max,Ks.max),sn.expandByPoint(Le)):(sn.expandByPoint(Ks.min),sn.expandByPoint(Ks.max))}sn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Le.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Le));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Le.fromBufferAttribute(a,c),l&&(os.fromBufferAttribute(t,c),Le.add(os)),s=Math.max(s,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new cn(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let w=0;w<a;w++)c[w]=new C,h[w]=new C;const u=new C,d=new C,f=new C,g=new ft,v=new ft,m=new ft,p=new C,_=new C;function x(w,k,$){u.fromArray(s,w*3),d.fromArray(s,k*3),f.fromArray(s,$*3),g.fromArray(o,w*2),v.fromArray(o,k*2),m.fromArray(o,$*2),d.sub(u),f.sub(u),v.sub(g),m.sub(g);const et=1/(v.x*m.y-m.x*v.y);isFinite(et)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-v.y).multiplyScalar(et),_.copy(f).multiplyScalar(v.x).addScaledVector(d,-m.x).multiplyScalar(et),c[w].add(p),c[k].add(p),c[$].add(p),h[w].add(_),h[k].add(_),h[$].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let w=0,k=y.length;w<k;++w){const $=y[w],et=$.start,I=$.count;for(let F=et,X=et+I;F<X;F+=3)x(n[F+0],n[F+1],n[F+2])}const R=new C,S=new C,E=new C,O=new C;function b(w){E.fromArray(r,w*3),O.copy(E);const k=c[w];R.copy(k),R.sub(E.multiplyScalar(E.dot(k))).normalize(),S.crossVectors(O,k);const et=S.dot(h[w])<0?-1:1;l[w*4]=R.x,l[w*4+1]=R.y,l[w*4+2]=R.z,l[w*4+3]=et}for(let w=0,k=y.length;w<k;++w){const $=y[w],et=$.start,I=$.count;for(let F=et,X=et+I;F<X;F+=3)b(n[F+0]),b(n[F+1]),b(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new cn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new cn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new de,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const sh=new re,Mi=new zo,jr=new Fs,rh=new C,as=new C,ls=new C,cs=new C,wa=new C,Xr=new C,qr=new ft,Yr=new ft,Kr=new ft,oh=new C,ah=new C,lh=new C,Jr=new C,Zr=new C;class Gt extends Ie{constructor(t=new de,e=new We){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Xr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(wa.fromBufferAttribute(u,t),o?Xr.addScaledVector(wa,h):Xr.addScaledVector(wa.sub(e),h))}e.add(Xr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(r),Mi.copy(t.ray).recast(t.near),!(jr.containsPoint(Mi.origin)===!1&&(Mi.intersectSphere(jr,rh)===null||Mi.origin.distanceToSquared(rh)>(t.far-t.near)**2))&&(sh.copy(r).invert(),Mi.copy(t.ray).applyMatrix4(sh),!(n.boundingBox!==null&&Mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Mi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],_=Math.max(m.start,f.start),x=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=_,R=x;y<R;y+=3){const S=a.getX(y),E=a.getX(y+1),O=a.getX(y+2);s=Qr(this,p,t,n,c,h,u,S,E,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const _=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);s=Qr(this,o,t,n,c,h,u,_,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],_=Math.max(m.start,f.start),x=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=_,R=x;y<R;y+=3){const S=y,E=y+1,O=y+2;s=Qr(this,p,t,n,c,h,u,S,E,O),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const _=m,x=m+1,y=m+2;s=Qr(this,o,t,n,c,h,u,_,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function fm(i,t,e,n,s,r,o,a){let l;if(t.side===Ze?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===mi,a),l===null)return null;Zr.copy(a),Zr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Zr);return c<e.near||c>e.far?null:{distance:c,point:Zr.clone(),object:i}}function Qr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,as),i.getVertexPosition(l,ls),i.getVertexPosition(c,cs);const h=fm(i,t,e,n,as,ls,cs,Jr);if(h){s&&(qr.fromBufferAttribute(s,a),Yr.fromBufferAttribute(s,l),Kr.fromBufferAttribute(s,c),h.uv=yn.getInterpolation(Jr,as,ls,cs,qr,Yr,Kr,new ft)),r&&(qr.fromBufferAttribute(r,a),Yr.fromBufferAttribute(r,l),Kr.fromBufferAttribute(r,c),h.uv1=yn.getInterpolation(Jr,as,ls,cs,qr,Yr,Kr,new ft),h.uv2=h.uv1),o&&(oh.fromBufferAttribute(o,a),ah.fromBufferAttribute(o,l),lh.fromBufferAttribute(o,c),h.normal=yn.getInterpolation(Jr,as,ls,cs,oh,ah,lh,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new C,materialIndex:0};yn.getNormal(as,ls,cs,u.normal),h.face=u}return h}class Ln extends de{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(u,2));function g(v,m,p,_,x,y,R,S,E,O,b){const w=y/E,k=R/O,$=y/2,et=R/2,I=S/2,F=E+1,X=O+1;let J=0,Y=0;const q=new C;for(let Q=0;Q<X;Q++){const ot=Q*k-et;for(let dt=0;dt<F;dt++){const G=dt*w-$;q[v]=G*_,q[m]=ot*x,q[p]=I,c.push(q.x,q.y,q.z),q[v]=0,q[m]=0,q[p]=S>0?1:-1,h.push(q.x,q.y,q.z),u.push(dt/E),u.push(1-Q/O),J+=1}}for(let Q=0;Q<O;Q++)for(let ot=0;ot<E;ot++){const dt=d+ot+F*Q,G=d+ot+F*(Q+1),Z=d+(ot+1)+F*(Q+1),pt=d+(ot+1)+F*Q;l.push(dt,G,pt),l.push(G,Z,pt),Y+=6}a.addGroup(f,Y,b),f+=Y,d+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ln(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ls(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){const t={};for(let e=0;e<i.length;e++){const n=Ls(i[e]);for(const s in n)t[s]=n[s]}return t}function dm(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function yf(i){return i.getRenderTarget()===null?i.outputColorSpace:ae.workingColorSpace}const pm={clone:Ls,merge:Ve};var mm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Hi extends Xi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mm,this.fragmentShader=gm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ls(t.uniforms),this.uniformsGroups=dm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class bf extends Ie{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=Xn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class on extends bf{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ul*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(go*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ul*2*Math.atan(Math.tan(go*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(go*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hs=-90,us=1;class vm extends Ie{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new on(hs,us,t,e);s.layers=this.layers,this.add(s);const r=new on(hs,us,t,e);r.layers=this.layers,this.add(r);const o=new on(hs,us,t,e);o.layers=this.layers,this.add(o);const a=new on(hs,us,t,e);a.layers=this.layers,this.add(a);const l=new on(hs,us,t,e);l.layers=this.layers,this.add(l);const c=new on(hs,us,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ro)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Mf extends $e{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Rs,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class xm extends Bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(rr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===zi?we:dn),this.texture=new Mf(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Je}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ln(5,5,5),r=new Hi({name:"CubemapFromEquirect",uniforms:Ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ze,blending:ci});r.uniforms.tEquirect.value=e;const o=new Gt(s,r),a=e.minFilter;return e.minFilter===gr&&(e.minFilter=Je),new vm(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Ea=new C,_m=new C,ym=new Zt;class oi{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Ea.subVectors(n,e).cross(_m.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ea),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ym.getNormalMatrix(t),s=this.coplanarPoint(Ea).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Si=new Fs,to=new C;class zl{constructor(t=new oi,e=new oi,n=new oi,s=new oi,r=new oi,o=new oi){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Xn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],v=s[10],m=s[11],p=s[12],_=s[13],x=s[14],y=s[15];if(n[0].setComponents(l-r,d-c,m-f,y-p).normalize(),n[1].setComponents(l+r,d+c,m+f,y+p).normalize(),n[2].setComponents(l+o,d+h,m+g,y+_).normalize(),n[3].setComponents(l-o,d-h,m-g,y-_).normalize(),n[4].setComponents(l-a,d-u,m-v,y-x).normalize(),e===Xn)n[5].setComponents(l+a,d+u,m+v,y+x).normalize();else if(e===Ro)n[5].setComponents(a,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(t){return Si.center.set(0,0,0),Si.radius=.7071067811865476,Si.applyMatrix4(t.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(to.x=s.normal.x>0?t.max.x:t.min.x,to.y=s.normal.y>0?t.max.y:t.min.y,to.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(to)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Sf(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function bm(i,t){const e=t.isWebGL2,n=new WeakMap;function s(c,h){const u=c.array,d=c.usage,f=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),c.onUploadCallback();let v;if(u instanceof Float32Array)v=i.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=i.SHORT;else if(u instanceof Uint32Array)v=i.UNSIGNED_INT;else if(u instanceof Int32Array)v=i.INT;else if(u instanceof Int8Array)v=i.BYTE;else if(u instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,c),f.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let v=0,m=g.length;v<m;v++){const p=g[v];e?i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}class fi extends de{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const _=p*d-o;for(let x=0;x<c;x++){const y=x*u-r;g.push(y,-_,0),v.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){const x=_+c*p,y=_+c*(p+1),R=_+1+c*(p+1),S=_+1+c*p;f.push(x,y,S),f.push(y,R,S)}this.setIndex(f),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fi(t.width,t.height,t.widthSegments,t.heightSegments)}}var Mm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sm=`#ifdef USE_ALPHAHASH
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
#endif`,wm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Em=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tm=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Am=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rm=`#ifdef USE_AOMAP
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
#endif`,Cm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pm=`#ifdef USE_BATCHING
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
#endif`,Lm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Dm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Im=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Um=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Om=`#ifdef USE_IRIDESCENCE
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
#endif`,Nm=`#ifdef USE_BUMPMAP
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
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,km=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Wm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Gm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,$m=`#define PI 3.141592653589793
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
} // validated`,jm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xm=`vec3 transformedNormal = objectNormal;
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
#endif`,qm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ym=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Km=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Zm="gl_FragColor = linearToOutputTexel( gl_FragColor );",Qm=`
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
}`,t0=`#ifdef USE_ENVMAP
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
#endif`,e0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,n0=`#ifdef USE_ENVMAP
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
#endif`,i0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,s0=`#ifdef USE_ENVMAP
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
#endif`,r0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,o0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,a0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,l0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,c0=`#ifdef USE_GRADIENTMAP
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
}`,h0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,u0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,f0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,d0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,p0=`uniform bool receiveShadow;
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
#endif`,m0=`#ifdef USE_ENVMAP
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
#endif`,g0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,v0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,x0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,y0=`PhysicalMaterial material;
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
#endif`,b0=`struct PhysicalMaterial {
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
}`,M0=`
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
#endif`,S0=`#if defined( RE_IndirectDiffuse )
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
#endif`,w0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,E0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,T0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,A0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,R0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,C0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,P0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,L0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,D0=`#if defined( USE_POINTS_UV )
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
#endif`,I0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,U0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,O0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,N0=`#ifdef USE_MORPHNORMALS
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
#endif`,z0=`#ifdef USE_MORPHTARGETS
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
#endif`,k0=`#ifdef USE_MORPHTARGETS
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
#endif`,F0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,B0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,H0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,V0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,G0=`#ifdef USE_NORMALMAP
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
#endif`,$0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,j0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,X0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,q0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Y0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,K0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,J0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Z0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Q0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,eg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ng=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ig=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,og=`float getShadowMask() {
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
}`,ag=`#ifdef USE_SKINNING
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
#endif`,cg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hg=`#ifdef USE_SKINNING
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
#endif`,ug=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,mg=`#ifdef USE_TRANSMISSION
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
#endif`,gg=`#ifdef USE_TRANSMISSION
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
#endif`,vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
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
}`,Mg=`uniform sampler2D t2D;
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
}`,wg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Tg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ag=`#include <common>
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
}`,Rg=`#if DEPTH_PACKING == 3200
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
}`,Cg=`#define DISTANCE
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
}`,Pg=`#define DISTANCE
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
}`,Lg=`varying vec3 vWorldDirection;
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
}`,Og=`#include <common>
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
}`,Ng=`uniform vec3 diffuse;
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
}`,zg=`#define LAMBERT
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
}`,kg=`#define LAMBERT
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
}`,Fg=`#define MATCAP
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
}`,Bg=`#define MATCAP
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
}`,Gg=`#define PHONG
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
}`,$g=`#define STANDARD
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
}`,jg=`#define STANDARD
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
}`,Xg=`#define TOON
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
}`,qg=`#define TOON
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
}`,Yg=`uniform float size;
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
}`,Kg=`uniform vec3 diffuse;
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
}`,Zg=`uniform vec3 color;
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
}`,Qg=`uniform float rotation;
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
}`,tv=`uniform vec3 diffuse;
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
}`,Xt={alphahash_fragment:Mm,alphahash_pars_fragment:Sm,alphamap_fragment:wm,alphamap_pars_fragment:Em,alphatest_fragment:Tm,alphatest_pars_fragment:Am,aomap_fragment:Rm,aomap_pars_fragment:Cm,batching_pars_vertex:Pm,batching_vertex:Lm,begin_vertex:Dm,beginnormal_vertex:Im,bsdfs:Um,iridescence_fragment:Om,bumpmap_pars_fragment:Nm,clipping_planes_fragment:zm,clipping_planes_pars_fragment:km,clipping_planes_pars_vertex:Fm,clipping_planes_vertex:Bm,color_fragment:Hm,color_pars_fragment:Vm,color_pars_vertex:Wm,color_vertex:Gm,common:$m,cube_uv_reflection_fragment:jm,defaultnormal_vertex:Xm,displacementmap_pars_vertex:qm,displacementmap_vertex:Ym,emissivemap_fragment:Km,emissivemap_pars_fragment:Jm,colorspace_fragment:Zm,colorspace_pars_fragment:Qm,envmap_fragment:t0,envmap_common_pars_fragment:e0,envmap_pars_fragment:n0,envmap_pars_vertex:i0,envmap_physical_pars_fragment:m0,envmap_vertex:s0,fog_vertex:r0,fog_pars_vertex:o0,fog_fragment:a0,fog_pars_fragment:l0,gradientmap_pars_fragment:c0,lightmap_fragment:h0,lightmap_pars_fragment:u0,lights_lambert_fragment:f0,lights_lambert_pars_fragment:d0,lights_pars_begin:p0,lights_toon_fragment:g0,lights_toon_pars_fragment:v0,lights_phong_fragment:x0,lights_phong_pars_fragment:_0,lights_physical_fragment:y0,lights_physical_pars_fragment:b0,lights_fragment_begin:M0,lights_fragment_maps:S0,lights_fragment_end:w0,logdepthbuf_fragment:E0,logdepthbuf_pars_fragment:T0,logdepthbuf_pars_vertex:A0,logdepthbuf_vertex:R0,map_fragment:C0,map_pars_fragment:P0,map_particle_fragment:L0,map_particle_pars_fragment:D0,metalnessmap_fragment:I0,metalnessmap_pars_fragment:U0,morphcolor_vertex:O0,morphnormal_vertex:N0,morphtarget_pars_vertex:z0,morphtarget_vertex:k0,normal_fragment_begin:F0,normal_fragment_maps:B0,normal_pars_fragment:H0,normal_pars_vertex:V0,normal_vertex:W0,normalmap_pars_fragment:G0,clearcoat_normal_fragment_begin:$0,clearcoat_normal_fragment_maps:j0,clearcoat_pars_fragment:X0,iridescence_pars_fragment:q0,opaque_fragment:Y0,packing:K0,premultiplied_alpha_fragment:J0,project_vertex:Z0,dithering_fragment:Q0,dithering_pars_fragment:tg,roughnessmap_fragment:eg,roughnessmap_pars_fragment:ng,shadowmap_pars_fragment:ig,shadowmap_pars_vertex:sg,shadowmap_vertex:rg,shadowmask_pars_fragment:og,skinbase_vertex:ag,skinning_pars_vertex:lg,skinning_vertex:cg,skinnormal_vertex:hg,specularmap_fragment:ug,specularmap_pars_fragment:fg,tonemapping_fragment:dg,tonemapping_pars_fragment:pg,transmission_fragment:mg,transmission_pars_fragment:gg,uv_pars_fragment:vg,uv_pars_vertex:xg,uv_vertex:_g,worldpos_vertex:yg,background_vert:bg,background_frag:Mg,backgroundCube_vert:Sg,backgroundCube_frag:wg,cube_vert:Eg,cube_frag:Tg,depth_vert:Ag,depth_frag:Rg,distanceRGBA_vert:Cg,distanceRGBA_frag:Pg,equirect_vert:Lg,equirect_frag:Dg,linedashed_vert:Ig,linedashed_frag:Ug,meshbasic_vert:Og,meshbasic_frag:Ng,meshlambert_vert:zg,meshlambert_frag:kg,meshmatcap_vert:Fg,meshmatcap_frag:Bg,meshnormal_vert:Hg,meshnormal_frag:Vg,meshphong_vert:Wg,meshphong_frag:Gg,meshphysical_vert:$g,meshphysical_frag:jg,meshtoon_vert:Xg,meshtoon_frag:qg,points_vert:Yg,points_frag:Kg,shadow_vert:Jg,shadow_frag:Zg,sprite_vert:Qg,sprite_frag:tv},ut={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Tn={basic:{uniforms:Ve([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.fog]),vertexShader:Xt.meshbasic_vert,fragmentShader:Xt.meshbasic_frag},lambert:{uniforms:Ve([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new qt(0)}}]),vertexShader:Xt.meshlambert_vert,fragmentShader:Xt.meshlambert_frag},phong:{uniforms:Ve([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30}}]),vertexShader:Xt.meshphong_vert,fragmentShader:Xt.meshphong_frag},standard:{uniforms:Ve([ut.common,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.roughnessmap,ut.metalnessmap,ut.fog,ut.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag},toon:{uniforms:Ve([ut.common,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.gradientmap,ut.fog,ut.lights,{emissive:{value:new qt(0)}}]),vertexShader:Xt.meshtoon_vert,fragmentShader:Xt.meshtoon_frag},matcap:{uniforms:Ve([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,{matcap:{value:null}}]),vertexShader:Xt.meshmatcap_vert,fragmentShader:Xt.meshmatcap_frag},points:{uniforms:Ve([ut.points,ut.fog]),vertexShader:Xt.points_vert,fragmentShader:Xt.points_frag},dashed:{uniforms:Ve([ut.common,ut.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xt.linedashed_vert,fragmentShader:Xt.linedashed_frag},depth:{uniforms:Ve([ut.common,ut.displacementmap]),vertexShader:Xt.depth_vert,fragmentShader:Xt.depth_frag},normal:{uniforms:Ve([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,{opacity:{value:1}}]),vertexShader:Xt.meshnormal_vert,fragmentShader:Xt.meshnormal_frag},sprite:{uniforms:Ve([ut.sprite,ut.fog]),vertexShader:Xt.sprite_vert,fragmentShader:Xt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xt.background_vert,fragmentShader:Xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Xt.backgroundCube_vert,fragmentShader:Xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xt.cube_vert,fragmentShader:Xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xt.equirect_vert,fragmentShader:Xt.equirect_frag},distanceRGBA:{uniforms:Ve([ut.common,ut.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xt.distanceRGBA_vert,fragmentShader:Xt.distanceRGBA_frag},shadow:{uniforms:Ve([ut.lights,ut.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Xt.shadow_vert,fragmentShader:Xt.shadow_frag}};Tn.physical={uniforms:Ve([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Xt.meshphysical_vert,fragmentShader:Xt.meshphysical_frag};const eo={r:0,b:0,g:0};function ev(i,t,e,n,s,r,o){const a=new qt(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(m,p){let _=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?e:t).get(x)),x===null?v(a,l):x&&x.isColor&&(v(x,1),_=!0);const y=i.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Oo)?(h===void 0&&(h=new Gt(new Ln(1,1,1),new Hi({name:"BackgroundCubeMaterial",uniforms:Ls(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:Ze,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=ae.getTransfer(x.colorSpace)!==le,(u!==x||d!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Gt(new fi(2,2),new Hi({name:"BackgroundMaterial",uniforms:Ls(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:mi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=ae.getTransfer(x.colorSpace)!==le,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function v(m,p){m.getRGB(eo,yf(i)),n.buffers.color.setClear(eo.r,eo.g,eo.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,v(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,v(a,l)},render:g}}function nv(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=m(null);let c=l,h=!1;function u(I,F,X,J,Y){let q=!1;if(o){const Q=v(J,X,F);c!==Q&&(c=Q,f(c.object)),q=p(I,J,X,Y),q&&_(I,J,X,Y)}else{const Q=F.wireframe===!0;(c.geometry!==J.id||c.program!==X.id||c.wireframe!==Q)&&(c.geometry=J.id,c.program=X.id,c.wireframe=Q,q=!0)}Y!==null&&e.update(Y,i.ELEMENT_ARRAY_BUFFER),(q||h)&&(h=!1,O(I,F,X,J),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function v(I,F,X){const J=X.wireframe===!0;let Y=a[I.id];Y===void 0&&(Y={},a[I.id]=Y);let q=Y[F.id];q===void 0&&(q={},Y[F.id]=q);let Q=q[J];return Q===void 0&&(Q=m(d()),q[J]=Q),Q}function m(I){const F=[],X=[],J=[];for(let Y=0;Y<s;Y++)F[Y]=0,X[Y]=0,J[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:X,attributeDivisors:J,object:I,attributes:{},index:null}}function p(I,F,X,J){const Y=c.attributes,q=F.attributes;let Q=0;const ot=X.getAttributes();for(const dt in ot)if(ot[dt].location>=0){const Z=Y[dt];let pt=q[dt];if(pt===void 0&&(dt==="instanceMatrix"&&I.instanceMatrix&&(pt=I.instanceMatrix),dt==="instanceColor"&&I.instanceColor&&(pt=I.instanceColor)),Z===void 0||Z.attribute!==pt||pt&&Z.data!==pt.data)return!0;Q++}return c.attributesNum!==Q||c.index!==J}function _(I,F,X,J){const Y={},q=F.attributes;let Q=0;const ot=X.getAttributes();for(const dt in ot)if(ot[dt].location>=0){let Z=q[dt];Z===void 0&&(dt==="instanceMatrix"&&I.instanceMatrix&&(Z=I.instanceMatrix),dt==="instanceColor"&&I.instanceColor&&(Z=I.instanceColor));const pt={};pt.attribute=Z,Z&&Z.data&&(pt.data=Z.data),Y[dt]=pt,Q++}c.attributes=Y,c.attributesNum=Q,c.index=J}function x(){const I=c.newAttributes;for(let F=0,X=I.length;F<X;F++)I[F]=0}function y(I){R(I,0)}function R(I,F){const X=c.newAttributes,J=c.enabledAttributes,Y=c.attributeDivisors;X[I]=1,J[I]===0&&(i.enableVertexAttribArray(I),J[I]=1),Y[I]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,F),Y[I]=F)}function S(){const I=c.newAttributes,F=c.enabledAttributes;for(let X=0,J=F.length;X<J;X++)F[X]!==I[X]&&(i.disableVertexAttribArray(X),F[X]=0)}function E(I,F,X,J,Y,q,Q){Q===!0?i.vertexAttribIPointer(I,F,X,Y,q):i.vertexAttribPointer(I,F,X,J,Y,q)}function O(I,F,X,J){if(n.isWebGL2===!1&&(I.isInstancedMesh||J.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const Y=J.attributes,q=X.getAttributes(),Q=F.defaultAttributeValues;for(const ot in q){const dt=q[ot];if(dt.location>=0){let G=Y[ot];if(G===void 0&&(ot==="instanceMatrix"&&I.instanceMatrix&&(G=I.instanceMatrix),ot==="instanceColor"&&I.instanceColor&&(G=I.instanceColor)),G!==void 0){const Z=G.normalized,pt=G.itemSize,Et=e.get(G);if(Et===void 0)continue;const Tt=Et.buffer,Ut=Et.type,Dt=Et.bytesPerElement,Nt=n.isWebGL2===!0&&(Ut===i.INT||Ut===i.UNSIGNED_INT||G.gpuType===sf);if(G.isInterleavedBufferAttribute){const Yt=G.data,B=Yt.stride,Ee=G.offset;if(Yt.isInstancedInterleavedBuffer){for(let It=0;It<dt.locationSize;It++)R(dt.location+It,Yt.meshPerAttribute);I.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=Yt.meshPerAttribute*Yt.count)}else for(let It=0;It<dt.locationSize;It++)y(dt.location+It);i.bindBuffer(i.ARRAY_BUFFER,Tt);for(let It=0;It<dt.locationSize;It++)E(dt.location+It,pt/dt.locationSize,Ut,Z,B*Dt,(Ee+pt/dt.locationSize*It)*Dt,Nt)}else{if(G.isInstancedBufferAttribute){for(let Yt=0;Yt<dt.locationSize;Yt++)R(dt.location+Yt,G.meshPerAttribute);I.isInstancedMesh!==!0&&J._maxInstanceCount===void 0&&(J._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let Yt=0;Yt<dt.locationSize;Yt++)y(dt.location+Yt);i.bindBuffer(i.ARRAY_BUFFER,Tt);for(let Yt=0;Yt<dt.locationSize;Yt++)E(dt.location+Yt,pt/dt.locationSize,Ut,Z,pt*Dt,pt/dt.locationSize*Yt*Dt,Nt)}}else if(Q!==void 0){const Z=Q[ot];if(Z!==void 0)switch(Z.length){case 2:i.vertexAttrib2fv(dt.location,Z);break;case 3:i.vertexAttrib3fv(dt.location,Z);break;case 4:i.vertexAttrib4fv(dt.location,Z);break;default:i.vertexAttrib1fv(dt.location,Z)}}}}S()}function b(){$();for(const I in a){const F=a[I];for(const X in F){const J=F[X];for(const Y in J)g(J[Y].object),delete J[Y];delete F[X]}delete a[I]}}function w(I){if(a[I.id]===void 0)return;const F=a[I.id];for(const X in F){const J=F[X];for(const Y in J)g(J[Y].object),delete J[Y];delete F[X]}delete a[I.id]}function k(I){for(const F in a){const X=a[F];if(X[I.id]===void 0)continue;const J=X[I.id];for(const Y in J)g(J[Y].object),delete J[Y];delete X[I.id]}}function $(){et(),h=!0,c!==l&&(c=l,f(c.object))}function et(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:$,resetDefaultState:et,dispose:b,releaseStatesOfGeometry:w,releaseStatesOfProgram:k,initAttributes:x,enableAttribute:y,disableUnusedAttributes:S}}function iv(i,t,e,n){const s=n.isWebGL2;let r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function l(h,u,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),e.update(u,r,d)}function c(h,u,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function sv(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,y=o||t.has("OES_texture_float"),R=x&&y,S=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:_,vertexTextures:x,floatFragmentTextures:y,floatVertexTextures:R,maxSamples:S}}function rv(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new oi,a=new Zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const _=r?0:n,x=_*4;let y=p.clippingState||null;l.value=y,y=h(g,d,x,f);for(let R=0;R!==x;++R)y[R]=e[R];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(u[x]).applyMatrix4(_,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function ov(i){let t=new WeakMap;function e(o,a){return a===al?o.mapping=Rs:a===ll&&(o.mapping=Cs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===al||a===ll)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new xm(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class wf extends bf{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ys=4,ch=[.125,.215,.35,.446,.526,.582],Ci=20,Ta=new wf,hh=new qt;let Aa=null,Ra=0,Ca=0;const wi=(1+Math.sqrt(5))/2,fs=1/wi,uh=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,wi,fs),new C(0,wi,-fs),new C(fs,0,wi),new C(-fs,0,wi),new C(wi,fs,0),new C(-wi,fs,0)];class fh{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Aa=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Ca=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ph(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Aa,Ra,Ca),t.scissorTest=!1,no(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Rs||t.mapping===Cs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Aa=this._renderer.getRenderTarget(),Ra=this._renderer.getActiveCubeFace(),Ca=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Je,minFilter:Je,generateMipmaps:!1,type:vr,format:fn,colorSpace:Zn,depthBuffer:!1},s=dh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dh(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=av(r)),this._blurMaterial=lv(r,t,e)}return s}_compileMaterial(t){const e=new Gt(this._lodPlanes[0],t);this._renderer.compile(e,Ta)}_sceneToCubeUV(t,e,n,s){const a=new on(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(hh),h.toneMapping=hi,h.autoClear=!1;const f=new We({name:"PMREM.Background",side:Ze,depthWrite:!1,depthTest:!1}),g=new Gt(new Ln,f);let v=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,v=!0):(f.color.copy(hh),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):_===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const x=this._cubeSize;no(s,_*x,p>2?x:0,x,x),h.setRenderTarget(s),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Rs||t.mapping===Cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=mh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ph());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Gt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;no(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Ta)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=uh[(s-1)%uh.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Gt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ci-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):Ci;m>Ci&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ci}`);const p=[];let _=0;for(let E=0;E<Ci;++E){const O=E/v,b=Math.exp(-O*O/2);p.push(b),E===0?_+=b:E<m&&(_+=2*b)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const y=this._sizeLods[s],R=3*y*(s>x-ys?s-x+ys:0),S=4*(this._cubeSize-y);no(e,R,S,3*y,2*y),l.setRenderTarget(e),l.render(u,Ta)}}function av(i){const t=[],e=[],n=[];let s=i;const r=i-ys+1+ch.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-ys?l=ch[o-i+ys-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,_=new Float32Array(v*g*f),x=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let S=0;S<f;S++){const E=S%3*2/3-1,O=S>2?0:-1,b=[E,O,0,E+2/3,O,0,E+2/3,O+1,0,E,O,0,E+2/3,O+1,0,E,O+1,0];_.set(b,v*g*S),x.set(d,m*g*S);const w=[S,S,S,S,S,S];y.set(w,p*g*S)}const R=new de;R.setAttribute("position",new cn(_,v)),R.setAttribute("uv",new cn(x,m)),R.setAttribute("faceIndex",new cn(y,p)),t.push(R),s>ys&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function dh(i,t,e){const n=new Bi(i,t,e);return n.texture.mapping=Oo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function no(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function lv(i,t,e){const n=new Float32Array(Ci),s=new C(0,1,0);return new Hi({name:"SphericalGaussianBlur",defines:{n:Ci,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:kl(),fragmentShader:`

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
		`,blending:ci,depthTest:!1,depthWrite:!1})}function ph(){return new Hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:kl(),fragmentShader:`

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
		`,blending:ci,depthTest:!1,depthWrite:!1})}function mh(){return new Hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ci,depthTest:!1,depthWrite:!1})}function kl(){return`

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
	`}function cv(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===al||l===ll,h=l===Rs||l===Cs;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new fh(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new fh(i));const d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function hv(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function uv(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const v=f[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],i.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const _=f.array;v=f.version;for(let x=0,y=_.length;x<y;x+=3){const R=_[x+0],S=_[x+1],E=_[x+2];d.push(R,S,S,E,E,R)}}else if(g!==void 0){const _=g.array;v=g.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const R=x+0,S=x+1,E=x+2;d.push(R,S,S,E,E,R)}}else return;const m=new(df(d)?_f:xf)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function fv(i,t,e,n){const s=n.isWebGL2;let r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,g){i.drawElements(r,g,a,f*l),e.update(g,r,1)}function u(f,g,v){if(v===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,f*l,v),e.update(g,r,v)}function d(f,g,v){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<v;p++)this.render(f[p]/l,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,f,0,v);let p=0;for(let _=0;_<v;_++)p+=g[_];e.update(p,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function dv(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function pv(i,t){return i[0]-t[0]}function mv(i,t){return Math.abs(t[1])-Math.abs(i[1])}function gv(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,o=new ce,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){const d=c.morphTargetInfluences;if(t.isWebGL2===!0){const f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=f!==void 0?f.length:0;let v=r.get(h);if(v===void 0||v.count!==g){let I=function(){$.dispose(),r.delete(h),h.removeEventListener("dispose",I)};v!==void 0&&v.texture.dispose();const _=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,R=h.morphAttributes.position||[],S=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let O=0;_===!0&&(O=1),x===!0&&(O=2),y===!0&&(O=3);let b=h.attributes.position.count*O,w=1;b>t.maxTextureSize&&(w=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const k=new Float32Array(b*w*4*g),$=new gf(k,b,w,g);$.type=li,$.needsUpdate=!0;const et=O*4;for(let F=0;F<g;F++){const X=R[F],J=S[F],Y=E[F],q=b*w*4*F;for(let Q=0;Q<X.count;Q++){const ot=Q*et;_===!0&&(o.fromBufferAttribute(X,Q),k[q+ot+0]=o.x,k[q+ot+1]=o.y,k[q+ot+2]=o.z,k[q+ot+3]=0),x===!0&&(o.fromBufferAttribute(J,Q),k[q+ot+4]=o.x,k[q+ot+5]=o.y,k[q+ot+6]=o.z,k[q+ot+7]=0),y===!0&&(o.fromBufferAttribute(Y,Q),k[q+ot+8]=o.x,k[q+ot+9]=o.y,k[q+ot+10]=o.z,k[q+ot+11]=Y.itemSize===4?o.w:1)}}v={count:g,texture:$,size:new ft(b,w)},r.set(h,v),h.addEventListener("dispose",I)}let m=0;for(let _=0;_<d.length;_++)m+=d[_];const p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",p),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{const f=d===void 0?0:d.length;let g=n[h.id];if(g===void 0||g.length!==f){g=[];for(let x=0;x<f;x++)g[x]=[x,0];n[h.id]=g}for(let x=0;x<f;x++){const y=g[x];y[0]=x,y[1]=d[x]}g.sort(mv);for(let x=0;x<8;x++)x<f&&g[x][1]?(a[x][0]=g[x][0],a[x][1]=g[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(pv);const v=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let x=0;x<8;x++){const y=a[x],R=y[0],S=y[1];R!==Number.MAX_SAFE_INTEGER&&S?(v&&h.getAttribute("morphTarget"+x)!==v[R]&&h.setAttribute("morphTarget"+x,v[R]),m&&h.getAttribute("morphNormal"+x)!==m[R]&&h.setAttribute("morphNormal"+x,m[R]),s[x]=S,p+=S):(v&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}const _=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",_),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function vv(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Ef extends $e{constructor(t,e,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:Ni,h!==Ni&&h!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ni&&(n=ai),n===void 0&&h===Ps&&(n=Oi),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Oe,this.minFilter=l!==void 0?l:Oe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Tf=new $e,Af=new Ef(1,1);Af.compareFunction=ff;const Rf=new gf,Cf=new em,Pf=new Mf,gh=[],vh=[],xh=new Float32Array(16),_h=new Float32Array(9),yh=new Float32Array(4);function Hs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=gh[s];if(r===void 0&&(r=new Float32Array(s),gh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Re(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ce(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ko(i,t){let e=vh[t];e===void 0&&(e=new Int32Array(t),vh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function xv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function _v(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2fv(this.addr,t),Ce(e,t)}}function yv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;i.uniform3fv(this.addr,t),Ce(e,t)}}function bv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4fv(this.addr,t),Ce(e,t)}}function Mv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;yh.set(n),i.uniformMatrix2fv(this.addr,!1,yh),Ce(e,n)}}function Sv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;_h.set(n),i.uniformMatrix3fv(this.addr,!1,_h),Ce(e,n)}}function wv(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ce(e,t)}else{if(Re(e,n))return;xh.set(n),i.uniformMatrix4fv(this.addr,!1,xh),Ce(e,n)}}function Ev(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Tv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2iv(this.addr,t),Ce(e,t)}}function Av(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3iv(this.addr,t),Ce(e,t)}}function Rv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4iv(this.addr,t),Ce(e,t)}}function Cv(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Pv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2uiv(this.addr,t),Ce(e,t)}}function Lv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3uiv(this.addr,t),Ce(e,t)}}function Dv(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4uiv(this.addr,t),Ce(e,t)}}function Iv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Af:Tf;e.setTexture2D(t||r,s)}function Uv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Cf,s)}function Ov(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Pf,s)}function Nv(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Rf,s)}function zv(i){switch(i){case 5126:return xv;case 35664:return _v;case 35665:return yv;case 35666:return bv;case 35674:return Mv;case 35675:return Sv;case 35676:return wv;case 5124:case 35670:return Ev;case 35667:case 35671:return Tv;case 35668:case 35672:return Av;case 35669:case 35673:return Rv;case 5125:return Cv;case 36294:return Pv;case 36295:return Lv;case 36296:return Dv;case 35678:case 36198:case 36298:case 36306:case 35682:return Iv;case 35679:case 36299:case 36307:return Uv;case 35680:case 36300:case 36308:case 36293:return Ov;case 36289:case 36303:case 36311:case 36292:return Nv}}function kv(i,t){i.uniform1fv(this.addr,t)}function Fv(i,t){const e=Hs(t,this.size,2);i.uniform2fv(this.addr,e)}function Bv(i,t){const e=Hs(t,this.size,3);i.uniform3fv(this.addr,e)}function Hv(i,t){const e=Hs(t,this.size,4);i.uniform4fv(this.addr,e)}function Vv(i,t){const e=Hs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Wv(i,t){const e=Hs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Gv(i,t){const e=Hs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function $v(i,t){i.uniform1iv(this.addr,t)}function jv(i,t){i.uniform2iv(this.addr,t)}function Xv(i,t){i.uniform3iv(this.addr,t)}function qv(i,t){i.uniform4iv(this.addr,t)}function Yv(i,t){i.uniform1uiv(this.addr,t)}function Kv(i,t){i.uniform2uiv(this.addr,t)}function Jv(i,t){i.uniform3uiv(this.addr,t)}function Zv(i,t){i.uniform4uiv(this.addr,t)}function Qv(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Tf,r[o])}function tx(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Cf,r[o])}function ex(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Pf,r[o])}function nx(i,t,e){const n=this.cache,s=t.length,r=ko(e,s);Re(n,r)||(i.uniform1iv(this.addr,r),Ce(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Rf,r[o])}function ix(i){switch(i){case 5126:return kv;case 35664:return Fv;case 35665:return Bv;case 35666:return Hv;case 35674:return Vv;case 35675:return Wv;case 35676:return Gv;case 5124:case 35670:return $v;case 35667:case 35671:return jv;case 35668:case 35672:return Xv;case 35669:case 35673:return qv;case 5125:return Yv;case 36294:return Kv;case 36295:return Jv;case 36296:return Zv;case 35678:case 36198:case 36298:case 36306:case 35682:return Qv;case 35679:case 36299:case 36307:return tx;case 35680:case 36300:case 36308:case 36293:return ex;case 36289:case 36303:case 36311:case 36292:return nx}}class sx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=zv(e.type)}}class rx{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ix(e.type)}}class ox{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function bh(i,t){i.seq.push(t),i.map[t.id]=t}function ax(i,t,e){const n=i.name,s=n.length;for(Pa.lastIndex=0;;){const r=Pa.exec(n),o=Pa.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){bh(e,c===void 0?new sx(a,i,t):new rx(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new ox(a),bh(e,u)),e=u}}}class vo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);ax(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Mh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const lx=37297;let cx=0;function hx(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function ux(i){const t=ae.getPrimaries(ae.workingColorSpace),e=ae.getPrimaries(i);let n;switch(t===e?n="":t===Ao&&e===To?n="LinearDisplayP3ToLinearSRGB":t===To&&e===Ao&&(n="LinearSRGBToLinearDisplayP3"),i){case Zn:case No:return[n,"LinearTransferOETF"];case we:case Ol:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Sh(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+hx(i.getShaderSource(t),o)}else return s}function fx(i,t){const e=ux(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function dx(i,t){let e;switch(t){case Sp:e="Linear";break;case wp:e="Reinhard";break;case Ep:e="OptimizedCineon";break;case ef:e="ACESFilmic";break;case Ap:e="AgX";break;case Tp:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function px(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(bs).join(`
`)}function mx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(bs).join(`
`)}function gx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function vx(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function bs(i){return i!==""}function wh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Eh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const xx=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(i){return i.replace(xx,yx)}const _x=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function yx(i,t){let e=Xt[t];if(e===void 0){const n=_x.get(t);if(n!==void 0)e=Xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return dl(e)}const bx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Th(i){return i.replace(bx,Mx)}function Mx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ah(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Sx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Qu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===tf?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Vn&&(t="SHADOWMAP_TYPE_VSM"),t}function wx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Rs:case Cs:t="ENVMAP_TYPE_CUBE";break;case Oo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ex(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Cs:t="ENVMAP_MODE_REFRACTION";break}return t}function Tx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Dl:t="ENVMAP_BLENDING_MULTIPLY";break;case bp:t="ENVMAP_BLENDING_MIX";break;case Mp:t="ENVMAP_BLENDING_ADD";break}return t}function Ax(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Rx(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Sx(e),c=wx(e),h=Ex(e),u=Tx(e),d=Ax(e),f=e.isWebGL2?"":px(e),g=mx(e),v=gx(r),m=s.createProgram();let p,_,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(bs).join(`
`),p.length>0&&(p+=`
`),_=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(bs).join(`
`),_.length>0&&(_+=`
`)):(p=[Ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bs).join(`
`),_=[f,Ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==hi?"#define TONE_MAPPING":"",e.toneMapping!==hi?Xt.tonemapping_pars_fragment:"",e.toneMapping!==hi?dx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Xt.colorspace_pars_fragment,fx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(bs).join(`
`)),o=dl(o),o=wh(o,e),o=Eh(o,e),a=dl(a),a=wh(a,e),a=Eh(a,e),o=Th(o),a=Th(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,_=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===$c?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===$c?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const y=x+p+o,R=x+_+a,S=Mh(s,s.VERTEX_SHADER,y),E=Mh(s,s.FRAGMENT_SHADER,R);s.attachShader(m,S),s.attachShader(m,E),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function O($){if(i.debug.checkShaderErrors){const et=s.getProgramInfoLog(m).trim(),I=s.getShaderInfoLog(S).trim(),F=s.getShaderInfoLog(E).trim();let X=!0,J=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,S,E);else{const Y=Sh(s,S,"vertex"),q=Sh(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+et+`
`+Y+`
`+q)}else et!==""?console.warn("THREE.WebGLProgram: Program Info Log:",et):(I===""||F==="")&&(J=!1);J&&($.diagnostics={runnable:X,programLog:et,vertexShader:{log:I,prefix:p},fragmentShader:{log:F,prefix:_}})}s.deleteShader(S),s.deleteShader(E),b=new vo(s,m),w=vx(s,m)}let b;this.getUniforms=function(){return b===void 0&&O(this),b};let w;this.getAttributes=function(){return w===void 0&&O(this),w};let k=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return k===!1&&(k=s.getProgramParameter(m,lx)),k},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=cx++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=S,this.fragmentShader=E,this}let Cx=0;class Px{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Lx(t),e.set(t,n)),n}}class Lx{constructor(t){this.id=Cx++,this.code=t,this.usedTimes=0}}function Dx(i,t,e,n,s,r,o){const a=new Nl,l=new Px,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return b===0?"uv":`uv${b}`}function m(b,w,k,$,et){const I=$.fog,F=et.geometry,X=b.isMeshStandardMaterial?$.environment:null,J=(b.isMeshStandardMaterial?e:t).get(b.envMap||X),Y=J&&J.mapping===Oo?J.image.height:null,q=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const Q=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ot=Q!==void 0?Q.length:0;let dt=0;F.morphAttributes.position!==void 0&&(dt=1),F.morphAttributes.normal!==void 0&&(dt=2),F.morphAttributes.color!==void 0&&(dt=3);let G,Z,pt,Et;if(q){const ve=Tn[q];G=ve.vertexShader,Z=ve.fragmentShader}else G=b.vertexShader,Z=b.fragmentShader,l.update(b),pt=l.getVertexShaderID(b),Et=l.getFragmentShaderID(b);const Tt=i.getRenderTarget(),Ut=et.isInstancedMesh===!0,Dt=et.isBatchedMesh===!0,Nt=!!b.map,Yt=!!b.matcap,B=!!J,Ee=!!b.aoMap,It=!!b.lightMap,kt=!!b.bumpMap,bt=!!b.normalMap,se=!!b.displacementMap,zt=!!b.emissiveMap,A=!!b.metalnessMap,M=!!b.roughnessMap,z=b.anisotropy>0,it=b.clearcoat>0,tt=b.iridescence>0,nt=b.sheen>0,At=b.transmission>0,mt=z&&!!b.anisotropyMap,D=it&&!!b.clearcoatMap,U=it&&!!b.clearcoatNormalMap,K=it&&!!b.clearcoatRoughnessMap,j=tt&&!!b.iridescenceMap,vt=tt&&!!b.iridescenceThicknessMap,_t=nt&&!!b.sheenColorMap,Rt=nt&&!!b.sheenRoughnessMap,St=!!b.specularMap,xt=!!b.specularColorMap,P=!!b.specularIntensityMap,at=At&&!!b.transmissionMap,Pt=At&&!!b.thicknessMap,wt=!!b.gradientMap,st=!!b.alphaMap,L=b.alphaTest>0,lt=!!b.alphaHash,gt=!!b.extensions,Ft=!!F.attributes.uv1,Ot=!!F.attributes.uv2,Qt=!!F.attributes.uv3;let te=hi;return b.toneMapped&&(Tt===null||Tt.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:h,shaderID:q,shaderType:b.type,shaderName:b.name,vertexShader:G,fragmentShader:Z,defines:b.defines,customVertexShaderID:pt,customFragmentShaderID:Et,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Dt,instancing:Ut,instancingColor:Ut&&et.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:Tt===null?i.outputColorSpace:Tt.isXRRenderTarget===!0?Tt.texture.colorSpace:Zn,map:Nt,matcap:Yt,envMap:B,envMapMode:B&&J.mapping,envMapCubeUVHeight:Y,aoMap:Ee,lightMap:It,bumpMap:kt,normalMap:bt,displacementMap:d&&se,emissiveMap:zt,normalMapObjectSpace:bt&&b.normalMapType===Fp,normalMapTangentSpace:bt&&b.normalMapType===Ul,metalnessMap:A,roughnessMap:M,anisotropy:z,anisotropyMap:mt,clearcoat:it,clearcoatMap:D,clearcoatNormalMap:U,clearcoatRoughnessMap:K,iridescence:tt,iridescenceMap:j,iridescenceThicknessMap:vt,sheen:nt,sheenColorMap:_t,sheenRoughnessMap:Rt,specularMap:St,specularColorMap:xt,specularIntensityMap:P,transmission:At,transmissionMap:at,thicknessMap:Pt,gradientMap:wt,opaque:b.transparent===!1&&b.blending===Ms,alphaMap:st,alphaTest:L,alphaHash:lt,combine:b.combine,mapUv:Nt&&v(b.map.channel),aoMapUv:Ee&&v(b.aoMap.channel),lightMapUv:It&&v(b.lightMap.channel),bumpMapUv:kt&&v(b.bumpMap.channel),normalMapUv:bt&&v(b.normalMap.channel),displacementMapUv:se&&v(b.displacementMap.channel),emissiveMapUv:zt&&v(b.emissiveMap.channel),metalnessMapUv:A&&v(b.metalnessMap.channel),roughnessMapUv:M&&v(b.roughnessMap.channel),anisotropyMapUv:mt&&v(b.anisotropyMap.channel),clearcoatMapUv:D&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:U&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:vt&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:Rt&&v(b.sheenRoughnessMap.channel),specularMapUv:St&&v(b.specularMap.channel),specularColorMapUv:xt&&v(b.specularColorMap.channel),specularIntensityMapUv:P&&v(b.specularIntensityMap.channel),transmissionMapUv:at&&v(b.transmissionMap.channel),thicknessMapUv:Pt&&v(b.thicknessMap.channel),alphaMapUv:st&&v(b.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(bt||z),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Ft,vertexUv2s:Ot,vertexUv3s:Qt,pointsUvs:et.isPoints===!0&&!!F.attributes.uv&&(Nt||st),fog:!!I,useFog:b.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:et.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:dt,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&k.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Nt&&b.map.isVideoTexture===!0&&ae.getTransfer(b.map.colorSpace)===le,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===an,flipSided:b.side===Ze,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionDerivatives:gt&&b.extensions.derivatives===!0,extensionFragDepth:gt&&b.extensions.fragDepth===!0,extensionDrawBuffers:gt&&b.extensions.drawBuffers===!0,extensionShaderTextureLOD:gt&&b.extensions.shaderTextureLOD===!0,extensionClipCullDistance:gt&&b.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()}}function p(b){const w=[];if(b.shaderID?w.push(b.shaderID):(w.push(b.customVertexShaderID),w.push(b.customFragmentShaderID)),b.defines!==void 0)for(const k in b.defines)w.push(k),w.push(b.defines[k]);return b.isRawShaderMaterial===!1&&(_(w,b),x(w,b),w.push(i.outputColorSpace)),w.push(b.customProgramCacheKey),w.join()}function _(b,w){b.push(w.precision),b.push(w.outputColorSpace),b.push(w.envMapMode),b.push(w.envMapCubeUVHeight),b.push(w.mapUv),b.push(w.alphaMapUv),b.push(w.lightMapUv),b.push(w.aoMapUv),b.push(w.bumpMapUv),b.push(w.normalMapUv),b.push(w.displacementMapUv),b.push(w.emissiveMapUv),b.push(w.metalnessMapUv),b.push(w.roughnessMapUv),b.push(w.anisotropyMapUv),b.push(w.clearcoatMapUv),b.push(w.clearcoatNormalMapUv),b.push(w.clearcoatRoughnessMapUv),b.push(w.iridescenceMapUv),b.push(w.iridescenceThicknessMapUv),b.push(w.sheenColorMapUv),b.push(w.sheenRoughnessMapUv),b.push(w.specularMapUv),b.push(w.specularColorMapUv),b.push(w.specularIntensityMapUv),b.push(w.transmissionMapUv),b.push(w.thicknessMapUv),b.push(w.combine),b.push(w.fogExp2),b.push(w.sizeAttenuation),b.push(w.morphTargetsCount),b.push(w.morphAttributeCount),b.push(w.numDirLights),b.push(w.numPointLights),b.push(w.numSpotLights),b.push(w.numSpotLightMaps),b.push(w.numHemiLights),b.push(w.numRectAreaLights),b.push(w.numDirLightShadows),b.push(w.numPointLightShadows),b.push(w.numSpotLightShadows),b.push(w.numSpotLightShadowsWithMaps),b.push(w.numLightProbes),b.push(w.shadowMapType),b.push(w.toneMapping),b.push(w.numClippingPlanes),b.push(w.numClipIntersection),b.push(w.depthPacking)}function x(b,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),b.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),b.push(a.mask)}function y(b){const w=g[b.type];let k;if(w){const $=Tn[w];k=pm.clone($.uniforms)}else k=b.uniforms;return k}function R(b,w){let k;for(let $=0,et=c.length;$<et;$++){const I=c[$];if(I.cacheKey===w){k=I,++k.usedTimes;break}}return k===void 0&&(k=new Rx(i,w,b,r),c.push(k)),k}function S(b){if(--b.usedTimes===0){const w=c.indexOf(b);c[w]=c[c.length-1],c.pop(),b.destroy()}}function E(b){l.remove(b)}function O(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:R,releaseProgram:S,releaseShaderCache:E,programs:c,dispose:O}}function Ix(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Ux(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Rh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ch(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||Ux),n.length>1&&n.sort(d||Rh),s.length>1&&s.sort(d||Rh)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function Ox(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Ch,i.set(n,[o])):s>=r.length?(o=new Ch,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Nx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new qt};break;case"SpotLight":e={position:new C,direction:new C,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function zx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let kx=0;function Fx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Bx(i,t){const e=new Nx,n=zx(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new C);const r=new C,o=new re,a=new re;function l(h,u){let d=0,f=0,g=0;for(let $=0;$<9;$++)s.probe[$].set(0,0,0);let v=0,m=0,p=0,_=0,x=0,y=0,R=0,S=0,E=0,O=0,b=0;h.sort(Fx);const w=u===!0?Math.PI:1;for(let $=0,et=h.length;$<et;$++){const I=h[$],F=I.color,X=I.intensity,J=I.distance,Y=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=F.r*X*w,f+=F.g*X*w,g+=F.b*X*w;else if(I.isLightProbe){for(let q=0;q<9;q++)s.probe[q].addScaledVector(I.sh.coefficients[q],X);b++}else if(I.isDirectionalLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*w),I.castShadow){const Q=I.shadow,ot=n.get(I);ot.shadowBias=Q.bias,ot.shadowNormalBias=Q.normalBias,ot.shadowRadius=Q.radius,ot.shadowMapSize=Q.mapSize,s.directionalShadow[v]=ot,s.directionalShadowMap[v]=Y,s.directionalShadowMatrix[v]=I.shadow.matrix,y++}s.directional[v]=q,v++}else if(I.isSpotLight){const q=e.get(I);q.position.setFromMatrixPosition(I.matrixWorld),q.color.copy(F).multiplyScalar(X*w),q.distance=J,q.coneCos=Math.cos(I.angle),q.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),q.decay=I.decay,s.spot[p]=q;const Q=I.shadow;if(I.map&&(s.spotLightMap[E]=I.map,E++,Q.updateMatrices(I),I.castShadow&&O++),s.spotLightMatrix[p]=Q.matrix,I.castShadow){const ot=n.get(I);ot.shadowBias=Q.bias,ot.shadowNormalBias=Q.normalBias,ot.shadowRadius=Q.radius,ot.shadowMapSize=Q.mapSize,s.spotShadow[p]=ot,s.spotShadowMap[p]=Y,S++}p++}else if(I.isRectAreaLight){const q=e.get(I);q.color.copy(F).multiplyScalar(X),q.halfWidth.set(I.width*.5,0,0),q.halfHeight.set(0,I.height*.5,0),s.rectArea[_]=q,_++}else if(I.isPointLight){const q=e.get(I);if(q.color.copy(I.color).multiplyScalar(I.intensity*w),q.distance=I.distance,q.decay=I.decay,I.castShadow){const Q=I.shadow,ot=n.get(I);ot.shadowBias=Q.bias,ot.shadowNormalBias=Q.normalBias,ot.shadowRadius=Q.radius,ot.shadowMapSize=Q.mapSize,ot.shadowCameraNear=Q.camera.near,ot.shadowCameraFar=Q.camera.far,s.pointShadow[m]=ot,s.pointShadowMap[m]=Y,s.pointShadowMatrix[m]=I.shadow.matrix,R++}s.point[m]=q,m++}else if(I.isHemisphereLight){const q=e.get(I);q.skyColor.copy(I.color).multiplyScalar(X*w),q.groundColor.copy(I.groundColor).multiplyScalar(X*w),s.hemi[x]=q,x++}}_>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ut.LTC_FLOAT_1,s.rectAreaLTC2=ut.LTC_FLOAT_2):(s.rectAreaLTC1=ut.LTC_HALF_1,s.rectAreaLTC2=ut.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ut.LTC_FLOAT_1,s.rectAreaLTC2=ut.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ut.LTC_HALF_1,s.rectAreaLTC2=ut.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;const k=s.hash;(k.directionalLength!==v||k.pointLength!==m||k.spotLength!==p||k.rectAreaLength!==_||k.hemiLength!==x||k.numDirectionalShadows!==y||k.numPointShadows!==R||k.numSpotShadows!==S||k.numSpotMaps!==E||k.numLightProbes!==b)&&(s.directional.length=v,s.spot.length=p,s.rectArea.length=_,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=y,s.directionalShadowMap.length=y,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=S,s.spotShadowMap.length=S,s.directionalShadowMatrix.length=y,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=S+E-O,s.spotLightMap.length=E,s.numSpotLightShadowsWithMaps=O,s.numLightProbes=b,k.directionalLength=v,k.pointLength=m,k.spotLength=p,k.rectAreaLength=_,k.hemiLength=x,k.numDirectionalShadows=y,k.numPointShadows=R,k.numSpotShadows=S,k.numSpotMaps=E,k.numLightProbes=b,s.version=kx++)}function c(h,u){let d=0,f=0,g=0,v=0,m=0;const p=u.matrixWorldInverse;for(let _=0,x=h.length;_<x;_++){const y=h[_];if(y.isDirectionalLight){const R=s.directional[d];R.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),d++}else if(y.isSpotLight){const R=s.spot[g];R.position.setFromMatrixPosition(y.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(p),g++}else if(y.isRectAreaLight){const R=s.rectArea[v];R.position.setFromMatrixPosition(y.matrixWorld),R.position.applyMatrix4(p),a.identity(),o.copy(y.matrixWorld),o.premultiply(p),a.extractRotation(o),R.halfWidth.set(y.width*.5,0,0),R.halfHeight.set(0,y.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){const R=s.point[f];R.position.setFromMatrixPosition(y.matrixWorld),R.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const R=s.hemi[m];R.direction.setFromMatrixPosition(y.matrixWorld),R.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:s}}function Ph(i,t){const e=new Bx(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function l(u){e.setup(n,u)}function c(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Hx(i,t){let e=new WeakMap;function n(r,o=0){const a=e.get(r);let l;return a===void 0?(l=new Ph(i,t),e.set(r,[l])):o>=a.length?(l=new Ph(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}class Vx extends Xi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Wx extends Xi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Gx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,$x=`uniform sampler2D shadow_pass;
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
}`;function jx(i,t,e){let n=new zl;const s=new ft,r=new ft,o=new ce,a=new Vx({depthPacking:kp}),l=new Wx,c={},h=e.maxTextureSize,u={[mi]:Ze,[Ze]:mi,[an]:an},d=new Hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Gx,fragmentShader:$x}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new de;g.setAttribute("position",new cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Gt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qu;let p=this.type;this.render=function(S,E,O){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const b=i.getRenderTarget(),w=i.getActiveCubeFace(),k=i.getActiveMipmapLevel(),$=i.state;$.setBlending(ci),$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const et=p!==Vn&&this.type===Vn,I=p===Vn&&this.type!==Vn;for(let F=0,X=S.length;F<X;F++){const J=S[F],Y=J.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const q=Y.getFrameExtents();if(s.multiply(q),r.copy(Y.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/q.x),s.x=r.x*q.x,Y.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/q.y),s.y=r.y*q.y,Y.mapSize.y=r.y)),Y.map===null||et===!0||I===!0){const ot=this.type!==Vn?{minFilter:Oe,magFilter:Oe}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Bi(s.x,s.y,ot),Y.map.texture.name=J.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const Q=Y.getViewportCount();for(let ot=0;ot<Q;ot++){const dt=Y.getViewport(ot);o.set(r.x*dt.x,r.y*dt.y,r.x*dt.z,r.y*dt.w),$.viewport(o),Y.updateMatrices(J,ot),n=Y.getFrustum(),y(E,O,Y.camera,J,this.type)}Y.isPointLightShadow!==!0&&this.type===Vn&&_(Y,O),Y.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,w,k)};function _(S,E){const O=t.update(v);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Bi(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(E,null,O,d,v,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(E,null,O,f,v,null)}function x(S,E,O,b){let w=null;const k=O.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(k!==void 0)w=k;else if(w=O.isPointLight===!0?l:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const $=w.uuid,et=E.uuid;let I=c[$];I===void 0&&(I={},c[$]=I);let F=I[et];F===void 0&&(F=w.clone(),I[et]=F,E.addEventListener("dispose",R)),w=F}if(w.visible=E.visible,w.wireframe=E.wireframe,b===Vn?w.side=E.shadowSide!==null?E.shadowSide:E.side:w.side=E.shadowSide!==null?E.shadowSide:u[E.side],w.alphaMap=E.alphaMap,w.alphaTest=E.alphaTest,w.map=E.map,w.clipShadows=E.clipShadows,w.clippingPlanes=E.clippingPlanes,w.clipIntersection=E.clipIntersection,w.displacementMap=E.displacementMap,w.displacementScale=E.displacementScale,w.displacementBias=E.displacementBias,w.wireframeLinewidth=E.wireframeLinewidth,w.linewidth=E.linewidth,O.isPointLight===!0&&w.isMeshDistanceMaterial===!0){const $=i.properties.get(w);$.light=O}return w}function y(S,E,O,b,w){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&w===Vn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,S.matrixWorld);const et=t.update(S),I=S.material;if(Array.isArray(I)){const F=et.groups;for(let X=0,J=F.length;X<J;X++){const Y=F[X],q=I[Y.materialIndex];if(q&&q.visible){const Q=x(S,q,b,w);S.onBeforeShadow(i,S,E,O,et,Q,Y),i.renderBufferDirect(O,null,et,Q,S,Y),S.onAfterShadow(i,S,E,O,et,Q,Y)}}}else if(I.visible){const F=x(S,I,b,w);S.onBeforeShadow(i,S,E,O,et,F,null),i.renderBufferDirect(O,null,et,F,S,null),S.onAfterShadow(i,S,E,O,et,F,null)}}const $=S.children;for(let et=0,I=$.length;et<I;et++)y($[et],E,O,b,w)}function R(S){S.target.removeEventListener("dispose",R);for(const O in c){const b=c[O],w=S.target.uuid;w in b&&(b[w].dispose(),delete b[w])}}}function Xx(i,t,e){const n=e.isWebGL2;function s(){let L=!1;const lt=new ce;let gt=null;const Ft=new ce(0,0,0,0);return{setMask:function(Ot){gt!==Ot&&!L&&(i.colorMask(Ot,Ot,Ot,Ot),gt=Ot)},setLocked:function(Ot){L=Ot},setClear:function(Ot,Qt,te,pe,ve){ve===!0&&(Ot*=pe,Qt*=pe,te*=pe),lt.set(Ot,Qt,te,pe),Ft.equals(lt)===!1&&(i.clearColor(Ot,Qt,te,pe),Ft.copy(lt))},reset:function(){L=!1,gt=null,Ft.set(-1,0,0,0)}}}function r(){let L=!1,lt=null,gt=null,Ft=null;return{setTest:function(Ot){Ot?Dt(i.DEPTH_TEST):Nt(i.DEPTH_TEST)},setMask:function(Ot){lt!==Ot&&!L&&(i.depthMask(Ot),lt=Ot)},setFunc:function(Ot){if(gt!==Ot){switch(Ot){case pp:i.depthFunc(i.NEVER);break;case mp:i.depthFunc(i.ALWAYS);break;case gp:i.depthFunc(i.LESS);break;case So:i.depthFunc(i.LEQUAL);break;case vp:i.depthFunc(i.EQUAL);break;case xp:i.depthFunc(i.GEQUAL);break;case _p:i.depthFunc(i.GREATER);break;case yp:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}gt=Ot}},setLocked:function(Ot){L=Ot},setClear:function(Ot){Ft!==Ot&&(i.clearDepth(Ot),Ft=Ot)},reset:function(){L=!1,lt=null,gt=null,Ft=null}}}function o(){let L=!1,lt=null,gt=null,Ft=null,Ot=null,Qt=null,te=null,pe=null,ve=null;return{setTest:function(ee){L||(ee?Dt(i.STENCIL_TEST):Nt(i.STENCIL_TEST))},setMask:function(ee){lt!==ee&&!L&&(i.stencilMask(ee),lt=ee)},setFunc:function(ee,be,wn){(gt!==ee||Ft!==be||Ot!==wn)&&(i.stencilFunc(ee,be,wn),gt=ee,Ft=be,Ot=wn)},setOp:function(ee,be,wn){(Qt!==ee||te!==be||pe!==wn)&&(i.stencilOp(ee,be,wn),Qt=ee,te=be,pe=wn)},setLocked:function(ee){L=ee},setClear:function(ee){ve!==ee&&(i.clearStencil(ee),ve=ee)},reset:function(){L=!1,lt=null,gt=null,Ft=null,Ot=null,Qt=null,te=null,pe=null,ve=null}}}const a=new s,l=new r,c=new o,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,v=[],m=null,p=!1,_=null,x=null,y=null,R=null,S=null,E=null,O=null,b=new qt(0,0,0),w=0,k=!1,$=null,et=null,I=null,F=null,X=null;const J=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,q=0;const Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(Q)[1]),Y=q>=1):Q.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),Y=q>=2);let ot=null,dt={};const G=i.getParameter(i.SCISSOR_BOX),Z=i.getParameter(i.VIEWPORT),pt=new ce().fromArray(G),Et=new ce().fromArray(Z);function Tt(L,lt,gt,Ft){const Ot=new Uint8Array(4),Qt=i.createTexture();i.bindTexture(L,Qt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<gt;te++)n&&(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)?i.texImage3D(lt,0,i.RGBA,1,1,Ft,0,i.RGBA,i.UNSIGNED_BYTE,Ot):i.texImage2D(lt+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ot);return Qt}const Ut={};Ut[i.TEXTURE_2D]=Tt(i.TEXTURE_2D,i.TEXTURE_2D,1),Ut[i.TEXTURE_CUBE_MAP]=Tt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ut[i.TEXTURE_2D_ARRAY]=Tt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ut[i.TEXTURE_3D]=Tt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Dt(i.DEPTH_TEST),l.setFunc(So),zt(!1),A(uc),Dt(i.CULL_FACE),bt(ci);function Dt(L){d[L]!==!0&&(i.enable(L),d[L]=!0)}function Nt(L){d[L]!==!1&&(i.disable(L),d[L]=!1)}function Yt(L,lt){return f[L]!==lt?(i.bindFramebuffer(L,lt),f[L]=lt,n&&(L===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=lt),L===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=lt)),!0):!1}function B(L,lt){let gt=v,Ft=!1;if(L)if(gt=g.get(lt),gt===void 0&&(gt=[],g.set(lt,gt)),L.isWebGLMultipleRenderTargets){const Ot=L.texture;if(gt.length!==Ot.length||gt[0]!==i.COLOR_ATTACHMENT0){for(let Qt=0,te=Ot.length;Qt<te;Qt++)gt[Qt]=i.COLOR_ATTACHMENT0+Qt;gt.length=Ot.length,Ft=!0}}else gt[0]!==i.COLOR_ATTACHMENT0&&(gt[0]=i.COLOR_ATTACHMENT0,Ft=!0);else gt[0]!==i.BACK&&(gt[0]=i.BACK,Ft=!0);Ft&&(e.isWebGL2?i.drawBuffers(gt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(gt))}function Ee(L){return m!==L?(i.useProgram(L),m=L,!0):!1}const It={[Ri]:i.FUNC_ADD,[Qd]:i.FUNC_SUBTRACT,[tp]:i.FUNC_REVERSE_SUBTRACT};if(n)It[mc]=i.MIN,It[gc]=i.MAX;else{const L=t.get("EXT_blend_minmax");L!==null&&(It[mc]=L.MIN_EXT,It[gc]=L.MAX_EXT)}const kt={[ep]:i.ZERO,[np]:i.ONE,[ip]:i.SRC_COLOR,[rl]:i.SRC_ALPHA,[cp]:i.SRC_ALPHA_SATURATE,[ap]:i.DST_COLOR,[rp]:i.DST_ALPHA,[sp]:i.ONE_MINUS_SRC_COLOR,[ol]:i.ONE_MINUS_SRC_ALPHA,[lp]:i.ONE_MINUS_DST_COLOR,[op]:i.ONE_MINUS_DST_ALPHA,[hp]:i.CONSTANT_COLOR,[up]:i.ONE_MINUS_CONSTANT_COLOR,[fp]:i.CONSTANT_ALPHA,[dp]:i.ONE_MINUS_CONSTANT_ALPHA};function bt(L,lt,gt,Ft,Ot,Qt,te,pe,ve,ee){if(L===ci){p===!0&&(Nt(i.BLEND),p=!1);return}if(p===!1&&(Dt(i.BLEND),p=!0),L!==Zd){if(L!==_||ee!==k){if((x!==Ri||S!==Ri)&&(i.blendEquation(i.FUNC_ADD),x=Ri,S=Ri),ee)switch(L){case Ms:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case fc:i.blendFunc(i.ONE,i.ONE);break;case dc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Ms:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case fc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case dc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}y=null,R=null,E=null,O=null,b.set(0,0,0),w=0,_=L,k=ee}return}Ot=Ot||lt,Qt=Qt||gt,te=te||Ft,(lt!==x||Ot!==S)&&(i.blendEquationSeparate(It[lt],It[Ot]),x=lt,S=Ot),(gt!==y||Ft!==R||Qt!==E||te!==O)&&(i.blendFuncSeparate(kt[gt],kt[Ft],kt[Qt],kt[te]),y=gt,R=Ft,E=Qt,O=te),(pe.equals(b)===!1||ve!==w)&&(i.blendColor(pe.r,pe.g,pe.b,ve),b.copy(pe),w=ve),_=L,k=!1}function se(L,lt){L.side===an?Nt(i.CULL_FACE):Dt(i.CULL_FACE);let gt=L.side===Ze;lt&&(gt=!gt),zt(gt),L.blending===Ms&&L.transparent===!1?bt(ci):bt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),l.setFunc(L.depthFunc),l.setTest(L.depthTest),l.setMask(L.depthWrite),a.setMask(L.colorWrite);const Ft=L.stencilWrite;c.setTest(Ft),Ft&&(c.setMask(L.stencilWriteMask),c.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),c.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),z(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Dt(i.SAMPLE_ALPHA_TO_COVERAGE):Nt(i.SAMPLE_ALPHA_TO_COVERAGE)}function zt(L){$!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),$=L)}function A(L){L!==Kd?(Dt(i.CULL_FACE),L!==et&&(L===uc?i.cullFace(i.BACK):L===Jd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Nt(i.CULL_FACE),et=L}function M(L){L!==I&&(Y&&i.lineWidth(L),I=L)}function z(L,lt,gt){L?(Dt(i.POLYGON_OFFSET_FILL),(F!==lt||X!==gt)&&(i.polygonOffset(lt,gt),F=lt,X=gt)):Nt(i.POLYGON_OFFSET_FILL)}function it(L){L?Dt(i.SCISSOR_TEST):Nt(i.SCISSOR_TEST)}function tt(L){L===void 0&&(L=i.TEXTURE0+J-1),ot!==L&&(i.activeTexture(L),ot=L)}function nt(L,lt,gt){gt===void 0&&(ot===null?gt=i.TEXTURE0+J-1:gt=ot);let Ft=dt[gt];Ft===void 0&&(Ft={type:void 0,texture:void 0},dt[gt]=Ft),(Ft.type!==L||Ft.texture!==lt)&&(ot!==gt&&(i.activeTexture(gt),ot=gt),i.bindTexture(L,lt||Ut[L]),Ft.type=L,Ft.texture=lt)}function At(){const L=dt[ot];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function mt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function D(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function U(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function K(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function vt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function _t(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Rt(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function St(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function xt(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function P(L){pt.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),pt.copy(L))}function at(L){Et.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Et.copy(L))}function Pt(L,lt){let gt=u.get(lt);gt===void 0&&(gt=new WeakMap,u.set(lt,gt));let Ft=gt.get(L);Ft===void 0&&(Ft=i.getUniformBlockIndex(lt,L.name),gt.set(L,Ft))}function wt(L,lt){const Ft=u.get(lt).get(L);h.get(lt)!==Ft&&(i.uniformBlockBinding(lt,Ft,L.__bindingPointIndex),h.set(lt,Ft))}function st(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ot=null,dt={},f={},g=new WeakMap,v=[],m=null,p=!1,_=null,x=null,y=null,R=null,S=null,E=null,O=null,b=new qt(0,0,0),w=0,k=!1,$=null,et=null,I=null,F=null,X=null,pt.set(0,0,i.canvas.width,i.canvas.height),Et.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:Dt,disable:Nt,bindFramebuffer:Yt,drawBuffers:B,useProgram:Ee,setBlending:bt,setMaterial:se,setFlipSided:zt,setCullFace:A,setLineWidth:M,setPolygonOffset:z,setScissorTest:it,activeTexture:tt,bindTexture:nt,unbindTexture:At,compressedTexImage2D:mt,compressedTexImage3D:D,texImage2D:St,texImage3D:xt,updateUBOMapping:Pt,uniformBlockBinding:wt,texStorage2D:_t,texStorage3D:Rt,texSubImage2D:U,texSubImage3D:K,compressedTexSubImage2D:j,compressedTexSubImage3D:vt,scissor:P,viewport:at,reset:st}}function qx(i,t,e,n,s,r,o){const a=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,M){return f?new OffscreenCanvas(A,M):Co("canvas")}function v(A,M,z,it){let tt=1;if((A.width>it||A.height>it)&&(tt=it/Math.max(A.width,A.height)),tt<1||M===!0)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){const nt=M?fl:Math.floor,At=nt(tt*A.width),mt=nt(tt*A.height);u===void 0&&(u=g(At,mt));const D=z?g(At,mt):u;return D.width=At,D.height=mt,D.getContext("2d").drawImage(A,0,0,At,mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+A.width+"x"+A.height+") to ("+At+"x"+mt+")."),D}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+A.width+"x"+A.height+")."),A;return A}function m(A){return jc(A.width)&&jc(A.height)}function p(A){return a?!1:A.wrapS!==bn||A.wrapT!==bn||A.minFilter!==Oe&&A.minFilter!==Je}function _(A,M){return A.generateMipmaps&&M&&A.minFilter!==Oe&&A.minFilter!==Je}function x(A){i.generateMipmap(A)}function y(A,M,z,it,tt=!1){if(a===!1)return M;if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let nt=M;if(M===i.RED&&(z===i.FLOAT&&(nt=i.R32F),z===i.HALF_FLOAT&&(nt=i.R16F),z===i.UNSIGNED_BYTE&&(nt=i.R8)),M===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(nt=i.R8UI),z===i.UNSIGNED_SHORT&&(nt=i.R16UI),z===i.UNSIGNED_INT&&(nt=i.R32UI),z===i.BYTE&&(nt=i.R8I),z===i.SHORT&&(nt=i.R16I),z===i.INT&&(nt=i.R32I)),M===i.RG&&(z===i.FLOAT&&(nt=i.RG32F),z===i.HALF_FLOAT&&(nt=i.RG16F),z===i.UNSIGNED_BYTE&&(nt=i.RG8)),M===i.RGBA){const At=tt?Eo:ae.getTransfer(it);z===i.FLOAT&&(nt=i.RGBA32F),z===i.HALF_FLOAT&&(nt=i.RGBA16F),z===i.UNSIGNED_BYTE&&(nt=At===le?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function R(A,M,z){return _(A,z)===!0||A.isFramebufferTexture&&A.minFilter!==Oe&&A.minFilter!==Je?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function S(A){return A===Oe||A===vc||A===na?i.NEAREST:i.LINEAR}function E(A){const M=A.target;M.removeEventListener("dispose",E),b(M),M.isVideoTexture&&h.delete(M)}function O(A){const M=A.target;M.removeEventListener("dispose",O),k(M)}function b(A){const M=n.get(A);if(M.__webglInit===void 0)return;const z=A.source,it=d.get(z);if(it){const tt=it[M.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&w(A),Object.keys(it).length===0&&d.delete(z)}n.remove(A)}function w(A){const M=n.get(A);i.deleteTexture(M.__webglTexture);const z=A.source,it=d.get(z);delete it[M.__cacheKey],o.memory.textures--}function k(A){const M=A.texture,z=n.get(A),it=n.get(M);if(it.__webglTexture!==void 0&&(i.deleteTexture(it.__webglTexture),o.memory.textures--),A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(z.__webglFramebuffer[tt]))for(let nt=0;nt<z.__webglFramebuffer[tt].length;nt++)i.deleteFramebuffer(z.__webglFramebuffer[tt][nt]);else i.deleteFramebuffer(z.__webglFramebuffer[tt]);z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer[tt])}else{if(Array.isArray(z.__webglFramebuffer))for(let tt=0;tt<z.__webglFramebuffer.length;tt++)i.deleteFramebuffer(z.__webglFramebuffer[tt]);else i.deleteFramebuffer(z.__webglFramebuffer);if(z.__webglDepthbuffer&&i.deleteRenderbuffer(z.__webglDepthbuffer),z.__webglMultisampledFramebuffer&&i.deleteFramebuffer(z.__webglMultisampledFramebuffer),z.__webglColorRenderbuffer)for(let tt=0;tt<z.__webglColorRenderbuffer.length;tt++)z.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(z.__webglColorRenderbuffer[tt]);z.__webglDepthRenderbuffer&&i.deleteRenderbuffer(z.__webglDepthRenderbuffer)}if(A.isWebGLMultipleRenderTargets)for(let tt=0,nt=M.length;tt<nt;tt++){const At=n.get(M[tt]);At.__webglTexture&&(i.deleteTexture(At.__webglTexture),o.memory.textures--),n.remove(M[tt])}n.remove(M),n.remove(A)}let $=0;function et(){$=0}function I(){const A=$;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),$+=1,A}function F(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function X(A,M){const z=n.get(A);if(A.isVideoTexture&&se(A),A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){const it=A.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{pt(z,A,M);return}}e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+M)}function J(A,M){const z=n.get(A);if(A.version>0&&z.__version!==A.version){pt(z,A,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+M)}function Y(A,M){const z=n.get(A);if(A.version>0&&z.__version!==A.version){pt(z,A,M);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+M)}function q(A,M){const z=n.get(A);if(A.version>0&&z.__version!==A.version){Et(z,A,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+M)}const Q={[wo]:i.REPEAT,[bn]:i.CLAMP_TO_EDGE,[cl]:i.MIRRORED_REPEAT},ot={[Oe]:i.NEAREST,[vc]:i.NEAREST_MIPMAP_NEAREST,[na]:i.NEAREST_MIPMAP_LINEAR,[Je]:i.LINEAR,[Rp]:i.LINEAR_MIPMAP_NEAREST,[gr]:i.LINEAR_MIPMAP_LINEAR},dt={[Bp]:i.NEVER,[jp]:i.ALWAYS,[Hp]:i.LESS,[ff]:i.LEQUAL,[Vp]:i.EQUAL,[$p]:i.GEQUAL,[Wp]:i.GREATER,[Gp]:i.NOTEQUAL};function G(A,M,z){if(z?(i.texParameteri(A,i.TEXTURE_WRAP_S,Q[M.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Q[M.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Q[M.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,ot[M.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,ot[M.minFilter])):(i.texParameteri(A,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(A,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(M.wrapS!==bn||M.wrapT!==bn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(A,i.TEXTURE_MAG_FILTER,S(M.magFilter)),i.texParameteri(A,i.TEXTURE_MIN_FILTER,S(M.minFilter)),M.minFilter!==Oe&&M.minFilter!==Je&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),M.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,dt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const it=t.get("EXT_texture_filter_anisotropic");if(M.magFilter===Oe||M.minFilter!==na&&M.minFilter!==gr||M.type===li&&t.has("OES_texture_float_linear")===!1||a===!1&&M.type===vr&&t.has("OES_texture_half_float_linear")===!1)return;(M.anisotropy>1||n.get(M).__currentAnisotropy)&&(i.texParameterf(A,it.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy)}}function Z(A,M){let z=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",E));const it=M.source;let tt=d.get(it);tt===void 0&&(tt={},d.set(it,tt));const nt=F(M);if(nt!==A.__cacheKey){tt[nt]===void 0&&(tt[nt]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,z=!0),tt[nt].usedTimes++;const At=tt[A.__cacheKey];At!==void 0&&(tt[A.__cacheKey].usedTimes--,At.usedTimes===0&&w(M)),A.__cacheKey=nt,A.__webglTexture=tt[nt].texture}return z}function pt(A,M,z){let it=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(it=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(it=i.TEXTURE_3D);const tt=Z(A,M),nt=M.source;e.bindTexture(it,A.__webglTexture,i.TEXTURE0+z);const At=n.get(nt);if(nt.version!==At.__version||tt===!0){e.activeTexture(i.TEXTURE0+z);const mt=ae.getPrimaries(ae.workingColorSpace),D=M.colorSpace===dn?null:ae.getPrimaries(M.colorSpace),U=M.colorSpace===dn||mt===D?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,U);const K=p(M)&&m(M.image)===!1;let j=v(M.image,K,!1,s.maxTextureSize);j=zt(M,j);const vt=m(j)||a,_t=r.convert(M.format,M.colorSpace);let Rt=r.convert(M.type),St=y(M.internalFormat,_t,Rt,M.colorSpace,M.isVideoTexture);G(it,M,vt);let xt;const P=M.mipmaps,at=a&&M.isVideoTexture!==!0&&St!==hf,Pt=At.__version===void 0||tt===!0,wt=R(M,j,vt);if(M.isDepthTexture)St=i.DEPTH_COMPONENT,a?M.type===li?St=i.DEPTH_COMPONENT32F:M.type===ai?St=i.DEPTH_COMPONENT24:M.type===Oi?St=i.DEPTH24_STENCIL8:St=i.DEPTH_COMPONENT16:M.type===li&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),M.format===Ni&&St===i.DEPTH_COMPONENT&&M.type!==Il&&M.type!==ai&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),M.type=ai,Rt=r.convert(M.type)),M.format===Ps&&St===i.DEPTH_COMPONENT&&(St=i.DEPTH_STENCIL,M.type!==Oi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),M.type=Oi,Rt=r.convert(M.type))),Pt&&(at?e.texStorage2D(i.TEXTURE_2D,1,St,j.width,j.height):e.texImage2D(i.TEXTURE_2D,0,St,j.width,j.height,0,_t,Rt,null));else if(M.isDataTexture)if(P.length>0&&vt){at&&Pt&&e.texStorage2D(i.TEXTURE_2D,wt,St,P[0].width,P[0].height);for(let st=0,L=P.length;st<L;st++)xt=P[st],at?e.texSubImage2D(i.TEXTURE_2D,st,0,0,xt.width,xt.height,_t,Rt,xt.data):e.texImage2D(i.TEXTURE_2D,st,St,xt.width,xt.height,0,_t,Rt,xt.data);M.generateMipmaps=!1}else at?(Pt&&e.texStorage2D(i.TEXTURE_2D,wt,St,j.width,j.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,j.width,j.height,_t,Rt,j.data)):e.texImage2D(i.TEXTURE_2D,0,St,j.width,j.height,0,_t,Rt,j.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){at&&Pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,St,P[0].width,P[0].height,j.depth);for(let st=0,L=P.length;st<L;st++)xt=P[st],M.format!==fn?_t!==null?at?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,xt.width,xt.height,j.depth,_t,xt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,st,St,xt.width,xt.height,j.depth,0,xt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?e.texSubImage3D(i.TEXTURE_2D_ARRAY,st,0,0,0,xt.width,xt.height,j.depth,_t,Rt,xt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,st,St,xt.width,xt.height,j.depth,0,_t,Rt,xt.data)}else{at&&Pt&&e.texStorage2D(i.TEXTURE_2D,wt,St,P[0].width,P[0].height);for(let st=0,L=P.length;st<L;st++)xt=P[st],M.format!==fn?_t!==null?at?e.compressedTexSubImage2D(i.TEXTURE_2D,st,0,0,xt.width,xt.height,_t,xt.data):e.compressedTexImage2D(i.TEXTURE_2D,st,St,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?e.texSubImage2D(i.TEXTURE_2D,st,0,0,xt.width,xt.height,_t,Rt,xt.data):e.texImage2D(i.TEXTURE_2D,st,St,xt.width,xt.height,0,_t,Rt,xt.data)}else if(M.isDataArrayTexture)at?(Pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,St,j.width,j.height,j.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,_t,Rt,j.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,St,j.width,j.height,j.depth,0,_t,Rt,j.data);else if(M.isData3DTexture)at?(Pt&&e.texStorage3D(i.TEXTURE_3D,wt,St,j.width,j.height,j.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,_t,Rt,j.data)):e.texImage3D(i.TEXTURE_3D,0,St,j.width,j.height,j.depth,0,_t,Rt,j.data);else if(M.isFramebufferTexture){if(Pt)if(at)e.texStorage2D(i.TEXTURE_2D,wt,St,j.width,j.height);else{let st=j.width,L=j.height;for(let lt=0;lt<wt;lt++)e.texImage2D(i.TEXTURE_2D,lt,St,st,L,0,_t,Rt,null),st>>=1,L>>=1}}else if(P.length>0&&vt){at&&Pt&&e.texStorage2D(i.TEXTURE_2D,wt,St,P[0].width,P[0].height);for(let st=0,L=P.length;st<L;st++)xt=P[st],at?e.texSubImage2D(i.TEXTURE_2D,st,0,0,_t,Rt,xt):e.texImage2D(i.TEXTURE_2D,st,St,_t,Rt,xt);M.generateMipmaps=!1}else at?(Pt&&e.texStorage2D(i.TEXTURE_2D,wt,St,j.width,j.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,_t,Rt,j)):e.texImage2D(i.TEXTURE_2D,0,St,_t,Rt,j);_(M,vt)&&x(it),At.__version=nt.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Et(A,M,z){if(M.image.length!==6)return;const it=Z(A,M),tt=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+z);const nt=n.get(tt);if(tt.version!==nt.__version||it===!0){e.activeTexture(i.TEXTURE0+z);const At=ae.getPrimaries(ae.workingColorSpace),mt=M.colorSpace===dn?null:ae.getPrimaries(M.colorSpace),D=M.colorSpace===dn||At===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,D);const U=M.isCompressedTexture||M.image[0].isCompressedTexture,K=M.image[0]&&M.image[0].isDataTexture,j=[];for(let st=0;st<6;st++)!U&&!K?j[st]=v(M.image[st],!1,!0,s.maxCubemapSize):j[st]=K?M.image[st].image:M.image[st],j[st]=zt(M,j[st]);const vt=j[0],_t=m(vt)||a,Rt=r.convert(M.format,M.colorSpace),St=r.convert(M.type),xt=y(M.internalFormat,Rt,St,M.colorSpace),P=a&&M.isVideoTexture!==!0,at=nt.__version===void 0||it===!0;let Pt=R(M,vt,_t);G(i.TEXTURE_CUBE_MAP,M,_t);let wt;if(U){P&&at&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,xt,vt.width,vt.height);for(let st=0;st<6;st++){wt=j[st].mipmaps;for(let L=0;L<wt.length;L++){const lt=wt[L];M.format!==fn?Rt!==null?P?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,0,0,lt.width,lt.height,Rt,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,xt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,0,0,lt.width,lt.height,Rt,St,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L,xt,lt.width,lt.height,0,Rt,St,lt.data)}}}else{wt=M.mipmaps,P&&at&&(wt.length>0&&Pt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,xt,j[0].width,j[0].height));for(let st=0;st<6;st++)if(K){P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,j[st].width,j[st].height,Rt,St,j[st].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,xt,j[st].width,j[st].height,0,Rt,St,j[st].data);for(let L=0;L<wt.length;L++){const gt=wt[L].image[st].image;P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,0,0,gt.width,gt.height,Rt,St,gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,xt,gt.width,gt.height,0,Rt,St,gt.data)}}else{P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Rt,St,j[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,xt,Rt,St,j[st]);for(let L=0;L<wt.length;L++){const lt=wt[L];P?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,0,0,Rt,St,lt.image[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,L+1,xt,Rt,St,lt.image[st])}}}_(M,_t)&&x(i.TEXTURE_CUBE_MAP),nt.__version=tt.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Tt(A,M,z,it,tt,nt){const At=r.convert(z.format,z.colorSpace),mt=r.convert(z.type),D=y(z.internalFormat,At,mt,z.colorSpace);if(!n.get(M).__hasExternalTextures){const K=Math.max(1,M.width>>nt),j=Math.max(1,M.height>>nt);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,nt,D,K,j,M.depth,0,At,mt,null):e.texImage2D(tt,nt,D,K,j,0,At,mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),bt(M)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,tt,n.get(z).__webglTexture,0,kt(M)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,it,tt,n.get(z).__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(A,M,z){if(i.bindRenderbuffer(i.RENDERBUFFER,A),M.depthBuffer&&!M.stencilBuffer){let it=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(z||bt(M)){const tt=M.depthTexture;tt&&tt.isDepthTexture&&(tt.type===li?it=i.DEPTH_COMPONENT32F:tt.type===ai&&(it=i.DEPTH_COMPONENT24));const nt=kt(M);bt(M)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,nt,it,M.width,M.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,it,M.width,M.height)}else i.renderbufferStorage(i.RENDERBUFFER,it,M.width,M.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,A)}else if(M.depthBuffer&&M.stencilBuffer){const it=kt(M);z&&bt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,M.width,M.height):bt(M)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,it,i.DEPTH24_STENCIL8,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,A)}else{const it=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let tt=0;tt<it.length;tt++){const nt=it[tt],At=r.convert(nt.format,nt.colorSpace),mt=r.convert(nt.type),D=y(nt.internalFormat,At,mt,nt.colorSpace),U=kt(M);z&&bt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,U,D,M.width,M.height):bt(M)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,U,D,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,D,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(A,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),X(M.depthTexture,0);const it=n.get(M.depthTexture).__webglTexture,tt=kt(M);if(M.depthTexture.format===Ni)bt(M)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,it,0);else if(M.depthTexture.format===Ps)bt(M)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0,tt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,it,0);else throw new Error("Unknown depthTexture format")}function Nt(A){const M=n.get(A),z=A.isWebGLCubeRenderTarget===!0;if(A.depthTexture&&!M.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Dt(M.__webglFramebuffer,A)}else if(z){M.__webglDepthbuffer=[];for(let it=0;it<6;it++)e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[it]),M.__webglDepthbuffer[it]=i.createRenderbuffer(),Ut(M.__webglDepthbuffer[it],A,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=i.createRenderbuffer(),Ut(M.__webglDepthbuffer,A,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Yt(A,M,z){const it=n.get(A);M!==void 0&&Tt(it.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&Nt(A)}function B(A){const M=A.texture,z=n.get(A),it=n.get(M);A.addEventListener("dispose",O),A.isWebGLMultipleRenderTargets!==!0&&(it.__webglTexture===void 0&&(it.__webglTexture=i.createTexture()),it.__version=M.version,o.memory.textures++);const tt=A.isWebGLCubeRenderTarget===!0,nt=A.isWebGLMultipleRenderTargets===!0,At=m(A)||a;if(tt){z.__webglFramebuffer=[];for(let mt=0;mt<6;mt++)if(a&&M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer[mt]=[];for(let D=0;D<M.mipmaps.length;D++)z.__webglFramebuffer[mt][D]=i.createFramebuffer()}else z.__webglFramebuffer[mt]=i.createFramebuffer()}else{if(a&&M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer=[];for(let mt=0;mt<M.mipmaps.length;mt++)z.__webglFramebuffer[mt]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(nt)if(s.drawBuffers){const mt=A.texture;for(let D=0,U=mt.length;D<U;D++){const K=n.get(mt[D]);K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&A.samples>0&&bt(A)===!1){const mt=nt?M:[M];z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let D=0;D<mt.length;D++){const U=mt[D];z.__webglColorRenderbuffer[D]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[D]);const K=r.convert(U.format,U.colorSpace),j=r.convert(U.type),vt=y(U.internalFormat,K,j,U.colorSpace,A.isXRRenderTarget===!0),_t=kt(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,_t,vt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+D,i.RENDERBUFFER,z.__webglColorRenderbuffer[D])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ut(z.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(tt){e.bindTexture(i.TEXTURE_CUBE_MAP,it.__webglTexture),G(i.TEXTURE_CUBE_MAP,M,At);for(let mt=0;mt<6;mt++)if(a&&M.mipmaps&&M.mipmaps.length>0)for(let D=0;D<M.mipmaps.length;D++)Tt(z.__webglFramebuffer[mt][D],A,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,D);else Tt(z.__webglFramebuffer[mt],A,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0);_(M,At)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(nt){const mt=A.texture;for(let D=0,U=mt.length;D<U;D++){const K=mt[D],j=n.get(K);e.bindTexture(i.TEXTURE_2D,j.__webglTexture),G(i.TEXTURE_2D,K,At),Tt(z.__webglFramebuffer,A,K,i.COLOR_ATTACHMENT0+D,i.TEXTURE_2D,0),_(K,At)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let mt=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(a?mt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(mt,it.__webglTexture),G(mt,M,At),a&&M.mipmaps&&M.mipmaps.length>0)for(let D=0;D<M.mipmaps.length;D++)Tt(z.__webglFramebuffer[D],A,M,i.COLOR_ATTACHMENT0,mt,D);else Tt(z.__webglFramebuffer,A,M,i.COLOR_ATTACHMENT0,mt,0);_(M,At)&&x(mt),e.unbindTexture()}A.depthBuffer&&Nt(A)}function Ee(A){const M=m(A)||a,z=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let it=0,tt=z.length;it<tt;it++){const nt=z[it];if(_(nt,M)){const At=A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,mt=n.get(nt).__webglTexture;e.bindTexture(At,mt),x(At),e.unbindTexture()}}}function It(A){if(a&&A.samples>0&&bt(A)===!1){const M=A.isWebGLMultipleRenderTargets?A.texture:[A.texture],z=A.width,it=A.height;let tt=i.COLOR_BUFFER_BIT;const nt=[],At=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=n.get(A),D=A.isWebGLMultipleRenderTargets===!0;if(D)for(let U=0;U<M.length;U++)e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+U,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+U,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,mt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,mt.__webglFramebuffer);for(let U=0;U<M.length;U++){nt.push(i.COLOR_ATTACHMENT0+U),A.depthBuffer&&nt.push(At);const K=mt.__ignoreDepthValues!==void 0?mt.__ignoreDepthValues:!1;if(K===!1&&(A.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),D&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,mt.__webglColorRenderbuffer[U]),K===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[At]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[At])),D){const j=n.get(M[U]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,j,0)}i.blitFramebuffer(0,0,z,it,0,0,z,it,tt,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,nt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),D)for(let U=0;U<M.length;U++){e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+U,i.RENDERBUFFER,mt.__webglColorRenderbuffer[U]);const K=n.get(M[U]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+U,i.TEXTURE_2D,K,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,mt.__webglMultisampledFramebuffer)}}function kt(A){return Math.min(s.maxSamples,A.samples)}function bt(A){const M=n.get(A);return a&&A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function se(A){const M=o.render.frame;h.get(A)!==M&&(h.set(A,M),A.update())}function zt(A,M){const z=A.colorSpace,it=A.format,tt=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||A.format===hl||z!==Zn&&z!==dn&&(ae.getTransfer(z)===le?a===!1?t.has("EXT_sRGB")===!0&&it===fn?(A.format=hl,A.minFilter=Je,A.generateMipmaps=!1):M=pf.sRGBToLinear(M):(it!==fn||tt!==ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),M}this.allocateTextureUnit=I,this.resetTextureUnits=et,this.setTexture2D=X,this.setTexture2DArray=J,this.setTexture3D=Y,this.setTextureCube=q,this.rebindTextures=Yt,this.setupRenderTarget=B,this.updateRenderTargetMipmap=Ee,this.updateMultisampleRenderTarget=It,this.setupDepthRenderbuffer=Nt,this.setupFrameBufferTexture=Tt,this.useMultisampledRTT=bt}function Yx(i,t,e){const n=e.isWebGL2;function s(r,o=dn){let a;const l=ae.getTransfer(o);if(r===ui)return i.UNSIGNED_BYTE;if(r===rf)return i.UNSIGNED_SHORT_4_4_4_4;if(r===of)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Cp)return i.BYTE;if(r===Pp)return i.SHORT;if(r===Il)return i.UNSIGNED_SHORT;if(r===sf)return i.INT;if(r===ai)return i.UNSIGNED_INT;if(r===li)return i.FLOAT;if(r===vr)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===Lp)return i.ALPHA;if(r===fn)return i.RGBA;if(r===Dp)return i.LUMINANCE;if(r===Ip)return i.LUMINANCE_ALPHA;if(r===Ni)return i.DEPTH_COMPONENT;if(r===Ps)return i.DEPTH_STENCIL;if(r===hl)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Up)return i.RED;if(r===af)return i.RED_INTEGER;if(r===Op)return i.RG;if(r===lf)return i.RG_INTEGER;if(r===cf)return i.RGBA_INTEGER;if(r===ia||r===sa||r===ra||r===oa)if(l===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===ia)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ra)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===oa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===ia)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===sa)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ra)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===oa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===xc||r===_c||r===yc||r===bc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===xc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===_c)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===yc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===bc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===hf)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Mc||r===Sc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Mc)return l===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Sc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===wc||r===Ec||r===Tc||r===Ac||r===Rc||r===Cc||r===Pc||r===Lc||r===Dc||r===Ic||r===Uc||r===Oc||r===Nc||r===zc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===wc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ec)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Tc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Ac)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Rc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Cc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Pc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Lc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Dc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Ic)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Uc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Oc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Nc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===zc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===aa||r===kc||r===Fc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===aa)return l===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===kc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Fc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Np||r===Bc||r===Hc||r===Vc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===aa)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Bc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Hc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Vc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Oi?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class Kx extends on{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Vt extends Ie{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jx={type:"move"};class La{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Vt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Vt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Vt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Jx)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Vt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Zx extends $i{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const v=e.getContextAttributes();let m=null,p=null;const _=[],x=[],y=new ft;let R=null;const S=new on;S.layers.enable(1),S.viewport=new ce;const E=new on;E.layers.enable(2),E.viewport=new ce;const O=[S,E],b=new Kx;b.layers.enable(1),b.layers.enable(2);let w=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let Z=_[G];return Z===void 0&&(Z=new La,_[G]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(G){let Z=_[G];return Z===void 0&&(Z=new La,_[G]=Z),Z.getGripSpace()},this.getHand=function(G){let Z=_[G];return Z===void 0&&(Z=new La,_[G]=Z),Z.getHandSpace()};function $(G){const Z=x.indexOf(G.inputSource);if(Z===-1)return;const pt=_[Z];pt!==void 0&&(pt.update(G.inputSource,G.frame,c||o),pt.dispatchEvent({type:G.type,data:G.inputSource}))}function et(){s.removeEventListener("select",$),s.removeEventListener("selectstart",$),s.removeEventListener("selectend",$),s.removeEventListener("squeeze",$),s.removeEventListener("squeezestart",$),s.removeEventListener("squeezeend",$),s.removeEventListener("end",et),s.removeEventListener("inputsourceschange",I);for(let G=0;G<_.length;G++){const Z=x[G];Z!==null&&(x[G]=null,_[G].disconnect(Z))}w=null,k=null,t.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,dt.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(y.width,y.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){r=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){a=G,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(G){if(s=G,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",$),s.addEventListener("selectstart",$),s.addEventListener("selectend",$),s.addEventListener("squeeze",$),s.addEventListener("squeezestart",$),s.addEventListener("squeezeend",$),s.addEventListener("end",et),s.addEventListener("inputsourceschange",I),v.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(y),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Z={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new Bi(f.framebufferWidth,f.framebufferHeight,{format:fn,type:ui,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let Z=null,pt=null,Et=null;v.depth&&(Et=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=v.stencil?Ps:Ni,pt=v.stencil?Oi:ai);const Tt={colorFormat:e.RGBA8,depthFormat:Et,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Tt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new Bi(d.textureWidth,d.textureHeight,{format:fn,type:ui,depthTexture:new Ef(d.textureWidth,d.textureHeight,pt,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const Ut=t.properties.get(p);Ut.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),dt.setContext(s),dt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(G){for(let Z=0;Z<G.removed.length;Z++){const pt=G.removed[Z],Et=x.indexOf(pt);Et>=0&&(x[Et]=null,_[Et].disconnect(pt))}for(let Z=0;Z<G.added.length;Z++){const pt=G.added[Z];let Et=x.indexOf(pt);if(Et===-1){for(let Ut=0;Ut<_.length;Ut++)if(Ut>=x.length){x.push(pt),Et=Ut;break}else if(x[Ut]===null){x[Ut]=pt,Et=Ut;break}if(Et===-1)break}const Tt=_[Et];Tt&&Tt.connect(pt)}}const F=new C,X=new C;function J(G,Z,pt){F.setFromMatrixPosition(Z.matrixWorld),X.setFromMatrixPosition(pt.matrixWorld);const Et=F.distanceTo(X),Tt=Z.projectionMatrix.elements,Ut=pt.projectionMatrix.elements,Dt=Tt[14]/(Tt[10]-1),Nt=Tt[14]/(Tt[10]+1),Yt=(Tt[9]+1)/Tt[5],B=(Tt[9]-1)/Tt[5],Ee=(Tt[8]-1)/Tt[0],It=(Ut[8]+1)/Ut[0],kt=Dt*Ee,bt=Dt*It,se=Et/(-Ee+It),zt=se*-Ee;Z.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(zt),G.translateZ(se),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const A=Dt+se,M=Nt+se,z=kt-zt,it=bt+(Et-zt),tt=Yt*Nt/M*A,nt=B*Nt/M*A;G.projectionMatrix.makePerspective(z,it,tt,nt,A,M),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function Y(G,Z){Z===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(Z.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(s===null)return;b.near=E.near=S.near=G.near,b.far=E.far=S.far=G.far,(w!==b.near||k!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),w=b.near,k=b.far);const Z=G.parent,pt=b.cameras;Y(b,Z);for(let Et=0;Et<pt.length;Et++)Y(pt[Et],Z);pt.length===2?J(b,S,E):b.projectionMatrix.copy(S.projectionMatrix),q(G,b,Z)};function q(G,Z,pt){pt===null?G.matrix.copy(Z.matrixWorld):(G.matrix.copy(pt.matrixWorld),G.matrix.invert(),G.matrix.multiply(Z.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(Z.projectionMatrix),G.projectionMatrixInverse.copy(Z.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=ul*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(G){l=G,d!==null&&(d.fixedFoveation=G),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=G)};let Q=null;function ot(G,Z){if(h=Z.getViewerPose(c||o),g=Z,h!==null){const pt=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let Et=!1;pt.length!==b.cameras.length&&(b.cameras.length=0,Et=!0);for(let Tt=0;Tt<pt.length;Tt++){const Ut=pt[Tt];let Dt=null;if(f!==null)Dt=f.getViewport(Ut);else{const Yt=u.getViewSubImage(d,Ut);Dt=Yt.viewport,Tt===0&&(t.setRenderTargetTextures(p,Yt.colorTexture,d.ignoreDepthValues?void 0:Yt.depthStencilTexture),t.setRenderTarget(p))}let Nt=O[Tt];Nt===void 0&&(Nt=new on,Nt.layers.enable(Tt),Nt.viewport=new ce,O[Tt]=Nt),Nt.matrix.fromArray(Ut.transform.matrix),Nt.matrix.decompose(Nt.position,Nt.quaternion,Nt.scale),Nt.projectionMatrix.fromArray(Ut.projectionMatrix),Nt.projectionMatrixInverse.copy(Nt.projectionMatrix).invert(),Nt.viewport.set(Dt.x,Dt.y,Dt.width,Dt.height),Tt===0&&(b.matrix.copy(Nt.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),Et===!0&&b.cameras.push(Nt)}}for(let pt=0;pt<_.length;pt++){const Et=x[pt],Tt=_[pt];Et!==null&&Tt!==void 0&&Tt.update(Et,Z,c||o)}Q&&Q(G,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const dt=new Sf;dt.setAnimationLoop(ot),this.setAnimationLoop=function(G){Q=G},this.dispose=function(){}}}function Qx(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,yf(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,_,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ze&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ze&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=t.get(p).envMap;if(_&&(m.envMap.value=_,m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*x,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,_,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ze&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const _=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function t_(i,t,e,n){let s={},r={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,x){const y=x.program;n.uniformBlockBinding(_,y)}function c(_,x){let y=s[_.id];y===void 0&&(g(_),y=h(_),s[_.id]=y,_.addEventListener("dispose",m));const R=x.program;n.updateUBOMapping(_,R);const S=t.render.frame;r[_.id]!==S&&(d(_),r[_.id]=S)}function h(_){const x=u();_.__bindingPointIndex=x;const y=i.createBuffer(),R=_.__size,S=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,R,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,y),y}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const x=s[_.id],y=_.uniforms,R=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let S=0,E=y.length;S<E;S++){const O=Array.isArray(y[S])?y[S]:[y[S]];for(let b=0,w=O.length;b<w;b++){const k=O[b];if(f(k,S,b,R)===!0){const $=k.__offset,et=Array.isArray(k.value)?k.value:[k.value];let I=0;for(let F=0;F<et.length;F++){const X=et[F],J=v(X);typeof X=="number"||typeof X=="boolean"?(k.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,$+I,k.__data)):X.isMatrix3?(k.__data[0]=X.elements[0],k.__data[1]=X.elements[1],k.__data[2]=X.elements[2],k.__data[3]=0,k.__data[4]=X.elements[3],k.__data[5]=X.elements[4],k.__data[6]=X.elements[5],k.__data[7]=0,k.__data[8]=X.elements[6],k.__data[9]=X.elements[7],k.__data[10]=X.elements[8],k.__data[11]=0):(X.toArray(k.__data,I),I+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,$,k.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(_,x,y,R){const S=_.value,E=x+"_"+y;if(R[E]===void 0)return typeof S=="number"||typeof S=="boolean"?R[E]=S:R[E]=S.clone(),!0;{const O=R[E];if(typeof S=="number"||typeof S=="boolean"){if(O!==S)return R[E]=S,!0}else if(O.equals(S)===!1)return O.copy(S),!0}return!1}function g(_){const x=_.uniforms;let y=0;const R=16;for(let E=0,O=x.length;E<O;E++){const b=Array.isArray(x[E])?x[E]:[x[E]];for(let w=0,k=b.length;w<k;w++){const $=b[w],et=Array.isArray($.value)?$.value:[$.value];for(let I=0,F=et.length;I<F;I++){const X=et[I],J=v(X),Y=y%R;Y!==0&&R-Y<J.boundary&&(y+=R-Y),$.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=y,y+=J.storage}}}const S=y%R;return S>0&&(y+=R-S),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function m(_){const x=_.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class Lf{constructor(t={}){const{canvas:e=Kp(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const f=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=we,this._useLegacyLights=!1,this.toneMapping=hi,this.toneMappingExposure=1;const x=this;let y=!1,R=0,S=0,E=null,O=-1,b=null;const w=new ce,k=new ce;let $=null;const et=new qt(0);let I=0,F=e.width,X=e.height,J=1,Y=null,q=null;const Q=new ce(0,0,F,X),ot=new ce(0,0,F,X);let dt=!1;const G=new zl;let Z=!1,pt=!1,Et=null;const Tt=new re,Ut=new ft,Dt=new C,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Yt(){return E===null?J:1}let B=n;function Ee(T,N){for(let V=0;V<T.length;V++){const W=T[V],H=e.getContext(W,N);if(H!==null)return H}return null}try{const T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ll}`),e.addEventListener("webglcontextlost",st,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",lt,!1),B===null){const N=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&N.shift(),B=Ee(N,T),B===null)throw Ee(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&B instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),B.getShaderPrecisionFormat===void 0&&(B.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let It,kt,bt,se,zt,A,M,z,it,tt,nt,At,mt,D,U,K,j,vt,_t,Rt,St,xt,P,at;function Pt(){It=new hv(B),kt=new sv(B,It,t),It.init(kt),xt=new Yx(B,It,kt),bt=new Xx(B,It,kt),se=new dv(B),zt=new Ix,A=new qx(B,It,bt,zt,kt,xt,se),M=new ov(x),z=new cv(x),it=new bm(B,kt),P=new nv(B,It,it,kt),tt=new uv(B,it,se,P),nt=new vv(B,tt,it,se),_t=new gv(B,kt,A),K=new rv(zt),At=new Dx(x,M,z,It,kt,P,K),mt=new Qx(x,zt),D=new Ox,U=new Hx(It,kt),vt=new ev(x,M,z,bt,nt,d,l),j=new jx(x,nt,kt),at=new t_(B,se,kt,bt),Rt=new iv(B,It,se,kt),St=new fv(B,It,se,kt),se.programs=At.programs,x.capabilities=kt,x.extensions=It,x.properties=zt,x.renderLists=D,x.shadowMap=j,x.state=bt,x.info=se}Pt();const wt=new Zx(x,B);this.xr=wt,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const T=It.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=It.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(T){T!==void 0&&(J=T,this.setSize(F,X,!1))},this.getSize=function(T){return T.set(F,X)},this.setSize=function(T,N,V=!0){if(wt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=T,X=N,e.width=Math.floor(T*J),e.height=Math.floor(N*J),V===!0&&(e.style.width=T+"px",e.style.height=N+"px"),this.setViewport(0,0,T,N)},this.getDrawingBufferSize=function(T){return T.set(F*J,X*J).floor()},this.setDrawingBufferSize=function(T,N,V){F=T,X=N,J=V,e.width=Math.floor(T*V),e.height=Math.floor(N*V),this.setViewport(0,0,T,N)},this.getCurrentViewport=function(T){return T.copy(w)},this.getViewport=function(T){return T.copy(Q)},this.setViewport=function(T,N,V,W){T.isVector4?Q.set(T.x,T.y,T.z,T.w):Q.set(T,N,V,W),bt.viewport(w.copy(Q).multiplyScalar(J).floor())},this.getScissor=function(T){return T.copy(ot)},this.setScissor=function(T,N,V,W){T.isVector4?ot.set(T.x,T.y,T.z,T.w):ot.set(T,N,V,W),bt.scissor(k.copy(ot).multiplyScalar(J).floor())},this.getScissorTest=function(){return dt},this.setScissorTest=function(T){bt.setScissorTest(dt=T)},this.setOpaqueSort=function(T){Y=T},this.setTransparentSort=function(T){q=T},this.getClearColor=function(T){return T.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor.apply(vt,arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha.apply(vt,arguments)},this.clear=function(T=!0,N=!0,V=!0){let W=0;if(T){let H=!1;if(E!==null){const Mt=E.texture.format;H=Mt===cf||Mt===lf||Mt===af}if(H){const Mt=E.texture.type,Lt=Mt===ui||Mt===ai||Mt===Il||Mt===Oi||Mt===rf||Mt===of,Bt=vt.getClearColor(),Ht=vt.getClearAlpha(),Kt=Bt.r,$t=Bt.g,jt=Bt.b;Lt?(f[0]=Kt,f[1]=$t,f[2]=jt,f[3]=Ht,B.clearBufferuiv(B.COLOR,0,f)):(g[0]=Kt,g[1]=$t,g[2]=jt,g[3]=Ht,B.clearBufferiv(B.COLOR,0,g))}else W|=B.COLOR_BUFFER_BIT}N&&(W|=B.DEPTH_BUFFER_BIT),V&&(W|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",st,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),D.dispose(),U.dispose(),zt.dispose(),M.dispose(),z.dispose(),nt.dispose(),P.dispose(),at.dispose(),At.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",ve),wt.removeEventListener("sessionend",ee),Et&&(Et.dispose(),Et=null),be.stop()};function st(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const T=se.autoReset,N=j.enabled,V=j.autoUpdate,W=j.needsUpdate,H=j.type;Pt(),se.autoReset=T,j.enabled=N,j.autoUpdate=V,j.needsUpdate=W,j.type=H}function lt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function gt(T){const N=T.target;N.removeEventListener("dispose",gt),Ft(N)}function Ft(T){Ot(T),zt.remove(T)}function Ot(T){const N=zt.get(T).programs;N!==void 0&&(N.forEach(function(V){At.releaseProgram(V)}),T.isShaderMaterial&&At.releaseShaderCache(T))}this.renderBufferDirect=function(T,N,V,W,H,Mt){N===null&&(N=Nt);const Lt=H.isMesh&&H.matrixWorld.determinant()<0,Bt=Wd(T,N,V,W,H);bt.setMaterial(W,Lt);let Ht=V.index,Kt=1;if(W.wireframe===!0){if(Ht=tt.getWireframeAttribute(V),Ht===void 0)return;Kt=2}const $t=V.drawRange,jt=V.attributes.position;let xe=$t.start*Kt,en=($t.start+$t.count)*Kt;Mt!==null&&(xe=Math.max(xe,Mt.start*Kt),en=Math.min(en,(Mt.start+Mt.count)*Kt)),Ht!==null?(xe=Math.max(xe,0),en=Math.min(en,Ht.count)):jt!=null&&(xe=Math.max(xe,0),en=Math.min(en,jt.count));const Pe=en-xe;if(Pe<0||Pe===1/0)return;P.setup(H,W,Bt,V,Ht);let Nn,he=Rt;if(Ht!==null&&(Nn=it.get(Ht),he=St,he.setIndex(Nn)),H.isMesh)W.wireframe===!0?(bt.setLineWidth(W.wireframeLinewidth*Yt()),he.setMode(B.LINES)):he.setMode(B.TRIANGLES);else if(H.isLine){let Jt=W.linewidth;Jt===void 0&&(Jt=1),bt.setLineWidth(Jt*Yt()),H.isLineSegments?he.setMode(B.LINES):H.isLineLoop?he.setMode(B.LINE_LOOP):he.setMode(B.LINE_STRIP)}else H.isPoints?he.setMode(B.POINTS):H.isSprite&&he.setMode(B.TRIANGLES);if(H.isBatchedMesh)he.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else if(H.isInstancedMesh)he.renderInstances(xe,Pe,H.count);else if(V.isInstancedBufferGeometry){const Jt=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Zo=Math.min(V.instanceCount,Jt);he.renderInstances(xe,Pe,Zo)}else he.render(xe,Pe)};function Qt(T,N,V){T.transparent===!0&&T.side===an&&T.forceSinglePass===!1?(T.side=Ze,T.needsUpdate=!0,Ur(T,N,V),T.side=mi,T.needsUpdate=!0,Ur(T,N,V),T.side=an):Ur(T,N,V)}this.compile=function(T,N,V=null){V===null&&(V=T),m=U.get(V),m.init(),_.push(m),V.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),T!==V&&T.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights(x._useLegacyLights);const W=new Set;return T.traverse(function(H){const Mt=H.material;if(Mt)if(Array.isArray(Mt))for(let Lt=0;Lt<Mt.length;Lt++){const Bt=Mt[Lt];Qt(Bt,V,H),W.add(Bt)}else Qt(Mt,V,H),W.add(Mt)}),_.pop(),m=null,W},this.compileAsync=function(T,N,V=null){const W=this.compile(T,N,V);return new Promise(H=>{function Mt(){if(W.forEach(function(Lt){zt.get(Lt).currentProgram.isReady()&&W.delete(Lt)}),W.size===0){H(T);return}setTimeout(Mt,10)}It.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let te=null;function pe(T){te&&te(T)}function ve(){be.stop()}function ee(){be.start()}const be=new Sf;be.setAnimationLoop(pe),typeof self<"u"&&be.setContext(self),this.setAnimationLoop=function(T){te=T,wt.setAnimationLoop(T),T===null?be.stop():be.start()},wt.addEventListener("sessionstart",ve),wt.addEventListener("sessionend",ee),this.render=function(T,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(N),N=wt.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,N,E),m=U.get(T,_.length),m.init(),_.push(m),Tt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),G.setFromProjectionMatrix(Tt),pt=this.localClippingEnabled,Z=K.init(this.clippingPlanes,pt),v=D.get(T,p.length),v.init(),p.push(v),wn(T,N,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(Y,q),this.info.render.frame++,Z===!0&&K.beginShadows();const V=m.state.shadowsArray;if(j.render(V,T,N),Z===!0&&K.endShadows(),this.info.autoReset===!0&&this.info.reset(),vt.render(v,T),m.setupLights(x._useLegacyLights),N.isArrayCamera){const W=N.cameras;for(let H=0,Mt=W.length;H<Mt;H++){const Lt=W[H];sc(v,T,Lt,Lt.viewport)}}else sc(v,T,N);E!==null&&(A.updateMultisampleRenderTarget(E),A.updateRenderTargetMipmap(E)),T.isScene===!0&&T.onAfterRender(x,T,N),P.resetDefaultState(),O=-1,b=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function wn(T,N,V,W){if(T.visible===!1)return;if(T.layers.test(N.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(N);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||G.intersectsSprite(T)){W&&Dt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Tt);const Lt=nt.update(T),Bt=T.material;Bt.visible&&v.push(T,Lt,Bt,V,Dt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||G.intersectsObject(T))){const Lt=nt.update(T),Bt=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Dt.copy(T.boundingSphere.center)):(Lt.boundingSphere===null&&Lt.computeBoundingSphere(),Dt.copy(Lt.boundingSphere.center)),Dt.applyMatrix4(T.matrixWorld).applyMatrix4(Tt)),Array.isArray(Bt)){const Ht=Lt.groups;for(let Kt=0,$t=Ht.length;Kt<$t;Kt++){const jt=Ht[Kt],xe=Bt[jt.materialIndex];xe&&xe.visible&&v.push(T,Lt,xe,V,Dt.z,jt)}}else Bt.visible&&v.push(T,Lt,Bt,V,Dt.z,null)}}const Mt=T.children;for(let Lt=0,Bt=Mt.length;Lt<Bt;Lt++)wn(Mt[Lt],N,V,W)}function sc(T,N,V,W){const H=T.opaque,Mt=T.transmissive,Lt=T.transparent;m.setupLightsView(V),Z===!0&&K.setGlobalState(x.clippingPlanes,V),Mt.length>0&&Vd(H,Mt,N,V),W&&bt.viewport(w.copy(W)),H.length>0&&Ir(H,N,V),Mt.length>0&&Ir(Mt,N,V),Lt.length>0&&Ir(Lt,N,V),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function Vd(T,N,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;const Mt=kt.isWebGL2;Et===null&&(Et=new Bi(1,1,{generateMipmaps:!0,type:It.has("EXT_color_buffer_half_float")?vr:ui,minFilter:gr,samples:Mt?4:0})),x.getDrawingBufferSize(Ut),Mt?Et.setSize(Ut.x,Ut.y):Et.setSize(fl(Ut.x),fl(Ut.y));const Lt=x.getRenderTarget();x.setRenderTarget(Et),x.getClearColor(et),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();const Bt=x.toneMapping;x.toneMapping=hi,Ir(T,V,W),A.updateMultisampleRenderTarget(Et),A.updateRenderTargetMipmap(Et);let Ht=!1;for(let Kt=0,$t=N.length;Kt<$t;Kt++){const jt=N[Kt],xe=jt.object,en=jt.geometry,Pe=jt.material,Nn=jt.group;if(Pe.side===an&&xe.layers.test(W.layers)){const he=Pe.side;Pe.side=Ze,Pe.needsUpdate=!0,rc(xe,V,W,en,Pe,Nn),Pe.side=he,Pe.needsUpdate=!0,Ht=!0}}Ht===!0&&(A.updateMultisampleRenderTarget(Et),A.updateRenderTargetMipmap(Et)),x.setRenderTarget(Lt),x.setClearColor(et,I),x.toneMapping=Bt}function Ir(T,N,V){const W=N.isScene===!0?N.overrideMaterial:null;for(let H=0,Mt=T.length;H<Mt;H++){const Lt=T[H],Bt=Lt.object,Ht=Lt.geometry,Kt=W===null?Lt.material:W,$t=Lt.group;Bt.layers.test(V.layers)&&rc(Bt,N,V,Ht,Kt,$t)}}function rc(T,N,V,W,H,Mt){T.onBeforeRender(x,N,V,W,H,Mt),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),H.onBeforeRender(x,N,V,W,T,Mt),H.transparent===!0&&H.side===an&&H.forceSinglePass===!1?(H.side=Ze,H.needsUpdate=!0,x.renderBufferDirect(V,N,W,H,T,Mt),H.side=mi,H.needsUpdate=!0,x.renderBufferDirect(V,N,W,H,T,Mt),H.side=an):x.renderBufferDirect(V,N,W,H,T,Mt),T.onAfterRender(x,N,V,W,H,Mt)}function Ur(T,N,V){N.isScene!==!0&&(N=Nt);const W=zt.get(T),H=m.state.lights,Mt=m.state.shadowsArray,Lt=H.state.version,Bt=At.getParameters(T,H.state,Mt,N,V),Ht=At.getProgramCacheKey(Bt);let Kt=W.programs;W.environment=T.isMeshStandardMaterial?N.environment:null,W.fog=N.fog,W.envMap=(T.isMeshStandardMaterial?z:M).get(T.envMap||W.environment),Kt===void 0&&(T.addEventListener("dispose",gt),Kt=new Map,W.programs=Kt);let $t=Kt.get(Ht);if($t!==void 0){if(W.currentProgram===$t&&W.lightsStateVersion===Lt)return ac(T,Bt),$t}else Bt.uniforms=At.getUniforms(T),T.onBuild(V,Bt,x),T.onBeforeCompile(Bt,x),$t=At.acquireProgram(Bt,Ht),Kt.set(Ht,$t),W.uniforms=Bt.uniforms;const jt=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(jt.clippingPlanes=K.uniform),ac(T,Bt),W.needsLights=$d(T),W.lightsStateVersion=Lt,W.needsLights&&(jt.ambientLightColor.value=H.state.ambient,jt.lightProbe.value=H.state.probe,jt.directionalLights.value=H.state.directional,jt.directionalLightShadows.value=H.state.directionalShadow,jt.spotLights.value=H.state.spot,jt.spotLightShadows.value=H.state.spotShadow,jt.rectAreaLights.value=H.state.rectArea,jt.ltc_1.value=H.state.rectAreaLTC1,jt.ltc_2.value=H.state.rectAreaLTC2,jt.pointLights.value=H.state.point,jt.pointLightShadows.value=H.state.pointShadow,jt.hemisphereLights.value=H.state.hemi,jt.directionalShadowMap.value=H.state.directionalShadowMap,jt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,jt.spotShadowMap.value=H.state.spotShadowMap,jt.spotLightMatrix.value=H.state.spotLightMatrix,jt.spotLightMap.value=H.state.spotLightMap,jt.pointShadowMap.value=H.state.pointShadowMap,jt.pointShadowMatrix.value=H.state.pointShadowMatrix),W.currentProgram=$t,W.uniformsList=null,$t}function oc(T){if(T.uniformsList===null){const N=T.currentProgram.getUniforms();T.uniformsList=vo.seqWithValue(N.seq,T.uniforms)}return T.uniformsList}function ac(T,N){const V=zt.get(T);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function Wd(T,N,V,W,H){N.isScene!==!0&&(N=Nt),A.resetTextureUnits();const Mt=N.fog,Lt=W.isMeshStandardMaterial?N.environment:null,Bt=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Zn,Ht=(W.isMeshStandardMaterial?z:M).get(W.envMap||Lt),Kt=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,$t=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),jt=!!V.morphAttributes.position,xe=!!V.morphAttributes.normal,en=!!V.morphAttributes.color;let Pe=hi;W.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Pe=x.toneMapping);const Nn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,he=Nn!==void 0?Nn.length:0,Jt=zt.get(W),Zo=m.state.lights;if(Z===!0&&(pt===!0||T!==b)){const hn=T===b&&W.id===O;K.setState(W,T,hn)}let me=!1;W.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==Zo.state.version||Jt.outputColorSpace!==Bt||H.isBatchedMesh&&Jt.batching===!1||!H.isBatchedMesh&&Jt.batching===!0||H.isInstancedMesh&&Jt.instancing===!1||!H.isInstancedMesh&&Jt.instancing===!0||H.isSkinnedMesh&&Jt.skinning===!1||!H.isSkinnedMesh&&Jt.skinning===!0||H.isInstancedMesh&&Jt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Jt.instancingColor===!1&&H.instanceColor!==null||Jt.envMap!==Ht||W.fog===!0&&Jt.fog!==Mt||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==K.numPlanes||Jt.numIntersection!==K.numIntersection)||Jt.vertexAlphas!==Kt||Jt.vertexTangents!==$t||Jt.morphTargets!==jt||Jt.morphNormals!==xe||Jt.morphColors!==en||Jt.toneMapping!==Pe||kt.isWebGL2===!0&&Jt.morphTargetsCount!==he)&&(me=!0):(me=!0,Jt.__version=W.version);let xi=Jt.currentProgram;me===!0&&(xi=Ur(W,N,H));let lc=!1,$s=!1,Qo=!1;const ze=xi.getUniforms(),_i=Jt.uniforms;if(bt.useProgram(xi.program)&&(lc=!0,$s=!0,Qo=!0),W.id!==O&&(O=W.id,$s=!0),lc||b!==T){ze.setValue(B,"projectionMatrix",T.projectionMatrix),ze.setValue(B,"viewMatrix",T.matrixWorldInverse);const hn=ze.map.cameraPosition;hn!==void 0&&hn.setValue(B,Dt.setFromMatrixPosition(T.matrixWorld)),kt.logarithmicDepthBuffer&&ze.setValue(B,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&ze.setValue(B,"isOrthographic",T.isOrthographicCamera===!0),b!==T&&(b=T,$s=!0,Qo=!0)}if(H.isSkinnedMesh){ze.setOptional(B,H,"bindMatrix"),ze.setOptional(B,H,"bindMatrixInverse");const hn=H.skeleton;hn&&(kt.floatVertexTextures?(hn.boneTexture===null&&hn.computeBoneTexture(),ze.setValue(B,"boneTexture",hn.boneTexture,A)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}H.isBatchedMesh&&(ze.setOptional(B,H,"batchingTexture"),ze.setValue(B,"batchingTexture",H._matricesTexture,A));const ta=V.morphAttributes;if((ta.position!==void 0||ta.normal!==void 0||ta.color!==void 0&&kt.isWebGL2===!0)&&_t.update(H,V,xi),($s||Jt.receiveShadow!==H.receiveShadow)&&(Jt.receiveShadow=H.receiveShadow,ze.setValue(B,"receiveShadow",H.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(_i.envMap.value=Ht,_i.flipEnvMap.value=Ht.isCubeTexture&&Ht.isRenderTargetTexture===!1?-1:1),$s&&(ze.setValue(B,"toneMappingExposure",x.toneMappingExposure),Jt.needsLights&&Gd(_i,Qo),Mt&&W.fog===!0&&mt.refreshFogUniforms(_i,Mt),mt.refreshMaterialUniforms(_i,W,J,X,Et),vo.upload(B,oc(Jt),_i,A)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(vo.upload(B,oc(Jt),_i,A),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&ze.setValue(B,"center",H.center),ze.setValue(B,"modelViewMatrix",H.modelViewMatrix),ze.setValue(B,"normalMatrix",H.normalMatrix),ze.setValue(B,"modelMatrix",H.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const hn=W.uniformsGroups;for(let ea=0,jd=hn.length;ea<jd;ea++)if(kt.isWebGL2){const cc=hn[ea];at.update(cc,xi),at.bind(cc,xi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return xi}function Gd(T,N){T.ambientLightColor.needsUpdate=N,T.lightProbe.needsUpdate=N,T.directionalLights.needsUpdate=N,T.directionalLightShadows.needsUpdate=N,T.pointLights.needsUpdate=N,T.pointLightShadows.needsUpdate=N,T.spotLights.needsUpdate=N,T.spotLightShadows.needsUpdate=N,T.rectAreaLights.needsUpdate=N,T.hemisphereLights.needsUpdate=N}function $d(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(T,N,V){zt.get(T.texture).__webglTexture=N,zt.get(T.depthTexture).__webglTexture=V;const W=zt.get(T);W.__hasExternalTextures=!0,W.__hasExternalTextures&&(W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||It.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,N){const V=zt.get(T);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(T,N=0,V=0){E=T,R=N,S=V;let W=!0,H=null,Mt=!1,Lt=!1;if(T){const Ht=zt.get(T);Ht.__useDefaultFramebuffer!==void 0?(bt.bindFramebuffer(B.FRAMEBUFFER,null),W=!1):Ht.__webglFramebuffer===void 0?A.setupRenderTarget(T):Ht.__hasExternalTextures&&A.rebindTextures(T,zt.get(T.texture).__webglTexture,zt.get(T.depthTexture).__webglTexture);const Kt=T.texture;(Kt.isData3DTexture||Kt.isDataArrayTexture||Kt.isCompressedArrayTexture)&&(Lt=!0);const $t=zt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray($t[N])?H=$t[N][V]:H=$t[N],Mt=!0):kt.isWebGL2&&T.samples>0&&A.useMultisampledRTT(T)===!1?H=zt.get(T).__webglMultisampledFramebuffer:Array.isArray($t)?H=$t[V]:H=$t,w.copy(T.viewport),k.copy(T.scissor),$=T.scissorTest}else w.copy(Q).multiplyScalar(J).floor(),k.copy(ot).multiplyScalar(J).floor(),$=dt;if(bt.bindFramebuffer(B.FRAMEBUFFER,H)&&kt.drawBuffers&&W&&bt.drawBuffers(T,H),bt.viewport(w),bt.scissor(k),bt.setScissorTest($),Mt){const Ht=zt.get(T.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+N,Ht.__webglTexture,V)}else if(Lt){const Ht=zt.get(T.texture),Kt=N||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,Ht.__webglTexture,V||0,Kt)}O=-1},this.readRenderTargetPixels=function(T,N,V,W,H,Mt,Lt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Bt=zt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Lt!==void 0&&(Bt=Bt[Lt]),Bt){bt.bindFramebuffer(B.FRAMEBUFFER,Bt);try{const Ht=T.texture,Kt=Ht.format,$t=Ht.type;if(Kt!==fn&&xt.convert(Kt)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const jt=$t===vr&&(It.has("EXT_color_buffer_half_float")||kt.isWebGL2&&It.has("EXT_color_buffer_float"));if($t!==ui&&xt.convert($t)!==B.getParameter(B.IMPLEMENTATION_COLOR_READ_TYPE)&&!($t===li&&(kt.isWebGL2||It.has("OES_texture_float")||It.has("WEBGL_color_buffer_float")))&&!jt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=T.width-W&&V>=0&&V<=T.height-H&&B.readPixels(N,V,W,H,xt.convert(Kt),xt.convert($t),Mt)}finally{const Ht=E!==null?zt.get(E).__webglFramebuffer:null;bt.bindFramebuffer(B.FRAMEBUFFER,Ht)}}},this.copyFramebufferToTexture=function(T,N,V=0){const W=Math.pow(2,-V),H=Math.floor(N.image.width*W),Mt=Math.floor(N.image.height*W);A.setTexture2D(N,0),B.copyTexSubImage2D(B.TEXTURE_2D,V,0,0,T.x,T.y,H,Mt),bt.unbindTexture()},this.copyTextureToTexture=function(T,N,V,W=0){const H=N.image.width,Mt=N.image.height,Lt=xt.convert(V.format),Bt=xt.convert(V.type);A.setTexture2D(V,0),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,V.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,V.unpackAlignment),N.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,W,T.x,T.y,H,Mt,Lt,Bt,N.image.data):N.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,W,T.x,T.y,N.mipmaps[0].width,N.mipmaps[0].height,Lt,N.mipmaps[0].data):B.texSubImage2D(B.TEXTURE_2D,W,T.x,T.y,Lt,Bt,N.image),W===0&&V.generateMipmaps&&B.generateMipmap(B.TEXTURE_2D),bt.unbindTexture()},this.copyTextureToTexture3D=function(T,N,V,W,H=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Mt=T.max.x-T.min.x+1,Lt=T.max.y-T.min.y+1,Bt=T.max.z-T.min.z+1,Ht=xt.convert(W.format),Kt=xt.convert(W.type);let $t;if(W.isData3DTexture)A.setTexture3D(W,0),$t=B.TEXTURE_3D;else if(W.isDataArrayTexture||W.isCompressedArrayTexture)A.setTexture2DArray(W,0),$t=B.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,W.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,W.unpackAlignment);const jt=B.getParameter(B.UNPACK_ROW_LENGTH),xe=B.getParameter(B.UNPACK_IMAGE_HEIGHT),en=B.getParameter(B.UNPACK_SKIP_PIXELS),Pe=B.getParameter(B.UNPACK_SKIP_ROWS),Nn=B.getParameter(B.UNPACK_SKIP_IMAGES),he=V.isCompressedTexture?V.mipmaps[H]:V.image;B.pixelStorei(B.UNPACK_ROW_LENGTH,he.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,he.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,T.min.x),B.pixelStorei(B.UNPACK_SKIP_ROWS,T.min.y),B.pixelStorei(B.UNPACK_SKIP_IMAGES,T.min.z),V.isDataTexture||V.isData3DTexture?B.texSubImage3D($t,H,N.x,N.y,N.z,Mt,Lt,Bt,Ht,Kt,he.data):V.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),B.compressedTexSubImage3D($t,H,N.x,N.y,N.z,Mt,Lt,Bt,Ht,he.data)):B.texSubImage3D($t,H,N.x,N.y,N.z,Mt,Lt,Bt,Ht,Kt,he),B.pixelStorei(B.UNPACK_ROW_LENGTH,jt),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,xe),B.pixelStorei(B.UNPACK_SKIP_PIXELS,en),B.pixelStorei(B.UNPACK_SKIP_ROWS,Pe),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Nn),H===0&&W.generateMipmaps&&B.generateMipmap($t),bt.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?A.setTextureCube(T,0):T.isData3DTexture?A.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?A.setTexture2DArray(T,0):A.setTexture2D(T,0),bt.unbindTexture()},this.resetState=function(){R=0,S=0,E=null,bt.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ol?"display-p3":"srgb",e.unpackColorSpace=ae.workingColorSpace===No?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===we?zi:uf}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===zi?we:Zn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class e_ extends Lf{}e_.prototype.isWebGL1Renderer=!0;class Fl{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new qt(t),this.near=e,this.far=n}clone(){return new Fl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Df extends Ie{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class n_ extends $e{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Oe,h=Oe,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Lh extends cn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ds=new re,Dh=new re,io=[],Ih=new ji,i_=new re,Js=new Gt,Zs=new Fs;class or extends Gt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Lh(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,i_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ji),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ds),Ih.copy(t.boundingBox).applyMatrix4(ds),this.boundingBox.union(Ih)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ds),Zs.copy(t.boundingSphere).applyMatrix4(ds),this.boundingSphere.union(Zs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(Js.geometry=this.geometry,Js.material=this.material,Js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Zs.copy(this.boundingSphere),Zs.applyMatrix4(n),t.ray.intersectsSphere(Zs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ds),Dh.multiplyMatrices(n,ds),Js.matrixWorld=Dh,Js.raycast(t,io);for(let o=0,a=io.length;o<a;o++){const l=io[o];l.instanceId=r,l.object=this,e.push(l)}io.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Lh(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Fo extends Xi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Uh=new C,Oh=new C,Nh=new re,Da=new zo,so=new Fs;class xo extends Ie{constructor(t=new de,e=new Fo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Uh.fromBufferAttribute(e,s-1),Oh.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Uh.distanceTo(Oh);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),so.copy(n.boundingSphere),so.applyMatrix4(s),so.radius+=r,t.ray.intersectsSphere(so)===!1)return;Nh.copy(s).invert(),Da.copy(t.ray).applyMatrix4(Nh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new C,h=new C,u=new C,d=new C,f=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,o.start),_=Math.min(g.count,o.start+o.count);for(let x=p,y=_-1;x<y;x+=f){const R=g.getX(x),S=g.getX(x+1);if(c.fromBufferAttribute(m,R),h.fromBufferAttribute(m,S),Da.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const O=t.ray.origin.distanceTo(d);O<t.near||O>t.far||e.push({distance:O,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,o.start),_=Math.min(m.count,o.start+o.count);for(let x=p,y=_-1;x<y;x+=f){if(c.fromBufferAttribute(m,x),h.fromBufferAttribute(m,x+1),Da.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);const S=t.ray.origin.distanceTo(d);S<t.near||S>t.far||e.push({distance:S,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const zh=new C,kh=new C;class s_ extends xo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)zh.fromBufferAttribute(e,s),kh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+zh.distanceTo(kh);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Bl extends $e{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class On{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new ft:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],o=[],a=new C,l=new re;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(De(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(De(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Hl extends On{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e){const n=e||new ft,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class r_ extends Hl{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Vl(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const ro=new C,Ia=new Vl,Ua=new Vl,Oa=new Vl;class Wl extends On{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(ro.subVectors(s[0],s[1]).add(s[0]),c=ro);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(ro.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ro),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ia.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,v,m),Ua.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,v,m),Oa.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Ia.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Ua.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Oa.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Ia.calc(l),Ua.calc(l),Oa.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Fh(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function o_(i,t){const e=1-i;return e*e*t}function a_(i,t){return 2*(1-i)*i*t}function l_(i,t){return i*i*t}function ar(i,t,e,n){return o_(i,t)+a_(i,e)+l_(i,n)}function c_(i,t){const e=1-i;return e*e*e*t}function h_(i,t){const e=1-i;return 3*e*e*i*t}function u_(i,t){return 3*(1-i)*i*i*t}function f_(i,t){return i*i*i*t}function lr(i,t,e,n,s){return c_(i,t)+h_(i,e)+u_(i,n)+f_(i,s)}class If extends On{constructor(t=new ft,e=new ft,n=new ft,s=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(lr(t,s.x,r.x,o.x,a.x),lr(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class d_ extends On{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(lr(t,s.x,r.x,o.x,a.x),lr(t,s.y,r.y,o.y,a.y),lr(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Uf extends On{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class p_ extends On{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Of extends On{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ar(t,s.x,r.x,o.x),ar(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class m_ extends On{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ar(t,s.x,r.x,o.x),ar(t,s.y,r.y,o.y),ar(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nf extends On{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Fh(a,l.x,c.x,h.x,u.x),Fh(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ft().fromArray(s))}return this}}var Bh=Object.freeze({__proto__:null,ArcCurve:r_,CatmullRomCurve3:Wl,CubicBezierCurve:If,CubicBezierCurve3:d_,EllipseCurve:Hl,LineCurve:Uf,LineCurve3:p_,QuadraticBezierCurve:Of,QuadraticBezierCurve3:m_,SplineCurve:Nf});class g_ extends On{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Bh[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Bh[s.type]().fromJSON(s))}return this}}class v_ extends g_{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Uf(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Of(this.currentPoint.clone(),new ft(t,e),new ft(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new If(this.currentPoint.clone(),new ft(t,e),new ft(n,s),new ft(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Nf(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new Hl(t,e,n,s,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Gl extends de{constructor(t=[new ft(0,-.5),new ft(.5,0),new ft(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=De(s,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],h=1/e,u=new C,d=new ft,f=new C,g=new C,v=new C;let m=0,p=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,f.x=p*1,f.y=-m,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(v.x,v.y,v.z);break;default:m=t[_+1].x-t[_].x,p=t[_+1].y-t[_].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(g)}for(let _=0;_<=e;_++){const x=n+_*h*s,y=Math.sin(x),R=Math.cos(x);for(let S=0;S<=t.length-1;S++){u.x=t[S].x*y,u.y=t[S].y,u.z=t[S].x*R,o.push(u.x,u.y,u.z),d.x=_/e,d.y=S/(t.length-1),a.push(d.x,d.y);const E=l[3*S+0]*y,O=l[3*S+1],b=l[3*S+0]*R;c.push(E,O,b)}}for(let _=0;_<e;_++)for(let x=0;x<t.length-1;x++){const y=x+_*t.length,R=y,S=y+t.length,E=y+t.length+1,O=y+1;r.push(R,S,O),r.push(E,O,S)}this.setIndex(r),this.setAttribute("position",new ie(o,3)),this.setAttribute("uv",new ie(a,2)),this.setAttribute("normal",new ie(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gl(t.points,t.segments,t.phiStart,t.phiLength)}}class $l extends Gl{constructor(t=1,e=1,n=4,s=8){const r=new v_;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new $l(t.radius,t.length,t.capSegments,t.radialSegments)}}class Vi extends de{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new C,h=new ft;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(a,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vi(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Qe extends de{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;_(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new ie(u,3)),this.setAttribute("normal",new ie(d,3)),this.setAttribute("uv",new ie(f,2));function _(){const y=new C,R=new C;let S=0;const E=(e-t)/n;for(let O=0;O<=r;O++){const b=[],w=O/r,k=w*(e-t)+t;for(let $=0;$<=s;$++){const et=$/s,I=et*l+a,F=Math.sin(I),X=Math.cos(I);R.x=k*F,R.y=-w*n+m,R.z=k*X,u.push(R.x,R.y,R.z),y.set(F,E,X).normalize(),d.push(y.x,y.y,y.z),f.push(et,1-w),b.push(g++)}v.push(b)}for(let O=0;O<s;O++)for(let b=0;b<r;b++){const w=v[b][O],k=v[b+1][O],$=v[b+1][O+1],et=v[b][O+1];h.push(w,k,et),h.push(k,$,et),S+=6}c.addGroup(p,S,0),p+=S}function x(y){const R=g,S=new ft,E=new C;let O=0;const b=y===!0?t:e,w=y===!0?1:-1;for(let $=1;$<=s;$++)u.push(0,m*w,0),d.push(0,w,0),f.push(.5,.5),g++;const k=g;for(let $=0;$<=s;$++){const I=$/s*l+a,F=Math.cos(I),X=Math.sin(I);E.x=b*X,E.y=m*w,E.z=b*F,u.push(E.x,E.y,E.z),d.push(0,w,0),S.x=F*.5+.5,S.y=X*.5*w+.5,f.push(S.x,S.y),g++}for(let $=0;$<s;$++){const et=R+$,I=k+$;y===!0?h.push(I,I+1,et):h.push(I+1,I,et),O+=3}c.addGroup(p,O,y===!0?1:2),p+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qe(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Dn extends Qe{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Dn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Er extends de{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new ie(r,3)),this.setAttribute("normal",new ie(r.slice(),3)),this.setAttribute("uv",new ie(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const x=new C,y=new C,R=new C;for(let S=0;S<e.length;S+=3)f(e[S+0],x),f(e[S+1],y),f(e[S+2],R),l(x,y,R,_)}function l(_,x,y,R){const S=R+1,E=[];for(let O=0;O<=S;O++){E[O]=[];const b=_.clone().lerp(y,O/S),w=x.clone().lerp(y,O/S),k=S-O;for(let $=0;$<=k;$++)$===0&&O===S?E[O][$]=b:E[O][$]=b.clone().lerp(w,$/k)}for(let O=0;O<S;O++)for(let b=0;b<2*(S-O)-1;b++){const w=Math.floor(b/2);b%2===0?(d(E[O][w+1]),d(E[O+1][w]),d(E[O][w])):(d(E[O][w+1]),d(E[O+1][w+1]),d(E[O+1][w]))}}function c(_){const x=new C;for(let y=0;y<r.length;y+=3)x.x=r[y+0],x.y=r[y+1],x.z=r[y+2],x.normalize().multiplyScalar(_),r[y+0]=x.x,r[y+1]=x.y,r[y+2]=x.z}function h(){const _=new C;for(let x=0;x<r.length;x+=3){_.x=r[x+0],_.y=r[x+1],_.z=r[x+2];const y=m(_)/2/Math.PI+.5,R=p(_)/Math.PI+.5;o.push(y,1-R)}g(),u()}function u(){for(let _=0;_<o.length;_+=6){const x=o[_+0],y=o[_+2],R=o[_+4],S=Math.max(x,y,R),E=Math.min(x,y,R);S>.9&&E<.1&&(x<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),R<.2&&(o[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function f(_,x){const y=_*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function g(){const _=new C,x=new C,y=new C,R=new C,S=new ft,E=new ft,O=new ft;for(let b=0,w=0;b<r.length;b+=9,w+=6){_.set(r[b+0],r[b+1],r[b+2]),x.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),S.set(o[w+0],o[w+1]),E.set(o[w+2],o[w+3]),O.set(o[w+4],o[w+5]),R.copy(_).add(x).add(y).divideScalar(3);const k=m(R);v(S,w+0,_,k),v(E,w+2,x,k),v(O,w+4,y,k)}}function v(_,x,y,R){R<0&&_.x===1&&(o[x]=_.x-1),y.x===0&&y.z===0&&(o[x]=R/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Er(t.vertices,t.indices,t.radius,t.details)}}class Po extends Er{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Po(t.radius,t.detail)}}class In extends Er{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new In(t.radius,t.detail)}}class Bo extends Er{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Bo(t.radius,t.detail)}}class Wi extends de{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],l=[],c=[],h=[];let u=t;const d=(e-t)/s,f=new C,g=new ft;for(let v=0;v<=s;v++){for(let m=0;m<=n;m++){const p=r+m/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(n+1);for(let p=0;p<n;p++){const _=p+m,x=_,y=_+n+1,R=_+n+2,S=_+1;a.push(x,y,S),a.push(y,R,S)}}this.setIndex(a),this.setAttribute("position",new ie(l,3)),this.setAttribute("normal",new ie(c,3)),this.setAttribute("uv",new ie(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wi(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class ln extends de{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new C,d=new C,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const _=[],x=p/n;let y=0;p===0&&o===0?y=.5/e:p===n&&l===Math.PI&&(y=-.5/e);for(let R=0;R<=e;R++){const S=R/e;u.x=-t*Math.cos(s+S*r)*Math.sin(o+x*a),u.y=t*Math.cos(o+x*a),u.z=t*Math.sin(s+S*r)*Math.sin(o+x*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(S+y,1-x),_.push(c++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<e;_++){const x=h[p][_+1],y=h[p][_],R=h[p+1][_],S=h[p+1][_+1];(p!==0||o>0)&&f.push(x,y,S),(p!==n-1||l<Math.PI)&&f.push(y,R,S)}this.setIndex(f),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(v,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ln(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Sn extends de{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const v=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const v=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,_=(s+1)*f+g;o.push(v,m,_),o.push(m,p,_)}this.setIndex(o),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Sn(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Mn extends Xi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ul,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class x_ extends Xi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ul,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class __ extends Fo{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class jl extends Ie{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class y_ extends jl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ie.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Na=new re,Hh=new C,Vh=new C;class zf{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zl,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Hh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Hh),Vh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Vh),e.updateMatrixWorld(),Na.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Na),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Na)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Wh=new re,Qs=new C,za=new C;class b_ extends zf{constructor(){super(new on(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ft(4,2),this._viewportCount=6,this._viewports=[new ce(2,1,1,1),new ce(0,1,1,1),new ce(3,1,1,1),new ce(1,1,1,1),new ce(3,0,1,1),new ce(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Qs.setFromMatrixPosition(t.matrixWorld),n.position.copy(Qs),za.copy(n.position),za.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(za),n.updateMatrixWorld(),s.makeTranslation(-Qs.x,-Qs.y,-Qs.z),Wh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wh)}}class M_ extends jl{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new b_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class S_ extends zf{constructor(){super(new wf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Gh extends jl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ie.DEFAULT_UP),this.updateMatrix(),this.target=new Ie,this.shadow=new S_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class w_{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=$h(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=$h();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function $h(){return(typeof performance>"u"?Date:performance).now()}class E_{constructor(t,e,n=0,s=1/0){this.ray=new zo(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Nl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return pl(t,this,n,e),n.sort(jh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)pl(t[s],this,n,e);return n.sort(jh),n}}function jh(i,t){return i.distance-t.distance}function pl(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let r=0,o=s.length;r<o;r++)pl(s[r],t,e,!0)}}class Xh{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(De(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ll}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ll);function T_(i){return{a:i>>>0,n:0,h:0,locked:!1}}function cr(i){if(i.locked)throw new Error("a dice draw while the rng is locked (a preview or legality check must never roll)");let t=i.a|0;t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);e=e+Math.imul(e^e>>>7,61|e)^e;const n=((e^e>>>14)>>>0)/4294967296;return i.a=t,i.n++,i.h=Math.imul(i.h,31)+Math.floor(n*4294967296)>>>0,n}const Ho=i=>`${i.n}#${i.h.toString(36)}`;function kf(i){i.locked=!0}function Ff(i){i.locked=!1}const Qn=Object.freeze({W:40,H:28,deploy:8}),di=1,Tr=12,Vo=3,Bf=5,Ar=6,Ds=Object.freeze([{key:"move",name:"Movement"},{key:"shoot",name:"Shooting"},{key:"charge",name:"Charge"},{key:"fight",name:"Fight"},{key:"morale",name:"Morale"}].map(Object.freeze)),Xl=i=>1+Math.floor(cr(i.rng)*6),He=(i,t)=>Array.from({length:t},()=>Xl(i)),Yn=(i,t)=>i.filter(e=>e>=t).length,A_=(i,t,e)=>i<t?t:i>e?e:i,_o=i=>i>6?0:i<=1?1:(7-i)/6;function Gi(i){let t=0;for(let e=1;e<=6;e++)for(let n=1;n<=6;n++)e+n>=i&&t++;return t/36}function Rr(i,t,e){let n;return i>=2*t?n=2:i>t?n=3:i===t?n=4:2*i<=t?n=6:n=5,e?Math.min(n,e):n}function Cr(i,t,e){return Math.max(2,i+t-(e?1:0))}const xr=(i,t)=>A_(i+t,2,6);function Is(i,t,e){const n=i.alive;return e?n*i.t.A:t.blast?Math.min(t.shots,n):n*t.shots}function Lo(i,t,e,n,s){const r=n.t,o=_o(t),a=_o(Rr(e.S,r.T,e.poison)),l=1-_o(Cr(r.Sv,e.AP,s)),c=i*o*a*l,h=Math.min(e.D,r.W)/r.W,u=Math.min(n.alive,c*h);return{wounds:c,kills:u,value:u*r.pts}}function Hf(i){let t=i>>>0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const pn=(i,t,e)=>i+(t-i)*e,je=(i,t)=>i[Math.floor(t()*i.length)],ne=(i,t,e)=>t+i()*(e-t);function mn(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))mn(t)}return i}function Pr(i,t=0){let e=3735928559^t,n=1103547991^t;for(let s=0;s<i.length;s++){const r=i.charCodeAt(s);e=Math.imul(e^r,2654435761),n=Math.imul(n^r,1597334677)}return e=Math.imul(e^e>>>16,2246822507),e^=Math.imul(n^n>>>13,3266489909),n=Math.imul(n^n>>>16,2246822507),n^=Math.imul(e^e>>>13,3266489909),4294967296*(2097151&n)+(e>>>0)}function Us(i){var t;if(i===null||typeof i=="boolean"||typeof i=="string")return JSON.stringify(i);if(typeof i=="number"){if(!Number.isFinite(i))throw new Error(`canonicalJSON: ${i} is not a finite number`);return JSON.stringify(i)}if(Array.isArray(i))return`[${i.map(e=>{if(e===void 0)throw new Error("canonicalJSON: undefined in an array");return Us(e)}).join(",")}]`;if(typeof i=="object"&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null))return`{${Object.keys(i).filter(n=>i[n]!==void 0).sort().map(n=>`${JSON.stringify(n)}:${Us(i[n])}`).join(",")}}`;throw new Error(`canonicalJSON: can't encode ${typeof i=="object"?((t=i.constructor)==null?void 0:t.name)??"object":typeof i}`)}const qh={name:"Twig knives",S:3,AP:0,D:1},R_={key:"squirrel",name:"Bushtail Clans",short:"Bushtails",icon:"🐿️",look:{team:"#ec8a34",dark:"#7a3d12",alt:"#c75ad6",gore:["#cf6d2a","#f1dcb5"],voice:"squeak",models:"squirrel",anim:"squirrel"},army:["elder","oakguard","nutkin","nutkin","grenadier","glider","trebuchet"],units:{nutkin:{name:"Nutkin Skirmishers",short:"Nutkin",role:"Troops",ai:"shooter",models:6,base:.3,pts:7,stats:"M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2",ranged:{name:"Slingshots",range:18,shots:2,S:3,AP:0,D:1,assault:!0,fx:"acorn"},melee:qh,abilities:["Scurry — may shoot after Advancing."]},grenadier:{name:"Acorn Grenadiers",short:"Grenadiers",role:"Troops",ai:"shooter",models:5,base:.3,pts:11,stats:"M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Blasting acorns",range:12,shots:2,blast:1.6,S:4,AP:1,D:1,scenery:1,fx:"bomb"},melee:qh,abilities:['Blast — lobs 2 templates; a miss scatters D6+1".']},oakguard:{name:"Oak Guard",short:"Oak Guard",role:"Elite",ai:"melee",models:5,base:.34,pts:22,stats:"M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1",ranged:null,melee:{name:"Pinecone halberds",S:5,AP:2,D:1},abilities:["Bark shields — the clan’s anvil. No guns, all heart."]},glider:{name:"Glider Wing",short:"Gliders",role:"Fast",ai:"raider",models:4,base:.32,pts:15,fly:!0,stats:"M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1",ranged:{name:"Thorn darts",range:10,shots:2,S:3,AP:1,D:1,assault:!0,fx:"dart"},melee:{name:"Hooked claws",S:4,AP:1,D:1},abilities:["Fly — moves over scenery and enemy units.","Swoop — may shoot after Advancing."]},trebuchet:{name:"Pinecone Trebuchet",short:"Trebuchet",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:95,big:!0,stats:"M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0",ranged:{name:"Flaming pinecone",range:36,shots:1,blast:3,S:6,AP:1,D:2,indirect:!0,heavy:!0,scenery:3,fx:"pinecone"},melee:{name:"Crew mallets",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving."]},elder:{name:"Elder Chitterwick",short:"Elder",role:"Hero",ai:"hero",models:1,base:.42,pts:80,hero:!0,stats:"M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Thornburst",spell:6,range:18,shots:1,blast:2.4,S:5,AP:2,D:1,scenery:2,fx:"thorns"},melee:{name:"Rootwood staff",S:5,AP:1,D:2},abilities:["Spell — cast on 2D6 ≥ 6: thorns erupt under the target, no scatter.",`Grey whiskers — friends within ${Ar}" use his Ld 9.`]}}},C_={key:"serpent",name:"Coil of Ssithra",short:"Serpents",icon:"🐍",look:{team:"#46c27a",dark:"#14532d",alt:"#4aa8e8",gore:["#3f8f4a","#d9cf86"],voice:"hiss",models:"serpent",anim:"serpent"},army:["hierophant","brute","scaleguard","scaleguard","spitter","sidewinder","engine"],units:{scaleguard:{name:"Scaleguard",short:"Scaleguard",role:"Troops",ai:"line",models:6,base:.32,pts:10,stats:"M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2",ranged:{name:"Javelins",range:8,shots:1,S:4,AP:0,D:1,fx:"javelin"},melee:{name:"Serpent spears",S:4,AP:1,D:1},abilities:["Shield wall — the Coil’s steady line."]},spitter:{name:"Venom Spitters",short:"Spitters",role:"Troops",ai:"shooter",models:5,base:.32,pts:12,stats:"M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1",ranged:{name:"Venom spit",range:12,shots:2,S:2,AP:1,D:1,poison:4,fx:"spit"},melee:{name:"Fangs",S:3,AP:0,D:1,poison:4},abilities:["Poison 4+ — always wounds on a 4+, however tough the target."]},sidewinder:{name:"Sidewinder Stalkers",short:"Sidewinders",role:"Fast",ai:"melee",models:4,base:.34,pts:24,chargeAfterAdvance:!0,stats:"M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1",ranged:null,melee:{name:"Twin sickles",S:4,AP:1,D:1},abilities:["Sidewind — may charge after Advancing."]},brute:{name:"Constrictor Brute",short:"Brute",role:"Monster",ai:"melee",models:1,base:.95,pts:125,big:!0,wrecker:!0,stats:"M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4",ranged:null,melee:{name:"Crushing coils",S:7,AP:2,D:2},abilities:["Wrecker — moves straight through walls, trees and crates, smashing them flat (rocks still stop it)."]},engine:{name:"Basilisk Venom Engine",short:"Venom Engine",role:"Artillery",ai:"artillery",models:1,base:1.05,pts:100,big:!0,stats:"M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0",ranged:{name:"Acid globe",range:30,shots:1,blast:2.6,S:5,AP:2,D:2,poison:3,indirect:!0,heavy:!0,scenery:4,corrodes:!0,fx:"acid"},melee:{name:"Crew hooks",S:3,AP:0,D:1},abilities:["Indirect — fires without line of sight at −1 to hit.","Heavy — −1 to hit after moving.","Acid — Poison 3+, and it eats stone."]},hierophant:{name:"Hierophant Ssithra",short:"Hierophant",role:"Hero",ai:"hero",models:1,base:.45,pts:85,hero:!0,stats:"M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1",ranged:{name:"Mesmerize",spell:7,range:18,mesmerize:!0,fx:"gaze"},melee:{name:"Fang staff",S:5,AP:2,D:2,poison:3},abilities:["Spell — cast on 2D6 ≥ 7: the target suffers D3 mortal wounds and is Mesmerized — it can’t shoot or charge next turn and hits at −1 in melee.",`Coiled will — friends within ${Ar}" use her Ld 9.`]}}},Yh=Object.freeze(["M","WS","BS","S","T","W","A","Ld","Sv","OC"]),Kh=Object.freeze(["Troops","Elite","Fast","Hero","Monster","Artillery"]),Jh=Object.freeze(["melee","raider","line","shooter","hero","artillery"]),Vf=Object.freeze(["fly","big","hero","wrecker","burrow","chargeAfterAdvance","noCharge","brawler"]),P_=new Set(["name","short","role","ai","models","base","pts","stats","ranged","melee","abilities",...Vf,"move","deployRow","eye","chest","swarm","swoop"]),Wf=["range","shots","S","AP","D","blast","scenery","poison","spell"],Gf=["assault","heavy","indirect","corrodes","mesmerize"],L_=new Set(["name","fx",...Wf,...Gf]),Zh=["walk","fly","wreck","burrow"],Qh=["front","mid","back"],tu=/^#[0-9a-f]{6}$/i,eu=/^[a-z][a-z0-9-]*$/;function D_(i){const t={};for(const n of String(i).trim().split(/\s+/)){const s=/^([A-Za-z]+)(\d+)$/.exec(n);if(!s||!Yh.includes(s[1]))throw new Error(`bad stat "${n}" in "${i}"`);if(s[1]in t)throw new Error(`${s[1]} given twice in "${i}"`);t[s[1]]=Number(s[2])}const e=Yh.filter(n=>!(n in t));if(e.length)throw new Error(`"${i}" lacks ${e.join(", ")}`);return t}function nu(i,t,e){const n=r=>new Error(`${t}: ${r}`);if(!i||typeof i!="object")throw n("must be a weapon object");for(const r of Object.keys(i))if(!L_.has(r))throw n(`unknown field "${r}"`);if(typeof i.name!="string"||!i.name)throw n("needs a name");if(i.fx!==void 0&&typeof i.fx!="string")throw n("fx is a string");for(const r of Wf)if(i[r]!==void 0&&!(Number.isFinite(i[r])&&i[r]>=0))throw n(`${r} must be a number ≥ 0`);for(const r of Gf)if(i[r]!==void 0&&typeof i[r]!="boolean")throw n(`${r} must be true or false`);for(const r of["shots","S","AP","D","scenery","poison","spell"])if(i[r]!==void 0&&!Number.isInteger(i[r]))throw n(`${r} must be a whole number`);const s=["S","AP","D"];if(e){for(const r of s)if(i[r]===void 0)throw n(`a melee weapon needs ${r}`);for(const r of["range","shots","blast","spell","mesmerize","indirect","heavy","assault"])if(i[r]!==void 0)throw n(`a melee weapon has no ${r}`)}else{if(i.range===void 0)throw n("a ranged weapon needs a range");if(!i.mesmerize){for(const r of["shots",...s])if(i[r]===void 0)throw n(`a ranged weapon needs ${r}`)}if(i.mesmerize&&!i.spell)throw n("mesmerize is a spell: give it a cast value")}return{...i}}function I_(i,t,e){var v,m;const n=`race ${i}, unit ${t}`,s=p=>new Error(`${n}: ${p}`);if(!e||typeof e!="object")throw s("must be an object");for(const p of Object.keys(e))if(!P_.has(p))throw s(`unknown field "${p}"`);for(const p of["name","short"])if(typeof e[p]!="string"||!e[p])throw s(`needs a ${p}`);if(!Kh.includes(e.role))throw s(`role must be one of ${Kh.join(", ")}`);if(!Jh.includes(e.ai))throw s(`ai must be one of ${Jh.join(", ")}`);if(!Number.isInteger(e.models)||e.models<1)throw s("models must be a whole number ≥ 1");if(!(Number.isFinite(e.base)&&e.base>0))throw s("base must be a radius > 0");if(!Number.isInteger(e.pts)||e.pts<0)throw s("pts must be a whole number ≥ 0");if(!Array.isArray(e.abilities)||e.abilities.some(p=>typeof p!="string"))throw s("abilities is a list of card text");for(const p of Vf)if(e[p]!==void 0&&typeof e[p]!="boolean")throw s(`${p} must be true or false`);if(e.move!==void 0&&!Zh.includes(e.move))throw s(`move must be one of ${Zh.join(", ")}`);if(e.deployRow!==void 0&&!Qh.includes(e.deployRow))throw s(`deployRow must be one of ${Qh.join(", ")}`);for(const p of["eye","chest"])if(e[p]!==void 0&&!(Number.isFinite(e[p])&&e[p]>0))throw s(`${p} must be a height > 0`);if(e.swarm!==void 0&&!Number.isInteger((v=e.swarm)==null?void 0:v.min))throw s("swarm is { min }");if(e.swoop!==void 0&&!Number.isInteger((m=e.swoop)==null?void 0:m.chargeS))throw s("swoop is { chargeS }");let r;try{r=D_(e.stats)}catch(p){throw s(p.message)}const o=e.ranged===null?null:nu(e.ranged,`${n}, ranged`,!1),a=nu(e.melee,`${n}, melee`,!0),l=(p,_)=>e[p]===void 0?_:e[p],c=l("fly",!1),h=l("big",!1),u=l("wrecker",!1),d=l("burrow",!1),f=l("hero",e.role==="Hero"),g={key:t,race:i,name:e.name,short:e.short,role:e.role,ai:e.ai,models:e.models,base:e.base,pts:e.pts,...r,ranged:o,melee:a,abilities:[...e.abilities],fly:c,big:h,hero:f,wrecker:u,burrow:d,chargeAfterAdvance:l("chargeAfterAdvance",!1),noCharge:l("noCharge",e.role==="Artillery"),brawler:l("brawler",!o||u),move:e.move??(c?"fly":u?"wreck":d?"burrow":"walk"),deployRow:e.deployRow??(e.role==="Artillery"?"back":f?"mid":"front"),eye:e.eye??(h?1.9:c?1.5:.95),chest:e.chest??(h||c?1:.55)};return e.swarm&&(g.swarm={min:e.swarm.min}),e.swoop&&(g.swoop={chargeS:e.swoop.chargeS}),g}function U_(i){if(!i||typeof i!="object")throw new Error("defineRace needs a race object");const{key:t}=i;if(typeof t!="string"||!eu.test(t))throw new Error(`race key "${t}" must be lower-case letters, digits and dashes`);const e=r=>new Error(`race ${t}: ${r}`);for(const r of Object.keys(i))if(!["key","name","short","icon","look","army","units"].includes(r))throw e(`unknown field "${r}"`);for(const r of["name","short","icon"])if(typeof i[r]!="string"||!i[r])throw e(`needs a ${r}`);const n=i.look;if(!n||typeof n!="object")throw e("needs a look");for(const r of["team","dark","alt"])if(!tu.test(n[r]??""))throw e(`look.${r} must be a #rrggbb colour`);if(!Array.isArray(n.gore)||n.gore.length!==2||!n.gore.every(r=>tu.test(r)))throw e("look.gore is two #rrggbb colours");for(const r of["voice","models","anim"])if(typeof n[r]!="string"||!n[r])throw e(`look.${r} must be named`);if(!i.units||typeof i.units!="object"||!Object.keys(i.units).length)throw e("needs units");const s=Object.create(null);for(const[r,o]of Object.entries(i.units)){if(!eu.test(r))throw e(`unit key "${r}" must be lower-case letters, digits and dashes`);s[r]=I_(t,r,o)}if(!Array.isArray(i.army)||!i.army.length)throw e("needs an army list");for(const r of i.army)if(!s[r])throw e(`army lists "${r}", which is not one of its units`);return mn({key:t,name:i.name,short:i.short,icon:i.icon,look:{...n,gore:[...n.gore]},army:[...i.army],units:s})}function O_(i){const t=i.map(s=>U_(s)),e=t.map(s=>s.key),n=e.find((s,r)=>e.indexOf(s)!==r);if(n!==void 0)throw new Error(`two races use the key "${n}"`);return mn(Object.assign(Object.create(null),Object.fromEntries(t.map(s=>[s.key,s]))))}const An=O_([R_,C_]),Os=mn(Object.assign(Object.create(null),{classic:{objectives:[{x:0,z:0},{x:-9,z:8},{x:9,z:-8},{x:-9,z:-8},{x:9,z:8}],rounds:Bf,deploy:Qn.deploy}})),iu=Object.freeze(["squirrel","serpent"]);function Wt(i,t){const e=Math.abs(i),n=Math.abs(t);if(e===1/0||n===1/0)return 1/0;const s=Math.max(e,n);return s!==s?NaN:s===0?0:Math.sqrt(e/s*(e/s)+n/s*(n/s))*s}function N_(i,t,e){const n=Math.abs(i),s=Math.abs(t),r=Math.abs(e);if(n===1/0||s===1/0||r===1/0)return 1/0;const o=Math.max(Math.max(n,s),r);if(o!==o)return NaN;if(o===0)return 0;const a=n/o*(n/o),l=s/o*(s/o),c=a+l-a-l,h=r/o*(r/o)-c;return Math.sqrt(a+l+h)*o}const ki=new DataView(new ArrayBuffer(8)),Rn=i=>(ki.setFloat64(0,i),ki.getInt32(0)),ml=i=>(ki.setFloat64(0,i),ki.getUint32(4)),Ct=(i,t)=>(ki.setUint32(0,i>>>0),ki.setUint32(4,t>>>0),ki.getFloat64(0));function oo(i,t){for(;t>1023;)i*=Ct(2145386496,0),t-=1023;for(;t<-1022;)i*=Ct(1048576,0),t+=1022;return i*Ct(t+1023<<20,0)}const su=Object.freeze([10680707,7228996,1387004,2578385,16069853,12639074,9804092,4427841,16666979,11263675,12935607,2387514,4345298,14681673,3074569,13734428,16653803,1880361,10960616,8533493,3062596,8710556,7349940,6258241,3772886,3769171,3798172,8675211,12450088,3874808,9961438,366607,15675153,9132554,7151469,3571407,2607881,12013382,4155038,6285869,7677882,13102053,15825725,473591,9065106,15363067,6271263,9264392,5636912,4652155,7056368,13614112,10155062,1944035,9527646,15080200,6658437,6231200,6832269,16767104,5075751,3212806,1398474,7579849,6349435,12618859]),z_=Object.freeze([1073291771,1074340347,1074977148,1075388923,1075800698,1076025724,1076231611,1076437499,1076643386,1076849274,1076971356,1077074300,1077177244,1077280187,1077383131,1077486075,1077589019,1077691962,1077794906,1077897850,1077968460,1078019932,1078071404,1078122876,1078174348,1078225820,1078277292,1078328763,1078380235,1078431707,1078483179,1078534651]),k_=Object.freeze([Ct(1073291771,1073741824),Ct(1047807021,0),Ct(1022903960,2147483648),Ct(997772369,1610612736),Ct(972036995,2147483648),Ct(947528992,1073741824),Ct(920879650,2147483648),Ct(896135965,0)]),yo=Ct(1097859072,0),ka=Ct(1047527424,0),F_=Ct(1071931184,1841940611),ru=Ct(1073291771,1413480448),Fa=Ct(1037087841,442655537),ou=Ct(1037087841,442499072),Ba=Ct(1000544650,771977331),B_=Ct(1000544650,771751936),H_=Ct(964395930,622873025);function V_(i,t,e,n){const o=new Array(20).fill(0),a=new Array(20).fill(0),l=new Array(20).fill(0),c=new Array(20).fill(0),h=n-1,u=Math.max(0,Math.trunc((e-3)/24));let d=e-24*(u+1);for(let _=0,x=u-h;_<=h+4;_++,x++)o[_]=x<0?0:su[x];for(let _=0;_<=4;_++){let x=0;for(let y=0;y<=h;y++)x+=i[y]*o[h+_-y];a[_]=x}let f=4,g,v,m,p;for(;;){g=a[f];for(let y=0,R=f;R>0;y++,R--)p=Math.trunc(ka*g),c[y]=Math.trunc(g-yo*p),g=a[R-1]+p;if(g=oo(g,d),g-=8*Math.floor(g*.125),v=Math.trunc(g),g-=v,m=0,d>0){const y=c[f-1]>>24-d;v+=y,c[f-1]-=y<<24-d,m=c[f-1]>>23-d}else d===0?m=c[f-1]>>23:g>=.5&&(m=2);if(m>0){v+=1;let y=0;for(let R=0;R<f;R++){const S=c[R];y===0?S!==0&&(y=1,c[R]=16777216-S):c[R]=16777215-S}d===1?c[f-1]&=8388607:d===2&&(c[f-1]&=4194303),m===2&&(g=1-g,y!==0&&(g-=oo(1,d)))}if(g!==0)break;let _=0;for(let y=f-1;y>=4;y--)_|=c[y];if(_!==0)break;let x=1;for(;4>=x&&c[4-x]===0;)x++;for(let y=f+1;y<=f+x;y++){o[h+y]=su[u+y];let R=0;for(let S=0;S<=h;S++)R+=i[S]*o[h+y-S];a[y]=R}f+=x}if(g===0)for(f-=1,d-=24;c[f]===0;)f--,d-=24;else g=oo(g,-d),g>=yo?(p=Math.trunc(ka*g),c[f]=Math.trunc(g-yo*p),f+=1,d+=24,c[f]=p):c[f]=Math.trunc(g);p=oo(1,d);for(let _=f;_>=0;_--)a[_]=p*c[_],p*=ka;for(let _=f;_>=0;_--){let x=0;for(let y=0;y<=4&&y<=f-_;y++)x+=k_[y]*a[_+y];l[f-_]=x}p=0;for(let _=f;_>=0;_--)p+=l[_];t[0]=m===0?p:-p,p=l[0]-p;for(let _=1;_<=f;_++)p+=l[_];return t[1]=m===0?p:-p,v&7}function $f(i,t){const e=Rn(i),n=e&2147483647;if(n<=1072243195)return t[0]=i,t[1]=0,0;if(n<1073928572){const c=e>0?1:-1;let h=i-c*ru;return n!==1073291771?(t[0]=h-c*Fa,t[1]=h-t[0]-c*Fa):(h-=c*ou,t[0]=h-c*Ba,t[1]=h-t[0]-c*Ba),c}if(n<=1094263291){let c=Math.abs(i);const h=Math.trunc(c*F_+.5);let u=c-h*ru,d=h*Fa;if(t[0]=u-d,h>=32||n===z_[h-1]){const f=n>>20;f-(Rn(t[0])>>20&2047)>16&&(c=u,d=h*ou,u=c-d,d=h*Ba-(c-u-d),t[0]=u-d,f-(Rn(t[0])>>20&2047)>49&&(c=u,d=h*B_,u=c-d,d=h*H_-(c-u-d),t[0]=u-d))}return t[1]=u-t[0]-d,e<0?(t[0]=-t[0],t[1]=-t[1],-h):h}if(n>=2146435072)return t[0]=t[1]=i-i,0;const s=(n>>20)-1046;let r=Ct(n-(s<<20),ml(i));const o=[0,0,0];for(let c=0;c<2;c++)o[c]=Math.trunc(r),r=(r-o[c])*yo;o[2]=r;let a=3;for(;o[a-1]===0;)a--;const l=V_(o,t,s,a);return e<0?(t[0]=-t[0],t[1]=-t[1],-l):l}const au=Ct(3217380693,1431655753),W_=Ct(1065423121,286324902),G_=Ct(3207201184,432103893),$_=Ct(1053236707,1471282813),j_=Ct(3193628134,2318114027),X_=Ct(1038473530,1523570044);function hr(i,t,e){if((Rn(i)&2147483647)<1044381696&&Math.trunc(i)===0)return i;const n=i*i,s=n*i,r=W_+n*(G_+n*($_+n*(j_+n*X_)));return e===0?i+s*(au+n*r):i-(n*(.5*t-s*r)-t-s*au)}const q_=Ct(1067799893,1431655756),Y_=Ct(3210133868,381768055),K_=Ct(1056571808,432739728),J_=Ct(3197271631,2157728429),Z_=Ct(1042411166,3182735812),Q_=Ct(3181968105,3196598484);function ur(i,t){const e=Rn(i)&2147483647;if(e<1044381696&&Math.trunc(i)===0)return 1;const n=i*i,s=n*(q_+n*(Y_+n*(K_+n*(J_+n*(Z_+n*Q_)))));if(e<1070805811)return 1-(.5*n-(n*s-i*t));const r=e>1072234496?.28125:Ct(e-2097152,0);return 1-r-(.5*n-r-(n*s-i*t))}function Ne(i){const t=Rn(i)&2147483647;if(t<=1072243195)return hr(i,0,0);if(t>=2146435072)return i-i;const e=[0,0];switch($f(i,e)&3){case 0:return hr(e[0],e[1],1);case 1:return ur(e[0],e[1]);case 2:return-hr(e[0],e[1],1);default:return-ur(e[0],e[1])}}function Xe(i){const t=Rn(i)&2147483647;if(t<=1072243195)return ur(i,0);if(t>=2146435072)return i-i;const e=[0,0];switch($f(i,e)&3){case 0:return ur(e[0],e[1]);case 1:return-hr(e[0],e[1],1);case 2:return-ur(e[0],e[1]);default:return hr(e[0],e[1],1)}}const Ha=Object.freeze([Ct(1071492199,90291023),Ct(1072243195,1413754136),Ct(1072657163,3531732635),Ct(1073291771,1413754136)]),Va=Object.freeze([Ct(1014639487,573531618),Ct(1015129638,856972295),Ct(1013974920,2062601149),Ct(1016178214,856972295)]),_n=Object.freeze([Ct(1070945621,1431655693),Ct(3217660313,2576935876),Ct(1069697316,2449507327),Ct(3216798150,4263712369),Ct(1068975565,3310100590),Ct(3216224498,2943654509),Ct(1068567910,2698001745),Ct(3215842861,1390345626),Ct(1068071755,611716587),Ct(3215111236,745172015),Ct(1066446138,3810712081)]);function gl(i){const t=Rn(i),e=t&2147483647;let n;if(e>=1141899264)return i!==i?i+i:t>0?Ha[3]+Va[3]:-Ha[3]-Va[3];if(e<1071382528){if(e<1044381696)return i;n=-1}else i=Math.abs(i),e<1072889856?e<1072037888?(n=0,i=(2*i-1)/(2+i)):(n=1,i=(i-1)/(i+1)):e<1073971200?(n=2,i=(i-1.5)/(1+1.5*i)):(n=3,i=-1/i);const s=i*i,r=s*s,o=s*(_n[0]+r*(_n[2]+r*(_n[4]+r*(_n[6]+r*(_n[8]+r*_n[10]))))),a=r*(_n[1]+r*(_n[3]+r*(_n[5]+r*(_n[7]+r*_n[9]))));if(n<0)return i-i*(o+a);const l=Ha[n]-(i*(o+a)-Va[n]-i);return t<0?-l:l}const ao=Ct(1072243195,1413754136),tr=Ct(1073291771,1413754136),ps=Ct(1074340347,1413754136),Wa=Ct(1017226790,856972295);function Ns(i,t){if(t!==t||i!==i)return t+i;const e=Rn(t),n=ml(t),s=e&2147483647,r=Rn(i),o=ml(i),a=r&2147483647;if(t===1)return gl(i);let l=r>>31&1|e>>30&2;if(!(a|o))return l<2?i:l===2?ps:-ps;if(!(s|n))return r<0?-tr:tr;if(s===2146435072)return a===2146435072?[ao,-ao,3*ao,-3*ao][l]:[0,-0,ps,-ps][l];if(a===2146435072)return r<0?-tr:tr;const c=a-s>>20;let h;switch(c>60?(h=tr+.5*Wa,l&=1):e<0&&c<-60?h=0:h=gl(Math.abs(i/t)),l){case 0:return h;case 1:return-h;case 2:return ps-(h-Wa);default:return h-Wa-ps}}const lu=Math.SQRT2,jf=(i,t,e)=>({nx:Math.round(i/e),nz:Math.round(t/e)});class ty{constructor(t,e,n=.5){this.W=t,this.H=e,this.cell=n;const{nx:s,nz:r}=jf(t,e,n);this.nx=s,this.nz=r;const o=this.N=this.nx*this.nz;this.hard=new Uint8Array(o),this.soft=new Uint8Array(o),this.diff=new Uint8Array(o),this.cover=new Uint8Array(o),this.clearAll=new Float32Array(o),this.clearHard=new Float32Array(o),this.tmp=new Float32Array(o)}x(t){return-this.W/2+(t%this.nx+.5)*this.cell}z(t){return-this.H/2+(Math.floor(t/this.nx)+.5)*this.cell}index(t,e){const n=Math.floor((t+this.W/2)/this.cell),s=Math.floor((e+this.H/2)/this.cell);return n<0||s<0||n>=this.nx||s>=this.nz?-1:s*this.nx+n}rebuild(t){this.hard.fill(0),this.soft.fill(0),this.diff.fill(0),this.cover.fill(0);for(const e of t){if(!e.alive)continue;const n=e.nav||e.shape;e.navKind==="hard"?this.raster(n,.1,this.hard):e.navKind==="soft"?this.raster(n,.1,this.soft):e.navKind==="diff"&&this.raster(n,.15,this.diff),e.cover&&this.raster(e.coverShape||n,.6,this.cover)}this.field(this.hard,null,this.clearHard),this.field(this.hard,this.soft,this.clearAll)}raster(t,e,n){const s=Wt(t.hx,t.hz)+e,r=Xe(t.yaw),o=Ne(t.yaw),a=Math.max(0,Math.floor((t.x-s+this.W/2)/this.cell)),l=Math.min(this.nx-1,Math.floor((t.x+s+this.W/2)/this.cell)),c=Math.max(0,Math.floor((t.z-s+this.H/2)/this.cell)),h=Math.min(this.nz-1,Math.floor((t.z+s+this.H/2)/this.cell));for(let u=c;u<=h;u++)for(let d=a;d<=l;d++){const f=u*this.nx+d,g=this.x(f)-t.x,v=this.z(f)-t.z,m=g*r-v*o,p=g*o+v*r;Math.abs(m)<=t.hx+e&&Math.abs(p)<=t.hz+e&&(n[f]=1)}}field(t,e,n){const{nx:s,nz:r,cell:o}=this,a=1e6,l=o,c=o*lu;for(let h=0;h<this.N;h++)n[h]=t[h]||e&&e[h]?0:a;for(let h=0;h<r;h++)for(let u=0;u<s;u++){const d=h*s+u;let f=n[d];u>0&&(f=Math.min(f,n[d-1]+l)),h>0&&(f=Math.min(f,n[d-s]+l),u>0&&(f=Math.min(f,n[d-s-1]+c)),u<s-1&&(f=Math.min(f,n[d-s+1]+c))),n[d]=f}for(let h=r-1;h>=0;h--)for(let u=s-1;u>=0;u--){const d=h*s+u;let f=n[d];u<s-1&&(f=Math.min(f,n[d+1]+l)),h<r-1&&(f=Math.min(f,n[d+s]+l),u<s-1&&(f=Math.min(f,n[d+s+1]+c)),u>0&&(f=Math.min(f,n[d+s-1]+c))),n[d]=f}for(let h=0;h<this.N;h++){const u=this.x(h),d=this.z(h),f=Math.min(u+this.W/2,this.W/2-u,d+this.H/2,this.H/2-d);n[h]=Math.min(n[h]>0?n[h]-o*.5:0,f)}}clearance(t,e){return e==="wreck"?this.clearHard[t]:this.clearAll[t]}standable(t,e,n,s){return t<0||s&&s[t]?!1:this.clearance(t,n==="wreck"?"wreck":"all")>=e-.06}reach(t,e,{r:n,max:s,mode:r="walk",forbid:o=null}){const a=this.N,l=new Float64Array(a).fill(1/0),c=new Int32Array(a).fill(-1),h=this.index(t,e),u={dist:l,prev:c,start:h,mode:r,sx:t,sz:e};if(h<0)return u;if(r==="fly"){for(let _=0;_<a;_++){const x=Wt(this.x(_)-t,this.z(_)-e);x<=s&&(l[_]=x)}return u}const d=Wt(t-this.x(h),e-this.z(h));l[h]=d;const f=new ny;f.push(h,d);const{nx:g,nz:v,cell:m}=this,p=this.clearance(h,r==="wreck"?"wreck":"all")<n-.06?n*1.5:0;for(;f.size;){const[_,x]=f.pop();if(x>l[_])continue;const y=_%g,R=_/g|0;for(let S=-1;S<=1;S++)for(let E=-1;E<=1;E++){if(!E&&!S)continue;const O=y+E,b=R+S;if(O<0||b<0||O>=g||b>=v)continue;const w=b*g+O;if(o&&o[w])continue;const k=this.clearance(w,r==="wreck"?"wreck":"all");if(k<n-.06&&!(p&&k>.05&&Wt(this.x(w)-t,this.z(w)-e)<p))continue;let $=this.diff[w]?2:1;r==="wreck"&&this.clearAll[w]<n-.06&&($=2);const et=x+(E&&S?lu:1)*m*$;et<=s&&et<l[w]&&(l[w]=et,c[w]=_,f.push(w,et))}}return u}path(t,e,n,s){if(t.mode==="fly")return[{x:t.sx,z:t.sz},{x:this.x(e),z:this.z(e)}];const r=[];for(let c=e;c!==-1&&(r.push(c),c!==t.start);c=t.prev[c]);r.reverse();const o=r.map(c=>({x:this.x(c),z:this.z(c)}));if(o[0]={x:t.sx,z:t.sz},o.length<3)return o;const a=[o[0]];let l=0;for(;l<o.length-1;){let c=l+1;for(let h=o.length-1;h>l+1;h--)if(this.walkable(o[l],o[h],n,t.mode,s)){c=h;break}a.push(o[c]),l=c}return a}walkable(t,e,n,s,r){const o=Wt(e.x-t.x,e.z-t.z),a=Math.ceil(o/(this.cell*.5)),l=this.diff[this.index(t.x,t.z)];for(let c=1;c<a;c++){const h=c/a,u=this.index(t.x+(e.x-t.x)*h,t.z+(e.z-t.z)*h);if(u<0||r&&r[u]||this.clearance(u,s==="wreck"?"wreck":"all")<n-.06||this.diff[u]!==l||s==="wreck"&&this.clearAll[u]<n-.06)return!1}if(r!=null&&r.discs){for(const c of r.discs)if(ey(t,e,c)<c.R)return!1}return!0}}function ey(i,t,e){const n=t.x-i.x,s=t.z-i.z,r=n*n+s*s;let o=r>0?((e.x-i.x)*n+(e.z-i.z)*s)/r:0;return o=o<0?0:o>1?1:o,Wt(i.x+n*o-e.x,i.z+s*o-e.z)}const Xf=i=>{let t=0;for(let e=1;e<i.length;e++)t+=Wt(i[e].x-i[e-1].x,i[e].z-i[e-1].z);return t};class ny{constructor(){this.ids=[],this.keys=[]}get size(){return this.ids.length}push(t,e){const{ids:n,keys:s}=this;let r=n.length;for(n.push(t),s.push(e);r>0;){const o=r-1>>1;if(s[o]<=e)break;n[r]=n[o],s[r]=s[o],r=o}n[r]=t,s[r]=e}pop(){const{ids:t,keys:e}=this,n=[t[0],e[0]],s=t.pop(),r=e.pop();if(t.length){let o=0;const a=t.length;for(;;){let l=2*o+1;if(l>=a||(l+1<a&&e[l+1]<e[l]&&l++,e[l]>=r))break;t[o]=t[l],e[o]=e[l],o=l}t[o]=s,e[o]=r}return n}}function Ei(i,t,e){i&&i.push({t,...e})}function ct(i,t,e={}){Ei(i.out,t,e)}function qf(i,t){var e;i.journal.trace.push(t),(e=i.onTrace)==null||e.call(i,t,i)}function Wo(i,t){const e=i.units.map(n=>`${n.id}:${n.pos.x.toFixed(3)},${n.pos.z.toFixed(3)},${n.models.map(s=>s.w).join("/")}`).join(" ");qf(i,`${t} ${e} chunks:${i.terrain.chunks.filter(n=>n.alive).length} vp:${i.turn.vp.join("-")} rng:${Ho(i.rng)}`)}function iy(i,t,e){qf(i,`log ${t} ${e.replace(/<[^>]+>/g,"")} rng:${Ho(i.rng)}`)}function ye(i,t,e,n=""){iy(i,t,e),ct(i,"log",{side:t,html:e,cls:n,traced:!0,at:i.journal.trace.length}),Yf(i)}function Yf(i){for(const[t,e,n]of i.journal.pendingLog.splice(0))ct(i,"log",{side:t,html:e,cls:n,traced:!1,at:i.journal.trace.length})}const Kf=mn({stone:{colors:["#8f8b82","#9c978d","#7f7b73","#a7a296","#878378"],bw:1,by:.72,bt:.62,hp:3,look:"box"},sand:{colors:["#c9a66b","#d6b67e","#b9935b","#ddc28e","#c29a60"],bw:1,by:.72,bt:.66,hp:2,look:"box"},log:{colors:["#7a5232","#6b4528","#86603c","#5f3e24"],bw:1,by:.56,bt:.56,hp:2,look:"log"}}),sy=mn({oak:["#4f8a34","#5f9a3c","#447a2c","#6aa646"],autumn:["#d08a2c","#c4622a","#e0a93a","#b8481f"],pine:["#2f6a3c","#3a7a46","#285c34"]}),ry=mn(["#7a5232","#5f3e24","#9a7048","#b08a5a"]),oy=Object.freeze(["#6b4a2e","#5a3d24","#7a5638"]),ay=Object.freeze(["#3f7a34","#4a8a3a","#386c2e"]),ly=Object.freeze(["#4f8f3e","#5c9a46","#3f7a34"]),cy=Object.freeze(["#3f7a34","#5c9a46","#2f5f28"]),hy=Object.freeze(["#7d7a74","#8c8880","#6e6b66","#96918a"]),uy=Object.freeze(["#9a7048","#8a6038","#a77d50"]),fy=Object.freeze(["#8a5a34","#7a4c2a"]),dy=Object.freeze(["#c0392b","#d35a1f","#8e44ad","#b03050"]),cu=22;function fr(i,t,e,n){const s=Hf(n),r=Xe(e.yaw),o=Ne(e.yaw),a={p:(l,c)=>({x:e.x+r*l+o*c,z:e.z-o*l+r*c}),yaw:(l=0)=>e.yaw+l};bo[t](i,a,s)}function _r(i,t,e,n,s,r,o,a,{holes:l=[],cap:c=!1,bw:h,bt:u}={}){const d=Kf[a],f=h??d.bw,g=u??d.bt,v=t.p(n,s),m=t.yaw(r),p={blocks:[],x:v.x,z:v.z,yaw:m,style:a,by:d.by,rubble:null,w:f,t:g};for(let _=0;_<o;_++){if(l.includes(_))continue;const x=je(d.colors,e),y=m+(e()-.5)*.06,R=d.look==="log"?[f*1.02,d.by,g]:[f*(.95+e()*.04),d.by*.96,g*(.9+e()*.1)],S=i.add({kind:"block",hp:d.hp,shape:{x:v.x,y:d.by*(_+.5),z:v.z,hx:f/2,hy:d.by/2,hz:g/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:_,look:{piece:d.look,color:x,chip:x,scale:R,yaw:y}});p.blocks.push(S)}if(c&&o>0){const _=je(d.colors,e),x=d.by*o+f*.55,y=i.add({kind:"block",hp:d.hp,shape:{x:v.x,y:x,z:v.z,hx:f/2,hy:f*.55,hz:f/2,yaw:m},navKind:"soft",los:"block",cover:!0,col:p,level:o,look:{piece:"cap",color:_,chip:_,r:f*.72,h:f*1.1,yaw:m}});p.blocks.push(y)}return p}function py(i,t,e,n,s,r){const o=t.p(n,s),a=ne(e,1.5,2.4),l=ne(e,.17,.26),c=je(oy,e),h=sy[r],u=[];let d;if(r==="pine"){for(let g=0;g<3;g++){const v=1.05-g*.26,m=1.3-g*.15;u.push({cone:!0,r:v,h:m,color:je(h,e),y:a*.45+g*.75+m/2,yaw:e()*3})}d=a*.45+2.5}else{const g=3+Math.floor(e()*3);for(let v=0;v<g;v++){const m=ne(e,.55,.9);u.push({r:m,color:je(h,e),pos:[ne(e,-.5,.5),a+ne(e,-.1,.6),ne(e,-.5,.5)]})}d=a+1.2}const f=e()*6;return i.add({kind:"tree",hp:3,shape:{x:o.x,y:d/2,z:o.z,hx:.7,hy:d/2,hz:.7,yaw:0},nav:{x:o.x,z:o.z,hx:l+.12,hz:l+.12,yaw:0},coverShape:{x:o.x,z:o.z,hx:.8,hz:.8,yaw:0},navKind:"soft",los:"obscure",cover:!0,trunkH:a,trunkR:l,look:{piece:"tree",trunk:{h:a,r:l},bark:c,canopy:u,yaw:f,leaves:h}})}function my(i,t,e,n,s,r){const o=t.p(n,s),a=t.yaw(r),l=je(ay,e),c=[];for(let u=0;u<3;u++)c.push({color:je(ly,e),pos:[-.4+u*.4,.62+e()*.08,ne(e,-.08,.08)]});const h=[];if(e()<.4)for(let u=0;u<4;u++)h.push([ne(e,-.5,.5),ne(e,.35,.75),.29]);return i.add({kind:"hedge",hp:1,shape:{x:o.x,y:.42,z:o.z,hx:.6,hy:.42,hz:.3,yaw:a},navKind:"diff",los:"obscure",cover:!0,look:{piece:"hedge",color:l,tufts:c,berries:h,yaw:a,leaves:cy}})}function vl(i,t,e,n,s,r){const o=t.p(n,s),a=ne(e,.65,1.25),l=je(hy,e),c=[1,a,ne(e,.75,1.1)],h=[e()*.6,e()*6,e()*.6],u=r*a,d=e()<.6,f=u*1.5;return i.add({kind:"rock",hp:1/0,shape:{x:o.x,y:f/2,z:o.z,hx:r*.85,hy:f/2,hz:r*.85,yaw:0},navKind:"hard",los:f>1.2?"block":"obscure",cover:!0,look:{piece:"boulder",size:r,color:l,scale:c,rot:h,y:u*.55,moss:d}})}function ql(i,t,e,n,s){const r=t.p(n,s),o=t.yaw(e()*6),a=e();let l,c;if(a<.45){const h=ne(e,.55,.75),u=je(uy,e),d=e()<.4;l={piece:"crate",s:h,color:u,stacked:d},c=d?h*1.7:h}else if(a<.8)l={piece:"barrel",color:je(fy,e)},c=.75;else{const h=[];for(let u=0;u<4;u++)h.push([ne(e,-.12,.12),ne(e,-.12,.12)]);l={piece:"sack",acorns:h},c=.78}return i.add({kind:"crate",hp:1,shape:{x:r.x,y:c/2,z:r.z,hx:.36,hy:c/2,hz:.36,yaw:o},navKind:"diff",los:"obscure",cover:!0,look:{...l,yaw:o,chip:"#9a7048"}})}function gy(i,t,e,n,s){const r=t.p(n,s),o=ne(e,.9,1.9),a=ne(e,.5,.95),l=ne(e,.12,.2),c=je(dy,e),h=[];for(let f=0;f<6;f++){const g=e()*6,v=ne(e,.25,1.1);h.push([g,v])}const u=ne(e,-.12,.12),d=o+a*.7;return i.add({kind:"mushroom",hp:2,shape:{x:r.x,y:d/2,z:r.z,hx:a*.6,hy:d/2,hz:a*.6,yaw:0},nav:{x:r.x,z:r.z,hx:l+.12,hz:l+.12,yaw:0},navKind:"soft",los:"obscure",cover:!0,look:{piece:"mushroom",h:o,r:a,sr:l,cap:c,dots:h,tilt:u,leaves:[c,"#fff6e0","#efe6d0"]}})}function vy(i,t,e,n,s){const r=t.p(0,0),o=[];for(let a=1;a<cu+2;a++)o.push(.78+e()*.3);return i.add({kind:"floor",hp:1/0,shape:{x:r.x,y:.01,z:r.z,hx:n*.75,hy:.01,hz:n*.75,yaw:0},navKind:"diff",cover:!0,look:{piece:"floor",r:n,segments:cu,color:s,rim:o}})}function xy(i,t,e){const n=je(["stone","sand","log","stone"],e),s=4+Math.floor(e()*3),r=3+Math.floor(e()*3),o=-s/2+.5,a=-r/2+.5,l=1+Math.floor(e()*(s-2));for(let h=0;h<s;h++){if(h===l)continue;let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)-(e()<.3?1:0)));const d=u===3&&e()<.35?[1]:[];_r(i,t,e,o+h,a,0,u,n,{holes:d})}for(let h=1;h<=r;h++){let u=Math.max(1,Math.min(3,3-Math.floor(h/2)+Math.floor(e()*2)));if(e()<.15)continue;const d=u===3&&e()<.35?[1]:[];_r(i,t,e,o,a+.3+.5+(h-1),Math.PI/2,u,n,{holes:d})}const c=Math.floor(e()*3);for(let h=0;h<c;h++)ql(i,t,e,o+ne(e,1.5,s-1),a+ne(e,1.6,r-.5))}function _y(i,t,e){const n=je(["stone","sand","log"],e),s=5+Math.floor(e()*3),r=Math.floor(e()*s);for(let o=0;o<s;o++){if(o===r&&s>5)continue;const a=1+Math.floor(e()*3);_r(i,t,e,o-(s-1)/2,0,0,a,n,{holes:a===3&&e()<.4?[1]:[]})}e()<.6&&ql(i,t,e,ne(e,-2,2),ne(e,.9,1.4))}function yy(i,t,e){const n=je(["stone","sand"],e),s=18,r=3.4,o=[];for(let c=0;c<s/2;c++)o.push(1+Math.floor(e()*3));const a=new Set([0,Math.floor(s/4)+(e()<.5?0:1)]),l=o.map(c=>c===3&&e()<.4);for(let c=0;c<s;c++){const h=c%(s/2);if(a.has(h))continue;const u=c/s*Math.PI*2,d=Ns(-Xe(u),-Ne(u));_r(i,t,e,Xe(u)*r,Ne(u)*r,d,o[h],n,{holes:l[h]?[1]:[],bw:1.12})}}function by(i,t,e){const n=e()<.3?"pine":e()<.4?"autumn":"oak";vy(i,t,e,3,n==="autumn"?"#5a5a2a":"#355a2a");const s=[],r=3+Math.floor(e()*3);for(let o=0;o<60&&s.length<r;o++){const a=e()*Math.PI*2,l=Math.sqrt(e())*2.2,c=Xe(a)*l,h=Ne(a)*l;s.some(u=>Wt(u.x-c,u.z-h)<1.55)||s.push({x:c,z:h})}for(const o of s)py(i,t,e,o.x,o.z,n)}function My(i,t,e){const n=5+Math.floor(e()*3),s=ne(e,-.12,.12),r=1+Math.floor(e()*(n-2));for(let o=0;o<n;o++){if(o===r&&e()<.7)continue;const a=(o-(n-1)/2)*1.12,l=s*a*a;my(i,t,e,a,l,-gl(2*s*a))}}function Sy(i,t,e){const n=2+Math.floor(e()*3);vl(i,t,e,0,0,ne(e,.8,1.15));for(let s=1;s<n;s++){const r=e()*6;vl(i,t,e,Xe(r)*ne(e,.9,1.4),Ne(r)*ne(e,.9,1.4),ne(e,.35,.7))}}function wy(i,t,e){const n=3+Math.floor(e()*3);for(let s=0;s<n;s++)ql(i,t,e,(s-(n-1)/2)*.8+ne(e,-.1,.1),ne(e,-.3,.3))}function Ey(i,t,e){const n=3+Math.floor(e()*3),s=[];for(let r=0;r<40&&s.length<n;r++){const o=e()*6,a=Math.sqrt(e())*1.5,l=Xe(o)*a,c=Ne(o)*a;s.some(h=>Wt(h.x-l,h.z-c)<.9)||(s.push({x:l,z:c}),gy(i,t,e,l,c))}}function Ty(i,t,e){_r(i,t,e,0,0,0,3+Math.floor(e()*2),"sand",{cap:!0,bw:.8,bt:.8}),e()<.7&&vl(i,t,e,1,.4,.4)}const bo=mn(Object.assign(Object.create(null),{ruin:xy,wall:_y,tower:yy,forest:by,hedgerow:My,rocks:Sy,barricade:wy,mushrooms:Ey,obelisk:Ty})),xl=mn(Object.assign(Object.create(null),{tower(i,t,e){fr(i,"tower",{x:0,z:0,yaw:t()*Math.PI},t()*1e9|0),e.push({x:0,z:0,r:4.6,hollow:!0})},rockbox(i,t,e){const n=t()*Math.PI;for(const s of[0,1]){const r=n+s*(Math.PI/2),o=Xe(r)*4.2,a=Ne(r)*4.2,l=t()*1e9|0;fr(i,"rocks",{x:o,z:a,yaw:r},l),fr(i,"rocks",{x:-o,z:-a,yaw:r+Math.PI},l),e.push({x:o,z:a,r:1.8},{x:-o,z:-a,r:1.8})}}}));function Ay(i,t,e,n,s){const r=Hf(e),{W:o,H:a}=i,l=[],c=r(),h=t.centre.find(([,v])=>c<v);h&&xl[h[0]](i,r,l);const u=t.kinds,d=u.reduce((v,m)=>v+m[2],0),f=t.pairs[0]+Math.floor(r()*t.pairs[1]);let g=0;for(let v=0;v<t.attempts&&g<f;v++){let m=r()*d,p=u[0];for(const w of u)if((m-=w[2])<=0){p=w;break}const[_,x]=p,y=ne(r,-o/2+x+t.margin,o/2-x-t.margin),R=ne(r,-a/2+x+t.margin,a/2-x-t.margin);if(Wt(y,R)<x+t.selfGap||Math.abs(y)>o/2-s-t.deployMargin&&(x>t.bigNotInDeploy||t.notInDeploy.includes(_))||n.some(w=>Wt(w.x-y,w.z-R)<x+t.objectiveGap))continue;const E=t.gap;if(l.some(w=>Wt(w.x-y,w.z-R)<w.r+x+E||Wt(w.x+y,w.z+R)<w.r+x+E))continue;const O=r()*Math.PI*2,b=r()*1e9|0;fr(i,_,{x:y,z:R,yaw:O},b),fr(i,_,{x:-y,z:-R,yaw:O+Math.PI},b),l.push({x:y,z:R,r:x},{x:-y,z:-R,r:x}),g++}return l}const hu=Object.freeze(["centre","kinds","pairs","attempts","mirror","margin","selfGap","deployMargin","bigNotInDeploy","notInDeploy","objectiveGap","gap"]),uu=Object.freeze(["point"]);function Ry(i,t){const e=r=>{throw new Error(`terrain set "${i}": ${r}`)},n=r=>typeof r=="number"&&Number.isFinite(r),s=r=>Number.isInteger(r)&&r>=0;(!t||typeof t!="object")&&e("is not a table");for(const r of Object.keys(t))hu.includes(r)||e(`unknown field "${r}"`);for(const r of hu)r in t||e(`no "${r}"`);(!Array.isArray(t.kinds)||!t.kinds.length)&&e("kinds must list at least one feature"),t.kinds.forEach((r,o)=>{(!Array.isArray(r)||r.length!==3)&&e(`kinds[${o}] must be [feature, radius, weight]`),r[0]in bo||e(`kinds[${o}]: no feature "${r[0]}" (there are ${Object.keys(bo).join(", ")})`),(!n(r[1])||r[1]<=0)&&e(`kinds[${o}] (${r[0]}): radius ${r[1]} must be a number above 0`),(!n(r[2])||r[2]<=0)&&e(`kinds[${o}] (${r[0]}): weight ${r[2]} must be a number above 0`)}),Array.isArray(t.centre)||e("centre must be a list of [piece, threshold]"),t.centre.forEach((r,o)=>{(!Array.isArray(r)||r.length!==2)&&e(`centre[${o}] must be [piece, threshold]`),r[0]in xl||e(`centre[${o}]: no centre piece "${r[0]}" (there are ${Object.keys(xl).join(", ")})`),(!n(r[1])||r[1]<=0||r[1]>1)&&e(`centre[${o}] (${r[0]}): threshold ${r[1]} must be in (0, 1]`),o&&r[1]<=t.centre[o-1][1]&&e(`centre[${o}] (${r[0]}): thresholds must rise (the first one above the draw wins)`)}),(!Array.isArray(t.pairs)||t.pairs.length!==2||!t.pairs.every(s))&&e("pairs must be two whole numbers, 0 or more"),s(t.attempts)||e(`attempts ${t.attempts} must be a whole number, 0 or more`),uu.includes(t.mirror)||e(`mirror "${t.mirror}" is not one scatter knows (${uu.join(", ")})`);for(const r of["margin","selfGap","deployMargin","bigNotInDeploy","objectiveGap","gap"])n(t[r])||e(`${r} ${t[r]} must be a finite number`);Array.isArray(t.notInDeploy)||e("notInDeploy must be a list of features");for(const r of t.notInDeploy)r in bo||e(`notInDeploy: no feature "${r}"`);return t}const ws=mn(Object.assign(Object.create(null),{classic:{centre:[["tower",.55],["rockbox",.8]],kinds:[["ruin",3.2,4],["wall",3.6,2],["forest",3.2,3],["hedgerow",3.4,2],["rocks",2,2],["barricade",2,2],["mushrooms",2,1.5],["obelisk",1.6,1]],pairs:[6,3],attempts:1200,mirror:"point",margin:.5,selfGap:1.4,deployMargin:1,bigNotInDeploy:2.1,notInDeploy:["forest"],objectiveGap:2.2,gap:2.1}}));for(const i of Object.keys(ws))Ry(i,ws[i]);function Cy(i,t,e,n,s){const r=Xe(s.yaw),o=Ne(s.yaw),a=i.x-s.x,l=i.y-s.y,c=i.z-s.z,h=[a*r-c*o,l,a*o+c*r],u=[t*r-n*o,e,t*o+n*r],d=[s.hx,s.hy,s.hz];let f=0,g=1;for(let v=0;v<3;v++)if(Math.abs(u[v])<1e-9){if(Math.abs(h[v])>d[v])return!1}else{let m=(-d[v]-h[v])/u[v],p=(d[v]-h[v])/u[v];if(m>p&&([m,p]=[p,m]),m>f&&(f=m),p<g&&(g=p),f>g)return!1}return!0}function Py(i,t,e,n){const s=Xe(n.yaw),r=Ne(n.yaw),o=i-n.x,a=t-n.y,l=e-n.z,c=o*s-l*r,h=o*r+l*s,u=Math.max(0,Math.abs(c)-n.hx),d=Math.max(0,Math.abs(a)-n.hy),f=Math.max(0,Math.abs(h)-n.hz);return N_(u,d,f)}const fu=i=>({x:i.shape.x,y:i.shape.y,z:i.shape.z}),Ly=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});class Dy{constructor(t,e){this.W=t,this.H=e,this.chunks=[],this.features=[],this.dirty=!0,this.nextId=1}clear(t=null){this.chunks=[],this.features=[],this.nextId=1,this.dirty=!0,Ei(t,"terrain.clear",{})}add(t,e=null){const n={id:this.nextId++,alive:!0,destructible:t.hp!==1/0,hp:t.hp??1/0,maxHp:t.hp??1/0,los:null,cover:!1,navKind:null,...t},s=n.shape;return s.reach=Wt(s.hx,s.hz)+.05,this.chunks.push(n),Ei(e,"terrain.add",{def:Ly(n)}),n}generate(t,e,n,s="classic",r=null){if(!(s in ws))throw new Error(`no terrain set "${s}" (there are ${Object.keys(ws).join(", ")})`);this.clear(r);const o={W:this.W,H:this.H,add:a=>this.add(a,r)};this.features=Ay(o,ws[s],t,e,n),this.dirty=!0}los(t,e,n=1.3){let s=0;const r=e.x-t.x,o=e.y-t.y,a=e.z-t.z,l=r*r+a*a;for(const c of this.chunks){if(!c.alive||!c.los)continue;const h=c.shape;let u=l>0?((h.x-t.x)*r+(h.z-t.z)*a)/l:0;u=u<0?0:u>1?1:u;const d=t.x+r*u-h.x,f=t.z+a*u-h.z;if(!(d*d+f*f>h.reach*h.reach)&&Cy(t,r,o,a,h)){if(c.los==="block")return{blocked:!0,obscure:s};Wt(h.x-t.x,h.z-t.z)<n+h.reach*.5||s++}}return{blocked:s>=2,obscure:s}}blast(t,e,n,s,{acid:r=!1}={},o=null){const a=[];for(const l of[...this.chunks]){if(!l.alive||!l.destructible)continue;const c=Py(t,.5,e,l.shape);if(c>n)continue;let h=c<n*.6?s:Math.ceil(s/2);r&&l.kind==="block"&&(h+=1),this.hurt(l,h,{x:t,z:e},o,a)}return a}hurt(t,e,n,s=null,r=[]){return!t.alive||!t.destructible||(t.hp-=e,t.hp<=0?(this.destroy(t,n,s),r.push(t)):Ei(s,"terrain.hurt",{id:t.id,from:n,at:fu(t)})),r}destroy(t,e,n=null){switch(t.alive=!1,this.dirty=!0,Ei(n,"terrain.destroy",{id:t.id,kind:t.kind,from:e,at:fu(t)}),t.kind){case"block":this.collapse(t.col,n),this.rubble(t.col,e,n);break;case"tree":this.topple(t,e,n);break}}collapse(t,e=null){t.blocks=t.blocks.filter(r=>r.alive).sort((r,o)=>r.level-o.level);const n=[];let s=0;for(const r of t.blocks){if(r.level>s){const o=(r.level-s)*t.by;r.level=s,r.shape.y-=o,n.push({id:r.id,dy:o})}s=r.level+1}n.length&&Ei(e,"terrain.collapse",{drops:n,by:t.by})}rubble(t,e,n=null){let s=t.rubble;if(!s){const r=t.style;s=t.rubble=this.add({kind:"rubble",hp:1/0,shape:{x:t.x,y:.2,z:t.z,hx:t.w*.7,hy:.2,hz:.6,yaw:t.yaw},navKind:"diff",los:"obscure",cover:!0,look:{piece:"rubble",style:r}},n),this.dirty=!0}Ei(n,"terrain.rubble",{id:s.id,from:e})}topple(t,e,n=null){const s=t.shape;let r=s.x-((e==null?void 0:e.x)??s.x-1),o=s.z-((e==null?void 0:e.z)??s.z);const a=Wt(r,o)||1;r/=a,o/=a;const l=t.trunkH,c=this.add({kind:"log",hp:2,shape:{x:s.x+r*l*.5,y:t.trunkR,z:s.z+o*l*.5,hx:l*.5,hy:t.trunkR,hz:t.trunkR+.05,yaw:Ns(-o,r)},navKind:"diff",los:"obscure",cover:!0,look:{piece:"fallen",tree:t.id,dx:r,dz:o}},n);return this.dirty=!0,c}}function Iy(i,t){const e=t*2+.16;if(i===1)return[[0,0]];if(i<=4){const r=i===2?e/2:e/(2*Ne(Math.PI/i));return Array.from({length:i},(o,a)=>[Xe(a/i*Math.PI*2+.4)*r,Ne(a/i*Math.PI*2+.4)*r])}const n=i-1,s=Math.max(e,e/(2*Ne(Math.PI/n)));return[[0,0],...Array.from({length:n},(r,o)=>[Xe(o/n*Math.PI*2+.3)*s,Ne(o/n*Math.PI*2+.3)*s])]}function Uy(i,t,e){const n=Kn(i,e),s=n.units[t],r={id:i.nextUnitId++,key:t,t:s,side:e,race:n.key,pos:{x:0,z:0},models:[],alive:s.models,r:0,flags:{},lost:0,mesmerized:!1};for(let o=0;o<s.models;o++)r.models.push({w:s.W,alive:!0,ox:0,oz:0});return Jf(r),r}function Jf(i){const t=i.models.filter(n=>n.alive),e=Iy(t.length,i.t.base);t.sort((n,s)=>Ns(n.oz,n.ox)-Ns(s.oz,s.ox)),e.forEach(([n,s],r)=>{t[r].ox=n,t[r].oz=s}),i.r=e.reduce((n,[s,r])=>Math.max(n,Wt(s,r)),0)+i.t.base}function Go(i,t,e){i.pos.x=t,i.pos.z=e}function Zf(i,t){const{W:e}=Qn,n=br(i,t),s=n*(e/2),r=n*(e/2-yr(i.setup).deploy);return{minX:Math.min(s,r),maxX:Math.max(s,r)}}function Qf(i,t,e,{minX:n,maxX:s},r){const o=i.nav,a=o.x(e),l=o.z(e);return!(a-t.r<n-.01||a+t.r>s+.01||!o.standable(e,t.r,"walk")||r.some(c=>Wt(c.pos.x-a,c.pos.z-l)<c.r+t.r+.4))}function Oy(i,t,e){return Number.isInteger(e)&&e>=0&&e<i.nav.N&&Qf(i,t,e,Zf(i,t.side),i.units.filter(n=>n!==t))}function td(i,t,e,n,s,r){const o=i.nav;let a=null,l=1/0;const c=Zf(i,s);for(let h=0;h<o.N;h++){if(!Qf(i,t,h,c,r))continue;const u=o.x(h),d=o.z(h),f=Wt(u-e,d-n);f<l&&(l=f,a={x:u,z:d})}return a}function Ny(i){const{W:t,H:e}=Qn;for(const n of[0,1]){const s=br(i,n),r=i.units.filter(d=>d.side===n),o=[],a=r.filter(d=>d.t.deployRow==="back"),l=r.filter(d=>d.t.deployRow==="mid"),c=r.filter(d=>d.t.deployRow==="front"),h=yr(i.setup).deploy,u=[[c,t/2-h+1.8],[l,t/2-h+3.6],[a,t/2-2.4]];for(const[d,f]of u)d.forEach((g,v)=>{const m=((v+.5)/d.length-.5)*(e-6)*-s,p=td(i,g,s*f,m,n,o)||{x:s*f,z:m};Go(g,p.x,p.z),o.push(g)})}}const ed=Object.freeze([-1,1]),yr=i=>Os.classic,nd=.5;function zy(i,t){if(i.length!==2||t.length!==2)throw new Error("a match has two seats");return i.map((e,n)=>{if(typeof e!="string"||!An[e])throw new Error(`seat ${n}: no race "${e}" (there are ${Object.keys(An).join(", ")})`);if(t[n]!=="human"&&t[n]!=="ai")throw new Error(`seat ${n}: controller "${t[n]}" is neither human nor ai`);return{seat:n,race:e,edge:ed[n],ctrl:t[n]}})}const ky=i=>({...i,seats:i.seats.map(t=>({...t}))}),Kn=(i,t)=>An[i.seats[t].race],br=(i,t)=>i.seats[t].edge,id=(i,t)=>i.seats[t].ctrl;function Fy(i,{out:t=null,onTrace:e=null}={}){const{W:n,H:s}=Qn,r={setup:mn(ky(i)),rng:T_(i.dice),seats:zy(i.seats.map(o=>o.race),i.seats.map(o=>o.ctrl)),units:[],nextUnitId:1,objectives:yr().objectives.map((o,a)=>({i:a,x:o.x,z:o.z})),terrain:new Dy(n,s),nav:new ty(n,s,nd),turn:{stage:"deploy",step:"rolloff",round:1,t:0,active:0,first:0,ph:0,vp:[0,0],wiped:-1,result:null,overtime:0},pending:null,journal:{trace:[],pendingLog:[]},out:t,onTrace:e,strict:!1};r.terrain.generate(i.board,r.objectives,yr().deploy,i.terrain,t),qi(r);for(const o of[0,1])for(const a of Kn(r,o).army)r.units.push(Uy(r,a,o));return Ny(r),r}function qi(i){i.terrain.dirty&&(i.terrain.dirty=!1,i.nav.rebuild(i.terrain.chunks))}function $o(i,t,e,n,s,r=null){let o=0;for(let a=0;a<e;a++){const l=t.models.filter(f=>f.alive);if(!l.length)break;let c=r?l.filter(f=>r.includes(f)):[];c.length||(c=l);const h=c.filter(f=>f.w<t.t.W);let u;if(h.length)u=h[0];else{const f=g=>Wt(Ws(t,g)-s.pos.x,Gs(t,g)-s.pos.z);u=c.reduce((g,v)=>f(g)<f(v)?g:v)}u.w-=n;const d=Math.min(n,n+Math.min(0,u.w));u.w<=0?(By(i,t,u,s,d),o++):ct(i,"unit.wound",{u:t.id,m:t.models.indexOf(u),dmg:d}),ct(i,"pause",{s:.06})}return o&&(t.lost+=o,ct(i,"pause",{s:.25}),oe(t)&&sd(i,t),i.out&&ct(i,"objectives",{owners:Yi(i)})),i.out&&ct(i,"status",vi(i)),o}function sd(i,t){const e=Dr(i,t);if(Jf(t),e.length&&!tn(i,t)){const n=e.reduce((o,a)=>pi(t,o)<pi(t,a)?o:a),s=qo(t,n),r=pi(t,n)-(di-.3);Go(t,t.pos.x+(n.pos.x-t.pos.x)/s*r,t.pos.z+(n.pos.z-t.pos.z)/s*r)}ct(i,"unit.formation",{u:t.id,offs:t.models.map(n=>[n.ox,n.oz]),r:t.r,pos:{x:t.pos.x,z:t.pos.z}})}function By(i,t,e,n,s){e.alive=!1,e.w=0,t.alive--,ct(i,"unit.slain",{u:t.id,m:t.models.indexOf(e),by:n?n.id:null,dmg:s}),oe(t)||rd(i,t,n)}function rd(i,t,e){i.journal.pendingLog.push([t.side,`<b>${t.t.name}</b> ${t.t.models>1?"are":"is"} destroyed!`,"big"]),ct(i,"unit.destroyed",{u:t.id,by:e?e.id:null})}function zs(i,t){const e=t.t.ranged;return!(!e||!oe(t)||t.flags.shot||t.mesmerized||t.flags.fellBack||tn(i,t)||t.flags.advanced&&!e.assault)}function jo(i,t,e){const n=t.t.ranged,s=pi(t,e);if(s>n.range)return{ok:!1,why:`out of range (${s.toFixed(1)}" / ${n.range}")`};if(tn(i,e)&&!n.spell)return{ok:!1,why:"locked in combat"};const r=tc(i,t,e);if(!r.visible&&!n.indirect)return{ok:!1,why:"no line of sight"};let o=0;return n.heavy&&t.flags.moved&&o++,n.indirect&&!r.visible&&o++,{ok:!0,range:s,...r,mod:o,need:xr(t.t.BS,o)}}function Yl(i,t){return zs(i,t)?Un(i,t).filter(e=>jo(i,t,e).ok):[]}function Hy(i,t,e){const n=t.t.ranged,s=jo(i,t,e);if(t.flags.shot=!0,ct(i,"unit.face",{u:t.id,tg:e.id}),ct(i,"tray.open",{title:`${t.t.short} → ${e.t.short} · ${n.name}`}),n.spell){const v=He(i,2),m=v[0]+v[1]>=n.spell;if(ct(i,"dice",{label:`Cast ${n.spell}+ (2D6)`,dice:v,need:0,sum:!0,pass:m}),!m){ct(i,"spell.fizzle",{u:t.id}),ye(i,t.side,`<b>${t.t.short}</b> tries ${n.name} — it fizzles (${v[0]+v[1]}).`);return}return ct(i,"spell.cast",{u:t.id}),n.mesmerize?Gy(i,t,e):(ye(i,t.side,`<b>${t.t.short}</b> casts <b>${n.name}</b> on ${e.t.short}!`),Wy(i,t,e,n))}if(n.blast)return Vy(i,t,e,n,s);const r=Is(t,n,!1);ct(i,"volley",{u:t.id,tg:e.id,fx:n.fx,n:r});const o=He(i,r),a=Yn(o,s.need);ct(i,"dice",{label:`Hit ${s.need}+`,dice:o,need:s.need});const l=Rr(n.S,e.t.T,n.poison),c=He(i,a),h=Yn(c,l);a&&ct(i,"dice",{label:`Wound ${l}+`,dice:c,need:l});const u=Cr(e.t.Sv,n.AP,s.cover),d=He(i,h),f=u>6?h:h-Yn(d,u);h&&ct(i,"dice",{label:u>6?"No save":`Save ${u}+${s.cover?" (cover)":""}`,dice:u>6?[]:d,need:u,save:!0});const g=$o(i,e,f,n.D,t);ye(i,t.side,`<b>${t.t.short}</b> shoot ${e.t.short}: ${a} hit, ${h} wound, ${f} unsaved${g?` — <b>${g} slain</b>`:""}.`)}function Vy(i,t,e,n,s){const{W:r,H:o}=Qn,a=Is(t,n,!1);ye(i,t.side,`<b>${t.t.short}</b> fire ${n.name} at ${e.t.short} (${s.need}+${s.visible?"":", unseen"}).`);for(let l=0;l<a&&!(!oe(t)||!oe(e)&&l>0);l++){const c=cr(i.rng)*Math.PI*2,h=cr(i.rng)*e.r*.5,u={x:e.pos.x+Xe(c)*h,z:e.pos.z+Ne(c)*h};ct(i,"blast.aim",{x:u.x,z:u.z,r:n.blast});const d=He(i,1),f=d[0]>=s.need;ct(i,"dice",{label:a>1?`Template ${l+1}: hit ${s.need}+`:`Hit ${s.need}+`,dice:d,need:s.need});let g=u;if(!f){const v=He(i,1)[0]+1,m=cr(i.rng)*Math.PI*2;g={x:Math.max(-r/2+.3,Math.min(r/2-.3,u.x+Xe(m)*v)),z:Math.max(-o/2+.3,Math.min(o/2-.3,u.z+Ne(m)*v))},ct(i,"dice",{label:"Scatter D6+1",dice:[v-1],need:0,sum:!0,note:`${v}"`}),ct(i,"blast.scatter",{from:{x:u.x,z:u.z},to:{x:g.x,z:g.z},d:v})}ct(i,"blast.fire",{u:t.id,to:{x:g.x,z:g.z},fx:n.fx}),od(i,t,g,n)}}function Wy(i,t,e,n){const s={x:e.pos.x,z:e.pos.z};ct(i,"spell.thorns",{u:t.id,x:s.x,z:s.z,r:n.blast}),od(i,t,s,n),ct(i,"spell.fade",{u:t.id})}function od(i,t,e,n){ct(i,"blast.land",{x:e.x,z:e.z,r:n.blast,fx:n.fx});const s=[];for(const o of i.units){if(!oe(o))continue;const a=o.models.filter(l=>l.alive&&Wt(Ws(o,l)-e.x,Gs(o,l)-e.z)<=n.blast+o.t.base*.6);a.length&&s.push({v:o,under:a})}for(const{v:o,under:a}of s){let l=a.length;o.t.big&&(l=Math.ceil(Xl(i)/2)+1);const c=o.side===t.side,h=Rr(n.S,o.t.T,n.poison),u=He(i,l),d=Yn(u,h);ct(i,"dice",{label:`${c?"⚠ ":""}${o.t.short}: ${l} hit${l>1?"s":""} · wound ${h}+`,dice:u,need:h});const f=Yo(i,o),g=Cr(o.t.Sv,n.AP,f),v=He(i,d),m=g>6?d:d-Yn(v,g);d&&g<=6&&ct(i,"dice",{label:`Save ${g}+${f?" (cover)":""}`,dice:v,need:g,save:!0});const p=$o(i,o,m,n.D,t,a);ye(i,t.side,`${c?"<b>Friendly fire!</b> ":""}${n.name} hits ${o.t.short}: ${d} wound, ${m} unsaved${p?` — <b>${p} slain</b>`:""}.`)}s.length||ct(i,"pause",{s:.25});const r=i.terrain.blast(e.x,e.z,n.blast,n.scenery||1,{acid:!!n.corrodes},i.out);r.length&&ye(i,t.side,`…and ${r.length} piece${r.length>1?"s":""} of scenery ${r.length>1?"are":"is"} wrecked.`),qi(i)}function Gy(i,t,e){ct(i,"spell.gaze",{u:t.id,tg:e.id});const n=Math.ceil(Xl(i)/2);ct(i,"dice",{label:"Mortal wounds D3",dice:[n],need:0,sum:!0,note:`${n}`});const s=$o(i,e,n,1,t);e.mesmerized=!0,i.out&&ct(i,"status",vi(i)),ct(i,"spell.mesmerized",{u:t.id,tg:e.id}),ye(i,t.side,`<b>${t.t.short}</b> mesmerizes ${e.t.short}: ${n} mortal wound${n>1?"s":""}${s?`, <b>${s} slain</b>`:""}. It can't shoot or charge next turn.`)}function Kl(i){return i.t.move}function Do(i,t,e,n=[]){const{W:s,H:r}=Qn,o=i.nav,a=new Uint8Array(o.N);a.discs=[];for(const l of Un(i,t)){const c=l.r+t.r+(n.includes(l)?.02:e);a.discs.push({x:l.pos.x,z:l.pos.z,R:c-.02});const h=Math.max(0,Math.floor((l.pos.x-c+s/2)/o.cell)),u=Math.min(o.nx-1,Math.floor((l.pos.x+c+s/2)/o.cell)),d=Math.max(0,Math.floor((l.pos.z-c+r/2)/o.cell)),f=Math.min(o.nz-1,Math.floor((l.pos.z+c+r/2)/o.cell));for(let g=d;g<=f;g++)for(let v=h;v<=u;v++){const m=g*o.nx+v;Wt(o.x(m)-l.pos.x,o.z(m)-l.pos.z)<c&&(a[m]=1)}}return a}function Es(i,t,e=0){qi(i);const n=tn(i,t),s=t.t.M+e,r=Kl(t),o=Un(i,t),a=Do(i,t,di+.05,n?o:[]),l=Do(i,t,di+.05),c=i.nav.reach(t.pos.x,t.pos.z,{r:t.r,max:s,mode:r==="fly"?"fly":r,forbid:r==="fly"?null:a});return{u:t,res:c,max:s,mode:r,forbid:a,endForbid:l,fallback:n}}function Lr(i,t,e){const{u:n,res:s,mode:r,endForbid:o}=t,a=i.nav;if(e<0||!isFinite(s.dist[e])||!a.standable(e,n.r,r==="wreck"?"wreck":"walk",o))return!1;const l=a.x(e),c=a.z(e);for(const h of i.units)if(h!==n&&oe(h)&&Wt(h.pos.x-l,h.pos.z-c)<h.r+n.r+.08)return!1;return!0}function $y(i,t,e,n,s=2.4){const r=i.nav;let o=-1,a=s;const l=r.index(e,n);if(l<0)return-1;const c=Math.ceil(s/r.cell),h=l%r.nx,u=l/r.nx|0;for(let d=-c;d<=c;d++)for(let f=-c;f<=c;f++){const g=h+f,v=u+d;if(g<0||v<0||g>=r.nx||v>=r.nz)continue;const m=v*r.nx+g,p=Wt(r.x(m)-e,r.z(m)-n);p<a&&Lr(i,t,m)&&(a=p,o=m)}return o}function jy(i,t,e,n=Es(i,t,t.flags.advanced?t.flags.advRoll:0)){const s=i.nav.path(n.res,e,t.r,n.mode==="fly"?null:n.forbid);t.flags.moved=!0,n.fallback&&(t.flags.fellBack=!0);const r=Xf(s);ye(i,t.side,`<b>${t.t.short}</b> ${n.fallback?"fall back":t.flags.advanced?"advance":"move"} ${r.toFixed(1)}".`),ad(i,t,s,{fly:n.mode==="fly",stomp:t.t.wrecker&&r>.1}),qi(i)}function Xy(i,t){ct(i,"tray.open",{title:`${t.t.short} — Advance`});const e=He(i,1);return ct(i,"dice",{label:"Advance D6",dice:e,need:0,sum:!0,note:`+${e[0]}"`}),t.flags.advanced=!0,t.flags.advRoll=e[0],ye(i,t.side,`<b>${t.t.short}</b> advance: +${e[0]}".`),e[0]}function qy(i,t){t.flags.moved=!0}function ad(i,t,e,{speed:n=7,fly:s=!1,stomp:r=!1}={}){const o=Xf(e);if(o<.05)return;const a=[];let l=0;for(let d=1;d<e.length;d++){const f=Wt(e[d].x-e[d-1].x,e[d].z-e[d-1].z);a.push({a:e[d-1],b:e[d],s:l,l:f}),l+=f}const c=[];if(t.t.wrecker){const d=[];for(const g of a)for(let v=0;v<g.l;v+=.25)d.push({s:g.s+v,x:g.a.x+(g.b.x-g.a.x)*v/g.l,z:g.a.z+(g.b.z-g.a.z)*v/g.l,dir:Ns(g.b.x-g.a.x,g.b.z-g.a.z)});const f=a[a.length-1];d.push({s:o,x:e[e.length-1].x,z:e[e.length-1].z,dir:Ns(f.b.x-f.a.x,f.b.z-f.a.z)});for(const g of d){const v=i.out?[]:null;Yy(i,t,g,v)&&v&&c.push({s:g.s,ev:v})}}const h=a.find(d=>o<=d.s+d.l)||a[a.length-1],u=h.l>0?(o-h.s)/h.l:1;Go(t,pn(h.a.x,h.b.x,u),pn(h.a.z,h.b.z,u)),i.out&&(ct(i,"unit.move",{u:t.id,path:e.map(d=>({x:d.x,z:d.z})),L:o,speed:n,fly:s,stomp:r,smashes:c,to:{x:t.pos.x,z:t.pos.z}}),ct(i,"objectives",{owners:Yi(i)}),ct(i,"status",vi(i)))}function Yy(i,t,{x:e,z:n,dir:s},r){let o=0;for(const a of i.terrain.chunks){if(!a.alive||!a.destructible)continue;const l=a.nav||a.shape;Wt(l.x-e,l.z-n)<t.r+Math.max(l.hx,l.hz)*.8&&(i.terrain.hurt(a,99,{x:e-Ne(s),z:n-Xe(s)},r),o++)}return o}function Mr(i,t){return!(!oe(t)||t.flags.charged||t.flags.chargeTried||t.t.noCharge||t.mesmerized||t.flags.fellBack||tn(i,t)||t.flags.advanced&&!t.t.chargeAfterAdvance)}function Xo(i,t){return Mr(i,t)?Un(i,t).filter(e=>pi(t,e)<=Tr):[]}function Vs(i,t,e){qi(i);const n=i.nav,s=Un(i,t).filter(m=>m!==e),r=Kl(t),o=Do(i,t,di+.05,[e]),a=n.reach(t.pos.x,t.pos.z,{r:t.r,max:Tr+.5,mode:r,forbid:r==="fly"?null:o}),l=[];let c=-1,h=1/0;const u=e.r+t.r+di-.08,d=Math.ceil((u+1)/n.cell),f=n.index(e.pos.x,e.pos.z),g=f%n.nx,v=f/n.nx|0;for(let m=-d;m<=d;m++)for(let p=-d;p<=d;p++){const _=g+p,x=v+m;if(_<0||x<0||_>=n.nx||x>=n.nz)continue;const y=x*n.nx+_,R=a.dist[y];if(!isFinite(R))continue;const S=Wt(n.x(y)-e.pos.x,n.z(y)-e.pos.z);S>u||S<e.r+t.r+.02||n.standable(y,t.r,r==="wreck"?"wreck":"walk",o)&&(s.some(E=>Wt(n.x(y)-E.pos.x,n.z(y)-E.pos.z)<E.r+t.r+di)||i.units.some(E=>E!==t&&E!==e&&oe(E)&&E.side===t.side&&Wt(E.pos.x-n.x(y),E.pos.z-n.z(y))<E.r+t.r+.05)||(l.push({i:y,d:R}),R<h&&(c=y,h=R)))}return c<0?null:{cell:c,need:Math.max(2,Math.ceil(h-.01)),res:a,forbid:o,mode:r,dist:h,spots:l}}function ld(i,t){const e=new Uint8Array(i.res.dist.length);for(const n of i.spots)n.d<=t+.011&&(e[n.i]=1);return e[i.cell]=1,e}function Ky(i,t,e,n){const s=Vs(i,t,e);if(t.flags.chargeTried=!0,ct(i,"tray.open",{title:`${t.t.short} charge ${e.t.short}`}),!s)return ye(i,t.side,`<b>${t.t.short}</b> can't find a way to ${e.t.short}.`),null;const r=He(i,2),o=r[0]+r[1],a=o>=s.need;return ct(i,"dice",{label:`Charge ${s.need}" (2D6)`,dice:r,need:0,sum:!0,pass:a}),ct(i,"unit.face",{u:t.id,tg:e.id}),a?(t.flags.charged=!0,t.flags.chargeTarget=e.id,ct(i,"charge.result",{u:t.id,tg:e.id,ok:a}),ye(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o} vs ${s.need}. <b>Contact!</b>`),n!=="ai"?{plan:s,rolled:o}:(cd(i,t,e,s.cell,s),null)):(ct(i,"charge.result",{u:t.id,tg:e.id,ok:a}),ye(i,t.side,`<b>${t.t.short}</b> charge ${e.t.short} — roll ${o}, needed ${s.need}. Failed.`),null)}function cd(i,t,e,n,s=Vs(i,t,e)){const r=i.nav.path(s.res,n,t.r,s.mode==="fly"?null:s.forbid);ad(i,t,r,{speed:11,fly:s.mode==="fly"}),qi(i)}const oe=i=>i.alive>0,Un=(i,t)=>i.units.filter(e=>e.side!==t.side&&oe(e)),Jl=(i,t)=>i.units.filter(e=>e.side===t.side&&oe(e)&&e!==t),qo=(i,t)=>Wt(i.pos.x-t.pos.x,i.pos.z-t.pos.z),pi=(i,t)=>qo(i,t)-i.r-t.r,Dr=(i,t)=>Un(i,t).filter(e=>pi(t,e)<=di+.05),Ws=(i,t)=>i.pos.x+t.ox,Gs=(i,t)=>i.pos.z+t.oz,tn=(i,t)=>Dr(i,t).length>0,Zl=i=>i.t.eye,Ql=i=>i.t.chest;function Yo(i,t){const e=t.models.filter(s=>s.alive);if(t.t.fly)return!1;let n=0;for(const s of e)i.nav.cover[i.nav.index(Ws(t,s),Gs(t,s))]&&n++;return n*2>=e.length&&n>0}function tc(i,t,e,n=t.pos){const s={x:n.x,y:Zl(t),z:n.z};let r=0,o=0,a=0;for(const l of e.models){if(!l.alive)continue;a++;const c=i.terrain.los(s,{x:Ws(e,l),y:Ql(e),z:Gs(e,l)});c.blocked||(r++,c.obscure&&o++)}return{visible:r>0,cover:r>0&&(o>0||r<a||Yo(i,e)),seen:r,total:a}}function hd(i,t){let e=t.t.Ld;for(const n of Jl(i,t))n.t.hero&&qo(t,n)<=Ar+t.r&&(e=Math.max(e,n.t.Ld));return e}function Ko(i,t){const e=[0,0];for(const n of i.units)if(oe(n))for(const s of n.models)s.alive&&Wt(Ws(n,s)-t.x,Gs(n,s)-t.z)<=Vo+n.t.base&&(e[n.side]+=n.t.OC);return e[0]>e[1]?0:e[1]>e[0]?1:-1}const Yi=i=>i.objectives.map(t=>Ko(i,t)),vi=i=>({engaged:i.units.filter(t=>oe(t)&&tn(i,t)).map(t=>t.id),mesmerized:i.units.filter(t=>t.mesmerized).map(t=>t.id)}),Jn=i=>Ds[Math.min(i.turn.ph,Ds.length-1)].key;function ud(i,t){if(!oe(t)||t.side!==i.turn.active)return!1;switch(Jn(i)){case"move":return!t.flags.moved;case"shoot":return zs(i,t)&&Yl(i,t).length>0;case"charge":return Mr(i,t)&&Xo(i,t).length>0}return!1}const fd=(i,t)=>i.units.some(e=>e.side===t&&ud(i,e)),dd=Object.freeze(Object.defineProperty({__proto__:null,alive:oe,anyCanAct:fd,canAct:ud,canCharge:Mr,canShoot:zs,chargePlan:Vs,chargeSpots:ld,chargeTargets:Xo,chestY:Ql,controlOf:Ko,dist:qo,enemiesOf:Un,engagedWith:Dr,eyeY:Zl,forbidMask:Do,freeSpot:td,friendsOf:Jl,gap:pi,inCover:Yo,isEngaged:tn,leadership:hd,moveMode:Kl,movePlan:Es,mx:Ws,mz:Gs,nearestValid:$y,ownersOf:Yi,phaseKey:Jn,rngState:Ho,shootTargets:Yl,shotInfo:jo,sight:tc,statusOf:vi,validEnd:Lr},Symbol.toStringTag,{value:"Module"}));function du(i,t){if(!oe(t)||t.flags.fought)return;const e=Dr(i,t);if(!e.length)return;t.flags.fought=!0;const n=e.find(p=>p.id===t.flags.chargeTarget)||e.reduce((p,_)=>p.alive*p.t.W<_.alive*_.t.W?p:_),s=t.t.melee,r=t.mesmerized?1:0,o=xr(t.t.WS,r);ct(i,"unit.face",{u:t.id,tg:n.id}),ct(i,"focus",{x:t.pos.x*.5+n.pos.x*.5,z:t.pos.z*.5+n.pos.z*.5}),ct(i,"tray.open",{title:`${t.t.short} fight ${n.t.short} · ${s.name}`});const a=Is(t,s,!0),l=He(i,a),c=Yn(l,o);ct(i,"melee",{u:t.id,tg:n.id,n:a,hits:c}),ct(i,"dice",{label:`Hit ${o}+${r?" (mesmerized)":""}`,dice:l,need:o});const h=Rr(s.S,n.t.T,s.poison),u=He(i,c),d=Yn(u,h);c&&ct(i,"dice",{label:`Wound ${h}+`,dice:u,need:h});const f=Cr(n.t.Sv,s.AP,!1),g=He(i,d),v=f>6?d:d-Yn(g,f);d&&ct(i,"dice",{label:f>6?"No save":`Save ${f}+`,dice:f>6?[]:g,need:f,save:!0});const m=$o(i,n,v,s.D,t);ye(i,t.side,`<b>${t.t.short}</b> fight ${n.t.short}: ${c} hit, ${d} wound, ${v} unsaved${m?` — <b>${m} slain</b>`:""}.`),ct(i,"pause",{s:.3})}function Jy(i,t){const e=i.units.filter(s=>s.side===t&&s.flags.charged&&oe(s));for(const s of e)du(i,s);let n=1-t;for(let s=0;s<30;s++){const r=i.units.find(a=>a.side===n&&oe(a)&&!a.flags.fought&&tn(i,a)),o=i.units.find(a=>a.side===1-n&&oe(a)&&!a.flags.fought&&tn(i,a));if(!r&&!o)break;r&&du(i,r),n=1-n}for(const s of i.units)s.flags.fought=!1;i.out&&ct(i,"status",vi(i))}function Zy(i){let t=!1;for(const e of i.units){if(!oe(e)||!e.lost||e.t.models===1)continue;t||ct(i,"tray.open",{title:"Morale"}),t=!0;const n=hd(i,e),s=He(i,1),r=s[0]+e.lost,o=s[0]===1?0:Math.max(0,r-n);if(ct(i,"dice",{label:`${e.t.short}: D6 + ${e.lost} lost vs Ld ${n}`,dice:s,need:0,sum:!0,pass:o===0,note:`${r}`}),o){const a=Math.min(o,e.alive),l=e.models.filter(c=>c.alive).slice(-a);for(const c of l)Qy(i,e,c);ye(i,e.side,`<b>${e.t.short}</b> lose their nerve — <b>${a} flee</b>.`),oe(e)?sd(i,e):rd(i,e,null),i.out&&(ct(i,"objectives",{owners:Yi(i)}),ct(i,"status",vi(i))),ct(i,"pause",{s:.5})}else ye(i,e.side,`<b>${e.t.short}</b> hold firm (${r} vs Ld ${n}).`)}}function Qy(i,t,e){e.alive=!1,e.w=0,t.alive--,ct(i,"unit.flee",{u:t.id,m:t.models.indexOf(e)})}const pd=i=>i.t.pts*i.alive/i.t.models;function Fi(i,t){return i.t.melee?Lo(i.alive*i.t.A,xr(i.t.WS,i.mesmerized?1:0),i.t.melee,t,!1).value:0}function md(i,t,e,n,s){var c;const r=t.t.ranged;if(!r||Wt(e.pos.x-n.x,e.pos.z-n.z)-t.r-e.r>r.range||tn(i,e)&&!r.spell)return 0;const a=tc(i,t,e,n);if(!a.visible&&!r.indirect&&!r.mesmerize)return 0;if(r.mesmerize)return a.visible?Gi(r.spell)*(pd(e)*.25+Math.min(2,e.alive)*e.t.pts*.08+((c=e.t.ranged)!=null&&c.blast?8:0)):0;let l=0;if(r.heavy&&s&&l++,r.indirect&&!a.visible&&l++,r.blast){const h=r.spell?Gi(r.spell):_o(xr(t.t.BS,l)),u=e.t.big?3:Math.max(1,Math.min(e.alive,Math.round(e.alive*Math.min(1,r.blast*r.blast/(e.r*e.r))*.8)));return Is(t,r,!1)*h*Lo(u,1,r,e,a.cover).value}return Lo(Is(t,r,!1),xr(t.t.BS,l),r,e,a.cover).value}function pu(i,t,e,n){const{nav:s}=i,r=Un(i,t),o=Jl(i,t),a=i.objectives.map(f=>Ko(i,f)),l=t.t.ai,c={enemies:r,friends:o,owners:a,claimed:n,role:l};let h={cell:-1,score:mu(i,t,t.pos.x,t.pos.z,c,!1),dist:0,...c.last};const u=t.t.M>8?3:2,d=e.res;for(let f=0;f<s.nz;f+=u)for(let g=f/u%2?1:0;g<s.nx;g+=u){const v=f*s.nx+g;if(!isFinite(d.dist[v])||!Lr(i,e,v))continue;const m=s.x(v),p=s.z(v),_=mu(i,t,m,p,c,!0)+cr(i.rng)*.05;_>h.score&&(h={cell:v,score:_,dist:Wt(m-t.pos.x,p-t.pos.z),...c.last})}return h}function mu(i,t,e,n,s,r){const{enemies:o,friends:a,owners:l,claimed:c,role:h}=s,u=t.t,d={x:e,z:n},f=r&&Wt(e-t.pos.x,n-t.pos.z)>.3;let g=0,v=!1,m=-1;if(u.OC>0){const y=h==="line"||h==="shooter"?5:h==="melee"?2:2.5;let R=0;for(const S of i.objectives){const E=Wt(S.x-e,S.z-n),O=l[S.i]===t.side?.45:1,b=c.has(S.i)?.25:1;let w;E<=2.6?w=y*O*b*1.4:w=y*O*b*Math.max(0,1-(E-2.6)/16)*.7,w>R&&(R=w,E<=2.6?(v=!0,m=S.i):v||(m=-1))}g+=R}let p=!1;if(u.ranged&&h!=="melee"){let y=0;for(const S of o){const E=md(i,t,S,d,f);E>y&&(y=E)}y>0&&(p=!0),g+=y*(h==="artillery"?.25:h==="hero"?.12:.18)*(t.flags.advanced&&!u.ranged.assault?0:1)}if(h==="melee"||h==="line"||h==="raider"||h==="hero"){let y=0;for(const S of o){const E=Wt(S.pos.x-e,S.pos.z-n)-t.r-S.r;if(E>Tr)continue;const O=E<=1?1:Gi(Math.ceil(E)),b=Fi(S,t)*.4,w=O*(Fi(t,S)-b+(S.t.role==="Artillery"?10:0));w>y&&(y=w)}if(g+=y*(h==="melee"?.3:h==="raider"?.18:h==="hero"?.06:.15),y===0&&h!=="hero"){const S=Math.min(...o.map(E=>Wt(E.pos.x-e,E.pos.z-n)));g-=S*(h==="melee"?.12:.05)}}const _=h==="shooter"||h==="artillery"||h==="hero";for(const y of o){const R=Wt(y.pos.x-e,y.pos.z-n)-t.r-y.r;y.t.brawler&&R<y.t.M+7&&(g-=Fi(y,t)*(_?.16:.05)*(1-R/(y.t.M+7)))}const x=i.nav.index(e,n);if(x>=0&&i.nav.cover[x]&&(g+=_?1.5:.5),h==="artillery"&&f&&(g-=2.5),h==="hero"){let y=0;for(const S of a)Wt(S.pos.x-e,S.pos.z-n)<=Ar+S.r&&y++;g+=Math.min(3,y)*.9;const R=Math.min(...o.map(S=>Wt(S.pos.x-e,S.pos.z-n)));R<8&&(g-=(8-R)*.6)}for(const y of a){const R=Wt(y.pos.x-e,y.pos.z-n)-y.r-t.r;R<1.5&&(g-=(1.5-R)*.6)}return s.last={onObjective:v,obj:m,canShoot:p},g}const ks=Object.freeze(["melee","raider","line","shooter","hero","artillery"]);function*tb(i,t,e){e==="move"?yield*eb(i,t):e==="shoot"?yield*nb(i,t):e==="charge"&&(yield*ib(i,t))}function*eb(i,t){const e=i.units.filter(s=>s.side===t&&oe(s));e.sort((s,r)=>ks.indexOf(s.t.ai)-ks.indexOf(r.t.ai));const n=new Set;for(const s of e){if(!oe(s)||s.flags.moved)continue;const r=s.t.ai;if(tn(i,s)){const h=Dr(i,s),u=h.reduce((m,p)=>m+Fi(p,s),0),d=h.reduce((m,p)=>Math.max(m,Fi(s,p)),0);if(r==="melee"||r==="line"||d>=u*.8)continue;const f=Es(i,s);let g=-1,v=-1/0;for(let m=0;m<i.nav.N;m+=2){if(!Lr(i,f,m))continue;const p=i.nav.x(m),_=i.nav.z(m),x=Math.min(...Un(i,s).map(y=>Wt(y.pos.x-p,y.pos.z-_)-y.r));x>v&&(v=x,g=m)}g>=0&&(ct(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:g});continue}let o=Es(i,s,s.flags.advanced?s.flags.advRoll:0),a=pu(i,s,o,n);const l=Math.min(...Un(i,s).map(h=>pi(s,h)));let c=!1;if(r==="melee"||r==="line"||r==="raider"?c=l>s.t.M+8&&!(r==="line"&&a.onObjective)&&!(r==="raider"&&a.canShoot):r==="shooter"&&(c=!a.canShoot&&!a.onObjective&&(s.t.ranged.assault||l>s.t.ranged.range+s.t.M+3)),c&&!s.flags.advanced){ct(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"advance",u:s.id},o=Es(i,s,s.flags.advRoll);const h=pu(i,s,o,n);h.cell>=0&&(a=h)}a.obj>=0&&n.add(a.obj),a.cell>=0&&a.dist>.4?(ct(i,"focus",{x:s.pos.x,z:s.pos.z}),yield{t:"move",u:s.id,c:a.cell}):s.flags.advanced&&qy(i,s),ct(i,"pause",{s:.05})}}function*nb(i,t){const e=i.units.filter(n=>n.side===t&&zs(i,n));e.sort((n,s)=>ks.indexOf(s.t.ai)-ks.indexOf(n.t.ai));for(const n of e){if(!zs(i,n))continue;const s=Yl(i,n);let r=null,o=.4;for(const a of s){let l=md(i,n,a,n.pos,n.flags.moved);const c=n.t.ranged;if(c.blast)for(const h of i.units){if(h.side!==n.side||!oe(h))continue;const u=Wt(h.pos.x-a.pos.x,h.pos.z-a.pos.z)-h.r;u<c.blast+2.5&&(l-=pd(h)*.25*(1-Math.max(0,u)/(c.blast+2.5)))}c.mesmerize&&a.mesmerized&&(l*=.2),l>o&&(o=l,r=a)}r&&(ct(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"shoot",u:n.id,tg:r.id},ct(i,"pause",{s:.1}))}}function*ib(i,t){const e=i.units.filter(n=>n.side===t&&Mr(i,n));e.sort((n,s)=>ks.indexOf(n.t.ai)-ks.indexOf(s.t.ai));for(const n of e){if(!Mr(i,n))continue;const s=n.t.ai;let r=null,o=0;for(const a of Xo(i,n)){const l=Vs(i,n,a);if(!l)continue;const c=Gi(l.need),h=Fi(n,a)+(a.t.role==="Artillery"?12:0)+(a.alive<=2?6:0),u=Fi(a,n);if(c<(s==="melee"?.25:s==="line"?.33:s==="raider"?.4:s==="hero"?.5:.6)||(s==="shooter"||s==="hero")&&h<u*1.4)continue;const f=c*(h-u*.4);f>o&&(o=f,r=a)}r&&(ct(i,"focus",{x:(n.pos.x+r.pos.x)/2,z:(n.pos.z+r.pos.z)/2}),yield{t:"charge",u:n.id,tg:r.id},ct(i,"pause",{s:.1}))}}const Se=(i,t)=>i.units.find(e=>e.id===t),_l=Object.freeze({place(i,t,{u:e,c:n}){const s=Se(i,e);Go(s,i.nav.x(n),i.nav.z(n)),ct(i,"unit.place",{u:e,x:s.pos.x,z:s.pos.z})},deployed(i,t){const e=i.pending.seats.filter(n=>n!==t);i.pending=e.length?{...i.pending,seats:e}:null},advance(i,t,{u:e}){Xy(i,Se(i,e))},move(i,t,{u:e,c:n}){jy(i,Se(i,e),n),lo(i)},shoot(i,t,{u:e,tg:n}){Hy(i,Se(i,e),Se(i,n)),lo(i)},charge(i,t,{u:e,tg:n},s){const r=Ky(i,Se(i,e),Se(i,n),s);if(!r)return lo(i);i.pending={k:"chargeEnd",seats:[t],u:e,tg:n,rolled:r.rolled,cell:r.plan.cell}},chargeEnd(i,t,{c:e}){const n=i.pending;cd(i,Se(i,n.u),Se(i,n.tg),e===-1?n.cell:e),i.pending={k:"phase",seats:n.seats,phase:Jn(i)},lo(i)},end(i){i.pending=null},auto(i,t){yd(i,t,i.pending.phase),i.pending=null},vote(i,t,{more:e}){const n=i.pending,s={...n.votes,[t]:e},r=n.seats.filter(a=>a!==t);if(ct(i,"vote",{seat:t,more:e}),r.length){i.pending={...n,seats:r,votes:s};return}for(const a of Object.keys(s).map(Number).sort((l,c)=>l-c))ye(i,a,`<b>${Kn(i,a).name}</b> ${s[a]?"want to keep playing":"want to end the battle"}.`);i.pending=null;const o=i.turn;if(!Object.values(s).every(Boolean))return Io(i);o.round++,o.overtime++,o.t=0,o.step="turnStart",ye(i,-1,`Overtime: round ${o.round}.`,"big")},concede(i,t){Io(i,t)}}),yl=mn({place:{k:"deploy",fields:["u","c"],ok:(i,t,{u:e,c:n})=>er(i,t,e)??(Oy(i,Se(i,e),n)?null:`cell ${n} is no free spot in seat ${t}'s zone for unit ${e}`)},deployed:{k:"deploy",fields:[]},advance:{k:"phase",phase:"move",fields:["u"],ok:(i,t,{u:e})=>er(i,t,e)??ab(i,Se(i,e))},move:{k:"phase",phase:"move",fields:["u","c"],ok:(i,t,{u:e,c:n})=>er(i,t,e)??lb(i,Se(i,e),n)},shoot:{k:"phase",phase:"shoot",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>er(i,t,e)??gu(i,t,n)??cb(i,Se(i,e),Se(i,n))},charge:{k:"phase",phase:"charge",fields:["u","tg"],ok:(i,t,{u:e,tg:n})=>er(i,t,e)??gu(i,t,n)??hb(i,Se(i,e),Se(i,n))},chargeEnd:{k:"chargeEnd",fields:["c"],ok:(i,t,{c:e},n)=>ub(i,n,e)},end:{k:"phase",fields:[]},auto:{k:"phase",fields:[]},vote:{k:"roundLimit",fields:[],bools:["more"]},concede:{k:null,fields:[],ok:(i,t)=>ob(i,t)}}),sb=Object.freeze(Object.keys(yl));function bl(i,t,e){return gd(i,t,e,i.pending)}function gd(i,t,e,n){const s=i.rng.locked;kf(i.rng);try{return rb(i,t,e,n)}finally{s||Ff(i.rng)}}function rb(i,t,e,n){var a;if(!e||typeof e!="object"||Array.isArray(e))return"not a command";const s=typeof e.t=="string"&&Object.hasOwn(yl,e.t)?yl[e.t]:null;if(!s)return`no command "${e.t}"`;if(!Number.isInteger(t)||t<0||t>=i.seats.length)return`no seat ${t}`;const r=s.opt??[],o=s.bools??[];for(const l of Object.keys(e))if(l!=="t"&&!s.fields.includes(l)&&!r.includes(l)&&!o.includes(l))return`${e.t} takes no field "${l}"`;for(const l of s.fields)if(!Number.isInteger(e[l]))return`${e.t} takes a whole number ${l}`;for(const l of r)if(e[l]!==void 0&&!Number.isInteger(e[l]))return`${e.t} takes a whole number ${l}, or none`;for(const l of o)if(typeof e[l]!="boolean")return`${e.t} takes ${l} true or false`;return i.turn.stage==="over"?"the battle is over":s.k?!n||!n.seats.includes(t)?`seat ${t} has no decision to make now`:n.k!==s.k?`${e.t} doesn't answer the ${n.k} decision`:s.phase&&n.phase!==s.phase?`${e.t} belongs to the ${s.phase} phase, not the ${n.phase}`:((a=s.ok)==null?void 0:a.call(s,i,t,e,n))??null:s.ok(i,t,e)}function er(i,t,e){const n=Se(i,e);return n&&oe(n)&&n.side===t?null:`unit ${e} is no standing unit of seat ${t}`}function gu(i,t,e){const n=Se(i,e);return n&&oe(n)&&n.side!==t?null:`unit ${e} is no standing enemy of seat ${t}`}const vd=(i,t)=>t>=0&&t<i.nav.N;function ob(i,t){return id(i,t)!=="human"?`seat ${t} is the AI's: only a human seat concedes`:i.turn.wiped>=0?`the battle is decided: seat ${i.turn.wiped} is wiped out`:null}function ab(i,t){return t.flags.moved?`${t.t.short} has moved`:t.flags.advanced?`${t.t.short} has advanced`:tn(i,t)?`${t.t.short} is in combat`:null}function lb(i,t,e){return t.flags.moved?`${t.t.short} has moved`:!vd(i,e)||!Lr(i,Es(i,t,t.flags.advanced?t.flags.advRoll:0),e)?`${t.t.short} can't end its move on cell ${e}`:null}function cb(i,t,e){if(!zs(i,t))return`${t.t.short} can't shoot now`;const n=jo(i,t,e);return n.ok?null:`${t.t.short} can't shoot ${e.t.short}: ${n.why}`}function hb(i,t,e){return Xo(i,t).includes(e)?Vs(i,t,e)?null:`${t.t.short} has no way to ${e.t.short}`:`${t.t.short} can't charge ${e.t.short}`}function ub(i,t,e){if(e===-1)return null;const n=vd(i,e)&&Vs(i,Se(i,t.u),Se(i,t.tg));return n&&ld(n,t.rolled)[e]?null:`the charge can't end on cell ${e} (rolled ${t.rolled}")`}const Ml=i=>i.seats.filter(t=>t.ctrl==="human").map(t=>t.seat);function xd(i){const t=i.turn;for(;!i.pending&&t.stage!=="over";)switch(t.step){case"rolloff":t.stage="battle",ct(i,"stage",{stage:"battle"}),i.out&&ct(i,"objectives",{owners:Yi(i)}),fb(i),t.round=1,t.t=0,t.step="turnStart";break;case"turnStart":t.active=(t.first+t.t)%2,db(i,t.active),t.ph=0,t.step="phase";break;case"phase":{const e=Jn(i);ct(i,"phase.start",{side:t.active,phase:e,round:t.round}),t.step="phaseEnd",e==="fight"?i.units.some(n=>oe(n)&&tn(i,n))&&Jy(i,t.active):e==="morale"?Zy(i):fd(i,t.active)?id(i,t.active)==="human"?i.pending={k:"phase",seats:[t.active],phase:e}:yd(i,t.active,e):ct(i,"pause",{s:.2});break}case"phaseEnd":if(Wo(i,`phase ${t.active}:${Jn(i)}`),_d(i),t.wiped>=0){Io(i);break}t.step=++t.ph<Ds.length?"phase":"turnEnd";break;case"turnEnd":pb(i,t.active),t.step=++t.t<2?"turnStart":"score";break;case"score":mb(i),t.round<i.setup.rounds?(t.round++,t.t=0,t.step="turnStart"):i.setup.overtime==="vote"&&Ml(i).length?(ye(i,-1,`Round ${t.round} is over: play another round?`),i.pending={k:"roundLimit",seats:Ml(i),votes:{}}):Io(i);break;default:throw new Error(`the engine has no step "${t.step}"`)}i.pending&&i.out&&ct(i,"pending",{k:i.pending.k,seats:[...i.pending.seats]})}function fb(i){const t=i.turn;ct(i,"tray.open",{title:"Roll-off for the first turn"});let e,n;do e=He(i,1),n=He(i,1),ct(i,"dice",{label:Kn(i,0).short,dice:e,need:0,sum:!0}),ct(i,"dice",{label:Kn(i,1).short,dice:n,need:0,sum:!0});while(e[0]===n[0]);t.first=e[0]>n[0]?0:1,ye(i,t.first,`<b>${Kn(i,t.first).name}</b> win the roll-off and take the first turn.`,"big")}function db(i,t){for(const e of i.units)e.lost=0,e.side===t&&(e.flags={})}function pb(i,t){for(const e of i.units)e.side===t&&e.mesmerized&&(e.mesmerized=!1);i.out&&ct(i,"status",vi(i))}function lo(i){Wo(i,"act"),i.out&&(ct(i,"objectives",{owners:Yi(i)}),ct(i,"status",vi(i))),ct(i,"act",{tag:"act"}),_d(i)}function _d(i){for(const t of[0,1])i.units.some(e=>e.side===t&&oe(e))||(i.turn.wiped=t)}function mb(i){const t=i.turn,e=Yi(i),n=[0,0];for(const o of e)o>=0&&n[o]++;t.vp[0]+=n[0],t.vp[1]+=n[1],Wo(i,`round ${t.round}`);const s=Kn(i,0).short,r=Kn(i,1).short;ye(i,-1,`End of round ${t.round}: ${s} hold ${n[0]} objective${n[0]===1?"":"s"}, ${r} hold ${n[1]}. Score ${t.vp[0]}–${t.vp[1]}.`,"big"),ct(i,"round.scored",{round:t.round,held:[...n],vp:[...t.vp],owners:e})}function Io(i,t=-1){const e=i.turn,n=e.stage==="deploy"?0:e.round;Yf(i),Wo(i,"over"),e.stage="over",i.pending=null,ct(i,"stage",{stage:"over"});const s=t>=0?1-t:e.wiped>=0?1-e.wiped:e.vp[0]>e.vp[1]?0:e.vp[1]>e.vp[0]?1:-1,r=t>=0?"concede":e.wiped>=0?"wipe":"score";e.result={win:s,why:r},ct(i,"game.over",{win:s,why:r,vp:[...e.vp],rounds:n})}function yd(i,t,e){const n=i.pending,s={k:"phase",seats:[t],phase:e};for(const r of tb(i,t,e)){if(i.strict){const o=gd(i,t,r,s);if(o)throw new Error(`the AI (seat ${t}, ${e} phase) asked for ${JSON.stringify(r)}, which is illegal: ${o}`)}if(_l[r.t](i,t,r,"ai"),i.pending!==n)throw new Error(`the AI's ${JSON.stringify(r)} left a decision open: ${JSON.stringify(i.pending)}`)}}const gb=new Set(["name","short","icon","look","abilities","fx"]),Uo=i=>Array.isArray(i)?i.map(Uo):i&&typeof i=="object"?Object.fromEntries(Object.entries(i).filter(([t])=>!gb.has(t)).map(([t,e])=>[t,Uo(e)])):i,vu=(i,t)=>Object.fromEntries(Object.entries(i).map(([e,n])=>[e,t(n)])),vb=Object.freeze({BOARD:Qn,ENGAGE:di,CHARGE_RANGE:Tr,OBJECTIVE_RANGE:Vo,ROUNDS:Bf,AURA:Ar});function xb({races:i=An,constants:t=vb,phases:e=Ds.map(r=>r.key),sets:n=ws,missions:s=Os}={}){return{races:vu(i,({units:r,...o})=>({...Uo(o),units:vu(r,Uo)})),constants:t,phases:e,sets:n,missions:s}}const _b=i=>Pr(Us(xb(i))).toString(36),dr=_b(),pr=2,Wn=i=>Object.is(i,-0)?"-0":String(i),yb=i=>typeof i=="number"?Wn(i):String(i),bb=i=>Object.keys(i).filter(t=>i[t]!==void 0).sort().map(t=>`${t}=${String(i[t])}`).join(","),bd=Object.freeze({}),Mb=(i,t=bd)=>Object.keys(t).sort().filter(e=>i[e]!==void 0&&!Object.is(i[e],t[e])).map(e=>`${e}=${yb(i[e])}`).join(",");function Md(i,t=bd){const e=i.turn,n=[e.stage,e.step,e.round,e.t,e.first,e.active,e.ph,e.vp.join("-"),e.wiped,e.overtime].map(String).join(","),s=i.units.map(o=>{const a=Mb(o,t);return[o.id,Wn(o.pos.x),Wn(o.pos.z),Wn(o.r),o.alive,o.lost,o.mesmerized,`{${bb(o.flags)}}`,o.models.map(l=>`${Wn(l.w)}/${l.alive}/${Wn(l.ox)}/${Wn(l.oz)}`).join(" "),...a?[`[${a}]`]:[]].join(",")}).join(";"),r=i.terrain.chunks.map(o=>`${o.id},${o.alive},${Wn(o.hp)},${Wn(o.shape.y)}`).join(";");return`turn ${n}
pending ${Us(i.pending)}
units ${s}
chunks ${r}
rng ${Ho(i.rng)} ${i.rng.a}`}const Di=i=>Pr(Md(i)).toString(36),Sb=i=>{var t;return[...((t=i.pending)==null?void 0:t.seats)??[]]},xu=99;function Sd(i){const t={};for(const[s,r]of Object.entries(i??{}))r!=null&&(t[s]=r);const e={terrain:"classic",rounds:yr().rounds,overtime:"never",diceMode:"shared"};for(const[s,r]of Object.entries(e))t[s]??(t[s]=r);const n=s=>Number.isInteger(s)&&s>=0&&s<=4294967295;if(!n(t.board)||!n(t.dice))throw new Error(`a setup's board and dice are whole numbers from 0 to 2^32 - 1, not ${t.board} and ${t.dice}`);if(!Number.isInteger(t.rounds)||t.rounds<1||t.rounds>xu)throw new Error(`a battle lasts a whole number of rounds, from 1 to ${xu}, not ${t.rounds}`);if(t.overtime!=="never"&&t.overtime!=="vote")throw new Error(`overtime "${t.overtime}": a battle ends after its rounds ('never') or its human seats vote on more ('vote')`);if(t.diceMode!=="shared")throw new Error(`dice mode "${t.diceMode}": only 'shared' dice so far`);if(!Array.isArray(t.seats))throw new Error("a setup names its seats");return t}function wd(i,{out:t=null,onTrace:e=null,strict:n=!1}={}){const s=Fy(Sd(i),{out:t,onTrace:e});s.strict=n;const r=Ml(s);if(r.length){ct(s,"stage",{stage:"deploy"});for(const o of r)ye(s,o,`<b>${Kn(s,o).name}</b>: deploy your army.`);s.pending={k:"deploy",seats:r}}return xd(s),s}function Sr(i,t){const e=i.rng.locked;kf(i.rng);try{return t(i,dd)}finally{e||Ff(i.rng)}}function _u(i,t,e){if(!Object.hasOwn(_l,e.t))throw new Error(`no command "${e.t}"`);_l[e.t](i,t,e,"seat"),xd(i)}const wb=i=>i.objectives.map(t=>i.turn.stage==="battle"||i.turn.stage==="over"?Ko(i,t):-1);function qn(i){const t=i.turn,e={};for(const s of i.units)e[s.id]={pos:{x:s.pos.x,z:s.pos.z},r:s.r,models:s.models.map(r=>({w:r.w,alive:r.alive,ox:r.ox,oz:r.oz})),alive:s.alive,mesmerized:s.mesmerized,engaged:oe(s)&&tn(i,s)};const n={};for(const s of i.terrain.chunks)n[s.id]={alive:s.alive,y:s.shape.y};return{units:e,chunks:n,owners:wb(i),vp:[...t.vp],round:t.round,active:t.active,phase:Jn(i),stage:t.stage}}function Ed(i,t){const e=t.u===void 0?null:i.units[t.u];switch(t.t){case"unit.place":e.pos={x:t.x,z:t.z};break;case"unit.move":e.pos={x:t.to.x,z:t.to.z};for(const{ev:n}of t.smashes)for(const s of n)Ed(i,s);break;case"unit.formation":e.pos={x:t.pos.x,z:t.pos.z},e.r=t.r,t.offs.forEach(([n,s],r)=>{e.models[r].ox=n,e.models[r].oz=s});break;case"unit.wound":e.models[t.m].w-=t.dmg;break;case"unit.slain":case"unit.flee":e.models[t.m].w=0,e.models[t.m].alive=!1,e.alive--;break;case"status":{const n=new Set(t.engaged),s=new Set(t.mesmerized);for(const[r,o]of Object.entries(i.units))o.engaged=n.has(Number(r)),o.mesmerized=s.has(Number(r));break}case"objectives":i.owners=[...t.owners];break;case"round.scored":i.vp=[...t.vp],i.owners=[...t.owners];break;case"phase.start":i.round=t.round,i.active=t.side,i.phase=t.phase;break;case"stage":i.stage=t.stage;break;case"terrain.clear":i.chunks={};break;case"terrain.add":i.chunks[t.def.id]={alive:!0,y:t.def.shape.y};break;case"terrain.destroy":i.chunks[t.id].alive=!1;break;case"terrain.collapse":for(const{id:n,dy:s}of t.drops)i.chunks[n].y-=s;break}return i}const gi=Object.freeze({phaseStart:(i,t)=>i||t!=="battle"?.9:.6,dice:i=>.38+Math.min(i,14)*.035,pause:i=>i,beat:.3,cost:i=>{var t;return i.t==="unit.move"?(i.L??0)/(i.speed||6)+.3:i.t==="pause"?i.s??0:i.t==="dice"?gi.dice(((t=i.dice)==null?void 0:t.length)??1):i.t==="phase.start"||i.t==="round.scored"?.9:/^(volley|blast\.|spell\.)/.test(i.t)?.5:0}}),Eb=(i,t=Math.random)=>je(i,t),Ts=i=>1-Math.pow(1-i,3),Tb=i=>i*i*i,Sl=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,Ab=i=>Math.atan2(Math.sin(i),Math.cos(i));function Rb(i){return i<1/2.75?7.5625*i*i:i<2/2.75?7.5625*(i-=1.5/2.75)*i+.75:i<2.5/2.75?7.5625*(i-=2.25/2.75)*i+.9375:7.5625*(i-=2.625/2.75)*i+.984375}const _e={speed:1,time:0,boost:1,rate:1},wl=new Set;function Ae(i,t,e=n=>n){return new Promise(n=>{wl.add({t:0,duration:Math.max(1e-4,i),fn:t,ease:e,resolve:n})})}const Cn=i=>Ae(i,()=>{});function Cb(i){for(const t of[...wl]){t.t+=i;const e=Math.min(1,t.t/t.duration);t.fn(t.ease(e),e),e>=1&&(wl.delete(t),t.resolve())}}class Pb{constructor({lowfi:t=!1,fast:e=!1}={}){this.fast=e;const n=this.renderer=new Lf({antialias:!0});n.setPixelRatio(t?.5:Math.min(devicePixelRatio,2)),n.setSize(innerWidth,innerHeight),n.shadowMap.enabled=!t,n.shadowMap.type=tf,n.toneMapping=ef,n.toneMappingExposure=1.05,document.body.prepend(n.domElement);const s=this.scene=new Df;s.background=new qt("#1c1712"),s.fog=new Fl("#1c1712",70,140),addEventListener("resize",()=>n.setSize(innerWidth,innerHeight)),this.overlay=document.querySelector("#labels")}light(){const t=this.scene;t.add(new y_("#d6e6ff","#3b2a1a",.85));const e=new Gh("#fff0d6",2.3);e.position.set(-16,34,20),e.castShadow=!0,e.shadow.mapSize.set(2048,2048),Object.assign(e.shadow.camera,{left:-27,right:27,top:22,bottom:-22,near:5,far:90}),e.shadow.bias=-4e-4,e.shadow.normalBias=.02,t.add(e);const n=new Gh("#9fb8ff",.35);n.position.set(18,12,-16),t.add(n)}run({parts:t,rig:e,shake:n}){const s=new w_,r=()=>{requestAnimationFrame(r),this.fast&&(_e.speed=1e4);const o=s.getDelta(),a=Math.min(o,.05);o>0&&(_e.rate+=(a/o-_e.rate)*.05);const l=a*_e.speed*_e.boost;_e.time+=l,Cb(l),t(l,_e.time),e.update(a),e.render(this.renderer,this.scene,n(),!this.fast)};r()}}const yu={type:"change"},Ga={type:"start"},bu={type:"end"},co=new zo,Mu=new oi,Lb=Math.cos(70*Yp.DEG2RAD);class Db extends $i{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gn.ROTATE,MIDDLE:Gn.DOLLY,RIGHT:Gn.PAN},this.touches={ONE:Ki.ROTATE,TWO:Ki.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",U),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",U),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(yu),n.update(),r=s.NONE},this.update=function(){const P=new C,at=new Pn().setFromUnitVectors(t.up,new C(0,1,0)),Pt=at.clone().invert(),wt=new C,st=new Pn,L=new C,lt=2*Math.PI;return function(Ft=null){const Ot=n.object.position;P.copy(Ot).sub(n.target),P.applyQuaternion(at),a.setFromVector3(P),n.autoRotate&&r===s.NONE&&$(w(Ft)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let Qt=n.minAzimuthAngle,te=n.maxAzimuthAngle;isFinite(Qt)&&isFinite(te)&&(Qt<-Math.PI?Qt+=lt:Qt>Math.PI&&(Qt-=lt),te<-Math.PI?te+=lt:te>Math.PI&&(te-=lt),Qt<=te?a.theta=Math.max(Qt,Math.min(te,a.theta)):a.theta=a.theta>(Qt+te)/2?Math.max(Qt,a.theta):Math.min(te,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&S||n.object.isOrthographicCamera?a.radius=Q(a.radius):a.radius=Q(a.radius*c),P.setFromSpherical(a),P.applyQuaternion(Pt),Ot.copy(n.target).add(P),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let pe=!1;if(n.zoomToCursor&&S){let ve=null;if(n.object.isPerspectiveCamera){const ee=P.length();ve=Q(ee*c);const be=ee-ve;n.object.position.addScaledVector(y,be),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ee=new C(R.x,R.y,0);ee.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),pe=!0;const be=new C(R.x,R.y,0);be.unproject(n.object),n.object.position.sub(be).add(ee),n.object.updateMatrixWorld(),ve=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ve!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ve).add(n.object.position):(co.origin.copy(n.object.position),co.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(co.direction))<Lb?t.lookAt(n.target):(Mu.setFromNormalAndCoplanarPoint(n.object.up,n.target),co.intersectPlane(Mu,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),pe=!0);return c=1,S=!1,pe||wt.distanceToSquared(n.object.position)>o||8*(1-st.dot(n.object.quaternion))>o||L.distanceToSquared(n.target)>0?(n.dispatchEvent(yu),wt.copy(n.object.position),st.copy(n.object.quaternion),L.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",vt),n.domElement.removeEventListener("pointerdown",A),n.domElement.removeEventListener("pointercancel",z),n.domElement.removeEventListener("wheel",nt),n.domElement.removeEventListener("pointermove",M),n.domElement.removeEventListener("pointerup",z),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",U),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new Xh,l=new Xh;let c=1;const h=new C,u=new ft,d=new ft,f=new ft,g=new ft,v=new ft,m=new ft,p=new ft,_=new ft,x=new ft,y=new C,R=new ft;let S=!1;const E=[],O={};let b=!1;function w(P){return P!==null?2*Math.PI/60*n.autoRotateSpeed*P:2*Math.PI/60/60*n.autoRotateSpeed}function k(P){const at=Math.abs(P*.01);return Math.pow(.95,n.zoomSpeed*at)}function $(P){l.theta-=P}function et(P){l.phi-=P}const I=function(){const P=new C;return function(Pt,wt){P.setFromMatrixColumn(wt,0),P.multiplyScalar(-Pt),h.add(P)}}(),F=function(){const P=new C;return function(Pt,wt){n.screenSpacePanning===!0?P.setFromMatrixColumn(wt,1):(P.setFromMatrixColumn(wt,0),P.crossVectors(n.object.up,P)),P.multiplyScalar(Pt),h.add(P)}}(),X=function(){const P=new C;return function(Pt,wt){const st=n.domElement;if(n.object.isPerspectiveCamera){const L=n.object.position;P.copy(L).sub(n.target);let lt=P.length();lt*=Math.tan(n.object.fov/2*Math.PI/180),I(2*Pt*lt/st.clientHeight,n.object.matrix),F(2*wt*lt/st.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(I(Pt*(n.object.right-n.object.left)/n.object.zoom/st.clientWidth,n.object.matrix),F(wt*(n.object.top-n.object.bottom)/n.object.zoom/st.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function J(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Y(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function q(P,at){if(!n.zoomToCursor)return;S=!0;const Pt=n.domElement.getBoundingClientRect(),wt=P-Pt.left,st=at-Pt.top,L=Pt.width,lt=Pt.height;R.x=wt/L*2-1,R.y=-(st/lt)*2+1,y.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function Q(P){return Math.max(n.minDistance,Math.min(n.maxDistance,P))}function ot(P){u.set(P.clientX,P.clientY)}function dt(P){q(P.clientX,P.clientX),p.set(P.clientX,P.clientY)}function G(P){g.set(P.clientX,P.clientY)}function Z(P){d.set(P.clientX,P.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const at=n.domElement;$(2*Math.PI*f.x/at.clientHeight),et(2*Math.PI*f.y/at.clientHeight),u.copy(d),n.update()}function pt(P){_.set(P.clientX,P.clientY),x.subVectors(_,p),x.y>0?J(k(x.y)):x.y<0&&Y(k(x.y)),p.copy(_),n.update()}function Et(P){v.set(P.clientX,P.clientY),m.subVectors(v,g).multiplyScalar(n.panSpeed),X(m.x,m.y),g.copy(v),n.update()}function Tt(P){q(P.clientX,P.clientY),P.deltaY<0?Y(k(P.deltaY)):P.deltaY>0&&J(k(P.deltaY)),n.update()}function Ut(P){let at=!1;switch(P.code){case n.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?et(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(0,n.keyPanSpeed),at=!0;break;case n.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?et(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(0,-n.keyPanSpeed),at=!0;break;case n.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?$(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(n.keyPanSpeed,0),at=!0;break;case n.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?$(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):X(-n.keyPanSpeed,0),at=!0;break}at&&(P.preventDefault(),n.update())}function Dt(P){if(E.length===1)u.set(P.pageX,P.pageY);else{const at=xt(P),Pt=.5*(P.pageX+at.x),wt=.5*(P.pageY+at.y);u.set(Pt,wt)}}function Nt(P){if(E.length===1)g.set(P.pageX,P.pageY);else{const at=xt(P),Pt=.5*(P.pageX+at.x),wt=.5*(P.pageY+at.y);g.set(Pt,wt)}}function Yt(P){const at=xt(P),Pt=P.pageX-at.x,wt=P.pageY-at.y,st=Math.sqrt(Pt*Pt+wt*wt);p.set(0,st)}function B(P){n.enableZoom&&Yt(P),n.enablePan&&Nt(P)}function Ee(P){n.enableZoom&&Yt(P),n.enableRotate&&Dt(P)}function It(P){if(E.length==1)d.set(P.pageX,P.pageY);else{const Pt=xt(P),wt=.5*(P.pageX+Pt.x),st=.5*(P.pageY+Pt.y);d.set(wt,st)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const at=n.domElement;$(2*Math.PI*f.x/at.clientHeight),et(2*Math.PI*f.y/at.clientHeight),u.copy(d)}function kt(P){if(E.length===1)v.set(P.pageX,P.pageY);else{const at=xt(P),Pt=.5*(P.pageX+at.x),wt=.5*(P.pageY+at.y);v.set(Pt,wt)}m.subVectors(v,g).multiplyScalar(n.panSpeed),X(m.x,m.y),g.copy(v)}function bt(P){const at=xt(P),Pt=P.pageX-at.x,wt=P.pageY-at.y,st=Math.sqrt(Pt*Pt+wt*wt);_.set(0,st),x.set(0,Math.pow(_.y/p.y,n.zoomSpeed)),J(x.y),p.copy(_);const L=(P.pageX+at.x)*.5,lt=(P.pageY+at.y)*.5;q(L,lt)}function se(P){n.enableZoom&&bt(P),n.enablePan&&kt(P)}function zt(P){n.enableZoom&&bt(P),n.enableRotate&&It(P)}function A(P){n.enabled!==!1&&(E.length===0&&(n.domElement.setPointerCapture(P.pointerId),n.domElement.addEventListener("pointermove",M),n.domElement.addEventListener("pointerup",z)),_t(P),P.pointerType==="touch"?K(P):it(P))}function M(P){n.enabled!==!1&&(P.pointerType==="touch"?j(P):tt(P))}function z(P){Rt(P),E.length===0&&(n.domElement.releasePointerCapture(P.pointerId),n.domElement.removeEventListener("pointermove",M),n.domElement.removeEventListener("pointerup",z)),n.dispatchEvent(bu),r=s.NONE}function it(P){let at;switch(P.button){case 0:at=n.mouseButtons.LEFT;break;case 1:at=n.mouseButtons.MIDDLE;break;case 2:at=n.mouseButtons.RIGHT;break;default:at=-1}switch(at){case Gn.DOLLY:if(n.enableZoom===!1)return;dt(P),r=s.DOLLY;break;case Gn.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enablePan===!1)return;G(P),r=s.PAN}else{if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}break;case Gn.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enableRotate===!1)return;ot(P),r=s.ROTATE}else{if(n.enablePan===!1)return;G(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ga)}function tt(P){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Z(P);break;case s.DOLLY:if(n.enableZoom===!1)return;pt(P);break;case s.PAN:if(n.enablePan===!1)return;Et(P);break}}function nt(P){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(P.preventDefault(),n.dispatchEvent(Ga),Tt(At(P)),n.dispatchEvent(bu))}function At(P){const at=P.deltaMode,Pt={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(at){case 1:Pt.deltaY*=16;break;case 2:Pt.deltaY*=100;break}return P.ctrlKey&&!b&&(Pt.deltaY*=10),Pt}function mt(P){P.key==="Control"&&(b=!0,document.addEventListener("keyup",D,{passive:!0,capture:!0}))}function D(P){P.key==="Control"&&(b=!1,document.removeEventListener("keyup",D,{passive:!0,capture:!0}))}function U(P){n.enabled===!1||n.enablePan===!1||Ut(P)}function K(P){switch(St(P),E.length){case 1:switch(n.touches.ONE){case Ki.ROTATE:if(n.enableRotate===!1)return;Dt(P),r=s.TOUCH_ROTATE;break;case Ki.PAN:if(n.enablePan===!1)return;Nt(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Ki.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;B(P),r=s.TOUCH_DOLLY_PAN;break;case Ki.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ee(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ga)}function j(P){switch(St(P),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;It(P),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;kt(P),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;se(P),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;zt(P),n.update();break;default:r=s.NONE}}function vt(P){n.enabled!==!1&&P.preventDefault()}function _t(P){E.push(P.pointerId)}function Rt(P){delete O[P.pointerId];for(let at=0;at<E.length;at++)if(E[at]==P.pointerId){E.splice(at,1);return}}function St(P){let at=O[P.pointerId];at===void 0&&(at=new ft,O[P.pointerId]=at),at.set(P.pageX,P.pageY)}function xt(P){const at=P.pointerId===E[0]?E[1]:E[0];return O[at]}n.domElement.addEventListener("contextmenu",vt),n.domElement.addEventListener("pointerdown",A),n.domElement.addEventListener("pointercancel",z),n.domElement.addEventListener("wheel",nt,{passive:!1}),document.addEventListener("keydown",mt,{passive:!0,capture:!0}),this.update()}}const{W:Ib,H:Ub}=Qn,Ob=Object.freeze({cx:0,cz:0,w:Ib,h:Ub}),Ke=Object.freeze({title:Object.freeze({orbit:Object.freeze({centre:Object.freeze([-5,0,0]),radius:25,y:13,speed:.035,angle:-1.02})}),landscape:Object.freeze({pos:Object.freeze([0,30,31]),target:Object.freeze([0,0,1.5]),fov:40}),portrait:Object.freeze({pos:Object.freeze([-36,46,0]),target:Object.freeze([-1,0,0]),fov:56}),broadside:Object.freeze({azimuth:0,elevation:.77,max:105}),behind:i=>Object.freeze({azimuth:i<0?-Math.PI/2:Math.PI/2,elevation:.9,max:80}),overview:Object.freeze({azimuth:0,elevation:1.45,max:100})}),Nb=i=>!(i<1);function Su({localSeats:i=[],edges:t=[]}){if(i.length===1){const e=t[i[0]];return[Ke.behind(e),Ke.broadside,Ke.behind(-e),Ke.overview]}return[Ke.broadside,Ke.behind(-1),Ke.behind(1),Ke.overview]}const Td=i=>Nb(i)?Ke.landscape.fov:Ke.portrait.fov;function zb(i,t,e=i.angle){const n=e+t*i.speed,s=i.centre;return{pos:[s[0]+Math.sin(n)*i.radius,i.y,s[2]+Math.cos(n)*i.radius],target:[s[0],s[1],s[2]]}}const kb=({follow:i,stage:t,active:e,localSeats:n})=>!!i&&t==="battle"&&!(n.length===1&&n.includes(e));function Fb(i,t,e=Ob){if(i.pos)return i;const n=Td(t),s=Math.tan(n*Math.PI/360),r=s*t,{azimuth:o,elevation:a}=i,l=[Math.sin(o)*Math.cos(a),Math.sin(a),Math.cos(o)*Math.cos(a)],c=l.map(y=>-y),h=Hb([-c[2],0,c[0]]),u=Bb(h,c),{cx:d,cz:f,w:g,h:v}=e,m=[[-g/2,-v/2],[g/2,-v/2],[-g/2,v/2],[g/2,v/2]].map(([y,R])=>[y,0,R]),p=y=>m.every(R=>{const S=[R[0]-l[0]*y,R[1]-l[1]*y,R[2]-l[2]*y],E=$a(S,c);return E>0&&Math.abs($a(S,h))*1.12<=E*r&&Math.abs($a(S,u))*1.12<=E*s});let _=1,x=i.max;if(p(_))x=_;else if(p(x))for(let y=0;y<60;y++){const R=(_+x)/2;p(R)?x=R:_=R}return{pos:[d+l[0]*x,l[1]*x,f+l[2]*x],target:[d,0,f],fov:n}}const $a=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],Bb=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],Hb=i=>{const t=Math.hypot(i[0],i[1],i[2]);return i.map(e=>e/t)},wu=i=>new C(i[0],i[1],i[2]),ho=75;class Vb{constructor(t){const e=Ke.landscape;this.camera=new on(e.fov,innerWidth/innerHeight,.1,400),this.camera.position.set(...e.pos);const n=this.controls=new Db(this.camera,t.domElement);n.target.set(...e.target),n.enableDamping=!0,n.dampingFactor=.08,n.maxPolarAngle=1.32,n.minDistance=5,n.maxDistance=ho,n.screenSpacePanning=!1,n.mouseButtons={LEFT:Gn.ROTATE,MIDDLE:Gn.DOLLY,RIGHT:Gn.PAN},this.follow=!0,this.titleSpin=!0,this.titleAngle=Ke.title.orbit.angle,this.viewShift=1,this.focusTween=null,this.views=[],this.viewAt=0,this.keys=new Set,addEventListener("keydown",s=>{s.target.tagName!=="INPUT"&&(!s.repeat&&(s.key==="v"||s.key==="V")?this.nextView():s.key==="Home"&&this.toOverview(),this.keys.add(s.key.toLowerCase()))}),addEventListener("keyup",s=>this.keys.delete(s.key.toLowerCase())),this.fitFov(),addEventListener("resize",()=>{this.fitFov(),this.camera.aspect=innerWidth/innerHeight,this.camera.updateProjectionMatrix()})}fitFov(){const t=this.camera;t.fov=Td(innerWidth/innerHeight),t.aspect=innerWidth/innerHeight,t.updateProjectionMatrix()}fit(t,e=innerWidth/innerHeight){return Fb(t,e)}setViews(t){this.views=t,this.viewAt=0,this.goTo(t[0])}nextView(){this.views.length&&(this.viewAt=(this.viewAt+1)%this.views.length,this.goTo(this.views[this.viewAt],.9))}toOverview(){this.views.length&&(this.viewAt=this.views.length-1,this.goTo(this.views[this.viewAt],.9))}goTo(t,e=1.4){this.titleSpin=!1;const n=this.camera,s=this.controls,r=this.fit(t);s.maxDistance=Math.max(ho,t.max??ho);const o=n.position.clone(),a=s.target.clone(),l=wu(r.pos),c=wu(r.target);Ae(e,h=>{this.viewShift=1-h,n.position.lerpVectors(o,l,h),s.target.lerpVectors(a,c,h)},Sl)}toTitle(){this.views=[],this.titleSpin=!0,this.controls.maxDistance=ho,this.titleAngle-=_e.time*Ke.title.orbit.speed,this.viewShift=1}focus(t,e,{stage:n,active:s,localSeats:r}){if(!kb({follow:this.follow,stage:n,active:s,localSeats:r}))return;const o=this.camera,a=this.controls,l=a.target.clone();if(Math.hypot(t-l.x,e-l.z)<6)return;const h=o.position.clone().sub(l),u=new C(pn(l.x,t,.6),0,pn(l.z,e,.6)),d=this.focusTween={};Ae(.9,f=>{this.focusTween===d&&(a.target.lerpVectors(l,u,f),o.position.copy(a.target).add(h))},Sl)}panKeys(t){const e=this.camera,n=this.controls,s=this.keys,r=new C,o=new C().subVectors(n.target,e.position).setY(0).normalize(),a=new C(-o.z,0,o.x);(s.has("w")||s.has("arrowup"))&&r.add(o),(s.has("s")||s.has("arrowdown"))&&r.sub(o),(s.has("d")||s.has("arrowright"))&&r.add(a),(s.has("a")||s.has("arrowleft"))&&r.sub(a),r.lengthSq()&&(r.normalize().multiplyScalar(t*18),n.target.add(r),e.position.add(r))}update(t){var s;const e=this.camera;if(this.titleSpin){const r=zb(Ke.title.orbit,_e.time,this.titleAngle);e.position.set(...r.pos),this.controls.target.set(...r.target)}const n=innerWidth>900?this.viewShift:0;n>.001?e.setViewOffset(innerWidth,innerHeight,-innerWidth*.21*n,0,innerWidth,innerHeight):(s=e.view)!=null&&s.enabled&&e.clearViewOffset(),this.panKeys(t),this.controls.update()}render(t,e,n,s=!0){const r=this.camera,o=new C((Math.random()-.5)*n,(Math.random()-.5)*n,(Math.random()-.5)*n);r.position.add(o),s&&t.render(e,r),r.position.sub(o)}}function Wb(i,t,e){const n=document.createElement("canvas");n.width=2048,n.height=Math.round(2048*t/i);const s=n.getContext("2d");s.fillStyle="#5b7a36",s.fillRect(0,0,n.width,n.height);const r=(a,l,c,h,u)=>{for(let d=0;d<l;d++)s.globalAlpha=u*(.4+Math.random()*.6),s.fillStyle=a[Math.random()*a.length|0],s.beginPath(),s.ellipse(Math.random()*n.width,Math.random()*n.height,c+Math.random()*(h-c),c+Math.random()*(h-c),Math.random()*3,0,Math.PI*2),s.fill()};r(["#6a8a40","#4f6c2c","#729347","#55742f","#7f964c"],700,20,90,.35),r(["#7d6b45","#6e5d3a","#8a7650"],40,30,110,.22),r(["#8fa65a","#a4b46a"],300,4,14,.4);for(let a=0;a<14e3;a++)s.globalAlpha=.35,s.fillStyle=Math.random()<.5?"#3f5a24":"#8fae5a",s.fillRect(Math.random()*n.width,Math.random()*n.height,2,4+Math.random()*4);s.globalAlpha=1;const o=new Bl(n);return o.colorSpace=we,o.anisotropy=e.capabilities.getMaxAnisotropy(),o}function Gb(){const i=document.createElement("canvas");i.width=i.height=512;const t=i.getContext("2d");t.fillStyle="#4a3020",t.fillRect(0,0,512,512);for(let n=0;n<260;n++){t.strokeStyle=Math.random()<.5?"rgba(30,18,10,0.35)":"rgba(110,70,40,0.25)",t.lineWidth=1+Math.random()*3;const s=Math.random()*512;t.beginPath(),t.moveTo(0,s);for(let r=0;r<=512;r+=32)t.lineTo(r,s+Math.sin(r*.02+n)*4);t.stroke()}const e=new Bl(i);return e.colorSpace=we,e.wrapS=e.wrapT=wo,e.repeat.set(6,6),e}class $b{constructor(t,e,{W:n,H:s,deploy:r,edges:o}){this.W=n,this.H=s;const a=new Mn({map:Wb(n,s,e),roughness:.95}),l=this.board=new Gt(new fi(n,s).rotateX(-Math.PI/2),a);l.receiveShadow=!0,t.add(l);const c=new Gt(new fi(220,220).rotateX(-Math.PI/2),new Mn({map:Gb(),roughness:.7}));c.position.y=-.62,c.receiveShadow=!0,t.add(c);{const h=new Mn({color:"#5a3a22",roughness:.6}),u=[[n+1.6,.8,.8,0,-s/2-.4],[n+1.6,.8,.8,0,s/2+.4],[.8,.8,s,-n/2-.4,0],[.8,.8,s,n/2+.4,0]];for(const[f,g,v,m,p]of u){const _=new Gt(new Ln(f,g,v),h);_.position.set(m,-.22,p),_.castShadow=_.receiveShadow=!0,t.add(_)}const d=new Gt(new Ln(n,.6,s),h);d.position.y=-.31,t.add(d)}this.zoneMats=[],this.zoneLineMats=[];for(const h of[0,1]){const u=o[h],d=new We({transparent:!0,opacity:.07,depthWrite:!1});this.zoneMats.push(d);const f=new Gt(new fi(r,s).rotateX(-Math.PI/2),d);f.position.set(u*(n/2-r/2),.008,0),f.renderOrder=1,t.add(f);const g=[];for(let m=-s/2;m<s/2;m+=1)g.push(new C(u*(n/2-r),.02,m),new C(u*(n/2-r),.02,m+.5));const v=new Fo({transparent:!0,opacity:.5});this.zoneLineMats.push(v),t.add(new s_(new de().setFromPoints(g),v))}this.tufts=new or(new Dn(.035,.13,3),new Mn({color:"#ffffff",roughness:1}),700),this.flowers=new or(new In(.05,0),new Mn({roughness:.6}),140),t.add(this.tufts,this.flowers)}paint(t){for(const e of[0,1])this.zoneMats[e].color.set(t[e]),this.zoneLineMats[e].color.set(t[e])}zones(t){for(const e of[0,1])this.zoneMats[e].opacity=t[e]}scatterTufts(){const{W:t,H:e,tufts:n,flowers:s}=this,r=new re,o=new Pn,a=new Bs,l=new qt;for(let h=0;h<n.count;h++){const u=(Math.random()-.5)*(t-.4),d=(Math.random()-.5)*(e-.4),f=.6+Math.random()*1.2;o.setFromEuler(a.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5)),r.compose(new C(u,.08*f,d),o,new C(f,f,f)),n.setMatrixAt(h,r),n.setColorAt(h,l.set(["#9cba5a","#a8c464","#b4c86e","#8fae50"][h%4]))}const c=["#f4f0e0","#f2d14a","#d77ad0","#e8e8ff"];for(let h=0;h<s.count;h++){const u=(Math.random()-.5)*(t-.4),d=(Math.random()-.5)*(e-.4);r.compose(new C(u,.08,d),o.identity(),new C(1,.6,1)),s.setMatrixAt(h,r),s.setColorAt(h,l.set(c[h%c.length]))}n.instanceMatrix.needsUpdate=s.instanceMatrix.needsUpdate=!0,n.instanceColor.needsUpdate=s.instanceColor.needsUpdate=!0}}const ja=new Map;function yt(i,t={}){const e=i+JSON.stringify(t);return ja.has(e)||ja.set(e,new Mn({color:i,roughness:.72,flatShading:!0,...t})),ja.get(e)}const Ii=i=>yt(i,{emissive:i,emissiveIntensity:1.6,roughness:.3}),Be=i=>yt(i,{metalness:.65,roughness:.35}),ht={ico:new In(1,1),ico0:new In(1,0),sph:new ln(1,10,8),box:new Ln(1,1,1),cyl:new Qe(1,1,1,10),cone:new Dn(1,1,8),cap:new ln(1,12,6,0,Math.PI*2,0,Math.PI/2),brim:new Vi(1,12).rotateX(Math.PI/2),oct:new Bo(1,0)};function rt(i,t,e=0,n=0,s=0,r=1,o=r,a=r){const l=new Gt(i,t);return l.position.set(e,n,s),l.scale.set(r,o,a),l.castShadow=!0,l}function Ti(i,t,e,n){const s=new C(...i),r=new C(...t),o=rt(ht.cyl,n);return o.position.copy(s).add(r).multiplyScalar(.5),o.scale.set(e,s.distanceTo(r),e),o.quaternion.setFromUnitVectors(new C(0,1,0),r.clone().sub(s).normalize()),o}function jb(i,t){const e=new Vt,n=rt(new Qe(i,i*1.05,.09,28),yt("#262422"),0,.045,0);n.receiveShadow=!0;const s=rt(new Qe(i*.96,i*.96,.012,28),yt("#4c5e2c",{flatShading:!1}),0,.094,0);s.receiveShadow=!0;const r=rt(new Sn(i*1.02,.028,4,32).rotateX(Math.PI/2),yt(t,{emissive:t,emissiveIntensity:.35}),0,.07,0);e.add(n,s,r);for(let o=0;o<Math.round(i*9);o++){const a=Math.random()*6,l=Math.sqrt(Math.random())*i*.85;e.add(rt(ht.cone,yt("#6a8a3a"),Math.cos(a)*l,.13,Math.sin(a)*l,.035,.08,.035))}return e}function Xb(i,t,e,n,s=8,r=40){const o=new Wl(i.map(p=>new C(...p))),a=o.computeFrenetFrames(r,!1),l=[],c=[];for(let p=0;p<=r;p++){const _=p/r,x=o.getPointAt(_),y=t+(e-t)*Math.pow(_,.6),R=a.normals[p],S=a.binormals[p];for(let E=0;E<=s;E++){const O=E/s*Math.PI*2,b=Math.cos(O),w=Math.sin(O);l.push(x.x+y*(b*R.x+w*S.x),x.y+y*(b*R.y+w*S.y),x.z+y*(b*R.z+w*S.z))}}for(let p=0;p<r;p++)for(let _=0;_<s;_++){const x=p*(s+1)+_,y=x+s+1;c.push(x,x+1,y,y,x+1,y+1)}const h=o.getPointAt(0),u=l.length/3;l.push(h.x,h.y,h.z);for(let p=0;p<s;p++)c.push(u,p+1,p);const d=o.getPointAt(1),f=l.length/3;l.push(d.x,d.y,d.z);const g=r*(s+1);for(let p=0;p<s;p++)c.push(f,g+p,g+p+1);const v=new de;v.setAttribute("position",new ie(l,3)),v.setIndex(c),v.computeVertexNormals();const m=new Gt(v,n);return m.castShadow=!0,m}const ir=()=>yt("#7a5232");function qb(i=1.1,t="#c9a24a"){const e=new Vt;return e.add(rt(ht.cyl,ir(),0,0,0,.022,i,.022)),e.add(rt(ht.cone,Be(t),0,i/2+.07,0,.04,.14,.04)),e}function Ad(i,t,e){const n=new Vt,s=rt(ht.cyl,t,0,0,0,i,.04,i);return s.rotation.x=Math.PI/2,n.add(s),n.add(rt(ht.sph,e,0,0,.03,i*.25,i*.25,i*.15)),n}const sr=(i,t)=>{const e=new qt(i),n={};return e.getHSL(n),e.setHSL(n.h,n.s,Math.max(0,Math.min(1,n.l+t))),"#"+e.getHexString()};function $n(i,t,e=.9){i.userData.hand.add(t),t.rotation.x=e}function Rd(i,t,e,n){const s=new Vt,r=rt(ht.cyl,yt("#5a3a22"),0,0,0,i,.1,i);r.rotation.z=Math.PI/2;const o=rt(ht.cyl,Be("#444"),0,0,0,i*.3,.13,i*.3);return o.rotation.z=Math.PI/2,s.add(r,o),s.position.set(t,e,n),s}class Yb{constructor(t,e,n,s){this.colorOf=s,this.items=e.map((r,o)=>{const a=new Vt;a.position.set(r.x,0,r.z);const l=new Gt(new Qe(.55,.65,.16,8),yt("#8a8478"));l.position.y=.08,l.castShadow=l.receiveShadow=!0;const c=new Gt(new Bo(.2,0),new Mn({color:"#fff3c0",emissive:"#ffd060",emissiveIntensity:.8,flatShading:!0}));c.position.y=.42;const h=new Gt(new Qe(.03,.03,2.1,6),yt("#5a3d24"));h.position.set(.35,1.1,0),h.castShadow=!0;const u=new Mn({color:"#e8e0d0",side:an,roughness:.8}),d=new Gt(new fi(.8,.5,6,1).translate(.4,0,0),u);d.position.set(.35,1.85,0),d.castShadow=!0;const f=new Gt(new Wi(n-.06,n,64).rotateX(-Math.PI/2),new We({color:"#fff3c0",transparent:!0,opacity:.35,depthWrite:!1}));return f.position.y=.03,a.add(l,c,h,d,f),t.add(a),{i:o,g:a,gem:c,flag:d,flagMat:u,ring:f,owner:-1}})}paint(t,e){t.owner=e,t.flagMat.color.set(e<0?"#e8e0d0":this.colorOf(e)),t.ring.material.color.set(e<0?"#fff3c0":this.colorOf(e))}reset(){for(const t of this.items)this.paint(t,-1)}animate(t,e,n){for(const s of this.items){const r=n[s.i];r!==s.owner&&this.paint(s,r),s.gem.rotation.y=e*1.2,s.gem.position.y=.45+Math.sin(e*2+s.i)*.05,s.flag.rotation.y=Math.sin(e*2.2+s.i)*.25,s.ring.material.opacity=.3+Math.sin(e*2+s.i)*.08}}}let Ge=null,As=null,jn=!1;try{jn=localStorage.getItem("tails-and-scales:muted")==="1"}catch{}function Ui(){if(!Ge)try{Ge=new(window.AudioContext||window.webkitAudioContext),As=Ge.createGain(),As.gain.value=jn?0:.5,As.connect(Ge.destination)}catch{Ge=null}}function Kb(){jn=!jn;try{localStorage.setItem("tails-and-scales:muted",jn?"1":"0")}catch{}return As&&(As.gain.value=jn?0:.5),jn}const Jb=()=>jn;function Zb(i){const t=Math.floor(Ge.sampleRate*i),e=Ge.createBuffer(1,t,Ge.sampleRate),n=e.getChannelData(0);for(let r=0;r<t;r++)n[r]=Math.random()*2-1;const s=Ge.createBufferSource();return s.buffer=e,s}function Cd(i,t,e,n,s){const r=Ge.createGain();return r.gain.setValueAtTime(1e-4,t),r.gain.exponentialRampToValueAtTime(n,t+e),r.gain.exponentialRampToValueAtTime(1e-4,t+s),i.connect(r),r.connect(As),r}function xs({dur:i=.3,freq:t=800,type:e="lowpass",peak:n=.5,delay:s=0,q:r=1}){const o=Ge.currentTime+s,a=Zb(i),l=Ge.createBiquadFilter();l.type=e,l.frequency.value=t,l.Q.value=r,a.connect(l),Cd(l,o,.005,n,i),a.start(o)}function Ai({f0:i=440,f1:t=i,dur:e=.15,type:n="sine",peak:s=.2,delay:r=0}){const o=Ge.currentTime+r,a=Ge.createOscillator();a.type=n,a.frequency.setValueAtTime(i,o),a.frequency.exponentialRampToValueAtTime(Math.max(20,t),o+e),Cd(a,o,.01,s,e),a.start(o),a.stop(o+e+.05)}const Eu={squeak(){Ai({f0:1400,f1:2400,dur:.12,type:"sine",peak:.12})},hiss(){xs({dur:.35,freq:5e3,type:"highpass",peak:.18})}},Qb={voice(i){Object.hasOwn(Eu,i)&&Eu[i]()},dice(i=3){for(let t=0;t<Math.min(6,i);t++)xs({dur:.04,freq:2500+Math.random()*2e3,type:"bandpass",q:4,peak:.35,delay:t*.035+Math.random()*.02})},boom(i=1){xs({dur:.5+i*.5,freq:300+200/i,peak:.8}),Ai({f0:90,f1:30,dur:.5+i*.3,type:"sine",peak:.5})},shot(){Ai({f0:900,f1:300,dur:.08,type:"triangle",peak:.12})},thwack(){xs({dur:.07,freq:1400,type:"bandpass",q:2,peak:.4})},crumble(){xs({dur:.8,freq:500,peak:.45});for(let i=0;i<4;i++)xs({dur:.05,freq:1200,type:"bandpass",peak:.25,delay:.1+i*.09})},magic(){for(let i=0;i<4;i++)Ai({f0:500+i*220,f1:900+i*300,dur:.25,type:"sine",peak:.08,delay:i*.06})},fizzle(){Ai({f0:600,f1:120,dur:.35,type:"sawtooth",peak:.06})},fanfare(){[523,659,784,1046].forEach((i,t)=>Ai({f0:i,dur:.3,type:"triangle",peak:.15,delay:t*.14}))},click(){Ai({f0:1200,f1:900,dur:.04,type:"square",peak:.04})}},ge=new Proxy(Qb,{get(i,t){return(...e)=>{if(!(!Ge||jn))try{i[t](...e)}catch{}}}}),Pi=new Ln(1,1,1),Pd=new Qe(.5,.5,1,8).rotateZ(Math.PI/2),Xa=new Map;function ue(i,t={}){const e=i+JSON.stringify(t);return Xa.has(e)||Xa.set(e,new Mn({color:i,roughness:.9,flatShading:!0,...t})),Xa.get(e)}function fe(i,t,{shadow:e=!0}={}){const n=new Gt(i,t);return n.castShadow=e,n.receiveShadow=!0,n}const qa={box:i=>Tu(i,Pi),log:i=>Tu(i,Pd),cap(i){const{look:t,shape:e}=i,n=fe(new Dn(t.r,t.h,4).rotateY(Math.PI/4),ue(t.color));return n.position.set(e.x,e.y,e.z),n.rotation.y=t.yaw,{obj:n}},tree(i){const{look:t,shape:e}=i,{h:n,r:s}=t.trunk,r=new Vt;r.position.set(e.x,0,e.z);const o=fe(new Qe(s*.75,s,n,7).translate(0,n/2,0),ue(t.bark));r.add(o);const a=new Vt;r.add(a);for(const l of t.canopy)if(l.cone){const c=fe(new Dn(l.r,l.h,8),ue(l.color));c.position.y=l.y,c.rotation.y=l.yaw,a.add(c)}else{const c=fe(new In(l.r,1),ue(l.color));c.position.set(...l.pos),c.scale.y=.8,a.add(c)}return r.rotation.y=t.yaw,{obj:r,canopy:a}},hedge(i){const{look:t,shape:e}=i,n=new Vt;n.position.set(e.x,0,e.z),n.rotation.y=t.yaw;const s=fe(Pi,ue(t.color));s.scale.set(1.15,.62,.55),s.position.y=.31,n.add(s);for(const r of t.tufts){const o=fe(new In(.3,0),ue(r.color));o.position.set(...r.pos),n.add(o)}for(const r of t.berries){const o=fe(new ln(.05,5,4),ue("#c0302a"),{shadow:!1});o.position.set(...r),n.add(o)}return{obj:n}},boulder(i){const{look:t,shape:e}=i,n=fe(new Po(t.size,0),ue(t.color));if(n.scale.set(...t.scale),n.rotation.set(...t.rot),n.position.set(e.x,t.y,e.z),t.moss){const s=fe(new Po(t.size*.55,0),ue("#5d7a3a"),{shadow:!1});s.position.set(0,t.size*.55,0),s.scale.set(1.1,.4,1.1),n.add(s)}return{obj:n}},crate(i){const{look:t}=i,e=new Vt,n=t.s,s=fe(Pi,ue(t.color));s.scale.setScalar(n),s.position.y=n/2;const r=fe(Pi,ue("#5f3e24"));if(r.scale.set(n*1.02,n*.14,n*1.02),r.position.y=n/2,e.add(s,r),t.stacked){const o=fe(Pi,ue("#9a7048"));o.scale.setScalar(n*.7),o.position.set(0,n+n*.35,0),o.rotation.y=.5,e.add(o)}return Ya(i,e)},barrel(i){const t=new Vt,e=fe(new Qe(.28,.24,.75,10),ue(i.look.color));e.position.y=.375;const n=fe(new Sn(.29,.025,4,14).rotateX(Math.PI/2),ue("#3a3a3a",{metalness:.4}));return n.position.y=.55,t.add(e,n),Ya(i,t)},sack(i){const t=new Vt,e=fe(new ln(.34,9,7),ue("#c2a77a"));e.scale.set(1,1.15,.9),e.position.y=.36,t.add(e);for(const[n,s]of i.look.acorns){const r=fe(new ln(.08,6,5),ue("#8a5a2a"));r.position.set(n,.72,s),t.add(r)}return Ya(i,t)},mushroom(i){const{look:t,shape:e}=i,{h:n,r:s,sr:r}=t,o=new Vt;o.position.set(e.x,0,e.z);const a=fe(new Qe(r*.8,r*1.2,n,8).translate(0,n/2,0),ue("#efe6d0")),l=fe(new ln(s,14,8,0,Math.PI*2,0,Math.PI/2),ue(t.cap));l.position.y=n-.05,l.scale.y=.7;const c=fe(new Vi(s,14).rotateX(Math.PI/2),ue("#e9dcc0"));c.position.y=n-.05,o.add(a,l,c);for(const[h,u]of t.dots){const d=fe(new ln(s*.12,5,4),ue("#fff6e0"),{shadow:!1});d.position.set(Math.cos(h)*Math.sin(u)*s,n-.05+Math.cos(u)*s*.7,Math.sin(h)*Math.sin(u)*s),o.add(d)}return o.rotation.z=t.tilt,{obj:o}},floor(i){const{look:t,shape:e}=i,n=new Vi(t.r,t.segments),s=n.attributes.position;if(t.rim.length!==s.count-1)throw new Error(`a forest floor of ${s.count} vertices with ${t.rim.length} rim draws`);for(let o=1;o<s.count;o++){const a=t.rim[o-1];s.setXY(o,s.getX(o)*a,s.getY(o)*a)}n.rotateX(-Math.PI/2);const r=fe(n,ue(t.color,{flatShading:!1}),{shadow:!1});return r.position.set(e.x,.012,e.z),{obj:r}},rubble(i){const t=new Vt;return t.position.set(i.shape.x,0,i.shape.z),{obj:t,pieces:0}}};function Tu(i,t){const{look:e,shape:n}=i,s=fe(t,ue(e.color));return s.scale.set(...e.scale),s.position.set(n.x,n.y,n.z),s.rotation.y=e.yaw,{obj:s}}function Ya(i,t){return t.position.set(i.shape.x,0,i.shape.z),t.rotation.y=i.look.yaw,{obj:t}}class Ld{constructor(t,e){this.scene=t,this.effects=e,this.group=new Vt,t.add(this.group),this.items=new Map,this.spares=new Map}object(t){var e;return(e=this.items.get(t))==null?void 0:e.obj}apply(t,e){switch(t.t){case"terrain.clear":return this.clear();case"terrain.add":return this.add(t.def);case"terrain.hurt":return this.hurt(this.items.get(t.id).c,t.from,t.at);case"terrain.destroy":return this.destroy(this.items.get(t.id).c,t.from,t.at);case"terrain.collapse":return this.collapse(t.drops,t.by,e);case"terrain.rubble":return this.rubble(this.items.get(t.id).c,t.from)}throw new Error(`TerrainView: no handler for ${t.t}`)}clear(){this.freeSpares(),this.scene.remove(this.group),this.group=new Vt,this.scene.add(this.group),this.spares=this.items,this.items=new Map}add(t){const e=this.spares.get(t.id);if(e!=null&&e.obj&&!e.touched&&!e.shared&&Ru(e.c,t,!0)){this.spares.delete(t.id),this.items.set(t.id,{...e,c:t}),this.group.add(e.obj);return}if(t.look.piece==="fallen")return this.fell(t);const n={c:t,...qa[t.look.piece](t)};this.items.set(t.id,n),this.group.add(n.obj)}dispose(){this.freeSpares();for(const t of this.items.values())this.free(t);this.items.clear(),this.scene.remove(this.group),this.group=new Vt,this.scene.add(this.group)}sync(t){var n;this.freeSpares();const e=new Map(t.map(s=>[s.id,s]));for(const[s,r]of[...this.items]){const o=e.get(s);o&&Ru(r.c,o,!1)&&(o.alive?this.shows(r):!this.shows(r))||(this.free(r),this.items.delete(s))}for(const s of t){const r=this.items.get(s.id);if(r){s.alive&&tM.has(s.look.piece)&&(r.fall=null,r.obj.position.y=s.shape.y,r.c=nr(s));continue}if(!s.alive){this.items.has(s.id)||this.items.set(s.id,{c:nr(s),obj:null});continue}if(s.look.piece==="fallen"){this.fallen(nr(s),e.get(s.look.tree));continue}const o=nr(s),a={c:o,...qa[s.look.piece](o)};if(this.items.set(s.id,a),this.group.add(a.obj),s.kind==="rubble")for(const l of t)l.kind==="block"&&!l.alive&&((n=l.col)==null?void 0:n.rubble)===s&&this.rubble(o,null)}}shows(t){var e;return!t.obj||t.obj.parent!==this.group?!1:t.c.kind==="tree"?((e=t.canopy)==null?void 0:e.parent)===t.obj:!0}state(t){const e=this.items.get(t),n=!!e&&this.shows(e);if(!n)return{shown:n};const s=e.obj;return{shown:n,x:s.position.x,y:s.position.y,z:s.position.z,q:s.quaternion.toArray()}}free(t){t.canopy&&t.canopy.parent!==t.obj&&Au(t.canopy),t.canopy=null,!(!t.obj||t.shared)&&(t.obj.parent&&t.obj.parent.remove(t.obj),Au(t.obj),t.ownMat&&t.obj.material.dispose(),t.obj=null)}freeSpares(){for(const t of this.spares.values())this.free(t);this.spares.clear()}hurt(t,e,n){const s=this.items.get(t.id),r=s.obj;s.touched=!0,r.isMesh&&(s.ownMat||(r.material=r.material.clone(),s.ownMat=!0),r.material.color.multiplyScalar(.8));const o=r.position.clone();Ae(.25,a=>{const l=(1-a)*.06;r.position.x=o.x+(Math.random()-.5)*l,r.position.z=o.z+(Math.random()-.5)*l}).then(()=>{r.position.x=o.x,r.position.z=o.z}),this.effects.debris(n.x,n.y,n.z,[t.look.chip||"#888","#666"],3,{from:e,power:3,size:.08})}destroy(t,e,n){const s=this.items.get(t.id);s.touched=!0;const r=n,o=this.effects;switch(t.kind){case"block":{this.group.remove(s.obj),o.debris(r.x,r.y,r.z,[t.look.chip,t.look.chip,"#5a5650"],12,{from:e,power:6}),o.smoke({x:r.x,y:r.y,z:r.z,size:.4,color:"#a09a8a",life:1.5});break}case"tree":{for(const a of s.canopy.children){const l=new C;a.getWorldPosition(l),o.leaves(l.x,l.y,l.z,t.look.leaves,14,1)}s.obj.remove(s.canopy);break}case"hedge":case"mushroom":if(this.group.remove(s.obj),o.leaves(r.x,r.y,r.z,t.look.leaves,t.kind==="hedge"?22:28,t.kind==="hedge"?.8:1.4),t.kind==="mushroom")for(let a=0;a<16;a++)o.mote({x:r.x,y:r.y*1.5,z:r.z,vx:(Math.random()-.5)*3,vy:Math.random()*2,vz:(Math.random()-.5)*3,size:.05,color:"#f0e0ff",life:2.5,drag:1});break;case"crate":case"log":this.group.remove(s.obj),o.debris(r.x,r.y,r.z,ry,14,{from:e,power:6,size:.12});break}t.kind==="block"?ge.crumble():ge.thwack()}collapse(t,e,n){for(const{id:s,dy:r}of t){const o=this.items.get(s),{c:a,obj:l}=o;o.touched=!0;const c=n.chunks[s].y,h=l.position.y,u=c,d=o.fall={};Ae(.18+r*.15,f=>o.fall===d&&(l.position.y=h+(u-h)*f),Rb).then(()=>{this.effects.debris(a.shape.x,c-e/2,a.shape.z,["#8a8478"],3,{power:2,size:.07})})}}rubble(t,e){const n=this.items.get(t.id),s=n.obj;n.touched=!0;const r=Kf[t.look.style],o=4+Math.floor(Math.random()*3);for(let a=0;a<o;a++){const l=fe(Pi,ue(Eb(r.colors))),c=.18+Math.random()*.22;l.scale.set(c*(r.look==="log"?2.4:1.2),c*.7,c);const h=Math.random()*6,u=Math.random()*.6,d=e?t.shape.x-e.x:0,f=e?t.shape.z-e.z:0,g=Math.hypot(d,f)||1;l.position.set(Math.cos(h)*u+d/g*.25,c*.3+Math.min(.2,n.pieces*.012),Math.sin(h)*u+f/g*.25),l.rotation.set(Math.random(),Math.random()*6,Math.random()),s.add(l)}n.pieces+=o}fell(t){const e=this.items.get(t.look.tree),n=e.c,s=n.shape,r=n.look.trunk,{dx:o,dz:a}=t.look,l=e.obj,c=l.quaternion.clone(),h=Cu(l,c,t.look,r);Ae(.9,h,Tb).then(()=>{this.effects.debris(s.x+o*r.h,.2,s.z+a*r.h,["#6b4a2e","#4f8a34"],8,{power:3,size:.1}),this.effects.shake=Math.max(this.effects.shake,.05)}),e.shared=!0,this.items.set(t.id,{c:t,obj:l,touched:!0}),this.group.add(l)}fallen(t,e){const n=nr(e),{obj:s,canopy:r}=qa.tree(n);s.remove(r),Cu(s,s.quaternion.clone(),t.look,n.look.trunk)(1),this.items.set(n.id,{c:n,obj:s,canopy:r,shared:!0}),this.items.set(t.id,{c:t,obj:s,touched:!0}),this.group.add(s)}}function Au(i){i.traverse(t=>{t.geometry&&t.geometry!==Pi&&t.geometry!==Pd&&t.geometry.dispose()})}const tM=new Set(["box","log","cap"]),nr=i=>({id:i.id,kind:i.kind,shape:{...i.shape},look:i.look});function Ru(i,t,e){const n=s=>JSON.stringify({id:s.id,kind:s.kind,look:s.look,shape:e?s.shape:{...s.shape,y:0}});return n(i)===n(t)}function Cu(i,t,{dx:e,dz:n},s){const r=new C(n,0,-e).normalize(),o=new Pn;return a=>{o.setFromAxisAngle(r,(Math.PI/2-.12)*a),i.quaternion.copy(t).premultiply(o),i.position.y=Math.sin(a*Math.PI)*.05+s.r*a}}function eM(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new de;let c=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=Pu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);const g=Pu(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function Pu(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const o=new t(r);let a=0;for(let c=0;c<i.length;++c)o.set(i[c].array,a),a+=i[c].array.length;const l=new cn(o,e,n);return s!==void 0&&(l.gpuType=s),l}function nM(i){for(const t of["position","normal"]){const e=i.getAttribute(t);for(let n=0;n<e.count;n+=3){const s=e.getX(n+1),r=e.getY(n+1),o=e.getZ(n+1);e.setXYZ(n+1,e.getX(n+2),e.getY(n+2),e.getZ(n+2)),e.setXYZ(n+2,s,r,o)}}}const Ka=new Map;function iM(i){return[i.metalness,i.roughness,i.emissiveIntensity>0?i.emissive.getHex():0,i.emissiveIntensity,i.transparent,i.opacity,i.side,i.flatShading].join("|")}function El(i){i.updateMatrixWorld(!0);const t=new re().copy(i.matrixWorld).invert(),e=new re,n=new Map,s=[],r=o=>{for(const a of o.children){if(a.userData.keep){El(a);continue}if(a.isMesh){const l=a.material,c=iM(l);n.has(c)||n.set(c,{m:l,geos:[]});const h=a.geometry.index?a.geometry.toNonIndexed():a.geometry,u=new de;u.setAttribute("position",h.getAttribute("position").clone()),u.setAttribute("normal",h.getAttribute("normal").clone()),u.applyMatrix4(e.multiplyMatrices(t,a.matrixWorld)),e.determinant()<0&&nM(u);const d=u.getAttribute("position").count,f=new Float32Array(d*3);for(let g=0;g<d;g++)f.set([l.color.r,l.color.g,l.color.b],g*3);u.setAttribute("color",new cn(f,3)),n.get(c).geos.push(u),s.push(a)}r(a)}};r(i);for(const o of s)o.parent.remove(o);for(const[o,{m:a,geos:l}]of n)Ka.has(o)||Ka.set(o,new Mn({vertexColors:!0,metalness:a.metalness,roughness:a.roughness,flatShading:a.flatShading,emissive:a.emissive,emissiveIntensity:a.emissiveIntensity,transparent:a.transparent,opacity:a.opacity,side:a.side})),i.add(new Gt(eM(l),Ka.get(o)))}function ms({fur:i="#c96a2d",belly:t="#f1dcb5",hat:e="acorn",hatColor:n="#6e4a2a",tailUp:s=1}={}){const r=new Vt,o=new Vt;r.add(o);const a=yt(i),l=yt(t),c=yt("#1b1410");for(const p of[-1,1])o.add(rt(ht.ico,a,p*.1,.05,.07,.08,.045,.13)),o.add(rt(ht.ico,a,p*.12,.17,-.02,.14));o.add(rt(ht.ico,a,0,.38,0,.21,.28,.19)),o.add(rt(ht.ico,l,0,.36,.1,.14,.2,.09));const h=new Vt;h.position.set(0,.72,.05),o.add(h),h.add(rt(ht.ico,a,0,0,0,.17)),h.add(rt(ht.ico,l,0,-.05,.12,.09,.075,.08)),h.add(rt(ht.sph,c,0,-.02,.2,.028));for(const p of[-1,1]){h.add(rt(ht.sph,c,p*.075,.04,.13,.034)),h.add(rt(ht.sph,yt("#ffffff"),p*.068,.055,.155,.01));const _=rt(ht.cone,a,p*.09,.16,-.02,.05,.13,.04);_.rotation.z=-p*.25,h.add(_);const x=rt(ht.cone,yt(sr(i,-.25)),p*.1,.25,-.02,.025,.07,.02);x.rotation.z=-p*.3,h.add(x)}e==="acorn"&&(h.add(rt(ht.cap,yt(n),0,.07,0,.19,.13,.19)),h.add(rt(ht.brim,yt(n),0,.07,0,.19,1,.19)),h.add(rt(ht.cyl,yt(sr(n,-.2)),0,.22,0,.02,.06,.02)));const u=new Vt;u.position.set(0,.22,-.18),o.add(u);const d=new Wl([[0,0,0],[0,.2,-.26],[0,.55*s,-.32],[0,.82*s,-.22],[0,.93*s,-.02]].map(p=>new C(...p))),f=yt(sr(i,.08)),g=yt(sr(i,.2)),v=12;for(let p=0;p<v;p++){const _=p/(v-1),x=.085+Math.sin(Math.min(1,_*1.15)*Math.PI)*.11,y=d.getPointAt(_);u.add(rt(ht.ico,_>.75?g:f,y.x,y.y,y.z,x,x*1.1,x))}const m=[];for(const p of[-1,1]){const _=new Vt;_.position.set(p*.17,.52,.04),_.add(rt(ht.ico,a,0,-.1,0,.05,.12,.05));const x=new Vt;x.position.set(0,-.21,0),x.add(rt(ht.ico,a,0,0,0,.045)),_.add(x),_.userData.hand=x,_.rotation.x=-.9,o.add(_),m.push(_)}return r.userData.anim={kind:"squirrel",body:o,tail:u,head:h,armL:m[0],armR:m[1]},r}const Dd={nutkin(){const i=ms({fur:"#cf6d2a",hatColor:"#6a4a26"}),t=i.userData.anim,e=rt(ht.cone,yt("#5f8f2e"),0,.45,-.06,.25,.42,.2);e.rotation.x=.15,t.body.add(e);const n=new Vt;return n.add(Ti([0,-.08,0],[0,.04,0],.018,ir())),n.add(Ti([0,.04,0],[-.05,.13,0],.014,ir())),n.add(Ti([0,.04,0],[.05,.13,0],.014,ir())),$n(t.armR,n,1.4),t.armR.rotation.x=-1.3,i},grenadier(){const i=ms({fur:"#a9552a",hatColor:"#4f3a22"}),t=i.userData.anim,e=rt(new Sn(.21,.025,4,16),yt("#4a3020"),0,.4,.02);e.rotation.set(.1,0,.75),e.scale.z=.8,t.body.add(e);for(let s=0;s<4;s++){const r=-.7+s*.45;t.body.add(rt(ht.sph,yt("#8a5a2a"),Math.sin(r)*.21*.7,.4+Math.cos(r)*.21*.7,.17,.045,.055,.045))}for(const s of[-1,1])t.head.add(rt(new Sn(.04,.012,4,10),Be("#c9a24a"),s*.07,.07,.14));const n=new Vt;return n.add(rt(ht.sph,yt("#8a5a2a"),0,0,0,.06,.07,.06)),n.add(rt(ht.cap,yt("#4f3a22"),0,.03,0,.065,.04,.065)),n.add(rt(ht.brim,yt("#4f3a22"),0,.03,0,.065,1,.065)),n.add(rt(ht.sph,Ii("#ffb030"),0,.1,0,.022)),$n(t.armR,n,0),t.armR.rotation.x=2.3,i},oakguard(){const i=ms({fur:"#8a5a35",hatColor:"#5a3c22"}),t=i.userData.anim;t.body.add(rt(ht.ico,yt("#5b4330"),0,.42,.05,.2,.22,.16));const e=rt(ht.cone,yt("#c0302a"),0,.3,-.05,.03,.18,.08);e.rotation.x=-.5,t.head.add(e);const n=Ad(.22,yt("#6b4a2e"),yt("#3e7a2a"));$n(t.armL,n,.9),n.position.set(-.02,0,.08),t.armL.rotation.set(-.6,0,.3);const s=new Vt;return s.add(rt(ht.cyl,ir(),0,.2,0,.022,1.15,.022)),s.add(rt(ht.box,Be("#a8b0b8"),.07,.62,0,.12,.16,.02)),s.add(rt(ht.cone,yt("#6b4a26"),0,.85,0,.06,.18,.06)),$n(t.armR,s,.9),i},glider(){const i=ms({fur:"#9a8a78",belly:"#efe5d5",hat:"none",tailUp:.25}),t=i.userData.anim;for(const n of[-1,1])t.head.add(rt(new Sn(.045,.015,4,10),Be("#c9a24a"),n*.07,.07,.14));t.head.add(rt(ht.cap,yt("#6b4a2e"),0,.06,-.01,.18,.11,.18)),t.head.add(rt(ht.brim,yt("#6b4a2e"),0,.06,-.01,.18,1,.18)),t.armL.rotation.set(-.2,0,-1.25),t.armR.rotation.set(-.2,0,1.25);const e=yt(sr("#9a8a78",-.12),{side:an});for(const n of[-1,1]){const s=new de;s.setAttribute("position",new ie([n*.15,.52,.02,n*.42,.45,.02,n*.2,.1,0,n*.15,.52,.02,n*.2,.1,0,n*.12,.25,0],3)),s.computeVertexNormals();const r=new Gt(s,e);r.castShadow=!0,t.body.add(r)}return t.body.position.y=.7,t.body.rotation.x=.55,t.lift=.7,i.add(rt(ht.cyl,yt("#cfe8ff",{transparent:!0,opacity:.35}),0,.42,0,.025,.66,.025)),t.tail.rotation.x=-.6,i},trebuchet(){const i=new Vt,t=new Vt;i.add(t);const e=yt("#7a5232"),n=yt("#5f3e24");for(const c of[-1,1])t.add(rt(ht.box,n,c*.38,.2,0,.1,.1,1.6)),t.add(Ti([c*.38,.2,-.55],[c*.38,1.25,0],.045,e)),t.add(Ti([c*.38,.2,.55],[c*.38,1.25,0],.045,e));t.add(rt(ht.box,n,0,.2,.6,.86,.08,.1)),t.add(rt(ht.box,n,0,.2,-.6,.86,.08,.1));const s=rt(ht.cyl,Be("#555"),0,1.25,0,.04,.9,.04);s.rotation.z=Math.PI/2,t.add(s);const r=[];for(const c of[-1,1])for(const h of[-.6,.6]){const u=Rd(.17,c*.5,.17,h);t.add(u),r.push(u)}const o=new Vt;o.position.set(0,1.25,0),o.add(rt(ht.box,e,0,0,.35,.08,.08,1.7));const a=rt(ht.box,n,0,-.18,-.45,.32,.3,.3);o.add(a);for(let c=0;c<5;c++)o.add(rt(ht.sph,yt("#8a5a2a"),(Math.random()-.5)*.2,-.02,-.45+(Math.random()-.5)*.2,.06));const l=rt(ht.cone,yt("#6b4a26"),0,0,1.25,.11,.24,.11);l.rotation.x=Math.PI/2,o.add(l),o.add(rt(ht.sph,Ii("#ff8a2a"),0,.06,1.25,.05)),o.rotation.x=.75,o.rotation.y=Math.PI,t.add(o);for(const c of[-1,1]){const h=ms({fur:"#c96a2d"});h.scale.setScalar(.72),h.position.set(c*.72,.05,-.25),h.rotation.y=-c*.5,h.userData.anim.armR.rotation.x=-2.2,t.add(h)}o.userData.keep=!0;for(const c of r)c.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:r,throwArm:o,rest:.75},i},elder(){const i=ms({fur:"#a9a197",belly:"#f4efe6",hat:"none"}),t=i.userData.anim;i.scale.setScalar(1.28);const e=rt(new Dn(.3,.55,10,1,!0),yt("#5a6b34",{side:an}),0,.3,0);t.body.add(e),t.head.add(rt(ht.cone,yt("#f4efe6"),0,-.14,.15,.06,.16,.04).rotateX(Math.PI));for(let s=0;s<7;s++){const r=s/7*Math.PI*2,o=rt(ht.cone,yt(s%2?"#d08a2c":"#6aa646"),Math.cos(r)*.15,.12,Math.sin(r)*.15,.035,.12,.02);o.rotation.set(Math.sin(r)*.4,0,-Math.cos(r)*.4),t.head.add(o)}const n=new Vt;n.add(rt(ht.cyl,yt("#5a3d24"),0,.25,0,.025,1,.025)),n.add(rt(ht.oct,Ii("#7dff8a"),0,.82,0,.07,.11,.07));for(let s=0;s<3;s++){const r=s/3*Math.PI*2;n.add(Ti([0,.7,0],[Math.cos(r)*.07,.86,Math.sin(r)*.07],.012,yt("#5a3d24")))}return $n(t.armL,n,.9),t.armL.rotation.x=-.6,t.gem=n.children[1],t.gem.userData.keep=!0,i}},sM=new Set([Dd.trebuchet]);function gs({scale:i="#3f8f4a",belly:t="#d9cf86",hood:e=null,hoodSize:n=1,long:s=!1,thick:r=1}={}){const o=new Vt,a=new Vt;o.add(a);const l=yt(i),c=yt(t);let h;if(s)h=[[.05,.05,-.9],[-.18,.06,-.62],[.16,.07,-.34],[-.06,.1,-.08],[0,.26,.02],[0,.4,.03]];else{h=[];for(let v=0;v<=10;v++){const m=v/10,p=-.6+m*Math.PI*2.3,_=.3-m*.17;h.push([Math.cos(p)*_,.06+m*.1,Math.sin(p)*_-.04])}h.push([0,.3,.02],[0,.42,.03])}a.add(Xb(h,.025,.115*r,l));const u=rt(new $l(.12*r,.2,3,8),l,0,.53,.04);u.rotation.x=.12,a.add(u),a.add(rt(ht.ico,c,0,.5,.12*r,.085*r,.17,.05));const d=new Vt;if(d.position.set(0,.79,.08),a.add(d),e){const v=rt(ht.ico,yt(e),0,-.02,-.07,.21*n,.24*n,.05);d.add(v);for(const m of[-1,1])d.add(rt(ht.sph,yt(t),m*.08*n,.02,-.12,.035*n,.035*n,.01))}d.add(rt(ht.ico,l,0,0,.02,.11,.09,.15)),d.add(rt(ht.ico,c,0,-.04,.06,.08,.04,.11));for(const v of[-1,1])d.add(rt(ht.sph,yt("#ffd23a",{emissive:"#b08000",emissiveIntensity:.4}),v*.065,.035,.09,.03)),d.add(rt(ht.sph,yt("#111111"),v*.079,.037,.1,.008,.024,.012));const f=new Vt;f.position.set(0,-.03,.16);for(const v of[-1,1]){const m=rt(ht.cyl,yt("#d0304a"),v*.012,0,.05,.008,.1,.008);m.rotation.x=Math.PI/2,m.rotation.z=v*.3,f.add(m)}f.scale.setScalar(.001),d.add(f);const g=[];for(const v of[-1,1]){const m=new Vt;m.position.set(v*.15*r,.64,.05),m.add(rt(ht.ico,l,0,-.1,0,.045*r,.12,.045*r));const p=new Vt;p.position.set(0,-.21,0),p.add(rt(ht.ico,l,0,0,0,.042*r)),m.add(p),m.userData.hand=p,m.rotation.x=-.9,a.add(m),g.push(m)}return o.userData.anim={kind:"naga",body:a,head:d,tongue:f,armL:g[0],armR:g[1]},o}const rM={scaleguard(){const i=gs({scale:"#3f8f4a",belly:"#d9cf86"}),t=i.userData.anim;t.head.add(rt(ht.cap,Be("#b8862e"),0,.04,.01,.12,.09,.15)),t.head.add(rt(ht.brim,Be("#b8862e"),0,.04,.01,.12,1,.15)),t.head.add(rt(ht.box,Be("#b8862e"),0,.12,-.02,.015,.06,.18)),$n(t.armR,qb(1.15),.9);const e=Ad(.2,Be("#a8762a"),Be("#e0b050"));return $n(t.armL,e,.9),e.position.z=.06,t.armL.rotation.set(-.7,0,.35),i},spitter(){const i=gs({scale:"#2f8f86",belly:"#e0d890",hood:"#5a2f7a",hoodSize:1.45}),t=i.userData.anim;return t.head.add(rt(ht.sph,Ii("#8aff5a"),0,-.04,.16,.035)),t.body.add(rt(ht.ico,yt("#7a8a3a"),.17,.38,.05,.08,.1,.08)),t.body.add(rt(ht.sph,Ii("#8aff5a"),.17,.48,.05,.03)),t.armL.rotation.x=-.5,t.armR.rotation.x=-.5,i},sidewinder(){const i=gs({scale:"#c2a061",belly:"#efe0b0",long:!0}),t=i.userData.anim;for(let e=0;e<6;e++)t.body.add(rt(ht.oct,yt("#6b4a2a"),0,.12+e*.07,-.05-e*.02,.04,.03,.04));for(const e of[-1,1]){const n=rt(ht.cone,yt("#8a6a3a"),e*.06,.08,.05,.02,.07,.02);n.rotation.z=-e*.4,t.head.add(n);const s=rt(new Sn(.13,.014,4,12,Math.PI*.9),Be("#c8ccd0"),0,.08,.08);s.rotation.y=Math.PI/2,$n(e<0?t.armL:t.armR,s,.4)}return t.armL.rotation.set(-1.3,0,.3),t.armR.rotation.set(-1.3,0,-.3),t.body.rotation.x=.12,i},brute(){const i=gs({scale:"#4f6e2a",belly:"#c8b870",thick:1.35}),t=i.userData.anim;i.scale.setScalar(2.15);for(let e=0;e<7;e++){const n=rt(ht.cone,yt("#e8dcc0"),0,.45+e*.06,-.12-(e<3?0:(e-3)*.01),.02,.07,.02);n.rotation.x=-1.1,t.body.add(n)}for(const e of[-1,1]){const n=rt(ht.cone,yt("#e8dcc0"),e*.07,.08,-.03,.025,.12,.025);n.rotation.set(-.6,0,-e*.6),t.head.add(n),t.body.add(rt(new Sn(.06,.015,4,10).rotateX(Math.PI/2),Be("#b8862e"),e*.2,.5,.05))}return t.armL.rotation.set(-1.2,0,.5),t.armR.rotation.set(-1.2,0,-.5),i},engine(){const i=new Vt,t=new Vt;i.add(t);const e=yt("#4a3a2a"),n=yt("#3a2c20");t.add(rt(ht.box,e,0,.36,0,.8,.22,1.35));const s=[];for(const l of[-1,1])for(const c of[-.45,.45]){const h=Rd(.21,l*.47,.21,c);t.add(h),s.push(h)}const r=rt(ht.ico,yt("#d8cfb0"),0,.55,.78,.2,.16,.28);t.add(r);for(const l of[-1,1])t.add(rt(ht.cone,yt("#f4ecd8"),l*.09,.43,.92,.025,.12,.025).rotateX(Math.PI)),t.add(rt(ht.sph,Ii("#8aff5a"),l*.1,.62,.88,.035));for(const l of[-1,1])t.add(Ti([l*.3,.45,-.3],[l*.2,1.05,-.1],.04,n));const o=new Vt;o.position.set(0,1.05,-.1),o.add(rt(ht.box,e,0,0,.35,.08,.08,.9)),o.add(rt(ht.cap,yt("#3a2c20",{side:an}),0,.02,.8,.14,.08,.14).rotateX(Math.PI));const a=rt(ht.sph,yt("#7dff5a",{emissive:"#4ad02a",emissiveIntensity:1.1,transparent:!0,opacity:.85,roughness:.15}),0,.12,.8,.14);a.userData.keep=!0,o.add(a),o.rotation.x=-.55,t.add(o);for(let l=0;l<3;l++)t.add(rt(ht.sph,yt("#7dff5a",{emissive:"#3ab02a",emissiveIntensity:.9}),-.2+l*.2,.55,-.55,.08));for(const l of[-1,1]){const c=gs({scale:"#3f8f4a",belly:"#d9cf86"});c.scale.setScalar(.72),c.position.set(l*.72,.05,-.35),c.rotation.y=-l*.5,t.add(c)}o.userData.keep=!0;for(const l of s)l.userData.keep=!0;return i.userData.anim={kind:"machine",body:t,wheels:s,throwArm:o,rest:-.55,globe:a},i},hierophant(){const i=gs({scale:"#5e3a8c",belly:"#e6c870",hood:"#3a2060",hoodSize:1.7}),t=i.userData.anim;i.scale.setScalar(1.32);for(let n=0;n<5;n++){const s=(n/4-.5)*1.6,r=rt(ht.cone,Be("#e0b040"),Math.sin(s)*.1,.12+Math.cos(s)*.04,-.02,.02,.12,.02);r.rotation.z=-s*.5,t.head.add(r)}for(const n of[-1,1])t.body.add(rt(new Sn(.05,.014,4,10).rotateX(Math.PI/2),Be("#e0b040"),n*.15,.45,.05));const e=new Vt;return e.add(rt(ht.cyl,yt("#2a1a40"),0,.25,0,.022,1,.022)),e.add(rt(ht.sph,Ii("#c070ff"),0,.82,0,.08)),e.add(rt(new Sn(.1,.012,4,14),Be("#e0b040"),0,.82,0)),$n(t.armL,e,.9),t.armL.rotation.x=-.6,t.gem=e.children[1],t.gem.userData.keep=!0,i}},oM=new Set,Ja=Object.freeze({squirrel:Dd,serpent:rM}),aM=new Set([...sM,...oM]),Za=new Map;function Lu(i,t,e,n){if(!Object.hasOwn(Ja,i)||!Object.hasOwn(Ja[i],t))throw new Error(`no figure for unit "${t}" in the "${i}" kit`);const s=`${i}/${t}`,r=Ja[i][t],o=aM.has(r),a=new Vt,l=jb(e.base,n);a.add(l);const c=o||!Za.has(s),h=c?r():Du(Za.get(s));h.position.y=e.big?.09:.06,h.userData.y0=h.position.y,a.add(h),a.userData.fig=h,a.userData.anim=h.userData.anim,a.userData.phase=Math.random()*10,a.userData.drawn=o,El(l),c&&El(h),a.traverse(f=>{f.isMesh&&(f.castShadow=!0)}),l.traverse(f=>{f.isMesh&&(f.receiveShadow=!0)});const u=new Set,d=f=>f.traverse(g=>g.isMesh&&u.add(g.geometry));return d(l),o&&d(h),a.userData.own=[...u],c&&!o&&Za.set(s,Du(h)),a}function lM(i){for(const t of i.userData.own??[])t.dispose();i.userData.own=[]}function Du(i){const t=new Map;i.traverse(o=>{t.set(o,o.userData),o.userData={}});let e;try{e=i.clone(!0)}finally{for(const[o,a]of t)o.userData=a}const n=new Map,s=(o,a)=>{n.set(o,a),o.children.forEach((l,c)=>s(l,a.children[c]))};s(i,e);const r=o=>o!=null&&o.isObject3D?n.get(o)??o:Array.isArray(o)?o.map(r):o&&typeof o=="object"?Object.fromEntries(Object.entries(o).map(([a,l])=>[a,r(l)])):o;for(const[o,a]of t)n.get(o).userData=r(a);return e}let cM=null;const hM=()=>cM??(cM={ring:new Wi(.88,1,48).rotateX(-Math.PI/2),hit:new Qe(1,1,1,12)}),uo=new C;class Id{constructor({scene:t,labels:e,fx:n,mirror:s,colorOf:r,W:o}){this.scene=t,this.W=o,this.labels=e,this.effects=n,this.mirror=s,this.colorOf=r,this.views=new Map,this.gen=0}get(t){return this.views.get(t)}unit(t){return this.views.get(t).u}shown(t){return this.mirror().units[t]}standing(t){const e=this.shown(t);return this.views.get(t).models.filter((n,s)=>e.models[s].alive)}top(t){const e=this.shown(t).pos;return{x:e.x,y:this.unit(t).t.big?2.6:1.6,z:e.z}}gone(t,e,n){return this.views.get(t)!==e||this.gen!==n}make(t,e,n){const s=-e*Math.PI/2,r=this.shown(t.id),o={id:t.id,u:t,edge:e,color:n,facing:s,moving:!1,at:null,models:[]},a=An[t.race].look.models;for(let h=0;h<t.t.models;h++){if(!r.models[h].alive){o.models.push({mesh:null,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0});continue}const u=Lu(a,t.key,t.t,n);this.scene.add(u),o.models.push({mesh:u,x:0,z:0,yaw:s,lunge:0,lungeDir:0,lift:0})}const{ring:l,hit:c}=hM();return o.ring=new Gt(l,new We({color:"#ffffff",transparent:!0,opacity:0,depthWrite:!1,toneMapped:!1})),o.ring.position.y=.04,o.ring.renderOrder=2,this.scene.add(o.ring),o.hit=new Gt(c,new We({visible:!1})),o.hit.userData.id=t.id,this.scene.add(o.hit),o.label=document.createElement("div"),o.label.className=`ulabel s${t.side}`,this.labels.appendChild(o.label),this.views.set(t.id,o),this.disc(t.id),this.stands(o,r.alive>0),this.place(o),o}stands(t,e){t.ring.visible=e,t.hit.visible=e,e&&!t.hit.parent&&this.scene.add(t.hit),e||this.scene.remove(t.hit)}place(t){const e=this.shown(t.id);e.models.forEach((n,s)=>{const r=t.models[s];r.mesh&&(r.x=e.pos.x+n.ox,r.z=e.pos.z+n.oz,r.mesh.position.set(r.x,0,r.z),r.mesh.rotation.y=r.yaw)})}unfigure(t){t.mesh&&(this.scene.remove(t.mesh),lM(t.mesh))}drop(t){for(const e of t.models)this.unfigure(e);this.scene.remove(t.ring,t.hit),t.ring.material.dispose(),t.hit.material.dispose(),t.label.remove(),this.views.delete(t.id)}dispose(){for(const t of[...this.views.values()])this.drop(t);this.gen++}sync(t,e){this.gen++;const n=this.mirror(),s=new Set(t.map(r=>r.id));for(const r of[...this.views.values()])s.has(r.id)||this.drop(r);for(const r of t){const o=e(r.side),a=this.colorOf(r.side);let l=this.views.get(r.id);if(l&&(l.u.t!==r.t||l.u.side!==r.side||l.edge!==o||l.color!==a)&&(this.drop(l),l=null),!l){this.make(r,o,a);continue}const c=n.units[r.id],h=An[r.race].look.models;l.at=null,l.moving=!1,l.facing=-o*Math.PI/2,l.models.forEach((u,d)=>{if(!c.models[d].alive){this.unfigure(u),l.models[d]={mesh:null,x:u.x,z:u.z,yaw:l.facing,lunge:0,lungeDir:0,lift:0};return}if(!u.mesh||u.dying||u.fleeing||!u.mesh.parent){this.unfigure(u);const g=Lu(h,r.key,r.t,a);this.scene.add(g),u=l.models[d]={mesh:g,x:0,z:0,yaw:l.facing,lunge:0,lungeDir:0,lift:0}}Object.assign(u,{yaw:l.facing,look:void 0,lunge:0,lift:0,flash:0,flying:!1,moving:!1}),u.mesh.position.y=0,u.mesh.userData.fig.position.x=0;const f=u.mesh.userData.anim;f!=null&&f.throwArm&&(f.throwArm.rotation.x=f.rest),f!=null&&f.globe&&(f.globe.visible=!0)}),this.disc(r.id),this.stands(l,c.alive>0),this.place(l)}this.labelAll()}disc(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=e.at??s.pos;e.ring.scale.setScalar(s.r+.18);const o=n.t.big?2.4:n.t.fly?1.8:1.3;e.hit.scale.set(s.r,o,s.r),e.ring.position.x=e.hit.position.x=r.x,e.ring.position.z=e.hit.position.z=r.z,e.hit.position.y=e.hit.scale.y/2}label(t){const e=this.views.get(t),n=e.u,s=this.shown(t),r=s.models.filter(a=>a.alive);let o=`<span class="nm">${n.t.short}</span>`;n.t.models>1?o+=`<span class="ct">${s.alive}/${n.t.models}</span>`:o+=`<span class="ct">${r[0]?r[0].w:0}/${n.t.W}♥</span>`,s.mesmerized&&(o+='<span class="st" title="Mesmerized">🌀</span>'),s.alive>0&&s.engaged&&(o+='<span class="st" title="In combat">⚔</span>'),e.label.innerHTML=o,e.label.style.display=s.alive>0?"":"none"}labelAll(){for(const t of this.views.keys())this.label(t)}paintRings(t){for(const e of this.views.values()){if(!(this.shown(e.id).alive>0))continue;const[n,s]=t(e);e.ring.material.opacity=s,e.ring.material.color.set(n)}}pickables(){return[...this.views.values()].filter(t=>this.shown(t.id).alive>0).map(t=>t.hit)}animate(t,e,{fast:n,camera:s,sel:r}){const o=this.mirror();for(const a of this.views.values()){const l=a.u,c=o.units[l.id],h=a.at??c.pos;for(const[u,d]of c.models.entries()){const f=a.models[u];if(!d.alive&&!f.dying)continue;const g=f.mesh.userData.anim;if(d.alive){const p=h.x+d.ox,_=h.z+d.oz,x=1-Math.exp(-t*(a.moving?16:7)),y=f.x,R=f.z;f.x+=(p-f.x)*x,f.z+=(_-f.z)*x;const S=Math.hypot(f.x-y,f.z-R)/Math.max(t,1e-4),E=S>.6?Math.atan2(f.x-y,f.z-R):f.look??a.facing;f.yaw+=Ab(E-f.yaw)*(1-Math.exp(-t*8)),f.moving=S>.6;let O=0,b=0;if(f.lunge>0){f.lunge=Math.max(0,f.lunge-t*2.5);const w=Math.sin((1-f.lunge)*Math.PI)*.35;O=Math.sin(f.lungeDir)*w,b=Math.cos(f.lungeDir)*w}f.mesh.position.set(f.x+O,f.lift||0,f.z+b),f.mesh.rotation.y=f.yaw}if(!g||!d.alive)continue;const v=e+f.mesh.userData.phase,m=f.mesh.userData.fig;if(g.kind==="squirrel"){const p=f.moving?Math.abs(Math.sin(v*13))*.16:0;m.position.y=m.userData.y0+p,m.scale.y=1+(f.moving?0:Math.sin(v*2.4)*.018),m.rotation.x=f.moving?.12:0}else if(g.kind==="naga")m.rotation.z=Math.sin(v*(f.moving?9:1.4))*(f.moving?.12:.035),m.scale.y=1+Math.sin(v*1.4)*.015;else if(g.kind==="machine"&&f.moving)for(const p of g.wheels)p.rotation.x+=t*6;g.gem&&(g.gem.rotation.y=v*2),f.flash>0&&(f.flash-=t,m.position.x=Math.sin(e*60)*.04*(f.flash>0?1:0))}if(c.alive>0&&!n){uo.set(h.x,l.t.big?2.7:l.t.fly?2.3:1.7,h.z).project(s);const u=uo.z<1;a.label.style.transform=`translate(${(uo.x*.5+.5)*innerWidth}px, ${(-uo.y*.5+.5)*innerHeight}px) translate(-50%, -100%)`,a.label.style.visibility=u&&o.stage!=="title"?"visible":"hidden",a.label.classList.toggle("sel",l.id===r)}}}wounded(t){const e=this.views.get(t.u),n=e.u,s=e.models[t.m];this.effects.text({x:s.x,y:n.t.big?2.3:1.3,z:s.z},`-${t.dmg}`,"#ff5a4a",{size:n.t.big?24:18}),s.flash=.4}slain(t,e){const n=this.views.get(t.u),s=n.u,r=n.models[t.m];this.effects.text({x:r.x,y:s.t.big?2.3:1.3,z:r.z},`-${t.dmg}`,"#ff5a4a",{size:s.t.big?24:18}),r.dying=!0;const o=An[s.race].look;ge.voice(o.voice);const a=r.mesh.userData.fig,l=t.by===null?null:e.units[t.by],c=l?Math.atan2(r.x-l.pos.x,r.z-l.pos.z)-r.yaw:0,h=Math.sin(c)>=0?1:-1;this.effects.debris(r.x,.5,r.z,o.gore,6,{power:2,size:.07}),Ae(.6,u=>{a.rotation.z=h*u*1.45,a.position.y=(s.t.big?.09:.06)+Math.sin(u*Math.PI)*.15},Ts).then(()=>Cn(1.4)).then(()=>Ae(.8,u=>r.mesh.position.y=-u*1.4)).then(()=>{this.unfigure(r),r.dying=!1})}fled(t){const e=this.views.get(t.u),n=e.models[t.m];n.dying=!0;const s=e.edge,r=s*(this.W/2+3),o=n.x,a=n.z;n.fleeing=!0,this.effects.text({x:n.x,y:1.4,z:n.z},"flees!","#e0e0e0",{size:14}),n.yaw=s*Math.PI/2,Ae(2.2,l=>{n.x=pn(o,r,l),n.z=a,n.mesh.position.set(n.x,Math.abs(Math.sin(l*30))*.2,n.z),n.mesh.rotation.y=n.yaw}).then(()=>{this.unfigure(n),n.dying=!1})}destroyed(t,e){const n=this.views.get(t.u),s=n.u,r=e.units[t.u].pos;n.label.style.display="none",n.ring.visible=!1,n.hit.visible=!1,this.scene.remove(n.hit),this.effects.text({x:r.x,y:2.2,z:r.z},`${s.t.short} destroyed`,this.colorOf(t.by!==null?this.unit(t.by).side:1-s.side),{size:20,life:2})}face(t){const e=this.views.get(t.u),n=this.shown(t.tg).pos,s=this.shown(t.u).pos;e.facing=Math.atan2(n.x-s.x,n.z-s.z);for(const r of e.models)r.look=Math.atan2(n.x-r.x,n.z-r.z)}shout(t){const e=this.unit(t.u);t.ok?this.effects.text(this.top(t.u),"CHARGE!",this.colorOf(e.side),{size:22}):this.effects.text(this.top(t.u),"Charge failed","#d0d0d0")}lunge(t){const e=this.views.get(t.tg),n=this.gen,s=this.shown(t.tg).pos;for(const r of this.standing(t.u))r.lunge=1,r.lungeDir=Math.atan2(s.x-r.x,s.z-r.z);ge.thwack(),t.hits&&Cn(gi.dice(t.n)).then(()=>{if(!this.gone(t.tg,e,n))for(let r=0;r<Math.min(t.hits,8);r++){const o=this.standing(t.tg)[r%Math.max(1,this.shown(t.tg).alive)];if(o)for(let a=0;a<4;a++)this.effects.mote({x:o.x,y:.6,z:o.z,vx:(Math.random()-.5)*5,vy:Math.random()*4,vz:(Math.random()-.5)*5,size:.05,color:"#fff2b0",life:.3,g:12})}})}async walk(t,e,n){const s=this.views.get(t.u),r=this.gen,{path:o,L:a,speed:l,fly:c,smashes:h}=t;if(t.stomp&&ge.boom(.4),s.moving=!0,c)for(const m of s.models)m.flying=!0;const u=[];let d=0;for(let m=1;m<o.length;m++){const p=Wt(o[m].x-o[m-1].x,o[m].z-o[m-1].z);u.push({a:o[m-1],b:o[m],s:d,l:p}),d+=p}let f=0;const g=({ev:m})=>{n(m),this.effects.shake=Math.max(this.effects.shake,.08)},v=()=>this.gone(t.u,s,r);if(await Ae(a/l+.15,m=>{if(v())return;const p=Math.min(a,m*(a+l*.15)),_=u.find(y=>p<=y.s+y.l)||u[u.length-1],x=_.l>0?(p-_.s)/_.l:1;if(s.facing=Math.atan2(_.b.x-_.a.x,_.b.z-_.a.z),s.at={x:pn(_.a.x,_.b.x,x),z:pn(_.a.z,_.b.z,x)},this.disc(t.u),c)for(const y of s.models)y.lift=Math.sin(Math.min(1,p/a)*Math.PI)*Math.min(3,a*.3);for(;f<h.length&&h[f].s<=p;)g(h[f++])},Sl),!v()){for(;f<h.length;)g(h[f++]);if(s.at=null,this.disc(t.u),s.moving=!1,c)for(const m of s.models)m.flying=!1,m.lift=0;await Cn(.15)}}}class uM{constructor(t,{W:e,H:n,grid:s}){this.scene=t,this.data=new Uint8Array(s.nx*s.nz*4);const r=this.tex=new n_(this.data,s.nx,s.nz,fn);r.magFilter=Je,r.minFilter=Je;const o=this.mesh=new Gt(new fi(e,n).rotateX(-Math.PI/2),new We({map:r,transparent:!0,depthWrite:!1,toneMapped:!1}));o.position.y=.035,o.renderOrder=2,o.visible=!1,t.add(o);const a=this.rangeRing=new Gt(new Wi(.985,1,96).rotateX(-Math.PI/2),new We({color:"#ffffff",transparent:!0,opacity:.6,depthWrite:!1,toneMapped:!1}));a.position.y=.04,a.visible=!1,t.add(a);const l=this.pathLine=new xo(new de,new Fo({color:"#ffffff",transparent:!0,opacity:.9,toneMapped:!1}));l.visible=!1,l.renderOrder=4,t.add(l);const c=this.ghost=new Gt(new Wi(.9,1,40).rotateX(-Math.PI/2),new We({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1,toneMapped:!1}));c.position.y=.05,c.visible=!1,t.add(c)}reach(t,e){const n=t.u.flags.advanced,{u:s,res:r,mode:o,endForbid:a}=t,l=new Uint8Array(e.N);for(let c=0;c<e.N;c++)isFinite(r.dist[c])&&e.standable(c,s.r,o==="wreck"?"wreck":"walk",a)&&(l[c]=1);this.mask(l,t.fallback?[255,120,90]:n?[255,190,70]:[90,180,255],e)}mask(t,e,n,s=80){const r=this.data;r.fill(0);for(let o=0;o<n.N;o++){if(!t[o])continue;const a=o%n.nx,l=o/n.nx|0,c=a===0||l===0||a===n.nx-1||l===n.nz-1||!t[o-1]||!t[o+1]||!t[o-n.nx]||!t[o+n.nx],h=((n.nz-1-l)*n.nx+a)*4;r[h]=e[0],r[h+1]=e[1],r[h+2]=e[2],r[h+3]=c?210:n.diff[o]?Math.round(s*.7):s}this.tex.needsUpdate=!0,this.mesh.visible=!0}clear(){this.mesh.visible=!1,this.pathLine.visible=!1,this.rangeRing.visible=!1}range({x:t,z:e},n,s,r){const o=this.rangeRing;o.position.x=t,o.position.z=e,o.scale.setScalar(n+s),o.material.color.set(r),o.visible=!0}path(t){this.pathLine.geometry.setFromPoints(t.map(e=>new C(e.x,.08,e.z))),this.pathLine.visible=!0}peer(t,e=null,n="#ffffff"){if(!t){this.peerRing&&(this.peerRing.visible=this.peerLine.visible=!1);return}if(!this.peerRing){const o=Array.from({length:49},(l,c)=>new C(Math.cos(c/48*Math.PI*2),0,Math.sin(c/48*Math.PI*2))),a=()=>new __({color:"#ffffff",dashSize:.35,gapSize:.25,transparent:!0,opacity:.9,toneMapped:!1});this.peerRing=new xo(new de().setFromPoints(o),a()),this.peerRing.material.dashSize=.12,this.peerRing.material.gapSize=.08,this.peerRing.computeLineDistances(),this.peerLine=new xo(new de,a());for(const l of[this.peerRing,this.peerLine])l.renderOrder=4,this.scene.add(l)}const s=this.peerRing,r=this.peerLine;s.position.set(t.x,.07,t.z),s.scale.setScalar(t.r*1.25),s.material.color.set(n),s.visible=!0,r.visible=!!e,e&&(r.geometry.setFromPoints([new C(t.x,.09,t.z),new C(e.x,.09,e.z)]),r.computeLineDistances(),r.material.color.set(n))}ghostAt(t,e,n){const s=this.ghost;s.position.x=t.x(e),s.position.z=t.z(e),s.scale.setScalar(n),s.visible=!0}}const Iu=900,Uu=700,Ou=260,vs=new re,Nu=new Pn,fM=new Bs,Mo=new C,dM=new C,zu=new qt;class Qa{constructor(t,e){this.mesh=t,this.max=e,this.items=[],this.free=[];for(let n=e-1;n>=0;n--)this.free.push(n);t.instanceMatrix.setUsage(Xp),t.frustumCulled=!1,vs.makeScale(0,0,0);for(let n=0;n<e;n++)t.setMatrixAt(n,vs),t.setColorAt(n,zu.set(16777215))}spawn(t){if(!this.free.length){const e=this.items.shift();this.free.push(e.i)}t.i=this.free.pop(),this.mesh.setColorAt(t.i,zu.set(t.color)),this.mesh.instanceColor.needsUpdate=!0,this.items.push(t)}update(t){const e=[];for(const n of this.items){if(n.age+=t,n.age>=n.life){vs.makeScale(0,0,0),this.mesh.setMatrixAt(n.i,vs),this.free.push(n.i);continue}n.vy-=n.g*t;const s=Math.exp(-n.drag*t);n.vx*=s,n.vz*=s,n.g<0&&(n.vy*=s),n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.y<n.floor&&(n.y=n.floor,n.vy=-n.vy*n.bounce,n.vx*=.55,n.vz*=.55,n.spin*=.5),n.rx+=n.spin*t,n.ry+=n.spin*.7*t;const r=n.age/n.life,o=n.size*(n.grow?.4+r*n.grow:1)*(r>n.fadeAt?1-(r-n.fadeAt)/(1-n.fadeAt):1);Nu.setFromEuler(fM.set(n.rx,n.ry,0)),vs.compose(Mo.set(n.x,n.y,n.z),Nu,dM.set(o*n.sx,o*n.sy,o*n.sz)),this.mesh.setMatrixAt(n.i,vs),e.push(n)}this.items=e,this.mesh.instanceMatrix.needsUpdate=!0}}function tl(i){return{x:i.x,y:i.y,z:i.z,vx:i.vx||0,vy:i.vy||0,vz:i.vz||0,g:i.g??22,drag:i.drag??.6,bounce:i.bounce??.3,floor:i.floor??.04,size:i.size??.15,sx:i.sx??1,sy:i.sy??1,sz:i.sz??1,rx:Math.random()*6,ry:Math.random()*6,spin:i.spin??(Math.random()-.5)*18,age:0,life:i.life??1.5,fadeAt:i.fadeAt??.7,grow:i.grow||0,color:i.color}}function ku(i,t){const e=document.createElement("canvas");e.width=e.height=128;const n=e.getContext("2d"),s=n.createRadialGradient(64,64,4,64,64,62);s.addColorStop(0,i),s.addColorStop(.55,i),s.addColorStop(1,t),n.fillStyle=s,n.fillRect(0,0,128,128);for(let o=0;o<90;o++){const a=Math.random()*Math.PI*2,l=30+Math.random()*30;n.fillStyle=i,n.globalAlpha=Math.random()*.5,n.beginPath(),n.arc(64+Math.cos(a)*l,64+Math.sin(a)*l,2+Math.random()*6,0,Math.PI*2),n.fill()}const r=new Bl(e);return r.colorSpace=we,r}class pM{constructor(t,e,n){this.scene=t,this.camera=e,this.overlay=n,this.shake=0;const s=new or(new Ln(1,1,1),new Mn({roughness:.85}),Iu);s.castShadow=!0;const r=new or(new In(1,0),new We({toneMapped:!1}),Uu),o=new or(new In(1,1),new x_({transparent:!0,opacity:.55,depthWrite:!1}),Ou);t.add(s,r,o),this.cubes=new Qa(s,Iu),this.glow=new Qa(r,Uu),this.puff=new Qa(o,Ou),this.lights=[];for(let a=0;a<3;a++){const l=new M_(16755285,0,14,1.6);l.position.set(0,-50,0),t.add(l),this.lights.push({l,until:0})}this.scorchTex=ku("rgba(20,14,8,0.85)","rgba(20,14,8,0)"),this.acidTex=ku("rgba(90,220,60,0.75)","rgba(40,120,20,0)"),this.decals=[],this.decalGeo=new Vi(1,28),this.decalGeo.rotateX(-Math.PI/2),this.texts=[],this.flashGeo=new ln(1,20,12),this.ringGeo=new Wi(.93,1,64),this.ringGeo.rotateX(-Math.PI/2),this.discGeo=new Vi(1,48),this.discGeo.rotateX(-Math.PI/2)}cube(t){this.cubes.spawn(tl(t))}mote(t){this.glow.spawn(tl({g:-1,drag:2.5,bounce:0,floor:-99,spin:0,...t}))}smoke(t){this.puff.spawn(tl({g:-2.2,drag:1.8,bounce:0,floor:.1,spin:0,grow:2.2,fadeAt:.4,...t}))}debris(t,e,n,s,r,{from:o,power:a=7,size:l=.16}={}){for(let c=0;c<r;c++){let h=Math.random()-.5,u=Math.random()-.5;o&&(h+=(t-o.x)*.35,u+=(n-o.z)*.35);const d=Math.hypot(h,u)||1,f=a*(.4+Math.random()*.8);this.cube({x:t+(Math.random()-.5)*.4,y:e+Math.random()*.3,z:n+(Math.random()-.5)*.4,vx:h/d*f,vy:3+Math.random()*a,vz:u/d*f,size:l*(.5+Math.random()),sy:.6+Math.random()*.8,color:s[Math.random()*s.length|0],life:2.4+Math.random()*1.5,fadeAt:.75})}}leaves(t,e,n,s,r,o=1){for(let a=0;a<r;a++){const l=Math.random()*Math.PI*2,c=1+Math.random()*4*o;this.cube({x:t+Math.cos(l)*.5*o,y:e+Math.random()*o,z:n+Math.sin(l)*.5*o,vx:Math.cos(l)*c,vy:2+Math.random()*4,vz:Math.sin(l)*c,g:5,drag:2.4,size:.1+Math.random()*.08,sy:.25,spin:(Math.random()-.5)*10,color:s[Math.random()*s.length|0],life:1.6+Math.random()*1.6})}}flashLight(t,e,n,s,r,o){const a=this.lights.reduce((l,c)=>l.until<c.until?l:c);a.until=_e.time+o,a.l.color.set(s),a.l.position.set(t,e,n),Ae(o,l=>a.l.intensity=r*(1-l)*(1-l))}decal(t,e,n,s,r=.8){const o=new Gt(this.decalGeo,new We({map:s,transparent:!0,depthWrite:!1,opacity:r,polygonOffset:!0,polygonOffsetFactor:-2}));if(o.position.set(t,.015+this.decals.length*4e-4,e),o.rotation.y=Math.random()*6,o.scale.setScalar(n),o.renderOrder=1,this.scene.add(o),this.decals.push(o),this.decals.length>40){const a=this.decals.shift();this.scene.remove(a),a.material.dispose()}return o}clearDecals(){for(const t of this.decals)this.scene.remove(t),t.material.dispose();this.decals=[]}ring(t,e,n,s,{life:r=1.2,fill:o=.18,hold:a=!1}={}){const l=new Vt,c=new Gt(this.ringGeo,new We({color:s,transparent:!0,opacity:.95,depthWrite:!1,toneMapped:!1})),h=new Gt(this.discGeo,new We({color:s,transparent:!0,opacity:o,depthWrite:!1,toneMapped:!1}));l.add(c,h),l.position.set(t,.05,e),l.scale.setScalar(n),l.renderOrder=3,this.scene.add(l);const u=()=>{this.scene.remove(l),c.material.dispose(),h.material.dispose()};return a||Ae(r,d=>{c.material.opacity=.95*(1-d),h.material.opacity=o*(1-d)}).then(u),l.userData.remove=u,l}explode(t,e,n,s="fire"){const r={fire:{flash:16761963,glow:["#ffd36e","#ff8a2a","#ff5a1f","#fff2b0"],light:16751178,smoke:"#4a4038"},acid:{flash:10354538,glow:["#b8ff6a","#5be04a","#d8ff9a","#2fbf4a"],light:9109338,smoke:"#3f5a2a"},thorns:{flash:13172634,glow:["#9be36a","#e4ffb0","#5ab04a"],light:12255114,smoke:"#3a4a2a"},dust:{flash:16773328,glow:["#ffe9b0","#ffd080"],light:16769184,smoke:"#8a7a64"}}[s],o=new Gt(this.flashGeo,new We({color:r.flash,transparent:!0,opacity:.9,toneMapped:!1,depthWrite:!1}));o.position.set(t,.3,e),this.scene.add(o),Ae(.45,l=>{o.scale.setScalar(.2+n*.85*Ts(l)),o.material.opacity=.9*(1-l)}).then(()=>{this.scene.remove(o),o.material.dispose()}),this.flashLight(t,1.5,e,r.light,9+n*6,.7);const a=Math.round(18+n*14);for(let l=0;l<a;l++){const c=Math.random()*Math.PI*2,h=(2+Math.random()*6)*(.6+n*.25);this.mote({x:t,y:.3,z:e,vx:Math.cos(c)*h,vy:2+Math.random()*6,vz:Math.sin(c)*h,g:9,drag:2.2,size:.07+Math.random()*.12,color:r.glow[l%r.glow.length],life:.5+Math.random()*.7})}for(let l=0;l<6+n*3;l++){const c=Math.random()*Math.PI*2,h=Math.random()*n*.6;this.smoke({x:t+Math.cos(c)*h,y:.3+Math.random()*.4,z:e+Math.sin(c)*h,vx:Math.cos(c)*1.2,vy:1+Math.random()*1.5,vz:Math.sin(c)*1.2,size:.25+Math.random()*.25*n,color:r.smoke,life:1.6+Math.random()*1.4})}this.debris(t,.1,e,["#5b4630","#6f8a3a","#4a3a28"],Math.round(6+n*4),{power:5+n,size:.1}),this.decal(t,e,n*.7,s==="acid"?this.acidTex:this.scorchTex,s==="acid"?.6:.45),this.shake=Math.max(this.shake,.05+n*.06)}async projectile(t,e,{mesh:n,arc:s=.25,speed:r=22,trail:o=null,spin:a=10}={}){const l=Math.hypot(e.x-t.x,e.z-t.z),c=l*s;this.scene.add(n);let h=0;await Ae(Math.max(.12,l/r),u=>{n.position.set(t.x+(e.x-t.x)*u,t.y+(e.y-t.y)*u+4*c*u*(1-u),t.z+(e.z-t.z)*u),n.rotation.x+=a*.016,n.rotation.z+=a*.011,o&&u-h>.03&&(h=u,o(n.position))}),this.scene.remove(n)}text(t,e,n="#ffffff",{size:s=18,life:r=1.3,rise:o=1.4}={}){const a=document.createElement("div");a.className="float-text",a.textContent=e,a.style.color=n,a.style.fontSize=s+"px",this.overlay.appendChild(a),this.texts.push({el:a,x:t.x,y:t.y,z:t.z,age:0,life:r,rise:o})}update(t){this.cubes.update(t),this.glow.update(t),this.puff.update(t),this.shake*=Math.exp(-t*6);const e=innerWidth,n=innerHeight;this.texts=this.texts.filter(s=>{if(s.age+=t,s.age>s.life)return s.el.remove(),!1;const r=s.age/s.life;return Mo.set(s.x,s.y+s.rise*Ts(r),s.z).project(this.camera),s.el.style.transform=`translate(${(Mo.x*.5+.5)*e}px, ${(-Mo.y*.5+.5)*n}px) translate(-50%, -50%) scale(${1+.3*(1-Math.min(1,r*5))})`,s.el.style.opacity=r>.6?1-(r-.6)/.4:1,!0})}}const mM=()=>({acorn:new ln(.07,6,5),dart:new Dn(.03,.3,4).rotateX(Math.PI/2),javelin:new Qe(.02,.02,.9,4).rotateX(Math.PI/2),spit:new In(.08,0),bomb:new ln(.11,8,6),pinecone:new Dn(.2,.42,7),acid:new ln(.24,12,8)}),Fu=new Map,Bu=i=>Fu.get(i)??Fu.set(i,new We({color:i,toneMapped:!1})).get(i);class gM{constructor({scene:t,fx:e,units:n}){this.scene=t,this.effects=e,this.units=n,this.projGeo=mM(),this.thorn=null,this.blastMarker=null,this.spikesOf=new Map}projectileStyle(t){const e=this.effects,n=this.projGeo;switch(t){case"acorn":return{mesh:new Gt(n.acorn,yt("#8a5a2a")),arc:.08,speed:28};case"dart":return{mesh:new Gt(n.dart,yt("#4a6a2a")),arc:.03,speed:34,spin:0};case"javelin":return{mesh:new Gt(n.javelin,yt("#8a6a3a")),arc:.18,speed:20,spin:0};case"spit":return{mesh:new Gt(n.spit,Bu("#9aff5a")),arc:.12,speed:18,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.04,color:"#7aef4a",life:.4,g:6})};case"bomb":return{mesh:new Gt(n.bomb,yt("#7a4a22")),arc:.45,speed:14,trail:s=>e.mote({x:s.x,y:s.y+.1,z:s.z,size:.05,color:"#ffb030",life:.3,g:-1})};case"pinecone":return{mesh:new Gt(n.pinecone,yt("#6b4a26",{emissive:"#ff5a10",emissiveIntensity:.6})),arc:.55,speed:18,trail:s=>{e.mote({x:s.x,y:s.y,z:s.z,size:.12,color:Math.random()<.5?"#ff8a2a":"#ffd36e",life:.4,g:-2}),e.smoke({x:s.x,y:s.y,z:s.z,size:.14,color:"#3a3430",life:.9})}};case"acid":return{mesh:new Gt(n.acid,Bu("#8aff5a")),arc:.5,speed:15,trail:s=>e.mote({x:s.x,y:s.y,z:s.z,size:.1,color:Math.random()<.5?"#5be04a":"#c8ff8a",life:.5,g:8})}}return{mesh:new Gt(n.acorn,yt("#888"))}}fly(t,e,n){return this.effects.projectile(t,e,this.projectileStyle(n))}async volley(t){const e=this.units,n=this.effects,s=e.unit(t.u),r=e.unit(t.tg),o=e.get(t.u),a=e.gen,l=()=>e.gone(t.u,o,a),c=e.standing(t.u),h=e.standing(t.tg),u=[],d=Math.min(10,t.n);for(let f=0;f<d;f++){const g=c[f%c.length],v=h[Math.random()*h.length|0],m={x:g.x,y:Zl(s)*.8+g.lift,z:g.z},p={x:v.x+(Math.random()-.5)*.6,y:Ql(r)*.8,z:v.z+(Math.random()-.5)*.6};u.push(Cn(f*.06).then(()=>{if(!l())return ge.shot(),this.fly(m,p,t.fx)}).then(()=>{if(!l())for(let _=0;_<5;_++)n.mote({x:p.x,y:p.y,z:p.z,vx:(Math.random()-.5)*4,vy:Math.random()*3,vz:(Math.random()-.5)*4,size:.05,color:t.fx==="spit"?"#9aff5a":"#ffe0a0",life:.35,g:10})}))}await Promise.all(u)}aimed(t){this.blastMarker=this.effects.ring(t.x,t.z,t.r,"#ffffff",{hold:!0,fill:.12})}async scattered(t){const e=this.blastMarker;this.effects.text({x:t.from.x,y:1.5,z:t.from.z},`scatter ${t.d}"`,"#ffd36e",{size:15}),await Ae(.35,n=>e==null?void 0:e.position.set(pn(t.from.x,t.to.x,n),.05,pn(t.from.z,t.to.z,n)),Ts)}async fired(t){var r;const e=this.units,n=e.get(t.u),s=e.gen;await this.artilleryFire(t),!e.gone(t.u,n,s)&&((r=this.blastMarker)==null||r.userData.remove(),this.blastMarker=null)}async artilleryFire(t){const e=this.units,n=e.unit(t.u),s=e.get(t.u),r=e.gen,o=t.to,a=()=>e.gone(t.u,s,r),l=e.standing(t.u)[0],c=l.mesh.userData.anim;if(c!=null&&c.throwArm){const d=c.rest;if(ge.thwack(),Ae(.25,f=>c.throwArm.rotation.x=d-2.1*Ts(f)).then(()=>Ae(.8,f=>c.throwArm.rotation.x=d-2.1*(1-f))),c.globe&&(c.globe.visible=!1),await Cn(.15),a())return}else l.lunge=1,l.lungeDir=Math.atan2(o.x-l.x,o.z-l.z);const h={x:l.x,y:n.t.big?1.8:.9,z:l.z},u={x:o.x,y:.15,z:o.z};ge.shot(),await this.fly(h,u,t.fx),!a()&&c!=null&&c.globe&&(c.globe.visible=!0)}landed(t){const e=this.effects;t.fx!=="thorns"&&(e.explode(t.x,t.z,t.r,t.fx==="acid"?"acid":"fire"),ge.boom(t.r/2)),e.ring(t.x,t.z,t.r,t.fx==="acid"?"#8aff5a":"#ff9a4a",{life:1.4,fill:.2})}cast(){ge.magic()}fizzled(t){ge.fizzle(),this.effects.text(this.units.top(t.u),"Fizzle…","#c8b8ff")}async thorns(t){const e=this.units,n=this.effects,s=e.get(t.u),r=e.gen,o=s.models[0].mesh.userData.anim.gem;if(o){const l=new C;o.getWorldPosition(l);for(let c=0;c<20;c++)n.mote({x:l.x,y:l.y,z:l.z,vx:(Math.random()-.5)*3,vy:Math.random()*3,vz:(Math.random()-.5)*3,size:.06,color:"#9aff7a",life:.8,g:-1})}const a=[];this.thorn??(this.thorn=new Dn(.12,1,5));for(let l=0;l<26;l++){const c=Math.random()*Math.PI*2,h=Math.sqrt(Math.random())*t.r,u=new Gt(this.thorn,yt(l%3?"#5a7a2a":"#7a5a2a"));u.position.set(t.x+Math.cos(c)*h,-.6,t.z+Math.sin(c)*h),u.rotation.set((Math.random()-.5)*.6,0,(Math.random()-.5)*.6),u.scale.set(1,.6+Math.random()*1.1,1),u.castShadow=!0,this.scene.add(u),a.push(u)}this.spikesOf.set(t.u,a),await Ae(.3,l=>a.forEach(c=>c.position.y=-.6+Ts(l)*(.3+c.scale.y*.4))),!e.gone(t.u,s,r)&&n.explode(t.x,t.z,t.r,"thorns")}faded(t){const e=this.spikesOf.get(t.u)??[];this.spikesOf.delete(t.u),Ae(1.2,n=>e.forEach(s=>s.position.y-=.02*n)).then(()=>e.forEach(n=>this.scene.remove(n)))}async gaze(t){const e=this.units,n=this.effects,s=e.get(t.tg),r=e.gen,o=()=>e.gone(t.tg,s,r),a=e.top(t.u),l=e.top(t.tg),c=[];for(let u=0;u<=16;u++){const d=u/16;c.push(Cn(d*.3).then(()=>o()||n.mote({x:pn(a.x,l.x,d),y:pn(a.y,l.y,d)+Math.sin(d*Math.PI)*.8,z:pn(a.z,l.z,d),size:.09,color:"#c070ff",life:.7,g:0})))}if(await Promise.all(c),o())return;const h=e.shown(t.tg);for(let u=0;u<3;u++)n.ring(h.pos.x,h.pos.z,h.r*(.6+u*.35),"#c070ff",{life:1.2+u*.3,fill:.08})}mesmerized(t){this.effects.text(this.units.top(t.tg),"Mesmerized!","#e0a0ff",{size:20})}held(){return{marker:!!this.blastMarker,thorns:[...this.spikesOf.values()].reduce((t,e)=>t+e.length,0)}}clear(){var t;(t=this.blastMarker)==null||t.userData.remove(),this.blastMarker=null;for(const e of this.spikesOf.values())for(const n of e)this.scene.remove(n);this.spikesOf.clear()}}class vM{constructor({lowfi:t=!1,fast:e=!1,W:n,H:s,deploy:r,edges:o,objectives:a,range:l,colorOf:c}){this.fast=e,this.stage=new Pb({lowfi:t,fast:e});const{renderer:h,scene:u}=this.stage;this.renderer=h,this.scene=u,this.rig=new Vb(h),this.camera=this.rig.camera,this.controls=this.rig.controls,this.stage.light(),this.effects=new pM(u,this.camera,this.stage.overlay),this.table=new $b(u,h,{W:n,H:s,deploy:r,edges:o}),this.objectives=new Yb(u,a,l,c),this.terrain=new Ld(u,this.effects)}figures({mirror:t,colorOf:e,W:n,H:s,grid:r}){this.units=new Id({scene:this.scene,labels:this.stage.overlay,fx:this.effects,mirror:t,colorOf:e,W:n}),this.shots=new gM({scene:this.scene,fx:this.effects,units:this.units}),this.overlay=new uM(this.scene,{W:n,H:s,grid:r})}handlers({localSeats:t}){const{rig:e,units:n,shots:s,terrain:r}=this;return{pause:o=>Cn(gi.pause(o.s)),focus:(o,a)=>e.focus(o.x,o.z,{stage:a.stage,active:a.active,localSeats:t()}),"unit.place":o=>n.disc(o.u),"unit.formation":o=>{n.disc(o.u),n.label(o.u)},"unit.wound":o=>n.wounded(o),"unit.slain":(o,a)=>n.slain(o,a),"unit.flee":o=>n.fled(o),"unit.destroyed":(o,a)=>n.destroyed(o,a),"unit.face":o=>n.face(o),"unit.move":(o,a)=>n.walk(o,a,l=>{for(const c of l)r.apply(c,a)}),melee:o=>n.lunge(o),"charge.result":o=>n.shout(o),volley:o=>s.volley(o),"blast.aim":o=>s.aimed(o),"blast.scatter":o=>s.scattered(o),"blast.fire":o=>s.fired(o),"blast.land":o=>s.landed(o),"spell.cast":()=>s.cast(),"spell.fizzle":o=>s.fizzled(o),"spell.thorns":o=>s.thorns(o),"spell.fade":o=>s.faded(o),"spell.gaze":o=>s.gaze(o),"spell.mesmerized":o=>s.mesmerized(o),status:()=>n.labelAll(),objectives:()=>{},"terrain.clear":(o,a)=>r.apply(o,a),"terrain.add":(o,a)=>r.apply(o,a),"terrain.hurt":(o,a)=>r.apply(o,a),"terrain.destroy":(o,a)=>r.apply(o,a),"terrain.collapse":(o,a)=>r.apply(o,a),"terrain.rubble":(o,a)=>r.apply(o,a)}}rebuild(t,e,n={}){const{chunks:s=t.terrain.chunks,terrain:r=this.terrain,units:o=this.units,shots:a=this.shots,effects:l=this.effects}=n;r.sync(s),o.sync(t.units,c=>br(t,c)),a.clear(),l.clearDecals()}text(t,e,n){this.effects.text(t,e,n)}run({mirror:t,sel:e}){const{effects:n,units:s,objectives:r,camera:o}=this;this.stage.run({parts:(a,l)=>{n.update(a),s.animate(a,l,{fast:this.fast,camera:o,sel:e()}),r.animate(a,l,t().owners)},rig:this.rig,shake:()=>n.shake})}}class xM{constructor({camera:t,units:e,board:n,unitOf:s}){this.camera=t,this.units=e,this.board=n,this.unitOf=s,this.ray=new E_,this.ptr=new ft}pick(t){const{ray:e,ptr:n}=this;n.set(t.clientX/innerWidth*2-1,-(t.clientY/innerHeight)*2+1),e.setFromCamera(n,this.camera);const s=e.intersectObjects(this.units.pickables(),!1),r=s.length?this.unitOf(s[0].object.userData.id):null,o=e.intersectObject(this.board,!1)[0];return{unit:r,ground:o?o.point:null}}}const Hu=new WeakMap;function _M(i){var n;const t=(n=i.G)==null?void 0:n.pending;if((t==null?void 0:t.k)!=="chargeEnd")return null;let e=Hu.get(t);return e||(e=i.preview((s,r)=>{const o=s.units.find(c=>c.id===t.u),a=s.units.find(c=>c.id===t.tg),l=r.chargePlan(s,o,a);return{seat:t.seats[0],u:o,tg:a,rolled:t.rolled,cell:t.cell,plan:l,ok:r.chargeSpots(l,t.rolled)}}),Hu.set(t,e)),e}function Vu(i,t,e,n,s=2.4){let r=-1,o=s;for(let a=0;a<i.N;a++){if(!t[a])continue;const l=Wt(i.x(a)-e,i.z(a)-n);l<o&&(o=l,r=a)}return r}const yM=-1,bM=i=>({t:"chargeEnd",c:i});function MM(i,t,e,n){return i((s,r)=>{const o=r.freeSpot(s,t,e.x,e.z,n,s.units.filter(a=>a!==t));return o&&Math.hypot(o.x-e.x,o.z-e.z)<2.5?s.nav.index(o.x,o.z):-1})}const SM=(i,t)=>({t:"place",u:i.id,c:t}),wM=(i,t)=>i((e,n)=>n.movePlan(e,t,t.flags.advanced?t.flags.advRoll:0)),EM=(i,t,e)=>i((n,s)=>s.nearestValid(n,t,e.x,e.z));function TM(i,t,e,n,s,r){const o=t.nearestValid(i,e,s.x,s.z);return o<0?"":(r(i.nav.path(e.res,o,n.r,e.mode==="fly"?null:e.forbid),o,n.r),`${e.res.dist[o].toFixed(1)}" of ${e.max}"`)}const AM=(i,t)=>({t:"move",u:i.id,c:t}),RM=i=>({t:"advance",u:i.id});class CM{constructor(t){this.el=t}hide(){this.el.style.display="none"}show(t,e){const n=this.el;n.innerHTML=t,n.style.display="block",n.style.left=e.x+16+"px",n.style.top=e.y+14+"px"}}function PM(i,t,e){const n=i.t.ranged;if(n.mesmerize)return`Mesmerize: cast ${n.spell}+ on 2D6 (${Math.round(Gi(n.spell)*100)}%) · D3 mortal wounds`;const s=[];n.spell&&s.push(`Cast ${n.spell}+ (${Math.round(Gi(n.spell)*100)}%)`);const r=Is(i,n,!1),o=Rr(n.S,t.t.T,n.poison),a=Cr(t.t.Sv,n.AP,e.cover);s.push(`${r} ${n.blast?`template${r>1?"s":""} (${n.blast}")`:"shots"} · hit ${n.spell?"auto":e.need+"+"} · wound ${o}+ · save ${a>6?"—":a+"+"}`);const l=[];if(l.push(`${e.range.toFixed(1)}"`),e.cover&&l.push("cover"),e.visible?e.seen<e.total&&l.push(`${e.seen}/${e.total} visible`):l.push("unseen (indirect −1)"),n.heavy&&i.flags.moved&&l.push("moved (heavy −1)"),!n.blast){const c=Lo(r,e.need,n,t,e.cover);l.push(`≈${c.kills.toFixed(1)} slain`)}return s.push(l.join(" · ")),s.join("<br>")}function LM(i,t,e,n){const s=t.shotInfo(i,e,n);return s.ok?PM(e,n,s):`✖ ${s.why}`}const DM=(i,t)=>({t:"shoot",u:i.id,tg:t.id});function IM(i,t,e,n){if(!t.chargeTargets(i,e).includes(n))return`✖ out of charge range (${t.gap(e,n).toFixed(1)}")`;const s=t.chargePlan(i,e,n);return s?`Charge: need ${s.need}" on 2D6 — ${Math.round(Gi(s.need)*100)}%`:"✖ no route"}const UM=(i,t)=>({t:"charge",u:i.id,tg:t.id});class OM{constructor({flow:t,view:e,card:n,tooltip:s,picker:r}){this.flow=t,this.view=e,this.card=n,this.tooltip=s,this.picker=r,this.sel=null,this.reach=null,this.hover=null,this.hoverPick=null,this.mouse=null,this.pickShown=null,this.downAt=null}get session(){return this.flow.session}get G(){return this.flow.G}localSeat(){return this.session?this.session.decisionFor():-1}localDecision(){return this.localSeat()>=0?this.G.pending:null}mode(){return this.flow.player.idle&&this.localSeat()>=0?this.G.pending.k:"watch"}deploySeat(){var t;return((t=this.localDecision())==null?void 0:t.k)==="deploy"?this.localSeat():-1}myTurn(){return this.mode()==="phase"}picking(){return this.mode()==="chargeEnd"?_M(this.session):null}ask(t){return this.session.preview(t)}state(){return{idle:this.flow.player.idle,decision:this.localDecision(),mode:this.mode(),deploy:this.deploySeat(),sel:this.sel,pick:this.picking(),hover:this.hover}}send(t,e){const n=this.session,s=n?n.legal(t,e):"no battle";return s||(n.submit(t,e),this.flow.refreshUI(),null)}moveTo(t,e){return this.view.overlay.clear(),this.send(this.localSeat(),AM(t,e))}advance(t){return this.send(this.localSeat(),RM(t))}shoot(t,e){return this.send(this.localSeat(),DM(t,e))}charge(t,e){return this.send(this.localSeat(),UM(t,e))}placeCharge(t){const e=this.picking();return e?t>=0&&e.ok[t]?this.endCharge(e,t):`cell ${t} is no spot the roll reaches`:"no charge to end"}takeShortest(){const t=this.picking();return t?this.endCharge(t,yM):"no charge to end"}endCharge(t,e){const n=this.view.overlay;return this.pickShown=null,n.clear(),n.ghost.visible=!1,this.tooltip.hide(),this.send(t.seat,bM(e))}end(){if(this.deploySeat()>=0){const t=this.send(this.deploySeat(),{t:"deployed"});return t||(this.sel=null,this.card.show(null),this.flow.refreshUI()),t}return this.myTurn()?(this.select(null),this.send(this.localSeat(),{t:"end"})):"no phase of a seat played here to end now"}auto(){return this.myTurn()?(this.select(null),this.send(this.localSeat(),{t:"auto"})):"no phase of a seat played here to play out now"}voters(){var e;const t=(e=this.G)==null?void 0:e.pending;return(t==null?void 0:t.k)==="roundLimit"&&this.session?this.session.localSeats.filter(n=>t.seats.includes(n)):[]}vote(t,e=null){if(this.mode()!=="roundLimit")return"no round-limit vote to make now";const n=this.voters().filter(s=>!e||e.includes(s));if(!n.length)return"no seat played here is still to vote";for(const s of n){const r=this.send(s,{t:"vote",more:t});if(r)return r}return null}advanceSel(){const t=this.sel;return!t||!this.myTurn()?"no unit of a seat played here to advance now":this.advance(t)}idled(){const t=this.view.overlay;this.sel&&this.myTurn()&&this.select(this.ask((n,s)=>s.canAct(n,this.sel))?this.sel:null);const e=this.picking();e&&this.pickShown!==e&&(this.pickShown=e,t.rangeRing.visible=!1,t.mask(e.ok,[255,150,60],this.G.nav,150),t.ghostAt(this.G.nav,e.cell,e.u.r))}listen(t){t.addEventListener("pointerdown",e=>{Ui(),this.downAt={x:e.clientX,y:e.clientY,b:e.button}}),t.addEventListener("pointerup",e=>{if(!this.downAt||e.button!==0)return;const n=Math.hypot(e.clientX-this.downAt.x,e.clientY-this.downAt.y);this.downAt=null,!(n>6)&&this.click(this.picker.pick(e))}),t.addEventListener("pointerleave",()=>{this.hoverPick=null,this.hover=null,this.pointed(),this.flow.refreshRings()}),t.addEventListener("pointermove",e=>{this.mouse={x:e.clientX,y:e.clientY},this.hoverPick=this.picker.pick(e),this.pointed()}),addEventListener("keydown",e=>{e.target.tagName!=="INPUT"&&e.key==="Escape"&&!this.picking()&&this.select(null)})}click({unit:t,ground:e}){if(this.tooltip.hide(),this.deploySeat()>=0)return this.deployClick(t,e);const n=this.picking();if(n){if(e){const o=Vu(this.G.nav,n.ok,e.x,e.z);o>=0&&this.placeCharge(o)}return}if(!this.myTurn()){t&&this.card.show(t);return}const s=this.sel,r=Jn(this.G);if(t&&t.side===this.localSeat()){this.ask((o,a)=>a.canAct(o,t))?(ge.click(),this.select(t)):this.card.show(t);return}if(r==="move"&&s&&e){const o=EM(a=>this.ask(a),this.reach,e);o>=0&&this.moveTo(s,o);return}if(r==="shoot"&&s&&t&&t.side!==s.side)return void this.shoot(s,t);if(r==="charge"&&s&&t&&t.side!==s.side)return void this.charge(s,t);t?this.card.show(t):e&&this.select(null)}deployClick(t,e){const n=this.deploySeat();if(n<0)return"no seat deploying here";if(t&&t.side===n)return ge.click(),this.sel=t,this.card.show(t),this.flow.refreshRings(),null;if(this.sel&&e){const s=this.sel,r=MM(o=>this.ask(o),s,e,n);if(r>=0){const o=this.send(n,SM(s,r));return o||(ge.click(),this.view.units.labelAll()),o}}return null}select(t){const e=this.G,n=this.view.overlay;if(this.sel=t,this.reach=null,n.clear(),t&&e){const s=Jn(e);e.turn.stage==="battle"&&s==="move"&&!t.flags.moved&&(this.reach=wM(r=>this.ask(r),t),n.reach(this.reach,e.nav)),s==="shoot"&&t.t.ranged&&this.showRange(t,t.t.ranged.range),s==="charge"&&this.showRange(t,Tr)}this.card.show(t),this.flow.refreshUI()}showRange(t,e){this.view.overlay.range(t.pos,t.r,e,Jn(this.G)==="charge"?"#ffb070":"#ffffff")}pointed(){const t=this.view.overlay,e=this.G;this.tooltip.hide(),t.pathLine.visible=!1,t.ghost.visible=!1;const n=this.hoverPick,s=this.picking();if(!n){s&&t.ghostAt(e.nav,s.cell,s.u.r);return}this.hover=n.unit;let r="";const o=this.sel,a=(l,c,h)=>{t.path(l),t.ghostAt(e.nav,c,h)};if(s&&n.ground){const l=Vu(e.nav,s.ok,n.ground.x,n.ground.z);l>=0?(a(this.ask(c=>c.nav.path(s.plan.res,l,s.u.r,s.plan.mode==="fly"?null:s.plan.forbid)),l,s.u.r),r=`End charge here · ${s.plan.res.dist[l].toFixed(1)}" of ${s.rolled}"`):r="✖ out of reach — pick a spot in the orange area"}else this.myTurn()&&o&&(r=this.ask((l,c)=>{const h=c.phaseKey(l);return h==="move"&&this.reach&&n.ground&&!n.unit?TM(l,c,this.reach,o,n.ground,a):h==="shoot"&&n.unit&&n.unit.side!==o.side?LM(l,c,o,n.unit):h==="charge"&&n.unit&&n.unit.side!==o.side?IM(l,c,o,n.unit):""}));if(!r&&n.unit){const l=this.view.units.shown(n.unit.id);r=`${n.unit.t.name} · ${n.unit.t.models>1?`${l.alive}/${n.unit.t.models} models`:`${l.models[0].w}/${n.unit.t.W} wounds`}`}r&&this.mouse&&this.tooltip.show(r,this.mouse)}}const Ud=i=>i.length===2&&i[0].race===i[1].race;function Wu(i){const t=Ud(i);return Object.freeze(i.map(({seat:e,race:n})=>{const s=An[n];return Object.freeze({name:s.name,short:s.short,icon:s.icon,color:t&&e===1?s.look.alt:s.look.team,dark:s.look.dark})}))}const _s=i=>i.map((t,e)=>({seat:e,race:t}));let fo=null;const Gu=i=>`rgba(${[1,3,5].map(t=>parseInt(i.slice(t,t+2),16)).join(", ")}, 0.45)`;function NM(i){const t=e=>document.querySelector(e);fo||(fo=document.createElement("style"),document.body.appendChild(fo)),fo.textContent=`#hud, #labels, #log, #card { --s0: ${i[0].color}; --s1: ${i[1].color}; --s0-glow: ${Gu(i[0].color)}; --s1-glow: ${Gu(i[1].color)}; }`;for(const e of[0,1]){const n=e?"#sideB":"#sideA";t(`${n} .ic`).textContent=i[e].icon,t(`${n} .nm`).textContent=i[e].name}}const zM=(i,t,e)=>e>=0&&Ud(i)?t[e].color:"",kM={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};function FM(i,t){const e=document.createElement("div");e.className=`die ${t}`;for(let n=0;n<9;n++){const s=document.createElement("i");kM[i].includes(n)&&(s.className="on"),e.appendChild(s)}return e}class BM{constructor(t){this.el=t}clear(t){this.el.innerHTML="";const e=document.createElement("div");e.className="tray-title",e.textContent=t,this.el.appendChild(e),this.el.classList.add("show")}hide(){this.el.classList.remove("show")}async row(t,e,n,{sum:s=!1,pass:r,note:o="",save:a=!1}={}){ge.dice(e.length);const l=document.createElement("div");l.className="tray-row";const c=document.createElement("span");c.className="lbl",c.textContent=t,l.appendChild(c);const h=document.createElement("span");h.className="dice",l.appendChild(h),e.slice(0,30).forEach((f,g)=>{const v=n?f>=n?a?"saved":"ok":"fail":r===!1?"fail":r?"ok":"plain",m=FM(f,v);m.style.animationDelay=`${g*.025/_e.speed}s`,h.appendChild(m)});const d=document.createElement("span");if(d.className="res",n){const f=Yn(e,n);d.textContent=a?`${f} saved`:`${f} ✓`,e.length>30&&(d.textContent+=` (of ${e.length})`)}else s&&(d.textContent=o||`= ${e.reduce((f,g)=>f+g,0)}`,r===!0&&d.classList.add("good"),r===!1&&d.classList.add("bad"));for(l.appendChild(d),this.el.appendChild(l);this.el.children.length>7;)this.el.children[1].remove();await Cn(gi.dice(e.length))}}class HM{constructor(t,e=()=>null){this.list=t,this.listener=e}write(t,e,n,s){const r=this.list,o=document.createElement("div");o.className=`entry s${t} ${n}`,o.innerHTML=e;const a=this.listener();for(a&&(a.reach(s),o.dataset.at=s),r.prepend(o);r.children.length>80;)r.lastChild.remove()}clear(){this.list.innerHTML=""}}const Od=Object.fromEntries(Ds.map(i=>[i.key,i.name])),[VM]=Ds.map(i=>i.key),WM=i=>({phaseShown:i.stage==="battle",buttonsUp:!1});function GM({G:i,mirror:t,session:e,input:n,hud:s}){var E,O;const{idle:r,decision:o,deploy:a,sel:l,pick:c}=n,{phaseShown:h,sides:u}=s,d=i.setup.rounds,f=b=>e.preview(b),g=(e==null?void 0:e.G)??null,v=(o==null?void 0:o.k)==="deploy",m=h&&(o==null?void 0:o.k)==="phase"&&t.stage==="battle"&&t.active===o.seats[0]&&t.phase===o.phase&&t.round===g.turn.round,p=h&&(o==null?void 0:o.k)==="chargeEnd"&&t.stage==="battle"&&t.active===o.seats[0]&&t.phase==="charge"&&t.round===g.turn.round,_=!m&&!p?!1:r?!0:s.buttonsUp,x=_&&!c,y={show:v||x,label:v?"Begin battle ▸":m?`End ${Od[o.phase]} ▸`:null,busy:!r,ready:m&&r?!f((b,w)=>w.anyCanAct(b,o.seats[0])):!1};y.lit=v||y.ready;const R={show:m?r?o.phase==="move"&&!!l&&!l.flags.moved&&!l.flags.advanced&&!f((b,w)=>w.isEngaged(b,l)):null:!1,label:l?l.t.chargeAfterAdvance?'Advance (+D6") — can still charge':`Advance (+D6") — no ${(E=l.t.ranged)!=null&&E.assault?"charge":"shooting or charge"} after`:null,busy:!r};let S=s.hint;return c?S=`Charge! Rolled ${c.rolled}" — click the orange area to place ${c.u.t.short}, or take the shortest move.`:v?S="Deployment — click one of your units, then click inside your shaded zone to move it there.":g&&h&&t.stage==="battle"&&g.seats[t.active].ctrl!=="human"?S=`${u[t.active].name} (AI) are taking their turn…`:g&&h&&t.stage==="battle"&&!e.localSeats.includes(t.active)?S=`${u[t.active].name} are taking their turn…`:g&&t.stage==="deploy"&&((O=g.pending)==null?void 0:O.k)==="deploy"&&e.localSeats.length&&!v?S="Waiting for the other side to finish deploying…":m&&(r||!l)?S={move:l?f((b,w)=>w.isEngaged(b,l))?"Engaged — click inside the red area to fall back (no shooting or charging after).":"Click inside the shaded area to move. Difficult ground costs double.":"Movement — pick a unit with a white ring to move it.",shoot:l?"Click an enemy unit to shoot it. Hover for odds.":"Shooting — pick a unit with a white ring to fire.",charge:l?'Click an enemy within 12" to declare a charge, then roll 2D6.':"Charge — pick a unit to charge with."}[o.phase]||"":m||(S=""),{vp:[t.vp[0],t.vp[1]],round:t.stage==="deploy"?"Deployment":t.round>d?`Round ${t.round} · overtime`:`Round ${t.round} / ${d}`,phase:t.stage==="battle"?t.phase:null,active:t.stage==="battle"?t.active:-1,end:y,auto:{show:x,busy:!r},advance:R,shortest:{show:!!c},zones:[0,1].map(b=>t.stage==="battle"||t.stage==="over"?.05:b===a?.2:.07),hint:S,rings:Nd({session:e,input:n}),buttonsUp:_}}function Nd({session:i,input:t}){const{mode:e,deploy:n,pick:s,sel:r,hover:o}=t,a=e!=="phase"?new Map:i.preview((l,c)=>{const h=c.phaseKey(l),u=new Map;for(const d of l.units)!c.alive(d)||d===r||(c.canAct(l,d)?u.set(d.id,["#ffffff",.75]):r&&h==="shoot"&&d.side!==r.side&&c.shotInfo(l,r,d).ok?u.set(d.id,["#ff5a4a",.95]):r&&h==="charge"&&d.side!==r.side&&c.chargeTargets(l,r).includes(d)&&u.set(d.id,["#ffa040",.95]));return u});return l=>l.id===(r==null?void 0:r.id)?["#ffe680",1]:n>=0&&l.u.side===n?["#ffffff",.5]:s&&l.id===s.tg.id?["#ffa040",.95]:a.has(l.id)?a.get(l.id):l.id===(o==null?void 0:o.id)?["#ffffff",.35]:["#ffffff",0]}const zd=(i,t)=>({side:t.side,moved:!!t.flags.moved,fellBack:!!t.flags.fellBack,advanced:!!t.flags.advanced,advRoll:t.flags.advRoll,shot:!!t.flags.shot,charged:!!t.flags.charged,cover:Yo(i,t)});function el(i){const t={};for(const e of i.units)t[e.id]=zd(i,e);return t}function $M(i,t){if(t.phase!==VM)return i;const e={};for(const[n,s]of Object.entries(i))e[n]=s.side===t.side?{...s,moved:!1,fellBack:!1,advanced:!1,advRoll:void 0,shot:!1,charged:!1}:s;return e}function jM(i,t,e){const n=[];e.moved&&n.push(e.fellBack?"fell back":e.advanced?`advanced +${e.advRoll}"`:"moved"),e.shot&&n.push("shot"),e.charged&&n.push("charged"),t.mesmerized&&n.push("🌀 mesmerized"),t.alive>0&&t.engaged&&n.push("⚔ in combat"),t.alive>0&&e.cover&&n.push("🛡 in cover");const s=i.models>1?`${t.alive}/${i.models} models`:`${t.models[0].w}/${i.W} wounds`;return`${t.alive>0?s:"destroyed"}${n.length?" · "+n.join(" · "):""}`}function XM(i){const t=i.turn;return{win:t.result.win,why:t.result.why,vp:[...t.vp],rounds:t.step==="rolloff"?0:t.round}}const $u=["M","WS","BS","S","T","W","A","Ld","Sv","OC"];class qM{constructor({el:t,sides:e,shown:n,live:s,ask:r,facts:o}){this.el=t,this.sides=e,this.shown=n,this.live=s,this.ask=r,this.facts=o,this.unit=null}get open(){return this.el.classList.contains("show")}show(t){var l;const e=this.el;if(this.unit=t,!t){e.classList.remove("show");return}const n=t.t,s=c=>c==="M"?`${n.M}"`:["WS","BS","Sv"].includes(c)?`${n[c]}+`:n[c],r=(c,h)=>{if(!c)return"";if(c.mesmerize)return`<div class="wpn"><span>${h} ${c.name}</span><em>spell ${c.spell}+ · ${c.range}" · D3 mortal + mesmerize</em></div>`;const u=[];return c.range&&u.push(`${c.range}"`),c.spell&&u.push(`spell ${c.spell}+`),c.blast?u.push(`blast ${c.blast}" ×${c.shots}`):c.shots&&u.push(`A${c.shots}`),u.push(`S${c.S}`,`AP-${c.AP}`,`D${c.D}`),c.poison&&u.push(`poison ${c.poison}+`),c.indirect&&u.push("indirect"),c.heavy&&u.push("heavy"),c.assault&&u.push("assault"),`<div class="wpn"><span>${h} ${c.name}</span><em>${u.join(" · ")}</em></div>`},o=this.shown(t),a=this.live()?this.ask(c=>zd(c,t)):this.facts()[t.id];e.innerHTML=`
    <div class="card-head s${t.side}"><b>${n.name}</b><span>${this.sides()[t.side].short} · ${n.role}</span></div>
    <div class="card-sub">${jM(n,o,a)}</div>
    <table class="stats"><tr>${$u.map(c=>`<th>${c}</th>`).join("")}</tr><tr>${$u.map(c=>`<td>${s(c)}</td>`).join("")}</tr></table>
    ${r(n.ranged,(l=n.ranged)!=null&&l.spell?"✦":"➹")}${r({...n.melee,range:0},"⚔")}
    <ul class="abil">${(n.abilities||[]).map(c=>`<li>${c}</li>`).join("")}</ul>`,e.classList.add("show")}}class YM{constructor(t){this.el=t}async show(t,e,n,s){const r=this.el;r.innerHTML=`<div class="b1">${t}</div><div class="b2">${e}</div>`,r.querySelector(".b1").style.color=n,r.classList.remove("show"),r.offsetWidth,r.classList.add("show"),await Cn(s)}hide(){this.el.classList.remove("show")}}class KM{constructor(t){this.el=t,this.timer=0}show(t,e=4e3){this.el.textContent=t,this.el.classList.add("show"),clearTimeout(this.timer),this.timer=setTimeout(()=>this.el.classList.remove("show"),e)}}const Ue=i=>document.querySelector(i);class JM{render(t){Ue("#vp0").textContent=t.vp[0],Ue("#vp1").textContent=t.vp[1],Ue("#round").textContent=t.round,document.querySelectorAll("#phases .ph").forEach(e=>{e.classList.toggle("on",e.dataset.k===t.phase)}),Ue("#sideA").classList.toggle("active",t.active===0),Ue("#sideB").classList.toggle("active",t.active===1),Ue("#hint").textContent=t.hint,Ue("#hint").style.display=t.hint?"":"none"}wire({rig:t}){const e=[1,2,4];Ue("#speed").onclick=()=>{_e.speed=e[(e.indexOf(_e.speed)+1)%e.length],Ue("#speed").textContent=`⏩ ${_e.speed}×`},Ue("#view").onclick=()=>t.nextView(),Ue("#follow").onclick=()=>{t.follow=!t.follow,Ue("#follow").classList.toggle("off",!t.follow)},Ue("#mute").textContent=Jb()?"🔇":"🔊",Ue("#mute").onclick=()=>{Ui(),Ue("#mute").textContent=Kb()?"🔇":"🔊"},Ue("#logToggle").onclick=()=>Ue("#log").classList.toggle("collapsed")}}const ri=i=>document.querySelector(i);class ZM{render(t){const e=ri("#endPhase"),n=ri("#autoPhase"),s=ri("#advance");e.style.display=t.end.show?"":"none",n.style.display=t.auto.show?"":"none",ri("#closestSpot").style.display=t.shortest.show?"":"none",t.end.label!==null&&(e.textContent=t.end.label),e.disabled=t.end.busy,e.classList.toggle("ready",t.end.lit),n.disabled=t.auto.busy,s.disabled=t.advance.busy,t.advance.show!==null&&(s.style.display=t.advance.show?"":"none"),t.advance.label!==null&&(s.textContent=t.advance.label)}wire(t){ri("#endPhase").onclick=()=>(Ui(),ge.click(),t.end()),ri("#closestSpot").onclick=()=>(ge.click(),t.takeShortest()),ri("#autoPhase").onclick=()=>t.auto(),ri("#advance").onclick=()=>t.advanceSel()}}const Ye=i=>document.querySelector(i);class QM{note(t){const e=document.createElement("p");e.className="small",e.textContent=t,Ye("#title .modes").before(e)}hide(){Ye("#title").classList.add("hidden"),document.body.classList.add("playing"),innerWidth<700&&Ye("#log").classList.add("collapsed")}show(){Ye("#title").classList.remove("hidden"),document.body.classList.remove("playing"),this.continued()}continued(){let t=null;try{t=JSON.parse(localStorage.getItem("ts.last")??"null")}catch{}const e=!!t&&t.status==="live"&&Date.now()-t.at<3*864e5&&/^[A-Za-z0-9]{8,64}$/.test(t.id)&&/^[0-9a-z]{8}$/.test(t.dev)&&(t.sync===null||/^wss?:\/\/\S+$/.test(t.sync)),n=Ye("#continue");n.classList.toggle("hidden",!e),e&&(n.querySelector("small").textContent=[typeof t.vs=="string"?`against ${t.vs}`:"watching",Number.isInteger(t.round)?`round ${t.round}`:""].filter(Boolean).join(" · "),n.onclick=()=>{Ui(),ge.click(),location.hash=`m=${t.id}&dev=${t.dev}${t.sync?`&sync=${encodeURIComponent(t.sync)}`:""}`})}wire({S:t,showTable:e,start:n,online:s,replay:r}){this.continued();const o=Ye("#replayFile");Ye("#openReplay").onclick=()=>{Ui(),ge.click(),o.value="",o.click()},o.onchange=async()=>{var l;const a=(l=o.files)==null?void 0:l[0];a&&r(await a.text())},Ye("#online").onclick=()=>{Ui(),ge.click(),s()},Ye("#seed").value=t.seed,Ye("#reroll").onclick=()=>{t.seed=Math.random()*1e6|0,Ye("#seed").value=t.seed,e(t.seed)},Ye("#seed").onchange=()=>{const a=(Number(Ye("#seed").value)||1)>>>0;e(a),t.seed=a,Ye("#seed").value=a},document.querySelectorAll("[data-mode]").forEach(a=>{a.onclick=()=>{Ui(),ge.click(),n(a.dataset.mode)}})}}const Te=i=>document.querySelector(i);class tS{get up(){return!Te("#over").classList.contains("hidden")}get voting(){return this.up&&!Te("#overVote").classList.contains("hidden")}show({win:t,why:e,vp:n,rounds:s},r,o){const a=t<0?"A bloody draw":`${r[t].name} win!`,l=s?`in round ${s}`:"in the deployment",c=e==="wipe"?`${r[1-t].name} have been wiped from the table ${l}.`:e==="concede"?`${r[1-t].name} conceded ${l}.`:`Final score ${n[0]} – ${n[1]} after ${s} round${s===1?"":"s"}.`,h=Te("#overTitle");h.textContent=`${t>=0?r[t].icon+" ":""}${a}`,h.style.color=o,Te("#overWhy").textContent=c,this.parts(!1),Te("#over").classList.remove("hidden"),ge.fanfare()}showVote({round:t,vp:e,votes:n,voters:s,canMore:r},o){const a=e[0]===e[1]?`Level at ${e[0]} – ${e[1]}.`:`${o[e[0]>e[1]?0:1].name} lead ${Math.max(...e)} – ${Math.min(...e)}.`,l=Te("#overTitle");l.textContent=`Round ${t} is over`,l.style.color="",Te("#overWhy").textContent=`${a} Play another round? It takes everyone's yes.`;const c=s.map(h=>`${o[h].name}: ${n[h]===void 0?"deciding…":n[h]?"keep playing":"end it"}`);Te("#overVotes").textContent=r?c.join(" · "):`The battle's log is nearly full: this round is the last. ${c.join(" · ")}`,Te("#keepPlaying").classList.toggle("hidden",!r),this.parts(!0),Te("#over").classList.remove("hidden")}hide(){Te("#over").classList.add("hidden")}parts(t){Te("#overVote").classList.toggle("hidden",!t),Te("#overVotes").classList.toggle("hidden",!t),Te("#again").classList.toggle("hidden",t),Te("#watchReplay").classList.toggle("hidden",t)}wire(t,e,n){Te("#again").onclick=t,Te("#watchReplay").onclick=()=>{this.hide(),n()},Te("#keepPlaying").onclick=()=>e(!0),Te("#endBattle").onclick=()=>e(!1)}}const po=i=>document.querySelector(i);function eS(){po("#helpBtn").onclick=()=>po("#help").classList.remove("hidden"),po("#helpClose").onclick=()=>po("#help").classList.add("hidden")}const rn=i=>document.querySelector(i);class nS{constructor(){this.root=rn("#replay"),this.slider=rn("#rpAt"),this.wait=0}get up(){return!this.root.classList.contains("hidden")}wire(t){rn("#rpStart").onclick=()=>t.start(),rn("#rpPlay").onclick=()=>t.play(),rn("#rpLive").onclick=()=>t.live(),rn("#rpSave").onclick=()=>t.save(),rn("#rpClose").onclick=()=>t.close();const e=()=>{clearTimeout(this.wait),this.wait=0,t.scrub(Number(this.slider.value))};this.slider.onpointerdown=()=>this.held=!0,this.slider.onpointerup=this.slider.onpointercancel=()=>this.held=!1,this.slider.oninput=()=>{this.label(Number(this.slider.value)),clearTimeout(this.wait),this.wait=setTimeout(e,250)},this.slider.onchange=e}render(t){this.m=t,this.slider.min=t.min,this.slider.max=t.max,!this.held&&!this.wait&&(this.slider.value=t.at,this.label(t.at)),rn("#rpPlay").textContent=t.playing?"⏸":"▶",rn("#rpPlay").title=t.playing?"Pause":"Play on from here",rn("#rpLive").classList.toggle("hidden",!t.live),rn("#rpLive").classList.toggle("on",t.atLive),rn("#rpClose").classList.toggle("hidden",!t.closable),this.root.classList.remove("hidden"),document.body.classList.add("replaying")}label(t){const e=this.m;e&&(rn("#rpLabel").textContent=e.live&&e.atLive&&t===e.max?`Live · move ${e.max-e.first+1}`:t<e.first?"Before the battle":`Move ${t-e.first+1} of ${e.max-e.first+1}`)}hide(){clearTimeout(this.wait),this.root.classList.add("hidden"),document.body.classList.remove("replaying")}}const Tl=Object.freeze(["id","s","d","p","h"]),ju=1024,kd=64,Xu=Object.freeze({open:Object.freeze({commit:"string"}),start:Object.freeze({core:"int",rules:"string",setup:"object",a:"string?"}),desync:Object.freeze({at:"string",mine:"string"}),final:Object.freeze({})}),iS=Object.freeze({final:Object.freeze(["p","h"])}),sS=Object.freeze(["desync","final"]),Al=i=>Number.isSafeInteger(i),mr=i=>typeof i=="string"&&i.length>0&&i.length<=kd,ec=i=>!!i&&typeof i=="object"&&!Array.isArray(i),rS=Object.freeze({int:Al,string:i=>typeof i=="string",object:ec}),oS=(i,t,e)=>`${i}.${t.toString(36)}.${e}`,aS=(i,t)=>({...i,...t}),Rl=i=>Us(i),qu=i=>Object.fromEntries(Object.entries(i).filter(([t])=>!Tl.includes(t)));function lS(i){if(!ec(i))return"not an object";if(!mr(i.id))return"no id";if(!Al(i.s)||i.s<-1)return"no seat";if(!mr(i.d))return"no device";for(const e of["p","h"])if(Object.hasOwn(i,e)&&!mr(i[e]))return`${e} is not a name`;const t=typeof i.t=="string"&&Object.hasOwn(Xu,i.t)?Xu[i.t]:null;if(t){if(i.s===-1===sS.includes(i.t))return`${i.t} for seat ${i.s}`;for(const e of iS[i.t]??[])if(!Object.hasOwn(i,e))return`${i.t} takes a ${e}`;for(const e of Object.keys(i))if(e!=="t"&&!Tl.includes(e)&&!Object.hasOwn(t,e))return`${i.t} takes no field "${e}"`;for(const[e,n]of Object.entries(t)){const s=n[n.length-1]==="?",r=n.replace("?","");if(Object.hasOwn(i,e)?!rS[r](i[e]):!s)return`${i.t} takes a ${r} ${e}`}return null}if(!sb.includes(i.t))return`no kind ${JSON.stringify(i.t)}`;if(i.s<0)return`${i.t} for seat ${i.s}`;for(const e of Object.keys(i))if(!(e==="t"||Tl.includes(e))&&!Al(i[e])&&typeof i[e]!="boolean")return`${i.t}'s ${e} is not a whole number`;return null}function cS(i){let t=0;for(let e=0;e<i.length;e++){const n=i.charCodeAt(e);n<128?t+=1:n<2048?t+=2:n>=55296&&n<56320&&(i.charCodeAt(e+1)&64512)===56320?(t+=4,e++):t+=3}return t}function Fd(i){if(i&&typeof i=="object"&&!Object.isFrozen(i)){Object.freeze(i);for(const t of Object.values(i))Fd(t)}return i}function Bd(i){if(typeof i!="string")return{bad:"not text",id:null};if(cS(i)>ju)return{bad:`over ${ju} bytes`,id:null};let t;try{t=JSON.parse(i)}catch{return{bad:"not JSON",id:null}}const e=ec(t)&&mr(t.id)?t.id:null,n=lS(t);if(n)return{bad:n,id:e};let s;try{s=Us(t)}catch{return{bad:"not canonical JSON",id:e}}return s!==i?{bad:"not canonical JSON",id:e}:Fd(t)}const Cl=Object.freeze(["deploy","roundLimit"]),hS=Object.freeze(["concede","desync","final"]),Pl=5e3,Yu=i=>{const t=i.turn;return`${t.stage}/${t.step}/${t.round}/${t.t}/${t.ph}/${t.overtime}`},uS=({id:i,heads:t,seats:e})=>Pr(JSON.stringify(e.map(n=>t[n]??i))).toString(36),Ku=(i,t)=>i===t||!!i&&!!t&&i.id===t.id&&JSON.stringify(i)===JSON.stringify(t),Hd=i=>Pr(JSON.stringify(i)).toString(36);function yS(i,t=new Map){return i.acceptedEntries().map(e=>(t.has(e.id)||t.set(e.id,Hd(e)),[e.id,t.get(e.id)]))}class Jo{constructor({out:t=null,onTrace:e=null,strict:n=!1}={}){this.opts={out:t,onTrace:e,strict:n},this.G=null,this.status="lobby",this.accepted=[],this.rejected=[],this.error=null,this.report=null,this.pushed=[],this.seen=new Set,this.known=null,this.openBy=null,this.last=null,this.simul=null,this.finals=new Set,this.syncing=!1,this.busy=!1}head(t){return this.simul?this.simul.heads[t]??this.simul.id:this.last}keep(t){if(this.pushed.length)throw new Error("Folder.keep comes before the first sync: the entries kept are held to the list as it is first folded");this.known=t!=null&&t.length?t:null}acceptedEntries(){const t=new Map;for(const e of this.pushed)!e.bad&&!t.has(e.id)&&t.set(e.id,e);return this.accepted.map(e=>t.get(e))}get count(){return this.pushed.length}push(t){if(this.busy)throw new Error("Folder.push is not reentrant: it was called while an entry was being folded or its events handed on");this.busy=!0;try{this.judge(t)}finally{this.busy=!1}}judge(t){if(this.pushed.push(t),this.pushed.length>Pl)return(this.status==="lobby"||this.status==="live")&&this.halt("full",{at:t.id??null,why:`the log ran past ${Pl} entries`}),this.inert(t);if(t.bad)return this.reject(t,`envelope: ${t.bad}`);if(this.seen.has(t.id))return this.reject(t,"envelope: an id seen before");if(this.seen.add(t.id),this.status==="lobby")return t.t==="open"&&this.openBy===null?(this.openBy=t.d,this.accept(t)):t.t==="start"&&(this.openBy===null||t.d===this.openBy)?this.begin(t):(t.t==="start"&&(this.error=`the log was opened by device ${this.openBy}: only its start counts`),this.inert(t));if(this.status==="over"){if(t.t==="desync"||t.t==="final")return this.outOfBand(t);const a=this.G.setup.seats[t.s];if(t.h!==void 0&&t.p===this.last&&t.t!=="concede"&&(a==null?void 0:a.ctrl)==="human"&&t.d===a.dev&&t.h!==Di(this.G))return this.freeze(t)}if(this.status!=="live")return this.inert(t);if(t.t==="open"||t.t==="start")return this.reject(t,`turn: the match has begun, so no ${t.t}`);if(hS.includes(t.t))return this.outOfBand(t);const e=this.G,n=e.pending;if(!n.seats.includes(t.s))return this.reject(t,`turn: seat ${t.s} has no decision to make`);if(t.d!==e.setup.seats[t.s].dev)return this.reject(t,`device: seat ${t.s} is not played from ${t.d}`);if(t.p!==this.head(t.s))return this.reject(t,`stale: seat ${t.s}'s head is ${this.head(t.s)}, not ${t.p}`);if(!Cl.includes(n.k)&&t.h!==Di(e))return this.freeze(t);const s=qu(t),r=bl(e,t.s,s);if(r)return this.reject(t,`illegal: ${r}`);const o=Yu(e);return _u(e,t.s,s),this.accept(t,n,o)}begin(t){if(t.core!==pr||t.rules!==dr)return this.error=`this battle was made with another version of the game (core ${t.core}, rules ${t.rules}; this is core ${pr}, rules ${dr})`,this.reject(t,`skew: ${this.error}`),this.halt("skew",{at:t.id,why:this.error});const e=Array.isArray(t.setup.seats)?t.setup.seats:[],n=e.findIndex(s=>(s==null?void 0:s.ctrl)==="human"&&!mr(s.dev));if(n>=0){const s=e[n].dev;return this.error=typeof s=="string"&&s?`seat ${n} names a device no entry can carry (${s.length} characters; at most ${kd})`:`seat ${n} is a human seat that names no device`,this.reject(t,`start: ${this.error}`)}try{this.G=wd(t.setup,{out:this.opts.out,onTrace:this.opts.onTrace,strict:this.opts.strict})}catch(s){return this.error=s.message,this.reject(t,`start: ${s.message}`)}return this.error=null,this.status="live",this.accept(t)}outOfBand(t){const e=this.G,n=e.setup.seats[t.s];if(!n||n.ctrl!=="human")return this.reject(t,`seat: ${t.t} from seat ${t.s}, which no human plays`);if(t.d!==n.dev)return this.reject(t,`device: seat ${t.s} is not played from ${t.d}`);if(t.t==="desync"){const a=this.pushed.find(l=>l.id===t.at&&!l.bad);return this.accept(t),this.halt("desync",{at:t.at,theirs:t.mine,mine:(a==null?void 0:a.h)??null,by:t.id,seat:t.s})}if(t.t==="final")return this.closing(t);const s=qu(t),r=bl(e,t.s,s);if(r)return this.reject(t,`illegal: ${r}`);const o=this.last;_u(e,t.s,s),this.accept(t),this.last=Pr(JSON.stringify([o,this.last,t.id])).toString(36)}closing(t){return this.finals.add(`${t.d} ${t.p}`),t.p!==this.last?this.reject(t,`stale: the match's head is ${this.last}, not ${t.p}`):t.h!==Di(this.G)?this.freeze(t):this.reject(t,`inert: the match is ${this.status}, its closing hash agreeing`)}freeze(t){return this.halt("desync",{at:t.id,theirs:t.h??null,mine:Di(this.G),by:"hash",seat:t.s})}halt(t,e){this.status=t;const n=this.G;this.report={status:t,...e,core:pr,rules:dr,count:this.pushed.length,setup:(n==null?void 0:n.setup)??null,entries:this.pushed.slice(),accepted:this.accepted.slice(),rejected:this.rejected.map(s=>({...s})),trace:n?n.journal.trace.slice(-50):[],state:n?Md(n):null}}accept(t,e=null,n=null){this.accepted.push(t.id),this.last=t.id;const s=this.G,r=s==null?void 0:s.pending,o=this.simul,a=!!r&&Cl.includes(r.k);o&&a&&(e==null?void 0:e.k)===r.k&&Yu(s)===n?o.heads[t.s]=t.id:(o&&(e&&(o.heads[t.s]=t.id),this.last=uS(o)),this.simul=a?{id:this.last,seats:[...r.seats],heads:{}}:null),s&&s.turn.stage==="over"&&this.status==="live"&&(this.status="over")}reject(t,e){this.rejected.push({id:t.id??null,why:e})}inert(t){this.reject(t,this.status==="lobby"?"inert: the match has not started":`inert: the match is ${this.status}`)}step(t,e,n){var o;const s=this.accepted.length;if(this.push(t),this.accepted.length===s||!((o=this.G)!=null&&o.out))return;const r=this.G.out.splice(0);if(e.push(...r),!!n){this.busy=!0;try{n(r,t)}finally{this.busy=!1}}}sync(t,e=null){if(this.syncing)throw new Error("Folder.sync is not reentrant: it was called again while it handed on an entry's events");this.syncing=!0;try{return this.fold(t,e)}finally{this.syncing=!1}}refoldFrom(){return{next:new Jo({...this.opts,out:null,onTrace:null}),from:0}}fold(t,e){const n=[];if(this.status==="tamper")return{events:n,reset:!1,undone:0};const s=t.length,r=this.pushed.length;let o=s>=r;for(let y=0;o&&y<r;y++)o=Ku(t[y],this.pushed[y]);if(o&&(r||!this.known)){for(let y=r;y<s;y++)this.step(t[y],n,e);return{events:n,reset:!1,undone:0}}const a=(y,R)=>{const S=new Map;for(let E=0;E<R;E++)!y[E].bad&&!S.has(y[E].id)&&S.set(y[E].id,{e:y[E],i:E});return S},l=a(t,s),c=a(this.pushed,r),h={gone:[],moved:[]},u=(y,R)=>{let S=-1;for(const E of y){const O=l.get(E);!O||!R(E,O.e)?h.gone.push(E):(O.i<S&&h.moved.push(E),S=O.i)}};if(this.known){const y=new Map(this.known);u(this.known.map(([R])=>R),(R,S)=>Hd(S)===y.get(R))}if(u(this.accepted,(y,R)=>Ku(R,c.get(y).e)),h.gone.length||h.moved.length)return this.halt("tamper",h.gone.length?{at:h.gone[0],gone:h.gone}:{at:h.moved[0],moved:h.moved}),{events:n,reset:!1,undone:0};if(!r){for(let y=0;y<s;y++)this.step(t[y],n,e);return{events:n,reset:!1,undone:0}}const d=this.accepted,{next:f,from:g}=this.refoldFrom();let v=!1,m=!1;const p=()=>{v=!0,f.G&&Object.assign(f.G,{out:this.opts.out?[]:null,onTrace:this.opts.onTrace}),Object.assign(this,{...f,opts:this.opts,syncing:!0,known:this.known})};d.length||p();for(let y=g;y<s;y++){const R=t[y];if(v){this.step(R,n,e);continue}const S=f.accepted.length;f.push(R),!(m||f.accepted.length===S)&&(f.accepted[S]!==d[S]?m=!0:S+1===d.length&&p())}const _=!v;_&&p();const x=new Set(this.accepted);return{events:n,reset:_,undone:_?d.filter(y=>!x.has(y)).length:0}}}class nc{constructor({store:t,localSeats:e=[],dev:n="local",rand:s=()=>"0",sink:r=null,onTrace:o=null,strict:a=!1,closing:l=!1,known:c=null}){if(!Number.isInteger(t.length))throw new Error("a MatchStore tells its length (match/store.js)");this.store=t,this.localSeats=Object.freeze([...e]),this.dev=n,this.rand=s,this.sink=r,this.closing=l,this.folder=new Jo({out:[],onTrace:o,strict:a}),this.folder.keep(c),this.told=null,this.unsent=null,this.saidAt=null,this.n=t.length,this.folding=!1,this.again=!1,this.dirty=!1,this.shown=this.folder.status,this.queue=[],this.off=t.subscribe(()=>this.onChange()),this.onChange()}get G(){return this.folder.G}get status(){return this.folder.status}get error(){return this.unsent??this.folder.error}get report(){return this.folder.report}get accepted(){return this.folder.accepted}get rejected(){return this.folder.rejected}get count(){return this.folder.count}decisionFor(){var e;const t=(e=this.G)==null?void 0:e.pending;return(t==null?void 0:t.seats.find(n=>this.localSeats.includes(n)))??-1}preview(t){if(!this.G)throw new Error("no match to preview: the store has no start yet");return Sr(this.G,t)}legal(t,e){var n;return this.status!=="live"?`the match is ${this.status}`:this.localSeats.includes(t)?((n=this.G.setup.seats[t])==null?void 0:n.dev)!==this.dev?`seat ${t} is played from another device`:(e==null?void 0:e.t)!=="concede"&&!Sb(this.G).includes(t)?`seat ${t} has no decision to make now`:bl(this.G,t,e):`seat ${t} is not played on this device`}submit(t,e){!this.folding&&this.queue.length&&this.onChange();const n=this.legal(t,e);if(n)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: ${n}`);if(this.folding){this.queue.push({seat:t,body:{...e}});return}const s=this.send(t,e);if(s)throw new Error(`seat ${t} can't send ${JSON.stringify(e)}: its entry would be refused (${s})`)}send(t,e){const n=this.G.pending,s=e.t==="concede";return this.append(e,{s:t,p:s?void 0:this.folder.head(t),h:s||Cl.includes(n.k)?void 0:Di(this.G)})}open(t){if(this.store.length)throw new Error("an online log opens before anything else is written to it");const e=this.append({t:"open",commit:t},{s:-1});if(e)throw new Error(`the log can't open: ${e}`)}start(t,{a:e}={}){if(this.status!=="lobby")throw new Error(`the match has started already (${this.status})`);if(this.folding){this.queue.push({seat:-1,body:{t:"start",setup:t,a:e}});return}this.begin(t,e)}begin(t,e){this.unsent=null,this.unsent=this.append({t:"start",core:pr,rules:dr,setup:t,a:e},{s:-1,p:this.folder.head(-1)??void 0})}append(t,e){const n=aS(t,{id:oS(this.dev,this.n,this.rand()),d:this.dev,...e});let s;try{s=Rl(n)}catch(o){return o.message}const r=Bd(s);return r.bad?r.bad:(this.n++,this.store.append(s),null)}drain(){const{seat:t,body:e}=this.queue.shift();if(t===-1&&e.t==="start"){this.status!=="lobby"?this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.dropped)==null?void 0:r.call(s,t,e,`the match has started already (${this.status})`,this)}):this.begin(e.setup,e.a);return}const n=this.legal(t,e)??this.send(t,e);n&&this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.dropped)==null?void 0:r.call(s,t,e,n,this)})}call(t){try{t()}catch(e){return this.failed??(this.failed=e),!1}return!0}onChange(){if(this.folding){this.again=!0;return}this.folding=!0,this.again=!0,this.failed=null;try{for(;;)if(this.again)this.call(()=>this.pass())||(this.dirty=!0);else if(this.status!==this.shown)this.shown=this.status,this.call(()=>{var e,n;return(n=(e=this.sink)==null?void 0:e.status)==null?void 0:n.call(e,this.status,this)});else if(!this.tell()&&!this.final())if(this.queue.length)this.drain();else if(this.dirty)this.dirty=!1,this.call(()=>{var e,n;return(n=(e=this.sink)==null?void 0:e.settled)==null?void 0:n.call(e,this)});else break}finally{this.folding=!1}const t=this.failed;if(this.failed=null,t)throw t}pass(){this.again=!1;const t=this.folder.count,{reset:e,undone:n}=this.folder.sync(this.store.entries(),s=>this.call(()=>{var r,o;return(o=(r=this.sink)==null?void 0:r.events)==null?void 0:o.call(r,s,this)}));e&&this.G&&this.call(()=>{var s,r;return(r=(s=this.sink)==null?void 0:s.reset)==null?void 0:r.call(s,this.G,this,{undone:n})}),(e||this.folder.count!==t)&&(this.dirty=!0),this.status!=="lobby"&&(this.unsent=null)}tell(){const t=this.folder.report;if(this.status!=="desync"||(t==null?void 0:t.by)!=="hash"||this.told===t.at)return!1;const e=this.localSeats.find(n=>{var s;return((s=this.G.setup.seats[n])==null?void 0:s.dev)===this.dev});return e===void 0?!1:(this.told=t.at,this.append({t:"desync",at:t.at,mine:t.mine},{s:e}),!0)}final(){const t=this.folder.last;if(!this.closing||this.status!=="over"||this.saidAt===t||this.folder.finals.has(`${this.dev} ${t}`))return!1;const e=this.localSeats.find(n=>{var s;return((s=this.G.setup.seats[n])==null?void 0:s.dev)===this.dev});return e===void 0?!1:(this.saidAt=t,!this.append({t:"final"},{s:e,p:t,h:Di(this.G)}))}close(){this.off()}}class ic{constructor(t=[]){this.kind="local",this.log=t.map(e=>typeof e=="string"?e:Rl(e)),this.decoded=[],this.subs=new Set}get length(){return this.log.length}entries(){for(let t=this.decoded.length;t<this.log.length;t++)this.decoded.push(Bd(this.log[t]));return this.decoded}append(t){this.log.push(typeof t=="string"?t:Rl(t));for(const e of[...this.subs])e()}subscribe(t){return this.subs.add(t),()=>this.subs.delete(t)}export(){return JSON.stringify(this.log)}}class fS{constructor({handlers:t,view:e=null,mirror:n=null,onIdle:s=null}){this.handlers={fallback:(r,o)=>this.fallback(r,o),...t},this.view=e,this.mirror=n,this.onIdle=s,this.observer=null,this.q=[],this.running=!1,this.table=0}get idle(){return!this.running&&!this.q.length}backlog(){let t=0;for(const e of this.q)t+=gi.cost(e);return t}push(t){for(const e of t)this.q.push(e);this.running||this.run()}snap(t,e=qn(t)){var n,s,r,o;this.table++,this.q.length=0,this.running=!1,this.mirror=e,(n=this.view)==null||n.rebuild(t,e),(r=(s=this.observer)==null?void 0:s.reset)==null||r.call(s,e),(o=this.onIdle)==null||o.call(this,{snap:!0,G:t})}run(){var e,n,s;const t=this.table;this.running=!0;try{for(;this.q.length;){const r=this.q.shift();this.mirror=Ed(this.mirror,r),(n=(e=this.observer)==null?void 0:e.event)==null||n.call(e,r,this.mirror);const o=(this.handlers[r.t]??this.handlers.fallback)(r,this.mirror);if(o&&typeof o.then=="function"){o.then(()=>t===this.table&&this.run(),a=>t===this.table&&this.fail(a));return}}}catch(r){return this.fail(r)}this.running=!1,(s=this.onIdle)==null||s.call(this)}fallback(t,e){var s,r;const n=t.u!==void 0&&e.units[t.u]?e.units[t.u].pos:{x:t.x??0,z:t.z??0};return t.text&&((r=(s=this.view)==null?void 0:s.text)==null||r.call(s,{x:n.x,y:1.6,z:n.z},t.text,"#ffffff")),Cn(t.beat??gi.beat)}fail(t){throw this.running=!1,this.q.length=0,t}}const nl={bushtail:["human","ai"],serpent:["ai","human"],hotseat:["human","human"],watch:["ai","ai"]},dS=Math.floor(.8*Pl),Ju="local",Li=i=>{const t=Sd(i);return{board:t.board,terrain:t.terrain,races:t.seats.map(e=>e.race)}},Zu=(i,t)=>JSON.stringify(Li(i))===JSON.stringify(Li(t)),il=i=>({...qn(i),stage:"title"});class pS{constructor({view:t,ui:e,params:n,seed:s,races:r}){this.view=t,this.ui=e,this.params=n,this.races=r,this.S={seed:s,control:["human","ai"]},this.session=null,this.G=null,this.battle=null,this.replay=null,this.backdrop=null,this.backdropAsDrawn=!0,this.traceListener=null,this.checkHook=null,this.sides=Wu(_s(r)),this.hud={phaseShown:!1,buttonsUp:!1,hint:""},this.shownHud=null,this.facts={},this.acted=[],this.onTrace=(o,a)=>{var l;/^act /.test(o)&&this.acted.push(Sr(a,el)),(l=this.traceListener)==null||l.line(o,a)},this.sink={events:(o,a)=>{this.G!==a.G&&(this.G=a.G,this.sameUnits(this.G));const l=this.acted.splice(0);o=o.map(c=>c.t==="act"?{...c,facts:l.shift()}:c.t==="pending"?{...c,facts:a.preview(el)}:c),this.traceListener&&(o=this.traceListener.present(o,this.G)),this.player.push(o)},settled:o=>{var a,l,c;o===this.battle&&(this.online&&this.catchUp(o),(l=(a=this.online)==null?void 0:a.settled)==null||l.call(a,o),(c=this.replay)==null||c.render())},reset:(o,a,{undone:l=0}={})=>{var c,h,u;this.G&&!Zu(this.G.setup,o.setup)&&this.redraw(),this.G=a.G,this.sameUnits(this.G),this.acted.length=0,(h=(c=this.traceListener)==null?void 0:c.rejoin)==null||h.call(c,o),this.player.snap(o,qn(o)),this.relog(a.folder.pushed),l>0&&((u=this.ui.toast)==null||u.show(`History changed: ${l} move${l===1?"":"s"} undone`))},status:(o,a)=>{var l,c;a===this.battle&&((c=(l=this.online)==null?void 0:l.status)==null||c.call(l,o,a))}},this.online=null,this.human=null,this.player=null}play(t){const{view:e,ui:n}=this;this.human=t;const s={...e.handlers({localSeats:()=>{var r;return((r=this.session)==null?void 0:r.localSeats)??[]}}),log:r=>n.log.write(r.side,r.html,r.cls,r.at),"tray.open":r=>n.tray.clear(r.title),dice:r=>n.tray.row(r.label,r.dice,r.need,r),act:r=>{r.facts&&(this.facts=r.facts)},pending:r=>{r.facts&&(this.facts=r.facts)},stage:r=>this.staged(r),"phase.start":r=>this.phaseBegun(r),"round.scored":r=>this.scored(r),"game.over":r=>this.over(r),check:r=>{var o;return(o=this.checkHook)==null?void 0:o.call(this,r)}};return this.player=new fS({handlers:s,view:e,onIdle:r=>this.idled(r)}),this.player}atTable(){return this.G??this.backdrop}unitById(t){return this.atTable().units.find(e=>e.id===t)}local(t){var e;return!!((e=this.session)!=null&&e.localSeats.includes(t))}ink(t){return zM(this.atTable().seats,this.sides,t)}seatPlayers(t){this.sides=Wu(t),NM(this.sides),this.view.table.paint(this.sides.map(e=>e.color))}staged(t){this.hud.phaseShown=!1,t.stage!=="deploy"&&this.human.select(null),this.refreshUI()}phaseBegun(t){this.facts=$M(this.facts,t),this.hud.phaseShown=!0,this.human.select(null),this.ui.tray.hide(),this.refreshUI();const e=this.player.mirror;return this.ui.banner.show(`${this.sides[t.side].icon} ${this.sides[t.side].name}`,Od[t.phase],this.ink(t.side),gi.phaseStart(this.local(e.active),e.stage))}scored(t){t.owners.forEach((n,s)=>{const r=Os.classic.objectives[s];n>=0&&this.view.effects.ring(r.x,r.z,Vo,this.sides[n].color,{life:1.6,fill:.15})}),this.refreshUI();const e=this.player.mirror;return this.ui.banner.show(`End of round ${t.round}`,`VP ${t.vp[0]} – ${t.vp[1]}`,this.ink(-1),gi.phaseStart(this.local(e.active),e.stage))}over(t){this.human.select(null),this.refreshUI(),this.ui.result.show(t,this.sides,this.ink(t.win))}idled({snap:t=!1,G:e=null}={}){var o;const n=this.traceListener,s=this.ui.card;_e.boost=1,n==null||n.idle(),t&&this.snapped(e);const r=!t&&s.unit&&this.unitById(s.unit.id);r&&r.t===s.unit.t&&r.side===s.unit.side&&s.open&&s.show(r),this.human.idled(),this.refreshUI(),n==null||n.settled(),(o=this.replay)==null||o.idled()}snapped(t){const e=this.player.mirror,n=this.view.overlay,s=this.human;Object.assign(this.hud,WM(e)),s.sel=(s.sel&&t.units.find(r=>r.id===s.sel.id))??null,s.reach=null,s.hover=s.hoverPick=null,s.pickShown=null,n.clear(),n.ghost.visible=!1,this.facts=Sr(t,el),e.stage==="over"&&(!this.ui.result.up||this.ui.result.voting)&&this.over(XM(t))}refreshUI(){var r,o;const{ui:t,view:e}=this,n=GM({G:this.atTable(),mirror:this.player.mirror,session:this.session,input:this.human.state(),hud:{...this.hud,sides:this.sides}});this.hud.buttonsUp=n.buttonsUp,this.hud.hint=n.hint,this.shownHud=n,t.hud.render(n),t.actions.render(n);const s=(o=(r=this.session)==null?void 0:r.G)==null?void 0:o.pending;if(this.player.idle&&(s==null?void 0:s.k)==="roundLimit"&&this.session.decisionFor()>=0){const a=this.session.G,l=[...Object.keys(s.votes).map(Number),...s.seats].sort((c,h)=>c-h);t.result.showVote({round:a.turn.round,vp:a.turn.vp,votes:s.votes,voters:l,canMore:this.session.count<dS},this.sides)}else t.result.voting&&t.result.hide();e.table.zones(n.zones),e.units.paintRings(n.rings)}refreshRings(){this.view.units.paintRings(this.rings())}rings(){return Nd({session:this.session,input:this.human.state()})}sameUnits(t){const e=this.view.units,n=r=>!e.get(r.id)||e.unit(r.id).t!==r.t||e.unit(r.id).side!==r.side,s=t.units.find(n);if(s||t.units.length!==e.views.size)throw new Error(`the battle's units are not the table's (${s?`unit ${s.id}, ${s.key} of seat ${s.side}`:`${t.units.length} units, ${e.views.size} figures`}): a battle starts on its own table (start())`)}showTable(t,{terrain:e="classic",races:n=this.races}={}){var l;const{view:s,ui:r,human:o}=this,a=wd({board:t,dice:0,terrain:e,seats:n.map(c=>({race:c,ctrl:"human"}))},{out:null});(l=this.session)==null||l.close(),this.session=null,this.battle=null,this.G=null,this.backdrop=a,this.backdropAsDrawn=!0,this.seatPlayers(_s(n)),s.units.dispose(),s.terrain.dispose(),o.sel=null,o.reach=null,s.overlay.clear(),r.log.clear(),r.tray.hide(),s.terrain.sync(a.terrain.chunks),s.table.scatterTufts(),this.player.snap(a,il(a)),s.objectives.reset(),this.refreshUI()}start(t){var h,u;const{view:e,ui:n,human:s}=this;if(!Object.hasOwn(nl,t))throw new Error(`no mode "${t}" (there are ${Object.keys(nl).join(", ")})`);const r=nl[t];(h=this.replay)==null||h.close(),this.online&&this.leaveOnline(),this.session&&this.showTable(this.S.seed);const o=(Number(this.params.get("dice"))||Math.random()*1e9|0)>>>0,a=r.includes("human")&&this.params.get("overtime")!=="never"?"vote":"never",l={board:this.S.seed,dice:o,terrain:"classic",rounds:Os.classic.rounds,overtime:a,diceMode:"shared",seats:this.races.map((d,f)=>r[f]==="human"?{race:d,ctrl:r[f],dev:Ju}:{race:d,ctrl:r[f]})};(!this.backdropAsDrawn||!Zu(this.backdrop.setup,l))&&this.showTable(l.board,Li(l)),this.S.control=[...r],s.sel=null,s.reach=null,this.seatPlayers(_s(l.seats.map(d=>d.race))),(u=this.traceListener)==null||u.begin(),this.acted.length=0,this.player.snap(this.backdrop,il(this.backdrop));const c=new ic;if(this.session=new nc({store:c,localSeats:r.flatMap((d,f)=>d==="human"?[f]:[]),dev:Ju,sink:this.sink,onTrace:this.onTrace}),this.battle=this.session,this.session.start(l),this.session.status!=="live"&&this.session.status!=="over"){const d=this.session.error;throw this.session.close(),this.session=null,this.showTable(this.backdrop.setup.board,Li(this.backdrop.setup)),new Error(`the battle could not start: ${d}`)}n.title.hide(),e.rig.setViews(Su({localSeats:this.session.localSeats,edges:[0,1].map(d=>br(this.session.G,d))})),this.refreshUI()}follow(t,e){var a,l,c,h;const{view:n,ui:s,human:r}=this,o=t.G;(a=this.replay)==null||a.close(),this.online&&this.leaveOnline(),this.showTable(o.setup.board,Li(o.setup)),this.session=t,this.battle=t,this.G=o,this.S.control=o.setup.seats.map(u=>u.ctrl),this.seatPlayers(_s(o.setup.seats.map(u=>u.race))),r.sel=null,r.reach=null,(l=this.traceListener)==null||l.begin(),(h=(c=this.traceListener)==null?void 0:c.rejoin)==null||h.call(c,o),this.acted.length=0,this.online=e,t.sink=this.sink,this.player.snap(o,qn(o)),this.relog(t.folder.pushed),s.title.hide(),n.rig.setViews(Su({localSeats:t.localSeats,edges:[0,1].map(u=>br(o,u))})),this.refreshUI()}redraw(){const t=this.session,e=this.battle;this.session=null;try{this.showTable(t.G.setup.board,Li(t.G.setup))}finally{this.session=t,this.battle=e,this.G=t.G}}hand(t){const e=this.session;!e||e===t||(e!==this.battle?e.close():e.sink={status:(n,s)=>{var r,o;return(o=(r=this.online)==null?void 0:r.status)==null?void 0:o.call(r,n,s)},settled:n=>{var s,r,o;(r=(s=this.online)==null?void 0:s.settled)==null||r.call(s,n),(o=this.replay)==null||o.render()}})}show(t){var e,n;this.hand(t),this.session=t,this.G=t.G,t.sink=this.sink,this.acted.length=0,this.ui.result.hide(),this.ui.banner.hide(),this.ui.tray.hide(),(n=(e=this.traceListener)==null?void 0:e.rejoin)==null||n.call(e,t.G),this.player.snap(t.G,qn(t.G)),this.relog(t.folder.pushed),this.refreshUI()}showStart(t,e){var s;this.hand(t),this.session=null;const n=this.battle;this.showTable(e.board,Li(e)),this.battle=n,this.ui.result.hide(),this.ui.banner.hide(),this.seatPlayers(_s(e.seats.map(r=>r.race))),(s=this.traceListener)==null||s.begin(),this.acted.length=0,this.player.snap(this.backdrop,il(this.backdrop)),this.session=t,t.sink=this.sink,this.refreshUI()}leaveOnline(){const t=this.online;this.online=null,_e.boost=1,t==null||t.leave()}relog(t){var s,r;const e=new Jo({out:[]}),n=[];for(const o of t){e.push(o);for(const a of((r=(s=e.G)==null?void 0:s.out)==null?void 0:r.splice(0))??[])a.t==="log"&&n.push(a)}this.ui.log.clear();for(const o of n.slice(-80))this.ui.log.write(o.side,o.html,o.cls,o.at)}catchUp(t){const e=this.player.backlog()/(_e.speed*Math.max(_e.rate,.05));e>30?(this.acted.length=0,this.player.snap(t.G,qn(t.G)),this.relog(t.folder.pushed)):_e.boost=e>16?4:e>8?2:1}back(){var t;(t=this.replay)==null||t.close(),this.online&&this.leaveOnline(),this.ui.result.hide(),this.ui.title.show(),this.view.rig.toTitle(),this.showTable(this.S.seed)}}const mS=400;class gS{constructor({flow:t,bar:e}){this.flow=t,this.bar=e,this.battle=null,this.shown=null,this.k=-1,this.playing=!1,this.timer=0,e.wire({start:()=>this.fromStart(),play:()=>this.playing?this.pause():this.play(),scrub:n=>this.scrub(n),live:()=>this.live(),save:()=>this.save(),close:()=>this.close({back:!0})})}get open(){return!!this.battle}moves(){return this.battle.folder.acceptedEntries()}first(t=this.moves()){return Math.max(0,t.findIndex(e=>e.t==="start"))}open(t,{live:e=!1}={}){this.battle!==t&&(this.close(),this.battle=t),this.isLive=e,this.render()}sessionTo(t,e=this.moves()){return new nc({store:new ic(e.slice(0,t+1)),dev:"replay"})}scrub(t){if(!this.battle)return;this.stopFeeding(),this.playing=!1;const e=this.moves(),n=this.first(e);if(t=Math.max(n-1,Math.min(e.length-1,Math.round(t))),t===e.length-1&&this.isLive)return this.live();this.goTo(t,e),this.render()}goTo(t,e){const n=this.sessionTo(t,e);this.k=t,this.shown=n,n.G?this.flow.show(n):this.flow.showStart(n,e[this.first(e)].setup)}fromStart(){if(!this.battle)return;const t=this.moves();this.stopFeeding(),this.goTo(this.first(t)-1,t),this.playing=!0,this.render(),this.idled()}play(){if(!this.battle)return;const t=this.moves();if(!this.shown||this.k>=t.length-1)return this.fromStart();this.playing=!0,this.render(),this.idled()}pause(){this.playing=!1,this.stopFeeding(),this.render()}live(){this.battle&&(this.stopFeeding(),this.playing=!1,this.shown=null,this.k=this.moves().length-1,this.flow.show(this.battle),this.render())}idled(){!this.playing||!this.shown||this.timer||(this.timer=setTimeout(()=>{var n;if(this.timer=0,!this.playing||!this.shown||!this.flow.player.idle)return;const t=this.moves(),e=this.shown.accepted;if(e.length!==this.k+1||e[this.k]!==((n=t[this.k])==null?void 0:n.id))return this.goTo(Math.min(this.k,t.length-1),t),this.render();if(this.k>=t.length-1)return this.isLive?this.live():(this.playing=!1,this.render());this.k++,this.shown.store.append(t[this.k]),this.render(),this.flow.player.idle&&this.idled()},mS/Math.max(1,_e.speed)))}stopFeeding(){clearTimeout(this.timer),this.timer=0}close({back:t=!1}={}){if(!this.battle)return;this.stopFeeding();const e=this.battle,n=this.shown;if(Object.assign(this,{battle:null,shown:null,playing:!1,k:-1}),this.bar.hide(),t&&e.status!=="over")return this.flow.back();t&&n?this.flow.show(e):n==null||n.close()}render(){if(!this.battle)return this.bar.hide();const t=this.moves(),e=this.first(t);this.shown||(this.k=t.length-1),this.bar.render({min:e-1,max:t.length-1,at:this.k,first:e,playing:this.playing,live:this.isLive,atLive:!this.shown,closable:!this.isLive})}file(){return JSON.stringify({replay:"tails-and-scales",version:1,core:pr,rules:dr,saved:new Date().toISOString(),log:JSON.parse(this.battle.store.export())})}save(){if(!this.battle)return;const t=URL.createObjectURL(new Blob([this.file()],{type:"application/json"})),e=document.createElement("a");e.href=t,e.download=`tails-and-scales-replay-${Date.now()}.json`,e.click(),setTimeout(()=>URL.revokeObjectURL(t),1e4)}}function vS(i){let t;try{t=JSON.parse(i)}catch{return{why:"it isn't a replay file (not JSON)"}}return(t==null?void 0:t.replay)!=="tails-and-scales"||!Array.isArray(t.log)?{why:"it isn't a Tails & Scales replay file"}:!t.log.length||t.log.length>6e3||!t.log.every(e=>typeof e=="string"&&e.length<=4096)?{why:"its log is empty, too long, or holds something other than entries"}:{store:new ic(t.log)}}const{W:mo,H:sl}=Qn,En=i=>document.querySelector(i);function xS(i,t){if(!i.has("races"))return iu;const e=i.get("races").split(",").map(s=>s.trim().toLowerCase());if(e.length===2&&e.every(s=>An[s]))return e;const n=`?races= takes two of ${Object.keys(An).join(", ")}, comma-separated, not "${i.get("races")}"`;return console.warn(`${n}: playing the classic matchup`),t.note(`${n}, so this is the classic matchup.`),iu}function _S(i){const t=new URLSearchParams(i.search),e=t.has("fast");let n=null;const s=p=>n.sides[p].color,r=new vM({lowfi:t.has("lowfi"),fast:e,W:mo,H:sl,deploy:Os.classic.deploy,edges:ed,objectives:Os.classic.objectives,range:Vo,colorOf:s}),o=(Number(t.get("seed"))||Math.random()*1e6|0)>>>0,a=new QM,l=xS(t,a),c={tray:new BM(En("#tray")),log:new HM(En("#logList"),()=>n.traceListener),card:new qM({el:En("#card"),sides:()=>n.sides,shown:p=>r.units.shown(p.id),live:()=>n.player.idle,ask:p=>Sr(n.atTable(),p),facts:()=>n.facts}),tooltip:new CM(En("#tooltip")),banner:new YM(En("#banner")),toast:new KM(En("#toast")),hud:new JM,actions:new ZM,title:a,result:new tS};n=new pS({view:r,ui:c,params:t,seed:o,races:l}),n.seatPlayers(_s(l)),r.figures({mirror:()=>n.player.mirror,colorOf:s,W:mo,H:sl,grid:jf(mo,sl,nd)});const h=new xM({camera:r.camera,units:r.units,board:r.table.board,unitOf:p=>n.unitById(p)}),u=new OM({flow:n,view:r,card:c.card,tooltip:c.tooltip,picker:h}),d=n.play(u);u.listen(r.renderer.domElement),c.actions.wire(u),c.hud.wire({rig:r.rig}),eS();let f=null;const g=p=>(async()=>{if(!f){const{Online:x,loadNet:y}=await Yd(async()=>{const{Online:R,loadNet:S}=await import("./online-DNATBTdV.js");return{Online:R,loadNet:S}},[],import.meta.url);await y(),f??(f=new x({flow:n,params:t}))}return p==="host"?f.host():f.route()})().catch(x=>{console.error(x),c.toast.show(`Online play failed: ${x.message}`,8e3)}),v=new gS({flow:n,bar:new nS});n.replay=v;const m=p=>{const{store:_,why:x}=vS(p),y=_&&new nc({store:_,dev:"replay"});if(!(y!=null&&y.G))return y==null||y.close(),c.toast.show(`That replay can't be watched: ${x??y.error??`the battle is ${y.status}`}`,8e3);n.follow(y,null),v.open(y),v.fromStart()};if(a.wire({S:n.S,showTable:p=>n.showTable(p),start:p=>n.start(p),online:()=>g("host"),replay:m}),c.result.wire(()=>n.back(),p=>u.vote(p),()=>{n.battle&&(v.open(n.battle),v.fromStart())}),n.showTable(n.S.seed),r.run({mirror:()=>d.mirror,sel:()=>{var p;return(p=u.sel)==null?void 0:p.id}}),t.has("watch")&&n.start("watch"),addEventListener("hashchange",()=>{(f||/[#&]m=/.test(i.hash))&&g()}),/[#&]m=/.test(i.hash)&&g(),t.has("debug")){const{alive:p,isEngaged:_,phaseKey:x,canAct:y,movePlan:R,validEnd:S,freeSpot:E,shotInfo:O,shootTargets:b,chargeTargets:w,chargePlan:k,rngState:$}=dd,{rig:et,scene:I,camera:F,controls:X,renderer:J,effects:Y,units:q,terrain:Q,shots:ot}=r,dt=()=>n.atTable(),G=new Set(["stage","round","active","first","phase","vp","wiped"]),Z=new Set(["titleSpin","titleAngle","viewShift","follow"]),pt=new Set(["sel","reach","hover","hoverPick","mouse"]),Et={busy:()=>!d.idle,auto:()=>!d.idle,deploySide:()=>u.deploySeat()<0?void 0:u.deploySeat()},Tt=[],Ut=[];let Dt=null;const Nt=()=>d.idle&&!Ut.length,Yt=D=>{if(Dt)return Dt.turn[D];const U=dt(),K=U.turn;return D==="stage"?n.G?K.stage==="over"&&!Nt()?"battle":K.stage:"title":D==="wiped"?K.wiped<0?void 0:K.wiped:D==="phase"?x(U):K[D]},B=new Proxy(n.S,{get:(D,U)=>G.has(U)?Yt(U):Object.hasOwn(Et,U)?Et[U]():Z.has(U)?et[U]:pt.has(U)?u[U]:D[U],has:(D,U)=>G.has(U)||Object.hasOwn(Et,U)||Z.has(U)||pt.has(U)||U in D,set:(D,U,K)=>{if(G.has(U))throw new Error(`__ts.S.${U} is the match's ${U==="phase"?"G.turn.ph (phaseKey)":`G.turn.${U}`}: it can't be set through S`);if(Object.hasOwn(Et,U))throw new Error(`__ts.S.${U} is derived from the Session and the player: it can't be set`);return Z.has(U)?et[U]=K:pt.has(U)?u[U]=K:D[U]=K,!0},ownKeys:D=>[...new Set([...Reflect.ownKeys(D),...pt,...G,...Object.keys(Et),...Z])],getOwnPropertyDescriptor:(D,U)=>G.has(U)?{value:Yt(U),enumerable:!0,configurable:!0,writable:!1}:Object.hasOwn(Et,U)?{value:Et[U](),enumerable:!0,configurable:!0,writable:!1}:Z.has(U)?{value:et[U],enumerable:!0,configurable:!0,writable:!0}:pt.has(U)?{value:u[U],enumerable:!0,configurable:!0,writable:!0}:Reflect.getOwnPropertyDescriptor(D,U)}),Ee=D=>{var U;return!!((U=D.out)!=null&&U.length)||!d.idle},It=(D,U)=>{const K=D.turn,j=/^over /.test(U)&&K.step==="score";return{turn:{stage:K.stage,round:j?K.round+1:K.round,active:K.active,phase:x(D),first:K.first,vp:[...K.vp],wiped:K.wiped<0?void 0:K.wiped},rng:$(D.rng),units:D.units.map(vt=>({...vt,pos:{...vt.pos},flags:{...vt.flags},models:vt.models.map(_t=>({..._t}))})),chunks:D.terrain.chunks.map(vt=>({id:vt.id,kind:vt.kind,alive:vt.alive,hp:vt.hp,shape:{...vt.shape}}))}},kt=(D,U)=>{Dt=U;try{Tt.push(D)}finally{Dt=null}},bt=[],se=[],zt=(D=()=>!0)=>new Promise(U=>{se.push({until:D,resolve:U}),n.traceListener.settled()});n.traceListener={rejoin:D=>{Tt.splice(0,Tt.length,...D.journal.trace),Ut.length=0,bt.length=0},begin:()=>{Tt.length=0,Ut.length=0,bt.length=0;for(const D of se.splice(0))D.resolve()},line:(D,U)=>{const K=/^log /.test(D)?null:It(U,D);/^(act|phase|over) /.test(D)&&bt.push({at:U.out.length,proj:qn(U),act:/^act /.test(D)}),Ut.length||Ee(U)?Ut.push([D,K]):kt(D,K)},reach:D=>{for(;Tt.length<D&&Ut.length;)kt(...Ut.shift())},idle:()=>{for(;Ut.length;)kt(...Ut.shift())},settled:()=>{if(d.idle)for(const D of se.splice(0)){let U=!0;try{U=D.until()}catch{}U?D.resolve():se.push(D)}},present:(D,U)=>{const K=[],j=bt.filter(_t=>_t.act).map(_t=>_t.proj);let vt=0;for(D.forEach((_t,Rt)=>{for(;vt<bt.length&&bt[vt].at<=Rt;)K.push({t:"check",proj:bt[vt++].proj});K.push(_t.t==="act"?{..._t,proj:j.shift()}:_t)});vt<bt.length;)K.push({t:"check",proj:bt[vt++].proj});return K.push({t:"check",proj:qn(U)}),bt.length=0,K}};const A=(D,U)=>{if(D)throw new Error(`?debug ${U}: ${D}`)},M=D=>Sr(dt(),D),z=()=>{const D=new Df,U=new Proxy({},{get:()=>()=>{}}),K={M:null},j=new Id({scene:D,labels:document.createElement("div"),fx:U,mirror:()=>K.M,colorOf:_t=>n.sides[_t].color,W:mo}),vt={clear(){},held:()=>({marker:!1,thorns:0})};return{at:K,units:j,terrain:new Ld(D,U),shots:vt,effects:U}},it=(D,U,K)=>{D.at.M=K??qn(U);const j=K?U.terrain.chunks.filter(vt=>K.chunks[vt.id]).map(vt=>({...vt,alive:K.chunks[vt.id].alive,shape:{...vt.shape,y:K.chunks[vt.id].y}})):U.terrain.chunks;return r.rebuild(U,D.at.M,{chunks:j,terrain:D.terrain,units:D.units,shots:D.shots,effects:D.effects}),D.units.paintRings(n.rings()),D},tt=(D,U,K,j)=>({units:j.units.map(vt=>{const _t=D.get(vt.id);if(!_t)return{id:vt.id,view:null};const Rt=_t.ring,St=_t.hit;return{id:vt.id,ring:Rt.visible?{x:Rt.position.x,z:Rt.position.z,s:Rt.scale.x,op:Rt.material.opacity,col:Rt.material.color.getHexString()}:null,hit:St.visible&&St.parent?{x:St.position.x,y:St.position.y,z:St.position.z,sx:St.scale.x,sy:St.scale.y}:null,figures:_t.models.map(xt=>{var P;return(P=xt.mesh)!=null&&P.parent?{x:xt.mesh.position.x,y:xt.mesh.position.y,z:xt.mesh.position.z}:null}),label:{html:_t.label.innerHTML,display:_t.label.style.display||""}}}),chunks:j.terrain.chunks.map(vt=>({id:vt.id,...U.state(vt.id)})),shots:K.held()}),nt=(D,U,K,j)=>{if(typeof D=="number"&&typeof U=="number")Math.abs(D-U)<=1e-6||j.push(`${K}: ${D} | ${U}`);else if(D&&U&&typeof D=="object"&&typeof U=="object"){const vt=[...new Set([...Object.keys(D),...Object.keys(U)])];for(const _t of vt)nt(D[_t],U[_t],`${K}.${_t}`,j)}else D!==U&&j.push(`${K}: ${JSON.stringify(D)} | ${JSON.stringify(U)}`);return j};let At=null;const mt=(D=null)=>{const U=dt();if(!D&&!d.idle)throw new Error("?debug view.snapDiff: the player is still playing");const K=tt(q,Q,ot,U),j=it(z(),U,D);At=it(At??z(),U,D);const vt=[...nt(K,tt(j.units,j.terrain,j.shots,U),"fresh",[]),...nt(K,tt(At.units,At.terrain,At.shots,U),"kept",[])];return j.units.dispose(),j.terrain.dispose(),{diffs:vt.slice(0,12),n:vt.length,units:K.units.length,figures:K.units.reduce((_t,Rt)=>{var St;return _t+(((St=Rt.figures)==null?void 0:St.filter(Boolean).length)??0)},0),chunks:K.chunks.length,shown:K.chunks.filter(_t=>_t.shown).length}};window.__ts={S:B,clock:_e,camera:F,controls:X,renderer:J,trace:Tt,get G(){return n.G},get session(){return n.session},get net(){return f},goOnline:g,replay:v,watchFile:m,hash:()=>{var D;return(D=n.session)!=null&&D.G?Di(n.session.G):null},get hud(){return n.shownHud},get player(){return d},present:{listen(D){d.observer=D},card(D){var U;return c.card.show(D),((U=/class="card-sub">([^<]*)</.exec(En("#card").innerHTML))==null?void 0:U[1])??null}},get units(){return Dt?Dt.units:dt().units},get nav(){return dt().nav},scenery:{get chunks(){return Dt?Dt.chunks:dt().terrain.chunks},scene:I,blast(D,U,K,j,vt){if(n.G)throw new Error("?debug scenery.blast: only on the title screen (no battle)");const _t=[],Rt=n.backdrop.terrain.blast(D,U,K,j,vt,_t);return n.backdropAsDrawn=!1,d.push(_t),qi(n.backdrop),Rt}},validEnd:(D,U)=>M(K=>S(K,D,U)),get phaseResolve(){return u.myTurn()||null},get chargePick(){const D=u.picking();return D&&{u:D.u,plan:D.plan,ok:D.ok}},get roundLimit(){return u.mode()==="roundLimit"?u.voters():null},start:D=>n.start(D),select:D=>u.select(D),doMove:(D,U)=>(A(u.moveTo(D,U),"doMove"),zt()),doAdvance:D=>(A(u.advance(D),"doAdvance"),zt()),doShoot:(D,U)=>(A(u.shoot(D,U),"doShoot"),zt()),doCharge:(D,U)=>{A(u.charge(D,U),"doCharge");const K=n.session;return zt(()=>{var j;return K!==n.session||((j=K.G.pending)==null?void 0:j.k)!=="chargeEnd"})},placeCharge:D=>(A(u.placeCharge(D),"placeCharge"),zt()),deployClick:(D,U)=>A(u.deployClick(D,U),"deployClick"),endPhase:()=>(A(En("#endPhase").onclick(),"endPhase"),zt()),autoPhase:()=>(A(En("#autoPhase").onclick(),"autoPhase"),zt()),vote:(D,U)=>(A(U===void 0?En(D?"#keepPlaying":"#endBattle").onclick():u.vote(D,[U]),"vote"),zt()),q:{alive:p,isEngaged:D=>M(U=>_(U,D)),canAct:D=>M(U=>y(U,D)),movePlan:(D,U)=>M(K=>R(K,D,U)),freeSpot:(D,U,K,j,vt)=>M(_t=>E(_t,D,U,K,j,vt)),shootTargets:D=>M(U=>b(U,D)),shotInfo:(D,U)=>M(K=>O(K,D,U)),chargeTargets:D=>M(U=>w(U,D)),chargePlan:(D,U)=>M(K=>k(K,D,U)),rngState:()=>Dt?Dt.rng:$(dt().rng)},screen(D,U,K){const j=new C(D,U,K).project(F);return[(j.x*.5+.5)*innerWidth,(-j.y*.5+.5)*innerHeight]},view:{snapDiff:mt,pauseAtChecks(D){n.checkHook=D},counts:()=>{let D=0;return I.traverse(U=>U.userData.fig&&D++),{scene:I.children.length,terrain:Q.group.children.length,figures:D,labels:r.stage.overlay.children.length,marks:Y.decals.length}}}}}}_S(location);export{pr as C,Os as M,An as R,nc as S,Yd as _,dr as a,Cl as b,wd as c,Bd as d,Rl as e,Us as f,yS as k,Di as s};
