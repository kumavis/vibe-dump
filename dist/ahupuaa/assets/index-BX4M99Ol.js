(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const Zt=360,pt=Zt/2,go=.01,Lh=1.3,Nt=go*Lh,yn=2048,ee=1024,Dh=20261004;function Ca(s){const t=(s+180)*Math.PI/180;return[Math.sin(t),-Math.cos(t)]}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $a="160",Uh=0,xr=1,Fh=2,bc=1,Ih=2,Dn=3,Bn=0,Ve=1,je=2,Kn=0,Gi=1,Ra=2,_r=3,Mr=4,zh=5,li=100,kh=101,Nh=102,yr=103,wr=104,Oh=200,Bh=201,Hh=202,Gh=203,Pa=204,La=205,Vh=206,Wh=207,qh=208,Xh=209,Yh=210,jh=211,$h=212,Kh=213,Zh=214,Jh=0,Qh=1,tu=2,So=3,eu=4,nu=5,iu=6,su=7,Ec=0,ou=1,au=2,Zn=0,ru=1,lu=2,cu=3,hu=4,uu=5,fu=6,Tc=300,Yi=301,ji=302,Da=303,Ua=304,Uo=306,pi=1e3,$e=1001,Fa=1002,fe=1003,Sr=1004,Vo=1005,ie=1006,du=1007,mi=1008,sn=1009,pu=1010,mu=1011,Ka=1012,Ac=1013,In=1014,gn=1015,Hn=1016,Cc=1017,Rc=1018,ui=1020,gu=1021,ke=1023,vu=1024,xu=1025,fi=1026,$i=1027,Vi=1028,Pc=1029,_u=1030,Lc=1031,Dc=1033,Wo=33776,qo=33777,Xo=33778,Yo=33779,br=35840,Er=35841,Tr=35842,Ar=35843,Uc=36196,Cr=37492,Rr=37496,Pr=37808,Lr=37809,Dr=37810,Ur=37811,Fr=37812,Ir=37813,zr=37814,kr=37815,Nr=37816,Or=37817,Br=37818,Hr=37819,Gr=37820,Vr=37821,jo=36492,Wr=36494,qr=36495,Mu=36283,Xr=36284,Yr=36285,jr=36286,Fc=3e3,di=3001,yu=3200,wu=3201,Su=0,bu=1,cn="",Le="srgb",Gn="srgb-linear",Za="display-p3",Fo="display-p3-linear",bo="linear",le="srgb",Eo="rec709",To="p3",xi=7680,$r=519,Eu=512,Tu=513,Au=514,Ic=515,Cu=516,Ru=517,Pu=518,Lu=519,Kr=35044,Wi=35048,Zr="300 es",Ia=1035,zn=2e3,Ao=2001;class ts{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const o=i.indexOf(e);o!==-1&&i.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let o=0,r=i.length;o<r;o++)i[o].call(this,t);t.target=null}}}const Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Jr=1234567;const vs=Math.PI/180,ws=180/Math.PI;function es(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ue[s&255]+Ue[s>>8&255]+Ue[s>>16&255]+Ue[s>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]).toLowerCase()}function ze(s,t,e){return Math.max(t,Math.min(e,s))}function Ja(s,t){return(s%t+t)%t}function Du(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Uu(s,t,e){return s!==t?(e-s)/(t-s):0}function xs(s,t,e){return(1-e)*s+e*t}function Fu(s,t,e,n){return xs(s,t,1-Math.exp(-e*n))}function Iu(s,t=1){return t-Math.abs(Ja(s,t*2)-t)}function zu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function ku(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Nu(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Ou(s,t){return s+Math.random()*(t-s)}function Bu(s){return s*(.5-Math.random())}function Hu(s){s!==void 0&&(Jr=s);let t=Jr+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Gu(s){return s*vs}function Vu(s){return s*ws}function za(s){return(s&s-1)===0&&s!==0}function Wu(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Co(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function qu(s,t,e,n,i){const o=Math.cos,r=Math.sin,a=o(e/2),l=r(e/2),c=o((t+n)/2),h=r((t+n)/2),f=o((t-n)/2),u=r((t-n)/2),d=o((n-t)/2),x=r((n-t)/2);switch(i){case"XYX":s.set(a*h,l*f,l*u,a*c);break;case"YZY":s.set(l*u,a*h,l*f,a*c);break;case"ZXZ":s.set(l*f,l*u,a*h,a*c);break;case"XZX":s.set(a*h,l*x,l*d,a*c);break;case"YXY":s.set(l*d,a*h,l*x,a*c);break;case"ZYZ":s.set(l*x,l*d,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ki(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function He(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const _n={DEG2RAD:vs,RAD2DEG:ws,generateUUID:es,clamp:ze,euclideanModulo:Ja,mapLinear:Du,inverseLerp:Uu,lerp:xs,damp:Fu,pingpong:Iu,smoothstep:zu,smootherstep:ku,randInt:Nu,randFloat:Ou,randFloatSpread:Bu,seededRandom:Hu,degToRad:Gu,radToDeg:Vu,isPowerOfTwo:za,ceilPowerOfTwo:Wu,floorPowerOfTwo:Co,setQuaternionFromProperEuler:qu,normalize:He,denormalize:ki};class Dt{constructor(t=0,e=0){Dt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*i+t.x,this.y=o*i+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yt{constructor(t,e,n,i,o,r,a,l,c){Yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,r,a,l,c)}set(t,e,n,i,o,r,a,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=o,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,r=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],x=n[8],g=i[0],m=i[3],p=i[6],_=i[1],v=i[4],y=i[7],T=i[2],w=i[5],E=i[8];return o[0]=r*g+a*_+l*T,o[3]=r*m+a*v+l*w,o[6]=r*p+a*y+l*E,o[1]=c*g+h*_+f*T,o[4]=c*m+h*v+f*w,o[7]=c*p+h*y+f*E,o[2]=u*g+d*_+x*T,o[5]=u*m+d*v+x*w,o[8]=u*p+d*y+x*E,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*a*c-n*o*h+n*a*l+i*o*c-i*r*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*r-a*c,u=a*l-h*o,d=c*o-r*l,x=e*f+n*u+i*d;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/x;return t[0]=f*g,t[1]=(i*c-h*n)*g,t[2]=(a*n-i*r)*g,t[3]=u*g,t[4]=(h*e-i*l)*g,t[5]=(i*o-a*e)*g,t[6]=d*g,t[7]=(n*l-c*e)*g,t[8]=(r*e-n*o)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,o,r,a){const l=Math.cos(o),c=Math.sin(o);return this.set(n*l,n*c,-n*(l*r+c*a)+r+t,-i*c,i*l,-i*(-c*r+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply($o.makeScale(t,e)),this}rotate(t){return this.premultiply($o.makeRotation(-t)),this}translate(t,e){return this.premultiply($o.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const $o=new Yt;function zc(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Ro(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Xu(){const s=Ro("canvas");return s.style.display="block",s}const Qr={};function _s(s){s in Qr||(Qr[s]=!0,console.warn(s))}const tl=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),el=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Is={[Gn]:{transfer:bo,primaries:Eo,toReference:s=>s,fromReference:s=>s},[Le]:{transfer:le,primaries:Eo,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Fo]:{transfer:bo,primaries:To,toReference:s=>s.applyMatrix3(el),fromReference:s=>s.applyMatrix3(tl)},[Za]:{transfer:le,primaries:To,toReference:s=>s.convertSRGBToLinear().applyMatrix3(el),fromReference:s=>s.applyMatrix3(tl).convertLinearToSRGB()}},Yu=new Set([Gn,Fo]),te={enabled:!0,_workingColorSpace:Gn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Yu.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=Is[t].toReference,i=Is[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Is[s].primaries},getTransfer:function(s){return s===cn?bo:Is[s].transfer}};function qi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ko(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let _i;class kc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{_i===void 0&&(_i=Ro("canvas")),_i.width=t.width,_i.height=t.height;const n=_i.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=_i}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ro("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),o=i.data;for(let r=0;r<o.length;r++)o[r]=qi(o[r]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(qi(e[n]/255)*255):e[n]=qi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ju=0;class Nc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=es(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let r=0,a=i.length;r<a;r++)i[r].isDataTexture?o.push(Zo(i[r].image)):o.push(Zo(i[r]))}else o=Zo(i);n.url=o}return e||(t.images[this.uuid]=n),n}}function Zo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?kc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let $u=0;class Ke extends ts{constructor(t=Ke.DEFAULT_IMAGE,e=Ke.DEFAULT_MAPPING,n=$e,i=$e,o=ie,r=mi,a=ke,l=sn,c=Ke.DEFAULT_ANISOTROPY,h=cn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=es(),this.name="",this.source=new Nc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=r,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Dt(0,0),this.repeat=new Dt(1,1),this.center=new Dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(_s("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===di?Le:cn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Tc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case pi:t.x=t.x-Math.floor(t.x);break;case $e:t.x=t.x<0?0:1;break;case Fa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case pi:t.y=t.y-Math.floor(t.y);break;case $e:t.y=t.y<0?0:1;break;case Fa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return _s("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Le?di:Fc}set encoding(t){_s("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===di?Le:cn}}Ke.DEFAULT_IMAGE=null;Ke.DEFAULT_MAPPING=Tc;Ke.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,i=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*i+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*i+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*i+r[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,o;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],x=l[9],g=l[2],m=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-g)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+g)<.1&&Math.abs(x+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(c+1)/2,y=(d+1)/2,T=(p+1)/2,w=(h+u)/4,E=(f+g)/4,A=(x+m)/4;return v>y&&v>T?v<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(v),i=w/n,o=E/n):y>T?y<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(y),n=w/i,o=A/i):T<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(T),n=E/o,i=A/o),this.set(n,i,o,e),this}let _=Math.sqrt((m-x)*(m-x)+(f-g)*(f-g)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(m-x)/_,this.y=(f-g)/_,this.z=(u-h)/_,this.w=Math.acos((c+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ku extends ts{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(_s("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===di?Le:cn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ie,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ke(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Nc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class on extends Ku{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Oc extends Ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=fe,this.minFilter=fe,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ka extends Ke{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=fe,this.minFilter=fe,this.wrapR=$e,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zu extends on{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGLMultipleRenderTargets=!0;const o=this.texture;this.texture=[];for(let r=0;r<n;r++)this.texture[r]=o.clone(),this.texture[r].isRenderTargetTexture=!0}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,o=this.texture.length;i<o;i++)this.texture[i].image.width=t,this.texture[i].image.height=e,this.texture[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}copy(t){this.dispose(),this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.texture.length=0;for(let e=0,n=t.texture.length;e<n;e++)this.texture[e]=t.texture[e].clone(),this.texture[e].isRenderTargetTexture=!0;return this}}class vi{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,o,r,a){let l=n[i+0],c=n[i+1],h=n[i+2],f=n[i+3];const u=o[r+0],d=o[r+1],x=o[r+2],g=o[r+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=u,t[e+1]=d,t[e+2]=x,t[e+3]=g;return}if(f!==g||l!==u||c!==d||h!==x){let m=1-a;const p=l*u+c*d+h*x+f*g,_=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const T=Math.sqrt(v),w=Math.atan2(T,p*_);m=Math.sin(m*w)/T,a=Math.sin(a*w)/T}const y=a*_;if(l=l*m+u*y,c=c*m+d*y,h=h*m+x*y,f=f*m+g*y,m===1-a){const T=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=T,c*=T,h*=T,f*=T}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,i,o,r){const a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],f=o[r],u=o[r+1],d=o[r+2],x=o[r+3];return t[e]=a*x+h*f+l*d-c*u,t[e+1]=l*x+h*u+c*f-a*d,t[e+2]=c*x+h*d+a*u-l*f,t[e+3]=h*x-a*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,o=t._z,r=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),f=a(o/2),u=l(n/2),d=l(i/2),x=l(o/2);switch(r){case"XYZ":this._x=u*h*f+c*d*x,this._y=c*d*f-u*h*x,this._z=c*h*x+u*d*f,this._w=c*h*f-u*d*x;break;case"YXZ":this._x=u*h*f+c*d*x,this._y=c*d*f-u*h*x,this._z=c*h*x-u*d*f,this._w=c*h*f+u*d*x;break;case"ZXY":this._x=u*h*f-c*d*x,this._y=c*d*f+u*h*x,this._z=c*h*x+u*d*f,this._w=c*h*f-u*d*x;break;case"ZYX":this._x=u*h*f-c*d*x,this._y=c*d*f+u*h*x,this._z=c*h*x-u*d*f,this._w=c*h*f+u*d*x;break;case"YZX":this._x=u*h*f+c*d*x,this._y=c*d*f+u*h*x,this._z=c*h*x-u*d*f,this._w=c*h*f-u*d*x;break;case"XZY":this._x=u*h*f-c*d*x,this._y=c*d*f-u*h*x,this._z=c*h*x+u*d*f,this._w=c*h*f+u*d*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],o=e[8],r=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(o-c)*d,this._z=(r-i)*d}else if(n>a&&n>f){const d=2*Math.sqrt(1+n-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(i+r)/d,this._z=(o+c)/d}else if(a>f){const d=2*Math.sqrt(1+a-n-f);this._w=(o-c)/d,this._x=(i+r)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-a);this._w=(r-i)/d,this._x=(o+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ze(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,o=t._z,r=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+r*a+i*c-o*l,this._y=i*h+r*l+o*a-n*c,this._z=o*h+r*c+n*l-i*a,this._w=r*h-n*a-i*l-o*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+i*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=i,this._z=o,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*r+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),f=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=r*f+this._w*u,this._x=n*f+this._x*u,this._y=i*f+this._y*u,this._z=o*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(o),n*Math.cos(o),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(t=0,e=0,n=0){V.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(nl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(nl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*i,this.y=o[1]*e+o[4]*n+o[7]*i,this.z=o[2]*e+o[5]*n+o[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*i+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*i+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*i+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,o=t.x,r=t.y,a=t.z,l=t.w,c=2*(r*i-a*n),h=2*(a*e-o*i),f=2*(o*n-r*e);return this.x=e+l*c+r*f-a*h,this.y=n+l*h+a*c-o*f,this.z=i+l*f+o*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i,this.y=o[1]*e+o[5]*n+o[9]*i,this.z=o[2]*e+o[6]*n+o[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,o=t.z,r=e.x,a=e.y,l=e.z;return this.x=i*l-o*a,this.y=o*r-n*l,this.z=n*a-i*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Jo.copy(this).projectOnVector(t),this.sub(Jo)}reflect(t){return this.sub(Jo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Jo=new V,nl=new vi;class wn{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,fn):fn.fromBufferAttribute(o,r),fn.applyMatrix4(t.matrixWorld),this.expandByPoint(fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zs.copy(n.boundingBox)),zs.applyMatrix4(t.matrixWorld),this.union(zs)}const i=t.children;for(let o=0,r=i.length;o<r;o++)this.expandByObject(i[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,fn),fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(os),ks.subVectors(this.max,os),Mi.subVectors(t.a,os),yi.subVectors(t.b,os),wi.subVectors(t.c,os),qn.subVectors(yi,Mi),Xn.subVectors(wi,yi),ei.subVectors(Mi,wi);let e=[0,-qn.z,qn.y,0,-Xn.z,Xn.y,0,-ei.z,ei.y,qn.z,0,-qn.x,Xn.z,0,-Xn.x,ei.z,0,-ei.x,-qn.y,qn.x,0,-Xn.y,Xn.x,0,-ei.y,ei.x,0];return!Qo(e,Mi,yi,wi,ks)||(e=[1,0,0,0,1,0,0,0,1],!Qo(e,Mi,yi,wi,ks))?!1:(Ns.crossVectors(qn,Xn),e=[Ns.x,Ns.y,Ns.z],Qo(e,Mi,yi,wi,ks))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const bn=[new V,new V,new V,new V,new V,new V,new V,new V],fn=new V,zs=new wn,Mi=new V,yi=new V,wi=new V,qn=new V,Xn=new V,ei=new V,os=new V,ks=new V,Ns=new V,ni=new V;function Qo(s,t,e,n,i){for(let o=0,r=s.length-3;o<=r;o+=3){ni.fromArray(s,o);const a=i.x*Math.abs(ni.x)+i.y*Math.abs(ni.y)+i.z*Math.abs(ni.z),l=t.dot(ni),c=e.dot(ni),h=n.dot(ni);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Ju=new wn,as=new V,ta=new V;class ns{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ju.setFromPoints(t).getCenter(n);let i=0;for(let o=0,r=t.length;o<r;o++)i=Math.max(i,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;as.subVectors(t,this.center);const e=as.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(as,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ta.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(as.copy(t.center).add(ta)),this.expandByPoint(as.copy(t.center).sub(ta))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const En=new V,ea=new V,Os=new V,Yn=new V,na=new V,Bs=new V,ia=new V;class Qa{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,En)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=En.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(En.copy(this.origin).addScaledVector(this.direction,e),En.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){ea.copy(t).add(e).multiplyScalar(.5),Os.copy(e).sub(t).normalize(),Yn.copy(this.origin).sub(ea);const o=t.distanceTo(e)*.5,r=-this.direction.dot(Os),a=Yn.dot(this.direction),l=-Yn.dot(Os),c=Yn.lengthSq(),h=Math.abs(1-r*r);let f,u,d,x;if(h>0)if(f=r*l-a,u=r*a-l,x=o*h,f>=0)if(u>=-x)if(u<=x){const g=1/h;f*=g,u*=g,d=f*(f+r*u+2*a)+u*(r*f+u+2*l)+c}else u=o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;else u=-o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;else u<=-x?(f=Math.max(0,-(-r*o+a)),u=f>0?-o:Math.min(Math.max(-o,-l),o),d=-f*f+u*(u+2*l)+c):u<=x?(f=0,u=Math.min(Math.max(-o,-l),o),d=u*(u+2*l)+c):(f=Math.max(0,-(r*o+a)),u=f>0?o:Math.min(Math.max(-o,-l),o),d=-f*f+u*(u+2*l)+c);else u=r>0?-o:o,f=Math.max(0,-(r*u+a)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(ea).addScaledVector(Os,u),d}intersectSphere(t,e){En.subVectors(t.center,this.origin);const n=En.dot(this.direction),i=En.dot(En)-n*n,o=t.radius*t.radius;if(i>o)return null;const r=Math.sqrt(o-i),a=n-r,l=n+r;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,o,r,a,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(o=(t.min.y-u.y)*h,r=(t.max.y-u.y)*h):(o=(t.max.y-u.y)*h,r=(t.min.y-u.y)*h),n>r||o>i||((o>n||isNaN(n))&&(n=o),(r<i||isNaN(i))&&(i=r),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,En)!==null}intersectTriangle(t,e,n,i,o){na.subVectors(e,t),Bs.subVectors(n,t),ia.crossVectors(na,Bs);let r=this.direction.dot(ia),a;if(r>0){if(i)return null;a=1}else if(r<0)a=-1,r=-r;else return null;Yn.subVectors(this.origin,t);const l=a*this.direction.dot(Bs.crossVectors(Yn,Bs));if(l<0)return null;const c=a*this.direction.dot(na.cross(Yn));if(c<0||l+c>r)return null;const h=-a*Yn.dot(ia);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class jt{constructor(t,e,n,i,o,r,a,l,c,h,f,u,d,x,g,m){jt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,r,a,l,c,h,f,u,d,x,g,m)}set(t,e,n,i,o,r,a,l,c,h,f,u,d,x,g,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=o,p[5]=r,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=x,p[11]=g,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new jt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Si.setFromMatrixColumn(t,0).length(),o=1/Si.setFromMatrixColumn(t,1).length(),r=1/Si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(o),f=Math.sin(o);if(t.order==="XYZ"){const u=r*h,d=r*f,x=a*h,g=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+x*c,e[5]=u-g*c,e[9]=-a*l,e[2]=g-u*c,e[6]=x+d*c,e[10]=r*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,x=c*h,g=c*f;e[0]=u+g*a,e[4]=x*a-d,e[8]=r*c,e[1]=r*f,e[5]=r*h,e[9]=-a,e[2]=d*a-x,e[6]=g+u*a,e[10]=r*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,x=c*h,g=c*f;e[0]=u-g*a,e[4]=-r*f,e[8]=x+d*a,e[1]=d+x*a,e[5]=r*h,e[9]=g-u*a,e[2]=-r*c,e[6]=a,e[10]=r*l}else if(t.order==="ZYX"){const u=r*h,d=r*f,x=a*h,g=a*f;e[0]=l*h,e[4]=x*c-d,e[8]=u*c+g,e[1]=l*f,e[5]=g*c+u,e[9]=d*c-x,e[2]=-c,e[6]=a*l,e[10]=r*l}else if(t.order==="YZX"){const u=r*l,d=r*c,x=a*l,g=a*c;e[0]=l*h,e[4]=g-u*f,e[8]=x*f+d,e[1]=f,e[5]=r*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+x,e[10]=u-g*f}else if(t.order==="XZY"){const u=r*l,d=r*c,x=a*l,g=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+g,e[5]=r*h,e[9]=d*f-x,e[2]=x*f-d,e[6]=a*h,e[10]=g*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Qu,t,tf)}lookAt(t,e,n){const i=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),jn.crossVectors(n,Qe),jn.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),jn.crossVectors(n,Qe)),jn.normalize(),Hs.crossVectors(Qe,jn),i[0]=jn.x,i[4]=Hs.x,i[8]=Qe.x,i[1]=jn.y,i[5]=Hs.y,i[9]=Qe.y,i[2]=jn.z,i[6]=Hs.z,i[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,r=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],x=n[2],g=n[6],m=n[10],p=n[14],_=n[3],v=n[7],y=n[11],T=n[15],w=i[0],E=i[4],A=i[8],M=i[12],S=i[1],C=i[5],I=i[9],k=i[13],b=i[2],R=i[6],N=i[10],G=i[14],D=i[3],z=i[7],P=i[11],H=i[15];return o[0]=r*w+a*S+l*b+c*D,o[4]=r*E+a*C+l*R+c*z,o[8]=r*A+a*I+l*N+c*P,o[12]=r*M+a*k+l*G+c*H,o[1]=h*w+f*S+u*b+d*D,o[5]=h*E+f*C+u*R+d*z,o[9]=h*A+f*I+u*N+d*P,o[13]=h*M+f*k+u*G+d*H,o[2]=x*w+g*S+m*b+p*D,o[6]=x*E+g*C+m*R+p*z,o[10]=x*A+g*I+m*N+p*P,o[14]=x*M+g*k+m*G+p*H,o[3]=_*w+v*S+y*b+T*D,o[7]=_*E+v*C+y*R+T*z,o[11]=_*A+v*I+y*N+T*P,o[15]=_*M+v*k+y*G+T*H,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],o=t[12],r=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],x=t[3],g=t[7],m=t[11],p=t[15];return x*(+o*l*f-i*c*f-o*a*u+n*c*u+i*a*d-n*l*d)+g*(+e*l*d-e*c*u+o*r*u-i*r*d+i*c*h-o*l*h)+m*(+e*c*f-e*a*d-o*r*f+n*r*d+o*a*h-n*c*h)+p*(-i*a*h-e*l*f+e*a*u+i*r*f-n*r*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],r=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],x=t[12],g=t[13],m=t[14],p=t[15],_=f*m*c-g*u*c+g*l*d-a*m*d-f*l*p+a*u*p,v=x*u*c-h*m*c-x*l*d+r*m*d+h*l*p-r*u*p,y=h*g*c-x*f*c+x*a*d-r*g*d-h*a*p+r*f*p,T=x*f*l-h*g*l-x*a*u+r*g*u+h*a*m-r*f*m,w=e*_+n*v+i*y+o*T;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/w;return t[0]=_*E,t[1]=(g*u*o-f*m*o-g*i*d+n*m*d+f*i*p-n*u*p)*E,t[2]=(a*m*o-g*l*o+g*i*c-n*m*c-a*i*p+n*l*p)*E,t[3]=(f*l*o-a*u*o-f*i*c+n*u*c+a*i*d-n*l*d)*E,t[4]=v*E,t[5]=(h*m*o-x*u*o+x*i*d-e*m*d-h*i*p+e*u*p)*E,t[6]=(x*l*o-r*m*o-x*i*c+e*m*c+r*i*p-e*l*p)*E,t[7]=(r*u*o-h*l*o+h*i*c-e*u*c-r*i*d+e*l*d)*E,t[8]=y*E,t[9]=(x*f*o-h*g*o-x*n*d+e*g*d+h*n*p-e*f*p)*E,t[10]=(r*g*o-x*a*o+x*n*c-e*g*c-r*n*p+e*a*p)*E,t[11]=(h*a*o-r*f*o-h*n*c+e*f*c+r*n*d-e*a*d)*E,t[12]=T*E,t[13]=(h*g*i-x*f*i+x*n*u-e*g*u-h*n*m+e*f*m)*E,t[14]=(x*a*i-r*g*i-x*n*l+e*g*l+r*n*m-e*a*m)*E,t[15]=(r*f*i-h*a*i+h*n*l-e*f*l-r*n*u+e*a*u)*E,this}scale(t){const e=this.elements,n=t.x,i=t.y,o=t.z;return e[0]*=n,e[4]*=i,e[8]*=o,e[1]*=n,e[5]*=i,e[9]*=o,e[2]*=n,e[6]*=i,e[10]*=o,e[3]*=n,e[7]*=i,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),o=1-n,r=t.x,a=t.y,l=t.z,c=o*r,h=o*a;return this.set(c*r+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*r,0,c*l-i*a,h*l+i*r,o*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,o,r){return this.set(1,n,o,0,t,1,r,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,o=e._x,r=e._y,a=e._z,l=e._w,c=o+o,h=r+r,f=a+a,u=o*c,d=o*h,x=o*f,g=r*h,m=r*f,p=a*f,_=l*c,v=l*h,y=l*f,T=n.x,w=n.y,E=n.z;return i[0]=(1-(g+p))*T,i[1]=(d+y)*T,i[2]=(x-v)*T,i[3]=0,i[4]=(d-y)*w,i[5]=(1-(u+p))*w,i[6]=(m+_)*w,i[7]=0,i[8]=(x+v)*E,i[9]=(m-_)*E,i[10]=(1-(u+g))*E,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let o=Si.set(i[0],i[1],i[2]).length();const r=Si.set(i[4],i[5],i[6]).length(),a=Si.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),t.x=i[12],t.y=i[13],t.z=i[14],dn.copy(this);const c=1/o,h=1/r,f=1/a;return dn.elements[0]*=c,dn.elements[1]*=c,dn.elements[2]*=c,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=f,dn.elements[9]*=f,dn.elements[10]*=f,e.setFromRotationMatrix(dn),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,i,o,r,a=zn){const l=this.elements,c=2*o/(e-t),h=2*o/(n-i),f=(e+t)/(e-t),u=(n+i)/(n-i);let d,x;if(a===zn)d=-(r+o)/(r-o),x=-2*r*o/(r-o);else if(a===Ao)d=-r/(r-o),x=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,o,r,a=zn){const l=this.elements,c=1/(e-t),h=1/(n-i),f=1/(r-o),u=(e+t)*c,d=(n+i)*h;let x,g;if(a===zn)x=(r+o)*f,g=-2*f;else if(a===Ao)x=o*f,g=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=g,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Si=new V,dn=new jt,Qu=new V(0,0,0),tf=new V(1,1,1),jn=new V,Hs=new V,Qe=new V,il=new jt,sl=new vi;class Cs{constructor(t=0,e=0,n=0,i=Cs.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,o=i[0],r=i[4],a=i[8],l=i[1],c=i[5],h=i[9],f=i[2],u=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,o),this._z=0);break;case"ZXY":this._x=Math.asin(ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-ze(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,o)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-ze(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return il.makeRotationFromQuaternion(t),this.setFromRotationMatrix(il,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return sl.setFromEuler(this),this.setFromQuaternion(sl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cs.DEFAULT_ORDER="XYZ";class tr{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ef=0;const ol=new V,bi=new vi,Tn=new jt,Gs=new V,rs=new V,nf=new V,sf=new vi,al=new V(1,0,0),rl=new V(0,1,0),ll=new V(0,0,1),of={type:"added"},af={type:"removed"};class Ze extends ts{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ef++}),this.uuid=es(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ze.DEFAULT_UP.clone();const t=new V,e=new Cs,n=new vi,i=new V(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new jt},normalMatrix:{value:new Yt}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=Ze.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.multiply(bi),this}rotateOnWorldAxis(t,e){return bi.setFromAxisAngle(t,e),this.quaternion.premultiply(bi),this}rotateX(t){return this.rotateOnAxis(al,t)}rotateY(t){return this.rotateOnAxis(rl,t)}rotateZ(t){return this.rotateOnAxis(ll,t)}translateOnAxis(t,e){return ol.copy(t).applyQuaternion(this.quaternion),this.position.add(ol.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(al,t)}translateY(t){return this.translateOnAxis(rl,t)}translateZ(t){return this.translateOnAxis(ll,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Gs.copy(t):Gs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(rs,Gs,this.up):Tn.lookAt(Gs,rs,this.up),this.quaternion.setFromRotationMatrix(Tn),i&&(Tn.extractRotation(i.matrixWorld),bi.setFromRotationMatrix(Tn),this.quaternion.premultiply(bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(of)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(af)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let o=0,r=i.length;o<r;o++)i[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,t,nf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,sf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const o=e[n];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let o=0,r=i.length;o<r;o++){const a=i[o];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function o(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];o(t.shapes,f)}else o(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(o(t.materials,this.material[l]));i.material=a}else i.material=o(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(o(t.animations,l))}}if(e){const a=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),f=r(t.shapes),u=r(t.skeletons),d=r(t.animations),x=r(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),x.length>0&&(n.nodes=x)}return n.object=i,n;function r(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Ze.DEFAULT_UP=new V(0,1,0);Ze.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ze.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new V,An=new V,sa=new V,Cn=new V,Ei=new V,Ti=new V,cl=new V,oa=new V,aa=new V,ra=new V;let Vs=!1;class mn{constructor(t=new V,e=new V,n=new V){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),pn.subVectors(t,e),i.cross(pn);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(t,e,n,i,o){pn.subVectors(i,e),An.subVectors(n,e),sa.subVectors(t,e);const r=pn.dot(pn),a=pn.dot(An),l=pn.dot(sa),c=An.dot(An),h=An.dot(sa),f=r*c-a*a;if(f===0)return o.set(0,0,0),null;const u=1/f,d=(c*l-a*h)*u,x=(r*h-a*l)*u;return o.set(1-d-x,x,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Cn)===null?!1:Cn.x>=0&&Cn.y>=0&&Cn.x+Cn.y<=1}static getUV(t,e,n,i,o,r,a,l){return Vs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Vs=!0),this.getInterpolation(t,e,n,i,o,r,a,l)}static getInterpolation(t,e,n,i,o,r,a,l){return this.getBarycoord(t,e,n,i,Cn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,Cn.x),l.addScaledVector(r,Cn.y),l.addScaledVector(a,Cn.z),l)}static isFrontFacing(t,e,n,i){return pn.subVectors(n,e),An.subVectors(t,e),pn.cross(An).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),An.subVectors(this.a,this.b),pn.cross(An).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return mn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,o){return Vs===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Vs=!0),mn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}getInterpolation(t,e,n,i,o){return mn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}containsPoint(t){return mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,o=this.c;let r,a;Ei.subVectors(i,n),Ti.subVectors(o,n),oa.subVectors(t,n);const l=Ei.dot(oa),c=Ti.dot(oa);if(l<=0&&c<=0)return e.copy(n);aa.subVectors(t,i);const h=Ei.dot(aa),f=Ti.dot(aa);if(h>=0&&f<=h)return e.copy(i);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return r=l/(l-h),e.copy(n).addScaledVector(Ei,r);ra.subVectors(t,o);const d=Ei.dot(ra),x=Ti.dot(ra);if(x>=0&&d<=x)return e.copy(o);const g=d*c-l*x;if(g<=0&&c>=0&&x<=0)return a=c/(c-x),e.copy(n).addScaledVector(Ti,a);const m=h*x-d*f;if(m<=0&&f-h>=0&&d-x>=0)return cl.subVectors(o,i),a=(f-h)/(f-h+(d-x)),e.copy(i).addScaledVector(cl,a);const p=1/(m+g+u);return r=g*p,a=u*p,e.copy(n).addScaledVector(Ei,r).addScaledVector(Ti,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Bc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},Ws={h:0,s:0,l:0};function la(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Pt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Le){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=te.workingColorSpace){if(t=Ja(t,1),e=ze(e,0,1),n=ze(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=la(r,o,t+1/3),this.g=la(r,o,t),this.b=la(r,o,t-1/3)}return te.toWorkingColorSpace(this,i),this}setStyle(t,e=Le){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=i[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Le){const n=Bc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=qi(t.r),this.g=qi(t.g),this.b=qi(t.b),this}copyLinearToSRGB(t){return this.r=Ko(t.r),this.g=Ko(t.g),this.b=Ko(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Le){return te.fromWorkingColorSpace(Fe.copy(this),t),Math.round(ze(Fe.r*255,0,255))*65536+Math.round(ze(Fe.g*255,0,255))*256+Math.round(ze(Fe.b*255,0,255))}getHexString(t=Le){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.fromWorkingColorSpace(Fe.copy(this),e);const n=Fe.r,i=Fe.g,o=Fe.b,r=Math.max(n,i,o),a=Math.min(n,i,o);let l,c;const h=(a+r)/2;if(a===r)l=0,c=0;else{const f=r-a;switch(c=h<=.5?f/(r+a):f/(2-r-a),r){case n:l=(i-o)/f+(i<o?6:0);break;case i:l=(o-n)/f+2;break;case o:l=(n-i)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=te.workingColorSpace){return te.fromWorkingColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Le){te.fromWorkingColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,i=Fe.b;return t!==Le?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL($n),this.setHSL($n.h+t,$n.s+e,$n.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($n),t.getHSL(Ws);const n=xs($n.h,Ws.h,e),i=xs($n.s,Ws.s,e),o=xs($n.l,Ws.l,e);return this.setHSL(n,i,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*i,this.g=o[1]*e+o[4]*n+o[7]*i,this.b=o[2]*e+o[5]*n+o[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new Pt;Pt.NAMES=Bc;let rf=0;class Rs extends ts{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=es(),this.name="",this.type="Material",this.blending=Gi,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pa,this.blendDst=La,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Pt(0,0,0),this.blendAlpha=0,this.depthFunc=So,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$r,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xi,this.stencilZFail=xi,this.stencilZPass=xi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Pa&&(n.blendSrc=this.blendSrc),this.blendDst!==La&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==So&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==$r&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==xi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==xi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==xi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const r=[];for(const a in o){const l=o[a];delete l.metadata,r.push(l)}return r}if(e){const o=i(t.textures),r=i(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Hc extends Rs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Pt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ec,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Fn=lf();function lf(){const s=new ArrayBuffer(4),t=new Float32Array(s),e=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const o=new Uint32Array(2048),r=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,o[l]=c|h}for(let l=1024;l<2048;++l)o[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)r[l]=l<<23;r[31]=1199570944,r[32]=2147483648;for(let l=33;l<63;++l)r[l]=2147483648+(l-32<<23);r[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:o,exponentTable:r,offsetTable:a}}function cf(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=ze(s,-65504,65504),Fn.floatView[0]=s;const t=Fn.uint32View[0],e=t>>23&511;return Fn.baseTable[e]+((t&8388607)>>Fn.shiftTable[e])}function hf(s){const t=s>>10;return Fn.uint32View[0]=Fn.mantissaTable[Fn.offsetTable[t]+(s&1023)]+Fn.exponentTable[t],Fn.floatView[0]}const hl={toHalfFloat:cf,fromHalfFloat:hf},we=new V,qs=new Dt;class ue{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Kr,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)qs.fromBufferAttribute(this,e),qs.applyMatrix3(t),this.setXY(e,qs.x,qs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix3(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyMatrix4(t),this.setXYZ(e,we.x,we.y,we.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.applyNormalMatrix(t),this.setXYZ(e,we.x,we.y,we.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)we.fromBufferAttribute(this,e),we.transformDirection(t),this.setXYZ(e,we.x,we.y,we.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ki(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=He(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ki(e,this.array)),e}setX(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ki(e,this.array)),e}setY(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ki(e,this.array)),e}setZ(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ki(e,this.array)),e}setW(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),i=He(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,o){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),i=He(i,this.array),o=He(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Kr&&(t.usage=this.usage),t}}class Gc extends ue{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Vc extends ue{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ne extends ue{constructor(t,e,n){super(new Float32Array(t),e,n)}}let uf=0;const rn=new jt,ca=new Ze,Ai=new V,tn=new wn,ls=new wn,Re=new V;class be extends ts{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=es(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(zc(t)?Vc:Gc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Yt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return rn.makeRotationFromQuaternion(t),this.applyMatrix4(rn),this}rotateX(t){return rn.makeRotationX(t),this.applyMatrix4(rn),this}rotateY(t){return rn.makeRotationY(t),this.applyMatrix4(rn),this}rotateZ(t){return rn.makeRotationZ(t),this.applyMatrix4(rn),this}translate(t,e,n){return rn.makeTranslation(t,e,n),this.applyMatrix4(rn),this}scale(t,e,n){return rn.makeScale(t,e,n),this.applyMatrix4(rn),this}lookAt(t){return ca.lookAt(t),ca.updateMatrix(),this.applyMatrix4(ca.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ai).negate(),this.translate(Ai.x,Ai.y,Ai.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new ne(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const o=e[n];tn.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ns);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new V,1/0);return}if(t){const n=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];ls.setFromBufferAttribute(a),this.morphTargetsRelative?(Re.addVectors(tn.min,ls.min),tn.expandByPoint(Re),Re.addVectors(tn.max,ls.max),tn.expandByPoint(Re)):(tn.expandByPoint(ls.min),tn.expandByPoint(ls.max))}tn.getCenter(n);let i=0;for(let o=0,r=t.count;o<r;o++)Re.fromBufferAttribute(t,o),i=Math.max(i,n.distanceToSquared(Re));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Re.fromBufferAttribute(a,c),l&&(Ai.fromBufferAttribute(t,c),Re.add(Ai)),i=Math.max(i,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,o=e.normal.array,r=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ue(new Float32Array(4*a),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let S=0;S<a;S++)c[S]=new V,h[S]=new V;const f=new V,u=new V,d=new V,x=new Dt,g=new Dt,m=new Dt,p=new V,_=new V;function v(S,C,I){f.fromArray(i,S*3),u.fromArray(i,C*3),d.fromArray(i,I*3),x.fromArray(r,S*2),g.fromArray(r,C*2),m.fromArray(r,I*2),u.sub(f),d.sub(f),g.sub(x),m.sub(x);const k=1/(g.x*m.y-m.x*g.y);isFinite(k)&&(p.copy(u).multiplyScalar(m.y).addScaledVector(d,-g.y).multiplyScalar(k),_.copy(d).multiplyScalar(g.x).addScaledVector(u,-m.x).multiplyScalar(k),c[S].add(p),c[C].add(p),c[I].add(p),h[S].add(_),h[C].add(_),h[I].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:n.length}]);for(let S=0,C=y.length;S<C;++S){const I=y[S],k=I.start,b=I.count;for(let R=k,N=k+b;R<N;R+=3)v(n[R+0],n[R+1],n[R+2])}const T=new V,w=new V,E=new V,A=new V;function M(S){E.fromArray(o,S*3),A.copy(E);const C=c[S];T.copy(C),T.sub(E.multiplyScalar(E.dot(C))).normalize(),w.crossVectors(A,C);const k=w.dot(h[S])<0?-1:1;l[S*4]=T.x,l[S*4+1]=T.y,l[S*4+2]=T.z,l[S*4+3]=k}for(let S=0,C=y.length;S<C;++S){const I=y[S],k=I.start,b=I.count;for(let R=k,N=k+b;R<N;R+=3)M(n[R+0]),M(n[R+1]),M(n[R+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ue(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const i=new V,o=new V,r=new V,a=new V,l=new V,c=new V,h=new V,f=new V;if(t)for(let u=0,d=t.count;u<d;u+=3){const x=t.getX(u+0),g=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),r.fromBufferAttribute(e,m),h.subVectors(r,o),f.subVectors(i,o),h.cross(f),a.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(x,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)i.fromBufferAttribute(e,u+0),o.fromBufferAttribute(e,u+1),r.fromBufferAttribute(e,u+2),h.subVectors(r,o),f.subVectors(i,o),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h);let d=0,x=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?d=l[g]*a.data.stride+a.offset:d=l[g]*h;for(let p=0;p<h;p++)u[x++]=c[d++]}return new ue(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new be,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const o=this.morphAttributes;for(const a in o){const l=[],c=o[a];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,l=r.length;a<l;a++){const c=r[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(i[l]=h,o=!0)}o&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const o=t.morphAttributes;for(const c in o){const h=[],f=o[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let c=0,h=r.length;c<h;c++){const f=r[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ul=new jt,ii=new Qa,Xs=new ns,fl=new V,Ci=new V,Ri=new V,Pi=new V,ha=new V,Ys=new V,js=new Dt,$s=new Dt,Ks=new Dt,dl=new V,pl=new V,ml=new V,Zs=new V,Js=new V;class Qt extends Ze{constructor(t=new be,e=new Hc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=i.length;o<r;o++){const a=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(o&&a){Ys.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=a[l],f=o[l];h!==0&&(ha.fromBufferAttribute(f,t),r?Ys.addScaledVector(ha,h):Ys.addScaledVector(ha.sub(e),h))}e.add(Ys)}return e}raycast(t,e){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xs.copy(n.boundingSphere),Xs.applyMatrix4(o),ii.copy(t.ray).recast(t.near),!(Xs.containsPoint(ii.origin)===!1&&(ii.intersectSphere(Xs,fl)===null||ii.origin.distanceToSquared(fl)>(t.far-t.near)**2))&&(ul.copy(o).invert(),ii.copy(t.ray).applyMatrix4(ul),!(n.boundingBox!==null&&ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ii)))}_computeIntersections(t,e,n){let i;const o=this.geometry,r=this.material,a=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,f=o.attributes.normal,u=o.groups,d=o.drawRange;if(a!==null)if(Array.isArray(r))for(let x=0,g=u.length;x<g;x++){const m=u[x],p=r[m.materialIndex],_=Math.max(m.start,d.start),v=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=_,T=v;y<T;y+=3){const w=a.getX(y),E=a.getX(y+1),A=a.getX(y+2);i=Qs(this,p,t,n,c,h,f,w,E,A),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const x=Math.max(0,d.start),g=Math.min(a.count,d.start+d.count);for(let m=x,p=g;m<p;m+=3){const _=a.getX(m),v=a.getX(m+1),y=a.getX(m+2);i=Qs(this,r,t,n,c,h,f,_,v,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(r))for(let x=0,g=u.length;x<g;x++){const m=u[x],p=r[m.materialIndex],_=Math.max(m.start,d.start),v=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=_,T=v;y<T;y+=3){const w=y,E=y+1,A=y+2;i=Qs(this,p,t,n,c,h,f,w,E,A),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const x=Math.max(0,d.start),g=Math.min(l.count,d.start+d.count);for(let m=x,p=g;m<p;m+=3){const _=m,v=m+1,y=m+2;i=Qs(this,r,t,n,c,h,f,_,v,y),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function ff(s,t,e,n,i,o,r,a){let l;if(t.side===Ve?l=n.intersectTriangle(r,o,i,!0,a):l=n.intersectTriangle(i,o,r,t.side===Bn,a),l===null)return null;Js.copy(a),Js.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Js);return c<e.near||c>e.far?null:{distance:c,point:Js.clone(),object:s}}function Qs(s,t,e,n,i,o,r,a,l,c){s.getVertexPosition(a,Ci),s.getVertexPosition(l,Ri),s.getVertexPosition(c,Pi);const h=ff(s,t,e,n,Ci,Ri,Pi,Zs);if(h){i&&(js.fromBufferAttribute(i,a),$s.fromBufferAttribute(i,l),Ks.fromBufferAttribute(i,c),h.uv=mn.getInterpolation(Zs,Ci,Ri,Pi,js,$s,Ks,new Dt)),o&&(js.fromBufferAttribute(o,a),$s.fromBufferAttribute(o,l),Ks.fromBufferAttribute(o,c),h.uv1=mn.getInterpolation(Zs,Ci,Ri,Pi,js,$s,Ks,new Dt),h.uv2=h.uv1),r&&(dl.fromBufferAttribute(r,a),pl.fromBufferAttribute(r,l),ml.fromBufferAttribute(r,c),h.normal=mn.getInterpolation(Zs,Ci,Ri,Pi,dl,pl,ml,new V),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new V,materialIndex:0};mn.getNormal(Ci,Ri,Pi,f.normal),h.face=f}return h}class Ps extends be{constructor(t=1,e=1,n=1,i=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:o,depthSegments:r};const a=this;i=Math.floor(i),o=Math.floor(o),r=Math.floor(r);const l=[],c=[],h=[],f=[];let u=0,d=0;x("z","y","x",-1,-1,n,e,t,r,o,0),x("z","y","x",1,-1,n,e,-t,r,o,1),x("x","z","y",1,1,t,n,e,i,r,2),x("x","z","y",1,-1,t,n,-e,i,r,3),x("x","y","z",1,-1,t,e,n,i,o,4),x("x","y","z",-1,-1,t,e,-n,i,o,5),this.setIndex(l),this.setAttribute("position",new ne(c,3)),this.setAttribute("normal",new ne(h,3)),this.setAttribute("uv",new ne(f,2));function x(g,m,p,_,v,y,T,w,E,A,M){const S=y/E,C=T/A,I=y/2,k=T/2,b=w/2,R=E+1,N=A+1;let G=0,D=0;const z=new V;for(let P=0;P<N;P++){const H=P*C-k;for(let j=0;j<R;j++){const B=j*S-I;z[g]=B*_,z[m]=H*v,z[p]=b,c.push(z.x,z.y,z.z),z[g]=0,z[m]=0,z[p]=w>0?1:-1,h.push(z.x,z.y,z.z),f.push(j/E),f.push(1-P/A),G+=1}}for(let P=0;P<A;P++)for(let H=0;H<E;H++){const j=u+H+R*P,B=u+H+R*(P+1),Y=u+(H+1)+R*(P+1),K=u+(H+1)+R*P;l.push(j,B,K),l.push(B,Y,K),D+=6}a.addGroup(d,D,M),d+=D,u+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ps(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ki(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ge(s){const t={};for(let e=0;e<s.length;e++){const n=Ki(s[e]);for(const i in n)t[i]=n[i]}return t}function df(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Wc(s){return s.getRenderTarget()===null?s.outputColorSpace:te.workingColorSpace}const pf={clone:Ki,merge:Ge};var mf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class xe extends Rs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mf,this.fragmentShader=gf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ki(t.uniforms),this.uniformsGroups=df(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const r=this.uniforms[i].value;r&&r.isTexture?e.uniforms[i]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[i]={type:"m4",value:r.toArray()}:e.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class qc extends Ze{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=zn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ye extends qc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ws*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(vs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ws*2*Math.atan(Math.tan(vs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(vs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,o=-.5*i;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;o+=r.offsetX*i/l,e-=r.offsetY*n/c,i*=r.width/l,n*=r.height/c}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Li=-90,Di=1;class vf extends Ze{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ye(Li,Di,t,e);i.layers=this.layers,this.add(i);const o=new Ye(Li,Di,t,e);o.layers=this.layers,this.add(o);const r=new Ye(Li,Di,t,e);r.layers=this.layers,this.add(r);const a=new Ye(Li,Di,t,e);a.layers=this.layers,this.add(a);const l=new Ye(Li,Di,t,e);l.layers=this.layers,this.add(l);const c=new Ye(Li,Di,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,o,r,a,l]=e;for(const c of e)this.remove(c);if(t===zn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ao)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,o),t.setRenderTarget(n,1,i),t.render(e,r),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Xc extends Ke{constructor(t,e,n,i,o,r,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Yi,super(t,e,n,i,o,r,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class xf extends on{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(_s("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===di?Le:cn),this.texture=new Xc(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ie}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Ps(5,5,5),o=new xe({name:"CubemapFromEquirect",uniforms:Ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ve,blending:Kn});o.uniforms.tEquirect.value=e;const r=new Qt(i,o),a=e.minFilter;return e.minFilter===mi&&(e.minFilter=ie),new vf(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e,n,i){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,i);t.setRenderTarget(o)}}const ua=new V,_f=new V,Mf=new Yt;class ai{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=ua.subVectors(n,e).cross(_f.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ua),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Mf.getNormalMatrix(t),i=this.coplanarPoint(ua).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const si=new ns,to=new V;class Ls{constructor(t=new ai,e=new ai,n=new ai,i=new ai,o=new ai,r=new ai){this.planes=[t,e,n,i,o,r]}set(t,e,n,i,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=zn){const n=this.planes,i=t.elements,o=i[0],r=i[1],a=i[2],l=i[3],c=i[4],h=i[5],f=i[6],u=i[7],d=i[8],x=i[9],g=i[10],m=i[11],p=i[12],_=i[13],v=i[14],y=i[15];if(n[0].setComponents(l-o,u-c,m-d,y-p).normalize(),n[1].setComponents(l+o,u+c,m+d,y+p).normalize(),n[2].setComponents(l+r,u+h,m+x,y+_).normalize(),n[3].setComponents(l-r,u-h,m-x,y-_).normalize(),n[4].setComponents(l-a,u-f,m-g,y-v).normalize(),e===zn)n[5].setComponents(l+a,u+f,m+g,y+v).normalize();else if(e===Ao)n[5].setComponents(a,f,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),si.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),si.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(si)}intersectsSprite(t){return si.center.set(0,0,0),si.radius=.7071067811865476,si.applyMatrix4(t.matrixWorld),this.intersectsSphere(si)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(to.x=i.normal.x>0?t.max.x:t.min.x,to.y=i.normal.y>0?t.max.y:t.min.y,to.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(to)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Yc(){let s=null,t=!1,e=null,n=null;function i(o,r){e(o,r),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){s=o}}}function yf(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const f=c.array,u=c.usage,d=f.byteLength,x=s.createBuffer();s.bindBuffer(h,x),s.bufferData(h,f,u),c.onUploadCallback();let g;if(f instanceof Float32Array)g=s.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)g=s.SHORT;else if(f instanceof Uint32Array)g=s.UNSIGNED_INT;else if(f instanceof Int32Array)g=s.INT;else if(f instanceof Int8Array)g=s.BYTE;else if(f instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:x,type:g,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:d}}function o(c,h,f){const u=h.array,d=h._updateRange,x=h.updateRanges;if(s.bindBuffer(f,c),d.count===-1&&x.length===0&&s.bufferSubData(f,0,u),x.length!==0){for(let g=0,m=x.length;g<m;g++){const p=x[g];e?s.bufferSubData(f,p.start*u.BYTES_PER_ELEMENT,u,p.start,p.count):s.bufferSubData(f,p.start*u.BYTES_PER_ELEMENT,u.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(e?s.bufferSubData(f,d.offset*u.BYTES_PER_ELEMENT,u,d.offset,d.count):s.bufferSubData(f,d.offset*u.BYTES_PER_ELEMENT,u.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function r(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const u=n.get(c);(!u||u.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=n.get(c);if(f===void 0)n.set(c,i(c,h));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(f.buffer,c,h),f.version=c.version}}return{get:r,remove:a,update:l}}class er extends be{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const o=t/2,r=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,f=t/a,u=e/l,d=[],x=[],g=[],m=[];for(let p=0;p<h;p++){const _=p*u-r;for(let v=0;v<c;v++){const y=v*f-o;x.push(y,-_,0),g.push(0,0,1),m.push(v/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){const v=_+c*p,y=_+c*(p+1),T=_+1+c*(p+1),w=_+1+c*p;d.push(v,y,w),d.push(y,T,w)}this.setIndex(d),this.setAttribute("position",new ne(x,3)),this.setAttribute("normal",new ne(g,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new er(t.width,t.height,t.widthSegments,t.heightSegments)}}var wf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sf=`#ifdef USE_ALPHAHASH
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
#endif`,bf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ef=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tf=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Af=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cf=`#ifdef USE_AOMAP
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
#endif`,Rf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pf=`#ifdef USE_BATCHING
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
#endif`,Lf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Df=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Uf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ff=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,If=`#ifdef USE_IRIDESCENCE
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
#endif`,zf=`#ifdef USE_BUMPMAP
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
#endif`,kf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Of=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Gf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Wf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,qf=`#define PI 3.141592653589793
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
} // validated`,Xf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Yf=`vec3 transformedNormal = objectNormal;
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
#endif`,jf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$f=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Kf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Zf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Qf=`
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
}`,td=`#ifdef USE_ENVMAP
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
#endif`,ed=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,nd=`#ifdef USE_ENVMAP
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
#endif`,id=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sd=`#ifdef USE_ENVMAP
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
#endif`,od=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ad=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ld=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cd=`#ifdef USE_GRADIENTMAP
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
}`,hd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ud=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,dd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pd=`uniform bool receiveShadow;
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
#endif`,md=`#ifdef USE_ENVMAP
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
#endif`,gd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,xd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,_d=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Md=`PhysicalMaterial material;
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
#endif`,yd=`struct PhysicalMaterial {
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
}`,wd=`
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
#endif`,Sd=`#if defined( RE_IndirectDiffuse )
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
#endif`,bd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ed=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Td=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ad=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Cd=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Rd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Pd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ld=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Dd=`#if defined( USE_POINTS_UV )
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
#endif`,Ud=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Fd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Id=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zd=`#ifdef USE_MORPHNORMALS
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
#endif`,kd=`#ifdef USE_MORPHTARGETS
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
#endif`,Nd=`#ifdef USE_MORPHTARGETS
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
#endif`,Od=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Hd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Wd=`#ifdef USE_NORMALMAP
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
#endif`,qd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Yd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$d=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Kd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Zd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Qd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,t0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,e0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,n0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,i0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,s0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,o0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,a0=`float getShadowMask() {
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
}`,r0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,l0=`#ifdef USE_SKINNING
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
#endif`,c0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,h0=`#ifdef USE_SKINNING
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
#endif`,u0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,f0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,d0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,p0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,m0=`#ifdef USE_TRANSMISSION
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
#endif`,g0=`#ifdef USE_TRANSMISSION
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
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,x0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,M0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const y0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,w0=`uniform sampler2D t2D;
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
}`,S0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,b0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,E0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,T0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A0=`#include <common>
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
}`,C0=`#if DEPTH_PACKING == 3200
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
}`,R0=`#define DISTANCE
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
}`,P0=`#define DISTANCE
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
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,D0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U0=`uniform float scale;
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
}`,F0=`uniform vec3 diffuse;
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
}`,I0=`#include <common>
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
}`,z0=`uniform vec3 diffuse;
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
}`,k0=`#define LAMBERT
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
}`,N0=`#define LAMBERT
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
}`,O0=`#define MATCAP
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
}`,B0=`#define MATCAP
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
}`,H0=`#define NORMAL
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
}`,G0=`#define NORMAL
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
}`,V0=`#define PHONG
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
}`,W0=`#define PHONG
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
}`,q0=`#define STANDARD
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
}`,X0=`#define STANDARD
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
}`,Y0=`#define TOON
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
}`,j0=`#define TOON
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
}`,$0=`uniform float size;
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
}`,K0=`uniform vec3 diffuse;
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
}`,Z0=`#include <common>
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
}`,J0=`uniform vec3 color;
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
}`,Q0=`uniform float rotation;
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
}`,tp=`uniform vec3 diffuse;
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
}`,Vt={alphahash_fragment:wf,alphahash_pars_fragment:Sf,alphamap_fragment:bf,alphamap_pars_fragment:Ef,alphatest_fragment:Tf,alphatest_pars_fragment:Af,aomap_fragment:Cf,aomap_pars_fragment:Rf,batching_pars_vertex:Pf,batching_vertex:Lf,begin_vertex:Df,beginnormal_vertex:Uf,bsdfs:Ff,iridescence_fragment:If,bumpmap_pars_fragment:zf,clipping_planes_fragment:kf,clipping_planes_pars_fragment:Nf,clipping_planes_pars_vertex:Of,clipping_planes_vertex:Bf,color_fragment:Hf,color_pars_fragment:Gf,color_pars_vertex:Vf,color_vertex:Wf,common:qf,cube_uv_reflection_fragment:Xf,defaultnormal_vertex:Yf,displacementmap_pars_vertex:jf,displacementmap_vertex:$f,emissivemap_fragment:Kf,emissivemap_pars_fragment:Zf,colorspace_fragment:Jf,colorspace_pars_fragment:Qf,envmap_fragment:td,envmap_common_pars_fragment:ed,envmap_pars_fragment:nd,envmap_pars_vertex:id,envmap_physical_pars_fragment:md,envmap_vertex:sd,fog_vertex:od,fog_pars_vertex:ad,fog_fragment:rd,fog_pars_fragment:ld,gradientmap_pars_fragment:cd,lightmap_fragment:hd,lightmap_pars_fragment:ud,lights_lambert_fragment:fd,lights_lambert_pars_fragment:dd,lights_pars_begin:pd,lights_toon_fragment:gd,lights_toon_pars_fragment:vd,lights_phong_fragment:xd,lights_phong_pars_fragment:_d,lights_physical_fragment:Md,lights_physical_pars_fragment:yd,lights_fragment_begin:wd,lights_fragment_maps:Sd,lights_fragment_end:bd,logdepthbuf_fragment:Ed,logdepthbuf_pars_fragment:Td,logdepthbuf_pars_vertex:Ad,logdepthbuf_vertex:Cd,map_fragment:Rd,map_pars_fragment:Pd,map_particle_fragment:Ld,map_particle_pars_fragment:Dd,metalnessmap_fragment:Ud,metalnessmap_pars_fragment:Fd,morphcolor_vertex:Id,morphnormal_vertex:zd,morphtarget_pars_vertex:kd,morphtarget_vertex:Nd,normal_fragment_begin:Od,normal_fragment_maps:Bd,normal_pars_fragment:Hd,normal_pars_vertex:Gd,normal_vertex:Vd,normalmap_pars_fragment:Wd,clearcoat_normal_fragment_begin:qd,clearcoat_normal_fragment_maps:Xd,clearcoat_pars_fragment:Yd,iridescence_pars_fragment:jd,opaque_fragment:$d,packing:Kd,premultiplied_alpha_fragment:Zd,project_vertex:Jd,dithering_fragment:Qd,dithering_pars_fragment:t0,roughnessmap_fragment:e0,roughnessmap_pars_fragment:n0,shadowmap_pars_fragment:i0,shadowmap_pars_vertex:s0,shadowmap_vertex:o0,shadowmask_pars_fragment:a0,skinbase_vertex:r0,skinning_pars_vertex:l0,skinning_vertex:c0,skinnormal_vertex:h0,specularmap_fragment:u0,specularmap_pars_fragment:f0,tonemapping_fragment:d0,tonemapping_pars_fragment:p0,transmission_fragment:m0,transmission_pars_fragment:g0,uv_pars_fragment:v0,uv_pars_vertex:x0,uv_vertex:_0,worldpos_vertex:M0,background_vert:y0,background_frag:w0,backgroundCube_vert:S0,backgroundCube_frag:b0,cube_vert:E0,cube_frag:T0,depth_vert:A0,depth_frag:C0,distanceRGBA_vert:R0,distanceRGBA_frag:P0,equirect_vert:L0,equirect_frag:D0,linedashed_vert:U0,linedashed_frag:F0,meshbasic_vert:I0,meshbasic_frag:z0,meshlambert_vert:k0,meshlambert_frag:N0,meshmatcap_vert:O0,meshmatcap_frag:B0,meshnormal_vert:H0,meshnormal_frag:G0,meshphong_vert:V0,meshphong_frag:W0,meshphysical_vert:q0,meshphysical_frag:X0,meshtoon_vert:Y0,meshtoon_frag:j0,points_vert:$0,points_frag:K0,shadow_vert:Z0,shadow_frag:J0,sprite_vert:Q0,sprite_frag:tp},xt={common:{diffuse:{value:new Pt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new Dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Pt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Pt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Pt(16777215)},opacity:{value:1},center:{value:new Dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},Mn={basic:{uniforms:Ge([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:Vt.meshbasic_vert,fragmentShader:Vt.meshbasic_frag},lambert:{uniforms:Ge([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:Vt.meshlambert_vert,fragmentShader:Vt.meshlambert_frag},phong:{uniforms:Ge([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new Pt(0)},specular:{value:new Pt(1118481)},shininess:{value:30}}]),vertexShader:Vt.meshphong_vert,fragmentShader:Vt.meshphong_frag},standard:{uniforms:Ge([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new Pt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag},toon:{uniforms:Ge([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new Pt(0)}}]),vertexShader:Vt.meshtoon_vert,fragmentShader:Vt.meshtoon_frag},matcap:{uniforms:Ge([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:Vt.meshmatcap_vert,fragmentShader:Vt.meshmatcap_frag},points:{uniforms:Ge([xt.points,xt.fog]),vertexShader:Vt.points_vert,fragmentShader:Vt.points_frag},dashed:{uniforms:Ge([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vt.linedashed_vert,fragmentShader:Vt.linedashed_frag},depth:{uniforms:Ge([xt.common,xt.displacementmap]),vertexShader:Vt.depth_vert,fragmentShader:Vt.depth_frag},normal:{uniforms:Ge([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:Vt.meshnormal_vert,fragmentShader:Vt.meshnormal_frag},sprite:{uniforms:Ge([xt.sprite,xt.fog]),vertexShader:Vt.sprite_vert,fragmentShader:Vt.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vt.background_vert,fragmentShader:Vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Vt.backgroundCube_vert,fragmentShader:Vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vt.cube_vert,fragmentShader:Vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vt.equirect_vert,fragmentShader:Vt.equirect_frag},distanceRGBA:{uniforms:Ge([xt.common,xt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vt.distanceRGBA_vert,fragmentShader:Vt.distanceRGBA_frag},shadow:{uniforms:Ge([xt.lights,xt.fog,{color:{value:new Pt(0)},opacity:{value:1}}]),vertexShader:Vt.shadow_vert,fragmentShader:Vt.shadow_frag}};Mn.physical={uniforms:Ge([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new Dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Pt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new Dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Pt(0)},specularColor:{value:new Pt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new Dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Vt.meshphysical_vert,fragmentShader:Vt.meshphysical_frag};const eo={r:0,b:0,g:0};function ep(s,t,e,n,i,o,r){const a=new Pt(0);let l=o===!0?0:1,c,h,f=null,u=0,d=null;function x(m,p){let _=!1,v=p.isScene===!0?p.background:null;v&&v.isTexture&&(v=(p.backgroundBlurriness>0?e:t).get(v)),v===null?g(a,l):v&&v.isColor&&(g(v,1),_=!0);const y=s.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,r):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(s.autoClear||_)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),v&&(v.isCubeTexture||v.mapping===Uo)?(h===void 0&&(h=new Qt(new Ps(1,1,1),new xe({name:"BackgroundCubeMaterial",uniforms:Ki(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Ve,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,w,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=te.getTransfer(v.colorSpace)!==le,(f!==v||u!==v.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,f=v,u=v.version,d=s.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Qt(new er(2,2),new xe({name:"BackgroundMaterial",uniforms:Ki(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=te.getTransfer(v.colorSpace)!==le,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(f!==v||u!==v.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,f=v,u=v.version,d=s.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function g(m,p){m.getRGB(eo,Wc(s)),n.buffers.color.setClear(eo.r,eo.g,eo.b,p,r)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,g(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,g(a,l)},render:x}}function np(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:t.get("OES_vertex_array_object"),r=n.isWebGL2||o!==null,a={},l=m(null);let c=l,h=!1;function f(b,R,N,G,D){let z=!1;if(r){const P=g(G,N,R);c!==P&&(c=P,d(c.object)),z=p(b,G,N,D),z&&_(b,G,N,D)}else{const P=R.wireframe===!0;(c.geometry!==G.id||c.program!==N.id||c.wireframe!==P)&&(c.geometry=G.id,c.program=N.id,c.wireframe=P,z=!0)}D!==null&&e.update(D,s.ELEMENT_ARRAY_BUFFER),(z||h)&&(h=!1,A(b,R,N,G),D!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(D).buffer))}function u(){return n.isWebGL2?s.createVertexArray():o.createVertexArrayOES()}function d(b){return n.isWebGL2?s.bindVertexArray(b):o.bindVertexArrayOES(b)}function x(b){return n.isWebGL2?s.deleteVertexArray(b):o.deleteVertexArrayOES(b)}function g(b,R,N){const G=N.wireframe===!0;let D=a[b.id];D===void 0&&(D={},a[b.id]=D);let z=D[R.id];z===void 0&&(z={},D[R.id]=z);let P=z[G];return P===void 0&&(P=m(u()),z[G]=P),P}function m(b){const R=[],N=[],G=[];for(let D=0;D<i;D++)R[D]=0,N[D]=0,G[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:N,attributeDivisors:G,object:b,attributes:{},index:null}}function p(b,R,N,G){const D=c.attributes,z=R.attributes;let P=0;const H=N.getAttributes();for(const j in H)if(H[j].location>=0){const Y=D[j];let K=z[j];if(K===void 0&&(j==="instanceMatrix"&&b.instanceMatrix&&(K=b.instanceMatrix),j==="instanceColor"&&b.instanceColor&&(K=b.instanceColor)),Y===void 0||Y.attribute!==K||K&&Y.data!==K.data)return!0;P++}return c.attributesNum!==P||c.index!==G}function _(b,R,N,G){const D={},z=R.attributes;let P=0;const H=N.getAttributes();for(const j in H)if(H[j].location>=0){let Y=z[j];Y===void 0&&(j==="instanceMatrix"&&b.instanceMatrix&&(Y=b.instanceMatrix),j==="instanceColor"&&b.instanceColor&&(Y=b.instanceColor));const K={};K.attribute=Y,Y&&Y.data&&(K.data=Y.data),D[j]=K,P++}c.attributes=D,c.attributesNum=P,c.index=G}function v(){const b=c.newAttributes;for(let R=0,N=b.length;R<N;R++)b[R]=0}function y(b){T(b,0)}function T(b,R){const N=c.newAttributes,G=c.enabledAttributes,D=c.attributeDivisors;N[b]=1,G[b]===0&&(s.enableVertexAttribArray(b),G[b]=1),D[b]!==R&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](b,R),D[b]=R)}function w(){const b=c.newAttributes,R=c.enabledAttributes;for(let N=0,G=R.length;N<G;N++)R[N]!==b[N]&&(s.disableVertexAttribArray(N),R[N]=0)}function E(b,R,N,G,D,z,P){P===!0?s.vertexAttribIPointer(b,R,N,D,z):s.vertexAttribPointer(b,R,N,G,D,z)}function A(b,R,N,G){if(n.isWebGL2===!1&&(b.isInstancedMesh||G.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;v();const D=G.attributes,z=N.getAttributes(),P=R.defaultAttributeValues;for(const H in z){const j=z[H];if(j.location>=0){let B=D[H];if(B===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(B=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(B=b.instanceColor)),B!==void 0){const Y=B.normalized,K=B.itemSize,tt=e.get(B);if(tt===void 0)continue;const lt=tt.buffer,ht=tt.type,q=tt.bytesPerElement,X=n.isWebGL2===!0&&(ht===s.INT||ht===s.UNSIGNED_INT||B.gpuType===Ac);if(B.isInterleavedBufferAttribute){const it=B.data,O=it.stride,mt=B.offset;if(it.isInstancedInterleavedBuffer){for(let at=0;at<j.locationSize;at++)T(j.location+at,it.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let at=0;at<j.locationSize;at++)y(j.location+at);s.bindBuffer(s.ARRAY_BUFFER,lt);for(let at=0;at<j.locationSize;at++)E(j.location+at,K/j.locationSize,ht,Y,O*q,(mt+K/j.locationSize*at)*q,X)}else{if(B.isInstancedBufferAttribute){for(let it=0;it<j.locationSize;it++)T(j.location+it,B.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let it=0;it<j.locationSize;it++)y(j.location+it);s.bindBuffer(s.ARRAY_BUFFER,lt);for(let it=0;it<j.locationSize;it++)E(j.location+it,K/j.locationSize,ht,Y,K*q,K/j.locationSize*it*q,X)}}else if(P!==void 0){const Y=P[H];if(Y!==void 0)switch(Y.length){case 2:s.vertexAttrib2fv(j.location,Y);break;case 3:s.vertexAttrib3fv(j.location,Y);break;case 4:s.vertexAttrib4fv(j.location,Y);break;default:s.vertexAttrib1fv(j.location,Y)}}}}w()}function M(){I();for(const b in a){const R=a[b];for(const N in R){const G=R[N];for(const D in G)x(G[D].object),delete G[D];delete R[N]}delete a[b]}}function S(b){if(a[b.id]===void 0)return;const R=a[b.id];for(const N in R){const G=R[N];for(const D in G)x(G[D].object),delete G[D];delete R[N]}delete a[b.id]}function C(b){for(const R in a){const N=a[R];if(N[b.id]===void 0)continue;const G=N[b.id];for(const D in G)x(G[D].object),delete G[D];delete N[b.id]}}function I(){k(),h=!0,c!==l&&(c=l,d(c.object))}function k(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:I,resetDefaultState:k,dispose:M,releaseStatesOfGeometry:S,releaseStatesOfProgram:C,initAttributes:v,enableAttribute:y,disableUnusedAttributes:w}}function ip(s,t,e,n){const i=n.isWebGL2;let o;function r(h){o=h}function a(h,f){s.drawArrays(o,h,f),e.update(f,o,1)}function l(h,f,u){if(u===0)return;let d,x;if(i)d=s,x="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),x="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[x](o,h,f,u),e.update(f,o,u)}function c(h,f,u){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let x=0;x<u;x++)this.render(h[x],f[x]);else{d.multiDrawArraysWEBGL(o,h,0,f,0,u);let x=0;for(let g=0;g<u;g++)x+=f[g];e.update(x,o,1)}}this.setMode=r,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function sp(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const E=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const r=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const l=o(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);const c=r||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),u=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_TEXTURE_SIZE),x=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),v=u>0,y=r||t.has("OES_texture_float"),T=v&&y,w=r?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:r,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:o,precision:a,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:u,maxTextureSize:d,maxCubemapSize:x,maxAttributes:g,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:_,vertexTextures:v,floatFragmentTextures:y,floatVertexTextures:T,maxSamples:w}}function op(s){const t=this;let e=null,n=0,i=!1,o=!1;const r=new ai,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||i;return i=u,n=f.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const x=f.clippingPlanes,g=f.clipIntersection,m=f.clipShadows,p=s.get(f);if(!i||x===null||x.length===0||o&&!m)o?h(null):c();else{const _=o?0:n,v=_*4;let y=p.clippingState||null;l.value=y,y=h(x,u,v,d);for(let T=0;T!==v;++T)y[T]=e[T];p.clippingState=y,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,x){const g=f!==null?f.length:0;let m=null;if(g!==0){if(m=l.value,x!==!0||m===null){const p=d+g*4,_=u.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<p)&&(m=new Float32Array(p));for(let v=0,y=d;v!==g;++v,y+=4)r.copy(f[v]).applyMatrix4(_,a),r.normal.toArray(m,y),m[y+3]=r.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function ap(s){let t=new WeakMap;function e(r,a){return a===Da?r.mapping=Yi:a===Ua&&(r.mapping=ji),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===Da||a===Ua)if(t.has(r)){const l=t.get(r).texture;return e(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new xf(l.height/2);return c.fromEquirectangularTexture(s,r),t.set(r,c),r.addEventListener("dispose",i),e(c.texture,r.mapping)}else return null}}return r}function i(r){const a=r.target;a.removeEventListener("dispose",i);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Ds extends qc{constructor(t=-1,e=1,n=1,i=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,r=o+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Oi=4,gl=[.125,.215,.35,.446,.526,.582],ci=20,fa=new Ds,vl=new Pt;let da=null,pa=0,ma=0;const ri=(1+Math.sqrt(5))/2,Ui=1/ri,xl=[new V(1,1,1),new V(-1,1,1),new V(1,1,-1),new V(-1,1,-1),new V(0,ri,Ui),new V(0,ri,-Ui),new V(Ui,0,ri),new V(-Ui,0,ri),new V(ri,Ui,0),new V(-ri,Ui,0)];class _l{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){da=this._renderer.getRenderTarget(),pa=this._renderer.getActiveCubeFace(),ma=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,i,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(da,pa,ma),t.scissorTest=!1,no(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Yi||t.mapping===ji?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),da=this._renderer.getRenderTarget(),pa=this._renderer.getActiveCubeFace(),ma=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ie,minFilter:ie,generateMipmaps:!1,type:Hn,format:ke,colorSpace:Gn,depthBuffer:!1},i=Ml(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ml(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=rp(o)),this._blurMaterial=lp(o,t,e)}return i}_compileMaterial(t){const e=new Qt(this._lodPlanes[0],t);this._renderer.compile(e,fa)}_sceneToCubeUV(t,e,n,i){const a=new Ye(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(vl),h.toneMapping=Zn,h.autoClear=!1;const d=new Hc({name:"PMREM.Background",side:Ve,depthWrite:!1,depthTest:!1}),x=new Qt(new Ps,d);let g=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,g=!0):(d.color.copy(vl),g=!0);for(let p=0;p<6;p++){const _=p%3;_===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):_===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const v=this._cubeSize;no(i,_*v,p>2?v:0,v,v),h.setRenderTarget(i),g&&h.render(x,a),h.render(t,a)}x.geometry.dispose(),x.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Yi||t.mapping===ji;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=wl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yl());const o=i?this._cubemapMaterial:this._equirectMaterial,r=new Qt(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const l=this._cubeSize;no(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(r,fa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const o=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),r=xl[(i-1)%xl.length];this._blur(t,i-1,i,o,r)}e.autoClear=n}_blur(t,e,n,i,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,i,"latitudinal",o),this._halfBlur(r,t,n,n,i,"longitudinal",o)}_halfBlur(t,e,n,i,o,r,a){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new Qt(this._lodPlanes[i],c),u=c.uniforms,d=this._sizeLods[n]-1,x=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*ci-1),g=o/x,m=isFinite(o)?1+Math.floor(h*g):ci;m>ci&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ci}`);const p=[];let _=0;for(let E=0;E<ci;++E){const A=E/g,M=Math.exp(-A*A/2);p.push(M),E===0?_+=M:E<m&&(_+=2*M)}for(let E=0;E<p.length;E++)p[E]=p[E]/_;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=r==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:v}=this;u.dTheta.value=x,u.mipInt.value=v-n;const y=this._sizeLods[i],T=3*y*(i>v-Oi?i-v+Oi:0),w=4*(this._cubeSize-y);no(e,T,w,3*y,2*y),l.setRenderTarget(e),l.render(f,fa)}}function rp(s){const t=[],e=[],n=[];let i=s;const o=s-Oi+1+gl.length;for(let r=0;r<o;r++){const a=Math.pow(2,i);e.push(a);let l=1/a;r>s-Oi?l=gl[r-s+Oi-1]:r===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,x=6,g=3,m=2,p=1,_=new Float32Array(g*x*d),v=new Float32Array(m*x*d),y=new Float32Array(p*x*d);for(let w=0;w<d;w++){const E=w%3*2/3-1,A=w>2?0:-1,M=[E,A,0,E+2/3,A,0,E+2/3,A+1,0,E,A,0,E+2/3,A+1,0,E,A+1,0];_.set(M,g*x*w),v.set(u,m*x*w);const S=[w,w,w,w,w,w];y.set(S,p*x*w)}const T=new be;T.setAttribute("position",new ue(_,g)),T.setAttribute("uv",new ue(v,m)),T.setAttribute("faceIndex",new ue(y,p)),t.push(T),i>Oi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ml(s,t,e){const n=new on(s,t,e);return n.texture.mapping=Uo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function no(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function lp(s,t,e){const n=new Float32Array(ci),i=new V(0,1,0);return new xe({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:nr(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function yl(){return new xe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:nr(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function wl(){return new xe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:nr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function nr(){return`

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
	`}function cp(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===Da||l===Ua,h=l===Yi||l===ji;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let f=t.get(a);return e===null&&(e=new _l(s)),f=c?e.fromEquirectangular(a,f):e.fromCubemap(a,f),t.set(a,f),f.texture}else{if(t.has(a))return t.get(a).texture;{const f=a.image;if(c&&f&&f.height>0||h&&f&&i(f)){e===null&&(e=new _l(s));const u=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,u),a.addEventListener("dispose",o),u.texture}else return null}}}return a}function i(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function o(a){const l=a.target;l.removeEventListener("dispose",o);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function hp(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function up(s,t,e,n){const i={},o=new WeakMap;function r(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const x in u.attributes)t.remove(u.attributes[x]);for(const x in u.morphAttributes){const g=u.morphAttributes[x];for(let m=0,p=g.length;m<p;m++)t.remove(g[m])}u.removeEventListener("dispose",r),delete i[u.id];const d=o.get(u);d&&(t.remove(d),o.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return i[u.id]===!0||(u.addEventListener("dispose",r),i[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const x in u)t.update(u[x],s.ARRAY_BUFFER);const d=f.morphAttributes;for(const x in d){const g=d[x];for(let m=0,p=g.length;m<p;m++)t.update(g[m],s.ARRAY_BUFFER)}}function c(f){const u=[],d=f.index,x=f.attributes.position;let g=0;if(d!==null){const _=d.array;g=d.version;for(let v=0,y=_.length;v<y;v+=3){const T=_[v+0],w=_[v+1],E=_[v+2];u.push(T,w,w,E,E,T)}}else if(x!==void 0){const _=x.array;g=x.version;for(let v=0,y=_.length/3-1;v<y;v+=3){const T=v+0,w=v+1,E=v+2;u.push(T,w,w,E,E,T)}}else return;const m=new(zc(u)?Vc:Gc)(u,1);m.version=g;const p=o.get(f);p&&t.remove(p),o.set(f,m)}function h(f){const u=o.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return o.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function fp(s,t,e,n){const i=n.isWebGL2;let o;function r(d){o=d}let a,l;function c(d){a=d.type,l=d.bytesPerElement}function h(d,x){s.drawElements(o,x,a,d*l),e.update(x,o,1)}function f(d,x,g){if(g===0)return;let m,p;if(i)m=s,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](o,x,a,d*l,g),e.update(x,o,g)}function u(d,x,g){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<g;p++)this.render(d[p]/l,x[p]);else{m.multiDrawElementsWEBGL(o,x,0,a,d,0,g);let p=0;for(let _=0;_<g;_++)p+=x[_];e.update(p,o,1)}}this.setMode=r,this.setIndex=c,this.render=h,this.renderInstances=f,this.renderMultiDraw=u}function dp(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case s.TRIANGLES:e.triangles+=a*(o/3);break;case s.LINES:e.lines+=a*(o/2);break;case s.LINE_STRIP:e.lines+=a*(o-1);break;case s.LINE_LOOP:e.lines+=a*o;break;case s.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function pp(s,t){return s[0]-t[0]}function mp(s,t){return Math.abs(t[1])-Math.abs(s[1])}function gp(s,t,e){const n={},i=new Float32Array(8),o=new WeakMap,r=new ve,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,f){const u=c.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=d!==void 0?d.length:0;let g=o.get(h);if(g===void 0||g.count!==x){let b=function(){I.dispose(),o.delete(h),h.removeEventListener("dispose",b)};g!==void 0&&g.texture.dispose();const _=h.morphAttributes.position!==void 0,v=h.morphAttributes.normal!==void 0,y=h.morphAttributes.color!==void 0,T=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],E=h.morphAttributes.color||[];let A=0;_===!0&&(A=1),v===!0&&(A=2),y===!0&&(A=3);let M=h.attributes.position.count*A,S=1;M>t.maxTextureSize&&(S=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const C=new Float32Array(M*S*4*x),I=new Oc(C,M,S,x);I.type=gn,I.needsUpdate=!0;const k=A*4;for(let R=0;R<x;R++){const N=T[R],G=w[R],D=E[R],z=M*S*4*R;for(let P=0;P<N.count;P++){const H=P*k;_===!0&&(r.fromBufferAttribute(N,P),C[z+H+0]=r.x,C[z+H+1]=r.y,C[z+H+2]=r.z,C[z+H+3]=0),v===!0&&(r.fromBufferAttribute(G,P),C[z+H+4]=r.x,C[z+H+5]=r.y,C[z+H+6]=r.z,C[z+H+7]=0),y===!0&&(r.fromBufferAttribute(D,P),C[z+H+8]=r.x,C[z+H+9]=r.y,C[z+H+10]=r.z,C[z+H+11]=D.itemSize===4?r.w:1)}}g={count:x,texture:I,size:new Dt(M,S)},o.set(h,g),h.addEventListener("dispose",b)}let m=0;for(let _=0;_<u.length;_++)m+=u[_];const p=h.morphTargetsRelative?1:1-m;f.getUniforms().setValue(s,"morphTargetBaseInfluence",p),f.getUniforms().setValue(s,"morphTargetInfluences",u),f.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),f.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const d=u===void 0?0:u.length;let x=n[h.id];if(x===void 0||x.length!==d){x=[];for(let v=0;v<d;v++)x[v]=[v,0];n[h.id]=x}for(let v=0;v<d;v++){const y=x[v];y[0]=v,y[1]=u[v]}x.sort(mp);for(let v=0;v<8;v++)v<d&&x[v][1]?(a[v][0]=x[v][0],a[v][1]=x[v][1]):(a[v][0]=Number.MAX_SAFE_INTEGER,a[v][1]=0);a.sort(pp);const g=h.morphAttributes.position,m=h.morphAttributes.normal;let p=0;for(let v=0;v<8;v++){const y=a[v],T=y[0],w=y[1];T!==Number.MAX_SAFE_INTEGER&&w?(g&&h.getAttribute("morphTarget"+v)!==g[T]&&h.setAttribute("morphTarget"+v,g[T]),m&&h.getAttribute("morphNormal"+v)!==m[T]&&h.setAttribute("morphNormal"+v,m[T]),i[v]=w,p+=w):(g&&h.hasAttribute("morphTarget"+v)===!0&&h.deleteAttribute("morphTarget"+v),m&&h.hasAttribute("morphNormal"+v)===!0&&h.deleteAttribute("morphNormal"+v),i[v]=0)}const _=h.morphTargetsRelative?1:1-p;f.getUniforms().setValue(s,"morphTargetBaseInfluence",_),f.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function vp(s,t,e,n){let i=new WeakMap;function o(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(i.get(f)!==c&&(t.update(f),i.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return f}function r(){i=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:o,dispose:r}}class ir extends Ke{constructor(t,e,n,i,o,r,a,l,c,h){if(h=h!==void 0?h:fi,h!==fi&&h!==$i)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===fi&&(n=In),n===void 0&&h===$i&&(n=ui),super(null,i,o,r,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:fe,this.minFilter=l!==void 0?l:fe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const jc=new Ke,$c=new ir(1,1);$c.compareFunction=Ic;const Kc=new Oc,Zc=new ka,Jc=new Xc,Sl=[],bl=[],El=new Float32Array(16),Tl=new Float32Array(9),Al=new Float32Array(4);function is(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let o=Sl[i];if(o===void 0&&(o=new Float32Array(i),Sl[i]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,s[r].toArray(o,a)}return o}function Ee(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Te(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Io(s,t){let e=bl[t];e===void 0&&(e=new Int32Array(t),bl[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function xp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function _p(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;s.uniform2fv(this.addr,t),Te(e,t)}}function Mp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;s.uniform3fv(this.addr,t),Te(e,t)}}function yp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;s.uniform4fv(this.addr,t),Te(e,t)}}function wp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;Al.set(n),s.uniformMatrix2fv(this.addr,!1,Al),Te(e,n)}}function Sp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;Tl.set(n),s.uniformMatrix3fv(this.addr,!1,Tl),Te(e,n)}}function bp(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;El.set(n),s.uniformMatrix4fv(this.addr,!1,El),Te(e,n)}}function Ep(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Tp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;s.uniform2iv(this.addr,t),Te(e,t)}}function Ap(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;s.uniform3iv(this.addr,t),Te(e,t)}}function Cp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;s.uniform4iv(this.addr,t),Te(e,t)}}function Rp(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Pp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;s.uniform2uiv(this.addr,t),Te(e,t)}}function Lp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;s.uniform3uiv(this.addr,t),Te(e,t)}}function Dp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;s.uniform4uiv(this.addr,t),Te(e,t)}}function Up(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const o=this.type===s.SAMPLER_2D_SHADOW?$c:jc;e.setTexture2D(t||o,i)}function Fp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Zc,i)}function Ip(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Jc,i)}function zp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Kc,i)}function kp(s){switch(s){case 5126:return xp;case 35664:return _p;case 35665:return Mp;case 35666:return yp;case 35674:return wp;case 35675:return Sp;case 35676:return bp;case 5124:case 35670:return Ep;case 35667:case 35671:return Tp;case 35668:case 35672:return Ap;case 35669:case 35673:return Cp;case 5125:return Rp;case 36294:return Pp;case 36295:return Lp;case 36296:return Dp;case 35678:case 36198:case 36298:case 36306:case 35682:return Up;case 35679:case 36299:case 36307:return Fp;case 35680:case 36300:case 36308:case 36293:return Ip;case 36289:case 36303:case 36311:case 36292:return zp}}function Np(s,t){s.uniform1fv(this.addr,t)}function Op(s,t){const e=is(t,this.size,2);s.uniform2fv(this.addr,e)}function Bp(s,t){const e=is(t,this.size,3);s.uniform3fv(this.addr,e)}function Hp(s,t){const e=is(t,this.size,4);s.uniform4fv(this.addr,e)}function Gp(s,t){const e=is(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Vp(s,t){const e=is(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Wp(s,t){const e=is(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function qp(s,t){s.uniform1iv(this.addr,t)}function Xp(s,t){s.uniform2iv(this.addr,t)}function Yp(s,t){s.uniform3iv(this.addr,t)}function jp(s,t){s.uniform4iv(this.addr,t)}function $p(s,t){s.uniform1uiv(this.addr,t)}function Kp(s,t){s.uniform2uiv(this.addr,t)}function Zp(s,t){s.uniform3uiv(this.addr,t)}function Jp(s,t){s.uniform4uiv(this.addr,t)}function Qp(s,t,e){const n=this.cache,i=t.length,o=Io(e,i);Ee(n,o)||(s.uniform1iv(this.addr,o),Te(n,o));for(let r=0;r!==i;++r)e.setTexture2D(t[r]||jc,o[r])}function tm(s,t,e){const n=this.cache,i=t.length,o=Io(e,i);Ee(n,o)||(s.uniform1iv(this.addr,o),Te(n,o));for(let r=0;r!==i;++r)e.setTexture3D(t[r]||Zc,o[r])}function em(s,t,e){const n=this.cache,i=t.length,o=Io(e,i);Ee(n,o)||(s.uniform1iv(this.addr,o),Te(n,o));for(let r=0;r!==i;++r)e.setTextureCube(t[r]||Jc,o[r])}function nm(s,t,e){const n=this.cache,i=t.length,o=Io(e,i);Ee(n,o)||(s.uniform1iv(this.addr,o),Te(n,o));for(let r=0;r!==i;++r)e.setTexture2DArray(t[r]||Kc,o[r])}function im(s){switch(s){case 5126:return Np;case 35664:return Op;case 35665:return Bp;case 35666:return Hp;case 35674:return Gp;case 35675:return Vp;case 35676:return Wp;case 5124:case 35670:return qp;case 35667:case 35671:return Xp;case 35668:case 35672:return Yp;case 35669:case 35673:return jp;case 5125:return $p;case 36294:return Kp;case 36295:return Zp;case 36296:return Jp;case 35678:case 36198:case 36298:case 36306:case 35682:return Qp;case 35679:case 36299:case 36307:return tm;case 35680:case 36300:case 36308:case 36293:return em;case 36289:case 36303:case 36311:case 36292:return nm}}class sm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=kp(e.type)}}class om{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=im(e.type)}}class am{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let o=0,r=i.length;o!==r;++o){const a=i[o];a.setValue(t,e[a.id],n)}}}const ga=/(\w+)(\])?(\[|\.)?/g;function Cl(s,t){s.seq.push(t),s.map[t.id]=t}function rm(s,t,e){const n=s.name,i=n.length;for(ga.lastIndex=0;;){const o=ga.exec(n),r=ga.lastIndex;let a=o[1];const l=o[2]==="]",c=o[3];if(l&&(a=a|0),c===void 0||c==="["&&r+2===i){Cl(e,c===void 0?new sm(a,s,t):new om(a,s,t));break}else{let f=e.map[a];f===void 0&&(f=new am(a),Cl(e,f)),e=f}}}class vo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=t.getActiveUniform(e,i),r=t.getUniformLocation(e,o.name);rm(o,r,this)}}setValue(t,e,n,i){const o=this.map[e];o!==void 0&&o.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let o=0,r=e.length;o!==r;++o){const a=e[o],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,o=t.length;i!==o;++i){const r=t[i];r.id in e&&n.push(r)}return n}}function Rl(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const lm=37297;let cm=0;function hm(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=i;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}function um(s){const t=te.getPrimaries(te.workingColorSpace),e=te.getPrimaries(s);let n;switch(t===e?n="":t===To&&e===Eo?n="LinearDisplayP3ToLinearSRGB":t===Eo&&e===To&&(n="LinearSRGBToLinearDisplayP3"),s){case Gn:case Fo:return[n,"LinearTransferOETF"];case Le:case Za:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Pl(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const o=/ERROR: 0:(\d+)/.exec(i);if(o){const r=parseInt(o[1]);return e.toUpperCase()+`

`+i+`

`+hm(s.getShaderSource(t),r)}else return i}function fm(s,t){const e=um(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function dm(s,t){let e;switch(t){case ru:e="Linear";break;case lu:e="Reinhard";break;case cu:e="OptimizedCineon";break;case hu:e="ACESFilmic";break;case fu:e="AgX";break;case uu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function pm(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Bi).join(`
`)}function mm(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Bi).join(`
`)}function gm(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function vm(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=s.getActiveAttrib(t,i),r=o.name;let a=1;o.type===s.FLOAT_MAT2&&(a=2),o.type===s.FLOAT_MAT3&&(a=3),o.type===s.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:s.getAttribLocation(t,r),locationSize:a}}return e}function Bi(s){return s!==""}function Ll(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Dl(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const xm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Na(s){return s.replace(xm,Mm)}const _m=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Mm(s,t){let e=Vt[t];if(e===void 0){const n=_m.get(t);if(n!==void 0)e=Vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Na(e)}const ym=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ul(s){return s.replace(ym,wm)}function wm(s,t,e,n){let i="";for(let o=parseInt(t);o<parseInt(e);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function Fl(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Sm(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===bc?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Ih?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Dn&&(t="SHADOWMAP_TYPE_VSM"),t}function bm(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Yi:case ji:t="ENVMAP_TYPE_CUBE";break;case Uo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Em(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ji:t="ENVMAP_MODE_REFRACTION";break}return t}function Tm(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ec:t="ENVMAP_BLENDING_MULTIPLY";break;case ou:t="ENVMAP_BLENDING_MIX";break;case au:t="ENVMAP_BLENDING_ADD";break}return t}function Am(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Cm(s,t,e,n){const i=s.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const l=Sm(e),c=bm(e),h=Em(e),f=Tm(e),u=Am(e),d=e.isWebGL2?"":pm(e),x=mm(e),g=gm(o),m=i.createProgram();let p,_,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Bi).join(`
`),p.length>0&&(p+=`
`),_=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Bi).join(`
`),_.length>0&&(_+=`
`)):(p=[Fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Bi).join(`
`),_=[d,Fl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Zn?"#define TONE_MAPPING":"",e.toneMapping!==Zn?Vt.tonemapping_pars_fragment:"",e.toneMapping!==Zn?dm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Vt.colorspace_pars_fragment,fm("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Bi).join(`
`)),r=Na(r),r=Ll(r,e),r=Dl(r,e),a=Na(a),a=Ll(a,e),a=Dl(a,e),r=Ul(r),a=Ul(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[x,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,_=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Zr?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Zr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const y=v+p+r,T=v+_+a,w=Rl(i,i.VERTEX_SHADER,y),E=Rl(i,i.FRAGMENT_SHADER,T);i.attachShader(m,w),i.attachShader(m,E),e.index0AttributeName!==void 0?i.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function A(I){if(s.debug.checkShaderErrors){const k=i.getProgramInfoLog(m).trim(),b=i.getShaderInfoLog(w).trim(),R=i.getShaderInfoLog(E).trim();let N=!0,G=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(N=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,w,E);else{const D=Pl(i,w,"vertex"),z=Pl(i,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+k+`
`+D+`
`+z)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(b===""||R==="")&&(G=!1);G&&(I.diagnostics={runnable:N,programLog:k,vertexShader:{log:b,prefix:p},fragmentShader:{log:R,prefix:_}})}i.deleteShader(w),i.deleteShader(E),M=new vo(i,m),S=vm(i,m)}let M;this.getUniforms=function(){return M===void 0&&A(this),M};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(m,lm)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=cm++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=w,this.fragmentShader=E,this}let Rm=0;class Pm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(i)===!1&&(r.add(i),i.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Lm(t),e.set(t,n)),n}}class Lm{constructor(t){this.id=Rm++,this.code=t,this.usedTimes=0}}function Dm(s,t,e,n,i,o,r){const a=new tr,l=new Pm,c=[],h=i.isWebGL2,f=i.logarithmicDepthBuffer,u=i.vertexTextures;let d=i.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return M===0?"uv":`uv${M}`}function m(M,S,C,I,k){const b=I.fog,R=k.geometry,N=M.isMeshStandardMaterial?I.environment:null,G=(M.isMeshStandardMaterial?e:t).get(M.envMap||N),D=G&&G.mapping===Uo?G.image.height:null,z=x[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const P=R.morphAttributes.position||R.morphAttributes.normal||R.morphAttributes.color,H=P!==void 0?P.length:0;let j=0;R.morphAttributes.position!==void 0&&(j=1),R.morphAttributes.normal!==void 0&&(j=2),R.morphAttributes.color!==void 0&&(j=3);let B,Y,K,tt;if(z){const Oe=Mn[z];B=Oe.vertexShader,Y=Oe.fragmentShader}else B=M.vertexShader,Y=M.fragmentShader,l.update(M),K=l.getVertexShaderID(M),tt=l.getFragmentShaderID(M);const lt=s.getRenderTarget(),ht=k.isInstancedMesh===!0,q=k.isBatchedMesh===!0,X=!!M.map,it=!!M.matcap,O=!!G,mt=!!M.aoMap,at=!!M.lightMap,ft=!!M.bumpMap,ut=!!M.normalMap,Ot=!!M.displacementMap,Ct=!!M.emissiveMap,F=!!M.metalnessMap,L=!!M.roughnessMap,Z=M.anisotropy>0,rt=M.clearcoat>0,st=M.iridescence>0,ct=M.sheen>0,St=M.transmission>0,gt=Z&&!!M.anisotropyMap,dt=rt&&!!M.clearcoatMap,Et=rt&&!!M.clearcoatNormalMap,Rt=rt&&!!M.clearcoatRoughnessMap,ot=st&&!!M.iridescenceMap,$t=st&&!!M.iridescenceThicknessMap,It=ct&&!!M.sheenColorMap,Ut=ct&&!!M.sheenRoughnessMap,Tt=!!M.specularMap,bt=!!M.specularColorMap,Gt=!!M.specularIntensityMap,Jt=St&&!!M.transmissionMap,pe=St&&!!M.thicknessMap,qt=!!M.gradientMap,vt=!!M.alphaMap,W=M.alphaTest>0,_t=!!M.alphaHash,Mt=!!M.extensions,zt=!!R.attributes.uv1,Lt=!!R.attributes.uv2,se=!!R.attributes.uv3;let oe=Zn;return M.toneMapped&&(lt===null||lt.isXRRenderTarget===!0)&&(oe=s.toneMapping),{isWebGL2:h,shaderID:z,shaderType:M.type,shaderName:M.name,vertexShader:B,fragmentShader:Y,defines:M.defines,customVertexShaderID:K,customFragmentShaderID:tt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:q,instancing:ht,instancingColor:ht&&k.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:lt===null?s.outputColorSpace:lt.isXRRenderTarget===!0?lt.texture.colorSpace:Gn,map:X,matcap:it,envMap:O,envMapMode:O&&G.mapping,envMapCubeUVHeight:D,aoMap:mt,lightMap:at,bumpMap:ft,normalMap:ut,displacementMap:u&&Ot,emissiveMap:Ct,normalMapObjectSpace:ut&&M.normalMapType===bu,normalMapTangentSpace:ut&&M.normalMapType===Su,metalnessMap:F,roughnessMap:L,anisotropy:Z,anisotropyMap:gt,clearcoat:rt,clearcoatMap:dt,clearcoatNormalMap:Et,clearcoatRoughnessMap:Rt,iridescence:st,iridescenceMap:ot,iridescenceThicknessMap:$t,sheen:ct,sheenColorMap:It,sheenRoughnessMap:Ut,specularMap:Tt,specularColorMap:bt,specularIntensityMap:Gt,transmission:St,transmissionMap:Jt,thicknessMap:pe,gradientMap:qt,opaque:M.transparent===!1&&M.blending===Gi,alphaMap:vt,alphaTest:W,alphaHash:_t,combine:M.combine,mapUv:X&&g(M.map.channel),aoMapUv:mt&&g(M.aoMap.channel),lightMapUv:at&&g(M.lightMap.channel),bumpMapUv:ft&&g(M.bumpMap.channel),normalMapUv:ut&&g(M.normalMap.channel),displacementMapUv:Ot&&g(M.displacementMap.channel),emissiveMapUv:Ct&&g(M.emissiveMap.channel),metalnessMapUv:F&&g(M.metalnessMap.channel),roughnessMapUv:L&&g(M.roughnessMap.channel),anisotropyMapUv:gt&&g(M.anisotropyMap.channel),clearcoatMapUv:dt&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:Et&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Rt&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ot&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:$t&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:It&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&g(M.sheenRoughnessMap.channel),specularMapUv:Tt&&g(M.specularMap.channel),specularColorMapUv:bt&&g(M.specularColorMap.channel),specularIntensityMapUv:Gt&&g(M.specularIntensityMap.channel),transmissionMapUv:Jt&&g(M.transmissionMap.channel),thicknessMapUv:pe&&g(M.thicknessMap.channel),alphaMapUv:vt&&g(M.alphaMap.channel),vertexTangents:!!R.attributes.tangent&&(ut||Z),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!R.attributes.color&&R.attributes.color.itemSize===4,vertexUv1s:zt,vertexUv2s:Lt,vertexUv3s:se,pointsUvs:k.isPoints===!0&&!!R.attributes.uv&&(X||vt),fog:!!b,useFog:M.fog===!0,fogExp2:b&&b.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:k.isSkinnedMesh===!0,morphTargets:R.morphAttributes.position!==void 0,morphNormals:R.morphAttributes.normal!==void 0,morphColors:R.morphAttributes.color!==void 0,morphTargetsCount:H,morphTextureStride:j,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:oe,useLegacyLights:s._useLegacyLights,decodeVideoTexture:X&&M.map.isVideoTexture===!0&&te.getTransfer(M.map.colorSpace)===le,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===je,flipSided:M.side===Ve,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:Mt&&M.extensions.derivatives===!0,extensionFragDepth:Mt&&M.extensions.fragDepth===!0,extensionDrawBuffers:Mt&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:Mt&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Mt&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function p(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)S.push(C),S.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(_(S,M),v(S,M),S.push(s.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function _(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function v(M,S){a.disableAll(),S.isWebGL2&&a.enable(0),S.supportsVertexTextures&&a.enable(1),S.instancing&&a.enable(2),S.instancingColor&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),M.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.skinning&&a.enable(4),S.morphTargets&&a.enable(5),S.morphNormals&&a.enable(6),S.morphColors&&a.enable(7),S.premultipliedAlpha&&a.enable(8),S.shadowMapEnabled&&a.enable(9),S.useLegacyLights&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),M.push(a.mask)}function y(M){const S=x[M.type];let C;if(S){const I=Mn[S];C=pf.clone(I.uniforms)}else C=M.uniforms;return C}function T(M,S){let C;for(let I=0,k=c.length;I<k;I++){const b=c[I];if(b.cacheKey===S){C=b,++C.usedTimes;break}}return C===void 0&&(C=new Cm(s,S,M,o),c.push(C)),C}function w(M){if(--M.usedTimes===0){const S=c.indexOf(M);c[S]=c[c.length-1],c.pop(),M.destroy()}}function E(M){l.remove(M)}function A(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:T,releaseProgram:w,releaseShaderCache:E,programs:c,dispose:A}}function Um(){let s=new WeakMap;function t(o){let r=s.get(o);return r===void 0&&(r={},s.set(o,r)),r}function e(o){s.delete(o)}function n(o,r,a){s.get(o)[r]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Fm(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Il(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function zl(){const s=[];let t=0;const e=[],n=[],i=[];function o(){t=0,e.length=0,n.length=0,i.length=0}function r(f,u,d,x,g,m){let p=s[t];return p===void 0?(p={id:f.id,object:f,geometry:u,material:d,groupOrder:x,renderOrder:f.renderOrder,z:g,group:m},s[t]=p):(p.id=f.id,p.object=f,p.geometry=u,p.material=d,p.groupOrder=x,p.renderOrder=f.renderOrder,p.z=g,p.group=m),t++,p}function a(f,u,d,x,g,m){const p=r(f,u,d,x,g,m);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):e.push(p)}function l(f,u,d,x,g,m){const p=r(f,u,d,x,g,m);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):e.unshift(p)}function c(f,u){e.length>1&&e.sort(f||Fm),n.length>1&&n.sort(u||Il),i.length>1&&i.sort(u||Il)}function h(){for(let f=t,u=s.length;f<u;f++){const d=s[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:o,push:a,unshift:l,finish:h,sort:c}}function Im(){let s=new WeakMap;function t(n,i){const o=s.get(n);let r;return o===void 0?(r=new zl,s.set(n,[r])):i>=o.length?(r=new zl,o.push(r)):r=o[i],r}function e(){s=new WeakMap}return{get:t,dispose:e}}function zm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new Pt};break;case"SpotLight":e={position:new V,direction:new V,color:new Pt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new Pt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new Pt,groundColor:new Pt};break;case"RectAreaLight":e={color:new Pt,position:new V,halfWidth:new V,halfHeight:new V};break}return s[t.id]=e,e}}}function km(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Dt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Dt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Nm=0;function Om(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Bm(s,t){const e=new zm,n=km(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new V);const o=new V,r=new jt,a=new jt;function l(h,f){let u=0,d=0,x=0;for(let I=0;I<9;I++)i.probe[I].set(0,0,0);let g=0,m=0,p=0,_=0,v=0,y=0,T=0,w=0,E=0,A=0,M=0;h.sort(Om);const S=f===!0?Math.PI:1;for(let I=0,k=h.length;I<k;I++){const b=h[I],R=b.color,N=b.intensity,G=b.distance,D=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)u+=R.r*N*S,d+=R.g*N*S,x+=R.b*N*S;else if(b.isLightProbe){for(let z=0;z<9;z++)i.probe[z].addScaledVector(b.sh.coefficients[z],N);M++}else if(b.isDirectionalLight){const z=e.get(b);if(z.color.copy(b.color).multiplyScalar(b.intensity*S),b.castShadow){const P=b.shadow,H=n.get(b);H.shadowBias=P.bias,H.shadowNormalBias=P.normalBias,H.shadowRadius=P.radius,H.shadowMapSize=P.mapSize,i.directionalShadow[g]=H,i.directionalShadowMap[g]=D,i.directionalShadowMatrix[g]=b.shadow.matrix,y++}i.directional[g]=z,g++}else if(b.isSpotLight){const z=e.get(b);z.position.setFromMatrixPosition(b.matrixWorld),z.color.copy(R).multiplyScalar(N*S),z.distance=G,z.coneCos=Math.cos(b.angle),z.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),z.decay=b.decay,i.spot[p]=z;const P=b.shadow;if(b.map&&(i.spotLightMap[E]=b.map,E++,P.updateMatrices(b),b.castShadow&&A++),i.spotLightMatrix[p]=P.matrix,b.castShadow){const H=n.get(b);H.shadowBias=P.bias,H.shadowNormalBias=P.normalBias,H.shadowRadius=P.radius,H.shadowMapSize=P.mapSize,i.spotShadow[p]=H,i.spotShadowMap[p]=D,w++}p++}else if(b.isRectAreaLight){const z=e.get(b);z.color.copy(R).multiplyScalar(N),z.halfWidth.set(b.width*.5,0,0),z.halfHeight.set(0,b.height*.5,0),i.rectArea[_]=z,_++}else if(b.isPointLight){const z=e.get(b);if(z.color.copy(b.color).multiplyScalar(b.intensity*S),z.distance=b.distance,z.decay=b.decay,b.castShadow){const P=b.shadow,H=n.get(b);H.shadowBias=P.bias,H.shadowNormalBias=P.normalBias,H.shadowRadius=P.radius,H.shadowMapSize=P.mapSize,H.shadowCameraNear=P.camera.near,H.shadowCameraFar=P.camera.far,i.pointShadow[m]=H,i.pointShadowMap[m]=D,i.pointShadowMatrix[m]=b.shadow.matrix,T++}i.point[m]=z,m++}else if(b.isHemisphereLight){const z=e.get(b);z.skyColor.copy(b.color).multiplyScalar(N*S),z.groundColor.copy(b.groundColor).multiplyScalar(N*S),i.hemi[v]=z,v++}}_>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xt.LTC_FLOAT_1,i.rectAreaLTC2=xt.LTC_FLOAT_2):(i.rectAreaLTC1=xt.LTC_HALF_1,i.rectAreaLTC2=xt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xt.LTC_FLOAT_1,i.rectAreaLTC2=xt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=xt.LTC_HALF_1,i.rectAreaLTC2=xt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=x;const C=i.hash;(C.directionalLength!==g||C.pointLength!==m||C.spotLength!==p||C.rectAreaLength!==_||C.hemiLength!==v||C.numDirectionalShadows!==y||C.numPointShadows!==T||C.numSpotShadows!==w||C.numSpotMaps!==E||C.numLightProbes!==M)&&(i.directional.length=g,i.spot.length=p,i.rectArea.length=_,i.point.length=m,i.hemi.length=v,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=w+E-A,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=M,C.directionalLength=g,C.pointLength=m,C.spotLength=p,C.rectAreaLength=_,C.hemiLength=v,C.numDirectionalShadows=y,C.numPointShadows=T,C.numSpotShadows=w,C.numSpotMaps=E,C.numLightProbes=M,i.version=Nm++)}function c(h,f){let u=0,d=0,x=0,g=0,m=0;const p=f.matrixWorldInverse;for(let _=0,v=h.length;_<v;_++){const y=h[_];if(y.isDirectionalLight){const T=i.directional[u];T.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(o),T.direction.transformDirection(p),u++}else if(y.isSpotLight){const T=i.spot[x];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),T.direction.sub(o),T.direction.transformDirection(p),x++}else if(y.isRectAreaLight){const T=i.rectArea[g];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),T.halfWidth.set(y.width*.5,0,0),T.halfHeight.set(0,y.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const T=i.point[d];T.position.setFromMatrixPosition(y.matrixWorld),T.position.applyMatrix4(p),d++}else if(y.isHemisphereLight){const T=i.hemi[m];T.direction.setFromMatrixPosition(y.matrixWorld),T.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:i}}function kl(s,t){const e=new Bm(s,t),n=[],i=[];function o(){n.length=0,i.length=0}function r(f){n.push(f)}function a(f){i.push(f)}function l(f){e.setup(n,f)}function c(f){e.setupView(n,f)}return{init:o,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:r,pushShadow:a}}function Hm(s,t){let e=new WeakMap;function n(o,r=0){const a=e.get(o);let l;return a===void 0?(l=new kl(s,t),e.set(o,[l])):r>=a.length?(l=new kl(s,t),a.push(l)):l=a[r],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class Gm extends Rs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Vm extends Rs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Wm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qm=`uniform sampler2D shadow_pass;
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
}`;function Xm(s,t,e){let n=new Ls;const i=new Dt,o=new Dt,r=new ve,a=new Gm({depthPacking:wu}),l=new Vm,c={},h=e.maxTextureSize,f={[Bn]:Ve,[Ve]:Bn,[je]:je},u=new xe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Dt},radius:{value:4}},vertexShader:Wm,fragmentShader:qm}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const x=new be;x.setAttribute("position",new ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Qt(x,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bc;let p=this.type;this.render=function(w,E,A){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const M=s.getRenderTarget(),S=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),I=s.state;I.setBlending(Kn),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const k=p!==Dn&&this.type===Dn,b=p===Dn&&this.type!==Dn;for(let R=0,N=w.length;R<N;R++){const G=w[R],D=G.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",G,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;i.copy(D.mapSize);const z=D.getFrameExtents();if(i.multiply(z),o.copy(D.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(o.x=Math.floor(h/z.x),i.x=o.x*z.x,D.mapSize.x=o.x),i.y>h&&(o.y=Math.floor(h/z.y),i.y=o.y*z.y,D.mapSize.y=o.y)),D.map===null||k===!0||b===!0){const H=this.type!==Dn?{minFilter:fe,magFilter:fe}:{};D.map!==null&&D.map.dispose(),D.map=new on(i.x,i.y,H),D.map.texture.name=G.name+".shadowMap",D.camera.updateProjectionMatrix()}s.setRenderTarget(D.map),s.clear();const P=D.getViewportCount();for(let H=0;H<P;H++){const j=D.getViewport(H);r.set(o.x*j.x,o.y*j.y,o.x*j.z,o.y*j.w),I.viewport(r),D.updateMatrices(G,H),n=D.getFrustum(),y(E,A,D.camera,G,this.type)}D.isPointLightShadow!==!0&&this.type===Dn&&_(D,A),D.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(M,S,C)};function _(w,E){const A=t.update(g);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new on(i.x,i.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(E,null,A,u,g,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(E,null,A,d,g,null)}function v(w,E,A,M){let S=null;const C=A.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)S=C;else if(S=A.isPointLight===!0?l:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const I=S.uuid,k=E.uuid;let b=c[I];b===void 0&&(b={},c[I]=b);let R=b[k];R===void 0&&(R=S.clone(),b[k]=R,E.addEventListener("dispose",T)),S=R}if(S.visible=E.visible,S.wireframe=E.wireframe,M===Dn?S.side=E.shadowSide!==null?E.shadowSide:E.side:S.side=E.shadowSide!==null?E.shadowSide:f[E.side],S.alphaMap=E.alphaMap,S.alphaTest=E.alphaTest,S.map=E.map,S.clipShadows=E.clipShadows,S.clippingPlanes=E.clippingPlanes,S.clipIntersection=E.clipIntersection,S.displacementMap=E.displacementMap,S.displacementScale=E.displacementScale,S.displacementBias=E.displacementBias,S.wireframeLinewidth=E.wireframeLinewidth,S.linewidth=E.linewidth,A.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const I=s.properties.get(S);I.light=A}return S}function y(w,E,A,M,S){if(w.visible===!1)return;if(w.layers.test(E.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&S===Dn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,w.matrixWorld);const k=t.update(w),b=w.material;if(Array.isArray(b)){const R=k.groups;for(let N=0,G=R.length;N<G;N++){const D=R[N],z=b[D.materialIndex];if(z&&z.visible){const P=v(w,z,M,S);w.onBeforeShadow(s,w,E,A,k,P,D),s.renderBufferDirect(A,null,k,P,w,D),w.onAfterShadow(s,w,E,A,k,P,D)}}}else if(b.visible){const R=v(w,b,M,S);w.onBeforeShadow(s,w,E,A,k,R,null),s.renderBufferDirect(A,null,k,R,w,null),w.onAfterShadow(s,w,E,A,k,R,null)}}const I=w.children;for(let k=0,b=I.length;k<b;k++)y(I[k],E,A,M,S)}function T(w){w.target.removeEventListener("dispose",T);for(const A in c){const M=c[A],S=w.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}function Ym(s,t,e){const n=e.isWebGL2;function i(){let W=!1;const _t=new ve;let Mt=null;const zt=new ve(0,0,0,0);return{setMask:function(Lt){Mt!==Lt&&!W&&(s.colorMask(Lt,Lt,Lt,Lt),Mt=Lt)},setLocked:function(Lt){W=Lt},setClear:function(Lt,se,oe,Ae,Oe){Oe===!0&&(Lt*=Ae,se*=Ae,oe*=Ae),_t.set(Lt,se,oe,Ae),zt.equals(_t)===!1&&(s.clearColor(Lt,se,oe,Ae),zt.copy(_t))},reset:function(){W=!1,Mt=null,zt.set(-1,0,0,0)}}}function o(){let W=!1,_t=null,Mt=null,zt=null;return{setTest:function(Lt){Lt?q(s.DEPTH_TEST):X(s.DEPTH_TEST)},setMask:function(Lt){_t!==Lt&&!W&&(s.depthMask(Lt),_t=Lt)},setFunc:function(Lt){if(Mt!==Lt){switch(Lt){case Jh:s.depthFunc(s.NEVER);break;case Qh:s.depthFunc(s.ALWAYS);break;case tu:s.depthFunc(s.LESS);break;case So:s.depthFunc(s.LEQUAL);break;case eu:s.depthFunc(s.EQUAL);break;case nu:s.depthFunc(s.GEQUAL);break;case iu:s.depthFunc(s.GREATER);break;case su:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Mt=Lt}},setLocked:function(Lt){W=Lt},setClear:function(Lt){zt!==Lt&&(s.clearDepth(Lt),zt=Lt)},reset:function(){W=!1,_t=null,Mt=null,zt=null}}}function r(){let W=!1,_t=null,Mt=null,zt=null,Lt=null,se=null,oe=null,Ae=null,Oe=null;return{setTest:function(ae){W||(ae?q(s.STENCIL_TEST):X(s.STENCIL_TEST))},setMask:function(ae){_t!==ae&&!W&&(s.stencilMask(ae),_t=ae)},setFunc:function(ae,Be,vn){(Mt!==ae||zt!==Be||Lt!==vn)&&(s.stencilFunc(ae,Be,vn),Mt=ae,zt=Be,Lt=vn)},setOp:function(ae,Be,vn){(se!==ae||oe!==Be||Ae!==vn)&&(s.stencilOp(ae,Be,vn),se=ae,oe=Be,Ae=vn)},setLocked:function(ae){W=ae},setClear:function(ae){Oe!==ae&&(s.clearStencil(ae),Oe=ae)},reset:function(){W=!1,_t=null,Mt=null,zt=null,Lt=null,se=null,oe=null,Ae=null,Oe=null}}}const a=new i,l=new o,c=new r,h=new WeakMap,f=new WeakMap;let u={},d={},x=new WeakMap,g=[],m=null,p=!1,_=null,v=null,y=null,T=null,w=null,E=null,A=null,M=new Pt(0,0,0),S=0,C=!1,I=null,k=null,b=null,R=null,N=null;const G=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,z=0;const P=s.getParameter(s.VERSION);P.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(P)[1]),D=z>=1):P.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),D=z>=2);let H=null,j={};const B=s.getParameter(s.SCISSOR_BOX),Y=s.getParameter(s.VIEWPORT),K=new ve().fromArray(B),tt=new ve().fromArray(Y);function lt(W,_t,Mt,zt){const Lt=new Uint8Array(4),se=s.createTexture();s.bindTexture(W,se),s.texParameteri(W,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(W,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let oe=0;oe<Mt;oe++)n&&(W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY)?s.texImage3D(_t,0,s.RGBA,1,1,zt,0,s.RGBA,s.UNSIGNED_BYTE,Lt):s.texImage2D(_t+oe,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Lt);return se}const ht={};ht[s.TEXTURE_2D]=lt(s.TEXTURE_2D,s.TEXTURE_2D,1),ht[s.TEXTURE_CUBE_MAP]=lt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(ht[s.TEXTURE_2D_ARRAY]=lt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ht[s.TEXTURE_3D]=lt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),q(s.DEPTH_TEST),l.setFunc(So),Ct(!1),F(xr),q(s.CULL_FACE),ut(Kn);function q(W){u[W]!==!0&&(s.enable(W),u[W]=!0)}function X(W){u[W]!==!1&&(s.disable(W),u[W]=!1)}function it(W,_t){return d[W]!==_t?(s.bindFramebuffer(W,_t),d[W]=_t,n&&(W===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=_t),W===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=_t)),!0):!1}function O(W,_t){let Mt=g,zt=!1;if(W)if(Mt=x.get(_t),Mt===void 0&&(Mt=[],x.set(_t,Mt)),W.isWebGLMultipleRenderTargets){const Lt=W.texture;if(Mt.length!==Lt.length||Mt[0]!==s.COLOR_ATTACHMENT0){for(let se=0,oe=Lt.length;se<oe;se++)Mt[se]=s.COLOR_ATTACHMENT0+se;Mt.length=Lt.length,zt=!0}}else Mt[0]!==s.COLOR_ATTACHMENT0&&(Mt[0]=s.COLOR_ATTACHMENT0,zt=!0);else Mt[0]!==s.BACK&&(Mt[0]=s.BACK,zt=!0);zt&&(e.isWebGL2?s.drawBuffers(Mt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Mt))}function mt(W){return m!==W?(s.useProgram(W),m=W,!0):!1}const at={[li]:s.FUNC_ADD,[kh]:s.FUNC_SUBTRACT,[Nh]:s.FUNC_REVERSE_SUBTRACT};if(n)at[yr]=s.MIN,at[wr]=s.MAX;else{const W=t.get("EXT_blend_minmax");W!==null&&(at[yr]=W.MIN_EXT,at[wr]=W.MAX_EXT)}const ft={[Oh]:s.ZERO,[Bh]:s.ONE,[Hh]:s.SRC_COLOR,[Pa]:s.SRC_ALPHA,[Yh]:s.SRC_ALPHA_SATURATE,[qh]:s.DST_COLOR,[Vh]:s.DST_ALPHA,[Gh]:s.ONE_MINUS_SRC_COLOR,[La]:s.ONE_MINUS_SRC_ALPHA,[Xh]:s.ONE_MINUS_DST_COLOR,[Wh]:s.ONE_MINUS_DST_ALPHA,[jh]:s.CONSTANT_COLOR,[$h]:s.ONE_MINUS_CONSTANT_COLOR,[Kh]:s.CONSTANT_ALPHA,[Zh]:s.ONE_MINUS_CONSTANT_ALPHA};function ut(W,_t,Mt,zt,Lt,se,oe,Ae,Oe,ae){if(W===Kn){p===!0&&(X(s.BLEND),p=!1);return}if(p===!1&&(q(s.BLEND),p=!0),W!==zh){if(W!==_||ae!==C){if((v!==li||w!==li)&&(s.blendEquation(s.FUNC_ADD),v=li,w=li),ae)switch(W){case Gi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ra:s.blendFunc(s.ONE,s.ONE);break;case _r:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Mr:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}else switch(W){case Gi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ra:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case _r:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Mr:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",W);break}y=null,T=null,E=null,A=null,M.set(0,0,0),S=0,_=W,C=ae}return}Lt=Lt||_t,se=se||Mt,oe=oe||zt,(_t!==v||Lt!==w)&&(s.blendEquationSeparate(at[_t],at[Lt]),v=_t,w=Lt),(Mt!==y||zt!==T||se!==E||oe!==A)&&(s.blendFuncSeparate(ft[Mt],ft[zt],ft[se],ft[oe]),y=Mt,T=zt,E=se,A=oe),(Ae.equals(M)===!1||Oe!==S)&&(s.blendColor(Ae.r,Ae.g,Ae.b,Oe),M.copy(Ae),S=Oe),_=W,C=!1}function Ot(W,_t){W.side===je?X(s.CULL_FACE):q(s.CULL_FACE);let Mt=W.side===Ve;_t&&(Mt=!Mt),Ct(Mt),W.blending===Gi&&W.transparent===!1?ut(Kn):ut(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),l.setFunc(W.depthFunc),l.setTest(W.depthTest),l.setMask(W.depthWrite),a.setMask(W.colorWrite);const zt=W.stencilWrite;c.setTest(zt),zt&&(c.setMask(W.stencilWriteMask),c.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),c.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Z(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?q(s.SAMPLE_ALPHA_TO_COVERAGE):X(s.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(W){I!==W&&(W?s.frontFace(s.CW):s.frontFace(s.CCW),I=W)}function F(W){W!==Uh?(q(s.CULL_FACE),W!==k&&(W===xr?s.cullFace(s.BACK):W===Fh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):X(s.CULL_FACE),k=W}function L(W){W!==b&&(D&&s.lineWidth(W),b=W)}function Z(W,_t,Mt){W?(q(s.POLYGON_OFFSET_FILL),(R!==_t||N!==Mt)&&(s.polygonOffset(_t,Mt),R=_t,N=Mt)):X(s.POLYGON_OFFSET_FILL)}function rt(W){W?q(s.SCISSOR_TEST):X(s.SCISSOR_TEST)}function st(W){W===void 0&&(W=s.TEXTURE0+G-1),H!==W&&(s.activeTexture(W),H=W)}function ct(W,_t,Mt){Mt===void 0&&(H===null?Mt=s.TEXTURE0+G-1:Mt=H);let zt=j[Mt];zt===void 0&&(zt={type:void 0,texture:void 0},j[Mt]=zt),(zt.type!==W||zt.texture!==_t)&&(H!==Mt&&(s.activeTexture(Mt),H=Mt),s.bindTexture(W,_t||ht[W]),zt.type=W,zt.texture=_t)}function St(){const W=j[H];W!==void 0&&W.type!==void 0&&(s.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function gt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function dt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Et(){try{s.texSubImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Rt(){try{s.texSubImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function ot(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function $t(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function It(){try{s.texStorage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Ut(){try{s.texStorage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Tt(){try{s.texImage2D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function bt(){try{s.texImage3D.apply(s,arguments)}catch(W){console.error("THREE.WebGLState:",W)}}function Gt(W){K.equals(W)===!1&&(s.scissor(W.x,W.y,W.z,W.w),K.copy(W))}function Jt(W){tt.equals(W)===!1&&(s.viewport(W.x,W.y,W.z,W.w),tt.copy(W))}function pe(W,_t){let Mt=f.get(_t);Mt===void 0&&(Mt=new WeakMap,f.set(_t,Mt));let zt=Mt.get(W);zt===void 0&&(zt=s.getUniformBlockIndex(_t,W.name),Mt.set(W,zt))}function qt(W,_t){const zt=f.get(_t).get(W);h.get(_t)!==zt&&(s.uniformBlockBinding(_t,zt,W.__bindingPointIndex),h.set(_t,zt))}function vt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},H=null,j={},d={},x=new WeakMap,g=[],m=null,p=!1,_=null,v=null,y=null,T=null,w=null,E=null,A=null,M=new Pt(0,0,0),S=0,C=!1,I=null,k=null,b=null,R=null,N=null,K.set(0,0,s.canvas.width,s.canvas.height),tt.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:q,disable:X,bindFramebuffer:it,drawBuffers:O,useProgram:mt,setBlending:ut,setMaterial:Ot,setFlipSided:Ct,setCullFace:F,setLineWidth:L,setPolygonOffset:Z,setScissorTest:rt,activeTexture:st,bindTexture:ct,unbindTexture:St,compressedTexImage2D:gt,compressedTexImage3D:dt,texImage2D:Tt,texImage3D:bt,updateUBOMapping:pe,uniformBlockBinding:qt,texStorage2D:It,texStorage3D:Ut,texSubImage2D:Et,texSubImage3D:Rt,compressedTexSubImage2D:ot,compressedTexSubImage3D:$t,scissor:Gt,viewport:Jt,reset:vt}}function jm(s,t,e,n,i,o,r){const a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let f;const u=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(F,L){return d?new OffscreenCanvas(F,L):Ro("canvas")}function g(F,L,Z,rt){let st=1;if((F.width>rt||F.height>rt)&&(st=rt/Math.max(F.width,F.height)),st<1||L===!0)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap){const ct=L?Co:Math.floor,St=ct(st*F.width),gt=ct(st*F.height);f===void 0&&(f=x(St,gt));const dt=Z?x(St,gt):f;return dt.width=St,dt.height=gt,dt.getContext("2d").drawImage(F,0,0,St,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+F.width+"x"+F.height+") to ("+St+"x"+gt+")."),dt}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+F.width+"x"+F.height+")."),F;return F}function m(F){return za(F.width)&&za(F.height)}function p(F){return a?!1:F.wrapS!==$e||F.wrapT!==$e||F.minFilter!==fe&&F.minFilter!==ie}function _(F,L){return F.generateMipmaps&&L&&F.minFilter!==fe&&F.minFilter!==ie}function v(F){s.generateMipmap(F)}function y(F,L,Z,rt,st=!1){if(a===!1)return L;if(F!==null){if(s[F]!==void 0)return s[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let ct=L;if(L===s.RED&&(Z===s.FLOAT&&(ct=s.R32F),Z===s.HALF_FLOAT&&(ct=s.R16F),Z===s.UNSIGNED_BYTE&&(ct=s.R8)),L===s.RED_INTEGER&&(Z===s.UNSIGNED_BYTE&&(ct=s.R8UI),Z===s.UNSIGNED_SHORT&&(ct=s.R16UI),Z===s.UNSIGNED_INT&&(ct=s.R32UI),Z===s.BYTE&&(ct=s.R8I),Z===s.SHORT&&(ct=s.R16I),Z===s.INT&&(ct=s.R32I)),L===s.RG&&(Z===s.FLOAT&&(ct=s.RG32F),Z===s.HALF_FLOAT&&(ct=s.RG16F),Z===s.UNSIGNED_BYTE&&(ct=s.RG8)),L===s.RGBA){const St=st?bo:te.getTransfer(rt);Z===s.FLOAT&&(ct=s.RGBA32F),Z===s.HALF_FLOAT&&(ct=s.RGBA16F),Z===s.UNSIGNED_BYTE&&(ct=St===le?s.SRGB8_ALPHA8:s.RGBA8),Z===s.UNSIGNED_SHORT_4_4_4_4&&(ct=s.RGBA4),Z===s.UNSIGNED_SHORT_5_5_5_1&&(ct=s.RGB5_A1)}return(ct===s.R16F||ct===s.R32F||ct===s.RG16F||ct===s.RG32F||ct===s.RGBA16F||ct===s.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function T(F,L,Z){return _(F,Z)===!0||F.isFramebufferTexture&&F.minFilter!==fe&&F.minFilter!==ie?Math.log2(Math.max(L.width,L.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?L.mipmaps.length:1}function w(F){return F===fe||F===Sr||F===Vo?s.NEAREST:s.LINEAR}function E(F){const L=F.target;L.removeEventListener("dispose",E),M(L),L.isVideoTexture&&h.delete(L)}function A(F){const L=F.target;L.removeEventListener("dispose",A),C(L)}function M(F){const L=n.get(F);if(L.__webglInit===void 0)return;const Z=F.source,rt=u.get(Z);if(rt){const st=rt[L.__cacheKey];st.usedTimes--,st.usedTimes===0&&S(F),Object.keys(rt).length===0&&u.delete(Z)}n.remove(F)}function S(F){const L=n.get(F);s.deleteTexture(L.__webglTexture);const Z=F.source,rt=u.get(Z);delete rt[L.__cacheKey],r.memory.textures--}function C(F){const L=F.texture,Z=n.get(F),rt=n.get(L);if(rt.__webglTexture!==void 0&&(s.deleteTexture(rt.__webglTexture),r.memory.textures--),F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let st=0;st<6;st++){if(Array.isArray(Z.__webglFramebuffer[st]))for(let ct=0;ct<Z.__webglFramebuffer[st].length;ct++)s.deleteFramebuffer(Z.__webglFramebuffer[st][ct]);else s.deleteFramebuffer(Z.__webglFramebuffer[st]);Z.__webglDepthbuffer&&s.deleteRenderbuffer(Z.__webglDepthbuffer[st])}else{if(Array.isArray(Z.__webglFramebuffer))for(let st=0;st<Z.__webglFramebuffer.length;st++)s.deleteFramebuffer(Z.__webglFramebuffer[st]);else s.deleteFramebuffer(Z.__webglFramebuffer);if(Z.__webglDepthbuffer&&s.deleteRenderbuffer(Z.__webglDepthbuffer),Z.__webglMultisampledFramebuffer&&s.deleteFramebuffer(Z.__webglMultisampledFramebuffer),Z.__webglColorRenderbuffer)for(let st=0;st<Z.__webglColorRenderbuffer.length;st++)Z.__webglColorRenderbuffer[st]&&s.deleteRenderbuffer(Z.__webglColorRenderbuffer[st]);Z.__webglDepthRenderbuffer&&s.deleteRenderbuffer(Z.__webglDepthRenderbuffer)}if(F.isWebGLMultipleRenderTargets)for(let st=0,ct=L.length;st<ct;st++){const St=n.get(L[st]);St.__webglTexture&&(s.deleteTexture(St.__webglTexture),r.memory.textures--),n.remove(L[st])}n.remove(L),n.remove(F)}let I=0;function k(){I=0}function b(){const F=I;return F>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+i.maxTextures),I+=1,F}function R(F){const L=[];return L.push(F.wrapS),L.push(F.wrapT),L.push(F.wrapR||0),L.push(F.magFilter),L.push(F.minFilter),L.push(F.anisotropy),L.push(F.internalFormat),L.push(F.format),L.push(F.type),L.push(F.generateMipmaps),L.push(F.premultiplyAlpha),L.push(F.flipY),L.push(F.unpackAlignment),L.push(F.colorSpace),L.join()}function N(F,L){const Z=n.get(F);if(F.isVideoTexture&&Ot(F),F.isRenderTargetTexture===!1&&F.version>0&&Z.__version!==F.version){const rt=F.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(Z,F,L);return}}e.bindTexture(s.TEXTURE_2D,Z.__webglTexture,s.TEXTURE0+L)}function G(F,L){const Z=n.get(F);if(F.version>0&&Z.__version!==F.version){K(Z,F,L);return}e.bindTexture(s.TEXTURE_2D_ARRAY,Z.__webglTexture,s.TEXTURE0+L)}function D(F,L){const Z=n.get(F);if(F.version>0&&Z.__version!==F.version){K(Z,F,L);return}e.bindTexture(s.TEXTURE_3D,Z.__webglTexture,s.TEXTURE0+L)}function z(F,L){const Z=n.get(F);if(F.version>0&&Z.__version!==F.version){tt(Z,F,L);return}e.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture,s.TEXTURE0+L)}const P={[pi]:s.REPEAT,[$e]:s.CLAMP_TO_EDGE,[Fa]:s.MIRRORED_REPEAT},H={[fe]:s.NEAREST,[Sr]:s.NEAREST_MIPMAP_NEAREST,[Vo]:s.NEAREST_MIPMAP_LINEAR,[ie]:s.LINEAR,[du]:s.LINEAR_MIPMAP_NEAREST,[mi]:s.LINEAR_MIPMAP_LINEAR},j={[Eu]:s.NEVER,[Lu]:s.ALWAYS,[Tu]:s.LESS,[Ic]:s.LEQUAL,[Au]:s.EQUAL,[Pu]:s.GEQUAL,[Cu]:s.GREATER,[Ru]:s.NOTEQUAL};function B(F,L,Z){if(Z?(s.texParameteri(F,s.TEXTURE_WRAP_S,P[L.wrapS]),s.texParameteri(F,s.TEXTURE_WRAP_T,P[L.wrapT]),(F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY)&&s.texParameteri(F,s.TEXTURE_WRAP_R,P[L.wrapR]),s.texParameteri(F,s.TEXTURE_MAG_FILTER,H[L.magFilter]),s.texParameteri(F,s.TEXTURE_MIN_FILTER,H[L.minFilter])):(s.texParameteri(F,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(F,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY)&&s.texParameteri(F,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(L.wrapS!==$e||L.wrapT!==$e)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(F,s.TEXTURE_MAG_FILTER,w(L.magFilter)),s.texParameteri(F,s.TEXTURE_MIN_FILTER,w(L.minFilter)),L.minFilter!==fe&&L.minFilter!==ie&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),L.compareFunction&&(s.texParameteri(F,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(F,s.TEXTURE_COMPARE_FUNC,j[L.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const rt=t.get("EXT_texture_filter_anisotropic");if(L.magFilter===fe||L.minFilter!==Vo&&L.minFilter!==mi||L.type===gn&&t.has("OES_texture_float_linear")===!1||a===!1&&L.type===Hn&&t.has("OES_texture_half_float_linear")===!1)return;(L.anisotropy>1||n.get(L).__currentAnisotropy)&&(s.texParameterf(F,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,i.getMaxAnisotropy())),n.get(L).__currentAnisotropy=L.anisotropy)}}function Y(F,L){let Z=!1;F.__webglInit===void 0&&(F.__webglInit=!0,L.addEventListener("dispose",E));const rt=L.source;let st=u.get(rt);st===void 0&&(st={},u.set(rt,st));const ct=R(L);if(ct!==F.__cacheKey){st[ct]===void 0&&(st[ct]={texture:s.createTexture(),usedTimes:0},r.memory.textures++,Z=!0),st[ct].usedTimes++;const St=st[F.__cacheKey];St!==void 0&&(st[F.__cacheKey].usedTimes--,St.usedTimes===0&&S(L)),F.__cacheKey=ct,F.__webglTexture=st[ct].texture}return Z}function K(F,L,Z){let rt=s.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(rt=s.TEXTURE_2D_ARRAY),L.isData3DTexture&&(rt=s.TEXTURE_3D);const st=Y(F,L),ct=L.source;e.bindTexture(rt,F.__webglTexture,s.TEXTURE0+Z);const St=n.get(ct);if(ct.version!==St.__version||st===!0){e.activeTexture(s.TEXTURE0+Z);const gt=te.getPrimaries(te.workingColorSpace),dt=L.colorSpace===cn?null:te.getPrimaries(L.colorSpace),Et=L.colorSpace===cn||gt===dt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,L.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,L.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);const Rt=p(L)&&m(L.image)===!1;let ot=g(L.image,Rt,!1,i.maxTextureSize);ot=Ct(L,ot);const $t=m(ot)||a,It=o.convert(L.format,L.colorSpace);let Ut=o.convert(L.type),Tt=y(L.internalFormat,It,Ut,L.colorSpace,L.isVideoTexture);B(rt,L,$t);let bt;const Gt=L.mipmaps,Jt=a&&L.isVideoTexture!==!0&&Tt!==Uc,pe=St.__version===void 0||st===!0,qt=T(L,ot,$t);if(L.isDepthTexture)Tt=s.DEPTH_COMPONENT,a?L.type===gn?Tt=s.DEPTH_COMPONENT32F:L.type===In?Tt=s.DEPTH_COMPONENT24:L.type===ui?Tt=s.DEPTH24_STENCIL8:Tt=s.DEPTH_COMPONENT16:L.type===gn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),L.format===fi&&Tt===s.DEPTH_COMPONENT&&L.type!==Ka&&L.type!==In&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),L.type=In,Ut=o.convert(L.type)),L.format===$i&&Tt===s.DEPTH_COMPONENT&&(Tt=s.DEPTH_STENCIL,L.type!==ui&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),L.type=ui,Ut=o.convert(L.type))),pe&&(Jt?e.texStorage2D(s.TEXTURE_2D,1,Tt,ot.width,ot.height):e.texImage2D(s.TEXTURE_2D,0,Tt,ot.width,ot.height,0,It,Ut,null));else if(L.isDataTexture)if(Gt.length>0&&$t){Jt&&pe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let vt=0,W=Gt.length;vt<W;vt++)bt=Gt[vt],Jt?e.texSubImage2D(s.TEXTURE_2D,vt,0,0,bt.width,bt.height,It,Ut,bt.data):e.texImage2D(s.TEXTURE_2D,vt,Tt,bt.width,bt.height,0,It,Ut,bt.data);L.generateMipmaps=!1}else Jt?(pe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,ot.width,ot.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,ot.width,ot.height,It,Ut,ot.data)):e.texImage2D(s.TEXTURE_2D,0,Tt,ot.width,ot.height,0,It,Ut,ot.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){Jt&&pe&&e.texStorage3D(s.TEXTURE_2D_ARRAY,qt,Tt,Gt[0].width,Gt[0].height,ot.depth);for(let vt=0,W=Gt.length;vt<W;vt++)bt=Gt[vt],L.format!==ke?It!==null?Jt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,vt,0,0,0,bt.width,bt.height,ot.depth,It,bt.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,vt,Tt,bt.width,bt.height,ot.depth,0,bt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,vt,0,0,0,bt.width,bt.height,ot.depth,It,Ut,bt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,vt,Tt,bt.width,bt.height,ot.depth,0,It,Ut,bt.data)}else{Jt&&pe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let vt=0,W=Gt.length;vt<W;vt++)bt=Gt[vt],L.format!==ke?It!==null?Jt?e.compressedTexSubImage2D(s.TEXTURE_2D,vt,0,0,bt.width,bt.height,It,bt.data):e.compressedTexImage2D(s.TEXTURE_2D,vt,Tt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage2D(s.TEXTURE_2D,vt,0,0,bt.width,bt.height,It,Ut,bt.data):e.texImage2D(s.TEXTURE_2D,vt,Tt,bt.width,bt.height,0,It,Ut,bt.data)}else if(L.isDataArrayTexture)Jt?(pe&&e.texStorage3D(s.TEXTURE_2D_ARRAY,qt,Tt,ot.width,ot.height,ot.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ot.width,ot.height,ot.depth,It,Ut,ot.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,Tt,ot.width,ot.height,ot.depth,0,It,Ut,ot.data);else if(L.isData3DTexture)Jt?(pe&&e.texStorage3D(s.TEXTURE_3D,qt,Tt,ot.width,ot.height,ot.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ot.width,ot.height,ot.depth,It,Ut,ot.data)):e.texImage3D(s.TEXTURE_3D,0,Tt,ot.width,ot.height,ot.depth,0,It,Ut,ot.data);else if(L.isFramebufferTexture){if(pe)if(Jt)e.texStorage2D(s.TEXTURE_2D,qt,Tt,ot.width,ot.height);else{let vt=ot.width,W=ot.height;for(let _t=0;_t<qt;_t++)e.texImage2D(s.TEXTURE_2D,_t,Tt,vt,W,0,It,Ut,null),vt>>=1,W>>=1}}else if(Gt.length>0&&$t){Jt&&pe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,Gt[0].width,Gt[0].height);for(let vt=0,W=Gt.length;vt<W;vt++)bt=Gt[vt],Jt?e.texSubImage2D(s.TEXTURE_2D,vt,0,0,It,Ut,bt):e.texImage2D(s.TEXTURE_2D,vt,Tt,It,Ut,bt);L.generateMipmaps=!1}else Jt?(pe&&e.texStorage2D(s.TEXTURE_2D,qt,Tt,ot.width,ot.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,It,Ut,ot)):e.texImage2D(s.TEXTURE_2D,0,Tt,It,Ut,ot);_(L,$t)&&v(rt),St.__version=ct.version,L.onUpdate&&L.onUpdate(L)}F.__version=L.version}function tt(F,L,Z){if(L.image.length!==6)return;const rt=Y(F,L),st=L.source;e.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+Z);const ct=n.get(st);if(st.version!==ct.__version||rt===!0){e.activeTexture(s.TEXTURE0+Z);const St=te.getPrimaries(te.workingColorSpace),gt=L.colorSpace===cn?null:te.getPrimaries(L.colorSpace),dt=L.colorSpace===cn||St===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,L.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,L.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Et=L.isCompressedTexture||L.image[0].isCompressedTexture,Rt=L.image[0]&&L.image[0].isDataTexture,ot=[];for(let vt=0;vt<6;vt++)!Et&&!Rt?ot[vt]=g(L.image[vt],!1,!0,i.maxCubemapSize):ot[vt]=Rt?L.image[vt].image:L.image[vt],ot[vt]=Ct(L,ot[vt]);const $t=ot[0],It=m($t)||a,Ut=o.convert(L.format,L.colorSpace),Tt=o.convert(L.type),bt=y(L.internalFormat,Ut,Tt,L.colorSpace),Gt=a&&L.isVideoTexture!==!0,Jt=ct.__version===void 0||rt===!0;let pe=T(L,$t,It);B(s.TEXTURE_CUBE_MAP,L,It);let qt;if(Et){Gt&&Jt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,pe,bt,$t.width,$t.height);for(let vt=0;vt<6;vt++){qt=ot[vt].mipmaps;for(let W=0;W<qt.length;W++){const _t=qt[W];L.format!==ke?Ut!==null?Gt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W,0,0,_t.width,_t.height,Ut,_t.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W,bt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W,0,0,_t.width,_t.height,Ut,Tt,_t.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W,bt,_t.width,_t.height,0,Ut,Tt,_t.data)}}}else{qt=L.mipmaps,Gt&&Jt&&(qt.length>0&&pe++,e.texStorage2D(s.TEXTURE_CUBE_MAP,pe,bt,ot[0].width,ot[0].height));for(let vt=0;vt<6;vt++)if(Rt){Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,ot[vt].width,ot[vt].height,Ut,Tt,ot[vt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,bt,ot[vt].width,ot[vt].height,0,Ut,Tt,ot[vt].data);for(let W=0;W<qt.length;W++){const Mt=qt[W].image[vt].image;Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W+1,0,0,Mt.width,Mt.height,Ut,Tt,Mt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W+1,bt,Mt.width,Mt.height,0,Ut,Tt,Mt.data)}}else{Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,0,0,Ut,Tt,ot[vt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0,bt,Ut,Tt,ot[vt]);for(let W=0;W<qt.length;W++){const _t=qt[W];Gt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W+1,0,0,Ut,Tt,_t.image[vt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,W+1,bt,Ut,Tt,_t.image[vt])}}}_(L,It)&&v(s.TEXTURE_CUBE_MAP),ct.__version=st.version,L.onUpdate&&L.onUpdate(L)}F.__version=L.version}function lt(F,L,Z,rt,st,ct){const St=o.convert(Z.format,Z.colorSpace),gt=o.convert(Z.type),dt=y(Z.internalFormat,St,gt,Z.colorSpace);if(!n.get(L).__hasExternalTextures){const Rt=Math.max(1,L.width>>ct),ot=Math.max(1,L.height>>ct);st===s.TEXTURE_3D||st===s.TEXTURE_2D_ARRAY?e.texImage3D(st,ct,dt,Rt,ot,L.depth,0,St,gt,null):e.texImage2D(st,ct,dt,Rt,ot,0,St,gt,null)}e.bindFramebuffer(s.FRAMEBUFFER,F),ut(L)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,rt,st,n.get(Z).__webglTexture,0,ft(L)):(st===s.TEXTURE_2D||st>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,rt,st,n.get(Z).__webglTexture,ct),e.bindFramebuffer(s.FRAMEBUFFER,null)}function ht(F,L,Z){if(s.bindRenderbuffer(s.RENDERBUFFER,F),L.depthBuffer&&!L.stencilBuffer){let rt=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(Z||ut(L)){const st=L.depthTexture;st&&st.isDepthTexture&&(st.type===gn?rt=s.DEPTH_COMPONENT32F:st.type===In&&(rt=s.DEPTH_COMPONENT24));const ct=ft(L);ut(L)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ct,rt,L.width,L.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,ct,rt,L.width,L.height)}else s.renderbufferStorage(s.RENDERBUFFER,rt,L.width,L.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,F)}else if(L.depthBuffer&&L.stencilBuffer){const rt=ft(L);Z&&ut(L)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,rt,s.DEPTH24_STENCIL8,L.width,L.height):ut(L)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,rt,s.DEPTH24_STENCIL8,L.width,L.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,F)}else{const rt=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let st=0;st<rt.length;st++){const ct=rt[st],St=o.convert(ct.format,ct.colorSpace),gt=o.convert(ct.type),dt=y(ct.internalFormat,St,gt,ct.colorSpace),Et=ft(L);Z&&ut(L)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Et,dt,L.width,L.height):ut(L)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Et,dt,L.width,L.height):s.renderbufferStorage(s.RENDERBUFFER,dt,L.width,L.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function q(F,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,F),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(L.depthTexture).__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),N(L.depthTexture,0);const rt=n.get(L.depthTexture).__webglTexture,st=ft(L);if(L.depthTexture.format===fi)ut(L)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,rt,0,st):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,rt,0);else if(L.depthTexture.format===$i)ut(L)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,rt,0,st):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function X(F){const L=n.get(F),Z=F.isWebGLCubeRenderTarget===!0;if(F.depthTexture&&!L.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");q(L.__webglFramebuffer,F)}else if(Z){L.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)e.bindFramebuffer(s.FRAMEBUFFER,L.__webglFramebuffer[rt]),L.__webglDepthbuffer[rt]=s.createRenderbuffer(),ht(L.__webglDepthbuffer[rt],F,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer=s.createRenderbuffer(),ht(L.__webglDepthbuffer,F,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function it(F,L,Z){const rt=n.get(F);L!==void 0&&lt(rt.__webglFramebuffer,F,F.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Z!==void 0&&X(F)}function O(F){const L=F.texture,Z=n.get(F),rt=n.get(L);F.addEventListener("dispose",A),F.isWebGLMultipleRenderTargets!==!0&&(rt.__webglTexture===void 0&&(rt.__webglTexture=s.createTexture()),rt.__version=L.version,r.memory.textures++);const st=F.isWebGLCubeRenderTarget===!0,ct=F.isWebGLMultipleRenderTargets===!0,St=m(F)||a;if(st){Z.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(a&&L.mipmaps&&L.mipmaps.length>0){Z.__webglFramebuffer[gt]=[];for(let dt=0;dt<L.mipmaps.length;dt++)Z.__webglFramebuffer[gt][dt]=s.createFramebuffer()}else Z.__webglFramebuffer[gt]=s.createFramebuffer()}else{if(a&&L.mipmaps&&L.mipmaps.length>0){Z.__webglFramebuffer=[];for(let gt=0;gt<L.mipmaps.length;gt++)Z.__webglFramebuffer[gt]=s.createFramebuffer()}else Z.__webglFramebuffer=s.createFramebuffer();if(ct)if(i.drawBuffers){const gt=F.texture;for(let dt=0,Et=gt.length;dt<Et;dt++){const Rt=n.get(gt[dt]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=s.createTexture(),r.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&F.samples>0&&ut(F)===!1){const gt=ct?L:[L];Z.__webglMultisampledFramebuffer=s.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let dt=0;dt<gt.length;dt++){const Et=gt[dt];Z.__webglColorRenderbuffer[dt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Z.__webglColorRenderbuffer[dt]);const Rt=o.convert(Et.format,Et.colorSpace),ot=o.convert(Et.type),$t=y(Et.internalFormat,Rt,ot,Et.colorSpace,F.isXRRenderTarget===!0),It=ft(F);s.renderbufferStorageMultisample(s.RENDERBUFFER,It,$t,F.width,F.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,Z.__webglColorRenderbuffer[dt])}s.bindRenderbuffer(s.RENDERBUFFER,null),F.depthBuffer&&(Z.__webglDepthRenderbuffer=s.createRenderbuffer(),ht(Z.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(st){e.bindTexture(s.TEXTURE_CUBE_MAP,rt.__webglTexture),B(s.TEXTURE_CUBE_MAP,L,St);for(let gt=0;gt<6;gt++)if(a&&L.mipmaps&&L.mipmaps.length>0)for(let dt=0;dt<L.mipmaps.length;dt++)lt(Z.__webglFramebuffer[gt][dt],F,L,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,dt);else lt(Z.__webglFramebuffer[gt],F,L,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);_(L,St)&&v(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){const gt=F.texture;for(let dt=0,Et=gt.length;dt<Et;dt++){const Rt=gt[dt],ot=n.get(Rt);e.bindTexture(s.TEXTURE_2D,ot.__webglTexture),B(s.TEXTURE_2D,Rt,St),lt(Z.__webglFramebuffer,F,Rt,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,0),_(Rt,St)&&v(s.TEXTURE_2D)}e.unbindTexture()}else{let gt=s.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(a?gt=F.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(gt,rt.__webglTexture),B(gt,L,St),a&&L.mipmaps&&L.mipmaps.length>0)for(let dt=0;dt<L.mipmaps.length;dt++)lt(Z.__webglFramebuffer[dt],F,L,s.COLOR_ATTACHMENT0,gt,dt);else lt(Z.__webglFramebuffer,F,L,s.COLOR_ATTACHMENT0,gt,0);_(L,St)&&v(gt),e.unbindTexture()}F.depthBuffer&&X(F)}function mt(F){const L=m(F)||a,Z=F.isWebGLMultipleRenderTargets===!0?F.texture:[F.texture];for(let rt=0,st=Z.length;rt<st;rt++){const ct=Z[rt];if(_(ct,L)){const St=F.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,gt=n.get(ct).__webglTexture;e.bindTexture(St,gt),v(St),e.unbindTexture()}}}function at(F){if(a&&F.samples>0&&ut(F)===!1){const L=F.isWebGLMultipleRenderTargets?F.texture:[F.texture],Z=F.width,rt=F.height;let st=s.COLOR_BUFFER_BIT;const ct=[],St=F.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,gt=n.get(F),dt=F.isWebGLMultipleRenderTargets===!0;if(dt)for(let Et=0;Et<L.length;Et++)e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let Et=0;Et<L.length;Et++){ct.push(s.COLOR_ATTACHMENT0+Et),F.depthBuffer&&ct.push(St);const Rt=gt.__ignoreDepthValues!==void 0?gt.__ignoreDepthValues:!1;if(Rt===!1&&(F.depthBuffer&&(st|=s.DEPTH_BUFFER_BIT),F.stencilBuffer&&(st|=s.STENCIL_BUFFER_BIT)),dt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,gt.__webglColorRenderbuffer[Et]),Rt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[St]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[St])),dt){const ot=n.get(L[Et]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ot,0)}s.blitFramebuffer(0,0,Z,rt,0,0,Z,rt,st,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ct)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),dt)for(let Et=0;Et<L.length;Et++){e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.RENDERBUFFER,gt.__webglColorRenderbuffer[Et]);const Rt=n.get(L[Et]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Et,s.TEXTURE_2D,Rt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}}function ft(F){return Math.min(i.maxSamples,F.samples)}function ut(F){const L=n.get(F);return a&&F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function Ot(F){const L=r.render.frame;h.get(F)!==L&&(h.set(F,L),F.update())}function Ct(F,L){const Z=F.colorSpace,rt=F.format,st=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||F.format===Ia||Z!==Gn&&Z!==cn&&(te.getTransfer(Z)===le?a===!1?t.has("EXT_sRGB")===!0&&rt===ke?(F.format=Ia,F.minFilter=ie,F.generateMipmaps=!1):L=kc.sRGBToLinear(L):(rt!==ke||st!==sn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),L}this.allocateTextureUnit=b,this.resetTextureUnits=k,this.setTexture2D=N,this.setTexture2DArray=G,this.setTexture3D=D,this.setTextureCube=z,this.rebindTextures=it,this.setupRenderTarget=O,this.updateRenderTargetMipmap=mt,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=X,this.setupFrameBufferTexture=lt,this.useMultisampledRTT=ut}function $m(s,t,e){const n=e.isWebGL2;function i(o,r=cn){let a;const l=te.getTransfer(r);if(o===sn)return s.UNSIGNED_BYTE;if(o===Cc)return s.UNSIGNED_SHORT_4_4_4_4;if(o===Rc)return s.UNSIGNED_SHORT_5_5_5_1;if(o===pu)return s.BYTE;if(o===mu)return s.SHORT;if(o===Ka)return s.UNSIGNED_SHORT;if(o===Ac)return s.INT;if(o===In)return s.UNSIGNED_INT;if(o===gn)return s.FLOAT;if(o===Hn)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(o===gu)return s.ALPHA;if(o===ke)return s.RGBA;if(o===vu)return s.LUMINANCE;if(o===xu)return s.LUMINANCE_ALPHA;if(o===fi)return s.DEPTH_COMPONENT;if(o===$i)return s.DEPTH_STENCIL;if(o===Ia)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(o===Vi)return s.RED;if(o===Pc)return s.RED_INTEGER;if(o===_u)return s.RG;if(o===Lc)return s.RG_INTEGER;if(o===Dc)return s.RGBA_INTEGER;if(o===Wo||o===qo||o===Xo||o===Yo)if(l===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(o===Wo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===qo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===Xo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===Yo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(o===Wo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===qo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===Xo)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===Yo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===br||o===Er||o===Tr||o===Ar)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(o===br)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Er)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===Tr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===Ar)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Uc)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===Cr||o===Rr)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(o===Cr)return l===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(o===Rr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===Pr||o===Lr||o===Dr||o===Ur||o===Fr||o===Ir||o===zr||o===kr||o===Nr||o===Or||o===Br||o===Hr||o===Gr||o===Vr)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(o===Pr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Lr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Dr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Ur)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Fr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===Ir)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===zr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===kr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Nr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===Or)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===Br)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===Hr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===Gr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Vr)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===jo||o===Wr||o===qr)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(o===jo)return l===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===Wr)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===qr)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===Mu||o===Xr||o===Yr||o===jr)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(o===jo)return a.COMPRESSED_RED_RGTC1_EXT;if(o===Xr)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Yr)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===jr)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===ui?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[o]!==void 0?s[o]:null}return{convert:i}}class Km extends Ye{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class hn extends Ze{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zm={type:"move"};class va{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new hn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new hn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new hn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,o=null,r=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),p=this._getHandJoint(c,g);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,x=.005;c.inputState.pinching&&u>d+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new hn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Jm extends ts{constructor(t,e){super();const n=this;let i=null,o=1,r=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,x=null;const g=e.getContextAttributes();let m=null,p=null;const _=[],v=[],y=new Dt;let T=null;const w=new Ye;w.layers.enable(1),w.viewport=new ve;const E=new Ye;E.layers.enable(2),E.viewport=new ve;const A=[w,E],M=new Km;M.layers.enable(1),M.layers.enable(2);let S=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let Y=_[B];return Y===void 0&&(Y=new va,_[B]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(B){let Y=_[B];return Y===void 0&&(Y=new va,_[B]=Y),Y.getGripSpace()},this.getHand=function(B){let Y=_[B];return Y===void 0&&(Y=new va,_[B]=Y),Y.getHandSpace()};function I(B){const Y=v.indexOf(B.inputSource);if(Y===-1)return;const K=_[Y];K!==void 0&&(K.update(B.inputSource,B.frame,c||r),K.dispatchEvent({type:B.type,data:B.inputSource}))}function k(){i.removeEventListener("select",I),i.removeEventListener("selectstart",I),i.removeEventListener("selectend",I),i.removeEventListener("squeeze",I),i.removeEventListener("squeezestart",I),i.removeEventListener("squeezeend",I),i.removeEventListener("end",k),i.removeEventListener("inputsourceschange",b);for(let B=0;B<_.length;B++){const Y=v[B];Y!==null&&(v[B]=null,_[B].disconnect(Y))}S=null,C=null,t.setRenderTarget(m),d=null,u=null,f=null,i=null,p=null,j.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(y.width,y.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){o=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f},this.getFrame=function(){return x},this.getSession=function(){return i},this.setSession=async function(B){if(i=B,i!==null){if(m=t.getRenderTarget(),i.addEventListener("select",I),i.addEventListener("selectstart",I),i.addEventListener("selectend",I),i.addEventListener("squeeze",I),i.addEventListener("squeezestart",I),i.addEventListener("squeezeend",I),i.addEventListener("end",k),i.addEventListener("inputsourceschange",b),g.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(y),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const Y={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(i,e,Y),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new on(d.framebufferWidth,d.framebufferHeight,{format:ke,type:sn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Y=null,K=null,tt=null;g.depth&&(tt=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Y=g.stencil?$i:fi,K=g.stencil?ui:In);const lt={colorFormat:e.RGBA8,depthFormat:tt,scaleFactor:o};f=new XRWebGLBinding(i,e),u=f.createProjectionLayer(lt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),p=new on(u.textureWidth,u.textureHeight,{format:ke,type:sn,depthTexture:new ir(u.textureWidth,u.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const ht=t.properties.get(p);ht.__ignoreDepthValues=u.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await i.requestReferenceSpace(a),j.setContext(i),j.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function b(B){for(let Y=0;Y<B.removed.length;Y++){const K=B.removed[Y],tt=v.indexOf(K);tt>=0&&(v[tt]=null,_[tt].disconnect(K))}for(let Y=0;Y<B.added.length;Y++){const K=B.added[Y];let tt=v.indexOf(K);if(tt===-1){for(let ht=0;ht<_.length;ht++)if(ht>=v.length){v.push(K),tt=ht;break}else if(v[ht]===null){v[ht]=K,tt=ht;break}if(tt===-1)break}const lt=_[tt];lt&&lt.connect(K)}}const R=new V,N=new V;function G(B,Y,K){R.setFromMatrixPosition(Y.matrixWorld),N.setFromMatrixPosition(K.matrixWorld);const tt=R.distanceTo(N),lt=Y.projectionMatrix.elements,ht=K.projectionMatrix.elements,q=lt[14]/(lt[10]-1),X=lt[14]/(lt[10]+1),it=(lt[9]+1)/lt[5],O=(lt[9]-1)/lt[5],mt=(lt[8]-1)/lt[0],at=(ht[8]+1)/ht[0],ft=q*mt,ut=q*at,Ot=tt/(-mt+at),Ct=Ot*-mt;Y.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(Ct),B.translateZ(Ot),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();const F=q+Ot,L=X+Ot,Z=ft-Ct,rt=ut+(tt-Ct),st=it*X/L*F,ct=O*X/L*F;B.projectionMatrix.makePerspective(Z,rt,st,ct,F,L),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}function D(B,Y){Y===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(Y.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(i===null)return;M.near=E.near=w.near=B.near,M.far=E.far=w.far=B.far,(S!==M.near||C!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),S=M.near,C=M.far);const Y=B.parent,K=M.cameras;D(M,Y);for(let tt=0;tt<K.length;tt++)D(K[tt],Y);K.length===2?G(M,w,E):M.projectionMatrix.copy(w.projectionMatrix),z(B,M,Y)};function z(B,Y,K){K===null?B.matrix.copy(Y.matrixWorld):(B.matrix.copy(K.matrixWorld),B.matrix.invert(),B.matrix.multiply(Y.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(Y.projectionMatrix),B.projectionMatrixInverse.copy(Y.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=ws*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(B){l=B,u!==null&&(u.fixedFoveation=B),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=B)};let P=null;function H(B,Y){if(h=Y.getViewerPose(c||r),x=Y,h!==null){const K=h.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let tt=!1;K.length!==M.cameras.length&&(M.cameras.length=0,tt=!0);for(let lt=0;lt<K.length;lt++){const ht=K[lt];let q=null;if(d!==null)q=d.getViewport(ht);else{const it=f.getViewSubImage(u,ht);q=it.viewport,lt===0&&(t.setRenderTargetTextures(p,it.colorTexture,u.ignoreDepthValues?void 0:it.depthStencilTexture),t.setRenderTarget(p))}let X=A[lt];X===void 0&&(X=new Ye,X.layers.enable(lt),X.viewport=new ve,A[lt]=X),X.matrix.fromArray(ht.transform.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale),X.projectionMatrix.fromArray(ht.projectionMatrix),X.projectionMatrixInverse.copy(X.projectionMatrix).invert(),X.viewport.set(q.x,q.y,q.width,q.height),lt===0&&(M.matrix.copy(X.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),tt===!0&&M.cameras.push(X)}}for(let K=0;K<_.length;K++){const tt=v[K],lt=_[K];tt!==null&&lt!==void 0&&lt.update(tt,Y,c||r)}P&&P(B,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),x=null}const j=new Yc;j.setAnimationLoop(H),this.setAnimationLoop=function(B){P=B},this.dispose=function(){}}}function Qm(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Wc(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,_,v,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),f(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),u(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(o(m,p),x(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),g(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,_,v):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ve&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ve&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const _=t.get(p).envMap;if(_&&(m.envMap.value=_,m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;const v=s._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*v,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,_,v){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*_,m.scale.value=v*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,_){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ve&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,p){p.matcap&&(m.matcap.value=p.matcap)}function g(m,p){const _=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function tg(s,t,e,n){let i={},o={},r=[];const a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,v){const y=v.program;n.uniformBlockBinding(_,y)}function c(_,v){let y=i[_.id];y===void 0&&(x(_),y=h(_),i[_.id]=y,_.addEventListener("dispose",m));const T=v.program;n.updateUBOMapping(_,T);const w=t.render.frame;o[_.id]!==w&&(u(_),o[_.id]=w)}function h(_){const v=f();_.__bindingPointIndex=v;const y=s.createBuffer(),T=_.__size,w=_.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,T,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,y),y}function f(){for(let _=0;_<a;_++)if(r.indexOf(_)===-1)return r.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const v=i[_.id],y=_.uniforms,T=_.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let w=0,E=y.length;w<E;w++){const A=Array.isArray(y[w])?y[w]:[y[w]];for(let M=0,S=A.length;M<S;M++){const C=A[M];if(d(C,w,M,T)===!0){const I=C.__offset,k=Array.isArray(C.value)?C.value:[C.value];let b=0;for(let R=0;R<k.length;R++){const N=k[R],G=g(N);typeof N=="number"||typeof N=="boolean"?(C.__data[0]=N,s.bufferSubData(s.UNIFORM_BUFFER,I+b,C.__data)):N.isMatrix3?(C.__data[0]=N.elements[0],C.__data[1]=N.elements[1],C.__data[2]=N.elements[2],C.__data[3]=0,C.__data[4]=N.elements[3],C.__data[5]=N.elements[4],C.__data[6]=N.elements[5],C.__data[7]=0,C.__data[8]=N.elements[6],C.__data[9]=N.elements[7],C.__data[10]=N.elements[8],C.__data[11]=0):(N.toArray(C.__data,b),b+=G.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,I,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(_,v,y,T){const w=_.value,E=v+"_"+y;if(T[E]===void 0)return typeof w=="number"||typeof w=="boolean"?T[E]=w:T[E]=w.clone(),!0;{const A=T[E];if(typeof w=="number"||typeof w=="boolean"){if(A!==w)return T[E]=w,!0}else if(A.equals(w)===!1)return A.copy(w),!0}return!1}function x(_){const v=_.uniforms;let y=0;const T=16;for(let E=0,A=v.length;E<A;E++){const M=Array.isArray(v[E])?v[E]:[v[E]];for(let S=0,C=M.length;S<C;S++){const I=M[S],k=Array.isArray(I.value)?I.value:[I.value];for(let b=0,R=k.length;b<R;b++){const N=k[b],G=g(N),D=y%T;D!==0&&T-D<G.boundary&&(y+=T-D),I.__data=new Float32Array(G.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=G.storage}}}const w=y%T;return w>0&&(y+=T-w),_.__size=y,_.__cache={},this}function g(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const y=r.indexOf(v.__bindingPointIndex);r.splice(y,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete o[v.id]}function p(){for(const _ in i)s.deleteBuffer(i[_]);r=[],i={},o={}}return{bind:l,update:c,dispose:p}}class Qc{constructor(t={}){const{canvas:e=Xu(),context:n=null,depth:i=!0,stencil:o=!0,alpha:r=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=r;const d=new Uint32Array(4),x=new Int32Array(4);let g=null,m=null;const p=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Le,this._useLegacyLights=!1,this.toneMapping=Zn,this.toneMappingExposure=1;const v=this;let y=!1,T=0,w=0,E=null,A=-1,M=null;const S=new ve,C=new ve;let I=null;const k=new Pt(0);let b=0,R=e.width,N=e.height,G=1,D=null,z=null;const P=new ve(0,0,R,N),H=new ve(0,0,R,N);let j=!1;const B=new Ls;let Y=!1,K=!1,tt=null;const lt=new jt,ht=new Dt,q=new V,X={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function it(){return E===null?G:1}let O=n;function mt(U,$){for(let et=0;et<U.length;et++){const nt=U[et],Q=e.getContext(nt,$);if(Q!==null)return Q}return null}try{const U={alpha:!0,depth:i,stencil:o,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$a}`),e.addEventListener("webglcontextlost",vt,!1),e.addEventListener("webglcontextrestored",W,!1),e.addEventListener("webglcontextcreationerror",_t,!1),O===null){const $=["webgl2","webgl","experimental-webgl"];if(v.isWebGL1Renderer===!0&&$.shift(),O=mt($,U),O===null)throw mt($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(U){throw console.error("THREE.WebGLRenderer: "+U.message),U}let at,ft,ut,Ot,Ct,F,L,Z,rt,st,ct,St,gt,dt,Et,Rt,ot,$t,It,Ut,Tt,bt,Gt,Jt;function pe(){at=new hp(O),ft=new sp(O,at,t),at.init(ft),bt=new $m(O,at,ft),ut=new Ym(O,at,ft),Ot=new dp(O),Ct=new Um,F=new jm(O,at,ut,Ct,ft,bt,Ot),L=new ap(v),Z=new cp(v),rt=new yf(O,ft),Gt=new np(O,at,rt,ft),st=new up(O,rt,Ot,Gt),ct=new vp(O,st,rt,Ot),It=new gp(O,ft,F),Rt=new op(Ct),St=new Dm(v,L,Z,at,ft,Gt,Rt),gt=new Qm(v,Ct),dt=new Im,Et=new Hm(at,ft),$t=new ep(v,L,Z,ut,ct,u,l),ot=new Xm(v,ct,ft),Jt=new tg(O,Ot,ft,ut),Ut=new ip(O,at,Ot,ft),Tt=new fp(O,at,Ot,ft),Ot.programs=St.programs,v.capabilities=ft,v.extensions=at,v.properties=Ct,v.renderLists=dt,v.shadowMap=ot,v.state=ut,v.info=Ot}pe();const qt=new Jm(v,O);this.xr=qt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const U=at.get("WEBGL_lose_context");U&&U.loseContext()},this.forceContextRestore=function(){const U=at.get("WEBGL_lose_context");U&&U.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(U){U!==void 0&&(G=U,this.setSize(R,N,!1))},this.getSize=function(U){return U.set(R,N)},this.setSize=function(U,$,et=!0){if(qt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}R=U,N=$,e.width=Math.floor(U*G),e.height=Math.floor($*G),et===!0&&(e.style.width=U+"px",e.style.height=$+"px"),this.setViewport(0,0,U,$)},this.getDrawingBufferSize=function(U){return U.set(R*G,N*G).floor()},this.setDrawingBufferSize=function(U,$,et){R=U,N=$,G=et,e.width=Math.floor(U*et),e.height=Math.floor($*et),this.setViewport(0,0,U,$)},this.getCurrentViewport=function(U){return U.copy(S)},this.getViewport=function(U){return U.copy(P)},this.setViewport=function(U,$,et,nt){U.isVector4?P.set(U.x,U.y,U.z,U.w):P.set(U,$,et,nt),ut.viewport(S.copy(P).multiplyScalar(G).floor())},this.getScissor=function(U){return U.copy(H)},this.setScissor=function(U,$,et,nt){U.isVector4?H.set(U.x,U.y,U.z,U.w):H.set(U,$,et,nt),ut.scissor(C.copy(H).multiplyScalar(G).floor())},this.getScissorTest=function(){return j},this.setScissorTest=function(U){ut.setScissorTest(j=U)},this.setOpaqueSort=function(U){D=U},this.setTransparentSort=function(U){z=U},this.getClearColor=function(U){return U.copy($t.getClearColor())},this.setClearColor=function(){$t.setClearColor.apply($t,arguments)},this.getClearAlpha=function(){return $t.getClearAlpha()},this.setClearAlpha=function(){$t.setClearAlpha.apply($t,arguments)},this.clear=function(U=!0,$=!0,et=!0){let nt=0;if(U){let Q=!1;if(E!==null){const wt=E.texture.format;Q=wt===Dc||wt===Lc||wt===Pc}if(Q){const wt=E.texture.type,At=wt===sn||wt===In||wt===Ka||wt===ui||wt===Cc||wt===Rc,Ft=$t.getClearColor(),kt=$t.getClearAlpha(),Wt=Ft.r,Bt=Ft.g,Ht=Ft.b;At?(d[0]=Wt,d[1]=Bt,d[2]=Ht,d[3]=kt,O.clearBufferuiv(O.COLOR,0,d)):(x[0]=Wt,x[1]=Bt,x[2]=Ht,x[3]=kt,O.clearBufferiv(O.COLOR,0,x))}else nt|=O.COLOR_BUFFER_BIT}$&&(nt|=O.DEPTH_BUFFER_BIT),et&&(nt|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(nt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",vt,!1),e.removeEventListener("webglcontextrestored",W,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),dt.dispose(),Et.dispose(),Ct.dispose(),L.dispose(),Z.dispose(),ct.dispose(),Gt.dispose(),Jt.dispose(),St.dispose(),qt.dispose(),qt.removeEventListener("sessionstart",Oe),qt.removeEventListener("sessionend",ae),tt&&(tt.dispose(),tt=null),Be.stop()};function vt(U){U.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function W(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const U=Ot.autoReset,$=ot.enabled,et=ot.autoUpdate,nt=ot.needsUpdate,Q=ot.type;pe(),Ot.autoReset=U,ot.enabled=$,ot.autoUpdate=et,ot.needsUpdate=nt,ot.type=Q}function _t(U){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",U.statusMessage)}function Mt(U){const $=U.target;$.removeEventListener("dispose",Mt),zt($)}function zt(U){Lt(U),Ct.remove(U)}function Lt(U){const $=Ct.get(U).programs;$!==void 0&&($.forEach(function(et){St.releaseProgram(et)}),U.isShaderMaterial&&St.releaseShaderCache(U))}this.renderBufferDirect=function(U,$,et,nt,Q,wt){$===null&&($=X);const At=Q.isMesh&&Q.matrixWorld.determinant()<0,Ft=Ah(U,$,et,nt,Q);ut.setMaterial(nt,At);let kt=et.index,Wt=1;if(nt.wireframe===!0){if(kt=st.getWireframeAttribute(et),kt===void 0)return;Wt=2}const Bt=et.drawRange,Ht=et.attributes.position;let Me=Bt.start*Wt,Je=(Bt.start+Bt.count)*Wt;wt!==null&&(Me=Math.max(Me,wt.start*Wt),Je=Math.min(Je,(wt.start+wt.count)*Wt)),kt!==null?(Me=Math.max(Me,0),Je=Math.min(Je,kt.count)):Ht!=null&&(Me=Math.max(Me,0),Je=Math.min(Je,Ht.count));const Ce=Je-Me;if(Ce<0||Ce===1/0)return;Gt.setup(Q,nt,Ft,et,kt);let Sn,ce=Ut;if(kt!==null&&(Sn=rt.get(kt),ce=Tt,ce.setIndex(Sn)),Q.isMesh)nt.wireframe===!0?(ut.setLineWidth(nt.wireframeLinewidth*it()),ce.setMode(O.LINES)):ce.setMode(O.TRIANGLES);else if(Q.isLine){let Xt=nt.linewidth;Xt===void 0&&(Xt=1),ut.setLineWidth(Xt*it()),Q.isLineSegments?ce.setMode(O.LINES):Q.isLineLoop?ce.setMode(O.LINE_LOOP):ce.setMode(O.LINE_STRIP)}else Q.isPoints?ce.setMode(O.POINTS):Q.isSprite&&ce.setMode(O.TRIANGLES);if(Q.isBatchedMesh)ce.renderMultiDraw(Q._multiDrawStarts,Q._multiDrawCounts,Q._multiDrawCount);else if(Q.isInstancedMesh)ce.renderInstances(Me,Ce,Q.count);else if(et.isInstancedBufferGeometry){const Xt=et._maxInstanceCount!==void 0?et._maxInstanceCount:1/0,Oo=Math.min(et.instanceCount,Xt);ce.renderInstances(Me,Ce,Oo)}else ce.render(Me,Ce)};function se(U,$,et){U.transparent===!0&&U.side===je&&U.forceSinglePass===!1?(U.side=Ve,U.needsUpdate=!0,Fs(U,$,et),U.side=Bn,U.needsUpdate=!0,Fs(U,$,et),U.side=je):Fs(U,$,et)}this.compile=function(U,$,et=null){et===null&&(et=U),m=Et.get(et),m.init(),_.push(m),et.traverseVisible(function(Q){Q.isLight&&Q.layers.test($.layers)&&(m.pushLight(Q),Q.castShadow&&m.pushShadow(Q))}),U!==et&&U.traverseVisible(function(Q){Q.isLight&&Q.layers.test($.layers)&&(m.pushLight(Q),Q.castShadow&&m.pushShadow(Q))}),m.setupLights(v._useLegacyLights);const nt=new Set;return U.traverse(function(Q){const wt=Q.material;if(wt)if(Array.isArray(wt))for(let At=0;At<wt.length;At++){const Ft=wt[At];se(Ft,et,Q),nt.add(Ft)}else se(wt,et,Q),nt.add(wt)}),_.pop(),m=null,nt},this.compileAsync=function(U,$,et=null){const nt=this.compile(U,$,et);return new Promise(Q=>{function wt(){if(nt.forEach(function(At){Ct.get(At).currentProgram.isReady()&&nt.delete(At)}),nt.size===0){Q(U);return}setTimeout(wt,10)}at.get("KHR_parallel_shader_compile")!==null?wt():setTimeout(wt,10)})};let oe=null;function Ae(U){oe&&oe(U)}function Oe(){Be.stop()}function ae(){Be.start()}const Be=new Yc;Be.setAnimationLoop(Ae),typeof self<"u"&&Be.setContext(self),this.setAnimationLoop=function(U){oe=U,qt.setAnimationLoop(U),U===null?Be.stop():Be.start()},qt.addEventListener("sessionstart",Oe),qt.addEventListener("sessionend",ae),this.render=function(U,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),qt.enabled===!0&&qt.isPresenting===!0&&(qt.cameraAutoUpdate===!0&&qt.updateCamera($),$=qt.getCamera()),U.isScene===!0&&U.onBeforeRender(v,U,$,E),m=Et.get(U,_.length),m.init(),_.push(m),lt.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),B.setFromProjectionMatrix(lt),K=this.localClippingEnabled,Y=Rt.init(this.clippingPlanes,K),g=dt.get(U,p.length),g.init(),p.push(g),vn(U,$,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(D,z),this.info.render.frame++,Y===!0&&Rt.beginShadows();const et=m.state.shadowsArray;if(ot.render(et,U,$),Y===!0&&Rt.endShadows(),this.info.autoReset===!0&&this.info.reset(),$t.render(g,U),m.setupLights(v._useLegacyLights),$.isArrayCamera){const nt=$.cameras;for(let Q=0,wt=nt.length;Q<wt;Q++){const At=nt[Q];fr(g,U,At,At.viewport)}}else fr(g,U,$);E!==null&&(F.updateMultisampleRenderTarget(E),F.updateRenderTargetMipmap(E)),U.isScene===!0&&U.onAfterRender(v,U,$),Gt.resetDefaultState(),A=-1,M=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,p.pop(),p.length>0?g=p[p.length-1]:g=null};function vn(U,$,et,nt){if(U.visible===!1)return;if(U.layers.test($.layers)){if(U.isGroup)et=U.renderOrder;else if(U.isLOD)U.autoUpdate===!0&&U.update($);else if(U.isLight)m.pushLight(U),U.castShadow&&m.pushShadow(U);else if(U.isSprite){if(!U.frustumCulled||B.intersectsSprite(U)){nt&&q.setFromMatrixPosition(U.matrixWorld).applyMatrix4(lt);const At=ct.update(U),Ft=U.material;Ft.visible&&g.push(U,At,Ft,et,q.z,null)}}else if((U.isMesh||U.isLine||U.isPoints)&&(!U.frustumCulled||B.intersectsObject(U))){const At=ct.update(U),Ft=U.material;if(nt&&(U.boundingSphere!==void 0?(U.boundingSphere===null&&U.computeBoundingSphere(),q.copy(U.boundingSphere.center)):(At.boundingSphere===null&&At.computeBoundingSphere(),q.copy(At.boundingSphere.center)),q.applyMatrix4(U.matrixWorld).applyMatrix4(lt)),Array.isArray(Ft)){const kt=At.groups;for(let Wt=0,Bt=kt.length;Wt<Bt;Wt++){const Ht=kt[Wt],Me=Ft[Ht.materialIndex];Me&&Me.visible&&g.push(U,At,Me,et,q.z,Ht)}}else Ft.visible&&g.push(U,At,Ft,et,q.z,null)}}const wt=U.children;for(let At=0,Ft=wt.length;At<Ft;At++)vn(wt[At],$,et,nt)}function fr(U,$,et,nt){const Q=U.opaque,wt=U.transmissive,At=U.transparent;m.setupLightsView(et),Y===!0&&Rt.setGlobalState(v.clippingPlanes,et),wt.length>0&&Th(Q,wt,$,et),nt&&ut.viewport(S.copy(nt)),Q.length>0&&Us(Q,$,et),wt.length>0&&Us(wt,$,et),At.length>0&&Us(At,$,et),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function Th(U,$,et,nt){if((et.isScene===!0?et.overrideMaterial:null)!==null)return;const wt=ft.isWebGL2;tt===null&&(tt=new on(1,1,{generateMipmaps:!0,type:at.has("EXT_color_buffer_half_float")?Hn:sn,minFilter:mi,samples:wt?4:0})),v.getDrawingBufferSize(ht),wt?tt.setSize(ht.x,ht.y):tt.setSize(Co(ht.x),Co(ht.y));const At=v.getRenderTarget();v.setRenderTarget(tt),v.getClearColor(k),b=v.getClearAlpha(),b<1&&v.setClearColor(16777215,.5),v.clear();const Ft=v.toneMapping;v.toneMapping=Zn,Us(U,et,nt),F.updateMultisampleRenderTarget(tt),F.updateRenderTargetMipmap(tt);let kt=!1;for(let Wt=0,Bt=$.length;Wt<Bt;Wt++){const Ht=$[Wt],Me=Ht.object,Je=Ht.geometry,Ce=Ht.material,Sn=Ht.group;if(Ce.side===je&&Me.layers.test(nt.layers)){const ce=Ce.side;Ce.side=Ve,Ce.needsUpdate=!0,dr(Me,et,nt,Je,Ce,Sn),Ce.side=ce,Ce.needsUpdate=!0,kt=!0}}kt===!0&&(F.updateMultisampleRenderTarget(tt),F.updateRenderTargetMipmap(tt)),v.setRenderTarget(At),v.setClearColor(k,b),v.toneMapping=Ft}function Us(U,$,et){const nt=$.isScene===!0?$.overrideMaterial:null;for(let Q=0,wt=U.length;Q<wt;Q++){const At=U[Q],Ft=At.object,kt=At.geometry,Wt=nt===null?At.material:nt,Bt=At.group;Ft.layers.test(et.layers)&&dr(Ft,$,et,kt,Wt,Bt)}}function dr(U,$,et,nt,Q,wt){U.onBeforeRender(v,$,et,nt,Q,wt),U.modelViewMatrix.multiplyMatrices(et.matrixWorldInverse,U.matrixWorld),U.normalMatrix.getNormalMatrix(U.modelViewMatrix),Q.onBeforeRender(v,$,et,nt,U,wt),Q.transparent===!0&&Q.side===je&&Q.forceSinglePass===!1?(Q.side=Ve,Q.needsUpdate=!0,v.renderBufferDirect(et,$,nt,Q,U,wt),Q.side=Bn,Q.needsUpdate=!0,v.renderBufferDirect(et,$,nt,Q,U,wt),Q.side=je):v.renderBufferDirect(et,$,nt,Q,U,wt),U.onAfterRender(v,$,et,nt,Q,wt)}function Fs(U,$,et){$.isScene!==!0&&($=X);const nt=Ct.get(U),Q=m.state.lights,wt=m.state.shadowsArray,At=Q.state.version,Ft=St.getParameters(U,Q.state,wt,$,et),kt=St.getProgramCacheKey(Ft);let Wt=nt.programs;nt.environment=U.isMeshStandardMaterial?$.environment:null,nt.fog=$.fog,nt.envMap=(U.isMeshStandardMaterial?Z:L).get(U.envMap||nt.environment),Wt===void 0&&(U.addEventListener("dispose",Mt),Wt=new Map,nt.programs=Wt);let Bt=Wt.get(kt);if(Bt!==void 0){if(nt.currentProgram===Bt&&nt.lightsStateVersion===At)return mr(U,Ft),Bt}else Ft.uniforms=St.getUniforms(U),U.onBuild(et,Ft,v),U.onBeforeCompile(Ft,v),Bt=St.acquireProgram(Ft,kt),Wt.set(kt,Bt),nt.uniforms=Ft.uniforms;const Ht=nt.uniforms;return(!U.isShaderMaterial&&!U.isRawShaderMaterial||U.clipping===!0)&&(Ht.clippingPlanes=Rt.uniform),mr(U,Ft),nt.needsLights=Rh(U),nt.lightsStateVersion=At,nt.needsLights&&(Ht.ambientLightColor.value=Q.state.ambient,Ht.lightProbe.value=Q.state.probe,Ht.directionalLights.value=Q.state.directional,Ht.directionalLightShadows.value=Q.state.directionalShadow,Ht.spotLights.value=Q.state.spot,Ht.spotLightShadows.value=Q.state.spotShadow,Ht.rectAreaLights.value=Q.state.rectArea,Ht.ltc_1.value=Q.state.rectAreaLTC1,Ht.ltc_2.value=Q.state.rectAreaLTC2,Ht.pointLights.value=Q.state.point,Ht.pointLightShadows.value=Q.state.pointShadow,Ht.hemisphereLights.value=Q.state.hemi,Ht.directionalShadowMap.value=Q.state.directionalShadowMap,Ht.directionalShadowMatrix.value=Q.state.directionalShadowMatrix,Ht.spotShadowMap.value=Q.state.spotShadowMap,Ht.spotLightMatrix.value=Q.state.spotLightMatrix,Ht.spotLightMap.value=Q.state.spotLightMap,Ht.pointShadowMap.value=Q.state.pointShadowMap,Ht.pointShadowMatrix.value=Q.state.pointShadowMatrix),nt.currentProgram=Bt,nt.uniformsList=null,Bt}function pr(U){if(U.uniformsList===null){const $=U.currentProgram.getUniforms();U.uniformsList=vo.seqWithValue($.seq,U.uniforms)}return U.uniformsList}function mr(U,$){const et=Ct.get(U);et.outputColorSpace=$.outputColorSpace,et.batching=$.batching,et.instancing=$.instancing,et.instancingColor=$.instancingColor,et.skinning=$.skinning,et.morphTargets=$.morphTargets,et.morphNormals=$.morphNormals,et.morphColors=$.morphColors,et.morphTargetsCount=$.morphTargetsCount,et.numClippingPlanes=$.numClippingPlanes,et.numIntersection=$.numClipIntersection,et.vertexAlphas=$.vertexAlphas,et.vertexTangents=$.vertexTangents,et.toneMapping=$.toneMapping}function Ah(U,$,et,nt,Q){$.isScene!==!0&&($=X),F.resetTextureUnits();const wt=$.fog,At=nt.isMeshStandardMaterial?$.environment:null,Ft=E===null?v.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Gn,kt=(nt.isMeshStandardMaterial?Z:L).get(nt.envMap||At),Wt=nt.vertexColors===!0&&!!et.attributes.color&&et.attributes.color.itemSize===4,Bt=!!et.attributes.tangent&&(!!nt.normalMap||nt.anisotropy>0),Ht=!!et.morphAttributes.position,Me=!!et.morphAttributes.normal,Je=!!et.morphAttributes.color;let Ce=Zn;nt.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(Ce=v.toneMapping);const Sn=et.morphAttributes.position||et.morphAttributes.normal||et.morphAttributes.color,ce=Sn!==void 0?Sn.length:0,Xt=Ct.get(nt),Oo=m.state.lights;if(Y===!0&&(K===!0||U!==M)){const an=U===M&&nt.id===A;Rt.setState(nt,U,an)}let me=!1;nt.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==Oo.state.version||Xt.outputColorSpace!==Ft||Q.isBatchedMesh&&Xt.batching===!1||!Q.isBatchedMesh&&Xt.batching===!0||Q.isInstancedMesh&&Xt.instancing===!1||!Q.isInstancedMesh&&Xt.instancing===!0||Q.isSkinnedMesh&&Xt.skinning===!1||!Q.isSkinnedMesh&&Xt.skinning===!0||Q.isInstancedMesh&&Xt.instancingColor===!0&&Q.instanceColor===null||Q.isInstancedMesh&&Xt.instancingColor===!1&&Q.instanceColor!==null||Xt.envMap!==kt||nt.fog===!0&&Xt.fog!==wt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Rt.numPlanes||Xt.numIntersection!==Rt.numIntersection)||Xt.vertexAlphas!==Wt||Xt.vertexTangents!==Bt||Xt.morphTargets!==Ht||Xt.morphNormals!==Me||Xt.morphColors!==Je||Xt.toneMapping!==Ce||ft.isWebGL2===!0&&Xt.morphTargetsCount!==ce)&&(me=!0):(me=!0,Xt.__version=nt.version);let Qn=Xt.currentProgram;me===!0&&(Qn=Fs(nt,$,Q));let gr=!1,ss=!1,Bo=!1;const De=Qn.getUniforms(),ti=Xt.uniforms;if(ut.useProgram(Qn.program)&&(gr=!0,ss=!0,Bo=!0),nt.id!==A&&(A=nt.id,ss=!0),gr||M!==U){De.setValue(O,"projectionMatrix",U.projectionMatrix),De.setValue(O,"viewMatrix",U.matrixWorldInverse);const an=De.map.cameraPosition;an!==void 0&&an.setValue(O,q.setFromMatrixPosition(U.matrixWorld)),ft.logarithmicDepthBuffer&&De.setValue(O,"logDepthBufFC",2/(Math.log(U.far+1)/Math.LN2)),(nt.isMeshPhongMaterial||nt.isMeshToonMaterial||nt.isMeshLambertMaterial||nt.isMeshBasicMaterial||nt.isMeshStandardMaterial||nt.isShaderMaterial)&&De.setValue(O,"isOrthographic",U.isOrthographicCamera===!0),M!==U&&(M=U,ss=!0,Bo=!0)}if(Q.isSkinnedMesh){De.setOptional(O,Q,"bindMatrix"),De.setOptional(O,Q,"bindMatrixInverse");const an=Q.skeleton;an&&(ft.floatVertexTextures?(an.boneTexture===null&&an.computeBoneTexture(),De.setValue(O,"boneTexture",an.boneTexture,F)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Q.isBatchedMesh&&(De.setOptional(O,Q,"batchingTexture"),De.setValue(O,"batchingTexture",Q._matricesTexture,F));const Ho=et.morphAttributes;if((Ho.position!==void 0||Ho.normal!==void 0||Ho.color!==void 0&&ft.isWebGL2===!0)&&It.update(Q,et,Qn),(ss||Xt.receiveShadow!==Q.receiveShadow)&&(Xt.receiveShadow=Q.receiveShadow,De.setValue(O,"receiveShadow",Q.receiveShadow)),nt.isMeshGouraudMaterial&&nt.envMap!==null&&(ti.envMap.value=kt,ti.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),ss&&(De.setValue(O,"toneMappingExposure",v.toneMappingExposure),Xt.needsLights&&Ch(ti,Bo),wt&&nt.fog===!0&&gt.refreshFogUniforms(ti,wt),gt.refreshMaterialUniforms(ti,nt,G,N,tt),vo.upload(O,pr(Xt),ti,F)),nt.isShaderMaterial&&nt.uniformsNeedUpdate===!0&&(vo.upload(O,pr(Xt),ti,F),nt.uniformsNeedUpdate=!1),nt.isSpriteMaterial&&De.setValue(O,"center",Q.center),De.setValue(O,"modelViewMatrix",Q.modelViewMatrix),De.setValue(O,"normalMatrix",Q.normalMatrix),De.setValue(O,"modelMatrix",Q.matrixWorld),nt.isShaderMaterial||nt.isRawShaderMaterial){const an=nt.uniformsGroups;for(let Go=0,Ph=an.length;Go<Ph;Go++)if(ft.isWebGL2){const vr=an[Go];Jt.update(vr,Qn),Jt.bind(vr,Qn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Qn}function Ch(U,$){U.ambientLightColor.needsUpdate=$,U.lightProbe.needsUpdate=$,U.directionalLights.needsUpdate=$,U.directionalLightShadows.needsUpdate=$,U.pointLights.needsUpdate=$,U.pointLightShadows.needsUpdate=$,U.spotLights.needsUpdate=$,U.spotLightShadows.needsUpdate=$,U.rectAreaLights.needsUpdate=$,U.hemisphereLights.needsUpdate=$}function Rh(U){return U.isMeshLambertMaterial||U.isMeshToonMaterial||U.isMeshPhongMaterial||U.isMeshStandardMaterial||U.isShadowMaterial||U.isShaderMaterial&&U.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(U,$,et){Ct.get(U.texture).__webglTexture=$,Ct.get(U.depthTexture).__webglTexture=et;const nt=Ct.get(U);nt.__hasExternalTextures=!0,nt.__hasExternalTextures&&(nt.__autoAllocateDepthBuffer=et===void 0,nt.__autoAllocateDepthBuffer||at.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),nt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(U,$){const et=Ct.get(U);et.__webglFramebuffer=$,et.__useDefaultFramebuffer=$===void 0},this.setRenderTarget=function(U,$=0,et=0){E=U,T=$,w=et;let nt=!0,Q=null,wt=!1,At=!1;if(U){const kt=Ct.get(U);kt.__useDefaultFramebuffer!==void 0?(ut.bindFramebuffer(O.FRAMEBUFFER,null),nt=!1):kt.__webglFramebuffer===void 0?F.setupRenderTarget(U):kt.__hasExternalTextures&&F.rebindTextures(U,Ct.get(U.texture).__webglTexture,Ct.get(U.depthTexture).__webglTexture);const Wt=U.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(At=!0);const Bt=Ct.get(U).__webglFramebuffer;U.isWebGLCubeRenderTarget?(Array.isArray(Bt[$])?Q=Bt[$][et]:Q=Bt[$],wt=!0):ft.isWebGL2&&U.samples>0&&F.useMultisampledRTT(U)===!1?Q=Ct.get(U).__webglMultisampledFramebuffer:Array.isArray(Bt)?Q=Bt[et]:Q=Bt,S.copy(U.viewport),C.copy(U.scissor),I=U.scissorTest}else S.copy(P).multiplyScalar(G).floor(),C.copy(H).multiplyScalar(G).floor(),I=j;if(ut.bindFramebuffer(O.FRAMEBUFFER,Q)&&ft.drawBuffers&&nt&&ut.drawBuffers(U,Q),ut.viewport(S),ut.scissor(C),ut.setScissorTest(I),wt){const kt=Ct.get(U.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+$,kt.__webglTexture,et)}else if(At){const kt=Ct.get(U.texture),Wt=$||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,kt.__webglTexture,et||0,Wt)}A=-1},this.readRenderTargetPixels=function(U,$,et,nt,Q,wt,At){if(!(U&&U.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=Ct.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&At!==void 0&&(Ft=Ft[At]),Ft){ut.bindFramebuffer(O.FRAMEBUFFER,Ft);try{const kt=U.texture,Wt=kt.format,Bt=kt.type;if(Wt!==ke&&bt.convert(Wt)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ht=Bt===Hn&&(at.has("EXT_color_buffer_half_float")||ft.isWebGL2&&at.has("EXT_color_buffer_float"));if(Bt!==sn&&bt.convert(Bt)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Bt===gn&&(ft.isWebGL2||at.has("OES_texture_float")||at.has("WEBGL_color_buffer_float")))&&!Ht){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=U.width-nt&&et>=0&&et<=U.height-Q&&O.readPixels($,et,nt,Q,bt.convert(Wt),bt.convert(Bt),wt)}finally{const kt=E!==null?Ct.get(E).__webglFramebuffer:null;ut.bindFramebuffer(O.FRAMEBUFFER,kt)}}},this.copyFramebufferToTexture=function(U,$,et=0){const nt=Math.pow(2,-et),Q=Math.floor($.image.width*nt),wt=Math.floor($.image.height*nt);F.setTexture2D($,0),O.copyTexSubImage2D(O.TEXTURE_2D,et,0,0,U.x,U.y,Q,wt),ut.unbindTexture()},this.copyTextureToTexture=function(U,$,et,nt=0){const Q=$.image.width,wt=$.image.height,At=bt.convert(et.format),Ft=bt.convert(et.type);F.setTexture2D(et,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,et.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,et.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,et.unpackAlignment),$.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,nt,U.x,U.y,Q,wt,At,Ft,$.image.data):$.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,nt,U.x,U.y,$.mipmaps[0].width,$.mipmaps[0].height,At,$.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,nt,U.x,U.y,At,Ft,$.image),nt===0&&et.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),ut.unbindTexture()},this.copyTextureToTexture3D=function(U,$,et,nt,Q=0){if(v.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const wt=U.max.x-U.min.x+1,At=U.max.y-U.min.y+1,Ft=U.max.z-U.min.z+1,kt=bt.convert(nt.format),Wt=bt.convert(nt.type);let Bt;if(nt.isData3DTexture)F.setTexture3D(nt,0),Bt=O.TEXTURE_3D;else if(nt.isDataArrayTexture||nt.isCompressedArrayTexture)F.setTexture2DArray(nt,0),Bt=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,nt.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,nt.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,nt.unpackAlignment);const Ht=O.getParameter(O.UNPACK_ROW_LENGTH),Me=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Je=O.getParameter(O.UNPACK_SKIP_PIXELS),Ce=O.getParameter(O.UNPACK_SKIP_ROWS),Sn=O.getParameter(O.UNPACK_SKIP_IMAGES),ce=et.isCompressedTexture?et.mipmaps[Q]:et.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,ce.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ce.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,U.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,U.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,U.min.z),et.isDataTexture||et.isData3DTexture?O.texSubImage3D(Bt,Q,$.x,$.y,$.z,wt,At,Ft,kt,Wt,ce.data):et.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Bt,Q,$.x,$.y,$.z,wt,At,Ft,kt,ce.data)):O.texSubImage3D(Bt,Q,$.x,$.y,$.z,wt,At,Ft,kt,Wt,ce),O.pixelStorei(O.UNPACK_ROW_LENGTH,Ht),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Me),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Je),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ce),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Sn),Q===0&&nt.generateMipmaps&&O.generateMipmap(Bt),ut.unbindTexture()},this.initTexture=function(U){U.isCubeTexture?F.setTextureCube(U,0):U.isData3DTexture?F.setTexture3D(U,0):U.isDataArrayTexture||U.isCompressedArrayTexture?F.setTexture2DArray(U,0):F.setTexture2D(U,0),ut.unbindTexture()},this.resetState=function(){T=0,w=0,E=null,ut.reset(),Gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Za?"display-p3":"srgb",e.unpackColorSpace=te.workingColorSpace===Fo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Le?di:Fc}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===di?Le:Gn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class eg extends Qc{}eg.prototype.isWebGL1Renderer=!0;class Zi extends Ze{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Jn extends Ke{constructor(t=null,e=1,n=1,i,o,r,a,l,c=fe,h=fe,f,u){super(null,r,a,l,c,h,i,o,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Nn extends ue{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Fi=new jt,Nl=new jt,io=[],Ol=new wn,ng=new jt,cs=new Qt,hs=new ns;class Ms extends Qt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Nn(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,ng)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new wn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Fi),Ol.copy(t.boundingBox).applyMatrix4(Fi),this.boundingBox.union(Ol)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ns),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Fi),hs.copy(t.boundingSphere).applyMatrix4(Fi),this.boundingSphere.union(hs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(cs.geometry=this.geometry,cs.material=this.material,cs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hs.copy(this.boundingSphere),hs.applyMatrix4(n),t.ray.intersectsSphere(hs)!==!1))for(let o=0;o<i;o++){this.getMatrixAt(o,Fi),Nl.multiplyMatrices(n,Fi),cs.matrixWorld=Nl,cs.raycast(t,io);for(let r=0,a=io.length;r<a;r++){const l=io[r];l.instanceId=o,l.object=this,e.push(l)}io.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Nn(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class ig extends Rs{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Pt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Bl=new jt,Oa=new Qa,so=new ns,oo=new V;class th extends Ze{constructor(t=new be,e=new ig){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,o=t.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),so.copy(n.boundingSphere),so.applyMatrix4(i),so.radius+=o,t.ray.intersectsSphere(so)===!1)return;Bl.copy(i).invert(),Oa.copy(t.ray).applyMatrix4(Bl);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){const u=Math.max(0,r.start),d=Math.min(c.count,r.start+r.count);for(let x=u,g=d;x<g;x++){const m=c.getX(x);oo.fromBufferAttribute(f,m),Hl(oo,m,l,i,t,e,this)}}else{const u=Math.max(0,r.start),d=Math.min(f.count,r.start+r.count);for(let x=u,g=d;x<g;x++)oo.fromBufferAttribute(f,x),Hl(oo,x,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=i.length;o<r;o++){const a=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Hl(s,t,e,n,i,o,r){const a=Oa.distanceSqToPoint(s);if(a<e){const l=new V;Oa.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;o.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:r})}}class sr extends be{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const o=[],r=[];a(i),c(n),h(),this.setAttribute("position",new ne(o,3)),this.setAttribute("normal",new ne(o.slice(),3)),this.setAttribute("uv",new ne(r,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const v=new V,y=new V,T=new V;for(let w=0;w<e.length;w+=3)d(e[w+0],v),d(e[w+1],y),d(e[w+2],T),l(v,y,T,_)}function l(_,v,y,T){const w=T+1,E=[];for(let A=0;A<=w;A++){E[A]=[];const M=_.clone().lerp(y,A/w),S=v.clone().lerp(y,A/w),C=w-A;for(let I=0;I<=C;I++)I===0&&A===w?E[A][I]=M:E[A][I]=M.clone().lerp(S,I/C)}for(let A=0;A<w;A++)for(let M=0;M<2*(w-A)-1;M++){const S=Math.floor(M/2);M%2===0?(u(E[A][S+1]),u(E[A+1][S]),u(E[A][S])):(u(E[A][S+1]),u(E[A+1][S+1]),u(E[A+1][S]))}}function c(_){const v=new V;for(let y=0;y<o.length;y+=3)v.x=o[y+0],v.y=o[y+1],v.z=o[y+2],v.normalize().multiplyScalar(_),o[y+0]=v.x,o[y+1]=v.y,o[y+2]=v.z}function h(){const _=new V;for(let v=0;v<o.length;v+=3){_.x=o[v+0],_.y=o[v+1],_.z=o[v+2];const y=m(_)/2/Math.PI+.5,T=p(_)/Math.PI+.5;r.push(y,1-T)}x(),f()}function f(){for(let _=0;_<r.length;_+=6){const v=r[_+0],y=r[_+2],T=r[_+4],w=Math.max(v,y,T),E=Math.min(v,y,T);w>.9&&E<.1&&(v<.2&&(r[_+0]+=1),y<.2&&(r[_+2]+=1),T<.2&&(r[_+4]+=1))}}function u(_){o.push(_.x,_.y,_.z)}function d(_,v){const y=_*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function x(){const _=new V,v=new V,y=new V,T=new V,w=new Dt,E=new Dt,A=new Dt;for(let M=0,S=0;M<o.length;M+=9,S+=6){_.set(o[M+0],o[M+1],o[M+2]),v.set(o[M+3],o[M+4],o[M+5]),y.set(o[M+6],o[M+7],o[M+8]),w.set(r[S+0],r[S+1]),E.set(r[S+2],r[S+3]),A.set(r[S+4],r[S+5]),T.copy(_).add(v).add(y).divideScalar(3);const C=m(T);g(w,S+0,_,C),g(E,S+2,v,C),g(A,S+4,y,C)}}function g(_,v,y,T){T<0&&_.x===1&&(r[v]=_.x-1),y.x===0&&y.z===0&&(r[v]=T/2/Math.PI+.5)}function m(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sr(t.vertices,t.indices,t.radius,t.details)}}const sg={triangulate:function(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let o=eh(s,0,i,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,l,c,h,f,u,d;if(n&&(o=cg(s,t,o,e)),s.length>80*e){a=c=s[0],l=h=s[1];for(let x=e;x<i;x+=e)f=s[x],u=s[x+1],f<a&&(a=f),u<l&&(l=u),f>c&&(c=f),u>h&&(h=u);d=Math.max(c-a,h-l),d=d!==0?32767/d:0}return Ss(o,r,e,a,l,d,0),r}};function eh(s,t,e,n,i){let o,r;if(i===Mg(s,t,e,n)>0)for(o=t;o<e;o+=n)r=Gl(o,s[o],s[o+1],r);else for(o=e-n;o>=t;o-=n)r=Gl(o,s[o],s[o+1],r);return r&&zo(r,r.next)&&(Es(r),r=r.next),r}function gi(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(zo(e,e.next)||de(e.prev,e,e.next)===0)){if(Es(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ss(s,t,e,n,i,o,r){if(!s)return;!r&&o&&pg(s,n,i,o);let a=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,o?ag(s,n,i,o):og(s)){t.push(l.i/e|0),t.push(s.i/e|0),t.push(c.i/e|0),Es(s),s=c.next,a=c.next;continue}if(s=c,s===a){r?r===1?(s=rg(gi(s),t,e),Ss(s,t,e,n,i,o,2)):r===2&&lg(s,t,e,n,i,o):Ss(gi(s),t,e,n,i,o,1);break}}}function og(s){const t=s.prev,e=s,n=s.next;if(de(t,e,n)>=0)return!1;const i=t.x,o=e.x,r=n.x,a=t.y,l=e.y,c=n.y,h=i<o?i<r?i:r:o<r?o:r,f=a<l?a<c?a:c:l<c?l:c,u=i>o?i>r?i:r:o>r?o:r,d=a>l?a>c?a:c:l>c?l:c;let x=n.next;for(;x!==t;){if(x.x>=h&&x.x<=u&&x.y>=f&&x.y<=d&&Hi(i,a,o,l,r,c,x.x,x.y)&&de(x.prev,x,x.next)>=0)return!1;x=x.next}return!0}function ag(s,t,e,n){const i=s.prev,o=s,r=s.next;if(de(i,o,r)>=0)return!1;const a=i.x,l=o.x,c=r.x,h=i.y,f=o.y,u=r.y,d=a<l?a<c?a:c:l<c?l:c,x=h<f?h<u?h:u:f<u?f:u,g=a>l?a>c?a:c:l>c?l:c,m=h>f?h>u?h:u:f>u?f:u,p=Ba(d,x,t,e,n),_=Ba(g,m,t,e,n);let v=s.prevZ,y=s.nextZ;for(;v&&v.z>=p&&y&&y.z<=_;){if(v.x>=d&&v.x<=g&&v.y>=x&&v.y<=m&&v!==i&&v!==r&&Hi(a,h,l,f,c,u,v.x,v.y)&&de(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=d&&y.x<=g&&y.y>=x&&y.y<=m&&y!==i&&y!==r&&Hi(a,h,l,f,c,u,y.x,y.y)&&de(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=p;){if(v.x>=d&&v.x<=g&&v.y>=x&&v.y<=m&&v!==i&&v!==r&&Hi(a,h,l,f,c,u,v.x,v.y)&&de(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=_;){if(y.x>=d&&y.x<=g&&y.y>=x&&y.y<=m&&y!==i&&y!==r&&Hi(a,h,l,f,c,u,y.x,y.y)&&de(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function rg(s,t,e){let n=s;do{const i=n.prev,o=n.next.next;!zo(i,o)&&nh(i,n,n.next,o)&&bs(i,o)&&bs(o,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),Es(n),Es(n.next),n=s=o),n=n.next}while(n!==s);return gi(n)}function lg(s,t,e,n,i,o){let r=s;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&vg(r,a)){let l=ih(r,a);r=gi(r,r.next),l=gi(l,l.next),Ss(r,t,e,n,i,o,0),Ss(l,t,e,n,i,o,0);return}a=a.next}r=r.next}while(r!==s)}function cg(s,t,e,n){const i=[];let o,r,a,l,c;for(o=0,r=t.length;o<r;o++)a=t[o]*n,l=o<r-1?t[o+1]*n:s.length,c=eh(s,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(gg(c));for(i.sort(hg),o=0;o<i.length;o++)e=ug(i[o],e);return e}function hg(s,t){return s.x-t.x}function ug(s,t){const e=fg(s,t);if(!e)return t;const n=ih(e,s);return gi(n,n.next),gi(e,e.next)}function fg(s,t){let e=t,n=-1/0,i;const o=s.x,r=s.y;do{if(r<=e.y&&r>=e.next.y&&e.next.y!==e.y){const u=e.x+(r-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=o&&u>n&&(n=u,i=e.x<e.next.x?e:e.next,u===o))return i}e=e.next}while(e!==t);if(!i)return null;const a=i,l=i.x,c=i.y;let h=1/0,f;e=i;do o>=e.x&&e.x>=l&&o!==e.x&&Hi(r<c?o:n,r,l,c,r<c?n:o,r,e.x,e.y)&&(f=Math.abs(r-e.y)/(o-e.x),bs(e,s)&&(f<h||f===h&&(e.x>i.x||e.x===i.x&&dg(i,e)))&&(i=e,h=f)),e=e.next;while(e!==a);return i}function dg(s,t){return de(s.prev,s,t.prev)<0&&de(t.next,s,s.next)<0}function pg(s,t,e,n){let i=s;do i.z===0&&(i.z=Ba(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,mg(i)}function mg(s){let t,e,n,i,o,r,a,l,c=1;do{for(e=s,s=null,o=null,r=0;e;){for(r++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,l--),o?o.nextZ=i:s=i,i.prevZ=o,o=i;e=n}o.nextZ=null,c*=2}while(r>1);return s}function Ba(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function gg(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Hi(s,t,e,n,i,o,r,a){return(i-r)*(t-a)>=(s-r)*(o-a)&&(s-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(i-r)*(n-a)}function vg(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!xg(s,t)&&(bs(s,t)&&bs(t,s)&&_g(s,t)&&(de(s.prev,s,t.prev)||de(s,t.prev,t))||zo(s,t)&&de(s.prev,s,s.next)>0&&de(t.prev,t,t.next)>0)}function de(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function zo(s,t){return s.x===t.x&&s.y===t.y}function nh(s,t,e,n){const i=ro(de(s,t,e)),o=ro(de(s,t,n)),r=ro(de(e,n,s)),a=ro(de(e,n,t));return!!(i!==o&&r!==a||i===0&&ao(s,e,t)||o===0&&ao(s,n,t)||r===0&&ao(e,s,n)||a===0&&ao(e,t,n))}function ao(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function ro(s){return s>0?1:s<0?-1:0}function xg(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&nh(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function bs(s,t){return de(s.prev,s,s.next)<0?de(s,t,s.next)>=0&&de(s,s.prev,t)>=0:de(s,t,s.prev)<0||de(s,s.next,t)<0}function _g(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,o=(s.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&i<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function ih(s,t){const e=new Ha(s.i,s.x,s.y),n=new Ha(t.i,t.x,t.y),i=s.next,o=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Gl(s,t,e,n){const i=new Ha(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Es(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Ha(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Mg(s,t,e,n){let i=0;for(let o=t,r=e-n;o<e;o+=n)i+=(s[r]-s[o])*(s[o+1]+s[r+1]),r=o;return i}class or{static area(t){const e=t.length;let n=0;for(let i=e-1,o=0;o<e;i=o++)n+=t[i].x*t[o].y-t[o].x*t[i].y;return n*.5}static isClockWise(t){return or.area(t)<0}static triangulateShape(t,e){const n=[],i=[],o=[];Vl(t),Wl(n,t);let r=t.length;e.forEach(Vl);for(let l=0;l<e.length;l++)i.push(r),r+=e[l].length,Wl(n,e[l]);const a=sg.triangulate(n,i);for(let l=0;l<a.length;l+=3)o.push(a.slice(l,l+3));return o}}function Vl(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Wl(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class ar extends sr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ar(t.radius,t.detail)}}class sh extends be{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class yg{constructor(t,e,n=0,i=1/0){this.ray=new Qa(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new tr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Ga(t,this,n,e),n.sort(ql),n}intersectObjects(t,e=!0,n=[]){for(let i=0,o=t.length;i<o;i++)Ga(t[i],this,n,e);return n.sort(ql),n}}function ql(s,t){return s.distance-t.distance}function Ga(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let o=0,r=i.length;o<r;o++)Ga(i[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$a}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$a);const xa=s=>Number.isInteger(s)?s.toFixed(1):String(s),Ne=`
#define WORLD ${xa(Zt)}
#define HALF_WORLD ${xa(Zt/2)}
#define HRES ${xa(yn)}
#define Y_PER_M ${Nt}
#define PI 3.14159265
`,Vn=`
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
`,un=`
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
`,oh=`
float seaVn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
  float b = fract(sin(dot(i + vec2(1, 0), vec2(127.1, 311.7))) * 43758.5453);
  float c = fract(sin(dot(i + vec2(0, 1), vec2(127.1, 311.7))) * 43758.5453);
  float d = fract(sin(dot(i + vec2(1, 1), vec2(127.1, 311.7))) * 43758.5453);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
// 0 over the island and its near waters (the land reaches ~125 units from
// the middle), 1 out on the open sea
float openSea(vec2 xz) { return smoothstep(135.0, 215.0, length(xz)); }
// their cover at xz: streets along the wind (wind: how far it has carried
// them), about a fifth of the sea under them in the trades, closing in for a
// storm (farCover)
float tradeCumulus(vec2 xz, vec2 wind, vec2 windDir, float farCover) {
  vec2 wd = normalize(windDir + vec2(1e-4));
  vec2 r = xz - wind;
  vec2 q = vec2(dot(r, wd) / 70.0, dot(r, vec2(-wd.y, wd.x)) / 26.0);
  float n = seaVn(q) * 0.6 + seaVn(q * 2.1 + 7.0) * 0.3 + seaVn(q * 4.3) * 0.1;
  return smoothstep(0.6, 0.85, n + (farCover - 0.32) * 0.5) * 0.85;
}
`,Wn=`
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
uniform vec2 uCloudWind;        // how far the wind has carried the clouds
uniform vec2 uCloudWindDir;
uniform float uFarCover;        // the trade cumulus out over the open sea
uniform float uWetness;         // 0 dry .. 1 soaked (from recent rain overall)
uniform sampler2D uSkyMap;      // equirect sky radiance, elevation squashed to the horizon

vec2 dirToSkyUv(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5);
}
vec3 skyMap(vec3 d) { return texture(uSkyMap, dirToSkyUv(d)).rgb; }

${oh}
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
  // and out on the open sea, under the cumulus there
  float open = openSea(xz);
  if (open > 0.0) c = max(c, tradeCumulus(xz, uCloudWind, uCloudWindDir, uFarCover) * open);
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
`,ah=`
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
`,wg=`
${Ne}
${un}
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
`,Sg=`
${Ne}
${Vn}
${un}
${Wn}
${ah}
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
`,Xl=32,Ii=7,Yl=1600;class bg{constructor(t,e){this.heights=t.height,this.N=yn,this.leafSize=Zt/2**(Ii-1),this.range0=22,this.buildMinMax();const n=new Jn(t.height,yn,yn,Vi,gn);n.minFilter=fe,n.magFilter=fe,n.needsUpdate=!0,this.heightTex=n;const i=new Jn(t.normals,yn,yn,ke,sn);i.minFilter=mi,i.magFilter=ie,i.generateMipmaps=!0,i.anisotropy=8,i.needsUpdate=!0,this.normalTex=i,this.full=this.makeGrid(Xl),this.half=this.makeGrid(Xl/2),this.morph=[];for(let r=0;r<8;r++)this.morph.push(new Dt);const o={...e.uniforms,uHeight:{value:n},uNormal:{value:i},uMorph:{value:this.morph},uCamPos:{value:new V},uDebug:{value:0}};this.uniforms=o,this.group=new hn;for(const r of[this.full,this.half])r.material=new xe({vertexShader:wg,fragmentShader:Sg,uniforms:{...o,uGrid:{value:r.dim}}}),r.mesh=new Qt(r.geometry,r.material),r.mesh.frustumCulled=!1,r.mesh.matrixAutoUpdate=!1,this.group.add(r.mesh);this._frustum=new Ls,this._m=new jt,this._box=new wn,this.setRange(this.range0)}makeGrid(t){const e=new sh,n=new Float32Array((t+1)*(t+1)*3);for(let a=0;a<=t;a++)for(let l=0;l<=t;l++){const c=(a*(t+1)+l)*3;n[c]=l/t,n[c+2]=a/t}const i=[];for(let a=0;a<t;a++)for(let l=0;l<t;l++){const c=a*(t+1)+l,h=c+1,f=c+t+1,u=f+1;l+a&1?i.push(c,f,h,h,f,u):i.push(c,f,u,c,u,h)}e.setIndex(i),e.setAttribute("position",new ue(n,3));const o=new Float32Array(Yl*4),r=new Nn(o,4);return r.setUsage(Wi),e.setAttribute("aNode",r),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:r,count:0}}buildMinMax(){const t=this.N,e=2**(Ii-1),n=t/e;this.mm=[];let i=new Float32Array(e*e),o=new Float32Array(e*e);for(let a=0;a<e;a++)for(let l=0;l<e;l++){let c=1/0,h=-1/0;for(let f=a*n;f<=Math.min(t-1,(a+1)*n);f++)for(let u=l*n;u<=Math.min(t-1,(l+1)*n);u++){const d=this.heights[f*t+u];d<c&&(c=d),d>h&&(h=d)}i[a*e+l]=c,o[a*e+l]=h}this.mm.push({lo:i,hi:o,n:e});let r=e;for(;r>1;){const a=r/2,l=new Float32Array(a*a),c=new Float32Array(a*a);for(let h=0;h<a;h++)for(let f=0;f<a;f++){const u=2*h*r+2*f;l[h*a+f]=Math.min(i[u],i[u+1],i[u+r],i[u+r+1]),c[h*a+f]=Math.max(o[u],o[u+1],o[u+r],o[u+r+1])}i=l,o=c,r=a,this.mm.push({lo:i,hi:o,n:r})}}setRange(t){this.rangeGoal===void 0&&this.applyRange(t),this.rangeGoal=t}applyRange(t){this.range0=t,this.ranges=[];for(let e=0;e<Ii;e++)this.ranges.push(t*2**e);this.ranges[Ii-1]=1e6;for(let e=0;e<Ii;e++){const n=this.ranges[e],i=e>0?this.ranges[e-1]:0,o=i+(n-i)*.5;this.morph[e].set(o,n*.97)}}heightAt(t,e){return this.metresAt(t,e)*Nt}metresAt(t,e){const n=this.N;let i=(t+pt)/Zt*n-.5,o=(e+pt)/Zt*n-.5;i<0&&(i=0),o<0&&(o=0),i>n-1.001&&(i=n-1.001),o>n-1.001&&(o=n-1.001);const r=i|0,a=o|0,l=i-r,c=o-a,h=this.heights,f=a*n+r,u=h[f]+(h[f+1]-h[f])*l,d=h[f+n]+(h[f+n+1]-h[f+n])*l;return u+(d-u)*c}normalAt(t,e,n=new V){const i=Zt/this.N,o=this.heightAt(t+i,e)-this.heightAt(t-i,e),r=this.heightAt(t,e+i)-this.heightAt(t,e-i);return n.set(-o,2*i,-r).normalize()}update(t){Math.abs(this.rangeGoal-this.range0)>.01&&this.applyRange(this.range0+(this.rangeGoal-this.range0)*.04),this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.uniforms.uCamPos.value.copy(t.position),this.full.count=0,this.half.count=0,this.select(0,0,Ii-1);for(const e of[this.full,this.half])e.geometry.instanceCount=e.count,e.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],o=this.leafSize*2**n,r=-pt+t*o,a=-pt+e*o,l=i.lo[e*i.n+t]*Nt,c=i.hi[e*i.n+t]*Nt;return this._box.min.set(r,l,a),this._box.max.set(r+o,c,a+o),this._box}select(t,e,n){const i=this.nodeBox(t,e,n),o=this.mm[n];if(o.hi[e*o.n+t]<-45)return!0;if(i.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(i))return!0;const r=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,r,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,r,n),!0;for(let a=0;a<4;a++){const l=t*2+(a&1),c=e*2+(a>>1);if(!this.select(l,c,n-1)){const h=this.mm[n-1];if(h.hi[c*h.n+l]<-45)continue;const f=this.nodeBox(l,c,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,c,r/2,n)}}return!0}emit(t,e,n,i,o){if(t.count>=Yl)return;const r=t.count*4;t.data[r]=-pt+e*i,t.data[r+1]=-pt+n*i,t.data[r+2]=i,t.data[r+3]=o,t.count++}}const kn={cycle:140,speed:.05},Va=s=>s.toFixed(4),Eg=`
uniform float uSwellT;
float swellHash(float n, float a, float b, float c) {
  float m = mod(n, 101.0);
  return mod(m * m * a + m * b + c, 101.0) / 101.0;
}
// number of waves, seconds between them, and the first one's arrival in its cycle
vec3 swellSet(float n) {
  return vec3(3.0 + floor(swellHash(n, 37.0, 11.0, 5.0) * 4.0), 12.0 + 4.0 * swellHash(n, 23.0, 61.0, 17.0), 12.0 * swellHash(n, 53.0, 7.0, 29.0));
}
float swellHeight(float n, float k) {
  return 0.5 + 0.5 * swellHash(n * 7.0 + k * 13.0, 41.0, 3.0, 71.0);
}
// the swell clock where a wave line reaches xz: later the further it has come
float swellTime(vec2 xz, vec2 sd) {
  return uSwellT - dot(xz, sd) / ${Va(kn.speed)};
}
// (seconds since the latest set wave arrived, its height, seconds until the next)
vec3 swellAt(float t) {
  const float L = ${Va(kn.cycle)};
  float n = floor(t / L);
  float u = t - n * L;
  vec3 s = swellSet(n);
  float k = floor((u - s.z) / s.y);
  if (k >= 0.0) {
    k = min(k, s.x - 1.0);
    float next = k + 1.0 < s.x ? s.z + (k + 1.0) * s.y - u : L + swellSet(n + 1.0).z - u;
    return vec3(u - s.z - k * s.y, swellHeight(n, k), next);
  }
  vec3 p = swellSet(n - 1.0);
  return vec3(u + L - p.z - (p.x - 1.0) * p.y, swellHeight(n - 1.0, p.x - 1.0), s.z - u);
}
// slope of a set wave's profile against time: a steep face ahead of the crest
// (a < 0, still to come), a long gentle back behind it
float swellRidge(float a) {
  float w = a < 0.0 ? 1.3 : 3.5;
  return -2.0 * a / (w * w) * exp(-a * a / (w * w));
}
`,Tg=`
${Ne}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,Ag=`
${Ne}
${Vn}
${un}
${Wn}
${ah}
${Eg}
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
  // set waves feel the bottom on the way in: long low lines that rise toward
  // the reef and are gone once they have broken on it
  vec2 sd = normalize(uSwellDir + 1e-4);
  float shoal = smoothstep(1.5, 4.0, depth) * (1.0 - smoothstep(8.0, 45.0, depth)) * (1.0 - sea.r);
  // (out in deep water, and in the shallows inside the reef, there is nothing to look up)
  vec3 sw = vec3(99.0, 0.0, 99.0);
  if (shoal > 0.0) {
    sw = swellAt(swellTime(xz, sd));
    g -= sd * (swellRidge(sw.x) * sw.y + swellRidge(-sw.z)) * shoal * (0.014 / ${Va(kn.speed)});
  }
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
  // between sets, small waves still spill over the crest here and there...
  float ripple = 0.5 + 0.5 * sin(dot(xz, sd) * 2.2 - uTime * 0.9 + fbm2(xz * 0.8) * 5.0);
  float small = crest * (0.16 + 0.24 * smoothstep(0.5, 0.95, ripple));
  // ...and a set wave stands up where the reef edge shoals to about 3 m, as
  // its line sweeps along it (which is what makes a break peel), and rolls on
  // in as white water: solid just behind the front, thinning out behind it
  float edge = smoothstep(2.5, 9.0, drop) * (1.0 - smoothstep(2.6, 3.6, depth)) * (1.0 - sea.r);
  float age = sw.x;
  float big = 0.0;
  if (edge > 0.0) {
    // a ragged front, not a ruler line: the clock is jittered here at every
    // scale down to a few metres (the finer ones faded out before they would
    // shimmer), so the front runs ahead of its line in places as well as
    // behind it; mostly behind, so whoever rides just ahead of the line
    // (life.js) stays out in front of the white water
    float j = (fbm2(xz * 4.0) - 0.5) * 1.6 + (vnoise(xz * 22.0) - 0.5) * 0.5 - 0.5;
    j += (vnoise(xz * 13.0 + 7.1) - 0.5) * 0.9 * (1.0 - smoothstep(0.015, 0.05, px));
    j += (vnoise(xz * 55.0 + 3.7) - 0.5) * 0.8 * (1.0 - smoothstep(0.004, 0.012, px));
    vec3 swj = swellAt(swellTime(xz, sd) + j);
    age = swj.x;
    float burst = smoothstep(-0.3, 0.2, age) * (1.0 - smoothstep(1.0, 5.5, age)) * (0.6 + 0.4 * exp(-age * 0.7));
    big = edge * burst * smoothstep(0.3, 0.8, swj.y) * (0.6 + uSwell) * 1.6;
  }
  float breakers = small * (0.6 + uSwell);
  float foamTex = smoothstep(0.35, 0.75, fbm2(xz * 9.0 + vec2(uTime * 0.3, 0.0)));
  // whitecaps when the trades are up
  float caps = smoothstep(0.78, 0.92, fbm2(xz * 0.9 + uWind * uTime * 0.06)) * smoothstep(0.55, 1.1, length(uWind)) * smoothstep(20.0, 60.0, depth);
  float foam = max(max(max(shore * swash * 0.9, breakers), caps * 0.5) * mix(1.0, foamTex, 0.5), big * mix(1.0, foamTex, 0.3 + 0.5 * smoothstep(0.8, 4.0, age)));
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
`,jl=(s,t)=>s-t*Math.floor(s/t),ko=(s,t,e,n)=>{const i=jl(s,101);return jl(i*i*t+i*e+n,101)/101},$l=s=>3+Math.floor(ko(s,37,11,5)*4),Kl=s=>12+4*ko(s,23,61,17),_a=s=>12*ko(s,53,7,29),Zl=(s,t)=>.5+.5*ko(s*7+t*13,41,3,71);function lo(s,t){const e=kn.cycle,n=Math.floor(s/e),i=s-n*e,o=$l(n),r=Kl(n),a=_a(n);let l=Math.floor((i-a)/r);if(l>=0)l=Math.min(l,o-1),t.age=i-a-l*r,t.height=Zl(n,l),t.next=l+1<o?a+(l+1)*r-i:e+_a(n+1)-i,t.id=n*8+l;else{const c=$l(n-1);t.age=i+e-_a(n-1)-(c-1)*Kl(n-1),t.height=Zl(n-1,c-1),t.next=a-i,t.id=(n-1)*8+c-1}return t}function Cg(s,t,e,n){const i=[0,0,0];for(let a=0;a<=n;a++){const l=s*Math.pow(t/s,a/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const o=[];for(let a=0;a<e;a++)o.push(0,1+(a+1)%e,1+a);for(let a=0;a<n;a++)for(let l=0;l<e;l++){const c=1+a*e+l,h=1+a*e+(l+1)%e,f=c+e,u=h+e;o.push(c,h,f,h,u,f)}const r=new be;return r.setAttribute("position",new ne(i,3)),r.setIndex(o),r}class Rg{constructor(t,e,n){this.uniforms={...t.uniforms,uHeight:{value:e},uSea:{value:n},uCamPos:{value:new V},uWind:{value:new Dt(-.8,.45)},uSwellDir:{value:new Dt(-.6,.8)},uSwell:{value:.6},uSwellT:{value:0},uDebug:{value:0},uHorizonColor:{value:new Pt},uZenithColor:{value:new Pt}};const i=Cg(1.5,8e3,96,72);this.material=new xe({vertexShader:Tg,fragmentShader:Ag,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new Qt(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,this.swellT=0;const o=this.uniforms.uSwellDir.value,r=Math.hypot(o.x+1e-4,o.y+1e-4);this.swellDir=[(o.x+1e-4)/r,(o.y+1e-4)/r]}swellTimeAt(t,e){return this.swellT-(t*this.swellDir[0]+e*this.swellDir[1])/kn.speed}update(t,e=0){this.swellT+=e,this.uniforms.uSwellT.value=this.swellT,this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const Pg=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],Lg={ra:12.857,dec:27.13};function Ji(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function Rn(s,t,e=0){let n=Math.imul(s|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const Dg=.5*(Math.sqrt(3)-1),us=(3-Math.sqrt(3))/6,zi=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1,.7071,.7071,-.7071,.7071,.7071,-.7071,-.7071,-.7071]);function Jl(s){const t=Ji(s),e=new Uint8Array(256);for(let o=0;o<256;o++)e[o]=o;for(let o=255;o>0;o--){const r=Math.floor(t()*(o+1)),a=e[o];e[o]=e[r],e[r]=a}const n=new Uint8Array(512),i=new Uint8Array(512);for(let o=0;o<512;o++)n[o]=e[o&255],i[o]=n[o]%12;return function(r,a){const l=(r+a)*Dg,c=Math.floor(r+l),h=Math.floor(a+l),f=(c+h)*us,u=r-(c-f),d=a-(h-f);let x,g;u>d?(x=1,g=0):(x=0,g=1);const m=u-x+us,p=d-g+us,_=u-1+2*us,v=d-1+2*us,y=c&255,T=h&255;let w=0,E=.5-u*u-d*d;if(E>0){const S=i[y+n[T]]*2;E*=E,w+=E*E*(zi[S]*u+zi[S+1]*d)}let A=.5-m*m-p*p;if(A>0){const S=i[y+x+n[T+g]]*2;A*=A,w+=A*A*(zi[S]*m+zi[S+1]*p)}let M=.5-_*_-v*v;if(M>0){const S=i[y+1+n[T+1]]*2;M*=M,w+=M*M*(zi[S]*_+zi[S+1]*v)}return 70*w}}function Ug(s,t,e,n,i=.5){let o=0,r=1,a=0,l=1;for(let c=0;c<n;c++)o+=r*s(t*l,e*l),a+=r,r*=i,l*=2.03;return o/a}const xo=(s,t,e)=>s<t?t:s>e?e:s,Ql=(s,t,e)=>{const n=xo((e-s)/(t-s),0,1);return n*n*(3-2*n)},Fg=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function No(){const s=new be;return s.setAttribute("position",new ue(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const Ig=`
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
`;class zg{constructor(t){this.renderer=t,this.size=new Dt;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Hn:sn,this.sceneRT=new on(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new ir(1,1,In),this.quad=new Qt(No(),new xe({vertexShader:Fg,fragmentShader:Ig,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Dt},uInvProj:{value:new jt},uCamWorld:{value:new jt},uCamPos:{value:new V},uSunDir:{value:new V(0,1,0)},uSunColor:{value:new Pt},uFogColor:{value:new Pt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Zi,this.quadScene.add(this.quad),this.quadCam=new Ds(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Un=Math.PI/180,gs=21*Un,co=29.530588,kg=224.1,Ng=["Hilo","Hoaka","Kūkahi","Kūlua","Kūkolu","Kūpau","ʻOlekūkahi","ʻOlekūlua","ʻOlekūkolu","ʻOlepau","Huna","Mōhalu","Hua","Akua","Hoku","Māhealani","Kulu","Lāʻaukūkahi","Lāʻaukūlua","Lāʻaupau","ʻOlekūkahi","ʻOlekūlua","ʻOlepau","Kāloakūkahi","Kāloakūlua","Kāloapau","Kāne","Lono","Mauli","Muku"];function tc(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),o=Math.sin(s)*Math.cos(gs)-n*Math.cos(t)*Math.sin(gs),r=Math.sin(s)*Math.sin(gs)+n*Math.cos(t)*Math.cos(gs);return e.set(i,r,-o)}function rh(s,t,e={}){const n=23.44*Un*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*Un,r=((s-80)/365.25*24%24+24)%24+t-12;e.sun=tc(n,(t-12)*15*Un,e.sun||new V);const a=s+t/24,l=((a-kg)%co+co)%co,c=l/co,h=i+c*2*Math.PI,f=Math.asin(Math.sin(23.44*Un)*Math.sin(h)+Math.sin(5.1*Un)*Math.sin(a*.23)),u=h/(2*Math.PI)*24;return e.moon=tc(f,(r-u)*15*Un,e.moon||new V),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=r,e.decl=n,e}const lh=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],ch=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],Og=1.6110731556870734,Bg=1.5;function Hg(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((Og-Math.acos(s))/Bg)))}function Ma(s,t,e,n=[0,0,0]){const i=Hg(t.y),o=.2*e.turbidity*1e-17,r=Math.acos(Math.max(0,s.y)),a=1/(Math.cos(r)+.15*Math.pow(93.885-r*180/Math.PI,-1.253)),l=8400*a,c=1250*a,h=s.x*t.x+s.y*t.y+s.z*t.z,f=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),u=e.mieDirectionalG,d=u*u,x=1/(4*Math.PI)*((1-d)/Math.pow(1-2*u*h+d,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let m=0;m<3;m++){const p=lh[m]*e.rayleigh,_=.434*o*ch[m]*e.mieCoefficient,v=Math.exp(-(p*l+_*c)),y=(p*f+_*x)/(p+_);let T=Math.pow(i*y*(1-v),1.5);T*=1+(Math.pow(i*y*v,.5)-1)*g;const w=.1*v,E=(T+w)*.04+[0,3e-4,75e-5][m];n[m]=Math.pow(E,1/2.4)}return n}function Gg(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let r=0;r<3;r++){const a=lh[r]*t.rayleigh,l=.434*o*ch[r]*t.mieCoefficient;e[r]=Math.exp(-(a*8400*i+l*1250*i))}return e}const Vg=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,hh=`
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
`,Wg=`
${hh}
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
`,qg=`
${hh}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,Xg=`
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
`,Yg=`
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
`;class jg{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=Lg,e=(c,h)=>{const f=c/24*2*Math.PI,u=h*Un;return new V(Math.cos(u)*Math.cos(f),Math.cos(u)*Math.sin(f),Math.sin(u))};this.uniforms={uSun:{value:new V(0,1,0)},uMoon:{value:new V(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:gs},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new Qt(new ar(1,5),new xe({vertexShader:Vg,fragmentShader:Wg,uniforms:this.uniforms,side:Ve,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=Ji(4242),o=Pg.map(([c,h,f])=>[c/24*2*Math.PI,h*Un,f]);for(let c=0;c<2600;c++){const h=i()*2-1;o.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const r=new Float32Array(o.length*3);o.forEach((c,h)=>r.set(c,h*3));const a=new be;a.setAttribute("aStar",new ue(r,3)),a.setAttribute("position",new ue(new Float32Array(o.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new th(a,new xe({vertexShader:Xg,fragmentShader:Yg,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:Ra})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new hn,this.group.add(n,this.stars),this.mapRT=new on(256,128,{type:Hn,depthBuffer:!1}),this.mapRT.texture.wrapS=pi,this.mapScene=new Zi;const l=new Qt(No(),new xe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:qg,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new Ds(-1,1,1,-1,0,1),this.astro={},this._v=new V}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const o=rh(t,e,this.astro),r=o.sun,a=this.uniforms;a.uSun.value.copy(r),a.uMoon.value.copy(o.moon),a.uPhase.value=o.phase,a.uIllum.value=o.illum,a.uLst.value=o.lst/24*2*Math.PI;const l=_n.smoothstep(-r.y,-.02,.2);a.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,f=Ma(h.set(0,1,0),r,c),u=[0,0,0];for(let w=0;w<8;w++){const E=w/8*Math.PI*2,A=Ma(h.set(Math.cos(E),.08,Math.sin(E)).normalize(),r,c);for(let M=0;M<3;M++)u[M]+=A[M]/8}const d=Ma(h.set(r.x,.05,r.z).normalize(),r,c),x=Gg(r,c),g=_n.smoothstep(r.y,-.04,.06),m=3.2;i.sunColor.setRGB(x[0]*m*g,x[1]*m*g,x[2]*m*g);const p=[.0035,.005,.011],v=_n.smoothstep(o.moon.y,-.02,.1)*o.illum*l;i.skyColor.setRGB(f[0]*.55+u[0]*.45+p[0]+.012*v,f[1]*.55+u[1]*.45+p[1]+.016*v,f[2]*.55+u[2]*.45+p[2]+.024*v);const y=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Pt(y,y,y),.35),i.zenith.setRGB(f[0],f[1],f[2]),i.horizon.setRGB(u[0]+p[0],u[1]+p[1],u[2]+p[2]),i.sunHorizon.setRGB(d[0],d[1],d[2]);const T=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,r.y)+i.skyColor.r)*T*1.1,(i.sunColor.g*Math.max(0,r.y)+i.skyColor.g)*T,(i.sunColor.b*Math.max(0,r.y)+i.skyColor.b)*T*.8),i.moonColor.setRGB(.05*v,.06*v,.085*v),i.moonDir.copy(o.moon),i.sunDir.copy(r),i.night=l,o}}const ya=Math.PI*2,$g=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,ec=s=>((s+Math.PI)%ya+ya)%ya-Math.PI;class Kg{constructor(t,e,n){this.camera=t,this.dom=e,this.terrain=n,this.state={target:new V(0,0,20),distance:420,yaw:.35,pitch:.62,lift:0},this.goal={target:this.state.target.clone(),distance:420,yaw:.35,pitch:.62,lift:0},this.flight=null,this.floor=0,this.minDistance=.5,this.maxDistance=900,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new yg,this._v=new V,this.bind()}bind(){const t=this.dom,e=new Map;let n=null,i=null,o=null;t.addEventListener("contextmenu",a=>a.preventDefault()),t.addEventListener("pointerdown",a=>{this.enabled&&(t.setPointerCapture(a.pointerId),e.set(a.pointerId,{x:a.clientX,y:a.clientY}),e.size===1?(n=a.button===2||a.shiftKey||a.ctrlKey||a.metaKey?"pan":"orbit",i={x:a.clientX,y:a.clientY},this.panAnchor=n==="pan"?this.pickGround(a.clientX,a.clientY):null):e.size===2&&(n="pinch",o=this.pinchState(e)),this.touch())}),t.addEventListener("pointermove",a=>{if(e.has(a.pointerId)){if(e.set(a.pointerId,{x:a.clientX,y:a.clientY}),n==="orbit"&&i){const l=a.clientX-i.x,c=a.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=_n.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:a.clientX,y:a.clientY},this.touch()}else if(n==="pan"&&i)this.panBy(a.clientX-i.x,a.clientY-i.y),i={x:a.clientX,y:a.clientY},this.touch();else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=o.dist/Math.max(20,l.dist);this.goal.distance=_n.clamp(this.goal.distance*c,this.minDistance,this.maxDistance),this.panBy(l.cx-o.cx,l.cy-o.cy),this.goal.yaw-=ec(l.angle-o.angle),this.goal.pitch=_n.clamp(this.goal.pitch+(l.cy-o.cy)*0,.06,1.52),o=l,this.touch()}}});const r=a=>{if(e.delete(a.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="orbit",i={...l}}};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("wheel",a=>{if(!this.enabled)return;a.preventDefault();const l=Math.exp(Math.sign(a.deltaY)*Math.min(Math.abs(a.deltaY),120)*.0018);this.zoomAt(a.clientX,a.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",a=>{const l=this.pickGround(a.clientX,a.clientY);l&&this.flyTo({target:l,distance:Math.max(6,this.goal.distance*.45)},1.6)}),addEventListener("keydown",a=>{var h,f;if(!this.enabled||(f=(h=a.target).closest)!=null&&f.call(h,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]}[a.code];if(c&&!a.altKey){const u=Math.sin(this.goal.yaw),d=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*d+c[1]*u)*l,this.goal.target.z+=(-c[0]*u+c[1]*d)*l,this.touch()}a.code==="KeyQ"&&(this.goal.yaw+=.12),a.code==="KeyE"&&(this.goal.yaw-=.12),(a.code==="Equal"||a.code==="NumpadAdd")&&(this.goal.distance*=.85),(a.code==="Minus"||a.code==="NumpadSubtract")&&(this.goal.distance/=.85)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,o=Math.sin(this.goal.yaw),r=Math.cos(this.goal.yaw),a=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*r-e*o*a)*i,this.goal.target.z+=(t*o-e*r*a)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),o=this.goal.distance,r=_n.clamp(o*n,this.minDistance,this.maxDistance);if(i&&r<o){const a=1-r/o;this.goal.target.lerp(i,a)}this.goal.distance=r}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Dt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e,n=3e3){const i=(l,c)=>Math.max(0,this.terrain.heightAt(l,c));let o=0,r=0,a=this._v;for(let l=0;l<400&&o<n;l++){a.copy(t).addScaledVector(e,o);const c=a.y-i(a.x,a.z);if(c<0){let h=r,f=o;for(let u=0;u<20;u++){const d=(h+f)/2;a.copy(t).addScaledVector(e,d),a.y-i(a.x,a.z)<0?f=d:h=d}return a.clone()}r=o,o+=Math.max(.03,c*.45,o*.002)}return null}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},o={target:t.target?t.target.clone():i.target.clone(),distance:t.distance??i.distance,yaw:t.yaw??i.yaw,pitch:t.pitch??i.pitch,lift:t.lift??0};o.yaw=i.yaw+ec(o.yaw-i.yaw);const r=i.target.distanceTo(o.target),a=n.hop??Math.max(0,r*.9-Math.max(i.distance,o.distance)*.6);this.flight={from:i,dest:o,t:0,duration:e,hop:a,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}update(t){var o;const e=this.goal;if(this.flight){const r=this.flight;r.t=Math.min(1,r.t+t/r.duration);const a=$g(r.t);e.target.lerpVectors(r.from.target,r.dest.target,a);const l=Math.log(r.from.distance)*(1-a)+Math.log(r.dest.distance)*a;e.distance=Math.exp(l)+r.hop*Math.sin(Math.PI*a),e.yaw=r.from.yaw+(r.dest.yaw-r.from.yaw)*a,e.pitch=r.from.pitch+(r.dest.pitch-r.from.pitch)*a+.25*Math.sin(Math.PI*a)*Math.min(1,r.hop/80),e.lift=r.from.lift+(r.dest.lift-r.from.lift)*a,r.t>=1&&(this.flight=null,(o=r.onDone)==null||o.call(r))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);if(e.target.x=_n.clamp(e.target.x,-pt*1.3,pt*1.3),e.target.z=_n.clamp(e.target.z,-pt*1.3,pt*1.3),!this.flight){const r=Math.max(0,this.terrain.heightAt(e.target.x,e.target.z));e.target.y+=(r-e.target.y)*(1-Math.exp(-t*6))}const n=this.state,i=this.flight?1:1-Math.exp(-t*7);n.target.lerp(e.target,i),n.distance+=(e.distance-n.distance)*i,n.yaw+=(e.yaw-n.yaw)*i,n.pitch+=(e.pitch-n.pitch)*i,n.lift+=(e.lift-n.lift)*i,this.apply(t)}groundAhead(t,e,n){const i=this.terrain;let o=i.heightAt(t,e);const r=this._prevXZ;if(r&&n>0){const a=(t-r.x)/n,l=(e-r.y)/n,c=Math.hypot(a,l),h=Math.min(2,c*.3);h>.005&&(o=Math.max(o,i.heightAt(t+a/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new Dt).set(t,e),Math.max(0,o)}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const o=.12+e.distance*.03,r=this.groundAhead(n.position.x,n.position.z,t),a=Math.max(0,r+o-n.position.y);t<=0?this.floor=a:this.floor+=(a-this.floor)*(1-Math.exp(-t*(a>this.floor?9:2.5))),n.position.y+=this.floor;const l=Math.max(0,this.terrain.heightAt(n.position.x,n.position.z));n.position.y=Math.max(n.position.y,l+Math.min(.04,o*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=_n.clamp(Math.min(c,e.distance)*.12,.02,4),n.far=9e3,n.updateProjectionMatrix()}}const Zg=`
${Ne}
${un}
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
`;class Jg{constructor(t,e=1024){this.rt=new on(e,e,{type:sn,depthBuffer:!1,minFilter:ie,magFilter:ie}),this.material=new xe({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Zg,uniforms:{uHeight:{value:t},uSunDir:{value:new V(0,1,0)}},depthTest:!1,depthWrite:!1}),this.scene=new Zi;const n=new Qt(No(),this.material);n.frustumCulled=!1,this.scene.add(n),this.cam=new Ds(-1,1,1,-1,0,1),this.last=new V(0,-2,0),this.size=e,this.strips=4,this.strip=-1}get texture(){return this.rt.texture}update(t,e,n=!1){if(n||!this.drawn){this.drawn=!0,this.draw(t,e,-1);return}if(this.strip<0){if(e.angleTo(this.last)<.004)return;this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e),this.strip=0}this.draw(t,null,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e,n){e&&(this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e));const i=this.rt;if(n>=0){const r=this.size/this.strips;i.scissor.set(0,n*r,this.size,r),i.scissorTest=!0}else i.scissorTest=!1;const o=t.getRenderTarget();t.setRenderTarget(i),t.render(this.scene,this.cam),t.setRenderTarget(o),i.scissorTest=!1}}const Qg=`
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
uniform float uFarCover;   // trade cumulus over the open sea
uniform float uOvercast;   // 0..1, a stratiform deck over everything (Kona storms)
uniform float uRainbow;    // 1 = rainbows on; also a debug gain
uniform float uSteps;
uniform float uLightSteps;
uniform float uFlash;      // lightning
uniform vec3 uFlashPos;
uniform float uFrame;      // frame counter, steps the sample offsets
uniform sampler2D uBowLUT;  // raindrop light near the bows (x = degrees from antisolar / 64; rows: showers, light rain, drizzle)
uniform sampler2D uShadow;  // terrain shadow from the sun, top-down
${un}
${oh}
in vec2 vUv;
// the transmittance-weighted mean distance of what the ray met, for reprojection
layout(location = 1) out highp vec4 cloudDepth;

// the bow table is drop optics (light relative to isotropic scattering); this
// one constant sets how strongly the app's rain veil, which already stands in
// for multiple scattering, carries it
#define BOW_GAIN 0.3
// how far (world y) rain shows up inside the cloud above its base
#define RAIN_REACH 3.2
// how far out (world units) the march goes
#define FAR 3000.0

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
// procedural trade cumulus beyond it. Out on the open sea the same cumulus
// fill in under the simulated cloud too, so the sea is dotted with them out
// to the horizon rather than clear past the island's own weather.
vec4 weather(vec2 xz) {
  vec2 uv = (xz - uWeatherRect.xy) / uWeatherRect.zw;
  vec4 w = texture(uWeather, uv);
  float edge = smoothstep(0.38, 0.49, max(abs(uv.x - 0.5), abs(uv.y - 0.5)));
  float open = openSea(xz);
  if (open > 0.0) {
    // trade cumulus line up in streets along the wind
    float far = tradeCumulus(xz, uWind, uWindDir, uFarCover);
    vec4 f = vec4(far, far > 0.55 ? (far - 0.55) * 0.5 : 0.0, 0.0, 0.0);
    w = mix(max(w, f * open), f, edge);
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
  cloudDepth = vec4(min(sceneDist, FAR));

  float yHi = uTop + 0.5;
  float yLo = 0.0;
  // slab intersection
  float t0, t1;
  if (abs(rd.y) < 1e-5) {
    if (uCamPos.y < yLo || uCamPos.y > yHi) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    t0 = 0.0; t1 = FAR;
  } else {
    float ta = (yLo - uCamPos.y) / rd.y;
    float tb = (yHi - uCamPos.y) / rd.y;
    t0 = max(0.0, min(ta, tb));
    t1 = max(ta, tb);
  }
  // (far enough that the cumulus over the sea run on to the horizon)
  t1 = min(t1, min(sceneDist, FAR));
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
  float fogK = 0.0008;
  float detailK = uSteps / 56.0;
  float t = t0 + jitter * clamp(t0 * 0.011 / detailK, 0.22, 7.0);
  // striding over empty air, then stepping back to walk into cloud at the
  // fine step, so where a ray meets cloud doesn't snap to the stride
  float tEmpty = -1.0;
  float tFine = -1.0;
  for (int i = 0; i < 260; i++) {
    if (t >= t1 || T < 0.03) break;
    // (and coarser still far out, where a cloud is a few pixels across)
    float dt = clamp(t * 0.011 / detailK, 0.22, max(7.0, t * 0.008));
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
`,t1=`
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
`,e1=.9,nc="out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",uh=512,fh=64;function n1(s){if(s>6)return 0;if(s<-7){const r=-s,a=2/3*r*Math.sqrt(r),l=a+Math.PI/4;return(Math.sin(l)-5/(72*a)*Math.cos(l))/(Math.sqrt(Math.PI)*Math.sqrt(Math.sqrt(r)))}const t=s*s*s;let e=1,n=s,i=1,o=s;for(let r=1;r<80&&(i*=t/((3*r-1)*(3*r)),o*=t/(3*r*(3*r+1)),e+=i,n+=o,!(Math.abs(i)+Math.abs(o)<1e-16));r++);return .355028053887817*e-.258819403792807*n}const dh=s=>1.3239+.003125/(s*s);function ph(s,t,e){const n=Math.sqrt(1-e*e),i=Math.sqrt(1-e*e/(s*s)),o=(n-s*i)/(n+s*i),r=(s*n-i)/(s*n+i),a=o*o,l=r*r;return .5*((1-a)**2*a**t+(1-l)**2*l**t)}function Ni(s,t,e){const n=Math.asin(e),i=Math.asin(e/s),o=2*(n-i)+t*(Math.PI-2*i);return t===1?Math.PI-o:o-Math.PI}function rr(s,t){const e=Math.sqrt(1-(s*s-1)/(t*(t+2))),n=2*e/Math.pow(1-e*e,1.5)-2*(t+1)*e/Math.pow(s*s-e*e,1.5);return{b:e,alpha:Ni(s,t,e),d2:Math.abs(n),eps:ph(s,t,e)}}const oi=(s,t,e,n)=>Math.exp(-.5*((s-t)/(s<t?e:n))**2),i1=s=>[1.056*oi(s,599.8,37.9,31)+.362*oi(s,442,16,26.7)-.065*oi(s,501.1,20.4,26.2),.821*oi(s,568.8,46.9,40.5)+.286*oi(s,530.9,16.3,31.1),1.217*oi(s,437,11.8,36)+.681*oi(s,459,26,13.8)],ic=([s,t,e])=>[3.2406*s-1.5372*t-.4986*e,-.9689*s+1.8758*t+.0415*e,.0557*s-.204*t+1.057*e],Wa=.25;function s1(s,t,e){const n=rr(s,t);let i=0;for(const[o,r]of[[1e-6,n.b],[n.b,1-1e-9]]){let a=o,l=r;const c=Ni(s,t,a)-e;if(c*(Ni(s,t,l)-e)>0)continue;for(let x=0;x<40;x++){const g=(a+l)/2;(Ni(s,t,g)-e)*c>0?a=g:l=g}const h=(a+l)/2,f=Math.max(h-1e-6,0),u=Math.min(h+1e-6,1),d=Math.abs(Ni(s,t,u)-Ni(s,t,f))/(u-f);i+=2*ph(s,t,h)*h/(d*Math.sin(e))}return i}function o1(){const s=dh(.55);return[1,2].map(t=>{const e=rr(s,t),n=new Float32Array(Math.ceil(fh/Wa)+1);for(let i=0;i<n.length;i++){const o=Math.max(i*Wa,.5)*Math.PI/180,r=t===1?e.alpha-o:e.alpha+o;if(r<=.01||r>=Math.PI-.01){n[i]=n[i-1]||1;continue}const a=e.eps*e.b*Math.cbrt(4)*Math.pow(e.d2,-2/3)*2/(Math.sqrt(o*Math.cbrt(2/e.d2))*Math.sin(r));n[i]=s1(s,t,r)/a}return n})}const Po=-20,qa=.01;function a1(){const s=new Float32Array(Math.round((6-Po)/qa)+2);for(let t=0;t<s.length;t++)s[t]=n1(Po+t*qa)**2;return s}function wa(s,t,e){const n=uh,i=fh/n,o=new Float32Array(n*3),r=[.6,.75,.9,1,1.1,1.25,1.45,1.7].map(_=>s*_),a=r.map(_=>Math.exp(-.5*(Math.log(_/s)/.3)**2)*_*_),l=a.reduce((_,v)=>_+v,0),c=new Float32Array(n),h=new Float32Array(n);for(let _=0;_<n;_++)c[_]=Math.max((_+.5)*i,1)*Math.PI/180,h[_]=1/Math.sin(c[_]);const f=[0,0,0],u=new Float32Array(n*3);for(let _=400;_<=700;_+=20){const v=i1(_);for(let T=0;T<3;T++)f[T]+=v[T];const y=dh(_/1e3);for(const T of[1,2]){const w=rr(y,T),E=t[T-1],A=T===1?1:-1;for(let M=0;M<r.length;M++){const S=2*Math.PI*r[M]*1e6/_,C=Math.cbrt(S),I=C*C*Math.cbrt(2/w.d2),k=w.eps*w.b*Math.cbrt(4)*C*Math.pow(w.d2,-2/3)*4*Math.PI*(a[M]/l);for(let b=T===1?0:n-1;b>=0&&b<n;b+=A){const R=(w.alpha-c[b])*A,N=-R*I;if(N>6)break;let G;if(N<Po)G=1/(2*Math.PI*Math.sqrt(-N));else{const z=(N-Po)/qa,P=Math.floor(z);G=e[P]+(e[P+1]-e[P])*(z-P)}let D=k*G*h[b];if(R>0){const z=Math.min(E.length-1.001,R*180/Math.PI/Wa),P=Math.floor(z);D*=E[P]+(E[P+1]-E[P])*(z-P)}u[b*3]+=D*v[0],u[b*3+1]+=D*v[1],u[b*3+2]+=D*v[2]}}}}const d=ic(f),x=Math.ceil(.2665/i),g=[];for(let _=-x;_<=x;_++)g.push(Math.sqrt(Math.max(0,1-(_*i/.2665)**2)));const m=g.reduce((_,v)=>_+v,0),p=[0,0,0];for(let _=0;_<n;_++){p.fill(0);for(let A=-x;A<=x;A++){const M=Math.min(n-1,Math.max(0,_+A));for(let S=0;S<3;S++)p[S]+=u[M*3+S]*g[A+x]/m}const v=ic(p).map((A,M)=>A/d[M]),y=.2126*v[0]+.7152*v[1]+.0722*v[2],T=Math.min(v[0],v[1],v[2]),w=T<0?y/Math.max(y-T,1e-6):1,E=1-Math.min(1,Math.max(0,((_+.5)*i-58)/5));for(let A=0;A<3;A++)o[_*3+A]=Math.max(0,y+(v[A]-y)*w)*E}return o}function r1(){performance.now();const s=o1(),t=a1(),e=[wa(.5,s,t),wa(.15,s,t),wa(.05,s,t)],n=uh,i=new Uint16Array(n*3*4),o=hl.toHalfFloat(1);for(let a=0;a<3;a++)for(let l=0;l<n;l++){const c=(a*n+l)*4;for(let h=0;h<3;h++)i[c+h]=hl.toHalfFloat(e[a][l*3+h]);i[c+3]=o}const r=new Jn(i,n,3,ke,Hn);return r.minFilter=r.magFilter=ie,r.wrapS=r.wrapT=$e,r.needsUpdate=!0,r}class l1{constructor(t){const e=new ka(t.shape,t.shapeSize,t.shapeSize,t.shapeSize);e.format=Vi,e.minFilter=ie,e.magFilter=ie,e.wrapS=e.wrapT=e.wrapR=pi,e.unpackAlignment=1,e.needsUpdate=!0;const n=new ka(t.detail,t.detailSize,t.detailSize,t.detailSize);n.format=Vi,n.minFilter=ie,n.magFilter=ie,n.wrapS=n.wrapT=n.wrapR=pi,n.unpackAlignment=1,n.needsUpdate=!0,this.scale=.5;const i={type:Hn,depthBuffer:!1};this.march=new Zu(1,1,2,i),this.march.texture[1].format=Vi,this.history=[new on(1,1,i),new on(1,1,i)],this.current=0,this.frame=0,this.fresh=!0,this.prev={viewProj:new jt,pos:new V,fwd:new V,sun:new V,wind:new Dt},this._fwd=new V,this.uniforms={uDepth:{value:null},uWeather:{value:null},uShape:{value:e},uDetail:{value:n},uWeatherRect:{value:new ve},uInvProj:{value:new jt},uCamWorld:{value:new jt},uCamPos:{value:new V},uSunDir:{value:new V},uSunColor:{value:new Pt},uSkyColor:{value:new Pt},uGroundColor:{value:new Pt},uFogColor:{value:new Pt},uMoonDir:{value:new V},uMoonColor:{value:new Pt},uWind:{value:new Dt},uWindDir:{value:new Dt(1,0)},uTime:{value:0},uBase:{value:8},uTop:{value:28},uDensity:{value:1},uFarCover:{value:.32},uOvercast:{value:0},uRainbow:{value:1},uBowLUT:{value:r1()},uShadow:{value:null},uHeight:{value:null},uSteps:{value:56},uLightSteps:{value:4},uFlash:{value:0},uFlashPos:{value:new V},uFrame:{value:0}},this.material=new xe({vertexShader:nc,fragmentShader:Qg,uniforms:this.uniforms,depthTest:!1,depthWrite:!1});const o=No();this.scene=new Zi;const r=new Qt(o,this.material);r.frustumCulled=!1,this.scene.add(r),this.resolve=new xe({vertexShader:nc,fragmentShader:t1,uniforms:{uCur:{value:this.march.texture[0]},uCurDepth:{value:this.march.texture[1]},uHistory:{value:null},uPrevViewProj:{value:new jt},uInvProj:this.uniforms.uInvProj,uCamWorld:this.uniforms.uCamWorld,uCamPos:this.uniforms.uCamPos,uDrift:{value:new V},uBlend:{value:0}},depthTest:!1,depthWrite:!1}),this.resolveScene=new Zi;const a=new Qt(o,this.resolve);a.frustumCulled=!1,this.resolveScene.add(a),this.cam=new Ds(-1,1,1,-1,0,1),this.enabled=!0}get rt(){return this.history[this.current]}get texture(){return this.rt.texture}setSize(t,e){this.full=[t,e];const n=Math.max(1,Math.floor(t*this.scale)),i=Math.max(1,Math.floor(e*this.scale));this.march.setSize(n,i);for(const o of this.history)o.setSize(n,i);this.fresh=!0}setScale(t){Math.abs(t-this.scale)<.001||(this.scale=t,this.full&&this.setSize(...this.full))}isCut(t){const e=this.prev,n=t.getWorldDirection(this._fwd),i=t.position,o=this.fresh||i.distanceTo(e.pos)>.5+.25*Math.max(0,i.y)||n.dot(e.fwd)<.85||this.uniforms.uSunDir.value.dot(e.sun)<.9995;return e.pos.copy(i),e.fwd.copy(n),e.sun.copy(this.uniforms.uSunDir.value),this.fresh=!1,o}render(t,e,n){const i=this.uniforms,o=this.isCut(e);i.uDepth.value=n,i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.frame=(this.frame+1)%4096,i.uFrame.value=this.frame,t.setRenderTarget(this.march),t.render(this.scene,this.cam);const r=this.resolve.uniforms,a=this.prev;r.uBlend.value=o?0:i.uFlash.value>.02?.5:e1,r.uPrevViewProj.value.copy(a.viewProj),r.uDrift.value.set(i.uWind.value.x-a.wind.x,0,i.uWind.value.y-a.wind.y),r.uHistory.value=this.history[this.current].texture,this.current^=1,t.setRenderTarget(this.history[this.current]),t.render(this.resolveScene,this.cam),a.viewProj.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),a.wind.copy(i.uWind.value)}}const Xa={moae:{name:"Moaʻe",gloss:"trade winds",bearing:62,speed:8.5,humidity:1,lcl:650,inversion:2e3,patch:1,convect:.55},kona:{name:"Kona",gloss:"southerly storm",bearing:205,speed:11,humidity:1.45,lcl:420,inversion:3800,patch:1.6,convect:.8},malie:{name:"Mālie",gloss:"calm, sea breezes",bearing:110,speed:2.4,humidity:.85,lcl:900,inversion:2900,patch:.5,convect:1.5}},We=160,fs=Zt*1.8;class c1{constructor(t,e,n=7){this.G=We,this.span=fs,this.cell=fs/We,this.origin=-fs/2;const i=We*We;this.terrain=new Float32Array(i),this.land=new Float32Array(i),this.heat=new Float32Array(i);for(let o=0;o<We;o++)for(let r=0;r<We;r++){const a=this.origin+(r+.5)*this.cell,l=this.origin+(o+.5)*this.cell;let c=0,h=0,f=0;for(let d=-1;d<=1;d++)for(let x=-1;x<=1;x++){const g=a+x*this.cell*.5,m=l+d*this.cell*.5,p=Math.floor((g+Zt/2)/Zt*e),_=Math.floor((m+Zt/2)/Zt*e),v=p<0||_<0||p>=e||_>=e?-500:t[_*e+p];c+=Math.max(0,v),h=Math.max(h,v),f++}const u=o*We+r;this.terrain[u]=c/f,this.land[u]=h>0?1:0}this.qv=new Float32Array(i).fill(1),this.qc=new Float32Array(i),this.zp=new Float32Array(i),this.rain=new Float32Array(i),this.wet=new Float32Array(i),this.conv=new Float32Array(i),this.tmp=[new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i)],this.noise=Jl(n),this.noise2=Jl(n+1),this.mode="auto",this.regime="moae",this.state={...Xa.moae},this.wind=new Dt(...Ca(62)).multiplyScalar(8.5),this.windOffset=new Dt,this.simTime=0,this.nextChange=3600*30,this.rainTotal=0,this.data=new Float32Array(i*4),this.texture=new Jn(this.data,We,We,ke,gn),this.texture.minFilter=ie,this.texture.magFilter=ie,this.texture.wrapS=this.texture.wrapT=$e,this.texture.needsUpdate=!0,this.rect=new ve(this.origin,this.origin,fs,fs),this.accum=0,this.boost=0}setMode(t){this.mode=t,t!=="auto"&&(this.regime=t)}pickRegime(t){const e=Math.random();return t==="hooilo"?e<.62?"moae":e<.8?"malie":"kona":e<.86?"moae":e<.97?"malie":"kona"}step(t,e,n,i,o=!1){if(t<=0)return;if(this.simTime+=t,this.mode==="auto"&&this.simTime>this.nextChange){this.regime=this.pickRegime(i);const w=this.regime==="moae"?30+Math.random()*60:this.regime==="kona"?14+Math.random()*20:10+Math.random()*16;this.nextChange=this.simTime+w*3600}const r=Xa[this.regime],a=1-Math.exp(-t/7200),l=this.state;for(const w of["speed","humidity","lcl","inversion","patch","convect"]){let E=r[w];this.boost&&w==="humidity"&&(E*=1.18),this.boost&&w==="patch"&&(E*=1.6),l[w]+=(E-l[w])*a}let c=r.bearing-l.bearing;c=(c+540)%360-180,l.bearing+=c*a;const h=1+.18*Math.sin((n-9)/24*Math.PI*2),f=1+.12*this.noise(this.simTime/5400,3.3),u=l.bearing+9*this.noise(this.simTime/9e3,7.7),[d,x]=Ca(u),g=l.speed*h*f;this.wind.set(d*g,x*g);const m=d*g/100,p=x*g/100;this.windOffset.x+=m*t,this.windOffset.y+=p*t,this.pending=(this.pending||0)+t;const _=performance.now();if(!o&&_-(this.lastPhysics||0)<80)return;this.lastPhysics=_;const v=this.pending;this.pending=0;const y=Math.hypot(m,p)*v,T=Math.max(1,Math.min(12,Math.ceil(y/(this.cell*1.5))));for(let w=0;w<T;w++)this.substep(v/T,m,p,e);this.pack()}substep(t,e,n,i){const o=We,r=this.cell,a=this.state,[l,c,h,f,u]=this.tmp,d=e*t/r,x=n*t/r,g=this.windOffset.x,m=this.windOffset.y;for(let y=0;y<o;y++)for(let T=0;T<o;T++){const w=y*o+T,E=T-d,A=y-x;if(E<0||A<0||E>o-1||A>o-1){const D=this.origin+(E+.5)*r-g,z=this.origin+(A+.5)*r-m,P=Math.hypot(e,n)||1,H=(D*e+z*n)/P,j=(-D*n+z*e)/P,B=Ug(this.noise2,H/60,j/24,3);l[w]=a.humidity*(1+a.patch*.55*B),c[w]=Math.max(0,B-.05)*.75*a.patch,h[w]=0,f[w]=0,u[w]=0;continue}const M=Math.min(o-2,E|0),S=Math.min(o-2,A|0),C=E-M,I=A-S,k=S*o+M,b=(1-C)*(1-I),R=C*(1-I),N=(1-C)*I,G=C*I;l[w]=this.qv[k]*b+this.qv[k+1]*R+this.qv[k+o]*N+this.qv[k+o+1]*G,c[w]=this.qc[k]*b+this.qc[k+1]*R+this.qc[k+o]*N+this.qc[k+o+1]*G,h[w]=this.zp[k]*b+this.zp[k+1]*R+this.zp[k+o]*N+this.zp[k+o+1]*G,f[w]=this.conv[k]*b+this.conv[k+1]*R+this.conv[k+o]*N+this.conv[k+o+1]*G,u[w]=this.wet[w]}const p=Math.hypot(e,n)*t*100,_=Math.max(0,i)*a.convect,v=a.lcl;for(let y=0;y<o*o;y++){const T=this.terrain[y];let w=l[y],E=c[y];const A=h[y],M=Math.max(T,A-.24*p);if(M>A){const b=Math.max(0,M-Math.max(A,v)),R=Math.min(w,w*b/650);w-=R,E+=R}else if(M<A){const b=Math.min(E,(A-M)*(.0035*E+35e-5));E-=b,w+=b}let S=f[y]*Math.exp(-t/5400);if(this.land[y]){const b=_*Ql(80,700,T)*(1-.6*Ql(.85,1.2,a.humidity))*45e-7,R=Math.min(w*.2,b*t*w);w-=R,E+=R,S=Math.min(1,S+b*t*4)}else{w+=(a.humidity-w)*(1-Math.exp(-t/2400));const b=Math.max(0,w-a.humidity*1.12)*t*12e-5;w-=b,E+=b}const I=Math.max(0,E-.11)*(1-Math.exp(-t/1500));E-=I,E*=Math.exp(-t/21600);const k=I/Math.max(t,.001)*3600;this.rain[y]=this.rain[y]*.6+k*.4,u[y]=xo(u[y]*Math.exp(-t/(3600*5))+k*t/3600*3,0,1),this.qv[y]=w,this.qc[y]=E,this.zp[y]=M,this.conv[y]=S,this.wet[y]=u[y]}}pack(){const t=this.data;let e=0,n=0,i=0;for(let o=0;o<We*We;o++){const r=xo(this.qc[o]*4.2,0,1);t[o*4]=r;const a=xo(this.rain[o]*2.2,0,1);t[o*4+1]=a,t[o*4+2]=this.wet[o],t[o*4+3]=this.conv[o],this.land[o]&&(e+=a);const l=a*(.4+this.conv[o]);l>n&&(n=l,i=o)}this.rainTotal=e,this.stormiest={strength:n,x:this.origin+(i%We+.5)*this.cell,z:this.origin+(Math.floor(i/We)+.5)*this.cell},this.texture.needsUpdate=!0}spawnShower(t,e,n=6,i=.5){const o=this.G,r=(t-this.origin)/this.cell-.5,a=(e-this.origin)/this.cell-.5,l=n/this.cell;for(let c=Math.max(0,Math.floor(a-l));c<=Math.min(o-1,Math.ceil(a+l));c++)for(let h=Math.max(0,Math.floor(r-l));h<=Math.min(o-1,Math.ceil(r+l));h++){const f=Math.hypot(h-r,c-a)/l;if(f>1)continue;const u=c*o+h,d=(1-f*f)*i;this.qc[u]=Math.max(this.qc[u],.12+d*.3),this.rain[u]=Math.max(this.rain[u],d*.6),this.conv[u]=Math.max(this.conv[u],d)}this.pack()}warm(t,e,n,i){for(let o=0;o<t*3600;o+=600)this.step(600,e,n,i,!0)}get base(){return this.state.lcl*Nt}get top(){return this.state.inversion*Nt}}const he=.016,J={plain:0,thatch:1,stone:2,leaf:3,kapa:5,wood:6,skin:7};class Se{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.xf=null,this.stack=[]}at(t,e,n,i=0,o=he){this.stack.push(this.xf);const r=Math.cos(i),a=Math.sin(i);return this.xf=l=>[t+(l[0]*r-l[2]*a)*o,e+l[1]*o,n+(l[0]*a+l[2]*r)*o],this}done(){return this.xf=this.stack.pop()||null,this}get count(){return this.pos.length/3}tri(t,e,n,i,o=0,r=!0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const a=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],f=n[1]-t[1],u=n[2]-t[2];let d=l*u-c*f,x=c*h-a*u,g=a*f-l*h;const m=Math.hypot(d,x,g)||1;d/=m,x/=m,g/=m;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(d,x,g),this.col.push(i[0],i[1],i[2]),this.mat.push(o)}quad(t,e,n,i,o,r=0){this.tri(t,e,n,o,r),this.tri(t,n,i,o,r)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],n,i)}box(t,e,n,i,o,r,a,l=0,c=0,h=1){const f=Math.cos(c),u=Math.sin(c),d=(y,T,w)=>[t+y*f-w*u,e+T,n+y*u+w*f],x=i/2,g=r/2,m=x*h,p=g*h,_=[d(-x,0,-g),d(x,0,-g),d(x,0,g),d(-x,0,g)],v=[d(-m,o,-p),d(m,o,-p),d(m,o,p),d(-m,o,p)];o<0?this.hexa(v,_,a,l):this.hexa(_,v,a,l)}cyl(t,e,n,i,o,r=0,a=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,f=c.map(p=>p/h),u=Math.abs(f[1])<.9?[0,1,0]:[1,0,0];let d=[f[1]*u[2]-f[2]*u[1],f[2]*u[0]-f[0]*u[2],f[0]*u[1]-f[1]*u[0]];const x=Math.hypot(...d);d=d.map(p=>p/x);const g=[f[1]*d[2]-f[2]*d[1],f[2]*d[0]-f[0]*d[2],f[0]*d[1]-f[1]*d[0]],m=(p,_,v)=>{const y=v/a*Math.PI*2,T=Math.cos(y)*_,w=Math.sin(y)*_;return[p[0]+d[0]*T+g[0]*w,p[1]+d[1]*T+g[1]*w,p[2]+d[2]*T+g[2]*w]};for(let p=0;p<a;p++){const _=m(t,n,p),v=m(t,n,p+1),y=m(e,i,p),T=m(e,i,p+1);this.quad(_,v,T,y,o,r),l&&this.tri(e,y,T,o,r)}}blob(t,e,n,i,o,r,a,l=0,c=0,h=l===J.leaf,f=1){const u=(1+Math.sqrt(5))/2,d=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],x=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=y=>.85+.3*Math.abs(Math.sin(y*12.9898+c*78.233)*43758.5453%1),m=d.map((y,T)=>{const w=Math.hypot(...y),E=g(T);return[t+y[0]/w*i*E,e+y[1]/w*o*E,n+y[2]/w*r*E]});if(!h){for(const y of x)this.tri(m[y[0]],m[y[1]],m[y[2]],a,l);return}const p=(y,T)=>{const w=[(y[0]+T[0])/2,(y[1]+T[1])/2,(y[2]+T[2])/2],E=[(w[0]-t)/i,(w[1]-e)/o,(w[2]-n)/r],A=Math.hypot(...E)||1,M=.9+.2*Math.abs(Math.sin(w[0]*91.7+w[2]*47.3+c)*43758.5453%1);return[t+E[0]/A*i*M,e+E[1]/A*o*M,n+E[2]/A*r*M]},_=y=>{const T=[(y[0]-t)/(i*i),(y[1]-e)/(o*o),(y[2]-n)/(r*r)],w=Math.hypot(...T)||1;return[T[0]/w,T[1]/w,T[2]/w]},v=(y,T,w)=>{const E=this.xf?[this.xf(y),this.xf(T),this.xf(w)]:[y,T,w],A=[_(y),_(T),_(w)];for(let M=0;M<3;M++)this.pos.push(...E[M]),this.nor.push(...A[M]),this.col.push(a[0],a[1],a[2]),this.mat.push(l)};if(f===0){for(const y of x)v(m[y[0]],m[y[1]],m[y[2]]);return}for(const y of x){const T=m[y[0]],w=m[y[1]],E=m[y[2]],A=p(T,w),M=p(w,E),S=p(E,T);v(T,A,S),v(A,w,M),v(S,M,E),v(A,M,S)}}wall(t,e,n,i,o=J.stone,r=.7){const a=t.length;if(a<2)return;const l=a>2&&Math.hypot(t[0][0]-t[a-1][0],t[0][2]-t[a-1][2])<1e-9,c=[];for(let g=0;g<a-1;g++){const m=t[g+1][0]-t[g][0],p=t[g+1][2]-t[g][2],_=Math.hypot(m,p)||1;c.push([-p/_,m/_])}const h=t.map((g,m)=>{let p=c[m-1],_=c[m];if(l&&m===0&&(p=c[a-2]),l&&m===a-1&&(_=c[0]),!p)return _;if(!_)return p;const v=p[0]+_[0],y=p[1]+_[1],T=Math.hypot(v,y);if(T<1e-6)return _;const w=1/Math.max(.35,(v*_[0]+y*_[1])/T);return[v/T*w,y/T*w]}),f=e/2,u=e*r/2,d=(g,m,p,_)=>[g[0]+m[0]*p,g[1]+_,g[2]+m[1]*p],x=g=>[d(t[g],h[g],-f,-n*.3),d(t[g],h[g],f,-n*.3),d(t[g],h[g],u,n),d(t[g],h[g],-u,n)];for(let g=0;g<a-1;g++){const[m,p,_,v]=x(g),[y,T,w,E]=x(g+1);this.quad(v,_,w,E,i,o),this.quad(p,T,w,_,i,o),this.quad(y,m,v,E,i,o)}if(!l){const[g,m,p,_]=x(0),[v,y,T,w]=x(a-1);this.quad(g,m,p,_,i,o),this.quad(y,v,w,T,i,o)}}geometry(){const t=new be;return t.setAttribute("position",new ne(this.pos,3)),t.setAttribute("normal",new ne(this.nor,3)),t.setAttribute("color",new ne(this.col,3)),t.setAttribute("aMat",new ne(this.mat,1)),t.computeBoundingSphere(),t}}function yt(s,t=0,e=Math.random){const n=new Pt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const h1=`
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
`,u1=`
${Ne}
${Vn}
${un}
${Wn}
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
`;function ys(s,t={}){const[e,n]=t.fade||[120,160];return new xe({vertexShader:h1,fragmentShader:u1,vertexColors:!0,side:t.doubleSide?je:Bn,uniforms:{...s.uniforms,uWindVec:s.uniforms.uWindVec||{value:new Dt(1,0)},uFadeNear:{value:e},uFadeFar:{value:n},uFadeClose:{value:t.close||0},uFadeIn:{value:new Dt(...t.fadeIn||[0,0])},uSway:{value:t.sway||0},uObjDebug:{value:0}}})}const _e={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",stoneDark:"#4f4844",wood:"#6b4a2f",koa:"#7a4a2a",kapa:"#efe8d8",salt:"#f2ece4"};function _o(s,t,e=7,n=4.6,i=5.2,o=!0){const r=yt(_e.thatch,.18,t),a=yt(_e.thatchDark,.15,t),l=yt(_e.stone,.15,t);s.box(0,-.6,0,e+1.8,1.05,n+1.8,l,J.stone);const c=.45,h=c+1.05;s.box(0,c,0,e,h-c,n,r,J.thatch);const f=e/2+.35,u=n/2+.45,d=c+i,x=[-f,h-.15,-u],g=[f,h-.15,-u],m=[-f,d,0],p=[f,d,0],_=[-f,h-.15,u],v=[f,h-.15,u];s.quad(x,m,p,g,r,J.thatch),s.quad(v,p,m,_,r,J.thatch),s.quad(g,p,m,x,a,J.thatch),s.quad(_,m,p,v,a,J.thatch);const y=e/2;if(s.tri([-y,h,-n/2],[-y,h,n/2],[-y,d-.2,0],r,J.thatch),s.tri([y,h,n/2],[y,h,-n/2],[y,d-.2,0],r,J.thatch),s.box(0,d-.12,0,e+.9,.35,.55,a,J.thatch),o){const T=[.05,.035,.025];s.quad([y+.02,c,-.45],[y+.02,c+1.4,-.45],[y+.02,c+1.4,.45],[y+.02,c,.45],T,0)}}function mh(s,t,e,n,i){const o=yt(_e.wood,.25,i);s.cyl([t,0,e],[t,n*.62,e],.22,.18,o,J.wood,5),s.box(t,n*.6,e,.75,n*.28,.6,o,J.wood,i()*.3,.85),s.box(t,n*.86,e,.35,n*.16,.35,o,J.wood,0,.6)}function f1(s,t,e,n,i){const o=yt(_e.kapa,.05,i),r=yt(_e.wood,.2,i);s.box(t,0,e,2.6,n,2.6,o,J.kapa,.1,.62);for(const[a,l]of[[-1.35,-1.35],[1.35,-1.35],[1.35,1.35],[-1.35,1.35]])s.cyl([t+a,0,e+l],[t+a*.55,n+.8,e+l*.55],.12,.08,r,J.wood,4)}function d1(s,t,e,n){const i=yt(_e.wood,.2,n);for(const[o,r]of[[-.9,-.6],[.9,-.6],[.9,.6],[-.9,.6]])s.cyl([t+o,0,e+r],[t+o,2.6,e+r],.09,.08,i,J.wood,4);s.box(t,2.5,e,2.2,.18,1.6,i,J.wood),s.blob(t,2.85,e,.5,.25,.4,yt("#c9a35a",.2,n),J.plain,1)}function sc(s,t,e,n,i,o,r,a){const l=yt(_e.stone,.12,o),c=yt(_e.stoneDark,.12,o),h=r?44:26,f=r?30:18,u=r?3:2;s.at(t,e,n,i,a);let d=-1.5;for(let v=0;v<u;v++){const y=1-v*.14,T=(r?1.6:1.2)+(v===0?1.5:0);s.box(0,d,0,h*y,T,f*y,v%2?c:l,J.stone),d+=T}const x=1-(u-1)*.14,g=h*x/2,m=f*x/2,p=r?2.2:1.5;s.box(0,d,-m+.8,h*x,p,1.6,c,J.stone),s.box(0,d,m-.8,h*x,p,1.6,c,J.stone),s.box(-g+.8,d,0,1.6,p,f*x,c,J.stone),s.done(),s.at(t,e+d*a,n,i,a),f1(s,-g*.55,0,r?11:7.5,o);const _=r?7:4;for(let v=0;v<_;v++){const y=(v/(_-1)-.5)*1.6;mh(s,-g*.55+Math.cos(y)*(r?8:5),Math.sin(y)*(r?8:5),r?4.2:3.2,o)}return d1(s,g*.15,0,o),s.done(),s.at(t+Math.cos(i)*g*.45*a-Math.sin(i)*m*.35*a,e+d*a,n+Math.sin(i)*g*.45*a+Math.cos(i)*m*.35*a,i,a),_o(s,o,r?8:6,r?5:4,r?6:4.5,!1),s.done(),d}function gh(s,t,e=8){const n=yt(_e.koa,.2,t),i=yt("#4a2c18",.2,t),o=e/2;s.box(0,0,0,e*.8,.55,.62,n,J.wood,0,.9),s.box(o*.85,.05,0,e*.2,.6,.4,i,J.wood,0,.5),s.box(-o*.85,.05,0,e*.2,.55,.4,i,J.wood,0,.5);const r=-2.4;for(const a of[-e*.15,e*.15])s.cyl([a,.55,0],[a,.5,r],.06,.06,i,J.wood,4);s.box(0,.05,r,e*.5,.28,.24,i,J.wood,0,.8)}function vh(s,t,e=18){const n=yt(_e.koa,.15,t),i=yt("#4a2c18",.15,t);for(const r of[-2.2,2.2])s.box(0,0,r,e*.82,1,1,n,J.wood,0,.88),s.box(e*.45,.2,r,e*.14,1.2,.6,i,J.wood,0,.5),s.box(-e*.45,.2,r,e*.14,1.1,.6,i,J.wood,0,.5);s.box(0,1,0,e*.42,.2,5.2,i,J.wood),s.box(-e*.08,1.2,0,3.2,1.4,2.4,yt(_e.thatch,.1,t),J.thatch,0,.7);const o=yt("#c9ac78",.08,t);s.cyl([e*.1,1.1,0],[e*.05,9.5,0],.12,.08,i,J.wood,4),s.quad([e*.12,1.4,.05],[e*.36,8.8,.05],[e*.02,10.8,.05],[e*.05,4,.05],o,J.plain),s.quad([e*.05,4,-.05],[e*.02,10.8,-.05],[e*.36,8.8,-.05],[e*.12,1.4,-.05],o,J.plain)}function p1(s,t,e=16,n=6){const i=yt(_e.thatch,.15,t),o=yt(_e.thatchDark,.15,t),r=yt(_e.wood,.2,t),a=4.8,l=e/2,c=n/2+.3;s.quad([-l,.3,-c],[-l,a,0],[l,a,0],[l,.3,-c],i,J.thatch),s.quad([l,.3,c],[l,a,0],[-l,a,0],[-l,.3,c],i,J.thatch),s.quad([l,.3,-c],[l,a,0],[-l,a,0],[-l,.3,-c],o,J.thatch),s.quad([-l,.3,c],[-l,a,0],[l,a,0],[l,.3,c],o,J.thatch),s.tri([-l,.3,c],[-l,.3,-c],[-l,a,0],o,J.thatch),s.tri([-l,.3,-c],[-l,.3,c],[-l,a,0],i,J.thatch),s.box(0,a-.1,0,e+.4,.3,.45,o,J.thatch),s.cyl([l,0,0],[l,a,0],.15,.12,r,J.wood,5)}function m1(s,t,e=!0){const n=yt(_e.stone,.2,t);for(let i=0;i<9;i++){const o=t()*Math.PI*2,r=1.4*(1-i/10);s.blob(Math.cos(o)*r*.5,i*.28,Math.sin(o)*r*.5,.75,.45,.7,n,J.stone,i+t())}if(s.box(0,2.3,0,1.6,.25,1.3,yt("#5d5650",.1,t),J.stone),e){const i=yt("#3b2a1e",.2,t);s.box(0,2.55,0,1,.75,.6,i,J.wood,0,.8),s.box(.65,2.7,0,.5,.35,.35,i,J.wood,0,.7),s.box(-.2,3.25,-.2,.15,.3,.12,i,J.wood),s.box(-.2,3.25,.2,.15,.3,.12,i,J.wood)}}function g1(s,t,e=7){const n=yt(_e.wood,.1,t),i=yt(_e.kapa,.04,t);s.cyl([0,0,0],[0,e,0],.09,.07,n,J.wood,5),s.cyl([0,e*.82,-1.6],[0,e*.82,1.6],.06,.06,n,J.wood,4),s.quad([.02,e*.82,-1.5],[.02,e*.82,1.5],[.02,e*.3,1.3],[.02,e*.3,-1.3],i,J.kapa),s.quad([-.02,e*.3,-1.3],[-.02,e*.3,1.3],[-.02,e*.82,1.5],[-.02,e*.82,-1.5],i,J.kapa),s.box(0,e*.85,-1.55,.1,-1.6,.1,yt("#e2b13c",.1,t),J.plain),s.box(0,e*.85,1.55,.1,-1.6,.1,yt("#e2b13c",.1,t),J.plain),s.blob(0,e+.2,0,.35,.45,.35,yt("#3d2c1f",.1,t),J.wood,2)}function v1(s,t){const e=yt(_e.stone,.2,t);s.box(0,-.3,0,3.2,.8,2.4,e,J.stone,0,.85);for(let n=0;n<5;n++)s.blob((t()-.5)*1.4,.7+n*.25,(t()-.5)*1,.45,.3,.4,e,J.stone,n);s.blob(0,2,0,.45,.35,.45,yt("#f3efe6",.05,t),J.kapa,3)}function x1(s,t){const e=yt("#4d4642",.2,t);for(let n=0;n<7;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,J.stone,n)}const oc=.009,_1=`
${Ne}
out vec3 vWorld;
out float vAge;
out float vFlood;
#ifdef AUWAI
in float aSide;
out float vSide;
#else
in float aAge;
in float aFlood;
#endif
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
#ifdef AUWAI
  // a ditch lies on the finest ground, which far off gives way to a coarser
  // mesh that can stand over it: draw it a little toward the eye (as the
  // streams are) so it isn't swallowed there
  vec3 toCam = cameraPosition - wp.xyz;
  float dc = length(toCam);
  wp.xyz += toCam / max(dc, 1e-3) * min(dc * 0.004, 0.6);
  vSide = aSide;
  vAge = 0.0;
  vFlood = 0.0;
#else
  vAge = aAge;
  vFlood = aFlood;
#endif
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,M1=`
${Ne}
${Vn}
${un}
${Wn}
in vec3 vWorld;
in float vAge;
in float vFlood;
#ifdef AUWAI
in float vSide;
#endif
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
#ifdef AUWAI
  // a ditch of dark, slow water between earthen lips (no taro in it)
  col = mix(water * 0.7, vec3(0.13, 0.11, 0.06) * (uSkyColor + uSunColor * max(uSunDir.y, 0.0) * vis), smoothstep(0.45, 0.8, abs(vSide)));
#endif
  gl_FragColor = vec4(col, 1.0);
}
`;class y1{constructor(t,e,n){this.group=new hn;const i=[],o=[],r=[],a=new Se,l=yt("#557d36",.15,Math.random),c=yt("#6e6e42",.1,Math.random),h=.06,f=m=>new Dt(m[0],m[1]),u=[],d=[];for(const m of t.loi){for(const p of m.paddies){const _=(p.level+h)*Nt,v=p.poly;for(const[I,k,b]of or.triangulateShape(v.map(f),[]))for(const R of[I,k,b])i.push(v[R][0],_,v[R][1]),o.push(p.age),r.push(p.flood);let y=p.level;const T=v.length;let w=0;for(let I=0;I<T;I++)w+=v[I][0]*v[(I+1)%T][1]-v[(I+1)%T][0]*v[I][1];const E=w>0?1:-1;for(let I=0;I<T;I++){const k=v[I],b=v[(I+1)%T],R=Math.hypot(b[0]-k[0],b[1]-k[1])||1,N=(b[1]-k[1])/R*E*.01,G=-(b[0]-k[0])/R*E*.01,D=Math.max(1,Math.ceil(R/.04));for(let z=0;z<D;z++){const P=k[0]+(b[0]-k[0])*z/D,H=k[1]+(b[1]-k[1])*z/D;y=Math.min(y,e.metresAt(P,H),e.metresAt(P+N,H+G),e.metresAt(P+2*N,H+2*G))}}const A=Math.max(y,p.level-8)-.25,S=(p.level+.35-A)/1.3,C=[...v,v[0]].map(I=>[I[0],(A+.3*S)*Nt,I[1]]);a.wall(C,.009,S*Nt,Math.random()<.8?l:c,J.plain,.6)}for(const p of m.auwai){let _=null;for(let v=0;v<p.length-1;v++){const[y,T]=p[v],[w,E]=p[v+1],A=Math.hypot(w-y,E-T);if(A<1e-6)continue;if(A>1.2){_=null;continue}const M=-(E-T)/A,S=(w-y)/A,C=Math.max(1,Math.ceil(A/.03));for(let I=v===0||!_?0:1;I<=C;I++){const k=y+(w-y)*I/C,b=T+(E-T)*I/C,R=[-1,1].map(N=>{const G=k+M*oc*N,D=b+S*oc*N;return[G,Math.max(0,hi(e,G,D))+.002,D]});if(_)for(const[N,G]of[[_[0],-1],[_[1],1],[R[1],1],[_[0],-1],[R[1],1],[R[0],-1]])u.push(N[0],N[1],N[2]),d.push(G);_=R}}}}const x=new be;x.setAttribute("position",new ne(i,3)),x.setAttribute("aAge",new ne(o,1)),x.setAttribute("aFlood",new ne(r,1)),x.computeBoundingSphere(),this.material=new xe({vertexShader:_1,fragmentShader:M1,uniforms:{...n.uniforms},side:je,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}),this.paddies=new Qt(x,this.material),this.group.add(this.paddies);const g=new be;g.setAttribute("position",new ne(u,3)),g.setAttribute("aSide",new ne(d,1)),g.computeBoundingSphere(),this.ditchMaterial=this.material.clone(),this.ditchMaterial.uniforms=this.material.uniforms,this.ditchMaterial.defines={AUWAI:1},this.ditches=new Qt(g,this.ditchMaterial),this.group.add(this.ditches),this.banksGeometry=a.geometry()}}const ac={noa:[7,4.6,5.2],mua:[8,5,5.6],aina:[6,4.2,4.6],kuku:[5,3.6,4],alii:[12,7,7.5]};class w1{constructor(t){const{terrain:e,shared:n}=t,i=t.island.meta,o=i.sites;this.app=t,this.meta=i,this.sites=o,this.group=new hn;const r=Ji(i.seed+77),a=new Se,l=(c,h)=>Math.max(e.heightAt(c,h),0);for(const c of o.houses){const[h,f,u]=ac[c.kind]||ac.noa,d=c.scale||1;a.at(c.x,l(c.x,c.z),c.z,c.rot),_o(a,r,h*d,f*d,u*d),a.done()}for(const c of o.villages){const h=r()*Math.PI*2,f=c.x+Math.cos(h)*.35,u=c.z+Math.sin(h)*.35;a.at(f,l(f,u),u,0),x1(a,r),a.done()}for(const c of o.heiau)sc(a,c.x,l(c.x,c.z),c.z,c.rot,r,c.kind==="luakini",he);this.beaches=[];for(const c of o.canoes){const h=c.dir,f=h+Math.PI/2;for(let u=0;u<c.n;u++){const d=(u-(c.n-1)/2)*.09,x=c.x+Math.cos(f)*d,g=c.z+Math.sin(f)*d;a.at(x,l(x,g)+.002,g,h),gh(a,r,7+r()*4),a.done()}if(c.house){const u=c.x-Math.cos(h)*.32,d=c.z-Math.sin(h)*.32;a.at(u,l(u,d),d,h),p1(a,r),a.done()}this.beaches.push(c)}if(o.alii){const c=o.canoes.find(h=>h.village===o.alii.id);if(c){const h=c.dir+Math.PI/2,f=c.x+Math.cos(h)*.45,u=c.z+Math.sin(h)*.45;a.at(f,l(f,u)+.002,u,c.dir),vh(a,r),a.done()}}for(const c of o.koa)a.at(c.x,l(c.x,c.z),c.z,r()*6),v1(a,r),a.done();for(const c of i.ahu)a.at(c.x,l(c.x,c.z),c.z,r()*6),m1(a,r,!0),a.done();this.ponds=o.ponds,this.pondMask(t);for(const c of o.ponds)this.buildPond(a,c,r);o.puuhonua&&this.buildPuuhonua(a,o.puuhonua,r),o.holua&&this.buildHolua(a,o.holua,r);for(const c of o.saltpans)this.buildSalt(a,c,r);this.material=ys(n,{fade:[70,110]}),this.structures=new Qt(a.geometry(),this.material),this.structures.frustumCulled=!1,this.group.add(this.structures),this.loi=new y1(o,e,n),this.group.add(this.loi.group),this.banks=new Qt(this.loi.banksGeometry,this.material),this.banks.frustumCulled=!1,this.group.add(this.banks)}pondMask(t){const e=ee,n=t.seaData,i=Zt/e;for(const o of this.ponds){const r=o.wall,a=r.map(d=>d[0]),l=r.map(d=>d[1]),c=Math.max(0,Math.floor((Math.min(...a)+pt)/i)),h=Math.min(e-1,Math.ceil((Math.max(...a)+pt)/i)),f=Math.max(0,Math.floor((Math.min(...l)+pt)/i)),u=Math.min(e-1,Math.ceil((Math.max(...l)+pt)/i));for(let d=f;d<=u;d++)for(let x=c;x<=h;x++){const g=-pt+(x+.5)*i,m=-pt+(d+.5)*i;S1(r,g,m)&&(n[(d*e+x)*4]=255)}}t.seaTex.needsUpdate=!0}buildPond(t,e,n){const i=yt("#8a817a",.12,n),o=e.wall,r=o.length,a=[0];for(let T=1;T<r;T++)a.push(a[T-1]+Math.hypot(o[T][0]-o[T-1][0],o[T][1]-o[T-1][1]));const l=a[r-1],c=T=>{const w=T*(r-1),E=Math.min(r-2,Math.floor(w));return a[E]+(a[E+1]-a[E])*(w-E)},h=T=>{let w=0;for(;w<r-2&&a[w+1]<T;)w++;const E=(T-a[w])/Math.max(1e-9,a[w+1]-a[w]);return[o[w][0]+(o[w+1][0]-o[w][0])*E,o[w][1]+(o[w+1][1]-o[w][1])*E]},f=.06,u=e.gates.map(T=>c(T)).map(T=>[Math.max(0,T-f/2),Math.min(l,T+f/2)]);let d=[];const x=()=>{d.length>1&&t.wall(d,.1,.024,i,J.stone,.72),d=[]},g=T=>d.push([T[0],0,T[1]]);let m=0;for(const[T,w]of u){for(let E=0;E<r;E++)a[E]>m&&a[E]<T&&g(o[E]);g(h(T)),x(),g(h(w)),m=w}for(let T=0;T<r;T++)a[T]>m&&g(o[T]);x();const p=yt(_e.wood,.15,n);for(const[T,w]of u){const E=h(T),A=h(w),M=Math.atan2(A[1]-E[1],A[0]-E[0]),S=Math.hypot(A[0]-E[0],A[1]-E[1])/he;t.at((E[0]+A[0])/2,0,(E[1]+A[1])/2,M);const C=Math.max(3,Math.round(S/.45));for(let I=0;I<=C;I++)t.box(-S/2+.06+(S-.12)*I/C,-.4,0,.12,1.9,.12,p,J.wood);t.box(0,1.25,0,S,.15,.2,p,J.wood),t.box(0,.45,0,S,.1,.16,p,J.wood),t.done()}const _=Math.round(e.gates[0]*(r-1)),v=o[_][0]-e.ax*.12,y=o[_][1]-e.az*.12;t.at(v,.004,y,n()*3),_o(t,n,4,3,3.4),t.done()}buildPuuhonua(t,e,n){const{terrain:i}=this.app,o=e.dir,r=Math.cos(o),a=Math.sin(o),l=-a,c=r,h=e.x-r*1.6,f=e.z-a*1.6,u=v=>{for(let y=.3;y<9;y+=.15)if(i.heightAt(h+l*y*v,f+c*y*v)<=.002)return y;return 4},d=u(-1),x=u(1),g=[];for(let v=-d;v<=x;v+=.12){const y=h+l*v,T=f+c*v;g.push([y,Math.max(0,i.heightAt(y,T)),T])}const m=yt(_e.stoneDark,.1,n);t.wall(g,.08,.06,m,J.stone,.8);const p=e.x-r*.5,_=e.z-a*.5;sc(t,p,Math.max(0,i.heightAt(p,_)),_,o,n,!1,he);for(let v=0;v<6;v++){const y=(v-2.5)*.12,T=e.x+l*y-r*.05,w=e.z+c*y-a*.05;t.at(T,Math.max(0,i.heightAt(T,w)),w,o),mh(t,0,0,4,n),t.done()}for(let v=0;v<3;v++){const y=h+r*.5+l*(v-1)*.6,T=f+a*.5+c*(v-1)*.6;t.at(y,Math.max(0,i.heightAt(y,T)),T,o+Math.PI/2),_o(t,n,6,4,4.2),t.done()}this.puuhonuaWall={a:g[0],b:g[g.length-1]}}buildHolua(t,e,n){const{terrain:i}=this.app,o=Math.hypot(e.x1-e.x0,e.z1-e.z0),r=Math.ceil(o/.08),a=o/r,l=(e.x1-e.x0)/o,c=(e.z1-e.z0)/o,h=(M,S)=>[e.x0+l*M-c*S,e.z0+c*M+l*S],f=(M,S)=>Math.max(i.heightAt(M,S),hi(i,M,S)),u=.014,d=4,x=[];for(let M=0;M<=r*d;M++){const S=M/d*a;let C=i.heightAt(...h(S,0))+.018;for(let I=-.041;I<.042;I+=.0205)C=Math.max(C,f(...h(S,I))+.003);x.push(C-u)}const g=[];for(let M=0;M<=r;M++)g.push(i.heightAt(...h(M*a,0))+.004);const m=()=>{for(let M=0;M<8;M++){let S=!1;for(let C=0;C<=r*d;C++){const I=Math.min(r-1,Math.floor(C/d)),k=C/d-I,b=x[C]-(g[I]+(g[I+1]-g[I])*k);b>1e-6&&(S=!0,g[k<.5?I:I+1]+=b)}if(!S)break}};m();for(let M=0;M<2;M++){const S=g.slice();for(let C=1;C<r;C++)g[C]=(S[C-1]+2*S[C]+S[C+1])/4;m()}const p=g.map((M,S)=>{const[C,I]=h(S*a,0);return[C,M,I]}),_=yt("#8a817a",.1,n),v=g.map((M,S)=>{const C=S*a,I=[];for(const G of[-1,1]){const D=.055+.6*Math.max(0,M-.0042-f(...h(C,G*.055)));let z=M-.0042;for(const j of[-.5,0,.5]){const[B,Y]=h(C+j*a,G*D);z=Math.min(z,i.heightAt(B,Y)-.006,hi(i,B,Y)-.006)}const[P,H]=h(C,G*D);I.push([P,z,H])}const[k,b]=h(C,.041),[R,N]=h(C,-.041);return I.push([k,M+u,b],[R,M+u,N]),I});for(let M=0;M<r;M++){const[S,C,I,k]=v[M],[b,R,N,G]=v[M+1];t.quad(k,I,N,G,_,J.stone),t.quad(C,R,N,I,_,J.stone),t.quad(b,S,k,G,_,J.stone)}t.quad(...v[0],_,J.stone);const[y,T,w,E]=v[r];t.quad(T,y,E,w,_,J.stone);const A=yt("#c2b25e",.1,n);for(let M=0;M<p.length-1;M++){const S=p[M],C=p[M+1],I=C[0]-S[0],k=C[2]-S[2],b=Math.hypot(I,k)||1,R=-k/b*.034,N=I/b*.034,G=S[1]+.0145,D=C[1]+.0145;t.quad([S[0]-R,G,S[2]-N],[S[0]+R,G,S[2]+N],[C[0]+R,D,C[2]+N],[C[0]-R,D,C[2]-N],A,J.plain)}this.holuaPath=p}buildSalt(t,e,n){const{terrain:i}=this.app,o=e.dir+Math.PI/2,r=yt(_e.salt,.06,n),a=yt("#7d5b44",.12,n);for(let l=0;l<4;l++)for(let c=0;c<3;c++){const h=(l-1.5)*.11,f=(c-1)*.09,u=e.x+Math.cos(o)*h-Math.sin(o)*f,d=e.z+Math.sin(o)*h+Math.cos(o)*f,x=Math.max(i.heightAt(u,d),.004);t.at(u,x,d,o),t.box(0,-.3,0,6.6,.5,5.4,a,J.plain),t.box(0,.05,0,5.8,.18,4.6,n()<.7?r:yt("#d9c2b4",.05,n),J.kapa),t.done()}}}function S1(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const r=s[i],a=s[o];r[1]>e!=a[1]>e&&t<(a[0]-r[0])*(e-r[1])/(a[1]-r[1])+r[0]&&(n=!n)}return n}function hi(s,t,e){const n=Zt/s.N,i=(t+pt)/n,o=(e+pt)/n,r=Math.floor(i),a=Math.floor(o),l=i-r,c=o-a,h=-pt+r*n,f=-pt+a*n,u=s.heightAt(h,f),d=s.heightAt(h+n,f),x=s.heightAt(h,f+n),g=s.heightAt(h+n,f+n);return r+a&1?l+c<=1?u+(d-u)*l+(x-u)*c:g+(x-g)*(1-l)+(d-g)*(1-c):c>=l?u+(g-x)*l+(x-u)*c:u+(d-u)*l+(g-d)*c}function xh(s,t,e,n=1){let i=Float32Array.from(s),o=new Float32Array(t*t);const r=1/(2*e+1);for(let a=0;a<n;a++){for(let l=0;l<t;l++){const c=l*t;let h=0;for(let f=-e;f<=e;f++)h+=i[c+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)o[c+f]=h*r,h+=i[c+Math.min(t-1,f+e+1)]-i[c+Math.max(0,f-e)]}for(let l=0;l<t;l++){let c=0;for(let h=-e;h<=e;h++)c+=o[Math.min(t-1,Math.max(0,h))*t+l];for(let h=0;h<t;h++)i[h*t+l]=c*r,c+=o[Math.min(t-1,h+e+1)*t+l]-o[Math.max(0,h-e)*t+l]}}return i}function rc(s,t,e,n,i){let o=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let r=1;r<t;r++){let a=(s[r]+r*r-(s[n[o]]+n[o]*n[o]))/(2*r-2*n[o]);for(;a<=i[o];)o--,a=(s[r]+r*r-(s[n[o]]+n[o]*n[o]))/(2*r-2*n[o]);o++,n[o]=r,i[o]=a,i[o+1]=1/0}o=0;for(let r=0;r<t;r++){for(;i[o+1]<r;)o++;const a=r-n[o];e[r]=a*a+s[n[o]]}}function b1(s,t){const n=new Float64Array(s*s);for(let c=0;c<s*s;c++)n[c]=t(c)?0:1e20;const i=new Float64Array(s),o=new Float64Array(s),r=new Int32Array(s),a=new Float64Array(s+1);for(let c=0;c<s;c++){for(let h=0;h<s;h++)i[h]=n[h*s+c];rc(i,s,o,r,a);for(let h=0;h<s;h++)n[h*s+c]=o[h]}const l=new Float32Array(s*s);for(let c=0;c<s;c++){const h=c*s;for(let f=0;f<s;f++)i[f]=n[h+f];rc(i,s,o,r,a);for(let f=0;f<s;f++)l[h+f]=Math.sqrt(o[f])}return l}const E1=[{name:"Koʻolau",gloss:"windward",from:345,to:105},{name:"Puna",gloss:"the sunrise side",from:105,to:165},{name:"Kona",gloss:"leeward",from:165,to:255},{name:"Waialua",gloss:"the northwest side",from:255,to:345}],lc=[{key:"akua",name:"Wao akua",gloss:"realm of the gods"},{key:"nahele",name:"Wao nahele",gloss:"the forest"},{key:"kanaka",name:"Wao kanaka",gloss:"realm of people"},{key:"kula",name:"Kula",gloss:"open dry plains"},{key:"kahakai",name:"Kahakai",gloss:"the shore"},{key:"kohola",name:"Kai kohola",gloss:"reef shallows"},{key:"uli",name:"Kai uli",gloss:"deep blue sea"}];function T1(s,t,e=!1){for(let n=0;n<t;n++){if(s.length<3)return s;const i=e?[]:[s[0]],o=s.length,r=e?o:o-1;for(let a=0;a<r;a++){const l=s[a],c=s[(a+1)%o];i.push([l[0]*.75+c[0]*.25,l[1]*.75+c[1]*.25]),i.push([l[0]*.25+c[0]*.75,l[1]*.25+c[1]*.75])}e||i.push(s[o-1]),s=i}return s}function Ya(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const r=s[i],a=s[o];r[1]>e!=a[1]>e&&t<(a[0]-r[0])*(e-r[1])/(a[1]-r[1])+r[0]&&(n=!n)}return n}function A1(s){const t=new Se,e=yt("#8a7a62",.1,s),n=14;let i=[0,0,0];const o=.06;for(let h=1;h<=6;h++){const f=h/6*n,u=[o*Math.pow(f,1.5),f,0];t.cyl(i,u,.28-h*.02,.26-h*.025,e,J.wood,6),i=u}const r=i,a=yt("#4c7a2c",.12,s),l=yt("#8f9a43",.1,s);for(let h=0;h<13;h++){const f=h/13*Math.PI*2+s()*.3,u=5.2+s()*1.2,d=1.4+s()*.8,x=Math.cos(f),g=Math.sin(f);let m=r;for(let p=1;p<=5;p++){const _=p/5,v=[r[0]+x*u*_,r[1]+d*_-3.8*_*_,r[2]+g*u*_],y=1*Math.sin(Math.PI*Math.min(1,_*1.1))+.15,T=-g*y,w=x*y,E=p>3?l:a;t.quad([m[0],m[1],m[2]],[v[0],v[1],v[2]],[v[0]+T,v[1]-.35*y,v[2]+w],[m[0]+T*.7,m[1]-.25*y,m[2]+w*.7],E,J.leaf),t.quad([m[0]-T*.7,m[1]-.25*y,m[2]-w*.7],[v[0]-T,v[1]-.35*y,v[2]-w],[v[0],v[1],v[2]],[m[0],m[1],m[2]],E,J.leaf),m=v}}const c=yt("#5c4a24",.1,s);for(let h=0;h<4;h++)t.blob(r[0]+Math.cos(h*1.7)*.4,r[1]-.6,r[2]+Math.sin(h*1.7)*.4,.3,.35,.3,c,J.plain,h);return t.geometry()}function ds(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",blobs:o=3,flatten:r=1,red:a=0}){const l=new Se,c=yt(i,.1,s);l.cyl([0,0,0],[.3,t,.1],.35,.22,c,J.wood,5);const h=[];for(let f=0;f<o;f++){const u=f/o*Math.PI*2+s(),d=f===0?0:e*.45,x=yt(n,.18,s),g=[.3+Math.cos(u)*d,t+e*.35*r+(f===0?e*.2:0),.1+Math.sin(u)*d,e*(f===0?1:.75),e*.62*r];h.push(g),l.blob(g[0],g[1],g[2],g[3],g[4],g[3],x,J.leaf,f+s())}if(a>0)for(let f=0;f<a;f++){const[u,d,x,g,m]=h[Math.floor(s()*h.length)],p=s()*Math.PI*2,_=.15+s()*.75,v=Math.sqrt(1-_*_),y=yt(s()<.8?"#b3241c":"#d8452a",.2,s),T=.22+s()*.14;l.blob(u+Math.cos(p)*v*g*.97,d+_*m*.97,x+Math.sin(p)*v*g*.97,T,T*.75,T,y,J.leaf,f,!0,0)}return l.geometry()}function C1(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",flatten:o=1}){const r=new Se;return r.cyl([0,0,0],[.3,t,.1],.4,.25,yt(i,.1,s),J.wood,3),r.blob(.3,t+e*.42*o,.1,e*1.18,e*.7*o,e*1.18,yt(n,.12,s),J.leaf,1,!0,0),r.geometry()}function R1(s,t){const e=new Se;return e.blob(0,.55,0,1.3,.8,1.3,yt(t,.15,s),J.leaf,1,!0,0),e.geometry()}function P1(s){const t=new Se,e=yt("#6b5a45",.1,s),n=yt("#4f7036",.12,s);for(let i=0;i<4;i++){const o=i/4*Math.PI*2;t.cyl([Math.cos(o)*1.1,0,Math.sin(o)*1.1],[0,1.4,0],.08,.1,e,J.wood,4)}t.cyl([0,1.2,0],[0,3.6,0],.22,.18,e,J.wood,5);for(let i=0;i<3;i++){const o=i/3*Math.PI*2+.4,r=[Math.cos(o)*1.8,5.2,Math.sin(o)*1.8];t.cyl([0,3.5,0],r,.14,.1,e,J.wood,4);for(let a=0;a<9;a++){const l=a/9*Math.PI*2,c=Math.cos(l),h=Math.sin(l),f=[r[0]+c*1.7,r[1]+.5-Math.abs(Math.sin(l))*.9,r[2]+h*1.7];t.tri([r[0]-h*.14,r[1],r[2]+c*.14],[r[0]+h*.14,r[1],r[2]-c*.14],f,n,J.leaf)}}return t.geometry()}function L1(s){const t=new Se,e=yt("#7c9a4a",.1,s),n=yt("#6aa538",.12,s);for(let i=0;i<4;i++){const o=s()*Math.PI*2,r=s()*.6,a=Math.cos(o)*r,l=Math.sin(o)*r,c=2.4+s()*1.4;t.cyl([a,0,l],[a,c,l],.16,.12,e,J.leaf,5);for(let h=0;h<4;h++){const f=s()*Math.PI*2,u=Math.cos(f),d=Math.sin(f),x=[a,c,l],g=[a+u*1.6,c+.7,l+d*1.6],m=[a+u*2.6,c-.2,l+d*2.6],p=-d*.45,_=u*.45;t.quad(x,[g[0]+p,g[1],g[2]+_],[m[0]+p*.6,m[1],m[2]+_*.6],m,n,J.leaf),t.quad(x,m,[m[0]-p*.6,m[1],m[2]-_*.6],[g[0]-p,g[1],g[2]-_],n,J.leaf)}}return t.geometry()}function cc(s,t){const e=new Se,n=yt("#6b5a40",.1,s),i=yt(t?"#7d2b2f":"#3f7d32",.15,s);e.cyl([0,0,0],[.05,1.6,0],.05,.04,n,J.wood,4);for(let o=0;o<9;o++){const r=o/9*Math.PI*2,a=Math.cos(r),l=Math.sin(r),c=.3+o%3*.25;e.quad([.05-l*.06,1.6,a*.06],[.05+l*.06,1.6,-a*.06],[.05+a*.9+l*.12,1.6+c,l*.9-a*.12],[.05+a*.9-l*.12,1.6+c,l*.9+a*.12],i,J.leaf)}return e.geometry()}function hc(s,t){const e=new Se;for(let n=0;n<3;n++)e.blob((s()-.5)*1.2,.5,(s()-.5)*1.2,.9,.7,.9,yt(t,.2,s),J.leaf,n);return e.geometry()}const uc=["niu","hala","ulu","kukui","maia","ki","kiRed","ohia","koa","wiliwili","naupaka","aalii"],ps=["ohia","koa","kukui","wiliwili","aalii"],Pe=2,Sa=13.5,ms=[3.6,4.6];class D1{constructor(t){this.app=t;const e=Ji(t.island.meta.seed+5150);this.geoms={niu:A1(e),hala:P1(e),ulu:ds(e,{trunkH:5,crownR:4.2,color:"#2f5a26",blobs:3}),kukui:ds(e,{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468",blobs:5}),maia:L1(e),ki:cc(e,!1),kiRed:cc(e,!0),ohia:ds(e,{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038",blobs:5,red:16}),koa:ds(e,{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",blobs:5,flatten:.7}),wiliwili:ds(e,{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",blobs:3,flatten:.8}),naupaka:hc(e,"#5f8a42"),aalii:hc(e,"#8b7c4a")};const n={ohia:{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038"},koa:{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",flatten:.7},kukui:{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468"},wiliwili:{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",flatten:.8}};this.farGeoms={...Object.fromEntries(Object.entries(n).map(([i,o])=>[i,C1(e,o)])),aalii:R1(e,"#8b7c4a")},this.fixedMat=ys(t.shared,{fade:[34,48],close:.3,sway:1,doubleSide:!0}),this.forestMat=ys(t.shared,{fade:[ms[0],ms[1]],close:.3,sway:1}),this.forestFarMat=ys(t.shared,{fade:[Sa-3.5,Sa],fadeIn:ms,sway:1}),this.group=new hn,this.land=t.landTex.image.data,this.cleared=this.clearings(),this.fixed=this.placeFixed(e),this.meshes={};for(const i of uc){const o=this.fixed[i];if(!o.length)continue;const r=new Ms(this.geoms[i],this.fixedMat,o.length);this.writeInstances(r,o),r.frustumCulled=!1,this.group.add(r),this.meshes[i]=r}this.forest={near:{},far:{}};for(const i of ps)this.forest.near[i]=this.forestMesh(this.geoms[i],this.forestMat,2500),this.forest.far[i]=this.forestMesh(this.farGeoms[i],this.forestFarMat,9e3);this.tiles=new Map,this.frustum=new Ls,this.projView=new jt,this.box=new wn,this.wanted=[],this.lastSelection=""}forestMesh(t,e,n){const i=new Ms(t,e,n);return i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(Wi),i.instanceColor=new Nn(new Float32Array(n*3),3),i.instanceColor.setUsage(Wi),this.group.add(i),i}clearings(){const t=ee,e=new Uint8Array(t*t),n=Zt/t,i=(r,a,l)=>{const c=Math.max(0,Math.floor((r-l+pt)/n)),h=Math.min(t-1,Math.floor((r+l+pt)/n)),f=Math.max(0,Math.floor((a-l+pt)/n)),u=Math.min(t-1,Math.floor((a+l+pt)/n));for(let d=f;d<=u;d++)for(let x=c;x<=h;x++)e[d*t+x]=1},o=this.app.island.meta.sites;for(const r of o.loi)for(const a of r.paddies){i(a.c[0],a.c[1],.05);for(const l of a.poly)i(l[0],l[1],.03)}for(const r of o.houses)i(r.x,r.z,.12);for(const r of o.heiau)i(r.x,r.z,.5);for(const r of o.villages)i(r.x,r.z,.3);for(const r of this.app.island.meta.ahu)i(r.x,r.z,.3);for(const r of o.koa)i(r.x,r.z,.15);return e}isCleared(t,e){const n=ee,i=Math.floor((t+pt)/Zt*n),o=Math.floor((e+pt)/Zt*n);return i>=0&&o>=0&&i<n&&o<n&&this.cleared[o*n+i]===1}landAt(t,e){const n=ee,i=Math.floor((t+pt)/Zt*n),o=Math.floor((e+pt)/Zt*n);if(i<0||o<0||i>=n||o>=n)return null;const r=(o*n+i)*4,a=this.land;return{rain:a[r]/255,sand:a[r+1]/255,rip:a[r+2]/255,field:a[r+3]/255}}writeInstances(t,e){const n=new jt,i=new vi,o=new V,r=new V,a=new Pt,l=new V(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];o.set(h.x,h.y,h.z),i.setFromAxisAngle(l,h.rot),r.setScalar(h.s),n.compose(o,i,r),t.setMatrixAt(c,n),a.setRGB(h.c,h.c*(.96+.08*((h.x*997+h.z*131)%1+1)%1),h.c),t.setColorAt(c,a)}t.count=e.length,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}placeFixed(t){const{terrain:e}=this.app,n=this.app.island.meta.sites,i=Object.fromEntries(uc.map(c=>[c,[]])),o=n.houses,r=(c,h,f)=>!o.some(u=>Math.abs(u.x-c)<f&&Math.abs(u.z-h)<f&&Math.hypot(u.x-c,u.z-h)<f),a=(c,h,f,u=1)=>{const d=e.heightAt(h,f);return d<=.003?!1:(i[c].push({x:h,y:d,z:f,rot:t()*Math.PI*2,s:he*u*(.8+t()*.45),c:.85+t()*.3}),!0)};for(const c of n.villages){const h=c.alii?26:c.model?20:12;for(let f=0;f<h;f++){const u=t()*Math.PI*2,d=.12+t()*.7,x=c.x+Math.cos(u)*d,g=c.z+Math.sin(u)*d;if(!r(x,g,.09))continue;const m=this.landAt(x,g),p=m&&m.sand>.3||t()<.3?"niu":t()<.4?"ulu":t()<.5?"kukui":"maia";a(p,x,g)}for(let f=0;f<(c.model?24:10);f++){const u=o[Math.floor(t()*o.length)];if(u.village!==c.id)continue;const d=t()*Math.PI*2;a(t()<.75?"ki":"kiRed",u.x+Math.cos(d)*.08,u.z+Math.sin(d)*.08,.9)}}const l=this.app.island.meta.trail;for(let c=0;c<l.length;c++){const h=l[c];for(let f=0;f<3;f++){const u=h[0]+(t()-.5)*2.6,d=h[1]+(t()-.5)*2.6,x=this.landAt(u,d);if(!x)continue;const g=e.heightAt(u,d);g<=.003||g>.4||(x.sand>.4&&t()<.5?a("naupaka",u,d,.8):x.rain>.42&&t()<.5?a("hala",u,d):t()<.45?a("niu",u,d):x.rain<.3&&t()<.5&&a("aalii",u,d,.8))}}for(const c of n.loi){const h=c.paddies,f=(u,d,x)=>h.some(g=>Math.abs(g.c[0]-u)<.4&&Math.abs(g.c[1]-d)<.4&&(Ya(g.poly,u,d)||g.poly.some(m=>Math.hypot(m[0]-u,m[1]-d)<x)));for(let u=0;u<h.length;u+=2){const d=h[u],x=d.poly[Math.floor(t()*d.poly.length)],g=x[0]-d.c[0],m=x[1]-d.c[1],p=Math.hypot(g,m)||1,_=x[0]+g/p*.04,v=x[1]+m/p*.04;if(f(_,v,.025))continue;const y=t();y<.3?a("maia",_,v):y<.5&&!f(_+g/p*.1,v+m/p*.1,.08)?a("kukui",_+g/p*.1,v+m/p*.1):y<.75&&a(t()<.8?"ki":"kiRed",_,v,.9)}}return i}buildTile(t,e){const{terrain:n}=this.app,i=Math.round(Pe/.17),o=Pe/i,r=Object.fromEntries(ps.map(x=>[x,[]]));let a=1/0,l=-1/0;for(let x=0;x<i;x++)for(let g=0;g<i;g++){const m=t*i+x,p=e*i+g,_=Rn(m,p,11),v=Rn(m,p,12),y=(m+_)*o,T=(p+v)*o,w=this.landAt(y,T);if(!w||w.sand>.2||w.field>.3||this.isCleared(y,T))continue;const E=n.metresAt(y,T);if(E<3)continue;const A=w.rain+(Rn(m,p,3)-.5)*.12,M=Math.min(1,Math.max(0,(A-.3)/.22)),S=Rn(m,p,13);let C=null;if(S<M*.85?w.rip>.4&&E<450&&S<.5?C="kukui":E>600&&A>.45?C=Rn(m,p,7)<.7?"ohia":"koa":E>350?C=Rn(m,p,8)<.55?"koa":"ohia":C=A>.5?"ohia":"kukui":A<.3&&S<.08&&(C=E<500&&Rn(m,p,9)<.5?"wiliwili":"aalii"),!C||n.normalAt(y,T).y<.35&&Rn(m,p,5)<.7)continue;const I=n.heightAt(y,T);r[C].push(y,I,T,_*6.28,he*(.75+v*.6)*(C==="aalii"?.8:1),.82+S*.35,Rn(m,p,14)),a=Math.min(a,I),l=Math.max(l,I)}const c={};let h=0;for(const x of ps){const g=r[x],m=g.length/7,p=new Float32Array(m*16),_=new Float32Array(m*3);for(let v=0;v<m;v++){const[y,T,w,E,A,M,S]=g.slice(v*7,v*7+7),C=Math.cos(E)*A,I=Math.sin(E)*A;p.set([C,0,-I,0,0,A,0,0,I,0,C,0,y,T,w,1],v*16),_.set([M,M*(.96+.08*S),M],v*3)}c[x]={mat:p,col:_,n:m},h+=m}const f=t*Pe,u=e*Pe,d=h?new wn(new V(f-.2,a,u-.2),new V(f+Pe+.2,l+.3,u+Pe+.2)):null;return{data:c,box:d,total:h}}update(t){const e=t.position,n=Math.max(0,this.app.terrain.heightAt(e.x,e.z)),i=e.y-n,o=i<14;for(const g in this.meshes)this.meshes[g].visible=i<60;this.group.visible=i<60;for(const g of ps)this.forest.near[g].visible=o,this.forest.far[g].visible=o;if(!o)return;t.updateMatrixWorld(),this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const r=Sa,a=Math.floor((e.x-r)/Pe),l=Math.floor((e.x+r)/Pe),c=Math.floor((e.z-r)/Pe),h=Math.floor((e.z+r)/Pe),f=[],u=[],d=[];let x="";for(let g=a;g<=l;g++)for(let m=c;m<=h;m++){const p=g*Pe,_=m*Pe,v=Math.max(p-e.x,0,e.x-p-Pe),y=Math.max(_-e.z,0,e.z-_-Pe),T=Math.hypot(v,y);if(T>r)continue;const w=g*8192+m,E=this.tiles.get(w);if(!E){d.push([T,g,m]);continue}if(!E.box||!this.frustum.intersectsBox(E.box))continue;const A=Math.hypot(Math.max(Math.abs(p-e.x),Math.abs(p+Pe-e.x)),Math.max(Math.abs(_-e.z),Math.abs(_+Pe-e.z))),M=T<ms[1]+.3,S=A>ms[0]-.3;M&&f.push(E),S&&u.push(E),x+=`${w}${M?"n":""}${S?"f":""},`}d.sort((g,m)=>g[0]-m[0]);for(let g=0;g<Math.min(d.length,10);g++){const[,m,p]=d[g];this.tiles.set(m*8192+p,this.buildTile(m,p))}if(this.tiles.size>3e3)for(const[g,m]of this.tiles){const p=Math.floor(g/8192+.5),_=g-p*8192;Math.hypot((p+.5)*Pe-e.x,(_+.5)*Pe-e.z)>r*3&&this.tiles.delete(g)}x!==this.lastSelection&&(this.lastSelection=x,this.fill(this.forest.near,f),this.fill(this.forest.far,u))}fill(t,e){for(const n of ps){const i=t[n],o=i.instanceMatrix.count,r=i.instanceMatrix,a=i.instanceColor;let l=0;for(const c of e){const h=c.data[n];if(!h.n)continue;const f=Math.min(h.n,o-l);if(f<=0)break;r.array.set(f===h.n?h.mat:h.mat.subarray(0,f*16),l*16),a.array.set(f===h.n?h.col:h.col.subarray(0,f*3),l*3),l+=f}i.count=l,l&&(r.clearUpdateRanges(),r.addUpdateRange(0,l*16),r.needsUpdate=!0,a.clearUpdateRanges(),a.addUpdateRange(0,l*3),a.needsUpdate=!0)}}}const ba=3,ho=10,U1=.022,uo=.03,fc=1.83*he,dc=.014,ln=1.8*he,F1=.0145,Pn=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},pc=s=>s-Math.PI*2*Math.round(s/(Math.PI*2)),mc=s=>{const t=s<0?1.3:3.5;return-2*s/(t*t)*Math.exp(-s*s/(t*t))};function gc(s,t){const e=new Se,n=yt("#7a4b30",.1,t),i=yt("#b08a5a",.15,t);return s==="stand"?(e.box(-.12,0,0,.16,.85,.18,n,J.skin,0,.8),e.box(.12,0,0,.16,.85,.18,n,J.skin,0,.8),e.box(0,.78,0,.42,.32,.26,i,J.plain),e.box(0,1.05,0,.44,.5,.24,n,J.skin,0,.85),e.box(-.3,.88,0,.11,.62,.12,n,J.skin),e.box(.3,.88,0,.11,.62,.12,n,J.skin),e.blob(0,1.68,0,.13,.15,.13,yt("#3a2418",.1,t),J.skin,1,!1)):s==="bend"?(e.box(-.12,0,0,.16,.8,.18,n,J.skin,0,.8),e.box(.12,0,0,.16,.8,.18,n,J.skin,0,.8),e.box(0,.72,.05,.42,.3,.3,i,J.plain),e.hexa([[-.22,.75,.05],[.22,.75,.05],[.2,.8,.62],[-.2,.8,.62]],[[-.22,.95,.05],[.22,.95,.05],[.2,1.05,.62],[-.2,1.05,.62]],n,J.skin),e.box(0,.78,.62,.4,.27,.1,n,J.skin),e.box(-.24,.35,.6,.1,.5,.1,n,J.skin),e.box(.24,.35,.6,.1,.5,.1,n,J.skin),e.blob(0,1.02,.8,.13,.14,.14,yt("#3a2418",.1,t),J.skin,2,!1)):(e.box(0,0,0,.6,.2,.42,i,J.plain),e.box(0,.18,0,.42,.55,.24,n,J.skin,0,.85),e.box(-.28,.2,.08,.1,.45,.1,n,J.skin),e.box(.28,.2,.08,.1,.45,.1,n,J.skin),e.blob(0,.86,0,.13,.15,.13,yt("#3a2418",.1,t),J.skin,3,!1)),e.geometry()}function nn(s,t,e,n,i,o,r){const a=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(a[0],a[1],a[2])||1,c=[a[0]/l,a[1]/l,a[2]/l],h=Math.abs(c[0])<.9?[1,0,0]:[0,0,1],f=h[0]*c[0]+h[1]*c[1]+h[2]*c[2],u=[h[0]-f*c[0],h[1]-f*c[1],h[2]-f*c[2]],d=Math.hypot(u[0],u[1],u[2]);for(let m=0;m<3;m++)u[m]/=d;const x=[u[1]*c[2]-u[2]*c[1],u[2]*c[0]-u[0]*c[2],u[0]*c[1]-u[1]*c[0]],g=m=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([p,_])=>[m[0]+(u[0]*p*n+x[0]*_*i)/2,m[1]+(u[1]*p*n+x[1]*_*i)/2,m[2]+(u[2]*p*n+x[2]*_*i)/2]);s.hexa(g(t),g(e),o,r)}function Mo(s,t){const e=new Se,n=yt("#7a4b30",.1,t),i=yt("#b08a5a",.15,t),o=yt("#3a2418",.1,t);if(s==="ride"){for(const r of[1,-1])nn(e,[0,0,.38*r],[.1,.46,.3*r],.13,.13,n,J.skin),nn(e,[.1,.46,.3*r],[0,.86,.12*r],.15,.15,n,J.skin);e.box(0,.74,0,.28,.24,.42,i,J.plain),nn(e,[0,.84,0],[.12,1.34,0],.24,.42,n,J.skin),nn(e,[.1,1.28,.2],[.2,1.1,.8],.1,.1,n,J.skin),nn(e,[.1,1.28,-.2],[.16,1.2,-.76],.1,.1,n,J.skin),e.blob(.16,1.5,0,.13,.15,.13,o,J.skin,4,!1)}else if(s==="sit"){for(const r of[1,-1])nn(e,[.12*r,.04,-.42],[.22*r,-.06,-.02],.15,.15,n,J.skin),nn(e,[.22*r,-.06,-.02],[.24*r,-.5,.08],.13,.13,n,J.skin),nn(e,[.25*r,.56,-.44],[.2*r,.1,-.16],.1,.1,n,J.skin);e.box(0,-.02,-.45,.42,.2,.3,i,J.plain),e.box(0,.12,-.46,.42,.52,.24,n,J.skin,0,.85),e.blob(0,.82,-.44,.13,.15,.13,o,J.skin,5,!1)}else{for(const r of[1,-1])nn(e,[.1*r,.08,-.32],[.1*r,.07,-1.25],.15,.14,n,J.skin);e.box(0,0,-.3,.4,.2,.3,i,J.plain),nn(e,[0,.11,-.16],[0,.17,.52],.42,.24,n,J.skin),e.blob(0,.32,.72,.13,.14,.15,o,J.skin,6,!1)}return e.geometry()}function I1(s){const t=new Se;return nn(t,[0,0,0],[0,-.62,0],.1,.1,yt("#7a4b30",.1,s),J.skin),t.geometry()}function z1(s){const t=new Se,e=yt("#6b4630",.1,s);return t.box(0,-.12,-.2,.56,.12,3.2,e,J.wood),t.hexa([[-.28,-.12,1.4],[.28,-.12,1.4],[.1,-.11,1.85],[-.1,-.11,1.85]],[[-.28,0,1.4],[.28,0,1.4],[.1,-.03,1.85],[-.1,-.03,1.85]],e,J.wood),t.geometry()}function _h(s,t){const e=yt("#5e3d27",.1,t),n=yt("#9c7a52",.1,t);for(const i of[1,-1])s.box(.09*i,0,-.3,.05,.1,3,e,J.wood),nn(s,[.09*i,.05,1.18],[.09*i,.22,1.8],.05,.1,e,J.wood);for(const i of[-1.6,-.95,-.3,.35,1])s.box(0,.1,i,.3,.03,.07,e,J.wood);s.box(0,.13,-.2,.24,.03,2.4,n,J.kapa)}const Ea=.16;function k1(s){const t=new Se;return _h(t,s),t.geometry()}function N1(s){const t=new Se;_h(t,s);const e=Mo("prone",s),n=e.attributes.position.array,i=e.attributes.normal.array,o=e.attributes.color.array,r=e.attributes.aMat.array;for(let l=0;l<n.length;l+=3)t.pos.push(n[l],n[l+1]+Ea,n[l+2]+.5),t.nor.push(i[l],i[l+1],i[l+2]),t.col.push(o[l],o[l+1],o[l+2]),t.mat.push(r[l/3]);const a=yt("#7a4b30",.1,s);for(const l of[1,-1])nn(t,[.25*l,Ea+.2,.95],[.12*l,Ea+.02,1.5],.1,.1,a,J.skin);return t.geometry()}function O1(s){const t=new Se,e=yt("#1d1d22",.1,s),n=[[[0,0,.6],[-1.1,.25,-.1],[0,0,-.3]],[[0,0,.6],[0,0,-.3],[1.1,.25,-.1]],[[-1.1,.25,-.1],[-2,-.1,-.5],[-.6,.15,-.25]],[[1.1,.25,-.1],[.6,.15,-.25],[2,-.1,-.5]],[[0,0,-.3],[-.25,0,-1],[.25,0,-1]]];for(const[i,o,r]of n)t.tri(i,o,r,e,J.plain),t.tri(i,r,o,e,J.plain);return t.geometry()}function B1(s,t,e,n,i,o,r,a,l){const c=e-s,h=n-t,f=r-i,u=a-o,d=s-i,x=t-o,g=c*c+h*h,m=c*f+h*u,p=f*f+u*u,_=c*d+h*x,v=f*d+u*x,y=g*p-m*m,T=A=>Math.max(0,Math.min(1,A));let w=y>1e-12?T((m*v-p*_)/y):0,E=(m*w+v)/p;return E<0?(E=0,w=T(-_/g)):E>1&&(E=1,w=T((m-_)/g)),l.x=d+c*w-f*E,l.z=x+h*w-u*E,l.d=Math.hypot(l.x,l.z),l}const H1=`
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
`,G1=`
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
`;class V1{constructor(t){this.app=t,this._m=new jt,this._q=new vi,this._p=new V,this._s=new V,this._e=new Cs,this._c=new Pt;const e=t.island.meta,n=e.sites,i=Ji(e.seed+2024);this.rand=i,this.group=new hn,this.mat=ys(t.shared,{fade:[24,34]});const o=t.terrain,r=(A,M)=>Math.max(0,o.heightAt(A,M));this.people={stand:[],bend:[],sit:[]};const a=(A,M,S,C,I=null,k=1)=>this.people[A].push({x:M,z:S,y:I??r(M,S),rot:C,ph:i()*6.28,tint:k});for(const A of n.loi){const M=A.model?16:5;for(let S=0;S<M;S++){const C=A.paddies[Math.floor(i()*A.paddies.length)];if(!C.flood)continue;const I=C.poly[Math.floor(i()*C.poly.length)],k=i()*.7;let b=C.c[0]+(I[0]-C.c[0])*k,R=C.c[1]+(I[1]-C.c[1])*k;Ya(C.poly,b,R)||([b,R]=C.c),a("bend",b,R,i()*6.28,(C.level-.25)*.013)}}for(const A of n.villages){const M=A.model?12:A.alii?14:4;for(let S=0;S<M;S++){const C=i()*6.28,I=.04+i()*.25;a(i()<.5?"sit":"stand",A.x+Math.cos(C)*I,A.z+Math.sin(C)*I,i()*6.28)}}for(const A of n.heiau.filter(M=>M.model||M.kind==="luakini"))for(let M=0;M<3;M++)a("stand",A.x+(i()-.5)*.12,A.z+(i()-.5)*.08,A.rot+Math.PI,r(A.x,A.z)+.07,2.4);for(const A of n.canoes)for(let M=0;M<(A.village===n.model?5:2);M++)a("stand",A.x+(i()-.5)*.2,A.z+(i()-.5)*.2,A.dir+Math.PI+(i()-.5));for(const A of n.ponds){const M=A.wall[Math.round(A.gates[0]*(A.wall.length-1))];a("stand",M[0]-A.ax*.02,M[1]-A.az*.02,Math.atan2(A.az,A.ax),.02)}const l=Ji(e.seed+2025),c=t.features.holuaPath;if(c&&c.length>1){const A=c[0],M=c[c.length-1],S=Math.hypot(M[0]-A[0],M[2]-A[2]),C=(M[0]-A[0])/S,I=(M[2]-A[2])/S,k=(b,R,N)=>{const G=A[0]+C*b-I*R,D=A[2]+I*b+C*R;this.people[N].push({x:G,z:D,y:Math.max(0,hi(o,G,D)),rot:Math.atan2(I*R,-C*R)+(l()-.5)*.6,ph:0,tint:1})};for(let b=0;b<16;b++)k(S-.05-l()*.7,(b%2?-1:1)*(.125+l()*.075),l()<.6?"stand":"sit");for(let b=0;b<4;b++)k(S*(.35+l()*.4),(l()<.5?-1:1)*(.125+l()*.075),"sit");for(let b=0;b<3;b++)k(.04+l()*.12,-(.13+l()*.07),"stand")}this.poseMeshes={};for(const A of["stand","bend","sit"]){const M=this.people[A],S=Math.max(1,M.length+(A==="stand"?40:0)),C=new Ms(gc(A,i),this.mat,S);C.instanceColor=new Nn(new Float32Array(S*3).fill(1),3),C.frustumCulled=!1,C.instanceMatrix.setUsage(Wi),this.group.add(C),this.poseMeshes[A]=C}this.writeStatic(),this.trail=e.trail.slice();let h=0;for(let A=0;A<this.trail.length;A++){const M=this.trail[A],S=this.trail[(A+1)%this.trail.length];h+=M[0]*S[1]-S[0]*M[1]}h<0&&this.trail.reverse(),this.trailLen=[0];for(let A=1;A<=this.trail.length;A++){const M=this.trail[A-1],S=this.trail[A%this.trail.length];this.trailLen.push(this.trailLen[A-1]+Math.hypot(S[0]-M[0],S[1]-M[1]))}const f=n.alii||n.villages[0];let u=0,d=1/0;for(let A=0;A<this.trail.length;A++){const M=Math.hypot(this.trail[A][0]-f.x,this.trail[A][1]-f.z);M<d&&(d=M,u=this.trailLen[A])}this.procS=u-.6;const x=new Se;g1(x,i),this.akua=new Qt(x.geometry(),this.mat),this.akua.frustumCulled=!1,this.group.add(this.akua),this.boats=[];const g=(()=>{const A=new Se;return gh(A,i,8),A.geometry()})(),m=gc("sit",i),p=e.ahupuaa.find(A=>A.id===n.model);for(let A=0;A<4;A++){const M=n.canoes[A%n.canoes.length],S=A<3&&p?p.mouth:[M.x,M.z],C=A<3?Math.atan2(p.mouth[1]-p.topZ,p.mouth[0]-p.topX):M.dir,I=5+i()*5,k=S[0]+Math.cos(C)*I+(i()-.5)*3,b=S[1]+Math.sin(C)*I+(i()-.5)*3;if(o.heightAt(k,b)>-.02)continue;const R=new hn,N=new Qt(g,this.mat);N.scale.setScalar(he),R.add(N);for(const G of[-1.6,1.4]){const D=new Qt(m,this.mat);D.scale.setScalar(he),D.position.set(G*he,.45*he,0),D.rotation.y=Math.PI/2,R.add(D)}R.position.set(k,0,b),R.rotation.y=i()*6.28,this.group.add(R),this.boats.push({g:R,x:k,z:b,ph:i()*6.28,drift:i()*6.28,crew:2})}const _=new Se;vh(_,i),this.voyager=new Qt(_.geometry(),this.mat),this.voyager.scale.setScalar(he),this.voyager.frustumCulled=!1,this.group.add(this.voyager),this.voyagerS=0,this.breaks=[],this.surfers=[];for(const A of n.surf){const M=this.layBreak(A,o,n.ponds);if(!M)continue;this.breaks.push(M);let S=M.tx[0]-(M.tx[0]*M.nx[0]+M.tz[0]*M.nz[0])*M.nx[0],C=M.tz[0]-(M.tx[0]*M.nx[0]+M.tz[0]*M.nz[0])*M.nz[0];const I=Math.hypot(S,C)||1;S/=I,C/=I;for(let k=0;k<3;k++){const b=k-1,R=l()*.04,N=M.lineX+S*b*.11+M.nx[0]*R,G=M.lineZ+C*b*.11+M.nz[0]*R,D={brk:M,state:"sit",x:N,z:G,slotX:N,slotZ:G,head:M.seaHead+(l()-.5)*.3,look:(l()-.5)*.3,since:-l()*60};Object.assign(D,{s:0,ph:l()*6.28,scale:.92+l()*.2,pace:.85+l()*.3,tint:l()<.3?2.2:.75+l()*.3,wave:0,take:0,lead:.05,tTake:0,a0:0,dur:0,fall:!1,t:0,sx:0,sz:0,fx:0,fz:0,wx:0,wz:0,leg:0}),Object.assign(D,{pose:"sit",pitch:0,roll:0,stroke:0,tilt:!0,tried:!1}),M.surfers.push(D),this.surfers.push(D)}}const v=Math.max(1,this.surfers.length),y=(A,M)=>{const S=new Ms(A,this.mat,M);return S.frustumCulled=!1,S.instanceMatrix.setUsage(Wi),S.count=0,this.group.add(S),S};if(this.boards=y(z1(l),v),this.boards.instanceColor=new Nn(new Float32Array(v*3).fill(1),3),this.surfPose={ride:y(Mo("ride",l),v),sit:y(Mo("sit",l),v),prone:y(Mo("prone",l),v)},this.arms=y(I1(l),v*2),this._sw={age:0,height:0,next:0,id:0},this._sep={d:0,x:0,z:0},this._mb=new jt,this._ml=new jt,this._ma=new jt,this.view={x:0,z:0,dist:1/0,remain:0},this.counts={board:0,ride:0,sit:0,prone:0,arm:0},this.holua=null,c&&c.length>1){const A=c.length,M={x:new Float32Array(A),y:new Float32Array(A),z:new Float32Array(A),n:A,riders:[],runner:null,time:0,next:6+l()*20,watching:!1};for(let b=0;b<A;b++)M.x[b]=c[b][0],M.y[b]=c[b][1]+F1,M.z[b]=c[b][2];M.len=Math.hypot(M.x[A-1]-M.x[0],M.z[A-1]-M.z[0]),M.ds=M.len/(A-1),M.dx=(M.x[A-1]-M.x[0])/M.len,M.dz=(M.z[A-1]-M.z[0])/M.len,M.head=Math.atan2(M.dx,M.dz),this.clearTrack(M);const S=10;for(let b=0;b<S;b++){const R=b%2?1:-1,N=(b>>1)*.035,G={state:b<2?"wait":"walk",s:0,v:0,t:0,since:-b,side:R,ph:l()*6.28,pace:.9+l()*.2};G.spotS=-.02-N,G.spotOff=R*(.09+N*.6),G.wayOff=R*(.14+N*.6),G.s=b<2?0:M.len*(.1+.85*(b-2)/(S-2)),M.riders.push(G)}M.tAt=new Float32Array(A),M.vAt=new Float32Array(A);const C={s:ln,v:1.5};let I=0,k=0;for(let b=!1;k<A&&I<600;I+=.05){for(;k<A&&k*M.ds<=C.s;)M.tAt[k]=I,M.vAt[k]=C.v,k++;if(b)break;b=this.slide(M,C,.05)}for(;k<A;k++)M.tAt[k]=I,M.vAt[k]=0;this.holua=M,this._pose={y:0,pitch:0},this.sleds=y(k1(l),S),this.sledders=y(N1(l),1)}this.birds=new Ms(O1(i),this.mat,12),this.birds.frustumCulled=!1,this.birds.instanceMatrix.setUsage(Wi),this.group.add(this.birds),this.birdCentres=[];for(let A=0;A<12;A++){const M=n.villages[Math.floor(i()*n.villages.length)];this.birdCentres.push({x:M.x+(i()-.5)*6,z:M.z+(i()-.5)*6,r:.6+i()*1.4,h:.9+i()*1.4,ph:i()*6.28,sp:.08+i()*.06})}const T=[],w=[];for(const A of n.villages)for(let M=0;M<14;M++)T.push(A.x+.05,r(A.x,A.z)+.01,A.z+.05),w.push(M/14+i()*.05);const E=new be;E.setAttribute("position",new ne(T,3)),E.setAttribute("aSeed",new ne(w,1)),E.setAttribute("aAge",new ne(new Float32Array(w.length),1)),this.smoke=new th(E,new xe({vertexShader:H1,fragmentShader:G1,uniforms:{uTime:t.shared.uniforms.uTime,uWindVec:t.shared.uniforms.uWindVec,uSkyColor:t.shared.uniforms.uSkyColor,uSunColor:t.shared.uniforms.uSunColor},transparent:!0,depthWrite:!1})),this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,this.group.add(this.smoke)}layBreak(t,e,n){const i=this.app.ocean.swellDir,o=(C,I)=>-e.metresAt(C,I),r=.03,a=(C,I)=>(o(C+r,I)-o(C-r,I))/(2*r),l=(C,I)=>(o(C,I+r)-o(C,I-r))/(2*r),c=Math.cos(t.dir),h=Math.sin(t.dir);let f=null,u=0;for(let C=0;C<1.6;C+=.01)if(o(t.x+c*C,t.z+h*C)>=ba){f=t.x+c*C,u=t.z+h*C;break}if(f===null)return null;const d=(C,I,k,b)=>{if(o(C-k*.1,I-b*.1)<.02)return!1;for(const R of n)if(!(Math.hypot(R.cx-C,R.cz-I)>R.r+1.5)){if(Ya(R.wall,C,I))return!1;for(const N of R.wall)if(Math.hypot(N[0]-C,N[1]-I)<.25)return!1}return!0},x=C=>{const I=[];let k=f,b=u;for(let R=0;R<70;R++){const N=a(k,b),G=l(k,b),D=Math.hypot(N,G);if(D<4)break;let z=-G/D,P=N/D;if(z*i[0]+P*i[1]<0&&(z=-z,P=-P),z*i[0]+P*i[1]<.3)break;k+=z*.03*C,b+=P*.03*C;for(let H=0;H<4;H++){const j=a(k,b),B=l(k,b),Y=j*j+B*B;if(Y<1)break;const K=ba-o(k,b);k+=j*K/Y,b+=B*K/Y}if(!d(k,b,N/D,G/D))break;I.push([k,b])}return I};if(!d(f,u,c,h))return null;const g=x(-1).reverse(),m=[...g,[f,u],...x(1)],p=[0];for(let C=1;C<m.length;C++)p.push(p[C-1]+Math.hypot(m[C][0]-m[C-1][0],m[C][1]-m[C-1][1]));const _=p[p.length-1];if(_<.5)return null;const v=Math.min(1.4,_),y=Math.min(p[g.length],_-v),T=.03,w=Math.floor(v/T)+1,E={n:w,step:T,len:(w-1)*T,x:new Float32Array(w),z:new Float32Array(w),tx:new Float32Array(w),tz:new Float32Array(w),nx:new Float32Array(w),nz:new Float32Array(w),g:new Float32Array(w),surfers:[],called:-1,lastT:0,watching:!1,eager:!1};let A=0;for(let C=0;C<w;C++){const I=y+C*T;for(;A<p.length-2&&p[A+1]<I;)A++;const k=Math.max(0,Math.min(1,(I-p[A])/Math.max(1e-6,p[A+1]-p[A])));E.x[C]=m[A][0]+(m[A+1][0]-m[A][0])*k,E.z[C]=m[A][1]+(m[A+1][1]-m[A][1])*k}for(let C=0;C<w;C++){const I=a(E.x[C],E.z[C]),k=l(E.x[C],E.z[C]),b=Math.hypot(I,k)||1;E.nx[C]=I/b,E.nz[C]=k/b;const R=Math.max(0,C-1),N=Math.min(w-1,C+1),G=Math.hypot(E.x[N]-E.x[R],E.z[N]-E.z[R])||1;E.tx[C]=(E.x[N]-E.x[R])/G,E.tz[C]=(E.z[N]-E.z[R])/G;const D=(E.x[C]-E.x[0])*i[0]+(E.z[C]-E.z[0])*i[1];E.g[C]=C?Math.max(D,E.g[C-1]+1e-4):0}let M=E.x[0]+E.nx[0]*.1,S=E.z[0]+E.nz[0]*.1;for(let C=0;C<3&&o(M,S)<ba+2;C++)M+=E.nx[0]*.02,S+=E.nz[0]*.02;return E.lineX=M,E.lineZ=S,E.seaHead=Math.atan2(E.nx[0],E.nz[0]),E}clearTrack(t){const e=this.app.vegetation;if(!e||!e.cleared)return;const n=e.cleared,i=ee,o=Zt/i,r=.24+.5*o*(Math.abs(t.dx)+Math.abs(t.dz)),a=-.2-r,l=t.len+r,c=[t.x[0]+t.dx*a,t.x[0]+t.dx*l],h=[t.z[0]+t.dz*a,t.z[0]+t.dz*l],f=Math.max(0,Math.floor((Math.min(...c)-r+pt)/o)),u=Math.min(i-1,Math.floor((Math.max(...c)+r+pt)/o)),d=Math.max(0,Math.floor((Math.min(...h)-r+pt)/o)),x=Math.min(i-1,Math.floor((Math.max(...h)+r+pt)/o));for(let g=d;g<=x;g++)for(let m=f;m<=u;m++){const p=-pt+(m+.5)*o-t.x[0],_=-pt+(g+.5)*o-t.z[0],v=p*t.dx+_*t.dz;v>a&&v<l&&Math.abs(_*t.dx-p*t.dz)<r&&(n[g*i+m]=1)}e.tiles&&e.tiles.size&&(e.tiles.clear(),e.lastSelection="")}breakNear(t,e){let n=null,i=3;for(const o of this.breaks){const r=Math.hypot(o.x[0]-t,o.z[0]-e);r<i&&(i=r,n=o)}return n}breakS(t,e){const n=t.g;if(e<=0)return 0;if(e>=n[t.n-1])return t.len;let i=0,o=t.n-1;for(;i<o-1;){const r=i+o>>1;n[r]<=e?i=r:o=r}return(i+(e-n[i])/(n[o]-n[i]))*t.step}writeStatic(){for(const t in this.people){const e=this.poseMeshes[t],n=this.people[t];for(let i=0;i<n.length;i++)this.setInstance(e,i,n[i].x,n[i].y,n[i].z,n[i].rot,he,n[i].tint);e.count=n.length,e.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)}}setInstance(t,e,n,i,o,r,a,l=1,c=0,h=0){this._p.set(n,i,o),this._e.set(c,r,h,"YXZ"),this._q.setFromEuler(this._e),this._s.setScalar(a),this._m.compose(this._p,this._q,this._s),t.setMatrixAt(e,this._m),(l!==1||t.instanceColor)&&t.setColorAt(e,this._c.setRGB(l,l,l))}walkTo(t,e){let n=0,i=1/0;for(let o=0;o<this.trail.length;o++){const r=Math.hypot(this.trail[o][0]-t,this.trail[o][1]-e);r<i&&(i=r,n=this.trailLen[o])}this.procS=n-.12}trailPoint(t){const e=this.trailLen[this.trailLen.length-1];t=(t%e+e)%e;let n=0,i=this.trailLen.length-1;for(;n<i-1;){const l=n+i>>1;this.trailLen[l]<=t?n=l:i=l}const o=this.trail[n%this.trail.length],r=this.trail[(n+1)%this.trail.length],a=(t-this.trailLen[n])/Math.max(1e-6,this.trailLen[n+1]-this.trailLen[n]);return[o[0]+(r[0]-o[0])*a,o[1]+(r[1]-o[1])*a,Math.atan2(r[0]-o[0],r[1]-o[1])]}watch(){const t=this.app.rig,e=t.flight,n=this.view,i=e?e.dest:t.goal;return n.x=i.target.x,n.z=i.target.z,n.dist=i.distance,n.remain=e?(1-e.t)*e.duration:0,n}update(t,e){const n=this.app,i=n.terrain,o=n.camera.position,r=this.watch(),a=n.rig.flight;for(const g of this.breaks){const m=Math.hypot(r.x-g.x[0],r.z-g.z[0])<1.6&&r.dist<5;m&&!g.watching&&(g.due=!0),m?g.due&&(!a||a.t>.3)&&(g.due=!1,this.hurrySet(g,r.remain)):g.due=!1,g.watching=m}const l=this.holua;if(l){l.time+=t;const g=Math.max(0,Math.min(l.len,(r.x-l.x[0])*l.dx+(r.z-l.z[0])*l.dz)),m=Math.hypot(r.x-l.x[0]-l.dx*g,r.z-l.z[0]-l.dz*g)<2&&r.dist<16;m&&!l.watching&&this.holuaFor(l,r),l.watching=m}const c=o.y-Math.max(0,i.heightAt(o.x,o.z))<30;if(this.group.visible=c,!c){l&&l.runner&&l.runner.state==="run"&&this.slide(l,l.runner,t);return}const h=n.season==="hooilo",f=this.poseMeshes.stand;let u=this.people.stand.length;if(this.akua.visible=h,h){this.procS+=t*.0035*Math.max(1,Math.min(8,n.clock.speed/20));for(let g=0;g<11;g++){const[m,p,_]=this.trailPoint(this.procS-g*.035),v=Math.max(0,i.heightAt(m,p))+Math.abs(Math.sin(e*4.2+g))*.0012;this.setInstance(f,u++,m,v,p,_,he,g===5?2.2:1),g===5&&(this.akua.position.set(m,v,p),this.akua.rotation.y=_,this.akua.scale.setScalar(he))}}u=this.updateHolua(t,e,u),f.count=u,f.instanceMatrix.needsUpdate=!0,f.instanceColor&&(f.instanceColor.needsUpdate=!0),this.updateSurf(t,e);for(const g of this.boats)g.g.position.x=g.x+Math.sin(e*.05+g.drift)*.6,g.g.position.z=g.z+Math.cos(e*.04+g.drift)*.6,g.g.position.y=Math.sin(e*1.3+g.ph)*.0015,g.g.rotation.z=Math.sin(e*1.1+g.ph)*.04,g.g.rotation.y+=t*.02;this.voyagerS+=t*.004;const d=155,x=this.voyagerS;this.voyager.position.set(Math.cos(x)*d*.95+10,Math.sin(e*.9)*.002,Math.sin(x)*d*.7),this.voyager.rotation.y=-x-Math.PI/2,this.voyager.rotation.x=.06;for(let g=0;g<this.birdCentres.length;g++){const m=this.birdCentres[g],p=m.ph+e*m.sp,_=m.x+Math.cos(p)*m.r,v=m.z+Math.sin(p)*m.r,y=Math.max(0,i.heightAt(_,v))+m.h+Math.sin(e*.3+g)*.1;this.setInstance(this.birds,g,_,y,v,-p,he*1.4,1,.3)}this.birds.count=this.birdCentres.length,this.birds.instanceMatrix.needsUpdate=!0}hurrySet(t,e){t.eager=!0;let n=!1;for(const a of t.surfers)(a.state==="go"||a.state==="ride")&&(n=!0);if(n||!this.nextUp(t,!0))return;const i=this.app.ocean,o=i.swellTimeAt(t.x[0],t.z[0]),r=lo(o,this._sw);if(e>=1.2&&r.age>7&&r.next>e+9){const a=r.next-(e+8);i.swellT+=a,t.lastT+=a}else r.next<=ho?this.catchLate(t,o,o+r.next):r.age<8&&this.catchLate(t,o,o-r.age)}catchLate(t,e,n){const i=e>n?this.breakS(t,kn.speed*(e-n))+.14:0;for(let o=0;o<t.surfers.length;o++){const r=this.nextUp(t,!0);if(!r)break;if(r.tried=!0,this.goFor(r,t,n,i)){t.eager=!1;break}}for(const o of t.surfers)o.tried=!1}nextUp(t,e){let n=null;for(const o of t.surfers)o.state==="sit"&&!o.tried&&(!n||o.since<n.since)&&(n=o);if(n||!e)return n;let i=1/0;for(const o of t.surfers){if(o.state!=="back"||o.leg<1||o.tried)continue;const r=Math.hypot(o.x-t.lineX,o.z-t.lineZ);r<i&&(i=r,n=o)}return n}callWave(t,e,n,i){const o=this.rand;if(!t.eager&&!i&&o()>.25+.7*(n-.5)*2)return;let r=0;for(const l of t.surfers)l.state==="sit"&&r++;const a=this.nextUp(t,t.eager);if(!(!a||r<2&&!t.eager)&&this.goFor(a,t,e,0)&&(t.eager=!1,r>2&&o()<.35)){const l=Math.max(.16+o()*.1,a.take+.12),c=Math.min(t.n-1,Math.round(l/t.step));let h=null,f=1/0;for(const u of t.surfers){const d=Math.hypot(u.x-t.x[c],u.z-t.z[c]);u!==a&&u.state==="sit"&&d<f&&(f=d,h=u)}h&&this.goFor(h,t,e,l)}}goFor(t,e,n,i){const o=e.lastT-n;for(let r=Math.ceil(i/e.step-1e-6);r<e.n;r++){const a=r*e.step;if(a>e.len-.35)return!1;const l=a>.02?.14:.05,c=this.breakG(e,Math.max(0,a-l))/kn.speed,h=e.x[r]+e.nx[r]*uo,f=e.z[r]+e.nz[r]*uo,u=Math.hypot(h-t.x,f-t.z)/(U1*t.pace);if(c-o<u)continue;const d=this.rand;return Object.assign(t,{state:"go",wave:n,take:a,s:a,lead:l,tTake:c,a0:c-u,sx:t.x,sz:t.z,fx:h,fz:f}),t.dur=10+d()*10,t.fall=d()<.35,t.goofy=d()<.5,!0}return!1}breakG(t,e){const n=Math.max(0,Math.min(t.n-1.001,e/t.step)),i=n|0;return t.g[i]+(t.g[i+1]-t.g[i])*(n-i)}paddleBack(t,e){const n=Math.min(e.n-1,Math.max(0,Math.round(t.s/e.step)));t.state="back",t.leg=0,t.wx=t.x+e.nx[n]*.2,t.wz=t.z+e.nz[n]*.2}updateSurf(t,e){const n=this.app.ocean,i=this._sw,o=this.counts;o.board=o.ride=o.sit=o.prone=o.arm=0;for(const r of this.breaks){const a=n.swellTimeAt(r.x[0],r.z[0]),l=Math.abs(a-r.lastT-t)>1;if(r.lastT=a,lo(a+ho,i),i.age<=ho&&i.id!==r.called){r.called=i.id;const c=a+ho-i.age,h=i.height,f=lo(c+.01,i).next>30;l||this.callWave(r,c,h,f)}for(const c of r.surfers)l&&(c.state==="go"||c.state==="ride")&&this.paddleBack(c,r),this.stepSurfer(c,r,a,t,e);this.separate(r,t);for(const c of r.surfers)this.drawSurfer(c,e)}for(const r in this.surfPose){const a=this.surfPose[r];a.count=o[r],a.visible=o[r]>0,a.instanceMatrix.needsUpdate=!0}this.boards.count=o.board,this.boards.visible=o.board>0,this.boards.instanceMatrix.needsUpdate=!0,this.boards.instanceColor.needsUpdate=!0,this.arms.count=o.arm,this.arms.visible=o.arm>0,this.arms.instanceMatrix.needsUpdate=!0}separate(t,e){const n=t.surfers,i=this._sep;for(let o=0;o<n.length;o++)for(let r=o+1;r<n.length;r++){const a=n[o],l=n[r],c=a.state==="ride"||a.state==="go",h=l.state==="ride"||l.state==="go";if(c&&h)continue;const f=fc*a.scale,u=fc*l.scale,d=Math.sin(a.head)*f,x=Math.cos(a.head)*f,g=Math.sin(l.head)*u,m=Math.cos(l.head)*u;if(B1(a.x-d,a.z-x,a.x+d,a.z+x,l.x-g,l.z-m,l.x+g,l.z+m,i),i.d>=dc)continue;let p=i.x,_=i.z,v=i.d;v<1e-4&&(p=a.x-l.x,_=a.z-l.z,v=Math.hypot(p,_),v<1e-6&&(p=t.tx[0],_=t.tz[0],v=1));const y=Math.min(dc-i.d,.04*e)/v,T=c?0:h?1:.5;a.x+=p*y*T,a.z+=_*y*T,l.x-=p*y*(1-T),l.z-=_*y*(1-T)}}stepSurfer(t,e,n,i,o){const r=n-t.wave;let a="sit",l=t.head,c=2.5,h=0,f=0,u=0;if(t.tilt=!0,t.state==="go"&&r>=t.tTake&&(t.state="ride",t.s=t.take),t.state==="sit")t.x+=(t.slotX+Math.sin(o*.05+t.ph)*.012-t.x)*Math.min(1,i*.3),t.z+=(t.slotZ+Math.cos(o*.04+t.ph)*.012-t.z)*Math.min(1,i*.3),l=e.seaHead+t.look+Math.sin(o*.05+t.ph)*.15,c=.5,h=-.12;else if(t.state==="go"){const d=Math.min(e.n-1,Math.round(t.take/e.step)),x=Math.atan2(t.fx-t.sx,t.fz-t.sz);if(r<t.a0)l=x,c=1.2,h=-.12;else{const g=Math.min(1,(r-t.a0)/Math.max(.001,t.tTake-t.a0)),m=(g<.2?g*g/.4:g-.1)/.9;t.x=t.sx+(t.fx-t.sx)*m,t.z=t.sz+(t.fz-t.sz)*m;const p=Math.atan2(e.tx[d]*.55-e.nx[d]*.85,e.tz[d]*.55-e.nz[d]*.85);l=x+pc(p-x)*Pn(.6,1,g),c=2.2,a="prone",u=1.4,h=-.04,t.tilt=g<.6}}else if(t.state==="ride"){t.tilt=!1;const d=r-t.tTake,x=this.breakS(e,kn.speed*r);let g=e.len;for(const I of e.surfers)I!==t&&(I.state==="ride"||I.state==="out"||I.state==="fall")&&I.wave===t.wave&&I.s>t.s&&(g=Math.min(g,I.s-.08));t.s=Math.max(t.s,Math.min(x+t.lead*Pn(0,1.5,d),t.s+.13*i,g));const m=Math.min(e.n-1.001,t.s/e.step),p=m|0,_=m-p,v=e.x[p]+(e.x[p+1]-e.x[p])*_,y=e.z[p]+(e.z[p+1]-e.z[p])*_,T=e.nx[p],w=e.nz[p],E=Pn(1,3,d),A=uo+(-.03-uo)*Pn(0,1.2,d)+.012*Math.sin(d*1.6+t.ph)*E;t.x=v+T*A,t.z=y+w*A;const M=.9*Math.exp(-d*1.4)+.12-.3*Math.cos(d*1.6+t.ph)*E,S=Math.cos(M),C=Math.sin(M);l=Math.atan2(e.tx[p]*S-T*C,e.tz[p]*S-w*C),c=5,a="ride",h=.06*Math.exp(-d),f=.12*Math.sin(M),(d>=t.dur||t.s>=e.len-.01||x>t.s+.08)&&(t.state=t.fall||x>t.s+.08?"fall":"out",t.t=0)}else if(t.state==="out"||t.state==="fall"){t.t+=i;const d=Math.min(e.n-1,Math.round(t.s/e.step));t.state==="out"?(t.x+=e.nx[d]*i*.01,t.z+=e.nz[d]*i*.01,l=e.seaHead,c=1.8,a=t.t<.6?"ride":"sit",h=-.12,t.tilt=t.t>.6):(t.x-=e.nx[d]*i*.02,t.z-=e.nz[d]*i*.02,a=t.t<1.8?null:"prone",f=Math.PI*Pn(0,.5,t.t)*(1-Pn(1.2,1.8,t.t)),h=.4*Math.sin(Math.min(t.t,1.8)*3.5),c=0,t.tilt=!1),t.t>2.6&&this.paddleBack(t,e)}else if(t.state==="back"){const d=t.leg===0?t.wx:t.slotX+(t.leg===1?e.nx[0]*.12:0),x=t.leg===0?t.wz:t.slotZ+(t.leg===1?e.nz[0]*.12:0),g=d-t.x,m=x-t.z,p=Math.hypot(g,m),_=.017*t.pace*(t.leg===2?.6:1);p<_*i+.003?t.leg===2?(t.state="sit",t.since=o):t.leg++:(t.x+=g/p*_*i,t.z+=m/p*_*i,l=Math.atan2(g,m)),c=1.5,a="prone",u=t.leg===2?.6:.85,h=-.04}t.head+=pc(l-t.head)*Math.min(1,i*c),t.pose=a,t.pitch=h,t.roll=f,t.stroke=u}drawSurfer(t,e){const n=.0012+Math.sin(e*1.7+t.ph)*4e-4;let i=t.pitch,o=t.roll;if(t.pose!=="ride"&&(i+=Math.sin(e*1.1+t.ph)*.03,o+=Math.sin(e*.9+t.ph*1.3)*.04),t.tilt){const c=this.app.ocean,h=lo(c.swellTimeAt(t.x,t.z),this._sw),f=c.swellDir,u=(mc(h.age)*h.height+mc(-h.next))*(.014/kn.speed);i+=u*(f[0]*Math.sin(t.head)+f[1]*Math.cos(t.head))}const r=this.counts,a=he*t.scale;this.setInstance(this.boards,r.board++,t.x,n,t.z,t.head,a,t.tint,i,o);const l=t.pose;if(l&&(this.setInstance(this.surfPose[l],r[l]++,t.x,n,t.z,t.head+(l==="ride"&&t.goofy?Math.PI:0),a,1,i,o),l==="prone")){this._mb.copy(this._m);for(let c=1;c>=-1;c-=2){const h=(e*t.stroke+t.ph+(c>0?0:.5))%1,f=(h-.55)/.45,u=h<.55?1.3-1.6*h/.55:-.3+1.6*f,d=h<.55?0:Math.sin(Math.PI*f)*1.1;this._ml.makeRotationZ(c*d),this._ma.makeRotationX(-u),this._ml.multiply(this._ma).setPosition(.25*c,.2,.45),this._ma.multiplyMatrices(this._mb,this._ml),this.arms.setMatrixAt(r.arm++,this._ma)}}}trackY(t,e){const n=Math.max(0,Math.min(t.n-1.001,e/t.ds)),i=n|0;return t.y[i]+(t.y[i+1]-t.y[i])*(n-i)}sledOnTrack(t,e,n){const i=this.trackY(t,e+ln),o=this.trackY(t,e-ln);return n.y=Math.max((i+o)/2,this.trackY(t,e)),n.pitch=Math.atan2(o-i,ln*2),n}slide(t,e,n){const i=t.len-ln-.005,o=Math.ceil(n/.02),r=n/o;for(let a=0;a<o;a++){const l=(this.trackY(t,e.s+.02)-this.trackY(t,e.s-.02))/.04*(go/Nt),c=Math.atan(-l);let h=9.8*Math.sin(c)-.11*9.8*Math.cos(c)-.003*e.v*e.v;const f=(i-e.s)/go,u=e.v*e.v/(2*Math.max(f,.5));u>2.5&&(h=Math.min(h,-u)),e.v=Math.max(e.v+h*r,f>1?1.5:0),e.s=Math.min(i,e.s+e.v*Math.cos(c)*r*go)}return e.s>=i-1e-4||e.v<=0}holuaFor(t,e){const n=this.app.camera.position,i=Math.hypot(n.x-(t.x[0]+t.x[t.n-1])/2,n.z-(t.z[0]+t.z[t.n-1])/2)>7;let o=null;for(const f of t.riders)f.state==="wait"&&(!o||f.since<o.since)&&(o=f);if(!o)for(const f of t.riders)(f.state==="home"||f.state==="walk"&&f.s<t.len-3)&&(!o||f.s<o.s)&&(o=f);let r=t.runner;if(!i||e.remain<1.5){r||(t.next=Math.min(t.next,t.time));return}const a=Math.round((t.len-1.3)/t.ds);if(r&&r.state==="run"&&r.s>=a*t.ds&&t.tAt[t.n-1]-t.tAt[Math.min(t.n-1,Math.round(r.s/t.ds))]>e.remain+1.5)return;if(!r||r.state==="rest"||r.state==="run"&&r.s>=a*t.ds){if(!o)return;r&&(r.state="rise"),r=o}for(const f of t.riders)(f.state==="rise"||f.state==="walk"&&f.s>t.len-.3)&&(f.state="walk",f.s=Math.min(f.s,t.len-.3),f.t=0);const l=t.tAt[a]-(e.remain+5);let c=0;for(;c<a&&t.tAt[c]<l;)c++;const h=Math.max(ln,c*t.ds);(r.state!=="run"||r.s<h)&&(r.s=h,r.v=t.vAt[c]),r.state="run",r.t=0,t.runner=r}updateHolua(t,e,n){const i=this.holua;if(!i)return n;const o=this.rand;if(!i.runner&&i.time>=i.next){let a=null;for(const l of i.riders)l.state==="wait"&&(!a||l.since<a.since)&&(a=l);a&&(a.state="walkin",a.t=0,i.runner=a)}this._ns=0;for(const a of i.riders)n=this.stepRider(a,i,t,e,n,o);const r=i.runner?i.runner.state:null;return this.sledders.count=r==="set"||r==="run"||r==="rest"?1:0,this.sledders.visible=this.sledders.count>0,this.sleds.count=this._ns,this.sleds.visible=this._ns>0,this.sleds.instanceMatrix.needsUpdate=!0,this.sledders.instanceMatrix.needsUpdate=!0,n}standY(t,e,n,i,o){const r=hi(this.app.terrain,i,o);return e<0||e>t.len?r:r+(Math.max(r,this.trackY(t,e))-r)*Pn(.056,.032,Math.abs(n))}stepRider(t,e,n,i,o,r){const a=this.app.terrain,l=this.poseMeshes.stand,c=this._pose,h=-e.dz,f=e.dx;t.t+=n;const u=ln;t.state==="rest"&&t.t>2&&(t.state="rise",t.t=0,e.runner=null,e.next=e.time+25+r()*55);let d=0,x=0,g=0,m=!0;if(t.state==="wait"){d=t.spotS,x=t.spotOff,g=e.head+Math.sin(i*.1+t.ph)*.5,m=!1;const y=e.x[0]+e.dx*(d-.012)+h*x,T=e.z[0]+e.dz*(d-.012)+f*x,w=hi(a,y+h*ln,T+f*ln),E=hi(a,y-h*ln,T-f*ln);this.setInstance(this.sleds,this._ns++,y,(w+E)/2,T,Math.atan2(h,f),he,1,Math.atan2(E-w,ln*2))}else if(t.state==="walkin"){const y=u*.5,T=.065*t.side,w=y-t.spotS,E=Math.abs(t.spotOff-T),A=t.t*.022*t.pace,M=(w+E)/(.022*t.pace);A<w?(d=t.spotS+A,x=t.spotOff,g=e.head):A<w+E?(d=y,x=t.spotOff+(T-t.spotOff)*((A-w)/E),g=Math.atan2(h*(T-t.spotOff),f*(T-t.spotOff))):(d=y,x=T+(.016*t.side-T)*Pn(M,M+1.6,t.t),g=e.head),t.t>M+1.6&&(t.state="set",t.t=0,t.s=u,t.v=0)}else{if(t.state==="set"||t.state==="run"||t.state==="rest")return t.state==="set"&&t.t>1.6&&(t.state="run",t.v=1.5),t.state==="run"&&this.slide(e,t,n)&&(t.state="rest",t.t=0),this.sledOnTrack(e,t.s,c),this.setInstance(this.sledders,0,e.x[0]+e.dx*t.s,c.y,e.z[0]+e.dz*t.s,e.head,he,1,c.pitch),o;if(t.state==="rise")this.sledOnTrack(e,t.s,c),this.setInstance(this.sleds,this._ns++,e.x[0]+e.dx*t.s,c.y,e.z[0]+e.dz*t.s,e.head,he,1,c.pitch),d=t.s,x=.016*t.side,g=e.head+Math.PI+t.side*1.2,m=!1,t.t>3&&(t.state="walk",t.t=0);else if(t.state==="walk"){const y=(this.trackY(e,t.s-.02)-this.trackY(e,t.s+.02))/.04;let T=-1;for(const w of e.riders)w!==t&&(w.state==="walk"||w.state==="home"&&w.t<2)&&w.side===t.side&&w.s<t.s&&w.s>T&&(T=w.s);t.s=Math.max(0,T+.03,t.s-.022*t.pace*n/(1+1.2*Math.abs(y))),d=t.s,x=(.016+.074*Pn(0,.15,e.len-t.s))*t.side,g=e.head+Math.PI,t.s<=0&&(t.state="home",t.t=0)}else{const y=.09*t.side,T=Math.abs(t.wayOff-y),w=-t.spotS,E=Math.abs(t.wayOff-t.spotOff),A=t.t*.02*t.pace;let M=0,S=0;A<T?(x=y+(t.wayOff-y)*(A/T),S=t.wayOff-y):A<T+w?(d=T-A,x=t.wayOff,M=-1):(d=t.spotS,x=t.wayOff+(t.spotOff-t.wayOff)*Math.min(1,(A-T-w)/E),S=t.spotOff-t.wayOff),g=Math.atan2(e.dx*M+h*S,e.dz*M+f*S),A>=T+w+E&&(t.state="wait",t.since=i)}}const p=e.x[0]+e.dx*d+h*x,_=e.z[0]+e.dz*d+f*x,v=this.standY(e,d,x,p,_);return m?this.carry(l,o,p,v,_,g,i,t):(this.setInstance(l,o++,p,v,_,g,he),o)}carry(t,e,n,i,o,r,a,l){return i+=Math.abs(Math.sin(a*4.5+l.ph))*6e-4,this.setInstance(t,e++,n,i,o,r,he),this._mb.copy(this._m),this._ml.makeRotationX(-.3).setPosition(.3,1.36,-.2),this._ma.multiplyMatrices(this._mb,this._ml),this.sleds.setMatrixAt(this._ns++,this._ma),e}}function Mh(s,t){const e=new Set,n=.2,i=(u,d)=>Math.floor(u/n)*100003+Math.floor(d/n),o=(u,d)=>{for(let x=-2;x<=2;x++)for(let g=-2;g<=2;g++)if(e.has(i(u+g*n,d+x*n)))return!0;return!1},r=u=>{for(let d=1;d<u.length;d++){const[x,g]=u[d-1],[m,p]=u[d],_=Math.ceil(Math.hypot(m-x,p-g)/(n*.5));for(let v=0;v<=_;v++)e.add(i(x+(m-x)*v/_,g+(p-g)*v/_))}},a=ee,l=Zt/a,c=(u,d)=>{const x=Math.floor((u+pt)/l),g=Math.floor((d+pt)/l);let m=0;for(let p=Math.max(0,g-1);p<=Math.min(a-1,g+1);p++)for(let _=Math.max(0,x-1);_<=Math.min(a-1,x+1);_++)m=Math.max(m,t.area[p*a+_]);return m},h=[],f=s.streams.map((u,d)=>({s:u,k:d})).filter(({s:u})=>u.area>=.9&&u.pts.length>=3).sort((u,d)=>d.s.area-u.s.area);for(const{s:u,k:d}of f){let x=u.pts.length;for(let v=0;v<u.pts.length;v++)if(o(u.pts[v][0],u.pts[v][1])){x=v+1;break}if(x<3)continue;let g=u.pts.slice(0,x).map(v=>[v[0],v[1]]);r(g),g=T1(g,2);const m=new Float32Array(g.length),p=new Float32Array(g.length);let _=0;for(let v=0;v<g.length;v++)v>0&&(m[v]=m[v-1]+Math.hypot(g[v][0]-g[v-1][0],g[v][1]-g[v-1][1])),_=Math.max(_,c(g[v][0],g[v][1])),p[v]=_;h.push({src:d,pts:g,along:m,area:p,lineA:u.area})}return h}const W1=`
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
`,q1=`
${Ne}
${Vn}
${un}
${Wn}
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
`;function X1(s,t){let e=1;for(const n of s){if(t>n.h0&&t<n.h1)return 0;t<=n.h0&&n.r0>0&&(e=Math.min(e,1-vc(((t-(n.h0-n.r0))/n.r0-.15)/.85))),t>=n.h1&&n.r1>0&&(e=Math.min(e,vc((t-n.h1)/n.r1/.85)))}return e}const vc=s=>s<=0?0:s>=1?1:s*s*(3-2*s);function Y1(s,t){const e=[],n=[],i=[],o=[],r=c=>t.some(h=>c>h.h0+1e-6&&c<h.h1-1e-6),a=t.flatMap(c=>[c.h0-c.r0,c.h0-c.r0*.85,c.h0-c.r0*.45,c.h0,c.h1,c.h1+c.r1*.4,c.h1+c.r1*.85,c.h1+c.r1]).sort((c,h)=>c-h),l=(c,h,f)=>{e.push(c),n.push(h),i.push(f),o.push(f?0:X1(t,h))};for(let c=0;c<s.pts.length;c++){if(c>0){const h=s.along[c-1],f=s.along[c];for(const u of a){if(u<=h+1e-6||u>=f-1e-6)continue;const d=(u-h)/(f-h),x=s.pts[c-1],g=s.pts[c];l([x[0]+(g[0]-x[0])*d,x[1]+(g[1]-x[1])*d],u,!1)}}l(s.pts[c],s.along[c],r(s.along[c]))}return{pts:e,along:n,gone:i,fade:o}}class j1{constructor(t){var d,x;const e=t.island.meta,n=t.terrain,i=[],o=[],r=[],a=[],l=[];let c=0;const h=((d=t.wailele)==null?void 0:d.lines)||Mh(e,t.island.data),f=(x=t.wailele)==null?void 0:x.cuts;this.cutTris=0;for(let g=0;g<h.length;g++){const m=(f==null?void 0:f.get(g))||[],{pts:p,along:_,gone:v,fade:y}=Y1(h[g],m),T=h[g].lineA,w=Math.min(1,Math.max(0,(Math.log10(T)-.35)/.9)),E=Math.min(.11,.009*Math.sqrt(T)+.012),A=m.map(R=>R.h1);let M=1/0,S=-1,C=!1,I=1/0,k=1/0;const b=[1/0,1/0];for(let R=0;R<p.length;R++){const N=p[Math.max(0,R-1)],G=p[Math.min(p.length-1,R+1)],D=G[0]-N[0],z=G[1]-N[1],P=Math.hypot(D,z)||1,H=-z/P,j=D/P,B=_[R],Y=p[R][0],K=p[R][1];let tt=n.metresAt(Y,K);if(tt<-.5)break;if(v[R]){C=!1,I=k=b[0]=b[1]=1/0;continue}for(const O of m)O.level!==void 0&&Math.abs(B-O.h1)<1e-6&&(M=O.level,S=O.h1+1);B<=S&&(tt=Math.min(tt,M),M=tt),tt=I=Math.min(tt,I);const lt=p[Math.min(p.length-1,R+2)],ht=(tt-n.metresAt(lt[0],lt[1]))/Math.max(10,Math.hypot(lt[0]-Y,lt[1]-K)*100);let q=Math.min(1,Math.max(0,(ht-.08)/.5));for(const O of A)B>O-1e-6&&B<=O+.4&&(q=Math.max(q,1-(B-O)/.4));const X=E*(1+q*.4),it=k=Math.min(k,Math.max(tt,0)*Nt+.012+q*.03);for(const O of[-1,1]){const mt=Y+H*X*O,at=K+j*X*O;let ft=Math.max(0,n.metresAt(mt,at))*Nt+.003;m.length&&(ft=Math.min(ft,it+.04));const ut=O+1>>1;ft=b[ut]=Math.max(it,Math.min(ft,b[ut])),i.push(mt,ft,at),o.push(B,w,q),r.push(O),a.push(y[R])}if(C){l.push(c-2,c-1,c,c-1,c+1,c);const O=_[R-1];m.some(({h0:mt,h1:at})=>O>mt+1e-6&&O<at-1e-6||B>mt+1e-6&&B<at-1e-6||O<mt-1e-6&&B>at+1e-6)&&(this.cutTris+=2)}C=!0,c+=2}}const u=new be;u.setAttribute("position",new ne(i,3)),u.setAttribute("aFlow",new ne(o,3)),u.setAttribute("aSide",new ne(r,1)),u.setAttribute("aFade",new ne(a,1)),u.setIndex(l),u.computeBoundingSphere(),this.uniforms={...t.shared.uniforms,uFlowAll:{value:0}},this.material=new xe({vertexShader:W1,fragmentShader:q1,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new Qt(u,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.app=t}update(){const t=this.app.weather,e=Math.min(1,t.rainTotal/600);this.uniforms.uFlowAll.value+=(e-this.uniforms.uFlowAll.value)*.01;const n=this.app.camera.position;this.mesh.visible=n.y-Math.max(0,this.app.terrain.heightAt(n.x,n.z))<90}}const qe=Zt/yn,Kt=Zt/ee,yh=qe*.5,$1=.12,K1=1.6,re=(s,t,e)=>s<t?t:s>e?e:s,en=(s,t,e)=>{const n=re((e-s)/(t-s),0,1);return n*n*(3-2*n)},Z1=s=>s-Math.PI*2*Math.round(s/(Math.PI*2)),Xe=s=>{const t=Math.sin(s*127.1+311.7)*43758.5453;return t-Math.floor(t)};function xc(s,t,e,n){let i=(e+pt)/Zt*t-.5,o=(n+pt)/Zt*t-.5;i<0&&(i=0),o<0&&(o=0),i>t-1.001&&(i=t-1.001),o>t-1.001&&(o=t-1.001);const r=i|0,a=o|0,l=i-r,c=o-a,h=a*t+r,f=s[h]+(s[h+1]-s[h])*l,u=s[h+t]+(s[h+t+1]-s[h+t])*l;return f+(u-f)*c}const yo=(s,t)=>{const e=re(Math.floor((s+pt)/Kt),0,ee-1);return re(Math.floor((t+pt)/Kt),0,ee-1)*ee+e};function Xi(s,t,e,n,i,o){const r=i-e,a=o-n,l=r*r+a*a||1e-9,c=re(((s-e)*r+(t-n)*a)/l,0,1);return Math.hypot(e+r*c-s,n+a*c-t)}function J1(s,t,e){let n=1/0;for(let i=1;i<e.length;i++)n=Math.min(n,Xi(s,t,e[i-1][0],e[i-1][1],e[i][0],e[i][1]));return n}function wh(s,t){const e=t*t/19.62;return s<=e?Math.sqrt(Math.max(0,s)/4.905):t/9.81+(s-e)/t}function xn(s,t,e=[0,0]){const{pts:n,along:i}=s,o=n.length;if(t<=0)return e[0]=n[0][0],e[1]=n[0][1],0;let r=0,a=o-1;if(t>=i[a])return e[0]=n[a][0],e[1]=n[a][1],a-1;for(;a-r>1;){const c=r+a>>1;i[c]<=t?r=c:a=c}const l=(t-i[r])/(i[a]-i[r]||1);return e[0]=n[r][0]+(n[a][0]-n[r][0])*l,e[1]=n[r][1]+(n[a][1]-n[r][1])*l,r}const fo=.1;function _c(s,t,e){const n=[],i=[0,0];for(let o=0;o<s.length;o++){const r=s[o],a=r.along[r.along.length-1],l=Math.floor(a/fo)+1;if(l<8)continue;const c=new Float64Array(l),h=new Float64Array(l),f=new Float64Array(l),u=new Int32Array(l);for(let m=0;m<l;m++)u[m]=xn(r,m*fo,i),c[m]=i[0],h[m]=i[1],f[m]=t(i[0],i[1]);const d=l-4,x=new Float64Array(l);for(let m=0;m<d;m++)x[m]=(f[m]-f[m+4])/40;let g=0;for(;g<d;){if(!(x[g]>.8)||f[g]<2){g++;continue}const m=g;let p=g;for(;p<d&&x[p]>.8;)p++;let _=p-1;const v=[];for(;;){let S=_+1;for(;S<d&&x[S]<=.8&&S-(_+1)<=5;)S++;if(S<d&&x[S]>.8&&S-(_+1)<=5){for(v.push(_+1);S<d&&x[S]>.8;)S++;_=S-1}else break}g=_+1;let y=m,T=-1/0;for(let S=Math.max(1,m-2);S<=m;S++){const C=x[S+1]-x[S-1];C>T&&(T=C,y=S)}let w=Math.min(l-1,_+4);for(let S=_;S<=Math.min(l-3,_+4);S++)if(x[S]<.3&&x[S+1]<.3&&x[S+2]<.3){w=S;break}const E=f[y]-f[w];if(E<60)continue;let A=!1;for(let S=y;S<=w&&!A;S++)e(c[S],h[S])&&(A=!0);if(A)continue;const M=r.area[u[y]];n.push({laid:o,sLip:y*fo,sBase:w*fo,lip:[c[y],f[y],h[y]],base:[c[w],f[w],h[w]],drop:E,A:M,per:re((Math.log10(M)-.35)/.9,0,1),ledges:v.filter(S=>S>y&&S<w).map(S=>f[y]-f[S]).filter(S=>S>8&&S<E-8),samples:{xs:c,zs:h,hs:f,i0:y,i1:w}})}}return n}function Q1(s,t={}){const e=t.carve!==!1,n=performance.now(),{data:i,meta:o}=s,r=i.height,a=(P,H)=>xc(r,yn,P,H),l=(P,H)=>xc(i.height1024,ee,P,H),c=Mh(o,i),h=performance.now(),f=new Uint8Array(ee*ee);let u=!1;const d=[];for(const P of o.sites.loi)for(const H of P.paddies){const[j,B]=H.c;if(d.push([j,B]),H.level<l(j,B)-25){u=!0;const Y=.3;for(let K=Math.floor((B-Y+pt)/Kt);K<=Math.floor((B+Y+pt)/Kt);K++)for(let tt=Math.floor((j-Y+pt)/Kt);tt<=Math.floor((j+Y+pt)/Kt);tt++)tt<0||K<0||tt>=ee||K>=ee||Math.hypot(-pt+(tt+.5)*Kt-j,-pt+(K+.5)*Kt-B)<=Y&&(f[K*ee+tt]=1)}}const x=(P,H)=>f[yo(P,H)]?l(P,H):a(P,H),g=[...o.sites.houses.map(P=>[P.x,P.z]),...o.sites.villages.map(P=>[P.x,P.z]),...o.sites.heiau.map(P=>[P.x,P.z]),...d],m=(P,H)=>f[yo(P,H)]===1;let p=_c(c,x,m);const _=performance.now(),v=o.ahupuaa.find(P=>P.id===o.sites.model),y=(v==null?void 0:v.trunk)||[],T=y.map(P=>[P[0],P[1]]),w=[];for(const P of p){const j=T.length>1&&J1(P.lip[0],P.lip[2],T)<1.5&&P.A>=2&&P.drop>=100;if(!j&&!(P.A>=3&&P.drop>=120))continue;const{xs:B,zs:Y,hs:K,i0:tt,i1:lt}=P.samples;let ht=-1;for(let dt=lt;dt>tt;dt--){let Et=!0;for(let Rt=tt+1;Rt<dt&&Et;Rt++)Xi(B[Rt],Y[Rt],B[tt],Y[tt],B[dt],Y[dt])>.35&&(Et=!1);if(Et){ht=dt;break}}if(ht<0)continue;const q=[B[tt],Y[tt]],X=[B[ht],Y[ht]],it=Math.hypot(X[0]-q[0],X[1]-q[1]),O=K[tt]-K[ht];if(O<100||it<.6)continue;const mt=(X[0]-q[0])/it,at=(X[1]-q[1])/it,ft=Mc(O,P.A,P.per),ut=[q[0]+mt*ft.sLand,q[1]+at*ft.sLand],Ot=ft.wBase;let Ct=!1;const F=Ot+.5,L=Math.floor((Math.min(q[0],X[0])-F+pt)/Kt),Z=Math.floor((Math.max(q[0],X[0])+F+pt)/Kt),rt=Math.floor((Math.min(q[1],X[1])-F+pt)/Kt),st=Math.floor((Math.max(q[1],X[1])+F+pt)/Kt);for(let dt=Math.max(0,rt);dt<=Math.min(ee-1,st)&&!Ct;dt++)for(let Et=Math.max(0,L);Et<=Math.min(ee-1,Z)&&!Ct;Et++){if(!f[dt*ee+Et])continue;const Rt=-pt+(Et+.5)*Kt,ot=-pt+(dt+.5)*Kt;(Xi(Rt,ot,q[0],q[1],X[0],X[1])<=Ot||Math.hypot(Rt-ut[0],ot-ut[1])<=ft.poolR+.5)&&(Ct=!0)}if(Ct||g.some(dt=>Xi(dt[0],dt[1],q[0],q[1],X[0],X[1])<=Ot+.3))continue;const ct=K[ht],St=K[tt],gt=Math.pow(O,.7)*Math.sqrt(P.A)*(ct<650?1.5:.6)*(St<700?1.3:1)*(j?3:1);w.push({f:P,L:q,B:X,len:it,D:O,b:ht,isModel:j,score:gt,ux:mt,uz:at})}w.sort((P,H)=>H.score-P.score);const E=[];for(const P of w){if(E.length>=4)break;E.some(H=>Math.hypot(H.L[0]-P.L[0],H.L[1]-P.L[1])<8)||E.push(P)}let A=E.findIndex(P=>P.isModel);if(A<0&&E.length){let P=y[0];for(const B of y)Math.abs(B[2]-260)<Math.abs(P[2]-260)&&(P=B);const H=P?P[0]:0,j=P?P[1]:0;A=0;for(let B=1;B<E.length;B++)Math.hypot(E[B].L[0]-H,E[B].L[1]-j)<Math.hypot(E[A].L[0]-H,E[A].L[1]-j)&&(A=B)}A>0&&E.unshift(E.splice(A,1)[0]);const M=[],S=[];for(const P of E){const H=P.f,j=c[H.laid],B=P.f.samples.hs[P.f.samples.i0],Y=P.f.samples.hs[P.b],K=Mc(P.D,H.A,H.per);e&&M.push(tv(r,i.normals,P.L,P.B,B,Y,K,g));const tt=a(P.L[0],P.L[1]),lt=a(P.B[0],P.B[1]),ht=P.L[0]+P.ux*K.sLand,q=P.L[1]+P.uz*K.sLand;let X=1/0;for(let ft=0;ft<16;ft++){const ut=ft/16*Math.PI*2;X=Math.min(X,a(ht+Math.cos(ut)*K.poolR,q+Math.sin(ut)*K.poolR))}const it=a(ht,q),O=Math.max(X-.5,it+1);let mt=H.sLip,at=1/0;for(let ft=0;ft<j.pts.length;ft++){const ut=Math.hypot(j.pts[ft][0]-ht,j.pts[ft][1]-q);ut<at&&j.along[ft]>=H.sLip&&(at=ut,mt=j.along[ft])}S.push({kind:0,laid:H.laid,src:j.src,sLip:H.sLip,sBase:H.sLip+P.len,sPool:mt,lip:[P.L[0],tt,P.L[1]],base:[P.B[0],lt,P.B[1]],drop:tt-O,A:H.A,per:H.per,ledges:[],model:P.isModel,face:[P.ux,P.uz],pool:[ht,O,q],poolR:K.poolR,carve:{faceRun:K.faceRun,faceFrac:K.faceFrac,wFace:K.wFace,sLand:K.sLand,yF:Y+(1-K.faceFrac)*(B-Y)}})}const C=performance.now();M.length&&(p=_c(c,x,m));const I=[];for(const P of p)S.some(H=>H.laid===P.laid&&P.sBase>=H.sLip-.1&&P.sLip<=H.sPool||Math.hypot(H.lip[0]-P.lip[0],H.lip[2]-P.lip[2])<.4)||(delete P.samples,P.kind=1,P.src=c[P.laid].src,I.push(P));I.sort((P,H)=>H.drop-P.drop);const k=[...S,...I].slice(0,wo);for(const P of k)P.rain=i.rain[yo(P.lip[0],P.lip[2])],P.ribbonA=c[P.laid].lineA;const b=performance.now(),R=ev(c,k,i,a),N=performance.now(),G=new Map,D=(P,H,j,B,Y,K)=>{G.has(P)||G.set(P,[]),G.get(P).push({h0:H,h1:j,r0:B,r1:Y,level:K})};for(const P of k){let H=P.kind===0?P.sPool:P.sBase;if(P.kind===0&&e){const{pts:tt,along:lt}=c[P.laid];for(let ht=0;ht<tt.length;ht++){if(lt[ht]<=H||lt[ht]>P.sPool+1.2)continue;const q=tt[ht][0]-P.lip[0],X=tt[ht][1]-P.lip[2],it=q*P.face[0]+X*P.face[1];if(a(tt[ht][0],tt[ht][1])-a(P.lip[0]+P.face[0]*it,P.lip[2]+P.face[1]*it)>4)H=lt[Math.min(tt.length-1,ht+1)];else break}}const j=Math.max(0,P.sLip-(P.kind===0?.06:.03)),B=P.kind===0?P.sLip:Math.min(P.sLip+.12,(P.sLip+P.sBase)/2),Y=P.kind===0?H:Math.max(B,H-.15),K=P.kind===0?.05:H-Y;D(P.laid,B,Y,B-j,K,P.kind===0?P.pool[1]:void 0),P.hand={a:j,b:B,c:P.kind===0?1/0:Y,d:P.kind===0?1/0:Y+K}}if(e)for(const P of S){const[H,j]=P.face,B=Math.hypot(P.base[0]-P.lip[0],P.base[2]-P.lip[2]),Y=(K,tt)=>{const lt=K-P.lip[0],ht=tt-P.lip[2],q=lt*H+ht*j,X=-lt*j+ht*H;return q>-.05&&q<B&&Math.abs(X)<.8*(P.carve.wFace+(1.4-P.carve.wFace)*Math.max(0,q)/B)};for(let K=0;K<c.length;K++){if(K===P.laid)continue;const{pts:tt,along:lt}=c[K];let ht=-1;for(let q=0;q<=tt.length;q++){const X=q<tt.length&&Y(tt[q][0],tt[q][1]);X&&ht<0&&(ht=q),!X&&ht>=0&&(D(K,lt[Math.max(0,ht-1)],lt[Math.min(tt.length-1,q)],.04,.04),ht=-1)}}}const z=performance.now();return{falls:k,threads:R,cuts:G,carved:M,lines:c,akua:S.length?0:-1,trench:u,ms:{lay:h-n,detect:_-h,carve:C-_,threads:N-b,total:z-n}}}function Mc(s,t,e){const o=re(.3+.0025*s,.7,1.1),r=1.4,a=re(.05+5e-4*s+.02*Math.sqrt(t),.06,.3),l=2.2+3.5*e+1.5,c=yh+re(l*wh(.82*s,30)*.01,.1+.06,.1+.3);return{faceFrac:.82,faceRun:.1,wFace:o,wBase:r,poolR:a,v0:l,sLand:c}}function tv(s,t,e,n,i,o,r,a){const l=yn,{faceRun:c,faceFrac:h,wFace:f,wBase:u,poolR:d,sLand:x}=r,g=Math.hypot(n[0]-e[0],n[1]-e[1]),m=(n[0]-e[0])/g,p=(n[1]-e[1])/g,_=i-o,v=o+(1-h)*_,y=2,T=Math.max(1,Math.floor((Math.min(e[0],n[0])-y+pt)/qe)),w=Math.min(l-2,Math.ceil((Math.max(e[0],n[0])+y+pt)/qe)),E=Math.max(1,Math.floor((Math.min(e[1],n[1])-y+pt)/qe)),A=Math.min(l-2,Math.ceil((Math.max(e[1],n[1])+y+pt)/qe)),M=a.filter(I=>I[0]>-pt+T*qe-.5&&I[0]<-pt+w*qe+.5&&I[1]>-pt+E*qe-.5&&I[1]<-pt+A*qe+.5);let S=0;for(let I=E;I<=A;I++)for(let k=T;k<=w;k++){const b=-pt+(k+.5)*qe,R=-pt+(I+.5)*qe,N=b-e[0],G=R-e[1],D=N*m+G*p,z=-N*p+G*m,P=D-yh-K1*z*z;if(P<0||D>g||M.some(lt=>Math.hypot(lt[0]-b,lt[1]-R)<.3))continue;let H=P<c?i+(v-i)*(P/c):v+(o-v)*(P-c)/Math.max(.1,g-c);const j=Math.hypot(D-x,z)/(d*1.1);j<1&&(H-=6*(1-j*j));const B=f+(u-f)*D/g,Y=(1-en(.55*B,B,Math.abs(z)))*(1-en(g-.45,g,D)),K=I*l+k,tt=s[K]+(H-s[K])*Y;tt<s[K]&&(s[K]=tt,S++)}const C=Zt/l;for(let I=E-1;I<=A+1;I++)for(let k=T-1;k<=w+1;k++){const b=I*l+k,R=s[I*l+Math.min(l-1,k+1)]-s[I*l+Math.max(0,k-1)],N=s[Math.min(l-1,I+1)*l+k]-s[Math.max(0,I-1)*l+k],G=-R*Nt/(2*C),D=-N*Nt/(2*C),z=Math.hypot(G,1,D);t[b*4]=Math.round((G/z*.5+.5)*255),t[b*4+1]=Math.round((1/z*.5+.5)*255),t[b*4+2]=Math.round((D/z*.5+.5)*255)}return{i0:T,i1:w,j0:E,j1:A,texels:S}}function ev(s,t,e,n){const i=ee,o=e.rain,r=.25,a=(b,R)=>Math.floor((b+pt)/r)*4096+Math.floor((R+pt)/r),l=new Map,c=[0,0];for(const b of s){const R=b.along[b.along.length-1];for(let N=0;N<=R;N+=.1){xn(b,N,c);const G=a(c[0],c[1]);let D=l.get(G);D||l.set(G,D=[]),D.push(c[0],c[1])}}const h=(b,R,N,G)=>{const D=Math.floor((b+pt)/r),z=Math.floor((R+pt)/r);let P=N,H=!1;for(let j=-1;j<=1;j++)for(let B=-1;B<=1;B++){const Y=l.get((D+B)*4096+z+j);if(Y)for(let K=0;K<Y.length;K+=2){const tt=Math.hypot(Y[K]-b,Y[K+1]-R);tt<P&&(P=tt,H=!0,G&&(G[0]=Y[K],G[1]=Y[K+1]))}}return H},f=t.map(b=>{const R=b.kind===0?1.4:.6;return{a:b.lip,b:b.base,r:R,x0:Math.min(b.lip[0],b.base[0])-R,x1:Math.max(b.lip[0],b.base[0])+R,z0:Math.min(b.lip[2],b.base[2])-R,z1:Math.max(b.lip[2],b.base[2])+R}}),u=(b,R)=>f.some(N=>b>N.x0&&b<N.x1&&R>N.z0&&R<N.z1&&Xi(b,R,N.a[0],N.a[2],N.b[0],N.b[2])<N.r),d=(b,R,N)=>(N[0]=(n(b+.05,R)-n(b-.05,R))/(2*.05*100),N[1]=(n(b,R+.05)-n(b,R-.05))/(2*.05*100),Math.hypot(N[0],N[1]));let x=i,g=-1,m=i,p=-1;for(let b=0;b<i;b++)for(let R=0;R<i;R++)o[b*i+R]>2500&&(R<x&&(x=R),R>g&&(g=R),b<m&&(m=b),b>p&&(p=b));const _=[],v=[0,0],y=new Float64Array(3*404),T=4*qe;for(let b=-pt+(m+.5)*Kt;b<=-pt+(p+.5)*Kt;b+=T)for(let R=-pt+(x+.5)*Kt;R<=-pt+(g+.5)*Kt;R+=T){const N=R+(Xe(R*13.7+b*3.1)-.5)*T,G=b+(Xe(R*5.3-b*11.9)-.5)*T,D=o[yo(N,G)];if(D<=2500)continue;const z=n(N,G);if(z<=60||d(N,G,v)<=1.2||h(N,G,.25)||u(N,G))continue;y[0]=N,y[1]=z,y[2]=G;let P=1,H=N,j=G,B=z,Y=0,K=0,tt=!1;for(let O=0;O<400;O++){const mt=d(H,j,v);if(mt<1e-6)break;const at=H-v[0]/mt*.05,ft=j-v[1]/mt*.05,ut=n(at,ft);if(ut>=B)break;if((B-ut)/5>=.9?(K+=B-ut,Y=0):Y++,H=at,j=ft,B=ut,y[P*3]=H,y[P*3+1]=B,y[P*3+2]=j,P++,Y>=3){tt=!0;break}if(O>2&&h(H,j,.25,c)){y[P*3]=c[0],y[P*3+1]=n(c[0],c[1]),y[P*3+2]=c[1],P++;break}if(B<3)break}if(K<140||(tt&&(P-=3),P<4))continue;let lt=!1;for(let O=2;O<P&&!lt;O+=2)lt=u(y[O*3],y[O*3+2]);if(lt)continue;const ht=[];for(let O=0;O<P;O++)ht.push([y[O*3],y[O*3+1],y[O*3+2]]);const q=d(N,G,v),X=d(N+v[0]/q*.4,G+v[1]/q*.4,v),it=ht[0][1]-ht[ht.length-1][1];_.push({pts:ht,drop:it,rain:D,score:it*Math.sqrt(D/3e3)*(X<.8?1.4:1),room:.35+.5*Xe(N*7.1+G*17.3)})}_.sort((b,R)=>R.score-b.score);const w=new Set,E=.3,A=(b,R)=>Math.floor((b+pt)/E)*4096+Math.floor((R+pt)/E),M=[];for(const b of _){if(M.length>=300)break;const[R,,N]=b.pts[0];if(M.some(z=>Math.abs(z.pts[0][0]-R)<1.7&&Math.abs(z.pts[0][2]-N)<1.7&&Math.hypot(z.pts[0][0]-R,z.pts[0][2]-N)<z.room+b.room))continue;const G=new Set;for(let z=3;z<b.pts.length;z++)G.add(A(b.pts[z][0],b.pts[z][2]));let D=0;for(const z of G)w.has(z)&&D++;if(!(D>3)){for(const z of G)w.add(z);M.push(b)}}for(const b of M){const R=b.pts,N=Math.max(6,Math.round(b.drop/25)),G=[R[0]];let D=1;for(let z=1;z<N-1;z++){const P=R[0][1]-b.drop*z/(N-1);for(;D<R.length-1&&R[D][1]>P;)D++;const H=R[D-1],j=R[D],B=re((H[1]-P)/(H[1]-j[1]||1),0,1);G.push([H[0]+(j[0]-H[0])*B,P,H[2]+(j[2]-H[2])*B])}G.push(R[R.length-1]),b.pts=G}const S=e.area;for(const b of M){const R=b.pts[b.pts.length-1],N=Math.floor((R[0]+pt)/Kt),G=Math.floor((R[2]+pt)/Kt);let D=0;for(let z=Math.max(0,G-1);z<=Math.min(i-1,G+1);z++)for(let P=Math.max(0,N-1);P<=Math.min(i-1,N+1);P++)D=Math.max(D,S[z*i+P]);b.A=D}const C=[...M].sort((b,R)=>R.A-b.A),I=t.find(b=>b.kind===0),k=M.map(b=>{const R=C.indexOf(b)/Math.max(1,C.length-1),N=Math.round(b.pts[0][0]*37+b.pts[0][2]*101),G=b.pts[1][0]-b.pts[0][0],D=b.pts[1][2]-b.pts[0][2],z=Math.hypot(G,D)||1,P=I&&Math.hypot(b.pts[0][0]-I.pool[0],b.pts[0][2]-I.pool[2])<25;return{kind:2,pts:b.pts,lip:b.pts[0],base:b.pts[b.pts.length-1],drop:b.drop,A:b.A,rain:b.rain,thr:.35+.6*Math.pow(R,.8)+(Xe(N)-.5)*.15,prio:b.drop*Math.sqrt(b.rain/3e3)*(P?2:1),catch:[b.pts[0][0],b.pts[0][2],b.pts[0][0]-G/z*1.5,b.pts[0][2]-D/z*1.5]}});return k.sort((b,R)=>R.prio-b.prio),k}const wo=512,po=512,nv=Array.from({length:8},(s,t)=>Math.cos(t/8*Math.PI*2)),iv=Array.from({length:8},(s,t)=>Math.sin(t/8*Math.PI*2)),sv=[60,120,220,1e9],ov=[.25,.5,.75,1],av=`
${Ne}
${Vn}
${un}
${Wn}
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
`,rv=`
${Ne}
${Vn}
${un}
${Wn}
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
`,lv=`
${Ne}
${Vn}
${un}
${Wn}
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
`,cv=`
${Ne}
${Vn}
${un}
${Wn}
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
`;function hv(){const t=new Uint8Array(4096),e=(i,o,r)=>Xe((o%i+i)%i*157+(r%i+i)%i*311+i*17);for(let i=0;i<64;i++)for(let o=0;o<64;o++){let r=0,a=.5;for(let l=0;l<4;l++){const c=4<<l,h=o/64*c,f=i/64*c,u=Math.floor(h),d=Math.floor(f),x=h-u,g=f-d,m=x*x*(3-2*x),p=g*g*(3-2*g),_=e(c,u,d)+(e(c,u+1,d)-e(c,u,d))*m,v=e(c,u,d+1)+(e(c,u+1,d+1)-e(c,u,d+1))*m;r+=(_+(v-_)*p)*a,a*=.5}t[i*64+o]=Math.round(re((r/.9375-.25)/.6,0,1)*255)}const n=new Jn(t,64,64,Vi,sn);return n.wrapS=n.wrapT=pi,n.minFilter=ie,n.magFilter=ie,n.needsUpdate=!0,n}class uv{constructor(t,e){const n=performance.now();this.app=t,this.plan=e,this.enabled=!0,this.debugTime=null,this.list=e.falls,this.threads=e.threads.slice(0,Math.max(0,wo-e.falls.length)),this.nCurtain=e.falls.length,this.n=this.nCurtain+this.threads.length,this.stuck=0,this.nodeKey=new Int32Array(16384).fill(-1),this.nodeVal=new Float64Array(16384),this.build(),this.buildState(),this.buildMist(),this.clearVegetation(),this.group=new hn,this.group.add(this.mesh,this.mist),this.heroes=[];for(let i=0;i<this.nCurtain;i++){const o=this.list[i];o.kind===0&&this.heroes.push({index:i,model:o.model,src:o.src,lip:new V(o.lip[0],o.lip[1]*Nt,o.lip[2]),base:new V(o.pool[0],o.pool[1]*Nt,o.pool[2]),pool:new V(o.pool[0],o.pool[1]*Nt,o.pool[2]),poolR:o.poolR,face:o.face,per:o.per,rain:o.rain,mist:new V(o.pool[0],o.pool[1]*Nt+.35*(o.lip[1]-o.pool[1])*Nt,o.pool[2])})}this.hero=this.heroes[0]||null,this.heroView=null,this.lastStop=-1,this.frustum=new Ls,this.projView=new jt,this.tmp=new V,this.setQuality(t.quality?t.quality.level:2),this.buildMs=performance.now()-n,this.settle()}setHero(t,e=null){this.hero=t,this.heroView=e}fine(t,e){return Math.max(this.app.terrain.metresAt(t,e),this.coarse(0,t,e))}coarse(t,e,n){const i=qe*(1<<t),o=(e+pt)/i,r=(n+pt)/i,a=Math.floor(o),l=Math.floor(r),c=o-a,h=r-l,f=this.node(t,a,l),u=this.node(t,a+1,l),d=this.node(t,a,l+1),x=this.node(t,a+1,l+1),g=f+(u-f)*c+(d-f)*h+(f-u-d+x)*c*h,m=c+h<=1?f+(u-f)*c+(d-f)*h:x+(d-x)*(1-c)+(u-x)*(1-h),p=c>=h?f+(u-f)*c+(x-u)*h:f+(d-f)*h+(x-d)*c;return Math.max(g,m,p)}node(t,e,n){const i=(t*4096+n)*4096+e|0,o=(Math.imul(e,73856093)^Math.imul(n,19349663)^Math.imul(t,83492791))&16383;if(this.nodeKey[o]===i)return this.nodeVal[o];const r=qe*(1<<t),a=this.app.terrain.metresAt(-pt+e*r,-pt+n*r);return this.nodeKey[o]=i,this.nodeVal[o]=a,a}axisOf(t){const e=[0,0];if(t.kind===0)return xn(this.plan.lines[t.laid],Math.max(0,t.sLip-.08),e),{poly:[[e[0],e[1]],[t.lip[0],t.lip[2]],[t.base[0],t.base[2]]],lipAt:Math.hypot(e[0]-t.lip[0],e[1]-t.lip[2])};if(t.kind===1){const a=this.plan.lines[t.laid],l=Math.max(0,t.sLip-.03),c=[];xn(a,l,e),c.push([e[0],e[1]]);for(let h=0;h<a.pts.length;h++)a.along[h]>l+1e-4&&a.along[h]<t.sBase-1e-4&&c.push([a.pts[h][0],a.pts[h][1]]);return xn(a,t.sBase,e),c.push([e[0],e[1]]),{poly:c,lipAt:t.sLip-l}}const n=t.pts,i=n[1][0]-n[0][0],o=n[1][2]-n[0][2],r=Math.hypot(i,o)||1;return{poly:[[n[0][0]-i/r*.05,n[0][2]-o/r*.05],...n.map(a=>[a[0],a[2]])],lipAt:.05}}spine(t,e){const n=t.kind,{poly:i,lipAt:o}=this.axisOf(t),r=[],a=[],l=[];let c=0;for(let q=0;q<i.length;q++)q>0&&(c+=Math.hypot(i[q][0]-i[q-1][0],i[q][1]-i[q-1][1])),i[q].s=c;const h=c,f=n===2?.04:.02;for(let q=0;q<=h+1e-6;q+=f){let X=1;for(;X<i.length-1&&i[X].s<q;)X++;const it=i[X-1],O=i[X],mt=re((q-it.s)/(O.s-it.s||1),0,1);r.push(it[0]+(O[0]-it[0])*mt),a.push(it[1]+(O[1]-it[1])*mt),l.push(q-o)}const u=r.length,d=(q,X)=>{const it=(q+o)/f;let O=Math.floor(it);O<0&&(O=0),O>u-2&&(O=u-2);const mt=it-O;X[0]=r[O]+(r[O+1]-r[O])*mt,X[1]=a[O]+(a[O+1]-a[O])*mt;const at=r[O+1]-r[O],ft=a[O+1]-a[O],ut=Math.hypot(at,ft)||1;return X[2]=at/ut,X[3]=ft/ut,X},x=Math.round(o/f),g=new Float64Array(u);for(let q=0;q<u;q++)g[q]=this.fine(r[q],a[q])*Nt;const m=g[x];for(let q=x+1;q<u;q++)g[q]=Math.min(g[q],g[q-1]);const p=q=>{for(let X=x+1;X<u;X++)if(g[X]<=q){const it=(g[X-1]-q)/(g[X-1]-g[X]||1);return l[X-1]+(l[X]-l[X-1])*it}return l[u-1]},_=t.per??0,v=t.A;let y,T,w,E;n===0?(y=2.2+3.5*_+1.5,T=30,w=re(.08+.03*Math.sqrt(v),.1,.22),E=1.7):n===1?(y=1.2+2.8*_,T=14+14*_,w=re(.03+.02*Math.sqrt(v),.04,.12),E=1.4):(y=.6,T=9,w=.005+.012*re(v/.07,0,1),E=1.25);const A=t.drop,M=n===0?36:n===1?re(Math.round(A/10),12,28):Math.max(6,Math.round(A/25)),S=[];for(let q=0;q<=M;q++)S.push(n===2?A*q/M:A*(q/M)*(q/M));if(n===0)for(const q of[16,10,5,2.5])S.push(A-q);else if(n===1)for(const q of[20,10,4])A>3*q&&S.push(A-q);const C=(t.ledges||[]).slice(0,3);for(const q of C)S.push(q);S.sort((q,X)=>q-X);for(let q=S.length-2;q>0;q--)S[q+1]-S[q]<1&&!C.includes(S[q])&&S.splice(q,1);const I=n===0?1.05:n===1?.1:1.4,k=n===2?.15:.3,b=[0,0,0,0],R=[],N=q=>{d(q.sig,b),q.fx=b[2],q.fz=b[3],q.x=b[0]-b[3]*q.lat,q.z=b[1]+b[2]*q.lat},G=Math.min(.11,.009*Math.sqrt(t.ribbonA??v)+.012)*(n===0?.9:1.25),D=n===0?(t.pool[0]-t.lip[0])*t.face[0]+(t.pool[2]-t.lip[2])*t.face[1]:1/0,z=n===0?-.06:-.03;d(z,b),R.push({x:b[0],y:this.fine(b[0],b[1])*Nt+(n===0?.035:.012),z:b[1],fx:b[2],fz:b[3],d:0,hw:n===0?Math.min(G,.5*w):G,contact:1,tongue:-1,sig:z}),d(0,b);const P=n===0?Math.min(.5*w,Math.max(G,.35*w)):n===1?G:Math.min(.5*w,G*.4+.3*w);R.push({x:b[0],y:m+.004,z:b[1],fx:b[2],fz:b[3],d:0,hw:P,contact:1,tongue:0,sig:0});for(const q of S){const X=m-q*Nt,it=y*wh(q,T)*.01,O=p(X);let mt=.5*w*(1+(E-1)*q/Math.max(1,A));n<2&&(mt*=P/(.5*w)+(1-P/(.5*w))*en(0,n===0?18:20,q));const at=.006+k*mt,ft=Math.min(O+at,D),ut=Math.max(it,ft),Ot=n===0&&O+at>D?0:1-en(0,.03,it+(n===0?$1:0)-ft),Ct={y:X,d:q,hw:mt,contact:Ot,ledge:C.includes(q),sig:ut,lat:0};N(Ct),R.push(Ct)}const H=(q,X)=>{const it=R[Math.max(0,q-1)],O=R[Math.min(R.length-1,q+1)];X[0]=O.x-it.x,X[1]=O.y-it.y,X[2]=O.z-it.z;const mt=Math.hypot(X[0],X[1],X[2])||1;return X[0]/=mt,X[1]/=mt,X[2]/=mt,X},j=[0,0,0],B=A-(4+.03*A),Y=n===2?2:1;for(let q=2;q<R.length;q++){const X=R[q],it=R[q-1];if(q>2&&it.sig>X.sig&&(X.sig=it.sig,X.lat=it.lat,N(X)),X.d>B||n===0&&X.d<3)continue;H(q,j);const O=-X.fz,mt=X.fx;let at=j[1]*mt-j[2]*0,ft=j[2]*O-j[0]*mt,ut=j[0]*0-j[1]*O;const Ot=Math.hypot(at,ft,ut)||1;at/=Ot,ft/=Ot,ut/=Ot;const Ct=n===0?1+(.15+.9*en(10,150,X.d))*I*(1-en(.55*A,B,X.d)):1,F=X.hw*Ct,L=X.hw*(.45+(.25-.45)*X.contact)*Ct,Z=X.sig,rt=X.lat;let st=0;for(;st<80;st++){let ct=!1,St=0;for(let dt=0;dt<8;dt+=Y){const Et=nv[dt],Rt=iv[dt],ot=X.x+O*F*Et+at*L*Rt,$t=X.y+ft*L*Rt,It=X.z+mt*F*Et+ut*L*Rt;$t<this.fine(ot,It)*Nt+.004&&(ct=!0,St+=Et)}if(!ct)break;const gt=n===0?0:St>.5?-.004:St<-.5?.004:0;X.sig+=.005,X.lat+=gt,N(X)}st>=80&&(this.stuck++,X.sig=Z,X.lat=rt,N(X))}const K=R.length;if(K>4){const q=R.map(X=>X.sig??0);for(let X=0;X<4;X++){let it=R[2].sig;for(let mt=3;mt<K;mt++){const at=R[mt].sig,ft=mt+1<K?R[mt+1].sig:at;R[mt].sig=Math.max(q[mt],(it+2*at+ft)/4),it=at}let O=R[2].lat;for(let mt=3;mt<K-1;mt++){const at=R[mt].lat;R[mt].lat=(O+2*at+R[mt+1].lat)/4,O=at}}if(n===1){const X=Math.min(25,.25*A);for(let it=2;it<K;it++)R[it].lat*=1-en(A-X,A,R[it].d)}for(let X=2;X<K;X++)N(R[X])}for(const q of R){if(q.hand=1,!t.hand||n===2||n===0&&q.sig>0)continue;const X=t.sLip+q.sig,it=t.hand;let O=re((X-it.a)/Math.max(1e-6,it.b-it.a),0,1);n===1&&(O=Math.min(O,1-re((X-it.c)/Math.max(1e-6,it.d-it.c),0,1))),q.hand=O}let tt=y,lt=0,ht=0;R[0].T=-.4,R[0].s=-3,R[1].T=0,R[1].s=0;for(let q=2;q<R.length;q++){const X=R[q-1],it=R[q],O=Math.hypot(it.x-X.x,it.z-X.z)*100,mt=(X.y-it.y)/Nt,at=Math.hypot(O,mt),ft=Math.max(1,Math.ceil(at)),ut=mt/Math.max(.5,O),Ot=it.contact>.5?9+(T-9)*en(1.5,5,ut):T;for(let Ct=0;Ct<ft;Ct++)tt=Math.sqrt(Math.max(.25,tt*tt+2*9.81*(mt/ft)*(1-tt*tt/(Ot*Ot)))),lt+=at/ft/Math.max(.5,tt);ht+=at,it.T=lt,it.s=ht,it.ledge&&(tt=2.5)}for(let q=0;q<R.length;q++){const X=R[q];H(q,j),X.tx=j[0],X.ty=j[1],X.tz=j[2];const it=-X.fz,O=X.fx;X.lift=[0,0,0,0];for(let mt=0;mt<4;mt++){let at=this.coarse(mt,X.x,X.z)*Nt+.01-X.y;n!==2&&mt<2&&(at=Math.max(at,this.coarse(mt,X.x-it*X.hw,X.z-O*X.hw)*Nt+.01-X.y),at=Math.max(at,this.coarse(mt,X.x+it*X.hw,X.z+O*X.hw)*Nt+.01-X.y)),X.lift[mt]=Math.max(0,at)}X.along=re(X.d/Math.max(1,A),0,1),X.toBase=A-X.d}return{st:R,W0:w,yL:m,at:d,sigmaT:p,drop:A}}build(){let t=16384;const e={pos:new Float32Array(t*3),axis:new Float32Array(t*3),face:new Float32Array(t*3),fall:new Float32Array(t*4),meta:new Float32Array(t*4),more:new Float32Array(t*3),lift:new Float32Array(t*4)},n={pos:3,axis:3,face:3,fall:4,meta:4,more:3,lift:4};let i=0;const o=(T,w,E,A,M,S,C,I,k,b,R,N,G,D,z,P,H,j,B,Y=1)=>{if(i>=t){t*=2;for(const lt in e){const ht=new Float32Array(t*n[lt]);ht.set(e[lt]),e[lt]=ht}}const K=i*3,tt=i*4;return e.pos[K]=T,e.pos[K+1]=w,e.pos[K+2]=E,e.axis[K]=A,e.axis[K+1]=M,e.axis[K+2]=S,e.face[K]=C,e.face[K+2]=I,e.fall[tt]=k,e.fall[tt+1]=b,e.fall[tt+2]=R,e.fall[tt+3]=N,e.meta[tt]=G,e.meta[tt+1]=D,e.meta[tt+2]=z,e.meta[tt+3]=P,e.more[i*3]=H,e.more[i*3+1]=j,e.more[i*3+2]=Y,B&&(e.lift[tt]=B[0],e.lift[tt+1]=B[1],e.lift[tt+2]=B[2],e.lift[tt+3]=B[3]),i++},r=[],a=[],l=[],c=[],h=[],f=[];this.stations=[],this.pools=[],this.mistSrc=[];const u=(T,w,E,A,M,S,C,I)=>{const k=Math.atan2(C,S),b=o(E,I??this.fine(E,A)*Nt+.003,A,0,1,0,S,C,0,0,M,4,T,w,0,0,1,0,null);for(let R=0;R<=16;R++){const N=R/16*Math.PI*2,G=E+Math.cos(k+N)*M,D=A+Math.sin(k+N)*M;o(G,I??this.fine(G,D)*Nt+.003,D,0,1,0,S,C,0,0,M,4,T,w,1,N,1,0,null),R>0&&a.push(b,b+R,b+R+1)}this.pools.push([E,A,M])},d=(T,w,E,A,M)=>{const S=T.st;let C=-1;for(let I=0;I<S.length;I++){const k=S[I],b=o(k.x,k.y,k.z,k.tx,k.ty,k.tz,k.fx,k.fz,k.s,k.T,k.hw,M,w,E,-1,k.contact,k.along,k.toBase,k.lift,k.hand);o(k.x,k.y,k.z,k.tx,k.ty,k.tz,k.fx,k.fz,k.s,k.T,k.hw,M,w,E,1,k.contact,k.along,k.toBase,k.lift,k.hand),C>=0&&A.push(C,C+1,b,C+1,b+1,b),C=b,M!==2&&this.stations.push(k.x,k.z)}},x=[0,0,0,0];for(let T=0;T<this.nCurtain;T++){const w=this.list[T],E=Xe(T*7.13+1.7),A=this.spine(w,T);w.W0=A.W0,d(A,T,E,w.kind===0?l:c,w.kind);const M=this.plan.lines[w.laid],S=w.kind===0?w.sPool:w.sBase,C=[0,0],I=[0,0];xn(M,S,C),xn(M,S+.15,I);let k=I[0]-C[0],b=I[1]-C[1];const R=Math.hypot(k,b);R<1e-4?(k=w.face?w.face[0]:1,b=w.face?w.face[1]:0):(k/=R,b/=R);const N=w.drop,G=w.kind===0?w.poolR:re(.05+5e-4*N+.02*Math.sqrt(w.A),.06,.3),D=A.st[A.st.length-1],z=w.kind===0?w.pool[0]:D.x,P=w.kind===0?w.pool[2]:D.z,H=.05,j=Math.hypot(this.fine(z+H,P)-this.fine(z-H,P),this.fine(z,P+H)-this.fine(z,P-H))/(2*H*100),B=this.list.some(Y=>Y!==w&&Math.hypot(Y.lip[0]-z,Y.lip[2]-P)<G+.4);(w.kind===0||j<.35&&!B)&&u(T,E,z,P,G,k,b,w.kind===0?w.pool[1]*Nt:void 0),w.poolAt=[z,w.kind===0?w.pool[1]:this.fine(z,P),P,G];for(const Y of(w.ledges||[]).slice(0,3))A.at(A.sigmaT(A.yL-Y*Nt),x),Math.hypot(this.fine(x[0]+H,x[1])-this.fine(x[0]-H,x[1]),this.fine(x[0],x[1]+H)-this.fine(x[0],x[1]-H))/(2*H*100)<.35&&u(T,E+.37,x[0],x[1],G*.6,x[2],x[3]);if(w.kind===0){const Y=-w.face[1],K=w.face[0],tt=[],lt=w.lip[1]-w.carve.yF,ht=.6*w.carve.wFace,q=13,X=1.1*A.W0/ht;for(let it=0;it<=lt+1e-6;it+=8){const O=A.yL-it*Nt;A.at(A.sigmaT(O),x);const mt=[];for(let at=0;at<q;at++){const ft=at/(q-1)*2-1;let ut=x[0]+Y*ft*ht,Ot=x[1]+K*ft*ht;const F=this.fine(ut,Ot)*Nt>=O?1:-1;let L=ut,Z=Ot,rt=!1;for(let It=0;It<200;It++){const Ut=ut+w.face[0]*.005*F,Tt=Ot+w.face[1]*.005*F,bt=this.fine(Ut,Tt)*Nt>=O;if(F<0){if(bt){rt=!0;break}L=Ut,Z=Tt}else if(!bt){L=Ut,Z=Tt,rt=!0;break}ut=Ut,Ot=Tt}if(!rt){mt.push(-1);continue}const st=.02,ct=(this.fine(L+st,Z)-this.fine(L-st,Z))*Nt/(2*st),St=(this.fine(L,Z+st)-this.fine(L,Z-st))*Nt/(2*st),gt=Math.hypot(ct,1,St),dt=[-ct/gt,1/gt,-St/gt],Et=L+dt[0]*.004,Rt=O+dt[1]*.004,ot=Z+dt[2]*.004,$t=[0,0,0,0];for(let It=0;It<4;It++)$t[It]=Math.max(0,this.coarse(It,Et,ot)*Nt+.01-Rt);mt.push(o(Et,Rt,ot,dt[0],dt[1],dt[2],w.face[0],w.face[1],it,X,ht,3,T,E,ft,1-en(.5,.8,dt[1]),it/w.drop,w.drop-it,$t))}tt.push(mt)}for(let it=1;it<tt.length;it++)for(let O=0;O<q-1;O++){const mt=tt[it-1][O],at=tt[it-1][O+1],ft=tt[it][O],ut=tt[it][O+1];mt<0||at<0||ft<0||ut<0||r.push(mt,at,ft,at,ut,ft)}}this.mistSrc.push({id:T,f:w,sp:A,ox:k,oz:b})}for(let T=0;T<this.threads.length;T++){const w=this.threads[T],E=this.nCurtain+T,A=this.spine(w,E);f.push(h.length),d(A,E,Xe(E*3.77+.3),h,2)}f.push(h.length);const g=r.length+a.length+l.length+c.length+h.length,m=i>65535?new Uint32Array(g):new Uint16Array(g);let p=0;for(const T of[r,a,l,c,h])m.set(T,p),p+=T.length;const _=g-h.length;this.decalIdx=r.length,this.threadIdx=f.map(T=>_+T);const v=new be;v.setAttribute("position",new ue(e.pos.slice(0,i*3),3)),v.setAttribute("aAxis",new ue(e.axis.slice(0,i*3),3)),v.setAttribute("aFace",new ue(e.face.slice(0,i*3),3)),v.setAttribute("aFall",new ue(e.fall.slice(0,i*4),4)),v.setAttribute("aMeta",new ue(e.meta.slice(0,i*4),4)),v.setAttribute("aMore",new ue(e.more.slice(0,i*3),3)),v.setAttribute("aLift",new ue(e.lift.slice(0,i*4),4)),v.setIndex(new ue(m,1)),this.verts=i,this.tris=g/3;const y=this.app;this.uniforms={...y.shared.uniforms,uHeight:{value:y.terrain.heightTex},uState:{value:null},uPx:{value:.001},uLodRange:{value:y.terrain.range0},uWaterTime:{value:0},uDebug:{value:0},uPuff:{value:null},uBow:{value:.05},uNightK:{value:.35}},this.material=new xe({vertexShader:av,fragmentShader:rv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:je,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new Qt(v,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=3}buildState(){const t=this.n,e=this.app.weather;this.state=new Float32Array(wo*4),this.stateTex=new Jn(this.state,wo,1,ke,gn),this.stateTex.minFilter=fe,this.stateTex.magFilter=fe,this.stateTex.generateMipmaps=!1,this.stateTex.needsUpdate=!0,this.uniforms.uState.value=this.stateTex,this.kind=new Uint8Array(t),this.per=new Float32Array(t),this.thr=new Float32Array(t),this.cell=new Int32Array(t),this.c1=new Int32Array(t),this.cU1=new Int32Array(t),this.cU2=new Int32Array(t),this.w0=new Float32Array(t),this.lenY=new Float32Array(t),this.flow=new Float32Array(t),this.front=new Float32Array(t),this.wet=new Float32Array(t),this.spate=new Float32Array(t),this.primed=new Float32Array(t),this.turb=new Float32Array(t),this.px=new Float32Array(t),this.pz=new Float32Array(t),this.mid=new Float32Array(t*3);const n=e.G,i=(r,a)=>re(Math.floor((a-e.origin)/e.cell),0,n-1)*n+re(Math.floor((r-e.origin)/e.cell),0,n-1),o=[0,0];for(let r=0;r<t;r++){const a=r<this.nCurtain?this.list[r]:this.threads[r-this.nCurtain];if(this.kind[r]=a.kind,this.per[r]=a.per??0,this.thr[r]=a.thr??0,this.cell[r]=i(a.lip[0],a.lip[2]),a.kind!==2){const l=this.plan.lines[a.laid];xn(l,a.sLip-1,o),this.cU1[r]=i(o[0],o[1]),xn(l,a.sLip-2.5,o),this.cU2[r]=i(o[0],o[1])}this.lenY[r]=a.drop*Nt,this.px[r]=a.lip[0],this.pz[r]=a.lip[2],this.mid[r*3]=(a.lip[0]+a.base[0])/2,this.mid[r*3+1]=(a.lip[1]+a.base[1])/2*Nt,this.mid[r*3+2]=(a.lip[2]+a.base[2])/2,a.kind===2&&(this.cell[r]=i(a.catch[0],a.catch[1]),this.c1[r]=i(a.catch[2],a.catch[3]),this.w0[r]=.6)}}buildMist(){const t=[],e=this.app.weather.wind,n=[0,0,0,0];this.mistAnchors=[];for(const{id:c,f:h,sp:f,ox:u,oz:d}of this.mistSrc){const x=h.drop,g=h.per??0;if(h.kind>1||x<100||g<.2&&h.kind!==0)continue;const m=f.W0*100,p=re((15+.25*x)*(.4+.6*Math.max(g,h.kind===0?.4:0))*Math.sqrt(m/10),10,90),_=h.kind===0?Math.round(re(6+x/25,6,40)*Math.sqrt(m/8)):Math.min(4,Math.round(re(6+x/25,6,40)*Math.sqrt(m/8))),[v,y,T]=h.poolAt,w=[];for(let E=0;E<_;E++){const A=Xe(c*91.3+E*7.7),M=Xe(c*13.1+E*3.3+.5),S=(.35+.25*Xe(c*5.3+E*1.9))*p*.01,C=A*Math.PI*2,I=Math.sqrt(M)*.3*p*.01;w.push([0,v+Math.cos(C)*I,y*Nt+S*.5,T+Math.sin(C)*I,S,u,d])}if(h.kind===0){const E=Math.round(re(x/40,2,10));for(let A=0;A<E;A++){const M=x*(.3+.65*Math.sqrt(Xe(c*3.1+A*11.7)));let S=2;for(;S<f.st.length-1&&f.st[S].d<M;)S++;const C=f.st[S],I=-C.fz,k=C.fx,b=I*e.x+k*e.y>=0?1:-1,R=(1.2+1.3*Xe(c*7.9+A*2.3))*C.hw;w.push([1,C.x+C.fx*.5*C.hw+I*b*C.hw*.5,C.y,C.z+C.fz*.5*C.hw+k*b*C.hw*.5,R,C.fx,C.fz])}}for(const E of(h.ledges||[]).slice(0,3))f.at(f.sigmaT(f.yL-E*Nt),n),w.push([2,n[0],this.fine(n[0],n[1])*Nt+p*.0025,n[1],p*.005,n[2],n[3]]);w.forEach((E,A)=>t.push({m:E,id:c,key:(A+.5)/w.length+.01*Xe(c*17.3+A)})),this.mistAnchors.push(v,y*Nt,T)}t.sort((c,h)=>c.key-h.key);const i=Math.min(po,t.length),o=new Float32Array(po*3),r=new Float32Array(po*4),a=new Float32Array(po*3);for(let c=0;c<i;c++){const{m:h,id:f}=t[c];o.set([h[1],h[2],h[3]],c*3),r.set([h[0],Xe(c*1.618+f*.31),h[4],f],c*4),a.set([h[5],0,h[6]],c*3)}const l=new sh;l.setAttribute("position",new ne([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("iOrigin",new Nn(o,3)),l.setAttribute("iKind",new Nn(r,4)),l.setAttribute("iFace",new Nn(a,3)),l.instanceCount=i,this.nMist=i,this.mistAnchors=new Float32Array(this.mistAnchors),this.uniforms.uPuff.value=hv(),this.mistMaterial=new xe({vertexShader:lv,fragmentShader:cv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:je}),this.mist=new Qt(l,this.mistMaterial),this.mist.frustumCulled=!1,this.mist.renderOrder=4}clearVegetation(){const t=this.app.vegetation;if(!t||!t.cleared)return;const e=ee,n=t.cleared,i=(l,c,h,f)=>{const u=Math.max(0,Math.floor((l-h+pt)/Kt)),d=Math.min(e-1,Math.floor((l+h+pt)/Kt)),x=Math.max(0,Math.floor((c-h+pt)/Kt)),g=Math.min(e-1,Math.floor((c+h+pt)/Kt));for(let m=x;m<=g;m++)for(let p=u;p<=d;p++){const _=-pt+(p+.5)*Kt,v=-pt+(m+.5)*Kt;(f?f(_,v):Math.hypot(_-l,v-c)<=h)&&(n[m*e+p]=1)}};for(let l=0;l<this.stations.length;l+=2)i(this.stations[l],this.stations[l+1],.2);for(const[l,c,h]of this.pools)i(l,c,h+.1);const o=[0,0];for(const l of this.list){if(l.kind!==0)continue;const c=this.plan.lines[l.laid];for(let x=l.sPool;x<l.sPool+1.6;x+=.1)xn(c,x,o),i(o[0],o[1],.32-.12*((x-l.sPool)/1.6));const[h,f]=l.face,u=.75*l.carve.wFace,d=l.carve.faceRun+.6;i(l.lip[0]+h*d*.5,l.lip[2]+f*d*.5,d+u,(x,g)=>{const m=x-l.lip[0],p=g-l.lip[2],_=m*h+p*f,v=-m*f+p*h;return _>=-.1&&_<=d&&Math.abs(v)<u})}const r=this.app.terrain,a=new V;for(const l of this.list){if(l.kind!==0)continue;const[c,,h]=l.lip,[f,,u]=l.pool;i((c+f)/2,(h+u)/2,1.8,(d,x)=>Xi(d,x,c,h,f,u)<1.5&&r.normalAt(d,x,a).y<.45)}}clearSight(t,e){const n=this.app.vegetation;if(!n||!n.cleared)return;const i=this.app.terrain,o=n.cleared,r=ee;let a=!1;for(const l of e){const c=Math.hypot(l.x-t.x,l.z-t.z),h=Math.ceil(c/(Kt*.4));for(let f=1;f<h;f++){const u=f/h,d=t.x+(l.x-t.x)*u,x=t.z+(l.z-t.z)*u;if(!(t.y+(l.y-t.y)*u-Math.max(0,i.heightAt(d,x))>.6))for(const[m,p]of[[0,0],[Kt*.5,0],[-Kt*.5,0],[0,Kt*.5],[0,-Kt*.5]]){const _=Math.floor((d+m+pt)/Kt),v=Math.floor((x+p+pt)/Kt);_<0||v<0||_>=r||v>=r||o[v*r+_]||(o[v*r+_]=1,a=!0)}}}a&&n.tiles&&(n.tiles.clear(),n.lastSelection="")}raw(t){const e=this.app.weather.rain;return Math.min(1.5,(e[this.cell[t]]*this.w0[t]+e[this.c1[t]]*(1-this.w0[t]))/1.2)}targetOf(t,e){if(this.kind[t]===2){const i=Math.max(this.spate[t],this.primed[t]);return en(this.thr[t],this.thr[t]+.3,i)}const n=this.wetOf(t)*1.4+e*.5;return Math.min(1,this.kind[t]===0?this.per[t]*.5+n*1.5:this.per[t]+n)}wetOf(t){const e=this.app.weather.wet;return(e[this.cell[t]]+e[this.cU1[t]]+e[this.cU2[t]])/3}turbOf(t){if(this.kind[t]===2)return 0;const e=this.app.weather,n=e.rain;return en(.3,.8,Math.max(n[this.cell[t]],n[this.cU1[t]],n[this.cU2[t]]))*(e.regime==="kona"?1:.25)}prime(t,e,n){const i=this.app.weather;for(let o=this.nCurtain;o<this.n;o++){const r=this.px[o]-t.x,a=this.pz[o]-t.z;if(r*r+a*a>=e*e)continue;const l=n*en(.1,.45,Math.max(this.raw(o),i.wet[this.cell[o]]));this.primed[o]<l&&(this.primed[o]=l)}}primeStop(){var n;const t=this.app.ui;if(!t||!t.stops)return;this.lastStop=t.index;const e=t.views[(n=t.stops[t.index])==null?void 0:n.id];e&&e.spate&&this.prime(e.target,40,e.spate)}settle(){const t=this.app.streams?this.app.streams.uniforms.uFlowAll.value:0;for(let n=this.nCurtain;n<this.n;n++)this.spate[n]=this.raw(n);const e=this.app.ui;e&&e.index!==this.lastStop&&this.primeStop();for(let n=0;n<this.n;n++){const i=this.targetOf(n,t);this.flow[n]=i,this.front[n]=i>.05?1.15:0,this.wet[n]=i,this.turb[n]=this.turbOf(n),this.state[n*4]=i,this.state[n*4+1]=this.front[n],this.state[n*4+2]=i,this.state[n*4+3]=this.turb[n]}this.stateTex.needsUpdate=!0}update(t){const e=this.app,n=t*e.clock.speed,i=1-Math.exp(-n/1800),o=1-Math.exp(-n/10800),r=1-Math.exp(-t/2),a=Math.exp(-n/21600),l=e.streams.uniforms.uFlowAll.value,c=e.ui;c&&c.index!==this.lastStop&&this.primeStop();const h=this.state;let f=!1;for(let _=0;_<this.n;_++){if(this.kind[_]===2){const w=this.raw(_);this.spate[_]+=(w-this.spate[_])*(w>this.spate[_]?i:o),this.primed[_]-=this.primed[_]*o}const v=this.targetOf(_,l);this.flow[_]+=(v-this.flow[_])*r,v>.05?this.front[_]=Math.min(1.15,this.front[_]+t/(2+4*this.lenY[_])):this.flow[_]<.03&&(this.front[_]=0),this.wet[_]=Math.max(this.flow[_],this.wet[_]*a);const y=this.turbOf(_);this.turb[_]+=(y-this.turb[_])*(y>this.turb[_]?i:o);const T=_*4;(Math.abs(h[T]-this.flow[_])>1e-4||Math.abs(h[T+1]-this.front[_])>1e-4||Math.abs(h[T+2]-this.wet[_])>1e-4||Math.abs(h[T+3]-this.turb[_])>.001)&&(h[T]=this.flow[_],h[T+1]=this.front[_],h[T+2]=this.wet[_],h[T+3]=this.turb[_],f=!0)}f&&(this.stateTex.needsUpdate=!0);const u=this.uniforms,d=e.camera;u.uLodRange.value=e.terrain.range0,u.uPx.value=2*Math.tan(d.fov/2*(Math.PI/180))/Math.max(1,e.renderer.domElement.height),u.uWaterTime.value=this.debugTime??e.time;const x=d.position,g=x.y-Math.max(0,e.terrain.heightAt(x.x,x.z));this.group.visible=this.enabled&&g<90;let m=1/0;const p=this.mistAnchors;for(let _=0;_<p.length;_+=3){const v=p[_]-x.x,y=p[_+1]-x.y,T=p[_+2]-x.z,w=v*v+y*y+T*T;w<m&&(m=w)}this.mist.visible=this.group.visible&&m<3600,this.holdOrbit()}holdOrbit(){var f;const t=this.app.ui,e=this.app.rig;if(!t||!t.stops||!e||e.flight||!e.autoOrbit)return;const n=t.views[(f=t.stops[t.index])==null?void 0:f.id];if(!n||!n.orbit)return;const o=typeof innerWidth=="number"&&innerWidth<innerHeight&&n.orbitPortrait||n.orbit,r=o[0]-n.yaw,a=o[1]-n.yaw,l=Z1(e.goal.yaw-n.yaw);let c=e.autoOrbit>0?1:-1;c>0&&l>=a?c=-1:c<0&&l<=r&&(c=1);const h=l<r-.05||l>a+.05?1:Math.max(0,Math.min(a-l,l-r));e.autoOrbit=c*(n.distance<60?.012:.02)*(.15+.85*en(0,.12,h))}setQuality(t){const e=re(t|0,0,3),n=Math.min(sv[e],this.threads.length),i=e===0?this.decalIdx:0;this.mesh.geometry.setDrawRange(i,this.threadIdx[n]-i),this.mist.geometry.instanceCount=Math.round(this.nMist*ov[e])}setDebug(t){this.uniforms.uDebug.value=t|0}frame(t,e,n=0,i=.15,o=0){const r=t<this.nCurtain?this.list[t]:this.threads[t-this.nCurtain],a=r.poolAt||r.base,l=r.face?r.face[0]:r.base[0]-r.lip[0],c=r.face?r.face[1]:r.base[2]-r.lip[2],h=Math.atan2(l,c)+n,f=this.app.rig;for(const u of[f.goal,f.state])u.target.set(a[0],Math.max(0,this.app.terrain.heightAt(a[0],a[2])),a[2]),u.distance=e,u.yaw=h,u.pitch=i,u.lift=o;f.flight=null,f.autoOrbit=0}get stats(){const t=this.app;let e=0,n=0;t.camera&&(t.camera.updateMatrixWorld(),this.projView.multiplyMatrices(t.camera.projectionMatrix,t.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView));for(let o=this.nCurtain;o<this.n;o++)this.flow[o]<=.5||(e++,this.tmp.set(this.mid[o*3],this.mid[o*3+1],this.mid[o*3+2]),this.frustum.containsPoint(this.tmp)&&this.tmp.distanceTo(t.camera.position)<70&&n++);const i=this.list.filter(o=>o.kind===0);return{heroes:i.length,model:i.some(o=>o.model),akuaLine:this.hero?this.hero.src:-1,akuaHero:this.heroes.indexOf(this.hero),akuaView:this.heroView,stream:this.nCurtain-i.length,threads:this.threads.length,threadsOn:e,inView:n,mist:this.nMist,verts:this.verts,tris:this.tris,stuck:this.stuck,carvedTexels:this.plan.carved.reduce((o,r)=>o+r.texels,0),trench:this.plan.trench,planMs:Math.round(this.plan.ms.total),buildMs:Math.round(this.buildMs||0),cutTris:t.streams?t.streams.cutTris:-1}}}function Ts(s,t,{filter:e="mip",format:n=ke}={}){const i=new Jn(s,t,t,n,sn);return e==="nearest"?(i.minFilter=fe,i.magFilter=fe):e==="linear"?(i.minFilter=ie,i.magFilter=ie):(i.minFilter=mi,i.magFilter=ie,i.generateMipmaps=!0),i.wrapS=i.wrapT=$e,i.needsUpdate=!0,i}function fv(s){const t=ee,e=new Uint8Array(t*t*4),n=Math.log(300),i=Math.log(12e3),o=new Float32Array(t*t);for(let a=0;a<t*t;a++)o[a]=Math.max(0,Math.min(1,Math.log10(Math.max(1e-6,s.area[a])/.04)/1.6));const r=xh(o,t,2,2);for(let a=0;a<t*t;a++)e[a*4]=Math.round(255*Math.max(0,Math.min(1,(Math.log(s.rain[a])-n)/(i-n)))),e[a*4+1]=Math.round(255*Math.max(0,Math.min(1,s.sand[a]))),e[a*4+2]=Math.round(255*Math.min(1,r[a]*1.6)),e[a*4+3]=s.region[a*4+3];return Ts(e,t)}function dv(s){const t=ee,e=new Uint8Array(t*t*4),n=Zt/t*100,i=b1(t,o=>s.height1024[o]>0);for(let o=0;o<t*t;o++)e[o*4+3]=Math.round(255*Math.min(1,i[o]*n/300));return{tex:Ts(e,t),data:e}}const As=["#8d9cc9","#3d8a4c","#a3d05b","#e3b65e","#f3e2b0","#53d6c8","#2a5aa8"],pv=["#000000","#f0a35e","#6fb6e8","#f2d06b","#9ed27a"];function mv(s){const t=ee,e=As.map(a=>new Pt(a)),n=[new Float32Array(t*t),new Float32Array(t*t),new Float32Array(t*t)];for(let a=0;a<t*t;a++){const l=e[s[a*4+2]]||e[6];n[0][a]=l.r,n[1][a]=l.g,n[2][a]=l.b}const i=n.map(a=>xh(a,t,2,2)),o=new Uint8Array(t*t*4);for(let a=0;a<t*t;a++)o[a*4]=Math.round(255*Math.pow(i[0][a],1/2.2)),o[a*4+1]=Math.round(255*Math.pow(i[1][a],1/2.2)),o[a*4+2]=Math.round(255*Math.pow(i[2][a],1/2.2)),o[a*4+3]=255;const r=Ts(o,t);return r.colorSpace=Le,r}class gv{constructor(t,e){this.canvas=t,this.island=e,this.params=new URLSearchParams(location.search);const n=new Qc({canvas:t,antialias:!1,powerPreference:"high-performance"});n.setClearColor(0,1),this.renderer=n,this.pipeline=new zg(n),this.scene=new Zi,this.camera=new Ye(42,1,.1,9e3),this.light={sunDir:new V(0,1,0),sunColor:new Pt,skyColor:new Pt,groundColor:new Pt,moonDir:new V(0,-1,0),moonColor:new Pt,zenith:new Pt,horizon:new Pt,sunHorizon:new Pt,night:0};const i=new Jn(new Uint8Array([0,0,0,0]),1,1);i.needsUpdate=!0;const o=e.data;this.landTex=fv(o),this.regionTex=Ts(o.region,ee,{filter:"nearest"}),this.linesTex=Ts(o.lines,yn,{filter:"linear"}),this.zoneTex=mv(o.region),this.overlay=new ve(0,0,0,0),this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uShadow:{value:null},uWeather:{value:i},uWeatherRect:{value:new ve(-Zt,-Zt,Zt*2,Zt*2)},uCloudShadowK:{value:0},uCloudMidY:{value:15},uCloudWind:{value:new Dt},uCloudWindDir:{value:new Dt(1,0)},uFarCover:{value:.32},uWetness:{value:0},uLand:{value:this.landTex},uSkyMap:{value:null},uRegion:{value:this.regionTex},uLines:{value:this.linesTex},uZoneTex:{value:this.zoneTex},uOverlay:{value:this.overlay},uHover:{value:0},uFocus:{value:0},uFocusK:{value:0},uMokuColors:{value:pv.map(d=>new Pt(d))},uWindVec:{value:new Dt(1,0)}}};const r=this.params.get("falls");this.wailele=r==="0"?null:Q1(e,{carve:r!=="flat"}),this.terrain=new bg(o,this.shared),this.scene.add(this.terrain.group),this.shadow=new Jg(this.terrain.heightTex),this.shared.uniforms.uShadow.value=this.shadow.texture;const a=dv(o);this.seaTex=a.tex,this.seaData=a.data,this.ocean=new Rg(this.shared,this.terrain.heightTex,a.tex),this.scene.add(this.ocean.mesh),this.sky=new jg,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.weather=new c1(o.height1024,ee);const[l,c]=e.meta.cloudSizes;this.clouds=new l1({shape:o.cloudShape,shapeSize:l,detail:o.cloudDetail,detailSize:c}),this.clouds.uniforms.uWeather.value=this.weather.texture,this.clouds.uniforms.uWeatherRect.value=this.weather.rect,this.clouds.uniforms.uShadow.value=this.shadow.texture,this.clouds.uniforms.uHeight.value=this.terrain.heightTex,this.shared.uniforms.uWeather.value=this.weather.texture,this.shared.uniforms.uWeatherRect.value=this.weather.rect,this.pipeline.atmosphere=this.clouds,this.features=new w1(this),this.scene.add(this.features.group),this.vegetation=new D1(this),this.scene.add(this.vegetation.group),this.life=new V1(this),this.scene.add(this.life.group),this.streams=new j1(this),this.scene.add(this.streams.mesh),this.wailele&&(this.waterfalls=new uv(this,this.wailele),this.scene.add(this.waterfalls.group)),this.flash={t:-10,next:0,pos:new V,k:0},this.rig=new Kg(this.camera,t,this.terrain),this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??9.2),speed:Number(this.params.get("speed")??60)},this.season=this.clock.doy>120&&this.clock.doy<300?"kau":"hooilo",this.params.get("weather")&&this.weather.setMode(this.params.get("weather")),this.sky.update(this.clock.doy,this.clock.hour,0,this.light),this.weather.warm(6,this.light.sunDir.y,this.clock.hour,this.season),this.time=0,this.frames=0,this.updaters=[];const h=n.getContext(),f=h.getExtension("WEBGL_debug_renderer_info"),u=f?String(h.getParameter(f.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(u),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}applyQuality(){var e;const t=[{clouds:.25,steps:26,light:2,range:12,dpr:1},{clouds:.33,steps:34,light:2,range:16,dpr:1.25},{clouds:.42,steps:44,light:3,range:19,dpr:1.5},{clouds:.5,steps:56,light:4,range:22,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.clouds.setScale(t.clouds),this.clouds.uniforms.uSteps.value=t.steps,this.clouds.uniforms.uLightSteps.value=t.light,this.terrain.setRange(t.range),(e=this.waterfalls)==null||e.setQuality(this.quality.level),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}lightning(){const t=this.weather,e=this.flash,n=t.stormiest;n&&(t.regime==="kona"?n.strength>.35:n.strength>.9)&&this.time>e.next&&this.clock.speed>0&&(e.t=this.time,e.pos.set(n.x+(Math.random()-.5)*8,t.base+(t.top-t.base)*(.3+Math.random()*.4),n.z+(Math.random()-.5)*8),e.next=this.time+1.5+Math.random()*(t.regime==="kona"?5:14));const o=this.time-e.t;e.k=o<.6?Math.exp(-o*9)*(.7+.3*Math.sin(o*70))+(o>.12&&o<.22?.6:0):0,this.clouds.uniforms.uFlash.value=e.k,this.clouds.uniforms.uFlashPos.value.copy(e.pos),e.k>0&&this.light.skyColor.offsetHSL(0,0,0).add(new Pt(.25,.27,.35).multiplyScalar(e.k))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.shadow.update(this.renderer,this.light.sunDir),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){var l;const e=this.clock;e.hour+=t*e.speed/3600,e.hour>=24&&(e.hour-=24,e.doy=(e.doy+1)%365),this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t),this.terrain.update(this.camera),this.ocean.update(this.camera,t),this.vegetation.update(this.camera),this.weather.step(t*e.speed,this.light.sunDir.y,e.hour,this.season),this.life.update(t,this.time),this.streams.update(),(l=this.waterfalls)==null||l.update(t),this.lightning();for(const c of this.updaters)c(t,this.time);const n=this.light,i=this.weather,o=this.clouds.uniforms;o.uSunDir.value.copy(n.sunDir),o.uSunColor.value.copy(n.sunColor),o.uSkyColor.value.copy(n.skyColor),o.uGroundColor.value.copy(n.groundColor),o.uFogColor.value.copy(n.horizon),o.uMoonDir.value.copy(n.moonDir),o.uMoonColor.value.copy(n.moonColor),o.uWind.value.copy(i.windOffset),o.uWindDir.value.copy(i.wind),o.uTime.value=this.time,o.uBase.value=i.base,o.uTop.value=i.top;const r=Math.max(0,Math.min(1,(i.state.humidity-1.1)/.3));if(o.uOvercast.value=r,o.uFarCover.value=.32+r*.4,r>0){const c=1-r*.65;n.sunColor.multiplyScalar(c);const h=(n.skyColor.r+n.skyColor.g+n.skyColor.b)/3;n.skyColor.lerp(new Pt(h,h,h*1.04),r*.5).multiplyScalar(1-r*.25)}this.shared.uniforms.uCloudShadowK.value=2.6,this.shared.uniforms.uCloudMidY.value=(i.base+i.top)*.5,this.shared.uniforms.uCloudWind.value.copy(i.windOffset),this.shared.uniforms.uCloudWindDir.value.copy(i.wind),this.shared.uniforms.uFarCover.value=o.uFarCover.value,this.ocean.uniforms.uWind.value.set(i.wind.x/9,i.wind.y/9),this.shared.uniforms.uWindVec.value.set(i.wind.x/9,i.wind.y/9);const a=this.pipeline.uniforms;a.uSunDir.value.copy(n.sunDir),a.uSunColor.value.copy(n.sunHorizon),a.uFogColor.value.copy(n.horizon),a.uExposure.value=.55*(1+2.2*Math.pow(n.night,1.5)),a.uNight.value=n.night,this.sky.group.position.copy(this.camera.position)}}const vv=[{id:"island",icon:"island",title:"Ka Mokupuni",gloss:"the island",text:["A high island raised by two volcanoes and carved by rain. Land is divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili traditionally worked by extended families.","This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones do."]},{id:"rain",icon:"rain",title:"Ka Ua",gloss:"the rain",text:["Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.","So one side of an island is lush and the other dry. Hawaiians have names for hundreds of winds and rains, each belonging to a place. Wai, fresh water, is life — and waiwai, wealth, is water doubled."]},{id:"ahupuaa",icon:"ahupuaa",title:"Ahupuaʻa",gloss:"from the mountain to the sea",zone:null,text:["An ahupuaʻa runs from the uplands to the sea, usually bounded by ridges, so its people have forest, fresh water, farmland, shore and reef within one boundary.","A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.","The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki."]},{id:"akua",icon:"akua",title:"Wao Akua",gloss:"realm of the gods",zone:0,text:["The cloud-wrapped heights are left largely to the gods. People once came only for special purposes — feathers, choice woods, stone for adzes — and with care.","Yet this is the source: mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream."]},{id:"nahele",icon:"nahele",title:"Wao Nahele",gloss:"the forest",zone:1,text:["Below the clouds grow koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.","Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go."]},{id:"loi",icon:"loi",title:"Loʻi Kalo",gloss:"irrigated taro terraces",zone:2,text:["Kalo (taro) is the staff of life, cooked and pounded into poi. Terraces step down the valley floor, fed by an ʻauwai — a ditch that takes part of the stream at a dam and returns it below. The water has to keep moving: cool, flowing water keeps the kalo healthy.","In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo is caring for family."]},{id:"kauhale",icon:"kauhale",title:"Kauhale",gloss:"the family compound",zone:4,text:["A home here is a cluster of hale, each with its purpose: the hale noa, where the family sleeps; the mua, an eating house for men with the family shrine; a separate eating house for women; a house for beating kapa; a canoe house.","Under the ʻai kapu, men and women ate apart. Houses are framed in hardwood, lashed with cordage and thatched with pili grass, on a raised stone paepae."]},{id:"heiau",icon:"heiau",title:"Heiau",gloss:"temple",zone:4,text:["Heiau range from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief. Others are dedicated to Lono for rain and harvests, or to healing and fishing.","On the platform stand the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings."]},{id:"kahakai",icon:"kahakai",title:"Kahakai",gloss:"the shore",zone:4,text:["Most people live near the shore, where the stream meets the sea. Canoes, each hull carved from a single log and steadied by an ama float, are kept out of the sun in a hālau waʻa.","On flat rocks and clay pans, seawater evaporates into paʻakai — salt — for preserving fish."]},{id:"loko",icon:"loko",title:"Loko Iʻa",gloss:"fishpond",zone:5,text:["The most advanced traditional fishponds in the Pacific are Hawaiian. A curved wall of stacked stone, the kuapā, encloses part of the reef flat near a stream mouth, where fresh water mixes with salt.","In the wall are mākāhā — sluice gates of wooden grates. Young fish slip in with the tide, fatten on algae, and grow too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) are raised here."]},{id:"koa",icon:"koa",title:"Koʻa",gloss:"fishing shrine",zone:5,text:["Fishermen build koʻa, stone shrines on the shore, and offer the first fish of a catch to the fishing gods. Offshore fishing grounds are also called koʻa, found by lining up landmarks on land.","Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out."]},{id:"surf",icon:"surf",title:"Heʻe Nalu",gloss:"wave sliding",zone:5,text:["Surfing has always belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.","Each break has its name. The best were sometimes kapu to all but the aliʻi."]},{id:"kula",icon:"kula",title:"Kula",gloss:"the dry plains",zone:3,text:["Where rain is too scarce for loʻi, families farm the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).","Long low walls run across the slopes to break the wind and hold soil and moisture. The great leeward field systems cover tens of square kilometres."]},{id:"ahu",icon:"ahu",title:"Ahu · Makahiki",gloss:"the boundary altar · the season of Lono",zone:4,text:["Where the trail around the island crosses into each ahupuaʻa stands an ahu, a stone altar. When Makaliʻi — the Pleiades — rises at dusk in late autumn, the Makahiki begins: four months honoring Lono, god of rain and growth.","Under chiefly rule, Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden."]},{id:"puuhonua",icon:"puuhonua",title:"Puʻuhonua",gloss:"place of refuge",zone:4,text:["Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.","In wartime, defeated warriors and those who could not fight also found safety there."]},{id:"holua",icon:"holua",title:"Hōlua",gloss:"sledding course",zone:3,text:["During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.","The track is paved with stones and laid with slick grass or leaves; the longest runs for more than a kilometre."]},{id:"malama",icon:"malama",title:"Mālama ʻĀina",gloss:"care for the land",text:["An ahupuaʻa works when each part cares for the next: protected forests make water, water feeds loʻi and fishponds, and people tend it all.","Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles."]}],mo={moae:{name:"Moaʻe",gloss:"trade winds"},kona:{name:"Kona",gloss:"southerly storm"},malie:{name:"Mālie",gloss:"calm"},auto:{name:"Auto",gloss:"let the weather change"}},Ta={kau:{name:"Kau",gloss:"the dry season"},hooilo:{name:"Hoʻoilo",gloss:"the wet season"}},xv={island:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',rain:'<path d="M7 14.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',ahupuaa:'<path d="M12 3.5 4.5 19.5h15z"/><path d="M12 7c-1.2 2.6 1 4.4 0 7s1.2 3 .3 5.5"/><path d="M3 21c2 0 2-.8 4.5-.8S9.5 21 12 21s2-.8 4.5-.8 2 .8 4.5.8"/>',akua:'<path d="M3 19.5l6-9 3 4 2-3 7 8z"/><path d="M8.2 7.5a2.6 2.6 0 0 1 5-1.3A2.2 2.2 0 1 1 15.5 9.6H8.8a1.1 1.1 0 0 1-.6-2.1z"/>',nahele:'<path d="M12 21v-6"/><path d="M12 15c-4.2 0-6.3-2.1-6.3-5a4 4 0 0 1 3-3.9 3.3 3.3 0 0 1 6.6 0 4 4 0 0 1 3 3.9c0 2.9-2.1 5-6.3 5z"/>',loi:'<path d="M12 21v-4.5"/><path d="M12 16.5c-5 0-8-3-8-7 0-2.2 1.2-4 3.2-4 2 0 3 1.8 4.8 1.8s2.8-1.8 4.8-1.8c2 0 3.2 1.8 3.2 4 0 4-3 7-8 7z"/><path d="M12 7.3v9"/>',kauhale:'<path d="M2.5 20.5h19"/><path d="M5 20.5 12 5l7 15.5"/><path d="M10.4 20.5v-4h3.2v4"/>',heiau:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',kahakai:'<path d="M3 14.5h18l-2.2 3.2H5.2z"/><path d="M6 11h12"/><path d="M8.5 11v3.5M15.5 11v3.5"/><path d="M3 20.5c2 0 2-.8 4.5-.8s2 .8 4.5.8 2-.8 4.5-.8 2 .8 4.5.8"/>',loko:'<path d="M3.5 12c3-4.2 9-5 12.5 0-3.5 5-9.5 4.2-12.5 0z"/><path d="M16 12l5-3.2v6.4z"/><circle cx="7.2" cy="11.2" r=".9" fill="currentColor"/><path d="M3 20c3-2 15-2 18 0"/>',koa:'<path d="M6.5 20.5h11"/><ellipse cx="12" cy="17.8" rx="4.3" ry="2"/><ellipse cx="12" cy="13.8" rx="3.2" ry="1.8"/><path d="M12 12V5.2a2.1 2.1 0 1 1 3.1 1.9"/>',surf:'<path d="M2.5 17c3.2 0 4.2-8.5 9.5-8.5 3 0 4.2 2 4.2 4.2-1.2-.2-3.2-.6-4 1.4 3 0 5.6 1 7.8 2.9"/><path d="M2.5 20.5h19"/>',kula:'<path d="M2.5 18.5c2-3 4.5-3 6.5 0M9 18.5c2-3 4.5-3 6.5 0M15.5 18.5c1.6-2.4 4-3 6 0"/><path d="M2.5 21h19"/><path d="M5.8 14.5v-3M12.2 14.5v-4M18.6 14.5v-3"/>',ahu:'<path d="M7.5 20.5h9l-1.2-3.2H8.7z"/><path d="M9.3 17.3l.6-3h4.2l.6 3"/><path d="M10.4 14.3l.6-2.3h2l.6 2.3"/><path d="M18 3.5l.7 1.6 1.6.7-1.6.7L18 8.1l-.7-1.6-1.6-.7 1.6-.7z"/>',puuhonua:'<path d="M2.5 20h19"/><path d="M3 20v-6.5h9.5V20"/><path d="M3 16.2h9.5"/><path d="M14 20l3.6-7.5L21.2 20"/>',holua:'<path d="M3 5.5l18 13.5"/><path d="M7.8 7.6l3.6 2.7"/><path d="M6.6 10.4l5.3 4"/><circle cx="9.6" cy="6.2" r="1.2"/>',malama:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',zones:'<path d="M3 6h18M3 10.5h18M3 15h18M3 19.5h18"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',moae:'<path d="M3 8.5h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16.5h8"/>',kona:'<path d="M7 13.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M12.5 13.5 10 18h3.5l-2 3.5"/>',malie:'<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1"/><path d="M9.5 18.5a3.5 3.5 0 1 1 .7-6.9 4.3 4.3 0 0 1 8.3 2 2.6 2.6 0 0 1-.4 4.9z"/>',auto:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/>',kau:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',hooilo:'<path d="M7 13a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M9 16.5v3M13 16.5v3M17 16.5v3"/>',speed1:'<path d="M8 5.5v13l9-6.5z"/>',speed2:'<path d="M4.5 5.5v13l7.5-6.5zM12 5.5v13l7.5-6.5z"/>',speed3:'<path d="M3 6v12l6-6zM9.5 6v12l6-6zM16 6v12l6-6z"/>',wind:'<path d="M12 3l4 8h-3v10h-2V11H8z" fill="currentColor" stroke="none"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',tour:'<path d="M4 19c4-1 4-6 8-7s5-6 8-7"/><circle cx="4" cy="19" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="20" cy="5" r="1.4" fill="currentColor"/>'};function ye(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${xv[s]||""}</svg>`}const Ln=(s,t)=>Math.atan2(s,t);function _v(s){const t=s.island.meta,e=t.sites,n=s.terrain,i=t.ahupuaa.find(D=>D.id===e.model)||t.ahupuaa[0],[o,r]=i.mouth;let a=i.topX-o,l=i.topZ-r;const c=Math.hypot(a,l)||1;a/=c,l/=c;const h=Ln(-a,-l),f=Ln(a,l),u=(D,z)=>new V(D,Math.max(0,n.heightAt(D,z)),z),d=i.trunk||[],x=D=>{if(!d.length)return[o+a*c*D,r+l*c*D];const z=d[Math.min(d.length-1,Math.floor(D*(d.length-1)))];return[z[0],z[1]]},g=D=>{let z=d[0];for(const P of d)Math.abs(P[2]-D)<Math.abs(z[2]-D)&&(z=P);return z?[z[0],z[1]]:x(.6)},m=e.villages.find(D=>D.model)||e.villages[0],p=e.loi.find(D=>D.model)||e.loi[0],_=e.heiau.find(D=>D.model)||e.heiau[0],v=e.ponds.find(D=>D.model)||e.ponds[0],y=e.canoes.find(D=>D.village===i.id)||e.canoes[0],T=e.koa.find(D=>D.id===i.id)||e.koa[0],w=D=>Math.min(...e.ponds.map(z=>Math.hypot(z.cx-D.x,z.cz-D.z)),99),A=[...e.surf].sort((D,z)=>Math.hypot(D.x-o,D.z-r)-Math.max(0,8-w(D))*20-(Math.hypot(z.x-o,z.z-r)-Math.max(0,8-w(z))*20))[0],M=e.alii||m,S=[...t.ahu].filter(D=>D.a===i.id||D.b===i.id).sort((D,z)=>Math.hypot(D.x-o,D.z-r)-Math.hypot(z.x-o,z.z-r))[0]||t.ahu[0],[C,I]=t.center,k=(()=>{const D=s.island.data.region,z=Math.sqrt(D.length/4);let P=null,H=-1;for(let j=0;j<z;j+=4)for(let B=0;B<z;B+=4)if(D[(j*z+B)*4+3]>H){let K=0;for(let tt=-8;tt<=8;tt+=4)for(let lt=-8;lt<=8;lt+=4)K+=D[(Math.min(z-1,Math.max(0,j+tt))*z+Math.min(z-1,Math.max(0,B+lt)))*4+3];K>H&&(H=K,P=[((B+.5)/z-.5)*360,((j+.5)/z-.5)*360])}return P||[M.x,M.z-10]})(),b={};let R=[];b.island={target:u(C+10,I+4),distance:330,yaw:.28,pitch:.78,overlay:[.55,0,.6,0],hour:9.5};{const D=o-a*4,z=r-l*4,[P,H]=Ca(Xa.moae.bearing),j=[];for(const[B,Y]of[[24,3],[48,-4]]){const K=D-P*B-H*Y,tt=z-H*B+P*Y;j.push([K,tt]);for(let lt=0;lt<6;lt++){const ht=lt*Math.PI/3;j.push([K+Math.cos(ht)*6,tt+Math.sin(ht)*6])}}b.rain={target:u(D,z),distance:24,yaw:f,pitch:.1,hour:16.5,weather:"moae",boost:!0,overlay:[0,0,0,0],lookUp:.35,showers:j}}{const[D,z]=x(.45);b.ahupuaa={target:u(D,z),distance:92,yaw:h+.25,pitch:.55,focus:i.id,overlay:[1,.85,.4,.6],hour:11}}{const[D,z]=g(260);b.akua={target:u(D,z),distance:26,yaw:h+.15,pitch:.1,hour:8.2,overlay:[0,0,0,0],lookUp:.55},R=s.waterfalls?Av(s,n,D,z):[]}{const[D,z]=g(520);b.nahele={target:u(D,z),distance:9,yaw:h+.9,pitch:.55,hour:9.5,overlay:[0,0,0,0]}}if(p){let D=p.paddies[0].c,z=-1;for(const P of p.paddies){let H=0;for(const j of p.paddies)Math.hypot(j.c[0]-P.c[0],j.c[1]-P.c[1])<1.6&&H++;H>z&&(z=H,D=P.c)}b.loi={target:u(D[0],D[1]),distance:4.4,yaw:h-.5,pitch:.72,hour:10.2,overlay:[0,0,0,0]}}if(b.kauhale={target:u(m.x,m.z),distance:3.2,yaw:h+.9,pitch:.55,hour:8.8,overlay:[0,0,0,0]},_&&(b.heiau={target:u(_.x,_.z),distance:2.1,yaw:_.rot+2.2,pitch:.42,hour:11.5,overlay:[0,0,0,0]}),y){const D=Math.cos(y.dir),z=Math.sin(y.dir);b.kahakai={target:u(y.x,y.z),distance:2,yaw:Ln(D,z)+.7,pitch:.28,hour:15.8,overlay:[0,0,0,0]}}if(v&&(b.loko={target:u(v.cx+v.ax*v.r*.4,v.cz+v.az*v.r*.4),distance:6,yaw:Ln(v.ax,v.az)+.6,pitch:.5,hour:13,overlay:[0,0,0,0]}),T){const D=y||{dir:0};b.koa={target:u(T.x,T.z),distance:1.8,yaw:Ln(-Math.cos(D.dir),-Math.sin(D.dir))+.3,pitch:.2,hour:6.9,overlay:[0,0,0,0],lookUp:.25}}const N=A&&s.life?s.life.breakNear(A.x,A.z):null;if(N){const D=Math.floor(N.n*.5),z=N.nx[D]*.8+N.tx[D]*.65,P=N.nz[D]*.8+N.tz[D]*.65,H=Math.hypot(z,P),j=new V(N.x[D]+N.nx[D]*.08+P/H*.2,.04,N.z[D]+N.nz[D]*.08-z/H*.2),B=Ln(z,P);b.surf={target:j,distance:1,yaw:B,pitch:.13,hour:z>0?9.4:15.6,overlay:[0,0,0,0],orbit:[B-.3,B+.3]}}else A&&(b.surf={target:u(A.x,A.z),distance:1.3,yaw:Ln(Math.cos(A.dir+.9),Math.sin(A.dir+.9)),pitch:.12,hour:14.5,overlay:[0,0,0,0]});if(b.kula={target:u(k[0],k[1]),distance:11,yaw:.9,pitch:.42,hour:9,overlay:[0,0,0,0]},S){let D=0,z=-1/0;for(let P=0;P<24;P++){const H=P/24*Math.PI*2,j=n.heightAt(S.x+Math.sin(H)*2.2,S.z+Math.cos(H)*2.2);j>z&&(z=j,D=H)}b.ahu={target:u(S.x,S.z),distance:2,yaw:D,pitch:.3,hour:18.2,doy:318,overlay:[0,0,0,.8],lookUp:.6,ahu:S}}if(e.puuhonua){const D=e.puuhonua;b.puuhonua={target:u(D.x-Math.cos(D.dir)*.8,D.z-Math.sin(D.dir)*.8),distance:3.4,yaw:Ln(Math.cos(D.dir+.9),Math.sin(D.dir+.9)),pitch:.42,hour:15,overlay:[0,0,0,0]}}if(e.holua){const D=e.holua,z=D.x1-D.x0,P=D.z1-D.z0,H=Math.hypot(z,P)||1,j=u(D.x1-z/H*.42,D.z1-P/H*.42);j.y+=.03;const B=Ln(z/H,P/H)-.45;b.holua={target:j,distance:1.05,yaw:B,pitch:.4,hour:16,overlay:[0,0,0,0],orbit:[B-.3,B+.3]};const Y=u(D.x1-z/H*.5,D.z1-P/H*.5);Y.y+=.02,bh(b.holua,Y)}b.malama={target:u(C,I),distance:300,yaw:2.5,pitch:.5,hour:17.4,overlay:[.6,0,.5,0]};for(const D of Object.values(b))Mv(D,n);if(R.length){const D=Uv(s,n,b,R);D&&(b.akua=D.view,s.waterfalls.setHero(D.h,D.info))}s.waterfalls&&Fv(s,b.nahele);const G={akua:[i.topX,i.topZ],nahele:g(520),loi:b.loi?[b.loi.target.x,b.loi.target.z]:null,kauhale:[m.x,m.z],heiau:_?[_.x,_.z]:null,kahakai:y?[y.x,y.z]:null,loko:v?[v.cx+v.ax*v.r*.5,v.cz+v.az*v.r*.5]:null,koa:T?[T.x,T.z]:null,surf:A?[A.x,A.z]:null,kula:k,ahu:S?[S.x,S.z]:null,puuhonua:e.puuhonua?[e.puuhonua.x,e.puuhonua.z]:null,holua:e.holua?[(e.holua.x0+e.holua.x1)/2,(e.holua.z0+e.holua.z1)/2]:null};return{views:b,anchors:G,model:i}}function Mv(s,t){for(let e=0;e<8;e++){const n=Math.cos(s.pitch),i=new V(s.target.x+s.distance*n*Math.sin(s.yaw),s.target.y+s.distance*Math.sin(s.pitch),s.target.z+s.distance*n*Math.cos(s.yaw));let o=!1;for(let r=1;r<24;r++){const a=r/24,l=i.x+(s.target.x-i.x)*a,c=i.y+(s.target.y-i.y)*a,h=i.z+(s.target.z-i.z)*a;if(Math.max(0,t.heightAt(l,h))>c-.03){o=!0;break}}if(!o)return;s.pitch=Math.min(1.3,s.pitch+.07)}}const yv=[.1,.14,.18,.22,.26,.3,.34],wv=[.6,.7,.8,.9,1,1.12,1.25,1.4],On=.05,Lo=41,ja=Math.tan(21*Math.PI/180),lr=650*Nt,Sv=.33,cr=1.47,hr=s=>(t,e)=>Math.max(0,s.heightAt(t,e)),ur=(s,t,e)=>{const n=Math.min(1,Math.max(0,(e-s)/(t-s)));return n*n*(3-2*n)};function bv(s,t,e,n,i,o,r,a=r){for(let l=1;l<o;l++){const c=l/o,h=t.x+(e-t.x)*c,f=t.z+(i-t.z)*c,u=t.y+(n-t.y)*c,d=Math.hypot(e-h,i-f)>1?a:r;if(s(h,f)>u-d)return!1}return!0}const Qi=(s,t,e,n,i)=>s.set(t.x+n*Math.cos(i)*Math.sin(e),t.y+n*Math.sin(i),t.z+n*Math.cos(i)*Math.cos(e)),Ev=s=>.12+.03*s+.05;function Aa(s,t,e){const n=Math.hypot(e.x-t.x,e.z-t.z),i=Math.max(16,Math.ceil(n/.25));for(let o=1;o<i;o++){const r=o/i,a=(1-r)*n,l=.03+Sv*ur(.4,1.2,a)+(r*n<1?.08:0);if(s(t.x+(e.x-t.x)*r,t.z+(e.z-t.z)*r)>t.y+(e.y-t.y)*r-l)return!1}return!0}function Sh(s,t,e,n,i,o,r){return t.y>r||t.y<s(t.x,t.z)+Ev(n)||!bv(s,t,e.x,e.y,e.z,24,.03)?!1:Aa(s,t,e)&&Aa(s,t,o)&&Aa(s,t,i.lip)}function yc(s,t,e,n,i,o,r,a){const l=new V,c=new Uint8Array(Lo);for(let h=0;h<Lo;h++)c[h]=Sh(s,Qi(l,e,i+(h-20)*On,o,r),e,o,t,n,a)?1:0;return c}function wc(s,t){if(!s||!s[t])return null;let e=t,n=t;for(;e>0&&s[e-1];)e--;for(;n<Lo-1&&s[n+1];)n++;return[(e-t)*On,(n-t)*On]}const Tv=s=>{const t=s.lip.y-s.base.y;return new V(s.base.x+(s.lip.x-s.base.x)*.55,s.base.y+t*.55,s.base.z+(s.lip.z-s.base.z)*.55)};function Av(s,t,e,n){const i=[];return s.waterfalls.heroes.forEach((o,r)=>{const l=.5*Math.min(1,o.per*.5+.6*ur(3e3,8e3,o.rain))-(r===0?0:.004*Math.hypot(o.lip.x-e,o.lip.z-n));for(const c of Cv(s,t,o))c.score+=l,i.push(c)}),i.sort((o,r)=>r.score-o.score).slice(0,60)}function Cv(s,t,e){const n=hr(t),i=Math.atan2(e.face[0],e.face[1]),o=new V(e.pool.x,n(e.pool.x,e.pool.z),e.pool.z),r=e.lip.y-e.base.y,a=Tv(e),l=lr-.6,c=(_,v)=>{const y=_.x+e.face[0]*.08,T=_.z+e.face[1]*.08;for(let w=.1;w<30;w+=.08)if(n(y+v.x*w,T+v.z*w)>_.y+v.y*w)return!1;return!0},h=[],f={};for(let _=7.4;_<=10.61;_+=.2){const v=rh(s.clock.doy,_,f).sun.clone();v.y<.12||h.push({hr:_,sun:v,front:v.x*e.face[0]+v.z*e.face[1],lit:c(a,v),litPool:c(o,v),litLip:c(e.lip,v)})}if(!h.length)return[];const u=r/Math.tan(12*Math.PI/180),d=new V,x=new V,g=new V,m=new V,p=[];for(const _ of wv){const v=_*u;for(const y of yv){const T=yc(n,e,o,a,i,v,y,l);if(!T.some(E=>E))continue;const w=yc(n,e,o,a,i,v*cr,y,l);for(let E=0;E<Lo;E++){const A=wc(T,E);if(!A||A[1]-A[0]<.25)continue;const M=wc(w,E),S=(E-20)*On,C=i+S;Qi(d,o,C,v,y);const I=n(d.x,d.z);x.subVectors(e.lip,d).normalize(),g.subVectors(e.base,d).normalize();const k=Math.acos(Math.min(1,x.dot(g)))*180/Math.PI;m.subVectors(e.mist,d).normalize();const b=A[1]-A[0],R=-.04*Math.abs(k-13)-.08*Math.max(0,10.5-k)-.6*Math.max(0,.12-y)-.4*Math.max(0,y-.3)-.25*Math.abs(S)-.35*Math.max(0,1-(d.y-I))+.3*Math.min(.8,b)-(M?.3*Math.max(0,.4-(M[1]-M[0])):.25);let N=-1/0,G=8.2;for(const{hr:D,sun:z,front:P,lit:H,litPool:j,litLip:B}of h){const Y=Math.acos(Math.max(-1,Math.min(1,-m.dot(z))))*180/Math.PI,K=(H?Math.max(0,P)+.3:0)+.12*j+.08*B-.6*Math.max(0,.38-z.y)+.15*ur(.45,.8,z.y)-(H&&P>.35?.01*Math.min(20,Math.abs(Y-41.5)):0);K>N&&(N=K,G=D)}p.push({h:e,score:R+N,hour:G,yaw:C,dist:v,pitch:y,arc:A,arcP:M,tgt:o,mid:a})}}}return p}function Rv(s,t,e){const n=new V().subVectors(e,t).normalize(),i=new V().crossVectors(n,new V(0,1,0)).normalize(),o=new V().crossVectors(i,n),r=new V,a=new V;let l=0;const c=[-.7,-.35,0,.3];for(const h of c){r.copy(n).addScaledVector(i,h*ja*1.6).addScaledVector(o,.75*ja).normalize();let f=!1;for(let u=.3;u<15&&(a.copy(t).addScaledVector(r,u),!(a.y>lr));u+=.15+u*.02)if(a.y<s(a.x,a.z)){f=!0;break}f||l++}return l/c.length}function Sc(s,t,e,n,i){if(!n)return!0;const o=new V;for(let r=n[0];r<=n[1]+1e-6;r+=On)if(!Sh(s,Qi(o,e,t.yaw+r,i,t.pitch),e,i,t.h,t.mid,lr-.6))return!1;return!0}function Pv(s,t){const e=hr(s),n=new V(Math.cos(t.yaw),0,-Math.sin(t.yaw));let i=t.tgt;for(const a of[.08,.05,.025]){const l=t.tgt.clone().addScaledVector(n,a*t.dist);if(l.y=e(l.x,l.z),!(Math.abs(l.y-t.tgt.y)>=.4)&&!(!Sc(e,t,l,t.arc,t.dist)||!Sc(e,t,l,t.arcP,t.dist*cr))){i=l;break}}const o=Math.min(.6,Math.max(0,(t.mid.y-i.y)/(.45*t.dist))),r={target:i,distance:t.dist,yaw:t.yaw,pitch:t.pitch,hour:Math.round(t.hour*10)/10,lookUp:o,weather:"moae",spate:1,overlay:[0,0,0,0]};return r.orbit=[t.yaw+t.arc[0],t.yaw+t.arc[1]],t.arcP&&(r.orbitPortrait=[t.yaw+t.arcP[0],t.yaw+t.arcP[1]]),bh(r,t.mid),r}function bh(s,t){const e=s.lookUp,n=Math.cos(s.pitch),i=o=>{const r=s.distance*Math.sqrt(1/o),a=s.target.x+r*n*Math.sin(s.yaw),l=s.target.y+r*Math.sin(s.pitch),c=s.target.z+r*n*Math.cos(s.yaw),h=Math.atan2(t.y-l,Math.hypot(t.x-a,t.z-c))-Math.atan(.42*ja);return(l+r*n*Math.tan(h)-s.target.y)/(.45*r)};Object.defineProperty(s,"lookUp",{enumerable:!0,get:()=>{const o=typeof innerWidth=="number"?innerWidth/Math.max(1,innerHeight):1.6;return o<1?i(o):e}})}function Lv(s,t,e,n,i){const o=Object.create(Object.getPrototypeOf(s.rig)),r=()=>({target:e.target.clone(),distance:e.distance,yaw:e.yaw+i,pitch:e.pitch,lift:e.lookUp||0});Object.assign(o,{camera:new Ye(42,1.6,.1,9e3),terrain:t,state:r(),goal:r(),flight:null,floor:0,autoOrbit:0,lastInput:-1e12,_v:new V,_prevXZ:null}),o.apply(0);for(let x=0;x<30;x++)o.update(1/60);const a=o.floor,l=o.goal.target.distanceTo(n.target),c=Math.min(6,2.2+Math.sqrt(l)*.22+Math.abs(Math.log(n.distance/o.goal.distance))*.35);o.flyTo({target:n.target,distance:n.distance,yaw:n.yaw,pitch:n.pitch,lift:n.lookUp||0},c),o.autoOrbit=n.distance<60?.012:.02;let h=a,f=0,u=o.camera.position.y,d=u;for(let x=Math.round((c+1.5)*60);x>0;x--){o.update(1/60),o.floor>h&&(h=o.floor);const g=o.camera.position.y;f=Math.max(f,Math.abs(g-2*d+u)*3600),u=d,d=g}return{lift:h-a,acc:f}}function Dv(s,t,e,n){if(!s.rig)return{acc:0,accNext:0};const i=[e.nahele,e.ahupuaa].filter(Boolean);let o=0,r=0;const a=(l,c,h)=>{const f=Lv(s,t,l,c,h);return f.lift>.005?!1:(o=Math.max(o,f.acc),(l===e.nahele||c===e.nahele)&&(r=Math.max(r,f.acc)),!0)};for(const l of i)if(!a(l,n,.048)||!a(l,n,.6)||!a(n,l,0))return null;for(const l of[0,1]){const c=l===0?On:-On;let h=n.orbit[l]-n.yaw;for(;Math.abs(h)>1e-6&&!i.every(f=>a(n,f,h));)h=Math.abs(h)<=On+1e-6?0:h+c;n.orbit[l]=n.yaw+h}return n.orbit[1]-n.orbit[0]<.1?null:(n.orbitPortrait&&(n.orbitPortrait=[Math.max(n.orbitPortrait[0],n.orbit[0]),Math.min(n.orbitPortrait[1],n.orbit[1])]),{acc:o,accNext:r})}function Uv(s,t,e,n){const i=hr(t),o=new V,r=new V;for(const d of n)Qi(o,d.tgt,d.yaw,d.dist,d.pitch),r.set(d.tgt.x,d.mid.y,d.tgt.z),d.open=Rv(i,o,r),d.score+=.2*d.open;n.sort((d,x)=>x.score-d.score);let a=null;for(const d of n){if(a&&d.score<=a.final)break;const x=Pv(t,d),g=Dv(s,t,e,x);if(!g)continue;const m=d.score-.004*Math.max(0,g.acc-60)-.003*Math.max(0,g.accNext-15);(!a||m>a.final)&&(a={c:d,v:x,final:m,acc:g.acc,accNext:g.accNext})}if(!a)return null;const{c:l,v:c}=a,h=l.h;for(const[d,x]of[[c.orbit,c.distance],[c.orbitPortrait,c.distance*cr]])if(d)for(let g=d[0];g<=d[1]+1e-6;g+=On)s.waterfalls.clearSight(Qi(o,c.target,g,x,c.pitch).clone(),[h.pool,l.mid,h.lip]);const f=d=>Math.round(d*100)/100,u=d=>d&&d.map(x=>f(x-c.yaw));return{view:c,h,info:{score:f(a.final),open:l.open,arc:u(c.orbit),arcP:u(c.orbitPortrait),acc:Math.round(a.acc),accNext:Math.round(a.accNext)}}}function Fv(s,t){if(!t)return;const e=new Ye(42,1.6,.1,9e3);Qi(e.position,t.target,t.yaw,t.distance,t.pitch);const n=new V,i=new V;for(let o=t.lookUp||0;o<=.3+1e-6;o+=.05){e.lookAt(t.target.x,t.target.y+o*t.distance*.45,t.target.z),e.updateMatrixWorld();let r=!1;for(const a of s.waterfalls.heroes)n.copy(a.lip).project(e),i.copy(a.base).project(e),i.z<1&&Math.abs(i.x)<.9&&Math.abs(i.y)<.9&&n.y>.88&&(r=!0);if(!r){o>0&&(t.lookUp=o);return}}}const Ie=(s,t=document)=>t.querySelector(s),ge=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,o]of Object.entries(t))i==="class"?n.className=o:i.startsWith("on")?n.addEventListener(i.slice(2),o):n.setAttribute(i,o);return e&&(n.innerHTML=e),n},Iv=s=>{const t=Math.floor(s),e=Math.floor((s-t)*60);return`${t}:${String(e).padStart(2,"0")}`},zv=s=>s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;class kv{constructor(t){this.app=t,this.meta=t.island.meta;const e=_v(t);this.views=e.views,this.anchors=e.anchors,this.model=e.model,this.stops=vv.filter(n=>this.views[n.id]),this.mode="tour",this.index=-1,this.playing=!1,this.arrivedAt=0,this.overlayGoal=new ve(0,0,0,0),this.focusGoal=0,this.layer={lines:!1,zones:!1,pins:!0},this.timeTween=null,this.counts=this.countFeatures(),this.build(),this.bind(),t.updaters.push(n=>this.update(n))}countFeatures(){const t=this.meta.sites,e={},n=(i,o,r=1)=>{e[i]=e[i]||{loi:0,hale:0,heiau:0,loko:0,koa:0},e[i][o]+=r};for(const i of t.loi)n(i.id,"loi",i.paddies.length);for(const i of t.houses)n(i.village,"hale");for(const i of t.heiau)n(i.id,"heiau");for(const i of t.ponds)n(i.id,"loko");for(const i of t.koa)n(i.id,"koa");return e}build(){const t=ge("div",{id:"ui"});document.body.appendChild(t),this.root=t,t.appendChild(ge("div",{class:"brand"},`<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${ye("akua",14)}<span></span>${ye("loko",14)}</div>`)),this.modeEl=ge("div",{class:"modes"}),this.modeEl.append(ge("button",{class:"mode on","data-mode":"tour",title:"Guided tour","aria-label":"Guided tour"},`${ye("tour",18)}<span>Tour</span>`),ge("button",{class:"mode","data-mode":"explore",title:"Explore freely","aria-label":"Explore freely"},`${ye("explore",18)}<span>Explore</span>`)),t.appendChild(this.modeEl),this.tools=ge("div",{class:"tools"});const e=(r,a,l)=>ge("button",{class:"tool","data-tool":r,title:l,"aria-label":l},ye(a,20));this.tools.append(e("lines","lines","Ahupuaʻa boundaries"),e("zones","zones","Zones, mountain to sea"),e("pins","pins","Places"),e("help","help","About"),e("full","expand","Full screen")),t.appendChild(this.tools),this.legend=ge("div",{class:"legend"}),lc.forEach((r,a)=>this.legend.appendChild(ge("div",{class:"lg"},`<i style="background:${As[a]}"></i><b>${r.name}</b><em>${r.gloss}</em>`))),t.appendChild(this.legend),this.card=ge("section",{class:"card","aria-live":"polite"}),t.appendChild(this.card),this.rail=ge("nav",{class:"rail","aria-label":"Tour stops"}),this.playBtn=ge("button",{class:"play",title:"Play the tour","aria-label":"Play the tour"},ye("play",18)),this.rail.appendChild(this.playBtn),this.dots=this.stops.map((r,a)=>{const l=ge("button",{class:"dot",title:r.title,"aria-label":r.title,"data-i":a},ye(r.icon,18));return this.rail.appendChild(l),l}),this.progress=ge("div",{class:"rail-progress"},"<span></span>"),this.rail.appendChild(this.progress),t.appendChild(this.rail),this.markerLayer=ge("div",{class:"markers"}),t.appendChild(this.markerLayer),this.markers=this.stops.filter(r=>this.anchors[r.id]).map(r=>{const a=ge("button",{class:"marker",title:r.title,"aria-label":r.title},`${ye(r.icon,18)}<span>${r.title}</span>`);a.addEventListener("click",h=>{h.stopPropagation(),this.openStop(this.stops.indexOf(r),{fly:!0,explore:!0})}),this.markerLayer.appendChild(a);const[l,c]=this.anchors[r.id];return{el:a,stop:r,pos:new V(l,0,c),vis:0}});for(const r of this.markers)r.pos.y=Math.max(0,this.app.terrain.heightAt(r.pos.x,r.pos.z))+.05;this.inspector=ge("div",{class:"inspector"}),t.appendChild(this.inspector),this.dock=ge("div",{class:"dock"}),this.dock.innerHTML=`
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
      <div class="wind" title="Wind"><span class="wind-arrow">${ye("wind",22)}</span><span class="wind-speed"></span></div>`,t.appendChild(this.dock);const n=Ie(".regimes",this.dock);for(const r of["auto","moae","kona","malie"])n.appendChild(ge("button",{class:"chip","data-regime":r,title:`${mo[r].name} — ${mo[r].gloss}`,"aria-label":mo[r].name},ye(r,18)));const i=Ie(".seasons",this.dock);for(const r of["kau","hooilo"])i.appendChild(ge("button",{class:"chip","data-season":r,title:`${Ta[r].name} — ${Ta[r].gloss}`,"aria-label":Ta[r].name},ye(r,18)));const o=Ie(".speeds",this.dock);for(const[r,a,l]of[["0",0,"pause"],["1",30,"speed1"],["2",240,"speed2"],["3",1800,"speed3"]])o.appendChild(ge("button",{class:"chip","data-speed":a,title:a?`${a}× time`:"Pause time","aria-label":a?`${a} times speed`:"Pause"},ye(l,16)));this.help=ge("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${ye("close",18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`,t.appendChild(this.help)}bind(){this.modeEl.addEventListener("click",a=>{const l=a.target.closest("[data-mode]");l&&this.setMode(l.dataset.mode)}),this.tools.addEventListener("click",a=>{var h,f,u;const l=a.target.closest("[data-tool]");if(!l)return;const c=l.dataset.tool;c==="help"?this.help.classList.toggle("hidden"):c==="full"?document.fullscreenElement?(h=document.exitFullscreen)==null||h.call(document):(u=(f=document.documentElement).requestFullscreen)==null||u.call(f).catch(()=>{}):(this.layer[c]=!this.layer[c],this.applyLayers())}),this.help.addEventListener("click",a=>{(a.target===this.help||a.target.closest(".help-close"))&&this.help.classList.add("hidden")}),this.rail.addEventListener("click",a=>{const l=a.target.closest(".dot");l&&(this.setMode("tour",!1),this.goto(Number(l.dataset.i)))}),this.playBtn.addEventListener("click",()=>this.setPlaying(!this.playing)),this.dock.addEventListener("click",a=>{const l=a.target.closest("[data-regime]"),c=a.target.closest("[data-season]"),h=a.target.closest("[data-speed]");l&&this.app.weather.setMode(l.dataset.regime),c&&this.setSeason(c.dataset.season),h&&(this.app.clock.speed=Number(h.dataset.speed)),this.refreshDock()});const t=Ie(".dial-svg",this.dock);let e=!1;const n=a=>{const l=t.getBoundingClientRect(),c=(a.clientX-l.left)/l.width*120,h=(a.clientY-l.top)/l.height*64;let f=Math.atan2(58-h,c-60);f<0&&(f=f<-Math.PI/2?Math.PI:0);const u=6+(Math.PI-f)/Math.PI*12;this.timeTween=null,this.app.clock.hour=u};t.addEventListener("pointerdown",a=>{e=!0,t.setPointerCapture(a.pointerId),n(a)}),t.addEventListener("pointermove",a=>e&&n(a)),t.addEventListener("pointerup",()=>e=!1);const i=this.app.canvas;let o=null;i.addEventListener("pointerdown",a=>o={x:a.clientX,y:a.clientY,t:performance.now()}),i.addEventListener("pointerup",a=>{if(!o)return;Math.hypot(a.clientX-o.x,a.clientY-o.y)<5&&performance.now()-o.t<400&&this.pick(a.clientX,a.clientY),o=null});let r=0;i.addEventListener("pointermove",a=>{if(a.buttons||a.pointerType==="touch")return;const l=performance.now();l-r<60||(r=l,this.hover(a.clientX,a.clientY))}),i.addEventListener("pointerleave",()=>this.hover(null)),addEventListener("keydown",a=>{a.key==="ArrowRight"&&!a.shiftKey&&this.mode==="tour"?(a.preventDefault(),this.goto(this.index+1)):a.key==="ArrowLeft"&&!a.shiftKey&&this.mode==="tour"?(a.preventDefault(),this.goto(this.index-1)):a.key==="Escape"?this.help.classList.contains("hidden")?this.closeCard():this.help.classList.add("hidden"):a.key===" "&&this.mode==="tour"&&a.target===document.body&&(a.preventDefault(),this.setPlaying(!this.playing))}),this.app.rig.onUserInput=()=>{this.playing&&this.setPlaying(!1)}}setMode(t,e=!0){if(this.mode===t&&e){t==="tour"&&this.index<0&&this.goto(0);return}this.mode=t;for(const n of this.modeEl.querySelectorAll(".mode"))n.classList.toggle("on",n.dataset.mode===t);this.root.classList.toggle("exploring",t==="explore"),t==="explore"?(this.setPlaying(!1),this.closeCard(),this.focusGoal=0,this.app.rig.autoOrbit=0,this.app.clock.speed=Math.max(this.app.clock.speed,30),this.applyLayers()):e&&this.goto(Math.max(0,this.index))}applyLayers(){for(const t of this.tools.querySelectorAll("[data-tool]")){const e=t.dataset.tool;e in this.layer&&t.classList.toggle("on",this.layer[e])}this.legend.classList.toggle("show",this.layer.zones),this.markerLayer.classList.toggle("hidden",!this.layer.pins||this.mode!=="explore"),this.mode==="explore"&&this.overlayGoal.set(this.layer.lines?1:0,this.layer.zones?1:0,this.layer.lines?.5:0,this.layer.lines?.8:.35)}setSeason(t){const e=this.app.clock;e.doy=t==="kau"?172:355,this.app.season=t,this.refreshDock()}setPlaying(t){this.playing=t,this.playBtn.innerHTML=ye(t?"pause":"play",18),this.playBtn.classList.toggle("on",t),t&&this.mode!=="tour"&&this.setMode("tour"),t&&(this.arrivedAt=performance.now())}goto(t){if(t<0||t>=this.stops.length){t>=this.stops.length&&this.setPlaying(!1);return}this.openStop(t,{fly:!0,explore:!1})}openStop(t,{fly:e,explore:n}){this.index=t;const i=this.stops[t],o=this.views[i.id];if(this.dots.forEach((u,d)=>{u.classList.toggle("on",d===t),u.classList.toggle("done",d<t)}),this.renderCard(i,n),!o)return;const r=this.app.rig,a=r.goal.target.distanceTo(o.target),l=Math.min(6,2.2+Math.sqrt(a)*.22+Math.abs(Math.log(o.distance/r.goal.distance))*.35),c=innerWidth/Math.max(1,innerHeight),h=o.distance*(c<1?Math.pow(1/c,o.distance>40?1:.5):1);e&&r.flyTo({target:o.target,distance:h,yaw:o.yaw,pitch:o.pitch,lift:o.lookUp||0},l,{onDone:()=>this.arrivedAt=performance.now()}),this.arrivedAt=performance.now()+l*1e3,r.autoOrbit=o.distance<60?.012:.02;const f=this.app.clock;if(o.doy!==void 0&&Math.abs(o.doy-f.doy)>2?f.doy=o.doy:o.doy===void 0&&this.lastDoy!==void 0&&f.doy!==this.lastDoy&&(f.doy=this.lastDoy),o.doy===void 0&&(this.lastDoy=f.doy),o.hour!==void 0){let u=o.hour-f.hour;u<-12&&(u+=24),u>12&&(u-=24),this.timeTween={from:f.hour,by:u,t:0,dur:l}}if(f.speed=20,o.weather&&this.app.weather.setMode(o.weather),this.app.weather.boost=o.boost?1:0,o.showers)for(const[u,d]of o.showers)this.app.weather.spawnShower(u,d,5+Math.random()*3,.7);if(o.ahu&&this.app.life&&this.app.life.walkTo(o.ahu.x,o.ahu.z),!n){const u=o.overlay||[0,0,0,0];this.overlayGoal.set(u[0],u[1],u[2],u[3]),this.focusGoal=o.focus||0}}renderCard(t,e){var o,r,a,l;const n=t.zone!==void 0&&t.zone!==null?lc[t.zone]:null,i=this.stops.length;this.card.innerHTML=`
      <header>
        <div class="card-icon">${ye(t.icon,26)}</div>
        <div class="card-titles"><h1>${t.title}</h1><p class="gloss">${t.gloss}</p></div>
        <button class="card-close" aria-label="Close">${ye("close",18)}</button>
      </header>
      ${n?`<div class="zone-chip"><i style="background:${As[t.zone]}"></i>${n.name}<em>${n.gloss}</em></div>`:""}
      <div class="card-body">${t.text.map(c=>`<p>${c}</p>`).join("")}</div>
      ${e?"":`<footer>
        <button class="nav prev" aria-label="Previous" ${this.index===0?"disabled":""}>${ye("prev",18)}</button>
        <span class="count">${this.index+1} / ${i}</span>
        ${this.index===i-1?`<button class="nav finish" aria-label="Explore">${ye("explore",18)}<span>Explore</span></button>`:`<button class="nav next" aria-label="Next">${ye("next",18)}</button>`}
      </footer>`}`,this.card.classList.add("show"),this.card.scrollTop=0,(o=Ie(".prev",this.card))==null||o.addEventListener("click",()=>this.goto(this.index-1)),(r=Ie(".next",this.card))==null||r.addEventListener("click",()=>this.goto(this.index+1)),(a=Ie(".finish",this.card))==null||a.addEventListener("click",()=>this.setMode("explore")),(l=Ie(".card-close",this.card))==null||l.addEventListener("click",()=>this.closeCard())}closeCard(){this.card.classList.remove("show")}regionAt(t,e){const n=this.app.island.data.region,i=ee,o=Math.floor((t+pt)/Zt*i),r=Math.floor((e+pt)/Zt*i);return o<0||r<0||o>=i||r>=i?0:n[(r*i+o)*4]}hover(t,e){if(t===null||this.mode!=="explore"){this.app.shared.uniforms.uHover.value=0,this.pinned||this.inspector.classList.remove("show");return}const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(this.app.shared.uniforms.uHover.value=i,!this.pinned){if(!i){this.inspector.classList.remove("show");return}this.showInspector(i,t,e)}}pick(t,e){if(this.mode!=="explore")return;const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(!i||i===this.focusGoal){this.focusGoal=0,this.pinned=!1,this.inspector.classList.remove("show","pinned");return}this.focusGoal=i,this.pinned=!0,this.showInspector(i,t,e,!0)}showInspector(t,e,n,i=!1){const o=this.meta.ahupuaa.find(c=>c.id===t);if(!o)return;if(this.inspectorId!==t){this.inspectorId=t;const c=E1[o.moku],h=this.counts[t]||{},f=(u,d)=>d?`<span class="st">${ye(u,15)}${d}</span>`:"";this.inspector.innerHTML=`
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${o.moku+1})"></i>${c.name}<em>${c.gloss}</em></span></div>
        ${Nv(o.profile)}
        <div class="in-stats"><span class="st">${o.area.toFixed(1)} km²</span><span class="st">${ye("akua",15)}${Math.round(o.top)} m</span>${f("loi",h.loi)}${f("kauhale",h.hale)}${f("heiau",h.heiau)}${f("loko",h.loko)}${f("koa",h.koa)}</div>`}this.inspector.classList.add("show"),this.inspector.classList.toggle("pinned",i);const r=innerWidth,a=Math.min(r-300,e+18),l=Math.max(70,Math.min(innerHeight-220,n+18));this.inspector.style.transform=`translate(${a}px, ${l}px)`}update(t){const e=this.app,n=e.shared.uniforms,i=1-Math.exp(-t*3);if(e.overlay.lerp(this.overlayGoal,i),this.focusGoal?(n.uFocus.value=this.focusGoal,n.uFocusK.value+=(1-n.uFocusK.value)*i):(n.uFocusK.value+=(0-n.uFocusK.value)*i,n.uFocusK.value<.01&&(n.uFocus.value=0)),this.timeTween){const o=this.timeTween;o.t=Math.min(1,o.t+t/o.dur),e.clock.hour=((o.from+o.by*zv(o.t))%24+24)%24,o.t>=1&&(this.timeTween=null)}if(this.playing&&this.mode==="tour"&&!e.rig.flight){const r=this.stops[this.index].text.join(" ").split(/\s+/).length,a=Math.max(9,r*.32)*1e3,l=performance.now()-this.arrivedAt;Ie("span",this.progress).style.width=`${Math.min(100,l/a*100)}%`,l>a&&(this.index<this.stops.length-1?this.goto(this.index+1):this.setPlaying(!1))}else Ie("span",this.progress).style.width="0%";this.updateMarkers(),this.frameN=(this.frameN||0)+1,this.frameN%6===0&&this.refreshDock()}updateMarkers(){if(this.mode!=="explore"||!this.layer.pins)return;const t=this.app.camera,e=innerWidth,n=innerHeight,i=new V,o=[],r=this.markers.map(a=>({m:a,d:t.position.distanceTo(a.pos)})).sort((a,l)=>a.d-l.d);for(const{m:a,d:l}of r){i.copy(a.pos).project(t);const c=i.z>1,h=(i.x+1)/2*e,f=(1-i.y)/2*n;let u=!c&&h>-40&&h<e+40&&f>60&&f<n+40&&l<420;u&&o.some(d=>Math.abs(d[0]-h)<44&&Math.abs(d[1]-f)<40)&&(u=!1),u&&o.push([h,f]),a.el.style.opacity=u?String(Math.min(1,(420-l)/120)):"0",a.el.style.pointerEvents=u?"auto":"none",u&&(a.el.style.transform=`translate(${h}px, ${f}px)`),a.el.classList.toggle("near",l<40)}}refreshDock(){const t=this.app,e=t.clock,n=t.light,i=Ie(".dial-body",this.dock),o=(e.hour-6)/12,r=e.hour<6||e.hour>18;let a;if(!r)a=Math.PI-o*Math.PI;else{const m=(e.hour-18+24)%24/12;a=Math.PI-m*Math.PI}const l=60+Math.cos(a)*52,c=58-Math.sin(a)*52;i.setAttribute("transform",`translate(${l.toFixed(1)} ${c.toFixed(1)})`),i.classList.toggle("moon",r),Ie(".dial-time",this.dock).textContent=Iv(e.hour);const h=Ng[t.sky.astro.night]||"",f=Ie(".dial-night",this.dock);f.textContent=n.night>.5?`Pō ${h}`:"",f.title="The night of the Hawaiian lunar month";for(const m of this.dock.querySelectorAll("[data-regime]"))m.classList.toggle("on",t.weather.mode===m.dataset.regime);const u=e.doy>120&&e.doy<305?"kau":"hooilo";t.season=u;for(const m of this.dock.querySelectorAll("[data-season]"))m.classList.toggle("on",u===m.dataset.season);for(const m of this.dock.querySelectorAll("[data-speed]"))m.classList.toggle("on",Number(m.dataset.speed)===e.speed||e.speed===20&&m.dataset.speed==="30");const d=t.weather.wind,x=Math.atan2(d.x,-d.y)*180/Math.PI;Ie(".wind-arrow",this.dock).style.transform=`rotate(${x.toFixed(0)}deg)`,Ie(".wind-speed",this.dock).textContent=`${Math.round(d.length()*3.6)} km/h`;const g=mo[t.weather.regime];Ie(".wind",this.dock).title=`${g.name} — ${g.gloss}`}start(){this.setMode("tour",!1),this.applyLayers(),this.goto(0)}}function Nv(s){if(!s||s.length<2)return"";const t=260,e=78,n=s[s.length-1][0],i=Math.max(...s.map(u=>u[1]),200),o=Math.min(...s.map(u=>u[1]),-30),r=(e-14)/(i-o),a=u=>t-u/n*(t-4)-2,l=u=>e-6-(u-o)*r,c=l(0);let h="";for(let u=0;u<s.length-1;u++){const d=s[u],x=s[u+1];h+=`<path d="M${a(d[0]).toFixed(1)} ${c.toFixed(1)}L${a(d[0]).toFixed(1)} ${l(d[1]).toFixed(1)}L${a(x[0]).toFixed(1)} ${l(x[1]).toFixed(1)}L${a(x[0]).toFixed(1)} ${c.toFixed(1)}Z" fill="${As[d[2]]}" stroke="${As[d[2]]}" stroke-width=".6"/>`}const f=s.map((u,d)=>`${d?"L":"M"}${a(u[0]).toFixed(1)} ${l(u[1]).toFixed(1)}`).join("");return`<svg class="profile" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none">
    <rect x="0" y="${c.toFixed(1)}" width="${t}" height="${(e-c).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${h}
    <path d="${f}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${t}" y1="${c.toFixed(1)}" y2="${c.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`}const Do=document.getElementById("boot"),Ov=Do.querySelector(".boot-bar span"),Eh=Do.querySelector(".boot-stage"),Bv={shape:["raising the shields",.02,.1],erode:["the rain carves valleys",.1,.42],valleys:["filling the valley floors",.42,.55],coast:["growing the reef",.55,.7],divide:["tracing the ridgelines",.66,.7],detail:["shaping the ridges",.7,.8],people:["the people arrive",.8,.86],light:["reading the light",.86,.94],sky:["gathering clouds",.94,.99],done:["",1,1]};function Hv(s){return new Promise((t,e)=>{const n=new Worker(new URL(""+new URL("worker-CrsX03fJ.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=i=>{const o=i.data;if(o.type==="progress"){const r=Bv[o.stage];if(!r)return;Eh.textContent=r[0],Ov.style.width=`${(r[1]+(r[2]-r[1])*o.p)*100}%`}else o.type==="done"?(n.terminate(),t({data:o.data,meta:o.meta})):o.type==="error"&&(n.terminate(),e(new Error(o.message)))},n.onerror=i=>e(i),n.postMessage({seed:s})})}async function Gv(){const s=performance.now(),t=await Hv(Dh);console.log(`island generated in ${((performance.now()-s)/1e3).toFixed(1)} s`);const e=new gv(document.getElementById("scene"),t),n=new kv(e);window.__app=e,e.ui=n;let i=0;const o=()=>{if(++i<4)return requestAnimationFrame(o);Do.classList.add("gone"),setTimeout(()=>Do.remove(),1200),new URLSearchParams(location.search).has("cam")||n.start()};requestAnimationFrame(o)}Gv().catch(s=>{console.error(s),Eh.textContent="something went wrong — see the console"});
