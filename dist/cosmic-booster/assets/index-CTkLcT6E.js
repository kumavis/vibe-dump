(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const lo="160",ah=0,Bo=1,oh=2,yc=1,lh=2,kn=3,oi=0,Jt=1,Sn=2,Gn=0,er=1,Ci=2,ko=3,Ho=4,ch=5,xi=100,uh=101,hh=102,Go=103,Vo=104,fh=200,dh=201,ph=202,mh=203,Ha=204,Ga=205,gh=206,vh=207,_h=208,xh=209,Sh=210,Mh=211,yh=212,Th=213,Eh=214,bh=0,Tc=1,Ah=2,Cr=3,wh=4,Rh=5,Ch=6,Ph=7,Ec=0,Lh=1,Dh=2,si=0,Uh=1,Ih=2,Nh=3,Fh=4,Oh=5,zh=6,bc=300,rr=301,sr=302,Va=303,Wa=304,Gs=306,Xa=1e3,Mn=1001,qa=1002,Xt=1003,Wo=1004,na=1005,Kt=1006,Bh=1007,li=1008,ai=1009,kh=1010,Hh=1011,co=1012,Ac=1013,ei=1014,ti=1015,hn=1016,wc=1017,Rc=1018,bi=1020,Gh=1021,yn=1023,Vh=1024,Wh=1025,Ai=1026,ar=1027,Xh=1028,Cc=1029,qh=1030,Pc=1031,Lc=1033,ia=33776,ra=33777,sa=33778,aa=33779,Xo=35840,qo=35841,Yo=35842,$o=35843,Dc=36196,Ko=37492,Zo=37496,Jo=37808,jo=37809,Qo=37810,el=37811,tl=37812,nl=37813,il=37814,rl=37815,sl=37816,al=37817,ol=37818,ll=37819,cl=37820,ul=37821,oa=36492,hl=36494,fl=36495,Yh=36283,dl=36284,pl=36285,ml=36286,Uc=3e3,wi=3001,$h=3200,Kh=3201,Zh=0,Jh=1,un="",Ct="srgb",Vn="srgb-linear",uo="display-p3",Vs="display-p3-linear",bs="linear",st="srgb",As="rec709",ws="p3",Ii=7680,gl=519,jh=512,Qh=513,ef=514,Ic=515,tf=516,nf=517,rf=518,sf=519,vl=35044,af=35048,_l="300 es",Ya=1035,Hn=2e3,Rs=2001;class hr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const It=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let xl=1234567;const Tr=Math.PI/180,Pr=180/Math.PI;function Di(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(It[n&255]+It[n>>8&255]+It[n>>16&255]+It[n>>24&255]+"-"+It[e&255]+It[e>>8&255]+"-"+It[e>>16&15|64]+It[e>>24&255]+"-"+It[t&63|128]+It[t>>8&255]+"-"+It[t>>16&255]+It[t>>24&255]+It[i&255]+It[i>>8&255]+It[i>>16&255]+It[i>>24&255]).toLowerCase()}function Pt(n,e,t){return Math.max(e,Math.min(t,n))}function ho(n,e){return(n%e+e)%e}function of(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function lf(n,e,t){return n!==e?(t-n)/(e-n):0}function Er(n,e,t){return(1-t)*n+t*e}function cf(n,e,t,i){return Er(n,e,1-Math.exp(-t*i))}function uf(n,e=1){return e-Math.abs(ho(n,e*2)-e)}function hf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function ff(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function df(n,e){return n+Math.floor(Math.random()*(e-n+1))}function pf(n,e){return n+Math.random()*(e-n)}function mf(n){return n*(.5-Math.random())}function gf(n){n!==void 0&&(xl=n);let e=xl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function vf(n){return n*Tr}function _f(n){return n*Pr}function $a(n){return(n&n-1)===0&&n!==0}function xf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Cs(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Sf(n,e,t,i,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),u=a((e+i)/2),h=s((e-i)/2),f=a((e-i)/2),m=s((i-e)/2),g=a((i-e)/2);switch(r){case"XYX":n.set(o*u,l*h,l*f,o*c);break;case"YZY":n.set(l*f,o*u,l*h,o*c);break;case"ZXZ":n.set(l*h,l*f,o*u,o*c);break;case"XZX":n.set(o*u,l*g,l*m,o*c);break;case"YXY":n.set(l*m,o*u,l*g,o*c);break;case"ZYZ":n.set(l*g,l*m,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Zi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Vt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ps={DEG2RAD:Tr,RAD2DEG:Pr,generateUUID:Di,clamp:Pt,euclideanModulo:ho,mapLinear:of,inverseLerp:lf,lerp:Er,damp:cf,pingpong:uf,smoothstep:hf,smootherstep:ff,randInt:df,randFloat:pf,randFloatSpread:mf,seededRandom:gf,degToRad:vf,radToDeg:_f,isPowerOfTwo:$a,ceilPowerOfTwo:xf,floorPowerOfTwo:Cs,setQuaternionFromProperEuler:Sf,normalize:Vt,denormalize:Zi};class ie{constructor(e=0,t=0){ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Pt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ve{constructor(e,t,i,r,s,a,o,l,c){Ve.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],f=i[2],m=i[5],g=i[8],v=r[0],p=r[3],d=r[6],E=r[1],S=r[4],T=r[7],D=r[2],R=r[5],A=r[8];return s[0]=a*v+o*E+l*D,s[3]=a*p+o*S+l*R,s[6]=a*d+o*T+l*A,s[1]=c*v+u*E+h*D,s[4]=c*p+u*S+h*R,s[7]=c*d+u*T+h*A,s[2]=f*v+m*E+g*D,s[5]=f*p+m*S+g*R,s[8]=f*d+m*T+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,f=o*l-u*s,m=c*s-a*l,g=t*h+i*f+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*c-u*i)*v,e[2]=(o*i-r*a)*v,e[3]=f*v,e[4]=(u*t-r*l)*v,e[5]=(r*s-o*t)*v,e[6]=m*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(la.makeScale(e,t)),this}rotate(e){return this.premultiply(la.makeRotation(-e)),this}translate(e,t){return this.premultiply(la.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const la=new Ve;function Nc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ls(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Mf(){const n=Ls("canvas");return n.style.display="block",n}const Sl={};function br(n){n in Sl||(Sl[n]=!0,console.warn(n))}const Ml=new Ve().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),yl=new Ve().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),qr={[Vn]:{transfer:bs,primaries:As,toReference:n=>n,fromReference:n=>n},[Ct]:{transfer:st,primaries:As,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Vs]:{transfer:bs,primaries:ws,toReference:n=>n.applyMatrix3(yl),fromReference:n=>n.applyMatrix3(Ml)},[uo]:{transfer:st,primaries:ws,toReference:n=>n.convertSRGBToLinear().applyMatrix3(yl),fromReference:n=>n.applyMatrix3(Ml).convertLinearToSRGB()}},yf=new Set([Vn,Vs]),Qe={enabled:!0,_workingColorSpace:Vn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!yf.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=qr[e].toReference,r=qr[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return qr[n].primaries},getTransfer:function(n){return n===un?bs:qr[n].transfer}};function tr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ca(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ni;class Fc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ni===void 0&&(Ni=Ls("canvas")),Ni.width=e.width,Ni.height=e.height;const i=Ni.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ni}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ls("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=tr(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(tr(t[i]/255)*255):t[i]=tr(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Tf=0;class Oc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tf++}),this.uuid=Di(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ua(r[a].image)):s.push(ua(r[a]))}else s=ua(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function ua(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Fc.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ef=0;class jt extends hr{constructor(e=jt.DEFAULT_IMAGE,t=jt.DEFAULT_MAPPING,i=Mn,r=Mn,s=Kt,a=li,o=yn,l=ai,c=jt.DEFAULT_ANISOTROPY,u=un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Di(),this.name="",this.source=new Oc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ie(0,0),this.repeat=new ie(1,1),this.center=new ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ve,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(br("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===wi?Ct:un),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==bc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Xa:e.x=e.x-Math.floor(e.x);break;case Mn:e.x=e.x<0?0:1;break;case qa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Xa:e.y=e.y-Math.floor(e.y);break;case Mn:e.y=e.y<0?0:1;break;case qa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return br("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ct?wi:Uc}set encoding(e){br("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===wi?Ct:un}}jt.DEFAULT_IMAGE=null;jt.DEFAULT_MAPPING=bc;jt.DEFAULT_ANISOTROPY=1;class wt{constructor(e=0,t=0,i=0,r=1){wt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],m=l[5],g=l[9],v=l[2],p=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,T=(m+1)/2,D=(d+1)/2,R=(u+f)/4,A=(h+v)/4,Z=(g+p)/4;return S>T&&S>D?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=R/i,s=A/i):T>D?T<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(T),i=R/r,s=Z/r):D<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(D),i=A/s,r=Z/s),this.set(i,r,s,t),this}let E=Math.sqrt((p-g)*(p-g)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(E)<.001&&(E=1),this.x=(p-g)/E,this.y=(h-v)/E,this.z=(f-u)/E,this.w=Math.acos((c+m+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bf extends hr{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new wt(0,0,e,t),this.scissorTest=!1,this.viewport=new wt(0,0,e,t);const r={width:e,height:t,depth:1};i.encoding!==void 0&&(br("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===wi?Ct:un),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new jt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Oc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qt extends bf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class zc extends jt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Af extends jt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=Mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ui{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const f=s[a+0],m=s[a+1],g=s[a+2],v=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==f||c!==m||u!==g){let p=1-o;const d=l*f+c*m+u*g+h*v,E=d>=0?1:-1,S=1-d*d;if(S>Number.EPSILON){const D=Math.sqrt(S),R=Math.atan2(D,d*E);p=Math.sin(p*R)/D,o=Math.sin(o*R)/D}const T=o*E;if(l=l*p+f*T,c=c*p+m*T,u=u*p+g*T,h=h*p+v*T,p===1-o){const D=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=D,c*=D,u*=D,h*=D}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[a],f=s[a+1],m=s[a+2],g=s[a+3];return e[t]=o*g+u*h+l*m-c*f,e[t+1]=l*g+u*f+c*h-o*m,e[t+2]=c*g+u*m+o*f-l*h,e[t+3]=u*g-o*h-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),h=o(s/2),f=l(i/2),m=l(r/2),g=l(s/2);switch(a){case"XYZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"YXZ":this._x=f*u*h+c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"ZXY":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h-f*m*g;break;case"ZYX":this._x=f*u*h-c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h+f*m*g;break;case"YZX":this._x=f*u*h+c*m*g,this._y=c*m*h+f*u*g,this._z=c*u*g-f*m*h,this._w=c*u*h-f*m*g;break;case"XZY":this._x=f*u*h-c*m*g,this._y=c*m*h-f*u*g,this._z=c*u*g+f*m*h,this._w=c*u*h+f*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],f=i+o+h;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(u-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(i>o&&i>h){const m=2*Math.sqrt(1+i-o-h);this._w=(u-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>h){const m=2*Math.sqrt(1+o-i-h);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-i-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Pt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*r+t*this._y,this._z=m*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-t)*u)/c,f=Math.sin(t*u)/c;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(r),i*Math.sin(s),i*Math.cos(s),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(e=0,t=0,i=0){C.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Tl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Tl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*t-s*r),h=2*(s*i-a*t);return this.x=t+l*c+a*h-o*u,this.y=i+l*u+o*c-s*h,this.z=r+l*h+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ha.copy(this).projectOnVector(e),this.sub(ha)}reflect(e){return this.sub(ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Pt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ha=new C,Tl=new Ui;class Fr{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,gn):gn.fromBufferAttribute(s,a),gn.applyMatrix4(e.matrixWorld),this.expandByPoint(gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Yr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Yr.copy(i.boundingBox)),Yr.applyMatrix4(e.matrixWorld),this.union(Yr)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,gn),gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(pr),$r.subVectors(this.max,pr),Fi.subVectors(e.a,pr),Oi.subVectors(e.b,pr),zi.subVectors(e.c,pr),Xn.subVectors(Oi,Fi),qn.subVectors(zi,Oi),di.subVectors(Fi,zi);let t=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-di.z,di.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,di.z,0,-di.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-di.y,di.x,0];return!fa(t,Fi,Oi,zi,$r)||(t=[1,0,0,0,1,0,0,0,1],!fa(t,Fi,Oi,zi,$r))?!1:(Kr.crossVectors(Xn,qn),t=[Kr.x,Kr.y,Kr.z],fa(t,Fi,Oi,zi,$r))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(In),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const In=[new C,new C,new C,new C,new C,new C,new C,new C],gn=new C,Yr=new Fr,Fi=new C,Oi=new C,zi=new C,Xn=new C,qn=new C,di=new C,pr=new C,$r=new C,Kr=new C,pi=new C;function fa(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){pi.fromArray(n,s);const o=r.x*Math.abs(pi.x)+r.y*Math.abs(pi.y)+r.z*Math.abs(pi.z),l=e.dot(pi),c=t.dot(pi),u=i.dot(pi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const wf=new Fr,mr=new C,da=new C;class Ws{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):wf.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mr.subVectors(e,this.center);const t=mr.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(mr,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(da.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mr.copy(e.center).add(da)),this.expandByPoint(mr.copy(e.center).sub(da))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Nn=new C,pa=new C,Zr=new C,Yn=new C,ma=new C,Jr=new C,ga=new C;class fo{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Nn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Nn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Nn.copy(this.origin).addScaledVector(this.direction,t),Nn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){pa.copy(e).add(t).multiplyScalar(.5),Zr.copy(t).sub(e).normalize(),Yn.copy(this.origin).sub(pa);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Zr),o=Yn.dot(this.direction),l=-Yn.dot(Zr),c=Yn.lengthSq(),u=Math.abs(1-a*a);let h,f,m,g;if(u>0)if(h=a*l-o,f=a*o-l,g=s*u,h>=0)if(f>=-g)if(f<=g){const v=1/u;h*=v,f*=v,m=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=s,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;else f<=-g?(h=Math.max(0,-(-a*s+o)),f=h>0?-s:Math.min(Math.max(-s,-l),s),m=-h*h+f*(f+2*l)+c):f<=g?(h=0,f=Math.min(Math.max(-s,-l),s),m=f*(f+2*l)+c):(h=Math.max(0,-(a*s+o)),f=h>0?s:Math.min(Math.max(-s,-l),s),m=-h*h+f*(f+2*l)+c);else f=a>0?-s:s,h=Math.max(0,-(a*f+o)),m=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(pa).addScaledVector(Zr,f),m}intersectSphere(e,t){Nn.subVectors(e.center,this.origin);const i=Nn.dot(this.direction),r=Nn.dot(Nn)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Nn)!==null}intersectTriangle(e,t,i,r,s){ma.subVectors(t,e),Jr.subVectors(i,e),ga.crossVectors(ma,Jr);let a=this.direction.dot(ga),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Yn.subVectors(this.origin,e);const l=o*this.direction.dot(Jr.crossVectors(Yn,Jr));if(l<0)return null;const c=o*this.direction.dot(ma.cross(Yn));if(c<0||l+c>a)return null;const u=-o*Yn.dot(ga);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Mt{constructor(e,t,i,r,s,a,o,l,c,u,h,f,m,g,v,p){Mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,u,h,f,m,g,v,p)}set(e,t,i,r,s,a,o,l,c,u,h,f,m,g,v,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=m,d[7]=g,d[11]=v,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Mt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Bi.setFromMatrixColumn(e,0).length(),s=1/Bi.setFromMatrixColumn(e,1).length(),a=1/Bi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=a*u,m=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=m+g*c,t[5]=f-v*c,t[9]=-o*l,t[2]=v-f*c,t[6]=g+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*u,m=l*h,g=c*u,v=c*h;t[0]=f+v*o,t[4]=g*o-m,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=m*o-g,t[6]=v+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*u,m=l*h,g=c*u,v=c*h;t[0]=f-v*o,t[4]=-a*h,t[8]=g+m*o,t[1]=m+g*o,t[5]=a*u,t[9]=v-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*u,m=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=g*c-m,t[8]=f*c+v,t[1]=l*h,t[5]=v*c+f,t[9]=m*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=v-f*h,t[8]=g*h+m,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=m*h+g,t[10]=f-v*h}else if(e.order==="XZY"){const f=a*l,m=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=f*h+v,t[5]=a*u,t[9]=m*h-g,t[2]=g*h-m,t[6]=o*u,t[10]=v*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Rf,e,Cf)}lookAt(e,t,i){const r=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),$n.crossVectors(i,nn),$n.lengthSq()===0&&(Math.abs(i.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),$n.crossVectors(i,nn)),$n.normalize(),jr.crossVectors(nn,$n),r[0]=$n.x,r[4]=jr.x,r[8]=nn.x,r[1]=$n.y,r[5]=jr.y,r[9]=nn.y,r[2]=$n.z,r[6]=jr.z,r[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],f=i[9],m=i[13],g=i[2],v=i[6],p=i[10],d=i[14],E=i[3],S=i[7],T=i[11],D=i[15],R=r[0],A=r[4],Z=r[8],y=r[12],b=r[1],H=r[5],V=r[9],re=r[13],P=r[2],z=r[6],k=r[10],X=r[14],G=r[3],W=r[7],q=r[11],Q=r[15];return s[0]=a*R+o*b+l*P+c*G,s[4]=a*A+o*H+l*z+c*W,s[8]=a*Z+o*V+l*k+c*q,s[12]=a*y+o*re+l*X+c*Q,s[1]=u*R+h*b+f*P+m*G,s[5]=u*A+h*H+f*z+m*W,s[9]=u*Z+h*V+f*k+m*q,s[13]=u*y+h*re+f*X+m*Q,s[2]=g*R+v*b+p*P+d*G,s[6]=g*A+v*H+p*z+d*W,s[10]=g*Z+v*V+p*k+d*q,s[14]=g*y+v*re+p*X+d*Q,s[3]=E*R+S*b+T*P+D*G,s[7]=E*A+S*H+T*z+D*W,s[11]=E*Z+S*V+T*k+D*q,s[15]=E*y+S*re+T*X+D*Q,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],m=e[14],g=e[3],v=e[7],p=e[11],d=e[15];return g*(+s*l*h-r*c*h-s*o*f+i*c*f+r*o*m-i*l*m)+v*(+t*l*m-t*c*f+s*a*f-r*a*m+r*c*u-s*l*u)+p*(+t*c*h-t*o*m-s*a*h+i*a*m+s*o*u-i*c*u)+d*(-r*o*u-t*l*h+t*o*f+r*a*h-i*a*f+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],m=e[11],g=e[12],v=e[13],p=e[14],d=e[15],E=h*p*c-v*f*c+v*l*m-o*p*m-h*l*d+o*f*d,S=g*f*c-u*p*c-g*l*m+a*p*m+u*l*d-a*f*d,T=u*v*c-g*h*c+g*o*m-a*v*m-u*o*d+a*h*d,D=g*h*l-u*v*l-g*o*f+a*v*f+u*o*p-a*h*p,R=t*E+i*S+r*T+s*D;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/R;return e[0]=E*A,e[1]=(v*f*s-h*p*s-v*r*m+i*p*m+h*r*d-i*f*d)*A,e[2]=(o*p*s-v*l*s+v*r*c-i*p*c-o*r*d+i*l*d)*A,e[3]=(h*l*s-o*f*s-h*r*c+i*f*c+o*r*m-i*l*m)*A,e[4]=S*A,e[5]=(u*p*s-g*f*s+g*r*m-t*p*m-u*r*d+t*f*d)*A,e[6]=(g*l*s-a*p*s-g*r*c+t*p*c+a*r*d-t*l*d)*A,e[7]=(a*f*s-u*l*s+u*r*c-t*f*c-a*r*m+t*l*m)*A,e[8]=T*A,e[9]=(g*h*s-u*v*s-g*i*m+t*v*m+u*i*d-t*h*d)*A,e[10]=(a*v*s-g*o*s+g*i*c-t*v*c-a*i*d+t*o*d)*A,e[11]=(u*o*s-a*h*s-u*i*c+t*h*c+a*i*m-t*o*m)*A,e[12]=D*A,e[13]=(u*v*r-g*h*r+g*i*f-t*v*f-u*i*p+t*h*p)*A,e[14]=(g*o*r-a*v*r-g*i*l+t*v*l+a*i*p-t*o*p)*A,e[15]=(a*h*r-u*o*r+u*i*l-t*h*l-a*i*f+t*o*f)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,u=a+a,h=o+o,f=s*c,m=s*u,g=s*h,v=a*u,p=a*h,d=o*h,E=l*c,S=l*u,T=l*h,D=i.x,R=i.y,A=i.z;return r[0]=(1-(v+d))*D,r[1]=(m+T)*D,r[2]=(g-S)*D,r[3]=0,r[4]=(m-T)*R,r[5]=(1-(f+d))*R,r[6]=(p+E)*R,r[7]=0,r[8]=(g+S)*A,r[9]=(p-E)*A,r[10]=(1-(f+v))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Bi.set(r[0],r[1],r[2]).length();const a=Bi.set(r[4],r[5],r[6]).length(),o=Bi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],vn.copy(this);const c=1/s,u=1/a,h=1/o;return vn.elements[0]*=c,vn.elements[1]*=c,vn.elements[2]*=c,vn.elements[4]*=u,vn.elements[5]*=u,vn.elements[6]*=u,vn.elements[8]*=h,vn.elements[9]*=h,vn.elements[10]*=h,t.setFromRotationMatrix(vn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=Hn){const l=this.elements,c=2*s/(t-e),u=2*s/(i-r),h=(t+e)/(t-e),f=(i+r)/(i-r);let m,g;if(o===Hn)m=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===Rs)m=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=Hn){const l=this.elements,c=1/(t-e),u=1/(i-r),h=1/(a-s),f=(t+e)*c,m=(i+r)*u;let g,v;if(o===Hn)g=(a+s)*h,v=-2*h;else if(o===Rs)g=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Bi=new C,vn=new Mt,Rf=new C(0,0,0),Cf=new C(1,1,1),$n=new C,jr=new C,nn=new C,El=new Mt,bl=new Ui;class Xs{constructor(e=0,t=0,i=0,r=Xs.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],h=r[2],f=r[6],m=r[10];switch(t){case"XYZ":this._y=Math.asin(Pt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Pt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Pt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Pt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Pt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Pt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return El.makeRotationFromQuaternion(e),this.setFromRotationMatrix(El,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bl.setFromEuler(this),this.setFromQuaternion(bl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xs.DEFAULT_ORDER="XYZ";class po{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Pf=0;const Al=new C,ki=new Ui,Fn=new Mt,Qr=new C,gr=new C,Lf=new C,Df=new Ui,wl=new C(1,0,0),Rl=new C(0,1,0),Cl=new C(0,0,1),Uf={type:"added"},If={type:"removed"};class en extends hr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pf++}),this.uuid=Di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const e=new C,t=new Xs,i=new Ui,r=new C(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Mt},normalMatrix:{value:new Ve}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new po,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ki.setFromAxisAngle(e,t),this.quaternion.multiply(ki),this}rotateOnWorldAxis(e,t){return ki.setFromAxisAngle(e,t),this.quaternion.premultiply(ki),this}rotateX(e){return this.rotateOnAxis(wl,e)}rotateY(e){return this.rotateOnAxis(Rl,e)}rotateZ(e){return this.rotateOnAxis(Cl,e)}translateOnAxis(e,t){return Al.copy(e).applyQuaternion(this.quaternion),this.position.add(Al.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(wl,e)}translateY(e){return this.translateOnAxis(Rl,e)}translateZ(e){return this.translateOnAxis(Cl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Qr.copy(e):Qr.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(gr,Qr,this.up):Fn.lookAt(Qr,gr,this.up),this.quaternion.setFromRotationMatrix(Fn),r&&(Fn.extractRotation(r.matrixWorld),ki.setFromRotationMatrix(Fn),this.quaternion.premultiply(ki.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Uf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(If)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gr,e,Lf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gr,Df,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++){const s=t[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++){const o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),m=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),g.length>0&&(i.nodes=g)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}en.DEFAULT_UP=new C(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _n=new C,On=new C,va=new C,zn=new C,Hi=new C,Gi=new C,Pl=new C,_a=new C,xa=new C,Sa=new C;let es=!1;class xn{constructor(e=new C,t=new C,i=new C){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),_n.subVectors(e,t),r.cross(_n);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){_n.subVectors(r,t),On.subVectors(i,t),va.subVectors(e,t);const a=_n.dot(_n),o=_n.dot(On),l=_n.dot(va),c=On.dot(On),u=On.dot(va),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const f=1/h,m=(c*l-o*u)*f,g=(a*u-o*l)*f;return s.set(1-m-g,g,m)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getUV(e,t,i,r,s,a,o,l){return es===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),es=!0),this.getInterpolation(e,t,i,r,s,a,o,l)}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,zn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,zn.x),l.addScaledVector(a,zn.y),l.addScaledVector(o,zn.z),l)}static isFrontFacing(e,t,i,r){return _n.subVectors(i,t),On.subVectors(e,t),_n.cross(On).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _n.subVectors(this.c,this.b),On.subVectors(this.a,this.b),_n.cross(On).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return xn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return xn.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,r,s){return es===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),es=!0),xn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}getInterpolation(e,t,i,r,s){return xn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return xn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return xn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Hi.subVectors(r,i),Gi.subVectors(s,i),_a.subVectors(e,i);const l=Hi.dot(_a),c=Gi.dot(_a);if(l<=0&&c<=0)return t.copy(i);xa.subVectors(e,r);const u=Hi.dot(xa),h=Gi.dot(xa);if(u>=0&&h<=u)return t.copy(r);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(Hi,a);Sa.subVectors(e,s);const m=Hi.dot(Sa),g=Gi.dot(Sa);if(g>=0&&m<=g)return t.copy(s);const v=m*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Gi,o);const p=u*g-m*h;if(p<=0&&h-u>=0&&m-g>=0)return Pl.subVectors(s,r),o=(h-u)/(h-u+(m-g)),t.copy(r).addScaledVector(Pl,o);const d=1/(p+v+f);return a=v*d,o=f*d,t.copy(i).addScaledVector(Hi,a).addScaledVector(Gi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Bc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},ts={h:0,s:0,l:0};function Ma(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class _e{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Qe.workingColorSpace){if(e=ho(e,1),t=Pt(t,0,1),i=Pt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Ma(a,s,e+1/3),this.g=Ma(a,s,e),this.b=Ma(a,s,e-1/3)}return Qe.toWorkingColorSpace(this,r),this}setStyle(e,t=Ct){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){const i=Bc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=tr(e.r),this.g=tr(e.g),this.b=tr(e.b),this}copyLinearToSRGB(e){return this.r=ca(e.r),this.g=ca(e.g),this.b=ca(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return Qe.fromWorkingColorSpace(Nt.copy(this),e),Math.round(Pt(Nt.r*255,0,255))*65536+Math.round(Pt(Nt.g*255,0,255))*256+Math.round(Pt(Nt.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Nt.copy(this),t);const i=Nt.r,r=Nt.g,s=Nt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=Ct){Qe.fromWorkingColorSpace(Nt.copy(this),e);const t=Nt.r,i=Nt.g,r=Nt.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Kn),this.setHSL(Kn.h+e,Kn.s+t,Kn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Kn),e.getHSL(ts);const i=Er(Kn.h,ts.h,t),r=Er(Kn.s,ts.s,t),s=Er(Kn.l,ts.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new _e;_e.NAMES=Bc;let Nf=0;class Or extends hr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=Di(),this.name="",this.type="Material",this.blending=er,this.side=oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ha,this.blendDst=Ga,this.blendEquation=xi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _e(0,0,0),this.blendAlpha=0,this.depthFunc=Cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ii,this.stencilZFail=Ii,this.stencilZPass=Ii,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==er&&(i.blending=this.blending),this.side!==oi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ha&&(i.blendSrc=this.blendSrc),this.blendDst!==Ga&&(i.blendDst=this.blendDst),this.blendEquation!==xi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Cr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ii&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ii&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ii&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class mo extends Or{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new _e(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ec,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const mt=new C,ns=new ie;class qt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=ti,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ns.fromBufferAttribute(this,t),ns.applyMatrix3(e),this.setXY(t,ns.x,ns.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix3(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyMatrix4(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.applyNormalMatrix(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)mt.fromBufferAttribute(this,t),mt.transformDirection(e),this.setXYZ(t,mt.x,mt.y,mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Zi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Vt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Zi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Zi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Zi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Zi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),i=Vt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),i=Vt(i,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),i=Vt(i,this.array),r=Vt(r,this.array),s=Vt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vl&&(e.usage=this.usage),e}}class kc extends qt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Hc extends qt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class fn extends qt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Ff=0;const on=new Mt,ya=new en,Vi=new C,rn=new Fr,vr=new Fr,At=new C;class mn extends hr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ff++}),this.uuid=Di(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Nc(e)?Hc:kc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ve().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,i){return on.makeTranslation(e,t,i),this.applyMatrix4(on),this}scale(e,t,i){return on.makeScale(e,t,i),this.applyMatrix4(on),this}lookAt(e){return ya.lookAt(e),ya.updateMatrix(),this.applyMatrix4(ya.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vi).negate(),this.translate(Vi.x,Vi.y,Vi.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new fn(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Fr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];rn.setFromBufferAttribute(s),this.morphTargetsRelative?(At.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(At),At.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(At)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ws);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(e){const i=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];vr.setFromBufferAttribute(o),this.morphTargetsRelative?(At.addVectors(rn.min,vr.min),rn.expandByPoint(At),At.addVectors(rn.max,vr.max),rn.expandByPoint(At)):(rn.expandByPoint(vr.min),rn.expandByPoint(vr.max))}rn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)At.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(At));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)At.fromBufferAttribute(o,c),l&&(Vi.fromBufferAttribute(e,c),At.add(Vi)),r=Math.max(r,i.distanceToSquared(At))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=t.position.array,s=t.normal.array,a=t.uv.array,o=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qt(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],u=[];for(let b=0;b<o;b++)c[b]=new C,u[b]=new C;const h=new C,f=new C,m=new C,g=new ie,v=new ie,p=new ie,d=new C,E=new C;function S(b,H,V){h.fromArray(r,b*3),f.fromArray(r,H*3),m.fromArray(r,V*3),g.fromArray(a,b*2),v.fromArray(a,H*2),p.fromArray(a,V*2),f.sub(h),m.sub(h),v.sub(g),p.sub(g);const re=1/(v.x*p.y-p.x*v.y);isFinite(re)&&(d.copy(f).multiplyScalar(p.y).addScaledVector(m,-v.y).multiplyScalar(re),E.copy(m).multiplyScalar(v.x).addScaledVector(f,-p.x).multiplyScalar(re),c[b].add(d),c[H].add(d),c[V].add(d),u[b].add(E),u[H].add(E),u[V].add(E))}let T=this.groups;T.length===0&&(T=[{start:0,count:i.length}]);for(let b=0,H=T.length;b<H;++b){const V=T[b],re=V.start,P=V.count;for(let z=re,k=re+P;z<k;z+=3)S(i[z+0],i[z+1],i[z+2])}const D=new C,R=new C,A=new C,Z=new C;function y(b){A.fromArray(s,b*3),Z.copy(A);const H=c[b];D.copy(H),D.sub(A.multiplyScalar(A.dot(H))).normalize(),R.crossVectors(Z,H);const re=R.dot(u[b])<0?-1:1;l[b*4]=D.x,l[b*4+1]=D.y,l[b*4+2]=D.z,l[b*4+3]=re}for(let b=0,H=T.length;b<H;++b){const V=T[b],re=V.start,P=V.count;for(let z=re,k=re+P;z<k;z+=3)y(i[z+0]),y(i[z+1]),y(i[z+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new qt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const r=new C,s=new C,a=new C,o=new C,l=new C,c=new C,u=new C,h=new C;if(e)for(let f=0,m=e.count;f<m;f+=3){const g=e.getX(f+0),v=e.getX(f+1),p=e.getX(f+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,p),o.add(u),l.add(u),c.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)At.fromBufferAttribute(e,t),At.normalize(),e.setXYZ(t,At.x,At.y,At.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,f=new c.constructor(l.length*u);let m=0,g=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?m=l[v]*o.data.stride+o.offset:m=l[v]*u;for(let d=0;d<u;d++)f[g++]=c[m++]}return new qt(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new mn,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const f=c[u],m=e(f,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const m=c[h];u.push(m.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,m=h.length;f<m;f++)u.push(h[f].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ll=new Mt,mi=new fo,is=new Ws,Dl=new C,Wi=new C,Xi=new C,qi=new C,Ta=new C,rs=new C,ss=new ie,as=new ie,os=new ie,Ul=new C,Il=new C,Nl=new C,ls=new C,cs=new C;class St extends en{constructor(e=new mn,t=new mo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){rs.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],h=s[l];u!==0&&(Ta.fromBufferAttribute(h,e),a?rs.addScaledVector(Ta,u):rs.addScaledVector(Ta.sub(t),u))}t.add(rs)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),is.copy(i.boundingSphere),is.applyMatrix4(s),mi.copy(e.ray).recast(e.near),!(is.containsPoint(mi.origin)===!1&&(mi.intersectSphere(is,Dl)===null||mi.origin.distanceToSquared(Dl)>(e.far-e.near)**2))&&(Ll.copy(s).invert(),mi.copy(e.ray).applyMatrix4(Ll),!(i.boundingBox!==null&&mi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,mi)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],d=a[p.materialIndex],E=Math.max(p.start,m.start),S=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let T=E,D=S;T<D;T+=3){const R=o.getX(T),A=o.getX(T+1),Z=o.getX(T+2);r=us(this,d,e,i,c,u,h,R,A,Z),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=g,d=v;p<d;p+=3){const E=o.getX(p),S=o.getX(p+1),T=o.getX(p+2);r=us(this,a,e,i,c,u,h,E,S,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=f.length;g<v;g++){const p=f[g],d=a[p.materialIndex],E=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let T=E,D=S;T<D;T+=3){const R=T,A=T+1,Z=T+2;r=us(this,d,e,i,c,u,h,R,A,Z),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let p=g,d=v;p<d;p+=3){const E=p,S=p+1,T=p+2;r=us(this,a,e,i,c,u,h,E,S,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function Of(n,e,t,i,r,s,a,o){let l;if(e.side===Jt?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===oi,o),l===null)return null;cs.copy(o),cs.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(cs);return c<t.near||c>t.far?null:{distance:c,point:cs.clone(),object:n}}function us(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,Wi),n.getVertexPosition(l,Xi),n.getVertexPosition(c,qi);const u=Of(n,e,t,i,Wi,Xi,qi,ls);if(u){r&&(ss.fromBufferAttribute(r,o),as.fromBufferAttribute(r,l),os.fromBufferAttribute(r,c),u.uv=xn.getInterpolation(ls,Wi,Xi,qi,ss,as,os,new ie)),s&&(ss.fromBufferAttribute(s,o),as.fromBufferAttribute(s,l),os.fromBufferAttribute(s,c),u.uv1=xn.getInterpolation(ls,Wi,Xi,qi,ss,as,os,new ie),u.uv2=u.uv1),a&&(Ul.fromBufferAttribute(a,o),Il.fromBufferAttribute(a,l),Nl.fromBufferAttribute(a,c),u.normal=xn.getInterpolation(ls,Wi,Xi,qi,Ul,Il,Nl,new C),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new C,materialIndex:0};xn.getNormal(Wi,Xi,qi,h.normal),u.face=h}return u}class zr extends mn{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let f=0,m=0;g("z","y","x",-1,-1,i,t,e,a,s,0),g("z","y","x",1,-1,i,t,-e,a,s,1),g("x","z","y",1,1,e,i,t,r,a,2),g("x","z","y",1,-1,e,i,-t,r,a,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new fn(c,3)),this.setAttribute("normal",new fn(u,3)),this.setAttribute("uv",new fn(h,2));function g(v,p,d,E,S,T,D,R,A,Z,y){const b=T/A,H=D/Z,V=T/2,re=D/2,P=R/2,z=A+1,k=Z+1;let X=0,G=0;const W=new C;for(let q=0;q<k;q++){const Q=q*H-re;for(let ee=0;ee<z;ee++){const B=ee*b-V;W[v]=B*E,W[p]=Q*S,W[d]=P,c.push(W.x,W.y,W.z),W[v]=0,W[p]=0,W[d]=R>0?1:-1,u.push(W.x,W.y,W.z),h.push(ee/A),h.push(1-q/Z),X+=1}}for(let q=0;q<Z;q++)for(let Q=0;Q<A;Q++){const ee=f+Q+z*q,B=f+Q+z*(q+1),Y=f+(Q+1)+z*(q+1),ce=f+(Q+1)+z*q;l.push(ee,B,ce),l.push(B,Y,ce),G+=6}o.addGroup(m,G,y),m+=G,f+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function or(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Wt(n){const e={};for(let t=0;t<n.length;t++){const i=or(n[t]);for(const r in i)e[r]=i[r]}return e}function zf(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Gc(n){return n.getRenderTarget()===null?n.outputColorSpace:Qe.workingColorSpace}const Ds={clone:or,merge:Wt};var Bf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,kf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ft extends Or{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bf,this.fragmentShader=kf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=or(e.uniforms),this.uniformsGroups=zf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Vc extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=Hn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class cn extends Vc{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Pr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Pr*2*Math.atan(Math.tan(Tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Tr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Yi=-90,$i=1;class Hf extends en{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new cn(Yi,$i,e,t);r.layers=this.layers,this.add(r);const s=new cn(Yi,$i,e,t);s.layers=this.layers,this.add(s);const a=new cn(Yi,$i,e,t);a.layers=this.layers,this.add(a);const o=new cn(Yi,$i,e,t);o.layers=this.layers,this.add(o);const l=new cn(Yi,$i,e,t);l.layers=this.layers,this.add(l);const c=new cn(Yi,$i,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===Hn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Rs)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,f,m),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Wc extends jt{constructor(e,t,i,r,s,a,o,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:rr,super(e,t,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gf extends Qt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];t.encoding!==void 0&&(br("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===wi?Ct:un),this.texture=new Wc(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Kt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new zr(5,5,5),s=new ft({name:"CubemapFromEquirect",uniforms:or(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Jt,blending:Gn});s.uniforms.tEquirect.value=t;const a=new St(r,s),o=t.minFilter;return t.minFilter===li&&(t.minFilter=Kt),new Hf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}const Ea=new C,Vf=new C,Wf=new Ve;class Jn{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Ea.subVectors(i,t).cross(Vf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ea),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Wf.getNormalMatrix(e),r=this.coplanarPoint(Ea).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new Ws,hs=new C;class Xc{constructor(e=new Jn,t=new Jn,i=new Jn,r=new Jn,s=new Jn,a=new Jn){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Hn){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],h=r[6],f=r[7],m=r[8],g=r[9],v=r[10],p=r[11],d=r[12],E=r[13],S=r[14],T=r[15];if(i[0].setComponents(l-s,f-c,p-m,T-d).normalize(),i[1].setComponents(l+s,f+c,p+m,T+d).normalize(),i[2].setComponents(l+a,f+u,p+g,T+E).normalize(),i[3].setComponents(l-a,f-u,p-g,T-E).normalize(),i[4].setComponents(l-o,f-h,p-v,T-S).normalize(),t===Hn)i[5].setComponents(l+o,f+h,p+v,T+S).normalize();else if(t===Rs)i[5].setComponents(o,h,v,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(e){return gi.center.set(0,0,0),gi.radius=.7071067811865476,gi.applyMatrix4(e.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(hs.x=r.normal.x>0?e.max.x:e.min.x,hs.y=r.normal.y>0?e.max.y:e.min.y,hs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(hs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function qc(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Xf(n,e){const t=e.isWebGL2,i=new WeakMap;function r(c,u){const h=c.array,f=c.usage,m=h.byteLength,g=n.createBuffer();n.bindBuffer(u,g),n.bufferData(u,h,f),c.onUploadCallback();let v;if(h instanceof Float32Array)v=n.FLOAT;else if(h instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)v=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=n.UNSIGNED_SHORT;else if(h instanceof Int16Array)v=n.SHORT;else if(h instanceof Uint32Array)v=n.UNSIGNED_INT;else if(h instanceof Int32Array)v=n.INT;else if(h instanceof Int8Array)v=n.BYTE;else if(h instanceof Uint8Array)v=n.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)v=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:g,type:v,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:m}}function s(c,u,h){const f=u.array,m=u._updateRange,g=u.updateRanges;if(n.bindBuffer(h,c),m.count===-1&&g.length===0&&n.bufferSubData(h,0,f),g.length!==0){for(let v=0,p=g.length;v<p;v++){const d=g[v];t?n.bufferSubData(h,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):n.bufferSubData(h,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}u.clearUpdateRanges()}m.count!==-1&&(t?n.bufferSubData(h,m.offset*f.BYTES_PER_ELEMENT,f,m.offset,m.count):n.bufferSubData(h,m.offset*f.BYTES_PER_ELEMENT,f.subarray(m.offset,m.offset+m.count)),m.count=-1),u.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const u=i.get(c);u&&(n.deleteBuffer(u.buffer),i.delete(c))}function l(c,u){if(c.isGLBufferAttribute){const f=i.get(c);(!f||f.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);if(h===void 0)i.set(c,r(c,u));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(h.buffer,c,u),h.version=c.version}}return{get:a,remove:o,update:l}}class Wn extends mn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,h=e/o,f=t/l,m=[],g=[],v=[],p=[];for(let d=0;d<u;d++){const E=d*f-a;for(let S=0;S<c;S++){const T=S*h-s;g.push(T,-E,0),v.push(0,0,1),p.push(S/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let E=0;E<o;E++){const S=E+c*d,T=E+c*(d+1),D=E+1+c*(d+1),R=E+1+c*d;m.push(S,T,R),m.push(T,D,R)}this.setIndex(m),this.setAttribute("position",new fn(g,3)),this.setAttribute("normal",new fn(v,3)),this.setAttribute("uv",new fn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wn(e.width,e.height,e.widthSegments,e.heightSegments)}}var qf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yf=`#ifdef USE_ALPHAHASH
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
#endif`,$f=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Kf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Jf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jf=`#ifdef USE_AOMAP
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
#endif`,Qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ed=`#ifdef USE_BATCHING
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
#endif`,td=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,nd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,id=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,sd=`#ifdef USE_IRIDESCENCE
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
#endif`,ad=`#ifdef USE_BUMPMAP
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
#endif`,od=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ld=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ud=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,dd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,pd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,md=`#define PI 3.141592653589793
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
} // validated`,gd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,vd=`vec3 transformedNormal = objectNormal;
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
#endif`,_d=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Sd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Md=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Td=`
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
}`,Ed=`#ifdef USE_ENVMAP
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
#endif`,bd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ad=`#ifdef USE_ENVMAP
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
#endif`,wd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rd=`#ifdef USE_ENVMAP
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
#endif`,Cd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Pd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ld=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ud=`#ifdef USE_GRADIENTMAP
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
}`,Id=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Nd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Fd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Od=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zd=`uniform bool receiveShadow;
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
#endif`,Bd=`#ifdef USE_ENVMAP
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
#endif`,kd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wd=`PhysicalMaterial material;
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
#endif`,Xd=`struct PhysicalMaterial {
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
}`,qd=`
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
#endif`,Yd=`#if defined( RE_IndirectDiffuse )
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
#endif`,$d=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Kd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zd=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Jd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,jd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Qd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ep=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,np=`#if defined( USE_POINTS_UV )
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
#endif`,ip=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,sp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ap=`#ifdef USE_MORPHNORMALS
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
#endif`,op=`#ifdef USE_MORPHTARGETS
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
#endif`,lp=`#ifdef USE_MORPHTARGETS
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
#endif`,cp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,up=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,hp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,pp=`#ifdef USE_NORMALMAP
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
#endif`,mp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_p=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Mp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Tp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ep=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ap=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Rp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Pp=`float getShadowMask() {
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
}`,Lp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dp=`#ifdef USE_SKINNING
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
#endif`,Up=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ip=`#ifdef USE_SKINNING
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
#endif`,Np=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Op=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bp=`#ifdef USE_TRANSMISSION
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
#endif`,kp=`#ifdef USE_TRANSMISSION
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
#endif`,Hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qp=`uniform sampler2D t2D;
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
}`,Yp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$p=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Kp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jp=`#include <common>
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
}`,jp=`#if DEPTH_PACKING == 3200
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
}`,Qp=`#define DISTANCE
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
}`,em=`#define DISTANCE
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
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,nm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,im=`uniform float scale;
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
}`,rm=`uniform vec3 diffuse;
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
}`,sm=`#include <common>
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
}`,am=`uniform vec3 diffuse;
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
}`,om=`#define LAMBERT
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
}`,lm=`#define LAMBERT
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
}`,cm=`#define MATCAP
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
}`,um=`#define MATCAP
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
}`,hm=`#define NORMAL
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
}`,fm=`#define NORMAL
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
}`,dm=`#define PHONG
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
}`,pm=`#define PHONG
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
}`,mm=`#define STANDARD
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
}`,gm=`#define STANDARD
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
}`,vm=`#define TOON
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
}`,_m=`#define TOON
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
}`,xm=`uniform float size;
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
}`,Sm=`uniform vec3 diffuse;
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
}`,Mm=`#include <common>
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
}`,ym=`uniform vec3 color;
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
}`,Tm=`uniform float rotation;
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
}`,Em=`uniform vec3 diffuse;
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
}`,Fe={alphahash_fragment:qf,alphahash_pars_fragment:Yf,alphamap_fragment:$f,alphamap_pars_fragment:Kf,alphatest_fragment:Zf,alphatest_pars_fragment:Jf,aomap_fragment:jf,aomap_pars_fragment:Qf,batching_pars_vertex:ed,batching_vertex:td,begin_vertex:nd,beginnormal_vertex:id,bsdfs:rd,iridescence_fragment:sd,bumpmap_pars_fragment:ad,clipping_planes_fragment:od,clipping_planes_pars_fragment:ld,clipping_planes_pars_vertex:cd,clipping_planes_vertex:ud,color_fragment:hd,color_pars_fragment:fd,color_pars_vertex:dd,color_vertex:pd,common:md,cube_uv_reflection_fragment:gd,defaultnormal_vertex:vd,displacementmap_pars_vertex:_d,displacementmap_vertex:xd,emissivemap_fragment:Sd,emissivemap_pars_fragment:Md,colorspace_fragment:yd,colorspace_pars_fragment:Td,envmap_fragment:Ed,envmap_common_pars_fragment:bd,envmap_pars_fragment:Ad,envmap_pars_vertex:wd,envmap_physical_pars_fragment:Bd,envmap_vertex:Rd,fog_vertex:Cd,fog_pars_vertex:Pd,fog_fragment:Ld,fog_pars_fragment:Dd,gradientmap_pars_fragment:Ud,lightmap_fragment:Id,lightmap_pars_fragment:Nd,lights_lambert_fragment:Fd,lights_lambert_pars_fragment:Od,lights_pars_begin:zd,lights_toon_fragment:kd,lights_toon_pars_fragment:Hd,lights_phong_fragment:Gd,lights_phong_pars_fragment:Vd,lights_physical_fragment:Wd,lights_physical_pars_fragment:Xd,lights_fragment_begin:qd,lights_fragment_maps:Yd,lights_fragment_end:$d,logdepthbuf_fragment:Kd,logdepthbuf_pars_fragment:Zd,logdepthbuf_pars_vertex:Jd,logdepthbuf_vertex:jd,map_fragment:Qd,map_pars_fragment:ep,map_particle_fragment:tp,map_particle_pars_fragment:np,metalnessmap_fragment:ip,metalnessmap_pars_fragment:rp,morphcolor_vertex:sp,morphnormal_vertex:ap,morphtarget_pars_vertex:op,morphtarget_vertex:lp,normal_fragment_begin:cp,normal_fragment_maps:up,normal_pars_fragment:hp,normal_pars_vertex:fp,normal_vertex:dp,normalmap_pars_fragment:pp,clearcoat_normal_fragment_begin:mp,clearcoat_normal_fragment_maps:gp,clearcoat_pars_fragment:vp,iridescence_pars_fragment:_p,opaque_fragment:xp,packing:Sp,premultiplied_alpha_fragment:Mp,project_vertex:yp,dithering_fragment:Tp,dithering_pars_fragment:Ep,roughnessmap_fragment:bp,roughnessmap_pars_fragment:Ap,shadowmap_pars_fragment:wp,shadowmap_pars_vertex:Rp,shadowmap_vertex:Cp,shadowmask_pars_fragment:Pp,skinbase_vertex:Lp,skinning_pars_vertex:Dp,skinning_vertex:Up,skinnormal_vertex:Ip,specularmap_fragment:Np,specularmap_pars_fragment:Fp,tonemapping_fragment:Op,tonemapping_pars_fragment:zp,transmission_fragment:Bp,transmission_pars_fragment:kp,uv_pars_fragment:Hp,uv_pars_vertex:Gp,uv_vertex:Vp,worldpos_vertex:Wp,background_vert:Xp,background_frag:qp,backgroundCube_vert:Yp,backgroundCube_frag:$p,cube_vert:Kp,cube_frag:Zp,depth_vert:Jp,depth_frag:jp,distanceRGBA_vert:Qp,distanceRGBA_frag:em,equirect_vert:tm,equirect_frag:nm,linedashed_vert:im,linedashed_frag:rm,meshbasic_vert:sm,meshbasic_frag:am,meshlambert_vert:om,meshlambert_frag:lm,meshmatcap_vert:cm,meshmatcap_frag:um,meshnormal_vert:hm,meshnormal_frag:fm,meshphong_vert:dm,meshphong_frag:pm,meshphysical_vert:mm,meshphysical_frag:gm,meshtoon_vert:vm,meshtoon_frag:_m,points_vert:xm,points_frag:Sm,shadow_vert:Mm,shadow_frag:ym,sprite_vert:Tm,sprite_frag:Em},ne={common:{diffuse:{value:new _e(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ve}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ve}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ve}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ve},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ve},normalScale:{value:new ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ve},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ve}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ve}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ve}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _e(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new _e(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0},uvTransform:{value:new Ve}},sprite:{diffuse:{value:new _e(16777215)},opacity:{value:1},center:{value:new ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ve},alphaMap:{value:null},alphaMapTransform:{value:new Ve},alphaTest:{value:0}}},An={basic:{uniforms:Wt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:Wt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new _e(0)}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:Wt([ne.common,ne.specularmap,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,ne.lights,{emissive:{value:new _e(0)},specular:{value:new _e(1118481)},shininess:{value:30}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:Wt([ne.common,ne.envmap,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.roughnessmap,ne.metalnessmap,ne.fog,ne.lights,{emissive:{value:new _e(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:Wt([ne.common,ne.aomap,ne.lightmap,ne.emissivemap,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.gradientmap,ne.fog,ne.lights,{emissive:{value:new _e(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:Wt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,ne.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:Wt([ne.points,ne.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:Wt([ne.common,ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:Wt([ne.common,ne.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:Wt([ne.common,ne.bumpmap,ne.normalmap,ne.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:Wt([ne.sprite,ne.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ve},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distanceRGBA:{uniforms:Wt([ne.common,ne.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distanceRGBA_vert,fragmentShader:Fe.distanceRGBA_frag},shadow:{uniforms:Wt([ne.lights,ne.fog,{color:{value:new _e(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};An.physical={uniforms:Wt([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ve},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ve},clearcoatNormalScale:{value:new ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ve},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ve},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ve},sheen:{value:0},sheenColor:{value:new _e(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ve},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ve},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ve},transmissionSamplerSize:{value:new ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ve},attenuationDistance:{value:0},attenuationColor:{value:new _e(0)},specularColor:{value:new _e(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ve},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ve},anisotropyVector:{value:new ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ve}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};const fs={r:0,b:0,g:0};function bm(n,e,t,i,r,s,a){const o=new _e(0);let l=s===!0?0:1,c,u,h=null,f=0,m=null;function g(p,d){let E=!1,S=d.isScene===!0?d.background:null;S&&S.isTexture&&(S=(d.backgroundBlurriness>0?t:e).get(S)),S===null?v(o,l):S&&S.isColor&&(v(S,1),E=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||E)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),S&&(S.isCubeTexture||S.mapping===Gs)?(u===void 0&&(u=new St(new zr(1,1,1),new ft({name:"BackgroundCubeMaterial",uniforms:or(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(D,R,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.toneMapped=Qe.getTransfer(S.colorSpace)!==st,(h!==S||f!==S.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,h=S,f=S.version,m=n.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new St(new Wn(2,2),new ft({name:"BackgroundMaterial",uniforms:or(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(S.colorSpace)!==st,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||f!==S.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,h=S,f=S.version,m=n.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function v(p,d){p.getRGB(fs,Gc(n)),i.buffers.color.setClear(fs.r,fs.g,fs.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(p,d=1){o.set(p),l=d,v(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,v(o,l)},render:g}}function Am(n,e,t,i){const r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},l=p(null);let c=l,u=!1;function h(P,z,k,X,G){let W=!1;if(a){const q=v(X,k,z);c!==q&&(c=q,m(c.object)),W=d(P,X,k,G),W&&E(P,X,k,G)}else{const q=z.wireframe===!0;(c.geometry!==X.id||c.program!==k.id||c.wireframe!==q)&&(c.geometry=X.id,c.program=k.id,c.wireframe=q,W=!0)}G!==null&&t.update(G,n.ELEMENT_ARRAY_BUFFER),(W||u)&&(u=!1,Z(P,z,k,X),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function f(){return i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()}function m(P){return i.isWebGL2?n.bindVertexArray(P):s.bindVertexArrayOES(P)}function g(P){return i.isWebGL2?n.deleteVertexArray(P):s.deleteVertexArrayOES(P)}function v(P,z,k){const X=k.wireframe===!0;let G=o[P.id];G===void 0&&(G={},o[P.id]=G);let W=G[z.id];W===void 0&&(W={},G[z.id]=W);let q=W[X];return q===void 0&&(q=p(f()),W[X]=q),q}function p(P){const z=[],k=[],X=[];for(let G=0;G<r;G++)z[G]=0,k[G]=0,X[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:k,attributeDivisors:X,object:P,attributes:{},index:null}}function d(P,z,k,X){const G=c.attributes,W=z.attributes;let q=0;const Q=k.getAttributes();for(const ee in Q)if(Q[ee].location>=0){const Y=G[ee];let ce=W[ee];if(ce===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(ce=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(ce=P.instanceColor)),Y===void 0||Y.attribute!==ce||ce&&Y.data!==ce.data)return!0;q++}return c.attributesNum!==q||c.index!==X}function E(P,z,k,X){const G={},W=z.attributes;let q=0;const Q=k.getAttributes();for(const ee in Q)if(Q[ee].location>=0){let Y=W[ee];Y===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(Y=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(Y=P.instanceColor));const ce={};ce.attribute=Y,Y&&Y.data&&(ce.data=Y.data),G[ee]=ce,q++}c.attributes=G,c.attributesNum=q,c.index=X}function S(){const P=c.newAttributes;for(let z=0,k=P.length;z<k;z++)P[z]=0}function T(P){D(P,0)}function D(P,z){const k=c.newAttributes,X=c.enabledAttributes,G=c.attributeDivisors;k[P]=1,X[P]===0&&(n.enableVertexAttribArray(P),X[P]=1),G[P]!==z&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,z),G[P]=z)}function R(){const P=c.newAttributes,z=c.enabledAttributes;for(let k=0,X=z.length;k<X;k++)z[k]!==P[k]&&(n.disableVertexAttribArray(k),z[k]=0)}function A(P,z,k,X,G,W,q){q===!0?n.vertexAttribIPointer(P,z,k,G,W):n.vertexAttribPointer(P,z,k,X,G,W)}function Z(P,z,k,X){if(i.isWebGL2===!1&&(P.isInstancedMesh||X.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;S();const G=X.attributes,W=k.getAttributes(),q=z.defaultAttributeValues;for(const Q in W){const ee=W[Q];if(ee.location>=0){let B=G[Q];if(B===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(B=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(B=P.instanceColor)),B!==void 0){const Y=B.normalized,ce=B.itemSize,xe=t.get(B);if(xe===void 0)continue;const ve=xe.buffer,De=xe.type,Ie=xe.bytesPerElement,Ae=i.isWebGL2===!0&&(De===n.INT||De===n.UNSIGNED_INT||B.gpuType===Ac);if(B.isInterleavedBufferAttribute){const Ye=B.data,U=Ye.stride,kt=B.offset;if(Ye.isInstancedInterleavedBuffer){for(let Me=0;Me<ee.locationSize;Me++)D(ee.location+Me,Ye.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=Ye.meshPerAttribute*Ye.count)}else for(let Me=0;Me<ee.locationSize;Me++)T(ee.location+Me);n.bindBuffer(n.ARRAY_BUFFER,ve);for(let Me=0;Me<ee.locationSize;Me++)A(ee.location+Me,ce/ee.locationSize,De,Y,U*Ie,(kt+ce/ee.locationSize*Me)*Ie,Ae)}else{if(B.isInstancedBufferAttribute){for(let Ye=0;Ye<ee.locationSize;Ye++)D(ee.location+Ye,B.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let Ye=0;Ye<ee.locationSize;Ye++)T(ee.location+Ye);n.bindBuffer(n.ARRAY_BUFFER,ve);for(let Ye=0;Ye<ee.locationSize;Ye++)A(ee.location+Ye,ce/ee.locationSize,De,Y,ce*Ie,ce/ee.locationSize*Ye*Ie,Ae)}}else if(q!==void 0){const Y=q[Q];if(Y!==void 0)switch(Y.length){case 2:n.vertexAttrib2fv(ee.location,Y);break;case 3:n.vertexAttrib3fv(ee.location,Y);break;case 4:n.vertexAttrib4fv(ee.location,Y);break;default:n.vertexAttrib1fv(ee.location,Y)}}}}R()}function y(){V();for(const P in o){const z=o[P];for(const k in z){const X=z[k];for(const G in X)g(X[G].object),delete X[G];delete z[k]}delete o[P]}}function b(P){if(o[P.id]===void 0)return;const z=o[P.id];for(const k in z){const X=z[k];for(const G in X)g(X[G].object),delete X[G];delete z[k]}delete o[P.id]}function H(P){for(const z in o){const k=o[z];if(k[P.id]===void 0)continue;const X=k[P.id];for(const G in X)g(X[G].object),delete X[G];delete k[P.id]}}function V(){re(),u=!0,c!==l&&(c=l,m(c.object))}function re(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:V,resetDefaultState:re,dispose:y,releaseStatesOfGeometry:b,releaseStatesOfProgram:H,initAttributes:S,enableAttribute:T,disableUnusedAttributes:R}}function wm(n,e,t,i){const r=i.isWebGL2;let s;function a(u){s=u}function o(u,h){n.drawArrays(s,u,h),t.update(h,s,1)}function l(u,h,f){if(f===0)return;let m,g;if(r)m=n,g="drawArraysInstanced";else if(m=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](s,u,h,f),t.update(h,s,f)}function c(u,h,f){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<f;g++)this.render(u[g],h[g]);else{m.multiDrawArraysWEBGL(s,u,0,h,0,f);let g=0;for(let v=0;v<f;v++)g+=h[v];t.update(g,s,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function Rm(n,e,t){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=s(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),u=t.logarithmicDepthBuffer===!0,h=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),v=n.getParameter(n.MAX_VERTEX_ATTRIBS),p=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),d=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),S=f>0,T=a||e.has("OES_texture_float"),D=S&&T,R=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:f,maxTextureSize:m,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:p,maxVaryings:d,maxFragmentUniforms:E,vertexTextures:S,floatFragmentTextures:T,floatVertexTextures:D,maxSamples:R}}function Cm(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new Jn,o=new Ve,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const m=h.length!==0||f||i!==0||r;return r=f,i=h.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=u(h,f,0)},this.setState=function(h,f,m){const g=h.clippingPlanes,v=h.clipIntersection,p=h.clipShadows,d=n.get(h);if(!r||g===null||g.length===0||s&&!p)s?u(null):c();else{const E=s?0:i,S=E*4;let T=d.clippingState||null;l.value=T,T=u(g,f,S,m);for(let D=0;D!==S;++D)T[D]=t[D];d.clippingState=T,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,m,g){const v=h!==null?h.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const d=m+v*4,E=f.matrixWorldInverse;o.getNormalMatrix(E),(p===null||p.length<d)&&(p=new Float32Array(d));for(let S=0,T=m;S!==v;++S,T+=4)a.copy(h[S]).applyMatrix4(E,o),a.normal.toArray(p,T),p[T+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function Pm(n){let e=new WeakMap;function t(a,o){return o===Va?a.mapping=rr:o===Wa&&(a.mapping=sr),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Va||o===Wa)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Gf(l.height/2);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class qs extends Vc{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ji=4,Fl=[.125,.215,.35,.446,.526,.582],Si=20,ba=new qs,Ol=new _e;let Aa=null,wa=0,Ra=0;const _i=(1+Math.sqrt(5))/2,Ki=1/_i,zl=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,_i,Ki),new C(0,_i,-Ki),new C(Ki,0,_i),new C(-Ki,0,_i),new C(_i,Ki,0),new C(-_i,Ki,0)];class Bl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Aa=this._renderer.getRenderTarget(),wa=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Aa,wa,Ra),e.scissorTest=!1,ds(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===rr||e.mapping===sr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Aa=this._renderer.getRenderTarget(),wa=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Kt,minFilter:Kt,generateMipmaps:!1,type:hn,format:yn,colorSpace:Vn,depthBuffer:!1},r=kl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kl(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Lm(s)),this._blurMaterial=Dm(s,e,t)}return r}_compileMaterial(e){const t=new St(this._lodPlanes[0],e);this._renderer.compile(t,ba)}_sceneToCubeUV(e,t,i,r){const o=new cn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(Ol),u.toneMapping=si,u.autoClear=!1;const m=new mo({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1}),g=new St(new zr,m);let v=!1;const p=e.background;p?p.isColor&&(m.color.copy(p),e.background=null,v=!0):(m.color.copy(Ol),v=!0);for(let d=0;d<6;d++){const E=d%3;E===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):E===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const S=this._cubeSize;ds(r,E*S,d>2?S:0,S,S),u.setRenderTarget(r),v&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=p}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===rr||e.mapping===sr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hl());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new St(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;ds(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,ba)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=zl[(r-1)%zl.length];this._blur(e,r-1,r,s,a)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new St(this._lodPlanes[r],c),f=c.uniforms,m=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Si-1),v=s/g,p=isFinite(s)?1+Math.floor(u*v):Si;p>Si&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Si}`);const d=[];let E=0;for(let A=0;A<Si;++A){const Z=A/v,y=Math.exp(-Z*Z/2);d.push(y),A===0?E+=y:A<p&&(E+=2*y)}for(let A=0;A<d.length;A++)d[A]=d[A]/E;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-i;const T=this._sizeLods[r],D=3*T*(r>S-Ji?r-S+Ji:0),R=4*(this._cubeSize-T);ds(t,D,R,3*T,2*T),l.setRenderTarget(t),l.render(h,ba)}}function Lm(n){const e=[],t=[],i=[];let r=n;const s=n-Ji+1+Fl.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-Ji?l=Fl[a-n+Ji-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,v=3,p=2,d=1,E=new Float32Array(v*g*m),S=new Float32Array(p*g*m),T=new Float32Array(d*g*m);for(let R=0;R<m;R++){const A=R%3*2/3-1,Z=R>2?0:-1,y=[A,Z,0,A+2/3,Z,0,A+2/3,Z+1,0,A,Z,0,A+2/3,Z+1,0,A,Z+1,0];E.set(y,v*g*R),S.set(f,p*g*R);const b=[R,R,R,R,R,R];T.set(b,d*g*R)}const D=new mn;D.setAttribute("position",new qt(E,v)),D.setAttribute("uv",new qt(S,p)),D.setAttribute("faceIndex",new qt(T,d)),e.push(D),r>Ji&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function kl(n,e,t){const i=new Qt(n,e,t);return i.texture.mapping=Gs,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ds(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Dm(n,e,t){const i=new Float32Array(Si),r=new C(0,1,0);return new ft({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:go(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Hl(){return new ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:go(),fragmentShader:`

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
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function Gl(){return new ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Gn,depthTest:!1,depthWrite:!1})}function go(){return`

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
	`}function Um(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Va||l===Wa,u=l===rr||l===sr;if(c||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let h=e.get(o);return t===null&&(t=new Bl(n)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),e.set(o,h),h.texture}else{if(e.has(o))return e.get(o).texture;{const h=o.image;if(c&&h&&h.height>0||u&&h&&r(h)){t===null&&(t=new Bl(n));const f=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,f),o.addEventListener("dispose",s),f.texture}else return null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Im(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Nm(n,e,t,i){const r={},s=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const v=f.morphAttributes[g];for(let p=0,d=v.length;p<d;p++)e.remove(v[p])}f.removeEventListener("dispose",a),delete r[f.id];const m=s.get(f);m&&(e.remove(m),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(h,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const g in f)e.update(f[g],n.ARRAY_BUFFER);const m=h.morphAttributes;for(const g in m){const v=m[g];for(let p=0,d=v.length;p<d;p++)e.update(v[p],n.ARRAY_BUFFER)}}function c(h){const f=[],m=h.index,g=h.attributes.position;let v=0;if(m!==null){const E=m.array;v=m.version;for(let S=0,T=E.length;S<T;S+=3){const D=E[S+0],R=E[S+1],A=E[S+2];f.push(D,R,R,A,A,D)}}else if(g!==void 0){const E=g.array;v=g.version;for(let S=0,T=E.length/3-1;S<T;S+=3){const D=S+0,R=S+1,A=S+2;f.push(D,R,R,A,A,D)}}else return;const p=new(Nc(f)?Hc:kc)(f,1);p.version=v;const d=s.get(h);d&&e.remove(d),s.set(h,p)}function u(h){const f=s.get(h);if(f){const m=h.index;m!==null&&f.version<m.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function Fm(n,e,t,i){const r=i.isWebGL2;let s;function a(m){s=m}let o,l;function c(m){o=m.type,l=m.bytesPerElement}function u(m,g){n.drawElements(s,g,o,m*l),t.update(g,s,1)}function h(m,g,v){if(v===0)return;let p,d;if(r)p=n,d="drawElementsInstanced";else if(p=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[d](s,g,o,m*l,v),t.update(g,s,v)}function f(m,g,v){if(v===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<v;d++)this.render(m[d]/l,g[d]);else{p.multiDrawElementsWEBGL(s,g,0,o,m,0,v);let d=0;for(let E=0;E<v;E++)d+=g[E];t.update(d,s,1)}}this.setMode=a,this.setIndex=c,this.render=u,this.renderInstances=h,this.renderMultiDraw=f}function Om(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function zm(n,e){return n[0]-e[0]}function Bm(n,e){return Math.abs(e[1])-Math.abs(n[1])}function km(n,e,t){const i={},r=new Float32Array(8),s=new WeakMap,a=new wt,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,u,h){const f=c.morphTargetInfluences;if(e.isWebGL2===!0){const g=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,v=g!==void 0?g.length:0;let p=s.get(u);if(p===void 0||p.count!==v){let z=function(){re.dispose(),s.delete(u),u.removeEventListener("dispose",z)};var m=z;p!==void 0&&p.texture.dispose();const S=u.morphAttributes.position!==void 0,T=u.morphAttributes.normal!==void 0,D=u.morphAttributes.color!==void 0,R=u.morphAttributes.position||[],A=u.morphAttributes.normal||[],Z=u.morphAttributes.color||[];let y=0;S===!0&&(y=1),T===!0&&(y=2),D===!0&&(y=3);let b=u.attributes.position.count*y,H=1;b>e.maxTextureSize&&(H=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const V=new Float32Array(b*H*4*v),re=new zc(V,b,H,v);re.type=ti,re.needsUpdate=!0;const P=y*4;for(let k=0;k<v;k++){const X=R[k],G=A[k],W=Z[k],q=b*H*4*k;for(let Q=0;Q<X.count;Q++){const ee=Q*P;S===!0&&(a.fromBufferAttribute(X,Q),V[q+ee+0]=a.x,V[q+ee+1]=a.y,V[q+ee+2]=a.z,V[q+ee+3]=0),T===!0&&(a.fromBufferAttribute(G,Q),V[q+ee+4]=a.x,V[q+ee+5]=a.y,V[q+ee+6]=a.z,V[q+ee+7]=0),D===!0&&(a.fromBufferAttribute(W,Q),V[q+ee+8]=a.x,V[q+ee+9]=a.y,V[q+ee+10]=a.z,V[q+ee+11]=W.itemSize===4?a.w:1)}}p={count:v,texture:re,size:new ie(b,H)},s.set(u,p),u.addEventListener("dispose",z)}let d=0;for(let S=0;S<f.length;S++)d+=f[S];const E=u.morphTargetsRelative?1:1-d;h.getUniforms().setValue(n,"morphTargetBaseInfluence",E),h.getUniforms().setValue(n,"morphTargetInfluences",f),h.getUniforms().setValue(n,"morphTargetsTexture",p.texture,t),h.getUniforms().setValue(n,"morphTargetsTextureSize",p.size)}else{const g=f===void 0?0:f.length;let v=i[u.id];if(v===void 0||v.length!==g){v=[];for(let T=0;T<g;T++)v[T]=[T,0];i[u.id]=v}for(let T=0;T<g;T++){const D=v[T];D[0]=T,D[1]=f[T]}v.sort(Bm);for(let T=0;T<8;T++)T<g&&v[T][1]?(o[T][0]=v[T][0],o[T][1]=v[T][1]):(o[T][0]=Number.MAX_SAFE_INTEGER,o[T][1]=0);o.sort(zm);const p=u.morphAttributes.position,d=u.morphAttributes.normal;let E=0;for(let T=0;T<8;T++){const D=o[T],R=D[0],A=D[1];R!==Number.MAX_SAFE_INTEGER&&A?(p&&u.getAttribute("morphTarget"+T)!==p[R]&&u.setAttribute("morphTarget"+T,p[R]),d&&u.getAttribute("morphNormal"+T)!==d[R]&&u.setAttribute("morphNormal"+T,d[R]),r[T]=A,E+=A):(p&&u.hasAttribute("morphTarget"+T)===!0&&u.deleteAttribute("morphTarget"+T),d&&u.hasAttribute("morphNormal"+T)===!0&&u.deleteAttribute("morphNormal"+T),r[T]=0)}const S=u.morphTargetsRelative?1:1-E;h.getUniforms().setValue(n,"morphTargetBaseInfluence",S),h.getUniforms().setValue(n,"morphTargetInfluences",r)}}return{update:l}}function Hm(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class Yc extends jt{constructor(e,t,i,r,s,a,o,l,c,u){if(u=u!==void 0?u:Ai,u!==Ai&&u!==ar)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Ai&&(i=ei),i===void 0&&u===ar&&(i=bi),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Xt,this.minFilter=l!==void 0?l:Xt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const $c=new jt,Kc=new Yc(1,1);Kc.compareFunction=Ic;const Zc=new zc,Jc=new Af,jc=new Wc,Vl=[],Wl=[],Xl=new Float32Array(16),ql=new Float32Array(9),Yl=new Float32Array(4);function fr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Vl[r];if(s===void 0&&(s=new Float32Array(r),Vl[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function yt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Tt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ys(n,e){let t=Wl[e];t===void 0&&(t=new Int32Array(e),Wl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Gm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Vm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yt(t,e))return;n.uniform2fv(this.addr,e),Tt(t,e)}}function Wm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(yt(t,e))return;n.uniform3fv(this.addr,e),Tt(t,e)}}function Xm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yt(t,e))return;n.uniform4fv(this.addr,e),Tt(t,e)}}function qm(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(yt(t,i))return;Yl.set(i),n.uniformMatrix2fv(this.addr,!1,Yl),Tt(t,i)}}function Ym(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(yt(t,i))return;ql.set(i),n.uniformMatrix3fv(this.addr,!1,ql),Tt(t,i)}}function $m(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(yt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(yt(t,i))return;Xl.set(i),n.uniformMatrix4fv(this.addr,!1,Xl),Tt(t,i)}}function Km(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Zm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yt(t,e))return;n.uniform2iv(this.addr,e),Tt(t,e)}}function Jm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yt(t,e))return;n.uniform3iv(this.addr,e),Tt(t,e)}}function jm(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yt(t,e))return;n.uniform4iv(this.addr,e),Tt(t,e)}}function Qm(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function e0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(yt(t,e))return;n.uniform2uiv(this.addr,e),Tt(t,e)}}function t0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(yt(t,e))return;n.uniform3uiv(this.addr,e),Tt(t,e)}}function n0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(yt(t,e))return;n.uniform4uiv(this.addr,e),Tt(t,e)}}function i0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);const s=this.type===n.SAMPLER_2D_SHADOW?Kc:$c;t.setTexture2D(e||s,r)}function r0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Jc,r)}function s0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||jc,r)}function a0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Zc,r)}function o0(n){switch(n){case 5126:return Gm;case 35664:return Vm;case 35665:return Wm;case 35666:return Xm;case 35674:return qm;case 35675:return Ym;case 35676:return $m;case 5124:case 35670:return Km;case 35667:case 35671:return Zm;case 35668:case 35672:return Jm;case 35669:case 35673:return jm;case 5125:return Qm;case 36294:return e0;case 36295:return t0;case 36296:return n0;case 35678:case 36198:case 36298:case 36306:case 35682:return i0;case 35679:case 36299:case 36307:return r0;case 35680:case 36300:case 36308:case 36293:return s0;case 36289:case 36303:case 36311:case 36292:return a0}}function l0(n,e){n.uniform1fv(this.addr,e)}function c0(n,e){const t=fr(e,this.size,2);n.uniform2fv(this.addr,t)}function u0(n,e){const t=fr(e,this.size,3);n.uniform3fv(this.addr,t)}function h0(n,e){const t=fr(e,this.size,4);n.uniform4fv(this.addr,t)}function f0(n,e){const t=fr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function d0(n,e){const t=fr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function p0(n,e){const t=fr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function m0(n,e){n.uniform1iv(this.addr,e)}function g0(n,e){n.uniform2iv(this.addr,e)}function v0(n,e){n.uniform3iv(this.addr,e)}function _0(n,e){n.uniform4iv(this.addr,e)}function x0(n,e){n.uniform1uiv(this.addr,e)}function S0(n,e){n.uniform2uiv(this.addr,e)}function M0(n,e){n.uniform3uiv(this.addr,e)}function y0(n,e){n.uniform4uiv(this.addr,e)}function T0(n,e,t){const i=this.cache,r=e.length,s=Ys(t,r);yt(i,s)||(n.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||$c,s[a])}function E0(n,e,t){const i=this.cache,r=e.length,s=Ys(t,r);yt(i,s)||(n.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Jc,s[a])}function b0(n,e,t){const i=this.cache,r=e.length,s=Ys(t,r);yt(i,s)||(n.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||jc,s[a])}function A0(n,e,t){const i=this.cache,r=e.length,s=Ys(t,r);yt(i,s)||(n.uniform1iv(this.addr,s),Tt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Zc,s[a])}function w0(n){switch(n){case 5126:return l0;case 35664:return c0;case 35665:return u0;case 35666:return h0;case 35674:return f0;case 35675:return d0;case 35676:return p0;case 5124:case 35670:return m0;case 35667:case 35671:return g0;case 35668:case 35672:return v0;case 35669:case 35673:return _0;case 5125:return x0;case 36294:return S0;case 36295:return M0;case 36296:return y0;case 35678:case 36198:case 36298:case 36306:case 35682:return T0;case 35679:case 36299:case 36307:return E0;case 35680:case 36300:case 36308:case 36293:return b0;case 36289:case 36303:case 36311:case 36292:return A0}}class R0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=o0(t.type)}}class C0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=w0(t.type)}}class P0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const Ca=/(\w+)(\])?(\[|\.)?/g;function $l(n,e){n.seq.push(e),n.map[e.id]=e}function L0(n,e,t){const i=n.name,r=i.length;for(Ca.lastIndex=0;;){const s=Ca.exec(i),a=Ca.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){$l(t,c===void 0?new R0(o,n,e):new C0(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new P0(o),$l(t,h)),t=h}}}class Ts{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);L0(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function Kl(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const D0=37297;let U0=0;function I0(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function N0(n){const e=Qe.getPrimaries(Qe.workingColorSpace),t=Qe.getPrimaries(n);let i;switch(e===t?i="":e===ws&&t===As?i="LinearDisplayP3ToLinearSRGB":e===As&&t===ws&&(i="LinearSRGBToLinearDisplayP3"),n){case Vn:case Vs:return[i,"LinearTransferOETF"];case Ct:case uo:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Zl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+I0(n.getShaderSource(e),a)}else return r}function F0(n,e){const t=N0(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function O0(n,e){let t;switch(e){case Uh:t="Linear";break;case Ih:t="Reinhard";break;case Nh:t="OptimizedCineon";break;case Fh:t="ACESFilmic";break;case zh:t="AgX";break;case Oh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function z0(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ji).join(`
`)}function B0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ji).join(`
`)}function k0(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function H0(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function ji(n){return n!==""}function Jl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function jl(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const G0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ka(n){return n.replace(G0,W0)}const V0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function W0(n,e){let t=Fe[e];if(t===void 0){const i=V0.get(e);if(i!==void 0)t=Fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Ka(t)}const X0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ql(n){return n.replace(X0,q0)}function q0(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ec(n){let e="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Y0(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===yc?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===lh?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===kn&&(e="SHADOWMAP_TYPE_VSM"),e}function $0(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case rr:case sr:e="ENVMAP_TYPE_CUBE";break;case Gs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function K0(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case sr:e="ENVMAP_MODE_REFRACTION";break}return e}function Z0(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Ec:e="ENVMAP_BLENDING_MULTIPLY";break;case Lh:e="ENVMAP_BLENDING_MIX";break;case Dh:e="ENVMAP_BLENDING_ADD";break}return e}function J0(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function j0(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Y0(t),c=$0(t),u=K0(t),h=Z0(t),f=J0(t),m=t.isWebGL2?"":z0(t),g=B0(t),v=k0(s),p=r.createProgram();let d,E,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(ji).join(`
`),d.length>0&&(d+=`
`),E=[m,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(ji).join(`
`),E.length>0&&(E+=`
`)):(d=[ec(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ji).join(`
`),E=[m,ec(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==si?"#define TONE_MAPPING":"",t.toneMapping!==si?Fe.tonemapping_pars_fragment:"",t.toneMapping!==si?O0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,F0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ji).join(`
`)),a=Ka(a),a=Jl(a,t),a=jl(a,t),o=Ka(o),o=Jl(o,t),o=jl(o,t),a=Ql(a),o=Ql(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,E=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===_l?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===_l?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+E);const T=S+d+a,D=S+E+o,R=Kl(r,r.VERTEX_SHADER,T),A=Kl(r,r.FRAGMENT_SHADER,D);r.attachShader(p,R),r.attachShader(p,A),t.index0AttributeName!==void 0?r.bindAttribLocation(p,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(p,0,"position"),r.linkProgram(p);function Z(V){if(n.debug.checkShaderErrors){const re=r.getProgramInfoLog(p).trim(),P=r.getShaderInfoLog(R).trim(),z=r.getShaderInfoLog(A).trim();let k=!0,X=!0;if(r.getProgramParameter(p,r.LINK_STATUS)===!1)if(k=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,p,R,A);else{const G=Zl(r,R,"vertex"),W=Zl(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(p,r.VALIDATE_STATUS)+`

Program Info Log: `+re+`
`+G+`
`+W)}else re!==""?console.warn("THREE.WebGLProgram: Program Info Log:",re):(P===""||z==="")&&(X=!1);X&&(V.diagnostics={runnable:k,programLog:re,vertexShader:{log:P,prefix:d},fragmentShader:{log:z,prefix:E}})}r.deleteShader(R),r.deleteShader(A),y=new Ts(r,p),b=H0(r,p)}let y;this.getUniforms=function(){return y===void 0&&Z(this),y};let b;this.getAttributes=function(){return b===void 0&&Z(this),b};let H=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return H===!1&&(H=r.getProgramParameter(p,D0)),H},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(p),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=U0++,this.cacheKey=e,this.usedTimes=1,this.program=p,this.vertexShader=R,this.fragmentShader=A,this}let Q0=0;class eg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new tg(e),t.set(e,i)),i}}class tg{constructor(e){this.id=Q0++,this.code=e,this.usedTimes=0}}function ng(n,e,t,i,r,s,a){const o=new po,l=new eg,c=[],u=r.isWebGL2,h=r.logarithmicDepthBuffer,f=r.vertexTextures;let m=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return y===0?"uv":`uv${y}`}function p(y,b,H,V,re){const P=V.fog,z=re.geometry,k=y.isMeshStandardMaterial?V.environment:null,X=(y.isMeshStandardMaterial?t:e).get(y.envMap||k),G=X&&X.mapping===Gs?X.image.height:null,W=g[y.type];y.precision!==null&&(m=r.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const q=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Q=q!==void 0?q.length:0;let ee=0;z.morphAttributes.position!==void 0&&(ee=1),z.morphAttributes.normal!==void 0&&(ee=2),z.morphAttributes.color!==void 0&&(ee=3);let B,Y,ce,xe;if(W){const Ht=An[W];B=Ht.vertexShader,Y=Ht.fragmentShader}else B=y.vertexShader,Y=y.fragmentShader,l.update(y),ce=l.getVertexShaderID(y),xe=l.getFragmentShaderID(y);const ve=n.getRenderTarget(),De=re.isInstancedMesh===!0,Ie=re.isBatchedMesh===!0,Ae=!!y.map,Ye=!!y.matcap,U=!!X,kt=!!y.aoMap,Me=!!y.lightMap,Pe=!!y.bumpMap,pe=!!y.normalMap,at=!!y.displacementMap,Oe=!!y.emissiveMap,M=!!y.metalnessMap,_=!!y.roughnessMap,N=y.anisotropy>0,J=y.clearcoat>0,K=y.iridescence>0,j=y.sheen>0,me=y.transmission>0,oe=N&&!!y.anisotropyMap,he=J&&!!y.clearcoatMap,be=J&&!!y.clearcoatNormalMap,ze=J&&!!y.clearcoatRoughnessMap,$=K&&!!y.iridescenceMap,je=K&&!!y.iridescenceThicknessMap,We=j&&!!y.sheenColorMap,Ce=j&&!!y.sheenRoughnessMap,Se=!!y.specularMap,fe=!!y.specularColorMap,Ne=!!y.specularIntensityMap,Je=me&&!!y.transmissionMap,ut=me&&!!y.thicknessMap,He=!!y.gradientMap,te=!!y.alphaMap,w=y.alphaTest>0,se=!!y.alphaHash,ae=!!y.extensions,we=!!z.attributes.uv1,ye=!!z.attributes.uv2,nt=!!z.attributes.uv3;let it=si;return y.toneMapped&&(ve===null||ve.isXRRenderTarget===!0)&&(it=n.toneMapping),{isWebGL2:u,shaderID:W,shaderType:y.type,shaderName:y.name,vertexShader:B,fragmentShader:Y,defines:y.defines,customVertexShaderID:ce,customFragmentShaderID:xe,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:Ie,instancing:De,instancingColor:De&&re.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:ve===null?n.outputColorSpace:ve.isXRRenderTarget===!0?ve.texture.colorSpace:Vn,map:Ae,matcap:Ye,envMap:U,envMapMode:U&&X.mapping,envMapCubeUVHeight:G,aoMap:kt,lightMap:Me,bumpMap:Pe,normalMap:pe,displacementMap:f&&at,emissiveMap:Oe,normalMapObjectSpace:pe&&y.normalMapType===Jh,normalMapTangentSpace:pe&&y.normalMapType===Zh,metalnessMap:M,roughnessMap:_,anisotropy:N,anisotropyMap:oe,clearcoat:J,clearcoatMap:he,clearcoatNormalMap:be,clearcoatRoughnessMap:ze,iridescence:K,iridescenceMap:$,iridescenceThicknessMap:je,sheen:j,sheenColorMap:We,sheenRoughnessMap:Ce,specularMap:Se,specularColorMap:fe,specularIntensityMap:Ne,transmission:me,transmissionMap:Je,thicknessMap:ut,gradientMap:He,opaque:y.transparent===!1&&y.blending===er,alphaMap:te,alphaTest:w,alphaHash:se,combine:y.combine,mapUv:Ae&&v(y.map.channel),aoMapUv:kt&&v(y.aoMap.channel),lightMapUv:Me&&v(y.lightMap.channel),bumpMapUv:Pe&&v(y.bumpMap.channel),normalMapUv:pe&&v(y.normalMap.channel),displacementMapUv:at&&v(y.displacementMap.channel),emissiveMapUv:Oe&&v(y.emissiveMap.channel),metalnessMapUv:M&&v(y.metalnessMap.channel),roughnessMapUv:_&&v(y.roughnessMap.channel),anisotropyMapUv:oe&&v(y.anisotropyMap.channel),clearcoatMapUv:he&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:be&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ze&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:$&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:je&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:We&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&v(y.sheenRoughnessMap.channel),specularMapUv:Se&&v(y.specularMap.channel),specularColorMapUv:fe&&v(y.specularColorMap.channel),specularIntensityMapUv:Ne&&v(y.specularIntensityMap.channel),transmissionMapUv:Je&&v(y.transmissionMap.channel),thicknessMapUv:ut&&v(y.thicknessMap.channel),alphaMapUv:te&&v(y.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(pe||N),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,vertexUv1s:we,vertexUv2s:ye,vertexUv3s:nt,pointsUvs:re.isPoints===!0&&!!z.attributes.uv&&(Ae||te),fog:!!P,useFog:y.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:re.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Q,morphTextureStride:ee,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&H.length>0,shadowMapType:n.shadowMap.type,toneMapping:it,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Ae&&y.map.isVideoTexture===!0&&Qe.getTransfer(y.map.colorSpace)===st,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Sn,flipSided:y.side===Jt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:ae&&y.extensions.derivatives===!0,extensionFragDepth:ae&&y.extensions.fragDepth===!0,extensionDrawBuffers:ae&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:ae&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ae&&y.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function d(y){const b=[];if(y.shaderID?b.push(y.shaderID):(b.push(y.customVertexShaderID),b.push(y.customFragmentShaderID)),y.defines!==void 0)for(const H in y.defines)b.push(H),b.push(y.defines[H]);return y.isRawShaderMaterial===!1&&(E(b,y),S(b,y),b.push(n.outputColorSpace)),b.push(y.customProgramCacheKey),b.join()}function E(y,b){y.push(b.precision),y.push(b.outputColorSpace),y.push(b.envMapMode),y.push(b.envMapCubeUVHeight),y.push(b.mapUv),y.push(b.alphaMapUv),y.push(b.lightMapUv),y.push(b.aoMapUv),y.push(b.bumpMapUv),y.push(b.normalMapUv),y.push(b.displacementMapUv),y.push(b.emissiveMapUv),y.push(b.metalnessMapUv),y.push(b.roughnessMapUv),y.push(b.anisotropyMapUv),y.push(b.clearcoatMapUv),y.push(b.clearcoatNormalMapUv),y.push(b.clearcoatRoughnessMapUv),y.push(b.iridescenceMapUv),y.push(b.iridescenceThicknessMapUv),y.push(b.sheenColorMapUv),y.push(b.sheenRoughnessMapUv),y.push(b.specularMapUv),y.push(b.specularColorMapUv),y.push(b.specularIntensityMapUv),y.push(b.transmissionMapUv),y.push(b.thicknessMapUv),y.push(b.combine),y.push(b.fogExp2),y.push(b.sizeAttenuation),y.push(b.morphTargetsCount),y.push(b.morphAttributeCount),y.push(b.numDirLights),y.push(b.numPointLights),y.push(b.numSpotLights),y.push(b.numSpotLightMaps),y.push(b.numHemiLights),y.push(b.numRectAreaLights),y.push(b.numDirLightShadows),y.push(b.numPointLightShadows),y.push(b.numSpotLightShadows),y.push(b.numSpotLightShadowsWithMaps),y.push(b.numLightProbes),y.push(b.shadowMapType),y.push(b.toneMapping),y.push(b.numClippingPlanes),y.push(b.numClipIntersection),y.push(b.depthPacking)}function S(y,b){o.disableAll(),b.isWebGL2&&o.enable(0),b.supportsVertexTextures&&o.enable(1),b.instancing&&o.enable(2),b.instancingColor&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),y.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.skinning&&o.enable(4),b.morphTargets&&o.enable(5),b.morphNormals&&o.enable(6),b.morphColors&&o.enable(7),b.premultipliedAlpha&&o.enable(8),b.shadowMapEnabled&&o.enable(9),b.useLegacyLights&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),y.push(o.mask)}function T(y){const b=g[y.type];let H;if(b){const V=An[b];H=Ds.clone(V.uniforms)}else H=y.uniforms;return H}function D(y,b){let H;for(let V=0,re=c.length;V<re;V++){const P=c[V];if(P.cacheKey===b){H=P,++H.usedTimes;break}}return H===void 0&&(H=new j0(n,b,y,s),c.push(H)),H}function R(y){if(--y.usedTimes===0){const b=c.indexOf(y);c[b]=c[c.length-1],c.pop(),y.destroy()}}function A(y){l.remove(y)}function Z(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:T,acquireProgram:D,releaseProgram:R,releaseShaderCache:A,programs:c,dispose:Z}}function ig(){let n=new WeakMap;function e(s){let a=n.get(s);return a===void 0&&(a={},n.set(s,a)),a}function t(s){n.delete(s)}function i(s,a,o){n.get(s)[a]=o}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function rg(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function tc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function nc(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(h,f,m,g,v,p){let d=n[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:m,groupOrder:g,renderOrder:h.renderOrder,z:v,group:p},n[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=m,d.groupOrder=g,d.renderOrder=h.renderOrder,d.z=v,d.group=p),e++,d}function o(h,f,m,g,v,p){const d=a(h,f,m,g,v,p);m.transmission>0?i.push(d):m.transparent===!0?r.push(d):t.push(d)}function l(h,f,m,g,v,p){const d=a(h,f,m,g,v,p);m.transmission>0?i.unshift(d):m.transparent===!0?r.unshift(d):t.unshift(d)}function c(h,f){t.length>1&&t.sort(h||rg),i.length>1&&i.sort(f||tc),r.length>1&&r.sort(f||tc)}function u(){for(let h=e,f=n.length;h<f;h++){const m=n[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function sg(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new nc,n.set(i,[a])):r>=s.length?(a=new nc,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function ag(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new _e};break;case"SpotLight":t={position:new C,direction:new C,color:new _e,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new _e,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new _e,groundColor:new _e};break;case"RectAreaLight":t={color:new _e,position:new C,halfWidth:new C,halfHeight:new C};break}return n[e.id]=t,t}}}function og(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let lg=0;function cg(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function ug(n,e){const t=new ag,i=og(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)r.probe.push(new C);const s=new C,a=new Mt,o=new Mt;function l(u,h){let f=0,m=0,g=0;for(let V=0;V<9;V++)r.probe[V].set(0,0,0);let v=0,p=0,d=0,E=0,S=0,T=0,D=0,R=0,A=0,Z=0,y=0;u.sort(cg);const b=h===!0?Math.PI:1;for(let V=0,re=u.length;V<re;V++){const P=u[V],z=P.color,k=P.intensity,X=P.distance,G=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)f+=z.r*k*b,m+=z.g*k*b,g+=z.b*k*b;else if(P.isLightProbe){for(let W=0;W<9;W++)r.probe[W].addScaledVector(P.sh.coefficients[W],k);y++}else if(P.isDirectionalLight){const W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity*b),P.castShadow){const q=P.shadow,Q=i.get(P);Q.shadowBias=q.bias,Q.shadowNormalBias=q.normalBias,Q.shadowRadius=q.radius,Q.shadowMapSize=q.mapSize,r.directionalShadow[v]=Q,r.directionalShadowMap[v]=G,r.directionalShadowMatrix[v]=P.shadow.matrix,T++}r.directional[v]=W,v++}else if(P.isSpotLight){const W=t.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(z).multiplyScalar(k*b),W.distance=X,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,r.spot[d]=W;const q=P.shadow;if(P.map&&(r.spotLightMap[A]=P.map,A++,q.updateMatrices(P),P.castShadow&&Z++),r.spotLightMatrix[d]=q.matrix,P.castShadow){const Q=i.get(P);Q.shadowBias=q.bias,Q.shadowNormalBias=q.normalBias,Q.shadowRadius=q.radius,Q.shadowMapSize=q.mapSize,r.spotShadow[d]=Q,r.spotShadowMap[d]=G,R++}d++}else if(P.isRectAreaLight){const W=t.get(P);W.color.copy(z).multiplyScalar(k),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),r.rectArea[E]=W,E++}else if(P.isPointLight){const W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity*b),W.distance=P.distance,W.decay=P.decay,P.castShadow){const q=P.shadow,Q=i.get(P);Q.shadowBias=q.bias,Q.shadowNormalBias=q.normalBias,Q.shadowRadius=q.radius,Q.shadowMapSize=q.mapSize,Q.shadowCameraNear=q.camera.near,Q.shadowCameraFar=q.camera.far,r.pointShadow[p]=Q,r.pointShadowMap[p]=G,r.pointShadowMatrix[p]=P.shadow.matrix,D++}r.point[p]=W,p++}else if(P.isHemisphereLight){const W=t.get(P);W.skyColor.copy(P.color).multiplyScalar(k*b),W.groundColor.copy(P.groundColor).multiplyScalar(k*b),r.hemi[S]=W,S++}}E>0&&(e.isWebGL2?n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ne.LTC_FLOAT_1,r.rectAreaLTC2=ne.LTC_FLOAT_2):(r.rectAreaLTC1=ne.LTC_HALF_1,r.rectAreaLTC2=ne.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ne.LTC_FLOAT_1,r.rectAreaLTC2=ne.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=ne.LTC_HALF_1,r.rectAreaLTC2=ne.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=f,r.ambient[1]=m,r.ambient[2]=g;const H=r.hash;(H.directionalLength!==v||H.pointLength!==p||H.spotLength!==d||H.rectAreaLength!==E||H.hemiLength!==S||H.numDirectionalShadows!==T||H.numPointShadows!==D||H.numSpotShadows!==R||H.numSpotMaps!==A||H.numLightProbes!==y)&&(r.directional.length=v,r.spot.length=d,r.rectArea.length=E,r.point.length=p,r.hemi.length=S,r.directionalShadow.length=T,r.directionalShadowMap.length=T,r.pointShadow.length=D,r.pointShadowMap.length=D,r.spotShadow.length=R,r.spotShadowMap.length=R,r.directionalShadowMatrix.length=T,r.pointShadowMatrix.length=D,r.spotLightMatrix.length=R+A-Z,r.spotLightMap.length=A,r.numSpotLightShadowsWithMaps=Z,r.numLightProbes=y,H.directionalLength=v,H.pointLength=p,H.spotLength=d,H.rectAreaLength=E,H.hemiLength=S,H.numDirectionalShadows=T,H.numPointShadows=D,H.numSpotShadows=R,H.numSpotMaps=A,H.numLightProbes=y,r.version=lg++)}function c(u,h){let f=0,m=0,g=0,v=0,p=0;const d=h.matrixWorldInverse;for(let E=0,S=u.length;E<S;E++){const T=u[E];if(T.isDirectionalLight){const D=r.directional[f];D.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),D.direction.sub(s),D.direction.transformDirection(d),f++}else if(T.isSpotLight){const D=r.spot[g];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(d),D.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),D.direction.sub(s),D.direction.transformDirection(d),g++}else if(T.isRectAreaLight){const D=r.rectArea[v];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(d),o.identity(),a.copy(T.matrixWorld),a.premultiply(d),o.extractRotation(a),D.halfWidth.set(T.width*.5,0,0),D.halfHeight.set(0,T.height*.5,0),D.halfWidth.applyMatrix4(o),D.halfHeight.applyMatrix4(o),v++}else if(T.isPointLight){const D=r.point[m];D.position.setFromMatrixPosition(T.matrixWorld),D.position.applyMatrix4(d),m++}else if(T.isHemisphereLight){const D=r.hemi[p];D.direction.setFromMatrixPosition(T.matrixWorld),D.direction.transformDirection(d),p++}}}return{setup:l,setupView:c,state:r}}function ic(n,e){const t=new ug(n,e),i=[],r=[];function s(){i.length=0,r.length=0}function a(h){i.push(h)}function o(h){r.push(h)}function l(h){t.setup(i,h)}function c(h){t.setupView(i,h)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function hg(n,e){let t=new WeakMap;function i(s,a=0){const o=t.get(s);let l;return o===void 0?(l=new ic(n,e),t.set(s,[l])):a>=o.length?(l=new ic(n,e),o.push(l)):l=o[a],l}function r(){t=new WeakMap}return{get:i,dispose:r}}class fg extends Or{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$h,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class dg extends Or{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const pg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mg=`uniform sampler2D shadow_pass;
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
}`;function gg(n,e,t){let i=new Xc;const r=new ie,s=new ie,a=new wt,o=new fg({depthPacking:Kh}),l=new dg,c={},u=t.maxTextureSize,h={[oi]:Jt,[Jt]:oi,[Sn]:Sn},f=new ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ie},radius:{value:4}},vertexShader:pg,fragmentShader:mg}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const g=new mn;g.setAttribute("position",new qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new St(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yc;let d=this.type;this.render=function(R,A,Z){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;const y=n.getRenderTarget(),b=n.getActiveCubeFace(),H=n.getActiveMipmapLevel(),V=n.state;V.setBlending(Gn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const re=d!==kn&&this.type===kn,P=d===kn&&this.type!==kn;for(let z=0,k=R.length;z<k;z++){const X=R[z],G=X.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",X,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;r.copy(G.mapSize);const W=G.getFrameExtents();if(r.multiply(W),s.copy(G.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/W.x),r.x=s.x*W.x,G.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/W.y),r.y=s.y*W.y,G.mapSize.y=s.y)),G.map===null||re===!0||P===!0){const Q=this.type!==kn?{minFilter:Xt,magFilter:Xt}:{};G.map!==null&&G.map.dispose(),G.map=new Qt(r.x,r.y,Q),G.map.texture.name=X.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const q=G.getViewportCount();for(let Q=0;Q<q;Q++){const ee=G.getViewport(Q);a.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),V.viewport(a),G.updateMatrices(X,Q),i=G.getFrustum(),T(A,Z,G.camera,X,this.type)}G.isPointLightShadow!==!0&&this.type===kn&&E(G,Z),G.needsUpdate=!1}d=this.type,p.needsUpdate=!1,n.setRenderTarget(y,b,H)};function E(R,A){const Z=e.update(v);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Qt(r.x,r.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,n.setRenderTarget(R.mapPass),n.clear(),n.renderBufferDirect(A,null,Z,f,v,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,n.setRenderTarget(R.map),n.clear(),n.renderBufferDirect(A,null,Z,m,v,null)}function S(R,A,Z,y){let b=null;const H=Z.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(H!==void 0)b=H;else if(b=Z.isPointLight===!0?l:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const V=b.uuid,re=A.uuid;let P=c[V];P===void 0&&(P={},c[V]=P);let z=P[re];z===void 0&&(z=b.clone(),P[re]=z,A.addEventListener("dispose",D)),b=z}if(b.visible=A.visible,b.wireframe=A.wireframe,y===kn?b.side=A.shadowSide!==null?A.shadowSide:A.side:b.side=A.shadowSide!==null?A.shadowSide:h[A.side],b.alphaMap=A.alphaMap,b.alphaTest=A.alphaTest,b.map=A.map,b.clipShadows=A.clipShadows,b.clippingPlanes=A.clippingPlanes,b.clipIntersection=A.clipIntersection,b.displacementMap=A.displacementMap,b.displacementScale=A.displacementScale,b.displacementBias=A.displacementBias,b.wireframeLinewidth=A.wireframeLinewidth,b.linewidth=A.linewidth,Z.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const V=n.properties.get(b);V.light=Z}return b}function T(R,A,Z,y,b){if(R.visible===!1)return;if(R.layers.test(A.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&b===kn)&&(!R.frustumCulled||i.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,R.matrixWorld);const re=e.update(R),P=R.material;if(Array.isArray(P)){const z=re.groups;for(let k=0,X=z.length;k<X;k++){const G=z[k],W=P[G.materialIndex];if(W&&W.visible){const q=S(R,W,y,b);R.onBeforeShadow(n,R,A,Z,re,q,G),n.renderBufferDirect(Z,null,re,q,R,G),R.onAfterShadow(n,R,A,Z,re,q,G)}}}else if(P.visible){const z=S(R,P,y,b);R.onBeforeShadow(n,R,A,Z,re,z,null),n.renderBufferDirect(Z,null,re,z,R,null),R.onAfterShadow(n,R,A,Z,re,z,null)}}const V=R.children;for(let re=0,P=V.length;re<P;re++)T(V[re],A,Z,y,b)}function D(R){R.target.removeEventListener("dispose",D);for(const Z in c){const y=c[Z],b=R.target.uuid;b in y&&(y[b].dispose(),delete y[b])}}}function vg(n,e,t){const i=t.isWebGL2;function r(){let w=!1;const se=new wt;let ae=null;const we=new wt(0,0,0,0);return{setMask:function(ye){ae!==ye&&!w&&(n.colorMask(ye,ye,ye,ye),ae=ye)},setLocked:function(ye){w=ye},setClear:function(ye,nt,it,Et,Ht){Ht===!0&&(ye*=Et,nt*=Et,it*=Et),se.set(ye,nt,it,Et),we.equals(se)===!1&&(n.clearColor(ye,nt,it,Et),we.copy(se))},reset:function(){w=!1,ae=null,we.set(-1,0,0,0)}}}function s(){let w=!1,se=null,ae=null,we=null;return{setTest:function(ye){ye?Ie(n.DEPTH_TEST):Ae(n.DEPTH_TEST)},setMask:function(ye){se!==ye&&!w&&(n.depthMask(ye),se=ye)},setFunc:function(ye){if(ae!==ye){switch(ye){case bh:n.depthFunc(n.NEVER);break;case Tc:n.depthFunc(n.ALWAYS);break;case Ah:n.depthFunc(n.LESS);break;case Cr:n.depthFunc(n.LEQUAL);break;case wh:n.depthFunc(n.EQUAL);break;case Rh:n.depthFunc(n.GEQUAL);break;case Ch:n.depthFunc(n.GREATER);break;case Ph:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ae=ye}},setLocked:function(ye){w=ye},setClear:function(ye){we!==ye&&(n.clearDepth(ye),we=ye)},reset:function(){w=!1,se=null,ae=null,we=null}}}function a(){let w=!1,se=null,ae=null,we=null,ye=null,nt=null,it=null,Et=null,Ht=null;return{setTest:function(rt){w||(rt?Ie(n.STENCIL_TEST):Ae(n.STENCIL_TEST))},setMask:function(rt){se!==rt&&!w&&(n.stencilMask(rt),se=rt)},setFunc:function(rt,Gt,En){(ae!==rt||we!==Gt||ye!==En)&&(n.stencilFunc(rt,Gt,En),ae=rt,we=Gt,ye=En)},setOp:function(rt,Gt,En){(nt!==rt||it!==Gt||Et!==En)&&(n.stencilOp(rt,Gt,En),nt=rt,it=Gt,Et=En)},setLocked:function(rt){w=rt},setClear:function(rt){Ht!==rt&&(n.clearStencil(rt),Ht=rt)},reset:function(){w=!1,se=null,ae=null,we=null,ye=null,nt=null,it=null,Et=null,Ht=null}}}const o=new r,l=new s,c=new a,u=new WeakMap,h=new WeakMap;let f={},m={},g=new WeakMap,v=[],p=null,d=!1,E=null,S=null,T=null,D=null,R=null,A=null,Z=null,y=new _e(0,0,0),b=0,H=!1,V=null,re=null,P=null,z=null,k=null;const X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,W=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(q)[1]),G=W>=1):q.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),G=W>=2);let Q=null,ee={};const B=n.getParameter(n.SCISSOR_BOX),Y=n.getParameter(n.VIEWPORT),ce=new wt().fromArray(B),xe=new wt().fromArray(Y);function ve(w,se,ae,we){const ye=new Uint8Array(4),nt=n.createTexture();n.bindTexture(w,nt),n.texParameteri(w,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(w,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let it=0;it<ae;it++)i&&(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)?n.texImage3D(se,0,n.RGBA,1,1,we,0,n.RGBA,n.UNSIGNED_BYTE,ye):n.texImage2D(se+it,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ye);return nt}const De={};De[n.TEXTURE_2D]=ve(n.TEXTURE_2D,n.TEXTURE_2D,1),De[n.TEXTURE_CUBE_MAP]=ve(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(De[n.TEXTURE_2D_ARRAY]=ve(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),De[n.TEXTURE_3D]=ve(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ie(n.DEPTH_TEST),l.setFunc(Cr),Oe(!1),M(Bo),Ie(n.CULL_FACE),pe(Gn);function Ie(w){f[w]!==!0&&(n.enable(w),f[w]=!0)}function Ae(w){f[w]!==!1&&(n.disable(w),f[w]=!1)}function Ye(w,se){return m[w]!==se?(n.bindFramebuffer(w,se),m[w]=se,i&&(w===n.DRAW_FRAMEBUFFER&&(m[n.FRAMEBUFFER]=se),w===n.FRAMEBUFFER&&(m[n.DRAW_FRAMEBUFFER]=se)),!0):!1}function U(w,se){let ae=v,we=!1;if(w)if(ae=g.get(se),ae===void 0&&(ae=[],g.set(se,ae)),w.isWebGLMultipleRenderTargets){const ye=w.texture;if(ae.length!==ye.length||ae[0]!==n.COLOR_ATTACHMENT0){for(let nt=0,it=ye.length;nt<it;nt++)ae[nt]=n.COLOR_ATTACHMENT0+nt;ae.length=ye.length,we=!0}}else ae[0]!==n.COLOR_ATTACHMENT0&&(ae[0]=n.COLOR_ATTACHMENT0,we=!0);else ae[0]!==n.BACK&&(ae[0]=n.BACK,we=!0);we&&(t.isWebGL2?n.drawBuffers(ae):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ae))}function kt(w){return p!==w?(n.useProgram(w),p=w,!0):!1}const Me={[xi]:n.FUNC_ADD,[uh]:n.FUNC_SUBTRACT,[hh]:n.FUNC_REVERSE_SUBTRACT};if(i)Me[Go]=n.MIN,Me[Vo]=n.MAX;else{const w=e.get("EXT_blend_minmax");w!==null&&(Me[Go]=w.MIN_EXT,Me[Vo]=w.MAX_EXT)}const Pe={[fh]:n.ZERO,[dh]:n.ONE,[ph]:n.SRC_COLOR,[Ha]:n.SRC_ALPHA,[Sh]:n.SRC_ALPHA_SATURATE,[_h]:n.DST_COLOR,[gh]:n.DST_ALPHA,[mh]:n.ONE_MINUS_SRC_COLOR,[Ga]:n.ONE_MINUS_SRC_ALPHA,[xh]:n.ONE_MINUS_DST_COLOR,[vh]:n.ONE_MINUS_DST_ALPHA,[Mh]:n.CONSTANT_COLOR,[yh]:n.ONE_MINUS_CONSTANT_COLOR,[Th]:n.CONSTANT_ALPHA,[Eh]:n.ONE_MINUS_CONSTANT_ALPHA};function pe(w,se,ae,we,ye,nt,it,Et,Ht,rt){if(w===Gn){d===!0&&(Ae(n.BLEND),d=!1);return}if(d===!1&&(Ie(n.BLEND),d=!0),w!==ch){if(w!==E||rt!==H){if((S!==xi||R!==xi)&&(n.blendEquation(n.FUNC_ADD),S=xi,R=xi),rt)switch(w){case er:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ci:n.blendFunc(n.ONE,n.ONE);break;case ko:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ho:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}else switch(w){case er:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ci:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case ko:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ho:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",w);break}T=null,D=null,A=null,Z=null,y.set(0,0,0),b=0,E=w,H=rt}return}ye=ye||se,nt=nt||ae,it=it||we,(se!==S||ye!==R)&&(n.blendEquationSeparate(Me[se],Me[ye]),S=se,R=ye),(ae!==T||we!==D||nt!==A||it!==Z)&&(n.blendFuncSeparate(Pe[ae],Pe[we],Pe[nt],Pe[it]),T=ae,D=we,A=nt,Z=it),(Et.equals(y)===!1||Ht!==b)&&(n.blendColor(Et.r,Et.g,Et.b,Ht),y.copy(Et),b=Ht),E=w,H=!1}function at(w,se){w.side===Sn?Ae(n.CULL_FACE):Ie(n.CULL_FACE);let ae=w.side===Jt;se&&(ae=!ae),Oe(ae),w.blending===er&&w.transparent===!1?pe(Gn):pe(w.blending,w.blendEquation,w.blendSrc,w.blendDst,w.blendEquationAlpha,w.blendSrcAlpha,w.blendDstAlpha,w.blendColor,w.blendAlpha,w.premultipliedAlpha),l.setFunc(w.depthFunc),l.setTest(w.depthTest),l.setMask(w.depthWrite),o.setMask(w.colorWrite);const we=w.stencilWrite;c.setTest(we),we&&(c.setMask(w.stencilWriteMask),c.setFunc(w.stencilFunc,w.stencilRef,w.stencilFuncMask),c.setOp(w.stencilFail,w.stencilZFail,w.stencilZPass)),N(w.polygonOffset,w.polygonOffsetFactor,w.polygonOffsetUnits),w.alphaToCoverage===!0?Ie(n.SAMPLE_ALPHA_TO_COVERAGE):Ae(n.SAMPLE_ALPHA_TO_COVERAGE)}function Oe(w){V!==w&&(w?n.frontFace(n.CW):n.frontFace(n.CCW),V=w)}function M(w){w!==ah?(Ie(n.CULL_FACE),w!==re&&(w===Bo?n.cullFace(n.BACK):w===oh?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ae(n.CULL_FACE),re=w}function _(w){w!==P&&(G&&n.lineWidth(w),P=w)}function N(w,se,ae){w?(Ie(n.POLYGON_OFFSET_FILL),(z!==se||k!==ae)&&(n.polygonOffset(se,ae),z=se,k=ae)):Ae(n.POLYGON_OFFSET_FILL)}function J(w){w?Ie(n.SCISSOR_TEST):Ae(n.SCISSOR_TEST)}function K(w){w===void 0&&(w=n.TEXTURE0+X-1),Q!==w&&(n.activeTexture(w),Q=w)}function j(w,se,ae){ae===void 0&&(Q===null?ae=n.TEXTURE0+X-1:ae=Q);let we=ee[ae];we===void 0&&(we={type:void 0,texture:void 0},ee[ae]=we),(we.type!==w||we.texture!==se)&&(Q!==ae&&(n.activeTexture(ae),Q=ae),n.bindTexture(w,se||De[w]),we.type=w,we.texture=se)}function me(){const w=ee[Q];w!==void 0&&w.type!==void 0&&(n.bindTexture(w.type,null),w.type=void 0,w.texture=void 0)}function oe(){try{n.compressedTexImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function he(){try{n.compressedTexImage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function be(){try{n.texSubImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function ze(){try{n.texSubImage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function $(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function je(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function We(){try{n.texStorage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Ce(){try{n.texStorage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Se(){try{n.texImage2D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function fe(){try{n.texImage3D.apply(n,arguments)}catch(w){console.error("THREE.WebGLState:",w)}}function Ne(w){ce.equals(w)===!1&&(n.scissor(w.x,w.y,w.z,w.w),ce.copy(w))}function Je(w){xe.equals(w)===!1&&(n.viewport(w.x,w.y,w.z,w.w),xe.copy(w))}function ut(w,se){let ae=h.get(se);ae===void 0&&(ae=new WeakMap,h.set(se,ae));let we=ae.get(w);we===void 0&&(we=n.getUniformBlockIndex(se,w.name),ae.set(w,we))}function He(w,se){const we=h.get(se).get(w);u.get(se)!==we&&(n.uniformBlockBinding(se,we,w.__bindingPointIndex),u.set(se,we))}function te(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},Q=null,ee={},m={},g=new WeakMap,v=[],p=null,d=!1,E=null,S=null,T=null,D=null,R=null,A=null,Z=null,y=new _e(0,0,0),b=0,H=!1,V=null,re=null,P=null,z=null,k=null,ce.set(0,0,n.canvas.width,n.canvas.height),xe.set(0,0,n.canvas.width,n.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Ie,disable:Ae,bindFramebuffer:Ye,drawBuffers:U,useProgram:kt,setBlending:pe,setMaterial:at,setFlipSided:Oe,setCullFace:M,setLineWidth:_,setPolygonOffset:N,setScissorTest:J,activeTexture:K,bindTexture:j,unbindTexture:me,compressedTexImage2D:oe,compressedTexImage3D:he,texImage2D:Se,texImage3D:fe,updateUBOMapping:ut,uniformBlockBinding:He,texStorage2D:We,texStorage3D:Ce,texSubImage2D:be,texSubImage3D:ze,compressedTexSubImage2D:$,compressedTexSubImage3D:je,scissor:Ne,viewport:Je,reset:te}}function _g(n,e,t,i,r,s,a){const o=r.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let h;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(M,_){return m?new OffscreenCanvas(M,_):Ls("canvas")}function v(M,_,N,J){let K=1;if((M.width>J||M.height>J)&&(K=J/Math.max(M.width,M.height)),K<1||_===!0)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap){const j=_?Cs:Math.floor,me=j(K*M.width),oe=j(K*M.height);h===void 0&&(h=g(me,oe));const he=N?g(me,oe):h;return he.width=me,he.height=oe,he.getContext("2d").drawImage(M,0,0,me,oe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+M.width+"x"+M.height+") to ("+me+"x"+oe+")."),he}else return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+M.width+"x"+M.height+")."),M;return M}function p(M){return $a(M.width)&&$a(M.height)}function d(M){return o?!1:M.wrapS!==Mn||M.wrapT!==Mn||M.minFilter!==Xt&&M.minFilter!==Kt}function E(M,_){return M.generateMipmaps&&_&&M.minFilter!==Xt&&M.minFilter!==Kt}function S(M){n.generateMipmap(M)}function T(M,_,N,J,K=!1){if(o===!1)return _;if(M!==null){if(n[M]!==void 0)return n[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let j=_;if(_===n.RED&&(N===n.FLOAT&&(j=n.R32F),N===n.HALF_FLOAT&&(j=n.R16F),N===n.UNSIGNED_BYTE&&(j=n.R8)),_===n.RED_INTEGER&&(N===n.UNSIGNED_BYTE&&(j=n.R8UI),N===n.UNSIGNED_SHORT&&(j=n.R16UI),N===n.UNSIGNED_INT&&(j=n.R32UI),N===n.BYTE&&(j=n.R8I),N===n.SHORT&&(j=n.R16I),N===n.INT&&(j=n.R32I)),_===n.RG&&(N===n.FLOAT&&(j=n.RG32F),N===n.HALF_FLOAT&&(j=n.RG16F),N===n.UNSIGNED_BYTE&&(j=n.RG8)),_===n.RGBA){const me=K?bs:Qe.getTransfer(J);N===n.FLOAT&&(j=n.RGBA32F),N===n.HALF_FLOAT&&(j=n.RGBA16F),N===n.UNSIGNED_BYTE&&(j=me===st?n.SRGB8_ALPHA8:n.RGBA8),N===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),N===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function D(M,_,N){return E(M,N)===!0||M.isFramebufferTexture&&M.minFilter!==Xt&&M.minFilter!==Kt?Math.log2(Math.max(_.width,_.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?_.mipmaps.length:1}function R(M){return M===Xt||M===Wo||M===na?n.NEAREST:n.LINEAR}function A(M){const _=M.target;_.removeEventListener("dispose",A),y(_),_.isVideoTexture&&u.delete(_)}function Z(M){const _=M.target;_.removeEventListener("dispose",Z),H(_)}function y(M){const _=i.get(M);if(_.__webglInit===void 0)return;const N=M.source,J=f.get(N);if(J){const K=J[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&b(M),Object.keys(J).length===0&&f.delete(N)}i.remove(M)}function b(M){const _=i.get(M);n.deleteTexture(_.__webglTexture);const N=M.source,J=f.get(N);delete J[_.__cacheKey],a.memory.textures--}function H(M){const _=M.texture,N=i.get(M),J=i.get(_);if(J.__webglTexture!==void 0&&(n.deleteTexture(J.__webglTexture),a.memory.textures--),M.depthTexture&&M.depthTexture.dispose(),M.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(N.__webglFramebuffer[K]))for(let j=0;j<N.__webglFramebuffer[K].length;j++)n.deleteFramebuffer(N.__webglFramebuffer[K][j]);else n.deleteFramebuffer(N.__webglFramebuffer[K]);N.__webglDepthbuffer&&n.deleteRenderbuffer(N.__webglDepthbuffer[K])}else{if(Array.isArray(N.__webglFramebuffer))for(let K=0;K<N.__webglFramebuffer.length;K++)n.deleteFramebuffer(N.__webglFramebuffer[K]);else n.deleteFramebuffer(N.__webglFramebuffer);if(N.__webglDepthbuffer&&n.deleteRenderbuffer(N.__webglDepthbuffer),N.__webglMultisampledFramebuffer&&n.deleteFramebuffer(N.__webglMultisampledFramebuffer),N.__webglColorRenderbuffer)for(let K=0;K<N.__webglColorRenderbuffer.length;K++)N.__webglColorRenderbuffer[K]&&n.deleteRenderbuffer(N.__webglColorRenderbuffer[K]);N.__webglDepthRenderbuffer&&n.deleteRenderbuffer(N.__webglDepthRenderbuffer)}if(M.isWebGLMultipleRenderTargets)for(let K=0,j=_.length;K<j;K++){const me=i.get(_[K]);me.__webglTexture&&(n.deleteTexture(me.__webglTexture),a.memory.textures--),i.remove(_[K])}i.remove(_),i.remove(M)}let V=0;function re(){V=0}function P(){const M=V;return M>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+r.maxTextures),V+=1,M}function z(M){const _=[];return _.push(M.wrapS),_.push(M.wrapT),_.push(M.wrapR||0),_.push(M.magFilter),_.push(M.minFilter),_.push(M.anisotropy),_.push(M.internalFormat),_.push(M.format),_.push(M.type),_.push(M.generateMipmaps),_.push(M.premultiplyAlpha),_.push(M.flipY),_.push(M.unpackAlignment),_.push(M.colorSpace),_.join()}function k(M,_){const N=i.get(M);if(M.isVideoTexture&&at(M),M.isRenderTargetTexture===!1&&M.version>0&&N.__version!==M.version){const J=M.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(N,M,_);return}}t.bindTexture(n.TEXTURE_2D,N.__webglTexture,n.TEXTURE0+_)}function X(M,_){const N=i.get(M);if(M.version>0&&N.__version!==M.version){ce(N,M,_);return}t.bindTexture(n.TEXTURE_2D_ARRAY,N.__webglTexture,n.TEXTURE0+_)}function G(M,_){const N=i.get(M);if(M.version>0&&N.__version!==M.version){ce(N,M,_);return}t.bindTexture(n.TEXTURE_3D,N.__webglTexture,n.TEXTURE0+_)}function W(M,_){const N=i.get(M);if(M.version>0&&N.__version!==M.version){xe(N,M,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,N.__webglTexture,n.TEXTURE0+_)}const q={[Xa]:n.REPEAT,[Mn]:n.CLAMP_TO_EDGE,[qa]:n.MIRRORED_REPEAT},Q={[Xt]:n.NEAREST,[Wo]:n.NEAREST_MIPMAP_NEAREST,[na]:n.NEAREST_MIPMAP_LINEAR,[Kt]:n.LINEAR,[Bh]:n.LINEAR_MIPMAP_NEAREST,[li]:n.LINEAR_MIPMAP_LINEAR},ee={[jh]:n.NEVER,[sf]:n.ALWAYS,[Qh]:n.LESS,[Ic]:n.LEQUAL,[ef]:n.EQUAL,[rf]:n.GEQUAL,[tf]:n.GREATER,[nf]:n.NOTEQUAL};function B(M,_,N){if(N?(n.texParameteri(M,n.TEXTURE_WRAP_S,q[_.wrapS]),n.texParameteri(M,n.TEXTURE_WRAP_T,q[_.wrapT]),(M===n.TEXTURE_3D||M===n.TEXTURE_2D_ARRAY)&&n.texParameteri(M,n.TEXTURE_WRAP_R,q[_.wrapR]),n.texParameteri(M,n.TEXTURE_MAG_FILTER,Q[_.magFilter]),n.texParameteri(M,n.TEXTURE_MIN_FILTER,Q[_.minFilter])):(n.texParameteri(M,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(M,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(M===n.TEXTURE_3D||M===n.TEXTURE_2D_ARRAY)&&n.texParameteri(M,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(_.wrapS!==Mn||_.wrapT!==Mn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(M,n.TEXTURE_MAG_FILTER,R(_.magFilter)),n.texParameteri(M,n.TEXTURE_MIN_FILTER,R(_.minFilter)),_.minFilter!==Xt&&_.minFilter!==Kt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),_.compareFunction&&(n.texParameteri(M,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(M,n.TEXTURE_COMPARE_FUNC,ee[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const J=e.get("EXT_texture_filter_anisotropic");if(_.magFilter===Xt||_.minFilter!==na&&_.minFilter!==li||_.type===ti&&e.has("OES_texture_float_linear")===!1||o===!1&&_.type===hn&&e.has("OES_texture_half_float_linear")===!1)return;(_.anisotropy>1||i.get(_).__currentAnisotropy)&&(n.texParameterf(M,J.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy)}}function Y(M,_){let N=!1;M.__webglInit===void 0&&(M.__webglInit=!0,_.addEventListener("dispose",A));const J=_.source;let K=f.get(J);K===void 0&&(K={},f.set(J,K));const j=z(_);if(j!==M.__cacheKey){K[j]===void 0&&(K[j]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,N=!0),K[j].usedTimes++;const me=K[M.__cacheKey];me!==void 0&&(K[M.__cacheKey].usedTimes--,me.usedTimes===0&&b(_)),M.__cacheKey=j,M.__webglTexture=K[j].texture}return N}function ce(M,_,N){let J=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(J=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(J=n.TEXTURE_3D);const K=Y(M,_),j=_.source;t.bindTexture(J,M.__webglTexture,n.TEXTURE0+N);const me=i.get(j);if(j.version!==me.__version||K===!0){t.activeTexture(n.TEXTURE0+N);const oe=Qe.getPrimaries(Qe.workingColorSpace),he=_.colorSpace===un?null:Qe.getPrimaries(_.colorSpace),be=_.colorSpace===un||oe===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const ze=d(_)&&p(_.image)===!1;let $=v(_.image,ze,!1,r.maxTextureSize);$=Oe(_,$);const je=p($)||o,We=s.convert(_.format,_.colorSpace);let Ce=s.convert(_.type),Se=T(_.internalFormat,We,Ce,_.colorSpace,_.isVideoTexture);B(J,_,je);let fe;const Ne=_.mipmaps,Je=o&&_.isVideoTexture!==!0&&Se!==Dc,ut=me.__version===void 0||K===!0,He=D(_,$,je);if(_.isDepthTexture)Se=n.DEPTH_COMPONENT,o?_.type===ti?Se=n.DEPTH_COMPONENT32F:_.type===ei?Se=n.DEPTH_COMPONENT24:_.type===bi?Se=n.DEPTH24_STENCIL8:Se=n.DEPTH_COMPONENT16:_.type===ti&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),_.format===Ai&&Se===n.DEPTH_COMPONENT&&_.type!==co&&_.type!==ei&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),_.type=ei,Ce=s.convert(_.type)),_.format===ar&&Se===n.DEPTH_COMPONENT&&(Se=n.DEPTH_STENCIL,_.type!==bi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),_.type=bi,Ce=s.convert(_.type))),ut&&(Je?t.texStorage2D(n.TEXTURE_2D,1,Se,$.width,$.height):t.texImage2D(n.TEXTURE_2D,0,Se,$.width,$.height,0,We,Ce,null));else if(_.isDataTexture)if(Ne.length>0&&je){Je&&ut&&t.texStorage2D(n.TEXTURE_2D,He,Se,Ne[0].width,Ne[0].height);for(let te=0,w=Ne.length;te<w;te++)fe=Ne[te],Je?t.texSubImage2D(n.TEXTURE_2D,te,0,0,fe.width,fe.height,We,Ce,fe.data):t.texImage2D(n.TEXTURE_2D,te,Se,fe.width,fe.height,0,We,Ce,fe.data);_.generateMipmaps=!1}else Je?(ut&&t.texStorage2D(n.TEXTURE_2D,He,Se,$.width,$.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,$.width,$.height,We,Ce,$.data)):t.texImage2D(n.TEXTURE_2D,0,Se,$.width,$.height,0,We,Ce,$.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Je&&ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,He,Se,Ne[0].width,Ne[0].height,$.depth);for(let te=0,w=Ne.length;te<w;te++)fe=Ne[te],_.format!==yn?We!==null?Je?t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,0,fe.width,fe.height,$.depth,We,fe.data,0,0):t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,te,Se,fe.width,fe.height,$.depth,0,fe.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Je?t.texSubImage3D(n.TEXTURE_2D_ARRAY,te,0,0,0,fe.width,fe.height,$.depth,We,Ce,fe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,te,Se,fe.width,fe.height,$.depth,0,We,Ce,fe.data)}else{Je&&ut&&t.texStorage2D(n.TEXTURE_2D,He,Se,Ne[0].width,Ne[0].height);for(let te=0,w=Ne.length;te<w;te++)fe=Ne[te],_.format!==yn?We!==null?Je?t.compressedTexSubImage2D(n.TEXTURE_2D,te,0,0,fe.width,fe.height,We,fe.data):t.compressedTexImage2D(n.TEXTURE_2D,te,Se,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Je?t.texSubImage2D(n.TEXTURE_2D,te,0,0,fe.width,fe.height,We,Ce,fe.data):t.texImage2D(n.TEXTURE_2D,te,Se,fe.width,fe.height,0,We,Ce,fe.data)}else if(_.isDataArrayTexture)Je?(ut&&t.texStorage3D(n.TEXTURE_2D_ARRAY,He,Se,$.width,$.height,$.depth),t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,We,Ce,$.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,Se,$.width,$.height,$.depth,0,We,Ce,$.data);else if(_.isData3DTexture)Je?(ut&&t.texStorage3D(n.TEXTURE_3D,He,Se,$.width,$.height,$.depth),t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,We,Ce,$.data)):t.texImage3D(n.TEXTURE_3D,0,Se,$.width,$.height,$.depth,0,We,Ce,$.data);else if(_.isFramebufferTexture){if(ut)if(Je)t.texStorage2D(n.TEXTURE_2D,He,Se,$.width,$.height);else{let te=$.width,w=$.height;for(let se=0;se<He;se++)t.texImage2D(n.TEXTURE_2D,se,Se,te,w,0,We,Ce,null),te>>=1,w>>=1}}else if(Ne.length>0&&je){Je&&ut&&t.texStorage2D(n.TEXTURE_2D,He,Se,Ne[0].width,Ne[0].height);for(let te=0,w=Ne.length;te<w;te++)fe=Ne[te],Je?t.texSubImage2D(n.TEXTURE_2D,te,0,0,We,Ce,fe):t.texImage2D(n.TEXTURE_2D,te,Se,We,Ce,fe);_.generateMipmaps=!1}else Je?(ut&&t.texStorage2D(n.TEXTURE_2D,He,Se,$.width,$.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,We,Ce,$)):t.texImage2D(n.TEXTURE_2D,0,Se,We,Ce,$);E(_,je)&&S(J),me.__version=j.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function xe(M,_,N){if(_.image.length!==6)return;const J=Y(M,_),K=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,M.__webglTexture,n.TEXTURE0+N);const j=i.get(K);if(K.version!==j.__version||J===!0){t.activeTexture(n.TEXTURE0+N);const me=Qe.getPrimaries(Qe.workingColorSpace),oe=_.colorSpace===un?null:Qe.getPrimaries(_.colorSpace),he=_.colorSpace===un||me===oe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const be=_.isCompressedTexture||_.image[0].isCompressedTexture,ze=_.image[0]&&_.image[0].isDataTexture,$=[];for(let te=0;te<6;te++)!be&&!ze?$[te]=v(_.image[te],!1,!0,r.maxCubemapSize):$[te]=ze?_.image[te].image:_.image[te],$[te]=Oe(_,$[te]);const je=$[0],We=p(je)||o,Ce=s.convert(_.format,_.colorSpace),Se=s.convert(_.type),fe=T(_.internalFormat,Ce,Se,_.colorSpace),Ne=o&&_.isVideoTexture!==!0,Je=j.__version===void 0||J===!0;let ut=D(_,je,We);B(n.TEXTURE_CUBE_MAP,_,We);let He;if(be){Ne&&Je&&t.texStorage2D(n.TEXTURE_CUBE_MAP,ut,fe,je.width,je.height);for(let te=0;te<6;te++){He=$[te].mipmaps;for(let w=0;w<He.length;w++){const se=He[w];_.format!==yn?Ce!==null?Ne?t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w,0,0,se.width,se.height,Ce,se.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w,fe,se.width,se.height,0,se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w,0,0,se.width,se.height,Ce,Se,se.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w,fe,se.width,se.height,0,Ce,Se,se.data)}}}else{He=_.mipmaps,Ne&&Je&&(He.length>0&&ut++,t.texStorage2D(n.TEXTURE_CUBE_MAP,ut,fe,$[0].width,$[0].height));for(let te=0;te<6;te++)if(ze){Ne?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,$[te].width,$[te].height,Ce,Se,$[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,fe,$[te].width,$[te].height,0,Ce,Se,$[te].data);for(let w=0;w<He.length;w++){const ae=He[w].image[te].image;Ne?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w+1,0,0,ae.width,ae.height,Ce,Se,ae.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w+1,fe,ae.width,ae.height,0,Ce,Se,ae.data)}}else{Ne?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ce,Se,$[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,fe,Ce,Se,$[te]);for(let w=0;w<He.length;w++){const se=He[w];Ne?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w+1,0,0,Ce,Se,se.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,w+1,fe,Ce,Se,se.image[te])}}}E(_,We)&&S(n.TEXTURE_CUBE_MAP),j.__version=K.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function ve(M,_,N,J,K,j){const me=s.convert(N.format,N.colorSpace),oe=s.convert(N.type),he=T(N.internalFormat,me,oe,N.colorSpace);if(!i.get(_).__hasExternalTextures){const ze=Math.max(1,_.width>>j),$=Math.max(1,_.height>>j);K===n.TEXTURE_3D||K===n.TEXTURE_2D_ARRAY?t.texImage3D(K,j,he,ze,$,_.depth,0,me,oe,null):t.texImage2D(K,j,he,ze,$,0,me,oe,null)}t.bindFramebuffer(n.FRAMEBUFFER,M),pe(_)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,K,i.get(N).__webglTexture,0,Pe(_)):(K===n.TEXTURE_2D||K>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,J,K,i.get(N).__webglTexture,j),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(M,_,N){if(n.bindRenderbuffer(n.RENDERBUFFER,M),_.depthBuffer&&!_.stencilBuffer){let J=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(N||pe(_)){const K=_.depthTexture;K&&K.isDepthTexture&&(K.type===ti?J=n.DEPTH_COMPONENT32F:K.type===ei&&(J=n.DEPTH_COMPONENT24));const j=Pe(_);pe(_)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,j,J,_.width,_.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,j,J,_.width,_.height)}else n.renderbufferStorage(n.RENDERBUFFER,J,_.width,_.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,M)}else if(_.depthBuffer&&_.stencilBuffer){const J=Pe(_);N&&pe(_)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,J,n.DEPTH24_STENCIL8,_.width,_.height):pe(_)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,J,n.DEPTH24_STENCIL8,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,M)}else{const J=_.isWebGLMultipleRenderTargets===!0?_.texture:[_.texture];for(let K=0;K<J.length;K++){const j=J[K],me=s.convert(j.format,j.colorSpace),oe=s.convert(j.type),he=T(j.internalFormat,me,oe,j.colorSpace),be=Pe(_);N&&pe(_)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,be,he,_.width,_.height):pe(_)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,be,he,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,he,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ie(M,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,M),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(_.depthTexture).__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),k(_.depthTexture,0);const J=i.get(_.depthTexture).__webglTexture,K=Pe(_);if(_.depthTexture.format===Ai)pe(_)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,J,0);else if(_.depthTexture.format===ar)pe(_)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0,K):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Ae(M){const _=i.get(M),N=M.isWebGLCubeRenderTarget===!0;if(M.depthTexture&&!_.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");Ie(_.__webglFramebuffer,M)}else if(N){_.__webglDepthbuffer=[];for(let J=0;J<6;J++)t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[J]),_.__webglDepthbuffer[J]=n.createRenderbuffer(),De(_.__webglDepthbuffer[J],M,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer=n.createRenderbuffer(),De(_.__webglDepthbuffer,M,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ye(M,_,N){const J=i.get(M);_!==void 0&&ve(J.__webglFramebuffer,M,M.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),N!==void 0&&Ae(M)}function U(M){const _=M.texture,N=i.get(M),J=i.get(_);M.addEventListener("dispose",Z),M.isWebGLMultipleRenderTargets!==!0&&(J.__webglTexture===void 0&&(J.__webglTexture=n.createTexture()),J.__version=_.version,a.memory.textures++);const K=M.isWebGLCubeRenderTarget===!0,j=M.isWebGLMultipleRenderTargets===!0,me=p(M)||o;if(K){N.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(o&&_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer[oe]=[];for(let he=0;he<_.mipmaps.length;he++)N.__webglFramebuffer[oe][he]=n.createFramebuffer()}else N.__webglFramebuffer[oe]=n.createFramebuffer()}else{if(o&&_.mipmaps&&_.mipmaps.length>0){N.__webglFramebuffer=[];for(let oe=0;oe<_.mipmaps.length;oe++)N.__webglFramebuffer[oe]=n.createFramebuffer()}else N.__webglFramebuffer=n.createFramebuffer();if(j)if(r.drawBuffers){const oe=M.texture;for(let he=0,be=oe.length;he<be;he++){const ze=i.get(oe[he]);ze.__webglTexture===void 0&&(ze.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&M.samples>0&&pe(M)===!1){const oe=j?_:[_];N.__webglMultisampledFramebuffer=n.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let he=0;he<oe.length;he++){const be=oe[he];N.__webglColorRenderbuffer[he]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,N.__webglColorRenderbuffer[he]);const ze=s.convert(be.format,be.colorSpace),$=s.convert(be.type),je=T(be.internalFormat,ze,$,be.colorSpace,M.isXRRenderTarget===!0),We=Pe(M);n.renderbufferStorageMultisample(n.RENDERBUFFER,We,je,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,N.__webglColorRenderbuffer[he])}n.bindRenderbuffer(n.RENDERBUFFER,null),M.depthBuffer&&(N.__webglDepthRenderbuffer=n.createRenderbuffer(),De(N.__webglDepthRenderbuffer,M,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),B(n.TEXTURE_CUBE_MAP,_,me);for(let oe=0;oe<6;oe++)if(o&&_.mipmaps&&_.mipmaps.length>0)for(let he=0;he<_.mipmaps.length;he++)ve(N.__webglFramebuffer[oe][he],M,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,he);else ve(N.__webglFramebuffer[oe],M,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);E(_,me)&&S(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(j){const oe=M.texture;for(let he=0,be=oe.length;he<be;he++){const ze=oe[he],$=i.get(ze);t.bindTexture(n.TEXTURE_2D,$.__webglTexture),B(n.TEXTURE_2D,ze,me),ve(N.__webglFramebuffer,M,ze,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,0),E(ze,me)&&S(n.TEXTURE_2D)}t.unbindTexture()}else{let oe=n.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(o?oe=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(oe,J.__webglTexture),B(oe,_,me),o&&_.mipmaps&&_.mipmaps.length>0)for(let he=0;he<_.mipmaps.length;he++)ve(N.__webglFramebuffer[he],M,_,n.COLOR_ATTACHMENT0,oe,he);else ve(N.__webglFramebuffer,M,_,n.COLOR_ATTACHMENT0,oe,0);E(_,me)&&S(oe),t.unbindTexture()}M.depthBuffer&&Ae(M)}function kt(M){const _=p(M)||o,N=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let J=0,K=N.length;J<K;J++){const j=N[J];if(E(j,_)){const me=M.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,oe=i.get(j).__webglTexture;t.bindTexture(me,oe),S(me),t.unbindTexture()}}}function Me(M){if(o&&M.samples>0&&pe(M)===!1){const _=M.isWebGLMultipleRenderTargets?M.texture:[M.texture],N=M.width,J=M.height;let K=n.COLOR_BUFFER_BIT;const j=[],me=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,oe=i.get(M),he=M.isWebGLMultipleRenderTargets===!0;if(he)for(let be=0;be<_.length;be++)t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,oe.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglFramebuffer);for(let be=0;be<_.length;be++){j.push(n.COLOR_ATTACHMENT0+be),M.depthBuffer&&j.push(me);const ze=oe.__ignoreDepthValues!==void 0?oe.__ignoreDepthValues:!1;if(ze===!1&&(M.depthBuffer&&(K|=n.DEPTH_BUFFER_BIT),M.stencilBuffer&&(K|=n.STENCIL_BUFFER_BIT)),he&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,oe.__webglColorRenderbuffer[be]),ze===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[me]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[me])),he){const $=i.get(_[be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,$,0)}n.blitFramebuffer(0,0,N,J,0,0,N,J,K,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,j)}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),he)for(let be=0;be<_.length;be++){t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,oe.__webglColorRenderbuffer[be]);const ze=i.get(_[be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,ze,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,oe.__webglMultisampledFramebuffer)}}function Pe(M){return Math.min(r.maxSamples,M.samples)}function pe(M){const _=i.get(M);return o&&M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function at(M){const _=a.render.frame;u.get(M)!==_&&(u.set(M,_),M.update())}function Oe(M,_){const N=M.colorSpace,J=M.format,K=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||M.format===Ya||N!==Vn&&N!==un&&(Qe.getTransfer(N)===st?o===!1?e.has("EXT_sRGB")===!0&&J===yn?(M.format=Ya,M.minFilter=Kt,M.generateMipmaps=!1):_=Fc.sRGBToLinear(_):(J!==yn||K!==ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",N)),_}this.allocateTextureUnit=P,this.resetTextureUnits=re,this.setTexture2D=k,this.setTexture2DArray=X,this.setTexture3D=G,this.setTextureCube=W,this.rebindTextures=Ye,this.setupRenderTarget=U,this.updateRenderTargetMipmap=kt,this.updateMultisampleRenderTarget=Me,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=pe}function xg(n,e,t){const i=t.isWebGL2;function r(s,a=un){let o;const l=Qe.getTransfer(a);if(s===ai)return n.UNSIGNED_BYTE;if(s===wc)return n.UNSIGNED_SHORT_4_4_4_4;if(s===Rc)return n.UNSIGNED_SHORT_5_5_5_1;if(s===kh)return n.BYTE;if(s===Hh)return n.SHORT;if(s===co)return n.UNSIGNED_SHORT;if(s===Ac)return n.INT;if(s===ei)return n.UNSIGNED_INT;if(s===ti)return n.FLOAT;if(s===hn)return i?n.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(s===Gh)return n.ALPHA;if(s===yn)return n.RGBA;if(s===Vh)return n.LUMINANCE;if(s===Wh)return n.LUMINANCE_ALPHA;if(s===Ai)return n.DEPTH_COMPONENT;if(s===ar)return n.DEPTH_STENCIL;if(s===Ya)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(s===Xh)return n.RED;if(s===Cc)return n.RED_INTEGER;if(s===qh)return n.RG;if(s===Pc)return n.RG_INTEGER;if(s===Lc)return n.RGBA_INTEGER;if(s===ia||s===ra||s===sa||s===aa)if(l===st)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(s===ia)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===ra)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===sa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===aa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(s===ia)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===ra)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===sa)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===aa)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Xo||s===qo||s===Yo||s===$o)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(s===Xo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===qo)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Yo)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===$o)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Dc)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Ko||s===Zo)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(s===Ko)return l===st?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(s===Zo)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Jo||s===jo||s===Qo||s===el||s===tl||s===nl||s===il||s===rl||s===sl||s===al||s===ol||s===ll||s===cl||s===ul)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(s===Jo)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===jo)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Qo)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===el)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===tl)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===nl)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===il)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===rl)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===sl)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===al)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===ol)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===ll)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===cl)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===ul)return l===st?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===oa||s===hl||s===fl)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(s===oa)return l===st?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===hl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===fl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Yh||s===dl||s===pl||s===ml)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(s===oa)return o.COMPRESSED_RED_RGTC1_EXT;if(s===dl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===pl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===ml)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===bi?i?n.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[s]!==void 0?n[s]:null}return{convert:r}}class Sg extends cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ni extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Mg={type:"move"};class Pa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ni,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ni,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ni,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,i),d=this._getHandJoint(c,v);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&f>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Mg)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ni;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class yg extends hr{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,f=null,m=null,g=null;const v=t.getContextAttributes();let p=null,d=null;const E=[],S=[],T=new ie;let D=null;const R=new cn;R.layers.enable(1),R.viewport=new wt;const A=new cn;A.layers.enable(2),A.viewport=new wt;const Z=[R,A],y=new Sg;y.layers.enable(1),y.layers.enable(2);let b=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let Y=E[B];return Y===void 0&&(Y=new Pa,E[B]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(B){let Y=E[B];return Y===void 0&&(Y=new Pa,E[B]=Y),Y.getGripSpace()},this.getHand=function(B){let Y=E[B];return Y===void 0&&(Y=new Pa,E[B]=Y),Y.getHandSpace()};function V(B){const Y=S.indexOf(B.inputSource);if(Y===-1)return;const ce=E[Y];ce!==void 0&&(ce.update(B.inputSource,B.frame,c||a),ce.dispatchEvent({type:B.type,data:B.inputSource}))}function re(){r.removeEventListener("select",V),r.removeEventListener("selectstart",V),r.removeEventListener("selectend",V),r.removeEventListener("squeeze",V),r.removeEventListener("squeezestart",V),r.removeEventListener("squeezeend",V),r.removeEventListener("end",re),r.removeEventListener("inputsourceschange",P);for(let B=0;B<E.length;B++){const Y=S[B];Y!==null&&(S[B]=null,E[B].disconnect(Y))}b=null,H=null,e.setRenderTarget(p),m=null,f=null,h=null,r=null,d=null,ee.stop(),i.isPresenting=!1,e.setPixelRatio(D),e.setSize(T.width,T.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){s=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){o=B,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(B){if(r=B,r!==null){if(p=e.getRenderTarget(),r.addEventListener("select",V),r.addEventListener("selectstart",V),r.addEventListener("selectend",V),r.addEventListener("squeeze",V),r.addEventListener("squeezestart",V),r.addEventListener("squeezeend",V),r.addEventListener("end",re),r.addEventListener("inputsourceschange",P),v.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(T),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Y={antialias:r.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,t,Y),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),d=new Qt(m.framebufferWidth,m.framebufferHeight,{format:yn,type:ai,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let Y=null,ce=null,xe=null;v.depth&&(xe=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Y=v.stencil?ar:Ai,ce=v.stencil?bi:ei);const ve={colorFormat:t.RGBA8,depthFormat:xe,scaleFactor:s};h=new XRWebGLBinding(r,t),f=h.createProjectionLayer(ve),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),d=new Qt(f.textureWidth,f.textureHeight,{format:yn,type:ai,depthTexture:new Yc(f.textureWidth,f.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0});const De=e.properties.get(d);De.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),ee.setContext(r),ee.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function P(B){for(let Y=0;Y<B.removed.length;Y++){const ce=B.removed[Y],xe=S.indexOf(ce);xe>=0&&(S[xe]=null,E[xe].disconnect(ce))}for(let Y=0;Y<B.added.length;Y++){const ce=B.added[Y];let xe=S.indexOf(ce);if(xe===-1){for(let De=0;De<E.length;De++)if(De>=S.length){S.push(ce),xe=De;break}else if(S[De]===null){S[De]=ce,xe=De;break}if(xe===-1)break}const ve=E[xe];ve&&ve.connect(ce)}}const z=new C,k=new C;function X(B,Y,ce){z.setFromMatrixPosition(Y.matrixWorld),k.setFromMatrixPosition(ce.matrixWorld);const xe=z.distanceTo(k),ve=Y.projectionMatrix.elements,De=ce.projectionMatrix.elements,Ie=ve[14]/(ve[10]-1),Ae=ve[14]/(ve[10]+1),Ye=(ve[9]+1)/ve[5],U=(ve[9]-1)/ve[5],kt=(ve[8]-1)/ve[0],Me=(De[8]+1)/De[0],Pe=Ie*kt,pe=Ie*Me,at=xe/(-kt+Me),Oe=at*-kt;Y.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Oe),B.translateZ(at),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();const M=Ie+at,_=Ae+at,N=Pe-Oe,J=pe+(xe-Oe),K=Ye*Ae/_*M,j=U*Ae/_*M;B.projectionMatrix.makePerspective(N,J,K,j,M,_),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}function G(B,Y){Y===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(Y.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(r===null)return;y.near=A.near=R.near=B.near,y.far=A.far=R.far=B.far,(b!==y.near||H!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),b=y.near,H=y.far);const Y=B.parent,ce=y.cameras;G(y,Y);for(let xe=0;xe<ce.length;xe++)G(ce[xe],Y);ce.length===2?X(y,R,A):y.projectionMatrix.copy(R.projectionMatrix),W(B,y,Y)};function W(B,Y,ce){ce===null?B.matrix.copy(Y.matrixWorld):(B.matrix.copy(ce.matrixWorld),B.matrix.invert(),B.matrix.multiply(Y.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(Y.projectionMatrix),B.projectionMatrixInverse.copy(Y.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Pr*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(B){l=B,f!==null&&(f.fixedFoveation=B),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=B)};let q=null;function Q(B,Y){if(u=Y.getViewerPose(c||a),g=Y,u!==null){const ce=u.views;m!==null&&(e.setRenderTargetFramebuffer(d,m.framebuffer),e.setRenderTarget(d));let xe=!1;ce.length!==y.cameras.length&&(y.cameras.length=0,xe=!0);for(let ve=0;ve<ce.length;ve++){const De=ce[ve];let Ie=null;if(m!==null)Ie=m.getViewport(De);else{const Ye=h.getViewSubImage(f,De);Ie=Ye.viewport,ve===0&&(e.setRenderTargetTextures(d,Ye.colorTexture,f.ignoreDepthValues?void 0:Ye.depthStencilTexture),e.setRenderTarget(d))}let Ae=Z[ve];Ae===void 0&&(Ae=new cn,Ae.layers.enable(ve),Ae.viewport=new wt,Z[ve]=Ae),Ae.matrix.fromArray(De.transform.matrix),Ae.matrix.decompose(Ae.position,Ae.quaternion,Ae.scale),Ae.projectionMatrix.fromArray(De.projectionMatrix),Ae.projectionMatrixInverse.copy(Ae.projectionMatrix).invert(),Ae.viewport.set(Ie.x,Ie.y,Ie.width,Ie.height),ve===0&&(y.matrix.copy(Ae.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),xe===!0&&y.cameras.push(Ae)}}for(let ce=0;ce<E.length;ce++){const xe=S[ce],ve=E[ce];xe!==null&&ve!==void 0&&ve.update(xe,Y,c||a)}q&&q(B,Y),Y.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Y}),g=null}const ee=new qc;ee.setAnimationLoop(Q),this.setAnimationLoop=function(B){q=B},this.dispose=function(){}}}function Tg(n,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,Gc(n)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function r(p,d,E,S,T){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(p,d):d.isMeshToonMaterial?(s(p,d),h(p,d)):d.isMeshPhongMaterial?(s(p,d),u(p,d)):d.isMeshStandardMaterial?(s(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,T)):d.isMeshMatcapMaterial?(s(p,d),g(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),v(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,E,S):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Jt&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Jt&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const E=e.get(d).envMap;if(E&&(p.envMap.value=E,p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;const S=n._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*S,t(d.lightMap,p.lightMapTransform)}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,E,S){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*E,p.scale.value=S*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function h(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),e.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,E){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Jt&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,d){d.matcap&&(p.matcap.value=d.matcap)}function v(p,d){const E=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Eg(n,e,t,i){let r={},s={},a=[];const o=t.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(E,S){const T=S.program;i.uniformBlockBinding(E,T)}function c(E,S){let T=r[E.id];T===void 0&&(g(E),T=u(E),r[E.id]=T,E.addEventListener("dispose",p));const D=S.program;i.updateUBOMapping(E,D);const R=e.render.frame;s[E.id]!==R&&(f(E),s[E.id]=R)}function u(E){const S=h();E.__bindingPointIndex=S;const T=n.createBuffer(),D=E.__size,R=E.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,D,R),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,T),T}function h(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){const S=r[E.id],T=E.uniforms,D=E.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let R=0,A=T.length;R<A;R++){const Z=Array.isArray(T[R])?T[R]:[T[R]];for(let y=0,b=Z.length;y<b;y++){const H=Z[y];if(m(H,R,y,D)===!0){const V=H.__offset,re=Array.isArray(H.value)?H.value:[H.value];let P=0;for(let z=0;z<re.length;z++){const k=re[z],X=v(k);typeof k=="number"||typeof k=="boolean"?(H.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,V+P,H.__data)):k.isMatrix3?(H.__data[0]=k.elements[0],H.__data[1]=k.elements[1],H.__data[2]=k.elements[2],H.__data[3]=0,H.__data[4]=k.elements[3],H.__data[5]=k.elements[4],H.__data[6]=k.elements[5],H.__data[7]=0,H.__data[8]=k.elements[6],H.__data[9]=k.elements[7],H.__data[10]=k.elements[8],H.__data[11]=0):(k.toArray(H.__data,P),P+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,H.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(E,S,T,D){const R=E.value,A=S+"_"+T;if(D[A]===void 0)return typeof R=="number"||typeof R=="boolean"?D[A]=R:D[A]=R.clone(),!0;{const Z=D[A];if(typeof R=="number"||typeof R=="boolean"){if(Z!==R)return D[A]=R,!0}else if(Z.equals(R)===!1)return Z.copy(R),!0}return!1}function g(E){const S=E.uniforms;let T=0;const D=16;for(let A=0,Z=S.length;A<Z;A++){const y=Array.isArray(S[A])?S[A]:[S[A]];for(let b=0,H=y.length;b<H;b++){const V=y[b],re=Array.isArray(V.value)?V.value:[V.value];for(let P=0,z=re.length;P<z;P++){const k=re[P],X=v(k),G=T%D;G!==0&&D-G<X.boundary&&(T+=D-G),V.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=T,T+=X.storage}}}const R=T%D;return R>0&&(T+=D-R),E.__size=T,E.__cache={},this}function v(E){const S={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(S.boundary=4,S.storage=4):E.isVector2?(S.boundary=8,S.storage=8):E.isVector3||E.isColor?(S.boundary=16,S.storage=12):E.isVector4?(S.boundary=16,S.storage=16):E.isMatrix3?(S.boundary=48,S.storage=48):E.isMatrix4?(S.boundary=64,S.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),S}function p(E){const S=E.target;S.removeEventListener("dispose",p);const T=a.indexOf(S.__bindingPointIndex);a.splice(T,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function d(){for(const E in r)n.deleteBuffer(r[E]);a=[],r={},s={}}return{bind:l,update:c,dispose:d}}class Qc{constructor(e={}){const{canvas:t=Mf(),context:i=null,depth:r=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let f;i!==null?f=i.getContextAttributes().alpha:f=a;const m=new Uint32Array(4),g=new Int32Array(4);let v=null,p=null;const d=[],E=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ct,this._useLegacyLights=!1,this.toneMapping=si,this.toneMappingExposure=1;const S=this;let T=!1,D=0,R=0,A=null,Z=-1,y=null;const b=new wt,H=new wt;let V=null;const re=new _e(0);let P=0,z=t.width,k=t.height,X=1,G=null,W=null;const q=new wt(0,0,z,k),Q=new wt(0,0,z,k);let ee=!1;const B=new Xc;let Y=!1,ce=!1,xe=null;const ve=new Mt,De=new ie,Ie=new C,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Ye(){return A===null?X:1}let U=i;function kt(x,L){for(let F=0;F<x.length;F++){const O=x[F],I=t.getContext(O,L);if(I!==null)return I}return null}try{const x={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${lo}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",w,!1),t.addEventListener("webglcontextcreationerror",se,!1),U===null){const L=["webgl2","webgl","experimental-webgl"];if(S.isWebGL1Renderer===!0&&L.shift(),U=kt(L,x),U===null)throw kt(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&U instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),U.getShaderPrecisionFormat===void 0&&(U.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Me,Pe,pe,at,Oe,M,_,N,J,K,j,me,oe,he,be,ze,$,je,We,Ce,Se,fe,Ne,Je;function ut(){Me=new Im(U),Pe=new Rm(U,Me,e),Me.init(Pe),fe=new xg(U,Me,Pe),pe=new vg(U,Me,Pe),at=new Om(U),Oe=new ig,M=new _g(U,Me,pe,Oe,Pe,fe,at),_=new Pm(S),N=new Um(S),J=new Xf(U,Pe),Ne=new Am(U,Me,J,Pe),K=new Nm(U,J,at,Ne),j=new Hm(U,K,J,at),We=new km(U,Pe,M),ze=new Cm(Oe),me=new ng(S,_,N,Me,Pe,Ne,ze),oe=new Tg(S,Oe),he=new sg,be=new hg(Me,Pe),je=new bm(S,_,N,pe,j,f,l),$=new gg(S,j,Pe),Je=new Eg(U,at,Pe,pe),Ce=new wm(U,Me,at,Pe),Se=new Fm(U,Me,at,Pe),at.programs=me.programs,S.capabilities=Pe,S.extensions=Me,S.properties=Oe,S.renderLists=he,S.shadowMap=$,S.state=pe,S.info=at}ut();const He=new yg(S,U);this.xr=He,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const x=Me.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=Me.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(x){x!==void 0&&(X=x,this.setSize(z,k,!1))},this.getSize=function(x){return x.set(z,k)},this.setSize=function(x,L,F=!0){if(He.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=x,k=L,t.width=Math.floor(x*X),t.height=Math.floor(L*X),F===!0&&(t.style.width=x+"px",t.style.height=L+"px"),this.setViewport(0,0,x,L)},this.getDrawingBufferSize=function(x){return x.set(z*X,k*X).floor()},this.setDrawingBufferSize=function(x,L,F){z=x,k=L,X=F,t.width=Math.floor(x*F),t.height=Math.floor(L*F),this.setViewport(0,0,x,L)},this.getCurrentViewport=function(x){return x.copy(b)},this.getViewport=function(x){return x.copy(q)},this.setViewport=function(x,L,F,O){x.isVector4?q.set(x.x,x.y,x.z,x.w):q.set(x,L,F,O),pe.viewport(b.copy(q).multiplyScalar(X).floor())},this.getScissor=function(x){return x.copy(Q)},this.setScissor=function(x,L,F,O){x.isVector4?Q.set(x.x,x.y,x.z,x.w):Q.set(x,L,F,O),pe.scissor(H.copy(Q).multiplyScalar(X).floor())},this.getScissorTest=function(){return ee},this.setScissorTest=function(x){pe.setScissorTest(ee=x)},this.setOpaqueSort=function(x){G=x},this.setTransparentSort=function(x){W=x},this.getClearColor=function(x){return x.copy(je.getClearColor())},this.setClearColor=function(){je.setClearColor.apply(je,arguments)},this.getClearAlpha=function(){return je.getClearAlpha()},this.setClearAlpha=function(){je.setClearAlpha.apply(je,arguments)},this.clear=function(x=!0,L=!0,F=!0){let O=0;if(x){let I=!1;if(A!==null){const ue=A.texture.format;I=ue===Lc||ue===Pc||ue===Cc}if(I){const ue=A.texture.type,ge=ue===ai||ue===ei||ue===co||ue===bi||ue===wc||ue===Rc,Te=je.getClearColor(),Re=je.getClearAlpha(),Be=Te.r,Le=Te.g,Ue=Te.b;ge?(m[0]=Be,m[1]=Le,m[2]=Ue,m[3]=Re,U.clearBufferuiv(U.COLOR,0,m)):(g[0]=Be,g[1]=Le,g[2]=Ue,g[3]=Re,U.clearBufferiv(U.COLOR,0,g))}else O|=U.COLOR_BUFFER_BIT}L&&(O|=U.DEPTH_BUFFER_BIT),F&&(O|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",w,!1),t.removeEventListener("webglcontextcreationerror",se,!1),he.dispose(),be.dispose(),Oe.dispose(),_.dispose(),N.dispose(),j.dispose(),Ne.dispose(),Je.dispose(),me.dispose(),He.dispose(),He.removeEventListener("sessionstart",Ht),He.removeEventListener("sessionend",rt),xe&&(xe.dispose(),xe=null),Gt.stop()};function te(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function w(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;const x=at.autoReset,L=$.enabled,F=$.autoUpdate,O=$.needsUpdate,I=$.type;ut(),at.autoReset=x,$.enabled=L,$.autoUpdate=F,$.needsUpdate=O,$.type=I}function se(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function ae(x){const L=x.target;L.removeEventListener("dispose",ae),we(L)}function we(x){ye(x),Oe.remove(x)}function ye(x){const L=Oe.get(x).programs;L!==void 0&&(L.forEach(function(F){me.releaseProgram(F)}),x.isShaderMaterial&&me.releaseShaderCache(x))}this.renderBufferDirect=function(x,L,F,O,I,ue){L===null&&(L=Ae);const ge=I.isMesh&&I.matrixWorld.determinant()<0,Te=nh(x,L,F,O,I);pe.setMaterial(O,ge);let Re=F.index,Be=1;if(O.wireframe===!0){if(Re=K.getWireframeAttribute(F),Re===void 0)return;Be=2}const Le=F.drawRange,Ue=F.attributes.position;let dt=Le.start*Be,tn=(Le.start+Le.count)*Be;ue!==null&&(dt=Math.max(dt,ue.start*Be),tn=Math.min(tn,(ue.start+ue.count)*Be)),Re!==null?(dt=Math.max(dt,0),tn=Math.min(tn,Re.count)):Ue!=null&&(dt=Math.max(dt,0),tn=Math.min(tn,Ue.count));const bt=tn-dt;if(bt<0||bt===1/0)return;Ne.setup(I,O,Te,F,Re);let Un,ot=Ce;if(Re!==null&&(Un=J.get(Re),ot=Se,ot.setIndex(Un)),I.isMesh)O.wireframe===!0?(pe.setLineWidth(O.wireframeLinewidth*Ye()),ot.setMode(U.LINES)):ot.setMode(U.TRIANGLES);else if(I.isLine){let Ge=O.linewidth;Ge===void 0&&(Ge=1),pe.setLineWidth(Ge*Ye()),I.isLineSegments?ot.setMode(U.LINES):I.isLineLoop?ot.setMode(U.LINE_LOOP):ot.setMode(U.LINE_STRIP)}else I.isPoints?ot.setMode(U.POINTS):I.isSprite&&ot.setMode(U.TRIANGLES);if(I.isBatchedMesh)ot.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else if(I.isInstancedMesh)ot.renderInstances(dt,bt,I.count);else if(F.isInstancedBufferGeometry){const Ge=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,js=Math.min(F.instanceCount,Ge);ot.renderInstances(dt,bt,js)}else ot.render(dt,bt)};function nt(x,L,F){x.transparent===!0&&x.side===Sn&&x.forceSinglePass===!1?(x.side=Jt,x.needsUpdate=!0,Xr(x,L,F),x.side=oi,x.needsUpdate=!0,Xr(x,L,F),x.side=Sn):Xr(x,L,F)}this.compile=function(x,L,F=null){F===null&&(F=x),p=be.get(F),p.init(),E.push(p),F.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),x!==F&&x.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(p.pushLight(I),I.castShadow&&p.pushShadow(I))}),p.setupLights(S._useLegacyLights);const O=new Set;return x.traverse(function(I){const ue=I.material;if(ue)if(Array.isArray(ue))for(let ge=0;ge<ue.length;ge++){const Te=ue[ge];nt(Te,F,I),O.add(Te)}else nt(ue,F,I),O.add(ue)}),E.pop(),p=null,O},this.compileAsync=function(x,L,F=null){const O=this.compile(x,L,F);return new Promise(I=>{function ue(){if(O.forEach(function(ge){Oe.get(ge).currentProgram.isReady()&&O.delete(ge)}),O.size===0){I(x);return}setTimeout(ue,10)}Me.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let it=null;function Et(x){it&&it(x)}function Ht(){Gt.stop()}function rt(){Gt.start()}const Gt=new qc;Gt.setAnimationLoop(Et),typeof self<"u"&&Gt.setContext(self),this.setAnimationLoop=function(x){it=x,He.setAnimationLoop(x),x===null?Gt.stop():Gt.start()},He.addEventListener("sessionstart",Ht),He.addEventListener("sessionend",rt),this.render=function(x,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),He.enabled===!0&&He.isPresenting===!0&&(He.cameraAutoUpdate===!0&&He.updateCamera(L),L=He.getCamera()),x.isScene===!0&&x.onBeforeRender(S,x,L,A),p=be.get(x,E.length),p.init(),E.push(p),ve.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),B.setFromProjectionMatrix(ve),ce=this.localClippingEnabled,Y=ze.init(this.clippingPlanes,ce),v=he.get(x,d.length),v.init(),d.push(v),En(x,L,0,S.sortObjects),v.finish(),S.sortObjects===!0&&v.sort(G,W),this.info.render.frame++,Y===!0&&ze.beginShadows();const F=p.state.shadowsArray;if($.render(F,x,L),Y===!0&&ze.endShadows(),this.info.autoReset===!0&&this.info.reset(),je.render(v,x),p.setupLights(S._useLegacyLights),L.isArrayCamera){const O=L.cameras;for(let I=0,ue=O.length;I<ue;I++){const ge=O[I];Uo(v,x,ge,ge.viewport)}}else Uo(v,x,L);A!==null&&(M.updateMultisampleRenderTarget(A),M.updateRenderTargetMipmap(A)),x.isScene===!0&&x.onAfterRender(S,x,L),Ne.resetDefaultState(),Z=-1,y=null,E.pop(),E.length>0?p=E[E.length-1]:p=null,d.pop(),d.length>0?v=d[d.length-1]:v=null};function En(x,L,F,O){if(x.visible===!1)return;if(x.layers.test(L.layers)){if(x.isGroup)F=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(L);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||B.intersectsSprite(x)){O&&Ie.setFromMatrixPosition(x.matrixWorld).applyMatrix4(ve);const ge=j.update(x),Te=x.material;Te.visible&&v.push(x,ge,Te,F,Ie.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||B.intersectsObject(x))){const ge=j.update(x),Te=x.material;if(O&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),Ie.copy(x.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Ie.copy(ge.boundingSphere.center)),Ie.applyMatrix4(x.matrixWorld).applyMatrix4(ve)),Array.isArray(Te)){const Re=ge.groups;for(let Be=0,Le=Re.length;Be<Le;Be++){const Ue=Re[Be],dt=Te[Ue.materialIndex];dt&&dt.visible&&v.push(x,ge,dt,F,Ie.z,Ue)}}else Te.visible&&v.push(x,ge,Te,F,Ie.z,null)}}const ue=x.children;for(let ge=0,Te=ue.length;ge<Te;ge++)En(ue[ge],L,F,O)}function Uo(x,L,F,O){const I=x.opaque,ue=x.transmissive,ge=x.transparent;p.setupLightsView(F),Y===!0&&ze.setGlobalState(S.clippingPlanes,F),ue.length>0&&th(I,ue,L,F),O&&pe.viewport(b.copy(O)),I.length>0&&Wr(I,L,F),ue.length>0&&Wr(ue,L,F),ge.length>0&&Wr(ge,L,F),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function th(x,L,F,O){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;const ue=Pe.isWebGL2;xe===null&&(xe=new Qt(1,1,{generateMipmaps:!0,type:Me.has("EXT_color_buffer_half_float")?hn:ai,minFilter:li,samples:ue?4:0})),S.getDrawingBufferSize(De),ue?xe.setSize(De.x,De.y):xe.setSize(Cs(De.x),Cs(De.y));const ge=S.getRenderTarget();S.setRenderTarget(xe),S.getClearColor(re),P=S.getClearAlpha(),P<1&&S.setClearColor(16777215,.5),S.clear();const Te=S.toneMapping;S.toneMapping=si,Wr(x,F,O),M.updateMultisampleRenderTarget(xe),M.updateRenderTargetMipmap(xe);let Re=!1;for(let Be=0,Le=L.length;Be<Le;Be++){const Ue=L[Be],dt=Ue.object,tn=Ue.geometry,bt=Ue.material,Un=Ue.group;if(bt.side===Sn&&dt.layers.test(O.layers)){const ot=bt.side;bt.side=Jt,bt.needsUpdate=!0,Io(dt,F,O,tn,bt,Un),bt.side=ot,bt.needsUpdate=!0,Re=!0}}Re===!0&&(M.updateMultisampleRenderTarget(xe),M.updateRenderTargetMipmap(xe)),S.setRenderTarget(ge),S.setClearColor(re,P),S.toneMapping=Te}function Wr(x,L,F){const O=L.isScene===!0?L.overrideMaterial:null;for(let I=0,ue=x.length;I<ue;I++){const ge=x[I],Te=ge.object,Re=ge.geometry,Be=O===null?ge.material:O,Le=ge.group;Te.layers.test(F.layers)&&Io(Te,L,F,Re,Be,Le)}}function Io(x,L,F,O,I,ue){x.onBeforeRender(S,L,F,O,I,ue),x.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),I.onBeforeRender(S,L,F,O,x,ue),I.transparent===!0&&I.side===Sn&&I.forceSinglePass===!1?(I.side=Jt,I.needsUpdate=!0,S.renderBufferDirect(F,L,O,I,x,ue),I.side=oi,I.needsUpdate=!0,S.renderBufferDirect(F,L,O,I,x,ue),I.side=Sn):S.renderBufferDirect(F,L,O,I,x,ue),x.onAfterRender(S,L,F,O,I,ue)}function Xr(x,L,F){L.isScene!==!0&&(L=Ae);const O=Oe.get(x),I=p.state.lights,ue=p.state.shadowsArray,ge=I.state.version,Te=me.getParameters(x,I.state,ue,L,F),Re=me.getProgramCacheKey(Te);let Be=O.programs;O.environment=x.isMeshStandardMaterial?L.environment:null,O.fog=L.fog,O.envMap=(x.isMeshStandardMaterial?N:_).get(x.envMap||O.environment),Be===void 0&&(x.addEventListener("dispose",ae),Be=new Map,O.programs=Be);let Le=Be.get(Re);if(Le!==void 0){if(O.currentProgram===Le&&O.lightsStateVersion===ge)return Fo(x,Te),Le}else Te.uniforms=me.getUniforms(x),x.onBuild(F,Te,S),x.onBeforeCompile(Te,S),Le=me.acquireProgram(Te,Re),Be.set(Re,Le),O.uniforms=Te.uniforms;const Ue=O.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ue.clippingPlanes=ze.uniform),Fo(x,Te),O.needsLights=rh(x),O.lightsStateVersion=ge,O.needsLights&&(Ue.ambientLightColor.value=I.state.ambient,Ue.lightProbe.value=I.state.probe,Ue.directionalLights.value=I.state.directional,Ue.directionalLightShadows.value=I.state.directionalShadow,Ue.spotLights.value=I.state.spot,Ue.spotLightShadows.value=I.state.spotShadow,Ue.rectAreaLights.value=I.state.rectArea,Ue.ltc_1.value=I.state.rectAreaLTC1,Ue.ltc_2.value=I.state.rectAreaLTC2,Ue.pointLights.value=I.state.point,Ue.pointLightShadows.value=I.state.pointShadow,Ue.hemisphereLights.value=I.state.hemi,Ue.directionalShadowMap.value=I.state.directionalShadowMap,Ue.directionalShadowMatrix.value=I.state.directionalShadowMatrix,Ue.spotShadowMap.value=I.state.spotShadowMap,Ue.spotLightMatrix.value=I.state.spotLightMatrix,Ue.spotLightMap.value=I.state.spotLightMap,Ue.pointShadowMap.value=I.state.pointShadowMap,Ue.pointShadowMatrix.value=I.state.pointShadowMatrix),O.currentProgram=Le,O.uniformsList=null,Le}function No(x){if(x.uniformsList===null){const L=x.currentProgram.getUniforms();x.uniformsList=Ts.seqWithValue(L.seq,x.uniforms)}return x.uniformsList}function Fo(x,L){const F=Oe.get(x);F.outputColorSpace=L.outputColorSpace,F.batching=L.batching,F.instancing=L.instancing,F.instancingColor=L.instancingColor,F.skinning=L.skinning,F.morphTargets=L.morphTargets,F.morphNormals=L.morphNormals,F.morphColors=L.morphColors,F.morphTargetsCount=L.morphTargetsCount,F.numClippingPlanes=L.numClippingPlanes,F.numIntersection=L.numClipIntersection,F.vertexAlphas=L.vertexAlphas,F.vertexTangents=L.vertexTangents,F.toneMapping=L.toneMapping}function nh(x,L,F,O,I){L.isScene!==!0&&(L=Ae),M.resetTextureUnits();const ue=L.fog,ge=O.isMeshStandardMaterial?L.environment:null,Te=A===null?S.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Vn,Re=(O.isMeshStandardMaterial?N:_).get(O.envMap||ge),Be=O.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Le=!!F.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),Ue=!!F.morphAttributes.position,dt=!!F.morphAttributes.normal,tn=!!F.morphAttributes.color;let bt=si;O.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(bt=S.toneMapping);const Un=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ot=Un!==void 0?Un.length:0,Ge=Oe.get(O),js=p.state.lights;if(Y===!0&&(ce===!0||x!==y)){const an=x===y&&O.id===Z;ze.setState(O,x,an)}let ht=!1;O.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==js.state.version||Ge.outputColorSpace!==Te||I.isBatchedMesh&&Ge.batching===!1||!I.isBatchedMesh&&Ge.batching===!0||I.isInstancedMesh&&Ge.instancing===!1||!I.isInstancedMesh&&Ge.instancing===!0||I.isSkinnedMesh&&Ge.skinning===!1||!I.isSkinnedMesh&&Ge.skinning===!0||I.isInstancedMesh&&Ge.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&Ge.instancingColor===!1&&I.instanceColor!==null||Ge.envMap!==Re||O.fog===!0&&Ge.fog!==ue||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==ze.numPlanes||Ge.numIntersection!==ze.numIntersection)||Ge.vertexAlphas!==Be||Ge.vertexTangents!==Le||Ge.morphTargets!==Ue||Ge.morphNormals!==dt||Ge.morphColors!==tn||Ge.toneMapping!==bt||Pe.isWebGL2===!0&&Ge.morphTargetsCount!==ot)&&(ht=!0):(ht=!0,Ge.__version=O.version);let hi=Ge.currentProgram;ht===!0&&(hi=Xr(O,L,I));let Oo=!1,dr=!1,Qs=!1;const Ut=hi.getUniforms(),fi=Ge.uniforms;if(pe.useProgram(hi.program)&&(Oo=!0,dr=!0,Qs=!0),O.id!==Z&&(Z=O.id,dr=!0),Oo||y!==x){Ut.setValue(U,"projectionMatrix",x.projectionMatrix),Ut.setValue(U,"viewMatrix",x.matrixWorldInverse);const an=Ut.map.cameraPosition;an!==void 0&&an.setValue(U,Ie.setFromMatrixPosition(x.matrixWorld)),Pe.logarithmicDepthBuffer&&Ut.setValue(U,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&Ut.setValue(U,"isOrthographic",x.isOrthographicCamera===!0),y!==x&&(y=x,dr=!0,Qs=!0)}if(I.isSkinnedMesh){Ut.setOptional(U,I,"bindMatrix"),Ut.setOptional(U,I,"bindMatrixInverse");const an=I.skeleton;an&&(Pe.floatVertexTextures?(an.boneTexture===null&&an.computeBoneTexture(),Ut.setValue(U,"boneTexture",an.boneTexture,M)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}I.isBatchedMesh&&(Ut.setOptional(U,I,"batchingTexture"),Ut.setValue(U,"batchingTexture",I._matricesTexture,M));const ea=F.morphAttributes;if((ea.position!==void 0||ea.normal!==void 0||ea.color!==void 0&&Pe.isWebGL2===!0)&&We.update(I,F,hi),(dr||Ge.receiveShadow!==I.receiveShadow)&&(Ge.receiveShadow=I.receiveShadow,Ut.setValue(U,"receiveShadow",I.receiveShadow)),O.isMeshGouraudMaterial&&O.envMap!==null&&(fi.envMap.value=Re,fi.flipEnvMap.value=Re.isCubeTexture&&Re.isRenderTargetTexture===!1?-1:1),dr&&(Ut.setValue(U,"toneMappingExposure",S.toneMappingExposure),Ge.needsLights&&ih(fi,Qs),ue&&O.fog===!0&&oe.refreshFogUniforms(fi,ue),oe.refreshMaterialUniforms(fi,O,X,k,xe),Ts.upload(U,No(Ge),fi,M)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Ts.upload(U,No(Ge),fi,M),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&Ut.setValue(U,"center",I.center),Ut.setValue(U,"modelViewMatrix",I.modelViewMatrix),Ut.setValue(U,"normalMatrix",I.normalMatrix),Ut.setValue(U,"modelMatrix",I.matrixWorld),O.isShaderMaterial||O.isRawShaderMaterial){const an=O.uniformsGroups;for(let ta=0,sh=an.length;ta<sh;ta++)if(Pe.isWebGL2){const zo=an[ta];Je.update(zo,hi),Je.bind(zo,hi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return hi}function ih(x,L){x.ambientLightColor.needsUpdate=L,x.lightProbe.needsUpdate=L,x.directionalLights.needsUpdate=L,x.directionalLightShadows.needsUpdate=L,x.pointLights.needsUpdate=L,x.pointLightShadows.needsUpdate=L,x.spotLights.needsUpdate=L,x.spotLightShadows.needsUpdate=L,x.rectAreaLights.needsUpdate=L,x.hemisphereLights.needsUpdate=L}function rh(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(x,L,F){Oe.get(x.texture).__webglTexture=L,Oe.get(x.depthTexture).__webglTexture=F;const O=Oe.get(x);O.__hasExternalTextures=!0,O.__hasExternalTextures&&(O.__autoAllocateDepthBuffer=F===void 0,O.__autoAllocateDepthBuffer||Me.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),O.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(x,L){const F=Oe.get(x);F.__webglFramebuffer=L,F.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(x,L=0,F=0){A=x,D=L,R=F;let O=!0,I=null,ue=!1,ge=!1;if(x){const Re=Oe.get(x);Re.__useDefaultFramebuffer!==void 0?(pe.bindFramebuffer(U.FRAMEBUFFER,null),O=!1):Re.__webglFramebuffer===void 0?M.setupRenderTarget(x):Re.__hasExternalTextures&&M.rebindTextures(x,Oe.get(x.texture).__webglTexture,Oe.get(x.depthTexture).__webglTexture);const Be=x.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(ge=!0);const Le=Oe.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Le[L])?I=Le[L][F]:I=Le[L],ue=!0):Pe.isWebGL2&&x.samples>0&&M.useMultisampledRTT(x)===!1?I=Oe.get(x).__webglMultisampledFramebuffer:Array.isArray(Le)?I=Le[F]:I=Le,b.copy(x.viewport),H.copy(x.scissor),V=x.scissorTest}else b.copy(q).multiplyScalar(X).floor(),H.copy(Q).multiplyScalar(X).floor(),V=ee;if(pe.bindFramebuffer(U.FRAMEBUFFER,I)&&Pe.drawBuffers&&O&&pe.drawBuffers(x,I),pe.viewport(b),pe.scissor(H),pe.setScissorTest(V),ue){const Re=Oe.get(x.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+L,Re.__webglTexture,F)}else if(ge){const Re=Oe.get(x.texture),Be=L||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Re.__webglTexture,F||0,Be)}Z=-1},this.readRenderTargetPixels=function(x,L,F,O,I,ue,ge){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Oe.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&ge!==void 0&&(Te=Te[ge]),Te){pe.bindFramebuffer(U.FRAMEBUFFER,Te);try{const Re=x.texture,Be=Re.format,Le=Re.type;if(Be!==yn&&fe.convert(Be)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ue=Le===hn&&(Me.has("EXT_color_buffer_half_float")||Pe.isWebGL2&&Me.has("EXT_color_buffer_float"));if(Le!==ai&&fe.convert(Le)!==U.getParameter(U.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Le===ti&&(Pe.isWebGL2||Me.has("OES_texture_float")||Me.has("WEBGL_color_buffer_float")))&&!Ue){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=x.width-O&&F>=0&&F<=x.height-I&&U.readPixels(L,F,O,I,fe.convert(Be),fe.convert(Le),ue)}finally{const Re=A!==null?Oe.get(A).__webglFramebuffer:null;pe.bindFramebuffer(U.FRAMEBUFFER,Re)}}},this.copyFramebufferToTexture=function(x,L,F=0){const O=Math.pow(2,-F),I=Math.floor(L.image.width*O),ue=Math.floor(L.image.height*O);M.setTexture2D(L,0),U.copyTexSubImage2D(U.TEXTURE_2D,F,0,0,x.x,x.y,I,ue),pe.unbindTexture()},this.copyTextureToTexture=function(x,L,F,O=0){const I=L.image.width,ue=L.image.height,ge=fe.convert(F.format),Te=fe.convert(F.type);M.setTexture2D(F,0),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment),L.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,O,x.x,x.y,I,ue,ge,Te,L.image.data):L.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,O,x.x,x.y,L.mipmaps[0].width,L.mipmaps[0].height,ge,L.mipmaps[0].data):U.texSubImage2D(U.TEXTURE_2D,O,x.x,x.y,ge,Te,L.image),O===0&&F.generateMipmaps&&U.generateMipmap(U.TEXTURE_2D),pe.unbindTexture()},this.copyTextureToTexture3D=function(x,L,F,O,I=0){if(S.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ue=x.max.x-x.min.x+1,ge=x.max.y-x.min.y+1,Te=x.max.z-x.min.z+1,Re=fe.convert(O.format),Be=fe.convert(O.type);let Le;if(O.isData3DTexture)M.setTexture3D(O,0),Le=U.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)M.setTexture2DArray(O,0),Le=U.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,O.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,O.unpackAlignment);const Ue=U.getParameter(U.UNPACK_ROW_LENGTH),dt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),tn=U.getParameter(U.UNPACK_SKIP_PIXELS),bt=U.getParameter(U.UNPACK_SKIP_ROWS),Un=U.getParameter(U.UNPACK_SKIP_IMAGES),ot=F.isCompressedTexture?F.mipmaps[I]:F.image;U.pixelStorei(U.UNPACK_ROW_LENGTH,ot.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ot.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,x.min.x),U.pixelStorei(U.UNPACK_SKIP_ROWS,x.min.y),U.pixelStorei(U.UNPACK_SKIP_IMAGES,x.min.z),F.isDataTexture||F.isData3DTexture?U.texSubImage3D(Le,I,L.x,L.y,L.z,ue,ge,Te,Re,Be,ot.data):F.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),U.compressedTexSubImage3D(Le,I,L.x,L.y,L.z,ue,ge,Te,Re,ot.data)):U.texSubImage3D(Le,I,L.x,L.y,L.z,ue,ge,Te,Re,Be,ot),U.pixelStorei(U.UNPACK_ROW_LENGTH,Ue),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,dt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,tn),U.pixelStorei(U.UNPACK_SKIP_ROWS,bt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Un),I===0&&O.generateMipmaps&&U.generateMipmap(Le),pe.unbindTexture()},this.initTexture=function(x){x.isCubeTexture?M.setTextureCube(x,0):x.isData3DTexture?M.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?M.setTexture2DArray(x,0):M.setTexture2D(x,0),pe.unbindTexture()},this.resetState=function(){D=0,R=0,A=null,pe.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===uo?"display-p3":"srgb",t.unpackColorSpace=Qe.workingColorSpace===Vs?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ct?wi:Uc}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===wi?Ct:Vn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class bg extends Qc{}bg.prototype.isWebGL1Renderer=!0;class vo extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Ag extends Or{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new _e(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const rc=new Mt,Za=new fo,ps=new Ws,ms=new C;class eu extends en{constructor(e=new mn,t=new Ag){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ps.copy(i.boundingSphere),ps.applyMatrix4(r),ps.radius+=s,e.ray.intersectsSphere(ps)===!1)return;rc.copy(r).invert(),Za.copy(e.ray).applyMatrix4(rc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let g=f,v=m;g<v;g++){const p=c.getX(g);ms.fromBufferAttribute(h,p),sc(ms,p,l,r,e,t,this)}}else{const f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let g=f,v=m;g<v;g++)ms.fromBufferAttribute(h,g),sc(ms,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function sc(n,e,t,i,r,s,a){const o=Za.distanceSqToPoint(n);if(o<t){const l=new C;Za.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class tu extends jt{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let r=0;const s=i.length;let a;t?a=t:a=e*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=i[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===a)return r/(s-1);const u=i[r],f=i[r+1]-u,m=(a-u)/f;return(r+m)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),l=t||(a.isVector2?new ie:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new C,r=[],s=[],a=[],o=new C,l=new Mt;for(let m=0;m<=e;m++){const g=m/e;r[m]=this.getTangentAt(g,new C)}s[0]=new C,a[0]=new C;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),f=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),f<=c&&i.set(0,0,1),o.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let m=1;m<=e;m++){if(s[m]=s[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(r[m-1],r[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Pt(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(l.makeRotationAxis(o,g))}a[m].crossVectors(r[m],s[m])}if(t===!0){let m=Math.acos(Pt(s[0].dot(s[e]),-1,1));m/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(m=-m);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],m*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class _o extends Dn{constructor(e=0,t=0,i=1,r=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){const i=t||new ie,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),f=l-this.aX,m=c-this.aY;l=f*u-m*h+this.aX,c=f*h+m*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class wg extends _o{constructor(e,t,i,r,s,a){super(e,t,i,i,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function xo(){let n=0,e=0,t=0,i=0;function r(s,a,o,l){n=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,u,h){let f=(a-s)/c-(o-s)/(c+u)+(o-a)/u,m=(o-a)/u-(l-a)/(u+h)+(l-o)/h;f*=u,m*=u,r(a,o,f,m)},calc:function(s){const a=s*s,o=a*s;return n+e*s+t*a+i*o}}}const gs=new C,La=new xo,Da=new xo,Ua=new xo;class Rg extends Dn{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new C){const i=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,u;this.closed||o>0?c=r[(o-1)%s]:(gs.subVectors(r[0],r[1]).add(r[0]),c=gs);const h=r[o%s],f=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(gs.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=gs),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),m),v=Math.pow(h.distanceToSquared(f),m),p=Math.pow(f.distanceToSquared(u),m);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),La.initNonuniformCatmullRom(c.x,h.x,f.x,u.x,g,v,p),Da.initNonuniformCatmullRom(c.y,h.y,f.y,u.y,g,v,p),Ua.initNonuniformCatmullRom(c.z,h.z,f.z,u.z,g,v,p)}else this.curveType==="catmullrom"&&(La.initCatmullRom(c.x,h.x,f.x,u.x,this.tension),Da.initCatmullRom(c.y,h.y,f.y,u.y,this.tension),Ua.initCatmullRom(c.z,h.z,f.z,u.z,this.tension));return i.set(La.calc(l),Da.calc(l),Ua.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new C().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function ac(n,e,t,i,r){const s=(i-e)*.5,a=(r-t)*.5,o=n*n,l=n*o;return(2*t-2*i+s+a)*l+(-3*t+3*i-2*s-a)*o+s*n+t}function Cg(n,e){const t=1-n;return t*t*e}function Pg(n,e){return 2*(1-n)*n*e}function Lg(n,e){return n*n*e}function Ar(n,e,t,i){return Cg(n,e)+Pg(n,t)+Lg(n,i)}function Dg(n,e){const t=1-n;return t*t*t*e}function Ug(n,e){const t=1-n;return 3*t*t*n*e}function Ig(n,e){return 3*(1-n)*n*n*e}function Ng(n,e){return n*n*n*e}function wr(n,e,t,i,r){return Dg(n,e)+Ug(n,t)+Ig(n,i)+Ng(n,r)}class nu extends Dn{constructor(e=new ie,t=new ie,i=new ie,r=new ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new ie){const i=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(wr(e,r.x,s.x,a.x,o.x),wr(e,r.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Fg extends Dn{constructor(e=new C,t=new C,i=new C,r=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new C){const i=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(wr(e,r.x,s.x,a.x,o.x),wr(e,r.y,s.y,a.y,o.y),wr(e,r.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class iu extends Dn{constructor(e=new ie,t=new ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ie){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Og extends Dn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ru extends Dn{constructor(e=new ie,t=new ie,i=new ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new ie){const i=t,r=this.v0,s=this.v1,a=this.v2;return i.set(Ar(e,r.x,s.x,a.x),Ar(e,r.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class zg extends Dn{constructor(e=new C,t=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new C){const i=t,r=this.v0,s=this.v1,a=this.v2;return i.set(Ar(e,r.x,s.x,a.x),Ar(e,r.y,s.y,a.y),Ar(e,r.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class su extends Dn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ie){const i=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],u=r[a>r.length-2?r.length-1:a+1],h=r[a>r.length-3?r.length-1:a+2];return i.set(ac(o,l.x,c.x,u.x,h.x),ac(o,l.y,c.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new ie().fromArray(r))}return this}}var oc=Object.freeze({__proto__:null,ArcCurve:wg,CatmullRomCurve3:Rg,CubicBezierCurve:nu,CubicBezierCurve3:Fg,EllipseCurve:_o,LineCurve:iu,LineCurve3:Og,QuadraticBezierCurve:ru,QuadraticBezierCurve3:zg,SplineCurve:su});class Bg extends Dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new oc[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const a=r[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new oc[r.type]().fromJSON(r))}return this}}class lc extends Bg{constructor(e){super(),this.type="Path",this.currentPoint=new ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new iu(this.currentPoint.clone(),new ie(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new ru(this.currentPoint.clone(),new ie(e,t),new ie(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,a){const o=new nu(this.currentPoint.clone(),new ie(e,t),new ie(i,r),new ie(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new su(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,r,s,a),this}absarc(e,t,i,r,s,a){return this.absellipse(e,t,i,i,r,s,a),this}ellipse(e,t,i,r,s,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,r,s,a,o,l),this}absellipse(e,t,i,r,s,a,o,l){const c=new _o(e,t,i,r,s,a,o,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class au extends lc{constructor(e){super(e),this.uuid=Di(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new lc().fromJSON(r))}return this}}const kg={triangulate:function(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=ou(n,0,r,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,u,h,f,m;if(i&&(s=Xg(n,e,s,t)),n.length>80*t){o=c=n[0],l=u=n[1];for(let g=t;g<r;g+=t)h=n[g],f=n[g+1],h<o&&(o=h),f<l&&(l=f),h>c&&(c=h),f>u&&(u=f);m=Math.max(c-o,u-l),m=m!==0?32767/m:0}return Lr(s,a,t,o,l,m,0),a}};function ou(n,e,t,i,r){let s,a;if(r===nv(n,e,t,i)>0)for(s=e;s<t;s+=i)a=cc(s,n[s],n[s+1],a);else for(s=t-i;s>=e;s-=i)a=cc(s,n[s],n[s+1],a);return a&&$s(a,a.next)&&(Ur(a),a=a.next),a}function Pi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&($s(t,t.next)||ct(t.prev,t,t.next)===0)){if(Ur(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Lr(n,e,t,i,r,s,a){if(!n)return;!a&&s&&Zg(n,i,r,s);let o=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?Gg(n,i,r,s):Hg(n)){e.push(l.i/t|0),e.push(n.i/t|0),e.push(c.i/t|0),Ur(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=Vg(Pi(n),e,t),Lr(n,e,t,i,r,s,2)):a===2&&Wg(n,e,t,i,r,s):Lr(Pi(n),e,t,i,r,s,1);break}}}function Hg(n){const e=n.prev,t=n,i=n.next;if(ct(e,t,i)>=0)return!1;const r=e.x,s=t.x,a=i.x,o=e.y,l=t.y,c=i.y,u=r<s?r<a?r:a:s<a?s:a,h=o<l?o<c?o:c:l<c?l:c,f=r>s?r>a?r:a:s>a?s:a,m=o>l?o>c?o:c:l>c?l:c;let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=f&&g.y>=h&&g.y<=m&&Qi(r,o,s,l,a,c,g.x,g.y)&&ct(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Gg(n,e,t,i){const r=n.prev,s=n,a=n.next;if(ct(r,s,a)>=0)return!1;const o=r.x,l=s.x,c=a.x,u=r.y,h=s.y,f=a.y,m=o<l?o<c?o:c:l<c?l:c,g=u<h?u<f?u:f:h<f?h:f,v=o>l?o>c?o:c:l>c?l:c,p=u>h?u>f?u:f:h>f?h:f,d=Ja(m,g,e,t,i),E=Ja(v,p,e,t,i);let S=n.prevZ,T=n.nextZ;for(;S&&S.z>=d&&T&&T.z<=E;){if(S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==r&&S!==a&&Qi(o,u,l,h,c,f,S.x,S.y)&&ct(S.prev,S,S.next)>=0||(S=S.prevZ,T.x>=m&&T.x<=v&&T.y>=g&&T.y<=p&&T!==r&&T!==a&&Qi(o,u,l,h,c,f,T.x,T.y)&&ct(T.prev,T,T.next)>=0))return!1;T=T.nextZ}for(;S&&S.z>=d;){if(S.x>=m&&S.x<=v&&S.y>=g&&S.y<=p&&S!==r&&S!==a&&Qi(o,u,l,h,c,f,S.x,S.y)&&ct(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;T&&T.z<=E;){if(T.x>=m&&T.x<=v&&T.y>=g&&T.y<=p&&T!==r&&T!==a&&Qi(o,u,l,h,c,f,T.x,T.y)&&ct(T.prev,T,T.next)>=0)return!1;T=T.nextZ}return!0}function Vg(n,e,t){let i=n;do{const r=i.prev,s=i.next.next;!$s(r,s)&&lu(r,i,i.next,s)&&Dr(r,s)&&Dr(s,r)&&(e.push(r.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),Ur(i),Ur(i.next),i=n=s),i=i.next}while(i!==n);return Pi(i)}function Wg(n,e,t,i,r,s){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Qg(a,o)){let l=cu(a,o);a=Pi(a,a.next),l=Pi(l,l.next),Lr(a,e,t,i,r,s,0),Lr(l,e,t,i,r,s,0);return}o=o.next}a=a.next}while(a!==n)}function Xg(n,e,t,i){const r=[];let s,a,o,l,c;for(s=0,a=e.length;s<a;s++)o=e[s]*i,l=s<a-1?e[s+1]*i:n.length,c=ou(n,o,l,i,!1),c===c.next&&(c.steiner=!0),r.push(jg(c));for(r.sort(qg),s=0;s<r.length;s++)t=Yg(r[s],t);return t}function qg(n,e){return n.x-e.x}function Yg(n,e){const t=$g(n,e);if(!t)return e;const i=cu(t,n);return Pi(i,i.next),Pi(t,t.next)}function $g(n,e){let t=e,i=-1/0,r;const s=n.x,a=n.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const f=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=s&&f>i&&(i=f,r=t.x<t.next.x?t:t.next,f===s))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,l=r.x,c=r.y;let u=1/0,h;t=r;do s>=t.x&&t.x>=l&&s!==t.x&&Qi(a<c?s:i,a,l,c,a<c?i:s,a,t.x,t.y)&&(h=Math.abs(a-t.y)/(s-t.x),Dr(t,n)&&(h<u||h===u&&(t.x>r.x||t.x===r.x&&Kg(r,t)))&&(r=t,u=h)),t=t.next;while(t!==o);return r}function Kg(n,e){return ct(n.prev,n,e.prev)<0&&ct(e.next,n,n.next)<0}function Zg(n,e,t,i){let r=n;do r.z===0&&(r.z=Ja(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,Jg(r)}function Jg(n){let e,t,i,r,s,a,o,l,c=1;do{for(t=n,n=null,s=null,a=0;t;){for(a++,i=t,o=0,e=0;e<c&&(o++,i=i.nextZ,!!i);e++);for(l=c;o>0||l>0&&i;)o!==0&&(l===0||!i||t.z<=i.z)?(r=t,t=t.nextZ,o--):(r=i,i=i.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;t=i}s.nextZ=null,c*=2}while(a>1);return n}function Ja(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function jg(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Qi(n,e,t,i,r,s,a,o){return(r-a)*(e-o)>=(n-a)*(s-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(i-o)}function Qg(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!ev(n,e)&&(Dr(n,e)&&Dr(e,n)&&tv(n,e)&&(ct(n.prev,n,e.prev)||ct(n,e.prev,e))||$s(n,e)&&ct(n.prev,n,n.next)>0&&ct(e.prev,e,e.next)>0)}function ct(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function $s(n,e){return n.x===e.x&&n.y===e.y}function lu(n,e,t,i){const r=_s(ct(n,e,t)),s=_s(ct(n,e,i)),a=_s(ct(t,i,n)),o=_s(ct(t,i,e));return!!(r!==s&&a!==o||r===0&&vs(n,t,e)||s===0&&vs(n,i,e)||a===0&&vs(t,n,i)||o===0&&vs(t,e,i))}function vs(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function _s(n){return n>0?1:n<0?-1:0}function ev(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&lu(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Dr(n,e){return ct(n.prev,n,n.next)<0?ct(n,e,n.next)>=0&&ct(n,n.prev,e)>=0:ct(n,e,n.prev)<0||ct(n,n.next,e)<0}function tv(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function cu(n,e){const t=new ja(n.i,n.x,n.y),i=new ja(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function cc(n,e,t,i){const r=new ja(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Ur(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function ja(n,e,t){this.i=n,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function nv(n,e,t,i){let r=0;for(let s=e,a=t-i;s<t;s+=i)r+=(n[a]-n[s])*(n[s+1]+n[a+1]),a=s;return r}class Rr{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return Rr.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];uc(e),hc(i,e);let a=e.length;t.forEach(uc);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,hc(i,t[l]);const o=kg.triangulate(i,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function uc(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function hc(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class So extends mn{constructor(e=new au([new ie(0,.5),new ie(-.5,-.5),new ie(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],r=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new fn(r,3)),this.setAttribute("normal",new fn(s,3)),this.setAttribute("uv",new fn(a,2));function c(u){const h=r.length/3,f=u.extractPoints(t);let m=f.shape;const g=f.holes;Rr.isClockWise(m)===!1&&(m=m.reverse());for(let p=0,d=g.length;p<d;p++){const E=g[p];Rr.isClockWise(E)===!0&&(g[p]=E.reverse())}const v=Rr.triangulateShape(m,g);for(let p=0,d=g.length;p<d;p++){const E=g[p];m=m.concat(E)}for(let p=0,d=m.length;p<d;p++){const E=m[p];r.push(E.x,E.y,0),s.push(0,0,1),a.push(E.x,E.y)}for(let p=0,d=v.length;p<d;p++){const E=v[p],S=E[0]+h,T=E[1]+h,D=E[2]+h;i.push(S,T,D),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return iv(t,e)}static fromJSON(e,t){const i=[];for(let r=0,s=e.shapes.length;r<s;r++){const a=t[e.shapes[r]];i.push(a)}return new So(i,e.curveSegments)}}function iv(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const r=n[t];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e}class rv{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=fc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=fc();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function fc(){return(typeof performance>"u"?Date:performance).now()}class sv{constructor(e,t,i=0,r=1/0){this.ray=new fo(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new po,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,i=[]){return Qa(e,this,i,t),i.sort(dc),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Qa(e[r],this,i,t);return i.sort(dc),i}}function dc(n,e){return n.distance-e.distance}function Qa(n,e,t,i){if(n.layers.test(e.layers)&&n.raycast(e,t),i===!0){const r=n.children;for(let s=0,a=r.length;s<a;s++)Qa(r[s],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:lo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=lo);const uu={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Br{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const av=new qs(-1,1,1,-1,0,1);class ov extends mn{constructor(){super(),this.setAttribute("position",new fn([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new fn([0,2,0,0,2,0],2))}}const lv=new ov;class hu{constructor(e){this._mesh=new St(lv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,av)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class fu extends Br{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof ft?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ds.clone(e.uniforms),this.material=new ft({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new hu(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class pc extends Br{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),s.buffers.stencil.setClear(o),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class cv extends Br{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class uv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new ie);this._width=i.width,this._height=i.height,t=new Qt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:hn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new fu(uu),this.copyPass.material.blending=Gn,this.clock=new rv}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let r=0,s=this.passes.length;r<s;r++){const a=this.passes[r];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),a.needsSwap){if(i){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}pc!==void 0&&(a instanceof pc?i=!0:a instanceof cv&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new ie);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class hv extends Br{constructor(e,t,i=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new _e}render(e,t,i){const r=e.autoClear;e.autoClear=!1;let s,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}}const fv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new _e(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class lr extends Br{constructor(e,t,i,r){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new ie(e.x,e.y):new ie(256,256),this.clearColor=new _e(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Qt(s,a,{type:hn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const f=new Qt(s,a,{type:hn});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const m=new Qt(s,a,{type:hn});m.texture.name="UnrealBloomPass.v"+h,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),s=Math.round(s/2),a=Math.round(a/2)}const o=fv;this.highPassUniforms=Ds.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ft({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];s=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new ie(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const u=uu;this.copyUniforms=Ds.clone(u.uniforms),this.blendMaterial=new ft({uniforms:this.copyUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,blending:Ci,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new _e,this.oldClearAlpha=1,this.basic=new mo,this.fsQuad=new hu(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(i,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,r),this.renderTargetsVertical[s].setSize(i,r),this.separableBlurMaterials[s].uniforms.invSize.value=new ie(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,t,i,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=lr.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=lr.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new ft({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new ie(.5,.5)},direction:{value:new ie(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new ft({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}lr.BlurDirectionX=new ie(1,0);lr.BlurDirectionY=new ie(0,1);const Ks="Cosmos",Mo="Series I",yi=11,Ri={common:{label:"Common",glyph:"●",rank:0},uncommon:{label:"Uncommon",glyph:"◆",rank:1},rare:{label:"Rare",glyph:"★",rank:2},holo:{label:"Holo Rare",glyph:"✦",rank:3}},du=[{id:"nebula",no:1,name:"Stellar Nursery",type:"Emission Nebula",cf:"cf. M42, Orion",rarity:"common",accent:"#ff5d8f",stats:[["Distance","1,344 ly"],["Span","24 ly"],["Newborn stars","~2,800"]],flavor:"Where gas and gravity braid new suns out of the dark."},{id:"pulsar",no:2,name:"Pulsar",type:"Neutron Star",cf:"cf. Crab Pulsar",rarity:"rare",accent:"#7fc8ff",stats:[["Distance","6,500 ly"],["Spin","30 turns / s"],["Diameter","~20 km"]],flavor:"A dead star’s heart, still ticking thirty times a second."},{id:"ringed",no:3,name:"Ringed Giant",type:"Gas Giant",cf:"cf. Saturn",rarity:"uncommon",accent:"#f0c27a",stats:[["Light-time","~80 min"],["Ring span","280,000 km"],["Ring depth","~10 m"]],flavor:"Ice ground to glitter, laid in a ring a few metres thick."},{id:"supernova",no:4,name:"Supernova",type:"Stellar Explosion",cf:"cf. SN 1054",rarity:"rare",accent:"#ff9a4d",stats:[["Seen by day","23 days"],["Debris speed","1,500 km/s"],["Leaves behind","a pulsar"]],flavor:"Song astronomers logged a guest star bright enough to see by day."},{id:"galaxy",no:5,name:"Spiral Galaxy",type:"Grand-Design Spiral",cf:"cf. M51, Whirlpool",rarity:"uncommon",accent:"#9fb6ff",stats:[["Distance","31 million ly"],["Diameter","76,000 ly"],["Companion","NGC 5195"]],flavor:"Two arms, one embrace — a neighbour’s pull winds the whirl tight."},{id:"comet",no:6,name:"Comet",type:"Icy Wanderer",cf:"cf. Hale–Bopp",rarity:"common",accent:"#6ff2c0",stats:[["Nucleus","~60 km"],["Orbit","~2,500 yr"],["Naked-eye","18 months"]],flavor:"A snowball older than the Earth, unravelling into two tails."},{id:"binary",no:7,name:"Binary Star",type:"Mass-Transfer Pair",cf:"cf. Beta Lyrae",rarity:"uncommon",accent:"#ff8a5c",stats:[["Distance","~960 ly"],["Orbit","12.9 days"],["Stars","2, sharing"]],flavor:"One star pours itself across the gap, and the other drinks."},{id:"planetary",no:8,name:"Planetary Nebula",type:"Dying Star’s Shell",cf:"cf. M57, Ring",rarity:"rare",accent:"#54d6ff",stats:[["Distance","~2,500 ly"],["Diameter","~1 ly"],["Ember","125,000 K"]],flavor:"The Sun’s own future: a cast-off shell round a white-hot ember."},{id:"cluster",no:9,name:"Star Cluster",type:"Open Cluster",cf:"cf. Pleiades, M45",rarity:"common",accent:"#8fb4ff",stats:[["Distance","444 ly"],["Age","~100 million yr"],["Members","1,000+"]],flavor:"Seven sisters to the eye; a thousand siblings to the telescope."},{id:"quasar",no:10,name:"Quasar",type:"Active Galactic Nucleus",cf:"cf. 3C 273",rarity:"rare",accent:"#c58bff",stats:[["Distance","2.4 billion ly"],["Output","4 trillion Suns"],["Jet length","~200,000 ly"]],flavor:"A galaxy’s core outshining the galaxy: a black hole at supper."},{id:"blackhole",no:11,name:"Black Hole",type:"Event Horizon",cf:"Holographic chase card",rarity:"holo",accent:"#ffcf7a",fullArt:!0,stats:[["Escape speed","> light"],["Photon sphere","1.5 r_s"],["Last stable orbit","3 r_s"]],flavor:"Not a thing but a place, where every path leads inward — even light’s."}],dv=Object.fromEntries(du.map(n=>[n.id,n])),pu=dv.blackhole,pv=du.filter(n=>n!==pu),yo=8;function mv(n=Math.random){const e=pv.slice();for(let r=e.length-1;r>0;r--){const s=Math.floor(n()*(r+1));[e[r],e[s]]=[e[s],e[r]]}const t=e.slice(0,yo-1);t.sort((r,s)=>Ri[r.rarity].rank-Ri[s.rarity].rank||n()-.5);const i=t.map(r=>({def:r,seed:n(),print:1+Math.floor(n()*999),foil:Ri[r.rarity].rank>=2?n()<.45:n()<.12}));return i.push({def:pu,seed:.5,print:1+Math.floor(n()*250),foil:!0}),i}const Ee=1e3,Ke=1400,mu=1.024,gu=.5,vu={x:44,y:136,w:912,h:730},gv={x:0,y:0,w:Ee,h:Ke},Rt='Jost, "Futura", "Century Gothic", "Avenir Next", sans-serif',Us='"Cormorant Garamond", Garamond, "Times New Roman", serif',vv={silver:["#80869a","#eef1f8","#979eb1","#ffffff","#737a8d"],gold:["#94702f","#fbe3a2","#b38c3b","#fff4cf","#7f6026"],chrome:["#1d1b2a","#8c88b0","#2c2940","#cdc7f0","#18161f"]};function To(n){return n==="rare"?"gold":n==="holo"?"chrome":"silver"}function Is(n){const e=document.createElement("canvas");e.width=Math.round(Ee*n),e.height=Math.round(Ke*n);const t=e.getContext("2d");return t.scale(n,n),{c:e,ctx:t}}function pt(n,e,t,i,r,s){n.beginPath(),n.moveTo(e+s,t),n.arcTo(e+i,t,e+i,t+r,s),n.arcTo(e+i,t+r,e,t+r,s),n.arcTo(e,t+r,e,t,s),n.arcTo(e,t,e+i,t,s),n.closePath()}function eo(n){const e=parseInt(n.slice(1),16);return[e>>16&255,e>>8&255,e&255]}function Ia(n,e,t){const i=eo(n),r=eo(e);return`rgb(${i.map((s,a)=>Math.round(s+(r[a]-s)*t)).join(",")})`}function ii(n,e){return`rgba(${eo(n).join(",")},${e})`}function _u(n,e,t,i,r,s){const a=n.createLinearGradient(t,i,r,s),o=vv[e];return o.forEach((l,c)=>a.addColorStop(c/(o.length-1),l)),a}function Yt(n,e,t,i,r,s="left"){const a=[...e],o=a.map(h=>n.measureText(h).width),l=o.reduce((h,f)=>h+f,0)+r*(a.length-1);let c=s==="center"?t-l/2:s==="right"?t-l:t;const u=n.textAlign;return n.textAlign="left",a.forEach((h,f)=>{n.fillText(h,c,i),c+=o[f]+r}),n.textAlign=u,l}function _v(n,e,t){const i=[...e];return i.reduce((r,s)=>r+n.measureText(s).width,0)+t*(i.length-1)}function xu(n,e,t,i,r,s="right"){const a=e.split(/_(\w)/),o=a.map((f,m)=>m%2?`500 ${r*.62}px ${Rt}`:`500 ${r}px ${Rt}`),l=a.map((f,m)=>(n.font=o[m],n.measureText(f).width)),c=l.reduce((f,m)=>f+m,0);let u=s==="right"?t-c:s==="center"?t-c/2:t;const h=n.textAlign;return n.textAlign="left",a.forEach((f,m)=>{n.font=o[m],n.fillText(f,u,i+(m%2?r*.22:0)),u+=l[m]}),n.textAlign=h,c}function Su(n,e,t){const i=Na(n,e,t);if(i.length<2)return i;let r=t/2,s=t;for(;s-r>4;){const a=(r+s)/2;Na(n,e,a).length>i.length?r=a:s=a}return Na(n,e,s)}function Na(n,e,t){const i=e.split(" "),r=[];let s="";for(const a of i){const o=s?`${s} ${a}`:a;n.measureText(o).width>t&&s?(r.push(s),s=a):s=o}return s&&r.push(s),r}function Mu(n){let e=Math.floor(n*2147483648)||1;return()=>(e^=e<<13,e^=e>>>17,e^=e<<5,(e>>>0)%1e5/1e5)}function Ns(n,e,t,i,r,s,a,o,l,c=1){n.save(),n.strokeStyle=o,n.globalAlpha=l,n.lineWidth=c;for(let u=0;u<s;u++){const h=i+(r-i)*u/Math.max(s-1,1),f=5+5*Math.sin(u*.7);n.beginPath();for(let m=0;m<=360;m++){const g=m/360*Math.PI*2,v=h+f*Math.sin(a*g+u*.42),p=e+Math.cos(g)*v,d=t+Math.sin(g)*v;m?n.lineTo(p,d):n.moveTo(p,d)}n.stroke()}n.restore()}function yu(n,e,t,i,r,s,a,o){n.save();for(let l=0;l<t;l++){const c=o*(.25+e()*.75);n.fillStyle=`rgba(235,235,255,${c})`,n.beginPath(),n.arc(i+e()*s,r+e()*a,.5+e()*e()*1.8,0,Math.PI*2),n.fill()}n.restore()}function Eo(n,e,t){const{ctx:i}=n;pt(i,0,0,Ee,Ke,46),i.fillStyle=_u(i,t,0,0,Ee,Ke),i.fill(),pt(i,3,3,Ee-6,Ke-6,43),i.lineWidth=2,i.strokeStyle="rgba(255,255,255,.55)",i.stroke(),pt(i,18,18,Ee-36,Ke-36,30),i.lineWidth=3,i.strokeStyle="rgba(0,0,0,.5)",i.stroke(),e.ctx.save(),pt(e.ctx,0,0,Ee,Ke,46),e.ctx.fillStyle="#f00",e.ctx.fill(),pt(e.ctx,20,20,Ee-40,Ke-40,30),e.ctx.fillStyle="#000",e.ctx.fill(),e.ctx.restore()}function Tu(n,e,t,i,r=1340){const s=Ri[e.rarity];n.font=`500 21px ${Rt}`,n.fillStyle=i==="gold"?"#f3d896":i==="chrome"?"#e9e4ff":"#d9dce6";let a=`${s.glyph}  ${s.label.toUpperCase()}`;t.foil&&e.rarity!=="holo"&&(a+="  ·  STARLIGHT"),Yt(n,a,66,r,3.5),t.foil&&e.rarity!=="holo"||(n.font=`500 18px ${Rt}`,n.fillStyle="#8f8baa",Yt(n,`${Ks.toUpperCase()}  ·  ${Mo.toUpperCase()}`,Ee/2,r,6,"center")),n.font=`500 21px ${Rt}`,n.fillStyle="#bdb9d6",Yt(n,`${String(e.no).padStart(2,"0")} / ${yi}`,Ee-66,r,2.5,"right")}function Eu(n,e,t,i,{x:r,y:s,size:a,maxW:o,tracking:l}){const c=t.name.toUpperCase();let u=a;for(n.ctx.font=`600 ${u}px ${Rt}`;_v(n.ctx,c,l)>o&&u>20;)u-=2,n.ctx.font=`600 ${u}px ${Rt}`;n.ctx.fillStyle=i==="gold"?"#f6dd9e":i==="chrome"?"#f3f0ff":"#f2f3f8",n.ctx.save(),n.ctx.shadowColor="rgba(0,0,0,.6)",n.ctx.shadowBlur=8,n.ctx.shadowOffsetY=2,Yt(n.ctx,c,r,s,l),n.ctx.restore(),e.ctx.font=`600 ${u}px ${Rt}`,e.ctx.fillStyle="#0f0",Yt(e.ctx,c,r,s,l)}function xv(n,e,t,i){const{ctx:r}=n,s=To(t.rarity),a=Mu(i.seed+t.no*.0137);Eo(n,e,s),r.save(),pt(r,20,20,Ee-40,Ke-40,30),r.clip();const o=r.createLinearGradient(0,20,0,Ke);o.addColorStop(0,Ia(t.accent,"#0c0b1a",.8)),o.addColorStop(.45,Ia(t.accent,"#0a0916",.9)),o.addColorStop(1,"#06050d"),r.fillStyle=o,r.fillRect(0,0,Ee,Ke),Ns(r,Ee/2,1160,90,520,34,9,t.accent,.07),Ns(r,Ee/2,60,40,300,16,12,t.accent,.05),yu(r,a,420,20,20,Ee-40,Ke-40,.35),r.restore(),Eu(n,e,t,s,{x:60,y:108,size:50,maxW:740,tracking:5}),r.font=`500 25px ${Rt}`,r.fillStyle=ii(t.accent,.95),Yt(r,`Nº ${String(t.no).padStart(2,"0")}`,Ee-60,104,3,"right");const l=vu;r.save(),r.globalCompositeOperation="destination-out",pt(r,l.x,l.y,l.w,l.h,16),r.fill(),r.restore(),r.save(),pt(r,l.x,l.y,l.w,l.h,16),r.clip(),r.shadowColor="rgba(0,0,0,.85)",r.shadowBlur=26,pt(r,l.x-40,l.y-40,l.w+80,l.h+80,30),pt(r,l.x-1,l.y-1,l.w+2,l.h+2,16),r.lineWidth=40,r.strokeStyle="rgba(0,0,0,.6)",r.stroke(),r.restore(),pt(r,l.x-2,l.y-2,l.w+4,l.h+4,18),r.lineWidth=3,r.strokeStyle=_u(r,s,l.x,l.y,l.x+l.w,l.y+l.h),r.stroke(),pt(e.ctx,l.x-3,l.y-3,l.w+6,l.h+6,18),e.ctx.lineWidth=5,e.ctx.strokeStyle="#0f0",e.ctx.stroke(),i.foil&&(pt(e.ctx,l.x,l.y,l.w,l.h,16),e.ctx.fillStyle="#00f",e.ctx.fill()),r.font=`500 23px ${Rt}`,r.fillStyle=Ia(t.accent,"#ffffff",.35),Yt(r,t.type.toUpperCase(),60,912,5),r.font=`italic 500 30px ${Us}`,r.fillStyle="#b9b5d2",r.textAlign="right",r.fillText(t.cf,Ee-60,912),r.textAlign="left";const c=u=>{const h=r.createLinearGradient(60,0,Ee-60,0);h.addColorStop(0,ii(t.accent,0)),h.addColorStop(.5,ii(t.accent,.7)),h.addColorStop(1,ii(t.accent,0)),r.fillStyle=h,r.fillRect(60,u,Ee-120,1.5)};c(940),t.stats.forEach(([u,h],f)=>{const m=1e3+f*60;r.save(),r.translate(68,m-9),r.rotate(Math.PI/4),r.fillStyle=t.accent,r.fillRect(-5,-5,10,10),r.restore(),r.font=`400 23px ${Rt}`,r.fillStyle="#a19dbc";const g=Yt(r,u.toUpperCase(),90,m,3);r.fillStyle="#f6f4ff";const v=xu(r,h,Ee-64,m+1,32);r.fillStyle="rgba(200,196,230,.32)";for(let p=90+g+18;p<Ee-64-v-18;p+=10)r.beginPath(),r.arc(p,m-7,1.4,0,Math.PI*2),r.fill()}),c(1165),r.font=`italic 500 33px ${Us}`,r.fillStyle="#d4cfee",r.textAlign="center",Su(r,t.flavor,800).forEach((u,h)=>r.fillText(u,Ee/2,1222+h*42)),r.textAlign="left",Tu(r,t,i,s)}function Sv(n,e,t,i){const{ctx:r}=n,s=To(t.rarity);Eo(n,e,s),r.save(),r.globalCompositeOperation="destination-out",pt(r,20,20,Ee-40,Ke-40,30),r.fill(),r.restore(),r.save(),pt(r,20,20,Ee-40,Ke-40,30),r.clip();let a=r.createLinearGradient(0,20,0,260);a.addColorStop(0,"rgba(3,2,9,.72)"),a.addColorStop(1,"rgba(3,2,9,0)"),r.fillStyle=a,r.fillRect(0,0,Ee,260),a=r.createLinearGradient(0,880,0,Ke),a.addColorStop(0,"rgba(3,2,9,0)"),a.addColorStop(.32,"rgba(3,2,9,.8)"),a.addColorStop(1,"rgba(3,2,9,.92)"),r.fillStyle=a,r.fillRect(0,880,Ee,Ke-880),r.restore(),pt(r,34,34,Ee-68,Ke-68,22),r.lineWidth=1.5,r.strokeStyle="rgba(255,226,170,.5)",r.stroke(),pt(e.ctx,34,34,Ee-68,Ke-68,22),e.ctx.lineWidth=3,e.ctx.strokeStyle="#0f0",e.ctx.stroke(),Eu(n,e,t,s,{x:66,y:118,size:66,maxW:700,tracking:11}),r.font=`500 22px ${Rt}`,r.fillStyle=t.accent,Yt(r,t.type.toUpperCase(),68,160,9),e.ctx.font=`500 22px ${Rt}`,e.ctx.fillStyle="#0f0",Yt(e.ctx,t.type.toUpperCase(),68,160,9),r.font=`500 25px ${Rt}`,r.fillStyle=ii(t.accent,.95),Yt(r,`Nº ${String(t.no).padStart(2,"0")}`,Ee-66,112,3,"right");const o=[Ee/6,Ee/2,Ee*5/6];t.stats.forEach(([u,h],f)=>{r.font=`400 19px ${Rt}`,r.fillStyle="#aaa6c6",Yt(r,u.toUpperCase(),o[f],1086,2.5,"center"),r.fillStyle="#fbf8ff",xu(r,h,o[f],1130,31,"center"),f&&(r.fillStyle="rgba(255,220,160,.35)",r.fillRect((o[f-1]+o[f])/2,1060,1.5,84))});const l=r.createLinearGradient(60,0,Ee-60,0);l.addColorStop(0,ii(t.accent,0)),l.addColorStop(.5,ii(t.accent,.75)),l.addColorStop(1,ii(t.accent,0)),r.fillStyle=l,r.fillRect(60,1170,Ee-120,1.5),r.font=`italic 500 32px ${Us}`,r.fillStyle="#e1dcf6",r.textAlign="center",Su(r,t.flavor,780).forEach((u,h)=>r.fillText(u,Ee/2,1222+h*40)),r.textAlign="left",Tu(r,t,i,s),e.ctx.save(),e.ctx.globalCompositeOperation="lighter",pt(e.ctx,0,0,Ee,Ke,46);const c=e.ctx.createLinearGradient(0,900,0,1100);c.addColorStop(0,"rgb(0,0,255)"),c.addColorStop(1,"rgb(0,0,110)"),e.ctx.fillStyle=c,e.ctx.fill(),e.ctx.restore()}function Fs(n,e){const t=new tu(n);return t.anisotropy=e.capabilities.getMaxAnisotropy(),t.minFilter=li,t.generateMipmaps=!0,t}function Mv(n,e){const t=Is(mu),i=Is(gu);i.ctx.fillStyle="#000",i.ctx.fillRect(0,0,Ee,Ke),n.def.fullArt?Sv(t,i,n.def,n):xv(t,i,n.def,n);const r=n.def.fullArt?gv:vu,s=new wt(r.x/Ee,1-(r.y+r.h)/Ke,(r.x+r.w)/Ee,1-r.y/Ke);return{frame:Fs(t.c,e),mask:Fs(i.c,e),artRect:s,canvas:t.c}}let xs=null;function yv(n){if(xs)return xs;const e=Is(mu),t=Is(gu),{ctx:i}=e;t.ctx.fillStyle="#000",t.ctx.fillRect(0,0,Ee,Ke),Eo(e,t,"gold"),i.save(),pt(i,20,20,Ee-40,Ke-40,30),i.clip();const r=i.createRadialGradient(Ee/2,Ke/2,40,Ee/2,Ke/2,820);r.addColorStop(0,"#2a1d63"),r.addColorStop(.45,"#130f33"),r.addColorStop(1,"#05040c"),i.fillStyle=r,i.fillRect(0,0,Ee,Ke),yu(i,Mu(.31),900,20,20,Ee-40,Ke-40,.55),i.restore();const s=Ee/2,a=640,o=c=>{c(i,"#f1d38f"),c(t.ctx,"#0f0")};o((c,u)=>Ns(c,s,a,210,430,26,11,u,c===i?.32:.8,1.2)),o((c,u)=>Ns(c,s,a,440,470,3,22,u,c===i?.5:1,1.4)),i.save();const l=i.createRadialGradient(s,a,90,s,a,230);return l.addColorStop(0,"rgba(255,190,110,.55)"),l.addColorStop(.35,"rgba(255,140,80,.18)"),l.addColorStop(1,"rgba(255,140,80,0)"),i.fillStyle=l,i.fillRect(s-240,a-240,480,480),i.restore(),i.save(),i.shadowColor="rgba(255,170,90,.95)",i.shadowBlur=34,i.strokeStyle="#f6d28c",i.lineWidth=16,i.beginPath(),i.arc(s,a,116,0,Math.PI*2),i.stroke(),i.restore(),o((c,u)=>{c.save(),c.strokeStyle=u,c.lineWidth=2,c.beginPath(),c.arc(s,a,134,Math.PI*1.05,Math.PI*1.95),c.stroke(),c.lineWidth=6,c.beginPath(),c.ellipse(s,a,260,30,-.1,Math.PI+.05,Math.PI*2-.05),c.stroke(),c.restore()}),i.beginPath(),i.arc(s,a,100,0,Math.PI*2),i.fillStyle="#020104",i.fill(),o((c,u)=>{c.save(),c.strokeStyle=u,c.lineWidth=2.5,c.beginPath(),c.arc(s,a,101,0,Math.PI*2),c.stroke(),c.lineWidth=9,c.shadowColor=c===i?"rgba(255,170,90,.9)":"transparent",c.shadowBlur=c===i?20:0,c.beginPath(),c.ellipse(s,a,260,30,-.1,.05,Math.PI-.05),c.stroke(),c.restore()}),o((c,u)=>{c.fillStyle=u,c.font=`600 86px ${Rt}`,Yt(c,Ks.toUpperCase(),s+12,1140,30,"center"),c.font=`500 22px ${Rt}`,Yt(c,"CELESTIAL  TRADING  CARDS",s,1196,9,"center"),c.font=`500 30px ${Rt}`,Yt(c,"✦",s,210,0,"center")}),i.font=`italic 500 30px ${Us}`,i.fillStyle="#cdbf9c",i.textAlign="center",i.fillText(Mo,s,1250),i.textAlign="left",o((c,u)=>{c.save(),c.strokeStyle=u,c.lineWidth=2,pt(c,44,44,Ee-88,Ke-88,20),c.stroke(),c.lineWidth=1,pt(c,56,56,Ee-112,Ke-112,14),c.stroke(),c.restore()}),xs={frame:Fs(e.c,n),mask:Fs(t.c,n)},xs}const Tv=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Ev=`
precision highp float;
uniform float uTime;
uniform float uSeed;
uniform vec2 uRes;
uniform vec2 uTilt;
varying vec2 vUv;

#define PI 3.14159265359
#define TAU 6.28318530718

float sq(float x) { return x * x; }
float hash11(float p) { p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 hash33(vec3 p3) { p3 = fract(p3 * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
float hash13(vec3 p3) { p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }

// Quintic gradient noise, roughly -0.7..0.7.
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  vec2 ga = hash22(i) * 2. - 1.;
  vec2 gb = hash22(i + vec2(1, 0)) * 2. - 1.;
  vec2 gc = hash22(i + vec2(0, 1)) * 2. - 1.;
  vec2 gd = hash22(i + vec2(1, 1)) * 2. - 1.;
  return mix(mix(dot(ga, f), dot(gb, f - vec2(1, 0)), u.x),
             mix(dot(gc, f - vec2(0, 1)), dot(gd, f - vec2(1, 1)), u.x), u.y);
}

float gnoise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  #define G3(o) dot(hash33(i + o) * 2. - 1., f - o)
  float n = mix(mix(mix(G3(vec3(0, 0, 0)), G3(vec3(1, 0, 0)), u.x),
                    mix(G3(vec3(0, 1, 0)), G3(vec3(1, 1, 0)), u.x), u.y),
                mix(mix(G3(vec3(0, 0, 1)), G3(vec3(1, 0, 1)), u.x),
                    mix(G3(vec3(0, 1, 1)), G3(vec3(1, 1, 1)), u.x), u.y), u.z);
  #undef G3
  return n;
}

const mat2 ROT_OCT = mat2(1.6, 1.2, -1.2, 1.6);

// fbm in 0..1
float fbm(vec2 p) {
  float s = 0., a = .5;
  for (int i = 0; i < 6; i++) { s += a * gnoise(p); p = ROT_OCT * p + 17.1; a *= .5; }
  return clamp(.5 + .75 * s, 0., 1.);
}
float fbm4(vec2 p) {
  float s = 0., a = .5;
  for (int i = 0; i < 4; i++) { s += a * gnoise(p); p = ROT_OCT * p + 17.1; a *= .5; }
  return clamp(.5 + .75 * s, 0., 1.);
}
float fbm3(vec3 p) {
  float s = 0., a = .5;
  for (int i = 0; i < 5; i++) { s += a * gnoise3(p); p = p * 2.03 + 11.7; a *= .5; }
  return clamp(.5 + .75 * s, 0., 1.);
}
// Sharp creases where the noise crosses zero: filaments, veins, shock fronts.
float ridged(vec2 p) {
  float s = 0., a = .5, w = 1.;
  for (int i = 0; i < 5; i++) {
    float n = 1. - abs(gnoise(p) * 1.6);
    n *= n * w;
    w = clamp(n * 1.5, 0., 1.);
    s += a * n;
    p = ROT_OCT * p + 9.3;
    a *= .5;
  }
  return s;
}

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

// Centre-origin, height-normalised coordinates: y runs -0.5..0.5.
vec2 P(vec2 uv) { return (uv - .5) * vec2(uRes.x / uRes.y, 1.); }
float pxSize() { return 1. / uRes.y; }

vec3 tonemap(vec3 c) { return 1. - exp(-max(c, 0.)); }
// Tone-map but let the brightest light through above 1, where the bloom finds it.
vec3 toneHDR(vec3 c) { return tonemap(c) + min(max(c - 1.6, 0.) * .3, vec3(.5)); }

vec3 hueShift(vec3 c, float a) {
  const vec3 k = vec3(.57735);
  float ca = cos(a);
  return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1. - ca);
}

vec3 spectrum(float t) { return .5 + .5 * cos(TAU * (t + vec3(0., .33, .67))); }

// Rough star colour from a 0 (cool red) .. 1 (hot blue) temperature.
vec3 starTint(float t) {
  return mix(mix(vec3(1., .62, .38), vec3(1., .93, .82), smoothstep(0., .45, t)),
             vec3(.72, .82, 1.), smoothstep(.45, 1., t));
}

// Jittered-grid star field. p in P() units, cell = grid spacing, a few bright
// stars get a soft halo. Pixel-accurate cores so it stays crisp at any size.
vec3 stars(vec2 p, float cell, float seed, float gain) {
  vec2 g = p / cell;
  vec2 id = floor(g);
  vec3 col = vec3(0);
  float px = pxSize();
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = id + vec2(i, j);
    vec2 h = hash22(c + seed * 17.31);
    float m = hash12(c * 1.37 + seed * 3.17 + 11.7);
    vec2 d = p - (c + .1 + .8 * h) * cell;
    float mag = pow(max(m, 0.), 24.);
    float r = length(d);
    float rad = px * (.6 + 1.3 * mag);
    float core = exp(-r * r / (rad * rad));
    // the halo has to die inside the 3x3 neighbourhood or it clips to a square
    float halo = exp(-r / (px * (1.2 + 5. * mag))) * mag * smoothstep(cell * 1.1, cell * .2, r);
    float tw = .78 + .22 * sin(uTime * (.6 + 2.4 * h.x) + h.y * TAU);
    col += starTint(hash12(c + 5.5)) * (core * (.14 + 2.4 * mag) + halo * .6) * tw;
  }
  return col * gain;
}

// A hero star: hot core, glow and four diffraction spikes. s ~ apparent size.
vec3 flare(vec2 d, float s, vec3 tint) {
  float r = length(d);
  float core = exp(-r * r / (s * s * .0005));
  float glow = exp(-r / (s * .03)) * .7 + s * .0035 / (r + s * .012);
  float w = max(s * .0016, pxSize() * .7);
  float sx = exp(-abs(d.y) / w) * exp(-abs(d.x) / (s * .1));
  float sy = exp(-abs(d.x) / w) * exp(-abs(d.y) / (s * .1));
  return tint * (glow * .7 + (sx + sy) * .9) + vec3(core) * 2.4;
}
`;function bv(n){return`${Ev}
${n}
void main() {
  vec3 c = art(vUv);
  // never let a stray NaN/Inf into the bloom chain, where it smears into a white-out
  if (!(c.r < 1e4 && c.g < 1e4 && c.b < 1e4)) c = vec3(0.);
  gl_FragColor = vec4(clamp(c, 0., 64.), 1.0);
}
`}const Av=`
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  p += uTilt * .015;
  float t = uTime * .012;
  vec2 o = vec2(uSeed * 37.1, uSeed * 13.7);
  vec2 q = vec2(fbm4(p * 1.5 + o), fbm4(p * 1.5 + o + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm4(p * 1.9 + 2.4 * q + vec2(1.7, 9.2) + t),
                fbm4(p * 1.9 + 2.4 * q + vec2(8.3, 2.8) - t));
  float n = fbm(p * 2.1 + 2.8 * r + o);

  vec2 c = vec2(.14, .03) + (hash22(o) - .5) * .1;
  float cav = length((p - c) * vec2(1., 1.25));
  float inner = smoothstep(.42, .04, cav);
  float env = smoothstep(.95, .12, length((p - c * .5) * vec2(.72, 1.)));

  vec3 ha = vec3(1., .2, .42);
  vec3 o3 = vec3(.12, .78, .9);
  vec3 gold = vec3(1., .72, .38);

  vec3 col = vec3(.008, .008, .026);
  float gas = smoothstep(.32, .95, n);
  col += ha * pow(max(gas, 0.), 1.7) * (.35 + .9 * r.x) * env * 1.7;
  col += vec3(.45, .2, .95) * pow(max(r.y, 0.), 4.) * env * .55;
  col += o3 * sq(gas * r.y * 1.35) * 3.2 * inner;
  col += gold * sq(max(n - .5, 0.) * 2.2) * 2.2 * inner;
  col += vec3(.9, .95, 1.) * exp(-cav * cav * 45.) * .55;

  // dust: dark pillars, with a hot rim where the light from the core eats them
  float d = fbm(p * 2.7 + q * 1.7 + 20.);
  float dust = smoothstep(.5, .7, d) * (1. - inner * .5);
  float rim = smoothstep(.45, .5, d) - smoothstep(.5, .56, d);
  col *= 1. - .94 * dust;
  col += vec3(1., .55, .45) * rim * (.3 + 1.4 * inner) * env;

  col = hueShift(col, (uSeed - .5) * 1.4);
  col = toneHDR(col * 1.3);

  col += stars(p, .026, uSeed, 1.) * (1. - dust * .9);
  col += stars(p, .07, uSeed + 3., .9) * (1. - dust * .7);
  for (int i = 0; i < 4; i++) {
    vec2 sp = c + (hash22(vec2(float(i), uSeed * 9.)) - .5) * vec2(.1, .07);
    col += flare(p - sp, .3 + .3 * hash11(float(i) + uSeed), vec3(.75, .88, 1.)) * .8;
  }
  return col;
}
`,wv=`
vec3 art(vec2 uv) {
  vec2 p = P(uv) - vec2(-.02, .0);
  float t = uTime;
  float r = length(p);

  // the nebula it's blowing
  vec2 w = p * rot(.4 + uSeed);
  float n = fbm(w * 2.4 + uSeed * 10.);
  float fil = ridged(w * 3.2 + n * 1.6 + uSeed * 5.);
  float env = exp(-dot(w * vec2(.8, 1.2), w * vec2(.8, 1.2)) * 4.);
  vec3 col = vec3(.008, .012, .032);
  col += vec3(.22, .34, 1.) * pow(max(n, 0.), 2.2) * env * 1.3;
  col += vec3(1., .42, .3) * pow(max(fil, 0.), 5.) * env * .9;
  col += vec3(.45, .25, .9) * pow(max(fil, 0.), 3.) * env * .25;
  col = hueShift(col, (uSeed - .5) * 1.2);

  // spin axis tipped toward us; magnetic axis precesses round it
  float incl = .62;
  float ph = t * 1.15;
  vec3 m = vec3(sin(incl) * cos(ph), cos(incl), sin(incl) * sin(ph));
  mat2 tip = rot(.42);
  m.yz = tip * m.yz;
  m.xy = rot(-.32) * m.xy;
  vec2 ad = normalize(m.xy);
  float al = length(m.xy);
  float facing = pow(abs(m.z), 10.);

  float along = dot(p, ad);
  float perp = abs(p.x * ad.y - p.y * ad.x);
  float aa = abs(along);
  float wid = .006 + aa * .16;
  float beam = exp(-sq(perp / wid)) * exp(-aa * 2.2) * smoothstep(.0, .04, aa);
  beam *= .55 + .7 * fbm4(vec2(aa * 9. - t * 3.5, perp * 26.));
  col += vec3(.55, .82, 1.) * beam * (.6 + 1.6 * al) * 1.6;

  // dipole field lines: r = L sin^2(theta) in the plane of the axis
  float ct = along / max(r, 1e-4);
  float st2 = max(1. - ct * ct, 1e-4);
  float lines = 0.;
  for (int k = 0; k < 5; k++) {
    float L = .07 * pow(1.55, float(k));
    float d = abs(r - L * st2);
    float pulse = .55 + .45 * sin(ct * 9. - t * 4. + float(k) * 1.7);
    lines += exp(-d * d / (.0000045 + r * .00003)) * pulse * exp(-r * 3.2);
  }
  col += vec3(.6, .5, 1.) * lines * .9;

  // equatorial wind ring, fixed to the spin axis
  vec2 sa = normalize((rot(-.32) * vec2(0., cos(.42))));
  float eq = dot(p, vec2(sa.y, -sa.x));
  float ax = dot(p, sa) / max(sin(.42), .2);
  float ring = length(vec2(eq, ax));
  float ringGlow = exp(-sq((ring - .19) / .012));
  float ang = atan(ax, eq);
  ringGlow *= .4 + .9 * fbm4(vec2(cos(ang), sin(ang)) * 3. + uSeed * 4.);
  col += vec3(.75, .8, 1.) * ringGlow * .55;

  col = toneHDR(col * 1.1);
  col += stars(p, .03, uSeed + 1., .9) * (1. - env * .6);

  // the star itself, and the flash as a beam crosses our line of sight
  col += flare(p, .7 + facing * 1.4, vec3(.6, .8, 1.));
  col += vec3(.45, .7, 1.) * facing * exp(-r * 2.4) * 1.3;
  col += vec3(.8, .9, 1.) * .0009 / (r * r + .0009) * 1.5;
  return col;
}
`,Rv=`
const float RIN = 1.32;
const float ROUT = 2.32;
const float OBL = .91;

float ringDensity(float r) {
  float x = (r - RIN) / (ROUT - RIN);
  float d = .55 + .45 * gnoise(vec2(r * 14., 1.3)) + .25 * gnoise(vec2(r * 47., 7.7));
  d *= smoothstep(0., .06, x) * smoothstep(1., .93, x);
  d *= mix(.25, 1., smoothstep(.1, .3, x));                 // faint inner C ring
  d *= 1. - .92 * exp(-sq((r - 1.96) / .035));          // Cassini division
  d *= 1. - .8 * exp(-sq((r - 2.2) / .008));            // Encke gap
  return clamp(d, 0., 1.);
}

float sphereHit(vec3 ro, vec3 rd) {
  ro.y /= OBL; rd.y /= OBL;
  float a = dot(rd, rd), b = dot(ro, rd), c = dot(ro, ro) - 1.;
  float h = b * b - a * c;
  if (h < 0.) return -1.;
  return (-b - sqrt(h)) / a;
}

vec3 bands(vec3 n, float seed) {
  float lat = n.y;
  float lon = atan(n.z, n.x) + uTime * .04;
  float warp = fbm4(vec2(lon * 1.6, lat * 9.) + seed * 7.) - .5;
  float b = lat * 7.5 + warp * 1.4 + .35 * sin(lat * 23. + warp * 4.);
  vec3 c1 = vec3(.93, .82, .6), c2 = vec3(.78, .58, .36), c3 = vec3(.98, .92, .78);
  vec3 c = mix(c1, c2, .5 + .5 * sin(b));
  c = mix(c, c3, smoothstep(.6, 1., sin(b * 1.7 + 1.)) * .5);
  c = mix(c, vec3(.62, .66, .7), smoothstep(.72, .98, abs(lat)));  // pale poles
  return c;
}

vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float el = .3 + uTilt.y * .09;
  float az = -.35 + uTilt.x * .2;
  vec3 ro = 7.4 * vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el));
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(fw, vec3(0, 1, 0)));
  vec3 up = cross(rt, fw);
  vec2 pp = rot(-.36) * (p - vec2(.04, -.02));
  vec3 rd = normalize(fw * 1.55 + rt * pp.x + up * pp.y);
  vec3 L = normalize(vec3(-.75, .32, .65));

  vec3 bg = vec3(.006, .008, .02) + stars(p, .03, uSeed, 1.) + stars(p, .075, uSeed + 2., .8);
  bg += vec3(.18, .14, .3) * pow(max(fbm4(p * 1.5 + uSeed * 9.), 0.), 3.) * .25;
  vec3 col = bg;

  float ts = sphereHit(ro, rd);
  float tr = -ro.y / rd.y;
  vec3 rp = ro + rd * tr;
  float rr = length(rp.xz);
  bool ringOk = tr > 0. && rr > RIN && rr < ROUT;

  vec3 tint = hueShift(vec3(1.), 0.);
  float hs = uSeed < .55 ? 0. : (uSeed - .55) * 6.;

  if (ts > 0.) {
    vec3 sp = ro + rd * ts;
    vec3 n = normalize(vec3(sp.x, sp.y / (OBL * OBL), sp.z));
    float ndl = dot(n, L);
    float lit = smoothstep(-.12, .55, ndl);
    // ring shadow on the planet
    float tsh = -sp.y / L.y;
    vec3 shp = sp + L * tsh;
    float shr = length(shp.xz);
    if (tsh > 0. && shr > RIN && shr < ROUT) lit *= 1. - .85 * ringDensity(shr);
    vec3 c = hueShift(bands(n, uSeed), hs);
    float rim = pow(max(1. - max(dot(n, -rd), 0.), 0.), 3.);
    col = c * (lit * 1.25 + .025) + vec3(.5, .7, 1.) * rim * smoothstep(-.3, .4, ndl) * .7;
    col += c * .05 * smoothstep(.0, -.3, ndl) * (rp.y > 0. ? 1. : .4); // ringshine on the night side
  }
  if (ringOk && (ts < 0. || tr < ts)) {
    float dens = ringDensity(rr);
    float sh = sphereHit(rp + L * .001, L) > 0. ? .08 : 1.;
    float side = sign(ro.y) == sign(L.y) ? 1. : .35;
    vec3 rc = mix(vec3(.82, .72, .56), vec3(.96, .9, .8), gnoise(vec2(rr * 30., 2.)) * .5 + .5);
    rc = hueShift(rc, hs);
    vec3 lc = rc * sh * side * (.95 + .4 * abs(L.y));
    col = mix(col, lc, dens * .92);
  }
  col = toneHDR(col * 1.08);
  // the sun glinting off the limb
  return col;
}
`,Cv=`
vec3 art(vec2 uv) {
  vec2 p = P(uv) - vec2(.02, 0.);
  float r = length(p);
  vec2 dir = p / max(r, 1e-4);
  float t = uTime * .05;
  float s = uSeed * 10.;

  float R = .27 + .045 * (fbm4(dir * 1.8 + s) - .5) * 2.;
  float shell = exp(-sq((r - R) / (.09 + .05 * fbm4(dir * 3. + s + 4.))));
  vec2 w = p * 5.5 + vec2(fbm4(p * 3. + s + t), fbm4(p * 3. + s + 5.2 - t)) * 2.;
  float fil = ridged(w + s);
  float fil2 = ridged(w * 1.7 + 3.1 + s);

  vec3 col = vec3(.01, .008, .025);
  col += vec3(.12, .2, .8) * exp(-r * r * 26.) * (.6 + .8 * fbm(p * 7. + s)) * 1.4;  // synchrotron heart
  col += vec3(1., .3, .14) * pow(max(fil, 0.), 4.) * shell * 2.4;
  col += vec3(1., .75, .32) * pow(max(fil2, 0.), 6.) * shell * 2.;
  col += vec3(.2, .95, .75) * pow(max(fil * fil2, 0.), 4.) * shell * 1.4;
  col += vec3(.8, .25, .5) * shell * .14;

  // outer shock
  float Rs = .43 + .01 * sin(uTime * .7);
  float shock = exp(-sq((r - Rs) / .006)) * (.5 + .8 * fbm4(dir * 4. + s + 9.));
  shock += exp(-sq((r - Rs) / .05)) * .12;
  col += vec3(.55, .7, 1.) * shock;

  // god rays: angular noise, falling off with distance
  float a = atan(p.y, p.x);
  float rays = pow(max(fbm4(vec2(cos(a), sin(a)) * 9. + s), 0.), 5.) * 3.;
  rays += pow(max(fbm4(vec2(cos(a), sin(a)) * 23. + s + 7.), 0.), 8.) * 3.;
  col += vec3(1., .85, .7) * rays * exp(-r * 4.5) * .9;

  col = hueShift(col, (uSeed - .5) * 1.);
  col = toneHDR(col * 1.2);
  col += stars(p, .03, uSeed + 4., 1.) * smoothstep(.15, .5, r);

  // the core: bright enough to drown its own nebula
  col += flare(p, 1.5, vec3(1., .9, .8)) * 1.2;
  col += vec3(1., .8, .6) * exp(-r * 9.) * 1.2;
  col += vec3(.6, .7, 1.) * exp(-abs(p.y) * 160.) * exp(-abs(p.x) * 3.5) * .9;  // anamorphic streak
  return col;
}
`,Pv=`
vec3 galaxy(vec2 q, float t, float s) {
  float r = length(q);
  float th = atan(q.y, q.x) + t;
  float lr = log(r + .015);
  float ph = 2. * (th - lr * 2.8);
  float wob = (fbm4(q * 6. + s) - .5) * 1.6;
  float arm = pow(max(.5 + .5 * cos(ph + wob), 0.), 2.2);
  float lane = pow(max(.5 + .5 * cos(ph + wob - .6), 0.), 14.);
  float disk = exp(-r * 4.6);
  float clump = .3 + 1.15 * fbm(q * 14. + s);

  vec3 col = vec3(0);
  col += vec3(.5, .68, 1.) * arm * clump * disk * 3.4 * smoothstep(.015, .1, r);
  col += vec3(.7, .75, .95) * disk * .32;
  col += vec3(1., .8, .55) * exp(-r * r * 140.) * 2.6;
  col += vec3(1., .88, .7) * exp(-r * 17.) * .85;
  col *= 1. - .72 * lane * smoothstep(.03, .1, r) * smoothstep(.55, .12, r);

  // HII knots strung along the arms
  vec2 g = q * 34.;
  vec2 id = floor(g);
  vec2 f = fract(g) - .5;
  vec2 h = hash22(id + s);
  float on = step(.78, hash12(id * 1.3 + s)) * smoothstep(.55, .9, arm) * disk * smoothstep(.04, .1, length(q));
  col += vec3(1., .35, .6) * on * exp(-dot(f - (h - .5) * .6, f - (h - .5) * .6) * 70.) * 3.;
  return col;
}

vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float s = uSeed * 10.;
  vec3 col = vec3(.008, .008, .025);
  col += stars(p, .028, uSeed, .9) + stars(p, .07, uSeed + 5., .8);

  float incl = .95 + uTilt.y * .12;
  vec2 q = rot(-.5 + uSeed * .6 + uTilt.x * .05) * (p - vec2(-.03, .01));
  q.y /= cos(incl);
  q *= .82;
  col += galaxy(q, uTime * .025, s);

  // companion, tugging the far arm
  vec2 cq = p - vec2(.33, -.2);
  col += vec3(1., .78, .55) * (exp(-dot(cq, cq) * 600.) * 1.2 + exp(-length(cq) * 30.) * .35);

  // two distant edge-on galaxies for scale
  vec2 d1 = rot(.8) * (p - vec2(-.42, .3));
  col += vec3(1., .88, .7) * exp(-(d1.x * d1.x * 3000. + d1.y * d1.y * 40000.)) * .7;
  vec2 d2 = rot(-.3) * (p - vec2(.45, .34));
  col += vec3(.8, .85, 1.) * exp(-(d2.x * d2.x * 9000. + d2.y * d2.y * 30000.)) * .5;

  col = hueShift(col, (uSeed - .5) * .8);
  return toneHDR(col * 1.15);
}
`,Lv=`
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float t = uTime;
  vec2 H = vec2(.3, .2);
  vec2 d = normalize(vec2(-1., -.58));
  vec2 v = p - H;
  float s = dot(v, d);
  float u = v.x * d.y - v.y * d.x;
  float r = length(v);

  vec3 col = vec3(.006, .008, .022);
  // a faint band of Milky Way behind
  vec2 mw = rot(.6) * p;
  col += vec3(.3, .28, .4) * pow(max(fbm(mw * vec2(2., 6.) + uSeed * 4.), 0.), 2.5) * exp(-mw.y * mw.y * 18.) * .45;
  col = tonemap(col);
  col += stars(p, .026, uSeed, 1.) + stars(p, .065, uSeed + 7., .8);

  float fwd = smoothstep(-.02, .03, s);
  // ion tail: straight, narrow, streaming outward
  float wi = .008 + s * .07;
  float ion = exp(-sq(u / wi)) * exp(-s * 1.4) * fwd;
  float streams = .45 + .9 * fbm4(vec2(u / wi * 1.4, s * 3. - t * .35));
  col += vec3(.3, .55, 1.) * ion * streams * 1.9;
  // dust tail: curved, wide, warm, with faint striae
  float ud = u - s * s * .55 - s * .04;
  float wd = .012 + s * .2;
  float dust = exp(-sq(ud / wd)) * exp(-s * 1.7) * fwd;
  float striae = (.7 + .3 * sin(ud / wd * 9. + s * 14.)) * (.6 + .6 * fbm4(vec2(ud / wd * 2., s * 5.) + uSeed * 3.));
  col += vec3(1., .88, .64) * dust * striae * 1.4;

  // coma and nucleus
  col += vec3(.35, 1., .65) * exp(-r * 22.) * .9;
  col += vec3(.7, 1., .85) * exp(-r * 70.) * 1.2;
  col += flare(v, .9, vec3(.7, 1., .9)) * .9;

  // grit shed along the orbit, glinting
  vec2 g = vec2(s * 60., u * 160.);
  vec2 id = floor(g);
  float spark = step(.985, hash12(id + uSeed * 3.)) * fwd * exp(-s * 2.);
  spark *= exp(-dot(fract(g) - .5, fract(g) - .5) * 30.) * (.6 + .4 * sin(t * 3. + hash12(id) * TAU));
  col += vec3(.9, .95, 1.) * spark * 1.5;

  col = hueShift(col, (uSeed - .5) * .6);
  return col;
}
`,Dv=`
vec2 stream(float u) {
  // L1 to the edge of the disk, bending with the orbit (Coriolis)
  vec2 a = vec2(.02, .0), b = vec2(.17, -.12), c = vec2(.32, -.06);
  return mix(mix(a, b, u), mix(b, c, u), u);
}

vec3 art(vec2 uv) {
  vec2 p = P(uv);
  p += uTilt * .01;
  float t = uTime;
  vec3 col = vec3(.008, .006, .02);
  col += stars(p, .028, uSeed, .9) + stars(p, .07, uSeed + 2., .7);

  // giant: teardrop toward L1, boiling surface, limb darkening
  vec2 G = vec2(-.26, .02);
  vec2 g = p - G;
  float ga = atan(g.y, g.x);
  float R = .25 * (1. + .2 * pow(max(cos(ga), 0.), 4.));
  float gr = length(g) / R;
  vec3 gcol = hueShift(vec3(1., .36, .1), (uSeed - .5) * .5);
  col += gcol * exp(-max(gr - 1., 0.) * 5.) * .7 * smoothstep(.97, 1.15, gr);
  col += gcol * exp(-length(g) * 5.) * .25;
  if (gr < 1.) {
    vec2 sg = g / R;
    float z = sqrt(1. - gr * gr);
    float gran = fbm(sg / (z + .35) * 4.5 + t * .03 + uSeed * 5.);
    float cells = 1. - ridged(sg / (z + .4) * 3. + t * .02 + uSeed * 2.) * .5;
    vec3 surf = mix(vec3(.85, .2, .04), vec3(1., .78, .42), smoothstep(.3, .85, gran)) * (.8 + .4 * cells);
    float limb = pow(max(z, 0.), .5);
    col = surf * limb * 1.7 + gcol * (1. - limb) * .5;
  }

  // the stream, flowing
  float best = 1e3, bu = 0.;
  vec2 a = stream(0.);
  for (int i = 1; i <= 16; i++) {
    float u1 = float(i) / 16.;
    vec2 b = stream(u1);
    vec2 ab = b - a;
    float h = clamp(dot(p - a, ab) / dot(ab, ab), 0., 1.);
    float dd = length(p - a - ab * h);
    if (dd < best) { best = dd; bu = u1 - (1. - h) / 16.; }
    a = b;
  }
  float sw = .01 + bu * .008;
  float flow = .75 + .25 * sin(bu * 22. - t * 3.);
  float fade = smoothstep(.0, .12, bu);
  col += vec3(1., .55, .25) * exp(-best * best / (sw * sw * 4.)) * .5 * fade;
  col += vec3(1., .8, .55) * exp(-best * best / (sw * sw * .5)) * flow * 1.4 * fade;

  // compact star and its accretion disk
  vec2 C = vec2(.33, -.03);
  vec2 cq = (p - C) * rot(.18);
  vec2 dq = vec2(cq.x, cq.y / .3);
  float dr = length(dq);
  float omega = t * .9 / pow(max(dr, .02), 1.5) * .02;
  vec2 sq = rot(omega) * dq;
  float swirl = fbm4(sq * 22. + uSeed * 3.);
  float disk = smoothstep(.16, .11, dr) * smoothstep(.012, .03, dr);
  vec3 dc = mix(vec3(.5, .55, 1.), vec3(1., .95, .9), smoothstep(.13, .02, dr));
  col = mix(col, dc * (.45 + 1.2 * swirl) * 1.5, disk * .9);
  col += vec3(.6, .7, 1.) * exp(-dr * 14.) * .6;
  col += vec3(1., .8, .5) * exp(-length(p - stream(1.)) * 70.) * .8;   // hot spot where the stream lands

  col = toneHDR(col * 1.08);
  col += flare(p - C, 1., vec3(.65, .8, 1.));
  return col;
}
`,Uv=`
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float s = uSeed * 10.;
  vec3 col = vec3(.006, .008, .022);
  col += stars(p, .026, uSeed, .9) + stars(p, .07, uSeed + 9., .8);

  vec2 q = rot(.55 + uSeed) * (p - vec2(.0, .01));
  q *= vec2(1., 1.28);
  float r = length(q);
  vec2 dir = q / max(r, 1e-4);
  float R = .2 + .012 * (fbm4(dir * 2. + s) - .5) * 2.;
  float x = (r - R) / .07;

  vec3 o3 = vec3(.2, .75, 1.);
  vec3 ha = vec3(1., .3, .2);
  vec3 ye = vec3(1., .78, .35);

  float inner = smoothstep(.06, -.04, r - R) * (.5 + .7 * fbm(q * 9. + s));
  col += o3 * inner * .9;
  col += vec3(.45, .55, 1.) * exp(-r * r * 60.) * .4;
  col += ye * exp(-x * x * 1.6) * .8 * (.5 + fbm4(q * 14. + s));
  float knots = ridged(q * 18. + s);
  col += ha * exp(-sq((x - .7) / .9)) * (.5 + 1.6 * pow(max(knots, 0.), 3.)) * 1.2;
  // dark globules on the outer edge
  vec2 g = q * 60.;
  vec2 gid = floor(g);
  float glob = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = gid + vec2(i, j);
    vec2 cp = (c + hash22(c + s)) / 60.;
    float on = exp(-sq((length(cp) - R - .045) / .03));
    glob = max(glob, on * smoothstep(.25, .0, length(g - c - hash22(c + s))));
  }
  col *= 1. - .6 * glob;
  col += ha * glob * .25;

  // outer petals
  float a = atan(q.y, q.x);
  float petals = pow(max(.5 + .5 * cos(a * 7. + fbm4(dir * 3. + s) * 3.), 0.), 3.);
  float halo = exp(-sq((r - .36) / .07)) * (.2 + petals * .55);
  col += mix(ha, vec3(.85, .3, .7), .4) * halo * .55;

  col = hueShift(col, (uSeed - .5) * 1.3);
  col = toneHDR(col * 1.15);
  col += flare(p - vec2(.0, .01), .75, vec3(.7, .85, 1.));
  return col;
}
`,Iv=`
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  p += uTilt * .012;
  float s = uSeed * 10.;
  vec3 col = vec3(.006, .01, .028);

  // reflection nebula: dust combed into streaks, lit blue by the stars
  vec2 w = rot(.45) * p;
  float neb = fbm(w * vec2(2.2, 8.) + vec2(fbm4(p * 3. + s), 0.) * 1.2 + s);
  float neb2 = fbm4(p * 2. + s + 3.);
  col += vec3(.2, .4, 1.) * pow(max(neb, 0.), 2.5) * pow(max(neb2, 0.), 1.2) * 3.;
  col += vec3(.55, .7, 1.) * pow(max(neb, 0.), 5.) * 1.6;
  col = toneHDR(col);
  col += stars(p, .022, uSeed, 1.) + stars(p, .055, uSeed + 4., .9);

  // the dipper
  vec2 S[7];
  S[0] = vec2(-.02, .0);   S[1] = vec2(.15, -.08);  S[2] = vec2(.12, .09);
  S[3] = vec2(.21, .14);   S[4] = vec2(.27, .03);   S[5] = vec2(-.28, .02);
  S[6] = vec2(-.27, .07);
  float B[7];
  B[0] = 1.5; B[1] = 1.; B[2] = 1.05; B[3] = .8; B[4] = .95; B[5] = 1.1; B[6] = .6;
  mat2 m = rot((uSeed - .5) * .5);
  for (int i = 0; i < 7; i++) {
    vec2 sp = m * S[i] + vec2(.02, -.03);
    vec2 d = p - sp;
    col += flare(d, B[i] * .75, vec3(.62, .78, 1.)) * .9;
    col += vec3(.3, .5, 1.) * exp(-length(d) * 14.) * .12 * B[i];
  }
  return col;
}
`,Nv=`
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float t = uTime;
  float s = uSeed * 10.;
  vec3 col = vec3(.006, .006, .02);
  col += stars(p, .028, uSeed, .9) + stars(p, .07, uSeed + 3., .7);
  // background galaxies
  for (int i = 0; i < 6; i++) {
    vec2 c = (hash22(vec2(float(i), s)) - .5) * vec2(1.2, .9);
    vec2 d = rot(hash11(float(i) + s) * 6.) * (p - c);
    col += mix(vec3(1., .8, .6), vec3(.7, .8, 1.), hash11(float(i) * 3.)) *
           exp(-(d.x * d.x * 8000. + d.y * d.y * 30000.)) * .5;
  }

  float ang = .95 + (uSeed - .5) * .4;
  vec2 j = rot(ang) * p;   // x along the jet
  float ax = abs(j.x);
  // host galaxy
  col += vec3(1., .75, .5) * exp(-length(p * vec2(1., 1.4)) * 6.) * .35;

  // jets: helical, knotted, widening slowly
  float wid = .008 + ax * .045;
  float hel = j.y - sin(ax * 28. - t * 2. * sign(j.x)) * .0011 * ax * 10.;
  float jet = exp(-sq(hel / wid)) * exp(-ax * 1.6) * smoothstep(.0, .03, ax);
  float knots = .5 + .8 * pow(max(.5 + .5 * sin(ax * 34. - t * 2.2), 0.), 6.);
  jet *= knots * (.6 + .6 * fbm4(vec2(ax * 10. - t * .6, j.y * 60.)));
  col += vec3(.45, .6, 1.) * jet * 2.6;
  col += vec3(.85, .9, 1.) * exp(-sq(hel / (wid * .25))) * exp(-ax * 2.4) * smoothstep(.0, .03, ax) * 1.4;

  // lobes
  for (int k = 0; k < 2; k++) {
    float sg = k == 0 ? 1. : -1.;
    vec2 lc = j - vec2(sg * .48, sg * .015);
    float lob = exp(-dot(lc * vec2(1.5, 1.), lc * vec2(1.5, 1.)) * 30.);
    float tex = fbm(lc * 8. + s + float(k) * 4.);
    col += mix(vec3(.95, .25, .65), vec3(.45, .3, 1.), tex) * lob * pow(max(tex, 0.), 1.3) * 3.;
  }

  // disk, edge-on
  vec2 dq = vec2(j.y, j.x / .12);
  float dr = length(dq);
  col += vec3(1., .78, .5) * exp(-dr * dr * 900.) * 1.6;
  col += vec3(1., .6, .35) * exp(-dr * 40.) * .4;

  col = hueShift(col, (uSeed - .5) * .9);
  col = toneHDR(col * 1.1);
  col += flare(p, 1.1, vec3(.8, .85, 1.));
  return col;
}
`,Fv=`
const float RIN = 2.6;
const float ROUT = 11.5;

vec3 diskColor(float k) {
  vec3 c = mix(vec3(.6, .05, .08), vec3(1., .32, .06), smoothstep(0., .38, k));
  c = mix(c, vec3(1., .66, .18), smoothstep(.3, .66, k));
  c = mix(c, vec3(1., .94, .78), smoothstep(.72, 1.02, k));
  c = mix(c, vec3(.8, .88, 1.), smoothstep(1., 1.3, k));
  return c;
}

vec4 diskSample(vec3 hit, vec3 rd) {
  float r = length(hit.xz);
  float a = atan(hit.z, hit.x);
  float om = pow(max(r, 0.), -1.5);
  float ph = a - uTime * om * 1.1;
  vec2 cs = vec2(cos(ph), sin(ph));
  float n = fbm3(vec3(cs * 1.5, r * 1.6) + uSeed * 3.);
  float fine = gnoise3(vec3(cs * 3.5, r * 9.));
  float lanes = .75 + .25 * sin(r * 11. + n * 6.);
  float streak = (.35 + 1.1 * n + .35 * fine) * lanes;
  float x = (r - RIN) / (ROUT - RIN);
  float prof = smoothstep(0., .025, x) * pow(max(1. - x, 0.), 1.4) * pow(max(RIN / r, 0.), 1.1);

  float v = min(sqrt(.5 / max(r - 1., .4)), .72);
  vec3 vdir = normalize(vec3(-hit.z, 0., hit.x));
  float cosT = dot(vdir, -normalize(rd));
  float gam = 1. / sqrt(1. - v * v);
  float g = sqrt(max(1. - 1. / r, 0.)) / (gam * (1. - v * cosT));
  float I = prof * streak * pow(max(g, 0.), 3.2) * 3.2;
  float k = clamp(.98 - x * 1.35 + (g - 1.) * .75, 0., 1.3);
  float alpha = clamp(prof * streak * 1.7, 0., .97);
  return vec4(diskColor(k) * I, alpha);
}

vec3 sky(vec3 d) {
  vec3 col = vec3(.003, .003, .01);
  float n = fbm3(d * 2.1 + uSeed * 5.);
  float n2 = fbm3(d * 4.3 + 7.);
  col += vec3(.3, .12, .5) * pow(max(n, 0.), 3.5) * .55;
  col += vec3(.06, .25, .5) * pow(max(n2 * n, 0.), 2.5) * .45;
  for (int L = 0; L < 2; L++) {
    float sc = L == 0 ? 70. : 170.;
    vec3 g = d * sc;
    vec3 id = floor(g);
    vec3 f = fract(g) - .5;
    vec3 h = hash33(id + float(L) * 31.);
    float dist = length(f - (h - .5) * .6);
    float m = pow(max(hash13(id + 7.7 + float(L)), 0.), 9.);
    float sz = .07 + .13 * m;
    col += starTint(h.z) * exp(-dist * dist / (sz * sz)) * (.35 + 4. * m) * step(.4, hash13(id + 3.3));
  }
  return col;
}

vec3 art(vec2 uv) {
  vec2 p = P(uv) - vec2(0., .075);
  float el = .105 + uTilt.y * .075;
  float az = uTilt.x * .3;
  float D = 19.;
  vec3 ro = D * vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el));
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(fw, vec3(0, 1, 0)));
  vec3 up = cross(rt, fw);
  vec2 pp = rot(-.13) * p;
  vec3 rd = normalize(fw * .6 + rt * pp.x + up * pp.y);

  vec3 pos = ro, dir = rd;
  vec3 hv = cross(pos, dir);
  float h2 = dot(hv, hv);
  vec3 col = vec3(0);
  float T = 1.;
  bool captured = false;
  float minR = 1e3;
  // velocity Verlet: second order, so the step count changing from one pixel to
  // the next doesn't print faint rings into the lensed starfield
  vec3 acc = -1.5 * h2 * pos / pow(max(length(pos), 0.), 5.);
  for (int i = 0; i < 180; i++) {
    float r = length(pos);
    minR = min(minR, r);
    if (r < 1.) { captured = true; break; }
    if (r > 48. || T < .01) break;
    float dt = clamp(.065 * r, .012, 1.4);
    vec3 np = pos + dir * dt + .5 * acc * dt * dt;
    vec3 nacc = -1.5 * h2 * np / pow(max(length(np), .5), 5.);
    dir += .5 * (acc + nacc) * dt;
    acc = nacc;
    if (pos.y * np.y < 0.) {
      vec3 hit = mix(pos, np, pos.y / (pos.y - np.y));
      float hr = length(hit.xz);
      if (hr > RIN && hr < ROUT) {
        vec4 d = diskSample(hit, dir);
        col += T * d.rgb;
        T *= 1. - d.a;
      }
    }
    pos = np;
  }
  if (!captured) col += T * sky(normalize(dir));
  // the photon sphere's own faint glow, where paths wound round before escaping
  col += vec3(1., .8, .55) * exp(-sq((minR - 1.55) / .08)) * .35 * T;
  return toneHDR(col * 1.05);
}
`,to={nebula:Av,pulsar:wv,ringed:Rv,supernova:Cv,galaxy:Pv,comet:Lv,binary:Dv,planetary:Uv,cluster:Iv,quasar:Nv,blackhole:Fv},Fa=new Map;function Ov(n){if(!Fa.has(n)){if(!to[n])throw new Error(`No art for "${n}"`);Fa.set(n,new ft({vertexShader:Tv,fragmentShader:bv(to[n]),uniforms:{uTime:{value:0},uSeed:{value:0},uRes:{value:new ie(1,1)},uTilt:{value:new ie}},depthTest:!1,depthWrite:!1}))}return Fa.get(n)}const bo=new St(new Wn(2,2));bo.frustumCulled=!1;const bu=new vo;bu.add(bo);const zv=new qs(-1,1,1,-1,0,1);function no(n,e,t=!1){return new Qt(n,e,{type:hn,depthBuffer:!1,generateMipmaps:t,minFilter:t?li:Kt,magFilter:Kt})}function Au(n,e,t,{time:i,seed:r,tilt:s}){const a=Ov(e);a.uniforms.uTime.value=i,a.uniforms.uSeed.value=r,a.uniforms.uRes.value.set(t.width,t.height),s?a.uniforms.uTilt.value.copy(s):a.uniforms.uTilt.value.set(0,0),bo.material=a;const o=n.getRenderTarget();n.setRenderTarget(t),n.render(bu,zv),n.setRenderTarget(o)}function Bv(n,e){const t=no(4,4);for(const i of e)Au(n,i,t,{time:0,seed:0});t.dispose()}const kv=Object.keys(to),$t=1.4,wu=`
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 spectrum(float t) { return .5 + .5 * cos(6.28318 * (t + vec3(0., .33, .67))); }
`,Hv=`
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vPos = wp.xyz;
  vN = normalize(mat3(modelMatrix) * vec3(0., 0., 1.));
  vT = normalize(mat3(modelMatrix) * vec3(1., 0., 0.));
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Gv=`
uniform sampler2D uFrame;
uniform sampler2D uMask;
uniform sampler2D uArt;
uniform sampler2D uBack;
uniform sampler2D uBackMask;
uniform vec4 uArtRect;
uniform float uTime;
uniform float uFoil;
uniform float uChase;
uniform float uFlash;
uniform float uDim;
uniform vec3 uMetal;
uniform vec3 uLight;
uniform vec2 uHoloCenter;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
${wu}

void main() {
  vec3 N = normalize(vN);
  vec3 T = normalize(vT);
  vec2 uv = vUv;
  bool front = gl_FrontFacing;
  if (!front) { N = -N; T = -T; uv.x = 1. - uv.x; }
  vec3 B = cross(N, T);
  vec3 V = normalize(cameraPosition - vPos);
  vec3 L = normalize(uLight - vPos);
  vec3 H = normalize(L + V);

  vec3 col;
  vec3 mk;
  float foil = 0.;
  if (front) {
    vec4 fr = texture2D(uFrame, uv);
    mk = texture2D(uMask, uv).rgb;
    vec2 auv = (uv - uArtRect.xy) / (uArtRect.zw - uArtRect.xy);
    vec3 art = texture2D(uArt, clamp(auv, 0., 1.)).rgb;
    col = mix(art, fr.rgb, fr.a);
    foil = mk.b * uFoil;
  } else {
    col = texture2D(uBack, uv).rgb;
    mk = texture2D(uBackMask, uv).rgb;
  }

  float vx = dot(V, T), vy = dot(V, B);
  float ndh = max(dot(N, H), 0.);
  float sheen = pow(max(ndh, 0.), 9.);
  float gloss = pow(max(ndh, 0.), 150.);
  float ph = uv.x * 1.3 + uv.y * 2.1 + vx * 2.8 + vy * 2.3;
  vec3 rb = spectrum(ph);

  // brushed metal: bands that slide across the border as the card turns
  float bands = .5 + .5 * sin(vx * 9. + vy * 6. + (uv.x + uv.y) * 7.);
  vec3 metalTint = mix(uMetal, rb, uChase * .55);
  vec3 metal = col * (.36 + .4 * bands) + metalTint * sheen * .18 + vec3(gloss) * .6;
  col = mix(col, metal, mk.r);

  // foil-stamped type
  vec3 stamp = col * (.6 + .32 * bands) + mix(uMetal, rb, .3 + .5 * uChase) * sheen * .3 + vec3(gloss) * .6;
  col = mix(col, stamp, mk.g);

  // holographic film
  if (foil > 0.) {
    float lum = dot(col, vec3(.299, .587, .114));
    float band = pow(ndh, 26.);   // a rainbow lobe that sweeps across as the card turns
    if (uChase > .5) {
      // the foil lives in the dark: space round the hole turns iridescent while
      // the disk keeps its own fire; fine rings of "spacetime" show in the band
      vec2 d = (uv - uHoloCenter) * vec2(1., 1.4);
      float r = length(d);
      float ripple = .7 + .3 * sin(r * 90. - vx * 7. - vy * 5.);
      vec3 film = mix(spectrum(ph * 1.1 + r * 1.6), vec3(1.), .12);
      float dark = 1. - smoothstep(.03, .5, lum);
      col += film * (.022 + .5 * band * ripple) * (.25 + .75 * dark) * foil;
      col += film * sheen * .05 * dark * foil;
    } else {
      vec3 film = mix(spectrum(ph * 1.15 + sin((uv.x - uv.y * 1.4) * 52.) * .08), vec3(1.), .15);
      col += film * (.05 + .55 * band) * (.3 + .6 * lum) * foil * .6;
    }
  }

  // glitter: tiny flakes, each with its own tilt, that only catch the light
  // when the half-vector lines up with them
  float glit = max(foil * .8, max(mk.g, mk.r) * .15);
  if (glit > 0.) {
    vec2 gp = uv * vec2(1., 1.4) * 170.;
    glit *= smoothstep(1.4, .5, length(fwidth(gp)));
    vec2 id = floor(gp);
    vec2 f = fract(gp) - .5;
    vec2 h1 = hash22(id);
    vec2 h2 = hash22(id + 17.3);
    vec3 fn = normalize(N + (T * (h1.x - .5) + B * (h1.y - .5)) * .5);
    float g = pow(max(dot(fn, H), 0.), 260.);
    float shape = smoothstep(.42, .05, length(f - (h2 - .5) * .5));
    vec3 gc = mix(vec3(1.), spectrum(h2.x + ph * .5), .55);
    col += gc * g * shape * 2.2 * glit * step(.45, hash12(id + 2.7));

    // and now and then a four-point star
    vec2 sp = uv * vec2(1., 1.4) * 32.;
    vec2 sid = floor(sp);
    vec2 so = fract(sp) - .5 - (hash22(sid + 9.) - .5) * .4;
    vec2 sh = hash22(sid + 3.1);
    vec3 sn = normalize(N + (T * (sh.x - .5) + B * (sh.y - .5)) * .45);
    float sg = pow(max(dot(sn, H), 0.), 500.);
    float star = exp(-abs(so.x) * 70.) * exp(-abs(so.y) * 6.5) + exp(-abs(so.y) * 70.) * exp(-abs(so.x) * 6.5);
    star += exp(-dot(so, so) * 500.);
    col += vec3(1., .98, .95) * sg * star * 2.4 * glit * step(.5, hash12(sid + 4.4));
  }

  // laminate gloss over everything
  col += vec3(.9, .93, 1.) * (gloss * .15 + sheen * .03);

  col *= uDim;
  col = mix(col, vec3(1.25), uFlash);
  gl_FragColor = vec4(col, 1.);
}
`,Vv=`
uniform float uGlow;
uniform float uTime;
uniform vec3 uColor;
uniform float uRainbow;
varying vec2 vUv;
${wu}
float sdRR(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main() {
  vec2 p = (vUv - .5) * vec2(1.7, 2.1);
  float d = sdRR(p, vec2(.5, .7), .05);
  float g = exp(-max(d, 0.) * 9.) * smoothstep(-.06, .0, d);
  g += exp(-max(d, 0.) * 22.) * .8 * smoothstep(-.02, .0, d);
  // fade out before the edge of the quad, so it never shows as a faint frame
  vec2 e = abs(vUv - .5) * 2.;
  g *= smoothstep(1., .78, max(e.x, e.y));
  float a = atan(p.y, p.x);
  vec3 c = mix(uColor, mix(spectrum(a / 6.28318 + uTime * .15), vec3(1., .92, .8), .22) * .8, uRainbow);
  gl_FragColor = vec4(c * g * uGlow, 1.);
}
`,Wv=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`;function Xv(){const e=$t,t=.046,i=new au;i.moveTo(-1/2+t,-e/2),i.lineTo(1/2-t,-e/2),i.absarc(1/2-t,-e/2+t,t,-Math.PI/2,0,!1),i.lineTo(1/2,e/2-t),i.absarc(1/2-t,e/2-t,t,0,Math.PI/2,!1),i.lineTo(-1/2+t,e/2),i.absarc(-1/2+t,e/2-t,t,Math.PI/2,Math.PI,!1),i.lineTo(-1/2,-e/2+t),i.absarc(-1/2+t,-e/2+t,t,Math.PI,Math.PI*1.5,!1);const r=new So(i,10),s=r.attributes.position,a=r.attributes.uv;for(let o=0;o<s.count;o++)a.setXY(o,s.getX(o)/1+.5,s.getY(o)/e+.5);return r}const qv=Xv(),Yv=new Wn(1.7,2.1),$v={silver:new _e(.85,.88,.95),gold:new _e(1,.82,.5),chrome:new _e(.8,.78,1)},Zn=new C,mc=new Ui;class Kv{constructor(e,t,i){this.pull=e,this.def=e.def,this.face=Mv(e,t);const r=yv(t),s=!!e.def.fullArt;this.artHi=no(s?720:960,s?1008:768),this.artLo=no(s?300:400,s?420:320,!0),this.useHi=!1,this.artFresh={hi:!1,lo:!1},this.material=new ft({vertexShader:Hv,fragmentShader:Gv,side:Sn,uniforms:{uFrame:{value:this.face.frame},uMask:{value:this.face.mask},uArt:{value:this.artLo.texture},uBack:{value:r.frame},uBackMask:{value:r.mask},uArtRect:{value:this.face.artRect},uTime:{value:0},uFoil:{value:e.foil?1:0},uChase:{value:this.def.rarity==="holo"?1:0},uFlash:{value:0},uDim:{value:1},uMetal:{value:$v[To(this.def.rarity)]},uLight:{value:i},uHoloCenter:{value:new ie(.5,.575)}}}),this.mesh=new St(qv,this.material);const a=new _e(this.def.accent);this.haloMat=new ft({vertexShader:Wv,fragmentShader:Vv,transparent:!0,depthWrite:!1,side:Sn,blending:Ci,uniforms:{uGlow:{value:0},uTime:{value:0},uColor:{value:a},uRainbow:{value:this.def.rarity==="holo"?1:0}}}),this.halo=new St(Yv,this.haloMat),this.halo.position.z=-.004,this.halo.renderOrder=-1,this.group=new ni,this.group.add(this.halo,this.mesh),this.pose={x:0,y:0,z:0,rx:0,ry:0,rz:0,s:1,flip:0},this.tilt=new ie,this.tiltVel=new ie,this.tiltTarget=new ie,this.artTilt=new ie,this.offset=new C,this.glow=0,this.hover=0,this.hoverTarget=0,this.pop=0,this.flyUntil=0}applyPose(){const e=this.pose,t=this.offset,i=this.hover;this.group.position.set(e.x+t.x,e.y+t.y+i*e.s*.08,e.z+t.z+i*.4),this.group.rotation.set(e.rx+this.tilt.x,e.ry+this.tilt.y+e.flip*Math.PI,e.rz*(1-i*.7),"YXZ"),this.group.scale.setScalar(e.s*(1+i*.07+Math.sin(Math.min(this.pop,1)*Math.PI)*.035))}stepTilt(e){for(const r of["x","y"]){const s=(this.tiltTarget[r]-this.tilt[r])*60-this.tiltVel[r]*11;this.tiltVel[r]+=s*e,this.tilt[r]+=this.tiltVel[r]*e}}updateViewTilt(e){this.group.updateMatrixWorld(),this.group.getWorldPosition(Zn),Zn.subVectors(e.position,Zn).normalize(),this.group.getWorldQuaternion(mc),Zn.applyQuaternion(mc.invert()),this.pose.flip>.5&&(Zn.x=-Zn.x),this.artTilt.set(Ps.clamp(Zn.x*2.2,-1,1),Ps.clamp(Zn.y*2.2,-1,1))}renderArt(e,t,i){const r=i?this.artHi:this.artLo;Au(e,this.def.id,r,{time:t,seed:this.pull.seed,tilt:this.artTilt}),this.artFresh[i?"hi":"lo"]=!0,this.useHi=i,this.material.uniforms.uArt.value=r.texture}setTime(e){this.material.uniforms.uTime.value=e,this.haloMat.uniforms.uTime.value=e,this.haloMat.uniforms.uGlow.value=this.glow,this.halo.visible=this.glow>.003}dispose(){this.face.frame.dispose(),this.face.mask.dispose(),this.artHi.dispose(),this.artLo.dispose(),this.material.dispose(),this.haloMat.dispose()}}const Rn=1.34,Bt=2.12,wn=.885,et=1e3,vt=Math.round(et*Bt/Rn),Zv=1.024,Mi='Jost, "Futura", "Century Gothic", sans-serif',Ru='"Cormorant Garamond", Garamond, serif';function Os(n,e,t,i,r,s="center"){const a=[...e],o=a.map(u=>n.measureText(u).width),l=o.reduce((u,h)=>u+h,0)+r*(a.length-1);let c=s==="center"?t-l/2:s==="right"?t-l:t;n.textAlign="left",a.forEach((u,h)=>{n.fillText(u,c,i),c+=o[h]+r})}function Cu(){const n=e=>{const t=document.createElement("canvas");t.width=Math.round(et*e),t.height=Math.round(vt*e);const i=t.getContext("2d");return i.scale(e,e),{c:t,ctx:i}};return{p:n(Zv),m:n(.5)}}function Pu(n,e){const t=Math.round(vt*.05);for(const[i,r]of[[0,t],[vt-t,vt]]){const s=n.ctx.createLinearGradient(0,i,0,r);s.addColorStop(0,"#6d7286"),s.addColorStop(.5,"#dfe3ef"),s.addColorStop(1,"#7a8093"),n.ctx.fillStyle=s,n.ctx.fillRect(0,i,et,r-i),n.ctx.fillStyle="rgba(30,30,50,.25)";for(let a=0;a<et;a+=8)n.ctx.fillRect(a,i,3,r-i);e.ctx.fillStyle="#00f",e.ctx.fillRect(0,i,et,r-i)}}function Lu(n,e,t){const{ctx:i}=n,r=i.createRadialGradient(et/2,t,30,et/2,t,vt*.75);r.addColorStop(0,"#2b1856"),r.addColorStop(.4,"#120b2c"),r.addColorStop(1,"#05030c"),i.fillStyle=r,i.fillRect(0,0,et,vt),e.ctx.fillStyle="rgb(120,0,0)",e.ctx.fillRect(0,0,et,vt);const s=40;for(let l=0;l<s;l+=2){const c=l/s*Math.PI*2,u=(l+1)/s*Math.PI*2;for(const[h,f]of[[i,"rgba(190,170,255,.05)"],[e.ctx,"rgb(235,0,0)"]])h.fillStyle=f,h.beginPath(),h.moveTo(et/2,t),h.lineTo(et/2+Math.cos(c)*2e3,t+Math.sin(c)*2e3),h.lineTo(et/2+Math.cos(u)*2e3,t+Math.sin(u)*2e3),h.closePath(),h.fill()}let a=7;const o=()=>(a=a*16807%2147483647)/2147483647;for(let l=0;l<700;l++)i.fillStyle=`rgba(240,236,255,${.15+o()*.6})`,i.beginPath(),i.arc(o()*et,o()*vt,.6+o()*o()*2.2,0,Math.PI*2),i.fill()}function Du(n,e,t,i,r){const{ctx:s}=n,a=s.createRadialGradient(t,i,r*.4,t,i,r*2.3);a.addColorStop(0,"rgba(255,180,100,.6)"),a.addColorStop(.3,"rgba(255,120,70,.22)"),a.addColorStop(1,"rgba(120,60,200,0)"),s.fillStyle=a,s.fillRect(t-r*2.4,i-r*2.4,r*4.8,r*4.8);const o=-.1,l=(u=1)=>{const h=s.createLinearGradient(t-r*2.8,i,t+r*2.8,i);return h.addColorStop(0,"rgba(255,90,40,0)"),h.addColorStop(.18,`rgba(255,120,50,${.8*u})`),h.addColorStop(.42,`rgba(255,205,130,${u})`),h.addColorStop(.6,`rgba(255,248,232,${u})`),h.addColorStop(.82,`rgba(255,160,80,${.85*u})`),h.addColorStop(1,"rgba(255,90,40,0)"),h},c=()=>{const u=s.createLinearGradient(t,i-r*1.4,t,i+r*1.4);return u.addColorStop(0,"#fff3dc"),u.addColorStop(.35,"#ffc070"),u.addColorStop(.65,"#ff8a3c"),u.addColorStop(1,"#ffd9a0"),u};s.save(),s.shadowColor="rgba(255,150,70,1)",s.shadowBlur=60,s.strokeStyle=c(),s.lineCap="round",s.lineWidth=r*.24,s.beginPath(),s.arc(t,i,r*1.24,Math.PI*1.02,Math.PI*1.98),s.stroke(),s.lineWidth=r*.07,s.beginPath(),s.arc(t,i,r*1.12,Math.PI*.08,Math.PI*.92),s.stroke(),s.shadowBlur=24,s.lineWidth=r*.06,s.strokeStyle="rgba(255,250,240,.95)",s.beginPath(),s.arc(t,i,r*1.2,Math.PI*1.1,Math.PI*1.9),s.stroke(),s.shadowBlur=40,s.lineWidth=r*.13,s.strokeStyle=l(.9),s.beginPath(),s.ellipse(t,i,r*2.9,r*.24,o,Math.PI,Math.PI*2),s.stroke(),s.restore(),s.beginPath(),s.arc(t,i,r,0,Math.PI*2),s.fillStyle="#010003",s.fill(),s.save(),s.shadowColor="rgba(255,220,170,1)",s.shadowBlur=16,s.lineWidth=2.5,s.strokeStyle="#fff1d6",s.stroke(),s.restore(),s.save(),s.shadowColor="rgba(255,150,70,1)",s.shadowBlur=40,s.lineWidth=r*.17,s.strokeStyle=l(1),s.beginPath(),s.ellipse(t,i,r*2.9,r*.24,o,0,Math.PI),s.stroke(),s.lineWidth=r*.05,s.strokeStyle="rgba(255,255,250,.9)",s.beginPath(),s.ellipse(t,i,r*2.75,r*.21,o,.15,Math.PI-.15),s.stroke(),s.restore(),e.ctx.fillStyle="rgb(40,0,0)",e.ctx.beginPath(),e.ctx.ellipse(t,i,r*2.8,r*1.5,o,0,Math.PI*2),e.ctx.fill(),e.ctx.strokeStyle="#0f0",e.ctx.lineWidth=4,e.ctx.beginPath(),e.ctx.arc(t,i,r,0,Math.PI*2),e.ctx.stroke()}function Es(n,e,t,i,r,s,a,o){for(const[l,c]of[[n.ctx,o],[e.ctx,"#0f0"]])l.font=i,l.fillStyle=c,Os(l,t,r,s,a)}function Jv(){const{p:n,m:e}=Cu(),t=vt*.49;Lu(n,e,t),Pu(n,e),Du(n,e,et/2,t,118);const i=(()=>{const a=n.ctx.createLinearGradient(0,260,0,380);return a.addColorStop(0,"#ffffff"),a.addColorStop(.5,"#c9cde0"),a.addColorStop(1,"#f4f2ff"),a})();Es(n,e,"✦  CELESTIAL TRADING CARDS  ✦",`500 25px ${Mi}`,et/2,262,9,"#d8d2f5"),Es(n,e,Ks.toUpperCase(),`600 150px ${Mi}`,et/2+16,400,32,i),Es(n,e,"BOOSTER PACK",`600 48px ${Mi}`,et/2+8,vt*.755,18,"#f3e3bf"),n.ctx.font=`400 26px ${Mi}`,n.ctx.fillStyle="#b7b0d8",Os(n.ctx,`${yo} COSMIC CARDS  ·  ${Mo.toUpperCase()}`,et/2,vt*.755+56,8),n.ctx.font=`italic 500 38px ${Ru}`,n.ctx.fillStyle="#e8d6ff",n.ctx.textAlign="center",n.ctx.fillText("a holographic black hole in every pack",et/2,vt*.755+122);const r=(1-wn)*vt;n.ctx.save(),n.ctx.strokeStyle="rgba(230,225,255,.45)",n.ctx.setLineDash([10,9]),n.ctx.lineWidth=2,n.ctx.beginPath(),n.ctx.moveTo(60,r),n.ctx.lineTo(et,r),n.ctx.stroke(),n.ctx.restore(),n.ctx.fillStyle="rgba(230,225,255,.7)",n.ctx.font=`500 16px ${Mi}`,Os(n.ctx,"TEAR  HERE",120,r-12,5,"left"),n.ctx.beginPath(),n.ctx.moveTo(0,r-14),n.ctx.lineTo(26,r),n.ctx.lineTo(0,r+14),n.ctx.fillStyle="#05030c",n.ctx.fill();const s=vt*.9;for(let a=0;a<yi;a++){const o=et/2+(a-(yi-1)/2)*34;n.ctx.beginPath(),n.ctx.arc(o,s,a===yi-1?8:5,0,Math.PI*2),n.ctx.fillStyle=a===yi-1?"#ffd79a":"rgba(220,214,255,.55)",n.ctx.fill()}return{p:n,m:e}}function jv(){const{p:n,m:e}=Cu(),t=vt*.4;Lu(n,e,t),Pu(n,e),Du(n,e,et/2,t,70),Es(n,e,Ks.toUpperCase(),`600 70px ${Mi}`,et/2+10,vt*.6,20,"#eceaff"),n.ctx.font=`400 24px ${Mi}`,n.ctx.fillStyle="#b7b0d8",[`CONTAINS ${yo} CARDS FROM A SET OF ${yi}`,"SEVEN COSMIC FEATURES, RAREST LAST","ONE HOLOGRAPHIC BLACK HOLE"].forEach((a,o)=>Os(n.ctx,a,et/2,vt*.66+o*44,4)),n.ctx.font=`italic 500 30px ${Ru}`,n.ctx.fillStyle="#cfc2ef",n.ctx.textAlign="center",n.ctx.fillText("Keep away from event horizons.",et/2,vt*.82);let r=et/2-130,s=3;for(n.ctx.fillStyle="#efeefa",n.ctx.fillRect(et/2-150,vt*.85,300,90),n.ctx.fillStyle="#111";r<et/2+130;){s=s*48271%2147483647;const a=2+s%4;n.ctx.fillRect(r,vt*.855,a,70),r+=a+2+(s>>3)%4}return{p:n,m:e}}function Ss(n){const e=new tu(n);return e.anisotropy=8,e.minFilter=li,e}const Qv=`
uniform float uPuff;
uniform float uTear;
uniform float uPart;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
float height(vec2 uv) {
  float x = uv.x * 2. - 1.;
  float body = smoothstep(.04, .17, uv.y) * smoothstep(.96, .83, uv.y);
  float side = 1. - pow(abs(x), 2.6);
  float h = body * side * uPuff;
  float seal = 1. - smoothstep(.045, .06, min(uv.y, 1. - uv.y));
  h += seal * .004 * sin(uv.x * 420.);
  h += (vn(uv * vec2(6., 10.)) - .5) * .022 * body * side;
  h += (vn(uv * vec2(19., 27.) + 4.) - .5) * .007 * body;
  return h;
}
void main() {
  vUv = uv;
  vec3 p = position;
  float h = height(uv);
  p.z += h;
  // a strip that has torn free curls back off the pack
  if (uPart > .5) {
    float freed = smoothstep(uv.x - .02, uv.x + .1, uTear * 1.05);
    p.z += freed * (uv.y - ${wn.toFixed(3)}) * 1.6;
  }
  float e = .004;
  float hx = (height(uv + vec2(e, 0.)) - height(uv - vec2(e, 0.))) / (2. * e * ${Rn.toFixed(3)});
  float hy = (height(uv + vec2(0., e)) - height(uv - vec2(0., e))) / (2. * e * ${Bt.toFixed(3)});
  vec3 n = normalize(vec3(-hx, -hy, 1.));
  vec4 wp = modelMatrix * vec4(p, 1.);
  vPos = wp.xyz;
  vN = normalize(mat3(modelMatrix) * n);
  vT = normalize(mat3(modelMatrix) * vec3(1., 0., 0.));
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,e_=`
uniform sampler2D uPrint;
uniform sampler2D uPMask;
uniform float uTear;
uniform float uPart;
uniform float uTime;
uniform float uHover;
uniform vec3 uLight;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 h22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 spectrum(float t) { return .5 + .5 * cos(6.28318 * (t + vec3(0., .33, .67))); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
float sq(float x) { return x * x; }
float tearY(float x) { return ${wn.toFixed(3)} + .004 * sin(x * 97.) + .003 * sin(x * 231. + 1.) + .002 * sin(x * 517.); }

void main() {
  vec2 uv = vUv;
  float ty = tearY(uv.x);
  if (uPart < .5 && uv.y > ty) discard;
  if (uPart > .5 && uv.y <= ty) discard;

  vec3 N = normalize(vN);
  vec3 T = normalize(vT);
  vec3 B = cross(N, T);
  // fine crinkle in the foil
  vec2 cuv = uv * vec2(34., 54.);
  vec2 cr = vec2(vn(cuv), vn(cuv + 7.3)) - .5;
  cr += (vec2(vn(cuv * 2.7 + 3.1), vn(cuv * 2.7 + 9.4)) - .5) * .5;
  N = normalize(N + (T * cr.x + B * cr.y) * .1);
  vec3 V = normalize(cameraPosition - vPos);
  vec3 L = normalize(uLight - vPos);
  vec3 H = normalize(L + V);
  vec3 R = reflect(-V, N);

  vec3 ink = texture2D(uPrint, uv).rgb;
  vec3 mk = texture2D(uPMask, uv).rgb;
  float diff = .38 + .75 * max(dot(N, L), 0.);
  float env = .06 + .85 * smoothstep(.15, .95, R.y) + .75 * exp(-sq((R.x + .45) / .13)) +
              .4 * exp(-sq((R.x - .55) / .22)) * smoothstep(-.5, .5, R.y);
  vec3 film = spectrum(R.x * 1.4 + R.y * 1.1 + uv.y * 1.6 + uv.x * .7);
  vec3 foil = mix(vec3(.92, .94, 1.), film, .72) * env;
  float spec = pow(max(dot(N, H), 0.), 70.);

  vec3 col = ink * diff;
  col = mix(col, ink * .35 + foil * (.55 + .7 * ink), mk.r * .85);
  col = mix(col, ink * .62 + foil * .75 + vec3(spec) * 1.4, mk.g);
  col = mix(col, ink * (.38 + env * .18) + vec3(spec) * .25, mk.b);
  col += vec3(spec) * .45;

  // glitter in the foil
  vec2 gp = uv * vec2(1., 1.58) * 150.;
  vec2 id = floor(gp);
  vec2 h1 = h22(id);
  vec3 fn = normalize(N + (T * (h1.x - .5) + B * (h1.y - .5)) * .5);
  float g = pow(max(dot(fn, H), 0.), 240.) * smoothstep(.45, .1, length(fract(gp) - .5));
  col += mix(vec3(1.), spectrum(h1.x * 3.), .5) * g * 4. * (mk.r + mk.g) * smoothstep(1.4, .5, length(fwidth(gp)));

  // the tear: a seam of light where it has split
  float d = abs(uv.y - ty);
  float torn = step(uv.x, uTear * 1.04);
  col += vec3(1., .85, .6) * exp(-d * 420.) * torn * 3.;
  // and a hint of where to tear before anyone has
  col += vec3(.8, .75, 1.) * exp(-d * 600.) * (1. - torn) * (.25 + .25 * sin(uTime * 3. - uv.x * 8.)) * uHover;
  gl_FragColor = vec4(col, 1.);
}
`;class t_{constructor(e){const t=Jv(),i=jv();this.textures=[Ss(t.p.c),Ss(t.m.c),Ss(i.p.c),Ss(i.m.c)];const r=new Wn(Rn,Bt,48,80);this.geom=r,this.uniforms={uPuff:{value:.12},uTear:{value:0},uTime:{value:0},uHover:{value:0},uLight:{value:e}};const s=(c,u,h)=>new ft({vertexShader:Qv,fragmentShader:e_,uniforms:{...this.uniforms,uPrint:{value:c},uPMask:{value:u},uPart:{value:h}}});this.materials=[s(this.textures[0],this.textures[1],0),s(this.textures[2],this.textures[3],0),s(this.textures[0],this.textures[1],1),s(this.textures[2],this.textures[3],1)],this.group=new ni,this.body=new ni,this.front=new St(r,this.materials[0]),this.backMesh=new St(r,this.materials[1]),this.backMesh.rotation.y=Math.PI,this.body.add(this.front,this.backMesh),this.strip=new ni;const a=(wn-.5)*Bt+(1-wn)*Bt/2;this.strip.position.y=a;const o=new St(r,this.materials[2]),l=new St(r,this.materials[3]);l.rotation.y=Math.PI,o.position.y=-a,l.position.y=-a,this.strip.add(o,l),this.group.add(this.body,this.strip),this.spill=new St(new Wn(Rn*1.6,1.6),new ft({transparent:!0,depthWrite:!1,blending:Ci,uniforms:{uI:{value:0},uTime:this.uniforms.uTime},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }",fragmentShader:`
          uniform float uI; uniform float uTime; varying vec2 vUv;
          float sq(float x) { return x * x; }
          void main(){
            vec2 p = vUv - vec2(.5, 0.);
            float w = .3 + p.y * .4;
            float beam = exp(-sq(p.x / w) * 3.) * exp(-p.y * 3.2) * smoothstep(0., .04, p.y);
            float rays = .6 + .4 * sin(atan(p.x, p.y + .2) * 40. + uTime * 1.5);
            float base = exp(-pow(abs(p.x) / .33, 8.)) * exp(-p.y * 40.);
            vec3 c = mix(vec3(1., .82, .55), vec3(.7, .6, 1.), clamp(p.y * 1.6, 0., 1.));
            gl_FragColor = vec4(c * (beam * rays * .8 + base * .9) * uI, 1.);
          }`})),this.spill.position.set(0,wn*Bt-Bt/2+.78,.02),this.spill.renderOrder=5,this.group.add(this.spill)}tearPoint(e){const t=this.uniforms.uTear.value;return e.set((t-.5)*Rn,(wn-.5)*Bt,.03)}dispose(){this.textures.forEach(e=>e.dispose()),this.materials.forEach(e=>e.dispose()),this.geom.dispose(),this.spill.geometry.dispose(),this.spill.material.dispose()}}const Ft=3e3,n_=`
attribute float aSize;
attribute float aAlpha;
attribute float aRot;
attribute vec3 aColor;
uniform float uScale;
varying float vAlpha;
varying float vRot;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uScale / -mv.z;
  vAlpha = aAlpha;
  vRot = aRot;
  vColor = aColor;
}
`,i_=`
varying float vAlpha;
varying float vRot;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord * 2. - 1.;
  float c = cos(vRot), s = sin(vRot);
  d = mat2(c, s, -s, c) * d;
  float r = length(d);
  float core = exp(-r * r * 22.);
  float arms = exp(-abs(d.x) * 18.) * exp(-abs(d.y) * 2.6) + exp(-abs(d.y) * 18.) * exp(-abs(d.x) * 2.6);
  float a = (core * 1.4 + arms * .75) * vAlpha * smoothstep(1., .7, r);
  gl_FragColor = vec4(vColor * a, 1.);
}
`;class r_{constructor(){this.pos=new Float32Array(Ft*3),this.vel=new Float32Array(Ft*3),this.col=new Float32Array(Ft*3),this.size=new Float32Array(Ft),this.alpha=new Float32Array(Ft),this.rot=new Float32Array(Ft),this.spin=new Float32Array(Ft),this.life=new Float32Array(Ft),this.maxLife=new Float32Array(Ft),this.baseSize=new Float32Array(Ft),this.drag=new Float32Array(Ft),this.grav=new Float32Array(Ft),this.pull=new Float32Array(Ft),this.twinkle=new Float32Array(Ft),this.next=0,this.attractor=new C;const e=new mn,t=(i,r)=>new qt(i,r).setUsage(af);e.setAttribute("position",t(this.pos,3)),e.setAttribute("aColor",t(this.col,3)),e.setAttribute("aSize",t(this.size,1)),e.setAttribute("aAlpha",t(this.alpha,1)),e.setAttribute("aRot",t(this.rot,1)),this.geom=e,this.material=new ft({vertexShader:n_,fragmentShader:i_,transparent:!0,depthWrite:!1,blending:Ci,uniforms:{uScale:{value:300}}}),this.points=new eu(e,this.material),this.points.frustumCulled=!1,this.points.renderOrder=10}setScale(e,t){this.material.uniforms.uScale.value=e*t*.24}emit(e){const t=this.next;this.next=(this.next+1)%Ft;const i=t*3;this.pos[i]=e.x,this.pos[i+1]=e.y,this.pos[i+2]=e.z??0,this.vel[i]=e.vx??0,this.vel[i+1]=e.vy??0,this.vel[i+2]=e.vz??0;const r=e.color;this.col[i]=r.r,this.col[i+1]=r.g,this.col[i+2]=r.b,this.baseSize[t]=e.size??1,this.life[t]=this.maxLife[t]=e.life??1,this.drag[t]=e.drag??1.5,this.grav[t]=e.gravity??0,this.pull[t]=e.pull??0,this.rot[t]=Math.random()*Math.PI,this.spin[t]=(Math.random()-.5)*3,this.twinkle[t]=Math.random()*10}update(e,t){const i=this.attractor;for(let s=0;s<Ft;s++){if(this.life[s]<=0){this.alpha[s]=0;continue}this.life[s]-=e;const a=s*3;let o=this.vel[a],l=this.vel[a+1],c=this.vel[a+2];if(this.pull[s]>0){const g=i.x-this.pos[a],v=i.y-this.pos[a+1],p=i.z-this.pos[a+2],d=Math.hypot(g,v,p)+.05,E=this.pull[s]/(d*d+.2)*e;o+=g*E-v*E*1.6,l+=v*E+g*E*1.6,c+=p*E,d<.12&&(this.life[s]=Math.min(this.life[s],.05))}const u=Math.exp(-this.drag[s]*e);o*=u,l=l*u-this.grav[s]*e,c*=u,this.vel[a]=o,this.vel[a+1]=l,this.vel[a+2]=c,this.pos[a]+=o*e,this.pos[a+1]+=l*e,this.pos[a+2]+=c*e;const h=this.life[s]/this.maxLife[s],f=Math.min(1,h*4)*Math.min(1,(1-h)*12+.2),m=.65+.35*Math.sin(t*9+this.twinkle[s]);this.alpha[s]=f*m,this.size[s]=this.baseSize[s]*(.6+.4*h+.25*m),this.rot[s]+=this.spin[s]*e}const r=this.geom.attributes;r.position.needsUpdate=!0,r.aColor.needsUpdate=!0,r.aSize.needsUpdate=!0,r.aAlpha.needsUpdate=!0,r.aRot.needsUpdate=!0}clear(){this.life.fill(0)}}const gc=[new _e(1,.86,.6),new _e(.75,.85,1),new _e(1,.7,.95),new _e(.7,1,.92),new _e(1,1,1)];function Uu(n){return n&&Math.random()<.55?n:gc[Math.floor(Math.random()*gc.length)]}const s_=new _e;function kr(n){return s_.setRGB(.5+.5*Math.cos(6.283*n),.5+.5*Math.cos(6.283*(n+.67)),.5+.5*Math.cos(6.283*(n+.33))).clone()}const a_=`
uniform float uTime;
uniform float uDim;
uniform vec2 uRes;
uniform vec2 uPar;
uniform vec3 uTint;
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 h22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float gn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(dot(h22(i) - .5, f), dot(h22(i + vec2(1, 0)) - .5, f - vec2(1, 0)), u.x),
             mix(dot(h22(i + vec2(0, 1)) - .5, f - vec2(0, 1)), dot(h22(i + vec2(1, 1)) - .5, f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * gn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.; a *= .5; } return .5 + 1.3 * s; }
void main() {
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  vec2 q = p + uPar * .02;
  float n = fbm(q * 1.4 + vec2(uTime * .006, 0.));
  float n2 = fbm(q * 2.8 + n * 1.3 - vec2(0., uTime * .005));
  vec3 col = vec3(.008, .007, .022);
  col += vec3(.2, .07, .32) * pow(max(n, 0.), 3.2) * .55;
  col += uTint * pow(max(n2 * n, 0.), 2.6) * .3;
  col += vec3(.04, .1, .22) * pow(max(n2, 0.), 4.) * .45;
  float v = 1. - smoothstep(.35, 1.15, length(p * vec2(.85, 1.)));
  col *= (.45 + .55 * v) * uDim;
  gl_FragColor = vec4(col, 1.);
}
`,o_=`
attribute float aMag;
attribute float aPhase;
attribute vec3 aTint;
uniform float uTime;
uniform float uScale;
uniform float uSuck;
uniform vec3 uCenter;
varying float vB;
varying vec3 vTint;
void main() {
  vec3 p = position;
  // the whirlpool: rotate about the centre, faster close in, and draw inward
  vec2 d = p.xy - uCenter.xy;
  float r = length(d);
  float ang = uSuck * 3.2 / (r * .35 + .6);
  float c = cos(ang), s = sin(ang);
  d = mat2(c, s, -s, c) * d * mix(1., .25 + .75 * smoothstep(0., 14., r), uSuck);
  p.xy = uCenter.xy + d;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  float tw = .7 + .3 * sin(uTime * (1. + aPhase) + aPhase * 20.);
  vB = (.25 + aMag * 1.5) * tw;
  vTint = aTint;
  gl_PointSize = max(1.5, (1.2 + aMag * 4.) * uScale / -mv.z);
}
`,l_=`
varying float vB;
varying vec3 vTint;
void main() {
  vec2 d = gl_PointCoord * 2. - 1.;
  float r = length(d);
  float core = exp(-r * r * 10.);
  float spikes = (exp(-abs(d.x) * 22.) + exp(-abs(d.y) * 22.)) * exp(-r * 2.4) * smoothstep(.6, 1.5, vB);
  gl_FragColor = vec4(vTint * vB * (core + spikes * .6), 1.);
}
`,c_=`
uniform sampler2D tSky;
uniform float uTime;
varying vec2 vUv;
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
void main() {
  vec3 col = texture2D(tSky, vUv).rgb;
  // dither, so the dark gradients don't band
  col += (h21(gl_FragCoord.xy + fract(uTime) * 91.) - .5) / 255.;
  gl_FragColor = vec4(col, 1.);
}
`;class u_{constructor(){this.skyRT=new Qt(4,4,{type:hn,depthBuffer:!1}),this.skyScene=new vo,this.skyCam=new qs(-1,1,1,-1,0,1),this.skyPaint=new St(new Wn(2,2),new ft({vertexShader:"void main(){ gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:a_,depthTest:!1,depthWrite:!1,uniforms:{uTime:{value:0},uDim:{value:1},uRes:{value:new ie(1,1)},uPar:{value:new ie},uTint:{value:new _e(.3,.2,.6)}}})),this.skyPaint.frustumCulled=!1,this.skyScene.add(this.skyPaint),this.sky={material:this.skyPaint.material},this.skyShow=new St(new Wn(2,2),new ft({vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .99999, 1.); }",fragmentShader:c_,depthTest:!1,depthWrite:!1,uniforms:{tSky:{value:this.skyRT.texture},uTime:{value:0}}})),this.skyShow.frustumCulled=!1,this.skyShow.renderOrder=-100,this.frame=0;const e=2200,t=new Float32Array(e*3),i=new Float32Array(e),r=new Float32Array(e),s=new Float32Array(e*3);for(let o=0;o<e;o++){t[o*3]=(Math.random()-.5)*70,t[o*3+1]=(Math.random()-.5)*44,t[o*3+2]=-6-Math.random()*40,i[o]=Math.pow(Math.random(),7),r[o]=Math.random();const l=Math.random(),c=l<.2?[1,.75,.55]:l<.6?[1,.95,.88]:[.75,.85,1];s.set(c,o*3)}const a=new mn;a.setAttribute("position",new qt(t,3)),a.setAttribute("aMag",new qt(i,1)),a.setAttribute("aPhase",new qt(r,1)),a.setAttribute("aTint",new qt(s,3)),this.starMat=new ft({vertexShader:o_,fragmentShader:l_,transparent:!0,depthWrite:!1,blending:Ci,uniforms:{uTime:{value:0},uScale:{value:100},uSuck:{value:0},uCenter:{value:new C}}}),this.stars=new eu(a,this.starMat),this.stars.frustumCulled=!1,this.stars.renderOrder=-50,this.tint=new _e(.3,.2,.6),this.tintTarget=new _e(.3,.2,.6)}addTo(e){e.add(this.skyShow,this.stars)}resize(e,t,i){const r=Math.max(16,Math.round(e/4)),s=Math.max(16,Math.round(t/4));this.skyRT.setSize(r,s),this.sky.material.uniforms.uRes.value.set(r,s),this.frame=0,this.starMat.uniforms.uScale.value=t*i*.05}update(e,t,i){this.tint.lerp(this.tintTarget,1-Math.exp(-e*1.5));const r=this.sky.material.uniforms;r.uTime.value=t,r.uTint.value.copy(this.tint),r.uPar.value.copy(i),this.starMat.uniforms.uTime.value=t,this.skyShow.material.uniforms.uTime.value=t}paint(e){if(this.frame++%2)return;const t=e.getRenderTarget();e.setRenderTarget(this.skyRT),e.render(this.skyScene,this.skyCam),e.setRenderTarget(t)}}const lt={in:n=>n*n*n,out:n=>1-Math.pow(1-n,3),inOut:n=>n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2,outBack:n=>1+2.4*Math.pow(n-1,3)+1.4*Math.pow(n-1,2)};let Ti=[],Iu=0;function qe(n,e,t,i={}){for(const r of Ti)if(r.target===n&&!r.from)for(const s in e)delete r.to[s];return new Promise(r=>{Ti.push({target:n,to:{...e},dur:Math.max(t,1e-4),ease:i.ease??lt.inOut,t0:Iu+(i.delay??0),from:null,arc:i.arc,onUpdate:i.onUpdate,resolve:r})})}const cr=n=>qe({},{},n);function Nu(n){Ti=[]}function h_(n){var e;Iu=n;for(const t of Ti.slice()){if(n<t.t0)continue;if(!t.from){for(const s of Ti)if(s!==t&&s.from&&s.target===t.target)for(const a in t.to)delete s.to[a];t.from={};for(const s in t.to)t.from[s]=t.target[s]}const i=Math.min(1,(n-t.t0)/t.dur),r=t.ease(i);for(const s in t.to)t.target[s]=t.from[s]+(t.to[s]-t.from[s])*r,t.arc&&t.arc[s]&&(t.target[s]+=Math.sin(Math.PI*i)*t.arc[s]);(e=t.onUpdate)==null||e.call(t,i),i>=1&&(Ti.splice(Ti.indexOf(t),1),t.resolve())}}let $e=null,Cn=null,Zs=!1;try{Zs=localStorage.getItem("cosmic-booster:muted")==="1"}catch{}function Bn(){if($e)return $e.state==="suspended"&&$e.resume(),$e;const n=window.AudioContext||window.webkitAudioContext;if(!n)return null;$e=new n,Cn=$e.createGain(),Cn.gain.value=Zs?0:.5;const e=$e.createDynamicsCompressor();return Cn.connect(e),e.connect($e.destination),$e}function io(){return Zs}function f_(n){Zs=n;try{localStorage.setItem("cosmic-booster:muted",n?"1":"0")}catch{}Cn&&Cn.gain.setTargetAtTime(n?0:.5,$e.currentTime,.05)}function d_(n){const e=$e.createBuffer(1,Math.floor($e.sampleRate*n),$e.sampleRate),t=e.getChannelData(0);for(let i=0;i<t.length;i++)t[i]=Math.random()*2-1;return e}function vi(n,e,t=1.6,i=.12,r="sine"){const s=$e.createOscillator(),a=$e.createGain();s.type=r,s.frequency.value=n,a.gain.setValueAtTime(0,e),a.gain.linearRampToValueAtTime(i,e+.008),a.gain.exponentialRampToValueAtTime(1e-4,e+t),s.connect(a),a.connect(Cn),s.start(e),s.stop(e+t+.05);const o=$e.createOscillator(),l=$e.createGain();o.frequency.value=n*2.76,l.gain.setValueAtTime(0,e),l.gain.linearRampToValueAtTime(i*.35,e+.005),l.gain.exponentialRampToValueAtTime(1e-4,e+t*.5),o.connect(l),l.connect(Cn),o.start(e),o.stop(e+t)}function _r(n,e,t,i,r=.12,s=1.2){const a=$e.createBufferSource();a.buffer=d_(e);const o=$e.createBiquadFilter();o.type="bandpass",o.Q.value=s,o.frequency.setValueAtTime(t,n),o.frequency.exponentialRampToValueAtTime(i,n+e);const l=$e.createGain();l.gain.setValueAtTime(0,n),l.gain.linearRampToValueAtTime(r,n+e*.3),l.gain.exponentialRampToValueAtTime(1e-4,n+e),a.connect(o),o.connect(l),l.connect(Cn),a.start(n)}const ro=[0,2,4,7,9,12,14,16,19,21,24],Ms=(n,e=523.25)=>e*Math.pow(2,ro[n%ro.length]/12),Dt={unlock(){Bn()},crinkle(){if(!Bn())return;const n=$e.currentTime;_r(n,.12,3e3,6e3,.05,3)},tear(n){if(!Bn())return;const e=$e.currentTime;_r(e,.09,1800+n*2500,4e3+n*3e3,.07,2.5)},rip(){if(!Bn())return;const n=$e.currentTime;_r(n,.35,900,7e3,.22,.9);for(let e=0;e<5;e++)vi(Ms(e*2,659.25),n+.12+e*.05,1.8,.05)},swish(){Bn()&&_r($e.currentTime,.3,600,2600,.08,1)},reveal(n,e){if(!Bn())return;const t=$e.currentTime;if(vi(Ms(n),t,1.8,.09),vi(Ms(n+2),t+.07,1.6,.05),e>=2)for(let i=0;i<4;i++)vi(Ms(n+4+i*2,1046.5),t+.15+i*.06,1.4,.035)},gather(){if(!Bn())return;const n=$e.currentTime;_r(n,2.2,200,4e3,.16,.7);const e=$e.createOscillator(),t=$e.createGain();e.type="sine",e.frequency.setValueAtTime(55,n),e.frequency.exponentialRampToValueAtTime(38,n+2.4),t.gain.setValueAtTime(0,n),t.gain.linearRampToValueAtTime(.28,n+1.6),t.gain.exponentialRampToValueAtTime(1e-4,n+3.2),e.connect(t),t.connect(Cn),e.start(n),e.stop(n+3.3)},chase(){if(!Bn())return;const n=$e.currentTime,e=$e.createOscillator(),t=$e.createGain();e.frequency.setValueAtTime(90,n),e.frequency.exponentialRampToValueAtTime(30,n+1.2),t.gain.setValueAtTime(.4,n),t.gain.exponentialRampToValueAtTime(1e-4,n+1.4),e.connect(t),t.connect(Cn),e.start(n),e.stop(n+1.5),[0,4,7,11,14,19].forEach((r,s)=>vi(392*Math.pow(2,r/12),n+.04+s*.07,3.2,.06));for(let r=0;r<12;r++)vi(1568*Math.pow(2,ro[r%6]/12),n+.4+r*.08,1.2,.02)},hover(){Bn()&&vi(2093+Math.random()*400,$e.currentTime,.5,.012)}},Mr=document.getElementById("gl"),Ot=new Qc({canvas:Mr,antialias:!1,powerPreference:"high-performance"});Ot.setClearColor(0,1);let Tn=Math.min(window.devicePixelRatio||1,2);Ot.setPixelRatio(Tn);const Pn=new vo,ci=12,Ao=30,Ln=new cn(Ao,1,.1,200);Ln.position.set(0,0,ci);const so=new C(-3.5,4.5,8);var Mc;const Oa=!!((Mc=window.matchMedia)!=null&&Mc.call(window,"(prefers-reduced-motion: reduce)").matches),sn=new u_;sn.addTo(Pn);const Zt=new r_;Pn.add(Zt.points);const ri=new uv(Ot,new Qt(1,1,{type:hn,samples:Tn<1.5?4:0}));ri.addPass(new hv(Pn,Ln));const wo=.72,zs=new lr(new ie(1,1),wo,.5,1);ri.addPass(zs);const Fu=new fu({uniforms:{tDiffuse:{value:null},uTime:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
    uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
    float h(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec2 p = vUv - .5;
      c *= 1. - dot(p, p) * .6;
      c += (h(gl_FragCoord.xy + fract(uTime * 7.) * 100.) - .5) * (2. / 255.);
      gl_FragColor = vec4(c, 1.);
    }`});ri.addPass(Fu);const de={w:1,h:1,visW:1,visH:1,aspect:1};function Ou(){return Math.min(.74*de.visH/Bt,.74*de.visW/Rn)}function Ir(n,e){const t=(ci-e)/ci;return{...n,x:n.x*t,y:n.y*t,z:e,s:n.s*t}}function zu(){const n=de.visH/de.h;return{top:de.visH/2-56*n,bottom:-de.visH/2+(de.w<=640?134:104)*n}}function Bu(){const{top:n,bottom:e}=zu(),t=(n-e)*.92;return{band:t,h:Math.min(.64*de.visH,Math.max(t,.45*de.visH))}}function Js(){return Math.min(Bu().h/$t,.8*de.visW)}function Hr(n={}){const{top:e,bottom:t}=zu(),{band:i,h:r}=Bu();return{x:0,y:(e+t)/2*Math.min(1,Math.max(0,i/r)),z:0,rx:0,ry:0,rz:0,s:Js(),flip:0,...n}}function ku(n){const e=Hr(),t=Gr(n.index,ke.length),i=t.s*ci/(ci-t.z);return Ir({...e,s:Math.max(e.s,i*1.15)},2.2)}function Ro(n){const e=Js(),{flip:t,...i}=Hr();return{...i,x:i.x+n*e*.005,y:i.y-n*e*.006,z:-.03-n*.025,rz:(n%2?1:-1)*.006*n}}function Hu(n){const e=Js(),t=e*.36,i=de.aspect<.95,r=(de.visW-e)/2,s=i?-de.visW/2+t*.18:-de.visW/2+r/2,a=i?-de.visH*.02:-de.visH*.06,o=n*7919%13/13-.5;return{x:s+o*t*.12,y:a+n*t*.035,z:-.8+n*.015,rx:0,ry:0,rz:.16-n*.05+o*.06,s:t,flip:0}}function Gr(n,e){const t=n===e-1,i=de.visH/de.h;if(de.aspect<.95){const h=de.visH/2-56*i,f=-de.visH/2+118*i,m=h-f,g=m*.5,v=m*.205,p=m*.045;if(t){const A=Math.min(g/$t,.62*de.visW);return Ir({x:0,y:h-g/2,rx:0,ry:0,rz:0,s:A,flip:0},.5)}const d=Math.ceil((e-1)/2),E=n<d?0:1,S=E?e-1-d:d,T=E?n-d:n,D=Math.min(v/$t,.9*de.visW/(d+.4)),R=D*1.08;return{x:(T-(S-1)/2)*R,y:h-g-p-v/2-E*(v+p),z:.1+T*.01,rx:0,ry:0,rz:(T-(S-1)/2)*-.03,s:D,flip:0}}const r=Math.min(1,de.aspect/1.62);if(t){let h=-de.visH*.05;const f=-de.visH/2+(de.w<=640?108:96)*i,m=h-f,g=.34*de.visH/$t*r,v=Math.max(g*1.1,Math.min(.6*de.visH/$t*Math.max(r,.75),2*m/$t)),p=v*$t/2;return h=Math.min(Math.max(h,f+p),Math.max(h,de.visH/2-56*i-p)),Ir({x:0,y:h,rx:0,ry:0,rz:0,s:v,flip:0},.6)}const s=e-1,o=((s>1?n/(s-1):.5)-.5)*2*.86,l=de.visH*.76*r,c=-de.visH*.56*r-de.visH*.02,u=.34*de.visH/$t*r;return{x:Math.sin(o)*l,y:c+Math.cos(o)*l,z:-.2-Math.abs(o)*.15+n*.004,rx:0,ry:0,rz:-o*.78,s:u,flip:0}}const bn=n=>document.querySelector(n),tt={caption:bn("#caption"),chip:bn("#caption .chip"),meta:bn("#caption .meta"),dots:bn("#dots"),hint:bn("#hint"),spread:bn("#spreadui"),count:bn("#spreadui .count"),skip:bn("#skip"),mute:bn("#mute")};let vc=0;const Bs=()=>de.w<560;function pn(n,e=0){clearTimeout(vc),tt.hint.classList.add("off"),n&&(vc=setTimeout(()=>{tt.hint.textContent=n,tt.hint.classList.remove("off")},350+e))}const p_={common:"#d9dce6",uncommon:"#b8d0ff",rare:"#ffd79a",holo:"#ffffff"};function ui(n,e,t){if(!n){tt.caption.classList.remove("show","chase");return}const i=Ri[n.def.rarity];tt.caption.classList.toggle("chase",n.def.rarity==="holo"),tt.chip.style.setProperty("--c",p_[n.def.rarity]),tt.chip.textContent=`${i.glyph}  ${i.label}${n.pull.foil&&n.def.rarity!=="holo"?" · Starlight foil":""}`,tt.meta.textContent=n.def.rarity==="holo"?`${n.def.name} · print ${String(n.pull.print).padStart(3,"0")} of 250`:`${n.def.name} · ${e+1} of ${t}`,tt.caption.classList.add("show")}function Vr(n,e){if(tt.dots.children.length!==n){tt.dots.innerHTML="";for(let t=0;t<n;t++){const i=document.createElement("li");t===n-1&&i.classList.add("star"),tt.dots.appendChild(i)}}[...tt.dots.children].forEach((t,i)=>{t.classList.toggle("seen",i<e),t.classList.toggle("now",i===e)}),tt.dots.classList.toggle("show",e>=0)}const ao="cosmic-booster:collection",yr=(()=>{try{const n=JSON.parse(localStorage.getItem(ao)||"[]");return new Set(Array.isArray(n)?n:[])}catch{return new Set}})();function m_(){return yr}function Co(n){yr.add(n);try{const e=JSON.parse(localStorage.getItem(ao)||"[]");if(Array.isArray(e))for(const t of e)yr.add(t);localStorage.setItem(ao,JSON.stringify([...yr]))}catch{}return yr}const g_='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2.5 6h2.5l3.5-3v10l-3.5-3h-2.5z" fill="currentColor" stroke="none"/><path d="M11 5.2a4 4 0 0 1 0 5.6M12.8 3.4a6.6 6.6 0 0 1 0 9.2"/></svg>',v_='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2.5 6h2.5l3.5-3v10l-3.5-3h-2.5z" fill="currentColor" stroke="none"/><path d="M11 6l4 4M15 6l-4 4"/></svg>';function Gu(){tt.mute.innerHTML=io()?v_:g_,tt.mute.setAttribute("aria-label",io()?"Sound off":"Sound on")}Gu();tt.mute.addEventListener("click",n=>{n.stopPropagation(),f_(!io()),Gu()});let le="boot",dn=0,Xe=null;const xt={x:0,y:0,z:0,rx:0,ry:0,rz:0,s:1},za=new ie,jn={x:0,y:0,z:0,rx:0,rz:0,o:1};let ke=[],zt=0,Li=null,Lt=null,nr={v:0},Nr=0,_t=0;function __(){return le==="reveal"||le==="chaseReady"||le==="chase"||le==="chaseHold"?ke[zt]:le==="inspect"?Li:null}function x_(){for(const n of ke)Pn.remove(n.group),n.dispose();ke=[],Xe&&(Pn.remove(Xe.group),Xe.dispose(),Xe=null)}function Vu(n){const e=++dn;Nu(),ir=!1,ur=!1,x_(),Zt.clear(),Li=Lt=null;const t=mv();return ke=t.map((i,r)=>{const s=new Kv(i,Ot,so);return s.index=r,s.group.visible=!1,r===t.length-1&&(s.pose.flip=1),Pn.add(s.group),s.renderArt(Ot,0,!1),s}),ke[0].renderArt(Ot,0,!0),Xe=new t_(so),Pn.add(Xe.group),ke.forEach(i=>{Ot.initTexture(i.face.frame),Ot.initTexture(i.face.mask),Ot.initTexture(i.material.uniforms.uBack.value),Ot.initTexture(i.material.uniforms.uBackMask.value),i.group.visible=!0}),Ot.compile(Pn,Ln),ke.forEach(i=>i.group.visible=!1),Object.assign(xt,{x:0,y:n?de.visH*1.2:0,z:0,rx:n?-.5:0,ry:0,rz:n?-.3:0,s:Ou()}),Object.assign(jn,{x:0,y:0,z:0,rx:0,rz:0}),ln=0,zt=0,le="pack",ui(null),Vr(0,-1),tt.spread.classList.remove("show"),tt.skip.classList.remove("gone"),sn.tintTarget.setRGB(.32,.2,.62),pn(Bs()?"Swipe across the top seal  ·  or tap the pack":"Drag across the top seal to tear it open  ·  or tap the pack",n?700:400),n&&qe(xt,{y:0,rx:0,rz:0},1.1,{ease:lt.outBack}),e}let ln=0,_c=0;function Wu(n){const e=ln;if(ln=Math.min(1,n),Xe.uniforms.uTear.value=ln,ln>e){const t=Math.ceil((ln-e)*160);M_(t),_t-_c>.07&&(Dt.tear(ln),_c=_t)}ln>=1&&le==="pack"&&y_()}const Ze=new C,Ei=new C,Ba=new ie,S_=new Ui;function M_(n){Xe.tearPoint(Ze),Xe.group.localToWorld(Ze);for(let e=0;e<Math.min(n,30);e++)Zt.emit({x:Ze.x+(Math.random()-.5)*.05,y:Ze.y+(Math.random()-.5)*.05,z:Ze.z+.1,vx:(Math.random()-.3)*1.6,vy:Math.random()*2.2+.3,vz:Math.random()*.8,color:Uu(new _e(1,.85,.6)),size:.35+Math.random()*.6,life:.6+Math.random()*.8,drag:1.8,gravity:2.4})}function Xu(){if(le!=="pack"||ir)return;ir=!0;const n={p:ln};qe(n,{p:1},.5*(1-ln)+.12,{ease:lt.inOut,onUpdate:()=>Wu(n.p)}).then(()=>ir=!1)}let ir=!1,ur=!1;async function y_(){if(le!=="pack")return;le="opening";const n=dn;Dt.rip(),pn(null),ur=!0;const e=xt.s;w_(),qe(jn,{x:.9,y:1.3,z:.6,rz:-1.1,rx:-.9},1,{ease:lt.out}),qe(Xe.spill.material.uniforms.uI,{value:.85},.3,{ease:lt.out}).then(()=>qe(Xe.spill.material.uniforms.uI,{value:0},1.4,{ease:lt.inOut,delay:.5})),ke.forEach((t,i)=>{t.group.visible=!0,Object.assign(t.pose,{x:xt.x,y:xt.y-Bt*e*.08,z:xt.z+.01-i*.004,rx:0,ry:0,rz:0,s:e*.97}),qe(t.pose,{y:xt.y+Bt*e*.34},.9,{delay:.25+i*.012,ease:lt.out})}),await cr(1.05),n===dn&&(ur=!1,qe(xt,{y:-de.visH*1.25,rz:.35,rx:.7},1,{ease:lt.in}),ke.forEach((t,i)=>qe(t.pose,Ro(i),1.05,{delay:i*.015,ease:lt.inOut})),Dt.swish(),await cr(1.1),n===dn&&(Pn.remove(Xe.group),Xe.dispose(),Xe=null,le="reveal",zt=0,qu(0)))}function qu(n){const e=ke[n],t=ke.length;if(Vr(t,n),n===t-1){le="chaseReady",ui(null),e.glow=0,qe(e,{glow:.55},1.2),sn.tintTarget.setRGB(.55,.32,.18),pn(Bs()?"Something bends the light  ·  tap to turn it":"Something is bending the light  ·  tap to turn it over",300);return}le="reveal";const i=Ri[e.def.rarity].rank;Dt.reveal(n,i),Co(e.def.id),ui(e,n,t);const r=new _e(e.def.accent);sn.tintTarget.copy(r).multiplyScalar(.55),e.glow=0,qe(e,{glow:i>=2||e.pull.foil?.32:.1},.6),R_(e,i>=2||e.pull.foil?90:45,r),pn(n===0?Bs()?"Tilt it  ·  tap for the next card":"Tilt it in the light  ·  tap for the next card":"",600)}async function Yu(){if(le!=="reveal")return;const n=ke[zt];Dt.swish(),n.tiltTarget.set(0,0),qe(n,{glow:0},.4),qe(n.pose,Hu(zt),.62,{ease:lt.inOut,arc:{z:.9}}),n.flyUntil=performance.now()/1e3+.62,zt++;const e=ke[zt];qe(e.pose,Hr({flip:e.pose.flip}),.3,{ease:lt.out}),e.pop=1;for(let t=zt+1;t<ke.length;t++)qe(ke[t].pose,Ro(t-zt),.3);qu(zt)}async function T_(){if(le!=="chaseReady")return;le="chase";const n=dn,e=ke[zt];pn(null),tt.skip.classList.add("gone"),Dt.gather();const t=sn.sky.material.uniforms,i=sn.starMat.uniforms;i.uCenter.value.set(e.pose.x,e.pose.y,0),qe(t.uDim,{value:.25},1.8),qe(i.uSuck,{value:1},2,{ease:lt.in}),qe(e.pose,{z:1.1,s:Js()*.94},1.9,{ease:lt.inOut}),qe(e,{glow:.95},1.9,{ease:lt.in}),qe(nr,{v:1},1.9,{ease:lt.in});const r={v:0};if(qe(r,{v:1},1.9,{onUpdate:()=>Nr=r.v}),await cr(1.95),n!==dn)return;Nr=0,nr.v=0;let s=!1;const{x:a,y:o,z:l,s:c}=Ir(Hr(),.5);qe(e.pose,{flip:0,x:a,y:o,z:l,s:c},1,{ease:lt.outBack,onUpdate:()=>{!s&&e.pose.flip<.5&&(s=!0,e.material.uniforms.uFlash.value=1,qe(e.material.uniforms.uFlash,{value:0},.9,{ease:lt.out}),zs.strength=2,qe(zs,{strength:wo},1.3,{ease:lt.out}),C_(e),Dt.chase())}}),qe(i.uSuck,{value:0},2.4,{ease:lt.out,delay:.2}),qe(t.uDim,{value:.8},2.2,{delay:.3}),qe(e,{glow:.42},1.8,{delay:.3}),await cr(1),n===dn&&(Co(e.def.id),le="chaseHold",ui(e),Vr(ke.length,ke.length),pn(Bs()?"Turn it in the light  ·  tap for your pull":"Turn it in the light  ·  tap to lay out your pull",900))}async function E_(){if(le!=="chaseHold"&&le!=="reveal")return;le="spread";const n=dn;ui(null),Vr(0,-1),pn(null),tt.skip.classList.add("gone"),ke.forEach((e,t)=>{e.tiltTarget.set(0,0),qe(e.pose,Gr(t,ke.length),1,{delay:(ke.length-1-t)*.05,ease:lt.inOut}),qe(e,{glow:e.def.rarity==="holo"?.35:e.pull.foil?.18:0},1)}),Dt.swish(),await cr(1),!(n!==dn||le!=="spread")&&(Po(),pn("Pick up any card to look closer",200))}function Po(){const n=m_();tt.count.innerHTML=`Collection <b>${n.size}</b> / ${yi}`,tt.spread.classList.add("show")}function $u(n){if(le==="spread"){le="inspect",Li=n,Lt&&(Lt.hoverTarget=0),Lt=null,n.hoverTarget=0,Dt.reveal(n.index,Ri[n.def.rarity].rank),qe(n.pose,ku(n),.7,{ease:lt.inOut}),qe(n,{glow:n.def.rarity==="holo"?.45:.3},.6);for(const e of ke)e!==n&&qe(e.material.uniforms.uDim,{value:.3},.5);tt.spread.classList.remove("show"),ui(n,n.index,ke.length),pn("Tap to put it back",400),sn.tintTarget.copy(new _e(n.def.accent)).multiplyScalar(.55)}}function Ku(){if(le!=="inspect")return;const n=Li;Li=null,le="spread",n.tiltTarget.set(0,0),qe(n.pose,Gr(n.index,ke.length),.6,{ease:lt.inOut}),qe(n,{glow:n.def.rarity==="holo"?.35:n.pull.foil?.18:0},.6);for(const e of ke)qe(e.material.uniforms.uDim,{value:1},.5);ui(null),pn(null),Po()}async function b_(){if(le!=="spread")return;le="leaving";const n=dn;tt.spread.classList.remove("show"),pn(null),Dt.swish(),ke.forEach((e,t)=>qe(e.pose,{y:-de.visH*1.4-t*.15,rz:e.pose.rz+(Math.random()-.5)*1.6,rx:.8},.85,{delay:t*.04,ease:lt.in})),await cr(1.1),n===dn&&Vu(!0)}function A_(){le==="boot"||le==="spread"||le==="inspect"||le==="leaving"||le==="chase"||(dn++,Nu(),ir=!1,ur=!1,Xe&&(Pn.remove(Xe.group),Xe.dispose(),Xe=null),Nr=0,nr.v=0,sn.sky.material.uniforms.uDim.value=.85,sn.starMat.uniforms.uSuck.value=0,zs.strength=wo,ke.forEach((n,e)=>{n.flyUntil=0,n.group.visible=!0,Object.assign(n.pose,Gr(e,ke.length)),n.tilt.set(0,0),n.tiltVel.set(0,0),n.material.uniforms.uFlash.value=0,n.material.uniforms.uDim.value=1,n.glow=n.def.rarity==="holo"?.35:n.pull.foil?.18:0,Co(n.def.id)}),zt=ke.length-1,le="spread",ui(null),Vr(0,-1),tt.skip.classList.add("gone"),sn.tintTarget.setRGB(.5,.3,.2),Po(),pn("Pick up any card to look closer",200))}function w_(){const n=xt.s;for(let e=0;e<160;e++){const t=(Math.random()-.5)*Rn;Ze.set(t,(wn-.5)*Bt,.05),Xe.group.localToWorld(Ze),Zt.emit({x:Ze.x,y:Ze.y,z:Ze.z+.1,vx:(Math.random()-.5)*2.4*n*.4,vy:(Math.random()*3+.6)*n*.4,vz:Math.random()*1.2,color:kr(Math.random()).lerp(new _e(1,1,1),.35),size:.4+Math.random()*.8,life:.9+Math.random()*1.2,drag:1.6,gravity:1.6})}}function Zu(n,e){const t=Math.random()*4,i=Math.floor(t),r=t-i,s=.5,a=$t/2;return i===0?e.set(-s+r,a,0):i===1?e.set(s,a-r*$t,0):i===2?e.set(s-r,-a,0):e.set(-s,-a+r*$t,0),n.group.localToWorld(e)}function R_(n,e,t){n.group.updateMatrixWorld(),n.group.getWorldPosition(Ei);for(let i=0;i<e;i++){Zu(n,Ze);const r=Ze.x-Ei.x,s=Ze.y-Ei.y,a=Math.hypot(r,s)||1,o=.6+Math.random()*1.6;Zt.emit({x:Ze.x,y:Ze.y,z:Ze.z+.05,vx:r/a*o,vy:s/a*o,vz:Math.random()*.5,color:Uu(t),size:.35+Math.random()*.65,life:.8+Math.random()*1.1,drag:2.2,gravity:.3})}}function C_(n){n.group.updateMatrixWorld(),n.group.getWorldPosition(Ei);for(let e=0;e<520;e++){const t=Math.random()*Math.PI*2,i=1.5+Math.pow(Math.random(),.6)*7.5;Zt.emit({x:Ei.x+Math.cos(t)*.3,y:Ei.y+Math.sin(t)*.3,z:Ei.z+.3,vx:Math.cos(t)*i,vy:Math.sin(t)*i*.8,vz:(Math.random()-.3)*2,color:Math.random()<.4?new _e(1,.85,.6):kr(t/6.283+Math.random()*.1).lerp(new _e(1,1,1),.25),size:.4+Math.random()*1.1,life:1.2+Math.random()*1.8,drag:1.7,gravity:.5})}}function P_(n,e){n.group.getWorldPosition(Zt.attractor);const t=Math.floor(Nr*150*e+Math.random());for(let i=0;i<t;i++){const r=Math.random()*Math.PI*2,s=de.visH*(.55+Math.random()*.5),a=Zt.attractor.x+Math.cos(r)*s*1.2,o=Zt.attractor.y+Math.sin(r)*s;Zt.emit({x:a,y:o,z:-.5+Math.random(),vx:-Math.sin(r)*1.8,vy:Math.cos(r)*1.8,color:(Math.random()<.5?new _e(1,.8,.5):kr(Math.random())).multiplyScalar(.7),size:.25+Math.random()*.5,life:1.6+Math.random(),drag:.6,pull:9})}}function xc(n,e,t){if(Math.random()>e*t)return;const i=(Math.random()-.5)*.96;Ze.set(i,-$t/2+Math.random()*.25,.01),n.group.localToWorld(Ze),Zt.emit({x:Ze.x,y:Ze.y,z:Ze.z+.05,vx:(Math.random()-.5)*.15,vy:-.05-Math.random()*.2,color:kr(Math.random()).lerp(new _e(1,.95,.85),.4),size:.25+Math.random()*.45,life:2+Math.random()*2,drag:.8,gravity:.35})}const Qn=new ie,ys=new ie;let ks=-10,gt=null;const Hs=new sv,Sc=new Jn(new C(0,0,1),0);function Ju(n){Qn.set(n.clientX/de.w*2-1,-(n.clientY/de.h)*2+1)}function Lo(){return Hs.setFromCamera(Qn,Ln),Sc.constant=-xt.z,Hs.ray.intersectPlane(Sc,Ze)?(Xe.group.worldToLocal(Ze),Ze):null}function ju(){Hs.setFromCamera(Qn,Ln);const n=ke.filter(t=>t.group.visible).map(t=>t.mesh),e=Hs.intersectObjects(n,!1)[0];return e?ke.find(t=>t.mesh===e.object):null}Mr.addEventListener("pointerdown",n=>{var e;if(Dt.unlock(),Ju(n),ks=_t,gt={x:n.clientX,y:n.clientY,t:performance.now(),moved:!1,type:n.pointerType,tear:null},le==="pack"&&Xe){const t=Lo();t&&Math.abs(t.x)<Rn/2+.05&&Math.abs(t.y)<Bt/2+.05&&(gt.tear={lx:t.x},Dt.crinkle(),document.body.classList.add("grab"))}(e=Mr.setPointerCapture)==null||e.call(Mr,n.pointerId)});window.addEventListener("pointermove",n=>{if(Ju(n),ks=_t,gt&&Math.hypot(n.clientX-gt.x,n.clientY-gt.y)>8&&(gt.moved=!0),gt!=null&&gt.tear&&le==="pack"&&Xe&&!ir){const e=Lo();if(e){const t=Math.abs(e.x-gt.tear.lx);gt.tear.lx=e.x,gt.moved&&Wu(ln+t/Rn*1.15)}}n.pointerType==="mouse"&&(le==="spread"||le==="pack")&&L_()});function L_(){if(le==="spread"){const n=ju();n!==Lt&&(Lt&&(Lt.hoverTarget=0),Lt=n,n&&(n.hoverTarget=1,Dt.hover())),document.body.classList.toggle("pointer",!!n)}else if(le==="pack"&&Xe){const n=Lo(),e=n&&Math.abs(n.x)<Rn/2&&Math.abs(n.y)<Bt/2;document.body.classList.toggle("pointer",!!e)}}window.addEventListener("pointerup",n=>{if(document.body.classList.remove("grab"),!gt)return;const e=gt;gt=null;const t=!e.moved&&performance.now()-e.t<600;if(le==="pack"){e.tear&&(t||ln>.35)&&Xu();return}if(!t&&e.type!=="mouse"){const i=n.clientX-e.x;le==="reveal"&&Math.abs(i)>de.w*.18&&Yu();return}t&&Qu()});function Qu(){if(le==="reveal")Yu();else if(le==="chaseReady")T_();else if(le==="chaseHold")E_();else if(le==="spread"){const n=ju();n&&$u(n)}else le==="inspect"&&Ku()}window.addEventListener("keydown",n=>{var t,i;if(n.altKey||n.ctrlKey||n.metaKey)return;const e=n.key===" "||n.key==="Enter";if(!(e&&((i=(t=n.target).closest)!=null&&i.call(t,"button")))){if(le==="spread"){n.key==="ArrowRight"||n.key==="ArrowLeft"?(n.preventDefault(),D_(n.key==="ArrowRight"?1:-1)):e&&Lt&&(n.preventDefault(),$u(Lt));return}e||n.key==="ArrowRight"?(n.preventDefault(),Dt.unlock(),le==="pack"?Xu():Qu()):n.key==="Escape"&&Ku()}});function D_(n){var i,r;(r=(i=document.activeElement)==null?void 0:i.closest)!=null&&r.call(i,"button")&&document.activeElement.blur();const e=ke.slice().sort((s,a)=>s.pose.x-a.pose.x);let t=Lt?e.indexOf(Lt):n>0?-1:e.length;t=(t+n+e.length)%e.length,Lt&&(Lt.hoverTarget=0),Lt=e[t],Lt.hoverTarget=1,Dt.hover()}tt.skip.addEventListener("click",n=>{n.stopPropagation(),Dt.unlock(),A_()});bn("#again").addEventListener("click",n=>{n.stopPropagation(),Dt.unlock(),b_()});function Do(){de.w=window.innerWidth,de.h=window.innerHeight,de.aspect=de.w/de.h,Ot.setPixelRatio(Tn),Ot.setSize(de.w,de.h);const n=Tn<1.5?4:0;for(const e of[ri.renderTarget1,ri.renderTarget2])e.samples!==n&&(e.samples=n,e.dispose());ri.setPixelRatio(Tn),ri.setSize(de.w,de.h),Ln.aspect=de.aspect,Ln.updateProjectionMatrix(),de.visH=2*ci*Math.tan(Ps.degToRad(Ao/2)),de.visW=de.visH*de.aspect,sn.resize(de.w,de.h,Tn),Zt.setScale(de.h,Tn),U_()}function U_(){le==="pack"&&(xt.s=Ou());const n=ke.length;le==="reveal"||le==="chaseReady"||le==="chaseHold"?ke.forEach((e,t)=>{t<zt?Object.assign(e.pose,Hu(t)):t===zt?Object.assign(e.pose,Ir(Hr({flip:e.pose.flip}),e.pose.z)):Object.assign(e.pose,Ro(t-zt))}):(le==="spread"||le==="inspect")&&ke.forEach((e,t)=>{e===Li?Object.assign(e.pose,ku(e)):Object.assign(e.pose,Gr(t,n))})}window.addEventListener("resize",Do);function I_(n){const e=ci-n.group.position.z;return n.pose.s*$t/(2*e*Math.tan(Ps.degToRad(Ao/2)))*de.h*Tn}let ka=0,oo=performance.now()/1e3,xr=0,Sr=1/60;function eh(n){const e=n/1e3,t=e-oo;oo=e;const i=Math.min(t,1/20);_t+=i,ka++,h_(e),t<1&&(Sr+=(t-Sr)*.25),t>.045&&t<.5?xr++:xr=Math.max(0,xr-1),Tn>1&&ka>4&&(Sr>.12||xr>90)&&(Tn=Sr>.12?1:Math.max(1,Tn-.5),xr=0,Sr=1/60,Do()),so.set(-3.4+Math.sin(_t*.31)*1.4,4.4+Math.cos(_t*.23)*.9,8),ys.lerp(Qn,1-Math.exp(-i*4));const r=Oa?0:1;Ln.position.set(ys.x*.3*r,ys.y*.18*r,ci),Ln.lookAt(0,0,0);const s=_t-ks>2.5||gt===null&&ks<0,a=gt&&gt.type!=="mouse",o=!s&&(!gt||gt.type==="mouse"),l=Oa?.25:1,c=(h,f,m)=>{o||a?h.set(-Qn.y*f,Qn.x*m):h.set(Math.sin(_t*.7)*f*.42*l,Math.sin(_t*.5+1)*m*.5*l)};if(Xe){Xe.uniforms.uTime.value=_t,Xe.uniforms.uHover.value=le==="pack"?1:0,le==="pack"?c(Ba,.22,.38):Ba.set(0,0);const h=le==="opening"?Math.min(t,.5):i;za.lerp(Ba,1-Math.exp(-h*5)),Xe.group.position.set(xt.x,xt.y+Math.sin(_t*.9)*.05*xt.s,xt.z),Xe.group.rotation.set(xt.rx+za.x,xt.ry+za.y,xt.rz,"YXZ"),Xe.group.scale.setScalar(xt.s),Xe.strip.position.set(jn.x,(wn-.5)*Bt+(1-wn)*Bt/2+jn.y,jn.z),Xe.strip.rotation.set(jn.rx,0,jn.rz),Xe.strip.visible=jn.y<3}const u=__();for(const h of ke){if(!h.group.visible)continue;h===u?c(h.tiltTarget,.42,.55):le==="spread"&&h===Lt?h.tiltTarget.set(-Qn.y*.12,Qn.x*.16):h.tiltTarget.set(0,0),ur?(h.tilt.set(0,0),h.tiltVel.set(0,0)):h.stepTilt(i),h.hover+=(h.hoverTarget-h.hover)*(1-Math.exp(-i*10)),h.pop*=Math.exp(-i*7),h===u&&le!=="inspect"?h.offset.y=Math.sin(_t*1.1)*.025*h.pose.s:h.offset.y*=.9,nr.v>0&&h===u&&!Oa?h.offset.set((Math.random()-.5)*nr.v*.035,(Math.random()-.5)*nr.v*.035,0):h.offset.x=h.offset.z=0;const m=(le==="reveal"||le==="chaseReady"||le==="chase"||le==="chaseHold")&&h.flyUntil>e,g=h===u&&le!=="inspect";h.mesh.renderOrder=m?3:g?2:0,h.material.depthFunc=m||g?Tc:Cr,h.applyPose(),ur&&Xe&&(Ze.subVectors(h.group.position,Xe.group.position).applyEuler(Xe.group.rotation),h.group.position.copy(Xe.group.position).add(Ze),h.group.quaternion.premultiply(S_.setFromEuler(Xe.group.rotation))),h.setTime(_t)}for(const h of ke){if(!h.group.visible||(le==="reveal"||le==="chaseReady")&&h.index>zt)continue;const m=I_(h)>480;(m||(ka+h.index)%2===0||!h.artFresh.lo)&&(h.updateViewTilt(Ln),h.renderArt(Ot,_t,m))}Nr>0&&u&&P_(u,i);for(const h of ke)!h.group.visible||h.pose.flip>.5||(h.def.rarity==="holo"&&(le==="chaseHold"||le==="spread"||h===Li)?xc(h,7,i):h.pull.foil&&(h===u||le==="spread")&&xc(h,1.5,i));le==="chaseReady"&&u&&(u.glow=.5+.18*Math.sin(_t*3.2),Math.random()<i*30&&(Zu(u,Ze),Zt.emit({x:Ze.x,y:Ze.y,z:Ze.z+.05,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,color:kr(Math.random()),size:.3+Math.random()*.5,life:.8+Math.random()*.6,drag:1.5}))),Zt.update(i,_t),sn.update(i,_t,ys),sn.paint(Ot),Fu.uniforms.uTime.value=_t,ri.render(),requestAnimationFrame(eh)}async function N_(){Do();try{await Promise.race([Promise.all([document.fonts.load("600 50px Jost"),document.fonts.load("500 30px Jost"),document.fonts.load("400 24px Jost"),document.fonts.load('italic 500 32px "Cormorant Garamond"')]),new Promise(n=>setTimeout(n,3e3))])}catch{}Bv(Ot,kv),Vu(!1),requestAnimationFrame(n=>{oo=n/1e3,eh(n)}),requestAnimationFrame(()=>document.body.classList.add("ready"))}N_();
