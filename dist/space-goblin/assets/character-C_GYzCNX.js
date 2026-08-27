(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const pc="160",Qi={ROTATE:0,DOLLY:1,PAN:2},ts={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Sd=0,qc=1,Ed=2,nu=1,wd=2,Zn=3,bi=0,un=1,Mn=2,vi=0,Us=1,Yc=2,jc=3,$c=4,Td=5,Bi=100,Ad=101,Rd=102,Kc=103,Zc=104,Cd=200,Pd=201,Ld=202,Id=203,Za=204,Ja=205,Dd=206,Ud=207,Nd=208,Fd=209,Od=210,Bd=211,zd=212,kd=213,Vd=214,Hd=0,Gd=1,Wd=2,vo=3,Xd=4,qd=5,Yd=6,jd=7,iu=0,$d=1,Kd=2,Mi=0,Zd=1,Jd=2,Qd=3,tf=4,ef=5,nf=6,Jc="attached",sf="detached",su=300,Bs=301,zs=302,Mo=303,Qa=304,Uo=306,ks=1e3,In=1001,tc=1002,We=1003,Qc=1004,Go=1005,Sn=1006,rf=1007,_r=1008,yi=1009,of=1010,af=1011,mc=1012,ru=1013,gi=1014,Jn=1015,xr=1016,ou=1017,au=1018,Gi=1020,cf=1021,wn=1023,lf=1024,hf=1025,Wi=1026,Vs=1027,uf=1028,cu=1029,df=1030,lu=1031,hu=1033,Wo=33776,Xo=33777,qo=33778,Yo=33779,tl=35840,el=35841,nl=35842,il=35843,uu=36196,sl=37492,rl=37496,ol=37808,al=37809,cl=37810,ll=37811,hl=37812,ul=37813,dl=37814,fl=37815,pl=37816,ml=37817,gl=37818,_l=37819,xl=37820,vl=37821,jo=36492,Ml=36494,yl=36495,ff=36283,bl=36284,Sl=36285,El=36286,ec=2200,pf=2201,mf=2202,yo=2300,bo=2301,$o=2302,Cs=2400,Ps=2401,So=2402,gc=2500,gf=2501,du=3e3,Xi=3001,_f=3200,xf=3201,fu=0,vf=1,Tn="",Oe="srgb",ei="srgb-linear",_c="display-p3",No="display-p3-linear",Eo="linear",xe="srgb",wo="rec709",To="p3",es=7680,wl=519,Mf=512,yf=513,bf=514,pu=515,Sf=516,Ef=517,wf=518,Tf=519,nc=35044,vr=35048,Tl="300 es",ic=1035,Qn=2e3,Ao=2001;class Ti{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Al=1234567;const pr=Math.PI/180,Mr=180/Math.PI;function Un(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(qe[i&255]+qe[i>>8&255]+qe[i>>16&255]+qe[i>>24&255]+"-"+qe[t&255]+qe[t>>8&255]+"-"+qe[t>>16&15|64]+qe[t>>24&255]+"-"+qe[e&63|128]+qe[e>>8&255]+"-"+qe[e>>16&255]+qe[e>>24&255]+qe[n&255]+qe[n>>8&255]+qe[n>>16&255]+qe[n>>24&255]).toLowerCase()}function Be(i,t,e){return Math.max(t,Math.min(e,i))}function xc(i,t){return(i%t+t)%t}function Af(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Rf(i,t,e){return i!==t?(e-i)/(t-i):0}function mr(i,t,e){return(1-e)*i+e*t}function Cf(i,t,e,n){return mr(i,t,1-Math.exp(-e*n))}function Pf(i,t=1){return t-Math.abs(xc(i,t*2)-t)}function Lf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function If(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Df(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Uf(i,t){return i+Math.random()*(t-i)}function Nf(i){return i*(.5-Math.random())}function Ff(i){i!==void 0&&(Al=i);let t=Al+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Of(i){return i*pr}function Bf(i){return i*Mr}function sc(i){return(i&i-1)===0&&i!==0}function zf(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ro(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function kf(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),l=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*g,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*g,o*l);break;case"ZYZ":i.set(c*g,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Bn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function le(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const dn={DEG2RAD:pr,RAD2DEG:Mr,generateUUID:Un,clamp:Be,euclideanModulo:xc,mapLinear:Af,inverseLerp:Rf,lerp:mr,damp:Cf,pingpong:Pf,smoothstep:Lf,smootherstep:If,randInt:Df,randFloat:Uf,randFloatSpread:Nf,seededRandom:Ff,degToRad:Of,radToDeg:Bf,isPowerOfTwo:sc,ceilPowerOfTwo:zf,floorPowerOfTwo:Ro,setQuaternionFromProperEuler:kf,normalize:le,denormalize:Bn};class ot{constructor(t=0,e=0){ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class te{constructor(t,e,n,s,r,a,o,c,l){te.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l)}set(t,e,n,s,r,a,o,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],v=s[1],x=s[4],S=s[7],w=s[2],T=s[5],E=s[8];return r[0]=a*_+o*v+c*w,r[3]=a*m+o*x+c*T,r[6]=a*p+o*S+c*E,r[1]=l*_+h*v+u*w,r[4]=l*m+h*x+u*T,r[7]=l*p+h*S+u*E,r[2]=d*_+f*v+g*w,r[5]=d*m+f*x+g*T,r[8]=d*p+f*S+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-o*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-s*l,s*c,-s*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ko.makeScale(t,e)),this}rotate(t){return this.premultiply(Ko.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ko.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ko=new te;function mu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Co(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vf(){const i=Co("canvas");return i.style.display="block",i}const Rl={};function gr(i){i in Rl||(Rl[i]=!0,console.warn(i))}const Cl=new te().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Pl=new te().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Rr={[ei]:{transfer:Eo,primaries:wo,toReference:i=>i,fromReference:i=>i},[Oe]:{transfer:xe,primaries:wo,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[No]:{transfer:Eo,primaries:To,toReference:i=>i.applyMatrix3(Pl),fromReference:i=>i.applyMatrix3(Cl)},[_c]:{transfer:xe,primaries:To,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Pl),fromReference:i=>i.applyMatrix3(Cl).convertLinearToSRGB()}},Hf=new Set([ei,No]),he={enabled:!0,_workingColorSpace:ei,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Hf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Rr[t].toReference,s=Rr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Rr[i].primaries},getTransfer:function(i){return i===Tn?Eo:Rr[i].transfer}};function Ns(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Zo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ns;class gu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ns===void 0&&(ns=Co("canvas")),ns.width=t.width,ns.height=t.height;const n=ns.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ns}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Co("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ns(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ns(e[n]/255)*255):e[n]=Ns(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Gf=0;class _u{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=Un(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Jo(s[a].image)):r.push(Jo(s[a]))}else r=Jo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Jo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?gu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wf=0;class en extends Ti{constructor(t=en.DEFAULT_IMAGE,e=en.DEFAULT_MAPPING,n=In,s=In,r=Sn,a=_r,o=wn,c=yi,l=en.DEFAULT_ANISOTROPY,h=Tn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wf++}),this.uuid=Un(),this.name="",this.source=new _u(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(gr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Xi?Oe:Tn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==su)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ks:t.x=t.x-Math.floor(t.x);break;case In:t.x=t.x<0?0:1;break;case tc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ks:t.y=t.y-Math.floor(t.y);break;case In:t.y=t.y<0?0:1;break;case tc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return gr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Oe?Xi:du}set encoding(t){gr("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Xi?Oe:Tn}}en.DEFAULT_IMAGE=null;en.DEFAULT_MAPPING=su;en.DEFAULT_ANISOTROPY=1;class Ie{constructor(t=0,e=0,n=0,s=1){Ie.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,S=(f+1)/2,w=(p+1)/2,T=(h+d)/4,E=(u+_)/4,A=(g+m)/4;return x>S&&x>w?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=T/n,r=E/n):S>w?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=T/s,r=A/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=E/r,s=A/r),this.set(n,s,r,e),this}let v=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(u-_)/v,this.z=(d-h)/v,this.w=Math.acos((l+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xf extends Ti{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ie(0,0,t,e),this.scissorTest=!1,this.viewport=new Ie(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(gr("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Xi?Oe:Tn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new en(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new _u(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Yi extends Xf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class xu extends en{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=In,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qf extends en{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=In,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ie{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==f||h!==g){let m=1-o;const p=c*d+l*f+h*g+u*_,v=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),T=Math.atan2(w,p*v);m=Math.sin(m*T)/w,o=Math.sin(o*T)/w}const S=o*v;if(c=c*m+d*S,l=l*m+f*S,h=h*m+g*S,u=u*m+_*S,m===1-o){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-o*f,t[e+2]=l*g+h*f+o*d-c*u,t[e+3]=h*g-o*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Be(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class b{constructor(t=0,e=0,n=0){b.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ll.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ll.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*s-o*n),h=2*(o*e-r*s),u=2*(r*n-a*e);return this.x=e+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Qo.copy(this).projectOnVector(t),this.sub(Qo)}reflect(t){return this.sub(Qo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Be(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qo=new b,Ll=new ie;class Ai{constructor(t=new b(1/0,1/0,1/0),e=new b(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(An.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(An.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=An.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,An):An.fromBufferAttribute(r,a),An.applyMatrix4(t.matrixWorld),this.expandByPoint(An);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Cr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cr.copy(n.boundingBox)),Cr.applyMatrix4(t.matrixWorld),this.union(Cr)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,An),An.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(tr),Pr.subVectors(this.max,tr),is.subVectors(t.a,tr),ss.subVectors(t.b,tr),rs.subVectors(t.c,tr),si.subVectors(ss,is),ri.subVectors(rs,ss),Li.subVectors(is,rs);let e=[0,-si.z,si.y,0,-ri.z,ri.y,0,-Li.z,Li.y,si.z,0,-si.x,ri.z,0,-ri.x,Li.z,0,-Li.x,-si.y,si.x,0,-ri.y,ri.x,0,-Li.y,Li.x,0];return!ta(e,is,ss,rs,Pr)||(e=[1,0,0,0,1,0,0,0,1],!ta(e,is,ss,rs,Pr))?!1:(Lr.crossVectors(si,ri),e=[Lr.x,Lr.y,Lr.z],ta(e,is,ss,rs,Pr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,An).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(An).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Xn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Xn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Xn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Xn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Xn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Xn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Xn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Xn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Xn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Xn=[new b,new b,new b,new b,new b,new b,new b,new b],An=new b,Cr=new Ai,is=new b,ss=new b,rs=new b,si=new b,ri=new b,Li=new b,tr=new b,Pr=new b,Lr=new b,Ii=new b;function ta(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Ii.fromArray(i,r);const o=s.x*Math.abs(Ii.x)+s.y*Math.abs(Ii.y)+s.z*Math.abs(Ii.z),c=t.dot(Ii),l=e.dot(Ii),h=n.dot(Ii);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Yf=new Ai,er=new b,ea=new b;class ii{constructor(t=new b,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Yf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;er.subVectors(t,this.center);const e=er.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(er,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ea.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(er.copy(t.center).add(ea)),this.expandByPoint(er.copy(t.center).sub(ea))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qn=new b,na=new b,Ir=new b,oi=new b,ia=new b,Dr=new b,sa=new b;class Sr{constructor(t=new b,e=new b(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,qn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=qn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(qn.copy(this.origin).addScaledVector(this.direction,e),qn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){na.copy(t).add(e).multiplyScalar(.5),Ir.copy(e).sub(t).normalize(),oi.copy(this.origin).sub(na);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ir),o=oi.dot(this.direction),c=-oi.dot(Ir),l=oi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(na).addScaledVector(Ir,d),f}intersectSphere(t,e){qn.subVectors(t.center,this.origin);const n=qn.dot(this.direction),s=qn.dot(qn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,qn)!==null}intersectTriangle(t,e,n,s,r){ia.subVectors(e,t),Dr.subVectors(n,t),sa.crossVectors(ia,Dr);let a=this.direction.dot(sa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;oi.subVectors(this.origin,t);const c=o*this.direction.dot(Dr.crossVectors(oi,Dr));if(c<0)return null;const l=o*this.direction.dot(ia.cross(oi));if(l<0||c+l>a)return null;const h=-o*oi.dot(sa);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class qt{constructor(t,e,n,s,r,a,o,c,l,h,u,d,f,g,_,m){qt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,l,h,u,d,f,g,_,m)}set(t,e,n,s,r,a,o,c,l,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new qt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/os.setFromMatrixColumn(t,0).length(),r=1/os.setFromMatrixColumn(t,1).length(),a=1/os.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-_*l,e[9]=-o*c,e[2]=_-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d+_*o,e[4]=g*o-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=_+d*o,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=f*l-g,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=o*c,_=o*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(jf,t,$f)}lookAt(t,e,n){const s=this.elements;return gn.subVectors(t,e),gn.lengthSq()===0&&(gn.z=1),gn.normalize(),ai.crossVectors(n,gn),ai.lengthSq()===0&&(Math.abs(n.z)===1?gn.x+=1e-4:gn.z+=1e-4,gn.normalize(),ai.crossVectors(n,gn)),ai.normalize(),Ur.crossVectors(gn,ai),s[0]=ai.x,s[4]=Ur.x,s[8]=gn.x,s[1]=ai.y,s[5]=Ur.y,s[9]=gn.y,s[2]=ai.z,s[6]=Ur.z,s[10]=gn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],v=n[3],x=n[7],S=n[11],w=n[15],T=s[0],E=s[4],A=s[8],M=s[12],y=s[1],C=s[5],U=s[9],H=s[13],P=s[2],F=s[6],B=s[10],N=s[14],z=s[3],D=s[7],G=s[11],q=s[15];return r[0]=a*T+o*y+c*P+l*z,r[4]=a*E+o*C+c*F+l*D,r[8]=a*A+o*U+c*B+l*G,r[12]=a*M+o*H+c*N+l*q,r[1]=h*T+u*y+d*P+f*z,r[5]=h*E+u*C+d*F+f*D,r[9]=h*A+u*U+d*B+f*G,r[13]=h*M+u*H+d*N+f*q,r[2]=g*T+_*y+m*P+p*z,r[6]=g*E+_*C+m*F+p*D,r[10]=g*A+_*U+m*B+p*G,r[14]=g*M+_*H+m*N+p*q,r[3]=v*T+x*y+S*P+w*z,r[7]=v*E+x*C+S*F+w*D,r[11]=v*A+x*U+S*B+w*G,r[15]=v*M+x*H+S*N+w*q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*l*u-r*o*d+n*l*d+s*o*f-n*c*f)+_*(+e*c*f-e*l*d+r*a*d-s*a*f+s*l*h-r*c*h)+m*(+e*l*u-e*o*f-r*a*u+n*a*f+r*o*h-n*l*h)+p*(-s*o*h-e*c*u+e*o*d+s*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=u*m*l-_*d*l+_*c*f-o*m*f-u*c*p+o*d*p,x=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,S=h*_*l-g*u*l+g*o*f-a*_*f-h*o*p+a*u*p,w=g*u*c-h*_*c-g*o*d+a*_*d+h*o*m-a*u*m,T=e*v+n*x+s*S+r*w;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/T;return t[0]=v*E,t[1]=(_*d*r-u*m*r-_*s*f+n*m*f+u*s*p-n*d*p)*E,t[2]=(o*m*r-_*c*r+_*s*l-n*m*l-o*s*p+n*c*p)*E,t[3]=(u*c*r-o*d*r-u*s*l+n*d*l+o*s*f-n*c*f)*E,t[4]=x*E,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*E,t[6]=(g*c*r-a*m*r-g*s*l+e*m*l+a*s*p-e*c*p)*E,t[7]=(a*d*r-h*c*r+h*s*l-e*d*l-a*s*f+e*c*f)*E,t[8]=S*E,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*E,t[10]=(a*_*r-g*o*r+g*n*l-e*_*l-a*n*p+e*o*p)*E,t[11]=(h*o*r-a*u*r-h*n*l+e*u*l+a*n*f-e*o*f)*E,t[12]=w*E,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*E,t[14]=(g*o*s-a*_*s-g*n*c+e*_*c+a*n*m-e*o*m)*E,t[15]=(a*u*s-h*o*s+h*n*c-e*u*c-a*n*d+e*o*d)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,g=r*u,_=a*h,m=a*u,p=o*u,v=c*l,x=c*h,S=c*u,w=n.x,T=n.y,E=n.z;return s[0]=(1-(_+p))*w,s[1]=(f+S)*w,s[2]=(g-x)*w,s[3]=0,s[4]=(f-S)*T,s[5]=(1-(d+p))*T,s[6]=(m+v)*T,s[7]=0,s[8]=(g+x)*E,s[9]=(m-v)*E,s[10]=(1-(d+_))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=os.set(s[0],s[1],s[2]).length();const a=os.set(s[4],s[5],s[6]).length(),o=os.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Rn.copy(this);const l=1/r,h=1/a,u=1/o;return Rn.elements[0]*=l,Rn.elements[1]*=l,Rn.elements[2]*=l,Rn.elements[4]*=h,Rn.elements[5]*=h,Rn.elements[6]*=h,Rn.elements[8]*=u,Rn.elements[9]*=u,Rn.elements[10]*=u,e.setFromRotationMatrix(Rn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Qn){const c=this.elements,l=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(o===Qn)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Ao)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Qn){const c=this.elements,l=1/(e-t),h=1/(n-s),u=1/(a-r),d=(e+t)*l,f=(n+s)*h;let g,_;if(o===Qn)g=(a+r)*u,_=-2*u;else if(o===Ao)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const os=new b,Rn=new qt,jf=new b(0,0,0),$f=new b(1,1,1),ai=new b,Ur=new b,gn=new b,Il=new qt,Dl=new ie;class Si{constructor(t=0,e=0,n=0,s=Si.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Be(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Be(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Be(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Be(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Be(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Be(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Il.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Il,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Dl.setFromEuler(this),this.setFromQuaternion(Dl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Si.DEFAULT_ORDER="XYZ";class vu{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Kf=0;const Ul=new b,as=new ie,Yn=new qt,Nr=new b,nr=new b,Zf=new b,Jf=new ie,Nl=new b(1,0,0),Fl=new b(0,1,0),Ol=new b(0,0,1),Qf={type:"added"},tp={type:"removed"};class Ae extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=Un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ae.DEFAULT_UP.clone();const t=new b,e=new Si,n=new ie,s=new b(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new qt},normalMatrix:{value:new te}}),this.matrix=new qt,this.matrixWorld=new qt,this.matrixAutoUpdate=Ae.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return as.setFromAxisAngle(t,e),this.quaternion.multiply(as),this}rotateOnWorldAxis(t,e){return as.setFromAxisAngle(t,e),this.quaternion.premultiply(as),this}rotateX(t){return this.rotateOnAxis(Nl,t)}rotateY(t){return this.rotateOnAxis(Fl,t)}rotateZ(t){return this.rotateOnAxis(Ol,t)}translateOnAxis(t,e){return Ul.copy(t).applyQuaternion(this.quaternion),this.position.add(Ul.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nl,t)}translateY(t){return this.translateOnAxis(Fl,t)}translateZ(t){return this.translateOnAxis(Ol,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Yn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Nr.copy(t):Nr.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yn.lookAt(nr,Nr,this.up):Yn.lookAt(Nr,nr,this.up),this.quaternion.setFromRotationMatrix(Yn),s&&(Yn.extractRotation(s.matrixWorld),as.setFromRotationMatrix(Yn),this.quaternion.premultiply(as.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Qf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(tp)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Yn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Yn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Yn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,t,Zf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,Jf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++){const o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ae.DEFAULT_UP=new b(0,1,0);Ae.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Cn=new b,jn=new b,ra=new b,$n=new b,cs=new b,ls=new b,Bl=new b,oa=new b,aa=new b,ca=new b;let Fr=!1;class En{constructor(t=new b,e=new b,n=new b){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Cn.subVectors(t,e),s.cross(Cn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Cn.subVectors(s,e),jn.subVectors(n,e),ra.subVectors(t,e);const a=Cn.dot(Cn),o=Cn.dot(jn),c=Cn.dot(ra),l=jn.dot(jn),h=jn.dot(ra),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,$n)===null?!1:$n.x>=0&&$n.y>=0&&$n.x+$n.y<=1}static getUV(t,e,n,s,r,a,o,c){return Fr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Fr=!0),this.getInterpolation(t,e,n,s,r,a,o,c)}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,$n)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,$n.x),c.addScaledVector(a,$n.y),c.addScaledVector(o,$n.z),c)}static isFrontFacing(t,e,n,s){return Cn.subVectors(n,e),jn.subVectors(t,e),Cn.cross(jn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Cn.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),Cn.cross(jn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return En.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return En.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Fr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Fr=!0),En.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return En.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return En.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return En.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;cs.subVectors(s,n),ls.subVectors(r,n),oa.subVectors(t,n);const c=cs.dot(oa),l=ls.dot(oa);if(c<=0&&l<=0)return e.copy(n);aa.subVectors(t,s);const h=cs.dot(aa),u=ls.dot(aa);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(cs,a);ca.subVectors(t,r);const f=cs.dot(ca),g=ls.dot(ca);if(g>=0&&f<=g)return e.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),e.copy(n).addScaledVector(ls,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Bl.subVectors(r,s),o=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Bl,o);const p=1/(m+_+d);return a=_*p,o=d*p,e.copy(n).addScaledVector(cs,a).addScaledVector(ls,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Mu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ci={h:0,s:0,l:0},Or={h:0,s:0,l:0};function la(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Oe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=he.workingColorSpace){if(t=xc(t,1),e=Be(e,0,1),n=Be(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=la(a,r,t+1/3),this.g=la(a,r,t),this.b=la(a,r,t-1/3)}return he.toWorkingColorSpace(this,s),this}setStyle(t,e=Oe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Oe){const n=Mu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ns(t.r),this.g=Ns(t.g),this.b=Ns(t.b),this}copyLinearToSRGB(t){return this.r=Zo(t.r),this.g=Zo(t.g),this.b=Zo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Oe){return he.fromWorkingColorSpace(Ye.copy(this),t),Math.round(Be(Ye.r*255,0,255))*65536+Math.round(Be(Ye.g*255,0,255))*256+Math.round(Be(Ye.b*255,0,255))}getHexString(t=Oe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace(Ye.copy(this),e);const n=Ye.r,s=Ye.g,r=Ye.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace(Ye.copy(this),e),t.r=Ye.r,t.g=Ye.g,t.b=Ye.b,t}getStyle(t=Oe){he.fromWorkingColorSpace(Ye.copy(this),t);const e=Ye.r,n=Ye.g,s=Ye.b;return t!==Oe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(ci),this.setHSL(ci.h+t,ci.s+e,ci.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ci),t.getHSL(Or);const n=mr(ci.h,Or.h,e),s=mr(ci.s,Or.s,e),r=mr(ci.l,Or.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ye=new Xt;Xt.NAMES=Mu;let ep=0;class Ri extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ep++}),this.uuid=Un(),this.name="",this.type="Material",this.blending=Us,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Za,this.blendDst=Ja,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=vo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=wl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=es,this.stencilZFail=es,this.stencilZPass=es,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Us&&(n.blending=this.blending),this.side!==bi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Za&&(n.blendSrc=this.blendSrc),this.blendDst!==Ja&&(n.blendDst=this.blendDst),this.blendEquation!==Bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==vo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==wl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==es&&(n.stencilFail=this.stencilFail),this.stencilZFail!==es&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==es&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class vc extends Ri{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=iu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ue=new b,Br=new ot;class re{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=nc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Jn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Br.fromBufferAttribute(this,e),Br.applyMatrix3(t),this.setXY(e,Br.x,Br.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix3(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyMatrix4(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.applyNormalMatrix(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ue.fromBufferAttribute(this,e),Ue.transformDirection(t),this.setXYZ(e,Ue.x,Ue.y,Ue.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=le(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Bn(e,this.array)),e}setX(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Bn(e,this.array)),e}setY(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Bn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Bn(e,this.array)),e}setW(t,e){return this.normalized&&(e=le(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=le(e,this.array),n=le(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=le(e,this.array),n=le(n,this.array),s=le(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=le(e,this.array),n=le(n,this.array),s=le(s,this.array),r=le(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==nc&&(t.usage=this.usage),t}}class yu extends re{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class bu extends re{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Jt extends re{constructor(t,e,n){super(new Float32Array(t),e,n)}}let np=0;const bn=new qt,ha=new Ae,hs=new b,_n=new Ai,ir=new Ai,Ge=new b;class de extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=Un(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mu(t)?bu:yu)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new te().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return bn.makeRotationFromQuaternion(t),this.applyMatrix4(bn),this}rotateX(t){return bn.makeRotationX(t),this.applyMatrix4(bn),this}rotateY(t){return bn.makeRotationY(t),this.applyMatrix4(bn),this}rotateZ(t){return bn.makeRotationZ(t),this.applyMatrix4(bn),this}translate(t,e,n){return bn.makeTranslation(t,e,n),this.applyMatrix4(bn),this}scale(t,e,n){return bn.makeScale(t,e,n),this.applyMatrix4(bn),this}lookAt(t){return ha.lookAt(t),ha.updateMatrix(),this.applyMatrix4(ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hs).negate(),this.translate(hs.x,hs.y,hs.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Jt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ai);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new b(-1/0,-1/0,-1/0),new b(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];_n.setFromBufferAttribute(r),this.morphTargetsRelative?(Ge.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Ge),Ge.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Ge)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ii);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new b,1/0);return}if(t){const n=this.boundingSphere.center;if(_n.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ir.setFromBufferAttribute(o),this.morphTargetsRelative?(Ge.addVectors(_n.min,ir.min),_n.expandByPoint(Ge),Ge.addVectors(_n.max,ir.max),_n.expandByPoint(Ge)):(_n.expandByPoint(ir.min),_n.expandByPoint(ir.max))}_n.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ge.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ge));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ge.fromBufferAttribute(o,l),c&&(hs.fromBufferAttribute(t,l),Ge.add(hs)),s=Math.max(s,n.distanceToSquared(Ge))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new re(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let y=0;y<o;y++)l[y]=new b,h[y]=new b;const u=new b,d=new b,f=new b,g=new ot,_=new ot,m=new ot,p=new b,v=new b;function x(y,C,U){u.fromArray(s,y*3),d.fromArray(s,C*3),f.fromArray(s,U*3),g.fromArray(a,y*2),_.fromArray(a,C*2),m.fromArray(a,U*2),d.sub(u),f.sub(u),_.sub(g),m.sub(g);const H=1/(_.x*m.y-m.x*_.y);isFinite(H)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-_.y).multiplyScalar(H),v.copy(f).multiplyScalar(_.x).addScaledVector(d,-m.x).multiplyScalar(H),l[y].add(p),l[C].add(p),l[U].add(p),h[y].add(v),h[C].add(v),h[U].add(v))}let S=this.groups;S.length===0&&(S=[{start:0,count:n.length}]);for(let y=0,C=S.length;y<C;++y){const U=S[y],H=U.start,P=U.count;for(let F=H,B=H+P;F<B;F+=3)x(n[F+0],n[F+1],n[F+2])}const w=new b,T=new b,E=new b,A=new b;function M(y){E.fromArray(r,y*3),A.copy(E);const C=l[y];w.copy(C),w.sub(E.multiplyScalar(E.dot(C))).normalize(),T.crossVectors(A,C);const H=T.dot(h[y])<0?-1:1;c[y*4]=w.x,c[y*4+1]=w.y,c[y*4+2]=w.z,c[y*4+3]=H}for(let y=0,C=S.length;y<C;++y){const U=S[y],H=U.start,P=U.count;for(let F=H,B=H+P;F<B;F+=3)M(n[F+0]),M(n[F+1]),M(n[F+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new re(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new b,r=new b,a=new b,o=new b,c=new b,l=new b,h=new b,u=new b;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ge.fromBufferAttribute(t,e),Ge.normalize(),t.setXYZ(e,Ge.x,Ge.y,Ge.z)}toNonIndexed(){function t(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new re(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new de,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=t(c,n);e.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zl=new qt,Di=new Sr,zr=new ii,kl=new b,us=new b,ds=new b,fs=new b,ua=new b,kr=new b,Vr=new ot,Hr=new ot,Gr=new ot,Vl=new b,Hl=new b,Gl=new b,Wr=new b,Xr=new b;class je extends Ae{constructor(t=new de,e=new vc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){kr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(ua.fromBufferAttribute(u,t),a?kr.addScaledVector(ua,h):kr.addScaledVector(ua.sub(e),h))}e.add(kr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zr.copy(n.boundingSphere),zr.applyMatrix4(r),Di.copy(t.ray).recast(t.near),!(zr.containsPoint(Di.origin)===!1&&(Di.intersectSphere(zr,kl)===null||Di.origin.distanceToSquared(kl)>(t.far-t.near)**2))&&(zl.copy(r).invert(),Di.copy(t.ray).applyMatrix4(zl),!(n.boundingBox!==null&&Di.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Di)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),x=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let S=v,w=x;S<w;S+=3){const T=o.getX(S),E=o.getX(S+1),A=o.getX(S+2);s=qr(this,p,t,n,l,h,u,T,E,A),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=o.getX(m),x=o.getX(m+1),S=o.getX(m+2);s=qr(this,a,t,n,l,h,u,v,x,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],v=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let S=v,w=x;S<w;S+=3){const T=S,E=S+1,A=S+2;s=qr(this,p,t,n,l,h,u,T,E,A),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const v=m,x=m+1,S=m+2;s=qr(this,a,t,n,l,h,u,v,x,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function ip(i,t,e,n,s,r,a,o){let c;if(t.side===un?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===bi,o),c===null)return null;Xr.copy(o),Xr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Xr);return l<e.near||l>e.far?null:{distance:l,point:Xr.clone(),object:i}}function qr(i,t,e,n,s,r,a,o,c,l){i.getVertexPosition(o,us),i.getVertexPosition(c,ds),i.getVertexPosition(l,fs);const h=ip(i,t,e,n,us,ds,fs,Wr);if(h){s&&(Vr.fromBufferAttribute(s,o),Hr.fromBufferAttribute(s,c),Gr.fromBufferAttribute(s,l),h.uv=En.getInterpolation(Wr,us,ds,fs,Vr,Hr,Gr,new ot)),r&&(Vr.fromBufferAttribute(r,o),Hr.fromBufferAttribute(r,c),Gr.fromBufferAttribute(r,l),h.uv1=En.getInterpolation(Wr,us,ds,fs,Vr,Hr,Gr,new ot),h.uv2=h.uv1),a&&(Vl.fromBufferAttribute(a,o),Hl.fromBufferAttribute(a,c),Gl.fromBufferAttribute(a,l),h.normal=En.getInterpolation(Wr,us,ds,fs,Vl,Hl,Gl,new b),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new b,materialIndex:0};En.getNormal(us,ds,fs,u.normal),h.face=u}return h}class Xs extends de{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Jt(l,3)),this.setAttribute("normal",new Jt(h,3)),this.setAttribute("uv",new Jt(u,2));function g(_,m,p,v,x,S,w,T,E,A,M){const y=S/E,C=w/A,U=S/2,H=w/2,P=T/2,F=E+1,B=A+1;let N=0,z=0;const D=new b;for(let G=0;G<B;G++){const q=G*C-H;for(let Z=0;Z<F;Z++){const X=Z*y-U;D[_]=X*v,D[m]=q*x,D[p]=P,l.push(D.x,D.y,D.z),D[_]=0,D[m]=0,D[p]=T>0?1:-1,h.push(D.x,D.y,D.z),u.push(Z/E),u.push(1-G/A),N+=1}}for(let G=0;G<A;G++)for(let q=0;q<E;q++){const Z=d+q+F*G,X=d+q+F*(G+1),j=d+(q+1)+F*(G+1),Q=d+(q+1)+F*G;c.push(Z,X,Q),c.push(X,j,Q),z+=6}o.addGroup(f,z,M),f+=z,d+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Hs(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Je(i){const t={};for(let e=0;e<i.length;e++){const n=Hs(i[e]);for(const s in n)t[s]=n[s]}return t}function sp(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Su(i){return i.getRenderTarget()===null?i.outputColorSpace:he.workingColorSpace}const rp={clone:Hs,merge:Je};var op=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ap=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ji extends Ri{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=op,this.fragmentShader=ap,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Hs(t.uniforms),this.uniformsGroups=sp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Eu extends Ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new qt,this.projectionMatrix=new qt,this.projectionMatrixInverse=new qt,this.coordinateSystem=Qn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ln extends Eu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Mr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(pr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Mr*2*Math.atan(Math.tan(pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(pr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ps=-90,ms=1;class cp extends Ae{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ln(ps,ms,t,e);s.layers=this.layers,this.add(s);const r=new Ln(ps,ms,t,e);r.layers=this.layers,this.add(r);const a=new Ln(ps,ms,t,e);a.layers=this.layers,this.add(a);const o=new Ln(ps,ms,t,e);o.layers=this.layers,this.add(o);const c=new Ln(ps,ms,t,e);c.layers=this.layers,this.add(c);const l=new Ln(ps,ms,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(const l of e)this.remove(l);if(t===Qn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ao)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class wu extends en{constructor(t,e,n,s,r,a,o,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Bs,super(t,e,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class lp extends Yi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(gr("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Xi?Oe:Tn),this.texture=new wu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Xs(5,5,5),r=new ji({name:"CubemapFromEquirect",uniforms:Hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:un,blending:vi});r.uniforms.tEquirect.value=e;const a=new je(s,r),o=e.minFilter;return e.minFilter===_r&&(e.minFilter=Sn),new cp(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const da=new b,hp=new b,up=new te;class pi{constructor(t=new b(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=da.subVectors(n,e).cross(hp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(da),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||up.getNormalMatrix(t),s=this.coplanarPoint(da).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ui=new ii,Yr=new b;class Mc{constructor(t=new pi,e=new pi,n=new pi,s=new pi,r=new pi,a=new pi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Qn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],_=s[10],m=s[11],p=s[12],v=s[13],x=s[14],S=s[15];if(n[0].setComponents(c-r,d-l,m-f,S-p).normalize(),n[1].setComponents(c+r,d+l,m+f,S+p).normalize(),n[2].setComponents(c+a,d+h,m+g,S+v).normalize(),n[3].setComponents(c-a,d-h,m-g,S-v).normalize(),n[4].setComponents(c-o,d-u,m-_,S-x).normalize(),e===Qn)n[5].setComponents(c+o,d+u,m+_,S+x).normalize();else if(e===Ao)n[5].setComponents(o,u,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ui)}intersectsSprite(t){return Ui.center.set(0,0,0),Ui.radius=.7071067811865476,Ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ui)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Yr.x=s.normal.x>0?t.max.x:t.min.x,Yr.y=s.normal.y>0?t.max.y:t.min.y,Yr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Yr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Tu(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function dp(i,t){const e=t.isWebGL2,n=new WeakMap;function s(l,h){const u=l.array,d=l.usage,f=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let _;if(u instanceof Float32Array)_=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)_=i.SHORT;else if(u instanceof Uint32Array)_=i.UNSIGNED_INT;else if(u instanceof Int32Array)_=i.INT;else if(u instanceof Int8Array)_=i.BYTE;else if(u instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:_,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:f}}function r(l,h,u){const d=h.array,f=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),f.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let _=0,m=g.length;_<m;_++){const p=g[_];e?i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,s(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,l,h),u.version=l.version}}return{get:a,remove:o,update:c}}class yc extends de{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=t/o,d=e/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const v=p*d-a;for(let x=0;x<l;x++){const S=x*u-r;g.push(S,-v,0),_.push(0,0,1),m.push(x/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){const x=v+l*p,S=v+l*(p+1),w=v+1+l*(p+1),T=v+1+l*p;f.push(x,S,T),f.push(S,w,T)}this.setIndex(f),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(_,3)),this.setAttribute("uv",new Jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yc(t.width,t.height,t.widthSegments,t.heightSegments)}}var fp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,pp=`#ifdef USE_ALPHAHASH
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
#endif`,mp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_p=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,xp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vp=`#ifdef USE_AOMAP
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
#endif`,Mp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yp=`#ifdef USE_BATCHING
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
#endif`,bp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Sp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ep=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Tp=`#ifdef USE_IRIDESCENCE
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
#endif`,Ap=`#ifdef USE_BUMPMAP
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
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Pp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Lp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ip=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Up=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Np=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Fp=`#define PI 3.141592653589793
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
} // validated`,Op=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,zp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Wp=`
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
#endif`,qp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Yp=`#ifdef USE_ENVMAP
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
#endif`,jp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$p=`#ifdef USE_ENVMAP
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
#endif`,Kp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Zp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,t0=`#ifdef USE_GRADIENTMAP
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
}`,e0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,n0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,i0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,s0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,r0=`uniform bool receiveShadow;
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
#endif`,o0=`#ifdef USE_ENVMAP
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
#endif`,a0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,c0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,l0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,h0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,u0=`PhysicalMaterial material;
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
#endif`,d0=`struct PhysicalMaterial {
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
}`,f0=`
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
#endif`,p0=`#if defined( RE_IndirectDiffuse )
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
#endif`,m0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,g0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,x0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,v0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,M0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,y0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,b0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,S0=`#if defined( USE_POINTS_UV )
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
#endif`,E0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,w0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,T0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,A0=`#ifdef USE_MORPHNORMALS
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
#endif`,R0=`#ifdef USE_MORPHTARGETS
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
#endif`,C0=`#ifdef USE_MORPHTARGETS
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
#endif`,P0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,L0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,I0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,D0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,U0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,N0=`#ifdef USE_NORMALMAP
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
#endif`,F0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,O0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,B0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,z0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,k0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,V0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,H0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,G0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,W0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,X0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,q0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Y0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,j0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,K0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Z0=`float getShadowMask() {
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
}`,J0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Q0=`#ifdef USE_SKINNING
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
#endif`,tm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,em=`#ifdef USE_SKINNING
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
#endif`,nm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,im=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,om=`#ifdef USE_TRANSMISSION
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
#endif`,am=`#ifdef USE_TRANSMISSION
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
#endif`,cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,um=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,fm=`uniform sampler2D t2D;
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
}`,pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,gm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_m=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xm=`#include <common>
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
}`,vm=`#if DEPTH_PACKING == 3200
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
}`,Mm=`#define DISTANCE
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
}`,ym=`#define DISTANCE
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
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Sm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Em=`uniform float scale;
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
}`,wm=`uniform vec3 diffuse;
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
}`,Tm=`#include <common>
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
}`,Am=`uniform vec3 diffuse;
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
}`,Rm=`#define LAMBERT
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
}`,Cm=`#define LAMBERT
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
}`,Pm=`#define MATCAP
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
}`,Lm=`#define MATCAP
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
}`,Im=`#define NORMAL
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
}`,Dm=`#define NORMAL
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
}`,Um=`#define PHONG
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
}`,Nm=`#define PHONG
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
}`,Fm=`#define STANDARD
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
}`,Om=`#define STANDARD
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
}`,Bm=`#define TOON
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
}`,zm=`#define TOON
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
}`,km=`uniform float size;
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
}`,Vm=`uniform vec3 diffuse;
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
}`,Hm=`#include <common>
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
}`,Gm=`uniform vec3 color;
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
}`,Wm=`uniform float rotation;
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
}`,Xm=`uniform vec3 diffuse;
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
}`,$t={alphahash_fragment:fp,alphahash_pars_fragment:pp,alphamap_fragment:mp,alphamap_pars_fragment:gp,alphatest_fragment:_p,alphatest_pars_fragment:xp,aomap_fragment:vp,aomap_pars_fragment:Mp,batching_pars_vertex:yp,batching_vertex:bp,begin_vertex:Sp,beginnormal_vertex:Ep,bsdfs:wp,iridescence_fragment:Tp,bumpmap_pars_fragment:Ap,clipping_planes_fragment:Rp,clipping_planes_pars_fragment:Cp,clipping_planes_pars_vertex:Pp,clipping_planes_vertex:Lp,color_fragment:Ip,color_pars_fragment:Dp,color_pars_vertex:Up,color_vertex:Np,common:Fp,cube_uv_reflection_fragment:Op,defaultnormal_vertex:Bp,displacementmap_pars_vertex:zp,displacementmap_vertex:kp,emissivemap_fragment:Vp,emissivemap_pars_fragment:Hp,colorspace_fragment:Gp,colorspace_pars_fragment:Wp,envmap_fragment:Xp,envmap_common_pars_fragment:qp,envmap_pars_fragment:Yp,envmap_pars_vertex:jp,envmap_physical_pars_fragment:o0,envmap_vertex:$p,fog_vertex:Kp,fog_pars_vertex:Zp,fog_fragment:Jp,fog_pars_fragment:Qp,gradientmap_pars_fragment:t0,lightmap_fragment:e0,lightmap_pars_fragment:n0,lights_lambert_fragment:i0,lights_lambert_pars_fragment:s0,lights_pars_begin:r0,lights_toon_fragment:a0,lights_toon_pars_fragment:c0,lights_phong_fragment:l0,lights_phong_pars_fragment:h0,lights_physical_fragment:u0,lights_physical_pars_fragment:d0,lights_fragment_begin:f0,lights_fragment_maps:p0,lights_fragment_end:m0,logdepthbuf_fragment:g0,logdepthbuf_pars_fragment:_0,logdepthbuf_pars_vertex:x0,logdepthbuf_vertex:v0,map_fragment:M0,map_pars_fragment:y0,map_particle_fragment:b0,map_particle_pars_fragment:S0,metalnessmap_fragment:E0,metalnessmap_pars_fragment:w0,morphcolor_vertex:T0,morphnormal_vertex:A0,morphtarget_pars_vertex:R0,morphtarget_vertex:C0,normal_fragment_begin:P0,normal_fragment_maps:L0,normal_pars_fragment:I0,normal_pars_vertex:D0,normal_vertex:U0,normalmap_pars_fragment:N0,clearcoat_normal_fragment_begin:F0,clearcoat_normal_fragment_maps:O0,clearcoat_pars_fragment:B0,iridescence_pars_fragment:z0,opaque_fragment:k0,packing:V0,premultiplied_alpha_fragment:H0,project_vertex:G0,dithering_fragment:W0,dithering_pars_fragment:X0,roughnessmap_fragment:q0,roughnessmap_pars_fragment:Y0,shadowmap_pars_fragment:j0,shadowmap_pars_vertex:$0,shadowmap_vertex:K0,shadowmask_pars_fragment:Z0,skinbase_vertex:J0,skinning_pars_vertex:Q0,skinning_vertex:tm,skinnormal_vertex:em,specularmap_fragment:nm,specularmap_pars_fragment:im,tonemapping_fragment:sm,tonemapping_pars_fragment:rm,transmission_fragment:om,transmission_pars_fragment:am,uv_pars_fragment:cm,uv_pars_vertex:lm,uv_vertex:hm,worldpos_vertex:um,background_vert:dm,background_frag:fm,backgroundCube_vert:pm,backgroundCube_frag:mm,cube_vert:gm,cube_frag:_m,depth_vert:xm,depth_frag:vm,distanceRGBA_vert:Mm,distanceRGBA_frag:ym,equirect_vert:bm,equirect_frag:Sm,linedashed_vert:Em,linedashed_frag:wm,meshbasic_vert:Tm,meshbasic_frag:Am,meshlambert_vert:Rm,meshlambert_frag:Cm,meshmatcap_vert:Pm,meshmatcap_frag:Lm,meshnormal_vert:Im,meshnormal_frag:Dm,meshphong_vert:Um,meshphong_frag:Nm,meshphysical_vert:Fm,meshphysical_frag:Om,meshtoon_vert:Bm,meshtoon_frag:zm,points_vert:km,points_frag:Vm,shadow_vert:Hm,shadow_frag:Gm,sprite_vert:Wm,sprite_frag:Xm},xt={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},On={basic:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Je([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Je([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Je([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Je([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Je([xt.points,xt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Je([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Je([xt.common,xt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Je([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Je([xt.sprite,xt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Je([xt.common,xt.displacementmap,{referencePosition:{value:new b},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Je([xt.lights,xt.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};On.physical={uniforms:Je([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const jr={r:0,b:0,g:0};function qm(i,t,e,n,s,r,a){const o=new Xt(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(m,p){let v=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?e:t).get(x)),x===null?_(o,c):x&&x.isColor&&(_(x,1),v=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||v)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===Uo)?(h===void 0&&(h=new je(new Xs(1,1,1),new ji({name:"BackgroundCubeMaterial",uniforms:Hs(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:un,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,T,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=he.getTransfer(x.colorSpace)!==xe,(u!==x||d!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new je(new yc(2,2),new ji({name:"BackgroundMaterial",uniforms:Hs(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,l.material.toneMapped=he.getTransfer(x.colorSpace)!==xe,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function _(m,p){m.getRGB(jr,Su(i)),n.buffers.color.setClear(jr.r,jr.g,jr.b,p,a)}return{getClearColor:function(){return o},setClearColor:function(m,p=1){o.set(m),c=p,_(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(m){c=m,_(o,c)},render:g}}function Ym(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=m(null);let l=c,h=!1;function u(P,F,B,N,z){let D=!1;if(a){const G=_(N,B,F);l!==G&&(l=G,f(l.object)),D=p(P,N,B,z),D&&v(P,N,B,z)}else{const G=F.wireframe===!0;(l.geometry!==N.id||l.program!==B.id||l.wireframe!==G)&&(l.geometry=N.id,l.program=B.id,l.wireframe=G,D=!0)}z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(D||h)&&(h=!1,A(P,F,B,N),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(P){return n.isWebGL2?i.bindVertexArray(P):r.bindVertexArrayOES(P)}function g(P){return n.isWebGL2?i.deleteVertexArray(P):r.deleteVertexArrayOES(P)}function _(P,F,B){const N=B.wireframe===!0;let z=o[P.id];z===void 0&&(z={},o[P.id]=z);let D=z[F.id];D===void 0&&(D={},z[F.id]=D);let G=D[N];return G===void 0&&(G=m(d()),D[N]=G),G}function m(P){const F=[],B=[],N=[];for(let z=0;z<s;z++)F[z]=0,B[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:N,object:P,attributes:{},index:null}}function p(P,F,B,N){const z=l.attributes,D=F.attributes;let G=0;const q=B.getAttributes();for(const Z in q)if(q[Z].location>=0){const j=z[Z];let Q=D[Z];if(Q===void 0&&(Z==="instanceMatrix"&&P.instanceMatrix&&(Q=P.instanceMatrix),Z==="instanceColor"&&P.instanceColor&&(Q=P.instanceColor)),j===void 0||j.attribute!==Q||Q&&j.data!==Q.data)return!0;G++}return l.attributesNum!==G||l.index!==N}function v(P,F,B,N){const z={},D=F.attributes;let G=0;const q=B.getAttributes();for(const Z in q)if(q[Z].location>=0){let j=D[Z];j===void 0&&(Z==="instanceMatrix"&&P.instanceMatrix&&(j=P.instanceMatrix),Z==="instanceColor"&&P.instanceColor&&(j=P.instanceColor));const Q={};Q.attribute=j,j&&j.data&&(Q.data=j.data),z[Z]=Q,G++}l.attributes=z,l.attributesNum=G,l.index=N}function x(){const P=l.newAttributes;for(let F=0,B=P.length;F<B;F++)P[F]=0}function S(P){w(P,0)}function w(P,F){const B=l.newAttributes,N=l.enabledAttributes,z=l.attributeDivisors;B[P]=1,N[P]===0&&(i.enableVertexAttribArray(P),N[P]=1),z[P]!==F&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](P,F),z[P]=F)}function T(){const P=l.newAttributes,F=l.enabledAttributes;for(let B=0,N=F.length;B<N;B++)F[B]!==P[B]&&(i.disableVertexAttribArray(B),F[B]=0)}function E(P,F,B,N,z,D,G){G===!0?i.vertexAttribIPointer(P,F,B,z,D):i.vertexAttribPointer(P,F,B,N,z,D)}function A(P,F,B,N){if(n.isWebGL2===!1&&(P.isInstancedMesh||N.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const z=N.attributes,D=B.getAttributes(),G=F.defaultAttributeValues;for(const q in D){const Z=D[q];if(Z.location>=0){let X=z[q];if(X===void 0&&(q==="instanceMatrix"&&P.instanceMatrix&&(X=P.instanceMatrix),q==="instanceColor"&&P.instanceColor&&(X=P.instanceColor)),X!==void 0){const j=X.normalized,Q=X.itemSize,st=e.get(X);if(st===void 0)continue;const k=st.buffer,Y=st.type,nt=st.bytesPerElement,rt=n.isWebGL2===!0&&(Y===i.INT||Y===i.UNSIGNED_INT||X.gpuType===ru);if(X.isInterleavedBufferAttribute){const ht=X.data,V=ht.stride,St=X.offset;if(ht.isInstancedInterleavedBuffer){for(let ut=0;ut<Z.locationSize;ut++)w(Z.location+ut,ht.meshPerAttribute);P.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let ut=0;ut<Z.locationSize;ut++)S(Z.location+ut);i.bindBuffer(i.ARRAY_BUFFER,k);for(let ut=0;ut<Z.locationSize;ut++)E(Z.location+ut,Q/Z.locationSize,Y,j,V*nt,(St+Q/Z.locationSize*ut)*nt,rt)}else{if(X.isInstancedBufferAttribute){for(let ht=0;ht<Z.locationSize;ht++)w(Z.location+ht,X.meshPerAttribute);P.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let ht=0;ht<Z.locationSize;ht++)S(Z.location+ht);i.bindBuffer(i.ARRAY_BUFFER,k);for(let ht=0;ht<Z.locationSize;ht++)E(Z.location+ht,Q/Z.locationSize,Y,j,Q*nt,Q/Z.locationSize*ht*nt,rt)}}else if(G!==void 0){const j=G[q];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(Z.location,j);break;case 3:i.vertexAttrib3fv(Z.location,j);break;case 4:i.vertexAttrib4fv(Z.location,j);break;default:i.vertexAttrib1fv(Z.location,j)}}}}T()}function M(){U();for(const P in o){const F=o[P];for(const B in F){const N=F[B];for(const z in N)g(N[z].object),delete N[z];delete F[B]}delete o[P]}}function y(P){if(o[P.id]===void 0)return;const F=o[P.id];for(const B in F){const N=F[B];for(const z in N)g(N[z].object),delete N[z];delete F[B]}delete o[P.id]}function C(P){for(const F in o){const B=o[F];if(B[P.id]===void 0)continue;const N=B[P.id];for(const z in N)g(N[z].object),delete N[z];delete B[P.id]}}function U(){H(),h=!0,l!==c&&(l=c,f(l.object))}function H(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:U,resetDefaultState:H,dispose:M,releaseStatesOfGeometry:y,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:S,disableUnusedAttributes:T}}function jm(i,t,e,n){const s=n.isWebGL2;let r;function a(h){r=h}function o(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function c(h,u,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),e.update(u,r,d)}function l(h,u,d){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];e.update(g,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function $m(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const l=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,S=a||t.has("OES_texture_float"),w=x&&S,T=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:v,vertexTextures:x,floatFragmentTextures:S,floatVertexTextures:w,maxSamples:T}}function Km(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new pi,o=new te,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const v=r?0:n,x=v*4;let S=p.clippingState||null;c.value=S,S=h(g,d,x,f);for(let w=0;w!==x;++w)S[w]=e[w];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,S=f;x!==_;++x,S+=4)a.copy(u[x]).applyMatrix4(v,o),a.normal.toArray(m,S),m[S+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Zm(i){let t=new WeakMap;function e(a,o){return o===Mo?a.mapping=Bs:o===Qa&&(a.mapping=zs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Mo||o===Qa)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new lp(c.height/2);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Au extends Eu{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ls=4,Wl=[.125,.215,.35,.446,.526,.582],zi=20,fa=new Au,Xl=new Xt;let pa=null,ma=0,ga=0;const Fi=(1+Math.sqrt(5))/2,gs=1/Fi,ql=[new b(1,1,1),new b(-1,1,1),new b(1,1,-1),new b(-1,1,-1),new b(0,Fi,gs),new b(0,Fi,-gs),new b(gs,0,Fi),new b(-gs,0,Fi),new b(Fi,gs,0),new b(-Fi,gs,0)];class rc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel(),this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$l(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(pa,ma,ga),t.scissorTest=!1,$r(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Bs||t.mapping===zs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pa=this._renderer.getRenderTarget(),ma=this._renderer.getActiveCubeFace(),ga=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:xr,format:wn,colorSpace:ei,depthBuffer:!1},s=Yl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Yl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jm(r)),this._blurMaterial=Qm(r,t,e)}return s}_compileMaterial(t){const e=new je(this._lodPlanes[0],t);this._renderer.compile(e,fa)}_sceneToCubeUV(t,e,n,s){const o=new Ln(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Xl),h.toneMapping=Mi,h.autoClear=!1;const f=new vc({name:"PMREM.Background",side:un,depthWrite:!1,depthTest:!1}),g=new je(new Xs,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(Xl),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(o.up.set(0,c[p],0),o.lookAt(l[p],0,0)):v===1?(o.up.set(0,0,c[p]),o.lookAt(0,l[p],0)):(o.up.set(0,c[p],0),o.lookAt(0,0,l[p]));const x=this._cubeSize;$r(s,v*x,p>2?x:0,x,x),h.setRenderTarget(s),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Bs||t.mapping===zs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=$l()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new je(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const c=this._cubeSize;$r(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,fa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=ql[(s-1)%ql.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new je(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*zi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):zi;m>zi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${zi}`);const p=[];let v=0;for(let E=0;E<zi;++E){const A=E/_,M=Math.exp(-A*A/2);p.push(M),E===0?v+=M:E<m&&(v+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/v;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const S=this._sizeLods[s],w=3*S*(s>x-Ls?s-x+Ls:0),T=4*(this._cubeSize-S);$r(e,w,T,3*S,2*S),c.setRenderTarget(e),c.render(u,fa)}}function Jm(i){const t=[],e=[],n=[];let s=i;const r=i-Ls+1+Wl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-Ls?c=Wl[a-i+Ls-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*f),x=new Float32Array(m*g*f),S=new Float32Array(p*g*f);for(let T=0;T<f;T++){const E=T%3*2/3-1,A=T>2?0:-1,M=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];v.set(M,_*g*T),x.set(d,m*g*T);const y=[T,T,T,T,T,T];S.set(y,p*g*T)}const w=new de;w.setAttribute("position",new re(v,_)),w.setAttribute("uv",new re(x,m)),w.setAttribute("faceIndex",new re(S,p)),t.push(w),s>Ls&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Yl(i,t,e){const n=new Yi(i,t,e);return n.texture.mapping=Uo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function $r(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Qm(i,t,e){const n=new Float32Array(zi),s=new b(0,1,0);return new ji({name:"SphericalGaussianBlur",defines:{n:zi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:bc(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function jl(){return new ji({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bc(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function $l(){return new ji({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function bc(){return`

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
	`}function tg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Mo||c===Qa,h=c===Bs||c===zs;if(l||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let u=t.get(o);return e===null&&(e=new rc(i)),u=l?e.fromEquirectangular(o,u):e.fromCubemap(o,u),t.set(o,u),u.texture}else{if(t.has(o))return t.get(o).texture;{const u=o.image;if(l&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new rc(i));const d=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,d),o.addEventListener("dispose",r),d.texture}else return null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function eg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ng(i,t,e,n){const s={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const v=f.array;_=f.version;for(let x=0,S=v.length;x<S;x+=3){const w=v[x+0],T=v[x+1],E=v[x+2];d.push(w,T,T,E,E,w)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,S=v.length/3-1;x<S;x+=3){const w=x+0,T=x+1,E=x+2;d.push(w,T,T,E,E,w)}}else return;const m=new(mu(d)?bu:yu)(d,1);m.version=_;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function ig(i,t,e,n){const s=n.isWebGL2;let r;function a(f){r=f}let o,c;function l(f){o=f.type,c=f.bytesPerElement}function h(f,g){i.drawElements(r,g,o,f*c),e.update(g,r,1)}function u(f,g,_){if(_===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,o,f*c,_),e.update(g,r,_)}function d(f,g,_){if(_===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<_;p++)this.render(f[p]/c,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,o,f,0,_);let p=0;for(let v=0;v<_;v++)p+=g[v];e.update(p,r,1)}}this.setMode=a,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function sg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function rg(i,t){return i[0]-t[0]}function og(i,t){return Math.abs(t[1])-Math.abs(i[1])}function ag(i,t,e){const n={},s=new Float32Array(8),r=new WeakMap,a=new Ie,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(t.isWebGL2===!0){const f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=f!==void 0?f.length:0;let _=r.get(h);if(_===void 0||_.count!==g){let P=function(){U.dispose(),r.delete(h),h.removeEventListener("dispose",P)};_!==void 0&&_.texture.dispose();const v=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,S=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let A=0;v===!0&&(A=1),x===!0&&(A=2),S===!0&&(A=3);let M=h.attributes.position.count*A,y=1;M>t.maxTextureSize&&(y=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const C=new Float32Array(M*y*4*g),U=new xu(C,M,y,g);U.type=Jn,U.needsUpdate=!0;const H=A*4;for(let F=0;F<g;F++){const B=w[F],N=T[F],z=E[F],D=M*y*4*F;for(let G=0;G<B.count;G++){const q=G*H;v===!0&&(a.fromBufferAttribute(B,G),C[D+q+0]=a.x,C[D+q+1]=a.y,C[D+q+2]=a.z,C[D+q+3]=0),x===!0&&(a.fromBufferAttribute(N,G),C[D+q+4]=a.x,C[D+q+5]=a.y,C[D+q+6]=a.z,C[D+q+7]=0),S===!0&&(a.fromBufferAttribute(z,G),C[D+q+8]=a.x,C[D+q+9]=a.y,C[D+q+10]=a.z,C[D+q+11]=z.itemSize===4?a.w:1)}}_={count:g,texture:U,size:new ot(M,y)},r.set(h,_),h.addEventListener("dispose",P)}let m=0;for(let v=0;v<d.length;v++)m+=d[v];const p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",p),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",_.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",_.size)}else{const f=d===void 0?0:d.length;let g=n[h.id];if(g===void 0||g.length!==f){g=[];for(let x=0;x<f;x++)g[x]=[x,0];n[h.id]=g}for(let x=0;x<f;x++){const S=g[x];S[0]=x,S[1]=d[x]}g.sort(og);for(let x=0;x<8;x++)x<f&&g[x][1]?(o[x][0]=g[x][0],o[x][1]=g[x][1]):(o[x][0]=Number.MAX_SAFE_INTEGER,o[x][1]=0);o.sort(rg);const _=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let x=0;x<8;x++){const S=o[x],w=S[0],T=S[1];w!==Number.MAX_SAFE_INTEGER&&T?(_&&h.getAttribute("morphTarget"+x)!==_[w]&&h.setAttribute("morphTarget"+x,_[w]),m&&h.getAttribute("morphNormal"+x)!==m[w]&&h.setAttribute("morphNormal"+x,m[w]),s[x]=T,p+=T):(_&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}const v=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",v),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function cg(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:a}}class Ru extends en{constructor(t,e,n,s,r,a,o,c,l,h){if(h=h!==void 0?h:Wi,h!==Wi&&h!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Wi&&(n=gi),n===void 0&&h===Vs&&(n=Gi),super(null,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:We,this.minFilter=c!==void 0?c:We,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Cu=new en,Pu=new Ru(1,1);Pu.compareFunction=pu;const Lu=new xu,Iu=new qf,Du=new wu,Kl=[],Zl=[],Jl=new Float32Array(16),Ql=new Float32Array(9),th=new Float32Array(4);function qs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Kl[s];if(r===void 0&&(r=new Float32Array(s),Kl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function ke(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ve(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Fo(i,t){let e=Zl[t];e===void 0&&(e=new Int32Array(t),Zl[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function lg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function hg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2fv(this.addr,t),Ve(e,t)}}function ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;i.uniform3fv(this.addr,t),Ve(e,t)}}function dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4fv(this.addr,t),Ve(e,t)}}function fg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;th.set(n),i.uniformMatrix2fv(this.addr,!1,th),Ve(e,n)}}function pg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Ql.set(n),i.uniformMatrix3fv(this.addr,!1,Ql),Ve(e,n)}}function mg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;Jl.set(n),i.uniformMatrix4fv(this.addr,!1,Jl),Ve(e,n)}}function gg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2iv(this.addr,t),Ve(e,t)}}function xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;i.uniform3iv(this.addr,t),Ve(e,t)}}function vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4iv(this.addr,t),Ve(e,t)}}function Mg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;i.uniform2uiv(this.addr,t),Ve(e,t)}}function bg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;i.uniform3uiv(this.addr,t),Ve(e,t)}}function Sg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;i.uniform4uiv(this.addr,t),Ve(e,t)}}function Eg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Pu:Cu;e.setTexture2D(t||r,s)}function wg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Iu,s)}function Tg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Du,s)}function Ag(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Lu,s)}function Rg(i){switch(i){case 5126:return lg;case 35664:return hg;case 35665:return ug;case 35666:return dg;case 35674:return fg;case 35675:return pg;case 35676:return mg;case 5124:case 35670:return gg;case 35667:case 35671:return _g;case 35668:case 35672:return xg;case 35669:case 35673:return vg;case 5125:return Mg;case 36294:return yg;case 36295:return bg;case 36296:return Sg;case 35678:case 36198:case 36298:case 36306:case 35682:return Eg;case 35679:case 36299:case 36307:return wg;case 35680:case 36300:case 36308:case 36293:return Tg;case 36289:case 36303:case 36311:case 36292:return Ag}}function Cg(i,t){i.uniform1fv(this.addr,t)}function Pg(i,t){const e=qs(t,this.size,2);i.uniform2fv(this.addr,e)}function Lg(i,t){const e=qs(t,this.size,3);i.uniform3fv(this.addr,e)}function Ig(i,t){const e=qs(t,this.size,4);i.uniform4fv(this.addr,e)}function Dg(i,t){const e=qs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ug(i,t){const e=qs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Ng(i,t){const e=qs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Fg(i,t){i.uniform1iv(this.addr,t)}function Og(i,t){i.uniform2iv(this.addr,t)}function Bg(i,t){i.uniform3iv(this.addr,t)}function zg(i,t){i.uniform4iv(this.addr,t)}function kg(i,t){i.uniform1uiv(this.addr,t)}function Vg(i,t){i.uniform2uiv(this.addr,t)}function Hg(i,t){i.uniform3uiv(this.addr,t)}function Gg(i,t){i.uniform4uiv(this.addr,t)}function Wg(i,t,e){const n=this.cache,s=t.length,r=Fo(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Cu,r[a])}function Xg(i,t,e){const n=this.cache,s=t.length,r=Fo(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Iu,r[a])}function qg(i,t,e){const n=this.cache,s=t.length,r=Fo(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Du,r[a])}function Yg(i,t,e){const n=this.cache,s=t.length,r=Fo(e,s);ke(n,r)||(i.uniform1iv(this.addr,r),Ve(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Lu,r[a])}function jg(i){switch(i){case 5126:return Cg;case 35664:return Pg;case 35665:return Lg;case 35666:return Ig;case 35674:return Dg;case 35675:return Ug;case 35676:return Ng;case 5124:case 35670:return Fg;case 35667:case 35671:return Og;case 35668:case 35672:return Bg;case 35669:case 35673:return zg;case 5125:return kg;case 36294:return Vg;case 36295:return Hg;case 36296:return Gg;case 35678:case 36198:case 36298:case 36306:case 35682:return Wg;case 35679:case 36299:case 36307:return Xg;case 35680:case 36300:case 36308:case 36293:return qg;case 36289:case 36303:case 36311:case 36292:return Yg}}class $g{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Rg(e.type)}}class Kg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=jg(e.type)}}class Zg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const _a=/(\w+)(\])?(\[|\.)?/g;function eh(i,t){i.seq.push(t),i.map[t.id]=t}function Jg(i,t,e){const n=i.name,s=n.length;for(_a.lastIndex=0;;){const r=_a.exec(n),a=_a.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){eh(e,l===void 0?new $g(o,i,t):new Kg(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Zg(o),eh(e,u)),e=u}}}class go{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Jg(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function nh(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Qg=37297;let t_=0;function e_(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function n_(i){const t=he.getPrimaries(he.workingColorSpace),e=he.getPrimaries(i);let n;switch(t===e?n="":t===To&&e===wo?n="LinearDisplayP3ToLinearSRGB":t===wo&&e===To&&(n="LinearSRGBToLinearDisplayP3"),i){case ei:case No:return[n,"LinearTransferOETF"];case Oe:case _c:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ih(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+e_(i.getShaderSource(t),a)}else return s}function i_(i,t){const e=n_(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function s_(i,t){let e;switch(t){case Zd:e="Linear";break;case Jd:e="Reinhard";break;case Qd:e="OptimizedCineon";break;case tf:e="ACESFilmic";break;case nf:e="AgX";break;case ef:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function r_(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Is).join(`
`)}function o_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Is).join(`
`)}function a_(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function c_(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Is(i){return i!==""}function sh(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const l_=/^[ \t]*#include +<([\w\d./]+)>/gm;function oc(i){return i.replace(l_,u_)}const h_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function u_(i,t){let e=$t[t];if(e===void 0){const n=h_.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return oc(e)}const d_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oh(i){return i.replace(d_,f_)}function f_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ah(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function p_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===wd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Zn&&(t="SHADOWMAP_TYPE_VSM"),t}function m_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Bs:case zs:t="ENVMAP_TYPE_CUBE";break;case Uo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function g_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case zs:t="ENVMAP_MODE_REFRACTION";break}return t}function __(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case iu:t="ENVMAP_BLENDING_MULTIPLY";break;case $d:t="ENVMAP_BLENDING_MIX";break;case Kd:t="ENVMAP_BLENDING_ADD";break}return t}function x_(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function v_(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=p_(e),l=m_(e),h=g_(e),u=__(e),d=x_(e),f=e.isWebGL2?"":r_(e),g=o_(e),_=a_(r),m=s.createProgram();let p,v,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Is).join(`
`),p.length>0&&(p+=`
`),v=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(Is).join(`
`),v.length>0&&(v+=`
`)):(p=[ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Is).join(`
`),v=[f,ah(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Mi?"#define TONE_MAPPING":"",e.toneMapping!==Mi?$t.tonemapping_pars_fragment:"",e.toneMapping!==Mi?s_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,i_("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Is).join(`
`)),a=oc(a),a=sh(a,e),a=rh(a,e),o=oc(o),o=sh(o,e),o=rh(o,e),a=oh(a),o=oh(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Tl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Tl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const S=x+p+a,w=x+v+o,T=nh(s,s.VERTEX_SHADER,S),E=nh(s,s.FRAGMENT_SHADER,w);s.attachShader(m,T),s.attachShader(m,E),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function A(U){if(i.debug.checkShaderErrors){const H=s.getProgramInfoLog(m).trim(),P=s.getShaderInfoLog(T).trim(),F=s.getShaderInfoLog(E).trim();let B=!0,N=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(B=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,T,E);else{const z=ih(s,T,"vertex"),D=ih(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+H+`
`+z+`
`+D)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(P===""||F==="")&&(N=!1);N&&(U.diagnostics={runnable:B,programLog:H,vertexShader:{log:P,prefix:p},fragmentShader:{log:F,prefix:v}})}s.deleteShader(T),s.deleteShader(E),M=new go(s,m),y=c_(s,m)}let M;this.getUniforms=function(){return M===void 0&&A(this),M};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(m,Qg)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=t_++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=T,this.fragmentShader=E,this}let M_=0;class y_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new b_(t),e.set(t,n)),n}}class b_{constructor(t){this.id=M_++,this.code=t,this.usedTimes=0}}function S_(i,t,e,n,s,r,a){const o=new vu,c=new y_,l=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return M===0?"uv":`uv${M}`}function m(M,y,C,U,H){const P=U.fog,F=H.geometry,B=M.isMeshStandardMaterial?U.environment:null,N=(M.isMeshStandardMaterial?e:t).get(M.envMap||B),z=N&&N.mapping===Uo?N.image.height:null,D=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const G=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,q=G!==void 0?G.length:0;let Z=0;F.morphAttributes.position!==void 0&&(Z=1),F.morphAttributes.normal!==void 0&&(Z=2),F.morphAttributes.color!==void 0&&(Z=3);let X,j,Q,st;if(D){const Re=On[D];X=Re.vertexShader,j=Re.fragmentShader}else X=M.vertexShader,j=M.fragmentShader,c.update(M),Q=c.getVertexShaderID(M),st=c.getFragmentShaderID(M);const k=i.getRenderTarget(),Y=H.isInstancedMesh===!0,nt=H.isBatchedMesh===!0,rt=!!M.map,ht=!!M.matcap,V=!!N,St=!!M.aoMap,ut=!!M.lightMap,_t=!!M.bumpMap,pt=!!M.normalMap,Ct=!!M.displacementMap,Lt=!!M.emissiveMap,I=!!M.metalnessMap,R=!!M.roughnessMap,J=M.anisotropy>0,dt=M.clearcoat>0,ct=M.iridescence>0,ft=M.sheen>0,Rt=M.transmission>0,bt=J&&!!M.anisotropyMap,At=dt&&!!M.clearcoatMap,Nt=dt&&!!M.clearcoatNormalMap,Yt=dt&&!!M.clearcoatRoughnessMap,at=ct&&!!M.iridescenceMap,oe=ct&&!!M.iridescenceThicknessMap,Kt=ft&&!!M.sheenColorMap,kt=ft&&!!M.sheenRoughnessMap,Dt=!!M.specularMap,Et=!!M.specularColorMap,O=!!M.specularIntensityMap,mt=Rt&&!!M.transmissionMap,Pt=Rt&&!!M.thicknessMap,Tt=!!M.gradientMap,lt=!!M.alphaMap,W=M.alphaTest>0,gt=!!M.alphaHash,Mt=!!M.extensions,Bt=!!F.attributes.uv1,Ut=!!F.attributes.uv2,ee=!!F.attributes.uv3;let ne=Mi;return M.toneMapped&&(k===null||k.isXRRenderTarget===!0)&&(ne=i.toneMapping),{isWebGL2:h,shaderID:D,shaderType:M.type,shaderName:M.name,vertexShader:X,fragmentShader:j,defines:M.defines,customVertexShaderID:Q,customFragmentShaderID:st,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:nt,instancing:Y,instancingColor:Y&&H.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:k===null?i.outputColorSpace:k.isXRRenderTarget===!0?k.texture.colorSpace:ei,map:rt,matcap:ht,envMap:V,envMapMode:V&&N.mapping,envMapCubeUVHeight:z,aoMap:St,lightMap:ut,bumpMap:_t,normalMap:pt,displacementMap:d&&Ct,emissiveMap:Lt,normalMapObjectSpace:pt&&M.normalMapType===vf,normalMapTangentSpace:pt&&M.normalMapType===fu,metalnessMap:I,roughnessMap:R,anisotropy:J,anisotropyMap:bt,clearcoat:dt,clearcoatMap:At,clearcoatNormalMap:Nt,clearcoatRoughnessMap:Yt,iridescence:ct,iridescenceMap:at,iridescenceThicknessMap:oe,sheen:ft,sheenColorMap:Kt,sheenRoughnessMap:kt,specularMap:Dt,specularColorMap:Et,specularIntensityMap:O,transmission:Rt,transmissionMap:mt,thicknessMap:Pt,gradientMap:Tt,opaque:M.transparent===!1&&M.blending===Us,alphaMap:lt,alphaTest:W,alphaHash:gt,combine:M.combine,mapUv:rt&&_(M.map.channel),aoMapUv:St&&_(M.aoMap.channel),lightMapUv:ut&&_(M.lightMap.channel),bumpMapUv:_t&&_(M.bumpMap.channel),normalMapUv:pt&&_(M.normalMap.channel),displacementMapUv:Ct&&_(M.displacementMap.channel),emissiveMapUv:Lt&&_(M.emissiveMap.channel),metalnessMapUv:I&&_(M.metalnessMap.channel),roughnessMapUv:R&&_(M.roughnessMap.channel),anisotropyMapUv:bt&&_(M.anisotropyMap.channel),clearcoatMapUv:At&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Nt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Yt&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Kt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:kt&&_(M.sheenRoughnessMap.channel),specularMapUv:Dt&&_(M.specularMap.channel),specularColorMapUv:Et&&_(M.specularColorMap.channel),specularIntensityMapUv:O&&_(M.specularIntensityMap.channel),transmissionMapUv:mt&&_(M.transmissionMap.channel),thicknessMapUv:Pt&&_(M.thicknessMap.channel),alphaMapUv:lt&&_(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(pt||J),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,vertexUv1s:Bt,vertexUv2s:Ut,vertexUv3s:ee,pointsUvs:H.isPoints===!0&&!!F.attributes.uv&&(rt||lt),fog:!!P,useFog:M.fog===!0,fogExp2:P&&P.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:H.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:Z,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ne,useLegacyLights:i._useLegacyLights,decodeVideoTexture:rt&&M.map.isVideoTexture===!0&&he.getTransfer(M.map.colorSpace)===xe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Mn,flipSided:M.side===un,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:Mt&&M.extensions.derivatives===!0,extensionFragDepth:Mt&&M.extensions.fragDepth===!0,extensionDrawBuffers:Mt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:Mt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Mt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function p(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)y.push(C),y.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(v(y,M),x(y,M),y.push(i.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function v(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function x(M,y){o.disableAll(),y.isWebGL2&&o.enable(0),y.supportsVertexTextures&&o.enable(1),y.instancing&&o.enable(2),y.instancingColor&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.skinning&&o.enable(4),y.morphTargets&&o.enable(5),y.morphNormals&&o.enable(6),y.morphColors&&o.enable(7),y.premultipliedAlpha&&o.enable(8),y.shadowMapEnabled&&o.enable(9),y.useLegacyLights&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),M.push(o.mask)}function S(M){const y=g[M.type];let C;if(y){const U=On[y];C=rp.clone(U.uniforms)}else C=M.uniforms;return C}function w(M,y){let C;for(let U=0,H=l.length;U<H;U++){const P=l[U];if(P.cacheKey===y){C=P,++C.usedTimes;break}}return C===void 0&&(C=new v_(i,y,M,r),l.push(C)),C}function T(M){if(--M.usedTimes===0){const y=l.indexOf(M);l[y]=l[l.length-1],l.pop(),M.destroy()}}function E(M){c.remove(M)}function A(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:w,releaseProgram:T,releaseShaderCache:E,programs:l,dispose:A}}function E_(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function w_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function ch(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function lh(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||w_),n.length>1&&n.sort(d||ch),s.length>1&&s.sort(d||ch)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function T_(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new lh,i.set(n,[a])):s>=r.length?(a=new lh,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function A_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new b,color:new Xt};break;case"SpotLight":e={position:new b,direction:new b,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new b,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new b,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new b,halfWidth:new b,halfHeight:new b};break}return i[t.id]=e,e}}}function R_(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let C_=0;function P_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function L_(i,t){const e=new A_,n=R_(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new b);const r=new b,a=new qt,o=new qt;function c(h,u){let d=0,f=0,g=0;for(let U=0;U<9;U++)s.probe[U].set(0,0,0);let _=0,m=0,p=0,v=0,x=0,S=0,w=0,T=0,E=0,A=0,M=0;h.sort(P_);const y=u===!0?Math.PI:1;for(let U=0,H=h.length;U<H;U++){const P=h[U],F=P.color,B=P.intensity,N=P.distance,z=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=F.r*B*y,f+=F.g*B*y,g+=F.b*B*y;else if(P.isLightProbe){for(let D=0;D<9;D++)s.probe[D].addScaledVector(P.sh.coefficients[D],B);M++}else if(P.isDirectionalLight){const D=e.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity*y),P.castShadow){const G=P.shadow,q=n.get(P);q.shadowBias=G.bias,q.shadowNormalBias=G.normalBias,q.shadowRadius=G.radius,q.shadowMapSize=G.mapSize,s.directionalShadow[_]=q,s.directionalShadowMap[_]=z,s.directionalShadowMatrix[_]=P.shadow.matrix,S++}s.directional[_]=D,_++}else if(P.isSpotLight){const D=e.get(P);D.position.setFromMatrixPosition(P.matrixWorld),D.color.copy(F).multiplyScalar(B*y),D.distance=N,D.coneCos=Math.cos(P.angle),D.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),D.decay=P.decay,s.spot[p]=D;const G=P.shadow;if(P.map&&(s.spotLightMap[E]=P.map,E++,G.updateMatrices(P),P.castShadow&&A++),s.spotLightMatrix[p]=G.matrix,P.castShadow){const q=n.get(P);q.shadowBias=G.bias,q.shadowNormalBias=G.normalBias,q.shadowRadius=G.radius,q.shadowMapSize=G.mapSize,s.spotShadow[p]=q,s.spotShadowMap[p]=z,T++}p++}else if(P.isRectAreaLight){const D=e.get(P);D.color.copy(F).multiplyScalar(B),D.halfWidth.set(P.width*.5,0,0),D.halfHeight.set(0,P.height*.5,0),s.rectArea[v]=D,v++}else if(P.isPointLight){const D=e.get(P);if(D.color.copy(P.color).multiplyScalar(P.intensity*y),D.distance=P.distance,D.decay=P.decay,P.castShadow){const G=P.shadow,q=n.get(P);q.shadowBias=G.bias,q.shadowNormalBias=G.normalBias,q.shadowRadius=G.radius,q.shadowMapSize=G.mapSize,q.shadowCameraNear=G.camera.near,q.shadowCameraFar=G.camera.far,s.pointShadow[m]=q,s.pointShadowMap[m]=z,s.pointShadowMatrix[m]=P.shadow.matrix,w++}s.point[m]=D,m++}else if(P.isHemisphereLight){const D=e.get(P);D.skyColor.copy(P.color).multiplyScalar(B*y),D.groundColor.copy(P.groundColor).multiplyScalar(B*y),s.hemi[x]=D,x++}}v>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=xt.LTC_FLOAT_1,s.rectAreaLTC2=xt.LTC_FLOAT_2):(s.rectAreaLTC1=xt.LTC_HALF_1,s.rectAreaLTC2=xt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=xt.LTC_FLOAT_1,s.rectAreaLTC2=xt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=xt.LTC_HALF_1,s.rectAreaLTC2=xt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;const C=s.hash;(C.directionalLength!==_||C.pointLength!==m||C.spotLength!==p||C.rectAreaLength!==v||C.hemiLength!==x||C.numDirectionalShadows!==S||C.numPointShadows!==w||C.numSpotShadows!==T||C.numSpotMaps!==E||C.numLightProbes!==M)&&(s.directional.length=_,s.spot.length=p,s.rectArea.length=v,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=S,s.directionalShadowMap.length=S,s.pointShadow.length=w,s.pointShadowMap.length=w,s.spotShadow.length=T,s.spotShadowMap.length=T,s.directionalShadowMatrix.length=S,s.pointShadowMatrix.length=w,s.spotLightMatrix.length=T+E-A,s.spotLightMap.length=E,s.numSpotLightShadowsWithMaps=A,s.numLightProbes=M,C.directionalLength=_,C.pointLength=m,C.spotLength=p,C.rectAreaLength=v,C.hemiLength=x,C.numDirectionalShadows=S,C.numPointShadows=w,C.numSpotShadows=T,C.numSpotMaps=E,C.numLightProbes=M,s.version=C_++)}function l(h,u){let d=0,f=0,g=0,_=0,m=0;const p=u.matrixWorldInverse;for(let v=0,x=h.length;v<x;v++){const S=h[v];if(S.isDirectionalLight){const w=s.directional[d];w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),d++}else if(S.isSpotLight){const w=s.spot[g];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),g++}else if(S.isRectAreaLight){const w=s.rectArea[_];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(p),o.identity(),a.copy(S.matrixWorld),a.premultiply(p),o.extractRotation(a),w.halfWidth.set(S.width*.5,0,0),w.halfHeight.set(0,S.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),_++}else if(S.isPointLight){const w=s.point[f];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){const w=s.hemi[m];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(p),m++}}}return{setup:c,setupView:l,state:s}}function hh(i,t){const e=new L_(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(u){n.push(u)}function o(u){s.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function I_(i,t){let e=new WeakMap;function n(r,a=0){const o=e.get(r);let c;return o===void 0?(c=new hh(i,t),e.set(r,[c])):a>=o.length?(c=new hh(i,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}class D_ extends Ri{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_f,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class U_ extends Ri{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const N_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,F_=`uniform sampler2D shadow_pass;
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
}`;function O_(i,t,e){let n=new Mc;const s=new ot,r=new ot,a=new Ie,o=new D_({depthPacking:xf}),c=new U_,l={},h=e.maxTextureSize,u={[bi]:un,[un]:bi,[Mn]:Mn},d=new ji({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:N_,fragmentShader:F_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new de;g.setAttribute("position",new re(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new je(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nu;let p=this.type;this.render=function(T,E,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const M=i.getRenderTarget(),y=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),U=i.state;U.setBlending(vi),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const H=p!==Zn&&this.type===Zn,P=p===Zn&&this.type!==Zn;for(let F=0,B=T.length;F<B;F++){const N=T[F],z=N.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",N,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const D=z.getFrameExtents();if(s.multiply(D),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/D.x),s.x=r.x*D.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/D.y),s.y=r.y*D.y,z.mapSize.y=r.y)),z.map===null||H===!0||P===!0){const q=this.type!==Zn?{minFilter:We,magFilter:We}:{};z.map!==null&&z.map.dispose(),z.map=new Yi(s.x,s.y,q),z.map.texture.name=N.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();const G=z.getViewportCount();for(let q=0;q<G;q++){const Z=z.getViewport(q);a.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),U.viewport(a),z.updateMatrices(N,q),n=z.getFrustum(),S(E,A,z.camera,N,this.type)}z.isPointLightShadow!==!0&&this.type===Zn&&v(z,A),z.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,y,C)};function v(T,E){const A=t.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Yi(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(E,null,A,d,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(E,null,A,f,_,null)}function x(T,E,A,M){let y=null;const C=A.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)y=C;else if(y=A.isPointLight===!0?c:o,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const U=y.uuid,H=E.uuid;let P=l[U];P===void 0&&(P={},l[U]=P);let F=P[H];F===void 0&&(F=y.clone(),P[H]=F,E.addEventListener("dispose",w)),y=F}if(y.visible=E.visible,y.wireframe=E.wireframe,M===Zn?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:u[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,A.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const U=i.properties.get(y);U.light=A}return y}function S(T,E,A,M,y){if(T.visible===!1)return;if(T.layers.test(E.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===Zn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,T.matrixWorld);const H=t.update(T),P=T.material;if(Array.isArray(P)){const F=H.groups;for(let B=0,N=F.length;B<N;B++){const z=F[B],D=P[z.materialIndex];if(D&&D.visible){const G=x(T,D,M,y);T.onBeforeShadow(i,T,E,A,H,G,z),i.renderBufferDirect(A,null,H,G,T,z),T.onAfterShadow(i,T,E,A,H,G,z)}}}else if(P.visible){const F=x(T,P,M,y);T.onBeforeShadow(i,T,E,A,H,F,null),i.renderBufferDirect(A,null,H,F,T,null),T.onAfterShadow(i,T,E,A,H,F,null)}}const U=T.children;for(let H=0,P=U.length;H<P;H++)S(U[H],E,A,M,y)}function w(T){T.target.removeEventListener("dispose",w);for(const A in l){const M=l[A],y=T.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}function B_(i,t,e){const n=e.isWebGL2;function s(){let W=!1;const gt=new Ie;let Mt=null;const Bt=new Ie(0,0,0,0);return{setMask:function(Ut){Mt!==Ut&&!W&&(i.colorMask(Ut,Ut,Ut,Ut),Mt=Ut)},setLocked:function(Ut){W=Ut},setClear:function(Ut,ee,ne,Ee,Re){Re===!0&&(Ut*=Ee,ee*=Ee,ne*=Ee),gt.set(Ut,ee,ne,Ee),Bt.equals(gt)===!1&&(i.clearColor(Ut,ee,ne,Ee),Bt.copy(gt))},reset:function(){W=!1,Mt=null,Bt.set(-1,0,0,0)}}}function r(){let W=!1,gt=null,Mt=null,Bt=null;return{setTest:function(Ut){Ut?nt(i.DEPTH_TEST):rt(i.DEPTH_TEST)},setMask:function(Ut){gt!==Ut&&!W&&(i.depthMask(Ut),gt=Ut)},setFunc:function(Ut){if(Mt!==Ut){switch(Ut){case Hd:i.depthFunc(i.NEVER);break;case Gd:i.depthFunc(i.ALWAYS);break;case Wd:i.depthFunc(i.LESS);break;case vo:i.depthFunc(i.LEQUAL);break;case Xd:i.depthFunc(i.EQUAL);break;case qd:i.depthFunc(i.GEQUAL);break;case Yd:i.depthFunc(i.GREATER);break;case jd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Mt=Ut}},setLocked:function(Ut){W=Ut},setClear:function(Ut){Bt!==Ut&&(i.clearDepth(Ut),Bt=Ut)},reset:function(){W=!1,gt=null,Mt=null,Bt=null}}}function a(){let W=!1,gt=null,Mt=null,Bt=null,Ut=null,ee=null,ne=null,Ee=null,Re=null;return{setTest:function(se){W||(se?nt(i.STENCIL_TEST):rt(i.STENCIL_TEST))},setMask:function(se){gt!==se&&!W&&(i.stencilMask(se),gt=se)},setFunc:function(se,De,Nn){(Mt!==se||Bt!==De||Ut!==Nn)&&(i.stencilFunc(se,De,Nn),Mt=se,Bt=De,Ut=Nn)},setOp:function(se,De,Nn){(ee!==se||ne!==De||Ee!==Nn)&&(i.stencilOp(se,De,Nn),ee=se,ne=De,Ee=Nn)},setLocked:function(se){W=se},setClear:function(se){Re!==se&&(i.clearStencil(se),Re=se)},reset:function(){W=!1,gt=null,Mt=null,Bt=null,Ut=null,ee=null,ne=null,Ee=null,Re=null}}}const o=new s,c=new r,l=new a,h=new WeakMap,u=new WeakMap;let d={},f={},g=new WeakMap,_=[],m=null,p=!1,v=null,x=null,S=null,w=null,T=null,E=null,A=null,M=new Xt(0,0,0),y=0,C=!1,U=null,H=null,P=null,F=null,B=null;const N=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,D=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(D=parseFloat(/^WebGL (\d)/.exec(G)[1]),z=D>=1):G.indexOf("OpenGL ES")!==-1&&(D=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),z=D>=2);let q=null,Z={};const X=i.getParameter(i.SCISSOR_BOX),j=i.getParameter(i.VIEWPORT),Q=new Ie().fromArray(X),st=new Ie().fromArray(j);function k(W,gt,Mt,Bt){const Ut=new Uint8Array(4),ee=i.createTexture();i.bindTexture(W,ee),i.texParameteri(W,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(W,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ne=0;ne<Mt;ne++)n&&(W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY)?i.texImage3D(gt,0,i.RGBA,1,1,Bt,0,i.RGBA,i.UNSIGNED_BYTE,Ut):i.texImage2D(gt+ne,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ut);return ee}const Y={};Y[i.TEXTURE_2D]=k(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=k(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Y[i.TEXTURE_2D_ARRAY]=k(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=k(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),nt(i.DEPTH_TEST),c.setFunc(vo),Lt(!1),I(qc),nt(i.CULL_FACE),pt(vi);function nt(W){d[W]!==!0&&(i.enable(W),d[W]=!0)}function rt(W){d[W]!==!1&&(i.disable(W),d[W]=!1)}function ht(W,gt){return f[W]!==gt?(i.bindFramebuffer(W,gt),f[W]=gt,n&&(W===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=gt),W===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=gt)),!0):!1}function V(W,gt){let Mt=_,Bt=!1;if(W)if(Mt=g.get(gt),Mt===void 0&&(Mt=[],g.set(gt,Mt)),W.isWebGLMultipleRenderTargets){const Ut=W.texture;if(Mt.length!==Ut.length||Mt[0]!==i.COLOR_ATTACHMENT0){for(let ee=0,ne=Ut.length;ee<ne;ee++)Mt[ee]=i.COLOR_ATTACHMENT0+ee;Mt.length=Ut.length,Bt=!0}}else Mt[0]!==i.COLOR_ATTACHMENT0&&(Mt[0]=i.COLOR_ATTACHMENT0,Bt=!0);else Mt[0]!==i.BACK&&(Mt[0]=i.BACK,Bt=!0);Bt&&(e.isWebGL2?i.drawBuffers(Mt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Mt))}function St(W){return m!==W?(i.useProgram(W),m=W,!0):!1}const ut={[Bi]:i.FUNC_ADD,[Ad]:i.FUNC_SUBTRACT,[Rd]:i.FUNC_REVERSE_SUBTRACT};if(n)ut[Kc]=i.MIN,ut[Zc]=i.MAX;else{const W=t.get("EXT_blend_minmax");W!==null&&(ut[Kc]=W.MIN_EXT,ut[Zc]=W.MAX_EXT)}const _t={[Cd]:i.ZERO,[Pd]:i.ONE,[Ld]:i.SRC_COLOR,[Za]:i.SRC_ALPHA,[Od]:i.SRC_ALPHA_SATURATE,[Nd]:i.DST_COLOR,[Dd]:i.DST_ALPHA,[Id]:i.ONE_MINUS_SRC_COLOR,[Ja]:i.ONE_MINUS_SRC_ALPHA,[Fd]:i.ONE_MINUS_DST_COLOR,[Ud]:i.ONE_MINUS_DST_ALPHA,[Bd]:i.CONSTANT_COLOR,[zd]:i.ONE_MINUS_CONSTANT_COLOR,[kd]:i.CONSTANT_ALPHA,[Vd]:i.ONE_MINUS_CONSTANT_ALPHA};function pt(W,gt,Mt,Bt,Ut,ee,ne,Ee,Re,se){if(W===vi){p===!0&&(rt(i.BLEND),p=!1);return}if(p===!1&&(nt(i.BLEND),p=!0),W!==Td){if(W!==v||se!==C){if((x!==Bi||T!==Bi)&&(i.blendEquation(i.FUNC_ADD),x=Bi,T=Bi),se)switch(W){case Us:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Yc:i.blendFunc(i.ONE,i.ONE);break;case jc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $c:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Us:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Yc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case jc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case $c:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}S=null,w=null,E=null,A=null,M.set(0,0,0),y=0,v=W,C=se}return}Ut=Ut||gt,ee=ee||Mt,ne=ne||Bt,(gt!==x||Ut!==T)&&(i.blendEquationSeparate(ut[gt],ut[Ut]),x=gt,T=Ut),(Mt!==S||Bt!==w||ee!==E||ne!==A)&&(i.blendFuncSeparate(_t[Mt],_t[Bt],_t[ee],_t[ne]),S=Mt,w=Bt,E=ee,A=ne),(Ee.equals(M)===!1||Re!==y)&&(i.blendColor(Ee.r,Ee.g,Ee.b,Re),M.copy(Ee),y=Re),v=W,C=!1}function Ct(W,gt){W.side===Mn?rt(i.CULL_FACE):nt(i.CULL_FACE);let Mt=W.side===un;gt&&(Mt=!Mt),Lt(Mt),W.blending===Us&&W.transparent===!1?pt(vi):pt(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),c.setFunc(W.depthFunc),c.setTest(W.depthTest),c.setMask(W.depthWrite),o.setMask(W.colorWrite);const Bt=W.stencilWrite;l.setTest(Bt),Bt&&(l.setMask(W.stencilWriteMask),l.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),l.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),J(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?nt(i.SAMPLE_ALPHA_TO_COVERAGE):rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Lt(W){U!==W&&(W?i.frontFace(i.CW):i.frontFace(i.CCW),U=W)}function I(W){W!==Sd?(nt(i.CULL_FACE),W!==H&&(W===qc?i.cullFace(i.BACK):W===Ed?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):rt(i.CULL_FACE),H=W}function R(W){W!==P&&(z&&i.lineWidth(W),P=W)}function J(W,gt,Mt){W?(nt(i.POLYGON_OFFSET_FILL),(F!==gt||B!==Mt)&&(i.polygonOffset(gt,Mt),F=gt,B=Mt)):rt(i.POLYGON_OFFSET_FILL)}function dt(W){W?nt(i.SCISSOR_TEST):rt(i.SCISSOR_TEST)}function ct(W){W===void 0&&(W=i.TEXTURE0+N-1),q!==W&&(i.activeTexture(W),q=W)}function ft(W,gt,Mt){Mt===void 0&&(q===null?Mt=i.TEXTURE0+N-1:Mt=q);let Bt=Z[Mt];Bt===void 0&&(Bt={type:void 0,texture:void 0},Z[Mt]=Bt),(Bt.type!==W||Bt.texture!==gt)&&(q!==Mt&&(i.activeTexture(Mt),q=Mt),i.bindTexture(W,gt||Y[W]),Bt.type=W,Bt.texture=gt)}function Rt(){const W=Z[q];W!==void 0&&W.type!==void 0&&(i.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function bt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function At(){try{i.compressedTexImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Nt(){try{i.texSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Yt(){try{i.texSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function at(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function oe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Kt(){try{i.texStorage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function kt(){try{i.texStorage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Dt(){try{i.texImage2D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Et(){try{i.texImage3D.apply(i,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function O(W){Q.equals(W)===!1&&(i.scissor(W.x,W.y,W.z,W.w),Q.copy(W))}function mt(W){st.equals(W)===!1&&(i.viewport(W.x,W.y,W.z,W.w),st.copy(W))}function Pt(W,gt){let Mt=u.get(gt);Mt===void 0&&(Mt=new WeakMap,u.set(gt,Mt));let Bt=Mt.get(W);Bt===void 0&&(Bt=i.getUniformBlockIndex(gt,W.name),Mt.set(W,Bt))}function Tt(W,gt){const Bt=u.get(gt).get(W);h.get(gt)!==Bt&&(i.uniformBlockBinding(gt,Bt,W.__bindingPointIndex),h.set(gt,Bt))}function lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},q=null,Z={},f={},g=new WeakMap,_=[],m=null,p=!1,v=null,x=null,S=null,w=null,T=null,E=null,A=null,M=new Xt(0,0,0),y=0,C=!1,U=null,H=null,P=null,F=null,B=null,Q.set(0,0,i.canvas.width,i.canvas.height),st.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:nt,disable:rt,bindFramebuffer:ht,drawBuffers:V,useProgram:St,setBlending:pt,setMaterial:Ct,setFlipSided:Lt,setCullFace:I,setLineWidth:R,setPolygonOffset:J,setScissorTest:dt,activeTexture:ct,bindTexture:ft,unbindTexture:Rt,compressedTexImage2D:bt,compressedTexImage3D:At,texImage2D:Dt,texImage3D:Et,updateUBOMapping:Pt,uniformBlockBinding:Tt,texStorage2D:Kt,texStorage3D:kt,texSubImage2D:Nt,texSubImage3D:Yt,compressedTexSubImage2D:at,compressedTexSubImage3D:oe,scissor:O,viewport:mt,reset:lt}}function z_(i,t,e,n,s,r,a){const o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,R){return f?new OffscreenCanvas(I,R):Co("canvas")}function _(I,R,J,dt){let ct=1;if((I.width>dt||I.height>dt)&&(ct=dt/Math.max(I.width,I.height)),ct<1||R===!0)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap){const ft=R?Ro:Math.floor,Rt=ft(ct*I.width),bt=ft(ct*I.height);u===void 0&&(u=g(Rt,bt));const At=J?g(Rt,bt):u;return At.width=Rt,At.height=bt,At.getContext("2d").drawImage(I,0,0,Rt,bt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+I.width+"x"+I.height+") to ("+Rt+"x"+bt+")."),At}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+I.width+"x"+I.height+")."),I;return I}function m(I){return sc(I.width)&&sc(I.height)}function p(I){return o?!1:I.wrapS!==In||I.wrapT!==In||I.minFilter!==We&&I.minFilter!==Sn}function v(I,R){return I.generateMipmaps&&R&&I.minFilter!==We&&I.minFilter!==Sn}function x(I){i.generateMipmap(I)}function S(I,R,J,dt,ct=!1){if(o===!1)return R;if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ft=R;if(R===i.RED&&(J===i.FLOAT&&(ft=i.R32F),J===i.HALF_FLOAT&&(ft=i.R16F),J===i.UNSIGNED_BYTE&&(ft=i.R8)),R===i.RED_INTEGER&&(J===i.UNSIGNED_BYTE&&(ft=i.R8UI),J===i.UNSIGNED_SHORT&&(ft=i.R16UI),J===i.UNSIGNED_INT&&(ft=i.R32UI),J===i.BYTE&&(ft=i.R8I),J===i.SHORT&&(ft=i.R16I),J===i.INT&&(ft=i.R32I)),R===i.RG&&(J===i.FLOAT&&(ft=i.RG32F),J===i.HALF_FLOAT&&(ft=i.RG16F),J===i.UNSIGNED_BYTE&&(ft=i.RG8)),R===i.RGBA){const Rt=ct?Eo:he.getTransfer(dt);J===i.FLOAT&&(ft=i.RGBA32F),J===i.HALF_FLOAT&&(ft=i.RGBA16F),J===i.UNSIGNED_BYTE&&(ft=Rt===xe?i.SRGB8_ALPHA8:i.RGBA8),J===i.UNSIGNED_SHORT_4_4_4_4&&(ft=i.RGBA4),J===i.UNSIGNED_SHORT_5_5_5_1&&(ft=i.RGB5_A1)}return(ft===i.R16F||ft===i.R32F||ft===i.RG16F||ft===i.RG32F||ft===i.RGBA16F||ft===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ft}function w(I,R,J){return v(I,J)===!0||I.isFramebufferTexture&&I.minFilter!==We&&I.minFilter!==Sn?Math.log2(Math.max(R.width,R.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?R.mipmaps.length:1}function T(I){return I===We||I===Qc||I===Go?i.NEAREST:i.LINEAR}function E(I){const R=I.target;R.removeEventListener("dispose",E),M(R),R.isVideoTexture&&h.delete(R)}function A(I){const R=I.target;R.removeEventListener("dispose",A),C(R)}function M(I){const R=n.get(I);if(R.__webglInit===void 0)return;const J=I.source,dt=d.get(J);if(dt){const ct=dt[R.__cacheKey];ct.usedTimes--,ct.usedTimes===0&&y(I),Object.keys(dt).length===0&&d.delete(J)}n.remove(I)}function y(I){const R=n.get(I);i.deleteTexture(R.__webglTexture);const J=I.source,dt=d.get(J);delete dt[R.__cacheKey],a.memory.textures--}function C(I){const R=I.texture,J=n.get(I),dt=n.get(R);if(dt.__webglTexture!==void 0&&(i.deleteTexture(dt.__webglTexture),a.memory.textures--),I.depthTexture&&I.depthTexture.dispose(),I.isWebGLCubeRenderTarget)for(let ct=0;ct<6;ct++){if(Array.isArray(J.__webglFramebuffer[ct]))for(let ft=0;ft<J.__webglFramebuffer[ct].length;ft++)i.deleteFramebuffer(J.__webglFramebuffer[ct][ft]);else i.deleteFramebuffer(J.__webglFramebuffer[ct]);J.__webglDepthbuffer&&i.deleteRenderbuffer(J.__webglDepthbuffer[ct])}else{if(Array.isArray(J.__webglFramebuffer))for(let ct=0;ct<J.__webglFramebuffer.length;ct++)i.deleteFramebuffer(J.__webglFramebuffer[ct]);else i.deleteFramebuffer(J.__webglFramebuffer);if(J.__webglDepthbuffer&&i.deleteRenderbuffer(J.__webglDepthbuffer),J.__webglMultisampledFramebuffer&&i.deleteFramebuffer(J.__webglMultisampledFramebuffer),J.__webglColorRenderbuffer)for(let ct=0;ct<J.__webglColorRenderbuffer.length;ct++)J.__webglColorRenderbuffer[ct]&&i.deleteRenderbuffer(J.__webglColorRenderbuffer[ct]);J.__webglDepthRenderbuffer&&i.deleteRenderbuffer(J.__webglDepthRenderbuffer)}if(I.isWebGLMultipleRenderTargets)for(let ct=0,ft=R.length;ct<ft;ct++){const Rt=n.get(R[ct]);Rt.__webglTexture&&(i.deleteTexture(Rt.__webglTexture),a.memory.textures--),n.remove(R[ct])}n.remove(R),n.remove(I)}let U=0;function H(){U=0}function P(){const I=U;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),U+=1,I}function F(I){const R=[];return R.push(I.wrapS),R.push(I.wrapT),R.push(I.wrapR||0),R.push(I.magFilter),R.push(I.minFilter),R.push(I.anisotropy),R.push(I.internalFormat),R.push(I.format),R.push(I.type),R.push(I.generateMipmaps),R.push(I.premultiplyAlpha),R.push(I.flipY),R.push(I.unpackAlignment),R.push(I.colorSpace),R.join()}function B(I,R){const J=n.get(I);if(I.isVideoTexture&&Ct(I),I.isRenderTargetTexture===!1&&I.version>0&&J.__version!==I.version){const dt=I.image;if(dt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(dt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(J,I,R);return}}e.bindTexture(i.TEXTURE_2D,J.__webglTexture,i.TEXTURE0+R)}function N(I,R){const J=n.get(I);if(I.version>0&&J.__version!==I.version){Q(J,I,R);return}e.bindTexture(i.TEXTURE_2D_ARRAY,J.__webglTexture,i.TEXTURE0+R)}function z(I,R){const J=n.get(I);if(I.version>0&&J.__version!==I.version){Q(J,I,R);return}e.bindTexture(i.TEXTURE_3D,J.__webglTexture,i.TEXTURE0+R)}function D(I,R){const J=n.get(I);if(I.version>0&&J.__version!==I.version){st(J,I,R);return}e.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture,i.TEXTURE0+R)}const G={[ks]:i.REPEAT,[In]:i.CLAMP_TO_EDGE,[tc]:i.MIRRORED_REPEAT},q={[We]:i.NEAREST,[Qc]:i.NEAREST_MIPMAP_NEAREST,[Go]:i.NEAREST_MIPMAP_LINEAR,[Sn]:i.LINEAR,[rf]:i.LINEAR_MIPMAP_NEAREST,[_r]:i.LINEAR_MIPMAP_LINEAR},Z={[Mf]:i.NEVER,[Tf]:i.ALWAYS,[yf]:i.LESS,[pu]:i.LEQUAL,[bf]:i.EQUAL,[wf]:i.GEQUAL,[Sf]:i.GREATER,[Ef]:i.NOTEQUAL};function X(I,R,J){if(J?(i.texParameteri(I,i.TEXTURE_WRAP_S,G[R.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,G[R.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,G[R.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,q[R.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,q[R.minFilter])):(i.texParameteri(I,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(I,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(R.wrapS!==In||R.wrapT!==In)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(I,i.TEXTURE_MAG_FILTER,T(R.magFilter)),i.texParameteri(I,i.TEXTURE_MIN_FILTER,T(R.minFilter)),R.minFilter!==We&&R.minFilter!==Sn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),R.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,Z[R.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const dt=t.get("EXT_texture_filter_anisotropic");if(R.magFilter===We||R.minFilter!==Go&&R.minFilter!==_r||R.type===Jn&&t.has("OES_texture_float_linear")===!1||o===!1&&R.type===xr&&t.has("OES_texture_half_float_linear")===!1)return;(R.anisotropy>1||n.get(R).__currentAnisotropy)&&(i.texParameterf(I,dt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,s.getMaxAnisotropy())),n.get(R).__currentAnisotropy=R.anisotropy)}}function j(I,R){let J=!1;I.__webglInit===void 0&&(I.__webglInit=!0,R.addEventListener("dispose",E));const dt=R.source;let ct=d.get(dt);ct===void 0&&(ct={},d.set(dt,ct));const ft=F(R);if(ft!==I.__cacheKey){ct[ft]===void 0&&(ct[ft]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,J=!0),ct[ft].usedTimes++;const Rt=ct[I.__cacheKey];Rt!==void 0&&(ct[I.__cacheKey].usedTimes--,Rt.usedTimes===0&&y(R)),I.__cacheKey=ft,I.__webglTexture=ct[ft].texture}return J}function Q(I,R,J){let dt=i.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(dt=i.TEXTURE_2D_ARRAY),R.isData3DTexture&&(dt=i.TEXTURE_3D);const ct=j(I,R),ft=R.source;e.bindTexture(dt,I.__webglTexture,i.TEXTURE0+J);const Rt=n.get(ft);if(ft.version!==Rt.__version||ct===!0){e.activeTexture(i.TEXTURE0+J);const bt=he.getPrimaries(he.workingColorSpace),At=R.colorSpace===Tn?null:he.getPrimaries(R.colorSpace),Nt=R.colorSpace===Tn||bt===At?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);const Yt=p(R)&&m(R.image)===!1;let at=_(R.image,Yt,!1,s.maxTextureSize);at=Lt(R,at);const oe=m(at)||o,Kt=r.convert(R.format,R.colorSpace);let kt=r.convert(R.type),Dt=S(R.internalFormat,Kt,kt,R.colorSpace,R.isVideoTexture);X(dt,R,oe);let Et;const O=R.mipmaps,mt=o&&R.isVideoTexture!==!0&&Dt!==uu,Pt=Rt.__version===void 0||ct===!0,Tt=w(R,at,oe);if(R.isDepthTexture)Dt=i.DEPTH_COMPONENT,o?R.type===Jn?Dt=i.DEPTH_COMPONENT32F:R.type===gi?Dt=i.DEPTH_COMPONENT24:R.type===Gi?Dt=i.DEPTH24_STENCIL8:Dt=i.DEPTH_COMPONENT16:R.type===Jn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),R.format===Wi&&Dt===i.DEPTH_COMPONENT&&R.type!==mc&&R.type!==gi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),R.type=gi,kt=r.convert(R.type)),R.format===Vs&&Dt===i.DEPTH_COMPONENT&&(Dt=i.DEPTH_STENCIL,R.type!==Gi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),R.type=Gi,kt=r.convert(R.type))),Pt&&(mt?e.texStorage2D(i.TEXTURE_2D,1,Dt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,Kt,kt,null));else if(R.isDataTexture)if(O.length>0&&oe){mt&&Pt&&e.texStorage2D(i.TEXTURE_2D,Tt,Dt,O[0].width,O[0].height);for(let lt=0,W=O.length;lt<W;lt++)Et=O[lt],mt?e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Et.width,Et.height,Kt,kt,Et.data):e.texImage2D(i.TEXTURE_2D,lt,Dt,Et.width,Et.height,0,Kt,kt,Et.data);R.generateMipmaps=!1}else mt?(Pt&&e.texStorage2D(i.TEXTURE_2D,Tt,Dt,at.width,at.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,at.width,at.height,Kt,kt,at.data)):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,Kt,kt,at.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){mt&&Pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Dt,O[0].width,O[0].height,at.depth);for(let lt=0,W=O.length;lt<W;lt++)Et=O[lt],R.format!==wn?Kt!==null?mt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,Et.width,Et.height,at.depth,Kt,Et.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,lt,Dt,Et.width,Et.height,at.depth,0,Et.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):mt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,Et.width,Et.height,at.depth,Kt,kt,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,lt,Dt,Et.width,Et.height,at.depth,0,Kt,kt,Et.data)}else{mt&&Pt&&e.texStorage2D(i.TEXTURE_2D,Tt,Dt,O[0].width,O[0].height);for(let lt=0,W=O.length;lt<W;lt++)Et=O[lt],R.format!==wn?Kt!==null?mt?e.compressedTexSubImage2D(i.TEXTURE_2D,lt,0,0,Et.width,Et.height,Kt,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,lt,Dt,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):mt?e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Et.width,Et.height,Kt,kt,Et.data):e.texImage2D(i.TEXTURE_2D,lt,Dt,Et.width,Et.height,0,Kt,kt,Et.data)}else if(R.isDataArrayTexture)mt?(Pt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Tt,Dt,at.width,at.height,at.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,Kt,kt,at.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Dt,at.width,at.height,at.depth,0,Kt,kt,at.data);else if(R.isData3DTexture)mt?(Pt&&e.texStorage3D(i.TEXTURE_3D,Tt,Dt,at.width,at.height,at.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,Kt,kt,at.data)):e.texImage3D(i.TEXTURE_3D,0,Dt,at.width,at.height,at.depth,0,Kt,kt,at.data);else if(R.isFramebufferTexture){if(Pt)if(mt)e.texStorage2D(i.TEXTURE_2D,Tt,Dt,at.width,at.height);else{let lt=at.width,W=at.height;for(let gt=0;gt<Tt;gt++)e.texImage2D(i.TEXTURE_2D,gt,Dt,lt,W,0,Kt,kt,null),lt>>=1,W>>=1}}else if(O.length>0&&oe){mt&&Pt&&e.texStorage2D(i.TEXTURE_2D,Tt,Dt,O[0].width,O[0].height);for(let lt=0,W=O.length;lt<W;lt++)Et=O[lt],mt?e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Kt,kt,Et):e.texImage2D(i.TEXTURE_2D,lt,Dt,Kt,kt,Et);R.generateMipmaps=!1}else mt?(Pt&&e.texStorage2D(i.TEXTURE_2D,Tt,Dt,at.width,at.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Kt,kt,at)):e.texImage2D(i.TEXTURE_2D,0,Dt,Kt,kt,at);v(R,oe)&&x(dt),Rt.__version=ft.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function st(I,R,J){if(R.image.length!==6)return;const dt=j(I,R),ct=R.source;e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+J);const ft=n.get(ct);if(ct.version!==ft.__version||dt===!0){e.activeTexture(i.TEXTURE0+J);const Rt=he.getPrimaries(he.workingColorSpace),bt=R.colorSpace===Tn?null:he.getPrimaries(R.colorSpace),At=R.colorSpace===Tn||Rt===bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,R.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,R.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,At);const Nt=R.isCompressedTexture||R.image[0].isCompressedTexture,Yt=R.image[0]&&R.image[0].isDataTexture,at=[];for(let lt=0;lt<6;lt++)!Nt&&!Yt?at[lt]=_(R.image[lt],!1,!0,s.maxCubemapSize):at[lt]=Yt?R.image[lt].image:R.image[lt],at[lt]=Lt(R,at[lt]);const oe=at[0],Kt=m(oe)||o,kt=r.convert(R.format,R.colorSpace),Dt=r.convert(R.type),Et=S(R.internalFormat,kt,Dt,R.colorSpace),O=o&&R.isVideoTexture!==!0,mt=ft.__version===void 0||dt===!0;let Pt=w(R,oe,Kt);X(i.TEXTURE_CUBE_MAP,R,Kt);let Tt;if(Nt){O&&mt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,Et,oe.width,oe.height);for(let lt=0;lt<6;lt++){Tt=at[lt].mipmaps;for(let W=0;W<Tt.length;W++){const gt=Tt[W];R.format!==wn?kt!==null?O?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W,0,0,gt.width,gt.height,kt,gt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W,Et,gt.width,gt.height,0,gt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W,0,0,gt.width,gt.height,kt,Dt,gt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W,Et,gt.width,gt.height,0,kt,Dt,gt.data)}}}else{Tt=R.mipmaps,O&&mt&&(Tt.length>0&&Pt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Pt,Et,at[0].width,at[0].height));for(let lt=0;lt<6;lt++)if(Yt){O?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,at[lt].width,at[lt].height,kt,Dt,at[lt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Et,at[lt].width,at[lt].height,0,kt,Dt,at[lt].data);for(let W=0;W<Tt.length;W++){const Mt=Tt[W].image[lt].image;O?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W+1,0,0,Mt.width,Mt.height,kt,Dt,Mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W+1,Et,Mt.width,Mt.height,0,kt,Dt,Mt.data)}}else{O?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,kt,Dt,at[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,Et,kt,Dt,at[lt]);for(let W=0;W<Tt.length;W++){const gt=Tt[W];O?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W+1,0,0,kt,Dt,gt.image[lt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,W+1,Et,kt,Dt,gt.image[lt])}}}v(R,Kt)&&x(i.TEXTURE_CUBE_MAP),ft.__version=ct.version,R.onUpdate&&R.onUpdate(R)}I.__version=R.version}function k(I,R,J,dt,ct,ft){const Rt=r.convert(J.format,J.colorSpace),bt=r.convert(J.type),At=S(J.internalFormat,Rt,bt,J.colorSpace);if(!n.get(R).__hasExternalTextures){const Yt=Math.max(1,R.width>>ft),at=Math.max(1,R.height>>ft);ct===i.TEXTURE_3D||ct===i.TEXTURE_2D_ARRAY?e.texImage3D(ct,ft,At,Yt,at,R.depth,0,Rt,bt,null):e.texImage2D(ct,ft,At,Yt,at,0,Rt,bt,null)}e.bindFramebuffer(i.FRAMEBUFFER,I),pt(R)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,dt,ct,n.get(J).__webglTexture,0,_t(R)):(ct===i.TEXTURE_2D||ct>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ct<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,dt,ct,n.get(J).__webglTexture,ft),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Y(I,R,J){if(i.bindRenderbuffer(i.RENDERBUFFER,I),R.depthBuffer&&!R.stencilBuffer){let dt=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(J||pt(R)){const ct=R.depthTexture;ct&&ct.isDepthTexture&&(ct.type===Jn?dt=i.DEPTH_COMPONENT32F:ct.type===gi&&(dt=i.DEPTH_COMPONENT24));const ft=_t(R);pt(R)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ft,dt,R.width,R.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ft,dt,R.width,R.height)}else i.renderbufferStorage(i.RENDERBUFFER,dt,R.width,R.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,I)}else if(R.depthBuffer&&R.stencilBuffer){const dt=_t(R);J&&pt(R)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,i.DEPTH24_STENCIL8,R.width,R.height):pt(R)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,i.DEPTH24_STENCIL8,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,I)}else{const dt=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let ct=0;ct<dt.length;ct++){const ft=dt[ct],Rt=r.convert(ft.format,ft.colorSpace),bt=r.convert(ft.type),At=S(ft.internalFormat,Rt,bt,ft.colorSpace),Nt=_t(R);J&&pt(R)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,At,R.width,R.height):pt(R)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt,At,R.width,R.height):i.renderbufferStorage(i.RENDERBUFFER,At,R.width,R.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function nt(I,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,I),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(R.depthTexture).__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),B(R.depthTexture,0);const dt=n.get(R.depthTexture).__webglTexture,ct=_t(R);if(R.depthTexture.format===Wi)pt(R)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0);else if(R.depthTexture.format===Vs)pt(R)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0,ct):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function rt(I){const R=n.get(I),J=I.isWebGLCubeRenderTarget===!0;if(I.depthTexture&&!R.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");nt(R.__webglFramebuffer,I)}else if(J){R.__webglDepthbuffer=[];for(let dt=0;dt<6;dt++)e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer[dt]),R.__webglDepthbuffer[dt]=i.createRenderbuffer(),Y(R.__webglDepthbuffer[dt],I,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer=i.createRenderbuffer(),Y(R.__webglDepthbuffer,I,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function ht(I,R,J){const dt=n.get(I);R!==void 0&&k(dt.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),J!==void 0&&rt(I)}function V(I){const R=I.texture,J=n.get(I),dt=n.get(R);I.addEventListener("dispose",A),I.isWebGLMultipleRenderTargets!==!0&&(dt.__webglTexture===void 0&&(dt.__webglTexture=i.createTexture()),dt.__version=R.version,a.memory.textures++);const ct=I.isWebGLCubeRenderTarget===!0,ft=I.isWebGLMultipleRenderTargets===!0,Rt=m(I)||o;if(ct){J.__webglFramebuffer=[];for(let bt=0;bt<6;bt++)if(o&&R.mipmaps&&R.mipmaps.length>0){J.__webglFramebuffer[bt]=[];for(let At=0;At<R.mipmaps.length;At++)J.__webglFramebuffer[bt][At]=i.createFramebuffer()}else J.__webglFramebuffer[bt]=i.createFramebuffer()}else{if(o&&R.mipmaps&&R.mipmaps.length>0){J.__webglFramebuffer=[];for(let bt=0;bt<R.mipmaps.length;bt++)J.__webglFramebuffer[bt]=i.createFramebuffer()}else J.__webglFramebuffer=i.createFramebuffer();if(ft)if(s.drawBuffers){const bt=I.texture;for(let At=0,Nt=bt.length;At<Nt;At++){const Yt=n.get(bt[At]);Yt.__webglTexture===void 0&&(Yt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&I.samples>0&&pt(I)===!1){const bt=ft?R:[R];J.__webglMultisampledFramebuffer=i.createFramebuffer(),J.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let At=0;At<bt.length;At++){const Nt=bt[At];J.__webglColorRenderbuffer[At]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,J.__webglColorRenderbuffer[At]);const Yt=r.convert(Nt.format,Nt.colorSpace),at=r.convert(Nt.type),oe=S(Nt.internalFormat,Yt,at,Nt.colorSpace,I.isXRRenderTarget===!0),Kt=_t(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Kt,oe,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+At,i.RENDERBUFFER,J.__webglColorRenderbuffer[At])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(J.__webglDepthRenderbuffer=i.createRenderbuffer(),Y(J.__webglDepthRenderbuffer,I,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ct){e.bindTexture(i.TEXTURE_CUBE_MAP,dt.__webglTexture),X(i.TEXTURE_CUBE_MAP,R,Rt);for(let bt=0;bt<6;bt++)if(o&&R.mipmaps&&R.mipmaps.length>0)for(let At=0;At<R.mipmaps.length;At++)k(J.__webglFramebuffer[bt][At],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,At);else k(J.__webglFramebuffer[bt],I,R,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0);v(R,Rt)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ft){const bt=I.texture;for(let At=0,Nt=bt.length;At<Nt;At++){const Yt=bt[At],at=n.get(Yt);e.bindTexture(i.TEXTURE_2D,at.__webglTexture),X(i.TEXTURE_2D,Yt,Rt),k(J.__webglFramebuffer,I,Yt,i.COLOR_ATTACHMENT0+At,i.TEXTURE_2D,0),v(Yt,Rt)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let bt=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(o?bt=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(bt,dt.__webglTexture),X(bt,R,Rt),o&&R.mipmaps&&R.mipmaps.length>0)for(let At=0;At<R.mipmaps.length;At++)k(J.__webglFramebuffer[At],I,R,i.COLOR_ATTACHMENT0,bt,At);else k(J.__webglFramebuffer,I,R,i.COLOR_ATTACHMENT0,bt,0);v(R,Rt)&&x(bt),e.unbindTexture()}I.depthBuffer&&rt(I)}function St(I){const R=m(I)||o,J=I.isWebGLMultipleRenderTargets===!0?I.texture:[I.texture];for(let dt=0,ct=J.length;dt<ct;dt++){const ft=J[dt];if(v(ft,R)){const Rt=I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,bt=n.get(ft).__webglTexture;e.bindTexture(Rt,bt),x(Rt),e.unbindTexture()}}}function ut(I){if(o&&I.samples>0&&pt(I)===!1){const R=I.isWebGLMultipleRenderTargets?I.texture:[I.texture],J=I.width,dt=I.height;let ct=i.COLOR_BUFFER_BIT;const ft=[],Rt=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,bt=n.get(I),At=I.isWebGLMultipleRenderTargets===!0;if(At)for(let Nt=0;Nt<R.length;Nt++)e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,bt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglFramebuffer);for(let Nt=0;Nt<R.length;Nt++){ft.push(i.COLOR_ATTACHMENT0+Nt),I.depthBuffer&&ft.push(Rt);const Yt=bt.__ignoreDepthValues!==void 0?bt.__ignoreDepthValues:!1;if(Yt===!1&&(I.depthBuffer&&(ct|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&(ct|=i.STENCIL_BUFFER_BIT)),At&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,bt.__webglColorRenderbuffer[Nt]),Yt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Rt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Rt])),At){const at=n.get(R[Nt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,at,0)}i.blitFramebuffer(0,0,J,dt,0,0,J,dt,ct,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ft)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),At)for(let Nt=0;Nt<R.length;Nt++){e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,bt.__webglColorRenderbuffer[Nt]);const Yt=n.get(R[Nt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,bt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,Yt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,bt.__webglMultisampledFramebuffer)}}function _t(I){return Math.min(s.maxSamples,I.samples)}function pt(I){const R=n.get(I);return o&&I.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Ct(I){const R=a.render.frame;h.get(I)!==R&&(h.set(I,R),I.update())}function Lt(I,R){const J=I.colorSpace,dt=I.format,ct=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||I.format===ic||J!==ei&&J!==Tn&&(he.getTransfer(J)===xe?o===!1?t.has("EXT_sRGB")===!0&&dt===wn?(I.format=ic,I.minFilter=Sn,I.generateMipmaps=!1):R=gu.sRGBToLinear(R):(dt!==wn||ct!==yi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",J)),R}this.allocateTextureUnit=P,this.resetTextureUnits=H,this.setTexture2D=B,this.setTexture2DArray=N,this.setTexture3D=z,this.setTextureCube=D,this.rebindTextures=ht,this.setupRenderTarget=V,this.updateRenderTargetMipmap=St,this.updateMultisampleRenderTarget=ut,this.setupDepthRenderbuffer=rt,this.setupFrameBufferTexture=k,this.useMultisampledRTT=pt}function k_(i,t,e){const n=e.isWebGL2;function s(r,a=Tn){let o;const c=he.getTransfer(a);if(r===yi)return i.UNSIGNED_BYTE;if(r===ou)return i.UNSIGNED_SHORT_4_4_4_4;if(r===au)return i.UNSIGNED_SHORT_5_5_5_1;if(r===of)return i.BYTE;if(r===af)return i.SHORT;if(r===mc)return i.UNSIGNED_SHORT;if(r===ru)return i.INT;if(r===gi)return i.UNSIGNED_INT;if(r===Jn)return i.FLOAT;if(r===xr)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===cf)return i.ALPHA;if(r===wn)return i.RGBA;if(r===lf)return i.LUMINANCE;if(r===hf)return i.LUMINANCE_ALPHA;if(r===Wi)return i.DEPTH_COMPONENT;if(r===Vs)return i.DEPTH_STENCIL;if(r===ic)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===uf)return i.RED;if(r===cu)return i.RED_INTEGER;if(r===df)return i.RG;if(r===lu)return i.RG_INTEGER;if(r===hu)return i.RGBA_INTEGER;if(r===Wo||r===Xo||r===qo||r===Yo)if(c===xe)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Wo)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Xo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===qo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Yo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Wo)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Xo)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===qo)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Yo)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===tl||r===el||r===nl||r===il)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===tl)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===el)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===nl)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===il)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===uu)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===sl||r===rl)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===sl)return c===xe?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===rl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===ol||r===al||r===cl||r===ll||r===hl||r===ul||r===dl||r===fl||r===pl||r===ml||r===gl||r===_l||r===xl||r===vl)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===ol)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===al)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===cl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ll)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===hl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ul)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===dl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===fl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===pl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===ml)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===gl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===_l)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===xl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===vl)return c===xe?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===jo||r===Ml||r===yl)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===jo)return c===xe?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ml)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===yl)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===ff||r===bl||r===Sl||r===El)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===jo)return o.COMPRESSED_RED_RGTC1_EXT;if(r===bl)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Sl)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===El)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Gi?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}class V_ extends Ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Ds extends Ae{constructor(){super(),this.isGroup=!0,this.type="Group"}}const H_={type:"move"};class xa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ds,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ds,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new b,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new b),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ds,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new b,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new b),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(H_)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Ds;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class G_ extends Ti{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=e.getContextAttributes();let m=null,p=null;const v=[],x=[],S=new ot;let w=null;const T=new Ln;T.layers.enable(1),T.viewport=new Ie;const E=new Ln;E.layers.enable(2),E.viewport=new Ie;const A=[T,E],M=new V_;M.layers.enable(1),M.layers.enable(2);let y=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let j=v[X];return j===void 0&&(j=new xa,v[X]=j),j.getTargetRaySpace()},this.getControllerGrip=function(X){let j=v[X];return j===void 0&&(j=new xa,v[X]=j),j.getGripSpace()},this.getHand=function(X){let j=v[X];return j===void 0&&(j=new xa,v[X]=j),j.getHandSpace()};function U(X){const j=x.indexOf(X.inputSource);if(j===-1)return;const Q=v[j];Q!==void 0&&(Q.update(X.inputSource,X.frame,l||a),Q.dispatchEvent({type:X.type,data:X.inputSource}))}function H(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",P);for(let X=0;X<v.length;X++){const j=x[X];j!==null&&(x[X]=null,v[X].disconnect(j))}y=null,C=null,t.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,Z.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(S.width,S.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){r=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(X){if(s=X,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",H),s.addEventListener("inputsourceschange",P),_.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(S),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const j={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,j),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new Yi(f.framebufferWidth,f.framebufferHeight,{format:wn,type:yi,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let j=null,Q=null,st=null;_.depth&&(st=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=_.stencil?Vs:Wi,Q=_.stencil?Gi:gi);const k={colorFormat:e.RGBA8,depthFormat:st,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(k),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new Yi(d.textureWidth,d.textureHeight,{format:wn,type:yi,depthTexture:new Ru(d.textureWidth,d.textureHeight,Q,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});const Y=t.properties.get(p);Y.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),Z.setContext(s),Z.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function P(X){for(let j=0;j<X.removed.length;j++){const Q=X.removed[j],st=x.indexOf(Q);st>=0&&(x[st]=null,v[st].disconnect(Q))}for(let j=0;j<X.added.length;j++){const Q=X.added[j];let st=x.indexOf(Q);if(st===-1){for(let Y=0;Y<v.length;Y++)if(Y>=x.length){x.push(Q),st=Y;break}else if(x[Y]===null){x[Y]=Q,st=Y;break}if(st===-1)break}const k=v[st];k&&k.connect(Q)}}const F=new b,B=new b;function N(X,j,Q){F.setFromMatrixPosition(j.matrixWorld),B.setFromMatrixPosition(Q.matrixWorld);const st=F.distanceTo(B),k=j.projectionMatrix.elements,Y=Q.projectionMatrix.elements,nt=k[14]/(k[10]-1),rt=k[14]/(k[10]+1),ht=(k[9]+1)/k[5],V=(k[9]-1)/k[5],St=(k[8]-1)/k[0],ut=(Y[8]+1)/Y[0],_t=nt*St,pt=nt*ut,Ct=st/(-St+ut),Lt=Ct*-St;j.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Lt),X.translateZ(Ct),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const I=nt+Ct,R=rt+Ct,J=_t-Lt,dt=pt+(st-Lt),ct=ht*rt/R*I,ft=V*rt/R*I;X.projectionMatrix.makePerspective(J,dt,ct,ft,I,R),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function z(X,j){j===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(j.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(s===null)return;M.near=E.near=T.near=X.near,M.far=E.far=T.far=X.far,(y!==M.near||C!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),y=M.near,C=M.far);const j=X.parent,Q=M.cameras;z(M,j);for(let st=0;st<Q.length;st++)z(Q[st],j);Q.length===2?N(M,T,E):M.projectionMatrix.copy(T.projectionMatrix),D(X,M,j)};function D(X,j,Q){Q===null?X.matrix.copy(j.matrixWorld):(X.matrix.copy(Q.matrixWorld),X.matrix.invert(),X.matrix.multiply(j.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(j.projectionMatrix),X.projectionMatrixInverse.copy(j.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Mr*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(X){c=X,d!==null&&(d.fixedFoveation=X),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=X)};let G=null;function q(X,j){if(h=j.getViewerPose(l||a),g=j,h!==null){const Q=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let st=!1;Q.length!==M.cameras.length&&(M.cameras.length=0,st=!0);for(let k=0;k<Q.length;k++){const Y=Q[k];let nt=null;if(f!==null)nt=f.getViewport(Y);else{const ht=u.getViewSubImage(d,Y);nt=ht.viewport,k===0&&(t.setRenderTargetTextures(p,ht.colorTexture,d.ignoreDepthValues?void 0:ht.depthStencilTexture),t.setRenderTarget(p))}let rt=A[k];rt===void 0&&(rt=new Ln,rt.layers.enable(k),rt.viewport=new Ie,A[k]=rt),rt.matrix.fromArray(Y.transform.matrix),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.projectionMatrix.fromArray(Y.projectionMatrix),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert(),rt.viewport.set(nt.x,nt.y,nt.width,nt.height),k===0&&(M.matrix.copy(rt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),st===!0&&M.cameras.push(rt)}}for(let Q=0;Q<v.length;Q++){const st=x[Q],k=v[Q];st!==null&&k!==void 0&&k.update(st,j,l||a)}G&&G(X,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}const Z=new Tu;Z.setAnimationLoop(q),this.setAnimationLoop=function(X){G=X},this.dispose=function(){}}}function W_(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Su(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,v,x,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,v,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===un&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===un&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p).envMap;if(v&&(m.envMap.value=v,m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*x,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,v,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===un&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function X_(i,t,e,n){let s={},r={},a=[];const o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(v,x){const S=x.program;n.uniformBlockBinding(v,S)}function l(v,x){let S=s[v.id];S===void 0&&(g(v),S=h(v),s[v.id]=S,v.addEventListener("dispose",m));const w=x.program;n.updateUBOMapping(v,w);const T=t.render.frame;r[v.id]!==T&&(d(v),r[v.id]=T)}function h(v){const x=u();v.__bindingPointIndex=x;const S=i.createBuffer(),w=v.__size,T=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,w,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,S),S}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const x=s[v.id],S=v.uniforms,w=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let T=0,E=S.length;T<E;T++){const A=Array.isArray(S[T])?S[T]:[S[T]];for(let M=0,y=A.length;M<y;M++){const C=A[M];if(f(C,T,M,w)===!0){const U=C.__offset,H=Array.isArray(C.value)?C.value:[C.value];let P=0;for(let F=0;F<H.length;F++){const B=H[F],N=_(B);typeof B=="number"||typeof B=="boolean"?(C.__data[0]=B,i.bufferSubData(i.UNIFORM_BUFFER,U+P,C.__data)):B.isMatrix3?(C.__data[0]=B.elements[0],C.__data[1]=B.elements[1],C.__data[2]=B.elements[2],C.__data[3]=0,C.__data[4]=B.elements[3],C.__data[5]=B.elements[4],C.__data[6]=B.elements[5],C.__data[7]=0,C.__data[8]=B.elements[6],C.__data[9]=B.elements[7],C.__data[10]=B.elements[8],C.__data[11]=0):(B.toArray(C.__data,P),P+=N.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,x,S,w){const T=v.value,E=x+"_"+S;if(w[E]===void 0)return typeof T=="number"||typeof T=="boolean"?w[E]=T:w[E]=T.clone(),!0;{const A=w[E];if(typeof T=="number"||typeof T=="boolean"){if(A!==T)return w[E]=T,!0}else if(A.equals(T)===!1)return A.copy(T),!0}return!1}function g(v){const x=v.uniforms;let S=0;const w=16;for(let E=0,A=x.length;E<A;E++){const M=Array.isArray(x[E])?x[E]:[x[E]];for(let y=0,C=M.length;y<C;y++){const U=M[y],H=Array.isArray(U.value)?U.value:[U.value];for(let P=0,F=H.length;P<F;P++){const B=H[P],N=_(B),z=S%w;z!==0&&w-z<N.boundary&&(S+=w-z),U.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=S,S+=N.storage}}}const T=S%w;return T>0&&(S+=w-T),v.__size=S,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const S=a.indexOf(x.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(const v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}class q_{constructor(t={}){const{canvas:e=Vf(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=a;const f=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Oe,this._useLegacyLights=!1,this.toneMapping=Mi,this.toneMappingExposure=1;const x=this;let S=!1,w=0,T=0,E=null,A=-1,M=null;const y=new Ie,C=new Ie;let U=null;const H=new Xt(0);let P=0,F=e.width,B=e.height,N=1,z=null,D=null;const G=new Ie(0,0,F,B),q=new Ie(0,0,F,B);let Z=!1;const X=new Mc;let j=!1,Q=!1,st=null;const k=new qt,Y=new ot,nt=new b,rt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ht(){return E===null?N:1}let V=n;function St(L,$){for(let et=0;et<L.length;et++){const it=L[et],tt=e.getContext(it,$);if(tt!==null)return tt}return null}try{const L={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${pc}`),e.addEventListener("webglcontextlost",lt,!1),e.addEventListener("webglcontextrestored",W,!1),e.addEventListener("webglcontextcreationerror",gt,!1),V===null){const $=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&$.shift(),V=St($,L),V===null)throw St($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&V instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),V.getShaderPrecisionFormat===void 0&&(V.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let ut,_t,pt,Ct,Lt,I,R,J,dt,ct,ft,Rt,bt,At,Nt,Yt,at,oe,Kt,kt,Dt,Et,O,mt;function Pt(){ut=new eg(V),_t=new $m(V,ut,t),ut.init(_t),Et=new k_(V,ut,_t),pt=new B_(V,ut,_t),Ct=new sg(V),Lt=new E_,I=new z_(V,ut,pt,Lt,_t,Et,Ct),R=new Zm(x),J=new tg(x),dt=new dp(V,_t),O=new Ym(V,ut,dt,_t),ct=new ng(V,dt,Ct,O),ft=new cg(V,ct,dt,Ct),Kt=new ag(V,_t,I),Yt=new Km(Lt),Rt=new S_(x,R,J,ut,_t,O,Yt),bt=new W_(x,Lt),At=new T_,Nt=new I_(ut,_t),oe=new qm(x,R,J,pt,ft,d,c),at=new O_(x,ft,_t),mt=new X_(V,Ct,_t,pt),kt=new jm(V,ut,Ct,_t),Dt=new ig(V,ut,Ct,_t),Ct.programs=Rt.programs,x.capabilities=_t,x.extensions=ut,x.properties=Lt,x.renderLists=At,x.shadowMap=at,x.state=pt,x.info=Ct}Pt();const Tt=new G_(x,V);this.xr=Tt,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const L=ut.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=ut.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(L){L!==void 0&&(N=L,this.setSize(F,B,!1))},this.getSize=function(L){return L.set(F,B)},this.setSize=function(L,$,et=!0){if(Tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=L,B=$,e.width=Math.floor(L*N),e.height=Math.floor($*N),et===!0&&(e.style.width=L+"px",e.style.height=$+"px"),this.setViewport(0,0,L,$)},this.getDrawingBufferSize=function(L){return L.set(F*N,B*N).floor()},this.setDrawingBufferSize=function(L,$,et){F=L,B=$,N=et,e.width=Math.floor(L*et),e.height=Math.floor($*et),this.setViewport(0,0,L,$)},this.getCurrentViewport=function(L){return L.copy(y)},this.getViewport=function(L){return L.copy(G)},this.setViewport=function(L,$,et,it){L.isVector4?G.set(L.x,L.y,L.z,L.w):G.set(L,$,et,it),pt.viewport(y.copy(G).multiplyScalar(N).floor())},this.getScissor=function(L){return L.copy(q)},this.setScissor=function(L,$,et,it){L.isVector4?q.set(L.x,L.y,L.z,L.w):q.set(L,$,et,it),pt.scissor(C.copy(q).multiplyScalar(N).floor())},this.getScissorTest=function(){return Z},this.setScissorTest=function(L){pt.setScissorTest(Z=L)},this.setOpaqueSort=function(L){z=L},this.setTransparentSort=function(L){D=L},this.getClearColor=function(L){return L.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor.apply(oe,arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha.apply(oe,arguments)},this.clear=function(L=!0,$=!0,et=!0){let it=0;if(L){let tt=!1;if(E!==null){const wt=E.texture.format;tt=wt===hu||wt===lu||wt===cu}if(tt){const wt=E.texture.type,It=wt===yi||wt===gi||wt===mc||wt===Gi||wt===ou||wt===au,zt=oe.getClearColor(),Vt=oe.getClearAlpha(),Zt=zt.r,Wt=zt.g,jt=zt.b;It?(f[0]=Zt,f[1]=Wt,f[2]=jt,f[3]=Vt,V.clearBufferuiv(V.COLOR,0,f)):(g[0]=Zt,g[1]=Wt,g[2]=jt,g[3]=Vt,V.clearBufferiv(V.COLOR,0,g))}else it|=V.COLOR_BUFFER_BIT}$&&(it|=V.DEPTH_BUFFER_BIT),et&&(it|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(it)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",lt,!1),e.removeEventListener("webglcontextrestored",W,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),At.dispose(),Nt.dispose(),Lt.dispose(),R.dispose(),J.dispose(),ft.dispose(),O.dispose(),mt.dispose(),Rt.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",Re),Tt.removeEventListener("sessionend",se),st&&(st.dispose(),st=null),De.stop()};function lt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function W(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const L=Ct.autoReset,$=at.enabled,et=at.autoUpdate,it=at.needsUpdate,tt=at.type;Pt(),Ct.autoReset=L,at.enabled=$,at.autoUpdate=et,at.needsUpdate=it,at.type=tt}function gt(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function Mt(L){const $=L.target;$.removeEventListener("dispose",Mt),Bt($)}function Bt(L){Ut(L),Lt.remove(L)}function Ut(L){const $=Lt.get(L).programs;$!==void 0&&($.forEach(function(et){Rt.releaseProgram(et)}),L.isShaderMaterial&&Rt.releaseShaderCache(L))}this.renderBufferDirect=function(L,$,et,it,tt,wt){$===null&&($=rt);const It=tt.isMesh&&tt.matrixWorld.determinant()<0,zt=vd(L,$,et,it,tt);pt.setMaterial(it,It);let Vt=et.index,Zt=1;if(it.wireframe===!0){if(Vt=ct.getWireframeAttribute(et),Vt===void 0)return;Zt=2}const Wt=et.drawRange,jt=et.attributes.position;let Ce=Wt.start*Zt,mn=(Wt.start+Wt.count)*Zt;wt!==null&&(Ce=Math.max(Ce,wt.start*Zt),mn=Math.min(mn,(wt.start+wt.count)*Zt)),Vt!==null?(Ce=Math.max(Ce,0),mn=Math.min(mn,Vt.count)):jt!=null&&(Ce=Math.max(Ce,0),mn=Math.min(mn,jt.count));const He=mn-Ce;if(He<0||He===1/0)return;O.setup(tt,it,zt,et,Vt);let Wn,ye=kt;if(Vt!==null&&(Wn=dt.get(Vt),ye=Dt,ye.setIndex(Wn)),tt.isMesh)it.wireframe===!0?(pt.setLineWidth(it.wireframeLinewidth*ht()),ye.setMode(V.LINES)):ye.setMode(V.TRIANGLES);else if(tt.isLine){let Qt=it.linewidth;Qt===void 0&&(Qt=1),pt.setLineWidth(Qt*ht()),tt.isLineSegments?ye.setMode(V.LINES):tt.isLineLoop?ye.setMode(V.LINE_LOOP):ye.setMode(V.LINE_STRIP)}else tt.isPoints?ye.setMode(V.POINTS):tt.isSprite&&ye.setMode(V.TRIANGLES);if(tt.isBatchedMesh)ye.renderMultiDraw(tt._multiDrawStarts,tt._multiDrawCounts,tt._multiDrawCount);else if(tt.isInstancedMesh)ye.renderInstances(Ce,He,tt.count);else if(et.isInstancedBufferGeometry){const Qt=et._maxInstanceCount!==void 0?et._maxInstanceCount:1/0,zo=Math.min(et.instanceCount,Qt);ye.renderInstances(Ce,He,zo)}else ye.render(Ce,He)};function ee(L,$,et){L.transparent===!0&&L.side===Mn&&L.forceSinglePass===!1?(L.side=un,L.needsUpdate=!0,Ar(L,$,et),L.side=bi,L.needsUpdate=!0,Ar(L,$,et),L.side=Mn):Ar(L,$,et)}this.compile=function(L,$,et=null){et===null&&(et=L),m=Nt.get(et),m.init(),v.push(m),et.traverseVisible(function(tt){tt.isLight&&tt.layers.test($.layers)&&(m.pushLight(tt),tt.castShadow&&m.pushShadow(tt))}),L!==et&&L.traverseVisible(function(tt){tt.isLight&&tt.layers.test($.layers)&&(m.pushLight(tt),tt.castShadow&&m.pushShadow(tt))}),m.setupLights(x._useLegacyLights);const it=new Set;return L.traverse(function(tt){const wt=tt.material;if(wt)if(Array.isArray(wt))for(let It=0;It<wt.length;It++){const zt=wt[It];ee(zt,et,tt),it.add(zt)}else ee(wt,et,tt),it.add(wt)}),v.pop(),m=null,it},this.compileAsync=function(L,$,et=null){const it=this.compile(L,$,et);return new Promise(tt=>{function wt(){if(it.forEach(function(It){Lt.get(It).currentProgram.isReady()&&it.delete(It)}),it.size===0){tt(L);return}setTimeout(wt,10)}ut.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let ne=null;function Ee(L){ne&&ne(L)}function Re(){De.stop()}function se(){De.start()}const De=new Tu;De.setAnimationLoop(Ee),typeof self<"u"&&De.setContext(self),this.setAnimationLoop=function(L){ne=L,Tt.setAnimationLoop(L),L===null?De.stop():De.start()},Tt.addEventListener("sessionstart",Re),Tt.addEventListener("sessionend",se),this.render=function(L,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera($),$=Tt.getCamera()),L.isScene===!0&&L.onBeforeRender(x,L,$,E),m=Nt.get(L,v.length),m.init(),v.push(m),k.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),X.setFromProjectionMatrix(k),Q=this.localClippingEnabled,j=Yt.init(this.clippingPlanes,Q),_=At.get(L,p.length),_.init(),p.push(_),Nn(L,$,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(z,D),this.info.render.frame++,j===!0&&Yt.beginShadows();const et=m.state.shadowsArray;if(at.render(et,L,$),j===!0&&Yt.endShadows(),this.info.autoReset===!0&&this.info.reset(),oe.render(_,L),m.setupLights(x._useLegacyLights),$.isArrayCamera){const it=$.cameras;for(let tt=0,wt=it.length;tt<wt;tt++){const It=it[tt];kc(_,L,It,It.viewport)}}else kc(_,L,$);E!==null&&(I.updateMultisampleRenderTarget(E),I.updateRenderTargetMipmap(E)),L.isScene===!0&&L.onAfterRender(x,L,$),O.resetDefaultState(),A=-1,M=null,v.pop(),v.length>0?m=v[v.length-1]:m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function Nn(L,$,et,it){if(L.visible===!1)return;if(L.layers.test($.layers)){if(L.isGroup)et=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update($);else if(L.isLight)m.pushLight(L),L.castShadow&&m.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||X.intersectsSprite(L)){it&&nt.setFromMatrixPosition(L.matrixWorld).applyMatrix4(k);const It=ft.update(L),zt=L.material;zt.visible&&_.push(L,It,zt,et,nt.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||X.intersectsObject(L))){const It=ft.update(L),zt=L.material;if(it&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),nt.copy(L.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),nt.copy(It.boundingSphere.center)),nt.applyMatrix4(L.matrixWorld).applyMatrix4(k)),Array.isArray(zt)){const Vt=It.groups;for(let Zt=0,Wt=Vt.length;Zt<Wt;Zt++){const jt=Vt[Zt],Ce=zt[jt.materialIndex];Ce&&Ce.visible&&_.push(L,It,Ce,et,nt.z,jt)}}else zt.visible&&_.push(L,It,zt,et,nt.z,null)}}const wt=L.children;for(let It=0,zt=wt.length;It<zt;It++)Nn(wt[It],$,et,it)}function kc(L,$,et,it){const tt=L.opaque,wt=L.transmissive,It=L.transparent;m.setupLightsView(et),j===!0&&Yt.setGlobalState(x.clippingPlanes,et),wt.length>0&&xd(tt,wt,$,et),it&&pt.viewport(y.copy(it)),tt.length>0&&Tr(tt,$,et),wt.length>0&&Tr(wt,$,et),It.length>0&&Tr(It,$,et),pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function xd(L,$,et,it){if((et.isScene===!0?et.overrideMaterial:null)!==null)return;const wt=_t.isWebGL2;st===null&&(st=new Yi(1,1,{generateMipmaps:!0,type:ut.has("EXT_color_buffer_half_float")?xr:yi,minFilter:_r,samples:wt?4:0})),x.getDrawingBufferSize(Y),wt?st.setSize(Y.x,Y.y):st.setSize(Ro(Y.x),Ro(Y.y));const It=x.getRenderTarget();x.setRenderTarget(st),x.getClearColor(H),P=x.getClearAlpha(),P<1&&x.setClearColor(16777215,.5),x.clear();const zt=x.toneMapping;x.toneMapping=Mi,Tr(L,et,it),I.updateMultisampleRenderTarget(st),I.updateRenderTargetMipmap(st);let Vt=!1;for(let Zt=0,Wt=$.length;Zt<Wt;Zt++){const jt=$[Zt],Ce=jt.object,mn=jt.geometry,He=jt.material,Wn=jt.group;if(He.side===Mn&&Ce.layers.test(it.layers)){const ye=He.side;He.side=un,He.needsUpdate=!0,Vc(Ce,et,it,mn,He,Wn),He.side=ye,He.needsUpdate=!0,Vt=!0}}Vt===!0&&(I.updateMultisampleRenderTarget(st),I.updateRenderTargetMipmap(st)),x.setRenderTarget(It),x.setClearColor(H,P),x.toneMapping=zt}function Tr(L,$,et){const it=$.isScene===!0?$.overrideMaterial:null;for(let tt=0,wt=L.length;tt<wt;tt++){const It=L[tt],zt=It.object,Vt=It.geometry,Zt=it===null?It.material:it,Wt=It.group;zt.layers.test(et.layers)&&Vc(zt,$,et,Vt,Zt,Wt)}}function Vc(L,$,et,it,tt,wt){L.onBeforeRender(x,$,et,it,tt,wt),L.modelViewMatrix.multiplyMatrices(et.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),tt.onBeforeRender(x,$,et,it,L,wt),tt.transparent===!0&&tt.side===Mn&&tt.forceSinglePass===!1?(tt.side=un,tt.needsUpdate=!0,x.renderBufferDirect(et,$,it,tt,L,wt),tt.side=bi,tt.needsUpdate=!0,x.renderBufferDirect(et,$,it,tt,L,wt),tt.side=Mn):x.renderBufferDirect(et,$,it,tt,L,wt),L.onAfterRender(x,$,et,it,tt,wt)}function Ar(L,$,et){$.isScene!==!0&&($=rt);const it=Lt.get(L),tt=m.state.lights,wt=m.state.shadowsArray,It=tt.state.version,zt=Rt.getParameters(L,tt.state,wt,$,et),Vt=Rt.getProgramCacheKey(zt);let Zt=it.programs;it.environment=L.isMeshStandardMaterial?$.environment:null,it.fog=$.fog,it.envMap=(L.isMeshStandardMaterial?J:R).get(L.envMap||it.environment),Zt===void 0&&(L.addEventListener("dispose",Mt),Zt=new Map,it.programs=Zt);let Wt=Zt.get(Vt);if(Wt!==void 0){if(it.currentProgram===Wt&&it.lightsStateVersion===It)return Gc(L,zt),Wt}else zt.uniforms=Rt.getUniforms(L),L.onBuild(et,zt,x),L.onBeforeCompile(zt,x),Wt=Rt.acquireProgram(zt,Vt),Zt.set(Vt,Wt),it.uniforms=zt.uniforms;const jt=it.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(jt.clippingPlanes=Yt.uniform),Gc(L,zt),it.needsLights=yd(L),it.lightsStateVersion=It,it.needsLights&&(jt.ambientLightColor.value=tt.state.ambient,jt.lightProbe.value=tt.state.probe,jt.directionalLights.value=tt.state.directional,jt.directionalLightShadows.value=tt.state.directionalShadow,jt.spotLights.value=tt.state.spot,jt.spotLightShadows.value=tt.state.spotShadow,jt.rectAreaLights.value=tt.state.rectArea,jt.ltc_1.value=tt.state.rectAreaLTC1,jt.ltc_2.value=tt.state.rectAreaLTC2,jt.pointLights.value=tt.state.point,jt.pointLightShadows.value=tt.state.pointShadow,jt.hemisphereLights.value=tt.state.hemi,jt.directionalShadowMap.value=tt.state.directionalShadowMap,jt.directionalShadowMatrix.value=tt.state.directionalShadowMatrix,jt.spotShadowMap.value=tt.state.spotShadowMap,jt.spotLightMatrix.value=tt.state.spotLightMatrix,jt.spotLightMap.value=tt.state.spotLightMap,jt.pointShadowMap.value=tt.state.pointShadowMap,jt.pointShadowMatrix.value=tt.state.pointShadowMatrix),it.currentProgram=Wt,it.uniformsList=null,Wt}function Hc(L){if(L.uniformsList===null){const $=L.currentProgram.getUniforms();L.uniformsList=go.seqWithValue($.seq,L.uniforms)}return L.uniformsList}function Gc(L,$){const et=Lt.get(L);et.outputColorSpace=$.outputColorSpace,et.batching=$.batching,et.instancing=$.instancing,et.instancingColor=$.instancingColor,et.skinning=$.skinning,et.morphTargets=$.morphTargets,et.morphNormals=$.morphNormals,et.morphColors=$.morphColors,et.morphTargetsCount=$.morphTargetsCount,et.numClippingPlanes=$.numClippingPlanes,et.numIntersection=$.numClipIntersection,et.vertexAlphas=$.vertexAlphas,et.vertexTangents=$.vertexTangents,et.toneMapping=$.toneMapping}function vd(L,$,et,it,tt){$.isScene!==!0&&($=rt),I.resetTextureUnits();const wt=$.fog,It=it.isMeshStandardMaterial?$.environment:null,zt=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:ei,Vt=(it.isMeshStandardMaterial?J:R).get(it.envMap||It),Zt=it.vertexColors===!0&&!!et.attributes.color&&et.attributes.color.itemSize===4,Wt=!!et.attributes.tangent&&(!!it.normalMap||it.anisotropy>0),jt=!!et.morphAttributes.position,Ce=!!et.morphAttributes.normal,mn=!!et.morphAttributes.color;let He=Mi;it.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(He=x.toneMapping);const Wn=et.morphAttributes.position||et.morphAttributes.normal||et.morphAttributes.color,ye=Wn!==void 0?Wn.length:0,Qt=Lt.get(it),zo=m.state.lights;if(j===!0&&(Q===!0||L!==M)){const yn=L===M&&it.id===A;Yt.setState(it,L,yn)}let we=!1;it.version===Qt.__version?(Qt.needsLights&&Qt.lightsStateVersion!==zo.state.version||Qt.outputColorSpace!==zt||tt.isBatchedMesh&&Qt.batching===!1||!tt.isBatchedMesh&&Qt.batching===!0||tt.isInstancedMesh&&Qt.instancing===!1||!tt.isInstancedMesh&&Qt.instancing===!0||tt.isSkinnedMesh&&Qt.skinning===!1||!tt.isSkinnedMesh&&Qt.skinning===!0||tt.isInstancedMesh&&Qt.instancingColor===!0&&tt.instanceColor===null||tt.isInstancedMesh&&Qt.instancingColor===!1&&tt.instanceColor!==null||Qt.envMap!==Vt||it.fog===!0&&Qt.fog!==wt||Qt.numClippingPlanes!==void 0&&(Qt.numClippingPlanes!==Yt.numPlanes||Qt.numIntersection!==Yt.numIntersection)||Qt.vertexAlphas!==Zt||Qt.vertexTangents!==Wt||Qt.morphTargets!==jt||Qt.morphNormals!==Ce||Qt.morphColors!==mn||Qt.toneMapping!==He||_t.isWebGL2===!0&&Qt.morphTargetsCount!==ye)&&(we=!0):(we=!0,Qt.__version=it.version);let Ci=Qt.currentProgram;we===!0&&(Ci=Ar(it,$,tt));let Wc=!1,Qs=!1,ko=!1;const Xe=Ci.getUniforms(),Pi=Qt.uniforms;if(pt.useProgram(Ci.program)&&(Wc=!0,Qs=!0,ko=!0),it.id!==A&&(A=it.id,Qs=!0),Wc||M!==L){Xe.setValue(V,"projectionMatrix",L.projectionMatrix),Xe.setValue(V,"viewMatrix",L.matrixWorldInverse);const yn=Xe.map.cameraPosition;yn!==void 0&&yn.setValue(V,nt.setFromMatrixPosition(L.matrixWorld)),_t.logarithmicDepthBuffer&&Xe.setValue(V,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(it.isMeshPhongMaterial||it.isMeshToonMaterial||it.isMeshLambertMaterial||it.isMeshBasicMaterial||it.isMeshStandardMaterial||it.isShaderMaterial)&&Xe.setValue(V,"isOrthographic",L.isOrthographicCamera===!0),M!==L&&(M=L,Qs=!0,ko=!0)}if(tt.isSkinnedMesh){Xe.setOptional(V,tt,"bindMatrix"),Xe.setOptional(V,tt,"bindMatrixInverse");const yn=tt.skeleton;yn&&(_t.floatVertexTextures?(yn.boneTexture===null&&yn.computeBoneTexture(),Xe.setValue(V,"boneTexture",yn.boneTexture,I)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}tt.isBatchedMesh&&(Xe.setOptional(V,tt,"batchingTexture"),Xe.setValue(V,"batchingTexture",tt._matricesTexture,I));const Vo=et.morphAttributes;if((Vo.position!==void 0||Vo.normal!==void 0||Vo.color!==void 0&&_t.isWebGL2===!0)&&Kt.update(tt,et,Ci),(Qs||Qt.receiveShadow!==tt.receiveShadow)&&(Qt.receiveShadow=tt.receiveShadow,Xe.setValue(V,"receiveShadow",tt.receiveShadow)),it.isMeshGouraudMaterial&&it.envMap!==null&&(Pi.envMap.value=Vt,Pi.flipEnvMap.value=Vt.isCubeTexture&&Vt.isRenderTargetTexture===!1?-1:1),Qs&&(Xe.setValue(V,"toneMappingExposure",x.toneMappingExposure),Qt.needsLights&&Md(Pi,ko),wt&&it.fog===!0&&bt.refreshFogUniforms(Pi,wt),bt.refreshMaterialUniforms(Pi,it,N,B,st),go.upload(V,Hc(Qt),Pi,I)),it.isShaderMaterial&&it.uniformsNeedUpdate===!0&&(go.upload(V,Hc(Qt),Pi,I),it.uniformsNeedUpdate=!1),it.isSpriteMaterial&&Xe.setValue(V,"center",tt.center),Xe.setValue(V,"modelViewMatrix",tt.modelViewMatrix),Xe.setValue(V,"normalMatrix",tt.normalMatrix),Xe.setValue(V,"modelMatrix",tt.matrixWorld),it.isShaderMaterial||it.isRawShaderMaterial){const yn=it.uniformsGroups;for(let Ho=0,bd=yn.length;Ho<bd;Ho++)if(_t.isWebGL2){const Xc=yn[Ho];mt.update(Xc,Ci),mt.bind(Xc,Ci)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ci}function Md(L,$){L.ambientLightColor.needsUpdate=$,L.lightProbe.needsUpdate=$,L.directionalLights.needsUpdate=$,L.directionalLightShadows.needsUpdate=$,L.pointLights.needsUpdate=$,L.pointLightShadows.needsUpdate=$,L.spotLights.needsUpdate=$,L.spotLightShadows.needsUpdate=$,L.rectAreaLights.needsUpdate=$,L.hemisphereLights.needsUpdate=$}function yd(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(L,$,et){Lt.get(L.texture).__webglTexture=$,Lt.get(L.depthTexture).__webglTexture=et;const it=Lt.get(L);it.__hasExternalTextures=!0,it.__hasExternalTextures&&(it.__autoAllocateDepthBuffer=et===void 0,it.__autoAllocateDepthBuffer||ut.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),it.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(L,$){const et=Lt.get(L);et.__webglFramebuffer=$,et.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(L,$=0,et=0){E=L,w=$,T=et;let it=!0,tt=null,wt=!1,It=!1;if(L){const Vt=Lt.get(L);Vt.__useDefaultFramebuffer!==void 0?(pt.bindFramebuffer(V.FRAMEBUFFER,null),it=!1):Vt.__webglFramebuffer===void 0?I.setupRenderTarget(L):Vt.__hasExternalTextures&&I.rebindTextures(L,Lt.get(L.texture).__webglTexture,Lt.get(L.depthTexture).__webglTexture);const Zt=L.texture;(Zt.isData3DTexture||Zt.isDataArrayTexture||Zt.isCompressedArrayTexture)&&(It=!0);const Wt=Lt.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(Wt[$])?tt=Wt[$][et]:tt=Wt[$],wt=!0):_t.isWebGL2&&L.samples>0&&I.useMultisampledRTT(L)===!1?tt=Lt.get(L).__webglMultisampledFramebuffer:Array.isArray(Wt)?tt=Wt[et]:tt=Wt,y.copy(L.viewport),C.copy(L.scissor),U=L.scissorTest}else y.copy(G).multiplyScalar(N).floor(),C.copy(q).multiplyScalar(N).floor(),U=Z;if(pt.bindFramebuffer(V.FRAMEBUFFER,tt)&&_t.drawBuffers&&it&&pt.drawBuffers(L,tt),pt.viewport(y),pt.scissor(C),pt.setScissorTest(U),wt){const Vt=Lt.get(L.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+$,Vt.__webglTexture,et)}else if(It){const Vt=Lt.get(L.texture),Zt=$||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,Vt.__webglTexture,et||0,Zt)}A=-1},this.readRenderTargetPixels=function(L,$,et,it,tt,wt,It){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let zt=Lt.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&It!==void 0&&(zt=zt[It]),zt){pt.bindFramebuffer(V.FRAMEBUFFER,zt);try{const Vt=L.texture,Zt=Vt.format,Wt=Vt.type;if(Zt!==wn&&Et.convert(Zt)!==V.getParameter(V.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const jt=Wt===xr&&(ut.has("EXT_color_buffer_half_float")||_t.isWebGL2&&ut.has("EXT_color_buffer_float"));if(Wt!==yi&&Et.convert(Wt)!==V.getParameter(V.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Wt===Jn&&(_t.isWebGL2||ut.has("OES_texture_float")||ut.has("WEBGL_color_buffer_float")))&&!jt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=L.width-it&&et>=0&&et<=L.height-tt&&V.readPixels($,et,it,tt,Et.convert(Zt),Et.convert(Wt),wt)}finally{const Vt=E!==null?Lt.get(E).__webglFramebuffer:null;pt.bindFramebuffer(V.FRAMEBUFFER,Vt)}}},this.copyFramebufferToTexture=function(L,$,et=0){const it=Math.pow(2,-et),tt=Math.floor($.image.width*it),wt=Math.floor($.image.height*it);I.setTexture2D($,0),V.copyTexSubImage2D(V.TEXTURE_2D,et,0,0,L.x,L.y,tt,wt),pt.unbindTexture()},this.copyTextureToTexture=function(L,$,et,it=0){const tt=$.image.width,wt=$.image.height,It=Et.convert(et.format),zt=Et.convert(et.type);I.setTexture2D(et,0),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,et.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,et.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,et.unpackAlignment),$.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,it,L.x,L.y,tt,wt,It,zt,$.image.data):$.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,it,L.x,L.y,$.mipmaps[0].width,$.mipmaps[0].height,It,$.mipmaps[0].data):V.texSubImage2D(V.TEXTURE_2D,it,L.x,L.y,It,zt,$.image),it===0&&et.generateMipmaps&&V.generateMipmap(V.TEXTURE_2D),pt.unbindTexture()},this.copyTextureToTexture3D=function(L,$,et,it,tt=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const wt=L.max.x-L.min.x+1,It=L.max.y-L.min.y+1,zt=L.max.z-L.min.z+1,Vt=Et.convert(it.format),Zt=Et.convert(it.type);let Wt;if(it.isData3DTexture)I.setTexture3D(it,0),Wt=V.TEXTURE_3D;else if(it.isDataArrayTexture||it.isCompressedArrayTexture)I.setTexture2DArray(it,0),Wt=V.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,it.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,it.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,it.unpackAlignment);const jt=V.getParameter(V.UNPACK_ROW_LENGTH),Ce=V.getParameter(V.UNPACK_IMAGE_HEIGHT),mn=V.getParameter(V.UNPACK_SKIP_PIXELS),He=V.getParameter(V.UNPACK_SKIP_ROWS),Wn=V.getParameter(V.UNPACK_SKIP_IMAGES),ye=et.isCompressedTexture?et.mipmaps[tt]:et.image;V.pixelStorei(V.UNPACK_ROW_LENGTH,ye.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ye.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,L.min.x),V.pixelStorei(V.UNPACK_SKIP_ROWS,L.min.y),V.pixelStorei(V.UNPACK_SKIP_IMAGES,L.min.z),et.isDataTexture||et.isData3DTexture?V.texSubImage3D(Wt,tt,$.x,$.y,$.z,wt,It,zt,Vt,Zt,ye.data):et.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),V.compressedTexSubImage3D(Wt,tt,$.x,$.y,$.z,wt,It,zt,Vt,ye.data)):V.texSubImage3D(Wt,tt,$.x,$.y,$.z,wt,It,zt,Vt,Zt,ye),V.pixelStorei(V.UNPACK_ROW_LENGTH,jt),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Ce),V.pixelStorei(V.UNPACK_SKIP_PIXELS,mn),V.pixelStorei(V.UNPACK_SKIP_ROWS,He),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Wn),tt===0&&it.generateMipmaps&&V.generateMipmap(Wt),pt.unbindTexture()},this.initTexture=function(L){L.isCubeTexture?I.setTextureCube(L,0):L.isData3DTexture?I.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?I.setTexture2DArray(L,0):I.setTexture2D(L,0),pt.unbindTexture()},this.resetState=function(){w=0,T=0,E=null,pt.reset(),O.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===_c?"display-p3":"srgb",e.unpackColorSpace=he.workingColorSpace===No?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Oe?Xi:du}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Xi?Oe:ei}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Y_ extends q_{}Y_.prototype.isWebGL1Renderer=!0;class Uu{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Xt(t),this.density=e}clone(){return new Uu(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Nu{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Xt(t),this.near=e,this.far=n}clone(){return new Nu(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Fv extends Ae{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class j_{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=nc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Un()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Un()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ke=new b;class Po{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}setX(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=le(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Bn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Bn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Bn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Bn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=le(e,this.array),n=le(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=le(e,this.array),n=le(n,this.array),s=le(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=le(e,this.array),n=le(n,this.array),s=le(s,this.array),r=le(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new re(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Po(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class $_ extends Ri{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Xt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let _s;const sr=new b,xs=new b,vs=new b,Ms=new ot,rr=new ot,Fu=new qt,Kr=new b,or=new b,Zr=new b,uh=new ot,va=new ot,dh=new ot;class Ov extends Ae{constructor(t=new $_){if(super(),this.isSprite=!0,this.type="Sprite",_s===void 0){_s=new de;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new j_(e,5);_s.setIndex([0,1,2,0,2,3]),_s.setAttribute("position",new Po(n,3,0,!1)),_s.setAttribute("uv",new Po(n,2,3,!1))}this.geometry=_s,this.material=t,this.center=new ot(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),xs.setFromMatrixScale(this.matrixWorld),Fu.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),vs.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&xs.multiplyScalar(-vs.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const a=this.center;Jr(Kr.set(-.5,-.5,0),vs,a,xs,s,r),Jr(or.set(.5,-.5,0),vs,a,xs,s,r),Jr(Zr.set(.5,.5,0),vs,a,xs,s,r),uh.set(0,0),va.set(1,0),dh.set(1,1);let o=t.ray.intersectTriangle(Kr,or,Zr,!1,sr);if(o===null&&(Jr(or.set(-.5,.5,0),vs,a,xs,s,r),va.set(0,1),o=t.ray.intersectTriangle(Kr,Zr,or,!1,sr),o===null))return;const c=t.ray.origin.distanceTo(sr);c<t.near||c>t.far||e.push({distance:c,point:sr.clone(),uv:En.getInterpolation(sr,Kr,or,Zr,uh,va,dh,new ot),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Jr(i,t,e,n,s,r){Ms.subVectors(i,e).addScalar(.5).multiply(n),s!==void 0?(rr.x=r*Ms.x-s*Ms.y,rr.y=s*Ms.x+r*Ms.y):rr.copy(Ms),i.copy(t),i.x+=rr.x,i.y+=rr.y,i.applyMatrix4(Fu)}const fh=new b,ph=new Ie,mh=new Ie,K_=new b,gh=new qt,Qr=new b,Ma=new ii,_h=new qt,ya=new Sr;class Z_ extends je{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Jc,this.bindMatrix=new qt,this.bindMatrixInverse=new qt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ai),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Qr),this.boundingBox.expandByPoint(Qr)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ii),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Qr),this.boundingSphere.expandByPoint(Qr)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ma.copy(this.boundingSphere),Ma.applyMatrix4(s),t.ray.intersectsSphere(Ma)!==!1&&(_h.copy(s).invert(),ya.copy(t.ray).applyMatrix4(_h),!(this.boundingBox!==null&&ya.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,ya)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new Ie,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);const r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Jc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===sf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const n=this.skeleton,s=this.geometry;ph.fromBufferAttribute(s.attributes.skinIndex,t),mh.fromBufferAttribute(s.attributes.skinWeight,t),fh.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){const a=mh.getComponent(r);if(a!==0){const o=ph.getComponent(r);gh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(K_.copy(fh).applyMatrix4(gh),a)}}return e.applyMatrix4(this.bindMatrixInverse)}boneTransform(t,e){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(t,e)}}class Ou extends Ae{constructor(){super(),this.isBone=!0,this.type="Bone"}}class J_ extends en{constructor(t=null,e=1,n=1,s,r,a,o,c,l=We,h=We,u,d){super(null,a,o,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const xh=new qt,Q_=new qt;class Sc{constructor(t=[],e=[]){this.uuid=Un(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new qt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const n=new qt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,a=t.length;r<a;r++){const o=t[r]?t[r].matrixWorld:Q_;xh.multiplyMatrices(o,e[r]),xh.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Sc(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const n=new J_(e,t,t,wn,Jn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){const s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){const r=t.bones[n];let a=e[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new Ou),this.bones.push(a),this.boneInverses.push(new qt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){const t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){const a=e[s];t.bones.push(a.uuid);const o=n[s];t.boneInverses.push(o.toArray())}return t}}class vh extends re{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ys=new qt,Mh=new qt,to=[],yh=new Ai,tx=new qt,ar=new je,cr=new ii;class ex extends je{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new vh(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,tx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ai),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ys),yh.copy(t.boundingBox).applyMatrix4(ys),this.boundingBox.union(yh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ii),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ys),cr.copy(t.boundingSphere).applyMatrix4(ys),this.boundingSphere.union(cr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ar.geometry=this.geometry,ar.material=this.material,ar.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),cr.copy(this.boundingSphere),cr.applyMatrix4(n),t.ray.intersectsSphere(cr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ys),Mh.multiplyMatrices(n,ys),ar.matrixWorld=Mh,ar.raycast(t,to);for(let a=0,o=to.length;a<o;a++){const c=to[a];c.instanceId=r,c.object=this,e.push(c)}to.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new vh(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Er extends Ri{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const bh=new b,Sh=new b,Eh=new qt,ba=new Sr,eo=new ii;class Bu extends Ae{constructor(t=new de,e=new Er){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)bh.fromBufferAttribute(e,s-1),Sh.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=bh.distanceTo(Sh);t.setAttribute("lineDistance",new Jt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(s),eo.radius+=r,t.ray.intersectsSphere(eo)===!1)return;Eh.copy(s).invert(),ba.copy(t.ray).applyMatrix4(Eh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=new b,h=new b,u=new b,d=new b,f=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){const p=Math.max(0,a.start),v=Math.min(g.count,a.start+a.count);for(let x=p,S=v-1;x<S;x+=f){const w=g.getX(x),T=g.getX(x+1);if(l.fromBufferAttribute(m,w),h.fromBufferAttribute(m,T),ba.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const A=t.ray.origin.distanceTo(d);A<t.near||A>t.far||e.push({distance:A,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{const p=Math.max(0,a.start),v=Math.min(m.count,a.start+a.count);for(let x=p,S=v-1;x<S;x+=f){if(l.fromBufferAttribute(m,x),h.fromBufferAttribute(m,x+1),ba.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const T=t.ray.origin.distanceTo(d);T<t.near||T>t.far||e.push({distance:T,point:u.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}const wh=new b,Th=new b;class Ec extends Bu{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)wh.fromBufferAttribute(e,s),Th.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+wh.distanceTo(Th);t.setAttribute("lineDistance",new Jt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class nx extends Ri{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ah=new qt,ac=new Sr,no=new ii,io=new b;class Bv extends Ae{constructor(t=new de,e=new nx){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),no.copy(n.boundingSphere),no.applyMatrix4(s),no.radius+=r,t.ray.intersectsSphere(no)===!1)return;Ah.copy(s).invert(),ac.copy(t.ray).applyMatrix4(Ah);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=d,_=f;g<_;g++){const m=l.getX(g);io.fromBufferAttribute(u,m),Rh(io,m,c,s,t,e,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,_=f;g<_;g++)io.fromBufferAttribute(u,g),Rh(io,g,c,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Rh(i,t,e,n,s,r,a){const o=ac.distanceSqToPoint(i);if(o<e){const c=new b;ac.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:t,face:null,object:a})}}class zu extends en{constructor(t,e,n,s,r,a,o,c,l){super(t,e,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ix{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new ot:new b);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new b,s=[],r=[],a=[],o=new b,c=new qt;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new b)}r[0]=new b,a[0]=new b;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Be(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,g))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Be(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}function wc(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const so=new b,Sa=new wc,Ea=new wc,wa=new wc;class sx extends ix{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new b){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(so.subVectors(s[0],s[1]).add(s[0]),l=so);const u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(so.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=so),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Sa.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),Ea.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),wa.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Sa.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Ea.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),wa.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Sa.calc(c),Ea.calc(c),wa.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new b().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}class Tc extends de{constructor(t=[new ot(0,-.5),new ot(.5,0),new ot(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Be(s,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],h=1/e,u=new b,d=new ot,f=new b,g=new b,_=new b;let m=0,p=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,f.x=p*1,f.y=-m,f.z=p*0,_.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[v+1].x-t[v].x,p=t[v+1].y-t[v].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=_.x,f.y+=_.y,f.z+=_.z,f.normalize(),c.push(f.x,f.y,f.z),_.copy(g)}for(let v=0;v<=e;v++){const x=n+v*h*s,S=Math.sin(x),w=Math.cos(x);for(let T=0;T<=t.length-1;T++){u.x=t[T].x*S,u.y=t[T].y,u.z=t[T].x*w,a.push(u.x,u.y,u.z),d.x=v/e,d.y=T/(t.length-1),o.push(d.x,d.y);const E=c[3*T+0]*S,A=c[3*T+1],M=c[3*T+0]*w;l.push(E,A,M)}}for(let v=0;v<e;v++)for(let x=0;x<t.length-1;x++){const S=x+v*t.length,w=S,T=S+t.length,E=S+t.length+1,A=S+1;r.push(w,T,A),r.push(E,A,T)}this.setIndex(r),this.setAttribute("position",new Jt(a,3)),this.setAttribute("uv",new Jt(o,2)),this.setAttribute("normal",new Jt(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tc(t.points,t.segments,t.phiStart,t.phiLength)}}class Ac extends de{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],c=[],l=new b,h=new ot;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Jt(a,3)),this.setAttribute("normal",new Jt(o,3)),this.setAttribute("uv",new Jt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ac(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class cn extends de{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;v(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Jt(u,3)),this.setAttribute("normal",new Jt(d,3)),this.setAttribute("uv",new Jt(f,2));function v(){const S=new b,w=new b;let T=0;const E=(e-t)/n;for(let A=0;A<=r;A++){const M=[],y=A/r,C=y*(e-t)+t;for(let U=0;U<=s;U++){const H=U/s,P=H*c+o,F=Math.sin(P),B=Math.cos(P);w.x=C*F,w.y=-y*n+m,w.z=C*B,u.push(w.x,w.y,w.z),S.set(F,E,B).normalize(),d.push(S.x,S.y,S.z),f.push(H,1-y),M.push(g++)}_.push(M)}for(let A=0;A<s;A++)for(let M=0;M<r;M++){const y=_[M][A],C=_[M+1][A],U=_[M+1][A+1],H=_[M][A+1];h.push(y,C,H),h.push(C,U,H),T+=6}l.addGroup(p,T,0),p+=T}function x(S){const w=g,T=new ot,E=new b;let A=0;const M=S===!0?t:e,y=S===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),g++;const C=g;for(let U=0;U<=s;U++){const P=U/s*c+o,F=Math.cos(P),B=Math.sin(P);E.x=M*B,E.y=m*y,E.z=M*F,u.push(E.x,E.y,E.z),d.push(0,y,0),T.x=F*.5+.5,T.y=B*.5*y+.5,f.push(T.x,T.y),g++}for(let U=0;U<s;U++){const H=w+U,P=C+U;S===!0?h.push(P,P+1,H):h.push(P+1,P,H),A+=3}l.addGroup(p,A,S===!0?1:2),p+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Gs extends cn{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Gs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Rc extends de{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new Jt(r,3)),this.setAttribute("normal",new Jt(r.slice(),3)),this.setAttribute("uv",new Jt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const x=new b,S=new b,w=new b;for(let T=0;T<e.length;T+=3)f(e[T+0],x),f(e[T+1],S),f(e[T+2],w),c(x,S,w,v)}function c(v,x,S,w){const T=w+1,E=[];for(let A=0;A<=T;A++){E[A]=[];const M=v.clone().lerp(S,A/T),y=x.clone().lerp(S,A/T),C=T-A;for(let U=0;U<=C;U++)U===0&&A===T?E[A][U]=M:E[A][U]=M.clone().lerp(y,U/C)}for(let A=0;A<T;A++)for(let M=0;M<2*(T-A)-1;M++){const y=Math.floor(M/2);M%2===0?(d(E[A][y+1]),d(E[A+1][y]),d(E[A][y])):(d(E[A][y+1]),d(E[A+1][y+1]),d(E[A+1][y]))}}function l(v){const x=new b;for(let S=0;S<r.length;S+=3)x.x=r[S+0],x.y=r[S+1],x.z=r[S+2],x.normalize().multiplyScalar(v),r[S+0]=x.x,r[S+1]=x.y,r[S+2]=x.z}function h(){const v=new b;for(let x=0;x<r.length;x+=3){v.x=r[x+0],v.y=r[x+1],v.z=r[x+2];const S=m(v)/2/Math.PI+.5,w=p(v)/Math.PI+.5;a.push(S,1-w)}g(),u()}function u(){for(let v=0;v<a.length;v+=6){const x=a[v+0],S=a[v+2],w=a[v+4],T=Math.max(x,S,w),E=Math.min(x,S,w);T>.9&&E<.1&&(x<.2&&(a[v+0]+=1),S<.2&&(a[v+2]+=1),w<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function f(v,x){const S=v*3;x.x=t[S+0],x.y=t[S+1],x.z=t[S+2]}function g(){const v=new b,x=new b,S=new b,w=new b,T=new ot,E=new ot,A=new ot;for(let M=0,y=0;M<r.length;M+=9,y+=6){v.set(r[M+0],r[M+1],r[M+2]),x.set(r[M+3],r[M+4],r[M+5]),S.set(r[M+6],r[M+7],r[M+8]),T.set(a[y+0],a[y+1]),E.set(a[y+2],a[y+3]),A.set(a[y+4],a[y+5]),w.copy(v).add(x).add(S).divideScalar(3);const C=m(w);_(T,y+0,v,C),_(E,y+2,x,C),_(A,y+4,S,C)}}function _(v,x,S,w){w<0&&v.x===1&&(a[x]=v.x-1),S.x===0&&S.z===0&&(a[x]=w/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rc(t.vertices,t.indices,t.radius,t.details)}}class Cc extends Rc{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Cc(t.radius,t.detail)}}class ku extends de{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);const o=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,f=new b,g=new ot;for(let _=0;_<=s;_++){for(let m=0;m<=n;m++){const p=r+m/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<s;_++){const m=_*(n+1);for(let p=0;p<n;p++){const v=p+m,x=v,S=v+n+1,w=v+n+2,T=v+1;o.push(x,S,T),o.push(S,w,T)}}this.setIndex(o),this.setAttribute("position",new Jt(c,3)),this.setAttribute("normal",new Jt(l,3)),this.setAttribute("uv",new Jt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ku(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ei extends de{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new b,d=new b,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const v=[],x=p/n;let S=0;p===0&&a===0?S=.5/e:p===n&&c===Math.PI&&(S=-.5/e);for(let w=0;w<=e;w++){const T=w/e;u.x=-t*Math.cos(s+T*r)*Math.sin(a+x*o),u.y=t*Math.cos(a+x*o),u.z=t*Math.sin(s+T*r)*Math.sin(a+x*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(T+S,1-x),v.push(l++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const x=h[p][v+1],S=h[p][v],w=h[p+1][v],T=h[p+1][v+1];(p!==0||a>0)&&f.push(x,S,T),(p!==n-1||c<Math.PI)&&f.push(S,w,T)}this.setIndex(f),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(_,3)),this.setAttribute("uv",new Jt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ei(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class wr extends de{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],c=[],l=[],h=new b,u=new b,d=new b;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,v=(s+1)*f+g;a.push(_,m,v),a.push(m,p,v)}this.setIndex(a),this.setAttribute("position",new Jt(o,3)),this.setAttribute("normal",new Jt(c,3)),this.setAttribute("uv",new Jt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wr(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Lo extends Ri{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fu,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}function ro(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function rx(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ox(i){function t(s,r){return i[s]-i[r]}const e=i.length,n=new Array(e);for(let s=0;s!==e;++s)n[s]=s;return n.sort(t),n}function Ch(i,t,e){const n=i.length,s=new i.constructor(n);for(let r=0,a=0;a!==n;++r){const o=e[r]*t;for(let c=0;c!==t;++c)s[a++]=i[o+c]}return s}function Vu(i,t,e,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(t.push(r.time),e.push.apply(e,a)),r=i[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(t.push(r.time),a.toArray(e,e.length)),r=i[s++];while(r!==void 0);else do a=r[n],a!==void 0&&(t.push(r.time),e.push(a)),r=i[s++];while(r!==void 0)}class Oo{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let n=this._cachedIndex,s=e[n],r=e[n-1];t:{e:{let a;n:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break e}a=e.length;break n}if(!(t>=r)){const o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break e}a=n,n=0;break n}break t}for(;n<a;){const o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class ax extends Oo{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Cs,endingEnd:Cs}}intervalChanged_(t,e,n){const s=this.parameterPositions;let r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ps:r=t,o=2*e-n;break;case So:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ps:a=t,c=2*n-e;break;case So:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}const l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,v=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,x=(-1-f)*m+(1.5+f)*_+.5*g,S=f*m-f*_;for(let w=0;w!==o;++w)r[w]=p*a[h+w]+v*a[l+w]+x*a[c+w]+S*a[u+w];return r}}class Hu extends Oo{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,l=c-o,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}}class cx extends Oo{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}}class Gn{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ro(e,this.TimeBufferType),this.values=ro(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ro(t.times,Array),values:ro(t.values,Array)};const s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new cx(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Hu(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ax(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case yo:e=this.InterpolantFactoryMethodDiscrete;break;case bo:e=this.InterpolantFactoryMethodLinear;break;case $o:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return yo;case this.InterpolantFactoryMethodLinear:return bo;case this.InterpolantFactoryMethodSmooth:return $o}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){const n=this.times,s=n.length;let r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);const n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&rx(s))for(let o=0,c=s.length;o!==c;++o){const l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===$o,r=t.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=t[o],h=t[o+1];if(l!==h&&(o!==1||l!==t[0]))if(s)c=!0;else{const u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const _=e[u+g];if(_!==e[d+g]||_!==e[f+g]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)e[c+l]=e[o+l];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}}Gn.prototype.TimeBufferType=Float32Array;Gn.prototype.ValueBufferType=Float32Array;Gn.prototype.DefaultInterpolation=bo;class Ys extends Gn{}Ys.prototype.ValueTypeName="bool";Ys.prototype.ValueBufferType=Array;Ys.prototype.DefaultInterpolation=yo;Ys.prototype.InterpolantFactoryMethodLinear=void 0;Ys.prototype.InterpolantFactoryMethodSmooth=void 0;class Gu extends Gn{}Gu.prototype.ValueTypeName="color";class Io extends Gn{}Io.prototype.ValueTypeName="number";class lx extends Oo{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e);let l=t*o;for(let h=l+o;l!==h;l+=4)ie.slerpFlat(r,0,a,l-o,a,l,c);return r}}class js extends Gn{InterpolantFactoryMethodLinear(t){return new lx(this.times,this.values,this.getValueSize(),t)}}js.prototype.ValueTypeName="quaternion";js.prototype.DefaultInterpolation=bo;js.prototype.InterpolantFactoryMethodSmooth=void 0;class $s extends Gn{}$s.prototype.ValueTypeName="string";$s.prototype.ValueBufferType=Array;$s.prototype.DefaultInterpolation=yo;$s.prototype.InterpolantFactoryMethodLinear=void 0;$s.prototype.InterpolantFactoryMethodSmooth=void 0;class yr extends Gn{}yr.prototype.ValueTypeName="vector";class cc{constructor(t,e=-1,n,s=gc){this.name=t,this.tracks=n,this.duration=e,this.blendMode=s,this.uuid=Un(),this.duration<0&&this.resetDuration()}static parse(t){const e=[],n=t.tracks,s=1/(t.fps||1);for(let a=0,o=n.length;a!==o;++a)e.push(ux(n[a]).scale(s));const r=new this(t.name,t.duration,e,t.blendMode);return r.uuid=t.uuid,r}static toJSON(t){const e=[],n=t.tracks,s={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let r=0,a=n.length;r!==a;++r)e.push(Gn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(t,e,n,s){const r=e.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const h=ox(c);c=Ch(c,1,h),l=Ch(l,1,h),!s&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new Io(".morphTargetInfluences["+e[o].name+"]",c,l).scale(1/n))}return new this(t,-1,a)}static findByName(t,e){let n=t;if(!Array.isArray(t)){const s=t;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===e)return n[s];return null}static CreateClipsFromMorphTargetSequences(t,e,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=t.length;o<c;o++){const l=t[o],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let d=s[u];d||(s[u]=d=[]),d.push(l)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],e,n));return a}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,g,_){if(f.length!==0){const m=[],p=[];Vu(f,m,p,g),m.length!==0&&_.push(new u(d,m,p))}},s=[],r=t.name||"default",a=t.fps||30,o=t.blendMode;let c=t.length||-1;const l=t.hierarchy||[];for(let u=0;u<l.length;u++){const d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)f[d[g].morphTargets[_]]=-1;for(const _ in f){const m=[],p=[];for(let v=0;v!==d[g].morphTargets.length;++v){const x=d[g];m.push(x.time),p.push(x.morphTarget===_?1:0)}s.push(new Io(".morphTargetInfluence["+_+"]",m,p))}c=f.length*a}else{const f=".bones["+e[u].name+"]";n(yr,f+".position",d,"pos",s),n(js,f+".quaternion",d,"rot",s),n(yr,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,c,s,o)}resetDuration(){const t=this.tracks;let e=0;for(let n=0,s=t.length;n!==s;++n){const r=this.tracks[n];e=Math.max(e,r.times[r.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function hx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Io;case"vector":case"vector2":case"vector3":case"vector4":return yr;case"color":return Gu;case"quaternion":return js;case"bool":case"boolean":return Ys;case"string":return $s}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function ux(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=hx(i.type);if(i.times===void 0){const e=[],n=[];Vu(i.keys,e,n,"value"),i.times=e,i.values=n}return t.parse!==void 0?t.parse(i):new t(i.name,i.times,i.values,i.interpolation)}class Wu extends Ae{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class zv extends Wu{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ta=new qt,Ph=new b,Lh=new b;class dx{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.map=null,this.mapPass=null,this.matrix=new qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Mc,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new Ie(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ph.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ph),Lh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Lh),e.updateMatrixWorld(),Ta.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ta),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ta)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class fx extends dx{constructor(){super(new Au(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class kv extends Wu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.shadow=new fx}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Vv{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Ih(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Ih();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Ih(){return(typeof performance>"u"?Date:performance).now()}class px{constructor(t,e,n){this.binding=t,this.valueSize=n;let s,r,a;switch(e){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){const n=this.buffer,s=this.valueSize,r=t*s+s;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)n[r+o]=n[o];a=e}else{a+=e;const o=e/a;this._mixBufferRegion(n,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(t){const e=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,s,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){const e=this.valueSize,n=this.buffer,s=t*e+e,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const c=e*this._origIndex;this._mixBufferRegion(n,s,c,1-r,e)}a>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*e,1,e);for(let c=e,l=e+e;c!==l;++c)if(n[c]!==n[c+e]){o.setValue(n,s);break}}saveOriginalState(){const t=this.binding,e=this.buffer,n=this.valueSize,s=n*this._origIndex;t.getValue(e,s);for(let r=n,a=s;r!==a;++r)e[r]=e[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,s,r){if(s>=.5)for(let a=0;a!==r;++a)t[e+a]=t[n+a]}_slerp(t,e,n,s){ie.slerpFlat(t,e,t,e,t,n,s)}_slerpAdditive(t,e,n,s,r){const a=this._workIndex*r;ie.multiplyQuaternionsFlat(t,a,t,e,t,n),ie.slerpFlat(t,e,t,e,t,a,s)}_lerp(t,e,n,s,r){const a=1-s;for(let o=0;o!==r;++o){const c=e+o;t[c]=t[c]*a+t[n+o]*s}}_lerpAdditive(t,e,n,s,r){for(let a=0;a!==r;++a){const o=e+a;t[o]=t[o]+t[n+a]*s}}}const Pc="\\[\\]\\.:\\/",mx=new RegExp("["+Pc+"]","g"),Lc="[^"+Pc+"]",gx="[^"+Pc.replace("\\.","")+"]",_x=/((?:WC+[\/:])*)/.source.replace("WC",Lc),xx=/(WCOD+)?/.source.replace("WCOD",gx),vx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Lc),Mx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Lc),yx=new RegExp("^"+_x+xx+vx+Mx+"$"),bx=["material","materials","bones","map"];class Sx{constructor(t,e,n){const s=n||ae.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}}class ae{constructor(t,e,n){this.path=e,this.parsedPath=n||ae.parseTrackName(e),this.node=ae.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new ae.Composite(t,e,n):new ae(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(mx,"")}static parseTrackName(t){const e=yx.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);const n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);bx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===e||o.uuid===e)return o;const c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,n=e.objectName,s=e.propertyName;let r=e.propertyIndex;if(t||(t=ae.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}const a=t[s];if(a===void 0){const l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ae.Composite=Sx;ae.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ae.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ae.prototype.GetterByBindingType=[ae.prototype._getValue_direct,ae.prototype._getValue_array,ae.prototype._getValue_arrayElement,ae.prototype._getValue_toArray];ae.prototype.SetterByBindingTypeAndVersioning=[[ae.prototype._setValue_direct,ae.prototype._setValue_direct_setNeedsUpdate,ae.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_array,ae.prototype._setValue_array_setNeedsUpdate,ae.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_arrayElement,ae.prototype._setValue_arrayElement_setNeedsUpdate,ae.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_fromArray,ae.prototype._setValue_fromArray_setNeedsUpdate,ae.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Ex{constructor(t,e,n=null,s=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=s;const r=e.tracks,a=r.length,o=new Array(a),c={endingStart:Cs,endingEnd:Cs};for(let l=0;l!==a;++l){const h=r[l].createInterpolant(null);o[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=pf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n){if(t.fadeOut(e),this.fadeIn(e),n){const s=this._clip.duration,r=t._clip.duration,a=r/s,o=s/r;t.warp(1,a,e),this.warp(o,1,e)}return this}crossFadeTo(t,e,n){return t.crossFadeFrom(this,e,n)}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){const s=this._mixer,r=s.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);const c=o.parameterPositions,l=o.sampleValues;return c[0]=r,c[1]=r+n,l[0]=t/a,l[1]=e/a,this}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,s){if(!this.enabled){this._updateWeight(t);return}const r=this._startTime;if(r!==null){const c=(t-r)*n;c<0||n===0?e=0:(this._startTime=null,e=n*c)}e*=this._updateTimeScale(t);const a=this._updateTime(e),o=this._updateWeight(t);if(o>0){const c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case gf:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(a),l[h].accumulateAdditive(o);break;case gc:default:for(let h=0,u=c.length;h!==u;++h)c[h].evaluate(a),l[h].accumulate(s,o)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const n=this._weightInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const s=n.evaluate(t)[0];e*=s,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){const e=this._clip.duration,n=this.loop;let s=this.time+t,r=this._loopCount;const a=n===mf;if(t===0)return r===-1?s:a&&(r&1)===1?e-s:s;if(n===ec){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(s>=e)s=e;else if(s<0)s=0;else{this.time=s;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(r===-1&&(t>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=e||s<0){const o=Math.floor(s/e);s-=e*o,r+=Math.abs(o);const c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=t>0?e:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(c===1){const l=t<0;this._setEndings(l,!l,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=s;if(a&&(r&1)===1)return e-s}return s}_setEndings(t,e,n){const s=this._interpolantSettings;n?(s.endingStart=Ps,s.endingEnd=Ps):(t?s.endingStart=this.zeroSlopeAtStart?Ps:Cs:s.endingStart=So,e?s.endingEnd=this.zeroSlopeAtEnd?Ps:Cs:s.endingEnd=So)}_scheduleFading(t,e,n){const s=this._mixer,r=s.time;let a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,c=a.sampleValues;return o[0]=r,c[0]=e,o[1]=r+t,c[1]=n,this}}const wx=new Float32Array(1);class Tx extends Ti{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(t,e){const n=t._localRoot||this._root,s=t._clip.tracks,r=s.length,a=t._propertyBindings,o=t._interpolants,c=n.uuid,l=this._bindingsByRootAndName;let h=l[c];h===void 0&&(h={},l[c]=h);for(let u=0;u!==r;++u){const d=s[u],f=d.name;let g=h[f];if(g!==void 0)++g.referenceCount,a[u]=g;else{if(g=a[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,c,f));continue}const _=e&&e._propertyBindings[u].binding.parsedPath;g=new px(ae.create(n,f,_),d.ValueTypeName,d.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,c,f),a[u]=g}o[u].resultBuffer=g.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const n=(t._localRoot||this._root).uuid,s=t._clip.uuid,r=this._actionsByClip[s];this._bindAction(t,r&&r.knownActions[0]),this._addInactiveAction(t,s,n)}const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){const s=this._actions,r=this._actionsByClip;let a=r[e];if(a===void 0)a={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,r[e]=a;else{const o=a.knownActions;t._byClipCacheIndex=o.length,o.push(t)}t._cacheIndex=s.length,s.push(t),a.actionByRoot[n]=t}_removeInactiveAction(t){const e=this._actions,n=e[e.length-1],s=t._cacheIndex;n._cacheIndex=s,e[s]=n,e.pop(),t._cacheIndex=null;const r=t._clip.uuid,a=this._actionsByClip,o=a[r],c=o.knownActions,l=c[c.length-1],h=t._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),t._byClipCacheIndex=null;const u=o.actionByRoot,d=(t._localRoot||this._root).uuid;delete u[d],c.length===0&&delete a[r],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let n=0,s=e.length;n!==s;++n){const r=e[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(t){const e=this._actions,n=t._cacheIndex,s=this._nActiveActions++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackAction(t){const e=this._actions,n=t._cacheIndex,s=--this._nActiveActions,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_addInactiveBinding(t,e,n){const s=this._bindingsByRootAndName,r=this._bindings;let a=s[e];a===void 0&&(a={},s[e]=a),a[n]=t,t._cacheIndex=r.length,r.push(t)}_removeInactiveBinding(t){const e=this._bindings,n=t.binding,s=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[s],c=e[e.length-1],l=t._cacheIndex;c._cacheIndex=l,e[l]=c,e.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(t){const e=this._bindings,n=t._cacheIndex,s=this._nActiveBindings++,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_takeBackBinding(t){const e=this._bindings,n=t._cacheIndex,s=--this._nActiveBindings,r=e[s];t._cacheIndex=s,e[s]=t,r._cacheIndex=n,e[n]=r}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let n=t[e];return n===void 0&&(n=new Hu(new Float32Array(2),new Float32Array(2),1,wx),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){const e=this._controlInterpolants,n=t.__cacheIndex,s=--this._nActiveControlInterpolants,r=e[s];t.__cacheIndex=s,e[s]=t,r.__cacheIndex=n,e[n]=r}clipAction(t,e,n){const s=e||this._root,r=s.uuid;let a=typeof t=="string"?cc.findByName(s,t):t;const o=a!==null?a.uuid:t,c=this._actionsByClip[o];let l=null;if(n===void 0&&(a!==null?n=a.blendMode:n=gc),c!==void 0){const u=c.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;l=c.knownActions[0],a===null&&(a=l._clip)}if(a===null)return null;const h=new Ex(this,a,e,n);return this._bindAction(h,l),this._addInactiveAction(h,o,r),h}existingAction(t,e){const n=e||this._root,s=n.uuid,r=typeof t=="string"?cc.findByName(n,t):t,a=r?r.uuid:t,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;const e=this._actions,n=this._nActiveActions,s=this.time+=t,r=Math.sign(t),a=this._accuIndex^=1;for(let l=0;l!==n;++l)e[l]._update(s,t,r,a);const o=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)o[l].apply(a);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){const e=this._actions,n=t.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){const a=r.knownActions;for(let o=0,c=a.length;o!==c;++o){const l=a[o];this._deactivateAction(l);const h=l._cacheIndex,u=e[e.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,u._cacheIndex=h,e[h]=u,e.pop(),this._removeInactiveBindingsForAction(l)}delete s[n]}}uncacheRoot(t){const e=t.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,c=o[e];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}const s=this._bindingsByRootAndName,r=s[e];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(t,e){const n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}class Dh{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Be(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const li=new b,oo=new qt,Aa=new qt;class Hv extends Ec{constructor(t){const e=Xu(t),n=new de,s=[],r=[],a=new Xt(0,0,1),o=new Xt(0,1,0);for(let l=0;l<e.length;l++){const h=e[l];h.parent&&h.parent.isBone&&(s.push(0,0,0),s.push(0,0,0),r.push(a.r,a.g,a.b),r.push(o.r,o.g,o.b))}n.setAttribute("position",new Jt(s,3)),n.setAttribute("color",new Jt(r,3));const c=new Er({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,c),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(t){const e=this.bones,n=this.geometry,s=n.getAttribute("position");Aa.copy(this.root.matrixWorld).invert();for(let r=0,a=0;r<e.length;r++){const o=e[r];o.parent&&o.parent.isBone&&(oo.multiplyMatrices(Aa,o.matrixWorld),li.setFromMatrixPosition(oo),s.setXYZ(a,li.x,li.y,li.z),oo.multiplyMatrices(Aa,o.parent.matrixWorld),li.setFromMatrixPosition(oo),s.setXYZ(a+1,li.x,li.y,li.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t)}dispose(){this.geometry.dispose(),this.material.dispose()}}function Xu(i){const t=[];i.isBone===!0&&t.push(i);for(let e=0;e<i.children.length;e++)t.push.apply(t,Xu(i.children[e]));return t}class Gv extends Ec{constructor(t=10,e=10,n=4473924,s=8947848){n=new Xt(n),s=new Xt(s);const r=e/2,a=t/e,o=t/2,c=[],l=[];for(let d=0,f=0,g=-o;d<=e;d++,g+=a){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=d===r?n:s;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const h=new de;h.setAttribute("position",new Jt(c,3)),h.setAttribute("color",new Jt(l,3));const u=new Er({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Uh=new b;let ao,Ra;class Wv extends Ae{constructor(t=new b(0,0,1),e=new b(0,0,0),n=1,s=16776960,r=n*.2,a=r*.2){super(),this.type="ArrowHelper",ao===void 0&&(ao=new de,ao.setAttribute("position",new Jt([0,0,0,0,1,0],3)),Ra=new cn(0,.5,1,5,1),Ra.translate(0,-.5,0)),this.position.copy(e),this.line=new Bu(ao,new Er({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new je(Ra,new vc({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,r,a)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{Uh.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(Uh,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class Xv extends Ec{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new de;s.setAttribute("position",new Jt(e,3)),s.setAttribute("color",new Jt(n,3));const r=new Er({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(t,e,n){const s=new Xt,r=this.geometry.attributes.color.array;return s.set(t),s.toArray(r,0),s.toArray(r,3),s.set(e),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pc);const Nh={type:"change"},Ca={type:"start"},Fh={type:"end"},co=new Sr,Oh=new pi,Ax=Math.cos(70*dn.DEG2RAD);class qv extends Ti{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new b,this.cursor=new b,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Qi.ROTATE,MIDDLE:Qi.DOLLY,RIGHT:Qi.PAN},this.touches={ONE:ts.ROTATE,TWO:ts.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(O){O.addEventListener("keydown",Nt),this._domElementKeyEvents=O},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Nt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Nh),n.update(),r=s.NONE},this.update=function(){const O=new b,mt=new ie().setFromUnitVectors(t.up,new b(0,1,0)),Pt=mt.clone().invert(),Tt=new b,lt=new ie,W=new b,gt=2*Math.PI;return function(Bt=null){const Ut=n.object.position;O.copy(Ut).sub(n.target),O.applyQuaternion(mt),o.setFromVector3(O),n.autoRotate&&r===s.NONE&&U(y(Bt)),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let ee=n.minAzimuthAngle,ne=n.maxAzimuthAngle;isFinite(ee)&&isFinite(ne)&&(ee<-Math.PI?ee+=gt:ee>Math.PI&&(ee-=gt),ne<-Math.PI?ne+=gt:ne>Math.PI&&(ne-=gt),ee<=ne?o.theta=Math.max(ee,Math.min(ne,o.theta)):o.theta=o.theta>(ee+ne)/2?Math.max(ee,o.theta):Math.min(ne,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&T||n.object.isOrthographicCamera?o.radius=G(o.radius):o.radius=G(o.radius*l),O.setFromSpherical(o),O.applyQuaternion(Pt),Ut.copy(n.target).add(O),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0));let Ee=!1;if(n.zoomToCursor&&T){let Re=null;if(n.object.isPerspectiveCamera){const se=O.length();Re=G(se*l);const De=se-Re;n.object.position.addScaledVector(S,De),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){const se=new b(w.x,w.y,0);se.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Ee=!0;const De=new b(w.x,w.y,0);De.unproject(n.object),n.object.position.sub(De).add(se),n.object.updateMatrixWorld(),Re=O.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Re!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Re).add(n.object.position):(co.origin.copy(n.object.position),co.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(co.direction))<Ax?t.lookAt(n.target):(Oh.setFromNormalAndCoplanarPoint(n.object.up,n.target),co.intersectPlane(Oh,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Ee=!0);return l=1,T=!1,Ee||Tt.distanceToSquared(n.object.position)>a||8*(1-lt.dot(n.object.quaternion))>a||W.distanceToSquared(n.target)>0?(n.dispatchEvent(Nh),Tt.copy(n.object.position),lt.copy(n.object.quaternion),W.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",oe),n.domElement.removeEventListener("pointerdown",I),n.domElement.removeEventListener("pointercancel",J),n.domElement.removeEventListener("wheel",ft),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",J),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",Nt),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const a=1e-6,o=new Dh,c=new Dh;let l=1;const h=new b,u=new ot,d=new ot,f=new ot,g=new ot,_=new ot,m=new ot,p=new ot,v=new ot,x=new ot,S=new b,w=new ot;let T=!1;const E=[],A={};let M=!1;function y(O){return O!==null?2*Math.PI/60*n.autoRotateSpeed*O:2*Math.PI/60/60*n.autoRotateSpeed}function C(O){const mt=Math.abs(O*.01);return Math.pow(.95,n.zoomSpeed*mt)}function U(O){c.theta-=O}function H(O){c.phi-=O}const P=function(){const O=new b;return function(Pt,Tt){O.setFromMatrixColumn(Tt,0),O.multiplyScalar(-Pt),h.add(O)}}(),F=function(){const O=new b;return function(Pt,Tt){n.screenSpacePanning===!0?O.setFromMatrixColumn(Tt,1):(O.setFromMatrixColumn(Tt,0),O.crossVectors(n.object.up,O)),O.multiplyScalar(Pt),h.add(O)}}(),B=function(){const O=new b;return function(Pt,Tt){const lt=n.domElement;if(n.object.isPerspectiveCamera){const W=n.object.position;O.copy(W).sub(n.target);let gt=O.length();gt*=Math.tan(n.object.fov/2*Math.PI/180),P(2*Pt*gt/lt.clientHeight,n.object.matrix),F(2*Tt*gt/lt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(P(Pt*(n.object.right-n.object.left)/n.object.zoom/lt.clientWidth,n.object.matrix),F(Tt*(n.object.top-n.object.bottom)/n.object.zoom/lt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function N(O){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=O:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function z(O){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=O:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function D(O,mt){if(!n.zoomToCursor)return;T=!0;const Pt=n.domElement.getBoundingClientRect(),Tt=O-Pt.left,lt=mt-Pt.top,W=Pt.width,gt=Pt.height;w.x=Tt/W*2-1,w.y=-(lt/gt)*2+1,S.set(w.x,w.y,1).unproject(n.object).sub(n.object.position).normalize()}function G(O){return Math.max(n.minDistance,Math.min(n.maxDistance,O))}function q(O){u.set(O.clientX,O.clientY)}function Z(O){D(O.clientX,O.clientX),p.set(O.clientX,O.clientY)}function X(O){g.set(O.clientX,O.clientY)}function j(O){d.set(O.clientX,O.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const mt=n.domElement;U(2*Math.PI*f.x/mt.clientHeight),H(2*Math.PI*f.y/mt.clientHeight),u.copy(d),n.update()}function Q(O){v.set(O.clientX,O.clientY),x.subVectors(v,p),x.y>0?N(C(x.y)):x.y<0&&z(C(x.y)),p.copy(v),n.update()}function st(O){_.set(O.clientX,O.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),B(m.x,m.y),g.copy(_),n.update()}function k(O){D(O.clientX,O.clientY),O.deltaY<0?z(C(O.deltaY)):O.deltaY>0&&N(C(O.deltaY)),n.update()}function Y(O){let mt=!1;switch(O.code){case n.keys.UP:O.ctrlKey||O.metaKey||O.shiftKey?H(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,n.keyPanSpeed),mt=!0;break;case n.keys.BOTTOM:O.ctrlKey||O.metaKey||O.shiftKey?H(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(0,-n.keyPanSpeed),mt=!0;break;case n.keys.LEFT:O.ctrlKey||O.metaKey||O.shiftKey?U(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(n.keyPanSpeed,0),mt=!0;break;case n.keys.RIGHT:O.ctrlKey||O.metaKey||O.shiftKey?U(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):B(-n.keyPanSpeed,0),mt=!0;break}mt&&(O.preventDefault(),n.update())}function nt(O){if(E.length===1)u.set(O.pageX,O.pageY);else{const mt=Et(O),Pt=.5*(O.pageX+mt.x),Tt=.5*(O.pageY+mt.y);u.set(Pt,Tt)}}function rt(O){if(E.length===1)g.set(O.pageX,O.pageY);else{const mt=Et(O),Pt=.5*(O.pageX+mt.x),Tt=.5*(O.pageY+mt.y);g.set(Pt,Tt)}}function ht(O){const mt=Et(O),Pt=O.pageX-mt.x,Tt=O.pageY-mt.y,lt=Math.sqrt(Pt*Pt+Tt*Tt);p.set(0,lt)}function V(O){n.enableZoom&&ht(O),n.enablePan&&rt(O)}function St(O){n.enableZoom&&ht(O),n.enableRotate&&nt(O)}function ut(O){if(E.length==1)d.set(O.pageX,O.pageY);else{const Pt=Et(O),Tt=.5*(O.pageX+Pt.x),lt=.5*(O.pageY+Pt.y);d.set(Tt,lt)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);const mt=n.domElement;U(2*Math.PI*f.x/mt.clientHeight),H(2*Math.PI*f.y/mt.clientHeight),u.copy(d)}function _t(O){if(E.length===1)_.set(O.pageX,O.pageY);else{const mt=Et(O),Pt=.5*(O.pageX+mt.x),Tt=.5*(O.pageY+mt.y);_.set(Pt,Tt)}m.subVectors(_,g).multiplyScalar(n.panSpeed),B(m.x,m.y),g.copy(_)}function pt(O){const mt=Et(O),Pt=O.pageX-mt.x,Tt=O.pageY-mt.y,lt=Math.sqrt(Pt*Pt+Tt*Tt);v.set(0,lt),x.set(0,Math.pow(v.y/p.y,n.zoomSpeed)),N(x.y),p.copy(v);const W=(O.pageX+mt.x)*.5,gt=(O.pageY+mt.y)*.5;D(W,gt)}function Ct(O){n.enableZoom&&pt(O),n.enablePan&&_t(O)}function Lt(O){n.enableZoom&&pt(O),n.enableRotate&&ut(O)}function I(O){n.enabled!==!1&&(E.length===0&&(n.domElement.setPointerCapture(O.pointerId),n.domElement.addEventListener("pointermove",R),n.domElement.addEventListener("pointerup",J)),Kt(O),O.pointerType==="touch"?Yt(O):dt(O))}function R(O){n.enabled!==!1&&(O.pointerType==="touch"?at(O):ct(O))}function J(O){kt(O),E.length===0&&(n.domElement.releasePointerCapture(O.pointerId),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",J)),n.dispatchEvent(Fh),r=s.NONE}function dt(O){let mt;switch(O.button){case 0:mt=n.mouseButtons.LEFT;break;case 1:mt=n.mouseButtons.MIDDLE;break;case 2:mt=n.mouseButtons.RIGHT;break;default:mt=-1}switch(mt){case Qi.DOLLY:if(n.enableZoom===!1)return;Z(O),r=s.DOLLY;break;case Qi.ROTATE:if(O.ctrlKey||O.metaKey||O.shiftKey){if(n.enablePan===!1)return;X(O),r=s.PAN}else{if(n.enableRotate===!1)return;q(O),r=s.ROTATE}break;case Qi.PAN:if(O.ctrlKey||O.metaKey||O.shiftKey){if(n.enableRotate===!1)return;q(O),r=s.ROTATE}else{if(n.enablePan===!1)return;X(O),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ca)}function ct(O){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;j(O);break;case s.DOLLY:if(n.enableZoom===!1)return;Q(O);break;case s.PAN:if(n.enablePan===!1)return;st(O);break}}function ft(O){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(O.preventDefault(),n.dispatchEvent(Ca),k(Rt(O)),n.dispatchEvent(Fh))}function Rt(O){const mt=O.deltaMode,Pt={clientX:O.clientX,clientY:O.clientY,deltaY:O.deltaY};switch(mt){case 1:Pt.deltaY*=16;break;case 2:Pt.deltaY*=100;break}return O.ctrlKey&&!M&&(Pt.deltaY*=10),Pt}function bt(O){O.key==="Control"&&(M=!0,document.addEventListener("keyup",At,{passive:!0,capture:!0}))}function At(O){O.key==="Control"&&(M=!1,document.removeEventListener("keyup",At,{passive:!0,capture:!0}))}function Nt(O){n.enabled===!1||n.enablePan===!1||Y(O)}function Yt(O){switch(Dt(O),E.length){case 1:switch(n.touches.ONE){case ts.ROTATE:if(n.enableRotate===!1)return;nt(O),r=s.TOUCH_ROTATE;break;case ts.PAN:if(n.enablePan===!1)return;rt(O),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case ts.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;V(O),r=s.TOUCH_DOLLY_PAN;break;case ts.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;St(O),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ca)}function at(O){switch(Dt(O),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;ut(O),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;_t(O),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ct(O),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Lt(O),n.update();break;default:r=s.NONE}}function oe(O){n.enabled!==!1&&O.preventDefault()}function Kt(O){E.push(O.pointerId)}function kt(O){delete A[O.pointerId];for(let mt=0;mt<E.length;mt++)if(E[mt]==O.pointerId){E.splice(mt,1);return}}function Dt(O){let mt=A[O.pointerId];mt===void 0&&(mt=new ot,A[O.pointerId]=mt),mt.set(O.pageX,O.pageY)}function Et(O){const mt=O.pointerId===E[0]?E[1]:E[0];return A[mt]}n.domElement.addEventListener("contextmenu",oe),n.domElement.addEventListener("pointerdown",I),n.domElement.addEventListener("pointercancel",J),n.domElement.addEventListener("wheel",ft,{passive:!1}),document.addEventListener("keydown",bt,{passive:!0,capture:!0}),this.update()}}function Bo(i){return i=i^61^i>>>16,i=i+(i<<3)|0,i=i^i>>>4,i=Math.imul(i,668265261),i=i^i>>>15,i>>>0}function ln(i,t){return Bo(Math.imul(i|0,374761393)+Math.imul(t|0,668265263))/4294967296}function Rx(i,t,e){return Bo(Math.imul(i|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,2147483647))/4294967296}function pn(i=1){let t=(i|0)>>>0||1;return function(){t=t+1831565813>>>0;let n=t;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}const qi=i=>i*i*i*(i*(i*6-15)+10),vn=(i,t,e)=>i+(t-i)*e;function qu(i,t){const e=Math.floor(i),n=Math.floor(t),s=i-e,r=t-n,a=qi(s),o=qi(r),c=ln(e,n),l=ln(e+1,n),h=ln(e,n+1),u=ln(e+1,n+1);return vn(vn(c,l,a),vn(h,u,a),o)}function nn(i,t,e){const n=Math.floor(i),s=Math.floor(t),r=Math.floor(e),a=i-n,o=t-s,c=e-r,l=qi(a),h=qi(o),u=qi(c),d=(p,v,x)=>Rx(n+p,s+v,r+x),f=vn(d(0,0,0),d(1,0,0),l),g=vn(d(0,1,0),d(1,1,0),l),_=vn(d(0,0,1),d(1,0,1),l),m=vn(d(0,1,1),d(1,1,1),l);return vn(vn(f,g,h),vn(_,m,h),u)}function Yv(i,t,e=5,n=2,s=.5){let r=0,a=1,o=0,c=i,l=t;for(let h=0;h<e;h++)r+=a*qu(c,l),o+=a,a*=s,c*=n,l*=n;return r/o}function Yu(i,t,e,n=4,s=2,r=.5){let a=0,o=1,c=0,l=1;for(let h=0;h<n;h++)a+=o*nn(i*l,t*l,e*l),c+=o,o*=r,l*=s;return a/c}function ju(i,t,e){const n=Math.floor(i),s=Math.floor(t),r=i-n,a=t-s,o=qi(r),c=qi(a),l=u=>(u%e+e)%e,h=(u,d)=>ln(l(n+u),l(s+d));return vn(vn(h(0,0),h(1,0),o),vn(h(0,1),h(1,1),o),c)}function $u(i,t,e,n=5,s=.5){let r=0,a=1,o=0,c=1;for(let l=0;l<n;l++)r+=a*ju(i*c,t*c,e*c),o+=a,a*=s,c*=2;return r/o}const Ot=i=>i<0?0:i>1?1:i,yt=(i,t,e)=>{const n=Ot((e-i)/(t-i));return n*n*(3-2*n)},Cx=Object.freeze(new b(0,0,1)),lc=Object.freeze(new b(0,0,-1)),jv=Object.freeze(new b(0,1,0)),$v=Object.freeze(new b(1,0,0)),Px=Object.freeze(new b(-1,0,0)),Kv=Cx.z;function Zv(i){return lc.z*i}const Bh=i=>i*i*i*(i*(i*6-15)+10),Qe=(i,t,e)=>i+(t-i)*e,zn=(i,t)=>(i%t+t)%t;function ki(i,t,e){return Bo(Math.imul(i|0,374761393)^Math.imul(t|0,668265263)^Math.imul(e|0,2654435761))/4294967296}function $i(i,t,e,n,s){const r=Math.floor(i),a=Math.floor(t),o=Bh(i-r),c=Bh(t-a),l=zn(r,e),h=l+1===e?0:l+1,u=zn(a,n),d=u+1===n?0:u+1,f=ki(l,u,s),g=ki(h,u,s),_=ki(l,d,s),m=ki(h,d,s);return Qe(Qe(f,g,o),Qe(_,m,o),c)}function ze(i,t,e,n,s,r,a=.5){let o=0,c=1,l=0,h=1;for(let u=0;u<s;u++)o+=c*$i(i*h,t*h,e*h,n*h,r+u*977),l+=c,c*=a,h*=2;return o/l}function Lx(i,t,e,n,s,r){let a=0,o=.5,c=0,l=1;for(let h=0;h<s;h++){const u=1-Math.abs($i(i*l,t*l,e*l,n*l,r+h*131)*2-1);a+=o*u*u,c+=o,o*=.5,l*=2}return a/c}const lo={f1:0,f2:0,id:0},hi=new Int32Array(3),ui=new Int32Array(3);function Ki(i,t,e,n,s){const r=Math.floor(i),a=Math.floor(t);hi[1]=zn(r,e),hi[0]=hi[1]===0?e-1:hi[1]-1,hi[2]=hi[1]+1===e?0:hi[1]+1,ui[1]=zn(a,n),ui[0]=ui[1]===0?n-1:ui[1]-1,ui[2]=ui[1]+1===n?0:ui[1]+1;let o=1e9,c=1e9,l=0;for(let h=-1;h<=1;h++){const u=a+h,d=ui[h+1];for(let f=-1;f<=1;f++){const g=r+f,_=hi[f+1],m=g+ki(_,d,s),p=u+ki(_+9871,d-4231,s),v=m-i,x=p-t,S=v*v+x*x;S<o?(c=o,o=S,l=ki(_*3+7,d*5-3,s)):S<c&&(c=S)}}return lo.f1=Math.sqrt(o),lo.f2=Math.sqrt(c),lo.id=l,lo}function Ix(i){const t=document.createElement("canvas");return t.width=i,t.height=i,t}function sn(i,t){const e=Ix(i);return e.getContext("2d").putImageData(new ImageData(t,i,i),0,0),e}function rn(i,t=!1){const e=new zu(i);return e.wrapS=ks,e.wrapT=ks,e.anisotropy=8,t&&(e.colorSpace=Oe),e.needsUpdate=!0,e}function Ne(i){const t=parseInt(String(i).replace("#",""),16);return[t>>16&255,t>>8&255,t&255]}function Dx(i,t=2){const e=i.width,n=i.getContext("2d",{willReadFrequently:!0}).getImageData(0,0,e,e).data,s=new Float32Array(e*e);for(let r=0;r<s.length;r++)s[r]=n[r*4]/255;return Ks(e,s,t)}function Ks(i,t,e){const n=new Uint8ClampedArray(i*i*4);for(let s=0;s<i;s++){const r=(s===0?i-1:s-1)*i,a=s*i,o=(s===i-1?0:s+1)*i;for(let c=0;c<i;c++){const l=c===0?i-1:c-1,h=c===i-1?0:c+1,u=t[r+l],d=t[r+c],f=t[r+h],g=t[a+l],_=t[a+h],m=t[o+l],p=t[o+c],v=t[o+h],x=f+2*_+v-(u+2*g+m),S=m+2*p+v-(u+2*d+f),w=-x*e,T=S*e,E=1/Math.sqrt(w*w+T*T+1),A=(a+c)*4;n[A]=(w*E*.5+.5)*255,n[A+1]=(T*E*.5+.5)*255,n[A+2]=(E*.5+.5)*255,n[A+3]=255}}return rn(sn(i,n))}const zh=new Map;function Zs(i,t,e){let n=zh.get(i);n||zh.set(i,n=new Map);const s=JSON.stringify(t);let r=n.get(s);return r||n.set(s,r=e()),r}function Ux(i){if(i)for(const t of Object.keys(i)){const e=i[t];e&&typeof e.dispose=="function"&&e.dispose()}}let Ku=0,Zu=0,Ju=0,Qu=0,td=0,ed=0,nd=0,id=0;function Vn(i,t,e){const n=t*i,s=e*i,r=n|0,a=s|0,o=n-r,c=s-a,l=r+1===i?0:r+1,h=a+1===i?0:a+1;Ku=a*i+r,Zu=a*i+l,Ju=h*i+r,Qu=h*i+l,td=(1-o)*(1-c),ed=o*(1-c),nd=(1-o)*c,id=o*c}function Ht(i){return i[Ku]*td+i[Zu]*ed+i[Ju]*nd+i[Qu]*id}const Gt=i=>new Float32Array(i*i),Pa=Ne("#5f7a52"),bs=Ne("#34452f"),La=Ne("#7a4a6a"),Ia=Ne("#a8ad8a"),Da=Ne("#48e8ff");function sd({size:i=1024,seed:t=7}={}){return Zs("skin",{size:i,seed:t},()=>Nx(i,t))}function Nx(i,t){const e=Math.max(32,i>>3),n=i>>1,s=(t|0)*977+13,r=pn(t*7919+1),a=[];for(let E=0;E<5;E++){const A=r()*Math.PI,M=.07+r()*.14,y=Math.cos(A)*M,C=Math.sin(A)*M;a.push({x:r(),y:r(),dx:y,dy:C,len2:y*y+C*C,w:.006+r()*.007})}const o=Gt(e),c=Gt(e),l=Gt(e),h=Gt(e),u=Gt(e),d=Gt(e);for(let E=0;E<e;E++){const A=E/e;for(let M=0;M<e;M++){const y=M/e,C=E*e+M;o[C]=ze(y*4,A*4,4,4,3,s+11)-.5,c[C]=ze(y*4+3.1,A*4+7.7,4,4,3,s+12)-.5,l[C]=ze(y*5,A*5,5,5,4,s+1),h[C]=ze(y*3,A*3,3,3,3,s+2),u[C]=ze(y*5+1.3,A*5+4.1,5,5,3,s+3),d[C]=ze(y*7,A*7,7,7,3,s+6)}}const f=Gt(n),g=Gt(n),_=Gt(n),m=Gt(n),p=Gt(n),v=Gt(n);for(let E=0;E<n;E++){const A=E/n;for(let M=0;M<n;M++){const y=M/n,C=E*n+M;Vn(e,y,A);const U=Ht(o),H=Ht(c),P=Ht(l),F=Ht(h),B=Ht(u),N=yt(.46,.64,Ht(d)),z=$i(y*26+U*5,A*26+H*5,26,26,s+8),D=Ki(y*64+U*2,A*64+H*2,64,64,s+4),G=yt(.42+D.id*.22,.06,D.f1),q=Lx(y*36+U*8,A*9+H*2,36,9,3,s+5),Z=yt(.4,.9,q);let X=0;for(let nt=0;nt<a.length;nt++){const rt=a[nt];let ht=y-rt.x,V=A-rt.y;ht-=Math.round(ht),V-=Math.round(V);let St=(ht*rt.dx+V*rt.dy)/rt.len2;St=St<0?0:St>1?1:St;const ut=ht-rt.dx*St,_t=V-rt.dy*St,pt=Math.sqrt(ut*ut+_t*_t)/rt.w,Ct=.35+.65*Math.sin(Math.PI*St),Lt=(1-yt(.45*Ct,1.05*Ct,pt))*Ct;Lt>X&&(X=Lt)}const j=Ot(.24+P*.44+(z-.5)*.34+G*.48-Z*.6-D.id*.1);let Q=bs[0]+(Pa[0]-bs[0])*j,st=bs[1]+(Pa[1]-bs[1])*j,k=bs[2]+(Pa[2]-bs[2])*j;const Y=yt(.44,.78,F+(z-.5)*.25)*.6;if(Q+=(La[0]-Q)*Y,st+=(La[1]-st)*Y,k+=(La[2]-k)*Y,X>0){const nt=X*.85;Q+=(Ia[0]-Q)*nt,st+=(Ia[1]-st)*nt,k+=(Ia[2]-k)*nt}if(f[C]=Q,g[C]=st,_[C]=k,m[C]=Ot(.5+G*.3-Z*.32+(P-.5)*.14+X*.12),p[C]=Ot(.88+(P-.5)*.14-B*.2-X*.22),N>.01){const nt=Ki(y*72,A*72,72,72,s+7),rt=nt.id>.58?1:0;v[C]=N*rt*yt(.34,.08,nt.f1)*(.4+nt.id*.6)}}}const x=new Uint8ClampedArray(i*i*4),S=new Uint8ClampedArray(i*i*4),w=new Uint8ClampedArray(i*i*4),T=new Float32Array(i*i);for(let E=0;E<i;E++){const A=E/i;for(let M=0;M<i;M++){const y=(E*i+M)*4;Vn(n,M/i,A);const C=ln(M*3+t,E*7-t)-.5,U=1+C*.15;x[y]=Ht(f)*U,x[y+1]=Ht(g)*U,x[y+2]=Ht(_)*U,x[y+3]=255;const H=Ot(Ht(p)+C*.08)*255;S[y]=H,S[y+1]=H,S[y+2]=H,S[y+3]=255;const P=Ot(Ht(v)*(1+C*.3));w[y]=Da[0]*P,w[y+1]=Da[1]*P,w[y+2]=Da[2]*P,w[y+3]=255,T[E*i+M]=Ot(Ht(m)+C*.06)}}return{map:rn(sn(i,x),!0),normalMap:Ks(i,T,2.2),roughnessMap:rn(sn(i,S)),emissiveMap:rn(sn(i,w))}}function As({size:i=512,seed:t=11,color:e="#4a3324",wear:n=.5}={}){return Zs("leather",{size:i,seed:t,color:e,wear:n},()=>Fx(i,t,e,n))}function Fx(i,t,e,n){const s=Math.max(32,i>>3),r=i>>1,a=(t|0)*977+29,o=pn(t*6151+5),c=Ne(e),l=[c[0]*.3,c[1]*.3,c[2]*.32],h=[Math.min(255,c[0]*1.6+30),Math.min(255,c[1]*1.55+27),Math.min(255,c[2]*1.5+22)],u=[];for(let A=0;A<3;A++)u.push({v:o(),holes:24+(o()*3|0)*8,r:.0075+o()*.003});const d=Gt(s),f=Gt(s),g=Gt(s),_=Gt(s);for(let A=0;A<s;A++){const M=A/s;for(let y=0;y<s;y++){const C=y/s,U=A*s+y;d[U]=ze(C*3,M*3,3,3,3,a+11)-.5,f[U]=ze(C*3+5.3,M*3+1.9,3,3,3,a+12)-.5,g[U]=yt(.42,.84,ze(C*5,M*5,5,5,4,a+3)),_[U]=$u(C*4+.37,M*4+.91,4,4)}}const m=Gt(r),p=Gt(r),v=Gt(r),x=Gt(r),S=Gt(r);for(let A=0;A<r;A++){const M=A/r;for(let y=0;y<r;y++){const C=y/r,U=A*r+y;Vn(s,C,M);const H=Ht(d),P=Ht(f),F=Ot(Ht(g)*n*1.7),B=Ht(_),N=Ki(C*12+H*2.4,M*12+P*2.4,12,12,a+1),z=1-yt(0,.16,N.f2-N.f1),D=Ki(C*34+H*3,M*34+P*3,34,34,a+2),G=(1-yt(0,.1,D.f2-D.f1))*.55,q=yt(.02,.42,N.f1),Z=Ot(.4+(N.id-.5)*.32+q*.42-z-G*.8);let X=l[0]+(c[0]-l[0])*Z,j=l[1]+(c[1]-l[1])*Z,Q=l[2]+(c[2]-l[2])*Z;const st=Ot(F*(.2+q*.9))*.75;X+=(h[0]-X)*st,j+=(h[1]-j)*st,Q+=(h[2]-Q)*st;const k=Ot((B-.5)*.3+.08);X+=(l[0]-X)*k,j+=(l[1]-j)*k,Q+=(l[2]-Q)*k;let Y=Ot(.52+q*.32-z*.5-G*.35+(N.id-.5)*.1),nt=Ot(.84-F*q*.42+(B-.5)*.15);for(let rt=0;rt<u.length;rt++){const ht=u[rt];let V=M-ht.v;if(V-=Math.round(V),V<-.05||V>.05)continue;const St=C*ht.holes,ut=(St-Math.floor(St)-.5)/ht.holes,_t=Math.sqrt(ut*ut+V*V),pt=1-yt(ht.r*.55,ht.r,_t),Ct=yt(ht.r*1.9,ht.r*1.05,_t)*(1-pt);if(pt>0||Ct>0){const Lt=pt*.9;X+=(l[0]-X)*Lt,j+=(l[1]-j)*Lt,Q+=(l[2]-Q)*Lt,Y=Ot(Y-pt*.42+Ct*.14),nt=Ot(nt+pt*.12)}}m[U]=X,p[U]=j,v[U]=Q,x[U]=Y,S[U]=nt}}const w=new Uint8ClampedArray(i*i*4),T=new Uint8ClampedArray(i*i*4),E=new Float32Array(i*i);for(let A=0;A<i;A++){const M=A/i;for(let y=0;y<i;y++){const C=(A*i+y)*4;Vn(r,y/i,M);const U=ln(y*5+t,A*11+t)-.5,H=1+U*.16;w[C]=Ht(m)*H,w[C+1]=Ht(p)*H,w[C+2]=Ht(v)*H,w[C+3]=255;const P=Ot(Ht(S)+U*.1)*255;T[C]=P,T[C+1]=P,T[C+2]=P,T[C+3]=255,E[A*i+y]=Ot(Ht(x)+U*.05)}}return{map:rn(sn(i,w),!0),normalMap:Ks(i,E,2.6),roughnessMap:rn(sn(i,T))}}function dr({size:i=512,seed:t=13,color:e="#7a4a2a",stripe:n=null}={}){return Zs("cloth",{size:i,seed:t,color:e,stripe:n},()=>Ox(i,t,e,n))}function Ox(i,t,e,n){const s=i>>2,r=(t|0)*977+41,a=Ne(e),o=n?Ne(n):null,c=[58,46,36],l=4,h=i/l,u=new Float32Array(h),d=new Float32Array(h);for(let w=0;w<h;w++)u[w]=.91+$i(w*.25,.5,h*.25,1,r+21)*.15+ln(w,t)*.06,d[w]=.91+$i(.5,w*.25,1,h*.25,r+22)*.15+ln(w,t+99)*.06;const f=Gt(s),g=Gt(s),_=Gt(s),m=Gt(s),p=Gt(s);for(let w=0;w<s;w++){const T=w/s;for(let E=0;E<s;E++){const A=E/s,M=w*s+E,y=ze(A*3,T*3,3,3,4,r+1),C=$u(A*6+.21,T*6+.63,6,4),U=yt(.62,.92,ze(A*9,T*9,9,9,4,r+2));let H=a[0],P=a[1],F=a[2];if(o){let D=T-.5;D-=Math.round(D);const G=D<0?-D:D,q=Ot(yt(.085,.065,G)+yt(.021,.012,G))*.92;H+=(o[0]-H)*q,P+=(o[1]-P)*q,F+=(o[2]-F)*q}const B=Ot((y-.42)*.95);H*=1-B*.55,P*=1-B*.58,F*=1-B*.62;const N=U*.5;H+=(c[0]-H)*N,P+=(c[1]-P)*N,F+=(c[2]-F)*N;const z=.94+C*.24;f[M]=H*z,g[M]=P*z,_[M]=F*z,m[M]=Ot(.9-C*.1+U*.06),p[M]=U}}const v=new Uint8ClampedArray(i*i*4),x=new Uint8ClampedArray(i*i*4),S=new Float32Array(i*i);for(let w=0;w<i;w++){const T=w/i,E=w/l|0,A=(w%l+.5)/l,M=1-(2*A-1)*(2*A-1);for(let y=0;y<i;y++){const C=(w*i+y)*4,U=y/l|0,H=(y%l+.5)/l,P=1-(2*H-1)*(2*H-1),F=(U^E)&1,B=F?P:M,N=F?u[U]:d[E],z=(.58+.42*B)*(F?1:.8)*N;Vn(s,y/i,T);const D=ln(y*7+t,w*13+t)-.5,G=Ht(p),q=z*(1+D*.13);v[C]=Ht(f)*q,v[C+1]=Ht(g)*q,v[C+2]=Ht(_)*q,v[C+3]=255;const Z=Ot(Ht(m)+D*.08-B*.05)*255;x[C]=Z,x[C+1]=Z,x[C+2]=Z,x[C+3]=255,S[w*i+y]=Ot(.5+(F?.16:-.1)+B*.3*N-G*.12+D*.05)}}return{map:rn(sn(i,v),!0),normalMap:Ks(i,S,1.8),roughnessMap:rn(sn(i,x))}}const Kn=Ne("#7a3d1c"),Ua=Ne("#a4602c"),Bx=Ne("#ffab3d"),zx=Ne("#14100c");function fr({size:i=512,seed:t=17,base:e="#6a7078",rust:n=.35,scratch:s=.6,hazard:r=!1}={}){return Zs("metal",{size:i,seed:t,base:e,rust:n,scratch:s,hazard:r},()=>kx(i,t,e,n,s,r))}function kx(i,t,e,n,s,r){const a=Math.max(32,i>>3),o=i>>1,c=(t|0)*977+53,l=pn(t*3253+9),h=Ne(e),u=[Math.min(255,h[0]*1.5+46),Math.min(255,h[1]*1.5+46),Math.min(255,h[2]*1.5+48)],d=new Float32Array(i*i),f=Math.round(s*26);for(let U=0;U<f;U++){const H=l()*i,P=(l()-.5)*.55,F=(.6+l()*5)*(i/512),B=(.3+l()*2)*(i/512),N=.05+l()*.14,z=.18+l()*.4,D=l()*6.283,G=l()*6.283,q=l()*i|0,Z=24+(l()*l()*i*.75|0),X=.55+l()*1.3,j=.3+l()*.7;for(let Q=0;Q<Z;Q++){const st=yt(0,8,Q)*yt(0,12,Z-Q);if(st<=.001)continue;const k=zn(q+Q,i),Y=H+P*Q+Math.sin(Q*N+D)*F+Math.sin(Q*z+G)*B,nt=Math.floor(Y-X-1),rt=Math.ceil(Y+X+1);for(let ht=nt;ht<=rt;ht++){const V=ht-Y,St=(1-yt(X*.35,X+.7,V<0?-V:V))*j*st;if(St<=0)continue;const ut=zn(ht,i)*i+k;St>d[ut]&&(d[ut]=St)}}}const g=Gt(a),_=Gt(a);for(let U=0;U<a;U++){const H=U/a;for(let P=0;P<a;P++){const F=P/a,B=U*a+P;g[B]=ze(F*5,H*5,5,5,4,c+3),_[B]=ze(F*6,H*6,6,6,3,c+5)-.5}}const m=Gt(o),p=Gt(o),v=Gt(o),x=Gt(o),S=Gt(o),w=Gt(o),T=.76-n*.46;for(let U=0;U<o;U++){const H=U/o;for(let P=0;P<o;P++){const F=P/o,B=U*o+P;Vn(a,F,H);const N=Ht(g),z=Ht(_),D=Ki(F*9,H*9,9,9,c+1),G=D.id>.55?yt(.5,.05,D.f1)*(D.id-.55)*2.2:0,q=ze(F*4,H*128,4,128,3,c+2),Z=ze(F*26,H*26,26,26,3,c+4),X=yt(T,T+.1,N+(Z-.5)*.3+G*.2),j=Ot(.3+(q-.5)*.9);let Q=h[0]*.86+(u[0]-h[0]*.86)*j,st=h[1]*.86+(u[1]-h[1]*.86)*j,k=h[2]*.88+(u[2]-h[2]*.88)*j;const Y=G*.7;Q*=1-Y*.45,st*=1-Y*.45,k*=1-Y*.42;let nt=Ot(.36+(q-.5)*.28+G*.18),rt=1-G*.15,ht=Ot(.62-G*.38+(q-.5)*.06);const V=yt(T-.16,T+.02,N)*(1-X)*.5;if(V>0&&(Q+=(Kn[0]*.9-Q)*V,st+=(Kn[1]*.9-st)*V,k+=(Kn[2]*.9-k)*V,nt=Ot(nt+V*.3)),X>0){const St=.68+Z*.66,ut=(Kn[0]+(Ua[0]-Kn[0])*Z)*St,_t=(Kn[1]+(Ua[1]-Kn[1])*Z)*St,pt=(Kn[2]+(Ua[2]-Kn[2])*Z)*St,Ct=X*(.72+Z*.28);Q+=(ut-Q)*Ct,st+=(_t-st)*Ct,k+=(pt-k)*Ct,rt=Qe(rt,.04,X),nt=Qe(nt,Ot(.86+Z*.12),X),ht=Ot(ht-X*.1+Z*X*.14)}if(r){const St=(F+H)*8+z*.16,ut=St-Math.floor(St),_t=ut<.5,pt=_t?Math.min(ut,.5-ut):Math.min(ut-.5,1-ut),Ct=Ot(yt(0,.03,pt)*(1-yt(.5,.72,Z+X*.4)));if(Ct>0){const Lt=_t?Bx:zx,I=Ct*.94;Q+=(Lt[0]-Q)*I,st+=(Lt[1]-st)*I,k+=(Lt[2]-k)*I,rt=Qe(rt,0,Ct),nt=Qe(nt,.52,Ct),ht=Ot(ht+Ct*.05)}}m[B]=Q,p[B]=st,v[B]=k,x[B]=ht,S[B]=nt,w[B]=rt}}const E=new Uint8ClampedArray(i*i*4),A=new Uint8ClampedArray(i*i*4),M=new Uint8ClampedArray(i*i*4),y=new Float32Array(i*i),C=new Float32Array(i);for(let U=0;U<i;U++)C[U]=(ln(U,t)*.6+ln(U>>1,t+7)*.4-.5)*2;for(let U=0;U<i;U++){const H=U/i,P=C[U];for(let F=0;F<i;F++){const B=(U*i+F)*4,N=U*i+F;Vn(o,F/i,H);const z=ln(F*11+t,U*17+t)-.5,D=d[N],G=1+P*.09+z*.05;let q=Ht(m)*G,Z=Ht(p)*G,X=Ht(v)*G,j=Ot(Ht(S)+P*.07+z*.05),Q=Ht(w),st=Ot(Ht(x)+P*.02+z*.03);D>0&&(q=Qe(q,u[0]*1.05,D),Z=Qe(Z,u[1]*1.05,D),X=Qe(X,u[2]*1.05,D),j=Qe(j,.16,D),Q=Qe(Q,1,D),st=Ot(st-D*.16)),E[B]=q,E[B+1]=Z,E[B+2]=X,E[B+3]=255;const k=j*255;A[B]=k,A[B+1]=k,A[B+2]=k,A[B+3]=255;const Y=Q*255;M[B]=Y,M[B+1]=Y,M[B+2]=Y,M[B+3]=255,y[N]=st}}return{map:rn(sn(i,E),!0),normalMap:Ks(i,y,1.6),roughnessMap:rn(sn(i,A)),metalnessMap:rn(sn(i,M))}}function rd({size:i=512,seed:t=19,color:e="#48e8ff",density:n=1}={}){return Zs("panel",{size:i,seed:t,color:e,density:n},()=>Vx(i,t,e,n))}function Vx(i,t,e,n){const s=(t|0)*977+67,r=pn(t*4523+3),a=Ne(e),o=48,c=new Uint8Array(o*o),l=new Uint8Array(o*o),h=new Uint16Array(o*o),u=[1,4,2,8],d=[2,8,1,4],f=Math.max(6,Math.round(o*1.1*n));for(let E=0;E<f;E++){let A=r()*o|0,M=r()*o|0,y=r()*4|0;const C=6+(r()*24|0);for(let U=0;U<C;U++){r()<.24&&(y=y+(r()<.5?1:3)&3);const H=zn(A+(y===0?1:y===2?-1:0),o),P=zn(M+(y===1?1:y===3?-1:0),o);c[M*o+A]|=u[y],c[P*o+H]|=d[y],A=H,M=P}r()<.65&&(l[M*o+A]=1)}const g=Math.max(2,Math.round(14*n));for(let E=0;E<g;E++){const A=r()*o|0,M=r()*o|0,y=1+(r()*3|0);for(let C=0;C<y;C++){const U=zn(M,o)*o+zn(A+C,o);h[U]=Bo(t*31+E*7+C)&511|512}}let _=new Float32Array(o*o);for(let E=0;E<o*o;E++)_[E]=c[E]||l[E]||h[E]?1:0;let m=new Float32Array(o*o);for(let E=0;E<3;E++){for(let M=0;M<o;M++){const y=(M===0?o-1:M-1)*o,C=(M===o-1?0:M+1)*o,U=M*o;for(let H=0;H<o;H++){const P=H===0?o-1:H-1,F=H===o-1?0:H+1;m[U+H]=(_[y+P]+_[y+H]+_[y+F]+_[U+P]+_[U+H]*2+_[U+F]+_[C+P]+_[C+H]+_[C+F])/10}}const A=_;_=m,m=A}const p=new Uint8ClampedArray(i*i*4),v=new Uint8ClampedArray(i*i*4),x=Ne("#0a0d12"),S=Ne("#1e2c34"),w=.035,T=.1;for(let E=0;E<i;E++){const A=E/i,M=A*o,y=M|0,C=M-y;for(let U=0;U<i;U++){const H=(E*i+U)*4,P=U/i,F=P*o,B=F|0,N=F-B,z=y*o+B;let D=0;const G=c[z];if(G){const V=N<.5?.5-N:N-.5,St=C<.5?.5-C:C-.5,ut=1-yt(T-w,T,St),_t=1-yt(T-w,T,V);G&1&&N>=.5&&ut>D&&(D=ut),G&2&&N<=.5&&ut>D&&(D=ut),G&4&&C>=.5&&_t>D&&(D=_t),G&8&&C<=.5&&_t>D&&(D=_t);const pt=ut<_t?ut:_t;pt>D&&(D=pt)}if(l[z]){const V=N-.5,St=C-.5,ut=1-yt(.24,.28,Math.sqrt(V*V+St*St));ut>D&&(D=ut)}const q=h[z];if(q){const V=N*3|0,St=C*3|0,ut=q>>St*3+V&1,_t=N*3-V,pt=C*3-St,Ct=ut*.9*yt(.14,.24,_t)*yt(.14,.24,1-_t)*yt(.14,.24,pt)*yt(.14,.24,1-pt);Ct>D&&(D=Ct)}const Z=ju(P*8+.31,A*8+.77,8),X=Math.abs(P*4-Math.floor(P*4)-.5),j=Math.abs(A*4-Math.floor(A*4)-.5),Q=(1-yt(.47,.5,X>j?X:j))*.55,st=.72+Z*.55+$i(P*12,A*12,12,12,s+1)*.3-Q;let k=x[0]*st,Y=x[1]*st,nt=x[2]*st;D>0&&(k=Qe(k,S[0],D),Y=Qe(Y,S[1],D),nt=Qe(nt,S[2],D)),p[H]=k,p[H+1]=Y,p[H+2]=nt,p[H+3]=255,Vn(o,P,A);const rt=Ht(_),ht=Ot(D+rt*rt*.55);v[H]=a[0]*ht,v[H+1]=a[1]*ht,v[H+2]=a[2]*ht,v[H+3]=255}}return{map:rn(sn(i,p),!0),emissiveMap:rn(sn(i,v))}}const Ss=Ne("#221c2c"),Na=Ne("#3b3348"),Fa=Ne("#8f6f45"),Oa=Ne("#120e18");function Hx({size:i=1024,seed:t=23}={}){return Zs("regolith",{size:i,seed:t},()=>Gx(i,t))}function Gx(i,t){const e=Math.max(32,i>>3),n=i>>1,s=(t|0)*977+83,r=Gt(e),a=Gt(e),o=Gt(e),c=Gt(e);for(let p=0;p<e;p++){const v=p/e;for(let x=0;x<e;x++){const S=x/e,w=p*e+x;r[w]=ze(S*3,v*3,3,3,3,s+11)-.5,a[w]=ze(S*3+2.7,v*3+8.1,3,3,3,s+12)-.5,o[w]=ze(S*7,v*7,7,7,3,s+3),c[w]=ze(S*5,v*12,5,12,3,s+4)}}const l=Gt(n),h=Gt(n),u=Gt(n),d=Gt(n),f=Gt(n);for(let p=0;p<n;p++){const v=p/n;for(let x=0;x<n;x++){const S=x/n,w=p*n+x;Vn(e,S,v);const T=Ht(r),E=Ht(a),A=Ht(o),M=Ht(c),y=Ki(S*10+T*2,v*10+E*2,10,10,s+1),C=1-yt(0,.09,y.f2-y.f1),U=Ki(S*26+T*3,v*26+E*3,26,26,s+2),H=(1-yt(0,.07,U.f2-U.f1))*.5,P=Ot(A+($i(S*44,v*44,44,44,s+5)-.5)*.4),F=Ot(yt(.44,.72,M)*(.55+P*.75)),B=Ot(.25+P*.85+(y.id-.5)*.3);let N=Ss[0]+(Na[0]-Ss[0])*B,z=Ss[1]+(Na[1]-Ss[1])*B,D=Ss[2]+(Na[2]-Ss[2])*B;const G=F*.62;N+=(Fa[0]-N)*G,z+=(Fa[1]-z)*G,D+=(Fa[2]-D)*G;const q=Ot(C+H)*.85;N+=(Oa[0]-N)*q,z+=(Oa[1]-z)*q,D+=(Oa[2]-D)*q,l[w]=N,h[w]=z,u[w]=D,d[w]=Ot(.58+(P-.5)*.3+F*.12-(C+H)*.5),f[w]=Ot(.93-F*.06+(C+H)*.05)}}const g=new Uint8ClampedArray(i*i*4),_=new Uint8ClampedArray(i*i*4),m=new Float32Array(i*i);for(let p=0;p<i;p++){const v=p/i;for(let x=0;x<i;x++){const S=(p*i+x)*4;Vn(n,x/i,v);const w=ln(x*13+t,p*19+t),T=w>.982?(w-.982)*55:0,E=w<.014?1:0,A=.9+(w-.5)*.22+T*.7-E*.35;g[S]=Ht(l)*A+T*70,g[S+1]=Ht(h)*A+T*62,g[S+2]=Ht(u)*A+T*52,g[S+3]=255;const M=Ot(Ht(f)+(w-.5)*.08-T*.3)*255;_[S]=M,_[S+1]=M,_[S+2]=M,_[S+3]=255,m[p*i+x]=Ot(Ht(d)+(w-.5)*.07+T*.2-E*.1)}}return{map:rn(sn(i,g),!0),normalMap:Ks(i,m,2),roughnessMap:rn(sn(i,_))}}const Jv=Object.freeze(Object.defineProperty({__proto__:null,disposeTextureSet:Ux,heightToNormal:Dx,makeCanvasCloth:dr,makeEmissivePanel:rd,makeGoblinSkin:sd,makeLeather:As,makeMetal:fr,makeRegolith:Hx},Symbol.toStringTag,{value:"Module"})),Ba=(i,t,e)=>i+(t-i)*e,za=i=>i<0?0:i>1?1:i;function Wx(i,t){if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++)if(t<=i[e][0]){const[n,s]=i[e-1],[r,a]=i[e],o=(t-n)/(r-n||1);return[Ba(s[0],a[0],o),Ba(s[1],a[1],o),Ba(s[2],a[2],o)]}return i[i.length-1][1]}const Xx=[[0,[10,8,24]],[.34,[26,16,46]],[.47,[74,34,58]],[.5,[126,62,62]],[.56,[96,52,44]],[.72,[48,28,26]],[1,[26,16,14]]];function ka(i,t,e,n,s,r=2){let a=Math.abs(i-e);a>.5&&(a=1-a);const o=t-n,c=Math.sqrt((a/s)**2+(o/s)**2);return Math.exp(-(c**r))}function Qv(i){const n=document.createElement("canvas");n.width=512,n.height=256;const s=n.getContext("2d"),r=s.createImageData(512,256),a=r.data;for(let h=0;h<256;h++){const u=h/255,d=Wx(Xx,u);for(let f=0;f<512;f++){const g=f/511;let _=d[0],m=d[1],p=d[2];const v=ka(g,u,.18,.48,.16,2.2);_+=v*210,m+=v*128,p+=v*54;const x=ka(g,u,.66,.3,.045,2);_+=x*250,m+=x*232,p+=x*205;const S=ka(g,u,.85,.12,.3,1.6);_+=S*26,m+=S*40,p+=S*62;const w=(h*512+f)*4;a[w]=za(_/255)*255,a[w+1]=za(m/255)*255,a[w+2]=za(p/255)*255,a[w+3]=255}}s.putImageData(r,0,0);const o=new zu(n);o.mapping=Mo,o.colorSpace=Oe;const c=new rc(i);c.compileEquirectangularShader();const l=c.fromEquirectangular(o);return o.dispose(),c.dispose(),l.texture}const qx=[{name:"root",parent:null,pos:[0,0,0]},{name:"hips",parent:"root",pos:[0,.6,0]},{name:"spine01",parent:"hips",pos:[0,.105,.008]},{name:"spine02",parent:"spine01",pos:[0,.105,.014]},{name:"chest",parent:"spine02",pos:[0,.115,-.004]},{name:"neck",parent:"chest",pos:[0,.085,-.012]},{name:"head",parent:"neck",pos:[0,.075,.03]},{name:"headTop",parent:"head",pos:[0,.125,-.01]},{name:"jaw",parent:"head",pos:[0,-.022,.028]},{name:"jawTip",parent:"jaw",pos:[0,-.03,.07]},{name:"browC",parent:"head",pos:[0,.055,.06]},{name:"earL0",parent:"head",pos:[.058,.032,-.014],mirror:!0},{name:"earL1",parent:"earL0",pos:[.05,.038,-.052],mirror:!0},{name:"earL2",parent:"earL1",pos:[.04,.016,-.056],mirror:!0},{name:"earL3",parent:"earL2",pos:[.026,-.012,-.046],mirror:!0},{name:"tail0",parent:"hips",pos:[0,-.012,-.085]},{name:"tail1",parent:"tail0",pos:[0,.01,-.095]},{name:"tail2",parent:"tail1",pos:[0,.004,-.09]},{name:"tail3",parent:"tail2",pos:[0,-.008,-.082]},{name:"tail4",parent:"tail3",pos:[0,-.02,-.07]},{name:"clavicleL",parent:"chest",pos:[.032,.055,.004],mirror:!0},{name:"upperarmL",parent:"clavicleL",pos:[.075,.008,-.006],mirror:!0},{name:"forearmL",parent:"upperarmL",pos:[.225,-.006,0],mirror:!0},{name:"handL",parent:"forearmL",pos:[.2,0,.004],mirror:!0},{name:"thumbL0",parent:"handL",pos:[.036,-.012,.036],mirror:!0},{name:"thumbL1",parent:"thumbL0",pos:[.034,-.006,.026],mirror:!0},{name:"thumbL2",parent:"thumbL1",pos:[.028,-.004,.014],mirror:!0},{name:"indexL0",parent:"handL",pos:[.078,.006,.03],mirror:!0},{name:"indexL1",parent:"indexL0",pos:[.052,-.002,.004],mirror:!0},{name:"indexL2",parent:"indexL1",pos:[.04,-.002,.001],mirror:!0},{name:"midL0",parent:"handL",pos:[.082,.005,-.002],mirror:!0},{name:"midL1",parent:"midL0",pos:[.058,-.002,0],mirror:!0},{name:"midL2",parent:"midL1",pos:[.044,-.002,0],mirror:!0},{name:"ringL0",parent:"handL",pos:[.072,.002,-.032],mirror:!0},{name:"ringL1",parent:"ringL0",pos:[.048,-.002,-.006],mirror:!0},{name:"ringL2",parent:"ringL1",pos:[.034,-.002,-.002],mirror:!0},{name:"thighL",parent:"hips",pos:[.082,-.028,.004],mirror:!0},{name:"shinL",parent:"thighL",pos:[0,-.245,.012],mirror:!0},{name:"footL",parent:"shinL",pos:[0,-.235,-.026],mirror:!0},{name:"toeL",parent:"footL",pos:[0,-.055,.1],mirror:!0},{name:"toeTipL",parent:"toeL",pos:[0,-.008,.055],mirror:!0},{name:"heelL",parent:"footL",pos:[0,-.052,-.055],mirror:!0}],Zi=(()=>{const i=[];for(const t of qx)i.push({name:t.name,parent:t.parent,pos:t.pos}),t.mirror&&i.push({name:t.name.replace(/L(\d*)$/,"R$1"),parent:t.parent&&/L\d*$/.test(t.parent)?t.parent.replace(/L(\d*)$/,"R$1"):t.parent,pos:[-t.pos[0],t.pos[1],t.pos[2]]});return i})(),Yx=Zi.map(i=>i.name);function od(){const i={},t=[];for(const s of Zi){const r=new Ou;r.name=s.name,r.position.set(...s.pos),i[s.name]=r,t.push(r),s.parent&&i[s.parent].add(r)}const e=i.root;e.updateMatrixWorld(!0);const n=new Sc(t);return{root:e,bones:t,byName:i,skeleton:n}}function Js(){const i={};for(const t of Zi){const e=new b(...t.pos);t.parent&&e.add(i[t.parent]),i[t.name]=e}return i}const jx=(()=>{const i={};for(const t of Zi)i[t.name]=[];for(const t of Zi)t.parent&&i[t.parent].push(t.name);return i})(),$x=Object.fromEntries(Zi.map(i=>[i.name,i.parent]));function Kx(i=Js()){const t={};for(const e of Zi){const n=i[e.name],s=jx[e.name];let r;if(s.length){r=new b;for(const a of s)r.add(i[a]);r.divideScalar(s.length)}else{const a=$x[e.name],o=a?new b().subVectors(n,i[a]).normalize():new b(0,1,0);r=new b().copy(n).addScaledVector(o,.03)}t[e.name]={a:n.clone(),b:r}}return t}const Zx=(i,t)=>i.map(e=>e+t),_e={torso:["hips","spine01","spine02","chest","neck","clavicleL","clavicleR","thighL","thighR"],head:["head","headTop","neck","jaw","jawTip","browC"],jaw:["jaw","jawTip","head"],earL:["earL0","earL1","earL2","earL3","head"],earR:["earR0","earR1","earR2","earR3","head"],tail:["tail0","tail1","tail2","tail3","tail4","hips"],armL:["clavicleL","upperarmL","forearmL","handL","chest"],armR:["clavicleR","upperarmR","forearmR","handR","chest"],handL:["handL","forearmL",...Zx(["thumbL0","thumbL1","thumbL2","indexL0","indexL1","indexL2","midL0","midL1","midL2","ringL0","ringL1","ringL2"],"")],handR:["handR","forearmR","thumbR0","thumbR1","thumbR2","indexR0","indexR1","indexR2","midR0","midR1","midR2","ringR0","ringR1","ringR2"],legL:["hips","thighL","shinL","footL","toeL","toeTipL","heelL"],legR:["hips","thighR","shinR","footR","toeR","toeTipR","heelR"]};_e.body=[..._e.torso,..._e.head,..._e.armL,..._e.armR,..._e.legL,..._e.legR,..._e.handL,..._e.handR,..._e.tail].filter((i,t,e)=>e.indexOf(i)===t);function hc(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new de;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(e){let h=0;const u=[];for(let d=0;d<i.length;++d){const f=i[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=kh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let _=0;_<a[h].length;++_)f.push(a[h][_][d]);const g=kh(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function kh(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.array.length}const a=new t(r);let o=0;for(let l=0;l<i.length;++l)a.set(i[l].array,o),o+=i[l].array.length;const c=new re(a,e,n);return s!==void 0&&(c.gpuType=s),c}const ue=new b,Rs=new b,Es=new b,Jx=new ie;function fn(i,t,e=12,{squash:n=0,bulge:s=0,bulgeAngle:r=0}={}){const a=[];for(let o=0;o<e;o++){const c=o/e*Math.PI*2,l=Math.cos(c),h=Math.sin(c);let u=l*i,d=h*t;if(n&&(d*=1-n*Ot(-h)),s){const f=Math.cos(c-r),g=1+s*Math.max(0,f)**2;u*=g,d*=g}a.push(new ot(u,d))}return a}function _i(i,t,e=.3,n=16){const s=[],r=i/2,a=t/2;for(let o=0;o<n;o++){const c=o/n*Math.PI*2,l=2/(1-e*.85+1e-6),h=Math.cos(c),u=Math.sin(c),d=Math.sign(h)*Math.abs(h)**(2/l)*r,f=Math.sign(u)*Math.abs(u)**(2/l)*a;s.push(new ot(d,f))}return s}function Qx(i,t=new b(0,0,1)){const e=i.length,n=[];for(let o=0;o<e;o++){const c=i[Math.max(0,o-1)],l=i[Math.min(e-1,o+1)],h=new b().subVectors(l,c);h.lengthSq()<1e-12&&h.set(0,1,0),n.push(h.normalize())}const s=[],r=[];let a=new b().copy(t);Math.abs(a.dot(n[0]))>.99&&a.set(1,0,0),a.addScaledVector(n[0],-a.dot(n[0])).normalize();for(let o=0;o<e;o++){if(o>0){ue.crossVectors(n[o-1],n[o]);const c=ue.length();if(c>1e-8){ue.divideScalar(c);const l=Math.acos(dn.clamp(n[o-1].dot(n[o]),-1,1));a.applyQuaternion(Jx.setFromAxisAngle(ue,l))}a.addScaledVector(n[o],-a.dot(n[o])).normalize()}s.push(a.clone()),r.push(new b().crossVectors(n[o],a).normalize())}return{tangents:n,normals:s,binormals:r}}function fe({path:i,profile:t,capStart:e=!0,capEnd:n=!0,twist:s=0,uvScale:r=[1,1],uvOffset:a=[0,0],upHint:o}){const c=i.length,{normals:l,binormals:h}=Qx(i,o),u=t(0,0),d=u.length,f=[0];for(let A=1;A<c;A++)f.push(f[A-1]+i[A].distanceTo(i[A-1]));const g=f[c-1]||1,_=c*(d+1)+(e?d+2:0)+(n?d+2:0),m=new Float32Array(_*3),p=new Float32Array(_*2),v=[];let x=0,S=0;const w=(A,M,y,C,U)=>{m[x++]=A,m[x++]=M,m[x++]=y,p[S++]=C*r[0]+a[0],p[S++]=U*r[1]+a[1]};for(let A=0;A<c;A++){const M=c===1?0:A/(c-1),y=A===0?u:t(M,A),C=l[A],U=h[A],H=s*M,P=Math.cos(H),F=Math.sin(H),B=f[A]/g;for(let N=0;N<=d;N++){const z=y[N%d],D=z.x*P-z.y*F,G=z.x*F+z.y*P;w(i[A].x+C.x*D+U.x*G,i[A].y+C.y*D+U.y*G,i[A].z+C.z*D+U.z*G,N/d,B)}}for(let A=0;A<c-1;A++){const M=A*(d+1),y=(A+1)*(d+1);for(let C=0;C<d;C++)v.push(M+C,M+C+1,y+C),v.push(M+C+1,y+C+1,y+C)}const T=(A,M)=>{const y=c===1?0:A/(c-1),C=t(y,A),U=l[A],H=h[A],P=s*y,F=Math.cos(P),B=Math.sin(P),N=x/3;w(i[A].x,i[A].y,i[A].z,.5,.5);const z=x/3;for(let D=0;D<=d;D++){const G=C[D%d],q=G.x*F-G.y*B,Z=G.x*B+G.y*F;w(i[A].x+U.x*q+H.x*Z,i[A].y+U.y*q+H.y*Z,i[A].z+U.z*q+H.z*Z,.5+Math.cos(D/d*Math.PI*2)*.5,.5+Math.sin(D/d*Math.PI*2)*.5)}for(let D=0;D<d;D++)M?v.push(N,z+D+1,z+D):v.push(N,z+D,z+D+1)};e&&T(0,!1),n&&T(c-1,!0);const E=new de;return E.setAttribute("position",new re(m.subarray(0,x),3)),E.setAttribute("uv",new re(p.subarray(0,S),2)),E.setIndex(v),E.computeVertexNormals(),E}function t1(i,t,e=12,n={}){const s=typeof t=="function"?t:()=>t;return fe({path:i,profile:r=>{const a=s(r),o=Array.isArray(a)?a[0]:a,c=Array.isArray(a)?a[1]:a;return fn(o,c,e,n.shape||{})},...n})}function Se(i,t=24,e=.5){return new sx(i,!1,"catmullrom",e).getSpacedPoints(t-1)}function ge(i,t,e,n=.02,s=4){const r=new Xs(1,1,1,s,s,s),a=r.attributes.position,o=new b(i/2-n,t/2-n,e/2-n);o.x=Math.max(o.x,1e-4),o.y=Math.max(o.y,1e-4),o.z=Math.max(o.z,1e-4);for(let c=0;c<a.count;c++){ue.fromBufferAttribute(a,c).multiply(new b(i,t,e)),Rs.set(dn.clamp(ue.x,-o.x,o.x),dn.clamp(ue.y,-o.y,o.y),dn.clamp(ue.z,-o.z,o.z)),Es.subVectors(ue,Rs);const l=Es.length();l>1e-8&&Es.multiplyScalar(n/l),a.setXYZ(c,Rs.x+Es.x,Rs.y+Es.y,Rs.z+Es.z)}return r.computeVertexNormals(),r}function hn(i,t=16,e=Math.PI*2){return new Tc(i,t,0,e)}function ni({length:i=.12,radius:t=.022,curl:e=1.6,curlAxis:n=new b(1,0,0),taper:s=1.4,rings:r=14,radialSegments:a=8,twistRibs:o=0}){const c=[],l=new b(0,1,0),h=new b,u=n.clone().normalize(),d=i/(r-1);for(let f=0;f<r;f++)c.push(h.clone()),l.applyAxisAngle(u,e/(r-1)),h.addScaledVector(l,d);return fe({path:c,profile:f=>{const g=t*(1-f)**s,_=fn(g,g*.92,a);if(o)for(let m=0;m<_.length;m++){const p=1+Math.sin(f*o*Math.PI*2)*.06*(1-f);_[m].multiplyScalar(p)}return _},capStart:!0,capEnd:!1})}function e1(i,{rows:t=8,cols:e=8,thickness:n=.004}={}){const s=typeof n=="function"?n:()=>n,r=[],a=[],o=[],c=.001,l=i(.5,.5),h=i(.5+c,.5),u=i(.5,.5+c),d=ue.subVectors(h.p,l.p).cross(Rs.subVectors(u.p,l.p)).dot(l.n)<0,f=(v,x,S)=>(r.push(v.x,v.y,v.z),a.push(x,S),r.length/3-1),g=[],_=[];for(let v=0;v<=t;v++){const x=v/t;g.push([]),_.push([]);for(let S=0;S<=e;S++){const w=S/e,{p:T,n:E}=i(w,x),A=s(w,x)/2;g[v].push(f(T.clone().addScaledVector(E,A),w,x)),_[v].push(f(T.clone().addScaledVector(E,-A),w,x))}}for(let v=0;v<t;v++)for(let x=0;x<e;x++){const S=g[v][x],w=g[v][x+1],T=g[v+1][x],E=g[v+1][x+1],A=_[v][x],M=_[v][x+1],y=_[v+1][x],C=_[v+1][x+1];d?o.push(S,T,w,w,T,E,A,M,y,M,C,y):o.push(S,w,T,w,E,T,A,y,M,M,y,C)}const m=(v,x,S,w)=>{d?o.push(v,S,x,x,S,w):o.push(v,x,S,x,w,S)};for(let v=0;v<e;v++)m(g[0][v+1],g[0][v],_[0][v+1],_[0][v]),m(g[t][v],g[t][v+1],_[t][v],_[t][v+1]);for(let v=0;v<t;v++)m(g[v][0],g[v+1][0],_[v][0],_[v+1][0]),m(g[v+1][e],g[v][e],_[v+1][e],_[v][e]);const p=new de;return p.setAttribute("position",new re(new Float32Array(r),3)),p.setAttribute("uv",new re(new Float32Array(a),2)),p.setIndex(o),p.computeVertexNormals(),p}function pe(i,{amp:t=.004,freq:e=9,seed:n=1,mask:s=null}={}){i.computeVertexNormals();const r=i.attributes.position,a=i.attributes.normal,o=n*13.37;for(let c=0;c<r.count;c++){ue.fromBufferAttribute(r,c);const l=nn(ue.x*e+o,ue.y*e+o,ue.z*e+o)-.5,h=s?s(ue,c):1,u=l*t*2*h;r.setXYZ(c,ue.x+a.getX(c)*u,ue.y+a.getY(c)*u,ue.z+a.getZ(c)*u)}return i.computeVertexNormals(),i}function Vh(i,{axis:t="y",from:e=0,amp:n=.02,freq:s=22,seed:r=3}={}){const a=i.attributes.position,c=pn(r)()*100;for(let l=0;l<a.count;l++){ue.fromBufferAttribute(a,l);const h=Math.abs(ue[t]-e),u=yt(.06,0,h);if(u<=0)continue;const d=Math.sin((ue.x+ue.z)*s+c)*.5+nn(ue.x*s,c,ue.z*s)-.5;ue[t]+=d*n*u,a.setXYZ(l,ue.x,ue.y,ue.z)}return i.computeVertexNormals(),i}function vt(i,{pos:t,rot:e,scale:n,quat:s}={}){const r=new qt,a=s||new ie;return e&&!s&&a.setFromEuler(e instanceof Si?e:new Si(...e)),r.compose(t?t.isVector3?t:new b(...t):new b,a,n?typeof n=="number"?new b(n,n,n):n.isVector3?n:new b(...n):new b(1,1,1)),i.applyMatrix4(r),i}function ad(i){if(!i.index){const e=i.attributes.position.count,n=e>65535?new Uint32Array(e):new Uint16Array(e);for(let s=0;s<e;s++)n[s]=s;i.setIndex(new re(n,1))}if(i.attributes.normal||i.computeVertexNormals(),!i.attributes.uv){const e=i.attributes.position.count,n=new Float32Array(e*2),s=i.attributes.position;for(let r=0;r<e;r++)n[r*2]=s.getX(r)*4+.5,n[r*2+1]=s.getY(r)*4+.5;i.setAttribute("uv",new re(n,2))}const t=["position","normal","uv"];for(const e of Object.keys(i.attributes))t.includes(e)||i.deleteAttribute(e);return i.morphAttributes={},i}function me(i,t=!1){const e=i.filter(Boolean).map(n=>ad(n));return e.length===0?null:e.length===1&&!t?e[0]:hc(e,t)}function n1(i){return i.attributes.position.needsUpdate=!0,i.computeVertexNormals(),i.computeBoundingSphere(),i}const i1=Js(),Me=i=>i1[i].clone();function kn(i){return t=>{if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++)if(t<=i[e][0]){const[n,s]=i[e-1],[r,a]=i[e],o=yt(n,r,t);return s+(a-s)*o}return i[i.length-1][1]}}function Ic(i,t=20,e={}){const n=i.map(s=>s instanceof b?s.clone():Me(s));return e.prepend&&n.unshift(e.prepend),e.append&&n.push(e.append),Se(n,t,e.tension??.5)}function s1(i,t,{frontBias:e=0,ridge:n=0,flatten:s=0,segments:r=24}={}){const a=[];for(let o=0;o<r;o++){const c=o/r*Math.PI*2,l=Math.cos(c),h=Math.sin(c);let u=l*i,d=h*t;s&&l<0&&(u*=1-s*(-l)**1.5),n&&(u-=n*Math.exp(-((h/.32)**2))*(l<0?1:0)),a.push(new ot(u+e,d))}return a}const Oi=(()=>{const i=Ic([new b(0,.5,-.005),"hips","spine01","spine02","chest","neck"],30),t=kn([[0,.055],[.12,.086],[.3,.098],[.46,.084],[.62,.098],[.78,.093],[.92,.062],[1,.042]]),e=kn([[0,.07],[.12,.104],[.3,.108],[.46,.096],[.62,.128],[.8,.142],[.92,.07],[1,.046]]),n=kn([[.1,0],[.32,.022],[.55,.004],[1,-.004]]),s=kn([[.05,.004],[.4,.012],[.75,.016],[1,.006]]),r=i.map(o=>o.y);return{path:i,depth:t,width:e,belly:n,ridge:s,tAtY:o=>{if(o<=r[0])return 0;for(let c=1;c<r.length;c++)if(o<=r[c])return(c-1+(o-r[c-1])/(r[c]-r[c-1]||1))/(r.length-1);return 1}}})();function r1(){const{path:i,depth:t,width:e,belly:n,ridge:s}=Oi,r=fe({path:i,profile:a=>s1(t(a),e(a),{frontBias:n(a),ridge:s(a),flatten:.22*yt(.35,.8,a)}),uvScale:[1.6,2.2]});return pe(r,{amp:.006,freq:26,seed:4,mask:a=>.35+.65*yt(.66,.9,a.y)*(a.z<0?.7:1)}),r}function o1(){const i=[];for(const e of[1,-1]){const n=Me(e>0?"upperarmL":"upperarmR");i.push(vt(new Ei(.062,18,14),{pos:n.clone().add(new b(-.012*e,.004,-.004)),scale:[1,.95,1.05]}));const s=Me(e>0?"thighL":"thighR");i.push(vt(new Ei(.062,16,12),{pos:s.clone().add(new b(.004*e,.012,0)),scale:[1,1.1,1]}))}const t=me(i);return pe(t,{amp:.003,freq:30,seed:9}),t}function cd(i,t){const e=new Cc(1,i),n=e.attributes.position,s=new b,r=new b;for(let o=0;o<n.count;o++)s.fromBufferAttribute(n,o).normalize(),t(s,r),n.setXYZ(o,r.x,r.y,r.z);const a=new Float32Array(n.count*2);for(let o=0;o<n.count;o++)s.fromBufferAttribute(n,o).normalize(),a[o*2]=Math.atan2(s.x,s.z)/(Math.PI*2)+.5,a[o*2+1]=Math.asin(dn.clamp(s.y,-1,1))/Math.PI+.5;for(let o=0;o<n.count;o+=3){const c=a[o*2],l=a[(o+1)*2],h=a[(o+2)*2],u=Math.min(c,l,h);if(Math.max(c,l,h)-u>.5)for(let f=0;f<3;f++){const g=(o+f)*2;a[g]<.5&&(a[g]+=1)}}return e.setAttribute("uv",new re(a,2)),e.computeVertexNormals(),e}const a1=(i,t,e)=>{const n=Ot(.5+.5*(t-i)/e);return t*(1-n)+i*n-e*n*(1-n)};function c1(){const i=Me("head");return cd(4,(e,n)=>{const{x:s,y:r,z:a}=e;let o=.082;o+=.028*yt(.1,1,r),o+=.016*yt(.2,1,-a)*yt(-.4,.6,r),o-=.014*yt(.3,1,Math.abs(s))*yt(.1,1,r);const c=Math.exp(-(((r-.22)/.16)**2)-((Math.abs(s)-.34)/.34)**2)*yt(.1,.6,a);o+=.022*c;const l=Math.exp(-(((r+.06)/.3)**2)-(s/.3)**2)*yt(.25,1,a);o+=.05*l;const h=Math.exp(-(((r+.02)/.12)**2)-(s/.14)**2)*yt(.55,1,a);o+=.024*h;const u=Math.exp(-(((r+.12)/.16)**2)-((Math.abs(s)-.6)/.3)**2)*yt(0,.9,a);o+=.016*u,o-=.013*Math.exp(-(((r+.36)/.18)**2)-((Math.abs(s)-.55)/.26)**2)*yt(.1,1,a);for(const d of[1,-1]){const f=s-d*.42,g=r-.06,_=a-.78,m=f*f+g*g+_*_;o=a1(o,o-.03*Math.exp(-m/.05),.012)}o*=1-.28*yt(-.45,-.95,r),o+=(Yu(s*9+5,r*9,a*9,3)-.5)*.006,o+=(nn(s*34,r*34,a*34)-.5)*.0025,n.set(s*o,r*o*1.06,a*o).add(i),n.z+=.004})}function l1(){const i=Me("jaw");return cd(3,(e,n)=>{const{x:s,y:r,z:a}=e;let o=.05;o+=.03*yt(0,1,a)*yt(-.9,.2,r),o+=.012*yt(.3,1,Math.abs(s))*yt(-.6,.4,r),o-=.018*yt(.1,1,r),o+=(Yu(s*11+21,r*11,a*11,3)-.5)*.005,n.set(s*o*1.12,r*o*.72,a*o*1.15).add(i),n.y-=.012,n.z+=.012})}function h1(){const i=Me("head"),t=[],e=[];for(const n of[1,-1]){const s=i.clone().add(new b(n*.036,.006,.062));t.push(vt(new Ei(.0175,16,12),{pos:s}));const r=new Ei(.0128,14,10,0,Math.PI*2,0,Math.PI*.42);e.push(vt(r,{pos:s.clone().add(new b(n*.0045,.001,.0085)),rot:[Math.PI/2-.12,0,0]}))}return{sclera:me(t),iris:me(e)}}function u1(){const i=pn(77),t=[],e=[],n=Me("head"),s=Me("jaw"),r=9;for(let a=0;a<r;a++){const o=a/(r-1)*2-1,c=o*.95,l=Math.sin(c)*.036,h=Math.cos(c)*.055,u=Math.exp(-(((Math.abs(o)-.55)/.22)**2)),d=.009+u*.014+i()*.003;if(t.push(vt(new Gs(.0055+u*.002,d,6),{pos:n.clone().add(new b(l,-.038-d/2,h-.004)),rot:[.18+i()*.12-.06,-c*.6,Math.PI+(i()-.5)*.2]})),a%2===0||u>.4){const f=.011+u*.018+i()*.004;e.push(vt(new Gs(.0055+u*.0025,f,6),{pos:s.clone().add(new b(l*.94,-.006+f/2,h*.9+.004)),rot:[-.12+(i()-.5)*.16,-c*.6,(i()-.5)*.2]}))}}return{upper:me(t),lower:me(e)}}function d1(){const i=Me("head"),t=[];for(const e of[1,-1]){const n=ni({length:e>0?.085:.072,radius:.014,curl:1.15,curlAxis:new b(-1,0,.25*e),taper:1.35,twistRibs:5});vt(n,{pos:i.clone().add(new b(e*.05,.075,-.012)),rot:[.35,e*.4,-e*.55]}),t.push(n)}for(const e of[1,-1]){const n=ni({length:.03,radius:.007,curl:.7,taper:1.2});vt(n,{pos:i.clone().add(new b(e*.062,-.036,-.032)),rot:[.6,0,-e*1.1]}),t.push(n)}return me(t)}function Hh(i){const t=i==="L"?1:-1,e=[`ear${i}0`,`ear${i}1`,`ear${i}2`,`ear${i}3`],n=Ic(e,20,{append:Me(`ear${i}3`).clone().add(new b(t*.018,-.012,-.026))}),s=kn([[0,.026],[.22,.049],[.5,.044],[.8,.026],[1,.005]]),r=kn([[0,.011],[.35,.005],[1,.0022]]),a=new b(0,1,0),o=new b,c=new b,l=new b,h=g=>{const _=dn.clamp(g,0,1)*(n.length-1),m=Math.min(n.length-2,Math.floor(_)),p=new b().lerpVectors(n[m],n[m+1],_-m);return o.subVectors(n[m+1],n[m]).normalize(),c.crossVectors(o,a).normalize().multiplyScalar(t),l.crossVectors(c,o).normalize().multiplyScalar(t),p},d=e1((g,_)=>{const m=h(_),p=s(_);let v=(g-.32)*p*1.55;g>.9&&(v-=(.5+.5*Math.sin(_*31+t))*p*.22);const x=Math.sin(dn.clamp(g,0,1)*Math.PI)*.016*(.35+_),S=c.clone();return{p:m.clone().addScaledVector(l,v).addScaledVector(c,x),n:S}},{rows:22,cols:9,thickness:(g,_)=>r(_)*(g>.86?1.7:1)*(g<.12?1.6:1)});pe(d,{amp:.0016,freq:46,seed:i==="L"?12:13});const f=[d];f.push(fe({path:n,profile:g=>fn(r(g)*1.5,r(g)*2.2,8),upHint:new b(0,1,0)}));for(let g=0;g<4;g++){const _=.12+g*.2,m=h(_),p=m.clone().addScaledVector(l,s(_)*.62).addScaledVector(c,.004);f.push(fe({path:Se([m,m.clone().lerp(p,.5),p],7),profile:v=>fn(.0038*(1-v*.75),.0028*(1-v*.75),6)}))}return me(f)}function f1(i){const t=i==="L"?1:-1,e=Me("upperarmL").clone();e.x*=t;const n=Me("forearmL").clone();n.x*=t;const s=Me("handL").clone();s.x*=t;const r=Se([e.clone().add(new b(-.02*t,.01,0)),e.clone().lerp(n,.32).add(new b(0,.006,-.008)),n.clone().add(new b(0,-.004,.006)),n.clone().lerp(s,.42).add(new b(0,.002,-.004)),s],26),a=kn([[0,.056],[.12,.05],[.26,.045],[.44,.037],[.5,.039],[.62,.043],[.8,.033],[1,.022]]),o=fe({path:r,profile:h=>{const u=a(h),d=fn(u*.92,u,14);if(h>.55)for(const f of d)f.y*t<0&&(f.y*=1-.18*yt(.55,.9,h));return d},upHint:new b(0,1,0),uvScale:[1,3],capStart:!0,capEnd:!1});pe(o,{amp:.0035,freq:30,seed:i==="L"?21:22});const c=ni({length:.028,radius:.009,curl:.5,taper:1.1}),l=new b().subVectors(s,e).normalize();return vt(c,{pos:n.clone().addScaledVector(l,-.012).add(new b(0,-.026,-.01)),rot:[1.4,0,t*.4]}),{flesh:o,spur:c}}const p1=["thumb","index","mid","ring"];function m1(i){const t=i==="L"?1:-1,e=l=>new b(l.x*t,l.y,l.z),n=e(Me("handL")),s=[],r=[],a=e(Me("midL0")),o=Se([n.clone().add(new b(-.01*t,0,0)),n.clone().lerp(a,.5),a.clone().add(new b(.012*t,0,0))],10),c=fe({path:o,profile:l=>{const h=.03+.026*yt(0,.8,l),u=.019-.005*l,d=fn(u,h,14);for(const f of d)f.x<0&&(f.x*=.72);return d},upHint:new b(0,1,0),capEnd:!1});pe(c,{amp:.0022,freq:44,seed:31}),s.push(c);for(const l of p1){const h=[0,1,2].map(x=>e(Me(`${l}L${x}`))),u=new b().subVectors(h[2],h[1]).normalize(),d=h[2].clone().addScaledVector(u,l==="thumb"?.022:.028),f=Se([h[0].clone().lerp(n,.25),...h,d],18),g=l==="thumb"?.0155:l==="mid"?.0145:.0132,_=kn([[0,g*1.15],[.2,g],[.34,g*1.12],[.5,g*.88],[.62,g*.98],[.8,g*.74],[1,g*.4]]),m=fe({path:f,profile:x=>fn(_(x)*.92,_(x),10),upHint:new b(0,1,0),uvScale:[1,2],capEnd:!1});pe(m,{amp:.0016,freq:60,seed:41}),s.push(m);const p=ni({length:l==="thumb"?.03:.034,radius:.0072,curl:1.5,curlAxis:new b(0,0,-t),taper:1.5,rings:10,radialSegments:7}),v=new ie().setFromUnitVectors(new b(0,1,0),u);vt(p,{pos:d.clone().addScaledVector(u,-.008),quat:v}),r.push({geo:p,bone:`${l}${i}2`})}return{flesh:me(s),claws:r}}function g1(i){const t=i==="L"?1:-1,e=l=>new b(l.x*t,l.y,l.z),n=e(Me("thighL")),s=e(Me("shinL")),r=e(Me("footL")),a=Se([n.clone().add(new b(0,.03,0)),n.clone().lerp(s,.4).add(new b(0,0,.006)),s.clone().add(new b(0,0,-.004)),s.clone().lerp(r,.35).add(new b(0,0,-.012)),r.clone().add(new b(0,.01,.004))],26),o=kn([[0,.062],[.16,.058],[.34,.046],[.46,.041],[.54,.045],[.66,.04],[.84,.026],[1,.019]]),c=fe({path:a,profile:l=>{const h=o(l),u=fn(h,h*.94,14),d=Math.exp(-(((l-.6)/.12)**2))*.012;if(d>5e-4)for(const f of u)f.x<0&&(f.x-=d*(-f.x/h));return u},upHint:new b(0,0,1),uvScale:[1,3],capEnd:!1});return pe(c,{amp:.0035,freq:26,seed:i==="L"?51:52}),c}function _1(i){const t=i==="L"?1:-1,e=u=>new b(u.x*t,u.y,u.z),n=e(Me("footL")),s=e(Me("toeL")),r=e(Me("heelL")),a=[],o=[],c=fe({path:Se([n.clone().add(new b(0,.012,-.006)),n.clone().lerp(s,.55),s],12),profile:u=>{const d=.024+.016*u,f=.026-.008*u;return fn(f,d,12)},upHint:new b(0,0,1),capEnd:!1});a.push(c),a.push(fe({path:Se([n.clone().add(new b(0,-.004,-.004)),r.clone().lerp(n,.3),r],10),profile:u=>fn(.021*(1-u*.55),.019*(1-u*.5),10),upHint:new b(0,1,0)}));const l=[{off:[.026,0,.055],len:.052,r:.013,bone:`toe${i}`},{off:[0,0,.062],len:.058,r:.014,bone:`toe${i}`},{off:[-.026,0,.05],len:.048,r:.012,bone:`toe${i}`}];for(const u of l){const d=s.clone(),f=s.clone().add(new b(u.off[0]*t,-.004,u.off[2])),g=new b().subVectors(f,d).normalize(),_=f.clone().addScaledVector(g,u.len*.55);a.push(fe({path:Se([d,f,_],10),profile:v=>fn(u.r*(1-v*.45),u.r*(1-v*.4),9),upHint:new b(0,1,0),capEnd:!1}));const m=ni({length:.03,radius:.0075,curl:1.2,curlAxis:new b(-t,0,0),taper:1.5,rings:10,radialSegments:7}),p=new ie().setFromUnitVectors(new b(0,1,0),g);vt(m,{pos:_.clone().addScaledVector(g,-.006),quat:p}),o.push({geo:m,bone:u.bone})}const h=me(a);return pe(h,{amp:.002,freq:38,seed:i==="L"?61:62}),{flesh:h,claws:o}}function x1(){const i=["tail0","tail1","tail2","tail3","tail4"],t=Me("tail4").clone().add(new b(0,-.03,-.06)),e=Ic([Me("hips").clone().add(new b(0,-.02,-.03)),...i,t],26),n=kn([[0,.05],[.15,.038],[.45,.026],[.75,.015],[1,.005]]),s=fe({path:e,profile:a=>fn(n(a)*1.05,n(a)*.9,12),upHint:new b(0,1,0),uvScale:[1,4],capEnd:!0});pe(s,{amp:.0025,freq:34,seed:71});const r=[];for(let a=0;a<7;a++){const o=.16+a*.11,c=Math.round(o*(e.length-1)),l=e[c],h=e[Math.min(e.length-1,c+1)],u=new b().subVectors(h,l).normalize(),d=1-a*.11,f=ni({length:.026*d,radius:.009*d,curl:.6,taper:1.2,rings:7,radialSegments:6}),g=new ie().setFromUnitVectors(new b(0,1,0),new b(0,.85,0).addScaledVector(u,.5).normalize());vt(f,{pos:l.clone().add(new b(0,n(o)*.85,0)),quat:g}),r.push(f)}return{flesh:s,plates:me(r)}}function v1(){const i=[],t=(r,a,o,c={})=>{r&&i.push({geometry:r,material:a,bones:o,...c})};t(r1(),"skin",_e.torso.concat(["spine01","spine02"]),{smoothRadius:.045,falloff:3.4}),t(o1(),"skin",[..._e.torso,"upperarmL","upperarmR","thighL","thighR"],{smoothRadius:.04}),t(c1(),"skin",_e.head,{falloff:5,smooth:1}),t(l1(),"skin",["jaw","jawTip"],{falloff:5,smooth:1});const e=h1();t(e.sclera,"eye",null,{rigid:"head"}),t(e.iris,"iris",null,{rigid:"head"});const n=u1();t(n.upper,"bone",null,{rigid:"head"}),t(n.lower,"bone",null,{rigid:"jaw"}),t(d1(),"bone",null,{rigid:"head"}),t(Hh("L"),"skin",_e.earL,{falloff:3,smoothRadius:.035}),t(Hh("R"),"skin",_e.earR,{falloff:3,smoothRadius:.035});for(const r of["L","R"]){const a=f1(r);t(a.flesh,"skin",_e[`arm${r}`],{smoothRadius:.038,falloff:3.6}),t(a.spur,"bone",null,{rigid:`forearm${r}`});const o=m1(r);t(o.flesh,"skin",_e[`hand${r}`],{smoothRadius:.016,falloff:4.2});for(const l of o.claws)t(l.geo,"bone",null,{rigid:l.bone});t(g1(r),"skin",_e[`leg${r}`],{smoothRadius:.042,falloff:3.6});const c=_1(r);t(c.flesh,"skin",_e[`leg${r}`],{smoothRadius:.022,falloff:4.2});for(const l of c.claws)t(l.geo,"bone",null,{rigid:l.bone})}const s=x1();return t(s.flesh,"skin",_e.tail,{smoothRadius:.035,falloff:3.4}),t(s.plates,"bone",_e.tail,{falloff:5,smooth:0}),i}const ld=Js(),Te=i=>ld[i].clone(),on=(i,t)=>t.clone().sub(ld[i]);function ve(i,t,e=0){const n=Oi.tAtY(i),s=Oi.depth(n)+e,r=Oi.width(n)+e,a=Oi.belly(n),o=new b(Math.sin(t)*r,i,Math.cos(t)*s+a),c=Math.round(n*(Oi.path.length-1));o.z+=Oi.path[c].z;const l=new b(Math.sin(t)/r,0,Math.cos(t)/s).normalize();return{p:o,n:l}}function Vi(i,t,e,n,s=0){const r=t+s,a=new b(Math.sin(n)*Math.sin(e),Math.cos(n),Math.sin(n)*Math.cos(e));return{p:a.clone().multiplyScalar(r).add(i),n:a}}function wi(i,{rows:t=8,cols:e=10,thickness:n=.008,inset:s=null}={}){const r=[],a=[],o=[],c=n/2,l=.001,h=i(.5,.5),u=i(.5+l,.5),d=i(.5,.5+l),f=new b().subVectors(u.p,h.p).cross(new b().subVectors(d.p,h.p)).dot(h.n)<0,g=(x,S,w)=>(r.push(x.x,x.y,x.z),a.push(S,w),r.length/3-1),_=[],m=[];for(let x=0;x<=t;x++){const S=x/t;_.push([]),m.push([]);for(let w=0;w<=e;w++){const T=w/e,{p:E,n:A}=i(T,S),M=s?s(T,S):0,y=E.clone().addScaledVector(A,c-M*n*.5),C=E.clone().addScaledVector(A,-c+M*n*.5);_[x].push(g(y,T,S)),m[x].push(g(C,T,S))}}for(let x=0;x<t;x++)for(let S=0;S<e;S++){const w=_[x][S],T=_[x][S+1],E=_[x+1][S],A=_[x+1][S+1],M=m[x][S],y=m[x][S+1],C=m[x+1][S],U=m[x+1][S+1];f?(o.push(w,E,T,T,E,A),o.push(M,y,C,y,U,C)):(o.push(w,T,E,T,A,E),o.push(M,C,y,y,C,U))}const p=(x,S,w,T)=>{const E=new b(r[x*3],r[x*3+1],r[x*3+2]),A=new b(r[S*3],r[S*3+1],r[S*3+2]),M=new b(r[w*3],r[w*3+1],r[w*3+2]),y=new b(r[T*3],r[T*3+1],r[T*3+2]),C=g(E,0,0),U=g(A,1,0),H=g(M,0,1),P=g(y,1,1);f?o.push(C,H,U,U,H,P):o.push(C,U,H,U,P,H)};for(let x=0;x<e;x++)p(_[0][x+1],_[0][x],m[0][x+1],m[0][x]),p(_[t][x],_[t][x+1],m[t][x],m[t][x+1]);for(let x=0;x<t;x++)p(_[x][0],_[x+1][0],m[x][0],m[x+1][0]),p(_[x+1][e],_[x][e],m[x+1][e],m[x][e]);const v=new de;return v.setAttribute("position",new re(new Float32Array(r),3)),v.setAttribute("uv",new re(new Float32Array(a),2)),v.setIndex(o),v.computeVertexNormals(),v}function uc(i,t,e=.006){const n=hn([new ot(0,e*.75),new ot(e*.6,e*.62),new ot(e,e*.25),new ot(e*.95,0),new ot(0,0)],8),s=new ie().setFromUnitVectors(new b(0,1,0),t);return vt(n,{pos:i.clone().addScaledVector(t,-e*.15),quat:s})}function br(i,t=.026,e=.006,n=26,s=0){return fe({path:Se(i,n),profile:()=>_i(e,t,.5,12),upHint:new b(0,1,0),twist:s,uvScale:[1,6]})}function Va(i,t,{turns:e=5,radius:n=.03,band:s=.016,thick:r=.005,taper:a=0}={}){const o=new b().subVectors(t,i),c=o.length();o.normalize();let l=new b(0,1,0);Math.abs(l.dot(o))>.9&&l.set(1,0,0);const h=new b().crossVectors(o,l).normalize(),u=new b().crossVectors(o,h).normalize(),d=[],f=Math.max(16,Math.round(e*10));for(let g=0;g<=f;g++){const _=g/f,m=_*e*Math.PI*2,p=n*(1-a*_);d.push(new b().copy(i).addScaledVector(o,c*_).addScaledVector(h,Math.cos(m)*p).addScaledVector(u,Math.sin(m)*p))}return fe({path:d,profile:()=>_i(s,r,.6,8),upHint:o.clone(),uvScale:[1,10]})}function M1(){const i=[];i.push(wi((e,n)=>{const s=.63+n*.31,r=e*Math.PI*2,a=.006+.004*Math.sin(r)**2+.003*yt(.4,1,n),o=ve(s,r,a);if(n>.86){const c=nn(Math.cos(r)*3,Math.sin(r)*3,7);o.p.y-=(n-.86)*.32*(.3+c)}return o},{rows:16,cols:30,thickness:.0055}));for(const e of["L","R"]){const n=e==="L"?1:-1,s=Te(`upperarm${e}`),r=Te(`forearm${e}`),a=s.clone().lerp(r,e==="L"?.72:.5),o=fe({path:Se([s.clone().addScaledVector(new b(-n,0,0),.03),s.clone().lerp(a,.5),a],12),profile:c=>{const l=.06-.016*c;return fn(l*.94,l,14)},upHint:new b(0,1,0),capStart:!1,capEnd:!1,uvScale:[1,2]});Vh(o,{axis:"x",from:a.x,amp:.014,freq:30,seed:e==="L"?5:6}),i.push(o)}for(const e of["L","R"]){const n=Te(`thigh${e}`),s=Te(`shin${e}`),r=n.clone().lerp(s,.78),a=fe({path:Se([n.clone().add(new b(0,.035,0)),n.clone().lerp(r,.5),r],12),profile:o=>{const c=.068-.019*o;return fn(c,c*.96,14)},upHint:new b(0,0,1),capStart:!1,capEnd:!1,uvScale:[1,2]});Vh(a,{axis:"y",from:r.y,amp:.012,freq:26,seed:e==="L"?7:8}),i.push(a)}const t=me(i);return pe(t,{amp:.0018,freq:40,seed:15}),t}function y1(){const i=pn(303),t=[],e=[[.7,.6,.05,.045],[.78,-1.9,.055,.05],[.86,2.6,.045,.04],[.66,3.5,.05,.038],[.9,-.5,.04,.035]];for(const[n,s,r,a]of e){const o=i()*10;t.push(wi((c,l)=>{const h=s+(c-.5)*(r/.1),u=n+(l-.5)*a;return ve(u,h,.0125+.0015*nn(c*4+o,l*4,1))},{rows:4,cols:5,thickness:.0035}))}return me(t)}function b1(){const i=[];i.push(wi((e,n)=>{const s=-.18+(e-.5)*1.85,r=.79+n*.135,a=.012*Math.sin(n*Math.PI)*Math.sin(e*Math.PI);return ve(r,s,.019+a)},{rows:8,cols:14,thickness:.009})),i.push(wi((e,n)=>{const s=-.18+(e-.5)*1.7,r=.845+(n-.5)*.026;return ve(r,s,.027+.004*Math.sin(n*Math.PI))},{rows:3,cols:12,thickness:.007}));for(let e=0;e<10;e++){const s=-.18+(e/9-.5)*1.72;for(const r of[.797,.918]){const a=ve(r,s,.024);i.push(uc(a.p,a.n,.0055))}}const t=me(i);return pe(t,{amp:.0016,freq:26,seed:91}),t}function S1(){const i=Te("upperarmL").clone().add(new b(.022,-.006,-.004)),t=[];for(let a=0;a<4;a++){const o=a/3,c=.017+a*.005;t.push(wi((u,d)=>{const f=-.4+(u-.5)*2.4,g=.62+o*.6+d*.42;return Vi(i,.062,f,g,c+.004*Math.sin(u*Math.PI))},{rows:4,cols:12,thickness:.0075}));const l=Vi(i,.062,-.4,.64+o*.6,c+.006);t.push(uc(l.p,l.n,.006));const h=Vi(i,.062,1.55,.64+o*.6,c+.006);t.push(uc(h.p,h.n,.006))}const e=ni({length:.07,radius:.013,curl:.9,taper:1.4,twistRibs:4}),n=Vi(i,.062,.45,.5,.022),s=new ie().setFromUnitVectors(new b(0,1,0),n.n);vt(e,{pos:n.p,quat:s});const r=me(t);return pe(r,{amp:.0014,freq:30,seed:93}),{plates:r,spike:e}}function E1(){const i=Te("upperarmR").clone().add(new b(-.024,-.008,-.002)),t=wi((e,n)=>{const s=.2+(e-.5)*1.5,r=.66+n*.56;return Vi(i,.056,s,r,.013)},{rows:5,cols:10,thickness:.0075});return pe(t,{amp:.0018,freq:24,seed:95}),t}function w1(){const i=[];i.push(wi((a,o)=>ve(.615+o*.055,a*Math.PI*2,.014),{rows:3,cols:28,thickness:.009}));const e=ve(.615+.028,.05,.03),n=ge(.062,.05,.014,.006,3);vt(n,{pos:e.p,rot:[0,.05,0]}),i.push(n);const s=[{a:1.25,w:.062,h:.075,d:.05},{a:2.05,w:.05,h:.058,d:.042},{a:-1.15,w:.058,h:.07,d:.046},{a:3.35,w:.07,h:.06,d:.04}];for(const a of s){const o=ve(.615-a.h*.42,a.a,.016+a.d/2),c=ge(a.w,a.h,a.d,.012,3),l=new ie().setFromUnitVectors(new b(0,0,1),o.n);vt(c,{pos:o.p,quat:l}),i.push(c);const h=ge(a.w*1.05,a.h*.36,a.d*1.06,.008,2);vt(h,{pos:o.p.clone().add(new b(0,a.h*.36,0)).addScaledVector(o.n,.002),quat:l}),i.push(h)}const r=me(i);return pe(r,{amp:.0015,freq:34,seed:97}),r}const Dc=.9;function T1(){const i=[],t=ve(Dc,Math.PI,.028),e=new ie().setFromUnitVectors(new b(0,0,1),t.n),n=ge(.15,.15,.03,.012,3);vt(n,{pos:t.p,quat:e}),i.push(n);for(const a of[1,-1]){const o=[new ot(0,-.055),new ot(.02,-.058),new ot(.03,-.05),new ot(.032,.045),new ot(.026,.058),new ot(.012,.064),new ot(0,.066)],c=hn(o,14);vt(c,{pos:t.p.clone().add(new b(a*.045,.005,0)).addScaledVector(t.n,.042),quat:e.clone().multiply(new ie().setFromEuler(new Si(Math.PI/2,0,0))),rot:void 0}),i.push(c);for(const l of[-.03,.03]){const h=hn([new ot(.033,0),new ot(.036,0),new ot(.036,.01),new ot(.033,.01)],14);vt(h,{pos:t.p.clone().add(new b(a*.045,.005,0)).addScaledVector(t.n,.042+l),quat:e.clone().multiply(new ie().setFromEuler(new Si(Math.PI/2,0,0)))}),i.push(h)}}const s=ge(.05,.036,.026,.006,2);vt(s,{pos:t.p.clone().add(new b(0,-.062,0)).addScaledVector(t.n,.03),quat:e}),i.push(s);const r=me(i);return pe(r,{amp:.0012,freq:40,seed:99}),r}function A1(){const i=ve(Dc,Math.PI,.028),t=new ie().setFromUnitVectors(new b(0,0,1),i.n),e=ge(.032,.02,.004,.002,1);return vt(e,{pos:i.p.clone().add(new b(0,-.062,0)).addScaledVector(i.n,.044),quat:t}),e}function R1(){const i=Te("head"),t=[],e=[],n=i.clone().add(new b(0,.072,.03));for(const c of[1,-1]){const l=n.clone().add(new b(c*.038,0,.016)),h=hn([new ot(0,.012),new ot(.022,.014),new ot(.03,.008),new ot(.031,-.008),new ot(.024,-.014),new ot(0,-.014)],14);vt(h,{pos:l,rot:[Math.PI/2-.5,0,0]}),t.push(h);const u=new Ac(.023,16);vt(u,{pos:l.clone().add(new b(0,.008,.012)),rot:[-.5,0,0]}),e.push(u)}const s=[],r=.07,a=.104,o=Math.sqrt(Math.max(.001,a*a-r*r));for(let c=0;c<=16;c++){const l=-1.25+c/16*(Math.PI*2-.9);s.push(i.clone().add(new b(Math.sin(l)*o*.96,r+Math.cos(l)*.014,Math.cos(l)*o*1.06)))}return t.push(br(s,.017,.005,26)),{frame:me(t),lenses:me(e)}}function C1(){const i=Te("jaw"),t=[],e=[],n=[];for(let r=0;r<=12;r++){const a=-1.1+r/12*2.2;n.push(i.clone().add(new b(Math.sin(a)*.042,.03+Math.cos(a)*.022,.062-Math.abs(a)*.006)))}e.push(br(n,.019,.006,20));const s=[];for(let r=0;r<=10;r++){const a=-1.2+r/10*2.4;s.push(i.clone().add(new b(Math.sin(a)*.04,-.026-Math.cos(a)*.012,.03+Math.cos(a)*.02)))}t.push(br(s,.014,.005,18));for(const r of[1,-1]){const a=hn([new ot(0,.016),new ot(.012,.017),new ot(.015,.01),new ot(.015,-.013),new ot(.011,-.017),new ot(0,-.017)],12);vt(a,{pos:i.clone().add(new b(r*.048,.008,.034)),rot:[.3,0,r*1.25]}),e.push(a);const o=hn([new ot(0,.012),new ot(.005,.012),new ot(.005,-.012),new ot(0,-.012)],8);vt(o,{pos:i.clone().add(new b(r*.032,.016,.052)),rot:[0,0,r*1]}),e.push(o)}return{skull:me(e),chin:me(t)}}function P1(){const i=[];i.push(Va(Te("forearmR").clone().lerp(Te("handR"),.12),Te("handR").clone().lerp(Te("forearmR"),.12),{turns:7,radius:.033,band:.013,thick:.0032,taper:.3}));for(const e of["L","R"])i.push(Va(Te(`shin${e}`).clone().lerp(Te(`foot${e}`),.35),Te(`foot${e}`).clone(),{turns:6,radius:.031,band:.014,thick:.0032,taper:.38}));i.push(Va(Te("handL").clone(),Te("midL0").clone(),{turns:3,radius:.034,band:.014,thick:.0032}));const t=me(i);return pe(t,{amp:.0012,freq:50,seed:111}),t}function L1(){const i=[];for(const e of["L","R"]){const n=Te(`shin${e}`);i.push(wi((o,c)=>{const l=(o-.5)*1.9,h=.55+c*.85;return Vi(n.clone().add(new b(0,.004,0)),.047,l,h,.011)},{rows:4,cols:8,thickness:.007}));const s=Vi(n,.047,0,1,.016),r=ni({length:.032,radius:.01,curl:.5,taper:1.3,rings:8,radialSegments:6}),a=new ie().setFromUnitVectors(new b(0,1,0),s.n);i.push(vt(r,{pos:s.p,quat:a}))}const t=me(i);return pe(t,{amp:.0014,freq:32,seed:113}),t}function I1(){const i=[],t=Te("thighR"),e=Te("shinR"),n=t.clone().lerp(e,.36).add(new b(-.062,0,.006)),s=ge(.05,.11,.052,.014,3);vt(s,{pos:n,rot:[.12,0,-.14]}),i.push(s);const r=ge(.052,.032,.056,.01,2);vt(r,{pos:n.clone().add(new b(.002,.062,0)),rot:[.12,0,-.14]}),i.push(r);const a=[];for(let c=0;c<=14;c++){const l=c/14*Math.PI*2;a.push(t.clone().lerp(e,.36).add(new b(Math.sin(l)*.055,.03,Math.cos(l)*.05)))}i.push(br(a,.018,.005,22));const o=me(i);return pe(o,{amp:.0012,freq:40,seed:115}),o}function D1(){const i=[],t=[];for(let n=0;n<=22;n++){const s=n/22,r=.94-s*.31,a=1.15-s*3.1;t.push(ve(r,a,.021).p)}i.push(br(t,.034,.008,34));for(let n=0;n<7;n++){const s=.16+n*.086,r=.94-s*.31,a=1.15-s*3.1,o=ve(r,a,.03),c=hn([new ot(0,-.018),new ot(.009,-.018),new ot(.0095,.012),new ot(.007,.02),new ot(0,.022)],10),l=new ie().setFromUnitVectors(new b(0,1,0),o.n);i.push(vt(c,{pos:o.p,quat:l}))}const e=me(i);return pe(e,{amp:.0012,freq:44,seed:117}),e}function U1(){const i=[],t=pn(555);[.35,.95,1.75,2.6,-.65,-1.5,3.6].forEach((r,a)=>{const o=ve(.63,r,.02);i.push({type:"strand",name:`beltStrap${a}`,bone:"hips",offset:on("hips",o.p),dir:new b(.1*(t()-.5),-1,.12*(t()-.5)).normalize(),length:.14+t()*.11,segments:7,radius:.008,taper:.7,material:"leather",damping:.09,wind:.35})}),[{a:1.25,len:.09,mat:"bone"},{a:-1.15,len:.12,mat:"metalDark"},{a:2.05,len:.075,mat:"brass"}].forEach((r,a)=>{const o=ve(.585,r.a,.05);i.push({type:"strand",name:`charm${a}`,bone:"hips",offset:on("hips",o.p),dir:new b(0,-1,0),length:r.len,segments:5,radius:.005,taper:.9,material:"leather",tip:{kind:a===0?"tooth":a===1?"tin":"ring",material:r.mat},damping:.05,wind:.5})});for(const r of["L","R"])for(let a=0;a<(r==="L"?3:2);a++){const o=`ear${r}${a===0?1:2}`,c=Te(o);i.push({type:"strand",name:`earRing${r}${a}`,bone:o,offset:on(o,c.clone().add(new b(0,-.012-a*.004,-.01*a))),dir:new b(0,-1,0),length:.035+a*.012,segments:4,radius:.0035,taper:1,material:"brass",tip:{kind:"ring",material:"brass"},damping:.03,wind:.7})}return i.push({type:"strand",name:"necklace",bone:"chest",offset:on("chest",ve(.945,.85,.012).p),dir:new b(0,-.35,.9).normalize(),length:.34,segments:12,radius:.005,taper:1,material:"bone",beads:11,pinTip:!0,pinTipTo:on("chest",ve(.945,-.85,.012).p),damping:.07,wind:.25}),i.push({type:"strand",name:"hose",bone:"chest",offset:on("chest",ve(Dc+.04,Math.PI-.5,.05).p),dir:new b(.3,.4,-.6).normalize(),length:.36,segments:12,radius:.011,taper:1,material:"hose",ribbed:!0,pinTip:!0,pinTipTo:on("chest",Te("jaw").clone().add(new b(.052,.004,.022))),damping:.12,stiffness:.9,wind:.15}),i.push({type:"strand",name:"antenna",bone:"chest",offset:on("chest",ve(.93,Math.PI+.25,.055).p),dir:new b(-.15,.95,-.25).normalize(),length:.42,segments:9,radius:.0035,taper:.55,material:"metalDark",tip:{kind:"bead",material:"emissive"},gravity:-3.2,stiffness:1,damping:.02,wind:.9}),i.push({type:"cloth",name:"cape",width:.42,height:.46,cols:15,rows:15,material:"cape",slit:{col:7,fromRow:7},wind:.85,drag:.05,pins:[{bone:"chest",local:on("chest",ve(.805,1.25,.03).p),col:0},{bone:"chest",local:on("chest",ve(.795,Math.PI,.045).p),col:7},{bone:"chest",local:on("chest",ve(.805,-1.25,.03).p),col:14}]}),[{a:0,w:.15,h:.21},{a:2.35,w:.14,h:.19},{a:-2.35,w:.14,h:.2}].forEach((r,a)=>{const o=ve(.628,r.a+.34,.024).p,c=ve(.628,r.a,.024).p,l=ve(.628,r.a-.34,.024).p;i.push({type:"cloth",name:`kilt${a}`,width:r.w,height:r.h,cols:7,rows:9,material:"kilt",wind:.4,drag:.03,pins:[{bone:"hips",local:on("hips",o),col:0},{bone:"hips",local:on("hips",c),col:3},{bone:"hips",local:on("hips",l),col:6}]})}),i}function N1(){const i=[],t=(a,o,c,l={})=>{a&&i.push({geometry:a,material:o,bones:c,...l})},e=[..._e.torso,"spine01","spine02"];t(M1(),"cloth",[...e,"upperarmL","upperarmR","forearmL","forearmR","shinL","shinR"],{smoothRadius:.045,falloff:3.4}),t(y1(),"patch",e,{falloff:4}),t(b1(),"hazard",["chest","spine02","spine01"],{falloff:6,smooth:1}),t(D1(),"leather",e,{falloff:4,smoothRadius:.05});const n=S1();t(n.plates,"metal",null,{rigid:"clavicleL"}),t(n.spike,"bone",null,{rigid:"clavicleL"}),t(E1(),"metalDark",null,{rigid:"clavicleR"}),t(w1(),"leather",["hips","spine01"],{falloff:5,smoothRadius:.04}),t(T1(),"metalDark",null,{rigid:"chest"}),t(A1(),"emissive",null,{rigid:"chest"});const s=R1();t(s.frame,"metalDark",null,{rigid:"head"}),t(s.lenses,"glass",null,{rigid:"head"});const r=C1();return t(r.skull,"metal",null,{rigid:"head"}),t(r.chin,"metal",null,{rigid:"jaw"}),t(P1(),"wrap",[..._e.armR,..._e.legL,..._e.legR,..._e.handL],{falloff:4.5,smoothRadius:.03}),t(L1(),"metalDark",["shinL","shinR","thighL","thighR"],{falloff:6,smooth:1}),t(I1(),"leather",["thighR","hips"],{falloff:5}),{parts:i,accessories:U1()}}const Gh=new b,ho=new b,Wh=new b;function F1(i,t,e){ho.subVectors(e,t),Wh.subVectors(i,t);const n=ho.lengthSq(),s=n>1e-12?dn.clamp(Wh.dot(ho)/n,0,1):0;return Gh.copy(t).addScaledVector(ho,s),Gh.distanceToSquared(i)}function O1(i,t,e){const n=new Map,s=(r,a,o)=>`${r},${a},${o}`;for(let r=0;r<t;r++){const a=Math.floor(i[r*3]/e),o=Math.floor(i[r*3+1]/e),c=Math.floor(i[r*3+2]/e),l=s(a,o,c);let h=n.get(l);h||n.set(l,h=[]),h.push(r)}return{map:n,cell:e,forEachNear(r,a,o,c){const l=Math.floor(r/e),h=Math.floor(a/e),u=Math.floor(o/e);for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++)for(let g=-1;g<=1;g++){const _=n.get(s(l+g,h+f,u+d));if(_)for(let m=0;m<_.length;m++)c(_[m])}}}}function B1(i,t,e,{falloff:n=4,smooth:s=2,smoothRadius:r=.03,maxRatio:a=3.2}){const o=e.length,c=new Float32Array(t*o),l=new b,h=new Float32Array(o);for(let u=0;u<t;u++){l.set(i[u*3],i[u*3+1],i[u*3+2]);let d=1/0;for(let m=0;m<o;m++)h[m]=F1(l,e[m].a,e[m].b),h[m]<d&&(d=h[m]);const f=d*a*a+1e-6;let g=0;const _=u*o;for(let m=0;m<o;m++){if(h[m]>f)continue;const p=Math.sqrt(h[m])+1e-4,v=1/Math.pow(p,n);c[_+m]=v,g+=v}if(g>0)for(let m=0;m<o;m++)c[_+m]/=g;else c[_]=1}if(s>0&&t>0){const u=O1(i,t,r),d=r*r;let f=c,g=new Float32Array(t*o);for(let _=0;_<s;_++){g.fill(0);for(let p=0;p<t;p++){const v=i[p*3],x=i[p*3+1],S=i[p*3+2];let w=0;const T=p*o;if(u.forEachNear(v,x,S,E=>{const A=i[E*3]-v,M=i[E*3+1]-x,y=i[E*3+2]-S;if(A*A+M*M+y*y>d)return;const C=E*o;for(let U=0;U<o;U++)g[T+U]+=f[C+U];w++}),w===0)for(let E=0;E<o;E++)g[T+E]=f[T+E];else{let E=0;for(let A=0;A<o;A++)E+=g[T+A];if(E>0)for(let A=0;A<o;A++)g[T+A]/=E}}const m=f;f=g,g=m===c?new Float32Array(t*o):m}f!==c&&c.set(f)}return c}function z1(i,{boneNames:t,segments:e}){const n=Object.fromEntries(t.map((g,_)=>[g,_])),s=new Map;for(const g of i){if(!g||!g.geometry)continue;const _=g.material||"default";s.has(_)||s.set(_,[]),s.get(_).push(g)}const r=[...s.keys()],a=[],o=[];let c=0;for(const g of r){const _=s.get(g),m=[],p=[];let v=0;for(const S of _){const w=ad(S.geometry),T=w.attributes.position.count;p.push({part:S,start:v,count:T}),v+=T,m.push(w)}const x=m.length===1?m[0]:hc(m);if(!x)throw new Error(`space-goblin: failed to merge material group "${g}"`);for(const S of p)o.push({part:S.part,start:c+S.start,count:S.count});c+=x.attributes.position.count,a.push(x)}const l=a.length===1?a[0]:hc(a,!0);if(!l)throw new Error("space-goblin: failed to merge material groups");a.length===1&&l.addGroup(0,1/0,0);const h=l.attributes.position.count,u=l.attributes.position.array,d=new Uint16Array(h*4),f=new Float32Array(h*4);for(const g of o){const{part:_,start:m,count:p}=g;if(_.rigid){const A=n[_.rigid];if(A===void 0)throw new Error(`space-goblin: unknown rigid bone "${_.rigid}"`);for(let M=0;M<p;M++)d[(m+M)*4]=A,f[(m+M)*4]=1;continue}const v=_.bones||t,x=[],S=[];for(const A of v){const M=e[A];if(!M)throw new Error(`space-goblin: no segment for bone "${A}"`);x.push(M),S.push(n[A])}const w=new Float32Array(p*3);w.set(u.subarray(m*3,(m+p)*3));const T=B1(w,p,x,{falloff:_.falloff??4,smooth:_.smooth??2,smoothRadius:_.smoothRadius??.03,maxRatio:_.maxRatio??3.2}),E=x.length;for(let A=0;A<p;A++){const M=A*E;let y=-1,C=-1,U=-1,H=-1,P=0,F=0,B=0,N=0;for(let G=0;G<E;G++){const q=T[M+G];q<=0||(q>P?(N=B,H=U,B=F,U=C,F=P,C=y,P=q,y=G):q>F?(N=B,H=U,B=F,U=C,F=q,C=G):q>B?(N=B,H=U,B=q,U=G):q>N&&(N=q,H=G))}const z=P+F+B+N||1,D=(m+A)*4;d[D]=y>=0?S[y]:0,d[D+1]=C>=0?S[C]:0,d[D+2]=U>=0?S[U]:0,d[D+3]=H>=0?S[H]:0,f[D]=P/z,f[D+1]=F/z,f[D+2]=B/z,f[D+3]=N/z}}return l.setAttribute("skinIndex",new re(d,4)),l.setAttribute("skinWeight",new re(f,4)),l.computeBoundingSphere(),l.computeBoundingBox(),{geometry:l,materials:r}}function k1(i){const t=i.attributes.skinWeight.array,e=i.attributes.skinWeight.count;let n=0,s=0;for(let r=0;r<e;r++){const a=t[r*4]+t[r*4+1]+t[r*4+2]+t[r*4+3],o=Math.abs(a-1);o>.001&&n++,o>s&&(s=o)}return{vertices:e,badRows:n,worstError:s}}function Ze(i,{repeat:t=[1,1],aniso:e=8,rotation:n=0}={}){const s={};for(const[r,a]of Object.entries(i||{})){if(!a)continue;const o=a.clone();o.needsUpdate=!0,o.wrapS=o.wrapT=ks,o.repeat.set(t[0],t[1]),o.rotation=n,o.anisotropy=e,s[r]=o}return s}function V1({renderer:i,quality:t=1}={}){const e=i?Math.min(8,i.capabilities.getMaxAnisotropy()):4,n=t>=1?1024:512,s=512,r=Ze(sd({size:n,seed:7}),{repeat:[3,2],aniso:e}),a=Ze(As({size:s,color:"#4a3324",wear:.55}),{repeat:[2,3],aniso:e}),o=Ze(As({size:s,seed:41,color:"#3b2a1e",wear:.75}),{repeat:[1,5],aniso:e}),c=Ze(dr({size:s,color:"#6d5136",stripe:"#2f5d5a"}),{repeat:[3,3],aniso:e}),l=Ze(dr({size:s,seed:29,color:"#5a4a52"}),{repeat:[2,2],aniso:e}),h=Ze(dr({size:s,seed:31,color:"#9c8f74"}),{repeat:[1,2],aniso:e}),u=Ze(dr({size:s,seed:37,color:"#7d2f34",stripe:"#c8a35a"}),{repeat:[3,3],aniso:e}),d=Ze(As({size:s,seed:43,color:"#54402c",wear:.65}),{repeat:[2,2],aniso:e}),f=Ze(fr({size:s,base:"#79808a",rust:.16,scratch:.38}),{repeat:[1,1],aniso:e}),g=Ze(fr({size:s,seed:53,base:"#6a7078",rust:.4,hazard:!0}),{repeat:[1,1],aniso:e}),_=Ze(fr({size:s,seed:59,base:"#3f444c",rust:.28,scratch:.3}),{repeat:[1,1],aniso:e}),m=Ze(fr({size:s,seed:61,base:"#b08a4a",rust:.14,scratch:.5}),{repeat:[1,1],aniso:e}),p=Ze(As({size:s,seed:67,color:"#cbbf9e",wear:.85}),{repeat:[1,1],aniso:e}),v=Ze(rd({size:s,color:"#48e8ff",density:1.2}),{repeat:[1,1],aniso:e}),x=Ze(As({size:s,seed:71,color:"#22242a",wear:.3}),{repeat:[1,8],aniso:e}),S=T=>new Lo({roughness:1,metalness:0,envMapIntensity:.35,...T}),w={skin:S({...r,color:"#a9c088",emissive:"#48e8ff",emissiveIntensity:.9,roughness:1,metalness:0}),eye:S({color:"#0b0d10",roughness:.18,metalness:.1}),iris:S({color:"#0a0a08",emissive:"#ffb03d",emissiveIntensity:2.6,roughness:.25}),bone:S({normalMap:p.normalMap,roughnessMap:p.roughnessMap,color:"#e2d8bb",roughness:.62,metalness:0}),cloth:S({...c,color:"#a08b6a",roughness:1}),patch:S({...l,color:"#8f7d84",roughness:1}),wrap:S({...h,color:"#c9bda1",roughness:1}),cape:S({...u,color:"#b8666a",roughness:1,side:Mn}),kilt:S({...d,color:"#9a7a56",roughness:1,side:Mn}),leather:S({...a,color:"#8a6a4c",roughness:1}),strap:S({...o,color:"#6f5540",roughness:1}),hose:S({...x,color:"#4a4d55",roughness:.85}),metal:S({...f,color:"#c2c9d1",roughness:1,metalness:.92,envMapIntensity:1.5}),hazard:S({...g,color:"#c4cad1",roughness:1,metalness:.85,envMapIntensity:1.3}),metalDark:S({..._,color:"#9aa0a9",roughness:1,metalness:.9,envMapIntensity:1.35}),brass:S({...m,color:"#e0b878",roughness:1,metalness:.94,envMapIntensity:1.5}),emissive:S({...v,color:"#0a1418",emissive:"#48e8ff",emissiveIntensity:1.6,roughness:.5,metalness:.2}),glass:new Lo({color:"#12303a",emissive:"#2b6f7d",emissiveIntensity:.55,roughness:.08,metalness:.85,envMapIntensity:2.2,transparent:!0,opacity:.62})};return w.plate=w.metal,w.blade=w.metal,w}function H1(i){for(const t of Object.values(i||{})){for(const e of["map","normalMap","roughnessMap","metalnessMap","emissiveMap"])t[e]&&t[e].dispose();t.dispose()}}const Uc={x:new b(1,0,0),y:new b(0,1,0),z:new b(0,0,1)},ce=i=>new ie().setFromAxisAngle(Uc.x,i),tn=i=>new ie().setFromAxisAngle(Uc.y,i),Le=i=>new ie().setFromAxisAngle(Uc.z,i);function $e(...i){const t=new ie;for(const e of i)t.premultiply(e);return t}const G1=Js();function Pe(i,t){if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++)if(t<=i[e][0]){const[n,s]=i[e-1],[r,a]=i[e],o=(t-n)/(r-n||1);return s+(a-s)*(o*o*(3-2*o))}return i[i.length-1][1]}function uo(i,t){const e=(t%1+1)%1;return Pe(i,e)}const be=Math.PI*2;function Xh(i,t,e,{stride:n=1,lift:s=1}={}){const r=t==="L"?1:-1,a=uo([[0,-.62],[.12,-.3],[.28,.46],[.42,.3],[.58,-.42],[.78,-.86],[.9,-.76],[1,-.62]],e),o=uo([[0,.34],[.12,.6],[.28,.26],[.42,1.9],[.58,1.62],[.78,.6],[.9,.24],[1,.34]],e),c=uo([[0,-.2],[.12,.1],[.28,-.62],[.42,-.3],[.58,.22],[.78,.2],[.9,-.02],[1,-.2]],e),l=uo([[0,.12],[.14,.14],[.28,.62],[.4,.1],[.7,-.1],[1,.12]],e),h=.07+.05*Math.sin(e*be);i[`thigh${t}`]=$e(Le(-r*h),ce(a*n)),i[`shin${t}`]=ce(o*s),i[`foot${t}`]=ce(c),i[`toe${t}`]=ce(l)}function Ji(i,t,e,{thumb:n=e,spread:s=0}={}){const r=t==="L"?1:-1,a=[["index",1,.02],["mid",1.05,0],["ring",1,-.03]];for(const[o,c,l]of a)i[`${o}${t}0`]=$e(tn(-r*(l+s)),Le(-r*1.05*e*c)),i[`${o}${t}1`]=Le(-r*1.25*e*c),i[`${o}${t}2`]=Le(-r*.9*e*c);i[`thumb${t}0`]=$e(tn(-r*.55),Le(-r*(.35+.55*n))),i[`thumb${t}1`]=Le(-r*.75*n),i[`thumb${t}2`]=Le(-r*.6*n)}function Ws(i,t,{down:e=1.3,swing:n=0,out:s=0,bend:r=.3,twist:a=0,wrist:o=null,clav:c=0}){const l=t==="L"?1:-1;i[`clavicle${t}`]=$e(Le(l*c*.6),tn(-l*c*.5)),i[`upperarm${t}`]=$e(Le(-l*e),tn(-l*s),ce(n),tn(-l*a)),i[`forearm${t}`]=tn(-l*r),i[`hand${t}`]=o||new ie}function Nc(i,{lean:t=0,twist:e=0,side:n=0,crunch:s=0}){const r=[.28,.32,.4],a=["spine01","spine02","chest"];for(let o=0;o<3;o++)i[a[o]]=$e(ce(t*r[o]+s*r[o]),tn(e*r[o]),Le(n*r[o]))}function Fc(i,{pitch:t=0,yaw:e=0,roll:n=0,jaw:s=0,neck:r=.5}){i.neck=$e(ce(t*r),tn(e*.45),Le(n*.4)),i.head=$e(ce(t*(1-r)),tn(e*.55),Le(n*.6)),i.jaw=ce(-s*.75)}function Oc(i,t=0,e=0,n=0){const s=$e(ce(e),tn(i),Le(t));return n?s.multiply(Le(n)):s}function W1(i){const t={},e=(i%1+1)%1;Xh(t,"L",e),Xh(t,"R",e+.5);const n=-.02-.016*Math.cos(2*be*(e-.12)),s=.012*Math.sin(2*be*(e-.05));t.hipsPos=new b(.008*Math.sin(be*e),n,s),t.hips=$e(ce(.14),tn(-.2*Math.cos(be*e)),Le(.1*Math.cos(be*e))),Nc(t,{lean:.34,twist:.26*Math.cos(be*e),side:-.05*Math.cos(be*e),crunch:.03*Math.cos(2*be*e)}),Fc(t,{pitch:-.42+.05*Math.cos(2*be*(e-.1)),yaw:-.1*Math.cos(be*e),roll:.06*Math.cos(be*e),jaw:.12+.08*Math.max(0,Math.cos(2*be*e)),neck:.45});const r=.95*Math.cos(be*e),a=.95*Math.cos(be*(e+.5));return Ws(t,"L",{down:1.24,swing:r,out:.22+.07*Math.cos(be*e),bend:1.12+.34*Math.max(0,-r),clav:.1*Math.cos(be*e)}),Ws(t,"R",{down:1.16,swing:a*.8-.1,out:.28+.06*Math.cos(be*(e+.5)),bend:.92+.26*Math.max(0,-a),twist:.25,clav:.1*Math.cos(be*(e+.5)),wrist:Oc(-.5+.11*a,-.52+.1*a,.2-.44*a)}),Ji(t,"L",.78+.12*Math.cos(be*e)),Ji(t,"R",1),t}function X1(i){const t={},e=Math.sin(i*be*3),n=Math.sin(i*be);return t.thighL=$e(Le(-.1),ce(-.34+.03*n)),t.shinL=ce(.5-.04*n),t.footL=ce(-.14),t.toeL=ce(.1),t.thighR=$e(Le(.16),tn(-.3),ce(.12-.03*n)),t.shinR=ce(.34+.05*n),t.footR=ce(-.06),t.toeR=ce(.16),t.hipsPos=new b(.02*n,-.055+.008*e,-.01),t.hips=$e(ce(.1),tn(.12),Le(.05*n)),Nc(t,{lean:.3+.03*e,twist:-.18,side:-.04*n}),Fc(t,{pitch:-.34-.05*e,yaw:.16+.1*Math.sin(i*be*2),roll:.04*n,jaw:.14+.12*Math.max(0,e)}),Ws(t,"L",{down:1.22,swing:-.28,out:.3,bend:1.35+.06*e,clav:.06}),Ws(t,"R",{down:1,swing:-.42,out:.42,bend:1.5+.05*e,twist:.3,clav:.08,wrist:Oc(-.5+.04*e,-.52,.2)}),Ji(t,"L",.55+.08*e),Ji(t,"R",1),t}function hd(i){const t={},e=dn.clamp(i,0,1),n=Pe([[0,.5],[.18,1],[.8,1],[1,.35]],e),s=Pe([[.78,0],[.88,1],[1,.5]],e),r=Pe([[0,.2],[.2,1],[.38,.35],[.6,.8],[.72,.3],[.88,.9],[1,.4]],e);t.thighL=$e(Le(-.16),ce(-.5-.35*n-.45*s)),t.shinL=ce(.62+.5*r-.3*s),t.footL=ce(-.16-.2*r+.25*s),t.toeL=ce(.14+.3*s),t.thighR=$e(Le(.2),tn(-.42),ce(.34+.25*n)),t.shinR=ce(.5+.55*r),t.footR=ce(-.1-.35*r),t.toeR=ce(.2+.5*r),t.hipsPos=new b(.03*Pe([[0,0],[.3,-1],[.7,1],[1,0]],e),-.06-.075*r,.05*s-.02);const a=Pe([[0,0],[.2,.72],[.4,-.5],[.58,-.62],[.74,.55],[.86,.1],[1,0]],e),o=Pe([[0,0],[.2,-.42],[.4,.62],[.56,.2],[.72,.3],[.86,-.1],[1,.1]],e);t.hips=$e(ce(.12+.1*s),tn(a*.42),Le(.06*a)),Nc(t,{lean:.26+o*.5,twist:-a*.75,side:a*.12,crunch:.12*r});const c=Pe([[.76,0],[.86,1],[.96,.8],[1,.2]],e);Fc(t,{pitch:-.3-o*.35+c*.25,yaw:a*.45,roll:-a*.18,jaw:.16+c*1+.2*Math.max(0,o),neck:.4});const l=Pe([[0,1],[.2,.05],[.36,1.5],[.5,.85],[.62,.35],[.76,1.35],[.88,.75],[1,1]],e),h=Pe([[0,-.3],[.2,1.15],[.36,-1.15],[.5,-.55],[.62,.95],[.76,-1.05],[.88,-.85],[1,-.3]],e),u=Pe([[0,.35],[.2,.5],[.36,.12],[.62,.62],[.76,.05],[1,.35]],e),d=Pe([[0,1.4],[.2,2.1],[.36,.45],[.5,1.1],[.62,1.9],[.76,.5],[.88,1.3],[1,1.4]],e),f=Pe([[0,-.5],[.2,-.6],[.36,.4],[.5,-.4],[.62,-.6],[.76,.4],[.88,-.3],[1,-.5]],e),g=Pe([[0,-.52],[.2,-.6],[.36,-.3],[.62,-.6],[.76,-.3],[1,-.52]],e),_=Pe([[0,.2],[.2,.45],[.36,-.15],[.62,.45],[.76,-.1],[1,.2]],e),m=Pe([[0,0],[.18,.15],[.28,1.05],[.34,1.2],[.44,.35],[.62,.2],[.7,1],[.76,1.15],[.84,.5],[.94,.1],[1,0]],e);Ws(t,"R",{down:l,swing:h,out:u,bend:d,twist:.3+.35*o,clav:.18*(1-l),wrist:Oc(f,g,_,m)});const p=Pe([[0,1.15],[.24,.72],[.42,.95],[.62,.6],[.84,.5],[1,1.15]],e);return Ws(t,"L",{down:p,swing:Pe([[0,-.3],[.24,-.85],[.5,-.5],[.72,-1],[.88,-1.25],[1,-.3]],e),out:Pe([[0,.3],[.3,.15],[.7,.35],[.88,.1],[1,.3]],e),bend:Pe([[0,1.4],[.24,2],[.5,1.6],[.78,1.9],[.9,.8],[1,1.4]],e),clav:.12}),Ji(t,"R",1),Ji(t,"L",Pe([[0,.7],[.5,.9],[.84,.35],[1,.7]],e),{spread:.25}),t}function q1(i){const t=hd(0),e=dn.clamp(i,0,1);return t.hipsPos=new b(0,-.05-.03*e,0),t}function fo(i,t,e,{fps:n=30,loop:s=!1}={}){const r=Math.max(2,Math.round(t*n)),a=[],o={},c={};for(let h=0;h<=r;h++){const u=h/r;a.push(u*t);const d=e(s&&h===r?0:u);for(const[f,g]of Object.entries(d)){if(f==="hipsPos"){const m=G1.hips;(c.hips||(c.hips=[])).push(m.x+g.x,m.y+g.y,m.z+g.z);continue}(o[f]||(o[f]=[])).push(g.x,g.y,g.z,g.w)}}const l=[];for(const[h,u]of Object.entries(o)){if(u.length!==(r+1)*4)throw new Error(`space-goblin: clip "${i}" pose function set "${h}" on only some frames`);l.push(new js(`${h}.quaternion`,a,u))}for(const[h,u]of Object.entries(c))l.push(new yr(`${h}.position`,a,u));return new cc(i,t,l)}function Y1({runDuration:i=.56,comboDuration:t=2.1}={}){return{run:fo("run",i,W1,{fps:60,loop:!0}),idle:fo("idle",4.2,X1,{fps:24,loop:!0}),combo:fo("combo",t,hd,{fps:60}),skid:fo("skid",.3,q1,{fps:30})}}const lr=new b,Ha=new b,ws=new b,hr=new b,qh=new b,Yh=new b,Ga=new ie,j1=new b,Wa=new b;class $1{constructor(t,e,{stiffness:n=.09,drag:s=.16,gravity:r=.9,gravityDir:a}={}){this.bone=t,this.restTipLocal=e.clone(),this.length=e.length(),this.restDir=e.clone().normalize(),this.stiffness=n,this.drag=s,this.gravity=r,this.gravityDir=(a||new b(0,-1,0)).clone(),this.curr=new b,this.prev=new b,this.initialised=!1}originWorld(t){return t.setFromMatrixPosition(this.bone.matrixWorld)}reset(){this.bone.parent.updateMatrixWorld(!0),this.bone.quaternion.identity(),this.bone.updateMatrixWorld(!0),lr.copy(this.restTipLocal).applyMatrix4(this.bone.matrixWorld),this.curr.copy(lr),this.prev.copy(lr),this.initialised=!0}step(t,e){if(!this.initialised){this.reset();return}const n=this.bone;n.quaternion.identity(),n.updateMatrixWorld(!0),lr.copy(this.restTipLocal).applyMatrix4(n.matrixWorld),this.originWorld(Ha),qh.subVectors(this.curr,this.prev).multiplyScalar(1-this.drag),Yh.subVectors(lr,this.curr),hr.copy(this.curr).add(qh).addScaledVector(Yh,this.stiffness).addScaledVector(this.gravityDir,this.gravity*t*t),e&&hr.addScaledVector(e,t*t),ws.subVectors(hr,Ha);const s=ws.length();s<1e-7?ws.copy(this.restDir).applyQuaternion(n.getWorldQuaternion(Ga)):ws.divideScalar(s),hr.copy(Ha).addScaledVector(ws,this.length),this.prev.copy(this.curr),this.curr.copy(hr),n.parent.matrixWorld.decompose(j1,Ga,Wa),Wa.copy(ws).applyQuaternion(Ga.invert()).normalize(),n.quaternion.setFromUnitVectors(this.restDir,Wa),n.updateMatrixWorld(!0)}}class K1{constructor(t,e,n={}){this.springs=[];for(let s=0;s<t.length;s++){const r=t[s],a=t[s+1],o=a?a.position.clone():e.clone(),c=t.length>1?s/(t.length-1):0;this.springs.push(new $1(r,o,{stiffness:dn.lerp(n.stiffness??.14,n.stiffnessTip??.05,c),drag:dn.lerp(n.drag??.22,n.dragTip??.1,c),gravity:dn.lerp(n.gravity??.8,n.gravityTip??1.6,c),gravityDir:n.gravityDir}))}}reset(){for(const t of this.springs)t.reset()}step(t,e){for(const n of this.springs)n.step(t,e)}}function Z1(i,t){const e=[];for(const n of t){const s=n.names.map(r=>i[r]).filter(Boolean);s.length!==0&&e.push(new K1(s,new b(...n.stub),n.opts||{}))}return e}const ud=1.5,dd=.004,_o=.35,J1=1.6,Q1=1.8,tv=2,jh=80,ev=.25,Fs=30,ur=new b,Fn=new b,Pn=new b,di=new b,Ni=new b,Fe=new b,xn=new b,$h=new b,po=new b,an=new b,Kh=new ie,mo=new b,nv=new b(0,1,0),Xa=new b(0,-1,0),Os=(i,t,e)=>i<t?t:i>e?e:i;function iv(i){const t=i.elements,e=Math.hypot(t[0],t[1],t[2]),n=Math.hypot(t[4],t[5],t[6]),s=Math.hypot(t[8],t[9],t[10]);return Math.max(e,n,s)||1}function dc(i,t){const e=Math.abs(i.x),n=Math.abs(i.y),s=Math.abs(i.z);e<=n&&e<=s?t.set(0,-i.z,i.y):n<=s?t.set(-i.z,0,i.x):t.set(-i.y,i.x,0);const r=t.length();return r<1e-9?t.set(1,0,0):t.multiplyScalar(1/r),t}class sv{constructor(t,e,n,s){this.bone=t||null,this.localA=e?e.clone():new b,this.localB=n?n.clone():new b(0,1,0),this.radius=s>0?s:.05,this.enabled=!0,this.a=new b,this.b=new b,this.worldRadius=this.radius,this.center=new b,this.bound=this.radius,this._ab=new b,this._abLen2=0,this.update()}update(){const t=this.bone;return t?(t.updateWorldMatrix(!0,!1),this.a.copy(this.localA).applyMatrix4(t.matrixWorld),this.b.copy(this.localB).applyMatrix4(t.matrixWorld),this.worldRadius=this.radius*iv(t.matrixWorld)):(this.a.copy(this.localA),this.b.copy(this.localB),this.worldRadius=this.radius),this._ab.subVectors(this.b,this.a),this._abLen2=this._ab.lengthSq(),this.center.addVectors(this.a,this.b).multiplyScalar(.5),this.bound=this.worldRadius+.5*Math.sqrt(this._abLen2),this}resolve(t,e=0){if(!this.enabled)return!1;const n=this.worldRadius+e;if(!(n>0))return!1;const s=t.x-this.center.x,r=t.y-this.center.y,a=t.z-this.center.z,o=this.bound+e;if(s*s+r*r+a*a>o*o)return!1;let c=0;if(this._abLen2>1e-12){const p=this._ab;c=((t.x-this.a.x)*p.x+(t.y-this.a.y)*p.y+(t.z-this.a.z)*p.z)/this._abLen2,c=c<0?0:c>1?1:c}const l=this.a.x+this._ab.x*c,h=this.a.y+this._ab.y*c,u=this.a.z+this._ab.z*c;let d=t.x-l,f=t.y-h,g=t.z-u;const _=d*d+f*f+g*g;if(_>=n*n)return!1;const m=Math.sqrt(_);if(m<1e-9)this._abLen2>1e-12?dc(this._ab,ur):ur.set(1,0,0),d=ur.x,f=ur.y,g=ur.z;else{const p=1/m;d*=p,f*=p,g*=p}return t.set(l+d*n,h+f*n,u+g*n),!0}}class rv{constructor(t){const e=t||{};this.anchor=e.anchor||null,this.offset=(e.offset||new b).clone(),this.dir=(e.dir||Xa).clone(),this.dir.lengthSq()<1e-12&&this.dir.copy(Xa),this.length=e.length>0?e.length:.2,this.segments=Math.max(2,Math.round(e.segments||6)),this.stiffness=Ot(e.stiffness===void 0?1:e.stiffness),this.damping=Os(e.damping===void 0?.06:e.damping,0,.999),this.gravity=e.gravity===void 0?-9.8:e.gravity,this.drag=Math.max(0,e.drag||0),this.stretch=Os(e.stretch||0,0,.8),this.wind=Ot(e.wind||0),this.pinTip=!!e.pinTip,this.twistLock=Ot(e.twistLock||0),this._gravitySet=e.gravity!==void 0,this._pinTipLocal=e.pinTipTo?e.pinTipTo.clone():null;const n=this.segments+1;this.n=n,this._rest=this.length/this.segments,this._slackHi=this.stretch,this._slackLo=this.stretch*.4,this._maxLen=this._rest*Math.max(ud,1+this._slackHi*1.1),this._maxMove=this._rest*2,this._maxPush=this._rest*1.2,this._iters=Os(Math.round(1+this.stiffness*3),1,4),this._k=.5+.5*this.stiffness,this._pos=new Array(n),this._prev=new Array(n),this._w=new Float32Array(n),this._windW=new Float32Array(n),this._jit=new Float32Array(n*3);for(let r=0;r<n;r++)this._pos[r]=new b,this._prev[r]=new b,this._w[r]=r===0?0:1,this._windW[r]=.35+.65*(r/(n-1));this.pinTip&&(this._w[n-1]=0);const s=pn(e.seed|0||40503+n*131+Math.round(this.length*977));for(let r=0;r<n;r++){const a=s()*2-1,o=s()*2-1,c=s()*2-1,l=Math.hypot(a,o,c)||1;this._jit[r*3]=a/l,this._jit[r*3+1]=o/l,this._jit[r*3+2]=c/l}this._nx=s()*64,this._ny=s()*64,this._nz=s()*64,this.windVector=new b,this._turb=new b,this._rootPrevW=new b,this._tipPrevW=new b,this._restDirW=new b(0,-1,0),this._t=0,this._prevDt=0,this._subAlpha=1,this.reset()}get points(){return this._pos}reset(){const t=this.n,e=this.anchor;if(e&&e.updateWorldMatrix(!0,!1),Fn.copy(this.offset),e&&Fn.applyMatrix4(e.matrixWorld),Pn.copy(this.dir),e&&Pn.transformDirection(e.matrixWorld),Pn.lengthSq()<1e-12?Pn.copy(Xa):Pn.normalize(),this._restDirW.copy(Pn),this.pinTip&&this._pinTipLocal){di.copy(this._pinTipLocal),e&&di.applyMatrix4(e.matrixWorld);const n=Fn.distanceTo(di),s=Math.max(0,this.length*this.length-n*n),r=.35*Math.sqrt(s);for(let a=0;a<t;a++){const o=a/(t-1);this._pos[a].lerpVectors(Fn,di,o).addScaledVector(this._restDirW,r*4*o*(1-o))}this._tipPrevW.copy(di)}else{for(let n=0;n<t;n++)this._pos[n].copy(Fn).addScaledVector(this._restDirW,this._rest*n);this._tipPrevW.copy(this._pos[t-1]),this.pinTip&&!this._pinTipLocal&&(this._pinTipLocal=this._pos[t-1].clone(),e&&this._pinTipLocal.applyMatrix4(av(e)))}for(let n=0;n<t;n++)this._prev[n].copy(this._pos[n]);this._rootPrevW.copy(this._pos[0]),this._prevDt=0,this._t=0,this._turb.set(0,0,0)}step(t,e,n){const s=this._subAlpha;if(this._subAlpha=1,!(t>0))return;this._t+=t;const r=this.n,a=this._pos,o=this._prev,c=this._w,l=this.anchor;l&&l.updateWorldMatrix(!0,!1),Fn.copy(this.offset),l&&Fn.applyMatrix4(l.matrixWorld);const h=a[0];if(o[0].copy(h),s>=1?h.copy(Fn):h.lerpVectors(this._rootPrevW,Fn,s),this.pinTip&&this._pinTipLocal){Pn.copy(this._pinTipLocal),l&&Pn.applyMatrix4(l.matrixWorld);const P=a[r-1];o[r-1].copy(P),s>=1?P.copy(Pn):P.lerpVectors(this._tipPrevW,Pn,s),s>=1&&this._tipPrevW.copy(Pn)}if(s>=1&&this._rootPrevW.copy(Fn),l&&(di.copy(this.dir).transformDirection(l.matrixWorld),di.lengthSq()>1e-12&&this._restDirW.copy(di.normalize())),this.wind>0){const F=this._t*.55,B=h.x*.45+this._nx,N=h.y*.45+this._ny,z=h.z*.45+this._nz;this._turb.set(nn(B+F,N,z)*2-1,(nn(B,N+F,z+11.3)*2-1)*.55,nn(B,N,z+F+7.7)*2-1)}const u=Math.pow(1-this.damping,t),d=this._prevDt>1e-8?1/this._prevDt:1/t,f=this.gravity,g=n?-n.x:0,_=n?-n.y+f:f,m=n?-n.z:0,p=this.wind>0?this.wind*J1:0,v=this.windVector.x+this._turb.x*1.4,x=this.windVector.y+this._turb.y*1.4,S=this.windVector.z+this._turb.z*1.4,w=this.drag,T=.9/t,E=this._maxMove;for(let P=1;P<r;P++){if(c[P]===0)continue;const F=a[P],B=o[P];let N=(F.x-B.x)*d,z=(F.y-B.y)*d,D=(F.z-B.z)*d;const G=N*N+z*z+D*D;if(G>Fs*Fs){const Y=Fs/Math.sqrt(G);N*=Y,z*=Y,D*=Y}let q=g,Z=_,X=m;if(p>0){const Y=p*this._windW[P];q+=(v-N)*Y,Z+=(x-z)*Y,X+=(S-D)*Y}if(w>0){const Y=Math.hypot(N,z,D);if(Y>1e-6){let nt=w*Y;nt>T&&(nt=T),q-=N*nt,Z-=z*nt,X-=D*nt}}let j=N*t*u+q*t*t,Q=z*t*u+Z*t*t,st=D*t*u+X*t*t;const k=j*j+Q*Q+st*st;if(k>E*E){const Y=E/Math.sqrt(k);j*=Y,Q*=Y,st*=Y}B.copy(F),F.set(F.x+j,F.y+Q,F.z+st)}const A=this._rest,M=A*(1-this._slackLo),y=A*(1+this._slackHi),C=y>M,U=this._k,H=this._jit;for(let P=0;P<this._iters;P++){for(let F=0;F<r-1;F++){const B=c[F],N=c[F+1],z=B+N;if(z<=0)continue;const D=a[F],G=a[F+1];let q=G.x-D.x,Z=G.y-D.y,X=G.z-D.z,j=q*q+Z*Z+X*X;if(j<1e-16){const rt=F*3;q=H[rt]*1e-4,Z=H[rt+1]*1e-4,X=H[rt+2]*1e-4,j=1e-8}const Q=Math.sqrt(j);let st=Q>y?y:Q<M?M:Q;C&&(st+=(A-st)*ev);const k=(Q-st)/Q*U,Y=k*B/z,nt=k*N/z;B>0&&(D.x+=q*Y,D.y+=Z*Y,D.z+=X*Y),N>0&&(G.x-=q*nt,G.y-=Z*nt,G.z-=X*nt)}if(this.twistLock>0&&c[1]>0){const F=a[0],B=a[1];Ni.subVectors(B,F);const N=Ni.length();if(N>1e-9){const z=Ni.dot(this._restDirW),D=-.25*N;if(z<D){Ni.addScaledVector(this._restDirW,(D-z)*this.twistLock);const G=Ni.length();G>1e-9&&(Ni.multiplyScalar(N/G),B.copy(F).add(Ni))}}}this._collide(e)}this._clamp(),this._collide(e),this._clamp(),this._prevDt=t}_collide(t){if(!t)return;const e=this.n,n=this._pos,s=this._prev,r=this._w,a=this._maxPush;for(let o=0;o<t.length;o++){const c=t[o];for(let l=1;l<e;l++){if(r[l]===0)continue;const h=n[l],u=h.x,d=h.y,f=h.z;if(!c.resolve(h,dd))continue;const g=h.x-u,_=h.y-d,m=h.z-f,p=g*g+_*_+m*m;if(p>a*a){const v=a/Math.sqrt(p);h.set(u+g*v,d+_*v,f+m*v)}s[l].lerp(h,_o)}}}_clamp(){const t=this.n,e=this._pos,n=this._w,s=this._maxLen;if(this.pinTip)for(let r=0;r<8;r++){let a=!1;for(let o=0;o<t-1;o++){const c=r&1?t-2-o:o,l=n[c],h=n[c+1],u=l+h;if(u<=0)continue;const d=e[c],f=e[c+1],g=f.x-d.x,_=f.y-d.y,m=f.z-d.z,p=Math.sqrt(g*g+_*_+m*m);if(p>s&&p>1e-9){const v=(p-s)/p/u,x=v*l,S=v*h;d.set(d.x+g*x,d.y+_*x,d.z+m*x),f.set(f.x-g*S,f.y-_*S,f.z-m*S),a=!0}}if(!a)break}else for(let r=0;r<t-1;r++){if(n[r+1]===0)continue;const a=e[r],o=e[r+1],c=o.x-a.x,l=o.y-a.y,h=o.z-a.z,u=Math.sqrt(c*c+l*l+h*h);if(u>s&&u>1e-9){const d=s/u;o.set(a.x+c*d,a.y+l*d,a.z+h*d)}}}isFinite(){const t=this._pos[this.n-1];return Number.isFinite(t.x)&&Number.isFinite(t.y)&&Number.isFinite(t.z)}}const ov=new qt;function av(i){return ov.copy(i.matrixWorld).invert()}class cv{constructor(t){const e=t||{};this.width=e.width>0?e.width:.4,this.height=e.height>0?e.height:.5,this.cols=Math.max(2,Math.round(e.cols||10)),this.rows=Math.max(2,Math.round(e.rows||10)),this.pins=(e.pins||[]).slice().sort((p,v)=>p.col-v.col),this.mass=e.mass>0?e.mass:1,this.stiffness=Ot(e.stiffness===void 0?.9:e.stiffness),this.damping=Os(e.damping===void 0?.04:e.damping,0,.999),this.gravity=e.gravity===void 0?-9.8:e.gravity,this.wind=Ot(e.wind===void 0?.5:e.wind),this.drag=Math.max(0,e.drag===void 0?.02:e.drag),this.tearable=!!e.tearable,this._gravitySet=e.gravity!==void 0;const n=e.slit||null;this.slit=n?{col:n.col|0,fromRow:Math.max(1,n.fromRow|0)}:null;const s=this.cols,r=this.rows,a=s*r;this.count=a,this._invMass=1/this.mass,this._dx=this.width/(s-1),this._dy=this.height/(r-1),this._pos=new Float64Array(a*3),this._prev=new Float64Array(a*3),this._w=new Float32Array(a),this._out=new Float32Array(a*3),this._nrm=new Float32Array(a*3);for(let p=0;p<a;p++)this._w[p]=p<s?0:1;const o=[],c=[],l=[],h=[],u=[],d=[],f=(p,v)=>v*s+p,g=(p,v,x,S)=>{if(!this.slit)return!1;const w=Math.min(p,v),T=Math.max(p,v);return w<=this.slit.col&&T>this.slit.col&&Math.min(x,S)>=this.slit.fromRow};for(let p=0;p<r;p++)for(let v=0;v<s;v++){if(v+1<s&&!g(v,v+1,p,p)&&(o.push(f(v,p)),c.push(f(v+1,p)),l.push(this._dx)),p+1<r&&(o.push(f(v,p)),c.push(f(v,p+1)),l.push(this._dy)),v+1<s&&p+1<r&&!g(v,v+1,p,p+1)){const x=Math.hypot(this._dx,this._dy);o.push(f(v,p)),c.push(f(v+1,p+1)),l.push(x),o.push(f(v+1,p)),c.push(f(v,p+1)),l.push(x)}v+2<s&&!g(v,v+2,p,p)&&(h.push(f(v,p)),u.push(f(v+2,p)),d.push(this._dx*2)),p+2<r&&(h.push(f(v,p)),u.push(f(v,p+2)),d.push(this._dy*2))}this._ba=Int32Array.from(h),this._bb=Int32Array.from(u),this._brest=Float32Array.from(d),this._kBend=.3*this.stiffness,this._ca=Int32Array.from(o),this._cb=Int32Array.from(c),this._crest=Float32Array.from(l),this._cactive=new Uint8Array(this._ca.length).fill(1),this._ctear=new Float32Array(this._ca.length),this._links=new Uint8Array(a);const _=pn(e.seed|0||485+s*7919+r*104729);for(let p=0;p<this._ctear.length;p++)this._ctear[p]=2+_()*1.4;this._nx=_()*64,this._ny=_()*64,this._nz=_()*64,this._iters=Os(Math.round(1+this.stiffness*2),1,3),this._k=.4+.6*this.stiffness,this._maxStretch=ud;const m=Math.min(this._dx,this._dy);this._maxMove=m*2,this._maxPush=m*1.2,this._pinW=new Float64Array(Math.max(1,this.pins.length)*3),this._row0Prev=new Float64Array(s*3),this._row0Tgt=new Float64Array(s*3),this._colTurb=new Float64Array(s*3),this.windVector=new b,this._t=0,this._prevDt=0,this._subAlpha=1,this._settle=8,this.reset()}get positions(){return this._out}get normals(){return this._nrm}_readPins(){const t=this.pins;for(let e=0;e<t.length;e++){const n=t[e],s=n.bone;Fe.copy(n.local),s&&(s.updateWorldMatrix(!0,!1),Fe.applyMatrix4(s.matrixWorld)),this._pinW[e*3]=Fe.x,this._pinW[e*3+1]=Fe.y,this._pinW[e*3+2]=Fe.z}}_row0Target(t){const e=this.pins,n=this.cols;if(e.length===0){for(let r=0;r<n;r++)t[r*3]=(r/(n-1)-.5)*this.width,t[r*3+1]=0,t[r*3+2]=0;return}if(e.length===1){for(let r=0;r<n;r++)t[r*3]=this._pinW[0]+(r/(n-1)-.5)*this.width,t[r*3+1]=this._pinW[1],t[r*3+2]=this._pinW[2];return}let s=0;for(let r=0;r<n;r++){for(;s<e.length-2&&e[s+1].col<r;)s++;const a=e[s].col,c=e[s+1].col-a,l=Math.abs(c)<1e-6?0:(r-a)/c,h=s*3,u=(s+1)*3;t[r*3]=this._pinW[h]+(this._pinW[u]-this._pinW[h])*l,t[r*3+1]=this._pinW[h+1]+(this._pinW[u+1]-this._pinW[h+1])*l,t[r*3+2]=this._pinW[h+2]+(this._pinW[u+2]-this._pinW[h+2])*l}}reset(){const t=this.cols,e=this.rows,n=this._pos;this._readPins(),this._row0Target(this._row0Prev),Fe.set(this._row0Prev[(t-1)*3]-this._row0Prev[0],this._row0Prev[(t-1)*3+1]-this._row0Prev[1],this._row0Prev[(t-1)*3+2]-this._row0Prev[2]),Fe.lengthSq()<1e-12&&Fe.set(1,0,0),Fe.normalize().cross(nv),Fe.lengthSq()<1e-12&&Fe.set(0,0,1),Fe.normalize();for(let s=0;s<e;s++)for(let r=0;r<t;r++){const a=(s*t+r)*3;n[a]=this._row0Prev[r*3]+Fe.x*this._dy*.06*s,n[a+1]=this._row0Prev[r*3+1]-this._dy*s,n[a+2]=this._row0Prev[r*3+2]+Fe.z*this._dy*.06*s}this._prev.set(n),this._cactive.fill(1),this._prevDt=0,this._t=0,this._settle=8,this._computeNormals(),this._publish()}step(t,e,n){const s=this._subAlpha;if(this._subAlpha=1,!(t>0))return;this._t+=t;const r=this.cols,a=this.count,o=this._pos,c=this._prev,l=this._w;if(this._readPins(),this._readRow0Into(o,c,s),this.wind>0){const G=this._t*.6;for(let q=0;q<r;q++){const Z=q*3,X=o[Z]*.6+this._nx,j=o[Z+1]*.6+this._ny,Q=o[Z+2]*.6+this._nz;this._colTurb[Z]=nn(X+G,j,Q)*2-1,this._colTurb[Z+1]=(nn(X,j+G,Q+11.3)*2-1)*.6,this._colTurb[Z+2]=nn(X,j,Q+G+7.7)*2-1}}const h=Math.pow(1-this.damping,t),u=this._prevDt>1e-8?1/this._prevDt:1/t,d=this.gravity,f=this._invMass,g=n?-n.x:0,_=n?-n.y+d:d,m=n?-n.z:0,p=this.wind>0?this.wind*Q1*f:0,v=p*.15,x=this.drag*f,S=.9/t,w=this._nrm,T=this._colTurb,E=p>0,A=this._maxMove;for(let D=r;D<a;D++){if(l[D]===0)continue;const G=D*3;let q=(o[G]-c[G])*u,Z=(o[G+1]-c[G+1])*u,X=(o[G+2]-c[G+2])*u;const j=q*q+Z*Z+X*X;if(j>Fs*Fs){const V=Fs/Math.sqrt(j);q*=V,Z*=V,X*=V}let Q=g,st=_,k=m;if(E){const V=D%r*3,St=this.windVector.x+T[V]*1.6-q,ut=this.windVector.y+T[V+1]*1.6-Z,_t=this.windVector.z+T[V+2]*1.6-X,pt=w[G],Ct=w[G+1],Lt=w[G+2];let I=pt*St+Ct*ut+Lt*_t;I>12?I=12:I<-12&&(I=-12),Q+=pt*I*p+St*v,st+=Ct*I*p+ut*v,k+=Lt*I*p+_t*v}if(x>0){const V=Math.hypot(q,Z,X);if(V>1e-6){let St=x*V;St>S&&(St=S),Q-=q*St,st-=Z*St,k-=X*St}}let Y=q*t*h+Q*t*t,nt=Z*t*h+st*t*t,rt=X*t*h+k*t*t;const ht=Y*Y+nt*nt+rt*rt;if(ht>A*A){const V=A/Math.sqrt(ht);Y*=V,nt*=V,rt*=V}c[G]=o[G],c[G+1]=o[G+1],c[G+2]=o[G+2],o[G]+=Y,o[G+1]+=nt,o[G+2]+=rt}const M=this._ca,y=this._cb,C=this._crest,U=this._cactive,H=this._k,P=M.length,F=this._ba,B=this._bb,N=this._brest,z=F.length;for(let D=0;D<this._iters;D++){for(let q=0;q<P;q++){if(U[q]===0)continue;const Z=M[q],X=y[q],j=l[Z],Q=l[X],st=j+Q;if(st<=0)continue;const k=Z*3,Y=X*3,nt=o[Y]-o[k],rt=o[Y+1]-o[k+1],ht=o[Y+2]-o[k+2],V=nt*nt+rt*rt+ht*ht;if(V<1e-16)continue;const St=Math.sqrt(V),ut=C[q],_t=(St-ut)/St*H,pt=_t*j/st,Ct=_t*Q/st;j>0&&(o[k]+=nt*pt,o[k+1]+=rt*pt,o[k+2]+=ht*pt),Q>0&&(o[Y]-=nt*Ct,o[Y+1]-=rt*Ct,o[Y+2]-=ht*Ct)}const G=this._kBend;if(G>0)for(let q=0;q<z;q++){const Z=F[q],X=B[q],j=l[Z],Q=l[X],st=j+Q;if(st<=0)continue;const k=Z*3,Y=X*3,nt=o[Y]-o[k],rt=o[Y+1]-o[k+1],ht=o[Y+2]-o[k+2],V=nt*nt+rt*rt+ht*ht;if(V<1e-16)continue;const St=N[q];if(V>=St*St)continue;const ut=Math.sqrt(V),_t=(ut-St)/ut*G,pt=_t*j/st,Ct=_t*Q/st;j>0&&(o[k]+=nt*pt,o[k+1]+=rt*pt,o[k+2]+=ht*pt),Q>0&&(o[Y]-=nt*Ct,o[Y+1]-=rt*Ct,o[Y+2]-=ht*Ct)}this._collide(e)}this.tearable&&this._settle===0?this._tear():this._settle>0&&this._settle--,this._clampLinks(),this._collide(e),this._clampLinks(),this._prevDt=t,this._computeNormals(),this._publish()}_collide(t){if(!t)return;const e=this.cols,n=this.count,s=this._pos,r=this._prev,a=this._w,o=this._maxPush;for(let c=0;c<t.length;c++){const l=t[c];for(let h=e;h<n;h++){if(a[h]===0)continue;const u=h*3,d=s[u],f=s[u+1],g=s[u+2];if(Fe.set(d,f,g),!l.resolve(Fe,dd))continue;let _=Fe.x-d,m=Fe.y-f,p=Fe.z-g;const v=_*_+m*m+p*p;if(v>o*o){const x=o/Math.sqrt(v);_*=x,m*=x,p*=x}s[u]=d+_,s[u+1]=f+m,s[u+2]=g+p,r[u]+=(s[u]-r[u])*_o,r[u+1]+=(s[u+1]-r[u+1])*_o,r[u+2]+=(s[u+2]-r[u+2])*_o}}}_clampLinks(){const t=this._pos,e=this._w,n=this._ca,s=this._cb,r=this._crest,a=this._cactive,o=n.length,c=this._maxStretch;for(let l=0;l<3;l++)for(let h=0;h<o;h++){const u=l&1?o-1-h:h;if(a[u]===0)continue;const d=n[u],f=s[u],g=e[d],_=e[f],m=g+_;if(m<=0)continue;const p=d*3,v=f*3,x=t[v]-t[p],S=t[v+1]-t[p+1],w=t[v+2]-t[p+2],T=Math.sqrt(x*x+S*S+w*w),E=r[u]*c;if(T>E&&T>1e-9){const A=(T-E)/T/m,M=A*g,y=A*_;t[p]+=x*M,t[p+1]+=S*M,t[p+2]+=w*M,t[v]-=x*y,t[v+1]-=S*y,t[v+2]-=w*y}}}_readRow0Into(t,e,n){const s=this.cols,r=this._row0Tgt;this._row0Target(r);for(let a=0;a<s;a++){const o=a*3;e[o]=t[o],e[o+1]=t[o+1],e[o+2]=t[o+2],n>=1?(t[o]=r[o],t[o+1]=r[o+1],t[o+2]=r[o+2],this._row0Prev[o]=r[o],this._row0Prev[o+1]=r[o+1],this._row0Prev[o+2]=r[o+2]):(t[o]=this._row0Prev[o]+(r[o]-this._row0Prev[o])*n,t[o+1]=this._row0Prev[o+1]+(r[o+1]-this._row0Prev[o+1])*n,t[o+2]=this._row0Prev[o+2]+(r[o+2]-this._row0Prev[o+2])*n)}}_tear(){const t=this._ca,e=this._cb,n=this._crest,s=this._cactive,r=this._ctear,a=this._links,o=this._pos;a.fill(0);for(let c=0;c<t.length;c++)s[c]!==0&&(a[t[c]]++,a[e[c]]++);for(let c=0;c<t.length;c++){if(s[c]===0)continue;const l=t[c],h=e[c];if(a[l]<=3||a[h]<=3)continue;const u=l*3,d=h*3,f=o[d]-o[u],g=o[d+1]-o[u+1],_=o[d+2]-o[u+2];Math.sqrt(f*f+g*g+_*_)>n[c]*r[c]&&(s[c]=0,a[l]--,a[h]--)}}_computeNormals(){const t=this.cols,e=this.rows,n=this._pos,s=this._nrm;for(let r=0;r<e;r++){const a=r>0?r-1:r,o=r<e-1?r+1:r;for(let c=0;c<t;c++){const l=c>0?c-1:c,h=c<t-1?c+1:c,u=(r*t+l)*3,d=(r*t+h)*3,f=(a*t+c)*3,g=(o*t+c)*3,_=n[d]-n[u],m=n[d+1]-n[u+1],p=n[d+2]-n[u+2],v=n[g]-n[f],x=n[g+1]-n[f+1],S=n[g+2]-n[f+2];let w=m*S-p*x,T=p*v-_*S,E=_*x-m*v;const A=Math.sqrt(w*w+T*T+E*E),M=(r*t+c)*3;if(A>1e-12){const y=1/A;w*=y,T*=y,E*=y}else w=0,T=0,E=1;s[M]=w,s[M+1]=T,s[M+2]=E}}}_publish(){const t=this._out,e=this._pos;for(let n=0;n<t.length;n++)t[n]=e[n]}isFinite(){const t=this._pos,e=t.length-3;return Number.isFinite(t[e])&&Number.isFinite(t[e+1])&&Number.isFinite(t[e+2])}}class lv extends je{constructor(t,e){const n=e||{},s=t.points.length,r=Math.max(3,Math.round(n.radialSegments===void 0?5:n.radialSegments)),a=s*r,o=a+2,c=(s-1)*r*2+r*2,l=new Float32Array(o*3),h=new Float32Array(o*3),u=new Float32Array(o*2),d=o>65535?Uint32Array:Uint16Array,f=new d(c*3);let g=0;for(let w=0;w<s-1;w++)for(let T=0;T<r;T++){const E=(T+1)%r,A=w*r+T,M=w*r+E,y=(w+1)*r+T,C=(w+1)*r+E;f[g++]=A,f[g++]=y,f[g++]=M,f[g++]=M,f[g++]=y,f[g++]=C}const _=a,m=a+1;for(let w=0;w<r;w++){const T=(w+1)%r;f[g++]=_,f[g++]=T,f[g++]=w,f[g++]=m,f[g++]=(s-1)*r+w,f[g++]=(s-1)*r+T}for(let w=0;w<s;w++){const T=w/(s-1);for(let E=0;E<r;E++){const A=(w*r+E)*2;u[A]=E/r,u[A+1]=T}}u[_*2]=.5,u[m*2]=.5,u[m*2+1]=1;const p=new de,v=new re(l,3),x=new re(h,3);v.setUsage(vr),x.setUsage(vr),p.setAttribute("position",v),p.setAttribute("normal",x),p.setAttribute("uv",new re(u,2)),p.setIndex(new re(f,1));const S=!n.material;super(p,n.material||new Lo({color:7035460,roughness:.85})),this.strand=t,this.radialSegments=r,this.radius=n.radius===void 0?.01:n.radius,this.taper=n.taper===void 0?1:n.taper,this._n=s,this._ringVerts=a,this._posAttr=v,this._nrmAttr=x,this._ownsMaterial=S,this.frustumCulled=!1,this._cos=new Float32Array(r),this._sin=new Float32Array(r);for(let w=0;w<r;w++){const T=w/r*Math.PI*2;this._cos[w]=Math.cos(T),this._sin[w]=Math.sin(T)}this._nrmRef=new b,this.sync()}sync(){const t=this.strand.points,e=this._n,n=this.radialSegments,s=this._posAttr.array,r=this._nrmAttr.array,a=this._cos,o=this._sin,c=this._nrmRef;let l=!1;for(let d=0;d<e;d++){const f=t[d];if(!Number.isFinite(f.x))return;d===0?xn.subVectors(t[1],t[0]):d===e-1?xn.subVectors(t[e-1],t[e-2]):xn.subVectors(t[d+1],t[d-1]),xn.lengthSq()<1e-16?xn.set(0,1,0):xn.normalize(),l?(Kh.setFromUnitVectors($h,xn),c.applyQuaternion(Kh),c.addScaledVector(xn,-c.dot(xn)),c.lengthSq()<1e-12?dc(xn,c):c.normalize()):(dc(xn,c),l=!0),$h.copy(xn),po.crossVectors(xn,c);const g=this.radius*(1+(this.taper-1)*(d/(e-1)));for(let _=0;_<n;_++){const m=c.x*a[_]+po.x*o[_],p=c.y*a[_]+po.y*o[_],v=c.z*a[_]+po.z*o[_],x=(d*n+_)*3;s[x]=f.x+m*g,s[x+1]=f.y+p*g,s[x+2]=f.z+v*g,r[x]=m,r[x+1]=p,r[x+2]=v}}const h=this._ringVerts*3,u=h+3;an.subVectors(t[1],t[0]),an.lengthSq()<1e-16?an.set(0,1,0):an.normalize(),s[h]=t[0].x,s[h+1]=t[0].y,s[h+2]=t[0].z,r[h]=-an.x,r[h+1]=-an.y,r[h+2]=-an.z,an.subVectors(t[e-1],t[e-2]),an.lengthSq()<1e-16?an.set(0,1,0):an.normalize(),s[u]=t[e-1].x,s[u+1]=t[e-1].y,s[u+2]=t[e-1].z,r[u]=an.x,r[u+1]=an.y,r[u+2]=an.z,this._posAttr.needsUpdate=!0,this._nrmAttr.needsUpdate=!0}dispose(){this.geometry.dispose(),this._ownsMaterial&&this.material.dispose()}}class hv extends je{constructor(t,e){const n=e||{},s=t.cols,r=t.rows,a=s*r,o=new Float32Array(a*2);for(let x=0;x<r;x++)for(let S=0;S<s;S++){const w=(x*s+S)*2;o[w]=S/(s-1),o[w+1]=1-x/(r-1)}const c=t.slit,l=(x,S)=>!!c&&x===c.col&&S>=c.fromRow;let h=0;for(let x=0;x<r-1;x++)for(let S=0;S<s-1;S++)l(S,x)||h++;const u=a>65535?Uint32Array:Uint16Array,d=new u(h*6);let f=0;for(let x=0;x<r-1;x++)for(let S=0;S<s-1;S++){if(l(S,x))continue;const w=x*s+S,T=w+1,E=w+s,A=E+1;d[f++]=w,d[f++]=E,d[f++]=T,d[f++]=T,d[f++]=E,d[f++]=A}const g=new de,_=new re(t.positions,3),m=new re(t.normals,3);_.setUsage(vr),m.setUsage(vr),g.setAttribute("position",_),g.setAttribute("normal",m),g.setAttribute("uv",new re(o,2)),g.setIndex(new re(d,1));const p=!n.material,v=n.material||new Lo({color:8010566,roughness:.92,side:Mn});super(g,v),this.material.side=Mn,this.cloth=t,this._posAttr=_,this._nrmAttr=m,this._ownsMaterial=p,this.frustumCulled=!1}sync(){this._posAttr.needsUpdate=!0,this._nrmAttr.needsUpdate=!0}dispose(){this.geometry.dispose(),this._ownsMaterial&&this.material.dispose()}}class uv{constructor({gravity:t=-9.8,substeps:e=2,wind:n=.4,maxDt:s=1/30}={}){this.gravity=t,this.substeps=Os(Math.round(e)||1,1,8),this.wind=n,this.maxDt=s>0?s:1/30,this.colliders=[],this.strands=[],this.cloths=[],this.meshes=[],this.velocity=new b,this.accel=new b,this._vPrev=new b,this._accelRaw=new b,this._wind=new b,this._time=0,this._frame=0}addCollider(t){return t&&this.colliders.push(t),t}addStrand(t){return t&&(t._gravitySet||(t.gravity=this.gravity),this.strands.push(t),t)}addCloth(t){return t&&(t._gravitySet||(t.gravity=this.gravity),this.cloths.push(t),t)}addMesh(t){return t&&this.meshes.push(t),t}setCharacterVelocity(t){return t&&Number.isFinite(t.x)&&Number.isFinite(t.y)&&Number.isFinite(t.z)&&this.velocity.copy(t),this}step(t){if(!Number.isFinite(t)||t<=0){this._updateColliders(),this._syncMeshes();return}t>this.maxDt&&(t=this.maxDt),this._time+=t,this._frame++,this._accelRaw.subVectors(this.velocity,this._vPrev).multiplyScalar(1/t);const e=this._accelRaw.length();Number.isFinite(e)?e>jh&&this._accelRaw.multiplyScalar(jh/e):this._accelRaw.set(0,0,0),this.accel.lerp(this._accelRaw,1-Math.pow(1e-6,t)),this._vPrev.copy(this.velocity);const n=this._time*.12;mo.set(nn(n,.3,.7)*2-1,(nn(.9,n,2.1)*2-1)*.35,nn(4.2,1.5,n)*2-1),mo.multiplyScalar(this.wind*tv),mo.addScaledVector(this.velocity,-1),this._wind.copy(mo);const s=this.strands,r=this.cloths;for(let c=0;c<s.length;c++)s[c].windVector.copy(this._wind);for(let c=0;c<r.length;c++)r[c].windVector.copy(this._wind);this._updateColliders();const a=this.substeps,o=t/a;for(let c=0;c<a;c++){const l=(c+1)/a;for(let h=0;h<s.length;h++)s[h]._subAlpha=l,s[h].step(o,this.colliders,this.accel);for(let h=0;h<r.length;h++)r[h]._subAlpha=l,r[h].step(o,this.colliders,this.accel)}for(let c=0;c<s.length;c++)s[c].isFinite()||s[c].reset();for(let c=0;c<r.length;c++)r[c].isFinite()||r[c].reset();this._syncMeshes()}_updateColliders(){const t=this.colliders;for(let e=0;e<t.length;e++)t[e].update()}_syncMeshes(){const t=this.meshes;for(let e=0;e<t.length;e++)t[e].sync()}reset(){this._updateColliders();for(let t=0;t<this.strands.length;t++)this.strands[t].reset();for(let t=0;t<this.cloths.length;t++)this.cloths[t].reset();this.velocity.set(0,0,0),this._vPrev.set(0,0,0),this.accel.set(0,0,0),this._time=0,this._frame=0,this._syncMeshes()}dispose(){for(let t=0;t<this.meshes.length;t++){const e=this.meshes[t];e.dispose&&e.dispose(),e.parent&&e.parent.remove(e)}this.meshes.length=0,this.strands.length=0,this.cloths.length=0,this.colliders.length=0}}const qa=new b,Ya=new b,Zh=new b,Jh=new qt,ja=i=>i instanceof b?i.clone():new b().fromArray(i);function Hn(i,t,e,n=""){const s=ja(t).normalize(),r=ja(e);if(r.addScaledVector(s,-r.dot(s)),r.lengthSq()<1e-12)throw new Error(`attach: frame "${n}" has a normal parallel to its axis`);return{origin:ja(i),axis:s,normal:r.normalize(),label:n}}function Qh(i,t=new ie){return qa.copy(i.axis),Ya.copy(i.normal),Zh.crossVectors(qa,Ya),Jh.makeBasis(qa,Ya,Zh),t.setFromRotationMatrix(Jh)}function dv(i,t,{roll:e=0,slide:n=0,lift:s=0}={}){const r=Qh(i),a=Qh(t),o=r.multiply(a.invert());return e&&o.premultiply(new ie().setFromAxisAngle(i.axis,e)),{position:i.origin.clone().addScaledVector(i.axis,n).addScaledVector(i.normal,s).sub(t.origin.clone().applyQuaternion(o)),quaternion:o}}const $a=new Map;function fv(i){if($a.has(i))return $a.get(i);const{root:t,byName:e}=od(),n={};Ji(n,i,1);for(const[_,m]of Object.entries(n))e[_].quaternion.copy(m);t.updateMatrixWorld(!0);const s=e[`hand${i}`],r=new qt().copy(s.matrixWorld).invert(),a=_=>new b().setFromMatrixPosition(e[_].matrixWorld).applyMatrix4(r),o=new b;for(const _ of["index","mid","ring"])o.add(a(`${_}${i}0`));o.divideScalar(3);const c=o.length(),l=o.clone().normalize(),h=a(`index${i}0`).sub(a(`ring${i}0`)).normalize(),u=new b().crossVectors(l,h).multiplyScalar(i==="L"?1:-1).normalize();let d=0,f=0;for(const _ of["index","mid","ring"]){const m=a(`${_}${i}2`);d+=m.dot(u),f+=m.dot(l)}const g={span:c,fingers:l,axis:h,normal:u,depth:d/3/2,along:(c+f/3)/2,enclosed:d/3/2};return $a.set(i,g),g}function pv(i,{gripRadius:t=.014}={}){const{span:e,fingers:n,axis:s,normal:r,depth:a,along:o,enclosed:c}=fv(i),l=new b().addScaledVector(n,o).addScaledVector(r,a);return t>c&&console.warn(`attach: a ${(t*1e3).toFixed(1)} mm grip does not fit the ${i} fist, which closes around ${(c*1e3).toFixed(1)} mm`),{...Hn(l,s,r,`grip${i}`),fingers:n,span:e,enclosed:c,slack:c-t}}function mv(i,{along:t=.55,clearance:e=.045,rest:n=Js()}={}){const s=n[`forearm${i}`],r=n[`hand${i}`],a=new b().subVectors(r,s),o=a.length();a.normalize();const c=new b(0,1,0),l=new b().addScaledVector(a,o*t).addScaledVector(c,e);return{...Hn(l,c,a,`strap${i}`),length:o}}const tu=180/Math.PI;function gv(i,t,e){const n=t.axis.clone().applyQuaternion(e.quaternion),s=t.normal.clone().applyQuaternion(e.quaternion),r=t.origin.clone().applyQuaternion(e.quaternion).add(e.position),a=new b().subVectors(r,i.origin);return{axisDeg:n.angleTo(i.axis)*tu,rollDeg:s.angleTo(i.normal)*tu,offset:a.length(),alongAxis:a.dot(i.axis),alongNormal:a.dot(i.normal),origin:r,axis:n}}function _v(i,t){return`${i.padEnd(10)} axis ${t.axisDeg.toFixed(1).padStart(6)}°  roll ${t.rollDeg.toFixed(1).padStart(6)}°  offset ${(t.offset*1e3).toFixed(1).padStart(5)} mm`}const K=(i,t,e)=>new b(i,t,e),Ft=(i,t)=>new ot(i,t);function fd(i){return t=>{if(t<=i[0][0])return i[0][1];for(let e=1;e<i.length;e++)if(t<=i[e][0]){const[n,s]=i[e-1],[r,a]=i[e];return s+(a-s)*yt(n,r,t)}return i[i.length-1][1]}}function xi(i){let t=0;for(let e=0;e<i.length;e++){const n=i[e],s=i[(e+1)%i.length];t+=n.x*s.y-s.x*n.y}return t>0?i.slice().reverse():i}function pd(i){const t=i.index;if(t){const e=t.array;for(let n=0;n<e.length;n+=3){const s=e[n+1];e[n+1]=e[n+2],e[n+2]=s}t.needsUpdate=!0}return i.computeVertexNormals(),i}function fc(i,{capStart:t=!0,capEnd:e=!0,uvScale:n=[1,1]}={}){const s=i.length,r=i[0].length,a=[],o=[],c=[],l=(d,f,g)=>{a.push(d.x,d.y,d.z),o.push(f*n[0],g*n[1])};for(let d=0;d<s;d++){const f=s===1?0:d/(s-1);for(let g=0;g<=r;g++)l(i[d][g%r],g/r,f)}for(let d=0;d<s-1;d++){const f=d*(r+1),g=(d+1)*(r+1);for(let _=0;_<r;_++)c.push(f+_,g+_,f+_+1),c.push(f+_+1,g+_,g+_+1)}const h=(d,f)=>{const g=new b;for(const p of d)g.add(p);g.multiplyScalar(1/d.length);const _=a.length/3;l(g,.5,.5);const m=a.length/3;for(let p=0;p<=r;p++){const v=p/r*Math.PI*2;l(d[p%r],.5+Math.cos(v)*.5,.5+Math.sin(v)*.5)}for(let p=0;p<r;p++)f?c.push(_,m+p+1,m+p):c.push(_,m+p,m+p+1)};t&&h(i[0],!0),e&&h(i[s-1],!1);const u=new de;return u.setAttribute("position",new Jt(a,3)),u.setAttribute("uv",new Jt(o,2)),u.setIndex(c),u.computeVertexNormals(),u}function Do({path:i,up:t,profile:e,capStart:n=!0,capEnd:s=!0}){const r=i.length,a=[],o=new b;for(let c=0;c<r;c++){const l=r===1?0:c/(r-1);o.subVectors(i[Math.min(r-1,c+1)],i[Math.max(0,c-1)]),o.lengthSq()<1e-14&&o.set(0,1,0),o.normalize();const h=t(l,c).clone();h.addScaledVector(o,-h.dot(o)),h.lengthSq()<1e-12&&h.set(1,0,0),h.normalize();const u=new b().crossVectors(o,h);a.push(e(l,c).map(d=>i[c].clone().addScaledVector(h,d.x).addScaledVector(u,d.y)))}return fc(a,{capStart:n,capEnd:s})}function ti(i=.0038,t=.0022,e=6){return hn([Ft(0,-8e-4),Ft(i*1.12,-8e-4),Ft(i,t*.34),Ft(i*.64,t*.84),Ft(0,t)],e)}function mi(i,t=.0016,e=1){const n=pn(e),s=n()*20,r=3+n()*2,a=t1(i,o=>t*(.7+.55*(.5+.5*Math.sin(o*34+s))+.12*Math.sin(o*r)),6);return pd(a)}function Hi(i,t){return xi([Ft(i,-t*.62),Ft(i,t*.62),Ft(i*.25,t),Ft(-i,t*.62),Ft(-i,-t*.62),Ft(-i*.25,-t)])}function Bc(){const i=new Map;return{add(t,e){return t&&(i.has(e)||i.set(e,[]),i.get(e).push(t),t)},parts(t){const e=[];for(const[n,s]of i){const r=me(s);r&&(t!==1&&r.scale(t,t,t),n1(r),e.push({geometry:r,material:n}))}return e}}}function Dn(i,t){return{pos:i,dir:t.clone().normalize()}}function xv(i){const t=[];let e=0;for(let s=1;s<i.length;s++){const r=i[s].distanceTo(i[s-1]);t.push(r),e+=r}let n=0;for(let s=0;s<t.length;s++){if(n+t[s]>=e/2)return i[s].clone().lerp(i[s+1],(e/2-n)/t[s]);n+=t[s]}return i[i.length-1].clone()}function zc(i,t){if(t===1)return i;i.length*=t,i.gripRadius*=t;for(const e of Object.values(i.anchors))e.pos.multiplyScalar(t);for(const e of Object.values(i.plugs))e.origin.multiplyScalar(t);if(i.emissivePaths)for(const e of i.emissivePaths)for(const n of e)n.multiplyScalar(t);return i}const md={baseY:.058,tipY:.398,guardY:.05,gripTop:.044,gripBot:-.052,gripR:.0122,strapT:.002},Ts=[0,.14,.32,.52,.72,.87],gd=fd([[0,.019],[.14,.027],[.34,.039],[.55,.054],[.74,.066],[.86,.071],[.93,.062],[1,.022]]),xo=fd([[0,-.021],[.2,-.026],[.45,-.03],[.6,-.033],[.665,-.066],[.84,-.072],[.885,-.048],[.93,-.016],[1,.012]]);function vv(i){const t=[];let e=.04;for(;e<.985&&(e+=.022+i()*.1,!(e>.985));){const n=i()<.32;t.push({c:e,w:(n?.012:.004)+i()*(n?.016:.008),d:(n?.005:.0012)+i()*i()*(n?.01:.004)})}return t}function eu(i,t){let e=0;for(const n of i){const s=Math.abs(t-n.c)/n.w;s>=1||(e=Math.max(e,n.d*yt(1,.85,s)))}return e}function Mv(i){const{baseY:t,tipY:e}=md,n=e-t,s=new Set([0,1]);for(let d=1;d<18;d++)s.add(d/18);for(const d of[.58,.615,.65,.685,.83,.855,.88,.91,.945,.975])s.add(d);for(const d of i)for(const f of[-1,-.86,.86,1]){const g=d.c+d.w*f;g>.002&&g<.998&&s.add(g)}const r=[...s].sort((d,f)=>d-f),a=r.map(d=>K(.0016*d*d,t+n*d,0)),o=d=>.0064*(1-.34*d)*(1-.72*yt(.86,1,d)),c=d=>.0021*yt(.01,.09,d)*yt(.78,.64,d),l=d=>.0042*yt(.005,.05,d)*yt(.84,.72,d),u=fe({path:a,profile:(d,f)=>{const g=r[f],_=xo(g),m=gd(g),p=m-eu(i,g),v=o(g),x=c(g),S=l(g),w=55e-5+eu(i,g)*.11,T=y=>{let C=v*(1-.16*y*y)*(1-.84*yt(.55,1,y));return C-=x*Math.exp(-(((y-.36)/.15)**2)),Math.max(C,w*1.1)},E=y=>Math.min(_+(m-_)*y,p),A=T(0),M=[Ft(_,A)];for(let y=1;y<Ts.length;y++)M.push(Ft(E(Ts[y]),T(Ts[y])));M.push(Ft(p,w),Ft(p,-w));for(let y=Ts.length-1;y>=1;y--)M.push(Ft(E(Ts[y]),-T(Ts[y])));return M.push(Ft(_,-A)),M.push(Ft(_+S,-A*.55),Ft(_+S,A*.55)),xi(M)},uvScale:[1,6]});return pe(u,{amp:55e-5,freq:9,seed:23,mask:d=>yt(.0012,.0038,Math.abs(d.x))}),{geo:u,path:a,grooveDepth:l,spineThick:o}}function yv(i={}){const{seed:t=4172,scale:e=1}=i,n=pn(t),s=Bc(),{baseY:r,tipY:a,guardY:o,gripTop:c,gripBot:l,gripR:h,strapT:u}=md,d=a-r,f=vv(n),g=Mv(f);s.add(g.geo,"metal");const _=.03,m=.78,p=30,v=[];for(let k=0;k<p;k++){const Y=_+(m-_)*(k/(p-1));v.push(K(.0016*Y*Y,r+d*Y,xo(Y)+.0026))}const x=fe({path:v,profile:k=>{const Y=_+(m-_)*k,nt=g.spineThick(Y)*.5;return xi(_i(.0032,nt*2,.7,8))}});s.add(x,"emissive");for(let k=0;k<3;k++){const Y=.18+k*.24+n()*.04,nt=r+d*Y,rt=xo(Y)+.0026,ht=vt(new cn(.0026,.0032,.013,6),{pos:K(0,nt,rt),rot:[0,0,Math.PI/2]});s.add(ht,"brass")}const S=.0056,w=ge(.0028,.05,.032,.0012,2);vt(w,{pos:K(S,r+d*.17,.001),rot:[.06,.05,.11]}),s.add(w,"metal");const T=[];for(let k=0;k<=14;k++){const Y=k/14*Math.PI*2,nt=Math.cos(Y),rt=Math.sin(Y);T.push(K(S-6e-4,r+d*.17+Math.sign(rt)*Math.abs(rt)**.6*.026,.001+Math.sign(nt)*Math.abs(nt)**.6*.017))}s.add(mi(T,.0016,31),"metalDark");const E=ge(.0012,.03,.0016,4e-4,1);vt(E,{pos:K(.0052,r+d*.29,.012),rot:[0,0,.5]}),s.add(E,"metalDark");const A=[[.09,.004,.0042],[.145,-.008,.0032],[.2,.011,.0046],[.26,-.002,.0034],[.115,.019,.0029]];for(const[k,Y,nt]of A){const rt=r+d*k,ht=(xo(k)+gd(k))*.35+Y;for(const V of[1,-1]){if(V<0&&n()<.3)continue;const St=ti(nt*(.9+n()*.3),.0022,6);vt(St,{pos:K(V*.0058,rt,ht),rot:[0,0,V>0?-Math.PI/2:Math.PI/2]}),s.add(St,n()<.4?"brass":"metalDark")}}for(let k=0;k<4;k++){const Y=r+d*.17+(k<2?.019:-.019),nt=.001+(k%2?.011:-.011),rt=ti(.0034+n()*8e-4,.0024,6);vt(rt,{pos:K(S+.0016,Y,nt),rot:[0,0,-Math.PI/2]}),s.add(rt,"brass")}const M=Se([K(.005,o-.007,-.05),K(.0015,o+.002,-.024),K(0,o+.006,0),K(-.0025,o+.002,.03),K(-.009,o-.011,.061)],16),y=fe({path:M,upHint:K(0,1,0),profile:k=>{const Y=.013+.005*Math.exp(-(((k-.5)/.16)**2)),nt=.019+.004*Math.exp(-(((k-.5)/.2)**2));return xi(_i(Y,nt,.72,12))}});pe(y,{amp:4e-4,freq:60,seed:44}),s.add(y,"metal");const C=fe({path:M.slice(3,13),upHint:K(0,1,0),profile:()=>xi(_i(.02,.007,.7,8))});s.add(C,"metalDark");for(const k of[M[1],M[14]]){const Y=vt(new cn(.0044,.0048,.026,6),{pos:k.clone(),rot:[0,0,Math.PI/2]});s.add(Y,"brass")}s.add(mi([K(.004,o+.008,-.018),K(0,o+.01,0),K(-.004,o+.008,.02)],.0018,52),"metalDark");const U=fe({path:[K(0,l-.004,0),K(0,0,0),K(0,c+.008,0)],profile:k=>xi(_i(.023,.0205,.55,12).map(Y=>Y.multiplyScalar(1-.1*Math.abs(k-.5))))});s.add(U,"metalDark");const H=8,F=H*7+1,B=[],N=[];for(let k=0;k<F;k++){const Y=k/(F-1),nt=Y*H*Math.PI*2,rt=l+.004+(c-l-.008)*Y,ht=K(Math.cos(nt),0,Math.sin(nt)),V=h+9e-4*Math.sin(Y*Math.PI);B.push(K(ht.x*V,rt,ht.z*V)),N.push(ht)}const z=Do({path:B,up:(k,Y)=>N[Y],profile:k=>Hi(u,.0053*(1-.25*yt(.9,1,k)))});pe(z,{amp:4e-4,freq:90,seed:61}),s.add(z,"leather");for(const[k,Y]of[[l+.001,1],[c+.002,-1]]){const rt=[],ht=[];for(let V=0;V<14;V++){const St=V/13,ut=St*3*Math.PI*2,_t=K(Math.cos(ut),0,Math.sin(ut)),pt=h+u*.7;rt.push(K(_t.x*pt,k+Y*St*.008,_t.z*pt)),ht.push(_t)}s.add(Do({path:rt,up:(V,St)=>ht[St],profile:()=>Hi(.0011,.0013)}),"cloth")}const D=fe({path:Se([K(h*.6,c+.004,h*.6),K(.016,c+.012,.012),K(.021,c+.006,.02)],8),profile:k=>Hi(.0012,.0052*(1-.5*k))});s.add(D,"leather");const G=hn([Ft(0,0),Ft(.0185,0),Ft(.019,.0022),Ft(.0175,.005),Ft(0,.005)],10);vt(G,{pos:K(0,l-.006,0)}),s.add(G,"metal");const q=vt(new cn(.0155,.017,.019,6),{pos:K(0,l-.0155,0),rot:[0,.3,.04]});s.add(q,"metalDark");const Z=vt(new cn(.0062,.007,.009,8),{pos:K(0,l-.029,0)});s.add(Z,"metal");const X=vt(new wr(.0072,.0021,5,12),{pos:K(0,l-.038,0),rot:[0,Math.PI/2,0]});s.add(X,"brass"),s.add(fe({path:Se([K(0,l-.043,.002),K(.006,l-.056,-.006),K(.003,l-.07,.004),K(-.005,l-.079,-.002)],10),profile:k=>Hi(9e-4,.006*(1-.55*k))}),"cloth");const j=l-.042,Q=(l+c)/2,st={parts:s.parts(e),length:a,gripRadius:.0145,plugs:{grip:Hn(K(0,Q,0),K(0,1,0),K(0,0,1),"cleaverGrip")},anchors:{pommel:Dn(K(0,l-.024,0),K(0,-1,0)),lanyard:Dn(K(0,j,0),K(0,-1,0)),tip:Dn(K(.0016,a,.02),K(0,1,0)),guard:Dn(K(0,o+.006,0),K(0,0,1))},emissivePaths:[v.map(k=>k.clone().setZ(k.z-.0016))]};return zc(st,e)}const bv={gripBot:-.062,gripTop:.01,recvBot:.004,recvTop:.112,brakeTop:.156,recvZ:.006,coilZ:.043};function Sv(i={}){const{seed:t=9091,scale:e=1}=i,n=pn(t),s=Bc(),{gripBot:r,gripTop:a,recvBot:o,recvTop:c,brakeTop:l,recvZ:h,coilZ:u}=bv,d=Se([K(0,r,-.024),K(0,-.04,-.016),K(0,-.016,-.006),K(0,a,.002)],10),f=Do({path:d,up:()=>K(0,0,1),profile:k=>{const Y=.0155+.0035*Math.sin(k*Math.PI)-.003*yt(.78,1,k),nt=.0108+.003*yt(.22,0,k);return xi(_i(Y*2,nt*2,.66,14))}});pe(f,{amp:4e-4,freq:70,seed:12}),s.add(f,"metalDark");const g=-.03,_=ge(.03,.019,.021,.0022,2);vt(_,{pos:K(0,g,-.01),rot:[.06,0,.03]}),s.add(_,"emissive");const m=ge(.0306,.0105,.0115,.0015,1);vt(m,{pos:K(0,g,-.01)}),s.add(m,"glass");for(const k of[1,-1])for(const[Y,nt,rt,ht]of[[.011,0,.004,.023],[-.011,0,.004,.023],[0,.012,.026,.004],[0,-.012,.026,.004]]){const V=ge(.005,rt,ht,.0012,1);vt(V,{pos:K(k*.0135,g+Y,-.01+nt)}),s.add(V,"metal")}const p=ge(.03,c-o,.046,.005,3);vt(p,{pos:K(0,(o+c)/2,h)}),pe(p,{amp:9e-4,freq:26,seed:5}),s.add(p,"metal");const v=ge(.018,.09,.011,.0022,2);vt(v,{pos:K(0,.058,.032)}),s.add(v,"metalDark");const x=ge(.0026,.03,.024,.001,2);vt(x,{pos:K(.0163,.078,.004),rot:[.09,0,.05]}),s.add(x,"metal");const S=[];for(let k=0;k<=12;k++){const Y=k/12*Math.PI*2;S.push(K(.0152,.078+Math.sign(Math.sin(Y))*Math.abs(Math.sin(Y))**.6*.0155,.004+Math.sign(Math.cos(Y))*Math.abs(Math.cos(Y))**.6*.0125))}s.add(mi(S,.0013,17),"metalDark");for(let k=0;k<4;k++){const Y=ti(.0029+n()*9e-4,.002,6);vt(Y,{pos:K(.0176,.078+(k<2?.011:-.011),.004+(k%2?.008:-.008)),rot:[0,0,-Math.PI/2]}),s.add(Y,"brass")}for(let k=0;k<5;k++){const Y=ti(.0026+n()*.001,.0018,6),nt=n()<.5?1:-1;vt(Y,{pos:K(nt*.0154,.02+n()*.085,h+(n()-.5)*.03),rot:[0,0,nt>0?-Math.PI/2:Math.PI/2]}),s.add(Y,n()<.5?"brass":"metalDark")}s.add(mi(Se([K(.006,g+.012,-.026),K(.009,-.008,-.021),K(.008,.02,-.019),K(.004,.06,-.018),K(.001,.094,-.012)],14),.0022,64),"brass");for(const k of[.01,.056,.092]){const Y=ge(.009,.005,.006,.0011,1);vt(Y,{pos:K(.006,k,-.018)}),s.add(Y,"metalDark")}const w=ge(.004,.02,.014,8e-4,1);vt(w,{pos:K(.0146,.045,.008),rot:[0,0,.04]}),s.add(w,"metalDark");const T=vt(new cn(.003,.003,.098,7),{pos:K(0,.06,u)});s.add(T,"metalDark");for(const k of[.012,.108])s.add(vt(new cn(.0062,.0062,.006,8),{pos:K(0,k,u)}),"metal");const E=8,M=E*7+1,y=[],C=[];for(let k=0;k<M;k++){const Y=k/(M-1),nt=Y*E*Math.PI*2,rt=K(Math.cos(nt),0,Math.sin(nt)),ht=.008;y.push(K(rt.x*ht,.02+.08*Y,u+rt.z*ht)),C.push(rt)}const U=Do({path:y,up:(k,Y)=>C[Y],profile:()=>xi(_i(.0044,.0042,.3,6))});s.add(U,"metal");const H=hn([Ft(.0072,0),Ft(.0098,0),Ft(.0098,.05),Ft(.0072,.05),Ft(.0072,0)],14);vt(H,{pos:K(0,c-.006,h)}),s.add(H,"metalDark");for(let k=0;k<3;k++){const Y=c+k*.0155,nt=.0168-k*.0011,rt=hn([Ft(.0102,0),Ft(nt,9e-4),Ft(nt,.0074),Ft(.0102,.0083),Ft(.0102,0)],14);vt(rt,{pos:K(0,Y,h),rot:[0,n()*.4,0]}),s.add(rt,"metal")}for(let k=0;k<4;k++){const Y=Math.PI/4+k*Math.PI/2,nt=ge(.0062,l-c,.0062,.0015,1);vt(nt,{pos:K(Math.cos(Y)*.0135,(c+l)/2,h+Math.sin(Y)*.0135),rot:[0,-Y,0]}),s.add(nt,"metalDark")}const P=ge(.005,.02,.005,.0012,1);vt(P,{pos:K(.0165,c+.026,h+.006),rot:[0,0,-.35]}),s.add(P,"metal");const F=-.014,B=K(F,.045,.004),N=hn([Ft(0,0),Ft(.0245,.0016),Ft(.0262,.005),Ft(.0262,.0125),Ft(.0244,.0162),Ft(0,.0175)],16);vt(N,{pos:B,rot:[0,0,Math.PI/2]}),pe(N,{amp:6e-4,freq:40,seed:71}),s.add(N,"metal");const z=F-.0175;for(let k=0;k<9;k++){const Y=k/9*Math.PI*2+.2,nt=K(z-.003,B.y+Math.sin(Y)*.0182,B.z+Math.cos(Y)*.0182),rt=vt(new cn(.0036,.0038,.011,6),{pos:nt,rot:[0,0,Math.PI/2]});s.add(rt,"brass")}const D=hn([Ft(0,0),Ft(.008,0),Ft(.0072,.005),Ft(0,.0068)],8);vt(D,{pos:K(z-.001,B.y,B.z),rot:[0,0,Math.PI/2]}),s.add(D,"metalDark"),s.add(mi(Se([K(z-.007,B.y,B.z),K(z-.012,B.y+.008,B.z),K(z-.01,B.y+.015,B.z+.004)],8),.0022,88),"metalDark");for(let k=0;k<3;k++){const Y=k/3*Math.PI*2,nt=ti(.003,.0018,6);vt(nt,{pos:K(z+5e-4,B.y+Math.sin(Y)*.011,B.z+Math.cos(Y)*.011),rot:[0,0,Math.PI/2]}),s.add(nt,"metalDark")}s.add(mi(Se([K(0,.014,.008),K(0,.003,.015),K(0,-.006,.013),K(0,-.011,.004)],10),.0024,3),"metal"),s.add(mi(Se([K(0,.008,.026),K(0,-.008,.03),K(0,-.021,.021),K(0,-.025,.005),K(0,-.021,-.008)],14),.0026,9),"metalDark");const G=ge(.0032,.013,.015,9e-4,1);vt(G,{pos:K(0,.104,.0415),rot:[.1,0,0]}),s.add(G,"metalDark");const q=ge(.02,.0055,.009,.0012,1);vt(q,{pos:K(0,.019,.0375),rot:[0,0,.03]}),s.add(q,"metalDark");for(const k of[1,-1]){const Y=ge(.0055,.008,.0085,.0011,1);vt(Y,{pos:K(k*.0068,.0225,.0405),rot:[0,0,k*.05]}),s.add(Y,"metalDark")}const Z=vt(new cn(.0032,.0038,.016,6),{pos:K(.021,.09,.016),rot:[0,0,Math.PI/2-.12]});s.add(Z,"metalDark"),s.add(vt(new cn(.006,.005,.005,6),{pos:K(.029,.0885,.016),rot:[0,0,Math.PI/2-.12]}),"brass");const X=vt(new wr(.0055,.0016,5,10),{pos:K(0,r-.001,-.02),rot:[0,Math.PI/2,.5]});s.add(X,"brass"),s.add(fe({path:Se([K(0,r-.005,-.021),K(.005,r-.017,-.026),K(-.002,r-.028,-.018)],8),profile:k=>Hi(8e-4,.0045*(1-.5*k))}),"cloth");const j=new b().subVectors(d[d.length-1],d[0]).normalize(),Q=xv(d),st={parts:s.parts(e),length:l,gripRadius:.0175,plugs:{grip:Hn(Q,j,K(0,0,1),"pistolGrip"),holster:Hn(K(0,(o+c)/2,h),K(0,1,0),K(0,0,1),"pistolBody")},anchors:{muzzle:Dn(K(0,l,h),K(0,1,0)),lanyard:Dn(K(0,r-.006,-.021),K(0,-1,-.35)),cell:Dn(K(0,g,-.024),K(0,0,-1))},emissivePaths:[[K(-.014,g,-.01),K(.014,g,-.01)]]};return zc(st,e)}const _d={R:.079,U_FRONT:[.04,.13,.26,.47,.555,.6,.63,.66,.705,.79,.87,.94,1],AZ:28};function Ev(i){const t=[];for(let e=0;e<3;e++)t.push({a:i()*Math.PI*2,w:.1+i()*.16,d:.003+i()*.005});return e=>{let n=_d.R*(1+(qu(Math.cos(e)*2.3+11,Math.sin(e)*2.3-5)-.5)*.026);for(const s of t){const r=Math.abs((e-s.a+Math.PI*3)%(Math.PI*2)-Math.PI);r<s.w&&(n-=s.d*yt(s.w,0,r))}return n}}const fi=i=>.0102*(1-yt(.06,.84,i))-.0016*yt(.8,.91,i)+.0125*yt(.26,0,i)+.0052*Math.exp(-(((i-.63)/.038)**2)),Ka=i=>.003+.0034*yt(.26,0,i);function wv(i={}){const{seed:t=2255,scale:e=1}=i,n=pn(t),s=Bc(),{U_FRONT:r,AZ:a}=_d,o=Ev(n),c=(M,y)=>{const C=[];for(let U=0;U<a;U++){const H=U/a*Math.PI*2,P=o(H)*M;C.push(K(Math.cos(H)*P,Math.sin(H)*P,y(H,M)))}return C},l=[];for(const M of r)l.push(c(M,()=>fi(M)));l.push(c(1.006,()=>fi(1)-Ka(1)*.5));for(let M=r.length-1;M>=0;M--){const y=r[M];l.push(c(y,()=>fi(y)-Ka(y)))}const h=fc(l,{uvScale:[1,2]});pe(h,{amp:35e-5,freq:52,seed:19}),s.add(h,"metal");const u=8;for(let M=0;M<u;M++){const y=M/u*Math.PI*2+.35+(n()-.5)*.07,C=K(Math.cos(y),Math.sin(y),0),U=K(-C.y,C.x,0),H=o(y),P=(F,B,N,z,D,G,q)=>{const Z=[];for(let X=0;X<=5;X++){const j=X/5,Q=F+(B-F)*j,st=C.clone().multiplyScalar(H*Q).setZ(fi(Q)+D+(G-D)*j*j),k=N*(1-q*(1-j));Z.push([st.clone().addScaledVector(U,k).setZ(st.z+z),st.clone().addScaledVector(U,k).setZ(st.z-z),st.clone().addScaledVector(U,-k).setZ(st.z-z),st.clone().addScaledVector(U,-k).setZ(st.z+z)])}return fc(Z)};s.add(P(.34,.6,.0072,6e-4,7e-4,7e-4,0),"metalDark"),s.add(P(.45,.64,.0085,9e-4,5e-4,.0026,0),"metal")}for(let M=0;M<3;M++){const y=M/3*Math.PI*2+.9+(n()-.5)*.2,C=.9+(n()-.5)*.04,U=o(y)*C,H=ti(.0062+n()*.0018,.0042,7);vt(H,{pos:K(Math.cos(y)*U,Math.sin(y)*U,fi(C)),rot:[Math.PI/2,0,0]}),s.add(H,M===1?"brass":"metalDark")}const d=fi(0),f=pd(ni({length:.058,radius:.0115,curl:.3,curlAxis:K(1,.2,0),taper:1.5,rings:10,radialSegments:7}));vt(f,{pos:K(.002,.003,d-.002),rot:[Math.PI/2-.1,.15,0]}),s.add(f,"bone");const g=hn([Ft(0,0),Ft(.0145,0),Ft(.0125,.006),Ft(.0102,.009),Ft(0,.009)],10);vt(g,{pos:K(.002,.003,d-.004),rot:[-Math.PI/2,0,0]}),s.add(g,"metalDark");const _=[];for(let M=0;M<=12;M++){const y=M/12*Math.PI*2;_.push(K(.002+Math.cos(y)*.0142,.003+Math.sin(y)*.0142,d+.0015))}s.add(mi(_,.0016,41),"metal");{const y=o(2.35)*.86,C=K(Math.cos(2.35)*y,Math.sin(2.35)*y,fi(.86)+.0018),U=ge(.026,.019,.0026,9e-4,2);vt(U,{pos:C,rot:[.05,.04,2.35-Math.PI/2]}),s.add(U,"metal");for(let H=0;H<3;H++){const P=ti(.0028+n()*8e-4,.0018,6),F=(H/2-.5)*.019;vt(P,{pos:C.clone().add(K(Math.cos(2.35-Math.PI/2)*F,Math.sin(2.35-Math.PI/2)*F,.0018)),rot:[Math.PI/2,0,0]}),s.add(P,"brass")}}const m=M=>fi(M)-Ka(M),p=.62;for(const M of[1,-1]){const y=o(M>0?Math.PI/2:-Math.PI/2)*p*M,C=ge(.026,.012,.009,.0016,2);vt(C,{pos:K(0,y,m(p)-.004),rot:[0,0,0]}),s.add(C,"metal");for(const U of[-.008,.008]){const H=ti(.0034,.0022,6);vt(H,{pos:K(U,y,m(p)-.0092),rot:[-Math.PI/2,0,0]}),s.add(H,"brass")}}const v=o(Math.PI/2)*p,x=-o(-Math.PI/2)*p,S=fe({path:Se([K(.004,v,m(p)-.008),K(.006,v*.45,m(.3)-.017),K(0,0,m(.05)-.021),K(-.006,x*.45,m(.3)-.017),K(-.004,x,m(p)-.008)],16),upHint:K(0,0,1),profile:M=>Hi(.0018,.011+.003*Math.exp(-(((M-.5)/.25)**2)))});pe(S,{amp:4e-4,freq:60,seed:55}),s.add(S,"leather");const w=v*.36,T=.032;for(const M of[1,-1]){const y=ge(.016,.01,.008,.0014,1);vt(y,{pos:K(T,M*w,m(.5)-.0035),rot:[0,0,0]}),s.add(y,"metal");const C=ti(.0028,.0018,6);vt(C,{pos:K(T,M*w,m(.5)-.008),rot:[-Math.PI/2,0,0]}),s.add(C,"brass")}const E=fe({path:Se([K(T,w,m(.5)-.006),K(T+.004,0,m(.5)-.019),K(T,-w,m(.5)-.006)],12),upHint:K(0,0,1),profile:()=>Hi(.0022,.008)});s.add(E,"leather");const A={parts:s.parts(e),length:o(Math.PI/2),gripRadius:.004,plugs:{strap:Hn(K(0,0,m(0)),K(0,0,1),K(1,0,0),"bucklerStrap"),grip:Hn(K(T+.004,0,m(.5)-.019),K(0,1,0),K(0,0,1),"bucklerGrip")},anchors:{boss:Dn(K(.002,.003,d+.055),K(0,0,1)),strapTop:Dn(K(0,v,m(p)-.008),K(0,0,-1)),strapBottom:Dn(K(0,x,m(p)-.008),K(0,0,-1)),rim:Dn(K(0,o(Math.PI/2),0),K(0,1,0))}};return zc(A,e)}const Tv=i=>Hn(i.origin,i.axis.clone().negate(),i.normal,`${i.label}-flipped`);function Av(i,{along:t=.58,clearance:e=.077,around:n=1.05,rest:s=Js()}={}){const r=s[`thigh${i}`],a=s[`shin${i}`],o=new b().subVectors(a,r),c=o.length();o.normalize();const l=Px,h=Math.cos(n),u=Math.sin(n),d=new b().addScaledVector(l,h).addScaledVector(lc,u),f=new b().addScaledVector(lc,h).addScaledVector(l,-u),g=new b().addScaledVector(o,c*t).addScaledVector(d,e);return{...Hn(g,o,f,`holster${i}`),length:c}}const Rv={cleaver:i=>({bone:"handR",socket:pv("R",{gripRadius:i.gripRadius}),plug:Tv(i.plugs.grip),trim:{roll:-1.54,slide:-.01}}),buckler:i=>({bone:"forearmL",socket:mv("L",{along:.82,clearance:.058}),plug:i.plugs.strap,trim:{}}),pistol:i=>({bone:"thighR",socket:Av("R"),plug:i.plugs.holster,trim:{}})};function Cv(i,{slide:t=0,lift:e=0}={}){const n=i.origin.clone().addScaledVector(i.axis,t).addScaledVector(i.normal,e);return Hn(n,i.axis,i.normal,i.label)}const Pv=[["hips",[0,-.03,0],[0,.1,.01],.125],["spine02",[0,-.02,0],[0,.12,0],.125],["chest",[0,0,0],[0,.08,-.01],.115],["head",[0,0,.01],[0,.1,0],.1],["thighL",[0,-.02,0],[0,-.23,0],.072],["thighR",[0,-.02,0],[0,-.23,0],.072],["shinL",[0,0,0],[0,-.22,0],.055],["shinR",[0,0,0],[0,-.22,0],.055],["upperarmL",[.02,0,0],[.21,0,0],.055],["upperarmR",[-.02,0,0],[-.21,0,0],.055]],Lv=[{names:["earL0","earL1","earL2","earL3"],stub:[.03,-.01,-.04],opts:{stiffness:.2,stiffnessTip:.055,drag:.2,dragTip:.08,gravity:1.1,gravityTip:2.6}},{names:["earR0","earR1","earR2","earR3"],stub:[-.03,-.01,-.04],opts:{stiffness:.19,stiffnessTip:.05,drag:.2,dragTip:.08,gravity:1.2,gravityTip:2.8}},{names:["tail0","tail1","tail2","tail3","tail4"],stub:[0,-.02,-.06],opts:{stiffness:.26,stiffnessTip:.08,drag:.26,dragTip:.12,gravity:1.6,gravityTip:3.4}}];function Iv(i){switch(i){case"tooth":{const t=new Gs(.011,.042,6);return vt(t,{pos:[0,-.021,0],rot:[Math.PI,0,0]})}case"tin":{const t=new cn(.017,.017,.026,12);return vt(t,{pos:[0,-.013,0]})}case"ring":{const t=new wr(.014,.0035,6,14);return vt(t,{pos:[0,-.014,0],rot:[0,Math.PI/2,0]})}case"bead":default:return new Ei(.012,10,8)}}class Dv{constructor(t,e,n){this.strand=t,this.mesh=new je(Iv(e),n),this.mesh.castShadow=!0,this.mesh.frustumCulled=!1,this._up=new b(0,1,0),this._dir=new b}sync(){const t=this.strand.points,e=t[t.length-1],n=t[t.length-2];this.mesh.position.copy(e),this._dir.subVectors(e,n),this._dir.lengthSq()>1e-10&&(this._dir.normalize(),this.mesh.quaternion.setFromUnitVectors(this._up,this._dir.negate()))}}class Uv{constructor(t,e,n){const s=me([new Ei(.009,8,6),vt(new Gs(.006,.026,5),{pos:[0,-.014,0],rot:[Math.PI,0,0]})]);this.mesh=new ex(s,n,e),this.mesh.instanceMatrix.setUsage(vr),this.mesh.castShadow=!0,this.mesh.frustumCulled=!1,this.strand=t,this.count=e,this._m=new qt,this._p=new b,this._q=new ie,this._s=new b(1,1,1),this._dir=new b,this._up=new b(0,1,0)}sync(){const t=this.strand.points,e=t.length;for(let n=0;n<this.count;n++){const r=(n+1)/(this.count+1)*(e-1),a=Math.min(e-2,Math.floor(r)),o=t[a],c=t[a+1];this._p.lerpVectors(o,c,r-a),this._dir.subVectors(c,o),this._dir.lengthSq()>1e-10&&(this._dir.normalize(),this._q.setFromUnitVectors(this._up,this._dir),this._q.multiply(Nv));const l=.75+.5*Math.sin(n*2.4);this._s.set(l,l,l),this._m.compose(this._p,this._q,this._s),this.mesh.setMatrixAt(n,this._m)}this.mesh.instanceMatrix.needsUpdate=!0}}const Nv=new ie().setFromAxisAngle(new b(1,0,0),Math.PI/2);function tM({renderer:i,quality:t=1}={}){const e=performance.now(),n=new Ds;n.name="goblin";const{root:s,bones:r,byName:a,skeleton:o}=od(),c=v1(),{parts:l,accessories:h}=N1(),{geometry:u,materials:d}=z1([...c,...l],{boneNames:Yx,segments:Kx()}),f=V1({renderer:i,quality:t}),g=d.map(N=>(f[N]||console.warn(`space-goblin: no material for key "${N}"`),f[N]||f.metalDark)),_=new Z_(u,g);_.castShadow=!0,_.receiveShadow=!0,_.frustumCulled=!1,_.add(s),_.bind(o),n.add(_);const m={},p=(N,z)=>{const D=Rv[N](z),G=dv(D.socket,D.plug,D.trim),q=gv(Cv(D.socket,D.trim),D.plug,G);(q.axisDeg>1||q.offset>.001)&&console.warn(`space-goblin: ${N} misses its socket — ${_v(N,q)}`);const Z=new Ds;Z.name=N,Z.position.copy(G.position),Z.quaternion.copy(G.quaternion);const X=new Map;for(const j of z.parts)X.has(j.material)||X.set(j.material,[]),X.get(j.material).push(j.geometry);for(const[j,Q]of X){const st=me(Q);if(!st)continue;const k=new je(st,f[j]||f.metalDark);k.castShadow=!0,k.receiveShadow=!0,Z.add(k)}return a[D.bone].add(Z),m[N]={gear:z,holder:Z,mount:D,error:q},Z};p("cleaver",yv()),p("buckler",wv()),p("pistol",Sv());const v=Y1(),x=new Tx(_),S={};for(const[N,z]of Object.entries(v)){const D=x.clipAction(z);(N==="combo"||N==="skid")&&(D.setLoop(ec,1),D.clampWhenFinished=!0),S[N]=D}S.run.play();let w=S.run;const T=Z1(a,Lv),E=new uv({gravity:-9.8,substeps:2,wind:.35});for(const[N,z,D,G]of Pv)a[N]&&E.addCollider(new sv(a[N],new b(...z),new b(...D),G));const A=[],M={};for(const N of h)if(N.type==="strand"){const z=new rv({anchor:a[N.bone],offset:N.offset,dir:N.dir,length:N.length,segments:N.segments,stiffness:N.stiffness??.9,damping:N.damping??.06,gravity:N.gravity??-9.8,drag:N.drag??.04,wind:N.wind??.3,pinTip:!!N.pinTip,pinTipTo:N.pinTipTo});E.addStrand(z),M[N.name]=z;const D=f[N.material]||f.leather,G=new lv(z,{radius:N.radius??.008,radialSegments:N.radius>.008?7:5,taper:N.taper??1,material:D});if(G.castShadow=!0,G.frustumCulled=!1,n.add(G),E.addMesh(G),N.tip){const q=new Dv(z,N.tip.kind,f[N.tip.material]||f.brass);n.add(q.mesh),A.push(q)}if(N.beads){const q=new Uv(z,N.beads,f.bone);n.add(q.mesh),A.push(q)}}else if(N.type==="cloth"){const z=new cv({width:N.width,height:N.height,cols:N.cols,rows:N.rows,pins:N.pins.map(G=>({bone:a[G.bone],local:G.local,col:G.col})),stiffness:N.stiffness??.9,damping:N.damping??.04,gravity:N.gravity??-9.8,wind:N.wind??.5,drag:N.drag??.03,slit:N.slit});E.addCloth(z);const D=new hv(z,{material:f[N.material]||f.cloth});D.castShadow=!0,D.receiveShadow=!0,D.frustumCulled=!1,n.add(D),E.addMesh(D)}const y=new b,C=new b;let U=0,H=0,P=!1;function F(N,z=.22){const D=S[N];return!D||D===w||(D.reset(),D.setEffectiveWeight(1),D.enabled=!0,D.play(),w.crossFadeTo(D,z,!1),w=D),D}const B={group:n,mesh:_,skeleton:o,bones:r,byName:a,mixer:x,actions:S,dynamics:E,materials:f,weapons:m,strands:M,stats:{vertices:u.attributes.position.count,triangles:u.index.count/3,bones:r.length,materials:d.length,accessories:h.length,buildMs:0,skin:k1(u)},playRun:()=>F("run",.25),playIdle:()=>F("idle",.35),playCombo(){const N=F("combo",.18);if(!N)return;N.reset(),N.setLoop(ec,1),N.clampWhenFinished=!0,N.play();const z=D=>{D.action===N&&(x.removeEventListener("finished",z),F("run",.3))};x.addEventListener("finished",z)},get action(){return w.getClip().name},update(N,{speed:z=0}={}){H+=N,U=z,x.update(N),s.updateMatrixWorld(!0),y.set(0,0,U),C.set(Math.sin(H*2.3)*.35+Math.sin(H*5.7)*.12,Math.sin(H*3.1)*.2,Math.sin(H*1.7)*.25),y.add(C),E.setCharacterVelocity(y),C.multiplyScalar(2.2).addScaledVector(y,-1.6);for(const D of T)D.step(N,C);E.step(N);for(const D of A)D.sync();if(!P){P=!0;for(let D=0;D<30;D++)E.step(1/60);for(const D of A)D.sync()}},reset(){for(const N of T)N.reset();E.reset(),P=!1},dispose(){u.dispose(),H1(f),E.dispose(),x.stopAllAction()}};return B.stats.buildMs=performance.now()-e,B}export{Nu as $,Yc as A,un as B,Xt as C,kv as D,Fv as E,Uu as F,Ds as G,zv as H,ex as I,Ln as J,qv as K,Tc as L,je as M,Tn as N,Ae as O,Bv as P,Vv as Q,ks as R,Ei as S,Jv as T,Qv as U,b as V,q_ as W,tM as X,Hv as Y,dn as Z,Kv as _,ji as a,Ac as a0,Gv as a1,Hn as a2,Xv as a3,Ec as a4,Er as a5,nx as a6,gv as a7,pv as a8,mv as a9,Qh as aa,qt as ab,Wv as ac,Cx as ad,Ov as ae,$_ as af,$v as ag,jv as ah,lc as ai,pf as aj,de as b,re as c,In as d,ku as e,Us as f,Mn as g,vr as h,ii as i,Lo as j,ot as k,cn as l,yc as m,vc as n,pn as o,Jt as p,Cc as q,Zv as r,yt as s,zu as t,Oe as u,qu as v,Yv as w,$u as x,wd as y,tf as z};
