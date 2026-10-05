(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();const Zt=360,xt=Zt/2,sh=.01,oh=1.3,Nt=sh*oh,_n=2048,ee=1024,ah=20261004;function pa(i){const t=(i+180)*Math.PI/180;return[Math.sin(t),-Math.cos(t)]}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ua="160",rh=0,nr=1,lh=2,Ql=1,ch=2,Cn=3,Fn=0,Ve=1,je=2,qn=0,zi=1,ma=2,ir=3,sr=4,hh=5,oi=100,uh=101,fh=102,or=103,ar=104,dh=200,ph=201,mh=202,gh=203,ga=204,va=205,vh=206,xh=207,_h=208,Mh=209,yh=210,wh=211,Sh=212,bh=213,Eh=214,Th=0,Ah=1,Ch=2,fo=3,Rh=4,Ph=5,Lh=6,Dh=7,tc=0,Uh=1,Fh=2,Xn=0,Ih=1,kh=2,zh=3,Nh=4,Oh=5,Bh=6,ec=300,Gi=301,Vi=302,xa=303,_a=304,So=306,hi=1e3,$e=1001,Ma=1002,ue=1003,rr=1004,Do=1005,ne=1006,Hh=1007,ui=1008,nn=1009,Gh=1010,Vh=1011,Fa=1012,nc=1013,Ln=1014,pn=1015,In=1016,ic=1017,sc=1018,ri=1020,Wh=1021,ke=1023,qh=1024,Xh=1025,li=1026,Wi=1027,Ni=1028,oc=1029,Yh=1030,ac=1031,rc=1033,Uo=33776,Fo=33777,Io=33778,ko=33779,lr=35840,cr=35841,hr=35842,ur=35843,lc=36196,fr=37492,dr=37496,pr=37808,mr=37809,gr=37810,vr=37811,xr=37812,_r=37813,Mr=37814,yr=37815,wr=37816,Sr=37817,br=37818,Er=37819,Tr=37820,Ar=37821,zo=36492,Cr=36494,Rr=36495,jh=36283,Pr=36284,Lr=36285,Dr=36286,cc=3e3,ci=3001,$h=3200,Kh=3201,Zh=0,Jh=1,rn="",Ce="srgb",kn="srgb-linear",Ia="display-p3",bo="display-p3-linear",po="linear",le="srgb",mo="rec709",go="p3",di=7680,Ur=519,Qh=512,tu=513,eu=514,hc=515,nu=516,iu=517,su=518,ou=519,Fr=35044,Oi=35048,Ir="300 es",ya=1035,Dn=2e3,vo=2001;class $i{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let kr=1234567;const fs=Math.PI/180,vs=180/Math.PI;function Ki(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Ie(i,t,e){return Math.max(t,Math.min(e,i))}function ka(i,t){return(i%t+t)%t}function au(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function ru(i,t,e){return i!==t?(e-i)/(t-i):0}function ds(i,t,e){return(1-e)*i+e*t}function lu(i,t,e,n){return ds(i,t,1-Math.exp(-e*n))}function cu(i,t=1){return t-Math.abs(ka(i,t*2)-t)}function hu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function uu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function fu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function du(i,t){return i+Math.random()*(t-i)}function pu(i){return i*(.5-Math.random())}function mu(i){i!==void 0&&(kr=i);let t=kr+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function gu(i){return i*fs}function vu(i){return i*vs}function wa(i){return(i&i-1)===0&&i!==0}function xu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function xo(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function _u(i,t,e,n,s){const o=Math.cos,r=Math.sin,a=o(e/2),l=r(e/2),c=o((t+n)/2),h=r((t+n)/2),f=o((t-n)/2),u=r((t-n)/2),d=o((n-t)/2),g=r((n-t)/2);switch(s){case"XYX":i.set(a*h,l*f,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*f,a*c);break;case"ZXZ":i.set(l*f,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Di(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function He(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const vn={DEG2RAD:fs,RAD2DEG:vs,generateUUID:Ki,clamp:Ie,euclideanModulo:ka,mapLinear:au,inverseLerp:ru,lerp:ds,damp:lu,pingpong:cu,smoothstep:hu,smootherstep:uu,randInt:fu,randFloat:du,randFloatSpread:pu,seededRandom:mu,degToRad:gu,radToDeg:vu,isPowerOfTwo:wa,ceilPowerOfTwo:xu,floorPowerOfTwo:xo,setQuaternionFromProperEuler:_u,normalize:He,denormalize:Di};class It{constructor(t=0,e=0){It.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*s+t.x,this.y=o*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,s,o,r,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,l,c)}set(t,e,n,s,o,r,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=o,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],g=n[8],v=s[0],m=s[3],p=s[6],_=s[1],x=s[4],y=s[7],w=s[2],M=s[5],E=s[8];return o[0]=r*v+a*_+l*w,o[3]=r*m+a*x+l*M,o[6]=r*p+a*y+l*E,o[1]=c*v+h*_+f*w,o[4]=c*m+h*x+f*M,o[7]=c*p+h*y+f*E,o[2]=u*v+d*_+g*w,o[5]=u*m+d*x+g*M,o[8]=u*p+d*y+g*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*a*c-n*o*h+n*a*l+s*o*c-s*r*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*r-a*c,u=a*l-h*o,d=c*o-r*l,g=e*f+n*u+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=f*v,t[1]=(s*c-h*n)*v,t[2]=(a*n-s*r)*v,t[3]=u*v,t[4]=(h*e-s*l)*v,t[5]=(s*o-a*e)*v,t[6]=d*v,t[7]=(n*l-c*e)*v,t[8]=(r*e-n*o)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,r,a){const l=Math.cos(o),c=Math.sin(o);return this.set(n*l,n*c,-n*(l*r+c*a)+r+t,-s*c,s*l,-s*(-c*r+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(No.makeScale(t,e)),this}rotate(t){return this.premultiply(No.makeRotation(-t)),this}translate(t,e){return this.premultiply(No.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const No=new Yt;function uc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function _o(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Mu(){const i=_o("canvas");return i.style.display="block",i}const zr={};function ps(i){i in zr||(zr[i]=!0,console.warn(i))}const Nr=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Or=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ps={[kn]:{transfer:po,primaries:mo,toReference:i=>i,fromReference:i=>i},[Ce]:{transfer:le,primaries:mo,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[bo]:{transfer:po,primaries:go,toReference:i=>i.applyMatrix3(Or),fromReference:i=>i.applyMatrix3(Nr)},[Ia]:{transfer:le,primaries:go,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Or),fromReference:i=>i.applyMatrix3(Nr).convertLinearToSRGB()}},yu=new Set([kn,bo]),Qt={enabled:!0,_workingColorSpace:kn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!yu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Ps[t].toReference,s=Ps[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Ps[i].primaries},getTransfer:function(i){return i===rn?po:Ps[i].transfer}};function Bi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Oo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let pi;class fc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{pi===void 0&&(pi=_o("canvas")),pi.width=t.width,pi.height=t.height;const n=pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=_o("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=Bi(o[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Bi(e[n]/255)*255):e[n]=Bi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let wu=0;class dc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=Ki(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(Bo(s[r].image)):o.push(Bo(s[r]))}else o=Bo(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function Bo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?fc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Su=0;class Ke extends $i{constructor(t=Ke.DEFAULT_IMAGE,e=Ke.DEFAULT_MAPPING,n=$e,s=$e,o=ne,r=ui,a=ke,l=nn,c=Ke.DEFAULT_ANISOTROPY,h=rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Su++}),this.uuid=Ki(),this.name="",this.source=new dc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new It(0,0),this.repeat=new It(1,1),this.center=new It(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===ci?Ce:rn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ec)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case hi:t.x=t.x-Math.floor(t.x);break;case $e:t.x=t.x<0?0:1;break;case Ma:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case hi:t.y=t.y-Math.floor(t.y);break;case $e:t.y=t.y<0?0:1;break;case Ma:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ce?ci:cc}set encoding(t){ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===ci?Ce:rn}}Ke.DEFAULT_IMAGE=null;Ke.DEFAULT_MAPPING=ec;Ke.DEFAULT_ANISOTROPY=1;class ge{constructor(t=0,e=0,n=0,s=1){ge.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,y=(d+1)/2,w=(p+1)/2,M=(h+u)/4,E=(f+v)/4,R=(g+m)/4;return x>y&&x>w?x<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(x),s=M/n,o=E/n):y>w?y<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(y),n=M/s,o=R/s):w<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(w),n=E/o,s=R/o),this.set(n,s,o,e),this}let _=Math.sqrt((m-g)*(m-g)+(f-v)*(f-v)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(m-g)/_,this.y=(f-v)/_,this.z=(u-h)/_,this.w=Math.acos((c+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bu extends $i{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ge(0,0,t,e),this.scissorTest=!1,this.viewport=new ge(0,0,t,e);const s={width:t,height:e,depth:1};n.encoding!==void 0&&(ps("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===ci?Ce:rn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ne,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ke(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new dc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class sn extends bu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class pc extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ue,this.minFilter=ue,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Sa extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ue,this.minFilter=ue,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Eu extends sn{constructor(t=1,e=1,n=1,s={}){super(t,e,s),this.isWebGLMultipleRenderTargets=!0;const o=this.texture;this.texture=[];for(let r=0;r<n;r++)this.texture[r]=o.clone(),this.texture[r].isRenderTargetTexture=!0}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.texture.length;s<o;s++)this.texture[s].image.width=t,this.texture[s].image.height=e,this.texture[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}copy(t){this.dispose(),this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.texture.length=0;for(let e=0,n=t.texture.length;e<n;e++)this.texture[e]=t.texture[e].clone(),this.texture[e].isRenderTargetTexture=!0;return this}}class jn{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,r,a){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3];const u=o[r+0],d=o[r+1],g=o[r+2],v=o[r+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=u,t[e+1]=d,t[e+2]=g,t[e+3]=v;return}if(f!==v||l!==u||c!==d||h!==g){let m=1-a;const p=l*u+c*d+h*g+f*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const w=Math.sqrt(x),M=Math.atan2(w,p*_);m=Math.sin(m*M)/w,a=Math.sin(a*M)/w}const y=a*_;if(l=l*m+u*y,c=c*m+d*y,h=h*m+g*y,f=f*m+v*y,m===1-a){const w=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=w,c*=w,h*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,o,r){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=o[r],u=o[r+1],d=o[r+2],g=o[r+3];return t[e]=a*g+h*f+l*d-c*u,t[e+1]=l*g+h*u+c*f-a*d,t[e+2]=c*g+h*d+a*u-l*f,t[e+3]=h*g-a*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),f=a(o/2),u=l(n/2),d=l(s/2),g=l(o/2);switch(r){case"XYZ":this._x=u*h*f+c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f-u*d*g;break;case"YXZ":this._x=u*h*f+c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f+u*d*g;break;case"ZXY":this._x=u*h*f-c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f-u*d*g;break;case"ZYX":this._x=u*h*f-c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f+u*d*g;break;case"YZX":this._x=u*h*f+c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f-u*d*g;break;case"XZY":this._x=u*h*f-c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f+u*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],r=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(o-c)*d,this._z=(r-s)*d}else if(n>a&&n>f){const d=2*Math.sqrt(1+n-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+r)/d,this._z=(o+c)/d}else if(a>f){const d=2*Math.sqrt(1+a-n-f);this._w=(o-c)/d,this._x=(s+r)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-a);this._w=(r-s)/d,this._x=(o+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,r=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+r*a+s*c-o*l,this._y=s*h+r*l+o*a-n*c,this._z=o*h+r*c+n*l-s*a,this._w=r*h-n*a-s*l-o*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=s,this._z=o,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),f=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=r*f+this._w*u,this._x=n*f+this._x*u,this._y=s*f+this._y*u,this._z=o*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(o),n*Math.cos(o),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(t=0,e=0,n=0){z.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Br.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Br.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,r=t.y,a=t.z,l=t.w,c=2*(r*s-a*n),h=2*(a*e-o*s),f=2*(o*n-r*e);return this.x=e+l*c+r*f-a*h,this.y=n+l*h+a*c-o*f,this.z=s+l*f+o*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,r=e.x,a=e.y,l=e.z;return this.x=s*l-o*a,this.y=o*r-n*l,this.z=n*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ho.copy(this).projectOnVector(t),this.sub(Ho)}reflect(t){return this.sub(Ho.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ho=new z,Br=new jn;class Mn{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,hn):hn.fromBufferAttribute(o,r),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ls.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ls.copy(n.boundingBox)),Ls.applyMatrix4(t.matrixWorld),this.union(Ls)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ts),Ds.subVectors(this.max,ts),mi.subVectors(t.a,ts),gi.subVectors(t.b,ts),vi.subVectors(t.c,ts),On.subVectors(gi,mi),Bn.subVectors(vi,gi),Jn.subVectors(mi,vi);let e=[0,-On.z,On.y,0,-Bn.z,Bn.y,0,-Jn.z,Jn.y,On.z,0,-On.x,Bn.z,0,-Bn.x,Jn.z,0,-Jn.x,-On.y,On.x,0,-Bn.y,Bn.x,0,-Jn.y,Jn.x,0];return!Go(e,mi,gi,vi,Ds)||(e=[1,0,0,0,1,0,0,0,1],!Go(e,mi,gi,vi,Ds))?!1:(Us.crossVectors(On,Bn),e=[Us.x,Us.y,Us.z],Go(e,mi,gi,vi,Ds))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const wn=[new z,new z,new z,new z,new z,new z,new z,new z],hn=new z,Ls=new Mn,mi=new z,gi=new z,vi=new z,On=new z,Bn=new z,Jn=new z,ts=new z,Ds=new z,Us=new z,Qn=new z;function Go(i,t,e,n,s){for(let o=0,r=i.length-3;o<=r;o+=3){Qn.fromArray(i,o);const a=s.x*Math.abs(Qn.x)+s.y*Math.abs(Qn.y)+s.z*Math.abs(Qn.z),l=t.dot(Qn),c=e.dot(Qn),h=n.dot(Qn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Tu=new Mn,es=new z,Vo=new z;class Zi{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Tu.setFromPoints(t).getCenter(n);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;es.subVectors(t,this.center);const e=es.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(es,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Vo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(es.copy(t.center).add(Vo)),this.expandByPoint(es.copy(t.center).sub(Vo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Sn=new z,Wo=new z,Fs=new z,Hn=new z,qo=new z,Is=new z,Xo=new z;class za{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Sn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Sn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Sn.copy(this.origin).addScaledVector(this.direction,e),Sn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Wo.copy(t).add(e).multiplyScalar(.5),Fs.copy(e).sub(t).normalize(),Hn.copy(this.origin).sub(Wo);const o=t.distanceTo(e)*.5,r=-this.direction.dot(Fs),a=Hn.dot(this.direction),l=-Hn.dot(Fs),c=Hn.lengthSq(),h=Math.abs(1-r*r);let f,u,d,g;if(h>0)if(f=r*l-a,u=r*a-l,g=o*h,f>=0)if(u>=-g)if(u<=g){const v=1/h;f*=v,u*=v,d=f*(f+r*u+2*a)+u*(r*f+u+2*l)+c}else u=o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;else u=-o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;else u<=-g?(f=Math.max(0,-(-r*o+a)),u=f>0?-o:Math.min(Math.max(-o,-l),o),d=-f*f+u*(u+2*l)+c):u<=g?(f=0,u=Math.min(Math.max(-o,-l),o),d=u*(u+2*l)+c):(f=Math.max(0,-(r*o+a)),u=f>0?o:Math.min(Math.max(-o,-l),o),d=-f*f+u*(u+2*l)+c);else u=r>0?-o:o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Wo).addScaledVector(Fs,u),d}intersectSphere(t,e){Sn.subVectors(t.center,this.origin);const n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=n-r,l=n+r;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,r,a,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(o=(t.min.y-u.y)*h,r=(t.max.y-u.y)*h):(o=(t.max.y-u.y)*h,r=(t.min.y-u.y)*h),n>r||o>s||((o>n||isNaN(n))&&(n=o),(r<s||isNaN(s))&&(s=r),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Sn)!==null}intersectTriangle(t,e,n,s,o){qo.subVectors(e,t),Is.subVectors(n,t),Xo.crossVectors(qo,Is);let r=this.direction.dot(Xo),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;Hn.subVectors(this.origin,t);const l=a*this.direction.dot(Is.crossVectors(Hn,Is));if(l<0)return null;const c=a*this.direction.dot(qo.cross(Hn));if(c<0||l+c>r)return null;const h=-a*Hn.dot(Xo);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kt{constructor(t,e,n,s,o,r,a,l,c,h,f,u,d,g,v,m){Kt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,l,c,h,f,u,d,g,v,m)}set(t,e,n,s,o,r,a,l,c,h,f,u,d,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=o,p[5]=r,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Kt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/xi.setFromMatrixColumn(t,0).length(),o=1/xi.setFromMatrixColumn(t,1).length(),r=1/xi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(o),f=Math.sin(o);if(t.order==="XYZ"){const u=r*h,d=r*f,g=a*h,v=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+g*c,e[5]=u-v*c,e[9]=-a*l,e[2]=v-u*c,e[6]=g+d*c,e[10]=r*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,g=c*h,v=c*f;e[0]=u+v*a,e[4]=g*a-d,e[8]=r*c,e[1]=r*f,e[5]=r*h,e[9]=-a,e[2]=d*a-g,e[6]=v+u*a,e[10]=r*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,g=c*h,v=c*f;e[0]=u-v*a,e[4]=-r*f,e[8]=g+d*a,e[1]=d+g*a,e[5]=r*h,e[9]=v-u*a,e[2]=-r*c,e[6]=a,e[10]=r*l}else if(t.order==="ZYX"){const u=r*h,d=r*f,g=a*h,v=a*f;e[0]=l*h,e[4]=g*c-d,e[8]=u*c+v,e[1]=l*f,e[5]=v*c+u,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=r*l}else if(t.order==="YZX"){const u=r*l,d=r*c,g=a*l,v=a*c;e[0]=l*h,e[4]=v-u*f,e[8]=g*f+d,e[1]=f,e[5]=r*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+g,e[10]=u-v*f}else if(t.order==="XZY"){const u=r*l,d=r*c,g=a*l,v=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+v,e[5]=r*h,e[9]=d*f-g,e[2]=g*f-d,e[6]=a*h,e[10]=v*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Au,t,Cu)}lookAt(t,e,n){const s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),Gn.crossVectors(n,Qe),Gn.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),Gn.crossVectors(n,Qe)),Gn.normalize(),ks.crossVectors(Qe,Gn),s[0]=Gn.x,s[4]=ks.x,s[8]=Qe.x,s[1]=Gn.y,s[5]=ks.y,s[9]=Qe.y,s[2]=Gn.z,s[6]=ks.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],g=n[2],v=n[6],m=n[10],p=n[14],_=n[3],x=n[7],y=n[11],w=n[15],M=s[0],E=s[4],R=s[8],S=s[12],b=s[1],I=s[5],V=s[9],X=s[13],T=s[2],P=s[6],G=s[10],U=s[14],k=s[3],O=s[7],C=s[11],B=s[15];return o[0]=r*M+a*b+l*T+c*k,o[4]=r*E+a*I+l*P+c*O,o[8]=r*R+a*V+l*G+c*C,o[12]=r*S+a*X+l*U+c*B,o[1]=h*M+f*b+u*T+d*k,o[5]=h*E+f*I+u*P+d*O,o[9]=h*R+f*V+u*G+d*C,o[13]=h*S+f*X+u*U+d*B,o[2]=g*M+v*b+m*T+p*k,o[6]=g*E+v*I+m*P+p*O,o[10]=g*R+v*V+m*G+p*C,o[14]=g*S+v*X+m*U+p*B,o[3]=_*M+x*b+y*T+w*k,o[7]=_*E+x*I+y*P+w*O,o[11]=_*R+x*V+y*G+w*C,o[15]=_*S+x*X+y*U+w*B,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],r=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+o*l*f-s*c*f-o*a*u+n*c*u+s*a*d-n*l*d)+v*(+e*l*d-e*c*u+o*r*u-s*r*d+s*c*h-o*l*h)+m*(+e*c*f-e*a*d-o*r*f+n*r*d+o*a*h-n*c*h)+p*(-s*a*h-e*l*f+e*a*u+s*r*f-n*r*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],g=t[12],v=t[13],m=t[14],p=t[15],_=f*m*c-v*u*c+v*l*d-a*m*d-f*l*p+a*u*p,x=g*u*c-h*m*c-g*l*d+r*m*d+h*l*p-r*u*p,y=h*v*c-g*f*c+g*a*d-r*v*d-h*a*p+r*f*p,w=g*f*l-h*v*l-g*a*u+r*v*u+h*a*m-r*f*m,M=e*_+n*x+s*y+o*w;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/M;return t[0]=_*E,t[1]=(v*u*o-f*m*o-v*s*d+n*m*d+f*s*p-n*u*p)*E,t[2]=(a*m*o-v*l*o+v*s*c-n*m*c-a*s*p+n*l*p)*E,t[3]=(f*l*o-a*u*o-f*s*c+n*u*c+a*s*d-n*l*d)*E,t[4]=x*E,t[5]=(h*m*o-g*u*o+g*s*d-e*m*d-h*s*p+e*u*p)*E,t[6]=(g*l*o-r*m*o-g*s*c+e*m*c+r*s*p-e*l*p)*E,t[7]=(r*u*o-h*l*o+h*s*c-e*u*c-r*s*d+e*l*d)*E,t[8]=y*E,t[9]=(g*f*o-h*v*o-g*n*d+e*v*d+h*n*p-e*f*p)*E,t[10]=(r*v*o-g*a*o+g*n*c-e*v*c-r*n*p+e*a*p)*E,t[11]=(h*a*o-r*f*o-h*n*c+e*f*c+r*n*d-e*a*d)*E,t[12]=w*E,t[13]=(h*v*s-g*f*s+g*n*u-e*v*u-h*n*m+e*f*m)*E,t[14]=(g*a*s-r*v*s-g*n*l+e*v*l+r*n*m-e*a*m)*E,t[15]=(r*f*s-h*a*s+h*n*l-e*f*l-r*n*u+e*a*u)*E,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,r=t.x,a=t.y,l=t.z,c=o*r,h=o*a;return this.set(c*r+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*r,0,c*l-s*a,h*l+s*r,o*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,r){return this.set(1,n,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,r=e._y,a=e._z,l=e._w,c=o+o,h=r+r,f=a+a,u=o*c,d=o*h,g=o*f,v=r*h,m=r*f,p=a*f,_=l*c,x=l*h,y=l*f,w=n.x,M=n.y,E=n.z;return s[0]=(1-(v+p))*w,s[1]=(d+y)*w,s[2]=(g-x)*w,s[3]=0,s[4]=(d-y)*M,s[5]=(1-(u+p))*M,s[6]=(m+_)*M,s[7]=0,s[8]=(g+x)*E,s[9]=(m-_)*E,s[10]=(1-(u+v))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=xi.set(s[0],s[1],s[2]).length();const r=xi.set(s[4],s[5],s[6]).length(),a=xi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],un.copy(this);const c=1/o,h=1/r,f=1/a;return un.elements[0]*=c,un.elements[1]*=c,un.elements[2]*=c,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=f,un.elements[9]*=f,un.elements[10]*=f,e.setFromRotationMatrix(un),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,s,o,r,a=Dn){const l=this.elements,c=2*o/(e-t),h=2*o/(n-s),f=(e+t)/(e-t),u=(n+s)/(n-s);let d,g;if(a===Dn)d=-(r+o)/(r-o),g=-2*r*o/(r-o);else if(a===vo)d=-r/(r-o),g=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,o,r,a=Dn){const l=this.elements,c=1/(e-t),h=1/(n-s),f=1/(r-o),u=(e+t)*c,d=(n+s)*h;let g,v;if(a===Dn)g=(r+o)*f,v=-2*f;else if(a===vo)g=o*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const xi=new z,un=new Kt,Au=new z(0,0,0),Cu=new z(1,1,1),Gn=new z,ks=new z,Qe=new z,Hr=new Kt,Gr=new jn;class qi{constructor(t=0,e=0,n=0,s=qi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,o),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-Ie(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,o)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ie(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hr.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hr,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gr.setFromEuler(this),this.setFromQuaternion(Gr,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qi.DEFAULT_ORDER="XYZ";class Na{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ru=0;const Vr=new z,_i=new jn,bn=new Kt,zs=new z,ns=new z,Pu=new z,Lu=new jn,Wr=new z(1,0,0),qr=new z(0,1,0),Xr=new z(0,0,1),Du={type:"added"},Uu={type:"removed"};class Ze extends $i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ru++}),this.uuid=Ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ze.DEFAULT_UP.clone();const t=new z,e=new qi,n=new jn,s=new z(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Kt},normalMatrix:{value:new Yt}}),this.matrix=new Kt,this.matrixWorld=new Kt,this.matrixAutoUpdate=Ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Na,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return _i.setFromAxisAngle(t,e),this.quaternion.multiply(_i),this}rotateOnWorldAxis(t,e){return _i.setFromAxisAngle(t,e),this.quaternion.premultiply(_i),this}rotateX(t){return this.rotateOnAxis(Wr,t)}rotateY(t){return this.rotateOnAxis(qr,t)}rotateZ(t){return this.rotateOnAxis(Xr,t)}translateOnAxis(t,e){return Vr.copy(t).applyQuaternion(this.quaternion),this.position.add(Vr.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wr,t)}translateY(t){return this.translateOnAxis(qr,t)}translateZ(t){return this.translateOnAxis(Xr,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?zs.copy(t):zs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(ns,zs,this.up):bn.lookAt(zs,ns,this.up),this.quaternion.setFromRotationMatrix(bn),s&&(bn.extractRotation(s.matrixWorld),_i.setFromRotationMatrix(bn),this.quaternion.premultiply(_i.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Du)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Uu)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),bn.multiply(t.parent.matrixWorld)),t.applyMatrix4(bn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,t,Pu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,Lu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const o=e[n];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++){const a=s[o];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function o(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];o(t.shapes,f)}else o(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(o(t.materials,this.material[l]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(o(t.animations,l))}}if(e){const a=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),f=r(t.shapes),u=r(t.skeletons),d=r(t.animations),g=r(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ze.DEFAULT_UP=new z(0,1,0);Ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new z,En=new z,Yo=new z,Tn=new z,Mi=new z,yi=new z,Yr=new z,jo=new z,$o=new z,Ko=new z;let Ns=!1;class dn{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),fn.subVectors(t,e),s.cross(fn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){fn.subVectors(s,e),En.subVectors(n,e),Yo.subVectors(t,e);const r=fn.dot(fn),a=fn.dot(En),l=fn.dot(Yo),c=En.dot(En),h=En.dot(Yo),f=r*c-a*a;if(f===0)return o.set(0,0,0),null;const u=1/f,d=(c*l-a*h)*u,g=(r*h-a*l)*u;return o.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Tn)===null?!1:Tn.x>=0&&Tn.y>=0&&Tn.x+Tn.y<=1}static getUV(t,e,n,s,o,r,a,l){return Ns===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ns=!0),this.getInterpolation(t,e,n,s,o,r,a,l)}static getInterpolation(t,e,n,s,o,r,a,l){return this.getBarycoord(t,e,n,s,Tn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,Tn.x),l.addScaledVector(r,Tn.y),l.addScaledVector(a,Tn.z),l)}static isFrontFacing(t,e,n,s){return fn.subVectors(n,e),En.subVectors(t,e),fn.cross(En).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return fn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),fn.cross(En).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return dn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return dn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,o){return Ns===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ns=!0),dn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}getInterpolation(t,e,n,s,o){return dn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return dn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return dn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let r,a;Mi.subVectors(s,n),yi.subVectors(o,n),jo.subVectors(t,n);const l=Mi.dot(jo),c=yi.dot(jo);if(l<=0&&c<=0)return e.copy(n);$o.subVectors(t,s);const h=Mi.dot($o),f=yi.dot($o);if(h>=0&&f<=h)return e.copy(s);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return r=l/(l-h),e.copy(n).addScaledVector(Mi,r);Ko.subVectors(t,o);const d=Mi.dot(Ko),g=yi.dot(Ko);if(g>=0&&d<=g)return e.copy(o);const v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(yi,a);const m=h*g-d*f;if(m<=0&&f-h>=0&&d-g>=0)return Yr.subVectors(o,s),a=(f-h)/(f-h+(d-g)),e.copy(s).addScaledVector(Yr,a);const p=1/(m+v+u);return r=v*p,a=u*p,e.copy(n).addScaledVector(Mi,r).addScaledVector(yi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const mc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},Os={h:0,s:0,l:0};function Zo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Pt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ce){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Qt.workingColorSpace){if(t=ka(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=Zo(r,o,t+1/3),this.g=Zo(r,o,t),this.b=Zo(r,o,t-1/3)}return Qt.toWorkingColorSpace(this,s),this}setStyle(t,e=Ce){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ce){const n=mc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bi(t.r),this.g=Bi(t.g),this.b=Bi(t.b),this}copyLinearToSRGB(t){return this.r=Oo(t.r),this.g=Oo(t.g),this.b=Oo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ce){return Qt.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Ie(Ue.r*255,0,255))*65536+Math.round(Ie(Ue.g*255,0,255))*256+Math.round(Ie(Ue.b*255,0,255))}getHexString(t=Ce){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.fromWorkingColorSpace(Ue.copy(this),e);const n=Ue.r,s=Ue.g,o=Ue.b,r=Math.max(n,s,o),a=Math.min(n,s,o);let l,c;const h=(a+r)/2;if(a===r)l=0,c=0;else{const f=r-a;switch(c=h<=.5?f/(r+a):f/(2-r-a),r){case n:l=(s-o)/f+(s<o?6:0);break;case s:l=(o-n)/f+2;break;case o:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Ce){Qt.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,s=Ue.b;return t!==Ce?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Vn),this.setHSL(Vn.h+t,Vn.s+e,Vn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Vn),t.getHSL(Os);const n=ds(Vn.h,Os.h,e),s=ds(Vn.s,Os.s,e),o=ds(Vn.l,Os.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new Pt;Pt.NAMES=mc;let Fu=0;class Ss extends $i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=Ki(),this.name="",this.type="Material",this.blending=zi,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ga,this.blendDst=va,this.blendEquation=oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pt(0,0,0),this.blendAlpha=0,this.depthFunc=fo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ur,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=di,this.stencilZFail=di,this.stencilZPass=di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ga&&(n.blendSrc=this.blendSrc),this.blendDst!==va&&(n.blendDst=this.blendDst),this.blendEquation!==oi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==fo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ur&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==di&&(n.stencilFail=this.stencilFail),this.stencilZFail!==di&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==di&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const r=[];for(const a in o){const l=o[a];delete l.metadata,r.push(l)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class gc extends Ss{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=tc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Pn=Iu();function Iu(){const i=new ArrayBuffer(4),t=new Float32Array(i),e=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,s[l]=24,s[l|256]=24):(n[l]=31744,n[l|256]=64512,s[l]=13,s[l|256]=13)}const o=new Uint32Array(2048),r=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,o[l]=c|h}for(let l=1024;l<2048;++l)o[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)r[l]=l<<23;r[31]=1199570944,r[32]=2147483648;for(let l=33;l<63;++l)r[l]=2147483648+(l-32<<23);r[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:s,mantissaTable:o,exponentTable:r,offsetTable:a}}function ku(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=Ie(i,-65504,65504),Pn.floatView[0]=i;const t=Pn.uint32View[0],e=t>>23&511;return Pn.baseTable[e]+((t&8388607)>>Pn.shiftTable[e])}function zu(i){const t=i>>10;return Pn.uint32View[0]=Pn.mantissaTable[Pn.offsetTable[t]+(i&1023)]+Pn.exponentTable[t],Pn.floatView[0]}const jr={toHalfFloat:ku,fromHalfFloat:zu},ye=new z,Bs=new It;class he{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fr,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Bs.fromBufferAttribute(this,e),Bs.applyMatrix3(t),this.setXY(e,Bs.x,Bs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Di(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=He(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Di(e,this.array)),e}setX(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Di(e,this.array)),e}setY(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Di(e,this.array)),e}setZ(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Di(e,this.array)),e}setW(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),s=He(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),s=He(s,this.array),o=He(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Fr&&(t.usage=this.usage),t}}class vc extends he{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class xc extends he{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends he{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Nu=0;const an=new Kt,Jo=new Ze,wi=new z,tn=new Mn,is=new Mn,Te=new z;class Re extends $i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nu++}),this.uuid=Ki(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(uc(t)?xc:vc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Yt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,n){return an.makeTranslation(t,e,n),this.applyMatrix4(an),this}scale(t,e,n){return an.makeScale(t,e,n),this.applyMatrix4(an),this}lookAt(t){return Jo.lookAt(t),Jo.updateMatrix(),this.applyMatrix4(Jo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new re(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];tn.setFromBufferAttribute(o),this.morphTargetsRelative?(Te.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Te),Te.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Te)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new z,1/0);return}if(t){const n=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];is.setFromBufferAttribute(a),this.morphTargetsRelative?(Te.addVectors(tn.min,is.min),tn.expandByPoint(Te),Te.addVectors(tn.max,is.max),tn.expandByPoint(Te)):(tn.expandByPoint(is.min),tn.expandByPoint(is.max))}tn.getCenter(n);let s=0;for(let o=0,r=t.count;o<r;o++)Te.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(Te));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Te.fromBufferAttribute(a,c),l&&(wi.fromBufferAttribute(t,c),Te.add(wi)),s=Math.max(s,n.distanceToSquared(Te))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,s=e.position.array,o=e.normal.array,r=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new he(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let b=0;b<a;b++)c[b]=new z,h[b]=new z;const f=new z,u=new z,d=new z,g=new It,v=new It,m=new It,p=new z,_=new z;function x(b,I,V){f.fromArray(s,b*3),u.fromArray(s,I*3),d.fromArray(s,V*3),g.fromArray(r,b*2),v.fromArray(r,I*2),m.fromArray(r,V*2),u.sub(f),d.sub(f),v.sub(g),m.sub(g);const X=1/(v.x*m.y-m.x*v.y);isFinite(X)&&(p.copy(u).multiplyScalar(m.y).addScaledVector(d,-v.y).multiplyScalar(X),_.copy(d).multiplyScalar(v.x).addScaledVector(u,-m.x).multiplyScalar(X),c[b].add(p),c[I].add(p),c[V].add(p),h[b].add(_),h[I].add(_),h[V].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let b=0,I=y.length;b<I;++b){const V=y[b],X=V.start,T=V.count;for(let P=X,G=X+T;P<G;P+=3)x(n[P+0],n[P+1],n[P+2])}const w=new z,M=new z,E=new z,R=new z;function S(b){E.fromArray(o,b*3),R.copy(E);const I=c[b];w.copy(I),w.sub(E.multiplyScalar(E.dot(I))).normalize(),M.crossVectors(R,I);const X=M.dot(h[b])<0?-1:1;l[b*4]=w.x,l[b*4+1]=w.y,l[b*4+2]=w.z,l[b*4+3]=X}for(let b=0,I=y.length;b<I;++b){const V=y[b],X=V.start,T=V.count;for(let P=X,G=X+T;P<G;P+=3)S(n[P+0]),S(n[P+1]),S(n[P+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new he(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new z,o=new z,r=new z,a=new z,l=new z,c=new z,h=new z,f=new z;if(t)for(let u=0,d=t.count;u<d;u+=3){const g=t.getX(u+0),v=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,v),r.fromBufferAttribute(e,m),h.subVectors(r,o),f.subVectors(s,o),h.cross(f),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),o.fromBufferAttribute(e,u+1),r.fromBufferAttribute(e,u+2),h.subVectors(r,o),f.subVectors(s,o),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Te.fromBufferAttribute(t,e),Te.normalize(),t.setXYZ(e,Te.x,Te.y,Te.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h);let d=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?d=l[v]*a.data.stride+a.offset:d=l[v]*h;for(let p=0;p<h;p++)u[g++]=c[d++]}return new he(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Re,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const o=this.morphAttributes;for(const a in o){const l=[],c=o[a];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,l=r.length;a<l;a++){const c=r[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const o=t.morphAttributes;for(const c in o){const h=[],f=o[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let c=0,h=r.length;c<h;c++){const f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const $r=new Kt,ti=new za,Hs=new Zi,Kr=new z,Si=new z,bi=new z,Ei=new z,Qo=new z,Gs=new z,Vs=new It,Ws=new It,qs=new It,Zr=new z,Jr=new z,Qr=new z,Xs=new z,Ys=new z;class te extends Ze{constructor(t=new Re,e=new gc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){Gs.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=a[l],f=o[l];h!==0&&(Qo.fromBufferAttribute(f,t),r?Gs.addScaledVector(Qo,h):Gs.addScaledVector(Qo.sub(e),h))}e.add(Gs)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Hs.copy(n.boundingSphere),Hs.applyMatrix4(o),ti.copy(t.ray).recast(t.near),!(Hs.containsPoint(ti.origin)===!1&&(ti.intersectSphere(Hs,Kr)===null||ti.origin.distanceToSquared(Kr)>(t.far-t.near)**2))&&($r.copy(o).invert(),ti.copy(t.ray).applyMatrix4($r),!(n.boundingBox!==null&&ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ti)))}_computeIntersections(t,e,n){let s;const o=this.geometry,r=this.material,a=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,f=o.attributes.normal,u=o.groups,d=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=r[m.materialIndex],_=Math.max(m.start,d.start),x=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=_,w=x;y<w;y+=3){const M=a.getX(y),E=a.getX(y+1),R=a.getX(y+2);s=js(this,p,t,n,c,h,f,M,E,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(a.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const _=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);s=js(this,r,t,n,c,h,f,_,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let g=0,v=u.length;g<v;g++){const m=u[g],p=r[m.materialIndex],_=Math.max(m.start,d.start),x=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=_,w=x;y<w;y+=3){const M=y,E=y+1,R=y+2;s=js(this,p,t,n,c,h,f,M,E,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let m=g,p=v;m<p;m+=3){const _=m,x=m+1,y=m+2;s=js(this,r,t,n,c,h,f,_,x,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Ou(i,t,e,n,s,o,r,a){let l;if(t.side===Ve?l=n.intersectTriangle(r,o,s,!0,a):l=n.intersectTriangle(s,o,r,t.side===Fn,a),l===null)return null;Ys.copy(a),Ys.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Ys);return c<e.near||c>e.far?null:{distance:c,point:Ys.clone(),object:i}}function js(i,t,e,n,s,o,r,a,l,c){i.getVertexPosition(a,Si),i.getVertexPosition(l,bi),i.getVertexPosition(c,Ei);const h=Ou(i,t,e,n,Si,bi,Ei,Xs);if(h){s&&(Vs.fromBufferAttribute(s,a),Ws.fromBufferAttribute(s,l),qs.fromBufferAttribute(s,c),h.uv=dn.getInterpolation(Xs,Si,bi,Ei,Vs,Ws,qs,new It)),o&&(Vs.fromBufferAttribute(o,a),Ws.fromBufferAttribute(o,l),qs.fromBufferAttribute(o,c),h.uv1=dn.getInterpolation(Xs,Si,bi,Ei,Vs,Ws,qs,new It),h.uv2=h.uv1),r&&(Zr.fromBufferAttribute(r,a),Jr.fromBufferAttribute(r,l),Qr.fromBufferAttribute(r,c),h.normal=dn.getInterpolation(Xs,Si,bi,Ei,Zr,Jr,Qr,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new z,materialIndex:0};dn.getNormal(Si,bi,Ei,f.normal),h.face=f}return h}class bs extends Re{constructor(t=1,e=1,n=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const l=[],c=[],h=[],f=[];let u=0,d=0;g("z","y","x",-1,-1,n,e,t,r,o,0),g("z","y","x",1,-1,n,e,-t,r,o,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(f,2));function g(v,m,p,_,x,y,w,M,E,R,S){const b=y/E,I=w/R,V=y/2,X=w/2,T=M/2,P=E+1,G=R+1;let U=0,k=0;const O=new z;for(let C=0;C<G;C++){const B=C*I-X;for(let Z=0;Z<P;Z++){const N=Z*b-V;O[v]=N*_,O[m]=B*x,O[p]=T,c.push(O.x,O.y,O.z),O[v]=0,O[m]=0,O[p]=M>0?1:-1,h.push(O.x,O.y,O.z),f.push(Z/E),f.push(1-C/R),U+=1}}for(let C=0;C<R;C++)for(let B=0;B<E;B++){const Z=u+B+P*C,N=u+B+P*(C+1),j=u+(B+1)+P*(C+1),$=u+(B+1)+P*C;l.push(Z,N,$),l.push(N,j,$),k+=6}a.addGroup(d,k,S),d+=k,u+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Xi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ge(i){const t={};for(let e=0;e<i.length;e++){const n=Xi(i[e]);for(const s in n)t[s]=n[s]}return t}function Bu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function _c(i){return i.getRenderTarget()===null?i.outputColorSpace:Qt.workingColorSpace}const Hu={clone:Xi,merge:Ge};var Gu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Vu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ve extends Ss{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gu,this.fragmentShader=Vu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xi(t.uniforms),this.uniformsGroups=Bu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Mc extends Ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Kt,this.projectionMatrix=new Kt,this.projectionMatrixInverse=new Kt,this.coordinateSystem=Dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ye extends Mc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=vs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return vs*2*Math.atan(Math.tan(fs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;o+=r.offsetX*s/l,e-=r.offsetY*n/c,s*=r.width/l,n*=r.height/c}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ti=-90,Ai=1;class Wu extends Ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ye(Ti,Ai,t,e);s.layers=this.layers,this.add(s);const o=new Ye(Ti,Ai,t,e);o.layers=this.layers,this.add(o);const r=new Ye(Ti,Ai,t,e);r.layers=this.layers,this.add(r);const a=new Ye(Ti,Ai,t,e);a.layers=this.layers,this.add(a);const l=new Ye(Ti,Ai,t,e);l.layers=this.layers,this.add(l);const c=new Ye(Ti,Ai,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,r,a,l]=e;for(const c of e)this.remove(c);if(t===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===vo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class yc extends Ke{constructor(t,e,n,s,o,r,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Gi,super(t,e,n,s,o,r,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class qu extends sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(ps("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===ci?Ce:rn),this.texture=new yc(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ne}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new bs(5,5,5),o=new ve({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ve,blending:qn});o.uniforms.tEquirect.value=e;const r=new te(s,o),a=e.minFilter;return e.minFilter===ui&&(e.minFilter=ne),new Wu(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,s){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(o)}}const ta=new z,Xu=new z,Yu=new Yt;class ii{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ta.subVectors(n,e).cross(Xu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ta),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Yu.getNormalMatrix(t),s=this.coplanarPoint(ta).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ei=new Zi,$s=new z;class Es{constructor(t=new ii,e=new ii,n=new ii,s=new ii,o=new ii,r=new ii){this.planes=[t,e,n,s,o,r]}set(t,e,n,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Dn){const n=this.planes,s=t.elements,o=s[0],r=s[1],a=s[2],l=s[3],c=s[4],h=s[5],f=s[6],u=s[7],d=s[8],g=s[9],v=s[10],m=s[11],p=s[12],_=s[13],x=s[14],y=s[15];if(n[0].setComponents(l-o,u-c,m-d,y-p).normalize(),n[1].setComponents(l+o,u+c,m+d,y+p).normalize(),n[2].setComponents(l+r,u+h,m+g,y+_).normalize(),n[3].setComponents(l-r,u-h,m-g,y-_).normalize(),n[4].setComponents(l-a,u-f,m-v,y-x).normalize(),e===Dn)n[5].setComponents(l+a,u+f,m+v,y+x).normalize();else if(e===vo)n[5].setComponents(a,f,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ei)}intersectsSprite(t){return ei.center.set(0,0,0),ei.radius=.7071067811865476,ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(ei)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if($s.x=s.normal.x>0?t.max.x:t.min.x,$s.y=s.normal.y>0?t.max.y:t.min.y,$s.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint($s)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function wc(){let i=null,t=!1,e=null,n=null;function s(o,r){e(o,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function ju(i,t){const e=t.isWebGL2,n=new WeakMap;function s(c,h){const f=c.array,u=c.usage,d=f.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,f,u),c.onUploadCallback();let v;if(f instanceof Float32Array)v=i.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)v=i.SHORT;else if(f instanceof Uint32Array)v=i.UNSIGNED_INT;else if(f instanceof Int32Array)v=i.INT;else if(f instanceof Int8Array)v=i.BYTE;else if(f instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:g,type:v,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:d}}function o(c,h,f){const u=h.array,d=h._updateRange,g=h.updateRanges;if(i.bindBuffer(f,c),d.count===-1&&g.length===0&&i.bufferSubData(f,0,u),g.length!==0){for(let v=0,m=g.length;v<m;v++){const p=g[v];e?i.bufferSubData(f,p.start*u.BYTES_PER_ELEMENT,u,p.start,p.count):i.bufferSubData(f,p.start*u.BYTES_PER_ELEMENT,u.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(e?i.bufferSubData(f,d.offset*u.BYTES_PER_ELEMENT,u,d.offset,d.count):i.bufferSubData(f,d.offset*u.BYTES_PER_ELEMENT,u.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const u=n.get(c);(!u||u.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=n.get(c);if(f===void 0)n.set(c,s(c,h));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(f.buffer,c,h),f.version=c.version}}return{get:r,remove:a,update:l}}class Oa extends Re{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,f=t/a,u=e/l,d=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const _=p*u-r;for(let x=0;x<c;x++){const y=x*f-o;g.push(y,-_,0),v.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){const x=_+c*p,y=_+c*(p+1),w=_+1+c*(p+1),M=_+1+c*p;d.push(x,y,M),d.push(y,w,M)}this.setIndex(d),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oa(t.width,t.height,t.widthSegments,t.heightSegments)}}var $u=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ku=`#ifdef USE_ALPHAHASH
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
#endif`,Zu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ju=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qu=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,tf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ef=`#ifdef USE_AOMAP
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
#endif`,nf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sf=`#ifdef USE_BATCHING
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
#endif`,of=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,af=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,lf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,cf=`#ifdef USE_IRIDESCENCE
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
#endif`,hf=`#ifdef USE_BUMPMAP
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
#endif`,uf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ff=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,df=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,mf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,gf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,xf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,_f=`#define PI 3.141592653589793
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
} // validated`,Mf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,yf=`vec3 transformedNormal = objectNormal;
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
#endif`,wf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Sf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ef=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Tf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Af=`
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
}`,Cf=`#ifdef USE_ENVMAP
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
#endif`,Rf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Pf=`#ifdef USE_ENVMAP
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
#endif`,Lf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Df=`#ifdef USE_ENVMAP
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
#endif`,Uf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ff=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,If=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zf=`#ifdef USE_GRADIENTMAP
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
}`,Nf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Of=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gf=`uniform bool receiveShadow;
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
#endif`,Vf=`#ifdef USE_ENVMAP
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
#endif`,Wf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Xf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jf=`PhysicalMaterial material;
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
#endif`,$f=`struct PhysicalMaterial {
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
}`,Kf=`
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
#endif`,Zf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Jf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,td=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ed=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,nd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,id=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,od=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ad=`#if defined( USE_POINTS_UV )
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
#endif`,rd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ld=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cd=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,hd=`#ifdef USE_MORPHNORMALS
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
#endif`,ud=`#ifdef USE_MORPHTARGETS
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
#endif`,fd=`#ifdef USE_MORPHTARGETS
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
#endif`,dd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,pd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,md=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,xd=`#ifdef USE_NORMALMAP
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
#endif`,_d=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Md=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ed=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Td=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ad=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Pd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ld=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Dd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ud=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Fd=`float getShadowMask() {
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
}`,Id=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kd=`#ifdef USE_SKINNING
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
#endif`,zd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nd=`#ifdef USE_SKINNING
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
#endif`,Od=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Hd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Vd=`#ifdef USE_TRANSMISSION
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
#endif`,Wd=`#ifdef USE_TRANSMISSION
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
#endif`,qd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Yd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const $d=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kd=`uniform sampler2D t2D;
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
}`,Zd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Qd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,t0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,e0=`#include <common>
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
}`,n0=`#if DEPTH_PACKING == 3200
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
}`,i0=`#define DISTANCE
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
}`,s0=`#define DISTANCE
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
}`,o0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,a0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,r0=`uniform float scale;
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
}`,l0=`uniform vec3 diffuse;
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
}`,c0=`#include <common>
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
}`,h0=`uniform vec3 diffuse;
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
}`,u0=`#define LAMBERT
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
}`,f0=`#define LAMBERT
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
}`,d0=`#define MATCAP
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
}`,p0=`#define MATCAP
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
}`,m0=`#define NORMAL
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
}`,g0=`#define NORMAL
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
}`,v0=`#define PHONG
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
}`,x0=`#define PHONG
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
}`,_0=`#define STANDARD
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
}`,M0=`#define STANDARD
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
}`,y0=`#define TOON
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
}`,w0=`#define TOON
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
}`,S0=`uniform float size;
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
}`,b0=`uniform vec3 diffuse;
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
}`,E0=`#include <common>
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
}`,T0=`uniform vec3 color;
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
}`,A0=`uniform float rotation;
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
}`,C0=`uniform vec3 diffuse;
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
}`,Vt={alphahash_fragment:$u,alphahash_pars_fragment:Ku,alphamap_fragment:Zu,alphamap_pars_fragment:Ju,alphatest_fragment:Qu,alphatest_pars_fragment:tf,aomap_fragment:ef,aomap_pars_fragment:nf,batching_pars_vertex:sf,batching_vertex:of,begin_vertex:af,beginnormal_vertex:rf,bsdfs:lf,iridescence_fragment:cf,bumpmap_pars_fragment:hf,clipping_planes_fragment:uf,clipping_planes_pars_fragment:ff,clipping_planes_pars_vertex:df,clipping_planes_vertex:pf,color_fragment:mf,color_pars_fragment:gf,color_pars_vertex:vf,color_vertex:xf,common:_f,cube_uv_reflection_fragment:Mf,defaultnormal_vertex:yf,displacementmap_pars_vertex:wf,displacementmap_vertex:Sf,emissivemap_fragment:bf,emissivemap_pars_fragment:Ef,colorspace_fragment:Tf,colorspace_pars_fragment:Af,envmap_fragment:Cf,envmap_common_pars_fragment:Rf,envmap_pars_fragment:Pf,envmap_pars_vertex:Lf,envmap_physical_pars_fragment:Vf,envmap_vertex:Df,fog_vertex:Uf,fog_pars_vertex:Ff,fog_fragment:If,fog_pars_fragment:kf,gradientmap_pars_fragment:zf,lightmap_fragment:Nf,lightmap_pars_fragment:Of,lights_lambert_fragment:Bf,lights_lambert_pars_fragment:Hf,lights_pars_begin:Gf,lights_toon_fragment:Wf,lights_toon_pars_fragment:qf,lights_phong_fragment:Xf,lights_phong_pars_fragment:Yf,lights_physical_fragment:jf,lights_physical_pars_fragment:$f,lights_fragment_begin:Kf,lights_fragment_maps:Zf,lights_fragment_end:Jf,logdepthbuf_fragment:Qf,logdepthbuf_pars_fragment:td,logdepthbuf_pars_vertex:ed,logdepthbuf_vertex:nd,map_fragment:id,map_pars_fragment:sd,map_particle_fragment:od,map_particle_pars_fragment:ad,metalnessmap_fragment:rd,metalnessmap_pars_fragment:ld,morphcolor_vertex:cd,morphnormal_vertex:hd,morphtarget_pars_vertex:ud,morphtarget_vertex:fd,normal_fragment_begin:dd,normal_fragment_maps:pd,normal_pars_fragment:md,normal_pars_vertex:gd,normal_vertex:vd,normalmap_pars_fragment:xd,clearcoat_normal_fragment_begin:_d,clearcoat_normal_fragment_maps:Md,clearcoat_pars_fragment:yd,iridescence_pars_fragment:wd,opaque_fragment:Sd,packing:bd,premultiplied_alpha_fragment:Ed,project_vertex:Td,dithering_fragment:Ad,dithering_pars_fragment:Cd,roughnessmap_fragment:Rd,roughnessmap_pars_fragment:Pd,shadowmap_pars_fragment:Ld,shadowmap_pars_vertex:Dd,shadowmap_vertex:Ud,shadowmask_pars_fragment:Fd,skinbase_vertex:Id,skinning_pars_vertex:kd,skinning_vertex:zd,skinnormal_vertex:Nd,specularmap_fragment:Od,specularmap_pars_fragment:Bd,tonemapping_fragment:Hd,tonemapping_pars_fragment:Gd,transmission_fragment:Vd,transmission_pars_fragment:Wd,uv_pars_fragment:qd,uv_pars_vertex:Xd,uv_vertex:Yd,worldpos_vertex:jd,background_vert:$d,background_frag:Kd,backgroundCube_vert:Zd,backgroundCube_frag:Jd,cube_vert:Qd,cube_frag:t0,depth_vert:e0,depth_frag:n0,distanceRGBA_vert:i0,distanceRGBA_frag:s0,equirect_vert:o0,equirect_frag:a0,linedashed_vert:r0,linedashed_frag:l0,meshbasic_vert:c0,meshbasic_frag:h0,meshlambert_vert:u0,meshlambert_frag:f0,meshmatcap_vert:d0,meshmatcap_frag:p0,meshnormal_vert:m0,meshnormal_frag:g0,meshphong_vert:v0,meshphong_frag:x0,meshphysical_vert:_0,meshphysical_frag:M0,meshtoon_vert:y0,meshtoon_frag:w0,points_vert:S0,points_frag:b0,shadow_vert:E0,shadow_frag:T0,sprite_vert:A0,sprite_frag:C0},vt={common:{diffuse:{value:new Pt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new It(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Pt(16777215)},opacity:{value:1},center:{value:new It(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},xn={basic:{uniforms:Ge([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:Ge([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:Ge([vt.common,vt.specularmap,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,vt.lights,{emissive:{value:new Pt(0)},specular:{value:new Pt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:Ge([vt.common,vt.envmap,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.roughnessmap,vt.metalnessmap,vt.fog,vt.lights,{emissive:{value:new Pt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:Ge([vt.common,vt.aomap,vt.lightmap,vt.emissivemap,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.gradientmap,vt.fog,vt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:Ge([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,vt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:Ge([vt.points,vt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:Ge([vt.common,vt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:Ge([vt.common,vt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:Ge([vt.common,vt.bumpmap,vt.normalmap,vt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:Ge([vt.sprite,vt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:Ge([vt.common,vt.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:Ge([vt.lights,vt.fog,{color:{value:new Pt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};xn.physical={uniforms:Ge([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new It(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Pt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new It},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Pt(0)},specularColor:{value:new Pt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new It},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};const Ks={r:0,b:0,g:0};function R0(i,t,e,n,s,o,r){const a=new Pt(0);let l=o===!0?0:1,c,h,f=null,u=0,d=null;function g(m,p){let _=!1,x=p.isScene===!0?p.background:null;x&&x.isTexture&&(x=(p.backgroundBlurriness>0?e:t).get(x)),x===null?v(a,l):x&&x.isColor&&(v(x,1),_=!0);const y=i.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,r):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||_)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===So)?(h===void 0&&(h=new te(new bs(1,1,1),new ve({name:"BackgroundCubeMaterial",uniforms:Xi(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Ve,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,M,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=Qt.getTransfer(x.colorSpace)!==le,(f!==x||u!==x.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=x,u=x.version,d=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new te(new Oa(2,2),new ve({name:"BackgroundMaterial",uniforms:Xi(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=Qt.getTransfer(x.colorSpace)!==le,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(f!==x||u!==x.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,f=x,u=x.version,d=i.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function v(m,p){m.getRGB(Ks,_c(i)),n.buffers.color.setClear(Ks.r,Ks.g,Ks.b,p,r)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,v(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,v(a,l)},render:g}}function P0(i,t,e,n){const s=i.getParameter(i.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:t.get("OES_vertex_array_object"),r=n.isWebGL2||o!==null,a={},l=m(null);let c=l,h=!1;function f(T,P,G,U,k){let O=!1;if(r){const C=v(U,G,P);c!==C&&(c=C,d(c.object)),O=p(T,U,G,k),O&&_(T,U,G,k)}else{const C=P.wireframe===!0;(c.geometry!==U.id||c.program!==G.id||c.wireframe!==C)&&(c.geometry=U.id,c.program=G.id,c.wireframe=C,O=!0)}k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(O||h)&&(h=!1,R(T,P,G,U),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function u(){return n.isWebGL2?i.createVertexArray():o.createVertexArrayOES()}function d(T){return n.isWebGL2?i.bindVertexArray(T):o.bindVertexArrayOES(T)}function g(T){return n.isWebGL2?i.deleteVertexArray(T):o.deleteVertexArrayOES(T)}function v(T,P,G){const U=G.wireframe===!0;let k=a[T.id];k===void 0&&(k={},a[T.id]=k);let O=k[P.id];O===void 0&&(O={},k[P.id]=O);let C=O[U];return C===void 0&&(C=m(u()),O[U]=C),C}function m(T){const P=[],G=[],U=[];for(let k=0;k<s;k++)P[k]=0,G[k]=0,U[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:G,attributeDivisors:U,object:T,attributes:{},index:null}}function p(T,P,G,U){const k=c.attributes,O=P.attributes;let C=0;const B=G.getAttributes();for(const Z in B)if(B[Z].location>=0){const j=k[Z];let $=O[Z];if($===void 0&&(Z==="instanceMatrix"&&T.instanceMatrix&&($=T.instanceMatrix),Z==="instanceColor"&&T.instanceColor&&($=T.instanceColor)),j===void 0||j.attribute!==$||$&&j.data!==$.data)return!0;C++}return c.attributesNum!==C||c.index!==U}function _(T,P,G,U){const k={},O=P.attributes;let C=0;const B=G.getAttributes();for(const Z in B)if(B[Z].location>=0){let j=O[Z];j===void 0&&(Z==="instanceMatrix"&&T.instanceMatrix&&(j=T.instanceMatrix),Z==="instanceColor"&&T.instanceColor&&(j=T.instanceColor));const $={};$.attribute=j,j&&j.data&&($.data=j.data),k[Z]=$,C++}c.attributes=k,c.attributesNum=C,c.index=U}function x(){const T=c.newAttributes;for(let P=0,G=T.length;P<G;P++)T[P]=0}function y(T){w(T,0)}function w(T,P){const G=c.newAttributes,U=c.enabledAttributes,k=c.attributeDivisors;G[T]=1,U[T]===0&&(i.enableVertexAttribArray(T),U[T]=1),k[T]!==P&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](T,P),k[T]=P)}function M(){const T=c.newAttributes,P=c.enabledAttributes;for(let G=0,U=P.length;G<U;G++)P[G]!==T[G]&&(i.disableVertexAttribArray(G),P[G]=0)}function E(T,P,G,U,k,O,C){C===!0?i.vertexAttribIPointer(T,P,G,k,O):i.vertexAttribPointer(T,P,G,U,k,O)}function R(T,P,G,U){if(n.isWebGL2===!1&&(T.isInstancedMesh||U.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const k=U.attributes,O=G.getAttributes(),C=P.defaultAttributeValues;for(const B in O){const Z=O[B];if(Z.location>=0){let N=k[B];if(N===void 0&&(B==="instanceMatrix"&&T.instanceMatrix&&(N=T.instanceMatrix),B==="instanceColor"&&T.instanceColor&&(N=T.instanceColor)),N!==void 0){const j=N.normalized,$=N.itemSize,J=e.get(N);if(J===void 0)continue;const ct=J.buffer,ht=J.type,W=J.bytesPerElement,q=n.isWebGL2===!0&&(ht===i.INT||ht===i.UNSIGNED_INT||N.gpuType===nc);if(N.isInterleavedBufferAttribute){const it=N.data,F=it.stride,pt=N.offset;if(it.isInstancedInterleavedBuffer){for(let at=0;at<Z.locationSize;at++)w(Z.location+at,it.meshPerAttribute);T.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let at=0;at<Z.locationSize;at++)y(Z.location+at);i.bindBuffer(i.ARRAY_BUFFER,ct);for(let at=0;at<Z.locationSize;at++)E(Z.location+at,$/Z.locationSize,ht,j,F*W,(pt+$/Z.locationSize*at)*W,q)}else{if(N.isInstancedBufferAttribute){for(let it=0;it<Z.locationSize;it++)w(Z.location+it,N.meshPerAttribute);T.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=N.meshPerAttribute*N.count)}else for(let it=0;it<Z.locationSize;it++)y(Z.location+it);i.bindBuffer(i.ARRAY_BUFFER,ct);for(let it=0;it<Z.locationSize;it++)E(Z.location+it,$/Z.locationSize,ht,j,$*W,$/Z.locationSize*it*W,q)}}else if(C!==void 0){const j=C[B];if(j!==void 0)switch(j.length){case 2:i.vertexAttrib2fv(Z.location,j);break;case 3:i.vertexAttrib3fv(Z.location,j);break;case 4:i.vertexAttrib4fv(Z.location,j);break;default:i.vertexAttrib1fv(Z.location,j)}}}}M()}function S(){V();for(const T in a){const P=a[T];for(const G in P){const U=P[G];for(const k in U)g(U[k].object),delete U[k];delete P[G]}delete a[T]}}function b(T){if(a[T.id]===void 0)return;const P=a[T.id];for(const G in P){const U=P[G];for(const k in U)g(U[k].object),delete U[k];delete P[G]}delete a[T.id]}function I(T){for(const P in a){const G=a[P];if(G[T.id]===void 0)continue;const U=G[T.id];for(const k in U)g(U[k].object),delete U[k];delete G[T.id]}}function V(){X(),h=!0,c!==l&&(c=l,d(c.object))}function X(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:V,resetDefaultState:X,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfProgram:I,initAttributes:x,enableAttribute:y,disableUnusedAttributes:M}}function L0(i,t,e,n){const s=n.isWebGL2;let o;function r(h){o=h}function a(h,f){i.drawArrays(o,h,f),e.update(f,o,1)}function l(h,f,u){if(u===0)return;let d,g;if(s)d=i,g="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[g](o,h,f,u),e.update(f,o,u)}function c(h,f,u){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<u;g++)this.render(h[g],f[g]);else{d.multiDrawArraysWEBGL(o,h,0,f,0,u);let g=0;for(let v=0;v<u;v++)g+=f[v];e.update(g,o,1)}}this.setMode=r,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function D0(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const r=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=o(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=r||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),u=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=u>0,y=r||t.has("OES_texture_float"),w=x&&y,M=r?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:r,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:o,precision:a,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:u,maxTextureSize:d,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:_,vertexTextures:x,floatFragmentTextures:y,floatVertexTextures:w,maxSamples:M}}function U0(i){const t=this;let e=null,n=0,s=!1,o=!1;const r=new ii,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const g=f.clippingPlanes,v=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!s||g===null||g.length===0||o&&!m)o?h(null):c();else{const _=o?0:n,x=_*4;let y=p.clippingState||null;l.value=y,y=h(g,u,x,d);for(let w=0;w!==x;++w)y[w]=e[w];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,g){const v=f!==null?f.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=d+v*4,_=u.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=d;x!==v;++x,y+=4)r.copy(f[x]).applyMatrix4(_,a),r.normal.toArray(m,y),m[y+3]=r.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function F0(i){let t=new WeakMap;function e(r,a){return a===xa?r.mapping=Gi:a===_a&&(r.mapping=Vi),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===xa||a===_a)if(t.has(r)){const l=t.get(r).texture;return e(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new qu(l.height/2);return c.fromEquirectangularTexture(i,r),t.set(r,c),r.addEventListener("dispose",s),e(c.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Ts extends Mc{constructor(t=-1,e=1,n=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,r=o+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Fi=4,tl=[.125,.215,.35,.446,.526,.582],ai=20,ea=new Ts,el=new Pt;let na=null,ia=0,sa=0;const si=(1+Math.sqrt(5))/2,Ci=1/si,nl=[new z(1,1,1),new z(-1,1,1),new z(1,1,-1),new z(-1,1,-1),new z(0,si,Ci),new z(0,si,-Ci),new z(Ci,0,si),new z(-Ci,0,si),new z(si,Ci,0),new z(-si,Ci,0)];class il{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){na=this._renderer.getRenderTarget(),ia=this._renderer.getActiveCubeFace(),sa=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,s,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=al(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ol(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(na,ia,sa),t.scissorTest=!1,Zs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Gi||t.mapping===Vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),na=this._renderer.getRenderTarget(),ia=this._renderer.getActiveCubeFace(),sa=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ne,minFilter:ne,generateMipmaps:!1,type:In,format:ke,colorSpace:kn,depthBuffer:!1},s=sl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=sl(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=I0(o)),this._blurMaterial=k0(o,t,e)}return s}_compileMaterial(t){const e=new te(this._lodPlanes[0],t);this._renderer.compile(e,ea)}_sceneToCubeUV(t,e,n,s){const a=new Ye(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(el),h.toneMapping=Xn,h.autoClear=!1;const d=new gc({name:"PMREM.Background",side:Ve,depthWrite:!1,depthTest:!1}),g=new te(new bs,d);let v=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,v=!0):(d.color.copy(el),v=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):_===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const x=this._cubeSize;Zs(s,_*x,p>2?x:0,x,x),h.setRenderTarget(s),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Gi||t.mapping===Vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=al()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ol());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new te(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const l=this._cubeSize;Zs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(r,ea)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=nl[(s-1)%nl.length];this._blur(t,s-1,s,o,r)}e.autoClear=n}_blur(t,e,n,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",o),this._halfBlur(r,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,r,a){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new te(this._lodPlanes[s],c),u=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*ai-1),v=o/g,m=isFinite(o)?1+Math.floor(h*v):ai;m>ai&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ai}`);const p=[];let _=0;for(let E=0;E<ai;++E){const R=E/v,S=Math.exp(-R*R/2);p.push(S),E===0?_+=S:E<m&&(_+=2*S)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=r==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:x}=this;u.dTheta.value=g,u.mipInt.value=x-n;const y=this._sizeLods[s],w=3*y*(s>x-Fi?s-x+Fi:0),M=4*(this._cubeSize-y);Zs(e,w,M,3*y,2*y),l.setRenderTarget(e),l.render(f,ea)}}function I0(i){const t=[],e=[],n=[];let s=i;const o=i-Fi+1+tl.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let l=1/a;r>i-Fi?l=tl[r-i+Fi-1]:r===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,g=6,v=3,m=2,p=1,_=new Float32Array(v*g*d),x=new Float32Array(m*g*d),y=new Float32Array(p*g*d);for(let M=0;M<d;M++){const E=M%3*2/3-1,R=M>2?0:-1,S=[E,R,0,E+2/3,R,0,E+2/3,R+1,0,E,R,0,E+2/3,R+1,0,E,R+1,0];_.set(S,v*g*M),x.set(u,m*g*M);const b=[M,M,M,M,M,M];y.set(b,p*g*M)}const w=new Re;w.setAttribute("position",new he(_,v)),w.setAttribute("uv",new he(x,m)),w.setAttribute("faceIndex",new he(y,p)),t.push(w),s>Fi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function sl(i,t,e){const n=new sn(i,t,e);return n.texture.mapping=So,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function k0(i,t,e){const n=new Float32Array(ai),s=new z(0,1,0);return new ve({name:"SphericalGaussianBlur",defines:{n:ai,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ba(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function ol(){return new ve({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ba(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function al(){return new ve({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ba(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function Ba(){return`

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
	`}function z0(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===xa||l===_a,h=l===Gi||l===Vi;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=t.get(a);return e===null&&(e=new il(i)),f=c?e.fromEquirectangular(a,f):e.fromCubemap(a,f),t.set(a,f),f.texture}else{if(t.has(a))return t.get(a).texture;{const f=a.image;if(c&&f&&f.height>0||h&&f&&s(f)){e===null&&(e=new il(i));const u=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,u),a.addEventListener("dispose",o),u.texture}else return null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function o(a){const l=a.target;l.removeEventListener("dispose",o);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function N0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function O0(i,t,e,n){const s={},o=new WeakMap;function r(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);for(const g in u.morphAttributes){const v=u.morphAttributes[g];for(let m=0,p=v.length;m<p;m++)t.remove(v[m])}u.removeEventListener("dispose",r),delete s[u.id];const d=o.get(u);d&&(t.remove(d),o.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",r),s[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const g in u)t.update(u[g],i.ARRAY_BUFFER);const d=f.morphAttributes;for(const g in d){const v=d[g];for(let m=0,p=v.length;m<p;m++)t.update(v[m],i.ARRAY_BUFFER)}}function c(f){const u=[],d=f.index,g=f.attributes.position;let v=0;if(d!==null){const _=d.array;v=d.version;for(let x=0,y=_.length;x<y;x+=3){const w=_[x+0],M=_[x+1],E=_[x+2];u.push(w,M,M,E,E,w)}}else if(g!==void 0){const _=g.array;v=g.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const w=x+0,M=x+1,E=x+2;u.push(w,M,M,E,E,w)}}else return;const m=new(uc(u)?xc:vc)(u,1);m.version=v;const p=o.get(f);p&&t.remove(p),o.set(f,m)}function h(f){const u=o.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return o.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function B0(i,t,e,n){const s=n.isWebGL2;let o;function r(d){o=d}let a,l;function c(d){a=d.type,l=d.bytesPerElement}function h(d,g){i.drawElements(o,g,a,d*l),e.update(g,o,1)}function f(d,g,v){if(v===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](o,g,a,d*l,v),e.update(g,o,v)}function u(d,g,v){if(v===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<v;p++)this.render(d[p]/l,g[p]);else{m.multiDrawElementsWEBGL(o,g,0,a,d,0,v);let p=0;for(let _=0;_<v;_++)p+=g[_];e.update(p,o,1)}}this.setMode=r,this.setIndex=c,this.render=h,this.renderInstances=f,this.renderMultiDraw=u}function H0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=a*(o/3);break;case i.LINES:e.lines+=a*(o/2);break;case i.LINE_STRIP:e.lines+=a*(o-1);break;case i.LINE_LOOP:e.lines+=a*o;break;case i.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function G0(i,t){return i[0]-t[0]}function V0(i,t){return Math.abs(t[1])-Math.abs(i[1])}function W0(i,t,e){const n={},s=new Float32Array(8),o=new WeakMap,r=new ge,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,f){const u=c.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=d!==void 0?d.length:0;let v=o.get(h);if(v===void 0||v.count!==g){let T=function(){V.dispose(),o.delete(h),h.removeEventListener("dispose",T)};v!==void 0&&v.texture.dispose();const _=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],M=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let R=0;_===!0&&(R=1),x===!0&&(R=2),y===!0&&(R=3);let S=h.attributes.position.count*R,b=1;S>t.maxTextureSize&&(b=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const I=new Float32Array(S*b*4*g),V=new pc(I,S,b,g);V.type=pn,V.needsUpdate=!0;const X=R*4;for(let P=0;P<g;P++){const G=w[P],U=M[P],k=E[P],O=S*b*4*P;for(let C=0;C<G.count;C++){const B=C*X;_===!0&&(r.fromBufferAttribute(G,C),I[O+B+0]=r.x,I[O+B+1]=r.y,I[O+B+2]=r.z,I[O+B+3]=0),x===!0&&(r.fromBufferAttribute(U,C),I[O+B+4]=r.x,I[O+B+5]=r.y,I[O+B+6]=r.z,I[O+B+7]=0),y===!0&&(r.fromBufferAttribute(k,C),I[O+B+8]=r.x,I[O+B+9]=r.y,I[O+B+10]=r.z,I[O+B+11]=k.itemSize===4?r.w:1)}}v={count:g,texture:V,size:new It(S,b)},o.set(h,v),h.addEventListener("dispose",T)}let m=0;for(let _=0;_<u.length;_++)m+=u[_];const p=h.morphTargetsRelative?1:1-m;f.getUniforms().setValue(i,"morphTargetBaseInfluence",p),f.getUniforms().setValue(i,"morphTargetInfluences",u),f.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{const d=u===void 0?0:u.length;let g=n[h.id];if(g===void 0||g.length!==d){g=[];for(let x=0;x<d;x++)g[x]=[x,0];n[h.id]=g}for(let x=0;x<d;x++){const y=g[x];y[0]=x,y[1]=u[x]}g.sort(V0);for(let x=0;x<8;x++)x<d&&g[x][1]?(a[x][0]=g[x][0],a[x][1]=g[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(G0);const v=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let x=0;x<8;x++){const y=a[x],w=y[0],M=y[1];w!==Number.MAX_SAFE_INTEGER&&M?(v&&h.getAttribute("morphTarget"+x)!==v[w]&&h.setAttribute("morphTarget"+x,v[w]),m&&h.getAttribute("morphNormal"+x)!==m[w]&&h.setAttribute("morphNormal"+x,m[w]),s[x]=M,p+=M):(v&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),m&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),s[x]=0)}const _=h.morphTargetsRelative?1:1-p;f.getUniforms().setValue(i,"morphTargetBaseInfluence",_),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function q0(i,t,e,n){let s=new WeakMap;function o(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(s.get(f)!==c&&(t.update(f),s.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return f}function r(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:o,dispose:r}}class Ha extends Ke{constructor(t,e,n,s,o,r,a,l,c,h){if(h=h!==void 0?h:li,h!==li&&h!==Wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===li&&(n=Ln),n===void 0&&h===Wi&&(n=ri),super(null,s,o,r,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:ue,this.minFilter=l!==void 0?l:ue,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Sc=new Ke,bc=new Ha(1,1);bc.compareFunction=hc;const Ec=new pc,Tc=new Sa,Ac=new yc,rl=[],ll=[],cl=new Float32Array(16),hl=new Float32Array(9),ul=new Float32Array(4);function Ji(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=rl[s];if(o===void 0&&(o=new Float32Array(s),rl[s]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,i[r].toArray(o,a)}return o}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Se(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Eo(i,t){let e=ll[t];e===void 0&&(e=new Int32Array(t),ll[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function X0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Y0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),Se(e,t)}}function j0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),Se(e,t)}}function $0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),Se(e,t)}}function K0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Se(e,t)}else{if(we(e,n))return;ul.set(n),i.uniformMatrix2fv(this.addr,!1,ul),Se(e,n)}}function Z0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Se(e,t)}else{if(we(e,n))return;hl.set(n),i.uniformMatrix3fv(this.addr,!1,hl),Se(e,n)}}function J0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Se(e,t)}else{if(we(e,n))return;cl.set(n),i.uniformMatrix4fv(this.addr,!1,cl),Se(e,n)}}function Q0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function tp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),Se(e,t)}}function ep(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),Se(e,t)}}function np(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),Se(e,t)}}function ip(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function sp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),Se(e,t)}}function op(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),Se(e,t)}}function ap(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),Se(e,t)}}function rp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const o=this.type===i.SAMPLER_2D_SHADOW?bc:Sc;e.setTexture2D(t||o,s)}function lp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Tc,s)}function cp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Ac,s)}function hp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ec,s)}function up(i){switch(i){case 5126:return X0;case 35664:return Y0;case 35665:return j0;case 35666:return $0;case 35674:return K0;case 35675:return Z0;case 35676:return J0;case 5124:case 35670:return Q0;case 35667:case 35671:return tp;case 35668:case 35672:return ep;case 35669:case 35673:return np;case 5125:return ip;case 36294:return sp;case 36295:return op;case 36296:return ap;case 35678:case 36198:case 36298:case 36306:case 35682:return rp;case 35679:case 36299:case 36307:return lp;case 35680:case 36300:case 36308:case 36293:return cp;case 36289:case 36303:case 36311:case 36292:return hp}}function fp(i,t){i.uniform1fv(this.addr,t)}function dp(i,t){const e=Ji(t,this.size,2);i.uniform2fv(this.addr,e)}function pp(i,t){const e=Ji(t,this.size,3);i.uniform3fv(this.addr,e)}function mp(i,t){const e=Ji(t,this.size,4);i.uniform4fv(this.addr,e)}function gp(i,t){const e=Ji(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function vp(i,t){const e=Ji(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function xp(i,t){const e=Ji(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function _p(i,t){i.uniform1iv(this.addr,t)}function Mp(i,t){i.uniform2iv(this.addr,t)}function yp(i,t){i.uniform3iv(this.addr,t)}function wp(i,t){i.uniform4iv(this.addr,t)}function Sp(i,t){i.uniform1uiv(this.addr,t)}function bp(i,t){i.uniform2uiv(this.addr,t)}function Ep(i,t){i.uniform3uiv(this.addr,t)}function Tp(i,t){i.uniform4uiv(this.addr,t)}function Ap(i,t,e){const n=this.cache,s=t.length,o=Eo(e,s);we(n,o)||(i.uniform1iv(this.addr,o),Se(n,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||Sc,o[r])}function Cp(i,t,e){const n=this.cache,s=t.length,o=Eo(e,s);we(n,o)||(i.uniform1iv(this.addr,o),Se(n,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||Tc,o[r])}function Rp(i,t,e){const n=this.cache,s=t.length,o=Eo(e,s);we(n,o)||(i.uniform1iv(this.addr,o),Se(n,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||Ac,o[r])}function Pp(i,t,e){const n=this.cache,s=t.length,o=Eo(e,s);we(n,o)||(i.uniform1iv(this.addr,o),Se(n,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||Ec,o[r])}function Lp(i){switch(i){case 5126:return fp;case 35664:return dp;case 35665:return pp;case 35666:return mp;case 35674:return gp;case 35675:return vp;case 35676:return xp;case 5124:case 35670:return _p;case 35667:case 35671:return Mp;case 35668:case 35672:return yp;case 35669:case 35673:return wp;case 5125:return Sp;case 36294:return bp;case 36295:return Ep;case 36296:return Tp;case 35678:case 36198:case 36298:case 36306:case 35682:return Ap;case 35679:case 36299:case 36307:return Cp;case 35680:case 36300:case 36308:case 36293:return Rp;case 36289:case 36303:case 36311:case 36292:return Pp}}class Dp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=up(e.type)}}class Up{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Lp(e.type)}}class Fp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],n)}}}const oa=/(\w+)(\])?(\[|\.)?/g;function fl(i,t){i.seq.push(t),i.map[t.id]=t}function Ip(i,t,e){const n=i.name,s=n.length;for(oa.lastIndex=0;;){const o=oa.exec(n),r=oa.lastIndex;let a=o[1];const l=o[2]==="]",c=o[3];if(l&&(a=a|0),c===void 0||c==="["&&r+2===s){fl(e,c===void 0?new Dp(a,i,t):new Up(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new Fp(a),fl(e,f)),e=f}}}class ro{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);Ip(o,r,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function dl(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const kp=37297;let zp=0;function Np(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}function Op(i){const t=Qt.getPrimaries(Qt.workingColorSpace),e=Qt.getPrimaries(i);let n;switch(t===e?n="":t===go&&e===mo?n="LinearDisplayP3ToLinearSRGB":t===mo&&e===go&&(n="LinearSRGBToLinearDisplayP3"),i){case kn:case bo:return[n,"LinearTransferOETF"];case Ce:case Ia:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function pl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Np(i.getShaderSource(t),r)}else return s}function Bp(i,t){const e=Op(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Hp(i,t){let e;switch(t){case Ih:e="Linear";break;case kh:e="Reinhard";break;case zh:e="OptimizedCineon";break;case Nh:e="ACESFilmic";break;case Bh:e="AgX";break;case Oh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Gp(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ii).join(`
`)}function Vp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ii).join(`
`)}function Wp(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function qp(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),r=o.name;let a=1;o.type===i.FLOAT_MAT2&&(a=2),o.type===i.FLOAT_MAT3&&(a=3),o.type===i.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:i.getAttribLocation(t,r),locationSize:a}}return e}function Ii(i){return i!==""}function ml(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function gl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Xp=/^[ \t]*#include +<([\w\d./]+)>/gm;function ba(i){return i.replace(Xp,jp)}const Yp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function jp(i,t){let e=Vt[t];if(e===void 0){const n=Yp.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ba(e)}const $p=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vl(i){return i.replace($p,Kp)}function Kp(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function xl(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Zp(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ql?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===ch?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Cn&&(t="SHADOWMAP_TYPE_VSM"),t}function Jp(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Gi:case Vi:t="ENVMAP_TYPE_CUBE";break;case So:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Qp(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Vi:t="ENVMAP_MODE_REFRACTION";break}return t}function tm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case tc:t="ENVMAP_BLENDING_MULTIPLY";break;case Uh:t="ENVMAP_BLENDING_MIX";break;case Fh:t="ENVMAP_BLENDING_ADD";break}return t}function em(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function nm(i,t,e,n){const s=i.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const l=Zp(e),c=Jp(e),h=Qp(e),f=tm(e),u=em(e),d=e.isWebGL2?"":Gp(e),g=Vp(e),v=Wp(o),m=s.createProgram();let p,_,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Ii).join(`
`),p.length>0&&(p+=`
`),_=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Ii).join(`
`),_.length>0&&(_+=`
`)):(p=[xl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ii).join(`
`),_=[d,xl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Xn?"#define TONE_MAPPING":"",e.toneMapping!==Xn?Vt.tonemapping_pars_fragment:"",e.toneMapping!==Xn?Hp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,Bp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ii).join(`
`)),r=ba(r),r=ml(r,e),r=gl(r,e),a=ba(a),a=ml(a,e),a=gl(a,e),r=vl(r),a=vl(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,_=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Ir?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ir?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const y=x+p+r,w=x+_+a,M=dl(s,s.VERTEX_SHADER,y),E=dl(s,s.FRAGMENT_SHADER,w);s.attachShader(m,M),s.attachShader(m,E),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function R(V){if(i.debug.checkShaderErrors){const X=s.getProgramInfoLog(m).trim(),T=s.getShaderInfoLog(M).trim(),P=s.getShaderInfoLog(E).trim();let G=!0,U=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,M,E);else{const k=pl(s,M,"vertex"),O=pl(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+X+`
`+k+`
`+O)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(T===""||P==="")&&(U=!1);U&&(V.diagnostics={runnable:G,programLog:X,vertexShader:{log:T,prefix:p},fragmentShader:{log:P,prefix:_}})}s.deleteShader(M),s.deleteShader(E),S=new ro(s,m),b=qp(s,m)}let S;this.getUniforms=function(){return S===void 0&&R(this),S};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=s.getProgramParameter(m,kp)),I},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=zp++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=M,this.fragmentShader=E,this}let im=0;class sm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new om(t),e.set(t,n)),n}}class om{constructor(t){this.id=im++,this.code=t,this.usedTimes=0}}function am(i,t,e,n,s,o,r){const a=new Na,l=new sm,c=[],h=s.isWebGL2,f=s.logarithmicDepthBuffer,u=s.vertexTextures;let d=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return S===0?"uv":`uv${S}`}function m(S,b,I,V,X){const T=V.fog,P=X.geometry,G=S.isMeshStandardMaterial?V.environment:null,U=(S.isMeshStandardMaterial?e:t).get(S.envMap||G),k=U&&U.mapping===So?U.image.height:null,O=g[S.type];S.precision!==null&&(d=s.getMaxPrecision(S.precision),d!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const C=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,B=C!==void 0?C.length:0;let Z=0;P.morphAttributes.position!==void 0&&(Z=1),P.morphAttributes.normal!==void 0&&(Z=2),P.morphAttributes.color!==void 0&&(Z=3);let N,j,$,J;if(O){const Oe=xn[O];N=Oe.vertexShader,j=Oe.fragmentShader}else N=S.vertexShader,j=S.fragmentShader,l.update(S),$=l.getVertexShaderID(S),J=l.getFragmentShaderID(S);const ct=i.getRenderTarget(),ht=X.isInstancedMesh===!0,W=X.isBatchedMesh===!0,q=!!S.map,it=!!S.matcap,F=!!U,pt=!!S.aoMap,at=!!S.lightMap,ft=!!S.bumpMap,ut=!!S.normalMap,Ot=!!S.displacementMap,Ct=!!S.emissiveMap,D=!!S.metalnessMap,A=!!S.roughnessMap,K=S.anisotropy>0,rt=S.clearcoat>0,st=S.iridescence>0,lt=S.sheen>0,wt=S.transmission>0,mt=K&&!!S.anisotropyMap,dt=rt&&!!S.clearcoatMap,Et=rt&&!!S.clearcoatNormalMap,Rt=rt&&!!S.clearcoatRoughnessMap,ot=st&&!!S.iridescenceMap,jt=st&&!!S.iridescenceThicknessMap,Ft=lt&&!!S.sheenColorMap,Dt=lt&&!!S.sheenRoughnessMap,Tt=!!S.specularMap,St=!!S.specularColorMap,Gt=!!S.specularIntensityMap,Jt=wt&&!!S.transmissionMap,de=wt&&!!S.thicknessMap,qt=!!S.gradientMap,gt=!!S.alphaMap,H=S.alphaTest>0,_t=!!S.alphaHash,Mt=!!S.extensions,kt=!!P.attributes.uv1,Lt=!!P.attributes.uv2,ie=!!P.attributes.uv3;let se=Xn;return S.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(se=i.toneMapping),{isWebGL2:h,shaderID:O,shaderType:S.type,shaderName:S.name,vertexShader:N,fragmentShader:j,defines:S.defines,customVertexShaderID:$,customFragmentShaderID:J,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:W,instancing:ht,instancingColor:ht&&X.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:kn,map:q,matcap:it,envMap:F,envMapMode:F&&U.mapping,envMapCubeUVHeight:k,aoMap:pt,lightMap:at,bumpMap:ft,normalMap:ut,displacementMap:u&&Ot,emissiveMap:Ct,normalMapObjectSpace:ut&&S.normalMapType===Jh,normalMapTangentSpace:ut&&S.normalMapType===Zh,metalnessMap:D,roughnessMap:A,anisotropy:K,anisotropyMap:mt,clearcoat:rt,clearcoatMap:dt,clearcoatNormalMap:Et,clearcoatRoughnessMap:Rt,iridescence:st,iridescenceMap:ot,iridescenceThicknessMap:jt,sheen:lt,sheenColorMap:Ft,sheenRoughnessMap:Dt,specularMap:Tt,specularColorMap:St,specularIntensityMap:Gt,transmission:wt,transmissionMap:Jt,thicknessMap:de,gradientMap:qt,opaque:S.transparent===!1&&S.blending===zi,alphaMap:gt,alphaTest:H,alphaHash:_t,combine:S.combine,mapUv:q&&v(S.map.channel),aoMapUv:pt&&v(S.aoMap.channel),lightMapUv:at&&v(S.lightMap.channel),bumpMapUv:ft&&v(S.bumpMap.channel),normalMapUv:ut&&v(S.normalMap.channel),displacementMapUv:Ot&&v(S.displacementMap.channel),emissiveMapUv:Ct&&v(S.emissiveMap.channel),metalnessMapUv:D&&v(S.metalnessMap.channel),roughnessMapUv:A&&v(S.roughnessMap.channel),anisotropyMapUv:mt&&v(S.anisotropyMap.channel),clearcoatMapUv:dt&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:Et&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Rt&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ot&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:jt&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ft&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&v(S.sheenRoughnessMap.channel),specularMapUv:Tt&&v(S.specularMap.channel),specularColorMapUv:St&&v(S.specularColorMap.channel),specularIntensityMapUv:Gt&&v(S.specularIntensityMap.channel),transmissionMapUv:Jt&&v(S.transmissionMap.channel),thicknessMapUv:de&&v(S.thicknessMap.channel),alphaMapUv:gt&&v(S.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(ut||K),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,vertexUv1s:kt,vertexUv2s:Lt,vertexUv3s:ie,pointsUvs:X.isPoints===!0&&!!P.attributes.uv&&(q||gt),fog:!!T,useFog:S.fog===!0,fogExp2:T&&T.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:X.isSkinnedMesh===!0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:Z,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:se,useLegacyLights:i._useLegacyLights,decodeVideoTexture:q&&S.map.isVideoTexture===!0&&Qt.getTransfer(S.map.colorSpace)===le,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===je,flipSided:S.side===Ve,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:Mt&&S.extensions.derivatives===!0,extensionFragDepth:Mt&&S.extensions.fragDepth===!0,extensionDrawBuffers:Mt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:Mt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Mt&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function p(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const I in S.defines)b.push(I),b.push(S.defines[I]);return S.isRawShaderMaterial===!1&&(_(b,S),x(b,S),b.push(i.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function _(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function x(S,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),S.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function y(S){const b=g[S.type];let I;if(b){const V=xn[b];I=Hu.clone(V.uniforms)}else I=S.uniforms;return I}function w(S,b){let I;for(let V=0,X=c.length;V<X;V++){const T=c[V];if(T.cacheKey===b){I=T,++I.usedTimes;break}}return I===void 0&&(I=new nm(i,b,S,o),c.push(I)),I}function M(S){if(--S.usedTimes===0){const b=c.indexOf(S);c[b]=c[c.length-1],c.pop(),S.destroy()}}function E(S){l.remove(S)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:w,releaseProgram:M,releaseShaderCache:E,programs:c,dispose:R}}function rm(){let i=new WeakMap;function t(o){let r=i.get(o);return r===void 0&&(r={},i.set(o,r)),r}function e(o){i.delete(o)}function n(o,r,a){i.get(o)[r]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function lm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function _l(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ml(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function r(f,u,d,g,v,m){let p=i[t];return p===void 0?(p={id:f.id,object:f,geometry:u,material:d,groupOrder:g,renderOrder:f.renderOrder,z:v,group:m},i[t]=p):(p.id=f.id,p.object=f,p.geometry=u,p.material=d,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=v,p.group=m),t++,p}function a(f,u,d,g,v,m){const p=r(f,u,d,g,v,m);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):e.push(p)}function l(f,u,d,g,v,m){const p=r(f,u,d,g,v,m);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):e.unshift(p)}function c(f,u){e.length>1&&e.sort(f||lm),n.length>1&&n.sort(u||_l),s.length>1&&s.sort(u||_l)}function h(){for(let f=t,u=i.length;f<u;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:a,unshift:l,finish:h,sort:c}}function cm(){let i=new WeakMap;function t(n,s){const o=i.get(n);let r;return o===void 0?(r=new Ml,i.set(n,[r])):s>=o.length?(r=new Ml,o.push(r)):r=o[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function hm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new Pt};break;case"SpotLight":e={position:new z,direction:new z,color:new Pt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new Pt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new Pt,groundColor:new Pt};break;case"RectAreaLight":e={color:new Pt,position:new z,halfWidth:new z,halfHeight:new z};break}return i[t.id]=e,e}}}function um(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new It,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let fm=0;function dm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function pm(i,t){const e=new hm,n=um(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new z);const o=new z,r=new Kt,a=new Kt;function l(h,f){let u=0,d=0,g=0;for(let V=0;V<9;V++)s.probe[V].set(0,0,0);let v=0,m=0,p=0,_=0,x=0,y=0,w=0,M=0,E=0,R=0,S=0;h.sort(dm);const b=f===!0?Math.PI:1;for(let V=0,X=h.length;V<X;V++){const T=h[V],P=T.color,G=T.intensity,U=T.distance,k=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)u+=P.r*G*b,d+=P.g*G*b,g+=P.b*G*b;else if(T.isLightProbe){for(let O=0;O<9;O++)s.probe[O].addScaledVector(T.sh.coefficients[O],G);S++}else if(T.isDirectionalLight){const O=e.get(T);if(O.color.copy(T.color).multiplyScalar(T.intensity*b),T.castShadow){const C=T.shadow,B=n.get(T);B.shadowBias=C.bias,B.shadowNormalBias=C.normalBias,B.shadowRadius=C.radius,B.shadowMapSize=C.mapSize,s.directionalShadow[v]=B,s.directionalShadowMap[v]=k,s.directionalShadowMatrix[v]=T.shadow.matrix,y++}s.directional[v]=O,v++}else if(T.isSpotLight){const O=e.get(T);O.position.setFromMatrixPosition(T.matrixWorld),O.color.copy(P).multiplyScalar(G*b),O.distance=U,O.coneCos=Math.cos(T.angle),O.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),O.decay=T.decay,s.spot[p]=O;const C=T.shadow;if(T.map&&(s.spotLightMap[E]=T.map,E++,C.updateMatrices(T),T.castShadow&&R++),s.spotLightMatrix[p]=C.matrix,T.castShadow){const B=n.get(T);B.shadowBias=C.bias,B.shadowNormalBias=C.normalBias,B.shadowRadius=C.radius,B.shadowMapSize=C.mapSize,s.spotShadow[p]=B,s.spotShadowMap[p]=k,M++}p++}else if(T.isRectAreaLight){const O=e.get(T);O.color.copy(P).multiplyScalar(G),O.halfWidth.set(T.width*.5,0,0),O.halfHeight.set(0,T.height*.5,0),s.rectArea[_]=O,_++}else if(T.isPointLight){const O=e.get(T);if(O.color.copy(T.color).multiplyScalar(T.intensity*b),O.distance=T.distance,O.decay=T.decay,T.castShadow){const C=T.shadow,B=n.get(T);B.shadowBias=C.bias,B.shadowNormalBias=C.normalBias,B.shadowRadius=C.radius,B.shadowMapSize=C.mapSize,B.shadowCameraNear=C.camera.near,B.shadowCameraFar=C.camera.far,s.pointShadow[m]=B,s.pointShadowMap[m]=k,s.pointShadowMatrix[m]=T.shadow.matrix,w++}s.point[m]=O,m++}else if(T.isHemisphereLight){const O=e.get(T);O.skyColor.copy(T.color).multiplyScalar(G*b),O.groundColor.copy(T.groundColor).multiplyScalar(G*b),s.hemi[x]=O,x++}}_>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=vt.LTC_FLOAT_1,s.rectAreaLTC2=vt.LTC_FLOAT_2):(s.rectAreaLTC1=vt.LTC_HALF_1,s.rectAreaLTC2=vt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=vt.LTC_FLOAT_1,s.rectAreaLTC2=vt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=vt.LTC_HALF_1,s.rectAreaLTC2=vt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=u,s.ambient[1]=d,s.ambient[2]=g;const I=s.hash;(I.directionalLength!==v||I.pointLength!==m||I.spotLength!==p||I.rectAreaLength!==_||I.hemiLength!==x||I.numDirectionalShadows!==y||I.numPointShadows!==w||I.numSpotShadows!==M||I.numSpotMaps!==E||I.numLightProbes!==S)&&(s.directional.length=v,s.spot.length=p,s.rectArea.length=_,s.point.length=m,s.hemi.length=x,s.directionalShadow.length=y,s.directionalShadowMap.length=y,s.pointShadow.length=w,s.pointShadowMap.length=w,s.spotShadow.length=M,s.spotShadowMap.length=M,s.directionalShadowMatrix.length=y,s.pointShadowMatrix.length=w,s.spotLightMatrix.length=M+E-R,s.spotLightMap.length=E,s.numSpotLightShadowsWithMaps=R,s.numLightProbes=S,I.directionalLength=v,I.pointLength=m,I.spotLength=p,I.rectAreaLength=_,I.hemiLength=x,I.numDirectionalShadows=y,I.numPointShadows=w,I.numSpotShadows=M,I.numSpotMaps=E,I.numLightProbes=S,s.version=fm++)}function c(h,f){let u=0,d=0,g=0,v=0,m=0;const p=f.matrixWorldInverse;for(let _=0,x=h.length;_<x;_++){const y=h[_];if(y.isDirectionalLight){const w=s.directional[u];w.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(o),w.direction.transformDirection(p),u++}else if(y.isSpotLight){const w=s.spot[g];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(o),w.direction.transformDirection(p),g++}else if(y.isRectAreaLight){const w=s.rectArea[v];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){const w=s.point[d];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){const w=s.hemi[m];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:s}}function yl(i,t){const e=new pm(i,t),n=[],s=[];function o(){n.length=0,s.length=0}function r(f){n.push(f)}function a(f){s.push(f)}function l(f){e.setup(n,f)}function c(f){e.setupView(n,f)}return{init:o,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:r,pushShadow:a}}function mm(i,t){let e=new WeakMap;function n(o,r=0){const a=e.get(o);let l;return a===void 0?(l=new yl(i,t),e.set(o,[l])):r>=a.length?(l=new yl(i,t),a.push(l)):l=a[r],l}function s(){e=new WeakMap}return{get:n,dispose:s}}class gm extends Ss{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$h,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class vm extends Ss{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const xm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_m=`uniform sampler2D shadow_pass;
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
}`;function Mm(i,t,e){let n=new Es;const s=new It,o=new It,r=new ge,a=new gm({depthPacking:Kh}),l=new vm,c={},h=e.maxTextureSize,f={[Fn]:Ve,[Ve]:Fn,[je]:je},u=new ve({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new It},radius:{value:4}},vertexShader:xm,fragmentShader:_m}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const g=new Re;g.setAttribute("position",new he(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new te(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ql;let p=this.type;this.render=function(M,E,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;const S=i.getRenderTarget(),b=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),V=i.state;V.setBlending(qn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const X=p!==Cn&&this.type===Cn,T=p===Cn&&this.type!==Cn;for(let P=0,G=M.length;P<G;P++){const U=M[P],k=U.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const O=k.getFrameExtents();if(s.multiply(O),o.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/O.x),s.x=o.x*O.x,k.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/O.y),s.y=o.y*O.y,k.mapSize.y=o.y)),k.map===null||X===!0||T===!0){const B=this.type!==Cn?{minFilter:ue,magFilter:ue}:{};k.map!==null&&k.map.dispose(),k.map=new sn(s.x,s.y,B),k.map.texture.name=U.name+".shadowMap",k.camera.updateProjectionMatrix()}i.setRenderTarget(k.map),i.clear();const C=k.getViewportCount();for(let B=0;B<C;B++){const Z=k.getViewport(B);r.set(o.x*Z.x,o.y*Z.y,o.x*Z.z,o.y*Z.w),V.viewport(r),k.updateMatrices(U,B),n=k.getFrustum(),y(E,R,k.camera,U,this.type)}k.isPointLightShadow!==!0&&this.type===Cn&&_(k,R),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(S,b,I)};function _(M,E){const R=t.update(v);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new sn(s.x,s.y)),u.uniforms.shadow_pass.value=M.map.texture,u.uniforms.resolution.value=M.mapSize,u.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(E,null,R,u,v,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(E,null,R,d,v,null)}function x(M,E,R,S){let b=null;const I=R.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(I!==void 0)b=I;else if(b=R.isPointLight===!0?l:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const V=b.uuid,X=E.uuid;let T=c[V];T===void 0&&(T={},c[V]=T);let P=T[X];P===void 0&&(P=b.clone(),T[X]=P,E.addEventListener("dispose",w)),b=P}if(b.visible=E.visible,b.wireframe=E.wireframe,S===Cn?b.side=E.shadowSide!==null?E.shadowSide:E.side:b.side=E.shadowSide!==null?E.shadowSide:f[E.side],b.alphaMap=E.alphaMap,b.alphaTest=E.alphaTest,b.map=E.map,b.clipShadows=E.clipShadows,b.clippingPlanes=E.clippingPlanes,b.clipIntersection=E.clipIntersection,b.displacementMap=E.displacementMap,b.displacementScale=E.displacementScale,b.displacementBias=E.displacementBias,b.wireframeLinewidth=E.wireframeLinewidth,b.linewidth=E.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const V=i.properties.get(b);V.light=R}return b}function y(M,E,R,S,b){if(M.visible===!1)return;if(M.layers.test(E.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&b===Cn)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,M.matrixWorld);const X=t.update(M),T=M.material;if(Array.isArray(T)){const P=X.groups;for(let G=0,U=P.length;G<U;G++){const k=P[G],O=T[k.materialIndex];if(O&&O.visible){const C=x(M,O,S,b);M.onBeforeShadow(i,M,E,R,X,C,k),i.renderBufferDirect(R,null,X,C,M,k),M.onAfterShadow(i,M,E,R,X,C,k)}}}else if(T.visible){const P=x(M,T,S,b);M.onBeforeShadow(i,M,E,R,X,P,null),i.renderBufferDirect(R,null,X,P,M,null),M.onAfterShadow(i,M,E,R,X,P,null)}}const V=M.children;for(let X=0,T=V.length;X<T;X++)y(V[X],E,R,S,b)}function w(M){M.target.removeEventListener("dispose",w);for(const R in c){const S=c[R],b=M.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}function ym(i,t,e){const n=e.isWebGL2;function s(){let H=!1;const _t=new ge;let Mt=null;const kt=new ge(0,0,0,0);return{setMask:function(Lt){Mt!==Lt&&!H&&(i.colorMask(Lt,Lt,Lt,Lt),Mt=Lt)},setLocked:function(Lt){H=Lt},setClear:function(Lt,ie,se,be,Oe){Oe===!0&&(Lt*=be,ie*=be,se*=be),_t.set(Lt,ie,se,be),kt.equals(_t)===!1&&(i.clearColor(Lt,ie,se,be),kt.copy(_t))},reset:function(){H=!1,Mt=null,kt.set(-1,0,0,0)}}}function o(){let H=!1,_t=null,Mt=null,kt=null;return{setTest:function(Lt){Lt?W(i.DEPTH_TEST):q(i.DEPTH_TEST)},setMask:function(Lt){_t!==Lt&&!H&&(i.depthMask(Lt),_t=Lt)},setFunc:function(Lt){if(Mt!==Lt){switch(Lt){case Th:i.depthFunc(i.NEVER);break;case Ah:i.depthFunc(i.ALWAYS);break;case Ch:i.depthFunc(i.LESS);break;case fo:i.depthFunc(i.LEQUAL);break;case Rh:i.depthFunc(i.EQUAL);break;case Ph:i.depthFunc(i.GEQUAL);break;case Lh:i.depthFunc(i.GREATER);break;case Dh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Mt=Lt}},setLocked:function(Lt){H=Lt},setClear:function(Lt){kt!==Lt&&(i.clearDepth(Lt),kt=Lt)},reset:function(){H=!1,_t=null,Mt=null,kt=null}}}function r(){let H=!1,_t=null,Mt=null,kt=null,Lt=null,ie=null,se=null,be=null,Oe=null;return{setTest:function(oe){H||(oe?W(i.STENCIL_TEST):q(i.STENCIL_TEST))},setMask:function(oe){_t!==oe&&!H&&(i.stencilMask(oe),_t=oe)},setFunc:function(oe,Be,mn){(Mt!==oe||kt!==Be||Lt!==mn)&&(i.stencilFunc(oe,Be,mn),Mt=oe,kt=Be,Lt=mn)},setOp:function(oe,Be,mn){(ie!==oe||se!==Be||be!==mn)&&(i.stencilOp(oe,Be,mn),ie=oe,se=Be,be=mn)},setLocked:function(oe){H=oe},setClear:function(oe){Oe!==oe&&(i.clearStencil(oe),Oe=oe)},reset:function(){H=!1,_t=null,Mt=null,kt=null,Lt=null,ie=null,se=null,be=null,Oe=null}}}const a=new s,l=new o,c=new r,h=new WeakMap,f=new WeakMap;let u={},d={},g=new WeakMap,v=[],m=null,p=!1,_=null,x=null,y=null,w=null,M=null,E=null,R=null,S=new Pt(0,0,0),b=0,I=!1,V=null,X=null,T=null,P=null,G=null;const U=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,O=0;const C=i.getParameter(i.VERSION);C.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(C)[1]),k=O>=1):C.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(C)[1]),k=O>=2);let B=null,Z={};const N=i.getParameter(i.SCISSOR_BOX),j=i.getParameter(i.VIEWPORT),$=new ge().fromArray(N),J=new ge().fromArray(j);function ct(H,_t,Mt,kt){const Lt=new Uint8Array(4),ie=i.createTexture();i.bindTexture(H,ie),i.texParameteri(H,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(H,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let se=0;se<Mt;se++)n&&(H===i.TEXTURE_3D||H===i.TEXTURE_2D_ARRAY)?i.texImage3D(_t,0,i.RGBA,1,1,kt,0,i.RGBA,i.UNSIGNED_BYTE,Lt):i.texImage2D(_t+se,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Lt);return ie}const ht={};ht[i.TEXTURE_2D]=ct(i.TEXTURE_2D,i.TEXTURE_2D,1),ht[i.TEXTURE_CUBE_MAP]=ct(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(ht[i.TEXTURE_2D_ARRAY]=ct(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ht[i.TEXTURE_3D]=ct(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),W(i.DEPTH_TEST),l.setFunc(fo),Ct(!1),D(nr),W(i.CULL_FACE),ut(qn);function W(H){u[H]!==!0&&(i.enable(H),u[H]=!0)}function q(H){u[H]!==!1&&(i.disable(H),u[H]=!1)}function it(H,_t){return d[H]!==_t?(i.bindFramebuffer(H,_t),d[H]=_t,n&&(H===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=_t),H===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=_t)),!0):!1}function F(H,_t){let Mt=v,kt=!1;if(H)if(Mt=g.get(_t),Mt===void 0&&(Mt=[],g.set(_t,Mt)),H.isWebGLMultipleRenderTargets){const Lt=H.texture;if(Mt.length!==Lt.length||Mt[0]!==i.COLOR_ATTACHMENT0){for(let ie=0,se=Lt.length;ie<se;ie++)Mt[ie]=i.COLOR_ATTACHMENT0+ie;Mt.length=Lt.length,kt=!0}}else Mt[0]!==i.COLOR_ATTACHMENT0&&(Mt[0]=i.COLOR_ATTACHMENT0,kt=!0);else Mt[0]!==i.BACK&&(Mt[0]=i.BACK,kt=!0);kt&&(e.isWebGL2?i.drawBuffers(Mt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Mt))}function pt(H){return m!==H?(i.useProgram(H),m=H,!0):!1}const at={[oi]:i.FUNC_ADD,[uh]:i.FUNC_SUBTRACT,[fh]:i.FUNC_REVERSE_SUBTRACT};if(n)at[or]=i.MIN,at[ar]=i.MAX;else{const H=t.get("EXT_blend_minmax");H!==null&&(at[or]=H.MIN_EXT,at[ar]=H.MAX_EXT)}const ft={[dh]:i.ZERO,[ph]:i.ONE,[mh]:i.SRC_COLOR,[ga]:i.SRC_ALPHA,[yh]:i.SRC_ALPHA_SATURATE,[_h]:i.DST_COLOR,[vh]:i.DST_ALPHA,[gh]:i.ONE_MINUS_SRC_COLOR,[va]:i.ONE_MINUS_SRC_ALPHA,[Mh]:i.ONE_MINUS_DST_COLOR,[xh]:i.ONE_MINUS_DST_ALPHA,[wh]:i.CONSTANT_COLOR,[Sh]:i.ONE_MINUS_CONSTANT_COLOR,[bh]:i.CONSTANT_ALPHA,[Eh]:i.ONE_MINUS_CONSTANT_ALPHA};function ut(H,_t,Mt,kt,Lt,ie,se,be,Oe,oe){if(H===qn){p===!0&&(q(i.BLEND),p=!1);return}if(p===!1&&(W(i.BLEND),p=!0),H!==hh){if(H!==_||oe!==I){if((x!==oi||M!==oi)&&(i.blendEquation(i.FUNC_ADD),x=oi,M=oi),oe)switch(H){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ma:i.blendFunc(i.ONE,i.ONE);break;case ir:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case sr:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ma:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ir:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case sr:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}y=null,w=null,E=null,R=null,S.set(0,0,0),b=0,_=H,I=oe}return}Lt=Lt||_t,ie=ie||Mt,se=se||kt,(_t!==x||Lt!==M)&&(i.blendEquationSeparate(at[_t],at[Lt]),x=_t,M=Lt),(Mt!==y||kt!==w||ie!==E||se!==R)&&(i.blendFuncSeparate(ft[Mt],ft[kt],ft[ie],ft[se]),y=Mt,w=kt,E=ie,R=se),(be.equals(S)===!1||Oe!==b)&&(i.blendColor(be.r,be.g,be.b,Oe),S.copy(be),b=Oe),_=H,I=!1}function Ot(H,_t){H.side===je?q(i.CULL_FACE):W(i.CULL_FACE);let Mt=H.side===Ve;_t&&(Mt=!Mt),Ct(Mt),H.blending===zi&&H.transparent===!1?ut(qn):ut(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),l.setFunc(H.depthFunc),l.setTest(H.depthTest),l.setMask(H.depthWrite),a.setMask(H.colorWrite);const kt=H.stencilWrite;c.setTest(kt),kt&&(c.setMask(H.stencilWriteMask),c.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),c.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),K(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?W(i.SAMPLE_ALPHA_TO_COVERAGE):q(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(H){V!==H&&(H?i.frontFace(i.CW):i.frontFace(i.CCW),V=H)}function D(H){H!==rh?(W(i.CULL_FACE),H!==X&&(H===nr?i.cullFace(i.BACK):H===lh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):q(i.CULL_FACE),X=H}function A(H){H!==T&&(k&&i.lineWidth(H),T=H)}function K(H,_t,Mt){H?(W(i.POLYGON_OFFSET_FILL),(P!==_t||G!==Mt)&&(i.polygonOffset(_t,Mt),P=_t,G=Mt)):q(i.POLYGON_OFFSET_FILL)}function rt(H){H?W(i.SCISSOR_TEST):q(i.SCISSOR_TEST)}function st(H){H===void 0&&(H=i.TEXTURE0+U-1),B!==H&&(i.activeTexture(H),B=H)}function lt(H,_t,Mt){Mt===void 0&&(B===null?Mt=i.TEXTURE0+U-1:Mt=B);let kt=Z[Mt];kt===void 0&&(kt={type:void 0,texture:void 0},Z[Mt]=kt),(kt.type!==H||kt.texture!==_t)&&(B!==Mt&&(i.activeTexture(Mt),B=Mt),i.bindTexture(H,_t||ht[H]),kt.type=H,kt.texture=_t)}function wt(){const H=Z[B];H!==void 0&&H.type!==void 0&&(i.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function mt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function dt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Et(){try{i.texSubImage2D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Rt(){try{i.texSubImage3D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ot(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function jt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ft(){try{i.texStorage2D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Dt(){try{i.texStorage3D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Tt(){try{i.texImage2D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function St(){try{i.texImage3D.apply(i,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Gt(H){$.equals(H)===!1&&(i.scissor(H.x,H.y,H.z,H.w),$.copy(H))}function Jt(H){J.equals(H)===!1&&(i.viewport(H.x,H.y,H.z,H.w),J.copy(H))}function de(H,_t){let Mt=f.get(_t);Mt===void 0&&(Mt=new WeakMap,f.set(_t,Mt));let kt=Mt.get(H);kt===void 0&&(kt=i.getUniformBlockIndex(_t,H.name),Mt.set(H,kt))}function qt(H,_t){const kt=f.get(_t).get(H);h.get(_t)!==kt&&(i.uniformBlockBinding(_t,kt,H.__bindingPointIndex),h.set(_t,kt))}function gt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},B=null,Z={},d={},g=new WeakMap,v=[],m=null,p=!1,_=null,x=null,y=null,w=null,M=null,E=null,R=null,S=new Pt(0,0,0),b=0,I=!1,V=null,X=null,T=null,P=null,G=null,$.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:W,disable:q,bindFramebuffer:it,drawBuffers:F,useProgram:pt,setBlending:ut,setMaterial:Ot,setFlipSided:Ct,setCullFace:D,setLineWidth:A,setPolygonOffset:K,setScissorTest:rt,activeTexture:st,bindTexture:lt,unbindTexture:wt,compressedTexImage2D:mt,compressedTexImage3D:dt,texImage2D:Tt,texImage3D:St,updateUBOMapping:de,uniformBlockBinding:qt,texStorage2D:Ft,texStorage3D:Dt,texSubImage2D:Et,texSubImage3D:Rt,compressedTexSubImage2D:ot,compressedTexSubImage3D:jt,scissor:Gt,viewport:Jt,reset:gt}}function wm(i,t,e,n,s,o,r){const a=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let f;const u=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,A){return d?new OffscreenCanvas(D,A):_o("canvas")}function v(D,A,K,rt){let st=1;if((D.width>rt||D.height>rt)&&(st=rt/Math.max(D.width,D.height)),st<1||A===!0)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap){const lt=A?xo:Math.floor,wt=lt(st*D.width),mt=lt(st*D.height);f===void 0&&(f=g(wt,mt));const dt=K?g(wt,mt):f;return dt.width=wt,dt.height=mt,dt.getContext("2d").drawImage(D,0,0,wt,mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+D.width+"x"+D.height+") to ("+wt+"x"+mt+")."),dt}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+D.width+"x"+D.height+")."),D;return D}function m(D){return wa(D.width)&&wa(D.height)}function p(D){return a?!1:D.wrapS!==$e||D.wrapT!==$e||D.minFilter!==ue&&D.minFilter!==ne}function _(D,A){return D.generateMipmaps&&A&&D.minFilter!==ue&&D.minFilter!==ne}function x(D){i.generateMipmap(D)}function y(D,A,K,rt,st=!1){if(a===!1)return A;if(D!==null){if(i[D]!==void 0)return i[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let lt=A;if(A===i.RED&&(K===i.FLOAT&&(lt=i.R32F),K===i.HALF_FLOAT&&(lt=i.R16F),K===i.UNSIGNED_BYTE&&(lt=i.R8)),A===i.RED_INTEGER&&(K===i.UNSIGNED_BYTE&&(lt=i.R8UI),K===i.UNSIGNED_SHORT&&(lt=i.R16UI),K===i.UNSIGNED_INT&&(lt=i.R32UI),K===i.BYTE&&(lt=i.R8I),K===i.SHORT&&(lt=i.R16I),K===i.INT&&(lt=i.R32I)),A===i.RG&&(K===i.FLOAT&&(lt=i.RG32F),K===i.HALF_FLOAT&&(lt=i.RG16F),K===i.UNSIGNED_BYTE&&(lt=i.RG8)),A===i.RGBA){const wt=st?po:Qt.getTransfer(rt);K===i.FLOAT&&(lt=i.RGBA32F),K===i.HALF_FLOAT&&(lt=i.RGBA16F),K===i.UNSIGNED_BYTE&&(lt=wt===le?i.SRGB8_ALPHA8:i.RGBA8),K===i.UNSIGNED_SHORT_4_4_4_4&&(lt=i.RGBA4),K===i.UNSIGNED_SHORT_5_5_5_1&&(lt=i.RGB5_A1)}return(lt===i.R16F||lt===i.R32F||lt===i.RG16F||lt===i.RG32F||lt===i.RGBA16F||lt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),lt}function w(D,A,K){return _(D,K)===!0||D.isFramebufferTexture&&D.minFilter!==ue&&D.minFilter!==ne?Math.log2(Math.max(A.width,A.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?A.mipmaps.length:1}function M(D){return D===ue||D===rr||D===Do?i.NEAREST:i.LINEAR}function E(D){const A=D.target;A.removeEventListener("dispose",E),S(A),A.isVideoTexture&&h.delete(A)}function R(D){const A=D.target;A.removeEventListener("dispose",R),I(A)}function S(D){const A=n.get(D);if(A.__webglInit===void 0)return;const K=D.source,rt=u.get(K);if(rt){const st=rt[A.__cacheKey];st.usedTimes--,st.usedTimes===0&&b(D),Object.keys(rt).length===0&&u.delete(K)}n.remove(D)}function b(D){const A=n.get(D);i.deleteTexture(A.__webglTexture);const K=D.source,rt=u.get(K);delete rt[A.__cacheKey],r.memory.textures--}function I(D){const A=D.texture,K=n.get(D),rt=n.get(A);if(rt.__webglTexture!==void 0&&(i.deleteTexture(rt.__webglTexture),r.memory.textures--),D.depthTexture&&D.depthTexture.dispose(),D.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(K.__webglFramebuffer[st]))for(let lt=0;lt<K.__webglFramebuffer[st].length;lt++)i.deleteFramebuffer(K.__webglFramebuffer[st][lt]);else i.deleteFramebuffer(K.__webglFramebuffer[st]);K.__webglDepthbuffer&&i.deleteRenderbuffer(K.__webglDepthbuffer[st])}else{if(Array.isArray(K.__webglFramebuffer))for(let st=0;st<K.__webglFramebuffer.length;st++)i.deleteFramebuffer(K.__webglFramebuffer[st]);else i.deleteFramebuffer(K.__webglFramebuffer);if(K.__webglDepthbuffer&&i.deleteRenderbuffer(K.__webglDepthbuffer),K.__webglMultisampledFramebuffer&&i.deleteFramebuffer(K.__webglMultisampledFramebuffer),K.__webglColorRenderbuffer)for(let st=0;st<K.__webglColorRenderbuffer.length;st++)K.__webglColorRenderbuffer[st]&&i.deleteRenderbuffer(K.__webglColorRenderbuffer[st]);K.__webglDepthRenderbuffer&&i.deleteRenderbuffer(K.__webglDepthRenderbuffer)}if(D.isWebGLMultipleRenderTargets)for(let st=0,lt=A.length;st<lt;st++){const wt=n.get(A[st]);wt.__webglTexture&&(i.deleteTexture(wt.__webglTexture),r.memory.textures--),n.remove(A[st])}n.remove(A),n.remove(D)}let V=0;function X(){V=0}function T(){const D=V;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),V+=1,D}function P(D){const A=[];return A.push(D.wrapS),A.push(D.wrapT),A.push(D.wrapR||0),A.push(D.magFilter),A.push(D.minFilter),A.push(D.anisotropy),A.push(D.internalFormat),A.push(D.format),A.push(D.type),A.push(D.generateMipmaps),A.push(D.premultiplyAlpha),A.push(D.flipY),A.push(D.unpackAlignment),A.push(D.colorSpace),A.join()}function G(D,A){const K=n.get(D);if(D.isVideoTexture&&Ot(D),D.isRenderTargetTexture===!1&&D.version>0&&K.__version!==D.version){const rt=D.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(K,D,A);return}}e.bindTexture(i.TEXTURE_2D,K.__webglTexture,i.TEXTURE0+A)}function U(D,A){const K=n.get(D);if(D.version>0&&K.__version!==D.version){$(K,D,A);return}e.bindTexture(i.TEXTURE_2D_ARRAY,K.__webglTexture,i.TEXTURE0+A)}function k(D,A){const K=n.get(D);if(D.version>0&&K.__version!==D.version){$(K,D,A);return}e.bindTexture(i.TEXTURE_3D,K.__webglTexture,i.TEXTURE0+A)}function O(D,A){const K=n.get(D);if(D.version>0&&K.__version!==D.version){J(K,D,A);return}e.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture,i.TEXTURE0+A)}const C={[hi]:i.REPEAT,[$e]:i.CLAMP_TO_EDGE,[Ma]:i.MIRRORED_REPEAT},B={[ue]:i.NEAREST,[rr]:i.NEAREST_MIPMAP_NEAREST,[Do]:i.NEAREST_MIPMAP_LINEAR,[ne]:i.LINEAR,[Hh]:i.LINEAR_MIPMAP_NEAREST,[ui]:i.LINEAR_MIPMAP_LINEAR},Z={[Qh]:i.NEVER,[ou]:i.ALWAYS,[tu]:i.LESS,[hc]:i.LEQUAL,[eu]:i.EQUAL,[su]:i.GEQUAL,[nu]:i.GREATER,[iu]:i.NOTEQUAL};function N(D,A,K){if(K?(i.texParameteri(D,i.TEXTURE_WRAP_S,C[A.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,C[A.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,C[A.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,B[A.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,B[A.minFilter])):(i.texParameteri(D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(A.wrapS!==$e||A.wrapT!==$e)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(D,i.TEXTURE_MAG_FILTER,M(A.magFilter)),i.texParameteri(D,i.TEXTURE_MIN_FILTER,M(A.minFilter)),A.minFilter!==ue&&A.minFilter!==ne&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),A.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Z[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const rt=t.get("EXT_texture_filter_anisotropic");if(A.magFilter===ue||A.minFilter!==Do&&A.minFilter!==ui||A.type===pn&&t.has("OES_texture_float_linear")===!1||a===!1&&A.type===In&&t.has("OES_texture_half_float_linear")===!1)return;(A.anisotropy>1||n.get(A).__currentAnisotropy)&&(i.texParameterf(D,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy)}}function j(D,A){let K=!1;D.__webglInit===void 0&&(D.__webglInit=!0,A.addEventListener("dispose",E));const rt=A.source;let st=u.get(rt);st===void 0&&(st={},u.set(rt,st));const lt=P(A);if(lt!==D.__cacheKey){st[lt]===void 0&&(st[lt]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,K=!0),st[lt].usedTimes++;const wt=st[D.__cacheKey];wt!==void 0&&(st[D.__cacheKey].usedTimes--,wt.usedTimes===0&&b(A)),D.__cacheKey=lt,D.__webglTexture=st[lt].texture}return K}function $(D,A,K){let rt=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(rt=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(rt=i.TEXTURE_3D);const st=j(D,A),lt=A.source;e.bindTexture(rt,D.__webglTexture,i.TEXTURE0+K);const wt=n.get(lt);if(lt.version!==wt.__version||st===!0){e.activeTexture(i.TEXTURE0+K);const mt=Qt.getPrimaries(Qt.workingColorSpace),dt=A.colorSpace===rn?null:Qt.getPrimaries(A.colorSpace),Et=A.colorSpace===rn||mt===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);const Rt=p(A)&&m(A.image)===!1;let ot=v(A.image,Rt,!1,s.maxTextureSize);ot=Ct(A,ot);const jt=m(ot)||a,Ft=o.convert(A.format,A.colorSpace);let Dt=o.convert(A.type),Tt=y(A.internalFormat,Ft,Dt,A.colorSpace,A.isVideoTexture);N(rt,A,jt);let St;const Gt=A.mipmaps,Jt=a&&A.isVideoTexture!==!0&&Tt!==lc,de=wt.__version===void 0||st===!0,qt=w(A,ot,jt);if(A.isDepthTexture)Tt=i.DEPTH_COMPONENT,a?A.type===pn?Tt=i.DEPTH_COMPONENT32F:A.type===Ln?Tt=i.DEPTH_COMPONENT24:A.type===ri?Tt=i.DEPTH24_STENCIL8:Tt=i.DEPTH_COMPONENT16:A.type===pn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),A.format===li&&Tt===i.DEPTH_COMPONENT&&A.type!==Fa&&A.type!==Ln&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),A.type=Ln,Dt=o.convert(A.type)),A.format===Wi&&Tt===i.DEPTH_COMPONENT&&(Tt=i.DEPTH_STENCIL,A.type!==ri&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),A.type=ri,Dt=o.convert(A.type))),de&&(Jt?e.texStorage2D(i.TEXTURE_2D,1,Tt,ot.width,ot.height):e.texImage2D(i.TEXTURE_2D,0,Tt,ot.width,ot.height,0,Ft,Dt,null));else if(A.isDataTexture)if(Gt.length>0&&jt){Jt&&de&&e.texStorage2D(i.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let gt=0,H=Gt.length;gt<H;gt++)St=Gt[gt],Jt?e.texSubImage2D(i.TEXTURE_2D,gt,0,0,St.width,St.height,Ft,Dt,St.data):e.texImage2D(i.TEXTURE_2D,gt,Tt,St.width,St.height,0,Ft,Dt,St.data);A.generateMipmaps=!1}else Jt?(de&&e.texStorage2D(i.TEXTURE_2D,qt,Tt,ot.width,ot.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,ot.width,ot.height,Ft,Dt,ot.data)):e.texImage2D(i.TEXTURE_2D,0,Tt,ot.width,ot.height,0,Ft,Dt,ot.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Jt&&de&&e.texStorage3D(i.TEXTURE_2D_ARRAY,qt,Tt,Gt[0].width,Gt[0].height,ot.depth);for(let gt=0,H=Gt.length;gt<H;gt++)St=Gt[gt],A.format!==ke?Ft!==null?Jt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,St.width,St.height,ot.depth,Ft,St.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,gt,Tt,St.width,St.height,ot.depth,0,St.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,gt,0,0,0,St.width,St.height,ot.depth,Ft,Dt,St.data):e.texImage3D(i.TEXTURE_2D_ARRAY,gt,Tt,St.width,St.height,ot.depth,0,Ft,Dt,St.data)}else{Jt&&de&&e.texStorage2D(i.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let gt=0,H=Gt.length;gt<H;gt++)St=Gt[gt],A.format!==ke?Ft!==null?Jt?e.compressedTexSubImage2D(i.TEXTURE_2D,gt,0,0,St.width,St.height,Ft,St.data):e.compressedTexImage2D(i.TEXTURE_2D,gt,Tt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage2D(i.TEXTURE_2D,gt,0,0,St.width,St.height,Ft,Dt,St.data):e.texImage2D(i.TEXTURE_2D,gt,Tt,St.width,St.height,0,Ft,Dt,St.data)}else if(A.isDataArrayTexture)Jt?(de&&e.texStorage3D(i.TEXTURE_2D_ARRAY,qt,Tt,ot.width,ot.height,ot.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,Ft,Dt,ot.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,ot.width,ot.height,ot.depth,0,Ft,Dt,ot.data);else if(A.isData3DTexture)Jt?(de&&e.texStorage3D(i.TEXTURE_3D,qt,Tt,ot.width,ot.height,ot.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,Ft,Dt,ot.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,ot.width,ot.height,ot.depth,0,Ft,Dt,ot.data);else if(A.isFramebufferTexture){if(de)if(Jt)e.texStorage2D(i.TEXTURE_2D,qt,Tt,ot.width,ot.height);else{let gt=ot.width,H=ot.height;for(let _t=0;_t<qt;_t++)e.texImage2D(i.TEXTURE_2D,_t,Tt,gt,H,0,Ft,Dt,null),gt>>=1,H>>=1}}else if(Gt.length>0&&jt){Jt&&de&&e.texStorage2D(i.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let gt=0,H=Gt.length;gt<H;gt++)St=Gt[gt],Jt?e.texSubImage2D(i.TEXTURE_2D,gt,0,0,Ft,Dt,St):e.texImage2D(i.TEXTURE_2D,gt,Tt,Ft,Dt,St);A.generateMipmaps=!1}else Jt?(de&&e.texStorage2D(i.TEXTURE_2D,qt,Tt,ot.width,ot.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Ft,Dt,ot)):e.texImage2D(i.TEXTURE_2D,0,Tt,Ft,Dt,ot);_(A,jt)&&x(rt),wt.__version=lt.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function J(D,A,K){if(A.image.length!==6)return;const rt=j(D,A),st=A.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+K);const lt=n.get(st);if(st.version!==lt.__version||rt===!0){e.activeTexture(i.TEXTURE0+K);const wt=Qt.getPrimaries(Qt.workingColorSpace),mt=A.colorSpace===rn?null:Qt.getPrimaries(A.colorSpace),dt=A.colorSpace===rn||wt===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Et=A.isCompressedTexture||A.image[0].isCompressedTexture,Rt=A.image[0]&&A.image[0].isDataTexture,ot=[];for(let gt=0;gt<6;gt++)!Et&&!Rt?ot[gt]=v(A.image[gt],!1,!0,s.maxCubemapSize):ot[gt]=Rt?A.image[gt].image:A.image[gt],ot[gt]=Ct(A,ot[gt]);const jt=ot[0],Ft=m(jt)||a,Dt=o.convert(A.format,A.colorSpace),Tt=o.convert(A.type),St=y(A.internalFormat,Dt,Tt,A.colorSpace),Gt=a&&A.isVideoTexture!==!0,Jt=lt.__version===void 0||rt===!0;let de=w(A,jt,Ft);N(i.TEXTURE_CUBE_MAP,A,Ft);let qt;if(Et){Gt&&Jt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,de,St,jt.width,jt.height);for(let gt=0;gt<6;gt++){qt=ot[gt].mipmaps;for(let H=0;H<qt.length;H++){const _t=qt[H];A.format!==ke?Dt!==null?Gt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H,0,0,_t.width,_t.height,Dt,_t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H,St,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H,0,0,_t.width,_t.height,Dt,Tt,_t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H,St,_t.width,_t.height,0,Dt,Tt,_t.data)}}}else{qt=A.mipmaps,Gt&&Jt&&(qt.length>0&&de++,e.texStorage2D(i.TEXTURE_CUBE_MAP,de,St,ot[0].width,ot[0].height));for(let gt=0;gt<6;gt++)if(Rt){Gt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,ot[gt].width,ot[gt].height,Dt,Tt,ot[gt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,St,ot[gt].width,ot[gt].height,0,Dt,Tt,ot[gt].data);for(let H=0;H<qt.length;H++){const Mt=qt[H].image[gt].image;Gt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H+1,0,0,Mt.width,Mt.height,Dt,Tt,Mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H+1,St,Mt.width,Mt.height,0,Dt,Tt,Mt.data)}}else{Gt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,Dt,Tt,ot[gt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,St,Dt,Tt,ot[gt]);for(let H=0;H<qt.length;H++){const _t=qt[H];Gt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H+1,0,0,Dt,Tt,_t.image[gt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,H+1,St,Dt,Tt,_t.image[gt])}}}_(A,Ft)&&x(i.TEXTURE_CUBE_MAP),lt.__version=st.version,A.onUpdate&&A.onUpdate(A)}D.__version=A.version}function ct(D,A,K,rt,st,lt){const wt=o.convert(K.format,K.colorSpace),mt=o.convert(K.type),dt=y(K.internalFormat,wt,mt,K.colorSpace);if(!n.get(A).__hasExternalTextures){const Rt=Math.max(1,A.width>>lt),ot=Math.max(1,A.height>>lt);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,lt,dt,Rt,ot,A.depth,0,wt,mt,null):e.texImage2D(st,lt,dt,Rt,ot,0,wt,mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),ut(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,rt,st,n.get(K).__webglTexture,0,ft(A)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,rt,st,n.get(K).__webglTexture,lt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ht(D,A,K){if(i.bindRenderbuffer(i.RENDERBUFFER,D),A.depthBuffer&&!A.stencilBuffer){let rt=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(K||ut(A)){const st=A.depthTexture;st&&st.isDepthTexture&&(st.type===pn?rt=i.DEPTH_COMPONENT32F:st.type===Ln&&(rt=i.DEPTH_COMPONENT24));const lt=ft(A);ut(A)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,rt,A.width,A.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,rt,A.width,A.height)}else i.renderbufferStorage(i.RENDERBUFFER,rt,A.width,A.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,D)}else if(A.depthBuffer&&A.stencilBuffer){const rt=ft(A);K&&ut(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,A.width,A.height):ut(A)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,D)}else{const rt=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let st=0;st<rt.length;st++){const lt=rt[st],wt=o.convert(lt.format,lt.colorSpace),mt=o.convert(lt.type),dt=y(lt.internalFormat,wt,mt,lt.colorSpace),Et=ft(A);K&&ut(A)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,dt,A.width,A.height):ut(A)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Et,dt,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,dt,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function W(D,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),G(A.depthTexture,0);const rt=n.get(A.depthTexture).__webglTexture,st=ft(A);if(A.depthTexture.format===li)ut(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0,st):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0);else if(A.depthTexture.format===Wi)ut(A)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0,st):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function q(D){const A=n.get(D),K=D.isWebGLCubeRenderTarget===!0;if(D.depthTexture&&!A.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");W(A.__webglFramebuffer,D)}else if(K){A.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[rt]),A.__webglDepthbuffer[rt]=i.createRenderbuffer(),ht(A.__webglDepthbuffer[rt],D,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=i.createRenderbuffer(),ht(A.__webglDepthbuffer,D,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function it(D,A,K){const rt=n.get(D);A!==void 0&&ct(rt.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),K!==void 0&&q(D)}function F(D){const A=D.texture,K=n.get(D),rt=n.get(A);D.addEventListener("dispose",R),D.isWebGLMultipleRenderTargets!==!0&&(rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture()),rt.__version=A.version,r.memory.textures++);const st=D.isWebGLCubeRenderTarget===!0,lt=D.isWebGLMultipleRenderTargets===!0,wt=m(D)||a;if(st){K.__webglFramebuffer=[];for(let mt=0;mt<6;mt++)if(a&&A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer[mt]=[];for(let dt=0;dt<A.mipmaps.length;dt++)K.__webglFramebuffer[mt][dt]=i.createFramebuffer()}else K.__webglFramebuffer[mt]=i.createFramebuffer()}else{if(a&&A.mipmaps&&A.mipmaps.length>0){K.__webglFramebuffer=[];for(let mt=0;mt<A.mipmaps.length;mt++)K.__webglFramebuffer[mt]=i.createFramebuffer()}else K.__webglFramebuffer=i.createFramebuffer();if(lt)if(s.drawBuffers){const mt=D.texture;for(let dt=0,Et=mt.length;dt<Et;dt++){const Rt=n.get(mt[dt]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=i.createTexture(),r.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&D.samples>0&&ut(D)===!1){const mt=lt?A:[A];K.__webglMultisampledFramebuffer=i.createFramebuffer(),K.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let dt=0;dt<mt.length;dt++){const Et=mt[dt];K.__webglColorRenderbuffer[dt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,K.__webglColorRenderbuffer[dt]);const Rt=o.convert(Et.format,Et.colorSpace),ot=o.convert(Et.type),jt=y(Et.internalFormat,Rt,ot,Et.colorSpace,D.isXRRenderTarget===!0),Ft=ft(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,jt,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,K.__webglColorRenderbuffer[dt])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(K.__webglDepthRenderbuffer=i.createRenderbuffer(),ht(K.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(st){e.bindTexture(i.TEXTURE_CUBE_MAP,rt.__webglTexture),N(i.TEXTURE_CUBE_MAP,A,wt);for(let mt=0;mt<6;mt++)if(a&&A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)ct(K.__webglFramebuffer[mt][dt],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,dt);else ct(K.__webglFramebuffer[mt],D,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0);_(A,wt)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(lt){const mt=D.texture;for(let dt=0,Et=mt.length;dt<Et;dt++){const Rt=mt[dt],ot=n.get(Rt);e.bindTexture(i.TEXTURE_2D,ot.__webglTexture),N(i.TEXTURE_2D,Rt,wt),ct(K.__webglFramebuffer,D,Rt,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,0),_(Rt,wt)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let mt=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(a?mt=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(mt,rt.__webglTexture),N(mt,A,wt),a&&A.mipmaps&&A.mipmaps.length>0)for(let dt=0;dt<A.mipmaps.length;dt++)ct(K.__webglFramebuffer[dt],D,A,i.COLOR_ATTACHMENT0,mt,dt);else ct(K.__webglFramebuffer,D,A,i.COLOR_ATTACHMENT0,mt,0);_(A,wt)&&x(mt),e.unbindTexture()}D.depthBuffer&&q(D)}function pt(D){const A=m(D)||a,K=D.isWebGLMultipleRenderTargets===!0?D.texture:[D.texture];for(let rt=0,st=K.length;rt<st;rt++){const lt=K[rt];if(_(lt,A)){const wt=D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,mt=n.get(lt).__webglTexture;e.bindTexture(wt,mt),x(wt),e.unbindTexture()}}}function at(D){if(a&&D.samples>0&&ut(D)===!1){const A=D.isWebGLMultipleRenderTargets?D.texture:[D.texture],K=D.width,rt=D.height;let st=i.COLOR_BUFFER_BIT;const lt=[],wt=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=n.get(D),dt=D.isWebGLMultipleRenderTargets===!0;if(dt)for(let Et=0;Et<A.length;Et++)e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,mt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,mt.__webglFramebuffer);for(let Et=0;Et<A.length;Et++){lt.push(i.COLOR_ATTACHMENT0+Et),D.depthBuffer&&lt.push(wt);const Rt=mt.__ignoreDepthValues!==void 0?mt.__ignoreDepthValues:!1;if(Rt===!1&&(D.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),dt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,mt.__webglColorRenderbuffer[Et]),Rt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[wt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[wt])),dt){const ot=n.get(A[Et]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ot,0)}i.blitFramebuffer(0,0,K,rt,0,0,K,rt,st,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,lt)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),dt)for(let Et=0;Et<A.length;Et++){e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.RENDERBUFFER,mt.__webglColorRenderbuffer[Et]);const Rt=n.get(A[Et]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Et,i.TEXTURE_2D,Rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,mt.__webglMultisampledFramebuffer)}}function ft(D){return Math.min(s.maxSamples,D.samples)}function ut(D){const A=n.get(D);return a&&D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ot(D){const A=r.render.frame;h.get(D)!==A&&(h.set(D,A),D.update())}function Ct(D,A){const K=D.colorSpace,rt=D.format,st=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||D.format===ya||K!==kn&&K!==rn&&(Qt.getTransfer(K)===le?a===!1?t.has("EXT_sRGB")===!0&&rt===ke?(D.format=ya,D.minFilter=ne,D.generateMipmaps=!1):A=fc.sRGBToLinear(A):(rt!==ke||st!==nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),A}this.allocateTextureUnit=T,this.resetTextureUnits=X,this.setTexture2D=G,this.setTexture2DArray=U,this.setTexture3D=k,this.setTextureCube=O,this.rebindTextures=it,this.setupRenderTarget=F,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=q,this.setupFrameBufferTexture=ct,this.useMultisampledRTT=ut}function Sm(i,t,e){const n=e.isWebGL2;function s(o,r=rn){let a;const l=Qt.getTransfer(r);if(o===nn)return i.UNSIGNED_BYTE;if(o===ic)return i.UNSIGNED_SHORT_4_4_4_4;if(o===sc)return i.UNSIGNED_SHORT_5_5_5_1;if(o===Gh)return i.BYTE;if(o===Vh)return i.SHORT;if(o===Fa)return i.UNSIGNED_SHORT;if(o===nc)return i.INT;if(o===Ln)return i.UNSIGNED_INT;if(o===pn)return i.FLOAT;if(o===In)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(o===Wh)return i.ALPHA;if(o===ke)return i.RGBA;if(o===qh)return i.LUMINANCE;if(o===Xh)return i.LUMINANCE_ALPHA;if(o===li)return i.DEPTH_COMPONENT;if(o===Wi)return i.DEPTH_STENCIL;if(o===ya)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(o===Ni)return i.RED;if(o===oc)return i.RED_INTEGER;if(o===Yh)return i.RG;if(o===ac)return i.RG_INTEGER;if(o===rc)return i.RGBA_INTEGER;if(o===Uo||o===Fo||o===Io||o===ko)if(l===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(o===Uo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===Fo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===Io)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===ko)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(o===Uo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===Fo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===Io)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===ko)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===lr||o===cr||o===hr||o===ur)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(o===lr)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===cr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===hr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===ur)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===lc)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===fr||o===dr)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(o===fr)return l===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(o===dr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===pr||o===mr||o===gr||o===vr||o===xr||o===_r||o===Mr||o===yr||o===wr||o===Sr||o===br||o===Er||o===Tr||o===Ar)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(o===pr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===mr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===gr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===vr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===xr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===_r)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===Mr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===yr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===wr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===Sr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===br)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===Er)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===Tr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Ar)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===zo||o===Cr||o===Rr)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(o===zo)return l===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===Cr)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===Rr)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===jh||o===Pr||o===Lr||o===Dr)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(o===zo)return a.COMPRESSED_RED_RGTC1_EXT;if(o===Pr)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Lr)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===Dr)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===ri?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[o]!==void 0?i[o]:null}return{convert:s}}class bm extends Ye{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ln extends Ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Em={type:"move"};class aa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,r=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&u>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Em)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ln;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Tm extends $i{constructor(t,e){super();const n=this;let s=null,o=1,r=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,g=null;const v=e.getContextAttributes();let m=null,p=null;const _=[],x=[],y=new It;let w=null;const M=new Ye;M.layers.enable(1),M.viewport=new ge;const E=new Ye;E.layers.enable(2),E.viewport=new ge;const R=[M,E],S=new bm;S.layers.enable(1),S.layers.enable(2);let b=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(N){let j=_[N];return j===void 0&&(j=new aa,_[N]=j),j.getTargetRaySpace()},this.getControllerGrip=function(N){let j=_[N];return j===void 0&&(j=new aa,_[N]=j),j.getGripSpace()},this.getHand=function(N){let j=_[N];return j===void 0&&(j=new aa,_[N]=j),j.getHandSpace()};function V(N){const j=x.indexOf(N.inputSource);if(j===-1)return;const $=_[j];$!==void 0&&($.update(N.inputSource,N.frame,c||r),$.dispatchEvent({type:N.type,data:N.inputSource}))}function X(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",T);for(let N=0;N<_.length;N++){const j=x[N];j!==null&&(x[N]=null,_[N].disconnect(j))}b=null,I=null,t.setRenderTarget(m),d=null,u=null,f=null,s=null,p=null,Z.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(y.width,y.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(N){o=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(N){a=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(N){c=N},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(N){if(s=N,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",X),s.addEventListener("inputsourceschange",T),v.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(y),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const j={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(s,e,j),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new sn(d.framebufferWidth,d.framebufferHeight,{format:ke,type:nn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let j=null,$=null,J=null;v.depth&&(J=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,j=v.stencil?Wi:li,$=v.stencil?ri:Ln);const ct={colorFormat:e.RGBA8,depthFormat:J,scaleFactor:o};f=new XRWebGLBinding(s,e),u=f.createProjectionLayer(ct),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),p=new sn(u.textureWidth,u.textureHeight,{format:ke,type:nn,depthTexture:new Ha(u.textureWidth,u.textureHeight,$,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const ht=t.properties.get(p);ht.__ignoreDepthValues=u.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(a),Z.setContext(s),Z.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function T(N){for(let j=0;j<N.removed.length;j++){const $=N.removed[j],J=x.indexOf($);J>=0&&(x[J]=null,_[J].disconnect($))}for(let j=0;j<N.added.length;j++){const $=N.added[j];let J=x.indexOf($);if(J===-1){for(let ht=0;ht<_.length;ht++)if(ht>=x.length){x.push($),J=ht;break}else if(x[ht]===null){x[ht]=$,J=ht;break}if(J===-1)break}const ct=_[J];ct&&ct.connect($)}}const P=new z,G=new z;function U(N,j,$){P.setFromMatrixPosition(j.matrixWorld),G.setFromMatrixPosition($.matrixWorld);const J=P.distanceTo(G),ct=j.projectionMatrix.elements,ht=$.projectionMatrix.elements,W=ct[14]/(ct[10]-1),q=ct[14]/(ct[10]+1),it=(ct[9]+1)/ct[5],F=(ct[9]-1)/ct[5],pt=(ct[8]-1)/ct[0],at=(ht[8]+1)/ht[0],ft=W*pt,ut=W*at,Ot=J/(-pt+at),Ct=Ot*-pt;j.matrixWorld.decompose(N.position,N.quaternion,N.scale),N.translateX(Ct),N.translateZ(Ot),N.matrixWorld.compose(N.position,N.quaternion,N.scale),N.matrixWorldInverse.copy(N.matrixWorld).invert();const D=W+Ot,A=q+Ot,K=ft-Ct,rt=ut+(J-Ct),st=it*q/A*D,lt=F*q/A*D;N.projectionMatrix.makePerspective(K,rt,st,lt,D,A),N.projectionMatrixInverse.copy(N.projectionMatrix).invert()}function k(N,j){j===null?N.matrixWorld.copy(N.matrix):N.matrixWorld.multiplyMatrices(j.matrixWorld,N.matrix),N.matrixWorldInverse.copy(N.matrixWorld).invert()}this.updateCamera=function(N){if(s===null)return;S.near=E.near=M.near=N.near,S.far=E.far=M.far=N.far,(b!==S.near||I!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),b=S.near,I=S.far);const j=N.parent,$=S.cameras;k(S,j);for(let J=0;J<$.length;J++)k($[J],j);$.length===2?U(S,M,E):S.projectionMatrix.copy(M.projectionMatrix),O(N,S,j)};function O(N,j,$){$===null?N.matrix.copy(j.matrixWorld):(N.matrix.copy($.matrixWorld),N.matrix.invert(),N.matrix.multiply(j.matrixWorld)),N.matrix.decompose(N.position,N.quaternion,N.scale),N.updateMatrixWorld(!0),N.projectionMatrix.copy(j.projectionMatrix),N.projectionMatrixInverse.copy(j.projectionMatrixInverse),N.isPerspectiveCamera&&(N.fov=vs*2*Math.atan(1/N.projectionMatrix.elements[5]),N.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(N){l=N,u!==null&&(u.fixedFoveation=N),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=N)};let C=null;function B(N,j){if(h=j.getViewerPose(c||r),g=j,h!==null){const $=h.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let J=!1;$.length!==S.cameras.length&&(S.cameras.length=0,J=!0);for(let ct=0;ct<$.length;ct++){const ht=$[ct];let W=null;if(d!==null)W=d.getViewport(ht);else{const it=f.getViewSubImage(u,ht);W=it.viewport,ct===0&&(t.setRenderTargetTextures(p,it.colorTexture,u.ignoreDepthValues?void 0:it.depthStencilTexture),t.setRenderTarget(p))}let q=R[ct];q===void 0&&(q=new Ye,q.layers.enable(ct),q.viewport=new ge,R[ct]=q),q.matrix.fromArray(ht.transform.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale),q.projectionMatrix.fromArray(ht.projectionMatrix),q.projectionMatrixInverse.copy(q.projectionMatrix).invert(),q.viewport.set(W.x,W.y,W.width,W.height),ct===0&&(S.matrix.copy(q.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),J===!0&&S.cameras.push(q)}}for(let $=0;$<_.length;$++){const J=x[$],ct=_[$];J!==null&&ct!==void 0&&ct.update(J,j,c||r)}C&&C(N,j),j.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:j}),g=null}const Z=new wc;Z.setAnimationLoop(B),this.setAnimationLoop=function(N){C=N},this.dispose=function(){}}}function Am(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,_c(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),f(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),u(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),v(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,_,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ve&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ve&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=t.get(p).envMap;if(_&&(m.envMap.value=_,m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const x=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*x,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,_,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ve&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const _=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Cm(i,t,e,n){let s={},o={},r=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,x){const y=x.program;n.uniformBlockBinding(_,y)}function c(_,x){let y=s[_.id];y===void 0&&(g(_),y=h(_),s[_.id]=y,_.addEventListener("dispose",m));const w=x.program;n.updateUBOMapping(_,w);const M=t.render.frame;o[_.id]!==M&&(u(_),o[_.id]=M)}function h(_){const x=f();_.__bindingPointIndex=x;const y=i.createBuffer(),w=_.__size,M=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,w,M),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,y),y}function f(){for(let _=0;_<a;_++)if(r.indexOf(_)===-1)return r.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const x=s[_.id],y=_.uniforms,w=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let M=0,E=y.length;M<E;M++){const R=Array.isArray(y[M])?y[M]:[y[M]];for(let S=0,b=R.length;S<b;S++){const I=R[S];if(d(I,M,S,w)===!0){const V=I.__offset,X=Array.isArray(I.value)?I.value:[I.value];let T=0;for(let P=0;P<X.length;P++){const G=X[P],U=v(G);typeof G=="number"||typeof G=="boolean"?(I.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,V+T,I.__data)):G.isMatrix3?(I.__data[0]=G.elements[0],I.__data[1]=G.elements[1],I.__data[2]=G.elements[2],I.__data[3]=0,I.__data[4]=G.elements[3],I.__data[5]=G.elements[4],I.__data[6]=G.elements[5],I.__data[7]=0,I.__data[8]=G.elements[6],I.__data[9]=G.elements[7],I.__data[10]=G.elements[8],I.__data[11]=0):(G.toArray(I.__data,T),T+=U.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(_,x,y,w){const M=_.value,E=x+"_"+y;if(w[E]===void 0)return typeof M=="number"||typeof M=="boolean"?w[E]=M:w[E]=M.clone(),!0;{const R=w[E];if(typeof M=="number"||typeof M=="boolean"){if(R!==M)return w[E]=M,!0}else if(R.equals(M)===!1)return R.copy(M),!0}return!1}function g(_){const x=_.uniforms;let y=0;const w=16;for(let E=0,R=x.length;E<R;E++){const S=Array.isArray(x[E])?x[E]:[x[E]];for(let b=0,I=S.length;b<I;b++){const V=S[b],X=Array.isArray(V.value)?V.value:[V.value];for(let T=0,P=X.length;T<P;T++){const G=X[T],U=v(G),k=y%w;k!==0&&w-k<U.boundary&&(y+=w-k),V.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=U.storage}}}const M=y%w;return M>0&&(y+=w-M),_.__size=y,_.__cache={},this}function v(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function m(_){const x=_.target;x.removeEventListener("dispose",m);const y=r.indexOf(x.__bindingPointIndex);r.splice(y,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete o[x.id]}function p(){for(const _ in s)i.deleteBuffer(s[_]);r=[],s={},o={}}return{bind:l,update:c,dispose:p}}class Cc{constructor(t={}){const{canvas:e=Mu(),context:n=null,depth:s=!0,stencil:o=!0,alpha:r=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=r;const d=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const p=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ce,this._useLegacyLights=!1,this.toneMapping=Xn,this.toneMappingExposure=1;const x=this;let y=!1,w=0,M=0,E=null,R=-1,S=null;const b=new ge,I=new ge;let V=null;const X=new Pt(0);let T=0,P=e.width,G=e.height,U=1,k=null,O=null;const C=new ge(0,0,P,G),B=new ge(0,0,P,G);let Z=!1;const N=new Es;let j=!1,$=!1,J=null;const ct=new Kt,ht=new It,W=new z,q={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function it(){return E===null?U:1}let F=n;function pt(L,Y){for(let tt=0;tt<L.length;tt++){const et=L[tt],Q=e.getContext(et,Y);if(Q!==null)return Q}return null}try{const L={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ua}`),e.addEventListener("webglcontextlost",gt,!1),e.addEventListener("webglcontextrestored",H,!1),e.addEventListener("webglcontextcreationerror",_t,!1),F===null){const Y=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&Y.shift(),F=pt(Y,L),F===null)throw pt(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&F instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),F.getShaderPrecisionFormat===void 0&&(F.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(L){throw console.error("THREE.WebGLRenderer: "+L.message),L}let at,ft,ut,Ot,Ct,D,A,K,rt,st,lt,wt,mt,dt,Et,Rt,ot,jt,Ft,Dt,Tt,St,Gt,Jt;function de(){at=new N0(F),ft=new D0(F,at,t),at.init(ft),St=new Sm(F,at,ft),ut=new ym(F,at,ft),Ot=new H0(F),Ct=new rm,D=new wm(F,at,ut,Ct,ft,St,Ot),A=new F0(x),K=new z0(x),rt=new ju(F,ft),Gt=new P0(F,at,rt,ft),st=new O0(F,rt,Ot,Gt),lt=new q0(F,st,rt,Ot),Ft=new W0(F,ft,D),Rt=new U0(Ct),wt=new am(x,A,K,at,ft,Gt,Rt),mt=new Am(x,Ct),dt=new cm,Et=new mm(at,ft),jt=new R0(x,A,K,ut,lt,u,l),ot=new Mm(x,lt,ft),Jt=new Cm(F,Ot,ft,ut),Dt=new L0(F,at,Ot,ft),Tt=new B0(F,at,Ot,ft),Ot.programs=wt.programs,x.capabilities=ft,x.extensions=at,x.properties=Ct,x.renderLists=dt,x.shadowMap=ot,x.state=ut,x.info=Ot}de();const qt=new Tm(x,F);this.xr=qt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const L=at.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=at.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(L){L!==void 0&&(U=L,this.setSize(P,G,!1))},this.getSize=function(L){return L.set(P,G)},this.setSize=function(L,Y,tt=!0){if(qt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}P=L,G=Y,e.width=Math.floor(L*U),e.height=Math.floor(Y*U),tt===!0&&(e.style.width=L+"px",e.style.height=Y+"px"),this.setViewport(0,0,L,Y)},this.getDrawingBufferSize=function(L){return L.set(P*U,G*U).floor()},this.setDrawingBufferSize=function(L,Y,tt){P=L,G=Y,U=tt,e.width=Math.floor(L*tt),e.height=Math.floor(Y*tt),this.setViewport(0,0,L,Y)},this.getCurrentViewport=function(L){return L.copy(b)},this.getViewport=function(L){return L.copy(C)},this.setViewport=function(L,Y,tt,et){L.isVector4?C.set(L.x,L.y,L.z,L.w):C.set(L,Y,tt,et),ut.viewport(b.copy(C).multiplyScalar(U).floor())},this.getScissor=function(L){return L.copy(B)},this.setScissor=function(L,Y,tt,et){L.isVector4?B.set(L.x,L.y,L.z,L.w):B.set(L,Y,tt,et),ut.scissor(I.copy(B).multiplyScalar(U).floor())},this.getScissorTest=function(){return Z},this.setScissorTest=function(L){ut.setScissorTest(Z=L)},this.setOpaqueSort=function(L){k=L},this.setTransparentSort=function(L){O=L},this.getClearColor=function(L){return L.copy(jt.getClearColor())},this.setClearColor=function(){jt.setClearColor.apply(jt,arguments)},this.getClearAlpha=function(){return jt.getClearAlpha()},this.setClearAlpha=function(){jt.setClearAlpha.apply(jt,arguments)},this.clear=function(L=!0,Y=!0,tt=!0){let et=0;if(L){let Q=!1;if(E!==null){const yt=E.texture.format;Q=yt===rc||yt===ac||yt===oc}if(Q){const yt=E.texture.type,At=yt===nn||yt===Ln||yt===Fa||yt===ri||yt===ic||yt===sc,Ut=jt.getClearColor(),zt=jt.getClearAlpha(),Wt=Ut.r,Bt=Ut.g,Ht=Ut.b;At?(d[0]=Wt,d[1]=Bt,d[2]=Ht,d[3]=zt,F.clearBufferuiv(F.COLOR,0,d)):(g[0]=Wt,g[1]=Bt,g[2]=Ht,g[3]=zt,F.clearBufferiv(F.COLOR,0,g))}else et|=F.COLOR_BUFFER_BIT}Y&&(et|=F.DEPTH_BUFFER_BIT),tt&&(et|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",gt,!1),e.removeEventListener("webglcontextrestored",H,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),dt.dispose(),Et.dispose(),Ct.dispose(),A.dispose(),K.dispose(),lt.dispose(),Gt.dispose(),Jt.dispose(),wt.dispose(),qt.dispose(),qt.removeEventListener("sessionstart",Oe),qt.removeEventListener("sessionend",oe),J&&(J.dispose(),J=null),Be.stop()};function gt(L){L.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function H(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const L=Ot.autoReset,Y=ot.enabled,tt=ot.autoUpdate,et=ot.needsUpdate,Q=ot.type;de(),Ot.autoReset=L,ot.enabled=Y,ot.autoUpdate=tt,ot.needsUpdate=et,ot.type=Q}function _t(L){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function Mt(L){const Y=L.target;Y.removeEventListener("dispose",Mt),kt(Y)}function kt(L){Lt(L),Ct.remove(L)}function Lt(L){const Y=Ct.get(L).programs;Y!==void 0&&(Y.forEach(function(tt){wt.releaseProgram(tt)}),L.isShaderMaterial&&wt.releaseShaderCache(L))}this.renderBufferDirect=function(L,Y,tt,et,Q,yt){Y===null&&(Y=q);const At=Q.isMesh&&Q.matrixWorld.determinant()<0,Ut=th(L,Y,tt,et,Q);ut.setMaterial(et,At);let zt=tt.index,Wt=1;if(et.wireframe===!0){if(zt=st.getWireframeAttribute(tt),zt===void 0)return;Wt=2}const Bt=tt.drawRange,Ht=tt.attributes.position;let _e=Bt.start*Wt,Je=(Bt.start+Bt.count)*Wt;yt!==null&&(_e=Math.max(_e,yt.start*Wt),Je=Math.min(Je,(yt.start+yt.count)*Wt)),zt!==null?(_e=Math.max(_e,0),Je=Math.min(Je,zt.count)):Ht!=null&&(_e=Math.max(_e,0),Je=Math.min(Je,Ht.count));const Ee=Je-_e;if(Ee<0||Ee===1/0)return;Gt.setup(Q,et,Ut,tt,zt);let yn,ce=Dt;if(zt!==null&&(yn=rt.get(zt),ce=Tt,ce.setIndex(yn)),Q.isMesh)et.wireframe===!0?(ut.setLineWidth(et.wireframeLinewidth*it()),ce.setMode(F.LINES)):ce.setMode(F.TRIANGLES);else if(Q.isLine){let Xt=et.linewidth;Xt===void 0&&(Xt=1),ut.setLineWidth(Xt*it()),Q.isLineSegments?ce.setMode(F.LINES):Q.isLineLoop?ce.setMode(F.LINE_LOOP):ce.setMode(F.LINE_STRIP)}else Q.isPoints?ce.setMode(F.POINTS):Q.isSprite&&ce.setMode(F.TRIANGLES);if(Q.isBatchedMesh)ce.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else if(Q.isInstancedMesh)ce.renderInstances(_e,Ee,Q.count);else if(tt.isInstancedBufferGeometry){const Xt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,Co=Math.min(tt.instanceCount,Xt);ce.renderInstances(_e,Ee,Co)}else ce.render(_e,Ee)};function ie(L,Y,tt){L.transparent===!0&&L.side===je&&L.forceSinglePass===!1?(L.side=Ve,L.needsUpdate=!0,Rs(L,Y,tt),L.side=Fn,L.needsUpdate=!0,Rs(L,Y,tt),L.side=je):Rs(L,Y,tt)}this.compile=function(L,Y,tt=null){tt===null&&(tt=L),m=Et.get(tt),m.init(),_.push(m),tt.traverseVisible(function(Q){Q.isLight&&Q.layers.test(Y.layers)&&(m.pushLight(Q),Q.castShadow&&m.pushShadow(Q))}),L!==tt&&L.traverseVisible(function(Q){Q.isLight&&Q.layers.test(Y.layers)&&(m.pushLight(Q),Q.castShadow&&m.pushShadow(Q))}),m.setupLights(x._useLegacyLights);const et=new Set;return L.traverse(function(Q){const yt=Q.material;if(yt)if(Array.isArray(yt))for(let At=0;At<yt.length;At++){const Ut=yt[At];ie(Ut,tt,Q),et.add(Ut)}else ie(yt,tt,Q),et.add(yt)}),_.pop(),m=null,et},this.compileAsync=function(L,Y,tt=null){const et=this.compile(L,Y,tt);return new Promise(Q=>{function yt(){if(et.forEach(function(At){Ct.get(At).currentProgram.isReady()&&et.delete(At)}),et.size===0){Q(L);return}setTimeout(yt,10)}at.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let se=null;function be(L){se&&se(L)}function Oe(){Be.stop()}function oe(){Be.start()}const Be=new wc;Be.setAnimationLoop(be),typeof self<"u"&&Be.setContext(self),this.setAnimationLoop=function(L){se=L,qt.setAnimationLoop(L),L===null?Be.stop():Be.start()},qt.addEventListener("sessionstart",Oe),qt.addEventListener("sessionend",oe),this.render=function(L,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),qt.enabled===!0&&qt.isPresenting===!0&&(qt.cameraAutoUpdate===!0&&qt.updateCamera(Y),Y=qt.getCamera()),L.isScene===!0&&L.onBeforeRender(x,L,Y,E),m=Et.get(L,_.length),m.init(),_.push(m),ct.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),N.setFromProjectionMatrix(ct),$=this.localClippingEnabled,j=Rt.init(this.clippingPlanes,$),v=dt.get(L,p.length),v.init(),p.push(v),mn(L,Y,0,x.sortObjects),v.finish(),x.sortObjects===!0&&v.sort(k,O),this.info.render.frame++,j===!0&&Rt.beginShadows();const tt=m.state.shadowsArray;if(ot.render(tt,L,Y),j===!0&&Rt.endShadows(),this.info.autoReset===!0&&this.info.reset(),jt.render(v,L),m.setupLights(x._useLegacyLights),Y.isArrayCamera){const et=Y.cameras;for(let Q=0,yt=et.length;Q<yt;Q++){const At=et[Q];Ka(v,L,At,At.viewport)}}else Ka(v,L,Y);E!==null&&(D.updateMultisampleRenderTarget(E),D.updateRenderTargetMipmap(E)),L.isScene===!0&&L.onAfterRender(x,L,Y),Gt.resetDefaultState(),R=-1,S=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,p.pop(),p.length>0?v=p[p.length-1]:v=null};function mn(L,Y,tt,et){if(L.visible===!1)return;if(L.layers.test(Y.layers)){if(L.isGroup)tt=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(Y);else if(L.isLight)m.pushLight(L),L.castShadow&&m.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||N.intersectsSprite(L)){et&&W.setFromMatrixPosition(L.matrixWorld).applyMatrix4(ct);const At=lt.update(L),Ut=L.material;Ut.visible&&v.push(L,At,Ut,tt,W.z,null)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||N.intersectsObject(L))){const At=lt.update(L),Ut=L.material;if(et&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),W.copy(L.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),W.copy(At.boundingSphere.center)),W.applyMatrix4(L.matrixWorld).applyMatrix4(ct)),Array.isArray(Ut)){const zt=At.groups;for(let Wt=0,Bt=zt.length;Wt<Bt;Wt++){const Ht=zt[Wt],_e=Ut[Ht.materialIndex];_e&&_e.visible&&v.push(L,At,_e,tt,W.z,Ht)}}else Ut.visible&&v.push(L,At,Ut,tt,W.z,null)}}const yt=L.children;for(let At=0,Ut=yt.length;At<Ut;At++)mn(yt[At],Y,tt,et)}function Ka(L,Y,tt,et){const Q=L.opaque,yt=L.transmissive,At=L.transparent;m.setupLightsView(tt),j===!0&&Rt.setGlobalState(x.clippingPlanes,tt),yt.length>0&&Qc(Q,yt,Y,tt),et&&ut.viewport(b.copy(et)),Q.length>0&&Cs(Q,Y,tt),yt.length>0&&Cs(yt,Y,tt),At.length>0&&Cs(At,Y,tt),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function Qc(L,Y,tt,et){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;const yt=ft.isWebGL2;J===null&&(J=new sn(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")?In:nn,minFilter:ui,samples:yt?4:0})),x.getDrawingBufferSize(ht),yt?J.setSize(ht.x,ht.y):J.setSize(xo(ht.x),xo(ht.y));const At=x.getRenderTarget();x.setRenderTarget(J),x.getClearColor(X),T=x.getClearAlpha(),T<1&&x.setClearColor(16777215,.5),x.clear();const Ut=x.toneMapping;x.toneMapping=Xn,Cs(L,tt,et),D.updateMultisampleRenderTarget(J),D.updateRenderTargetMipmap(J);let zt=!1;for(let Wt=0,Bt=Y.length;Wt<Bt;Wt++){const Ht=Y[Wt],_e=Ht.object,Je=Ht.geometry,Ee=Ht.material,yn=Ht.group;if(Ee.side===je&&_e.layers.test(et.layers)){const ce=Ee.side;Ee.side=Ve,Ee.needsUpdate=!0,Za(_e,tt,et,Je,Ee,yn),Ee.side=ce,Ee.needsUpdate=!0,zt=!0}}zt===!0&&(D.updateMultisampleRenderTarget(J),D.updateRenderTargetMipmap(J)),x.setRenderTarget(At),x.setClearColor(X,T),x.toneMapping=Ut}function Cs(L,Y,tt){const et=Y.isScene===!0?Y.overrideMaterial:null;for(let Q=0,yt=L.length;Q<yt;Q++){const At=L[Q],Ut=At.object,zt=At.geometry,Wt=et===null?At.material:et,Bt=At.group;Ut.layers.test(tt.layers)&&Za(Ut,Y,tt,zt,Wt,Bt)}}function Za(L,Y,tt,et,Q,yt){L.onBeforeRender(x,Y,tt,et,Q,yt),L.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),Q.onBeforeRender(x,Y,tt,et,L,yt),Q.transparent===!0&&Q.side===je&&Q.forceSinglePass===!1?(Q.side=Ve,Q.needsUpdate=!0,x.renderBufferDirect(tt,Y,et,Q,L,yt),Q.side=Fn,Q.needsUpdate=!0,x.renderBufferDirect(tt,Y,et,Q,L,yt),Q.side=je):x.renderBufferDirect(tt,Y,et,Q,L,yt),L.onAfterRender(x,Y,tt,et,Q,yt)}function Rs(L,Y,tt){Y.isScene!==!0&&(Y=q);const et=Ct.get(L),Q=m.state.lights,yt=m.state.shadowsArray,At=Q.state.version,Ut=wt.getParameters(L,Q.state,yt,Y,tt),zt=wt.getProgramCacheKey(Ut);let Wt=et.programs;et.environment=L.isMeshStandardMaterial?Y.environment:null,et.fog=Y.fog,et.envMap=(L.isMeshStandardMaterial?K:A).get(L.envMap||et.environment),Wt===void 0&&(L.addEventListener("dispose",Mt),Wt=new Map,et.programs=Wt);let Bt=Wt.get(zt);if(Bt!==void 0){if(et.currentProgram===Bt&&et.lightsStateVersion===At)return Qa(L,Ut),Bt}else Ut.uniforms=wt.getUniforms(L),L.onBuild(tt,Ut,x),L.onBeforeCompile(Ut,x),Bt=wt.acquireProgram(Ut,zt),Wt.set(zt,Bt),et.uniforms=Ut.uniforms;const Ht=et.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Ht.clippingPlanes=Rt.uniform),Qa(L,Ut),et.needsLights=nh(L),et.lightsStateVersion=At,et.needsLights&&(Ht.ambientLightColor.value=Q.state.ambient,Ht.lightProbe.value=Q.state.probe,Ht.directionalLights.value=Q.state.directional,Ht.directionalLightShadows.value=Q.state.directionalShadow,Ht.spotLights.value=Q.state.spot,Ht.spotLightShadows.value=Q.state.spotShadow,Ht.rectAreaLights.value=Q.state.rectArea,Ht.ltc_1.value=Q.state.rectAreaLTC1,Ht.ltc_2.value=Q.state.rectAreaLTC2,Ht.pointLights.value=Q.state.point,Ht.pointLightShadows.value=Q.state.pointShadow,Ht.hemisphereLights.value=Q.state.hemi,Ht.directionalShadowMap.value=Q.state.directionalShadowMap,Ht.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,Ht.spotShadowMap.value=Q.state.spotShadowMap,Ht.spotLightMatrix.value=Q.state.spotLightMatrix,Ht.spotLightMap.value=Q.state.spotLightMap,Ht.pointShadowMap.value=Q.state.pointShadowMap,Ht.pointShadowMatrix.value=Q.state.pointShadowMatrix),et.currentProgram=Bt,et.uniformsList=null,Bt}function Ja(L){if(L.uniformsList===null){const Y=L.currentProgram.getUniforms();L.uniformsList=ro.seqWithValue(Y.seq,L.uniforms)}return L.uniformsList}function Qa(L,Y){const tt=Ct.get(L);tt.outputColorSpace=Y.outputColorSpace,tt.batching=Y.batching,tt.instancing=Y.instancing,tt.instancingColor=Y.instancingColor,tt.skinning=Y.skinning,tt.morphTargets=Y.morphTargets,tt.morphNormals=Y.morphNormals,tt.morphColors=Y.morphColors,tt.morphTargetsCount=Y.morphTargetsCount,tt.numClippingPlanes=Y.numClippingPlanes,tt.numIntersection=Y.numClipIntersection,tt.vertexAlphas=Y.vertexAlphas,tt.vertexTangents=Y.vertexTangents,tt.toneMapping=Y.toneMapping}function th(L,Y,tt,et,Q){Y.isScene!==!0&&(Y=q),D.resetTextureUnits();const yt=Y.fog,At=et.isMeshStandardMaterial?Y.environment:null,Ut=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:kn,zt=(et.isMeshStandardMaterial?K:A).get(et.envMap||At),Wt=et.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Bt=!!tt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),Ht=!!tt.morphAttributes.position,_e=!!tt.morphAttributes.normal,Je=!!tt.morphAttributes.color;let Ee=Xn;et.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ee=x.toneMapping);const yn=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,ce=yn!==void 0?yn.length:0,Xt=Ct.get(et),Co=m.state.lights;if(j===!0&&($===!0||L!==S)){const on=L===S&&et.id===R;Rt.setState(et,L,on)}let pe=!1;et.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==Co.state.version||Xt.outputColorSpace!==Ut||Q.isBatchedMesh&&Xt.batching===!1||!Q.isBatchedMesh&&Xt.batching===!0||Q.isInstancedMesh&&Xt.instancing===!1||!Q.isInstancedMesh&&Xt.instancing===!0||Q.isSkinnedMesh&&Xt.skinning===!1||!Q.isSkinnedMesh&&Xt.skinning===!0||Q.isInstancedMesh&&Xt.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&Xt.instancingColor===!1&&Q.instanceColor!==null||Xt.envMap!==zt||et.fog===!0&&Xt.fog!==yt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Rt.numPlanes||Xt.numIntersection!==Rt.numIntersection)||Xt.vertexAlphas!==Wt||Xt.vertexTangents!==Bt||Xt.morphTargets!==Ht||Xt.morphNormals!==_e||Xt.morphColors!==Je||Xt.toneMapping!==Ee||ft.isWebGL2===!0&&Xt.morphTargetsCount!==ce)&&(pe=!0):(pe=!0,Xt.__version=et.version);let Kn=Xt.currentProgram;pe===!0&&(Kn=Rs(et,Y,Q));let tr=!1,Qi=!1,Ro=!1;const Le=Kn.getUniforms(),Zn=Xt.uniforms;if(ut.useProgram(Kn.program)&&(tr=!0,Qi=!0,Ro=!0),et.id!==R&&(R=et.id,Qi=!0),tr||S!==L){Le.setValue(F,"projectionMatrix",L.projectionMatrix),Le.setValue(F,"viewMatrix",L.matrixWorldInverse);const on=Le.map.cameraPosition;on!==void 0&&on.setValue(F,W.setFromMatrixPosition(L.matrixWorld)),ft.logarithmicDepthBuffer&&Le.setValue(F,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&Le.setValue(F,"isOrthographic",L.isOrthographicCamera===!0),S!==L&&(S=L,Qi=!0,Ro=!0)}if(Q.isSkinnedMesh){Le.setOptional(F,Q,"bindMatrix"),Le.setOptional(F,Q,"bindMatrixInverse");const on=Q.skeleton;on&&(ft.floatVertexTextures?(on.boneTexture===null&&on.computeBoneTexture(),Le.setValue(F,"boneTexture",on.boneTexture,D)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Q.isBatchedMesh&&(Le.setOptional(F,Q,"batchingTexture"),Le.setValue(F,"batchingTexture",Q._matricesTexture,D));const Po=tt.morphAttributes;if((Po.position!==void 0||Po.normal!==void 0||Po.color!==void 0&&ft.isWebGL2===!0)&&Ft.update(Q,tt,Kn),(Qi||Xt.receiveShadow!==Q.receiveShadow)&&(Xt.receiveShadow=Q.receiveShadow,Le.setValue(F,"receiveShadow",Q.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(Zn.envMap.value=zt,Zn.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),Qi&&(Le.setValue(F,"toneMappingExposure",x.toneMappingExposure),Xt.needsLights&&eh(Zn,Ro),yt&&et.fog===!0&&mt.refreshFogUniforms(Zn,yt),mt.refreshMaterialUniforms(Zn,et,U,G,J),ro.upload(F,Ja(Xt),Zn,D)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(ro.upload(F,Ja(Xt),Zn,D),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&Le.setValue(F,"center",Q.center),Le.setValue(F,"modelViewMatrix",Q.modelViewMatrix),Le.setValue(F,"normalMatrix",Q.normalMatrix),Le.setValue(F,"modelMatrix",Q.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const on=et.uniformsGroups;for(let Lo=0,ih=on.length;Lo<ih;Lo++)if(ft.isWebGL2){const er=on[Lo];Jt.update(er,Kn),Jt.bind(er,Kn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Kn}function eh(L,Y){L.ambientLightColor.needsUpdate=Y,L.lightProbe.needsUpdate=Y,L.directionalLights.needsUpdate=Y,L.directionalLightShadows.needsUpdate=Y,L.pointLights.needsUpdate=Y,L.pointLightShadows.needsUpdate=Y,L.spotLights.needsUpdate=Y,L.spotLightShadows.needsUpdate=Y,L.rectAreaLights.needsUpdate=Y,L.hemisphereLights.needsUpdate=Y}function nh(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(L,Y,tt){Ct.get(L.texture).__webglTexture=Y,Ct.get(L.depthTexture).__webglTexture=tt;const et=Ct.get(L);et.__hasExternalTextures=!0,et.__hasExternalTextures&&(et.__autoAllocateDepthBuffer=tt===void 0,et.__autoAllocateDepthBuffer||at.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(L,Y){const tt=Ct.get(L);tt.__webglFramebuffer=Y,tt.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(L,Y=0,tt=0){E=L,w=Y,M=tt;let et=!0,Q=null,yt=!1,At=!1;if(L){const zt=Ct.get(L);zt.__useDefaultFramebuffer!==void 0?(ut.bindFramebuffer(F.FRAMEBUFFER,null),et=!1):zt.__webglFramebuffer===void 0?D.setupRenderTarget(L):zt.__hasExternalTextures&&D.rebindTextures(L,Ct.get(L.texture).__webglTexture,Ct.get(L.depthTexture).__webglTexture);const Wt=L.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(At=!0);const Bt=Ct.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(Bt[Y])?Q=Bt[Y][tt]:Q=Bt[Y],yt=!0):ft.isWebGL2&&L.samples>0&&D.useMultisampledRTT(L)===!1?Q=Ct.get(L).__webglMultisampledFramebuffer:Array.isArray(Bt)?Q=Bt[tt]:Q=Bt,b.copy(L.viewport),I.copy(L.scissor),V=L.scissorTest}else b.copy(C).multiplyScalar(U).floor(),I.copy(B).multiplyScalar(U).floor(),V=Z;if(ut.bindFramebuffer(F.FRAMEBUFFER,Q)&&ft.drawBuffers&&et&&ut.drawBuffers(L,Q),ut.viewport(b),ut.scissor(I),ut.setScissorTest(V),yt){const zt=Ct.get(L.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+Y,zt.__webglTexture,tt)}else if(At){const zt=Ct.get(L.texture),Wt=Y||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,zt.__webglTexture,tt||0,Wt)}R=-1},this.readRenderTargetPixels=function(L,Y,tt,et,Q,yt,At){if(!(L&&L.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=Ct.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&At!==void 0&&(Ut=Ut[At]),Ut){ut.bindFramebuffer(F.FRAMEBUFFER,Ut);try{const zt=L.texture,Wt=zt.format,Bt=zt.type;if(Wt!==ke&&St.convert(Wt)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ht=Bt===In&&(at.has("EXT_color_buffer_half_float")||ft.isWebGL2&&at.has("EXT_color_buffer_float"));if(Bt!==nn&&St.convert(Bt)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Bt===pn&&(ft.isWebGL2||at.has("OES_texture_float")||at.has("WEBGL_color_buffer_float")))&&!Ht){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=L.width-et&&tt>=0&&tt<=L.height-Q&&F.readPixels(Y,tt,et,Q,St.convert(Wt),St.convert(Bt),yt)}finally{const zt=E!==null?Ct.get(E).__webglFramebuffer:null;ut.bindFramebuffer(F.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(L,Y,tt=0){const et=Math.pow(2,-tt),Q=Math.floor(Y.image.width*et),yt=Math.floor(Y.image.height*et);D.setTexture2D(Y,0),F.copyTexSubImage2D(F.TEXTURE_2D,tt,0,0,L.x,L.y,Q,yt),ut.unbindTexture()},this.copyTextureToTexture=function(L,Y,tt,et=0){const Q=Y.image.width,yt=Y.image.height,At=St.convert(tt.format),Ut=St.convert(tt.type);D.setTexture2D(tt,0),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,tt.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,tt.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,tt.unpackAlignment),Y.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,et,L.x,L.y,Q,yt,At,Ut,Y.image.data):Y.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,et,L.x,L.y,Y.mipmaps[0].width,Y.mipmaps[0].height,At,Y.mipmaps[0].data):F.texSubImage2D(F.TEXTURE_2D,et,L.x,L.y,At,Ut,Y.image),et===0&&tt.generateMipmaps&&F.generateMipmap(F.TEXTURE_2D),ut.unbindTexture()},this.copyTextureToTexture3D=function(L,Y,tt,et,Q=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const yt=L.max.x-L.min.x+1,At=L.max.y-L.min.y+1,Ut=L.max.z-L.min.z+1,zt=St.convert(et.format),Wt=St.convert(et.type);let Bt;if(et.isData3DTexture)D.setTexture3D(et,0),Bt=F.TEXTURE_3D;else if(et.isDataArrayTexture||et.isCompressedArrayTexture)D.setTexture2DArray(et,0),Bt=F.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,et.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,et.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,et.unpackAlignment);const Ht=F.getParameter(F.UNPACK_ROW_LENGTH),_e=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Je=F.getParameter(F.UNPACK_SKIP_PIXELS),Ee=F.getParameter(F.UNPACK_SKIP_ROWS),yn=F.getParameter(F.UNPACK_SKIP_IMAGES),ce=tt.isCompressedTexture?tt.mipmaps[Q]:tt.image;F.pixelStorei(F.UNPACK_ROW_LENGTH,ce.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,ce.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,L.min.x),F.pixelStorei(F.UNPACK_SKIP_ROWS,L.min.y),F.pixelStorei(F.UNPACK_SKIP_IMAGES,L.min.z),tt.isDataTexture||tt.isData3DTexture?F.texSubImage3D(Bt,Q,Y.x,Y.y,Y.z,yt,At,Ut,zt,Wt,ce.data):tt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),F.compressedTexSubImage3D(Bt,Q,Y.x,Y.y,Y.z,yt,At,Ut,zt,ce.data)):F.texSubImage3D(Bt,Q,Y.x,Y.y,Y.z,yt,At,Ut,zt,Wt,ce),F.pixelStorei(F.UNPACK_ROW_LENGTH,Ht),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,_e),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Je),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ee),F.pixelStorei(F.UNPACK_SKIP_IMAGES,yn),Q===0&&et.generateMipmaps&&F.generateMipmap(Bt),ut.unbindTexture()},this.initTexture=function(L){L.isCubeTexture?D.setTextureCube(L,0):L.isData3DTexture?D.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?D.setTexture2DArray(L,0):D.setTexture2D(L,0),ut.unbindTexture()},this.resetState=function(){w=0,M=0,E=null,ut.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ia?"display-p3":"srgb",e.unpackColorSpace=Qt.workingColorSpace===bo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ce?ci:cc}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===ci?Ce:kn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Rm extends Cc{}Rm.prototype.isWebGL1Renderer=!0;class Yi extends Ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class $n extends Ke{constructor(t=null,e=1,n=1,s,o,r,a,l,c=ue,h=ue,f,u){super(null,r,a,l,c,h,s,o,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yn extends he{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ri=new Kt,wl=new Kt,Js=[],Sl=new Mn,Pm=new Kt,ss=new te,os=new Zi;class ms extends te{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Yn(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Pm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Mn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ri),Sl.copy(t.boundingBox).applyMatrix4(Ri),this.boundingBox.union(Sl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ri),os.copy(t.boundingSphere).applyMatrix4(Ri),this.boundingSphere.union(os)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ss.geometry=this.geometry,ss.material=this.material,ss.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),os.copy(this.boundingSphere),os.applyMatrix4(n),t.ray.intersectsSphere(os)!==!1))for(let o=0;o<s;o++){this.getMatrixAt(o,Ri),wl.multiplyMatrices(n,Ri),ss.matrixWorld=wl,ss.raycast(t,Js);for(let r=0,a=Js.length;r<a;r++){const l=Js[r];l.instanceId=o,l.object=this,e.push(l)}Js.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Yn(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Lm extends Ss{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const bl=new Kt,Ea=new za,Qs=new Zi,to=new z;class Rc extends Ze{constructor(t=new Re,e=new Lm){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(s),Qs.radius+=o,t.ray.intersectsSphere(Qs)===!1)return;bl.copy(s).invert(),Ea.copy(t.ray).applyMatrix4(bl);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){const u=Math.max(0,r.start),d=Math.min(c.count,r.start+r.count);for(let g=u,v=d;g<v;g++){const m=c.getX(g);to.fromBufferAttribute(f,m),El(to,m,l,s,t,e,this)}}else{const u=Math.max(0,r.start),d=Math.min(f.count,r.start+r.count);for(let g=u,v=d;g<v;g++)to.fromBufferAttribute(f,g),El(to,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function El(i,t,e,n,s,o,r){const a=Ea.distanceSqToPoint(i);if(a<e){const l=new z;Ea.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;o.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:r})}}class Ga extends Re{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],r=[];a(s),c(n),h(),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(o.slice(),3)),this.setAttribute("uv",new re(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const x=new z,y=new z,w=new z;for(let M=0;M<e.length;M+=3)d(e[M+0],x),d(e[M+1],y),d(e[M+2],w),l(x,y,w,_)}function l(_,x,y,w){const M=w+1,E=[];for(let R=0;R<=M;R++){E[R]=[];const S=_.clone().lerp(y,R/M),b=x.clone().lerp(y,R/M),I=M-R;for(let V=0;V<=I;V++)V===0&&R===M?E[R][V]=S:E[R][V]=S.clone().lerp(b,V/I)}for(let R=0;R<M;R++)for(let S=0;S<2*(M-R)-1;S++){const b=Math.floor(S/2);S%2===0?(u(E[R][b+1]),u(E[R+1][b]),u(E[R][b])):(u(E[R][b+1]),u(E[R+1][b+1]),u(E[R+1][b]))}}function c(_){const x=new z;for(let y=0;y<o.length;y+=3)x.x=o[y+0],x.y=o[y+1],x.z=o[y+2],x.normalize().multiplyScalar(_),o[y+0]=x.x,o[y+1]=x.y,o[y+2]=x.z}function h(){const _=new z;for(let x=0;x<o.length;x+=3){_.x=o[x+0],_.y=o[x+1],_.z=o[x+2];const y=m(_)/2/Math.PI+.5,w=p(_)/Math.PI+.5;r.push(y,1-w)}g(),f()}function f(){for(let _=0;_<r.length;_+=6){const x=r[_+0],y=r[_+2],w=r[_+4],M=Math.max(x,y,w),E=Math.min(x,y,w);M>.9&&E<.1&&(x<.2&&(r[_+0]+=1),y<.2&&(r[_+2]+=1),w<.2&&(r[_+4]+=1))}}function u(_){o.push(_.x,_.y,_.z)}function d(_,x){const y=_*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function g(){const _=new z,x=new z,y=new z,w=new z,M=new It,E=new It,R=new It;for(let S=0,b=0;S<o.length;S+=9,b+=6){_.set(o[S+0],o[S+1],o[S+2]),x.set(o[S+3],o[S+4],o[S+5]),y.set(o[S+6],o[S+7],o[S+8]),M.set(r[b+0],r[b+1]),E.set(r[b+2],r[b+3]),R.set(r[b+4],r[b+5]),w.copy(_).add(x).add(y).divideScalar(3);const I=m(w);v(M,b+0,_,I),v(E,b+2,x,I),v(R,b+4,y,I)}}function v(_,x,y,w){w<0&&_.x===1&&(r[x]=_.x-1),y.x===0&&y.z===0&&(r[x]=w/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ga(t.vertices,t.indices,t.radius,t.details)}}const Dm={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=Pc(i,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,l,c,h,f,u,d;if(n&&(o=zm(i,t,o,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let g=e;g<s;g+=e)f=i[g],u=i[g+1],f<a&&(a=f),u<l&&(l=u),f>c&&(c=f),u>h&&(h=u);d=Math.max(c-a,h-l),d=d!==0?32767/d:0}return xs(o,r,e,a,l,d,0),r}};function Pc(i,t,e,n,s){let o,r;if(s===jm(i,t,e,n)>0)for(o=t;o<e;o+=n)r=Tl(o,i[o],i[o+1],r);else for(o=e-n;o>=t;o-=n)r=Tl(o,i[o],i[o+1],r);return r&&To(r,r.next)&&(Ms(r),r=r.next),r}function fi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(To(e,e.next)||fe(e.prev,e,e.next)===0)){if(Ms(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function xs(i,t,e,n,s,o,r){if(!i)return;!r&&o&&Gm(i,n,s,o);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,o?Fm(i,n,s,o):Um(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Ms(i),i=c.next,a=c.next;continue}if(i=c,i===a){r?r===1?(i=Im(fi(i),t,e),xs(i,t,e,n,s,o,2)):r===2&&km(i,t,e,n,s,o):xs(fi(i),t,e,n,s,o,1);break}}}function Um(i){const t=i.prev,e=i,n=i.next;if(fe(t,e,n)>=0)return!1;const s=t.x,o=e.x,r=n.x,a=t.y,l=e.y,c=n.y,h=s<o?s<r?s:r:o<r?o:r,f=a<l?a<c?a:c:l<c?l:c,u=s>o?s>r?s:r:o>r?o:r,d=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=f&&g.y<=d&&ki(s,a,o,l,r,c,g.x,g.y)&&fe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Fm(i,t,e,n){const s=i.prev,o=i,r=i.next;if(fe(s,o,r)>=0)return!1;const a=s.x,l=o.x,c=r.x,h=s.y,f=o.y,u=r.y,d=a<l?a<c?a:c:l<c?l:c,g=h<f?h<u?h:u:f<u?f:u,v=a>l?a>c?a:c:l>c?l:c,m=h>f?h>u?h:u:f>u?f:u,p=Ta(d,g,t,e,n),_=Ta(v,m,t,e,n);let x=i.prevZ,y=i.nextZ;for(;x&&x.z>=p&&y&&y.z<=_;){if(x.x>=d&&x.x<=v&&x.y>=g&&x.y<=m&&x!==s&&x!==r&&ki(a,h,l,f,c,u,x.x,x.y)&&fe(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==r&&ki(a,h,l,f,c,u,y.x,y.y)&&fe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=d&&x.x<=v&&x.y>=g&&x.y<=m&&x!==s&&x!==r&&ki(a,h,l,f,c,u,x.x,x.y)&&fe(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=d&&y.x<=v&&y.y>=g&&y.y<=m&&y!==s&&y!==r&&ki(a,h,l,f,c,u,y.x,y.y)&&fe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Im(i,t,e){let n=i;do{const s=n.prev,o=n.next.next;!To(s,o)&&Lc(s,n,n.next,o)&&_s(s,o)&&_s(o,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),Ms(n),Ms(n.next),n=i=o),n=n.next}while(n!==i);return fi(n)}function km(i,t,e,n,s,o){let r=i;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&qm(r,a)){let l=Dc(r,a);r=fi(r,r.next),l=fi(l,l.next),xs(r,t,e,n,s,o,0),xs(l,t,e,n,s,o,0);return}a=a.next}r=r.next}while(r!==i)}function zm(i,t,e,n){const s=[];let o,r,a,l,c;for(o=0,r=t.length;o<r;o++)a=t[o]*n,l=o<r-1?t[o+1]*n:i.length,c=Pc(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(Wm(c));for(s.sort(Nm),o=0;o<s.length;o++)e=Om(s[o],e);return e}function Nm(i,t){return i.x-t.x}function Om(i,t){const e=Bm(i,t);if(!e)return t;const n=Dc(e,i);return fi(n,n.next),fi(e,e.next)}function Bm(i,t){let e=t,n=-1/0,s;const o=i.x,r=i.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const u=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=o&&u>n&&(n=u,s=e.x<e.next.x?e:e.next,u===o))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let h=1/0,f;e=s;do o>=e.x&&e.x>=l&&o!==e.x&&ki(r<c?o:n,r,l,c,r<c?n:o,r,e.x,e.y)&&(f=Math.abs(r-e.y)/(o-e.x),_s(e,i)&&(f<h||f===h&&(e.x>s.x||e.x===s.x&&Hm(s,e)))&&(s=e,h=f)),e=e.next;while(e!==a);return s}function Hm(i,t){return fe(i.prev,i,t.prev)<0&&fe(t.next,i,i.next)<0}function Gm(i,t,e,n){let s=i;do s.z===0&&(s.z=Ta(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Vm(s)}function Vm(i){let t,e,n,s,o,r,a,l,c=1;do{for(e=i,i=null,o=null,r=0;e;){for(r++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;e=n}o.nextZ=null,c*=2}while(r>1);return i}function Ta(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Wm(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function ki(i,t,e,n,s,o,r,a){return(s-r)*(t-a)>=(i-r)*(o-a)&&(i-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(n-a)}function qm(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Xm(i,t)&&(_s(i,t)&&_s(t,i)&&Ym(i,t)&&(fe(i.prev,i,t.prev)||fe(i,t.prev,t))||To(i,t)&&fe(i.prev,i,i.next)>0&&fe(t.prev,t,t.next)>0)}function fe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function To(i,t){return i.x===t.x&&i.y===t.y}function Lc(i,t,e,n){const s=no(fe(i,t,e)),o=no(fe(i,t,n)),r=no(fe(e,n,i)),a=no(fe(e,n,t));return!!(s!==o&&r!==a||s===0&&eo(i,e,t)||o===0&&eo(i,n,t)||r===0&&eo(e,i,n)||a===0&&eo(e,t,n))}function eo(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function no(i){return i>0?1:i<0?-1:0}function Xm(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Lc(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function _s(i,t){return fe(i.prev,i,i.next)<0?fe(i,t,i.next)>=0&&fe(i,i.prev,t)>=0:fe(i,t,i.prev)<0||fe(i,i.next,t)<0}function Ym(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Dc(i,t){const e=new Aa(i.i,i.x,i.y),n=new Aa(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Tl(i,t,e,n){const s=new Aa(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ms(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Aa(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function jm(i,t,e,n){let s=0;for(let o=t,r=e-n;o<e;o+=n)s+=(i[r]-i[o])*(i[o+1]+i[r+1]),r=o;return s}class Va{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return Va.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];Al(t),Cl(n,t);let r=t.length;e.forEach(Al);for(let l=0;l<e.length;l++)s.push(r),r+=e[l].length,Cl(n,e[l]);const a=Dm.triangulate(n,s);for(let l=0;l<a.length;l+=3)o.push(a.slice(l,l+3));return o}}function Al(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Cl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Wa extends Ga{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Wa(t.radius,t.detail)}}class Uc extends Re{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class $m{constructor(t,e,n=0,s=1/0){this.ray=new za(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Na,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Ca(t,this,n,e),n.sort(Rl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,o=t.length;s<o;s++)Ca(t[s],this,n,e);return n.sort(Rl),n}}function Rl(i,t){return i.distance-t.distance}function Ca(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const s=i.children;for(let o=0,r=s.length;o<r;o++)Ca(s[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ua}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ua);const ra=i=>Number.isInteger(i)?i.toFixed(1):String(i),Ne=`
#define WORLD ${ra(Zt)}
#define HALF_WORLD ${ra(Zt/2)}
#define HRES ${ra(_n)}
#define Y_PER_M ${Nt}
#define PI 3.14159265
`,zn=`
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
float fbm2(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
// cellular: x = distance to nearest feature, y = its id hash, z = edge distance-ish
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
`,cn=`
uniform sampler2D uHeight;
vec2 worldToUv(vec2 xz) { return xz / WORLD + 0.5; }
float metresAt(vec2 xz) {
  vec2 t = worldToUv(xz) * HRES - 0.5;
  vec2 fl = floor(t);
  vec2 fr = t - fl;
  ivec2 i = clamp(ivec2(fl), ivec2(0), ivec2(int(HRES) - 2));
  float h00 = texelFetch(uHeight, i, 0).r;
  float h10 = texelFetch(uHeight, i + ivec2(1, 0), 0).r;
  float h01 = texelFetch(uHeight, i + ivec2(0, 1), 0).r;
  float h11 = texelFetch(uHeight, i + ivec2(1, 1), 0).r;
  return mix(mix(h00, h10, fr.x), mix(h01, h11, fr.x), fr.y);
}
`,Nn=`
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform float uTime;
uniform sampler2D uShadow;      // terrain shadow from the sun, top-down
uniform sampler2D uWeather;     // r cloud cover, g rain, b top, a base
uniform vec4 uWeatherRect;      // xy origin, zw size of the weather grid in world
uniform float uCloudShadowK;
uniform float uCloudMidY;
uniform float uWetness;         // 0 dry .. 1 soaked (from recent rain overall)
uniform sampler2D uSkyMap;      // equirect sky radiance, elevation squashed to the horizon

vec2 dirToSkyUv(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5);
}
vec3 skyMap(vec3 d) { return texture(uSkyMap, dirToSkyUv(d)).rgb; }

vec4 weatherAt(vec2 xz) {
  vec2 uv = (xz - uWeatherRect.xy) / uWeatherRect.zw;
  return texture(uWeather, uv);
}

float cloudShadow(vec3 p) {
  // project along the sun ray up to the cloud layer
  float dy = max(0.0, uCloudMidY - p.y);
  vec2 xz = p.xz + uSunDir.xz / max(0.08, uSunDir.y) * dy;
  vec2 uv = (xz - uWeatherRect.xy) / uWeatherRect.zw;
  float inside = 1.0 - smoothstep(0.42, 0.5, max(abs(uv.x - 0.5), abs(uv.y - 0.5)));
  float c = texture(uWeather, uv).r * inside;
  // break the coarse grid up a little so shadows have ragged edges
  c *= 0.75 + 0.5 * fbm2(xz * 0.22 + uWeatherRect.xy * 0.0);
  return exp(-c * uCloudShadowK);
}

float sunVisibility(vec3 p) {
  float t = texture(uShadow, worldToUv(p.xz)).r;
  return t * cloudShadow(p);
}

vec3 ambientLight(vec3 n) {
  return mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
}

vec3 shade(vec3 albedo, vec3 n, vec3 p, float ao, float vis) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float ndm = max(dot(n, uMoonDir), 0.0);
  vec3 direct = uSunColor * ndl * vis + uMoonColor * ndm;
  return albedo * (direct + ambientLight(n) * ao);
}
`,Fc=`
uniform sampler2D uRegion;   // r ahupuaʻa id, g moku id, b zone, a field mask (nearest)
uniform sampler2D uLines;    // distance fields: r ahupuaʻa, g moku, b trail, a outer limit
uniform sampler2D uZoneTex;  // zone colours, smoothed
uniform vec4 uOverlay;       // x boundaries, y zones, z moku tint, w trail
uniform float uHover;        // hovered ahupuaʻa id (0 none)
uniform float uFocus;        // focused ahupuaʻa id (0 none)
uniform float uFocusK;       // 0..1 how strongly the rest is dimmed
uniform vec3 uMokuColors[5];

float lineDist(float v) { return v * (255.0 / 16.0) * (WORLD / 2048.0); }

vec3 applyOverlay(vec3 col, vec2 xz, float px, float water, vec3 light) {
  vec2 uv = worldToUv(xz);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return col;
  vec4 reg = texture(uRegion, uv);
  float id = floor(reg.r * 255.0 + 0.5);
  float moku = floor(reg.g * 255.0 + 0.5);
  vec4 ln = texture(uLines, uv);
  float dA = lineDist(ln.r);
  float dM = lineDist(ln.g);
  float dT = lineDist(ln.b);
  float dO = lineDist(ln.a);
  float w = max(px * 0.35, 0.012);
  float edgeFade = smoothstep(w * 1.5, w * 1.5 + 0.35 + px, dA);
  bool hovered = id > 0.5 && abs(id - uHover) < 0.5;
  bool focused = id > 0.5 && abs(id - uFocus) < 0.5;
  // dim the other ahupuaʻa (the open sea beyond them is left alone)
  if (uFocus > 0.5 && !focused && id > 0.5) {
    float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(col, vec3(l) * 0.7, 0.55 * uFocusK);
  }
  // moku tint and zone bands
  if (id > 0.5) {
    int m = int(moku + 0.5);
    vec3 mc = uMokuColors[m];
    float tint = uOverlay.z * 0.22 + (hovered ? 0.2 : 0.0) + (focused ? 0.12 * uFocusK : 0.0);
    col = mix(col, mc * (light * 0.6 + 0.25), tint * edgeFade);
    vec3 zc = texture(uZoneTex, uv).rgb;
    col = mix(col, zc * (light * 0.55 + 0.3), uOverlay.y * 0.62 * (0.4 + 0.6 * edgeFade));
  }
  // boundary lines, with a soft glow; moku lines wider and warmer
  float a = (1.0 - smoothstep(w, w + px * 0.9, dA));
  float glow = exp(-dA / (w * 2.0 + px * 1.4)) * 0.1;
  float am = (1.0 - smoothstep(w * 1.8, w * 1.8 + px * 0.9, dM));
  vec3 lineC = vec3(1.0, 0.95, 0.84) * (light * 0.35 + 0.9);
  vec3 mokuC = vec3(1.0, 0.82, 0.45) * (light * 0.35 + 1.0);
  float vis = uOverlay.x;
  if (hovered) vis = max(vis, 0.85);
  if (focused) vis = max(vis, uFocusK);
  float pulse = focused ? 0.75 + 0.25 * sin(uTime * 2.4 - (xz.x + xz.y) * 0.08) : 1.0;
  col = mix(col, lineC * pulse, clamp((a + glow) * vis, 0.0, 1.0) * (dA < 2.7 ? 1.0 : 0.0));
  col = mix(col, mokuC, am * uOverlay.x * 0.9 * (dM < 2.7 ? 1.0 : 0.0));
  // the seaward limit of each ahupuaʻa's fishery: a fainter line
  if (water > 0.5) {
    float ao = 1.0 - smoothstep(w * 0.7, w * 0.7 + px * 1.2, dO);
    float dash = step(0.45, fract((xz.x * 0.7 + xz.y * 0.7) * 1.4));
    col = mix(col, lineC, ao * vis * 0.3 * dash * (dO < 2.7 ? 1.0 : 0.0));
  } else {
    // ala loa: the shore trail, a thin trodden line
    float at = 1.0 - smoothstep(w * 0.55, w * 0.55 + px, dT);
    col = mix(col, vec3(0.32, 0.22, 0.13) * (light * 0.6 + 0.2), at * uOverlay.w * (dT < 2.7 ? 1.0 : 0.0));
  }
  return col;
}
`,Km=`
${Ne}
${cn}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[8];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out vec2 vUv;
out float vMetres;

void main() {
  vec2 g = floor(position.xz * uGrid + 0.5); // this vertex's grid index in its node
  float cell = aNode.z / uGrid; // grid spacing, world units
  vec2 xz = aNode.xy + g * cell;
  float mt = metresAt(xz);
  float dist = distance(uCamPos, vec3(xz.x, mt * Y_PER_M, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  // Geomorph: toward the outer edge of its range a vertex between the
  // next-coarser grid's vertices blends its height onto that coarser mesh —
  // the midpoint of the parent edge it sits on, or of the parent cell's
  // diagonal (which alternates like ours) — so by the hand-over the two levels
  // are the same surface. Sliding it along the full-detail ground instead
  // makes ridges ripple as the bands sweep past.
  vec2 odd = g - 2.0 * floor(g * 0.5);
  if (k > 0.0 && odd.x + odd.y > 0.5) {
    vec2 base = aNode.xy + (g - odd) * cell;
    float hc;
    if (odd.x > 0.5 && odd.y > 0.5) {
      vec2 pc = (g - odd) * 0.5;
      if (mod(pc.x + pc.y, 2.0) > 0.5) hc = 0.5 * (metresAt(base + vec2(2.0, 0.0) * cell) + metresAt(base + vec2(0.0, 2.0) * cell));
      else hc = 0.5 * (metresAt(base) + metresAt(base + vec2(2.0) * cell));
    } else {
      hc = 0.5 * (metresAt(base) + metresAt(base + odd * 2.0 * cell));
    }
    mt = mix(mt, hc, k);
  }
  vMetres = mt;
  // The sea is drawn from the height texture; the seabed under it only needs to
  // be visible in the last few centimetres at the shoreline. Sink it below that
  // so the two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  float h = mt * Y_PER_M;
  vWorld = vec3(xz.x, h, xz.y);
  vUv = worldToUv(xz);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,Zm=`
${Ne}
${zn}
${cn}
${Nn}
${Fc}
uniform sampler2D uNormal;
uniform sampler2D uLand;  // r rain (log), g sand, b riparian, a cultivation
uniform int uDebug;
in vec3 vWorld;
in vec2 vUv;
in float vMetres;

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec4 nt = texture(uNormal, vUv);
  vec3 n = normalize(nt.xyz * 2.0 - 1.0);
  float ao = nt.a;
  vec4 land = texture(uLand, vUv);
  float rain = land.r;
  float sand = land.g;
  float rip = land.b;
  float metres = vMetres;
  float slope = 1.0 - n.y;
  vec2 xz = vWorld.xz;

  // --- vegetation by rainfall ---------------------------------------------
  float px = length(fwidth(xz)); // world units per pixel
  float nBig = fbm2(xz * 0.35);
  float nMid = fbm2(xz * 2.1 + 5.0);
  vec3 grassDry = srgb(vec3(0.70, 0.60, 0.38));
  vec3 grassGreen = srgb(vec3(0.47, 0.55, 0.28));
  vec3 shrub = srgb(vec3(0.42, 0.45, 0.25));
  vec3 mesic = srgb(vec3(0.26, 0.41, 0.17));
  vec3 wet = srgb(vec3(0.15, 0.32, 0.13));
  vec3 cloudF = srgb(vec3(0.17, 0.30, 0.18));
  vec3 soil = srgb(vec3(0.52, 0.29, 0.17));
  vec3 rock = srgb(vec3(0.33, 0.29, 0.26));
  vec3 lava = srgb(vec3(0.17, 0.16, 0.155));
  vec3 sandC = srgb(vec3(0.90, 0.84, 0.70));

  float r = rain + (nBig - 0.5) * 0.12;
  vec3 ground = mix(grassDry, grassGreen, smoothstep(0.18, 0.42, r + nMid * 0.08));
  float forest = smoothstep(0.30, 0.52, r + (nMid - 0.5) * 0.2);
  vec3 canopyC = mix(shrub, mesic, smoothstep(0.32, 0.55, r));
  canopyC = mix(canopyC, wet, smoothstep(0.55, 0.8, r));
  canopyC = mix(canopyC, cloudF, smoothstep(1150.0, 1500.0, metres));

  // tree crowns: each cell a sunlit dome, faded to an average when they'd alias
  vec3 vc = voronoi(xz * 6.0);
  float crownFade = 1.0 - smoothstep(0.02, 0.07, px);
  float dome = sqrt(max(0.0, 1.0 - vc.x * vc.x * 1.6));
  // fake per-crown normal: bulge away from the cell centre
  vec2 toC = (xz * 6.0 - (floor(xz * 6.0) + 0.5));
  float lightSide = dot(normalize(vec3(-toC.x, 0.6, -toC.y)), uSunDir) * 0.5 + 0.5;
  float crown = mix(0.84, (0.62 + 0.45 * dome) * (0.78 + 0.4 * lightSide), crownFade);
  vec3 tint = mix(vec3(0.88, 0.97, 0.86), vec3(1.12, 1.06, 0.88), vc.y);
  canopyC *= mix(vec3(1.0), tint, crownFade * 0.7) * crown;
  // ʻōhiʻa in bloom: a sprinkle of lehua red on the upper forest
  float lehua = step(0.93, hash12(floor(xz * 6.0) + 0.3)) * smoothstep(700.0, 1100.0, metres) * crownFade;
  canopyC = mix(canopyC, srgb(vec3(0.62, 0.12, 0.08)), lehua * 0.35 * smoothstep(0.0, 0.5, dome));
  // riparian strips: kukui's pale silvery green along the gulches
  canopyC = mix(canopyC, srgb(vec3(0.52, 0.60, 0.42)), rip * 0.55 * smoothstep(0.35, 0.6, r));
  // grass: no cells, just tussocky variation at a few scales
  float gN = fbm2(xz * 18.0) * 0.6 + vnoise(xz * 90.0) * 0.4 * (1.0 - smoothstep(0.004, 0.02, px));
  ground *= 0.82 + 0.36 * gN;
  vec3 col = mix(ground, canopyC, forest);

  // kula field system: low walls along the contours, rows of ʻuala mounds,
  // plots in different stages
  float field = land.a;
  if (field > 0.02) {
    float rowH = metres / 7.5;
    float plot = hash12(vec2(floor(rowH), floor(dot(xz, vec2(0.7, -0.7)) * 1.6)));
    vec3 cropC = mix(srgb(vec3(0.40, 0.48, 0.20)), srgb(vec3(0.55, 0.42, 0.25)), smoothstep(0.35, 0.75, plot));
    float mounds = (1.0 - smoothstep(0.004, 0.015, px)) * smoothstep(0.3, 0.7, vnoise(xz * 140.0));
    cropC *= 0.85 + 0.25 * mounds;
    float wallLine = 1.0 - smoothstep(0.0, 1.0, abs(fract(rowH) - 0.5) * 2.0 * 7.5 / max(fwidth(metres) * 1.5, 0.6));
    col = mix(col, cropC, field * 0.85);
    col = mix(col, srgb(vec3(0.33, 0.30, 0.27)), wallLine * field * 0.8);
  }

  // dry, bare, red-earth patches on the leeward slopes
  float bare = (1.0 - smoothstep(0.08, 0.3, r)) * smoothstep(0.55, 0.75, nMid + slope * 0.6);
  col = mix(col, soil, bare * 0.7);

  // --- steep ground: fern-hung pali on the wet side, rock on the dry ----------
  float steep = smoothstep(0.32, 0.62, slope);
  // vertical flutes: grooves running down the fall line
  vec2 fall = normalize(n.xz + 1e-4);
  float across = dot(xz, vec2(-fall.y, fall.x));
  float flute = 0.5 + 0.5 * sin(across * 34.0 + vnoise(xz * 3.0) * 6.0);
  vec3 cliffWet = mix(srgb(vec3(0.22, 0.36, 0.17)), rock, smoothstep(0.55, 0.95, flute) * 0.55);
  vec3 cliffDry = mix(soil, rock, flute * 0.6 + 0.2);
  vec3 cliff = mix(cliffDry, cliffWet, smoothstep(0.25, 0.5, r));
  col = mix(col, cliff, steep);

  // --- the coast -----------------------------------------------------------
  float beach = sand * (1.0 - smoothstep(4.0, 9.0, metres));
  col = mix(col, sandC, smoothstep(0.15, 0.6, beach));
  col = mix(col, lava, smoothstep(0.6, 0.9, slope) * (1.0 - smoothstep(0.0, 25.0, metres)) * 0.7);
  // under water: sand and reef rock, darkened as it gets wet
  float under = 1.0 - smoothstep(-0.3, 0.6, metres);
  vec3 seabed = mix(sandC * 0.85, srgb(vec3(0.42, 0.40, 0.33)), smoothstep(0.35, 0.65, fbm2(xz * 1.3)));
  col = mix(col, seabed, under);
  col *= 1.0 - 0.25 * smoothstep(1.5, 0.0, metres) * (1.0 - under);

  float vis = sunVisibility(vWorld);
  vec3 lit = shade(col, n, vWorld, ao, vis);
  vec3 lightLevel = uSunColor * max(dot(n, uSunDir), 0.0) * vis + uSkyColor;
  lit = applyOverlay(lit, xz, px, 0.0, lightLevel * 0.5);
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(rain, sand, rip);
  if (uDebug == 5) lit = vec3(vis);
  if (uDebug == 6) lit = metres > 0.0 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0) * clamp(-metres / 5.0, 0.0, 1.0) + vec3(0.0, 0.3, 0.0);
  gl_FragColor = vec4(lit, 1.0);
}
`,Pl=32,Pi=7,Ll=1600;class Jm{constructor(t,e){this.heights=t.height,this.N=_n,this.leafSize=Zt/2**(Pi-1),this.range0=22,this.buildMinMax();const n=new $n(t.height,_n,_n,Ni,pn);n.minFilter=ue,n.magFilter=ue,n.needsUpdate=!0,this.heightTex=n;const s=new $n(t.normals,_n,_n,ke,nn);s.minFilter=ui,s.magFilter=ne,s.generateMipmaps=!0,s.anisotropy=8,s.needsUpdate=!0,this.normalTex=s,this.full=this.makeGrid(Pl),this.half=this.makeGrid(Pl/2),this.morph=[];for(let r=0;r<8;r++)this.morph.push(new It);const o={...e.uniforms,uHeight:{value:n},uNormal:{value:s},uMorph:{value:this.morph},uCamPos:{value:new z},uDebug:{value:0}};this.uniforms=o,this.group=new ln;for(const r of[this.full,this.half])r.material=new ve({vertexShader:Km,fragmentShader:Zm,uniforms:{...o,uGrid:{value:r.dim}}}),r.mesh=new te(r.geometry,r.material),r.mesh.frustumCulled=!1,r.mesh.matrixAutoUpdate=!1,this.group.add(r.mesh);this._frustum=new Es,this._m=new Kt,this._box=new Mn,this.setRange(this.range0)}makeGrid(t){const e=new Uc,n=new Float32Array((t+1)*(t+1)*3);for(let a=0;a<=t;a++)for(let l=0;l<=t;l++){const c=(a*(t+1)+l)*3;n[c]=l/t,n[c+2]=a/t}const s=[];for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=a*(t+1)+l,h=c+1,f=c+t+1,u=f+1;l+a&1?s.push(c,f,h,h,f,u):s.push(c,f,u,c,u,h)}e.setIndex(s),e.setAttribute("position",new he(n,3));const o=new Float32Array(Ll*4),r=new Yn(o,4);return r.setUsage(Oi),e.setAttribute("aNode",r),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:r,count:0}}buildMinMax(){const t=this.N,e=2**(Pi-1),n=t/e;this.mm=[];let s=new Float32Array(e*e),o=new Float32Array(e*e);for(let a=0;a<e;a++)for(let l=0;l<e;l++){let c=1/0,h=-1/0;for(let f=a*n;f<=Math.min(t-1,(a+1)*n);f++)for(let u=l*n;u<=Math.min(t-1,(l+1)*n);u++){const d=this.heights[f*t+u];d<c&&(c=d),d>h&&(h=d)}s[a*e+l]=c,o[a*e+l]=h}this.mm.push({lo:s,hi:o,n:e});let r=e;for(;r>1;){const a=r/2,l=new Float32Array(a*a),c=new Float32Array(a*a);for(let h=0;h<a;h++)for(let f=0;f<a;f++){const u=2*h*r+2*f;l[h*a+f]=Math.min(s[u],s[u+1],s[u+r],s[u+r+1]),c[h*a+f]=Math.max(o[u],o[u+1],o[u+r],o[u+r+1])}s=l,o=c,r=a,this.mm.push({lo:s,hi:o,n:r})}}setRange(t){this.rangeGoal===void 0&&this.applyRange(t),this.rangeGoal=t}applyRange(t){this.range0=t,this.ranges=[];for(let e=0;e<Pi;e++)this.ranges.push(t*2**e);this.ranges[Pi-1]=1e6;for(let e=0;e<Pi;e++){const n=this.ranges[e],s=e>0?this.ranges[e-1]:0,o=s+(n-s)*.5;this.morph[e].set(o,n*.97)}}heightAt(t,e){return this.metresAt(t,e)*Nt}metresAt(t,e){const n=this.N;let s=(t+xt)/Zt*n-.5,o=(e+xt)/Zt*n-.5;s<0&&(s=0),o<0&&(o=0),s>n-1.001&&(s=n-1.001),o>n-1.001&&(o=n-1.001);const r=s|0,a=o|0,l=s-r,c=o-a,h=this.heights,f=a*n+r,u=h[f]+(h[f+1]-h[f])*l,d=h[f+n]+(h[f+n+1]-h[f+n])*l;return u+(d-u)*c}normalAt(t,e,n=new z){const s=Zt/this.N,o=this.heightAt(t+s,e)-this.heightAt(t-s,e),r=this.heightAt(t,e+s)-this.heightAt(t,e-s);return n.set(-o,2*s,-r).normalize()}update(t){Math.abs(this.rangeGoal-this.range0)>.01&&this.applyRange(this.range0+(this.rangeGoal-this.range0)*.04),this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.uniforms.uCamPos.value.copy(t.position),this.full.count=0,this.half.count=0,this.select(0,0,Pi-1);for(const e of[this.full,this.half])e.geometry.instanceCount=e.count,e.attr.needsUpdate=!0}nodeBox(t,e,n){const s=this.mm[n],o=this.leafSize*2**n,r=-xt+t*o,a=-xt+e*o,l=s.lo[e*s.n+t]*Nt,c=s.hi[e*s.n+t]*Nt;return this._box.min.set(r,l,a),this._box.max.set(r+o,c,a+o),this._box}select(t,e,n){const s=this.nodeBox(t,e,n),o=this.mm[n];if(o.hi[e*o.n+t]<-45)return!0;if(s.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(s))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let a=0;a<4;a++){const l=t*2+(a&1),c=e*2+(a>>1);if(!this.select(l,c,n-1)){const h=this.mm[n-1];if(h.hi[c*h.n+l]<-45)continue;const f=this.nodeBox(l,c,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,c,r/2,n)}}return!0}emit(t,e,n,s,o){if(t.count>=Ll)return;const r=t.count*4;t.data[r]=-xt+e*s,t.data[r+1]=-xt+n*s,t.data[r+2]=s,t.data[r+3]=o,t.count++}}const Qm=`
${Ne}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,tg=`
${Ne}
${zn}
${cn}
${Nn}
${Fc}
uniform vec3 uCamPos;
uniform vec2 uWind;        // direction the wind blows toward, scaled by strength (0..1+)
uniform vec2 uSwellDir;    // direction swell travels
uniform float uSwell;      // swell height factor
uniform vec3 uHorizonColor;
uniform vec3 uZenithColor;
uniform int uDebug;
uniform sampler2D uSea;    // r: pond mask, g: river plume, b: reef rock, a: distance to land (0..1 over 300 m)
in vec3 vWorld;

float seaDepth(vec2 xz) {
  vec2 uv = worldToUv(xz);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 3000.0;
  return -metresAt(xz);
}

// Sea-surface slope (dh/dx, dh/dz): a few long swells, plus wind chop made of
// drifting noise so the near water never turns into a regular grating.
vec2 noiseGrad(vec2 p) {
  const float e = 0.25;
  return vec2(vnoise(p + vec2(e, 0.0)) - vnoise(p - vec2(e, 0.0)), vnoise(p + vec2(0.0, e)) - vnoise(p - vec2(0.0, e))) / (2.0 * e);
}
vec2 waveSlope(vec2 p, float t, float detail) {
  vec2 d0 = normalize(uWind + vec2(1e-3));
  vec2 sw = normalize(uSwellDir + vec2(1e-3));
  vec2 grad = vec2(0.0);
  // swell
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
  // chop: rotated, drifting octaves of noise
  float a = 0.5;
  float f = 1.6;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  vec2 q = p;
  for (int i = 0; i < 5; i++) {
    float fade = 1.0 - smoothstep(0.08, 0.35, detail * f);
    grad += noiseGrad(q * f + d0 * t * (0.25 + 0.12 * float(i))) * a * 0.022 * f * fade;
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
  float dist = length(uCamPos - vWorld);
  float px = length(fwidth(xz)); // world size of a pixel
  vec4 sea = texture(uSea, worldToUv(xz));

  float calm = mix(1.0, 0.18, sea.r); // fishponds are glassy
  vec2 g = waveSlope(xz, uTime, px) * (0.55 + 0.6 * length(uWind)) * calm;
  // shoaling: steeper chop over the reef flat
  g *= 1.0 + 0.6 * (1.0 - smoothstep(0.5, 6.0, depth));
  vec3 N = normalize(vec3(-g.x, 1.0, -g.y));

  // --- what's under the surface ------------------------------------------
  float fb = fbm2(xz * 1.7);
  vec3 sandC = vec3(0.80, 0.72, 0.55);
  vec3 reefC = mix(vec3(0.30, 0.27, 0.20), vec3(0.42, 0.30, 0.34), fbm2(xz * 4.0 + 7.0));
  float reef = smoothstep(0.45, 0.62, fb) * (1.0 - smoothstep(4.0, 14.0, depth)) + sea.b * 0.6;
  vec3 bed = mix(sandC, reefC, clamp(reef, 0.0, 1.0));
  bed = mix(bed, vec3(0.20, 0.24, 0.16), sea.r * 0.6); // algae-rich pond floor
  // light reaching the bed: through the water twice
  vec3 absorb = vec3(0.46, 0.105, 0.055);
  float vis = sunVisibility(vec3(vWorld.x, 0.0, vWorld.z));
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 0.8 + uMoonColor * 0.3;
  // caustics in the shallows
  vec2 cp = xz * 70.0;
  float ca = voronoi(cp + vec2(uTime * 0.9, uTime * 0.6)).x;
  float cb = voronoi(cp * 1.31 - vec2(uTime * 0.7, -uTime * 0.5)).x;
  float caust = pow(1.0 - min(ca, cb), 6.0) * 1.6 * (1.0 - smoothstep(1.0, 8.0, depth)) * (1.0 - smoothstep(0.003, 0.012, px));
  vec3 under = bed * light * (1.0 + caust * vis) * exp(-absorb * depth * 2.0);
  vec3 amb = uSkyColor * 1.6 + uSunColor * max(uSunDir.y, 0.0) * vis;
  vec3 deepC = vec3(0.004, 0.030, 0.075) * amb;
  vec3 turq = vec3(0.03, 0.20, 0.21) * amb;
  float scatter = 1.0 - exp(-depth * 0.3);
  vec3 body = mix(turq, deepC, smoothstep(5.0, 45.0, depth));
  vec3 water = under + body * scatter;
  // fishponds: brackish, green and murky with algae
  water = mix(water, vec3(0.035, 0.085, 0.045) * amb * 1.2, sea.r * 0.8);
  // a brown plume off the stream mouths after rain
  water = mix(water, vec3(0.16, 0.12, 0.07) * light, sea.g * 0.75);

  // --- the surface ---------------------------------------------------------
  float cosT = max(dot(N, V), 0.0);
  float F = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  vec3 refl = skyMap(R);
  vec3 H = normalize(uSunDir + V);
  float spec = pow(max(dot(N, H), 0.0), 900.0) * 60.0 + pow(max(dot(N, H), 0.0), 90.0) * 0.6;
  vec3 col = mix(water, refl, F) + uSunColor * spec * vis * step(0.0, uSunDir.y);

  // --- foam ------------------------------------------------------------------
  // shoreline swash
  float shore = (1.0 - smoothstep(0.0, 0.25, sea.a)) * (1.0 - smoothstep(0.1, 1.2, depth));
  float swash = 0.5 + 0.5 * sin(depth * 9.0 - uTime * 1.6 + fbm2(xz * 3.0) * 4.0);
  // breakers on the reef crest: shallow water with deep water just seaward
  float e = 0.6;
  float dX = seaDepth(xz + vec2(e, 0.0)) - seaDepth(xz - vec2(e, 0.0));
  float dZ = seaDepth(xz + vec2(0.0, e)) - seaDepth(xz - vec2(0.0, e));
  float drop = length(vec2(dX, dZ)) / (2.0 * e);
  float crest = smoothstep(4.0, 14.0, drop) * (1.0 - smoothstep(0.6, 3.5, depth)) * (1.0 - sea.r);
  vec2 sd = normalize(uSwellDir + 1e-4);
  float sets = 0.5 + 0.5 * sin(dot(xz, sd) * 2.2 - uTime * 0.9 + fbm2(xz * 0.8) * 5.0);
  float breakers = crest * (0.35 + 0.65 * smoothstep(0.4, 0.9, sets)) * (0.6 + uSwell);
  float foamTex = smoothstep(0.35, 0.75, fbm2(xz * 9.0 + vec2(uTime * 0.3, 0.0)));
  // whitecaps when the trades are up
  float caps = smoothstep(0.78, 0.92, fbm2(xz * 0.9 + uWind * uTime * 0.06)) * smoothstep(0.55, 1.1, length(uWind)) * smoothstep(20.0, 60.0, depth);
  float foam = max(max(shore * swash * 0.9, breakers), caps * 0.5) * mix(1.0, foamTex, 0.5);
  vec3 foamC = vec3(0.92) * (uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor * 1.4);
  col = mix(col, foamC, clamp(foam, 0.0, 1.0));

  col = applyOverlay(col, xz, px, 1.0, (uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor) * 0.5);

  // soft meeting with the sand
  float alpha = smoothstep(-0.02, 0.35, depth);
  if (uDebug == 1) { col = vec3(depth / 10.0, fract(depth), 0.0); alpha = 1.0; }
  if (uDebug == 2) { col = sea.rgb + vec3(0.0, 0.0, sea.a); alpha = 1.0; }
  if (uDebug == 3) { col = water; }
  gl_FragColor = vec4(col, alpha);
}
`;function eg(i,t,e,n){const s=[0,0,0];for(let a=0;a<=n;a++){const l=i*Math.pow(t/i,a/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;s.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const o=[];for(let a=0;a<e;a++)o.push(0,1+(a+1)%e,1+a);for(let a=0;a<n;a++)for(let l=0;l<e;l++){const c=1+a*e+l,h=1+a*e+(l+1)%e,f=c+e,u=h+e;o.push(c,h,f,h,u,f)}const r=new Re;return r.setAttribute("position",new re(s,3)),r.setIndex(o),r}class ng{constructor(t,e,n){this.uniforms={...t.uniforms,uHeight:{value:e},uSea:{value:n},uCamPos:{value:new z},uWind:{value:new It(-.8,.45)},uSwellDir:{value:new It(-.6,.8)},uSwell:{value:.6},uDebug:{value:0},uHorizonColor:{value:new Pt},uZenithColor:{value:new Pt}};const s=eg(1.5,8e3,96,72);this.material=new ve({vertexShader:Qm,fragmentShader:tg,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new te(s,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const ig=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],sg={ra:12.857,dec:27.13};function As(i){let t=i>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function An(i,t,e=0){let n=Math.imul(i|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const og=.5*(Math.sqrt(3)-1),as=(3-Math.sqrt(3))/6,Li=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1,.7071,.7071,-.7071,.7071,.7071,-.7071,-.7071,-.7071]);function Dl(i){const t=As(i),e=new Uint8Array(256);for(let o=0;o<256;o++)e[o]=o;for(let o=255;o>0;o--){const r=Math.floor(t()*(o+1)),a=e[o];e[o]=e[r],e[r]=a}const n=new Uint8Array(512),s=new Uint8Array(512);for(let o=0;o<512;o++)n[o]=e[o&255],s[o]=n[o]%12;return function(r,a){const l=(r+a)*og,c=Math.floor(r+l),h=Math.floor(a+l),f=(c+h)*as,u=r-(c-f),d=a-(h-f);let g,v;u>d?(g=1,v=0):(g=0,v=1);const m=u-g+as,p=d-v+as,_=u-1+2*as,x=d-1+2*as,y=c&255,w=h&255;let M=0,E=.5-u*u-d*d;if(E>0){const b=s[y+n[w]]*2;E*=E,M+=E*E*(Li[b]*u+Li[b+1]*d)}let R=.5-m*m-p*p;if(R>0){const b=s[y+g+n[w+v]]*2;R*=R,M+=R*R*(Li[b]*m+Li[b+1]*p)}let S=.5-_*_-x*x;if(S>0){const b=s[y+1+n[w+1]]*2;S*=S,M+=S*S*(Li[b]*_+Li[b+1]*x)}return 70*M}}function ag(i,t,e,n,s=.5){let o=0,r=1,a=0,l=1;for(let c=0;c<n;c++)o+=r*i(t*l,e*l),a+=r,r*=s,l*=2.03;return o/a}const lo=(i,t,e)=>i<t?t:i>e?e:i,Ul=(i,t,e)=>{const n=lo((e-i)/(t-i),0,1);return n*n*(3-2*n)},rg=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Ao(){const i=new Re;return i.setAttribute("position",new he(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),i}const lg=`
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
`;class cg{constructor(t){this.renderer=t,this.size=new It;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?In:nn,this.sceneRT=new sn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new Ha(1,1,Ln),this.quad=new te(Ao(),new ve({vertexShader:rg,fragmentShader:lg,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new It},uInvProj:{value:new Kt},uCamWorld:{value:new Kt},uCamPos:{value:new z},uSunDir:{value:new z(0,1,0)},uSunColor:{value:new Pt},uFogColor:{value:new Pt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Yi,this.quadScene.add(this.quad),this.quadCam=new Ts(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var s;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(s=this.atmosphere)==null||s.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const s=this.uniforms;s.uInvProj.value.copy(e.projectionMatrixInverse),s.uCamWorld.value.copy(e.matrixWorld),s.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),s.uClouds.value=this.atmosphere.texture,s.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),s.uHasClouds.value=1):s.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Rn=Math.PI/180,us=21*Rn,io=29.530588,hg=224.1,ug=["Hilo","Hoaka","Kūkahi","Kūlua","Kūkolu","Kūpau","ʻOlekūkahi","ʻOlekūlua","ʻOlekūkolu","ʻOlepau","Huna","Mōhalu","Hua","Akua","Hoku","Māhealani","Kulu","Lāʻaukūkahi","Lāʻaukūlua","Lāʻaupau","ʻOlekūkahi","ʻOlekūlua","ʻOlepau","Kāloakūkahi","Kāloakūlua","Kāloapau","Kāne","Lono","Mauli","Muku"];function Fl(i,t,e){const n=Math.cos(i),s=-n*Math.sin(t),o=Math.sin(i)*Math.cos(us)-n*Math.cos(t)*Math.sin(us),r=Math.sin(i)*Math.sin(us)+n*Math.cos(t)*Math.cos(us);return e.set(s,r,-o)}function Ic(i,t,e={}){const n=23.44*Rn*Math.sin(2*Math.PI*(284+i)/365),s=(i-80)/365.25*360*Rn,r=((i-80)/365.25*24%24+24)%24+t-12;e.sun=Fl(n,(t-12)*15*Rn,e.sun||new z);const a=i+t/24,l=((a-hg)%io+io)%io,c=l/io,h=s+c*2*Math.PI,f=Math.asin(Math.sin(23.44*Rn)*Math.sin(h)+Math.sin(5.1*Rn)*Math.sin(a*.23)),u=h/(2*Math.PI)*24;return e.moon=Fl(f,(r-u)*15*Rn,e.moon||new z),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=r,e.decl=n,e}const kc=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],zc=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],fg=1.6110731556870734,dg=1.5;function pg(i){return i=Math.max(-1,Math.min(1,i)),1e3*Math.max(0,1-Math.exp(-((fg-Math.acos(i))/dg)))}function la(i,t,e,n=[0,0,0]){const s=pg(t.y),o=.2*e.turbidity*1e-17,r=Math.acos(Math.max(0,i.y)),a=1/(Math.cos(r)+.15*Math.pow(93.885-r*180/Math.PI,-1.253)),l=8400*a,c=1250*a,h=i.x*t.x+i.y*t.y+i.z*t.z,f=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),u=e.mieDirectionalG,d=u*u,g=1/(4*Math.PI)*((1-d)/Math.pow(1-2*u*h+d,1.5)),v=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let m=0;m<3;m++){const p=kc[m]*e.rayleigh,_=.434*o*zc[m]*e.mieCoefficient,x=Math.exp(-(p*l+_*c)),y=(p*f+_*g)/(p+_);let w=Math.pow(s*y*(1-x),1.5);w*=1+(Math.pow(s*y*x,.5)-1)*v;const M=.1*x,E=(w+M)*.04+[0,3e-4,75e-5][m];n[m]=Math.pow(E,1/2.4)}return n}function mg(i,t,e=[0,0,0]){const n=Math.acos(Math.max(0,i.y)),s=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let r=0;r<3;r++){const a=kc[r]*t.rayleigh,l=.434*o*zc[r]*t.mieCoefficient;e[r]=Math.exp(-(a*8400*s+l*1250*s))}return e}const gg=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,Nc=`
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
`,vg=`
${Nc}
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
`,xg=`
${Nc}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,_g=`
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
`,Mg=`
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
`;class yg{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=sg,e=(c,h)=>{const f=c/24*2*Math.PI,u=h*Rn;return new z(Math.cos(u)*Math.cos(f),Math.cos(u)*Math.sin(f),Math.sin(u))};this.uniforms={uSun:{value:new z(0,1,0)},uMoon:{value:new z(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:us},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new te(new Wa(1,5),new ve({vertexShader:gg,fragmentShader:vg,uniforms:this.uniforms,side:Ve,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const s=As(4242),o=ig.map(([c,h,f])=>[c/24*2*Math.PI,h*Rn,f]);for(let c=0;c<2600;c++){const h=s()*2-1;o.push([s()*2*Math.PI,Math.asin(h),3.4+Math.pow(s(),.55)*2.8])}const r=new Float32Array(o.length*3);o.forEach((c,h)=>r.set(c,h*3));const a=new Re;a.setAttribute("aStar",new he(r,3)),a.setAttribute("position",new he(new Float32Array(o.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Rc(a,new ve({vertexShader:_g,fragmentShader:Mg,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:ma})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new ln,this.group.add(n,this.stars),this.mapRT=new sn(256,128,{type:In,depthBuffer:!1}),this.mapRT.texture.wrapS=hi,this.mapScene=new Yi;const l=new te(Ao(),new ve({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:xg,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new Ts(-1,1,1,-1,0,1),this.astro={},this._v=new z}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,s){const o=Ic(t,e,this.astro),r=o.sun,a=this.uniforms;a.uSun.value.copy(r),a.uMoon.value.copy(o.moon),a.uPhase.value=o.phase,a.uIllum.value=o.illum,a.uLst.value=o.lst/24*2*Math.PI;const l=vn.smoothstep(-r.y,-.02,.2);a.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,f=la(h.set(0,1,0),r,c),u=[0,0,0];for(let M=0;M<8;M++){const E=M/8*Math.PI*2,R=la(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),r,c);for(let S=0;S<3;S++)u[S]+=R[S]/8}const d=la(h.set(r.x,.05,r.z).normalize(),r,c),g=mg(r,c),v=vn.smoothstep(r.y,-.04,.06),m=3.2;s.sunColor.setRGB(g[0]*m*v,g[1]*m*v,g[2]*m*v);const p=[.0035,.005,.011],x=vn.smoothstep(o.moon.y,-.02,.1)*o.illum*l;s.skyColor.setRGB(f[0]*.55+u[0]*.45+p[0]+.012*x,f[1]*.55+u[1]*.45+p[1]+.016*x,f[2]*.55+u[2]*.45+p[2]+.024*x);const y=s.skyColor.r*.2126+s.skyColor.g*.7152+s.skyColor.b*.0722;s.skyColor.lerp(new Pt(y,y,y),.35),s.zenith.setRGB(f[0],f[1],f[2]),s.horizon.setRGB(u[0]+p[0],u[1]+p[1],u[2]+p[2]),s.sunHorizon.setRGB(d[0],d[1],d[2]);const w=.11;return s.groundColor.setRGB((s.sunColor.r*Math.max(0,r.y)+s.skyColor.r)*w*1.1,(s.sunColor.g*Math.max(0,r.y)+s.skyColor.g)*w,(s.sunColor.b*Math.max(0,r.y)+s.skyColor.b)*w*.8),s.moonColor.setRGB(.05*x,.06*x,.085*x),s.moonDir.copy(o.moon),s.sunDir.copy(r),s.night=l,o}}const ca=Math.PI*2,wg=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,Il=i=>((i+Math.PI)%ca+ca)%ca-Math.PI;class Sg{constructor(t,e,n){this.camera=t,this.dom=e,this.terrain=n,this.state={target:new z(0,0,20),distance:420,yaw:.35,pitch:.62,lift:0},this.goal={target:this.state.target.clone(),distance:420,yaw:.35,pitch:.62,lift:0},this.flight=null,this.floor=0,this.minDistance=.5,this.maxDistance=900,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new $m,this._v=new z,this.bind()}bind(){const t=this.dom,e=new Map;let n=null,s=null,o=null;t.addEventListener("contextmenu",a=>a.preventDefault()),t.addEventListener("pointerdown",a=>{this.enabled&&(t.setPointerCapture(a.pointerId),e.set(a.pointerId,{x:a.clientX,y:a.clientY}),e.size===1?(n=a.button===2||a.shiftKey||a.ctrlKey||a.metaKey?"pan":"orbit",s={x:a.clientX,y:a.clientY},this.panAnchor=n==="pan"?this.pickGround(a.clientX,a.clientY):null):e.size===2&&(n="pinch",o=this.pinchState(e)),this.touch())}),t.addEventListener("pointermove",a=>{if(e.has(a.pointerId)){if(e.set(a.pointerId,{x:a.clientX,y:a.clientY}),n==="orbit"&&s){const l=a.clientX-s.x,c=a.clientY-s.y;this.goal.yaw-=l*.005,this.goal.pitch=vn.clamp(this.goal.pitch+c*.004,.06,1.52),s={x:a.clientX,y:a.clientY},this.touch()}else if(n==="pan"&&s)this.panBy(a.clientX-s.x,a.clientY-s.y),s={x:a.clientX,y:a.clientY},this.touch();else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=o.dist/Math.max(20,l.dist);this.goal.distance=vn.clamp(this.goal.distance*c,this.minDistance,this.maxDistance),this.panBy(l.cx-o.cx,l.cy-o.cy),this.goal.yaw-=Il(l.angle-o.angle),this.goal.pitch=vn.clamp(this.goal.pitch+(l.cy-o.cy)*0,.06,1.52),o=l,this.touch()}}});const r=a=>{if(e.delete(a.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="orbit",s={...l}}};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("wheel",a=>{if(!this.enabled)return;a.preventDefault();const l=Math.exp(Math.sign(a.deltaY)*Math.min(Math.abs(a.deltaY),120)*.0018);this.zoomAt(a.clientX,a.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",a=>{const l=this.pickGround(a.clientX,a.clientY);l&&this.flyTo({target:l,distance:Math.max(6,this.goal.distance*.45)},1.6)}),addEventListener("keydown",a=>{var h,f;if(!this.enabled||(f=(h=a.target).closest)!=null&&f.call(h,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]}[a.code];if(c&&!a.altKey){const u=Math.sin(this.goal.yaw),d=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*d+c[1]*u)*l,this.goal.target.z+=(-c[0]*u+c[1]*d)*l,this.touch()}a.code==="KeyQ"&&(this.goal.yaw+=.12),a.code==="KeyE"&&(this.goal.yaw-=.12),(a.code==="Equal"||a.code==="NumpadAdd")&&(this.goal.distance*=.85),(a.code==="Minus"||a.code==="NumpadSubtract")&&(this.goal.distance/=.85)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,s=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,o=Math.sin(this.goal.yaw),r=Math.cos(this.goal.yaw),a=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*r-e*o*a)*s,this.goal.target.z+=(t*o-e*r*a)*s}zoomAt(t,e,n){const s=this.pickGround(t,e),o=this.goal.distance,r=vn.clamp(o*n,this.minDistance,this.maxDistance);if(s&&r<o){const a=1-r/o;this.goal.target.lerp(s,a)}this.goal.distance=r}pickGround(t,e){const n=this.dom.getBoundingClientRect(),s=new It((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(s,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e,n=3e3){const s=(l,c)=>Math.max(0,this.terrain.heightAt(l,c));let o=0,r=0,a=this._v;for(let l=0;l<400&&o<n;l++){a.copy(t).addScaledVector(e,o);const c=a.y-s(a.x,a.z);if(c<0){let h=r,f=o;for(let u=0;u<20;u++){const d=(h+f)/2;a.copy(t).addScaledVector(e,d),a.y-s(a.x,a.z)<0?f=d:h=d}return a.clone()}r=o,o+=Math.max(.03,c*.45,o*.002)}return null}flyTo(t,e=3,n={}){const s={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},o={target:t.target?t.target.clone():s.target.clone(),distance:t.distance??s.distance,yaw:t.yaw??s.yaw,pitch:t.pitch??s.pitch,lift:t.lift??0};o.yaw=s.yaw+Il(o.yaw-s.yaw);const r=s.target.distanceTo(o.target),a=n.hop??Math.max(0,r*.9-Math.max(s.distance,o.distance)*.6);this.flight={from:s,dest:o,t:0,duration:e,hop:a,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}update(t){var o;const e=this.goal;if(this.flight){const r=this.flight;r.t=Math.min(1,r.t+t/r.duration);const a=wg(r.t);e.target.lerpVectors(r.from.target,r.dest.target,a);const l=Math.log(r.from.distance)*(1-a)+Math.log(r.dest.distance)*a;e.distance=Math.exp(l)+r.hop*Math.sin(Math.PI*a),e.yaw=r.from.yaw+(r.dest.yaw-r.from.yaw)*a,e.pitch=r.from.pitch+(r.dest.pitch-r.from.pitch)*a+.25*Math.sin(Math.PI*a)*Math.min(1,r.hop/80),e.lift=r.from.lift+(r.dest.lift-r.from.lift)*a,r.t>=1&&(this.flight=null,(o=r.onDone)==null||o.call(r))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);if(e.target.x=vn.clamp(e.target.x,-xt*1.3,xt*1.3),e.target.z=vn.clamp(e.target.z,-xt*1.3,xt*1.3),!this.flight){const r=Math.max(0,this.terrain.heightAt(e.target.x,e.target.z));e.target.y+=(r-e.target.y)*(1-Math.exp(-t*6))}const n=this.state,s=this.flight?1:1-Math.exp(-t*7);n.target.lerp(e.target,s),n.distance+=(e.distance-n.distance)*s,n.yaw+=(e.yaw-n.yaw)*s,n.pitch+=(e.pitch-n.pitch)*s,n.lift+=(e.lift-n.lift)*s,this.apply(t)}groundAhead(t,e,n){const s=this.terrain;let o=s.heightAt(t,e);const r=this._prevXZ;if(r&&n>0){const a=(t-r.x)/n,l=(e-r.y)/n,c=Math.hypot(a,l),h=Math.min(2,c*.3);h>.005&&(o=Math.max(o,s.heightAt(t+a/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new It).set(t,e),Math.max(0,o)}apply(t=0){const e=this.state,n=this.camera,s=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*s*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*s*Math.cos(e.yaw));const o=.12+e.distance*.03,r=this.groundAhead(n.position.x,n.position.z,t),a=Math.max(0,r+o-n.position.y);t<=0?this.floor=a:this.floor+=(a-this.floor)*(1-Math.exp(-t*(a>this.floor?9:2.5))),n.position.y+=this.floor;const l=Math.max(0,this.terrain.heightAt(n.position.x,n.position.z));n.position.y=Math.max(n.position.y,l+Math.min(.04,o*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=vn.clamp(Math.min(c,e.distance)*.12,.02,4),n.far=9e3,n.updateProjectionMatrix()}}const bg=`
${Ne}
${cn}
uniform vec3 uSunDir;
in vec2 vUv;
void main() {
  vec2 xz = (vUv - 0.5) * WORLD;
  float h0 = max(metresAt(xz), 0.0) * Y_PER_M + 0.02;
  vec2 d = normalize(uSunDir.xz + 1e-6);
  float rise = uSunDir.y / max(length(uSunDir.xz), 1e-4); // world y per unit
  float lit = 1.0;
  float t = 0.12;
  for (int i = 0; i < 56; i++) {
    vec2 p = xz + d * t;
    float ray = h0 + t * rise;
    float g = max(metresAt(p), 0.0) * Y_PER_M;
    lit = min(lit, 10.0 * (ray - g) / t + 0.5);
    if (lit <= 0.0 || ray > 26.0) break;
    t *= 1.085;
    t += 0.06;
  }
  float s = clamp(lit, 0.0, 1.0);
  s = s * s * (3.0 - 2.0 * s);
  // below the horizon nothing is sunlit
  s *= smoothstep(-0.02, 0.04, uSunDir.y);
  gl_FragColor = vec4(s, s, s, 1.0);
}
`;class Eg{constructor(t,e=1024){this.rt=new sn(e,e,{type:nn,depthBuffer:!1,minFilter:ne,magFilter:ne}),this.material=new ve({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:bg,uniforms:{uHeight:{value:t},uSunDir:{value:new z(0,1,0)}},depthTest:!1,depthWrite:!1}),this.scene=new Yi;const n=new te(Ao(),this.material);n.frustumCulled=!1,this.scene.add(n),this.cam=new Ts(-1,1,1,-1,0,1),this.last=new z(0,-2,0),this.size=e,this.strips=4,this.strip=-1}get texture(){return this.rt.texture}update(t,e,n=!1){if(n||!this.drawn){this.drawn=!0,this.draw(t,e,-1);return}if(this.strip<0){if(e.angleTo(this.last)<.004)return;this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e),this.strip=0}this.draw(t,null,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e,n){e&&(this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e));const s=this.rt;if(n>=0){const r=this.size/this.strips;s.scissor.set(0,n*r,this.size,r),s.scissorTest=!0}else s.scissorTest=!1;const o=t.getRenderTarget();t.setRenderTarget(s),t.render(this.scene,this.cam),t.setRenderTarget(o),s.scissorTest=!1}}const Tg=`
${Ne}
precision highp sampler3D;
uniform sampler2D uDepth;
uniform sampler2D uWeather;
uniform sampler3D uShape;
uniform sampler3D uDetail;
uniform vec4 uWeatherRect;
uniform mat4 uInvProj;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uFogColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform vec2 uWind;        // accumulated wind travel (world)
uniform vec2 uWindDir;
uniform float uTime;
uniform float uBase;       // world y of the cloud base
uniform float uTop;        // world y of the inversion
uniform float uDensity;
uniform float uFarCover;   // trade cumulus beyond the simulated patch
uniform float uOvercast;   // 0..1, a stratiform deck over everything (Kona storms)
uniform float uRainbow;    // 1 = rainbows on; also a debug gain
uniform float uSteps;
uniform float uLightSteps;
uniform float uFlash;      // lightning
uniform vec3 uFlashPos;
uniform float uFrame;      // frame counter, steps the sample offsets
uniform sampler2D uBowLUT;  // raindrop light near the bows (x = degrees from antisolar / 64; rows: showers, light rain, drizzle)
uniform sampler2D uShadow;  // terrain shadow from the sun, top-down
${cn}
in vec2 vUv;
// the transmittance-weighted mean distance of what the ray met, for reprojection
layout(location = 1) out highp vec4 cloudDepth;

// the bow table is drop optics (light relative to isotropic scattering); this
// one constant sets how strongly the app's rain veil, which already stands in
// for multiple scattering, carries it
#define BOW_GAIN 0.3
// how far (world y) rain shows up inside the cloud above its base
#define RAIN_REACH 3.2

// interleaved gradient noise: neighbouring pixels get well spread offsets
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
  float b = fract(sin(dot(i + vec2(1, 0), vec2(127.1, 311.7))) * 43758.5453);
  float c = fract(sin(dot(i + vec2(0, 1), vec2(127.1, 311.7))) * 43758.5453);
  float d = fract(sin(dot(i + vec2(1, 1), vec2(127.1, 311.7))) * 43758.5453);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// cover, rain, wetness, convective — the simulated patch, fading into
// procedural trade cumulus beyond it
vec4 weather(vec2 xz) {
  vec2 uv = (xz - uWeatherRect.xy) / uWeatherRect.zw;
  vec4 w = texture(uWeather, uv);
  float edge = smoothstep(0.38, 0.49, max(abs(uv.x - 0.5), abs(uv.y - 0.5)));
  if (edge > 0.0) {
    // trade cumulus line up in streets along the wind
    vec2 wd = normalize(uWindDir + vec2(1e-4));
    vec2 r = xz - uWind;
    vec2 q = vec2(dot(r, wd) / 70.0, dot(r, vec2(-wd.y, wd.x)) / 26.0);
    float n = vn(q) * 0.6 + vn(q * 2.1 + 7.0) * 0.3 + vn(q * 4.3) * 0.1;
    float far = smoothstep(1.0 - uFarCover, 1.0, n) * 0.85;
    w = mix(w, vec4(far, far > 0.55 ? (far - 0.55) * 0.5 : 0.0, 0.0, 0.0), edge);
  }
  return w;
}

float remap(float v, float a, float b, float c, float d) { return c + (v - a) / (b - a) * (d - c); }

vec4 weatherAll(vec2 xz) {
  vec4 w = weather(xz);
  // a storm sky: grey deck everywhere, rain wherever it's thickest
  // torn into rafts and gaps, so the land still shows between bands of rain
  float raft = vn((xz - uWind) / 23.0) * 0.65 + vn((xz - uWind) / 7.0) * 0.35;
  w.r = max(w.r, uOvercast * (0.2 + 0.6 * smoothstep(0.35, 0.7, raft)));
  w.g = max(w.g, uOvercast * smoothstep(0.62, 0.9, w.r) * 0.6);
  return w;
}

// A raining cell's base hangs a little lower: the rain-cooled air under a
// shower condenses sooner.
float cellBase(vec4 w) { return uBase * (1.0 - 0.06 * w.g); }

// How far toward the inversion a cell grows. Trade cumulus mostly stay
// shallow, well under the lid; thick cover (the cap on the mountain, a
// shower) piles up toward it, and strong convection pushes single towers
// higher.
float cellTop(float b0, float cover, float conv, float lump) {
  return b0 + (uTop - b0) * clamp(0.15 + cover * 0.6 + conv * 0.25 + (lump - 0.5) * 0.5, 0.12, 1.0);
}

// density at p; full adds the fine erosion noise
float density(vec3 p, vec4 w, bool full) {
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  // the noise rides the wind, as the cells in the grid do
  vec3 q = p - vec3(uWind.x, 0.0, uWind.y);
  // low-frequency noise sets how tall each cell grows, so tops are lumpy
  float lump = texture(uShape, q * vec3(1.0 / 140.0, 1.0 / 90.0, 1.0 / 140.0) + 0.37).r;
  float b0 = cellBase(w);
  float hf = (p.y - b0) / max(cellTop(b0, cover, w.a, lump) - b0, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  // in rain the underside is a fuller, flatter ceiling instead of separate turrets
  float sag = w.g * (1.0 - smoothstep(0.0, 0.35, hf));
  // flat base, rounded shoulders
  float prof = smoothstep(0.0, mix(0.12, 0.06, w.g), hf) * (1.0 - smoothstep(0.38, 1.0, hf));
  float n = texture(uShape, q * vec3(1.0 / 46.0, 1.0 / 34.0, 1.0 / 46.0) + vec3(0.0, uTime * 0.0006, 0.0)).r;
  float base = clamp(remap(n, 0.25 - sag * 0.3, 1.0, 0.0, 1.0), 0.0, 1.0) * prof;
  float d = remap(base, 1.0 - cover, 1.0, 0.0, 1.0) * mix(0.55, 1.0, cover);
  d = clamp(d, 0.0, 1.0);
  if (full && d > 0.0) {
    float dn = texture(uDetail, q * (1.0 / 9.0) + vec3(0.0, uTime * 0.004, 0.0)).r;
    // wispy at the base, billowy higher up
    float er = mix(dn, 1.0 - dn, clamp(hf * 4.0, 0.0, 1.0)) * 0.32 * (1.0 - 0.6 * sag);
    d = clamp(remap(d, er, 1.0, 0.0, 1.0), 0.0, 1.0);
  }
  return d * uDensity * 1.6;
}

// cheap density for the light march: coverage and the base shape only
float densityLight(vec3 p) {
  vec4 w = weatherAll(p.xz);
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  float b0 = cellBase(w);
  float hf = (p.y - b0) / max(cellTop(b0, cover, w.a, 0.5) - b0, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  float prof = smoothstep(0.0, mix(0.12, 0.06, w.g), hf) * (1.0 - smoothstep(0.38, 1.0, hf));
  vec3 q = p - vec3(uWind.x, 0.0, uWind.y);
  float n = texture(uShape, q * vec3(1.0 / 46.0, 1.0 / 34.0, 1.0 / 46.0)).r;
  float d = remap(remap(n, 0.25, 1.0, 0.0, 1.0) * prof, 1.0 - cover, 1.0, 0.0, 1.0) * mix(0.55, 1.0, cover);
  return clamp(d, 0.0, 1.0) * uDensity * 1.6;
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5);
}

// Does sunlight reach this drop? Cloud: where its sun ray crosses the base and
// a third of the way up. Land: follow the same ray away from the sun down to
// the ground; that spot shares the ray and the air between is open, so the
// terrain shadow map there answers for the drop. Two passes find the ground on
// slopes; the nearest height texel is plenty for that.
float groundY(vec2 xz) {
  ivec2 i = clamp(ivec2(worldToUv(xz) * HRES), ivec2(0), ivec2(int(HRES) - 1));
  return max(texelFetch(uHeight, i, 0).r, 0.0) * Y_PER_M;
}
float terrainLit(vec3 p, vec2 run) {
  vec2 g = p.xz - run * max(p.y - groundY(p.xz), 0.0);
  g = p.xz - run * max(p.y - groundY(g), 0.0);
  vec2 uv = worldToUv(g);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  return texture(uShadow, uv).r;
}
// cloud cover where a sun ray crosses the layer: the simulated patch alone
// (the sun rays from rain in view seldom leave it), with a storm deck as a
// flat floor
float coverAt(vec2 xz) {
  return max(texture(uWeather, (xz - uWeatherRect.xy) / uWeatherRect.zw).r, uOvercast * 0.7);
}
float sunlitRain(vec3 p, vec2 run) {
  float c0 = coverAt(p.xz + run * max(uBase - p.y, 0.0));
  float c1 = coverAt(p.xz + run * max(mix(uBase, uTop, 0.35) - p.y, 0.0));
  return terrainLit(p, run) * exp(-2.6 * (c0 + c1));
}

void main() {
  float depth = texture(uDepth, vUv).r;
  vec4 ndc = vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  vec4 view = uInvProj * ndc;
  view /= view.w;
  vec3 world = (uCamWorld * vec4(view.xyz, 1.0)).xyz;
  vec3 ray = world - uCamPos;
  float sceneDist = depth < 1.0 ? length(ray) : 1e9;
  vec3 rd = normalize(ray);
  cloudDepth = vec4(min(sceneDist, 2000.0));

  float yHi = uTop + 0.5;
  float yLo = 0.0;
  // slab intersection
  float t0, t1;
  if (abs(rd.y) < 1e-5) {
    if (uCamPos.y < yLo || uCamPos.y > yHi) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    t0 = 0.0; t1 = 2000.0;
  } else {
    float ta = (yLo - uCamPos.y) / rd.y;
    float tb = (yHi - uCamPos.y) / rd.y;
    t0 = max(0.0, min(ta, tb));
    t1 = max(ta, tb);
  }
  t1 = min(t1, min(sceneDist, 1400.0));
  if (t1 <= t0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  // a different offset every frame (a golden-ratio walk from each pixel's own
  // start), so the history averages over them instead of the eye seeing one
  float jitter = fract(ign(gl_FragCoord.xy) + uFrame * 0.618034);
  float jitterL = fract(ign(gl_FragCoord.yx + 23.0) + uFrame * 0.754878);
  vec3 L = vec3(0.0);
  float T = 1.0;
  float zSum = 0.0;
  float zW = 0.0;
  float cosS = dot(rd, uSunDir);
  float phase = mix(hg(cosS, 0.62), hg(cosS, -0.22), 0.3) * 0.75 + 0.25;
  float antiDeg = degrees(acos(clamp(dot(rd, -uSunDir), -1.0, 1.0)));
  // the drops' light toward this pixel, for big shower drops, light rain and
  // drizzle; past 63° there is nothing left to add
  float bowOn = uRainbow * BOW_GAIN * smoothstep(0.0, 0.05, uSunDir.y) * step(antiDeg, 63.0);
  vec3 bowShower = vec3(0.0), bowLight = vec3(0.0), bowDrizzle = vec3(0.0);
  if (bowOn > 0.0) {
    float u = antiDeg / 64.0;
    bowShower = textureLod(uBowLUT, vec2(u, 0.5 / 3.0), 0.0).rgb * bowOn;
    bowLight = textureLod(uBowLUT, vec2(u, 1.5 / 3.0), 0.0).rgb * bowOn;
    bowDrizzle = textureLod(uBowLUT, vec2(u, 2.5 / 3.0), 0.0).rgb * bowOn;
  }
  vec2 sunRun = uSunDir.xz / max(uSunDir.y, 0.05); // xz travelled per unit of height toward the sun
  float lit = 1.0;
  float litT = -1e9;
  vec3 sunL = uSunColor;
  float fogK = 0.0011;
  float detailK = uSteps / 56.0;
  float t = t0 + jitter * clamp(t0 * 0.011 / detailK, 0.22, 7.0);
  // striding over empty air, then stepping back to walk into cloud at the
  // fine step, so where a ray meets cloud doesn't snap to the stride
  float tEmpty = -1.0;
  float tFine = -1.0;
  for (int i = 0; i < 200; i++) {
    if (t >= t1 || T < 0.03) break;
    float dt = clamp(t * 0.011 / detailK, 0.22, 7.0);
    vec3 p = uCamPos + rd * t;
    vec4 w = weatherAll(p.xz);
    float b0 = cellBase(w);
    float above = p.y - b0;
    if (w.r < 0.012 && (w.g < 0.01 || above > RAIN_REACH)) {
      if (t > tFine) {
        // empty air: stride ahead (the weather grid is ~4 units a cell)
        tEmpty = t;
        t += max(dt * 4.0, 2.4);
      } else {
        t += dt;
      }
      continue;
    }
    if (tEmpty >= 0.0) {
      tFine = t;
      t = tEmpty + dt * jitter;
      tEmpty = -1.0;
      continue;
    }
    float fogT = exp(-t * fogK);
    if (above >= 0.0) {
      float d = density(p, w, true);
      if (d > 0.002) {
        // light from the sun through the cloud above/around this point
        float tau = 0.0;
        vec3 sd = uSunDir.y > 0.02 ? uSunDir : vec3(0.0, 1.0, 0.0);
        float ls = 0.4 * (0.7 + 0.6 * jitterL);
        vec3 lp = p;
        for (int k = 0; k < 4; k++) {
          if (float(k) >= uLightSteps) break;
          lp += sd * ls;
          tau += densityLight(lp) * ls;
          ls *= 2.0;
        }
        float hf = clamp((p.y - uBase) / max(uTop - uBase, 1e-3), 0.0, 1.0);
        float beer = max(exp(-tau * 3.2), exp(-tau * 0.8) * 0.22);
        float powder = 1.0 - exp(-d * 5.0 - tau * 0.6);
        vec3 amb = mix(uGroundColor * 1.2 + uSkyColor * 0.18, uSkyColor * 0.95, smoothstep(0.0, 0.85, hf));
        // a raining base is a darker grey: it sees little sky through the water above it
        amb *= 1.0 - 0.4 * w.g * (1.0 - smoothstep(0.0, 4.0, above));
        vec3 S = sunL * beer * phase * mix(0.45, 1.0, powder) + amb * (0.35 + 0.55 * hf) * (1.0 - 0.35 * d) + uMoonColor * 3.0 * exp(-tau);
        if (uFlash > 0.0) S += vec3(2.2, 2.3, 3.0) * uFlash * exp(-distance(p, uFlashPos) * 0.05);
        float sigma = d * 2.6;
        float Ts = exp(-sigma * dt);
        float a = T * (1.0 - Ts);
        L += a * (S * fogT + uFogColor * (1.0 - fogT));
        zSum += a * t;
        zW += a;
        T *= Ts;
      }
    }
    if (w.g > 0.0 && above < RAIN_REACH) {
      // rain (under cloud that isn't raining there is nothing to add): grey
      // streaks from the ground up into the cloud's lower part, thinning
      // toward the ground in dry air and fading out with height inside it;
      // fine near the camera, a soft veil farther off
      float wg = w.g * (1.0 - smoothstep(0.0, RAIN_REACH, above));
      float near = 1.0 - smoothstep(4.0, 30.0, t);
      vec3 q = vec3(p.x * mix(0.5, 3.0, near), p.y * 0.05 + uTime * 0.9, p.z * mix(0.5, 3.0, near)) - vec3(uWind.x * 0.5, 0.0, uWind.y * 0.5);
      float streak = texture(uDetail, q).r;
      float fall = smoothstep(0.0, uBase * 0.3, p.y + uBase * 0.08) * mix(1.0, 0.35, near);
      // a shaft is heaviest just under its cloud, where it hangs from it
      float r = wg * smoothstep(0.25, 0.75, streak + wg * 0.4) * fall * (1.0 + 0.4 * smoothstep(-2.5, 0.0, above));
      // is the sun on this rain? cloud and land, re-checked every 1.5 units
      // near by and more sparsely far off, where the veil is soft anyway
      if (t - litT > max(1.5, t * 0.03)) {
        lit = sunlitRain(p, sunRun);
        litT = t;
      }
      // rain under its own cloud sees less sky, so shafts read grey and a bow shows on them
      vec3 S = uSkyColor * 0.55 * mix(1.0, 0.8, w.r) + sunL * lit * 0.14;
      float sigma = r * 0.14;
      float Ts = exp(-sigma * dt);
      float a = T * (1.0 - Ts);
      L += a * (S * fogT + uFogColor * (1.0 - fogT));
      zSum += a * t;
      zW += a;
      // the bow rides on the mean rain, not the streaks, so it holds still;
      // drop size follows the rain rate: drizzle pale and broad, showers narrow and vivid
      if (bowOn > 0.0 && lit > 0.003 && above < 0.0) {
        float sb = w.g * fall * 0.12; // mean extinction: 0.14 × the streaks' average cover
        vec3 bowP = mix(mix(bowDrizzle, bowLight, smoothstep(0.05, 0.25, w.g)), bowShower, smoothstep(0.3, 0.65, w.g));
        L += T * sunL * lit * bowP * (1.0 - exp(-sb * dt)) * fogT;
      }
      T *= Ts;
    }
    t += dt;
  }
  gl_FragColor = vec4(L, T);
  if (zW > 1e-3) cloudDepth = vec4(zSum / zW);
}
`,Ag=`
uniform sampler2D uCur;
uniform sampler2D uCurDepth;
uniform sampler2D uHistory;
uniform mat4 uPrevViewProj;
uniform mat4 uInvProj;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform vec3 uDrift;       // how far the clouds moved with the wind since last frame
uniform float uBlend;      // history weight; 0 starts over
in vec2 vUv;

void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  ivec2 lim = textureSize(uCur, 0) - 1;
  vec4 c = texelFetch(uCur, ip, 0);
  if (uBlend <= 0.0) { gl_FragColor = c; return; }
  vec4 m1 = vec4(0.0), m2 = vec4(0.0), lo = c, hi = c;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec4 s = texelFetch(uCur, clamp(ip + ivec2(x, y), ivec2(0), lim), 0);
      m1 += s;
      m2 += s * s;
      lo = min(lo, s);
      hi = max(hi, s);
    }
  }
  // the min/max box, tightened toward the mean where the neighbourhood is calm
  m1 /= 9.0;
  vec4 sd = sqrt(max(m2 / 9.0 - m1 * m1, 0.0));
  lo = max(lo, m1 - sd * 1.5);
  hi = min(hi, m1 + sd * 1.5);

  vec4 v = uInvProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
  vec3 rd = normalize((uCamWorld * vec4(v.xyz / v.w, 0.0)).xyz);
  vec3 wp = uCamPos + rd * texelFetch(uCurDepth, ip, 0).r - uDrift;
  vec4 pc = uPrevViewProj * vec4(wp, 1.0);
  vec2 puv = pc.xy / pc.w * 0.5 + 0.5;
  float a = uBlend;
  if (pc.w <= 0.0 || any(lessThan(puv, vec2(0.0))) || any(greaterThan(puv, vec2(1.0)))) a = 0.0;
  vec4 h = clamp(texture(uHistory, puv), lo, hi);
  gl_FragColor = mix(c, h, a);
}
`,Cg=.9,kl="out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",Oc=512,Bc=64;function Rg(i){if(i>6)return 0;if(i<-7){const r=-i,a=2/3*r*Math.sqrt(r),l=a+Math.PI/4;return(Math.sin(l)-5/(72*a)*Math.cos(l))/(Math.sqrt(Math.PI)*Math.sqrt(Math.sqrt(r)))}const t=i*i*i;let e=1,n=i,s=1,o=i;for(let r=1;r<80&&(s*=t/((3*r-1)*(3*r)),o*=t/(3*r*(3*r+1)),e+=s,n+=o,!(Math.abs(s)+Math.abs(o)<1e-16));r++);return .355028053887817*e-.258819403792807*n}const Hc=i=>1.3239+.003125/(i*i);function Gc(i,t,e){const n=Math.sqrt(1-e*e),s=Math.sqrt(1-e*e/(i*i)),o=(n-i*s)/(n+i*s),r=(i*n-s)/(i*n+s),a=o*o,l=r*r;return .5*((1-a)**2*a**t+(1-l)**2*l**t)}function Ui(i,t,e){const n=Math.asin(e),s=Math.asin(e/i),o=2*(n-s)+t*(Math.PI-2*s);return t===1?Math.PI-o:o-Math.PI}function qa(i,t){const e=Math.sqrt(1-(i*i-1)/(t*(t+2))),n=2*e/Math.pow(1-e*e,1.5)-2*(t+1)*e/Math.pow(i*i-e*e,1.5);return{b:e,alpha:Ui(i,t,e),d2:Math.abs(n),eps:Gc(i,t,e)}}const ni=(i,t,e,n)=>Math.exp(-.5*((i-t)/(i<t?e:n))**2),Pg=i=>[1.056*ni(i,599.8,37.9,31)+.362*ni(i,442,16,26.7)-.065*ni(i,501.1,20.4,26.2),.821*ni(i,568.8,46.9,40.5)+.286*ni(i,530.9,16.3,31.1),1.217*ni(i,437,11.8,36)+.681*ni(i,459,26,13.8)],zl=([i,t,e])=>[3.2406*i-1.5372*t-.4986*e,-.9689*i+1.8758*t+.0415*e,.0557*i-.204*t+1.057*e],Ra=.25;function Lg(i,t,e){const n=qa(i,t);let s=0;for(const[o,r]of[[1e-6,n.b],[n.b,1-1e-9]]){let a=o,l=r;const c=Ui(i,t,a)-e;if(c*(Ui(i,t,l)-e)>0)continue;for(let g=0;g<40;g++){const v=(a+l)/2;(Ui(i,t,v)-e)*c>0?a=v:l=v}const h=(a+l)/2,f=Math.max(h-1e-6,0),u=Math.min(h+1e-6,1),d=Math.abs(Ui(i,t,u)-Ui(i,t,f))/(u-f);s+=2*Gc(i,t,h)*h/(d*Math.sin(e))}return s}function Dg(){const i=Hc(.55);return[1,2].map(t=>{const e=qa(i,t),n=new Float32Array(Math.ceil(Bc/Ra)+1);for(let s=0;s<n.length;s++){const o=Math.max(s*Ra,.5)*Math.PI/180,r=t===1?e.alpha-o:e.alpha+o;if(r<=.01||r>=Math.PI-.01){n[s]=n[s-1]||1;continue}const a=e.eps*e.b*Math.cbrt(4)*Math.pow(e.d2,-2/3)*2/(Math.sqrt(o*Math.cbrt(2/e.d2))*Math.sin(r));n[s]=Lg(i,t,r)/a}return n})}const Mo=-20,Pa=.01;function Ug(){const i=new Float32Array(Math.round((6-Mo)/Pa)+2);for(let t=0;t<i.length;t++)i[t]=Rg(Mo+t*Pa)**2;return i}function ha(i,t,e){const n=Oc,s=Bc/n,o=new Float32Array(n*3),r=[.6,.75,.9,1,1.1,1.25,1.45,1.7].map(_=>i*_),a=r.map(_=>Math.exp(-.5*(Math.log(_/i)/.3)**2)*_*_),l=a.reduce((_,x)=>_+x,0),c=new Float32Array(n),h=new Float32Array(n);for(let _=0;_<n;_++)c[_]=Math.max((_+.5)*s,1)*Math.PI/180,h[_]=1/Math.sin(c[_]);const f=[0,0,0],u=new Float32Array(n*3);for(let _=400;_<=700;_+=20){const x=Pg(_);for(let w=0;w<3;w++)f[w]+=x[w];const y=Hc(_/1e3);for(const w of[1,2]){const M=qa(y,w),E=t[w-1],R=w===1?1:-1;for(let S=0;S<r.length;S++){const b=2*Math.PI*r[S]*1e6/_,I=Math.cbrt(b),V=I*I*Math.cbrt(2/M.d2),X=M.eps*M.b*Math.cbrt(4)*I*Math.pow(M.d2,-2/3)*4*Math.PI*(a[S]/l);for(let T=w===1?0:n-1;T>=0&&T<n;T+=R){const P=(M.alpha-c[T])*R,G=-P*V;if(G>6)break;let U;if(G<Mo)U=1/(2*Math.PI*Math.sqrt(-G));else{const O=(G-Mo)/Pa,C=Math.floor(O);U=e[C]+(e[C+1]-e[C])*(O-C)}let k=X*U*h[T];if(P>0){const O=Math.min(E.length-1.001,P*180/Math.PI/Ra),C=Math.floor(O);k*=E[C]+(E[C+1]-E[C])*(O-C)}u[T*3]+=k*x[0],u[T*3+1]+=k*x[1],u[T*3+2]+=k*x[2]}}}}const d=zl(f),g=Math.ceil(.2665/s),v=[];for(let _=-g;_<=g;_++)v.push(Math.sqrt(Math.max(0,1-(_*s/.2665)**2)));const m=v.reduce((_,x)=>_+x,0),p=[0,0,0];for(let _=0;_<n;_++){p.fill(0);for(let R=-g;R<=g;R++){const S=Math.min(n-1,Math.max(0,_+R));for(let b=0;b<3;b++)p[b]+=u[S*3+b]*v[R+g]/m}const x=zl(p).map((R,S)=>R/d[S]),y=.2126*x[0]+.7152*x[1]+.0722*x[2],w=Math.min(x[0],x[1],x[2]),M=w<0?y/Math.max(y-w,1e-6):1,E=1-Math.min(1,Math.max(0,((_+.5)*s-58)/5));for(let R=0;R<3;R++)o[_*3+R]=Math.max(0,y+(x[R]-y)*M)*E}return o}function Fg(){performance.now();const i=Dg(),t=Ug(),e=[ha(.5,i,t),ha(.15,i,t),ha(.05,i,t)],n=Oc,s=new Uint16Array(n*3*4),o=jr.toHalfFloat(1);for(let a=0;a<3;a++)for(let l=0;l<n;l++){const c=(a*n+l)*4;for(let h=0;h<3;h++)s[c+h]=jr.toHalfFloat(e[a][l*3+h]);s[c+3]=o}const r=new $n(s,n,3,ke,In);return r.minFilter=r.magFilter=ne,r.wrapS=r.wrapT=$e,r.needsUpdate=!0,r}class Ig{constructor(t){const e=new Sa(t.shape,t.shapeSize,t.shapeSize,t.shapeSize);e.format=Ni,e.minFilter=ne,e.magFilter=ne,e.wrapS=e.wrapT=e.wrapR=hi,e.unpackAlignment=1,e.needsUpdate=!0;const n=new Sa(t.detail,t.detailSize,t.detailSize,t.detailSize);n.format=Ni,n.minFilter=ne,n.magFilter=ne,n.wrapS=n.wrapT=n.wrapR=hi,n.unpackAlignment=1,n.needsUpdate=!0,this.scale=.5;const s={type:In,depthBuffer:!1};this.march=new Eu(1,1,2,s),this.march.texture[1].format=Ni,this.history=[new sn(1,1,s),new sn(1,1,s)],this.current=0,this.frame=0,this.fresh=!0,this.prev={viewProj:new Kt,pos:new z,fwd:new z,sun:new z,wind:new It},this._fwd=new z,this.uniforms={uDepth:{value:null},uWeather:{value:null},uShape:{value:e},uDetail:{value:n},uWeatherRect:{value:new ge},uInvProj:{value:new Kt},uCamWorld:{value:new Kt},uCamPos:{value:new z},uSunDir:{value:new z},uSunColor:{value:new Pt},uSkyColor:{value:new Pt},uGroundColor:{value:new Pt},uFogColor:{value:new Pt},uMoonDir:{value:new z},uMoonColor:{value:new Pt},uWind:{value:new It},uWindDir:{value:new It(1,0)},uTime:{value:0},uBase:{value:8},uTop:{value:28},uDensity:{value:1},uFarCover:{value:.32},uOvercast:{value:0},uRainbow:{value:1},uBowLUT:{value:Fg()},uShadow:{value:null},uHeight:{value:null},uSteps:{value:56},uLightSteps:{value:4},uFlash:{value:0},uFlashPos:{value:new z},uFrame:{value:0}},this.material=new ve({vertexShader:kl,fragmentShader:Tg,uniforms:this.uniforms,depthTest:!1,depthWrite:!1});const o=Ao();this.scene=new Yi;const r=new te(o,this.material);r.frustumCulled=!1,this.scene.add(r),this.resolve=new ve({vertexShader:kl,fragmentShader:Ag,uniforms:{uCur:{value:this.march.texture[0]},uCurDepth:{value:this.march.texture[1]},uHistory:{value:null},uPrevViewProj:{value:new Kt},uInvProj:this.uniforms.uInvProj,uCamWorld:this.uniforms.uCamWorld,uCamPos:this.uniforms.uCamPos,uDrift:{value:new z},uBlend:{value:0}},depthTest:!1,depthWrite:!1}),this.resolveScene=new Yi;const a=new te(o,this.resolve);a.frustumCulled=!1,this.resolveScene.add(a),this.cam=new Ts(-1,1,1,-1,0,1),this.enabled=!0}get rt(){return this.history[this.current]}get texture(){return this.rt.texture}setSize(t,e){this.full=[t,e];const n=Math.max(1,Math.floor(t*this.scale)),s=Math.max(1,Math.floor(e*this.scale));this.march.setSize(n,s);for(const o of this.history)o.setSize(n,s);this.fresh=!0}setScale(t){Math.abs(t-this.scale)<.001||(this.scale=t,this.full&&this.setSize(...this.full))}isCut(t){const e=this.prev,n=t.getWorldDirection(this._fwd),s=t.position,o=this.fresh||s.distanceTo(e.pos)>.5+.25*Math.max(0,s.y)||n.dot(e.fwd)<.85||this.uniforms.uSunDir.value.dot(e.sun)<.9995;return e.pos.copy(s),e.fwd.copy(n),e.sun.copy(this.uniforms.uSunDir.value),this.fresh=!1,o}render(t,e,n){const s=this.uniforms,o=this.isCut(e);s.uDepth.value=n,s.uInvProj.value.copy(e.projectionMatrixInverse),s.uCamWorld.value.copy(e.matrixWorld),s.uCamPos.value.copy(e.position),this.frame=(this.frame+1)%4096,s.uFrame.value=this.frame,t.setRenderTarget(this.march),t.render(this.scene,this.cam);const r=this.resolve.uniforms,a=this.prev;r.uBlend.value=o?0:s.uFlash.value>.02?.5:Cg,r.uPrevViewProj.value.copy(a.viewProj),r.uDrift.value.set(s.uWind.value.x-a.wind.x,0,s.uWind.value.y-a.wind.y),r.uHistory.value=this.history[this.current].texture,this.current^=1,t.setRenderTarget(this.history[this.current]),t.render(this.resolveScene,this.cam),a.viewProj.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),a.wind.copy(s.uWind.value)}}const La={moae:{name:"Moaʻe",gloss:"trade winds",bearing:62,speed:8.5,humidity:1,lcl:650,inversion:2e3,patch:1,convect:.55},kona:{name:"Kona",gloss:"southerly storm",bearing:205,speed:11,humidity:1.45,lcl:420,inversion:3800,patch:1.6,convect:.8},malie:{name:"Mālie",gloss:"calm, sea breezes",bearing:110,speed:2.4,humidity:.85,lcl:900,inversion:2900,patch:.5,convect:1.5}},We=160,rs=Zt*1.8;class kg{constructor(t,e,n=7){this.G=We,this.span=rs,this.cell=rs/We,this.origin=-rs/2;const s=We*We;this.terrain=new Float32Array(s),this.land=new Float32Array(s),this.heat=new Float32Array(s);for(let o=0;o<We;o++)for(let r=0;r<We;r++){const a=this.origin+(r+.5)*this.cell,l=this.origin+(o+.5)*this.cell;let c=0,h=0,f=0;for(let d=-1;d<=1;d++)for(let g=-1;g<=1;g++){const v=a+g*this.cell*.5,m=l+d*this.cell*.5,p=Math.floor((v+Zt/2)/Zt*e),_=Math.floor((m+Zt/2)/Zt*e),x=p<0||_<0||p>=e||_>=e?-500:t[_*e+p];c+=Math.max(0,x),h=Math.max(h,x),f++}const u=o*We+r;this.terrain[u]=c/f,this.land[u]=h>0?1:0}this.qv=new Float32Array(s).fill(1),this.qc=new Float32Array(s),this.zp=new Float32Array(s),this.rain=new Float32Array(s),this.wet=new Float32Array(s),this.conv=new Float32Array(s),this.tmp=[new Float32Array(s),new Float32Array(s),new Float32Array(s),new Float32Array(s),new Float32Array(s)],this.noise=Dl(n),this.noise2=Dl(n+1),this.mode="auto",this.regime="moae",this.state={...La.moae},this.wind=new It(...pa(62)).multiplyScalar(8.5),this.windOffset=new It,this.simTime=0,this.nextChange=3600*30,this.rainTotal=0,this.data=new Float32Array(s*4),this.texture=new $n(this.data,We,We,ke,pn),this.texture.minFilter=ne,this.texture.magFilter=ne,this.texture.wrapS=this.texture.wrapT=$e,this.texture.needsUpdate=!0,this.rect=new ge(this.origin,this.origin,rs,rs),this.accum=0,this.boost=0}setMode(t){this.mode=t,t!=="auto"&&(this.regime=t)}pickRegime(t){const e=Math.random();return t==="hooilo"?e<.62?"moae":e<.8?"malie":"kona":e<.86?"moae":e<.97?"malie":"kona"}step(t,e,n,s,o=!1){if(t<=0)return;if(this.simTime+=t,this.mode==="auto"&&this.simTime>this.nextChange){this.regime=this.pickRegime(s);const M=this.regime==="moae"?30+Math.random()*60:this.regime==="kona"?14+Math.random()*20:10+Math.random()*16;this.nextChange=this.simTime+M*3600}const r=La[this.regime],a=1-Math.exp(-t/7200),l=this.state;for(const M of["speed","humidity","lcl","inversion","patch","convect"]){let E=r[M];this.boost&&M==="humidity"&&(E*=1.18),this.boost&&M==="patch"&&(E*=1.6),l[M]+=(E-l[M])*a}let c=r.bearing-l.bearing;c=(c+540)%360-180,l.bearing+=c*a;const h=1+.18*Math.sin((n-9)/24*Math.PI*2),f=1+.12*this.noise(this.simTime/5400,3.3),u=l.bearing+9*this.noise(this.simTime/9e3,7.7),[d,g]=pa(u),v=l.speed*h*f;this.wind.set(d*v,g*v);const m=d*v/100,p=g*v/100;this.windOffset.x+=m*t,this.windOffset.y+=p*t,this.pending=(this.pending||0)+t;const _=performance.now();if(!o&&_-(this.lastPhysics||0)<80)return;this.lastPhysics=_;const x=this.pending;this.pending=0;const y=Math.hypot(m,p)*x,w=Math.max(1,Math.min(12,Math.ceil(y/(this.cell*1.5))));for(let M=0;M<w;M++)this.substep(x/w,m,p,e);this.pack()}substep(t,e,n,s){const o=We,r=this.cell,a=this.state,[l,c,h,f,u]=this.tmp,d=e*t/r,g=n*t/r,v=this.windOffset.x,m=this.windOffset.y;for(let y=0;y<o;y++)for(let w=0;w<o;w++){const M=y*o+w,E=w-d,R=y-g;if(E<0||R<0||E>o-1||R>o-1){const k=this.origin+(E+.5)*r-v,O=this.origin+(R+.5)*r-m,C=Math.hypot(e,n)||1,B=(k*e+O*n)/C,Z=(-k*n+O*e)/C,N=ag(this.noise2,B/60,Z/24,3);l[M]=a.humidity*(1+a.patch*.55*N),c[M]=Math.max(0,N-.05)*.75*a.patch,h[M]=0,f[M]=0,u[M]=0;continue}const S=Math.min(o-2,E|0),b=Math.min(o-2,R|0),I=E-S,V=R-b,X=b*o+S,T=(1-I)*(1-V),P=I*(1-V),G=(1-I)*V,U=I*V;l[M]=this.qv[X]*T+this.qv[X+1]*P+this.qv[X+o]*G+this.qv[X+o+1]*U,c[M]=this.qc[X]*T+this.qc[X+1]*P+this.qc[X+o]*G+this.qc[X+o+1]*U,h[M]=this.zp[X]*T+this.zp[X+1]*P+this.zp[X+o]*G+this.zp[X+o+1]*U,f[M]=this.conv[X]*T+this.conv[X+1]*P+this.conv[X+o]*G+this.conv[X+o+1]*U,u[M]=this.wet[M]}const p=Math.hypot(e,n)*t*100,_=Math.max(0,s)*a.convect,x=a.lcl;for(let y=0;y<o*o;y++){const w=this.terrain[y];let M=l[y],E=c[y];const R=h[y],S=Math.max(w,R-.24*p);if(S>R){const T=Math.max(0,S-Math.max(R,x)),P=Math.min(M,M*T/650);M-=P,E+=P}else if(S<R){const T=Math.min(E,(R-S)*(.0035*E+35e-5));E-=T,M+=T}let b=f[y]*Math.exp(-t/5400);if(this.land[y]){const T=_*Ul(80,700,w)*(1-.6*Ul(.85,1.2,a.humidity))*45e-7,P=Math.min(M*.2,T*t*M);M-=P,E+=P,b=Math.min(1,b+T*t*4)}else{M+=(a.humidity-M)*(1-Math.exp(-t/2400));const T=Math.max(0,M-a.humidity*1.12)*t*12e-5;M-=T,E+=T}const V=Math.max(0,E-.11)*(1-Math.exp(-t/1500));E-=V,E*=Math.exp(-t/21600);const X=V/Math.max(t,.001)*3600;this.rain[y]=this.rain[y]*.6+X*.4,u[y]=lo(u[y]*Math.exp(-t/(3600*5))+X*t/3600*3,0,1),this.qv[y]=M,this.qc[y]=E,this.zp[y]=S,this.conv[y]=b,this.wet[y]=u[y]}}pack(){const t=this.data;let e=0,n=0,s=0;for(let o=0;o<We*We;o++){const r=lo(this.qc[o]*4.2,0,1);t[o*4]=r;const a=lo(this.rain[o]*2.2,0,1);t[o*4+1]=a,t[o*4+2]=this.wet[o],t[o*4+3]=this.conv[o],this.land[o]&&(e+=a);const l=a*(.4+this.conv[o]);l>n&&(n=l,s=o)}this.rainTotal=e,this.stormiest={strength:n,x:this.origin+(s%We+.5)*this.cell,z:this.origin+(Math.floor(s/We)+.5)*this.cell},this.texture.needsUpdate=!0}spawnShower(t,e,n=6,s=.5){const o=this.G,r=(t-this.origin)/this.cell-.5,a=(e-this.origin)/this.cell-.5,l=n/this.cell;for(let c=Math.max(0,Math.floor(a-l));c<=Math.min(o-1,Math.ceil(a+l));c++)for(let h=Math.max(0,Math.floor(r-l));h<=Math.min(o-1,Math.ceil(r+l));h++){const f=Math.hypot(h-r,c-a)/l;if(f>1)continue;const u=c*o+h,d=(1-f*f)*s;this.qc[u]=Math.max(this.qc[u],.12+d*.3),this.rain[u]=Math.max(this.rain[u],d*.6),this.conv[u]=Math.max(this.conv[u],d)}this.pack()}warm(t,e,n,s){for(let o=0;o<t*3600;o+=600)this.step(600,e,n,s,!0)}get base(){return this.state.lcl*Nt}get top(){return this.state.inversion*Nt}}const Pe=.016,nt={plain:0,thatch:1,stone:2,leaf:3,kapa:5,wood:6,skin:7};class ze{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.xf=null,this.stack=[]}at(t,e,n,s=0,o=Pe){this.stack.push(this.xf);const r=Math.cos(s),a=Math.sin(s);return this.xf=l=>[t+(l[0]*r-l[2]*a)*o,e+l[1]*o,n+(l[0]*a+l[2]*r)*o],this}done(){return this.xf=this.stack.pop()||null,this}get count(){return this.pos.length/3}tri(t,e,n,s,o=0,r=!0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],f=n[1]-t[1],u=n[2]-t[2];let d=l*u-c*f,g=c*h-a*u,v=a*f-l*h;const m=Math.hypot(d,g,v)||1;d/=m,g/=m,v/=m;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(d,g,v),this.col.push(s[0],s[1],s[2]),this.mat.push(o)}quad(t,e,n,s,o,r=0){this.tri(t,e,n,o,r),this.tri(t,n,s,o,r)}hexa(t,e,n,s=0){this.quad(e[0],e[3],e[2],e[1],n,s),this.quad(t[0],t[1],t[2],t[3],n,s);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],n,s)}box(t,e,n,s,o,r,a,l=0,c=0,h=1){const f=Math.cos(c),u=Math.sin(c),d=(y,w,M)=>[t+y*f-M*u,e+w,n+y*u+M*f],g=s/2,v=r/2,m=g*h,p=v*h,_=[d(-g,0,-v),d(g,0,-v),d(g,0,v),d(-g,0,v)],x=[d(-m,o,-p),d(m,o,-p),d(m,o,p),d(-m,o,p)];o<0?this.hexa(x,_,a,l):this.hexa(_,x,a,l)}cyl(t,e,n,s,o,r=0,a=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,f=c.map(p=>p/h),u=Math.abs(f[1])<.9?[0,1,0]:[1,0,0];let d=[f[1]*u[2]-f[2]*u[1],f[2]*u[0]-f[0]*u[2],f[0]*u[1]-f[1]*u[0]];const g=Math.hypot(...d);d=d.map(p=>p/g);const v=[f[1]*d[2]-f[2]*d[1],f[2]*d[0]-f[0]*d[2],f[0]*d[1]-f[1]*d[0]],m=(p,_,x)=>{const y=x/a*Math.PI*2,w=Math.cos(y)*_,M=Math.sin(y)*_;return[p[0]+d[0]*w+v[0]*M,p[1]+d[1]*w+v[1]*M,p[2]+d[2]*w+v[2]*M]};for(let p=0;p<a;p++){const _=m(t,n,p),x=m(t,n,p+1),y=m(e,s,p),w=m(e,s,p+1);this.quad(_,x,w,y,o,r),l&&this.tri(e,y,w,o,r)}}blob(t,e,n,s,o,r,a,l=0,c=0,h=l===nt.leaf,f=1){const u=(1+Math.sqrt(5))/2,d=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],g=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],v=y=>.85+.3*Math.abs(Math.sin(y*12.9898+c*78.233)*43758.5453%1),m=d.map((y,w)=>{const M=Math.hypot(...y),E=v(w);return[t+y[0]/M*s*E,e+y[1]/M*o*E,n+y[2]/M*r*E]});if(!h){for(const y of g)this.tri(m[y[0]],m[y[1]],m[y[2]],a,l);return}const p=(y,w)=>{const M=[(y[0]+w[0])/2,(y[1]+w[1])/2,(y[2]+w[2])/2],E=[(M[0]-t)/s,(M[1]-e)/o,(M[2]-n)/r],R=Math.hypot(...E)||1,S=.9+.2*Math.abs(Math.sin(M[0]*91.7+M[2]*47.3+c)*43758.5453%1);return[t+E[0]/R*s*S,e+E[1]/R*o*S,n+E[2]/R*r*S]},_=y=>{const w=[(y[0]-t)/(s*s),(y[1]-e)/(o*o),(y[2]-n)/(r*r)],M=Math.hypot(...w)||1;return[w[0]/M,w[1]/M,w[2]/M]},x=(y,w,M)=>{const E=this.xf?[this.xf(y),this.xf(w),this.xf(M)]:[y,w,M],R=[_(y),_(w),_(M)];for(let S=0;S<3;S++)this.pos.push(...E[S]),this.nor.push(...R[S]),this.col.push(a[0],a[1],a[2]),this.mat.push(l)};if(f===0){for(const y of g)x(m[y[0]],m[y[1]],m[y[2]]);return}for(const y of g){const w=m[y[0]],M=m[y[1]],E=m[y[2]],R=p(w,M),S=p(M,E),b=p(E,w);x(w,R,b),x(R,M,S),x(b,S,E),x(R,S,b)}}wall(t,e,n,s,o=nt.stone,r=.7){const a=t.length;if(a<2)return;const l=a>2&&Math.hypot(t[0][0]-t[a-1][0],t[0][2]-t[a-1][2])<1e-9,c=[];for(let v=0;v<a-1;v++){const m=t[v+1][0]-t[v][0],p=t[v+1][2]-t[v][2],_=Math.hypot(m,p)||1;c.push([-p/_,m/_])}const h=t.map((v,m)=>{let p=c[m-1],_=c[m];if(l&&m===0&&(p=c[a-2]),l&&m===a-1&&(_=c[0]),!p)return _;if(!_)return p;const x=p[0]+_[0],y=p[1]+_[1],w=Math.hypot(x,y);if(w<1e-6)return _;const M=1/Math.max(.35,(x*_[0]+y*_[1])/w);return[x/w*M,y/w*M]}),f=e/2,u=e*r/2,d=(v,m,p,_)=>[v[0]+m[0]*p,v[1]+_,v[2]+m[1]*p],g=v=>[d(t[v],h[v],-f,-n*.3),d(t[v],h[v],f,-n*.3),d(t[v],h[v],u,n),d(t[v],h[v],-u,n)];for(let v=0;v<a-1;v++){const[m,p,_,x]=g(v),[y,w,M,E]=g(v+1);this.quad(x,_,M,E,s,o),this.quad(p,w,M,_,s,o),this.quad(y,m,x,E,s,o)}if(!l){const[v,m,p,_]=g(0),[x,y,w,M]=g(a-1);this.quad(v,m,p,_,s,o),this.quad(y,x,M,w,s,o)}}geometry(){const t=new Re;return t.setAttribute("position",new re(this.pos,3)),t.setAttribute("normal",new re(this.nor,3)),t.setAttribute("color",new re(this.col,3)),t.setAttribute("aMat",new re(this.mat,1)),t.computeBoundingSphere(),t}}function bt(i,t=0,e=Math.random){const n=new Pt(i),s=1+(e()-.5)*t;return[n.r*s,n.g*s,n.b*s]}const zg=`
${Ne}
in float aMat;
uniform float uTime;
uniform vec2 uWindVec;
uniform float uFadeNear;
uniform float uFadeFar;
uniform vec2 uFadeIn;
uniform float uFadeClose;
uniform float uSway;
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vMat;
out vec3 vLocal;
out float vFade;
out float vFadeIn;
void main() {
  mat4 im = mat4(1.0);
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  #endif
  vec3 p = position;
  mat4 mm = modelMatrix * im;
  vec4 wp = mm * vec4(p, 1.0);
  vec3 origin = (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vec3 c = color;
  #ifdef USE_INSTANCING_COLOR
  c *= instanceColor;
  #endif
  if (uSway > 0.0) {
    // A plant sways as one piece: phase and gusts come from where it stands,
    // and it bends more toward the top. Models are in metres, so the bend is
    // worked out in metres and scaled into the world by the instance's size.
    float scale = length(mm[1].xyz);
    float h = max(p.y, 0.0);
    float bend = (0.02 * h + 0.0012 * h * h) * scale * uSway;
    float ph = uTime * 1.3 + origin.x * 37.0 + origin.z * 23.0;
    float gust = 0.6 + 0.4 * sin(uTime * 0.55 + origin.x * 2.1 + origin.z * 1.7);
    wp.xz += uWindVec * (0.55 + 0.45 * sin(ph)) * gust * bend;
    if (aMat > 2.5 && aMat < 3.5) {
      // and the leaves flutter a few centimetres on their own
      float f = uTime * 5.0 + dot(p, vec3(1.7, 2.3, 1.1));
      wp.xyz += vec3(sin(f), 0.5 * sin(f * 1.3 + 1.0), cos(f * 0.9)) * (0.05 * min(h, 4.0) / 4.0) * scale * length(uWindVec) * uSway;
    }
  }
  vWorld = wp.xyz;
  vNormal = normalize(mat3(mm) * normal);
  vColor = c;
  vMat = aMat;
  vLocal = p;
  #ifdef USE_INSTANCING
  // whole instances fade together, so a tree never dissolves from one side
  float dist = distance(cameraPosition, origin);
  #else
  float dist = distance(cameraPosition, wp.xyz);
  #endif
  vFade = 1.0 - smoothstep(uFadeNear, uFadeFar, dist);
  // a tree right in front of the lens thins out rather than filling the view
  if (uFadeClose > 0.0) vFade *= smoothstep(uFadeClose * 0.5, uFadeClose, dist);
  // the far, simpler model of a tree dithers in exactly where the near one
  // dithers out (complementary thresholds, so no gaps and no doubling)
  vFadeIn = uFadeIn.y > 0.0 ? smoothstep(uFadeIn.x, uFadeIn.y, dist) : 1.0;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Ng=`
${Ne}
${zn}
${cn}
${Nn}
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec3 vLocal;
in float vFade;
in float vFadeIn;
uniform int uObjDebug;
void main() {
  if (vFade <= 0.0 || vFadeIn <= 0.0) discard;
  // dither in and out over a distance instead of popping
  float dither = hash12(gl_FragCoord.xy);
  if (dither >= vFade || dither < 1.0 - vFadeIn) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 a = vColor;
  int m = int(vMat + 0.5);
  if (m == 1) {
    // thatch: courses of pili grass, darker in the grooves
    float course = fract(vLocal.y * 2.6 + vnoise(vWorld.xz * 400.0) * 0.3);
    a *= 0.78 + 0.32 * smoothstep(0.0, 0.5, course) * (0.85 + 0.3 * vnoise(vWorld.xz * 900.0 + vLocal.y * 9.0));
  } else if (m == 2) {
    // dry-stacked stone: mottled, with dark joints
    vec2 sp = vWorld.xz * 260.0 + vec2(vWorld.y * 190.0, -vWorld.y * 170.0);
    vec3 v = voronoi(fract(sp / 512.0) * 512.0);
    a *= (0.7 + 0.5 * v.y) * (0.55 + 0.45 * smoothstep(0.0, 0.12, v.z));
  } else if (m == 3) {
    a *= 0.8 + 0.4 * vnoise(vWorld.xz * 600.0 + vLocal.y * 30.0);
  } else if (m == 6) {
    a *= 0.85 + 0.25 * vnoise(vec2(vLocal.y * 40.0, vWorld.x * 300.0));
  }
  // wet surfaces darken in the rain
  float wet = uWetness * (m == 5 ? 0.3 : 1.0);
  a *= 1.0 - 0.3 * wet;
  float vis = sunVisibility(vWorld);
  vec3 lit = shade(a, n, vWorld, 1.0, vis);
  // a little wrap and translucency for leaves
  if (m == 3) lit += a * uSunColor * max(dot(-n, uSunDir), 0.0) * 0.25 * vis;
  if (m == 5) lit += a * uSkyColor * 0.15;
  if (uObjDebug == 1) lit = a * 3.0;
  if (uObjDebug == 2) lit = n * 0.5 + 0.5;
  if (uObjDebug == 3) lit = vec3(vis);
  if (uObjDebug == 4) lit = vColor * 3.0;
  // facing audit (with the material made double-sided): red is a face seen
  // from behind, which a single-sided material would cull
  if (uObjDebug == 5) lit = gl_FrontFacing ? vec3(0.15, 1.4, 0.25) * (0.35 + 0.65 * max(dot(n, uSunDir), 0.0)) : vec3(3.0, 0.04, 0.04);
  gl_FragColor = vec4(lit, 1.0);
}
`;function gs(i,t={}){const[e,n]=t.fade||[120,160];return new ve({vertexShader:zg,fragmentShader:Ng,vertexColors:!0,side:t.doubleSide?je:Fn,uniforms:{...i.uniforms,uWindVec:i.uniforms.uWindVec||{value:new It(1,0)},uFadeNear:{value:e},uFadeFar:{value:n},uFadeClose:{value:t.close||0},uFadeIn:{value:new It(...t.fadeIn||[0,0])},uSway:{value:t.sway||0},uObjDebug:{value:0}}})}const xe={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",stoneDark:"#4f4844",wood:"#6b4a2f",koa:"#7a4a2a",kapa:"#efe8d8",salt:"#f2ece4"};function co(i,t,e=7,n=4.6,s=5.2,o=!0){const r=bt(xe.thatch,.18,t),a=bt(xe.thatchDark,.15,t),l=bt(xe.stone,.15,t);i.box(0,-.6,0,e+1.8,1.05,n+1.8,l,nt.stone);const c=.45,h=c+1.05;i.box(0,c,0,e,h-c,n,r,nt.thatch);const f=e/2+.35,u=n/2+.45,d=c+s,g=[-f,h-.15,-u],v=[f,h-.15,-u],m=[-f,d,0],p=[f,d,0],_=[-f,h-.15,u],x=[f,h-.15,u];i.quad(g,m,p,v,r,nt.thatch),i.quad(x,p,m,_,r,nt.thatch),i.quad(v,p,m,g,a,nt.thatch),i.quad(_,m,p,x,a,nt.thatch);const y=e/2;if(i.tri([-y,h,-n/2],[-y,h,n/2],[-y,d-.2,0],r,nt.thatch),i.tri([y,h,n/2],[y,h,-n/2],[y,d-.2,0],r,nt.thatch),i.box(0,d-.12,0,e+.9,.35,.55,a,nt.thatch),o){const w=[.05,.035,.025];i.quad([y+.02,c,-.45],[y+.02,c+1.4,-.45],[y+.02,c+1.4,.45],[y+.02,c,.45],w,0)}}function Vc(i,t,e,n,s){const o=bt(xe.wood,.25,s);i.cyl([t,0,e],[t,n*.62,e],.22,.18,o,nt.wood,5),i.box(t,n*.6,e,.75,n*.28,.6,o,nt.wood,s()*.3,.85),i.box(t,n*.86,e,.35,n*.16,.35,o,nt.wood,0,.6)}function Og(i,t,e,n,s){const o=bt(xe.kapa,.05,s),r=bt(xe.wood,.2,s);i.box(t,0,e,2.6,n,2.6,o,nt.kapa,.1,.62);for(const[a,l]of[[-1.35,-1.35],[1.35,-1.35],[1.35,1.35],[-1.35,1.35]])i.cyl([t+a,0,e+l],[t+a*.55,n+.8,e+l*.55],.12,.08,r,nt.wood,4)}function Bg(i,t,e,n){const s=bt(xe.wood,.2,n);for(const[o,r]of[[-.9,-.6],[.9,-.6],[.9,.6],[-.9,.6]])i.cyl([t+o,0,e+r],[t+o,2.6,e+r],.09,.08,s,nt.wood,4);i.box(t,2.5,e,2.2,.18,1.6,s,nt.wood),i.blob(t,2.85,e,.5,.25,.4,bt("#c9a35a",.2,n),nt.plain,1)}function Nl(i,t,e,n,s,o,r,a){const l=bt(xe.stone,.12,o),c=bt(xe.stoneDark,.12,o),h=r?44:26,f=r?30:18,u=r?3:2;i.at(t,e,n,s,a);let d=-1.5;for(let x=0;x<u;x++){const y=1-x*.14,w=(r?1.6:1.2)+(x===0?1.5:0);i.box(0,d,0,h*y,w,f*y,x%2?c:l,nt.stone),d+=w}const g=1-(u-1)*.14,v=h*g/2,m=f*g/2,p=r?2.2:1.5;i.box(0,d,-m+.8,h*g,p,1.6,c,nt.stone),i.box(0,d,m-.8,h*g,p,1.6,c,nt.stone),i.box(-v+.8,d,0,1.6,p,f*g,c,nt.stone),i.done(),i.at(t,e+d*a,n,s,a),Og(i,-v*.55,0,r?11:7.5,o);const _=r?7:4;for(let x=0;x<_;x++){const y=(x/(_-1)-.5)*1.6;Vc(i,-v*.55+Math.cos(y)*(r?8:5),Math.sin(y)*(r?8:5),r?4.2:3.2,o)}return Bg(i,v*.15,0,o),i.done(),i.at(t+Math.cos(s)*v*.45*a-Math.sin(s)*m*.35*a,e+d*a,n+Math.sin(s)*v*.45*a+Math.cos(s)*m*.35*a,s,a),co(i,o,r?8:6,r?5:4,r?6:4.5,!1),i.done(),d}function Wc(i,t,e=8){const n=bt(xe.koa,.2,t),s=bt("#4a2c18",.2,t),o=e/2;i.box(0,0,0,e*.8,.55,.62,n,nt.wood,0,.9),i.box(o*.85,.05,0,e*.2,.6,.4,s,nt.wood,0,.5),i.box(-o*.85,.05,0,e*.2,.55,.4,s,nt.wood,0,.5);const r=-2.4;for(const a of[-e*.15,e*.15])i.cyl([a,.55,0],[a,.5,r],.06,.06,s,nt.wood,4);i.box(0,.05,r,e*.5,.28,.24,s,nt.wood,0,.8)}function qc(i,t,e=18){const n=bt(xe.koa,.15,t),s=bt("#4a2c18",.15,t);for(const r of[-2.2,2.2])i.box(0,0,r,e*.82,1,1,n,nt.wood,0,.88),i.box(e*.45,.2,r,e*.14,1.2,.6,s,nt.wood,0,.5),i.box(-e*.45,.2,r,e*.14,1.1,.6,s,nt.wood,0,.5);i.box(0,1,0,e*.42,.2,5.2,s,nt.wood),i.box(-e*.08,1.2,0,3.2,1.4,2.4,bt(xe.thatch,.1,t),nt.thatch,0,.7);const o=bt("#c9ac78",.08,t);i.cyl([e*.1,1.1,0],[e*.05,9.5,0],.12,.08,s,nt.wood,4),i.quad([e*.12,1.4,.05],[e*.36,8.8,.05],[e*.02,10.8,.05],[e*.05,4,.05],o,nt.plain),i.quad([e*.05,4,-.05],[e*.02,10.8,-.05],[e*.36,8.8,-.05],[e*.12,1.4,-.05],o,nt.plain)}function Hg(i,t,e=16,n=6){const s=bt(xe.thatch,.15,t),o=bt(xe.thatchDark,.15,t),r=bt(xe.wood,.2,t),a=4.8,l=e/2,c=n/2+.3;i.quad([-l,.3,-c],[-l,a,0],[l,a,0],[l,.3,-c],s,nt.thatch),i.quad([l,.3,c],[l,a,0],[-l,a,0],[-l,.3,c],s,nt.thatch),i.quad([l,.3,-c],[l,a,0],[-l,a,0],[-l,.3,-c],o,nt.thatch),i.quad([-l,.3,c],[-l,a,0],[l,a,0],[l,.3,c],o,nt.thatch),i.tri([-l,.3,c],[-l,.3,-c],[-l,a,0],o,nt.thatch),i.tri([-l,.3,-c],[-l,.3,c],[-l,a,0],s,nt.thatch),i.box(0,a-.1,0,e+.4,.3,.45,o,nt.thatch),i.cyl([l,0,0],[l,a,0],.15,.12,r,nt.wood,5)}function Gg(i,t,e=!0){const n=bt(xe.stone,.2,t);for(let s=0;s<9;s++){const o=t()*Math.PI*2,r=1.4*(1-s/10);i.blob(Math.cos(o)*r*.5,s*.28,Math.sin(o)*r*.5,.75,.45,.7,n,nt.stone,s+t())}if(i.box(0,2.3,0,1.6,.25,1.3,bt("#5d5650",.1,t),nt.stone),e){const s=bt("#3b2a1e",.2,t);i.box(0,2.55,0,1,.75,.6,s,nt.wood,0,.8),i.box(.65,2.7,0,.5,.35,.35,s,nt.wood,0,.7),i.box(-.2,3.25,-.2,.15,.3,.12,s,nt.wood),i.box(-.2,3.25,.2,.15,.3,.12,s,nt.wood)}}function Vg(i,t,e=7){const n=bt(xe.wood,.1,t),s=bt(xe.kapa,.04,t);i.cyl([0,0,0],[0,e,0],.09,.07,n,nt.wood,5),i.cyl([0,e*.82,-1.6],[0,e*.82,1.6],.06,.06,n,nt.wood,4),i.quad([.02,e*.82,-1.5],[.02,e*.82,1.5],[.02,e*.3,1.3],[.02,e*.3,-1.3],s,nt.kapa),i.quad([-.02,e*.3,-1.3],[-.02,e*.3,1.3],[-.02,e*.82,1.5],[-.02,e*.82,-1.5],s,nt.kapa),i.box(0,e*.85,-1.55,.1,-1.6,.1,bt("#e2b13c",.1,t),nt.plain),i.box(0,e*.85,1.55,.1,-1.6,.1,bt("#e2b13c",.1,t),nt.plain),i.blob(0,e+.2,0,.35,.45,.35,bt("#3d2c1f",.1,t),nt.wood,2)}function Wg(i,t){const e=bt(xe.stone,.2,t);i.box(0,-.3,0,3.2,.8,2.4,e,nt.stone,0,.85);for(let n=0;n<5;n++)i.blob((t()-.5)*1.4,.7+n*.25,(t()-.5)*1,.45,.3,.4,e,nt.stone,n);i.blob(0,2,0,.45,.35,.45,bt("#f3efe6",.05,t),nt.kapa,3)}function qg(i,t){const e=bt("#4d4642",.2,t);for(let n=0;n<7;n++)i.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,nt.stone,n)}const Xg=`
${Ne}
in float aAge;
in float aFlood;
out vec3 vWorld;
out float vAge;
out float vFlood;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vAge = aAge;
  vFlood = aFlood;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Yg=`
${Ne}
${zn}
${cn}
${Nn}
in vec3 vWorld;
in float vAge;
in float vFlood;
void main() {
  vec3 V = normalize(cameraPosition - vWorld);
  float px = length(fwidth(vWorld.xz));
  // open water: sky reflection over muddy brown-green
  vec2 rp = vWorld.xz * 220.0 + vec2(uTime * 0.6, uTime * 0.4);
  vec3 N = normalize(vec3((vnoise(rp) - 0.5) * 0.08, 1.0, (vnoise(rp + 13.0) - 0.5) * 0.08));
  float F = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 R = reflect(-V, N);
  float vis = sunVisibility(vWorld);
  vec3 water = vec3(0.10, 0.09, 0.05) * (uSkyColor + uSunColor * max(uSunDir.y, 0.0) * vis);
  water = mix(water, skyMap(R), F);
  vec3 H = normalize(uSunDir + V);
  water += uSunColor * pow(max(dot(N, H), 0.0), 300.0) * 4.0 * vis;

  // taro: one heart-shaped leaf per ~1.3 m cell, size by the paddy's age
  float grow = vFlood > 0.5 ? smoothstep(0.0, 1.0, vAge) : 0.0;
  vec2 q = vWorld.xz * 120.0;
  vec3 v = voronoi(q);
  vec2 cellId = floor(q) + 0.5;
  float leafR = mix(0.15, 0.62, grow) * (0.8 + 0.4 * v.y);
  float leaf = 1.0 - smoothstep(leafR - 0.08, leafR, v.x);
  // when leaves are smaller than pixels, use their average coverage
  float cover = clamp(grow * 1.1 - 0.05, 0.0, 0.95);
  float detailK = smoothstep(0.0012, 0.0035, px);
  leaf = mix(leaf, cover, detailK);
  // at a distance, the planting rows still show as faint stripes
  float rows = 0.5 + 0.5 * sin(dot(vWorld.xz, vec2(0.8, 0.6)) * 380.0);
  leaf = mix(leaf, leaf * (0.8 + 0.3 * rows), detailK * (1.0 - smoothstep(0.004, 0.01, px)));
  vec3 leafC = mix(vec3(0.12, 0.30, 0.06), vec3(0.24, 0.45, 0.10), v.y);
  // young huli are paler and redder in the stem
  leafC = mix(vec3(0.20, 0.30, 0.08), leafC, grow);
  float ndl = 0.55 + 0.45 * max(uSunDir.y, 0.0);
  vec3 leafLit = leafC * (uSunColor * ndl * vis + uSkyColor * 0.9);
  // veins / sheen
  leafLit *= 0.9 + 0.2 * smoothstep(0.0, 0.25, v.z);
  vec3 col = mix(water, leafLit, clamp(leaf, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`;class jg{constructor(t,e,n){this.group=new ln;const s=[],o=[],r=[],a=new ze,l=bt("#557d36",.15,Math.random),c=bt("#6e6e42",.1,Math.random),h=.06,f=d=>new It(d[0],d[1]);for(const d of t.loi){for(const g of d.paddies){const v=(g.level+h)*Nt,m=g.poly;for(const[R,S,b]of Va.triangulateShape(m.map(f),[]))for(const I of[R,S,b])s.push(m[I][0],v,m[I][1]),o.push(g.age),r.push(g.flood);const p=g.c[0],_=g.c[1];let x=g.level;for(const R of m){const S=R[0]-p,b=R[1]-_,I=Math.hypot(S,b)||1;x=Math.min(x,e.metresAt(R[0],R[1]),e.metresAt(R[0]+S/I*.02,R[1]+b/I*.02))}const y=Math.max(x,g.level-5)-.25,M=(g.level+.35-y)/1.3,E=[...m,m[0]].map(R=>[R[0],(y+.3*M)*Nt,R[1]]);a.wall(E,.009,M*Nt,Math.random()<.8?l:c,nt.plain,.6)}for(const g of d.auwai)for(let v=0;v<g.length-1;v++){const m=g[v],p=g[v+1],_=p[0]-m[0],x=p[1]-m[1],y=Math.hypot(_,x)||1;if(y>1.2)continue;const w=-x/y*.008,M=_/y*.008,E=Math.max(e.heightAt(m[0],m[1]),m[2]*Nt)+.002,R=Math.max(e.heightAt(p[0],p[1]),p[2]*Nt)+.002,S=[[m[0]-w,E,m[1]-M],[p[0]-w,R,p[1]-M],[p[0]+w,R,p[1]+M],[m[0]+w,E,m[1]+M]];for(const b of[0,1,2,0,2,3])s.push(...S[b]),o.push(0),r.push(0)}}const u=new Re;u.setAttribute("position",new re(s,3)),u.setAttribute("aAge",new re(o,1)),u.setAttribute("aFlood",new re(r,1)),u.computeBoundingSphere(),this.material=new ve({vertexShader:Xg,fragmentShader:Yg,uniforms:{...n.uniforms},side:je,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),this.paddies=new te(u,this.material),this.group.add(this.paddies),this.banksGeometry=a.geometry()}}const Ol={noa:[7,4.6,5.2],mua:[8,5,5.6],aina:[6,4.2,4.6],kuku:[5,3.6,4],alii:[12,7,7.5]};class $g{constructor(t){const{terrain:e,shared:n}=t,s=t.island.meta,o=s.sites;this.app=t,this.meta=s,this.sites=o,this.group=new ln;const r=As(s.seed+77),a=new ze,l=(c,h)=>Math.max(e.heightAt(c,h),0);for(const c of o.houses){const[h,f,u]=Ol[c.kind]||Ol.noa,d=c.scale||1;a.at(c.x,l(c.x,c.z),c.z,c.rot),co(a,r,h*d,f*d,u*d),a.done()}for(const c of o.villages){const h=r()*Math.PI*2,f=c.x+Math.cos(h)*.35,u=c.z+Math.sin(h)*.35;a.at(f,l(f,u),u,0),qg(a,r),a.done()}for(const c of o.heiau)Nl(a,c.x,l(c.x,c.z),c.z,c.rot,r,c.kind==="luakini",Pe);this.beaches=[];for(const c of o.canoes){const h=c.dir,f=h+Math.PI/2;for(let u=0;u<c.n;u++){const d=(u-(c.n-1)/2)*.09,g=c.x+Math.cos(f)*d,v=c.z+Math.sin(f)*d;a.at(g,l(g,v)+.002,v,h),Wc(a,r,7+r()*4),a.done()}if(c.house){const u=c.x-Math.cos(h)*.32,d=c.z-Math.sin(h)*.32;a.at(u,l(u,d),d,h),Hg(a,r),a.done()}this.beaches.push(c)}if(o.alii){const c=o.canoes.find(h=>h.village===o.alii.id);if(c){const h=c.dir+Math.PI/2,f=c.x+Math.cos(h)*.45,u=c.z+Math.sin(h)*.45;a.at(f,l(f,u)+.002,u,c.dir),qc(a,r),a.done()}}for(const c of o.koa)a.at(c.x,l(c.x,c.z),c.z,r()*6),Wg(a,r),a.done();for(const c of s.ahu)a.at(c.x,l(c.x,c.z),c.z,r()*6),Gg(a,r,!0),a.done();this.ponds=o.ponds,this.pondMask(t);for(const c of o.ponds)this.buildPond(a,c,r);o.puuhonua&&this.buildPuuhonua(a,o.puuhonua,r),o.holua&&this.buildHolua(a,o.holua,r);for(const c of o.saltpans)this.buildSalt(a,c,r);this.material=gs(n,{fade:[70,110]}),this.structures=new te(a.geometry(),this.material),this.structures.frustumCulled=!1,this.group.add(this.structures),this.loi=new jg(o,e,n),this.group.add(this.loi.group),this.banks=new te(this.loi.banksGeometry,this.material),this.banks.frustumCulled=!1,this.group.add(this.banks)}pondMask(t){const e=ee,n=t.seaData,s=Zt/e;for(const o of this.ponds){const r=o.wall,a=r.map(d=>d[0]),l=r.map(d=>d[1]),c=Math.max(0,Math.floor((Math.min(...a)+xt)/s)),h=Math.min(e-1,Math.ceil((Math.max(...a)+xt)/s)),f=Math.max(0,Math.floor((Math.min(...l)+xt)/s)),u=Math.min(e-1,Math.ceil((Math.max(...l)+xt)/s));for(let d=f;d<=u;d++)for(let g=c;g<=h;g++){const v=-xt+(g+.5)*s,m=-xt+(d+.5)*s;Kg(r,v,m)&&(n[(d*e+g)*4]=255)}}t.seaTex.needsUpdate=!0}buildPond(t,e,n){const s=bt("#8a817a",.12,n),o=e.wall,r=o.length,a=[0];for(let w=1;w<r;w++)a.push(a[w-1]+Math.hypot(o[w][0]-o[w-1][0],o[w][1]-o[w-1][1]));const l=a[r-1],c=w=>{const M=w*(r-1),E=Math.min(r-2,Math.floor(M));return a[E]+(a[E+1]-a[E])*(M-E)},h=w=>{let M=0;for(;M<r-2&&a[M+1]<w;)M++;const E=(w-a[M])/Math.max(1e-9,a[M+1]-a[M]);return[o[M][0]+(o[M+1][0]-o[M][0])*E,o[M][1]+(o[M+1][1]-o[M][1])*E]},f=.06,u=e.gates.map(w=>c(w)).map(w=>[Math.max(0,w-f/2),Math.min(l,w+f/2)]);let d=[];const g=()=>{d.length>1&&t.wall(d,.1,.024,s,nt.stone,.72),d=[]},v=w=>d.push([w[0],0,w[1]]);let m=0;for(const[w,M]of u){for(let E=0;E<r;E++)a[E]>m&&a[E]<w&&v(o[E]);v(h(w)),g(),v(h(M)),m=M}for(let w=0;w<r;w++)a[w]>m&&v(o[w]);g();const p=bt(xe.wood,.15,n);for(const[w,M]of u){const E=h(w),R=h(M),S=Math.atan2(R[1]-E[1],R[0]-E[0]),b=Math.hypot(R[0]-E[0],R[1]-E[1])/Pe;t.at((E[0]+R[0])/2,0,(E[1]+R[1])/2,S);const I=Math.max(3,Math.round(b/.45));for(let V=0;V<=I;V++)t.box(-b/2+.06+(b-.12)*V/I,-.4,0,.12,1.9,.12,p,nt.wood);t.box(0,1.25,0,b,.15,.2,p,nt.wood),t.box(0,.45,0,b,.1,.16,p,nt.wood),t.done()}const _=Math.round(e.gates[0]*(r-1)),x=o[_][0]-e.ax*.12,y=o[_][1]-e.az*.12;t.at(x,.004,y,n()*3),co(t,n,4,3,3.4),t.done()}buildPuuhonua(t,e,n){const{terrain:s}=this.app,o=e.dir,r=Math.cos(o),a=Math.sin(o),l=-a,c=r,h=e.x-r*1.6,f=e.z-a*1.6,u=x=>{for(let y=.3;y<9;y+=.15)if(s.heightAt(h+l*y*x,f+c*y*x)<=.002)return y;return 4},d=u(-1),g=u(1),v=[];for(let x=-d;x<=g;x+=.12){const y=h+l*x,w=f+c*x;v.push([y,Math.max(0,s.heightAt(y,w)),w])}const m=bt(xe.stoneDark,.1,n);t.wall(v,.08,.06,m,nt.stone,.8);const p=e.x-r*.5,_=e.z-a*.5;Nl(t,p,Math.max(0,s.heightAt(p,_)),_,o,n,!1,Pe);for(let x=0;x<6;x++){const y=(x-2.5)*.12,w=e.x+l*y-r*.05,M=e.z+c*y-a*.05;t.at(w,Math.max(0,s.heightAt(w,M)),M,o),Vc(t,0,0,4,n),t.done()}for(let x=0;x<3;x++){const y=h+r*.5+l*(x-1)*.6,w=f+a*.5+c*(x-1)*.6;t.at(y,Math.max(0,s.heightAt(y,w)),w,o+Math.PI/2),co(t,n,6,4,4.2),t.done()}this.puuhonuaWall={a:v[0],b:v[v.length-1]}}buildHolua(t,e,n){const{terrain:s}=this.app,o=Math.ceil(Math.hypot(e.x1-e.x0,e.z1-e.z0)/.08),r=[];for(let l=0;l<=o;l++){const c=l/o,h=e.x0+(e.x1-e.x0)*c,f=e.z0+(e.z1-e.z0)*c;r.push([h,s.heightAt(h,f)+.004,f])}t.wall(r,.11,.014,bt("#8a817a",.1,n),nt.stone,.75);const a=bt("#c2b25e",.1,n);for(let l=0;l<r.length-1;l++){const c=r[l],h=r[l+1],f=h[0]-c[0],u=h[2]-c[2],d=Math.hypot(f,u)||1,g=-u/d*.034,v=f/d*.034,m=c[1]+.0145,p=h[1]+.0145;t.quad([c[0]-g,m,c[2]-v],[c[0]+g,m,c[2]+v],[h[0]+g,p,h[2]+v],[h[0]-g,p,h[2]-v],a,nt.plain)}this.holuaPath=r}buildSalt(t,e,n){const{terrain:s}=this.app,o=e.dir+Math.PI/2,r=bt(xe.salt,.06,n),a=bt("#7d5b44",.12,n);for(let l=0;l<4;l++)for(let c=0;c<3;c++){const h=(l-1.5)*.11,f=(c-1)*.09,u=e.x+Math.cos(o)*h-Math.sin(o)*f,d=e.z+Math.sin(o)*h+Math.cos(o)*f,g=Math.max(s.heightAt(u,d),.004);t.at(u,g,d,o),t.box(0,-.3,0,6.6,.5,5.4,a,nt.plain),t.box(0,.05,0,5.8,.18,4.6,n()<.7?r:bt("#d9c2b4",.05,n),nt.kapa),t.done()}}}function Kg(i,t,e){let n=!1;for(let s=0,o=i.length-1;s<i.length;o=s++){const r=i[s],a=i[o];r[1]>e!=a[1]>e&&t<(a[0]-r[0])*(e-r[1])/(a[1]-r[1])+r[0]&&(n=!n)}return n}function Xc(i,t,e,n=1){let s=Float32Array.from(i),o=new Float32Array(t*t);const r=1/(2*e+1);for(let a=0;a<n;a++){for(let l=0;l<t;l++){const c=l*t;let h=0;for(let f=-e;f<=e;f++)h+=s[c+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)o[c+f]=h*r,h+=s[c+Math.min(t-1,f+e+1)]-s[c+Math.max(0,f-e)]}for(let l=0;l<t;l++){let c=0;for(let h=-e;h<=e;h++)c+=o[Math.min(t-1,Math.max(0,h))*t+l];for(let h=0;h<t;h++)s[h*t+l]=c*r,c+=o[Math.min(t-1,h+e+1)*t+l]-o[Math.max(0,h-e)*t+l]}}return s}function Bl(i,t,e,n,s){let o=0;n[0]=0,s[0]=-1/0,s[1]=1/0;for(let r=1;r<t;r++){let a=(i[r]+r*r-(i[n[o]]+n[o]*n[o]))/(2*r-2*n[o]);for(;a<=s[o];)o--,a=(i[r]+r*r-(i[n[o]]+n[o]*n[o]))/(2*r-2*n[o]);o++,n[o]=r,s[o]=a,s[o+1]=1/0}o=0;for(let r=0;r<t;r++){for(;s[o+1]<r;)o++;const a=r-n[o];e[r]=a*a+i[n[o]]}}function Zg(i,t){const n=new Float64Array(i*i);for(let c=0;c<i*i;c++)n[c]=t(c)?0:1e20;const s=new Float64Array(i),o=new Float64Array(i),r=new Int32Array(i),a=new Float64Array(i+1);for(let c=0;c<i;c++){for(let h=0;h<i;h++)s[h]=n[h*i+c];Bl(s,i,o,r,a);for(let h=0;h<i;h++)n[h*i+c]=o[h]}const l=new Float32Array(i*i);for(let c=0;c<i;c++){const h=c*i;for(let f=0;f<i;f++)s[f]=n[h+f];Bl(s,i,o,r,a);for(let f=0;f<i;f++)l[h+f]=Math.sqrt(o[f])}return l}const Jg=[{name:"Koʻolau",gloss:"windward",from:345,to:105},{name:"Puna",gloss:"the sunrise side",from:105,to:165},{name:"Kona",gloss:"leeward",from:165,to:255},{name:"Waialua",gloss:"the northwest side",from:255,to:345}],Hl=[{key:"akua",name:"Wao akua",gloss:"realm of the gods"},{key:"nahele",name:"Wao nahele",gloss:"the forest"},{key:"kanaka",name:"Wao kanaka",gloss:"realm of people"},{key:"kula",name:"Kula",gloss:"open dry plains"},{key:"kahakai",name:"Kahakai",gloss:"the shore"},{key:"kohola",name:"Kai kohola",gloss:"reef shallows"},{key:"uli",name:"Kai uli",gloss:"deep blue sea"}];function Qg(i,t,e=!1){for(let n=0;n<t;n++){if(i.length<3)return i;const s=e?[]:[i[0]],o=i.length,r=e?o:o-1;for(let a=0;a<r;a++){const l=i[a],c=i[(a+1)%o];s.push([l[0]*.75+c[0]*.25,l[1]*.75+c[1]*.25]),s.push([l[0]*.25+c[0]*.75,l[1]*.25+c[1]*.75])}e||s.push(i[o-1]),i=s}return i}function Yc(i,t,e){let n=!1;for(let s=0,o=i.length-1;s<i.length;o=s++){const r=i[s],a=i[o];r[1]>e!=a[1]>e&&t<(a[0]-r[0])*(e-r[1])/(a[1]-r[1])+r[0]&&(n=!n)}return n}function tv(i){const t=new ze,e=bt("#8a7a62",.1,i),n=14;let s=[0,0,0];const o=.06;for(let h=1;h<=6;h++){const f=h/6*n,u=[o*Math.pow(f,1.5),f,0];t.cyl(s,u,.28-h*.02,.26-h*.025,e,nt.wood,6),s=u}const r=s,a=bt("#4c7a2c",.12,i),l=bt("#8f9a43",.1,i);for(let h=0;h<13;h++){const f=h/13*Math.PI*2+i()*.3,u=5.2+i()*1.2,d=1.4+i()*.8,g=Math.cos(f),v=Math.sin(f);let m=r;for(let p=1;p<=5;p++){const _=p/5,x=[r[0]+g*u*_,r[1]+d*_-3.8*_*_,r[2]+v*u*_],y=1*Math.sin(Math.PI*Math.min(1,_*1.1))+.15,w=-v*y,M=g*y,E=p>3?l:a;t.quad([m[0],m[1],m[2]],[x[0],x[1],x[2]],[x[0]+w,x[1]-.35*y,x[2]+M],[m[0]+w*.7,m[1]-.25*y,m[2]+M*.7],E,nt.leaf),t.quad([m[0]-w*.7,m[1]-.25*y,m[2]-M*.7],[x[0]-w,x[1]-.35*y,x[2]-M],[x[0],x[1],x[2]],[m[0],m[1],m[2]],E,nt.leaf),m=x}}const c=bt("#5c4a24",.1,i);for(let h=0;h<4;h++)t.blob(r[0]+Math.cos(h*1.7)*.4,r[1]-.6,r[2]+Math.sin(h*1.7)*.4,.3,.35,.3,c,nt.plain,h);return t.geometry()}function ls(i,{trunkH:t,crownR:e,color:n,trunkColor:s="#5a4636",blobs:o=3,flatten:r=1,red:a=0}){const l=new ze,c=bt(s,.1,i);l.cyl([0,0,0],[.3,t,.1],.35,.22,c,nt.wood,5);const h=[];for(let f=0;f<o;f++){const u=f/o*Math.PI*2+i(),d=f===0?0:e*.45,g=bt(n,.18,i),v=[.3+Math.cos(u)*d,t+e*.35*r+(f===0?e*.2:0),.1+Math.sin(u)*d,e*(f===0?1:.75),e*.62*r];h.push(v),l.blob(v[0],v[1],v[2],v[3],v[4],v[3],g,nt.leaf,f+i())}if(a>0)for(let f=0;f<a;f++){const[u,d,g,v,m]=h[Math.floor(i()*h.length)],p=i()*Math.PI*2,_=.15+i()*.75,x=Math.sqrt(1-_*_),y=bt(i()<.8?"#b3241c":"#d8452a",.2,i),w=.22+i()*.14;l.blob(u+Math.cos(p)*x*v*.97,d+_*m*.97,g+Math.sin(p)*x*v*.97,w,w*.75,w,y,nt.leaf,f,!0,0)}return l.geometry()}function ev(i,{trunkH:t,crownR:e,color:n,trunkColor:s="#5a4636",flatten:o=1}){const r=new ze;return r.cyl([0,0,0],[.3,t,.1],.4,.25,bt(s,.1,i),nt.wood,3),r.blob(.3,t+e*.42*o,.1,e*1.18,e*.7*o,e*1.18,bt(n,.12,i),nt.leaf,1,!0,0),r.geometry()}function nv(i,t){const e=new ze;return e.blob(0,.55,0,1.3,.8,1.3,bt(t,.15,i),nt.leaf,1,!0,0),e.geometry()}function iv(i){const t=new ze,e=bt("#6b5a45",.1,i),n=bt("#4f7036",.12,i);for(let s=0;s<4;s++){const o=s/4*Math.PI*2;t.cyl([Math.cos(o)*1.1,0,Math.sin(o)*1.1],[0,1.4,0],.08,.1,e,nt.wood,4)}t.cyl([0,1.2,0],[0,3.6,0],.22,.18,e,nt.wood,5);for(let s=0;s<3;s++){const o=s/3*Math.PI*2+.4,r=[Math.cos(o)*1.8,5.2,Math.sin(o)*1.8];t.cyl([0,3.5,0],r,.14,.1,e,nt.wood,4);for(let a=0;a<9;a++){const l=a/9*Math.PI*2,c=Math.cos(l),h=Math.sin(l),f=[r[0]+c*1.7,r[1]+.5-Math.abs(Math.sin(l))*.9,r[2]+h*1.7];t.tri([r[0]-h*.14,r[1],r[2]+c*.14],[r[0]+h*.14,r[1],r[2]-c*.14],f,n,nt.leaf)}}return t.geometry()}function sv(i){const t=new ze,e=bt("#7c9a4a",.1,i),n=bt("#6aa538",.12,i);for(let s=0;s<4;s++){const o=i()*Math.PI*2,r=i()*.6,a=Math.cos(o)*r,l=Math.sin(o)*r,c=2.4+i()*1.4;t.cyl([a,0,l],[a,c,l],.16,.12,e,nt.leaf,5);for(let h=0;h<4;h++){const f=i()*Math.PI*2,u=Math.cos(f),d=Math.sin(f),g=[a,c,l],v=[a+u*1.6,c+.7,l+d*1.6],m=[a+u*2.6,c-.2,l+d*2.6],p=-d*.45,_=u*.45;t.quad(g,[v[0]+p,v[1],v[2]+_],[m[0]+p*.6,m[1],m[2]+_*.6],m,n,nt.leaf),t.quad(g,m,[m[0]-p*.6,m[1],m[2]-_*.6],[v[0]-p,v[1],v[2]-_],n,nt.leaf)}}return t.geometry()}function Gl(i,t){const e=new ze,n=bt("#6b5a40",.1,i),s=bt(t?"#7d2b2f":"#3f7d32",.15,i);e.cyl([0,0,0],[.05,1.6,0],.05,.04,n,nt.wood,4);for(let o=0;o<9;o++){const r=o/9*Math.PI*2,a=Math.cos(r),l=Math.sin(r),c=.3+o%3*.25;e.quad([.05-l*.06,1.6,a*.06],[.05+l*.06,1.6,-a*.06],[.05+a*.9+l*.12,1.6+c,l*.9-a*.12],[.05+a*.9-l*.12,1.6+c,l*.9+a*.12],s,nt.leaf)}return e.geometry()}function Vl(i,t){const e=new ze;for(let n=0;n<3;n++)e.blob((i()-.5)*1.2,.5,(i()-.5)*1.2,.9,.7,.9,bt(t,.2,i),nt.leaf,n);return e.geometry()}const Wl=["niu","hala","ulu","kukui","maia","ki","kiRed","ohia","koa","wiliwili","naupaka","aalii"],cs=["ohia","koa","kukui","wiliwili","aalii"],Ae=2,ua=13.5,hs=[3.6,4.6];class ov{constructor(t){this.app=t;const e=As(t.island.meta.seed+5150);this.geoms={niu:tv(e),hala:iv(e),ulu:ls(e,{trunkH:5,crownR:4.2,color:"#2f5a26",blobs:3}),kukui:ls(e,{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468",blobs:5}),maia:sv(e),ki:Gl(e,!1),kiRed:Gl(e,!0),ohia:ls(e,{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038",blobs:5,red:16}),koa:ls(e,{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",blobs:5,flatten:.7}),wiliwili:ls(e,{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",blobs:3,flatten:.8}),naupaka:Vl(e,"#5f8a42"),aalii:Vl(e,"#8b7c4a")};const n={ohia:{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038"},koa:{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",flatten:.7},kukui:{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468"},wiliwili:{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",flatten:.8}};this.farGeoms={...Object.fromEntries(Object.entries(n).map(([s,o])=>[s,ev(e,o)])),aalii:nv(e,"#8b7c4a")},this.fixedMat=gs(t.shared,{fade:[34,48],close:.3,sway:1,doubleSide:!0}),this.forestMat=gs(t.shared,{fade:[hs[0],hs[1]],close:.3,sway:1}),this.forestFarMat=gs(t.shared,{fade:[ua-3.5,ua],fadeIn:hs,sway:1}),this.group=new ln,this.land=t.landTex.image.data,this.cleared=this.clearings(),this.fixed=this.placeFixed(e),this.meshes={};for(const s of Wl){const o=this.fixed[s];if(!o.length)continue;const r=new ms(this.geoms[s],this.fixedMat,o.length);this.writeInstances(r,o),r.frustumCulled=!1,this.group.add(r),this.meshes[s]=r}this.forest={near:{},far:{}};for(const s of cs)this.forest.near[s]=this.forestMesh(this.geoms[s],this.forestMat,2500),this.forest.far[s]=this.forestMesh(this.farGeoms[s],this.forestFarMat,9e3);this.tiles=new Map,this.frustum=new Es,this.projView=new Kt,this.box=new Mn,this.wanted=[],this.lastSelection=""}forestMesh(t,e,n){const s=new ms(t,e,n);return s.count=0,s.frustumCulled=!1,s.instanceMatrix.setUsage(Oi),s.instanceColor=new Yn(new Float32Array(n*3),3),s.instanceColor.setUsage(Oi),this.group.add(s),s}clearings(){const t=ee,e=new Uint8Array(t*t),n=Zt/t,s=(r,a,l)=>{const c=Math.max(0,Math.floor((r-l+xt)/n)),h=Math.min(t-1,Math.floor((r+l+xt)/n)),f=Math.max(0,Math.floor((a-l+xt)/n)),u=Math.min(t-1,Math.floor((a+l+xt)/n));for(let d=f;d<=u;d++)for(let g=c;g<=h;g++)e[d*t+g]=1},o=this.app.island.meta.sites;for(const r of o.loi)for(const a of r.paddies){s(a.c[0],a.c[1],.05);for(const l of a.poly)s(l[0],l[1],.03)}for(const r of o.houses)s(r.x,r.z,.12);for(const r of o.heiau)s(r.x,r.z,.5);for(const r of o.villages)s(r.x,r.z,.3);for(const r of this.app.island.meta.ahu)s(r.x,r.z,.3);for(const r of o.koa)s(r.x,r.z,.15);return e}isCleared(t,e){const n=ee,s=Math.floor((t+xt)/Zt*n),o=Math.floor((e+xt)/Zt*n);return s>=0&&o>=0&&s<n&&o<n&&this.cleared[o*n+s]===1}landAt(t,e){const n=ee,s=Math.floor((t+xt)/Zt*n),o=Math.floor((e+xt)/Zt*n);if(s<0||o<0||s>=n||o>=n)return null;const r=(o*n+s)*4,a=this.land;return{rain:a[r]/255,sand:a[r+1]/255,rip:a[r+2]/255,field:a[r+3]/255}}writeInstances(t,e){const n=new Kt,s=new jn,o=new z,r=new z,a=new Pt,l=new z(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];o.set(h.x,h.y,h.z),s.setFromAxisAngle(l,h.rot),r.setScalar(h.s),n.compose(o,s,r),t.setMatrixAt(c,n),a.setRGB(h.c,h.c*(.96+.08*((h.x*997+h.z*131)%1+1)%1),h.c),t.setColorAt(c,a)}t.count=e.length,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}placeFixed(t){const{terrain:e}=this.app,n=this.app.island.meta.sites,s=Object.fromEntries(Wl.map(c=>[c,[]])),o=n.houses,r=(c,h,f)=>!o.some(u=>Math.abs(u.x-c)<f&&Math.abs(u.z-h)<f&&Math.hypot(u.x-c,u.z-h)<f),a=(c,h,f,u=1)=>{const d=e.heightAt(h,f);return d<=.003?!1:(s[c].push({x:h,y:d,z:f,rot:t()*Math.PI*2,s:Pe*u*(.8+t()*.45),c:.85+t()*.3}),!0)};for(const c of n.villages){const h=c.alii?26:c.model?20:12;for(let f=0;f<h;f++){const u=t()*Math.PI*2,d=.12+t()*.7,g=c.x+Math.cos(u)*d,v=c.z+Math.sin(u)*d;if(!r(g,v,.09))continue;const m=this.landAt(g,v),p=m&&m.sand>.3||t()<.3?"niu":t()<.4?"ulu":t()<.5?"kukui":"maia";a(p,g,v)}for(let f=0;f<(c.model?24:10);f++){const u=o[Math.floor(t()*o.length)];if(u.village!==c.id)continue;const d=t()*Math.PI*2;a(t()<.75?"ki":"kiRed",u.x+Math.cos(d)*.08,u.z+Math.sin(d)*.08,.9)}}const l=this.app.island.meta.trail;for(let c=0;c<l.length;c++){const h=l[c];for(let f=0;f<3;f++){const u=h[0]+(t()-.5)*2.6,d=h[1]+(t()-.5)*2.6,g=this.landAt(u,d);if(!g)continue;const v=e.heightAt(u,d);v<=.003||v>.4||(g.sand>.4&&t()<.5?a("naupaka",u,d,.8):g.rain>.42&&t()<.5?a("hala",u,d):t()<.45?a("niu",u,d):g.rain<.3&&t()<.5&&a("aalii",u,d,.8))}}for(const c of n.loi){const h=c.paddies,f=(u,d,g)=>h.some(v=>Math.abs(v.c[0]-u)<.4&&Math.abs(v.c[1]-d)<.4&&(Yc(v.poly,u,d)||v.poly.some(m=>Math.hypot(m[0]-u,m[1]-d)<g)));for(let u=0;u<h.length;u+=2){const d=h[u],g=d.poly[Math.floor(t()*d.poly.length)],v=g[0]-d.c[0],m=g[1]-d.c[1],p=Math.hypot(v,m)||1,_=g[0]+v/p*.04,x=g[1]+m/p*.04;if(f(_,x,.025))continue;const y=t();y<.3?a("maia",_,x):y<.5&&!f(_+v/p*.1,x+m/p*.1,.08)?a("kukui",_+v/p*.1,x+m/p*.1):y<.75&&a(t()<.8?"ki":"kiRed",_,x,.9)}}return s}buildTile(t,e){const{terrain:n}=this.app,s=Math.round(Ae/.17),o=Ae/s,r=Object.fromEntries(cs.map(g=>[g,[]]));let a=1/0,l=-1/0;for(let g=0;g<s;g++)for(let v=0;v<s;v++){const m=t*s+g,p=e*s+v,_=An(m,p,11),x=An(m,p,12),y=(m+_)*o,w=(p+x)*o,M=this.landAt(y,w);if(!M||M.sand>.2||M.field>.3||this.isCleared(y,w))continue;const E=n.metresAt(y,w);if(E<3)continue;const R=M.rain+(An(m,p,3)-.5)*.12,S=Math.min(1,Math.max(0,(R-.3)/.22)),b=An(m,p,13);let I=null;if(b<S*.85?M.rip>.4&&E<450&&b<.5?I="kukui":E>600&&R>.45?I=An(m,p,7)<.7?"ohia":"koa":E>350?I=An(m,p,8)<.55?"koa":"ohia":I=R>.5?"ohia":"kukui":R<.3&&b<.08&&(I=E<500&&An(m,p,9)<.5?"wiliwili":"aalii"),!I||n.normalAt(y,w).y<.35&&An(m,p,5)<.7)continue;const V=n.heightAt(y,w);r[I].push(y,V,w,_*6.28,Pe*(.75+x*.6)*(I==="aalii"?.8:1),.82+b*.35,An(m,p,14)),a=Math.min(a,V),l=Math.max(l,V)}const c={};let h=0;for(const g of cs){const v=r[g],m=v.length/7,p=new Float32Array(m*16),_=new Float32Array(m*3);for(let x=0;x<m;x++){const[y,w,M,E,R,S,b]=v.slice(x*7,x*7+7),I=Math.cos(E)*R,V=Math.sin(E)*R;p.set([I,0,-V,0,0,R,0,0,V,0,I,0,y,w,M,1],x*16),_.set([S,S*(.96+.08*b),S],x*3)}c[g]={mat:p,col:_,n:m},h+=m}const f=t*Ae,u=e*Ae,d=h?new Mn(new z(f-.2,a,u-.2),new z(f+Ae+.2,l+.3,u+Ae+.2)):null;return{data:c,box:d,total:h}}update(t){const e=t.position,n=Math.max(0,this.app.terrain.heightAt(e.x,e.z)),s=e.y-n,o=s<14;for(const v in this.meshes)this.meshes[v].visible=s<60;this.group.visible=s<60;for(const v of cs)this.forest.near[v].visible=o,this.forest.far[v].visible=o;if(!o)return;t.updateMatrixWorld(),this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const r=ua,a=Math.floor((e.x-r)/Ae),l=Math.floor((e.x+r)/Ae),c=Math.floor((e.z-r)/Ae),h=Math.floor((e.z+r)/Ae),f=[],u=[],d=[];let g="";for(let v=a;v<=l;v++)for(let m=c;m<=h;m++){const p=v*Ae,_=m*Ae,x=Math.max(p-e.x,0,e.x-p-Ae),y=Math.max(_-e.z,0,e.z-_-Ae),w=Math.hypot(x,y);if(w>r)continue;const M=v*8192+m,E=this.tiles.get(M);if(!E){d.push([w,v,m]);continue}if(!E.box||!this.frustum.intersectsBox(E.box))continue;const R=Math.hypot(Math.max(Math.abs(p-e.x),Math.abs(p+Ae-e.x)),Math.max(Math.abs(_-e.z),Math.abs(_+Ae-e.z))),S=w<hs[1]+.3,b=R>hs[0]-.3;S&&f.push(E),b&&u.push(E),g+=`${M}${S?"n":""}${b?"f":""},`}d.sort((v,m)=>v[0]-m[0]);for(let v=0;v<Math.min(d.length,10);v++){const[,m,p]=d[v];this.tiles.set(m*8192+p,this.buildTile(m,p))}if(this.tiles.size>3e3)for(const[v,m]of this.tiles){const p=Math.floor(v/8192+.5),_=v-p*8192;Math.hypot((p+.5)*Ae-e.x,(_+.5)*Ae-e.z)>r*3&&this.tiles.delete(v)}g!==this.lastSelection&&(this.lastSelection=g,this.fill(this.forest.near,f),this.fill(this.forest.far,u))}fill(t,e){for(const n of cs){const s=t[n],o=s.instanceMatrix.count,r=s.instanceMatrix,a=s.instanceColor;let l=0;for(const c of e){const h=c.data[n];if(!h.n)continue;const f=Math.min(h.n,o-l);if(f<=0)break;r.array.set(f===h.n?h.mat:h.mat.subarray(0,f*16),l*16),a.array.set(f===h.n?h.col:h.col.subarray(0,f*3),l*3),l+=f}s.count=l,l&&(r.clearUpdateRanges(),r.addUpdateRange(0,l*16),r.needsUpdate=!0,a.clearUpdateRanges(),a.addUpdateRange(0,l*3),a.needsUpdate=!0)}}}function ql(i,t){const e=new ze,n=bt("#7a4b30",.1,t),s=bt("#b08a5a",.15,t);return i==="stand"?(e.box(-.12,0,0,.16,.85,.18,n,nt.skin,0,.8),e.box(.12,0,0,.16,.85,.18,n,nt.skin,0,.8),e.box(0,.78,0,.42,.32,.26,s,nt.plain),e.box(0,1.05,0,.44,.5,.24,n,nt.skin,0,.85),e.box(-.3,.88,0,.11,.62,.12,n,nt.skin),e.box(.3,.88,0,.11,.62,.12,n,nt.skin),e.blob(0,1.68,0,.13,.15,.13,bt("#3a2418",.1,t),nt.skin,1,!1)):i==="bend"?(e.box(-.12,0,0,.16,.8,.18,n,nt.skin,0,.8),e.box(.12,0,0,.16,.8,.18,n,nt.skin,0,.8),e.box(0,.72,.05,.42,.3,.3,s,nt.plain),e.hexa([[-.22,.75,.05],[.22,.75,.05],[.2,.8,.62],[-.2,.8,.62]],[[-.22,.95,.05],[.22,.95,.05],[.2,1.05,.62],[-.2,1.05,.62]],n,nt.skin),e.box(0,.78,.62,.4,.27,.1,n,nt.skin),e.box(-.24,.35,.6,.1,.5,.1,n,nt.skin),e.box(.24,.35,.6,.1,.5,.1,n,nt.skin),e.blob(0,1.02,.8,.13,.14,.14,bt("#3a2418",.1,t),nt.skin,2,!1)):(e.box(0,0,0,.6,.2,.42,s,nt.plain),e.box(0,.18,0,.42,.55,.24,n,nt.skin,0,.85),e.box(-.28,.2,.08,.1,.45,.1,n,nt.skin),e.box(.28,.2,.08,.1,.45,.1,n,nt.skin),e.blob(0,.86,0,.13,.15,.13,bt("#3a2418",.1,t),nt.skin,3,!1)),e.geometry()}function av(i){const t=new ze;return t.box(0,0,0,4.6,.12,.6,bt("#6b4630",.1,i),nt.wood,0,.85),t.geometry()}function rv(i){const t=new ze,e=bt("#1d1d22",.1,i),n=[[[0,0,.6],[-1.1,.25,-.1],[0,0,-.3]],[[0,0,.6],[0,0,-.3],[1.1,.25,-.1]],[[-1.1,.25,-.1],[-2,-.1,-.5],[-.6,.15,-.25]],[[1.1,.25,-.1],[.6,.15,-.25],[2,-.1,-.5]],[[0,0,-.3],[-.25,0,-1],[.25,0,-1]]];for(const[s,o,r]of n)t.tri(s,o,r,e,nt.plain),t.tri(s,r,o,e,nt.plain);return t.geometry()}const lv=`
in float aAge;
in float aSeed;
uniform float uTime;
uniform vec2 uWindVec;
out float vAlpha;
void main() {
  float t = fract(uTime * 0.05 + aSeed);
  vec3 p = position;
  p.y += t * 0.55;
  p.xz += uWindVec * t * t * 0.35 + vec2(sin(uTime * 0.7 + aSeed * 20.0), cos(uTime * 0.6 + aSeed * 13.0)) * 0.02 * t;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (14.0 + 60.0 * t) / max(-mv.z, 0.2) * 3.0;
  vAlpha = (1.0 - t) * smoothstep(0.0, 0.08, t) * 0.32;
}
`,cv=`
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
in float vAlpha;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float a = vAlpha * (1.0 - d);
  gl_FragColor = vec4((uSkyColor * 0.8 + uSunColor * 0.25) * 0.9, a);
}
`;class hv{constructor(t){this.app=t,this._m=new Kt,this._q=new jn,this._p=new z,this._s=new z,this._e=new qi,this._c=new Pt;const e=t.island.meta,n=e.sites,s=As(e.seed+2024);this.rand=s,this.group=new ln,this.mat=gs(t.shared,{fade:[24,34]});const o=t.terrain,r=(w,M)=>Math.max(0,o.heightAt(w,M));this.people={stand:[],bend:[],sit:[]};const a=(w,M,E,R,S=null,b=1)=>this.people[w].push({x:M,z:E,y:S??r(M,E),rot:R,ph:s()*6.28,tint:b});for(const w of n.loi){const M=w.model?16:5;for(let E=0;E<M;E++){const R=w.paddies[Math.floor(s()*w.paddies.length)];if(!R.flood)continue;const S=R.poly[Math.floor(s()*R.poly.length)],b=s()*.7;let I=R.c[0]+(S[0]-R.c[0])*b,V=R.c[1]+(S[1]-R.c[1])*b;Yc(R.poly,I,V)||([I,V]=R.c),a("bend",I,V,s()*6.28,(R.level-.25)*.013)}}for(const w of n.villages){const M=w.model?12:w.alii?14:4;for(let E=0;E<M;E++){const R=s()*6.28,S=.04+s()*.25;a(s()<.5?"sit":"stand",w.x+Math.cos(R)*S,w.z+Math.sin(R)*S,s()*6.28)}}for(const w of n.heiau.filter(M=>M.model||M.kind==="luakini"))for(let M=0;M<3;M++)a("stand",w.x+(s()-.5)*.12,w.z+(s()-.5)*.08,w.rot+Math.PI,r(w.x,w.z)+.07,2.4);for(const w of n.canoes)for(let M=0;M<(w.village===n.model?5:2);M++)a("stand",w.x+(s()-.5)*.2,w.z+(s()-.5)*.2,w.dir+Math.PI+(s()-.5));for(const w of n.ponds){const M=w.wall[Math.round(w.gates[0]*(w.wall.length-1))];a("stand",M[0]-w.ax*.02,M[1]-w.az*.02,Math.atan2(w.az,w.ax),.02)}this.poseMeshes={};for(const w of["stand","bend","sit"]){const M=this.people[w],E=Math.max(1,M.length+(w==="stand"?40:0)),R=new ms(ql(w,s),this.mat,E);R.instanceColor=new Yn(new Float32Array(E*3).fill(1),3),R.frustumCulled=!1,R.instanceMatrix.setUsage(Oi),this.group.add(R),this.poseMeshes[w]=R}this.writeStatic(),this.trail=e.trail.slice();let l=0;for(let w=0;w<this.trail.length;w++){const M=this.trail[w],E=this.trail[(w+1)%this.trail.length];l+=M[0]*E[1]-E[0]*M[1]}l<0&&this.trail.reverse(),this.trailLen=[0];for(let w=1;w<=this.trail.length;w++){const M=this.trail[w-1],E=this.trail[w%this.trail.length];this.trailLen.push(this.trailLen[w-1]+Math.hypot(E[0]-M[0],E[1]-M[1]))}const c=n.alii||n.villages[0];let h=0,f=1/0;for(let w=0;w<this.trail.length;w++){const M=Math.hypot(this.trail[w][0]-c.x,this.trail[w][1]-c.z);M<f&&(f=M,h=this.trailLen[w])}this.procS=h-.6;const u=new ze;Vg(u,s),this.akua=new te(u.geometry(),this.mat),this.akua.frustumCulled=!1,this.group.add(this.akua),this.boats=[];const d=(()=>{const w=new ze;return Wc(w,s,8),w.geometry()})(),g=ql("sit",s),v=e.ahupuaa.find(w=>w.id===n.model);for(let w=0;w<4;w++){const M=n.canoes[w%n.canoes.length],E=w<3&&v?v.mouth:[M.x,M.z],R=w<3?Math.atan2(v.mouth[1]-v.topZ,v.mouth[0]-v.topX):M.dir,S=5+s()*5,b=E[0]+Math.cos(R)*S+(s()-.5)*3,I=E[1]+Math.sin(R)*S+(s()-.5)*3;if(o.heightAt(b,I)>-.02)continue;const V=new ln,X=new te(d,this.mat);X.scale.setScalar(Pe),V.add(X);for(const T of[-1.6,1.4]){const P=new te(g,this.mat);P.scale.setScalar(Pe),P.position.set(T*Pe,.45*Pe,0),P.rotation.y=Math.PI/2,V.add(P)}V.position.set(b,0,I),V.rotation.y=s()*6.28,this.group.add(V),this.boats.push({g:V,x:b,z:I,ph:s()*6.28,drift:s()*6.28,crew:2})}const m=new ze;qc(m,s),this.voyager=new te(m.geometry(),this.mat),this.voyager.scale.setScalar(Pe),this.voyager.frustumCulled=!1,this.group.add(this.voyager),this.voyagerS=0,this.surfers=[];const p=av(s);this.boards=new ms(p,this.mat,24),this.boards.frustumCulled=!1,this.boards.instanceMatrix.setUsage(Oi),this.group.add(this.boards);for(const w of n.surf)for(let M=0;M<4;M++)this.surfers.push({s:w,ph:s(),lane:(s()-.5)*.5});this.birds=new ms(rv(s),this.mat,12),this.birds.frustumCulled=!1,this.birds.instanceMatrix.setUsage(Oi),this.group.add(this.birds),this.birdCentres=[];for(let w=0;w<12;w++){const M=n.villages[Math.floor(s()*n.villages.length)];this.birdCentres.push({x:M.x+(s()-.5)*6,z:M.z+(s()-.5)*6,r:.6+s()*1.4,h:.9+s()*1.4,ph:s()*6.28,sp:.08+s()*.06})}const _=[],x=[];for(const w of n.villages)for(let M=0;M<14;M++)_.push(w.x+.05,r(w.x,w.z)+.01,w.z+.05),x.push(M/14+s()*.05);const y=new Re;y.setAttribute("position",new re(_,3)),y.setAttribute("aSeed",new re(x,1)),y.setAttribute("aAge",new re(new Float32Array(x.length),1)),this.smoke=new Rc(y,new ve({vertexShader:lv,fragmentShader:cv,uniforms:{uTime:t.shared.uniforms.uTime,uWindVec:t.shared.uniforms.uWindVec,uSkyColor:t.shared.uniforms.uSkyColor,uSunColor:t.shared.uniforms.uSunColor},transparent:!0,depthWrite:!1})),this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,this.group.add(this.smoke),this._m=new Kt,this._q=new jn,this._p=new z,this._s=new z,this._e=new qi,this._c=new Pt}writeStatic(){for(const t in this.people){const e=this.poseMeshes[t],n=this.people[t];for(let s=0;s<n.length;s++)this.setInstance(e,s,n[s].x,n[s].y,n[s].z,n[s].rot,Pe,n[s].tint);e.count=n.length,e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}}setInstance(t,e,n,s,o,r,a,l=1,c=0){this._p.set(n,s,o),this._e.set(c,r,0,"YXZ"),this._q.setFromEuler(this._e),this._s.setScalar(a),this._m.compose(this._p,this._q,this._s),t.setMatrixAt(e,this._m),(l!==1||t.instanceColor)&&t.setColorAt(e,this._c.setRGB(l,l,l))}walkTo(t,e){let n=0,s=1/0;for(let o=0;o<this.trail.length;o++){const r=Math.hypot(this.trail[o][0]-t,this.trail[o][1]-e);r<s&&(s=r,n=this.trailLen[o])}this.procS=n-.12}trailPoint(t){const e=this.trailLen[this.trailLen.length-1];t=(t%e+e)%e;let n=0,s=this.trailLen.length-1;for(;n<s-1;){const l=n+s>>1;this.trailLen[l]<=t?n=l:s=l}const o=this.trail[n%this.trail.length],r=this.trail[(n+1)%this.trail.length],a=(t-this.trailLen[n])/Math.max(1e-6,this.trailLen[n+1]-this.trailLen[n]);return[o[0]+(r[0]-o[0])*a,o[1]+(r[1]-o[1])*a,Math.atan2(r[0]-o[0],r[1]-o[1])]}update(t,e){const n=this.app,s=n.terrain,o=n.camera.position,r=o.y-Math.max(0,s.heightAt(o.x,o.z))<30;if(this.group.visible=r,!r)return;const a=n.season==="hooilo",l=this.poseMeshes.stand;let c=this.people.stand.length;if(this.akua.visible=a,a){this.procS+=t*.0035*Math.max(1,Math.min(8,n.clock.speed/20));for(let d=0;d<11;d++){const[g,v,m]=this.trailPoint(this.procS-d*.035),p=Math.max(0,s.heightAt(g,v))+Math.abs(Math.sin(e*4.2+d))*.0012;this.setInstance(l,c++,g,p,v,m,Pe,d===5?2.2:1),d===5&&(this.akua.position.set(g,p,v),this.akua.rotation.y=m,this.akua.scale.setScalar(Pe))}}let h=0;for(const d of this.surfers){const g=d.s,v=(e*.06+d.ph)%1,m=-Math.sin(g.dir),p=Math.cos(g.dir),_=(v-.5)*.9+d.lane,x=v*.15,y=g.x+m*_-Math.cos(g.dir)*x,w=g.z+p*_-Math.sin(g.dir)*x,M=Math.atan2(m,p)+(d.lane>0?0:Math.PI),E=.002+Math.sin(e*2+d.ph*9)*8e-4;this.setInstance(this.boards,h++,y,E,w,M+Math.PI/2,Pe,1,Math.sin(e*1.3+d.ph)*.06),this.setInstance(l,c++,y,E+.0025,w,M,Pe*.95,1)}this.boards.count=h,this.boards.instanceMatrix.needsUpdate=!0,l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0);for(const d of this.boats)d.g.position.x=d.x+Math.sin(e*.05+d.drift)*.6,d.g.position.z=d.z+Math.cos(e*.04+d.drift)*.6,d.g.position.y=Math.sin(e*1.3+d.ph)*.0015,d.g.rotation.z=Math.sin(e*1.1+d.ph)*.04,d.g.rotation.y+=t*.02;this.voyagerS+=t*.004;const f=155,u=this.voyagerS;this.voyager.position.set(Math.cos(u)*f*.95+10,Math.sin(e*.9)*.002,Math.sin(u)*f*.7),this.voyager.rotation.y=-u-Math.PI/2,this.voyager.rotation.x=.06;for(let d=0;d<this.birdCentres.length;d++){const g=this.birdCentres[d],v=g.ph+e*g.sp,m=g.x+Math.cos(v)*g.r,p=g.z+Math.sin(v)*g.r,_=Math.max(0,s.heightAt(m,p))+g.h+Math.sin(e*.3+d)*.1;this.setInstance(this.birds,d,m,_,p,-v,Pe*1.4,1,.3)}this.birds.count=this.birdCentres.length,this.birds.instanceMatrix.needsUpdate=!0}}function jc(i,t){const e=new Set,n=.2,s=(u,d)=>Math.floor(u/n)*100003+Math.floor(d/n),o=(u,d)=>{for(let g=-2;g<=2;g++)for(let v=-2;v<=2;v++)if(e.has(s(u+v*n,d+g*n)))return!0;return!1},r=u=>{for(let d=1;d<u.length;d++){const[g,v]=u[d-1],[m,p]=u[d],_=Math.ceil(Math.hypot(m-g,p-v)/(n*.5));for(let x=0;x<=_;x++)e.add(s(g+(m-g)*x/_,v+(p-v)*x/_))}},a=ee,l=Zt/a,c=(u,d)=>{const g=Math.floor((u+xt)/l),v=Math.floor((d+xt)/l);let m=0;for(let p=Math.max(0,v-1);p<=Math.min(a-1,v+1);p++)for(let _=Math.max(0,g-1);_<=Math.min(a-1,g+1);_++)m=Math.max(m,t.area[p*a+_]);return m},h=[],f=i.streams.map((u,d)=>({s:u,k:d})).filter(({s:u})=>u.area>=.9&&u.pts.length>=3).sort((u,d)=>d.s.area-u.s.area);for(const{s:u,k:d}of f){let g=u.pts.length;for(let x=0;x<u.pts.length;x++)if(o(u.pts[x][0],u.pts[x][1])){g=x+1;break}if(g<3)continue;let v=u.pts.slice(0,g).map(x=>[x[0],x[1]]);r(v),v=Qg(v,2);const m=new Float32Array(v.length),p=new Float32Array(v.length);let _=0;for(let x=0;x<v.length;x++)x>0&&(m[x]=m[x-1]+Math.hypot(v[x][0]-v[x-1][0],v[x][1]-v[x-1][1])),_=Math.max(_,c(v[x][0],v[x][1])),p[x]=_;h.push({src:d,pts:v,along:m,area:p,lineA:u.area})}return h}const uv=`
${Ne}
in vec3 aFlow; // x along-stream distance, y perennial (0..1), z steepness (0..1)
in float aSide;
in float aFade; // 1, or less where a waterfall takes over
uniform sampler2D uWeather;
uniform vec4 uWeatherRect;
out vec3 vWorld;
out vec3 vFlow;
out float vSide;
out float vWet;
out float vFade;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  // far off, the terrain's coarser LOD fills the narrow channels in; draw the
  // water a little toward the eye so it isn't swallowed by its own valley
  vec3 toCam = cameraPosition - wp.xyz;
  float dc = length(toCam);
  wp.xyz += toCam / max(dc, 1e-3) * min(dc * 0.015, 1.2);
  vFlow = aFlow;
  vSide = aSide;
  vFade = aFade;
  vec4 w = texture(uWeather, (wp.xz - uWeatherRect.xy) / uWeatherRect.zw);
  vWet = w.b; // the ground's memory of recent rain
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,fv=`
${Ne}
${zn}
${cn}
${Nn}
uniform float uFlowAll; // island-wide recent rain
in vec3 vWorld;
in vec3 vFlow;
in float vSide;
in float vWet;
in float vFade;
void main() {
  if (vFade < 0.003) discard;
  float flow = clamp(vFlow.y + vWet * 1.4 + uFlowAll * 0.5, 0.0, 1.0);
  if (flow < 0.06) discard;
  // the wetted width grows with the flow; edges thin out
  float edge = 1.0 - smoothstep(flow * 0.3, flow * 0.55 + 0.4, abs(vSide));
  if (edge <= 0.01) discard;
  float steep = vFlow.z;
  vec3 V = normalize(cameraPosition - vWorld);
  vec2 q = vec2(vFlow.x * 18.0 - uTime * (2.0 + steep * 6.0), vSide * 3.0);
  float n = vnoise(q) * 0.6 + vnoise(q * 2.7 + 3.0) * 0.4;
  vec3 N = normalize(vec3((n - 0.5) * 0.3, 1.0, (vnoise(q + 7.0) - 0.5) * 0.3));
  float F = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  float vis = sunVisibility(vWorld);
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor;
  vec3 water = mix(vec3(0.05, 0.07, 0.06) * light, skyMap(reflect(-V, N)) * 0.7, F * 0.6);
  // whitewater on the steeps and in spate
  float white = smoothstep(0.35, 0.8, steep + flow * 0.15) * (0.4 + 0.6 * n);
  white = max(white, smoothstep(0.75, 1.0, flow) * 0.25 * n);
  vec3 foam = vec3(0.72, 0.76, 0.78) * light;
  vec3 col = mix(water, foam, clamp(white, 0.0, 1.0));
  // falls break up into streaks and spray; flat reaches are glassy
  float streaks = mix(1.0, 0.45 + 0.55 * smoothstep(0.2, 0.7, vnoise(vec2(vSide * 9.0, vFlow.x * 4.0 - uTime * 3.0))), steep);
  float a = edge * mix(0.7, 0.55, steep) * streaks * smoothstep(0.06, 0.3, flow) * vFade;
  // fade with distance so far-off falls are a sheen, not a painted line
  a *= 1.0 - smoothstep(12.0, 60.0, distance(cameraPosition, vWorld)) * 0.8;
  gl_FragColor = vec4(col, a);
}
`;function dv(i,t){let e=1;for(const n of i){if(t>n.h0&&t<n.h1)return 0;t<=n.h0&&n.r0>0&&(e=Math.min(e,1-Xl(((t-(n.h0-n.r0))/n.r0-.15)/.85))),t>=n.h1&&n.r1>0&&(e=Math.min(e,Xl((t-n.h1)/n.r1/.85)))}return e}const Xl=i=>i<=0?0:i>=1?1:i*i*(3-2*i);function pv(i,t){const e=[],n=[],s=[],o=[],r=c=>t.some(h=>c>h.h0+1e-6&&c<h.h1-1e-6),a=t.flatMap(c=>[c.h0-c.r0,c.h0-c.r0*.85,c.h0-c.r0*.45,c.h0,c.h1,c.h1+c.r1*.4,c.h1+c.r1*.85,c.h1+c.r1]).sort((c,h)=>c-h),l=(c,h,f)=>{e.push(c),n.push(h),s.push(f),o.push(f?0:dv(t,h))};for(let c=0;c<i.pts.length;c++){if(c>0){const h=i.along[c-1],f=i.along[c];for(const u of a){if(u<=h+1e-6||u>=f-1e-6)continue;const d=(u-h)/(f-h),g=i.pts[c-1],v=i.pts[c];l([g[0]+(v[0]-g[0])*d,g[1]+(v[1]-g[1])*d],u,!1)}}l(i.pts[c],i.along[c],r(i.along[c]))}return{pts:e,along:n,gone:s,fade:o}}class mv{constructor(t){var d,g;const e=t.island.meta,n=t.terrain,s=[],o=[],r=[],a=[],l=[];let c=0;const h=((d=t.wailele)==null?void 0:d.lines)||jc(e,t.island.data),f=(g=t.wailele)==null?void 0:g.cuts;this.cutTris=0;for(let v=0;v<h.length;v++){const m=(f==null?void 0:f.get(v))||[],{pts:p,along:_,gone:x,fade:y}=pv(h[v],m),w=h[v].lineA,M=Math.min(1,Math.max(0,(Math.log10(w)-.35)/.9)),E=Math.min(.11,.009*Math.sqrt(w)+.012),R=m.map(P=>P.h1);let S=1/0,b=-1,I=!1,V=1/0,X=1/0;const T=[1/0,1/0];for(let P=0;P<p.length;P++){const G=p[Math.max(0,P-1)],U=p[Math.min(p.length-1,P+1)],k=U[0]-G[0],O=U[1]-G[1],C=Math.hypot(k,O)||1,B=-O/C,Z=k/C,N=_[P],j=p[P][0],$=p[P][1];let J=n.metresAt(j,$);if(J<-.5)break;if(x[P]){I=!1,V=X=T[0]=T[1]=1/0;continue}for(const F of m)F.level!==void 0&&Math.abs(N-F.h1)<1e-6&&(S=F.level,b=F.h1+1);N<=b&&(J=Math.min(J,S),S=J),J=V=Math.min(J,V);const ct=p[Math.min(p.length-1,P+2)],ht=(J-n.metresAt(ct[0],ct[1]))/Math.max(10,Math.hypot(ct[0]-j,ct[1]-$)*100);let W=Math.min(1,Math.max(0,(ht-.08)/.5));for(const F of R)N>F-1e-6&&N<=F+.4&&(W=Math.max(W,1-(N-F)/.4));const q=E*(1+W*.4),it=X=Math.min(X,Math.max(J,0)*Nt+.012+W*.03);for(const F of[-1,1]){const pt=j+B*q*F,at=$+Z*q*F;let ft=Math.max(0,n.metresAt(pt,at))*Nt+.003;m.length&&(ft=Math.min(ft,it+.04));const ut=F+1>>1;ft=T[ut]=Math.max(it,Math.min(ft,T[ut])),s.push(pt,ft,at),o.push(N,M,W),r.push(F),a.push(y[P])}if(I){l.push(c-2,c-1,c,c-1,c+1,c);const F=_[P-1];m.some(({h0:pt,h1:at})=>F>pt+1e-6&&F<at-1e-6||N>pt+1e-6&&N<at-1e-6||F<pt-1e-6&&N>at+1e-6)&&(this.cutTris+=2)}I=!0,c+=2}}const u=new Re;u.setAttribute("position",new re(s,3)),u.setAttribute("aFlow",new re(o,3)),u.setAttribute("aSide",new re(r,1)),u.setAttribute("aFade",new re(a,1)),u.setIndex(l),u.computeBoundingSphere(),this.uniforms={...t.shared.uniforms,uFlowAll:{value:0}},this.material=new ve({vertexShader:uv,fragmentShader:fv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new te(u,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.app=t}update(){const t=this.app.weather,e=Math.min(1,t.rainTotal/600);this.uniforms.uFlowAll.value+=(e-this.uniforms.uFlowAll.value)*.01;const n=this.app.camera.position;this.mesh.visible=n.y-Math.max(0,this.app.terrain.heightAt(n.x,n.z))<90}}const qe=Zt/_n,$t=Zt/ee,$c=qe*.5,gv=.12,vv=1.6,ae=(i,t,e)=>i<t?t:i>e?e:i,en=(i,t,e)=>{const n=ae((e-i)/(t-i),0,1);return n*n*(3-2*n)},xv=i=>i-Math.PI*2*Math.round(i/(Math.PI*2)),Xe=i=>{const t=Math.sin(i*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Yl(i,t,e,n){let s=(e+xt)/Zt*t-.5,o=(n+xt)/Zt*t-.5;s<0&&(s=0),o<0&&(o=0),s>t-1.001&&(s=t-1.001),o>t-1.001&&(o=t-1.001);const r=s|0,a=o|0,l=s-r,c=o-a,h=a*t+r,f=i[h]+(i[h+1]-i[h])*l,u=i[h+t]+(i[h+t+1]-i[h+t])*l;return f+(u-f)*c}const ho=(i,t)=>{const e=ae(Math.floor((i+xt)/$t),0,ee-1);return ae(Math.floor((t+xt)/$t),0,ee-1)*ee+e};function Hi(i,t,e,n,s,o){const r=s-e,a=o-n,l=r*r+a*a||1e-9,c=ae(((i-e)*r+(t-n)*a)/l,0,1);return Math.hypot(e+r*c-i,n+a*c-t)}function _v(i,t,e){let n=1/0;for(let s=1;s<e.length;s++)n=Math.min(n,Hi(i,t,e[s-1][0],e[s-1][1],e[s][0],e[s][1]));return n}function Kc(i,t){const e=t*t/19.62;return i<=e?Math.sqrt(Math.max(0,i)/4.905):t/9.81+(i-e)/t}function gn(i,t,e=[0,0]){const{pts:n,along:s}=i,o=n.length;if(t<=0)return e[0]=n[0][0],e[1]=n[0][1],0;let r=0,a=o-1;if(t>=s[a])return e[0]=n[a][0],e[1]=n[a][1],a-1;for(;a-r>1;){const c=r+a>>1;s[c]<=t?r=c:a=c}const l=(t-s[r])/(s[a]-s[r]||1);return e[0]=n[r][0]+(n[a][0]-n[r][0])*l,e[1]=n[r][1]+(n[a][1]-n[r][1])*l,r}const so=.1;function jl(i,t,e){const n=[],s=[0,0];for(let o=0;o<i.length;o++){const r=i[o],a=r.along[r.along.length-1],l=Math.floor(a/so)+1;if(l<8)continue;const c=new Float64Array(l),h=new Float64Array(l),f=new Float64Array(l),u=new Int32Array(l);for(let m=0;m<l;m++)u[m]=gn(r,m*so,s),c[m]=s[0],h[m]=s[1],f[m]=t(s[0],s[1]);const d=l-4,g=new Float64Array(l);for(let m=0;m<d;m++)g[m]=(f[m]-f[m+4])/40;let v=0;for(;v<d;){if(!(g[v]>.8)||f[v]<2){v++;continue}const m=v;let p=v;for(;p<d&&g[p]>.8;)p++;let _=p-1;const x=[];for(;;){let b=_+1;for(;b<d&&g[b]<=.8&&b-(_+1)<=5;)b++;if(b<d&&g[b]>.8&&b-(_+1)<=5){for(x.push(_+1);b<d&&g[b]>.8;)b++;_=b-1}else break}v=_+1;let y=m,w=-1/0;for(let b=Math.max(1,m-2);b<=m;b++){const I=g[b+1]-g[b-1];I>w&&(w=I,y=b)}let M=Math.min(l-1,_+4);for(let b=_;b<=Math.min(l-3,_+4);b++)if(g[b]<.3&&g[b+1]<.3&&g[b+2]<.3){M=b;break}const E=f[y]-f[M];if(E<60)continue;let R=!1;for(let b=y;b<=M&&!R;b++)e(c[b],h[b])&&(R=!0);if(R)continue;const S=r.area[u[y]];n.push({laid:o,sLip:y*so,sBase:M*so,lip:[c[y],f[y],h[y]],base:[c[M],f[M],h[M]],drop:E,A:S,per:ae((Math.log10(S)-.35)/.9,0,1),ledges:x.filter(b=>b>y&&b<M).map(b=>f[y]-f[b]).filter(b=>b>8&&b<E-8),samples:{xs:c,zs:h,hs:f,i0:y,i1:M}})}}return n}function Mv(i,t={}){const e=t.carve!==!1,n=performance.now(),{data:s,meta:o}=i,r=s.height,a=(C,B)=>Yl(r,_n,C,B),l=(C,B)=>Yl(s.height1024,ee,C,B),c=jc(o,s),h=performance.now(),f=new Uint8Array(ee*ee);let u=!1;const d=[];for(const C of o.sites.loi)for(const B of C.paddies){const[Z,N]=B.c;if(d.push([Z,N]),B.level<l(Z,N)-25){u=!0;const j=.3;for(let $=Math.floor((N-j+xt)/$t);$<=Math.floor((N+j+xt)/$t);$++)for(let J=Math.floor((Z-j+xt)/$t);J<=Math.floor((Z+j+xt)/$t);J++)J<0||$<0||J>=ee||$>=ee||Math.hypot(-xt+(J+.5)*$t-Z,-xt+($+.5)*$t-N)<=j&&(f[$*ee+J]=1)}}const g=(C,B)=>f[ho(C,B)]?l(C,B):a(C,B),v=[...o.sites.houses.map(C=>[C.x,C.z]),...o.sites.villages.map(C=>[C.x,C.z]),...o.sites.heiau.map(C=>[C.x,C.z]),...d],m=(C,B)=>f[ho(C,B)]===1;let p=jl(c,g,m);const _=performance.now(),x=o.ahupuaa.find(C=>C.id===o.sites.model),y=(x==null?void 0:x.trunk)||[],w=y.map(C=>[C[0],C[1]]),M=[];for(const C of p){const Z=w.length>1&&_v(C.lip[0],C.lip[2],w)<1.5&&C.A>=2&&C.drop>=100;if(!Z&&!(C.A>=3&&C.drop>=120))continue;const{xs:N,zs:j,hs:$,i0:J,i1:ct}=C.samples;let ht=-1;for(let dt=ct;dt>J;dt--){let Et=!0;for(let Rt=J+1;Rt<dt&&Et;Rt++)Hi(N[Rt],j[Rt],N[J],j[J],N[dt],j[dt])>.35&&(Et=!1);if(Et){ht=dt;break}}if(ht<0)continue;const W=[N[J],j[J]],q=[N[ht],j[ht]],it=Math.hypot(q[0]-W[0],q[1]-W[1]),F=$[J]-$[ht];if(F<100||it<.6)continue;const pt=(q[0]-W[0])/it,at=(q[1]-W[1])/it,ft=$l(F,C.A,C.per),ut=[W[0]+pt*ft.sLand,W[1]+at*ft.sLand],Ot=ft.wBase;let Ct=!1;const D=Ot+.5,A=Math.floor((Math.min(W[0],q[0])-D+xt)/$t),K=Math.floor((Math.max(W[0],q[0])+D+xt)/$t),rt=Math.floor((Math.min(W[1],q[1])-D+xt)/$t),st=Math.floor((Math.max(W[1],q[1])+D+xt)/$t);for(let dt=Math.max(0,rt);dt<=Math.min(ee-1,st)&&!Ct;dt++)for(let Et=Math.max(0,A);Et<=Math.min(ee-1,K)&&!Ct;Et++){if(!f[dt*ee+Et])continue;const Rt=-xt+(Et+.5)*$t,ot=-xt+(dt+.5)*$t;(Hi(Rt,ot,W[0],W[1],q[0],q[1])<=Ot||Math.hypot(Rt-ut[0],ot-ut[1])<=ft.poolR+.5)&&(Ct=!0)}if(Ct||v.some(dt=>Hi(dt[0],dt[1],W[0],W[1],q[0],q[1])<=Ot+.3))continue;const lt=$[ht],wt=$[J],mt=Math.pow(F,.7)*Math.sqrt(C.A)*(lt<650?1.5:.6)*(wt<700?1.3:1)*(Z?3:1);M.push({f:C,L:W,B:q,len:it,D:F,b:ht,isModel:Z,score:mt,ux:pt,uz:at})}M.sort((C,B)=>B.score-C.score);const E=[];for(const C of M){if(E.length>=4)break;E.some(B=>Math.hypot(B.L[0]-C.L[0],B.L[1]-C.L[1])<8)||E.push(C)}let R=E.findIndex(C=>C.isModel);if(R<0&&E.length){let C=y[0];for(const N of y)Math.abs(N[2]-260)<Math.abs(C[2]-260)&&(C=N);const B=C?C[0]:0,Z=C?C[1]:0;R=0;for(let N=1;N<E.length;N++)Math.hypot(E[N].L[0]-B,E[N].L[1]-Z)<Math.hypot(E[R].L[0]-B,E[R].L[1]-Z)&&(R=N)}R>0&&E.unshift(E.splice(R,1)[0]);const S=[],b=[];for(const C of E){const B=C.f,Z=c[B.laid],N=C.f.samples.hs[C.f.samples.i0],j=C.f.samples.hs[C.b],$=$l(C.D,B.A,B.per);e&&S.push(yv(r,s.normals,C.L,C.B,N,j,$,v));const J=a(C.L[0],C.L[1]),ct=a(C.B[0],C.B[1]),ht=C.L[0]+C.ux*$.sLand,W=C.L[1]+C.uz*$.sLand;let q=1/0;for(let ft=0;ft<16;ft++){const ut=ft/16*Math.PI*2;q=Math.min(q,a(ht+Math.cos(ut)*$.poolR,W+Math.sin(ut)*$.poolR))}const it=a(ht,W),F=Math.max(q-.5,it+1);let pt=B.sLip,at=1/0;for(let ft=0;ft<Z.pts.length;ft++){const ut=Math.hypot(Z.pts[ft][0]-ht,Z.pts[ft][1]-W);ut<at&&Z.along[ft]>=B.sLip&&(at=ut,pt=Z.along[ft])}b.push({kind:0,laid:B.laid,src:Z.src,sLip:B.sLip,sBase:B.sLip+C.len,sPool:pt,lip:[C.L[0],J,C.L[1]],base:[C.B[0],ct,C.B[1]],drop:J-F,A:B.A,per:B.per,ledges:[],model:C.isModel,face:[C.ux,C.uz],pool:[ht,F,W],poolR:$.poolR,carve:{faceRun:$.faceRun,faceFrac:$.faceFrac,wFace:$.wFace,sLand:$.sLand,yF:j+(1-$.faceFrac)*(N-j)}})}const I=performance.now();S.length&&(p=jl(c,g,m));const V=[];for(const C of p)b.some(B=>B.laid===C.laid&&C.sBase>=B.sLip-.1&&C.sLip<=B.sPool||Math.hypot(B.lip[0]-C.lip[0],B.lip[2]-C.lip[2])<.4)||(delete C.samples,C.kind=1,C.src=c[C.laid].src,V.push(C));V.sort((C,B)=>B.drop-C.drop);const X=[...b,...V].slice(0,uo);for(const C of X)C.rain=s.rain[ho(C.lip[0],C.lip[2])],C.ribbonA=c[C.laid].lineA;const T=performance.now(),P=wv(c,X,s,a),G=performance.now(),U=new Map,k=(C,B,Z,N,j,$)=>{U.has(C)||U.set(C,[]),U.get(C).push({h0:B,h1:Z,r0:N,r1:j,level:$})};for(const C of X){let B=C.kind===0?C.sPool:C.sBase;if(C.kind===0&&e){const{pts:J,along:ct}=c[C.laid];for(let ht=0;ht<J.length;ht++){if(ct[ht]<=B||ct[ht]>C.sPool+1.2)continue;const W=J[ht][0]-C.lip[0],q=J[ht][1]-C.lip[2],it=W*C.face[0]+q*C.face[1];if(a(J[ht][0],J[ht][1])-a(C.lip[0]+C.face[0]*it,C.lip[2]+C.face[1]*it)>4)B=ct[Math.min(J.length-1,ht+1)];else break}}const Z=Math.max(0,C.sLip-(C.kind===0?.06:.03)),N=C.kind===0?C.sLip:Math.min(C.sLip+.12,(C.sLip+C.sBase)/2),j=C.kind===0?B:Math.max(N,B-.15),$=C.kind===0?.05:B-j;k(C.laid,N,j,N-Z,$,C.kind===0?C.pool[1]:void 0),C.hand={a:Z,b:N,c:C.kind===0?1/0:j,d:C.kind===0?1/0:j+$}}if(e)for(const C of b){const[B,Z]=C.face,N=Math.hypot(C.base[0]-C.lip[0],C.base[2]-C.lip[2]),j=($,J)=>{const ct=$-C.lip[0],ht=J-C.lip[2],W=ct*B+ht*Z,q=-ct*Z+ht*B;return W>-.05&&W<N&&Math.abs(q)<.8*(C.carve.wFace+(1.4-C.carve.wFace)*Math.max(0,W)/N)};for(let $=0;$<c.length;$++){if($===C.laid)continue;const{pts:J,along:ct}=c[$];let ht=-1;for(let W=0;W<=J.length;W++){const q=W<J.length&&j(J[W][0],J[W][1]);q&&ht<0&&(ht=W),!q&&ht>=0&&(k($,ct[Math.max(0,ht-1)],ct[Math.min(J.length-1,W)],.04,.04),ht=-1)}}}const O=performance.now();return{falls:X,threads:P,cuts:U,carved:S,lines:c,akua:b.length?0:-1,trench:u,ms:{lay:h-n,detect:_-h,carve:I-_,threads:G-T,total:O-n}}}function $l(i,t,e){const o=ae(.3+.0025*i,.7,1.1),r=1.4,a=ae(.05+5e-4*i+.02*Math.sqrt(t),.06,.3),l=2.2+3.5*e+1.5,c=$c+ae(l*Kc(.82*i,30)*.01,.1+.06,.1+.3);return{faceFrac:.82,faceRun:.1,wFace:o,wBase:r,poolR:a,v0:l,sLand:c}}function yv(i,t,e,n,s,o,r,a){const l=_n,{faceRun:c,faceFrac:h,wFace:f,wBase:u,poolR:d,sLand:g}=r,v=Math.hypot(n[0]-e[0],n[1]-e[1]),m=(n[0]-e[0])/v,p=(n[1]-e[1])/v,_=s-o,x=o+(1-h)*_,y=2,w=Math.max(1,Math.floor((Math.min(e[0],n[0])-y+xt)/qe)),M=Math.min(l-2,Math.ceil((Math.max(e[0],n[0])+y+xt)/qe)),E=Math.max(1,Math.floor((Math.min(e[1],n[1])-y+xt)/qe)),R=Math.min(l-2,Math.ceil((Math.max(e[1],n[1])+y+xt)/qe)),S=a.filter(V=>V[0]>-xt+w*qe-.5&&V[0]<-xt+M*qe+.5&&V[1]>-xt+E*qe-.5&&V[1]<-xt+R*qe+.5);let b=0;for(let V=E;V<=R;V++)for(let X=w;X<=M;X++){const T=-xt+(X+.5)*qe,P=-xt+(V+.5)*qe,G=T-e[0],U=P-e[1],k=G*m+U*p,O=-G*p+U*m,C=k-$c-vv*O*O;if(C<0||k>v||S.some(ct=>Math.hypot(ct[0]-T,ct[1]-P)<.3))continue;let B=C<c?s+(x-s)*(C/c):x+(o-x)*(C-c)/Math.max(.1,v-c);const Z=Math.hypot(k-g,O)/(d*1.1);Z<1&&(B-=6*(1-Z*Z));const N=f+(u-f)*k/v,j=(1-en(.55*N,N,Math.abs(O)))*(1-en(v-.45,v,k)),$=V*l+X,J=i[$]+(B-i[$])*j;J<i[$]&&(i[$]=J,b++)}const I=Zt/l;for(let V=E-1;V<=R+1;V++)for(let X=w-1;X<=M+1;X++){const T=V*l+X,P=i[V*l+Math.min(l-1,X+1)]-i[V*l+Math.max(0,X-1)],G=i[Math.min(l-1,V+1)*l+X]-i[Math.max(0,V-1)*l+X],U=-P*Nt/(2*I),k=-G*Nt/(2*I),O=Math.hypot(U,1,k);t[T*4]=Math.round((U/O*.5+.5)*255),t[T*4+1]=Math.round((1/O*.5+.5)*255),t[T*4+2]=Math.round((k/O*.5+.5)*255)}return{i0:w,i1:M,j0:E,j1:R,texels:b}}function wv(i,t,e,n){const s=ee,o=e.rain,r=.25,a=(T,P)=>Math.floor((T+xt)/r)*4096+Math.floor((P+xt)/r),l=new Map,c=[0,0];for(const T of i){const P=T.along[T.along.length-1];for(let G=0;G<=P;G+=.1){gn(T,G,c);const U=a(c[0],c[1]);let k=l.get(U);k||l.set(U,k=[]),k.push(c[0],c[1])}}const h=(T,P,G,U)=>{const k=Math.floor((T+xt)/r),O=Math.floor((P+xt)/r);let C=G,B=!1;for(let Z=-1;Z<=1;Z++)for(let N=-1;N<=1;N++){const j=l.get((k+N)*4096+O+Z);if(j)for(let $=0;$<j.length;$+=2){const J=Math.hypot(j[$]-T,j[$+1]-P);J<C&&(C=J,B=!0,U&&(U[0]=j[$],U[1]=j[$+1]))}}return B},f=t.map(T=>{const P=T.kind===0?1.4:.6;return{a:T.lip,b:T.base,r:P,x0:Math.min(T.lip[0],T.base[0])-P,x1:Math.max(T.lip[0],T.base[0])+P,z0:Math.min(T.lip[2],T.base[2])-P,z1:Math.max(T.lip[2],T.base[2])+P}}),u=(T,P)=>f.some(G=>T>G.x0&&T<G.x1&&P>G.z0&&P<G.z1&&Hi(T,P,G.a[0],G.a[2],G.b[0],G.b[2])<G.r),d=(T,P,G)=>(G[0]=(n(T+.05,P)-n(T-.05,P))/(2*.05*100),G[1]=(n(T,P+.05)-n(T,P-.05))/(2*.05*100),Math.hypot(G[0],G[1]));let g=s,v=-1,m=s,p=-1;for(let T=0;T<s;T++)for(let P=0;P<s;P++)o[T*s+P]>2500&&(P<g&&(g=P),P>v&&(v=P),T<m&&(m=T),T>p&&(p=T));const _=[],x=[0,0],y=new Float64Array(3*404),w=4*qe;for(let T=-xt+(m+.5)*$t;T<=-xt+(p+.5)*$t;T+=w)for(let P=-xt+(g+.5)*$t;P<=-xt+(v+.5)*$t;P+=w){const G=P+(Xe(P*13.7+T*3.1)-.5)*w,U=T+(Xe(P*5.3-T*11.9)-.5)*w,k=o[ho(G,U)];if(k<=2500)continue;const O=n(G,U);if(O<=60||d(G,U,x)<=1.2||h(G,U,.25)||u(G,U))continue;y[0]=G,y[1]=O,y[2]=U;let C=1,B=G,Z=U,N=O,j=0,$=0,J=!1;for(let F=0;F<400;F++){const pt=d(B,Z,x);if(pt<1e-6)break;const at=B-x[0]/pt*.05,ft=Z-x[1]/pt*.05,ut=n(at,ft);if(ut>=N)break;if((N-ut)/5>=.9?($+=N-ut,j=0):j++,B=at,Z=ft,N=ut,y[C*3]=B,y[C*3+1]=N,y[C*3+2]=Z,C++,j>=3){J=!0;break}if(F>2&&h(B,Z,.25,c)){y[C*3]=c[0],y[C*3+1]=n(c[0],c[1]),y[C*3+2]=c[1],C++;break}if(N<3)break}if($<140||(J&&(C-=3),C<4))continue;let ct=!1;for(let F=2;F<C&&!ct;F+=2)ct=u(y[F*3],y[F*3+2]);if(ct)continue;const ht=[];for(let F=0;F<C;F++)ht.push([y[F*3],y[F*3+1],y[F*3+2]]);const W=d(G,U,x),q=d(G+x[0]/W*.4,U+x[1]/W*.4,x),it=ht[0][1]-ht[ht.length-1][1];_.push({pts:ht,drop:it,rain:k,score:it*Math.sqrt(k/3e3)*(q<.8?1.4:1),room:.35+.5*Xe(G*7.1+U*17.3)})}_.sort((T,P)=>P.score-T.score);const M=new Set,E=.3,R=(T,P)=>Math.floor((T+xt)/E)*4096+Math.floor((P+xt)/E),S=[];for(const T of _){if(S.length>=300)break;const[P,,G]=T.pts[0];if(S.some(O=>Math.abs(O.pts[0][0]-P)<1.7&&Math.abs(O.pts[0][2]-G)<1.7&&Math.hypot(O.pts[0][0]-P,O.pts[0][2]-G)<O.room+T.room))continue;const U=new Set;for(let O=3;O<T.pts.length;O++)U.add(R(T.pts[O][0],T.pts[O][2]));let k=0;for(const O of U)M.has(O)&&k++;if(!(k>3)){for(const O of U)M.add(O);S.push(T)}}for(const T of S){const P=T.pts,G=Math.max(6,Math.round(T.drop/25)),U=[P[0]];let k=1;for(let O=1;O<G-1;O++){const C=P[0][1]-T.drop*O/(G-1);for(;k<P.length-1&&P[k][1]>C;)k++;const B=P[k-1],Z=P[k],N=ae((B[1]-C)/(B[1]-Z[1]||1),0,1);U.push([B[0]+(Z[0]-B[0])*N,C,B[2]+(Z[2]-B[2])*N])}U.push(P[P.length-1]),T.pts=U}const b=e.area;for(const T of S){const P=T.pts[T.pts.length-1],G=Math.floor((P[0]+xt)/$t),U=Math.floor((P[2]+xt)/$t);let k=0;for(let O=Math.max(0,U-1);O<=Math.min(s-1,U+1);O++)for(let C=Math.max(0,G-1);C<=Math.min(s-1,G+1);C++)k=Math.max(k,b[O*s+C]);T.A=k}const I=[...S].sort((T,P)=>P.A-T.A),V=t.find(T=>T.kind===0),X=S.map(T=>{const P=I.indexOf(T)/Math.max(1,I.length-1),G=Math.round(T.pts[0][0]*37+T.pts[0][2]*101),U=T.pts[1][0]-T.pts[0][0],k=T.pts[1][2]-T.pts[0][2],O=Math.hypot(U,k)||1,C=V&&Math.hypot(T.pts[0][0]-V.pool[0],T.pts[0][2]-V.pool[2])<25;return{kind:2,pts:T.pts,lip:T.pts[0],base:T.pts[T.pts.length-1],drop:T.drop,A:T.A,rain:T.rain,thr:.35+.6*Math.pow(P,.8)+(Xe(G)-.5)*.15,prio:T.drop*Math.sqrt(T.rain/3e3)*(C?2:1),catch:[T.pts[0][0],T.pts[0][2],T.pts[0][0]-U/O*1.5,T.pts[0][2]-k/O*1.5]}});return X.sort((T,P)=>P.prio-T.prio),X}const uo=512,oo=512,Sv=Array.from({length:8},(i,t)=>Math.cos(t/8*Math.PI*2)),bv=Array.from({length:8},(i,t)=>Math.sin(t/8*Math.PI*2)),Ev=[60,120,220,1e9],Tv=[.25,.5,.75,1],Av=`
${Ne}
${zn}
${cn}
${Nn}
in vec3 aAxis;
in vec3 aFace;
in vec4 aFall;   // s metres from the lip, T seconds of flight, half-width (units), kind
in vec4 aMeta;   // fall id, seed, side (-1/+1, or lateral / radius fraction), contact (pool: angle)
in vec3 aMore;   // along 0..1, metres to the foot, hand-over from the ribbon (0..1, linear)
in vec4 aLift;   // how far each coarser terrain LOD stands above this point
uniform sampler2D uState;   // per fall: r flow, g water front, b wet-rock memory
uniform float uPx;          // world size of one drawing-buffer pixel at distance 1
uniform float uLodRange;    // the terrain's finest LOD range
uniform float uWaterTime;
uniform vec2 uWindVec;
out vec3 vWorld;
out vec3 vSide;
out vec3 vN;
out vec2 vPool;
out vec4 vA; // x across (|u| <= 1 water, beyond: veil), y s metres, z T, w half-width metres (pool: R)
out vec4 vB; // x flow, y seed, z contact, w coverage
out vec4 vC; // x veil extent, y sun visibility, z metres to the foot, w along
out vec4 vD; // x kind, y front, z wet, w distance fade
out float vTurb; // how muddy the water runs after a storm
out float vHand;
void main() {
  float kind = aFall.w;
  float dist0 = length(cameraPosition - position);
  // (after a storm the windward pali streaming with threads is a sight from
  // across a valley, so they carry nearly as far as the stream falls; their
  // coverage fade below keeps them from shimmering out there)
  float fade = 1.0 - (kind < 0.5 ? smoothstep(100.0, 150.0, dist0) : (kind > 1.5 && kind < 2.5) ? smoothstep(65.0, 100.0, dist0) : smoothstep(70.0, 110.0, dist0));
  if (fade <= 0.0) {
    // out of range: skip the rest (most of the island's falls, most frames)
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  vec4 st = texelFetch(uState, ivec2(int(aMeta.x + 0.5), 0), 0);
  float flow = st.r;
  vec3 C = position;
  vec3 p = position;
  float cov = 1.0;
  float veilMax = 1.0;
  float u = aMeta.z;
  vSide = aFace;
  vN = aAxis;
  vPool = vec2(0.0);
  if (kind < 2.5) {
    float s = max(aFall.x, 0.0);
    float freeK = 1.0 - aMeta.w;
    // a free-falling sheet bows a little downwind in slow gusts, never into the rock
    float fallen = s * Y_PER_M;
    float gust = 0.75 + 0.25 * sin(uWaterTime * 0.7 + aMeta.y * 37.0);
    vec2 drift = uWindVec * 0.012 * fallen * sqrt(fallen) * gust * freeK / (0.5 + flow);
    drift -= aFace.xz * min(0.0, dot(drift, aFace.xz));
    C.xz += drift;
    vec3 V = normalize(cameraPosition - C);
    vec3 F = normalize(cross(aFace, aAxis));
    vec3 P = cross(aAxis, V);
    float lp = length(P);
    P = lp > 1e-4 ? P / lp : F;
    vec3 Nf = normalize(cross(aAxis, F));
    // (a horsetail wanders a few metres either way down its wall, round the
    // ledges and buttresses the heightfield is too coarse to have)
    if (kind > 1.5) C += F * (vnoise(vec2(aMeta.y * 31.0, aFall.x * 0.015)) - 0.5) * 0.08;
    // how full it runs: a hero swings from a thin dry-season ribbon to a
    // roaring, veiled torrent in spate; the tongue over its brink keeps to the
    // width of the stream ribbon it grows from
    float wStream = 0.45 + 0.55 * sqrt(flow);
    float wHero = 0.2 + 0.8 * smoothstep(0.2, 0.95, flow);
    float hw = aFall.z * (kind < 0.5 ? mix(wStream, wHero, smoothstep(0.0, 15.0, aFall.x)) : wStream);
    // (a cascade gathers and spreads over its steps rather than running as an
    // even tube; its tongue still matches the ribbon above)
    if (kind > 0.5 && kind < 1.5) hw *= mix(1.0, 0.65 + 0.7 * vnoise(vec2(aMeta.y * 19.0, aFall.x * 0.025)), smoothstep(0.0, 10.0, aFall.x));
    float ht = hw * mix(0.45, 0.25, aMeta.w);
    // an elliptic column: its exact outline from whichever side it's seen
    float rad = length(vec2(hw * dot(F, P), ht * dot(Nf, P)));
    float veil = kind < 0.5 ? (0.15 + 0.9 * smoothstep(10.0, 150.0, s) * freeK) * mix(0.35, 1.2, smoothstep(0.35, 0.95, flow)) : (kind < 1.5 ? 0.1 : 1.4);
    float ext = rad * (1.0 + veil);
    // never thinner than a pixel or so: fade it instead, so far threads don't shimmer
    float minExt = (kind > 1.5 ? 0.62 : 0.8) * uPx * dist0;
    cov = clamp(ext / max(minExt, 1e-6), 0.0, 1.0);
    float live = kind > 1.5 ? max(flow, st.b) : flow; // threads keep a dark streak when dry
    ext = max(ext, minExt) * step(0.03, live);
    p = C + P * aMeta.z * ext;
    // (and where it is fattened so, the water itself fills the strip, its
    // veil shrinking to nothing: drawn at its true width, the core would
    // fall between pixel centres and leave the veil, or a thread's wet
    // fringe, to stand in for it as a grey line)
    veilMax = 1.0 + veil * cov;
    u = aMeta.z * veilMax;
    vSide = P;
  } else if (kind > 3.5) {
    vPool = vec2(cos(aMeta.w), sin(aMeta.w)) * aMeta.z * aFall.z * 100.0; // pool metres, +x to the outlet
  }
  // depth only (the screen position stays put): far off, the terrain's coarse
  // LODs fill a narrow notch in, and the water must not drown in it
  vec3 toCam = cameraPosition - p;
  float d = length(toCam);
  float bias;
  if (kind > 3.5) bias = min(d * 0.005, 0.5); // (pools lie flat in their own bowl)
  else if (aFall.x < 0.0) bias = min(d * 0.015, 1.2);
  else {
    float q = log2(max(d, 1e-3) / uLodRange) + 1.0;
    float l = clamp(q, 0.0, 2.999);
    float lf = l < 1.0 ? mix(aLift.x, aLift.y, l) : l < 2.0 ? mix(aLift.y, aLift.z, l - 1.0) : mix(aLift.z, aLift.w, l - 2.0);
    lf *= 1.0 + max(0.0, q - 3.0);
    bias = min(2.0, d * 0.002 + lf * 1.8);
  }
  p += toCam / max(d, 1e-3) * bias;
  vWorld = p;
  vA = vec4(u, aFall.x, aFall.y, aFall.z * 100.0);
  vB = vec4(flow, aMeta.y, aMeta.w, cov);
  vC = vec4(veilMax, sunVisibility(C - aFace * 0.03), aMore.y, aMore.x);
  vD = vec4(kind, st.g, st.b, fade);
  vTurb = st.a;
  vHand = aMore.z;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`,Cv=`
${Ne}
${zn}
${cn}
${Nn}
uniform int uDebug;
uniform float uWaterTime;
uniform float uNightK;
in vec3 vWorld;
in vec3 vSide;
in vec3 vN;
in vec2 vPool;
in vec4 vA;
in vec4 vB;
in vec4 vC;
in vec4 vD;
in float vTurb;
in float vHand;
float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5);
}
// foam: irregular drifting patches, not a cellular paving
float foamAt(vec2 q) {
  float n = vnoise(q) * 0.55 + vnoise(q * 2.3 + 1.7) * 0.3 + vnoise(q * 5.1 + 4.1) * 0.15;
  return smoothstep(0.42, 0.72, n);
}
void main() {
  float kind = vD.x;
  float flow = vB.x;
  float fade = vD.w;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 sun = uSunColor * vC.y;
  // by night white water is pale grey, lit by the moon and sky like the rock
  // around it, but dimmed so it stands about as far above the rock as it does
  // by day: a faint pale stripe, never a lamp
  float day = smoothstep(-0.12, 0.08, uSunDir.y);
  float night = mix(uNightK, 1.0, day);
  // after a storm the water runs faintly brown with the soil it carries
  vec3 mud = mix(vec3(1.0), vec3(1.0, 0.86, 0.68), 0.5 * vTurb);
  if (kind > 3.5) {
    // the plunge pool: foam boiling out from the landing toward the outlet,
    // advected in two phases half a cycle apart so it never visibly resets
    vec2 q = vPool;
    float R = vA.w;
    float r = length(q) / R;
    if (r > 1.0) discard;
    vec2 vel = normalize(q + 1e-3) * (1.0 - r) * 3.0 + vec2(1.2, 0.0);
    float t = uWaterTime * 0.5;
    float p1 = fract(t);
    float p2 = fract(t + 0.5);
    float wB = abs(p1 - 0.5) * 2.0;
    float sd = vB.y * 13.0;
    float fa = foamAt((q - vel * p1 * 2.0) * 0.25 + sd);
    float fb = foamAt((q - vel * p2 * 2.0) * 0.25 + sd + 0.5);
    float fm = mix(fa, fb, wB);
    float foam = mix(0.45, fm, 1.0 - smoothstep(0.3, 0.7, length(fwidth(q * 0.25))));
    // the boil where the sheet lands, ragged at its edge, and foam drifting out
    float boil = smoothstep(0.15, 0.55, 1.0 - r / 0.5 + (fm - 0.5) * 0.5);
    float cover = clamp(boil + foam * (1.0 - smoothstep(0.3, 1.0, r)) * 0.7, 0.0, 1.0) * smoothstep(0.06, 0.3, flow);
    float Fw = 0.04 + 0.96 * pow(1.0 - max(V.y, 0.0), 5.0);
    // (dark, deep water in a shaded bowl: it mirrors the walls around it more
    // than the open sky)
    vec3 deep = mix(vec3(0.02, 0.035, 0.03), vec3(0.05, 0.04, 0.025), vTurb);
    // (seen low across the pool it mirrors the walls of its bowl, not the sky,
    // so it never reads as a bright plate)
    vec3 Rw = reflect(-V, vec3(0.0, 1.0, 0.0));
    vec3 mirror = mix(deep * uSkyColor * 0.6, skyMap(Rw) * 0.35, smoothstep(0.08, 0.45, Rw.y));
    vec3 water = mix(deep * (uSkyColor + sun * max(uSunDir.y, 0.0) * 0.3), mirror, Fw * 0.5);
    vec3 white = vec3(0.78, 0.82, 0.84) * mud * (sun * max(uSunDir.y, 0.0) * 0.8 + uSkyColor + uMoonColor * 0.3) * night;
    // a soft, ragged shore
    float shore = 1.0 - smoothstep(0.45, 1.0, r + (fm - 0.5) * 0.35);
    gl_FragColor = vec4(mix(water, white, cover), shore * mix(0.7, 1.0, cover) * fade);
    return;
  }
  if (kind > 2.5) {
    // a hero's headwall: dark basalt laid down flow on flow, so it is banded
    // across with ledges where moss and ferns take hold, and fluted down by
    // the water; fading out at the rim, the flanks and the foot
    vec3 N = normalize(vN);
    float lat = vA.x;
    float dM = vA.y;
    float xm = lat * vA.w;
    float flow0 = vnoise(vec2(xm * 0.02 + vB.y * 7.0, dM * 0.09));
    float layer = smoothstep(0.35, 0.65, flow0);
    float ledge = smoothstep(0.02, 0.1, abs(fract(dM * 0.09 + flow0 * 0.6) - 0.5) - 0.38);
    float flute = vnoise(vec2(xm * 0.35, dM * 0.012)) * 0.6 + vnoise(vec2(xm * 1.1 + 3.0, dM * 0.04)) * 0.4;
    // (out toward the flanks, out of the spray's reach, the ferns win, as the
    // terrain's own green pali do; the edge wanders)
    float side = abs(lat) + (vnoise(vec2(dM * 0.04, lat * 2.0 + vB.y * 5.0)) - 0.5) * 0.35;
    float moss = clamp(smoothstep(0.5, 0.75, vnoise(vec2(xm * 0.08 + 11.0, dM * 0.05)) + ledge * 0.35) + ledge * 0.4 + smoothstep(0.25, 0.85, side) * 0.7, 0.0, 1.0);
    // (the water keeps the rock behind the sheet bare)
    float wetZ = 1.0 - smoothstep(0.6, 1.0, abs(lat) / max(vA.z, 1e-3));
    moss *= 1.0 - wetZ * 0.9;
    vec3 rock = mix(vec3(0.028, 0.025, 0.023), vec3(0.06, 0.052, 0.045), layer * 0.6 + flute * 0.4);
    vec3 albedo = mix(rock, vec3(0.04, 0.095, 0.025), moss * 0.9);
    vec3 lit = albedo * (sun * max(dot(N, uSunDir), 0.0) + ambientLight(N) + uMoonColor * max(dot(N, uMoonDir), 0.0));
    float aRock = vB.z * (1.0 - smoothstep(0.4, 1.0, side)) * smoothstep(0.0, 8.0, dM) * smoothstep(0.0, 15.0, vC.z) * 0.85;
    // and in a strip behind the sheet, wet: darker, glistening at grazing angles
    // (a thin sheen, not a mirror: wet rock is rough)
    vec3 Rf = reflect(-V, N);
    float Fr = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
    vec3 cw = vec3(0.012, 0.018, 0.012) * ambientLight(N) + skyMap(Rf) * min(Fr, 0.25) * 0.25 + sun * pow(max(dot(Rf, uSunDir), 0.0), 40.0) * 0.12;
    // (by night there's no sheen to tell wet rock from dry)
    float aw = (1.0 - smoothstep(0.5, 1.0, abs(lat) / max(vA.z, 1e-3))) * 0.5 * max(flow, vD.z) * day * smoothstep(0.0, 4.0, dM);
    float A = aRock + aw * (1.0 - aRock);
    vec3 c = (lit * aRock * (1.0 - aw) + cw * aw) / max(A, 1e-4);
    if (uDebug == 4) { c = vec3(2.0, 2.0, 0.0) * aRock; A = 1.0; }
    gl_FragColor = vec4(c, A * fade);
    return;
  }
  float along = vC.w;
  float front = vD.y;
  if (along > front) discard; // the water hasn't got this far yet
  float u = vA.x;
  float s = vA.y;
  float hwM = vA.w;
  float seed = vB.y;
  float contact = vB.z;
  float cov = vB.w;
  float veilMax = vC.x;
  float au = abs(u);
  // when the water passing here left the lip: the pattern rides down with it,
  // crawling over the brink and racing, stretched, near the foot
  float tau = uWaterTime - vA.z;
  float x = u * hwM / 1.4 + seed * 61.0; // strands ~1.4 m apart
  float y = tau * 0.9;
  // drop the octaves finer than ~2 px, replacing them with their mean
  float k1 = 1.0 - smoothstep(0.35, 0.7, max(fwidth(x), fwidth(y)));
  float k2 = 1.0 - smoothstep(0.35, 0.7, max(fwidth(x) * 2.3, fwidth(y) * 3.1));
  float n = 0.5 + (vnoise(vec2(x, y)) - 0.5) * k1 + (vnoise(vec2(x * 2.3 + 5.2, y * 3.1)) - 0.5) * 0.6 * k2;
  // thick strands and thin ones: the sheet opens up as it falls and spreads
  float open = smoothstep(0.0, 30.0 + 120.0 * flow, s) * mix(1.0, 0.6, contact);
  float thick = smoothstep(0.2 + 0.25 * open, 0.75, n);
  float e = au + (vnoise(vec2(tau * 2.2, seed * 17.0 + u * 2.0)) - 0.5) * mix(0.08, 0.5, smoothstep(0.0, 120.0, s)) * k1;
  float edge = 1.0 - smoothstep(0.7, 1.05, e);
  float chord = sqrt(max(0.0, 1.0 - au * au));
  float aCore = edge * (1.0 - exp(-chord * mix(3.5, 1.8, smoothstep(0.0, 200.0, s)))) * mix(1.0, mix(0.85, 0.35, open) + (1.0 - mix(0.85, 0.35, open)) * thick, 0.35 + 0.65 * k1);
  aCore *= mix(1.0, 0.35, smoothstep(150.0, 400.0, s) * (1.0 - flow) * (1.0 - contact));
  if (kind > 0.5 && kind < 1.5) {
    // a cascade sliding down its ramp is broken water over rock, not a solid
    // tube: thinner where it hugs the rock, and in bright and faint stretches
    // (static ledges, and surges riding down with the water) at a scale that
    // still reads from across a valley
    float run = smoothstep(0.38, 0.62, 0.65 * vnoise(vec2(seed * 9.0 + 2.3, s * 0.03)) + 0.35 * vnoise(vec2(seed * 3.0, tau * 0.18)));
    // (and streaked lengthwise like the ribbon it grows from, while there
    // are pixels enough across it to show it)
    float xs = u * 2.2 + seed * 5.0;
    float streak = smoothstep(0.3, 0.7, vnoise(vec2(xs, s * 0.02 - tau * 0.4)));
    float kS = 1.0 - smoothstep(0.3, 0.7, fwidth(xs));
    aCore *= mix(1.0, 0.65, contact) * mix(0.25, 1.0, run) * mix(1.0, 0.45 + 0.55 * streak, kS) * mix(0.75 + 0.25 * thick, 1.0, k1);
  }
  float spate = smoothstep(0.35, 0.95, flow);
  float aVeil = kind < 0.5 ? (1.0 - smoothstep(0.3, 1.0, au / veilMax)) * mix(0.12, 0.35, smoothstep(15.0, 160.0, s)) * mix(0.45, 1.25, spate) * (1.0 - 0.6 * contact) * (0.6 + 0.4 * vnoise(vec2(u * 1.5 + seed * 9.0, tau * 0.7))) : 0.0;
  float a0 = 1.0 - (1.0 - aCore) * (1.0 - aVeil);
  if (kind < 0.5) {
    // in spate a second, broken strand peels off one side of the sheet
    float sd = fract(seed * 5.3) < 0.5 ? -1.0 : 1.0;
    float us = sd * (1.0 + 0.45 * (veilMax - 1.0));
    float strand = (1.0 - smoothstep(0.08, 0.2, abs(u - us + (vnoise(vec2(tau * 0.8, seed * 7.0)) - 0.5) * 0.12)));
    strand *= smoothstep(0.72, 0.95, flow) * smoothstep(8.0, 40.0, s) * (1.0 - contact);
    strand *= smoothstep(0.3, 0.6, vnoise(vec2(seed * 3.0 + sd, tau * 1.3))) * (0.5 + 0.5 * thick);
    a0 = 1.0 - (1.0 - a0) * (1.0 - 0.6 * strand);
  }
  // the foot: a stream fall fades out into the ribbon that carries on below
  // it; a hero's landing hides in its own spray, raggedly
  if (kind > 0.5 && kind < 1.5) a0 *= smoothstep(0.0, 20.0, vC.z);
  else if (kind < 0.5) a0 *= mix(0.12, 1.0, smoothstep(0.0, 22.0, vC.z + (vnoise(vec2(u * 2.5 + seed * 11.0, tau * 1.7)) - 0.5) * 14.0));
  if (kind > 1.5) {
    // a horsetail is a thread of white pulses, never a painted line: bright
    // where it drops free, faint where it slides over the rock between, and
    // drying it breaks into dashes and drips
    float seg = smoothstep(0.47, 0.6, vnoise(vec2(seed * 13.0 + 3.7, s * 0.022)) * 0.75 + vnoise(vec2(seed * 5.0, s * 0.08)) * 0.25);
    a0 *= mix(0.03, 1.0, seg) * smoothstep(0.0, 40.0, vC.z) * mix(0.45, 1.0, smoothstep(0.25, 0.75, vnoise(vec2(seed * 7.0, tau * 1.7))) * k1 + 0.5 * (1.0 - k1)) * (0.55 + 0.45 * fract(seed * 7.31));
    a0 *= smoothstep(1.0 - flow * 1.6, 1.15 - flow * 1.6, vnoise(vec2(seed * 13.0, along * 22.0 - uWaterTime * (1.0 + 2.0 * along))));
  }
  vec3 L = uSunDir;
  float uc = clamp(u, -1.0, 1.0);
  vec3 N = normalize(vSide * uc + V * sqrt(max(0.0, 1.0 - uc * uc)));
  vec3 col = vec3(0.78, 0.82, 0.84) * mud * (0.8 + 0.3 * thick) * (1.0 + 0.2 * contact) * (sun * clamp((dot(N, L) + 0.6) / 1.6, 0.0, 1.0) + ambientLight(N) + uMoonColor * max(dot(N, uMoonDir), 0.0));
  // thin water glows when the sun is behind it
  col += sun * hg(dot(-V, L), 0.6) * 0.05 * clamp(4.0 * a0 * (1.0 - a0) + aVeil, 0.0, 1.0);
  // smooth green glassy water over the brink
  // (only a few metres of it: lower down, against a dark wall, glass reads
  // as a gap in the fall)
  float lip = (1.0 - smoothstep(1.0, 7.0, s)) * (1.0 - contact) * k1;
  float Fr = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  col = mix(col, mix(vec3(0.08, 0.11, 0.09) * (sun * max(dot(N, L), 0.0) + uSkyColor), skyMap(reflect(-V, N)), 0.3 + 0.6 * Fr), lip * 0.45);
  a0 = mix(a0, max(a0, 0.85 * edge), lip);
  // glints
  col += sun * step(0.992, hash12(floor(vec2(x * 2.0, tau * 9.0)))) * k2 * pow(max(dot(reflect(-L, N), V), 0.0), 4.0) * 2.0;
  if (front < 1.0) col *= 1.0 + 0.5 * smoothstep(front - 0.06, front, along); // the leading slug
  col *= night;
  float dCam = length(cameraPosition - vWorld);
  float a = a0 * cov * smoothstep(0.03, 0.3, flow) * fade * smoothstep(0.05, 0.4, dCam);
  if (kind < 1.5) {
    // the hand-over from the stream ribbon: the tongue fades in over the
    // stretch where the ribbon fades out, starts out as translucent as the
    // ribbon is drawn (fainter with distance, as it is), and becomes the
    // fall over its first metres (tens of metres from across a valley, where
    // a few metres are a pixel)
    float ribbonA = 0.6 * (1.0 - 0.8 * smoothstep(12.0, 60.0, dCam));
    float rl = 1.0 - smoothstep(0.0, mix(6.0, 35.0, smoothstep(15.0, 60.0, dCam)), s);
    a *= smoothstep(0.0, 0.85, vHand) * mix(1.0, ribbonA, rl);
    // (and a stream fall, like its stream, is a sheen from far off rather
    // than a painted line)
    if (kind > 0.5) a *= 1.0 - 0.5 * smoothstep(20.0, 80.0, dCam);
  } else a *= smoothstep(-3.0, 2.0, s);
  if (kind > 1.5) {
    // the wet-rock fringe around a thread, outlasting the water (faint while
    // it runs: from any distance the two would merge into a grey line)
    float aw = vD.z * 0.3 * (1.0 - smoothstep(0.7, 1.0, au / veilMax)) * cov * fade * day * mix(1.0, 0.25, smoothstep(0.1, 0.6, flow));
    // (wet rock is darker than the dry rock around it, lit as the wall is,
    // with only a hint of sheen: it must never read as a pale line)
    vec3 cw = vec3(0.014, 0.018, 0.013) * (sun * 0.5 + ambientLight(N)) + skyMap(reflect(-V, N)) * 0.008;
    float A = a + aw * (1.0 - a);
    col = (col * a + cw * aw * (1.0 - a)) / max(A, 1e-4);
    a = A;
  }
  if (uDebug == 1) { col = vec3(fract(tau * 0.5)) * 2.0; a = 1.0; }
  if (uDebug == 2) { col = vec3(cov, k1, k2) * 2.0; a = 1.0; }
  if (uDebug == 3) { col = vec3(vC.y) * 2.0; a = 1.0; }
  if (uDebug == 4) { col = kind < 0.5 ? vec3(2.0, 0.0, 0.0) : kind < 1.5 ? vec3(0.0, 2.0, 0.0) : vec3(0.0, 0.0, 2.0); a = 1.0; }
  if (uDebug == 5) { col = vec3(flow) * 2.0; a = 1.0; }
  if (uDebug == 6) { col = vec3(a) * 2.0; a = 1.0; }
  if (a < 0.003) discard;
  gl_FragColor = vec4(col, a);
}
`,Rv=`
${Ne}
${zn}
${cn}
${Nn}
in vec3 iOrigin;
in vec4 iKind; // kind (0 plunge, 1 spray off the sheet, 2 ledge), seed, radius (units), fall id
in vec3 iFace;
uniform sampler2D uState;
uniform float uPx;
uniform float uWaterTime;
uniform vec2 uWindVec;
out vec4 vP; // x alpha, y seed, z age, w kind
out vec2 vQ;
out vec3 vWorld;
out float vSun;
void main() {
  float kind = iKind.x;
  float seed = iKind.y;
  float R = iKind.z;
  float flow = texelFetch(uState, ivec2(int(iKind.w + 0.5), 0), 0).r;
  float life = mix(5.0, 10.0, hash12(vec2(seed, 3.1)));
  // a fall in spate throws far more spray than the same fall in a dry spell
  float full = smoothstep(0.3, 0.95, flow);
  R *= mix(0.6, 1.2, full);
  float age = fract(uWaterTime / life + seed * 7.31);
  vec2 radial = vec2(cos(seed * 81.7), sin(seed * 81.7));
  vec2 wind = uWindVec * 0.09; // units per second
  vec3 p = iOrigin;
  float r = R;
  float a = 1.0;
  if (kind < 0.5 || kind > 1.5) {
    // the plunge: out from the impact, off the rock, rising
    p.xz += radial * R * 0.9 * sqrt(age) + iFace.xz * R * (0.3 + 0.9 * age) + wind * 0.35 * age * life;
    p.y += R * (0.1 + 1.1 * age);
    r = R * mix(0.55, 1.5, age);
  } else {
    // spray shed by the falling sheet: sinks, and blows downwind
    p.y -= 2.5 * Y_PER_M * age * life;
    p.xz += iFace.xz * R * 0.6 * age + wind * 0.6 * age * life;
    r = R * mix(0.6, 1.4, age);
  }
  p += (vec3(vnoise(vec2(seed * 40.0, uWaterTime * 0.3)), vnoise(vec2(seed * 50.0, uWaterTime * 0.25)), vnoise(vec2(seed * 60.0, uWaterTime * 0.3))) - 0.5) * R * 0.5;
  a *= smoothstep(0.0, 0.18, age) * (1.0 - smoothstep(0.45, 1.0, age)) * smoothstep(0.2, 0.9, flow) * (0.5 + 0.5 * flow);
  float dist = distance(cameraPosition, p);
  a *= smoothstep(2.0, 4.0, r / (uPx * dist)) * smoothstep(r * 0.6, r * 1.8, dist) * (1.0 - smoothstep(40.0, 60.0, dist));
  if (a < 0.003) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }
  // the card stands at the front of its own puff, so it never slices into the rock
  p += normalize(cameraPosition - p) * min(r * 0.8, dist * 0.5);
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 wp = p + (right * position.x + up * position.y * (kind > 0.5 && kind < 1.5 ? 1.5 : 1.0)) * r;
  vSun = sunVisibility(iOrigin);
  vP = vec4(a, seed, age, kind);
  vQ = position.xy;
  vWorld = wp;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`,Pv=`
${Ne}
${zn}
${cn}
${Nn}
uniform sampler2D uPuff;
uniform float uBow;
uniform float uNightK;
in vec4 vP;
in vec2 vQ;
in vec3 vWorld;
in float vSun;
float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5);
}
// the primary bow only: violet inside at ~40.6 deg, red outside at ~42.3 deg
vec3 sprayBow(float deg) {
  float x = (deg - 40.4) / 2.1;
  if (x < -0.3 || x > 1.3) return vec3(0.0);
  return vec3(smoothstep(0.55, 0.9, x) * (1.0 - smoothstep(0.95, 1.2, x)),
              smoothstep(0.25, 0.55, x) * (1.0 - smoothstep(0.6, 0.85, x)),
              smoothstep(-0.25, 0.05, x) * (1.0 - smoothstep(0.25, 0.55, x)));
}
void main() {
  float r2 = dot(vQ, vQ);
  if (r2 >= 1.0) discard;
  float cs = cos(vP.y * 40.0);
  float sn = sin(vP.y * 40.0);
  vec2 q = mat2(cs, sn, -sn, cs) * vQ;
  float a = (1.0 - r2) * (1.0 - r2) * texture(uPuff, q * 0.5 + 0.5 + vec2(vP.z * 0.05, vP.y)).r * vP.x * 0.3;
  if (a < 0.002) discard;
  vec3 rd = normalize(vWorld - cameraPosition);
  float cosS = dot(rd, uSunDir);
  float phase = mix(hg(cosS, 0.62), hg(cosS, -0.22), 0.3) * 0.75 + 0.25;
  vec3 sun = uSunColor * vSun;
  vec3 col = vec3(0.92) * (sun * phase * 0.15 * (0.6 + 0.4 * (vQ.y * 0.5 + 0.5)) + uSkyColor * 0.9 + uMoonColor * 0.6) * mix(uNightK, 1.0, smoothstep(-0.12, 0.08, uSunDir.y));
  col += sprayBow(degrees(acos(clamp(-cosS, -1.0, 1.0)))) * sun * uBow * (vP.w > 0.5 && vP.w < 1.5 ? 0.6 : 1.0) * smoothstep(-0.02, 0.06, uSunDir.y);
  gl_FragColor = vec4(col, a);
}
`;function Lv(){const t=new Uint8Array(4096),e=(s,o,r)=>Xe((o%s+s)%s*157+(r%s+s)%s*311+s*17);for(let s=0;s<64;s++)for(let o=0;o<64;o++){let r=0,a=.5;for(let l=0;l<4;l++){const c=4<<l,h=o/64*c,f=s/64*c,u=Math.floor(h),d=Math.floor(f),g=h-u,v=f-d,m=g*g*(3-2*g),p=v*v*(3-2*v),_=e(c,u,d)+(e(c,u+1,d)-e(c,u,d))*m,x=e(c,u,d+1)+(e(c,u+1,d+1)-e(c,u,d+1))*m;r+=(_+(x-_)*p)*a,a*=.5}t[s*64+o]=Math.round(ae((r/.9375-.25)/.6,0,1)*255)}const n=new $n(t,64,64,Ni,nn);return n.wrapS=n.wrapT=hi,n.minFilter=ne,n.magFilter=ne,n.needsUpdate=!0,n}class Dv{constructor(t,e){const n=performance.now();this.app=t,this.plan=e,this.enabled=!0,this.debugTime=null,this.list=e.falls,this.threads=e.threads.slice(0,Math.max(0,uo-e.falls.length)),this.nCurtain=e.falls.length,this.n=this.nCurtain+this.threads.length,this.stuck=0,this.nodeKey=new Int32Array(16384).fill(-1),this.nodeVal=new Float64Array(16384),this.build(),this.buildState(),this.buildMist(),this.clearVegetation(),this.group=new ln,this.group.add(this.mesh,this.mist),this.heroes=[];for(let s=0;s<this.nCurtain;s++){const o=this.list[s];o.kind===0&&this.heroes.push({index:s,model:o.model,src:o.src,lip:new z(o.lip[0],o.lip[1]*Nt,o.lip[2]),base:new z(o.pool[0],o.pool[1]*Nt,o.pool[2]),pool:new z(o.pool[0],o.pool[1]*Nt,o.pool[2]),poolR:o.poolR,face:o.face,per:o.per,rain:o.rain,mist:new z(o.pool[0],o.pool[1]*Nt+.35*(o.lip[1]-o.pool[1])*Nt,o.pool[2])})}this.hero=this.heroes[0]||null,this.heroView=null,this.lastStop=-1,this.frustum=new Es,this.projView=new Kt,this.tmp=new z,this.setQuality(t.quality?t.quality.level:2),this.buildMs=performance.now()-n,this.settle()}setHero(t,e=null){this.hero=t,this.heroView=e}fine(t,e){return Math.max(this.app.terrain.metresAt(t,e),this.coarse(0,t,e))}coarse(t,e,n){const s=qe*(1<<t),o=(e+xt)/s,r=(n+xt)/s,a=Math.floor(o),l=Math.floor(r),c=o-a,h=r-l,f=this.node(t,a,l),u=this.node(t,a+1,l),d=this.node(t,a,l+1),g=this.node(t,a+1,l+1),v=f+(u-f)*c+(d-f)*h+(f-u-d+g)*c*h,m=c+h<=1?f+(u-f)*c+(d-f)*h:g+(d-g)*(1-c)+(u-g)*(1-h),p=c>=h?f+(u-f)*c+(g-u)*h:f+(d-f)*h+(g-d)*c;return Math.max(v,m,p)}node(t,e,n){const s=(t*4096+n)*4096+e|0,o=(Math.imul(e,73856093)^Math.imul(n,19349663)^Math.imul(t,83492791))&16383;if(this.nodeKey[o]===s)return this.nodeVal[o];const r=qe*(1<<t),a=this.app.terrain.metresAt(-xt+e*r,-xt+n*r);return this.nodeKey[o]=s,this.nodeVal[o]=a,a}axisOf(t){const e=[0,0];if(t.kind===0)return gn(this.plan.lines[t.laid],Math.max(0,t.sLip-.08),e),{poly:[[e[0],e[1]],[t.lip[0],t.lip[2]],[t.base[0],t.base[2]]],lipAt:Math.hypot(e[0]-t.lip[0],e[1]-t.lip[2])};if(t.kind===1){const a=this.plan.lines[t.laid],l=Math.max(0,t.sLip-.03),c=[];gn(a,l,e),c.push([e[0],e[1]]);for(let h=0;h<a.pts.length;h++)a.along[h]>l+1e-4&&a.along[h]<t.sBase-1e-4&&c.push([a.pts[h][0],a.pts[h][1]]);return gn(a,t.sBase,e),c.push([e[0],e[1]]),{poly:c,lipAt:t.sLip-l}}const n=t.pts,s=n[1][0]-n[0][0],o=n[1][2]-n[0][2],r=Math.hypot(s,o)||1;return{poly:[[n[0][0]-s/r*.05,n[0][2]-o/r*.05],...n.map(a=>[a[0],a[2]])],lipAt:.05}}spine(t,e){const n=t.kind,{poly:s,lipAt:o}=this.axisOf(t),r=[],a=[],l=[];let c=0;for(let W=0;W<s.length;W++)W>0&&(c+=Math.hypot(s[W][0]-s[W-1][0],s[W][1]-s[W-1][1])),s[W].s=c;const h=c,f=n===2?.04:.02;for(let W=0;W<=h+1e-6;W+=f){let q=1;for(;q<s.length-1&&s[q].s<W;)q++;const it=s[q-1],F=s[q],pt=ae((W-it.s)/(F.s-it.s||1),0,1);r.push(it[0]+(F[0]-it[0])*pt),a.push(it[1]+(F[1]-it[1])*pt),l.push(W-o)}const u=r.length,d=(W,q)=>{const it=(W+o)/f;let F=Math.floor(it);F<0&&(F=0),F>u-2&&(F=u-2);const pt=it-F;q[0]=r[F]+(r[F+1]-r[F])*pt,q[1]=a[F]+(a[F+1]-a[F])*pt;const at=r[F+1]-r[F],ft=a[F+1]-a[F],ut=Math.hypot(at,ft)||1;return q[2]=at/ut,q[3]=ft/ut,q},g=Math.round(o/f),v=new Float64Array(u);for(let W=0;W<u;W++)v[W]=this.fine(r[W],a[W])*Nt;const m=v[g];for(let W=g+1;W<u;W++)v[W]=Math.min(v[W],v[W-1]);const p=W=>{for(let q=g+1;q<u;q++)if(v[q]<=W){const it=(v[q-1]-W)/(v[q-1]-v[q]||1);return l[q-1]+(l[q]-l[q-1])*it}return l[u-1]},_=t.per??0,x=t.A;let y,w,M,E;n===0?(y=2.2+3.5*_+1.5,w=30,M=ae(.08+.03*Math.sqrt(x),.1,.22),E=1.7):n===1?(y=1.2+2.8*_,w=14+14*_,M=ae(.03+.02*Math.sqrt(x),.04,.12),E=1.4):(y=.6,w=9,M=.005+.012*ae(x/.07,0,1),E=1.25);const R=t.drop,S=n===0?36:n===1?ae(Math.round(R/10),12,28):Math.max(6,Math.round(R/25)),b=[];for(let W=0;W<=S;W++)b.push(n===2?R*W/S:R*(W/S)*(W/S));if(n===0)for(const W of[16,10,5,2.5])b.push(R-W);else if(n===1)for(const W of[20,10,4])R>3*W&&b.push(R-W);const I=(t.ledges||[]).slice(0,3);for(const W of I)b.push(W);b.sort((W,q)=>W-q);for(let W=b.length-2;W>0;W--)b[W+1]-b[W]<1&&!I.includes(b[W])&&b.splice(W,1);const V=n===0?1.05:n===1?.1:1.4,X=n===2?.15:.3,T=[0,0,0,0],P=[],G=W=>{d(W.sig,T),W.fx=T[2],W.fz=T[3],W.x=T[0]-T[3]*W.lat,W.z=T[1]+T[2]*W.lat},U=Math.min(.11,.009*Math.sqrt(t.ribbonA??x)+.012)*(n===0?.9:1.25),k=n===0?(t.pool[0]-t.lip[0])*t.face[0]+(t.pool[2]-t.lip[2])*t.face[1]:1/0,O=n===0?-.06:-.03;d(O,T),P.push({x:T[0],y:this.fine(T[0],T[1])*Nt+(n===0?.035:.012),z:T[1],fx:T[2],fz:T[3],d:0,hw:n===0?Math.min(U,.5*M):U,contact:1,tongue:-1,sig:O}),d(0,T);const C=n===0?Math.min(.5*M,Math.max(U,.35*M)):n===1?U:Math.min(.5*M,U*.4+.3*M);P.push({x:T[0],y:m+.004,z:T[1],fx:T[2],fz:T[3],d:0,hw:C,contact:1,tongue:0,sig:0});for(const W of b){const q=m-W*Nt,it=y*Kc(W,w)*.01,F=p(q);let pt=.5*M*(1+(E-1)*W/Math.max(1,R));n<2&&(pt*=C/(.5*M)+(1-C/(.5*M))*en(0,n===0?18:20,W));const at=.006+X*pt,ft=Math.min(F+at,k),ut=Math.max(it,ft),Ot=n===0&&F+at>k?0:1-en(0,.03,it+(n===0?gv:0)-ft),Ct={y:q,d:W,hw:pt,contact:Ot,ledge:I.includes(W),sig:ut,lat:0};G(Ct),P.push(Ct)}const B=(W,q)=>{const it=P[Math.max(0,W-1)],F=P[Math.min(P.length-1,W+1)];q[0]=F.x-it.x,q[1]=F.y-it.y,q[2]=F.z-it.z;const pt=Math.hypot(q[0],q[1],q[2])||1;return q[0]/=pt,q[1]/=pt,q[2]/=pt,q},Z=[0,0,0],N=R-(4+.03*R),j=n===2?2:1;for(let W=2;W<P.length;W++){const q=P[W],it=P[W-1];if(W>2&&it.sig>q.sig&&(q.sig=it.sig,q.lat=it.lat,G(q)),q.d>N||n===0&&q.d<3)continue;B(W,Z);const F=-q.fz,pt=q.fx;let at=Z[1]*pt-Z[2]*0,ft=Z[2]*F-Z[0]*pt,ut=Z[0]*0-Z[1]*F;const Ot=Math.hypot(at,ft,ut)||1;at/=Ot,ft/=Ot,ut/=Ot;const Ct=n===0?1+(.15+.9*en(10,150,q.d))*V*(1-en(.55*R,N,q.d)):1,D=q.hw*Ct,A=q.hw*(.45+(.25-.45)*q.contact)*Ct,K=q.sig,rt=q.lat;let st=0;for(;st<80;st++){let lt=!1,wt=0;for(let dt=0;dt<8;dt+=j){const Et=Sv[dt],Rt=bv[dt],ot=q.x+F*D*Et+at*A*Rt,jt=q.y+ft*A*Rt,Ft=q.z+pt*D*Et+ut*A*Rt;jt<this.fine(ot,Ft)*Nt+.004&&(lt=!0,wt+=Et)}if(!lt)break;const mt=n===0?0:wt>.5?-.004:wt<-.5?.004:0;q.sig+=.005,q.lat+=mt,G(q)}st>=80&&(this.stuck++,q.sig=K,q.lat=rt,G(q))}const $=P.length;if($>4){const W=P.map(q=>q.sig??0);for(let q=0;q<4;q++){let it=P[2].sig;for(let pt=3;pt<$;pt++){const at=P[pt].sig,ft=pt+1<$?P[pt+1].sig:at;P[pt].sig=Math.max(W[pt],(it+2*at+ft)/4),it=at}let F=P[2].lat;for(let pt=3;pt<$-1;pt++){const at=P[pt].lat;P[pt].lat=(F+2*at+P[pt+1].lat)/4,F=at}}if(n===1){const q=Math.min(25,.25*R);for(let it=2;it<$;it++)P[it].lat*=1-en(R-q,R,P[it].d)}for(let q=2;q<$;q++)G(P[q])}for(const W of P){if(W.hand=1,!t.hand||n===2||n===0&&W.sig>0)continue;const q=t.sLip+W.sig,it=t.hand;let F=ae((q-it.a)/Math.max(1e-6,it.b-it.a),0,1);n===1&&(F=Math.min(F,1-ae((q-it.c)/Math.max(1e-6,it.d-it.c),0,1))),W.hand=F}let J=y,ct=0,ht=0;P[0].T=-.4,P[0].s=-3,P[1].T=0,P[1].s=0;for(let W=2;W<P.length;W++){const q=P[W-1],it=P[W],F=Math.hypot(it.x-q.x,it.z-q.z)*100,pt=(q.y-it.y)/Nt,at=Math.hypot(F,pt),ft=Math.max(1,Math.ceil(at)),ut=pt/Math.max(.5,F),Ot=it.contact>.5?9+(w-9)*en(1.5,5,ut):w;for(let Ct=0;Ct<ft;Ct++)J=Math.sqrt(Math.max(.25,J*J+2*9.81*(pt/ft)*(1-J*J/(Ot*Ot)))),ct+=at/ft/Math.max(.5,J);ht+=at,it.T=ct,it.s=ht,it.ledge&&(J=2.5)}for(let W=0;W<P.length;W++){const q=P[W];B(W,Z),q.tx=Z[0],q.ty=Z[1],q.tz=Z[2];const it=-q.fz,F=q.fx;q.lift=[0,0,0,0];for(let pt=0;pt<4;pt++){let at=this.coarse(pt,q.x,q.z)*Nt+.01-q.y;n!==2&&pt<2&&(at=Math.max(at,this.coarse(pt,q.x-it*q.hw,q.z-F*q.hw)*Nt+.01-q.y),at=Math.max(at,this.coarse(pt,q.x+it*q.hw,q.z+F*q.hw)*Nt+.01-q.y)),q.lift[pt]=Math.max(0,at)}q.along=ae(q.d/Math.max(1,R),0,1),q.toBase=R-q.d}return{st:P,W0:M,yL:m,at:d,sigmaT:p,drop:R}}build(){let t=16384;const e={pos:new Float32Array(t*3),axis:new Float32Array(t*3),face:new Float32Array(t*3),fall:new Float32Array(t*4),meta:new Float32Array(t*4),more:new Float32Array(t*3),lift:new Float32Array(t*4)},n={pos:3,axis:3,face:3,fall:4,meta:4,more:3,lift:4};let s=0;const o=(w,M,E,R,S,b,I,V,X,T,P,G,U,k,O,C,B,Z,N,j=1)=>{if(s>=t){t*=2;for(const ct in e){const ht=new Float32Array(t*n[ct]);ht.set(e[ct]),e[ct]=ht}}const $=s*3,J=s*4;return e.pos[$]=w,e.pos[$+1]=M,e.pos[$+2]=E,e.axis[$]=R,e.axis[$+1]=S,e.axis[$+2]=b,e.face[$]=I,e.face[$+2]=V,e.fall[J]=X,e.fall[J+1]=T,e.fall[J+2]=P,e.fall[J+3]=G,e.meta[J]=U,e.meta[J+1]=k,e.meta[J+2]=O,e.meta[J+3]=C,e.more[s*3]=B,e.more[s*3+1]=Z,e.more[s*3+2]=j,N&&(e.lift[J]=N[0],e.lift[J+1]=N[1],e.lift[J+2]=N[2],e.lift[J+3]=N[3]),s++},r=[],a=[],l=[],c=[],h=[],f=[];this.stations=[],this.pools=[],this.mistSrc=[];const u=(w,M,E,R,S,b,I,V)=>{const X=Math.atan2(I,b),T=o(E,V??this.fine(E,R)*Nt+.003,R,0,1,0,b,I,0,0,S,4,w,M,0,0,1,0,null);for(let P=0;P<=16;P++){const G=P/16*Math.PI*2,U=E+Math.cos(X+G)*S,k=R+Math.sin(X+G)*S;o(U,V??this.fine(U,k)*Nt+.003,k,0,1,0,b,I,0,0,S,4,w,M,1,G,1,0,null),P>0&&a.push(T,T+P,T+P+1)}this.pools.push([E,R,S])},d=(w,M,E,R,S)=>{const b=w.st;let I=-1;for(let V=0;V<b.length;V++){const X=b[V],T=o(X.x,X.y,X.z,X.tx,X.ty,X.tz,X.fx,X.fz,X.s,X.T,X.hw,S,M,E,-1,X.contact,X.along,X.toBase,X.lift,X.hand);o(X.x,X.y,X.z,X.tx,X.ty,X.tz,X.fx,X.fz,X.s,X.T,X.hw,S,M,E,1,X.contact,X.along,X.toBase,X.lift,X.hand),I>=0&&R.push(I,I+1,T,I+1,T+1,T),I=T,S!==2&&this.stations.push(X.x,X.z)}},g=[0,0,0,0];for(let w=0;w<this.nCurtain;w++){const M=this.list[w],E=Xe(w*7.13+1.7),R=this.spine(M,w);M.W0=R.W0,d(R,w,E,M.kind===0?l:c,M.kind);const S=this.plan.lines[M.laid],b=M.kind===0?M.sPool:M.sBase,I=[0,0],V=[0,0];gn(S,b,I),gn(S,b+.15,V);let X=V[0]-I[0],T=V[1]-I[1];const P=Math.hypot(X,T);P<1e-4?(X=M.face?M.face[0]:1,T=M.face?M.face[1]:0):(X/=P,T/=P);const G=M.drop,U=M.kind===0?M.poolR:ae(.05+5e-4*G+.02*Math.sqrt(M.A),.06,.3),k=R.st[R.st.length-1],O=M.kind===0?M.pool[0]:k.x,C=M.kind===0?M.pool[2]:k.z,B=.05,Z=Math.hypot(this.fine(O+B,C)-this.fine(O-B,C),this.fine(O,C+B)-this.fine(O,C-B))/(2*B*100),N=this.list.some(j=>j!==M&&Math.hypot(j.lip[0]-O,j.lip[2]-C)<U+.4);(M.kind===0||Z<.35&&!N)&&u(w,E,O,C,U,X,T,M.kind===0?M.pool[1]*Nt:void 0),M.poolAt=[O,M.kind===0?M.pool[1]:this.fine(O,C),C,U];for(const j of(M.ledges||[]).slice(0,3))R.at(R.sigmaT(R.yL-j*Nt),g),Math.hypot(this.fine(g[0]+B,g[1])-this.fine(g[0]-B,g[1]),this.fine(g[0],g[1]+B)-this.fine(g[0],g[1]-B))/(2*B*100)<.35&&u(w,E+.37,g[0],g[1],U*.6,g[2],g[3]);if(M.kind===0){const j=-M.face[1],$=M.face[0],J=[],ct=M.lip[1]-M.carve.yF,ht=.6*M.carve.wFace,W=13,q=1.1*R.W0/ht;for(let it=0;it<=ct+1e-6;it+=8){const F=R.yL-it*Nt;R.at(R.sigmaT(F),g);const pt=[];for(let at=0;at<W;at++){const ft=at/(W-1)*2-1;let ut=g[0]+j*ft*ht,Ot=g[1]+$*ft*ht;const D=this.fine(ut,Ot)*Nt>=F?1:-1;let A=ut,K=Ot,rt=!1;for(let Ft=0;Ft<200;Ft++){const Dt=ut+M.face[0]*.005*D,Tt=Ot+M.face[1]*.005*D,St=this.fine(Dt,Tt)*Nt>=F;if(D<0){if(St){rt=!0;break}A=Dt,K=Tt}else if(!St){A=Dt,K=Tt,rt=!0;break}ut=Dt,Ot=Tt}if(!rt){pt.push(-1);continue}const st=.02,lt=(this.fine(A+st,K)-this.fine(A-st,K))*Nt/(2*st),wt=(this.fine(A,K+st)-this.fine(A,K-st))*Nt/(2*st),mt=Math.hypot(lt,1,wt),dt=[-lt/mt,1/mt,-wt/mt],Et=A+dt[0]*.004,Rt=F+dt[1]*.004,ot=K+dt[2]*.004,jt=[0,0,0,0];for(let Ft=0;Ft<4;Ft++)jt[Ft]=Math.max(0,this.coarse(Ft,Et,ot)*Nt+.01-Rt);pt.push(o(Et,Rt,ot,dt[0],dt[1],dt[2],M.face[0],M.face[1],it,q,ht,3,w,E,ft,1-en(.5,.8,dt[1]),it/M.drop,M.drop-it,jt))}J.push(pt)}for(let it=1;it<J.length;it++)for(let F=0;F<W-1;F++){const pt=J[it-1][F],at=J[it-1][F+1],ft=J[it][F],ut=J[it][F+1];pt<0||at<0||ft<0||ut<0||r.push(pt,at,ft,at,ut,ft)}}this.mistSrc.push({id:w,f:M,sp:R,ox:X,oz:T})}for(let w=0;w<this.threads.length;w++){const M=this.threads[w],E=this.nCurtain+w,R=this.spine(M,E);f.push(h.length),d(R,E,Xe(E*3.77+.3),h,2)}f.push(h.length);const v=r.length+a.length+l.length+c.length+h.length,m=s>65535?new Uint32Array(v):new Uint16Array(v);let p=0;for(const w of[r,a,l,c,h])m.set(w,p),p+=w.length;const _=v-h.length;this.decalIdx=r.length,this.threadIdx=f.map(w=>_+w);const x=new Re;x.setAttribute("position",new he(e.pos.slice(0,s*3),3)),x.setAttribute("aAxis",new he(e.axis.slice(0,s*3),3)),x.setAttribute("aFace",new he(e.face.slice(0,s*3),3)),x.setAttribute("aFall",new he(e.fall.slice(0,s*4),4)),x.setAttribute("aMeta",new he(e.meta.slice(0,s*4),4)),x.setAttribute("aMore",new he(e.more.slice(0,s*3),3)),x.setAttribute("aLift",new he(e.lift.slice(0,s*4),4)),x.setIndex(new he(m,1)),this.verts=s,this.tris=v/3;const y=this.app;this.uniforms={...y.shared.uniforms,uHeight:{value:y.terrain.heightTex},uState:{value:null},uPx:{value:.001},uLodRange:{value:y.terrain.range0},uWaterTime:{value:0},uDebug:{value:0},uPuff:{value:null},uBow:{value:.05},uNightK:{value:.35}},this.material=new ve({vertexShader:Av,fragmentShader:Cv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new te(x,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=3}buildState(){const t=this.n,e=this.app.weather;this.state=new Float32Array(uo*4),this.stateTex=new $n(this.state,uo,1,ke,pn),this.stateTex.minFilter=ue,this.stateTex.magFilter=ue,this.stateTex.generateMipmaps=!1,this.stateTex.needsUpdate=!0,this.uniforms.uState.value=this.stateTex,this.kind=new Uint8Array(t),this.per=new Float32Array(t),this.thr=new Float32Array(t),this.cell=new Int32Array(t),this.c1=new Int32Array(t),this.cU1=new Int32Array(t),this.cU2=new Int32Array(t),this.w0=new Float32Array(t),this.lenY=new Float32Array(t),this.flow=new Float32Array(t),this.front=new Float32Array(t),this.wet=new Float32Array(t),this.spate=new Float32Array(t),this.primed=new Float32Array(t),this.turb=new Float32Array(t),this.px=new Float32Array(t),this.pz=new Float32Array(t),this.mid=new Float32Array(t*3);const n=e.G,s=(r,a)=>ae(Math.floor((a-e.origin)/e.cell),0,n-1)*n+ae(Math.floor((r-e.origin)/e.cell),0,n-1),o=[0,0];for(let r=0;r<t;r++){const a=r<this.nCurtain?this.list[r]:this.threads[r-this.nCurtain];if(this.kind[r]=a.kind,this.per[r]=a.per??0,this.thr[r]=a.thr??0,this.cell[r]=s(a.lip[0],a.lip[2]),a.kind!==2){const l=this.plan.lines[a.laid];gn(l,a.sLip-1,o),this.cU1[r]=s(o[0],o[1]),gn(l,a.sLip-2.5,o),this.cU2[r]=s(o[0],o[1])}this.lenY[r]=a.drop*Nt,this.px[r]=a.lip[0],this.pz[r]=a.lip[2],this.mid[r*3]=(a.lip[0]+a.base[0])/2,this.mid[r*3+1]=(a.lip[1]+a.base[1])/2*Nt,this.mid[r*3+2]=(a.lip[2]+a.base[2])/2,a.kind===2&&(this.cell[r]=s(a.catch[0],a.catch[1]),this.c1[r]=s(a.catch[2],a.catch[3]),this.w0[r]=.6)}}buildMist(){const t=[],e=this.app.weather.wind,n=[0,0,0,0];this.mistAnchors=[];for(const{id:c,f:h,sp:f,ox:u,oz:d}of this.mistSrc){const g=h.drop,v=h.per??0;if(h.kind>1||g<100||v<.2&&h.kind!==0)continue;const m=f.W0*100,p=ae((15+.25*g)*(.4+.6*Math.max(v,h.kind===0?.4:0))*Math.sqrt(m/10),10,90),_=h.kind===0?Math.round(ae(6+g/25,6,40)*Math.sqrt(m/8)):Math.min(4,Math.round(ae(6+g/25,6,40)*Math.sqrt(m/8))),[x,y,w]=h.poolAt,M=[];for(let E=0;E<_;E++){const R=Xe(c*91.3+E*7.7),S=Xe(c*13.1+E*3.3+.5),b=(.35+.25*Xe(c*5.3+E*1.9))*p*.01,I=R*Math.PI*2,V=Math.sqrt(S)*.3*p*.01;M.push([0,x+Math.cos(I)*V,y*Nt+b*.5,w+Math.sin(I)*V,b,u,d])}if(h.kind===0){const E=Math.round(ae(g/40,2,10));for(let R=0;R<E;R++){const S=g*(.3+.65*Math.sqrt(Xe(c*3.1+R*11.7)));let b=2;for(;b<f.st.length-1&&f.st[b].d<S;)b++;const I=f.st[b],V=-I.fz,X=I.fx,T=V*e.x+X*e.y>=0?1:-1,P=(1.2+1.3*Xe(c*7.9+R*2.3))*I.hw;M.push([1,I.x+I.fx*.5*I.hw+V*T*I.hw*.5,I.y,I.z+I.fz*.5*I.hw+X*T*I.hw*.5,P,I.fx,I.fz])}}for(const E of(h.ledges||[]).slice(0,3))f.at(f.sigmaT(f.yL-E*Nt),n),M.push([2,n[0],this.fine(n[0],n[1])*Nt+p*.0025,n[1],p*.005,n[2],n[3]]);M.forEach((E,R)=>t.push({m:E,id:c,key:(R+.5)/M.length+.01*Xe(c*17.3+R)})),this.mistAnchors.push(x,y*Nt,w)}t.sort((c,h)=>c.key-h.key);const s=Math.min(oo,t.length),o=new Float32Array(oo*3),r=new Float32Array(oo*4),a=new Float32Array(oo*3);for(let c=0;c<s;c++){const{m:h,id:f}=t[c];o.set([h[1],h[2],h[3]],c*3),r.set([h[0],Xe(c*1.618+f*.31),h[4],f],c*4),a.set([h[5],0,h[6]],c*3)}const l=new Uc;l.setAttribute("position",new re([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("iOrigin",new Yn(o,3)),l.setAttribute("iKind",new Yn(r,4)),l.setAttribute("iFace",new Yn(a,3)),l.instanceCount=s,this.nMist=s,this.mistAnchors=new Float32Array(this.mistAnchors),this.uniforms.uPuff.value=Lv(),this.mistMaterial=new ve({vertexShader:Rv,fragmentShader:Pv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:je}),this.mist=new te(l,this.mistMaterial),this.mist.frustumCulled=!1,this.mist.renderOrder=4}clearVegetation(){const t=this.app.vegetation;if(!t||!t.cleared)return;const e=ee,n=t.cleared,s=(l,c,h,f)=>{const u=Math.max(0,Math.floor((l-h+xt)/$t)),d=Math.min(e-1,Math.floor((l+h+xt)/$t)),g=Math.max(0,Math.floor((c-h+xt)/$t)),v=Math.min(e-1,Math.floor((c+h+xt)/$t));for(let m=g;m<=v;m++)for(let p=u;p<=d;p++){const _=-xt+(p+.5)*$t,x=-xt+(m+.5)*$t;(f?f(_,x):Math.hypot(_-l,x-c)<=h)&&(n[m*e+p]=1)}};for(let l=0;l<this.stations.length;l+=2)s(this.stations[l],this.stations[l+1],.2);for(const[l,c,h]of this.pools)s(l,c,h+.1);const o=[0,0];for(const l of this.list){if(l.kind!==0)continue;const c=this.plan.lines[l.laid];for(let g=l.sPool;g<l.sPool+1.6;g+=.1)gn(c,g,o),s(o[0],o[1],.32-.12*((g-l.sPool)/1.6));const[h,f]=l.face,u=.75*l.carve.wFace,d=l.carve.faceRun+.6;s(l.lip[0]+h*d*.5,l.lip[2]+f*d*.5,d+u,(g,v)=>{const m=g-l.lip[0],p=v-l.lip[2],_=m*h+p*f,x=-m*f+p*h;return _>=-.1&&_<=d&&Math.abs(x)<u})}const r=this.app.terrain,a=new z;for(const l of this.list){if(l.kind!==0)continue;const[c,,h]=l.lip,[f,,u]=l.pool;s((c+f)/2,(h+u)/2,1.8,(d,g)=>Hi(d,g,c,h,f,u)<1.5&&r.normalAt(d,g,a).y<.45)}}clearSight(t,e){const n=this.app.vegetation;if(!n||!n.cleared)return;const s=this.app.terrain,o=n.cleared,r=ee;let a=!1;for(const l of e){const c=Math.hypot(l.x-t.x,l.z-t.z),h=Math.ceil(c/($t*.4));for(let f=1;f<h;f++){const u=f/h,d=t.x+(l.x-t.x)*u,g=t.z+(l.z-t.z)*u;if(!(t.y+(l.y-t.y)*u-Math.max(0,s.heightAt(d,g))>.6))for(const[m,p]of[[0,0],[$t*.5,0],[-$t*.5,0],[0,$t*.5],[0,-$t*.5]]){const _=Math.floor((d+m+xt)/$t),x=Math.floor((g+p+xt)/$t);_<0||x<0||_>=r||x>=r||o[x*r+_]||(o[x*r+_]=1,a=!0)}}}a&&n.tiles&&(n.tiles.clear(),n.lastSelection="")}raw(t){const e=this.app.weather.rain;return Math.min(1.5,(e[this.cell[t]]*this.w0[t]+e[this.c1[t]]*(1-this.w0[t]))/1.2)}targetOf(t,e){if(this.kind[t]===2){const s=Math.max(this.spate[t],this.primed[t]);return en(this.thr[t],this.thr[t]+.3,s)}const n=this.wetOf(t)*1.4+e*.5;return Math.min(1,this.kind[t]===0?this.per[t]*.5+n*1.5:this.per[t]+n)}wetOf(t){const e=this.app.weather.wet;return(e[this.cell[t]]+e[this.cU1[t]]+e[this.cU2[t]])/3}turbOf(t){if(this.kind[t]===2)return 0;const e=this.app.weather,n=e.rain;return en(.3,.8,Math.max(n[this.cell[t]],n[this.cU1[t]],n[this.cU2[t]]))*(e.regime==="kona"?1:.25)}prime(t,e,n){const s=this.app.weather;for(let o=this.nCurtain;o<this.n;o++){const r=this.px[o]-t.x,a=this.pz[o]-t.z;if(r*r+a*a>=e*e)continue;const l=n*en(.1,.45,Math.max(this.raw(o),s.wet[this.cell[o]]));this.primed[o]<l&&(this.primed[o]=l)}}primeStop(){var n;const t=this.app.ui;if(!t||!t.stops)return;this.lastStop=t.index;const e=t.views[(n=t.stops[t.index])==null?void 0:n.id];e&&e.spate&&this.prime(e.target,40,e.spate)}settle(){const t=this.app.streams?this.app.streams.uniforms.uFlowAll.value:0;for(let n=this.nCurtain;n<this.n;n++)this.spate[n]=this.raw(n);const e=this.app.ui;e&&e.index!==this.lastStop&&this.primeStop();for(let n=0;n<this.n;n++){const s=this.targetOf(n,t);this.flow[n]=s,this.front[n]=s>.05?1.15:0,this.wet[n]=s,this.turb[n]=this.turbOf(n),this.state[n*4]=s,this.state[n*4+1]=this.front[n],this.state[n*4+2]=s,this.state[n*4+3]=this.turb[n]}this.stateTex.needsUpdate=!0}update(t){const e=this.app,n=t*e.clock.speed,s=1-Math.exp(-n/1800),o=1-Math.exp(-n/10800),r=1-Math.exp(-t/2),a=Math.exp(-n/21600),l=e.streams.uniforms.uFlowAll.value,c=e.ui;c&&c.index!==this.lastStop&&this.primeStop();const h=this.state;let f=!1;for(let _=0;_<this.n;_++){if(this.kind[_]===2){const M=this.raw(_);this.spate[_]+=(M-this.spate[_])*(M>this.spate[_]?s:o),this.primed[_]-=this.primed[_]*o}const x=this.targetOf(_,l);this.flow[_]+=(x-this.flow[_])*r,x>.05?this.front[_]=Math.min(1.15,this.front[_]+t/(2+4*this.lenY[_])):this.flow[_]<.03&&(this.front[_]=0),this.wet[_]=Math.max(this.flow[_],this.wet[_]*a);const y=this.turbOf(_);this.turb[_]+=(y-this.turb[_])*(y>this.turb[_]?s:o);const w=_*4;(Math.abs(h[w]-this.flow[_])>1e-4||Math.abs(h[w+1]-this.front[_])>1e-4||Math.abs(h[w+2]-this.wet[_])>1e-4||Math.abs(h[w+3]-this.turb[_])>.001)&&(h[w]=this.flow[_],h[w+1]=this.front[_],h[w+2]=this.wet[_],h[w+3]=this.turb[_],f=!0)}f&&(this.stateTex.needsUpdate=!0);const u=this.uniforms,d=e.camera;u.uLodRange.value=e.terrain.range0,u.uPx.value=2*Math.tan(d.fov/2*(Math.PI/180))/Math.max(1,e.renderer.domElement.height),u.uWaterTime.value=this.debugTime??e.time;const g=d.position,v=g.y-Math.max(0,e.terrain.heightAt(g.x,g.z));this.group.visible=this.enabled&&v<90;let m=1/0;const p=this.mistAnchors;for(let _=0;_<p.length;_+=3){const x=p[_]-g.x,y=p[_+1]-g.y,w=p[_+2]-g.z,M=x*x+y*y+w*w;M<m&&(m=M)}this.mist.visible=this.group.visible&&m<3600,this.holdOrbit()}holdOrbit(){var f;const t=this.app.ui,e=this.app.rig;if(!t||!t.stops||!e||e.flight||!e.autoOrbit)return;const n=t.views[(f=t.stops[t.index])==null?void 0:f.id];if(!n||!n.orbit)return;const o=typeof innerWidth=="number"&&innerWidth<innerHeight&&n.orbitPortrait||n.orbit,r=o[0]-n.yaw,a=o[1]-n.yaw,l=xv(e.goal.yaw-n.yaw);let c=e.autoOrbit>0?1:-1;c>0&&l>=a?c=-1:c<0&&l<=r&&(c=1);const h=l<r-.05||l>a+.05?1:Math.max(0,Math.min(a-l,l-r));e.autoOrbit=c*(n.distance<60?.012:.02)*(.15+.85*en(0,.12,h))}setQuality(t){const e=ae(t|0,0,3),n=Math.min(Ev[e],this.threads.length),s=e===0?this.decalIdx:0;this.mesh.geometry.setDrawRange(s,this.threadIdx[n]-s),this.mist.geometry.instanceCount=Math.round(this.nMist*Tv[e])}setDebug(t){this.uniforms.uDebug.value=t|0}frame(t,e,n=0,s=.15,o=0){const r=t<this.nCurtain?this.list[t]:this.threads[t-this.nCurtain],a=r.poolAt||r.base,l=r.face?r.face[0]:r.base[0]-r.lip[0],c=r.face?r.face[1]:r.base[2]-r.lip[2],h=Math.atan2(l,c)+n,f=this.app.rig;for(const u of[f.goal,f.state])u.target.set(a[0],Math.max(0,this.app.terrain.heightAt(a[0],a[2])),a[2]),u.distance=e,u.yaw=h,u.pitch=s,u.lift=o;f.flight=null,f.autoOrbit=0}get stats(){const t=this.app;let e=0,n=0;t.camera&&(t.camera.updateMatrixWorld(),this.projView.multiplyMatrices(t.camera.projectionMatrix,t.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView));for(let o=this.nCurtain;o<this.n;o++)this.flow[o]<=.5||(e++,this.tmp.set(this.mid[o*3],this.mid[o*3+1],this.mid[o*3+2]),this.frustum.containsPoint(this.tmp)&&this.tmp.distanceTo(t.camera.position)<70&&n++);const s=this.list.filter(o=>o.kind===0);return{heroes:s.length,model:s.some(o=>o.model),akuaLine:this.hero?this.hero.src:-1,akuaHero:this.heroes.indexOf(this.hero),akuaView:this.heroView,stream:this.nCurtain-s.length,threads:this.threads.length,threadsOn:e,inView:n,mist:this.nMist,verts:this.verts,tris:this.tris,stuck:this.stuck,carvedTexels:this.plan.carved.reduce((o,r)=>o+r.texels,0),trench:this.plan.trench,planMs:Math.round(this.plan.ms.total),buildMs:Math.round(this.buildMs||0),cutTris:t.streams?t.streams.cutTris:-1}}}function ys(i,t,{filter:e="mip",format:n=ke}={}){const s=new $n(i,t,t,n,nn);return e==="nearest"?(s.minFilter=ue,s.magFilter=ue):e==="linear"?(s.minFilter=ne,s.magFilter=ne):(s.minFilter=ui,s.magFilter=ne,s.generateMipmaps=!0),s.wrapS=s.wrapT=$e,s.needsUpdate=!0,s}function Uv(i){const t=ee,e=new Uint8Array(t*t*4),n=Math.log(300),s=Math.log(12e3),o=new Float32Array(t*t);for(let a=0;a<t*t;a++)o[a]=Math.max(0,Math.min(1,Math.log10(Math.max(1e-6,i.area[a])/.04)/1.6));const r=Xc(o,t,2,2);for(let a=0;a<t*t;a++)e[a*4]=Math.round(255*Math.max(0,Math.min(1,(Math.log(i.rain[a])-n)/(s-n)))),e[a*4+1]=Math.round(255*Math.max(0,Math.min(1,i.sand[a]))),e[a*4+2]=Math.round(255*Math.min(1,r[a]*1.6)),e[a*4+3]=i.region[a*4+3];return ys(e,t)}function Fv(i){const t=ee,e=new Uint8Array(t*t*4),n=Zt/t*100,s=Zg(t,o=>i.height1024[o]>0);for(let o=0;o<t*t;o++)e[o*4+3]=Math.round(255*Math.min(1,s[o]*n/300));return{tex:ys(e,t),data:e}}const ws=["#8d9cc9","#3d8a4c","#a3d05b","#e3b65e","#f3e2b0","#53d6c8","#2a5aa8"],Iv=["#000000","#f0a35e","#6fb6e8","#f2d06b","#9ed27a"];function kv(i){const t=ee,e=ws.map(a=>new Pt(a)),n=[new Float32Array(t*t),new Float32Array(t*t),new Float32Array(t*t)];for(let a=0;a<t*t;a++){const l=e[i[a*4+2]]||e[6];n[0][a]=l.r,n[1][a]=l.g,n[2][a]=l.b}const s=n.map(a=>Xc(a,t,2,2)),o=new Uint8Array(t*t*4);for(let a=0;a<t*t;a++)o[a*4]=Math.round(255*Math.pow(s[0][a],1/2.2)),o[a*4+1]=Math.round(255*Math.pow(s[1][a],1/2.2)),o[a*4+2]=Math.round(255*Math.pow(s[2][a],1/2.2)),o[a*4+3]=255;const r=ys(o,t);return r.colorSpace=Ce,r}class zv{constructor(t,e){this.canvas=t,this.island=e,this.params=new URLSearchParams(location.search);const n=new Cc({canvas:t,antialias:!1,powerPreference:"high-performance"});n.setClearColor(0,1),this.renderer=n,this.pipeline=new cg(n),this.scene=new Yi,this.camera=new Ye(42,1,.1,9e3),this.light={sunDir:new z(0,1,0),sunColor:new Pt,skyColor:new Pt,groundColor:new Pt,moonDir:new z(0,-1,0),moonColor:new Pt,zenith:new Pt,horizon:new Pt,sunHorizon:new Pt,night:0};const s=new $n(new Uint8Array([0,0,0,0]),1,1);s.needsUpdate=!0;const o=e.data;this.landTex=Uv(o),this.regionTex=ys(o.region,ee,{filter:"nearest"}),this.linesTex=ys(o.lines,_n,{filter:"linear"}),this.zoneTex=kv(o.region),this.overlay=new ge(0,0,0,0),this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uShadow:{value:null},uWeather:{value:s},uWeatherRect:{value:new ge(-Zt,-Zt,Zt*2,Zt*2)},uCloudShadowK:{value:0},uCloudMidY:{value:15},uWetness:{value:0},uLand:{value:this.landTex},uSkyMap:{value:null},uRegion:{value:this.regionTex},uLines:{value:this.linesTex},uZoneTex:{value:this.zoneTex},uOverlay:{value:this.overlay},uHover:{value:0},uFocus:{value:0},uFocusK:{value:0},uMokuColors:{value:Iv.map(d=>new Pt(d))},uWindVec:{value:new It(1,0)}}};const r=this.params.get("falls");this.wailele=r==="0"?null:Mv(e,{carve:r!=="flat"}),this.terrain=new Jm(o,this.shared),this.scene.add(this.terrain.group),this.shadow=new Eg(this.terrain.heightTex),this.shared.uniforms.uShadow.value=this.shadow.texture;const a=Fv(o);this.seaTex=a.tex,this.seaData=a.data,this.ocean=new ng(this.shared,this.terrain.heightTex,a.tex),this.scene.add(this.ocean.mesh),this.sky=new yg,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.weather=new kg(o.height1024,ee);const[l,c]=e.meta.cloudSizes;this.clouds=new Ig({shape:o.cloudShape,shapeSize:l,detail:o.cloudDetail,detailSize:c}),this.clouds.uniforms.uWeather.value=this.weather.texture,this.clouds.uniforms.uWeatherRect.value=this.weather.rect,this.clouds.uniforms.uShadow.value=this.shadow.texture,this.clouds.uniforms.uHeight.value=this.terrain.heightTex,this.shared.uniforms.uWeather.value=this.weather.texture,this.shared.uniforms.uWeatherRect.value=this.weather.rect,this.pipeline.atmosphere=this.clouds,this.features=new $g(this),this.scene.add(this.features.group),this.vegetation=new ov(this),this.scene.add(this.vegetation.group),this.life=new hv(this),this.scene.add(this.life.group),this.streams=new mv(this),this.scene.add(this.streams.mesh),this.wailele&&(this.waterfalls=new Dv(this,this.wailele),this.scene.add(this.waterfalls.group)),this.flash={t:-10,next:0,pos:new z,k:0},this.rig=new Sg(this.camera,t,this.terrain),this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??9.2),speed:Number(this.params.get("speed")??60)},this.season=this.clock.doy>120&&this.clock.doy<300?"kau":"hooilo",this.params.get("weather")&&this.weather.setMode(this.params.get("weather")),this.sky.update(this.clock.doy,this.clock.hour,0,this.light),this.weather.warm(6,this.light.sunDir.y,this.clock.hour,this.season),this.time=0,this.frames=0,this.updaters=[];const h=n.getContext(),f=h.getExtension("WEBGL_debug_renderer_info"),u=f?String(h.getParameter(f.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(u),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}applyQuality(){var e;const t=[{clouds:.25,steps:26,light:2,range:12,dpr:1},{clouds:.33,steps:34,light:2,range:16,dpr:1.25},{clouds:.42,steps:44,light:3,range:19,dpr:1.5},{clouds:.5,steps:56,light:4,range:22,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.clouds.setScale(t.clouds),this.clouds.uniforms.uSteps.value=t.steps,this.clouds.uniforms.uLightSteps.value=t.light,this.terrain.setRange(t.range),(e=this.waterfalls)==null||e.setQuality(this.quality.level),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}lightning(){const t=this.weather,e=this.flash,n=t.stormiest;n&&(t.regime==="kona"?n.strength>.35:n.strength>.9)&&this.time>e.next&&this.clock.speed>0&&(e.t=this.time,e.pos.set(n.x+(Math.random()-.5)*8,t.base+(t.top-t.base)*(.3+Math.random()*.4),n.z+(Math.random()-.5)*8),e.next=this.time+1.5+Math.random()*(t.regime==="kona"?5:14));const o=this.time-e.t;e.k=o<.6?Math.exp(-o*9)*(.7+.3*Math.sin(o*70))+(o>.12&&o<.22?.6:0):0,this.clouds.uniforms.uFlash.value=e.k,this.clouds.uniforms.uFlashPos.value.copy(e.pos),e.k>0&&this.light.skyColor.offsetHSL(0,0,0).add(new Pt(.25,.27,.35).multiplyScalar(e.k))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.shadow.update(this.renderer,this.light.sunDir),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){var l;const e=this.clock;e.hour+=t*e.speed/3600,e.hour>=24&&(e.hour-=24,e.doy=(e.doy+1)%365),this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t),this.terrain.update(this.camera),this.ocean.update(this.camera),this.vegetation.update(this.camera),this.weather.step(t*e.speed,this.light.sunDir.y,e.hour,this.season),this.life.update(t,this.time),this.streams.update(),(l=this.waterfalls)==null||l.update(t),this.lightning();for(const c of this.updaters)c(t,this.time);const n=this.light,s=this.weather,o=this.clouds.uniforms;o.uSunDir.value.copy(n.sunDir),o.uSunColor.value.copy(n.sunColor),o.uSkyColor.value.copy(n.skyColor),o.uGroundColor.value.copy(n.groundColor),o.uFogColor.value.copy(n.horizon),o.uMoonDir.value.copy(n.moonDir),o.uMoonColor.value.copy(n.moonColor),o.uWind.value.copy(s.windOffset),o.uWindDir.value.copy(s.wind),o.uTime.value=this.time,o.uBase.value=s.base,o.uTop.value=s.top;const r=Math.max(0,Math.min(1,(s.state.humidity-1.1)/.3));if(o.uOvercast.value=r,o.uFarCover.value=.32+r*.4,r>0){const c=1-r*.65;n.sunColor.multiplyScalar(c);const h=(n.skyColor.r+n.skyColor.g+n.skyColor.b)/3;n.skyColor.lerp(new Pt(h,h,h*1.04),r*.5).multiplyScalar(1-r*.25)}this.shared.uniforms.uCloudShadowK.value=2.6,this.shared.uniforms.uCloudMidY.value=(s.base+s.top)*.5,this.ocean.uniforms.uWind.value.set(s.wind.x/9,s.wind.y/9),this.shared.uniforms.uWindVec.value.set(s.wind.x/9,s.wind.y/9);const a=this.pipeline.uniforms;a.uSunDir.value.copy(n.sunDir),a.uSunColor.value.copy(n.sunHorizon),a.uFogColor.value.copy(n.horizon),a.uExposure.value=.55*(1+2.2*Math.pow(n.night,1.5)),a.uNight.value=n.night,this.sky.group.position.copy(this.camera.position)}}const Nv=[{id:"island",icon:"island",title:"Ka Mokupuni",gloss:"the island",text:["A high island raised by two volcanoes and carved by rain. Land is divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili traditionally worked by extended families.","This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones do."]},{id:"rain",icon:"rain",title:"Ka Ua",gloss:"the rain",text:["Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.","So one side of an island is lush and the other dry. Hawaiians have names for hundreds of winds and rains, each belonging to a place. Wai, fresh water, is life — and waiwai, wealth, is water doubled."]},{id:"ahupuaa",icon:"ahupuaa",title:"Ahupuaʻa",gloss:"from the mountain to the sea",zone:null,text:["An ahupuaʻa runs from the uplands to the sea, usually bounded by ridges, so its people have forest, fresh water, farmland, shore and reef within one boundary.","A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.","The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki."]},{id:"akua",icon:"akua",title:"Wao Akua",gloss:"realm of the gods",zone:0,text:["The cloud-wrapped heights are left largely to the gods. People once came only for special purposes — feathers, choice woods, stone for adzes — and with care.","Yet this is the source: mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream."]},{id:"nahele",icon:"nahele",title:"Wao Nahele",gloss:"the forest",zone:1,text:["Below the clouds grow koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.","Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go."]},{id:"loi",icon:"loi",title:"Loʻi Kalo",gloss:"irrigated taro terraces",zone:2,text:["Kalo (taro) is the staff of life, cooked and pounded into poi. Terraces step down the valley floor, fed by an ʻauwai — a ditch that takes part of the stream at a dam and returns it below. The water has to keep moving: cool, flowing water keeps the kalo healthy.","In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo is caring for family."]},{id:"kauhale",icon:"kauhale",title:"Kauhale",gloss:"the family compound",zone:4,text:["A home here is a cluster of hale, each with its purpose: the hale noa, where the family sleeps; the mua, an eating house for men with the family shrine; a separate eating house for women; a house for beating kapa; a canoe house.","Under the ʻai kapu, men and women ate apart. Houses are framed in hardwood, lashed with cordage and thatched with pili grass, on a raised stone paepae."]},{id:"heiau",icon:"heiau",title:"Heiau",gloss:"temple",zone:4,text:["Heiau range from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief. Others are dedicated to Lono for rain and harvests, or to healing and fishing.","On the platform stand the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings."]},{id:"kahakai",icon:"kahakai",title:"Kahakai",gloss:"the shore",zone:4,text:["Most people live near the shore, where the stream meets the sea. Canoes, each hull carved from a single log and steadied by an ama float, are kept out of the sun in a hālau waʻa.","On flat rocks and clay pans, seawater evaporates into paʻakai — salt — for preserving fish."]},{id:"loko",icon:"loko",title:"Loko Iʻa",gloss:"fishpond",zone:5,text:["The most advanced traditional fishponds in the Pacific are Hawaiian. A curved wall of stacked stone, the kuapā, encloses part of the reef flat near a stream mouth, where fresh water mixes with salt.","In the wall are mākāhā — sluice gates of wooden grates. Young fish slip in with the tide, fatten on algae, and grow too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) are raised here."]},{id:"koa",icon:"koa",title:"Koʻa",gloss:"fishing shrine",zone:5,text:["Fishermen build koʻa, stone shrines on the shore, and offer the first fish of a catch to the fishing gods. Offshore fishing grounds are also called koʻa, found by lining up landmarks on land.","Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out."]},{id:"surf",icon:"surf",title:"Heʻe Nalu",gloss:"wave sliding",zone:5,text:["Surfing has always belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.","Each break has its name. The best were sometimes kapu to all but the aliʻi."]},{id:"kula",icon:"kula",title:"Kula",gloss:"the dry plains",zone:3,text:["Where rain is too scarce for loʻi, families farm the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).","Long low walls run across the slopes to break the wind and hold soil and moisture. The great leeward field systems cover tens of square kilometres."]},{id:"ahu",icon:"ahu",title:"Ahu · Makahiki",gloss:"the boundary altar · the season of Lono",zone:4,text:["Where the trail around the island crosses into each ahupuaʻa stands an ahu, a stone altar. When Makaliʻi — the Pleiades — rises at dusk in late autumn, the Makahiki begins: four months honoring Lono, god of rain and growth.","Under chiefly rule, Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden."]},{id:"puuhonua",icon:"puuhonua",title:"Puʻuhonua",gloss:"place of refuge",zone:4,text:["Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.","In wartime, defeated warriors and those who could not fight also found safety there."]},{id:"holua",icon:"holua",title:"Hōlua",gloss:"sledding course",zone:3,text:["During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.","The track is paved with stones and laid with slick grass or leaves; the longest runs for more than a kilometre."]},{id:"malama",icon:"malama",title:"Mālama ʻĀina",gloss:"care for the land",text:["An ahupuaʻa works when each part cares for the next: protected forests make water, water feeds loʻi and fishponds, and people tend it all.","Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles."]}],ao={moae:{name:"Moaʻe",gloss:"trade winds"},kona:{name:"Kona",gloss:"southerly storm"},malie:{name:"Mālie",gloss:"calm"},auto:{name:"Auto",gloss:"let the weather change"}},fa={kau:{name:"Kau",gloss:"the dry season"},hooilo:{name:"Hoʻoilo",gloss:"the wet season"}},Ov={island:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',rain:'<path d="M7 14.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',ahupuaa:'<path d="M12 3.5 4.5 19.5h15z"/><path d="M12 7c-1.2 2.6 1 4.4 0 7s1.2 3 .3 5.5"/><path d="M3 21c2 0 2-.8 4.5-.8S9.5 21 12 21s2-.8 4.5-.8 2 .8 4.5.8"/>',akua:'<path d="M3 19.5l6-9 3 4 2-3 7 8z"/><path d="M8.2 7.5a2.6 2.6 0 0 1 5-1.3A2.2 2.2 0 1 1 15.5 9.6H8.8a1.1 1.1 0 0 1-.6-2.1z"/>',nahele:'<path d="M12 21v-6"/><path d="M12 15c-4.2 0-6.3-2.1-6.3-5a4 4 0 0 1 3-3.9 3.3 3.3 0 0 1 6.6 0 4 4 0 0 1 3 3.9c0 2.9-2.1 5-6.3 5z"/>',loi:'<path d="M12 21v-4.5"/><path d="M12 16.5c-5 0-8-3-8-7 0-2.2 1.2-4 3.2-4 2 0 3 1.8 4.8 1.8s2.8-1.8 4.8-1.8c2 0 3.2 1.8 3.2 4 0 4-3 7-8 7z"/><path d="M12 7.3v9"/>',kauhale:'<path d="M2.5 20.5h19"/><path d="M5 20.5 12 5l7 15.5"/><path d="M10.4 20.5v-4h3.2v4"/>',heiau:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',kahakai:'<path d="M3 14.5h18l-2.2 3.2H5.2z"/><path d="M6 11h12"/><path d="M8.5 11v3.5M15.5 11v3.5"/><path d="M3 20.5c2 0 2-.8 4.5-.8s2 .8 4.5.8 2-.8 4.5-.8 2 .8 4.5.8"/>',loko:'<path d="M3.5 12c3-4.2 9-5 12.5 0-3.5 5-9.5 4.2-12.5 0z"/><path d="M16 12l5-3.2v6.4z"/><circle cx="7.2" cy="11.2" r=".9" fill="currentColor"/><path d="M3 20c3-2 15-2 18 0"/>',koa:'<path d="M6.5 20.5h11"/><ellipse cx="12" cy="17.8" rx="4.3" ry="2"/><ellipse cx="12" cy="13.8" rx="3.2" ry="1.8"/><path d="M12 12V5.2a2.1 2.1 0 1 1 3.1 1.9"/>',surf:'<path d="M2.5 17c3.2 0 4.2-8.5 9.5-8.5 3 0 4.2 2 4.2 4.2-1.2-.2-3.2-.6-4 1.4 3 0 5.6 1 7.8 2.9"/><path d="M2.5 20.5h19"/>',kula:'<path d="M2.5 18.5c2-3 4.5-3 6.5 0M9 18.5c2-3 4.5-3 6.5 0M15.5 18.5c1.6-2.4 4-3 6 0"/><path d="M2.5 21h19"/><path d="M5.8 14.5v-3M12.2 14.5v-4M18.6 14.5v-3"/>',ahu:'<path d="M7.5 20.5h9l-1.2-3.2H8.7z"/><path d="M9.3 17.3l.6-3h4.2l.6 3"/><path d="M10.4 14.3l.6-2.3h2l.6 2.3"/><path d="M18 3.5l.7 1.6 1.6.7-1.6.7L18 8.1l-.7-1.6-1.6-.7 1.6-.7z"/>',puuhonua:'<path d="M2.5 20h19"/><path d="M3 20v-6.5h9.5V20"/><path d="M3 16.2h9.5"/><path d="M14 20l3.6-7.5L21.2 20"/>',holua:'<path d="M3 5.5l18 13.5"/><path d="M7.8 7.6l3.6 2.7"/><path d="M6.6 10.4l5.3 4"/><circle cx="9.6" cy="6.2" r="1.2"/>',malama:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',zones:'<path d="M3 6h18M3 10.5h18M3 15h18M3 19.5h18"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',moae:'<path d="M3 8.5h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16.5h8"/>',kona:'<path d="M7 13.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M12.5 13.5 10 18h3.5l-2 3.5"/>',malie:'<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1"/><path d="M9.5 18.5a3.5 3.5 0 1 1 .7-6.9 4.3 4.3 0 0 1 8.3 2 2.6 2.6 0 0 1-.4 4.9z"/>',auto:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/>',kau:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',hooilo:'<path d="M7 13a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M9 16.5v3M13 16.5v3M17 16.5v3"/>',speed1:'<path d="M8 5.5v13l9-6.5z"/>',speed2:'<path d="M4.5 5.5v13l7.5-6.5zM12 5.5v13l7.5-6.5z"/>',speed3:'<path d="M3 6v12l6-6zM9.5 6v12l6-6zM16 6v12l6-6z"/>',wind:'<path d="M12 3l4 8h-3v10h-2V11H8z" fill="currentColor" stroke="none"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',tour:'<path d="M4 19c4-1 4-6 8-7s5-6 8-7"/><circle cx="4" cy="19" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="20" cy="5" r="1.4" fill="currentColor"/>'};function Me(i,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Ov[i]||""}</svg>`}const Wn=(i,t)=>Math.atan2(i,t);function Bv(i){const t=i.island.meta,e=t.sites,n=i.terrain,s=t.ahupuaa.find(U=>U.id===e.model)||t.ahupuaa[0],[o,r]=s.mouth;let a=s.topX-o,l=s.topZ-r;const c=Math.hypot(a,l)||1;a/=c,l/=c;const h=Wn(-a,-l),f=Wn(a,l),u=(U,k)=>new z(U,Math.max(0,n.heightAt(U,k)),k),d=s.trunk||[],g=U=>{if(!d.length)return[o+a*c*U,r+l*c*U];const k=d[Math.min(d.length-1,Math.floor(U*(d.length-1)))];return[k[0],k[1]]},v=U=>{let k=d[0];for(const O of d)Math.abs(O[2]-U)<Math.abs(k[2]-U)&&(k=O);return k?[k[0],k[1]]:g(.6)},m=e.villages.find(U=>U.model)||e.villages[0],p=e.loi.find(U=>U.model)||e.loi[0],_=e.heiau.find(U=>U.model)||e.heiau[0],x=e.ponds.find(U=>U.model)||e.ponds[0],y=e.canoes.find(U=>U.village===s.id)||e.canoes[0],w=e.koa.find(U=>U.id===s.id)||e.koa[0],M=U=>Math.min(...e.ponds.map(k=>Math.hypot(k.cx-U.x,k.cz-U.z)),99),R=[...e.surf].sort((U,k)=>Math.hypot(U.x-o,U.z-r)-Math.max(0,8-M(U))*20-(Math.hypot(k.x-o,k.z-r)-Math.max(0,8-M(k))*20))[0],S=e.alii||m,b=[...t.ahu].filter(U=>U.a===s.id||U.b===s.id).sort((U,k)=>Math.hypot(U.x-o,U.z-r)-Math.hypot(k.x-o,k.z-r))[0]||t.ahu[0],[I,V]=t.center,X=(()=>{const U=i.island.data.region,k=Math.sqrt(U.length/4);let O=null,C=-1;for(let B=0;B<k;B+=4)for(let Z=0;Z<k;Z+=4)if(U[(B*k+Z)*4+3]>C){let j=0;for(let $=-8;$<=8;$+=4)for(let J=-8;J<=8;J+=4)j+=U[(Math.min(k-1,Math.max(0,B+$))*k+Math.min(k-1,Math.max(0,Z+J)))*4+3];j>C&&(C=j,O=[((Z+.5)/k-.5)*360,((B+.5)/k-.5)*360])}return O||[S.x,S.z-10]})(),T={};let P=[];T.island={target:u(I+10,V+4),distance:330,yaw:.28,pitch:.78,overlay:[.55,0,.6,0],hour:9.5};{const U=o-a*4,k=r-l*4,[O,C]=pa(La.moae.bearing),B=[];for(const[Z,N]of[[24,3],[48,-4]]){const j=U-O*Z-C*N,$=k-C*Z+O*N;B.push([j,$]);for(let J=0;J<6;J++){const ct=J*Math.PI/3;B.push([j+Math.cos(ct)*6,$+Math.sin(ct)*6])}}T.rain={target:u(U,k),distance:24,yaw:f,pitch:.1,hour:16.5,weather:"moae",boost:!0,overlay:[0,0,0,0],lookUp:.35,showers:B}}{const[U,k]=g(.45);T.ahupuaa={target:u(U,k),distance:92,yaw:h+.25,pitch:.55,focus:s.id,overlay:[1,.85,.4,.6],hour:11}}{const[U,k]=v(260);T.akua={target:u(U,k),distance:26,yaw:h+.15,pitch:.1,hour:8.2,overlay:[0,0,0,0],lookUp:.55},P=i.waterfalls?jv(i,n,U,k):[]}{const[U,k]=v(520);T.nahele={target:u(U,k),distance:9,yaw:h+.9,pitch:.55,hour:9.5,overlay:[0,0,0,0]}}if(p){let U=p.paddies[0].c,k=-1;for(const O of p.paddies){let C=0;for(const B of p.paddies)Math.hypot(B.c[0]-O.c[0],B.c[1]-O.c[1])<1.6&&C++;C>k&&(k=C,U=O.c)}T.loi={target:u(U[0],U[1]),distance:4.4,yaw:h-.5,pitch:.72,hour:10.2,overlay:[0,0,0,0]}}if(T.kauhale={target:u(m.x,m.z),distance:3.2,yaw:h+.9,pitch:.55,hour:8.8,overlay:[0,0,0,0]},_&&(T.heiau={target:u(_.x,_.z),distance:2.1,yaw:_.rot+2.2,pitch:.42,hour:11.5,overlay:[0,0,0,0]}),y){const U=Math.cos(y.dir),k=Math.sin(y.dir);T.kahakai={target:u(y.x,y.z),distance:2,yaw:Wn(U,k)+.7,pitch:.28,hour:15.8,overlay:[0,0,0,0]}}if(x&&(T.loko={target:u(x.cx+x.ax*x.r*.4,x.cz+x.az*x.r*.4),distance:6,yaw:Wn(x.ax,x.az)+.6,pitch:.5,hour:13,overlay:[0,0,0,0]}),w){const U=y||{dir:0};T.koa={target:u(w.x,w.z),distance:1.8,yaw:Wn(-Math.cos(U.dir),-Math.sin(U.dir))+.3,pitch:.2,hour:6.9,overlay:[0,0,0,0],lookUp:.25}}if(R&&(T.surf={target:u(R.x,R.z),distance:1.3,yaw:Wn(Math.cos(R.dir+.9),Math.sin(R.dir+.9)),pitch:.12,hour:14.5,overlay:[0,0,0,0]}),T.kula={target:u(X[0],X[1]),distance:11,yaw:.9,pitch:.42,hour:9,overlay:[0,0,0,0]},b){let U=0,k=-1/0;for(let O=0;O<24;O++){const C=O/24*Math.PI*2,B=n.heightAt(b.x+Math.sin(C)*2.2,b.z+Math.cos(C)*2.2);B>k&&(k=B,U=C)}T.ahu={target:u(b.x,b.z),distance:2,yaw:U,pitch:.3,hour:18.2,doy:318,overlay:[0,0,0,.8],lookUp:.6,ahu:b}}if(e.puuhonua){const U=e.puuhonua;T.puuhonua={target:u(U.x-Math.cos(U.dir)*.8,U.z-Math.sin(U.dir)*.8),distance:3.4,yaw:Wn(Math.cos(U.dir+.9),Math.sin(U.dir+.9)),pitch:.42,hour:15,overlay:[0,0,0,0]}}if(e.holua){const U=e.holua,k=(U.x0+U.x1)/2,O=(U.z0+U.z1)/2,C=U.x1-U.x0,B=U.z1-U.z0,Z=Math.hypot(C,B)||1;T.holua={target:u(k,O),distance:6.5,yaw:Wn(-B/Z,C/Z)+.25,pitch:.33,hour:16,overlay:[0,0,0,0]}}T.malama={target:u(I,V),distance:300,yaw:2.5,pitch:.5,hour:17.4,overlay:[.6,0,.5,0]};for(const U of Object.values(T))Hv(U,n);if(P.length){const U=e1(i,n,T,P);U&&(T.akua=U.view,i.waterfalls.setHero(U.h,U.info))}i.waterfalls&&n1(i,T.nahele);const G={akua:[s.topX,s.topZ],nahele:v(520),loi:T.loi?[T.loi.target.x,T.loi.target.z]:null,kauhale:[m.x,m.z],heiau:_?[_.x,_.z]:null,kahakai:y?[y.x,y.z]:null,loko:x?[x.cx+x.ax*x.r*.5,x.cz+x.az*x.r*.5]:null,koa:w?[w.x,w.z]:null,surf:R?[R.x,R.z]:null,kula:X,ahu:b?[b.x,b.z]:null,puuhonua:e.puuhonua?[e.puuhonua.x,e.puuhonua.z]:null,holua:e.holua?[(e.holua.x0+e.holua.x1)/2,(e.holua.z0+e.holua.z1)/2]:null};return{views:T,anchors:G,model:s}}function Hv(i,t){for(let e=0;e<8;e++){const n=Math.cos(i.pitch),s=new z(i.target.x+i.distance*n*Math.sin(i.yaw),i.target.y+i.distance*Math.sin(i.pitch),i.target.z+i.distance*n*Math.cos(i.yaw));let o=!1;for(let r=1;r<24;r++){const a=r/24,l=s.x+(i.target.x-s.x)*a,c=s.y+(i.target.y-s.y)*a,h=s.z+(i.target.z-s.z)*a;if(Math.max(0,t.heightAt(l,h))>c-.03){o=!0;break}}if(!o)return;i.pitch=Math.min(1.3,i.pitch+.07)}}const Gv=[.1,.14,.18,.22,.26,.3,.34],Vv=[.6,.7,.8,.9,1,1.12,1.25,1.4],Un=.05,yo=41,Da=Math.tan(21*Math.PI/180),Xa=650*Nt,Wv=.33,Ya=1.47,ja=i=>(t,e)=>Math.max(0,i.heightAt(t,e)),$a=(i,t,e)=>{const n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)};function qv(i,t,e,n,s,o,r,a=r){for(let l=1;l<o;l++){const c=l/o,h=t.x+(e-t.x)*c,f=t.z+(s-t.z)*c,u=t.y+(n-t.y)*c,d=Math.hypot(e-h,s-f)>1?a:r;if(i(h,f)>u-d)return!1}return!0}const ji=(i,t,e,n,s)=>i.set(t.x+n*Math.cos(s)*Math.sin(e),t.y+n*Math.sin(s),t.z+n*Math.cos(s)*Math.cos(e)),Xv=i=>.12+.03*i+.05;function da(i,t,e){const n=Math.hypot(e.x-t.x,e.z-t.z),s=Math.max(16,Math.ceil(n/.25));for(let o=1;o<s;o++){const r=o/s,a=(1-r)*n,l=.03+Wv*$a(.4,1.2,a)+(r*n<1?.08:0);if(i(t.x+(e.x-t.x)*r,t.z+(e.z-t.z)*r)>t.y+(e.y-t.y)*r-l)return!1}return!0}function Zc(i,t,e,n,s,o,r){return t.y>r||t.y<i(t.x,t.z)+Xv(n)||!qv(i,t,e.x,e.y,e.z,24,.03)?!1:da(i,t,e)&&da(i,t,o)&&da(i,t,s.lip)}function Kl(i,t,e,n,s,o,r,a){const l=new z,c=new Uint8Array(yo);for(let h=0;h<yo;h++)c[h]=Zc(i,ji(l,e,s+(h-20)*Un,o,r),e,o,t,n,a)?1:0;return c}function Zl(i,t){if(!i||!i[t])return null;let e=t,n=t;for(;e>0&&i[e-1];)e--;for(;n<yo-1&&i[n+1];)n++;return[(e-t)*Un,(n-t)*Un]}const Yv=i=>{const t=i.lip.y-i.base.y;return new z(i.base.x+(i.lip.x-i.base.x)*.55,i.base.y+t*.55,i.base.z+(i.lip.z-i.base.z)*.55)};function jv(i,t,e,n){const s=[];return i.waterfalls.heroes.forEach((o,r)=>{const l=.5*Math.min(1,o.per*.5+.6*$a(3e3,8e3,o.rain))-(r===0?0:.004*Math.hypot(o.lip.x-e,o.lip.z-n));for(const c of $v(i,t,o))c.score+=l,s.push(c)}),s.sort((o,r)=>r.score-o.score).slice(0,60)}function $v(i,t,e){const n=ja(t),s=Math.atan2(e.face[0],e.face[1]),o=new z(e.pool.x,n(e.pool.x,e.pool.z),e.pool.z),r=e.lip.y-e.base.y,a=Yv(e),l=Xa-.6,c=(_,x)=>{const y=_.x+e.face[0]*.08,w=_.z+e.face[1]*.08;for(let M=.1;M<30;M+=.08)if(n(y+x.x*M,w+x.z*M)>_.y+x.y*M)return!1;return!0},h=[],f={};for(let _=7.4;_<=10.61;_+=.2){const x=Ic(i.clock.doy,_,f).sun.clone();x.y<.12||h.push({hr:_,sun:x,front:x.x*e.face[0]+x.z*e.face[1],lit:c(a,x),litPool:c(o,x),litLip:c(e.lip,x)})}if(!h.length)return[];const u=r/Math.tan(12*Math.PI/180),d=new z,g=new z,v=new z,m=new z,p=[];for(const _ of Vv){const x=_*u;for(const y of Gv){const w=Kl(n,e,o,a,s,x,y,l);if(!w.some(E=>E))continue;const M=Kl(n,e,o,a,s,x*Ya,y,l);for(let E=0;E<yo;E++){const R=Zl(w,E);if(!R||R[1]-R[0]<.25)continue;const S=Zl(M,E),b=(E-20)*Un,I=s+b;ji(d,o,I,x,y);const V=n(d.x,d.z);g.subVectors(e.lip,d).normalize(),v.subVectors(e.base,d).normalize();const X=Math.acos(Math.min(1,g.dot(v)))*180/Math.PI;m.subVectors(e.mist,d).normalize();const T=R[1]-R[0],P=-.04*Math.abs(X-13)-.08*Math.max(0,10.5-X)-.6*Math.max(0,.12-y)-.4*Math.max(0,y-.3)-.25*Math.abs(b)-.35*Math.max(0,1-(d.y-V))+.3*Math.min(.8,T)-(S?.3*Math.max(0,.4-(S[1]-S[0])):.25);let G=-1/0,U=8.2;for(const{hr:k,sun:O,front:C,lit:B,litPool:Z,litLip:N}of h){const j=Math.acos(Math.max(-1,Math.min(1,-m.dot(O))))*180/Math.PI,$=(B?Math.max(0,C)+.3:0)+.12*Z+.08*N-.6*Math.max(0,.38-O.y)+.15*$a(.45,.8,O.y)-(B&&C>.35?.01*Math.min(20,Math.abs(j-41.5)):0);$>G&&(G=$,U=k)}p.push({h:e,score:P+G,hour:U,yaw:I,dist:x,pitch:y,arc:R,arcP:S,tgt:o,mid:a})}}}return p}function Kv(i,t,e){const n=new z().subVectors(e,t).normalize(),s=new z().crossVectors(n,new z(0,1,0)).normalize(),o=new z().crossVectors(s,n),r=new z,a=new z;let l=0;const c=[-.7,-.35,0,.3];for(const h of c){r.copy(n).addScaledVector(s,h*Da*1.6).addScaledVector(o,.75*Da).normalize();let f=!1;for(let u=.3;u<15&&(a.copy(t).addScaledVector(r,u),!(a.y>Xa));u+=.15+u*.02)if(a.y<i(a.x,a.z)){f=!0;break}f||l++}return l/c.length}function Jl(i,t,e,n,s){if(!n)return!0;const o=new z;for(let r=n[0];r<=n[1]+1e-6;r+=Un)if(!Zc(i,ji(o,e,t.yaw+r,s,t.pitch),e,s,t.h,t.mid,Xa-.6))return!1;return!0}function Zv(i,t){const e=ja(i),n=new z(Math.cos(t.yaw),0,-Math.sin(t.yaw));let s=t.tgt;for(const a of[.08,.05,.025]){const l=t.tgt.clone().addScaledVector(n,a*t.dist);if(l.y=e(l.x,l.z),!(Math.abs(l.y-t.tgt.y)>=.4)&&!(!Jl(e,t,l,t.arc,t.dist)||!Jl(e,t,l,t.arcP,t.dist*Ya))){s=l;break}}const o=Math.min(.6,Math.max(0,(t.mid.y-s.y)/(.45*t.dist))),r={target:s,distance:t.dist,yaw:t.yaw,pitch:t.pitch,hour:Math.round(t.hour*10)/10,lookUp:o,weather:"moae",spate:1,overlay:[0,0,0,0]};return r.orbit=[t.yaw+t.arc[0],t.yaw+t.arc[1]],t.arcP&&(r.orbitPortrait=[t.yaw+t.arcP[0],t.yaw+t.arcP[1]]),Jv(r,t.mid),r}function Jv(i,t){const e=i.lookUp,n=Math.cos(i.pitch),s=o=>{const r=i.distance*Math.sqrt(1/o),a=i.target.x+r*n*Math.sin(i.yaw),l=i.target.y+r*Math.sin(i.pitch),c=i.target.z+r*n*Math.cos(i.yaw),h=Math.atan2(t.y-l,Math.hypot(t.x-a,t.z-c))-Math.atan(.42*Da);return(l+r*n*Math.tan(h)-i.target.y)/(.45*r)};Object.defineProperty(i,"lookUp",{enumerable:!0,get:()=>{const o=typeof innerWidth=="number"?innerWidth/Math.max(1,innerHeight):1.6;return o<1?s(o):e}})}function Qv(i,t,e,n,s){const o=Object.create(Object.getPrototypeOf(i.rig)),r=()=>({target:e.target.clone(),distance:e.distance,yaw:e.yaw+s,pitch:e.pitch,lift:e.lookUp||0});Object.assign(o,{camera:new Ye(42,1.6,.1,9e3),terrain:t,state:r(),goal:r(),flight:null,floor:0,autoOrbit:0,lastInput:-1e12,_v:new z,_prevXZ:null}),o.apply(0);for(let g=0;g<30;g++)o.update(1/60);const a=o.floor,l=o.goal.target.distanceTo(n.target),c=Math.min(6,2.2+Math.sqrt(l)*.22+Math.abs(Math.log(n.distance/o.goal.distance))*.35);o.flyTo({target:n.target,distance:n.distance,yaw:n.yaw,pitch:n.pitch,lift:n.lookUp||0},c),o.autoOrbit=n.distance<60?.012:.02;let h=a,f=0,u=o.camera.position.y,d=u;for(let g=Math.round((c+1.5)*60);g>0;g--){o.update(1/60),o.floor>h&&(h=o.floor);const v=o.camera.position.y;f=Math.max(f,Math.abs(v-2*d+u)*3600),u=d,d=v}return{lift:h-a,acc:f}}function t1(i,t,e,n){if(!i.rig)return{acc:0,accNext:0};const s=[e.nahele,e.ahupuaa].filter(Boolean);let o=0,r=0;const a=(l,c,h)=>{const f=Qv(i,t,l,c,h);return f.lift>.005?!1:(o=Math.max(o,f.acc),(l===e.nahele||c===e.nahele)&&(r=Math.max(r,f.acc)),!0)};for(const l of s)if(!a(l,n,.048)||!a(l,n,.6)||!a(n,l,0))return null;for(const l of[0,1]){const c=l===0?Un:-Un;let h=n.orbit[l]-n.yaw;for(;Math.abs(h)>1e-6&&!s.every(f=>a(n,f,h));)h=Math.abs(h)<=Un+1e-6?0:h+c;n.orbit[l]=n.yaw+h}return n.orbit[1]-n.orbit[0]<.1?null:(n.orbitPortrait&&(n.orbitPortrait=[Math.max(n.orbitPortrait[0],n.orbit[0]),Math.min(n.orbitPortrait[1],n.orbit[1])]),{acc:o,accNext:r})}function e1(i,t,e,n){const s=ja(t),o=new z,r=new z;for(const d of n)ji(o,d.tgt,d.yaw,d.dist,d.pitch),r.set(d.tgt.x,d.mid.y,d.tgt.z),d.open=Kv(s,o,r),d.score+=.2*d.open;n.sort((d,g)=>g.score-d.score);let a=null;for(const d of n){if(a&&d.score<=a.final)break;const g=Zv(t,d),v=t1(i,t,e,g);if(!v)continue;const m=d.score-.004*Math.max(0,v.acc-60)-.003*Math.max(0,v.accNext-15);(!a||m>a.final)&&(a={c:d,v:g,final:m,acc:v.acc,accNext:v.accNext})}if(!a)return null;const{c:l,v:c}=a,h=l.h;for(const[d,g]of[[c.orbit,c.distance],[c.orbitPortrait,c.distance*Ya]])if(d)for(let v=d[0];v<=d[1]+1e-6;v+=Un)i.waterfalls.clearSight(ji(o,c.target,v,g,c.pitch).clone(),[h.pool,l.mid,h.lip]);const f=d=>Math.round(d*100)/100,u=d=>d&&d.map(g=>f(g-c.yaw));return{view:c,h,info:{score:f(a.final),open:l.open,arc:u(c.orbit),arcP:u(c.orbitPortrait),acc:Math.round(a.acc),accNext:Math.round(a.accNext)}}}function n1(i,t){if(!t)return;const e=new Ye(42,1.6,.1,9e3);ji(e.position,t.target,t.yaw,t.distance,t.pitch);const n=new z,s=new z;for(let o=t.lookUp||0;o<=.3+1e-6;o+=.05){e.lookAt(t.target.x,t.target.y+o*t.distance*.45,t.target.z),e.updateMatrixWorld();let r=!1;for(const a of i.waterfalls.heroes)n.copy(a.lip).project(e),s.copy(a.base).project(e),s.z<1&&Math.abs(s.x)<.9&&Math.abs(s.y)<.9&&n.y>.88&&(r=!0);if(!r){o>0&&(t.lookUp=o);return}}}const Fe=(i,t=document)=>t.querySelector(i),me=(i,t={},e="")=>{const n=document.createElement(i);for(const[s,o]of Object.entries(t))s==="class"?n.className=o:s.startsWith("on")?n.addEventListener(s.slice(2),o):n.setAttribute(s,o);return e&&(n.innerHTML=e),n},i1=i=>{const t=Math.floor(i),e=Math.floor((i-t)*60);return`${t}:${String(e).padStart(2,"0")}`},s1=i=>i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;class o1{constructor(t){this.app=t,this.meta=t.island.meta;const e=Bv(t);this.views=e.views,this.anchors=e.anchors,this.model=e.model,this.stops=Nv.filter(n=>this.views[n.id]),this.mode="tour",this.index=-1,this.playing=!1,this.arrivedAt=0,this.overlayGoal=new ge(0,0,0,0),this.focusGoal=0,this.layer={lines:!1,zones:!1,pins:!0},this.timeTween=null,this.counts=this.countFeatures(),this.build(),this.bind(),t.updaters.push(n=>this.update(n))}countFeatures(){const t=this.meta.sites,e={},n=(s,o,r=1)=>{e[s]=e[s]||{loi:0,hale:0,heiau:0,loko:0,koa:0},e[s][o]+=r};for(const s of t.loi)n(s.id,"loi",s.paddies.length);for(const s of t.houses)n(s.village,"hale");for(const s of t.heiau)n(s.id,"heiau");for(const s of t.ponds)n(s.id,"loko");for(const s of t.koa)n(s.id,"koa");return e}build(){const t=me("div",{id:"ui"});document.body.appendChild(t),this.root=t,t.appendChild(me("div",{class:"brand"},`<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${Me("akua",14)}<span></span>${Me("loko",14)}</div>`)),this.modeEl=me("div",{class:"modes"}),this.modeEl.append(me("button",{class:"mode on","data-mode":"tour",title:"Guided tour","aria-label":"Guided tour"},`${Me("tour",18)}<span>Tour</span>`),me("button",{class:"mode","data-mode":"explore",title:"Explore freely","aria-label":"Explore freely"},`${Me("explore",18)}<span>Explore</span>`)),t.appendChild(this.modeEl),this.tools=me("div",{class:"tools"});const e=(r,a,l)=>me("button",{class:"tool","data-tool":r,title:l,"aria-label":l},Me(a,20));this.tools.append(e("lines","lines","Ahupuaʻa boundaries"),e("zones","zones","Zones, mountain to sea"),e("pins","pins","Places"),e("help","help","About"),e("full","expand","Full screen")),t.appendChild(this.tools),this.legend=me("div",{class:"legend"}),Hl.forEach((r,a)=>this.legend.appendChild(me("div",{class:"lg"},`<i style="background:${ws[a]}"></i><b>${r.name}</b><em>${r.gloss}</em>`))),t.appendChild(this.legend),this.card=me("section",{class:"card","aria-live":"polite"}),t.appendChild(this.card),this.rail=me("nav",{class:"rail","aria-label":"Tour stops"}),this.playBtn=me("button",{class:"play",title:"Play the tour","aria-label":"Play the tour"},Me("play",18)),this.rail.appendChild(this.playBtn),this.dots=this.stops.map((r,a)=>{const l=me("button",{class:"dot",title:r.title,"aria-label":r.title,"data-i":a},Me(r.icon,18));return this.rail.appendChild(l),l}),this.progress=me("div",{class:"rail-progress"},"<span></span>"),this.rail.appendChild(this.progress),t.appendChild(this.rail),this.markerLayer=me("div",{class:"markers"}),t.appendChild(this.markerLayer),this.markers=this.stops.filter(r=>this.anchors[r.id]).map(r=>{const a=me("button",{class:"marker",title:r.title,"aria-label":r.title},`${Me(r.icon,18)}<span>${r.title}</span>`);a.addEventListener("click",h=>{h.stopPropagation(),this.openStop(this.stops.indexOf(r),{fly:!0,explore:!0})}),this.markerLayer.appendChild(a);const[l,c]=this.anchors[r.id];return{el:a,stop:r,pos:new z(l,0,c),vis:0}});for(const r of this.markers)r.pos.y=Math.max(0,this.app.terrain.heightAt(r.pos.x,r.pos.z))+.05;this.inspector=me("div",{class:"inspector"}),t.appendChild(this.inspector),this.dock=me("div",{class:"dock"}),this.dock.innerHTML=`
      <div class="dial" title="Drag to change the time of day">
        <svg viewBox="0 0 120 64" class="dial-svg">
          <path class="dial-arc" d="M8 58 A52 52 0 0 1 112 58"/>
          <line class="dial-horizon" x1="2" y1="58" x2="118" y2="58"/>
          <g class="dial-body"><circle r="7" class="dial-sun"/></g>
        </svg>
        <div class="dial-time"></div>
        <div class="dial-night"></div>
      </div>
      <div class="dock-row regimes"></div>
      <div class="dock-row seasons"></div>
      <div class="dock-row speeds"></div>
      <div class="wind" title="Wind"><span class="wind-arrow">${Me("wind",22)}</span><span class="wind-speed"></span></div>`,t.appendChild(this.dock);const n=Fe(".regimes",this.dock);for(const r of["auto","moae","kona","malie"])n.appendChild(me("button",{class:"chip","data-regime":r,title:`${ao[r].name} — ${ao[r].gloss}`,"aria-label":ao[r].name},Me(r,18)));const s=Fe(".seasons",this.dock);for(const r of["kau","hooilo"])s.appendChild(me("button",{class:"chip","data-season":r,title:`${fa[r].name} — ${fa[r].gloss}`,"aria-label":fa[r].name},Me(r,18)));const o=Fe(".speeds",this.dock);for(const[r,a,l]of[["0",0,"pause"],["1",30,"speed1"],["2",240,"speed2"],["3",1800,"speed3"]])o.appendChild(me("button",{class:"chip","data-speed":a,title:a?`${a}× time`:"Pause time","aria-label":a?`${a} times speed`:"Pause"},Me(l,16)));this.help=me("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${Me("close",18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`,t.appendChild(this.help)}bind(){this.modeEl.addEventListener("click",a=>{const l=a.target.closest("[data-mode]");l&&this.setMode(l.dataset.mode)}),this.tools.addEventListener("click",a=>{var h,f,u;const l=a.target.closest("[data-tool]");if(!l)return;const c=l.dataset.tool;c==="help"?this.help.classList.toggle("hidden"):c==="full"?document.fullscreenElement?(h=document.exitFullscreen)==null||h.call(document):(u=(f=document.documentElement).requestFullscreen)==null||u.call(f).catch(()=>{}):(this.layer[c]=!this.layer[c],this.applyLayers())}),this.help.addEventListener("click",a=>{(a.target===this.help||a.target.closest(".help-close"))&&this.help.classList.add("hidden")}),this.rail.addEventListener("click",a=>{const l=a.target.closest(".dot");l&&(this.setMode("tour",!1),this.goto(Number(l.dataset.i)))}),this.playBtn.addEventListener("click",()=>this.setPlaying(!this.playing)),this.dock.addEventListener("click",a=>{const l=a.target.closest("[data-regime]"),c=a.target.closest("[data-season]"),h=a.target.closest("[data-speed]");l&&this.app.weather.setMode(l.dataset.regime),c&&this.setSeason(c.dataset.season),h&&(this.app.clock.speed=Number(h.dataset.speed)),this.refreshDock()});const t=Fe(".dial-svg",this.dock);let e=!1;const n=a=>{const l=t.getBoundingClientRect(),c=(a.clientX-l.left)/l.width*120,h=(a.clientY-l.top)/l.height*64;let f=Math.atan2(58-h,c-60);f<0&&(f=f<-Math.PI/2?Math.PI:0);const u=6+(Math.PI-f)/Math.PI*12;this.timeTween=null,this.app.clock.hour=u};t.addEventListener("pointerdown",a=>{e=!0,t.setPointerCapture(a.pointerId),n(a)}),t.addEventListener("pointermove",a=>e&&n(a)),t.addEventListener("pointerup",()=>e=!1);const s=this.app.canvas;let o=null;s.addEventListener("pointerdown",a=>o={x:a.clientX,y:a.clientY,t:performance.now()}),s.addEventListener("pointerup",a=>{if(!o)return;Math.hypot(a.clientX-o.x,a.clientY-o.y)<5&&performance.now()-o.t<400&&this.pick(a.clientX,a.clientY),o=null});let r=0;s.addEventListener("pointermove",a=>{if(a.buttons||a.pointerType==="touch")return;const l=performance.now();l-r<60||(r=l,this.hover(a.clientX,a.clientY))}),s.addEventListener("pointerleave",()=>this.hover(null)),addEventListener("keydown",a=>{a.key==="ArrowRight"&&!a.shiftKey&&this.mode==="tour"?(a.preventDefault(),this.goto(this.index+1)):a.key==="ArrowLeft"&&!a.shiftKey&&this.mode==="tour"?(a.preventDefault(),this.goto(this.index-1)):a.key==="Escape"?this.help.classList.contains("hidden")?this.closeCard():this.help.classList.add("hidden"):a.key===" "&&this.mode==="tour"&&a.target===document.body&&(a.preventDefault(),this.setPlaying(!this.playing))}),this.app.rig.onUserInput=()=>{this.playing&&this.setPlaying(!1)}}setMode(t,e=!0){if(this.mode===t&&e){t==="tour"&&this.index<0&&this.goto(0);return}this.mode=t;for(const n of this.modeEl.querySelectorAll(".mode"))n.classList.toggle("on",n.dataset.mode===t);this.root.classList.toggle("exploring",t==="explore"),t==="explore"?(this.setPlaying(!1),this.closeCard(),this.focusGoal=0,this.app.rig.autoOrbit=0,this.app.clock.speed=Math.max(this.app.clock.speed,30),this.applyLayers()):e&&this.goto(Math.max(0,this.index))}applyLayers(){for(const t of this.tools.querySelectorAll("[data-tool]")){const e=t.dataset.tool;e in this.layer&&t.classList.toggle("on",this.layer[e])}this.legend.classList.toggle("show",this.layer.zones),this.markerLayer.classList.toggle("hidden",!this.layer.pins||this.mode!=="explore"),this.mode==="explore"&&this.overlayGoal.set(this.layer.lines?1:0,this.layer.zones?1:0,this.layer.lines?.5:0,this.layer.lines?.8:.35)}setSeason(t){const e=this.app.clock;e.doy=t==="kau"?172:355,this.app.season=t,this.refreshDock()}setPlaying(t){this.playing=t,this.playBtn.innerHTML=Me(t?"pause":"play",18),this.playBtn.classList.toggle("on",t),t&&this.mode!=="tour"&&this.setMode("tour"),t&&(this.arrivedAt=performance.now())}goto(t){if(t<0||t>=this.stops.length){t>=this.stops.length&&this.setPlaying(!1);return}this.openStop(t,{fly:!0,explore:!1})}openStop(t,{fly:e,explore:n}){this.index=t;const s=this.stops[t],o=this.views[s.id];if(this.dots.forEach((u,d)=>{u.classList.toggle("on",d===t),u.classList.toggle("done",d<t)}),this.renderCard(s,n),!o)return;const r=this.app.rig,a=r.goal.target.distanceTo(o.target),l=Math.min(6,2.2+Math.sqrt(a)*.22+Math.abs(Math.log(o.distance/r.goal.distance))*.35),c=innerWidth/Math.max(1,innerHeight),h=o.distance*(c<1?Math.pow(1/c,o.distance>40?1:.5):1);e&&r.flyTo({target:o.target,distance:h,yaw:o.yaw,pitch:o.pitch,lift:o.lookUp||0},l,{onDone:()=>this.arrivedAt=performance.now()}),this.arrivedAt=performance.now()+l*1e3,r.autoOrbit=o.distance<60?.012:.02;const f=this.app.clock;if(o.doy!==void 0&&Math.abs(o.doy-f.doy)>2?f.doy=o.doy:o.doy===void 0&&this.lastDoy!==void 0&&f.doy!==this.lastDoy&&(f.doy=this.lastDoy),o.doy===void 0&&(this.lastDoy=f.doy),o.hour!==void 0){let u=o.hour-f.hour;u<-12&&(u+=24),u>12&&(u-=24),this.timeTween={from:f.hour,by:u,t:0,dur:l}}if(f.speed=20,o.weather&&this.app.weather.setMode(o.weather),this.app.weather.boost=o.boost?1:0,o.showers)for(const[u,d]of o.showers)this.app.weather.spawnShower(u,d,5+Math.random()*3,.7);if(o.ahu&&this.app.life&&this.app.life.walkTo(o.ahu.x,o.ahu.z),!n){const u=o.overlay||[0,0,0,0];this.overlayGoal.set(u[0],u[1],u[2],u[3]),this.focusGoal=o.focus||0}}renderCard(t,e){var o,r,a,l;const n=t.zone!==void 0&&t.zone!==null?Hl[t.zone]:null,s=this.stops.length;this.card.innerHTML=`
      <header>
        <div class="card-icon">${Me(t.icon,26)}</div>
        <div class="card-titles"><h1>${t.title}</h1><p class="gloss">${t.gloss}</p></div>
        <button class="card-close" aria-label="Close">${Me("close",18)}</button>
      </header>
      ${n?`<div class="zone-chip"><i style="background:${ws[t.zone]}"></i>${n.name}<em>${n.gloss}</em></div>`:""}
      <div class="card-body">${t.text.map(c=>`<p>${c}</p>`).join("")}</div>
      ${e?"":`<footer>
        <button class="nav prev" aria-label="Previous" ${this.index===0?"disabled":""}>${Me("prev",18)}</button>
        <span class="count">${this.index+1} / ${s}</span>
        ${this.index===s-1?`<button class="nav finish" aria-label="Explore">${Me("explore",18)}<span>Explore</span></button>`:`<button class="nav next" aria-label="Next">${Me("next",18)}</button>`}
      </footer>`}`,this.card.classList.add("show"),this.card.scrollTop=0,(o=Fe(".prev",this.card))==null||o.addEventListener("click",()=>this.goto(this.index-1)),(r=Fe(".next",this.card))==null||r.addEventListener("click",()=>this.goto(this.index+1)),(a=Fe(".finish",this.card))==null||a.addEventListener("click",()=>this.setMode("explore")),(l=Fe(".card-close",this.card))==null||l.addEventListener("click",()=>this.closeCard())}closeCard(){this.card.classList.remove("show")}regionAt(t,e){const n=this.app.island.data.region,s=ee,o=Math.floor((t+xt)/Zt*s),r=Math.floor((e+xt)/Zt*s);return o<0||r<0||o>=s||r>=s?0:n[(r*s+o)*4]}hover(t,e){if(t===null||this.mode!=="explore"){this.app.shared.uniforms.uHover.value=0,this.pinned||this.inspector.classList.remove("show");return}const n=this.app.rig.pickGround(t,e),s=n?this.regionAt(n.x,n.z):0;if(this.app.shared.uniforms.uHover.value=s,!this.pinned){if(!s){this.inspector.classList.remove("show");return}this.showInspector(s,t,e)}}pick(t,e){if(this.mode!=="explore")return;const n=this.app.rig.pickGround(t,e),s=n?this.regionAt(n.x,n.z):0;if(!s||s===this.focusGoal){this.focusGoal=0,this.pinned=!1,this.inspector.classList.remove("show","pinned");return}this.focusGoal=s,this.pinned=!0,this.showInspector(s,t,e,!0)}showInspector(t,e,n,s=!1){const o=this.meta.ahupuaa.find(c=>c.id===t);if(!o)return;if(this.inspectorId!==t){this.inspectorId=t;const c=Jg[o.moku],h=this.counts[t]||{},f=(u,d)=>d?`<span class="st">${Me(u,15)}${d}</span>`:"";this.inspector.innerHTML=`
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${o.moku+1})"></i>${c.name}<em>${c.gloss}</em></span></div>
        ${a1(o.profile)}
        <div class="in-stats"><span class="st">${o.area.toFixed(1)} km²</span><span class="st">${Me("akua",15)}${Math.round(o.top)} m</span>${f("loi",h.loi)}${f("kauhale",h.hale)}${f("heiau",h.heiau)}${f("loko",h.loko)}${f("koa",h.koa)}</div>`}this.inspector.classList.add("show"),this.inspector.classList.toggle("pinned",s);const r=innerWidth,a=Math.min(r-300,e+18),l=Math.max(70,Math.min(innerHeight-220,n+18));this.inspector.style.transform=`translate(${a}px, ${l}px)`}update(t){const e=this.app,n=e.shared.uniforms,s=1-Math.exp(-t*3);if(e.overlay.lerp(this.overlayGoal,s),this.focusGoal?(n.uFocus.value=this.focusGoal,n.uFocusK.value+=(1-n.uFocusK.value)*s):(n.uFocusK.value+=(0-n.uFocusK.value)*s,n.uFocusK.value<.01&&(n.uFocus.value=0)),this.timeTween){const o=this.timeTween;o.t=Math.min(1,o.t+t/o.dur),e.clock.hour=((o.from+o.by*s1(o.t))%24+24)%24,o.t>=1&&(this.timeTween=null)}if(this.playing&&this.mode==="tour"&&!e.rig.flight){const r=this.stops[this.index].text.join(" ").split(/\s+/).length,a=Math.max(9,r*.32)*1e3,l=performance.now()-this.arrivedAt;Fe("span",this.progress).style.width=`${Math.min(100,l/a*100)}%`,l>a&&(this.index<this.stops.length-1?this.goto(this.index+1):this.setPlaying(!1))}else Fe("span",this.progress).style.width="0%";this.updateMarkers(),this.frameN=(this.frameN||0)+1,this.frameN%6===0&&this.refreshDock()}updateMarkers(){if(this.mode!=="explore"||!this.layer.pins)return;const t=this.app.camera,e=innerWidth,n=innerHeight,s=new z,o=[],r=this.markers.map(a=>({m:a,d:t.position.distanceTo(a.pos)})).sort((a,l)=>a.d-l.d);for(const{m:a,d:l}of r){s.copy(a.pos).project(t);const c=s.z>1,h=(s.x+1)/2*e,f=(1-s.y)/2*n;let u=!c&&h>-40&&h<e+40&&f>60&&f<n+40&&l<420;u&&o.some(d=>Math.abs(d[0]-h)<44&&Math.abs(d[1]-f)<40)&&(u=!1),u&&o.push([h,f]),a.el.style.opacity=u?String(Math.min(1,(420-l)/120)):"0",a.el.style.pointerEvents=u?"auto":"none",u&&(a.el.style.transform=`translate(${h}px, ${f}px)`),a.el.classList.toggle("near",l<40)}}refreshDock(){const t=this.app,e=t.clock,n=t.light,s=Fe(".dial-body",this.dock),o=(e.hour-6)/12,r=e.hour<6||e.hour>18;let a;if(!r)a=Math.PI-o*Math.PI;else{const m=(e.hour-18+24)%24/12;a=Math.PI-m*Math.PI}const l=60+Math.cos(a)*52,c=58-Math.sin(a)*52;s.setAttribute("transform",`translate(${l.toFixed(1)} ${c.toFixed(1)})`),s.classList.toggle("moon",r),Fe(".dial-time",this.dock).textContent=i1(e.hour);const h=ug[t.sky.astro.night]||"",f=Fe(".dial-night",this.dock);f.textContent=n.night>.5?`Pō ${h}`:"",f.title="The night of the Hawaiian lunar month";for(const m of this.dock.querySelectorAll("[data-regime]"))m.classList.toggle("on",t.weather.mode===m.dataset.regime);const u=e.doy>120&&e.doy<305?"kau":"hooilo";t.season=u;for(const m of this.dock.querySelectorAll("[data-season]"))m.classList.toggle("on",u===m.dataset.season);for(const m of this.dock.querySelectorAll("[data-speed]"))m.classList.toggle("on",Number(m.dataset.speed)===e.speed||e.speed===20&&m.dataset.speed==="30");const d=t.weather.wind,g=Math.atan2(d.x,-d.y)*180/Math.PI;Fe(".wind-arrow",this.dock).style.transform=`rotate(${g.toFixed(0)}deg)`,Fe(".wind-speed",this.dock).textContent=`${Math.round(d.length()*3.6)} km/h`;const v=ao[t.weather.regime];Fe(".wind",this.dock).title=`${v.name} — ${v.gloss}`}start(){this.setMode("tour",!1),this.applyLayers(),this.goto(0)}}function a1(i){if(!i||i.length<2)return"";const t=260,e=78,n=i[i.length-1][0],s=Math.max(...i.map(u=>u[1]),200),o=Math.min(...i.map(u=>u[1]),-30),r=(e-14)/(s-o),a=u=>t-u/n*(t-4)-2,l=u=>e-6-(u-o)*r,c=l(0);let h="";for(let u=0;u<i.length-1;u++){const d=i[u],g=i[u+1];h+=`<path d="M${a(d[0]).toFixed(1)} ${c.toFixed(1)}L${a(d[0]).toFixed(1)} ${l(d[1]).toFixed(1)}L${a(g[0]).toFixed(1)} ${l(g[1]).toFixed(1)}L${a(g[0]).toFixed(1)} ${c.toFixed(1)}Z" fill="${ws[d[2]]}" stroke="${ws[d[2]]}" stroke-width=".6"/>`}const f=i.map((u,d)=>`${d?"L":"M"}${a(u[0]).toFixed(1)} ${l(u[1]).toFixed(1)}`).join("");return`<svg class="profile" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none">
    <rect x="0" y="${c.toFixed(1)}" width="${t}" height="${(e-c).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${h}
    <path d="${f}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${t}" y1="${c.toFixed(1)}" y2="${c.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`}const wo=document.getElementById("boot"),r1=wo.querySelector(".boot-bar span"),Jc=wo.querySelector(".boot-stage"),l1={shape:["raising the shields",.02,.1],erode:["the rain carves valleys",.1,.42],valleys:["filling the valley floors",.42,.55],coast:["growing the reef",.55,.7],divide:["tracing the ridgelines",.66,.7],detail:["shaping the ridges",.7,.8],people:["the people arrive",.8,.86],light:["reading the light",.86,.94],sky:["gathering clouds",.94,.99],done:["",1,1]};function c1(i){return new Promise((t,e)=>{const n=new Worker(new URL(""+new URL("worker-CbBf720d.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=s=>{const o=s.data;if(o.type==="progress"){const r=l1[o.stage];if(!r)return;Jc.textContent=r[0],r1.style.width=`${(r[1]+(r[2]-r[1])*o.p)*100}%`}else o.type==="done"?(n.terminate(),t({data:o.data,meta:o.meta})):o.type==="error"&&(n.terminate(),e(new Error(o.message)))},n.onerror=s=>e(s),n.postMessage({seed:i})})}async function h1(){const i=performance.now(),t=await c1(ah);console.log(`island generated in ${((performance.now()-i)/1e3).toFixed(1)} s`);const e=new zv(document.getElementById("scene"),t),n=new o1(e);window.__app=e,e.ui=n;let s=0;const o=()=>{if(++s<4)return requestAnimationFrame(o);wo.classList.add("gone"),setTimeout(()=>wo.remove(),1200),new URLSearchParams(location.search).has("cam")||n.start()};requestAnimationFrame(o)}h1().catch(i=>{console.error(i),Jc.textContent="something went wrong — see the console"});
