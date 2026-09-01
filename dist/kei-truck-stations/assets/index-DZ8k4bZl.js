(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sl="160",os={ROTATE:0,DOLLY:1,PAN:2},rs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},jd=0,Pl=1,qd=2,Nh=1,Oh=2,ei=3,ri=0,rn=1,Yt=2,wi=0,Bs=1,Ll=2,Dl=3,Il=4,Yd=5,zi=100,$d=101,Kd=102,kl=103,Ul=104,Zd=200,Jd=201,Qd=202,eu=203,Ga=204,Va=205,tu=206,nu=207,iu=208,su=209,ou=210,ru=211,au=212,lu=213,cu=214,hu=0,du=1,uu=2,Mr=3,fu=4,pu=5,mu=6,gu=7,Fh=0,_u=1,vu=2,Mi=0,xu=1,yu=2,wu=3,zh=4,Mu=5,bu=6,Bh=300,Vs=301,Ws=302,br=303,Wa=304,Or=306,Sr=1e3,Pn=1001,Xa=1002,sn=1003,Nl=1004,ea=1005,wn=1006,Su=1007,So=1008,bi=1009,Eu=1010,Tu=1011,ol=1012,Hh=1013,vi=1014,xi=1015,Eo=1016,Gh=1017,Vh=1018,Xi=1020,Au=1021,Ln=1023,Ru=1024,Cu=1025,ji=1026,Xs=1027,Pu=1028,Wh=1029,Lu=1030,Xh=1031,jh=1033,ta=33776,na=33777,ia=33778,sa=33779,Ol=35840,Fl=35841,zl=35842,Bl=35843,qh=36196,Hl=37492,Gl=37496,Vl=37808,Wl=37809,Xl=37810,jl=37811,ql=37812,Yl=37813,$l=37814,Kl=37815,Zl=37816,Jl=37817,Ql=37818,ec=37819,tc=37820,nc=37821,oa=36492,ic=36494,sc=36495,Du=36283,oc=36284,rc=36285,ac=36286,Yh=3e3,qi=3001,Iu=3200,ku=3201,$h=0,Uu=1,bn="",Lt="srgb",ai="srgb-linear",rl="display-p3",Fr="display-p3-linear",Er="linear",vt="srgb",Tr="rec709",Ar="p3",as=7680,lc=519,Nu=512,Ou=513,Fu=514,Kh=515,zu=516,Bu=517,Hu=518,Gu=519,cc=35044,hc="300 es",ja=1035,ni=2e3,Rr=2001;class ts{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let dc=1234567;const mo=Math.PI/180,To=180/Math.PI;function ns(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Kt[i&255]+Kt[i>>8&255]+Kt[i>>16&255]+Kt[i>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]).toLowerCase()}function kt(i,e,t){return Math.max(e,Math.min(t,i))}function al(i,e){return(i%e+e)%e}function Vu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Wu(i,e,t){return i!==e?(t-i)/(e-i):0}function go(i,e,t){return(1-t)*i+t*e}function Xu(i,e,t,n){return go(i,e,1-Math.exp(-t*n))}function ju(i,e=1){return e-Math.abs(al(i,e*2)-e)}function qu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Yu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function $u(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Ku(i,e){return i+Math.random()*(e-i)}function Zu(i){return i*(.5-Math.random())}function Ju(i){i!==void 0&&(dc=i);let e=dc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Qu(i){return i*mo}function ef(i){return i*To}function qa(i){return(i&i-1)===0&&i!==0}function tf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Cr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function nf(i,e,t,n,s){const r=Math.cos,a=Math.sin,l=r(t/2),c=a(t/2),h=r((e+n)/2),d=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),p=r((n-e)/2),_=a((n-e)/2);switch(s){case"XYX":i.set(l*d,c*u,c*f,l*h);break;case"YZY":i.set(c*f,l*d,c*u,l*h);break;case"ZXZ":i.set(c*u,c*f,l*d,l*h);break;case"XZX":i.set(l*d,c*_,c*p,l*h);break;case"YXY":i.set(c*p,l*d,c*_,l*h);break;case"ZYZ":i.set(c*_,c*p,l*d,l*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Rs(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Jt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const vr={DEG2RAD:mo,RAD2DEG:To,generateUUID:ns,clamp:kt,euclideanModulo:al,mapLinear:Vu,inverseLerp:Wu,lerp:go,damp:Xu,pingpong:ju,smoothstep:qu,smootherstep:Yu,randInt:$u,randFloat:Ku,randFloatSpread:Zu,seededRandom:Ju,degToRad:Qu,radToDeg:ef,isPowerOfTwo:qa,ceilPowerOfTwo:tf,floorPowerOfTwo:Cr,setQuaternionFromProperEuler:nf,normalize:Jt,denormalize:Rs};class de{constructor(e=0,t=0){de.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(kt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ze{constructor(e,t,n,s,r,a,l,c,h){Ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,l,c,h)}set(e,t,n,s,r,a,l,c,h){const d=this.elements;return d[0]=e,d[1]=s,d[2]=l,d[3]=t,d[4]=r,d[5]=c,d[6]=n,d[7]=a,d[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],l=n[3],c=n[6],h=n[1],d=n[4],u=n[7],f=n[2],p=n[5],_=n[8],v=s[0],g=s[3],m=s[6],y=s[1],x=s[4],M=s[7],L=s[2],R=s[5],C=s[8];return r[0]=a*v+l*y+c*L,r[3]=a*g+l*x+c*R,r[6]=a*m+l*M+c*C,r[1]=h*v+d*y+u*L,r[4]=h*g+d*x+u*R,r[7]=h*m+d*M+u*C,r[2]=f*v+p*y+_*L,r[5]=f*g+p*x+_*R,r[8]=f*m+p*M+_*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],l=e[5],c=e[6],h=e[7],d=e[8];return t*a*d-t*l*h-n*r*d+n*l*c+s*r*h-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],l=e[5],c=e[6],h=e[7],d=e[8],u=d*a-l*h,f=l*c-d*r,p=h*r-a*c,_=t*u+n*f+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=u*v,e[1]=(s*h-d*n)*v,e[2]=(l*n-s*a)*v,e[3]=f*v,e[4]=(d*t-s*c)*v,e[5]=(s*r-l*t)*v,e[6]=p*v,e[7]=(n*c-h*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,l){const c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*l)+a+e,-s*h,s*c,-s*(-h*a+c*l)+l+t,0,0,1),this}scale(e,t){return this.premultiply(ra.makeScale(e,t)),this}rotate(e){return this.premultiply(ra.makeRotation(-e)),this}translate(e,t){return this.premultiply(ra.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ra=new Ze;function Zh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function sf(){const i=Pr("canvas");return i.style.display="block",i}const uc={};function _o(i){i in uc||(uc[i]=!0,console.warn(i))}const fc=new Ze().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),pc=new Ze().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Fo={[ai]:{transfer:Er,primaries:Tr,toReference:i=>i,fromReference:i=>i},[Lt]:{transfer:vt,primaries:Tr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Fr]:{transfer:Er,primaries:Ar,toReference:i=>i.applyMatrix3(pc),fromReference:i=>i.applyMatrix3(fc)},[rl]:{transfer:vt,primaries:Ar,toReference:i=>i.convertSRGBToLinear().applyMatrix3(pc),fromReference:i=>i.applyMatrix3(fc).convertLinearToSRGB()}},of=new Set([ai,Fr]),pt={enabled:!0,_workingColorSpace:ai,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!of.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Fo[e].toReference,s=Fo[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Fo[i].primaries},getTransfer:function(i){return i===bn?Er:Fo[i].transfer}};function Hs(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function aa(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ls;class Jh{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ls===void 0&&(ls=Pr("canvas")),ls.width=e.width,ls.height=e.height;const n=ls.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ls}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Pr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Hs(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Hs(t[n]/255)*255):t[n]=Hs(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let rf=0;class Qh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=ns(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,l=s.length;a<l;a++)s[a].isDataTexture?r.push(la(s[a].image)):r.push(la(s[a]))}else r=la(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function la(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Jh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let af=0;class an extends ts{constructor(e=an.DEFAULT_IMAGE,t=an.DEFAULT_MAPPING,n=Pn,s=Pn,r=wn,a=So,l=Ln,c=bi,h=an.DEFAULT_ANISOTROPY,d=bn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=ns(),this.name="",this.source=new Qh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=l,this.internalFormat=null,this.type=c,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof d=="string"?this.colorSpace=d:(_o("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=d===qi?Lt:bn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Sr:e.x=e.x-Math.floor(e.x);break;case Pn:e.x=e.x<0?0:1;break;case Xa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Sr:e.y=e.y-Math.floor(e.y);break;case Pn:e.y=e.y<0?0:1;break;case Xa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return _o("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Lt?qi:Yh}set encoding(e){_o("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===qi?Lt:bn}}an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=Bh;an.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,n=0,s=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,h=c[0],d=c[4],u=c[8],f=c[1],p=c[5],_=c[9],v=c[2],g=c[6],m=c[10];if(Math.abs(d-f)<.01&&Math.abs(u-v)<.01&&Math.abs(_-g)<.01){if(Math.abs(d+f)<.1&&Math.abs(u+v)<.1&&Math.abs(_+g)<.1&&Math.abs(h+p+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(h+1)/2,M=(p+1)/2,L=(m+1)/2,R=(d+f)/4,C=(u+v)/4,G=(_+g)/4;return x>M&&x>L?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=R/n,r=C/n):M>L?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=R/s,r=G/s):L<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(L),n=C/r,s=G/r),this.set(n,s,r,t),this}let y=Math.sqrt((g-_)*(g-_)+(u-v)*(u-v)+(f-d)*(f-d));return Math.abs(y)<.001&&(y=1),this.x=(g-_)/y,this.y=(u-v)/y,this.z=(f-d)/y,this.w=Math.acos((h+p+m-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class lf extends ts{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const s={width:e,height:t,depth:1};n.encoding!==void 0&&(_o("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===qi?Lt:bn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new an(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Qh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ki extends lf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class ed extends an{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=sn,this.minFilter=sn,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cf extends an{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=sn,this.minFilter=sn,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class vn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,l){let c=n[s+0],h=n[s+1],d=n[s+2],u=n[s+3];const f=r[a+0],p=r[a+1],_=r[a+2],v=r[a+3];if(l===0){e[t+0]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u;return}if(l===1){e[t+0]=f,e[t+1]=p,e[t+2]=_,e[t+3]=v;return}if(u!==v||c!==f||h!==p||d!==_){let g=1-l;const m=c*f+h*p+d*_+u*v,y=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const L=Math.sqrt(x),R=Math.atan2(L,m*y);g=Math.sin(g*R)/L,l=Math.sin(l*R)/L}const M=l*y;if(c=c*g+f*M,h=h*g+p*M,d=d*g+_*M,u=u*g+v*M,g===1-l){const L=1/Math.sqrt(c*c+h*h+d*d+u*u);c*=L,h*=L,d*=L,u*=L}}e[t]=c,e[t+1]=h,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){const l=n[s],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a],f=r[a+1],p=r[a+2],_=r[a+3];return e[t]=l*_+d*u+c*p-h*f,e[t+1]=c*_+d*f+h*u-l*p,e[t+2]=h*_+d*p+l*f-c*u,e[t+3]=d*_-l*u-c*f-h*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,l=Math.cos,c=Math.sin,h=l(n/2),d=l(s/2),u=l(r/2),f=c(n/2),p=c(s/2),_=c(r/2);switch(a){case"XYZ":this._x=f*d*u+h*p*_,this._y=h*p*u-f*d*_,this._z=h*d*_+f*p*u,this._w=h*d*u-f*p*_;break;case"YXZ":this._x=f*d*u+h*p*_,this._y=h*p*u-f*d*_,this._z=h*d*_-f*p*u,this._w=h*d*u+f*p*_;break;case"ZXY":this._x=f*d*u-h*p*_,this._y=h*p*u+f*d*_,this._z=h*d*_+f*p*u,this._w=h*d*u-f*p*_;break;case"ZYX":this._x=f*d*u-h*p*_,this._y=h*p*u+f*d*_,this._z=h*d*_-f*p*u,this._w=h*d*u+f*p*_;break;case"YZX":this._x=f*d*u+h*p*_,this._y=h*p*u+f*d*_,this._z=h*d*_-f*p*u,this._w=h*d*u-f*p*_;break;case"XZY":this._x=f*d*u-h*p*_,this._y=h*p*u-f*d*_,this._z=h*d*_+f*p*u,this._w=h*d*u+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],l=t[5],c=t[9],h=t[2],d=t[6],u=t[10],f=n+l+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-c)*p,this._y=(r-h)*p,this._z=(a-s)*p}else if(n>l&&n>u){const p=2*Math.sqrt(1+n-l-u);this._w=(d-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+h)/p}else if(l>u){const p=2*Math.sqrt(1+l-n-u);this._w=(r-h)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+d)/p}else{const p=2*Math.sqrt(1+u-n-l);this._w=(a-s)/p,this._x=(r+h)/p,this._y=(c+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(kt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,l=t._x,c=t._y,h=t._z,d=t._w;return this._x=n*d+a*l+s*h-r*c,this._y=s*d+a*c+r*l-n*h,this._z=r*d+a*h+n*c-s*l,this._w=a*d-n*l-s*c-r*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let l=a*e._w+n*e._x+s*e._y+r*e._z;if(l<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,l=-l):this.copy(e),l>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-l*l;if(c<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const h=Math.sqrt(c),d=Math.atan2(h,l),u=Math.sin((1-t)*d)/h,f=Math.sin(t*d)/h;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(t*Math.cos(s),n*Math.sin(r),n*Math.cos(r),t*Math.sin(s))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(e=0,t=0,n=0){A.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(mc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(mc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,l=e.z,c=e.w,h=2*(a*s-l*n),d=2*(l*t-r*s),u=2*(r*n-a*t);return this.x=t+c*h+a*u-l*d,this.y=n+c*d+l*h-r*u,this.z=s+c*u+r*d-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,l=t.y,c=t.z;return this.x=s*c-r*l,this.y=r*a-n*c,this.z=n*l-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ca.copy(this).projectOnVector(e),this.sub(ca)}reflect(e){return this.sub(ca.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(kt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ca=new A,mc=new vn;class is{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(En.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(En.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=En.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,l=r.count;a<l;a++)e.isMesh===!0?e.getVertexPosition(a,En):En.fromBufferAttribute(r,a),En.applyMatrix4(e.matrixWorld),this.expandByPoint(En);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zo.copy(n.boundingBox)),zo.applyMatrix4(e.matrixWorld),this.union(zo)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,En),En.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(to),Bo.subVectors(this.max,to),cs.subVectors(e.a,to),hs.subVectors(e.b,to),ds.subVectors(e.c,to),hi.subVectors(hs,cs),di.subVectors(ds,hs),Ci.subVectors(cs,ds);let t=[0,-hi.z,hi.y,0,-di.z,di.y,0,-Ci.z,Ci.y,hi.z,0,-hi.x,di.z,0,-di.x,Ci.z,0,-Ci.x,-hi.y,hi.x,0,-di.y,di.x,0,-Ci.y,Ci.x,0];return!ha(t,cs,hs,ds,Bo)||(t=[1,0,0,0,1,0,0,0,1],!ha(t,cs,hs,ds,Bo))?!1:(Ho.crossVectors(hi,di),t=[Ho.x,Ho.y,Ho.z],ha(t,cs,hs,ds,Bo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,En).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(En).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Yn=[new A,new A,new A,new A,new A,new A,new A,new A],En=new A,zo=new is,cs=new A,hs=new A,ds=new A,hi=new A,di=new A,Ci=new A,to=new A,Bo=new A,Ho=new A,Pi=new A;function ha(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Pi.fromArray(i,r);const l=s.x*Math.abs(Pi.x)+s.y*Math.abs(Pi.y)+s.z*Math.abs(Pi.z),c=e.dot(Pi),h=t.dot(Pi),d=n.dot(Pi);if(Math.max(-Math.max(c,h,d),Math.min(c,h,d))>l)return!1}return!0}const hf=new is,no=new A,da=new A;class zr{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):hf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;no.subVectors(e,this.center);const t=no.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(no,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(da.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(no.copy(e.center).add(da)),this.expandByPoint(no.copy(e.center).sub(da))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const $n=new A,ua=new A,Go=new A,ui=new A,fa=new A,Vo=new A,pa=new A;class Br{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,$n)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=$n.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):($n.copy(this.origin).addScaledVector(this.direction,t),$n.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ua.copy(e).add(t).multiplyScalar(.5),Go.copy(t).sub(e).normalize(),ui.copy(this.origin).sub(ua);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Go),l=ui.dot(this.direction),c=-ui.dot(Go),h=ui.lengthSq(),d=Math.abs(1-a*a);let u,f,p,_;if(d>0)if(u=a*c-l,f=a*l-c,_=r*d,u>=0)if(f>=-_)if(f<=_){const v=1/d;u*=v,f*=v,p=u*(u+a*f+2*l)+f*(a*u+f+2*c)+h}else f=r,u=Math.max(0,-(a*f+l)),p=-u*u+f*(f+2*c)+h;else f=-r,u=Math.max(0,-(a*f+l)),p=-u*u+f*(f+2*c)+h;else f<=-_?(u=Math.max(0,-(-a*r+l)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h):f<=_?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+h):(u=Math.max(0,-(a*r+l)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+h);else f=a>0?-r:r,u=Math.max(0,-(a*f+l)),p=-u*u+f*(f+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ua).addScaledVector(Go,f),p}intersectSphere(e,t){$n.subVectors(e.center,this.origin);const n=$n.dot(this.direction),s=$n.dot($n)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),l=n-a,c=n+a;return c<0?null:l<0?this.at(c,t):this.at(l,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,l,c;const h=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,f=this.origin;return h>=0?(n=(e.min.x-f.x)*h,s=(e.max.x-f.x)*h):(n=(e.max.x-f.x)*h,s=(e.min.x-f.x)*h),d>=0?(r=(e.min.y-f.y)*d,a=(e.max.y-f.y)*d):(r=(e.max.y-f.y)*d,a=(e.min.y-f.y)*d),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(l=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(l=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||l>s)||((l>n||n!==n)&&(n=l),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,$n)!==null}intersectTriangle(e,t,n,s,r){fa.subVectors(t,e),Vo.subVectors(n,e),pa.crossVectors(fa,Vo);let a=this.direction.dot(pa),l;if(a>0){if(s)return null;l=1}else if(a<0)l=-1,a=-a;else return null;ui.subVectors(this.origin,e);const c=l*this.direction.dot(Vo.crossVectors(ui,Vo));if(c<0)return null;const h=l*this.direction.dot(fa.cross(ui));if(h<0||c+h>a)return null;const d=-l*ui.dot(pa);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class mt{constructor(e,t,n,s,r,a,l,c,h,d,u,f,p,_,v,g){mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,l,c,h,d,u,f,p,_,v,g)}set(e,t,n,s,r,a,l,c,h,d,u,f,p,_,v,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=l,m[13]=c,m[2]=h,m[6]=d,m[10]=u,m[14]=f,m[3]=p,m[7]=_,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new mt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/us.setFromMatrixColumn(e,0).length(),r=1/us.setFromMatrixColumn(e,1).length(),a=1/us.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),l=Math.sin(n),c=Math.cos(s),h=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*d,p=a*u,_=l*d,v=l*u;t[0]=c*d,t[4]=-c*u,t[8]=h,t[1]=p+_*h,t[5]=f-v*h,t[9]=-l*c,t[2]=v-f*h,t[6]=_+p*h,t[10]=a*c}else if(e.order==="YXZ"){const f=c*d,p=c*u,_=h*d,v=h*u;t[0]=f+v*l,t[4]=_*l-p,t[8]=a*h,t[1]=a*u,t[5]=a*d,t[9]=-l,t[2]=p*l-_,t[6]=v+f*l,t[10]=a*c}else if(e.order==="ZXY"){const f=c*d,p=c*u,_=h*d,v=h*u;t[0]=f-v*l,t[4]=-a*u,t[8]=_+p*l,t[1]=p+_*l,t[5]=a*d,t[9]=v-f*l,t[2]=-a*h,t[6]=l,t[10]=a*c}else if(e.order==="ZYX"){const f=a*d,p=a*u,_=l*d,v=l*u;t[0]=c*d,t[4]=_*h-p,t[8]=f*h+v,t[1]=c*u,t[5]=v*h+f,t[9]=p*h-_,t[2]=-h,t[6]=l*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,p=a*h,_=l*c,v=l*h;t[0]=c*d,t[4]=v-f*u,t[8]=_*u+p,t[1]=u,t[5]=a*d,t[9]=-l*d,t[2]=-h*d,t[6]=p*u+_,t[10]=f-v*u}else if(e.order==="XZY"){const f=a*c,p=a*h,_=l*c,v=l*h;t[0]=c*d,t[4]=-u,t[8]=h*d,t[1]=f*u+v,t[5]=a*d,t[9]=p*u-_,t[2]=_*u-p,t[6]=l*d,t[10]=v*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(df,e,uf)}lookAt(e,t,n){const s=this.elements;return cn.subVectors(e,t),cn.lengthSq()===0&&(cn.z=1),cn.normalize(),fi.crossVectors(n,cn),fi.lengthSq()===0&&(Math.abs(n.z)===1?cn.x+=1e-4:cn.z+=1e-4,cn.normalize(),fi.crossVectors(n,cn)),fi.normalize(),Wo.crossVectors(cn,fi),s[0]=fi.x,s[4]=Wo.x,s[8]=cn.x,s[1]=fi.y,s[5]=Wo.y,s[9]=cn.y,s[2]=fi.z,s[6]=Wo.z,s[10]=cn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],l=n[4],c=n[8],h=n[12],d=n[1],u=n[5],f=n[9],p=n[13],_=n[2],v=n[6],g=n[10],m=n[14],y=n[3],x=n[7],M=n[11],L=n[15],R=s[0],C=s[4],G=s[8],b=s[12],T=s[1],z=s[5],V=s[9],ie=s[13],I=s[2],B=s[6],H=s[10],K=s[14],Z=s[3],J=s[7],te=s[11],ce=s[15];return r[0]=a*R+l*T+c*I+h*Z,r[4]=a*C+l*z+c*B+h*J,r[8]=a*G+l*V+c*H+h*te,r[12]=a*b+l*ie+c*K+h*ce,r[1]=d*R+u*T+f*I+p*Z,r[5]=d*C+u*z+f*B+p*J,r[9]=d*G+u*V+f*H+p*te,r[13]=d*b+u*ie+f*K+p*ce,r[2]=_*R+v*T+g*I+m*Z,r[6]=_*C+v*z+g*B+m*J,r[10]=_*G+v*V+g*H+m*te,r[14]=_*b+v*ie+g*K+m*ce,r[3]=y*R+x*T+M*I+L*Z,r[7]=y*C+x*z+M*B+L*J,r[11]=y*G+x*V+M*H+L*te,r[15]=y*b+x*ie+M*K+L*ce,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],l=e[5],c=e[9],h=e[13],d=e[2],u=e[6],f=e[10],p=e[14],_=e[3],v=e[7],g=e[11],m=e[15];return _*(+r*c*u-s*h*u-r*l*f+n*h*f+s*l*p-n*c*p)+v*(+t*c*p-t*h*f+r*a*f-s*a*p+s*h*d-r*c*d)+g*(+t*h*u-t*l*p-r*a*u+n*a*p+r*l*d-n*h*d)+m*(-s*l*d-t*c*u+t*l*f+s*a*u-n*a*f+n*c*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],l=e[5],c=e[6],h=e[7],d=e[8],u=e[9],f=e[10],p=e[11],_=e[12],v=e[13],g=e[14],m=e[15],y=u*g*h-v*f*h+v*c*p-l*g*p-u*c*m+l*f*m,x=_*f*h-d*g*h-_*c*p+a*g*p+d*c*m-a*f*m,M=d*v*h-_*u*h+_*l*p-a*v*p-d*l*m+a*u*m,L=_*u*c-d*v*c-_*l*f+a*v*f+d*l*g-a*u*g,R=t*y+n*x+s*M+r*L;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/R;return e[0]=y*C,e[1]=(v*f*r-u*g*r-v*s*p+n*g*p+u*s*m-n*f*m)*C,e[2]=(l*g*r-v*c*r+v*s*h-n*g*h-l*s*m+n*c*m)*C,e[3]=(u*c*r-l*f*r-u*s*h+n*f*h+l*s*p-n*c*p)*C,e[4]=x*C,e[5]=(d*g*r-_*f*r+_*s*p-t*g*p-d*s*m+t*f*m)*C,e[6]=(_*c*r-a*g*r-_*s*h+t*g*h+a*s*m-t*c*m)*C,e[7]=(a*f*r-d*c*r+d*s*h-t*f*h-a*s*p+t*c*p)*C,e[8]=M*C,e[9]=(_*u*r-d*v*r-_*n*p+t*v*p+d*n*m-t*u*m)*C,e[10]=(a*v*r-_*l*r+_*n*h-t*v*h-a*n*m+t*l*m)*C,e[11]=(d*l*r-a*u*r-d*n*h+t*u*h+a*n*p-t*l*p)*C,e[12]=L*C,e[13]=(d*v*s-_*u*s+_*n*f-t*v*f-d*n*g+t*u*g)*C,e[14]=(_*l*s-a*v*s-_*n*c+t*v*c+a*n*g-t*l*g)*C,e[15]=(a*u*s-d*l*s+d*n*c-t*u*c-a*n*f+t*l*f)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,l=e.y,c=e.z,h=r*a,d=r*l;return this.set(h*a+n,h*l-s*c,h*c+s*l,0,h*l+s*c,d*l+n,d*c-s*a,0,h*c-s*l,d*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,l=t._z,c=t._w,h=r+r,d=a+a,u=l+l,f=r*h,p=r*d,_=r*u,v=a*d,g=a*u,m=l*u,y=c*h,x=c*d,M=c*u,L=n.x,R=n.y,C=n.z;return s[0]=(1-(v+m))*L,s[1]=(p+M)*L,s[2]=(_-x)*L,s[3]=0,s[4]=(p-M)*R,s[5]=(1-(f+m))*R,s[6]=(g+y)*R,s[7]=0,s[8]=(_+x)*C,s[9]=(g-y)*C,s[10]=(1-(f+v))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=us.set(s[0],s[1],s[2]).length();const a=us.set(s[4],s[5],s[6]).length(),l=us.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Tn.copy(this);const h=1/r,d=1/a,u=1/l;return Tn.elements[0]*=h,Tn.elements[1]*=h,Tn.elements[2]*=h,Tn.elements[4]*=d,Tn.elements[5]*=d,Tn.elements[6]*=d,Tn.elements[8]*=u,Tn.elements[9]*=u,Tn.elements[10]*=u,t.setFromRotationMatrix(Tn),n.x=r,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,a,l=ni){const c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),f=(n+s)/(n-s);let p,_;if(l===ni)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(l===Rr)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,l=ni){const c=this.elements,h=1/(t-e),d=1/(n-s),u=1/(a-r),f=(t+e)*h,p=(n+s)*d;let _,v;if(l===ni)_=(a+r)*u,v=-2*u;else if(l===Rr)_=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*d,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=v,c[14]=-_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const us=new A,Tn=new mt,df=new A(0,0,0),uf=new A(1,1,1),fi=new A,Wo=new A,cn=new A,gc=new mt,_c=new vn;class Hr{constructor(e=0,t=0,n=0,s=Hr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],l=s[8],c=s[1],h=s[5],d=s[9],u=s[2],f=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(kt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,h),this._z=0);break;case"YXZ":this._x=Math.asin(-kt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(l,p),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(kt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-kt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(kt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-d,h),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(l,p));break;case"XZY":this._z=Math.asin(-kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,h),this._y=Math.atan2(l,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return gc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(gc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return _c.setFromEuler(this),this.setFromQuaternion(_c,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Hr.DEFAULT_ORDER="XYZ";class td{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ff=0;const vc=new A,fs=new vn,Kn=new mt,Xo=new A,io=new A,pf=new A,mf=new vn,xc=new A(1,0,0),yc=new A(0,1,0),wc=new A(0,0,1),gf={type:"added"},_f={type:"removed"};class Xt extends ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ff++}),this.uuid=ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xt.DEFAULT_UP.clone();const e=new A,t=new Hr,n=new vn,s=new A(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new mt},normalMatrix:{value:new Ze}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=Xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new td,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.multiply(fs),this}rotateOnWorldAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.premultiply(fs),this}rotateX(e){return this.rotateOnAxis(xc,e)}rotateY(e){return this.rotateOnAxis(yc,e)}rotateZ(e){return this.rotateOnAxis(wc,e)}translateOnAxis(e,t){return vc.copy(e).applyQuaternion(this.quaternion),this.position.add(vc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xc,e)}translateY(e){return this.translateOnAxis(yc,e)}translateZ(e){return this.translateOnAxis(wc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Kn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Xo.copy(e):Xo.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),io.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Kn.lookAt(io,Xo,this.up):Kn.lookAt(Xo,io,this.up),this.quaternion.setFromRotationMatrix(Kn),s&&(Kn.extractRotation(s.matrixWorld),fs.setFromRotationMatrix(Kn),this.quaternion.premultiply(fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(gf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_f)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Kn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Kn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Kn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,e,pf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,mf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const l=s[r];l.matrixWorldAutoUpdate===!0&&l.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(l=>({boxInitialized:l.boxInitialized,boxMin:l.box.min.toArray(),boxMax:l.box.max.toArray(),sphereInitialized:l.sphereInitialized,sphereRadius:l.sphere.radius,sphereCenter:l.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(l,c){return l[c.uuid]===void 0&&(l[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const l=this.geometry.parameters;if(l!==void 0&&l.shapes!==void 0){const c=l.shapes;if(Array.isArray(c))for(let h=0,d=c.length;h<d;h++){const u=c[h];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const l=[];for(let c=0,h=this.material.length;c<h;c++)l.push(r(e.materials,this.material[c]));s.material=l}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let l=0;l<this.children.length;l++)s.children.push(this.children[l].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let l=0;l<this.animations.length;l++){const c=this.animations[l];s.animations.push(r(e.animations,c))}}if(t){const l=a(e.geometries),c=a(e.materials),h=a(e.textures),d=a(e.images),u=a(e.shapes),f=a(e.skeletons),p=a(e.animations),_=a(e.nodes);l.length>0&&(n.geometries=l),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(l){const c=[];for(const h in l){const d=l[h];delete d.metadata,c.push(d)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Xt.DEFAULT_UP=new A(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const An=new A,Zn=new A,ma=new A,Jn=new A,ps=new A,ms=new A,Mc=new A,ga=new A,_a=new A,va=new A;let jo=!1;class Cn{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),An.subVectors(e,t),s.cross(An);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){An.subVectors(s,t),Zn.subVectors(n,t),ma.subVectors(e,t);const a=An.dot(An),l=An.dot(Zn),c=An.dot(ma),h=Zn.dot(Zn),d=Zn.dot(ma),u=a*h-l*l;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(h*c-l*d)*f,_=(a*d-l*c)*f;return r.set(1-p-_,_,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Jn)===null?!1:Jn.x>=0&&Jn.y>=0&&Jn.x+Jn.y<=1}static getUV(e,t,n,s,r,a,l,c){return jo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jo=!0),this.getInterpolation(e,t,n,s,r,a,l,c)}static getInterpolation(e,t,n,s,r,a,l,c){return this.getBarycoord(e,t,n,s,Jn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Jn.x),c.addScaledVector(a,Jn.y),c.addScaledVector(l,Jn.z),c)}static isFrontFacing(e,t,n,s){return An.subVectors(n,t),Zn.subVectors(e,t),An.cross(Zn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return An.subVectors(this.c,this.b),Zn.subVectors(this.a,this.b),An.cross(Zn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Cn.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,s,r){return jo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jo=!0),Cn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}getInterpolation(e,t,n,s,r){return Cn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,l;ps.subVectors(s,n),ms.subVectors(r,n),ga.subVectors(e,n);const c=ps.dot(ga),h=ms.dot(ga);if(c<=0&&h<=0)return t.copy(n);_a.subVectors(e,s);const d=ps.dot(_a),u=ms.dot(_a);if(d>=0&&u<=d)return t.copy(s);const f=c*u-d*h;if(f<=0&&c>=0&&d<=0)return a=c/(c-d),t.copy(n).addScaledVector(ps,a);va.subVectors(e,r);const p=ps.dot(va),_=ms.dot(va);if(_>=0&&p<=_)return t.copy(r);const v=p*h-c*_;if(v<=0&&h>=0&&_<=0)return l=h/(h-_),t.copy(n).addScaledVector(ms,l);const g=d*_-p*u;if(g<=0&&u-d>=0&&p-_>=0)return Mc.subVectors(r,s),l=(u-d)/(u-d+(p-_)),t.copy(s).addScaledVector(Mc,l);const m=1/(g+v+f);return a=v*m,l=f*m,t.copy(n).addScaledVector(ps,a).addScaledVector(ms,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const nd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},pi={h:0,s:0,l:0},qo={h:0,s:0,l:0};function xa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class at{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,pt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=pt.workingColorSpace){return this.r=e,this.g=t,this.b=n,pt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=pt.workingColorSpace){if(e=al(e,1),t=kt(t,0,1),n=kt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=xa(a,r,e+1/3),this.g=xa(a,r,e),this.b=xa(a,r,e-1/3)}return pt.toWorkingColorSpace(this,s),this}setStyle(e,t=Lt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],l=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Lt){const n=nd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hs(e.r),this.g=Hs(e.g),this.b=Hs(e.b),this}copyLinearToSRGB(e){return this.r=aa(e.r),this.g=aa(e.g),this.b=aa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Lt){return pt.fromWorkingColorSpace(Zt.copy(this),e),Math.round(kt(Zt.r*255,0,255))*65536+Math.round(kt(Zt.g*255,0,255))*256+Math.round(kt(Zt.b*255,0,255))}getHexString(e=Lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=pt.workingColorSpace){pt.fromWorkingColorSpace(Zt.copy(this),t);const n=Zt.r,s=Zt.g,r=Zt.b,a=Math.max(n,s,r),l=Math.min(n,s,r);let c,h;const d=(l+a)/2;if(l===a)c=0,h=0;else{const u=a-l;switch(h=d<=.5?u/(a+l):u/(2-a-l),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=h,e.l=d,e}getRGB(e,t=pt.workingColorSpace){return pt.fromWorkingColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=Lt){pt.fromWorkingColorSpace(Zt.copy(this),e);const t=Zt.r,n=Zt.g,s=Zt.b;return e!==Lt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(pi),this.setHSL(pi.h+e,pi.s+t,pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(pi),e.getHSL(qo);const n=go(pi.h,qo.h,t),s=go(pi.s,qo.s,t),r=go(pi.l,qo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Zt=new at;at.NAMES=nd;let vf=0;class Ys extends ts{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=ns(),this.name="",this.type="Material",this.blending=Bs,this.side=ri,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ga,this.blendDst=Va,this.blendEquation=zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new at(0,0,0),this.blendAlpha=0,this.depthFunc=Mr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=as,this.stencilZFail=as,this.stencilZPass=as,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Bs&&(n.blending=this.blending),this.side!==ri&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ga&&(n.blendSrc=this.blendSrc),this.blendDst!==Va&&(n.blendDst=this.blendDst),this.blendEquation!==zi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Mr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==lc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==as&&(n.stencilFail=this.stencilFail),this.stencilZFail!==as&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==as&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const l in r){const c=r[l];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ao extends Ys{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Fh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pt=new A,Yo=new de;class gn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=cc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Yo.fromBufferAttribute(this,t),Yo.applyMatrix3(e),this.setXY(t,Yo.x,Yo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Rs(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Jt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Rs(t,this.array)),t}setX(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Rs(t,this.array)),t}setY(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Rs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Rs(t,this.array)),t}setW(e,t){return this.normalized&&(t=Jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),n=Jt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),n=Jt(n,this.array),s=Jt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Jt(t,this.array),n=Jt(n,this.array),s=Jt(s,this.array),r=Jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==cc&&(e.usage=this.usage),e}}class id extends gn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class sd extends gn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class lt extends gn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let xf=0;const yn=new mt,ya=new Xt,gs=new A,hn=new is,so=new is,zt=new A;class Tt extends ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=ns(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zh(e)?sd:id)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ze().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return yn.makeRotationFromQuaternion(e),this.applyMatrix4(yn),this}rotateX(e){return yn.makeRotationX(e),this.applyMatrix4(yn),this}rotateY(e){return yn.makeRotationY(e),this.applyMatrix4(yn),this}rotateZ(e){return yn.makeRotationZ(e),this.applyMatrix4(yn),this}translate(e,t,n){return yn.makeTranslation(e,t,n),this.applyMatrix4(yn),this}scale(e,t,n){return yn.makeScale(e,t,n),this.applyMatrix4(yn),this}lookAt(e){return ya.lookAt(e),ya.updateMatrix(),this.applyMatrix4(ya.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new lt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new is);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(zt.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(zt),zt.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(zt)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new A,1/0);return}if(e){const n=this.boundingSphere.center;if(hn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const l=t[r];so.setFromBufferAttribute(l),this.morphTargetsRelative?(zt.addVectors(hn.min,so.min),hn.expandByPoint(zt),zt.addVectors(hn.max,so.max),hn.expandByPoint(zt)):(hn.expandByPoint(so.min),hn.expandByPoint(so.max))}hn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)zt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(zt));if(t)for(let r=0,a=t.length;r<a;r++){const l=t[r],c=this.morphTargetsRelative;for(let h=0,d=l.count;h<d;h++)zt.fromBufferAttribute(l,h),c&&(gs.fromBufferAttribute(e,h),zt.add(gs)),s=Math.max(s,n.distanceToSquared(zt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,s=t.position.array,r=t.normal.array,a=t.uv.array,l=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new gn(new Float32Array(4*l),4));const c=this.getAttribute("tangent").array,h=[],d=[];for(let T=0;T<l;T++)h[T]=new A,d[T]=new A;const u=new A,f=new A,p=new A,_=new de,v=new de,g=new de,m=new A,y=new A;function x(T,z,V){u.fromArray(s,T*3),f.fromArray(s,z*3),p.fromArray(s,V*3),_.fromArray(a,T*2),v.fromArray(a,z*2),g.fromArray(a,V*2),f.sub(u),p.sub(u),v.sub(_),g.sub(_);const ie=1/(v.x*g.y-g.x*v.y);isFinite(ie)&&(m.copy(f).multiplyScalar(g.y).addScaledVector(p,-v.y).multiplyScalar(ie),y.copy(p).multiplyScalar(v.x).addScaledVector(f,-g.x).multiplyScalar(ie),h[T].add(m),h[z].add(m),h[V].add(m),d[T].add(y),d[z].add(y),d[V].add(y))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let T=0,z=M.length;T<z;++T){const V=M[T],ie=V.start,I=V.count;for(let B=ie,H=ie+I;B<H;B+=3)x(n[B+0],n[B+1],n[B+2])}const L=new A,R=new A,C=new A,G=new A;function b(T){C.fromArray(r,T*3),G.copy(C);const z=h[T];L.copy(z),L.sub(C.multiplyScalar(C.dot(z))).normalize(),R.crossVectors(G,z);const ie=R.dot(d[T])<0?-1:1;c[T*4]=L.x,c[T*4+1]=L.y,c[T*4+2]=L.z,c[T*4+3]=ie}for(let T=0,z=M.length;T<z;++T){const V=M[T],ie=V.start,I=V.count;for(let B=ie,H=ie+I;B<H;B+=3)b(n[B+0]),b(n[B+1]),b(n[B+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new gn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new A,r=new A,a=new A,l=new A,c=new A,h=new A,d=new A,u=new A;if(e)for(let f=0,p=e.count;f<p;f+=3){const _=e.getX(f+0),v=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,g),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,g),l.add(d),c.add(d),h.add(d),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(g,h.x,h.y,h.z)}else for(let f=0,p=t.count;f<p;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),n.setXYZ(f+0,d.x,d.y,d.z),n.setXYZ(f+1,d.x,d.y,d.z),n.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)zt.fromBufferAttribute(e,t),zt.normalize(),e.setXYZ(t,zt.x,zt.y,zt.z)}toNonIndexed(){function e(l,c){const h=l.array,d=l.itemSize,u=l.normalized,f=new h.constructor(c.length*d);let p=0,_=0;for(let v=0,g=c.length;v<g;v++){l.isInterleavedBufferAttribute?p=c[v]*l.data.stride+l.offset:p=c[v]*d;for(let m=0;m<d;m++)f[_++]=h[p++]}return new gn(f,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,n=this.index.array,s=this.attributes;for(const l in s){const c=s[l],h=e(c,n);t.setAttribute(l,h)}const r=this.morphAttributes;for(const l in r){const c=[],h=r[l];for(let d=0,u=h.length;d<u;d++){const f=h[d],p=e(f,n);c.push(p)}t.morphAttributes[l]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let l=0,c=a.length;l<c;l++){const h=a[l];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const h=n[c];e.data.attributes[c]=h.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],d=[];for(let u=0,f=h.length;u<f;u++){const p=h[u];d.push(p.toJSON(e.data))}d.length>0&&(s[c]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const l=this.boundingSphere;return l!==null&&(e.data.boundingSphere={center:l.center.toArray(),radius:l.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const h in s){const d=s[h];this.setAttribute(h,d.clone(t))}const r=e.morphAttributes;for(const h in r){const d=[],u=r[h];for(let f=0,p=u.length;f<p;f++)d.push(u[f].clone(t));this.morphAttributes[h]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,d=a.length;h<d;h++){const u=a[h];this.addGroup(u.start,u.count,u.materialIndex)}const l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bc=new mt,Li=new Br,$o=new zr,Sc=new A,_s=new A,vs=new A,xs=new A,wa=new A,Ko=new A,Zo=new de,Jo=new de,Qo=new de,Ec=new A,Tc=new A,Ac=new A,er=new A,tr=new A;class je extends Xt{constructor(e=new Tt,t=new Ao){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const l=this.morphTargetInfluences;if(r&&l){Ko.set(0,0,0);for(let c=0,h=r.length;c<h;c++){const d=l[c],u=r[c];d!==0&&(wa.fromBufferAttribute(u,e),a?Ko.addScaledVector(wa,d):Ko.addScaledVector(wa.sub(t),d))}t.add(Ko)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),$o.copy(n.boundingSphere),$o.applyMatrix4(r),Li.copy(e.ray).recast(e.near),!($o.containsPoint(Li.origin)===!1&&(Li.intersectSphere($o,Sc)===null||Li.origin.distanceToSquared(Sc)>(e.far-e.near)**2))&&(bc.copy(r).invert(),Li.copy(e.ray).applyMatrix4(bc),!(n.boundingBox!==null&&Li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Li)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,l=r.index,c=r.attributes.position,h=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(l!==null)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const g=f[_],m=a[g.materialIndex],y=Math.max(g.start,p.start),x=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let M=y,L=x;M<L;M+=3){const R=l.getX(M),C=l.getX(M+1),G=l.getX(M+2);s=nr(this,m,e,n,h,d,u,R,C,G),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const _=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let g=_,m=v;g<m;g+=3){const y=l.getX(g),x=l.getX(g+1),M=l.getX(g+2);s=nr(this,a,e,n,h,d,u,y,x,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const g=f[_],m=a[g.materialIndex],y=Math.max(g.start,p.start),x=Math.min(c.count,Math.min(g.start+g.count,p.start+p.count));for(let M=y,L=x;M<L;M+=3){const R=M,C=M+1,G=M+2;s=nr(this,m,e,n,h,d,u,R,C,G),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const _=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let g=_,m=v;g<m;g+=3){const y=g,x=g+1,M=g+2;s=nr(this,a,e,n,h,d,u,y,x,M),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function yf(i,e,t,n,s,r,a,l){let c;if(e.side===rn?c=n.intersectTriangle(a,r,s,!0,l):c=n.intersectTriangle(s,r,a,e.side===ri,l),c===null)return null;tr.copy(l),tr.applyMatrix4(i.matrixWorld);const h=t.ray.origin.distanceTo(tr);return h<t.near||h>t.far?null:{distance:h,point:tr.clone(),object:i}}function nr(i,e,t,n,s,r,a,l,c,h){i.getVertexPosition(l,_s),i.getVertexPosition(c,vs),i.getVertexPosition(h,xs);const d=yf(i,e,t,n,_s,vs,xs,er);if(d){s&&(Zo.fromBufferAttribute(s,l),Jo.fromBufferAttribute(s,c),Qo.fromBufferAttribute(s,h),d.uv=Cn.getInterpolation(er,_s,vs,xs,Zo,Jo,Qo,new de)),r&&(Zo.fromBufferAttribute(r,l),Jo.fromBufferAttribute(r,c),Qo.fromBufferAttribute(r,h),d.uv1=Cn.getInterpolation(er,_s,vs,xs,Zo,Jo,Qo,new de),d.uv2=d.uv1),a&&(Ec.fromBufferAttribute(a,l),Tc.fromBufferAttribute(a,c),Ac.fromBufferAttribute(a,h),d.normal=Cn.getInterpolation(er,_s,vs,xs,Ec,Tc,Ac,new A),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a:l,b:c,c:h,normal:new A,materialIndex:0};Cn.getNormal(_s,vs,xs,u.normal),d.face=u}return d}class $s extends Tt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const l=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],h=[],d=[],u=[];let f=0,p=0;_("z","y","x",-1,-1,n,t,e,a,r,0),_("z","y","x",1,-1,n,t,-e,a,r,1),_("x","z","y",1,1,e,n,t,s,a,2),_("x","z","y",1,-1,e,n,-t,s,a,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new lt(h,3)),this.setAttribute("normal",new lt(d,3)),this.setAttribute("uv",new lt(u,2));function _(v,g,m,y,x,M,L,R,C,G,b){const T=M/C,z=L/G,V=M/2,ie=L/2,I=R/2,B=C+1,H=G+1;let K=0,Z=0;const J=new A;for(let te=0;te<H;te++){const ce=te*z-ie;for(let fe=0;fe<B;fe++){const j=fe*T-V;J[v]=j*y,J[g]=ce*x,J[m]=I,h.push(J.x,J.y,J.z),J[v]=0,J[g]=0,J[m]=R>0?1:-1,d.push(J.x,J.y,J.z),u.push(fe/C),u.push(1-te/G),K+=1}}for(let te=0;te<G;te++)for(let ce=0;ce<C;ce++){const fe=f+ce+B*te,j=f+ce+B*(te+1),oe=f+(ce+1)+B*(te+1),ee=f+(ce+1)+B*te;c.push(fe,j,ee),c.push(j,oe,ee),Z+=6}l.addGroup(p,Z,b),p+=Z,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function js(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Qt(i){const e={};for(let t=0;t<i.length;t++){const n=js(i[t]);for(const s in n)e[s]=n[s]}return e}function wf(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function od(i){return i.getRenderTarget()===null?i.outputColorSpace:pt.workingColorSpace}const Mf={clone:js,merge:Qt};var bf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Zi extends Ys{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bf,this.fragmentShader=Sf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=js(e.uniforms),this.uniformsGroups=wf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class rd extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=ni}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class pn extends rd{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=To*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(mo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return To*2*Math.atan(Math.tan(mo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(mo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}const l=this.filmOffset;l!==0&&(r+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ys=-90,ws=1;class Ef extends Xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new pn(ys,ws,e,t);s.layers=this.layers,this.add(s);const r=new pn(ys,ws,e,t);r.layers=this.layers,this.add(r);const a=new pn(ys,ws,e,t);a.layers=this.layers,this.add(a);const l=new pn(ys,ws,e,t);l.layers=this.layers,this.add(l);const c=new pn(ys,ws,e,t);c.layers=this.layers,this.add(c);const h=new pn(ys,ws,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,l,c]=t;for(const h of t)this.remove(h);if(e===ni)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Rr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,l,c,h,d]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,l),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,h),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,d),e.setRenderTarget(u,f,p),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class ad extends an{constructor(e,t,n,s,r,a,l,c,h,d){e=e!==void 0?e:[],t=t!==void 0?t:Vs,super(e,t,n,s,r,a,l,c,h,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Tf extends Ki{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];t.encoding!==void 0&&(_o("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===qi?Lt:bn),this.texture=new ad(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:wn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new $s(5,5,5),r=new Zi({name:"CubemapFromEquirect",uniforms:js(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:rn,blending:wi});r.uniforms.tEquirect.value=t;const a=new je(s,r),l=t.minFilter;return t.minFilter===So&&(t.minFilter=wn),new Ef(1,10,this).update(e,a),t.minFilter=l,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const Ma=new A,Af=new A,Rf=new Ze;class mi{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ma.subVectors(n,t).cross(Af.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ma),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Rf.getNormalMatrix(e),s=this.coplanarPoint(Ma).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Di=new zr,ir=new A;class ll{constructor(e=new mi,t=new mi,n=new mi,s=new mi,r=new mi,a=new mi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(n),l[3].copy(s),l[4].copy(r),l[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ni){const n=this.planes,s=e.elements,r=s[0],a=s[1],l=s[2],c=s[3],h=s[4],d=s[5],u=s[6],f=s[7],p=s[8],_=s[9],v=s[10],g=s[11],m=s[12],y=s[13],x=s[14],M=s[15];if(n[0].setComponents(c-r,f-h,g-p,M-m).normalize(),n[1].setComponents(c+r,f+h,g+p,M+m).normalize(),n[2].setComponents(c+a,f+d,g+_,M+y).normalize(),n[3].setComponents(c-a,f-d,g-_,M-y).normalize(),n[4].setComponents(c-l,f-u,g-v,M-x).normalize(),t===ni)n[5].setComponents(c+l,f+u,g+v,M+x).normalize();else if(t===Rr)n[5].setComponents(l,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Di.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Di.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Di)}intersectsSprite(e){return Di.center.set(0,0,0),Di.radius=.7071067811865476,Di.applyMatrix4(e.matrixWorld),this.intersectsSphere(Di)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ir.x=s.normal.x>0?e.max.x:e.min.x,ir.y=s.normal.y>0?e.max.y:e.min.y,ir.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ir)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ld(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Cf(i,e){const t=e.isWebGL2,n=new WeakMap;function s(h,d){const u=h.array,f=h.usage,p=u.byteLength,_=i.createBuffer();i.bindBuffer(d,_),i.bufferData(d,u,f),h.onUploadCallback();let v;if(u instanceof Float32Array)v=i.FLOAT;else if(u instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(t)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=i.SHORT;else if(u instanceof Uint32Array)v=i.UNSIGNED_INT;else if(u instanceof Int32Array)v=i.INT;else if(u instanceof Int8Array)v=i.BYTE;else if(u instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:_,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:h.version,size:p}}function r(h,d,u){const f=d.array,p=d._updateRange,_=d.updateRanges;if(i.bindBuffer(u,h),p.count===-1&&_.length===0&&i.bufferSubData(u,0,f),_.length!==0){for(let v=0,g=_.length;v<g;v++){const m=_[v];t?i.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f,m.start,m.count):i.bufferSubData(u,m.start*f.BYTES_PER_ELEMENT,f.subarray(m.start,m.start+m.count))}d.clearUpdateRanges()}p.count!==-1&&(t?i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),d.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function l(h){h.isInterleavedBufferAttribute&&(h=h.data);const d=n.get(h);d&&(i.deleteBuffer(d.buffer),n.delete(h))}function c(h,d){if(h.isGLBufferAttribute){const f=n.get(h);(!f||f.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);const u=n.get(h);if(u===void 0)n.set(h,s(h,d));else if(u.version<h.version){if(u.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,h,d),u.version=h.version}}return{get:a,remove:l,update:c}}class ss extends Tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,l=Math.floor(n),c=Math.floor(s),h=l+1,d=c+1,u=e/l,f=t/c,p=[],_=[],v=[],g=[];for(let m=0;m<d;m++){const y=m*f-a;for(let x=0;x<h;x++){const M=x*u-r;_.push(M,-y,0),v.push(0,0,1),g.push(x/l),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let y=0;y<l;y++){const x=y+h*m,M=y+h*(m+1),L=y+1+h*(m+1),R=y+1+h*m;p.push(x,M,R),p.push(M,L,R)}this.setIndex(p),this.setAttribute("position",new lt(_,3)),this.setAttribute("normal",new lt(v,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ss(e.width,e.height,e.widthSegments,e.heightSegments)}}var Pf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lf=`#ifdef USE_ALPHAHASH
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
#endif`,Df=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,If=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Uf=`#ifdef USE_ALPHATEST
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
#endif`,Of=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ff=`#ifdef USE_BATCHING
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
#endif`,zf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Bf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Vf=`#ifdef USE_IRIDESCENCE
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
#endif`,Wf=`#ifdef USE_BUMPMAP
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
#endif`,Xf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,jf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$f=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Zf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Jf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Qf=`#define PI 3.141592653589793
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
} // validated`,ep=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,tp=`vec3 transformedNormal = objectNormal;
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
#endif`,np=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ip=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,op=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rp="gl_FragColor = linearToOutputTexel( gl_FragColor );",ap=`
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
}`,lp=`#ifdef USE_ENVMAP
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
#endif`,cp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hp=`#ifdef USE_ENVMAP
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
#endif`,dp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,up=`#ifdef USE_ENVMAP
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
#endif`,fp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_p=`#ifdef USE_GRADIENTMAP
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
}`,vp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,xp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yp=`LambertMaterial material;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mp=`uniform bool receiveShadow;
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
#endif`,bp=`#ifdef USE_ENVMAP
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
#endif`,Sp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ep=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Tp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ap=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Rp=`PhysicalMaterial material;
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
#endif`,Cp=`struct PhysicalMaterial {
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
}`,Pp=`
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
#endif`,Lp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Dp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ip=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Up=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Np=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Op=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Bp=`#if defined( USE_POINTS_UV )
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
#endif`,Hp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Gp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wp=`#ifdef USE_MORPHNORMALS
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
#endif`,Xp=`#ifdef USE_MORPHTARGETS
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
#endif`,jp=`#ifdef USE_MORPHTARGETS
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
#endif`,qp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Yp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Jp=`#ifdef USE_NORMALMAP
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
#endif`,Qp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,em=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,im=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,om=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,rm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,am=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,um=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pm=`float getShadowMask() {
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
}`,mm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gm=`#ifdef USE_SKINNING
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
#endif`,_m=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vm=`#ifdef USE_SKINNING
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
#endif`,xm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ym=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Mm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bm=`#ifdef USE_TRANSMISSION
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
#endif`,Sm=`#ifdef USE_TRANSMISSION
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
#endif`,Em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Cm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pm=`uniform sampler2D t2D;
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
}`,Lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Im=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,km=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Um=`#include <common>
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
}`,Nm=`#if DEPTH_PACKING == 3200
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
}`,Om=`#define DISTANCE
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
}`,Fm=`#define DISTANCE
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
}`,zm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hm=`uniform float scale;
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
}`,Gm=`uniform vec3 diffuse;
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
}`,Vm=`#include <common>
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
}`,Wm=`uniform vec3 diffuse;
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
}`,Xm=`#define LAMBERT
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
}`,jm=`#define LAMBERT
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
}`,qm=`#define MATCAP
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
}`,Ym=`#define MATCAP
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
}`,$m=`#define NORMAL
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
}`,Km=`#define NORMAL
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
}`,Zm=`#define PHONG
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
}`,Jm=`#define PHONG
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
}`,Qm=`#define STANDARD
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
}`,e0=`#define STANDARD
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
}`,t0=`#define TOON
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
}`,n0=`#define TOON
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
}`,i0=`uniform float size;
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
}`,s0=`uniform vec3 diffuse;
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
}`,o0=`#include <common>
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
}`,r0=`uniform vec3 color;
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
}`,a0=`uniform float rotation;
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
}`,l0=`uniform vec3 diffuse;
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
}`,$e={alphahash_fragment:Pf,alphahash_pars_fragment:Lf,alphamap_fragment:Df,alphamap_pars_fragment:If,alphatest_fragment:kf,alphatest_pars_fragment:Uf,aomap_fragment:Nf,aomap_pars_fragment:Of,batching_pars_vertex:Ff,batching_vertex:zf,begin_vertex:Bf,beginnormal_vertex:Hf,bsdfs:Gf,iridescence_fragment:Vf,bumpmap_pars_fragment:Wf,clipping_planes_fragment:Xf,clipping_planes_pars_fragment:jf,clipping_planes_pars_vertex:qf,clipping_planes_vertex:Yf,color_fragment:$f,color_pars_fragment:Kf,color_pars_vertex:Zf,color_vertex:Jf,common:Qf,cube_uv_reflection_fragment:ep,defaultnormal_vertex:tp,displacementmap_pars_vertex:np,displacementmap_vertex:ip,emissivemap_fragment:sp,emissivemap_pars_fragment:op,colorspace_fragment:rp,colorspace_pars_fragment:ap,envmap_fragment:lp,envmap_common_pars_fragment:cp,envmap_pars_fragment:hp,envmap_pars_vertex:dp,envmap_physical_pars_fragment:bp,envmap_vertex:up,fog_vertex:fp,fog_pars_vertex:pp,fog_fragment:mp,fog_pars_fragment:gp,gradientmap_pars_fragment:_p,lightmap_fragment:vp,lightmap_pars_fragment:xp,lights_lambert_fragment:yp,lights_lambert_pars_fragment:wp,lights_pars_begin:Mp,lights_toon_fragment:Sp,lights_toon_pars_fragment:Ep,lights_phong_fragment:Tp,lights_phong_pars_fragment:Ap,lights_physical_fragment:Rp,lights_physical_pars_fragment:Cp,lights_fragment_begin:Pp,lights_fragment_maps:Lp,lights_fragment_end:Dp,logdepthbuf_fragment:Ip,logdepthbuf_pars_fragment:kp,logdepthbuf_pars_vertex:Up,logdepthbuf_vertex:Np,map_fragment:Op,map_pars_fragment:Fp,map_particle_fragment:zp,map_particle_pars_fragment:Bp,metalnessmap_fragment:Hp,metalnessmap_pars_fragment:Gp,morphcolor_vertex:Vp,morphnormal_vertex:Wp,morphtarget_pars_vertex:Xp,morphtarget_vertex:jp,normal_fragment_begin:qp,normal_fragment_maps:Yp,normal_pars_fragment:$p,normal_pars_vertex:Kp,normal_vertex:Zp,normalmap_pars_fragment:Jp,clearcoat_normal_fragment_begin:Qp,clearcoat_normal_fragment_maps:em,clearcoat_pars_fragment:tm,iridescence_pars_fragment:nm,opaque_fragment:im,packing:sm,premultiplied_alpha_fragment:om,project_vertex:rm,dithering_fragment:am,dithering_pars_fragment:lm,roughnessmap_fragment:cm,roughnessmap_pars_fragment:hm,shadowmap_pars_fragment:dm,shadowmap_pars_vertex:um,shadowmap_vertex:fm,shadowmask_pars_fragment:pm,skinbase_vertex:mm,skinning_pars_vertex:gm,skinning_vertex:_m,skinnormal_vertex:vm,specularmap_fragment:xm,specularmap_pars_fragment:ym,tonemapping_fragment:wm,tonemapping_pars_fragment:Mm,transmission_fragment:bm,transmission_pars_fragment:Sm,uv_pars_fragment:Em,uv_pars_vertex:Tm,uv_vertex:Am,worldpos_vertex:Rm,background_vert:Cm,background_frag:Pm,backgroundCube_vert:Lm,backgroundCube_frag:Dm,cube_vert:Im,cube_frag:km,depth_vert:Um,depth_frag:Nm,distanceRGBA_vert:Om,distanceRGBA_frag:Fm,equirect_vert:zm,equirect_frag:Bm,linedashed_vert:Hm,linedashed_frag:Gm,meshbasic_vert:Vm,meshbasic_frag:Wm,meshlambert_vert:Xm,meshlambert_frag:jm,meshmatcap_vert:qm,meshmatcap_frag:Ym,meshnormal_vert:$m,meshnormal_frag:Km,meshphong_vert:Zm,meshphong_frag:Jm,meshphysical_vert:Qm,meshphysical_frag:e0,meshtoon_vert:t0,meshtoon_frag:n0,points_vert:i0,points_frag:s0,shadow_vert:o0,shadow_frag:r0,sprite_vert:a0,sprite_frag:l0},ve={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ze}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ze},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0},uvTransform:{value:new Ze}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ze},alphaMap:{value:null},alphaMapTransform:{value:new Ze},alphaTest:{value:0}}},Fn={basic:{uniforms:Qt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:Qt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new at(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:Qt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:Qt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:Qt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new at(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:Qt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:Qt([ve.points,ve.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:Qt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:Qt([ve.common,ve.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:Qt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:Qt([ve.sprite,ve.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:Qt([ve.common,ve.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:Qt([ve.lights,ve.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};Fn.physical={uniforms:Qt([Fn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ze},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ze},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ze},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ze},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ze},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ze},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ze}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const sr={r:0,b:0,g:0};function c0(i,e,t,n,s,r,a){const l=new at(0);let c=r===!0?0:1,h,d,u=null,f=0,p=null;function _(g,m){let y=!1,x=m.isScene===!0?m.background:null;x&&x.isTexture&&(x=(m.backgroundBlurriness>0?t:e).get(x)),x===null?v(l,c):x&&x.isColor&&(v(x,1),y=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||y)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Or)?(d===void 0&&(d=new je(new $s(1,1,1),new Zi({name:"BackgroundCubeMaterial",uniforms:js(Fn.backgroundCube.uniforms),vertexShader:Fn.backgroundCube.vertexShader,fragmentShader:Fn.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(L,R,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),d.material.uniforms.envMap.value=x,d.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,d.material.toneMapped=pt.getTransfer(x.colorSpace)!==vt,(u!==x||f!==x.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),d.layers.enableAll(),g.unshift(d,d.geometry,d.material,0,0,null)):x&&x.isTexture&&(h===void 0&&(h=new je(new ss(2,2),new Zi({name:"BackgroundMaterial",uniforms:js(Fn.background.uniforms),vertexShader:Fn.background.vertexShader,fragmentShader:Fn.background.fragmentShader,side:ri,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=x,h.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,h.material.toneMapped=pt.getTransfer(x.colorSpace)!==vt,x.matrixAutoUpdate===!0&&x.updateMatrix(),h.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,f=x.version,p=i.toneMapping),h.layers.enableAll(),g.unshift(h,h.geometry,h.material,0,0,null))}function v(g,m){g.getRGB(sr,od(i)),n.buffers.color.setClear(sr.r,sr.g,sr.b,m,a)}return{getClearColor:function(){return l},setClearColor:function(g,m=1){l.set(g),c=m,v(l,c)},getClearAlpha:function(){return c},setClearAlpha:function(g){c=g,v(l,c)},render:_}}function h0(i,e,t,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:e.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,l={},c=g(null);let h=c,d=!1;function u(I,B,H,K,Z){let J=!1;if(a){const te=v(K,H,B);h!==te&&(h=te,p(h.object)),J=m(I,K,H,Z),J&&y(I,K,H,Z)}else{const te=B.wireframe===!0;(h.geometry!==K.id||h.program!==H.id||h.wireframe!==te)&&(h.geometry=K.id,h.program=H.id,h.wireframe=te,J=!0)}Z!==null&&t.update(Z,i.ELEMENT_ARRAY_BUFFER),(J||d)&&(d=!1,G(I,B,H,K),Z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Z).buffer))}function f(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function p(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function _(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function v(I,B,H){const K=H.wireframe===!0;let Z=l[I.id];Z===void 0&&(Z={},l[I.id]=Z);let J=Z[B.id];J===void 0&&(J={},Z[B.id]=J);let te=J[K];return te===void 0&&(te=g(f()),J[K]=te),te}function g(I){const B=[],H=[],K=[];for(let Z=0;Z<s;Z++)B[Z]=0,H[Z]=0,K[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:H,attributeDivisors:K,object:I,attributes:{},index:null}}function m(I,B,H,K){const Z=h.attributes,J=B.attributes;let te=0;const ce=H.getAttributes();for(const fe in ce)if(ce[fe].location>=0){const oe=Z[fe];let ee=J[fe];if(ee===void 0&&(fe==="instanceMatrix"&&I.instanceMatrix&&(ee=I.instanceMatrix),fe==="instanceColor"&&I.instanceColor&&(ee=I.instanceColor)),oe===void 0||oe.attribute!==ee||ee&&oe.data!==ee.data)return!0;te++}return h.attributesNum!==te||h.index!==K}function y(I,B,H,K){const Z={},J=B.attributes;let te=0;const ce=H.getAttributes();for(const fe in ce)if(ce[fe].location>=0){let oe=J[fe];oe===void 0&&(fe==="instanceMatrix"&&I.instanceMatrix&&(oe=I.instanceMatrix),fe==="instanceColor"&&I.instanceColor&&(oe=I.instanceColor));const ee={};ee.attribute=oe,oe&&oe.data&&(ee.data=oe.data),Z[fe]=ee,te++}h.attributes=Z,h.attributesNum=te,h.index=K}function x(){const I=h.newAttributes;for(let B=0,H=I.length;B<H;B++)I[B]=0}function M(I){L(I,0)}function L(I,B){const H=h.newAttributes,K=h.enabledAttributes,Z=h.attributeDivisors;H[I]=1,K[I]===0&&(i.enableVertexAttribArray(I),K[I]=1),Z[I]!==B&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,B),Z[I]=B)}function R(){const I=h.newAttributes,B=h.enabledAttributes;for(let H=0,K=B.length;H<K;H++)B[H]!==I[H]&&(i.disableVertexAttribArray(H),B[H]=0)}function C(I,B,H,K,Z,J,te){te===!0?i.vertexAttribIPointer(I,B,H,Z,J):i.vertexAttribPointer(I,B,H,K,Z,J)}function G(I,B,H,K){if(n.isWebGL2===!1&&(I.isInstancedMesh||K.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;x();const Z=K.attributes,J=H.getAttributes(),te=B.defaultAttributeValues;for(const ce in J){const fe=J[ce];if(fe.location>=0){let j=Z[ce];if(j===void 0&&(ce==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),ce==="instanceColor"&&I.instanceColor&&(j=I.instanceColor)),j!==void 0){const oe=j.normalized,ee=j.itemSize,ue=t.get(j);if(ue===void 0)continue;const me=ue.buffer,be=ue.type,Re=ue.bytesPerElement,ye=n.isWebGL2===!0&&(be===i.INT||be===i.UNSIGNED_INT||j.gpuType===Hh);if(j.isInterleavedBufferAttribute){const De=j.data,D=De.stride,ne=j.offset;if(De.isInstancedInterleavedBuffer){for(let Y=0;Y<fe.locationSize;Y++)L(fe.location+Y,De.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=De.meshPerAttribute*De.count)}else for(let Y=0;Y<fe.locationSize;Y++)M(fe.location+Y);i.bindBuffer(i.ARRAY_BUFFER,me);for(let Y=0;Y<fe.locationSize;Y++)C(fe.location+Y,ee/fe.locationSize,be,oe,D*Re,(ne+ee/fe.locationSize*Y)*Re,ye)}else{if(j.isInstancedBufferAttribute){for(let De=0;De<fe.locationSize;De++)L(fe.location+De,j.meshPerAttribute);I.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let De=0;De<fe.locationSize;De++)M(fe.location+De);i.bindBuffer(i.ARRAY_BUFFER,me);for(let De=0;De<fe.locationSize;De++)C(fe.location+De,ee/fe.locationSize,be,oe,ee*Re,ee/fe.locationSize*De*Re,ye)}}else if(te!==void 0){const oe=te[ce];if(oe!==void 0)switch(oe.length){case 2:i.vertexAttrib2fv(fe.location,oe);break;case 3:i.vertexAttrib3fv(fe.location,oe);break;case 4:i.vertexAttrib4fv(fe.location,oe);break;default:i.vertexAttrib1fv(fe.location,oe)}}}}R()}function b(){V();for(const I in l){const B=l[I];for(const H in B){const K=B[H];for(const Z in K)_(K[Z].object),delete K[Z];delete B[H]}delete l[I]}}function T(I){if(l[I.id]===void 0)return;const B=l[I.id];for(const H in B){const K=B[H];for(const Z in K)_(K[Z].object),delete K[Z];delete B[H]}delete l[I.id]}function z(I){for(const B in l){const H=l[B];if(H[I.id]===void 0)continue;const K=H[I.id];for(const Z in K)_(K[Z].object),delete K[Z];delete H[I.id]}}function V(){ie(),d=!0,h!==c&&(h=c,p(h.object))}function ie(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:V,resetDefaultState:ie,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfProgram:z,initAttributes:x,enableAttribute:M,disableUnusedAttributes:R}}function d0(i,e,t,n){const s=n.isWebGL2;let r;function a(d){r=d}function l(d,u){i.drawArrays(r,d,u),t.update(u,r,1)}function c(d,u,f){if(f===0)return;let p,_;if(s)p=i,_="drawArraysInstanced";else if(p=e.get("ANGLE_instanced_arrays"),_="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[_](r,d,u,f),t.update(u,r,f)}function h(d,u,f){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<f;_++)this.render(d[_],u[_]);else{p.multiDrawArraysWEBGL(r,d,0,u,0,f);let _=0;for(let v=0;v<f;v++)_+=u[v];t.update(_,r,1)}}this.setMode=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function u0(i,e,t){let n;function s(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let l=t.precision!==void 0?t.precision:"highp";const c=r(l);c!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",c,"instead."),l=c);const h=a||e.has("WEBGL_draw_buffers"),d=t.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),g=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),m=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=f>0,M=a||e.has("OES_texture_float"),L=x&&M,R=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:l,logarithmicDepthBuffer:d,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:_,maxAttributes:v,maxVertexUniforms:g,maxVaryings:m,maxFragmentUniforms:y,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:L,maxSamples:R}}function f0(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new mi,l=new Ze,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=d(u,f,0)},this.setState=function(u,f,p){const _=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||_===null||_.length===0||r&&!g)r?d(null):h();else{const y=r?0:n,x=y*4;let M=m.clippingState||null;c.value=M,M=d(_,f,x,p);for(let L=0;L!==x;++L)M[L]=t[L];m.clippingState=M,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function h(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(u,f,p,_){const v=u!==null?u.length:0;let g=null;if(v!==0){if(g=c.value,_!==!0||g===null){const m=p+v*4,y=f.matrixWorldInverse;l.getNormalMatrix(y),(g===null||g.length<m)&&(g=new Float32Array(m));for(let x=0,M=p;x!==v;++x,M+=4)a.copy(u[x]).applyMatrix4(y,l),a.normal.toArray(g,M),g[M+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}function p0(i){let e=new WeakMap;function t(a,l){return l===br?a.mapping=Vs:l===Wa&&(a.mapping=Ws),a}function n(a){if(a&&a.isTexture){const l=a.mapping;if(l===br||l===Wa)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new Tf(c.height/2);return h.fromEquirectangularTexture(i,a),e.set(a,h),a.addEventListener("dispose",s),t(h.texture,a.mapping)}else return null}}return a}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class cd extends rd{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,l=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,l-=d*this.view.offsetY,c=l-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,l,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ls=4,Rc=[.125,.215,.35,.446,.526,.582],Bi=20,ba=new cd,Cc=new at;let Sa=null,Ea=0,Ta=0;const Fi=(1+Math.sqrt(5))/2,Ms=1/Fi,Pc=[new A(1,1,1),new A(-1,1,1),new A(1,1,-1),new A(-1,1,-1),new A(0,Fi,Ms),new A(0,Fi,-Ms),new A(Ms,0,Fi),new A(-Ms,0,Fi),new A(Fi,Ms,0),new A(-Fi,Ms,0)];class Ya{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Sa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),Ta=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ic(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Sa,Ea,Ta),e.scissorTest=!1,or(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Vs||e.mapping===Ws?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Sa=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),Ta=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:wn,minFilter:wn,generateMipmaps:!1,type:Eo,format:Ln,colorSpace:ai,depthBuffer:!1},s=Lc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Lc(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=m0(r)),this._blurMaterial=g0(r,e,t)}return s}_compileMaterial(e){const t=new je(this._lodPlanes[0],e);this._renderer.compile(t,ba)}_sceneToCubeUV(e,t,n,s){const l=new pn(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Cc),d.toneMapping=Mi,d.autoClear=!1;const p=new Ao({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1}),_=new je(new $s,p);let v=!1;const g=e.background;g?g.isColor&&(p.color.copy(g),e.background=null,v=!0):(p.color.copy(Cc),v=!0);for(let m=0;m<6;m++){const y=m%3;y===0?(l.up.set(0,c[m],0),l.lookAt(h[m],0,0)):y===1?(l.up.set(0,0,c[m]),l.lookAt(0,h[m],0)):(l.up.set(0,c[m],0),l.lookAt(0,0,h[m]));const x=this._cubeSize;or(s,y*x,m>2?x:0,x,x),d.setRenderTarget(s),v&&d.render(_,l),d.render(e,l)}_.geometry.dispose(),_.material.dispose(),d.toneMapping=f,d.autoClear=u,e.background=g}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Vs||e.mapping===Ws;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ic()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Dc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new je(this._lodPlanes[0],r),l=r.uniforms;l.envMap.value=e;const c=this._cubeSize;or(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,ba)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Pc[(s-1)%Pc.length];this._blur(e,s-1,s,r,a)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,l){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new je(this._lodPlanes[s],h),f=h.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Bi-1),v=r/_,g=isFinite(r)?1+Math.floor(d*v):Bi;g>Bi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Bi}`);const m=[];let y=0;for(let C=0;C<Bi;++C){const G=C/v,b=Math.exp(-G*G/2);m.push(b),C===0?y+=b:C<g&&(y+=2*b)}for(let C=0;C<m.length;C++)m[C]=m[C]/y;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=a==="latitudinal",l&&(f.poleAxis.value=l);const{_lodMax:x}=this;f.dTheta.value=_,f.mipInt.value=x-n;const M=this._sizeLods[s],L=3*M*(s>x-Ls?s-x+Ls:0),R=4*(this._cubeSize-M);or(t,L,R,3*M,2*M),c.setRenderTarget(t),c.render(u,ba)}}function m0(i){const e=[],t=[],n=[];let s=i;const r=i-Ls+1+Rc.length;for(let a=0;a<r;a++){const l=Math.pow(2,s);t.push(l);let c=1/l;a>i-Ls?c=Rc[a-i+Ls-1]:a===0&&(c=0),n.push(c);const h=1/(l-2),d=-h,u=1+h,f=[d,d,u,d,u,u,d,d,u,u,d,u],p=6,_=6,v=3,g=2,m=1,y=new Float32Array(v*_*p),x=new Float32Array(g*_*p),M=new Float32Array(m*_*p);for(let R=0;R<p;R++){const C=R%3*2/3-1,G=R>2?0:-1,b=[C,G,0,C+2/3,G,0,C+2/3,G+1,0,C,G,0,C+2/3,G+1,0,C,G+1,0];y.set(b,v*_*R),x.set(f,g*_*R);const T=[R,R,R,R,R,R];M.set(T,m*_*R)}const L=new Tt;L.setAttribute("position",new gn(y,v)),L.setAttribute("uv",new gn(x,g)),L.setAttribute("faceIndex",new gn(M,m)),e.push(L),s>Ls&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Lc(i,e,t){const n=new Ki(i,e,t);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function or(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function g0(i,e,t){const n=new Float32Array(Bi),s=new A(0,1,0);return new Zi({name:"SphericalGaussianBlur",defines:{n:Bi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:cl(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function Dc(){return new Zi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cl(),fragmentShader:`

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
		`,blending:wi,depthTest:!1,depthWrite:!1})}function Ic(){return new Zi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wi,depthTest:!1,depthWrite:!1})}function cl(){return`

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
	`}function _0(i){let e=new WeakMap,t=null;function n(l){if(l&&l.isTexture){const c=l.mapping,h=c===br||c===Wa,d=c===Vs||c===Ws;if(h||d)if(l.isRenderTargetTexture&&l.needsPMREMUpdate===!0){l.needsPMREMUpdate=!1;let u=e.get(l);return t===null&&(t=new Ya(i)),u=h?t.fromEquirectangular(l,u):t.fromCubemap(l,u),e.set(l,u),u.texture}else{if(e.has(l))return e.get(l).texture;{const u=l.image;if(h&&u&&u.height>0||d&&u&&s(u)){t===null&&(t=new Ya(i));const f=h?t.fromEquirectangular(l):t.fromCubemap(l);return e.set(l,f),l.addEventListener("dispose",r),f.texture}else return null}}}return l}function s(l){let c=0;const h=6;for(let d=0;d<h;d++)l[d]!==void 0&&c++;return c===h}function r(l){const c=l.target;c.removeEventListener("dispose",r);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function v0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const s=t(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function x0(i,e,t,n){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);for(const _ in f.morphAttributes){const v=f.morphAttributes[_];for(let g=0,m=v.length;g<m;g++)e.remove(v[g])}f.removeEventListener("dispose",a),delete s[f.id];const p=r.get(f);p&&(e.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function l(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){const f=u.attributes;for(const _ in f)e.update(f[_],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const _ in p){const v=p[_];for(let g=0,m=v.length;g<m;g++)e.update(v[g],i.ARRAY_BUFFER)}}function h(u){const f=[],p=u.index,_=u.attributes.position;let v=0;if(p!==null){const y=p.array;v=p.version;for(let x=0,M=y.length;x<M;x+=3){const L=y[x+0],R=y[x+1],C=y[x+2];f.push(L,R,R,C,C,L)}}else if(_!==void 0){const y=_.array;v=_.version;for(let x=0,M=y.length/3-1;x<M;x+=3){const L=x+0,R=x+1,C=x+2;f.push(L,R,R,C,C,L)}}else return;const g=new(Zh(f)?sd:id)(f,1);g.version=v;const m=r.get(u);m&&e.remove(m),r.set(u,g)}function d(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&h(u)}else h(u);return r.get(u)}return{get:l,update:c,getWireframeAttribute:d}}function y0(i,e,t,n){const s=n.isWebGL2;let r;function a(p){r=p}let l,c;function h(p){l=p.type,c=p.bytesPerElement}function d(p,_){i.drawElements(r,_,l,p*c),t.update(_,r,1)}function u(p,_,v){if(v===0)return;let g,m;if(s)g=i,m="drawElementsInstanced";else if(g=e.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",g===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[m](r,_,l,p*c,v),t.update(_,r,v)}function f(p,_,v){if(v===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<v;m++)this.render(p[m]/c,_[m]);else{g.multiDrawElementsWEBGL(r,_,0,l,p,0,v);let m=0;for(let y=0;y<v;y++)m+=_[y];t.update(m,r,1)}}this.setMode=a,this.setIndex=h,this.render=d,this.renderInstances=u,this.renderMultiDraw=f}function w0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,l){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=l*(r/3);break;case i.LINES:t.lines+=l*(r/2);break;case i.LINE_STRIP:t.lines+=l*(r-1);break;case i.LINE_LOOP:t.lines+=l*r;break;case i.POINTS:t.points+=l*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function M0(i,e){return i[0]-e[0]}function b0(i,e){return Math.abs(e[1])-Math.abs(i[1])}function S0(i,e,t){const n={},s=new Float32Array(8),r=new WeakMap,a=new xt,l=[];for(let h=0;h<8;h++)l[h]=[h,0];function c(h,d,u){const f=h.morphTargetInfluences;if(e.isWebGL2===!0){const _=d.morphAttributes.position||d.morphAttributes.normal||d.morphAttributes.color,v=_!==void 0?_.length:0;let g=r.get(d);if(g===void 0||g.count!==v){let B=function(){ie.dispose(),r.delete(d),d.removeEventListener("dispose",B)};var p=B;g!==void 0&&g.texture.dispose();const x=d.morphAttributes.position!==void 0,M=d.morphAttributes.normal!==void 0,L=d.morphAttributes.color!==void 0,R=d.morphAttributes.position||[],C=d.morphAttributes.normal||[],G=d.morphAttributes.color||[];let b=0;x===!0&&(b=1),M===!0&&(b=2),L===!0&&(b=3);let T=d.attributes.position.count*b,z=1;T>e.maxTextureSize&&(z=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const V=new Float32Array(T*z*4*v),ie=new ed(V,T,z,v);ie.type=xi,ie.needsUpdate=!0;const I=b*4;for(let H=0;H<v;H++){const K=R[H],Z=C[H],J=G[H],te=T*z*4*H;for(let ce=0;ce<K.count;ce++){const fe=ce*I;x===!0&&(a.fromBufferAttribute(K,ce),V[te+fe+0]=a.x,V[te+fe+1]=a.y,V[te+fe+2]=a.z,V[te+fe+3]=0),M===!0&&(a.fromBufferAttribute(Z,ce),V[te+fe+4]=a.x,V[te+fe+5]=a.y,V[te+fe+6]=a.z,V[te+fe+7]=0),L===!0&&(a.fromBufferAttribute(J,ce),V[te+fe+8]=a.x,V[te+fe+9]=a.y,V[te+fe+10]=a.z,V[te+fe+11]=J.itemSize===4?a.w:1)}}g={count:v,texture:ie,size:new de(T,z)},r.set(d,g),d.addEventListener("dispose",B)}let m=0;for(let x=0;x<f.length;x++)m+=f[x];const y=d.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",y),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",g.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",g.size)}else{const _=f===void 0?0:f.length;let v=n[d.id];if(v===void 0||v.length!==_){v=[];for(let M=0;M<_;M++)v[M]=[M,0];n[d.id]=v}for(let M=0;M<_;M++){const L=v[M];L[0]=M,L[1]=f[M]}v.sort(b0);for(let M=0;M<8;M++)M<_&&v[M][1]?(l[M][0]=v[M][0],l[M][1]=v[M][1]):(l[M][0]=Number.MAX_SAFE_INTEGER,l[M][1]=0);l.sort(M0);const g=d.morphAttributes.position,m=d.morphAttributes.normal;let y=0;for(let M=0;M<8;M++){const L=l[M],R=L[0],C=L[1];R!==Number.MAX_SAFE_INTEGER&&C?(g&&d.getAttribute("morphTarget"+M)!==g[R]&&d.setAttribute("morphTarget"+M,g[R]),m&&d.getAttribute("morphNormal"+M)!==m[R]&&d.setAttribute("morphNormal"+M,m[R]),s[M]=C,y+=C):(g&&d.hasAttribute("morphTarget"+M)===!0&&d.deleteAttribute("morphTarget"+M),m&&d.hasAttribute("morphNormal"+M)===!0&&d.deleteAttribute("morphNormal"+M),s[M]=0)}const x=d.morphTargetsRelative?1:1-y;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function E0(i,e,t,n){let s=new WeakMap;function r(c){const h=n.render.frame,d=c.geometry,u=e.get(c,d);if(s.get(u)!==h&&(e.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function a(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:r,dispose:a}}class hd extends an{constructor(e,t,n,s,r,a,l,c,h,d){if(d=d!==void 0?d:ji,d!==ji&&d!==Xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&d===ji&&(n=vi),n===void 0&&d===Xs&&(n=Xi),super(null,s,r,a,l,c,d,n,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=l!==void 0?l:sn,this.minFilter=c!==void 0?c:sn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const dd=new an,ud=new hd(1,1);ud.compareFunction=Kh;const fd=new ed,pd=new cf,md=new ad,kc=[],Uc=[],Nc=new Float32Array(16),Oc=new Float32Array(9),Fc=new Float32Array(4);function Ks(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=kc[s];if(r===void 0&&(r=new Float32Array(s),kc[s]=r),e!==0){n.toArray(r,0);for(let a=1,l=0;a!==e;++a)l+=t,i[a].toArray(r,l)}return r}function Nt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Gr(i,e){let t=Uc[e];t===void 0&&(t=new Int32Array(e),Uc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function T0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function A0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function R0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function C0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function P0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,n))return;Fc.set(n),i.uniformMatrix2fv(this.addr,!1,Fc),Ot(t,n)}}function L0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,n))return;Oc.set(n),i.uniformMatrix3fv(this.addr,!1,Oc),Ot(t,n)}}function D0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Nt(t,n))return;Nc.set(n),i.uniformMatrix4fv(this.addr,!1,Nc),Ot(t,n)}}function I0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function k0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function U0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function N0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function O0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function F0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function z0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function B0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function H0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?ud:dd;t.setTexture2D(e||r,s)}function G0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||pd,s)}function V0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||md,s)}function W0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||fd,s)}function X0(i){switch(i){case 5126:return T0;case 35664:return A0;case 35665:return R0;case 35666:return C0;case 35674:return P0;case 35675:return L0;case 35676:return D0;case 5124:case 35670:return I0;case 35667:case 35671:return k0;case 35668:case 35672:return U0;case 35669:case 35673:return N0;case 5125:return O0;case 36294:return F0;case 36295:return z0;case 36296:return B0;case 35678:case 36198:case 36298:case 36306:case 35682:return H0;case 35679:case 36299:case 36307:return G0;case 35680:case 36300:case 36308:case 36293:return V0;case 36289:case 36303:case 36311:case 36292:return W0}}function j0(i,e){i.uniform1fv(this.addr,e)}function q0(i,e){const t=Ks(e,this.size,2);i.uniform2fv(this.addr,t)}function Y0(i,e){const t=Ks(e,this.size,3);i.uniform3fv(this.addr,t)}function $0(i,e){const t=Ks(e,this.size,4);i.uniform4fv(this.addr,t)}function K0(i,e){const t=Ks(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Z0(i,e){const t=Ks(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function J0(i,e){const t=Ks(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Q0(i,e){i.uniform1iv(this.addr,e)}function eg(i,e){i.uniform2iv(this.addr,e)}function tg(i,e){i.uniform3iv(this.addr,e)}function ng(i,e){i.uniform4iv(this.addr,e)}function ig(i,e){i.uniform1uiv(this.addr,e)}function sg(i,e){i.uniform2uiv(this.addr,e)}function og(i,e){i.uniform3uiv(this.addr,e)}function rg(i,e){i.uniform4uiv(this.addr,e)}function ag(i,e,t){const n=this.cache,s=e.length,r=Gr(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||dd,r[a])}function lg(i,e,t){const n=this.cache,s=e.length,r=Gr(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||pd,r[a])}function cg(i,e,t){const n=this.cache,s=e.length,r=Gr(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||md,r[a])}function hg(i,e,t){const n=this.cache,s=e.length,r=Gr(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||fd,r[a])}function dg(i){switch(i){case 5126:return j0;case 35664:return q0;case 35665:return Y0;case 35666:return $0;case 35674:return K0;case 35675:return Z0;case 35676:return J0;case 5124:case 35670:return Q0;case 35667:case 35671:return eg;case 35668:case 35672:return tg;case 35669:case 35673:return ng;case 5125:return ig;case 36294:return sg;case 36295:return og;case 36296:return rg;case 35678:case 36198:case 36298:case 36306:case 35682:return ag;case 35679:case 36299:case 36307:return lg;case 35680:case 36300:case 36308:case 36293:return cg;case 36289:case 36303:case 36311:case 36292:return hg}}class ug{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=X0(t.type)}}class fg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dg(t.type)}}class pg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const l=s[r];l.setValue(e,t[l.id],n)}}}const Aa=/(\w+)(\])?(\[|\.)?/g;function zc(i,e){i.seq.push(e),i.map[e.id]=e}function mg(i,e,t){const n=i.name,s=n.length;for(Aa.lastIndex=0;;){const r=Aa.exec(n),a=Aa.lastIndex;let l=r[1];const c=r[2]==="]",h=r[3];if(c&&(l=l|0),h===void 0||h==="["&&a+2===s){zc(t,h===void 0?new ug(l,i,e):new fg(l,i,e));break}else{let u=t.map[l];u===void 0&&(u=new pg(l),zc(t,u)),t=u}}}class xr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);mg(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const l=t[r],c=n[l.id];c.needsUpdate!==!1&&l.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function Bc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const gg=37297;let _g=0;function vg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const l=a+1;n.push(`${l===e?">":" "} ${l}: ${t[a]}`)}return n.join(`
`)}function xg(i){const e=pt.getPrimaries(pt.workingColorSpace),t=pt.getPrimaries(i);let n;switch(e===t?n="":e===Ar&&t===Tr?n="LinearDisplayP3ToLinearSRGB":e===Tr&&t===Ar&&(n="LinearSRGBToLinearDisplayP3"),i){case ai:case Fr:return[n,"LinearTransferOETF"];case Lt:case rl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Hc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+vg(i.getShaderSource(e),a)}else return s}function yg(i,e){const t=xg(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function wg(i,e){let t;switch(e){case xu:t="Linear";break;case yu:t="Reinhard";break;case wu:t="OptimizedCineon";break;case zh:t="ACESFilmic";break;case bu:t="AgX";break;case Mu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Mg(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ds).join(`
`)}function bg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ds).join(`
`)}function Sg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Eg(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let l=1;r.type===i.FLOAT_MAT2&&(l=2),r.type===i.FLOAT_MAT3&&(l=3),r.type===i.FLOAT_MAT4&&(l=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:l}}return t}function Ds(i){return i!==""}function Gc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Vc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Tg=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(i){return i.replace(Tg,Rg)}const Ag=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Rg(i,e){let t=$e[e];if(t===void 0){const n=Ag.get(e);if(n!==void 0)t=$e[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return $a(t)}const Cg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wc(i){return i.replace(Cg,Pg)}function Pg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Xc(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Lg(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Nh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Oh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ei&&(e="SHADOWMAP_TYPE_VSM"),e}function Dg(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Vs:case Ws:e="ENVMAP_TYPE_CUBE";break;case Or:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Ig(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ws:e="ENVMAP_MODE_REFRACTION";break}return e}function kg(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Fh:e="ENVMAP_BLENDING_MULTIPLY";break;case _u:e="ENVMAP_BLENDING_MIX";break;case vu:e="ENVMAP_BLENDING_ADD";break}return e}function Ug(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Ng(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,l=t.fragmentShader;const c=Lg(t),h=Dg(t),d=Ig(t),u=kg(t),f=Ug(t),p=t.isWebGL2?"":Mg(t),_=bg(t),v=Sg(r),g=s.createProgram();let m,y,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Ds).join(`
`),m.length>0&&(m+=`
`),y=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Ds).join(`
`),y.length>0&&(y+=`
`)):(m=[Xc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ds).join(`
`),y=[p,Xc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Mi?"#define TONE_MAPPING":"",t.toneMapping!==Mi?$e.tonemapping_pars_fragment:"",t.toneMapping!==Mi?wg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,yg("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ds).join(`
`)),a=$a(a),a=Gc(a,t),a=Vc(a,t),l=$a(l),l=Gc(l,t),l=Vc(l,t),a=Wc(a),l=Wc(l),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[_,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,y=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===hc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const M=x+m+a,L=x+y+l,R=Bc(s,s.VERTEX_SHADER,M),C=Bc(s,s.FRAGMENT_SHADER,L);s.attachShader(g,R),s.attachShader(g,C),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function G(V){if(i.debug.checkShaderErrors){const ie=s.getProgramInfoLog(g).trim(),I=s.getShaderInfoLog(R).trim(),B=s.getShaderInfoLog(C).trim();let H=!0,K=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,R,C);else{const Z=Hc(s,R,"vertex"),J=Hc(s,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Program Info Log: `+ie+`
`+Z+`
`+J)}else ie!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ie):(I===""||B==="")&&(K=!1);K&&(V.diagnostics={runnable:H,programLog:ie,vertexShader:{log:I,prefix:m},fragmentShader:{log:B,prefix:y}})}s.deleteShader(R),s.deleteShader(C),b=new xr(s,g),T=Eg(s,g)}let b;this.getUniforms=function(){return b===void 0&&G(this),b};let T;this.getAttributes=function(){return T===void 0&&G(this),T};let z=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return z===!1&&(z=s.getProgramParameter(g,gg)),z},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_g++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=R,this.fragmentShader=C,this}let Og=0;class Fg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new zg(e),t.set(e,n)),n}}class zg{constructor(e){this.id=Og++,this.code=e,this.usedTimes=0}}function Bg(i,e,t,n,s,r,a){const l=new td,c=new Fg,h=[],d=s.isWebGL2,u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return b===0?"uv":`uv${b}`}function g(b,T,z,V,ie){const I=V.fog,B=ie.geometry,H=b.isMeshStandardMaterial?V.environment:null,K=(b.isMeshStandardMaterial?t:e).get(b.envMap||H),Z=K&&K.mapping===Or?K.image.height:null,J=_[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const te=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,ce=te!==void 0?te.length:0;let fe=0;B.morphAttributes.position!==void 0&&(fe=1),B.morphAttributes.normal!==void 0&&(fe=2),B.morphAttributes.color!==void 0&&(fe=3);let j,oe,ee,ue;if(J){const At=Fn[J];j=At.vertexShader,oe=At.fragmentShader}else j=b.vertexShader,oe=b.fragmentShader,c.update(b),ee=c.getVertexShaderID(b),ue=c.getFragmentShaderID(b);const me=i.getRenderTarget(),be=ie.isInstancedMesh===!0,Re=ie.isBatchedMesh===!0,ye=!!b.map,De=!!b.matcap,D=!!K,ne=!!b.aoMap,Y=!!b.lightMap,Q=!!b.bumpMap,$=!!b.normalMap,Pe=!!b.displacementMap,Se=!!b.emissiveMap,S=!!b.metalnessMap,w=!!b.roughnessMap,O=b.anisotropy>0,le=b.clearcoat>0,re=b.iridescence>0,se=b.sheen>0,Le=b.transmission>0,xe=O&&!!b.anisotropyMap,Te=le&&!!b.clearcoatMap,Ne=le&&!!b.clearcoatNormalMap,Ve=le&&!!b.clearcoatRoughnessMap,ae=re&&!!b.iridescenceMap,st=re&&!!b.iridescenceThicknessMap,Je=se&&!!b.sheenColorMap,He=se&&!!b.sheenRoughnessMap,Ue=!!b.specularMap,Ee=!!b.specularColorMap,P=!!b.specularIntensityMap,pe=Le&&!!b.transmissionMap,Ie=Le&&!!b.thicknessMap,Ce=!!b.gradientMap,he=!!b.alphaMap,U=b.alphaTest>0,ge=!!b.alphaHash,we=!!b.extensions,ze=!!B.attributes.uv1,Oe=!!B.attributes.uv2,nt=!!B.attributes.uv3;let it=Mi;return b.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(it=i.toneMapping),{isWebGL2:d,shaderID:J,shaderType:b.type,shaderName:b.name,vertexShader:j,fragmentShader:oe,defines:b.defines,customVertexShaderID:ee,customFragmentShaderID:ue,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:Re,instancing:be,instancingColor:be&&ie.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:me===null?i.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:ai,map:ye,matcap:De,envMap:D,envMapMode:D&&K.mapping,envMapCubeUVHeight:Z,aoMap:ne,lightMap:Y,bumpMap:Q,normalMap:$,displacementMap:f&&Pe,emissiveMap:Se,normalMapObjectSpace:$&&b.normalMapType===Uu,normalMapTangentSpace:$&&b.normalMapType===$h,metalnessMap:S,roughnessMap:w,anisotropy:O,anisotropyMap:xe,clearcoat:le,clearcoatMap:Te,clearcoatNormalMap:Ne,clearcoatRoughnessMap:Ve,iridescence:re,iridescenceMap:ae,iridescenceThicknessMap:st,sheen:se,sheenColorMap:Je,sheenRoughnessMap:He,specularMap:Ue,specularColorMap:Ee,specularIntensityMap:P,transmission:Le,transmissionMap:pe,thicknessMap:Ie,gradientMap:Ce,opaque:b.transparent===!1&&b.blending===Bs,alphaMap:he,alphaTest:U,alphaHash:ge,combine:b.combine,mapUv:ye&&v(b.map.channel),aoMapUv:ne&&v(b.aoMap.channel),lightMapUv:Y&&v(b.lightMap.channel),bumpMapUv:Q&&v(b.bumpMap.channel),normalMapUv:$&&v(b.normalMap.channel),displacementMapUv:Pe&&v(b.displacementMap.channel),emissiveMapUv:Se&&v(b.emissiveMap.channel),metalnessMapUv:S&&v(b.metalnessMap.channel),roughnessMapUv:w&&v(b.roughnessMap.channel),anisotropyMapUv:xe&&v(b.anisotropyMap.channel),clearcoatMapUv:Te&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ve&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ae&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:st&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Je&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:He&&v(b.sheenRoughnessMap.channel),specularMapUv:Ue&&v(b.specularMap.channel),specularColorMapUv:Ee&&v(b.specularColorMap.channel),specularIntensityMapUv:P&&v(b.specularIntensityMap.channel),transmissionMapUv:pe&&v(b.transmissionMap.channel),thicknessMapUv:Ie&&v(b.thicknessMap.channel),alphaMapUv:he&&v(b.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&($||O),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUv1s:ze,vertexUv2s:Oe,vertexUv3s:nt,pointsUvs:ie.isPoints===!0&&!!B.attributes.uv&&(ye||he),fog:!!I,useFog:b.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:ie.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:fe,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&z.length>0,shadowMapType:i.shadowMap.type,toneMapping:it,useLegacyLights:i._useLegacyLights,decodeVideoTexture:ye&&b.map.isVideoTexture===!0&&pt.getTransfer(b.map.colorSpace)===vt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Yt,flipSided:b.side===rn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionDerivatives:we&&b.extensions.derivatives===!0,extensionFragDepth:we&&b.extensions.fragDepth===!0,extensionDrawBuffers:we&&b.extensions.drawBuffers===!0,extensionShaderTextureLOD:we&&b.extensions.shaderTextureLOD===!0,extensionClipCullDistance:we&&b.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:d||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:d||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:d||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()}}function m(b){const T=[];if(b.shaderID?T.push(b.shaderID):(T.push(b.customVertexShaderID),T.push(b.customFragmentShaderID)),b.defines!==void 0)for(const z in b.defines)T.push(z),T.push(b.defines[z]);return b.isRawShaderMaterial===!1&&(y(T,b),x(T,b),T.push(i.outputColorSpace)),T.push(b.customProgramCacheKey),T.join()}function y(b,T){b.push(T.precision),b.push(T.outputColorSpace),b.push(T.envMapMode),b.push(T.envMapCubeUVHeight),b.push(T.mapUv),b.push(T.alphaMapUv),b.push(T.lightMapUv),b.push(T.aoMapUv),b.push(T.bumpMapUv),b.push(T.normalMapUv),b.push(T.displacementMapUv),b.push(T.emissiveMapUv),b.push(T.metalnessMapUv),b.push(T.roughnessMapUv),b.push(T.anisotropyMapUv),b.push(T.clearcoatMapUv),b.push(T.clearcoatNormalMapUv),b.push(T.clearcoatRoughnessMapUv),b.push(T.iridescenceMapUv),b.push(T.iridescenceThicknessMapUv),b.push(T.sheenColorMapUv),b.push(T.sheenRoughnessMapUv),b.push(T.specularMapUv),b.push(T.specularColorMapUv),b.push(T.specularIntensityMapUv),b.push(T.transmissionMapUv),b.push(T.thicknessMapUv),b.push(T.combine),b.push(T.fogExp2),b.push(T.sizeAttenuation),b.push(T.morphTargetsCount),b.push(T.morphAttributeCount),b.push(T.numDirLights),b.push(T.numPointLights),b.push(T.numSpotLights),b.push(T.numSpotLightMaps),b.push(T.numHemiLights),b.push(T.numRectAreaLights),b.push(T.numDirLightShadows),b.push(T.numPointLightShadows),b.push(T.numSpotLightShadows),b.push(T.numSpotLightShadowsWithMaps),b.push(T.numLightProbes),b.push(T.shadowMapType),b.push(T.toneMapping),b.push(T.numClippingPlanes),b.push(T.numClipIntersection),b.push(T.depthPacking)}function x(b,T){l.disableAll(),T.isWebGL2&&l.enable(0),T.supportsVertexTextures&&l.enable(1),T.instancing&&l.enable(2),T.instancingColor&&l.enable(3),T.matcap&&l.enable(4),T.envMap&&l.enable(5),T.normalMapObjectSpace&&l.enable(6),T.normalMapTangentSpace&&l.enable(7),T.clearcoat&&l.enable(8),T.iridescence&&l.enable(9),T.alphaTest&&l.enable(10),T.vertexColors&&l.enable(11),T.vertexAlphas&&l.enable(12),T.vertexUv1s&&l.enable(13),T.vertexUv2s&&l.enable(14),T.vertexUv3s&&l.enable(15),T.vertexTangents&&l.enable(16),T.anisotropy&&l.enable(17),T.alphaHash&&l.enable(18),T.batching&&l.enable(19),b.push(l.mask),l.disableAll(),T.fog&&l.enable(0),T.useFog&&l.enable(1),T.flatShading&&l.enable(2),T.logarithmicDepthBuffer&&l.enable(3),T.skinning&&l.enable(4),T.morphTargets&&l.enable(5),T.morphNormals&&l.enable(6),T.morphColors&&l.enable(7),T.premultipliedAlpha&&l.enable(8),T.shadowMapEnabled&&l.enable(9),T.useLegacyLights&&l.enable(10),T.doubleSided&&l.enable(11),T.flipSided&&l.enable(12),T.useDepthPacking&&l.enable(13),T.dithering&&l.enable(14),T.transmission&&l.enable(15),T.sheen&&l.enable(16),T.opaque&&l.enable(17),T.pointsUvs&&l.enable(18),T.decodeVideoTexture&&l.enable(19),b.push(l.mask)}function M(b){const T=_[b.type];let z;if(T){const V=Fn[T];z=Mf.clone(V.uniforms)}else z=b.uniforms;return z}function L(b,T){let z;for(let V=0,ie=h.length;V<ie;V++){const I=h[V];if(I.cacheKey===T){z=I,++z.usedTimes;break}}return z===void 0&&(z=new Ng(i,T,b,r),h.push(z)),z}function R(b){if(--b.usedTimes===0){const T=h.indexOf(b);h[T]=h[h.length-1],h.pop(),b.destroy()}}function C(b){c.remove(b)}function G(){c.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:M,acquireProgram:L,releaseProgram:R,releaseShaderCache:C,programs:h,dispose:G}}function Hg(){let i=new WeakMap;function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function t(r){i.delete(r)}function n(r,a,l){i.get(r)[a]=l}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function Gg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function jc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function qc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,p,_,v,g){let m=i[e];return m===void 0?(m={id:u.id,object:u,geometry:f,material:p,groupOrder:_,renderOrder:u.renderOrder,z:v,group:g},i[e]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=p,m.groupOrder=_,m.renderOrder=u.renderOrder,m.z=v,m.group=g),e++,m}function l(u,f,p,_,v,g){const m=a(u,f,p,_,v,g);p.transmission>0?n.push(m):p.transparent===!0?s.push(m):t.push(m)}function c(u,f,p,_,v,g){const m=a(u,f,p,_,v,g);p.transmission>0?n.unshift(m):p.transparent===!0?s.unshift(m):t.unshift(m)}function h(u,f){t.length>1&&t.sort(u||Gg),n.length>1&&n.sort(f||jc),s.length>1&&s.sort(f||jc)}function d(){for(let u=e,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:h}}function Vg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new qc,i.set(n,[a])):s>=r.length?(a=new qc,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Wg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new at};break;case"SpotLight":t={position:new A,direction:new A,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new at,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new at,groundColor:new at};break;case"RectAreaLight":t={color:new at,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function Xg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let jg=0;function qg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Yg(i,e){const t=new Wg,n=Xg(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)s.probe.push(new A);const r=new A,a=new mt,l=new mt;function c(d,u){let f=0,p=0,_=0;for(let V=0;V<9;V++)s.probe[V].set(0,0,0);let v=0,g=0,m=0,y=0,x=0,M=0,L=0,R=0,C=0,G=0,b=0;d.sort(qg);const T=u===!0?Math.PI:1;for(let V=0,ie=d.length;V<ie;V++){const I=d[V],B=I.color,H=I.intensity,K=I.distance,Z=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)f+=B.r*H*T,p+=B.g*H*T,_+=B.b*H*T;else if(I.isLightProbe){for(let J=0;J<9;J++)s.probe[J].addScaledVector(I.sh.coefficients[J],H);b++}else if(I.isDirectionalLight){const J=t.get(I);if(J.color.copy(I.color).multiplyScalar(I.intensity*T),I.castShadow){const te=I.shadow,ce=n.get(I);ce.shadowBias=te.bias,ce.shadowNormalBias=te.normalBias,ce.shadowRadius=te.radius,ce.shadowMapSize=te.mapSize,s.directionalShadow[v]=ce,s.directionalShadowMap[v]=Z,s.directionalShadowMatrix[v]=I.shadow.matrix,M++}s.directional[v]=J,v++}else if(I.isSpotLight){const J=t.get(I);J.position.setFromMatrixPosition(I.matrixWorld),J.color.copy(B).multiplyScalar(H*T),J.distance=K,J.coneCos=Math.cos(I.angle),J.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),J.decay=I.decay,s.spot[m]=J;const te=I.shadow;if(I.map&&(s.spotLightMap[C]=I.map,C++,te.updateMatrices(I),I.castShadow&&G++),s.spotLightMatrix[m]=te.matrix,I.castShadow){const ce=n.get(I);ce.shadowBias=te.bias,ce.shadowNormalBias=te.normalBias,ce.shadowRadius=te.radius,ce.shadowMapSize=te.mapSize,s.spotShadow[m]=ce,s.spotShadowMap[m]=Z,R++}m++}else if(I.isRectAreaLight){const J=t.get(I);J.color.copy(B).multiplyScalar(H),J.halfWidth.set(I.width*.5,0,0),J.halfHeight.set(0,I.height*.5,0),s.rectArea[y]=J,y++}else if(I.isPointLight){const J=t.get(I);if(J.color.copy(I.color).multiplyScalar(I.intensity*T),J.distance=I.distance,J.decay=I.decay,I.castShadow){const te=I.shadow,ce=n.get(I);ce.shadowBias=te.bias,ce.shadowNormalBias=te.normalBias,ce.shadowRadius=te.radius,ce.shadowMapSize=te.mapSize,ce.shadowCameraNear=te.camera.near,ce.shadowCameraFar=te.camera.far,s.pointShadow[g]=ce,s.pointShadowMap[g]=Z,s.pointShadowMatrix[g]=I.shadow.matrix,L++}s.point[g]=J,g++}else if(I.isHemisphereLight){const J=t.get(I);J.skyColor.copy(I.color).multiplyScalar(H*T),J.groundColor.copy(I.groundColor).multiplyScalar(H*T),s.hemi[x]=J,x++}}y>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ve.LTC_FLOAT_1,s.rectAreaLTC2=ve.LTC_FLOAT_2):(s.rectAreaLTC1=ve.LTC_HALF_1,s.rectAreaLTC2=ve.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ve.LTC_FLOAT_1,s.rectAreaLTC2=ve.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=ve.LTC_HALF_1,s.rectAreaLTC2=ve.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=f,s.ambient[1]=p,s.ambient[2]=_;const z=s.hash;(z.directionalLength!==v||z.pointLength!==g||z.spotLength!==m||z.rectAreaLength!==y||z.hemiLength!==x||z.numDirectionalShadows!==M||z.numPointShadows!==L||z.numSpotShadows!==R||z.numSpotMaps!==C||z.numLightProbes!==b)&&(s.directional.length=v,s.spot.length=m,s.rectArea.length=y,s.point.length=g,s.hemi.length=x,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=L,s.pointShadowMap.length=L,s.spotShadow.length=R,s.spotShadowMap.length=R,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=L,s.spotLightMatrix.length=R+C-G,s.spotLightMap.length=C,s.numSpotLightShadowsWithMaps=G,s.numLightProbes=b,z.directionalLength=v,z.pointLength=g,z.spotLength=m,z.rectAreaLength=y,z.hemiLength=x,z.numDirectionalShadows=M,z.numPointShadows=L,z.numSpotShadows=R,z.numSpotMaps=C,z.numLightProbes=b,s.version=jg++)}function h(d,u){let f=0,p=0,_=0,v=0,g=0;const m=u.matrixWorldInverse;for(let y=0,x=d.length;y<x;y++){const M=d[y];if(M.isDirectionalLight){const L=s.directional[f];L.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),L.direction.sub(r),L.direction.transformDirection(m),f++}else if(M.isSpotLight){const L=s.spot[_];L.position.setFromMatrixPosition(M.matrixWorld),L.position.applyMatrix4(m),L.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),L.direction.sub(r),L.direction.transformDirection(m),_++}else if(M.isRectAreaLight){const L=s.rectArea[v];L.position.setFromMatrixPosition(M.matrixWorld),L.position.applyMatrix4(m),l.identity(),a.copy(M.matrixWorld),a.premultiply(m),l.extractRotation(a),L.halfWidth.set(M.width*.5,0,0),L.halfHeight.set(0,M.height*.5,0),L.halfWidth.applyMatrix4(l),L.halfHeight.applyMatrix4(l),v++}else if(M.isPointLight){const L=s.point[p];L.position.setFromMatrixPosition(M.matrixWorld),L.position.applyMatrix4(m),p++}else if(M.isHemisphereLight){const L=s.hemi[g];L.direction.setFromMatrixPosition(M.matrixWorld),L.direction.transformDirection(m),g++}}}return{setup:c,setupView:h,state:s}}function Yc(i,e){const t=new Yg(i,e),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function l(u){s.push(u)}function c(u){t.setup(n,u)}function h(u){t.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:t},setupLights:c,setupLightsView:h,pushLight:a,pushShadow:l}}function $g(i,e){let t=new WeakMap;function n(r,a=0){const l=t.get(r);let c;return l===void 0?(c=new Yc(i,e),t.set(r,[c])):a>=l.length?(c=new Yc(i,e),l.push(c)):c=l[a],c}function s(){t=new WeakMap}return{get:n,dispose:s}}class Kg extends Ys{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Iu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Zg extends Ys{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Jg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Qg=`uniform sampler2D shadow_pass;
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
}`;function e_(i,e,t){let n=new ll;const s=new de,r=new de,a=new xt,l=new Kg({depthPacking:ku}),c=new Zg,h={},d=t.maxTextureSize,u={[ri]:rn,[rn]:ri,[Yt]:Yt},f=new Zi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:Jg,fragmentShader:Qg}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new Tt;_.setAttribute("position",new gn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new je(_,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nh;let m=this.type;this.render=function(R,C,G){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||R.length===0)return;const b=i.getRenderTarget(),T=i.getActiveCubeFace(),z=i.getActiveMipmapLevel(),V=i.state;V.setBlending(wi),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const ie=m!==ei&&this.type===ei,I=m===ei&&this.type!==ei;for(let B=0,H=R.length;B<H;B++){const K=R[B],Z=K.shadow;if(Z===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(Z.autoUpdate===!1&&Z.needsUpdate===!1)continue;s.copy(Z.mapSize);const J=Z.getFrameExtents();if(s.multiply(J),r.copy(Z.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/J.x),s.x=r.x*J.x,Z.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/J.y),s.y=r.y*J.y,Z.mapSize.y=r.y)),Z.map===null||ie===!0||I===!0){const ce=this.type!==ei?{minFilter:sn,magFilter:sn}:{};Z.map!==null&&Z.map.dispose(),Z.map=new Ki(s.x,s.y,ce),Z.map.texture.name=K.name+".shadowMap",Z.camera.updateProjectionMatrix()}i.setRenderTarget(Z.map),i.clear();const te=Z.getViewportCount();for(let ce=0;ce<te;ce++){const fe=Z.getViewport(ce);a.set(r.x*fe.x,r.y*fe.y,r.x*fe.z,r.y*fe.w),V.viewport(a),Z.updateMatrices(K,ce),n=Z.getFrustum(),M(C,G,Z.camera,K,this.type)}Z.isPointLightShadow!==!0&&this.type===ei&&y(Z,G),Z.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(b,T,z)};function y(R,C){const G=e.update(v);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,p.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Ki(s.x,s.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(C,null,G,f,v,null),p.uniforms.shadow_pass.value=R.mapPass.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(C,null,G,p,v,null)}function x(R,C,G,b){let T=null;const z=G.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(z!==void 0)T=z;else if(T=G.isPointLight===!0?c:l,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const V=T.uuid,ie=C.uuid;let I=h[V];I===void 0&&(I={},h[V]=I);let B=I[ie];B===void 0&&(B=T.clone(),I[ie]=B,C.addEventListener("dispose",L)),T=B}if(T.visible=C.visible,T.wireframe=C.wireframe,b===ei?T.side=C.shadowSide!==null?C.shadowSide:C.side:T.side=C.shadowSide!==null?C.shadowSide:u[C.side],T.alphaMap=C.alphaMap,T.alphaTest=C.alphaTest,T.map=C.map,T.clipShadows=C.clipShadows,T.clippingPlanes=C.clippingPlanes,T.clipIntersection=C.clipIntersection,T.displacementMap=C.displacementMap,T.displacementScale=C.displacementScale,T.displacementBias=C.displacementBias,T.wireframeLinewidth=C.wireframeLinewidth,T.linewidth=C.linewidth,G.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const V=i.properties.get(T);V.light=G}return T}function M(R,C,G,b,T){if(R.visible===!1)return;if(R.layers.test(C.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&T===ei)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,R.matrixWorld);const ie=e.update(R),I=R.material;if(Array.isArray(I)){const B=ie.groups;for(let H=0,K=B.length;H<K;H++){const Z=B[H],J=I[Z.materialIndex];if(J&&J.visible){const te=x(R,J,b,T);R.onBeforeShadow(i,R,C,G,ie,te,Z),i.renderBufferDirect(G,null,ie,te,R,Z),R.onAfterShadow(i,R,C,G,ie,te,Z)}}}else if(I.visible){const B=x(R,I,b,T);R.onBeforeShadow(i,R,C,G,ie,B,null),i.renderBufferDirect(G,null,ie,B,R,null),R.onAfterShadow(i,R,C,G,ie,B,null)}}const V=R.children;for(let ie=0,I=V.length;ie<I;ie++)M(V[ie],C,G,b,T)}function L(R){R.target.removeEventListener("dispose",L);for(const G in h){const b=h[G],T=R.target.uuid;T in b&&(b[T].dispose(),delete b[T])}}}function t_(i,e,t){const n=t.isWebGL2;function s(){let U=!1;const ge=new xt;let we=null;const ze=new xt(0,0,0,0);return{setMask:function(Oe){we!==Oe&&!U&&(i.colorMask(Oe,Oe,Oe,Oe),we=Oe)},setLocked:function(Oe){U=Oe},setClear:function(Oe,nt,it,bt,At){At===!0&&(Oe*=bt,nt*=bt,it*=bt),ge.set(Oe,nt,it,bt),ze.equals(ge)===!1&&(i.clearColor(Oe,nt,it,bt),ze.copy(ge))},reset:function(){U=!1,we=null,ze.set(-1,0,0,0)}}}function r(){let U=!1,ge=null,we=null,ze=null;return{setTest:function(Oe){Oe?Re(i.DEPTH_TEST):ye(i.DEPTH_TEST)},setMask:function(Oe){ge!==Oe&&!U&&(i.depthMask(Oe),ge=Oe)},setFunc:function(Oe){if(we!==Oe){switch(Oe){case hu:i.depthFunc(i.NEVER);break;case du:i.depthFunc(i.ALWAYS);break;case uu:i.depthFunc(i.LESS);break;case Mr:i.depthFunc(i.LEQUAL);break;case fu:i.depthFunc(i.EQUAL);break;case pu:i.depthFunc(i.GEQUAL);break;case mu:i.depthFunc(i.GREATER);break;case gu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}we=Oe}},setLocked:function(Oe){U=Oe},setClear:function(Oe){ze!==Oe&&(i.clearDepth(Oe),ze=Oe)},reset:function(){U=!1,ge=null,we=null,ze=null}}}function a(){let U=!1,ge=null,we=null,ze=null,Oe=null,nt=null,it=null,bt=null,At=null;return{setTest:function(ct){U||(ct?Re(i.STENCIL_TEST):ye(i.STENCIL_TEST))},setMask:function(ct){ge!==ct&&!U&&(i.stencilMask(ct),ge=ct)},setFunc:function(ct,Ct,kn){(we!==ct||ze!==Ct||Oe!==kn)&&(i.stencilFunc(ct,Ct,kn),we=ct,ze=Ct,Oe=kn)},setOp:function(ct,Ct,kn){(nt!==ct||it!==Ct||bt!==kn)&&(i.stencilOp(ct,Ct,kn),nt=ct,it=Ct,bt=kn)},setLocked:function(ct){U=ct},setClear:function(ct){At!==ct&&(i.clearStencil(ct),At=ct)},reset:function(){U=!1,ge=null,we=null,ze=null,Oe=null,nt=null,it=null,bt=null,At=null}}}const l=new s,c=new r,h=new a,d=new WeakMap,u=new WeakMap;let f={},p={},_=new WeakMap,v=[],g=null,m=!1,y=null,x=null,M=null,L=null,R=null,C=null,G=null,b=new at(0,0,0),T=0,z=!1,V=null,ie=null,I=null,B=null,H=null;const K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,J=0;const te=i.getParameter(i.VERSION);te.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(te)[1]),Z=J>=1):te.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(te)[1]),Z=J>=2);let ce=null,fe={};const j=i.getParameter(i.SCISSOR_BOX),oe=i.getParameter(i.VIEWPORT),ee=new xt().fromArray(j),ue=new xt().fromArray(oe);function me(U,ge,we,ze){const Oe=new Uint8Array(4),nt=i.createTexture();i.bindTexture(U,nt),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let it=0;it<we;it++)n&&(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)?i.texImage3D(ge,0,i.RGBA,1,1,ze,0,i.RGBA,i.UNSIGNED_BYTE,Oe):i.texImage2D(ge+it,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Oe);return nt}const be={};be[i.TEXTURE_2D]=me(i.TEXTURE_2D,i.TEXTURE_2D,1),be[i.TEXTURE_CUBE_MAP]=me(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(be[i.TEXTURE_2D_ARRAY]=me(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),be[i.TEXTURE_3D]=me(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),l.setClear(0,0,0,1),c.setClear(1),h.setClear(0),Re(i.DEPTH_TEST),c.setFunc(Mr),Se(!1),S(Pl),Re(i.CULL_FACE),$(wi);function Re(U){f[U]!==!0&&(i.enable(U),f[U]=!0)}function ye(U){f[U]!==!1&&(i.disable(U),f[U]=!1)}function De(U,ge){return p[U]!==ge?(i.bindFramebuffer(U,ge),p[U]=ge,n&&(U===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=ge),U===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=ge)),!0):!1}function D(U,ge){let we=v,ze=!1;if(U)if(we=_.get(ge),we===void 0&&(we=[],_.set(ge,we)),U.isWebGLMultipleRenderTargets){const Oe=U.texture;if(we.length!==Oe.length||we[0]!==i.COLOR_ATTACHMENT0){for(let nt=0,it=Oe.length;nt<it;nt++)we[nt]=i.COLOR_ATTACHMENT0+nt;we.length=Oe.length,ze=!0}}else we[0]!==i.COLOR_ATTACHMENT0&&(we[0]=i.COLOR_ATTACHMENT0,ze=!0);else we[0]!==i.BACK&&(we[0]=i.BACK,ze=!0);ze&&(t.isWebGL2?i.drawBuffers(we):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(we))}function ne(U){return g!==U?(i.useProgram(U),g=U,!0):!1}const Y={[zi]:i.FUNC_ADD,[$d]:i.FUNC_SUBTRACT,[Kd]:i.FUNC_REVERSE_SUBTRACT};if(n)Y[kl]=i.MIN,Y[Ul]=i.MAX;else{const U=e.get("EXT_blend_minmax");U!==null&&(Y[kl]=U.MIN_EXT,Y[Ul]=U.MAX_EXT)}const Q={[Zd]:i.ZERO,[Jd]:i.ONE,[Qd]:i.SRC_COLOR,[Ga]:i.SRC_ALPHA,[ou]:i.SRC_ALPHA_SATURATE,[iu]:i.DST_COLOR,[tu]:i.DST_ALPHA,[eu]:i.ONE_MINUS_SRC_COLOR,[Va]:i.ONE_MINUS_SRC_ALPHA,[su]:i.ONE_MINUS_DST_COLOR,[nu]:i.ONE_MINUS_DST_ALPHA,[ru]:i.CONSTANT_COLOR,[au]:i.ONE_MINUS_CONSTANT_COLOR,[lu]:i.CONSTANT_ALPHA,[cu]:i.ONE_MINUS_CONSTANT_ALPHA};function $(U,ge,we,ze,Oe,nt,it,bt,At,ct){if(U===wi){m===!0&&(ye(i.BLEND),m=!1);return}if(m===!1&&(Re(i.BLEND),m=!0),U!==Yd){if(U!==y||ct!==z){if((x!==zi||R!==zi)&&(i.blendEquation(i.FUNC_ADD),x=zi,R=zi),ct)switch(U){case Bs:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ll:i.blendFunc(i.ONE,i.ONE);break;case Dl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Il:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Bs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ll:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Dl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Il:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}M=null,L=null,C=null,G=null,b.set(0,0,0),T=0,y=U,z=ct}return}Oe=Oe||ge,nt=nt||we,it=it||ze,(ge!==x||Oe!==R)&&(i.blendEquationSeparate(Y[ge],Y[Oe]),x=ge,R=Oe),(we!==M||ze!==L||nt!==C||it!==G)&&(i.blendFuncSeparate(Q[we],Q[ze],Q[nt],Q[it]),M=we,L=ze,C=nt,G=it),(bt.equals(b)===!1||At!==T)&&(i.blendColor(bt.r,bt.g,bt.b,At),b.copy(bt),T=At),y=U,z=!1}function Pe(U,ge){U.side===Yt?ye(i.CULL_FACE):Re(i.CULL_FACE);let we=U.side===rn;ge&&(we=!we),Se(we),U.blending===Bs&&U.transparent===!1?$(wi):$(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),c.setFunc(U.depthFunc),c.setTest(U.depthTest),c.setMask(U.depthWrite),l.setMask(U.colorWrite);const ze=U.stencilWrite;h.setTest(ze),ze&&(h.setMask(U.stencilWriteMask),h.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),h.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),O(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?Re(i.SAMPLE_ALPHA_TO_COVERAGE):ye(i.SAMPLE_ALPHA_TO_COVERAGE)}function Se(U){V!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),V=U)}function S(U){U!==jd?(Re(i.CULL_FACE),U!==ie&&(U===Pl?i.cullFace(i.BACK):U===qd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ye(i.CULL_FACE),ie=U}function w(U){U!==I&&(Z&&i.lineWidth(U),I=U)}function O(U,ge,we){U?(Re(i.POLYGON_OFFSET_FILL),(B!==ge||H!==we)&&(i.polygonOffset(ge,we),B=ge,H=we)):ye(i.POLYGON_OFFSET_FILL)}function le(U){U?Re(i.SCISSOR_TEST):ye(i.SCISSOR_TEST)}function re(U){U===void 0&&(U=i.TEXTURE0+K-1),ce!==U&&(i.activeTexture(U),ce=U)}function se(U,ge,we){we===void 0&&(ce===null?we=i.TEXTURE0+K-1:we=ce);let ze=fe[we];ze===void 0&&(ze={type:void 0,texture:void 0},fe[we]=ze),(ze.type!==U||ze.texture!==ge)&&(ce!==we&&(i.activeTexture(we),ce=we),i.bindTexture(U,ge||be[U]),ze.type=U,ze.texture=ge)}function Le(){const U=fe[ce];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function xe(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ve(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function st(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Je(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function He(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ue(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ee(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function P(U){ee.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),ee.copy(U))}function pe(U){ue.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),ue.copy(U))}function Ie(U,ge){let we=u.get(ge);we===void 0&&(we=new WeakMap,u.set(ge,we));let ze=we.get(U);ze===void 0&&(ze=i.getUniformBlockIndex(ge,U.name),we.set(U,ze))}function Ce(U,ge){const ze=u.get(ge).get(U);d.get(ge)!==ze&&(i.uniformBlockBinding(ge,ze,U.__bindingPointIndex),d.set(ge,ze))}function he(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},ce=null,fe={},p={},_=new WeakMap,v=[],g=null,m=!1,y=null,x=null,M=null,L=null,R=null,C=null,G=null,b=new at(0,0,0),T=0,z=!1,V=null,ie=null,I=null,B=null,H=null,ee.set(0,0,i.canvas.width,i.canvas.height),ue.set(0,0,i.canvas.width,i.canvas.height),l.reset(),c.reset(),h.reset()}return{buffers:{color:l,depth:c,stencil:h},enable:Re,disable:ye,bindFramebuffer:De,drawBuffers:D,useProgram:ne,setBlending:$,setMaterial:Pe,setFlipSided:Se,setCullFace:S,setLineWidth:w,setPolygonOffset:O,setScissorTest:le,activeTexture:re,bindTexture:se,unbindTexture:Le,compressedTexImage2D:xe,compressedTexImage3D:Te,texImage2D:Ue,texImage3D:Ee,updateUBOMapping:Ie,uniformBlockBinding:Ce,texStorage2D:Je,texStorage3D:He,texSubImage2D:Ne,texSubImage3D:Ve,compressedTexSubImage2D:ae,compressedTexSubImage3D:st,scissor:P,viewport:pe,reset:he}}function n_(i,e,t,n,s,r,a){const l=s.isWebGL2,c=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(S,w){return p?new OffscreenCanvas(S,w):Pr("canvas")}function v(S,w,O,le){let re=1;if((S.width>le||S.height>le)&&(re=le/Math.max(S.width,S.height)),re<1||w===!0)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap){const se=w?Cr:Math.floor,Le=se(re*S.width),xe=se(re*S.height);u===void 0&&(u=_(Le,xe));const Te=O?_(Le,xe):u;return Te.width=Le,Te.height=xe,Te.getContext("2d").drawImage(S,0,0,Le,xe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+S.width+"x"+S.height+") to ("+Le+"x"+xe+")."),Te}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+S.width+"x"+S.height+")."),S;return S}function g(S){return qa(S.width)&&qa(S.height)}function m(S){return l?!1:S.wrapS!==Pn||S.wrapT!==Pn||S.minFilter!==sn&&S.minFilter!==wn}function y(S,w){return S.generateMipmaps&&w&&S.minFilter!==sn&&S.minFilter!==wn}function x(S){i.generateMipmap(S)}function M(S,w,O,le,re=!1){if(l===!1)return w;if(S!==null){if(i[S]!==void 0)return i[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let se=w;if(w===i.RED&&(O===i.FLOAT&&(se=i.R32F),O===i.HALF_FLOAT&&(se=i.R16F),O===i.UNSIGNED_BYTE&&(se=i.R8)),w===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(se=i.R8UI),O===i.UNSIGNED_SHORT&&(se=i.R16UI),O===i.UNSIGNED_INT&&(se=i.R32UI),O===i.BYTE&&(se=i.R8I),O===i.SHORT&&(se=i.R16I),O===i.INT&&(se=i.R32I)),w===i.RG&&(O===i.FLOAT&&(se=i.RG32F),O===i.HALF_FLOAT&&(se=i.RG16F),O===i.UNSIGNED_BYTE&&(se=i.RG8)),w===i.RGBA){const Le=re?Er:pt.getTransfer(le);O===i.FLOAT&&(se=i.RGBA32F),O===i.HALF_FLOAT&&(se=i.RGBA16F),O===i.UNSIGNED_BYTE&&(se=Le===vt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(se=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(se=i.RGB5_A1)}return(se===i.R16F||se===i.R32F||se===i.RG16F||se===i.RG32F||se===i.RGBA16F||se===i.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function L(S,w,O){return y(S,O)===!0||S.isFramebufferTexture&&S.minFilter!==sn&&S.minFilter!==wn?Math.log2(Math.max(w.width,w.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?w.mipmaps.length:1}function R(S){return S===sn||S===Nl||S===ea?i.NEAREST:i.LINEAR}function C(S){const w=S.target;w.removeEventListener("dispose",C),b(w),w.isVideoTexture&&d.delete(w)}function G(S){const w=S.target;w.removeEventListener("dispose",G),z(w)}function b(S){const w=n.get(S);if(w.__webglInit===void 0)return;const O=S.source,le=f.get(O);if(le){const re=le[w.__cacheKey];re.usedTimes--,re.usedTimes===0&&T(S),Object.keys(le).length===0&&f.delete(O)}n.remove(S)}function T(S){const w=n.get(S);i.deleteTexture(w.__webglTexture);const O=S.source,le=f.get(O);delete le[w.__cacheKey],a.memory.textures--}function z(S){const w=S.texture,O=n.get(S),le=n.get(w);if(le.__webglTexture!==void 0&&(i.deleteTexture(le.__webglTexture),a.memory.textures--),S.depthTexture&&S.depthTexture.dispose(),S.isWebGLCubeRenderTarget)for(let re=0;re<6;re++){if(Array.isArray(O.__webglFramebuffer[re]))for(let se=0;se<O.__webglFramebuffer[re].length;se++)i.deleteFramebuffer(O.__webglFramebuffer[re][se]);else i.deleteFramebuffer(O.__webglFramebuffer[re]);O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer[re])}else{if(Array.isArray(O.__webglFramebuffer))for(let re=0;re<O.__webglFramebuffer.length;re++)i.deleteFramebuffer(O.__webglFramebuffer[re]);else i.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&i.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&i.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let re=0;re<O.__webglColorRenderbuffer.length;re++)O.__webglColorRenderbuffer[re]&&i.deleteRenderbuffer(O.__webglColorRenderbuffer[re]);O.__webglDepthRenderbuffer&&i.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(S.isWebGLMultipleRenderTargets)for(let re=0,se=w.length;re<se;re++){const Le=n.get(w[re]);Le.__webglTexture&&(i.deleteTexture(Le.__webglTexture),a.memory.textures--),n.remove(w[re])}n.remove(w),n.remove(S)}let V=0;function ie(){V=0}function I(){const S=V;return S>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+s.maxTextures),V+=1,S}function B(S){const w=[];return w.push(S.wrapS),w.push(S.wrapT),w.push(S.wrapR||0),w.push(S.magFilter),w.push(S.minFilter),w.push(S.anisotropy),w.push(S.internalFormat),w.push(S.format),w.push(S.type),w.push(S.generateMipmaps),w.push(S.premultiplyAlpha),w.push(S.flipY),w.push(S.unpackAlignment),w.push(S.colorSpace),w.join()}function H(S,w){const O=n.get(S);if(S.isVideoTexture&&Pe(S),S.isRenderTargetTexture===!1&&S.version>0&&O.__version!==S.version){const le=S.image;if(le===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(le.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(O,S,w);return}}t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+w)}function K(S,w){const O=n.get(S);if(S.version>0&&O.__version!==S.version){ee(O,S,w);return}t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+w)}function Z(S,w){const O=n.get(S);if(S.version>0&&O.__version!==S.version){ee(O,S,w);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+w)}function J(S,w){const O=n.get(S);if(S.version>0&&O.__version!==S.version){ue(O,S,w);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+w)}const te={[Sr]:i.REPEAT,[Pn]:i.CLAMP_TO_EDGE,[Xa]:i.MIRRORED_REPEAT},ce={[sn]:i.NEAREST,[Nl]:i.NEAREST_MIPMAP_NEAREST,[ea]:i.NEAREST_MIPMAP_LINEAR,[wn]:i.LINEAR,[Su]:i.LINEAR_MIPMAP_NEAREST,[So]:i.LINEAR_MIPMAP_LINEAR},fe={[Nu]:i.NEVER,[Gu]:i.ALWAYS,[Ou]:i.LESS,[Kh]:i.LEQUAL,[Fu]:i.EQUAL,[Hu]:i.GEQUAL,[zu]:i.GREATER,[Bu]:i.NOTEQUAL};function j(S,w,O){if(O?(i.texParameteri(S,i.TEXTURE_WRAP_S,te[w.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,te[w.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,te[w.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,ce[w.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,ce[w.minFilter])):(i.texParameteri(S,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(S,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(w.wrapS!==Pn||w.wrapT!==Pn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(S,i.TEXTURE_MAG_FILTER,R(w.magFilter)),i.texParameteri(S,i.TEXTURE_MIN_FILTER,R(w.minFilter)),w.minFilter!==sn&&w.minFilter!==wn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),w.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,fe[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const le=e.get("EXT_texture_filter_anisotropic");if(w.magFilter===sn||w.minFilter!==ea&&w.minFilter!==So||w.type===xi&&e.has("OES_texture_float_linear")===!1||l===!1&&w.type===Eo&&e.has("OES_texture_half_float_linear")===!1)return;(w.anisotropy>1||n.get(w).__currentAnisotropy)&&(i.texParameterf(S,le.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy)}}function oe(S,w){let O=!1;S.__webglInit===void 0&&(S.__webglInit=!0,w.addEventListener("dispose",C));const le=w.source;let re=f.get(le);re===void 0&&(re={},f.set(le,re));const se=B(w);if(se!==S.__cacheKey){re[se]===void 0&&(re[se]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),re[se].usedTimes++;const Le=re[S.__cacheKey];Le!==void 0&&(re[S.__cacheKey].usedTimes--,Le.usedTimes===0&&T(w)),S.__cacheKey=se,S.__webglTexture=re[se].texture}return O}function ee(S,w,O){let le=i.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(le=i.TEXTURE_2D_ARRAY),w.isData3DTexture&&(le=i.TEXTURE_3D);const re=oe(S,w),se=w.source;t.bindTexture(le,S.__webglTexture,i.TEXTURE0+O);const Le=n.get(se);if(se.version!==Le.__version||re===!0){t.activeTexture(i.TEXTURE0+O);const xe=pt.getPrimaries(pt.workingColorSpace),Te=w.colorSpace===bn?null:pt.getPrimaries(w.colorSpace),Ne=w.colorSpace===bn||xe===Te?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const Ve=m(w)&&g(w.image)===!1;let ae=v(w.image,Ve,!1,s.maxTextureSize);ae=Se(w,ae);const st=g(ae)||l,Je=r.convert(w.format,w.colorSpace);let He=r.convert(w.type),Ue=M(w.internalFormat,Je,He,w.colorSpace,w.isVideoTexture);j(le,w,st);let Ee;const P=w.mipmaps,pe=l&&w.isVideoTexture!==!0&&Ue!==qh,Ie=Le.__version===void 0||re===!0,Ce=L(w,ae,st);if(w.isDepthTexture)Ue=i.DEPTH_COMPONENT,l?w.type===xi?Ue=i.DEPTH_COMPONENT32F:w.type===vi?Ue=i.DEPTH_COMPONENT24:w.type===Xi?Ue=i.DEPTH24_STENCIL8:Ue=i.DEPTH_COMPONENT16:w.type===xi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),w.format===ji&&Ue===i.DEPTH_COMPONENT&&w.type!==ol&&w.type!==vi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),w.type=vi,He=r.convert(w.type)),w.format===Xs&&Ue===i.DEPTH_COMPONENT&&(Ue=i.DEPTH_STENCIL,w.type!==Xi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),w.type=Xi,He=r.convert(w.type))),Ie&&(pe?t.texStorage2D(i.TEXTURE_2D,1,Ue,ae.width,ae.height):t.texImage2D(i.TEXTURE_2D,0,Ue,ae.width,ae.height,0,Je,He,null));else if(w.isDataTexture)if(P.length>0&&st){pe&&Ie&&t.texStorage2D(i.TEXTURE_2D,Ce,Ue,P[0].width,P[0].height);for(let he=0,U=P.length;he<U;he++)Ee=P[he],pe?t.texSubImage2D(i.TEXTURE_2D,he,0,0,Ee.width,Ee.height,Je,He,Ee.data):t.texImage2D(i.TEXTURE_2D,he,Ue,Ee.width,Ee.height,0,Je,He,Ee.data);w.generateMipmaps=!1}else pe?(Ie&&t.texStorage2D(i.TEXTURE_2D,Ce,Ue,ae.width,ae.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae.width,ae.height,Je,He,ae.data)):t.texImage2D(i.TEXTURE_2D,0,Ue,ae.width,ae.height,0,Je,He,ae.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){pe&&Ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,Ue,P[0].width,P[0].height,ae.depth);for(let he=0,U=P.length;he<U;he++)Ee=P[he],w.format!==Ln?Je!==null?pe?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,0,Ee.width,Ee.height,ae.depth,Je,Ee.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,he,Ue,Ee.width,Ee.height,ae.depth,0,Ee.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):pe?t.texSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,0,Ee.width,Ee.height,ae.depth,Je,He,Ee.data):t.texImage3D(i.TEXTURE_2D_ARRAY,he,Ue,Ee.width,Ee.height,ae.depth,0,Je,He,Ee.data)}else{pe&&Ie&&t.texStorage2D(i.TEXTURE_2D,Ce,Ue,P[0].width,P[0].height);for(let he=0,U=P.length;he<U;he++)Ee=P[he],w.format!==Ln?Je!==null?pe?t.compressedTexSubImage2D(i.TEXTURE_2D,he,0,0,Ee.width,Ee.height,Je,Ee.data):t.compressedTexImage2D(i.TEXTURE_2D,he,Ue,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):pe?t.texSubImage2D(i.TEXTURE_2D,he,0,0,Ee.width,Ee.height,Je,He,Ee.data):t.texImage2D(i.TEXTURE_2D,he,Ue,Ee.width,Ee.height,0,Je,He,Ee.data)}else if(w.isDataArrayTexture)pe?(Ie&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,Ue,ae.width,ae.height,ae.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,Je,He,ae.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ue,ae.width,ae.height,ae.depth,0,Je,He,ae.data);else if(w.isData3DTexture)pe?(Ie&&t.texStorage3D(i.TEXTURE_3D,Ce,Ue,ae.width,ae.height,ae.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,Je,He,ae.data)):t.texImage3D(i.TEXTURE_3D,0,Ue,ae.width,ae.height,ae.depth,0,Je,He,ae.data);else if(w.isFramebufferTexture){if(Ie)if(pe)t.texStorage2D(i.TEXTURE_2D,Ce,Ue,ae.width,ae.height);else{let he=ae.width,U=ae.height;for(let ge=0;ge<Ce;ge++)t.texImage2D(i.TEXTURE_2D,ge,Ue,he,U,0,Je,He,null),he>>=1,U>>=1}}else if(P.length>0&&st){pe&&Ie&&t.texStorage2D(i.TEXTURE_2D,Ce,Ue,P[0].width,P[0].height);for(let he=0,U=P.length;he<U;he++)Ee=P[he],pe?t.texSubImage2D(i.TEXTURE_2D,he,0,0,Je,He,Ee):t.texImage2D(i.TEXTURE_2D,he,Ue,Je,He,Ee);w.generateMipmaps=!1}else pe?(Ie&&t.texStorage2D(i.TEXTURE_2D,Ce,Ue,ae.width,ae.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,Je,He,ae)):t.texImage2D(i.TEXTURE_2D,0,Ue,Je,He,ae);y(w,st)&&x(le),Le.__version=se.version,w.onUpdate&&w.onUpdate(w)}S.__version=w.version}function ue(S,w,O){if(w.image.length!==6)return;const le=oe(S,w),re=w.source;t.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+O);const se=n.get(re);if(re.version!==se.__version||le===!0){t.activeTexture(i.TEXTURE0+O);const Le=pt.getPrimaries(pt.workingColorSpace),xe=w.colorSpace===bn?null:pt.getPrimaries(w.colorSpace),Te=w.colorSpace===bn||Le===xe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,w.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,w.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);const Ne=w.isCompressedTexture||w.image[0].isCompressedTexture,Ve=w.image[0]&&w.image[0].isDataTexture,ae=[];for(let he=0;he<6;he++)!Ne&&!Ve?ae[he]=v(w.image[he],!1,!0,s.maxCubemapSize):ae[he]=Ve?w.image[he].image:w.image[he],ae[he]=Se(w,ae[he]);const st=ae[0],Je=g(st)||l,He=r.convert(w.format,w.colorSpace),Ue=r.convert(w.type),Ee=M(w.internalFormat,He,Ue,w.colorSpace),P=l&&w.isVideoTexture!==!0,pe=se.__version===void 0||le===!0;let Ie=L(w,st,Je);j(i.TEXTURE_CUBE_MAP,w,Je);let Ce;if(Ne){P&&pe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ie,Ee,st.width,st.height);for(let he=0;he<6;he++){Ce=ae[he].mipmaps;for(let U=0;U<Ce.length;U++){const ge=Ce[U];w.format!==Ln?He!==null?P?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U,0,0,ge.width,ge.height,He,ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U,Ee,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U,0,0,ge.width,ge.height,He,Ue,ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U,Ee,ge.width,ge.height,0,He,Ue,ge.data)}}}else{Ce=w.mipmaps,P&&pe&&(Ce.length>0&&Ie++,t.texStorage2D(i.TEXTURE_CUBE_MAP,Ie,Ee,ae[0].width,ae[0].height));for(let he=0;he<6;he++)if(Ve){P?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,ae[he].width,ae[he].height,He,Ue,ae[he].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,Ee,ae[he].width,ae[he].height,0,He,Ue,ae[he].data);for(let U=0;U<Ce.length;U++){const we=Ce[U].image[he].image;P?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U+1,0,0,we.width,we.height,He,Ue,we.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U+1,Ee,we.width,we.height,0,He,Ue,we.data)}}else{P?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,He,Ue,ae[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,Ee,He,Ue,ae[he]);for(let U=0;U<Ce.length;U++){const ge=Ce[U];P?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U+1,0,0,He,Ue,ge.image[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,U+1,Ee,He,Ue,ge.image[he])}}}y(w,Je)&&x(i.TEXTURE_CUBE_MAP),se.__version=re.version,w.onUpdate&&w.onUpdate(w)}S.__version=w.version}function me(S,w,O,le,re,se){const Le=r.convert(O.format,O.colorSpace),xe=r.convert(O.type),Te=M(O.internalFormat,Le,xe,O.colorSpace);if(!n.get(w).__hasExternalTextures){const Ve=Math.max(1,w.width>>se),ae=Math.max(1,w.height>>se);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,se,Te,Ve,ae,w.depth,0,Le,xe,null):t.texImage2D(re,se,Te,Ve,ae,0,Le,xe,null)}t.bindFramebuffer(i.FRAMEBUFFER,S),$(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,le,re,n.get(O).__webglTexture,0,Q(w)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,le,re,n.get(O).__webglTexture,se),t.bindFramebuffer(i.FRAMEBUFFER,null)}function be(S,w,O){if(i.bindRenderbuffer(i.RENDERBUFFER,S),w.depthBuffer&&!w.stencilBuffer){let le=l===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(O||$(w)){const re=w.depthTexture;re&&re.isDepthTexture&&(re.type===xi?le=i.DEPTH_COMPONENT32F:re.type===vi&&(le=i.DEPTH_COMPONENT24));const se=Q(w);$(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,se,le,w.width,w.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,se,le,w.width,w.height)}else i.renderbufferStorage(i.RENDERBUFFER,le,w.width,w.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,S)}else if(w.depthBuffer&&w.stencilBuffer){const le=Q(w);O&&$(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,le,i.DEPTH24_STENCIL8,w.width,w.height):$(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,le,i.DEPTH24_STENCIL8,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,S)}else{const le=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let re=0;re<le.length;re++){const se=le[re],Le=r.convert(se.format,se.colorSpace),xe=r.convert(se.type),Te=M(se.internalFormat,Le,xe,se.colorSpace),Ne=Q(w);O&&$(w)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne,Te,w.width,w.height):$(w)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ne,Te,w.width,w.height):i.renderbufferStorage(i.RENDERBUFFER,Te,w.width,w.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Re(S,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,S),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),H(w.depthTexture,0);const le=n.get(w.depthTexture).__webglTexture,re=Q(w);if(w.depthTexture.format===ji)$(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,le,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,le,0);else if(w.depthTexture.format===Xs)$(w)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,le,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,le,0);else throw new Error("Unknown depthTexture format")}function ye(S){const w=n.get(S),O=S.isWebGLCubeRenderTarget===!0;if(S.depthTexture&&!w.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Re(w.__webglFramebuffer,S)}else if(O){w.__webglDepthbuffer=[];for(let le=0;le<6;le++)t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer[le]),w.__webglDepthbuffer[le]=i.createRenderbuffer(),be(w.__webglDepthbuffer[le],S,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer=i.createRenderbuffer(),be(w.__webglDepthbuffer,S,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function De(S,w,O){const le=n.get(S);w!==void 0&&me(le.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&ye(S)}function D(S){const w=S.texture,O=n.get(S),le=n.get(w);S.addEventListener("dispose",G),S.isWebGLMultipleRenderTargets!==!0&&(le.__webglTexture===void 0&&(le.__webglTexture=i.createTexture()),le.__version=w.version,a.memory.textures++);const re=S.isWebGLCubeRenderTarget===!0,se=S.isWebGLMultipleRenderTargets===!0,Le=g(S)||l;if(re){O.__webglFramebuffer=[];for(let xe=0;xe<6;xe++)if(l&&w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer[xe]=[];for(let Te=0;Te<w.mipmaps.length;Te++)O.__webglFramebuffer[xe][Te]=i.createFramebuffer()}else O.__webglFramebuffer[xe]=i.createFramebuffer()}else{if(l&&w.mipmaps&&w.mipmaps.length>0){O.__webglFramebuffer=[];for(let xe=0;xe<w.mipmaps.length;xe++)O.__webglFramebuffer[xe]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(se)if(s.drawBuffers){const xe=S.texture;for(let Te=0,Ne=xe.length;Te<Ne;Te++){const Ve=n.get(xe[Te]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(l&&S.samples>0&&$(S)===!1){const xe=se?w:[w];O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let Te=0;Te<xe.length;Te++){const Ne=xe[Te];O.__webglColorRenderbuffer[Te]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[Te]);const Ve=r.convert(Ne.format,Ne.colorSpace),ae=r.convert(Ne.type),st=M(Ne.internalFormat,Ve,ae,Ne.colorSpace,S.isXRRenderTarget===!0),Je=Q(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,Je,st,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Te,i.RENDERBUFFER,O.__webglColorRenderbuffer[Te])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),be(O.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(re){t.bindTexture(i.TEXTURE_CUBE_MAP,le.__webglTexture),j(i.TEXTURE_CUBE_MAP,w,Le);for(let xe=0;xe<6;xe++)if(l&&w.mipmaps&&w.mipmaps.length>0)for(let Te=0;Te<w.mipmaps.length;Te++)me(O.__webglFramebuffer[xe][Te],S,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xe,Te);else me(O.__webglFramebuffer[xe],S,w,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xe,0);y(w,Le)&&x(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){const xe=S.texture;for(let Te=0,Ne=xe.length;Te<Ne;Te++){const Ve=xe[Te],ae=n.get(Ve);t.bindTexture(i.TEXTURE_2D,ae.__webglTexture),j(i.TEXTURE_2D,Ve,Le),me(O.__webglFramebuffer,S,Ve,i.COLOR_ATTACHMENT0+Te,i.TEXTURE_2D,0),y(Ve,Le)&&x(i.TEXTURE_2D)}t.unbindTexture()}else{let xe=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(l?xe=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(xe,le.__webglTexture),j(xe,w,Le),l&&w.mipmaps&&w.mipmaps.length>0)for(let Te=0;Te<w.mipmaps.length;Te++)me(O.__webglFramebuffer[Te],S,w,i.COLOR_ATTACHMENT0,xe,Te);else me(O.__webglFramebuffer,S,w,i.COLOR_ATTACHMENT0,xe,0);y(w,Le)&&x(xe),t.unbindTexture()}S.depthBuffer&&ye(S)}function ne(S){const w=g(S)||l,O=S.isWebGLMultipleRenderTargets===!0?S.texture:[S.texture];for(let le=0,re=O.length;le<re;le++){const se=O[le];if(y(se,w)){const Le=S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,xe=n.get(se).__webglTexture;t.bindTexture(Le,xe),x(Le),t.unbindTexture()}}}function Y(S){if(l&&S.samples>0&&$(S)===!1){const w=S.isWebGLMultipleRenderTargets?S.texture:[S.texture],O=S.width,le=S.height;let re=i.COLOR_BUFFER_BIT;const se=[],Le=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=n.get(S),Te=S.isWebGLMultipleRenderTargets===!0;if(Te)for(let Ne=0;Ne<w.length;Ne++)t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,xe.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,xe.__webglFramebuffer);for(let Ne=0;Ne<w.length;Ne++){se.push(i.COLOR_ATTACHMENT0+Ne),S.depthBuffer&&se.push(Le);const Ve=xe.__ignoreDepthValues!==void 0?xe.__ignoreDepthValues:!1;if(Ve===!1&&(S.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),Te&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,xe.__webglColorRenderbuffer[Ne]),Ve===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Le]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Le])),Te){const ae=n.get(w[Ne]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ae,0)}i.blitFramebuffer(0,0,O,le,0,0,O,le,re,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,se)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Te)for(let Ne=0;Ne<w.length;Ne++){t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.RENDERBUFFER,xe.__webglColorRenderbuffer[Ne]);const Ve=n.get(w[Ne]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ne,i.TEXTURE_2D,Ve,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,xe.__webglMultisampledFramebuffer)}}function Q(S){return Math.min(s.maxSamples,S.samples)}function $(S){const w=n.get(S);return l&&S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Pe(S){const w=a.render.frame;d.get(S)!==w&&(d.set(S,w),S.update())}function Se(S,w){const O=S.colorSpace,le=S.format,re=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||S.format===ja||O!==ai&&O!==bn&&(pt.getTransfer(O)===vt?l===!1?e.has("EXT_sRGB")===!0&&le===Ln?(S.format=ja,S.minFilter=wn,S.generateMipmaps=!1):w=Jh.sRGBToLinear(w):(le!==Ln||re!==bi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),w}this.allocateTextureUnit=I,this.resetTextureUnits=ie,this.setTexture2D=H,this.setTexture2DArray=K,this.setTexture3D=Z,this.setTextureCube=J,this.rebindTextures=De,this.setupRenderTarget=D,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=me,this.useMultisampledRTT=$}function i_(i,e,t){const n=t.isWebGL2;function s(r,a=bn){let l;const c=pt.getTransfer(a);if(r===bi)return i.UNSIGNED_BYTE;if(r===Gh)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Vh)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Eu)return i.BYTE;if(r===Tu)return i.SHORT;if(r===ol)return i.UNSIGNED_SHORT;if(r===Hh)return i.INT;if(r===vi)return i.UNSIGNED_INT;if(r===xi)return i.FLOAT;if(r===Eo)return n?i.HALF_FLOAT:(l=e.get("OES_texture_half_float"),l!==null?l.HALF_FLOAT_OES:null);if(r===Au)return i.ALPHA;if(r===Ln)return i.RGBA;if(r===Ru)return i.LUMINANCE;if(r===Cu)return i.LUMINANCE_ALPHA;if(r===ji)return i.DEPTH_COMPONENT;if(r===Xs)return i.DEPTH_STENCIL;if(r===ja)return l=e.get("EXT_sRGB"),l!==null?l.SRGB_ALPHA_EXT:null;if(r===Pu)return i.RED;if(r===Wh)return i.RED_INTEGER;if(r===Lu)return i.RG;if(r===Xh)return i.RG_INTEGER;if(r===jh)return i.RGBA_INTEGER;if(r===ta||r===na||r===ia||r===sa)if(c===vt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(r===ta)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===na)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ia)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===sa)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(r===ta)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===na)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ia)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===sa)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ol||r===Fl||r===zl||r===Bl)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(r===Ol)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Fl)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===zl)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Bl)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===qh)return l=e.get("WEBGL_compressed_texture_etc1"),l!==null?l.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Hl||r===Gl)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(r===Hl)return c===vt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(r===Gl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Vl||r===Wl||r===Xl||r===jl||r===ql||r===Yl||r===$l||r===Kl||r===Zl||r===Jl||r===Ql||r===ec||r===tc||r===nc)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(r===Vl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Wl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Xl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===jl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===ql)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Yl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===$l)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Kl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Zl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Jl)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Ql)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ec)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===tc)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===nc)return c===vt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===oa||r===ic||r===sc)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(r===oa)return c===vt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===ic)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===sc)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Du||r===oc||r===rc||r===ac)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(r===oa)return l.COMPRESSED_RED_RGTC1_EXT;if(r===oc)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===rc)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===ac)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Xi?n?i.UNSIGNED_INT_24_8:(l=e.get("WEBGL_depth_texture"),l!==null?l.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class s_ extends pn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class _e extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const o_={type:"move"};class Ra{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const l=this._targetRay,c=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,n),m=this._getHandJoint(h,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const d=h.joints["index-finger-tip"],u=h.joints["thumb-tip"],f=d.position.distanceTo(u.position),p=.02,_=.005;h.inputState.pinching&&f>p+_?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&f<=p-_&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));l!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(o_)))}return l!==null&&(l.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new _e;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class r_ extends ts{constructor(e,t){super();const n=this;let s=null,r=1,a=null,l="local-floor",c=1,h=null,d=null,u=null,f=null,p=null,_=null;const v=t.getContextAttributes();let g=null,m=null;const y=[],x=[],M=new de;let L=null;const R=new pn;R.layers.enable(1),R.viewport=new xt;const C=new pn;C.layers.enable(2),C.viewport=new xt;const G=[R,C],b=new s_;b.layers.enable(1),b.layers.enable(2);let T=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let oe=y[j];return oe===void 0&&(oe=new Ra,y[j]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(j){let oe=y[j];return oe===void 0&&(oe=new Ra,y[j]=oe),oe.getGripSpace()},this.getHand=function(j){let oe=y[j];return oe===void 0&&(oe=new Ra,y[j]=oe),oe.getHandSpace()};function V(j){const oe=x.indexOf(j.inputSource);if(oe===-1)return;const ee=y[oe];ee!==void 0&&(ee.update(j.inputSource,j.frame,h||a),ee.dispatchEvent({type:j.type,data:j.inputSource}))}function ie(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",ie),s.removeEventListener("inputsourceschange",I);for(let j=0;j<y.length;j++){const oe=x[j];oe!==null&&(x[j]=null,y[j].disconnect(oe))}T=null,z=null,e.setRenderTarget(g),p=null,f=null,u=null,s=null,m=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){l=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(j){h=j},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(g=e.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",ie),s.addEventListener("inputsourceschange",I),v.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(M),s.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const oe={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,oe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),m=new Ki(p.framebufferWidth,p.framebufferHeight,{format:Ln,type:bi,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let oe=null,ee=null,ue=null;v.depth&&(ue=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=v.stencil?Xs:ji,ee=v.stencil?Xi:vi);const me={colorFormat:t.RGBA8,depthFormat:ue,scaleFactor:r};u=new XRWebGLBinding(s,t),f=u.createProjectionLayer(me),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),m=new Ki(f.textureWidth,f.textureHeight,{format:Ln,type:bi,depthTexture:new hd(f.textureWidth,f.textureHeight,ee,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0});const be=e.properties.get(m);be.__ignoreDepthValues=f.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(l),fe.setContext(s),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(j){for(let oe=0;oe<j.removed.length;oe++){const ee=j.removed[oe],ue=x.indexOf(ee);ue>=0&&(x[ue]=null,y[ue].disconnect(ee))}for(let oe=0;oe<j.added.length;oe++){const ee=j.added[oe];let ue=x.indexOf(ee);if(ue===-1){for(let be=0;be<y.length;be++)if(be>=x.length){x.push(ee),ue=be;break}else if(x[be]===null){x[be]=ee,ue=be;break}if(ue===-1)break}const me=y[ue];me&&me.connect(ee)}}const B=new A,H=new A;function K(j,oe,ee){B.setFromMatrixPosition(oe.matrixWorld),H.setFromMatrixPosition(ee.matrixWorld);const ue=B.distanceTo(H),me=oe.projectionMatrix.elements,be=ee.projectionMatrix.elements,Re=me[14]/(me[10]-1),ye=me[14]/(me[10]+1),De=(me[9]+1)/me[5],D=(me[9]-1)/me[5],ne=(me[8]-1)/me[0],Y=(be[8]+1)/be[0],Q=Re*ne,$=Re*Y,Pe=ue/(-ne+Y),Se=Pe*-ne;oe.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Se),j.translateZ(Pe),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert();const S=Re+Pe,w=ye+Pe,O=Q-Se,le=$+(ue-Se),re=De*ye/w*S,se=D*ye/w*S;j.projectionMatrix.makePerspective(O,le,re,se,S,w),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}function Z(j,oe){oe===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(oe.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;b.near=C.near=R.near=j.near,b.far=C.far=R.far=j.far,(T!==b.near||z!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),T=b.near,z=b.far);const oe=j.parent,ee=b.cameras;Z(b,oe);for(let ue=0;ue<ee.length;ue++)Z(ee[ue],oe);ee.length===2?K(b,R,C):b.projectionMatrix.copy(R.projectionMatrix),J(j,b,oe)};function J(j,oe,ee){ee===null?j.matrix.copy(oe.matrixWorld):(j.matrix.copy(ee.matrixWorld),j.matrix.invert(),j.matrix.multiply(oe.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(oe.projectionMatrix),j.projectionMatrixInverse.copy(oe.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=To*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(j){c=j,f!==null&&(f.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)};let te=null;function ce(j,oe){if(d=oe.getViewerPose(h||a),_=oe,d!==null){const ee=d.views;p!==null&&(e.setRenderTargetFramebuffer(m,p.framebuffer),e.setRenderTarget(m));let ue=!1;ee.length!==b.cameras.length&&(b.cameras.length=0,ue=!0);for(let me=0;me<ee.length;me++){const be=ee[me];let Re=null;if(p!==null)Re=p.getViewport(be);else{const De=u.getViewSubImage(f,be);Re=De.viewport,me===0&&(e.setRenderTargetTextures(m,De.colorTexture,f.ignoreDepthValues?void 0:De.depthStencilTexture),e.setRenderTarget(m))}let ye=G[me];ye===void 0&&(ye=new pn,ye.layers.enable(me),ye.viewport=new xt,G[me]=ye),ye.matrix.fromArray(be.transform.matrix),ye.matrix.decompose(ye.position,ye.quaternion,ye.scale),ye.projectionMatrix.fromArray(be.projectionMatrix),ye.projectionMatrixInverse.copy(ye.projectionMatrix).invert(),ye.viewport.set(Re.x,Re.y,Re.width,Re.height),me===0&&(b.matrix.copy(ye.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),ue===!0&&b.cameras.push(ye)}}for(let ee=0;ee<y.length;ee++){const ue=x[ee],me=y[ee];ue!==null&&me!==void 0&&me.update(ue,oe,h||a)}te&&te(j,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),_=null}const fe=new ld;fe.setAnimationLoop(ce),this.setAnimationLoop=function(j){te=j},this.dispose=function(){}}}function a_(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,od(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,y,x,M){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),d(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&p(g,m,M)):m.isMeshMatcapMaterial?(r(g,m),_(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),v(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&l(g,m)):m.isPointsMaterial?c(g,m,y,x):m.isSpriteMaterial?h(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===rn&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===rn&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const y=e.get(m).envMap;if(y&&(g.envMap.value=y,g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap){g.lightMap.value=m.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;g.lightMapIntensity.value=m.lightMapIntensity*x,t(m.lightMap,g.lightMapTransform)}m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function l(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,y,x){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*y,g.scale.value=x*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function d(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),e.get(m).envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function p(g,m,y){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===rn&&g.clearcoatNormalScale.value.negate())),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function _(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const y=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function l_(i,e,t,n){let s={},r={},a=[];const l=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(y,x){const M=x.program;n.uniformBlockBinding(y,M)}function h(y,x){let M=s[y.id];M===void 0&&(_(y),M=d(y),s[y.id]=M,y.addEventListener("dispose",g));const L=x.program;n.updateUBOMapping(y,L);const R=e.render.frame;r[y.id]!==R&&(f(y),r[y.id]=R)}function d(y){const x=u();y.__bindingPointIndex=x;const M=i.createBuffer(),L=y.__size,R=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,L,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,M),M}function u(){for(let y=0;y<l;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(y){const x=s[y.id],M=y.uniforms,L=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let R=0,C=M.length;R<C;R++){const G=Array.isArray(M[R])?M[R]:[M[R]];for(let b=0,T=G.length;b<T;b++){const z=G[b];if(p(z,R,b,L)===!0){const V=z.__offset,ie=Array.isArray(z.value)?z.value:[z.value];let I=0;for(let B=0;B<ie.length;B++){const H=ie[B],K=v(H);typeof H=="number"||typeof H=="boolean"?(z.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,V+I,z.__data)):H.isMatrix3?(z.__data[0]=H.elements[0],z.__data[1]=H.elements[1],z.__data[2]=H.elements[2],z.__data[3]=0,z.__data[4]=H.elements[3],z.__data[5]=H.elements[4],z.__data[6]=H.elements[5],z.__data[7]=0,z.__data[8]=H.elements[6],z.__data[9]=H.elements[7],z.__data[10]=H.elements[8],z.__data[11]=0):(H.toArray(z.__data,I),I+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,z.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(y,x,M,L){const R=y.value,C=x+"_"+M;if(L[C]===void 0)return typeof R=="number"||typeof R=="boolean"?L[C]=R:L[C]=R.clone(),!0;{const G=L[C];if(typeof R=="number"||typeof R=="boolean"){if(G!==R)return L[C]=R,!0}else if(G.equals(R)===!1)return G.copy(R),!0}return!1}function _(y){const x=y.uniforms;let M=0;const L=16;for(let C=0,G=x.length;C<G;C++){const b=Array.isArray(x[C])?x[C]:[x[C]];for(let T=0,z=b.length;T<z;T++){const V=b[T],ie=Array.isArray(V.value)?V.value:[V.value];for(let I=0,B=ie.length;I<B;I++){const H=ie[I],K=v(H),Z=M%L;Z!==0&&L-Z<K.boundary&&(M+=L-Z),V.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=M,M+=K.storage}}}const R=M%L;return R>0&&(M+=L-R),y.__size=M,y.__cache={},this}function v(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function g(y){const x=y.target;x.removeEventListener("dispose",g);const M=a.indexOf(x.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function m(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:c,update:h,dispose:m}}class gd{constructor(e={}){const{canvas:t=sf(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:l=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const p=new Uint32Array(4),_=new Int32Array(4);let v=null,g=null;const m=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Lt,this._useLegacyLights=!1,this.toneMapping=Mi,this.toneMappingExposure=1;const x=this;let M=!1,L=0,R=0,C=null,G=-1,b=null;const T=new xt,z=new xt;let V=null;const ie=new at(0);let I=0,B=t.width,H=t.height,K=1,Z=null,J=null;const te=new xt(0,0,B,H),ce=new xt(0,0,B,H);let fe=!1;const j=new ll;let oe=!1,ee=!1,ue=null;const me=new mt,be=new de,Re=new A,ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function De(){return C===null?K:1}let D=n;function ne(E,F){for(let X=0;X<E.length;X++){const q=E[X],W=t.getContext(q,F);if(W!==null)return W}return null}try{const E={alpha:!0,depth:s,stencil:r,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${sl}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",U,!1),t.addEventListener("webglcontextcreationerror",ge,!1),D===null){const F=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&F.shift(),D=ne(F,E),D===null)throw ne(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&D instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),D.getShaderPrecisionFormat===void 0&&(D.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Y,Q,$,Pe,Se,S,w,O,le,re,se,Le,xe,Te,Ne,Ve,ae,st,Je,He,Ue,Ee,P,pe;function Ie(){Y=new v0(D),Q=new u0(D,Y,e),Y.init(Q),Ee=new i_(D,Y,Q),$=new t_(D,Y,Q),Pe=new w0(D),Se=new Hg,S=new n_(D,Y,$,Se,Q,Ee,Pe),w=new p0(x),O=new _0(x),le=new Cf(D,Q),P=new h0(D,Y,le,Q),re=new x0(D,le,Pe,P),se=new E0(D,re,le,Pe),Je=new S0(D,Q,S),Ve=new f0(Se),Le=new Bg(x,w,O,Y,Q,P,Ve),xe=new a_(x,Se),Te=new Vg,Ne=new $g(Y,Q),st=new c0(x,w,O,$,se,f,c),ae=new e_(x,se,Q),pe=new l_(D,Pe,Q,$),He=new d0(D,Y,Pe,Q),Ue=new y0(D,Y,Pe,Q),Pe.programs=Le.programs,x.capabilities=Q,x.extensions=Y,x.properties=Se,x.renderLists=Te,x.shadowMap=ae,x.state=$,x.info=Pe}Ie();const Ce=new r_(x,D);this.xr=Ce,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const E=Y.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Y.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(E){E!==void 0&&(K=E,this.setSize(B,H,!1))},this.getSize=function(E){return E.set(B,H)},this.setSize=function(E,F,X=!0){if(Ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=E,H=F,t.width=Math.floor(E*K),t.height=Math.floor(F*K),X===!0&&(t.style.width=E+"px",t.style.height=F+"px"),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(B*K,H*K).floor()},this.setDrawingBufferSize=function(E,F,X){B=E,H=F,K=X,t.width=Math.floor(E*X),t.height=Math.floor(F*X),this.setViewport(0,0,E,F)},this.getCurrentViewport=function(E){return E.copy(T)},this.getViewport=function(E){return E.copy(te)},this.setViewport=function(E,F,X,q){E.isVector4?te.set(E.x,E.y,E.z,E.w):te.set(E,F,X,q),$.viewport(T.copy(te).multiplyScalar(K).floor())},this.getScissor=function(E){return E.copy(ce)},this.setScissor=function(E,F,X,q){E.isVector4?ce.set(E.x,E.y,E.z,E.w):ce.set(E,F,X,q),$.scissor(z.copy(ce).multiplyScalar(K).floor())},this.getScissorTest=function(){return fe},this.setScissorTest=function(E){$.setScissorTest(fe=E)},this.setOpaqueSort=function(E){Z=E},this.setTransparentSort=function(E){J=E},this.getClearColor=function(E){return E.copy(st.getClearColor())},this.setClearColor=function(){st.setClearColor.apply(st,arguments)},this.getClearAlpha=function(){return st.getClearAlpha()},this.setClearAlpha=function(){st.setClearAlpha.apply(st,arguments)},this.clear=function(E=!0,F=!0,X=!0){let q=0;if(E){let W=!1;if(C!==null){const Ae=C.texture.format;W=Ae===jh||Ae===Xh||Ae===Wh}if(W){const Ae=C.texture.type,ke=Ae===bi||Ae===vi||Ae===ol||Ae===Xi||Ae===Gh||Ae===Vh,Be=st.getClearColor(),Ge=st.getClearAlpha(),Qe=Be.r,Xe=Be.g,qe=Be.b;ke?(p[0]=Qe,p[1]=Xe,p[2]=qe,p[3]=Ge,D.clearBufferuiv(D.COLOR,0,p)):(_[0]=Qe,_[1]=Xe,_[2]=qe,_[3]=Ge,D.clearBufferiv(D.COLOR,0,_))}else q|=D.COLOR_BUFFER_BIT}F&&(q|=D.DEPTH_BUFFER_BIT),X&&(q|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",U,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),Te.dispose(),Ne.dispose(),Se.dispose(),w.dispose(),O.dispose(),se.dispose(),P.dispose(),pe.dispose(),Le.dispose(),Ce.dispose(),Ce.removeEventListener("sessionstart",At),Ce.removeEventListener("sessionend",ct),ue&&(ue.dispose(),ue=null),Ct.stop()};function he(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const E=Pe.autoReset,F=ae.enabled,X=ae.autoUpdate,q=ae.needsUpdate,W=ae.type;Ie(),Pe.autoReset=E,ae.enabled=F,ae.autoUpdate=X,ae.needsUpdate=q,ae.type=W}function ge(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function we(E){const F=E.target;F.removeEventListener("dispose",we),ze(F)}function ze(E){Oe(E),Se.remove(E)}function Oe(E){const F=Se.get(E).programs;F!==void 0&&(F.forEach(function(X){Le.releaseProgram(X)}),E.isShaderMaterial&&Le.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,X,q,W,Ae){F===null&&(F=ye);const ke=W.isMesh&&W.matrixWorld.determinant()<0,Be=Gd(E,F,X,q,W);$.setMaterial(q,ke);let Ge=X.index,Qe=1;if(q.wireframe===!0){if(Ge=re.getWireframeAttribute(X),Ge===void 0)return;Qe=2}const Xe=X.drawRange,qe=X.attributes.position;let Rt=Xe.start*Qe,ln=(Xe.start+Xe.count)*Qe;Ae!==null&&(Rt=Math.max(Rt,Ae.start*Qe),ln=Math.min(ln,(Ae.start+Ae.count)*Qe)),Ge!==null?(Rt=Math.max(Rt,0),ln=Math.min(ln,Ge.count)):qe!=null&&(Rt=Math.max(Rt,0),ln=Math.min(ln,qe.count));const Ft=ln-Rt;if(Ft<0||Ft===1/0)return;P.setup(W,q,Be,X,Ge);let qn,yt=He;if(Ge!==null&&(qn=le.get(Ge),yt=Ue,yt.setIndex(qn)),W.isMesh)q.wireframe===!0?($.setLineWidth(q.wireframeLinewidth*De()),yt.setMode(D.LINES)):yt.setMode(D.TRIANGLES);else if(W.isLine){let et=q.linewidth;et===void 0&&(et=1),$.setLineWidth(et*De()),W.isLineSegments?yt.setMode(D.LINES):W.isLineLoop?yt.setMode(D.LINE_LOOP):yt.setMode(D.LINE_STRIP)}else W.isPoints?yt.setMode(D.POINTS):W.isSprite&&yt.setMode(D.TRIANGLES);if(W.isBatchedMesh)yt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else if(W.isInstancedMesh)yt.renderInstances(Rt,Ft,W.count);else if(X.isInstancedBufferGeometry){const et=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Kr=Math.min(X.instanceCount,et);yt.renderInstances(Rt,Ft,Kr)}else yt.render(Rt,Ft)};function nt(E,F,X){E.transparent===!0&&E.side===Yt&&E.forceSinglePass===!1?(E.side=rn,E.needsUpdate=!0,Oo(E,F,X),E.side=ri,E.needsUpdate=!0,Oo(E,F,X),E.side=Yt):Oo(E,F,X)}this.compile=function(E,F,X=null){X===null&&(X=E),g=Ne.get(X),g.init(),y.push(g),X.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(g.pushLight(W),W.castShadow&&g.pushShadow(W))}),E!==X&&E.traverseVisible(function(W){W.isLight&&W.layers.test(F.layers)&&(g.pushLight(W),W.castShadow&&g.pushShadow(W))}),g.setupLights(x._useLegacyLights);const q=new Set;return E.traverse(function(W){const Ae=W.material;if(Ae)if(Array.isArray(Ae))for(let ke=0;ke<Ae.length;ke++){const Be=Ae[ke];nt(Be,X,W),q.add(Be)}else nt(Ae,X,W),q.add(Ae)}),y.pop(),g=null,q},this.compileAsync=function(E,F,X=null){const q=this.compile(E,F,X);return new Promise(W=>{function Ae(){if(q.forEach(function(ke){Se.get(ke).currentProgram.isReady()&&q.delete(ke)}),q.size===0){W(E);return}setTimeout(Ae,10)}Y.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let it=null;function bt(E){it&&it(E)}function At(){Ct.stop()}function ct(){Ct.start()}const Ct=new ld;Ct.setAnimationLoop(bt),typeof self<"u"&&Ct.setContext(self),this.setAnimationLoop=function(E){it=E,Ce.setAnimationLoop(E),E===null?Ct.stop():Ct.start()},Ce.addEventListener("sessionstart",At),Ce.addEventListener("sessionend",ct),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Ce.enabled===!0&&Ce.isPresenting===!0&&(Ce.cameraAutoUpdate===!0&&Ce.updateCamera(F),F=Ce.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,F,C),g=Ne.get(E,y.length),g.init(),y.push(g),me.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),j.setFromProjectionMatrix(me),ee=this.localClippingEnabled,oe=Ve.init(this.clippingPlanes,ee),v=Te.get(E,m.length),v.init(),m.push(v),kn(E,F,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(Z,J),this.info.render.frame++,oe===!0&&Ve.beginShadows();const X=g.state.shadowsArray;if(ae.render(X,E,F),oe===!0&&Ve.endShadows(),this.info.autoReset===!0&&this.info.reset(),st.render(v,E),g.setupLights(x._useLegacyLights),F.isArrayCamera){const q=F.cameras;for(let W=0,Ae=q.length;W<Ae;W++){const ke=q[W];Sl(v,E,ke,ke.viewport)}}else Sl(v,E,F);C!==null&&(S.updateMultisampleRenderTarget(C),S.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(x,E,F),P.resetDefaultState(),G=-1,b=null,y.pop(),y.length>0?g=y[y.length-1]:g=null,m.pop(),m.length>0?v=m[m.length-1]:v=null};function kn(E,F,X,q){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)g.pushLight(E),E.castShadow&&g.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||j.intersectsSprite(E)){q&&Re.setFromMatrixPosition(E.matrixWorld).applyMatrix4(me);const ke=se.update(E),Be=E.material;Be.visible&&v.push(E,ke,Be,X,Re.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||j.intersectsObject(E))){const ke=se.update(E),Be=E.material;if(q&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Re.copy(E.boundingSphere.center)):(ke.boundingSphere===null&&ke.computeBoundingSphere(),Re.copy(ke.boundingSphere.center)),Re.applyMatrix4(E.matrixWorld).applyMatrix4(me)),Array.isArray(Be)){const Ge=ke.groups;for(let Qe=0,Xe=Ge.length;Qe<Xe;Qe++){const qe=Ge[Qe],Rt=Be[qe.materialIndex];Rt&&Rt.visible&&v.push(E,ke,Rt,X,Re.z,qe)}}else Be.visible&&v.push(E,ke,Be,X,Re.z,null)}}const Ae=E.children;for(let ke=0,Be=Ae.length;ke<Be;ke++)kn(Ae[ke],F,X,q)}function Sl(E,F,X,q){const W=E.opaque,Ae=E.transmissive,ke=E.transparent;g.setupLightsView(X),oe===!0&&Ve.setGlobalState(x.clippingPlanes,X),Ae.length>0&&Hd(W,Ae,F,X),q&&$.viewport(T.copy(q)),W.length>0&&No(W,F,X),Ae.length>0&&No(Ae,F,X),ke.length>0&&No(ke,F,X),$.buffers.depth.setTest(!0),$.buffers.depth.setMask(!0),$.buffers.color.setMask(!0),$.setPolygonOffset(!1)}function Hd(E,F,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;const Ae=Q.isWebGL2;ue===null&&(ue=new Ki(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")?Eo:bi,minFilter:So,samples:Ae?4:0})),x.getDrawingBufferSize(be),Ae?ue.setSize(be.x,be.y):ue.setSize(Cr(be.x),Cr(be.y));const ke=x.getRenderTarget();x.setRenderTarget(ue),x.getClearColor(ie),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();const Be=x.toneMapping;x.toneMapping=Mi,No(E,X,q),S.updateMultisampleRenderTarget(ue),S.updateRenderTargetMipmap(ue);let Ge=!1;for(let Qe=0,Xe=F.length;Qe<Xe;Qe++){const qe=F[Qe],Rt=qe.object,ln=qe.geometry,Ft=qe.material,qn=qe.group;if(Ft.side===Yt&&Rt.layers.test(q.layers)){const yt=Ft.side;Ft.side=rn,Ft.needsUpdate=!0,El(Rt,X,q,ln,Ft,qn),Ft.side=yt,Ft.needsUpdate=!0,Ge=!0}}Ge===!0&&(S.updateMultisampleRenderTarget(ue),S.updateRenderTargetMipmap(ue)),x.setRenderTarget(ke),x.setClearColor(ie,I),x.toneMapping=Be}function No(E,F,X){const q=F.isScene===!0?F.overrideMaterial:null;for(let W=0,Ae=E.length;W<Ae;W++){const ke=E[W],Be=ke.object,Ge=ke.geometry,Qe=q===null?ke.material:q,Xe=ke.group;Be.layers.test(X.layers)&&El(Be,F,X,Ge,Qe,Xe)}}function El(E,F,X,q,W,Ae){E.onBeforeRender(x,F,X,q,W,Ae),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),W.onBeforeRender(x,F,X,q,E,Ae),W.transparent===!0&&W.side===Yt&&W.forceSinglePass===!1?(W.side=rn,W.needsUpdate=!0,x.renderBufferDirect(X,F,q,W,E,Ae),W.side=ri,W.needsUpdate=!0,x.renderBufferDirect(X,F,q,W,E,Ae),W.side=Yt):x.renderBufferDirect(X,F,q,W,E,Ae),E.onAfterRender(x,F,X,q,W,Ae)}function Oo(E,F,X){F.isScene!==!0&&(F=ye);const q=Se.get(E),W=g.state.lights,Ae=g.state.shadowsArray,ke=W.state.version,Be=Le.getParameters(E,W.state,Ae,F,X),Ge=Le.getProgramCacheKey(Be);let Qe=q.programs;q.environment=E.isMeshStandardMaterial?F.environment:null,q.fog=F.fog,q.envMap=(E.isMeshStandardMaterial?O:w).get(E.envMap||q.environment),Qe===void 0&&(E.addEventListener("dispose",we),Qe=new Map,q.programs=Qe);let Xe=Qe.get(Ge);if(Xe!==void 0){if(q.currentProgram===Xe&&q.lightsStateVersion===ke)return Al(E,Be),Xe}else Be.uniforms=Le.getUniforms(E),E.onBuild(X,Be,x),E.onBeforeCompile(Be,x),Xe=Le.acquireProgram(Be,Ge),Qe.set(Ge,Xe),q.uniforms=Be.uniforms;const qe=q.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(qe.clippingPlanes=Ve.uniform),Al(E,Be),q.needsLights=Wd(E),q.lightsStateVersion=ke,q.needsLights&&(qe.ambientLightColor.value=W.state.ambient,qe.lightProbe.value=W.state.probe,qe.directionalLights.value=W.state.directional,qe.directionalLightShadows.value=W.state.directionalShadow,qe.spotLights.value=W.state.spot,qe.spotLightShadows.value=W.state.spotShadow,qe.rectAreaLights.value=W.state.rectArea,qe.ltc_1.value=W.state.rectAreaLTC1,qe.ltc_2.value=W.state.rectAreaLTC2,qe.pointLights.value=W.state.point,qe.pointLightShadows.value=W.state.pointShadow,qe.hemisphereLights.value=W.state.hemi,qe.directionalShadowMap.value=W.state.directionalShadowMap,qe.directionalShadowMatrix.value=W.state.directionalShadowMatrix,qe.spotShadowMap.value=W.state.spotShadowMap,qe.spotLightMatrix.value=W.state.spotLightMatrix,qe.spotLightMap.value=W.state.spotLightMap,qe.pointShadowMap.value=W.state.pointShadowMap,qe.pointShadowMatrix.value=W.state.pointShadowMatrix),q.currentProgram=Xe,q.uniformsList=null,Xe}function Tl(E){if(E.uniformsList===null){const F=E.currentProgram.getUniforms();E.uniformsList=xr.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function Al(E,F){const X=Se.get(E);X.outputColorSpace=F.outputColorSpace,X.batching=F.batching,X.instancing=F.instancing,X.instancingColor=F.instancingColor,X.skinning=F.skinning,X.morphTargets=F.morphTargets,X.morphNormals=F.morphNormals,X.morphColors=F.morphColors,X.morphTargetsCount=F.morphTargetsCount,X.numClippingPlanes=F.numClippingPlanes,X.numIntersection=F.numClipIntersection,X.vertexAlphas=F.vertexAlphas,X.vertexTangents=F.vertexTangents,X.toneMapping=F.toneMapping}function Gd(E,F,X,q,W){F.isScene!==!0&&(F=ye),S.resetTextureUnits();const Ae=F.fog,ke=q.isMeshStandardMaterial?F.environment:null,Be=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ai,Ge=(q.isMeshStandardMaterial?O:w).get(q.envMap||ke),Qe=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Xe=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),qe=!!X.morphAttributes.position,Rt=!!X.morphAttributes.normal,ln=!!X.morphAttributes.color;let Ft=Mi;q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Ft=x.toneMapping);const qn=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,yt=qn!==void 0?qn.length:0,et=Se.get(q),Kr=g.state.lights;if(oe===!0&&(ee===!0||E!==b)){const xn=E===b&&q.id===G;Ve.setState(q,E,xn)}let St=!1;q.version===et.__version?(et.needsLights&&et.lightsStateVersion!==Kr.state.version||et.outputColorSpace!==Be||W.isBatchedMesh&&et.batching===!1||!W.isBatchedMesh&&et.batching===!0||W.isInstancedMesh&&et.instancing===!1||!W.isInstancedMesh&&et.instancing===!0||W.isSkinnedMesh&&et.skinning===!1||!W.isSkinnedMesh&&et.skinning===!0||W.isInstancedMesh&&et.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&et.instancingColor===!1&&W.instanceColor!==null||et.envMap!==Ge||q.fog===!0&&et.fog!==Ae||et.numClippingPlanes!==void 0&&(et.numClippingPlanes!==Ve.numPlanes||et.numIntersection!==Ve.numIntersection)||et.vertexAlphas!==Qe||et.vertexTangents!==Xe||et.morphTargets!==qe||et.morphNormals!==Rt||et.morphColors!==ln||et.toneMapping!==Ft||Q.isWebGL2===!0&&et.morphTargetsCount!==yt)&&(St=!0):(St=!0,et.__version=q.version);let Ai=et.currentProgram;St===!0&&(Ai=Oo(q,F,W));let Rl=!1,eo=!1,Zr=!1;const $t=Ai.getUniforms(),Ri=et.uniforms;if($.useProgram(Ai.program)&&(Rl=!0,eo=!0,Zr=!0),q.id!==G&&(G=q.id,eo=!0),Rl||b!==E){$t.setValue(D,"projectionMatrix",E.projectionMatrix),$t.setValue(D,"viewMatrix",E.matrixWorldInverse);const xn=$t.map.cameraPosition;xn!==void 0&&xn.setValue(D,Re.setFromMatrixPosition(E.matrixWorld)),Q.logarithmicDepthBuffer&&$t.setValue(D,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&$t.setValue(D,"isOrthographic",E.isOrthographicCamera===!0),b!==E&&(b=E,eo=!0,Zr=!0)}if(W.isSkinnedMesh){$t.setOptional(D,W,"bindMatrix"),$t.setOptional(D,W,"bindMatrixInverse");const xn=W.skeleton;xn&&(Q.floatVertexTextures?(xn.boneTexture===null&&xn.computeBoneTexture(),$t.setValue(D,"boneTexture",xn.boneTexture,S)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}W.isBatchedMesh&&($t.setOptional(D,W,"batchingTexture"),$t.setValue(D,"batchingTexture",W._matricesTexture,S));const Jr=X.morphAttributes;if((Jr.position!==void 0||Jr.normal!==void 0||Jr.color!==void 0&&Q.isWebGL2===!0)&&Je.update(W,X,Ai),(eo||et.receiveShadow!==W.receiveShadow)&&(et.receiveShadow=W.receiveShadow,$t.setValue(D,"receiveShadow",W.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Ri.envMap.value=Ge,Ri.flipEnvMap.value=Ge.isCubeTexture&&Ge.isRenderTargetTexture===!1?-1:1),eo&&($t.setValue(D,"toneMappingExposure",x.toneMappingExposure),et.needsLights&&Vd(Ri,Zr),Ae&&q.fog===!0&&xe.refreshFogUniforms(Ri,Ae),xe.refreshMaterialUniforms(Ri,q,K,H,ue),xr.upload(D,Tl(et),Ri,S)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(xr.upload(D,Tl(et),Ri,S),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&$t.setValue(D,"center",W.center),$t.setValue(D,"modelViewMatrix",W.modelViewMatrix),$t.setValue(D,"normalMatrix",W.normalMatrix),$t.setValue(D,"modelMatrix",W.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){const xn=q.uniformsGroups;for(let Qr=0,Xd=xn.length;Qr<Xd;Qr++)if(Q.isWebGL2){const Cl=xn[Qr];pe.update(Cl,Ai),pe.bind(Cl,Ai)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ai}function Vd(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function Wd(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,F,X){Se.get(E.texture).__webglTexture=F,Se.get(E.depthTexture).__webglTexture=X;const q=Se.get(E);q.__hasExternalTextures=!0,q.__hasExternalTextures&&(q.__autoAllocateDepthBuffer=X===void 0,q.__autoAllocateDepthBuffer||Y.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(E,F){const X=Se.get(E);X.__webglFramebuffer=F,X.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,X=0){C=E,L=F,R=X;let q=!0,W=null,Ae=!1,ke=!1;if(E){const Ge=Se.get(E);Ge.__useDefaultFramebuffer!==void 0?($.bindFramebuffer(D.FRAMEBUFFER,null),q=!1):Ge.__webglFramebuffer===void 0?S.setupRenderTarget(E):Ge.__hasExternalTextures&&S.rebindTextures(E,Se.get(E.texture).__webglTexture,Se.get(E.depthTexture).__webglTexture);const Qe=E.texture;(Qe.isData3DTexture||Qe.isDataArrayTexture||Qe.isCompressedArrayTexture)&&(ke=!0);const Xe=Se.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Xe[F])?W=Xe[F][X]:W=Xe[F],Ae=!0):Q.isWebGL2&&E.samples>0&&S.useMultisampledRTT(E)===!1?W=Se.get(E).__webglMultisampledFramebuffer:Array.isArray(Xe)?W=Xe[X]:W=Xe,T.copy(E.viewport),z.copy(E.scissor),V=E.scissorTest}else T.copy(te).multiplyScalar(K).floor(),z.copy(ce).multiplyScalar(K).floor(),V=fe;if($.bindFramebuffer(D.FRAMEBUFFER,W)&&Q.drawBuffers&&q&&$.drawBuffers(E,W),$.viewport(T),$.scissor(z),$.setScissorTest(V),Ae){const Ge=Se.get(E.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ge.__webglTexture,X)}else if(ke){const Ge=Se.get(E.texture),Qe=F||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ge.__webglTexture,X||0,Qe)}G=-1},this.readRenderTargetPixels=function(E,F,X,q,W,Ae,ke){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Be=Se.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ke!==void 0&&(Be=Be[ke]),Be){$.bindFramebuffer(D.FRAMEBUFFER,Be);try{const Ge=E.texture,Qe=Ge.format,Xe=Ge.type;if(Qe!==Ln&&Ee.convert(Qe)!==D.getParameter(D.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const qe=Xe===Eo&&(Y.has("EXT_color_buffer_half_float")||Q.isWebGL2&&Y.has("EXT_color_buffer_float"));if(Xe!==bi&&Ee.convert(Xe)!==D.getParameter(D.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Xe===xi&&(Q.isWebGL2||Y.has("OES_texture_float")||Y.has("WEBGL_color_buffer_float")))&&!qe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-q&&X>=0&&X<=E.height-W&&D.readPixels(F,X,q,W,Ee.convert(Qe),Ee.convert(Xe),Ae)}finally{const Ge=C!==null?Se.get(C).__webglFramebuffer:null;$.bindFramebuffer(D.FRAMEBUFFER,Ge)}}},this.copyFramebufferToTexture=function(E,F,X=0){const q=Math.pow(2,-X),W=Math.floor(F.image.width*q),Ae=Math.floor(F.image.height*q);S.setTexture2D(F,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,E.x,E.y,W,Ae),$.unbindTexture()},this.copyTextureToTexture=function(E,F,X,q=0){const W=F.image.width,Ae=F.image.height,ke=Ee.convert(X.format),Be=Ee.convert(X.type);S.setTexture2D(X,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,X.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,X.unpackAlignment),F.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,q,E.x,E.y,W,Ae,ke,Be,F.image.data):F.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,q,E.x,E.y,F.mipmaps[0].width,F.mipmaps[0].height,ke,F.mipmaps[0].data):D.texSubImage2D(D.TEXTURE_2D,q,E.x,E.y,ke,Be,F.image),q===0&&X.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),$.unbindTexture()},this.copyTextureToTexture3D=function(E,F,X,q,W=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Ae=E.max.x-E.min.x+1,ke=E.max.y-E.min.y+1,Be=E.max.z-E.min.z+1,Ge=Ee.convert(q.format),Qe=Ee.convert(q.type);let Xe;if(q.isData3DTexture)S.setTexture3D(q,0),Xe=D.TEXTURE_3D;else if(q.isDataArrayTexture||q.isCompressedArrayTexture)S.setTexture2DArray(q,0),Xe=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,q.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,q.unpackAlignment);const qe=D.getParameter(D.UNPACK_ROW_LENGTH),Rt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),ln=D.getParameter(D.UNPACK_SKIP_PIXELS),Ft=D.getParameter(D.UNPACK_SKIP_ROWS),qn=D.getParameter(D.UNPACK_SKIP_IMAGES),yt=X.isCompressedTexture?X.mipmaps[W]:X.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,yt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,yt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,E.min.x),D.pixelStorei(D.UNPACK_SKIP_ROWS,E.min.y),D.pixelStorei(D.UNPACK_SKIP_IMAGES,E.min.z),X.isDataTexture||X.isData3DTexture?D.texSubImage3D(Xe,W,F.x,F.y,F.z,Ae,ke,Be,Ge,Qe,yt.data):X.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),D.compressedTexSubImage3D(Xe,W,F.x,F.y,F.z,Ae,ke,Be,Ge,yt.data)):D.texSubImage3D(Xe,W,F.x,F.y,F.z,Ae,ke,Be,Ge,Qe,yt),D.pixelStorei(D.UNPACK_ROW_LENGTH,qe),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Rt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ln),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ft),D.pixelStorei(D.UNPACK_SKIP_IMAGES,qn),W===0&&q.generateMipmaps&&D.generateMipmap(Xe),$.unbindTexture()},this.initTexture=function(E){E.isCubeTexture?S.setTextureCube(E,0):E.isData3DTexture?S.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?S.setTexture2DArray(E,0):S.setTexture2D(E,0),$.unbindTexture()},this.resetState=function(){L=0,R=0,C=null,$.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===rl?"display-p3":"srgb",t.unpackColorSpace=pt.workingColorSpace===Fr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Lt?qi:Yh}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===qi?Lt:ai}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class c_ extends gd{}c_.prototype.isWebGL1Renderer=!0;class hl{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new at(e),this.near=t,this.far=n}clone(){return new hl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class h_ extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Cs extends Ys{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new at(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const $c=new A,Kc=new A,Zc=new mt,Ca=new Br,rr=new zr;class Do extends Xt{constructor(e=new Tt,t=new Cs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)$c.fromBufferAttribute(t,s-1),Kc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=$c.distanceTo(Kc);e.setAttribute("lineDistance",new lt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),rr.copy(n.boundingSphere),rr.applyMatrix4(s),rr.radius+=r,e.ray.intersectsSphere(rr)===!1)return;Zc.copy(s).invert(),Ca.copy(e.ray).applyMatrix4(Zc);const l=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=l*l,h=new A,d=new A,u=new A,f=new A,p=this.isLineSegments?2:1,_=n.index,g=n.attributes.position;if(_!==null){const m=Math.max(0,a.start),y=Math.min(_.count,a.start+a.count);for(let x=m,M=y-1;x<M;x+=p){const L=_.getX(x),R=_.getX(x+1);if(h.fromBufferAttribute(g,L),d.fromBufferAttribute(g,R),Ca.distanceSqToSegment(h,d,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const G=e.ray.origin.distanceTo(f);G<e.near||G>e.far||t.push({distance:G,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const m=Math.max(0,a.start),y=Math.min(g.count,a.start+a.count);for(let x=m,M=y-1;x<M;x+=p){if(h.fromBufferAttribute(g,x),d.fromBufferAttribute(g,x+1),Ca.distanceSqToSegment(h,d,f,u)>c)continue;f.applyMatrix4(this.matrixWorld);const R=e.ray.origin.distanceTo(f);R<e.near||R>e.far||t.push({distance:R,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const l=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}}const Jc=new A,Qc=new A;class d_ extends Do{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Jc.fromBufferAttribute(t,s),Qc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Jc.distanceTo(Qc);e.setAttribute("lineDistance",new lt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class u_ extends Do{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class _d extends an{constructor(e,t,n,s,r,a,l,c,h){super(e,t,n,s,r,a,l,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class jn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let l=0,c=r-1,h;for(;l<=c;)if(s=Math.floor(l+(c-l)/2),h=n[s]-a,h<0)l=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const d=n[s],f=n[s+1]-d,p=(a-d)/f;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),l=this.getPoint(r),c=t||(a.isVector2?new de:new A);return c.copy(l).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new A,s=[],r=[],a=[],l=new A,c=new mt;for(let p=0;p<=e;p++){const _=p/e;s[p]=this.getTangentAt(_,new A)}r[0]=new A,a[0]=new A;let h=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);d<=h&&(h=d,n.set(1,0,0)),u<=h&&(h=u,n.set(0,1,0)),f<=h&&n.set(0,0,1),l.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],l),a[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),l.crossVectors(s[p-1],s[p]),l.length()>Number.EPSILON){l.normalize();const _=Math.acos(kt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(l,_))}a[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(kt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(l.crossVectors(r[0],r[e]))>0&&(p=-p);for(let _=1;_<=e;_++)r[_].applyMatrix4(c.makeRotationAxis(s[_],p*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class dl extends jn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,l=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=l,this.aRotation=c}getPoint(e,t){const n=t||new de,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const l=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(l),h=this.aY+this.yRadius*Math.sin(l);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=h-this.aY;c=f*d-p*u+this.aX,h=f*u+p*d+this.aY}return n.set(c,h)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class f_ extends dl{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ul(){let i=0,e=0,t=0,n=0;function s(r,a,l,c){i=r,e=l,t=-3*r+3*a-2*l-c,n=2*r-2*a+l+c}return{initCatmullRom:function(r,a,l,c,h){s(a,l,h*(l-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,l,c,h,d,u){let f=(a-r)/h-(l-r)/(h+d)+(l-a)/d,p=(l-a)/d-(c-a)/(d+u)+(c-l)/u;f*=d,p*=d,s(a,l,f,p)},calc:function(r){const a=r*r,l=a*r;return i+e*r+t*a+n*l}}}const ar=new A,Pa=new ul,La=new ul,Da=new ul;class p_ extends jn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new A){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let l=Math.floor(a),c=a-l;this.closed?l+=l>0?0:(Math.floor(Math.abs(l)/r)+1)*r:c===0&&l===r-1&&(l=r-2,c=1);let h,d;this.closed||l>0?h=s[(l-1)%r]:(ar.subVectors(s[0],s[1]).add(s[0]),h=ar);const u=s[l%r],f=s[(l+1)%r];if(this.closed||l+2<r?d=s[(l+2)%r]:(ar.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=ar),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let _=Math.pow(h.distanceToSquared(u),p),v=Math.pow(u.distanceToSquared(f),p),g=Math.pow(f.distanceToSquared(d),p);v<1e-4&&(v=1),_<1e-4&&(_=v),g<1e-4&&(g=v),Pa.initNonuniformCatmullRom(h.x,u.x,f.x,d.x,_,v,g),La.initNonuniformCatmullRom(h.y,u.y,f.y,d.y,_,v,g),Da.initNonuniformCatmullRom(h.z,u.z,f.z,d.z,_,v,g)}else this.curveType==="catmullrom"&&(Pa.initCatmullRom(h.x,u.x,f.x,d.x,this.tension),La.initCatmullRom(h.y,u.y,f.y,d.y,this.tension),Da.initCatmullRom(h.z,u.z,f.z,d.z,this.tension));return n.set(Pa.calc(c),La.calc(c),Da.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new A().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function eh(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,l=i*i,c=i*l;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*l+r*i+t}function m_(i,e){const t=1-i;return t*t*e}function g_(i,e){return 2*(1-i)*i*e}function __(i,e){return i*i*e}function vo(i,e,t,n){return m_(i,e)+g_(i,t)+__(i,n)}function v_(i,e){const t=1-i;return t*t*t*e}function x_(i,e){const t=1-i;return 3*t*t*i*e}function y_(i,e){return 3*(1-i)*i*i*e}function w_(i,e){return i*i*i*e}function xo(i,e,t,n,s){return v_(i,e)+x_(i,t)+y_(i,n)+w_(i,s)}class vd extends jn{constructor(e=new de,t=new de,n=new de,s=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new de){const n=t,s=this.v0,r=this.v1,a=this.v2,l=this.v3;return n.set(xo(e,s.x,r.x,a.x,l.x),xo(e,s.y,r.y,a.y,l.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class M_ extends jn{constructor(e=new A,t=new A,n=new A,s=new A){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new A){const n=t,s=this.v0,r=this.v1,a=this.v2,l=this.v3;return n.set(xo(e,s.x,r.x,a.x,l.x),xo(e,s.y,r.y,a.y,l.y),xo(e,s.z,r.z,a.z,l.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class xd extends jn{constructor(e=new de,t=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new de){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new de){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class b_ extends jn{constructor(e=new A,t=new A){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new A){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new A){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class yd extends jn{constructor(e=new de,t=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new de){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(vo(e,s.x,r.x,a.x),vo(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class S_ extends jn{constructor(e=new A,t=new A,n=new A){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new A){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(vo(e,s.x,r.x,a.x),vo(e,s.y,r.y,a.y),vo(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class wd extends jn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new de){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),l=r-a,c=s[a===0?a:a-1],h=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(eh(l,c.x,h.x,d.x,u.x),eh(l,c.y,h.y,d.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new de().fromArray(s))}return this}}var Ka=Object.freeze({__proto__:null,ArcCurve:f_,CatmullRomCurve3:p_,CubicBezierCurve:vd,CubicBezierCurve3:M_,EllipseCurve:dl,LineCurve:xd,LineCurve3:b_,QuadraticBezierCurve:yd,QuadraticBezierCurve3:S_,SplineCurve:wd});class E_ extends jn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ka[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,l=this.curves[r],c=l.getLength(),h=c===0?0:1-a/c;return l.getPointAt(h,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],l=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(l);for(let h=0;h<c.length;h++){const d=c[h];n&&n.equals(d)||(t.push(d),n=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Ka[s.type]().fromJSON(s))}return this}}class Za extends E_{constructor(e){super(),this.type="Path",this.currentPoint=new de,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new xd(this.currentPoint.clone(),new de(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new yd(this.currentPoint.clone(),new de(e,t),new de(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const l=new vd(this.currentPoint.clone(),new de(e,t),new de(n,s),new de(r,a));return this.curves.push(l),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new wd(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const l=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+l,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,l,c){const h=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+h,t+d,n,s,r,a,l,c),this}absellipse(e,t,n,s,r,a,l,c){const h=new dl(e,t,n,s,r,a,l,c);if(this.curves.length>0){const u=h.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(h);const d=h.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class fl extends Tt{constructor(e=[new de(0,-.5),new de(.5,0),new de(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=kt(s,0,Math.PI*2);const r=[],a=[],l=[],c=[],h=[],d=1/t,u=new A,f=new de,p=new A,_=new A,v=new A;let g=0,m=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:g=e[y+1].x-e[y].x,m=e[y+1].y-e[y].y,p.x=m*1,p.y=-g,p.z=m*0,v.copy(p),p.normalize(),c.push(p.x,p.y,p.z);break;case e.length-1:c.push(v.x,v.y,v.z);break;default:g=e[y+1].x-e[y].x,m=e[y+1].y-e[y].y,p.x=m*1,p.y=-g,p.z=m*0,_.copy(p),p.x+=v.x,p.y+=v.y,p.z+=v.z,p.normalize(),c.push(p.x,p.y,p.z),v.copy(_)}for(let y=0;y<=t;y++){const x=n+y*d*s,M=Math.sin(x),L=Math.cos(x);for(let R=0;R<=e.length-1;R++){u.x=e[R].x*M,u.y=e[R].y,u.z=e[R].x*L,a.push(u.x,u.y,u.z),f.x=y/t,f.y=R/(e.length-1),l.push(f.x,f.y);const C=c[3*R+0]*M,G=c[3*R+1],b=c[3*R+0]*L;h.push(C,G,b)}}for(let y=0;y<t;y++)for(let x=0;x<e.length-1;x++){const M=x+y*e.length,L=M,R=M+e.length,C=M+e.length+1,G=M+1;r.push(L,R,G),r.push(C,G,R)}this.setIndex(r),this.setAttribute("position",new lt(a,3)),this.setAttribute("uv",new lt(l,2)),this.setAttribute("normal",new lt(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fl(e.points,e.segments,e.phiStart,e.phiLength)}}class pl extends Tt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],l=[],c=[],h=new A,d=new de;a.push(0,0,0),l.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const p=n+u/t*s;h.x=e*Math.cos(p),h.y=e*Math.sin(p),a.push(h.x,h.y,h.z),l.push(0,0,1),d.x=(a[f]/e+1)/2,d.y=(a[f+1]/e+1)/2,c.push(d.x,d.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new lt(a,3)),this.setAttribute("normal",new lt(l,3)),this.setAttribute("uv",new lt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pl(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Wt extends Tt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,l=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:l,thetaLength:c};const h=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],f=[],p=[];let _=0;const v=[],g=n/2;let m=0;y(),a===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new lt(u,3)),this.setAttribute("normal",new lt(f,3)),this.setAttribute("uv",new lt(p,2));function y(){const M=new A,L=new A;let R=0;const C=(t-e)/n;for(let G=0;G<=r;G++){const b=[],T=G/r,z=T*(t-e)+e;for(let V=0;V<=s;V++){const ie=V/s,I=ie*c+l,B=Math.sin(I),H=Math.cos(I);L.x=z*B,L.y=-T*n+g,L.z=z*H,u.push(L.x,L.y,L.z),M.set(B,C,H).normalize(),f.push(M.x,M.y,M.z),p.push(ie,1-T),b.push(_++)}v.push(b)}for(let G=0;G<s;G++)for(let b=0;b<r;b++){const T=v[b][G],z=v[b+1][G],V=v[b+1][G+1],ie=v[b][G+1];d.push(T,z,ie),d.push(z,V,ie),R+=6}h.addGroup(m,R,0),m+=R}function x(M){const L=_,R=new de,C=new A;let G=0;const b=M===!0?e:t,T=M===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,g*T,0),f.push(0,T,0),p.push(.5,.5),_++;const z=_;for(let V=0;V<=s;V++){const I=V/s*c+l,B=Math.cos(I),H=Math.sin(I);C.x=b*H,C.y=g*T,C.z=b*B,u.push(C.x,C.y,C.z),f.push(0,T,0),R.x=B*.5+.5,R.y=H*.5*T+.5,p.push(R.x,R.y),_++}for(let V=0;V<s;V++){const ie=L+V,I=z+V;M===!0?d.push(I,I+1,ie):d.push(I+1,I,ie),G+=3}h.addGroup(m,G,M===!0?1:2),m+=G}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ji extends Za{constructor(e){super(e),this.uuid=ns(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Za().fromJSON(s))}return this}}const T_={triangulate:function(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Md(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let l,c,h,d,u,f,p;if(n&&(r=L_(i,e,r,t)),i.length>80*t){l=h=i[0],c=d=i[1];for(let _=t;_<s;_+=t)u=i[_],f=i[_+1],u<l&&(l=u),f<c&&(c=f),u>h&&(h=u),f>d&&(d=f);p=Math.max(h-l,d-c),p=p!==0?32767/p:0}return Ro(r,a,t,l,c,p,0),a}};function Md(i,e,t,n,s){let r,a;if(s===G_(i,e,t,n)>0)for(r=e;r<t;r+=n)a=th(r,i[r],i[r+1],a);else for(r=t-n;r>=e;r-=n)a=th(r,i[r],i[r+1],a);return a&&Vr(a,a.next)&&(Po(a),a=a.next),a}function Qi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Vr(t,t.next)||Mt(t.prev,t,t.next)===0)){if(Po(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ro(i,e,t,n,s,r,a){if(!i)return;!a&&r&&N_(i,n,s,r);let l=i,c,h;for(;i.prev!==i.next;){if(c=i.prev,h=i.next,r?R_(i,n,s,r):A_(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(h.i/t|0),Po(i),i=h.next,l=h.next;continue}if(i=h,i===l){a?a===1?(i=C_(Qi(i),e,t),Ro(i,e,t,n,s,r,2)):a===2&&P_(i,e,t,n,s,r):Ro(Qi(i),e,t,n,s,r,1);break}}}function A_(i){const e=i.prev,t=i,n=i.next;if(Mt(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,l=e.y,c=t.y,h=n.y,d=s<r?s<a?s:a:r<a?r:a,u=l<c?l<h?l:h:c<h?c:h,f=s>r?s>a?s:a:r>a?r:a,p=l>c?l>h?l:h:c>h?c:h;let _=n.next;for(;_!==e;){if(_.x>=d&&_.x<=f&&_.y>=u&&_.y<=p&&Is(s,l,r,c,a,h,_.x,_.y)&&Mt(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function R_(i,e,t,n){const s=i.prev,r=i,a=i.next;if(Mt(s,r,a)>=0)return!1;const l=s.x,c=r.x,h=a.x,d=s.y,u=r.y,f=a.y,p=l<c?l<h?l:h:c<h?c:h,_=d<u?d<f?d:f:u<f?u:f,v=l>c?l>h?l:h:c>h?c:h,g=d>u?d>f?d:f:u>f?u:f,m=Ja(p,_,e,t,n),y=Ja(v,g,e,t,n);let x=i.prevZ,M=i.nextZ;for(;x&&x.z>=m&&M&&M.z<=y;){if(x.x>=p&&x.x<=v&&x.y>=_&&x.y<=g&&x!==s&&x!==a&&Is(l,d,c,u,h,f,x.x,x.y)&&Mt(x.prev,x,x.next)>=0||(x=x.prevZ,M.x>=p&&M.x<=v&&M.y>=_&&M.y<=g&&M!==s&&M!==a&&Is(l,d,c,u,h,f,M.x,M.y)&&Mt(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;x&&x.z>=m;){if(x.x>=p&&x.x<=v&&x.y>=_&&x.y<=g&&x!==s&&x!==a&&Is(l,d,c,u,h,f,x.x,x.y)&&Mt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;M&&M.z<=y;){if(M.x>=p&&M.x<=v&&M.y>=_&&M.y<=g&&M!==s&&M!==a&&Is(l,d,c,u,h,f,M.x,M.y)&&Mt(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function C_(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!Vr(s,r)&&bd(s,n,n.next,r)&&Co(s,r)&&Co(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Po(n),Po(n.next),n=i=r),n=n.next}while(n!==i);return Qi(n)}function P_(i,e,t,n,s,r){let a=i;do{let l=a.next.next;for(;l!==a.prev;){if(a.i!==l.i&&z_(a,l)){let c=Sd(a,l);a=Qi(a,a.next),c=Qi(c,c.next),Ro(a,e,t,n,s,r,0),Ro(c,e,t,n,s,r,0);return}l=l.next}a=a.next}while(a!==i)}function L_(i,e,t,n){const s=[];let r,a,l,c,h;for(r=0,a=e.length;r<a;r++)l=e[r]*n,c=r<a-1?e[r+1]*n:i.length,h=Md(i,l,c,n,!1),h===h.next&&(h.steiner=!0),s.push(F_(h));for(s.sort(D_),r=0;r<s.length;r++)t=I_(s[r],t);return t}function D_(i,e){return i.x-e.x}function I_(i,e){const t=k_(i,e);if(!t)return e;const n=Sd(t,i);return Qi(n,n.next),Qi(t,t.next)}function k_(i,e){let t=e,n=-1/0,s;const r=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const f=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=r&&f>n&&(n=f,s=t.x<t.next.x?t:t.next,f===r))return s}t=t.next}while(t!==e);if(!s)return null;const l=s,c=s.x,h=s.y;let d=1/0,u;t=s;do r>=t.x&&t.x>=c&&r!==t.x&&Is(a<h?r:n,a,c,h,a<h?n:r,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(r-t.x),Co(t,i)&&(u<d||u===d&&(t.x>s.x||t.x===s.x&&U_(s,t)))&&(s=t,d=u)),t=t.next;while(t!==l);return s}function U_(i,e){return Mt(i.prev,i,e.prev)<0&&Mt(e.next,i,i.next)<0}function N_(i,e,t,n){let s=i;do s.z===0&&(s.z=Ja(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,O_(s)}function O_(i){let e,t,n,s,r,a,l,c,h=1;do{for(t=i,i=null,r=null,a=0;t;){for(a++,n=t,l=0,e=0;e<h&&(l++,n=n.nextZ,!!n);e++);for(c=h;l>0||c>0&&n;)l!==0&&(c===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,l--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,h*=2}while(a>1);return i}function Ja(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function F_(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Is(i,e,t,n,s,r,a,l){return(s-a)*(e-l)>=(i-a)*(r-l)&&(i-a)*(n-l)>=(t-a)*(e-l)&&(t-a)*(r-l)>=(s-a)*(n-l)}function z_(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!B_(i,e)&&(Co(i,e)&&Co(e,i)&&H_(i,e)&&(Mt(i.prev,i,e.prev)||Mt(i,e.prev,e))||Vr(i,e)&&Mt(i.prev,i,i.next)>0&&Mt(e.prev,e,e.next)>0)}function Mt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Vr(i,e){return i.x===e.x&&i.y===e.y}function bd(i,e,t,n){const s=cr(Mt(i,e,t)),r=cr(Mt(i,e,n)),a=cr(Mt(t,n,i)),l=cr(Mt(t,n,e));return!!(s!==r&&a!==l||s===0&&lr(i,t,e)||r===0&&lr(i,n,e)||a===0&&lr(t,i,n)||l===0&&lr(t,e,n))}function lr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function cr(i){return i>0?1:i<0?-1:0}function B_(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&bd(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Co(i,e){return Mt(i.prev,i,i.next)<0?Mt(i,e,i.next)>=0&&Mt(i,i.prev,e)>=0:Mt(i,e,i.prev)<0||Mt(i,i.next,e)<0}function H_(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Sd(i,e){const t=new Qa(i.i,i.x,i.y),n=new Qa(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function th(i,e,t,n){const s=new Qa(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Po(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Qa(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function G_(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Si{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return Si.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];nh(e),ih(n,e);let a=e.length;t.forEach(nh);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,ih(n,t[c]);const l=T_.triangulate(n,s);for(let c=0;c<l.length;c+=3)r.push(l.slice(c,c+3));return r}}function nh(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function ih(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Io extends Tt{constructor(e=new Ji([new de(.5,.5),new de(-.5,.5),new de(-.5,-.5),new de(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,s=[],r=[];for(let l=0,c=e.length;l<c;l++){const h=e[l];a(h)}this.setAttribute("position",new lt(s,3)),this.setAttribute("uv",new lt(r,2)),this.computeVertexNormals();function a(l){const c=[],h=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:p-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:V_;let x,M=!1,L,R,C,G;m&&(x=m.getSpacedPoints(d),M=!0,f=!1,L=m.computeFrenetFrames(d,!1),R=new A,C=new A,G=new A),f||(g=0,p=0,_=0,v=0);const b=l.extractPoints(h);let T=b.shape;const z=b.holes;if(!Si.isClockWise(T)){T=T.reverse();for(let D=0,ne=z.length;D<ne;D++){const Y=z[D];Si.isClockWise(Y)&&(z[D]=Y.reverse())}}const ie=Si.triangulateShape(T,z),I=T;for(let D=0,ne=z.length;D<ne;D++){const Y=z[D];T=T.concat(Y)}function B(D,ne,Y){return ne||console.error("THREE.ExtrudeGeometry: vec does not exist"),D.clone().addScaledVector(ne,Y)}const H=T.length,K=ie.length;function Z(D,ne,Y){let Q,$,Pe;const Se=D.x-ne.x,S=D.y-ne.y,w=Y.x-D.x,O=Y.y-D.y,le=Se*Se+S*S,re=Se*O-S*w;if(Math.abs(re)>Number.EPSILON){const se=Math.sqrt(le),Le=Math.sqrt(w*w+O*O),xe=ne.x-S/se,Te=ne.y+Se/se,Ne=Y.x-O/Le,Ve=Y.y+w/Le,ae=((Ne-xe)*O-(Ve-Te)*w)/(Se*O-S*w);Q=xe+Se*ae-D.x,$=Te+S*ae-D.y;const st=Q*Q+$*$;if(st<=2)return new de(Q,$);Pe=Math.sqrt(st/2)}else{let se=!1;Se>Number.EPSILON?w>Number.EPSILON&&(se=!0):Se<-Number.EPSILON?w<-Number.EPSILON&&(se=!0):Math.sign(S)===Math.sign(O)&&(se=!0),se?(Q=-S,$=Se,Pe=Math.sqrt(le)):(Q=Se,$=S,Pe=Math.sqrt(le/2))}return new de(Q/Pe,$/Pe)}const J=[];for(let D=0,ne=I.length,Y=ne-1,Q=D+1;D<ne;D++,Y++,Q++)Y===ne&&(Y=0),Q===ne&&(Q=0),J[D]=Z(I[D],I[Y],I[Q]);const te=[];let ce,fe=J.concat();for(let D=0,ne=z.length;D<ne;D++){const Y=z[D];ce=[];for(let Q=0,$=Y.length,Pe=$-1,Se=Q+1;Q<$;Q++,Pe++,Se++)Pe===$&&(Pe=0),Se===$&&(Se=0),ce[Q]=Z(Y[Q],Y[Pe],Y[Se]);te.push(ce),fe=fe.concat(ce)}for(let D=0;D<g;D++){const ne=D/g,Y=p*Math.cos(ne*Math.PI/2),Q=_*Math.sin(ne*Math.PI/2)+v;for(let $=0,Pe=I.length;$<Pe;$++){const Se=B(I[$],J[$],Q);me(Se.x,Se.y,-Y)}for(let $=0,Pe=z.length;$<Pe;$++){const Se=z[$];ce=te[$];for(let S=0,w=Se.length;S<w;S++){const O=B(Se[S],ce[S],Q);me(O.x,O.y,-Y)}}}const j=_+v;for(let D=0;D<H;D++){const ne=f?B(T[D],fe[D],j):T[D];M?(C.copy(L.normals[0]).multiplyScalar(ne.x),R.copy(L.binormals[0]).multiplyScalar(ne.y),G.copy(x[0]).add(C).add(R),me(G.x,G.y,G.z)):me(ne.x,ne.y,0)}for(let D=1;D<=d;D++)for(let ne=0;ne<H;ne++){const Y=f?B(T[ne],fe[ne],j):T[ne];M?(C.copy(L.normals[D]).multiplyScalar(Y.x),R.copy(L.binormals[D]).multiplyScalar(Y.y),G.copy(x[D]).add(C).add(R),me(G.x,G.y,G.z)):me(Y.x,Y.y,u/d*D)}for(let D=g-1;D>=0;D--){const ne=D/g,Y=p*Math.cos(ne*Math.PI/2),Q=_*Math.sin(ne*Math.PI/2)+v;for(let $=0,Pe=I.length;$<Pe;$++){const Se=B(I[$],J[$],Q);me(Se.x,Se.y,u+Y)}for(let $=0,Pe=z.length;$<Pe;$++){const Se=z[$];ce=te[$];for(let S=0,w=Se.length;S<w;S++){const O=B(Se[S],ce[S],Q);M?me(O.x,O.y+x[d-1].y,x[d-1].x+Y):me(O.x,O.y,u+Y)}}}oe(),ee();function oe(){const D=s.length/3;if(f){let ne=0,Y=H*ne;for(let Q=0;Q<K;Q++){const $=ie[Q];be($[2]+Y,$[1]+Y,$[0]+Y)}ne=d+g*2,Y=H*ne;for(let Q=0;Q<K;Q++){const $=ie[Q];be($[0]+Y,$[1]+Y,$[2]+Y)}}else{for(let ne=0;ne<K;ne++){const Y=ie[ne];be(Y[2],Y[1],Y[0])}for(let ne=0;ne<K;ne++){const Y=ie[ne];be(Y[0]+H*d,Y[1]+H*d,Y[2]+H*d)}}n.addGroup(D,s.length/3-D,0)}function ee(){const D=s.length/3;let ne=0;ue(I,ne),ne+=I.length;for(let Y=0,Q=z.length;Y<Q;Y++){const $=z[Y];ue($,ne),ne+=$.length}n.addGroup(D,s.length/3-D,1)}function ue(D,ne){let Y=D.length;for(;--Y>=0;){const Q=Y;let $=Y-1;$<0&&($=D.length-1);for(let Pe=0,Se=d+g*2;Pe<Se;Pe++){const S=H*Pe,w=H*(Pe+1),O=ne+Q+S,le=ne+$+S,re=ne+$+w,se=ne+Q+w;Re(O,le,re,se)}}}function me(D,ne,Y){c.push(D),c.push(ne),c.push(Y)}function be(D,ne,Y){ye(D),ye(ne),ye(Y);const Q=s.length/3,$=y.generateTopUV(n,s,Q-3,Q-2,Q-1);De($[0]),De($[1]),De($[2])}function Re(D,ne,Y,Q){ye(D),ye(ne),ye(Q),ye(ne),ye(Y),ye(Q);const $=s.length/3,Pe=y.generateSideWallUV(n,s,$-6,$-3,$-2,$-1);De(Pe[0]),De(Pe[1]),De(Pe[3]),De(Pe[1]),De(Pe[2]),De(Pe[3])}function ye(D){s.push(c[D*3+0]),s.push(c[D*3+1]),s.push(c[D*3+2])}function De(D){r.push(D.x),r.push(D.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return W_(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const l=t[e.shapes[r]];n.push(l)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ka[s.type]().fromJSON(s)),new Io(n,e.options)}}const V_={generateTopUV:function(i,e,t,n,s){const r=e[t*3],a=e[t*3+1],l=e[n*3],c=e[n*3+1],h=e[s*3],d=e[s*3+1];return[new de(r,a),new de(l,c),new de(h,d)]},generateSideWallUV:function(i,e,t,n,s,r){const a=e[t*3],l=e[t*3+1],c=e[t*3+2],h=e[n*3],d=e[n*3+1],u=e[n*3+2],f=e[s*3],p=e[s*3+1],_=e[s*3+2],v=e[r*3],g=e[r*3+1],m=e[r*3+2];return Math.abs(l-d)<Math.abs(a-h)?[new de(a,1-c),new de(h,1-u),new de(f,1-_),new de(v,1-m)]:[new de(l,1-c),new de(d,1-u),new de(p,1-_),new de(g,1-m)]}};function W_(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class ml extends Tt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const l=[],c=[],h=[],d=[];let u=e;const f=(t-e)/s,p=new A,_=new de;for(let v=0;v<=s;v++){for(let g=0;g<=n;g++){const m=r+g/n*a;p.x=u*Math.cos(m),p.y=u*Math.sin(m),c.push(p.x,p.y,p.z),h.push(0,0,1),_.x=(p.x/t+1)/2,_.y=(p.y/t+1)/2,d.push(_.x,_.y)}u+=f}for(let v=0;v<s;v++){const g=v*(n+1);for(let m=0;m<n;m++){const y=m+g,x=y,M=y+n+1,L=y+n+2,R=y+1;l.push(x,M,R),l.push(M,L,R)}}this.setIndex(l),this.setAttribute("position",new lt(c,3)),this.setAttribute("normal",new lt(h,3)),this.setAttribute("uv",new lt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ml(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Lr extends Tt{constructor(e=new Ji([new de(0,.5),new de(-.5,-.5),new de(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let l=0,c=0;if(Array.isArray(e)===!1)h(e);else for(let d=0;d<e.length;d++)h(e[d]),this.addGroup(l,c,d),l+=c,c=0;this.setIndex(n),this.setAttribute("position",new lt(s,3)),this.setAttribute("normal",new lt(r,3)),this.setAttribute("uv",new lt(a,2));function h(d){const u=s.length/3,f=d.extractPoints(t);let p=f.shape;const _=f.holes;Si.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,m=_.length;g<m;g++){const y=_[g];Si.isClockWise(y)===!0&&(_[g]=y.reverse())}const v=Si.triangulateShape(p,_);for(let g=0,m=_.length;g<m;g++){const y=_[g];p=p.concat(y)}for(let g=0,m=p.length;g<m;g++){const y=p[g];s.push(y.x,y.y,0),r.push(0,0,1),a.push(y.x,y.y)}for(let g=0,m=v.length;g<m;g++){const y=v[g],x=y[0]+u,M=y[1]+u,L=y[2]+u;n.push(x,M,L),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return X_(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new Lr(n,e.curveSegments)}}function X_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class Wr extends Tt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,l=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:l},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+l,Math.PI);let h=0;const d=[],u=new A,f=new A,p=[],_=[],v=[],g=[];for(let m=0;m<=n;m++){const y=[],x=m/n;let M=0;m===0&&a===0?M=.5/t:m===n&&c===Math.PI&&(M=-.5/t);for(let L=0;L<=t;L++){const R=L/t;u.x=-e*Math.cos(s+R*r)*Math.sin(a+x*l),u.y=e*Math.cos(a+x*l),u.z=e*Math.sin(s+R*r)*Math.sin(a+x*l),_.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),g.push(R+M,1-x),y.push(h++)}d.push(y)}for(let m=0;m<n;m++)for(let y=0;y<t;y++){const x=d[m][y+1],M=d[m][y],L=d[m+1][y],R=d[m+1][y+1];(m!==0||a>0)&&p.push(x,M,R),(m!==n-1||c<Math.PI)&&p.push(M,L,R)}this.setIndex(p),this.setAttribute("position",new lt(_,3)),this.setAttribute("normal",new lt(v,3)),this.setAttribute("uv",new lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gl extends Tt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],l=[],c=[],h=[],d=new A,u=new A,f=new A;for(let p=0;p<=n;p++)for(let _=0;_<=s;_++){const v=_/s*r,g=p/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(v),u.y=(e+t*Math.cos(g))*Math.sin(v),u.z=t*Math.sin(g),l.push(u.x,u.y,u.z),d.x=e*Math.cos(v),d.y=e*Math.sin(v),f.subVectors(u,d).normalize(),c.push(f.x,f.y,f.z),h.push(_/s),h.push(p/n)}for(let p=1;p<=n;p++)for(let _=1;_<=s;_++){const v=(s+1)*p+_-1,g=(s+1)*(p-1)+_-1,m=(s+1)*(p-1)+_,y=(s+1)*p+_;a.push(v,g,y),a.push(g,m,y)}this.setIndex(a),this.setAttribute("position",new lt(l,3)),this.setAttribute("normal",new lt(c,3)),this.setAttribute("uv",new lt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gl(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Dr extends Ys{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new at(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$h,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class _l extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new at(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class j_ extends _l{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new at(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ia=new mt,sh=new A,oh=new A;class Ed{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ll,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;sh.setFromMatrixPosition(e.matrixWorld),t.position.copy(sh),oh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(oh),t.updateMatrixWorld(),Ia.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ia),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ia)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const rh=new mt,oo=new A,ka=new A;class q_ extends Ed{constructor(){super(new pn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new de(4,2),this._viewportCount=6,this._viewports=[new xt(2,1,1,1),new xt(0,1,1,1),new xt(3,1,1,1),new xt(1,1,1,1),new xt(3,0,1,1),new xt(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),oo.setFromMatrixPosition(e.matrixWorld),n.position.copy(oo),ka.copy(n.position),ka.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ka),n.updateMatrixWorld(),s.makeTranslation(-oo.x,-oo.y,-oo.z),rh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rh)}}class ci extends _l{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new q_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Y_ extends Ed{constructor(){super(new cd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ua extends _l{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new Y_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ah{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(kt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sl);const lh={type:"change"},Na={type:"start"},ch={type:"end"},hr=new Br,hh=new mi,$_=Math.cos(70*vr.DEG2RAD);class K_ extends ts{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:os.ROTATE,MIDDLE:os.DOLLY,RIGHT:os.PAN},this.touches={ONE:rs.ROTATE,TWO:rs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return l.phi},this.getAzimuthalAngle=function(){return l.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(P){P.addEventListener("keydown",Ne),this._domElementKeyEvents=P},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Ne),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(lh),n.update(),r=s.NONE},this.update=function(){const P=new A,pe=new vn().setFromUnitVectors(e.up,new A(0,1,0)),Ie=pe.clone().invert(),Ce=new A,he=new vn,U=new A,ge=2*Math.PI;return function(ze=null){const Oe=n.object.position;P.copy(Oe).sub(n.target),P.applyQuaternion(pe),l.setFromVector3(P),n.autoRotate&&r===s.NONE&&V(T(ze)),n.enableDamping?(l.theta+=c.theta*n.dampingFactor,l.phi+=c.phi*n.dampingFactor):(l.theta+=c.theta,l.phi+=c.phi);let nt=n.minAzimuthAngle,it=n.maxAzimuthAngle;isFinite(nt)&&isFinite(it)&&(nt<-Math.PI?nt+=ge:nt>Math.PI&&(nt-=ge),it<-Math.PI?it+=ge:it>Math.PI&&(it-=ge),nt<=it?l.theta=Math.max(nt,Math.min(it,l.theta)):l.theta=l.theta>(nt+it)/2?Math.max(nt,l.theta):Math.min(it,l.theta)),l.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,l.phi)),l.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(d,n.dampingFactor):n.target.add(d),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&R||n.object.isOrthographicCamera?l.radius=te(l.radius):l.radius=te(l.radius*h),P.setFromSpherical(l),P.applyQuaternion(Ie),Oe.copy(n.target).add(P),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,d.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),d.set(0,0,0));let bt=!1;if(n.zoomToCursor&&R){let At=null;if(n.object.isPerspectiveCamera){const ct=P.length();At=te(ct*h);const Ct=ct-At;n.object.position.addScaledVector(M,Ct),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const ct=new A(L.x,L.y,0);ct.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),bt=!0;const Ct=new A(L.x,L.y,0);Ct.unproject(n.object),n.object.position.sub(Ct).add(ct),n.object.updateMatrixWorld(),At=P.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;At!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(At).add(n.object.position):(hr.origin.copy(n.object.position),hr.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(hr.direction))<$_?e.lookAt(n.target):(hh.setFromNormalAndCoplanarPoint(n.object.up,n.target),hr.intersectPlane(hh,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),bt=!0);return h=1,R=!1,bt||Ce.distanceToSquared(n.object.position)>a||8*(1-he.dot(n.object.quaternion))>a||U.distanceToSquared(n.target)>0?(n.dispatchEvent(lh),Ce.copy(n.object.position),he.copy(n.object.quaternion),U.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",st),n.domElement.removeEventListener("pointerdown",S),n.domElement.removeEventListener("pointercancel",O),n.domElement.removeEventListener("wheel",se),n.domElement.removeEventListener("pointermove",w),n.domElement.removeEventListener("pointerup",O),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Ne),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,l=new ah,c=new ah;let h=1;const d=new A,u=new de,f=new de,p=new de,_=new de,v=new de,g=new de,m=new de,y=new de,x=new de,M=new A,L=new de;let R=!1;const C=[],G={};let b=!1;function T(P){return P!==null?2*Math.PI/60*n.autoRotateSpeed*P:2*Math.PI/60/60*n.autoRotateSpeed}function z(P){const pe=Math.abs(P*.01);return Math.pow(.95,n.zoomSpeed*pe)}function V(P){c.theta-=P}function ie(P){c.phi-=P}const I=function(){const P=new A;return function(Ie,Ce){P.setFromMatrixColumn(Ce,0),P.multiplyScalar(-Ie),d.add(P)}}(),B=function(){const P=new A;return function(Ie,Ce){n.screenSpacePanning===!0?P.setFromMatrixColumn(Ce,1):(P.setFromMatrixColumn(Ce,0),P.crossVectors(n.object.up,P)),P.multiplyScalar(Ie),d.add(P)}}(),H=function(){const P=new A;return function(Ie,Ce){const he=n.domElement;if(n.object.isPerspectiveCamera){const U=n.object.position;P.copy(U).sub(n.target);let ge=P.length();ge*=Math.tan(n.object.fov/2*Math.PI/180),I(2*Ie*ge/he.clientHeight,n.object.matrix),B(2*Ce*ge/he.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(I(Ie*(n.object.right-n.object.left)/n.object.zoom/he.clientWidth,n.object.matrix),B(Ce*(n.object.top-n.object.bottom)/n.object.zoom/he.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function K(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Z(P){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=P:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function J(P,pe){if(!n.zoomToCursor)return;R=!0;const Ie=n.domElement.getBoundingClientRect(),Ce=P-Ie.left,he=pe-Ie.top,U=Ie.width,ge=Ie.height;L.x=Ce/U*2-1,L.y=-(he/ge)*2+1,M.set(L.x,L.y,1).unproject(n.object).sub(n.object.position).normalize()}function te(P){return Math.max(n.minDistance,Math.min(n.maxDistance,P))}function ce(P){u.set(P.clientX,P.clientY)}function fe(P){J(P.clientX,P.clientX),m.set(P.clientX,P.clientY)}function j(P){_.set(P.clientX,P.clientY)}function oe(P){f.set(P.clientX,P.clientY),p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const pe=n.domElement;V(2*Math.PI*p.x/pe.clientHeight),ie(2*Math.PI*p.y/pe.clientHeight),u.copy(f),n.update()}function ee(P){y.set(P.clientX,P.clientY),x.subVectors(y,m),x.y>0?K(z(x.y)):x.y<0&&Z(z(x.y)),m.copy(y),n.update()}function ue(P){v.set(P.clientX,P.clientY),g.subVectors(v,_).multiplyScalar(n.panSpeed),H(g.x,g.y),_.copy(v),n.update()}function me(P){J(P.clientX,P.clientY),P.deltaY<0?Z(z(P.deltaY)):P.deltaY>0&&K(z(P.deltaY)),n.update()}function be(P){let pe=!1;switch(P.code){case n.keys.UP:P.ctrlKey||P.metaKey||P.shiftKey?ie(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,n.keyPanSpeed),pe=!0;break;case n.keys.BOTTOM:P.ctrlKey||P.metaKey||P.shiftKey?ie(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(0,-n.keyPanSpeed),pe=!0;break;case n.keys.LEFT:P.ctrlKey||P.metaKey||P.shiftKey?V(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(n.keyPanSpeed,0),pe=!0;break;case n.keys.RIGHT:P.ctrlKey||P.metaKey||P.shiftKey?V(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):H(-n.keyPanSpeed,0),pe=!0;break}pe&&(P.preventDefault(),n.update())}function Re(P){if(C.length===1)u.set(P.pageX,P.pageY);else{const pe=Ee(P),Ie=.5*(P.pageX+pe.x),Ce=.5*(P.pageY+pe.y);u.set(Ie,Ce)}}function ye(P){if(C.length===1)_.set(P.pageX,P.pageY);else{const pe=Ee(P),Ie=.5*(P.pageX+pe.x),Ce=.5*(P.pageY+pe.y);_.set(Ie,Ce)}}function De(P){const pe=Ee(P),Ie=P.pageX-pe.x,Ce=P.pageY-pe.y,he=Math.sqrt(Ie*Ie+Ce*Ce);m.set(0,he)}function D(P){n.enableZoom&&De(P),n.enablePan&&ye(P)}function ne(P){n.enableZoom&&De(P),n.enableRotate&&Re(P)}function Y(P){if(C.length==1)f.set(P.pageX,P.pageY);else{const Ie=Ee(P),Ce=.5*(P.pageX+Ie.x),he=.5*(P.pageY+Ie.y);f.set(Ce,he)}p.subVectors(f,u).multiplyScalar(n.rotateSpeed);const pe=n.domElement;V(2*Math.PI*p.x/pe.clientHeight),ie(2*Math.PI*p.y/pe.clientHeight),u.copy(f)}function Q(P){if(C.length===1)v.set(P.pageX,P.pageY);else{const pe=Ee(P),Ie=.5*(P.pageX+pe.x),Ce=.5*(P.pageY+pe.y);v.set(Ie,Ce)}g.subVectors(v,_).multiplyScalar(n.panSpeed),H(g.x,g.y),_.copy(v)}function $(P){const pe=Ee(P),Ie=P.pageX-pe.x,Ce=P.pageY-pe.y,he=Math.sqrt(Ie*Ie+Ce*Ce);y.set(0,he),x.set(0,Math.pow(y.y/m.y,n.zoomSpeed)),K(x.y),m.copy(y);const U=(P.pageX+pe.x)*.5,ge=(P.pageY+pe.y)*.5;J(U,ge)}function Pe(P){n.enableZoom&&$(P),n.enablePan&&Q(P)}function Se(P){n.enableZoom&&$(P),n.enableRotate&&Y(P)}function S(P){n.enabled!==!1&&(C.length===0&&(n.domElement.setPointerCapture(P.pointerId),n.domElement.addEventListener("pointermove",w),n.domElement.addEventListener("pointerup",O)),Je(P),P.pointerType==="touch"?Ve(P):le(P))}function w(P){n.enabled!==!1&&(P.pointerType==="touch"?ae(P):re(P))}function O(P){He(P),C.length===0&&(n.domElement.releasePointerCapture(P.pointerId),n.domElement.removeEventListener("pointermove",w),n.domElement.removeEventListener("pointerup",O)),n.dispatchEvent(ch),r=s.NONE}function le(P){let pe;switch(P.button){case 0:pe=n.mouseButtons.LEFT;break;case 1:pe=n.mouseButtons.MIDDLE;break;case 2:pe=n.mouseButtons.RIGHT;break;default:pe=-1}switch(pe){case os.DOLLY:if(n.enableZoom===!1)return;fe(P),r=s.DOLLY;break;case os.ROTATE:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enablePan===!1)return;j(P),r=s.PAN}else{if(n.enableRotate===!1)return;ce(P),r=s.ROTATE}break;case os.PAN:if(P.ctrlKey||P.metaKey||P.shiftKey){if(n.enableRotate===!1)return;ce(P),r=s.ROTATE}else{if(n.enablePan===!1)return;j(P),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Na)}function re(P){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;oe(P);break;case s.DOLLY:if(n.enableZoom===!1)return;ee(P);break;case s.PAN:if(n.enablePan===!1)return;ue(P);break}}function se(P){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(P.preventDefault(),n.dispatchEvent(Na),me(Le(P)),n.dispatchEvent(ch))}function Le(P){const pe=P.deltaMode,Ie={clientX:P.clientX,clientY:P.clientY,deltaY:P.deltaY};switch(pe){case 1:Ie.deltaY*=16;break;case 2:Ie.deltaY*=100;break}return P.ctrlKey&&!b&&(Ie.deltaY*=10),Ie}function xe(P){P.key==="Control"&&(b=!0,document.addEventListener("keyup",Te,{passive:!0,capture:!0}))}function Te(P){P.key==="Control"&&(b=!1,document.removeEventListener("keyup",Te,{passive:!0,capture:!0}))}function Ne(P){n.enabled===!1||n.enablePan===!1||be(P)}function Ve(P){switch(Ue(P),C.length){case 1:switch(n.touches.ONE){case rs.ROTATE:if(n.enableRotate===!1)return;Re(P),r=s.TOUCH_ROTATE;break;case rs.PAN:if(n.enablePan===!1)return;ye(P),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case rs.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;D(P),r=s.TOUCH_DOLLY_PAN;break;case rs.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ne(P),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Na)}function ae(P){switch(Ue(P),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Y(P),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;Q(P),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Pe(P),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Se(P),n.update();break;default:r=s.NONE}}function st(P){n.enabled!==!1&&P.preventDefault()}function Je(P){C.push(P.pointerId)}function He(P){delete G[P.pointerId];for(let pe=0;pe<C.length;pe++)if(C[pe]==P.pointerId){C.splice(pe,1);return}}function Ue(P){let pe=G[P.pointerId];pe===void 0&&(pe=new de,G[P.pointerId]=pe),pe.set(P.pageX,P.pageY)}function Ee(P){const pe=P.pointerId===C[0]?C[1]:C[0];return G[pe]}n.domElement.addEventListener("contextmenu",st),n.domElement.addEventListener("pointerdown",S),n.domElement.addEventListener("pointercancel",O),n.domElement.addEventListener("wheel",se,{passive:!1}),document.addEventListener("keydown",xe,{passive:!0,capture:!0}),this.update()}}const Oa=new Map;function Zs(i=256){const e=document.createElement("canvas");return e.width=e.height=i,e}function Js(i,{repeat:e=[1,1],srgb:t=!1}={}){const n=new _d(i);return n.wrapS=n.wrapT=Sr,n.repeat.set(e[0],e[1]),n.anisotropy=8,t&&(n.colorSpace=Lt),n}function Td(i,e,{octaves:t=4,base:n=128,amp:s=40,seed:r=1}={}){const a=i.createImageData(e,e),l=a.data;let c=r;const h=()=>(c=c*1664525+1013904223>>>0)/4294967296,d=[];for(let f=0;f<t;f++){const p=2<<f,_=new Float32Array(p*p);for(let v=0;v<_.length;v++)_[v]=h();d.push({n:p,grid:_})}const u=({n:f,grid:p},_,v)=>{const g=_*f,m=v*f,y=Math.floor(g),x=Math.floor(m),M=g-y,L=m-x,R=M*M*(3-2*M),C=L*L*(3-2*L),G=(z,V)=>p[(V%f+f)%f*f+(z%f+f)%f],b=G(y,x)*(1-R)+G(y+1,x)*R,T=G(y,x+1)*(1-R)+G(y+1,x+1)*R;return b*(1-C)+T*C};for(let f=0;f<e;f++)for(let p=0;p<e;p++){const _=p/e,v=f/e;let g=0,m=0;for(let M=0;M<t;M++){const L=1/(M+1);g+=u(d[M],_,v)*L,m+=L}const y=n+(g/m-.5)*2*s,x=(f*e+p)*4;l[x]=l[x+1]=l[x+2]=Math.max(0,Math.min(255,y)),l[x+3]=255}i.putImageData(a,0,0)}function Qs(i,e){return Oa.has(i)||Oa.set(i,e()),Oa.get(i)}function Z_(){return Qs("asphalt",()=>{const e=Zs(512),t=e.getContext("2d");Td(t,512,{octaves:6,base:74,amp:26,seed:7});for(let n=0;n<2600;n++){const s=Math.random()*512,r=Math.random()*512,a=.5+Math.random()*1.8;t.fillStyle=`rgba(${140+Math.random()*70},${138+Math.random()*66},${132+Math.random()*60},${.14+Math.random()*.3})`,t.beginPath(),t.arc(s,r,a,0,Math.PI*2),t.fill()}return{map:Js(e,{repeat:[26,26],srgb:!0})}})}function dh(){return Qs("ply",()=>{const e=Zs(256),t=e.getContext("2d");t.fillStyle="#c8a271",t.fillRect(0,0,256,256);for(let n=0;n<220;n++){const s=Math.random()*256,r=Math.random()<.35;t.strokeStyle=r?`rgba(120,86,52,${.06+Math.random()*.13})`:`rgba(233,205,166,${.05+Math.random()*.12})`,t.lineWidth=.6+Math.random()*2.6,t.beginPath(),t.moveTo(0,s);for(let a=0;a<=256;a+=16)t.lineTo(a,s+Math.sin(a/256*Math.PI*(1+Math.random()*2))*2.2);t.stroke()}return Js(e,{repeat:[1,1],srgb:!0})})}function uh(){return Qs("weave",()=>{const e=Zs(128),t=e.getContext("2d");t.fillStyle="#ffffff",t.fillRect(0,0,128,128),t.strokeStyle="rgba(0,0,0,0.10)",t.lineWidth=1;for(let n=0;n<128;n+=4)t.beginPath(),t.moveTo(n+.5,0),t.lineTo(n+.5,128),t.moveTo(0,n+.5),t.lineTo(128,n+.5),t.stroke();return Js(e,{repeat:[10,10],srgb:!0})})}function J_(){return Qs("tread",()=>{const e=Zs(256),t=e.getContext("2d");t.fillStyle="#2b2b2e",t.fillRect(0,0,256,256),t.fillStyle="#191a1c";for(let n=0;n<5;n++){const s=18+n*46;t.fillRect(s,0,9,256)}t.fillStyle="rgba(0,0,0,0.42)";for(let n=0;n<256;n+=16)t.fillRect(0,n,256,4);return Js(e,{repeat:[1,12],srgb:!0})})}function Q_(){return Qs("deck",()=>{const e=Zs(256),t=e.getContext("2d");Td(t,256,{octaves:5,base:150,amp:12,seed:21});for(let n=0;n<8;n++){const s=n*32,r=t.createLinearGradient(s,0,s+32,0);r.addColorStop(0,"rgba(255,255,255,0.16)"),r.addColorStop(.5,"rgba(0,0,0,0.0)"),r.addColorStop(1,"rgba(0,0,0,0.20)"),t.fillStyle=r,t.fillRect(s,0,32,256)}return{map:Js(e,{repeat:[3,4],srgb:!0})}})}function ev(){return Qs("washi",()=>{const e=Zs(256),t=e.getContext("2d");t.fillStyle="#fff2d8",t.fillRect(0,0,256,256);for(let n=0;n<700;n++){const s=Math.random()*256,r=Math.random()*256,a=3+Math.random()*22,l=Math.random()*Math.PI;t.strokeStyle=`rgba(214,186,144,${.05+Math.random()*.14})`,t.lineWidth=.5+Math.random(),t.beginPath(),t.moveTo(s,r),t.lineTo(s+Math.cos(l)*a,r+Math.sin(l)*a),t.stroke()}return Js(e,{repeat:[1,1],srgb:!0})})}let Un=null;function Xr(){if(Un)return Un;const i=n=>new Dr(n),e=Z_(),t=Q_();return Un={paint:i({color:15922162,roughness:.36,metalness:.06}),paintDark:i({color:14212061,roughness:.42,metalness:.06}),bumper:i({color:3092788,roughness:.78,metalness:0}),trim:i({color:1842464,roughness:.6,metalness:.1}),chrome:i({color:14080477,roughness:.18,metalness:.95}),glass:i({color:659479,roughness:.14,metalness:.1,envMapIntensity:.45,transparent:!0,opacity:.95,side:Yt}),headlamp:i({color:14673646,roughness:.12,metalness:.2,emissive:9414336,emissiveIntensity:.35}),lampRed:i({color:8197145,roughness:.3,emissive:12591144,emissiveIntensity:.5}),lampAmber:i({color:9065478,roughness:.35,emissive:13664018,emissiveIntensity:.3}),tire:i({color:2303015,roughness:.94,metalness:0,map:J_()}),wheel:i({color:12172480,roughness:.42,metalness:.7}),hubcap:i({color:13620183,roughness:.3,metalness:.8}),deckSteel:i({color:12106944,roughness:.55,metalness:.62,...t}),frame:i({color:3816770,roughness:.72,metalness:.5}),galv:i({color:10396843,roughness:.5,metalness:.68}),alu:i({color:11120308,roughness:.38,metalness:.82}),aluDark:i({color:5922920,roughness:.44,metalness:.78}),ply:i({color:16777215,roughness:.72,metalness:0,map:dh()}),plyEdge:i({color:14267782,roughness:.8}),rubberFoot:i({color:1710620,roughness:.95}),steelRod:i({color:9344155,roughness:.3,metalness:.9}),hinge:i({color:7633279,roughness:.34,metalness:.88}),canvasCream:i({color:15524559,roughness:.92,metalness:0,map:uh(),side:Yt}),canvasIndigo:i({color:2045264,roughness:.9,metalness:0,map:uh(),side:Yt}),noren:i({color:1451578,roughness:.94,side:Yt}),vermilion:i({color:12858410,roughness:.42,metalness:.04}),vermilionDeep:i({color:9315357,roughness:.5}),hinoki:i({color:14205852,roughness:.68,map:dh()}),copperRoof:i({color:5214077,roughness:.62,metalness:.35}),copperTrim:i({color:12088115,roughness:.36,metalness:.85}),gold:i({color:14263361,roughness:.26,metalness:.95}),washi:i({color:16777215,map:ev(),roughness:.9,emissive:16764802,emissiveIntensity:.9,side:Yt}),rope:i({color:14998724,roughness:.95}),speakerBox:i({color:1579292,roughness:.86}),speakerGrille:i({color:2763824,roughness:.5,metalness:.6}),ledCyan:i({color:660504,emissive:3399935,emissiveIntensity:2.4,roughness:.4}),ledMagenta:i({color:1574927,emissive:16727214,emissiveIntensity:2.2,roughness:.4}),ledWarm:i({color:1709064,emissive:16757575,emissiveIntensity:2,roughness:.4}),stainless:i({color:12830925,roughness:.24,metalness:.94}),griddle:i({color:2894632,roughness:.55,metalness:.4}),asphalt:i({color:11580086,roughness:.97,metalness:0,...e})},Un.ghost=new Dr({color:8377599,roughness:.9,transparent:!0,opacity:.1,depthWrite:!1}),Un.hullWire=new Cs({color:4645024,transparent:!0,opacity:.55}),Un.hullWireBad=new Cs({color:16731501,transparent:!0,opacity:.95}),Un.axisWire=new Cs({color:16762967,transparent:!0,opacity:.9}),Un.sweepWire=new Cs({color:16762967,transparent:!0,opacity:.3}),Un.supportWire=new Cs({color:8377599,transparent:!0,opacity:.85}),Un}const o=i=>i/1e3,ii=i=>i*Math.PI/180,Ad=new $s(1,1,1);function N(i,e,{anchor:t=[0,0,0],pos:n=[0,0,0],rot:s=null,name:r=""}={}){const a=new je(Ad,e);return a.scale.set(i[0]||1e-5,i[1]||1e-5,i[2]||1e-5),a.position.set(n[0]-t[0]*i[0]/2,n[1]-t[1]*i[1]/2,n[2]-t[2]*i[2]/2),s&&a.rotation.set(s[0],s[1],s[2]),a.castShadow=!0,a.receiveShadow=!0,r&&(a.name=r),a}function si(i,e,t,n,s,{anchor:r=[0,0,0],pos:a=[0,0,0],steps:l=3}={}){const c=Math.min(n,i/2-1e-4,e/2-1e-4),h=new Ji;h.moveTo(-i/2+c,-e/2),h.lineTo(i/2-c,-e/2),h.quadraticCurveTo(i/2,-e/2,i/2,-e/2+c),h.lineTo(i/2,e/2-c),h.quadraticCurveTo(i/2,e/2,i/2-c,e/2),h.lineTo(-i/2+c,e/2),h.quadraticCurveTo(-i/2,e/2,-i/2,e/2-c),h.lineTo(-i/2,-e/2+c),h.quadraticCurveTo(-i/2,-e/2,-i/2+c,-e/2);const d=new Io(h,{depth:t,bevelEnabled:!1,curveSegments:l});d.translate(0,0,-t/2);const u=new je(d,s);return u.position.set(a[0]-r[0]*i/2,a[1]-r[1]*e/2,a[2]-r[2]*t/2),u.castShadow=!0,u.receiveShadow=!0,u}function tt(i,e,t,n,{seg:s=12,cap:r=!1}={}){const a=new A().fromArray(i),l=new A().fromArray(e),c=new A().subVectors(l,a),h=c.length();if(h<1e-6)return new _e;const d=new Wt(t,t,h,s,1,!r),u=new je(d,n);return u.position.copy(a).addScaledVector(c,.5),u.quaternion.setFromUnitVectors(new A(0,1,0),c.normalize()),u.castShadow=!0,u.receiveShadow=!0,u}function Ti(i,e,t,n){const s=new A().fromArray(i),r=new A().fromArray(e),a=new A().subVectors(r,s),l=a.length();if(l<1e-6)return new _e;const c=new je(Ad,n);return c.scale.set(t,l,t),c.position.copy(s).addScaledVector(a,.5),c.quaternion.setFromUnitVectors(new A(0,1,0),a.normalize()),c.castShadow=!0,c.receiveShadow=!0,c}function yo(i,e,t,n,{count:s=0}={}){const r=new A().fromArray(i),a=new A().fromArray(e),l=r.distanceTo(a),c=s||Math.max(3,Math.round(l/(t*9))),h=new _e;for(let d=0;d<c;d++){if(d%2===1)continue;const u=d/c,f=(d+1)/c;h.add(tt(new A().lerpVectors(r,a,u).toArray(),new A().lerpVectors(r,a,f).toArray(),t,n,{seg:8}))}return h.add(tt(i,e,t*.34,n,{seg:6})),h}function Fa(i,e,t,{anchorZ:n=0,holes:s=[]}={}){const r=new Ji;r.moveTo(i[0][0],i[0][1]);for(let c=1;c<i.length;c++)r.lineTo(i[c][0],i[c][1]);r.closePath();for(const c of s){const h=new Za;h.moveTo(c[0][0],c[0][1]);for(let d=1;d<c.length;d++)h.lineTo(c[d][0],c[d][1]);h.closePath(),r.holes.push(h)}const a=new Io(r,{depth:e,bevelEnabled:!1});a.translate(0,0,-(n+1)*e*.5);const l=new je(a,t);return l.castShadow=!0,l.receiveShadow=!0,l}function _n(i,e,{seg:t=24,open:n=!1}={}){const s=i.map(l=>new de(l[0],l[1])),r=new fl(s,t),a=new je(r,e);return a.material.side=n?Yt:ri,a.castShadow=!0,a.receiveShadow=!0,a}function Ir(i,e,t,n,{nx:s=10,ny:r=6,wave:a=.01}={}){const l=new ss(i,e,s,r),c=l.attributes.position,h=new A;for(let u=0;u<c.count;u++){h.fromBufferAttribute(c,u);const f=h.x/i,p=(e/2-h.y)/e;c.setXYZ(u,h.x,h.y-t*(1-Math.cos(f*Math.PI*2))*.5*p,Math.sin(f*Math.PI*5)*a*p)}l.computeVertexNormals();const d=new je(l,n);return d.castShadow=!0,d.receiveShadow=!0,d}function fh(i,e,t,n,{pleats:s=6}={}){const r=new ss(i,e,s*2,4),a=r.attributes.position,l=new A;for(let h=0;h<a.count;h++){l.fromBufferAttribute(a,h);const d=(l.x+i/2)/i,u=1-Math.abs(l.y)/(e/2);a.setXYZ(h,l.x,l.y,Math.sin(d*Math.PI*s*2)*t*.5*(.35+.65*u))}r.computeVertexNormals();const c=new je(r,n);return c.castShadow=!1,c.receiveShadow=!0,c}const tv=i=>i<0?0:i>1?1:i,ph=(i,e,t)=>{const n=tv((t-i)/(e-i));return n*n*(3-2*n)};function nv(i,e){const t=i.attributes.position;for(let n=0;n<t.count;n++)t.setZ(n,t.getZ(n)*e(t.getY(n)));return t.needsUpdate=!0,i.computeVertexNormals(),i}function iv(i,e,t,n,s,{doubleSide:r=!0}={}){const a=new Tt;a.setAttribute("position",new lt([...i,...e,...t,...i,...t,...n],3)),a.setAttribute("uv",new lt([0,0,1,0,1,1,0,0,1,1,0,1],2)),a.computeVertexNormals();const l=new je(a,s);return r&&(l.material=s),l.castShadow=!0,l.receiveShadow=!0,l}function sv(i){return e=>{if(e<=i[0][0])return i[0][1];for(let t=1;t<i.length;t++)if(e<=i[t][0]){const[n,s]=i[t-1],[r,a]=i[t];return s+(a-s)*(e-n)/(r-n)}return i[i.length-1][1]}}function ov(i,e){const t=Xr(),n=rv();if(i.background=n,e){const u=new Ya(e);i.environment=u.fromEquirectangular(n).texture,u.dispose()}i.fog=new hl(3953013,30,110);const s=new je(new ss(220,220,1,1),t.asphalt);s.rotation.x=-Math.PI/2,s.receiveShadow=!0,i.add(s);const r=new Dr({color:10721926,roughness:.96}),a=new _e;for(const u of[-2.35,2.35])a.add(N([7.6,.004,.1],r,{pos:[0,.002,u]}));a.add(N([.1,.004,4.7],r,{pos:[-3.75,.002,0]})),a.position.set(.2,0,0),i.add(a);const l=new j_(11059944,4865331,1.55);i.add(l);const c=new Ua(16765862,3.4);c.position.set(-9,5.2,7),c.castShadow=!0,c.shadow.mapSize.set(2048,2048),c.shadow.camera.near=1,c.shadow.camera.far=32,c.shadow.camera.left=-7,c.shadow.camera.right=7,c.shadow.camera.top=6,c.shadow.camera.bottom=-4,c.shadow.bias=-6e-4,c.shadow.normalBias=.018,i.add(c),i.add(c.target),c.target.position.set(0,.9,0);const h=new Ua(9417968,1.1);h.position.set(8,4,-6),i.add(h);const d=new Ua(16761738,.42);return d.position.set(0,-3,2),i.add(d),i.add(av()),i.add(lv()),{key:c,fill:h,hemi:l,ground:s}}function rv(){const i=document.createElement("canvas");i.width=8,i.height=256;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,256);t.addColorStop(0,"#16294a"),t.addColorStop(.4,"#33517f"),t.addColorStop(.66,"#6f83a6"),t.addColorStop(.84,"#d59b71"),t.addColorStop(1,"#f6bd8b"),e.fillStyle=t,e.fillRect(0,0,8,256);const n=new _d(i);return n.colorSpace=Lt,n.mapping=br,n}function av(){const i=new _e,e=new Ao({color:3361134,fog:!0,side:Yt}),t=70;let n=4;const s=()=>(n=n*1103515245+12345>>>0)/4294967296;for(let r=0;r<90;r++){const a=r/90*Math.PI*2+s()*.03,l=t+s()*14,c=s();let h;if(c<.62){const d=4+s()*7,u=d*(.22+s()*.13),f=new Ji;f.moveTo(-u,0),f.lineTo(u,0),f.lineTo(0,d),h=new je(new Lr(f),e)}else if(c<.88){const d=4+s()*6;h=new je(new pl(d*.55,9),e),h.position.y=d*.55}else{const d=8+s()*16,u=3+s()*4,f=new Ji;f.moveTo(-d/2,0),f.lineTo(d/2,0),f.lineTo(d/2,u),f.lineTo(0,u*1.28),f.lineTo(-d/2,u),h=new je(new Lr(f),e)}h.position.x+=Math.cos(a)*l,h.position.z=Math.sin(a)*l,h.lookAt(0,h.position.y,0),i.add(h)}return i}function lv(){const i=Xr(),e=new _e,t=new Dr({color:2764856,roughness:.8,metalness:.3});for(const[n,s]of[[-9.5,-7.5],[11,6.5]]){const r=new _e;r.add(tt([0,0,0],[0,7.4,0],.055,t)),r.add(tt([0,7.4,0],[Math.sign(-n)*1.1,7.55,0],.045,t));const a=N([.62,.1,.34],t,{pos:[Math.sign(-n)*1.35,7.5,0]});r.add(a);const l=N([.5,.03,.26],i.ledWarm,{pos:[Math.sign(-n)*1.35,7.44,0]});r.add(l);const c=new ci(16764826,12,22,2);c.position.set(Math.sign(-n)*1.35,7.3,0),r.add(c),r.position.set(n,0,s),e.add(r)}return e}function cv(i){i.shadowMap.enabled=!0,i.shadowMap.type=Oh,i.toneMapping=zh,i.toneMappingExposure=1.18,i.outputColorSpace=Lt}const hv={height:2e3},Ye={overallLength:3395,overallWidth:1475,overallHeight:1780,wheelbase:1900,trackFront:1305,trackRear:1300,groundClearance:160,kerbWeight_kg:780,payload_kg:350,gvw_kg:1240,bedInnerLength:1940,bedInnerWidth:1410,bedSideHeight:285,deckHeight:660,tyreSection:145,tyreAspect:80,rimDiameter:304.8,get tyreDiameter(){return this.rimDiameter+2*this.tyreSection*(this.tyreAspect/100)},gateThickness:24,cabGap:20,rearBumperDepth:15,frontOverhang:880,rearOverhang:615,toriiHeight:1120,toriiTube:34,sill:420,bumperBottom:360,bumperTop:560,grilleBottom:815,grilleTop:955,headlampCentre:885,windshieldBase:1010,windshieldSetback:190,roofFront:1695,windshieldRake_deg:29.6,beltline:1100,windowTop:1590,doorFront:2080,mirrorHeight:1185,mirrorReach:195,bodyWidth:1440,roofWidth:1290},k=Object.freeze({L:o(Ye.overallLength),W:o(Ye.overallWidth),H:o(Ye.overallHeight),wheelbase:o(Ye.wheelbase),trackFront:o(Ye.trackFront),trackRear:o(Ye.trackRear),clearance:o(Ye.groundClearance),bedLen:o(Ye.bedInnerLength),bedWid:o(Ye.bedInnerWidth),bedSide:o(Ye.bedSideHeight),deckH:o(Ye.deckHeight),gate:o(Ye.gateThickness),tyreR:o(Ye.tyreDiameter)/2,tyreW:o(Ye.tyreSection),rimR:o(Ye.rimDiameter)/2,toriiH:o(Ye.toriiHeight),toriiTube:o(Ye.toriiTube),sill:o(Ye.sill),windshieldBase:o(Ye.windshieldBase),windshieldSetback:o(Ye.windshieldSetback),windshieldRake:ii(Ye.windshieldRake_deg),roofFront:o(Ye.roofFront),beltline:o(Ye.beltline),windowTop:o(Ye.windowTop),headlampY:o(Ye.headlampCentre),grilleTop:o(Ye.grilleTop),grilleBottom:o(Ye.grilleBottom),bumperTop:o(Ye.bumperTop),bumperBottom:o(Ye.bumperBottom),mirrorY:o(Ye.mirrorHeight),mirrorReach:o(Ye.mirrorReach),bodyW:o(Ye.bodyWidth),roofW:o(Ye.roofWidth),payload:Ye.payload_kg,kerb:Ye.kerbWeight_kg});function dv(){const i=k.bedLen/2,e=i+k.gate,t=-(i+k.gate),n=e+o(Ye.cabGap),s=t-o(Ye.rearBumperDepth),r=s+k.L,a=r-n,l=r-o(Ye.frontOverhang),c=l-k.wheelbase;return{halfBed:i,bedFrontOuter:e,bedRearOuter:t,cabRear:n,rear:s,nose:r,cabLength:a,axleFront:l,axleRear:c,doorFront:o(Ye.doorFront),tailLever:c-t,headLever:e-c}}const Me=Object.freeze(dv()),Rd=k.bedWid/2,uv=k.H-k.deckH,fv=o(hv.height)-k.deckH,dr=k.bodyW,Mn=k.sill,Hi=k.tyreR+o(60),zn=Me.nose-k.windshieldSetback,Gi=zn-(k.roofFront-k.windshieldBase)*Math.tan(k.windshieldRake);function Nn(i){const e=ph(k.beltline,k.roofFront,i),t=ph(o(520),o(300),i);return 1-(1-k.roofW/k.bodyW)*e-.06*t}const On=sv([[o(300),Me.nose-o(40)],[o(380),Me.nose-o(8)],[o(470),Me.nose],[k.bumperTop,Me.nose-o(10)],[o(700),Me.nose-o(30)],[o(870),Me.nose-o(90)],[k.windshieldBase,zn]]);function pv(){const i=Xr(),e=new _e;return e.name="truck",e.add(mv(i)),e.add(_v(i)),e.add(vv(i)),e.add(wv(i)),{group:e,gateGeometry:{side:()=>xv(i),tail:()=>yv(i)},gateHinge:{side:t=>[0,0,t*(k.bedWid/2+k.gate/2)],tail:[-(k.bedLen/2+k.gate/2),0,0]},hulls:bv()}}function mv(i){const e=new _e;e.name="chassis";const t=o(290),n=k.deckH-o(55),s=o(95),r=n-s/2;for(const c of[-1,1])e.add(N([Me.nose-o(120)-Me.rear,s,o(45)],i.frame,{pos:[(Me.nose-o(120)+Me.rear)/2,r,c*t]}));for(const c of[Me.bedFrontOuter-o(60),Me.axleRear,Me.bedRearOuter+o(70),o(300)])e.add(N([o(55),o(60),t*2],i.frame,{pos:[c,r,0]}));e.add(tt([Me.axleRear,k.tyreR,-k.trackRear/2],[Me.axleRear,k.tyreR,k.trackRear/2],o(32),i.frame));const a=_n([[0,-o(90)],[o(100),-o(55)],[o(110),0],[o(100),o(55)],[0,o(90)]],i.frame,{seg:16});a.rotation.x=Math.PI/2,a.position.set(Me.axleRear,k.tyreR,0),e.add(a);for(const c of[-1,1]){const h=c*o(430);for(let d=0;d<3;d++){const u=o(360)-d*o(55),f=k.tyreR+o(46)+d*o(9);e.add(N([u*2,o(8),o(52)],i.frame,{pos:[Me.axleRear,f,h]}))}e.add(N([o(22),o(90),o(30)],i.frame,{pos:[Me.axleRear-o(360),k.tyreR+o(85),h]})),e.add(N([o(22),o(90),o(30)],i.frame,{pos:[Me.axleRear+o(360),k.tyreR+o(85),h]}))}e.add(tt([Me.axleFront,k.tyreR,-k.trackFront/2+o(60)],[Me.axleFront,k.tyreR,k.trackFront/2-o(60)],o(24),i.frame)),e.add(tt([Me.axleRear+o(60),k.tyreR+o(70),0],[o(900),k.deckH-o(190),0],o(21),i.frame)),e.add(si(o(520),o(230),o(300),o(40),i.galv,{pos:[o(250),r-o(10),o(-410)]})),e.add(tt([o(880),k.deckH-o(230),o(160)],[o(-80),k.deckH-o(250),o(300)],o(19),i.galv)),e.add(si(o(420),o(130),o(180),o(55),i.galv,{pos:[o(-260),k.deckH-o(255),o(320)]})),e.add(tt([o(-470),k.deckH-o(255),o(320)],[Me.rear+o(30),k.deckH-o(240),o(390)],o(17),i.galv));const l=new je(new Wt(k.tyreR*.94,k.tyreR*.94,k.tyreW,20),i.tire);return l.position.set(o(430),k.deckH-o(215),o(240)),l.castShadow=!0,e.add(l),e}function gv(){const i=[],e=(r,a)=>i.push([r,a]);e(Me.nose-o(40),o(300)),e(Me.nose-o(8),o(380)),e(Me.nose,o(470)),e(Me.nose-o(10),k.bumperTop),e(Me.nose-o(30),o(700)),e(Me.nose-o(90),o(870)),e(zn,k.windshieldBase),e(Gi,k.roofFront),e(Gi-o(200),o(1762)),e(Me.cabRear+o(320),k.H),e(Me.cabRear+o(70),k.H-o(8)),e(Me.cabRear,k.H-o(80)),e(Me.cabRear,Mn);const t=k.tyreR,n=Math.sqrt(Math.max(0,Hi*Hi-(Mn-t)*(Mn-t))),s=Math.acos(-n/Hi);e(Me.axleFront-n,Mn);for(let r=0;r<=14;r++){const a=s+r/14*(Math.PI-2*s);e(Me.axleFront+Math.cos(a)*Hi,t+Math.sin(a)*Hi)}return e(Me.axleFront+n,Mn),e(Me.nose-o(40),Mn),i}function za(){const i=c=>zn-(c-k.windshieldBase)*Math.tan(k.windshieldRake),e=o(70),t=Me.cabRear+o(80),n=k.beltline,s=k.windowTop,r=i(n)-e,a=i(s)-e,l=o(50);return[[t,n+l],[t+l,n],[r-l,n],[r,n+l*.8],[a,s-l*.8],[a-l,s],[t+l,s],[t,s-l]]}function _v(i){const e=new _e;e.name="cab";const t=dr/2,n=Fa(gv(),dr,i.paint,{anchorZ:0,holes:[za()]});nv(n.geometry,Nn),e.add(n);const s=i.trim,r=Me.axleFront+o(60);e.add(N([o(820),o(30),dr-o(240)],s,{pos:[r-o(80),o(620),0]})),e.add(N([o(240),o(150),dr-o(300)],s,{pos:[zn-o(190),o(1060),0]}));for(const y of[-1,1])e.add(N([o(430),o(90),o(440)],s,{pos:[r-o(120),o(770),y*o(330)]})),e.add(N([o(90),o(500),o(440)],s,{pos:[r-o(350),o(1040),y*o(330)]}));const a=new je(new gl(o(150),o(14),8,18),s);a.position.set(zn-o(300),o(1130),-o(310)),a.rotation.set(Math.PI/2-.5,0,0),e.add(a);const l=(t-o(40))*Nn(k.windshieldBase),c=(t-o(40))*Nn(k.roofFront),h=zn-o(18),d=Gi-o(14);e.add(iv([h,k.windshieldBase+o(10),-l],[h,k.windshieldBase+o(10),l],[d,k.roofFront-o(20),c],[d,k.roofFront-o(20),-c],i.glass));for(const y of[-1,1])e.add(tt([zn,k.windshieldBase,y*l],[Gi,k.roofFront,y*c],o(34),i.paint));e.add(tt([Gi,k.roofFront,-c],[Gi,k.roofFront,c],o(30),i.paint)),e.add(tt([zn,k.windshieldBase,-l],[zn,k.windshieldBase,l],o(26),i.paint));for(const y of[-1,1])e.add(tt([h-o(14),k.windshieldBase+o(30),y*o(40)],[h-o(62),k.windshieldBase+o(140),y*o(480)],o(8),i.trim));for(const y of[-1,1]){const x=y*(t*Nn(o(1350))-o(16)),M=Fa(za(),o(6),i.glass,{anchorZ:0});M.position.z=x,e.add(M);const L=Fa(za(),o(4),i.trim,{anchorZ:0});L.scale.set(1.012,1.012,1),L.position.set(-Me.cabRear*.012-o(6),-k.beltline*.012,x+y*o(6)),e.add(L)}const u=(k.grilleTop+k.grilleBottom)/2,f=k.grilleTop-k.grilleBottom,p=Math.atan2(On(o(870))-On(k.windshieldBase),k.windshieldBase-o(870)),_=(t-o(40))*Nn(u),v=N([o(30),f,_*2],i.trim,{pos:[On(u)+o(4),u,0]});v.rotation.z=-p,e.add(v),e.add(N([o(20),f*.34,_*1.55],i.paintDark,{pos:[On(u)+o(12),u,0],rot:[0,0,-p]}));for(const y of[-1,1]){const x=y*(_-o(150)),M=si(o(26),f*.86,o(300),o(24),i.headlamp),L=new _e;L.position.set(On(u)+o(10),u,x),L.rotation.z=-p,L.add(M),e.add(L);const R=new je(new Wt(o(38),o(38),o(16),14),i.lampAmber);R.rotation.z=Math.PI/2-p,R.position.set(On(u)+o(16),u,x-y*o(105)),e.add(R)}const g=(k.bumperTop+k.bumperBottom)/2,m=(t-o(10))*Nn(g);e.add(si(o(70),k.bumperTop-k.bumperBottom,m*2,o(26),i.paint,{pos:[On(g)-o(24),g,0]})),e.add(N([o(40),o(120),m*1.15],i.bumper,{pos:[On(g)-o(6),k.bumperBottom-o(30),0]})),e.add(N([o(24),o(90),m*.85],i.trim,{pos:[On(g)+o(12),g+o(30),0]})),e.add(N([o(12),o(165),o(330)],i.chrome,{pos:[On(g)+o(20),g-o(10),o(-250)]}));for(let y=-1;y<=1;y++){const x=y*o(340)*Nn(k.H);e.add(N([o(240),o(14),o(150)],i.paint,{pos:[Gi-o(150),k.H-o(28),x]}))}for(const y of[-1,1]){const x=y*(t*Nn(k.beltline)+o(3)),M=y*(t*Nn(o(700))+o(3));e.add(N([o(9),k.beltline-Mn,o(6)],i.trim,{pos:[Me.doorFront,(Mn+k.beltline)/2,M]})),e.add(N([o(9),k.windowTop-Mn,o(6)],i.trim,{pos:[Me.cabRear+o(45),(Mn+k.windowTop)/2,x]})),e.add(N([o(130),o(36),o(24)],i.paintDark,{pos:[Me.cabRear+o(230),k.beltline-o(60),x+y*o(8)]}));const L=y*t*Nn(k.mirrorY),R=y*(t+k.mirrorReach);e.add(tt([Me.doorFront-o(30),k.beltline+o(40),L],[Me.doorFront+o(10),k.mirrorY,R],o(16),i.trim));const C=si(o(130),o(215),o(56),o(26),i.paintDark,{pos:[Me.doorFront+o(20),k.mirrorY+o(60),R]});C.rotation.y=Math.PI/2,e.add(C),e.add(N([o(80),o(32),o(10)],i.lampAmber,{pos:[Me.axleFront+o(300),o(760),M]})),e.add(N([o(14),o(190),o(210)],i.bumper,{pos:[Me.axleFront-Hi-o(15),o(280),y*o(590)]}))}return e}function vv(i){const e=new _e;e.name="bed";const t=k.bedLen/2,n=k.bedWid/2,s=k.deckH;e.add(N([k.bedLen+k.gate*2,o(14),k.bedWid+k.gate*2],i.deckSteel,{pos:[0,s-o(7),0],anchor:[0,0,0]})),e.add(N([k.bedLen+k.gate*2,o(45),k.bedWid-o(60)],i.frame,{pos:[0,s-o(38),0]}));for(let h=-3;h<=3;h++)e.add(N([o(45),o(50),k.bedWid+o(20)],i.frame,{pos:[h*o(300),s-o(42),0]}));for(const h of[-1,1])for(const d of[-1,1])e.add(N([o(45),k.bedSide,o(45)],i.galv,{pos:[h*(t-o(22)),s,d*(n-o(22))],anchor:[0,-1,0]}));const r=vl(i,k.bedWid+k.gate*2,k.bedSide,5);r.rotation.y=Math.PI/2,r.position.set(t+k.gate/2,s,0),e.add(r);const a=s+k.toriiH,l=k.toriiTube/2,c=n-o(55);for(const h of[-1,1])e.add(tt([t-o(10),s+k.bedSide-o(40),h*c],[t-o(10),a,h*c],l,i.galv)),e.add(tt([t-o(10),s+k.bedSide+o(120),h*c],[t-o(10),s+k.bedSide+o(120),h*(c-o(120))],l*.7,i.galv));e.add(tt([t-o(10),a,-c],[t-o(10),a,c],l,i.galv)),e.add(tt([t-o(10),a-o(300),-c],[t-o(10),a-o(300),c],l*.8,i.galv));for(const h of[-1,1])e.add(N([o(10),o(150),o(110)],i.galv,{pos:[t-o(10),s+k.bedSide+o(60),h*(c-o(30))]}));e.add(N([o(30),o(190),k.bedWid+k.gate*2],i.paint,{pos:[Me.bedRearOuter-o(15),s-o(105),0]}));for(const h of[-1,1])e.add(si(o(18),o(115),o(190),o(16),i.lampRed,{pos:[Me.bedRearOuter-o(32),s-o(105),h*o(530)]}));e.add(N([o(10),o(165),o(330)],i.chrome,{pos:[Me.bedRearOuter-o(34),s-o(105),o(230)]})),e.add(N([o(40),o(50),o(60)],i.galv,{pos:[Me.bedRearOuter-o(24),s-o(250),0]}));for(const h of[-1,1])e.add(N([o(14),o(230),o(230)],i.bumper,{pos:[Me.axleRear-Hi+o(10),o(290),h*o(600)]}));return e.add(yo([-t+o(60),s,n+k.gate/2],[t-o(60),s,n+k.gate/2],o(13),i.hinge)),e.add(yo([-t+o(60),s,-n-k.gate/2],[t-o(60),s,-n-k.gate/2],o(13),i.hinge)),e.add(yo([-t-k.gate/2,s,-n+o(60)],[-t-k.gate/2,s,n-o(60)],o(13),i.hinge)),e}function vl(i,e,t,n){const s=new _e;s.add(N([e,t,k.gate],i.paint,{anchor:[0,-1,0]}));for(let r=0;r<n;r++){const a=(r/(n-1)-.5)*(e-o(220));s.add(N([o(70),t-o(70),k.gate+o(7)],i.paint,{pos:[a,t/2,0]}))}s.add(tt([-e/2,t-o(8),0],[e/2,t-o(8),0],o(13),i.galv));for(const r of[-1,1])s.add(N([o(60),o(80),k.gate+o(20)],i.galv,{pos:[r*(e/2-o(70)),t-o(70),0]}));return s}function xv(i){return vl(i,k.bedLen-o(90),k.bedSide,5)}function yv(i){const e=new _e,t=vl(i,k.bedWid+k.gate*2,k.bedSide,4);return t.rotation.y=Math.PI/2,e.add(t),e}function wv(i){const e=new _e;e.name="wheels";for(const[t,n]of[[Me.axleFront,k.trackFront],[Me.axleRear,k.trackRear]])for(const s of[-1,1])e.add(Mv(i,t,s*(n/2),s));return e}function Mv(i,e,t,n){const s=new _e;s.position.set(e,k.tyreR,t);const r=new je(new Wt(k.tyreR,k.tyreR,k.tyreW*.72,26),i.tire);r.rotation.x=Math.PI/2,r.castShadow=!0,s.add(r);for(const c of[-1,1]){const h=new je(new Wt(k.tyreR*.965,k.tyreR*.88,k.tyreW*.14,26),i.tire);h.rotation.x=Math.PI/2,h.position.z=c*k.tyreW*.43,s.add(h)}const a=new je(new Wt(k.rimR,k.rimR,k.tyreW*.6,22),i.wheel);a.rotation.x=Math.PI/2,s.add(a);const l=new je(new Wt(k.rimR*.82,k.rimR*.86,o(16),22),i.hubcap);l.rotation.x=Math.PI/2,l.position.z=n*(k.tyreW*.5-o(6)),s.add(l);for(let c=0;c<4;c++){const h=c/4*Math.PI*2+Math.PI/4,d=new je(new Wt(o(11),o(11),o(12),6),i.chrome);d.rotation.x=Math.PI/2,d.position.set(Math.cos(h)*o(50),Math.sin(h)*o(50),n*(k.tyreW*.5+o(2))),s.add(d)}return s}function bv(){return k.bedWid/2,[{id:"cab",c:[(Me.nose+Me.cabRear)/2,(Mn+k.H)/2,0],s:[Me.nose-Me.cabRear,k.H-Mn,k.W]},{id:"torii",c:[k.bedLen/2-o(10),k.deckH+k.toriiH/2+k.bedSide/2,0],s:[o(60),k.toriiH-k.bedSide,k.bedWid]},{id:"deck",c:[0,k.deckH-o(30),0],s:[k.bedLen+k.gate*2,o(60),k.bedWid+k.gate*2]},{id:"wheel-rl",c:[Me.axleRear,k.tyreR,-k.trackRear/2],s:[k.tyreR*2,k.tyreR*2,k.tyreW]},{id:"wheel-rr",c:[Me.axleRear,k.tyreR,k.trackRear/2],s:[k.tyreR*2,k.tyreR*2,k.tyreW]},{id:"mirror-l",c:[Me.doorFront+o(20),k.mirrorY+o(60),-(k.bodyW/2+k.mirrorReach)],s:[o(140),o(230),o(70)]},{id:"mirror-r",c:[Me.doorFront+o(20),k.mirrorY+o(60),k.bodyW/2+k.mirrorReach],s:[o(140),o(230),o(70)]}]}const ot={c:null,u:[new A,new A,new A],e:[]},ht={c:null,u:[new A,new A,new A],e:[]},wt=[[],[],[]],We=[[],[],[]],_t=[],Ii=new A,ki=new A,Ui=new A,It=new A,mh=new A,gh=new A,Rn=new Ze,_h=new is,ur=new mt,vh=new mt,xh=new Br;class xl{constructor(e=new A,t=new A,n=new Ze){this.center=e,this.halfSize=t,this.rotation=n}set(e,t,n){return this.center=e,this.halfSize=t,this.rotation=n,this}copy(e){return this.center.copy(e.center),this.halfSize.copy(e.halfSize),this.rotation.copy(e.rotation),this}clone(){return new this.constructor().copy(this)}getSize(e){return e.copy(this.halfSize).multiplyScalar(2)}clampPoint(e,t){const n=this.halfSize;It.subVectors(e,this.center),this.rotation.extractBasis(Ii,ki,Ui),t.copy(this.center);const s=vr.clamp(It.dot(Ii),-n.x,n.x);t.add(Ii.multiplyScalar(s));const r=vr.clamp(It.dot(ki),-n.y,n.y);t.add(ki.multiplyScalar(r));const a=vr.clamp(It.dot(Ui),-n.z,n.z);return t.add(Ui.multiplyScalar(a)),t}containsPoint(e){return It.subVectors(e,this.center),this.rotation.extractBasis(Ii,ki,Ui),Math.abs(It.dot(Ii))<=this.halfSize.x&&Math.abs(It.dot(ki))<=this.halfSize.y&&Math.abs(It.dot(Ui))<=this.halfSize.z}intersectsBox3(e){return this.intersectsOBB(Sv.fromBox3(e))}intersectsSphere(e){return this.clampPoint(e.center,gh),gh.distanceToSquared(e.center)<=e.radius*e.radius}intersectsOBB(e,t=Number.EPSILON){ot.c=this.center,ot.e[0]=this.halfSize.x,ot.e[1]=this.halfSize.y,ot.e[2]=this.halfSize.z,this.rotation.extractBasis(ot.u[0],ot.u[1],ot.u[2]),ht.c=e.center,ht.e[0]=e.halfSize.x,ht.e[1]=e.halfSize.y,ht.e[2]=e.halfSize.z,e.rotation.extractBasis(ht.u[0],ht.u[1],ht.u[2]);for(let r=0;r<3;r++)for(let a=0;a<3;a++)wt[r][a]=ot.u[r].dot(ht.u[a]);It.subVectors(ht.c,ot.c),_t[0]=It.dot(ot.u[0]),_t[1]=It.dot(ot.u[1]),_t[2]=It.dot(ot.u[2]);for(let r=0;r<3;r++)for(let a=0;a<3;a++)We[r][a]=Math.abs(wt[r][a])+t;let n,s;for(let r=0;r<3;r++)if(n=ot.e[r],s=ht.e[0]*We[r][0]+ht.e[1]*We[r][1]+ht.e[2]*We[r][2],Math.abs(_t[r])>n+s)return!1;for(let r=0;r<3;r++)if(n=ot.e[0]*We[0][r]+ot.e[1]*We[1][r]+ot.e[2]*We[2][r],s=ht.e[r],Math.abs(_t[0]*wt[0][r]+_t[1]*wt[1][r]+_t[2]*wt[2][r])>n+s)return!1;return n=ot.e[1]*We[2][0]+ot.e[2]*We[1][0],s=ht.e[1]*We[0][2]+ht.e[2]*We[0][1],!(Math.abs(_t[2]*wt[1][0]-_t[1]*wt[2][0])>n+s||(n=ot.e[1]*We[2][1]+ot.e[2]*We[1][1],s=ht.e[0]*We[0][2]+ht.e[2]*We[0][0],Math.abs(_t[2]*wt[1][1]-_t[1]*wt[2][1])>n+s)||(n=ot.e[1]*We[2][2]+ot.e[2]*We[1][2],s=ht.e[0]*We[0][1]+ht.e[1]*We[0][0],Math.abs(_t[2]*wt[1][2]-_t[1]*wt[2][2])>n+s)||(n=ot.e[0]*We[2][0]+ot.e[2]*We[0][0],s=ht.e[1]*We[1][2]+ht.e[2]*We[1][1],Math.abs(_t[0]*wt[2][0]-_t[2]*wt[0][0])>n+s)||(n=ot.e[0]*We[2][1]+ot.e[2]*We[0][1],s=ht.e[0]*We[1][2]+ht.e[2]*We[1][0],Math.abs(_t[0]*wt[2][1]-_t[2]*wt[0][1])>n+s)||(n=ot.e[0]*We[2][2]+ot.e[2]*We[0][2],s=ht.e[0]*We[1][1]+ht.e[1]*We[1][0],Math.abs(_t[0]*wt[2][2]-_t[2]*wt[0][2])>n+s)||(n=ot.e[0]*We[1][0]+ot.e[1]*We[0][0],s=ht.e[1]*We[2][2]+ht.e[2]*We[2][1],Math.abs(_t[1]*wt[0][0]-_t[0]*wt[1][0])>n+s)||(n=ot.e[0]*We[1][1]+ot.e[1]*We[0][1],s=ht.e[0]*We[2][2]+ht.e[2]*We[2][0],Math.abs(_t[1]*wt[0][1]-_t[0]*wt[1][1])>n+s)||(n=ot.e[0]*We[1][2]+ot.e[1]*We[0][2],s=ht.e[0]*We[2][1]+ht.e[1]*We[2][0],Math.abs(_t[1]*wt[0][2]-_t[0]*wt[1][2])>n+s))}intersectsPlane(e){this.rotation.extractBasis(Ii,ki,Ui);const t=this.halfSize.x*Math.abs(e.normal.dot(Ii))+this.halfSize.y*Math.abs(e.normal.dot(ki))+this.halfSize.z*Math.abs(e.normal.dot(Ui)),n=e.normal.dot(this.center)-e.constant;return Math.abs(n)<=t}intersectRay(e,t){return this.getSize(mh),_h.setFromCenterAndSize(It.set(0,0,0),mh),ur.setFromMatrix3(this.rotation),ur.setPosition(this.center),vh.copy(ur).invert(),xh.copy(e).applyMatrix4(vh),xh.intersectBox(_h,t)?t.applyMatrix4(ur):null}intersectsRay(e){return this.intersectRay(e,It)!==null}fromBox3(e){return e.getCenter(this.center),e.getSize(this.halfSize).multiplyScalar(.5),this.rotation.identity(),this}equals(e){return e.center.equals(this.center)&&e.halfSize.equals(this.halfSize)&&e.rotation.equals(this.rotation)}applyMatrix4(e){const t=e.elements;let n=It.set(t[0],t[1],t[2]).length();const s=It.set(t[4],t[5],t[6]).length(),r=It.set(t[8],t[9],t[10]).length();e.determinant()<0&&(n=-n),Rn.setFromMatrix4(e);const l=1/n,c=1/s,h=1/r;return Rn.elements[0]*=l,Rn.elements[1]*=l,Rn.elements[2]*=l,Rn.elements[3]*=c,Rn.elements[4]*=c,Rn.elements[5]*=c,Rn.elements[6]*=h,Rn.elements[7]*=h,Rn.elements[8]*=h,this.rotation.multiply(Rn),this.halfSize.x*=n,this.halfSize.y*=s,this.halfSize.z*=r,It.setFromMatrixPosition(e),this.center.add(It),this}}const Sv=new xl,Ni=new A,Yi=new vn,Ba=new mt,Cd=new mt,Ev=new A;function Tv(i){const e=Math.min(1,Math.max(0,i));return e*e*(3-2*e)}class Av{constructor(e){this.id=e.id,this.parentId=e.parent??null,this.jointType=e.joint??"fixed",this.stage=e.stage??0,this.window=e.window??null,this.easing=e.easing!==!1,this.label=e.label??e.id,this.note=e.note??"",this.pivot=new A().fromArray(e.pivot??[0,0,0]),this.axis=new A().fromArray(e.axis??[0,0,1]).normalize(),this.rest=e.rest?new vn().setFromAxisAngle(new A().fromArray(e.rest[0]).normalize(),e.rest[1]):null;const t=e.range??[0,0];this.from=t[0],this.to=t[1],this.group=new _e,this.group.name=e.id,this.hulls=(e.hulls??[]).map(Rv),this.mates=new Set(e.mates??[]),this.static=e.static===!0,this.mass=e.mass??0,this.com=new A().fromArray(e.com??[0,0,0]),this.footprint=e.footprint??null,this.children=[],this.q=0}setJoint(e){this.q=e;const t=this.group;this.jointType==="slide"||this.jointType==="telescope"?(t.position.copy(this.pivot).addScaledVector(this.axis,e),t.quaternion.copy(this.rest??yh)):this.jointType==="hinge"?(t.position.copy(this.pivot),Yi.setFromAxisAngle(this.axis,e),this.rest?t.quaternion.copy(this.rest).premultiply(Yi):t.quaternion.copy(Yi)):(t.position.copy(this.pivot),t.quaternion.copy(this.rest??yh))}}const yh=new vn;function Rv(i){const e=new A().fromArray(i.c??[0,0,0]),t=new A().fromArray(i.s??[.1,.1,.1]).multiplyScalar(.5),n=i.rot?new vn().setFromAxisAngle(new A().fromArray(i.rot[0]).normalize(),i.rot[1]):new vn,s=new mt().compose(e,n,new A(1,1,1));return{half:t,local:s,tag:i.tag??""}}class Cv{constructor(e="rig"){this.name=e,this.root=new _e,this.root.name=e,this.parts=new Map,this.order=[],this.stageCount=0,this.stageLabels=[]}add(e){const t=new Av(e);if(this.parts.has(t.id))throw new Error(`rig ${this.name}: duplicate part "${t.id}"`);this.parts.set(t.id,t);const n=t.parentId?this.parts.get(t.parentId):null;if(t.parentId&&!n)throw new Error(`rig ${this.name}: part "${t.id}" hangs off unknown parent "${t.parentId}"`);return n?(n.children.push(t),n.group.add(t.group)):this.root.add(t.group),this.order.push(t),t.static||(this.stageCount=Math.max(this.stageCount,t.stage+1)),t.setJoint(t.from),t}attach(e,t){const n=this.parts.get(e);if(!n)throw new Error(`rig ${this.name}: no part "${e}"`);return n.group.add(t),t}get(e){return this.parts.get(e)}centreOfMass(){const e=new A;let t=0;for(const n of this.order)n.mass&&(Ni.copy(n.com).applyMatrix4(n.group.matrixWorld),e.addScaledVector(Ni,n.mass),t+=n.mass);return t>0&&e.multiplyScalar(1/t),{point:e,mass:t}}feet(){const e=[];for(const t of this.order)t.footprint&&(Ni.copy(t.footprint).applyMatrix4(t.group.matrixWorld),e.push({id:t.id,x:Ni.x,z:Ni.z,y:Ni.y}));return e}setStages(e){this.stageLabels=e,this.stageCount=Math.max(this.stageCount,e.length)}stageWindow(e){const n=1/Math.max(1,this.stageCount),s=n*.28,r=e*n,a=r+n;return[Math.max(0,r-s*.5),Math.min(1,a+s*.5)]}setProgress(e){this.t=Math.min(1,Math.max(0,e));for(const t of this.order){if(t.static||t.jointType==="fixed"){t.setJoint(t.from);continue}const[n,s]=t.window??this.stageWindow(t.stage),r=s<=n?this.t>=s?1:0:(this.t-n)/(s-n),a=t.easing?Tv(r):Math.min(1,Math.max(0,r));t.setJoint(t.from+(t.to-t.from)*a)}this.root.updateWorldMatrix(!0,!0)}worldHulls(e=[]){e.length=0;for(const t of this.order)if(t.hulls.length)for(const n of t.hulls){Ba.multiplyMatrices(t.group.matrixWorld,n.local);const s=n.obb??(n.obb=new xl);s.halfSize.copy(n.half),s.center.setFromMatrixPosition(Ba),Ba.decompose(Ni,Yi,Ev),s.rotation.setFromMatrix4(Cd.makeRotationFromQuaternion(Yi)),e.push({part:t,obb:s,tag:n.tag})}return e}audit({samples:e=96,statics:t=[],tolerance:n=6e-4}={}){const s=this.t??0,r=new Map;let a=0;for(let c=0;c<=e;c++){const h=c/e;this.setProgress(h);const d=this.worldHulls();for(const u of t)d.push(u);for(let u=0;u<d.length;u++)for(let f=u+1;f<d.length;f++){const p=d[u],_=d[f];if(p.part===_.part||Pv(p.part,_.part))continue;a++;const v=Lv(p.obb,_.obb);if(v<=n)continue;const g=p.part.id<_.part.id?`${p.part.id}|${_.part.id}`:`${_.part.id}|${p.part.id}`,m=r.get(g);(!m||v>m.depth)&&r.set(g,{a:p.part.id,b:_.part.id,aTag:p.tag,bTag:_.tag,depth:v,t:h})}}this.setProgress(s);const l=[...r.values()].sort((c,h)=>h.depth-c.depth);return{ok:l.length===0,collisions:l,samples:e,pairsTested:Math.round(a/(e+1))}}}function Pv(i,e){return!!(i.parentId===e.id||e.parentId===i.id||i.mates.has(e.id)||e.mates.has(i.id)||i.static&&e.static)}const bs=Array.from({length:15},()=>new A),Ss=[new A,new A,new A],Es=[new A,new A,new A],wh=new A;function Lv(i,e){Mh(i,Ss),Mh(e,Es);let t=0;for(let s=0;s<3;s++)bs[t++].copy(Ss[s]);for(let s=0;s<3;s++)bs[t++].copy(Es[s]);for(let s=0;s<3;s++)for(let r=0;r<3;r++)bs[t].crossVectors(Ss[s],Es[r]),bs[t].lengthSq()>1e-8&&(bs[t].normalize(),t++);wh.subVectors(e.center,i.center);let n=1/0;for(let s=0;s<t;s++){const r=bs[s],a=i.halfSize.x*Math.abs(r.dot(Ss[0]))+i.halfSize.y*Math.abs(r.dot(Ss[1]))+i.halfSize.z*Math.abs(r.dot(Ss[2])),l=e.halfSize.x*Math.abs(r.dot(Es[0]))+e.halfSize.y*Math.abs(r.dot(Es[1]))+e.halfSize.z*Math.abs(r.dot(Es[2])),c=Math.abs(wh.dot(r)),h=a+l-c;if(h<=0)return 0;h<n&&(n=h)}return n}function Mh(i,e){const t=i.rotation.elements;return e[0].set(t[0],t[1],t[2]),e[1].set(t[3],t[4],t[5]),e[2].set(t[6],t[7],t[8]),e}function bh(i,{c:e=[0,0,0],s:t=[1,1,1],rot:n=null,mates:s=[]}={}){const r=new xl;return r.center.fromArray(e),r.halfSize.fromArray(t).multiplyScalar(.5),n&&(Yi.setFromAxisAngle(new A().fromArray(n[0]).normalize(),n[1]),r.rotation.setFromMatrix4(Cd.makeRotationFromQuaternion(Yi))),{part:{id:i,parentId:null,static:!0,mates:new Set(s)},obb:r,tag:i}}const Sh=-k.gate/2,Dv=Rd+k.gate/2,Iv=-(k.bedLen/2+k.gate/2),fr=o(290),Eh={shut:0,flat:Math.PI/2,hang:ii(165)};function jr(i,e,{left:t="hang",right:n="hang",tail:s="hang",stage:r=0}={}){const a=c=>[{c:[0,k.bedSide/2,0],s:[k.bedLen-o(90),k.bedSide,k.gate],tag:"gate"}];for(const[c,h]of[["left",-1],["right",1]]){const d=c==="left"?t:n,u=i.add({id:`gate-${c}`,parent:null,label:`${c} drop side`,pivot:[0,Sh,h*Dv],joint:"hinge",axis:[1,0,0],range:[0,h*Eh[d]],stage:r,hulls:a(),mates:["deck","floor","ground"],note:d==="flat"?"held horizontal by a drop leg":""});i.attach(u.id,e.truck.gateGeometry.side())}const l=i.add({id:"gate-tail",parent:null,label:"tailgate",pivot:[Iv,Sh,0],joint:"hinge",axis:[0,0,1],range:[0,Eh[s]],stage:r,hulls:[{c:[0,k.bedSide/2,0],s:[k.gate,k.bedSide,k.bedWid+k.gate*2],tag:"gate"}],mates:["deck","floor","ground"]});i.attach(l.id,e.truck.gateGeometry.tail())}function qr(i,{height:e=o(110),inset:t=o(10),skin:n=null}={}){const s=new _e,r=k.bedLen-t*2,a=k.bedWid-t*2,l=o(60);for(const c of[-a/2+l/2,-o(230),o(230),a/2-l/2])s.add(Ti([-r/2,e-l/2,c],[r/2,e-l/2,c],l,i.aluDark));for(let c=-3;c<=3;c++)s.add(Ti([c*o(300),e-l/2,-a/2],[c*o(300),e-l/2,a/2],o(45),i.aluDark));for(const c of[-1,1])for(const h of[-1,1])s.add(N([o(150),o(10),o(150)],i.galv,{pos:[c*(r/2-o(90)),o(6),h*(a/2-o(90))]}));return s.add(N([r,o(22),a],n??i.ply,{pos:[0,e-o(11),0]})),s}function Yr(i=o(110),e=o(10)){return[{c:[0,i/2,0],s:[k.bedLen-e*2,i,k.bedWid-e*2],tag:"subframe"}]}function $r(i,e,{id:t,parent:n=null,at:s,stage:r,drop:a=null,label:l}){const c=a??k.deckH+s[1]-fr,h=i.add({id:t,parent:n,label:l??"stabiliser jack",pivot:s,joint:"slide",axis:[0,-1,0],range:[0,c],stage:r,mass:4.4,com:[0,-c/2,0],footprint:[0,-fr,0],hulls:[{c:[0,-o(150),0],s:[o(76),o(300),o(76)],tag:"jack"}],mates:["ground","gate-left","gate-right","gate-tail"],note:"takes the truck off its springs"}),d=new _e;d.add(N([o(58),o(280),o(58)],e.galv,{pos:[0,-o(140),0]})),d.add(N([o(170),o(22),o(170)],e.aluDark,{pos:[0,-fr+o(20),0]})),d.add(N([o(190),o(16),o(190)],e.rubberFoot,{pos:[0,-fr+o(4),0]}));const u=tt([o(30),-o(20),0],[o(130),-o(20),0],o(9),e.steelRod);return d.add(u),i.attach(t,d),h}function Pd(i,e,{foot:t=o(150),section:n=o(50)}={}){const s=new _e;return s.add(N([n,e,n],i.alu,{anchor:[0,1,0]})),s.add(N([n*.6,o(120),n*.6],i.aluDark,{pos:[0,-e-o(50),0]})),s.add(N([t,o(18),t],i.aluDark,{pos:[0,-e-o(110),0]})),s.add(N([t+o(20),o(14),t+o(20)],i.rubberFoot,{pos:[0,-e-o(122),0]})),s.add(tt([0,-e*.55,0],[o(230),-o(30),0],o(14),i.steelRod)),s}function Th(i,e,{size:t=o(70)}={}){const n=new _e;return n.add(N([t,t*.55,t*.35],i.galv,{pos:e})),n.add(tt([e[0]-t*.4,e[1],e[2]],[e[0]+t*.5,e[1]-t*.3,e[2]],o(7),i.steelRod)),n}function kv(i,e,t,{radius:n=o(7)}={}){const s=new _e;s.add(tt(e,t,n,i.steelRod,{seg:6}));const r=new A().fromArray(e).lerp(new A().fromArray(t),.5),a=new A().fromArray(t).sub(new A().fromArray(e)).normalize();return s.add(tt(r.clone().addScaledVector(a,-o(50)).toArray(),r.clone().addScaledVector(a,o(50)).toArray(),n*2.1,i.galv,{seg:6})),s}function Xn(i,e,t,n,{face:s=null,frame:r=!0,anchorY:a=0}={}){const l=new _e,c=[-1,a,0];if(l.add(N([e,n,t],s??i.ply,{anchor:c})),r){const h=n+o(5);l.add(N([e,h,o(34)],i.alu,{anchor:c,pos:[0,0,t/2-o(17)]})),l.add(N([e,h,o(34)],i.alu,{anchor:c,pos:[0,0,-t/2+o(17)]})),l.add(N([o(34),h,t],i.alu,{anchor:c,pos:[e-o(34),0,0]})),l.add(N([o(34),h,t],i.alu,{anchor:c}))}return l}function In(i,e,t,n="panel",s=0){const r=t+o(6);return[{c:[i/2,-s*r/2,0],s:[i,r,e],tag:n}]}const Lo={UP_ALONG_X:[[1,1,1],2*Math.PI/3],DOWN_ALONG_X:[[-1,1,-1],2*Math.PI/3],FLAT_AFT:[[0,1,0],Math.PI]};function oi(i,e,t=o(15)){return yo([0,0,-e/2],[0,0,e/2],t,i.hinge)}function Uv(i,e,t=o(15)){return yo([-e/2,0,0],[e/2,0,0],t,i.hinge)}const mn=o(110),jt=o(60),ho=o(1360),uo=o(610),Nv=o(610),Ov=o(240),Fv=o(400),ut={d:o(654),w:o(591),h:o(693)},Ht={d:o(345),w:o(315),h:o(537)},el=-o(353),Vn=o(466),yi=o(230),ks=o(945),yr=o(368),zv=o(527),tl=o(330),nl=jt+Ht.d/2,Ps=o(870),Ld=o(250),_i=o(1740),kr=o(1400),Bv=-o(940),Bt=o(475),dn=o(1300),un=o(32),Hv={id:"sound-system",title:"Sound System",tagline:"the deck is the riser, the flanks are the stacks",crowd:"behind the tail",build:Gv};function Gv(i){const{rig:e,lib:t}=i;e.setStages(["sides down, jacks in","trays glide out","legs down, light frame swings up","feet out, booth fascia stands","fascia extends, mid-tops wind up","counter over, tops tip upright","end cheeks up"]);const n=e.add({id:"floor",parent:null,label:"subframe + stage floor",joint:"fixed",static:!0,mass:36,com:[0,mn/2,0],hulls:Yr(mn)});e.attach(n.id,qr(t,{height:mn})),e.attach(n.id,Vv(t)),e.attach(n.id,Wv(t)),jr(e,i,{left:"hang",right:"hang",tail:"flat",stage:0});for(const c of[-1,1])for(const h of[-1,1])$r(e,t,{id:`jack-${c>0?"f":"r"}${h>0?"r":"l"}`,at:[c*o(880),-o(70),h*o(660)],stage:0});for(const[c,h]of[["l",-1],["r",1]]){const d=e.add({id:`tray-${c}`,parent:"floor",label:`${c==="l"?"left":"right"} speaker tray`,pivot:[Ov,mn,h*Fv],joint:"slide",axis:[0,0,h],range:[0,Nv],stage:1,mass:69,com:[el,jt+ut.h/2,0],hulls:[{c:[0,jt/2,0],s:[ho,jt,uo],tag:"tray"},{c:[el,jt+ut.h/2,0],s:[ut.d,ut.h,ut.w],tag:"DXS15XLF + well"},{c:[Vn,jt+ks/2,yi],s:[o(64),ks,o(64)],tag:"lift post"},{c:[Vn,jt+ks/2,-yi],s:[o(64),ks,o(64)],tag:"lift post"}],mates:[`gate-${c==="l"?"left":"right"}`],note:"LAMP 3509-24 over-travel slides; the load stays in shear the whole way out"});e.attach(d.id,jv(t));for(const[p,_]of[["a",-o(650)],["b",o(20)]]){const v=e.add({id:`tray-leg-${c}${p}`,parent:`tray-${c}`,label:"tray leg",pivot:[_,o(30),h*o(250)],joint:"hinge",axis:[0,0,1],range:[0,-Math.PI/2],stage:2,mass:3.2,com:[o(310),0,0],hulls:[{c:[o(310),0,0],s:[o(620),o(48),o(48)],tag:"leg"}],mates:[`tray-${c}`]});e.attach(v.id,$v(t,o(620)));const g=e.add({id:`tray-foot-${c}${p}`,parent:`tray-leg-${c}${p}`,label:"adjustable foot",pivot:[o(420),0,0],joint:"telescope",axis:[1,0,0],range:[0,o(180)],stage:3,mass:1.1,com:[o(120),0,0],footprint:[o(380),0,0],hulls:[{c:[o(100),0,0],s:[o(200),o(38),o(38)],tag:"foot"}],mates:["ground",`tray-leg-${c}${p}`,`tray-${c}`]});e.attach(g.id,Kv(t))}const u=e.add({id:`top-lift-${c}`,parent:`tray-${c}`,label:"mid-top carriage",pivot:[Vn,yr,0],joint:"slide",axis:[0,1,0],range:[0,zv],stage:4,mass:6,com:[-o(60),0,0],hulls:[{c:[0,0,yi],s:[o(150),o(190),o(90)],tag:"carriage"},{c:[0,0,-yi],s:[o(150),o(190),o(90)],tag:"carriage"}],mates:[`tray-${c}`],note:"winds up on a 2:1 strap — 20 kg at the handle becomes 10"});e.attach(u.id,qv(t));const f=e.add({id:`top-${c}`,parent:`top-lift-${c}`,label:"mid-top (tip upright)",pivot:[0,0,0],joint:"hinge",axis:[0,0,1],range:[0,Math.PI/2],stage:5,mass:17.9,com:[tl-Vn,nl-yr,0],hulls:[{c:[tl-Vn,nl-yr,0],s:[Ht.h,Ht.d,Ht.w],tag:"DZR10"}],mates:[`top-lift-${c}`,`tray-${c}`],note:"acoustic centre lands 1665 mm over the road — ear height for a standing crowd"});e.attach(f.id,Yv(t))}const s=e.add({id:"mast",parent:"floor",label:"light T-frame (単管 φ48.6)",pivot:[Ps,mn+Ld,0],joint:"hinge",axis:[0,0,1],range:[0,-Math.PI/2],stage:2,mass:19,com:[-_i*.6,0,0],hulls:[{c:[-_i/2,0,0],s:[_i,o(56),o(56)],tag:"mast"},{c:[-_i+o(30),0,0],s:[o(60),o(56),kr],tag:"crossbar"},{c:[-_i+o(230),0,0],s:[o(400),o(200),kr-o(160)],tag:"fixtures"}],mates:["floor"],note:"2.08 kg/m of certified scaffold pipe instead of ¥85,000 of crank-up stand"});e.attach(s.id,Xv(t));const r=e.add({id:"booth-lower",parent:"floor",label:"booth fascia (lower)",pivot:[Bv,mn,0],joint:"hinge",axis:[0,0,1],range:[0,Math.PI/2],stage:3,mass:10,com:[Bt/2,0,0],hulls:In(Bt,dn,un,"fascia",-1),mates:["floor","gate-tail"]});e.attach(r.id,Xn(t,Bt,dn,un,{face:t.aluDark,anchorY:-1})),e.attach(r.id,oi(t,dn)),e.attach(r.id,Jv(t));const a=e.add({id:"booth-upper",parent:"booth-lower",label:"booth fascia (upper)",pivot:[Bt,un,0],joint:"hinge",axis:[0,0,1],range:[Math.PI,0],stage:4,mass:10,com:[Bt/2,0,0],hulls:In(Bt,dn,un,"fascia",1),mates:["booth-lower"]});e.attach(a.id,Xn(t,Bt,dn,un,{face:t.aluDark,anchorY:1})),e.attach(a.id,oi(t,dn)),e.attach(a.id,Th(t,[o(70),-un,dn/2-o(110)])),e.attach(a.id,Th(t,[o(70),-un,-dn/2+o(110)]));const l=e.add({id:"counter",parent:"booth-upper",label:"DJ counter",pivot:[Bt,-un,0],joint:"hinge",axis:[0,0,1],range:[Math.PI,Math.PI*1.5],stage:5,mass:12,com:[Bt/2,0,0],hulls:In(Bt,dn,un,"counter",-1),mates:["booth-upper"],note:"lands 982 mm above the stage floor — standing height for the DJ"});e.attach(l.id,Xn(t,Bt,dn,un,{anchorY:-1})),e.attach(l.id,oi(t,dn)),e.attach(l.id,Qv(t));for(const[c,h]of[["l",-1],["r",1]]){const d=e.add({id:`cheek-${c}`,parent:"booth-upper",label:"booth end cheek",pivot:[0,-un,h*(dn/2-o(30))],joint:"hinge",axis:[1,0,0],range:[0,-h*Math.PI/2],stage:6,mass:3,com:[Bt*.4,0,h*-Bt*.25],hulls:[{c:[Bt*.5,0,h*-o(60)],s:[Bt,o(36),o(120)],tag:"cheek"},{c:[Bt*.78,0,h*-o(210)],s:[Bt*.44,o(36),o(180)],tag:"cheek"}],mates:["booth-upper","counter","booth-lower"]});e.attach(d.id,Zv(t,h))}return{massBudget:[["subframe + stage floor",36],["trays, slides, drop legs and feet",50],['subwoofers (2 × 18") + capture wells',93],["mid-tops (2), lift posts, carriages",58],["light T-frame: pipe, bases, clamps, fixtures",36],["booth: fascia, counter, cheeks",28],["stabiliser jacks (4)",18],["power, control, cable",28]],notes:["NO AMPLIFIERS. Every box on this truck is active — the PRX918XLF carries 2000 W of fanless Class D with 6-band PEQ, delay and a selectable crossover; the DZR10 carries 2000 W bi-amped with a 96 kHz FIR crossover. There is no rack amp, no external processor and no speakON cable anywhere in the build. The passive alternative prices out the same, weighs 13 kg more and gives each box a third of the power.","What IS still needed is the part people forget: NONE of these boxes has an AC thru. They daisy-chain signal and never power, so four boxes means four outlets — two earth-leakage cord reels, which is also how you get two circuits. A steel truck body feeding metal-grilled boxes standing on wet ground is the case the 漏電遮断器 exists for. The hum loop gets lifted at the DI, never at the mains earth.","The 18-inch box was free on payload and expensive on geometry. A PRX918XLF is 0.7 kg heavier than the DXS15XLF it replaces and goes three hertz deeper, but it is 591 across — so the trays grew from 570 to 610 and the deck now closes at 610 + 610 + a 190 mm centre channel, exactly 1410.","And it evicted the mid-top from its roof. Tray 60 plus 693 plus a DZR10 lying on top is 1208 above the deck against a 1120 ceiling. The tops now travel flat in the bay forward of the sub and wind up two posts on a strap.","NOTHING STANDS ON THE CAB ROOF. It is 0.7 mm of steel over three hoops with no threaded provision anywhere, and the failure mode is the overturning moment, not the pressure — a 1.5 m mast with 5 kg on top needs one gust to put 75 N·m into a panel that oil-cans under a hand. There is a rated carrier for this truck, a TUFREQ KF326A+ at 50 kg, and that rating is for distributed vertical load through the gutters: it is a shelf, not a foundation.","So the light frame clears the roof entirely — a rigid T of φ48.6 scaffold pipe off a base plate through-bolted to the front crossmember, standing its crossbar 770 mm above the cab roof line. One moving part, one pipe joint, about ¥1,200 of pipe where the crank-up stand was ¥85,000.","The fixtures never roll on their clamps. They point along the mast toward its foot, which is forward along the deck while the frame is flat and straight down once it is up: the quarter turn that stands the mast up is the same quarter turn that aims the lights.","Four jacks take the truck off its leaf springs. Without them the whole vehicle rolls the moment the DJ shifts weight — and the DJ’s own 75 kg is carried by the jacks, not the axles."]}}function Vv(i){const e=new _e;for(let t=-2;t<=2;t++)e.add(N([o(120),o(6),o(900)],i.aluDark,{pos:[t*o(300)-o(200),mn+o(3),0]}));return e.add(N([o(700),o(26),o(180)],i.aluDark,{pos:[o(500),mn-o(2),0]})),e}function Wv(i){const e=new _e,t=mn+Ld;e.add(N([o(280),o(14),o(280)],i.galv,{pos:[Ps,mn+o(7),0]})),e.add(N([o(121),t-mn-o(30),o(121)],i.aluDark,{anchor:[0,-1,0],pos:[Ps,mn+o(14),0]})),e.add(N([o(150),o(20),o(150)],i.galv,{pos:[Ps,t-o(24),0]}));for(const n of[-1,1])e.add(tt([Ps,t,n*o(40)],[Ps+o(90),mn+o(980),n*o(520)],o(16),i.steelRod));return e}function Xv(i){const e=new _e,t=new je(new Wt(o(24.3),o(24.3),_i,14),i.galv);t.rotation.z=Math.PI/2,t.position.x=-_i/2,e.add(t),e.add(N([o(150),o(56),o(56)],i.aluDark,{pos:[-o(900),0,0]}));const n=-_i+o(30),s=new je(new Wt(o(24.3),o(24.3),kr,14),i.galv);s.position.set(n,0,0),e.add(s),e.add(N([o(110),o(100),o(110)],i.aluDark,{pos:[n,0,0]})),e.add(N([o(115),o(85),o(1060)],i.aluDark,{pos:[n+o(80),0,0]})),e.add(N([o(90),o(26),o(1e3)],i.ledCyan,{pos:[n+o(122),0,0]}));for(let r=0;r<4;r++){const a=-kr/2+o(180)+r*o(346);e.add(N([o(45),o(110),o(60)],i.galv,{pos:[n+o(30),0,a]})),e.add(N([o(180),o(193),o(89)],i.aluDark,{pos:[n+o(170),0,a]})),e.add(N([o(30),o(150),o(70)],r%2?i.ledMagenta:i.ledWarm,{pos:[n+o(256),0,a]}));const l=new ci(r%2?16727214:16757575,3.4,8,2);l.position.set(n+o(340),0,a),e.add(l),e.add(kv(i,[n+o(40),o(30),a],[n+o(160),o(80),a],{radius:o(3)}))}return e}function jv(i){const e=new _e;e.add(N([ho,jt,uo],i.aluDark,{anchor:[0,-1,0]})),e.add(N([ho-o(40),o(8),uo-o(40)],i.alu,{pos:[0,jt,0]}));for(const r of[-1,1])e.add(Ti([-ho/2,jt/2,r*(uo/2-o(30))],[ho/2,jt/2,r*(uo/2-o(30))],o(44),i.alu));const t=el,n=new _e;n.position.set(t,jt,0);for(const r of[-1,1])n.add(N([ut.d+o(40),o(150),o(18)],i.ply,{anchor:[0,-1,0],pos:[0,0,r*(ut.w/2+o(9))]}));n.add(N([o(18),o(150),ut.w+o(36)],i.ply,{anchor:[0,-1,0],pos:[-ut.d/2-o(9),0,0]})),e.add(n);const s=new _e;s.position.set(t,jt,0),s.add(N([ut.d,ut.h,ut.w],i.speakerBox,{anchor:[0,-1,0]})),s.add(N([o(24),ut.h-o(90),ut.w-o(70)],i.speakerGrille,{pos:[-ut.d/2-o(6),ut.h/2+o(20),0]})),s.add(N([o(30),o(110),ut.w-o(180)],i.trim,{pos:[-ut.d/2-o(10),o(90),0]}));for(const r of[-1,1])s.add(N([o(140),o(50),o(22)],i.aluDark,{pos:[0,ut.h-o(140),r*(ut.w/2+o(4))]})),s.add(N([o(190),o(34),o(26)],i.plyEdge,{pos:[0,ut.h-o(140),r*(ut.w/2+o(16))]}));s.add(N([ut.d-o(60),o(14),ut.w-o(60)],i.aluDark,{pos:[0,ut.h,0]})),s.add(N([o(56),o(16),o(56)],i.galv,{pos:[0,ut.h+o(8),0]})),s.add(N([o(26),ut.h+o(30),ut.w+o(40)],i.trim,{pos:[o(180),ut.h/2,0]})),e.add(s);for(const r of[-1,1]){const a=r*yi;e.add(N([o(150),o(16),o(150)],i.galv,{pos:[Vn,jt,a]})),e.add(N([o(64),ks,o(64)],i.alu,{anchor:[0,-1,0],pos:[Vn,jt,a]})),e.add(N([o(90),o(30),o(90)],i.aluDark,{pos:[Vn,jt+ks,a]}))}return e.add(N([o(120),o(90),o(70)],i.aluDark,{pos:[Vn,jt+o(120),yi+o(70)]})),e}function qv(i){const e=new _e;for(const t of[-1,1]){const n=t*yi;e.add(N([o(150),o(190),o(90)],i.aluDark,{pos:[0,0,n]})),e.add(tt([0,0,n-t*o(45)],[0,0,t*(Ht.w/2-o(10))],o(11),i.steelRod))}return e.add(N([o(90),o(26),2*yi-o(120)],i.galv,{pos:[-o(60),-o(130),0]})),e}function Yv(i){const e=new _e,t=new _e;t.position.set(tl-Vn,nl-yr,0),t.add(N([Ht.h,Ht.d,Ht.w],i.speakerBox)),t.add(N([Ht.h-o(60),o(20),Ht.w-o(50)],i.speakerGrille,{pos:[o(10),Ht.d/2+o(5),0]})),t.add(N([o(90),o(24),Ht.w-o(140)],i.trim,{pos:[-Ht.h/2+o(70),Ht.d/2+o(8),0]}));for(const n of[-1,1])for(const s of[-o(150),o(0),o(150)])t.add(N([o(26),o(26),o(10)],i.galv,{pos:[s,0,n*(Ht.w/2+o(3))]}));return t.add(N([Ht.h-o(180),o(18),Ht.w-o(120)],i.aluDark,{pos:[0,-Ht.d/2-o(6),0]})),e.add(t),e}function $v(i,e){const t=new _e;return t.add(N([e,o(48),o(48)],i.alu,{anchor:[-1,0,0]})),t.add(N([o(70),o(64),o(64)],i.aluDark,{pos:[o(20),0,0]})),t.add(tt([o(40),o(38),0],[o(190),o(14),0],o(9),i.steelRod)),t}function Kv(i){const e=new _e;return e.add(N([o(380),o(38),o(38)],i.aluDark,{anchor:[-1,0,0]})),e.add(N([o(22),o(160),o(160)],i.aluDark,{pos:[o(371),0,0]})),e.add(N([o(14),o(180),o(180)],i.rubberFoot,{pos:[o(387),0,0]})),e}function Zv(i,e){const t=new _e,n=Bt,s=new Ji;s.moveTo(0,0),s.lineTo(n,0),s.lineTo(n,-n*.92),s.lineTo(n*.72,-n*.92),s.closePath();const r=new Io(s,{depth:o(28),bevelEnabled:!1});r.rotateX(Math.PI/2),e<0&&r.scale(1,1,-1),r.computeVertexNormals();const a=new je(r,i.aluDark);return a.castShadow=!0,a.receiveShadow=!0,t.add(a),t}function Jv(i){const e=new _e;for(let t=0;t<5;t++){const n=o(70)+t*o(85);e.add(N([o(40),un+o(10),dn-o(160)],t%2?i.ledCyan:i.ledMagenta,{pos:[n,0,0]}))}return e}function Qv(i){const e=new _e,t=un/2;e.add(N([o(273),o(14),o(482)],i.trim,{pos:[o(230),t-o(4),-o(120)]})),e.add(N([o(273),o(59),o(482)],i.trim,{pos:[o(230),t+o(28),-o(120)]}));for(const n of[-1,1]){const s=new je(new Wt(o(84),o(84),o(10),22),i.chrome);s.position.set(o(180),t+o(60),-o(120)+n*o(170)),e.add(s)}for(let n=0;n<8;n++)e.add(N([o(24),o(10),o(20)],n%2?i.ledWarm:i.ledCyan,{pos:[o(310),t+o(60),-o(280)+n*o(45)]}));e.add(N([o(294),o(71),o(244)],i.trim,{pos:[o(240),t+o(34),o(320)]}));for(let n=0;n<5;n++)e.add(N([o(18),o(8),o(16)],i.ledCyan,{pos:[o(200),t+o(72),o(240)+n*o(40)]}));for(const n of[-o(120),o(320)])e.add(tt([o(90),t+o(70),n-o(260)],[o(90),t+o(70),n+o(260)],o(9),i.chrome));return e}const Ke=o(60),Dd=-o(580),fn={z0:-o(385),z1:o(45)},en={z0:o(45),z1:o(565)},Us=o(250),ro=o(500),ex=o(370),wo=o(430),wr=o(1500),tx=o(180),nx=-o(680),Ur=o(34),gi=-o(840),Mo=o(140),Vi=Ke+o(320),Gt=o(700),on=o(900),ti=o(40),ao=o(680),ix=o(320),Id=o(870),Ns=o(1750),yl=Ke+o(220),kd=yl+o(80),Bn=o(1850),Wi=o(1300),$i=o(1500),sx={id:"yatai",title:"Yatai",tagline:"the bed is the kitchen; the table is a road behind it",build:ox};function ox(i){const{rig:e,lib:t}=i;e.setStages(["kerb side down, jacks in","table falls out of the tail, first post rises","second leaf out, second post rises","third leaf, header across, pass drops","table legs down, awning rolls out","arms, valance, prep shelf"]);const n=e.add({id:"floor",parent:null,label:"subframe + galley",joint:"fixed",static:!0,mass:122,com:[o(400),Ke+o(220),o(80)],hulls:[...Yr(Ke),{c:[-o(300),Ke+Us/2,(fn.z0+fn.z1)/2],s:[o(1e3),Us,fn.z1-fn.z0],tag:"sink counter"},{c:[o(557),Ke+o(95),(fn.z0+fn.z1)/2],s:[o(595),o(190),o(358)],tag:"griddle"},{c:[-o(630),Ke+o(120),(en.z0+en.z1)/2],s:[o(340),o(240),o(320)],tag:"hand basin"},{c:[-o(164),Ke+o(205),(en.z0+en.z1)/2],s:[o(593),o(410),o(345)],tag:"fridge"},{c:[o(333),Ke+ro/2,(en.z0+en.z1)/2],s:[o(400),ro,o(380)],tag:"supply tank"},{c:[o(733),Ke+ro/2,(en.z0+en.z1)/2],s:[o(400),ro,o(380)],tag:"waste tank"},{c:[gi,(Ke+Vi)/2,Mo],s:[o(90),Vi-Ke,o(850)],tag:"table posts"}]});e.attach(n.id,qr(t,{height:Ke})),e.attach(n.id,cx(t)),jr(e,i,{left:"hang",right:"flat",tail:"hang",stage:0});for(const f of[-1,1])for(const p of[-1,1])$r(e,t,{id:`jack-${f>0?"f":"r"}${p>0?"r":"l"}`,at:[f*o(880),-o(70),p*o(660)],stage:0});for(const[f,p,_,v]of[["a",-1,kd,[.14,.34]],["b",1,yl,[.35,.54]]]){const g=e.add({id:`post-${f}`,parent:"floor",label:"stall post",window:v,pivot:[p*Id,_,Dd],joint:"hinge",axis:[0,0,1],rest:p>0?[[0,1,0],Math.PI]:null,range:[0,p<0?Math.PI/2:-Math.PI/2],stage:1,mass:9,com:[Ns/2,0,0],hulls:[{c:[Ns/2,0,0],s:[Ns,o(64),o(64)],tag:"post"}],mates:["floor","post-a","post-b"],note:"1750 mm — the longest post that lies on a 1940 mm deck"});e.attach(g.id,hx(t))}const s=e.add({id:"header",parent:"post-a",label:"header beam",pivot:[Ns-o(60),o(110),o(120)],joint:"hinge",rest:[[0,0,1],Math.PI],axis:[0,0,1],range:[0,Math.PI/2],window:[.55,.72],mass:12,com:[Bn/2,0,0],hulls:[{c:[Bn/2,0,0],s:[Bn,o(80),o(90)],tag:"header"}],mates:["post-a","post-b"]});e.attach(s.id,dx(t)),e.attach(s.id,px(t));const r=e.add({id:"awning",parent:"header",label:"cassette awning",pivot:[Bn/2+o(75),o(90),0],joint:"slide",axis:[0,0,-1],range:[0,Wi],window:[.72,.88],mass:22,com:[0,0,Wi/2],hulls:[{c:[0,-o(30),0],s:[$i,o(120),o(120)],tag:"leading rail"}],mates:["header"],note:"a roller, not a folding panel — there is no flat 1.1 m left on the deck"});e.attach(r.id,ux(t));const a=fx(t);a.position.set(Bn/2+o(75),o(90),0),e.attach("header",a);for(const[f,p]of[["l",-1],["r",1]]){const _=e.add({id:`awning-arm-${f}`,parent:"header",label:"lateral arm",pivot:[Bn/2+p*o(700),p>0?-o(70):0,0],joint:"hinge",axis:[0,1,0],rest:p>0?[[0,1,0],Math.PI]:null,range:[0,p>0?-Math.PI/2:Math.PI/2],window:[.86,1],mass:4,com:[o(560),0,0],hulls:[{c:[o(560),0,0],s:[o(1120),o(50),o(50)],tag:"arm"}],mates:["header","awning","awning-arm-l","awning-arm-r"],note:"the awning is a cantilever; the arm is what makes it a triangle"});e.attach(_.id,Ah(t,o(1120)))}const l=e.add({id:"counter",parent:"floor",label:"customer counter",pivot:[tx,ex,nx],joint:"hinge",axis:[1,0,0],rest:Lo.UP_ALONG_X,range:[0,-Math.PI/2],window:[.55,.74],mass:19,com:[wo/2,0,0],hulls:In(wo,wr,Ur,"counter"),mates:["floor","gate-left"],note:"1030 above the tarmac, 60 above the worktop — the step a yatai counter has"});e.attach(l.id,mx(t));for(const[f,p]of[["l",-1],["r",1]]){const _=e.add({id:`counter-bracket-${f}`,parent:"counter",label:"counter bracket",pivot:[o(280),Ur/2,p*o(560)],joint:"hinge",axis:[0,0,1],range:[Math.PI,Math.PI+ii(140)],window:[.74,.88],mass:1.8,com:[o(170),0,0],hulls:[{c:[o(175),0,0],s:[o(350),o(40),o(40)],tag:"bracket"}],mates:["counter","floor"]});e.attach(_.id,Ah(t,o(350)))}const c=e.add({id:"table-a",parent:"floor",label:"serving table (first leaf)",pivot:[gi,Vi,Mo],joint:"hinge",axis:[0,0,1],rest:[[0,0,1],Math.PI/2],range:[0,Math.PI/2],window:[.15,.31],mass:15,com:[Gt/2,0,0],hulls:In(Gt,on,ti,"leaf",-1),mates:["floor","gate-tail"],note:"the stack stands 1020 off the deck packed, 100 under the cab roof"});e.attach(c.id,Xn(t,Gt,on,ti,{face:t.ply,anchorY:-1})),e.attach(c.id,oi(t,on));const h=e.add({id:"table-b",parent:"table-a",label:"serving table (second leaf)",pivot:[Gt,-ti,0],joint:"hinge",axis:[0,0,1],range:[-Math.PI,0],window:[.31,.46],mass:15,com:[Gt/2,0,0],hulls:In(Gt,on,ti,"leaf",-1),mates:["table-a"]});e.attach(h.id,Xn(t,Gt,on,ti,{face:t.ply,anchorY:-1})),e.attach(h.id,oi(t,on));const d=e.add({id:"table-c",parent:"table-b",label:"serving table (draw leaf)",pivot:[0,ti+o(6),0],joint:"slide",axis:[1,0,0],range:[0,Gt],window:[.48,.64],mass:15,com:[Gt/2,0,0],hulls:[{c:[Gt/2,o(4),0],s:[Gt,ti+o(6),on-o(60)],tag:"draw leaf"}],mates:["table-b"],note:"nests under the second leaf and draws 700 aft on a pair of rails"});e.attach(d.id,rx(t)),e.attach(d.id,lx(t));for(const[f,p]of[["table-leg-a","table-b"],["table-leg-b","table-c"]])for(const _ of[-1,1]){const v=e.add({id:`${f}${_>0?"r":"l"}`,parent:p,label:"table leg",pivot:[Gt-o(20),0,_*(on/2+o(30))],joint:"hinge",axis:[0,0,1],range:[Math.PI/2,0],window:[.7,.84],mass:3.5,com:[0,ao/2,0],hulls:[{c:[0,ao/2,0],s:[o(46),ao,o(46)],tag:"leg"}],mates:[p]}),g=Pd(t,ao,{section:o(46),foot:o(.1)});g.rotation.x=Math.PI,e.attach(v.id,g);const m=e.add({id:`${v.id}-foot`,parent:v.id,label:"adjustable foot",pivot:[0,ao-o(380),0],joint:"telescope",axis:[0,1,0],range:[0,ix],window:[.84,.94],mass:1.2,com:[0,o(180),0],footprint:[0,o(380),0],hulls:[{c:[0,o(190),0],s:[o(36),o(380),o(36)],tag:"foot"}],note:"the leg is 680 and the drop is 1000 — the difference telescopes",mates:["ground",v.id,p]}),y=new _e;y.add(N([o(36),o(380),o(36)],t.aluDark,{anchor:[0,-1,0]})),y.add(N([o(140),o(16),o(140)],t.aluDark,{pos:[0,o(388),0]})),y.add(N([o(160),o(14),o(160)],t.rubberFoot,{pos:[0,o(400),0]})),e.attach(m.id,y)}e.attach("floor",ax(t));const u=e.add({id:"back-shelf",parent:"floor",label:"prep shelf",pivot:[o(400),Ke+ro-o(20),en.z1+o(30)],joint:"hinge",axis:[1,0,0],rest:Lo.DOWN_ALONG_X,range:[0,-Math.PI/2],window:[.86,1],mass:7,com:[o(190),0,0],hulls:In(o(380),o(1e3),o(28),"shelf"),mates:["floor"]});return e.attach(u.id,Xn(t,o(380),o(1e3),o(28),{face:t.stainless})),{bom:"yatai",update(f,p){var v;const _=((v=p.get("awning"))==null?void 0:v.q)??0;a.scale.z=Math.max(.02,_/Wi)},massBudget:[["subframe + sink counter (fabricated)",32],["IKK TKO18321 griddle + Iwatani plate",41],["water hardware: 2 tanks, hand basin, pump, tap",7],["water itself, 20 L supply + 20 L waste",40],["fridge + LiFePO4 and inverter",27],["LP gas: bottle, locker, regulator, hose",28],["stall frame: posts, header, cassette, arms",29],["serving table: 3 leaves, 4 legs, tail posts",58],["cook’s pass, noren, chochin, boards",22],["stabiliser jacks (4)",18]],notes:["The cook stands on the tarmac, not on the deck. 1120 mm of packing headroom means anything you can stand under is taller than the cab roof — so the bed itself is the galley, and the equipment simply stands on it.","Nothing is built up to a working height except the prep counter, because a drop-in gastronorm needs something to drop into. The griddle plate lands at 850 above the road on its own feet, the fridge top at 1070, the tank tops at 1160.","The serving is off the BACK. A counter down the kerb side puts the queue where the cook is working; 1400 mm of table off the tail plus a 700 mm draw leaf puts it behind the truck, facing the kitchen, off the road.","The third leaf DRAWS instead of folding. A leaf on a 700 mm arm sweeps a half circle to get in line, and the leaf folded onto it rides that circle straight across the first one — 171 mm into it, whichever way the pins are stepped. An extending dining table has solved this for four hundred years.","No extract. An open-air stall with the sky over the griddle does not need the hood, the grease filter, the 150 mm duct and the 200 mm 有圧換気扇 that a closed kitchen car needs. That deletion, the galley carcass it made unnecessary and a valance that turned out to be fabric are 34 of the 58 kg the table costs.","ONE BASIN, NOT THREE, and it is worth being exact about why. The 三槽シンク — two wash compartments plus a separate hand-wash — is a FIXED-PREMISES rule, and the 40 / 80 / 200 L supply tiers are the 自動車営業 (kitchen-car) tiers. A 露店 is neither. What a stall has to carry is a hand-wash basin with running water at the cook, and that is all; the bowls, the tongs and the plates go back dirty to a licensed 基地施設 and are washed there.","That single correction is the cheapest 40 kg in the whole project. Two stainless wash bowls, two taps and half the water come off, and the tanks now run 20 L supply and 20 L waste instead of 40 and 40 — 40 kg of payload handed back, which is more than the serving table costs. The 基地施設 is not optional in exchange: no premises, no licence.","The menu follows from it. A stall permit is a 直前加熱 permit — reheat and assemble, serve straight into disposable containers, no raw handling and no holding. Takoyaki, yakisoba, karaage, oden. Which is a yatai menu, so the restriction costs nothing at all.","The gas bottle is outside the body in a vented locker off the rear crossmember, because the rule wants it upright, vented at low level, and 2 m from any flame — and on a 1940 mm deck with a griddle on it, 2 m does not exist."]}}function rx(i){const e=new _e;e.add(N([Gt,ti,on-o(60)],i.ply,{anchor:[-1,-1,0],pos:[0,o(6),0]}));for(const t of[-1,1])e.add(Ti([0,o(30),t*(on/2-o(90))],[Gt,o(30),t*(on/2-o(90))],o(40),i.alu));return e.add(N([o(36),ti+o(40),on-o(60)],i.alu,{pos:[Gt-o(18),o(6),0]})),e}function ax(i){const e=new _e;for(const t of[-1,1]){const n=Mo+t*o(380);e.add(N([o(90),Vi-Ke,o(90)],i.aluDark,{anchor:[0,-1,0],pos:[gi,Ke,n]})),e.add(N([o(200),o(16),o(200)],i.galv,{pos:[gi,Ke+o(8),n]})),e.add(tt([gi,Vi-o(40),n],[gi+o(300),Ke+o(20),n],o(16),i.steelRod))}return e.add(Ti([gi,Vi,Mo-o(380)],[gi,Vi,Mo+o(380)],o(70),i.alu)),e}function lx(i){const e=new _e;for(const t of[-1,1]){e.add(N([Gt-o(80),o(16),o(22)],i.ledWarm,{pos:[Gt/2,-o(14),t*(on/2-o(14))]}));const n=new ci(16759147,1.8,2.4,2);n.position.set(Gt/2,-o(40),t*(on/2-o(20))),e.add(n)}return e}function cx(i){const e=new _e,t=(fn.z0+fn.z1)/2,n=(en.z0+en.z1)/2,s=Ke+Us;e.add(N([o(1e3),Us-o(24),fn.z1-fn.z0],i.ply,{pos:[-o(300),Ke+(Us-o(24))/2,t]})),e.add(N([o(1030),o(24),fn.z1-fn.z0+o(24)],i.stainless,{pos:[-o(300),s-o(12),t]}));for(let h=0;h<3;h++){const d=-o(640)+h*o(300);e.add(N([o(250),o(24),o(320)],i.stainless,{pos:[d,s-o(12),t]})),e.add(N([o(224),o(120),o(294)],i.trim,{pos:[d,s-o(76),t]}))}e.add(N([o(330),o(215),o(175)],i.trim,{pos:[-o(740),Ke+o(110),t]}));const r=o(557);e.add(N([o(595),o(190),o(358)],i.trim,{anchor:[0,-1,0],pos:[r,Ke,t]})),e.add(N([o(575),o(24),o(338)],i.griddle,{pos:[r,Ke+o(190),t]}));for(let h=0;h<3;h++){const d=r-o(190)+h*o(190);if(h===0)for(let u=0;u<3;u++)for(let f=0;f<6;f++){const p=new je(new Wr(o(19),8,5,0,Math.PI*2,0,Math.PI/2),i.trim);p.rotation.x=Math.PI,p.position.set(d-o(50)+u*o(46),Ke+o(203),t-o(130)+f*o(52)),e.add(p)}else e.add(N([o(170),o(8),o(310)],i.trim,{pos:[d,Ke+o(206),t]}))}e.add(N([o(600),o(20),o(300)],i.ply,{pos:[o(120),s+o(10),t]})),e.add(N([o(340),o(240),o(320)],i.ply,{anchor:[0,-1,0],pos:[-o(630),Ke,n]})),e.add(N([o(320),o(30),o(230)],i.stainless,{pos:[-o(630),Ke+o(240),n]})),e.add(tt([-o(750),Ke+o(240),n],[-o(750),Ke+o(420),n],o(10),i.chrome)),e.add(N([o(593),o(410),o(345)],i.stainless,{anchor:[0,-1,0],pos:[-o(164),Ke,n]})),e.add(N([o(623),o(50),o(375)],i.ply,{anchor:[0,-1,0],pos:[-o(164),Ke,n]}));for(const[h,d]of[[o(333),n],[o(733),n]]){e.add(N([o(400),o(500),o(380)],i.rubberFoot,{anchor:[0,-1,0],pos:[h,Ke,d]})),e.add(N([o(430),o(60),o(410)],i.ply,{anchor:[0,-1,0],pos:[h,Ke,d]}));for(const f of[o(180),o(400)])e.add(N([o(420),o(26),o(400)],i.aluDark,{pos:[h,Ke+f,d]}));const u=new je(new Wt(o(50),o(50),o(30),12),i.aluDark);u.position.set(h,Ke+o(515),d),e.add(u)}e.add(Ti([-o(800),Ke+o(900),en.z1+o(10)],[o(900),Ke+o(900),en.z1+o(10)],o(44),i.alu));for(const h of[-o(740),o(840)])e.add(tt([h,Ke,en.z1+o(10)],[h,Ke+o(900),en.z1+o(10)],o(22),i.alu));const a=new _e;a.position.set(Me.bedRearOuter-o(200),-o(180),o(300)),a.add(N([o(380),o(680),o(380)],i.galv,{anchor:[0,1,0]}));for(let h=0;h<4;h++)e.add(N([o(300),o(14),o(20)],i.trim,{pos:[Me.bedRearOuter-o(200),-o(800)+h*o(30),o(492)]}));for(const h of[-1,1])e.add(N([o(200),h<0?kd:yl,o(200)],i.aluDark,{anchor:[0,-1,0],pos:[h*Id,0,Dd]}));const l=new je(new Wt(o(145),o(145),o(500),16),i.paintDark);l.position.set(0,-o(330),0),a.add(l),e.add(a);const c=new ci(16764826,6,3.4,2);return c.position.set(o(300),Ke+Us+o(180),fn.z0-o(120)),e.add(c),e}function hx(i){const e=new _e;return e.add(N([Ns,o(60),o(60)],i.alu,{anchor:[-1,0,0]})),e.add(N([o(30),o(180),o(180)],i.aluDark,{pos:[o(15),0,0]})),e.add(N([o(120),o(96),o(96)],i.aluDark,{pos:[Ns-o(60),0,0]})),e.add(oi(i,o(140),o(15))),e}function dx(i){const e=new _e;e.add(N([Bn,o(80),o(90)],i.alu,{anchor:[-1,0,0]})),e.add(N([o(120),o(110),o(120)],i.aluDark,{pos:[Bn-o(60),0,0]})),e.add(N([o(120),o(110),o(120)],i.aluDark,{pos:[o(60),0,0]}));const t=new je(new Wt(o(75),o(75),$i,14),i.aluDark);return t.rotation.z=Math.PI/2,t.position.set(Bn/2+o(75),o(90),0),e.add(t),e}function ux(i){const e=new _e;e.add(Ti([-$i/2,-o(30),0],[$i/2,-o(30),0],o(90),i.alu));for(const t of[-1,1])e.add(N([o(70),o(120),o(70)],i.aluDark,{pos:[t*($i/2-o(40)),-o(30),0]}));return e}function fx(i){const e=new _e,t=new je(new ss($i,Wi,8,6),i.canvasCream),n=t.geometry.attributes.position;for(let s=0;s<n.count;s++){const r=n.getX(s)/$i*2,a=(n.getY(s)+Wi/2)/Wi;n.setZ(s,-Math.cos(r*Math.PI)*o(18)*a-a*o(230))}return t.geometry.computeVertexNormals(),t.rotation.x=Math.PI/2,t.position.set(0,0,-Wi/2),t.receiveShadow=!0,t.castShadow=!0,e.add(t),e}function px(i){const e=new _e;for(let t=0;t<5;t++){const n=o(220)+t*(Bn-o(440))/4,s=t===2,r=o(s?190:130),a=o(s?430:330),l=new _e;l.position.set(n,-o(60),o(30)),l.add(tt([0,0,0],[0,-o(90),0],o(5),i.trim));const c=_n([[0,-a/2],[r*.58,-a*.32],[r*.96,-a*.14],[r,0],[r*.96,a*.14],[r*.58,a*.32],[0,a/2]],i.washi,{seg:14});c.position.y=-o(90)-a/2,l.add(c);const h=new ci(16757335,s?4.2:2.6,2.8,2);h.position.y=-o(90)-a/2,l.add(h),e.add(l)}return e}function mx(i){const e=new _e;e.add(Xn(i,wo,wr,Ur,{face:i.hinoki})),e.add(oi(i,wr)),e.add(N([o(48),o(54),wr-o(60)],i.alu,{pos:[wo-o(28),o(27),0]}));for(let t=-1;t<=1;t++){const n=_n([[0,0],[o(70),o(20)],[o(88),o(58)],[o(84),o(64)],[o(64),o(26)],[0,o(6)]],i.vermilion,{seg:16});n.position.set(wo*.42,Ur/2,t*o(440)),e.add(n)}return e}function Ah(i,e){const t=new _e;return t.add(N([e,o(44),o(44)],i.alu,{anchor:[-1,0,0]})),t.add(N([o(26),o(76),o(76)],i.aluDark,{pos:[o(14),0,0]})),t.add(N([o(26),o(64),o(64)],i.aluDark,{pos:[e-o(14),0,0]})),t}const Os=o(90),Wn=o(150),Vt={x0:-o(435),x1:o(835),z:o(430)},Ts=o(378),lo=o(28),tn={x:-o(930),z:o(620),h:o(1850),post:o(120)},wl=[-o(250),o(400)],Sn=o(480),Rh=o(330),bo=o(24),fo=o(1500),Fs=[o(300),o(300),o(300)],Ch=[ii(40),ii(28),ii(16)],gx=bo+o(14),Ud=o(420),Nd=-o(260),_x={id:"hokora",title:"Hokora",tagline:"a curved shrine roof, built from flat panels that fold",build:vx};function vx(i){const{rig:e,lib:t}=i;e.setStages(["tailgate down, jacks in","torii pillars rise","kasagi and nuki swing across","nuki across, shrine walls up","ridge posts telescope","the roof unrolls"]);const n=e.add({id:"floor",parent:null,label:"subframe + dais",joint:"fixed",static:!0,mass:62,com:[o(200),Os,0],hulls:[...Yr(Os),{c:[o(200),Wn-o(30),0],s:[Vt.x1-Vt.x0,o(60),Vt.z*2],tag:"dais"},{c:[Nd,Wn+o(200),0],s:[o(320),o(400),o(780)],tag:"offerings"}]});e.attach(n.id,qr(t,{height:Os,skin:t.hinoki})),e.attach(n.id,xx(t)),jr(e,i,{left:"hang",right:"hang",tail:"flat",stage:0});for(const d of[-1,1])for(const u of[-1,1])$r(e,t,{id:`jack-${d>0?"f":"r"}${u>0?"r":"l"}`,at:[d*o(880),-o(70),u*o(660)],stage:0});for(const[d,u]of[["l",-1],["r",1]]){const f=e.add({id:`pillar-${d}`,parent:"floor",label:"torii pillar",pivot:[tn.x,Os+o(170),u*tn.z],joint:"hinge",axis:[0,0,1],range:[0,Math.PI/2],stage:1,mass:15,com:[tn.h/2,0,0],hulls:[{c:[tn.h/2,0,0],s:[tn.h,tn.post,tn.post],tag:"pillar"}],mates:["floor","ground"],note:"sweeps 1850 mm; survivable only because it lies outboard of the shrine"});e.attach(f.id,yx(t))}const s=e.add({id:"kasagi",parent:"pillar-r",label:"kasagi (top lintel)",pivot:[tn.h-o(110),o(80),-o(75)],joint:"hinge",axis:[0,1,0],range:[0,-Math.PI/2],stage:2,mass:11,com:[-o(620),0,0],hulls:[{c:[-o(620),0,0],s:[o(1400),o(150),o(190)],tag:"kasagi"}],mates:["pillar-r","pillar-l"]});e.attach(s.id,wx(t));const r=e.add({id:"nuki",parent:"pillar-r",label:"nuki (tie beam)",pivot:[tn.h*.64,-o(80),-o(75)],joint:"hinge",axis:[0,1,0],range:[0,-Math.PI/2],window:[.42,.6],stage:3,mass:7,com:[-o(570),0,0],hulls:[{c:[-o(570),0,0],s:[o(1240),o(110),o(130)],tag:"nuki"}],mates:["pillar-r","pillar-l"]});e.attach(r.id,Mx(t));const a=e.add({id:"wall-back",parent:"floor",label:"back wall",pivot:[Vt.x1,Wn,0],joint:"hinge",axis:[0,0,1],rest:Lo.FLAT_AFT,range:[0,-Math.PI/2],stage:3,mass:8,com:[Ts/2,0,0],hulls:In(Ts,Vt.z*2-o(20),lo,"wall",-1),mates:["floor"]});e.attach(a.id,Xn(t,Ts,Vt.z*2-o(20),lo,{face:t.vermilion,anchorY:-1}));for(const[d,u]of[["l",-1],["r",1]]){const f=e.add({id:`wall-${d}`,parent:"floor",label:"side wall",pivot:[o(200),Wn+lo+o(6),u*Vt.z],joint:"hinge",axis:[1,0,0],rest:Lo.UP_ALONG_X,range:[-u*Math.PI/2,0],stage:3,mass:11,com:[Ts/2,0,0],hulls:In(Ts,Vt.x1-Vt.x0-o(30),lo,"wall",-1),mates:["floor","wall-back"],note:"390 mm tall because two of them have to fold onto a 900 mm floor and leave the posts a channel"});e.attach(f.id,Xn(t,Ts,Vt.x1-Vt.x0-o(30),lo,{face:t.vermilion,anchorY:-1}))}e.attach("floor",bx(t));let l="floor",c=[0,Wn+o(20),0];for(let d=1;d<=3;d++){const u=`post-${d}`;e.add({id:u,parent:l,label:`ridge post (stage ${d})`,pivot:c,joint:"telescope",axis:[0,1,0],range:[0,Rh],stage:4,mass:d===3?12:6,com:[o(200),Sn/2,0],hulls:wl.map(f=>({c:[f,Sn/2,0],s:[o(88),Sn,o(88)],tag:`post ${d}`})),mates:["floor","post-1","post-2","post-3"]}),e.attach(u,Sx(t,d)),l=u,c=[0,0,0]}e.attach("post-3",Ex(t));for(const[d,u]of[["l",-1],["r",1]]){let f="post-3",p=[0,Sn+o(40),u*o(120)];for(let _=0;_<Fs.length;_++){const v=`roof-${d}${_+1}`,g=_===0,m=_%2===0?-1:1;e.add({id:v,parent:f,label:`roof facet ${_+1}`,pivot:p,joint:"hinge",axis:g?[1,0,0]:[0,0,1],rest:g?[[0,1,0],u>0?-Math.PI/2:Math.PI/2]:null,range:g?[0,u*Ch[0]]:[Math.PI,ii(12)],stage:5,window:[.58+_*.135,.72+_*.135],mass:9,com:[Fs[_]/2,0,0],hulls:In(Fs[_],fo,bo,`facet ${_+1}`,m),mates:[f],note:`${Math.round(Ch[_]*180/Math.PI)}° below horizontal`}),e.attach(v,Tx(t,_,u,m)),f=v;const y=gx*(_+1);p=[Fs[_],m<0?y:-y,0]}}e.attach("kasagi",Ax(t)),e.attach("floor",Rx(t));const h=Px(t);return e.attach("post-3",h),{update(d,u){var v;const f=((v=u.parts.get("post-3"))==null?void 0:v.q)??0,p=Math.min(1,Math.max(0,f/Rh)),_=o(40)/Ud;for(const g of h.userData.chochin)g.scale.y=_+(1-_)*p;h.userData.rope.scale.y=.02+.98*p},massBudget:[["subframe + dais",62],["torii: pillars, kasagi, nuki",48],["shrine walls (3)",30],["ridge posts + beam",24],["roof: 6 folding facets",54],["fittings: bell, chochin, offerings, power",16],["stabiliser jacks (4)",18]],notes:["The roof curve is in the ANGLES, not the panels: three flat facets a side at 40°, 28° and 16°, stepping down twelve degrees at every joint. That is how a real roof does it too — straight boards over curved rafters.","Three facets, not four, and all the same length. A chain folding the same way is a roll, and in a roll each wrap reaches back over the one before it: with four, the fourth lands on the second. The audit found that, and the fix was one wrap fewer.","The torii is 1850 mm tall because that is the longest pillar that will lie on a 1940 mm deck, and 1240 mm wide because the pillars have to stow outboard of the shrine. Both numbers are the truck, not the drawing.","The pillars sweep an 1850 mm arc across the entire deck. Nothing but lateral separation saves that — they lie in the planes z = ±620 and the shrine stays inside ±450.","The lightest of the four by a long way. A shrine is mostly roof, and roof is mostly air."]}}function xx(i){const e=new _e,t=Vt.x1-Vt.x0;e.add(N([t,o(60),Vt.z*2],i.hinoki,{pos:[o(200),Wn-o(30),0]})),e.add(N([t+o(50),o(22),Vt.z*2+o(50)],i.hinoki,{pos:[o(200),Wn-o(56),0]})),e.add(N([o(220),o(46),Vt.z*2-o(200)],i.hinoki,{pos:[Vt.x0-o(120),Os+o(23),0]}));for(const n of[-1,1])e.add(N([o(300),o(170),o(300)],i.aluDark,{anchor:[0,-1,0],pos:[tn.x,Os,n*tn.z]}));return e}function yx(i){const e=new _e,t=_n([[o(72),0],[o(70),tn.h*.35],[o(64),tn.h*.72],[o(58),tn.h-o(60)],[o(52),tn.h]],i.vermilion,{seg:14});return t.rotation.z=-Math.PI/2,e.add(t),e.add(N([o(60),o(190),o(190)],i.vermilionDeep,{pos:[o(30),0,0]})),e}function wx(i){const e=new _e,t=o(1400),n=new _e;n.position.x=-t/2,n.add(N([t,o(96),o(190)],i.vermilion,{pos:[0,o(40),0]})),n.add(N([t-o(90),o(70),o(150)],i.vermilionDeep,{pos:[0,-o(26),0]}));for(const s of[-1,1])n.add(N([o(220),o(84),o(180)],i.vermilion,{pos:[s*(t/2-o(80)),o(66),0],rot:[0,0,-s*ii(9)]}));return e.add(n),e}function Mx(i){const e=new _e,t=o(1240);return e.add(N([t,o(96),o(130)],i.vermilionDeep,{pos:[-t/2,0,0]})),e.add(N([o(120),o(150),o(150)],i.vermilion,{pos:[-t,0,0]})),e}function bx(i){const e=new _e;for(const t of wl)e.add(N([o(110),Sn,o(110)],i.hinoki,{anchor:[0,-1,0],pos:[t,Wn,0]})),e.add(N([o(150),o(30),o(150)],i.copperTrim,{pos:[t,Wn+Sn,0]}));return e}function Sx(i,e){const t=new _e,n=o(92)-e*o(6);for(const s of wl)t.add(N([n,Sn,n],i.hinoki,{anchor:[0,-1,0],pos:[s,0,0]})),t.add(N([n+o(14),o(22),n+o(14)],i.copperTrim,{pos:[s,o(11),0]}));return t}function Ex(i){const e=new _e;e.add(N([o(1050),o(90),o(150)],i.hinoki,{pos:[o(75),Sn+o(20),0]}));for(let t=-1;t<=1;t++){const n=_n([[o(46),0],[o(54),o(90)],[o(46),o(180)]],i.copperTrim,{seg:10});n.rotation.x=Math.PI/2,n.position.set(o(75)+t*o(380),Sn+o(90),-o(90)),e.add(n)}for(const t of[-1,1])for(const n of[-1,1])e.add(tt([o(75)+t*o(560),Sn+o(10),0],[o(75)+t*o(700),Sn+o(420),n*o(150)],o(26),i.gold));return e}function Tx(i,e,t,n){const s=new _e,r=Fs[e],a=e===Fs.length-1;s.add(Xn(i,r,fo,bo,{face:i.copperRoof,frame:!1,anchorY:n}));for(let l=-6;l<=6;l++)s.add(N([r,bo+o(5),o(16)],i.copperTrim,{anchor:[-1,n,0],pos:[0,0,l*o(112)]}));if(s.add(N([o(26),bo+o(16),fo],i.copperTrim,{anchor:[-1,n,0],pos:[r-o(26),0,0]})),a){s.add(N([o(40),o(120),fo],i.vermilionDeep,{pos:[r,-n*o(40),0]}));for(let l=-6;l<=6;l++)s.add(N([o(180),o(46),o(46)],i.hinoki,{pos:[r-o(90),-n*o(46),l*o(112)]}))}return s.add(oi(i,fo,o(13))),s}function Ax(i){const e=new _e,t=o(1200),n=Ir(t,o(110),o(90),i.rope,{nx:14,ny:2,wave:.004});n.position.set(-o(700),-o(170),0),e.add(n);for(let s=0;s<5;s++){const r=-o(700)-t/2+o(120)+s*(t-o(240))/4,a=Ir(o(90),o(230),o(6),i.washi,{nx:3,ny:4,wave:.008});a.position.set(r,-o(310),0),e.add(a)}return e}function Rx(i){const e=new _e;e.position.set(Nd,Wn,0),e.add(N([o(320),o(60),o(780)],i.hinoki,{anchor:[0,-1,0]})),e.add(N([o(350),o(16),o(810)],i.hinoki,{pos:[0,o(52),0]}));const t=new _e;t.position.set(-o(40),o(60),0),t.add(N([o(220),o(250),o(303)],i.hinoki,{anchor:[0,-1,0]}));for(let s=-3;s<=3;s++)t.add(N([o(20),o(22),o(260)],i.trim,{pos:[s*o(28),o(258),0]}));t.add(N([o(240),o(18),o(325)],i.hinoki,{pos:[0,o(242),0]})),e.add(t);for(const s of[-1,1]){const r=new _e;r.position.set(o(30),o(60),s*o(330)),r.add(_n([[o(58),0],[o(46),o(40)],[o(34),o(120)]],i.hinoki,{seg:10})),r.add(N([o(130),o(16),o(130)],i.hinoki,{pos:[0,o(128),0]})),r.add(N([o(104),o(96),o(104)],i.washi,{pos:[0,o(184),0]}));const a=new ci(16757335,1.6,1.8,2);a.position.y=o(184),r.add(a);const l=_n([[o(96),0],[o(74),o(40)],[0,o(66)]],i.hinoki,{seg:10});l.position.y=o(232),r.add(l),e.add(r)}for(const s of[-1,1]){const r=_n([[o(22),0],[o(27),o(20)],[o(20),o(70)],[o(24),o(95)],[o(19),o(95)]],i.washi,{seg:12});r.position.set(o(120),o(60),s*o(170)),e.add(r)}const n=new _e;return n.position.set(o(120),o(60),0),n.add(N([o(150),o(70),o(150)],i.hinoki,{anchor:[0,-1,0]})),n.add(N([o(182),o(16),o(182)],i.hinoki,{pos:[0,o(78),0]})),e.add(n),e}function Cx(i){const e=new _e,t=o(150),n=Ud;e.add(tt([0,0,0],[-o(50),-o(56),0],o(4),i.steelRod)),e.add(tt([0,0,0],[o(50),-o(56),0],o(4),i.steelRod));const s=new _e;s.position.y=-o(70),s.add(_n([[o(52),0],[t*.86,-n*.14],[t,-n*.46],[t*.9,-n*.78],[o(58),-n]],i.washi,{seg:16,open:!0}));for(const a of[0,-n])s.add(_n([[o(52),a],[o(60),a],[o(60),a-o(14)],[o(52),a-o(14)]],i.hinoki,{seg:16}));for(let a=1;a<9;a++){const l=a/9,c=o(52)+(t-o(52))*Math.sin(Math.PI*l);s.add(_n([[c+o(2),-n*l],[c+o(9),-n*l-o(7)],[c+o(2),-n*l-o(14)]],i.hinoki,{seg:16}))}const r=new ci(16760954,2.2,2.4,2);return r.position.y=-n*.4,s.add(r),e.add(s),e.userData.body=s,e}function Px(i){const e=new _e,t=Sn-o(50),n=Vt.x0+o(60);e.add(tt([n,t,0],[n,t-o(70),0],o(9),i.steelRod));const s=_n([[0,o(150)],[o(45),o(120)],[o(61),o(40)],[o(55),0],[0,0]],i.gold,{seg:16});s.position.set(n,t-o(220),0),e.add(s);const r=new _e;r.position.set(n,t-o(220),0);const a=Ir(o(60),o(1200),o(36),i.rope,{nx:3,ny:7,wave:.01});a.position.y=-o(600),r.add(a),e.add(r);const l=[];for(const c of[-1,1]){const h=Cx(i);h.position.set(n+o(40),t,c*o(440)),e.add(h),l.push(h.userData.body)}return e.userData={rope:r,chochin:l},e}const dt=o(90),rt={h:o(1010),t:o(40)},po=o(880),Lx=o(530),qt=-o(20),zs=o(1850),Ei=o(1280),Hn=o(1200),Dx=o(950),nn=Rd-o(20),Gn=rt.h+rt.t,Dn=o(1740),pr=o(608),co=o(860),As=o(680),Ix={id:"cabin",title:"Cabin",tagline:"the wall you drive with is the floor you camp on",build:kx};function kx(i){const{rig:e,lib:t}=i;e.setStages(["gates down, jacks in","roof pops, bellows unfold","the kerb wall falls out and becomes the deck","deck legs down, poles up, bunk drops to cab height","poles telescope, canopy unrolls, bunk over the cab"]);const n=e.add({id:"floor",parent:null,label:"subframe + shell",joint:"fixed",static:!0,mass:100,com:[0,dt+rt.h*.4,o(120)],hulls:[...Yr(dt),{c:[o(905),dt+rt.h/2,0],s:[rt.t,rt.h,nn*2],tag:"front wall"},{c:[-o(945),dt+rt.h/2,0],s:[rt.t,rt.h,nn*2],tag:"rear wall"},{c:[qt,dt+rt.h/2,nn-rt.t/2],s:[o(1850),rt.h,rt.t],tag:"off-side wall"},{c:[qt,dt+o(330),o(410)],s:[o(1800),o(660),o(470)],tag:"galley run"},{c:[qt,dt+o(225),-o(390)],s:[o(1800),o(450),o(480)],tag:"bench / lower berth"}]});e.attach(n.id,qr(t,{height:dt})),e.attach(n.id,Ux(t)),e.attach(n.id,Nx(t)),jr(e,i,{left:"hang",right:"hang",tail:"flat",stage:0});for(const h of[-1,1])for(const d of[-1,1])$r(e,t,{id:`jack-${h>0?"f":"r"}${d>0?"r":"l"}`,at:[h*o(880),-o(70),d*o(660)],stage:0});const s=e.add({id:"lid",parent:"floor",label:"pop-top roof",pivot:[qt,dt+rt.h-o(110),0],joint:"telescope",axis:[0,1,0],range:[0,po],stage:1,mass:44,com:[0,o(60),0],hulls:[{c:[0,o(55),0],s:[o(1850),o(110),o(1370)],tag:"lid"}],mates:["floor","bunk","bunk-slide"],note:"standing height goes from 900 to 1780 mm"});e.attach(s.id,Ox(t));const r=zx(t);e.attach(s.id,r);const a=e.add({id:"kerb-deck",parent:"floor",label:"kerb wall / fold-down deck",pivot:[qt,dt-rt.t,-nn],joint:"hinge",axis:[1,0,0],rest:Lo.UP_ALONG_X,range:[0,-Math.PI/2],stage:2,mass:30,com:[Gn/2,0,0],hulls:In(Gn,Dn,rt.t-o(6),"kerb wall / deck",-1),mates:["floor","lid","gate-left"],note:"1740 x 1050 of floor, outside the chassis, from a panel already on the truck"});e.attach(a.id,Fx(t)),e.attach(a.id,oi(t,Dn));for(const[h,d]of[["f",1],["r",-1]])e.add({id:`deck-leg-${h}`,parent:"kerb-deck",label:"deck leg",pivot:[Gn-o(70),rt.t/2,d*o(700)],joint:"hinge",axis:[0,0,1],range:[-Math.PI/2,0],stage:3,mass:2.6,com:[0,-pr/2,0],hulls:[{c:[0,-pr/2,0],s:[o(44),pr,o(44)],tag:"leg"}],mates:["kerb-deck","floor","gate-left","lid"]}),e.attach(`deck-leg-${h}`,Pd(t,pr,{section:o(40),foot:o(130)})),e.add({id:`canopy-pole-${h}`,parent:"kerb-deck",label:"canopy pole",pivot:[Gn-o(70),rt.t/2,d*o(790)],joint:"hinge",axis:[0,0,1],range:[Math.PI/2,0],stage:3,mass:1.4,com:[0,co/2,0],hulls:[{c:[0,co/2,0],s:[o(44),co,o(44)],tag:"pole"}],mates:["kerb-deck","floor","gate-left","lid"]}),e.attach(`canopy-pole-${h}`,Ph(t,co,o(22))),e.add({id:`canopy-mast-${h}`,parent:`canopy-pole-${h}`,label:"pole extension",pivot:[0,co,0],joint:"telescope",axis:[0,1,0],range:[0,As],stage:4,mass:.9,com:[0,-As/2,0],hulls:[{c:[0,-As/2,0],s:[o(38),As,o(38)],tag:"pole"}],mates:[`canopy-pole-${h}`,"kerb-deck","floor","gate-left","lid"]}),e.attach(`canopy-mast-${h}`,Ph(t,As,o(19),{anchor:-1}));const l=e.add({id:"bunk",parent:"lid",label:"bunk deck",pivot:[0,-o(120),0],joint:"telescope",axis:[0,1,0],range:[0,-Lx],window:[.55,.75],mass:26,com:[0,0,0],hulls:[{c:[0,o(15),0],s:[zs,o(190),Ei],tag:"bunk + mattress"}],mates:["lid","floor"],note:"packs under the lid at 870; drops to 1220 so the cabover clears the cab roof"});e.attach(l.id,Bx(t));const c=e.add({id:"bunk-slide",parent:"bunk",label:"cabover extension",pivot:[zs/2-Hn,-o(40),0],joint:"slide",axis:[1,0,0],range:[0,Dx],window:[.8,1],mass:34,com:[Hn/2,0,0],hulls:[{c:[Hn/2,0,0],s:[Hn,o(80),Ei-o(60)],tag:"cabover"}],mates:["bunk","lid","floor"],note:"950 mm over the cab: 700 Nm at the root, 13.5 MPa in the side rails"});return e.attach(c.id,Hx(t)),{massBudget:[["subframe",36],["hard shell: composite walls + floor",54],["pop-top lid, bellows and guides",35],["kerb wall / fold-down deck",30],["deck legs, canopy poles, feet",8],["canopy: sheet, rail, hem bar, guys",6],["bunk deck + cabover slides",49],["stabiliser jacks (4)",18],["fitted kit — see the bill of materials",84],["water, 20 L",20]],notes:["An adult is 1800 mm and the bed is 1940 × 1410. One person fits lengthwise; two do not. So the bunk slides 950 mm out over the cab roof and becomes 2820 × 1280.","That cantilever is real: two adults at 475 mm out is 700 Nm at the root, 13.5 MPa in a pair of 100 × 50 × 3 aluminium rails against 240 MPa yield. The pads on the cab roof stop it swaying; a 0.7 mm steel cab roof carries nothing.","The pop-top takes standing height from 900 to 1780 mm. That is enough for a lot of people and short for the rest, which is worth saying rather than rounding up to 2000.","The galley worktop finishes at 750 mm and nothing on it stands proud, because the bunk deck hangs at 790 with the lid down. That one clearance decides three purchases: a folding tap, a drop-in bowl instead of the over-counter one the catalogue pushes, and a hob that travels in the locker — which is what Iwatani ask for anyway, since the cartridge sits in the body.","The aisle between the galley and the bench is 335 mm. That is not a mistake and it is not fixable: 1290 mm of interior width minus a 450 mm galley run minus a 480 mm seat is what is left. It is also the entire reason the kerb wall lifts — the room is outside.","Four guided corners rather than scissor arms. A scissor is the nicer mechanism but it is a closed loop; four guides hold the lid parallel with no synchronising linkage.","The shell is 3 mm aluminium composite on 40 × 40 extrusion, not plywood. Plywood walls and floor come to about 90 kg on this footprint and the fitted kit is 84 — one of the two had to give, and it was not the fridge.","The bill of materials totals 98 kg and 84 of it is fitted. The difference is the WAVE 2 air conditioner: it survived the first pass and then did not survive the check, because a Seitz S4 window weighs 8.5 kg rather than the 5.5 that was assumed, and two of them took the margin. The line stays on the list with its price, because the trade is the decision.","The whole outdoor room costs 4 kg over the gullwing and porch it replaces, and gives 1.83 m² of floor instead of 0.89 m² of porch. That is the only line in this project where more space came out cheaper.","Water is 20 L, one tank. A second 20 L tank is 40 kg of water and 40 kg is the entire margin, so the spare tank on the list is exactly that: a spare, filled at the tap, not carried full.","THE KERB WALL IS THE FLOOR. Hinged at the floor line rather than the top, it falls outboard to a 1740 × 1050 deck level with the cabin floor — 1.83 m² of room outside the chassis from a panel the truck was carrying anyway. Interior 2.43 plus deck 1.83 is 4.26 m², against 2.43 for the box on its own.","And it costs nothing to pack, which is the point of doing it this way. A fold-out that stows as a panel spends its own thickness on the load space; a fold-out that stows as a WALL spends nothing, because the wall existed. The legs and the poles are routed into that 40 mm skin, flush, so they are free too — and everything else in the outdoor room is fabric in a bag.","It has legs to the tarmac, not stays. 1050 mm of cantilever with two adults on it is a floor, not a doorstep: a hinge and a gas strut would be carrying about 1.5 kN·m between them, and a deck that visibly moves underfoot is a deck nobody stands on.","The 1050 is the shell height plus the panel thickness, so standing up it exactly fills the opening from the floor line to the lid sill, and lying down its top face lands FLUSH with the cabin floor instead of 40 mm proud of it. A 40 mm step in a doorway is the one you catch.","With the kerb wall down the lid is carried on that side by the two corner columns and the top rails of the front and rear walls. That is why the panel is 1740 wide and sits between the columns rather than being structure itself — a wall you intend to drop cannot also be holding the roof up.","The roof over the deck is a canopy, not a gullwing. Two poles telescope up off the outer edge and a sheet unrolls to them from a keder rail on the raised lid: 1.0 m of sheltered ground for 6 kg, where the hard porch roof this replaces was 24 kg and swept a 1.0 m arc through the space it was trying to shelter.","Packed it is 1010 mm above the deck — 1670 overall, 110 under the cab roof. It should look like a work truck with a canopy until it opens."],update(h,d){var v;const u=((v=d.parts.get("canopy-mast-f"))==null?void 0:v.q)??0,f=Math.min(1,Math.max(0,u/As)),{roll:p,bag:_}=r.userData;p.scale.y=Math.max(.004,f),_.scale.set(1-.86*f,1,1-.86*f)}}}function Ux(i){const e=new _e,t=dt+rt.h/2,n=i.ply;e.add(N([rt.t,rt.h,nn*2],n,{pos:[o(905),t,0]})),e.add(N([rt.t,rt.h,nn*2],n,{pos:[-o(945),t,0]})),e.add(N([o(1850),rt.h,rt.t],n,{pos:[qt,t,nn-rt.t/2]}));for(const s of[-1,1])for(const r of[-1,1])e.add(Ti([qt+s*o(925),dt,r*(nn-o(20))],[qt+s*o(925),dt+rt.h,r*(nn-o(20))],o(56),i.aluDark));e.add(N([o(16),o(760),o(560)],i.aluDark,{pos:[-o(966),dt+o(400),o(180)]})),e.add(N([o(20),o(510),o(960)],i.aluDark,{pos:[qt+o(300),dt+o(610),nn-o(10)]})),e.add(N([o(14),o(450),o(900)],i.glass,{pos:[qt+o(300),dt+o(610),nn-o(4)]}));for(const s of[-1,1])for(const r of[-1,1])e.add(N([o(70),o(240),o(70)],i.alu,{pos:[qt+s*o(840),dt+rt.h-o(120),r*(nn-o(90))]}));return e}function Nx(i){const e=new _e,t=dt+o(640),n=o(410);e.add(N([o(1780),o(600),o(450)],i.ply,{anchor:[0,-1,0],pos:[qt,dt,n]})),e.add(N([o(1800),o(40),o(470)],i.ply,{pos:[qt,t,n]})),e.add(N([o(283),o(129),o(341)],i.aluDark,{pos:[o(560),dt+o(150),n-o(30)]})),e.add(N([o(300),o(10),o(360)],i.ply,{pos:[o(560),dt+o(80),n-o(30)]}));const s=_n([[o(150),o(20)],[o(146),-o(80)],[o(40),-o(100)],[0,-o(100)]],i.stainless,{seg:20,open:!0});s.position.set(o(60),t,n),e.add(s),e.add(tt([o(60)-o(200),t,n],[o(60)-o(200),t+o(20),n],o(14),i.chrome)),e.add(tt([o(60)-o(200),t+o(16),n],[o(60)-o(60),t+o(10),n],o(12),i.chrome)),e.add(N([o(442),o(398),o(284)],i.aluDark,{pos:[-o(300),dt+o(230),n+o(40)]})),e.add(N([o(20),o(300),o(240)],i.trim,{pos:[-o(300)-o(231),dt+o(230),n+o(40)]})),e.add(N([o(211),o(281),o(400)],i.trim,{pos:[-o(760),dt+o(190),n]})),e.add(N([o(50),o(30),o(300)],i.ledCyan,{pos:[-o(760)-o(110),dt+o(250),n]}));for(const a of[-o(880),-o(680)])e.add(N([o(178),o(416),o(350)],i.paint,{pos:[o(600)+a,dt+o(215),n+o(30)]}));e.add(N([o(1800),o(340),o(480)],i.ply,{anchor:[0,-1,0],pos:[qt,dt,-o(390)]})),e.add(N([o(1800),o(110),o(480)],i.canvasIndigo,{pos:[qt,dt+o(395),-o(390)]})),e.add(N([o(1400),o(22),o(60)],i.ledWarm,{pos:[qt,dt+o(690),n+o(215)]}));const r=new ci(16763274,6,4,2);return r.position.set(qt,dt+o(860),o(60)),e.add(r),e}function Ox(i){const e=new _e;e.add(N([o(1850),o(70),o(1370)],i.ply,{anchor:[0,-1,0],pos:[0,o(20),0]})),e.add(N([o(1880),o(30),o(1400)],i.aluDark,{pos:[0,o(105),0]})),e.add(N([o(586),o(60),o(417)],i.paint,{pos:[-o(620),o(150),0]})),e.add(N([o(520),o(80),o(380)],i.paint,{anchor:[0,-1,0],rot:[0,0,ii(-12)],pos:[-o(620),o(178),0]})),e.add(N([o(400),o(190),o(400)],i.aluDark,{pos:[-o(620),o(20),0]}));for(const t of[o(30),o(580)])e.add(N([o(540),o(6),o(1050)],i.trim,{pos:[t,o(142),0]})),e.add(N([o(500),o(3),o(1010)],i.glass,{pos:[t,o(147),0]}));for(const t of[-1,1]){const n=fh(o(1810),po,o(70),i.canvasCream,{pleats:9});n.position.set(0,-po/2+o(10),t*(nn-o(45))),e.add(n)}for(const t of[-1,1]){const n=fh(o(1320),po,o(70),i.canvasCream,{pleats:7});n.rotation.y=Math.PI/2,n.position.set(t*o(900),-po/2+o(10),0),e.add(n)}for(const t of[-1,1])for(const n of[-1,1])e.add(N([o(92),o(300),o(92)],i.alu,{pos:[t*o(840),-o(140),n*(nn-o(90))]}));return e}function Fx(i){const e=new _e,t=[-1,-1,0];e.add(N([Gn,rt.t,Dn],i.ply,{anchor:t})),e.add(N([o(70),rt.t+o(16),Dn],i.aluDark,{anchor:t,pos:[Gn-o(70),0,0]}));for(const s of[-1,1])e.add(N([Gn,rt.t+o(10),o(40)],i.alu,{anchor:t,pos:[0,0,s*(Dn/2-o(20))]}));for(let s=1;s<=6;s++)e.add(N([o(34),o(8),Dn-o(120)],i.aluDark,{pos:[s*o(145),rt.t+o(4),0]}));for(const s of[-1,1])for(const r of[o(700),o(790)])e.add(N([o(660),o(10),o(52)],i.trim,{pos:[Gn-o(400),o(6),s*r]}));e.add(Uv(i,Dn,o(17)));for(let s=-4;s<=4;s++)e.add(N([o(60),o(60),o(60)],i.ledWarm,{pos:[Gn-o(40),rt.t+o(40),s*o(200)]}));const n=new ci(16760954,6,5,2);return n.position.set(Gn-o(120),rt.t+o(120),0),e.add(n),e}function Ph(i,e,t,{anchor:n=1}={}){const s=new _e,r=new je(new Wt(t,t,e,12),i.alu);return r.position.y=n*e/2,s.add(r),s.add(N([t*2.6,o(34),t*2.6],i.aluDark,{pos:[0,n*o(20),0]})),s.add(N([t*2.6,o(34),t*2.6],i.aluDark,{pos:[0,n*(e-o(20)),0]})),s}function zx(i){const e=new _e,t=o(980)-o(24),n=o(356)+o(36),s=Math.hypot(t,n);e.position.set(0,o(60),-nn+o(120)),e.add(N([Dn+o(60),o(36),o(46)],i.aluDark,{pos:[0,0,-o(96)]}));const r=new _e;r.rotation.x=Math.atan2(t,n);const a=Ir(Dn,s,o(55),i.canvasCream,{nx:12,ny:6});a.position.y=-s/2,a.material.side=Yt,r.add(a);const l=N([Dn+o(40),o(30),o(30)],i.aluDark,{pos:[0,-s,0]});r.add(l),e.add(r);const c=new je(new Wt(o(75),o(75),Dn,14),i.canvasCream);return c.rotation.z=Math.PI/2,c.position.set(0,-o(4),0),e.add(c),e.userData={roll:r,bag:c},e}function Bx(i){const e=new _e;e.add(N([zs,o(70),Ei],i.ply,{pos:[0,-o(35),0]}));for(const t of[-1,1])e.add(N([zs,o(100),o(50)],i.aluDark,{pos:[0,-o(50),t*(Ei/2-o(25))]}));e.add(si(zs-o(120),o(110),Ei-o(90),o(50),i.canvasIndigo,{pos:[0,o(55),0]}));for(const t of[-1,1])e.add(si(o(520),o(120),o(320),o(60),i.canvasCream,{pos:[-zs/2+o(330),o(120),t*o(300)]}));return e}function Hx(i){const e=new _e;e.add(N([Hn,o(60),Ei-o(80)],i.ply,{anchor:[-1,0,0]}));for(const t of[-1,1])e.add(N([Hn,o(100),o(50)],i.aluDark,{anchor:[-1,0,0],pos:[0,-o(20),t*(Ei/2-o(65))]}));e.add(si(Hn-o(160),o(110),Ei-o(180),o(50),i.canvasIndigo,{pos:[Hn/2,o(85),0]}));for(const t of[-1,1])e.add(N([o(160),o(40),o(120)],i.rubberFoot,{pos:[Hn-o(140),-o(90),t*o(430)]}));return e.add(N([o(16),o(300),o(760)],i.glass,{pos:[Hn-o(8),o(120),0]})),e}const Nr=[Hv,sx,_x,Ix],mr=-k.deckH+o(4),Gx=Me.axleFront-(Me.axleFront-Me.axleRear)*.4;function Vx({rig:i,lib:e,statics:t,report:n}){const s=new _e;s.name="overlay",s.visible=!1;const r=new Set;for(const M of(n==null?void 0:n.collisions)??[])r.add(M.a),r.add(M.b);const a={ok:[],bad:[]};for(const M of i.order)for(const L of M.hulls)a[r.has(M.id)?"bad":"ok"].push({part:M,h:L});const l={};for(const M of["ok","bad"]){const L=a[M].length,R=new Tt;R.setAttribute("position",new gn(new Float32Array(L*24*3),3));const C=new d_(R,M==="bad"?e.hullWireBad:e.hullWire);C.frustumCulled=!1,l[M]=C,s.add(C)}const c=[];for(const M of i.order){if(M.static||M.jointType==="fixed")continue;const L=Yx(M,e);L&&(L.visible=!1,c.push(L),M.group.add(L));const R=$x(M,e);R&&(R.visible=!1,c.push(R),(M.group.parent??s).add(R))}const h=new Tt;h.setAttribute("position",new gn(new Float32Array(64*3),3));const d=new u_(h,e.supportWire);d.frustumCulled=!1,s.add(d);const u=new Tt;u.setAttribute("position",new gn(new Float32Array(2*3),3));const f=new Do(u,e.supportWire);f.frustumCulled=!1,s.add(f);const p=new Ao({color:4645024,transparent:!0,opacity:.9}),_=new Ao({color:16731501,transparent:!0,opacity:.95}),v=new je(new ml(o(60),o(110),24),p);v.rotation.x=-Math.PI/2,s.add(v);const g=new je(new Wr(o(55),12,8),p);s.add(g);const m=[[Me.axleRear,-k.trackRear/2],[Me.axleRear,k.trackRear/2],[Me.axleFront,-k.trackFront/2],[Me.axleFront,k.trackFront/2]],y={inside:!0,margin:0,mass:0};function x(){for(const I of["ok","bad"]){const B=l[I].geometry.attributes.position;let H=0;for(const{part:K,h:Z}of a[I])H=Wx(B.array,H,K.group.matrixWorld,Z);B.needsUpdate=!0,l[I].geometry.setDrawRange(0,H/3)}const M=m.map(([I,B])=>[I,B]);for(const I of i.feet())I.y<=mr+o(25)&&M.push([I.x,I.z]);const L=Kx(M),R=d.geometry.attributes.position;for(let I=0;I<Math.min(L.length,64);I++)R.array[I*3]=L[I][0],R.array[I*3+1]=mr,R.array[I*3+2]=L[I][1];R.needsUpdate=!0,d.geometry.setDrawRange(0,Math.min(L.length,64));const{point:C,mass:G}=i.centreOfMass(),b=k.kerb,T=(C.x*G+Gx*b)/(G+b),z=C.z*G/(G+b);y.mass=G,y.inside=Od(T,z,L),y.margin=Zx(T,z,L);const V=y.inside?p:_;v.material=V,g.material=V,v.position.set(T,mr+o(6),z),g.position.set(T,C.y,z);const ie=f.geometry.attributes.position;ie.array.set([T,mr,z,T,C.y,z]),ie.needsUpdate=!0}return x(),{group:s,status:y,update:x,setVisible(M){s.visible=M;for(const L of c)L.visible=M},dispose(){var M,L,R;s.traverse(C=>{var G,b;return(b=(G=C.geometry)==null?void 0:G.dispose)==null?void 0:b.call(G)});for(const C of c)(L=(M=C.geometry)==null?void 0:M.dispose)==null||L.call(M),(R=C.parent)==null||R.remove(C);c.length=0}}}const gr=new A;function Wx(i,e,t,n){const s=Xx.multiplyMatrices(t,n.local),r=n.half,a=jx,l=[];for(let c=0;c<8;c++)gr.set(a[c][0]*r.x,a[c][1]*r.y,a[c][2]*r.z).applyMatrix4(s),l.push(gr.x,gr.y,gr.z);for(const[c,h]of qx)i[e++]=l[c*3],i[e++]=l[c*3+1],i[e++]=l[c*3+2],i[e++]=l[h*3],i[e++]=l[h*3+1],i[e++]=l[h*3+2];return e}const Xx=new mt,jx=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],qx=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];function Yx(i,e){const t=i.jointType==="hinge"?o(900):o(400),n=i.axis.clone().multiplyScalar(-t/2),s=i.axis.clone().multiplyScalar(t/2),r=new Tt().setFromPoints([n,s]);return new Do(r,e.axisWire)}function $x(i,e){if(i.jointType!=="hinge"||Math.abs(i.to-i.from)<.05)return null;let t=0,n=new A;for(const l of i.hulls){const h=new A().setFromMatrixPosition(l.local).clone().add(new A(l.half.x,l.half.y,l.half.z)),d=h.clone().addScaledVector(i.axis,-h.dot(i.axis));d.length()>t&&(t=d.length(),n=h.clone())}if(t<o(80))return null;const s=[],r=new vn,a=30;for(let l=0;l<=a;l++){const c=i.from+(i.to-i.from)*l/a;r.setFromAxisAngle(i.axis,c);const h=n.clone();i.rest&&h.applyQuaternion(i.rest),h.applyQuaternion(r).add(i.pivot),s.push(h)}return new Do(new Tt().setFromPoints(s),e.sweepWire)}function Kx(i){if(i.length<3)return i.slice();const e=i.slice().sort((r,a)=>r[0]-a[0]||r[1]-a[1]),t=(r,a,l)=>(a[0]-r[0])*(l[1]-r[1])-(a[1]-r[1])*(l[0]-r[0]),n=[];for(const r of e){for(;n.length>=2&&t(n[n.length-2],n[n.length-1],r)<=0;)n.pop();n.push(r)}const s=[];for(let r=e.length-1;r>=0;r--){const a=e[r];for(;s.length>=2&&t(s[s.length-2],s[s.length-1],a)<=0;)s.pop();s.push(a)}return n.pop(),s.pop(),n.concat(s)}function Od(i,e,t){let n=!1;for(let s=0,r=t.length-1;s<t.length;r=s++){const[a,l]=t[s],[c,h]=t[r];l>e!=h>e&&i<(c-a)*(e-l)/(h-l)+a&&(n=!n)}return n}function Zx(i,e,t){let n=1/0;for(let s=0,r=t.length-1;s<t.length;r=s++){const[a,l]=t[s],[c,h]=t[r],d=c-a,u=h-l,f=d*d+u*u,p=f>0?Math.max(0,Math.min(1,((i-a)*d+(e-l)*u)/f)):0;n=Math.min(n,Math.hypot(i-(a+p*d),e-(l+p*u)))}return Od(i,e,t)?n:-n}const Jx=[{cat:"cooking",maker:"IKK (伊東金属工業所)",model:"TKO18321 てっぱんたこ焼 3連式 LPガス",size:[595,190,358],kg:38,jpy:67880,qty:1,where:"テンポスバスターズ / 厨房卸売センター",mount:"NO mount points — a sheet-steel case on four 30 mm feet. Captured: a 605 × 368 well cut through the 24 mm ply worktop, lined with calcium-silicate board and stainless (bare ply against a cast-iron gas griddle is a fire), with two straps over the case ends.",capture:!0,conf:"medium",note:"The cast plates lift straight out of the frame. Roughly 20 kg of loose iron unless they are removed and stowed for transit — the single most dangerous item in the module."},{cat:"cooking",maker:"岩谷産業 (Iwatani)",model:"CB-ETK-2 プロたこマルチ",size:[346,135,278],kg:3.4,jpy:9800,qty:1,where:"ヨドバシ / Amazon.co.jp",mount:"Four rubber feet, no fixings. A 3 mm ply rebate 350 × 282 with a hinged retaining bar across the front, so it locates positively and still lifts out.",capture:!0,conf:"medium"},{cat:"water",maker:"汎用 SUS304",model:"手洗い用シンクボウル 320 × 230 × 深120",size:[320,120,230],kg:1.2,jpy:3900,qty:1,where:"モノタロウ / 合羽橋",mount:"Drop-in on a rolled rim over a 300 × 210 cut-out, bedded in food-grade silicone and pulled down by four stainless under-clips. It stands on its OWN carcass across the deck from the prep counter, at the cook’s elbow — this is the one plumbed fitting in the build and the one an inspector actually looks for.",conf:"medium",note:"The two 450 × 390 wash bowls that used to sit beside it are gone: washing-up is a fixed-premises requirement, done at the 基地施設, not on the truck."},{cat:"prep",maker:"汎用 SUS304",model:"ホテルパン 1/3 × 深100 + 蓋",size:[325,100,176],kg:.7,jpy:1800,qty:6,where:"合羽橋 / モノタロウ",mount:"Drop into three 250 × 320 wells cut through the prep counter’s stainless top and hang on their own flanges. Batter, cabbage, sauce and finished takoyaki — the pans that used to be a sink, without the plumbing.",conf:"high"},{cat:"water",maker:"スイコー (Suiko)",model:"HLT-50 ホームローリータンク 50 L",size:[400,500,380],kg:3.5,jpy:9e3,qty:2,where:"モノタロウ / コーナン",mount:"ZERO mount points — rotomoulded PE, smooth radiused body, one 100 mm filler and one 38 mm cock boss. Cannot be bolted anywhere. Captured in a three-sided ply well 405 × 505 with two cam straps over the shoulder.",capture:!0,conf:"high",note:"One supply, one waste. Filled to 20 L each rather than 40, because a hand-wash is all that draws on them: 40 kg of water instead of 80. The 50 L tank stays — it is 3.5 kg empty and the headroom is free — so a longer pitch just means filling it fuller."},{cat:"water",maker:"汎用 (キャンピングカー部品)",model:"DC12V 水中ポンプ 10 L/min",size:[50,95,50],kg:.4,jpy:3500,qty:1,where:"Amazon.co.jp",mount:"A hanging loop and nothing else. Drops into the supply tank through the filler and hangs on its own hose; the drilled tank cap is the restraint.",conf:"medium"},{cat:"water",maker:"SANEI",model:"自在水栓 泡沫キャップ付 呼13",size:[150,230,60],kg:.5,jpy:3200,qty:1,where:"コーナン / モノタロウ",mount:"Deck-mount shank with a backnut through the hand-basin stand’s top. One tap, over the one basin: the other two went with the wash bowls.",conf:"medium"},{cat:"cold",maker:"山善 (Yamazen)",model:"YFR-AC252(B) 車載用冷凍冷蔵庫 25 L",size:[593,410,345],kg:11.2,jpy:34800,qty:1,where:"ヨドバシ / Amazon.co.jp",mount:"Moulded case with recessed side handles, no threaded inserts. A ply cradle gripping the base rim, plus one cam strap through the handle recesses.",capture:!0,conf:"medium"},{cat:"gas",maker:"LPガス販売事業者",model:"LPガス容器 8 kg (内容積 19 L)",size:[290,500,290],kg:18,jpy:12e3,qty:1,where:"岩谷産業 販売店 (充填契約)",mount:"LITERALLY no mount points — a smooth barrel with a foot skirt and a neck guard. Barrel bands are the only restraint that exists. Lives in an external vented locker off the rear crossmember, upright, vented at the BOTTOM because propane sinks.",capture:!0,conf:"high"},{cat:"gas",maker:"I・T・O (伊藤工機)",model:"HS-5BP 単段式調整器 + ホース口",size:[110,95,80],kg:.8,jpy:5800,qty:1,where:"モノタロウ",mount:"Screws onto the cylinder valve; the hose is band-clamped to the burner tail.",conf:"medium"},{cat:"gas",maker:"custom (アルミ)",model:"ボンベ庫 — vented cylinder locker 340 × 340 × 620 internal",size:[380,680,380],kg:8.5,jpy:28e3,qty:1,where:"fabrication",mount:"Bolted M10 to the rear crossmember, outboard of the tail. Low-level louvres.",conf:"low"},{cat:"front of house",maker:"高橋提燈 (東京) / オゼキ (岐阜提灯)",model:"尺3丸 和紙提灯 380φ × 430h (文字入れ)",size:[380,430,380],kg:.35,jpy:12e3,qty:1,where:"上野 / 浅草",mount:"Wire hoops top and bottom; hangs from a hook.",conf:"high"},{cat:"front of house",maker:"和光産業",model:"9号丸型 ビニール提灯 260φ × 330h",size:[260,330,260],kg:.12,jpy:1200,qty:4,where:"Amazon.co.jp / 浅草",mount:"Hook through the top hoop, tied down at the bottom so it does not fly.",conf:"high"},{cat:"front of house",maker:"水野染工場",model:"オーダー暖簾 一間巾 1800 × 600 三巾 乳付",size:[1800,600,5],kg:.9,jpy:24e3,qty:1,where:"made to order",mount:"Sewn loops (乳) over a 25 mm aluminium rod in two clamps.",conf:"medium"},{cat:"prep",maker:"住べテクノプラスチック",model:"20SWK 抗菌スーパー耐熱まな板 600 × 300 × 20",size:[600,20,300],kg:3.4,jpy:8253,qty:1,where:"合羽橋 / モノタロウ",mount:"Loose on the worktop; stowed in a slot beside the tank well for transit.",capture:!0,conf:"high"},{cat:"power",maker:"汎用 LiFePO4 + 正弦波インバーター",model:"12V 100Ah + 1500 W インバーター + 分電盤",size:[330,215,175],kg:16,jpy:68e3,qty:1,where:"Amazon.co.jp / オートバックス",mount:"Battery case has M6 hold-down lugs at the base; bolted to the subframe with a strap over the top.",conf:"low"}],Qx=[{cat:"PA — low",maker:"JBL Professional",model:'PRX918XLF 18" powered subwoofer',size:[591,693,654],kg:40.7,jpy:238e3,qty:2,where:"Soundhouse / ハーマンプロ (取寄せ)",mount:"The ONLY threaded features are in the top panel: an M20 pole socket, rated for a pole in COMPRESSION and never usable as a tie-down. No base inserts, no flypoints. Captured in a 611 × 674 ply well with hardwood battens hooking the cast side-handle apertures, plus one 24 mm endless strap over the top.",capture:!0,conf:"medium",note:"THE BIGGEST BOX THAT FITS, and that is the whole reason it is here. 591 mm across is what set the tray at 610 and the centre channel at 190. It is 0.7 kg heavier than the pair of DXS15XLFs it replaces and reaches 30 Hz instead of 33 — the extra octave is free on payload and expensive only on geometry."},{cat:"PA — mid/top",maker:"YAMAHA",model:'DZR10 10" powered top',size:[315,537,345],kg:17.9,jpy:217800,qty:2,where:"Soundhouse 254521",mount:"M10 × 8 PLUS M8 × 2 threaded inserts — by far the richest flypoint pattern of any box here, and the reason it is specified over the cheaper DXR10mk3. It is the one speaker on this truck that can be BOLTED to a yoke instead of cradled, which is what lets it tip up on a hinge rather than be lifted clear.",conf:"high",note:"The DXR10mk3 is ¥143,800 and 14.5 kg, but only has Φ35 slip sockets and M8 × 15 rear inserts — cradle only."},{cat:"PA — mid/top",maker:"K&M (König & Meyer)",model:"21336 distance rod",size:[35,1475,35],kg:2.27,jpy:9500,qty:4,where:"Soundhouse 47964 (在庫)",mount:"A PAIR PER SIDE, standing either side of the mid-top’s own bay — forward of the sub, not on it. The M20 male base screws into a captive M20 boss recessed 50 mm into the tray pan through a Φ50 guide sleeve that takes the side load; the Φ35 upper tubes carry the top’s trunnion yoke between them. The sub’s top socket is capped and unused. 945–1475 mm each, 530 of travel, rated 35 kg against the 22 kg they share.",conf:"high",note:"Two short columns instead of one long one is what makes the tip possible: a single rod has nothing to pin a trunnion to. Their collapsed 945 is also what sets the carriage rise at 527."},{cat:"light",maker:"ダイワ (単管パイプ)",model:"単管パイプ φ48.6 × t1.8 × 2000 めっき",size:[48.6,2e3,48.6],kg:4.16,jpy:1180,qty:3,where:"コーナン / カインズ / モノタロウ",mount:"The mast is one length cut to 1740, the crossbar a second cut to 1400, the third is the diagonal brace. Nothing about this is exotic — it is 労働安全衛生規則 scaffold material sold by the metre in every home centre in Japan, and the whole frame costs less than one lighting clamp on the stand it replaces.",conf:"high",note:"The coincidence the rig is built on: φ48.6 is inside STAGE EVOLUTION’s φ48–51 clamp jaw, so stage fixtures bolt to builders’ pipe with no adapter at all."},{cat:"light",maker:"大洋製器工業",model:"固定ベース KB48.6 (単管ベース)",size:[150,60,150],kg:.69,jpy:398,qty:2,where:"モノタロウ / コーナン",mount:"A 150 mm square plate with a φ48.6 spigot and four fixing holes. Bolted M10 to a 6 mm steel spreader over the front crossmember — the mast’s foot, and the only place on this truck taking a bending moment into the chassis rather than into a panel.",conf:"high"},{cat:"light",maker:"信和 (シンワ)",model:"直交クランプ φ48.6 用 (耐力 500 kgf)",size:[110,100,110],kg:.74,jpy:300,qty:4,where:"コーナン / モノタロウ",mount:"Two make the T where the crossbar crosses the mast; two take the diagonal brace. RIGHT-ANGLE clamps specifically — the 自在クランプ swivels but does NOT lock at an angle under load, so it can carry a brace but must never define the frame’s geometry.",conf:"high"},{cat:"light",maker:"custom (鋼製)",model:"マストヒンジ — fabricated fold-down knuckle + over-centre latch",size:[180,160,200],kg:3.2,jpy:24e3,qty:1,where:"fabrication",mount:"THIS PART HAS TO BE MADE, and the reason is the finding above: no catalogue scaffold fitting locks a pipe at a chosen angle, so the one joint that decides whether the frame is standing or lying cannot be bought. A 12 mm plate clevis on a φ16 pin between the base plate and the mast’s heel, with a drop-in pin at 90° and an over-centre latch holding it flat for transit.",conf:"low"},{cat:"light",maker:"STAGE EVOLUTION",model:"SCLAMP (φ48–51 jaw)",size:[70,95,55],kg:.4,jpy:780,qty:6,where:"Soundhouse (在庫)",mount:"Jaw range covers the φ48.6 pipe exactly. Fixture hangs on an M10 bolt through the clamp body; all six are done up on the bench with the frame lying flat, and never touched again.",conf:"high"},{cat:"light",maker:"STAGE EVOLUTION",model:"SC90 セーフティワイヤー (90 cm)",size:[10,900,10],kg:.2,jpy:480,qty:6,where:"Soundhouse (在庫)",mount:"One steel bond per suspended fixture, round the pipe and back to the yoke. Non-negotiable, and cheaper than any of the arguments about it.",conf:"high"},{cat:"light",maker:"CHAUVET DJ",model:"COLOR STRIP12 (12 × 3 W RGB batten, DMX)",size:[1060,85,115],kg:2.5,jpy:23800,qty:1,where:"Soundhouse (在庫)",mount:"Two integral yokes onto two SCLAMPs, mounted along the crossbar rather than across it — which is why it can hang under a single pipe instead of needing a truss to span.",conf:"medium"},{cat:"light",maker:"STAGE EVOLUTION",model:"SLIMPAR12 (12 × 3 W RGB, DMX)",size:[193,89,180],kg:.6,jpy:9980,qty:4,where:"Soundhouse 268702 (在庫)",mount:"Double-yoke bracket, M8 through-hole into an SCLAMP, spread at 346 mm centres along the 1400 crossbar. They are clamped POINTING ALONG THE MAST toward its foot — forward while the frame is lying down, straight at the deck once it is up — so the quarter turn that stands the frame is also the aim, and nothing rolls on its clamp at the venue.",conf:"high"},{cat:"booth",maker:"Pioneer DJ",model:"DDJ-FLX4 controller",size:[482,59,273],kg:2.1,jpy:49500,qty:1,where:"Soundhouse 318895 (在庫)",mount:"NO MOUNT POINTS AT ALL — four rubber feet. It is 482 mm wide, within a millimetre of 19 inches, and that will tempt you: it has no rack ears and no provision for them. Captured in a 486 × 277 × 12 mm routed recess in the counter with a hinged retaining bar, so it stays put while the counter folds.",capture:!0,conf:"high"},{cat:"booth",maker:"YAMAHA",model:"MG10XU mixer",size:[244,71,294],kg:2.1,jpy:32400,qty:1,where:"Soundhouse 193650 (在庫)",mount:"No rack ears; Yamaha’s RK-MG12 kit fits the MG12/16, NOT this chassis. Routed recess plus a rear retaining bar, same as the controller.",capture:!0,conf:"high",note:"This is the entire signal chain upstream of the speakers. Its XLR outs go straight to the subs; there is nothing between them."},{cat:"booth",maker:"BSS Audio",model:"AR-133 active DI",size:[59,143,124],kg:.65,jpy:17800,qty:1,where:"Soundhouse 15477 (在庫)",mount:"A steel wedge with a rubber base and no fixings. Velcro to the underside of the counter inside the booth. It is here for its GROUND LIFT: the mains earth on a steel truck body stays connected, and the audio screen is what gets broken.",conf:"high"},{cat:"power",maker:"EcoFlow",model:"DELTA 2 Max (2048 Wh)",size:[497,305,242],kg:23,jpy:18e4,qty:1,where:"EcoFlow Japan / Amazon.co.jp / ヨドバシ",mount:"Moulded side handle recesses only, no inserts, no tie-down eyes. Ply well 505 × 250 internal with a 60 mm lip and tongues into the handle apertures, one 24 mm strap over the top.",capture:!0,conf:"low",note:"The 4096 Wh DELTA Pro 3 gives about 4.5 h at 800 W but weighs 51.5 kg, which this module does not have. At 2048 Wh expect roughly 2 to 2.5 hours — the honest number."},{cat:"power",maker:"日動工業",model:"NW-EB33 漏電遮断器付コードリール 30 m",size:[300,350,260],kg:7.7,jpy:43758,qty:2,where:"モノタロウ / コーナン",mount:"Carry handle and a drum frame; sits in a strapped ply cradle under the stage floor. Two of them, because none of the four cabinets has an AC thru and two reels is also how you get two circuits.",conf:"medium",note:"The 15 mA / 0.1 s earth-leakage breaker is the item, not the cable. Metal-grilled boxes on wet ground fed from a steel body is the exact fault this protects against, and it is the one part of this list that is about the crowd rather than the show."},{cat:"mechanism",maker:"LAMP / スガツネ工業",model:"3509-24 heavy-duty slide, 610 mm",size:[24,76,610],kg:5,jpy:28578,qty:2,where:"モノタロウ 00351811",mount:"3-stage over-travel steel slide, 632 mm stroke, rated 2117 N per pair (about 216 kgf) — but that is a STATIC rating at the rail midpoint. It says nothing about a 60 kg tray taking vertical shock at 60 km/h, so the trays latch closed with over-centre catches and bear on hardwood stops in transit.",conf:"high"},{cat:"mechanism",maker:"モノタロウ",model:"荷締めベルト ラチェット式 エンドレス 24 mm × 5 m",size:[24,1,5e3],kg:.8,jpy:1099,qty:6,where:"モノタロウ 53262388",mount:"Working load 100 kg, breaking 500. Take the ENDLESS variant — no hooks, a continuous loop — so it passes over the box and through M8 eye plates on the tray without a steel hook loose beside a speaker cone.",conf:"high"}],ey=[{cat:"chochin lantern",maker:"オゼキ (岐阜提灯協同組合)",model:"尺丸 白張提灯 (径約300mm) 家紋・社号入れ 別注",size:[300,420,300],kg:.35,jpy:14300,qty:2,where:"オゼキ（岐阜提灯協同組合員）ほか浅野商店・平出商店、または岐阜提灯取扱の神具店・Amazon.co.jp出品。家紋/文字入れは受注生産、納期2〜3週間。無地の白張なら在庫品あり。",mount:"The chochin has exactly ONE approved attachment provision: the 吊り手 (steel hanging bail) riveted into the 上輪 (top ring). The 竹ひご+和紙 body has literally no mount points and must never be pierced, clamped, screwed or taped — a screw into the 輪 splits it. Hang from a 真鍮フック or a stainless eye screwed into the kasagi underside, through the 吊り手 only. The 下輪 is a locating ring, not a load path, so nothing hangs off the bottom. For transit the lantern collapses flat (~40mm) and drops into a padded plywood well in the stow deck with a 5mm felt liner and a lid — a hung chochin will beat itself to death against the pillars on the road.",capture:!0,conf:"medium",note:"オゼキ is a real Gifu chochin house — 高山商店, which the first draft named, sells ビニール提灯 and does not make washi lanterns at all; chochin are sold by descriptive spec (size + 張り + 紋), not by catalogue part number, so the 'model' here is the order spec rather than an invented SKU. Rejected 高張提灯 (pole-mounted): the 2m pole exceeds the 1120mm stowed headroom and needs its own stayed base."},{cat:"chochin light source",maker:"generic (岐阜提灯店 取扱)",model:"提灯用LED電池灯 単3×2 電球色 (ちょうちん用LEDローソク)",size:[40,180,40],kg:.08,jpy:2080,qty:2,where:"提灯を買う店で同時手配（岐阜提灯店の付属品棚）、またはAmazon.co.jp「提灯 LED 電池」。在庫品。",mount:"Designed to mount to the chochin and nothing else: the unit is a candle-shaped LED on a base that either sits inside the 下輪 or clips to it with a sprung wire. That clip IS the approved provision — no adhesive, no screws, no modification to the paper or the ribs. Nothing about the chochin is drilled. Battery change is by lifting the unit out through the collapsed lantern's bottom ring.",conf:"medium",note:"Sold by every chochin shop under a dozen names — 「ちょうちん安光」, LC301, 盆提灯用LEDローソク電池灯 — from ¥1,265 to ¥2,090. An order-desk item rather than a SKU, and its 165 to 185 mm length is the figure that matters, because it sets the collapsed lantern's stow depth. Do NOT use a real candle: an open flame in a vermilion-lacquered paper-and-cedar box on a truck bed is a fire, and カシュー coating is solvent-borne."},{cat:"suzu bell",maker:"高岡銅器 (神仏具卸 経由)",model:"本坪鈴 四寸 (φ120mm) 真鍮磨き",size:[122,150,122],kg:1.7,jpy:20700,qty:1,where:"神具店（伊勢・宮忠、翠雲堂ほか）、Amazon.co.jp/楽天の神具専門店出品。四寸は定番在庫、通常3〜7日。",mount:"Cast one-piece bell. The ONLY attachment provision is the integral 吊り環 (cast eye/loop) at the crown — no threads, no flange, no holes anywhere else. Suspend it from an M8 stainless eye bolt bolted THROUGH the kasagi (nut and large washer on top, not a wood screw) with a rated 3mm stainless shackle or a 鈴鐶 between eye bolt and 吊り環. Never bolt through, drill or clamp the bell body — it is a resonator and a hole kills the tone as surely as it kills the casting. Budget 1.7kg plus the 鈴緒's pull load (call it 40kg dynamic when a child hauls on it) into the kasagi; the kasagi therefore needs a hardwood or steel-plated core over the eye bolt, not just 檜.",capture:!0,conf:"medium",note:"Four-sun is small for a public shrine but correct for a hokora at this scale, and it keeps the kasagi load sane. A 六寸 brass bell is ~5kg and would need the eye bolt taken down into the pillar, not the lintel."},{cat:"suzuo bell rope",maker:"神具店 別注品",model:"鈴緒 紅白 太さ36mm × 長さ1200mm 四尺 (麻芯・化繊巻)",size:[36,1200,36],kg:.8,jpy:13200,qty:1,where:"神具店（宮忠ほか）。太さ×長さ指定の別注、納期1〜2週間。既製の1.2m紅白なら在庫あり。",mount:"A rope: no hardware, and that is its correct provision — it terminates in a 上部の環/結び designed to be lashed or hooked to the bell's 吊り環 or to the same shackle. Nothing is fastened to the rope's body. Because it will be pulled sideways as well as down, the shackle above it must be the rated part, not the rope. Stows by coiling into the same plywood ring as the shimenawa; do not leave it hanging in transit — a swinging 800g rope will chip the vermilion off a pillar in one trip.",conf:"medium",note:"Chose 化繊巻 over pure 麻: the piece lives outdoors on a truck and hemp goes furry and grey in one wet season. Length 1200mm is set by the deployed kasagi height minus a comfortable grab at ~1100mm off the deck."},{cat:"offering box",maker:"神具店 (国産檜)",model:"賽銭箱 一尺 (幅303mm) 檜製 格子天板・鍵付",size:[303,250,220],kg:3.5,jpy:45e3,qty:1,where:"神具店（宮忠、神棚の里ほか）、Amazon.co.jp神具専門店出品。一尺は定番、在庫〜2週間。",mount:"Mitred solid-hinoki box: literally no threaded inserts, no flange, no bolt-through provision anywhere. It must be captured, not fastened through its faces. Build a 12mm plywood well in the deck sized 306×223mm with a 3mm felt-lined rebate so it drops in with no rattle, then take two M6 stainless bolts UP through the deck into the box's bottom 桟 (the internal cleats are the only timber with enough meat) — or, if you won't drill the box at all, one ラチェット荷締めベルト over the lid seat into two deck-mounted D-rings. Never screw into the sides or the lid frame: they are 12mm boards and the box is the one item on the module a stranger will put their hands on.",capture:!0,conf:"medium",note:"Sold by 寸 size and material rather than part number. A 一尺 box is deliberately modest — anything bigger reads as a collection tin rather than shrine carpentry, and it also has to clear the 1120mm stowed headroom with the platform folded down over it."},{cat:"sakaki vase",maker:"瀬戸物 神具 (白陶器)",model:"榊立 三寸 白 (高さ約95mm, 口径約45mm)",size:[55,95,55],kg:.15,jpy:660,qty:2,where:"神具店・ホームセンター仏具コーナー（コーナン/カインズ）、Amazon.co.jp。常時在庫、数百円台。",mount:"Glazed ceramic — literally no mount points, and adhesive will not bond reliably to a glazed foot. Capture with a φ58mm × 12mm deep counterbored well routed into the hinoki offering platform, lined with a 2mm EPDM ring so the glaze doesn't chip against end grain. For transit the vases lift out entirely into a foam-cut stow box: a water-filled vase on a moving truck bed is a spill onto the カシュー finish, which will bloom. Fill on site only.",capture:!0,conf:"medium",note:"Cheap and replaceable, which is the point — this is the one item that will get broken. Buy four, install two. Use 造花の榊 (artificial sakaki, ~¥1,000/pair, same shops) rather than cut sakaki unless the piece is deployed the same day."},{cat:"offering stand",maker:"静岡木工 / 神棚の里 (吉野桧)",model:"三宝 六寸 (折敷182mm角) 吉野桧 くり形三方",size:[182,105,182],kg:.5,jpy:2400,qty:1,where:"神具店（宮忠ほか）、Amazon.co.jp神具専門店。六寸は定番在庫。",mount:"Feet only — a three-sided 台 with the traditional くり形 apertures cut through each side and a loose 折敷 top. No fixings, no inserts, and the くり形 are decorative cut-outs, not rated handle apertures, so don't run a strap through them. Capture in a 3mm-deep rebate routed into the platform with a removable hinoki cleat at the rear; the whole stand lifts out for transit and stows flat. If it must stay put, a single stainless 皿ビス up through the deck into the rear foot is the only acceptable fixing — the sides are 9mm and will split.",capture:!0,conf:"medium",note:"六寸 matches the 一尺 offering box and the platform depth. 折敷 alone would be cheaper (~¥2,000) but the 三方 raises the offering off the deck, which is the whole visual point of the platform."},{cat:"gohei / shide",maker:"神具店 (奉書紙・木串)",model:"御幣 中 (高さ約300mm) 木串付 + 紙垂用 奉書紙 半紙判",size:[90,300,30],kg:.05,jpy:3500,qty:2,where:"神具店、Amazon.co.jp神具店出品。奉書紙は書道用品店・伊東屋でも可。在庫品。",mount:"A paper-and-wood object with a 木串 (stick) — it is designed to be stood in the 三方 or slotted into a 台, and that slot is the entire mount story. Drill a φ9mm × 25mm blind hole in a hinoki block let into the platform, or use the 三方. Nothing is fastened to the paper. Treat as a consumable: 紙垂 are hand-cut from 奉書紙 to a standard four-fold pattern and are replaced whenever they get rain-marked — cut a dozen at a time and stow them flat between two boards.",conf:"medium",note:"Sold by size (小/中/大), not part number. The 紙垂 for the shimenawa are separate from the 御幣 and get cut to suit the rope's length — four on a 1200mm 注連縄."},{cat:"shimenawa",maker:"神具店 (合成藁)",model:"注連縄 大根注連 ビニール製 長さ1200mm (径約110mm 中央部)",size:[1200,110,110],kg:1.2,jpy:9800,qty:1,where:"神具店（宮忠、神棚の里ほか）、Amazon.co.jp神具専門店。ビニール製1.2mは定番在庫、3〜7日。",mount:"No fittings at all, and that is correct: a shimenawa is lashed. Bind it to the kasagi at three points with 麻縄 or 3mm白ロープ passed around the rope and through pre-drilled φ8mm holes in the kasagi's top face, knots hidden above. Do not staple, screw, wire or cable-tie through the rope — the twist carries the shape and a fastener through it will unwind a strand within a season. Stowed, it coils to a ~400mm hoop and drops into a plywood ring in the deck well.",conf:"medium",note:"ビニール（合成藁）over 本藁 specifically because this thing lives outdoors on a vehicle: real rice straw sheds, mildews and comes apart in one wet season, and the difference is invisible at two metres. Real straw is the right call only if the piece is rebuilt annually, which is arguably the more respectful answer — worth deciding deliberately rather than by default."},{cat:"shrine curtain",maker:"神具店 (テトロン製)",model:"神棚幕(神前幕) 巴紋 紫 巾三尺(900mm) × 丈一尺(300mm) テトロン",size:[900,300,5],kg:.4,jpy:3080,qty:1,where:"神具店（宮忠ほか）、Amazon.co.jp神具専門店。既製三尺は在庫、紋替え別注は2週間。",mount:"Sewn 乳 (chi — cloth loops) along the top hem, typically five to seven on a three-shaku curtain. Those loops are the ONE approved provision. Thread a φ6mm stainless rod or a taut rope through the 乳 and support the rod on two brass hooks in the pillars, or on the nuki itself. Never pin, staple, screw, clip or velcro the cloth — the 乳 exist precisely so nothing pierces the field, and a 巴紋 with a hole through it is worse than no curtain. In transit the curtain comes off the rod, rolls (not folds — creases across the 紋 are permanent in テトロン) around a 50mm tube and stows in the dry box.",conf:"medium",note:"テトロン rather than 綿: it sheds rain, doesn't shrink and holds vermilion dye against UV, which matters when the module spends its life outdoors. Width is set at 900mm to match the torii's clear span between pillar inner faces."},{cat:"shinkyo mirror",maker:"神具店 (真鍮鏡 + 木製雲形台)",model:"神鏡 二寸 (鏡径60mm) 雲形台付",size:[95,125,30],kg:.35,jpy:4950,qty:1,where:"神具店、Amazon.co.jp神具専門店、ホームセンターの神具コーナー。二寸は定番在庫。",mount:"Two parts, and only one of them can be touched. The 鏡 itself has literally no mount points — it drops into a machined slot in the 雲形台 and is held by fit alone. The 台 has feet only: no inserts, no flange. Capture the 台 in a 3mm rebate routed into the 御神体棚 with a hinoki fillet in front, or run one M4 stainless 皿ビス up through the shelf into the 台's solid base block — the base is the only part with acceptable meat, and never into the cloud carving, which is 6mm and cross-grained. The mirror lifts out for transit; a 60mm brass disc rattling in a wooden slot over 1940mm of leaf-sprung kei truck will polish its own edge off.",capture:!0,conf:"medium",note:"二寸 is small but sized to the hokora's internal height; a 三寸 (¥8,000-ish) would crowd the 三方 in front of it."},{cat:"shrine lantern",maker:"神具店 (木製神前灯籠)",model:"LED神前灯籠 木目屋根 6号 電池式 (高さ約250mm)",size:[120,250,120],kg:.4,jpy:6139,qty:2,where:"神具店、Amazon.co.jp神具専門店。コード式(AC)は定番在庫、電池式は取扱店が限られ要確認。",mount:"Wooden lantern on a turned or blocked base. AC (コード式) versions have a φ8mm cord grommet hole through the base which doubles as a usable bolt-through provision — an M6 stainless bolt up through the platform into a T-nut in the base. Battery versions typically have feet only and literally nothing else, in which case capture in a shallow 3mm well with a rear cleat. Do not screw into the 火袋 (the paper/shoji light box): it is 4mm frame stock. Whichever version, the lantern lifts out for transit.",capture:!0,conf:"medium",note:"I could not confirm a battery-powered 神前灯籠 as a current stocked line — the standard product is コード式 for a kamidana. If the battery version doesn't exist at order time, take the AC pair and run them off the Jackery's AC outlet through a short cord dressed inside a pillar, or drop this line entirely and let the Snow Peak lanterns do the night work. Marked low deliberately: real category, unconfirmed current variant."},{cat:"LED uplight",maker:"スノーピーク (Snow Peak)",model:"たねほおずき ES-041",size:[62,75,62],kg:.095,jpy:4400,qty:3,where:"スノーピーク直営/オンラインストア、Amazon.co.jp、ヨドバシ.com、好日山荘。定番在庫、当日〜翌日。",mount:"Two designed attachment provisions and no drilling: an integrated MAGNET in the base, and a shock-cord loop with a moulded hook at the top. Hang two from small brass hooks screwed into the underside of the nuki (they weigh 55g — a 4×15 brass screw is ample), and magnet the third to a 20mm × 2mm steel washer let flush into the underside of the kasagi and secured from above, so nothing steel is visible. The housing is a sealed IPX4 shell: do not drill it, do not clamp it, do not glue it. Runs on 3 × AAA, so it is independent of the power station — the shrine still lights if the battery is flat.",conf:"medium",note:"Product and mount features I'm confident in; dimensions and current price estimated. Chose these over a mains LED strip because the warm dimmable glow reads as lantern light rather than display lighting, and because the magnet-and-hook mount means zero fasteners into the vermilion work. Snow Peak ほおずき ES-070 (larger, ~¥8,000) is the alternative if you want one bright source instead of three soft ones."},{cat:"power station",maker:"Jackery",model:"Jackery ポータブル電源 300 Plus (288Wh / AC300W)",size:[230,167,155],kg:3.75,jpy:29800,qty:1,where:"Jackery Japan公式 (jackery.jp)、Amazon.co.jp、ヨドバシ.com。在庫潤沢、実売はセールで¥25,000前後。",mount:"Moulded carry handle and rubber FEET ONLY — literally no threaded inserts, no bolt-through holes, no rack ears, no flange. The case is the battery enclosure and must never be drilled or screwed into. Capture it: a 12mm plywood well 236×160mm × 60mm deep, lined with 10mm EVA foam, with the vents unobstructed on the fan side, plus one ラチェット荷締めベルト over the top into two deck D-rings — or two 面ファスナーベルト through slots cut in the well walls. Orient it so the AC outlet faces the pillar cable route, and leave 50mm clearance at the fan end. It lives in the truck; it is not part of the fold-out.",capture:!0,conf:"high",note:"Confirmed today that jackery.jp's current catalogue carries a 288Wh unit in this class (listed there as Explorer 300D alongside the 300 Plus lineage) — check which designation is actually orderable at purchase. 288Wh is generous for the load: two LED lantern pairs plus a phone is under 20W, so this is several nights. Rejected anything over 500Wh purely on mass — every kg here is a kg not available for copper and hinoki."},{cat:"timber - framing/pillars",maker:"国産檜 (ホームセンター規格材)",model:"ヒノキ 角材 45×45×1820mm 節有",size:[45,1820,45],kg:1.6,jpy:1780,qty:6,where:"コーナン/カインズ/ジョイフル本田 木材売場。常時在庫、店頭カット可。無節・上小節は木材屋で別注（3〜4倍価格）。",mount:"Raw stock — this is the structure everything else mounts TO, not a bought fitting. Where fold hinges land, install 鬼目ナット (M6 threaded inserts, Eタイプ) into the end grain and faces rather than relying on wood screws: the torii pillars will be raised and lowered hundreds of times and a screw thread in hinoki strips after a few dozen cycles. Count on 8 × M6 inserts per pillar foot. Where the suzu's eye bolt passes through the kasagi, laminate a hardwood or 3mm steel core into the member first — 檜 alone will crush under a 40kg pull.",conf:"medium",note:"1820mm (六尺) is the standard sold length and it lies down the 1940mm bed diagonal-free when stowed, which is why the torii is 1820-based. Deployed, the pillars stand well above the 1120mm stowed headroom — that is the whole trick of the module. Spruce/SPF (1×4 19×89×1820, ~¥600) is real and half the price but goes grey and fuzzy under vermilion; hinoki is the honest choice for a piece meant to read as shrine carpentry."},{cat:"timber - floor/platform",maker:"国産檜 (集成材)",model:"ヒノキ集成材 910×450×15mm",size:[910,15,450],kg:2.7,jpy:4980,qty:2,where:"コーナン/カインズ/ジョイフル本田 木材売場、DIY通販。定番サイズ、在庫品。",mount:"Board stock, not a fitting. This becomes the raised offering platform and every captured item lands in a well routed into it: φ58 wells for the 榊立, a 3mm rebate for the 三方, a rebate and fillet for the 神鏡台. Rout all wells BEFORE finishing. Underside gets the T-nuts and D-ring backing plates so no fastener head shows on the visible face. Seal the end grain — a 15mm glulam panel left raw on a truck bed will cup within a season.",conf:"medium",note:"集成材 rather than solid 一枚板 specifically for dimensional stability: a solid 450mm-wide hinoki board will move 4-5mm across the grain between a Tokyo August and a February, which will jam every rebate and crack the vermilion at the joints. Solid hinoki is more correct traditionally and the right answer if the piece is built to be re-fettled each year."},{cat:"roofing - copper sheet",maker:"銅板 圧延材 (C1100 タフピッチ銅)",model:"銅板 t0.35 × 365 × 1200mm",size:[365,1,1200],kg:1.4,jpy:7800,qty:4,where:"MonotaRO 金属素材、または板金材料商・金物店。t0.3〜0.4の一文字葺き用は定番。銅相場連動で価格変動大、要都度見積。",mount:"Raw sheet — literally no mount points, and correctly so: a copper roof is never fastened through its visible face. Each of the six facets gets its copper folded over the plywood substrate's edges (掴み込み) and held by 銅製吊子 (copper cleats) nailed into the ply behind, so the weather surface stays unpierced. CRITICAL for a folding roof: the copper must STOP SHORT of every hinge line. Terminate each facet's sheet 15mm back from the fold, hinge the plywood beneath, and cover the joint with a loose copper cap flashing fixed on ONE side only so it slides as the facet swings. Copper folded repeatedly across a hinge work-hardens and cracks within a few dozen cycles — the hinge lives in the ply, never in the metal.",capture:!0,conf:"medium",note:"t0.35 is a real roofing gauge and stiff enough not to oil-can over 350mm facets. Four sheets covers ~1.75m² of facet with folding allowance. Genuine copper over copper-look ガルバリウム because the whole point is that it will go brown then green over a decade; the coated steel alternative (~¥2,500/sheet, a third the mass) is defensible if payload or budget bites, but it will never patinate."},{cat:"roofing fasteners",maker:"銅製 (板金用)",model:"銅釘 25mm (平頭) 1kg箱 + 銅製吊子 60mm 100枚",size:[150,80,100],kg:1.6,jpy:1e4,qty:1,where:"MonotaRO、板金材料商、金物店（浅草橋・蔵前の建築金物店）。在庫品。",mount:"Consumable fastener — it is the mount provision for the copper above. Nails go through the 吊子 into the 12mm plywood substrate only, never through the visible copper face. MUST be copper, not steel and not galvanised: dissimilar metals in contact with a copper roof set up galvanic corrosion, and the runoff will stain the vermilion below within a single wet season — the green streak down a red pillar is the classic tell of a roof fastened with the wrong nails. Same rule applies to any screw within the copper's drip line: brass, copper or 316 stainless only.",conf:"medium",note:"Real product category stocked by every 板金材料商; I could not confirm a current SKU or price without web access, so treat the figure as a counter order. Buy the cleats and nails from the same supplier as the sheet."},{cat:"finish - vermilion",maker:"カシュー株式会社",model:"カシュー 自然乾燥 NO.69 朱 (T011-22-7569) 1kg + 専用下塗り 1kg + うすめ液",size:[110,150,110],kg:1.2,jpy:19e3,qty:2,where:"Amazon.co.jp、東急ハンズ、塗料専門店（大阪・道具屋筋、東京・新橋の塗料店）。1kg缶は在庫品。色番号は発注時に要確認。",mount:"Not a mounted item — a coating. Stated for completeness: it goes on the hinoki pillars, kasagi and nuki after the 鬼目ナット inserts are fitted, not before, or the threads fill with lacquer. Mask every insert and every mating face of a fold joint; カシュー builds a film thick enough to bind a 0.3mm-clearance hinge pocket shut. Three coats over the primer, sanded between, and give it a full week to harden before the module is folded for the first time.",conf:"medium",note:"カシュー is a genuine cashew-nutshell lacquer sold in consumer cans and is the standard urushi-look coating for shrine and temple work in Japan — but I could not verify the current colour number for 朱 against a live page, so specify by colour name at the counter and do not order against a guessed number. The traditional alternative is 弁柄 (bengara) iron-oxide pigment ground in 荏油 or 柿渋: cheaper, properly matte, historically correct for a wayside hokora, and far less durable on a piece that lives on a vehicle. Solvent-borne — mask the copper, and never bring the LED candles near a wet coat."},{cat:"hardware - fold hinges",maker:"モノタロウ (own brand)",model:"ステンレス 平丁番 51×51×t1.0mm (2枚入)",size:[51,51,2],kg:.05,jpy:480,qty:12,where:"MonotaRO、コーナン/カインズ金物売場。定番在庫、翌日出荷。",mount:"The hinge IS mount hardware — four φ4.5mm countersunk holes per leaf, drilled and dished for 木ネジ, which is its designed and only provision. Into 15mm hinoki that is fine with M4×20 stainless 木ネジ. Into the 12mm plywood roof substrate, do NOT use wood screws: fit 鬼目ナット M4 inserts from the back face and bolt through, because these six facet joints are the ones cycled every single deployment and a stripped screw in ply end-grain is unrepairable in the field. Stainless or brass only — anything zinc-plated within the copper roof's drip line will streak the vermilion.",conf:"low",note:"Generic-but-real MonotaRO own-brand stock rather than a guessed model number; confirm the item code at order. If the facets need to hold an intermediate angle rather than flop, スガツネ (Sugatsune/LAMP) torque hinges and their LDD-S soft-down lid stays are the right upgrade — both makers' sites are reachable and their catalogues carry rated equivalents, but I could not pin a specific part number this session, so I have specified the honest plain hinge and flagged the upgrade."}],ty=[{cat:"sleeping / bunk mattress",maker:"DOD (ディーオーディー)",model:"ソトネノキワミ M / CM2-650 (1150 × 2080 × 100)",size:[1150,100,2080],kg:6.3,jpy:27500,qty:1,where:"DOD公式オンラインストア / ヨドバシ / Amazon.co.jp。M は現在 販売終了、後継は同幅の ソトネノキワミエアー。",mount:"Literally no mount points — a TPU-welded bladder in a fabric shell whose only hard feature is the inflation valve boss, which is a seal and not an anchor. Capture it geometrically: rout the cabover bunk deck as a shallow well with a 12 mm ply kerb 60 mm proud all round, so the mat cannot walk while the bunk slides its 950 mm. For travel add two 25 mm webbing straps on Fastex buckles across the mat, anchored to M6 rivet nuts set into the deck outside the kerb. Nothing is screwed, stapled or hooked into the mat itself.",capture:!0,conf:"medium",note:"DOD list nine ソトネノキワミ SKUs — S/M/L across two tiers — and no D; the D in the first draft was invented, and that is exactly the kind of part number that reads plausible and buys the wrong thing. The M at 1150 wide is also the one that FITS: the L is 1380, and a 1380 mat on a 1280 bunk rides up the sides all night."},{cat:"sleeping / lower platform + day bench",maker:"マニフレックス (Magniflex)",model:"メッシュ・ウィング セミダブル (tri-fold high-resilience Elioce core)",size:[1170,110,1980],kg:8,jpy:47300,qty:1,where:"マニフレックス正規販売店 / Amazon.co.jp / 楽天。Made to order in some colours — allow 1-2 weeks.",mount:"No mount points; a foam block in a zipped removable cover, and the zip is not structural. Two capture modes. Flat: the same 12 mm ply kerb around the main 1940 mm deck section holds it. Folded into a day bench: two 50 mm cam-buckle straps pass right around the tri-folded block and hook to two M8 stainless D-rings bolted through the floor deck on 40 x 40 x 3 mm backing plates. Do NOT screw hinges, snap studs or Velcro plates to the cover — the cover is meant to come off and be washed, and a fastener through it tears the foam edge.",capture:!0,conf:"medium",note:"Folds in three so the same mattress is the mattress at night and the deck bench by day, which is the whole reason for a tri-fold over a one-piece. Rejected a 敷き布団: cotton futon in a pop-top with a fabric bellows will mildew in a Japanese summer. Price and weight for the SD size are approximate."},{cat:"sleeping / bags",maker:"スノーピーク (Snow Peak)",model:"セパレートオフトンワイド700 / BDD-103",size:[250,250,500],kg:2.05,jpy:44800,qty:2,where:"Snow Peak直営 / Amazon.co.jp / ヨドバシ / 好日山荘。Seasonal stock; commonly available, allow a week in peak season.",mount:"No mount points at all beyond the stuff sack's drawcord and its two compression straps — those are for compressing the bag, not for restraining mass, though at 1.65 kg the mass case is trivial. Stow both bags in the cabover nose locker (the dead volume ahead of the sleeping area once the bunk is run out) behind a 6 mm shockcord net laced to six M5 eye bolts in rivet nuts around the locker mouth. Nothing is fixed to the bag.",capture:!0,conf:"medium",note:"Futon-form bag rather than a mummy: the two unzip into quilts and zip to each other, which is what you actually want on a fixed 1280 mm double platform. Rejected NANGA オーロラライト 600DX (lighter, warmer, ~2x the price and it fights a shared platform). Model code BDD-104 and price believed current but unverified."},{cat:"soft goods / pop-top bellows",maker:"富士金梅 (川島商事)",model:"11号帆布 (paraffin-finished cotton canvas, 920 mm bolt width)",size:[1900,400,1250],kg:3.2,jpy:11500,qty:1,where:"生地の森 / 帆布屋 / オカダヤ新宿本店 — sold by the metre off the bolt; buy an 8 m cut for a 6.3 m lid perimeter at 400 mm rise plus seam and keder allowance. In stock, cut to order.",mount:"Fabric has no fixings whatsoever, so ALL load goes into mechanical capture at both edges. Sew a 6 mm polypropylene keder (welt) cord into the top and bottom hems, then slide each hem into an aluminium keder/awning rail — Misumi extruded profile or a Takigen weatherstrip channel — screwed to the pop-top lid rim and to the shell top rail with M4 x 12 stainless pan screws into rivet nuts at 100 mm centres, on a continuous butyl tape bead. Corners get a moulded radius in the rail, never a mitre. Never staple the canvas and never trap it under a flat batten: a batten pulls out of the weave in one gust.",capture:!0,conf:"medium",note:"11号 (~430 g/m2) is the lightest 帆布 that still stands up as a bellows wall. Real trade-off: cotton canvas breathes beautifully and folds flat, but it will mould in a Kanto summer if you close the lid wet. The right upgrade is Sunbrella marine acrylic or a PU-coated polyester from 平岡織染 — I could not pin a current 平岡織染 pattern code this session, so the 帆布 is the safe named answer. Metre price and finished weight are estimates."},{cat:"soft goods / flyscreen",maker:"ダイオ化成 (Dio Chemical)",model:"クラウンネット 24メッシュ グラスファイバー グレイ 910 mm × 6 m",size:[910,1,6e3],kg:.5,jpy:1280,qty:1,where:"コーナン / カインズ / ジョイフル本田 の網戸コーナー、または MonotaRO。Sold by the metre or as a 910 mm x 2 m pack. Always in stock.",mount:"No fixings. Two approved captures depending on the opening. Fixed openings (the S4 window bays already carry their own cassette screens, so this is for the kerb-wall opening): tension the mesh into a groove in an aluminium screen frame with standard 網戸用ゴム glazing spline, and screw the FRAME, not the mesh, to the opening. Removable deck screen: sew the mesh to a 25 mm YKK #5 coil zip on three sides and to a hook-and-loop tape strip on the fourth; the loop tape is bonded to the framing with 3M VHB and the mesh never sees a screw or a grommet.",capture:!0,conf:"medium",note:"Glass-fibre 24-mesh rather than 18-mesh polyester: 24 stops ヌカカ/ブヨ, and glass fibre does not sag after a summer stretched over a warm kerb wall. Cheap and replaceable, which is the point — it is the part that gets torn."},{cat:"soft goods / blackout",maker:"ブラームス (BRAHMS)",model:"ブラインドシェード ハイゼットトラック S500P/S510P フロント3面セット",size:[1300,15,700],kg:1.2,jpy:19580,qty:1,where:"アイズ公式 / Amazon.co.jp / 楽天。Vehicle-specific, cut to pattern — allow 1-2 weeks if the S500P/S510P pattern is not on the shelf.",mount:"No fixings, and that is the design: a semi-rigid mesh panel with neodymium magnets sewn into the hem that grip the painted steel window surround of the cab. Nothing is screwed, suckered or taped to glass. This covers the cab only — the camper shell's own glazing does NOT need a separate curtain track, because the Dometic S4 windows below carry an integral Rastrollo pleated blackout in the inner frame. That avoids a curtain rail across the kerb opening, which the canopy already shades.",capture:!0,conf:"medium",note:"Confirm the pattern matches your cab generation (S500P/S510P vs the older S201P) before ordering — an aiz shade is cut per body code and will not fudge. Price estimated."},{cat:"cooking / stove",maker:"岩谷産業 (Iwatani)",model:"カセットフー タフまる CB-ODX-1",size:[343,129,284],kg:2.4,jpy:9800,qty:1,where:"ヨドバシ・ドット・コム / Amazon.co.jp / コーナン / カインズ。Staple item, always in stock.",mount:"No threaded inserts, no bolt holes, no flange — a sheet-steel body on four rubber feet, and the maker explicitly forbids modifying or enclosing it. Capture, do not fasten: rout a 350 x 290 x 25 mm well into the deck worktop lined with 1.0 mm stainless, so the stove drops in and cannot slide while cooking on the fold-down deck. For travel, one 25 mm cam strap over the body to two M6 rivet-nut D-rings either side of the well. The CB-250-OR cassette must be removed and stowed separately before driving — the magnetic cartridge holder is a gas seal, not a travel restraint, and a cartridge left in a hot cab is the single worst failure mode in this whole module. Keep 150 mm clear of any wall and never build a surround.",capture:!0,conf:"high",note:"Double windbreak ring and a wide-body burner mean it actually works on an open deck, which the flat ジュニアバーナー does not. Iwatani has no true twin-burner cassette stove in this class; two タフまる is the honest twin-burner answer if you need it, at 4.8 kg."},{cat:"water / tank",maker:"モノタロウ (MonotaRO)",model:"ポリタンク 白 20L (食品衛生法適合)",size:[350,416,178],kg:1.4,jpy:3078,qty:2,where:"MonotaRO (own-brand polytank, 20 L white food-grade). Next-day in Tokyo. コーナン PRO equivalent is interchangeable.",mount:"Handle aperture and the moulded body — no inserts, no flange. The moulded handle is rated to carry 20 kg by hand and nothing more, so it is a strap route, not a structural anchor. Build a three-sided 12 mm ply well under the fold-down deck sized 360 x 245 per tank with a hinged ply lid closing the fourth side, and run one 25 mm webbing strap through each handle to an M8 eye bolt through the floor on a 40 x 40 x 3 mm washer plate. 40 kg of water is the largest movable mass in the module and it sits high in a short-wheelbase kei truck — strap it, and put it as far forward and as low as the deck allows.",capture:!0,conf:"medium",note:"Two 20 L tanks rather than one 40 L: 20 kg is the most a person carries to a tap, and one tank can be the grey-water catch. Generic own-brand deliberately, per the no-invented-model rule — a コーナン or ヒシエス equivalent is the same part. Price is per tank."},{cat:"water / pump",maker:"SEAFLO",model:"SFDP1-012-035-21 12V ダイヤフラム自吸式給水ポンプ (約4.5 L/min, 35 PSI, 圧力スイッチ付)",size:[180,100,100],kg:1.2,jpy:8800,qty:1,where:"Amazon.co.jp (SEAFLO日本正規取扱) / 楽天。In stock. Exact SFDP1 suffix (flow/pressure variant) must be confirmed at order — do not order on the designation above alone.",mount:'Four M5 bolt-through holes in the moulded base plate, on rubber isolator bushes — that IS the approved and only mount, and the isolators are the reason it is quiet. Bolt through 12 mm ply with M5 x 30 stainless and nyloc nuts, tightened until the bush just seats and NO further; crush the rubber and the whole shell becomes a soundboard at 3 a.m. Never clamp the pump head or the motor can. Plumb both ports with 1/2" flexible hose and a short loop, not rigid pipe, or the isolators are bypassed.',conf:"medium",note:"Confidence is low only on the exact SFDP1 variant code — SEAFLO is a real, widely stocked brand and any 3-4 L/min 12 V diaphragm pump with a pressure switch works here. Rejected the foot pump (Whale Babyfoot GP4618, four bolt-through feet, no electrical load) purely because the sink sits on the deck and a foot pump wants a fixed footwell. A foot pump is the better answer if you want zero draw."},{cat:"water / sink",maker:"カクダイ (KAKUDAI)",model:"丸型手洗器 φ300 × 深100（はめ込み／アンダーカウンター仕様）+ 折りたたみ水栓",size:[300,100,300],kg:1.4,jpy:25e3,qty:1,where:"カクダイ取扱の水道材料商 / モノタロウ。493-338 は同寸の置型（オーバーカウンター）で、そちらは在庫豊富。",mount:"A drop-in bowl hangs on its own rim and is pulled down onto a silicone bed by four clips under the worktop — the rim IS the fixing and there is no other. Cut the 40 mm top for a 290 mm hole and take a 30 x 3 mm hardwood ring right round the underside of the cut, because a 300 mm hole in a 1800 mm worktop over a slide-out galley is a hole where the stiffness was, and the ring puts it back.",conf:"low",note:"The verified over-counter part, カクダイ 493-338, stands 100 mm PROUD of the top. There is no 100 mm to be had here: the bunk deck hangs 40 mm above the worktop when the lid is down, so nothing on this counter may stand up at all. That is also why the tap folds and the hob lives in the locker. Price is carried across from 493-338; the drop-in variant is the same bowl in a different rim and will be within a few thousand yen either way."},{cat:"cold / 12V compressor fridge",maker:"澤藤電機 (ENGEL)",model:"MHD14F-D (14 L, DC12/24V + AC100V, swing motor)",size:[442,398,284],kg:11.5,jpy:64900,qty:1,where:"ENGEL正規販売店 / Amazon.co.jp / ヨドバシ。Usually in stock; ENGEL runs periodic backorders on the small bodies, allow 2 weeks.",mount:"The case has moulded carry handles and moulded feet, and no threaded inserts anywhere on the shell — the swing compressor and its charge sit directly behind that skin, so a screw into the case is a scrapped fridge. ENGEL's own tie-down bracket, which captures the case rather than piercing it, is the sanctioned hardware; absent that, build a three-sided 12 mm ply cradle with a 15 mm EVA foam liner and run two 25 mm cam straps over the lid seam to four M6 rivet-nut anchors in the deck. Leave 50 mm clear air at the condenser end and do not box it in — a fridge in a sealed locker in a Japanese August draws its rated current continuously and flattens the DELTA 2 overnight.",capture:!0,conf:"medium",note:"Chosen for mass, not volume: a swing-motor ENGEL at 9.5 kg and ~1 A average is the cheapest cold per kilo here, and it is a Japanese product with Japanese service. 14 L is genuinely small for two people — the honest upgrade is the ENGEL MT-series or a Dometic CFX3 25 at ~12.7 kg and roughly +35,000 yen. Dimensions and price estimated."},{cat:"power / battery station",maker:"EcoFlow",model:"DELTA 2 (1024 Wh LiFePO4, 1500 W AC出力)",size:[400,281,211],kg:12,jpy:11e4,qty:1,where:"EcoFlow公式ストア / Amazon.co.jp / ヨドバシ。Always in stock, frequently discounted below list.",mount:"Literally no mount points — moulded shell, two recessed grab handles, four rubber feet, and the handles are explicitly NOT rated tie-downs. Floor-mount it at the bulkhead in a 410 x 220 mm ply well with 20 mm EVA underneath, restrained by two 38 mm cam-buckle straps passing over the case (over the body, not through the handles) down to four M8 stainless eye bolts through the plinth into a 4 mm steel backing plate. Keep it on the floor and forward: 12 kg loose at bunk height in a rollover is the argument that decides this. Its vents are on the two short ends — 100 mm clear both ends or it throttles.",capture:!0,conf:"high",note:"LiFePO4 matters more than the headline Wh in a vehicle that will bake in a コインパーキング. Rejected Jackery 1000 New (1070 Wh, 10.8 kg, near-identical) only because DELTA 2's XT60 solar input and the WAVE 2 pairing keep the whole electrical side one ecosystem. Running the WAVE 2 aircon flat out, this is roughly 1 hour — plan a DELTA 2 Extra Battery or accept the fan-only night."},{cat:"power / solar",maker:"Renogy",model:"100W フレキシブルソーラーパネル（単結晶・薄型）",size:[1050,3,540],kg:2,jpy:19800,qty:2,where:"Renogy Japan公式 / Amazon.co.jp。In stock. Confirm the current flexible-series part code at order — Renogy renumbers the flexible line often.",mount:"The panel ships with six pre-drilled 8 mm grommet holes around the perimeter, and on a pop-top lid you must NOT use them. Through-bolting a flexing FRP lid gives you six leak paths and a cracked cell layer inside two seasons. Approved method here is a full-face adhesive bond: abrade and prime the lid, lay continuous beads of Sikaflex-252 (or 3M VHB 5952 tape in a grid), weight the panel down for 24 h, then fillet the whole edge with Sikaflex-221 so no water sits under the laminate. Cable exits through a proper deck gland, not a drilled hole with sealant smeared over it. Two panels, one each side of the roof vent.",conf:"medium",note:"Semi-flexible at 2.0 kg each rather than a 100 W rigid framed panel at 7 kg: the pop-top lid rises on its own props and every kilo up there is a kilo the props and the bellows fight. Trade-off is real — bonded flexible panels run hot against the lid and lose 10-15% yield versus an air-gapped rigid frame, and they are not repairable. 200 W is roughly a day's fridge plus lights in Kanto shoulder season."},{cat:"climate / air conditioner",maker:"EcoFlow",model:"WAVE 2 (ポータブルエアコン, 冷房 5100 BTU / 暖房 6100 BTU)",size:[518,336,297],kg:14.5,jpy:143e3,qty:1,where:"EcoFlow公式ストア / Amazon.co.jp。In stock, heavily discounted in autumn.",mount:"No mount points: four rubber feet, two side grab handles, and moulded duct collars — the collars take ducting only and will not take load. It rides on the floor at the tailgate end in a 530 x 310 mm ply well and straps down with two 38 mm cam straps to M8 eye bolts through the deck on backing plates. In use, the hot-side exhaust duct passes through a 130 mm bulkhead port cut in the deck face and closed with a ply blanking plug when stowed; condensate drains through the spigot into a hose exiting the floor through a bulkhead gland. Never run it ducted into the cabin volume it is cooling.",capture:!0,conf:"medium",note:"It fits the weight budget but it eats the whole energy budget: ~1 hour on the DELTA 2 alone, so this is a hook-up-site and shoulder-season item, or it needs the DELTA 2 Extra Battery. The honest alternative for a free camp is the MaxxFan below on reverse-draw plus the flyscreen — that is 3 W, not 500. Included because you asked whether one exists in budget: it does, at 14.5 kg."},{cat:"lighting / 12V LED",maker:"汎用 (モノタロウ / Amazon.co.jp 取扱)",model:"12V LEDテープライト 電球色 3000K IP65 5 m + アルミチャンネル・拡散カバー 1 m × 4",size:[5e3,12,10],kg:.4,jpy:4200,qty:1,where:"モノタロウ / Amazon.co.jp。常時在庫。チャンネルは 1 m 押出材を切って使う。",mount:"Self-adhesive backing, which is not a fixing on a vehicle: 3M tape lets go the first hot afternoon over a galley. Run the tape inside an anodised aluminium channel and screw the CHANNEL to the carcass with M3 countersunk into pilot holes every 250 mm. The channel is also the heatsink and the diffuser, so it is not trim.",conf:"low",note:"The first draft named an エーモン 12 V tape at 600 mm. amon make 15, 30 and 45 cm only — 2704, 2705, 2709 — and their white is 8000 K, which is a headlamp colour and wrong for a bed. A generic 3000 K reel in channel is what actually gets fitted."},{cat:"safety / CO alarm",maker:"輸入品 (Amazon.co.jp / モノタロウ 取扱)",model:"一酸化炭素警報器（EN 50291 または UL 2034 表示の電池式）",size:[100,100,35],kg:.2,jpy:4e3,qty:1,where:"Amazon.co.jp / モノタロウ。国内メーカー品が存在しないので、輸入品を EN/UL 表示で選ぶ。",mount:"Keyhole slots and two screws into the wall — a real fixing, and it belongs at head height near the bunk rather than at floor level: CO is close to air density and a low mount is a smoke-alarm habit applied to the wrong gas.",conf:"low",note:"The first draft credited this to 新コスモス電機 with EN 50291. They make 住宅用火災警報器 and industrial CO detectors, not a household CO alarm, and Japan has no approval scheme for one at all — EN 50291 is European. So it is an imported EN- or UL-marked unit, bought on that marking. Fit a 住宅用火災警報器 as well: a cassette stove in a 2.7 m² box with the lid down is the one place on this truck where both matter."},{cat:"ventilation / roof vent",maker:"MaxxAir",model:"MaxxFan Deluxe 6200K (10段可変・双方向・リモコン・雨天走行可能フード)",size:[586,236,417],kg:4.5,jpy:72e3,qty:1,where:"オグショー (OGUshow) / VANTECH / Amazon.co.jp の並行輸入。Often on backorder from the US — allow 2-4 weeks. Fiamma Turbo-Vent Premium is the直接的な代替 at a similar price.",mount:`The flange IS the mount, and this is the one item that dictates structure before it dictates hardware. Cut a 355 x 355 mm (14" x 14") opening in the hard shell roof — the fixed shell, not the pop-top lid, which flexes and would work the seal loose. Frame a 30 x 30 mm hardwood kerb right around the opening and laminate it in BEFORE cutting the skin. Bed the vent's outer flange on continuous butyl tape and screw through with #8 x 25 mm stainless pan screws at ~100 mm centres into that kerb, then fillet the flange edge with a self-levelling roof sealant. The internal garnish ring screws up into the flange from below and is what carries the ceiling lining — it takes trim weight only.`,conf:"medium",note:"The lid design is the reason for this over a plain 40 x 40 vent: it runs open in rain and at speed, so you can drive with it extracting. It is also the whole fan strategy — reverse-draw plus the deck flyscreen is 3 W of cooling versus 500 W for the WAVE 2. Price is a Japanese parallel-import estimate; the US list is far lower."},{cat:"glazing / camper windows",maker:"Dometic (Seitz)",model:"SEITZ S4 900 x 450（アクリル二重窓・網戸+遮光プリーツ内蔵）",size:[900,450,60],kg:8.5,jpy:68e3,qty:2,where:"オグショー / ホワイトハウス / VANTECH ほか国内キャンピングカー部材商社。Made-to-order sizes; allow 3-6 weeks from Europe.",mount:"A sandwich-clamp frame — no fastener ever touches the acrylic, which is the entire point of buying a caravan window rather than glazing a hole yourself. The outer frame goes in from outside onto a bead of butyl/sealant; the inner frame, which carries the Rastrollo pleated blackout blind and the cassette flyscreen, screws to the outer frame from inside and clamps the wall between the two. S4 accepts a wall thickness of roughly 26-42 mm, so the off-side wall core MUST be built to that band or the window simply will not clamp — decide the window before you decide the panel sandwich. Cut-out is nominal size +2 mm with radiused corners; square corners crack the panel skin.",conf:"medium",note:"One in the off-side wall and one in the rear door. These carry the blackout and the bug screen internally, which is why no curtain track is needed anywhere in the shell — a track across the kerb opening would hang in the doorway. The acrylic scratches and yellows and is the maintenance item; that is the accepted price for 5.5 kg instead of ~14 kg of glass. Price and mass per unit are estimates."},{cat:"safety / fire extinguisher",maker:"モリタ宮田工業 (Morita Miyata)",model:"MVF1HB 住宅用消火器「キッチンアイ」（強化液・中性 1.0 L）",size:[85,375,145],kg:2.2,jpy:5800,qty:1,where:"コーナン / カインズ / Amazon.co.jp / MonotaRO。In stock. Note the 5-year design life stamped on the body.",mount:"Supplied with its own wall hanger/bracket — that bracket is the approved provision and the only one; the cylinder itself has no fixing feature and must never be banded, clamped or hose-clipped to a frame member, because a dent in a pressurised cylinder wall is a condemned extinguisher. Screw the bracket with two M5 pan screws into a hardwood or 18 mm ply pad, not into shell skin. Site it within 600 mm of the deck edge so it is reachable from OUTSIDE the camper — a fire at the stove is between you and an extinguisher mounted deep inside.",capture:!0,conf:"medium",note:"Wet-chemical/強化液 rather than ABC powder on purpose: powder in a 1120 mm-headroom box coats every soft good you own and the fire you are actually planning for is a cassette-stove cooking-oil fire, which is what 強化液 is formulated for. Exact catalogue suffix not verified this session — buy on the 住宅用消火器 marking and the 天ぷら油 rating."},{cat:"safety / first aid",maker:"日進医療器（リーダー）",model:"救急セット（携帯用ケース入り）",size:[270,90,190],kg:.9,jpy:3200,qty:1,where:"MonotaRO / Amazon.co.jp / マツモトキヨシ。In stock. A 白十字 or ミドリ安全 kit of the same class substitutes directly.",mount:"A soft or moulded case with a carry handle and no fixings of any kind. Two options, both non-invasive: bond a 100 mm strip of loop tape into a shallow wall pocket and a matching hook strip to the case back (the case is the consumable, not the wall), or stow it in the same cabover nose locker as the sleeping bags under the shockcord net. It must be findable in the dark from the bunk — put it at the head end, not in the deck locker.",capture:!0,conf:"medium",note:"Restock it as a camper kit rather than a car kit: add burn gel for the stove, tweezers and a triangular bandage, and keep a 保険証 copy and the 消防 119 procedure card in the lid. Whole-module mass runs roughly 90 kg dry plus 40 kg of water, before the shell structure itself and two occupants — against a 350 kg payload the shell is the number to watch, not this list."}],ny=[{cat:"piano hinge (stainless)",maker:"タキゲン製造 (TAKIGEN)",model:"B-1007-12 ステンレス長蝶番 (SUS304, 幅50 × 板厚1.5 × L1000)",size:[1e3,50,1.5],kg:.74,jpy:4498,qty:8,where:"タキゲン直販／WEBショップ takigen.co.jp 品番 B-1007（幅25/32/38/50 × 板厚0.8/1.5/2.0 × 長さ120〜1800 の組合せで枝番 B-1007-1〜-54）。カタログ標準在庫、1〜3営業日出荷。MonotaRO でもタキゲン扱いあり。長尺は別途送料。",mount:"Approved provision is ONLY the factory hole line: ø3.5 at 20 mm pitch down both leaves. That is an M3 or M4 countersunk screw — an M5 will not go through, which is worth knowing before you buy the fasteners. Do not drill new holes within about 10 mm of the knuckle and never drill through the barrel. Into 15 mm plywood run M4 × 25 SUS pan-heads right through the leaf, the ply and a 25 × 3 mm SUS backing strap; wood screws into a 15 mm panel pull out the first time a 60 kg wing folds down. With 20 mm pitch you have plenty of holes, so use every third one and you still have a fixing every 60 mm. The hinge is designed to be cut to length: cut between holes, deburr, and passivate the cut end. The barrel itself is not a mount point — no clamps, no straps around it.",conf:"medium",note:"Model, material, widths/thicknesses and length range verified on Takigen's product page; price is estimated. B-7-12 is the identical geometry in SPCC zinc-chromate at ¥2,498 — 56 per cent of the SUS price, not the third it is easy to assume, so use B-7 on dry interior fold lines and keep SUS304 for the weather side."},{cat:"lift-off butt hinge (stainless)",maker:"タキゲン製造 (TAKIGEN)",model:"B-1065-10 ステンレス抜差蝶番 穴あき (SUS304, 幅100 × 全長125 × t4)",size:[100,125,4],kg:.28,jpy:2474,qty:12,where:"タキゲン直販 takigen.co.jp 品番 B-1065（B-65 の SUS304 版）。標準在庫、1〜3営業日。",mount:"Bolt-through holes in each leaf only — typically 4 × ø7 for M6, or ø9 for M8 on the heavy sizes. That drilled pattern is the whole approved provision; the leaf is not to be welded (it is a polished SUS304 leaf carrying the panel and welding needs re-passivation). Loose-pin geometry means the male/pin leaf must go on the FIXED frame so the panel lifts off upward — mount it the other way and the panel drops off over a bump. Use three hinges minimum on a 60–80 kg panel and load-share by shimming so all three barrels are collinear within ~0.5 mm; two hinges out of line puts the whole panel on one.",conf:"medium",note:"Series and material verified on Takigen; the exact size枝番 and price are estimated. B-1365 (超重量用厚口, 150–200 mm tall × 120–160 mm wide, SUS304) is the same family scaled for ship and floodgate doors — genuinely rated far past 80 kg but physically far too big and expensive for a kei-truck fold-out."},{cat:"weld-on lift-off hinge (stainless)",maker:"タキゲン製造 (TAKIGEN)",model:"B-1026-2 ステンレス両抜旗蝶番 超重量用厚口 (全長114)",size:[114,65,12],kg:1.3,jpy:7488,qty:8,where:"タキゲン直販 takigen.co.jp 品番 B-1026（B-26 の SUS304 版）。受注生産寄り、目安 3〜7営業日。",mount:"This is the one with LITERALLY NO SCREW HOLES. A 旗蝶番 (flag hinge) is a weld-on part: the approved provision is a full fillet weld of each half to steel or stainless, all round the flag plate. So it cannot touch plywood directly — it needs a steel sub-frame. The buildable path is: weld both halves to a 4.5 mm SUS304 or SS400 angle (40×40 or 50×50), then bolt that angle to the HFS5-4040 extrusion with M8 through the T-slot, or through-bolt it to the ply with M8 + 60×60×6 backing plates. Weld first, bolt second — welding an angle that is already bolted to ply sets the ply on fire and warps the bolt line.",conf:"medium",note:"Series verified on Takigen's 抜差蝶番 category page (両抜旗蝶番: B-3/B-1003 heavy, B-26/B-1026 ultra-heavy thick). Price and exact dimensions estimated. This is the hinge for the one module face that has to come off completely for servicing."},{cat:"platform slide — READ THE RATING",maker:"スガツネ工業 LAMP / Accuride",model:"C3832-24 フルエクステンションスライド (ストローク 610 mm)",size:[600,48,13],kg:2.3,jpy:7e3,qty:4,where:"スガツネ工業 search.sugatsune.co.jp（LAMP 扱いの Accuride C3832）。ストローク 250–700 mm。3〜10営業日。",mount:"Both members carry a full row of round and slotted bolt-through holes for M5/M6, and those holes are the entire approved provision — every one of them is meant to be used. The cabinet member must sit on a flat, continuously supported face, never on a plywood edge or a spacer stack, and the two rails of a pair must be parallel within about a millimetre or the ball retainers bind. Never drill extra holes: the raceway is directly behind the web.",conf:"medium",note:"THE RATING IS THE FINDING HERE. The first draft called this a 100 kg-plus pair on the strength of Accuride's American 500 lb reputation. The C3832 is a MEDIUM-duty side-mount rail: 441 N per pair at best, about 324 N (33 kgf) at 600 mm of extension. It will carry a battery drawer or a stove tray and it must never carry the 60–80 kg standing platform. For that, the sound module's LAMP 3509-24 at 2117 N per pair is the right class, or 日本アキュライド C3441 at roughly ten times this price. A slide chosen off a remembered figure rather than the extension-derated one is how fold-out decks fail."},{cat:"3-stage slide (mid duty)",maker:"スガツネ工業 LAMP",model:"3618-700 (3段引きスライドレール, 全長700 mm)",size:[700,36,12.7],kg:2,jpy:2820,qty:6,where:"スガツネ工業 search.sugatsune.co.jp 品番 3618-700。¥2,820 税別 / ¥3,102 税込（1セット）。150〜700 mm を50 mm刻み、黒染 BL 仕様は 150〜600 mm。カタログ在庫品。",mount:"Bolt-through / screw holes down both members only; no clamping, no welding, no drilling. Same rule as the 3832: continuous flat backing and a parallel pair. On a kei-truck this rail wants its own 12 mm ply cheeks tied top and bottom to the frame, otherwise bed flex twists the pair and it jams closed on a corner.",conf:"high",note:"Model and price read directly off Sugatsune's own product page — the one fully verified price in this list. Rated well under 100 kg per pair (mid-duty class), so use it for the stove tray, the battery drawer, the tool drawer; NOT for the 60–80 kg standing platform, which is what line 4 exists for."},{cat:"gas spring",maker:"不二ラテックス (FUJI LATEX)",model:"FGS-19-250-BB-300（φ19 チューブ／ストローク250 mm／反力300 N）",size:[564,19,19],kg:.35,jpy:9800,qty:8,where:"不二ラテックス fujilatex.co.jp（ガススプリング FGS シリーズ）、流通は MonotaRO / ミスミ / 機械商社。反力は10 N刻みで指定、ストロークは20〜750 mm。指定品につき目安 5〜10営業日。",mount:"The strut's approved provision is the male thread at each end (M8 on the φ19 size) — nothing else. Never clamp, strap or drill the tube: it is a sealed pressure vessel at well over 100 bar and a hose clamp on the barrel scores the seal path. End fittings screw onto those threads, and the load then transfers to a ball stud (next line). Mount rod-end DOWN so the piston seal stays in oil, and set the geometry so the strut is never side-loaded — a gas spring is an axial-only part and a bent rod is a scrapped rod. For a 30 kg lid hinged at the back, two struts of ~300 N each with the pivot ~60–80 mm off the hinge line is the usual starting point; buy one pair, measure, then order the rest at the corrected force.",conf:"medium",note:"Series names (FGS-10/12/15/19/22/28, SUS and vacuum variants), the 10 N force increments and the stroke range are verified on Fuji Latex's own page; the specific stroke/force suffix format and the price are estimated. Chose a Japanese maker over Stabilus Lift-O-Mat because the 10 N-step made-to-order force is exactly what you need when the lid mass is still moving during the build."},{cat:"gas spring end fittings",maker:"不二ラテックス (FUJI LATEX)",model:"ガススプリング用 ボールスタッド（M8 おねじ軸）＋ ボールソケット（M8 めねじ）",size:[45,16,16],kg:.03,jpy:950,qty:16,where:"不二ラテックス純正付属品として同時手配、または ミスミ / MonotaRO のガススプリング用ボールスタッド。ストラット本体と同時発注が確実。",mount:"The ball stud IS a fastener: an M8 male shank that goes through an 8.5 mm bolt-through hole in the frame with a nyloc and a flat washer on the back, or screws into an M8 threaded boss. On plywood this is the one place a 鬼目ナット is NOT good enough — the socket loads the stud in bending, so it needs a through-bolt with a backing plate, or the stud tapped into a 6 mm steel tab welded/bolted to the frame. Eyelet (アイ型) ends bolted through a clevis are the stiffer alternative if the geometry has no side load. Ball sockets clip on and clip off with a screwdriver — that is a feature: it lets you swap strut force without dismantling the lid.",conf:"low",note:"Fuji Latex confirm their FGS ends are threaded and the fittings are replaceable, but the accessory part numbers could not be pinned down without search — do not order blind, ring the distributor with the strut spec and let them quote the matching stud/socket set."},{cat:"over-centre / draw latch",maker:"タキゲン製造 (TAKIGEN)",model:"C-174-S クランプファスナー（締込み式ファスナー）",size:[110,30,22],kg:.15,jpy:1800,qty:12,where:"タキゲン直販 takigen.co.jp 品番 C-174-S。同ファミリーに C-124、C-432-A（折りたたみレバークランプ）、C-1174-T（SUS T型クランプ錠）。標準在庫、1〜3営業日。",mount:"Two-part latch: the lever body and the strike each have their own bolt-through hole pattern (typically 2 × ø5.5 for M5). Those four holes are the whole approved provision. An over-centre latch only develops its clamping preload if the two halves sit within a couple of millimetres of the designed spacing — shim with washers under the strike to tune it, do NOT slot the holes to make it fit, because a slotted hole lets the latch walk under vibration and it will be loose by the far end of the Chuo Expressway. Through-bolt into 鬼目ナット or a backing plate; a latch is a cyclic load and a screw in ply will egg out its hole.",conf:"medium",note:"Model verified on Takigen's 締込み式ファスナー category page; price estimated. C-1174-T is the stainless one in the family — spend the extra on the two latches that live on the outside face and use C-174-S internally."},{cat:"rated hasp",maker:"モノタロウ (MonotaRO PB)",model:"ステンレス製 掛金（ハスプ）※SKU未確認 — 全長130 mm クラス、南京錠対応",size:[130,45,3],kg:.15,jpy:1200,qty:4,where:"MonotaRO / コーナン / カインズ 店頭。ステンレス掛金は常時在庫、当日〜翌日。",mount:"A hasp's provision is bolt-through holes only, and the only ones worth having are the pattern where the staple plate hides its own fixings when the hasp is closed and locked. It MUST be through-bolted — M6 SUS carriage bolts with a 40×40×3 washer plate on the inside face. A hasp screwed to plywood is decoration: the failure mode is the whole plate tearing out with the ply face veneer still attached to it. Fit it so the shackle takes shear, not prising, and put a second one at the far end rather than one big one in the middle.",conf:"low",note:"Could not pin a specific SKU — web search was unavailable in this session, so this is deliberately a generic-but-real home-centre/MonotaRO stainless hasp bought by dimension over the counter rather than an invented model number. Takigen's 止め金 range (AC-25 / AC-1025 series) is real and stainless but those are cam-lock tongues used with a 平面ハンドル, not padlockable hasps — the wrong part for this job."},{cat:"stabiliser jack / corner steady",maker:"モノタロウ (MonotaRO) 取扱",model:"ねじ式スクリュージャッキ（トレーラー用サイドジャッキ相当）※SKU未確認、静荷重500 kg/脚クラス",size:[90,320,90],kg:2.6,jpy:4980,qty:8,where:"MonotaRO / Amazon.co.jp のトレーラー用品。ねじ式コーナーステディは国内では輸入品が中心、在庫変動あり、目安 2〜7日。",mount:"Trailer corner steadies ship with a bolt-through mounting flange, typically 4 × ø11. That flange is the entire provision — the tube and the screw are not mount points. The flange has to land on the steel sub-frame or on a 6 mm steel plate through-bolted to the extrusion; bolted straight to plywood it will punch through, because the leg puts a concentrated point load in exactly the direction ply is weakest. Use M10 through-bolts with 60×60×6 washer plates on the inside. Critically: these are STEADIES, not jacks — wind them down to just past contact to stop the bed rocking when someone steps onto a fold-out. Do not use them to lift the Hijet; the 350 kg payload rating says nothing about point loads through a jack pad.",conf:"low",note:"Real product class, widely sold in Japan, but no verifiable model number without web search — flagged low rather than fabricating one. Rejected alternative: Misumi levelling feet / アジャスターボルト, which are cheaper and definitely real but have far too little travel to take up the 30–60 mm of ground unevenness a truck parks on."},{cat:"aluminium extrusion (structural)",maker:"ミスミ (MISUMI)",model:"HFS5-4040（アルミフレーム 5系列 40×40、指定長カット）",size:[1e3,40,40],kg:1.35,jpy:1400,qty:12,where:"ミスミ jp.misumi-ec.com 型番 HFS5-4040-1000（1 mm単位の指定長カット可、カット費別途）。標準出荷 目安3日。表面処理は白アルマイト／黒アルマイト等を選択。",mount:"The extrusion's provision is its four T-slots plus optionally tapped ends — and that is deliberate: you never drill it. Every bracket, hinge sub-plate and panel bolt lands on a post-assembly nut in the slot (next line). Bolting a ply panel to the slot requires a washer that spans the slot lip; a bare M5 socket head will pull through the lip under a shock load. End-tapping for M8 is a Misumi option (counterbore + tap) — order it with the cut, because tapping a 40×40 end square by hand in the field is miserable. For the 60–80 kg fold-outs, 4040 is the minimum section for any member that cantilevers more than ~500 mm.",conf:"medium",note:"HFS5 series and the cut-to-length service verified on Misumi; the 4040 price is scaled from the 2020 page and is an estimate. Mass ~1.35 kg/m matters: the whole four-module frame in 4040 must be budgeted against the Hijet's 350 kg payload before any gear goes in."},{cat:"aluminium extrusion (light)",maker:"ミスミ (MISUMI)",model:"HFS5-2020（アルミフレーム 5系列 20×20、指定長カット）",size:[1e3,20,20],kg:.5,jpy:510,qty:20,where:"ミスミ jp.misumi-ec.com 型番 HFS5-2020-1000。ページ記載で 1000 mm の指定長が概ね ¥220〜380（表面処理・数量で変動、カット費別）。標準出荷 目安3日。",mount:"Same T-slot logic as the 4040, sized for M5 post-assembly nuts. Because 2020 has a single slot per face, a bracket on it can only be located, not triangulated — so treat 2020 as door frames, screen rails, awning battens and cable runs, never as anything a person stands on or that a 30 kg lid hangs off. Corner brackets (Misumi HBLFSN5 family) bolt into the slot and are the approved way to make a joint; a self-tapper into the slot is not.",conf:"medium",note:"Part number, 20×20 square section and 0.5 kg/m verified on the Misumi product page; the exact yen figure moves with surface treatment, quantity tier and the per-cut charge, so budget ~¥500/m delivered rather than the headline number."},{cat:"extrusion T-nuts",maker:"ミスミ (MISUMI)",model:"HNTP5-5（5系列 後入れスプリングナット M5）",size:[10,6,10],kg:.004,jpy:86,qty:300,where:"ミスミ jp.misumi-ec.com 型番 HNTP5-5。単品／まとめ買い設定あり、標準出荷 目安3日。",mount:"This part IS the mount-point provision for the whole extrusion frame — it is what makes a T-slot into a threaded hole. Drops into the slot after the frame is assembled and springs/rotates to lock, so you can add a bracket later without dismantling. Stay on M5×0.8 in a 5-series slot, torque to the slot's rating (not the bolt's — the aluminium lip yields long before an SUS M5 does), and never stack two nuts at one position hoping to double the load. Where the joint is genuinely structural, use two nuts spaced apart on the same slot rather than one nut torqued harder.",conf:"medium",note:"Part number and function verified as Misumi's standard 5-series post-assembly nut; unit price estimated. HNTT5-5 (pre-insert T-nut) is cheaper per piece but must be threaded in before the frame closes — buy 30% more of whichever you choose than the drawing says, because they get dropped inside sections and lost."},{cat:"structural plywood",maker:"JAS認定各社（セイホク等）",model:"構造用合板 針葉樹 12 mm × 910 × 1820（F☆☆☆☆、2級）",size:[1820,910,12],kg:11,jpy:2180,qty:10,where:"コーナン／カインズ／ジョイフル本田 店頭、サブロク板は常時在庫。店内カットサービス 1カット ¥50前後、直線カットは前日受付の店舗あり。",mount:"Plywood has NO mount points of its own — it is the thing you create mount points in, and that is the single most important rule in this whole build. Every load path into ply must be one of: (a) a through-bolt with a washer of at least 25 mm diameter or a steel backing plate, (b) an M6 鬼目ナット driven into the FACE (never the edge), or (c) a steel strap or angle sandwiching the panel. Screwing into the 12 mm edge is not a mount point at any load — the edge of 12 mm ply is five glue lines and air. Where a hinge line or slide rail lands, laminate a second sheet locally so the fixing has 24 mm of face to bite, or bond a hardwood cleat behind it.",conf:"medium",note:"Commodity, so there is no model number to get wrong — spec is the JAS grade stamp. Prices moved a lot in 2024–25; ¥2,180/sheet is a mid-2025-ish home-centre figure for 12 mm 針葉樹. シナ合板 (shina-faced, same 910×1820) runs roughly ¥5,500–7,000 at 12 mm and is what you use where the face is seen inside the modules; ラワン sits between. Use 針葉樹 for hidden structure and pay for シナ only on visible faces."},{cat:"composite panel (weight saving)",maker:"三菱ケミカルインフラテック",model:"ALPOLIC / アルポリック 3 mm アルミ樹脂複合板（1220 × 2440）",size:[2440,1220,3],kg:14,jpy:19800,qty:2,where:"建材商社・看板材料店経由（ジョイフル本田の資材館でも定尺取扱あり）。定尺は在庫、切売り・指定寸法は 3〜7日。",mount:"No fixings of its own and it must not be treated like plywood. The approved provisions are: captured in a channel (the T-slot of the 2020 with a suitable insert, or an aluminium edge trim), or ø4.8 aluminium blind rivets through the face into a frame at ~150 mm pitch. Never rely on a bolt clamping through the panel — the polyethylene core creeps under clamp load and the bolt goes loose within weeks of a vibrating truck bed. If a fitting must land on it, put a steel or aluminium plate on the back and rivet through both.",conf:"low",note:"Product line is real and standard for signage/vehicle bodywork in Japan; the sheet price is an estimate. Worth it only where a panel is large and non-structural — a roof, a door skin, an awning leaf. Rejected: aluminium honeycomb (昭和飛行機工業 アルミハニカムパネル) — genuinely stiffer per kilo but four to six times the price, and only pays back if the panel spans more than ~600 mm unsupported."},{cat:"lashing system",maker:"タキゲン製造 (TAKIGEN)",model:"C-1998 ステンレスラチェットバックル ＋ C-1994 シリーズ エンドフィッティング",size:[180,70,45],kg:.9,jpy:14e3,qty:8,where:"タキゲン直販 takigen.co.jp、ラッシングシステム分類。C-1998（巻取り式ラチェット）、C-1997（オーバーセンター式）、C-996（カムバックル）、C-1994-A〜N（エンド金具）、C-993 系（縫製のみ）。目安 3〜7営業日。",mount:"The buckle is not fastened to the structure at all — it lives inline in the webbing, so it has no mount point and needs none. The mount point is the END FITTING (C-1994 series): a hook or flat plate that the webbing is sewn to, and its rating is only as good as whatever it hooks onto. So this line's real mount question is answered by the next one — put rated anchors in the frame first, then pick the C-1994 variant whose throat matches them. Do not hook a lashing end onto an extrusion slot, a handle, or a hinge barrel; none of those are rated for a dynamic strap load.",conf:"medium",note:"Buckle and end-fitting series verified on Takigen's ラッシングシステム category page; prices estimated. A plain ラッシングベルト from MonotaRO or a home centre is ¥1,500–3,000 with LC 300–500 kgf and is fine for loose kit; the Takigen SUS system earns its price only on the straps that live permanently outdoors on the module."},{cat:"tie-down anchor",maker:"JIS B 1168 準拠品（MonotaRO PB 等）",model:"アイボルト SUS304 M12（使用荷重 0.40 t 軸方向）",size:[50,51,12],kg:.12,jpy:780,qty:16,where:"MonotaRO / コーナン 店頭。JIS アイボルトは M8〜M24 まで常時在庫、当日〜翌日。",mount:"An eyebolt's rating exists ONLY when it is screwed into a full-depth tapped hole with at least 1.5 × d of thread engagement in steel, pulled along its own axis, and seated hard against the face. None of that is true of plywood, so through ply it needs either a tapped steel boss or a plain nut plus a 60×60×6 backing plate, torqued until the shoulder is bedded. And the moment you side-load it, the 0.63 t drops to roughly a fifth. For any strap that pulls at an angle — which is most of them — use a proper D-ring / eye plate with two to four bolt-through holes instead, so the load goes into a plate in shear rather than into a bolt in bending.",conf:"medium",note:"JIS B 1168 is a real national standard with a published load table, so the designation and rating are solid even though the retailer SKU is generic; price estimated. This is the deliberate choice over inventing a branded D-ring part number."},{cat:"threaded inserts for plywood",maker:"ムラコシ精工",model:"鬼目ナット E タイプ M6 × 13（打込み・ねじ込み式インサート）",size:[9,13,9],kg:.004,jpy:55,qty:200,where:"コーナン／カインズ／MonotaRO／Amazon.co.jp。M4〜M10、鉄・黄銅・ステンレスあり、袋入り常時在庫、当日〜翌日。",mount:"This is HOW you create a mount point in plywood, and it is the part that makes the rest of this list buildable. Drill ø8.7 for M6, drive the E-type in square with a hex key (a crooked insert strips the ply and is unrecoverable). In 12 mm ply an M6 insert holds roughly 1.5–2 kN pulled straight out of the FACE, and a small fraction of that out of the edge — never put one in the edge grain of plywood. For the 60–80 kg fold-outs, either back the insert with a hardwood pad or a 3 mm steel plate, or skip the insert and through-bolt. Set them 25 mm minimum from any panel edge.",conf:"medium",note:"Deliberate correction to the brief: rivnuts are the wrong part for plywood — they need thin, stiff sheet to form a bulge against and simply crush ply. For 1–3 mm sheet aluminium and steel in the frame, ロブテックス (LOBSTER) エビナット with a hand nutter is the right and genuinely available product, but I could not verify a specific エビナット part number without search, so it is named as a family rather than a model."},{cat:"stainless fasteners",maker:"モノタロウ (MonotaRO PB)",model:"六角穴付ボルト ステンレス SUS304 M8 × 30（および M5/M6 各サイズ、ナイロンナット・平座金セット）",size:[13,30,13],kg:.021,jpy:45,qty:200,where:"MonotaRO 通販、箱売り（50本/100本入）。SUS 六角穴付は定番在庫、翌日出荷。ホームセンターのバラ売りは 1本 ¥50〜80 で割高。",mount:"Not applicable — this is the fastener. Two warnings that matter here: SUS304 against aluminium extrusion galls, so use anti-seize or a nylon washer under the head and never re-run a bolt that has picked up. And torque SUS M8 to roughly 18 N·m, not the ~25 N·m you would use on a steel bolt — stainless work-hardens and snaps with very little warning, usually at the worst moment, halfway through assembling a module at a campsite. Buy a box of each size; running out of M6 in a rural home centre on a Sunday is the classic build-stopper.",conf:"medium",note:"MonotaRO own-brand stainless socket-head bolts are a real, catalogued, always-in-stock line; unit price is an estimate around the usual box-quantity rate. Named generically on purpose rather than fabricating a branded fastener part number."},{cat:"weather sealing",maker:"岩田製作所 (IWATA)",model:"4100-B-3X16CT-L2 トリムシール（EPDM・バルブ付、対応板厚3 mm、2 m）",size:[1e3,22,14],kg:.12,jpy:2250,qty:20,where:"ミスミ jp.misumi-ec.com（岩田製作所ブランド取扱）／MonotaRO。指定長カット対応、目安 3〜5営業日。iwata-fa.jp の「トリム＆トリムシール」分類に EPDM・TPE・PVC の設定あり。",mount:"The good news: this needs NO fasteners at all, which is exactly why it is the right seal for a folding structure. The trim section has a steel-cored U channel that grips a panel edge of a specified thickness, and the bulb sits proud of it. The approved provision is therefore a clean, continuous, correctly-thick edge — so specify the grip range to match what it is going onto. A raw 12 mm ply edge is outside most trim seals' grip range, so either fit an aluminium edge trim first to bring the edge into range, or order the wide-grip variant. Corners are the failure point: mitre-relieve the channel rather than forcing it round, and finish the run on a straight, so the joint is not on a corner.",conf:"medium",note:"岩田製作所 is confirmed as a real Japanese maker of trim and trim-seal in EPDM; the series page returned no populated part list, so the full suffix code is described rather than invented — the trailing digits encode grip thickness, bulb size and cut length and are set at order. Cheaper option is a self-adhesive EPDM D-profile from コーナン at about ¥600 per 2 m, but adhesive-only seals peel at the corners after one summer in a truck bed; the mechanically-gripping trim seal is the one that survives the Hijet."}],iy={"sound-system":Qx,yatai:Jx,hokora:ey,cabin:ty,shared:ny};function sy(i){let e=0,t=0,n=0;for(const s of i)e+=s.jpy*s.qty,t+=s.kg*s.qty,n+=1;return{jpy:e,kg:t,lines:n}}function oy(i){const e=new Map;for(const t of i)e.has(t.cat)||e.set(t.cat,[]),e.get(t.cat).push(t);return e}function ry(i){return i.filter(e=>e.capture===!0).length}const Ha={"three-quarter":{p:[-4.3,3,7.5],t:[-.2,1.35,0]},crowd:{p:[-7.2,2.1,1],t:[-.9,1.4,0]},side:{p:[.1,1.8,7.4],t:[.1,1,0]},head:{p:[-.1,9.2,.6],t:[-.1,.7,0]}};function ay({stations:i,state:e,onStation:t,onProgress:n,camera:s,controls:r,specs:a}){const l=Fe("div","panel");document.body.appendChild(l);const c=Fe("header","head");c.appendChild(Fe("h1","","KEI TRUCK STATIONS")),c.appendChild(Fe("p","sub",`Daihatsu Hijet S500P · ${a.TRUCK_MM.overallLength} × ${a.TRUCK_MM.overallWidth} × ${a.TRUCK_MM.overallHeight} mm · ${a.TRUCK_MM.bedInnerLength} × ${a.TRUCK_MM.bedInnerWidth} bed · ${a.TRUCK_MM.payload_kg} kg payload`)),l.appendChild(c);const h=Fe("div","picker"),d=new Map;for(const ee of i){const ue=Fe("button","chip",ee.title);ue.addEventListener("click",()=>{for(const[,be]of d)be.classList.remove("on");ue.classList.add("on"),e.t=0,e.dir=1,e.playing=!0;const me=t(ee.id);te(me)}),d.set(ee.id,ue),h.appendChild(ue)}l.appendChild(h);const u=Fe("h2","title"),f=Fe("p","tagline");l.appendChild(u),l.appendChild(f);const p=Fe("section","deploy"),_=Fe("div","scrub-row"),v=Fe("button","icon","❚❚");v.title="play / pause the deployment";const g=document.createElement("input");g.type="range",g.min="0",g.max="1000",g.value="0",g.className="scrub",g.setAttribute("aria-label","deployment"),_.appendChild(v),_.appendChild(g),p.appendChild(_);const m=Fe("div","stage");p.appendChild(m),l.appendChild(p),v.addEventListener("click",()=>{e.playing=!e.playing,e.hold=0,v.textContent=e.playing?"❚❚":"▶"}),g.addEventListener("input",()=>{v.textContent="▶",n(Number(g.value)/1e3)});const y=Fe("div","steprow"),x=Fe("button","icon","◀");x.title="previous step";const M=Fe("span","dirlabel"),L=Fe("button","icon","▶");L.title="next step",y.appendChild(x),y.appendChild(M),y.appendChild(L),p.appendChild(y);const R=Fe("ol","steps");p.appendChild(R);const C=(ee,ue)=>ee>=ue-1?1:Math.min(1,Math.max(0,(ee+.9)/ue));function G(ee){const ue=K.rig,me=Math.max(1,ue.stageCount),be=Math.min(me-1,Math.floor(e.t*me)),Re=Math.min(me-1,Math.max(0,be+ee));e.playing=!1,e.hold=0,e.dir=ee>=0?1:-1,v.textContent="▶",n(ee>=0&&be===Re&&e.t<1?1:C(Re,me))}x.addEventListener("click",()=>G(-1)),L.addEventListener("click",()=>G(1));const b=Fe("div","verdict");l.appendChild(b);const T=Fe("section","readout");l.appendChild(T);const z=Fe("button","bomtoggle","bill of materials ▾");l.appendChild(z);const V=Fe("section","bom");l.appendChild(V),z.addEventListener("click",()=>{const ee=V.classList.toggle("open");z.textContent=`bill of materials ${ee?"▴":"▾"}`});const ie=Fe("div","views");for(const ee of Object.keys(Ha)){const ue=Fe("button","chip small",ee);ue.addEventListener("click",()=>{e.orbit=!1,H.classList.remove("on"),J(ee)}),ie.appendChild(ue)}l.appendChild(ie);const I=Fe("div","views"),B=Fe("button","chip small","engineering view"),H=Fe("button","chip small on","auto-orbit");I.appendChild(B),I.appendChild(H),l.appendChild(I);let K=null;B.addEventListener("click",()=>{e.xray=!e.xray,B.classList.toggle("on",e.xray),K==null||K.overlay.setVisible(e.xray),document.body.classList.toggle("xray",e.xray)}),H.addEventListener("click",()=>{e.orbit=!e.orbit,H.classList.toggle("on",e.orbit)});const Z=Fe("button","collapse","×");Z.title="hide the panel",Z.addEventListener("click",()=>l.classList.toggle("hidden")),l.appendChild(Z);function J(ee){const ue=Ha[ee]??Ha["three-quarter"];s.position.set(...ue.p),r.target.set(...ue.t),s.lookAt(r.target),r.update()}function te(ee){K=ee,ee.overlay.setVisible(e.xray);for(const[Q,$]of d)$.classList.toggle("on",Q===ee.def.id);u.textContent=ee.def.title,f.textContent=ee.def.tagline,fe(ee);const{report:ue,meta:me,rig:be}=ee;if(b.className=`verdict ${ue.ok?"pass":"fail"}`,b.innerHTML="",b.appendChild(Fe("div","verdict-head",ue.ok?`fold audit: PASS — ${be.order.length} parts, ${ue.samples} frames, no interference`:`fold audit: ${ue.collisions.length} INTERFERENCE${ue.collisions.length>1?"S":""}`)),!ue.ok)for(const Q of ue.collisions.slice(0,6))b.appendChild(Fe("div","row bad",`${Q.a} ↔ ${Q.b} · ${(Q.depth*1e3).toFixed(0)} mm at t=${Q.t.toFixed(2)}`));T.innerHTML="";const Re=Lh(be,0),ye=Lh(be,1);T.appendChild(_r("envelope"));const De=a.T.deckH;T.appendChild(Oi("packed",`${Qn(Re.l)} × ${Qn(Re.w)} × ${Qn(Re.h-De)} mm above the deck`)),T.appendChild(Oi("ceiling",`${Qn(a.PACK_CEILING)} mm to the cab roof · ${Qn(a.PACK_CEILING_LEGAL)} to the kei limit`,Re.h-De>a.PACK_CEILING_LEGAL?"bad":Re.h-De>a.PACK_CEILING?"warn":"ok")),T.appendChild(Oi("deployed",`${Qn(ye.l)} × ${Qn(ye.w)} × ${Qn(ye.h)} mm tall on the ground`));const D=me.massBudget.reduce((Q,$)=>Q+$[1],0);T.appendChild(_r(`mass budget — ${D.toFixed(0)} of ${a.T.payload} kg`));const ne=Fe("div","bar");for(const[Q,$]of me.massBudget){const Pe=Fe("span","seg");Pe.style.flexGrow=String($),Pe.title=`${Q} — ${$} kg`,ne.appendChild(Pe)}const Y=Fe("span","seg slack");Y.style.flexGrow=String(Math.max(0,a.T.payload-D)),Y.title=`spare — ${(a.T.payload-D).toFixed(0)} kg`,ne.appendChild(Y),T.appendChild(ne);for(const[Q,$]of me.massBudget)T.appendChild(Oi(Q,`${$} kg`));T.appendChild(Oi("spare",`${(a.T.payload-D).toFixed(0)} kg`,D>a.T.payload?"bad":"ok")),T.appendChild(_r("how it stands up"));for(const Q of me.notes)T.appendChild(Fe("p","note",Q));ce(ee)}function ce(ee){V.innerHTML="";const ue=iy[ee.def.bom??ee.def.id]??[];if(!ue.length){V.appendChild(Fe("p","note","Gear list still being priced for this module.")),z.classList.add("empty");return}z.classList.remove("empty");const{jpy:me,kg:be,lines:Re}=sy(ue),ye=ry(ue);V.appendChild(Oi("bought-in gear",`¥${me.toLocaleString("en-US")} · ${be.toFixed(1)} kg · ${Re} lines`)),V.appendChild(Oi("no fixing points",`${ye} of ${Re} items must be captured in a cradle`,ye>Re/2?"warn":""));for(const[De,D]of oy(ue)){V.appendChild(_r(De));for(const ne of D){const Y=Fe("div","bomrow"),Q=Fe("div","bomhead");Q.appendChild(Fe("span","bommodel",ne.model)),Q.appendChild(Fe("span","bomprice",`¥${(ne.jpy*ne.qty).toLocaleString("en-US")}`)),Y.appendChild(Q),Y.appendChild(Fe("div","bommeta",[ne.maker,ne.qty>1?`×${ne.qty}`:null,ne.size?`${ne.size[0]} × ${ne.size[1]} × ${ne.size[2]} mm`:null,`${ne.kg} kg`,ne.where].filter(Boolean).join(" · "))),Y.appendChild(Fe("div","bommount",ne.mount)),ne.note&&Y.appendChild(Fe("div","bomnote",ne.note)),V.appendChild(Y)}}}function fe(ee){R.innerHTML="",ee.rig.stageLabels.forEach((ue,me)=>{const be=Fe("li","step");be.appendChild(Fe("span","step-n",String(me+1))),be.appendChild(Fe("span","step-t",ue)),be.addEventListener("click",()=>{e.playing=!1,e.hold=0,v.textContent="▶",n(C(me,Math.max(1,ee.rig.stageCount)))}),R.appendChild(be)})}const j=m;function oe(ee,ue){g.value=String(Math.round(ee*1e3)),v.textContent=e.playing?"❚❚":"▶";const me=ue.rig,be=me.stageCount,Re=Math.min(be-1,Math.floor(ee*be)),ye=ee<=.001,De=ee>=.999,D=e.dir<0;R.classList.toggle("inward",D&&!ye&&!De),[...R.children].forEach((Y,Q)=>{Y.classList.toggle("on",!ye&&!De&&Q===Re),Y.classList.toggle("done",De||!ye&&Q<Re)}),M.textContent=ye?"stowed — ready to drive":De?"deployed":D?`folding in · step ${be-Re} of ${be}`:`folding out · step ${Re+1} of ${be}`,M.className=`dirlabel ${ye?"stowed":De?"deployed":D?"inward":"outward"}`;const ne=ue.overlay.status;j.innerHTML="",j.appendChild(Fe("span","stage-n",ye?"stowed":De?"deployed":`${Re+1}/${be}`)),j.appendChild(Fe("span","stage-label",ye?"ready to drive":me.stageLabels[Re]??"")),j.appendChild(Fe("span",`stage-tip ${ne.inside?"ok":"bad"}`,ne.inside?`CG ${Qn(ne.margin)} mm inside the feet`:"CG OUTSIDE the support polygon"))}return{describe:te,tick:oe,frame:J,syncOrbit:()=>H.classList.toggle("on",e.orbit)}}function Fe(i,e,t){const n=document.createElement(i);return e&&(n.className=e),t!=null&&(n.textContent=t),n}function _r(i){return Fe("div","section-title",i)}function Oi(i,e,t){const n=Fe("div",`row ${t??""}`);return n.appendChild(Fe("span","k",i)),n.appendChild(Fe("span","v",e)),n}const Qn=i=>(i*1e3).toFixed(0);function Lh(i,e){const t=i.t??0;i.setProgress(e);let n=1/0,s=-1/0,r=1/0,a=-1/0,l=1/0,c=-1/0;for(const{obb:h}of i.worldHulls()){const d=h.rotation.elements,u=Math.abs(d[0])*h.halfSize.x+Math.abs(d[3])*h.halfSize.y+Math.abs(d[6])*h.halfSize.z,f=Math.abs(d[1])*h.halfSize.x+Math.abs(d[4])*h.halfSize.y+Math.abs(d[7])*h.halfSize.z,p=Math.abs(d[2])*h.halfSize.x+Math.abs(d[5])*h.halfSize.y+Math.abs(d[8])*h.halfSize.z;n=Math.min(n,h.center.x-u),s=Math.max(s,h.center.x+u),r=Math.min(r,h.center.y-f),a=Math.max(a,h.center.y+f),l=Math.min(l,h.center.z-p),c=Math.max(c,h.center.z+p)}return i.setProgress(t),{l:s-n,w:c-l,h:a,lo:r}}const Fd=document.getElementById("scene"),es=new gd({canvas:Fd,antialias:!0,powerPreference:"high-performance"});es.setPixelRatio(Math.min(devicePixelRatio,2));cv(es);const ko=new h_,Ut=new pn(38,1,.1,300),gt=new K_(Ut,Fd);gt.enableDamping=!0;gt.minDistance=2.6;gt.maxDistance=24;gt.maxPolarAngle=Math.PI*.495;ov(ko,es);const Dh=Xr(),Uo=pv();ko.add(Uo.group);const Gs=new _e;Gs.position.set(0,k.deckH,0);ko.add(Gs);const il=[bh("ground",{c:[0,-5,0],s:[80,10,80],mates:[]}),...Uo.hulls.map(i=>bh(i.id,{c:i.c,s:i.s}))],ly=(()=>{const i=new is,e=new A;for(const t of Uo.hulls)i.expandByPoint(e.set(t.c[0]-t.s[0]/2,t.c[1]-t.s[1]/2,t.c[2]-t.s[2]/2)),i.expandByPoint(e.set(t.c[0]+t.s[0]/2,t.c[1]+t.s[1]/2,t.c[2]+t.s[2]/2));return i})();function cy(i){const e=i.t??0;i.setProgress(1);const t=ly.clone(),n=new A;for(const{obb:s}of i.worldHulls()){const r=s.rotation.elements,a=s.halfSize,l=Math.abs(r[0])*a.x+Math.abs(r[3])*a.y+Math.abs(r[6])*a.z,c=Math.abs(r[1])*a.x+Math.abs(r[4])*a.y+Math.abs(r[7])*a.z,h=Math.abs(r[2])*a.x+Math.abs(r[5])*a.y+Math.abs(r[8])*a.z;t.expandByPoint(n.set(s.center.x-l,s.center.y-c,s.center.z-h)),t.expandByPoint(n.set(s.center.x+l,s.center.y+c,s.center.z+h))}return i.setProgress(e),t}let Dt=null;function Ml(i){Dt&&(Gs.remove(Dt.rig.root),hy(Dt.rig.root),Dt.overlay.dispose());const e=Nr.find(a=>a.id===i)??Nr[0],t=new Cv(e.id),n=e.build({rig:t,lib:Dh,truck:Uo});Gs.add(t.root),t.setProgress(0);const s=t.audit({samples:110,statics:il}),r=Vx({rig:t,lib:Dh,statics:il,report:s});return Gs.add(r.group),Dt={def:e,rig:t,meta:n,report:s,overlay:r,bounds:cy(t)},Dt}function hy(i){i.traverse(e=>{var t;(e.isMesh||e.isLine)&&((t=e.geometry)==null||t.dispose())})}const dy=24,ft={t:1,playing:!0,dir:-1,hold:3,speed:.17,orbit:!0,xray:!1};function qs(i){var e,t;ft.t=Math.min(1,Math.max(0,i)),Dt.rig.setProgress(ft.t),(t=(e=Dt.meta).update)==null||t.call(e,ft.t,Dt.rig),Dt.overlay.update(ft.t)}function zd(){const i=document.querySelector(".panel");if(!i||i.classList.contains("hidden"))return{x:0,y:0};const e=i.getBoundingClientRect();return e.width>innerWidth*.7?{x:0,y:Math.min(e.height,innerHeight*.7)}:{x:Math.min(e.width,innerWidth*.7),y:0}}const Et={c:new A,dir:new A,right:new A,up:new A,p:new A};function Bd(){if(!(Dt!=null&&Dt.bounds))return;const i=Dt.bounds,e=innerHeight,t=zd(),n=Math.max(200,innerWidth-t.x),s=Math.max(200,e-t.y);i.getCenter(Et.c),Et.dir.copy(Ut.position).sub(gt.target),Et.dir.lengthSq()<1e-6&&Et.dir.set(-1,.5,1),Et.dir.normalize(),Et.right.crossVectors(Math.abs(Et.dir.y)>.99?new A(0,0,1):new A(0,1,0),Et.dir).normalize(),Et.up.crossVectors(Et.dir,Et.right).normalize();let r=0,a=0,l=0;for(let f=0;f<8;f++)Et.p.set(f&1?i.max.x:i.min.x,f&2?i.max.y:i.min.y,f&4?i.max.z:i.min.z).sub(Et.c),r=Math.max(r,Math.abs(Et.p.dot(Et.right))),a=Math.max(a,Math.abs(Et.p.dot(Et.up))),l=Math.max(l,Et.p.dot(Et.dir));const c=Ut.fov*Math.PI/360,h=Math.atan(Math.tan(c)*(s/e)),d=Math.atan(Math.tan(c)*(n/e)),u=Math.max(a/Math.tan(h),r/Math.tan(d))*1.07+l;gt.target.copy(Et.c),Ut.position.copy(Et.c).addScaledVector(Et.dir,Math.min(Math.max(u,gt.minDistance),gt.maxDistance)),Ut.lookAt(gt.target),gt.update()}function bl(){const i=innerWidth,e=innerHeight;es.setSize(i,e,!1),Ut.aspect=i/e;const t=zd();t.x>0||t.y>0?Ut.setViewOffset(i,e,-t.x/2,t.y/2,i,e):Ut.clearViewOffset(),Ut.updateProjectionMatrix(),ft.orbit&&Bd()}addEventListener("resize",bl);const li=ay({stations:Nr,state:ft,onStation:i=>{const e=Ml(i);return qs(ft.t),li.describe(e),ft.orbit&&Bd(),e},onProgress:i=>{ft.playing=!1,qs(i),li.tick(ft.t,Dt)},camera:Ut,controls:gt,specs:{T:k,PACK_CEILING:uv,PACK_CEILING_LEGAL:fv,TRUCK_MM:Ye}});li.describe(Ml(Nr[0].id));qs(ft.t);li.tick(ft.t,Dt);li.frame("three-quarter");bl();{const i=document.querySelector(".panel");i&&new MutationObserver(bl).observe(i,{attributes:!0,attributeFilter:["class"]})}let Ih=performance.now(),kh=!1,Uh=0;es.setAnimationLoop(i=>{var t;const e=Math.min(2,(i-Ih)/1e3);if(Ih=i,Uh+=1,ft.playing){if(!(Uh<dy))if(ft.hold>0)ft.hold-=e;else{let n=ft.t+ft.dir*ft.speed*e;n>=1?(n=1,ft.dir=-1,ft.hold=2.8):n<=0&&(n=0,ft.dir=1,ft.hold=1.6),qs(n)}li.tick(ft.t,Dt)}if(ft.orbit&&!gt.dragging){const n=Ut.position.x-gt.target.x,s=Ut.position.z-gt.target.z,r=Math.atan2(s,n)+e*.06,a=Math.hypot(n,s);Ut.position.x=gt.target.x+Math.cos(r)*a,Ut.position.z=gt.target.z+Math.sin(r)*a,Ut.lookAt(gt.target)}gt.update(),es.render(ko,Ut),kh||(kh=!0,(t=document.getElementById("boot"))==null||t.classList.add("gone"))});gt.addEventListener("start",()=>{gt.dragging=!0,ft.orbit=!1,li.syncOrbit()});gt.addEventListener("end",()=>{gt.dragging=!1});window.kei={scene:ko,camera:Ut,controls:gt,renderer:es,truck:Uo,bedOrigin:Gs,state:ft,get station(){return Dt},setProgress:i=>{qs(i),li.tick(ft.t,Dt)},load:i=>{const e=Ml(i);return li.describe(e),qs(ft.t),e},audit:()=>Dt.rig.audit({samples:240,statics:il}),view(i,e,t,n=0,s=1.1,r=0){ft.orbit=!1,Ut.position.set(i,e,t),gt.target.set(n,s,r),Ut.lookAt(gt.target),gt.update()}};
