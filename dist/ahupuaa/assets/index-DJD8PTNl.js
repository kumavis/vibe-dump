(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const Kt=360,vt=Kt/2,Nc=.01,Oc=1.3,Nt=Nc*Oc,xn=2048,te=1024,Bc=20261004;function oa(s){const t=(s+180)*Math.PI/180;return[Math.sin(t),-Math.cos(t)]}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const wa="160",Hc=0,Wa=1,Gc=2,zl=1,Vc=2,An=3,Un=0,Ge=1,Ye=2,Wn=0,Ii=1,aa=2,qa=3,Xa=4,Wc=5,si=100,qc=101,Xc=102,Ya=103,$a=104,Yc=200,$c=201,jc=202,Kc=203,ra=204,la=205,Zc=206,Jc=207,Qc=208,th=209,eh=210,nh=211,ih=212,sh=213,oh=214,ah=0,rh=1,lh=2,so=3,ch=4,hh=5,uh=6,fh=7,Nl=0,dh=1,ph=2,qn=0,mh=1,gh=2,vh=3,xh=4,_h=5,Mh=6,Ol=300,Ni=301,Oi=302,ca=303,ha=304,mo=306,ci=1e3,$e=1001,ua=1002,ue=1003,ja=1004,So=1005,ee=1006,yh=1007,hi=1008,en=1009,wh=1010,Sh=1011,Sa=1012,Bl=1013,Ln=1014,fn=1015,In=1016,Hl=1017,Gl=1018,ai=1020,bh=1021,Fe=1023,Eh=1024,Th=1025,ri=1026,Bi=1027,fs=1028,Vl=1029,Ah=1030,Wl=1031,ql=1033,bo=33776,Eo=33777,To=33778,Ao=33779,Ka=35840,Za=35841,Ja=35842,Qa=35843,Xl=36196,tr=37492,er=37496,nr=37808,ir=37809,sr=37810,or=37811,ar=37812,rr=37813,lr=37814,cr=37815,hr=37816,ur=37817,fr=37818,dr=37819,pr=37820,mr=37821,Co=36492,gr=36494,vr=36495,Ch=36283,xr=36284,_r=36285,Mr=36286,Yl=3e3,li=3001,Rh=3200,Lh=3201,Ph=0,Dh=1,on="",Ae="srgb",Fn="srgb-linear",ba="display-p3",go="display-p3-linear",oo="linear",le="srgb",ao="rec709",ro="p3",ui=7680,yr=519,Uh=512,Ih=513,Fh=514,$l=515,kh=516,zh=517,Nh=518,Oh=519,wr=35044,Fi=35048,Sr="300 es",fa=1035,Pn=2e3,lo=2001;class Wi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const o=i.indexOf(e);o!==-1&&i.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let o=0,r=i.length;o<r;o++)i[o].call(this,t);t.target=null}}}const Le=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let br=1234567;const rs=Math.PI/180,ds=180/Math.PI;function qi(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Le[s&255]+Le[s>>8&255]+Le[s>>16&255]+Le[s>>24&255]+"-"+Le[t&255]+Le[t>>8&255]+"-"+Le[t>>16&15|64]+Le[t>>24&255]+"-"+Le[e&63|128]+Le[e>>8&255]+"-"+Le[e>>16&255]+Le[e>>24&255]+Le[n&255]+Le[n>>8&255]+Le[n>>16&255]+Le[n>>24&255]).toLowerCase()}function Ie(s,t,e){return Math.max(t,Math.min(e,s))}function Ea(s,t){return(s%t+t)%t}function Bh(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Hh(s,t,e){return s!==t?(e-s)/(t-s):0}function ls(s,t,e){return(1-e)*s+e*t}function Gh(s,t,e,n){return ls(s,t,1-Math.exp(-e*n))}function Vh(s,t=1){return t-Math.abs(Ea(s,t*2)-t)}function Wh(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function qh(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Xh(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Yh(s,t){return s+Math.random()*(t-s)}function $h(s){return s*(.5-Math.random())}function jh(s){s!==void 0&&(br=s);let t=br+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Kh(s){return s*rs}function Zh(s){return s*ds}function da(s){return(s&s-1)===0&&s!==0}function Jh(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function co(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Qh(s,t,e,n,i){const o=Math.cos,r=Math.sin,a=o(e/2),l=r(e/2),c=o((t+n)/2),h=r((t+n)/2),f=o((t-n)/2),u=r((t-n)/2),d=o((n-t)/2),v=r((n-t)/2);switch(i){case"XYX":s.set(a*h,l*f,l*u,a*c);break;case"YZY":s.set(l*u,a*h,l*f,a*c);break;case"ZXZ":s.set(l*f,l*u,a*h,a*c);break;case"XZX":s.set(a*h,l*v,l*d,a*c);break;case"YXY":s.set(l*d,a*h,l*v,a*c);break;case"ZYZ":s.set(l*v,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Li(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Be(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const gn={DEG2RAD:rs,RAD2DEG:ds,generateUUID:qi,clamp:Ie,euclideanModulo:Ea,mapLinear:Bh,inverseLerp:Hh,lerp:ls,damp:Gh,pingpong:Vh,smoothstep:Wh,smootherstep:qh,randInt:Xh,randFloat:Yh,randFloatSpread:$h,seededRandom:jh,degToRad:Kh,radToDeg:Zh,isPowerOfTwo:da,ceilPowerOfTwo:Jh,floorPowerOfTwo:co,setQuaternionFromProperEuler:Qh,normalize:Be,denormalize:Li};class kt{constructor(t=0,e=0){kt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*i+t.x,this.y=o*i+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,i,o,r,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,r,a,l,c)}set(t,e,n,i,o,r,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=o,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,r=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],v=n[8],g=i[0],p=i[3],m=i[6],_=i[1],x=i[4],y=i[7],w=i[2],M=i[5],E=i[8];return o[0]=r*g+a*_+l*w,o[3]=r*p+a*x+l*M,o[6]=r*m+a*y+l*E,o[1]=c*g+h*_+f*w,o[4]=c*p+h*x+f*M,o[7]=c*m+h*y+f*E,o[2]=u*g+d*_+v*w,o[5]=u*p+d*x+v*M,o[8]=u*m+d*y+v*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*a*c-n*o*h+n*a*l+i*o*c-i*r*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*r-a*c,u=a*l-h*o,d=c*o-r*l,v=e*f+n*u+i*d;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/v;return t[0]=f*g,t[1]=(i*c-h*n)*g,t[2]=(a*n-i*r)*g,t[3]=u*g,t[4]=(h*e-i*l)*g,t[5]=(i*o-a*e)*g,t[6]=d*g,t[7]=(n*l-c*e)*g,t[8]=(r*e-n*o)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,o,r,a){const l=Math.cos(o),c=Math.sin(o);return this.set(n*l,n*c,-n*(l*r+c*a)+r+t,-i*c,i*l,-i*(-c*r+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ro.makeScale(t,e)),this}rotate(t){return this.premultiply(Ro.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ro.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ro=new Yt;function jl(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ho(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function tu(){const s=ho("canvas");return s.style.display="block",s}const Er={};function cs(s){s in Er||(Er[s]=!0,console.warn(s))}const Tr=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ar=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),bs={[Fn]:{transfer:oo,primaries:ao,toReference:s=>s,fromReference:s=>s},[Ae]:{transfer:le,primaries:ao,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[go]:{transfer:oo,primaries:ro,toReference:s=>s.applyMatrix3(Ar),fromReference:s=>s.applyMatrix3(Tr)},[ba]:{transfer:le,primaries:ro,toReference:s=>s.convertSRGBToLinear().applyMatrix3(Ar),fromReference:s=>s.applyMatrix3(Tr).convertLinearToSRGB()}},eu=new Set([Fn,go]),Qt={enabled:!0,_workingColorSpace:Fn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!eu.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=bs[t].toReference,i=bs[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return bs[s].primaries},getTransfer:function(s){return s===on?oo:bs[s].transfer}};function ki(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Lo(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let fi;class Kl{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{fi===void 0&&(fi=ho("canvas")),fi.width=t.width,fi.height=t.height;const n=fi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=fi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ho("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),o=i.data;for(let r=0;r<o.length;r++)o[r]=ki(o[r]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ki(e[n]/255)*255):e[n]=ki(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let nu=0;class Zl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nu++}),this.uuid=qi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let r=0,a=i.length;r<a;r++)i[r].isDataTexture?o.push(Po(i[r].image)):o.push(Po(i[r]))}else o=Po(i);n.url=o}return e||(t.images[this.uuid]=n),n}}function Po(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Kl.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let iu=0;class je extends Wi{constructor(t=je.DEFAULT_IMAGE,e=je.DEFAULT_MAPPING,n=$e,i=$e,o=ee,r=hi,a=Fe,l=en,c=je.DEFAULT_ANISOTROPY,h=on){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iu++}),this.uuid=qi(),this.name="",this.source=new Zl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=r,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new kt(0,0),this.repeat=new kt(1,1),this.center=new kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===li?Ae:on),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ol)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ci:t.x=t.x-Math.floor(t.x);break;case $e:t.x=t.x<0?0:1;break;case ua:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ci:t.y=t.y-Math.floor(t.y);break;case $e:t.y=t.y<0?0:1;break;case ua:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ae?li:Yl}set encoding(t){cs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===li?Ae:on}}je.DEFAULT_IMAGE=null;je.DEFAULT_MAPPING=Ol;je.DEFAULT_ANISOTROPY=1;class me{constructor(t=0,e=0,n=0,i=1){me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*i+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*i+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*i+r[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,o;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],v=l[9],g=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-g)<.01&&Math.abs(v-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+g)<.1&&Math.abs(v+p)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,y=(d+1)/2,w=(m+1)/2,M=(h+u)/4,E=(f+g)/4,P=(v+p)/4;return x>y&&x>w?x<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(x),i=M/n,o=E/n):y>w?y<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(y),n=M/i,o=P/i):w<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(w),n=E/o,i=P/o),this.set(n,i,o,e),this}let _=Math.sqrt((p-v)*(p-v)+(f-g)*(f-g)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(p-v)/_,this.y=(f-g)/_,this.z=(u-h)/_,this.w=Math.acos((c+d+m-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class su extends Wi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(cs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===li?Ae:on),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ee,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new je(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Zl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class dn extends su{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Jl extends je{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ue,this.minFilter=ue,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pa extends je{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ue,this.minFilter=ue,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,o,r,a){let l=n[i+0],c=n[i+1],h=n[i+2],f=n[i+3];const u=o[r+0],d=o[r+1],v=o[r+2],g=o[r+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=u,t[e+1]=d,t[e+2]=v,t[e+3]=g;return}if(f!==g||l!==u||c!==d||h!==v){let p=1-a;const m=l*u+c*d+h*v+f*g,_=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const w=Math.sqrt(x),M=Math.atan2(w,m*_);p=Math.sin(p*M)/w,a=Math.sin(a*M)/w}const y=a*_;if(l=l*p+u*y,c=c*p+d*y,h=h*p+v*y,f=f*p+g*y,p===1-a){const w=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=w,c*=w,h*=w,f*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,i,o,r){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],f=o[r],u=o[r+1],d=o[r+2],v=o[r+3];return t[e]=a*v+h*f+l*d-c*u,t[e+1]=l*v+h*u+c*f-a*d,t[e+2]=c*v+h*d+a*u-l*f,t[e+3]=h*v-a*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,o=t._z,r=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),f=a(o/2),u=l(n/2),d=l(i/2),v=l(o/2);switch(r){case"XYZ":this._x=u*h*f+c*d*v,this._y=c*d*f-u*h*v,this._z=c*h*v+u*d*f,this._w=c*h*f-u*d*v;break;case"YXZ":this._x=u*h*f+c*d*v,this._y=c*d*f-u*h*v,this._z=c*h*v-u*d*f,this._w=c*h*f+u*d*v;break;case"ZXY":this._x=u*h*f-c*d*v,this._y=c*d*f+u*h*v,this._z=c*h*v+u*d*f,this._w=c*h*f-u*d*v;break;case"ZYX":this._x=u*h*f-c*d*v,this._y=c*d*f+u*h*v,this._z=c*h*v-u*d*f,this._w=c*h*f+u*d*v;break;case"YZX":this._x=u*h*f+c*d*v,this._y=c*d*f+u*h*v,this._z=c*h*v-u*d*f,this._w=c*h*f-u*d*v;break;case"XZY":this._x=u*h*f-c*d*v,this._y=c*d*f-u*h*v,this._z=c*h*v+u*d*f,this._w=c*h*f+u*d*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],o=e[8],r=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(o-c)*d,this._z=(r-i)*d}else if(n>a&&n>f){const d=2*Math.sqrt(1+n-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(i+r)/d,this._z=(o+c)/d}else if(a>f){const d=2*Math.sqrt(1+a-n-f);this._w=(o-c)/d,this._x=(i+r)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-a);this._w=(r-i)/d,this._x=(o+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ie(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,o=t._z,r=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+r*a+i*c-o*l,this._y=i*h+r*l+o*a-n*c,this._z=o*h+r*c+n*l-i*a,this._w=r*h-n*a-i*l-o*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+i*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=i,this._z=o,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),f=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=r*f+this._w*u,this._x=n*f+this._x*u,this._y=i*f+this._y*u,this._z=o*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(o),n*Math.cos(o),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(t=0,e=0,n=0){z.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Cr.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Cr.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*i,this.y=o[1]*e+o[4]*n+o[7]*i,this.z=o[2]*e+o[5]*n+o[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*i+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*i+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*i+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,o=t.x,r=t.y,a=t.z,l=t.w,c=2*(r*i-a*n),h=2*(a*e-o*i),f=2*(o*n-r*e);return this.x=e+l*c+r*f-a*h,this.y=n+l*h+a*c-o*f,this.z=i+l*f+o*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i,this.y=o[1]*e+o[5]*n+o[9]*i,this.z=o[2]*e+o[6]*n+o[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,o=t.z,r=e.x,a=e.y,l=e.z;return this.x=i*l-o*a,this.y=o*r-n*l,this.z=n*a-i*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Do.copy(this).projectOnVector(t),this.sub(Do)}reflect(t){return this.sub(Do.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ie(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Do=new z,Cr=new Yn;class _n{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,ln):ln.fromBufferAttribute(o,r),ln.applyMatrix4(t.matrixWorld),this.expandByPoint(ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Es.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Es.copy(n.boundingBox)),Es.applyMatrix4(t.matrixWorld),this.union(Es)}const i=t.children;for(let o=0,r=i.length;o<r;o++)this.expandByObject(i[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,ln),ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ji),Ts.subVectors(this.max,ji),di.subVectors(t.a,ji),pi.subVectors(t.b,ji),mi.subVectors(t.c,ji),Nn.subVectors(pi,di),On.subVectors(mi,pi),Zn.subVectors(di,mi);let e=[0,-Nn.z,Nn.y,0,-On.z,On.y,0,-Zn.z,Zn.y,Nn.z,0,-Nn.x,On.z,0,-On.x,Zn.z,0,-Zn.x,-Nn.y,Nn.x,0,-On.y,On.x,0,-Zn.y,Zn.x,0];return!Uo(e,di,pi,mi,Ts)||(e=[1,0,0,0,1,0,0,0,1],!Uo(e,di,pi,mi,Ts))?!1:(As.crossVectors(Nn,On),e=[As.x,As.y,As.z],Uo(e,di,pi,mi,Ts))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(yn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const yn=[new z,new z,new z,new z,new z,new z,new z,new z],ln=new z,Es=new _n,di=new z,pi=new z,mi=new z,Nn=new z,On=new z,Zn=new z,ji=new z,Ts=new z,As=new z,Jn=new z;function Uo(s,t,e,n,i){for(let o=0,r=s.length-3;o<=r;o+=3){Jn.fromArray(s,o);const a=i.x*Math.abs(Jn.x)+i.y*Math.abs(Jn.y)+i.z*Math.abs(Jn.z),l=t.dot(Jn),c=e.dot(Jn),h=n.dot(Jn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const ou=new _n,Ki=new z,Io=new z;class Xi{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ou.setFromPoints(t).getCenter(n);let i=0;for(let o=0,r=t.length;o<r;o++)i=Math.max(i,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ki.subVectors(t,this.center);const e=Ki.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ki,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Io.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ki.copy(t.center).add(Io)),this.expandByPoint(Ki.copy(t.center).sub(Io))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const wn=new z,Fo=new z,Cs=new z,Bn=new z,ko=new z,Rs=new z,zo=new z;class Ta{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,wn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=wn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(wn.copy(this.origin).addScaledVector(this.direction,e),wn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Fo.copy(t).add(e).multiplyScalar(.5),Cs.copy(e).sub(t).normalize(),Bn.copy(this.origin).sub(Fo);const o=t.distanceTo(e)*.5,r=-this.direction.dot(Cs),a=Bn.dot(this.direction),l=-Bn.dot(Cs),c=Bn.lengthSq(),h=Math.abs(1-r*r);let f,u,d,v;if(h>0)if(f=r*l-a,u=r*a-l,v=o*h,f>=0)if(u>=-v)if(u<=v){const g=1/h;f*=g,u*=g,d=f*(f+r*u+2*a)+u*(r*f+u+2*l)+c}else u=o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;else u=-o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;else u<=-v?(f=Math.max(0,-(-r*o+a)),u=f>0?-o:Math.min(Math.max(-o,-l),o),d=-f*f+u*(u+2*l)+c):u<=v?(f=0,u=Math.min(Math.max(-o,-l),o),d=u*(u+2*l)+c):(f=Math.max(0,-(r*o+a)),u=f>0?o:Math.min(Math.max(-o,-l),o),d=-f*f+u*(u+2*l)+c);else u=r>0?-o:o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(Fo).addScaledVector(Cs,u),d}intersectSphere(t,e){wn.subVectors(t.center,this.origin);const n=wn.dot(this.direction),i=wn.dot(wn)-n*n,o=t.radius*t.radius;if(i>o)return null;const r=Math.sqrt(o-i),a=n-r,l=n+r;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,o,r,a,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(o=(t.min.y-u.y)*h,r=(t.max.y-u.y)*h):(o=(t.max.y-u.y)*h,r=(t.min.y-u.y)*h),n>r||o>i||((o>n||isNaN(n))&&(n=o),(r<i||isNaN(i))&&(i=r),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,wn)!==null}intersectTriangle(t,e,n,i,o){ko.subVectors(e,t),Rs.subVectors(n,t),zo.crossVectors(ko,Rs);let r=this.direction.dot(zo),a;if(r>0){if(i)return null;a=1}else if(r<0)a=-1,r=-r;else return null;Bn.subVectors(this.origin,t);const l=a*this.direction.dot(Rs.crossVectors(Bn,Rs));if(l<0)return null;const c=a*this.direction.dot(ko.cross(Bn));if(c<0||l+c>r)return null;const h=-a*Bn.dot(zo);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Zt{constructor(t,e,n,i,o,r,a,l,c,h,f,u,d,v,g,p){Zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,r,a,l,c,h,f,u,d,v,g,p)}set(t,e,n,i,o,r,a,l,c,h,f,u,d,v,g,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=i,m[1]=o,m[5]=r,m[9]=a,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=u,m[3]=d,m[7]=v,m[11]=g,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Zt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/gi.setFromMatrixColumn(t,0).length(),o=1/gi.setFromMatrixColumn(t,1).length(),r=1/gi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(o),f=Math.sin(o);if(t.order==="XYZ"){const u=r*h,d=r*f,v=a*h,g=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+v*c,e[5]=u-g*c,e[9]=-a*l,e[2]=g-u*c,e[6]=v+d*c,e[10]=r*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,v=c*h,g=c*f;e[0]=u+g*a,e[4]=v*a-d,e[8]=r*c,e[1]=r*f,e[5]=r*h,e[9]=-a,e[2]=d*a-v,e[6]=g+u*a,e[10]=r*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,v=c*h,g=c*f;e[0]=u-g*a,e[4]=-r*f,e[8]=v+d*a,e[1]=d+v*a,e[5]=r*h,e[9]=g-u*a,e[2]=-r*c,e[6]=a,e[10]=r*l}else if(t.order==="ZYX"){const u=r*h,d=r*f,v=a*h,g=a*f;e[0]=l*h,e[4]=v*c-d,e[8]=u*c+g,e[1]=l*f,e[5]=g*c+u,e[9]=d*c-v,e[2]=-c,e[6]=a*l,e[10]=r*l}else if(t.order==="YZX"){const u=r*l,d=r*c,v=a*l,g=a*c;e[0]=l*h,e[4]=g-u*f,e[8]=v*f+d,e[1]=f,e[5]=r*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+v,e[10]=u-g*f}else if(t.order==="XZY"){const u=r*l,d=r*c,v=a*l,g=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+g,e[5]=r*h,e[9]=d*f-v,e[2]=v*f-d,e[6]=a*h,e[10]=g*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(au,t,ru)}lookAt(t,e,n){const i=this.elements;return Je.subVectors(t,e),Je.lengthSq()===0&&(Je.z=1),Je.normalize(),Hn.crossVectors(n,Je),Hn.lengthSq()===0&&(Math.abs(n.z)===1?Je.x+=1e-4:Je.z+=1e-4,Je.normalize(),Hn.crossVectors(n,Je)),Hn.normalize(),Ls.crossVectors(Je,Hn),i[0]=Hn.x,i[4]=Ls.x,i[8]=Je.x,i[1]=Hn.y,i[5]=Ls.y,i[9]=Je.y,i[2]=Hn.z,i[6]=Ls.z,i[10]=Je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,r=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],v=n[2],g=n[6],p=n[10],m=n[14],_=n[3],x=n[7],y=n[11],w=n[15],M=i[0],E=i[4],P=i[8],S=i[12],b=i[1],F=i[5],W=i[9],X=i[13],T=i[2],D=i[6],G=i[10],U=i[14],k=i[3],B=i[7],C=i[11],N=i[15];return o[0]=r*M+a*b+l*T+c*k,o[4]=r*E+a*F+l*D+c*B,o[8]=r*P+a*W+l*G+c*C,o[12]=r*S+a*X+l*U+c*N,o[1]=h*M+f*b+u*T+d*k,o[5]=h*E+f*F+u*D+d*B,o[9]=h*P+f*W+u*G+d*C,o[13]=h*S+f*X+u*U+d*N,o[2]=v*M+g*b+p*T+m*k,o[6]=v*E+g*F+p*D+m*B,o[10]=v*P+g*W+p*G+m*C,o[14]=v*S+g*X+p*U+m*N,o[3]=_*M+x*b+y*T+w*k,o[7]=_*E+x*F+y*D+w*B,o[11]=_*P+x*W+y*G+w*C,o[15]=_*S+x*X+y*U+w*N,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],o=t[12],r=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],v=t[3],g=t[7],p=t[11],m=t[15];return v*(+o*l*f-i*c*f-o*a*u+n*c*u+i*a*d-n*l*d)+g*(+e*l*d-e*c*u+o*r*u-i*r*d+i*c*h-o*l*h)+p*(+e*c*f-e*a*d-o*r*f+n*r*d+o*a*h-n*c*h)+m*(-i*a*h-e*l*f+e*a*u+i*r*f-n*r*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],v=t[12],g=t[13],p=t[14],m=t[15],_=f*p*c-g*u*c+g*l*d-a*p*d-f*l*m+a*u*m,x=v*u*c-h*p*c-v*l*d+r*p*d+h*l*m-r*u*m,y=h*g*c-v*f*c+v*a*d-r*g*d-h*a*m+r*f*m,w=v*f*l-h*g*l-v*a*u+r*g*u+h*a*p-r*f*p,M=e*_+n*x+i*y+o*w;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/M;return t[0]=_*E,t[1]=(g*u*o-f*p*o-g*i*d+n*p*d+f*i*m-n*u*m)*E,t[2]=(a*p*o-g*l*o+g*i*c-n*p*c-a*i*m+n*l*m)*E,t[3]=(f*l*o-a*u*o-f*i*c+n*u*c+a*i*d-n*l*d)*E,t[4]=x*E,t[5]=(h*p*o-v*u*o+v*i*d-e*p*d-h*i*m+e*u*m)*E,t[6]=(v*l*o-r*p*o-v*i*c+e*p*c+r*i*m-e*l*m)*E,t[7]=(r*u*o-h*l*o+h*i*c-e*u*c-r*i*d+e*l*d)*E,t[8]=y*E,t[9]=(v*f*o-h*g*o-v*n*d+e*g*d+h*n*m-e*f*m)*E,t[10]=(r*g*o-v*a*o+v*n*c-e*g*c-r*n*m+e*a*m)*E,t[11]=(h*a*o-r*f*o-h*n*c+e*f*c+r*n*d-e*a*d)*E,t[12]=w*E,t[13]=(h*g*i-v*f*i+v*n*u-e*g*u-h*n*p+e*f*p)*E,t[14]=(v*a*i-r*g*i-v*n*l+e*g*l+r*n*p-e*a*p)*E,t[15]=(r*f*i-h*a*i+h*n*l-e*f*l-r*n*u+e*a*u)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,o=t.z;return e[0]*=n,e[4]*=i,e[8]*=o,e[1]*=n,e[5]*=i,e[9]*=o,e[2]*=n,e[6]*=i,e[10]*=o,e[3]*=n,e[7]*=i,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),o=1-n,r=t.x,a=t.y,l=t.z,c=o*r,h=o*a;return this.set(c*r+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*r,0,c*l-i*a,h*l+i*r,o*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,o,r){return this.set(1,n,o,0,t,1,r,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,o=e._x,r=e._y,a=e._z,l=e._w,c=o+o,h=r+r,f=a+a,u=o*c,d=o*h,v=o*f,g=r*h,p=r*f,m=a*f,_=l*c,x=l*h,y=l*f,w=n.x,M=n.y,E=n.z;return i[0]=(1-(g+m))*w,i[1]=(d+y)*w,i[2]=(v-x)*w,i[3]=0,i[4]=(d-y)*M,i[5]=(1-(u+m))*M,i[6]=(p+_)*M,i[7]=0,i[8]=(v+x)*E,i[9]=(p-_)*E,i[10]=(1-(u+g))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let o=gi.set(i[0],i[1],i[2]).length();const r=gi.set(i[4],i[5],i[6]).length(),a=gi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),t.x=i[12],t.y=i[13],t.z=i[14],cn.copy(this);const c=1/o,h=1/r,f=1/a;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=f,cn.elements[9]*=f,cn.elements[10]*=f,e.setFromRotationMatrix(cn),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,i,o,r,a=Pn){const l=this.elements,c=2*o/(e-t),h=2*o/(n-i),f=(e+t)/(e-t),u=(n+i)/(n-i);let d,v;if(a===Pn)d=-(r+o)/(r-o),v=-2*r*o/(r-o);else if(a===lo)d=-r/(r-o),v=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,o,r,a=Pn){const l=this.elements,c=1/(e-t),h=1/(n-i),f=1/(r-o),u=(e+t)*c,d=(n+i)*h;let v,g;if(a===Pn)v=(r+o)*f,g=-2*f;else if(a===lo)v=o*f,g=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const gi=new z,cn=new Zt,au=new z(0,0,0),ru=new z(1,1,1),Hn=new z,Ls=new z,Je=new z,Rr=new Zt,Lr=new Yn;class Hi{constructor(t=0,e=0,n=0,i=Hi.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,o=i[0],r=i[4],a=i[8],l=i[1],c=i[5],h=i[9],f=i[2],u=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(Ie(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ie(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,o),this._z=0);break;case"ZXY":this._x=Math.asin(Ie(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-Ie(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(Ie(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,o)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ie(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Rr.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Rr,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Lr.setFromEuler(this),this.setFromQuaternion(Lr,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Hi.DEFAULT_ORDER="XYZ";class Aa{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let lu=0;const Pr=new z,vi=new Yn,Sn=new Zt,Ps=new z,Zi=new z,cu=new z,hu=new Yn,Dr=new z(1,0,0),Ur=new z(0,1,0),Ir=new z(0,0,1),uu={type:"added"},fu={type:"removed"};class Ke extends Wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lu++}),this.uuid=qi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ke.DEFAULT_UP.clone();const t=new z,e=new Hi,n=new Yn,i=new z(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Zt},normalMatrix:{value:new Yt}}),this.matrix=new Zt,this.matrixWorld=new Zt,this.matrixAutoUpdate=Ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Aa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.multiply(vi),this}rotateOnWorldAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.premultiply(vi),this}rotateX(t){return this.rotateOnAxis(Dr,t)}rotateY(t){return this.rotateOnAxis(Ur,t)}rotateZ(t){return this.rotateOnAxis(Ir,t)}translateOnAxis(t,e){return Pr.copy(t).applyQuaternion(this.quaternion),this.position.add(Pr.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Dr,t)}translateY(t){return this.translateOnAxis(Ur,t)}translateZ(t){return this.translateOnAxis(Ir,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ps.copy(t):Ps.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Zi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(Zi,Ps,this.up):Sn.lookAt(Ps,Zi,this.up),this.quaternion.setFromRotationMatrix(Sn),i&&(Sn.extractRotation(i.matrixWorld),vi.setFromRotationMatrix(Sn),this.quaternion.premultiply(vi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(uu)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(fu)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Sn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let o=0,r=i.length;o<r;o++)i[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zi,t,cu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zi,hu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const o=e[n];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let o=0,r=i.length;o<r;o++){const a=i[o];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function o(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];o(t.shapes,f)}else o(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(o(t.materials,this.material[l]));i.material=a}else i.material=o(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(o(t.animations,l))}}if(e){const a=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),f=r(t.shapes),u=r(t.skeletons),d=r(t.animations),v=r(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),v.length>0&&(n.nodes=v)}return n.object=i,n;function r(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Ke.DEFAULT_UP=new z(0,1,0);Ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new z,bn=new z,No=new z,En=new z,xi=new z,_i=new z,Fr=new z,Oo=new z,Bo=new z,Ho=new z;let Ds=!1;class un{constructor(t=new z,e=new z,n=new z){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),hn.subVectors(t,e),i.cross(hn);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(t,e,n,i,o){hn.subVectors(i,e),bn.subVectors(n,e),No.subVectors(t,e);const r=hn.dot(hn),a=hn.dot(bn),l=hn.dot(No),c=bn.dot(bn),h=bn.dot(No),f=r*c-a*a;if(f===0)return o.set(0,0,0),null;const u=1/f,d=(c*l-a*h)*u,v=(r*h-a*l)*u;return o.set(1-d-v,v,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getUV(t,e,n,i,o,r,a,l){return Ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ds=!0),this.getInterpolation(t,e,n,i,o,r,a,l)}static getInterpolation(t,e,n,i,o,r,a,l){return this.getBarycoord(t,e,n,i,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,En.x),l.addScaledVector(r,En.y),l.addScaledVector(a,En.z),l)}static isFrontFacing(t,e,n,i){return hn.subVectors(n,e),bn.subVectors(t,e),hn.cross(bn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hn.subVectors(this.c,this.b),bn.subVectors(this.a,this.b),hn.cross(bn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return un.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,o){return Ds===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ds=!0),un.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}getInterpolation(t,e,n,i,o){return un.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}containsPoint(t){return un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,o=this.c;let r,a;xi.subVectors(i,n),_i.subVectors(o,n),Oo.subVectors(t,n);const l=xi.dot(Oo),c=_i.dot(Oo);if(l<=0&&c<=0)return e.copy(n);Bo.subVectors(t,i);const h=xi.dot(Bo),f=_i.dot(Bo);if(h>=0&&f<=h)return e.copy(i);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return r=l/(l-h),e.copy(n).addScaledVector(xi,r);Ho.subVectors(t,o);const d=xi.dot(Ho),v=_i.dot(Ho);if(v>=0&&d<=v)return e.copy(o);const g=d*c-l*v;if(g<=0&&c>=0&&v<=0)return a=c/(c-v),e.copy(n).addScaledVector(_i,a);const p=h*v-d*f;if(p<=0&&f-h>=0&&d-v>=0)return Fr.subVectors(o,i),a=(f-h)/(f-h+(d-v)),e.copy(i).addScaledVector(Fr,a);const m=1/(p+g+u);return r=g*m,a=u*m,e.copy(n).addScaledVector(xi,r).addScaledVector(_i,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ql={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},Us={h:0,s:0,l:0};function Go(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Lt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ae){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Qt.workingColorSpace){if(t=Ea(t,1),e=Ie(e,0,1),n=Ie(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=Go(r,o,t+1/3),this.g=Go(r,o,t),this.b=Go(r,o,t-1/3)}return Qt.toWorkingColorSpace(this,i),this}setStyle(t,e=Ae){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=i[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ae){const n=Ql[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ki(t.r),this.g=ki(t.g),this.b=ki(t.b),this}copyLinearToSRGB(t){return this.r=Lo(t.r),this.g=Lo(t.g),this.b=Lo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ae){return Qt.fromWorkingColorSpace(Pe.copy(this),t),Math.round(Ie(Pe.r*255,0,255))*65536+Math.round(Ie(Pe.g*255,0,255))*256+Math.round(Ie(Pe.b*255,0,255))}getHexString(t=Ae){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.fromWorkingColorSpace(Pe.copy(this),e);const n=Pe.r,i=Pe.g,o=Pe.b,r=Math.max(n,i,o),a=Math.min(n,i,o);let l,c;const h=(a+r)/2;if(a===r)l=0,c=0;else{const f=r-a;switch(c=h<=.5?f/(r+a):f/(2-r-a),r){case n:l=(i-o)/f+(i<o?6:0);break;case i:l=(o-n)/f+2;break;case o:l=(n-i)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.fromWorkingColorSpace(Pe.copy(this),e),t.r=Pe.r,t.g=Pe.g,t.b=Pe.b,t}getStyle(t=Ae){Qt.fromWorkingColorSpace(Pe.copy(this),t);const e=Pe.r,n=Pe.g,i=Pe.b;return t!==Ae?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Gn),this.setHSL(Gn.h+t,Gn.s+e,Gn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Gn),t.getHSL(Us);const n=ls(Gn.h,Us.h,e),i=ls(Gn.s,Us.s,e),o=ls(Gn.l,Us.l,e);return this.setHSL(n,i,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*i,this.g=o[1]*e+o[4]*n+o[7]*i,this.b=o[2]*e+o[5]*n+o[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pe=new Lt;Lt.NAMES=Ql;let du=0;class gs extends Wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:du++}),this.uuid=qi(),this.name="",this.type="Material",this.blending=Ii,this.side=Un,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ra,this.blendDst=la,this.blendEquation=si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Lt(0,0,0),this.blendAlpha=0,this.depthFunc=so,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=yr,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ui,this.stencilZFail=ui,this.stencilZPass=ui,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ii&&(n.blending=this.blending),this.side!==Un&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ra&&(n.blendSrc=this.blendSrc),this.blendDst!==la&&(n.blendDst=this.blendDst),this.blendEquation!==si&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==so&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==yr&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ui&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ui&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ui&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const r=[];for(const a in o){const l=o[a];delete l.metadata,r.push(l)}return r}if(e){const o=i(t.textures),r=i(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class tc extends gs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Rn=pu();function pu(){const s=new ArrayBuffer(4),t=new Float32Array(s),e=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const o=new Uint32Array(2048),r=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,o[l]=c|h}for(let l=1024;l<2048;++l)o[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)r[l]=l<<23;r[31]=1199570944,r[32]=2147483648;for(let l=33;l<63;++l)r[l]=2147483648+(l-32<<23);r[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:o,exponentTable:r,offsetTable:a}}function mu(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=Ie(s,-65504,65504),Rn.floatView[0]=s;const t=Rn.uint32View[0],e=t>>23&511;return Rn.baseTable[e]+((t&8388607)>>Rn.shiftTable[e])}function gu(s){const t=s>>10;return Rn.uint32View[0]=Rn.mantissaTable[Rn.offsetTable[t]+(s&1023)]+Rn.exponentTable[t],Rn.floatView[0]}const kr={toHalfFloat:mu,fromHalfFloat:gu},Me=new z,Is=new kt;class he{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=wr,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Is.fromBufferAttribute(this,e),Is.applyMatrix3(t),this.setXY(e,Is.x,Is.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Li(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Be(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Li(e,this.array)),e}setX(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Li(e,this.array)),e}setY(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Li(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Li(e,this.array)),e}setW(t,e){return this.normalized&&(e=Be(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array),i=Be(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,o){return t*=this.itemSize,this.normalized&&(e=Be(e,this.array),n=Be(n,this.array),i=Be(i,this.array),o=Be(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wr&&(t.usage=this.usage),t}}class ec extends he{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class nc extends he{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends he{constructor(t,e,n){super(new Float32Array(t),e,n)}}let vu=0;const sn=new Zt,Vo=new Ke,Mi=new z,Qe=new _n,Ji=new _n,Ee=new z;class Ce extends Wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vu++}),this.uuid=qi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(jl(t)?nc:ec)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Yt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return Vo.lookAt(t),Vo.updateMatrix(),this.applyMatrix4(Vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Mi).negate(),this.translate(Mi.x,Mi.y,Mi.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new re(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new _n);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const o=e[n];Qe.setFromBufferAttribute(o),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,Qe.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,Qe.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(Qe.min),this.boundingBox.expandByPoint(Qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new z,1/0);return}if(t){const n=this.boundingSphere.center;if(Qe.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];Ji.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(Qe.min,Ji.min),Qe.expandByPoint(Ee),Ee.addVectors(Qe.max,Ji.max),Qe.expandByPoint(Ee)):(Qe.expandByPoint(Ji.min),Qe.expandByPoint(Ji.max))}Qe.getCenter(n);let i=0;for(let o=0,r=t.count;o<r;o++)Ee.fromBufferAttribute(t,o),i=Math.max(i,n.distanceToSquared(Ee));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ee.fromBufferAttribute(a,c),l&&(Mi.fromBufferAttribute(t,c),Ee.add(Mi)),i=Math.max(i,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,o=e.normal.array,r=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new he(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let b=0;b<a;b++)c[b]=new z,h[b]=new z;const f=new z,u=new z,d=new z,v=new kt,g=new kt,p=new kt,m=new z,_=new z;function x(b,F,W){f.fromArray(i,b*3),u.fromArray(i,F*3),d.fromArray(i,W*3),v.fromArray(r,b*2),g.fromArray(r,F*2),p.fromArray(r,W*2),u.sub(f),d.sub(f),g.sub(v),p.sub(v);const X=1/(g.x*p.y-p.x*g.y);isFinite(X)&&(m.copy(u).multiplyScalar(p.y).addScaledVector(d,-g.y).multiplyScalar(X),_.copy(d).multiplyScalar(g.x).addScaledVector(u,-p.x).multiplyScalar(X),c[b].add(m),c[F].add(m),c[W].add(m),h[b].add(_),h[F].add(_),h[W].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let b=0,F=y.length;b<F;++b){const W=y[b],X=W.start,T=W.count;for(let D=X,G=X+T;D<G;D+=3)x(n[D+0],n[D+1],n[D+2])}const w=new z,M=new z,E=new z,P=new z;function S(b){E.fromArray(o,b*3),P.copy(E);const F=c[b];w.copy(F),w.sub(E.multiplyScalar(E.dot(F))).normalize(),M.crossVectors(P,F);const X=M.dot(h[b])<0?-1:1;l[b*4]=w.x,l[b*4+1]=w.y,l[b*4+2]=w.z,l[b*4+3]=X}for(let b=0,F=y.length;b<F;++b){const W=y[b],X=W.start,T=W.count;for(let D=X,G=X+T;D<G;D+=3)S(n[D+0]),S(n[D+1]),S(n[D+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new he(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const i=new z,o=new z,r=new z,a=new z,l=new z,c=new z,h=new z,f=new z;if(t)for(let u=0,d=t.count;u<d;u+=3){const v=t.getX(u+0),g=t.getX(u+1),p=t.getX(u+2);i.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),r.fromBufferAttribute(e,p),h.subVectors(r,o),f.subVectors(i,o),h.cross(f),a.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(v,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)i.fromBufferAttribute(e,u+0),o.fromBufferAttribute(e,u+1),r.fromBufferAttribute(e,u+2),h.subVectors(r,o),f.subVectors(i,o),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h);let d=0,v=0;for(let g=0,p=l.length;g<p;g++){a.isInterleavedBufferAttribute?d=l[g]*a.data.stride+a.offset:d=l[g]*h;for(let m=0;m<h;m++)u[v++]=c[d++]}return new he(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const o=this.morphAttributes;for(const a in o){const l=[],c=o[a];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,l=r.length;a<l;a++){const c=r[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(i[l]=h,o=!0)}o&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const o=t.morphAttributes;for(const c in o){const h=[],f=o[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let c=0,h=r.length;c<h;c++){const f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zr=new Zt,Qn=new Ta,Fs=new Xi,Nr=new z,yi=new z,wi=new z,Si=new z,Wo=new z,ks=new z,zs=new kt,Ns=new kt,Os=new kt,Or=new z,Br=new z,Hr=new z,Bs=new z,Hs=new z;class ne extends Ke{constructor(t=new Ce,e=new tc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=i.length;o<r;o++){const a=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(o&&a){ks.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=a[l],f=o[l];h!==0&&(Wo.fromBufferAttribute(f,t),r?ks.addScaledVector(Wo,h):ks.addScaledVector(Wo.sub(e),h))}e.add(ks)}return e}raycast(t,e){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fs.copy(n.boundingSphere),Fs.applyMatrix4(o),Qn.copy(t.ray).recast(t.near),!(Fs.containsPoint(Qn.origin)===!1&&(Qn.intersectSphere(Fs,Nr)===null||Qn.origin.distanceToSquared(Nr)>(t.far-t.near)**2))&&(zr.copy(o).invert(),Qn.copy(t.ray).applyMatrix4(zr),!(n.boundingBox!==null&&Qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Qn)))}_computeIntersections(t,e,n){let i;const o=this.geometry,r=this.material,a=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,f=o.attributes.normal,u=o.groups,d=o.drawRange;if(a!==null)if(Array.isArray(r))for(let v=0,g=u.length;v<g;v++){const p=u[v],m=r[p.materialIndex],_=Math.max(p.start,d.start),x=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let y=_,w=x;y<w;y+=3){const M=a.getX(y),E=a.getX(y+1),P=a.getX(y+2);i=Gs(this,m,t,n,c,h,f,M,E,P),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,d.start),g=Math.min(a.count,d.start+d.count);for(let p=v,m=g;p<m;p+=3){const _=a.getX(p),x=a.getX(p+1),y=a.getX(p+2);i=Gs(this,r,t,n,c,h,f,_,x,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(r))for(let v=0,g=u.length;v<g;v++){const p=u[v],m=r[p.materialIndex],_=Math.max(p.start,d.start),x=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let y=_,w=x;y<w;y+=3){const M=y,E=y+1,P=y+2;i=Gs(this,m,t,n,c,h,f,M,E,P),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const v=Math.max(0,d.start),g=Math.min(l.count,d.start+d.count);for(let p=v,m=g;p<m;p+=3){const _=p,x=p+1,y=p+2;i=Gs(this,r,t,n,c,h,f,_,x,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function xu(s,t,e,n,i,o,r,a){let l;if(t.side===Ge?l=n.intersectTriangle(r,o,i,!0,a):l=n.intersectTriangle(i,o,r,t.side===Un,a),l===null)return null;Hs.copy(a),Hs.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Hs);return c<e.near||c>e.far?null:{distance:c,point:Hs.clone(),object:s}}function Gs(s,t,e,n,i,o,r,a,l,c){s.getVertexPosition(a,yi),s.getVertexPosition(l,wi),s.getVertexPosition(c,Si);const h=xu(s,t,e,n,yi,wi,Si,Bs);if(h){i&&(zs.fromBufferAttribute(i,a),Ns.fromBufferAttribute(i,l),Os.fromBufferAttribute(i,c),h.uv=un.getInterpolation(Bs,yi,wi,Si,zs,Ns,Os,new kt)),o&&(zs.fromBufferAttribute(o,a),Ns.fromBufferAttribute(o,l),Os.fromBufferAttribute(o,c),h.uv1=un.getInterpolation(Bs,yi,wi,Si,zs,Ns,Os,new kt),h.uv2=h.uv1),r&&(Or.fromBufferAttribute(r,a),Br.fromBufferAttribute(r,l),Hr.fromBufferAttribute(r,c),h.normal=un.getInterpolation(Bs,yi,wi,Si,Or,Br,Hr,new z),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new z,materialIndex:0};un.getNormal(yi,wi,Si,f.normal),h.face=f}return h}class vs extends Ce{constructor(t=1,e=1,n=1,i=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:o,depthSegments:r};const a=this;i=Math.floor(i),o=Math.floor(o),r=Math.floor(r);const l=[],c=[],h=[],f=[];let u=0,d=0;v("z","y","x",-1,-1,n,e,t,r,o,0),v("z","y","x",1,-1,n,e,-t,r,o,1),v("x","z","y",1,1,t,n,e,i,r,2),v("x","z","y",1,-1,t,n,-e,i,r,3),v("x","y","z",1,-1,t,e,n,i,o,4),v("x","y","z",-1,-1,t,e,-n,i,o,5),this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(f,2));function v(g,p,m,_,x,y,w,M,E,P,S){const b=y/E,F=w/P,W=y/2,X=w/2,T=M/2,D=E+1,G=P+1;let U=0,k=0;const B=new z;for(let C=0;C<G;C++){const N=C*F-X;for(let Z=0;Z<D;Z++){const O=Z*b-W;B[g]=O*_,B[p]=N*x,B[m]=T,c.push(B.x,B.y,B.z),B[g]=0,B[p]=0,B[m]=M>0?1:-1,h.push(B.x,B.y,B.z),f.push(Z/E),f.push(1-C/P),U+=1}}for(let C=0;C<P;C++)for(let N=0;N<E;N++){const Z=u+N+D*C,O=u+N+D*(C+1),$=u+(N+1)+D*(C+1),K=u+(N+1)+D*C;l.push(Z,O,K),l.push(O,$,K),k+=6}a.addGroup(d,k,S),d+=k,u+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new vs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Gi(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function He(s){const t={};for(let e=0;e<s.length;e++){const n=Gi(s[e]);for(const i in n)t[i]=n[i]}return t}function _u(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function ic(s){return s.getRenderTarget()===null?s.outputColorSpace:Qt.workingColorSpace}const Mu={clone:Gi,merge:He};var yu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _e extends gs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yu,this.fragmentShader=wu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Gi(t.uniforms),this.uniformsGroups=_u(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const r=this.uniforms[i].value;r&&r.isTexture?e.uniforms[i]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[i]={type:"m4",value:r.toArray()}:e.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class sc extends Ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Zt,this.projectionMatrix=new Zt,this.projectionMatrixInverse=new Zt,this.coordinateSystem=Pn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Xe extends sc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ds*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(rs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ds*2*Math.atan(Math.tan(rs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(rs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,o=-.5*i;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;o+=r.offsetX*i/l,e-=r.offsetY*n/c,i*=r.width/l,n*=r.height/c}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const bi=-90,Ei=1;class Su extends Ke{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Xe(bi,Ei,t,e);i.layers=this.layers,this.add(i);const o=new Xe(bi,Ei,t,e);o.layers=this.layers,this.add(o);const r=new Xe(bi,Ei,t,e);r.layers=this.layers,this.add(r);const a=new Xe(bi,Ei,t,e);a.layers=this.layers,this.add(a);const l=new Xe(bi,Ei,t,e);l.layers=this.layers,this.add(l);const c=new Xe(bi,Ei,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,o,r,a,l]=e;for(const c of e)this.remove(c);if(t===Pn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===lo)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,o),t.setRenderTarget(n,1,i),t.render(e,r),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class oc extends je{constructor(t,e,n,i,o,r,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ni,super(t,e,n,i,o,r,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class bu extends dn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(cs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===li?Ae:on),this.texture=new oc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ee}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new vs(5,5,5),o=new _e({name:"CubemapFromEquirect",uniforms:Gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ge,blending:Wn});o.uniforms.tEquirect.value=e;const r=new ne(i,o),a=e.minFilter;return e.minFilter===hi&&(e.minFilter=ee),new Su(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,i){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,i);t.setRenderTarget(o)}}const qo=new z,Eu=new z,Tu=new Yt;class ni{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=qo.subVectors(n,e).cross(Eu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(qo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Tu.getNormalMatrix(t),i=this.coplanarPoint(qo).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ti=new Xi,Vs=new z;class xs{constructor(t=new ni,e=new ni,n=new ni,i=new ni,o=new ni,r=new ni){this.planes=[t,e,n,i,o,r]}set(t,e,n,i,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Pn){const n=this.planes,i=t.elements,o=i[0],r=i[1],a=i[2],l=i[3],c=i[4],h=i[5],f=i[6],u=i[7],d=i[8],v=i[9],g=i[10],p=i[11],m=i[12],_=i[13],x=i[14],y=i[15];if(n[0].setComponents(l-o,u-c,p-d,y-m).normalize(),n[1].setComponents(l+o,u+c,p+d,y+m).normalize(),n[2].setComponents(l+r,u+h,p+v,y+_).normalize(),n[3].setComponents(l-r,u-h,p-v,y-_).normalize(),n[4].setComponents(l-a,u-f,p-g,y-x).normalize(),e===Pn)n[5].setComponents(l+a,u+f,p+g,y+x).normalize();else if(e===lo)n[5].setComponents(a,f,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ti.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ti.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ti)}intersectsSprite(t){return ti.center.set(0,0,0),ti.radius=.7071067811865476,ti.applyMatrix4(t.matrixWorld),this.intersectsSphere(ti)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Vs.x=i.normal.x>0?t.max.x:t.min.x,Vs.y=i.normal.y>0?t.max.y:t.min.y,Vs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Vs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ac(){let s=null,t=!1,e=null,n=null;function i(o,r){e(o,r),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){s=o}}}function Au(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const f=c.array,u=c.usage,d=f.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,f,u),c.onUploadCallback();let g;if(f instanceof Float32Array)g=s.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)g=s.SHORT;else if(f instanceof Uint32Array)g=s.UNSIGNED_INT;else if(f instanceof Int32Array)g=s.INT;else if(f instanceof Int8Array)g=s.BYTE;else if(f instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:v,type:g,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:d}}function o(c,h,f){const u=h.array,d=h._updateRange,v=h.updateRanges;if(s.bindBuffer(f,c),d.count===-1&&v.length===0&&s.bufferSubData(f,0,u),v.length!==0){for(let g=0,p=v.length;g<p;g++){const m=v[g];e?s.bufferSubData(f,m.start*u.BYTES_PER_ELEMENT,u,m.start,m.count):s.bufferSubData(f,m.start*u.BYTES_PER_ELEMENT,u.subarray(m.start,m.start+m.count))}h.clearUpdateRanges()}d.count!==-1&&(e?s.bufferSubData(f,d.offset*u.BYTES_PER_ELEMENT,u,d.offset,d.count):s.bufferSubData(f,d.offset*u.BYTES_PER_ELEMENT,u.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const u=n.get(c);(!u||u.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=n.get(c);if(f===void 0)n.set(c,i(c,h));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(f.buffer,c,h),f.version=c.version}}return{get:r,remove:a,update:l}}class Ca extends Ce{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const o=t/2,r=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,f=t/a,u=e/l,d=[],v=[],g=[],p=[];for(let m=0;m<h;m++){const _=m*u-r;for(let x=0;x<c;x++){const y=x*f-o;v.push(y,-_,0),g.push(0,0,1),p.push(x/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let _=0;_<a;_++){const x=_+c*m,y=_+c*(m+1),w=_+1+c*(m+1),M=_+1+c*m;d.push(x,y,M),d.push(y,w,M)}this.setIndex(d),this.setAttribute("position",new re(v,3)),this.setAttribute("normal",new re(g,3)),this.setAttribute("uv",new re(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ca(t.width,t.height,t.widthSegments,t.heightSegments)}}var Cu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ru=`#ifdef USE_ALPHAHASH
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
#endif`,Lu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Du=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Uu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Iu=`#ifdef USE_AOMAP
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
#endif`,Fu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ku=`#ifdef USE_BATCHING
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
#endif`,zu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Nu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ou=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Hu=`#ifdef USE_IRIDESCENCE
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
#endif`,Gu=`#ifdef USE_BUMPMAP
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
#endif`,Vu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Wu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$u=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,ju=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Ku=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Zu=`#define PI 3.141592653589793
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
} // validated`,Ju=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Qu=`vec3 transformedNormal = objectNormal;
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
#endif`,tf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ef=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,nf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,of="gl_FragColor = linearToOutputTexel( gl_FragColor );",af=`
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
}`,rf=`#ifdef USE_ENVMAP
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
#endif`,lf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cf=`#ifdef USE_ENVMAP
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
#endif`,hf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,uf=`#ifdef USE_ENVMAP
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
#endif`,ff=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,df=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gf=`#ifdef USE_GRADIENTMAP
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
}`,vf=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,xf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_f=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yf=`uniform bool receiveShadow;
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
#endif`,wf=`#ifdef USE_ENVMAP
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
#endif`,Sf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,bf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ef=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Af=`PhysicalMaterial material;
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
#endif`,Cf=`struct PhysicalMaterial {
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
}`,Rf=`
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
#endif`,Lf=`#if defined( RE_IndirectDiffuse )
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
#endif`,Pf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Df=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Uf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,If=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Ff=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,kf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,zf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Nf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Of=`#if defined( USE_POINTS_UV )
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
#endif`,Bf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vf=`#ifdef USE_MORPHNORMALS
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
#endif`,Wf=`#ifdef USE_MORPHTARGETS
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
#endif`,qf=`#ifdef USE_MORPHTARGETS
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
#endif`,Xf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Yf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$f=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zf=`#ifdef USE_NORMALMAP
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
#endif`,Jf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,td=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ed=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,nd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,id=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,od=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ad=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ld=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,hd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ud=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,dd=`float getShadowMask() {
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
}`,pd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,md=`#ifdef USE_SKINNING
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
#endif`,gd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vd=`#ifdef USE_SKINNING
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
#endif`,xd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_d=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Md=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yd=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,wd=`#ifdef USE_TRANSMISSION
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
#endif`,Sd=`#ifdef USE_TRANSMISSION
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
#endif`,bd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ed=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Td=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ad=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Cd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rd=`uniform sampler2D t2D;
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
}`,Ld=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pd=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Dd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ud=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Id=`#include <common>
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
}`,Fd=`#if DEPTH_PACKING == 3200
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
}`,kd=`#define DISTANCE
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
}`,zd=`#define DISTANCE
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
}`,Nd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Od=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bd=`uniform float scale;
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
}`,Hd=`uniform vec3 diffuse;
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
}`,Gd=`#include <common>
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
}`,Vd=`uniform vec3 diffuse;
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
}`,Wd=`#define LAMBERT
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
}`,qd=`#define LAMBERT
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
}`,Xd=`#define MATCAP
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
}`,Yd=`#define MATCAP
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
}`,$d=`#define NORMAL
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
}`,jd=`#define NORMAL
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
}`,Kd=`#define PHONG
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
}`,Zd=`#define PHONG
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
}`,Jd=`#define STANDARD
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
}`,Qd=`#define STANDARD
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
}`,e0=`#define TOON
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
}`,n0=`uniform float size;
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
}`,i0=`uniform vec3 diffuse;
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
}`,s0=`#include <common>
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
}`,o0=`uniform vec3 color;
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
}`,r0=`uniform vec3 diffuse;
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
}`,Vt={alphahash_fragment:Cu,alphahash_pars_fragment:Ru,alphamap_fragment:Lu,alphamap_pars_fragment:Pu,alphatest_fragment:Du,alphatest_pars_fragment:Uu,aomap_fragment:Iu,aomap_pars_fragment:Fu,batching_pars_vertex:ku,batching_vertex:zu,begin_vertex:Nu,beginnormal_vertex:Ou,bsdfs:Bu,iridescence_fragment:Hu,bumpmap_pars_fragment:Gu,clipping_planes_fragment:Vu,clipping_planes_pars_fragment:Wu,clipping_planes_pars_vertex:qu,clipping_planes_vertex:Xu,color_fragment:Yu,color_pars_fragment:$u,color_pars_vertex:ju,color_vertex:Ku,common:Zu,cube_uv_reflection_fragment:Ju,defaultnormal_vertex:Qu,displacementmap_pars_vertex:tf,displacementmap_vertex:ef,emissivemap_fragment:nf,emissivemap_pars_fragment:sf,colorspace_fragment:of,colorspace_pars_fragment:af,envmap_fragment:rf,envmap_common_pars_fragment:lf,envmap_pars_fragment:cf,envmap_pars_vertex:hf,envmap_physical_pars_fragment:wf,envmap_vertex:uf,fog_vertex:ff,fog_pars_vertex:df,fog_fragment:pf,fog_pars_fragment:mf,gradientmap_pars_fragment:gf,lightmap_fragment:vf,lightmap_pars_fragment:xf,lights_lambert_fragment:_f,lights_lambert_pars_fragment:Mf,lights_pars_begin:yf,lights_toon_fragment:Sf,lights_toon_pars_fragment:bf,lights_phong_fragment:Ef,lights_phong_pars_fragment:Tf,lights_physical_fragment:Af,lights_physical_pars_fragment:Cf,lights_fragment_begin:Rf,lights_fragment_maps:Lf,lights_fragment_end:Pf,logdepthbuf_fragment:Df,logdepthbuf_pars_fragment:Uf,logdepthbuf_pars_vertex:If,logdepthbuf_vertex:Ff,map_fragment:kf,map_pars_fragment:zf,map_particle_fragment:Nf,map_particle_pars_fragment:Of,metalnessmap_fragment:Bf,metalnessmap_pars_fragment:Hf,morphcolor_vertex:Gf,morphnormal_vertex:Vf,morphtarget_pars_vertex:Wf,morphtarget_vertex:qf,normal_fragment_begin:Xf,normal_fragment_maps:Yf,normal_pars_fragment:$f,normal_pars_vertex:jf,normal_vertex:Kf,normalmap_pars_fragment:Zf,clearcoat_normal_fragment_begin:Jf,clearcoat_normal_fragment_maps:Qf,clearcoat_pars_fragment:td,iridescence_pars_fragment:ed,opaque_fragment:nd,packing:id,premultiplied_alpha_fragment:sd,project_vertex:od,dithering_fragment:ad,dithering_pars_fragment:rd,roughnessmap_fragment:ld,roughnessmap_pars_fragment:cd,shadowmap_pars_fragment:hd,shadowmap_pars_vertex:ud,shadowmap_vertex:fd,shadowmask_pars_fragment:dd,skinbase_vertex:pd,skinning_pars_vertex:md,skinning_vertex:gd,skinnormal_vertex:vd,specularmap_fragment:xd,specularmap_pars_fragment:_d,tonemapping_fragment:Md,tonemapping_pars_fragment:yd,transmission_fragment:wd,transmission_pars_fragment:Sd,uv_pars_fragment:bd,uv_pars_vertex:Ed,uv_vertex:Td,worldpos_vertex:Ad,background_vert:Cd,background_frag:Rd,backgroundCube_vert:Ld,backgroundCube_frag:Pd,cube_vert:Dd,cube_frag:Ud,depth_vert:Id,depth_frag:Fd,distanceRGBA_vert:kd,distanceRGBA_frag:zd,equirect_vert:Nd,equirect_frag:Od,linedashed_vert:Bd,linedashed_frag:Hd,meshbasic_vert:Gd,meshbasic_frag:Vd,meshlambert_vert:Wd,meshlambert_frag:qd,meshmatcap_vert:Xd,meshmatcap_frag:Yd,meshnormal_vert:$d,meshnormal_frag:jd,meshphong_vert:Kd,meshphong_frag:Zd,meshphysical_vert:Jd,meshphysical_frag:Qd,meshtoon_vert:t0,meshtoon_frag:e0,points_vert:n0,points_frag:i0,shadow_vert:s0,shadow_frag:o0,sprite_vert:a0,sprite_frag:r0},gt={common:{diffuse:{value:new Lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Lt(16777215)},opacity:{value:1},center:{value:new kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},vn={basic:{uniforms:He([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:He([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:He([gt.common,gt.specularmap,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,gt.lights,{emissive:{value:new Lt(0)},specular:{value:new Lt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:He([gt.common,gt.envmap,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.roughnessmap,gt.metalnessmap,gt.fog,gt.lights,{emissive:{value:new Lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:He([gt.common,gt.aomap,gt.lightmap,gt.emissivemap,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.gradientmap,gt.fog,gt.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:He([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,gt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:He([gt.points,gt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:He([gt.common,gt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:He([gt.common,gt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:He([gt.common,gt.bumpmap,gt.normalmap,gt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:He([gt.sprite,gt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:He([gt.common,gt.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:He([gt.lights,gt.fog,{color:{value:new Lt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};vn.physical={uniforms:He([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Lt(0)},specularColor:{value:new Lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};const Ws={r:0,b:0,g:0};function l0(s,t,e,n,i,o,r){const a=new Lt(0);let l=o===!0?0:1,c,h,f=null,u=0,d=null;function v(p,m){let _=!1,x=m.isScene===!0?m.background:null;x&&x.isTexture&&(x=(m.backgroundBlurriness>0?e:t).get(x)),x===null?g(a,l):x&&x.isColor&&(g(x,1),_=!0);const y=s.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,r):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(s.autoClear||_)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),x&&(x.isCubeTexture||x.mapping===mo)?(h===void 0&&(h=new ne(new vs(1,1,1),new _e({name:"BackgroundCubeMaterial",uniforms:Gi(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:Ge,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,M,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,h.material.toneMapped=Qt.getTransfer(x.colorSpace)!==le,(f!==x||u!==x.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,f=x,u=x.version,d=s.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new ne(new Ca(2,2),new _e({name:"BackgroundMaterial",uniforms:Gi(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:Un,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,c.material.toneMapped=Qt.getTransfer(x.colorSpace)!==le,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(f!==x||u!==x.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,f=x,u=x.version,d=s.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function g(p,m){p.getRGB(Ws,ic(s)),n.buffers.color.setClear(Ws.r,Ws.g,Ws.b,m,r)}return{getClearColor:function(){return a},setClearColor:function(p,m=1){a.set(p),l=m,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,g(a,l)},render:v}}function c0(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:t.get("OES_vertex_array_object"),r=n.isWebGL2||o!==null,a={},l=p(null);let c=l,h=!1;function f(T,D,G,U,k){let B=!1;if(r){const C=g(U,G,D);c!==C&&(c=C,d(c.object)),B=m(T,U,G,k),B&&_(T,U,G,k)}else{const C=D.wireframe===!0;(c.geometry!==U.id||c.program!==G.id||c.wireframe!==C)&&(c.geometry=U.id,c.program=G.id,c.wireframe=C,B=!0)}k!==null&&e.update(k,s.ELEMENT_ARRAY_BUFFER),(B||h)&&(h=!1,P(T,D,G,U),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function u(){return n.isWebGL2?s.createVertexArray():o.createVertexArrayOES()}function d(T){return n.isWebGL2?s.bindVertexArray(T):o.bindVertexArrayOES(T)}function v(T){return n.isWebGL2?s.deleteVertexArray(T):o.deleteVertexArrayOES(T)}function g(T,D,G){const U=G.wireframe===!0;let k=a[T.id];k===void 0&&(k={},a[T.id]=k);let B=k[D.id];B===void 0&&(B={},k[D.id]=B);let C=B[U];return C===void 0&&(C=p(u()),B[U]=C),C}function p(T){const D=[],G=[],U=[];for(let k=0;k<i;k++)D[k]=0,G[k]=0,U[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:G,attributeDivisors:U,object:T,attributes:{},index:null}}function m(T,D,G,U){const k=c.attributes,B=D.attributes;let C=0;const N=G.getAttributes();for(const Z in N)if(N[Z].location>=0){const $=k[Z];let K=B[Z];if(K===void 0&&(Z==="instanceMatrix"&&T.instanceMatrix&&(K=T.instanceMatrix),Z==="instanceColor"&&T.instanceColor&&(K=T.instanceColor)),$===void 0||$.attribute!==K||K&&$.data!==K.data)return!0;C++}return c.attributesNum!==C||c.index!==U}function _(T,D,G,U){const k={},B=D.attributes;let C=0;const N=G.getAttributes();for(const Z in N)if(N[Z].location>=0){let $=B[Z];$===void 0&&(Z==="instanceMatrix"&&T.instanceMatrix&&($=T.instanceMatrix),Z==="instanceColor"&&T.instanceColor&&($=T.instanceColor));const K={};K.attribute=$,$&&$.data&&(K.data=$.data),k[Z]=K,C++}c.attributes=k,c.attributesNum=C,c.index=U}function x(){const T=c.newAttributes;for(let D=0,G=T.length;D<G;D++)T[D]=0}function y(T){w(T,0)}function w(T,D){const G=c.newAttributes,U=c.enabledAttributes,k=c.attributeDivisors;G[T]=1,U[T]===0&&(s.enableVertexAttribArray(T),U[T]=1),k[T]!==D&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](T,D),k[T]=D)}function M(){const T=c.newAttributes,D=c.enabledAttributes;for(let G=0,U=D.length;G<U;G++)D[G]!==T[G]&&(s.disableVertexAttribArray(G),D[G]=0)}function E(T,D,G,U,k,B,C){C===!0?s.vertexAttribIPointer(T,D,G,k,B):s.vertexAttribPointer(T,D,G,U,k,B)}function P(T,D,G,U){if(n.isWebGL2===!1&&(T.isInstancedMesh||U.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();const k=U.attributes,B=G.getAttributes(),C=D.defaultAttributeValues;for(const N in B){const Z=B[N];if(Z.location>=0){let O=k[N];if(O===void 0&&(N==="instanceMatrix"&&T.instanceMatrix&&(O=T.instanceMatrix),N==="instanceColor"&&T.instanceColor&&(O=T.instanceColor)),O!==void 0){const $=O.normalized,K=O.itemSize,tt=e.get(O);if(tt===void 0)continue;const ht=tt.buffer,lt=tt.type,V=tt.bytesPerElement,q=n.isWebGL2===!0&&(lt===s.INT||lt===s.UNSIGNED_INT||O.gpuType===Bl);if(O.isInterleavedBufferAttribute){const nt=O.data,I=nt.stride,xt=O.offset;if(nt.isInstancedInterleavedBuffer){for(let ct=0;ct<Z.locationSize;ct++)w(Z.location+ct,nt.meshPerAttribute);T.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let ct=0;ct<Z.locationSize;ct++)y(Z.location+ct);s.bindBuffer(s.ARRAY_BUFFER,ht);for(let ct=0;ct<Z.locationSize;ct++)E(Z.location+ct,K/Z.locationSize,lt,$,I*V,(xt+K/Z.locationSize*ct)*V,q)}else{if(O.isInstancedBufferAttribute){for(let nt=0;nt<Z.locationSize;nt++)w(Z.location+nt,O.meshPerAttribute);T.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let nt=0;nt<Z.locationSize;nt++)y(Z.location+nt);s.bindBuffer(s.ARRAY_BUFFER,ht);for(let nt=0;nt<Z.locationSize;nt++)E(Z.location+nt,K/Z.locationSize,lt,$,K*V,K/Z.locationSize*nt*V,q)}}else if(C!==void 0){const $=C[N];if($!==void 0)switch($.length){case 2:s.vertexAttrib2fv(Z.location,$);break;case 3:s.vertexAttrib3fv(Z.location,$);break;case 4:s.vertexAttrib4fv(Z.location,$);break;default:s.vertexAttrib1fv(Z.location,$)}}}}M()}function S(){W();for(const T in a){const D=a[T];for(const G in D){const U=D[G];for(const k in U)v(U[k].object),delete U[k];delete D[G]}delete a[T]}}function b(T){if(a[T.id]===void 0)return;const D=a[T.id];for(const G in D){const U=D[G];for(const k in U)v(U[k].object),delete U[k];delete D[G]}delete a[T.id]}function F(T){for(const D in a){const G=a[D];if(G[T.id]===void 0)continue;const U=G[T.id];for(const k in U)v(U[k].object),delete U[k];delete G[T.id]}}function W(){X(),h=!0,c!==l&&(c=l,d(c.object))}function X(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:W,resetDefaultState:X,dispose:S,releaseStatesOfGeometry:b,releaseStatesOfProgram:F,initAttributes:x,enableAttribute:y,disableUnusedAttributes:M}}function h0(s,t,e,n){const i=n.isWebGL2;let o;function r(h){o=h}function a(h,f){s.drawArrays(o,h,f),e.update(f,o,1)}function l(h,f,u){if(u===0)return;let d,v;if(i)d=s,v="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[v](o,h,f,u),e.update(f,o,u)}function c(h,f,u){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let v=0;v<u;v++)this.render(h[v],f[v]);else{d.multiDrawArraysWEBGL(o,h,0,f,0,u);let v=0;for(let g=0;g<u;g++)v+=f[g];e.update(v,o,1)}}this.setMode=r,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function u0(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const r=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=o(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=r||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),u=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),p=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),m=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),x=u>0,y=r||t.has("OES_texture_float"),w=x&&y,M=r?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:r,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:o,precision:a,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:u,maxTextureSize:d,maxCubemapSize:v,maxAttributes:g,maxVertexUniforms:p,maxVaryings:m,maxFragmentUniforms:_,vertexTextures:x,floatFragmentTextures:y,floatVertexTextures:w,maxSamples:M}}function f0(s){const t=this;let e=null,n=0,i=!1,o=!1;const r=new ni,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||i;return i=u,n=f.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const v=f.clippingPlanes,g=f.clipIntersection,p=f.clipShadows,m=s.get(f);if(!i||v===null||v.length===0||o&&!p)o?h(null):c();else{const _=o?0:n,x=_*4;let y=m.clippingState||null;l.value=y,y=h(v,u,x,d);for(let w=0;w!==x;++w)y[w]=e[w];m.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,v){const g=f!==null?f.length:0;let p=null;if(g!==0){if(p=l.value,v!==!0||p===null){const m=d+g*4,_=u.matrixWorldInverse;a.getNormalMatrix(_),(p===null||p.length<m)&&(p=new Float32Array(m));for(let x=0,y=d;x!==g;++x,y+=4)r.copy(f[x]).applyMatrix4(_,a),r.normal.toArray(p,y),p[y+3]=r.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function d0(s){let t=new WeakMap;function e(r,a){return a===ca?r.mapping=Ni:a===ha&&(r.mapping=Oi),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===ca||a===ha)if(t.has(r)){const l=t.get(r).texture;return e(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new bu(l.height/2);return c.fromEquirectangularTexture(s,r),t.set(r,c),r.addEventListener("dispose",i),e(c.texture,r.mapping)}else return null}}return r}function i(r){const a=r.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class _s extends sc{constructor(t=-1,e=1,n=1,i=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,r=o+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Di=4,Gr=[.125,.215,.35,.446,.526,.582],oi=20,Xo=new _s,Vr=new Lt;let Yo=null,$o=0,jo=0;const ii=(1+Math.sqrt(5))/2,Ti=1/ii,Wr=[new z(1,1,1),new z(-1,1,1),new z(1,1,-1),new z(-1,1,-1),new z(0,ii,Ti),new z(0,ii,-Ti),new z(Ti,0,ii),new z(-Ti,0,ii),new z(ii,Ti,0),new z(-ii,Ti,0)];class qr{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Yo=this._renderer.getRenderTarget(),$o=this._renderer.getActiveCubeFace(),jo=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,i,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$r(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yr(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Yo,$o,jo),t.scissorTest=!1,qs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ni||t.mapping===Oi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Yo=this._renderer.getRenderTarget(),$o=this._renderer.getActiveCubeFace(),jo=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ee,minFilter:ee,generateMipmaps:!1,type:In,format:Fe,colorSpace:Fn,depthBuffer:!1},i=Xr(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xr(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=p0(o)),this._blurMaterial=m0(o,t,e)}return i}_compileMaterial(t){const e=new ne(this._lodPlanes[0],t);this._renderer.compile(e,Xo)}_sceneToCubeUV(t,e,n,i){const a=new Xe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(Vr),h.toneMapping=qn,h.autoClear=!1;const d=new tc({name:"PMREM.Background",side:Ge,depthWrite:!1,depthTest:!1}),v=new ne(new vs,d);let g=!1;const p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,g=!0):(d.color.copy(Vr),g=!0);for(let m=0;m<6;m++){const _=m%3;_===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):_===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));const x=this._cubeSize;qs(i,_*x,m>2?x:0,x,x),h.setRenderTarget(i),g&&h.render(v,a),h.render(t,a)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ni||t.mapping===Oi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=$r()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yr());const o=i?this._cubemapMaterial:this._equirectMaterial,r=new ne(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const l=this._cubeSize;qs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(r,Xo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const o=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),r=Wr[(i-1)%Wr.length];this._blur(t,i-1,i,o,r)}e.autoClear=n}_blur(t,e,n,i,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,i,"latitudinal",o),this._halfBlur(r,t,n,n,i,"longitudinal",o)}_halfBlur(t,e,n,i,o,r,a){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ne(this._lodPlanes[i],c),u=c.uniforms,d=this._sizeLods[n]-1,v=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*oi-1),g=o/v,p=isFinite(o)?1+Math.floor(h*g):oi;p>oi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${oi}`);const m=[];let _=0;for(let E=0;E<oi;++E){const P=E/g,S=Math.exp(-P*P/2);m.push(S),E===0?_+=S:E<p&&(_+=2*S)}for(let E=0;E<m.length;E++)m[E]=m[E]/_;u.envMap.value=t.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=r==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:x}=this;u.dTheta.value=v,u.mipInt.value=x-n;const y=this._sizeLods[i],w=3*y*(i>x-Di?i-x+Di:0),M=4*(this._cubeSize-y);qs(e,w,M,3*y,2*y),l.setRenderTarget(e),l.render(f,Xo)}}function p0(s){const t=[],e=[],n=[];let i=s;const o=s-Di+1+Gr.length;for(let r=0;r<o;r++){const a=Math.pow(2,i);e.push(a);let l=1/a;r>s-Di?l=Gr[r-s+Di-1]:r===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,v=6,g=3,p=2,m=1,_=new Float32Array(g*v*d),x=new Float32Array(p*v*d),y=new Float32Array(m*v*d);for(let M=0;M<d;M++){const E=M%3*2/3-1,P=M>2?0:-1,S=[E,P,0,E+2/3,P,0,E+2/3,P+1,0,E,P,0,E+2/3,P+1,0,E,P+1,0];_.set(S,g*v*M),x.set(u,p*v*M);const b=[M,M,M,M,M,M];y.set(b,m*v*M)}const w=new Ce;w.setAttribute("position",new he(_,g)),w.setAttribute("uv",new he(x,p)),w.setAttribute("faceIndex",new he(y,m)),t.push(w),i>Di&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Xr(s,t,e){const n=new dn(s,t,e);return n.texture.mapping=mo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function qs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function m0(s,t,e){const n=new Float32Array(oi),i=new z(0,1,0);return new _e({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Yr(){return new _e({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ra(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function $r(){return new _e({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Ra(){return`

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
	`}function g0(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===ca||l===ha,h=l===Ni||l===Oi;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=t.get(a);return e===null&&(e=new qr(s)),f=c?e.fromEquirectangular(a,f):e.fromCubemap(a,f),t.set(a,f),f.texture}else{if(t.has(a))return t.get(a).texture;{const f=a.image;if(c&&f&&f.height>0||h&&f&&i(f)){e===null&&(e=new qr(s));const u=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,u),a.addEventListener("dispose",o),u.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function o(a){const l=a.target;l.removeEventListener("dispose",o);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function v0(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function x0(s,t,e,n){const i={},o=new WeakMap;function r(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const v in u.attributes)t.remove(u.attributes[v]);for(const v in u.morphAttributes){const g=u.morphAttributes[v];for(let p=0,m=g.length;p<m;p++)t.remove(g[p])}u.removeEventListener("dispose",r),delete i[u.id];const d=o.get(u);d&&(t.remove(d),o.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return i[u.id]===!0||(u.addEventListener("dispose",r),i[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const v in u)t.update(u[v],s.ARRAY_BUFFER);const d=f.morphAttributes;for(const v in d){const g=d[v];for(let p=0,m=g.length;p<m;p++)t.update(g[p],s.ARRAY_BUFFER)}}function c(f){const u=[],d=f.index,v=f.attributes.position;let g=0;if(d!==null){const _=d.array;g=d.version;for(let x=0,y=_.length;x<y;x+=3){const w=_[x+0],M=_[x+1],E=_[x+2];u.push(w,M,M,E,E,w)}}else if(v!==void 0){const _=v.array;g=v.version;for(let x=0,y=_.length/3-1;x<y;x+=3){const w=x+0,M=x+1,E=x+2;u.push(w,M,M,E,E,w)}}else return;const p=new(jl(u)?nc:ec)(u,1);p.version=g;const m=o.get(f);m&&t.remove(m),o.set(f,p)}function h(f){const u=o.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return o.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function _0(s,t,e,n){const i=n.isWebGL2;let o;function r(d){o=d}let a,l;function c(d){a=d.type,l=d.bytesPerElement}function h(d,v){s.drawElements(o,v,a,d*l),e.update(v,o,1)}function f(d,v,g){if(g===0)return;let p,m;if(i)p=s,m="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[m](o,v,a,d*l,g),e.update(v,o,g)}function u(d,v,g){if(g===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<g;m++)this.render(d[m]/l,v[m]);else{p.multiDrawElementsWEBGL(o,v,0,a,d,0,g);let m=0;for(let _=0;_<g;_++)m+=v[_];e.update(m,o,1)}}this.setMode=r,this.setIndex=c,this.render=h,this.renderInstances=f,this.renderMultiDraw=u}function M0(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case s.TRIANGLES:e.triangles+=a*(o/3);break;case s.LINES:e.lines+=a*(o/2);break;case s.LINE_STRIP:e.lines+=a*(o-1);break;case s.LINE_LOOP:e.lines+=a*o;break;case s.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function y0(s,t){return s[0]-t[0]}function w0(s,t){return Math.abs(t[1])-Math.abs(s[1])}function S0(s,t,e){const n={},i=new Float32Array(8),o=new WeakMap,r=new me,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,f){const u=c.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=d!==void 0?d.length:0;let g=o.get(h);if(g===void 0||g.count!==v){let T=function(){W.dispose(),o.delete(h),h.removeEventListener("dispose",T)};g!==void 0&&g.texture.dispose();const _=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],M=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let P=0;_===!0&&(P=1),x===!0&&(P=2),y===!0&&(P=3);let S=h.attributes.position.count*P,b=1;S>t.maxTextureSize&&(b=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const F=new Float32Array(S*b*4*v),W=new Jl(F,S,b,v);W.type=fn,W.needsUpdate=!0;const X=P*4;for(let D=0;D<v;D++){const G=w[D],U=M[D],k=E[D],B=S*b*4*D;for(let C=0;C<G.count;C++){const N=C*X;_===!0&&(r.fromBufferAttribute(G,C),F[B+N+0]=r.x,F[B+N+1]=r.y,F[B+N+2]=r.z,F[B+N+3]=0),x===!0&&(r.fromBufferAttribute(U,C),F[B+N+4]=r.x,F[B+N+5]=r.y,F[B+N+6]=r.z,F[B+N+7]=0),y===!0&&(r.fromBufferAttribute(k,C),F[B+N+8]=r.x,F[B+N+9]=r.y,F[B+N+10]=r.z,F[B+N+11]=k.itemSize===4?r.w:1)}}g={count:v,texture:W,size:new kt(S,b)},o.set(h,g),h.addEventListener("dispose",T)}let p=0;for(let _=0;_<u.length;_++)p+=u[_];const m=h.morphTargetsRelative?1:1-p;f.getUniforms().setValue(s,"morphTargetBaseInfluence",m),f.getUniforms().setValue(s,"morphTargetInfluences",u),f.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),f.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const d=u===void 0?0:u.length;let v=n[h.id];if(v===void 0||v.length!==d){v=[];for(let x=0;x<d;x++)v[x]=[x,0];n[h.id]=v}for(let x=0;x<d;x++){const y=v[x];y[0]=x,y[1]=u[x]}v.sort(w0);for(let x=0;x<8;x++)x<d&&v[x][1]?(a[x][0]=v[x][0],a[x][1]=v[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(y0);const g=h.morphAttributes.position,p=h.morphAttributes.normal;let m=0;for(let x=0;x<8;x++){const y=a[x],w=y[0],M=y[1];w!==Number.MAX_SAFE_INTEGER&&M?(g&&h.getAttribute("morphTarget"+x)!==g[w]&&h.setAttribute("morphTarget"+x,g[w]),p&&h.getAttribute("morphNormal"+x)!==p[w]&&h.setAttribute("morphNormal"+x,p[w]),i[x]=M,m+=M):(g&&h.hasAttribute("morphTarget"+x)===!0&&h.deleteAttribute("morphTarget"+x),p&&h.hasAttribute("morphNormal"+x)===!0&&h.deleteAttribute("morphNormal"+x),i[x]=0)}const _=h.morphTargetsRelative?1:1-m;f.getUniforms().setValue(s,"morphTargetBaseInfluence",_),f.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function b0(s,t,e,n){let i=new WeakMap;function o(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(i.get(f)!==c&&(t.update(f),i.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return f}function r(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:o,dispose:r}}class La extends je{constructor(t,e,n,i,o,r,a,l,c,h){if(h=h!==void 0?h:ri,h!==ri&&h!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ri&&(n=Ln),n===void 0&&h===Bi&&(n=ai),super(null,i,o,r,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:ue,this.minFilter=l!==void 0?l:ue,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const rc=new je,lc=new La(1,1);lc.compareFunction=$l;const cc=new Jl,hc=new pa,uc=new oc,jr=[],Kr=[],Zr=new Float32Array(16),Jr=new Float32Array(9),Qr=new Float32Array(4);function Yi(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let o=jr[i];if(o===void 0&&(o=new Float32Array(i),jr[i]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,s[r].toArray(o,a)}return o}function ye(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function we(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function vo(s,t){let e=Kr[t];e===void 0&&(e=new Int32Array(t),Kr[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function E0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function T0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;s.uniform2fv(this.addr,t),we(e,t)}}function A0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ye(e,t))return;s.uniform3fv(this.addr,t),we(e,t)}}function C0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;s.uniform4fv(this.addr,t),we(e,t)}}function R0(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),we(e,t)}else{if(ye(e,n))return;Qr.set(n),s.uniformMatrix2fv(this.addr,!1,Qr),we(e,n)}}function L0(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),we(e,t)}else{if(ye(e,n))return;Jr.set(n),s.uniformMatrix3fv(this.addr,!1,Jr),we(e,n)}}function P0(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),we(e,t)}else{if(ye(e,n))return;Zr.set(n),s.uniformMatrix4fv(this.addr,!1,Zr),we(e,n)}}function D0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function U0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;s.uniform2iv(this.addr,t),we(e,t)}}function I0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;s.uniform3iv(this.addr,t),we(e,t)}}function F0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;s.uniform4iv(this.addr,t),we(e,t)}}function k0(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function z0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;s.uniform2uiv(this.addr,t),we(e,t)}}function N0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;s.uniform3uiv(this.addr,t),we(e,t)}}function O0(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;s.uniform4uiv(this.addr,t),we(e,t)}}function B0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const o=this.type===s.SAMPLER_2D_SHADOW?lc:rc;e.setTexture2D(t||o,i)}function H0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||hc,i)}function G0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||uc,i)}function V0(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||cc,i)}function W0(s){switch(s){case 5126:return E0;case 35664:return T0;case 35665:return A0;case 35666:return C0;case 35674:return R0;case 35675:return L0;case 35676:return P0;case 5124:case 35670:return D0;case 35667:case 35671:return U0;case 35668:case 35672:return I0;case 35669:case 35673:return F0;case 5125:return k0;case 36294:return z0;case 36295:return N0;case 36296:return O0;case 35678:case 36198:case 36298:case 36306:case 35682:return B0;case 35679:case 36299:case 36307:return H0;case 35680:case 36300:case 36308:case 36293:return G0;case 36289:case 36303:case 36311:case 36292:return V0}}function q0(s,t){s.uniform1fv(this.addr,t)}function X0(s,t){const e=Yi(t,this.size,2);s.uniform2fv(this.addr,e)}function Y0(s,t){const e=Yi(t,this.size,3);s.uniform3fv(this.addr,e)}function $0(s,t){const e=Yi(t,this.size,4);s.uniform4fv(this.addr,e)}function j0(s,t){const e=Yi(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function K0(s,t){const e=Yi(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Z0(s,t){const e=Yi(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function J0(s,t){s.uniform1iv(this.addr,t)}function Q0(s,t){s.uniform2iv(this.addr,t)}function tp(s,t){s.uniform3iv(this.addr,t)}function ep(s,t){s.uniform4iv(this.addr,t)}function np(s,t){s.uniform1uiv(this.addr,t)}function ip(s,t){s.uniform2uiv(this.addr,t)}function sp(s,t){s.uniform3uiv(this.addr,t)}function op(s,t){s.uniform4uiv(this.addr,t)}function ap(s,t,e){const n=this.cache,i=t.length,o=vo(e,i);ye(n,o)||(s.uniform1iv(this.addr,o),we(n,o));for(let r=0;r!==i;++r)e.setTexture2D(t[r]||rc,o[r])}function rp(s,t,e){const n=this.cache,i=t.length,o=vo(e,i);ye(n,o)||(s.uniform1iv(this.addr,o),we(n,o));for(let r=0;r!==i;++r)e.setTexture3D(t[r]||hc,o[r])}function lp(s,t,e){const n=this.cache,i=t.length,o=vo(e,i);ye(n,o)||(s.uniform1iv(this.addr,o),we(n,o));for(let r=0;r!==i;++r)e.setTextureCube(t[r]||uc,o[r])}function cp(s,t,e){const n=this.cache,i=t.length,o=vo(e,i);ye(n,o)||(s.uniform1iv(this.addr,o),we(n,o));for(let r=0;r!==i;++r)e.setTexture2DArray(t[r]||cc,o[r])}function hp(s){switch(s){case 5126:return q0;case 35664:return X0;case 35665:return Y0;case 35666:return $0;case 35674:return j0;case 35675:return K0;case 35676:return Z0;case 5124:case 35670:return J0;case 35667:case 35671:return Q0;case 35668:case 35672:return tp;case 35669:case 35673:return ep;case 5125:return np;case 36294:return ip;case 36295:return sp;case 36296:return op;case 35678:case 36198:case 36298:case 36306:case 35682:return ap;case 35679:case 36299:case 36307:return rp;case 35680:case 36300:case 36308:case 36293:return lp;case 36289:case 36303:case 36311:case 36292:return cp}}class up{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=W0(e.type)}}class fp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=hp(e.type)}}class dp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let o=0,r=i.length;o!==r;++o){const a=i[o];a.setValue(t,e[a.id],n)}}}const Ko=/(\w+)(\])?(\[|\.)?/g;function tl(s,t){s.seq.push(t),s.map[t.id]=t}function pp(s,t,e){const n=s.name,i=n.length;for(Ko.lastIndex=0;;){const o=Ko.exec(n),r=Ko.lastIndex;let a=o[1];const l=o[2]==="]",c=o[3];if(l&&(a=a|0),c===void 0||c==="["&&r+2===i){tl(e,c===void 0?new up(a,s,t):new fp(a,s,t));break}else{let f=e.map[a];f===void 0&&(f=new dp(a),tl(e,f)),e=f}}}class Qs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=t.getActiveUniform(e,i),r=t.getUniformLocation(e,o.name);pp(o,r,this)}}setValue(t,e,n,i){const o=this.map[e];o!==void 0&&o.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let o=0,r=e.length;o!==r;++o){const a=e[o],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,o=t.length;i!==o;++i){const r=t[i];r.id in e&&n.push(r)}return n}}function el(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const mp=37297;let gp=0;function vp(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=i;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}function xp(s){const t=Qt.getPrimaries(Qt.workingColorSpace),e=Qt.getPrimaries(s);let n;switch(t===e?n="":t===ro&&e===ao?n="LinearDisplayP3ToLinearSRGB":t===ao&&e===ro&&(n="LinearSRGBToLinearDisplayP3"),s){case Fn:case go:return[n,"LinearTransferOETF"];case Ae:case ba:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function nl(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const o=/ERROR: 0:(\d+)/.exec(i);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+i+`

`+vp(s.getShaderSource(t),r)}else return i}function _p(s,t){const e=xp(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Mp(s,t){let e;switch(t){case mh:e="Linear";break;case gh:e="Reinhard";break;case vh:e="OptimizedCineon";break;case xh:e="ACESFilmic";break;case Mh:e="AgX";break;case _h:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function yp(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ui).join(`
`)}function wp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ui).join(`
`)}function Sp(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function bp(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=s.getActiveAttrib(t,i),r=o.name;let a=1;o.type===s.FLOAT_MAT2&&(a=2),o.type===s.FLOAT_MAT3&&(a=3),o.type===s.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:s.getAttribLocation(t,r),locationSize:a}}return e}function Ui(s){return s!==""}function il(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function sl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Ep=/^[ \t]*#include +<([\w\d./]+)>/gm;function ma(s){return s.replace(Ep,Ap)}const Tp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ap(s,t){let e=Vt[t];if(e===void 0){const n=Tp.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ma(e)}const Cp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ol(s){return s.replace(Cp,Rp)}function Rp(s,t,e,n){let i="";for(let o=parseInt(t);o<parseInt(e);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function al(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Lp(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===zl?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Vc?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===An&&(t="SHADOWMAP_TYPE_VSM"),t}function Pp(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ni:case Oi:t="ENVMAP_TYPE_CUBE";break;case mo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Dp(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Oi:t="ENVMAP_MODE_REFRACTION";break}return t}function Up(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Nl:t="ENVMAP_BLENDING_MULTIPLY";break;case dh:t="ENVMAP_BLENDING_MIX";break;case ph:t="ENVMAP_BLENDING_ADD";break}return t}function Ip(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Fp(s,t,e,n){const i=s.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const l=Lp(e),c=Pp(e),h=Dp(e),f=Up(e),u=Ip(e),d=e.isWebGL2?"":yp(e),v=wp(e),g=Sp(o),p=i.createProgram();let m,_,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ui).join(`
`),m.length>0&&(m+=`
`),_=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ui).join(`
`),_.length>0&&(_+=`
`)):(m=[al(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ui).join(`
`),_=[d,al(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==qn?"#define TONE_MAPPING":"",e.toneMapping!==qn?Vt.tonemapping_pars_fragment:"",e.toneMapping!==qn?Mp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,_p("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ui).join(`
`)),r=ma(r),r=il(r,e),r=sl(r,e),a=ma(a),a=il(a,e),a=sl(a,e),r=ol(r),a=ol(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,_=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Sr?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Sr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const y=x+m+r,w=x+_+a,M=el(i,i.VERTEX_SHADER,y),E=el(i,i.FRAGMENT_SHADER,w);i.attachShader(p,M),i.attachShader(p,E),e.index0AttributeName!==void 0?i.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(p,0,"position"),i.linkProgram(p);function P(W){if(s.debug.checkShaderErrors){const X=i.getProgramInfoLog(p).trim(),T=i.getShaderInfoLog(M).trim(),D=i.getShaderInfoLog(E).trim();let G=!0,U=!0;if(i.getProgramParameter(p,i.LINK_STATUS)===!1)if(G=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,p,M,E);else{const k=nl(i,M,"vertex"),B=nl(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(p,i.VALIDATE_STATUS)+`

Program Info Log: `+X+`
`+k+`
`+B)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(T===""||D==="")&&(U=!1);U&&(W.diagnostics={runnable:G,programLog:X,vertexShader:{log:T,prefix:m},fragmentShader:{log:D,prefix:_}})}i.deleteShader(M),i.deleteShader(E),S=new Qs(i,p),b=bp(i,p)}let S;this.getUniforms=function(){return S===void 0&&P(this),S};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let F=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return F===!1&&(F=i.getProgramParameter(p,mp)),F},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=gp++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=M,this.fragmentShader=E,this}let kp=0;class zp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(i)===!1&&(r.add(i),i.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Np(t),e.set(t,n)),n}}class Np{constructor(t){this.id=kp++,this.code=t,this.usedTimes=0}}function Op(s,t,e,n,i,o,r){const a=new Aa,l=new zp,c=[],h=i.isWebGL2,f=i.logarithmicDepthBuffer,u=i.vertexTextures;let d=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return S===0?"uv":`uv${S}`}function p(S,b,F,W,X){const T=W.fog,D=X.geometry,G=S.isMeshStandardMaterial?W.environment:null,U=(S.isMeshStandardMaterial?e:t).get(S.envMap||G),k=U&&U.mapping===mo?U.image.height:null,B=v[S.type];S.precision!==null&&(d=i.getMaxPrecision(S.precision),d!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const C=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,N=C!==void 0?C.length:0;let Z=0;D.morphAttributes.position!==void 0&&(Z=1),D.morphAttributes.normal!==void 0&&(Z=2),D.morphAttributes.color!==void 0&&(Z=3);let O,$,K,tt;if(B){const Ne=vn[B];O=Ne.vertexShader,$=Ne.fragmentShader}else O=S.vertexShader,$=S.fragmentShader,l.update(S),K=l.getVertexShaderID(S),tt=l.getFragmentShaderID(S);const ht=s.getRenderTarget(),lt=X.isInstancedMesh===!0,V=X.isBatchedMesh===!0,q=!!S.map,nt=!!S.matcap,I=!!U,xt=!!S.aoMap,ct=!!S.lightMap,dt=!!S.bumpMap,ut=!!S.normalMap,Ot=!!S.displacementMap,Ct=!!S.emissiveMap,L=!!S.metalnessMap,A=!!S.roughnessMap,j=S.anisotropy>0,at=S.clearcoat>0,st=S.iridescence>0,rt=S.sheen>0,wt=S.transmission>0,pt=j&&!!S.anisotropyMap,ft=at&&!!S.clearcoatMap,Et=at&&!!S.clearcoatNormalMap,Rt=at&&!!S.clearcoatRoughnessMap,ot=st&&!!S.iridescenceMap,$t=st&&!!S.iridescenceThicknessMap,It=rt&&!!S.sheenColorMap,Dt=rt&&!!S.sheenRoughnessMap,Tt=!!S.specularMap,St=!!S.specularColorMap,Gt=!!S.specularIntensityMap,Jt=wt&&!!S.transmissionMap,fe=wt&&!!S.thicknessMap,qt=!!S.gradientMap,mt=!!S.alphaMap,H=S.alphaTest>0,_t=!!S.alphaHash,Mt=!!S.extensions,Ft=!!D.attributes.uv1,Pt=!!D.attributes.uv2,ie=!!D.attributes.uv3;let se=qn;return S.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(se=s.toneMapping),{isWebGL2:h,shaderID:B,shaderType:S.type,shaderName:S.name,vertexShader:O,fragmentShader:$,defines:S.defines,customVertexShaderID:K,customFragmentShaderID:tt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:V,instancing:lt,instancingColor:lt&&X.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:ht===null?s.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:Fn,map:q,matcap:nt,envMap:I,envMapMode:I&&U.mapping,envMapCubeUVHeight:k,aoMap:xt,lightMap:ct,bumpMap:dt,normalMap:ut,displacementMap:u&&Ot,emissiveMap:Ct,normalMapObjectSpace:ut&&S.normalMapType===Dh,normalMapTangentSpace:ut&&S.normalMapType===Ph,metalnessMap:L,roughnessMap:A,anisotropy:j,anisotropyMap:pt,clearcoat:at,clearcoatMap:ft,clearcoatNormalMap:Et,clearcoatRoughnessMap:Rt,iridescence:st,iridescenceMap:ot,iridescenceThicknessMap:$t,sheen:rt,sheenColorMap:It,sheenRoughnessMap:Dt,specularMap:Tt,specularColorMap:St,specularIntensityMap:Gt,transmission:wt,transmissionMap:Jt,thicknessMap:fe,gradientMap:qt,opaque:S.transparent===!1&&S.blending===Ii,alphaMap:mt,alphaTest:H,alphaHash:_t,combine:S.combine,mapUv:q&&g(S.map.channel),aoMapUv:xt&&g(S.aoMap.channel),lightMapUv:ct&&g(S.lightMap.channel),bumpMapUv:dt&&g(S.bumpMap.channel),normalMapUv:ut&&g(S.normalMap.channel),displacementMapUv:Ot&&g(S.displacementMap.channel),emissiveMapUv:Ct&&g(S.emissiveMap.channel),metalnessMapUv:L&&g(S.metalnessMap.channel),roughnessMapUv:A&&g(S.roughnessMap.channel),anisotropyMapUv:pt&&g(S.anisotropyMap.channel),clearcoatMapUv:ft&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:Et&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Rt&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ot&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:$t&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:It&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&g(S.sheenRoughnessMap.channel),specularMapUv:Tt&&g(S.specularMap.channel),specularColorMapUv:St&&g(S.specularColorMap.channel),specularIntensityMapUv:Gt&&g(S.specularIntensityMap.channel),transmissionMapUv:Jt&&g(S.transmissionMap.channel),thicknessMapUv:fe&&g(S.thicknessMap.channel),alphaMapUv:mt&&g(S.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(ut||j),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,vertexUv1s:Ft,vertexUv2s:Pt,vertexUv3s:ie,pointsUvs:X.isPoints===!0&&!!D.attributes.uv&&(q||mt),fog:!!T,useFog:S.fog===!0,fogExp2:T&&T.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:X.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:N,morphTextureStride:Z,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&F.length>0,shadowMapType:s.shadowMap.type,toneMapping:se,useLegacyLights:s._useLegacyLights,decodeVideoTexture:q&&S.map.isVideoTexture===!0&&Qt.getTransfer(S.map.colorSpace)===le,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ye,flipSided:S.side===Ge,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:Mt&&S.extensions.derivatives===!0,extensionFragDepth:Mt&&S.extensions.fragDepth===!0,extensionDrawBuffers:Mt&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:Mt&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Mt&&S.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function m(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const F in S.defines)b.push(F),b.push(S.defines[F]);return S.isRawShaderMaterial===!1&&(_(b,S),x(b,S),b.push(s.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function _(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function x(S,b){a.disableAll(),b.isWebGL2&&a.enable(0),b.supportsVertexTextures&&a.enable(1),b.instancing&&a.enable(2),b.instancingColor&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),S.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.useLegacyLights&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),S.push(a.mask)}function y(S){const b=v[S.type];let F;if(b){const W=vn[b];F=Mu.clone(W.uniforms)}else F=S.uniforms;return F}function w(S,b){let F;for(let W=0,X=c.length;W<X;W++){const T=c[W];if(T.cacheKey===b){F=T,++F.usedTimes;break}}return F===void 0&&(F=new Fp(s,b,S,o),c.push(F)),F}function M(S){if(--S.usedTimes===0){const b=c.indexOf(S);c[b]=c[c.length-1],c.pop(),S.destroy()}}function E(S){l.remove(S)}function P(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:y,acquireProgram:w,releaseProgram:M,releaseShaderCache:E,programs:c,dispose:P}}function Bp(){let s=new WeakMap;function t(o){let r=s.get(o);return r===void 0&&(r={},s.set(o,r)),r}function e(o){s.delete(o)}function n(o,r,a){s.get(o)[r]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Hp(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function rl(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function ll(){const s=[];let t=0;const e=[],n=[],i=[];function o(){t=0,e.length=0,n.length=0,i.length=0}function r(f,u,d,v,g,p){let m=s[t];return m===void 0?(m={id:f.id,object:f,geometry:u,material:d,groupOrder:v,renderOrder:f.renderOrder,z:g,group:p},s[t]=m):(m.id=f.id,m.object=f,m.geometry=u,m.material=d,m.groupOrder=v,m.renderOrder=f.renderOrder,m.z=g,m.group=p),t++,m}function a(f,u,d,v,g,p){const m=r(f,u,d,v,g,p);d.transmission>0?n.push(m):d.transparent===!0?i.push(m):e.push(m)}function l(f,u,d,v,g,p){const m=r(f,u,d,v,g,p);d.transmission>0?n.unshift(m):d.transparent===!0?i.unshift(m):e.unshift(m)}function c(f,u){e.length>1&&e.sort(f||Hp),n.length>1&&n.sort(u||rl),i.length>1&&i.sort(u||rl)}function h(){for(let f=t,u=s.length;f<u;f++){const d=s[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:o,push:a,unshift:l,finish:h,sort:c}}function Gp(){let s=new WeakMap;function t(n,i){const o=s.get(n);let r;return o===void 0?(r=new ll,s.set(n,[r])):i>=o.length?(r=new ll,o.push(r)):r=o[i],r}function e(){s=new WeakMap}return{get:t,dispose:e}}function Vp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new Lt};break;case"SpotLight":e={position:new z,direction:new z,color:new Lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new Lt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new Lt,groundColor:new Lt};break;case"RectAreaLight":e={color:new Lt,position:new z,halfWidth:new z,halfHeight:new z};break}return s[t.id]=e,e}}}function Wp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let qp=0;function Xp(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Yp(s,t){const e=new Vp,n=Wp(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new z);const o=new z,r=new Zt,a=new Zt;function l(h,f){let u=0,d=0,v=0;for(let W=0;W<9;W++)i.probe[W].set(0,0,0);let g=0,p=0,m=0,_=0,x=0,y=0,w=0,M=0,E=0,P=0,S=0;h.sort(Xp);const b=f===!0?Math.PI:1;for(let W=0,X=h.length;W<X;W++){const T=h[W],D=T.color,G=T.intensity,U=T.distance,k=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)u+=D.r*G*b,d+=D.g*G*b,v+=D.b*G*b;else if(T.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(T.sh.coefficients[B],G);S++}else if(T.isDirectionalLight){const B=e.get(T);if(B.color.copy(T.color).multiplyScalar(T.intensity*b),T.castShadow){const C=T.shadow,N=n.get(T);N.shadowBias=C.bias,N.shadowNormalBias=C.normalBias,N.shadowRadius=C.radius,N.shadowMapSize=C.mapSize,i.directionalShadow[g]=N,i.directionalShadowMap[g]=k,i.directionalShadowMatrix[g]=T.shadow.matrix,y++}i.directional[g]=B,g++}else if(T.isSpotLight){const B=e.get(T);B.position.setFromMatrixPosition(T.matrixWorld),B.color.copy(D).multiplyScalar(G*b),B.distance=U,B.coneCos=Math.cos(T.angle),B.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),B.decay=T.decay,i.spot[m]=B;const C=T.shadow;if(T.map&&(i.spotLightMap[E]=T.map,E++,C.updateMatrices(T),T.castShadow&&P++),i.spotLightMatrix[m]=C.matrix,T.castShadow){const N=n.get(T);N.shadowBias=C.bias,N.shadowNormalBias=C.normalBias,N.shadowRadius=C.radius,N.shadowMapSize=C.mapSize,i.spotShadow[m]=N,i.spotShadowMap[m]=k,M++}m++}else if(T.isRectAreaLight){const B=e.get(T);B.color.copy(D).multiplyScalar(G),B.halfWidth.set(T.width*.5,0,0),B.halfHeight.set(0,T.height*.5,0),i.rectArea[_]=B,_++}else if(T.isPointLight){const B=e.get(T);if(B.color.copy(T.color).multiplyScalar(T.intensity*b),B.distance=T.distance,B.decay=T.decay,T.castShadow){const C=T.shadow,N=n.get(T);N.shadowBias=C.bias,N.shadowNormalBias=C.normalBias,N.shadowRadius=C.radius,N.shadowMapSize=C.mapSize,N.shadowCameraNear=C.camera.near,N.shadowCameraFar=C.camera.far,i.pointShadow[p]=N,i.pointShadowMap[p]=k,i.pointShadowMatrix[p]=T.shadow.matrix,w++}i.point[p]=B,p++}else if(T.isHemisphereLight){const B=e.get(T);B.skyColor.copy(T.color).multiplyScalar(G*b),B.groundColor.copy(T.groundColor).multiplyScalar(G*b),i.hemi[x]=B,x++}}_>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=gt.LTC_FLOAT_1,i.rectAreaLTC2=gt.LTC_FLOAT_2):(i.rectAreaLTC1=gt.LTC_HALF_1,i.rectAreaLTC2=gt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=gt.LTC_FLOAT_1,i.rectAreaLTC2=gt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=gt.LTC_HALF_1,i.rectAreaLTC2=gt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=v;const F=i.hash;(F.directionalLength!==g||F.pointLength!==p||F.spotLength!==m||F.rectAreaLength!==_||F.hemiLength!==x||F.numDirectionalShadows!==y||F.numPointShadows!==w||F.numSpotShadows!==M||F.numSpotMaps!==E||F.numLightProbes!==S)&&(i.directional.length=g,i.spot.length=m,i.rectArea.length=_,i.point.length=p,i.hemi.length=x,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=M+E-P,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=S,F.directionalLength=g,F.pointLength=p,F.spotLength=m,F.rectAreaLength=_,F.hemiLength=x,F.numDirectionalShadows=y,F.numPointShadows=w,F.numSpotShadows=M,F.numSpotMaps=E,F.numLightProbes=S,i.version=qp++)}function c(h,f){let u=0,d=0,v=0,g=0,p=0;const m=f.matrixWorldInverse;for(let _=0,x=h.length;_<x;_++){const y=h[_];if(y.isDirectionalLight){const w=i.directional[u];w.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(o),w.direction.transformDirection(m),u++}else if(y.isSpotLight){const w=i.spot[v];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(o),w.direction.transformDirection(m),v++}else if(y.isRectAreaLight){const w=i.rectArea[g];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const w=i.point[d];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const w=i.hemi[p];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(m),p++}}}return{setup:l,setupView:c,state:i}}function cl(s,t){const e=new Yp(s,t),n=[],i=[];function o(){n.length=0,i.length=0}function r(f){n.push(f)}function a(f){i.push(f)}function l(f){e.setup(n,f)}function c(f){e.setupView(n,f)}return{init:o,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:r,pushShadow:a}}function $p(s,t){let e=new WeakMap;function n(o,r=0){const a=e.get(o);let l;return a===void 0?(l=new cl(s,t),e.set(o,[l])):r>=a.length?(l=new cl(s,t),a.push(l)):l=a[r],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class jp extends gs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Rh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Kp extends gs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Zp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Jp=`uniform sampler2D shadow_pass;
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
}`;function Qp(s,t,e){let n=new xs;const i=new kt,o=new kt,r=new me,a=new jp({depthPacking:Lh}),l=new Kp,c={},h=e.maxTextureSize,f={[Un]:Ge,[Ge]:Un,[Ye]:Ye},u=new _e({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new kt},radius:{value:4}},vertexShader:Zp,fragmentShader:Jp}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const v=new Ce;v.setAttribute("position",new he(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ne(v,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zl;let m=this.type;this.render=function(M,E,P){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||M.length===0)return;const S=s.getRenderTarget(),b=s.getActiveCubeFace(),F=s.getActiveMipmapLevel(),W=s.state;W.setBlending(Wn),W.buffers.color.setClear(1,1,1,1),W.buffers.depth.setTest(!0),W.setScissorTest(!1);const X=m!==An&&this.type===An,T=m===An&&this.type!==An;for(let D=0,G=M.length;D<G;D++){const U=M[D],k=U.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",U,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);const B=k.getFrameExtents();if(i.multiply(B),o.copy(k.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(o.x=Math.floor(h/B.x),i.x=o.x*B.x,k.mapSize.x=o.x),i.y>h&&(o.y=Math.floor(h/B.y),i.y=o.y*B.y,k.mapSize.y=o.y)),k.map===null||X===!0||T===!0){const N=this.type!==An?{minFilter:ue,magFilter:ue}:{};k.map!==null&&k.map.dispose(),k.map=new dn(i.x,i.y,N),k.map.texture.name=U.name+".shadowMap",k.camera.updateProjectionMatrix()}s.setRenderTarget(k.map),s.clear();const C=k.getViewportCount();for(let N=0;N<C;N++){const Z=k.getViewport(N);r.set(o.x*Z.x,o.y*Z.y,o.x*Z.z,o.y*Z.w),W.viewport(r),k.updateMatrices(U,N),n=k.getFrustum(),y(E,P,k.camera,U,this.type)}k.isPointLightShadow!==!0&&this.type===An&&_(k,P),k.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(S,b,F)};function _(M,E){const P=t.update(g);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,d.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new dn(i.x,i.y)),u.uniforms.shadow_pass.value=M.map.texture,u.uniforms.resolution.value=M.mapSize,u.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(E,null,P,u,g,null),d.uniforms.shadow_pass.value=M.mapPass.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(E,null,P,d,g,null)}function x(M,E,P,S){let b=null;const F=P.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(F!==void 0)b=F;else if(b=P.isPointLight===!0?l:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const W=b.uuid,X=E.uuid;let T=c[W];T===void 0&&(T={},c[W]=T);let D=T[X];D===void 0&&(D=b.clone(),T[X]=D,E.addEventListener("dispose",w)),b=D}if(b.visible=E.visible,b.wireframe=E.wireframe,S===An?b.side=E.shadowSide!==null?E.shadowSide:E.side:b.side=E.shadowSide!==null?E.shadowSide:f[E.side],b.alphaMap=E.alphaMap,b.alphaTest=E.alphaTest,b.map=E.map,b.clipShadows=E.clipShadows,b.clippingPlanes=E.clippingPlanes,b.clipIntersection=E.clipIntersection,b.displacementMap=E.displacementMap,b.displacementScale=E.displacementScale,b.displacementBias=E.displacementBias,b.wireframeLinewidth=E.wireframeLinewidth,b.linewidth=E.linewidth,P.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const W=s.properties.get(b);W.light=P}return b}function y(M,E,P,S,b){if(M.visible===!1)return;if(M.layers.test(E.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&b===An)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,M.matrixWorld);const X=t.update(M),T=M.material;if(Array.isArray(T)){const D=X.groups;for(let G=0,U=D.length;G<U;G++){const k=D[G],B=T[k.materialIndex];if(B&&B.visible){const C=x(M,B,S,b);M.onBeforeShadow(s,M,E,P,X,C,k),s.renderBufferDirect(P,null,X,C,M,k),M.onAfterShadow(s,M,E,P,X,C,k)}}}else if(T.visible){const D=x(M,T,S,b);M.onBeforeShadow(s,M,E,P,X,D,null),s.renderBufferDirect(P,null,X,D,M,null),M.onAfterShadow(s,M,E,P,X,D,null)}}const W=M.children;for(let X=0,T=W.length;X<T;X++)y(W[X],E,P,S,b)}function w(M){M.target.removeEventListener("dispose",w);for(const P in c){const S=c[P],b=M.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}function tm(s,t,e){const n=e.isWebGL2;function i(){let H=!1;const _t=new me;let Mt=null;const Ft=new me(0,0,0,0);return{setMask:function(Pt){Mt!==Pt&&!H&&(s.colorMask(Pt,Pt,Pt,Pt),Mt=Pt)},setLocked:function(Pt){H=Pt},setClear:function(Pt,ie,se,Se,Ne){Ne===!0&&(Pt*=Se,ie*=Se,se*=Se),_t.set(Pt,ie,se,Se),Ft.equals(_t)===!1&&(s.clearColor(Pt,ie,se,Se),Ft.copy(_t))},reset:function(){H=!1,Mt=null,Ft.set(-1,0,0,0)}}}function o(){let H=!1,_t=null,Mt=null,Ft=null;return{setTest:function(Pt){Pt?V(s.DEPTH_TEST):q(s.DEPTH_TEST)},setMask:function(Pt){_t!==Pt&&!H&&(s.depthMask(Pt),_t=Pt)},setFunc:function(Pt){if(Mt!==Pt){switch(Pt){case ah:s.depthFunc(s.NEVER);break;case rh:s.depthFunc(s.ALWAYS);break;case lh:s.depthFunc(s.LESS);break;case so:s.depthFunc(s.LEQUAL);break;case ch:s.depthFunc(s.EQUAL);break;case hh:s.depthFunc(s.GEQUAL);break;case uh:s.depthFunc(s.GREATER);break;case fh:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Mt=Pt}},setLocked:function(Pt){H=Pt},setClear:function(Pt){Ft!==Pt&&(s.clearDepth(Pt),Ft=Pt)},reset:function(){H=!1,_t=null,Mt=null,Ft=null}}}function r(){let H=!1,_t=null,Mt=null,Ft=null,Pt=null,ie=null,se=null,Se=null,Ne=null;return{setTest:function(oe){H||(oe?V(s.STENCIL_TEST):q(s.STENCIL_TEST))},setMask:function(oe){_t!==oe&&!H&&(s.stencilMask(oe),_t=oe)},setFunc:function(oe,Oe,pn){(Mt!==oe||Ft!==Oe||Pt!==pn)&&(s.stencilFunc(oe,Oe,pn),Mt=oe,Ft=Oe,Pt=pn)},setOp:function(oe,Oe,pn){(ie!==oe||se!==Oe||Se!==pn)&&(s.stencilOp(oe,Oe,pn),ie=oe,se=Oe,Se=pn)},setLocked:function(oe){H=oe},setClear:function(oe){Ne!==oe&&(s.clearStencil(oe),Ne=oe)},reset:function(){H=!1,_t=null,Mt=null,Ft=null,Pt=null,ie=null,se=null,Se=null,Ne=null}}}const a=new i,l=new o,c=new r,h=new WeakMap,f=new WeakMap;let u={},d={},v=new WeakMap,g=[],p=null,m=!1,_=null,x=null,y=null,w=null,M=null,E=null,P=null,S=new Lt(0,0,0),b=0,F=!1,W=null,X=null,T=null,D=null,G=null;const U=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,B=0;const C=s.getParameter(s.VERSION);C.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(C)[1]),k=B>=1):C.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(C)[1]),k=B>=2);let N=null,Z={};const O=s.getParameter(s.SCISSOR_BOX),$=s.getParameter(s.VIEWPORT),K=new me().fromArray(O),tt=new me().fromArray($);function ht(H,_t,Mt,Ft){const Pt=new Uint8Array(4),ie=s.createTexture();s.bindTexture(H,ie),s.texParameteri(H,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(H,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let se=0;se<Mt;se++)n&&(H===s.TEXTURE_3D||H===s.TEXTURE_2D_ARRAY)?s.texImage3D(_t,0,s.RGBA,1,1,Ft,0,s.RGBA,s.UNSIGNED_BYTE,Pt):s.texImage2D(_t+se,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Pt);return ie}const lt={};lt[s.TEXTURE_2D]=ht(s.TEXTURE_2D,s.TEXTURE_2D,1),lt[s.TEXTURE_CUBE_MAP]=ht(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(lt[s.TEXTURE_2D_ARRAY]=ht(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),lt[s.TEXTURE_3D]=ht(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),V(s.DEPTH_TEST),l.setFunc(so),Ct(!1),L(Wa),V(s.CULL_FACE),ut(Wn);function V(H){u[H]!==!0&&(s.enable(H),u[H]=!0)}function q(H){u[H]!==!1&&(s.disable(H),u[H]=!1)}function nt(H,_t){return d[H]!==_t?(s.bindFramebuffer(H,_t),d[H]=_t,n&&(H===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=_t),H===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=_t)),!0):!1}function I(H,_t){let Mt=g,Ft=!1;if(H)if(Mt=v.get(_t),Mt===void 0&&(Mt=[],v.set(_t,Mt)),H.isWebGLMultipleRenderTargets){const Pt=H.texture;if(Mt.length!==Pt.length||Mt[0]!==s.COLOR_ATTACHMENT0){for(let ie=0,se=Pt.length;ie<se;ie++)Mt[ie]=s.COLOR_ATTACHMENT0+ie;Mt.length=Pt.length,Ft=!0}}else Mt[0]!==s.COLOR_ATTACHMENT0&&(Mt[0]=s.COLOR_ATTACHMENT0,Ft=!0);else Mt[0]!==s.BACK&&(Mt[0]=s.BACK,Ft=!0);Ft&&(e.isWebGL2?s.drawBuffers(Mt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Mt))}function xt(H){return p!==H?(s.useProgram(H),p=H,!0):!1}const ct={[si]:s.FUNC_ADD,[qc]:s.FUNC_SUBTRACT,[Xc]:s.FUNC_REVERSE_SUBTRACT};if(n)ct[Ya]=s.MIN,ct[$a]=s.MAX;else{const H=t.get("EXT_blend_minmax");H!==null&&(ct[Ya]=H.MIN_EXT,ct[$a]=H.MAX_EXT)}const dt={[Yc]:s.ZERO,[$c]:s.ONE,[jc]:s.SRC_COLOR,[ra]:s.SRC_ALPHA,[eh]:s.SRC_ALPHA_SATURATE,[Qc]:s.DST_COLOR,[Zc]:s.DST_ALPHA,[Kc]:s.ONE_MINUS_SRC_COLOR,[la]:s.ONE_MINUS_SRC_ALPHA,[th]:s.ONE_MINUS_DST_COLOR,[Jc]:s.ONE_MINUS_DST_ALPHA,[nh]:s.CONSTANT_COLOR,[ih]:s.ONE_MINUS_CONSTANT_COLOR,[sh]:s.CONSTANT_ALPHA,[oh]:s.ONE_MINUS_CONSTANT_ALPHA};function ut(H,_t,Mt,Ft,Pt,ie,se,Se,Ne,oe){if(H===Wn){m===!0&&(q(s.BLEND),m=!1);return}if(m===!1&&(V(s.BLEND),m=!0),H!==Wc){if(H!==_||oe!==F){if((x!==si||M!==si)&&(s.blendEquation(s.FUNC_ADD),x=si,M=si),oe)switch(H){case Ii:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case aa:s.blendFunc(s.ONE,s.ONE);break;case qa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Xa:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case Ii:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case aa:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case qa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Xa:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}y=null,w=null,E=null,P=null,S.set(0,0,0),b=0,_=H,F=oe}return}Pt=Pt||_t,ie=ie||Mt,se=se||Ft,(_t!==x||Pt!==M)&&(s.blendEquationSeparate(ct[_t],ct[Pt]),x=_t,M=Pt),(Mt!==y||Ft!==w||ie!==E||se!==P)&&(s.blendFuncSeparate(dt[Mt],dt[Ft],dt[ie],dt[se]),y=Mt,w=Ft,E=ie,P=se),(Se.equals(S)===!1||Ne!==b)&&(s.blendColor(Se.r,Se.g,Se.b,Ne),S.copy(Se),b=Ne),_=H,F=!1}function Ot(H,_t){H.side===Ye?q(s.CULL_FACE):V(s.CULL_FACE);let Mt=H.side===Ge;_t&&(Mt=!Mt),Ct(Mt),H.blending===Ii&&H.transparent===!1?ut(Wn):ut(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),l.setFunc(H.depthFunc),l.setTest(H.depthTest),l.setMask(H.depthWrite),a.setMask(H.colorWrite);const Ft=H.stencilWrite;c.setTest(Ft),Ft&&(c.setMask(H.stencilWriteMask),c.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),c.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),j(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?V(s.SAMPLE_ALPHA_TO_COVERAGE):q(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(H){W!==H&&(H?s.frontFace(s.CW):s.frontFace(s.CCW),W=H)}function L(H){H!==Hc?(V(s.CULL_FACE),H!==X&&(H===Wa?s.cullFace(s.BACK):H===Gc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):q(s.CULL_FACE),X=H}function A(H){H!==T&&(k&&s.lineWidth(H),T=H)}function j(H,_t,Mt){H?(V(s.POLYGON_OFFSET_FILL),(D!==_t||G!==Mt)&&(s.polygonOffset(_t,Mt),D=_t,G=Mt)):q(s.POLYGON_OFFSET_FILL)}function at(H){H?V(s.SCISSOR_TEST):q(s.SCISSOR_TEST)}function st(H){H===void 0&&(H=s.TEXTURE0+U-1),N!==H&&(s.activeTexture(H),N=H)}function rt(H,_t,Mt){Mt===void 0&&(N===null?Mt=s.TEXTURE0+U-1:Mt=N);let Ft=Z[Mt];Ft===void 0&&(Ft={type:void 0,texture:void 0},Z[Mt]=Ft),(Ft.type!==H||Ft.texture!==_t)&&(N!==Mt&&(s.activeTexture(Mt),N=Mt),s.bindTexture(H,_t||lt[H]),Ft.type=H,Ft.texture=_t)}function wt(){const H=Z[N];H!==void 0&&H.type!==void 0&&(s.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function pt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ft(){try{s.compressedTexImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Et(){try{s.texSubImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Rt(){try{s.texSubImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ot(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function $t(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function It(){try{s.texStorage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Dt(){try{s.texStorage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Tt(){try{s.texImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function St(){try{s.texImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Gt(H){K.equals(H)===!1&&(s.scissor(H.x,H.y,H.z,H.w),K.copy(H))}function Jt(H){tt.equals(H)===!1&&(s.viewport(H.x,H.y,H.z,H.w),tt.copy(H))}function fe(H,_t){let Mt=f.get(_t);Mt===void 0&&(Mt=new WeakMap,f.set(_t,Mt));let Ft=Mt.get(H);Ft===void 0&&(Ft=s.getUniformBlockIndex(_t,H.name),Mt.set(H,Ft))}function qt(H,_t){const Ft=f.get(_t).get(H);h.get(_t)!==Ft&&(s.uniformBlockBinding(_t,Ft,H.__bindingPointIndex),h.set(_t,Ft))}function mt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},N=null,Z={},d={},v=new WeakMap,g=[],p=null,m=!1,_=null,x=null,y=null,w=null,M=null,E=null,P=null,S=new Lt(0,0,0),b=0,F=!1,W=null,X=null,T=null,D=null,G=null,K.set(0,0,s.canvas.width,s.canvas.height),tt.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:V,disable:q,bindFramebuffer:nt,drawBuffers:I,useProgram:xt,setBlending:ut,setMaterial:Ot,setFlipSided:Ct,setCullFace:L,setLineWidth:A,setPolygonOffset:j,setScissorTest:at,activeTexture:st,bindTexture:rt,unbindTexture:wt,compressedTexImage2D:pt,compressedTexImage3D:ft,texImage2D:Tt,texImage3D:St,updateUBOMapping:fe,uniformBlockBinding:qt,texStorage2D:It,texStorage3D:Dt,texSubImage2D:Et,texSubImage3D:Rt,compressedTexSubImage2D:ot,compressedTexSubImage3D:$t,scissor:Gt,viewport:Jt,reset:mt}}function em(s,t,e,n,i,o,r){const a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let f;const u=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(L,A){return d?new OffscreenCanvas(L,A):ho("canvas")}function g(L,A,j,at){let st=1;if((L.width>at||L.height>at)&&(st=at/Math.max(L.width,L.height)),st<1||A===!0)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap){const rt=A?co:Math.floor,wt=rt(st*L.width),pt=rt(st*L.height);f===void 0&&(f=v(wt,pt));const ft=j?v(wt,pt):f;return ft.width=wt,ft.height=pt,ft.getContext("2d").drawImage(L,0,0,wt,pt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+wt+"x"+pt+")."),ft}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),L;return L}function p(L){return da(L.width)&&da(L.height)}function m(L){return a?!1:L.wrapS!==$e||L.wrapT!==$e||L.minFilter!==ue&&L.minFilter!==ee}function _(L,A){return L.generateMipmaps&&A&&L.minFilter!==ue&&L.minFilter!==ee}function x(L){s.generateMipmap(L)}function y(L,A,j,at,st=!1){if(a===!1)return A;if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let rt=A;if(A===s.RED&&(j===s.FLOAT&&(rt=s.R32F),j===s.HALF_FLOAT&&(rt=s.R16F),j===s.UNSIGNED_BYTE&&(rt=s.R8)),A===s.RED_INTEGER&&(j===s.UNSIGNED_BYTE&&(rt=s.R8UI),j===s.UNSIGNED_SHORT&&(rt=s.R16UI),j===s.UNSIGNED_INT&&(rt=s.R32UI),j===s.BYTE&&(rt=s.R8I),j===s.SHORT&&(rt=s.R16I),j===s.INT&&(rt=s.R32I)),A===s.RG&&(j===s.FLOAT&&(rt=s.RG32F),j===s.HALF_FLOAT&&(rt=s.RG16F),j===s.UNSIGNED_BYTE&&(rt=s.RG8)),A===s.RGBA){const wt=st?oo:Qt.getTransfer(at);j===s.FLOAT&&(rt=s.RGBA32F),j===s.HALF_FLOAT&&(rt=s.RGBA16F),j===s.UNSIGNED_BYTE&&(rt=wt===le?s.SRGB8_ALPHA8:s.RGBA8),j===s.UNSIGNED_SHORT_4_4_4_4&&(rt=s.RGBA4),j===s.UNSIGNED_SHORT_5_5_5_1&&(rt=s.RGB5_A1)}return(rt===s.R16F||rt===s.R32F||rt===s.RG16F||rt===s.RG32F||rt===s.RGBA16F||rt===s.RGBA32F)&&t.get("EXT_color_buffer_float"),rt}function w(L,A,j){return _(L,j)===!0||L.isFramebufferTexture&&L.minFilter!==ue&&L.minFilter!==ee?Math.log2(Math.max(A.width,A.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?A.mipmaps.length:1}function M(L){return L===ue||L===ja||L===So?s.NEAREST:s.LINEAR}function E(L){const A=L.target;A.removeEventListener("dispose",E),S(A),A.isVideoTexture&&h.delete(A)}function P(L){const A=L.target;A.removeEventListener("dispose",P),F(A)}function S(L){const A=n.get(L);if(A.__webglInit===void 0)return;const j=L.source,at=u.get(j);if(at){const st=at[A.__cacheKey];st.usedTimes--,st.usedTimes===0&&b(L),Object.keys(at).length===0&&u.delete(j)}n.remove(L)}function b(L){const A=n.get(L);s.deleteTexture(A.__webglTexture);const j=L.source,at=u.get(j);delete at[A.__cacheKey],r.memory.textures--}function F(L){const A=L.texture,j=n.get(L),at=n.get(A);if(at.__webglTexture!==void 0&&(s.deleteTexture(at.__webglTexture),r.memory.textures--),L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(j.__webglFramebuffer[st]))for(let rt=0;rt<j.__webglFramebuffer[st].length;rt++)s.deleteFramebuffer(j.__webglFramebuffer[st][rt]);else s.deleteFramebuffer(j.__webglFramebuffer[st]);j.__webglDepthbuffer&&s.deleteRenderbuffer(j.__webglDepthbuffer[st])}else{if(Array.isArray(j.__webglFramebuffer))for(let st=0;st<j.__webglFramebuffer.length;st++)s.deleteFramebuffer(j.__webglFramebuffer[st]);else s.deleteFramebuffer(j.__webglFramebuffer);if(j.__webglDepthbuffer&&s.deleteRenderbuffer(j.__webglDepthbuffer),j.__webglMultisampledFramebuffer&&s.deleteFramebuffer(j.__webglMultisampledFramebuffer),j.__webglColorRenderbuffer)for(let st=0;st<j.__webglColorRenderbuffer.length;st++)j.__webglColorRenderbuffer[st]&&s.deleteRenderbuffer(j.__webglColorRenderbuffer[st]);j.__webglDepthRenderbuffer&&s.deleteRenderbuffer(j.__webglDepthRenderbuffer)}if(L.isWebGLMultipleRenderTargets)for(let st=0,rt=A.length;st<rt;st++){const wt=n.get(A[st]);wt.__webglTexture&&(s.deleteTexture(wt.__webglTexture),r.memory.textures--),n.remove(A[st])}n.remove(A),n.remove(L)}let W=0;function X(){W=0}function T(){const L=W;return L>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+i.maxTextures),W+=1,L}function D(L){const A=[];return A.push(L.wrapS),A.push(L.wrapT),A.push(L.wrapR||0),A.push(L.magFilter),A.push(L.minFilter),A.push(L.anisotropy),A.push(L.internalFormat),A.push(L.format),A.push(L.type),A.push(L.generateMipmaps),A.push(L.premultiplyAlpha),A.push(L.flipY),A.push(L.unpackAlignment),A.push(L.colorSpace),A.join()}function G(L,A){const j=n.get(L);if(L.isVideoTexture&&Ot(L),L.isRenderTargetTexture===!1&&L.version>0&&j.__version!==L.version){const at=L.image;if(at===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(j,L,A);return}}e.bindTexture(s.TEXTURE_2D,j.__webglTexture,s.TEXTURE0+A)}function U(L,A){const j=n.get(L);if(L.version>0&&j.__version!==L.version){K(j,L,A);return}e.bindTexture(s.TEXTURE_2D_ARRAY,j.__webglTexture,s.TEXTURE0+A)}function k(L,A){const j=n.get(L);if(L.version>0&&j.__version!==L.version){K(j,L,A);return}e.bindTexture(s.TEXTURE_3D,j.__webglTexture,s.TEXTURE0+A)}function B(L,A){const j=n.get(L);if(L.version>0&&j.__version!==L.version){tt(j,L,A);return}e.bindTexture(s.TEXTURE_CUBE_MAP,j.__webglTexture,s.TEXTURE0+A)}const C={[ci]:s.REPEAT,[$e]:s.CLAMP_TO_EDGE,[ua]:s.MIRRORED_REPEAT},N={[ue]:s.NEAREST,[ja]:s.NEAREST_MIPMAP_NEAREST,[So]:s.NEAREST_MIPMAP_LINEAR,[ee]:s.LINEAR,[yh]:s.LINEAR_MIPMAP_NEAREST,[hi]:s.LINEAR_MIPMAP_LINEAR},Z={[Uh]:s.NEVER,[Oh]:s.ALWAYS,[Ih]:s.LESS,[$l]:s.LEQUAL,[Fh]:s.EQUAL,[Nh]:s.GEQUAL,[kh]:s.GREATER,[zh]:s.NOTEQUAL};function O(L,A,j){if(j?(s.texParameteri(L,s.TEXTURE_WRAP_S,C[A.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,C[A.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,C[A.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,N[A.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,N[A.minFilter])):(s.texParameteri(L,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(L,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(A.wrapS!==$e||A.wrapT!==$e)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(L,s.TEXTURE_MAG_FILTER,M(A.magFilter)),s.texParameteri(L,s.TEXTURE_MIN_FILTER,M(A.minFilter)),A.minFilter!==ue&&A.minFilter!==ee&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),A.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,Z[A.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const at=t.get("EXT_texture_filter_anisotropic");if(A.magFilter===ue||A.minFilter!==So&&A.minFilter!==hi||A.type===fn&&t.has("OES_texture_float_linear")===!1||a===!1&&A.type===In&&t.has("OES_texture_half_float_linear")===!1)return;(A.anisotropy>1||n.get(A).__currentAnisotropy)&&(s.texParameterf(L,at.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,i.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy)}}function $(L,A){let j=!1;L.__webglInit===void 0&&(L.__webglInit=!0,A.addEventListener("dispose",E));const at=A.source;let st=u.get(at);st===void 0&&(st={},u.set(at,st));const rt=D(A);if(rt!==L.__cacheKey){st[rt]===void 0&&(st[rt]={texture:s.createTexture(),usedTimes:0},r.memory.textures++,j=!0),st[rt].usedTimes++;const wt=st[L.__cacheKey];wt!==void 0&&(st[L.__cacheKey].usedTimes--,wt.usedTimes===0&&b(A)),L.__cacheKey=rt,L.__webglTexture=st[rt].texture}return j}function K(L,A,j){let at=s.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(at=s.TEXTURE_2D_ARRAY),A.isData3DTexture&&(at=s.TEXTURE_3D);const st=$(L,A),rt=A.source;e.bindTexture(at,L.__webglTexture,s.TEXTURE0+j);const wt=n.get(rt);if(rt.version!==wt.__version||st===!0){e.activeTexture(s.TEXTURE0+j);const pt=Qt.getPrimaries(Qt.workingColorSpace),ft=A.colorSpace===on?null:Qt.getPrimaries(A.colorSpace),Et=A.colorSpace===on||pt===ft?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);const Rt=m(A)&&p(A.image)===!1;let ot=g(A.image,Rt,!1,i.maxTextureSize);ot=Ct(A,ot);const $t=p(ot)||a,It=o.convert(A.format,A.colorSpace);let Dt=o.convert(A.type),Tt=y(A.internalFormat,It,Dt,A.colorSpace,A.isVideoTexture);O(at,A,$t);let St;const Gt=A.mipmaps,Jt=a&&A.isVideoTexture!==!0&&Tt!==Xl,fe=wt.__version===void 0||st===!0,qt=w(A,ot,$t);if(A.isDepthTexture)Tt=s.DEPTH_COMPONENT,a?A.type===fn?Tt=s.DEPTH_COMPONENT32F:A.type===Ln?Tt=s.DEPTH_COMPONENT24:A.type===ai?Tt=s.DEPTH24_STENCIL8:Tt=s.DEPTH_COMPONENT16:A.type===fn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),A.format===ri&&Tt===s.DEPTH_COMPONENT&&A.type!==Sa&&A.type!==Ln&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),A.type=Ln,Dt=o.convert(A.type)),A.format===Bi&&Tt===s.DEPTH_COMPONENT&&(Tt=s.DEPTH_STENCIL,A.type!==ai&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),A.type=ai,Dt=o.convert(A.type))),fe&&(Jt?e.texStorage2D(s.TEXTURE_2D,1,Tt,ot.width,ot.height):e.texImage2D(s.TEXTURE_2D,0,Tt,ot.width,ot.height,0,It,Dt,null));else if(A.isDataTexture)if(Gt.length>0&&$t){Jt&&fe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let mt=0,H=Gt.length;mt<H;mt++)St=Gt[mt],Jt?e.texSubImage2D(s.TEXTURE_2D,mt,0,0,St.width,St.height,It,Dt,St.data):e.texImage2D(s.TEXTURE_2D,mt,Tt,St.width,St.height,0,It,Dt,St.data);A.generateMipmaps=!1}else Jt?(fe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,ot.width,ot.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,ot.width,ot.height,It,Dt,ot.data)):e.texImage2D(s.TEXTURE_2D,0,Tt,ot.width,ot.height,0,It,Dt,ot.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Jt&&fe&&e.texStorage3D(s.TEXTURE_2D_ARRAY,qt,Tt,Gt[0].width,Gt[0].height,ot.depth);for(let mt=0,H=Gt.length;mt<H;mt++)St=Gt[mt],A.format!==Fe?It!==null?Jt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,mt,0,0,0,St.width,St.height,ot.depth,It,St.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,mt,Tt,St.width,St.height,ot.depth,0,St.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,mt,0,0,0,St.width,St.height,ot.depth,It,Dt,St.data):e.texImage3D(s.TEXTURE_2D_ARRAY,mt,Tt,St.width,St.height,ot.depth,0,It,Dt,St.data)}else{Jt&&fe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let mt=0,H=Gt.length;mt<H;mt++)St=Gt[mt],A.format!==Fe?It!==null?Jt?e.compressedTexSubImage2D(s.TEXTURE_2D,mt,0,0,St.width,St.height,It,St.data):e.compressedTexImage2D(s.TEXTURE_2D,mt,Tt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage2D(s.TEXTURE_2D,mt,0,0,St.width,St.height,It,Dt,St.data):e.texImage2D(s.TEXTURE_2D,mt,Tt,St.width,St.height,0,It,Dt,St.data)}else if(A.isDataArrayTexture)Jt?(fe&&e.texStorage3D(s.TEXTURE_2D_ARRAY,qt,Tt,ot.width,ot.height,ot.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,It,Dt,ot.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,Tt,ot.width,ot.height,ot.depth,0,It,Dt,ot.data);else if(A.isData3DTexture)Jt?(fe&&e.texStorage3D(s.TEXTURE_3D,qt,Tt,ot.width,ot.height,ot.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,It,Dt,ot.data)):e.texImage3D(s.TEXTURE_3D,0,Tt,ot.width,ot.height,ot.depth,0,It,Dt,ot.data);else if(A.isFramebufferTexture){if(fe)if(Jt)e.texStorage2D(s.TEXTURE_2D,qt,Tt,ot.width,ot.height);else{let mt=ot.width,H=ot.height;for(let _t=0;_t<qt;_t++)e.texImage2D(s.TEXTURE_2D,_t,Tt,mt,H,0,It,Dt,null),mt>>=1,H>>=1}}else if(Gt.length>0&&$t){Jt&&fe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let mt=0,H=Gt.length;mt<H;mt++)St=Gt[mt],Jt?e.texSubImage2D(s.TEXTURE_2D,mt,0,0,It,Dt,St):e.texImage2D(s.TEXTURE_2D,mt,Tt,It,Dt,St);A.generateMipmaps=!1}else Jt?(fe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,ot.width,ot.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,It,Dt,ot)):e.texImage2D(s.TEXTURE_2D,0,Tt,It,Dt,ot);_(A,$t)&&x(at),wt.__version=rt.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function tt(L,A,j){if(A.image.length!==6)return;const at=$(L,A),st=A.source;e.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+j);const rt=n.get(st);if(st.version!==rt.__version||at===!0){e.activeTexture(s.TEXTURE0+j);const wt=Qt.getPrimaries(Qt.workingColorSpace),pt=A.colorSpace===on?null:Qt.getPrimaries(A.colorSpace),ft=A.colorSpace===on||wt===pt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,A.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,A.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);const Et=A.isCompressedTexture||A.image[0].isCompressedTexture,Rt=A.image[0]&&A.image[0].isDataTexture,ot=[];for(let mt=0;mt<6;mt++)!Et&&!Rt?ot[mt]=g(A.image[mt],!1,!0,i.maxCubemapSize):ot[mt]=Rt?A.image[mt].image:A.image[mt],ot[mt]=Ct(A,ot[mt]);const $t=ot[0],It=p($t)||a,Dt=o.convert(A.format,A.colorSpace),Tt=o.convert(A.type),St=y(A.internalFormat,Dt,Tt,A.colorSpace),Gt=a&&A.isVideoTexture!==!0,Jt=rt.__version===void 0||at===!0;let fe=w(A,$t,It);O(s.TEXTURE_CUBE_MAP,A,It);let qt;if(Et){Gt&&Jt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,fe,St,$t.width,$t.height);for(let mt=0;mt<6;mt++){qt=ot[mt].mipmaps;for(let H=0;H<qt.length;H++){const _t=qt[H];A.format!==Fe?Dt!==null?Gt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H,0,0,_t.width,_t.height,Dt,_t.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H,St,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H,0,0,_t.width,_t.height,Dt,Tt,_t.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H,St,_t.width,_t.height,0,Dt,Tt,_t.data)}}}else{qt=A.mipmaps,Gt&&Jt&&(qt.length>0&&fe++,e.texStorage2D(s.TEXTURE_CUBE_MAP,fe,St,ot[0].width,ot[0].height));for(let mt=0;mt<6;mt++)if(Rt){Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,ot[mt].width,ot[mt].height,Dt,Tt,ot[mt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,St,ot[mt].width,ot[mt].height,0,Dt,Tt,ot[mt].data);for(let H=0;H<qt.length;H++){const Mt=qt[H].image[mt].image;Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H+1,0,0,Mt.width,Mt.height,Dt,Tt,Mt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H+1,St,Mt.width,Mt.height,0,Dt,Tt,Mt.data)}}else{Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,0,0,Dt,Tt,ot[mt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,St,Dt,Tt,ot[mt]);for(let H=0;H<qt.length;H++){const _t=qt[H];Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H+1,0,0,Dt,Tt,_t.image[mt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+mt,H+1,St,Dt,Tt,_t.image[mt])}}}_(A,It)&&x(s.TEXTURE_CUBE_MAP),rt.__version=st.version,A.onUpdate&&A.onUpdate(A)}L.__version=A.version}function ht(L,A,j,at,st,rt){const wt=o.convert(j.format,j.colorSpace),pt=o.convert(j.type),ft=y(j.internalFormat,wt,pt,j.colorSpace);if(!n.get(A).__hasExternalTextures){const Rt=Math.max(1,A.width>>rt),ot=Math.max(1,A.height>>rt);st===s.TEXTURE_3D||st===s.TEXTURE_2D_ARRAY?e.texImage3D(st,rt,ft,Rt,ot,A.depth,0,wt,pt,null):e.texImage2D(st,rt,ft,Rt,ot,0,wt,pt,null)}e.bindFramebuffer(s.FRAMEBUFFER,L),ut(A)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,at,st,n.get(j).__webglTexture,0,dt(A)):(st===s.TEXTURE_2D||st>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,at,st,n.get(j).__webglTexture,rt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function lt(L,A,j){if(s.bindRenderbuffer(s.RENDERBUFFER,L),A.depthBuffer&&!A.stencilBuffer){let at=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(j||ut(A)){const st=A.depthTexture;st&&st.isDepthTexture&&(st.type===fn?at=s.DEPTH_COMPONENT32F:st.type===Ln&&(at=s.DEPTH_COMPONENT24));const rt=dt(A);ut(A)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,rt,at,A.width,A.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,rt,at,A.width,A.height)}else s.renderbufferStorage(s.RENDERBUFFER,at,A.width,A.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,L)}else if(A.depthBuffer&&A.stencilBuffer){const at=dt(A);j&&ut(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,at,s.DEPTH24_STENCIL8,A.width,A.height):ut(A)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,at,s.DEPTH24_STENCIL8,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,L)}else{const at=A.isWebGLMultipleRenderTargets===!0?A.texture:[A.texture];for(let st=0;st<at.length;st++){const rt=at[st],wt=o.convert(rt.format,rt.colorSpace),pt=o.convert(rt.type),ft=y(rt.internalFormat,wt,pt,rt.colorSpace),Et=dt(A);j&&ut(A)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Et,ft,A.width,A.height):ut(A)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Et,ft,A.width,A.height):s.renderbufferStorage(s.RENDERBUFFER,ft,A.width,A.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function V(L,A){if(A&&A.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,L),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(A.depthTexture).__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),G(A.depthTexture,0);const at=n.get(A.depthTexture).__webglTexture,st=dt(A);if(A.depthTexture.format===ri)ut(A)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,at,0,st):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,at,0);else if(A.depthTexture.format===Bi)ut(A)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,at,0,st):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,at,0);else throw new Error("Unknown depthTexture format")}function q(L){const A=n.get(L),j=L.isWebGLCubeRenderTarget===!0;if(L.depthTexture&&!A.__autoAllocateDepthBuffer){if(j)throw new Error("target.depthTexture not supported in Cube render targets");V(A.__webglFramebuffer,L)}else if(j){A.__webglDepthbuffer=[];for(let at=0;at<6;at++)e.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer[at]),A.__webglDepthbuffer[at]=s.createRenderbuffer(),lt(A.__webglDepthbuffer[at],L,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer=s.createRenderbuffer(),lt(A.__webglDepthbuffer,L,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function nt(L,A,j){const at=n.get(L);A!==void 0&&ht(at.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),j!==void 0&&q(L)}function I(L){const A=L.texture,j=n.get(L),at=n.get(A);L.addEventListener("dispose",P),L.isWebGLMultipleRenderTargets!==!0&&(at.__webglTexture===void 0&&(at.__webglTexture=s.createTexture()),at.__version=A.version,r.memory.textures++);const st=L.isWebGLCubeRenderTarget===!0,rt=L.isWebGLMultipleRenderTargets===!0,wt=p(L)||a;if(st){j.__webglFramebuffer=[];for(let pt=0;pt<6;pt++)if(a&&A.mipmaps&&A.mipmaps.length>0){j.__webglFramebuffer[pt]=[];for(let ft=0;ft<A.mipmaps.length;ft++)j.__webglFramebuffer[pt][ft]=s.createFramebuffer()}else j.__webglFramebuffer[pt]=s.createFramebuffer()}else{if(a&&A.mipmaps&&A.mipmaps.length>0){j.__webglFramebuffer=[];for(let pt=0;pt<A.mipmaps.length;pt++)j.__webglFramebuffer[pt]=s.createFramebuffer()}else j.__webglFramebuffer=s.createFramebuffer();if(rt)if(i.drawBuffers){const pt=L.texture;for(let ft=0,Et=pt.length;ft<Et;ft++){const Rt=n.get(pt[ft]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=s.createTexture(),r.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&L.samples>0&&ut(L)===!1){const pt=rt?A:[A];j.__webglMultisampledFramebuffer=s.createFramebuffer(),j.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,j.__webglMultisampledFramebuffer);for(let ft=0;ft<pt.length;ft++){const Et=pt[ft];j.__webglColorRenderbuffer[ft]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,j.__webglColorRenderbuffer[ft]);const Rt=o.convert(Et.format,Et.colorSpace),ot=o.convert(Et.type),$t=y(Et.internalFormat,Rt,ot,Et.colorSpace,L.isXRRenderTarget===!0),It=dt(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,It,$t,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ft,s.RENDERBUFFER,j.__webglColorRenderbuffer[ft])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(j.__webglDepthRenderbuffer=s.createRenderbuffer(),lt(j.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(st){e.bindTexture(s.TEXTURE_CUBE_MAP,at.__webglTexture),O(s.TEXTURE_CUBE_MAP,A,wt);for(let pt=0;pt<6;pt++)if(a&&A.mipmaps&&A.mipmaps.length>0)for(let ft=0;ft<A.mipmaps.length;ft++)ht(j.__webglFramebuffer[pt][ft],L,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,ft);else ht(j.__webglFramebuffer[pt],L,A,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0);_(A,wt)&&x(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){const pt=L.texture;for(let ft=0,Et=pt.length;ft<Et;ft++){const Rt=pt[ft],ot=n.get(Rt);e.bindTexture(s.TEXTURE_2D,ot.__webglTexture),O(s.TEXTURE_2D,Rt,wt),ht(j.__webglFramebuffer,L,Rt,s.COLOR_ATTACHMENT0+ft,s.TEXTURE_2D,0),_(Rt,wt)&&x(s.TEXTURE_2D)}e.unbindTexture()}else{let pt=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(a?pt=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(pt,at.__webglTexture),O(pt,A,wt),a&&A.mipmaps&&A.mipmaps.length>0)for(let ft=0;ft<A.mipmaps.length;ft++)ht(j.__webglFramebuffer[ft],L,A,s.COLOR_ATTACHMENT0,pt,ft);else ht(j.__webglFramebuffer,L,A,s.COLOR_ATTACHMENT0,pt,0);_(A,wt)&&x(pt),e.unbindTexture()}L.depthBuffer&&q(L)}function xt(L){const A=p(L)||a,j=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let at=0,st=j.length;at<st;at++){const rt=j[at];if(_(rt,A)){const wt=L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,pt=n.get(rt).__webglTexture;e.bindTexture(wt,pt),x(wt),e.unbindTexture()}}}function ct(L){if(a&&L.samples>0&&ut(L)===!1){const A=L.isWebGLMultipleRenderTargets?L.texture:[L.texture],j=L.width,at=L.height;let st=s.COLOR_BUFFER_BIT;const rt=[],wt=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=n.get(L),ft=L.isWebGLMultipleRenderTargets===!0;if(ft)for(let Et=0;Et<A.length;Et++)e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,pt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,pt.__webglFramebuffer);for(let Et=0;Et<A.length;Et++){rt.push(s.COLOR_ATTACHMENT0+Et),L.depthBuffer&&rt.push(wt);const Rt=pt.__ignoreDepthValues!==void 0?pt.__ignoreDepthValues:!1;if(Rt===!1&&(L.depthBuffer&&(st|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&(st|=s.STENCIL_BUFFER_BIT)),ft&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,pt.__webglColorRenderbuffer[Et]),Rt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[wt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[wt])),ft){const ot=n.get(A[Et]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ot,0)}s.blitFramebuffer(0,0,j,at,0,0,j,at,st,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,rt)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ft)for(let Et=0;Et<A.length;Et++){e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.RENDERBUFFER,pt.__webglColorRenderbuffer[Et]);const Rt=n.get(A[Et]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,pt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.TEXTURE_2D,Rt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,pt.__webglMultisampledFramebuffer)}}function dt(L){return Math.min(i.maxSamples,L.samples)}function ut(L){const A=n.get(L);return a&&L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Ot(L){const A=r.render.frame;h.get(L)!==A&&(h.set(L,A),L.update())}function Ct(L,A){const j=L.colorSpace,at=L.format,st=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||L.format===fa||j!==Fn&&j!==on&&(Qt.getTransfer(j)===le?a===!1?t.has("EXT_sRGB")===!0&&at===Fe?(L.format=fa,L.minFilter=ee,L.generateMipmaps=!1):A=Kl.sRGBToLinear(A):(at!==Fe||st!==en)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",j)),A}this.allocateTextureUnit=T,this.resetTextureUnits=X,this.setTexture2D=G,this.setTexture2DArray=U,this.setTexture3D=k,this.setTextureCube=B,this.rebindTextures=nt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=xt,this.updateMultisampleRenderTarget=ct,this.setupDepthRenderbuffer=q,this.setupFrameBufferTexture=ht,this.useMultisampledRTT=ut}function nm(s,t,e){const n=e.isWebGL2;function i(o,r=on){let a;const l=Qt.getTransfer(r);if(o===en)return s.UNSIGNED_BYTE;if(o===Hl)return s.UNSIGNED_SHORT_4_4_4_4;if(o===Gl)return s.UNSIGNED_SHORT_5_5_5_1;if(o===wh)return s.BYTE;if(o===Sh)return s.SHORT;if(o===Sa)return s.UNSIGNED_SHORT;if(o===Bl)return s.INT;if(o===Ln)return s.UNSIGNED_INT;if(o===fn)return s.FLOAT;if(o===In)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(o===bh)return s.ALPHA;if(o===Fe)return s.RGBA;if(o===Eh)return s.LUMINANCE;if(o===Th)return s.LUMINANCE_ALPHA;if(o===ri)return s.DEPTH_COMPONENT;if(o===Bi)return s.DEPTH_STENCIL;if(o===fa)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(o===fs)return s.RED;if(o===Vl)return s.RED_INTEGER;if(o===Ah)return s.RG;if(o===Wl)return s.RG_INTEGER;if(o===ql)return s.RGBA_INTEGER;if(o===bo||o===Eo||o===To||o===Ao)if(l===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(o===bo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===Eo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===To)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===Ao)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(o===bo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===Eo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===To)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===Ao)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===Ka||o===Za||o===Ja||o===Qa)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(o===Ka)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Za)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===Ja)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===Qa)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Xl)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===tr||o===er)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(o===tr)return l===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(o===er)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===nr||o===ir||o===sr||o===or||o===ar||o===rr||o===lr||o===cr||o===hr||o===ur||o===fr||o===dr||o===pr||o===mr)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(o===nr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===ir)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===sr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===or)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===ar)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===rr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===lr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===cr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===hr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===ur)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===fr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===dr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===pr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===mr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===Co||o===gr||o===vr)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(o===Co)return l===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===gr)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===vr)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===Ch||o===xr||o===_r||o===Mr)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(o===Co)return a.COMPRESSED_RED_RGTC1_EXT;if(o===xr)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===_r)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===Mr)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===ai?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[o]!==void 0?s[o]:null}return{convert:i}}class im extends Xe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class an extends Ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sm={type:"move"};class Zo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new an,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new an,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new an,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,o=null,r=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,n),m=this._getHandJoint(c,g);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,v=.005;c.inputState.pinching&&u>d+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new an;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class om extends Wi{constructor(t,e){super();const n=this;let i=null,o=1,r=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,v=null;const g=e.getContextAttributes();let p=null,m=null;const _=[],x=[],y=new kt;let w=null;const M=new Xe;M.layers.enable(1),M.viewport=new me;const E=new Xe;E.layers.enable(2),E.viewport=new me;const P=[M,E],S=new im;S.layers.enable(1),S.layers.enable(2);let b=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(O){let $=_[O];return $===void 0&&($=new Zo,_[O]=$),$.getTargetRaySpace()},this.getControllerGrip=function(O){let $=_[O];return $===void 0&&($=new Zo,_[O]=$),$.getGripSpace()},this.getHand=function(O){let $=_[O];return $===void 0&&($=new Zo,_[O]=$),$.getHandSpace()};function W(O){const $=x.indexOf(O.inputSource);if($===-1)return;const K=_[$];K!==void 0&&(K.update(O.inputSource,O.frame,c||r),K.dispatchEvent({type:O.type,data:O.inputSource}))}function X(){i.removeEventListener("select",W),i.removeEventListener("selectstart",W),i.removeEventListener("selectend",W),i.removeEventListener("squeeze",W),i.removeEventListener("squeezestart",W),i.removeEventListener("squeezeend",W),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",T);for(let O=0;O<_.length;O++){const $=x[O];$!==null&&(x[O]=null,_[O].disconnect($))}b=null,F=null,t.setRenderTarget(p),d=null,u=null,f=null,i=null,m=null,Z.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(y.width,y.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(O){o=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(O){a=O,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(O){c=O},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(O){if(i=O,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",W),i.addEventListener("selectstart",W),i.addEventListener("selectend",W),i.addEventListener("squeeze",W),i.addEventListener("squeezestart",W),i.addEventListener("squeezeend",W),i.addEventListener("end",X),i.addEventListener("inputsourceschange",T),g.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(y),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const $={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(i,e,$),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),m=new dn(d.framebufferWidth,d.framebufferHeight,{format:Fe,type:en,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let $=null,K=null,tt=null;g.depth&&(tt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,$=g.stencil?Bi:ri,K=g.stencil?ai:Ln);const ht={colorFormat:e.RGBA8,depthFormat:tt,scaleFactor:o};f=new XRWebGLBinding(i,e),u=f.createProjectionLayer(ht),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),m=new dn(u.textureWidth,u.textureHeight,{format:Fe,type:en,depthTexture:new La(u.textureWidth,u.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const lt=t.properties.get(m);lt.__ignoreDepthValues=u.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await i.requestReferenceSpace(a),Z.setContext(i),Z.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function T(O){for(let $=0;$<O.removed.length;$++){const K=O.removed[$],tt=x.indexOf(K);tt>=0&&(x[tt]=null,_[tt].disconnect(K))}for(let $=0;$<O.added.length;$++){const K=O.added[$];let tt=x.indexOf(K);if(tt===-1){for(let lt=0;lt<_.length;lt++)if(lt>=x.length){x.push(K),tt=lt;break}else if(x[lt]===null){x[lt]=K,tt=lt;break}if(tt===-1)break}const ht=_[tt];ht&&ht.connect(K)}}const D=new z,G=new z;function U(O,$,K){D.setFromMatrixPosition($.matrixWorld),G.setFromMatrixPosition(K.matrixWorld);const tt=D.distanceTo(G),ht=$.projectionMatrix.elements,lt=K.projectionMatrix.elements,V=ht[14]/(ht[10]-1),q=ht[14]/(ht[10]+1),nt=(ht[9]+1)/ht[5],I=(ht[9]-1)/ht[5],xt=(ht[8]-1)/ht[0],ct=(lt[8]+1)/lt[0],dt=V*xt,ut=V*ct,Ot=tt/(-xt+ct),Ct=Ot*-xt;$.matrixWorld.decompose(O.position,O.quaternion,O.scale),O.translateX(Ct),O.translateZ(Ot),O.matrixWorld.compose(O.position,O.quaternion,O.scale),O.matrixWorldInverse.copy(O.matrixWorld).invert();const L=V+Ot,A=q+Ot,j=dt-Ct,at=ut+(tt-Ct),st=nt*q/A*L,rt=I*q/A*L;O.projectionMatrix.makePerspective(j,at,st,rt,L,A),O.projectionMatrixInverse.copy(O.projectionMatrix).invert()}function k(O,$){$===null?O.matrixWorld.copy(O.matrix):O.matrixWorld.multiplyMatrices($.matrixWorld,O.matrix),O.matrixWorldInverse.copy(O.matrixWorld).invert()}this.updateCamera=function(O){if(i===null)return;S.near=E.near=M.near=O.near,S.far=E.far=M.far=O.far,(b!==S.near||F!==S.far)&&(i.updateRenderState({depthNear:S.near,depthFar:S.far}),b=S.near,F=S.far);const $=O.parent,K=S.cameras;k(S,$);for(let tt=0;tt<K.length;tt++)k(K[tt],$);K.length===2?U(S,M,E):S.projectionMatrix.copy(M.projectionMatrix),B(O,S,$)};function B(O,$,K){K===null?O.matrix.copy($.matrixWorld):(O.matrix.copy(K.matrixWorld),O.matrix.invert(),O.matrix.multiply($.matrixWorld)),O.matrix.decompose(O.position,O.quaternion,O.scale),O.updateMatrixWorld(!0),O.projectionMatrix.copy($.projectionMatrix),O.projectionMatrixInverse.copy($.projectionMatrixInverse),O.isPerspectiveCamera&&(O.fov=ds*2*Math.atan(1/O.projectionMatrix.elements[5]),O.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(O){l=O,u!==null&&(u.fixedFoveation=O),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=O)};let C=null;function N(O,$){if(h=$.getViewerPose(c||r),v=$,h!==null){const K=h.views;d!==null&&(t.setRenderTargetFramebuffer(m,d.framebuffer),t.setRenderTarget(m));let tt=!1;K.length!==S.cameras.length&&(S.cameras.length=0,tt=!0);for(let ht=0;ht<K.length;ht++){const lt=K[ht];let V=null;if(d!==null)V=d.getViewport(lt);else{const nt=f.getViewSubImage(u,lt);V=nt.viewport,ht===0&&(t.setRenderTargetTextures(m,nt.colorTexture,u.ignoreDepthValues?void 0:nt.depthStencilTexture),t.setRenderTarget(m))}let q=P[ht];q===void 0&&(q=new Xe,q.layers.enable(ht),q.viewport=new me,P[ht]=q),q.matrix.fromArray(lt.transform.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale),q.projectionMatrix.fromArray(lt.projectionMatrix),q.projectionMatrixInverse.copy(q.projectionMatrix).invert(),q.viewport.set(V.x,V.y,V.width,V.height),ht===0&&(S.matrix.copy(q.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),tt===!0&&S.cameras.push(q)}}for(let K=0;K<_.length;K++){const tt=x[K],ht=_[K];tt!==null&&ht!==void 0&&ht.update(tt,$,c||r)}C&&C(O,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),v=null}const Z=new ac;Z.setAnimationLoop(N),this.setAnimationLoop=function(O){C=O},this.dispose=function(){}}}function am(s,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,ic(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,_,x,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?o(p,m):m.isMeshToonMaterial?(o(p,m),f(p,m)):m.isMeshPhongMaterial?(o(p,m),h(p,m)):m.isMeshStandardMaterial?(o(p,m),u(p,m),m.isMeshPhysicalMaterial&&d(p,m,y)):m.isMeshMatcapMaterial?(o(p,m),v(p,m)):m.isMeshDepthMaterial?o(p,m):m.isMeshDistanceMaterial?(o(p,m),g(p,m)):m.isMeshNormalMaterial?o(p,m):m.isLineBasicMaterial?(r(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,_,x):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function o(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ge&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ge&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const _=t.get(m).envMap;if(_&&(p.envMap.value=_,p.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap){p.lightMap.value=m.lightMap;const x=s._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=m.lightMapIntensity*x,e(m.lightMap,p.lightMapTransform)}m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function r(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,_,x){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*_,p.scale.value=x*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function f(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),t.get(m).envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,_){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ge&&p.clearcoatNormalScale.value.negate())),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,m){m.matcap&&(p.matcap.value=m.matcap)}function g(p,m){const _=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function rm(s,t,e,n){let i={},o={},r=[];const a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,x){const y=x.program;n.uniformBlockBinding(_,y)}function c(_,x){let y=i[_.id];y===void 0&&(v(_),y=h(_),i[_.id]=y,_.addEventListener("dispose",p));const w=x.program;n.updateUBOMapping(_,w);const M=t.render.frame;o[_.id]!==M&&(u(_),o[_.id]=M)}function h(_){const x=f();_.__bindingPointIndex=x;const y=s.createBuffer(),w=_.__size,M=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,w,M),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,x,y),y}function f(){for(let _=0;_<a;_++)if(r.indexOf(_)===-1)return r.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const x=i[_.id],y=_.uniforms,w=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,x);for(let M=0,E=y.length;M<E;M++){const P=Array.isArray(y[M])?y[M]:[y[M]];for(let S=0,b=P.length;S<b;S++){const F=P[S];if(d(F,M,S,w)===!0){const W=F.__offset,X=Array.isArray(F.value)?F.value:[F.value];let T=0;for(let D=0;D<X.length;D++){const G=X[D],U=g(G);typeof G=="number"||typeof G=="boolean"?(F.__data[0]=G,s.bufferSubData(s.UNIFORM_BUFFER,W+T,F.__data)):G.isMatrix3?(F.__data[0]=G.elements[0],F.__data[1]=G.elements[1],F.__data[2]=G.elements[2],F.__data[3]=0,F.__data[4]=G.elements[3],F.__data[5]=G.elements[4],F.__data[6]=G.elements[5],F.__data[7]=0,F.__data[8]=G.elements[6],F.__data[9]=G.elements[7],F.__data[10]=G.elements[8],F.__data[11]=0):(G.toArray(F.__data,T),T+=U.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,W,F.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(_,x,y,w){const M=_.value,E=x+"_"+y;if(w[E]===void 0)return typeof M=="number"||typeof M=="boolean"?w[E]=M:w[E]=M.clone(),!0;{const P=w[E];if(typeof M=="number"||typeof M=="boolean"){if(P!==M)return w[E]=M,!0}else if(P.equals(M)===!1)return P.copy(M),!0}return!1}function v(_){const x=_.uniforms;let y=0;const w=16;for(let E=0,P=x.length;E<P;E++){const S=Array.isArray(x[E])?x[E]:[x[E]];for(let b=0,F=S.length;b<F;b++){const W=S[b],X=Array.isArray(W.value)?W.value:[W.value];for(let T=0,D=X.length;T<D;T++){const G=X[T],U=g(G),k=y%w;k!==0&&w-k<U.boundary&&(y+=w-k),W.__data=new Float32Array(U.storage/Float32Array.BYTES_PER_ELEMENT),W.__offset=y,y+=U.storage}}}const M=y%w;return M>0&&(y+=w-M),_.__size=y,_.__cache={},this}function g(_){const x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function p(_){const x=_.target;x.removeEventListener("dispose",p);const y=r.indexOf(x.__bindingPointIndex);r.splice(y,1),s.deleteBuffer(i[x.id]),delete i[x.id],delete o[x.id]}function m(){for(const _ in i)s.deleteBuffer(i[_]);r=[],i={},o={}}return{bind:l,update:c,dispose:m}}class fc{constructor(t={}){const{canvas:e=tu(),context:n=null,depth:i=!0,stencil:o=!0,alpha:r=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=r;const d=new Uint32Array(4),v=new Int32Array(4);let g=null,p=null;const m=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ae,this._useLegacyLights=!1,this.toneMapping=qn,this.toneMappingExposure=1;const x=this;let y=!1,w=0,M=0,E=null,P=-1,S=null;const b=new me,F=new me;let W=null;const X=new Lt(0);let T=0,D=e.width,G=e.height,U=1,k=null,B=null;const C=new me(0,0,D,G),N=new me(0,0,D,G);let Z=!1;const O=new xs;let $=!1,K=!1,tt=null;const ht=new Zt,lt=new kt,V=new z,q={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function nt(){return E===null?U:1}let I=n;function xt(R,Y){for(let Q=0;Q<R.length;Q++){const et=R[Q],J=e.getContext(et,Y);if(J!==null)return J}return null}try{const R={alpha:!0,depth:i,stencil:o,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${wa}`),e.addEventListener("webglcontextlost",mt,!1),e.addEventListener("webglcontextrestored",H,!1),e.addEventListener("webglcontextcreationerror",_t,!1),I===null){const Y=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&Y.shift(),I=xt(Y,R),I===null)throw xt(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&I instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),I.getShaderPrecisionFormat===void 0&&(I.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let ct,dt,ut,Ot,Ct,L,A,j,at,st,rt,wt,pt,ft,Et,Rt,ot,$t,It,Dt,Tt,St,Gt,Jt;function fe(){ct=new v0(I),dt=new u0(I,ct,t),ct.init(dt),St=new nm(I,ct,dt),ut=new tm(I,ct,dt),Ot=new M0(I),Ct=new Bp,L=new em(I,ct,ut,Ct,dt,St,Ot),A=new d0(x),j=new g0(x),at=new Au(I,dt),Gt=new c0(I,ct,at,dt),st=new x0(I,at,Ot,Gt),rt=new b0(I,st,at,Ot),It=new S0(I,dt,L),Rt=new f0(Ct),wt=new Op(x,A,j,ct,dt,Gt,Rt),pt=new am(x,Ct),ft=new Gp,Et=new $p(ct,dt),$t=new l0(x,A,j,ut,rt,u,l),ot=new Qp(x,rt,dt),Jt=new rm(I,Ot,dt,ut),Dt=new h0(I,ct,Ot,dt),Tt=new _0(I,ct,Ot,dt),Ot.programs=wt.programs,x.capabilities=dt,x.extensions=ct,x.properties=Ct,x.renderLists=ft,x.shadowMap=ot,x.state=ut,x.info=Ot}fe();const qt=new om(x,I);this.xr=qt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const R=ct.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=ct.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return U},this.setPixelRatio=function(R){R!==void 0&&(U=R,this.setSize(D,G,!1))},this.getSize=function(R){return R.set(D,G)},this.setSize=function(R,Y,Q=!0){if(qt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}D=R,G=Y,e.width=Math.floor(R*U),e.height=Math.floor(Y*U),Q===!0&&(e.style.width=R+"px",e.style.height=Y+"px"),this.setViewport(0,0,R,Y)},this.getDrawingBufferSize=function(R){return R.set(D*U,G*U).floor()},this.setDrawingBufferSize=function(R,Y,Q){D=R,G=Y,U=Q,e.width=Math.floor(R*Q),e.height=Math.floor(Y*Q),this.setViewport(0,0,R,Y)},this.getCurrentViewport=function(R){return R.copy(b)},this.getViewport=function(R){return R.copy(C)},this.setViewport=function(R,Y,Q,et){R.isVector4?C.set(R.x,R.y,R.z,R.w):C.set(R,Y,Q,et),ut.viewport(b.copy(C).multiplyScalar(U).floor())},this.getScissor=function(R){return R.copy(N)},this.setScissor=function(R,Y,Q,et){R.isVector4?N.set(R.x,R.y,R.z,R.w):N.set(R,Y,Q,et),ut.scissor(F.copy(N).multiplyScalar(U).floor())},this.getScissorTest=function(){return Z},this.setScissorTest=function(R){ut.setScissorTest(Z=R)},this.setOpaqueSort=function(R){k=R},this.setTransparentSort=function(R){B=R},this.getClearColor=function(R){return R.copy($t.getClearColor())},this.setClearColor=function(){$t.setClearColor.apply($t,arguments)},this.getClearAlpha=function(){return $t.getClearAlpha()},this.setClearAlpha=function(){$t.setClearAlpha.apply($t,arguments)},this.clear=function(R=!0,Y=!0,Q=!0){let et=0;if(R){let J=!1;if(E!==null){const yt=E.texture.format;J=yt===ql||yt===Wl||yt===Vl}if(J){const yt=E.texture.type,At=yt===en||yt===Ln||yt===Sa||yt===ai||yt===Hl||yt===Gl,Ut=$t.getClearColor(),zt=$t.getClearAlpha(),Wt=Ut.r,Bt=Ut.g,Ht=Ut.b;At?(d[0]=Wt,d[1]=Bt,d[2]=Ht,d[3]=zt,I.clearBufferuiv(I.COLOR,0,d)):(v[0]=Wt,v[1]=Bt,v[2]=Ht,v[3]=zt,I.clearBufferiv(I.COLOR,0,v))}else et|=I.COLOR_BUFFER_BIT}Y&&(et|=I.DEPTH_BUFFER_BIT),Q&&(et|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",mt,!1),e.removeEventListener("webglcontextrestored",H,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),ft.dispose(),Et.dispose(),Ct.dispose(),A.dispose(),j.dispose(),rt.dispose(),Gt.dispose(),Jt.dispose(),wt.dispose(),qt.dispose(),qt.removeEventListener("sessionstart",Ne),qt.removeEventListener("sessionend",oe),tt&&(tt.dispose(),tt=null),Oe.stop()};function mt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function H(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const R=Ot.autoReset,Y=ot.enabled,Q=ot.autoUpdate,et=ot.needsUpdate,J=ot.type;fe(),Ot.autoReset=R,ot.enabled=Y,ot.autoUpdate=Q,ot.needsUpdate=et,ot.type=J}function _t(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function Mt(R){const Y=R.target;Y.removeEventListener("dispose",Mt),Ft(Y)}function Ft(R){Pt(R),Ct.remove(R)}function Pt(R){const Y=Ct.get(R).programs;Y!==void 0&&(Y.forEach(function(Q){wt.releaseProgram(Q)}),R.isShaderMaterial&&wt.releaseShaderCache(R))}this.renderBufferDirect=function(R,Y,Q,et,J,yt){Y===null&&(Y=q);const At=J.isMesh&&J.matrixWorld.determinant()<0,Ut=Ic(R,Y,Q,et,J);ut.setMaterial(et,At);let zt=Q.index,Wt=1;if(et.wireframe===!0){if(zt=st.getWireframeAttribute(Q),zt===void 0)return;Wt=2}const Bt=Q.drawRange,Ht=Q.attributes.position;let ve=Bt.start*Wt,Ze=(Bt.start+Bt.count)*Wt;yt!==null&&(ve=Math.max(ve,yt.start*Wt),Ze=Math.min(Ze,(yt.start+yt.count)*Wt)),zt!==null?(ve=Math.max(ve,0),Ze=Math.min(Ze,zt.count)):Ht!=null&&(ve=Math.max(ve,0),Ze=Math.min(Ze,Ht.count));const be=Ze-ve;if(be<0||be===1/0)return;Gt.setup(J,et,Ut,Q,zt);let Mn,ce=Dt;if(zt!==null&&(Mn=at.get(zt),ce=Tt,ce.setIndex(Mn)),J.isMesh)et.wireframe===!0?(ut.setLineWidth(et.wireframeLinewidth*nt()),ce.setMode(I.LINES)):ce.setMode(I.TRIANGLES);else if(J.isLine){let Xt=et.linewidth;Xt===void 0&&(Xt=1),ut.setLineWidth(Xt*nt()),J.isLineSegments?ce.setMode(I.LINES):J.isLineLoop?ce.setMode(I.LINE_LOOP):ce.setMode(I.LINE_STRIP)}else J.isPoints?ce.setMode(I.POINTS):J.isSprite&&ce.setMode(I.TRIANGLES);if(J.isBatchedMesh)ce.renderMultiDraw(J._multiDrawStarts,J._multiDrawCounts,J._multiDrawCount);else if(J.isInstancedMesh)ce.renderInstances(ve,be,J.count);else if(Q.isInstancedBufferGeometry){const Xt=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,_o=Math.min(Q.instanceCount,Xt);ce.renderInstances(ve,be,_o)}else ce.render(ve,be)};function ie(R,Y,Q){R.transparent===!0&&R.side===Ye&&R.forceSinglePass===!1?(R.side=Ge,R.needsUpdate=!0,Ss(R,Y,Q),R.side=Un,R.needsUpdate=!0,Ss(R,Y,Q),R.side=Ye):Ss(R,Y,Q)}this.compile=function(R,Y,Q=null){Q===null&&(Q=R),p=Et.get(Q),p.init(),_.push(p),Q.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),R!==Q&&R.traverseVisible(function(J){J.isLight&&J.layers.test(Y.layers)&&(p.pushLight(J),J.castShadow&&p.pushShadow(J))}),p.setupLights(x._useLegacyLights);const et=new Set;return R.traverse(function(J){const yt=J.material;if(yt)if(Array.isArray(yt))for(let At=0;At<yt.length;At++){const Ut=yt[At];ie(Ut,Q,J),et.add(Ut)}else ie(yt,Q,J),et.add(yt)}),_.pop(),p=null,et},this.compileAsync=function(R,Y,Q=null){const et=this.compile(R,Y,Q);return new Promise(J=>{function yt(){if(et.forEach(function(At){Ct.get(At).currentProgram.isReady()&&et.delete(At)}),et.size===0){J(R);return}setTimeout(yt,10)}ct.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let se=null;function Se(R){se&&se(R)}function Ne(){Oe.stop()}function oe(){Oe.start()}const Oe=new ac;Oe.setAnimationLoop(Se),typeof self<"u"&&Oe.setContext(self),this.setAnimationLoop=function(R){se=R,qt.setAnimationLoop(R),R===null?Oe.stop():Oe.start()},qt.addEventListener("sessionstart",Ne),qt.addEventListener("sessionend",oe),this.render=function(R,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),qt.enabled===!0&&qt.isPresenting===!0&&(qt.cameraAutoUpdate===!0&&qt.updateCamera(Y),Y=qt.getCamera()),R.isScene===!0&&R.onBeforeRender(x,R,Y,E),p=Et.get(R,_.length),p.init(),_.push(p),ht.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),O.setFromProjectionMatrix(ht),K=this.localClippingEnabled,$=Rt.init(this.clippingPlanes,K),g=ft.get(R,m.length),g.init(),m.push(g),pn(R,Y,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(k,B),this.info.render.frame++,$===!0&&Rt.beginShadows();const Q=p.state.shadowsArray;if(ot.render(Q,R,Y),$===!0&&Rt.endShadows(),this.info.autoReset===!0&&this.info.reset(),$t.render(g,R),p.setupLights(x._useLegacyLights),Y.isArrayCamera){const et=Y.cameras;for(let J=0,yt=et.length;J<yt;J++){const At=et[J];Na(g,R,At,At.viewport)}}else Na(g,R,Y);E!==null&&(L.updateMultisampleRenderTarget(E),L.updateRenderTargetMipmap(E)),R.isScene===!0&&R.onAfterRender(x,R,Y),Gt.resetDefaultState(),P=-1,S=null,_.pop(),_.length>0?p=_[_.length-1]:p=null,m.pop(),m.length>0?g=m[m.length-1]:g=null};function pn(R,Y,Q,et){if(R.visible===!1)return;if(R.layers.test(Y.layers)){if(R.isGroup)Q=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(Y);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||O.intersectsSprite(R)){et&&V.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ht);const At=rt.update(R),Ut=R.material;Ut.visible&&g.push(R,At,Ut,Q,V.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||O.intersectsObject(R))){const At=rt.update(R),Ut=R.material;if(et&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),V.copy(R.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),V.copy(At.boundingSphere.center)),V.applyMatrix4(R.matrixWorld).applyMatrix4(ht)),Array.isArray(Ut)){const zt=At.groups;for(let Wt=0,Bt=zt.length;Wt<Bt;Wt++){const Ht=zt[Wt],ve=Ut[Ht.materialIndex];ve&&ve.visible&&g.push(R,At,ve,Q,V.z,Ht)}}else Ut.visible&&g.push(R,At,Ut,Q,V.z,null)}}const yt=R.children;for(let At=0,Ut=yt.length;At<Ut;At++)pn(yt[At],Y,Q,et)}function Na(R,Y,Q,et){const J=R.opaque,yt=R.transmissive,At=R.transparent;p.setupLightsView(Q),$===!0&&Rt.setGlobalState(x.clippingPlanes,Q),yt.length>0&&Uc(J,yt,Y,Q),et&&ut.viewport(b.copy(et)),J.length>0&&ws(J,Y,Q),yt.length>0&&ws(yt,Y,Q),At.length>0&&ws(At,Y,Q),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function Uc(R,Y,Q,et){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;const yt=dt.isWebGL2;tt===null&&(tt=new dn(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")?In:en,minFilter:hi,samples:yt?4:0})),x.getDrawingBufferSize(lt),yt?tt.setSize(lt.x,lt.y):tt.setSize(co(lt.x),co(lt.y));const At=x.getRenderTarget();x.setRenderTarget(tt),x.getClearColor(X),T=x.getClearAlpha(),T<1&&x.setClearColor(16777215,.5),x.clear();const Ut=x.toneMapping;x.toneMapping=qn,ws(R,Q,et),L.updateMultisampleRenderTarget(tt),L.updateRenderTargetMipmap(tt);let zt=!1;for(let Wt=0,Bt=Y.length;Wt<Bt;Wt++){const Ht=Y[Wt],ve=Ht.object,Ze=Ht.geometry,be=Ht.material,Mn=Ht.group;if(be.side===Ye&&ve.layers.test(et.layers)){const ce=be.side;be.side=Ge,be.needsUpdate=!0,Oa(ve,Q,et,Ze,be,Mn),be.side=ce,be.needsUpdate=!0,zt=!0}}zt===!0&&(L.updateMultisampleRenderTarget(tt),L.updateRenderTargetMipmap(tt)),x.setRenderTarget(At),x.setClearColor(X,T),x.toneMapping=Ut}function ws(R,Y,Q){const et=Y.isScene===!0?Y.overrideMaterial:null;for(let J=0,yt=R.length;J<yt;J++){const At=R[J],Ut=At.object,zt=At.geometry,Wt=et===null?At.material:et,Bt=At.group;Ut.layers.test(Q.layers)&&Oa(Ut,Y,Q,zt,Wt,Bt)}}function Oa(R,Y,Q,et,J,yt){R.onBeforeRender(x,Y,Q,et,J,yt),R.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),J.onBeforeRender(x,Y,Q,et,R,yt),J.transparent===!0&&J.side===Ye&&J.forceSinglePass===!1?(J.side=Ge,J.needsUpdate=!0,x.renderBufferDirect(Q,Y,et,J,R,yt),J.side=Un,J.needsUpdate=!0,x.renderBufferDirect(Q,Y,et,J,R,yt),J.side=Ye):x.renderBufferDirect(Q,Y,et,J,R,yt),R.onAfterRender(x,Y,Q,et,J,yt)}function Ss(R,Y,Q){Y.isScene!==!0&&(Y=q);const et=Ct.get(R),J=p.state.lights,yt=p.state.shadowsArray,At=J.state.version,Ut=wt.getParameters(R,J.state,yt,Y,Q),zt=wt.getProgramCacheKey(Ut);let Wt=et.programs;et.environment=R.isMeshStandardMaterial?Y.environment:null,et.fog=Y.fog,et.envMap=(R.isMeshStandardMaterial?j:A).get(R.envMap||et.environment),Wt===void 0&&(R.addEventListener("dispose",Mt),Wt=new Map,et.programs=Wt);let Bt=Wt.get(zt);if(Bt!==void 0){if(et.currentProgram===Bt&&et.lightsStateVersion===At)return Ha(R,Ut),Bt}else Ut.uniforms=wt.getUniforms(R),R.onBuild(Q,Ut,x),R.onBeforeCompile(Ut,x),Bt=wt.acquireProgram(Ut,zt),Wt.set(zt,Bt),et.uniforms=Ut.uniforms;const Ht=et.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ht.clippingPlanes=Rt.uniform),Ha(R,Ut),et.needsLights=kc(R),et.lightsStateVersion=At,et.needsLights&&(Ht.ambientLightColor.value=J.state.ambient,Ht.lightProbe.value=J.state.probe,Ht.directionalLights.value=J.state.directional,Ht.directionalLightShadows.value=J.state.directionalShadow,Ht.spotLights.value=J.state.spot,Ht.spotLightShadows.value=J.state.spotShadow,Ht.rectAreaLights.value=J.state.rectArea,Ht.ltc_1.value=J.state.rectAreaLTC1,Ht.ltc_2.value=J.state.rectAreaLTC2,Ht.pointLights.value=J.state.point,Ht.pointLightShadows.value=J.state.pointShadow,Ht.hemisphereLights.value=J.state.hemi,Ht.directionalShadowMap.value=J.state.directionalShadowMap,Ht.directionalShadowMatrix.value=J.state.directionalShadowMatrix,Ht.spotShadowMap.value=J.state.spotShadowMap,Ht.spotLightMatrix.value=J.state.spotLightMatrix,Ht.spotLightMap.value=J.state.spotLightMap,Ht.pointShadowMap.value=J.state.pointShadowMap,Ht.pointShadowMatrix.value=J.state.pointShadowMatrix),et.currentProgram=Bt,et.uniformsList=null,Bt}function Ba(R){if(R.uniformsList===null){const Y=R.currentProgram.getUniforms();R.uniformsList=Qs.seqWithValue(Y.seq,R.uniforms)}return R.uniformsList}function Ha(R,Y){const Q=Ct.get(R);Q.outputColorSpace=Y.outputColorSpace,Q.batching=Y.batching,Q.instancing=Y.instancing,Q.instancingColor=Y.instancingColor,Q.skinning=Y.skinning,Q.morphTargets=Y.morphTargets,Q.morphNormals=Y.morphNormals,Q.morphColors=Y.morphColors,Q.morphTargetsCount=Y.morphTargetsCount,Q.numClippingPlanes=Y.numClippingPlanes,Q.numIntersection=Y.numClipIntersection,Q.vertexAlphas=Y.vertexAlphas,Q.vertexTangents=Y.vertexTangents,Q.toneMapping=Y.toneMapping}function Ic(R,Y,Q,et,J){Y.isScene!==!0&&(Y=q),L.resetTextureUnits();const yt=Y.fog,At=et.isMeshStandardMaterial?Y.environment:null,Ut=E===null?x.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Fn,zt=(et.isMeshStandardMaterial?j:A).get(et.envMap||At),Wt=et.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Bt=!!Q.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),Ht=!!Q.morphAttributes.position,ve=!!Q.morphAttributes.normal,Ze=!!Q.morphAttributes.color;let be=qn;et.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(be=x.toneMapping);const Mn=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,ce=Mn!==void 0?Mn.length:0,Xt=Ct.get(et),_o=p.state.lights;if($===!0&&(K===!0||R!==S)){const nn=R===S&&et.id===P;Rt.setState(et,R,nn)}let de=!1;et.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==_o.state.version||Xt.outputColorSpace!==Ut||J.isBatchedMesh&&Xt.batching===!1||!J.isBatchedMesh&&Xt.batching===!0||J.isInstancedMesh&&Xt.instancing===!1||!J.isInstancedMesh&&Xt.instancing===!0||J.isSkinnedMesh&&Xt.skinning===!1||!J.isSkinnedMesh&&Xt.skinning===!0||J.isInstancedMesh&&Xt.instancingColor===!0&&J.instanceColor===null||J.isInstancedMesh&&Xt.instancingColor===!1&&J.instanceColor!==null||Xt.envMap!==zt||et.fog===!0&&Xt.fog!==yt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Rt.numPlanes||Xt.numIntersection!==Rt.numIntersection)||Xt.vertexAlphas!==Wt||Xt.vertexTangents!==Bt||Xt.morphTargets!==Ht||Xt.morphNormals!==ve||Xt.morphColors!==Ze||Xt.toneMapping!==be||dt.isWebGL2===!0&&Xt.morphTargetsCount!==ce)&&(de=!0):(de=!0,Xt.__version=et.version);let jn=Xt.currentProgram;de===!0&&(jn=Ss(et,Y,J));let Ga=!1,$i=!1,Mo=!1;const Re=jn.getUniforms(),Kn=Xt.uniforms;if(ut.useProgram(jn.program)&&(Ga=!0,$i=!0,Mo=!0),et.id!==P&&(P=et.id,$i=!0),Ga||S!==R){Re.setValue(I,"projectionMatrix",R.projectionMatrix),Re.setValue(I,"viewMatrix",R.matrixWorldInverse);const nn=Re.map.cameraPosition;nn!==void 0&&nn.setValue(I,V.setFromMatrixPosition(R.matrixWorld)),dt.logarithmicDepthBuffer&&Re.setValue(I,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&Re.setValue(I,"isOrthographic",R.isOrthographicCamera===!0),S!==R&&(S=R,$i=!0,Mo=!0)}if(J.isSkinnedMesh){Re.setOptional(I,J,"bindMatrix"),Re.setOptional(I,J,"bindMatrixInverse");const nn=J.skeleton;nn&&(dt.floatVertexTextures?(nn.boneTexture===null&&nn.computeBoneTexture(),Re.setValue(I,"boneTexture",nn.boneTexture,L)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}J.isBatchedMesh&&(Re.setOptional(I,J,"batchingTexture"),Re.setValue(I,"batchingTexture",J._matricesTexture,L));const yo=Q.morphAttributes;if((yo.position!==void 0||yo.normal!==void 0||yo.color!==void 0&&dt.isWebGL2===!0)&&It.update(J,Q,jn),($i||Xt.receiveShadow!==J.receiveShadow)&&(Xt.receiveShadow=J.receiveShadow,Re.setValue(I,"receiveShadow",J.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(Kn.envMap.value=zt,Kn.flipEnvMap.value=zt.isCubeTexture&&zt.isRenderTargetTexture===!1?-1:1),$i&&(Re.setValue(I,"toneMappingExposure",x.toneMappingExposure),Xt.needsLights&&Fc(Kn,Mo),yt&&et.fog===!0&&pt.refreshFogUniforms(Kn,yt),pt.refreshMaterialUniforms(Kn,et,U,G,tt),Qs.upload(I,Ba(Xt),Kn,L)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Qs.upload(I,Ba(Xt),Kn,L),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&Re.setValue(I,"center",J.center),Re.setValue(I,"modelViewMatrix",J.modelViewMatrix),Re.setValue(I,"normalMatrix",J.normalMatrix),Re.setValue(I,"modelMatrix",J.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const nn=et.uniformsGroups;for(let wo=0,zc=nn.length;wo<zc;wo++)if(dt.isWebGL2){const Va=nn[wo];Jt.update(Va,jn),Jt.bind(Va,jn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return jn}function Fc(R,Y){R.ambientLightColor.needsUpdate=Y,R.lightProbe.needsUpdate=Y,R.directionalLights.needsUpdate=Y,R.directionalLightShadows.needsUpdate=Y,R.pointLights.needsUpdate=Y,R.pointLightShadows.needsUpdate=Y,R.spotLights.needsUpdate=Y,R.spotLightShadows.needsUpdate=Y,R.rectAreaLights.needsUpdate=Y,R.hemisphereLights.needsUpdate=Y}function kc(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(R,Y,Q){Ct.get(R.texture).__webglTexture=Y,Ct.get(R.depthTexture).__webglTexture=Q;const et=Ct.get(R);et.__hasExternalTextures=!0,et.__hasExternalTextures&&(et.__autoAllocateDepthBuffer=Q===void 0,et.__autoAllocateDepthBuffer||ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),et.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(R,Y){const Q=Ct.get(R);Q.__webglFramebuffer=Y,Q.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(R,Y=0,Q=0){E=R,w=Y,M=Q;let et=!0,J=null,yt=!1,At=!1;if(R){const zt=Ct.get(R);zt.__useDefaultFramebuffer!==void 0?(ut.bindFramebuffer(I.FRAMEBUFFER,null),et=!1):zt.__webglFramebuffer===void 0?L.setupRenderTarget(R):zt.__hasExternalTextures&&L.rebindTextures(R,Ct.get(R.texture).__webglTexture,Ct.get(R.depthTexture).__webglTexture);const Wt=R.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(At=!0);const Bt=Ct.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Bt[Y])?J=Bt[Y][Q]:J=Bt[Y],yt=!0):dt.isWebGL2&&R.samples>0&&L.useMultisampledRTT(R)===!1?J=Ct.get(R).__webglMultisampledFramebuffer:Array.isArray(Bt)?J=Bt[Q]:J=Bt,b.copy(R.viewport),F.copy(R.scissor),W=R.scissorTest}else b.copy(C).multiplyScalar(U).floor(),F.copy(N).multiplyScalar(U).floor(),W=Z;if(ut.bindFramebuffer(I.FRAMEBUFFER,J)&&dt.drawBuffers&&et&&ut.drawBuffers(R,J),ut.viewport(b),ut.scissor(F),ut.setScissorTest(W),yt){const zt=Ct.get(R.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+Y,zt.__webglTexture,Q)}else if(At){const zt=Ct.get(R.texture),Wt=Y||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,zt.__webglTexture,Q||0,Wt)}P=-1},this.readRenderTargetPixels=function(R,Y,Q,et,J,yt,At){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ut=Ct.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&At!==void 0&&(Ut=Ut[At]),Ut){ut.bindFramebuffer(I.FRAMEBUFFER,Ut);try{const zt=R.texture,Wt=zt.format,Bt=zt.type;if(Wt!==Fe&&St.convert(Wt)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ht=Bt===In&&(ct.has("EXT_color_buffer_half_float")||dt.isWebGL2&&ct.has("EXT_color_buffer_float"));if(Bt!==en&&St.convert(Bt)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Bt===fn&&(dt.isWebGL2||ct.has("OES_texture_float")||ct.has("WEBGL_color_buffer_float")))&&!Ht){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=R.width-et&&Q>=0&&Q<=R.height-J&&I.readPixels(Y,Q,et,J,St.convert(Wt),St.convert(Bt),yt)}finally{const zt=E!==null?Ct.get(E).__webglFramebuffer:null;ut.bindFramebuffer(I.FRAMEBUFFER,zt)}}},this.copyFramebufferToTexture=function(R,Y,Q=0){const et=Math.pow(2,-Q),J=Math.floor(Y.image.width*et),yt=Math.floor(Y.image.height*et);L.setTexture2D(Y,0),I.copyTexSubImage2D(I.TEXTURE_2D,Q,0,0,R.x,R.y,J,yt),ut.unbindTexture()},this.copyTextureToTexture=function(R,Y,Q,et=0){const J=Y.image.width,yt=Y.image.height,At=St.convert(Q.format),Ut=St.convert(Q.type);L.setTexture2D(Q,0),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,Q.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Q.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,Q.unpackAlignment),Y.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,et,R.x,R.y,J,yt,At,Ut,Y.image.data):Y.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,et,R.x,R.y,Y.mipmaps[0].width,Y.mipmaps[0].height,At,Y.mipmaps[0].data):I.texSubImage2D(I.TEXTURE_2D,et,R.x,R.y,At,Ut,Y.image),et===0&&Q.generateMipmaps&&I.generateMipmap(I.TEXTURE_2D),ut.unbindTexture()},this.copyTextureToTexture3D=function(R,Y,Q,et,J=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const yt=R.max.x-R.min.x+1,At=R.max.y-R.min.y+1,Ut=R.max.z-R.min.z+1,zt=St.convert(et.format),Wt=St.convert(et.type);let Bt;if(et.isData3DTexture)L.setTexture3D(et,0),Bt=I.TEXTURE_3D;else if(et.isDataArrayTexture||et.isCompressedArrayTexture)L.setTexture2DArray(et,0),Bt=I.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,et.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,et.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,et.unpackAlignment);const Ht=I.getParameter(I.UNPACK_ROW_LENGTH),ve=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ze=I.getParameter(I.UNPACK_SKIP_PIXELS),be=I.getParameter(I.UNPACK_SKIP_ROWS),Mn=I.getParameter(I.UNPACK_SKIP_IMAGES),ce=Q.isCompressedTexture?Q.mipmaps[J]:Q.image;I.pixelStorei(I.UNPACK_ROW_LENGTH,ce.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ce.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,R.min.x),I.pixelStorei(I.UNPACK_SKIP_ROWS,R.min.y),I.pixelStorei(I.UNPACK_SKIP_IMAGES,R.min.z),Q.isDataTexture||Q.isData3DTexture?I.texSubImage3D(Bt,J,Y.x,Y.y,Y.z,yt,At,Ut,zt,Wt,ce.data):Q.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),I.compressedTexSubImage3D(Bt,J,Y.x,Y.y,Y.z,yt,At,Ut,zt,ce.data)):I.texSubImage3D(Bt,J,Y.x,Y.y,Y.z,yt,At,Ut,zt,Wt,ce),I.pixelStorei(I.UNPACK_ROW_LENGTH,Ht),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ve),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ze),I.pixelStorei(I.UNPACK_SKIP_ROWS,be),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Mn),J===0&&et.generateMipmaps&&I.generateMipmap(Bt),ut.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?L.setTextureCube(R,0):R.isData3DTexture?L.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?L.setTexture2DArray(R,0):L.setTexture2D(R,0),ut.unbindTexture()},this.resetState=function(){w=0,M=0,E=null,ut.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===ba?"display-p3":"srgb",e.unpackColorSpace=Qt.workingColorSpace===go?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ae?li:Yl}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===li?Ae:Fn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class lm extends fc{}lm.prototype.isWebGL1Renderer=!0;class Ms extends Ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class $n extends je{constructor(t=null,e=1,n=1,i,o,r,a,l,c=ue,h=ue,f,u){super(null,r,a,l,c,h,i,o,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xn extends he{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ai=new Zt,hl=new Zt,Xs=[],ul=new _n,cm=new Zt,Qi=new ne,ts=new Xi;class hs extends ne{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Xn(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,cm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new _n),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ai),ul.copy(t.boundingBox).applyMatrix4(Ai),this.boundingBox.union(ul)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Xi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ai),ts.copy(t.boundingSphere).applyMatrix4(Ai),this.boundingSphere.union(ts)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Qi.geometry=this.geometry,Qi.material=this.material,Qi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ts.copy(this.boundingSphere),ts.applyMatrix4(n),t.ray.intersectsSphere(ts)!==!1))for(let o=0;o<i;o++){this.getMatrixAt(o,Ai),hl.multiplyMatrices(n,Ai),Qi.matrixWorld=hl,Qi.raycast(t,Xs);for(let r=0,a=Xs.length;r<a;r++){const l=Xs[r];l.instanceId=o,l.object=this,e.push(l)}Xs.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Xn(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class hm extends gs{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const fl=new Zt,ga=new Ta,Ys=new Xi,$s=new z;class dc extends Ke{constructor(t=new Ce,e=new hm){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,o=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ys.copy(n.boundingSphere),Ys.applyMatrix4(i),Ys.radius+=o,t.ray.intersectsSphere(Ys)===!1)return;fl.copy(i).invert(),ga.copy(t.ray).applyMatrix4(fl);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){const u=Math.max(0,r.start),d=Math.min(c.count,r.start+r.count);for(let v=u,g=d;v<g;v++){const p=c.getX(v);$s.fromBufferAttribute(f,p),dl($s,p,l,i,t,e,this)}}else{const u=Math.max(0,r.start),d=Math.min(f.count,r.start+r.count);for(let v=u,g=d;v<g;v++)$s.fromBufferAttribute(f,v),dl($s,v,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=i.length;o<r;o++){const a=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function dl(s,t,e,n,i,o,r){const a=ga.distanceSqToPoint(s);if(a<e){const l=new z;ga.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;o.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:r})}}class Pa extends Ce{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const o=[],r=[];a(i),c(n),h(),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(o.slice(),3)),this.setAttribute("uv",new re(r,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const x=new z,y=new z,w=new z;for(let M=0;M<e.length;M+=3)d(e[M+0],x),d(e[M+1],y),d(e[M+2],w),l(x,y,w,_)}function l(_,x,y,w){const M=w+1,E=[];for(let P=0;P<=M;P++){E[P]=[];const S=_.clone().lerp(y,P/M),b=x.clone().lerp(y,P/M),F=M-P;for(let W=0;W<=F;W++)W===0&&P===M?E[P][W]=S:E[P][W]=S.clone().lerp(b,W/F)}for(let P=0;P<M;P++)for(let S=0;S<2*(M-P)-1;S++){const b=Math.floor(S/2);S%2===0?(u(E[P][b+1]),u(E[P+1][b]),u(E[P][b])):(u(E[P][b+1]),u(E[P+1][b+1]),u(E[P+1][b]))}}function c(_){const x=new z;for(let y=0;y<o.length;y+=3)x.x=o[y+0],x.y=o[y+1],x.z=o[y+2],x.normalize().multiplyScalar(_),o[y+0]=x.x,o[y+1]=x.y,o[y+2]=x.z}function h(){const _=new z;for(let x=0;x<o.length;x+=3){_.x=o[x+0],_.y=o[x+1],_.z=o[x+2];const y=p(_)/2/Math.PI+.5,w=m(_)/Math.PI+.5;r.push(y,1-w)}v(),f()}function f(){for(let _=0;_<r.length;_+=6){const x=r[_+0],y=r[_+2],w=r[_+4],M=Math.max(x,y,w),E=Math.min(x,y,w);M>.9&&E<.1&&(x<.2&&(r[_+0]+=1),y<.2&&(r[_+2]+=1),w<.2&&(r[_+4]+=1))}}function u(_){o.push(_.x,_.y,_.z)}function d(_,x){const y=_*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function v(){const _=new z,x=new z,y=new z,w=new z,M=new kt,E=new kt,P=new kt;for(let S=0,b=0;S<o.length;S+=9,b+=6){_.set(o[S+0],o[S+1],o[S+2]),x.set(o[S+3],o[S+4],o[S+5]),y.set(o[S+6],o[S+7],o[S+8]),M.set(r[b+0],r[b+1]),E.set(r[b+2],r[b+3]),P.set(r[b+4],r[b+5]),w.copy(_).add(x).add(y).divideScalar(3);const F=p(w);g(M,b+0,_,F),g(E,b+2,x,F),g(P,b+4,y,F)}}function g(_,x,y,w){w<0&&_.x===1&&(r[x]=_.x-1),y.x===0&&y.z===0&&(r[x]=w/2/Math.PI+.5)}function p(_){return Math.atan2(_.z,-_.x)}function m(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pa(t.vertices,t.indices,t.radius,t.details)}}class Da extends Pa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Da(t.radius,t.detail)}}class pc extends Ce{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class um{constructor(t,e,n=0,i=1/0){this.ray=new Ta(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new Aa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return va(t,this,n,e),n.sort(pl),n}intersectObjects(t,e=!0,n=[]){for(let i=0,o=t.length;i<o;i++)va(t[i],this,n,e);return n.sort(pl),n}}function pl(s,t){return s.distance-t.distance}function va(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let o=0,r=i.length;o<r;o++)va(i[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wa);const Jo=s=>Number.isInteger(s)?s.toFixed(1):String(s),ze=`
#define WORLD ${Jo(Kt)}
#define HALF_WORLD ${Jo(Kt/2)}
#define HRES ${Jo(xn)}
#define Y_PER_M ${Nt}
#define PI 3.14159265
`,kn=`
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
`,rn=`
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
`,zn=`
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
`,mc=`
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
`,fm=`
${ze}
${rn}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[8];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out vec2 vUv;
out float vMetres;

void main() {
  vec2 g = position.xz * uGrid;
  vec2 xz = aNode.xy + position.xz * aNode.z;
  float h = metresAt(xz) * Y_PER_M;
  float dist = distance(uCamPos, vec3(xz.x, h, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  g -= fract(g * 0.5) * 2.0 * k;
  xz = aNode.xy + g / uGrid * aNode.z;
  float mt = metresAt(xz);
  vMetres = mt;
  // The sea is drawn from the height texture; the seabed under it only needs to
  // be visible in the last few centimetres at the shoreline. Sink it below that
  // so the two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  h = mt * Y_PER_M;
  vWorld = vec3(xz.x, h, xz.y);
  vUv = worldToUv(xz);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,dm=`
${ze}
${kn}
${rn}
${zn}
${mc}
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
`,ml=32,Ci=7,gl=1600;class pm{constructor(t,e){this.heights=t.height,this.N=xn,this.leafSize=Kt/2**(Ci-1),this.range0=22,this.buildMinMax();const n=new $n(t.height,xn,xn,fs,fn);n.minFilter=ue,n.magFilter=ue,n.needsUpdate=!0,this.heightTex=n;const i=new $n(t.normals,xn,xn,Fe,en);i.minFilter=hi,i.magFilter=ee,i.generateMipmaps=!0,i.anisotropy=8,i.needsUpdate=!0,this.normalTex=i,this.full=this.makeGrid(ml),this.half=this.makeGrid(ml/2),this.morph=[];for(let r=0;r<8;r++)this.morph.push(new kt);const o={...e.uniforms,uHeight:{value:n},uNormal:{value:i},uMorph:{value:this.morph},uCamPos:{value:new z},uDebug:{value:0}};this.uniforms=o,this.group=new an;for(const r of[this.full,this.half])r.material=new _e({vertexShader:fm,fragmentShader:dm,uniforms:{...o,uGrid:{value:r.dim}}}),r.mesh=new ne(r.geometry,r.material),r.mesh.frustumCulled=!1,r.mesh.matrixAutoUpdate=!1,this.group.add(r.mesh);this._frustum=new xs,this._m=new Zt,this._box=new _n,this.setRange(this.range0)}makeGrid(t){const e=new pc,n=new Float32Array((t+1)*(t+1)*3);for(let a=0;a<=t;a++)for(let l=0;l<=t;l++){const c=(a*(t+1)+l)*3;n[c]=l/t,n[c+2]=a/t}const i=[];for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=a*(t+1)+l,h=c+1,f=c+t+1,u=f+1;l+a&1?i.push(c,f,h,h,f,u):i.push(c,f,u,c,u,h)}e.setIndex(i),e.setAttribute("position",new he(n,3));const o=new Float32Array(gl*4),r=new Xn(o,4);return r.setUsage(Fi),e.setAttribute("aNode",r),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:r,count:0}}buildMinMax(){const t=this.N,e=2**(Ci-1),n=t/e;this.mm=[];let i=new Float32Array(e*e),o=new Float32Array(e*e);for(let a=0;a<e;a++)for(let l=0;l<e;l++){let c=1/0,h=-1/0;for(let f=a*n;f<=Math.min(t-1,(a+1)*n);f++)for(let u=l*n;u<=Math.min(t-1,(l+1)*n);u++){const d=this.heights[f*t+u];d<c&&(c=d),d>h&&(h=d)}i[a*e+l]=c,o[a*e+l]=h}this.mm.push({lo:i,hi:o,n:e});let r=e;for(;r>1;){const a=r/2,l=new Float32Array(a*a),c=new Float32Array(a*a);for(let h=0;h<a;h++)for(let f=0;f<a;f++){const u=2*h*r+2*f;l[h*a+f]=Math.min(i[u],i[u+1],i[u+r],i[u+r+1]),c[h*a+f]=Math.max(o[u],o[u+1],o[u+r],o[u+r+1])}i=l,o=c,r=a,this.mm.push({lo:i,hi:o,n:r})}}setRange(t){this.range0=t,this.ranges=[];for(let e=0;e<Ci;e++)this.ranges.push(t*2**e);this.ranges[Ci-1]=1e6;for(let e=0;e<Ci;e++){const n=this.ranges[e],i=e>0?this.ranges[e-1]:0,o=i+(n-i)*.6;this.morph[e].set(o,n*.97)}}heightAt(t,e){return this.metresAt(t,e)*Nt}metresAt(t,e){const n=this.N;let i=(t+vt)/Kt*n-.5,o=(e+vt)/Kt*n-.5;i<0&&(i=0),o<0&&(o=0),i>n-1.001&&(i=n-1.001),o>n-1.001&&(o=n-1.001);const r=i|0,a=o|0,l=i-r,c=o-a,h=this.heights,f=a*n+r,u=h[f]+(h[f+1]-h[f])*l,d=h[f+n]+(h[f+n+1]-h[f+n])*l;return u+(d-u)*c}normalAt(t,e,n=new z){const i=Kt/this.N,o=this.heightAt(t+i,e)-this.heightAt(t-i,e),r=this.heightAt(t,e+i)-this.heightAt(t,e-i);return n.set(-o,2*i,-r).normalize()}update(t){this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.uniforms.uCamPos.value.copy(t.position),this.full.count=0,this.half.count=0,this.select(0,0,Ci-1);for(const e of[this.full,this.half])e.geometry.instanceCount=e.count,e.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],o=this.leafSize*2**n,r=-vt+t*o,a=-vt+e*o,l=i.lo[e*i.n+t]*Nt,c=i.hi[e*i.n+t]*Nt;return this._box.min.set(r,l,a),this._box.max.set(r+o,c,a+o),this._box}select(t,e,n){const i=this.nodeBox(t,e,n),o=this.mm[n];if(o.hi[e*o.n+t]<-45)return!0;if(i.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(i))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let a=0;a<4;a++){const l=t*2+(a&1),c=e*2+(a>>1);if(!this.select(l,c,n-1)){const h=this.mm[n-1];if(h.hi[c*h.n+l]<-45)continue;const f=this.nodeBox(l,c,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,c,r/2,n)}}return!0}emit(t,e,n,i,o){if(t.count>=gl)return;const r=t.count*4;t.data[r]=-vt+e*i,t.data[r+1]=-vt+n*i,t.data[r+2]=i,t.data[r+3]=o,t.count++}}const mm=`
${ze}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,gm=`
${ze}
${kn}
${rn}
${zn}
${mc}
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
`;function vm(s,t,e,n){const i=[0,0,0];for(let a=0;a<=n;a++){const l=s*Math.pow(t/s,a/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const o=[];for(let a=0;a<e;a++)o.push(0,1+(a+1)%e,1+a);for(let a=0;a<n;a++)for(let l=0;l<e;l++){const c=1+a*e+l,h=1+a*e+(l+1)%e,f=c+e,u=h+e;o.push(c,h,f,h,u,f)}const r=new Ce;return r.setAttribute("position",new re(i,3)),r.setIndex(o),r}class xm{constructor(t,e,n){this.uniforms={...t.uniforms,uHeight:{value:e},uSea:{value:n},uCamPos:{value:new z},uWind:{value:new kt(-.8,.45)},uSwellDir:{value:new kt(-.6,.8)},uSwell:{value:.6},uDebug:{value:0},uHorizonColor:{value:new Lt},uZenithColor:{value:new Lt}};const i=vm(1.5,8e3,96,72);this.material=new _e({vertexShader:mm,fragmentShader:gm,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new ne(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1}update(t){this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const _m=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],Mm={ra:12.857,dec:27.13};function ys(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function Tn(s,t,e=0){let n=Math.imul(s|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const ym=.5*(Math.sqrt(3)-1),es=(3-Math.sqrt(3))/6,Ri=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1,.7071,.7071,-.7071,.7071,.7071,-.7071,-.7071,-.7071]);function vl(s){const t=ys(s),e=new Uint8Array(256);for(let o=0;o<256;o++)e[o]=o;for(let o=255;o>0;o--){const r=Math.floor(t()*(o+1)),a=e[o];e[o]=e[r],e[r]=a}const n=new Uint8Array(512),i=new Uint8Array(512);for(let o=0;o<512;o++)n[o]=e[o&255],i[o]=n[o]%12;return function(r,a){const l=(r+a)*ym,c=Math.floor(r+l),h=Math.floor(a+l),f=(c+h)*es,u=r-(c-f),d=a-(h-f);let v,g;u>d?(v=1,g=0):(v=0,g=1);const p=u-v+es,m=d-g+es,_=u-1+2*es,x=d-1+2*es,y=c&255,w=h&255;let M=0,E=.5-u*u-d*d;if(E>0){const b=i[y+n[w]]*2;E*=E,M+=E*E*(Ri[b]*u+Ri[b+1]*d)}let P=.5-p*p-m*m;if(P>0){const b=i[y+v+n[w+g]]*2;P*=P,M+=P*P*(Ri[b]*p+Ri[b+1]*m)}let S=.5-_*_-x*x;if(S>0){const b=i[y+1+n[w+1]]*2;S*=S,M+=S*S*(Ri[b]*_+Ri[b+1]*x)}return 70*M}}function wm(s,t,e,n,i=.5){let o=0,r=1,a=0,l=1;for(let c=0;c<n;c++)o+=r*s(t*l,e*l),a+=r,r*=i,l*=2.03;return o/a}const to=(s,t,e)=>s<t?t:s>e?e:s,xl=(s,t,e)=>{const n=to((e-s)/(t-s),0,1);return n*n*(3-2*n)},Sm=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function xo(){const s=new Ce;return s.setAttribute("position",new he(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const bm=`
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
`;class Em{constructor(t){this.renderer=t,this.size=new kt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?In:en,this.sceneRT=new dn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new La(1,1,Ln),this.quad=new ne(xo(),new _e({vertexShader:Sm,fragmentShader:bm,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new kt},uInvProj:{value:new Zt},uCamWorld:{value:new Zt},uCamPos:{value:new z},uSunDir:{value:new z(0,1,0)},uSunColor:{value:new Lt},uFogColor:{value:new Lt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Ms,this.quadScene.add(this.quad),this.quadCam=new _s(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Cn=Math.PI/180,as=21*Cn,js=29.530588,Tm=224.1,Am=["Hilo","Hoaka","Kūkahi","Kūlua","Kūkolu","Kūpau","ʻOlekūkahi","ʻOlekūlua","ʻOlekūkolu","ʻOlepau","Huna","Mōhalu","Hua","Akua","Hoku","Māhealani","Kulu","Lāʻaukūkahi","Lāʻaukūlua","Lāʻaupau","ʻOlekūkahi","ʻOlekūlua","ʻOlepau","Kāloakūkahi","Kāloakūlua","Kāloapau","Kāne","Lono","Mauli","Muku"];function _l(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),o=Math.sin(s)*Math.cos(as)-n*Math.cos(t)*Math.sin(as),r=Math.sin(s)*Math.sin(as)+n*Math.cos(t)*Math.cos(as);return e.set(i,r,-o)}function gc(s,t,e={}){const n=23.44*Cn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*Cn,r=((s-80)/365.25*24%24+24)%24+t-12;e.sun=_l(n,(t-12)*15*Cn,e.sun||new z);const a=s+t/24,l=((a-Tm)%js+js)%js,c=l/js,h=i+c*2*Math.PI,f=Math.asin(Math.sin(23.44*Cn)*Math.sin(h)+Math.sin(5.1*Cn)*Math.sin(a*.23)),u=h/(2*Math.PI)*24;return e.moon=_l(f,(r-u)*15*Cn,e.moon||new z),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=r,e.decl=n,e}const vc=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],xc=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],Cm=1.6110731556870734,Rm=1.5;function Lm(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((Cm-Math.acos(s))/Rm)))}function Qo(s,t,e,n=[0,0,0]){const i=Lm(t.y),o=.2*e.turbidity*1e-17,r=Math.acos(Math.max(0,s.y)),a=1/(Math.cos(r)+.15*Math.pow(93.885-r*180/Math.PI,-1.253)),l=8400*a,c=1250*a,h=s.x*t.x+s.y*t.y+s.z*t.z,f=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),u=e.mieDirectionalG,d=u*u,v=1/(4*Math.PI)*((1-d)/Math.pow(1-2*u*h+d,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let p=0;p<3;p++){const m=vc[p]*e.rayleigh,_=.434*o*xc[p]*e.mieCoefficient,x=Math.exp(-(m*l+_*c)),y=(m*f+_*v)/(m+_);let w=Math.pow(i*y*(1-x),1.5);w*=1+(Math.pow(i*y*x,.5)-1)*g;const M=.1*x,E=(w+M)*.04+[0,3e-4,75e-5][p];n[p]=Math.pow(E,1/2.4)}return n}function Pm(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let r=0;r<3;r++){const a=vc[r]*t.rayleigh,l=.434*o*xc[r]*t.mieCoefficient;e[r]=Math.exp(-(a*8400*i+l*1250*i))}return e}const Dm=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,_c=`
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
`,Um=`
${_c}
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
`,Im=`
${_c}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,Fm=`
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
`,km=`
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
`;class zm{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=Mm,e=(c,h)=>{const f=c/24*2*Math.PI,u=h*Cn;return new z(Math.cos(u)*Math.cos(f),Math.cos(u)*Math.sin(f),Math.sin(u))};this.uniforms={uSun:{value:new z(0,1,0)},uMoon:{value:new z(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:as},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new ne(new Da(1,5),new _e({vertexShader:Dm,fragmentShader:Um,uniforms:this.uniforms,side:Ge,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=ys(4242),o=_m.map(([c,h,f])=>[c/24*2*Math.PI,h*Cn,f]);for(let c=0;c<2600;c++){const h=i()*2-1;o.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const r=new Float32Array(o.length*3);o.forEach((c,h)=>r.set(c,h*3));const a=new Ce;a.setAttribute("aStar",new he(r,3)),a.setAttribute("position",new he(new Float32Array(o.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new dc(a,new _e({vertexShader:Fm,fragmentShader:km,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:aa})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new an,this.group.add(n,this.stars),this.mapRT=new dn(256,128,{type:In,depthBuffer:!1}),this.mapRT.texture.wrapS=ci,this.mapScene=new Ms;const l=new ne(xo(),new _e({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Im,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new _s(-1,1,1,-1,0,1),this.astro={},this._v=new z}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const o=gc(t,e,this.astro),r=o.sun,a=this.uniforms;a.uSun.value.copy(r),a.uMoon.value.copy(o.moon),a.uPhase.value=o.phase,a.uIllum.value=o.illum,a.uLst.value=o.lst/24*2*Math.PI;const l=gn.smoothstep(-r.y,-.02,.2);a.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,f=Qo(h.set(0,1,0),r,c),u=[0,0,0];for(let M=0;M<8;M++){const E=M/8*Math.PI*2,P=Qo(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),r,c);for(let S=0;S<3;S++)u[S]+=P[S]/8}const d=Qo(h.set(r.x,.05,r.z).normalize(),r,c),v=Pm(r,c),g=gn.smoothstep(r.y,-.04,.06),p=3.2;i.sunColor.setRGB(v[0]*p*g,v[1]*p*g,v[2]*p*g);const m=[.0035,.005,.011],x=gn.smoothstep(o.moon.y,-.02,.1)*o.illum*l;i.skyColor.setRGB(f[0]*.55+u[0]*.45+m[0]+.012*x,f[1]*.55+u[1]*.45+m[1]+.016*x,f[2]*.55+u[2]*.45+m[2]+.024*x);const y=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Lt(y,y,y),.35),i.zenith.setRGB(f[0],f[1],f[2]),i.horizon.setRGB(u[0]+m[0],u[1]+m[1],u[2]+m[2]),i.sunHorizon.setRGB(d[0],d[1],d[2]);const w=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,r.y)+i.skyColor.r)*w*1.1,(i.sunColor.g*Math.max(0,r.y)+i.skyColor.g)*w,(i.sunColor.b*Math.max(0,r.y)+i.skyColor.b)*w*.8),i.moonColor.setRGB(.05*x,.06*x,.085*x),i.moonDir.copy(o.moon),i.sunDir.copy(r),i.night=l,o}}const ta=Math.PI*2,Nm=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Ml=s=>((s+Math.PI)%ta+ta)%ta-Math.PI;class Om{constructor(t,e,n){this.camera=t,this.dom=e,this.terrain=n,this.state={target:new z(0,0,20),distance:420,yaw:.35,pitch:.62,lift:0},this.goal={target:this.state.target.clone(),distance:420,yaw:.35,pitch:.62,lift:0},this.flight=null,this.floor=0,this.minDistance=.5,this.maxDistance=900,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new um,this._v=new z,this.bind()}bind(){const t=this.dom,e=new Map;let n=null,i=null,o=null;t.addEventListener("contextmenu",a=>a.preventDefault()),t.addEventListener("pointerdown",a=>{this.enabled&&(t.setPointerCapture(a.pointerId),e.set(a.pointerId,{x:a.clientX,y:a.clientY}),e.size===1?(n=a.button===2||a.shiftKey||a.ctrlKey||a.metaKey?"pan":"orbit",i={x:a.clientX,y:a.clientY},this.panAnchor=n==="pan"?this.pickGround(a.clientX,a.clientY):null):e.size===2&&(n="pinch",o=this.pinchState(e)),this.touch())}),t.addEventListener("pointermove",a=>{if(e.has(a.pointerId)){if(e.set(a.pointerId,{x:a.clientX,y:a.clientY}),n==="orbit"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=gn.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:a.clientX,y:a.clientY},this.touch()}else if(n==="pan"&&i)this.panBy(a.clientX-i.x,a.clientY-i.y),i={x:a.clientX,y:a.clientY},this.touch();else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=o.dist/Math.max(20,l.dist);this.goal.distance=gn.clamp(this.goal.distance*c,this.minDistance,this.maxDistance),this.panBy(l.cx-o.cx,l.cy-o.cy),this.goal.yaw-=Ml(l.angle-o.angle),this.goal.pitch=gn.clamp(this.goal.pitch+(l.cy-o.cy)*0,.06,1.52),o=l,this.touch()}}});const r=a=>{if(e.delete(a.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="orbit",i={...l}}};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("wheel",a=>{if(!this.enabled)return;a.preventDefault();const l=Math.exp(Math.sign(a.deltaY)*Math.min(Math.abs(a.deltaY),120)*.0018);this.zoomAt(a.clientX,a.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",a=>{const l=this.pickGround(a.clientX,a.clientY);l&&this.flyTo({target:l,distance:Math.max(6,this.goal.distance*.45)},1.6)}),addEventListener("keydown",a=>{var h,f;if(!this.enabled||(f=(h=a.target).closest)!=null&&f.call(h,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]}[a.code];if(c&&!a.altKey){const u=Math.sin(this.goal.yaw),d=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*d+c[1]*u)*l,this.goal.target.z+=(-c[0]*u+c[1]*d)*l,this.touch()}a.code==="KeyQ"&&(this.goal.yaw+=.12),a.code==="KeyE"&&(this.goal.yaw-=.12),(a.code==="Equal"||a.code==="NumpadAdd")&&(this.goal.distance*=.85),(a.code==="Minus"||a.code==="NumpadSubtract")&&(this.goal.distance/=.85)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,o=Math.sin(this.goal.yaw),r=Math.cos(this.goal.yaw),a=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*r-e*o*a)*i,this.goal.target.z+=(t*o-e*r*a)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),o=this.goal.distance,r=gn.clamp(o*n,this.minDistance,this.maxDistance);if(i&&r<o){const a=1-r/o;this.goal.target.lerp(i,a)}this.goal.distance=r}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new kt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e,n=3e3){const i=(l,c)=>Math.max(0,this.terrain.heightAt(l,c));let o=0,r=0,a=this._v;for(let l=0;l<400&&o<n;l++){a.copy(t).addScaledVector(e,o);const c=a.y-i(a.x,a.z);if(c<0){let h=r,f=o;for(let u=0;u<20;u++){const d=(h+f)/2;a.copy(t).addScaledVector(e,d),a.y-i(a.x,a.z)<0?f=d:h=d}return a.clone()}r=o,o+=Math.max(.03,c*.45,o*.002)}return null}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},o={target:t.target?t.target.clone():i.target.clone(),distance:t.distance??i.distance,yaw:t.yaw??i.yaw,pitch:t.pitch??i.pitch,lift:t.lift??0};o.yaw=i.yaw+Ml(o.yaw-i.yaw);const r=i.target.distanceTo(o.target),a=n.hop??Math.max(0,r*.9-Math.max(i.distance,o.distance)*.6);this.flight={from:i,dest:o,t:0,duration:e,hop:a,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}update(t){var o;const e=this.goal;if(this.flight){const r=this.flight;r.t=Math.min(1,r.t+t/r.duration);const a=Nm(r.t);e.target.lerpVectors(r.from.target,r.dest.target,a);const l=Math.log(r.from.distance)*(1-a)+Math.log(r.dest.distance)*a;e.distance=Math.exp(l)+r.hop*Math.sin(Math.PI*a),e.yaw=r.from.yaw+(r.dest.yaw-r.from.yaw)*a,e.pitch=r.from.pitch+(r.dest.pitch-r.from.pitch)*a+.25*Math.sin(Math.PI*a)*Math.min(1,r.hop/80),e.lift=r.from.lift+(r.dest.lift-r.from.lift)*a,r.t>=1&&(this.flight=null,(o=r.onDone)==null||o.call(r))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);if(e.target.x=gn.clamp(e.target.x,-vt*1.3,vt*1.3),e.target.z=gn.clamp(e.target.z,-vt*1.3,vt*1.3),!this.flight){const r=Math.max(0,this.terrain.heightAt(e.target.x,e.target.z));e.target.y+=(r-e.target.y)*(1-Math.exp(-t*6))}const n=this.state,i=this.flight?1:1-Math.exp(-t*7);n.target.lerp(e.target,i),n.distance+=(e.distance-n.distance)*i,n.yaw+=(e.yaw-n.yaw)*i,n.pitch+=(e.pitch-n.pitch)*i,n.lift+=(e.lift-n.lift)*i,this.apply(t)}groundAhead(t,e,n){const i=this.terrain;let o=i.heightAt(t,e);const r=this._prevXZ;if(r&&n>0){const a=(t-r.x)/n,l=(e-r.y)/n,c=Math.hypot(a,l),h=Math.min(2,c*.3);h>.005&&(o=Math.max(o,i.heightAt(t+a/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new kt).set(t,e),Math.max(0,o)}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const o=.12+e.distance*.03,r=this.groundAhead(n.position.x,n.position.z,t),a=Math.max(0,r+o-n.position.y);t<=0?this.floor=a:this.floor+=(a-this.floor)*(1-Math.exp(-t*(a>this.floor?9:2.5))),n.position.y+=this.floor;const l=Math.max(0,this.terrain.heightAt(n.position.x,n.position.z));n.position.y=Math.max(n.position.y,l+Math.min(.04,o*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=gn.clamp(Math.min(c,e.distance)*.12,.02,4),n.far=9e3,n.updateProjectionMatrix()}}const Bm=`
${ze}
${rn}
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
`;class Hm{constructor(t,e=1024){this.rt=new dn(e,e,{type:en,depthBuffer:!1,minFilter:ee,magFilter:ee}),this.material=new _e({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Bm,uniforms:{uHeight:{value:t},uSunDir:{value:new z(0,1,0)}},depthTest:!1,depthWrite:!1}),this.scene=new Ms;const n=new ne(xo(),this.material);n.frustumCulled=!1,this.scene.add(n),this.cam=new _s(-1,1,1,-1,0,1),this.last=new z(0,-2,0),this.size=e,this.strips=4,this.strip=-1}get texture(){return this.rt.texture}update(t,e,n=!1){if(n||!this.drawn){this.drawn=!0,this.draw(t,e,-1);return}if(this.strip<0){if(e.angleTo(this.last)<.004)return;this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e),this.strip=0}this.draw(t,null,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e,n){e&&(this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e));const i=this.rt;if(n>=0){const r=this.size/this.strips;i.scissor.set(0,n*r,this.size,r),i.scissorTest=!0}else i.scissorTest=!1;const o=t.getRenderTarget();t.setRenderTarget(i),t.render(this.scene,this.cam),t.setRenderTarget(o),i.scissorTest=!1}}const Gm=`
${ze}
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
uniform vec2 uRes;
uniform sampler2D uBowLUT;  // raindrop light near the bows (x = degrees from antisolar / 64; rows: showers, light rain, drizzle)
uniform sampler2D uShadow;  // terrain shadow from the sun, top-down
${rn}
in vec2 vUv;

// the bow table is drop optics (light relative to isotropic scattering); this
// one constant sets how strongly the app's rain veil, which already stands in
// for multiple scattering, carries it
#define BOW_GAIN 0.3

float hash(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
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

// density at p; full adds the fine erosion noise
float density(vec3 p, vec4 w, bool full) {
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  vec3 q = p + vec3(uWind.x, 0.0, uWind.y);
  // low-frequency noise sets how tall each cell grows, so tops are lumpy
  float lump = texture(uShape, q * vec3(1.0 / 140.0, 1.0 / 90.0, 1.0 / 140.0) + 0.37).r;
  float top = uBase + (uTop - uBase) * clamp(0.18 + cover * 0.7 + w.a * 0.35 + (lump - 0.5) * 0.7, 0.12, 1.0);
  float hf = (p.y - uBase) / max(top - uBase, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  // flat base, rounded shoulders
  float prof = smoothstep(0.0, 0.12, hf) * (1.0 - smoothstep(0.35, 1.0, hf));
  float n = texture(uShape, q * vec3(1.0 / 46.0, 1.0 / 34.0, 1.0 / 46.0) + vec3(0.0, uTime * 0.0006, 0.0)).r;
  float base = remap(n, 0.25, 1.0, 0.0, 1.0) * prof;
  float d = remap(base, 1.0 - cover, 1.0, 0.0, 1.0) * mix(0.55, 1.0, cover);
  d = clamp(d, 0.0, 1.0);
  if (full && d > 0.0) {
    float dn = texture(uDetail, q * (1.0 / 9.0) + vec3(0.0, uTime * 0.004, 0.0)).r;
    // wispy at the base, billowy higher up
    float er = mix(dn, 1.0 - dn, clamp(hf * 4.0, 0.0, 1.0)) * 0.32;
    d = clamp(remap(d, er, 1.0, 0.0, 1.0), 0.0, 1.0);
  }
  return d * uDensity * 1.6;
}

// cheap density for the light march: coverage and the base shape only
float densityLight(vec3 p) {
  vec4 w = weatherAll(p.xz);
  float cover = w.r;
  if (cover < 0.01) return 0.0;
  float top = uBase + (uTop - uBase) * clamp(0.18 + cover * 0.7 + w.a * 0.35, 0.12, 1.0);
  float hf = (p.y - uBase) / max(top - uBase, 1e-3);
  if (hf < 0.0 || hf > 1.0) return 0.0;
  float prof = smoothstep(0.0, 0.12, hf) * (1.0 - smoothstep(0.35, 1.0, hf));
  vec3 q = p + vec3(uWind.x, 0.0, uWind.y);
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

  float jitter = hash(gl_FragCoord.xy);
  vec3 L = vec3(0.0);
  float T = 1.0;
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
  float t = t0 + jitter * clamp(t0 * 0.012, 0.25, 3.0);
  for (int i = 0; i < 180; i++) {
    if (t >= t1 || T < 0.03) break;
    float dt = clamp(t * 0.011 / detailK, 0.22, 7.0);
    vec3 p = uCamPos + rd * t;
    vec4 w = weatherAll(p.xz);
    bool inCloudLayer = p.y >= uBase;
    if (w.r < 0.012 && (inCloudLayer || w.g < 0.01)) {
      // empty air: stride ahead (the weather grid is ~4 units a cell)
      t += max(dt * 4.0, 2.4);
      continue;
    }
    float fogT = exp(-t * fogK);
    if (inCloudLayer) {
      float d = density(p, w, true);
      if (d > 0.002) {
        // light from the sun through the cloud above/around this point
        float tau = 0.0;
        vec3 sd = uSunDir.y > 0.02 ? uSunDir : vec3(0.0, 1.0, 0.0);
        float ls = 0.4;
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
        vec3 S = sunL * beer * phase * mix(0.45, 1.0, powder) + amb * (0.35 + 0.55 * hf) * (1.0 - 0.35 * d) + uMoonColor * 3.0 * exp(-tau);
        if (uFlash > 0.0) S += vec3(2.2, 2.3, 3.0) * uFlash * exp(-distance(p, uFlashPos) * 0.05);
        float sigma = d * 2.6;
        float Ts = exp(-sigma * dt);
        L += T * (S * (1.0 - Ts) * fogT + uFogColor * (1.0 - fogT) * (1.0 - Ts));
        T *= Ts;
      }
    } else if (w.g > 0.0) {
      // rain (under cloud that isn't raining there is nothing to add): grey
      // streaks below the base, thinning toward the ground in dry air
      // streaks: fine near the camera, a soft veil farther off
      float near = 1.0 - smoothstep(4.0, 30.0, t);
      vec3 q = vec3(p.x * mix(0.5, 3.0, near), p.y * 0.05 + uTime * 0.9, p.z * mix(0.5, 3.0, near)) + vec3(uWind.x * 0.5, 0.0, uWind.y * 0.5);
      float streak = texture(uDetail, q).r;
      float fall = smoothstep(0.0, uBase * 0.3, p.y + uBase * 0.08) * mix(1.0, 0.35, near);
      float r = w.g * smoothstep(0.25, 0.75, streak + w.g * 0.4) * fall;
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
      L += T * (S * (1.0 - Ts) * fogT + uFogColor * (1.0 - fogT) * (1.0 - Ts));
      // the bow rides on the mean rain, not the streaks, so it holds still;
      // drop size follows the rain rate: drizzle pale and broad, showers narrow and vivid
      if (bowOn > 0.0 && lit > 0.003) {
        float sb = w.g * fall * 0.12; // mean extinction: 0.14 × the streaks' average cover
        vec3 bowP = mix(mix(bowDrizzle, bowLight, smoothstep(0.05, 0.25, w.g)), bowShower, smoothstep(0.3, 0.65, w.g));
        L += T * sunL * lit * bowP * (1.0 - exp(-sb * dt)) * fogT;
      }
      T *= Ts;
    }
    t += dt;
  }
  gl_FragColor = vec4(L, T);
}
`,Mc=512,yc=64;function Vm(s){if(s>6)return 0;if(s<-7){const r=-s,a=2/3*r*Math.sqrt(r),l=a+Math.PI/4;return(Math.sin(l)-5/(72*a)*Math.cos(l))/(Math.sqrt(Math.PI)*Math.sqrt(Math.sqrt(r)))}const t=s*s*s;let e=1,n=s,i=1,o=s;for(let r=1;r<80&&(i*=t/((3*r-1)*(3*r)),o*=t/(3*r*(3*r+1)),e+=i,n+=o,!(Math.abs(i)+Math.abs(o)<1e-16));r++);return .355028053887817*e-.258819403792807*n}const wc=s=>1.3239+.003125/(s*s);function Sc(s,t,e){const n=Math.sqrt(1-e*e),i=Math.sqrt(1-e*e/(s*s)),o=(n-s*i)/(n+s*i),r=(s*n-i)/(s*n+i),a=o*o,l=r*r;return .5*((1-a)**2*a**t+(1-l)**2*l**t)}function Pi(s,t,e){const n=Math.asin(e),i=Math.asin(e/s),o=2*(n-i)+t*(Math.PI-2*i);return t===1?Math.PI-o:o-Math.PI}function Ua(s,t){const e=Math.sqrt(1-(s*s-1)/(t*(t+2))),n=2*e/Math.pow(1-e*e,1.5)-2*(t+1)*e/Math.pow(s*s-e*e,1.5);return{b:e,alpha:Pi(s,t,e),d2:Math.abs(n),eps:Sc(s,t,e)}}const ei=(s,t,e,n)=>Math.exp(-.5*((s-t)/(s<t?e:n))**2),Wm=s=>[1.056*ei(s,599.8,37.9,31)+.362*ei(s,442,16,26.7)-.065*ei(s,501.1,20.4,26.2),.821*ei(s,568.8,46.9,40.5)+.286*ei(s,530.9,16.3,31.1),1.217*ei(s,437,11.8,36)+.681*ei(s,459,26,13.8)],yl=([s,t,e])=>[3.2406*s-1.5372*t-.4986*e,-.9689*s+1.8758*t+.0415*e,.0557*s-.204*t+1.057*e],xa=.25;function qm(s,t,e){const n=Ua(s,t);let i=0;for(const[o,r]of[[1e-6,n.b],[n.b,1-1e-9]]){let a=o,l=r;const c=Pi(s,t,a)-e;if(c*(Pi(s,t,l)-e)>0)continue;for(let v=0;v<40;v++){const g=(a+l)/2;(Pi(s,t,g)-e)*c>0?a=g:l=g}const h=(a+l)/2,f=Math.max(h-1e-6,0),u=Math.min(h+1e-6,1),d=Math.abs(Pi(s,t,u)-Pi(s,t,f))/(u-f);i+=2*Sc(s,t,h)*h/(d*Math.sin(e))}return i}function Xm(){const s=wc(.55);return[1,2].map(t=>{const e=Ua(s,t),n=new Float32Array(Math.ceil(yc/xa)+1);for(let i=0;i<n.length;i++){const o=Math.max(i*xa,.5)*Math.PI/180,r=t===1?e.alpha-o:e.alpha+o;if(r<=.01||r>=Math.PI-.01){n[i]=n[i-1]||1;continue}const a=e.eps*e.b*Math.cbrt(4)*Math.pow(e.d2,-2/3)*2/(Math.sqrt(o*Math.cbrt(2/e.d2))*Math.sin(r));n[i]=qm(s,t,r)/a}return n})}const uo=-20,_a=.01;function Ym(){const s=new Float32Array(Math.round((6-uo)/_a)+2);for(let t=0;t<s.length;t++)s[t]=Vm(uo+t*_a)**2;return s}function ea(s,t,e){const n=Mc,i=yc/n,o=new Float32Array(n*3),r=[.6,.75,.9,1,1.1,1.25,1.45,1.7].map(_=>s*_),a=r.map(_=>Math.exp(-.5*(Math.log(_/s)/.3)**2)*_*_),l=a.reduce((_,x)=>_+x,0),c=new Float32Array(n),h=new Float32Array(n);for(let _=0;_<n;_++)c[_]=Math.max((_+.5)*i,1)*Math.PI/180,h[_]=1/Math.sin(c[_]);const f=[0,0,0],u=new Float32Array(n*3);for(let _=400;_<=700;_+=20){const x=Wm(_);for(let w=0;w<3;w++)f[w]+=x[w];const y=wc(_/1e3);for(const w of[1,2]){const M=Ua(y,w),E=t[w-1],P=w===1?1:-1;for(let S=0;S<r.length;S++){const b=2*Math.PI*r[S]*1e6/_,F=Math.cbrt(b),W=F*F*Math.cbrt(2/M.d2),X=M.eps*M.b*Math.cbrt(4)*F*Math.pow(M.d2,-2/3)*4*Math.PI*(a[S]/l);for(let T=w===1?0:n-1;T>=0&&T<n;T+=P){const D=(M.alpha-c[T])*P,G=-D*W;if(G>6)break;let U;if(G<uo)U=1/(2*Math.PI*Math.sqrt(-G));else{const B=(G-uo)/_a,C=Math.floor(B);U=e[C]+(e[C+1]-e[C])*(B-C)}let k=X*U*h[T];if(D>0){const B=Math.min(E.length-1.001,D*180/Math.PI/xa),C=Math.floor(B);k*=E[C]+(E[C+1]-E[C])*(B-C)}u[T*3]+=k*x[0],u[T*3+1]+=k*x[1],u[T*3+2]+=k*x[2]}}}}const d=yl(f),v=Math.ceil(.2665/i),g=[];for(let _=-v;_<=v;_++)g.push(Math.sqrt(Math.max(0,1-(_*i/.2665)**2)));const p=g.reduce((_,x)=>_+x,0),m=[0,0,0];for(let _=0;_<n;_++){m.fill(0);for(let P=-v;P<=v;P++){const S=Math.min(n-1,Math.max(0,_+P));for(let b=0;b<3;b++)m[b]+=u[S*3+b]*g[P+v]/p}const x=yl(m).map((P,S)=>P/d[S]),y=.2126*x[0]+.7152*x[1]+.0722*x[2],w=Math.min(x[0],x[1],x[2]),M=w<0?y/Math.max(y-w,1e-6):1,E=1-Math.min(1,Math.max(0,((_+.5)*i-58)/5));for(let P=0;P<3;P++)o[_*3+P]=Math.max(0,y+(x[P]-y)*M)*E}return o}function $m(){performance.now();const s=Xm(),t=Ym(),e=[ea(.5,s,t),ea(.15,s,t),ea(.05,s,t)],n=Mc,i=new Uint16Array(n*3*4),o=kr.toHalfFloat(1);for(let a=0;a<3;a++)for(let l=0;l<n;l++){const c=(a*n+l)*4;for(let h=0;h<3;h++)i[c+h]=kr.toHalfFloat(e[a][l*3+h]);i[c+3]=o}const r=new $n(i,n,3,Fe,In);return r.minFilter=r.magFilter=ee,r.wrapS=r.wrapT=$e,r.needsUpdate=!0,r}class jm{constructor(t){const e=new pa(t.shape,t.shapeSize,t.shapeSize,t.shapeSize);e.format=fs,e.minFilter=ee,e.magFilter=ee,e.wrapS=e.wrapT=e.wrapR=ci,e.unpackAlignment=1,e.needsUpdate=!0;const n=new pa(t.detail,t.detailSize,t.detailSize,t.detailSize);n.format=fs,n.minFilter=ee,n.magFilter=ee,n.wrapS=n.wrapT=n.wrapR=ci,n.unpackAlignment=1,n.needsUpdate=!0,this.scale=.5,this.rt=new dn(1,1,{type:In,depthBuffer:!1}),this.uniforms={uDepth:{value:null},uWeather:{value:null},uShape:{value:e},uDetail:{value:n},uWeatherRect:{value:new me},uInvProj:{value:new Zt},uCamWorld:{value:new Zt},uCamPos:{value:new z},uSunDir:{value:new z},uSunColor:{value:new Lt},uSkyColor:{value:new Lt},uGroundColor:{value:new Lt},uFogColor:{value:new Lt},uMoonDir:{value:new z},uMoonColor:{value:new Lt},uWind:{value:new kt},uWindDir:{value:new kt(1,0)},uTime:{value:0},uBase:{value:8},uTop:{value:28},uDensity:{value:1},uFarCover:{value:.32},uOvercast:{value:0},uRainbow:{value:1},uBowLUT:{value:$m()},uShadow:{value:null},uHeight:{value:null},uSteps:{value:56},uLightSteps:{value:4},uFlash:{value:0},uFlashPos:{value:new z},uRes:{value:new kt}},this.material=new _e({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Gm,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}),this.scene=new Ms;const i=new ne(xo(),this.material);i.frustumCulled=!1,this.scene.add(i),this.cam=new _s(-1,1,1,-1,0,1),this.enabled=!0}get texture(){return this.rt.texture}setSize(t,e){this.full=[t,e],this.rt.setSize(Math.max(1,Math.floor(t*this.scale)),Math.max(1,Math.floor(e*this.scale))),this.uniforms.uRes.value.set(this.rt.width,this.rt.height)}setScale(t){Math.abs(t-this.scale)<.001||(this.scale=t,this.full&&this.setSize(...this.full))}render(t,e,n){const i=this.uniforms;i.uDepth.value=n,i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),t.setRenderTarget(this.rt),t.render(this.scene,this.cam)}}const Ma={moae:{name:"Moaʻe",gloss:"trade winds",bearing:62,speed:8.5,humidity:1,lcl:650,inversion:2150,patch:1,convect:.55},kona:{name:"Kona",gloss:"southerly storm",bearing:205,speed:11,humidity:1.45,lcl:420,inversion:4800,patch:1.6,convect:.8},malie:{name:"Mālie",gloss:"calm, sea breezes",bearing:110,speed:2.4,humidity:.85,lcl:900,inversion:2900,patch:.5,convect:1.5}},Ve=160,ns=Kt*1.8;class Km{constructor(t,e,n=7){this.G=Ve,this.span=ns,this.cell=ns/Ve,this.origin=-ns/2;const i=Ve*Ve;this.terrain=new Float32Array(i),this.land=new Float32Array(i),this.heat=new Float32Array(i);for(let o=0;o<Ve;o++)for(let r=0;r<Ve;r++){const a=this.origin+(r+.5)*this.cell,l=this.origin+(o+.5)*this.cell;let c=0,h=0,f=0;for(let d=-1;d<=1;d++)for(let v=-1;v<=1;v++){const g=a+v*this.cell*.5,p=l+d*this.cell*.5,m=Math.floor((g+Kt/2)/Kt*e),_=Math.floor((p+Kt/2)/Kt*e),x=m<0||_<0||m>=e||_>=e?-500:t[_*e+m];c+=Math.max(0,x),h=Math.max(h,x),f++}const u=o*Ve+r;this.terrain[u]=c/f,this.land[u]=h>0?1:0}this.qv=new Float32Array(i).fill(1),this.qc=new Float32Array(i),this.zp=new Float32Array(i),this.rain=new Float32Array(i),this.wet=new Float32Array(i),this.conv=new Float32Array(i),this.tmp=[new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i)],this.noise=vl(n),this.noise2=vl(n+1),this.mode="auto",this.regime="moae",this.state={...Ma.moae},this.wind=new kt(...oa(62)).multiplyScalar(8.5),this.windOffset=new kt,this.simTime=0,this.nextChange=3600*30,this.rainTotal=0,this.data=new Float32Array(i*4),this.texture=new $n(this.data,Ve,Ve,Fe,fn),this.texture.minFilter=ee,this.texture.magFilter=ee,this.texture.wrapS=this.texture.wrapT=$e,this.texture.needsUpdate=!0,this.rect=new me(this.origin,this.origin,ns,ns),this.accum=0,this.boost=0}setMode(t){this.mode=t,t!=="auto"&&(this.regime=t)}pickRegime(t){const e=Math.random();return t==="hooilo"?e<.62?"moae":e<.8?"malie":"kona":e<.86?"moae":e<.97?"malie":"kona"}step(t,e,n,i,o=!1){if(t<=0)return;if(this.simTime+=t,this.mode==="auto"&&this.simTime>this.nextChange){this.regime=this.pickRegime(i);const M=this.regime==="moae"?30+Math.random()*60:this.regime==="kona"?14+Math.random()*20:10+Math.random()*16;this.nextChange=this.simTime+M*3600}const r=Ma[this.regime],a=1-Math.exp(-t/7200),l=this.state;for(const M of["speed","humidity","lcl","inversion","patch","convect"]){let E=r[M];this.boost&&M==="humidity"&&(E*=1.18),this.boost&&M==="patch"&&(E*=1.6),l[M]+=(E-l[M])*a}let c=r.bearing-l.bearing;c=(c+540)%360-180,l.bearing+=c*a;const h=1+.18*Math.sin((n-9)/24*Math.PI*2),f=1+.12*this.noise(this.simTime/5400,3.3),u=l.bearing+9*this.noise(this.simTime/9e3,7.7),[d,v]=oa(u),g=l.speed*h*f;this.wind.set(d*g,v*g);const p=d*g/100,m=v*g/100;this.windOffset.x+=p*t,this.windOffset.y+=m*t,this.pending=(this.pending||0)+t;const _=performance.now();if(!o&&_-(this.lastPhysics||0)<80)return;this.lastPhysics=_;const x=this.pending;this.pending=0;const y=Math.hypot(p,m)*x,w=Math.max(1,Math.min(12,Math.ceil(y/(this.cell*1.5))));for(let M=0;M<w;M++)this.substep(x/w,p,m,e);this.pack()}substep(t,e,n,i){const o=Ve,r=this.cell,a=this.state,[l,c,h,f,u]=this.tmp,d=e*t/r,v=n*t/r,g=this.windOffset.x,p=this.windOffset.y;for(let y=0;y<o;y++)for(let w=0;w<o;w++){const M=y*o+w,E=w-d,P=y-v;if(E<0||P<0||E>o-1||P>o-1){const k=this.origin+(E+.5)*r-g,B=this.origin+(P+.5)*r-p,C=Math.hypot(e,n)||1,N=(k*e+B*n)/C,Z=(-k*n+B*e)/C,O=wm(this.noise2,N/60,Z/24,3);l[M]=a.humidity*(1+a.patch*.55*O),c[M]=Math.max(0,O-.05)*.75*a.patch,h[M]=0,f[M]=0,u[M]=0;continue}const S=Math.min(o-2,E|0),b=Math.min(o-2,P|0),F=E-S,W=P-b,X=b*o+S,T=(1-F)*(1-W),D=F*(1-W),G=(1-F)*W,U=F*W;l[M]=this.qv[X]*T+this.qv[X+1]*D+this.qv[X+o]*G+this.qv[X+o+1]*U,c[M]=this.qc[X]*T+this.qc[X+1]*D+this.qc[X+o]*G+this.qc[X+o+1]*U,h[M]=this.zp[X]*T+this.zp[X+1]*D+this.zp[X+o]*G+this.zp[X+o+1]*U,f[M]=this.conv[X]*T+this.conv[X+1]*D+this.conv[X+o]*G+this.conv[X+o+1]*U,u[M]=this.wet[M]}const m=Math.hypot(e,n)*t*100,_=Math.max(0,i)*a.convect,x=a.lcl;for(let y=0;y<o*o;y++){const w=this.terrain[y];let M=l[y],E=c[y];const P=h[y],S=Math.max(w,P-.24*m);if(S>P){const T=Math.max(0,S-Math.max(P,x)),D=Math.min(M,M*T/650);M-=D,E+=D}else if(S<P){const T=Math.min(E,(P-S)*(.0035*E+35e-5));E-=T,M+=T}let b=f[y]*Math.exp(-t/5400);if(this.land[y]){const T=_*xl(80,700,w)*(1-.6*xl(.85,1.2,a.humidity))*45e-7,D=Math.min(M*.2,T*t*M);M-=D,E+=D,b=Math.min(1,b+T*t*4)}else{M+=(a.humidity-M)*(1-Math.exp(-t/2400));const T=Math.max(0,M-a.humidity*1.12)*t*12e-5;M-=T,E+=T}const W=Math.max(0,E-.11)*(1-Math.exp(-t/1500));E-=W,E*=Math.exp(-t/21600);const X=W/Math.max(t,.001)*3600;this.rain[y]=this.rain[y]*.6+X*.4,u[y]=to(u[y]*Math.exp(-t/(3600*5))+X*t/3600*3,0,1),this.qv[y]=M,this.qc[y]=E,this.zp[y]=S,this.conv[y]=b,this.wet[y]=u[y]}}pack(){const t=this.data;let e=0,n=0,i=0;for(let o=0;o<Ve*Ve;o++){const r=to(this.qc[o]*4.2,0,1);t[o*4]=r;const a=to(this.rain[o]*2.2,0,1);t[o*4+1]=a,t[o*4+2]=this.wet[o],t[o*4+3]=this.conv[o],this.land[o]&&(e+=a);const l=a*(.4+this.conv[o]);l>n&&(n=l,i=o)}this.rainTotal=e,this.stormiest={strength:n,x:this.origin+(i%Ve+.5)*this.cell,z:this.origin+(Math.floor(i/Ve)+.5)*this.cell},this.texture.needsUpdate=!0}spawnShower(t,e,n=6,i=.5){const o=this.G,r=(t-this.origin)/this.cell-.5,a=(e-this.origin)/this.cell-.5,l=n/this.cell;for(let c=Math.max(0,Math.floor(a-l));c<=Math.min(o-1,Math.ceil(a+l));c++)for(let h=Math.max(0,Math.floor(r-l));h<=Math.min(o-1,Math.ceil(r+l));h++){const f=Math.hypot(h-r,c-a)/l;if(f>1)continue;const u=c*o+h,d=(1-f*f)*i;this.qc[u]=Math.max(this.qc[u],.12+d*.3),this.rain[u]=Math.max(this.rain[u],d*.6),this.conv[u]=Math.max(this.conv[u],d)}this.pack()}warm(t,e,n,i){for(let o=0;o<t*3600;o+=600)this.step(600,e,n,i,!0)}get base(){return this.state.lcl*Nt}get top(){return this.state.inversion*Nt}}const Ue=.016,it={plain:0,thatch:1,stone:2,leaf:3,kapa:5,wood:6,skin:7};class ke{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.xf=null,this.stack=[]}at(t,e,n,i=0,o=Ue){this.stack.push(this.xf);const r=Math.cos(i),a=Math.sin(i);return this.xf=l=>[t+(l[0]*r-l[2]*a)*o,e+l[1]*o,n+(l[0]*a+l[2]*r)*o],this}done(){return this.xf=this.stack.pop()||null,this}get count(){return this.pos.length/3}tri(t,e,n,i,o=0,r=!0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],f=n[1]-t[1],u=n[2]-t[2];let d=l*u-c*f,v=c*h-a*u,g=a*f-l*h;const p=Math.hypot(d,v,g)||1;d/=p,v/=p,g/=p;for(const m of[t,e,n])this.pos.push(m[0],m[1],m[2]),this.nor.push(d,v,g),this.col.push(i[0],i[1],i[2]),this.mat.push(o)}quad(t,e,n,i,o,r=0){this.tri(t,e,n,o,r),this.tri(t,n,i,o,r)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],n,i)}box(t,e,n,i,o,r,a,l=0,c=0,h=1){const f=Math.cos(c),u=Math.sin(c),d=(y,w,M)=>[t+y*f-M*u,e+w,n+y*u+M*f],v=i/2,g=r/2,p=v*h,m=g*h,_=[d(-v,0,-g),d(v,0,-g),d(v,0,g),d(-v,0,g)],x=[d(-p,o,-m),d(p,o,-m),d(p,o,m),d(-p,o,m)];o<0?this.hexa(x,_,a,l):this.hexa(_,x,a,l)}cyl(t,e,n,i,o,r=0,a=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,f=c.map(m=>m/h),u=Math.abs(f[1])<.9?[0,1,0]:[1,0,0];let d=[f[1]*u[2]-f[2]*u[1],f[2]*u[0]-f[0]*u[2],f[0]*u[1]-f[1]*u[0]];const v=Math.hypot(...d);d=d.map(m=>m/v);const g=[f[1]*d[2]-f[2]*d[1],f[2]*d[0]-f[0]*d[2],f[0]*d[1]-f[1]*d[0]],p=(m,_,x)=>{const y=x/a*Math.PI*2,w=Math.cos(y)*_,M=Math.sin(y)*_;return[m[0]+d[0]*w+g[0]*M,m[1]+d[1]*w+g[1]*M,m[2]+d[2]*w+g[2]*M]};for(let m=0;m<a;m++){const _=p(t,n,m),x=p(t,n,m+1),y=p(e,i,m),w=p(e,i,m+1);this.quad(_,x,w,y,o,r),l&&this.tri(e,y,w,o,r)}}blob(t,e,n,i,o,r,a,l=0,c=0,h=l===it.leaf,f=1){const u=(1+Math.sqrt(5))/2,d=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],v=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=y=>.85+.3*Math.abs(Math.sin(y*12.9898+c*78.233)*43758.5453%1),p=d.map((y,w)=>{const M=Math.hypot(...y),E=g(w);return[t+y[0]/M*i*E,e+y[1]/M*o*E,n+y[2]/M*r*E]});if(!h){for(const y of v)this.tri(p[y[0]],p[y[1]],p[y[2]],a,l);return}const m=(y,w)=>{const M=[(y[0]+w[0])/2,(y[1]+w[1])/2,(y[2]+w[2])/2],E=[(M[0]-t)/i,(M[1]-e)/o,(M[2]-n)/r],P=Math.hypot(...E)||1,S=.9+.2*Math.abs(Math.sin(M[0]*91.7+M[2]*47.3+c)*43758.5453%1);return[t+E[0]/P*i*S,e+E[1]/P*o*S,n+E[2]/P*r*S]},_=y=>{const w=[(y[0]-t)/(i*i),(y[1]-e)/(o*o),(y[2]-n)/(r*r)],M=Math.hypot(...w)||1;return[w[0]/M,w[1]/M,w[2]/M]},x=(y,w,M)=>{const E=this.xf?[this.xf(y),this.xf(w),this.xf(M)]:[y,w,M],P=[_(y),_(w),_(M)];for(let S=0;S<3;S++)this.pos.push(...E[S]),this.nor.push(...P[S]),this.col.push(a[0],a[1],a[2]),this.mat.push(l)};if(f===0){for(const y of v)x(p[y[0]],p[y[1]],p[y[2]]);return}for(const y of v){const w=p[y[0]],M=p[y[1]],E=p[y[2]],P=m(w,M),S=m(M,E),b=m(E,w);x(w,P,b),x(P,M,S),x(b,S,E),x(P,S,b)}}wall(t,e,n,i,o=it.stone,r=.7){const a=t.length;if(a<2)return;const l=a>2&&Math.hypot(t[0][0]-t[a-1][0],t[0][2]-t[a-1][2])<1e-9,c=[];for(let g=0;g<a-1;g++){const p=t[g+1][0]-t[g][0],m=t[g+1][2]-t[g][2],_=Math.hypot(p,m)||1;c.push([-m/_,p/_])}const h=t.map((g,p)=>{let m=c[p-1],_=c[p];if(l&&p===0&&(m=c[a-2]),l&&p===a-1&&(_=c[0]),!m)return _;if(!_)return m;const x=m[0]+_[0],y=m[1]+_[1],w=Math.hypot(x,y);if(w<1e-6)return _;const M=1/Math.max(.35,(x*_[0]+y*_[1])/w);return[x/w*M,y/w*M]}),f=e/2,u=e*r/2,d=(g,p,m,_)=>[g[0]+p[0]*m,g[1]+_,g[2]+p[1]*m],v=g=>[d(t[g],h[g],-f,-n*.3),d(t[g],h[g],f,-n*.3),d(t[g],h[g],u,n),d(t[g],h[g],-u,n)];for(let g=0;g<a-1;g++){const[p,m,_,x]=v(g),[y,w,M,E]=v(g+1);this.quad(x,_,M,E,i,o),this.quad(m,w,M,_,i,o),this.quad(y,p,x,E,i,o)}if(!l){const[g,p,m,_]=v(0),[x,y,w,M]=v(a-1);this.quad(g,p,m,_,i,o),this.quad(y,x,M,w,i,o)}}geometry(){const t=new Ce;return t.setAttribute("position",new re(this.pos,3)),t.setAttribute("normal",new re(this.nor,3)),t.setAttribute("color",new re(this.col,3)),t.setAttribute("aMat",new re(this.mat,1)),t.computeBoundingSphere(),t}}function bt(s,t=0,e=Math.random){const n=new Lt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Zm=`
${ze}
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
`,Jm=`
${ze}
${kn}
${rn}
${zn}
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
`;function us(s,t={}){const[e,n]=t.fade||[120,160];return new _e({vertexShader:Zm,fragmentShader:Jm,vertexColors:!0,side:t.doubleSide?Ye:Un,uniforms:{...s.uniforms,uWindVec:s.uniforms.uWindVec||{value:new kt(1,0)},uFadeNear:{value:e},uFadeFar:{value:n},uFadeClose:{value:t.close||0},uFadeIn:{value:new kt(...t.fadeIn||[0,0])},uSway:{value:t.sway||0},uObjDebug:{value:0}}})}const ge={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",stoneDark:"#4f4844",wood:"#6b4a2f",koa:"#7a4a2a",kapa:"#efe8d8",salt:"#f2ece4"};function eo(s,t,e=7,n=4.6,i=5.2,o=!0){const r=bt(ge.thatch,.18,t),a=bt(ge.thatchDark,.15,t),l=bt(ge.stone,.15,t);s.box(0,-.6,0,e+1.8,1.05,n+1.8,l,it.stone);const c=.45,h=c+1.05;s.box(0,c,0,e,h-c,n,r,it.thatch);const f=e/2+.35,u=n/2+.45,d=c+i,v=[-f,h-.15,-u],g=[f,h-.15,-u],p=[-f,d,0],m=[f,d,0],_=[-f,h-.15,u],x=[f,h-.15,u];s.quad(v,p,m,g,r,it.thatch),s.quad(x,m,p,_,r,it.thatch),s.quad(g,m,p,v,a,it.thatch),s.quad(_,p,m,x,a,it.thatch);const y=e/2;if(s.tri([-y,h,-n/2],[-y,h,n/2],[-y,d-.2,0],r,it.thatch),s.tri([y,h,n/2],[y,h,-n/2],[y,d-.2,0],r,it.thatch),s.box(0,d-.12,0,e+.9,.35,.55,a,it.thatch),o){const w=[.05,.035,.025];s.quad([y+.02,c,-.45],[y+.02,c+1.4,-.45],[y+.02,c+1.4,.45],[y+.02,c,.45],w,0)}}function bc(s,t,e,n,i){const o=bt(ge.wood,.25,i);s.cyl([t,0,e],[t,n*.62,e],.22,.18,o,it.wood,5),s.box(t,n*.6,e,.75,n*.28,.6,o,it.wood,i()*.3,.85),s.box(t,n*.86,e,.35,n*.16,.35,o,it.wood,0,.6)}function Qm(s,t,e,n,i){const o=bt(ge.kapa,.05,i),r=bt(ge.wood,.2,i);s.box(t,0,e,2.6,n,2.6,o,it.kapa,.1,.62);for(const[a,l]of[[-1.35,-1.35],[1.35,-1.35],[1.35,1.35],[-1.35,1.35]])s.cyl([t+a,0,e+l],[t+a*.55,n+.8,e+l*.55],.12,.08,r,it.wood,4)}function tg(s,t,e,n){const i=bt(ge.wood,.2,n);for(const[o,r]of[[-.9,-.6],[.9,-.6],[.9,.6],[-.9,.6]])s.cyl([t+o,0,e+r],[t+o,2.6,e+r],.09,.08,i,it.wood,4);s.box(t,2.5,e,2.2,.18,1.6,i,it.wood),s.blob(t,2.85,e,.5,.25,.4,bt("#c9a35a",.2,n),it.plain,1)}function wl(s,t,e,n,i,o,r,a){const l=bt(ge.stone,.12,o),c=bt(ge.stoneDark,.12,o),h=r?44:26,f=r?30:18,u=r?3:2;s.at(t,e,n,i,a);let d=-1.5;for(let x=0;x<u;x++){const y=1-x*.14,w=(r?1.6:1.2)+(x===0?1.5:0);s.box(0,d,0,h*y,w,f*y,x%2?c:l,it.stone),d+=w}const v=1-(u-1)*.14,g=h*v/2,p=f*v/2,m=r?2.2:1.5;s.box(0,d,-p+.8,h*v,m,1.6,c,it.stone),s.box(0,d,p-.8,h*v,m,1.6,c,it.stone),s.box(-g+.8,d,0,1.6,m,f*v,c,it.stone),s.done(),s.at(t,e+d*a,n,i,a),Qm(s,-g*.55,0,r?11:7.5,o);const _=r?7:4;for(let x=0;x<_;x++){const y=(x/(_-1)-.5)*1.6;bc(s,-g*.55+Math.cos(y)*(r?8:5),Math.sin(y)*(r?8:5),r?4.2:3.2,o)}return tg(s,g*.15,0,o),s.done(),s.at(t+Math.cos(i)*g*.45*a-Math.sin(i)*p*.35*a,e+d*a,n+Math.sin(i)*g*.45*a+Math.cos(i)*p*.35*a,i,a),eo(s,o,r?8:6,r?5:4,r?6:4.5,!1),s.done(),d}function Ec(s,t,e=8){const n=bt(ge.koa,.2,t),i=bt("#4a2c18",.2,t),o=e/2;s.box(0,0,0,e*.8,.55,.62,n,it.wood,0,.9),s.box(o*.85,.05,0,e*.2,.6,.4,i,it.wood,0,.5),s.box(-o*.85,.05,0,e*.2,.55,.4,i,it.wood,0,.5);const r=-2.4;for(const a of[-e*.15,e*.15])s.cyl([a,.55,0],[a,.5,r],.06,.06,i,it.wood,4);s.box(0,.05,r,e*.5,.28,.24,i,it.wood,0,.8)}function Tc(s,t,e=18){const n=bt(ge.koa,.15,t),i=bt("#4a2c18",.15,t);for(const r of[-2.2,2.2])s.box(0,0,r,e*.82,1,1,n,it.wood,0,.88),s.box(e*.45,.2,r,e*.14,1.2,.6,i,it.wood,0,.5),s.box(-e*.45,.2,r,e*.14,1.1,.6,i,it.wood,0,.5);s.box(0,1,0,e*.42,.2,5.2,i,it.wood),s.box(-e*.08,1.2,0,3.2,1.4,2.4,bt(ge.thatch,.1,t),it.thatch,0,.7);const o=bt("#c9ac78",.08,t);s.cyl([e*.1,1.1,0],[e*.05,9.5,0],.12,.08,i,it.wood,4),s.quad([e*.12,1.4,.05],[e*.36,8.8,.05],[e*.02,10.8,.05],[e*.05,4,.05],o,it.plain),s.quad([e*.05,4,-.05],[e*.02,10.8,-.05],[e*.36,8.8,-.05],[e*.12,1.4,-.05],o,it.plain)}function eg(s,t,e=16,n=6){const i=bt(ge.thatch,.15,t),o=bt(ge.thatchDark,.15,t),r=bt(ge.wood,.2,t),a=4.8,l=e/2,c=n/2+.3;s.quad([-l,.3,-c],[-l,a,0],[l,a,0],[l,.3,-c],i,it.thatch),s.quad([l,.3,c],[l,a,0],[-l,a,0],[-l,.3,c],i,it.thatch),s.quad([l,.3,-c],[l,a,0],[-l,a,0],[-l,.3,-c],o,it.thatch),s.quad([-l,.3,c],[-l,a,0],[l,a,0],[l,.3,c],o,it.thatch),s.tri([-l,.3,c],[-l,.3,-c],[-l,a,0],o,it.thatch),s.tri([-l,.3,-c],[-l,.3,c],[-l,a,0],i,it.thatch),s.box(0,a-.1,0,e+.4,.3,.45,o,it.thatch),s.cyl([l,0,0],[l,a,0],.15,.12,r,it.wood,5)}function ng(s,t,e=!0){const n=bt(ge.stone,.2,t);for(let i=0;i<9;i++){const o=t()*Math.PI*2,r=1.4*(1-i/10);s.blob(Math.cos(o)*r*.5,i*.28,Math.sin(o)*r*.5,.75,.45,.7,n,it.stone,i+t())}if(s.box(0,2.3,0,1.6,.25,1.3,bt("#5d5650",.1,t),it.stone),e){const i=bt("#3b2a1e",.2,t);s.box(0,2.55,0,1,.75,.6,i,it.wood,0,.8),s.box(.65,2.7,0,.5,.35,.35,i,it.wood,0,.7),s.box(-.2,3.25,-.2,.15,.3,.12,i,it.wood),s.box(-.2,3.25,.2,.15,.3,.12,i,it.wood)}}function ig(s,t,e=7){const n=bt(ge.wood,.1,t),i=bt(ge.kapa,.04,t);s.cyl([0,0,0],[0,e,0],.09,.07,n,it.wood,5),s.cyl([0,e*.82,-1.6],[0,e*.82,1.6],.06,.06,n,it.wood,4),s.quad([.02,e*.82,-1.5],[.02,e*.82,1.5],[.02,e*.3,1.3],[.02,e*.3,-1.3],i,it.kapa),s.quad([-.02,e*.3,-1.3],[-.02,e*.3,1.3],[-.02,e*.82,1.5],[-.02,e*.82,-1.5],i,it.kapa),s.box(0,e*.85,-1.55,.1,-1.6,.1,bt("#e2b13c",.1,t),it.plain),s.box(0,e*.85,1.55,.1,-1.6,.1,bt("#e2b13c",.1,t),it.plain),s.blob(0,e+.2,0,.35,.45,.35,bt("#3d2c1f",.1,t),it.wood,2)}function sg(s,t){const e=bt(ge.stone,.2,t);s.box(0,-.3,0,3.2,.8,2.4,e,it.stone,0,.85);for(let n=0;n<5;n++)s.blob((t()-.5)*1.4,.7+n*.25,(t()-.5)*1,.45,.3,.4,e,it.stone,n);s.blob(0,2,0,.45,.35,.45,bt("#f3efe6",.05,t),it.kapa,3)}function og(s,t){const e=bt("#4d4642",.2,t);for(let n=0;n<7;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,it.stone,n)}const ag=`
${ze}
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
`,rg=`
${ze}
${kn}
${rn}
${zn}
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
`;class lg{constructor(t,e,n){this.group=new an;const i=[],o=[],r=[],a=new ke,l=bt("#5f8a3a",.15,Math.random),c=bt("#7a7a45",.1,Math.random),h=.06;for(const u of t.loi){for(const v of u.paddies){const g=(v.level+h)*Nt,p=v.quad;for(const _ of[0,1,2,0,2,3])i.push(p[_][0],g,p[_][1]),o.push(v.age),r.push(v.flood);const m=[...p,p[0]].map(_=>[_[0],g,_[1]]);a.wall(m,.011,.007,Math.random()<.8?l:c,it.plain,.6)}const d=u.auwai;for(let v=0;v<d.length-1;v++){const g=d[v],p=d[v+1],m=p[0]-g[0],_=p[1]-g[1],x=Math.hypot(m,_)||1;if(x>1.2)continue;const y=-_/x*.012,w=m/x*.012,M=Math.max(e.heightAt(g[0],g[1]),g[2]*Nt)+.002,E=Math.max(e.heightAt(p[0],p[1]),p[2]*Nt)+.002,P=[[g[0]-y,M,g[1]-w],[p[0]-y,E,p[1]-w],[p[0]+y,E,p[1]+w],[g[0]+y,M,g[1]+w]];for(const S of[0,1,2,0,2,3])i.push(...P[S]),o.push(0),r.push(0)}}const f=new Ce;f.setAttribute("position",new re(i,3)),f.setAttribute("aAge",new re(o,1)),f.setAttribute("aFlood",new re(r,1)),f.computeBoundingSphere(),this.material=new _e({vertexShader:ag,fragmentShader:rg,uniforms:{...n.uniforms},side:Ye,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),this.paddies=new ne(f,this.material),this.group.add(this.paddies),this.banksGeometry=a.geometry()}}const Sl={noa:[7,4.6,5.2],mua:[8,5,5.6],aina:[6,4.2,4.6],kuku:[5,3.6,4],alii:[12,7,7.5]};class cg{constructor(t){const{terrain:e,shared:n}=t,i=t.island.meta,o=i.sites;this.app=t,this.meta=i,this.sites=o,this.group=new an;const r=ys(i.seed+77),a=new ke,l=(c,h)=>Math.max(e.heightAt(c,h),0);for(const c of o.houses){const[h,f,u]=Sl[c.kind]||Sl.noa,d=c.scale||1;a.at(c.x,l(c.x,c.z),c.z,c.rot),eo(a,r,h*d,f*d,u*d),a.done()}for(const c of o.villages){const h=r()*Math.PI*2,f=c.x+Math.cos(h)*.35,u=c.z+Math.sin(h)*.35;a.at(f,l(f,u),u,0),og(a,r),a.done()}for(const c of o.heiau)wl(a,c.x,l(c.x,c.z),c.z,c.rot,r,c.kind==="luakini",Ue);this.beaches=[];for(const c of o.canoes){const h=c.dir,f=h+Math.PI/2;for(let u=0;u<c.n;u++){const d=(u-(c.n-1)/2)*.09,v=c.x+Math.cos(f)*d,g=c.z+Math.sin(f)*d;a.at(v,l(v,g)+.002,g,h),Ec(a,r,7+r()*4),a.done()}if(c.house){const u=c.x-Math.cos(h)*.32,d=c.z-Math.sin(h)*.32;a.at(u,l(u,d),d,h),eg(a,r),a.done()}this.beaches.push(c)}if(o.alii){const c=o.canoes.find(h=>h.village===o.alii.id);if(c){const h=c.dir+Math.PI/2,f=c.x+Math.cos(h)*.45,u=c.z+Math.sin(h)*.45;a.at(f,l(f,u)+.002,u,c.dir),Tc(a,r),a.done()}}for(const c of o.koa)a.at(c.x,l(c.x,c.z),c.z,r()*6),sg(a,r),a.done();for(const c of i.ahu)a.at(c.x,l(c.x,c.z),c.z,r()*6),ng(a,r,!0),a.done();this.ponds=o.ponds,this.pondMask(t);for(const c of o.ponds)this.buildPond(a,c,r);o.puuhonua&&this.buildPuuhonua(a,o.puuhonua,r),o.holua&&this.buildHolua(a,o.holua,r);for(const c of o.saltpans)this.buildSalt(a,c,r);this.material=us(n,{fade:[70,110]}),this.structures=new ne(a.geometry(),this.material),this.structures.frustumCulled=!1,this.group.add(this.structures),this.loi=new lg(o,e,n),this.group.add(this.loi.group),this.banks=new ne(this.loi.banksGeometry,this.material),this.banks.frustumCulled=!1,this.group.add(this.banks)}pondMask(t){const e=te,n=t.seaData,i=Kt/e;for(const o of this.ponds){const r=o.wall,a=r.map(d=>d[0]),l=r.map(d=>d[1]),c=Math.max(0,Math.floor((Math.min(...a)+vt)/i)),h=Math.min(e-1,Math.ceil((Math.max(...a)+vt)/i)),f=Math.max(0,Math.floor((Math.min(...l)+vt)/i)),u=Math.min(e-1,Math.ceil((Math.max(...l)+vt)/i));for(let d=f;d<=u;d++)for(let v=c;v<=h;v++){const g=-vt+(v+.5)*i,p=-vt+(d+.5)*i;hg(r,g,p)&&(n[(d*e+v)*4]=255)}}t.seaTex.needsUpdate=!0}buildPond(t,e,n){const i=bt("#8a817a",.12,n),o=e.wall,r=o.length;let a=[];const l=()=>{a.length>1&&t.wall(a,.1,.024,i,it.stone,.72),a=[]};for(let d=0;d<r;d++){const v=d/(r-1);if(e.gates.some(p=>Math.abs(p-v)<.022)){l();continue}a.push([o[d][0],0,o[d][1]])}l();const c=bt(ge.wood,.15,n);for(const d of e.gates){const v=Math.round(d*(r-1)),g=o[Math.max(0,v-1)],p=o[Math.min(r-1,v+1)],m=Math.atan2(p[1]-g[1],p[0]-g[0]),_=o[v][0],x=o[v][1];t.at(_,0,x,m);for(let y=-3;y<=3;y++)t.box(y*.55,-.4,0,.12,1.9,.12,c,it.wood);t.box(0,1.25,0,4.2,.15,.2,c,it.wood),t.done()}const h=Math.round(e.gates[0]*(r-1)),f=o[h][0]-e.ax*.12,u=o[h][1]-e.az*.12;t.at(f,.004,u,n()*3),eo(t,n,4,3,3.4),t.done()}buildPuuhonua(t,e,n){const{terrain:i}=this.app,o=e.dir,r=Math.cos(o),a=Math.sin(o),l=-a,c=r,h=e.x-r*1.6,f=e.z-a*1.6,u=x=>{for(let y=.3;y<9;y+=.15)if(i.heightAt(h+l*y*x,f+c*y*x)<=.002)return y;return 4},d=u(-1),v=u(1),g=[];for(let x=-d;x<=v;x+=.12){const y=h+l*x,w=f+c*x;g.push([y,Math.max(0,i.heightAt(y,w)),w])}const p=bt(ge.stoneDark,.1,n);t.wall(g,.08,.06,p,it.stone,.8);const m=e.x-r*.5,_=e.z-a*.5;wl(t,m,Math.max(0,i.heightAt(m,_)),_,o,n,!1,Ue);for(let x=0;x<6;x++){const y=(x-2.5)*.12,w=e.x+l*y-r*.05,M=e.z+c*y-a*.05;t.at(w,Math.max(0,i.heightAt(w,M)),M,o),bc(t,0,0,4,n),t.done()}for(let x=0;x<3;x++){const y=h+r*.5+l*(x-1)*.6,w=f+a*.5+c*(x-1)*.6;t.at(y,Math.max(0,i.heightAt(y,w)),w,o+Math.PI/2),eo(t,n,6,4,4.2),t.done()}this.puuhonuaWall={a:g[0],b:g[g.length-1]}}buildHolua(t,e,n){const{terrain:i}=this.app,o=Math.ceil(Math.hypot(e.x1-e.x0,e.z1-e.z0)/.08),r=[];for(let l=0;l<=o;l++){const c=l/o,h=e.x0+(e.x1-e.x0)*c,f=e.z0+(e.z1-e.z0)*c;r.push([h,i.heightAt(h,f)+.004,f])}t.wall(r,.11,.014,bt("#8a817a",.1,n),it.stone,.75);const a=bt("#c2b25e",.1,n);for(let l=0;l<r.length-1;l++){const c=r[l],h=r[l+1],f=h[0]-c[0],u=h[2]-c[2],d=Math.hypot(f,u)||1,v=-u/d*.034,g=f/d*.034,p=c[1]+.0145,m=h[1]+.0145;t.quad([c[0]-v,p,c[2]-g],[c[0]+v,p,c[2]+g],[h[0]+v,m,h[2]+g],[h[0]-v,m,h[2]-g],a,it.plain)}this.holuaPath=r}buildSalt(t,e,n){const{terrain:i}=this.app,o=e.dir+Math.PI/2,r=bt(ge.salt,.06,n),a=bt("#7d5b44",.12,n);for(let l=0;l<4;l++)for(let c=0;c<3;c++){const h=(l-1.5)*.11,f=(c-1)*.09,u=e.x+Math.cos(o)*h-Math.sin(o)*f,d=e.z+Math.sin(o)*h+Math.cos(o)*f,v=Math.max(i.heightAt(u,d),.004);t.at(u,v,d,o),t.box(0,-.3,0,6.6,.5,5.4,a,it.plain),t.box(0,.05,0,5.8,.18,4.6,n()<.7?r:bt("#d9c2b4",.05,n),it.kapa),t.done()}}}function hg(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const r=s[i],a=s[o];r[1]>e!=a[1]>e&&t<(a[0]-r[0])*(e-r[1])/(a[1]-r[1])+r[0]&&(n=!n)}return n}function ug(s){const t=new ke,e=bt("#8a7a62",.1,s),n=14;let i=[0,0,0];const o=.06;for(let h=1;h<=6;h++){const f=h/6*n,u=[o*Math.pow(f,1.5),f,0];t.cyl(i,u,.28-h*.02,.26-h*.025,e,it.wood,6),i=u}const r=i,a=bt("#4c7a2c",.12,s),l=bt("#8f9a43",.1,s);for(let h=0;h<13;h++){const f=h/13*Math.PI*2+s()*.3,u=5.2+s()*1.2,d=1.4+s()*.8,v=Math.cos(f),g=Math.sin(f);let p=r;for(let m=1;m<=5;m++){const _=m/5,x=[r[0]+v*u*_,r[1]+d*_-3.8*_*_,r[2]+g*u*_],y=1*Math.sin(Math.PI*Math.min(1,_*1.1))+.15,w=-g*y,M=v*y,E=m>3?l:a;t.quad([p[0],p[1],p[2]],[x[0],x[1],x[2]],[x[0]+w,x[1]-.35*y,x[2]+M],[p[0]+w*.7,p[1]-.25*y,p[2]+M*.7],E,it.leaf),t.quad([p[0]-w*.7,p[1]-.25*y,p[2]-M*.7],[x[0]-w,x[1]-.35*y,x[2]-M],[x[0],x[1],x[2]],[p[0],p[1],p[2]],E,it.leaf),p=x}}const c=bt("#5c4a24",.1,s);for(let h=0;h<4;h++)t.blob(r[0]+Math.cos(h*1.7)*.4,r[1]-.6,r[2]+Math.sin(h*1.7)*.4,.3,.35,.3,c,it.plain,h);return t.geometry()}function is(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",blobs:o=3,flatten:r=1,red:a=0}){const l=new ke,c=bt(i,.1,s);l.cyl([0,0,0],[.3,t,.1],.35,.22,c,it.wood,5);for(let h=0;h<o;h++){const f=h/o*Math.PI*2+s(),u=h===0?0:e*.45,d=bt(n,.18,s);l.blob(.3+Math.cos(f)*u,t+e*.35*r+(h===0?e*.2:0),.1+Math.sin(f)*u,e*(h===0?1:.75),e*.62*r,e*(h===0?1:.75),d,it.leaf,h+s())}if(a>0){const h=bt("#9e2a22",.15,s);for(let f=0;f<a;f++){const u=s()*Math.PI*2,d=s()*.8;l.blob(.3+Math.cos(u)*e*.8,t+e*(.35+d*.45),.1+Math.sin(u)*e*.8,.7,.35,.7,h,it.leaf,f)}}return l.geometry()}function fg(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",flatten:o=1}){const r=new ke;return r.cyl([0,0,0],[.3,t,.1],.4,.25,bt(i,.1,s),it.wood,3),r.blob(.3,t+e*.42*o,.1,e*1.18,e*.7*o,e*1.18,bt(n,.12,s),it.leaf,1,!0,0),r.geometry()}function dg(s,t){const e=new ke;return e.blob(0,.55,0,1.3,.8,1.3,bt(t,.15,s),it.leaf,1,!0,0),e.geometry()}function pg(s){const t=new ke,e=bt("#6b5a45",.1,s),n=bt("#4f7036",.12,s);for(let i=0;i<4;i++){const o=i/4*Math.PI*2;t.cyl([Math.cos(o)*1.1,0,Math.sin(o)*1.1],[0,1.4,0],.08,.1,e,it.wood,4)}t.cyl([0,1.2,0],[0,3.6,0],.22,.18,e,it.wood,5);for(let i=0;i<3;i++){const o=i/3*Math.PI*2+.4,r=[Math.cos(o)*1.8,5.2,Math.sin(o)*1.8];t.cyl([0,3.5,0],r,.14,.1,e,it.wood,4);for(let a=0;a<9;a++){const l=a/9*Math.PI*2,c=Math.cos(l),h=Math.sin(l),f=[r[0]+c*1.7,r[1]+.5-Math.abs(Math.sin(l))*.9,r[2]+h*1.7];t.tri([r[0]-h*.14,r[1],r[2]+c*.14],[r[0]+h*.14,r[1],r[2]-c*.14],f,n,it.leaf)}}return t.geometry()}function mg(s){const t=new ke,e=bt("#7c9a4a",.1,s),n=bt("#6aa538",.12,s);for(let i=0;i<4;i++){const o=s()*Math.PI*2,r=s()*.6,a=Math.cos(o)*r,l=Math.sin(o)*r,c=2.4+s()*1.4;t.cyl([a,0,l],[a,c,l],.16,.12,e,it.leaf,5);for(let h=0;h<4;h++){const f=s()*Math.PI*2,u=Math.cos(f),d=Math.sin(f),v=[a,c,l],g=[a+u*1.6,c+.7,l+d*1.6],p=[a+u*2.6,c-.2,l+d*2.6],m=-d*.45,_=u*.45;t.quad(v,[g[0]+m,g[1],g[2]+_],[p[0]+m*.6,p[1],p[2]+_*.6],p,n,it.leaf),t.quad(v,p,[p[0]-m*.6,p[1],p[2]-_*.6],[g[0]-m,g[1],g[2]-_],n,it.leaf)}}return t.geometry()}function bl(s,t){const e=new ke,n=bt("#6b5a40",.1,s),i=bt(t?"#7d2b2f":"#3f7d32",.15,s);e.cyl([0,0,0],[.05,1.6,0],.05,.04,n,it.wood,4);for(let o=0;o<9;o++){const r=o/9*Math.PI*2,a=Math.cos(r),l=Math.sin(r),c=.3+o%3*.25;e.quad([.05-l*.06,1.6,a*.06],[.05+l*.06,1.6,-a*.06],[.05+a*.9+l*.12,1.6+c,l*.9-a*.12],[.05+a*.9-l*.12,1.6+c,l*.9+a*.12],i,it.leaf)}return e.geometry()}function El(s,t){const e=new ke;for(let n=0;n<3;n++)e.blob((s()-.5)*1.2,.5,(s()-.5)*1.2,.9,.7,.9,bt(t,.2,s),it.leaf,n);return e.geometry()}const Tl=["niu","hala","ulu","kukui","maia","ki","kiRed","ohia","koa","wiliwili","naupaka","aalii"],ss=["ohia","koa","kukui","wiliwili","aalii"],Te=2,na=13.5,os=[3.6,4.6];class gg{constructor(t){this.app=t;const e=ys(t.island.meta.seed+5150);this.geoms={niu:ug(e),hala:pg(e),ulu:is(e,{trunkH:5,crownR:4.2,color:"#2f5a26",blobs:3}),kukui:is(e,{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468",blobs:5}),maia:mg(e),ki:bl(e,!1),kiRed:bl(e,!0),ohia:is(e,{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038",blobs:5,red:3}),koa:is(e,{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",blobs:5,flatten:.7}),wiliwili:is(e,{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",blobs:3,flatten:.8}),naupaka:El(e,"#5f8a42"),aalii:El(e,"#8b7c4a")};const n={ohia:{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038"},koa:{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",flatten:.7},kukui:{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468"},wiliwili:{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",flatten:.8}};this.farGeoms={...Object.fromEntries(Object.entries(n).map(([i,o])=>[i,fg(e,o)])),aalii:dg(e,"#8b7c4a")},this.fixedMat=us(t.shared,{fade:[34,48],close:.3,sway:1,doubleSide:!0}),this.forestMat=us(t.shared,{fade:[os[0],os[1]],close:.3,sway:1}),this.forestFarMat=us(t.shared,{fade:[na-3.5,na],fadeIn:os,sway:1}),this.group=new an,this.land=t.landTex.image.data,this.cleared=this.clearings(),this.fixed=this.placeFixed(e),this.meshes={};for(const i of Tl){const o=this.fixed[i];if(!o.length)continue;const r=new hs(this.geoms[i],this.fixedMat,o.length);this.writeInstances(r,o),r.frustumCulled=!1,this.group.add(r),this.meshes[i]=r}this.forest={near:{},far:{}};for(const i of ss)this.forest.near[i]=this.forestMesh(this.geoms[i],this.forestMat,2500),this.forest.far[i]=this.forestMesh(this.farGeoms[i],this.forestFarMat,9e3);this.tiles=new Map,this.frustum=new xs,this.projView=new Zt,this.box=new _n,this.wanted=[],this.lastSelection=""}forestMesh(t,e,n){const i=new hs(t,e,n);return i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(Fi),i.instanceColor=new Xn(new Float32Array(n*3),3),i.instanceColor.setUsage(Fi),this.group.add(i),i}clearings(){const t=te,e=new Uint8Array(t*t),n=Kt/t,i=(r,a,l)=>{const c=Math.max(0,Math.floor((r-l+vt)/n)),h=Math.min(t-1,Math.floor((r+l+vt)/n)),f=Math.max(0,Math.floor((a-l+vt)/n)),u=Math.min(t-1,Math.floor((a+l+vt)/n));for(let d=f;d<=u;d++)for(let v=c;v<=h;v++)e[d*t+v]=1},o=this.app.island.meta.sites;for(const r of o.loi)for(const a of r.paddies)for(const l of a.quad)i(l[0],l[1],.05);for(const r of o.houses)i(r.x,r.z,.12);for(const r of o.heiau)i(r.x,r.z,.5);for(const r of o.villages)i(r.x,r.z,.3);for(const r of this.app.island.meta.ahu)i(r.x,r.z,.3);for(const r of o.koa)i(r.x,r.z,.15);return e}isCleared(t,e){const n=te,i=Math.floor((t+vt)/Kt*n),o=Math.floor((e+vt)/Kt*n);return i>=0&&o>=0&&i<n&&o<n&&this.cleared[o*n+i]===1}landAt(t,e){const n=te,i=Math.floor((t+vt)/Kt*n),o=Math.floor((e+vt)/Kt*n);if(i<0||o<0||i>=n||o>=n)return null;const r=(o*n+i)*4,a=this.land;return{rain:a[r]/255,sand:a[r+1]/255,rip:a[r+2]/255,field:a[r+3]/255}}writeInstances(t,e){const n=new Zt,i=new Yn,o=new z,r=new z,a=new Lt,l=new z(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];o.set(h.x,h.y,h.z),i.setFromAxisAngle(l,h.rot),r.setScalar(h.s),n.compose(o,i,r),t.setMatrixAt(c,n),a.setRGB(h.c,h.c*(.96+.08*((h.x*997+h.z*131)%1+1)%1),h.c),t.setColorAt(c,a)}t.count=e.length,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}placeFixed(t){const{terrain:e}=this.app,n=this.app.island.meta.sites,i=Object.fromEntries(Tl.map(c=>[c,[]])),o=n.houses,r=(c,h,f)=>!o.some(u=>Math.abs(u.x-c)<f&&Math.abs(u.z-h)<f&&Math.hypot(u.x-c,u.z-h)<f),a=(c,h,f,u=1)=>{const d=e.heightAt(h,f);return d<=.003?!1:(i[c].push({x:h,y:d,z:f,rot:t()*Math.PI*2,s:Ue*u*(.8+t()*.45),c:.85+t()*.3}),!0)};for(const c of n.villages){const h=c.alii?26:c.model?20:12;for(let f=0;f<h;f++){const u=t()*Math.PI*2,d=.12+t()*.7,v=c.x+Math.cos(u)*d,g=c.z+Math.sin(u)*d;if(!r(v,g,.09))continue;const p=this.landAt(v,g),m=p&&p.sand>.3||t()<.3?"niu":t()<.4?"ulu":t()<.5?"kukui":"maia";a(m,v,g)}for(let f=0;f<(c.model?24:10);f++){const u=o[Math.floor(t()*o.length)];if(u.village!==c.id)continue;const d=t()*Math.PI*2;a(t()<.75?"ki":"kiRed",u.x+Math.cos(d)*.08,u.z+Math.sin(d)*.08,.9)}}const l=this.app.island.meta.trail;for(let c=0;c<l.length;c++){const h=l[c];for(let f=0;f<3;f++){const u=h[0]+(t()-.5)*2.6,d=h[1]+(t()-.5)*2.6,v=this.landAt(u,d);if(!v)continue;const g=e.heightAt(u,d);g<=.003||g>.4||(v.sand>.4&&t()<.5?a("naupaka",u,d,.8):v.rain>.42&&t()<.5?a("hala",u,d):t()<.45?a("niu",u,d):v.rain<.3&&t()<.5&&a("aalii",u,d,.8))}}for(const c of n.loi)for(let h=0;h<c.paddies.length;h+=2){const f=c.paddies[h].quad,u=(f[2][0]+f[3][0])/2,d=(f[2][1]+f[3][1])/2,v=f[3][0]-f[0][0],g=f[3][1]-f[0][1],p=Math.hypot(v,g)||1,m=u+v/p*.06,_=d+g/p*.06,x=t();x<.3?a("maia",m,_):x<.5?a("kukui",m+v/p*.1,_+g/p*.1):x<.75&&a(t()<.8?"ki":"kiRed",m,_,.9)}return i}buildTile(t,e){const{terrain:n}=this.app,i=Math.round(Te/.17),o=Te/i,r=Object.fromEntries(ss.map(v=>[v,[]]));let a=1/0,l=-1/0;for(let v=0;v<i;v++)for(let g=0;g<i;g++){const p=t*i+v,m=e*i+g,_=Tn(p,m,11),x=Tn(p,m,12),y=(p+_)*o,w=(m+x)*o,M=this.landAt(y,w);if(!M||M.sand>.2||M.field>.3||this.isCleared(y,w))continue;const E=n.metresAt(y,w);if(E<3)continue;const P=M.rain+(Tn(p,m,3)-.5)*.12,S=Math.min(1,Math.max(0,(P-.3)/.22)),b=Tn(p,m,13);let F=null;if(b<S*.85?M.rip>.4&&E<450&&b<.5?F="kukui":E>600&&P>.45?F=Tn(p,m,7)<.7?"ohia":"koa":E>350?F=Tn(p,m,8)<.55?"koa":"ohia":F=P>.5?"ohia":"kukui":P<.3&&b<.08&&(F=E<500&&Tn(p,m,9)<.5?"wiliwili":"aalii"),!F||n.normalAt(y,w).y<.35&&Tn(p,m,5)<.7)continue;const W=n.heightAt(y,w);r[F].push(y,W,w,_*6.28,Ue*(.75+x*.6)*(F==="aalii"?.8:1),.82+b*.35,Tn(p,m,14)),a=Math.min(a,W),l=Math.max(l,W)}const c={};let h=0;for(const v of ss){const g=r[v],p=g.length/7,m=new Float32Array(p*16),_=new Float32Array(p*3);for(let x=0;x<p;x++){const[y,w,M,E,P,S,b]=g.slice(x*7,x*7+7),F=Math.cos(E)*P,W=Math.sin(E)*P;m.set([F,0,-W,0,0,P,0,0,W,0,F,0,y,w,M,1],x*16),_.set([S,S*(.96+.08*b),S],x*3)}c[v]={mat:m,col:_,n:p},h+=p}const f=t*Te,u=e*Te,d=h?new _n(new z(f-.2,a,u-.2),new z(f+Te+.2,l+.3,u+Te+.2)):null;return{data:c,box:d,total:h}}update(t){const e=t.position,n=Math.max(0,this.app.terrain.heightAt(e.x,e.z)),i=e.y-n,o=i<14;for(const g in this.meshes)this.meshes[g].visible=i<60;this.group.visible=i<60;for(const g of ss)this.forest.near[g].visible=o,this.forest.far[g].visible=o;if(!o)return;t.updateMatrixWorld(),this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const r=na,a=Math.floor((e.x-r)/Te),l=Math.floor((e.x+r)/Te),c=Math.floor((e.z-r)/Te),h=Math.floor((e.z+r)/Te),f=[],u=[],d=[];let v="";for(let g=a;g<=l;g++)for(let p=c;p<=h;p++){const m=g*Te,_=p*Te,x=Math.max(m-e.x,0,e.x-m-Te),y=Math.max(_-e.z,0,e.z-_-Te),w=Math.hypot(x,y);if(w>r)continue;const M=g*8192+p,E=this.tiles.get(M);if(!E){d.push([w,g,p]);continue}if(!E.box||!this.frustum.intersectsBox(E.box))continue;const P=Math.hypot(Math.max(Math.abs(m-e.x),Math.abs(m+Te-e.x)),Math.max(Math.abs(_-e.z),Math.abs(_+Te-e.z))),S=w<os[1]+.3,b=P>os[0]-.3;S&&f.push(E),b&&u.push(E),v+=`${M}${S?"n":""}${b?"f":""},`}d.sort((g,p)=>g[0]-p[0]);for(let g=0;g<Math.min(d.length,10);g++){const[,p,m]=d[g];this.tiles.set(p*8192+m,this.buildTile(p,m))}if(this.tiles.size>3e3)for(const[g,p]of this.tiles){const m=Math.floor(g/8192+.5),_=g-m*8192;Math.hypot((m+.5)*Te-e.x,(_+.5)*Te-e.z)>r*3&&this.tiles.delete(g)}v!==this.lastSelection&&(this.lastSelection=v,this.fill(this.forest.near,f),this.fill(this.forest.far,u))}fill(t,e){for(const n of ss){const i=t[n],o=i.instanceMatrix.count,r=i.instanceMatrix,a=i.instanceColor;let l=0;for(const c of e){const h=c.data[n];if(!h.n)continue;const f=Math.min(h.n,o-l);if(f<=0)break;r.array.set(f===h.n?h.mat:h.mat.subarray(0,f*16),l*16),a.array.set(f===h.n?h.col:h.col.subarray(0,f*3),l*3),l+=f}i.count=l,l&&(r.clearUpdateRanges(),r.addUpdateRange(0,l*16),r.needsUpdate=!0,a.clearUpdateRanges(),a.addUpdateRange(0,l*3),a.needsUpdate=!0)}}}function Al(s,t){const e=new ke,n=bt("#7a4b30",.1,t),i=bt("#b08a5a",.15,t);return s==="stand"?(e.box(-.12,0,0,.16,.85,.18,n,it.skin,0,.8),e.box(.12,0,0,.16,.85,.18,n,it.skin,0,.8),e.box(0,.78,0,.42,.32,.26,i,it.plain),e.box(0,1.05,0,.44,.5,.24,n,it.skin,0,.85),e.box(-.3,.88,0,.11,.62,.12,n,it.skin),e.box(.3,.88,0,.11,.62,.12,n,it.skin),e.blob(0,1.68,0,.13,.15,.13,bt("#3a2418",.1,t),it.skin,1,!1)):s==="bend"?(e.box(-.12,0,0,.16,.8,.18,n,it.skin,0,.8),e.box(.12,0,0,.16,.8,.18,n,it.skin,0,.8),e.box(0,.72,.05,.42,.3,.3,i,it.plain),e.hexa([[-.22,.75,.05],[.22,.75,.05],[.2,.8,.62],[-.2,.8,.62]],[[-.22,.95,.05],[.22,.95,.05],[.2,1.05,.62],[-.2,1.05,.62]],n,it.skin),e.box(0,.78,.62,.4,.27,.1,n,it.skin),e.box(-.24,.35,.6,.1,.5,.1,n,it.skin),e.box(.24,.35,.6,.1,.5,.1,n,it.skin),e.blob(0,1.02,.8,.13,.14,.14,bt("#3a2418",.1,t),it.skin,2,!1)):(e.box(0,0,0,.6,.2,.42,i,it.plain),e.box(0,.18,0,.42,.55,.24,n,it.skin,0,.85),e.box(-.28,.2,.08,.1,.45,.1,n,it.skin),e.box(.28,.2,.08,.1,.45,.1,n,it.skin),e.blob(0,.86,0,.13,.15,.13,bt("#3a2418",.1,t),it.skin,3,!1)),e.geometry()}function vg(s){const t=new ke;return t.box(0,0,0,4.6,.12,.6,bt("#6b4630",.1,s),it.wood,0,.85),t.geometry()}function xg(s){const t=new ke,e=bt("#1d1d22",.1,s),n=[[[0,0,.6],[-1.1,.25,-.1],[0,0,-.3]],[[0,0,.6],[0,0,-.3],[1.1,.25,-.1]],[[-1.1,.25,-.1],[-2,-.1,-.5],[-.6,.15,-.25]],[[1.1,.25,-.1],[.6,.15,-.25],[2,-.1,-.5]],[[0,0,-.3],[-.25,0,-1],[.25,0,-1]]];for(const[i,o,r]of n)t.tri(i,o,r,e,it.plain),t.tri(i,r,o,e,it.plain);return t.geometry()}const _g=`
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
`,Mg=`
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
`;class yg{constructor(t){this.app=t,this._m=new Zt,this._q=new Yn,this._p=new z,this._s=new z,this._e=new Hi,this._c=new Lt;const e=t.island.meta,n=e.sites,i=ys(e.seed+2024);this.rand=i,this.group=new an,this.mat=us(t.shared,{fade:[24,34]});const o=t.terrain,r=(w,M)=>Math.max(0,o.heightAt(w,M));this.people={stand:[],bend:[],sit:[]};const a=(w,M,E,P,S=null,b=1)=>this.people[w].push({x:M,z:E,y:S??r(M,E),rot:P,ph:i()*6.28,tint:b});for(const w of n.loi){const M=w.model?16:5;for(let E=0;E<M;E++){const P=w.paddies[Math.floor(i()*w.paddies.length)];if(!P.flood)continue;const S=P.quad,b=.2+i()*.6,F=.2+i()*.6,W=S[0][0]+(S[1][0]-S[0][0])*b+(S[3][0]-S[0][0])*F,X=S[0][1]+(S[1][1]-S[0][1])*b+(S[3][1]-S[0][1])*F;a("bend",W,X,i()*6.28,(P.level-.25)*.013)}}for(const w of n.villages){const M=w.model?12:w.alii?14:4;for(let E=0;E<M;E++){const P=i()*6.28,S=.04+i()*.25;a(i()<.5?"sit":"stand",w.x+Math.cos(P)*S,w.z+Math.sin(P)*S,i()*6.28)}}for(const w of n.heiau.filter(M=>M.model||M.kind==="luakini"))for(let M=0;M<3;M++)a("stand",w.x+(i()-.5)*.12,w.z+(i()-.5)*.08,w.rot+Math.PI,r(w.x,w.z)+.07,2.4);for(const w of n.canoes)for(let M=0;M<(w.village===n.model?5:2);M++)a("stand",w.x+(i()-.5)*.2,w.z+(i()-.5)*.2,w.dir+Math.PI+(i()-.5));for(const w of n.ponds){const M=w.wall[Math.round(w.gates[0]*(w.wall.length-1))];a("stand",M[0]-w.ax*.02,M[1]-w.az*.02,Math.atan2(w.az,w.ax),.02)}this.poseMeshes={};for(const w of["stand","bend","sit"]){const M=this.people[w],E=Math.max(1,M.length+(w==="stand"?40:0)),P=new hs(Al(w,i),this.mat,E);P.instanceColor=new Xn(new Float32Array(E*3).fill(1),3),P.frustumCulled=!1,P.instanceMatrix.setUsage(Fi),this.group.add(P),this.poseMeshes[w]=P}this.writeStatic(),this.trail=e.trail.slice();let l=0;for(let w=0;w<this.trail.length;w++){const M=this.trail[w],E=this.trail[(w+1)%this.trail.length];l+=M[0]*E[1]-E[0]*M[1]}l<0&&this.trail.reverse(),this.trailLen=[0];for(let w=1;w<=this.trail.length;w++){const M=this.trail[w-1],E=this.trail[w%this.trail.length];this.trailLen.push(this.trailLen[w-1]+Math.hypot(E[0]-M[0],E[1]-M[1]))}const c=n.alii||n.villages[0];let h=0,f=1/0;for(let w=0;w<this.trail.length;w++){const M=Math.hypot(this.trail[w][0]-c.x,this.trail[w][1]-c.z);M<f&&(f=M,h=this.trailLen[w])}this.procS=h-.6;const u=new ke;ig(u,i),this.akua=new ne(u.geometry(),this.mat),this.akua.frustumCulled=!1,this.group.add(this.akua),this.boats=[];const d=(()=>{const w=new ke;return Ec(w,i,8),w.geometry()})(),v=Al("sit",i),g=e.ahupuaa.find(w=>w.id===n.model);for(let w=0;w<4;w++){const M=n.canoes[w%n.canoes.length],E=w<3&&g?g.mouth:[M.x,M.z],P=w<3?Math.atan2(g.mouth[1]-g.topZ,g.mouth[0]-g.topX):M.dir,S=5+i()*5,b=E[0]+Math.cos(P)*S+(i()-.5)*3,F=E[1]+Math.sin(P)*S+(i()-.5)*3;if(o.heightAt(b,F)>-.02)continue;const W=new an,X=new ne(d,this.mat);X.scale.setScalar(Ue),W.add(X);for(const T of[-1.6,1.4]){const D=new ne(v,this.mat);D.scale.setScalar(Ue),D.position.set(T*Ue,.45*Ue,0),D.rotation.y=Math.PI/2,W.add(D)}W.position.set(b,0,F),W.rotation.y=i()*6.28,this.group.add(W),this.boats.push({g:W,x:b,z:F,ph:i()*6.28,drift:i()*6.28,crew:2})}const p=new ke;Tc(p,i),this.voyager=new ne(p.geometry(),this.mat),this.voyager.scale.setScalar(Ue),this.voyager.frustumCulled=!1,this.group.add(this.voyager),this.voyagerS=0,this.surfers=[];const m=vg(i);this.boards=new hs(m,this.mat,24),this.boards.frustumCulled=!1,this.boards.instanceMatrix.setUsage(Fi),this.group.add(this.boards);for(const w of n.surf)for(let M=0;M<4;M++)this.surfers.push({s:w,ph:i(),lane:(i()-.5)*.5});this.birds=new hs(xg(i),this.mat,12),this.birds.frustumCulled=!1,this.birds.instanceMatrix.setUsage(Fi),this.group.add(this.birds),this.birdCentres=[];for(let w=0;w<12;w++){const M=n.villages[Math.floor(i()*n.villages.length)];this.birdCentres.push({x:M.x+(i()-.5)*6,z:M.z+(i()-.5)*6,r:.6+i()*1.4,h:.9+i()*1.4,ph:i()*6.28,sp:.08+i()*.06})}const _=[],x=[];for(const w of n.villages)for(let M=0;M<14;M++)_.push(w.x+.05,r(w.x,w.z)+.01,w.z+.05),x.push(M/14+i()*.05);const y=new Ce;y.setAttribute("position",new re(_,3)),y.setAttribute("aSeed",new re(x,1)),y.setAttribute("aAge",new re(new Float32Array(x.length),1)),this.smoke=new dc(y,new _e({vertexShader:_g,fragmentShader:Mg,uniforms:{uTime:t.shared.uniforms.uTime,uWindVec:t.shared.uniforms.uWindVec,uSkyColor:t.shared.uniforms.uSkyColor,uSunColor:t.shared.uniforms.uSunColor},transparent:!0,depthWrite:!1})),this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,this.group.add(this.smoke),this._m=new Zt,this._q=new Yn,this._p=new z,this._s=new z,this._e=new Hi,this._c=new Lt}writeStatic(){for(const t in this.people){const e=this.poseMeshes[t],n=this.people[t];for(let i=0;i<n.length;i++)this.setInstance(e,i,n[i].x,n[i].y,n[i].z,n[i].rot,Ue,n[i].tint);e.count=n.length,e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}}setInstance(t,e,n,i,o,r,a,l=1,c=0){this._p.set(n,i,o),this._e.set(c,r,0,"YXZ"),this._q.setFromEuler(this._e),this._s.setScalar(a),this._m.compose(this._p,this._q,this._s),t.setMatrixAt(e,this._m),(l!==1||t.instanceColor)&&t.setColorAt(e,this._c.setRGB(l,l,l))}walkTo(t,e){let n=0,i=1/0;for(let o=0;o<this.trail.length;o++){const r=Math.hypot(this.trail[o][0]-t,this.trail[o][1]-e);r<i&&(i=r,n=this.trailLen[o])}this.procS=n-.12}trailPoint(t){const e=this.trailLen[this.trailLen.length-1];t=(t%e+e)%e;let n=0,i=this.trailLen.length-1;for(;n<i-1;){const l=n+i>>1;this.trailLen[l]<=t?n=l:i=l}const o=this.trail[n%this.trail.length],r=this.trail[(n+1)%this.trail.length],a=(t-this.trailLen[n])/Math.max(1e-6,this.trailLen[n+1]-this.trailLen[n]);return[o[0]+(r[0]-o[0])*a,o[1]+(r[1]-o[1])*a,Math.atan2(r[0]-o[0],r[1]-o[1])]}update(t,e){const n=this.app,i=n.terrain,o=n.camera.position,r=o.y-Math.max(0,i.heightAt(o.x,o.z))<30;if(this.group.visible=r,!r)return;const a=n.season==="hooilo",l=this.poseMeshes.stand;let c=this.people.stand.length;if(this.akua.visible=a,a){this.procS+=t*.0035*Math.max(1,Math.min(8,n.clock.speed/20));for(let d=0;d<11;d++){const[v,g,p]=this.trailPoint(this.procS-d*.035),m=Math.max(0,i.heightAt(v,g))+Math.abs(Math.sin(e*4.2+d))*.0012;this.setInstance(l,c++,v,m,g,p,Ue,d===5?2.2:1),d===5&&(this.akua.position.set(v,m,g),this.akua.rotation.y=p,this.akua.scale.setScalar(Ue))}}let h=0;for(const d of this.surfers){const v=d.s,g=(e*.06+d.ph)%1,p=-Math.sin(v.dir),m=Math.cos(v.dir),_=(g-.5)*.9+d.lane,x=g*.15,y=v.x+p*_-Math.cos(v.dir)*x,w=v.z+m*_-Math.sin(v.dir)*x,M=Math.atan2(p,m)+(d.lane>0?0:Math.PI),E=.002+Math.sin(e*2+d.ph*9)*8e-4;this.setInstance(this.boards,h++,y,E,w,M+Math.PI/2,Ue,1,Math.sin(e*1.3+d.ph)*.06),this.setInstance(l,c++,y,E+.0025,w,M,Ue*.95,1)}this.boards.count=h,this.boards.instanceMatrix.needsUpdate=!0,l.count=c,l.instanceMatrix.needsUpdate=!0,l.instanceColor&&(l.instanceColor.needsUpdate=!0);for(const d of this.boats)d.g.position.x=d.x+Math.sin(e*.05+d.drift)*.6,d.g.position.z=d.z+Math.cos(e*.04+d.drift)*.6,d.g.position.y=Math.sin(e*1.3+d.ph)*.0015,d.g.rotation.z=Math.sin(e*1.1+d.ph)*.04,d.g.rotation.y+=t*.02;this.voyagerS+=t*.004;const f=155,u=this.voyagerS;this.voyager.position.set(Math.cos(u)*f*.95+10,Math.sin(e*.9)*.002,Math.sin(u)*f*.7),this.voyager.rotation.y=-u-Math.PI/2,this.voyager.rotation.x=.06;for(let d=0;d<this.birdCentres.length;d++){const v=this.birdCentres[d],g=v.ph+e*v.sp,p=v.x+Math.cos(g)*v.r,m=v.z+Math.sin(g)*v.r,_=Math.max(0,i.heightAt(p,m))+v.h+Math.sin(e*.3+d)*.1;this.setInstance(this.birds,d,p,_,m,-g,Ue*1.4,1,.3)}this.birds.count=this.birdCentres.length,this.birds.instanceMatrix.needsUpdate=!0}}function Ac(s,t,e,n=1){let i=Float32Array.from(s),o=new Float32Array(t*t);const r=1/(2*e+1);for(let a=0;a<n;a++){for(let l=0;l<t;l++){const c=l*t;let h=0;for(let f=-e;f<=e;f++)h+=i[c+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)o[c+f]=h*r,h+=i[c+Math.min(t-1,f+e+1)]-i[c+Math.max(0,f-e)]}for(let l=0;l<t;l++){let c=0;for(let h=-e;h<=e;h++)c+=o[Math.min(t-1,Math.max(0,h))*t+l];for(let h=0;h<t;h++)i[h*t+l]=c*r,c+=o[Math.min(t-1,h+e+1)*t+l]-o[Math.max(0,h-e)*t+l]}}return i}function Cl(s,t,e,n,i){let o=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let r=1;r<t;r++){let a=(s[r]+r*r-(s[n[o]]+n[o]*n[o]))/(2*r-2*n[o]);for(;a<=i[o];)o--,a=(s[r]+r*r-(s[n[o]]+n[o]*n[o]))/(2*r-2*n[o]);o++,n[o]=r,i[o]=a,i[o+1]=1/0}o=0;for(let r=0;r<t;r++){for(;i[o+1]<r;)o++;const a=r-n[o];e[r]=a*a+s[n[o]]}}function wg(s,t){const n=new Float64Array(s*s);for(let c=0;c<s*s;c++)n[c]=t(c)?0:1e20;const i=new Float64Array(s),o=new Float64Array(s),r=new Int32Array(s),a=new Float64Array(s+1);for(let c=0;c<s;c++){for(let h=0;h<s;h++)i[h]=n[h*s+c];Cl(i,s,o,r,a);for(let h=0;h<s;h++)n[h*s+c]=o[h]}const l=new Float32Array(s*s);for(let c=0;c<s;c++){const h=c*s;for(let f=0;f<s;f++)i[f]=n[h+f];Cl(i,s,o,r,a);for(let f=0;f<s;f++)l[h+f]=Math.sqrt(o[f])}return l}const Sg=[{name:"Koʻolau",gloss:"windward",from:345,to:105},{name:"Puna",gloss:"the sunrise side",from:105,to:165},{name:"Kona",gloss:"leeward",from:165,to:255},{name:"Waialua",gloss:"the northwest side",from:255,to:345}],Rl=[{key:"akua",name:"Wao akua",gloss:"realm of the gods"},{key:"nahele",name:"Wao nahele",gloss:"the forest"},{key:"kanaka",name:"Wao kanaka",gloss:"realm of people"},{key:"kula",name:"Kula",gloss:"open dry plains"},{key:"kahakai",name:"Kahakai",gloss:"the shore"},{key:"kohola",name:"Kai kohola",gloss:"reef shallows"},{key:"uli",name:"Kai uli",gloss:"deep blue sea"}];function bg(s,t,e=!1){for(let n=0;n<t;n++){if(s.length<3)return s;const i=e?[]:[s[0]],o=s.length,r=e?o:o-1;for(let a=0;a<r;a++){const l=s[a],c=s[(a+1)%o];i.push([l[0]*.75+c[0]*.25,l[1]*.75+c[1]*.25]),i.push([l[0]*.25+c[0]*.75,l[1]*.25+c[1]*.75])}e||i.push(s[o-1]),s=i}return s}const Eg=`
${ze}
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
`,Tg=`
${ze}
${kn}
${rn}
${zn}
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
`;function Cc(s,t){const e=new Set,n=.2,i=(u,d)=>Math.floor(u/n)*100003+Math.floor(d/n),o=(u,d)=>{for(let v=-2;v<=2;v++)for(let g=-2;g<=2;g++)if(e.has(i(u+g*n,d+v*n)))return!0;return!1},r=u=>{for(let d=1;d<u.length;d++){const[v,g]=u[d-1],[p,m]=u[d],_=Math.ceil(Math.hypot(p-v,m-g)/(n*.5));for(let x=0;x<=_;x++)e.add(i(v+(p-v)*x/_,g+(m-g)*x/_))}},a=te,l=Kt/a,c=(u,d)=>{const v=Math.floor((u+vt)/l),g=Math.floor((d+vt)/l);let p=0;for(let m=Math.max(0,g-1);m<=Math.min(a-1,g+1);m++)for(let _=Math.max(0,v-1);_<=Math.min(a-1,v+1);_++)p=Math.max(p,t.area[m*a+_]);return p},h=[],f=s.streams.map((u,d)=>({s:u,k:d})).filter(({s:u})=>u.area>=.9&&u.pts.length>=3).sort((u,d)=>d.s.area-u.s.area);for(const{s:u,k:d}of f){let v=u.pts.length;for(let x=0;x<u.pts.length;x++)if(o(u.pts[x][0],u.pts[x][1])){v=x+1;break}if(v<3)continue;let g=u.pts.slice(0,v);r(g),g=bg(g,2);const p=new Float32Array(g.length),m=new Float32Array(g.length);let _=0;for(let x=0;x<g.length;x++)x>0&&(p[x]=p[x-1]+Math.hypot(g[x][0]-g[x-1][0],g[x][1]-g[x-1][1])),_=Math.max(_,c(g[x][0],g[x][1])),m[x]=_;h.push({src:d,pts:g,along:p,area:m,lineA:u.area})}return h}function Ag(s,t){let e=1;for(const n of s){if(t>n.h0&&t<n.h1)return 0;t<=n.h0&&n.r0>0&&(e=Math.min(e,1-Ll(((t-(n.h0-n.r0))/n.r0-.15)/.85))),t>=n.h1&&n.r1>0&&(e=Math.min(e,Ll((t-n.h1)/n.r1/.85)))}return e}const Ll=s=>s<=0?0:s>=1?1:s*s*(3-2*s);function Cg(s,t){const e=[],n=[],i=[],o=[],r=c=>t.some(h=>c>h.h0+1e-6&&c<h.h1-1e-6),a=t.flatMap(c=>[c.h0-c.r0,c.h0-c.r0*.85,c.h0-c.r0*.45,c.h0,c.h1,c.h1+c.r1*.4,c.h1+c.r1*.85,c.h1+c.r1]).sort((c,h)=>c-h),l=(c,h,f)=>{e.push(c),n.push(h),i.push(f),o.push(f?0:Ag(t,h))};for(let c=0;c<s.pts.length;c++){if(c>0){const h=s.along[c-1],f=s.along[c];for(const u of a){if(u<=h+1e-6||u>=f-1e-6)continue;const d=(u-h)/(f-h),v=s.pts[c-1],g=s.pts[c];l([v[0]+(g[0]-v[0])*d,v[1]+(g[1]-v[1])*d],u,!1)}}l(s.pts[c],s.along[c],r(s.along[c]))}return{pts:e,along:n,gone:i,fade:o}}class Rg{constructor(t){var d,v;const e=t.island.meta,n=t.terrain,i=[],o=[],r=[],a=[],l=[];let c=0;const h=((d=t.wailele)==null?void 0:d.lines)||Cc(e,t.island.data),f=(v=t.wailele)==null?void 0:v.cuts;this.cutTris=0;for(let g=0;g<h.length;g++){const p=(f==null?void 0:f.get(g))||[],{pts:m,along:_,gone:x,fade:y}=Cg(h[g],p),w=h[g].lineA,M=Math.min(1,Math.max(0,(Math.log10(w)-.35)/.9)),E=Math.min(.11,.009*Math.sqrt(w)+.012),P=p.map(W=>W.h1);let S=1/0,b=-1,F=!1;for(let W=0;W<m.length;W++){const X=m[Math.max(0,W-1)],T=m[Math.min(m.length-1,W+1)],D=T[0]-X[0],G=T[1]-X[1],U=Math.hypot(D,G)||1,k=-G/U,B=D/U,C=_[W],N=m[W][0],Z=m[W][1];let O=n.metresAt(N,Z);if(O<-.5)break;if(x[W]){F=!1;continue}for(const V of p)V.level!==void 0&&Math.abs(C-V.h1)<1e-6&&(S=V.level,b=V.h1+1);C<=b&&(O=Math.min(O,S),S=O);const $=m[Math.min(m.length-1,W+2)],K=(O-n.metresAt($[0],$[1]))/Math.max(10,Math.hypot($[0]-N,$[1]-Z)*100);let tt=Math.min(1,Math.max(0,(K-.08)/.5));for(const V of P)C>V-1e-6&&C<=V+.4&&(tt=Math.max(tt,1-(C-V)/.4));const ht=E*(1+tt*.4),lt=Math.max(O,0)*Nt+.012+tt*.03;for(const V of[-1,1]){const q=N+k*ht*V,nt=Z+B*ht*V;let I=Math.max(lt,Math.max(0,n.metresAt(q,nt))*Nt+.003);p.length&&(I=Math.min(I,lt+.04)),i.push(q,I,nt),o.push(C,M,tt),r.push(V),a.push(y[W])}if(F){l.push(c-2,c-1,c,c-1,c+1,c);const V=_[W-1];p.some(({h0:q,h1:nt})=>V>q+1e-6&&V<nt-1e-6||C>q+1e-6&&C<nt-1e-6||V<q-1e-6&&C>nt+1e-6)&&(this.cutTris+=2)}F=!0,c+=2}}const u=new Ce;u.setAttribute("position",new re(i,3)),u.setAttribute("aFlow",new re(o,3)),u.setAttribute("aSide",new re(r,1)),u.setAttribute("aFade",new re(a,1)),u.setIndex(l),u.computeBoundingSphere(),this.uniforms={...t.shared.uniforms,uFlowAll:{value:0}},this.material=new _e({vertexShader:Eg,fragmentShader:Tg,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:Ye,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new ne(u,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.app=t}update(){const t=this.app.weather,e=Math.min(1,t.rainTotal/600);this.uniforms.uFlowAll.value+=(e-this.uniforms.uFlowAll.value)*.01;const n=this.app.camera.position;this.mesh.visible=n.y-Math.max(0,this.app.terrain.heightAt(n.x,n.z))<90}}const We=Kt/xn,jt=Kt/te,Rc=We*.5,Lg=.12,Pg=1.6,ae=(s,t,e)=>s<t?t:s>e?e:s,tn=(s,t,e)=>{const n=ae((e-s)/(t-s),0,1);return n*n*(3-2*n)},Dg=s=>s-Math.PI*2*Math.round(s/(Math.PI*2)),qe=s=>{const t=Math.sin(s*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Pl(s,t,e,n){let i=(e+vt)/Kt*t-.5,o=(n+vt)/Kt*t-.5;i<0&&(i=0),o<0&&(o=0),i>t-1.001&&(i=t-1.001),o>t-1.001&&(o=t-1.001);const r=i|0,a=o|0,l=i-r,c=o-a,h=a*t+r,f=s[h]+(s[h+1]-s[h])*l,u=s[h+t]+(s[h+t+1]-s[h+t])*l;return f+(u-f)*c}const no=(s,t)=>{const e=ae(Math.floor((s+vt)/jt),0,te-1);return ae(Math.floor((t+vt)/jt),0,te-1)*te+e};function zi(s,t,e,n,i,o){const r=i-e,a=o-n,l=r*r+a*a||1e-9,c=ae(((s-e)*r+(t-n)*a)/l,0,1);return Math.hypot(e+r*c-s,n+a*c-t)}function Ug(s,t,e){let n=1/0;for(let i=1;i<e.length;i++)n=Math.min(n,zi(s,t,e[i-1][0],e[i-1][1],e[i][0],e[i][1]));return n}function Lc(s,t){const e=t*t/19.62;return s<=e?Math.sqrt(Math.max(0,s)/4.905):t/9.81+(s-e)/t}function mn(s,t,e=[0,0]){const{pts:n,along:i}=s,o=n.length;if(t<=0)return e[0]=n[0][0],e[1]=n[0][1],0;let r=0,a=o-1;if(t>=i[a])return e[0]=n[a][0],e[1]=n[a][1],a-1;for(;a-r>1;){const c=r+a>>1;i[c]<=t?r=c:a=c}const l=(t-i[r])/(i[a]-i[r]||1);return e[0]=n[r][0]+(n[a][0]-n[r][0])*l,e[1]=n[r][1]+(n[a][1]-n[r][1])*l,r}const Ks=.1;function Dl(s,t,e){const n=[],i=[0,0];for(let o=0;o<s.length;o++){const r=s[o],a=r.along[r.along.length-1],l=Math.floor(a/Ks)+1;if(l<8)continue;const c=new Float64Array(l),h=new Float64Array(l),f=new Float64Array(l),u=new Int32Array(l);for(let p=0;p<l;p++)u[p]=mn(r,p*Ks,i),c[p]=i[0],h[p]=i[1],f[p]=t(i[0],i[1]);const d=l-4,v=new Float64Array(l);for(let p=0;p<d;p++)v[p]=(f[p]-f[p+4])/40;let g=0;for(;g<d;){if(!(v[g]>.8)||f[g]<2){g++;continue}const p=g;let m=g;for(;m<d&&v[m]>.8;)m++;let _=m-1;const x=[];for(;;){let b=_+1;for(;b<d&&v[b]<=.8&&b-(_+1)<=5;)b++;if(b<d&&v[b]>.8&&b-(_+1)<=5){for(x.push(_+1);b<d&&v[b]>.8;)b++;_=b-1}else break}g=_+1;let y=p,w=-1/0;for(let b=Math.max(1,p-2);b<=p;b++){const F=v[b+1]-v[b-1];F>w&&(w=F,y=b)}let M=Math.min(l-1,_+4);for(let b=_;b<=Math.min(l-3,_+4);b++)if(v[b]<.3&&v[b+1]<.3&&v[b+2]<.3){M=b;break}const E=f[y]-f[M];if(E<60)continue;let P=!1;for(let b=y;b<=M&&!P;b++)e(c[b],h[b])&&(P=!0);if(P)continue;const S=r.area[u[y]];n.push({laid:o,sLip:y*Ks,sBase:M*Ks,lip:[c[y],f[y],h[y]],base:[c[M],f[M],h[M]],drop:E,A:S,per:ae((Math.log10(S)-.35)/.9,0,1),ledges:x.filter(b=>b>y&&b<M).map(b=>f[y]-f[b]).filter(b=>b>8&&b<E-8),samples:{xs:c,zs:h,hs:f,i0:y,i1:M}})}}return n}function Ig(s,t={}){const e=t.carve!==!1,n=performance.now(),{data:i,meta:o}=s,r=i.height,a=(C,N)=>Pl(r,xn,C,N),l=(C,N)=>Pl(i.height1024,te,C,N),c=Cc(o,i),h=performance.now(),f=new Uint8Array(te*te);let u=!1;const d=[];for(const C of o.sites.loi)for(const N of C.paddies){const Z=(N.quad[0][0]+N.quad[1][0]+N.quad[2][0]+N.quad[3][0])/4,O=(N.quad[0][1]+N.quad[1][1]+N.quad[2][1]+N.quad[3][1])/4;if(d.push([Z,O]),N.level<l(Z,O)-25){u=!0;const $=.3;for(let K=Math.floor((O-$+vt)/jt);K<=Math.floor((O+$+vt)/jt);K++)for(let tt=Math.floor((Z-$+vt)/jt);tt<=Math.floor((Z+$+vt)/jt);tt++)tt<0||K<0||tt>=te||K>=te||Math.hypot(-vt+(tt+.5)*jt-Z,-vt+(K+.5)*jt-O)<=$&&(f[K*te+tt]=1)}}const v=(C,N)=>f[no(C,N)]?l(C,N):a(C,N),g=[...o.sites.houses.map(C=>[C.x,C.z]),...o.sites.villages.map(C=>[C.x,C.z]),...o.sites.heiau.map(C=>[C.x,C.z]),...d],p=(C,N)=>f[no(C,N)]===1;let m=Dl(c,v,p);const _=performance.now(),x=o.ahupuaa.find(C=>C.id===o.sites.model),y=(x==null?void 0:x.trunk)||[],w=y.map(C=>[C[0],C[1]]),M=[];for(const C of m){const Z=w.length>1&&Ug(C.lip[0],C.lip[2],w)<1.5&&C.A>=2&&C.drop>=100;if(!Z&&!(C.A>=3&&C.drop>=120))continue;const{xs:O,zs:$,hs:K,i0:tt,i1:ht}=C.samples;let lt=-1;for(let ft=ht;ft>tt;ft--){let Et=!0;for(let Rt=tt+1;Rt<ft&&Et;Rt++)zi(O[Rt],$[Rt],O[tt],$[tt],O[ft],$[ft])>.35&&(Et=!1);if(Et){lt=ft;break}}if(lt<0)continue;const V=[O[tt],$[tt]],q=[O[lt],$[lt]],nt=Math.hypot(q[0]-V[0],q[1]-V[1]),I=K[tt]-K[lt];if(I<100||nt<.6)continue;const xt=(q[0]-V[0])/nt,ct=(q[1]-V[1])/nt,dt=Ul(I,C.A,C.per),ut=[V[0]+xt*dt.sLand,V[1]+ct*dt.sLand],Ot=dt.wBase;let Ct=!1;const L=Ot+.5,A=Math.floor((Math.min(V[0],q[0])-L+vt)/jt),j=Math.floor((Math.max(V[0],q[0])+L+vt)/jt),at=Math.floor((Math.min(V[1],q[1])-L+vt)/jt),st=Math.floor((Math.max(V[1],q[1])+L+vt)/jt);for(let ft=Math.max(0,at);ft<=Math.min(te-1,st)&&!Ct;ft++)for(let Et=Math.max(0,A);Et<=Math.min(te-1,j)&&!Ct;Et++){if(!f[ft*te+Et])continue;const Rt=-vt+(Et+.5)*jt,ot=-vt+(ft+.5)*jt;(zi(Rt,ot,V[0],V[1],q[0],q[1])<=Ot||Math.hypot(Rt-ut[0],ot-ut[1])<=dt.poolR+.5)&&(Ct=!0)}if(Ct||g.some(ft=>zi(ft[0],ft[1],V[0],V[1],q[0],q[1])<=Ot+.3))continue;const rt=K[lt],wt=K[tt],pt=Math.pow(I,.7)*Math.sqrt(C.A)*(rt<650?1.5:.6)*(wt<700?1.3:1)*(Z?3:1);M.push({f:C,L:V,B:q,len:nt,D:I,b:lt,isModel:Z,score:pt,ux:xt,uz:ct})}M.sort((C,N)=>N.score-C.score);const E=[];for(const C of M){if(E.length>=4)break;E.some(N=>Math.hypot(N.L[0]-C.L[0],N.L[1]-C.L[1])<8)||E.push(C)}let P=E.findIndex(C=>C.isModel);if(P<0&&E.length){let C=y[0];for(const O of y)Math.abs(O[2]-260)<Math.abs(C[2]-260)&&(C=O);const N=C?C[0]:0,Z=C?C[1]:0;P=0;for(let O=1;O<E.length;O++)Math.hypot(E[O].L[0]-N,E[O].L[1]-Z)<Math.hypot(E[P].L[0]-N,E[P].L[1]-Z)&&(P=O)}P>0&&E.unshift(E.splice(P,1)[0]);const S=[],b=[];for(const C of E){const N=C.f,Z=c[N.laid],O=C.f.samples.hs[C.f.samples.i0],$=C.f.samples.hs[C.b],K=Ul(C.D,N.A,N.per);e&&S.push(Fg(r,i.normals,C.L,C.B,O,$,K,g));const tt=a(C.L[0],C.L[1]),ht=a(C.B[0],C.B[1]),lt=C.L[0]+C.ux*K.sLand,V=C.L[1]+C.uz*K.sLand;let q=1/0;for(let dt=0;dt<16;dt++){const ut=dt/16*Math.PI*2;q=Math.min(q,a(lt+Math.cos(ut)*K.poolR,V+Math.sin(ut)*K.poolR))}const nt=a(lt,V),I=Math.max(q-.5,nt+1);let xt=N.sLip,ct=1/0;for(let dt=0;dt<Z.pts.length;dt++){const ut=Math.hypot(Z.pts[dt][0]-lt,Z.pts[dt][1]-V);ut<ct&&Z.along[dt]>=N.sLip&&(ct=ut,xt=Z.along[dt])}b.push({kind:0,laid:N.laid,src:Z.src,sLip:N.sLip,sBase:N.sLip+C.len,sPool:xt,lip:[C.L[0],tt,C.L[1]],base:[C.B[0],ht,C.B[1]],drop:tt-I,A:N.A,per:N.per,ledges:[],model:C.isModel,face:[C.ux,C.uz],pool:[lt,I,V],poolR:K.poolR,carve:{faceRun:K.faceRun,faceFrac:K.faceFrac,wFace:K.wFace,sLand:K.sLand,yF:$+(1-K.faceFrac)*(O-$)}})}const F=performance.now();S.length&&(m=Dl(c,v,p));const W=[];for(const C of m)b.some(N=>N.laid===C.laid&&C.sBase>=N.sLip-.1&&C.sLip<=N.sPool||Math.hypot(N.lip[0]-C.lip[0],N.lip[2]-C.lip[2])<.4)||(delete C.samples,C.kind=1,C.src=c[C.laid].src,W.push(C));W.sort((C,N)=>N.drop-C.drop);const X=[...b,...W].slice(0,io);for(const C of X)C.rain=i.rain[no(C.lip[0],C.lip[2])],C.ribbonA=c[C.laid].lineA;const T=performance.now(),D=kg(c,X,i,a),G=performance.now(),U=new Map,k=(C,N,Z,O,$,K)=>{U.has(C)||U.set(C,[]),U.get(C).push({h0:N,h1:Z,r0:O,r1:$,level:K})};for(const C of X){let N=C.kind===0?C.sPool:C.sBase;if(C.kind===0&&e){const{pts:tt,along:ht}=c[C.laid];for(let lt=0;lt<tt.length;lt++){if(ht[lt]<=N||ht[lt]>C.sPool+1.2)continue;const V=tt[lt][0]-C.lip[0],q=tt[lt][1]-C.lip[2],nt=V*C.face[0]+q*C.face[1];if(a(tt[lt][0],tt[lt][1])-a(C.lip[0]+C.face[0]*nt,C.lip[2]+C.face[1]*nt)>4)N=ht[Math.min(tt.length-1,lt+1)];else break}}const Z=Math.max(0,C.sLip-(C.kind===0?.06:.03)),O=C.kind===0?C.sLip:Math.min(C.sLip+.12,(C.sLip+C.sBase)/2),$=C.kind===0?N:Math.max(O,N-.15),K=C.kind===0?.05:N-$;k(C.laid,O,$,O-Z,K,C.kind===0?C.pool[1]:void 0),C.hand={a:Z,b:O,c:C.kind===0?1/0:$,d:C.kind===0?1/0:$+K}}if(e)for(const C of b){const[N,Z]=C.face,O=Math.hypot(C.base[0]-C.lip[0],C.base[2]-C.lip[2]),$=(K,tt)=>{const ht=K-C.lip[0],lt=tt-C.lip[2],V=ht*N+lt*Z,q=-ht*Z+lt*N;return V>-.05&&V<O&&Math.abs(q)<.8*(C.carve.wFace+(1.4-C.carve.wFace)*Math.max(0,V)/O)};for(let K=0;K<c.length;K++){if(K===C.laid)continue;const{pts:tt,along:ht}=c[K];let lt=-1;for(let V=0;V<=tt.length;V++){const q=V<tt.length&&$(tt[V][0],tt[V][1]);q&&lt<0&&(lt=V),!q&&lt>=0&&(k(K,ht[Math.max(0,lt-1)],ht[Math.min(tt.length-1,V)],.04,.04),lt=-1)}}}const B=performance.now();return{falls:X,threads:D,cuts:U,carved:S,lines:c,akua:b.length?0:-1,trench:u,ms:{lay:h-n,detect:_-h,carve:F-_,threads:G-T,total:B-n}}}function Ul(s,t,e){const o=ae(.3+.0025*s,.7,1.1),r=1.4,a=ae(.05+5e-4*s+.02*Math.sqrt(t),.06,.3),l=2.2+3.5*e+1.5,c=Rc+ae(l*Lc(.82*s,30)*.01,.1+.06,.1+.3);return{faceFrac:.82,faceRun:.1,wFace:o,wBase:r,poolR:a,v0:l,sLand:c}}function Fg(s,t,e,n,i,o,r,a){const l=xn,{faceRun:c,faceFrac:h,wFace:f,wBase:u,poolR:d,sLand:v}=r,g=Math.hypot(n[0]-e[0],n[1]-e[1]),p=(n[0]-e[0])/g,m=(n[1]-e[1])/g,_=i-o,x=o+(1-h)*_,y=2,w=Math.max(1,Math.floor((Math.min(e[0],n[0])-y+vt)/We)),M=Math.min(l-2,Math.ceil((Math.max(e[0],n[0])+y+vt)/We)),E=Math.max(1,Math.floor((Math.min(e[1],n[1])-y+vt)/We)),P=Math.min(l-2,Math.ceil((Math.max(e[1],n[1])+y+vt)/We)),S=a.filter(W=>W[0]>-vt+w*We-.5&&W[0]<-vt+M*We+.5&&W[1]>-vt+E*We-.5&&W[1]<-vt+P*We+.5);let b=0;for(let W=E;W<=P;W++)for(let X=w;X<=M;X++){const T=-vt+(X+.5)*We,D=-vt+(W+.5)*We,G=T-e[0],U=D-e[1],k=G*p+U*m,B=-G*m+U*p,C=k-Rc-Pg*B*B;if(C<0||k>g||S.some(ht=>Math.hypot(ht[0]-T,ht[1]-D)<.3))continue;let N=C<c?i+(x-i)*(C/c):x+(o-x)*(C-c)/Math.max(.1,g-c);const Z=Math.hypot(k-v,B)/(d*1.1);Z<1&&(N-=6*(1-Z*Z));const O=f+(u-f)*k/g,$=(1-tn(.55*O,O,Math.abs(B)))*(1-tn(g-.45,g,k)),K=W*l+X,tt=s[K]+(N-s[K])*$;tt<s[K]&&(s[K]=tt,b++)}const F=Kt/l;for(let W=E-1;W<=P+1;W++)for(let X=w-1;X<=M+1;X++){const T=W*l+X,D=s[W*l+Math.min(l-1,X+1)]-s[W*l+Math.max(0,X-1)],G=s[Math.min(l-1,W+1)*l+X]-s[Math.max(0,W-1)*l+X],U=-D*Nt/(2*F),k=-G*Nt/(2*F),B=Math.hypot(U,1,k);t[T*4]=Math.round((U/B*.5+.5)*255),t[T*4+1]=Math.round((1/B*.5+.5)*255),t[T*4+2]=Math.round((k/B*.5+.5)*255)}return{i0:w,i1:M,j0:E,j1:P,texels:b}}function kg(s,t,e,n){const i=te,o=e.rain,r=.25,a=(T,D)=>Math.floor((T+vt)/r)*4096+Math.floor((D+vt)/r),l=new Map,c=[0,0];for(const T of s){const D=T.along[T.along.length-1];for(let G=0;G<=D;G+=.1){mn(T,G,c);const U=a(c[0],c[1]);let k=l.get(U);k||l.set(U,k=[]),k.push(c[0],c[1])}}const h=(T,D,G,U)=>{const k=Math.floor((T+vt)/r),B=Math.floor((D+vt)/r);let C=G,N=!1;for(let Z=-1;Z<=1;Z++)for(let O=-1;O<=1;O++){const $=l.get((k+O)*4096+B+Z);if($)for(let K=0;K<$.length;K+=2){const tt=Math.hypot($[K]-T,$[K+1]-D);tt<C&&(C=tt,N=!0,U&&(U[0]=$[K],U[1]=$[K+1]))}}return N},f=t.map(T=>{const D=T.kind===0?1.4:.6;return{a:T.lip,b:T.base,r:D,x0:Math.min(T.lip[0],T.base[0])-D,x1:Math.max(T.lip[0],T.base[0])+D,z0:Math.min(T.lip[2],T.base[2])-D,z1:Math.max(T.lip[2],T.base[2])+D}}),u=(T,D)=>f.some(G=>T>G.x0&&T<G.x1&&D>G.z0&&D<G.z1&&zi(T,D,G.a[0],G.a[2],G.b[0],G.b[2])<G.r),d=(T,D,G)=>(G[0]=(n(T+.05,D)-n(T-.05,D))/(2*.05*100),G[1]=(n(T,D+.05)-n(T,D-.05))/(2*.05*100),Math.hypot(G[0],G[1]));let v=i,g=-1,p=i,m=-1;for(let T=0;T<i;T++)for(let D=0;D<i;D++)o[T*i+D]>2500&&(D<v&&(v=D),D>g&&(g=D),T<p&&(p=T),T>m&&(m=T));const _=[],x=[0,0],y=new Float64Array(3*404),w=4*We;for(let T=-vt+(p+.5)*jt;T<=-vt+(m+.5)*jt;T+=w)for(let D=-vt+(v+.5)*jt;D<=-vt+(g+.5)*jt;D+=w){const G=D+(qe(D*13.7+T*3.1)-.5)*w,U=T+(qe(D*5.3-T*11.9)-.5)*w,k=o[no(G,U)];if(k<=2500)continue;const B=n(G,U);if(B<=60||d(G,U,x)<=1.2||h(G,U,.25)||u(G,U))continue;y[0]=G,y[1]=B,y[2]=U;let C=1,N=G,Z=U,O=B,$=0,K=0,tt=!1;for(let I=0;I<400;I++){const xt=d(N,Z,x);if(xt<1e-6)break;const ct=N-x[0]/xt*.05,dt=Z-x[1]/xt*.05,ut=n(ct,dt);if(ut>=O)break;if((O-ut)/5>=.9?(K+=O-ut,$=0):$++,N=ct,Z=dt,O=ut,y[C*3]=N,y[C*3+1]=O,y[C*3+2]=Z,C++,$>=3){tt=!0;break}if(I>2&&h(N,Z,.25,c)){y[C*3]=c[0],y[C*3+1]=n(c[0],c[1]),y[C*3+2]=c[1],C++;break}if(O<3)break}if(K<140||(tt&&(C-=3),C<4))continue;let ht=!1;for(let I=2;I<C&&!ht;I+=2)ht=u(y[I*3],y[I*3+2]);if(ht)continue;const lt=[];for(let I=0;I<C;I++)lt.push([y[I*3],y[I*3+1],y[I*3+2]]);const V=d(G,U,x),q=d(G+x[0]/V*.4,U+x[1]/V*.4,x),nt=lt[0][1]-lt[lt.length-1][1];_.push({pts:lt,drop:nt,rain:k,score:nt*Math.sqrt(k/3e3)*(q<.8?1.4:1),room:.35+.5*qe(G*7.1+U*17.3)})}_.sort((T,D)=>D.score-T.score);const M=new Set,E=.3,P=(T,D)=>Math.floor((T+vt)/E)*4096+Math.floor((D+vt)/E),S=[];for(const T of _){if(S.length>=300)break;const[D,,G]=T.pts[0];if(S.some(B=>Math.abs(B.pts[0][0]-D)<1.7&&Math.abs(B.pts[0][2]-G)<1.7&&Math.hypot(B.pts[0][0]-D,B.pts[0][2]-G)<B.room+T.room))continue;const U=new Set;for(let B=3;B<T.pts.length;B++)U.add(P(T.pts[B][0],T.pts[B][2]));let k=0;for(const B of U)M.has(B)&&k++;if(!(k>3)){for(const B of U)M.add(B);S.push(T)}}for(const T of S){const D=T.pts,G=Math.max(6,Math.round(T.drop/25)),U=[D[0]];let k=1;for(let B=1;B<G-1;B++){const C=D[0][1]-T.drop*B/(G-1);for(;k<D.length-1&&D[k][1]>C;)k++;const N=D[k-1],Z=D[k],O=ae((N[1]-C)/(N[1]-Z[1]||1),0,1);U.push([N[0]+(Z[0]-N[0])*O,C,N[2]+(Z[2]-N[2])*O])}U.push(D[D.length-1]),T.pts=U}const b=e.area;for(const T of S){const D=T.pts[T.pts.length-1],G=Math.floor((D[0]+vt)/jt),U=Math.floor((D[2]+vt)/jt);let k=0;for(let B=Math.max(0,U-1);B<=Math.min(i-1,U+1);B++)for(let C=Math.max(0,G-1);C<=Math.min(i-1,G+1);C++)k=Math.max(k,b[B*i+C]);T.A=k}const F=[...S].sort((T,D)=>D.A-T.A),W=t.find(T=>T.kind===0),X=S.map(T=>{const D=F.indexOf(T)/Math.max(1,F.length-1),G=Math.round(T.pts[0][0]*37+T.pts[0][2]*101),U=T.pts[1][0]-T.pts[0][0],k=T.pts[1][2]-T.pts[0][2],B=Math.hypot(U,k)||1,C=W&&Math.hypot(T.pts[0][0]-W.pool[0],T.pts[0][2]-W.pool[2])<25;return{kind:2,pts:T.pts,lip:T.pts[0],base:T.pts[T.pts.length-1],drop:T.drop,A:T.A,rain:T.rain,thr:.35+.6*Math.pow(D,.8)+(qe(G)-.5)*.15,prio:T.drop*Math.sqrt(T.rain/3e3)*(C?2:1),catch:[T.pts[0][0],T.pts[0][2],T.pts[0][0]-U/B*1.5,T.pts[0][2]-k/B*1.5]}});return X.sort((T,D)=>D.prio-T.prio),X}const io=512,Zs=512,zg=Array.from({length:8},(s,t)=>Math.cos(t/8*Math.PI*2)),Ng=Array.from({length:8},(s,t)=>Math.sin(t/8*Math.PI*2)),Og=[60,120,220,1e9],Bg=[.25,.5,.75,1],Hg=`
${ze}
${kn}
${rn}
${zn}
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
`,Gg=`
${ze}
${kn}
${rn}
${zn}
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
`,Vg=`
${ze}
${kn}
${rn}
${zn}
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
`,Wg=`
${ze}
${kn}
${rn}
${zn}
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
`;function qg(){const t=new Uint8Array(4096),e=(i,o,r)=>qe((o%i+i)%i*157+(r%i+i)%i*311+i*17);for(let i=0;i<64;i++)for(let o=0;o<64;o++){let r=0,a=.5;for(let l=0;l<4;l++){const c=4<<l,h=o/64*c,f=i/64*c,u=Math.floor(h),d=Math.floor(f),v=h-u,g=f-d,p=v*v*(3-2*v),m=g*g*(3-2*g),_=e(c,u,d)+(e(c,u+1,d)-e(c,u,d))*p,x=e(c,u,d+1)+(e(c,u+1,d+1)-e(c,u,d+1))*p;r+=(_+(x-_)*m)*a,a*=.5}t[i*64+o]=Math.round(ae((r/.9375-.25)/.6,0,1)*255)}const n=new $n(t,64,64,fs,en);return n.wrapS=n.wrapT=ci,n.minFilter=ee,n.magFilter=ee,n.needsUpdate=!0,n}class Xg{constructor(t,e){const n=performance.now();this.app=t,this.plan=e,this.enabled=!0,this.debugTime=null,this.list=e.falls,this.threads=e.threads.slice(0,Math.max(0,io-e.falls.length)),this.nCurtain=e.falls.length,this.n=this.nCurtain+this.threads.length,this.stuck=0,this.nodeKey=new Int32Array(16384).fill(-1),this.nodeVal=new Float64Array(16384),this.build(),this.buildState(),this.buildMist(),this.clearVegetation(),this.group=new an,this.group.add(this.mesh,this.mist),this.heroes=[];for(let i=0;i<this.nCurtain;i++){const o=this.list[i];o.kind===0&&this.heroes.push({index:i,model:o.model,src:o.src,lip:new z(o.lip[0],o.lip[1]*Nt,o.lip[2]),base:new z(o.pool[0],o.pool[1]*Nt,o.pool[2]),pool:new z(o.pool[0],o.pool[1]*Nt,o.pool[2]),poolR:o.poolR,face:o.face,per:o.per,rain:o.rain,mist:new z(o.pool[0],o.pool[1]*Nt+.35*(o.lip[1]-o.pool[1])*Nt,o.pool[2])})}this.hero=this.heroes[0]||null,this.heroView=null,this.lastStop=-1,this.frustum=new xs,this.projView=new Zt,this.tmp=new z,this.setQuality(t.quality?t.quality.level:2),this.buildMs=performance.now()-n,this.settle()}setHero(t,e=null){this.hero=t,this.heroView=e}fine(t,e){return Math.max(this.app.terrain.metresAt(t,e),this.coarse(0,t,e))}coarse(t,e,n){const i=We*(1<<t),o=(e+vt)/i,r=(n+vt)/i,a=Math.floor(o),l=Math.floor(r),c=o-a,h=r-l,f=this.node(t,a,l),u=this.node(t,a+1,l),d=this.node(t,a,l+1),v=this.node(t,a+1,l+1),g=f+(u-f)*c+(d-f)*h+(f-u-d+v)*c*h,p=c+h<=1?f+(u-f)*c+(d-f)*h:v+(d-v)*(1-c)+(u-v)*(1-h),m=c>=h?f+(u-f)*c+(v-u)*h:f+(d-f)*h+(v-d)*c;return Math.max(g,p,m)}node(t,e,n){const i=(t*4096+n)*4096+e|0,o=(Math.imul(e,73856093)^Math.imul(n,19349663)^Math.imul(t,83492791))&16383;if(this.nodeKey[o]===i)return this.nodeVal[o];const r=We*(1<<t),a=this.app.terrain.metresAt(-vt+e*r,-vt+n*r);return this.nodeKey[o]=i,this.nodeVal[o]=a,a}axisOf(t){const e=[0,0];if(t.kind===0)return mn(this.plan.lines[t.laid],Math.max(0,t.sLip-.08),e),{poly:[[e[0],e[1]],[t.lip[0],t.lip[2]],[t.base[0],t.base[2]]],lipAt:Math.hypot(e[0]-t.lip[0],e[1]-t.lip[2])};if(t.kind===1){const a=this.plan.lines[t.laid],l=Math.max(0,t.sLip-.03),c=[];mn(a,l,e),c.push([e[0],e[1]]);for(let h=0;h<a.pts.length;h++)a.along[h]>l+1e-4&&a.along[h]<t.sBase-1e-4&&c.push([a.pts[h][0],a.pts[h][1]]);return mn(a,t.sBase,e),c.push([e[0],e[1]]),{poly:c,lipAt:t.sLip-l}}const n=t.pts,i=n[1][0]-n[0][0],o=n[1][2]-n[0][2],r=Math.hypot(i,o)||1;return{poly:[[n[0][0]-i/r*.05,n[0][2]-o/r*.05],...n.map(a=>[a[0],a[2]])],lipAt:.05}}spine(t,e){const n=t.kind,{poly:i,lipAt:o}=this.axisOf(t),r=[],a=[],l=[];let c=0;for(let V=0;V<i.length;V++)V>0&&(c+=Math.hypot(i[V][0]-i[V-1][0],i[V][1]-i[V-1][1])),i[V].s=c;const h=c,f=n===2?.04:.02;for(let V=0;V<=h+1e-6;V+=f){let q=1;for(;q<i.length-1&&i[q].s<V;)q++;const nt=i[q-1],I=i[q],xt=ae((V-nt.s)/(I.s-nt.s||1),0,1);r.push(nt[0]+(I[0]-nt[0])*xt),a.push(nt[1]+(I[1]-nt[1])*xt),l.push(V-o)}const u=r.length,d=(V,q)=>{const nt=(V+o)/f;let I=Math.floor(nt);I<0&&(I=0),I>u-2&&(I=u-2);const xt=nt-I;q[0]=r[I]+(r[I+1]-r[I])*xt,q[1]=a[I]+(a[I+1]-a[I])*xt;const ct=r[I+1]-r[I],dt=a[I+1]-a[I],ut=Math.hypot(ct,dt)||1;return q[2]=ct/ut,q[3]=dt/ut,q},v=Math.round(o/f),g=new Float64Array(u);for(let V=0;V<u;V++)g[V]=this.fine(r[V],a[V])*Nt;const p=g[v];for(let V=v+1;V<u;V++)g[V]=Math.min(g[V],g[V-1]);const m=V=>{for(let q=v+1;q<u;q++)if(g[q]<=V){const nt=(g[q-1]-V)/(g[q-1]-g[q]||1);return l[q-1]+(l[q]-l[q-1])*nt}return l[u-1]},_=t.per??0,x=t.A;let y,w,M,E;n===0?(y=2.2+3.5*_+1.5,w=30,M=ae(.08+.03*Math.sqrt(x),.1,.22),E=1.7):n===1?(y=1.2+2.8*_,w=14+14*_,M=ae(.03+.02*Math.sqrt(x),.04,.12),E=1.4):(y=.6,w=9,M=.005+.012*ae(x/.07,0,1),E=1.25);const P=t.drop,S=n===0?36:n===1?ae(Math.round(P/10),12,28):Math.max(6,Math.round(P/25)),b=[];for(let V=0;V<=S;V++)b.push(n===2?P*V/S:P*(V/S)*(V/S));if(n===0)for(const V of[16,10,5,2.5])b.push(P-V);else if(n===1)for(const V of[20,10,4])P>3*V&&b.push(P-V);const F=(t.ledges||[]).slice(0,3);for(const V of F)b.push(V);b.sort((V,q)=>V-q);for(let V=b.length-2;V>0;V--)b[V+1]-b[V]<1&&!F.includes(b[V])&&b.splice(V,1);const W=n===0?1.05:n===1?.1:1.4,X=n===2?.15:.3,T=[0,0,0,0],D=[],G=V=>{d(V.sig,T),V.fx=T[2],V.fz=T[3],V.x=T[0]-T[3]*V.lat,V.z=T[1]+T[2]*V.lat},U=Math.min(.11,.009*Math.sqrt(t.ribbonA??x)+.012)*(n===0?.9:1.25),k=n===0?(t.pool[0]-t.lip[0])*t.face[0]+(t.pool[2]-t.lip[2])*t.face[1]:1/0,B=n===0?-.06:-.03;d(B,T),D.push({x:T[0],y:this.fine(T[0],T[1])*Nt+(n===0?.035:.012),z:T[1],fx:T[2],fz:T[3],d:0,hw:n===0?Math.min(U,.5*M):U,contact:1,tongue:-1,sig:B}),d(0,T);const C=n===0?Math.min(.5*M,Math.max(U,.35*M)):n===1?U:Math.min(.5*M,U*.4+.3*M);D.push({x:T[0],y:p+.004,z:T[1],fx:T[2],fz:T[3],d:0,hw:C,contact:1,tongue:0,sig:0});for(const V of b){const q=p-V*Nt,nt=y*Lc(V,w)*.01,I=m(q);let xt=.5*M*(1+(E-1)*V/Math.max(1,P));n<2&&(xt*=C/(.5*M)+(1-C/(.5*M))*tn(0,n===0?18:20,V));const ct=.006+X*xt,dt=Math.min(I+ct,k),ut=Math.max(nt,dt),Ot=n===0&&I+ct>k?0:1-tn(0,.03,nt+(n===0?Lg:0)-dt),Ct={y:q,d:V,hw:xt,contact:Ot,ledge:F.includes(V),sig:ut,lat:0};G(Ct),D.push(Ct)}const N=(V,q)=>{const nt=D[Math.max(0,V-1)],I=D[Math.min(D.length-1,V+1)];q[0]=I.x-nt.x,q[1]=I.y-nt.y,q[2]=I.z-nt.z;const xt=Math.hypot(q[0],q[1],q[2])||1;return q[0]/=xt,q[1]/=xt,q[2]/=xt,q},Z=[0,0,0],O=P-(4+.03*P),$=n===2?2:1;for(let V=2;V<D.length;V++){const q=D[V],nt=D[V-1];if(V>2&&nt.sig>q.sig&&(q.sig=nt.sig,q.lat=nt.lat,G(q)),q.d>O||n===0&&q.d<3)continue;N(V,Z);const I=-q.fz,xt=q.fx;let ct=Z[1]*xt-Z[2]*0,dt=Z[2]*I-Z[0]*xt,ut=Z[0]*0-Z[1]*I;const Ot=Math.hypot(ct,dt,ut)||1;ct/=Ot,dt/=Ot,ut/=Ot;const Ct=n===0?1+(.15+.9*tn(10,150,q.d))*W*(1-tn(.55*P,O,q.d)):1,L=q.hw*Ct,A=q.hw*(.45+(.25-.45)*q.contact)*Ct,j=q.sig,at=q.lat;let st=0;for(;st<80;st++){let rt=!1,wt=0;for(let ft=0;ft<8;ft+=$){const Et=zg[ft],Rt=Ng[ft],ot=q.x+I*L*Et+ct*A*Rt,$t=q.y+dt*A*Rt,It=q.z+xt*L*Et+ut*A*Rt;$t<this.fine(ot,It)*Nt+.004&&(rt=!0,wt+=Et)}if(!rt)break;const pt=n===0?0:wt>.5?-.004:wt<-.5?.004:0;q.sig+=.005,q.lat+=pt,G(q)}st>=80&&(this.stuck++,q.sig=j,q.lat=at,G(q))}const K=D.length;if(K>4){const V=D.map(q=>q.sig??0);for(let q=0;q<4;q++){let nt=D[2].sig;for(let xt=3;xt<K;xt++){const ct=D[xt].sig,dt=xt+1<K?D[xt+1].sig:ct;D[xt].sig=Math.max(V[xt],(nt+2*ct+dt)/4),nt=ct}let I=D[2].lat;for(let xt=3;xt<K-1;xt++){const ct=D[xt].lat;D[xt].lat=(I+2*ct+D[xt+1].lat)/4,I=ct}}if(n===1){const q=Math.min(25,.25*P);for(let nt=2;nt<K;nt++)D[nt].lat*=1-tn(P-q,P,D[nt].d)}for(let q=2;q<K;q++)G(D[q])}for(const V of D){if(V.hand=1,!t.hand||n===2||n===0&&V.sig>0)continue;const q=t.sLip+V.sig,nt=t.hand;let I=ae((q-nt.a)/Math.max(1e-6,nt.b-nt.a),0,1);n===1&&(I=Math.min(I,1-ae((q-nt.c)/Math.max(1e-6,nt.d-nt.c),0,1))),V.hand=I}let tt=y,ht=0,lt=0;D[0].T=-.4,D[0].s=-3,D[1].T=0,D[1].s=0;for(let V=2;V<D.length;V++){const q=D[V-1],nt=D[V],I=Math.hypot(nt.x-q.x,nt.z-q.z)*100,xt=(q.y-nt.y)/Nt,ct=Math.hypot(I,xt),dt=Math.max(1,Math.ceil(ct)),ut=xt/Math.max(.5,I),Ot=nt.contact>.5?9+(w-9)*tn(1.5,5,ut):w;for(let Ct=0;Ct<dt;Ct++)tt=Math.sqrt(Math.max(.25,tt*tt+2*9.81*(xt/dt)*(1-tt*tt/(Ot*Ot)))),ht+=ct/dt/Math.max(.5,tt);lt+=ct,nt.T=ht,nt.s=lt,nt.ledge&&(tt=2.5)}for(let V=0;V<D.length;V++){const q=D[V];N(V,Z),q.tx=Z[0],q.ty=Z[1],q.tz=Z[2];const nt=-q.fz,I=q.fx;q.lift=[0,0,0,0];for(let xt=0;xt<4;xt++){let ct=this.coarse(xt,q.x,q.z)*Nt+.01-q.y;n!==2&&xt<2&&(ct=Math.max(ct,this.coarse(xt,q.x-nt*q.hw,q.z-I*q.hw)*Nt+.01-q.y),ct=Math.max(ct,this.coarse(xt,q.x+nt*q.hw,q.z+I*q.hw)*Nt+.01-q.y)),q.lift[xt]=Math.max(0,ct)}q.along=ae(q.d/Math.max(1,P),0,1),q.toBase=P-q.d}return{st:D,W0:M,yL:p,at:d,sigmaT:m,drop:P}}build(){let t=16384;const e={pos:new Float32Array(t*3),axis:new Float32Array(t*3),face:new Float32Array(t*3),fall:new Float32Array(t*4),meta:new Float32Array(t*4),more:new Float32Array(t*3),lift:new Float32Array(t*4)},n={pos:3,axis:3,face:3,fall:4,meta:4,more:3,lift:4};let i=0;const o=(w,M,E,P,S,b,F,W,X,T,D,G,U,k,B,C,N,Z,O,$=1)=>{if(i>=t){t*=2;for(const ht in e){const lt=new Float32Array(t*n[ht]);lt.set(e[ht]),e[ht]=lt}}const K=i*3,tt=i*4;return e.pos[K]=w,e.pos[K+1]=M,e.pos[K+2]=E,e.axis[K]=P,e.axis[K+1]=S,e.axis[K+2]=b,e.face[K]=F,e.face[K+2]=W,e.fall[tt]=X,e.fall[tt+1]=T,e.fall[tt+2]=D,e.fall[tt+3]=G,e.meta[tt]=U,e.meta[tt+1]=k,e.meta[tt+2]=B,e.meta[tt+3]=C,e.more[i*3]=N,e.more[i*3+1]=Z,e.more[i*3+2]=$,O&&(e.lift[tt]=O[0],e.lift[tt+1]=O[1],e.lift[tt+2]=O[2],e.lift[tt+3]=O[3]),i++},r=[],a=[],l=[],c=[],h=[],f=[];this.stations=[],this.pools=[],this.mistSrc=[];const u=(w,M,E,P,S,b,F,W)=>{const X=Math.atan2(F,b),T=o(E,W??this.fine(E,P)*Nt+.003,P,0,1,0,b,F,0,0,S,4,w,M,0,0,1,0,null);for(let D=0;D<=16;D++){const G=D/16*Math.PI*2,U=E+Math.cos(X+G)*S,k=P+Math.sin(X+G)*S;o(U,W??this.fine(U,k)*Nt+.003,k,0,1,0,b,F,0,0,S,4,w,M,1,G,1,0,null),D>0&&a.push(T,T+D,T+D+1)}this.pools.push([E,P,S])},d=(w,M,E,P,S)=>{const b=w.st;let F=-1;for(let W=0;W<b.length;W++){const X=b[W],T=o(X.x,X.y,X.z,X.tx,X.ty,X.tz,X.fx,X.fz,X.s,X.T,X.hw,S,M,E,-1,X.contact,X.along,X.toBase,X.lift,X.hand);o(X.x,X.y,X.z,X.tx,X.ty,X.tz,X.fx,X.fz,X.s,X.T,X.hw,S,M,E,1,X.contact,X.along,X.toBase,X.lift,X.hand),F>=0&&P.push(F,F+1,T,F+1,T+1,T),F=T,S!==2&&this.stations.push(X.x,X.z)}},v=[0,0,0,0];for(let w=0;w<this.nCurtain;w++){const M=this.list[w],E=qe(w*7.13+1.7),P=this.spine(M,w);M.W0=P.W0,d(P,w,E,M.kind===0?l:c,M.kind);const S=this.plan.lines[M.laid],b=M.kind===0?M.sPool:M.sBase,F=[0,0],W=[0,0];mn(S,b,F),mn(S,b+.15,W);let X=W[0]-F[0],T=W[1]-F[1];const D=Math.hypot(X,T);D<1e-4?(X=M.face?M.face[0]:1,T=M.face?M.face[1]:0):(X/=D,T/=D);const G=M.drop,U=M.kind===0?M.poolR:ae(.05+5e-4*G+.02*Math.sqrt(M.A),.06,.3),k=P.st[P.st.length-1],B=M.kind===0?M.pool[0]:k.x,C=M.kind===0?M.pool[2]:k.z,N=.05,Z=Math.hypot(this.fine(B+N,C)-this.fine(B-N,C),this.fine(B,C+N)-this.fine(B,C-N))/(2*N*100),O=this.list.some($=>$!==M&&Math.hypot($.lip[0]-B,$.lip[2]-C)<U+.4);(M.kind===0||Z<.35&&!O)&&u(w,E,B,C,U,X,T,M.kind===0?M.pool[1]*Nt:void 0),M.poolAt=[B,M.kind===0?M.pool[1]:this.fine(B,C),C,U];for(const $ of(M.ledges||[]).slice(0,3))P.at(P.sigmaT(P.yL-$*Nt),v),Math.hypot(this.fine(v[0]+N,v[1])-this.fine(v[0]-N,v[1]),this.fine(v[0],v[1]+N)-this.fine(v[0],v[1]-N))/(2*N*100)<.35&&u(w,E+.37,v[0],v[1],U*.6,v[2],v[3]);if(M.kind===0){const $=-M.face[1],K=M.face[0],tt=[],ht=M.lip[1]-M.carve.yF,lt=.6*M.carve.wFace,V=13,q=1.1*P.W0/lt;for(let nt=0;nt<=ht+1e-6;nt+=8){const I=P.yL-nt*Nt;P.at(P.sigmaT(I),v);const xt=[];for(let ct=0;ct<V;ct++){const dt=ct/(V-1)*2-1;let ut=v[0]+$*dt*lt,Ot=v[1]+K*dt*lt;const L=this.fine(ut,Ot)*Nt>=I?1:-1;let A=ut,j=Ot,at=!1;for(let It=0;It<200;It++){const Dt=ut+M.face[0]*.005*L,Tt=Ot+M.face[1]*.005*L,St=this.fine(Dt,Tt)*Nt>=I;if(L<0){if(St){at=!0;break}A=Dt,j=Tt}else if(!St){A=Dt,j=Tt,at=!0;break}ut=Dt,Ot=Tt}if(!at){xt.push(-1);continue}const st=.02,rt=(this.fine(A+st,j)-this.fine(A-st,j))*Nt/(2*st),wt=(this.fine(A,j+st)-this.fine(A,j-st))*Nt/(2*st),pt=Math.hypot(rt,1,wt),ft=[-rt/pt,1/pt,-wt/pt],Et=A+ft[0]*.004,Rt=I+ft[1]*.004,ot=j+ft[2]*.004,$t=[0,0,0,0];for(let It=0;It<4;It++)$t[It]=Math.max(0,this.coarse(It,Et,ot)*Nt+.01-Rt);xt.push(o(Et,Rt,ot,ft[0],ft[1],ft[2],M.face[0],M.face[1],nt,q,lt,3,w,E,dt,1-tn(.5,.8,ft[1]),nt/M.drop,M.drop-nt,$t))}tt.push(xt)}for(let nt=1;nt<tt.length;nt++)for(let I=0;I<V-1;I++){const xt=tt[nt-1][I],ct=tt[nt-1][I+1],dt=tt[nt][I],ut=tt[nt][I+1];xt<0||ct<0||dt<0||ut<0||r.push(xt,ct,dt,ct,ut,dt)}}this.mistSrc.push({id:w,f:M,sp:P,ox:X,oz:T})}for(let w=0;w<this.threads.length;w++){const M=this.threads[w],E=this.nCurtain+w,P=this.spine(M,E);f.push(h.length),d(P,E,qe(E*3.77+.3),h,2)}f.push(h.length);const g=r.length+a.length+l.length+c.length+h.length,p=i>65535?new Uint32Array(g):new Uint16Array(g);let m=0;for(const w of[r,a,l,c,h])p.set(w,m),m+=w.length;const _=g-h.length;this.decalIdx=r.length,this.threadIdx=f.map(w=>_+w);const x=new Ce;x.setAttribute("position",new he(e.pos.slice(0,i*3),3)),x.setAttribute("aAxis",new he(e.axis.slice(0,i*3),3)),x.setAttribute("aFace",new he(e.face.slice(0,i*3),3)),x.setAttribute("aFall",new he(e.fall.slice(0,i*4),4)),x.setAttribute("aMeta",new he(e.meta.slice(0,i*4),4)),x.setAttribute("aMore",new he(e.more.slice(0,i*3),3)),x.setAttribute("aLift",new he(e.lift.slice(0,i*4),4)),x.setIndex(new he(p,1)),this.verts=i,this.tris=g/3;const y=this.app;this.uniforms={...y.shared.uniforms,uHeight:{value:y.terrain.heightTex},uState:{value:null},uPx:{value:.001},uLodRange:{value:y.terrain.range0},uWaterTime:{value:0},uDebug:{value:0},uPuff:{value:null},uBow:{value:.05},uNightK:{value:.35}},this.material=new _e({vertexShader:Hg,fragmentShader:Gg,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:Ye,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new ne(x,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=3}buildState(){const t=this.n,e=this.app.weather;this.state=new Float32Array(io*4),this.stateTex=new $n(this.state,io,1,Fe,fn),this.stateTex.minFilter=ue,this.stateTex.magFilter=ue,this.stateTex.generateMipmaps=!1,this.stateTex.needsUpdate=!0,this.uniforms.uState.value=this.stateTex,this.kind=new Uint8Array(t),this.per=new Float32Array(t),this.thr=new Float32Array(t),this.cell=new Int32Array(t),this.c1=new Int32Array(t),this.cU1=new Int32Array(t),this.cU2=new Int32Array(t),this.w0=new Float32Array(t),this.lenY=new Float32Array(t),this.flow=new Float32Array(t),this.front=new Float32Array(t),this.wet=new Float32Array(t),this.spate=new Float32Array(t),this.primed=new Float32Array(t),this.turb=new Float32Array(t),this.px=new Float32Array(t),this.pz=new Float32Array(t),this.mid=new Float32Array(t*3);const n=e.G,i=(r,a)=>ae(Math.floor((a-e.origin)/e.cell),0,n-1)*n+ae(Math.floor((r-e.origin)/e.cell),0,n-1),o=[0,0];for(let r=0;r<t;r++){const a=r<this.nCurtain?this.list[r]:this.threads[r-this.nCurtain];if(this.kind[r]=a.kind,this.per[r]=a.per??0,this.thr[r]=a.thr??0,this.cell[r]=i(a.lip[0],a.lip[2]),a.kind!==2){const l=this.plan.lines[a.laid];mn(l,a.sLip-1,o),this.cU1[r]=i(o[0],o[1]),mn(l,a.sLip-2.5,o),this.cU2[r]=i(o[0],o[1])}this.lenY[r]=a.drop*Nt,this.px[r]=a.lip[0],this.pz[r]=a.lip[2],this.mid[r*3]=(a.lip[0]+a.base[0])/2,this.mid[r*3+1]=(a.lip[1]+a.base[1])/2*Nt,this.mid[r*3+2]=(a.lip[2]+a.base[2])/2,a.kind===2&&(this.cell[r]=i(a.catch[0],a.catch[1]),this.c1[r]=i(a.catch[2],a.catch[3]),this.w0[r]=.6)}}buildMist(){const t=[],e=this.app.weather.wind,n=[0,0,0,0];this.mistAnchors=[];for(const{id:c,f:h,sp:f,ox:u,oz:d}of this.mistSrc){const v=h.drop,g=h.per??0;if(h.kind>1||v<100||g<.2&&h.kind!==0)continue;const p=f.W0*100,m=ae((15+.25*v)*(.4+.6*Math.max(g,h.kind===0?.4:0))*Math.sqrt(p/10),10,90),_=h.kind===0?Math.round(ae(6+v/25,6,40)*Math.sqrt(p/8)):Math.min(4,Math.round(ae(6+v/25,6,40)*Math.sqrt(p/8))),[x,y,w]=h.poolAt,M=[];for(let E=0;E<_;E++){const P=qe(c*91.3+E*7.7),S=qe(c*13.1+E*3.3+.5),b=(.35+.25*qe(c*5.3+E*1.9))*m*.01,F=P*Math.PI*2,W=Math.sqrt(S)*.3*m*.01;M.push([0,x+Math.cos(F)*W,y*Nt+b*.5,w+Math.sin(F)*W,b,u,d])}if(h.kind===0){const E=Math.round(ae(v/40,2,10));for(let P=0;P<E;P++){const S=v*(.3+.65*Math.sqrt(qe(c*3.1+P*11.7)));let b=2;for(;b<f.st.length-1&&f.st[b].d<S;)b++;const F=f.st[b],W=-F.fz,X=F.fx,T=W*e.x+X*e.y>=0?1:-1,D=(1.2+1.3*qe(c*7.9+P*2.3))*F.hw;M.push([1,F.x+F.fx*.5*F.hw+W*T*F.hw*.5,F.y,F.z+F.fz*.5*F.hw+X*T*F.hw*.5,D,F.fx,F.fz])}}for(const E of(h.ledges||[]).slice(0,3))f.at(f.sigmaT(f.yL-E*Nt),n),M.push([2,n[0],this.fine(n[0],n[1])*Nt+m*.0025,n[1],m*.005,n[2],n[3]]);M.forEach((E,P)=>t.push({m:E,id:c,key:(P+.5)/M.length+.01*qe(c*17.3+P)})),this.mistAnchors.push(x,y*Nt,w)}t.sort((c,h)=>c.key-h.key);const i=Math.min(Zs,t.length),o=new Float32Array(Zs*3),r=new Float32Array(Zs*4),a=new Float32Array(Zs*3);for(let c=0;c<i;c++){const{m:h,id:f}=t[c];o.set([h[1],h[2],h[3]],c*3),r.set([h[0],qe(c*1.618+f*.31),h[4],f],c*4),a.set([h[5],0,h[6]],c*3)}const l=new pc;l.setAttribute("position",new re([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("iOrigin",new Xn(o,3)),l.setAttribute("iKind",new Xn(r,4)),l.setAttribute("iFace",new Xn(a,3)),l.instanceCount=i,this.nMist=i,this.mistAnchors=new Float32Array(this.mistAnchors),this.uniforms.uPuff.value=qg(),this.mistMaterial=new _e({vertexShader:Vg,fragmentShader:Wg,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:Ye}),this.mist=new ne(l,this.mistMaterial),this.mist.frustumCulled=!1,this.mist.renderOrder=4}clearVegetation(){const t=this.app.vegetation;if(!t||!t.cleared)return;const e=te,n=t.cleared,i=(l,c,h,f)=>{const u=Math.max(0,Math.floor((l-h+vt)/jt)),d=Math.min(e-1,Math.floor((l+h+vt)/jt)),v=Math.max(0,Math.floor((c-h+vt)/jt)),g=Math.min(e-1,Math.floor((c+h+vt)/jt));for(let p=v;p<=g;p++)for(let m=u;m<=d;m++){const _=-vt+(m+.5)*jt,x=-vt+(p+.5)*jt;(f?f(_,x):Math.hypot(_-l,x-c)<=h)&&(n[p*e+m]=1)}};for(let l=0;l<this.stations.length;l+=2)i(this.stations[l],this.stations[l+1],.2);for(const[l,c,h]of this.pools)i(l,c,h+.1);const o=[0,0];for(const l of this.list){if(l.kind!==0)continue;const c=this.plan.lines[l.laid];for(let v=l.sPool;v<l.sPool+1.6;v+=.1)mn(c,v,o),i(o[0],o[1],.32-.12*((v-l.sPool)/1.6));const[h,f]=l.face,u=.75*l.carve.wFace,d=l.carve.faceRun+.6;i(l.lip[0]+h*d*.5,l.lip[2]+f*d*.5,d+u,(v,g)=>{const p=v-l.lip[0],m=g-l.lip[2],_=p*h+m*f,x=-p*f+m*h;return _>=-.1&&_<=d&&Math.abs(x)<u})}const r=this.app.terrain,a=new z;for(const l of this.list){if(l.kind!==0)continue;const[c,,h]=l.lip,[f,,u]=l.pool;i((c+f)/2,(h+u)/2,1.8,(d,v)=>zi(d,v,c,h,f,u)<1.5&&r.normalAt(d,v,a).y<.45)}}clearSight(t,e){const n=this.app.vegetation;if(!n||!n.cleared)return;const i=this.app.terrain,o=n.cleared,r=te;let a=!1;for(const l of e){const c=Math.hypot(l.x-t.x,l.z-t.z),h=Math.ceil(c/(jt*.4));for(let f=1;f<h;f++){const u=f/h,d=t.x+(l.x-t.x)*u,v=t.z+(l.z-t.z)*u;if(!(t.y+(l.y-t.y)*u-Math.max(0,i.heightAt(d,v))>.6))for(const[p,m]of[[0,0],[jt*.5,0],[-jt*.5,0],[0,jt*.5],[0,-jt*.5]]){const _=Math.floor((d+p+vt)/jt),x=Math.floor((v+m+vt)/jt);_<0||x<0||_>=r||x>=r||o[x*r+_]||(o[x*r+_]=1,a=!0)}}}a&&n.tiles&&(n.tiles.clear(),n.lastSelection="")}raw(t){const e=this.app.weather.rain;return Math.min(1.5,(e[this.cell[t]]*this.w0[t]+e[this.c1[t]]*(1-this.w0[t]))/1.2)}targetOf(t,e){if(this.kind[t]===2){const i=Math.max(this.spate[t],this.primed[t]);return tn(this.thr[t],this.thr[t]+.3,i)}const n=this.wetOf(t)*1.4+e*.5;return Math.min(1,this.kind[t]===0?this.per[t]*.5+n*1.5:this.per[t]+n)}wetOf(t){const e=this.app.weather.wet;return(e[this.cell[t]]+e[this.cU1[t]]+e[this.cU2[t]])/3}turbOf(t){if(this.kind[t]===2)return 0;const e=this.app.weather,n=e.rain;return tn(.3,.8,Math.max(n[this.cell[t]],n[this.cU1[t]],n[this.cU2[t]]))*(e.regime==="kona"?1:.25)}prime(t,e,n){const i=this.app.weather;for(let o=this.nCurtain;o<this.n;o++){const r=this.px[o]-t.x,a=this.pz[o]-t.z;if(r*r+a*a>=e*e)continue;const l=n*tn(.1,.45,Math.max(this.raw(o),i.wet[this.cell[o]]));this.primed[o]<l&&(this.primed[o]=l)}}primeStop(){var n;const t=this.app.ui;if(!t||!t.stops)return;this.lastStop=t.index;const e=t.views[(n=t.stops[t.index])==null?void 0:n.id];e&&e.spate&&this.prime(e.target,40,e.spate)}settle(){const t=this.app.streams?this.app.streams.uniforms.uFlowAll.value:0;for(let n=this.nCurtain;n<this.n;n++)this.spate[n]=this.raw(n);const e=this.app.ui;e&&e.index!==this.lastStop&&this.primeStop();for(let n=0;n<this.n;n++){const i=this.targetOf(n,t);this.flow[n]=i,this.front[n]=i>.05?1.15:0,this.wet[n]=i,this.turb[n]=this.turbOf(n),this.state[n*4]=i,this.state[n*4+1]=this.front[n],this.state[n*4+2]=i,this.state[n*4+3]=this.turb[n]}this.stateTex.needsUpdate=!0}update(t){const e=this.app,n=t*e.clock.speed,i=1-Math.exp(-n/1800),o=1-Math.exp(-n/10800),r=1-Math.exp(-t/2),a=Math.exp(-n/21600),l=e.streams.uniforms.uFlowAll.value,c=e.ui;c&&c.index!==this.lastStop&&this.primeStop();const h=this.state;let f=!1;for(let _=0;_<this.n;_++){if(this.kind[_]===2){const M=this.raw(_);this.spate[_]+=(M-this.spate[_])*(M>this.spate[_]?i:o),this.primed[_]-=this.primed[_]*o}const x=this.targetOf(_,l);this.flow[_]+=(x-this.flow[_])*r,x>.05?this.front[_]=Math.min(1.15,this.front[_]+t/(2+4*this.lenY[_])):this.flow[_]<.03&&(this.front[_]=0),this.wet[_]=Math.max(this.flow[_],this.wet[_]*a);const y=this.turbOf(_);this.turb[_]+=(y-this.turb[_])*(y>this.turb[_]?i:o);const w=_*4;(Math.abs(h[w]-this.flow[_])>1e-4||Math.abs(h[w+1]-this.front[_])>1e-4||Math.abs(h[w+2]-this.wet[_])>1e-4||Math.abs(h[w+3]-this.turb[_])>.001)&&(h[w]=this.flow[_],h[w+1]=this.front[_],h[w+2]=this.wet[_],h[w+3]=this.turb[_],f=!0)}f&&(this.stateTex.needsUpdate=!0);const u=this.uniforms,d=e.camera;u.uLodRange.value=e.terrain.range0,u.uPx.value=2*Math.tan(d.fov/2*(Math.PI/180))/Math.max(1,e.renderer.domElement.height),u.uWaterTime.value=this.debugTime??e.time;const v=d.position,g=v.y-Math.max(0,e.terrain.heightAt(v.x,v.z));this.group.visible=this.enabled&&g<90;let p=1/0;const m=this.mistAnchors;for(let _=0;_<m.length;_+=3){const x=m[_]-v.x,y=m[_+1]-v.y,w=m[_+2]-v.z,M=x*x+y*y+w*w;M<p&&(p=M)}this.mist.visible=this.group.visible&&p<3600,this.holdOrbit()}holdOrbit(){var f;const t=this.app.ui,e=this.app.rig;if(!t||!t.stops||!e||e.flight||!e.autoOrbit)return;const n=t.views[(f=t.stops[t.index])==null?void 0:f.id];if(!n||!n.orbit)return;const o=typeof innerWidth=="number"&&innerWidth<innerHeight&&n.orbitPortrait||n.orbit,r=o[0]-n.yaw,a=o[1]-n.yaw,l=Dg(e.goal.yaw-n.yaw);let c=e.autoOrbit>0?1:-1;c>0&&l>=a?c=-1:c<0&&l<=r&&(c=1);const h=l<r-.05||l>a+.05?1:Math.max(0,Math.min(a-l,l-r));e.autoOrbit=c*(n.distance<60?.012:.02)*(.15+.85*tn(0,.12,h))}setQuality(t){const e=ae(t|0,0,3),n=Math.min(Og[e],this.threads.length),i=e===0?this.decalIdx:0;this.mesh.geometry.setDrawRange(i,this.threadIdx[n]-i),this.mist.geometry.instanceCount=Math.round(this.nMist*Bg[e])}setDebug(t){this.uniforms.uDebug.value=t|0}frame(t,e,n=0,i=.15,o=0){const r=t<this.nCurtain?this.list[t]:this.threads[t-this.nCurtain],a=r.poolAt||r.base,l=r.face?r.face[0]:r.base[0]-r.lip[0],c=r.face?r.face[1]:r.base[2]-r.lip[2],h=Math.atan2(l,c)+n,f=this.app.rig;for(const u of[f.goal,f.state])u.target.set(a[0],Math.max(0,this.app.terrain.heightAt(a[0],a[2])),a[2]),u.distance=e,u.yaw=h,u.pitch=i,u.lift=o;f.flight=null,f.autoOrbit=0}get stats(){const t=this.app;let e=0,n=0;t.camera&&(t.camera.updateMatrixWorld(),this.projView.multiplyMatrices(t.camera.projectionMatrix,t.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView));for(let o=this.nCurtain;o<this.n;o++)this.flow[o]<=.5||(e++,this.tmp.set(this.mid[o*3],this.mid[o*3+1],this.mid[o*3+2]),this.frustum.containsPoint(this.tmp)&&this.tmp.distanceTo(t.camera.position)<70&&n++);const i=this.list.filter(o=>o.kind===0);return{heroes:i.length,model:i.some(o=>o.model),akuaLine:this.hero?this.hero.src:-1,akuaHero:this.heroes.indexOf(this.hero),akuaView:this.heroView,stream:this.nCurtain-i.length,threads:this.threads.length,threadsOn:e,inView:n,mist:this.nMist,verts:this.verts,tris:this.tris,stuck:this.stuck,carvedTexels:this.plan.carved.reduce((o,r)=>o+r.texels,0),trench:this.plan.trench,planMs:Math.round(this.plan.ms.total),buildMs:Math.round(this.buildMs||0),cutTris:t.streams?t.streams.cutTris:-1}}}function ps(s,t,{filter:e="mip",format:n=Fe}={}){const i=new $n(s,t,t,n,en);return e==="nearest"?(i.minFilter=ue,i.magFilter=ue):e==="linear"?(i.minFilter=ee,i.magFilter=ee):(i.minFilter=hi,i.magFilter=ee,i.generateMipmaps=!0),i.wrapS=i.wrapT=$e,i.needsUpdate=!0,i}function Yg(s){const t=te,e=new Uint8Array(t*t*4),n=Math.log(300),i=Math.log(12e3),o=new Float32Array(t*t);for(let a=0;a<t*t;a++)o[a]=Math.max(0,Math.min(1,Math.log10(Math.max(1e-6,s.area[a])/.04)/1.6));const r=Ac(o,t,2,2);for(let a=0;a<t*t;a++)e[a*4]=Math.round(255*Math.max(0,Math.min(1,(Math.log(s.rain[a])-n)/(i-n)))),e[a*4+1]=Math.round(255*Math.max(0,Math.min(1,s.sand[a]))),e[a*4+2]=Math.round(255*Math.min(1,r[a]*1.6)),e[a*4+3]=s.region[a*4+3];return ps(e,t)}function $g(s){const t=te,e=new Uint8Array(t*t*4),n=Kt/t*100,i=wg(t,o=>s.height1024[o]>0);for(let o=0;o<t*t;o++)e[o*4+3]=Math.round(255*Math.min(1,i[o]*n/300));return{tex:ps(e,t),data:e}}const ms=["#8d9cc9","#3d8a4c","#a3d05b","#e3b65e","#f3e2b0","#53d6c8","#2a5aa8"],jg=["#000000","#f0a35e","#6fb6e8","#f2d06b","#9ed27a"];function Kg(s){const t=te,e=ms.map(a=>new Lt(a)),n=[new Float32Array(t*t),new Float32Array(t*t),new Float32Array(t*t)];for(let a=0;a<t*t;a++){const l=e[s[a*4+2]]||e[6];n[0][a]=l.r,n[1][a]=l.g,n[2][a]=l.b}const i=n.map(a=>Ac(a,t,2,2)),o=new Uint8Array(t*t*4);for(let a=0;a<t*t;a++)o[a*4]=Math.round(255*Math.pow(i[0][a],1/2.2)),o[a*4+1]=Math.round(255*Math.pow(i[1][a],1/2.2)),o[a*4+2]=Math.round(255*Math.pow(i[2][a],1/2.2)),o[a*4+3]=255;const r=ps(o,t);return r.colorSpace=Ae,r}class Zg{constructor(t,e){this.canvas=t,this.island=e,this.params=new URLSearchParams(location.search);const n=new fc({canvas:t,antialias:!1,powerPreference:"high-performance"});n.setClearColor(0,1),this.renderer=n,this.pipeline=new Em(n),this.scene=new Ms,this.camera=new Xe(42,1,.1,9e3),this.light={sunDir:new z(0,1,0),sunColor:new Lt,skyColor:new Lt,groundColor:new Lt,moonDir:new z(0,-1,0),moonColor:new Lt,zenith:new Lt,horizon:new Lt,sunHorizon:new Lt,night:0};const i=new $n(new Uint8Array([0,0,0,0]),1,1);i.needsUpdate=!0;const o=e.data;this.landTex=Yg(o),this.regionTex=ps(o.region,te,{filter:"nearest"}),this.linesTex=ps(o.lines,xn,{filter:"linear"}),this.zoneTex=Kg(o.region),this.overlay=new me(0,0,0,0),this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uShadow:{value:null},uWeather:{value:i},uWeatherRect:{value:new me(-Kt,-Kt,Kt*2,Kt*2)},uCloudShadowK:{value:0},uCloudMidY:{value:15},uWetness:{value:0},uLand:{value:this.landTex},uSkyMap:{value:null},uRegion:{value:this.regionTex},uLines:{value:this.linesTex},uZoneTex:{value:this.zoneTex},uOverlay:{value:this.overlay},uHover:{value:0},uFocus:{value:0},uFocusK:{value:0},uMokuColors:{value:jg.map(d=>new Lt(d))},uWindVec:{value:new kt(1,0)}}};const r=this.params.get("falls");this.wailele=r==="0"?null:Ig(e,{carve:r!=="flat"}),this.terrain=new pm(o,this.shared),this.scene.add(this.terrain.group),this.shadow=new Hm(this.terrain.heightTex),this.shared.uniforms.uShadow.value=this.shadow.texture;const a=$g(o);this.seaTex=a.tex,this.seaData=a.data,this.ocean=new xm(this.shared,this.terrain.heightTex,a.tex),this.scene.add(this.ocean.mesh),this.sky=new zm,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.weather=new Km(o.height1024,te);const[l,c]=e.meta.cloudSizes;this.clouds=new jm({shape:o.cloudShape,shapeSize:l,detail:o.cloudDetail,detailSize:c}),this.clouds.uniforms.uWeather.value=this.weather.texture,this.clouds.uniforms.uWeatherRect.value=this.weather.rect,this.clouds.uniforms.uShadow.value=this.shadow.texture,this.clouds.uniforms.uHeight.value=this.terrain.heightTex,this.shared.uniforms.uWeather.value=this.weather.texture,this.shared.uniforms.uWeatherRect.value=this.weather.rect,this.pipeline.atmosphere=this.clouds,this.features=new cg(this),this.scene.add(this.features.group),this.vegetation=new gg(this),this.scene.add(this.vegetation.group),this.life=new yg(this),this.scene.add(this.life.group),this.streams=new Rg(this),this.scene.add(this.streams.mesh),this.wailele&&(this.waterfalls=new Xg(this,this.wailele),this.scene.add(this.waterfalls.group)),this.flash={t:-10,next:0,pos:new z,k:0},this.rig=new Om(this.camera,t,this.terrain),this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??9.2),speed:Number(this.params.get("speed")??60)},this.season=this.clock.doy>120&&this.clock.doy<300?"kau":"hooilo",this.params.get("weather")&&this.weather.setMode(this.params.get("weather")),this.sky.update(this.clock.doy,this.clock.hour,0,this.light),this.weather.warm(6,this.light.sunDir.y,this.clock.hour,this.season),this.time=0,this.frames=0,this.updaters=[];const h=n.getContext(),f=h.getExtension("WEBGL_debug_renderer_info"),u=f?String(h.getParameter(f.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(u),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}applyQuality(){var e;const t=[{clouds:.25,steps:26,light:2,range:12,dpr:1},{clouds:.33,steps:34,light:2,range:16,dpr:1.25},{clouds:.42,steps:44,light:3,range:19,dpr:1.5},{clouds:.5,steps:56,light:4,range:22,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.clouds.setScale(t.clouds),this.clouds.uniforms.uSteps.value=t.steps,this.clouds.uniforms.uLightSteps.value=t.light,this.terrain.setRange(t.range),(e=this.waterfalls)==null||e.setQuality(this.quality.level),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}lightning(){const t=this.weather,e=this.flash,n=t.stormiest;n&&(t.regime==="kona"?n.strength>.35:n.strength>.9)&&this.time>e.next&&this.clock.speed>0&&(e.t=this.time,e.pos.set(n.x+(Math.random()-.5)*8,t.base+(t.top-t.base)*(.3+Math.random()*.4),n.z+(Math.random()-.5)*8),e.next=this.time+1.5+Math.random()*(t.regime==="kona"?5:14));const o=this.time-e.t;e.k=o<.6?Math.exp(-o*9)*(.7+.3*Math.sin(o*70))+(o>.12&&o<.22?.6:0):0,this.clouds.uniforms.uFlash.value=e.k,this.clouds.uniforms.uFlashPos.value.copy(e.pos),e.k>0&&this.light.skyColor.offsetHSL(0,0,0).add(new Lt(.25,.27,.35).multiplyScalar(e.k))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.shadow.update(this.renderer,this.light.sunDir),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){var l;const e=this.clock;e.hour+=t*e.speed/3600,e.hour>=24&&(e.hour-=24,e.doy=(e.doy+1)%365),this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t),this.terrain.update(this.camera),this.ocean.update(this.camera),this.vegetation.update(this.camera),this.weather.step(t*e.speed,this.light.sunDir.y,e.hour,this.season),this.life.update(t,this.time),this.streams.update(),(l=this.waterfalls)==null||l.update(t),this.lightning();for(const c of this.updaters)c(t,this.time);const n=this.light,i=this.weather,o=this.clouds.uniforms;o.uSunDir.value.copy(n.sunDir),o.uSunColor.value.copy(n.sunColor),o.uSkyColor.value.copy(n.skyColor),o.uGroundColor.value.copy(n.groundColor),o.uFogColor.value.copy(n.horizon),o.uMoonDir.value.copy(n.moonDir),o.uMoonColor.value.copy(n.moonColor),o.uWind.value.copy(i.windOffset),o.uWindDir.value.copy(i.wind),o.uTime.value=this.time,o.uBase.value=i.base,o.uTop.value=i.top;const r=Math.max(0,Math.min(1,(i.state.humidity-1.1)/.3));if(o.uOvercast.value=r,o.uFarCover.value=.32+r*.4,r>0){const c=1-r*.65;n.sunColor.multiplyScalar(c);const h=(n.skyColor.r+n.skyColor.g+n.skyColor.b)/3;n.skyColor.lerp(new Lt(h,h,h*1.04),r*.5).multiplyScalar(1-r*.25)}this.shared.uniforms.uCloudShadowK.value=2.6,this.shared.uniforms.uCloudMidY.value=(i.base+i.top)*.5,this.ocean.uniforms.uWind.value.set(i.wind.x/9,i.wind.y/9),this.shared.uniforms.uWindVec.value.set(i.wind.x/9,i.wind.y/9);const a=this.pipeline.uniforms;a.uSunDir.value.copy(n.sunDir),a.uSunColor.value.copy(n.sunHorizon),a.uFogColor.value.copy(n.horizon),a.uExposure.value=.55*(1+2.2*Math.pow(n.night,1.5)),a.uNight.value=n.night,this.sky.group.position.copy(this.camera.position)}}const Jg=[{id:"island",icon:"island",title:"Ka Mokupuni",gloss:"the island",text:["A high island raised by two volcanoes and carved by rain. Land was divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili worked by extended families.","This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones did."]},{id:"rain",icon:"rain",title:"Ka Ua",gloss:"the rain",text:["Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.","So one side of an island is lush and the other dry. Hawaiians named hundreds of winds and rains, each belonging to a place. Wai, fresh water, was life — and waiwai, wealth, is water doubled."]},{id:"ahupuaa",icon:"ahupuaa",title:"Ahupuaʻa",gloss:"from the mountain to the sea",zone:null,text:["An ahupuaʻa ran from the uplands to the sea, usually bounded by ridges, so its people had forest, fresh water, farmland, shore and reef within one boundary.","A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.","The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki."]},{id:"akua",icon:"akua",title:"Wao Akua",gloss:"realm of the gods",zone:0,text:["The cloud-wrapped heights were left largely to the gods. People came only for special purposes — feathers, choice woods, stone for adzes — and with care.","Yet this is the source: mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream."]},{id:"nahele",icon:"nahele",title:"Wao Nahele",gloss:"the forest",zone:1,text:["Below the clouds grew koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.","Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go."]},{id:"loi",icon:"loi",title:"Loʻi Kalo",gloss:"irrigated taro terraces",zone:2,text:["Kalo (taro) was the staff of life, cooked and pounded into poi. Terraces stepped down the valley floor, fed by an ʻauwai — a ditch that took part of the stream at a dam and returned it below. The water had to keep moving: cool, flowing water kept the kalo healthy.","In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo was caring for family."]},{id:"kauhale",icon:"kauhale",title:"Kauhale",gloss:"the family compound",zone:4,text:["A home was a cluster of hale, each with its purpose: the hale noa where the family slept, the mua where men ate and kept the family shrine, a separate eating house for women, a house for beating kapa, a canoe house.","Under the ʻai kapu, men and women ate apart. Houses were framed in hardwood, lashed with cordage and thatched with pili grass, on a raised stone paepae."]},{id:"heiau",icon:"heiau",title:"Heiau",gloss:"temple",zone:4,text:["Heiau ranged from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief; others honored Lono for rain and harvests, or served healing and fishing.","On the platform stood the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings."]},{id:"kahakai",icon:"kahakai",title:"Kahakai",gloss:"the shore",zone:4,text:["Most people lived near the shore, where the stream met the sea. Canoes, each hull carved from a single log and steadied by an ama float, were kept out of the sun in a hālau waʻa.","On flat rocks and clay pans, seawater evaporated into paʻakai — salt — for preserving fish."]},{id:"loko",icon:"loko",title:"Loko Iʻa",gloss:"fishpond",zone:5,text:["Hawaiians built the most advanced fishponds in the Pacific. A curved wall of stacked stone, the kuapā, enclosed part of the reef flat near a stream mouth, where fresh water mixed with salt.","In the wall were mākāhā — sluice gates of wooden grates. Young fish slipped in with the tide, fattened on algae, and grew too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) were raised here."]},{id:"koa",icon:"koa",title:"Koʻa",gloss:"fishing shrine",zone:5,text:["Fishermen built koʻa, stone shrines on the shore, and offered the first fish of a catch to the fishing gods. Offshore fishing grounds were also called koʻa, found by lining up landmarks on land.","Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out."]},{id:"surf",icon:"surf",title:"Heʻe Nalu",gloss:"wave sliding",zone:5,text:["Surfing belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.","Each break had its name, and the best were sometimes kapu to all but the aliʻi."]},{id:"kula",icon:"kula",title:"Kula",gloss:"the dry plains",zone:3,text:["Where rain was too scarce for loʻi, families farmed the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).","Long low walls ran across the slopes to break the wind and hold soil and moisture. The great leeward field systems covered tens of square kilometres."]},{id:"ahu",icon:"ahu",title:"Ahu · Makahiki",gloss:"the boundary altar · the season of Lono",zone:4,text:["Where the trail around the island crossed into each ahupuaʻa stood an ahu, a stone altar. When Makaliʻi — the Pleiades — rose at dusk in late autumn, the Makahiki began: four months honoring Lono, god of rain and growth.","Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden."]},{id:"puuhonua",icon:"puuhonua",title:"Puʻuhonua",gloss:"place of refuge",zone:4,text:["Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.","In wartime, defeated warriors and those who could not fight also found safety there."]},{id:"holua",icon:"holua",title:"Hōlua",gloss:"sledding course",zone:3,text:["During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.","The track was paved with stones and laid with slick grass or leaves; the longest ran for more than a kilometre."]},{id:"malama",icon:"malama",title:"Mālama ʻĀina",gloss:"care for the land",text:["The ahupuaʻa worked because each part cared for the next: protected forests made water, water fed loʻi and fishponds, and people tended it all.","Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles."]}],Js={moae:{name:"Moaʻe",gloss:"trade winds"},kona:{name:"Kona",gloss:"southerly storm"},malie:{name:"Mālie",gloss:"calm"},auto:{name:"Auto",gloss:"let the weather change"}},ia={kau:{name:"Kau",gloss:"the dry season"},hooilo:{name:"Hoʻoilo",gloss:"the wet season"}},Qg={island:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',rain:'<path d="M7 14.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',ahupuaa:'<path d="M12 3.5 4.5 19.5h15z"/><path d="M12 7c-1.2 2.6 1 4.4 0 7s1.2 3 .3 5.5"/><path d="M3 21c2 0 2-.8 4.5-.8S9.5 21 12 21s2-.8 4.5-.8 2 .8 4.5.8"/>',akua:'<path d="M3 19.5l6-9 3 4 2-3 7 8z"/><path d="M8.2 7.5a2.6 2.6 0 0 1 5-1.3A2.2 2.2 0 1 1 15.5 9.6H8.8a1.1 1.1 0 0 1-.6-2.1z"/>',nahele:'<path d="M12 21v-6"/><path d="M12 15c-4.2 0-6.3-2.1-6.3-5a4 4 0 0 1 3-3.9 3.3 3.3 0 0 1 6.6 0 4 4 0 0 1 3 3.9c0 2.9-2.1 5-6.3 5z"/>',loi:'<path d="M12 21v-4.5"/><path d="M12 16.5c-5 0-8-3-8-7 0-2.2 1.2-4 3.2-4 2 0 3 1.8 4.8 1.8s2.8-1.8 4.8-1.8c2 0 3.2 1.8 3.2 4 0 4-3 7-8 7z"/><path d="M12 7.3v9"/>',kauhale:'<path d="M2.5 20.5h19"/><path d="M5 20.5 12 5l7 15.5"/><path d="M10.4 20.5v-4h3.2v4"/>',heiau:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',kahakai:'<path d="M3 14.5h18l-2.2 3.2H5.2z"/><path d="M6 11h12"/><path d="M8.5 11v3.5M15.5 11v3.5"/><path d="M3 20.5c2 0 2-.8 4.5-.8s2 .8 4.5.8 2-.8 4.5-.8 2 .8 4.5.8"/>',loko:'<path d="M3.5 12c3-4.2 9-5 12.5 0-3.5 5-9.5 4.2-12.5 0z"/><path d="M16 12l5-3.2v6.4z"/><circle cx="7.2" cy="11.2" r=".9" fill="currentColor"/><path d="M3 20c3-2 15-2 18 0"/>',koa:'<path d="M6.5 20.5h11"/><ellipse cx="12" cy="17.8" rx="4.3" ry="2"/><ellipse cx="12" cy="13.8" rx="3.2" ry="1.8"/><path d="M12 12V5.2a2.1 2.1 0 1 1 3.1 1.9"/>',surf:'<path d="M2.5 17c3.2 0 4.2-8.5 9.5-8.5 3 0 4.2 2 4.2 4.2-1.2-.2-3.2-.6-4 1.4 3 0 5.6 1 7.8 2.9"/><path d="M2.5 20.5h19"/>',kula:'<path d="M2.5 18.5c2-3 4.5-3 6.5 0M9 18.5c2-3 4.5-3 6.5 0M15.5 18.5c1.6-2.4 4-3 6 0"/><path d="M2.5 21h19"/><path d="M5.8 14.5v-3M12.2 14.5v-4M18.6 14.5v-3"/>',ahu:'<path d="M7.5 20.5h9l-1.2-3.2H8.7z"/><path d="M9.3 17.3l.6-3h4.2l.6 3"/><path d="M10.4 14.3l.6-2.3h2l.6 2.3"/><path d="M18 3.5l.7 1.6 1.6.7-1.6.7L18 8.1l-.7-1.6-1.6-.7 1.6-.7z"/>',puuhonua:'<path d="M2.5 20h19"/><path d="M3 20v-6.5h9.5V20"/><path d="M3 16.2h9.5"/><path d="M14 20l3.6-7.5L21.2 20"/>',holua:'<path d="M3 5.5l18 13.5"/><path d="M7.8 7.6l3.6 2.7"/><path d="M6.6 10.4l5.3 4"/><circle cx="9.6" cy="6.2" r="1.2"/>',malama:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',zones:'<path d="M3 6h18M3 10.5h18M3 15h18M3 19.5h18"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',moae:'<path d="M3 8.5h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16.5h8"/>',kona:'<path d="M7 13.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M12.5 13.5 10 18h3.5l-2 3.5"/>',malie:'<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1"/><path d="M9.5 18.5a3.5 3.5 0 1 1 .7-6.9 4.3 4.3 0 0 1 8.3 2 2.6 2.6 0 0 1-.4 4.9z"/>',auto:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/>',kau:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',hooilo:'<path d="M7 13a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M9 16.5v3M13 16.5v3M17 16.5v3"/>',speed1:'<path d="M8 5.5v13l9-6.5z"/>',speed2:'<path d="M4.5 5.5v13l7.5-6.5zM12 5.5v13l7.5-6.5z"/>',speed3:'<path d="M3 6v12l6-6zM9.5 6v12l6-6zM16 6v12l6-6z"/>',wind:'<path d="M12 3l4 8h-3v10h-2V11H8z" fill="currentColor" stroke="none"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',tour:'<path d="M4 19c4-1 4-6 8-7s5-6 8-7"/><circle cx="4" cy="19" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="20" cy="5" r="1.4" fill="currentColor"/>'};function xe(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Qg[s]||""}</svg>`}const Vn=(s,t)=>Math.atan2(s,t);function tv(s){const t=s.island.meta,e=t.sites,n=s.terrain,i=t.ahupuaa.find(U=>U.id===e.model)||t.ahupuaa[0],[o,r]=i.mouth;let a=i.topX-o,l=i.topZ-r;const c=Math.hypot(a,l)||1;a/=c,l/=c;const h=Vn(-a,-l),f=Vn(a,l),u=(U,k)=>new z(U,Math.max(0,n.heightAt(U,k)),k),d=i.trunk||[],v=U=>{if(!d.length)return[o+a*c*U,r+l*c*U];const k=d[Math.min(d.length-1,Math.floor(U*(d.length-1)))];return[k[0],k[1]]},g=U=>{let k=d[0];for(const B of d)Math.abs(B[2]-U)<Math.abs(k[2]-U)&&(k=B);return k?[k[0],k[1]]:v(.6)},p=e.villages.find(U=>U.model)||e.villages[0],m=e.loi.find(U=>U.model)||e.loi[0],_=e.heiau.find(U=>U.model)||e.heiau[0],x=e.ponds.find(U=>U.model)||e.ponds[0],y=e.canoes.find(U=>U.village===i.id)||e.canoes[0],w=e.koa.find(U=>U.id===i.id)||e.koa[0],M=U=>Math.min(...e.ponds.map(k=>Math.hypot(k.cx-U.x,k.cz-U.z)),99),P=[...e.surf].sort((U,k)=>Math.hypot(U.x-o,U.z-r)-Math.max(0,8-M(U))*20-(Math.hypot(k.x-o,k.z-r)-Math.max(0,8-M(k))*20))[0],S=e.alii||p,b=[...t.ahu].filter(U=>U.a===i.id||U.b===i.id).sort((U,k)=>Math.hypot(U.x-o,U.z-r)-Math.hypot(k.x-o,k.z-r))[0]||t.ahu[0],[F,W]=t.center,X=(()=>{const U=s.island.data.region,k=Math.sqrt(U.length/4);let B=null,C=-1;for(let N=0;N<k;N+=4)for(let Z=0;Z<k;Z+=4)if(U[(N*k+Z)*4+3]>C){let $=0;for(let K=-8;K<=8;K+=4)for(let tt=-8;tt<=8;tt+=4)$+=U[(Math.min(k-1,Math.max(0,N+K))*k+Math.min(k-1,Math.max(0,Z+tt)))*4+3];$>C&&(C=$,B=[((Z+.5)/k-.5)*360,((N+.5)/k-.5)*360])}return B||[S.x,S.z-10]})(),T={};let D=[];T.island={target:u(F+10,W+4),distance:330,yaw:.28,pitch:.78,overlay:[.55,0,.6,0],hour:9.5};{const U=o-a*4,k=r-l*4,[B,C]=oa(Ma.moae.bearing),N=[];for(const[Z,O]of[[24,3],[48,-4]]){const $=U-B*Z-C*O,K=k-C*Z+B*O;N.push([$,K]);for(let tt=0;tt<6;tt++){const ht=tt*Math.PI/3;N.push([$+Math.cos(ht)*6,K+Math.sin(ht)*6])}}T.rain={target:u(U,k),distance:24,yaw:f,pitch:.1,hour:16.5,weather:"moae",boost:!0,overlay:[0,0,0,0],lookUp:.35,showers:N}}{const[U,k]=v(.45);T.ahupuaa={target:u(U,k),distance:92,yaw:h+.25,pitch:.55,focus:i.id,overlay:[1,.85,.4,.6],hour:11}}{const[U,k]=g(260);T.akua={target:u(U,k),distance:26,yaw:h+.15,pitch:.1,hour:8.2,overlay:[0,0,0,0],lookUp:.55},D=s.waterfalls?lv(s,n,U,k):[]}{const[U,k]=g(520);T.nahele={target:u(U,k),distance:9,yaw:h+.9,pitch:.55,hour:9.5,overlay:[0,0,0,0]}}if(m){const U=m.paddies[Math.floor(m.paddies.length*.35)].quad[0];T.loi={target:u(U[0],U[1]),distance:5.2,yaw:h-.5,pitch:.72,hour:10.2,overlay:[0,0,0,0]}}if(T.kauhale={target:u(p.x,p.z),distance:3.2,yaw:h+.9,pitch:.55,hour:8.8,overlay:[0,0,0,0]},_&&(T.heiau={target:u(_.x,_.z),distance:2.1,yaw:_.rot+2.2,pitch:.42,hour:11.5,overlay:[0,0,0,0]}),y){const U=Math.cos(y.dir),k=Math.sin(y.dir);T.kahakai={target:u(y.x,y.z),distance:2,yaw:Vn(U,k)+.7,pitch:.28,hour:15.8,overlay:[0,0,0,0]}}if(x&&(T.loko={target:u(x.cx+x.ax*x.r*.4,x.cz+x.az*x.r*.4),distance:6,yaw:Vn(x.ax,x.az)+.6,pitch:.5,hour:13,overlay:[0,0,0,0]}),w){const U=y||{dir:0};T.koa={target:u(w.x,w.z),distance:1.8,yaw:Vn(-Math.cos(U.dir),-Math.sin(U.dir))+.3,pitch:.2,hour:6.9,overlay:[0,0,0,0],lookUp:.25}}if(P&&(T.surf={target:u(P.x,P.z),distance:1.3,yaw:Vn(Math.cos(P.dir+.9),Math.sin(P.dir+.9)),pitch:.12,hour:14.5,overlay:[0,0,0,0]}),T.kula={target:u(X[0],X[1]),distance:11,yaw:.9,pitch:.42,hour:9,overlay:[0,0,0,0]},b){let U=0,k=-1/0;for(let B=0;B<24;B++){const C=B/24*Math.PI*2,N=n.heightAt(b.x+Math.sin(C)*2.2,b.z+Math.cos(C)*2.2);N>k&&(k=N,U=C)}T.ahu={target:u(b.x,b.z),distance:2,yaw:U,pitch:.3,hour:18.2,doy:318,overlay:[0,0,0,.8],lookUp:.6,ahu:b}}if(e.puuhonua){const U=e.puuhonua;T.puuhonua={target:u(U.x-Math.cos(U.dir)*.8,U.z-Math.sin(U.dir)*.8),distance:3.4,yaw:Vn(Math.cos(U.dir+.9),Math.sin(U.dir+.9)),pitch:.42,hour:15,overlay:[0,0,0,0]}}if(e.holua){const U=e.holua,k=(U.x0+U.x1)/2,B=(U.z0+U.z1)/2,C=U.x1-U.x0,N=U.z1-U.z0,Z=Math.hypot(C,N)||1;T.holua={target:u(k,B),distance:6.5,yaw:Vn(-N/Z,C/Z)+.25,pitch:.33,hour:16,overlay:[0,0,0,0]}}T.malama={target:u(F,W),distance:300,yaw:2.5,pitch:.5,hour:17.4,overlay:[.6,0,.5,0]};for(const U of Object.values(T))ev(U,n);if(D.length){const U=mv(s,n,T,D);U&&(T.akua=U.view,s.waterfalls.setHero(U.h,U.info))}s.waterfalls&&gv(s,T.nahele);const G={akua:[i.topX,i.topZ],nahele:g(520),loi:T.loi?[T.loi.target.x,T.loi.target.z]:null,kauhale:[p.x,p.z],heiau:_?[_.x,_.z]:null,kahakai:y?[y.x,y.z]:null,loko:x?[x.cx+x.ax*x.r*.5,x.cz+x.az*x.r*.5]:null,koa:w?[w.x,w.z]:null,surf:P?[P.x,P.z]:null,kula:X,ahu:b?[b.x,b.z]:null,puuhonua:e.puuhonua?[e.puuhonua.x,e.puuhonua.z]:null,holua:e.holua?[(e.holua.x0+e.holua.x1)/2,(e.holua.z0+e.holua.z1)/2]:null};return{views:T,anchors:G,model:i}}function ev(s,t){for(let e=0;e<8;e++){const n=Math.cos(s.pitch),i=new z(s.target.x+s.distance*n*Math.sin(s.yaw),s.target.y+s.distance*Math.sin(s.pitch),s.target.z+s.distance*n*Math.cos(s.yaw));let o=!1;for(let r=1;r<24;r++){const a=r/24,l=i.x+(s.target.x-i.x)*a,c=i.y+(s.target.y-i.y)*a,h=i.z+(s.target.z-i.z)*a;if(Math.max(0,t.heightAt(l,h))>c-.03){o=!0;break}}if(!o)return;s.pitch=Math.min(1.3,s.pitch+.07)}}const nv=[.1,.14,.18,.22,.26,.3,.34],iv=[.6,.7,.8,.9,1,1.12,1.25,1.4],Dn=.05,fo=41,ya=Math.tan(21*Math.PI/180),Ia=650*Nt,sv=.33,Fa=1.47,ka=s=>(t,e)=>Math.max(0,s.heightAt(t,e)),za=(s,t,e)=>{const n=Math.min(1,Math.max(0,(e-s)/(t-s)));return n*n*(3-2*n)};function ov(s,t,e,n,i,o,r,a=r){for(let l=1;l<o;l++){const c=l/o,h=t.x+(e-t.x)*c,f=t.z+(i-t.z)*c,u=t.y+(n-t.y)*c,d=Math.hypot(e-h,i-f)>1?a:r;if(s(h,f)>u-d)return!1}return!0}const Vi=(s,t,e,n,i)=>s.set(t.x+n*Math.cos(i)*Math.sin(e),t.y+n*Math.sin(i),t.z+n*Math.cos(i)*Math.cos(e)),av=s=>.12+.03*s+.05;function sa(s,t,e){const n=Math.hypot(e.x-t.x,e.z-t.z),i=Math.max(16,Math.ceil(n/.25));for(let o=1;o<i;o++){const r=o/i,a=(1-r)*n,l=.03+sv*za(.4,1.2,a)+(r*n<1?.08:0);if(s(t.x+(e.x-t.x)*r,t.z+(e.z-t.z)*r)>t.y+(e.y-t.y)*r-l)return!1}return!0}function Pc(s,t,e,n,i,o,r){return t.y>r||t.y<s(t.x,t.z)+av(n)||!ov(s,t,e.x,e.y,e.z,24,.03)?!1:sa(s,t,e)&&sa(s,t,o)&&sa(s,t,i.lip)}function Il(s,t,e,n,i,o,r,a){const l=new z,c=new Uint8Array(fo);for(let h=0;h<fo;h++)c[h]=Pc(s,Vi(l,e,i+(h-20)*Dn,o,r),e,o,t,n,a)?1:0;return c}function Fl(s,t){if(!s||!s[t])return null;let e=t,n=t;for(;e>0&&s[e-1];)e--;for(;n<fo-1&&s[n+1];)n++;return[(e-t)*Dn,(n-t)*Dn]}const rv=s=>{const t=s.lip.y-s.base.y;return new z(s.base.x+(s.lip.x-s.base.x)*.55,s.base.y+t*.55,s.base.z+(s.lip.z-s.base.z)*.55)};function lv(s,t,e,n){const i=[];return s.waterfalls.heroes.forEach((o,r)=>{const l=.5*Math.min(1,o.per*.5+.6*za(3e3,8e3,o.rain))-(r===0?0:.004*Math.hypot(o.lip.x-e,o.lip.z-n));for(const c of cv(s,t,o))c.score+=l,i.push(c)}),i.sort((o,r)=>r.score-o.score).slice(0,60)}function cv(s,t,e){const n=ka(t),i=Math.atan2(e.face[0],e.face[1]),o=new z(e.pool.x,n(e.pool.x,e.pool.z),e.pool.z),r=e.lip.y-e.base.y,a=rv(e),l=Ia-.6,c=(_,x)=>{const y=_.x+e.face[0]*.08,w=_.z+e.face[1]*.08;for(let M=.1;M<30;M+=.08)if(n(y+x.x*M,w+x.z*M)>_.y+x.y*M)return!1;return!0},h=[],f={};for(let _=7.4;_<=10.61;_+=.2){const x=gc(s.clock.doy,_,f).sun.clone();x.y<.12||h.push({hr:_,sun:x,front:x.x*e.face[0]+x.z*e.face[1],lit:c(a,x),litPool:c(o,x),litLip:c(e.lip,x)})}if(!h.length)return[];const u=r/Math.tan(12*Math.PI/180),d=new z,v=new z,g=new z,p=new z,m=[];for(const _ of iv){const x=_*u;for(const y of nv){const w=Il(n,e,o,a,i,x,y,l);if(!w.some(E=>E))continue;const M=Il(n,e,o,a,i,x*Fa,y,l);for(let E=0;E<fo;E++){const P=Fl(w,E);if(!P||P[1]-P[0]<.25)continue;const S=Fl(M,E),b=(E-20)*Dn,F=i+b;Vi(d,o,F,x,y);const W=n(d.x,d.z);v.subVectors(e.lip,d).normalize(),g.subVectors(e.base,d).normalize();const X=Math.acos(Math.min(1,v.dot(g)))*180/Math.PI;p.subVectors(e.mist,d).normalize();const T=P[1]-P[0],D=-.04*Math.abs(X-13)-.08*Math.max(0,10.5-X)-.6*Math.max(0,.12-y)-.4*Math.max(0,y-.3)-.25*Math.abs(b)-.35*Math.max(0,1-(d.y-W))+.3*Math.min(.8,T)-(S?.3*Math.max(0,.4-(S[1]-S[0])):.25);let G=-1/0,U=8.2;for(const{hr:k,sun:B,front:C,lit:N,litPool:Z,litLip:O}of h){const $=Math.acos(Math.max(-1,Math.min(1,-p.dot(B))))*180/Math.PI,K=(N?Math.max(0,C)+.3:0)+.12*Z+.08*O-.6*Math.max(0,.38-B.y)+.15*za(.45,.8,B.y)-(N&&C>.35?.01*Math.min(20,Math.abs($-41.5)):0);K>G&&(G=K,U=k)}m.push({h:e,score:D+G,hour:U,yaw:F,dist:x,pitch:y,arc:P,arcP:S,tgt:o,mid:a})}}}return m}function hv(s,t,e){const n=new z().subVectors(e,t).normalize(),i=new z().crossVectors(n,new z(0,1,0)).normalize(),o=new z().crossVectors(i,n),r=new z,a=new z;let l=0;const c=[-.7,-.35,0,.3];for(const h of c){r.copy(n).addScaledVector(i,h*ya*1.6).addScaledVector(o,.75*ya).normalize();let f=!1;for(let u=.3;u<15&&(a.copy(t).addScaledVector(r,u),!(a.y>Ia));u+=.15+u*.02)if(a.y<s(a.x,a.z)){f=!0;break}f||l++}return l/c.length}function kl(s,t,e,n,i){if(!n)return!0;const o=new z;for(let r=n[0];r<=n[1]+1e-6;r+=Dn)if(!Pc(s,Vi(o,e,t.yaw+r,i,t.pitch),e,i,t.h,t.mid,Ia-.6))return!1;return!0}function uv(s,t){const e=ka(s),n=new z(Math.cos(t.yaw),0,-Math.sin(t.yaw));let i=t.tgt;for(const a of[.08,.05,.025]){const l=t.tgt.clone().addScaledVector(n,a*t.dist);if(l.y=e(l.x,l.z),!(Math.abs(l.y-t.tgt.y)>=.4)&&!(!kl(e,t,l,t.arc,t.dist)||!kl(e,t,l,t.arcP,t.dist*Fa))){i=l;break}}const o=Math.min(.6,Math.max(0,(t.mid.y-i.y)/(.45*t.dist))),r={target:i,distance:t.dist,yaw:t.yaw,pitch:t.pitch,hour:Math.round(t.hour*10)/10,lookUp:o,weather:"moae",spate:1,overlay:[0,0,0,0]};return r.orbit=[t.yaw+t.arc[0],t.yaw+t.arc[1]],t.arcP&&(r.orbitPortrait=[t.yaw+t.arcP[0],t.yaw+t.arcP[1]]),fv(r,t.mid),r}function fv(s,t){const e=s.lookUp,n=Math.cos(s.pitch),i=o=>{const r=s.distance*Math.sqrt(1/o),a=s.target.x+r*n*Math.sin(s.yaw),l=s.target.y+r*Math.sin(s.pitch),c=s.target.z+r*n*Math.cos(s.yaw),h=Math.atan2(t.y-l,Math.hypot(t.x-a,t.z-c))-Math.atan(.42*ya);return(l+r*n*Math.tan(h)-s.target.y)/(.45*r)};Object.defineProperty(s,"lookUp",{enumerable:!0,get:()=>{const o=typeof innerWidth=="number"?innerWidth/Math.max(1,innerHeight):1.6;return o<1?i(o):e}})}function dv(s,t,e,n,i){const o=Object.create(Object.getPrototypeOf(s.rig)),r=()=>({target:e.target.clone(),distance:e.distance,yaw:e.yaw+i,pitch:e.pitch,lift:e.lookUp||0});Object.assign(o,{camera:new Xe(42,1.6,.1,9e3),terrain:t,state:r(),goal:r(),flight:null,floor:0,autoOrbit:0,lastInput:-1e12,_v:new z,_prevXZ:null}),o.apply(0);for(let v=0;v<30;v++)o.update(1/60);const a=o.floor,l=o.goal.target.distanceTo(n.target),c=Math.min(6,2.2+Math.sqrt(l)*.22+Math.abs(Math.log(n.distance/o.goal.distance))*.35);o.flyTo({target:n.target,distance:n.distance,yaw:n.yaw,pitch:n.pitch,lift:n.lookUp||0},c),o.autoOrbit=n.distance<60?.012:.02;let h=a,f=0,u=o.camera.position.y,d=u;for(let v=Math.round((c+1.5)*60);v>0;v--){o.update(1/60),o.floor>h&&(h=o.floor);const g=o.camera.position.y;f=Math.max(f,Math.abs(g-2*d+u)*3600),u=d,d=g}return{lift:h-a,acc:f}}function pv(s,t,e,n){if(!s.rig)return{acc:0,accNext:0};const i=[e.nahele,e.ahupuaa].filter(Boolean);let o=0,r=0;const a=(l,c,h)=>{const f=dv(s,t,l,c,h);return f.lift>.005?!1:(o=Math.max(o,f.acc),(l===e.nahele||c===e.nahele)&&(r=Math.max(r,f.acc)),!0)};for(const l of i)if(!a(l,n,.048)||!a(l,n,.6)||!a(n,l,0))return null;for(const l of[0,1]){const c=l===0?Dn:-Dn;let h=n.orbit[l]-n.yaw;for(;Math.abs(h)>1e-6&&!i.every(f=>a(n,f,h));)h=Math.abs(h)<=Dn+1e-6?0:h+c;n.orbit[l]=n.yaw+h}return n.orbit[1]-n.orbit[0]<.1?null:(n.orbitPortrait&&(n.orbitPortrait=[Math.max(n.orbitPortrait[0],n.orbit[0]),Math.min(n.orbitPortrait[1],n.orbit[1])]),{acc:o,accNext:r})}function mv(s,t,e,n){const i=ka(t),o=new z,r=new z;for(const d of n)Vi(o,d.tgt,d.yaw,d.dist,d.pitch),r.set(d.tgt.x,d.mid.y,d.tgt.z),d.open=hv(i,o,r),d.score+=.2*d.open;n.sort((d,v)=>v.score-d.score);let a=null;for(const d of n){if(a&&d.score<=a.final)break;const v=uv(t,d),g=pv(s,t,e,v);if(!g)continue;const p=d.score-.004*Math.max(0,g.acc-60)-.003*Math.max(0,g.accNext-15);(!a||p>a.final)&&(a={c:d,v,final:p,acc:g.acc,accNext:g.accNext})}if(!a)return null;const{c:l,v:c}=a,h=l.h;for(const[d,v]of[[c.orbit,c.distance],[c.orbitPortrait,c.distance*Fa]])if(d)for(let g=d[0];g<=d[1]+1e-6;g+=Dn)s.waterfalls.clearSight(Vi(o,c.target,g,v,c.pitch).clone(),[h.pool,l.mid,h.lip]);const f=d=>Math.round(d*100)/100,u=d=>d&&d.map(v=>f(v-c.yaw));return{view:c,h,info:{score:f(a.final),open:l.open,arc:u(c.orbit),arcP:u(c.orbitPortrait),acc:Math.round(a.acc),accNext:Math.round(a.accNext)}}}function gv(s,t){if(!t)return;const e=new Xe(42,1.6,.1,9e3);Vi(e.position,t.target,t.yaw,t.distance,t.pitch);const n=new z,i=new z;for(let o=t.lookUp||0;o<=.3+1e-6;o+=.05){e.lookAt(t.target.x,t.target.y+o*t.distance*.45,t.target.z),e.updateMatrixWorld();let r=!1;for(const a of s.waterfalls.heroes)n.copy(a.lip).project(e),i.copy(a.base).project(e),i.z<1&&Math.abs(i.x)<.9&&Math.abs(i.y)<.9&&n.y>.88&&(r=!0);if(!r){o>0&&(t.lookUp=o);return}}}const De=(s,t=document)=>t.querySelector(s),pe=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,o]of Object.entries(t))i==="class"?n.className=o:i.startsWith("on")?n.addEventListener(i.slice(2),o):n.setAttribute(i,o);return e&&(n.innerHTML=e),n},vv=s=>{const t=Math.floor(s),e=Math.floor((s-t)*60);return`${t}:${String(e).padStart(2,"0")}`},xv=s=>s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;class _v{constructor(t){this.app=t,this.meta=t.island.meta;const e=tv(t);this.views=e.views,this.anchors=e.anchors,this.model=e.model,this.stops=Jg.filter(n=>this.views[n.id]),this.mode="tour",this.index=-1,this.playing=!1,this.arrivedAt=0,this.overlayGoal=new me(0,0,0,0),this.focusGoal=0,this.layer={lines:!1,zones:!1,pins:!0},this.timeTween=null,this.counts=this.countFeatures(),this.build(),this.bind(),t.updaters.push(n=>this.update(n))}countFeatures(){const t=this.meta.sites,e={},n=(i,o,r=1)=>{e[i]=e[i]||{loi:0,hale:0,heiau:0,loko:0,koa:0},e[i][o]+=r};for(const i of t.loi)n(i.id,"loi",i.paddies.length);for(const i of t.houses)n(i.village,"hale");for(const i of t.heiau)n(i.id,"heiau");for(const i of t.ponds)n(i.id,"loko");for(const i of t.koa)n(i.id,"koa");return e}build(){const t=pe("div",{id:"ui"});document.body.appendChild(t),this.root=t,t.appendChild(pe("div",{class:"brand"},`<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${xe("akua",14)}<span></span>${xe("loko",14)}</div>`)),this.modeEl=pe("div",{class:"modes"}),this.modeEl.append(pe("button",{class:"mode on","data-mode":"tour",title:"Guided tour","aria-label":"Guided tour"},`${xe("tour",18)}<span>Tour</span>`),pe("button",{class:"mode","data-mode":"explore",title:"Explore freely","aria-label":"Explore freely"},`${xe("explore",18)}<span>Explore</span>`)),t.appendChild(this.modeEl),this.tools=pe("div",{class:"tools"});const e=(r,a,l)=>pe("button",{class:"tool","data-tool":r,title:l,"aria-label":l},xe(a,20));this.tools.append(e("lines","lines","Ahupuaʻa boundaries"),e("zones","zones","Zones, mountain to sea"),e("pins","pins","Places"),e("help","help","About"),e("full","expand","Full screen")),t.appendChild(this.tools),this.legend=pe("div",{class:"legend"}),Rl.forEach((r,a)=>this.legend.appendChild(pe("div",{class:"lg"},`<i style="background:${ms[a]}"></i><b>${r.name}</b><em>${r.gloss}</em>`))),t.appendChild(this.legend),this.card=pe("section",{class:"card","aria-live":"polite"}),t.appendChild(this.card),this.rail=pe("nav",{class:"rail","aria-label":"Tour stops"}),this.playBtn=pe("button",{class:"play",title:"Play the tour","aria-label":"Play the tour"},xe("play",18)),this.rail.appendChild(this.playBtn),this.dots=this.stops.map((r,a)=>{const l=pe("button",{class:"dot",title:r.title,"aria-label":r.title,"data-i":a},xe(r.icon,18));return this.rail.appendChild(l),l}),this.progress=pe("div",{class:"rail-progress"},"<span></span>"),this.rail.appendChild(this.progress),t.appendChild(this.rail),this.markerLayer=pe("div",{class:"markers"}),t.appendChild(this.markerLayer),this.markers=this.stops.filter(r=>this.anchors[r.id]).map(r=>{const a=pe("button",{class:"marker",title:r.title,"aria-label":r.title},`${xe(r.icon,18)}<span>${r.title}</span>`);a.addEventListener("click",h=>{h.stopPropagation(),this.openStop(this.stops.indexOf(r),{fly:!0,explore:!0})}),this.markerLayer.appendChild(a);const[l,c]=this.anchors[r.id];return{el:a,stop:r,pos:new z(l,0,c),vis:0}});for(const r of this.markers)r.pos.y=Math.max(0,this.app.terrain.heightAt(r.pos.x,r.pos.z))+.05;this.inspector=pe("div",{class:"inspector"}),t.appendChild(this.inspector),this.dock=pe("div",{class:"dock"}),this.dock.innerHTML=`
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
      <div class="wind" title="Wind"><span class="wind-arrow">${xe("wind",22)}</span><span class="wind-speed"></span></div>`,t.appendChild(this.dock);const n=De(".regimes",this.dock);for(const r of["auto","moae","kona","malie"])n.appendChild(pe("button",{class:"chip","data-regime":r,title:`${Js[r].name} — ${Js[r].gloss}`,"aria-label":Js[r].name},xe(r,18)));const i=De(".seasons",this.dock);for(const r of["kau","hooilo"])i.appendChild(pe("button",{class:"chip","data-season":r,title:`${ia[r].name} — ${ia[r].gloss}`,"aria-label":ia[r].name},xe(r,18)));const o=De(".speeds",this.dock);for(const[r,a,l]of[["0",0,"pause"],["1",30,"speed1"],["2",240,"speed2"],["3",1800,"speed3"]])o.appendChild(pe("button",{class:"chip","data-speed":a,title:a?`${a}× time`:"Pause time","aria-label":a?`${a} times speed`:"Pause"},xe(l,16)));this.help=pe("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${xe("close",18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`,t.appendChild(this.help)}bind(){this.modeEl.addEventListener("click",a=>{const l=a.target.closest("[data-mode]");l&&this.setMode(l.dataset.mode)}),this.tools.addEventListener("click",a=>{var h,f,u;const l=a.target.closest("[data-tool]");if(!l)return;const c=l.dataset.tool;c==="help"?this.help.classList.toggle("hidden"):c==="full"?document.fullscreenElement?(h=document.exitFullscreen)==null||h.call(document):(u=(f=document.documentElement).requestFullscreen)==null||u.call(f).catch(()=>{}):(this.layer[c]=!this.layer[c],this.applyLayers())}),this.help.addEventListener("click",a=>{(a.target===this.help||a.target.closest(".help-close"))&&this.help.classList.add("hidden")}),this.rail.addEventListener("click",a=>{const l=a.target.closest(".dot");l&&(this.setMode("tour",!1),this.goto(Number(l.dataset.i)))}),this.playBtn.addEventListener("click",()=>this.setPlaying(!this.playing)),this.dock.addEventListener("click",a=>{const l=a.target.closest("[data-regime]"),c=a.target.closest("[data-season]"),h=a.target.closest("[data-speed]");l&&this.app.weather.setMode(l.dataset.regime),c&&this.setSeason(c.dataset.season),h&&(this.app.clock.speed=Number(h.dataset.speed)),this.refreshDock()});const t=De(".dial-svg",this.dock);let e=!1;const n=a=>{const l=t.getBoundingClientRect(),c=(a.clientX-l.left)/l.width*120,h=(a.clientY-l.top)/l.height*64;let f=Math.atan2(58-h,c-60);f<0&&(f=f<-Math.PI/2?Math.PI:0);const u=6+(Math.PI-f)/Math.PI*12;this.timeTween=null,this.app.clock.hour=u};t.addEventListener("pointerdown",a=>{e=!0,t.setPointerCapture(a.pointerId),n(a)}),t.addEventListener("pointermove",a=>e&&n(a)),t.addEventListener("pointerup",()=>e=!1);const i=this.app.canvas;let o=null;i.addEventListener("pointerdown",a=>o={x:a.clientX,y:a.clientY,t:performance.now()}),i.addEventListener("pointerup",a=>{if(!o)return;Math.hypot(a.clientX-o.x,a.clientY-o.y)<5&&performance.now()-o.t<400&&this.pick(a.clientX,a.clientY),o=null});let r=0;i.addEventListener("pointermove",a=>{if(a.buttons||a.pointerType==="touch")return;const l=performance.now();l-r<60||(r=l,this.hover(a.clientX,a.clientY))}),i.addEventListener("pointerleave",()=>this.hover(null)),addEventListener("keydown",a=>{a.key==="ArrowRight"&&!a.shiftKey&&this.mode==="tour"?(a.preventDefault(),this.goto(this.index+1)):a.key==="ArrowLeft"&&!a.shiftKey&&this.mode==="tour"?(a.preventDefault(),this.goto(this.index-1)):a.key==="Escape"?this.help.classList.contains("hidden")?this.closeCard():this.help.classList.add("hidden"):a.key===" "&&this.mode==="tour"&&a.target===document.body&&(a.preventDefault(),this.setPlaying(!this.playing))}),this.app.rig.onUserInput=()=>{this.playing&&this.setPlaying(!1)}}setMode(t,e=!0){if(this.mode===t&&e){t==="tour"&&this.index<0&&this.goto(0);return}this.mode=t;for(const n of this.modeEl.querySelectorAll(".mode"))n.classList.toggle("on",n.dataset.mode===t);this.root.classList.toggle("exploring",t==="explore"),t==="explore"?(this.setPlaying(!1),this.closeCard(),this.focusGoal=0,this.app.rig.autoOrbit=0,this.app.clock.speed=Math.max(this.app.clock.speed,30),this.applyLayers()):e&&this.goto(Math.max(0,this.index))}applyLayers(){for(const t of this.tools.querySelectorAll("[data-tool]")){const e=t.dataset.tool;e in this.layer&&t.classList.toggle("on",this.layer[e])}this.legend.classList.toggle("show",this.layer.zones),this.markerLayer.classList.toggle("hidden",!this.layer.pins||this.mode!=="explore"),this.mode==="explore"&&this.overlayGoal.set(this.layer.lines?1:0,this.layer.zones?1:0,this.layer.lines?.5:0,this.layer.lines?.8:.35)}setSeason(t){const e=this.app.clock;e.doy=t==="kau"?172:355,this.app.season=t,this.refreshDock()}setPlaying(t){this.playing=t,this.playBtn.innerHTML=xe(t?"pause":"play",18),this.playBtn.classList.toggle("on",t),t&&this.mode!=="tour"&&this.setMode("tour"),t&&(this.arrivedAt=performance.now())}goto(t){if(t<0||t>=this.stops.length){t>=this.stops.length&&this.setPlaying(!1);return}this.openStop(t,{fly:!0,explore:!1})}openStop(t,{fly:e,explore:n}){this.index=t;const i=this.stops[t],o=this.views[i.id];if(this.dots.forEach((u,d)=>{u.classList.toggle("on",d===t),u.classList.toggle("done",d<t)}),this.renderCard(i,n),!o)return;const r=this.app.rig,a=r.goal.target.distanceTo(o.target),l=Math.min(6,2.2+Math.sqrt(a)*.22+Math.abs(Math.log(o.distance/r.goal.distance))*.35),c=innerWidth/Math.max(1,innerHeight),h=o.distance*(c<1?Math.pow(1/c,o.distance>40?1:.5):1);e&&r.flyTo({target:o.target,distance:h,yaw:o.yaw,pitch:o.pitch,lift:o.lookUp||0},l,{onDone:()=>this.arrivedAt=performance.now()}),this.arrivedAt=performance.now()+l*1e3,r.autoOrbit=o.distance<60?.012:.02;const f=this.app.clock;if(o.doy!==void 0&&Math.abs(o.doy-f.doy)>2?f.doy=o.doy:o.doy===void 0&&this.lastDoy!==void 0&&f.doy!==this.lastDoy&&(f.doy=this.lastDoy),o.doy===void 0&&(this.lastDoy=f.doy),o.hour!==void 0){let u=o.hour-f.hour;u<-12&&(u+=24),u>12&&(u-=24),this.timeTween={from:f.hour,by:u,t:0,dur:l}}if(f.speed=20,o.weather&&this.app.weather.setMode(o.weather),this.app.weather.boost=o.boost?1:0,o.showers)for(const[u,d]of o.showers)this.app.weather.spawnShower(u,d,5+Math.random()*3,.7);if(o.ahu&&this.app.life&&this.app.life.walkTo(o.ahu.x,o.ahu.z),!n){const u=o.overlay||[0,0,0,0];this.overlayGoal.set(u[0],u[1],u[2],u[3]),this.focusGoal=o.focus||0}}renderCard(t,e){var o,r,a,l;const n=t.zone!==void 0&&t.zone!==null?Rl[t.zone]:null,i=this.stops.length;this.card.innerHTML=`
      <header>
        <div class="card-icon">${xe(t.icon,26)}</div>
        <div class="card-titles"><h1>${t.title}</h1><p class="gloss">${t.gloss}</p></div>
        <button class="card-close" aria-label="Close">${xe("close",18)}</button>
      </header>
      ${n?`<div class="zone-chip"><i style="background:${ms[t.zone]}"></i>${n.name}<em>${n.gloss}</em></div>`:""}
      <div class="card-body">${t.text.map(c=>`<p>${c}</p>`).join("")}</div>
      ${e?"":`<footer>
        <button class="nav prev" aria-label="Previous" ${this.index===0?"disabled":""}>${xe("prev",18)}</button>
        <span class="count">${this.index+1} / ${i}</span>
        ${this.index===i-1?`<button class="nav finish" aria-label="Explore">${xe("explore",18)}<span>Explore</span></button>`:`<button class="nav next" aria-label="Next">${xe("next",18)}</button>`}
      </footer>`}`,this.card.classList.add("show"),this.card.scrollTop=0,(o=De(".prev",this.card))==null||o.addEventListener("click",()=>this.goto(this.index-1)),(r=De(".next",this.card))==null||r.addEventListener("click",()=>this.goto(this.index+1)),(a=De(".finish",this.card))==null||a.addEventListener("click",()=>this.setMode("explore")),(l=De(".card-close",this.card))==null||l.addEventListener("click",()=>this.closeCard())}closeCard(){this.card.classList.remove("show")}regionAt(t,e){const n=this.app.island.data.region,i=te,o=Math.floor((t+vt)/Kt*i),r=Math.floor((e+vt)/Kt*i);return o<0||r<0||o>=i||r>=i?0:n[(r*i+o)*4]}hover(t,e){if(t===null||this.mode!=="explore"){this.app.shared.uniforms.uHover.value=0,this.pinned||this.inspector.classList.remove("show");return}const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(this.app.shared.uniforms.uHover.value=i,!this.pinned){if(!i){this.inspector.classList.remove("show");return}this.showInspector(i,t,e)}}pick(t,e){if(this.mode!=="explore")return;const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(!i||i===this.focusGoal){this.focusGoal=0,this.pinned=!1,this.inspector.classList.remove("show","pinned");return}this.focusGoal=i,this.pinned=!0,this.showInspector(i,t,e,!0)}showInspector(t,e,n,i=!1){const o=this.meta.ahupuaa.find(c=>c.id===t);if(!o)return;if(this.inspectorId!==t){this.inspectorId=t;const c=Sg[o.moku],h=this.counts[t]||{},f=(u,d)=>d?`<span class="st">${xe(u,15)}${d}</span>`:"";this.inspector.innerHTML=`
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${o.moku+1})"></i>${c.name}<em>${c.gloss}</em></span></div>
        ${Mv(o.profile)}
        <div class="in-stats"><span class="st">${o.area.toFixed(1)} km²</span><span class="st">${xe("akua",15)}${Math.round(o.top)} m</span>${f("loi",h.loi)}${f("kauhale",h.hale)}${f("heiau",h.heiau)}${f("loko",h.loko)}${f("koa",h.koa)}</div>`}this.inspector.classList.add("show"),this.inspector.classList.toggle("pinned",i);const r=innerWidth,a=Math.min(r-300,e+18),l=Math.max(70,Math.min(innerHeight-220,n+18));this.inspector.style.transform=`translate(${a}px, ${l}px)`}update(t){const e=this.app,n=e.shared.uniforms,i=1-Math.exp(-t*3);if(e.overlay.lerp(this.overlayGoal,i),this.focusGoal?(n.uFocus.value=this.focusGoal,n.uFocusK.value+=(1-n.uFocusK.value)*i):(n.uFocusK.value+=(0-n.uFocusK.value)*i,n.uFocusK.value<.01&&(n.uFocus.value=0)),this.timeTween){const o=this.timeTween;o.t=Math.min(1,o.t+t/o.dur),e.clock.hour=((o.from+o.by*xv(o.t))%24+24)%24,o.t>=1&&(this.timeTween=null)}if(this.playing&&this.mode==="tour"&&!e.rig.flight){const r=this.stops[this.index].text.join(" ").split(/\s+/).length,a=Math.max(9,r*.32)*1e3,l=performance.now()-this.arrivedAt;De("span",this.progress).style.width=`${Math.min(100,l/a*100)}%`,l>a&&(this.index<this.stops.length-1?this.goto(this.index+1):this.setPlaying(!1))}else De("span",this.progress).style.width="0%";this.updateMarkers(),this.frameN=(this.frameN||0)+1,this.frameN%6===0&&this.refreshDock()}updateMarkers(){if(this.mode!=="explore"||!this.layer.pins)return;const t=this.app.camera,e=innerWidth,n=innerHeight,i=new z,o=[],r=this.markers.map(a=>({m:a,d:t.position.distanceTo(a.pos)})).sort((a,l)=>a.d-l.d);for(const{m:a,d:l}of r){i.copy(a.pos).project(t);const c=i.z>1,h=(i.x+1)/2*e,f=(1-i.y)/2*n;let u=!c&&h>-40&&h<e+40&&f>60&&f<n+40&&l<420;u&&o.some(d=>Math.abs(d[0]-h)<44&&Math.abs(d[1]-f)<40)&&(u=!1),u&&o.push([h,f]),a.el.style.opacity=u?String(Math.min(1,(420-l)/120)):"0",a.el.style.pointerEvents=u?"auto":"none",u&&(a.el.style.transform=`translate(${h}px, ${f}px)`),a.el.classList.toggle("near",l<40)}}refreshDock(){const t=this.app,e=t.clock,n=t.light,i=De(".dial-body",this.dock),o=(e.hour-6)/12,r=e.hour<6||e.hour>18;let a;if(!r)a=Math.PI-o*Math.PI;else{const p=(e.hour-18+24)%24/12;a=Math.PI-p*Math.PI}const l=60+Math.cos(a)*52,c=58-Math.sin(a)*52;i.setAttribute("transform",`translate(${l.toFixed(1)} ${c.toFixed(1)})`),i.classList.toggle("moon",r),De(".dial-time",this.dock).textContent=vv(e.hour);const h=Am[t.sky.astro.night]||"",f=De(".dial-night",this.dock);f.textContent=n.night>.5?`Pō ${h}`:"",f.title="The night of the Hawaiian lunar month";for(const p of this.dock.querySelectorAll("[data-regime]"))p.classList.toggle("on",t.weather.mode===p.dataset.regime);const u=e.doy>120&&e.doy<305?"kau":"hooilo";t.season=u;for(const p of this.dock.querySelectorAll("[data-season]"))p.classList.toggle("on",u===p.dataset.season);for(const p of this.dock.querySelectorAll("[data-speed]"))p.classList.toggle("on",Number(p.dataset.speed)===e.speed||e.speed===20&&p.dataset.speed==="30");const d=t.weather.wind,v=Math.atan2(d.x,-d.y)*180/Math.PI;De(".wind-arrow",this.dock).style.transform=`rotate(${v.toFixed(0)}deg)`,De(".wind-speed",this.dock).textContent=`${Math.round(d.length()*3.6)} km/h`;const g=Js[t.weather.regime];De(".wind",this.dock).title=`${g.name} — ${g.gloss}`}start(){this.setMode("tour",!1),this.applyLayers(),this.goto(0)}}function Mv(s){if(!s||s.length<2)return"";const t=260,e=78,n=s[s.length-1][0],i=Math.max(...s.map(u=>u[1]),200),o=Math.min(...s.map(u=>u[1]),-30),r=(e-14)/(i-o),a=u=>t-u/n*(t-4)-2,l=u=>e-6-(u-o)*r,c=l(0);let h="";for(let u=0;u<s.length-1;u++){const d=s[u],v=s[u+1];h+=`<path d="M${a(d[0]).toFixed(1)} ${c.toFixed(1)}L${a(d[0]).toFixed(1)} ${l(d[1]).toFixed(1)}L${a(v[0]).toFixed(1)} ${l(v[1]).toFixed(1)}L${a(v[0]).toFixed(1)} ${c.toFixed(1)}Z" fill="${ms[d[2]]}" stroke="${ms[d[2]]}" stroke-width=".6"/>`}const f=s.map((u,d)=>`${d?"L":"M"}${a(u[0]).toFixed(1)} ${l(u[1]).toFixed(1)}`).join("");return`<svg class="profile" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none">
    <rect x="0" y="${c.toFixed(1)}" width="${t}" height="${(e-c).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${h}
    <path d="${f}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${t}" y1="${c.toFixed(1)}" y2="${c.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`}const po=document.getElementById("boot"),yv=po.querySelector(".boot-bar span"),Dc=po.querySelector(".boot-stage"),wv={shape:["raising the shields",.02,.1],erode:["the rain carves valleys",.1,.42],valleys:["filling the valley floors",.42,.55],coast:["growing the reef",.55,.7],divide:["tracing the ridgelines",.66,.7],detail:["shaping the ridges",.7,.8],people:["the people arrive",.8,.86],light:["reading the light",.86,.94],sky:["gathering clouds",.94,.99],done:["",1,1]};function Sv(s){return new Promise((t,e)=>{const n=new Worker(new URL(""+new URL("worker-CFU0dfvI.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=i=>{const o=i.data;if(o.type==="progress"){const r=wv[o.stage];if(!r)return;Dc.textContent=r[0],yv.style.width=`${(r[1]+(r[2]-r[1])*o.p)*100}%`}else o.type==="done"?(n.terminate(),t({data:o.data,meta:o.meta})):o.type==="error"&&(n.terminate(),e(new Error(o.message)))},n.onerror=i=>e(i),n.postMessage({seed:s})})}async function bv(){const s=performance.now(),t=await Sv(Bc);console.log(`island generated in ${((performance.now()-s)/1e3).toFixed(1)} s`);const e=new Zg(document.getElementById("scene"),t),n=new _v(e);window.__app=e,e.ui=n;let i=0;const o=()=>{if(++i<4)return requestAnimationFrame(o);po.classList.add("gone"),setTimeout(()=>po.remove(),1200),new URLSearchParams(location.search).has("cam")||n.start()};requestAnimationFrame(o)}bv().catch(s=>{console.error(s),Dc.textContent="something went wrong — see the console"});
