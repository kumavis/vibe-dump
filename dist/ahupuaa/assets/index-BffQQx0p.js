(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const qt=360,ut=qt/2,Xs=.01,Ou=1.3,Gt=Xs*Ou,mn=2048,le=1024,Bu=20261004;function Cr(s){const t=(s+180)*Math.PI/180;return[Math.sin(t),-Math.cos(t)]}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Zr="160",Hu=0,xl=1,Gu=2,kh=1,Wu=2,Hn=3,Zn=0,$e=1,tn=2,li=0,gs=1,Rr=2,vl=3,Ml=4,Vu=5,bi=100,qu=101,Xu=102,_l=103,yl=104,ju=200,Yu=201,$u=202,Ku=203,Pr=204,Lr=205,Zu=206,Ju=207,Qu=208,tf=209,ef=210,nf=211,sf=212,of=213,af=214,rf=0,lf=1,cf=2,la=3,hf=4,uf=5,ff=6,df=7,Dh=0,pf=1,mf=2,ci=0,gf=1,xf=2,vf=3,Mf=4,_f=5,yf=6,zh=300,ys=301,ws=302,kr=303,Dr=304,Ma=306,Pi=1e3,en=1001,zr=1002,Me=1003,wl=1004,La=1005,fe=1006,wf=1007,Li=1008,cn=1009,bf=1010,Sf=1011,Jr=1012,Fh=1013,Xn=1014,An=1015,Jn=1016,Ih=1017,Uh=1018,Ei=1020,Ef=1021,Ve=1023,Tf=1024,Af=1025,Ti=1026,bs=1027,xs=1028,Nh=1029,Cf=1030,Oh=1031,Bh=1033,ka=33776,Da=33777,za=33778,Fa=33779,bl=35840,Sl=35841,El=35842,Tl=35843,Hh=36196,Al=37492,Cl=37496,Rl=37808,Pl=37809,Ll=37810,kl=37811,Dl=37812,zl=37813,Fl=37814,Il=37815,Ul=37816,Nl=37817,Ol=37818,Bl=37819,Hl=37820,Gl=37821,Ia=36492,Wl=36494,Vl=36495,Rf=36283,ql=36284,Xl=36285,jl=36286,Gh=3e3,Ai=3001,Pf=3200,Lf=3201,kf=0,Df=1,gn="",Ue="srgb",Qn="srgb-linear",Qr="display-p3",_a="display-p3-linear",ca="linear",ge="srgb",ha="rec709",ua="p3",Oi=7680,Yl=519,zf=512,Ff=513,If=514,Wh=515,Uf=516,Nf=517,Of=518,Bf=519,$l=35044,vs=35048,Kl="300 es",Fr=1035,jn=2e3,fa=2001;class As{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const o=i.indexOf(e);o!==-1&&i.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let o=0,a=i.length;o<a;o++)i[o].call(this,t);t.target=null}}}const Be=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Zl=1234567;const Zs=Math.PI/180,no=180/Math.PI;function Cs(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Be[s&255]+Be[s>>8&255]+Be[s>>16&255]+Be[s>>24&255]+"-"+Be[t&255]+Be[t>>8&255]+"-"+Be[t>>16&15|64]+Be[t>>24&255]+"-"+Be[e&63|128]+Be[e>>8&255]+"-"+Be[e>>16&255]+Be[e>>24&255]+Be[n&255]+Be[n>>8&255]+Be[n>>16&255]+Be[n>>24&255]).toLowerCase()}function We(s,t,e){return Math.max(t,Math.min(e,s))}function tl(s,t){return(s%t+t)%t}function Hf(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Gf(s,t,e){return s!==t?(e-s)/(t-s):0}function Js(s,t,e){return(1-e)*s+e*t}function Wf(s,t,e,n){return Js(s,t,1-Math.exp(-e*n))}function Vf(s,t=1){return t-Math.abs(tl(s,t*2)-t)}function qf(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Xf(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function jf(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Yf(s,t){return s+Math.random()*(t-s)}function $f(s){return s*(.5-Math.random())}function Kf(s){s!==void 0&&(Zl=s);let t=Zl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Zf(s){return s*Zs}function Jf(s){return s*no}function Ir(s){return(s&s-1)===0&&s!==0}function Qf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function da(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function td(s,t,e,n,i){const o=Math.cos,a=Math.sin,r=o(e/2),l=a(e/2),c=o((t+n)/2),h=a((t+n)/2),f=o((t-n)/2),u=a((t-n)/2),m=o((n-t)/2),v=a((n-t)/2);switch(i){case"XYX":s.set(r*h,l*f,l*u,r*c);break;case"YZY":s.set(l*u,r*h,l*f,r*c);break;case"ZXZ":s.set(l*f,l*u,r*h,r*c);break;case"XZX":s.set(r*h,l*v,l*m,r*c);break;case"YXY":s.set(l*m,r*h,l*v,r*c);break;case"ZYZ":s.set(l*v,l*m,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ls(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function je(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Pn={DEG2RAD:Zs,RAD2DEG:no,generateUUID:Cs,clamp:We,euclideanModulo:tl,mapLinear:Hf,inverseLerp:Gf,lerp:Js,damp:Wf,pingpong:Vf,smoothstep:qf,smootherstep:Xf,randInt:jf,randFloat:Yf,randFloatSpread:$f,seededRandom:Kf,degToRad:Zf,radToDeg:Jf,isPowerOfTwo:Ir,ceilPowerOfTwo:Qf,floorPowerOfTwo:da,setQuaternionFromProperEuler:td,normalize:je,denormalize:ls};class Ut{constructor(t=0,e=0){Ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*n-a*i+t.x,this.y=o*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Zt{constructor(t,e,n,i,o,a,r,l,c){Zt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,l,c)}set(t,e,n,i,o,a,r,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=r,h[3]=e,h[4]=o,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],m=n[5],v=n[8],g=i[0],x=i[3],p=i[6],d=i[1],M=i[4],_=i[7],S=i[2],w=i[5],b=i[8];return o[0]=a*g+r*d+l*S,o[3]=a*x+r*M+l*w,o[6]=a*p+r*_+l*b,o[1]=c*g+h*d+f*S,o[4]=c*x+h*M+f*w,o[7]=c*p+h*_+f*b,o[2]=u*g+m*d+v*S,o[5]=u*x+m*M+v*w,o[8]=u*p+m*_+v*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*r*c-n*o*h+n*r*l+i*o*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=h*a-r*c,u=r*l-h*o,m=c*o-a*l,v=e*f+n*u+i*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/v;return t[0]=f*g,t[1]=(i*c-h*n)*g,t[2]=(r*n-i*a)*g,t[3]=u*g,t[4]=(h*e-i*l)*g,t[5]=(i*o-r*e)*g,t[6]=m*g,t[7]=(n*l-c*e)*g,t[8]=(a*e-n*o)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,o,a,r){const l=Math.cos(o),c=Math.sin(o);return this.set(n*l,n*c,-n*(l*a+c*r)+a+t,-i*c,i*l,-i*(-c*a+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Ua.makeScale(t,e)),this}rotate(t){return this.premultiply(Ua.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ua.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ua=new Zt;function Vh(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function pa(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ed(){const s=pa("canvas");return s.style.display="block",s}const Jl={};function Qs(s){s in Jl||(Jl[s]=!0,console.warn(s))}const Ql=new Zt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),tc=new Zt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),mo={[Qn]:{transfer:ca,primaries:ha,toReference:s=>s,fromReference:s=>s},[Ue]:{transfer:ge,primaries:ha,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[_a]:{transfer:ca,primaries:ua,toReference:s=>s.applyMatrix3(tc),fromReference:s=>s.applyMatrix3(Ql)},[Qr]:{transfer:ge,primaries:ua,toReference:s=>s.convertSRGBToLinear().applyMatrix3(tc),fromReference:s=>s.applyMatrix3(Ql).convertLinearToSRGB()}},nd=new Set([Qn,_a]),ce={enabled:!0,_workingColorSpace:Qn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!nd.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=mo[t].toReference,i=mo[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return mo[s].primaries},getTransfer:function(s){return s===gn?ca:mo[s].transfer}};function Ms(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Na(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Bi;class qh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Bi===void 0&&(Bi=pa("canvas")),Bi.width=t.width,Bi.height=t.height;const n=Bi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Bi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=pa("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),o=i.data;for(let a=0;a<o.length;a++)o[a]=Ms(o[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ms(e[n]/255)*255):e[n]=Ms(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let id=0;class Xh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:id++}),this.uuid=Cs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let a=0,r=i.length;a<r;a++)i[a].isDataTexture?o.push(Oa(i[a].image)):o.push(Oa(i[a]))}else o=Oa(i);n.url=o}return e||(t.images[this.uuid]=n),n}}function Oa(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?qh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let sd=0;class nn extends As{constructor(t=nn.DEFAULT_IMAGE,e=nn.DEFAULT_MAPPING,n=en,i=en,o=fe,a=Li,r=Ve,l=cn,c=nn.DEFAULT_ANISOTROPY,h=gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=Cs(),this.name="",this.source=new Xh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=a,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Ut(0,0),this.repeat=new Ut(1,1),this.center=new Ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Qs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Ai?Ue:gn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==zh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Pi:t.x=t.x-Math.floor(t.x);break;case en:t.x=t.x<0?0:1;break;case zr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Pi:t.y=t.y-Math.floor(t.y);break;case en:t.y=t.y<0?0:1;break;case zr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Qs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ue?Ai:Gh}set encoding(t){Qs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Ai?Ue:gn}}nn.DEFAULT_IMAGE=null;nn.DEFAULT_MAPPING=zh;nn.DEFAULT_ANISOTROPY=1;class pe{constructor(t=0,e=0,n=0,i=1){pe.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*o,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*o,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*o,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,o;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],m=l[5],v=l[9],g=l[2],x=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-g)<.01&&Math.abs(v-x)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+g)<.1&&Math.abs(v+x)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,_=(m+1)/2,S=(p+1)/2,w=(h+u)/4,b=(f+g)/4,A=(v+x)/4;return M>_&&M>S?M<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(M),i=w/n,o=b/n):_>S?_<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(_),n=w/i,o=A/i):S<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(S),n=b/o,i=A/o),this.set(n,i,o,e),this}let d=Math.sqrt((x-v)*(x-v)+(f-g)*(f-g)+(u-h)*(u-h));return Math.abs(d)<.001&&(d=1),this.x=(x-v)/d,this.y=(f-g)/d,this.z=(u-h)/d,this.w=Math.acos((c+m+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class od extends As{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new pe(0,0,t,e),this.scissorTest=!1,this.viewport=new pe(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(Qs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Ai?Ue:gn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fe,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new nn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Xh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hn extends od{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class jh extends nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Me,this.minFilter=Me,this.wrapR=en,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ur extends nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Me,this.minFilter=Me,this.wrapR=en,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ad extends hn{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGLMultipleRenderTargets=!0;const o=this.texture;this.texture=[];for(let a=0;a<n;a++)this.texture[a]=o.clone(),this.texture[a].isRenderTargetTexture=!0}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,o=this.texture.length;i<o;i++)this.texture[i].image.width=t,this.texture[i].image.height=e,this.texture[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}copy(t){this.dispose(),this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.texture.length=0;for(let e=0,n=t.texture.length;e<n;e++)this.texture[e]=t.texture[e].clone(),this.texture[e].isRenderTargetTexture=!0;return this}}class Di{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,o,a,r){let l=n[i+0],c=n[i+1],h=n[i+2],f=n[i+3];const u=o[a+0],m=o[a+1],v=o[a+2],g=o[a+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f;return}if(r===1){t[e+0]=u,t[e+1]=m,t[e+2]=v,t[e+3]=g;return}if(f!==g||l!==u||c!==m||h!==v){let x=1-r;const p=l*u+c*m+h*v+f*g,d=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const S=Math.sqrt(M),w=Math.atan2(S,p*d);x=Math.sin(x*w)/S,r=Math.sin(r*w)/S}const _=r*d;if(l=l*x+u*_,c=c*x+m*_,h=h*x+v*_,f=f*x+g*_,x===1-r){const S=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=S,c*=S,h*=S,f*=S}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,i,o,a){const r=n[i],l=n[i+1],c=n[i+2],h=n[i+3],f=o[a],u=o[a+1],m=o[a+2],v=o[a+3];return t[e]=r*v+h*f+l*m-c*u,t[e+1]=l*v+h*u+c*f-r*m,t[e+2]=c*v+h*m+r*u-l*f,t[e+3]=h*v-r*f-l*u-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,o=t._z,a=t._order,r=Math.cos,l=Math.sin,c=r(n/2),h=r(i/2),f=r(o/2),u=l(n/2),m=l(i/2),v=l(o/2);switch(a){case"XYZ":this._x=u*h*f+c*m*v,this._y=c*m*f-u*h*v,this._z=c*h*v+u*m*f,this._w=c*h*f-u*m*v;break;case"YXZ":this._x=u*h*f+c*m*v,this._y=c*m*f-u*h*v,this._z=c*h*v-u*m*f,this._w=c*h*f+u*m*v;break;case"ZXY":this._x=u*h*f-c*m*v,this._y=c*m*f+u*h*v,this._z=c*h*v+u*m*f,this._w=c*h*f-u*m*v;break;case"ZYX":this._x=u*h*f-c*m*v,this._y=c*m*f+u*h*v,this._z=c*h*v-u*m*f,this._w=c*h*f+u*m*v;break;case"YZX":this._x=u*h*f+c*m*v,this._y=c*m*f+u*h*v,this._z=c*h*v-u*m*f,this._w=c*h*f-u*m*v;break;case"XZY":this._x=u*h*f-c*m*v,this._y=c*m*f-u*h*v,this._z=c*h*v+u*m*f,this._w=c*h*f+u*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],o=e[8],a=e[1],r=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+r+f;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(o-c)*m,this._z=(a-i)*m}else if(n>r&&n>f){const m=2*Math.sqrt(1+n-r-f);this._w=(h-l)/m,this._x=.25*m,this._y=(i+a)/m,this._z=(o+c)/m}else if(r>f){const m=2*Math.sqrt(1+r-n-f);this._w=(o-c)/m,this._x=(i+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+f-n-r);this._w=(a-i)/m,this._x=(o+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(We(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,o=t._z,a=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*r+i*c-o*l,this._y=i*h+a*l+o*r-n*c,this._z=o*h+a*c+n*l-i*r,this._w=a*h-n*r-i*l-o*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,o=this._z,a=this._w;let r=a*t._w+n*t._x+i*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=n,this._y=i,this._z=o,this;const l=1-r*r;if(l<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*n+e*this._x,this._y=m*i+e*this._y,this._z=m*o+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),f=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=a*f+this._w*u,this._x=n*f+this._x*u,this._y=i*f+this._y*u,this._z=o*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(o),n*Math.cos(o),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class W{constructor(t=0,e=0,n=0){W.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ec.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ec.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*i,this.y=o[1]*e+o[4]*n+o[7]*i,this.z=o[2]*e+o[5]*n+o[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=t.elements,a=1/(o[3]*e+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*i+o[12])*a,this.y=(o[1]*e+o[5]*n+o[9]*i+o[13])*a,this.z=(o[2]*e+o[6]*n+o[10]*i+o[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,o=t.x,a=t.y,r=t.z,l=t.w,c=2*(a*i-r*n),h=2*(r*e-o*i),f=2*(o*n-a*e);return this.x=e+l*c+a*f-r*h,this.y=n+l*h+r*c-o*f,this.z=i+l*f+o*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i,this.y=o[1]*e+o[5]*n+o[9]*i,this.z=o[2]*e+o[6]*n+o[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,o=t.z,a=e.x,r=e.y,l=e.z;return this.x=i*l-o*r,this.y=o*a-n*l,this.z=n*r-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ba.copy(this).projectOnVector(t),this.sub(Ba)}reflect(t){return this.sub(Ba.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(We(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ba=new W,ec=new Di;class kn{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(_n.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(_n.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=_n.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,_n):_n.fromBufferAttribute(o,a),_n.applyMatrix4(t.matrixWorld),this.expandByPoint(_n);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),go.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),go.copy(n.boundingBox)),go.applyMatrix4(t.matrixWorld),this.union(go)}const i=t.children;for(let o=0,a=i.length;o<a;o++)this.expandByObject(i[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,_n),_n.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ds),xo.subVectors(this.max,Ds),Hi.subVectors(t.a,Ds),Gi.subVectors(t.b,Ds),Wi.subVectors(t.c,Ds),ni.subVectors(Gi,Hi),ii.subVectors(Wi,Gi),di.subVectors(Hi,Wi);let e=[0,-ni.z,ni.y,0,-ii.z,ii.y,0,-di.z,di.y,ni.z,0,-ni.x,ii.z,0,-ii.x,di.z,0,-di.x,-ni.y,ni.x,0,-ii.y,ii.x,0,-di.y,di.x,0];return!Ha(e,Hi,Gi,Wi,xo)||(e=[1,0,0,0,1,0,0,0,1],!Ha(e,Hi,Gi,Wi,xo))?!1:(vo.crossVectors(ni,ii),e=[vo.x,vo.y,vo.z],Ha(e,Hi,Gi,Wi,xo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,_n).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(_n).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const zn=[new W,new W,new W,new W,new W,new W,new W,new W],_n=new W,go=new kn,Hi=new W,Gi=new W,Wi=new W,ni=new W,ii=new W,di=new W,Ds=new W,xo=new W,vo=new W,pi=new W;function Ha(s,t,e,n,i){for(let o=0,a=s.length-3;o<=a;o+=3){pi.fromArray(s,o);const r=i.x*Math.abs(pi.x)+i.y*Math.abs(pi.y)+i.z*Math.abs(pi.z),l=t.dot(pi),c=e.dot(pi),h=n.dot(pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const rd=new kn,zs=new W,Ga=new W;class zi{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):rd.setFromPoints(t).getCenter(n);let i=0;for(let o=0,a=t.length;o<a;o++)i=Math.max(i,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;zs.subVectors(t,this.center);const e=zs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(zs,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ga.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(zs.copy(t.center).add(Ga)),this.expandByPoint(zs.copy(t.center).sub(Ga))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Fn=new W,Wa=new W,Mo=new W,si=new W,Va=new W,_o=new W,qa=new W;class el{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Fn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Fn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Fn.copy(this.origin).addScaledVector(this.direction,e),Fn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Wa.copy(t).add(e).multiplyScalar(.5),Mo.copy(e).sub(t).normalize(),si.copy(this.origin).sub(Wa);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Mo),r=si.dot(this.direction),l=-si.dot(Mo),c=si.lengthSq(),h=Math.abs(1-a*a);let f,u,m,v;if(h>0)if(f=a*l-r,u=a*r-l,v=o*h,f>=0)if(u>=-v)if(u<=v){const g=1/h;f*=g,u*=g,m=f*(f+a*u+2*r)+u*(a*f+u+2*l)+c}else u=o,f=Math.max(0,-(a*u+r)),m=-f*f+u*(u+2*l)+c;else u=-o,f=Math.max(0,-(a*u+r)),m=-f*f+u*(u+2*l)+c;else u<=-v?(f=Math.max(0,-(-a*o+r)),u=f>0?-o:Math.min(Math.max(-o,-l),o),m=-f*f+u*(u+2*l)+c):u<=v?(f=0,u=Math.min(Math.max(-o,-l),o),m=u*(u+2*l)+c):(f=Math.max(0,-(a*o+r)),u=f>0?o:Math.min(Math.max(-o,-l),o),m=-f*f+u*(u+2*l)+c);else u=a>0?-o:o,f=Math.max(0,-(a*u+r)),m=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(Wa).addScaledVector(Mo,u),m}intersectSphere(t,e){Fn.subVectors(t.center,this.origin);const n=Fn.dot(this.direction),i=Fn.dot(Fn)-n*n,o=t.radius*t.radius;if(i>o)return null;const a=Math.sqrt(o-i),r=n-a,l=n+a;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,o,a,r,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(o=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(o=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||o>i||((o>n||isNaN(n))&&(n=o),(a<i||isNaN(i))&&(i=a),f>=0?(r=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(r=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||r>i)||((r>n||n!==n)&&(n=r),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Fn)!==null}intersectTriangle(t,e,n,i,o){Va.subVectors(e,t),_o.subVectors(n,t),qa.crossVectors(Va,_o);let a=this.direction.dot(qa),r;if(a>0){if(i)return null;r=1}else if(a<0)r=-1,a=-a;else return null;si.subVectors(this.origin,t);const l=r*this.direction.dot(_o.crossVectors(si,_o));if(l<0)return null;const c=r*this.direction.dot(Va.cross(si));if(c<0||l+c>a)return null;const h=-r*si.dot(qa);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class te{constructor(t,e,n,i,o,a,r,l,c,h,f,u,m,v,g,x){te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,l,c,h,f,u,m,v,g,x)}set(t,e,n,i,o,a,r,l,c,h,f,u,m,v,g,x){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=o,p[5]=a,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=m,p[7]=v,p[11]=g,p[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new te().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Vi.setFromMatrixColumn(t,0).length(),o=1/Vi.setFromMatrixColumn(t,1).length(),a=1/Vi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,o=t.z,a=Math.cos(n),r=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(o),f=Math.sin(o);if(t.order==="XYZ"){const u=a*h,m=a*f,v=r*h,g=r*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=m+v*c,e[5]=u-g*c,e[9]=-r*l,e[2]=g-u*c,e[6]=v+m*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,m=l*f,v=c*h,g=c*f;e[0]=u+g*r,e[4]=v*r-m,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-r,e[2]=m*r-v,e[6]=g+u*r,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,m=l*f,v=c*h,g=c*f;e[0]=u-g*r,e[4]=-a*f,e[8]=v+m*r,e[1]=m+v*r,e[5]=a*h,e[9]=g-u*r,e[2]=-a*c,e[6]=r,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,m=a*f,v=r*h,g=r*f;e[0]=l*h,e[4]=v*c-m,e[8]=u*c+g,e[1]=l*f,e[5]=g*c+u,e[9]=m*c-v,e[2]=-c,e[6]=r*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,m=a*c,v=r*l,g=r*c;e[0]=l*h,e[4]=g-u*f,e[8]=v*f+m,e[1]=f,e[5]=a*h,e[9]=-r*h,e[2]=-c*h,e[6]=m*f+v,e[10]=u-g*f}else if(t.order==="XZY"){const u=a*l,m=a*c,v=r*l,g=r*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+g,e[5]=a*h,e[9]=m*f-v,e[2]=v*f-m,e[6]=r*h,e[10]=g*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(ld,t,cd)}lookAt(t,e,n){const i=this.elements;return an.subVectors(t,e),an.lengthSq()===0&&(an.z=1),an.normalize(),oi.crossVectors(n,an),oi.lengthSq()===0&&(Math.abs(n.z)===1?an.x+=1e-4:an.z+=1e-4,an.normalize(),oi.crossVectors(n,an)),oi.normalize(),yo.crossVectors(an,oi),i[0]=oi.x,i[4]=yo.x,i[8]=an.x,i[1]=oi.y,i[5]=yo.y,i[9]=an.y,i[2]=oi.z,i[6]=yo.z,i[10]=an.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],m=n[13],v=n[2],g=n[6],x=n[10],p=n[14],d=n[3],M=n[7],_=n[11],S=n[15],w=i[0],b=i[4],A=i[8],y=i[12],E=i[1],R=i[5],P=i[9],N=i[13],T=i[2],C=i[6],I=i[10],H=i[14],z=i[3],O=i[7],k=i[11],q=i[15];return o[0]=a*w+r*E+l*T+c*z,o[4]=a*b+r*R+l*C+c*O,o[8]=a*A+r*P+l*I+c*k,o[12]=a*y+r*N+l*H+c*q,o[1]=h*w+f*E+u*T+m*z,o[5]=h*b+f*R+u*C+m*O,o[9]=h*A+f*P+u*I+m*k,o[13]=h*y+f*N+u*H+m*q,o[2]=v*w+g*E+x*T+p*z,o[6]=v*b+g*R+x*C+p*O,o[10]=v*A+g*P+x*I+p*k,o[14]=v*y+g*N+x*H+p*q,o[3]=d*w+M*E+_*T+S*z,o[7]=d*b+M*R+_*C+S*O,o[11]=d*A+M*P+_*I+S*k,o[15]=d*y+M*N+_*H+S*q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],o=t[12],a=t[1],r=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],m=t[14],v=t[3],g=t[7],x=t[11],p=t[15];return v*(+o*l*f-i*c*f-o*r*u+n*c*u+i*r*m-n*l*m)+g*(+e*l*m-e*c*u+o*a*u-i*a*m+i*c*h-o*l*h)+x*(+e*c*f-e*r*m-o*a*f+n*a*m+o*r*h-n*c*h)+p*(-i*r*h-e*l*f+e*r*u+i*a*f-n*a*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],m=t[11],v=t[12],g=t[13],x=t[14],p=t[15],d=f*x*c-g*u*c+g*l*m-r*x*m-f*l*p+r*u*p,M=v*u*c-h*x*c-v*l*m+a*x*m+h*l*p-a*u*p,_=h*g*c-v*f*c+v*r*m-a*g*m-h*r*p+a*f*p,S=v*f*l-h*g*l-v*r*u+a*g*u+h*r*x-a*f*x,w=e*d+n*M+i*_+o*S;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/w;return t[0]=d*b,t[1]=(g*u*o-f*x*o-g*i*m+n*x*m+f*i*p-n*u*p)*b,t[2]=(r*x*o-g*l*o+g*i*c-n*x*c-r*i*p+n*l*p)*b,t[3]=(f*l*o-r*u*o-f*i*c+n*u*c+r*i*m-n*l*m)*b,t[4]=M*b,t[5]=(h*x*o-v*u*o+v*i*m-e*x*m-h*i*p+e*u*p)*b,t[6]=(v*l*o-a*x*o-v*i*c+e*x*c+a*i*p-e*l*p)*b,t[7]=(a*u*o-h*l*o+h*i*c-e*u*c-a*i*m+e*l*m)*b,t[8]=_*b,t[9]=(v*f*o-h*g*o-v*n*m+e*g*m+h*n*p-e*f*p)*b,t[10]=(a*g*o-v*r*o+v*n*c-e*g*c-a*n*p+e*r*p)*b,t[11]=(h*r*o-a*f*o-h*n*c+e*f*c+a*n*m-e*r*m)*b,t[12]=S*b,t[13]=(h*g*i-v*f*i+v*n*u-e*g*u-h*n*x+e*f*x)*b,t[14]=(v*r*i-a*g*i-v*n*l+e*g*l+a*n*x-e*r*x)*b,t[15]=(a*f*i-h*r*i+h*n*l-e*f*l-a*n*u+e*r*u)*b,this}scale(t){const e=this.elements,n=t.x,i=t.y,o=t.z;return e[0]*=n,e[4]*=i,e[8]*=o,e[1]*=n,e[5]*=i,e[9]*=o,e[2]*=n,e[6]*=i,e[10]*=o,e[3]*=n,e[7]*=i,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),o=1-n,a=t.x,r=t.y,l=t.z,c=o*a,h=o*r;return this.set(c*a+n,c*r-i*l,c*l+i*r,0,c*r+i*l,h*r+n,h*l-i*a,0,c*l-i*r,h*l+i*a,o*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,o,a){return this.set(1,n,o,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,o=e._x,a=e._y,r=e._z,l=e._w,c=o+o,h=a+a,f=r+r,u=o*c,m=o*h,v=o*f,g=a*h,x=a*f,p=r*f,d=l*c,M=l*h,_=l*f,S=n.x,w=n.y,b=n.z;return i[0]=(1-(g+p))*S,i[1]=(m+_)*S,i[2]=(v-M)*S,i[3]=0,i[4]=(m-_)*w,i[5]=(1-(u+p))*w,i[6]=(x+d)*w,i[7]=0,i[8]=(v+M)*b,i[9]=(x-d)*b,i[10]=(1-(u+g))*b,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let o=Vi.set(i[0],i[1],i[2]).length();const a=Vi.set(i[4],i[5],i[6]).length(),r=Vi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),t.x=i[12],t.y=i[13],t.z=i[14],yn.copy(this);const c=1/o,h=1/a,f=1/r;return yn.elements[0]*=c,yn.elements[1]*=c,yn.elements[2]*=c,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=f,yn.elements[9]*=f,yn.elements[10]*=f,e.setFromRotationMatrix(yn),n.x=o,n.y=a,n.z=r,this}makePerspective(t,e,n,i,o,a,r=jn){const l=this.elements,c=2*o/(e-t),h=2*o/(n-i),f=(e+t)/(e-t),u=(n+i)/(n-i);let m,v;if(r===jn)m=-(a+o)/(a-o),v=-2*a*o/(a-o);else if(r===fa)m=-a/(a-o),v=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,o,a,r=jn){const l=this.elements,c=1/(e-t),h=1/(n-i),f=1/(a-o),u=(e+t)*c,m=(n+i)*h;let v,g;if(r===jn)v=(a+o)*f,g=-2*f;else if(r===fa)v=o*f,g=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Vi=new W,yn=new te,ld=new W(0,0,0),cd=new W(1,1,1),oi=new W,yo=new W,an=new W,nc=new te,ic=new Di;class co{constructor(t=0,e=0,n=0,i=co.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,o=i[0],a=i[4],r=i[8],l=i[1],c=i[5],h=i[9],f=i[2],u=i[6],m=i[10];switch(e){case"XYZ":this._y=Math.asin(We(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,o),this._z=0);break;case"ZXY":this._x=Math.asin(We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-We(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,o)):(this._x=0,this._y=Math.atan2(r,m));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return nc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(nc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ic.setFromEuler(this),this.setFromQuaternion(ic,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}co.DEFAULT_ORDER="XYZ";class nl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let hd=0;const sc=new W,qi=new Di,In=new te,wo=new W,Fs=new W,ud=new W,fd=new Di,oc=new W(1,0,0),ac=new W(0,1,0),rc=new W(0,0,1),dd={type:"added"},pd={type:"removed"};class sn extends As{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hd++}),this.uuid=Cs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=sn.DEFAULT_UP.clone();const t=new W,e=new co,n=new Di,i=new W(1,1,1);function o(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new te},normalMatrix:{value:new Zt}}),this.matrix=new te,this.matrixWorld=new te,this.matrixAutoUpdate=sn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=sn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return qi.setFromAxisAngle(t,e),this.quaternion.multiply(qi),this}rotateOnWorldAxis(t,e){return qi.setFromAxisAngle(t,e),this.quaternion.premultiply(qi),this}rotateX(t){return this.rotateOnAxis(oc,t)}rotateY(t){return this.rotateOnAxis(ac,t)}rotateZ(t){return this.rotateOnAxis(rc,t)}translateOnAxis(t,e){return sc.copy(t).applyQuaternion(this.quaternion),this.position.add(sc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(oc,t)}translateY(t){return this.translateOnAxis(ac,t)}translateZ(t){return this.translateOnAxis(rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?wo.copy(t):wo.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(Fs,wo,this.up):In.lookAt(wo,Fs,this.up),this.quaternion.setFromRotationMatrix(In),i&&(In.extractRotation(i.matrixWorld),qi.setFromRotationMatrix(In),this.quaternion.premultiply(qi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(dd)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(pd)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),In.multiply(t.parent.matrixWorld)),t.applyMatrix4(In),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let o=0,a=i.length;o<a;o++)i[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fs,t,ud),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fs,fd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const o=e[n];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let o=0,a=i.length;o<a;o++){const r=i[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function o(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];o(t.shapes,f)}else o(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(o(t.materials,this.material[l]));i.material=r}else i.material=o(t.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];i.animations.push(o(t.animations,l))}}if(e){const r=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),m=a(t.animations),v=a(t.nodes);r.length>0&&(n.geometries=r),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=i,n;function a(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}sn.DEFAULT_UP=new W(0,1,0);sn.DEFAULT_MATRIX_AUTO_UPDATE=!0;sn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const wn=new W,Un=new W,Xa=new W,Nn=new W,Xi=new W,ji=new W,lc=new W,ja=new W,Ya=new W,$a=new W;let bo=!1;class En{constructor(t=new W,e=new W,n=new W){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),wn.subVectors(t,e),i.cross(wn);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(t,e,n,i,o){wn.subVectors(i,e),Un.subVectors(n,e),Xa.subVectors(t,e);const a=wn.dot(wn),r=wn.dot(Un),l=wn.dot(Xa),c=Un.dot(Un),h=Un.dot(Xa),f=a*c-r*r;if(f===0)return o.set(0,0,0),null;const u=1/f,m=(c*l-r*h)*u,v=(a*h-r*l)*u;return o.set(1-m-v,v,m)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getUV(t,e,n,i,o,a,r,l){return bo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),bo=!0),this.getInterpolation(t,e,n,i,o,a,r,l)}static getInterpolation(t,e,n,i,o,a,r,l){return this.getBarycoord(t,e,n,i,Nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,Nn.x),l.addScaledVector(a,Nn.y),l.addScaledVector(r,Nn.z),l)}static isFrontFacing(t,e,n,i){return wn.subVectors(n,e),Un.subVectors(t,e),wn.cross(Un).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return wn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),wn.cross(Un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return En.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return En.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,o){return bo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),bo=!0),En.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}getInterpolation(t,e,n,i,o){return En.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}containsPoint(t){return En.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return En.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,o=this.c;let a,r;Xi.subVectors(i,n),ji.subVectors(o,n),ja.subVectors(t,n);const l=Xi.dot(ja),c=ji.dot(ja);if(l<=0&&c<=0)return e.copy(n);Ya.subVectors(t,i);const h=Xi.dot(Ya),f=ji.dot(Ya);if(h>=0&&f<=h)return e.copy(i);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Xi,a);$a.subVectors(t,o);const m=Xi.dot($a),v=ji.dot($a);if(v>=0&&m<=v)return e.copy(o);const g=m*c-l*v;if(g<=0&&c>=0&&v<=0)return r=c/(c-v),e.copy(n).addScaledVector(ji,r);const x=h*v-m*f;if(x<=0&&f-h>=0&&m-v>=0)return lc.subVectors(o,i),r=(f-h)/(f-h+(m-v)),e.copy(i).addScaledVector(lc,r);const p=1/(x+g+u);return a=g*p,r=u*p,e.copy(n).addScaledVector(Xi,a).addScaledVector(ji,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Yh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},So={h:0,s:0,l:0};function Ka(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Dt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ue){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ce.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=ce.workingColorSpace){return this.r=t,this.g=e,this.b=n,ce.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=ce.workingColorSpace){if(t=tl(t,1),e=We(e,0,1),n=We(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,a=2*n-o;this.r=Ka(a,o,t+1/3),this.g=Ka(a,o,t),this.b=Ka(a,o,t-1/3)}return ce.toWorkingColorSpace(this,i),this}setStyle(t,e=Ue){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=i[1],r=i[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=i[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ue){const n=Yh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ms(t.r),this.g=Ms(t.g),this.b=Ms(t.b),this}copyLinearToSRGB(t){return this.r=Na(t.r),this.g=Na(t.g),this.b=Na(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ue){return ce.fromWorkingColorSpace(He.copy(this),t),Math.round(We(He.r*255,0,255))*65536+Math.round(We(He.g*255,0,255))*256+Math.round(We(He.b*255,0,255))}getHexString(t=Ue){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ce.workingColorSpace){ce.fromWorkingColorSpace(He.copy(this),e);const n=He.r,i=He.g,o=He.b,a=Math.max(n,i,o),r=Math.min(n,i,o);let l,c;const h=(r+a)/2;if(r===a)l=0,c=0;else{const f=a-r;switch(c=h<=.5?f/(a+r):f/(2-a-r),a){case n:l=(i-o)/f+(i<o?6:0);break;case i:l=(o-n)/f+2;break;case o:l=(n-i)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ce.workingColorSpace){return ce.fromWorkingColorSpace(He.copy(this),e),t.r=He.r,t.g=He.g,t.b=He.b,t}getStyle(t=Ue){ce.fromWorkingColorSpace(He.copy(this),t);const e=He.r,n=He.g,i=He.b;return t!==Ue?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(ai),this.setHSL(ai.h+t,ai.s+e,ai.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(ai),t.getHSL(So);const n=Js(ai.h,So.h,e),i=Js(ai.s,So.s,e),o=Js(ai.l,So.l,e);return this.setHSL(n,i,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*i,this.g=o[1]*e+o[4]*n+o[7]*i,this.b=o[2]*e+o[5]*n+o[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const He=new Dt;Dt.NAMES=Yh;let md=0;class ho extends As{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:md++}),this.uuid=Cs(),this.name="",this.type="Material",this.blending=gs,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Pr,this.blendDst=Lr,this.blendEquation=bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Dt(0,0,0),this.blendAlpha=0,this.depthFunc=la,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==gs&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Pr&&(n.blendSrc=this.blendSrc),this.blendDst!==Lr&&(n.blendDst=this.blendDst),this.blendEquation!==bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==la&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Yl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const a=[];for(const r in o){const l=o[r];delete l.metadata,a.push(l)}return a}if(e){const o=i(t.textures),a=i(t.images);o.length>0&&(n.textures=o),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class $h extends ho{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Dt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Dh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const qn=gd();function gd(){const s=new ArrayBuffer(4),t=new Float32Array(s),e=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const o=new Uint32Array(2048),a=new Uint32Array(64),r=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,o[l]=c|h}for(let l=1024;l<2048;++l)o[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(r[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:o,exponentTable:a,offsetTable:r}}function xd(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=We(s,-65504,65504),qn.floatView[0]=s;const t=qn.uint32View[0],e=t>>23&511;return qn.baseTable[e]+((t&8388607)>>qn.shiftTable[e])}function vd(s){const t=s>>10;return qn.uint32View[0]=qn.mantissaTable[qn.offsetTable[t]+(s&1023)]+qn.exponentTable[t],qn.floatView[0]}const cc={toHalfFloat:xd,fromHalfFloat:vd},Ce=new W,Eo=new Ut;class oe{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=$l,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Eo.fromBufferAttribute(this,e),Eo.applyMatrix3(t),this.setXY(e,Eo.x,Eo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix3(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyMatrix4(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.applyNormalMatrix(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ce.fromBufferAttribute(this,e),Ce.transformDirection(t),this.setXYZ(e,Ce.x,Ce.y,Ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ls(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=je(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ls(e,this.array)),e}setX(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ls(e,this.array)),e}setY(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ls(e,this.array)),e}setZ(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ls(e,this.array)),e}setW(t,e){return this.normalized&&(e=je(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array),i=je(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,o){return t*=this.itemSize,this.normalized&&(e=je(e,this.array),n=je(n,this.array),i=je(i,this.array),o=je(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==$l&&(t.usage=this.usage),t}}class Kh extends oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Zh extends oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class xe extends oe{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Md=0;const fn=new te,Za=new sn,Yi=new W,rn=new kn,Is=new kn,Fe=new W;class Le extends As{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Md++}),this.uuid=Cs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vh(t)?Zh:Kh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Zt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return fn.makeRotationFromQuaternion(t),this.applyMatrix4(fn),this}rotateX(t){return fn.makeRotationX(t),this.applyMatrix4(fn),this}rotateY(t){return fn.makeRotationY(t),this.applyMatrix4(fn),this}rotateZ(t){return fn.makeRotationZ(t),this.applyMatrix4(fn),this}translate(t,e,n){return fn.makeTranslation(t,e,n),this.applyMatrix4(fn),this}scale(t,e,n){return fn.makeScale(t,e,n),this.applyMatrix4(fn),this}lookAt(t){return Za.lookAt(t),Za.updateMatrix(),this.applyMatrix4(Za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Yi).negate(),this.translate(Yi.x,Yi.y,Yi.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new xe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const o=e[n];rn.setFromBufferAttribute(o),this.morphTargetsRelative?(Fe.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Fe),Fe.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Fe)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new W,1/0);return}if(t){const n=this.boundingSphere.center;if(rn.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];Is.setFromBufferAttribute(r),this.morphTargetsRelative?(Fe.addVectors(rn.min,Is.min),rn.expandByPoint(Fe),Fe.addVectors(rn.max,Is.max),rn.expandByPoint(Fe)):(rn.expandByPoint(Is.min),rn.expandByPoint(Is.max))}rn.getCenter(n);let i=0;for(let o=0,a=t.count;o<a;o++)Fe.fromBufferAttribute(t,o),i=Math.max(i,n.distanceToSquared(Fe));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)Fe.fromBufferAttribute(r,c),l&&(Yi.fromBufferAttribute(t,c),Fe.add(Yi)),i=Math.max(i,n.distanceToSquared(Fe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,o=e.normal.array,a=e.uv.array,r=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new oe(new Float32Array(4*r),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let E=0;E<r;E++)c[E]=new W,h[E]=new W;const f=new W,u=new W,m=new W,v=new Ut,g=new Ut,x=new Ut,p=new W,d=new W;function M(E,R,P){f.fromArray(i,E*3),u.fromArray(i,R*3),m.fromArray(i,P*3),v.fromArray(a,E*2),g.fromArray(a,R*2),x.fromArray(a,P*2),u.sub(f),m.sub(f),g.sub(v),x.sub(v);const N=1/(g.x*x.y-x.x*g.y);isFinite(N)&&(p.copy(u).multiplyScalar(x.y).addScaledVector(m,-g.y).multiplyScalar(N),d.copy(m).multiplyScalar(g.x).addScaledVector(u,-x.x).multiplyScalar(N),c[E].add(p),c[R].add(p),c[P].add(p),h[E].add(d),h[R].add(d),h[P].add(d))}let _=this.groups;_.length===0&&(_=[{start:0,count:n.length}]);for(let E=0,R=_.length;E<R;++E){const P=_[E],N=P.start,T=P.count;for(let C=N,I=N+T;C<I;C+=3)M(n[C+0],n[C+1],n[C+2])}const S=new W,w=new W,b=new W,A=new W;function y(E){b.fromArray(o,E*3),A.copy(b);const R=c[E];S.copy(R),S.sub(b.multiplyScalar(b.dot(R))).normalize(),w.crossVectors(A,R);const N=w.dot(h[E])<0?-1:1;l[E*4]=S.x,l[E*4+1]=S.y,l[E*4+2]=S.z,l[E*4+3]=N}for(let E=0,R=_.length;E<R;++E){const P=_[E],N=P.start,T=P.count;for(let C=N,I=N+T;C<I;C+=3)y(n[C+0]),y(n[C+1]),y(n[C+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const i=new W,o=new W,a=new W,r=new W,l=new W,c=new W,h=new W,f=new W;if(t)for(let u=0,m=t.count;u<m;u+=3){const v=t.getX(u+0),g=t.getX(u+1),x=t.getX(u+2);i.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),a.fromBufferAttribute(e,x),h.subVectors(a,o),f.subVectors(i,o),h.cross(f),r.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),r.add(h),l.add(h),c.add(h),n.setXYZ(v,r.x,r.y,r.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(x,c.x,c.y,c.z)}else for(let u=0,m=e.count;u<m;u+=3)i.fromBufferAttribute(e,u+0),o.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,o),f.subVectors(i,o),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Fe.fromBufferAttribute(t,e),Fe.normalize(),t.setXYZ(e,Fe.x,Fe.y,Fe.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,f=r.normalized,u=new c.constructor(l.length*h);let m=0,v=0;for(let g=0,x=l.length;g<x;g++){r.isInterleavedBufferAttribute?m=l[g]*r.data.stride+r.offset:m=l[g]*h;for(let p=0;p<h;p++)u[v++]=c[m++]}return new oe(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,n=this.index.array,i=this.attributes;for(const r in i){const l=i[r],c=t(l,n);e.setAttribute(r,c)}const o=this.morphAttributes;for(const r in o){const l=[],c=o[r];for(let h=0,f=c.length;h<f;h++){const u=c[h],m=t(u,n);l.push(m)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,l=a.length;r<l;r++){const c=a[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const m=c[f];h.push(m.toJSON(t.data))}h.length>0&&(i[l]=h,o=!0)}o&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const o=t.morphAttributes;for(const c in o){const h=[],f=o[c];for(let u=0,m=f.length;u<m;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hc=new te,mi=new el,To=new zi,uc=new W,$i=new W,Ki=new W,Zi=new W,Ja=new W,Ao=new W,Co=new Ut,Ro=new Ut,Po=new Ut,fc=new W,dc=new W,pc=new W,Lo=new W,ko=new W;class ae extends sn{constructor(t=new Le,e=new $h){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const r=this.morphTargetInfluences;if(o&&r){Ao.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=r[l],f=o[l];h!==0&&(Ja.fromBufferAttribute(f,t),a?Ao.addScaledVector(Ja,h):Ao.addScaledVector(Ja.sub(e),h))}e.add(Ao)}return e}raycast(t,e){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),To.copy(n.boundingSphere),To.applyMatrix4(o),mi.copy(t.ray).recast(t.near),!(To.containsPoint(mi.origin)===!1&&(mi.intersectSphere(To,uc)===null||mi.origin.distanceToSquared(uc)>(t.far-t.near)**2))&&(hc.copy(o).invert(),mi.copy(t.ray).applyMatrix4(hc),!(n.boundingBox!==null&&mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,mi)))}_computeIntersections(t,e,n){let i;const o=this.geometry,a=this.material,r=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,f=o.attributes.normal,u=o.groups,m=o.drawRange;if(r!==null)if(Array.isArray(a))for(let v=0,g=u.length;v<g;v++){const x=u[v],p=a[x.materialIndex],d=Math.max(x.start,m.start),M=Math.min(r.count,Math.min(x.start+x.count,m.start+m.count));for(let _=d,S=M;_<S;_+=3){const w=r.getX(_),b=r.getX(_+1),A=r.getX(_+2);i=Do(this,p,t,n,c,h,f,w,b,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=x.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(r.count,m.start+m.count);for(let x=v,p=g;x<p;x+=3){const d=r.getX(x),M=r.getX(x+1),_=r.getX(x+2);i=Do(this,a,t,n,c,h,f,d,M,_),i&&(i.faceIndex=Math.floor(x/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,g=u.length;v<g;v++){const x=u[v],p=a[x.materialIndex],d=Math.max(x.start,m.start),M=Math.min(l.count,Math.min(x.start+x.count,m.start+m.count));for(let _=d,S=M;_<S;_+=3){const w=_,b=_+1,A=_+2;i=Do(this,p,t,n,c,h,f,w,b,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=x.materialIndex,e.push(i))}}else{const v=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let x=v,p=g;x<p;x+=3){const d=x,M=x+1,_=x+2;i=Do(this,a,t,n,c,h,f,d,M,_),i&&(i.faceIndex=Math.floor(x/3),e.push(i))}}}}function _d(s,t,e,n,i,o,a,r){let l;if(t.side===$e?l=n.intersectTriangle(a,o,i,!0,r):l=n.intersectTriangle(i,o,a,t.side===Zn,r),l===null)return null;ko.copy(r),ko.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(ko);return c<e.near||c>e.far?null:{distance:c,point:ko.clone(),object:s}}function Do(s,t,e,n,i,o,a,r,l,c){s.getVertexPosition(r,$i),s.getVertexPosition(l,Ki),s.getVertexPosition(c,Zi);const h=_d(s,t,e,n,$i,Ki,Zi,Lo);if(h){i&&(Co.fromBufferAttribute(i,r),Ro.fromBufferAttribute(i,l),Po.fromBufferAttribute(i,c),h.uv=En.getInterpolation(Lo,$i,Ki,Zi,Co,Ro,Po,new Ut)),o&&(Co.fromBufferAttribute(o,r),Ro.fromBufferAttribute(o,l),Po.fromBufferAttribute(o,c),h.uv1=En.getInterpolation(Lo,$i,Ki,Zi,Co,Ro,Po,new Ut),h.uv2=h.uv1),a&&(fc.fromBufferAttribute(a,r),dc.fromBufferAttribute(a,l),pc.fromBufferAttribute(a,c),h.normal=En.getInterpolation(Lo,$i,Ki,Zi,fc,dc,pc,new W),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:r,b:l,c,normal:new W,materialIndex:0};En.getNormal($i,Ki,Zi,f.normal),h.face=f}return h}class uo extends Le{constructor(t=1,e=1,n=1,i=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:o,depthSegments:a};const r=this;i=Math.floor(i),o=Math.floor(o),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,m=0;v("z","y","x",-1,-1,n,e,t,a,o,0),v("z","y","x",1,-1,n,e,-t,a,o,1),v("x","z","y",1,1,t,n,e,i,a,2),v("x","z","y",1,-1,t,n,-e,i,a,3),v("x","y","z",1,-1,t,e,n,i,o,4),v("x","y","z",-1,-1,t,e,-n,i,o,5),this.setIndex(l),this.setAttribute("position",new xe(c,3)),this.setAttribute("normal",new xe(h,3)),this.setAttribute("uv",new xe(f,2));function v(g,x,p,d,M,_,S,w,b,A,y){const E=_/b,R=S/A,P=_/2,N=S/2,T=w/2,C=b+1,I=A+1;let H=0,z=0;const O=new W;for(let k=0;k<I;k++){const q=k*R-N;for(let K=0;K<C;K++){const L=K*E-P;O[g]=L*d,O[x]=q*M,O[p]=T,c.push(O.x,O.y,O.z),O[g]=0,O[x]=0,O[p]=w>0?1:-1,h.push(O.x,O.y,O.z),f.push(K/b),f.push(1-k/A),H+=1}}for(let k=0;k<A;k++)for(let q=0;q<b;q++){const K=u+q+C*k,L=u+q+C*(k+1),B=u+(q+1)+C*(k+1),G=u+(q+1)+C*k;l.push(K,L,G),l.push(L,B,G),z+=6}r.addGroup(m,z,y),m+=z,u+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uo(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ss(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ye(s){const t={};for(let e=0;e<s.length;e++){const n=Ss(s[e]);for(const i in n)t[i]=n[i]}return t}function yd(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Jh(s){return s.getRenderTarget()===null?s.outputColorSpace:ce.workingColorSpace}const wd={clone:Ss,merge:Ye};var bd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class be extends ho{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=bd,this.fragmentShader=Sd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ss(t.uniforms),this.uniformsGroups=yd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Qh extends sn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new te,this.projectionMatrix=new te,this.projectionMatrixInverse=new te,this.coordinateSystem=jn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Qe extends Qh{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=no*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Zs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return no*2*Math.atan(Math.tan(Zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Zs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,o=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;o+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ji=-90,Qi=1;class Ed extends sn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Qe(Ji,Qi,t,e);i.layers=this.layers,this.add(i);const o=new Qe(Ji,Qi,t,e);o.layers=this.layers,this.add(o);const a=new Qe(Ji,Qi,t,e);a.layers=this.layers,this.add(a);const r=new Qe(Ji,Qi,t,e);r.layers=this.layers,this.add(r);const l=new Qe(Ji,Qi,t,e);l.layers=this.layers,this.add(l);const c=new Qe(Ji,Qi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,o,a,r,l]=e;for(const c of e)this.remove(c);if(t===jn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===fa)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,o),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,r),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(f,u,m),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class tu extends nn{constructor(t,e,n,i,o,a,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ys,super(t,e,n,i,o,a,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Td extends hn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(Qs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Ai?Ue:gn),this.texture=new tu(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:fe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new uo(5,5,5),o=new be({name:"CubemapFromEquirect",uniforms:Ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:li});o.uniforms.tEquirect.value=e;const a=new ae(i,o),r=e.minFilter;return e.minFilter===Li&&(e.minFilter=fe),new Ed(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(o)}}const Qa=new W,Ad=new W,Cd=new Zt;class _i{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Qa.subVectors(n,e).cross(Ad.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Qa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Cd.getNormalMatrix(t),i=this.coplanarPoint(Qa).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new zi,zo=new W;class Rs{constructor(t=new _i,e=new _i,n=new _i,i=new _i,o=new _i,a=new _i){this.planes=[t,e,n,i,o,a]}set(t,e,n,i,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(i),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=jn){const n=this.planes,i=t.elements,o=i[0],a=i[1],r=i[2],l=i[3],c=i[4],h=i[5],f=i[6],u=i[7],m=i[8],v=i[9],g=i[10],x=i[11],p=i[12],d=i[13],M=i[14],_=i[15];if(n[0].setComponents(l-o,u-c,x-m,_-p).normalize(),n[1].setComponents(l+o,u+c,x+m,_+p).normalize(),n[2].setComponents(l+a,u+h,x+v,_+d).normalize(),n[3].setComponents(l-a,u-h,x-v,_-d).normalize(),n[4].setComponents(l-r,u-f,x-g,_-M).normalize(),e===jn)n[5].setComponents(l+r,u+f,x+g,_+M).normalize();else if(e===fa)n[5].setComponents(r,f,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(t){return gi.center.set(0,0,0),gi.radius=.7071067811865476,gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(zo.x=i.normal.x>0?t.max.x:t.min.x,zo.y=i.normal.y>0?t.max.y:t.min.y,zo.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(zo)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function eu(){let s=null,t=!1,e=null,n=null;function i(o,a){e(o,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){s=o}}}function Rd(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const f=c.array,u=c.usage,m=f.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,f,u),c.onUploadCallback();let g;if(f instanceof Float32Array)g=s.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)g=s.SHORT;else if(f instanceof Uint32Array)g=s.UNSIGNED_INT;else if(f instanceof Int32Array)g=s.INT;else if(f instanceof Int8Array)g=s.BYTE;else if(f instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:v,type:g,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:m}}function o(c,h,f){const u=h.array,m=h._updateRange,v=h.updateRanges;if(s.bindBuffer(f,c),m.count===-1&&v.length===0&&s.bufferSubData(f,0,u),v.length!==0){for(let g=0,x=v.length;g<x;g++){const p=v[g];e?s.bufferSubData(f,p.start*u.BYTES_PER_ELEMENT,u,p.start,p.count):s.bufferSubData(f,p.start*u.BYTES_PER_ELEMENT,u.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}m.count!==-1&&(e?s.bufferSubData(f,m.offset*u.BYTES_PER_ELEMENT,u,m.offset,m.count):s.bufferSubData(f,m.offset*u.BYTES_PER_ELEMENT,u.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const u=n.get(c);(!u||u.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=n.get(c);if(f===void 0)n.set(c,i(c,h));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(f.buffer,c,h),f.version=c.version}}return{get:a,remove:r,update:l}}class il extends Le{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const o=t/2,a=e/2,r=Math.floor(n),l=Math.floor(i),c=r+1,h=l+1,f=t/r,u=e/l,m=[],v=[],g=[],x=[];for(let p=0;p<h;p++){const d=p*u-a;for(let M=0;M<c;M++){const _=M*f-o;v.push(_,-d,0),g.push(0,0,1),x.push(M/r),x.push(1-p/l)}}for(let p=0;p<l;p++)for(let d=0;d<r;d++){const M=d+c*p,_=d+c*(p+1),S=d+1+c*(p+1),w=d+1+c*p;m.push(M,_,w),m.push(_,S,w)}this.setIndex(m),this.setAttribute("position",new xe(v,3)),this.setAttribute("normal",new xe(g,3)),this.setAttribute("uv",new xe(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new il(t.width,t.height,t.widthSegments,t.heightSegments)}}var Pd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ld=`#ifdef USE_ALPHAHASH
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
#endif`,kd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Dd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zd=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Fd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Id=`#ifdef USE_AOMAP
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
#endif`,Ud=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nd=`#ifdef USE_BATCHING
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
#endif`,Od=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Bd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Wd=`#ifdef USE_IRIDESCENCE
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
#endif`,Vd=`#ifdef USE_BUMPMAP
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
#endif`,qd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Xd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$d=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Zd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Jd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Qd=`#define PI 3.141592653589793
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
} // validated`,t0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,e0=`vec3 transformedNormal = objectNormal;
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
#endif`,n0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,i0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,s0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,o0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,a0="gl_FragColor = linearToOutputTexel( gl_FragColor );",r0=`
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
}`,l0=`#ifdef USE_ENVMAP
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
#endif`,c0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,h0=`#ifdef USE_ENVMAP
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
#endif`,u0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,f0=`#ifdef USE_ENVMAP
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
#endif`,d0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,p0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,m0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,g0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,x0=`#ifdef USE_GRADIENTMAP
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
}`,v0=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,M0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,w0=`uniform bool receiveShadow;
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
#endif`,b0=`#ifdef USE_ENVMAP
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
#endif`,S0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,E0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,T0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,A0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,C0=`PhysicalMaterial material;
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
#endif`,R0=`struct PhysicalMaterial {
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
}`,P0=`
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
#endif`,L0=`#if defined( RE_IndirectDiffuse )
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
#endif`,k0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,D0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,z0=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,F0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,I0=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,U0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,N0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,O0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,B0=`#if defined( USE_POINTS_UV )
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
#endif`,H0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,G0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,W0=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,V0=`#ifdef USE_MORPHNORMALS
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
#endif`,q0=`#ifdef USE_MORPHTARGETS
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
#endif`,X0=`#ifdef USE_MORPHTARGETS
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
#endif`,j0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Y0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Z0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,J0=`#ifdef USE_NORMALMAP
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
#endif`,Q0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ep=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,np=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ip=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,op=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ap=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,up=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pp=`float getShadowMask() {
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
}`,mp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gp=`#ifdef USE_SKINNING
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
#endif`,xp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vp=`#ifdef USE_SKINNING
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
#endif`,Mp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_p=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,wp=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,bp=`#ifdef USE_TRANSMISSION
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
#endif`,Sp=`#ifdef USE_TRANSMISSION
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
#endif`,Ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Rp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pp=`uniform sampler2D t2D;
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
}`,Lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,kp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fp=`#include <common>
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
}`,Ip=`#if DEPTH_PACKING == 3200
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
}`,Up=`#define DISTANCE
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
}`,Np=`#define DISTANCE
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
}`,Op=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hp=`uniform float scale;
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
}`,Gp=`uniform vec3 diffuse;
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
}`,Wp=`#include <common>
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
}`,Vp=`uniform vec3 diffuse;
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
}`,qp=`#define LAMBERT
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
}`,Xp=`#define LAMBERT
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
}`,jp=`#define MATCAP
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
}`,Yp=`#define MATCAP
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
}`,$p=`#define NORMAL
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
}`,Kp=`#define NORMAL
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
}`,Zp=`#define PHONG
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
}`,Jp=`#define PHONG
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
}`,Qp=`#define STANDARD
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
}`,tm=`#define STANDARD
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
}`,em=`#define TOON
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
}`,nm=`#define TOON
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
}`,im=`uniform float size;
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
}`,sm=`uniform vec3 diffuse;
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
}`,om=`#include <common>
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
}`,am=`uniform vec3 color;
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
}`,rm=`uniform float rotation;
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
}`,lm=`uniform vec3 diffuse;
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
}`,Yt={alphahash_fragment:Pd,alphahash_pars_fragment:Ld,alphamap_fragment:kd,alphamap_pars_fragment:Dd,alphatest_fragment:zd,alphatest_pars_fragment:Fd,aomap_fragment:Id,aomap_pars_fragment:Ud,batching_pars_vertex:Nd,batching_vertex:Od,begin_vertex:Bd,beginnormal_vertex:Hd,bsdfs:Gd,iridescence_fragment:Wd,bumpmap_pars_fragment:Vd,clipping_planes_fragment:qd,clipping_planes_pars_fragment:Xd,clipping_planes_pars_vertex:jd,clipping_planes_vertex:Yd,color_fragment:$d,color_pars_fragment:Kd,color_pars_vertex:Zd,color_vertex:Jd,common:Qd,cube_uv_reflection_fragment:t0,defaultnormal_vertex:e0,displacementmap_pars_vertex:n0,displacementmap_vertex:i0,emissivemap_fragment:s0,emissivemap_pars_fragment:o0,colorspace_fragment:a0,colorspace_pars_fragment:r0,envmap_fragment:l0,envmap_common_pars_fragment:c0,envmap_pars_fragment:h0,envmap_pars_vertex:u0,envmap_physical_pars_fragment:b0,envmap_vertex:f0,fog_vertex:d0,fog_pars_vertex:p0,fog_fragment:m0,fog_pars_fragment:g0,gradientmap_pars_fragment:x0,lightmap_fragment:v0,lightmap_pars_fragment:M0,lights_lambert_fragment:_0,lights_lambert_pars_fragment:y0,lights_pars_begin:w0,lights_toon_fragment:S0,lights_toon_pars_fragment:E0,lights_phong_fragment:T0,lights_phong_pars_fragment:A0,lights_physical_fragment:C0,lights_physical_pars_fragment:R0,lights_fragment_begin:P0,lights_fragment_maps:L0,lights_fragment_end:k0,logdepthbuf_fragment:D0,logdepthbuf_pars_fragment:z0,logdepthbuf_pars_vertex:F0,logdepthbuf_vertex:I0,map_fragment:U0,map_pars_fragment:N0,map_particle_fragment:O0,map_particle_pars_fragment:B0,metalnessmap_fragment:H0,metalnessmap_pars_fragment:G0,morphcolor_vertex:W0,morphnormal_vertex:V0,morphtarget_pars_vertex:q0,morphtarget_vertex:X0,normal_fragment_begin:j0,normal_fragment_maps:Y0,normal_pars_fragment:$0,normal_pars_vertex:K0,normal_vertex:Z0,normalmap_pars_fragment:J0,clearcoat_normal_fragment_begin:Q0,clearcoat_normal_fragment_maps:tp,clearcoat_pars_fragment:ep,iridescence_pars_fragment:np,opaque_fragment:ip,packing:sp,premultiplied_alpha_fragment:op,project_vertex:ap,dithering_fragment:rp,dithering_pars_fragment:lp,roughnessmap_fragment:cp,roughnessmap_pars_fragment:hp,shadowmap_pars_fragment:up,shadowmap_pars_vertex:fp,shadowmap_vertex:dp,shadowmask_pars_fragment:pp,skinbase_vertex:mp,skinning_pars_vertex:gp,skinning_vertex:xp,skinnormal_vertex:vp,specularmap_fragment:Mp,specularmap_pars_fragment:_p,tonemapping_fragment:yp,tonemapping_pars_fragment:wp,transmission_fragment:bp,transmission_pars_fragment:Sp,uv_pars_fragment:Ep,uv_pars_vertex:Tp,uv_vertex:Ap,worldpos_vertex:Cp,background_vert:Rp,background_frag:Pp,backgroundCube_vert:Lp,backgroundCube_frag:kp,cube_vert:Dp,cube_frag:zp,depth_vert:Fp,depth_frag:Ip,distanceRGBA_vert:Up,distanceRGBA_frag:Np,equirect_vert:Op,equirect_frag:Bp,linedashed_vert:Hp,linedashed_frag:Gp,meshbasic_vert:Wp,meshbasic_frag:Vp,meshlambert_vert:qp,meshlambert_frag:Xp,meshmatcap_vert:jp,meshmatcap_frag:Yp,meshnormal_vert:$p,meshnormal_frag:Kp,meshphong_vert:Zp,meshphong_frag:Jp,meshphysical_vert:Qp,meshphysical_frag:tm,meshtoon_vert:em,meshtoon_frag:nm,points_vert:im,points_frag:sm,shadow_vert:om,shadow_frag:am,sprite_vert:rm,sprite_frag:lm},wt={common:{diffuse:{value:new Dt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new Ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Dt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Dt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new Dt(16777215)},opacity:{value:1},center:{value:new Ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Ln={basic:{uniforms:Ye([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Ye([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Ye([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Dt(0)},specular:{value:new Dt(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Ye([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new Dt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Ye([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new Dt(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Ye([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Ye([wt.points,wt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Ye([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Ye([wt.common,wt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Ye([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Ye([wt.sprite,wt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:Ye([wt.common,wt.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:Ye([wt.lights,wt.fog,{color:{value:new Dt(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Ln.physical={uniforms:Ye([Ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new Ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new Dt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new Ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new Dt(0)},specularColor:{value:new Dt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new Ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const Fo={r:0,b:0,g:0};function cm(s,t,e,n,i,o,a){const r=new Dt(0);let l=o===!0?0:1,c,h,f=null,u=0,m=null;function v(x,p){let d=!1,M=p.isScene===!0?p.background:null;M&&M.isTexture&&(M=(p.backgroundBlurriness>0?e:t).get(M)),M===null?g(r,l):M&&M.isColor&&(g(M,1),d=!0);const _=s.xr.getEnvironmentBlendMode();_==="additive"?n.buffers.color.setClear(0,0,0,1,a):_==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||d)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Ma)?(h===void 0&&(h=new ae(new uo(1,1,1),new be({name:"BackgroundCubeMaterial",uniforms:Ss(Ln.backgroundCube.uniforms),vertexShader:Ln.backgroundCube.vertexShader,fragmentShader:Ln.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,w,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=ce.getTransfer(M.colorSpace)!==ge,(f!==M||u!==M.version||m!==s.toneMapping)&&(h.material.needsUpdate=!0,f=M,u=M.version,m=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new ae(new il(2,2),new be({name:"BackgroundMaterial",uniforms:Ss(Ln.background.uniforms),vertexShader:Ln.background.vertexShader,fragmentShader:Ln.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=ce.getTransfer(M.colorSpace)!==ge,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||u!==M.version||m!==s.toneMapping)&&(c.material.needsUpdate=!0,f=M,u=M.version,m=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function g(x,p){x.getRGB(Fo,Jh(s)),n.buffers.color.setClear(Fo.r,Fo.g,Fo.b,p,a)}return{getClearColor:function(){return r},setClearColor:function(x,p=1){r.set(x),l=p,g(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,g(r,l)},render:v}}function hm(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||o!==null,r={},l=x(null);let c=l,h=!1;function f(T,C,I,H,z){let O=!1;if(a){const k=g(H,I,C);c!==k&&(c=k,m(c.object)),O=p(T,H,I,z),O&&d(T,H,I,z)}else{const k=C.wireframe===!0;(c.geometry!==H.id||c.program!==I.id||c.wireframe!==k)&&(c.geometry=H.id,c.program=I.id,c.wireframe=k,O=!0)}z!==null&&e.update(z,s.ELEMENT_ARRAY_BUFFER),(O||h)&&(h=!1,A(T,C,I,H),z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function u(){return n.isWebGL2?s.createVertexArray():o.createVertexArrayOES()}function m(T){return n.isWebGL2?s.bindVertexArray(T):o.bindVertexArrayOES(T)}function v(T){return n.isWebGL2?s.deleteVertexArray(T):o.deleteVertexArrayOES(T)}function g(T,C,I){const H=I.wireframe===!0;let z=r[T.id];z===void 0&&(z={},r[T.id]=z);let O=z[C.id];O===void 0&&(O={},z[C.id]=O);let k=O[H];return k===void 0&&(k=x(u()),O[H]=k),k}function x(T){const C=[],I=[],H=[];for(let z=0;z<i;z++)C[z]=0,I[z]=0,H[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:I,attributeDivisors:H,object:T,attributes:{},index:null}}function p(T,C,I,H){const z=c.attributes,O=C.attributes;let k=0;const q=I.getAttributes();for(const K in q)if(q[K].location>=0){const B=z[K];let G=O[K];if(G===void 0&&(K==="instanceMatrix"&&T.instanceMatrix&&(G=T.instanceMatrix),K==="instanceColor"&&T.instanceColor&&(G=T.instanceColor)),B===void 0||B.attribute!==G||G&&B.data!==G.data)return!0;k++}return c.attributesNum!==k||c.index!==H}function d(T,C,I,H){const z={},O=C.attributes;let k=0;const q=I.getAttributes();for(const K in q)if(q[K].location>=0){let B=O[K];B===void 0&&(K==="instanceMatrix"&&T.instanceMatrix&&(B=T.instanceMatrix),K==="instanceColor"&&T.instanceColor&&(B=T.instanceColor));const G={};G.attribute=B,B&&B.data&&(G.data=B.data),z[K]=G,k++}c.attributes=z,c.attributesNum=k,c.index=H}function M(){const T=c.newAttributes;for(let C=0,I=T.length;C<I;C++)T[C]=0}function _(T){S(T,0)}function S(T,C){const I=c.newAttributes,H=c.enabledAttributes,z=c.attributeDivisors;I[T]=1,H[T]===0&&(s.enableVertexAttribArray(T),H[T]=1),z[T]!==C&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](T,C),z[T]=C)}function w(){const T=c.newAttributes,C=c.enabledAttributes;for(let I=0,H=C.length;I<H;I++)C[I]!==T[I]&&(s.disableVertexAttribArray(I),C[I]=0)}function b(T,C,I,H,z,O,k){k===!0?s.vertexAttribIPointer(T,C,I,z,O):s.vertexAttribPointer(T,C,I,H,z,O)}function A(T,C,I,H){if(n.isWebGL2===!1&&(T.isInstancedMesh||H.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const z=H.attributes,O=I.getAttributes(),k=C.defaultAttributeValues;for(const q in O){const K=O[q];if(K.location>=0){let L=z[q];if(L===void 0&&(q==="instanceMatrix"&&T.instanceMatrix&&(L=T.instanceMatrix),q==="instanceColor"&&T.instanceColor&&(L=T.instanceColor)),L!==void 0){const B=L.normalized,G=L.itemSize,$=e.get(L);if($===void 0)continue;const Q=$.buffer,st=$.type,j=$.bytesPerElement,X=n.isWebGL2===!0&&(st===s.INT||st===s.UNSIGNED_INT||L.gpuType===Fh);if(L.isInterleavedBufferAttribute){const ot=L.data,V=ot.stride,xt=L.offset;if(ot.isInstancedInterleavedBuffer){for(let pt=0;pt<K.locationSize;pt++)S(K.location+pt,ot.meshPerAttribute);T.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let pt=0;pt<K.locationSize;pt++)_(K.location+pt);s.bindBuffer(s.ARRAY_BUFFER,Q);for(let pt=0;pt<K.locationSize;pt++)b(K.location+pt,G/K.locationSize,st,B,V*j,(xt+G/K.locationSize*pt)*j,X)}else{if(L.isInstancedBufferAttribute){for(let ot=0;ot<K.locationSize;ot++)S(K.location+ot,L.meshPerAttribute);T.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=L.meshPerAttribute*L.count)}else for(let ot=0;ot<K.locationSize;ot++)_(K.location+ot);s.bindBuffer(s.ARRAY_BUFFER,Q);for(let ot=0;ot<K.locationSize;ot++)b(K.location+ot,G/K.locationSize,st,B,G*j,G/K.locationSize*ot*j,X)}}else if(k!==void 0){const B=k[q];if(B!==void 0)switch(B.length){case 2:s.vertexAttrib2fv(K.location,B);break;case 3:s.vertexAttrib3fv(K.location,B);break;case 4:s.vertexAttrib4fv(K.location,B);break;default:s.vertexAttrib1fv(K.location,B)}}}}w()}function y(){P();for(const T in r){const C=r[T];for(const I in C){const H=C[I];for(const z in H)v(H[z].object),delete H[z];delete C[I]}delete r[T]}}function E(T){if(r[T.id]===void 0)return;const C=r[T.id];for(const I in C){const H=C[I];for(const z in H)v(H[z].object),delete H[z];delete C[I]}delete r[T.id]}function R(T){for(const C in r){const I=r[C];if(I[T.id]===void 0)continue;const H=I[T.id];for(const z in H)v(H[z].object),delete H[z];delete I[T.id]}}function P(){N(),h=!0,c!==l&&(c=l,m(c.object))}function N(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:P,resetDefaultState:N,dispose:y,releaseStatesOfGeometry:E,releaseStatesOfProgram:R,initAttributes:M,enableAttribute:_,disableUnusedAttributes:w}}function um(s,t,e,n){const i=n.isWebGL2;let o;function a(h){o=h}function r(h,f){s.drawArrays(o,h,f),e.update(f,o,1)}function l(h,f,u){if(u===0)return;let m,v;if(i)m=s,v="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[v](o,h,f,u),e.update(f,o,u)}function c(h,f,u){if(u===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<u;v++)this.render(h[v],f[v]);else{m.multiDrawArraysWEBGL(o,h,0,f,0,u);let v=0;for(let g=0;g<u;g++)v+=f[g];e.update(v,o,1)}}this.setMode=a,this.render=r,this.renderInstances=l,this.renderMultiDraw=c}function fm(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(b){if(b==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const l=o(r);l!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",l,"instead."),r=l);const c=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),u=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),d=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),M=u>0,_=a||t.has("OES_texture_float"),S=M&&_,w=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:u,maxTextureSize:m,maxCubemapSize:v,maxAttributes:g,maxVertexUniforms:x,maxVaryings:p,maxFragmentUniforms:d,vertexTextures:M,floatFragmentTextures:_,floatVertexTextures:S,maxSamples:w}}function dm(s){const t=this;let e=null,n=0,i=!1,o=!1;const a=new _i,r=new Zt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const m=f.length!==0||u||n!==0||i;return i=u,n=f.length,m},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,m){const v=f.clippingPlanes,g=f.clipIntersection,x=f.clipShadows,p=s.get(f);if(!i||v===null||v.length===0||o&&!x)o?h(null):c();else{const d=o?0:n,M=d*4;let _=p.clippingState||null;l.value=_,_=h(v,u,M,m);for(let S=0;S!==M;++S)_[S]=e[S];p.clippingState=_,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=d}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,m,v){const g=f!==null?f.length:0;let x=null;if(g!==0){if(x=l.value,v!==!0||x===null){const p=m+g*4,d=u.matrixWorldInverse;r.getNormalMatrix(d),(x===null||x.length<p)&&(x=new Float32Array(p));for(let M=0,_=m;M!==g;++M,_+=4)a.copy(f[M]).applyMatrix4(d,r),a.normal.toArray(x,_),x[_+3]=a.constant}l.value=x,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,x}}function pm(s){let t=new WeakMap;function e(a,r){return r===kr?a.mapping=ys:r===Dr&&(a.mapping=ws),a}function n(a){if(a&&a.isTexture){const r=a.mapping;if(r===kr||r===Dr)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Td(l.height/2);return c.fromEquirectangularTexture(s,a),t.set(a,c),a.addEventListener("dispose",i),e(c.texture,a.mapping)}else return null}}return a}function i(a){const r=a.target;r.removeEventListener("dispose",i);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class fo extends Qh{constructor(t=-1,e=1,n=1,i=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-t,a=n+t,r=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,a=o+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const fs=4,mc=[.125,.215,.35,.446,.526,.582],Si=20,tr=new fo,gc=new Dt;let er=null,nr=0,ir=0;const yi=(1+Math.sqrt(5))/2,ts=1/yi,xc=[new W(1,1,1),new W(-1,1,1),new W(1,1,-1),new W(-1,1,-1),new W(0,yi,ts),new W(0,yi,-ts),new W(ts,0,yi),new W(-ts,0,yi),new W(yi,ts,0),new W(-yi,ts,0)];class vc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){er=this._renderer.getRenderTarget(),nr=this._renderer.getActiveCubeFace(),ir=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,i,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_c(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(er,nr,ir),t.scissorTest=!1,Io(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ys||t.mapping===ws?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),er=this._renderer.getRenderTarget(),nr=this._renderer.getActiveCubeFace(),ir=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:fe,minFilter:fe,generateMipmaps:!1,type:Jn,format:Ve,colorSpace:Qn,depthBuffer:!1},i=Mc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mc(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=mm(o)),this._blurMaterial=gm(o,t,e)}return i}_compileMaterial(t){const e=new ae(this._lodPlanes[0],t);this._renderer.compile(e,tr)}_sceneToCubeUV(t,e,n,i){const r=new Qe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(gc),h.toneMapping=ci,h.autoClear=!1;const m=new $h({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),v=new ae(new uo,m);let g=!1;const x=t.background;x?x.isColor&&(m.color.copy(x),t.background=null,g=!0):(m.color.copy(gc),g=!0);for(let p=0;p<6;p++){const d=p%3;d===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):d===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const M=this._cubeSize;Io(i,d*M,p>2?M:0,M,M),h.setRenderTarget(i),g&&h.render(v,r),h.render(t,r)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===ys||t.mapping===ws;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=yc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_c());const o=i?this._cubemapMaterial:this._equirectMaterial,a=new ae(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const l=this._cubeSize;Io(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,tr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const o=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=xc[(i-1)%xc.length];this._blur(t,i-1,i,o,a)}e.autoClear=n}_blur(t,e,n,i,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",o),this._halfBlur(a,t,n,n,i,"longitudinal",o)}_halfBlur(t,e,n,i,o,a,r){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ae(this._lodPlanes[i],c),u=c.uniforms,m=this._sizeLods[n]-1,v=isFinite(o)?Math.PI/(2*m):2*Math.PI/(2*Si-1),g=o/v,x=isFinite(o)?1+Math.floor(h*g):Si;x>Si&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Si}`);const p=[];let d=0;for(let b=0;b<Si;++b){const A=b/g,y=Math.exp(-A*A/2);p.push(y),b===0?d+=y:b<x&&(d+=2*y)}for(let b=0;b<p.length;b++)p[b]=p[b]/d;u.envMap.value=t.texture,u.samples.value=x,u.weights.value=p,u.latitudinal.value=a==="latitudinal",r&&(u.poleAxis.value=r);const{_lodMax:M}=this;u.dTheta.value=v,u.mipInt.value=M-n;const _=this._sizeLods[i],S=3*_*(i>M-fs?i-M+fs:0),w=4*(this._cubeSize-_);Io(e,S,w,3*_,2*_),l.setRenderTarget(e),l.render(f,tr)}}function mm(s){const t=[],e=[],n=[];let i=s;const o=s-fs+1+mc.length;for(let a=0;a<o;a++){const r=Math.pow(2,i);e.push(r);let l=1/r;a>s-fs?l=mc[a-s+fs-1]:a===0&&(l=0),n.push(l);const c=1/(r-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,v=6,g=3,x=2,p=1,d=new Float32Array(g*v*m),M=new Float32Array(x*v*m),_=new Float32Array(p*v*m);for(let w=0;w<m;w++){const b=w%3*2/3-1,A=w>2?0:-1,y=[b,A,0,b+2/3,A,0,b+2/3,A+1,0,b,A,0,b+2/3,A+1,0,b,A+1,0];d.set(y,g*v*w),M.set(u,x*v*w);const E=[w,w,w,w,w,w];_.set(E,p*v*w)}const S=new Le;S.setAttribute("position",new oe(d,g)),S.setAttribute("uv",new oe(M,x)),S.setAttribute("faceIndex",new oe(_,p)),t.push(S),i>fs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Mc(s,t,e){const n=new hn(s,t,e);return n.texture.mapping=Ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Io(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function gm(s,t,e){const n=new Float32Array(Si),i=new W(0,1,0);return new be({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:sl(),fragmentShader:`

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
		`,blending:li,depthTest:!1,depthWrite:!1})}function _c(){return new be({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:sl(),fragmentShader:`

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
		`,blending:li,depthTest:!1,depthWrite:!1})}function yc(){return new be({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:li,depthTest:!1,depthWrite:!1})}function sl(){return`

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
	`}function xm(s){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const l=r.mapping,c=l===kr||l===Dr,h=l===ys||l===ws;if(c||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let f=t.get(r);return e===null&&(e=new vc(s)),f=c?e.fromEquirectangular(r,f):e.fromCubemap(r,f),t.set(r,f),f.texture}else{if(t.has(r))return t.get(r).texture;{const f=r.image;if(c&&f&&f.height>0||h&&f&&i(f)){e===null&&(e=new vc(s));const u=c?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,u),r.addEventListener("dispose",o),u.texture}else return null}}}return r}function i(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function o(r){const l=r.target;l.removeEventListener("dispose",o);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function vm(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Mm(s,t,e,n){const i={},o=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const v in u.attributes)t.remove(u.attributes[v]);for(const v in u.morphAttributes){const g=u.morphAttributes[v];for(let x=0,p=g.length;x<p;x++)t.remove(g[x])}u.removeEventListener("dispose",a),delete i[u.id];const m=o.get(u);m&&(t.remove(m),o.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function r(f,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const v in u)t.update(u[v],s.ARRAY_BUFFER);const m=f.morphAttributes;for(const v in m){const g=m[v];for(let x=0,p=g.length;x<p;x++)t.update(g[x],s.ARRAY_BUFFER)}}function c(f){const u=[],m=f.index,v=f.attributes.position;let g=0;if(m!==null){const d=m.array;g=m.version;for(let M=0,_=d.length;M<_;M+=3){const S=d[M+0],w=d[M+1],b=d[M+2];u.push(S,w,w,b,b,S)}}else if(v!==void 0){const d=v.array;g=v.version;for(let M=0,_=d.length/3-1;M<_;M+=3){const S=M+0,w=M+1,b=M+2;u.push(S,w,w,b,b,S)}}else return;const x=new(Vh(u)?Zh:Kh)(u,1);x.version=g;const p=o.get(f);p&&t.remove(p),o.set(f,x)}function h(f){const u=o.get(f);if(u){const m=f.index;m!==null&&u.version<m.version&&c(f)}else c(f);return o.get(f)}return{get:r,update:l,getWireframeAttribute:h}}function _m(s,t,e,n){const i=n.isWebGL2;let o;function a(m){o=m}let r,l;function c(m){r=m.type,l=m.bytesPerElement}function h(m,v){s.drawElements(o,v,r,m*l),e.update(v,o,1)}function f(m,v,g){if(g===0)return;let x,p;if(i)x=s,p="drawElementsInstanced";else if(x=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",x===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}x[p](o,v,r,m*l,g),e.update(v,o,g)}function u(m,v,g){if(g===0)return;const x=t.get("WEBGL_multi_draw");if(x===null)for(let p=0;p<g;p++)this.render(m[p]/l,v[p]);else{x.multiDrawElementsWEBGL(o,v,0,r,m,0,g);let p=0;for(let d=0;d<g;d++)p+=v[d];e.update(p,o,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=f,this.renderMultiDraw=u}function ym(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,a,r){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=r*(o/3);break;case s.LINES:e.lines+=r*(o/2);break;case s.LINE_STRIP:e.lines+=r*(o-1);break;case s.LINE_LOOP:e.lines+=r*o;break;case s.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function wm(s,t){return s[0]-t[0]}function bm(s,t){return Math.abs(t[1])-Math.abs(s[1])}function Sm(s,t,e){const n={},i=new Float32Array(8),o=new WeakMap,a=new pe,r=[];for(let c=0;c<8;c++)r[c]=[c,0];function l(c,h,f){const u=c.morphTargetInfluences;if(t.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=m!==void 0?m.length:0;let g=o.get(h);if(g===void 0||g.count!==v){let T=function(){P.dispose(),o.delete(h),h.removeEventListener("dispose",T)};g!==void 0&&g.texture.dispose();const d=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,_=h.morphAttributes.color!==void 0,S=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],b=h.morphAttributes.color||[];let A=0;d===!0&&(A=1),M===!0&&(A=2),_===!0&&(A=3);let y=h.attributes.position.count*A,E=1;y>t.maxTextureSize&&(E=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);const R=new Float32Array(y*E*4*v),P=new jh(R,y,E,v);P.type=An,P.needsUpdate=!0;const N=A*4;for(let C=0;C<v;C++){const I=S[C],H=w[C],z=b[C],O=y*E*4*C;for(let k=0;k<I.count;k++){const q=k*N;d===!0&&(a.fromBufferAttribute(I,k),R[O+q+0]=a.x,R[O+q+1]=a.y,R[O+q+2]=a.z,R[O+q+3]=0),M===!0&&(a.fromBufferAttribute(H,k),R[O+q+4]=a.x,R[O+q+5]=a.y,R[O+q+6]=a.z,R[O+q+7]=0),_===!0&&(a.fromBufferAttribute(z,k),R[O+q+8]=a.x,R[O+q+9]=a.y,R[O+q+10]=a.z,R[O+q+11]=z.itemSize===4?a.w:1)}}g={count:v,texture:P,size:new Ut(y,E)},o.set(h,g),h.addEventListener("dispose",T)}let x=0;for(let d=0;d<u.length;d++)x+=u[d];const p=h.morphTargetsRelative?1:1-x;f.getUniforms().setValue(s,"morphTargetBaseInfluence",p),f.getUniforms().setValue(s,"morphTargetInfluences",u),f.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),f.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const m=u===void 0?0:u.length;let v=n[h.id];if(v===void 0||v.length!==m){v=[];for(let M=0;M<m;M++)v[M]=[M,0];n[h.id]=v}for(let M=0;M<m;M++){const _=v[M];_[0]=M,_[1]=u[M]}v.sort(bm);for(let M=0;M<8;M++)M<m&&v[M][1]?(r[M][0]=v[M][0],r[M][1]=v[M][1]):(r[M][0]=Number.MAX_SAFE_INTEGER,r[M][1]=0);r.sort(wm);const g=h.morphAttributes.position,x=h.morphAttributes.normal;let p=0;for(let M=0;M<8;M++){const _=r[M],S=_[0],w=_[1];S!==Number.MAX_SAFE_INTEGER&&w?(g&&h.getAttribute("morphTarget"+M)!==g[S]&&h.setAttribute("morphTarget"+M,g[S]),x&&h.getAttribute("morphNormal"+M)!==x[S]&&h.setAttribute("morphNormal"+M,x[S]),i[M]=w,p+=w):(g&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),x&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}const d=h.morphTargetsRelative?1:1-p;f.getUniforms().setValue(s,"morphTargetBaseInfluence",d),f.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function Em(s,t,e,n){let i=new WeakMap;function o(l){const c=n.render.frame,h=l.geometry,f=t.get(l,h);if(i.get(f)!==c&&(t.update(f),i.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;i.get(u)!==c&&(u.update(),i.set(u,c))}return f}function a(){i=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:o,dispose:a}}class ol extends nn{constructor(t,e,n,i,o,a,r,l,c,h){if(h=h!==void 0?h:Ti,h!==Ti&&h!==bs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ti&&(n=Xn),n===void 0&&h===bs&&(n=Ei),super(null,i,o,a,r,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Me,this.minFilter=l!==void 0?l:Me,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const nu=new nn,iu=new ol(1,1);iu.compareFunction=Wh;const su=new jh,ou=new Ur,au=new tu,wc=[],bc=[],Sc=new Float32Array(16),Ec=new Float32Array(9),Tc=new Float32Array(4);function Ps(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let o=wc[i];if(o===void 0&&(o=new Float32Array(i),wc[i]=o),t!==0){n.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,s[a].toArray(o,r)}return o}function ke(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function De(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function ya(s,t){let e=bc[t];e===void 0&&(e=new Int32Array(t),bc[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Tm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Am(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2fv(this.addr,t),De(e,t)}}function Cm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;s.uniform3fv(this.addr,t),De(e,t)}}function Rm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4fv(this.addr,t),De(e,t)}}function Pm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),De(e,t)}else{if(ke(e,n))return;Tc.set(n),s.uniformMatrix2fv(this.addr,!1,Tc),De(e,n)}}function Lm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),De(e,t)}else{if(ke(e,n))return;Ec.set(n),s.uniformMatrix3fv(this.addr,!1,Ec),De(e,n)}}function km(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),De(e,t)}else{if(ke(e,n))return;Sc.set(n),s.uniformMatrix4fv(this.addr,!1,Sc),De(e,n)}}function Dm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function zm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2iv(this.addr,t),De(e,t)}}function Fm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3iv(this.addr,t),De(e,t)}}function Im(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4iv(this.addr,t),De(e,t)}}function Um(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Nm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;s.uniform2uiv(this.addr,t),De(e,t)}}function Om(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;s.uniform3uiv(this.addr,t),De(e,t)}}function Bm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;s.uniform4uiv(this.addr,t),De(e,t)}}function Hm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const o=this.type===s.SAMPLER_2D_SHADOW?iu:nu;e.setTexture2D(t||o,i)}function Gm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||ou,i)}function Wm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||au,i)}function Vm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||su,i)}function qm(s){switch(s){case 5126:return Tm;case 35664:return Am;case 35665:return Cm;case 35666:return Rm;case 35674:return Pm;case 35675:return Lm;case 35676:return km;case 5124:case 35670:return Dm;case 35667:case 35671:return zm;case 35668:case 35672:return Fm;case 35669:case 35673:return Im;case 5125:return Um;case 36294:return Nm;case 36295:return Om;case 36296:return Bm;case 35678:case 36198:case 36298:case 36306:case 35682:return Hm;case 35679:case 36299:case 36307:return Gm;case 35680:case 36300:case 36308:case 36293:return Wm;case 36289:case 36303:case 36311:case 36292:return Vm}}function Xm(s,t){s.uniform1fv(this.addr,t)}function jm(s,t){const e=Ps(t,this.size,2);s.uniform2fv(this.addr,e)}function Ym(s,t){const e=Ps(t,this.size,3);s.uniform3fv(this.addr,e)}function $m(s,t){const e=Ps(t,this.size,4);s.uniform4fv(this.addr,e)}function Km(s,t){const e=Ps(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Zm(s,t){const e=Ps(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Jm(s,t){const e=Ps(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Qm(s,t){s.uniform1iv(this.addr,t)}function tg(s,t){s.uniform2iv(this.addr,t)}function eg(s,t){s.uniform3iv(this.addr,t)}function ng(s,t){s.uniform4iv(this.addr,t)}function ig(s,t){s.uniform1uiv(this.addr,t)}function sg(s,t){s.uniform2uiv(this.addr,t)}function og(s,t){s.uniform3uiv(this.addr,t)}function ag(s,t){s.uniform4uiv(this.addr,t)}function rg(s,t,e){const n=this.cache,i=t.length,o=ya(e,i);ke(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||nu,o[a])}function lg(s,t,e){const n=this.cache,i=t.length,o=ya(e,i);ke(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||ou,o[a])}function cg(s,t,e){const n=this.cache,i=t.length,o=ya(e,i);ke(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||au,o[a])}function hg(s,t,e){const n=this.cache,i=t.length,o=ya(e,i);ke(n,o)||(s.uniform1iv(this.addr,o),De(n,o));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||su,o[a])}function ug(s){switch(s){case 5126:return Xm;case 35664:return jm;case 35665:return Ym;case 35666:return $m;case 35674:return Km;case 35675:return Zm;case 35676:return Jm;case 5124:case 35670:return Qm;case 35667:case 35671:return tg;case 35668:case 35672:return eg;case 35669:case 35673:return ng;case 5125:return ig;case 36294:return sg;case 36295:return og;case 36296:return ag;case 35678:case 36198:case 36298:case 36306:case 35682:return rg;case 35679:case 36299:case 36307:return lg;case 35680:case 36300:case 36308:case 36293:return cg;case 36289:case 36303:case 36311:case 36292:return hg}}class fg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=qm(e.type)}}class dg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ug(e.type)}}class pg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let o=0,a=i.length;o!==a;++o){const r=i[o];r.setValue(t,e[r.id],n)}}}const sr=/(\w+)(\])?(\[|\.)?/g;function Ac(s,t){s.seq.push(t),s.map[t.id]=t}function mg(s,t,e){const n=s.name,i=n.length;for(sr.lastIndex=0;;){const o=sr.exec(n),a=sr.lastIndex;let r=o[1];const l=o[2]==="]",c=o[3];if(l&&(r=r|0),c===void 0||c==="["&&a+2===i){Ac(e,c===void 0?new fg(r,s,t):new dg(r,s,t));break}else{let f=e.map[r];f===void 0&&(f=new pg(r),Ac(e,f)),e=f}}}class ea{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=t.getActiveUniform(e,i),a=t.getUniformLocation(e,o.name);mg(o,a,this)}}setValue(t,e,n,i){const o=this.map[e];o!==void 0&&o.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let o=0,a=e.length;o!==a;++o){const r=e[o],l=n[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,o=t.length;i!==o;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Cc(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const gg=37297;let xg=0;function vg(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=i;a<o;a++){const r=a+1;n.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return n.join(`
`)}function Mg(s){const t=ce.getPrimaries(ce.workingColorSpace),e=ce.getPrimaries(s);let n;switch(t===e?n="":t===ua&&e===ha?n="LinearDisplayP3ToLinearSRGB":t===ha&&e===ua&&(n="LinearSRGBToLinearDisplayP3"),s){case Qn:case _a:return[n,"LinearTransferOETF"];case Ue:case Qr:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Rc(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const o=/ERROR: 0:(\d+)/.exec(i);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+i+`

`+vg(s.getShaderSource(t),a)}else return i}function _g(s,t){const e=Mg(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function yg(s,t){let e;switch(t){case gf:e="Linear";break;case xf:e="Reinhard";break;case vf:e="OptimizedCineon";break;case Mf:e="ACESFilmic";break;case yf:e="AgX";break;case _f:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function wg(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ds).join(`
`)}function bg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ds).join(`
`)}function Sg(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Eg(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=s.getActiveAttrib(t,i),a=o.name;let r=1;o.type===s.FLOAT_MAT2&&(r=2),o.type===s.FLOAT_MAT3&&(r=3),o.type===s.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:s.getAttribLocation(t,a),locationSize:r}}return e}function ds(s){return s!==""}function Pc(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Lc(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Tg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Nr(s){return s.replace(Tg,Cg)}const Ag=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Cg(s,t){let e=Yt[t];if(e===void 0){const n=Ag.get(t);if(n!==void 0)e=Yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Nr(e)}const Rg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function kc(s){return s.replace(Rg,Pg)}function Pg(s,t,e,n){let i="";for(let o=parseInt(t);o<parseInt(e);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function Dc(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Lg(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===kh?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Wu?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Hn&&(t="SHADOWMAP_TYPE_VSM"),t}function kg(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ys:case ws:t="ENVMAP_TYPE_CUBE";break;case Ma:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Dg(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ws:t="ENVMAP_MODE_REFRACTION";break}return t}function zg(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Dh:t="ENVMAP_BLENDING_MULTIPLY";break;case pf:t="ENVMAP_BLENDING_MIX";break;case mf:t="ENVMAP_BLENDING_ADD";break}return t}function Fg(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Ig(s,t,e,n){const i=s.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const l=Lg(e),c=kg(e),h=Dg(e),f=zg(e),u=Fg(e),m=e.isWebGL2?"":wg(e),v=bg(e),g=Sg(o),x=i.createProgram();let p,d,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ds).join(`
`),p.length>0&&(p+=`
`),d=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ds).join(`
`),d.length>0&&(d+=`
`)):(p=[Dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ds).join(`
`),d=[m,Dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ci?"#define TONE_MAPPING":"",e.toneMapping!==ci?Yt.tonemapping_pars_fragment:"",e.toneMapping!==ci?yg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,_g("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ds).join(`
`)),a=Nr(a),a=Pc(a,e),a=Lc(a,e),r=Nr(r),r=Pc(r,e),r=Lc(r,e),a=kc(a),r=kc(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Kl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Kl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const _=M+p+a,S=M+d+r,w=Cc(i,i.VERTEX_SHADER,_),b=Cc(i,i.FRAGMENT_SHADER,S);i.attachShader(x,w),i.attachShader(x,b),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function A(P){if(s.debug.checkShaderErrors){const N=i.getProgramInfoLog(x).trim(),T=i.getShaderInfoLog(w).trim(),C=i.getShaderInfoLog(b).trim();let I=!0,H=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(I=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,w,b);else{const z=Rc(i,w,"vertex"),O=Rc(i,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Program Info Log: `+N+`
`+z+`
`+O)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(T===""||C==="")&&(H=!1);H&&(P.diagnostics={runnable:I,programLog:N,vertexShader:{log:T,prefix:p},fragmentShader:{log:C,prefix:d}})}i.deleteShader(w),i.deleteShader(b),y=new ea(i,x),E=Eg(i,x)}let y;this.getUniforms=function(){return y===void 0&&A(this),y};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(x,gg)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=xg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=b,this}let Ug=0;class Ng{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),o=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Og(t),e.set(t,n)),n}}class Og{constructor(t){this.id=Ug++,this.code=t,this.usedTimes=0}}function Bg(s,t,e,n,i,o,a){const r=new nl,l=new Ng,c=[],h=i.isWebGL2,f=i.logarithmicDepthBuffer,u=i.vertexTextures;let m=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return y===0?"uv":`uv${y}`}function x(y,E,R,P,N){const T=P.fog,C=N.geometry,I=y.isMeshStandardMaterial?P.environment:null,H=(y.isMeshStandardMaterial?e:t).get(y.envMap||I),z=H&&H.mapping===Ma?H.image.height:null,O=v[y.type];y.precision!==null&&(m=i.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const k=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,q=k!==void 0?k.length:0;let K=0;C.morphAttributes.position!==void 0&&(K=1),C.morphAttributes.normal!==void 0&&(K=2),C.morphAttributes.color!==void 0&&(K=3);let L,B,G,$;if(O){const me=Ln[O];L=me.vertexShader,B=me.fragmentShader}else L=y.vertexShader,B=y.fragmentShader,l.update(y),G=l.getVertexShaderID(y),$=l.getFragmentShaderID(y);const Q=s.getRenderTarget(),st=N.isInstancedMesh===!0,j=N.isBatchedMesh===!0,X=!!y.map,ot=!!y.matcap,V=!!H,xt=!!y.aoMap,pt=!!y.lightMap,vt=!!y.bumpMap,mt=!!y.normalMap,Nt=!!y.displacementMap,rt=!!y.emissiveMap,U=!!y.metalnessMap,D=!!y.roughnessMap,Z=y.anisotropy>0,ct=y.clearcoat>0,lt=y.iridescence>0,dt=y.sheen>0,At=y.transmission>0,yt=Z&&!!y.anisotropyMap,gt=ct&&!!y.clearcoatMap,Ct=ct&&!!y.clearcoatNormalMap,zt=ct&&!!y.clearcoatRoughnessMap,ht=lt&&!!y.iridescenceMap,ee=lt&&!!y.iridescenceThicknessMap,Wt=dt&&!!y.sheenColorMap,Ot=dt&&!!y.sheenRoughnessMap,Pt=!!y.specularMap,ft=!!y.specularColorMap,bt=!!y.specularIntensityMap,Jt=At&&!!y.transmissionMap,re=At&&!!y.thicknessMap,Xt=!!y.gradientMap,Mt=!!y.alphaMap,Y=y.alphaTest>0,St=!!y.alphaHash,Et=!!y.extensions,Ft=!!C.attributes.uv1,Lt=!!C.attributes.uv2,Qt=!!C.attributes.uv3;let se=ci;return y.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(se=s.toneMapping),{isWebGL2:h,shaderID:O,shaderType:y.type,shaderName:y.name,vertexShader:L,fragmentShader:B,defines:y.defines,customVertexShaderID:G,customFragmentShaderID:$,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:j,instancing:st,instancingColor:st&&N.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:Q===null?s.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Qn,map:X,matcap:ot,envMap:V,envMapMode:V&&H.mapping,envMapCubeUVHeight:z,aoMap:xt,lightMap:pt,bumpMap:vt,normalMap:mt,displacementMap:u&&Nt,emissiveMap:rt,normalMapObjectSpace:mt&&y.normalMapType===Df,normalMapTangentSpace:mt&&y.normalMapType===kf,metalnessMap:U,roughnessMap:D,anisotropy:Z,anisotropyMap:yt,clearcoat:ct,clearcoatMap:gt,clearcoatNormalMap:Ct,clearcoatRoughnessMap:zt,iridescence:lt,iridescenceMap:ht,iridescenceThicknessMap:ee,sheen:dt,sheenColorMap:Wt,sheenRoughnessMap:Ot,specularMap:Pt,specularColorMap:ft,specularIntensityMap:bt,transmission:At,transmissionMap:Jt,thicknessMap:re,gradientMap:Xt,opaque:y.transparent===!1&&y.blending===gs,alphaMap:Mt,alphaTest:Y,alphaHash:St,combine:y.combine,mapUv:X&&g(y.map.channel),aoMapUv:xt&&g(y.aoMap.channel),lightMapUv:pt&&g(y.lightMap.channel),bumpMapUv:vt&&g(y.bumpMap.channel),normalMapUv:mt&&g(y.normalMap.channel),displacementMapUv:Nt&&g(y.displacementMap.channel),emissiveMapUv:rt&&g(y.emissiveMap.channel),metalnessMapUv:U&&g(y.metalnessMap.channel),roughnessMapUv:D&&g(y.roughnessMap.channel),anisotropyMapUv:yt&&g(y.anisotropyMap.channel),clearcoatMapUv:gt&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:Ct&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:zt&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:ht&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:Ot&&g(y.sheenRoughnessMap.channel),specularMapUv:Pt&&g(y.specularMap.channel),specularColorMapUv:ft&&g(y.specularColorMap.channel),specularIntensityMapUv:bt&&g(y.specularIntensityMap.channel),transmissionMapUv:Jt&&g(y.transmissionMap.channel),thicknessMapUv:re&&g(y.thicknessMap.channel),alphaMapUv:Mt&&g(y.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(mt||Z),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,vertexUv1s:Ft,vertexUv2s:Lt,vertexUv3s:Qt,pointsUvs:N.isPoints===!0&&!!C.attributes.uv&&(X||Mt),fog:!!T,useFog:y.fog===!0,fogExp2:T&&T.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:N.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:q,morphTextureStride:K,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:se,useLegacyLights:s._useLegacyLights,decodeVideoTexture:X&&y.map.isVideoTexture===!0&&ce.getTransfer(y.map.colorSpace)===ge,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===tn,flipSided:y.side===$e,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionDerivatives:Et&&y.extensions.derivatives===!0,extensionFragDepth:Et&&y.extensions.fragDepth===!0,extensionDrawBuffers:Et&&y.extensions.drawBuffers===!0,extensionShaderTextureLOD:Et&&y.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Et&&y.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()}}function p(y){const E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(const R in y.defines)E.push(R),E.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(d(E,y),M(E,y),E.push(s.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function d(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function M(y,E){r.disableAll(),E.isWebGL2&&r.enable(0),E.supportsVertexTextures&&r.enable(1),E.instancing&&r.enable(2),E.instancingColor&&r.enable(3),E.matcap&&r.enable(4),E.envMap&&r.enable(5),E.normalMapObjectSpace&&r.enable(6),E.normalMapTangentSpace&&r.enable(7),E.clearcoat&&r.enable(8),E.iridescence&&r.enable(9),E.alphaTest&&r.enable(10),E.vertexColors&&r.enable(11),E.vertexAlphas&&r.enable(12),E.vertexUv1s&&r.enable(13),E.vertexUv2s&&r.enable(14),E.vertexUv3s&&r.enable(15),E.vertexTangents&&r.enable(16),E.anisotropy&&r.enable(17),E.alphaHash&&r.enable(18),E.batching&&r.enable(19),y.push(r.mask),r.disableAll(),E.fog&&r.enable(0),E.useFog&&r.enable(1),E.flatShading&&r.enable(2),E.logarithmicDepthBuffer&&r.enable(3),E.skinning&&r.enable(4),E.morphTargets&&r.enable(5),E.morphNormals&&r.enable(6),E.morphColors&&r.enable(7),E.premultipliedAlpha&&r.enable(8),E.shadowMapEnabled&&r.enable(9),E.useLegacyLights&&r.enable(10),E.doubleSided&&r.enable(11),E.flipSided&&r.enable(12),E.useDepthPacking&&r.enable(13),E.dithering&&r.enable(14),E.transmission&&r.enable(15),E.sheen&&r.enable(16),E.opaque&&r.enable(17),E.pointsUvs&&r.enable(18),E.decodeVideoTexture&&r.enable(19),y.push(r.mask)}function _(y){const E=v[y.type];let R;if(E){const P=Ln[E];R=wd.clone(P.uniforms)}else R=y.uniforms;return R}function S(y,E){let R;for(let P=0,N=c.length;P<N;P++){const T=c[P];if(T.cacheKey===E){R=T,++R.usedTimes;break}}return R===void 0&&(R=new Ig(s,E,y,o),c.push(R)),R}function w(y){if(--y.usedTimes===0){const E=c.indexOf(y);c[E]=c[c.length-1],c.pop(),y.destroy()}}function b(y){l.remove(y)}function A(){l.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:_,acquireProgram:S,releaseProgram:w,releaseShaderCache:b,programs:c,dispose:A}}function Hg(){let s=new WeakMap;function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function e(o){s.delete(o)}function n(o,a,r){s.get(o)[a]=r}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Gg(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function zc(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Fc(){const s=[];let t=0;const e=[],n=[],i=[];function o(){t=0,e.length=0,n.length=0,i.length=0}function a(f,u,m,v,g,x){let p=s[t];return p===void 0?(p={id:f.id,object:f,geometry:u,material:m,groupOrder:v,renderOrder:f.renderOrder,z:g,group:x},s[t]=p):(p.id=f.id,p.object=f,p.geometry=u,p.material=m,p.groupOrder=v,p.renderOrder=f.renderOrder,p.z=g,p.group=x),t++,p}function r(f,u,m,v,g,x){const p=a(f,u,m,v,g,x);m.transmission>0?n.push(p):m.transparent===!0?i.push(p):e.push(p)}function l(f,u,m,v,g,x){const p=a(f,u,m,v,g,x);m.transmission>0?n.unshift(p):m.transparent===!0?i.unshift(p):e.unshift(p)}function c(f,u){e.length>1&&e.sort(f||Gg),n.length>1&&n.sort(u||zc),i.length>1&&i.sort(u||zc)}function h(){for(let f=t,u=s.length;f<u;f++){const m=s[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:o,push:r,unshift:l,finish:h,sort:c}}function Wg(){let s=new WeakMap;function t(n,i){const o=s.get(n);let a;return o===void 0?(a=new Fc,s.set(n,[a])):i>=o.length?(a=new Fc,o.push(a)):a=o[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function Vg(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new Dt};break;case"SpotLight":e={position:new W,direction:new W,color:new Dt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new Dt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new Dt,groundColor:new Dt};break;case"RectAreaLight":e={color:new Dt,position:new W,halfWidth:new W,halfHeight:new W};break}return s[t.id]=e,e}}}function qg(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ut};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ut};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Xg=0;function jg(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Yg(s,t){const e=new Vg,n=qg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new W);const o=new W,a=new te,r=new te;function l(h,f){let u=0,m=0,v=0;for(let P=0;P<9;P++)i.probe[P].set(0,0,0);let g=0,x=0,p=0,d=0,M=0,_=0,S=0,w=0,b=0,A=0,y=0;h.sort(jg);const E=f===!0?Math.PI:1;for(let P=0,N=h.length;P<N;P++){const T=h[P],C=T.color,I=T.intensity,H=T.distance,z=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)u+=C.r*I*E,m+=C.g*I*E,v+=C.b*I*E;else if(T.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(T.sh.coefficients[O],I);y++}else if(T.isDirectionalLight){const O=e.get(T);if(O.color.copy(T.color).multiplyScalar(T.intensity*E),T.castShadow){const k=T.shadow,q=n.get(T);q.shadowBias=k.bias,q.shadowNormalBias=k.normalBias,q.shadowRadius=k.radius,q.shadowMapSize=k.mapSize,i.directionalShadow[g]=q,i.directionalShadowMap[g]=z,i.directionalShadowMatrix[g]=T.shadow.matrix,_++}i.directional[g]=O,g++}else if(T.isSpotLight){const O=e.get(T);O.position.setFromMatrixPosition(T.matrixWorld),O.color.copy(C).multiplyScalar(I*E),O.distance=H,O.coneCos=Math.cos(T.angle),O.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),O.decay=T.decay,i.spot[p]=O;const k=T.shadow;if(T.map&&(i.spotLightMap[b]=T.map,b++,k.updateMatrices(T),T.castShadow&&A++),i.spotLightMatrix[p]=k.matrix,T.castShadow){const q=n.get(T);q.shadowBias=k.bias,q.shadowNormalBias=k.normalBias,q.shadowRadius=k.radius,q.shadowMapSize=k.mapSize,i.spotShadow[p]=q,i.spotShadowMap[p]=z,w++}p++}else if(T.isRectAreaLight){const O=e.get(T);O.color.copy(C).multiplyScalar(I),O.halfWidth.set(T.width*.5,0,0),O.halfHeight.set(0,T.height*.5,0),i.rectArea[d]=O,d++}else if(T.isPointLight){const O=e.get(T);if(O.color.copy(T.color).multiplyScalar(T.intensity*E),O.distance=T.distance,O.decay=T.decay,T.castShadow){const k=T.shadow,q=n.get(T);q.shadowBias=k.bias,q.shadowNormalBias=k.normalBias,q.shadowRadius=k.radius,q.shadowMapSize=k.mapSize,q.shadowCameraNear=k.camera.near,q.shadowCameraFar=k.camera.far,i.pointShadow[x]=q,i.pointShadowMap[x]=z,i.pointShadowMatrix[x]=T.shadow.matrix,S++}i.point[x]=O,x++}else if(T.isHemisphereLight){const O=e.get(T);O.skyColor.copy(T.color).multiplyScalar(I*E),O.groundColor.copy(T.groundColor).multiplyScalar(I*E),i.hemi[M]=O,M++}}d>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=wt.LTC_FLOAT_1,i.rectAreaLTC2=wt.LTC_FLOAT_2):(i.rectAreaLTC1=wt.LTC_HALF_1,i.rectAreaLTC2=wt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=wt.LTC_FLOAT_1,i.rectAreaLTC2=wt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=wt.LTC_HALF_1,i.rectAreaLTC2=wt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=u,i.ambient[1]=m,i.ambient[2]=v;const R=i.hash;(R.directionalLength!==g||R.pointLength!==x||R.spotLength!==p||R.rectAreaLength!==d||R.hemiLength!==M||R.numDirectionalShadows!==_||R.numPointShadows!==S||R.numSpotShadows!==w||R.numSpotMaps!==b||R.numLightProbes!==y)&&(i.directional.length=g,i.spot.length=p,i.rectArea.length=d,i.point.length=x,i.hemi.length=M,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=w+b-A,i.spotLightMap.length=b,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=y,R.directionalLength=g,R.pointLength=x,R.spotLength=p,R.rectAreaLength=d,R.hemiLength=M,R.numDirectionalShadows=_,R.numPointShadows=S,R.numSpotShadows=w,R.numSpotMaps=b,R.numLightProbes=y,i.version=Xg++)}function c(h,f){let u=0,m=0,v=0,g=0,x=0;const p=f.matrixWorldInverse;for(let d=0,M=h.length;d<M;d++){const _=h[d];if(_.isDirectionalLight){const S=i.directional[u];S.direction.setFromMatrixPosition(_.matrixWorld),o.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(o),S.direction.transformDirection(p),u++}else if(_.isSpotLight){const S=i.spot[v];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(_.matrixWorld),o.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(o),S.direction.transformDirection(p),v++}else if(_.isRectAreaLight){const S=i.rectArea[g];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(p),r.identity(),a.copy(_.matrixWorld),a.premultiply(p),r.extractRotation(a),S.halfWidth.set(_.width*.5,0,0),S.halfHeight.set(0,_.height*.5,0),S.halfWidth.applyMatrix4(r),S.halfHeight.applyMatrix4(r),g++}else if(_.isPointLight){const S=i.point[m];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(p),m++}else if(_.isHemisphereLight){const S=i.hemi[x];S.direction.setFromMatrixPosition(_.matrixWorld),S.direction.transformDirection(p),x++}}}return{setup:l,setupView:c,state:i}}function Ic(s,t){const e=new Yg(s,t),n=[],i=[];function o(){n.length=0,i.length=0}function a(f){n.push(f)}function r(f){i.push(f)}function l(f){e.setup(n,f)}function c(f){e.setupView(n,f)}return{init:o,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:r}}function $g(s,t){let e=new WeakMap;function n(o,a=0){const r=e.get(o);let l;return r===void 0?(l=new Ic(s,t),e.set(o,[l])):a>=r.length?(l=new Ic(s,t),r.push(l)):l=r[a],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class Kg extends ho{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Zg extends ho{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Jg=`void main() {
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
}`;function t1(s,t,e){let n=new Rs;const i=new Ut,o=new Ut,a=new pe,r=new Kg({depthPacking:Lf}),l=new Zg,c={},h=e.maxTextureSize,f={[Zn]:$e,[$e]:Zn,[tn]:tn},u=new be({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ut},radius:{value:4}},vertexShader:Jg,fragmentShader:Qg}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const v=new Le;v.setAttribute("position",new oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ae(v,u),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kh;let p=this.type;this.render=function(w,b,A){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||w.length===0)return;const y=s.getRenderTarget(),E=s.getActiveCubeFace(),R=s.getActiveMipmapLevel(),P=s.state;P.setBlending(li),P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const N=p!==Hn&&this.type===Hn,T=p===Hn&&this.type!==Hn;for(let C=0,I=w.length;C<I;C++){const H=w[C],z=H.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;i.copy(z.mapSize);const O=z.getFrameExtents();if(i.multiply(O),o.copy(z.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(o.x=Math.floor(h/O.x),i.x=o.x*O.x,z.mapSize.x=o.x),i.y>h&&(o.y=Math.floor(h/O.y),i.y=o.y*O.y,z.mapSize.y=o.y)),z.map===null||N===!0||T===!0){const q=this.type!==Hn?{minFilter:Me,magFilter:Me}:{};z.map!==null&&z.map.dispose(),z.map=new hn(i.x,i.y,q),z.map.texture.name=H.name+".shadowMap",z.camera.updateProjectionMatrix()}s.setRenderTarget(z.map),s.clear();const k=z.getViewportCount();for(let q=0;q<k;q++){const K=z.getViewport(q);a.set(o.x*K.x,o.y*K.y,o.x*K.z,o.y*K.w),P.viewport(a),z.updateMatrices(H,q),n=z.getFrustum(),_(b,A,z.camera,H,this.type)}z.isPointLightShadow!==!0&&this.type===Hn&&d(z,A),z.needsUpdate=!1}p=this.type,x.needsUpdate=!1,s.setRenderTarget(y,E,R)};function d(w,b){const A=t.update(g);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new hn(i.x,i.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(b,null,A,u,g,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(b,null,A,m,g,null)}function M(w,b,A,y){let E=null;const R=A.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(R!==void 0)E=R;else if(E=A.isPointLight===!0?l:r,s.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const P=E.uuid,N=b.uuid;let T=c[P];T===void 0&&(T={},c[P]=T);let C=T[N];C===void 0&&(C=E.clone(),T[N]=C,b.addEventListener("dispose",S)),E=C}if(E.visible=b.visible,E.wireframe=b.wireframe,y===Hn?E.side=b.shadowSide!==null?b.shadowSide:b.side:E.side=b.shadowSide!==null?b.shadowSide:f[b.side],E.alphaMap=b.alphaMap,E.alphaTest=b.alphaTest,E.map=b.map,E.clipShadows=b.clipShadows,E.clippingPlanes=b.clippingPlanes,E.clipIntersection=b.clipIntersection,E.displacementMap=b.displacementMap,E.displacementScale=b.displacementScale,E.displacementBias=b.displacementBias,E.wireframeLinewidth=b.wireframeLinewidth,E.linewidth=b.linewidth,A.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const P=s.properties.get(E);P.light=A}return E}function _(w,b,A,y,E){if(w.visible===!1)return;if(w.layers.test(b.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===Hn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,w.matrixWorld);const N=t.update(w),T=w.material;if(Array.isArray(T)){const C=N.groups;for(let I=0,H=C.length;I<H;I++){const z=C[I],O=T[z.materialIndex];if(O&&O.visible){const k=M(w,O,y,E);w.onBeforeShadow(s,w,b,A,N,k,z),s.renderBufferDirect(A,null,N,k,w,z),w.onAfterShadow(s,w,b,A,N,k,z)}}}else if(T.visible){const C=M(w,T,y,E);w.onBeforeShadow(s,w,b,A,N,C,null),s.renderBufferDirect(A,null,N,C,w,null),w.onAfterShadow(s,w,b,A,N,C,null)}}const P=w.children;for(let N=0,T=P.length;N<T;N++)_(P[N],b,A,y,E)}function S(w){w.target.removeEventListener("dispose",S);for(const A in c){const y=c[A],E=w.target.uuid;E in y&&(y[E].dispose(),delete y[E])}}}function e1(s,t,e){const n=e.isWebGL2;function i(){let Y=!1;const St=new pe;let Et=null;const Ft=new pe(0,0,0,0);return{setMask:function(Lt){Et!==Lt&&!Y&&(s.colorMask(Lt,Lt,Lt,Lt),Et=Lt)},setLocked:function(Lt){Y=Lt},setClear:function(Lt,Qt,se,Ae,me){me===!0&&(Lt*=Ae,Qt*=Ae,se*=Ae),St.set(Lt,Qt,se,Ae),Ft.equals(St)===!1&&(s.clearColor(Lt,Qt,se,Ae),Ft.copy(St))},reset:function(){Y=!1,Et=null,Ft.set(-1,0,0,0)}}}function o(){let Y=!1,St=null,Et=null,Ft=null;return{setTest:function(Lt){Lt?j(s.DEPTH_TEST):X(s.DEPTH_TEST)},setMask:function(Lt){St!==Lt&&!Y&&(s.depthMask(Lt),St=Lt)},setFunc:function(Lt){if(Et!==Lt){switch(Lt){case rf:s.depthFunc(s.NEVER);break;case lf:s.depthFunc(s.ALWAYS);break;case cf:s.depthFunc(s.LESS);break;case la:s.depthFunc(s.LEQUAL);break;case hf:s.depthFunc(s.EQUAL);break;case uf:s.depthFunc(s.GEQUAL);break;case ff:s.depthFunc(s.GREATER);break;case df:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Et=Lt}},setLocked:function(Lt){Y=Lt},setClear:function(Lt){Ft!==Lt&&(s.clearDepth(Lt),Ft=Lt)},reset:function(){Y=!1,St=null,Et=null,Ft=null}}}function a(){let Y=!1,St=null,Et=null,Ft=null,Lt=null,Qt=null,se=null,Ae=null,me=null;return{setTest:function(ne){Y||(ne?j(s.STENCIL_TEST):X(s.STENCIL_TEST))},setMask:function(ne){St!==ne&&!Y&&(s.stencilMask(ne),St=ne)},setFunc:function(ne,Pe,Ne){(Et!==ne||Ft!==Pe||Lt!==Ne)&&(s.stencilFunc(ne,Pe,Ne),Et=ne,Ft=Pe,Lt=Ne)},setOp:function(ne,Pe,Ne){(Qt!==ne||se!==Pe||Ae!==Ne)&&(s.stencilOp(ne,Pe,Ne),Qt=ne,se=Pe,Ae=Ne)},setLocked:function(ne){Y=ne},setClear:function(ne){me!==ne&&(s.clearStencil(ne),me=ne)},reset:function(){Y=!1,St=null,Et=null,Ft=null,Lt=null,Qt=null,se=null,Ae=null,me=null}}}const r=new i,l=new o,c=new a,h=new WeakMap,f=new WeakMap;let u={},m={},v=new WeakMap,g=[],x=null,p=!1,d=null,M=null,_=null,S=null,w=null,b=null,A=null,y=new Dt(0,0,0),E=0,R=!1,P=null,N=null,T=null,C=null,I=null;const H=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,O=0;const k=s.getParameter(s.VERSION);k.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(k)[1]),z=O>=1):k.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),z=O>=2);let q=null,K={};const L=s.getParameter(s.SCISSOR_BOX),B=s.getParameter(s.VIEWPORT),G=new pe().fromArray(L),$=new pe().fromArray(B);function Q(Y,St,Et,Ft){const Lt=new Uint8Array(4),Qt=s.createTexture();s.bindTexture(Y,Qt),s.texParameteri(Y,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(Y,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let se=0;se<Et;se++)n&&(Y===s.TEXTURE_3D||Y===s.TEXTURE_2D_ARRAY)?s.texImage3D(St,0,s.RGBA,1,1,Ft,0,s.RGBA,s.UNSIGNED_BYTE,Lt):s.texImage2D(St+se,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Lt);return Qt}const st={};st[s.TEXTURE_2D]=Q(s.TEXTURE_2D,s.TEXTURE_2D,1),st[s.TEXTURE_CUBE_MAP]=Q(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(st[s.TEXTURE_2D_ARRAY]=Q(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),st[s.TEXTURE_3D]=Q(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),l.setClear(1),c.setClear(0),j(s.DEPTH_TEST),l.setFunc(la),rt(!1),U(xl),j(s.CULL_FACE),mt(li);function j(Y){u[Y]!==!0&&(s.enable(Y),u[Y]=!0)}function X(Y){u[Y]!==!1&&(s.disable(Y),u[Y]=!1)}function ot(Y,St){return m[Y]!==St?(s.bindFramebuffer(Y,St),m[Y]=St,n&&(Y===s.DRAW_FRAMEBUFFER&&(m[s.FRAMEBUFFER]=St),Y===s.FRAMEBUFFER&&(m[s.DRAW_FRAMEBUFFER]=St)),!0):!1}function V(Y,St){let Et=g,Ft=!1;if(Y)if(Et=v.get(St),Et===void 0&&(Et=[],v.set(St,Et)),Y.isWebGLMultipleRenderTargets){const Lt=Y.texture;if(Et.length!==Lt.length||Et[0]!==s.COLOR_ATTACHMENT0){for(let Qt=0,se=Lt.length;Qt<se;Qt++)Et[Qt]=s.COLOR_ATTACHMENT0+Qt;Et.length=Lt.length,Ft=!0}}else Et[0]!==s.COLOR_ATTACHMENT0&&(Et[0]=s.COLOR_ATTACHMENT0,Ft=!0);else Et[0]!==s.BACK&&(Et[0]=s.BACK,Ft=!0);Ft&&(e.isWebGL2?s.drawBuffers(Et):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Et))}function xt(Y){return x!==Y?(s.useProgram(Y),x=Y,!0):!1}const pt={[bi]:s.FUNC_ADD,[qu]:s.FUNC_SUBTRACT,[Xu]:s.FUNC_REVERSE_SUBTRACT};if(n)pt[_l]=s.MIN,pt[yl]=s.MAX;else{const Y=t.get("EXT_blend_minmax");Y!==null&&(pt[_l]=Y.MIN_EXT,pt[yl]=Y.MAX_EXT)}const vt={[ju]:s.ZERO,[Yu]:s.ONE,[$u]:s.SRC_COLOR,[Pr]:s.SRC_ALPHA,[ef]:s.SRC_ALPHA_SATURATE,[Qu]:s.DST_COLOR,[Zu]:s.DST_ALPHA,[Ku]:s.ONE_MINUS_SRC_COLOR,[Lr]:s.ONE_MINUS_SRC_ALPHA,[tf]:s.ONE_MINUS_DST_COLOR,[Ju]:s.ONE_MINUS_DST_ALPHA,[nf]:s.CONSTANT_COLOR,[sf]:s.ONE_MINUS_CONSTANT_COLOR,[of]:s.CONSTANT_ALPHA,[af]:s.ONE_MINUS_CONSTANT_ALPHA};function mt(Y,St,Et,Ft,Lt,Qt,se,Ae,me,ne){if(Y===li){p===!0&&(X(s.BLEND),p=!1);return}if(p===!1&&(j(s.BLEND),p=!0),Y!==Vu){if(Y!==d||ne!==R){if((M!==bi||w!==bi)&&(s.blendEquation(s.FUNC_ADD),M=bi,w=bi),ne)switch(Y){case gs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Rr:s.blendFunc(s.ONE,s.ONE);break;case vl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ml:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",Y);break}else switch(Y){case gs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Rr:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case vl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ml:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",Y);break}_=null,S=null,b=null,A=null,y.set(0,0,0),E=0,d=Y,R=ne}return}Lt=Lt||St,Qt=Qt||Et,se=se||Ft,(St!==M||Lt!==w)&&(s.blendEquationSeparate(pt[St],pt[Lt]),M=St,w=Lt),(Et!==_||Ft!==S||Qt!==b||se!==A)&&(s.blendFuncSeparate(vt[Et],vt[Ft],vt[Qt],vt[se]),_=Et,S=Ft,b=Qt,A=se),(Ae.equals(y)===!1||me!==E)&&(s.blendColor(Ae.r,Ae.g,Ae.b,me),y.copy(Ae),E=me),d=Y,R=!1}function Nt(Y,St){Y.side===tn?X(s.CULL_FACE):j(s.CULL_FACE);let Et=Y.side===$e;St&&(Et=!Et),rt(Et),Y.blending===gs&&Y.transparent===!1?mt(li):mt(Y.blending,Y.blendEquation,Y.blendSrc,Y.blendDst,Y.blendEquationAlpha,Y.blendSrcAlpha,Y.blendDstAlpha,Y.blendColor,Y.blendAlpha,Y.premultipliedAlpha),l.setFunc(Y.depthFunc),l.setTest(Y.depthTest),l.setMask(Y.depthWrite),r.setMask(Y.colorWrite);const Ft=Y.stencilWrite;c.setTest(Ft),Ft&&(c.setMask(Y.stencilWriteMask),c.setFunc(Y.stencilFunc,Y.stencilRef,Y.stencilFuncMask),c.setOp(Y.stencilFail,Y.stencilZFail,Y.stencilZPass)),Z(Y.polygonOffset,Y.polygonOffsetFactor,Y.polygonOffsetUnits),Y.alphaToCoverage===!0?j(s.SAMPLE_ALPHA_TO_COVERAGE):X(s.SAMPLE_ALPHA_TO_COVERAGE)}function rt(Y){P!==Y&&(Y?s.frontFace(s.CW):s.frontFace(s.CCW),P=Y)}function U(Y){Y!==Hu?(j(s.CULL_FACE),Y!==N&&(Y===xl?s.cullFace(s.BACK):Y===Gu?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):X(s.CULL_FACE),N=Y}function D(Y){Y!==T&&(z&&s.lineWidth(Y),T=Y)}function Z(Y,St,Et){Y?(j(s.POLYGON_OFFSET_FILL),(C!==St||I!==Et)&&(s.polygonOffset(St,Et),C=St,I=Et)):X(s.POLYGON_OFFSET_FILL)}function ct(Y){Y?j(s.SCISSOR_TEST):X(s.SCISSOR_TEST)}function lt(Y){Y===void 0&&(Y=s.TEXTURE0+H-1),q!==Y&&(s.activeTexture(Y),q=Y)}function dt(Y,St,Et){Et===void 0&&(q===null?Et=s.TEXTURE0+H-1:Et=q);let Ft=K[Et];Ft===void 0&&(Ft={type:void 0,texture:void 0},K[Et]=Ft),(Ft.type!==Y||Ft.texture!==St)&&(q!==Et&&(s.activeTexture(Et),q=Et),s.bindTexture(Y,St||st[Y]),Ft.type=Y,Ft.texture=St)}function At(){const Y=K[q];Y!==void 0&&Y.type!==void 0&&(s.bindTexture(Y.type,null),Y.type=void 0,Y.texture=void 0)}function yt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function gt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function Ct(){try{s.texSubImage2D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function zt(){try{s.texSubImage3D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function ht(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function ee(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function Wt(){try{s.texStorage2D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function Ot(){try{s.texStorage3D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function Pt(){try{s.texImage2D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function ft(){try{s.texImage3D.apply(s,arguments)}catch(Y){console.error("THREE.WebGLState:",Y)}}function bt(Y){G.equals(Y)===!1&&(s.scissor(Y.x,Y.y,Y.z,Y.w),G.copy(Y))}function Jt(Y){$.equals(Y)===!1&&(s.viewport(Y.x,Y.y,Y.z,Y.w),$.copy(Y))}function re(Y,St){let Et=f.get(St);Et===void 0&&(Et=new WeakMap,f.set(St,Et));let Ft=Et.get(Y);Ft===void 0&&(Ft=s.getUniformBlockIndex(St,Y.name),Et.set(Y,Ft))}function Xt(Y,St){const Ft=f.get(St).get(Y);h.get(St)!==Ft&&(s.uniformBlockBinding(St,Ft,Y.__bindingPointIndex),h.set(St,Ft))}function Mt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},q=null,K={},m={},v=new WeakMap,g=[],x=null,p=!1,d=null,M=null,_=null,S=null,w=null,b=null,A=null,y=new Dt(0,0,0),E=0,R=!1,P=null,N=null,T=null,C=null,I=null,G.set(0,0,s.canvas.width,s.canvas.height),$.set(0,0,s.canvas.width,s.canvas.height),r.reset(),l.reset(),c.reset()}return{buffers:{color:r,depth:l,stencil:c},enable:j,disable:X,bindFramebuffer:ot,drawBuffers:V,useProgram:xt,setBlending:mt,setMaterial:Nt,setFlipSided:rt,setCullFace:U,setLineWidth:D,setPolygonOffset:Z,setScissorTest:ct,activeTexture:lt,bindTexture:dt,unbindTexture:At,compressedTexImage2D:yt,compressedTexImage3D:gt,texImage2D:Pt,texImage3D:ft,updateUBOMapping:re,uniformBlockBinding:Xt,texStorage2D:Wt,texStorage3D:Ot,texSubImage2D:Ct,texSubImage3D:zt,compressedTexSubImage2D:ht,compressedTexSubImage3D:ee,scissor:bt,viewport:Jt,reset:Mt}}function n1(s,t,e,n,i,o,a){const r=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let f;const u=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(U,D){return m?new OffscreenCanvas(U,D):pa("canvas")}function g(U,D,Z,ct){let lt=1;if((U.width>ct||U.height>ct)&&(lt=ct/Math.max(U.width,U.height)),lt<1||D===!0)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap){const dt=D?da:Math.floor,At=dt(lt*U.width),yt=dt(lt*U.height);f===void 0&&(f=v(At,yt));const gt=Z?v(At,yt):f;return gt.width=At,gt.height=yt,gt.getContext("2d").drawImage(U,0,0,At,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+U.width+"x"+U.height+") to ("+At+"x"+yt+")."),gt}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+U.width+"x"+U.height+")."),U;return U}function x(U){return Ir(U.width)&&Ir(U.height)}function p(U){return r?!1:U.wrapS!==en||U.wrapT!==en||U.minFilter!==Me&&U.minFilter!==fe}function d(U,D){return U.generateMipmaps&&D&&U.minFilter!==Me&&U.minFilter!==fe}function M(U){s.generateMipmap(U)}function _(U,D,Z,ct,lt=!1){if(r===!1)return D;if(U!==null){if(s[U]!==void 0)return s[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let dt=D;if(D===s.RED&&(Z===s.FLOAT&&(dt=s.R32F),Z===s.HALF_FLOAT&&(dt=s.R16F),Z===s.UNSIGNED_BYTE&&(dt=s.R8)),D===s.RED_INTEGER&&(Z===s.UNSIGNED_BYTE&&(dt=s.R8UI),Z===s.UNSIGNED_SHORT&&(dt=s.R16UI),Z===s.UNSIGNED_INT&&(dt=s.R32UI),Z===s.BYTE&&(dt=s.R8I),Z===s.SHORT&&(dt=s.R16I),Z===s.INT&&(dt=s.R32I)),D===s.RG&&(Z===s.FLOAT&&(dt=s.RG32F),Z===s.HALF_FLOAT&&(dt=s.RG16F),Z===s.UNSIGNED_BYTE&&(dt=s.RG8)),D===s.RGBA){const At=lt?ca:ce.getTransfer(ct);Z===s.FLOAT&&(dt=s.RGBA32F),Z===s.HALF_FLOAT&&(dt=s.RGBA16F),Z===s.UNSIGNED_BYTE&&(dt=At===ge?s.SRGB8_ALPHA8:s.RGBA8),Z===s.UNSIGNED_SHORT_4_4_4_4&&(dt=s.RGBA4),Z===s.UNSIGNED_SHORT_5_5_5_1&&(dt=s.RGB5_A1)}return(dt===s.R16F||dt===s.R32F||dt===s.RG16F||dt===s.RG32F||dt===s.RGBA16F||dt===s.RGBA32F)&&t.get("EXT_color_buffer_float"),dt}function S(U,D,Z){return d(U,Z)===!0||U.isFramebufferTexture&&U.minFilter!==Me&&U.minFilter!==fe?Math.log2(Math.max(D.width,D.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?D.mipmaps.length:1}function w(U){return U===Me||U===wl||U===La?s.NEAREST:s.LINEAR}function b(U){const D=U.target;D.removeEventListener("dispose",b),y(D),D.isVideoTexture&&h.delete(D)}function A(U){const D=U.target;D.removeEventListener("dispose",A),R(D)}function y(U){const D=n.get(U);if(D.__webglInit===void 0)return;const Z=U.source,ct=u.get(Z);if(ct){const lt=ct[D.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&E(U),Object.keys(ct).length===0&&u.delete(Z)}n.remove(U)}function E(U){const D=n.get(U);s.deleteTexture(D.__webglTexture);const Z=U.source,ct=u.get(Z);delete ct[D.__cacheKey],a.memory.textures--}function R(U){const D=U.texture,Z=n.get(U),ct=n.get(D);if(ct.__webglTexture!==void 0&&(s.deleteTexture(ct.__webglTexture),a.memory.textures--),U.depthTexture&&U.depthTexture.dispose(),U.isWebGLCubeRenderTarget)for(let lt=0;lt<6;lt++){if(Array.isArray(Z.__webglFramebuffer[lt]))for(let dt=0;dt<Z.__webglFramebuffer[lt].length;dt++)s.deleteFramebuffer(Z.__webglFramebuffer[lt][dt]);else s.deleteFramebuffer(Z.__webglFramebuffer[lt]);Z.__webglDepthbuffer&&s.deleteRenderbuffer(Z.__webglDepthbuffer[lt])}else{if(Array.isArray(Z.__webglFramebuffer))for(let lt=0;lt<Z.__webglFramebuffer.length;lt++)s.deleteFramebuffer(Z.__webglFramebuffer[lt]);else s.deleteFramebuffer(Z.__webglFramebuffer);if(Z.__webglDepthbuffer&&s.deleteRenderbuffer(Z.__webglDepthbuffer),Z.__webglMultisampledFramebuffer&&s.deleteFramebuffer(Z.__webglMultisampledFramebuffer),Z.__webglColorRenderbuffer)for(let lt=0;lt<Z.__webglColorRenderbuffer.length;lt++)Z.__webglColorRenderbuffer[lt]&&s.deleteRenderbuffer(Z.__webglColorRenderbuffer[lt]);Z.__webglDepthRenderbuffer&&s.deleteRenderbuffer(Z.__webglDepthRenderbuffer)}if(U.isWebGLMultipleRenderTargets)for(let lt=0,dt=D.length;lt<dt;lt++){const At=n.get(D[lt]);At.__webglTexture&&(s.deleteTexture(At.__webglTexture),a.memory.textures--),n.remove(D[lt])}n.remove(D),n.remove(U)}let P=0;function N(){P=0}function T(){const U=P;return U>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+i.maxTextures),P+=1,U}function C(U){const D=[];return D.push(U.wrapS),D.push(U.wrapT),D.push(U.wrapR||0),D.push(U.magFilter),D.push(U.minFilter),D.push(U.anisotropy),D.push(U.internalFormat),D.push(U.format),D.push(U.type),D.push(U.generateMipmaps),D.push(U.premultiplyAlpha),D.push(U.flipY),D.push(U.unpackAlignment),D.push(U.colorSpace),D.join()}function I(U,D){const Z=n.get(U);if(U.isVideoTexture&&Nt(U),U.isRenderTargetTexture===!1&&U.version>0&&Z.__version!==U.version){const ct=U.image;if(ct===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ct.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G(Z,U,D);return}}e.bindTexture(s.TEXTURE_2D,Z.__webglTexture,s.TEXTURE0+D)}function H(U,D){const Z=n.get(U);if(U.version>0&&Z.__version!==U.version){G(Z,U,D);return}e.bindTexture(s.TEXTURE_2D_ARRAY,Z.__webglTexture,s.TEXTURE0+D)}function z(U,D){const Z=n.get(U);if(U.version>0&&Z.__version!==U.version){G(Z,U,D);return}e.bindTexture(s.TEXTURE_3D,Z.__webglTexture,s.TEXTURE0+D)}function O(U,D){const Z=n.get(U);if(U.version>0&&Z.__version!==U.version){$(Z,U,D);return}e.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture,s.TEXTURE0+D)}const k={[Pi]:s.REPEAT,[en]:s.CLAMP_TO_EDGE,[zr]:s.MIRRORED_REPEAT},q={[Me]:s.NEAREST,[wl]:s.NEAREST_MIPMAP_NEAREST,[La]:s.NEAREST_MIPMAP_LINEAR,[fe]:s.LINEAR,[wf]:s.LINEAR_MIPMAP_NEAREST,[Li]:s.LINEAR_MIPMAP_LINEAR},K={[zf]:s.NEVER,[Bf]:s.ALWAYS,[Ff]:s.LESS,[Wh]:s.LEQUAL,[If]:s.EQUAL,[Of]:s.GEQUAL,[Uf]:s.GREATER,[Nf]:s.NOTEQUAL};function L(U,D,Z){if(Z?(s.texParameteri(U,s.TEXTURE_WRAP_S,k[D.wrapS]),s.texParameteri(U,s.TEXTURE_WRAP_T,k[D.wrapT]),(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)&&s.texParameteri(U,s.TEXTURE_WRAP_R,k[D.wrapR]),s.texParameteri(U,s.TEXTURE_MAG_FILTER,q[D.magFilter]),s.texParameteri(U,s.TEXTURE_MIN_FILTER,q[D.minFilter])):(s.texParameteri(U,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(U,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(U===s.TEXTURE_3D||U===s.TEXTURE_2D_ARRAY)&&s.texParameteri(U,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(D.wrapS!==en||D.wrapT!==en)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(U,s.TEXTURE_MAG_FILTER,w(D.magFilter)),s.texParameteri(U,s.TEXTURE_MIN_FILTER,w(D.minFilter)),D.minFilter!==Me&&D.minFilter!==fe&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),D.compareFunction&&(s.texParameteri(U,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(U,s.TEXTURE_COMPARE_FUNC,K[D.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const ct=t.get("EXT_texture_filter_anisotropic");if(D.magFilter===Me||D.minFilter!==La&&D.minFilter!==Li||D.type===An&&t.has("OES_texture_float_linear")===!1||r===!1&&D.type===Jn&&t.has("OES_texture_half_float_linear")===!1)return;(D.anisotropy>1||n.get(D).__currentAnisotropy)&&(s.texParameterf(U,ct.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(D.anisotropy,i.getMaxAnisotropy())),n.get(D).__currentAnisotropy=D.anisotropy)}}function B(U,D){let Z=!1;U.__webglInit===void 0&&(U.__webglInit=!0,D.addEventListener("dispose",b));const ct=D.source;let lt=u.get(ct);lt===void 0&&(lt={},u.set(ct,lt));const dt=C(D);if(dt!==U.__cacheKey){lt[dt]===void 0&&(lt[dt]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,Z=!0),lt[dt].usedTimes++;const At=lt[U.__cacheKey];At!==void 0&&(lt[U.__cacheKey].usedTimes--,At.usedTimes===0&&E(D)),U.__cacheKey=dt,U.__webglTexture=lt[dt].texture}return Z}function G(U,D,Z){let ct=s.TEXTURE_2D;(D.isDataArrayTexture||D.isCompressedArrayTexture)&&(ct=s.TEXTURE_2D_ARRAY),D.isData3DTexture&&(ct=s.TEXTURE_3D);const lt=B(U,D),dt=D.source;e.bindTexture(ct,U.__webglTexture,s.TEXTURE0+Z);const At=n.get(dt);if(dt.version!==At.__version||lt===!0){e.activeTexture(s.TEXTURE0+Z);const yt=ce.getPrimaries(ce.workingColorSpace),gt=D.colorSpace===gn?null:ce.getPrimaries(D.colorSpace),Ct=D.colorSpace===gn||yt===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,D.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,D.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct);const zt=p(D)&&x(D.image)===!1;let ht=g(D.image,zt,!1,i.maxTextureSize);ht=rt(D,ht);const ee=x(ht)||r,Wt=o.convert(D.format,D.colorSpace);let Ot=o.convert(D.type),Pt=_(D.internalFormat,Wt,Ot,D.colorSpace,D.isVideoTexture);L(ct,D,ee);let ft;const bt=D.mipmaps,Jt=r&&D.isVideoTexture!==!0&&Pt!==Hh,re=At.__version===void 0||lt===!0,Xt=S(D,ht,ee);if(D.isDepthTexture)Pt=s.DEPTH_COMPONENT,r?D.type===An?Pt=s.DEPTH_COMPONENT32F:D.type===Xn?Pt=s.DEPTH_COMPONENT24:D.type===Ei?Pt=s.DEPTH24_STENCIL8:Pt=s.DEPTH_COMPONENT16:D.type===An&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),D.format===Ti&&Pt===s.DEPTH_COMPONENT&&D.type!==Jr&&D.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),D.type=Xn,Ot=o.convert(D.type)),D.format===bs&&Pt===s.DEPTH_COMPONENT&&(Pt=s.DEPTH_STENCIL,D.type!==Ei&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),D.type=Ei,Ot=o.convert(D.type))),re&&(Jt?e.texStorage2D(s.TEXTURE_2D,1,Pt,ht.width,ht.height):e.texImage2D(s.TEXTURE_2D,0,Pt,ht.width,ht.height,0,Wt,Ot,null));else if(D.isDataTexture)if(bt.length>0&&ee){Jt&&re&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,bt[0].width,bt[0].height);for(let Mt=0,Y=bt.length;Mt<Y;Mt++)ft=bt[Mt],Jt?e.texSubImage2D(s.TEXTURE_2D,Mt,0,0,ft.width,ft.height,Wt,Ot,ft.data):e.texImage2D(s.TEXTURE_2D,Mt,Pt,ft.width,ft.height,0,Wt,Ot,ft.data);D.generateMipmaps=!1}else Jt?(re&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,ht.width,ht.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,ht.width,ht.height,Wt,Ot,ht.data)):e.texImage2D(s.TEXTURE_2D,0,Pt,ht.width,ht.height,0,Wt,Ot,ht.data);else if(D.isCompressedTexture)if(D.isCompressedArrayTexture){Jt&&re&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Xt,Pt,bt[0].width,bt[0].height,ht.depth);for(let Mt=0,Y=bt.length;Mt<Y;Mt++)ft=bt[Mt],D.format!==Ve?Wt!==null?Jt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Mt,0,0,0,ft.width,ft.height,ht.depth,Wt,ft.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Mt,Pt,ft.width,ft.height,ht.depth,0,ft.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,Mt,0,0,0,ft.width,ft.height,ht.depth,Wt,Ot,ft.data):e.texImage3D(s.TEXTURE_2D_ARRAY,Mt,Pt,ft.width,ft.height,ht.depth,0,Wt,Ot,ft.data)}else{Jt&&re&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,bt[0].width,bt[0].height);for(let Mt=0,Y=bt.length;Mt<Y;Mt++)ft=bt[Mt],D.format!==Ve?Wt!==null?Jt?e.compressedTexSubImage2D(s.TEXTURE_2D,Mt,0,0,ft.width,ft.height,Wt,ft.data):e.compressedTexImage2D(s.TEXTURE_2D,Mt,Pt,ft.width,ft.height,0,ft.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?e.texSubImage2D(s.TEXTURE_2D,Mt,0,0,ft.width,ft.height,Wt,Ot,ft.data):e.texImage2D(s.TEXTURE_2D,Mt,Pt,ft.width,ft.height,0,Wt,Ot,ft.data)}else if(D.isDataArrayTexture)Jt?(re&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Xt,Pt,ht.width,ht.height,ht.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ht.width,ht.height,ht.depth,Wt,Ot,ht.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,Pt,ht.width,ht.height,ht.depth,0,Wt,Ot,ht.data);else if(D.isData3DTexture)Jt?(re&&e.texStorage3D(s.TEXTURE_3D,Xt,Pt,ht.width,ht.height,ht.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ht.width,ht.height,ht.depth,Wt,Ot,ht.data)):e.texImage3D(s.TEXTURE_3D,0,Pt,ht.width,ht.height,ht.depth,0,Wt,Ot,ht.data);else if(D.isFramebufferTexture){if(re)if(Jt)e.texStorage2D(s.TEXTURE_2D,Xt,Pt,ht.width,ht.height);else{let Mt=ht.width,Y=ht.height;for(let St=0;St<Xt;St++)e.texImage2D(s.TEXTURE_2D,St,Pt,Mt,Y,0,Wt,Ot,null),Mt>>=1,Y>>=1}}else if(bt.length>0&&ee){Jt&&re&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,bt[0].width,bt[0].height);for(let Mt=0,Y=bt.length;Mt<Y;Mt++)ft=bt[Mt],Jt?e.texSubImage2D(s.TEXTURE_2D,Mt,0,0,Wt,Ot,ft):e.texImage2D(s.TEXTURE_2D,Mt,Pt,Wt,Ot,ft);D.generateMipmaps=!1}else Jt?(re&&e.texStorage2D(s.TEXTURE_2D,Xt,Pt,ht.width,ht.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Wt,Ot,ht)):e.texImage2D(s.TEXTURE_2D,0,Pt,Wt,Ot,ht);d(D,ee)&&M(ct),At.__version=dt.version,D.onUpdate&&D.onUpdate(D)}U.__version=D.version}function $(U,D,Z){if(D.image.length!==6)return;const ct=B(U,D),lt=D.source;e.bindTexture(s.TEXTURE_CUBE_MAP,U.__webglTexture,s.TEXTURE0+Z);const dt=n.get(lt);if(lt.version!==dt.__version||ct===!0){e.activeTexture(s.TEXTURE0+Z);const At=ce.getPrimaries(ce.workingColorSpace),yt=D.colorSpace===gn?null:ce.getPrimaries(D.colorSpace),gt=D.colorSpace===gn||At===yt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,D.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,D.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const Ct=D.isCompressedTexture||D.image[0].isCompressedTexture,zt=D.image[0]&&D.image[0].isDataTexture,ht=[];for(let Mt=0;Mt<6;Mt++)!Ct&&!zt?ht[Mt]=g(D.image[Mt],!1,!0,i.maxCubemapSize):ht[Mt]=zt?D.image[Mt].image:D.image[Mt],ht[Mt]=rt(D,ht[Mt]);const ee=ht[0],Wt=x(ee)||r,Ot=o.convert(D.format,D.colorSpace),Pt=o.convert(D.type),ft=_(D.internalFormat,Ot,Pt,D.colorSpace),bt=r&&D.isVideoTexture!==!0,Jt=dt.__version===void 0||ct===!0;let re=S(D,ee,Wt);L(s.TEXTURE_CUBE_MAP,D,Wt);let Xt;if(Ct){bt&&Jt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,re,ft,ee.width,ee.height);for(let Mt=0;Mt<6;Mt++){Xt=ht[Mt].mipmaps;for(let Y=0;Y<Xt.length;Y++){const St=Xt[Y];D.format!==Ve?Ot!==null?bt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y,0,0,St.width,St.height,Ot,St.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y,ft,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y,0,0,St.width,St.height,Ot,Pt,St.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y,ft,St.width,St.height,0,Ot,Pt,St.data)}}}else{Xt=D.mipmaps,bt&&Jt&&(Xt.length>0&&re++,e.texStorage2D(s.TEXTURE_CUBE_MAP,re,ft,ht[0].width,ht[0].height));for(let Mt=0;Mt<6;Mt++)if(zt){bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,0,0,ht[Mt].width,ht[Mt].height,Ot,Pt,ht[Mt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,ft,ht[Mt].width,ht[Mt].height,0,Ot,Pt,ht[Mt].data);for(let Y=0;Y<Xt.length;Y++){const Et=Xt[Y].image[Mt].image;bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y+1,0,0,Et.width,Et.height,Ot,Pt,Et.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y+1,ft,Et.width,Et.height,0,Ot,Pt,Et.data)}}else{bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,0,0,Ot,Pt,ht[Mt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,ft,Ot,Pt,ht[Mt]);for(let Y=0;Y<Xt.length;Y++){const St=Xt[Y];bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y+1,0,0,Ot,Pt,St.image[Mt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Y+1,ft,Ot,Pt,St.image[Mt])}}}d(D,Wt)&&M(s.TEXTURE_CUBE_MAP),dt.__version=lt.version,D.onUpdate&&D.onUpdate(D)}U.__version=D.version}function Q(U,D,Z,ct,lt,dt){const At=o.convert(Z.format,Z.colorSpace),yt=o.convert(Z.type),gt=_(Z.internalFormat,At,yt,Z.colorSpace);if(!n.get(D).__hasExternalTextures){const zt=Math.max(1,D.width>>dt),ht=Math.max(1,D.height>>dt);lt===s.TEXTURE_3D||lt===s.TEXTURE_2D_ARRAY?e.texImage3D(lt,dt,gt,zt,ht,D.depth,0,At,yt,null):e.texImage2D(lt,dt,gt,zt,ht,0,At,yt,null)}e.bindFramebuffer(s.FRAMEBUFFER,U),mt(D)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ct,lt,n.get(Z).__webglTexture,0,vt(D)):(lt===s.TEXTURE_2D||lt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ct,lt,n.get(Z).__webglTexture,dt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function st(U,D,Z){if(s.bindRenderbuffer(s.RENDERBUFFER,U),D.depthBuffer&&!D.stencilBuffer){let ct=r===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(Z||mt(D)){const lt=D.depthTexture;lt&&lt.isDepthTexture&&(lt.type===An?ct=s.DEPTH_COMPONENT32F:lt.type===Xn&&(ct=s.DEPTH_COMPONENT24));const dt=vt(D);mt(D)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,dt,ct,D.width,D.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,dt,ct,D.width,D.height)}else s.renderbufferStorage(s.RENDERBUFFER,ct,D.width,D.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,U)}else if(D.depthBuffer&&D.stencilBuffer){const ct=vt(D);Z&&mt(D)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ct,s.DEPTH24_STENCIL8,D.width,D.height):mt(D)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ct,s.DEPTH24_STENCIL8,D.width,D.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,D.width,D.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,U)}else{const ct=D.isWebGLMultipleRenderTargets===!0?D.texture:[D.texture];for(let lt=0;lt<ct.length;lt++){const dt=ct[lt],At=o.convert(dt.format,dt.colorSpace),yt=o.convert(dt.type),gt=_(dt.internalFormat,At,yt,dt.colorSpace),Ct=vt(D);Z&&mt(D)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ct,gt,D.width,D.height):mt(D)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ct,gt,D.width,D.height):s.renderbufferStorage(s.RENDERBUFFER,gt,D.width,D.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function j(U,D){if(D&&D.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,U),!(D.depthTexture&&D.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(D.depthTexture).__webglTexture||D.depthTexture.image.width!==D.width||D.depthTexture.image.height!==D.height)&&(D.depthTexture.image.width=D.width,D.depthTexture.image.height=D.height,D.depthTexture.needsUpdate=!0),I(D.depthTexture,0);const ct=n.get(D.depthTexture).__webglTexture,lt=vt(D);if(D.depthTexture.format===Ti)mt(D)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ct,0,lt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ct,0);else if(D.depthTexture.format===bs)mt(D)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ct,0,lt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function X(U){const D=n.get(U),Z=U.isWebGLCubeRenderTarget===!0;if(U.depthTexture&&!D.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");j(D.__webglFramebuffer,U)}else if(Z){D.__webglDepthbuffer=[];for(let ct=0;ct<6;ct++)e.bindFramebuffer(s.FRAMEBUFFER,D.__webglFramebuffer[ct]),D.__webglDepthbuffer[ct]=s.createRenderbuffer(),st(D.__webglDepthbuffer[ct],U,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,D.__webglFramebuffer),D.__webglDepthbuffer=s.createRenderbuffer(),st(D.__webglDepthbuffer,U,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function ot(U,D,Z){const ct=n.get(U);D!==void 0&&Q(ct.__webglFramebuffer,U,U.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Z!==void 0&&X(U)}function V(U){const D=U.texture,Z=n.get(U),ct=n.get(D);U.addEventListener("dispose",A),U.isWebGLMultipleRenderTargets!==!0&&(ct.__webglTexture===void 0&&(ct.__webglTexture=s.createTexture()),ct.__version=D.version,a.memory.textures++);const lt=U.isWebGLCubeRenderTarget===!0,dt=U.isWebGLMultipleRenderTargets===!0,At=x(U)||r;if(lt){Z.__webglFramebuffer=[];for(let yt=0;yt<6;yt++)if(r&&D.mipmaps&&D.mipmaps.length>0){Z.__webglFramebuffer[yt]=[];for(let gt=0;gt<D.mipmaps.length;gt++)Z.__webglFramebuffer[yt][gt]=s.createFramebuffer()}else Z.__webglFramebuffer[yt]=s.createFramebuffer()}else{if(r&&D.mipmaps&&D.mipmaps.length>0){Z.__webglFramebuffer=[];for(let yt=0;yt<D.mipmaps.length;yt++)Z.__webglFramebuffer[yt]=s.createFramebuffer()}else Z.__webglFramebuffer=s.createFramebuffer();if(dt)if(i.drawBuffers){const yt=U.texture;for(let gt=0,Ct=yt.length;gt<Ct;gt++){const zt=n.get(yt[gt]);zt.__webglTexture===void 0&&(zt.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&U.samples>0&&mt(U)===!1){const yt=dt?D:[D];Z.__webglMultisampledFramebuffer=s.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let gt=0;gt<yt.length;gt++){const Ct=yt[gt];Z.__webglColorRenderbuffer[gt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Z.__webglColorRenderbuffer[gt]);const zt=o.convert(Ct.format,Ct.colorSpace),ht=o.convert(Ct.type),ee=_(Ct.internalFormat,zt,ht,Ct.colorSpace,U.isXRRenderTarget===!0),Wt=vt(U);s.renderbufferStorageMultisample(s.RENDERBUFFER,Wt,ee,U.width,U.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,Z.__webglColorRenderbuffer[gt])}s.bindRenderbuffer(s.RENDERBUFFER,null),U.depthBuffer&&(Z.__webglDepthRenderbuffer=s.createRenderbuffer(),st(Z.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(lt){e.bindTexture(s.TEXTURE_CUBE_MAP,ct.__webglTexture),L(s.TEXTURE_CUBE_MAP,D,At);for(let yt=0;yt<6;yt++)if(r&&D.mipmaps&&D.mipmaps.length>0)for(let gt=0;gt<D.mipmaps.length;gt++)Q(Z.__webglFramebuffer[yt][gt],U,D,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,gt);else Q(Z.__webglFramebuffer[yt],U,D,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0);d(D,At)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(dt){const yt=U.texture;for(let gt=0,Ct=yt.length;gt<Ct;gt++){const zt=yt[gt],ht=n.get(zt);e.bindTexture(s.TEXTURE_2D,ht.__webglTexture),L(s.TEXTURE_2D,zt,At),Q(Z.__webglFramebuffer,U,zt,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,0),d(zt,At)&&M(s.TEXTURE_2D)}e.unbindTexture()}else{let yt=s.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(r?yt=U.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(yt,ct.__webglTexture),L(yt,D,At),r&&D.mipmaps&&D.mipmaps.length>0)for(let gt=0;gt<D.mipmaps.length;gt++)Q(Z.__webglFramebuffer[gt],U,D,s.COLOR_ATTACHMENT0,yt,gt);else Q(Z.__webglFramebuffer,U,D,s.COLOR_ATTACHMENT0,yt,0);d(D,At)&&M(yt),e.unbindTexture()}U.depthBuffer&&X(U)}function xt(U){const D=x(U)||r,Z=U.isWebGLMultipleRenderTargets===!0?U.texture:[U.texture];for(let ct=0,lt=Z.length;ct<lt;ct++){const dt=Z[ct];if(d(dt,D)){const At=U.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,yt=n.get(dt).__webglTexture;e.bindTexture(At,yt),M(At),e.unbindTexture()}}}function pt(U){if(r&&U.samples>0&&mt(U)===!1){const D=U.isWebGLMultipleRenderTargets?U.texture:[U.texture],Z=U.width,ct=U.height;let lt=s.COLOR_BUFFER_BIT;const dt=[],At=U.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,yt=n.get(U),gt=U.isWebGLMultipleRenderTargets===!0;if(gt)for(let Ct=0;Ct<D.length;Ct++)e.bindFramebuffer(s.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,yt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Ct=0;Ct<D.length;Ct++){dt.push(s.COLOR_ATTACHMENT0+Ct),U.depthBuffer&&dt.push(At);const zt=yt.__ignoreDepthValues!==void 0?yt.__ignoreDepthValues:!1;if(zt===!1&&(U.depthBuffer&&(lt|=s.DEPTH_BUFFER_BIT),U.stencilBuffer&&(lt|=s.STENCIL_BUFFER_BIT)),gt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,yt.__webglColorRenderbuffer[Ct]),zt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[At]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[At])),gt){const ht=n.get(D[Ct]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ht,0)}s.blitFramebuffer(0,0,Z,ct,0,0,Z,ct,lt,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,dt)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),gt)for(let Ct=0;Ct<D.length;Ct++){e.bindFramebuffer(s.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.RENDERBUFFER,yt.__webglColorRenderbuffer[Ct]);const zt=n.get(D[Ct]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,yt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.TEXTURE_2D,zt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}}function vt(U){return Math.min(i.maxSamples,U.samples)}function mt(U){const D=n.get(U);return r&&U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&D.__useRenderToTexture!==!1}function Nt(U){const D=a.render.frame;h.get(U)!==D&&(h.set(U,D),U.update())}function rt(U,D){const Z=U.colorSpace,ct=U.format,lt=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||U.format===Fr||Z!==Qn&&Z!==gn&&(ce.getTransfer(Z)===ge?r===!1?t.has("EXT_sRGB")===!0&&ct===Ve?(U.format=Fr,U.minFilter=fe,U.generateMipmaps=!1):D=qh.sRGBToLinear(D):(ct!==Ve||lt!==cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),D}this.allocateTextureUnit=T,this.resetTextureUnits=N,this.setTexture2D=I,this.setTexture2DArray=H,this.setTexture3D=z,this.setTextureCube=O,this.rebindTextures=ot,this.setupRenderTarget=V,this.updateRenderTargetMipmap=xt,this.updateMultisampleRenderTarget=pt,this.setupDepthRenderbuffer=X,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=mt}function i1(s,t,e){const n=e.isWebGL2;function i(o,a=gn){let r;const l=ce.getTransfer(a);if(o===cn)return s.UNSIGNED_BYTE;if(o===Ih)return s.UNSIGNED_SHORT_4_4_4_4;if(o===Uh)return s.UNSIGNED_SHORT_5_5_5_1;if(o===bf)return s.BYTE;if(o===Sf)return s.SHORT;if(o===Jr)return s.UNSIGNED_SHORT;if(o===Fh)return s.INT;if(o===Xn)return s.UNSIGNED_INT;if(o===An)return s.FLOAT;if(o===Jn)return n?s.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===Ef)return s.ALPHA;if(o===Ve)return s.RGBA;if(o===Tf)return s.LUMINANCE;if(o===Af)return s.LUMINANCE_ALPHA;if(o===Ti)return s.DEPTH_COMPONENT;if(o===bs)return s.DEPTH_STENCIL;if(o===Fr)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===xs)return s.RED;if(o===Nh)return s.RED_INTEGER;if(o===Cf)return s.RG;if(o===Oh)return s.RG_INTEGER;if(o===Bh)return s.RGBA_INTEGER;if(o===ka||o===Da||o===za||o===Fa)if(l===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===ka)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===Da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===Fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===ka)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===Da)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===za)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===Fa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===bl||o===Sl||o===El||o===Tl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===bl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===El)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===Tl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Hh)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===Al||o===Cl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(o===Al)return l===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===Cl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===Rl||o===Pl||o===Ll||o===kl||o===Dl||o===zl||o===Fl||o===Il||o===Ul||o===Nl||o===Ol||o===Bl||o===Hl||o===Gl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(o===Rl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Pl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Ll)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===kl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Dl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===zl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===Fl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===Il)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Ul)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===Nl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===Ol)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===Bl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===Hl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Gl)return l===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===Ia||o===Wl||o===Vl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(o===Ia)return l===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===Wl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===Vl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===Rf||o===ql||o===Xl||o===jl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(o===Ia)return r.COMPRESSED_RED_RGTC1_EXT;if(o===ql)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Xl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===jl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Ei?n?s.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):s[o]!==void 0?s[o]:null}return{convert:i}}class s1 extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class xn extends sn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const o1={type:"move"};class or{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new xn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new xn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new xn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,o=null,a=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const x=e.getJointPose(g,n),p=this._getHandJoint(c,g);x!==null&&(p.matrix.fromArray(x.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=x.radius),p.visible=x!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),m=.02,v=.005;c.inputState.pinching&&u>m+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=m-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(o1)))}return r!==null&&(r.visible=i!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new xn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class a1 extends As{constructor(t,e){super();const n=this;let i=null,o=1,a=null,r="local-floor",l=1,c=null,h=null,f=null,u=null,m=null,v=null;const g=e.getContextAttributes();let x=null,p=null;const d=[],M=[],_=new Ut;let S=null;const w=new Qe;w.layers.enable(1),w.viewport=new pe;const b=new Qe;b.layers.enable(2),b.viewport=new pe;const A=[w,b],y=new s1;y.layers.enable(1),y.layers.enable(2);let E=null,R=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(L){let B=d[L];return B===void 0&&(B=new or,d[L]=B),B.getTargetRaySpace()},this.getControllerGrip=function(L){let B=d[L];return B===void 0&&(B=new or,d[L]=B),B.getGripSpace()},this.getHand=function(L){let B=d[L];return B===void 0&&(B=new or,d[L]=B),B.getHandSpace()};function P(L){const B=M.indexOf(L.inputSource);if(B===-1)return;const G=d[B];G!==void 0&&(G.update(L.inputSource,L.frame,c||a),G.dispatchEvent({type:L.type,data:L.inputSource}))}function N(){i.removeEventListener("select",P),i.removeEventListener("selectstart",P),i.removeEventListener("selectend",P),i.removeEventListener("squeeze",P),i.removeEventListener("squeezestart",P),i.removeEventListener("squeezeend",P),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",T);for(let L=0;L<d.length;L++){const B=M[L];B!==null&&(M[L]=null,d[L].disconnect(B))}E=null,R=null,t.setRenderTarget(x),m=null,u=null,f=null,i=null,p=null,K.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(_.width,_.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(L){o=L,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(L){r=L,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(L){c=L},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(L){if(i=L,i!==null){if(x=t.getRenderTarget(),i.addEventListener("select",P),i.addEventListener("selectstart",P),i.addEventListener("selectend",P),i.addEventListener("squeeze",P),i.addEventListener("squeezestart",P),i.addEventListener("squeezeend",P),i.addEventListener("end",N),i.addEventListener("inputsourceschange",T),g.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(_),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const B={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};m=new XRWebGLLayer(i,e,B),i.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),p=new hn(m.framebufferWidth,m.framebufferHeight,{format:Ve,type:cn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let B=null,G=null,$=null;g.depth&&($=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,B=g.stencil?bs:Ti,G=g.stencil?Ei:Xn);const Q={colorFormat:e.RGBA8,depthFormat:$,scaleFactor:o};f=new XRWebGLBinding(i,e),u=f.createProjectionLayer(Q),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),p=new hn(u.textureWidth,u.textureHeight,{format:Ve,type:cn,depthTexture:new ol(u.textureWidth,u.textureHeight,G,void 0,void 0,void 0,void 0,void 0,void 0,B),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const st=t.properties.get(p);st.__ignoreDepthValues=u.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(r),K.setContext(i),K.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function T(L){for(let B=0;B<L.removed.length;B++){const G=L.removed[B],$=M.indexOf(G);$>=0&&(M[$]=null,d[$].disconnect(G))}for(let B=0;B<L.added.length;B++){const G=L.added[B];let $=M.indexOf(G);if($===-1){for(let st=0;st<d.length;st++)if(st>=M.length){M.push(G),$=st;break}else if(M[st]===null){M[st]=G,$=st;break}if($===-1)break}const Q=d[$];Q&&Q.connect(G)}}const C=new W,I=new W;function H(L,B,G){C.setFromMatrixPosition(B.matrixWorld),I.setFromMatrixPosition(G.matrixWorld);const $=C.distanceTo(I),Q=B.projectionMatrix.elements,st=G.projectionMatrix.elements,j=Q[14]/(Q[10]-1),X=Q[14]/(Q[10]+1),ot=(Q[9]+1)/Q[5],V=(Q[9]-1)/Q[5],xt=(Q[8]-1)/Q[0],pt=(st[8]+1)/st[0],vt=j*xt,mt=j*pt,Nt=$/(-xt+pt),rt=Nt*-xt;B.matrixWorld.decompose(L.position,L.quaternion,L.scale),L.translateX(rt),L.translateZ(Nt),L.matrixWorld.compose(L.position,L.quaternion,L.scale),L.matrixWorldInverse.copy(L.matrixWorld).invert();const U=j+Nt,D=X+Nt,Z=vt-rt,ct=mt+($-rt),lt=ot*X/D*U,dt=V*X/D*U;L.projectionMatrix.makePerspective(Z,ct,lt,dt,U,D),L.projectionMatrixInverse.copy(L.projectionMatrix).invert()}function z(L,B){B===null?L.matrixWorld.copy(L.matrix):L.matrixWorld.multiplyMatrices(B.matrixWorld,L.matrix),L.matrixWorldInverse.copy(L.matrixWorld).invert()}this.updateCamera=function(L){if(i===null)return;y.near=b.near=w.near=L.near,y.far=b.far=w.far=L.far,(E!==y.near||R!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),E=y.near,R=y.far);const B=L.parent,G=y.cameras;z(y,B);for(let $=0;$<G.length;$++)z(G[$],B);G.length===2?H(y,w,b):y.projectionMatrix.copy(w.projectionMatrix),O(L,y,B)};function O(L,B,G){G===null?L.matrix.copy(B.matrixWorld):(L.matrix.copy(G.matrixWorld),L.matrix.invert(),L.matrix.multiply(B.matrixWorld)),L.matrix.decompose(L.position,L.quaternion,L.scale),L.updateMatrixWorld(!0),L.projectionMatrix.copy(B.projectionMatrix),L.projectionMatrixInverse.copy(B.projectionMatrixInverse),L.isPerspectiveCamera&&(L.fov=no*2*Math.atan(1/L.projectionMatrix.elements[5]),L.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(L){l=L,u!==null&&(u.fixedFoveation=L),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=L)};let k=null;function q(L,B){if(h=B.getViewerPose(c||a),v=B,h!==null){const G=h.views;m!==null&&(t.setRenderTargetFramebuffer(p,m.framebuffer),t.setRenderTarget(p));let $=!1;G.length!==y.cameras.length&&(y.cameras.length=0,$=!0);for(let Q=0;Q<G.length;Q++){const st=G[Q];let j=null;if(m!==null)j=m.getViewport(st);else{const ot=f.getViewSubImage(u,st);j=ot.viewport,Q===0&&(t.setRenderTargetTextures(p,ot.colorTexture,u.ignoreDepthValues?void 0:ot.depthStencilTexture),t.setRenderTarget(p))}let X=A[Q];X===void 0&&(X=new Qe,X.layers.enable(Q),X.viewport=new pe,A[Q]=X),X.matrix.fromArray(st.transform.matrix),X.matrix.decompose(X.position,X.quaternion,X.scale),X.projectionMatrix.fromArray(st.projectionMatrix),X.projectionMatrixInverse.copy(X.projectionMatrix).invert(),X.viewport.set(j.x,j.y,j.width,j.height),Q===0&&(y.matrix.copy(X.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),$===!0&&y.cameras.push(X)}}for(let G=0;G<d.length;G++){const $=M[G],Q=d[G];$!==null&&Q!==void 0&&Q.update($,B,c||a)}k&&k(L,B),B.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:B}),v=null}const K=new eu;K.setAnimationLoop(q),this.setAnimationLoop=function(L){k=L},this.dispose=function(){}}}function r1(s,t){function e(x,p){x.matrixAutoUpdate===!0&&x.updateMatrix(),p.value.copy(x.matrix)}function n(x,p){p.color.getRGB(x.fogColor.value,Jh(s)),p.isFog?(x.fogNear.value=p.near,x.fogFar.value=p.far):p.isFogExp2&&(x.fogDensity.value=p.density)}function i(x,p,d,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(x,p):p.isMeshToonMaterial?(o(x,p),f(x,p)):p.isMeshPhongMaterial?(o(x,p),h(x,p)):p.isMeshStandardMaterial?(o(x,p),u(x,p),p.isMeshPhysicalMaterial&&m(x,p,_)):p.isMeshMatcapMaterial?(o(x,p),v(x,p)):p.isMeshDepthMaterial?o(x,p):p.isMeshDistanceMaterial?(o(x,p),g(x,p)):p.isMeshNormalMaterial?o(x,p):p.isLineBasicMaterial?(a(x,p),p.isLineDashedMaterial&&r(x,p)):p.isPointsMaterial?l(x,p,d,M):p.isSpriteMaterial?c(x,p):p.isShadowMaterial?(x.color.value.copy(p.color),x.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(x,p){x.opacity.value=p.opacity,p.color&&x.diffuse.value.copy(p.color),p.emissive&&x.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.bumpMap&&(x.bumpMap.value=p.bumpMap,e(p.bumpMap,x.bumpMapTransform),x.bumpScale.value=p.bumpScale,p.side===$e&&(x.bumpScale.value*=-1)),p.normalMap&&(x.normalMap.value=p.normalMap,e(p.normalMap,x.normalMapTransform),x.normalScale.value.copy(p.normalScale),p.side===$e&&x.normalScale.value.negate()),p.displacementMap&&(x.displacementMap.value=p.displacementMap,e(p.displacementMap,x.displacementMapTransform),x.displacementScale.value=p.displacementScale,x.displacementBias.value=p.displacementBias),p.emissiveMap&&(x.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,x.emissiveMapTransform)),p.specularMap&&(x.specularMap.value=p.specularMap,e(p.specularMap,x.specularMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest);const d=t.get(p).envMap;if(d&&(x.envMap.value=d,x.flipEnvMap.value=d.isCubeTexture&&d.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=p.reflectivity,x.ior.value=p.ior,x.refractionRatio.value=p.refractionRatio),p.lightMap){x.lightMap.value=p.lightMap;const M=s._useLegacyLights===!0?Math.PI:1;x.lightMapIntensity.value=p.lightMapIntensity*M,e(p.lightMap,x.lightMapTransform)}p.aoMap&&(x.aoMap.value=p.aoMap,x.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,x.aoMapTransform))}function a(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform))}function r(x,p){x.dashSize.value=p.dashSize,x.totalSize.value=p.dashSize+p.gapSize,x.scale.value=p.scale}function l(x,p,d,M){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.size.value=p.size*d,x.scale.value=M*.5,p.map&&(x.map.value=p.map,e(p.map,x.uvTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function c(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.rotation.value=p.rotation,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function h(x,p){x.specular.value.copy(p.specular),x.shininess.value=Math.max(p.shininess,1e-4)}function f(x,p){p.gradientMap&&(x.gradientMap.value=p.gradientMap)}function u(x,p){x.metalness.value=p.metalness,p.metalnessMap&&(x.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,x.metalnessMapTransform)),x.roughness.value=p.roughness,p.roughnessMap&&(x.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,x.roughnessMapTransform)),t.get(p).envMap&&(x.envMapIntensity.value=p.envMapIntensity)}function m(x,p,d){x.ior.value=p.ior,p.sheen>0&&(x.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),x.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(x.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,x.sheenColorMapTransform)),p.sheenRoughnessMap&&(x.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,x.sheenRoughnessMapTransform))),p.clearcoat>0&&(x.clearcoat.value=p.clearcoat,x.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(x.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,x.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(x.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===$e&&x.clearcoatNormalScale.value.negate())),p.iridescence>0&&(x.iridescence.value=p.iridescence,x.iridescenceIOR.value=p.iridescenceIOR,x.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(x.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,x.iridescenceMapTransform)),p.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),p.transmission>0&&(x.transmission.value=p.transmission,x.transmissionSamplerMap.value=d.texture,x.transmissionSamplerSize.value.set(d.width,d.height),p.transmissionMap&&(x.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,x.transmissionMapTransform)),x.thickness.value=p.thickness,p.thicknessMap&&(x.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=p.attenuationDistance,x.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(x.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(x.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=p.specularIntensity,x.specularColor.value.copy(p.specularColor),p.specularColorMap&&(x.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,x.specularColorMapTransform)),p.specularIntensityMap&&(x.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,x.specularIntensityMapTransform))}function v(x,p){p.matcap&&(x.matcap.value=p.matcap)}function g(x,p){const d=t.get(p).light;x.referencePosition.value.setFromMatrixPosition(d.matrixWorld),x.nearDistance.value=d.shadow.camera.near,x.farDistance.value=d.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function l1(s,t,e,n){let i={},o={},a=[];const r=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(d,M){const _=M.program;n.uniformBlockBinding(d,_)}function c(d,M){let _=i[d.id];_===void 0&&(v(d),_=h(d),i[d.id]=_,d.addEventListener("dispose",x));const S=M.program;n.updateUBOMapping(d,S);const w=t.render.frame;o[d.id]!==w&&(u(d),o[d.id]=w)}function h(d){const M=f();d.__bindingPointIndex=M;const _=s.createBuffer(),S=d.__size,w=d.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,S,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,M,_),_}function f(){for(let d=0;d<r;d++)if(a.indexOf(d)===-1)return a.push(d),d;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(d){const M=i[d.id],_=d.uniforms,S=d.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let w=0,b=_.length;w<b;w++){const A=Array.isArray(_[w])?_[w]:[_[w]];for(let y=0,E=A.length;y<E;y++){const R=A[y];if(m(R,w,y,S)===!0){const P=R.__offset,N=Array.isArray(R.value)?R.value:[R.value];let T=0;for(let C=0;C<N.length;C++){const I=N[C],H=g(I);typeof I=="number"||typeof I=="boolean"?(R.__data[0]=I,s.bufferSubData(s.UNIFORM_BUFFER,P+T,R.__data)):I.isMatrix3?(R.__data[0]=I.elements[0],R.__data[1]=I.elements[1],R.__data[2]=I.elements[2],R.__data[3]=0,R.__data[4]=I.elements[3],R.__data[5]=I.elements[4],R.__data[6]=I.elements[5],R.__data[7]=0,R.__data[8]=I.elements[6],R.__data[9]=I.elements[7],R.__data[10]=I.elements[8],R.__data[11]=0):(I.toArray(R.__data,T),T+=H.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,P,R.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function m(d,M,_,S){const w=d.value,b=M+"_"+_;if(S[b]===void 0)return typeof w=="number"||typeof w=="boolean"?S[b]=w:S[b]=w.clone(),!0;{const A=S[b];if(typeof w=="number"||typeof w=="boolean"){if(A!==w)return S[b]=w,!0}else if(A.equals(w)===!1)return A.copy(w),!0}return!1}function v(d){const M=d.uniforms;let _=0;const S=16;for(let b=0,A=M.length;b<A;b++){const y=Array.isArray(M[b])?M[b]:[M[b]];for(let E=0,R=y.length;E<R;E++){const P=y[E],N=Array.isArray(P.value)?P.value:[P.value];for(let T=0,C=N.length;T<C;T++){const I=N[T],H=g(I),z=_%S;z!==0&&S-z<H.boundary&&(_+=S-z),P.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=_,_+=H.storage}}}const w=_%S;return w>0&&(_+=S-w),d.__size=_,d.__cache={},this}function g(d){const M={boundary:0,storage:0};return typeof d=="number"||typeof d=="boolean"?(M.boundary=4,M.storage=4):d.isVector2?(M.boundary=8,M.storage=8):d.isVector3||d.isColor?(M.boundary=16,M.storage=12):d.isVector4?(M.boundary=16,M.storage=16):d.isMatrix3?(M.boundary=48,M.storage=48):d.isMatrix4?(M.boundary=64,M.storage=64):d.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",d),M}function x(d){const M=d.target;M.removeEventListener("dispose",x);const _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),s.deleteBuffer(i[M.id]),delete i[M.id],delete o[M.id]}function p(){for(const d in i)s.deleteBuffer(i[d]);a=[],i={},o={}}return{bind:l,update:c,dispose:p}}class ru{constructor(t={}){const{canvas:e=ed(),context:n=null,depth:i=!0,stencil:o=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let u;n!==null?u=n.getContextAttributes().alpha:u=a;const m=new Uint32Array(4),v=new Int32Array(4);let g=null,x=null;const p=[],d=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ue,this._useLegacyLights=!1,this.toneMapping=ci,this.toneMappingExposure=1;const M=this;let _=!1,S=0,w=0,b=null,A=-1,y=null;const E=new pe,R=new pe;let P=null;const N=new Dt(0);let T=0,C=e.width,I=e.height,H=1,z=null,O=null;const k=new pe(0,0,C,I),q=new pe(0,0,C,I);let K=!1;const L=new Rs;let B=!1,G=!1,$=null;const Q=new te,st=new Ut,j=new W,X={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ot(){return b===null?H:1}let V=n;function xt(F,J){for(let it=0;it<F.length;it++){const nt=F[it],et=e.getContext(nt,J);if(et!==null)return et}return null}try{const F={alpha:!0,depth:i,stencil:o,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Zr}`),e.addEventListener("webglcontextlost",Mt,!1),e.addEventListener("webglcontextrestored",Y,!1),e.addEventListener("webglcontextcreationerror",St,!1),V===null){const J=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&J.shift(),V=xt(J,F),V===null)throw xt(J)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&V instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),V.getShaderPrecisionFormat===void 0&&(V.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(F){throw console.error("THREE.WebGLRenderer: "+F.message),F}let pt,vt,mt,Nt,rt,U,D,Z,ct,lt,dt,At,yt,gt,Ct,zt,ht,ee,Wt,Ot,Pt,ft,bt,Jt;function re(){pt=new vm(V),vt=new fm(V,pt,t),pt.init(vt),ft=new i1(V,pt,vt),mt=new e1(V,pt,vt),Nt=new ym(V),rt=new Hg,U=new n1(V,pt,mt,rt,vt,ft,Nt),D=new pm(M),Z=new xm(M),ct=new Rd(V,vt),bt=new hm(V,pt,ct,vt),lt=new Mm(V,ct,Nt,bt),dt=new Em(V,lt,ct,Nt),Wt=new Sm(V,vt,U),zt=new dm(rt),At=new Bg(M,D,Z,pt,vt,bt,zt),yt=new r1(M,rt),gt=new Wg,Ct=new $g(pt,vt),ee=new cm(M,D,Z,mt,dt,u,l),ht=new t1(M,dt,vt),Jt=new l1(V,Nt,vt,mt),Ot=new um(V,pt,Nt,vt),Pt=new _m(V,pt,Nt,vt),Nt.programs=At.programs,M.capabilities=vt,M.extensions=pt,M.properties=rt,M.renderLists=gt,M.shadowMap=ht,M.state=mt,M.info=Nt}re();const Xt=new a1(M,V);this.xr=Xt,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const F=pt.get("WEBGL_lose_context");F&&F.loseContext()},this.forceContextRestore=function(){const F=pt.get("WEBGL_lose_context");F&&F.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(F){F!==void 0&&(H=F,this.setSize(C,I,!1))},this.getSize=function(F){return F.set(C,I)},this.setSize=function(F,J,it=!0){if(Xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=F,I=J,e.width=Math.floor(F*H),e.height=Math.floor(J*H),it===!0&&(e.style.width=F+"px",e.style.height=J+"px"),this.setViewport(0,0,F,J)},this.getDrawingBufferSize=function(F){return F.set(C*H,I*H).floor()},this.setDrawingBufferSize=function(F,J,it){C=F,I=J,H=it,e.width=Math.floor(F*it),e.height=Math.floor(J*it),this.setViewport(0,0,F,J)},this.getCurrentViewport=function(F){return F.copy(E)},this.getViewport=function(F){return F.copy(k)},this.setViewport=function(F,J,it,nt){F.isVector4?k.set(F.x,F.y,F.z,F.w):k.set(F,J,it,nt),mt.viewport(E.copy(k).multiplyScalar(H).floor())},this.getScissor=function(F){return F.copy(q)},this.setScissor=function(F,J,it,nt){F.isVector4?q.set(F.x,F.y,F.z,F.w):q.set(F,J,it,nt),mt.scissor(R.copy(q).multiplyScalar(H).floor())},this.getScissorTest=function(){return K},this.setScissorTest=function(F){mt.setScissorTest(K=F)},this.setOpaqueSort=function(F){z=F},this.setTransparentSort=function(F){O=F},this.getClearColor=function(F){return F.copy(ee.getClearColor())},this.setClearColor=function(){ee.setClearColor.apply(ee,arguments)},this.getClearAlpha=function(){return ee.getClearAlpha()},this.setClearAlpha=function(){ee.setClearAlpha.apply(ee,arguments)},this.clear=function(F=!0,J=!0,it=!0){let nt=0;if(F){let et=!1;if(b!==null){const Tt=b.texture.format;et=Tt===Bh||Tt===Oh||Tt===Nh}if(et){const Tt=b.texture.type,Rt=Tt===cn||Tt===Xn||Tt===Jr||Tt===Ei||Tt===Ih||Tt===Uh,kt=ee.getClearColor(),Bt=ee.getClearAlpha(),$t=kt.r,Vt=kt.g,jt=kt.b;Rt?(m[0]=$t,m[1]=Vt,m[2]=jt,m[3]=Bt,V.clearBufferuiv(V.COLOR,0,m)):(v[0]=$t,v[1]=Vt,v[2]=jt,v[3]=Bt,V.clearBufferiv(V.COLOR,0,v))}else nt|=V.COLOR_BUFFER_BIT}J&&(nt|=V.DEPTH_BUFFER_BIT),it&&(nt|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(nt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Mt,!1),e.removeEventListener("webglcontextrestored",Y,!1),e.removeEventListener("webglcontextcreationerror",St,!1),gt.dispose(),Ct.dispose(),rt.dispose(),D.dispose(),Z.dispose(),dt.dispose(),bt.dispose(),Jt.dispose(),At.dispose(),Xt.dispose(),Xt.removeEventListener("sessionstart",me),Xt.removeEventListener("sessionend",ne),$&&($.dispose(),$=null),Pe.stop()};function Mt(F){F.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function Y(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;const F=Nt.autoReset,J=ht.enabled,it=ht.autoUpdate,nt=ht.needsUpdate,et=ht.type;re(),Nt.autoReset=F,ht.enabled=J,ht.autoUpdate=it,ht.needsUpdate=nt,ht.type=et}function St(F){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",F.statusMessage)}function Et(F){const J=F.target;J.removeEventListener("dispose",Et),Ft(J)}function Ft(F){Lt(F),rt.remove(F)}function Lt(F){const J=rt.get(F).programs;J!==void 0&&(J.forEach(function(it){At.releaseProgram(it)}),F.isShaderMaterial&&At.releaseShaderCache(F))}this.renderBufferDirect=function(F,J,it,nt,et,Tt){J===null&&(J=X);const Rt=et.isMesh&&et.matrixWorld.determinant()<0,kt=po(F,J,it,nt,et);mt.setMaterial(nt,Rt);let Bt=it.index,$t=1;if(nt.wireframe===!0){if(Bt=lt.getWireframeAttribute(it),Bt===void 0)return;$t=2}const Vt=it.drawRange,jt=it.attributes.position;let Ee=Vt.start*$t,on=(Vt.start+Vt.count)*$t;Tt!==null&&(Ee=Math.max(Ee,Tt.start*$t),on=Math.min(on,(Tt.start+Tt.count)*$t)),Bt!==null?(Ee=Math.max(Ee,0),on=Math.min(on,Bt.count)):jt!=null&&(Ee=Math.max(Ee,0),on=Math.min(on,jt.count));const ze=on-Ee;if(ze<0||ze===1/0)return;bt.setup(et,nt,kt,it,Bt);let Dn,ve=Ot;if(Bt!==null&&(Dn=ct.get(Bt),ve=Pt,ve.setIndex(Dn)),et.isMesh)nt.wireframe===!0?(mt.setLineWidth(nt.wireframeLinewidth*ot()),ve.setMode(V.LINES)):ve.setMode(V.TRIANGLES);else if(et.isLine){let Kt=nt.linewidth;Kt===void 0&&(Kt=1),mt.setLineWidth(Kt*ot()),et.isLineSegments?ve.setMode(V.LINES):et.isLineLoop?ve.setMode(V.LINE_LOOP):ve.setMode(V.LINE_STRIP)}else et.isPoints?ve.setMode(V.POINTS):et.isSprite&&ve.setMode(V.TRIANGLES);if(et.isBatchedMesh)ve.renderMultiDraw(et._multiDrawStarts,et._multiDrawCounts,et._multiDrawCount);else if(et.isInstancedMesh)ve.renderInstances(Ee,ze,et.count);else if(it.isInstancedBufferGeometry){const Kt=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,Aa=Math.min(it.instanceCount,Kt);ve.renderInstances(Ee,ze,Aa)}else ve.render(Ee,ze)};function Qt(F,J,it){F.transparent===!0&&F.side===tn&&F.forceSinglePass===!1?(F.side=$e,F.needsUpdate=!0,Ni(F,J,it),F.side=Zn,F.needsUpdate=!0,Ni(F,J,it),F.side=tn):Ni(F,J,it)}this.compile=function(F,J,it=null){it===null&&(it=F),x=Ct.get(it),x.init(),d.push(x),it.traverseVisible(function(et){et.isLight&&et.layers.test(J.layers)&&(x.pushLight(et),et.castShadow&&x.pushShadow(et))}),F!==it&&F.traverseVisible(function(et){et.isLight&&et.layers.test(J.layers)&&(x.pushLight(et),et.castShadow&&x.pushShadow(et))}),x.setupLights(M._useLegacyLights);const nt=new Set;return F.traverse(function(et){const Tt=et.material;if(Tt)if(Array.isArray(Tt))for(let Rt=0;Rt<Tt.length;Rt++){const kt=Tt[Rt];Qt(kt,it,et),nt.add(kt)}else Qt(Tt,it,et),nt.add(Tt)}),d.pop(),x=null,nt},this.compileAsync=function(F,J,it=null){const nt=this.compile(F,J,it);return new Promise(et=>{function Tt(){if(nt.forEach(function(Rt){rt.get(Rt).currentProgram.isReady()&&nt.delete(Rt)}),nt.size===0){et(F);return}setTimeout(Tt,10)}pt.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let se=null;function Ae(F){se&&se(F)}function me(){Pe.stop()}function ne(){Pe.start()}const Pe=new eu;Pe.setAnimationLoop(Ae),typeof self<"u"&&Pe.setContext(self),this.setAnimationLoop=function(F){se=F,Xt.setAnimationLoop(F),F===null?Pe.stop():Pe.start()},Xt.addEventListener("sessionstart",me),Xt.addEventListener("sessionend",ne),this.render=function(F,J){if(J!==void 0&&J.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),J.parent===null&&J.matrixWorldAutoUpdate===!0&&J.updateMatrixWorld(),Xt.enabled===!0&&Xt.isPresenting===!0&&(Xt.cameraAutoUpdate===!0&&Xt.updateCamera(J),J=Xt.getCamera()),F.isScene===!0&&F.onBeforeRender(M,F,J,b),x=Ct.get(F,d.length),x.init(),d.push(x),Q.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),L.setFromProjectionMatrix(Q),G=this.localClippingEnabled,B=zt.init(this.clippingPlanes,G),g=gt.get(F,p.length),g.init(),p.push(g),Ne(F,J,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(z,O),this.info.render.frame++,B===!0&&zt.beginShadows();const it=x.state.shadowsArray;if(ht.render(it,F,J),B===!0&&zt.endShadows(),this.info.autoReset===!0&&this.info.reset(),ee.render(g,F),x.setupLights(M._useLegacyLights),J.isArrayCamera){const nt=J.cameras;for(let et=0,Tt=nt.length;et<Tt;et++){const Rt=nt[et];Fi(g,F,Rt,Rt.viewport)}}else Fi(g,F,J);b!==null&&(U.updateMultisampleRenderTarget(b),U.updateRenderTargetMipmap(b)),F.isScene===!0&&F.onAfterRender(M,F,J),bt.resetDefaultState(),A=-1,y=null,d.pop(),d.length>0?x=d[d.length-1]:x=null,p.pop(),p.length>0?g=p[p.length-1]:g=null};function Ne(F,J,it,nt){if(F.visible===!1)return;if(F.layers.test(J.layers)){if(F.isGroup)it=F.renderOrder;else if(F.isLOD)F.autoUpdate===!0&&F.update(J);else if(F.isLight)x.pushLight(F),F.castShadow&&x.pushShadow(F);else if(F.isSprite){if(!F.frustumCulled||L.intersectsSprite(F)){nt&&j.setFromMatrixPosition(F.matrixWorld).applyMatrix4(Q);const Rt=dt.update(F),kt=F.material;kt.visible&&g.push(F,Rt,kt,it,j.z,null)}}else if((F.isMesh||F.isLine||F.isPoints)&&(!F.frustumCulled||L.intersectsObject(F))){const Rt=dt.update(F),kt=F.material;if(nt&&(F.boundingSphere!==void 0?(F.boundingSphere===null&&F.computeBoundingSphere(),j.copy(F.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),j.copy(Rt.boundingSphere.center)),j.applyMatrix4(F.matrixWorld).applyMatrix4(Q)),Array.isArray(kt)){const Bt=Rt.groups;for(let $t=0,Vt=Bt.length;$t<Vt;$t++){const jt=Bt[$t],Ee=kt[jt.materialIndex];Ee&&Ee.visible&&g.push(F,Rt,Ee,it,j.z,jt)}}else kt.visible&&g.push(F,Rt,kt,it,j.z,null)}}const Tt=F.children;for(let Rt=0,kt=Tt.length;Rt<kt;Rt++)Ne(Tt[Rt],J,it,nt)}function Fi(F,J,it,nt){const et=F.opaque,Tt=F.transmissive,Rt=F.transparent;x.setupLightsView(it),B===!0&&zt.setGlobalState(M.clippingPlanes,it),Tt.length>0&&Mn(et,Tt,J,it),nt&&mt.viewport(E.copy(nt)),et.length>0&&Ii(et,J,it),Tt.length>0&&Ii(Tt,J,it),Rt.length>0&&Ii(Rt,J,it),mt.buffers.depth.setTest(!0),mt.buffers.depth.setMask(!0),mt.buffers.color.setMask(!0),mt.setPolygonOffset(!1)}function Mn(F,J,it,nt){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;const Tt=vt.isWebGL2;$===null&&($=new hn(1,1,{generateMipmaps:!0,type:pt.has("EXT_color_buffer_half_float")?Jn:cn,minFilter:Li,samples:Tt?4:0})),M.getDrawingBufferSize(st),Tt?$.setSize(st.x,st.y):$.setSize(da(st.x),da(st.y));const Rt=M.getRenderTarget();M.setRenderTarget($),M.getClearColor(N),T=M.getClearAlpha(),T<1&&M.setClearColor(16777215,.5),M.clear();const kt=M.toneMapping;M.toneMapping=ci,Ii(F,it,nt),U.updateMultisampleRenderTarget($),U.updateRenderTargetMipmap($);let Bt=!1;for(let $t=0,Vt=J.length;$t<Vt;$t++){const jt=J[$t],Ee=jt.object,on=jt.geometry,ze=jt.material,Dn=jt.group;if(ze.side===tn&&Ee.layers.test(nt.layers)){const ve=ze.side;ze.side=$e,ze.needsUpdate=!0,Ui(Ee,it,nt,on,ze,Dn),ze.side=ve,ze.needsUpdate=!0,Bt=!0}}Bt===!0&&(U.updateMultisampleRenderTarget($),U.updateRenderTargetMipmap($)),M.setRenderTarget(Rt),M.setClearColor(N,T),M.toneMapping=kt}function Ii(F,J,it){const nt=J.isScene===!0?J.overrideMaterial:null;for(let et=0,Tt=F.length;et<Tt;et++){const Rt=F[et],kt=Rt.object,Bt=Rt.geometry,$t=nt===null?Rt.material:nt,Vt=Rt.group;kt.layers.test(it.layers)&&Ui(kt,J,it,Bt,$t,Vt)}}function Ui(F,J,it,nt,et,Tt){F.onBeforeRender(M,J,it,nt,et,Tt),F.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,F.matrixWorld),F.normalMatrix.getNormalMatrix(F.modelViewMatrix),et.onBeforeRender(M,J,it,nt,F,Tt),et.transparent===!0&&et.side===tn&&et.forceSinglePass===!1?(et.side=$e,et.needsUpdate=!0,M.renderBufferDirect(it,J,nt,et,F,Tt),et.side=Zn,et.needsUpdate=!0,M.renderBufferDirect(it,J,nt,et,F,Tt),et.side=tn):M.renderBufferDirect(it,J,nt,et,F,Tt),F.onAfterRender(M,J,it,nt,et,Tt)}function Ni(F,J,it){J.isScene!==!0&&(J=X);const nt=rt.get(F),et=x.state.lights,Tt=x.state.shadowsArray,Rt=et.state.version,kt=At.getParameters(F,et.state,Tt,J,it),Bt=At.getProgramCacheKey(kt);let $t=nt.programs;nt.environment=F.isMeshStandardMaterial?J.environment:null,nt.fog=J.fog,nt.envMap=(F.isMeshStandardMaterial?Z:D).get(F.envMap||nt.environment),$t===void 0&&(F.addEventListener("dispose",Et),$t=new Map,nt.programs=$t);let Vt=$t.get(Bt);if(Vt!==void 0){if(nt.currentProgram===Vt&&nt.lightsStateVersion===Rt)return Cn(F,kt),Vt}else kt.uniforms=At.getUniforms(F),F.onBuild(it,kt,M),F.onBeforeCompile(kt,M),Vt=At.acquireProgram(kt,Bt),$t.set(Bt,Vt),nt.uniforms=kt.uniforms;const jt=nt.uniforms;return(!F.isShaderMaterial&&!F.isRawShaderMaterial||F.clipping===!0)&&(jt.clippingPlanes=zt.uniform),Cn(F,kt),nt.needsLights=It(F),nt.lightsStateVersion=Rt,nt.needsLights&&(jt.ambientLightColor.value=et.state.ambient,jt.lightProbe.value=et.state.probe,jt.directionalLights.value=et.state.directional,jt.directionalLightShadows.value=et.state.directionalShadow,jt.spotLights.value=et.state.spot,jt.spotLightShadows.value=et.state.spotShadow,jt.rectAreaLights.value=et.state.rectArea,jt.ltc_1.value=et.state.rectAreaLTC1,jt.ltc_2.value=et.state.rectAreaLTC2,jt.pointLights.value=et.state.point,jt.pointLightShadows.value=et.state.pointShadow,jt.hemisphereLights.value=et.state.hemi,jt.directionalShadowMap.value=et.state.directionalShadowMap,jt.directionalShadowMatrix.value=et.state.directionalShadowMatrix,jt.spotShadowMap.value=et.state.spotShadowMap,jt.spotLightMatrix.value=et.state.spotLightMatrix,jt.spotLightMap.value=et.state.spotLightMap,jt.pointShadowMap.value=et.state.pointShadowMap,jt.pointShadowMatrix.value=et.state.pointShadowMatrix),nt.currentProgram=Vt,nt.uniformsList=null,Vt}function Ls(F){if(F.uniformsList===null){const J=F.currentProgram.getUniforms();F.uniformsList=ea.seqWithValue(J.seq,F.uniforms)}return F.uniformsList}function Cn(F,J){const it=rt.get(F);it.outputColorSpace=J.outputColorSpace,it.batching=J.batching,it.instancing=J.instancing,it.instancingColor=J.instancingColor,it.skinning=J.skinning,it.morphTargets=J.morphTargets,it.morphNormals=J.morphNormals,it.morphColors=J.morphColors,it.morphTargetsCount=J.morphTargetsCount,it.numClippingPlanes=J.numClippingPlanes,it.numIntersection=J.numClipIntersection,it.vertexAlphas=J.vertexAlphas,it.vertexTangents=J.vertexTangents,it.toneMapping=J.toneMapping}function po(F,J,it,nt,et){J.isScene!==!0&&(J=X),U.resetTextureUnits();const Tt=J.fog,Rt=nt.isMeshStandardMaterial?J.environment:null,kt=b===null?M.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:Qn,Bt=(nt.isMeshStandardMaterial?Z:D).get(nt.envMap||Rt),$t=nt.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,Vt=!!it.attributes.tangent&&(!!nt.normalMap||nt.anisotropy>0),jt=!!it.morphAttributes.position,Ee=!!it.morphAttributes.normal,on=!!it.morphAttributes.color;let ze=ci;nt.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(ze=M.toneMapping);const Dn=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,ve=Dn!==void 0?Dn.length:0,Kt=rt.get(nt),Aa=x.state.lights;if(B===!0&&(G===!0||F!==y)){const un=F===y&&nt.id===A;zt.setState(nt,F,un)}let ye=!1;nt.version===Kt.__version?(Kt.needsLights&&Kt.lightsStateVersion!==Aa.state.version||Kt.outputColorSpace!==kt||et.isBatchedMesh&&Kt.batching===!1||!et.isBatchedMesh&&Kt.batching===!0||et.isInstancedMesh&&Kt.instancing===!1||!et.isInstancedMesh&&Kt.instancing===!0||et.isSkinnedMesh&&Kt.skinning===!1||!et.isSkinnedMesh&&Kt.skinning===!0||et.isInstancedMesh&&Kt.instancingColor===!0&&et.instanceColor===null||et.isInstancedMesh&&Kt.instancingColor===!1&&et.instanceColor!==null||Kt.envMap!==Bt||nt.fog===!0&&Kt.fog!==Tt||Kt.numClippingPlanes!==void 0&&(Kt.numClippingPlanes!==zt.numPlanes||Kt.numIntersection!==zt.numIntersection)||Kt.vertexAlphas!==$t||Kt.vertexTangents!==Vt||Kt.morphTargets!==jt||Kt.morphNormals!==Ee||Kt.morphColors!==on||Kt.toneMapping!==ze||vt.isWebGL2===!0&&Kt.morphTargetsCount!==ve)&&(ye=!0):(ye=!0,Kt.__version=nt.version);let ui=Kt.currentProgram;ye===!0&&(ui=Ni(nt,J,et));let ml=!1,ks=!1,Ca=!1;const Oe=ui.getUniforms(),fi=Kt.uniforms;if(mt.useProgram(ui.program)&&(ml=!0,ks=!0,Ca=!0),nt.id!==A&&(A=nt.id,ks=!0),ml||y!==F){Oe.setValue(V,"projectionMatrix",F.projectionMatrix),Oe.setValue(V,"viewMatrix",F.matrixWorldInverse);const un=Oe.map.cameraPosition;un!==void 0&&un.setValue(V,j.setFromMatrixPosition(F.matrixWorld)),vt.logarithmicDepthBuffer&&Oe.setValue(V,"logDepthBufFC",2/(Math.log(F.far+1)/Math.LN2)),(nt.isMeshPhongMaterial||nt.isMeshToonMaterial||nt.isMeshLambertMaterial||nt.isMeshBasicMaterial||nt.isMeshStandardMaterial||nt.isShaderMaterial)&&Oe.setValue(V,"isOrthographic",F.isOrthographicCamera===!0),y!==F&&(y=F,ks=!0,Ca=!0)}if(et.isSkinnedMesh){Oe.setOptional(V,et,"bindMatrix"),Oe.setOptional(V,et,"bindMatrixInverse");const un=et.skeleton;un&&(vt.floatVertexTextures?(un.boneTexture===null&&un.computeBoneTexture(),Oe.setValue(V,"boneTexture",un.boneTexture,U)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}et.isBatchedMesh&&(Oe.setOptional(V,et,"batchingTexture"),Oe.setValue(V,"batchingTexture",et._matricesTexture,U));const Ra=it.morphAttributes;if((Ra.position!==void 0||Ra.normal!==void 0||Ra.color!==void 0&&vt.isWebGL2===!0)&&Wt.update(et,it,ui),(ks||Kt.receiveShadow!==et.receiveShadow)&&(Kt.receiveShadow=et.receiveShadow,Oe.setValue(V,"receiveShadow",et.receiveShadow)),nt.isMeshGouraudMaterial&&nt.envMap!==null&&(fi.envMap.value=Bt,fi.flipEnvMap.value=Bt.isCubeTexture&&Bt.isRenderTargetTexture===!1?-1:1),ks&&(Oe.setValue(V,"toneMappingExposure",M.toneMappingExposure),Kt.needsLights&&Ta(fi,Ca),Tt&&nt.fog===!0&&yt.refreshFogUniforms(fi,Tt),yt.refreshMaterialUniforms(fi,nt,H,I,$),ea.upload(V,Ls(Kt),fi,U)),nt.isShaderMaterial&&nt.uniformsNeedUpdate===!0&&(ea.upload(V,Ls(Kt),fi,U),nt.uniformsNeedUpdate=!1),nt.isSpriteMaterial&&Oe.setValue(V,"center",et.center),Oe.setValue(V,"modelViewMatrix",et.modelViewMatrix),Oe.setValue(V,"normalMatrix",et.normalMatrix),Oe.setValue(V,"modelMatrix",et.matrixWorld),nt.isShaderMaterial||nt.isRawShaderMaterial){const un=nt.uniformsGroups;for(let Pa=0,Nu=un.length;Pa<Nu;Pa++)if(vt.isWebGL2){const gl=un[Pa];Jt.update(gl,ui),Jt.bind(gl,ui)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ui}function Ta(F,J){F.ambientLightColor.needsUpdate=J,F.lightProbe.needsUpdate=J,F.directionalLights.needsUpdate=J,F.directionalLightShadows.needsUpdate=J,F.pointLights.needsUpdate=J,F.pointLightShadows.needsUpdate=J,F.spotLights.needsUpdate=J,F.spotLightShadows.needsUpdate=J,F.rectAreaLights.needsUpdate=J,F.hemisphereLights.needsUpdate=J}function It(F){return F.isMeshLambertMaterial||F.isMeshToonMaterial||F.isMeshPhongMaterial||F.isMeshStandardMaterial||F.isShadowMaterial||F.isShaderMaterial&&F.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(F,J,it){rt.get(F.texture).__webglTexture=J,rt.get(F.depthTexture).__webglTexture=it;const nt=rt.get(F);nt.__hasExternalTextures=!0,nt.__hasExternalTextures&&(nt.__autoAllocateDepthBuffer=it===void 0,nt.__autoAllocateDepthBuffer||pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),nt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(F,J){const it=rt.get(F);it.__webglFramebuffer=J,it.__useDefaultFramebuffer=J===void 0},this.setRenderTarget=function(F,J=0,it=0){b=F,S=J,w=it;let nt=!0,et=null,Tt=!1,Rt=!1;if(F){const Bt=rt.get(F);Bt.__useDefaultFramebuffer!==void 0?(mt.bindFramebuffer(V.FRAMEBUFFER,null),nt=!1):Bt.__webglFramebuffer===void 0?U.setupRenderTarget(F):Bt.__hasExternalTextures&&U.rebindTextures(F,rt.get(F.texture).__webglTexture,rt.get(F.depthTexture).__webglTexture);const $t=F.texture;($t.isData3DTexture||$t.isDataArrayTexture||$t.isCompressedArrayTexture)&&(Rt=!0);const Vt=rt.get(F).__webglFramebuffer;F.isWebGLCubeRenderTarget?(Array.isArray(Vt[J])?et=Vt[J][it]:et=Vt[J],Tt=!0):vt.isWebGL2&&F.samples>0&&U.useMultisampledRTT(F)===!1?et=rt.get(F).__webglMultisampledFramebuffer:Array.isArray(Vt)?et=Vt[it]:et=Vt,E.copy(F.viewport),R.copy(F.scissor),P=F.scissorTest}else E.copy(k).multiplyScalar(H).floor(),R.copy(q).multiplyScalar(H).floor(),P=K;if(mt.bindFramebuffer(V.FRAMEBUFFER,et)&&vt.drawBuffers&&nt&&mt.drawBuffers(F,et),mt.viewport(E),mt.scissor(R),mt.setScissorTest(P),Tt){const Bt=rt.get(F.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+J,Bt.__webglTexture,it)}else if(Rt){const Bt=rt.get(F.texture),$t=J||0;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,Bt.__webglTexture,it||0,$t)}A=-1},this.readRenderTargetPixels=function(F,J,it,nt,et,Tt,Rt){if(!(F&&F.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let kt=rt.get(F).__webglFramebuffer;if(F.isWebGLCubeRenderTarget&&Rt!==void 0&&(kt=kt[Rt]),kt){mt.bindFramebuffer(V.FRAMEBUFFER,kt);try{const Bt=F.texture,$t=Bt.format,Vt=Bt.type;if($t!==Ve&&ft.convert($t)!==V.getParameter(V.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const jt=Vt===Jn&&(pt.has("EXT_color_buffer_half_float")||vt.isWebGL2&&pt.has("EXT_color_buffer_float"));if(Vt!==cn&&ft.convert(Vt)!==V.getParameter(V.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Vt===An&&(vt.isWebGL2||pt.has("OES_texture_float")||pt.has("WEBGL_color_buffer_float")))&&!jt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}J>=0&&J<=F.width-nt&&it>=0&&it<=F.height-et&&V.readPixels(J,it,nt,et,ft.convert($t),ft.convert(Vt),Tt)}finally{const Bt=b!==null?rt.get(b).__webglFramebuffer:null;mt.bindFramebuffer(V.FRAMEBUFFER,Bt)}}},this.copyFramebufferToTexture=function(F,J,it=0){const nt=Math.pow(2,-it),et=Math.floor(J.image.width*nt),Tt=Math.floor(J.image.height*nt);U.setTexture2D(J,0),V.copyTexSubImage2D(V.TEXTURE_2D,it,0,0,F.x,F.y,et,Tt),mt.unbindTexture()},this.copyTextureToTexture=function(F,J,it,nt=0){const et=J.image.width,Tt=J.image.height,Rt=ft.convert(it.format),kt=ft.convert(it.type);U.setTexture2D(it,0),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,it.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,it.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,it.unpackAlignment),J.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,nt,F.x,F.y,et,Tt,Rt,kt,J.image.data):J.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,nt,F.x,F.y,J.mipmaps[0].width,J.mipmaps[0].height,Rt,J.mipmaps[0].data):V.texSubImage2D(V.TEXTURE_2D,nt,F.x,F.y,Rt,kt,J.image),nt===0&&it.generateMipmaps&&V.generateMipmap(V.TEXTURE_2D),mt.unbindTexture()},this.copyTextureToTexture3D=function(F,J,it,nt,et=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Tt=F.max.x-F.min.x+1,Rt=F.max.y-F.min.y+1,kt=F.max.z-F.min.z+1,Bt=ft.convert(nt.format),$t=ft.convert(nt.type);let Vt;if(nt.isData3DTexture)U.setTexture3D(nt,0),Vt=V.TEXTURE_3D;else if(nt.isDataArrayTexture||nt.isCompressedArrayTexture)U.setTexture2DArray(nt,0),Vt=V.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,nt.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,nt.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,nt.unpackAlignment);const jt=V.getParameter(V.UNPACK_ROW_LENGTH),Ee=V.getParameter(V.UNPACK_IMAGE_HEIGHT),on=V.getParameter(V.UNPACK_SKIP_PIXELS),ze=V.getParameter(V.UNPACK_SKIP_ROWS),Dn=V.getParameter(V.UNPACK_SKIP_IMAGES),ve=it.isCompressedTexture?it.mipmaps[et]:it.image;V.pixelStorei(V.UNPACK_ROW_LENGTH,ve.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,ve.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,F.min.x),V.pixelStorei(V.UNPACK_SKIP_ROWS,F.min.y),V.pixelStorei(V.UNPACK_SKIP_IMAGES,F.min.z),it.isDataTexture||it.isData3DTexture?V.texSubImage3D(Vt,et,J.x,J.y,J.z,Tt,Rt,kt,Bt,$t,ve.data):it.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),V.compressedTexSubImage3D(Vt,et,J.x,J.y,J.z,Tt,Rt,kt,Bt,ve.data)):V.texSubImage3D(Vt,et,J.x,J.y,J.z,Tt,Rt,kt,Bt,$t,ve),V.pixelStorei(V.UNPACK_ROW_LENGTH,jt),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Ee),V.pixelStorei(V.UNPACK_SKIP_PIXELS,on),V.pixelStorei(V.UNPACK_SKIP_ROWS,ze),V.pixelStorei(V.UNPACK_SKIP_IMAGES,Dn),et===0&&nt.generateMipmaps&&V.generateMipmap(Vt),mt.unbindTexture()},this.initTexture=function(F){F.isCubeTexture?U.setTextureCube(F,0):F.isData3DTexture?U.setTexture3D(F,0):F.isDataArrayTexture||F.isCompressedArrayTexture?U.setTexture2DArray(F,0):U.setTexture2D(F,0),mt.unbindTexture()},this.resetState=function(){S=0,w=0,b=null,mt.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Qr?"display-p3":"srgb",e.unpackColorSpace=ce.workingColorSpace===_a?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ue?Ai:Gh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Ai?Ue:Qn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class c1 extends ru{}c1.prototype.isWebGL1Renderer=!0;class Es extends sn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class hi extends nn{constructor(t=null,e=1,n=1,i,o,a,r,l,c=Me,h=Me,f,u){super(null,a,r,l,c,h,i,o,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class $n extends oe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const es=new te,Uc=new te,Uo=[],Nc=new kn,h1=new te,Us=new ae,Ns=new zi;class to extends ae{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new $n(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,h1)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new kn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,es),Nc.copy(t.boundingBox).applyMatrix4(es),this.boundingBox.union(Nc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new zi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,es),Ns.copy(t.boundingSphere).applyMatrix4(es),this.boundingSphere.union(Ns)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Us.geometry=this.geometry,Us.material=this.material,Us.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ns.copy(this.boundingSphere),Ns.applyMatrix4(n),t.ray.intersectsSphere(Ns)!==!1))for(let o=0;o<i;o++){this.getMatrixAt(o,es),Uc.multiplyMatrices(n,es),Us.matrixWorld=Uc,Us.raycast(t,Uo);for(let a=0,r=Uo.length;a<r;a++){const l=Uo[a];l.instanceId=o,l.object=this,e.push(l)}Uo.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new $n(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class u1 extends ho{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Dt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Oc=new te,Or=new el,No=new zi,Oo=new W;class lu extends sn{constructor(t=new Le,e=new u1){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,o=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),No.copy(n.boundingSphere),No.applyMatrix4(i),No.radius+=o,t.ray.intersectsSphere(No)===!1)return;Oc.copy(i).invert(),Or.copy(t.ray).applyMatrix4(Oc);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=n.index,f=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let v=u,g=m;v<g;v++){const x=c.getX(v);Oo.fromBufferAttribute(f,x),Bc(Oo,x,l,i,t,e,this)}}else{const u=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let v=u,g=m;v<g;v++)Oo.fromBufferAttribute(f,v),Bc(Oo,v,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function Bc(s,t,e,n,i,o,a){const r=Or.distanceSqToPoint(s);if(r<e){const l=new W;Or.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;o.push({distance:c,distanceToRay:Math.sqrt(r),point:l,index:t,face:null,object:a})}}class al extends Le{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const o=[],a=[];r(i),c(n),h(),this.setAttribute("position",new xe(o,3)),this.setAttribute("normal",new xe(o.slice(),3)),this.setAttribute("uv",new xe(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function r(d){const M=new W,_=new W,S=new W;for(let w=0;w<e.length;w+=3)m(e[w+0],M),m(e[w+1],_),m(e[w+2],S),l(M,_,S,d)}function l(d,M,_,S){const w=S+1,b=[];for(let A=0;A<=w;A++){b[A]=[];const y=d.clone().lerp(_,A/w),E=M.clone().lerp(_,A/w),R=w-A;for(let P=0;P<=R;P++)P===0&&A===w?b[A][P]=y:b[A][P]=y.clone().lerp(E,P/R)}for(let A=0;A<w;A++)for(let y=0;y<2*(w-A)-1;y++){const E=Math.floor(y/2);y%2===0?(u(b[A][E+1]),u(b[A+1][E]),u(b[A][E])):(u(b[A][E+1]),u(b[A+1][E+1]),u(b[A+1][E]))}}function c(d){const M=new W;for(let _=0;_<o.length;_+=3)M.x=o[_+0],M.y=o[_+1],M.z=o[_+2],M.normalize().multiplyScalar(d),o[_+0]=M.x,o[_+1]=M.y,o[_+2]=M.z}function h(){const d=new W;for(let M=0;M<o.length;M+=3){d.x=o[M+0],d.y=o[M+1],d.z=o[M+2];const _=x(d)/2/Math.PI+.5,S=p(d)/Math.PI+.5;a.push(_,1-S)}v(),f()}function f(){for(let d=0;d<a.length;d+=6){const M=a[d+0],_=a[d+2],S=a[d+4],w=Math.max(M,_,S),b=Math.min(M,_,S);w>.9&&b<.1&&(M<.2&&(a[d+0]+=1),_<.2&&(a[d+2]+=1),S<.2&&(a[d+4]+=1))}}function u(d){o.push(d.x,d.y,d.z)}function m(d,M){const _=d*3;M.x=t[_+0],M.y=t[_+1],M.z=t[_+2]}function v(){const d=new W,M=new W,_=new W,S=new W,w=new Ut,b=new Ut,A=new Ut;for(let y=0,E=0;y<o.length;y+=9,E+=6){d.set(o[y+0],o[y+1],o[y+2]),M.set(o[y+3],o[y+4],o[y+5]),_.set(o[y+6],o[y+7],o[y+8]),w.set(a[E+0],a[E+1]),b.set(a[E+2],a[E+3]),A.set(a[E+4],a[E+5]),S.copy(d).add(M).add(_).divideScalar(3);const R=x(S);g(w,E+0,d,R),g(b,E+2,M,R),g(A,E+4,_,R)}}function g(d,M,_,S){S<0&&d.x===1&&(a[M]=d.x-1),_.x===0&&_.z===0&&(a[M]=S/2/Math.PI+.5)}function x(d){return Math.atan2(d.z,-d.x)}function p(d){return Math.atan2(-d.y,Math.sqrt(d.x*d.x+d.z*d.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new al(t.vertices,t.indices,t.radius,t.details)}}const f1={triangulate:function(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let o=cu(s,0,i,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,l,c,h,f,u,m;if(n&&(o=x1(s,t,o,e)),s.length>80*e){r=c=s[0],l=h=s[1];for(let v=e;v<i;v+=e)f=s[v],u=s[v+1],f<r&&(r=f),u<l&&(l=u),f>c&&(c=f),u>h&&(h=u);m=Math.max(c-r,h-l),m=m!==0?32767/m:0}return io(o,a,e,r,l,m,0),a}};function cu(s,t,e,n,i){let o,a;if(i===C1(s,t,e,n)>0)for(o=t;o<e;o+=n)a=Hc(o,s[o],s[o+1],a);else for(o=e-n;o>=t;o-=n)a=Hc(o,s[o],s[o+1],a);return a&&wa(a,a.next)&&(oo(a),a=a.next),a}function ki(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(wa(e,e.next)||_e(e.prev,e,e.next)===0)){if(oo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function io(s,t,e,n,i,o,a){if(!s)return;!a&&o&&w1(s,n,i,o);let r=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,o?p1(s,n,i,o):d1(s)){t.push(l.i/e|0),t.push(s.i/e|0),t.push(c.i/e|0),oo(s),s=c.next,r=c.next;continue}if(s=c,s===r){a?a===1?(s=m1(ki(s),t,e),io(s,t,e,n,i,o,2)):a===2&&g1(s,t,e,n,i,o):io(ki(s),t,e,n,i,o,1);break}}}function d1(s){const t=s.prev,e=s,n=s.next;if(_e(t,e,n)>=0)return!1;const i=t.x,o=e.x,a=n.x,r=t.y,l=e.y,c=n.y,h=i<o?i<a?i:a:o<a?o:a,f=r<l?r<c?r:c:l<c?l:c,u=i>o?i>a?i:a:o>a?o:a,m=r>l?r>c?r:c:l>c?l:c;let v=n.next;for(;v!==t;){if(v.x>=h&&v.x<=u&&v.y>=f&&v.y<=m&&ps(i,r,o,l,a,c,v.x,v.y)&&_e(v.prev,v,v.next)>=0)return!1;v=v.next}return!0}function p1(s,t,e,n){const i=s.prev,o=s,a=s.next;if(_e(i,o,a)>=0)return!1;const r=i.x,l=o.x,c=a.x,h=i.y,f=o.y,u=a.y,m=r<l?r<c?r:c:l<c?l:c,v=h<f?h<u?h:u:f<u?f:u,g=r>l?r>c?r:c:l>c?l:c,x=h>f?h>u?h:u:f>u?f:u,p=Br(m,v,t,e,n),d=Br(g,x,t,e,n);let M=s.prevZ,_=s.nextZ;for(;M&&M.z>=p&&_&&_.z<=d;){if(M.x>=m&&M.x<=g&&M.y>=v&&M.y<=x&&M!==i&&M!==a&&ps(r,h,l,f,c,u,M.x,M.y)&&_e(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=m&&_.x<=g&&_.y>=v&&_.y<=x&&_!==i&&_!==a&&ps(r,h,l,f,c,u,_.x,_.y)&&_e(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=m&&M.x<=g&&M.y>=v&&M.y<=x&&M!==i&&M!==a&&ps(r,h,l,f,c,u,M.x,M.y)&&_e(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=d;){if(_.x>=m&&_.x<=g&&_.y>=v&&_.y<=x&&_!==i&&_!==a&&ps(r,h,l,f,c,u,_.x,_.y)&&_e(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function m1(s,t,e){let n=s;do{const i=n.prev,o=n.next.next;!wa(i,o)&&hu(i,n,n.next,o)&&so(i,o)&&so(o,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),oo(n),oo(n.next),n=s=o),n=n.next}while(n!==s);return ki(n)}function g1(s,t,e,n,i,o){let a=s;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&E1(a,r)){let l=uu(a,r);a=ki(a,a.next),l=ki(l,l.next),io(a,t,e,n,i,o,0),io(l,t,e,n,i,o,0);return}r=r.next}a=a.next}while(a!==s)}function x1(s,t,e,n){const i=[];let o,a,r,l,c;for(o=0,a=t.length;o<a;o++)r=t[o]*n,l=o<a-1?t[o+1]*n:s.length,c=cu(s,r,l,n,!1),c===c.next&&(c.steiner=!0),i.push(S1(c));for(i.sort(v1),o=0;o<i.length;o++)e=M1(i[o],e);return e}function v1(s,t){return s.x-t.x}function M1(s,t){const e=_1(s,t);if(!e)return t;const n=uu(e,s);return ki(n,n.next),ki(e,e.next)}function _1(s,t){let e=t,n=-1/0,i;const o=s.x,a=s.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const u=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=o&&u>n&&(n=u,i=e.x<e.next.x?e:e.next,u===o))return i}e=e.next}while(e!==t);if(!i)return null;const r=i,l=i.x,c=i.y;let h=1/0,f;e=i;do o>=e.x&&e.x>=l&&o!==e.x&&ps(a<c?o:n,a,l,c,a<c?n:o,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(o-e.x),so(e,s)&&(f<h||f===h&&(e.x>i.x||e.x===i.x&&y1(i,e)))&&(i=e,h=f)),e=e.next;while(e!==r);return i}function y1(s,t){return _e(s.prev,s,t.prev)<0&&_e(t.next,s,s.next)<0}function w1(s,t,e,n){let i=s;do i.z===0&&(i.z=Br(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,b1(i)}function b1(s){let t,e,n,i,o,a,r,l,c=1;do{for(e=s,s=null,o=null,a=0;e;){for(a++,n=e,r=0,t=0;t<c&&(r++,n=n.nextZ,!!n);t++);for(l=c;r>0||l>0&&n;)r!==0&&(l===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,r--):(i=n,n=n.nextZ,l--),o?o.nextZ=i:s=i,i.prevZ=o,o=i;e=n}o.nextZ=null,c*=2}while(a>1);return s}function Br(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function S1(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function ps(s,t,e,n,i,o,a,r){return(i-a)*(t-r)>=(s-a)*(o-r)&&(s-a)*(n-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(i-a)*(n-r)}function E1(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!T1(s,t)&&(so(s,t)&&so(t,s)&&A1(s,t)&&(_e(s.prev,s,t.prev)||_e(s,t.prev,t))||wa(s,t)&&_e(s.prev,s,s.next)>0&&_e(t.prev,t,t.next)>0)}function _e(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function wa(s,t){return s.x===t.x&&s.y===t.y}function hu(s,t,e,n){const i=Ho(_e(s,t,e)),o=Ho(_e(s,t,n)),a=Ho(_e(e,n,s)),r=Ho(_e(e,n,t));return!!(i!==o&&a!==r||i===0&&Bo(s,e,t)||o===0&&Bo(s,n,t)||a===0&&Bo(e,s,n)||r===0&&Bo(e,t,n))}function Bo(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Ho(s){return s>0?1:s<0?-1:0}function T1(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&hu(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function so(s,t){return _e(s.prev,s,s.next)<0?_e(s,t,s.next)>=0&&_e(s,s.prev,t)>=0:_e(s,t,s.prev)<0||_e(s,s.next,t)<0}function A1(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,o=(s.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&i<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function uu(s,t){const e=new Hr(s.i,s.x,s.y),n=new Hr(t.i,t.x,t.y),i=s.next,o=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Hc(s,t,e,n){const i=new Hr(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function oo(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Hr(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function C1(s,t,e,n){let i=0;for(let o=t,a=e-n;o<e;o+=n)i+=(s[a]-s[o])*(s[o+1]+s[a+1]),a=o;return i}class rl{static area(t){const e=t.length;let n=0;for(let i=e-1,o=0;o<e;i=o++)n+=t[i].x*t[o].y-t[o].x*t[i].y;return n*.5}static isClockWise(t){return rl.area(t)<0}static triangulateShape(t,e){const n=[],i=[],o=[];Gc(t),Wc(n,t);let a=t.length;e.forEach(Gc);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,Wc(n,e[l]);const r=f1.triangulate(n,i);for(let l=0;l<r.length;l+=3)o.push(r.slice(l,l+3));return o}}function Gc(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Wc(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class ll extends al{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new ll(t.radius,t.detail)}}class fu extends Le{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class R1{constructor(t,e,n=0,i=1/0){this.ray=new el(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new nl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Gr(t,this,n,e),n.sort(Vc),n}intersectObjects(t,e=!0,n=[]){for(let i=0,o=t.length;i<o;i++)Gr(t[i],this,n,e);return n.sort(Vc),n}}function Vc(s,t){return s.distance-t.distance}function Gr(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let o=0,a=i.length;o<a;o++)Gr(i[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zr);const ar=s=>Number.isInteger(s)?s.toFixed(1):String(s),qe=`
#define WORLD ${ar(qt)}
#define HALF_WORLD ${ar(qt/2)}
#define HRES ${ar(mn)}
#define Y_PER_M ${Gt}
#define PI 3.14159265
`,ti=`
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
`,vn=`
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
`,du=`
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
`,ei=`
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

${du}
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
`,pu=`
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
`,P1=`
${qe}
${vn}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[8];
uniform float uGrid;
uniform vec3 uCamPos;
// the hero falls (waterfalls.js), per fall: A lip x, z, face x, z
// (downstream); B lip metres, pool metres, the sheet's half-width, how far
// out it lands; C the length of the cut, the drop (metres), the face's
// half-width, how wet it runs now (0..1); D the amphitheatre's half-width at
// its mouth, how far its rim curls back downstream (per unit squared off the
// axis) and where it starts, the spray's reach
uniform vec4 uFallA[4];
uniform vec4 uFallB[4];
uniform vec4 uFallC[4];
uniform vec4 uFallD[4];
uniform int uFalls;
out vec3 vWorld;
out vec2 vUv;
out float vMetres;
// The nearest hero fall: where this lies in its frame (x downstream of its
// lip, y across: both linear in xz, so exact anywhere across a triangle),
// which one it is (z), and its numbers. The falls stand at least 8 units
// apart and mark the ground only within 3.5 or so of their lips, so where
// a triangle's corners pick different falls it lies far from both; the
// fragment shader tells by z not coming out whole there.
out vec3 vFall;
flat out vec4 vFallB;
flat out vec4 vFallC;
flat out vec4 vFallD;

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
  int fi = 0;
  float best = 1e12;
  for (int i = 0; i < 4; i++) {
    if (i >= uFalls) break;
    vec2 d = xz - uFallA[i].xy;
    if (dot(d, d) < best) {
      best = dot(d, d);
      fi = i;
    }
  }
  vec4 A = uFallA[fi];
  vec2 d = xz - A.xy;
  vFall = vec3(dot(d, A.zw), dot(d, vec2(-A.w, A.z)), uFalls > 0 ? float(fi) : 0.5);
  vFallB = uFallB[fi];
  vFallC = uFallC[fi];
  vFallD = uFallD[fi];
  // The sea is drawn from the height texture; the seabed under it only needs to
  // be visible in the last few centimetres at the shoreline. Sink it below that
  // so the two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  float h = mt * Y_PER_M;
  vWorld = vec3(xz.x, h, xz.y);
  vUv = worldToUv(xz);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,L1=`
${qe}
${ti}
${vn}
${ei}
${pu}
uniform sampler2D uNormal;
uniform sampler2D uLand;  // r rain (log), g sand, b riparian, a cultivation
uniform int uDebug;
in vec3 vWorld;
in vec2 vUv;
in float vMetres;
in vec3 vFall;
flat in vec4 vFallB;
flat in vec4 vFallC;
flat in vec4 vFallD;

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

// The tree crowns: voronoi() (common.glsl.js) cut to what they use, x the
// distance to the nearest cell's point and y its id, hashed once after the
// search rather than for every closer candidate along the way.
vec2 crowns(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  vec2 best = n;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 r = g + hash22(n + g) - f;
    float d = dot(r, r);
    if (d < d1) { d1 = d; best = n + g; }
  }
  return vec2(sqrt(d1), hash12(best + 3.7));
}

// The lava flows stacked in a pali (hm: height in metres). Every 30 m or so
// holds a random number of them, from one massive flow to five thin ones in a
// bunch, squeezed toward its top or its foot: x where this lies among them
// (one per unit, 0 at the cell's foot), y how many metres one of them is
// thick here, z the cell (so every flow and contact has its own number), w
// how many it holds.
vec4 flowsAt(float hm) {
  float ci = floor(hm / 30.0);
  float f = fract(hm / 30.0);
  vec2 h = hash22(vec2(ci, 2.9));
  float k = floor(1.0 + h.x * h.x * 5.0);
  float a = (h.y - 0.5) * 1.6;
  return vec4((f + a * f * (1.0 - f)) * k, 30.0 / (k * (1.0 + a * (1.0 - 2.0 * f))), ci, k);
}

// How much of the flutes on the plane across ax a pixel can hold: 0 once
// they're finer than a few pixels (dX, dY: the pixel's footprint in xz).
float fluteFade(vec2 ax, vec2 dX, vec2 dY) {
  return smoothstep(4.0, 9.0, 0.35 / max(abs(dot(dX, ax)) + abs(dot(dY, ax)), 1e-5));
}

// Flutes on one vertical plane: u runs across the face, h (metres) down it.
// Rounded ribs between sharp grooves, 20 to 100 m apart, wandering a little
// as they run down; each groove is cut deep along some stretches and barely
// at all along others, so they break up into runnels and streaks rather
// than ruling the wall like a curtain. x: how open the face is here (1 on a
// rib, toward 0 down in a groove), y: the ribs' slope across u. k: how much
// of them a pixel can hold (fluteFade); the rest is their mean, and none of
// it is worked out once they're too fine to see.
const vec2 FLUTE_MEAN = vec2(0.938, 0.0);
vec2 flutes(float u, float h, float k) {
  vec2 f = FLUTE_MEAN;
  if (k > 0.0) {
    // the wander: a 1D noise along the face that also stretches and
    // squeezes the spacing, sliding sideways as it runs down
    float wx = u * 1.3 + h * 0.0025;
    float wi = floor(wx);
    float wf = fract(wx);
    float w = mix(hash12(vec2(wi, 7.0)), hash12(vec2(wi + 1.0, 7.0)), wf * wf * (3.0 - 2.0 * wf));
    float t = u * 9.0 + 3.6 * w;
    // (|sin| as a parabola: the same rib and groove, for a fraction of the cost)
    float p = fract(t / PI);
    float a = 4.0 * p * (1.0 - p);
    // the groove's depth, changing along it every 70 m or so (keyed to the
    // groove, so it never changes across one)
    float gi = floor(t / PI + 0.5);
    float hv = h * 0.014 + gi * 0.618;
    float hvi = floor(hv);
    float hvf = fract(hv);
    float d = 0.15 + 0.85 * smoothstep(0.25, 0.75, mix(hash12(vec2(gi, hvi)), hash12(vec2(gi, hvi + 1.0)), hvf * hvf * (3.0 - 2.0 * hvf)));
    f = mix(f, vec2(1.0 - (1.0 - smoothstep(0.0, 0.4, a)) * d, d * (1.0 - 2.0 * p) * (36.0 / PI)), k);
  }
  return f;
}

// A noise on the face of a cliff itself, fourteen metres or so across:
// value noise on the two vertical planes along x and along z, with height in
// metres up both, each weighted by how squarely the face looks along it. So
// unlike anything mapped in plan it never smears down a wall, and unlike
// anything mapped across the face it never swirls as the wall turns or
// breaks where one plane hands over to the next. (Where the two blend,
// their mean is flatter than either; its contrast is put back.)
float faceNoise(vec2 xz, float hm, vec2 nxz) {
  float w = smoothstep(0.25, 0.75, nxz.x * nxz.x / max(dot(nxz, nxz), 1e-6));
  float a = vnoise(vec2(xz.y * 7.0, hm * 0.07));
  float b = vnoise(vec2(xz.x * 7.0 + 31.7, hm * 0.07 + 5.3));
  return 0.5 + (mix(b, a, w) - 0.5) * (1.0 + 1.66 * w * (1.0 - w));
}

// How the nearest hero fall marks the ground here. All of it is worked out
// per pixel on the surface as drawn, so it follows the geomorph exactly and
// never the triangles.
struct Fall {
  float spray; // its spray (0..1)
  float sheet; // the rock right behind its sheet
  float edge;  // how far out toward the fern round its amphitheatre: across
               // to the walls' rim, round the horseshoe's rim, down the cut
               // past where the water lands, up to the brink (0.8 or so at
               // the edge of the rock)
  float zone;  // whether this lies in or around the amphitheatre at all
  float hide;  // how much of the sky its walls hide here
};

Fall fallAt(float metres) {
  Fall f = Fall(0.0, 0.0, 9.0, 0.0, 0.0);
  vec4 B = vFallB;
  vec4 C = vFallC;
  vec4 D = vFallD;
  float s = vFall.x; // downstream of the lip
  float c = vFall.y; // across
  // (none of it reaches further from the lip than this, and none of it on a
  // triangle whose corners picked different falls)
  if (abs(vFall.z - floor(vFall.z + 0.5)) > 1e-3 || s * s + c * c > (C.x + 0.8) * (C.x + 0.8) + 2.5) return f;
  // the spray soaks a rounded bowl from the foot of the face out past where
  // the water lands, and half way up the wall
  float R = D.w * (0.85 + 0.35 * C.w);
  float up = (metres - B.y) / max(0.6 * C.y, 1.0);
  float q = length(vec3((s - 0.6 * B.w) / R, c / R, up < 0.0 ? up * 4.0 : up));
  f.spray = (1.0 - smoothstep(0.35, 1.0, q)) * (0.45 + 0.55 * C.w);
  // the strip right behind the sheet, from the brink down into the bowl, as
  // narrow as the tongue at the brink and spreading as the sheet does
  float down = (B.x - metres) / max(C.y, 1.0);
  float hw = B.z * (0.6 + 0.4 * C.w) * (0.45 + 0.55 * smoothstep(0.0, 0.5, down));
  f.sheet = (1.0 - smoothstep(0.75, 1.15, abs(c) / hw)) * smoothstep(-0.08, -0.02, s) * (1.0 - smoothstep(B.w, B.w + 0.15, s)) * smoothstep(0.0, 0.08, down) * (0.45 + 0.55 * C.w);
  f.spray = max(f.spray, f.sheet);
  // in or around the amphitheatre: near the horseshoe its carve cut (whose
  // rim curls back downstream either side, as carveHero cuts it), within the
  // cut's length and its flaring walls, above the pool; and a margin round
  // it all, where the fern holds the ground (no outcrops of the ordinary
  // pali's rock stand about just beyond its edge)
  float rim = s - D.z - D.y * c * c;
  float across = abs(c) / (C.z + (D.x - C.z) * clamp(s / C.x, 0.0, 1.0));
  f.zone = smoothstep(-0.9, -0.6, rim) * (1.0 - smoothstep(C.x + 0.4, C.x + 0.8, s)) * (1.0 - smoothstep(1.6, 2.0, across)) * smoothstep(B.y, B.y + 15.0, metres);
  f.edge = max(max(across / 1.25, 0.8 - (rim + 0.22) * 2.0), max((s - B.w) / 0.7, (metres - B.x + 30.0) / 30.0));
  // (and deep in it, its walls hide much of the sky)
  f.hide = 0.2 * f.zone * smoothstep(-0.3, 0.0, rim) * (1.0 - smoothstep(0.4, 1.0, across)) * smoothstep(0.1, 0.7, down);
  return f;
}

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
  vec2 dX = dFdx(xz);
  vec2 dY = dFdy(xz);
  vec2 fwXZ = abs(dX) + abs(dY);
  float px = length(fwXZ); // world units per pixel
  float fwM = fwidth(metres);
  // (fbm2's first three octaves and the fourth's mean: the fourth, 35 m
  // across, moves the rain it shifts by no more than 0.004)
  vec2 bp = xz * 0.35;
  float nBig = vnoise(bp) * 0.5;
  bp = bp * 2.03 + 17.1;
  nBig += vnoise(bp) * 0.25;
  bp = bp * 2.03 + 17.1;
  nBig += vnoise(bp) * 0.125 + 0.03125;
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
  // (the steep ground below covers this entirely on the pali, and nothing
  // mapped in plan is worth working out there)
  float steep = smoothstep(0.32, 0.62, slope);
  vec3 col = vec3(0.0);
  float nMid = 0.5;
  if (steep < 1.0) {
    nMid = fbm2(xz * 2.1 + 5.0);
    vec3 ground = mix(grassDry, grassGreen, smoothstep(0.18, 0.42, r + nMid * 0.08));
    float forest = smoothstep(0.30, 0.52, r + (nMid - 0.5) * 0.2);
    vec3 canopyC = mix(shrub, mesic, smoothstep(0.32, 0.55, r));
    canopyC = mix(canopyC, wet, smoothstep(0.55, 0.8, r));
    canopyC = mix(canopyC, cloudF, smoothstep(1150.0, 1500.0, metres));

    // tree crowns: each cell a sunlit dome, faded to an average when they'd alias
    vec2 vc = crowns(xz * 6.0);
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
    // grass: no cells, just tussocky variation at a few scales (fbm2's
    // first three octaves and the fourth's mean: the fourth, under a metre
    // across and a few per cent, is the next term's job)
    vec2 gp = xz * 18.0;
    float gF = vnoise(gp) * 0.5;
    gp = gp * 2.03 + 17.1;
    gF += vnoise(gp) * 0.25;
    gp = gp * 2.03 + 17.1;
    gF += vnoise(gp) * 0.125 + 0.03125;
    float gN = gF * 0.6 + vnoise(xz * 90.0) * 0.4 * (1.0 - smoothstep(0.004, 0.02, px));
    ground *= 0.82 + 0.36 * gN;
    col = mix(ground, canopyC, forest);

    // kula field system: low walls along the contours, rows of ʻuala mounds,
    // plots in different stages
    float field = land.a;
    if (field > 0.02) {
      float rowH = metres / 7.5;
      float plot = hash12(vec2(floor(rowH), floor(dot(xz, vec2(0.7, -0.7)) * 1.6)));
      vec3 cropC = mix(srgb(vec3(0.40, 0.48, 0.20)), srgb(vec3(0.55, 0.42, 0.25)), smoothstep(0.35, 0.75, plot));
      float mounds = (1.0 - smoothstep(0.004, 0.015, px)) * smoothstep(0.3, 0.7, vnoise(xz * 140.0));
      cropC *= 0.85 + 0.25 * mounds;
      float wallLine = 1.0 - smoothstep(0.0, 1.0, abs(fract(rowH) - 0.5) * 2.0 * 7.5 / max(fwM * 1.5, 0.6));
      col = mix(col, cropC, field * 0.85);
      col = mix(col, srgb(vec3(0.33, 0.30, 0.27)), wallLine * field * 0.8);
    }

    // dry, bare, red-earth patches on the leeward slopes
    float bare = (1.0 - smoothstep(0.08, 0.3, r)) * smoothstep(0.55, 0.75, nMid + slope * 0.6);
    col = mix(col, soil, bare * 0.7);
  }

  // --- steep ground: fern-hung pali on the wet side, rock on the dry ----------
  // Everything above is mapped in plan, which on a wall this steep stretches
  // each feature down the whole face into a smear. The pali are drawn in the
  // rock's own terms instead: lava flows stacked in height (metres need no
  // projection at all), flutes across the face, mapped on whichever vertical
  // plane the face looks along, so they run down any wall and never swirl as
  // it turns, and a grain on the face itself (faceNoise) that breaks up all
  // the rest.
  Fall fall = fallAt(metres);
  float spray = fall.spray;
  vec3 nb = n; // the normal, with the flutes pressed in
  if (steep > 0.0) {
    float wetSide = smoothstep(0.25, 0.5, r);
    // the walls of a hero's amphitheatre stand near vertical; the ordinary
    // pali, steep as they are, hold a skin of soil
    float sheer = 1.0 - smoothstep(0.12, 0.3, n.y);
    // the flows, level across a face and dipping gently over hundreds of
    // metres
    float hm = metres + (nBig - 0.5) * 40.0;
    // the grain: clumps of fern, patches of moss, the rock's own blotches;
    // drawn while a clump is several pixels across, and its mean beyond
    float kG = smoothstep(2.5, 5.0, min(0.14 / max(px, 1e-5), 14.0 / max(fwM, 1e-4)));
    float grain = kG > 0.0 ? mix(0.5, faceNoise(xz, hm, n.xz), kG) : 0.5;
    // the flutes, mapped on whichever of sixteen vertical planes (facing
    // every 22.5 degrees round) the face looks along most squarely, so on
    // any face they run within a few degrees of the fall line; they ease
    // off to nothing where it looks between two, so that one plane hands
    // over to the next unseen, and only one is ever worked out
    vec2 fc = normalize(n.xz);
    float an = atan(fc.y, fc.x) * (8.0 / PI);
    float ip = floor(an + 0.5);
    float pw = 1.0 - smoothstep(0.36, 0.5, abs(an - ip));
    // (the plane's axis across the face: the face's own, turned back by
    // the few degrees between them)
    float dl = (an - ip) * (PI / 8.0);
    float cd = 1.0 - 0.5 * dl * dl;
    float sd = dl - dl * dl * dl / 6.0;
    vec2 ax = vec2(fc.x * sd - fc.y * cd, fc.x * cd + fc.y * sd);
    vec2 F = flutes(dot(xz, ax) + mod(ip, 16.0) * 31.0, hm, fluteFade(ax, dX, dY) * pw);
    float g = F.x;
    // The rubbly clinker at the foot of an ʻaʻā flow weathers back into a
    // recess under the massive core above: a dark notch, and on the top of
    // the flow below it a ledge for moss and ferns, wider in a fall's spray.
    // How deep each is cut and how much grows there differs contact by
    // contact (a smooth pāhoehoe flow leaves hardly any) and comes and goes
    // along the face with the grain, so a ledge thins out to nothing rather
    // than ending in a cut. Drawn while a pixel holds less than a few metres
    // of them, and their mean further off, where none of it is worked out.
    float soak = spray * (1.0 - fall.sheet);
    float kS = smoothstep(1.5, 4.0, 4.0 / max(fwM, 1e-4));
    float tone = 0.5; // the flow's own shade
    float notch = 0.1;
    float ledge = 0.08 + 0.1 * soak;
    if (kS > 0.0) {
      vec4 fq = flowsAt(hm);
      float fi = fq.z * 8.0 + floor(fq.x);
      // (how far from the nearest contact between two flows, in metres: up
      // into the recess above it, or down over the lip of the flow below.
      // One at the top of a cell is numbered as the next cell's first, so
      // both sides of it agree.)
      float bk = floor(fq.x + 0.5);
      float dm = (fq.x - bk) * fq.y;
      vec2 cut = hash22(vec2(fq.z * 8.0 + (bk < fq.w ? bk : 8.0), 1.7));
      float deep = smoothstep(0.1, 0.5, cut.x);
      float pxM = 1.5 * fwM + 0.01; // a pixel and a half
      float moss = deep * smoothstep(0.35, 0.75, grain + 0.4 * (cut.y - 0.5) + 0.35 * soak);
      float rw = moss * (2.2 + 2.5 * soak);
      float l = clamp((rw - (dm > 0.0 ? dm : -2.5 * dm)) / max(0.5 * rw, pxM), 0.0, 1.0);
      float o = deep * (0.6 + 0.8 * grain) * smoothstep(-pxM, 0.0, dm) * (1.0 - smoothstep(0.2, 1.4 + grain + pxM, dm));
      tone = mix(tone, hash12(vec2(fi, 4.3)), kS);
      notch = mix(notch, o, kS);
      ledge = mix(ledge, l, kS);
    }
    // how much rock shows. Windward, a sheer wall is rock with moss and
    // ferns on its ledges; the ordinary pali hold a velvet of fern,
    // thinning out as the wall steepens. Leeward the rock shows on much
    // gentler slopes, the grooves and ledges holding what soil there is.
    float rockW = smoothstep(0.25, 0.8, sheer + (grain - 0.5) * 0.5);
    float bareW = rockW * (1.0 - min(ledge * 1.3 + smoothstep(0.72, 0.9, grain) * 0.3, 1.0));
    // A hero's amphitheatre is new-cut rock, bare round the fall and all
    // down its face and walls, whatever the slope there. Toward the rim of
    // its walls, the brink and the mouth of the cut the fern takes it back,
    // in a ragged edge: out along the ledges, down the grooves, onto anything
    // less steep, in clumps and tongues with the grain. None of that reaches
    // deep into the rock or out into the fern, so no islands of either stand
    // apart.
    if (fall.zone > 0.0) {
      float e = fall.edge;
      float P = e + (0.8 * (grain - 0.5) + 0.3 * ledge + 0.12 * (FLUTE_MEAN.x - g) + 0.15 * smoothstep(0.15, 0.45, n.y) + 0.6 * (nBig - 0.5)) * smoothstep(0.35, 0.65, e) * (1.0 - smoothstep(0.78, 1.0, e));
      float rz = (1.0 - smoothstep(0.66, 0.9, P)) * smoothstep(0.38, 0.6, slope);
      rockW = mix(rockW, rz, fall.zone);
      bareW = mix(bareW, rz * (1.0 - min(ledge * 1.3, 1.0)), fall.zone);
    }
    // (leeward the grass takes the ledges, tapering as they do, and a
    // little of the grooves; and behind a fall's sheet the water keeps the
    // rock bare)
    float exposedDry = smoothstep(0.3, 0.7, 1.0 - smoothstep(0.3, 0.62, n.y) - (1.0 - g) * 0.4) * (1.0 - 0.7 * ledge);
    float bareWet = smoothstep(0.3, 0.6, fall.sheet + (grain - 0.5) * 0.5);
    float exposed = max(mix(exposedDry, bareW, wetSide), bareWet);
    // press the ribs into the normal: a couple of metres deep in the fern,
    // and hardly at all on rock, where they're the streaks the water stains
    vec2 bxz = F.y * ax * 0.0175 * (1.0 - 0.85 * rockW);
    vec3 bump = vec3(bxz.x, 0.0, bxz.y);
    nb = normalize(n - (bump - n * dot(n, bump)) * steep);
    // basalt, flow by flow: dark grey to grey-brown windward, darker still
    // where the spray wets it and darkest behind the sheet; leeward the
    // weathered flows run grey, tan and red-brown, the clinker redder
    vec3 basalt = mix(srgb(vec3(0.235, 0.24, 0.23)), srgb(vec3(0.30, 0.295, 0.28)), smoothstep(0.15, 0.85, tone)) * (1.0 - 0.25 * spray - 0.15 * fall.sheet);
    vec3 basaltDry = mix(rock, mix(soil, srgb(vec3(0.55, 0.42, 0.30)), smoothstep(0.5, 0.9, tone)), smoothstep(0.25, 0.75, tone) * 0.8);
    basaltDry = mix(basaltDry, srgb(vec3(0.48, 0.25, 0.16)), notch * 0.5);
    basalt = mix(basaltDry, basalt, wetSide) * (0.9 + 0.2 * grain) * (1.0 - 0.35 * notch);
    // fern velvet, clump by clump; moss on the rock and in the spray, deep
    // and wet; dry grass and shrub on the leeward
    vec3 fern = mix(srgb(vec3(0.20, 0.34, 0.14)), srgb(vec3(0.29, 0.41, 0.18)), grain);
    vec3 veg = mix(fern * (1.0 - 0.2 * rockW), srgb(vec3(0.15, 0.29, 0.09)), max(rockW, spray));
    veg = mix(mix(shrub, grassDry, grain * 0.6), veg, wetSide);
    // (all of it shadowed down in the grooves; on rock those are faint streaks)
    vec3 cliff = mix(veg * mix(0.8, 1.0, g), basalt * mix(0.9, 1.0, g), exposed);
    col = mix(col, cliff, steep);
  }
  // wet ground in a fall's spray: mossy where it isn't steep
  col = mix(col, srgb(vec3(0.13, 0.27, 0.08)), spray * (1.0 - steep) * 0.4);

  // --- the coast -----------------------------------------------------------
  float beach = sand * (1.0 - smoothstep(4.0, 9.0, metres));
  col = mix(col, sandC, smoothstep(0.15, 0.6, beach));
  col = mix(col, lava, smoothstep(0.6, 0.9, slope) * (1.0 - smoothstep(0.0, 25.0, metres)) * 0.7);
  // under water: sand and reef rock, darkened as it gets wet
  float under = 1.0 - smoothstep(-0.3, 0.6, metres);
  vec3 seabed = mix(sandC * 0.85, srgb(vec3(0.42, 0.40, 0.33)), smoothstep(0.35, 0.65, nMid));
  col = mix(col, seabed, under);
  col *= 1.0 - 0.25 * smoothstep(1.5, 0.0, metres) * (1.0 - under);

  ao *= 1.0 - fall.hide; // (deep in a hero's amphitheatre, less sky)
  float vis = sunVisibility(vWorld);
  vec3 lit = shade(col, nb, vWorld, ao, vis);
  if (spray > 0.0) {
    // and glistening: a rough wet sheen of sky (a film of water on rock
    // reflects some of it from any angle, more toward grazing), and the
    // sun's glint, strongest on the rock the sheet runs over
    vec3 V = normalize(cameraPosition - vWorld);
    float e = 1.0 - max(dot(nb, V), 0.0);
    float F = 0.06 + 0.94 * e * e * e * e * e;
    float glint = max(dot(reflect(-V, nb), uSunDir), 0.0);
    glint *= glint;
    glint *= glint;
    glint *= glint;
    glint *= glint;
    lit += spray * (1.0 + fall.sheet) * (uSkyColor * min(F, 0.3) * 0.4 * ao + uSunColor * vis * glint * glint * 0.08);
  }
  vec3 lightLevel = uSunColor * max(dot(n, uSunDir), 0.0) * vis + uSkyColor;
  lit = applyOverlay(lit, xz, px, 0.0, lightLevel * 0.5);
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(rain, sand, rip);
  if (uDebug == 5) lit = vec3(vis);
  if (uDebug == 6) lit = metres > 0.0 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0) * clamp(-metres / 5.0, 0.0, 1.0) + vec3(0.0, 0.3, 0.0);
  if (uDebug == 7) lit = vec3(spray, fall.sheet, fall.zone * (1.0 - smoothstep(0.6, 0.95, fall.edge)));
  gl_FragColor = vec4(lit, 1.0);
}
`,qc=32,ns=7,Xc=1600;class k1{constructor(t,e){this.heights=t.height,this.N=mn,this.leafSize=qt/2**(ns-1),this.range0=22,this.buildMinMax();const n=new hi(t.height,mn,mn,xs,An);n.minFilter=Me,n.magFilter=Me,n.needsUpdate=!0,this.heightTex=n;const i=new hi(t.normals,mn,mn,Ve,cn);i.minFilter=Li,i.magFilter=fe,i.generateMipmaps=!0,i.anisotropy=8,i.needsUpdate=!0,this.normalTex=i,this.full=this.makeGrid(qc),this.half=this.makeGrid(qc/2),this.morph=[];for(let a=0;a<8;a++)this.morph.push(new Ut);const o={...e.uniforms,uHeight:{value:n},uNormal:{value:i},uMorph:{value:this.morph},uCamPos:{value:new W},uDebug:{value:0},uFallA:{value:[0,1,2,3].map(()=>new pe)},uFallB:{value:[0,1,2,3].map(()=>new pe)},uFallC:{value:[0,1,2,3].map(()=>new pe)},uFallD:{value:[0,1,2,3].map(()=>new pe)},uFalls:{value:0}};this.uniforms=o,this.group=new xn;for(const a of[this.full,this.half])a.material=new be({vertexShader:P1,fragmentShader:L1,uniforms:{...o,uGrid:{value:a.dim}}}),a.mesh=new ae(a.geometry,a.material),a.mesh.frustumCulled=!1,a.mesh.matrixAutoUpdate=!1,this.group.add(a.mesh);this._frustum=new Rs,this._m=new te,this._box=new kn,this.setRange(this.range0)}makeGrid(t){const e=new fu,n=new Float32Array((t+1)*(t+1)*3);for(let r=0;r<=t;r++)for(let l=0;l<=t;l++){const c=(r*(t+1)+l)*3;n[c]=l/t,n[c+2]=r/t}const i=[];for(let r=0;r<t;r++)for(let l=0;l<t;l++){const c=r*(t+1)+l,h=c+1,f=c+t+1,u=f+1;l+r&1?i.push(c,f,h,h,f,u):i.push(c,f,u,c,u,h)}e.setIndex(i),e.setAttribute("position",new oe(n,3));const o=new Float32Array(Xc*4),a=new $n(o,4);return a.setUsage(vs),e.setAttribute("aNode",a),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:a,count:0}}buildMinMax(){const t=this.N,e=2**(ns-1),n=t/e;this.mm=[];let i=new Float32Array(e*e),o=new Float32Array(e*e);for(let r=0;r<e;r++)for(let l=0;l<e;l++){let c=1/0,h=-1/0;for(let f=r*n;f<=Math.min(t-1,(r+1)*n);f++)for(let u=l*n;u<=Math.min(t-1,(l+1)*n);u++){const m=this.heights[f*t+u];m<c&&(c=m),m>h&&(h=m)}i[r*e+l]=c,o[r*e+l]=h}this.mm.push({lo:i,hi:o,n:e});let a=e;for(;a>1;){const r=a/2,l=new Float32Array(r*r),c=new Float32Array(r*r);for(let h=0;h<r;h++)for(let f=0;f<r;f++){const u=2*h*a+2*f;l[h*r+f]=Math.min(i[u],i[u+1],i[u+a],i[u+a+1]),c[h*r+f]=Math.max(o[u],o[u+1],o[u+a],o[u+a+1])}i=l,o=c,a=r,this.mm.push({lo:i,hi:o,n:a})}}setRange(t){this.rangeGoal===void 0&&this.applyRange(t),this.rangeGoal=t}applyRange(t){this.range0=t,this.ranges=[];for(let e=0;e<ns;e++)this.ranges.push(t*2**e);this.ranges[ns-1]=1e6;for(let e=0;e<ns;e++){const n=this.ranges[e],i=e>0?this.ranges[e-1]:0,o=i+(n-i)*.5;this.morph[e].set(o,n*.97)}}heightAt(t,e){return this.metresAt(t,e)*Gt}metresAt(t,e){const n=this.N;let i=(t+ut)/qt*n-.5,o=(e+ut)/qt*n-.5;i<0&&(i=0),o<0&&(o=0),i>n-1.001&&(i=n-1.001),o>n-1.001&&(o=n-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=this.heights,f=r*n+a,u=h[f]+(h[f+1]-h[f])*l,m=h[f+n]+(h[f+n+1]-h[f+n])*l;return u+(m-u)*c}normalAt(t,e,n=new W){const i=qt/this.N,o=this.heightAt(t+i,e)-this.heightAt(t-i,e),a=this.heightAt(t,e+i)-this.heightAt(t,e-i);return n.set(-o,2*i,-a).normalize()}update(t){Math.abs(this.rangeGoal-this.range0)>.01&&this.applyRange(this.range0+(this.rangeGoal-this.range0)*.04),this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.uniforms.uCamPos.value.copy(t.position),this.full.count=0,this.half.count=0,this.select(0,0,ns-1);for(const e of[this.full,this.half])e.geometry.instanceCount=e.count,e.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],o=this.leafSize*2**n,a=-ut+t*o,r=-ut+e*o,l=i.lo[e*i.n+t]*Gt,c=i.hi[e*i.n+t]*Gt;return this._box.min.set(a,l,r),this._box.max.set(a+o,c,r+o),this._box}select(t,e,n){const i=this.nodeBox(t,e,n),o=this.mm[n];if(o.hi[e*o.n+t]<-45)return!0;if(i.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(i))return!0;const a=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,a,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,a,n),!0;for(let r=0;r<4;r++){const l=t*2+(r&1),c=e*2+(r>>1);if(!this.select(l,c,n-1)){const h=this.mm[n-1];if(h.hi[c*h.n+l]<-45)continue;const f=this.nodeBox(l,c,n-1);if(!this._frustum.intersectsBox(f))continue;this.emit(this.half,l,c,a/2,n)}}return!0}emit(t,e,n,i,o){if(t.count>=Xc)return;const a=t.count*4;t.data[a]=-ut+e*i,t.data[a+1]=-ut+n*i,t.data[a+2]=i,t.data[a+3]=o,t.count++}}const Yn={cycle:140,speed:.05},Wr=s=>s.toFixed(4),D1=`
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
  return uSwellT - dot(xz, sd) / ${Wr(Yn.speed)};
}
// (seconds since the latest set wave arrived, its height, seconds until the next)
vec3 swellAt(float t) {
  const float L = ${Wr(Yn.cycle)};
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
`,z1=`
${qe}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,F1=`
${qe}
${ti}
${vn}
${ei}
${pu}
${D1}
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
    g -= sd * (swellRidge(sw.x) * sw.y + swellRidge(-sw.z)) * shoal * (0.014 / ${Wr(Yn.speed)});
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
`,jc=(s,t)=>s-t*Math.floor(s/t),ba=(s,t,e,n)=>{const i=jc(s,101);return jc(i*i*t+i*e+n,101)/101},Yc=s=>3+Math.floor(ba(s,37,11,5)*4),$c=s=>12+4*ba(s,23,61,17),rr=s=>12*ba(s,53,7,29),Kc=(s,t)=>.5+.5*ba(s*7+t*13,41,3,71);function Go(s,t){const e=Yn.cycle,n=Math.floor(s/e),i=s-n*e,o=Yc(n),a=$c(n),r=rr(n);let l=Math.floor((i-r)/a);if(l>=0)l=Math.min(l,o-1),t.age=i-r-l*a,t.height=Kc(n,l),t.next=l+1<o?r+(l+1)*a-i:e+rr(n+1)-i,t.id=n*8+l;else{const c=Yc(n-1);t.age=i+e-rr(n-1)-(c-1)*$c(n-1),t.height=Kc(n-1,c-1),t.next=r-i,t.id=(n-1)*8+c-1}return t}function I1(s,t,e,n){const i=[0,0,0];for(let r=0;r<=n;r++){const l=s*Math.pow(t/s,r/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const o=[];for(let r=0;r<e;r++)o.push(0,1+(r+1)%e,1+r);for(let r=0;r<n;r++)for(let l=0;l<e;l++){const c=1+r*e+l,h=1+r*e+(l+1)%e,f=c+e,u=h+e;o.push(c,h,f,h,u,f)}const a=new Le;return a.setAttribute("position",new xe(i,3)),a.setIndex(o),a}class U1{constructor(t,e,n){this.uniforms={...t.uniforms,uHeight:{value:e},uSea:{value:n},uCamPos:{value:new W},uWind:{value:new Ut(-.8,.45)},uSwellDir:{value:new Ut(-.6,.8)},uSwell:{value:.6},uSwellT:{value:0},uDebug:{value:0},uHorizonColor:{value:new Dt},uZenithColor:{value:new Dt}};const i=I1(1.5,8e3,96,72);this.material=new be({vertexShader:z1,fragmentShader:F1,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new ae(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,this.swellT=0;const o=this.uniforms.uSwellDir.value,a=Math.hypot(o.x+1e-4,o.y+1e-4);this.swellDir=[(o.x+1e-4)/a,(o.y+1e-4)/a]}swellTimeAt(t,e){return this.swellT-(t*this.swellDir[0]+e*this.swellDir[1])/Yn.speed}update(t,e=0){this.swellT+=e,this.uniforms.uSwellT.value=this.swellT,this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const N1=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],O1={ra:12.857,dec:27.13};function Ci(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function On(s,t,e=0){let n=Math.imul(s|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const B1=.5*(Math.sqrt(3)-1),Os=(3-Math.sqrt(3))/6,is=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1,.7071,.7071,-.7071,.7071,.7071,-.7071,-.7071,-.7071]);function Zc(s){const t=Ci(s),e=new Uint8Array(256);for(let o=0;o<256;o++)e[o]=o;for(let o=255;o>0;o--){const a=Math.floor(t()*(o+1)),r=e[o];e[o]=e[a],e[a]=r}const n=new Uint8Array(512),i=new Uint8Array(512);for(let o=0;o<512;o++)n[o]=e[o&255],i[o]=n[o]%12;return function(a,r){const l=(a+r)*B1,c=Math.floor(a+l),h=Math.floor(r+l),f=(c+h)*Os,u=a-(c-f),m=r-(h-f);let v,g;u>m?(v=1,g=0):(v=0,g=1);const x=u-v+Os,p=m-g+Os,d=u-1+2*Os,M=m-1+2*Os,_=c&255,S=h&255;let w=0,b=.5-u*u-m*m;if(b>0){const E=i[_+n[S]]*2;b*=b,w+=b*b*(is[E]*u+is[E+1]*m)}let A=.5-x*x-p*p;if(A>0){const E=i[_+v+n[S+g]]*2;A*=A,w+=A*A*(is[E]*x+is[E+1]*p)}let y=.5-d*d-M*M;if(y>0){const E=i[_+1+n[S+1]]*2;y*=y,w+=y*y*(is[E]*d+is[E+1]*M)}return 70*w}}function H1(s,t,e,n,i=.5){let o=0,a=1,r=0,l=1;for(let c=0;c<n;c++)o+=a*s(t*l,e*l),r+=a,a*=i,l*=2.03;return o/r}const na=(s,t,e)=>s<t?t:s>e?e:s,Jc=(s,t,e)=>{const n=na((e-s)/(t-s),0,1);return n*n*(3-2*n)},G1=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function Sa(){const s=new Le;return s.setAttribute("position",new oe(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const W1=`
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
`;class V1{constructor(t){this.renderer=t,this.size=new Ut;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?Jn:cn,this.sceneRT=new hn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new ol(1,1,Xn),this.quad=new ae(Sa(),new be({vertexShader:G1,fragmentShader:W1,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Ut},uInvProj:{value:new te},uCamWorld:{value:new te},uCamPos:{value:new W},uSunDir:{value:new W(0,1,0)},uSunColor:{value:new Dt},uFogColor:{value:new Dt(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Es,this.quadScene.add(this.quad),this.quadCam=new fo(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Wn=Math.PI/180,js=21*Wn,Wo=29.530588,q1=224.1,X1=["Hilo","Hoaka","Kūkahi","Kūlua","Kūkolu","Kūpau","ʻOlekūkahi","ʻOlekūlua","ʻOlekūkolu","ʻOlepau","Huna","Mōhalu","Hua","Akua","Hoku","Māhealani","Kulu","Lāʻaukūkahi","Lāʻaukūlua","Lāʻaupau","ʻOlekūkahi","ʻOlekūlua","ʻOlepau","Kāloakūkahi","Kāloakūlua","Kāloapau","Kāne","Lono","Mauli","Muku"];function Qc(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),o=Math.sin(s)*Math.cos(js)-n*Math.cos(t)*Math.sin(js),a=Math.sin(s)*Math.sin(js)+n*Math.cos(t)*Math.cos(js);return e.set(i,a,-o)}function mu(s,t,e={}){const n=23.44*Wn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*Wn,a=((s-80)/365.25*24%24+24)%24+t-12;e.sun=Qc(n,(t-12)*15*Wn,e.sun||new W);const r=s+t/24,l=((r-q1)%Wo+Wo)%Wo,c=l/Wo,h=i+c*2*Math.PI,f=Math.asin(Math.sin(23.44*Wn)*Math.sin(h)+Math.sin(5.1*Wn)*Math.sin(r*.23)),u=h/(2*Math.PI)*24;return e.moon=Qc(f,(a-u)*15*Wn,e.moon||new W),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=a,e.decl=n,e}const gu=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],xu=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],j1=1.6110731556870734,Y1=1.5;function $1(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((j1-Math.acos(s))/Y1)))}function lr(s,t,e,n=[0,0,0]){const i=$1(t.y),o=.2*e.turbidity*1e-17,a=Math.acos(Math.max(0,s.y)),r=1/(Math.cos(a)+.15*Math.pow(93.885-a*180/Math.PI,-1.253)),l=8400*r,c=1250*r,h=s.x*t.x+s.y*t.y+s.z*t.z,f=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),u=e.mieDirectionalG,m=u*u,v=1/(4*Math.PI)*((1-m)/Math.pow(1-2*u*h+m,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let x=0;x<3;x++){const p=gu[x]*e.rayleigh,d=.434*o*xu[x]*e.mieCoefficient,M=Math.exp(-(p*l+d*c)),_=(p*f+d*v)/(p+d);let S=Math.pow(i*_*(1-M),1.5);S*=1+(Math.pow(i*_*M,.5)-1)*g;const w=.1*M,b=(S+w)*.04+[0,3e-4,75e-5][x];n[x]=Math.pow(b,1/2.4)}return n}function K1(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let a=0;a<3;a++){const r=gu[a]*t.rayleigh,l=.434*o*xu[a]*t.mieCoefficient;e[a]=Math.exp(-(r*8400*i+l*1250*i))}return e}const Z1=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,vu=`
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
`,J1=`
${vu}
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
`,Q1=`
${vu}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,tx=`
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
`,ex=`
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
`;class nx{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=O1,e=(c,h)=>{const f=c/24*2*Math.PI,u=h*Wn;return new W(Math.cos(u)*Math.cos(f),Math.cos(u)*Math.sin(f),Math.sin(u))};this.uniforms={uSun:{value:new W(0,1,0)},uMoon:{value:new W(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:js},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new ae(new ll(1,5),new be({vertexShader:Z1,fragmentShader:J1,uniforms:this.uniforms,side:$e,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=Ci(4242),o=N1.map(([c,h,f])=>[c/24*2*Math.PI,h*Wn,f]);for(let c=0;c<2600;c++){const h=i()*2-1;o.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const a=new Float32Array(o.length*3);o.forEach((c,h)=>a.set(c,h*3));const r=new Le;r.setAttribute("aStar",new oe(a,3)),r.setAttribute("position",new oe(new Float32Array(o.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new lu(r,new be({vertexShader:tx,fragmentShader:ex,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:Rr})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new xn,this.group.add(n,this.stars),this.mapRT=new hn(256,128,{type:Jn,depthBuffer:!1}),this.mapRT.texture.wrapS=Pi,this.mapScene=new Es;const l=new ae(Sa(),new be({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Q1,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new fo(-1,1,1,-1,0,1),this.astro={},this._v=new W}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const o=mu(t,e,this.astro),a=o.sun,r=this.uniforms;r.uSun.value.copy(a),r.uMoon.value.copy(o.moon),r.uPhase.value=o.phase,r.uIllum.value=o.illum,r.uLst.value=o.lst/24*2*Math.PI;const l=Pn.smoothstep(-a.y,-.02,.2);r.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,f=lr(h.set(0,1,0),a,c),u=[0,0,0];for(let w=0;w<8;w++){const b=w/8*Math.PI*2,A=lr(h.set(Math.cos(b),.08,Math.sin(b)).normalize(),a,c);for(let y=0;y<3;y++)u[y]+=A[y]/8}const m=lr(h.set(a.x,.05,a.z).normalize(),a,c),v=K1(a,c),g=Pn.smoothstep(a.y,-.04,.06),x=3.2;i.sunColor.setRGB(v[0]*x*g,v[1]*x*g,v[2]*x*g);const p=[.0035,.005,.011],M=Pn.smoothstep(o.moon.y,-.02,.1)*o.illum*l;i.skyColor.setRGB(f[0]*.55+u[0]*.45+p[0]+.012*M,f[1]*.55+u[1]*.45+p[1]+.016*M,f[2]*.55+u[2]*.45+p[2]+.024*M);const _=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new Dt(_,_,_),.35),i.zenith.setRGB(f[0],f[1],f[2]),i.horizon.setRGB(u[0]+p[0],u[1]+p[1],u[2]+p[2]),i.sunHorizon.setRGB(m[0],m[1],m[2]);const S=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,a.y)+i.skyColor.r)*S*1.1,(i.sunColor.g*Math.max(0,a.y)+i.skyColor.g)*S,(i.sunColor.b*Math.max(0,a.y)+i.skyColor.b)*S*.8),i.moonColor.setRGB(.05*M,.06*M,.085*M),i.moonDir.copy(o.moon),i.sunDir.copy(a),i.night=l,o}}const cr=Math.PI*2,ix=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,th=s=>((s+Math.PI)%cr+cr)%cr-Math.PI;class sx{constructor(t,e,n){this.camera=t,this.dom=e,this.terrain=n,this.state={target:new W(0,0,20),distance:420,yaw:.35,pitch:.62,lift:0},this.goal={target:this.state.target.clone(),distance:420,yaw:.35,pitch:.62,lift:0},this.flight=null,this.floor=0,this.minDistance=.5,this.maxDistance=900,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new R1,this._v=new W,this.bind()}bind(){const t=this.dom,e=new Map;let n=null,i=null,o=null;t.addEventListener("contextmenu",r=>r.preventDefault()),t.addEventListener("pointerdown",r=>{this.enabled&&(t.setPointerCapture(r.pointerId),e.set(r.pointerId,{x:r.clientX,y:r.clientY}),e.size===1?(n=r.button===2||r.shiftKey||r.ctrlKey||r.metaKey?"pan":"orbit",i={x:r.clientX,y:r.clientY},this.panAnchor=n==="pan"?this.pickGround(r.clientX,r.clientY):null):e.size===2&&(n="pinch",o=this.pinchState(e)),this.touch())}),t.addEventListener("pointermove",r=>{if(e.has(r.pointerId)){if(e.set(r.pointerId,{x:r.clientX,y:r.clientY}),n==="orbit"&&i){const l=r.clientX-i.x,c=r.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=Pn.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:r.clientX,y:r.clientY},this.touch()}else if(n==="pan"&&i)this.panBy(r.clientX-i.x,r.clientY-i.y),i={x:r.clientX,y:r.clientY},this.touch();else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=o.dist/Math.max(20,l.dist);this.goal.distance=Pn.clamp(this.goal.distance*c,this.minDistance,this.maxDistance),this.panBy(l.cx-o.cx,l.cy-o.cy),this.goal.yaw-=th(l.angle-o.angle),this.goal.pitch=Pn.clamp(this.goal.pitch+(l.cy-o.cy)*0,.06,1.52),o=l,this.touch()}}});const a=r=>{if(e.delete(r.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="orbit",i={...l}}};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("wheel",r=>{if(!this.enabled)return;r.preventDefault();const l=Math.exp(Math.sign(r.deltaY)*Math.min(Math.abs(r.deltaY),120)*.0018);this.zoomAt(r.clientX,r.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",r=>{const l=this.pickGround(r.clientX,r.clientY);l&&this.flyTo({target:l,distance:Math.max(6,this.goal.distance*.45)},1.6)}),addEventListener("keydown",r=>{var h,f;if(!this.enabled||(f=(h=r.target).closest)!=null&&f.call(h,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]}[r.code];if(c&&!r.altKey){const u=Math.sin(this.goal.yaw),m=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*m+c[1]*u)*l,this.goal.target.z+=(-c[0]*u+c[1]*m)*l,this.touch()}r.code==="KeyQ"&&(this.goal.yaw+=.12),r.code==="KeyE"&&(this.goal.yaw-=.12),(r.code==="Equal"||r.code==="NumpadAdd")&&(this.goal.distance*=.85),(r.code==="Minus"||r.code==="NumpadSubtract")&&(this.goal.distance/=.85)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,o=Math.sin(this.goal.yaw),a=Math.cos(this.goal.yaw),r=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*a-e*o*r)*i,this.goal.target.z+=(t*o-e*a*r)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),o=this.goal.distance,a=Pn.clamp(o*n,this.minDistance,this.maxDistance);if(i&&a<o){const r=1-a/o;this.goal.target.lerp(i,r)}this.goal.distance=a}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Ut((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e,n=3e3){const i=(l,c)=>Math.max(0,this.terrain.heightAt(l,c));let o=0,a=0,r=this._v;for(let l=0;l<400&&o<n;l++){r.copy(t).addScaledVector(e,o);const c=r.y-i(r.x,r.z);if(c<0){let h=a,f=o;for(let u=0;u<20;u++){const m=(h+f)/2;r.copy(t).addScaledVector(e,m),r.y-i(r.x,r.z)<0?f=m:h=m}return r.clone()}a=o,o+=Math.max(.03,c*.45,o*.002)}return null}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},o={target:t.target?t.target.clone():i.target.clone(),distance:t.distance??i.distance,yaw:t.yaw??i.yaw,pitch:t.pitch??i.pitch,lift:t.lift??0};o.yaw=i.yaw+th(o.yaw-i.yaw);const a=i.target.distanceTo(o.target),r=n.hop??Math.max(0,a*.9-Math.max(i.distance,o.distance)*.6);this.flight={from:i,dest:o,t:0,duration:e,hop:r,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}update(t){var o;const e=this.goal;if(this.flight){const a=this.flight;a.t=Math.min(1,a.t+t/a.duration);const r=ix(a.t);e.target.lerpVectors(a.from.target,a.dest.target,r);const l=Math.log(a.from.distance)*(1-r)+Math.log(a.dest.distance)*r;e.distance=Math.exp(l)+a.hop*Math.sin(Math.PI*r),e.yaw=a.from.yaw+(a.dest.yaw-a.from.yaw)*r,e.pitch=a.from.pitch+(a.dest.pitch-a.from.pitch)*r+.25*Math.sin(Math.PI*r)*Math.min(1,a.hop/80),e.lift=a.from.lift+(a.dest.lift-a.from.lift)*r,a.t>=1&&(this.flight=null,(o=a.onDone)==null||o.call(a))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);if(e.target.x=Pn.clamp(e.target.x,-ut*1.3,ut*1.3),e.target.z=Pn.clamp(e.target.z,-ut*1.3,ut*1.3),!this.flight){const a=Math.max(0,this.terrain.heightAt(e.target.x,e.target.z));e.target.y+=(a-e.target.y)*(1-Math.exp(-t*6))}const n=this.state,i=this.flight?1:1-Math.exp(-t*7);n.target.lerp(e.target,i),n.distance+=(e.distance-n.distance)*i,n.yaw+=(e.yaw-n.yaw)*i,n.pitch+=(e.pitch-n.pitch)*i,n.lift+=(e.lift-n.lift)*i,this.apply(t)}groundAhead(t,e,n){const i=this.terrain;let o=i.heightAt(t,e);const a=this._prevXZ;if(a&&n>0){const r=(t-a.x)/n,l=(e-a.y)/n,c=Math.hypot(r,l),h=Math.min(2,c*.3);h>.005&&(o=Math.max(o,i.heightAt(t+r/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new Ut).set(t,e),Math.max(0,o)}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const o=.12+e.distance*.03,a=this.groundAhead(n.position.x,n.position.z,t),r=Math.max(0,a+o-n.position.y);t<=0?this.floor=r:this.floor+=(r-this.floor)*(1-Math.exp(-t*(r>this.floor?9:2.5))),n.position.y+=this.floor;const l=Math.max(0,this.terrain.heightAt(n.position.x,n.position.z));n.position.y=Math.max(n.position.y,l+Math.min(.04,o*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=Pn.clamp(Math.min(c,e.distance)*.12,.02,4),n.far=9e3,n.updateProjectionMatrix()}}const ox=`
${qe}
${vn}
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
`;class ax{constructor(t,e=1024){this.rt=new hn(e,e,{type:cn,depthBuffer:!1,minFilter:fe,magFilter:fe}),this.material=new be({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:ox,uniforms:{uHeight:{value:t},uSunDir:{value:new W(0,1,0)}},depthTest:!1,depthWrite:!1}),this.scene=new Es;const n=new ae(Sa(),this.material);n.frustumCulled=!1,this.scene.add(n),this.cam=new fo(-1,1,1,-1,0,1),this.last=new W(0,-2,0),this.size=e,this.strips=4,this.strip=-1}get texture(){return this.rt.texture}update(t,e,n=!1){if(n||!this.drawn){this.drawn=!0,this.draw(t,e,-1);return}if(this.strip<0){if(e.angleTo(this.last)<.004)return;this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e),this.strip=0}this.draw(t,null,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e,n){e&&(this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e));const i=this.rt;if(n>=0){const a=this.size/this.strips;i.scissor.set(0,n*a,this.size,a),i.scissorTest=!0}else i.scissorTest=!1;const o=t.getRenderTarget();t.setRenderTarget(i),t.render(this.scene,this.cam),t.setRenderTarget(o),i.scissorTest=!1}}const rx=`
${qe}
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
${vn}
${du}
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
`,lx=`
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
`,cx=.9,eh="out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",Mu=512,_u=64;function hx(s){if(s>6)return 0;if(s<-7){const a=-s,r=2/3*a*Math.sqrt(a),l=r+Math.PI/4;return(Math.sin(l)-5/(72*r)*Math.cos(l))/(Math.sqrt(Math.PI)*Math.sqrt(Math.sqrt(a)))}const t=s*s*s;let e=1,n=s,i=1,o=s;for(let a=1;a<80&&(i*=t/((3*a-1)*(3*a)),o*=t/(3*a*(3*a+1)),e+=i,n+=o,!(Math.abs(i)+Math.abs(o)<1e-16));a++);return .355028053887817*e-.258819403792807*n}const yu=s=>1.3239+.003125/(s*s);function wu(s,t,e){const n=Math.sqrt(1-e*e),i=Math.sqrt(1-e*e/(s*s)),o=(n-s*i)/(n+s*i),a=(s*n-i)/(s*n+i),r=o*o,l=a*a;return .5*((1-r)**2*r**t+(1-l)**2*l**t)}function cs(s,t,e){const n=Math.asin(e),i=Math.asin(e/s),o=2*(n-i)+t*(Math.PI-2*i);return t===1?Math.PI-o:o-Math.PI}function cl(s,t){const e=Math.sqrt(1-(s*s-1)/(t*(t+2))),n=2*e/Math.pow(1-e*e,1.5)-2*(t+1)*e/Math.pow(s*s-e*e,1.5);return{b:e,alpha:cs(s,t,e),d2:Math.abs(n),eps:wu(s,t,e)}}const xi=(s,t,e,n)=>Math.exp(-.5*((s-t)/(s<t?e:n))**2),ux=s=>[1.056*xi(s,599.8,37.9,31)+.362*xi(s,442,16,26.7)-.065*xi(s,501.1,20.4,26.2),.821*xi(s,568.8,46.9,40.5)+.286*xi(s,530.9,16.3,31.1),1.217*xi(s,437,11.8,36)+.681*xi(s,459,26,13.8)],nh=([s,t,e])=>[3.2406*s-1.5372*t-.4986*e,-.9689*s+1.8758*t+.0415*e,.0557*s-.204*t+1.057*e],Vr=.25;function fx(s,t,e){const n=cl(s,t);let i=0;for(const[o,a]of[[1e-6,n.b],[n.b,1-1e-9]]){let r=o,l=a;const c=cs(s,t,r)-e;if(c*(cs(s,t,l)-e)>0)continue;for(let v=0;v<40;v++){const g=(r+l)/2;(cs(s,t,g)-e)*c>0?r=g:l=g}const h=(r+l)/2,f=Math.max(h-1e-6,0),u=Math.min(h+1e-6,1),m=Math.abs(cs(s,t,u)-cs(s,t,f))/(u-f);i+=2*wu(s,t,h)*h/(m*Math.sin(e))}return i}function dx(){const s=yu(.55);return[1,2].map(t=>{const e=cl(s,t),n=new Float32Array(Math.ceil(_u/Vr)+1);for(let i=0;i<n.length;i++){const o=Math.max(i*Vr,.5)*Math.PI/180,a=t===1?e.alpha-o:e.alpha+o;if(a<=.01||a>=Math.PI-.01){n[i]=n[i-1]||1;continue}const r=e.eps*e.b*Math.cbrt(4)*Math.pow(e.d2,-2/3)*2/(Math.sqrt(o*Math.cbrt(2/e.d2))*Math.sin(a));n[i]=fx(s,t,a)/r}return n})}const ma=-20,qr=.01;function px(){const s=new Float32Array(Math.round((6-ma)/qr)+2);for(let t=0;t<s.length;t++)s[t]=hx(ma+t*qr)**2;return s}function hr(s,t,e){const n=Mu,i=_u/n,o=new Float32Array(n*3),a=[.6,.75,.9,1,1.1,1.25,1.45,1.7].map(d=>s*d),r=a.map(d=>Math.exp(-.5*(Math.log(d/s)/.3)**2)*d*d),l=r.reduce((d,M)=>d+M,0),c=new Float32Array(n),h=new Float32Array(n);for(let d=0;d<n;d++)c[d]=Math.max((d+.5)*i,1)*Math.PI/180,h[d]=1/Math.sin(c[d]);const f=[0,0,0],u=new Float32Array(n*3);for(let d=400;d<=700;d+=20){const M=ux(d);for(let S=0;S<3;S++)f[S]+=M[S];const _=yu(d/1e3);for(const S of[1,2]){const w=cl(_,S),b=t[S-1],A=S===1?1:-1;for(let y=0;y<a.length;y++){const E=2*Math.PI*a[y]*1e6/d,R=Math.cbrt(E),P=R*R*Math.cbrt(2/w.d2),N=w.eps*w.b*Math.cbrt(4)*R*Math.pow(w.d2,-2/3)*4*Math.PI*(r[y]/l);for(let T=S===1?0:n-1;T>=0&&T<n;T+=A){const C=(w.alpha-c[T])*A,I=-C*P;if(I>6)break;let H;if(I<ma)H=1/(2*Math.PI*Math.sqrt(-I));else{const O=(I-ma)/qr,k=Math.floor(O);H=e[k]+(e[k+1]-e[k])*(O-k)}let z=N*H*h[T];if(C>0){const O=Math.min(b.length-1.001,C*180/Math.PI/Vr),k=Math.floor(O);z*=b[k]+(b[k+1]-b[k])*(O-k)}u[T*3]+=z*M[0],u[T*3+1]+=z*M[1],u[T*3+2]+=z*M[2]}}}}const m=nh(f),v=Math.ceil(.2665/i),g=[];for(let d=-v;d<=v;d++)g.push(Math.sqrt(Math.max(0,1-(d*i/.2665)**2)));const x=g.reduce((d,M)=>d+M,0),p=[0,0,0];for(let d=0;d<n;d++){p.fill(0);for(let A=-v;A<=v;A++){const y=Math.min(n-1,Math.max(0,d+A));for(let E=0;E<3;E++)p[E]+=u[y*3+E]*g[A+v]/x}const M=nh(p).map((A,y)=>A/m[y]),_=.2126*M[0]+.7152*M[1]+.0722*M[2],S=Math.min(M[0],M[1],M[2]),w=S<0?_/Math.max(_-S,1e-6):1,b=1-Math.min(1,Math.max(0,((d+.5)*i-58)/5));for(let A=0;A<3;A++)o[d*3+A]=Math.max(0,_+(M[A]-_)*w)*b}return o}function mx(){performance.now();const s=dx(),t=px(),e=[hr(.5,s,t),hr(.15,s,t),hr(.05,s,t)],n=Mu,i=new Uint16Array(n*3*4),o=cc.toHalfFloat(1);for(let r=0;r<3;r++)for(let l=0;l<n;l++){const c=(r*n+l)*4;for(let h=0;h<3;h++)i[c+h]=cc.toHalfFloat(e[r][l*3+h]);i[c+3]=o}const a=new hi(i,n,3,Ve,Jn);return a.minFilter=a.magFilter=fe,a.wrapS=a.wrapT=en,a.needsUpdate=!0,a}class gx{constructor(t){const e=new Ur(t.shape,t.shapeSize,t.shapeSize,t.shapeSize);e.format=xs,e.minFilter=fe,e.magFilter=fe,e.wrapS=e.wrapT=e.wrapR=Pi,e.unpackAlignment=1,e.needsUpdate=!0;const n=new Ur(t.detail,t.detailSize,t.detailSize,t.detailSize);n.format=xs,n.minFilter=fe,n.magFilter=fe,n.wrapS=n.wrapT=n.wrapR=Pi,n.unpackAlignment=1,n.needsUpdate=!0,this.scale=.5;const i={type:Jn,depthBuffer:!1};this.march=new ad(1,1,2,i),this.march.texture[1].format=xs,this.history=[new hn(1,1,i),new hn(1,1,i)],this.current=0,this.frame=0,this.fresh=!0,this.prev={viewProj:new te,pos:new W,fwd:new W,sun:new W,wind:new Ut},this._fwd=new W,this.uniforms={uDepth:{value:null},uWeather:{value:null},uShape:{value:e},uDetail:{value:n},uWeatherRect:{value:new pe},uInvProj:{value:new te},uCamWorld:{value:new te},uCamPos:{value:new W},uSunDir:{value:new W},uSunColor:{value:new Dt},uSkyColor:{value:new Dt},uGroundColor:{value:new Dt},uFogColor:{value:new Dt},uMoonDir:{value:new W},uMoonColor:{value:new Dt},uWind:{value:new Ut},uWindDir:{value:new Ut(1,0)},uTime:{value:0},uBase:{value:8},uTop:{value:28},uDensity:{value:1},uFarCover:{value:.32},uOvercast:{value:0},uRainbow:{value:1},uBowLUT:{value:mx()},uShadow:{value:null},uHeight:{value:null},uSteps:{value:56},uLightSteps:{value:4},uFlash:{value:0},uFlashPos:{value:new W},uFrame:{value:0}},this.material=new be({vertexShader:eh,fragmentShader:rx,uniforms:this.uniforms,depthTest:!1,depthWrite:!1});const o=Sa();this.scene=new Es;const a=new ae(o,this.material);a.frustumCulled=!1,this.scene.add(a),this.resolve=new be({vertexShader:eh,fragmentShader:lx,uniforms:{uCur:{value:this.march.texture[0]},uCurDepth:{value:this.march.texture[1]},uHistory:{value:null},uPrevViewProj:{value:new te},uInvProj:this.uniforms.uInvProj,uCamWorld:this.uniforms.uCamWorld,uCamPos:this.uniforms.uCamPos,uDrift:{value:new W},uBlend:{value:0}},depthTest:!1,depthWrite:!1}),this.resolveScene=new Es;const r=new ae(o,this.resolve);r.frustumCulled=!1,this.resolveScene.add(r),this.cam=new fo(-1,1,1,-1,0,1),this.enabled=!0}get rt(){return this.history[this.current]}get texture(){return this.rt.texture}setSize(t,e){this.full=[t,e];const n=Math.max(1,Math.floor(t*this.scale)),i=Math.max(1,Math.floor(e*this.scale));this.march.setSize(n,i);for(const o of this.history)o.setSize(n,i);this.fresh=!0}setScale(t){Math.abs(t-this.scale)<.001||(this.scale=t,this.full&&this.setSize(...this.full))}isCut(t){const e=this.prev,n=t.getWorldDirection(this._fwd),i=t.position,o=this.fresh||i.distanceTo(e.pos)>.5+.25*Math.max(0,i.y)||n.dot(e.fwd)<.85||this.uniforms.uSunDir.value.dot(e.sun)<.9995;return e.pos.copy(i),e.fwd.copy(n),e.sun.copy(this.uniforms.uSunDir.value),this.fresh=!1,o}render(t,e,n){const i=this.uniforms,o=this.isCut(e);i.uDepth.value=n,i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.frame=(this.frame+1)%4096,i.uFrame.value=this.frame,t.setRenderTarget(this.march),t.render(this.scene,this.cam);const a=this.resolve.uniforms,r=this.prev;a.uBlend.value=o?0:i.uFlash.value>.02?.5:cx,a.uPrevViewProj.value.copy(r.viewProj),a.uDrift.value.set(i.uWind.value.x-r.wind.x,0,i.uWind.value.y-r.wind.y),a.uHistory.value=this.history[this.current].texture,this.current^=1,t.setRenderTarget(this.history[this.current]),t.render(this.resolveScene,this.cam),r.viewProj.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),r.wind.copy(i.uWind.value)}}const Xr={moae:{name:"Moaʻe",gloss:"trade winds",bearing:62,speed:8.5,humidity:1,lcl:650,inversion:2e3,patch:1,convect:.55},kona:{name:"Kona",gloss:"southerly storm",bearing:205,speed:11,humidity:1.45,lcl:420,inversion:3800,patch:1.6,convect:.8},malie:{name:"Mālie",gloss:"calm, sea breezes",bearing:110,speed:2.4,humidity:.85,lcl:900,inversion:2900,patch:.5,convect:1.5}},Ke=160,Bs=qt*1.8;class xx{constructor(t,e,n=7){this.G=Ke,this.span=Bs,this.cell=Bs/Ke,this.origin=-Bs/2;const i=Ke*Ke;this.terrain=new Float32Array(i),this.land=new Float32Array(i),this.heat=new Float32Array(i);for(let o=0;o<Ke;o++)for(let a=0;a<Ke;a++){const r=this.origin+(a+.5)*this.cell,l=this.origin+(o+.5)*this.cell;let c=0,h=0,f=0;for(let m=-1;m<=1;m++)for(let v=-1;v<=1;v++){const g=r+v*this.cell*.5,x=l+m*this.cell*.5,p=Math.floor((g+qt/2)/qt*e),d=Math.floor((x+qt/2)/qt*e),M=p<0||d<0||p>=e||d>=e?-500:t[d*e+p];c+=Math.max(0,M),h=Math.max(h,M),f++}const u=o*Ke+a;this.terrain[u]=c/f,this.land[u]=h>0?1:0}this.qv=new Float32Array(i).fill(1),this.qc=new Float32Array(i),this.zp=new Float32Array(i),this.rain=new Float32Array(i),this.wet=new Float32Array(i),this.conv=new Float32Array(i),this.tmp=[new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i)],this.noise=Zc(n),this.noise2=Zc(n+1),this.mode="auto",this.regime="moae",this.state={...Xr.moae},this.wind=new Ut(...Cr(62)).multiplyScalar(8.5),this.windOffset=new Ut,this.simTime=0,this.nextChange=3600*30,this.rainTotal=0,this.data=new Float32Array(i*4),this.texture=new hi(this.data,Ke,Ke,Ve,An),this.texture.minFilter=fe,this.texture.magFilter=fe,this.texture.wrapS=this.texture.wrapT=en,this.texture.needsUpdate=!0,this.rect=new pe(this.origin,this.origin,Bs,Bs),this.accum=0,this.boost=0}setMode(t){this.mode=t,t!=="auto"&&(this.regime=t)}pickRegime(t){const e=Math.random();return t==="hooilo"?e<.62?"moae":e<.8?"malie":"kona":e<.86?"moae":e<.97?"malie":"kona"}step(t,e,n,i,o=!1){if(t<=0)return;if(this.simTime+=t,this.mode==="auto"&&this.simTime>this.nextChange){this.regime=this.pickRegime(i);const w=this.regime==="moae"?30+Math.random()*60:this.regime==="kona"?14+Math.random()*20:10+Math.random()*16;this.nextChange=this.simTime+w*3600}const a=Xr[this.regime],r=1-Math.exp(-t/7200),l=this.state;for(const w of["speed","humidity","lcl","inversion","patch","convect"]){let b=a[w];this.boost&&w==="humidity"&&(b*=1.18),this.boost&&w==="patch"&&(b*=1.6),l[w]+=(b-l[w])*r}let c=a.bearing-l.bearing;c=(c+540)%360-180,l.bearing+=c*r;const h=1+.18*Math.sin((n-9)/24*Math.PI*2),f=1+.12*this.noise(this.simTime/5400,3.3),u=l.bearing+9*this.noise(this.simTime/9e3,7.7),[m,v]=Cr(u),g=l.speed*h*f;this.wind.set(m*g,v*g);const x=m*g/100,p=v*g/100;this.windOffset.x+=x*t,this.windOffset.y+=p*t,this.pending=(this.pending||0)+t;const d=performance.now();if(!o&&d-(this.lastPhysics||0)<80)return;this.lastPhysics=d;const M=this.pending;this.pending=0;const _=Math.hypot(x,p)*M,S=Math.max(1,Math.min(12,Math.ceil(_/(this.cell*1.5))));for(let w=0;w<S;w++)this.substep(M/S,x,p,e);this.pack()}substep(t,e,n,i){const o=Ke,a=this.cell,r=this.state,[l,c,h,f,u]=this.tmp,m=e*t/a,v=n*t/a,g=this.windOffset.x,x=this.windOffset.y;for(let _=0;_<o;_++)for(let S=0;S<o;S++){const w=_*o+S,b=S-m,A=_-v;if(b<0||A<0||b>o-1||A>o-1){const z=this.origin+(b+.5)*a-g,O=this.origin+(A+.5)*a-x,k=Math.hypot(e,n)||1,q=(z*e+O*n)/k,K=(-z*n+O*e)/k,L=H1(this.noise2,q/60,K/24,3);l[w]=r.humidity*(1+r.patch*.55*L),c[w]=Math.max(0,L-.05)*.75*r.patch,h[w]=0,f[w]=0,u[w]=0;continue}const y=Math.min(o-2,b|0),E=Math.min(o-2,A|0),R=b-y,P=A-E,N=E*o+y,T=(1-R)*(1-P),C=R*(1-P),I=(1-R)*P,H=R*P;l[w]=this.qv[N]*T+this.qv[N+1]*C+this.qv[N+o]*I+this.qv[N+o+1]*H,c[w]=this.qc[N]*T+this.qc[N+1]*C+this.qc[N+o]*I+this.qc[N+o+1]*H,h[w]=this.zp[N]*T+this.zp[N+1]*C+this.zp[N+o]*I+this.zp[N+o+1]*H,f[w]=this.conv[N]*T+this.conv[N+1]*C+this.conv[N+o]*I+this.conv[N+o+1]*H,u[w]=this.wet[w]}const p=Math.hypot(e,n)*t*100,d=Math.max(0,i)*r.convect,M=r.lcl;for(let _=0;_<o*o;_++){const S=this.terrain[_];let w=l[_],b=c[_];const A=h[_],y=Math.max(S,A-.24*p);if(y>A){const T=Math.max(0,y-Math.max(A,M)),C=Math.min(w,w*T/650);w-=C,b+=C}else if(y<A){const T=Math.min(b,(A-y)*(.0035*b+35e-5));b-=T,w+=T}let E=f[_]*Math.exp(-t/5400);if(this.land[_]){const T=d*Jc(80,700,S)*(1-.6*Jc(.85,1.2,r.humidity))*45e-7,C=Math.min(w*.2,T*t*w);w-=C,b+=C,E=Math.min(1,E+T*t*4)}else{w+=(r.humidity-w)*(1-Math.exp(-t/2400));const T=Math.max(0,w-r.humidity*1.12)*t*12e-5;w-=T,b+=T}const P=Math.max(0,b-.11)*(1-Math.exp(-t/1500));b-=P,b*=Math.exp(-t/21600);const N=P/Math.max(t,.001)*3600;this.rain[_]=this.rain[_]*.6+N*.4,u[_]=na(u[_]*Math.exp(-t/(3600*5))+N*t/3600*3,0,1),this.qv[_]=w,this.qc[_]=b,this.zp[_]=y,this.conv[_]=E,this.wet[_]=u[_]}}pack(){const t=this.data;let e=0,n=0,i=0;for(let o=0;o<Ke*Ke;o++){const a=na(this.qc[o]*4.2,0,1);t[o*4]=a;const r=na(this.rain[o]*2.2,0,1);t[o*4+1]=r,t[o*4+2]=this.wet[o],t[o*4+3]=this.conv[o],this.land[o]&&(e+=r);const l=r*(.4+this.conv[o]);l>n&&(n=l,i=o)}this.rainTotal=e,this.stormiest={strength:n,x:this.origin+(i%Ke+.5)*this.cell,z:this.origin+(Math.floor(i/Ke)+.5)*this.cell},this.texture.needsUpdate=!0}spawnShower(t,e,n=6,i=.5){const o=this.G,a=(t-this.origin)/this.cell-.5,r=(e-this.origin)/this.cell-.5,l=n/this.cell;for(let c=Math.max(0,Math.floor(r-l));c<=Math.min(o-1,Math.ceil(r+l));c++)for(let h=Math.max(0,Math.floor(a-l));h<=Math.min(o-1,Math.ceil(a+l));h++){const f=Math.hypot(h-a,c-r)/l;if(f>1)continue;const u=c*o+h,m=(1-f*f)*i;this.qc[u]=Math.max(this.qc[u],.12+m*.3),this.rain[u]=Math.max(this.rain[u],m*.6),this.conv[u]=Math.max(this.conv[u],m)}this.pack()}warm(t,e,n,i){for(let o=0;o<t*3600;o+=600)this.step(600,e,n,i,!0)}get base(){return this.state.lcl*Gt}get top(){return this.state.inversion*Gt}}const Ht=.016,he=Gt,wi=qt/mn,vx=wi*.6,ao=.06,Vo=.38,Mx=.2,hs=.3,ih={noa:[7,4.6,5.2],mua:[8,5,5.6],aina:[6,4.2,4.6],kuku:[5,3.6,4],alii:[12,7,7.5]},bu=.45,sh=1.8,Ri={big:{L:44,W:30,tiers:3,rise:1.6},small:{L:26,W:18,tiers:2,rise:1.2}},jr=s=>{const t=s?Ri.big:Ri.small;return[t.L*Ht/2,t.W*Ht/2]},_x=2.6,yx=4.5,wx=2,bx=.8,Sx=.15,ss={house:{reach:1.3,dry:.3,skirt:.06},heiau:{reach:6,dry:.5,skirt:.12},luakini:{reach:9,dry:.5,skirt:.12},koa:{reach:1,dry:.3,skirt:.06},ahu:{reach:2,dry:.3,skirt:.06},imu:{reach:.6,dry:.3,skirt:.06},halau:{reach:.6,dry:.05,skirt:.06},salt:{reach:.8,dry:.1,skirt:0}},oh=.07,Hs=1.6*Ht,ah=.65,Ex=1.5;function qo(s,t,e,n){let i=(e+ut)/qt*t-.5,o=(n+ut)/qt*t-.5;i<0&&(i=0),o<0&&(o=0),i>t-1.001&&(i=t-1.001),o>t-1.001&&(o=t-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=r*t+a,f=s[h]+(s[h+1]-s[h])*l,u=s[h+t]+(s[h+t+1]-s[h+t])*l;return f+(u-f)*c}function Su(s,t,e,n){const i=qt/t,o=(e+ut)/i,a=(n+ut)/i,r=Math.floor(o),l=Math.floor(a),c=o-r,h=a-l;let f,u,m,v;if(r>0&&l>0&&r<t-1&&l<t-1){const g=l*t+r,x=s[g-t-1],p=s[g-t],d=s[g-t+1],M=s[g-1],_=s[g],S=s[g+1],w=s[g+t-1],b=s[g+t],A=s[g+t+1];f=(x+p+M+_)*.25,u=(p+d+_+S)*.25,m=(M+_+w+b)*.25,v=(_+S+b+A)*.25}else{const g=-ut+r*i,x=-ut+l*i;f=qo(s,t,g,x),u=qo(s,t,g+i,x),m=qo(s,t,g,x+i),v=qo(s,t,g+i,x+i)}return r+l&1?c+h<=1?f+(u-f)*c+(m-f)*h:v+(m-v)*(1-c)+(u-v)*(1-h):h>=c?f+(v-m)*c+(m-f)*h:f+(u-f)*c+(v-u)*h}const Tx=s=>Math.min(.11,.009*Math.sqrt(s)+.012)*1.4,Eu=.5,Sn=Math.ceil(qt/Eu),Vn=(s,t)=>t*Sn+s,Re=s=>Math.floor((s+ut)/Eu);let ia=0,sa=1;function Xo(s,t){if(Math.abs(s)<1e-12)return t>=0;const e=t/s;if(s<0){if(e>sa)return!1;e>ia&&(ia=e)}else{if(e<ia)return!1;e<sa&&(sa=e)}return!0}function Ys(s,t,e,n,i,o,a){const r=Math.min(1,Math.max(0,((s-e)*i+(t-n)*o)/a));return Math.hypot(e+i*r-s,n+o*r-t)}const rh=(s,t,e,n)=>Math.hypot(Math.max(0,Math.abs(s)-e),Math.max(0,Math.abs(t)-n));function Ax(s,t,e,n,i,o){const a=e-s,r=n-t;if(ia=0,sa=1,Xo(-a,s+i)&&Xo(a,i-s)&&Xo(-r,t+o)&&Xo(r,o-t))return 0;const l=a*a+r*r||1e-12;return Math.min(rh(s,t,i,o),rh(e,n,i,o),Ys(-i,-o,s,t,a,r,l),Ys(i,-o,s,t,a,r,l),Ys(i,o,s,t,a,r,l),Ys(-i,o,s,t,a,r,l))}function Cx(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}class Tu{constructor(){this.seg=[],this.start=null,this.list=null,this.cells=new Map,this.polys=[],this.polyCells=new Map,this.seen=new Uint32Array(0),this.query=0}line(t,e,n=1,i=0){let o=t[0];for(let a=n;;a+=n){const r=t[Math.min(a,t.length-1)];if(this.segment(o[0],o[1],r[0],r[1],e+i),a>=t.length-1)break;o=r}}segment(t,e,n,i,o){const a=this.seg.length/5;if(this.seg.push(t,e,n,i,o),!this.start)return;const[r,l,c,h]=this.span(a);for(let f=c;f<=h;f++)for(let u=r;u<=l;u++){const m=this.cells.get(Vn(u,f));m?m.push(a):this.cells.set(Vn(u,f),[a])}}span(t,e=[0,0,0,0]){const n=this.seg,i=t*5,o=n[i+4];return e[0]=Math.max(0,Re(Math.min(n[i],n[i+2])-o)),e[1]=Math.min(Sn-1,Re(Math.max(n[i],n[i+2])+o)),e[2]=Math.max(0,Re(Math.min(n[i+1],n[i+3])-o)),e[3]=Math.min(Sn-1,Re(Math.max(n[i+1],n[i+3])+o)),e}freeze(){const t=this.seg.length/5,e=new Int32Array(Sn*Sn+1),n=[0,0,0,0];for(let a=0;a<t;a++){this.span(a,n);for(let r=n[2];r<=n[3];r++)for(let l=n[0];l<=n[1];l++)e[Vn(l,r)+1]++}for(let a=0;a<Sn*Sn;a++)e[a+1]+=e[a];const i=e.slice(0,Sn*Sn),o=new Int32Array(e[Sn*Sn]);for(let a=0;a<t;a++){this.span(a,n);for(let r=n[2];r<=n[3];r++)for(let l=n[0];l<=n[1];l++)o[i[Vn(l,r)]++]=a}return this.start=e,this.list=o,this}outline(t,e){this.line([...t,t[0]],e);const n=this.polys.length;this.polys.push(t);let i=1/0,o=-1/0,a=1/0,r=-1/0;for(const l of t)i=Math.min(i,l[0]),o=Math.max(o,l[0]),a=Math.min(a,l[1]),r=Math.max(r,l[1]);for(let l=Re(a);l<=Re(r);l++)for(let c=Re(i);c<=Re(o);c++){const h=Vn(c,l),f=this.polyCells.get(h);f?f.push(n):this.polyCells.set(h,[n])}}apart(t,e,n,i,o,a,r,l){const c=this.seg,h=t*5,f=c[h+4],u=c[h]-e,m=c[h+1]-n,v=c[h+2]-e,g=c[h+3]-n;return Ys(0,0,u,m,v-u,g-m,(v-u)**2+(g-m)**2||1e-12)-l>=f?!0:Ax(u*i+m*o,-u*o+m*i,v*i+g*o,-v*o+g*i,a,r)>=f}clear(t,e,n,i,o,a){if(!this.seg.length)return!0;this.start||this.freeze();const r=this.seg.length/5;this.seen.length<r&&(this.seen=new Uint32Array(r+1024));const l=++this.query,c=this.seen,h=Math.abs(n)*o+Math.abs(i)*a,f=Math.abs(i)*o+Math.abs(n)*a,u=Math.hypot(o,a),{start:m,list:v}=this,g=this.cells.size>0;for(let x=Re(e-f);x<=Re(e+f);x++)for(let p=Re(t-h);p<=Re(t+h);p++){const d=Vn(p,x);for(let S=m[d];S<m[d+1];S++){const w=v[S];if(c[w]!==l&&(c[w]=l,!this.apart(w,t,e,n,i,o,a,u)))return!1}const M=g&&this.cells.get(d);if(M){for(const S of M)if(c[S]!==l&&(c[S]=l,!this.apart(S,t,e,n,i,o,a,u)))return!1}const _=this.polyCells.get(d);if(_){for(const S of _)if(Cx(this.polys[S],t,e))return!1}}return!0}}function Rx(s,t=null){const e=new Tu;for(const n of s)e.line(n.pts,Math.max(Tx(n.lineA),vx)+ao,2,.01);if(t){for(const n of t.loi)Px(e,n);for(const n of t.ponds)Lx(e,n);t.holua&&kx(e,t.holua)}return e.freeze()}function Px(s,t){for(const e of t.paddies)s.outline(e.poly,.009+ao);for(const e of t.auwai)s.line(e,.008+ao)}function Lx(s,t){s.line(t.wall,.05+ao)}function kx(s,t){s.segment(t.x0,t.z0,t.x1,t.z1,.07+ao)}function us(s,t,e,n,i,o,a,r,l,c,h=0){const f=Math.max(2,Math.ceil((a-o)/.012)),u=Math.max(2,Math.ceil((l-r)/.012));let m=1/0,v=-1/0,g=1/0;const x=(y,E)=>{const R=s(t+y*n-E*i,e+y*i+E*n);R<g&&(g=R);const P=(R>0?R:0)-h*y;P<m&&(m=P),P>v&&(v=P)};for(let y=0;y<f;y++){const E=o+(a-o)*y/f;x(E,r),x(a+o-E,l)}for(let y=0;y<u;y++){const E=r+(l-r)*y/u;x(a,E),x(o,l+r-E)}const p=(o+a)/2,d=(r+l)/2,M=t+p*n-d*i,_=e+p*i+d*n,S=(a-o)/2,w=(l-r)/2,b=Math.abs(n)*S+Math.abs(i)*w,A=Math.abs(i)*S+Math.abs(n)*w;for(let y=Math.ceil((_-A+ut)/wi);y<=Math.floor((_+A+ut)/wi);y++)for(let E=Math.ceil((M-b+ut)/wi);E<=Math.floor((M+b+ut)/wi);E++){const R=-ut+E*wi-t,P=-ut+y*wi-e,N=R*n+P*i,T=-R*i+P*n;N>=o&&N<=a&&T>=r&&T<=l&&x(N,T)}return c.lo=m,c.hi=v,c.wet=g,c.mid=Math.max(0,s(M,_)),c}function jo(s,t,e,n,i,o,a,r,l,c){const h=(o+a)/2,f=(r+l)/2,u=(a-o)/2,m=(l-r)/2;let v=0;for(let g=0;g<24;g++){const x=g/24*Math.PI*2,p=Math.cos(x),d=Math.sin(x),M=Math.min(u/Math.max(1e-6,Math.abs(p)),m/Math.max(1e-6,Math.abs(d))),_=h+p*M,S=f+d*M,w=h+p*(M+c),b=f+d*(M+c),A=Math.max(0,s(t+_*n-S*i,e+_*i+S*n)),y=Math.max(0,s(t+w*n-b*i,e+w*i+b*n));v=Math.max(v,(A-y)/(c*100))}return v}function lh(s,t,e,n,i,o,a,r=0){const l=n*o,c=i*o,h=-i*a,f=n*a,u=Math.max(0,s(t-l-h,e-c-f))+r,m=Math.max(0,s(t+l-h,e+c-f))-r,v=Math.max(0,s(t+l+h,e+c+f))-r,g=Math.max(0,s(t-l+h,e-c+f))+r,x=Math.max(0,s(t,e));return Math.max(u,m,v,g,x)-Math.min(u,m,v,g,x)}function $s(s,t,e,n,i,o,a){const r=Math.cos(e),l=Math.sin(e),c=(n+i)/2,h=(o+a)/2;return{x:s+c*r-h*l,z:t+c*l+h*r,c:r,s:l,hx:(i-n)/2,hz:(a-o)/2}}function Dx(s,t,e){const n=t.x-s.x,i=t.z-s.z;if(Math.hypot(n,i)>Math.hypot(s.hx,s.hz)+Math.hypot(t.hx,t.hz)+e)return!1;const o=[s.c,s.s,-s.s,s.c,t.c,t.s,-t.s,t.c];for(let a=0;a<8;a+=2){const r=o[a],l=o[a+1],c=s.hx*Math.abs(s.c*r+s.s*l)+s.hz*Math.abs(-s.s*r+s.c*l),h=t.hx*Math.abs(t.c*r+t.s*l)+t.hz*Math.abs(-t.s*r+t.c*l);if(Math.abs(n*r+i*l)>c+h+e)return!1}return!0}class zx{constructor(t,e){this.g=t,this.K=e,this.taken=[],this.cells=new Map,this.seen=[],this.query=0,this.steep=0,this.watered=!1,this.G={lo:0,hi:0,mid:0,wet:0},this.B={lo:0,hi:0,mid:0,wet:0},this.means=[0,0,0,0]}block(t,e,n,i,o){this.take({box:$s(t,e,n,-i,i,-o,o)})}take(t){const e=t.box,n=this.taken.length;this.taken.push(e),this.seen.push(0);const i=Math.abs(e.c)*e.hx+Math.abs(e.s)*e.hz,o=Math.abs(e.s)*e.hx+Math.abs(e.c)*e.hz;for(let a=Re(e.z-o);a<=Re(e.z+o);a++)for(let r=Re(e.x-i);r<=Re(e.x+i);r++){const l=this.cells.get(Vn(r,a));l?l.push(n):this.cells.set(Vn(r,a),[n])}return t}free(t){const e=++this.query,n=Math.abs(t.c)*t.hx+Math.abs(t.s)*t.hz+.02,i=Math.abs(t.s)*t.hx+Math.abs(t.c)*t.hz+.02;for(let o=Re(t.z-i);o<=Re(t.z+i);o++)for(let a=Re(t.x-n);a<=Re(t.x+n);a++){const r=this.cells.get(Vn(a,o));if(r){for(const l of r)if(this.seen[l]!==e&&(this.seen[l]=e,Dx(this.taken[l],t,.02)))return!1}}return this.K.clear(t.x,t.z,t.c,t.s,t.hx,t.hz)}fit(t,e,n,i,o,a,r={}){if(t==="heiau"||t==="luakini")return this.heiau(t,e,n,i,o,a,r);if(t==="salt")return this.salt(e,n,i,r);const l=ss[t],c=this.g,h=Math.cos(i),f=Math.sin(i),u=l.reach*.94;let m=0;if(t==="halau"){const w=Math.max(0,c(e-h*o,n-f*o)),b=Math.max(0,c(e+h*o,n+f*o));m=Math.max(-oh,Math.min(oh,(b-w)*he/(2*o)))}const v=m/he*o,g=!!r.force;if(this.steep=lh(c,e,n,h,f,o,a,v)/u,this.steep>1&&!g)return null;const x=$s(e,n,i,-o,o,-a,a);if(!g&&!this.free(x))return null;const p=us(c,e,n,h,f,-o,o,-a,a,this.G,v/o),d=p.lo,M=p.hi;if(!g&&(p.wet<l.dry||M-d>u)||!g&&l.skirt&&jo(c,e,n,h,f,-o,o,-a,a,l.skirt)>Vo)return null;let _,S;return t==="house"?(_=Math.max(p.mid*he+bu*Ht,M*he+Mx*Ht),S=d*he-hs*Ht):t==="ahu"?(_=Math.max(p.mid*he,M*he+.1*Ht),S=d*he-hs*Ht):t==="koa"?(_=Math.max(p.mid*he+.5*Ht,M*he+.15*Ht),S=d*he-hs*Ht):t==="halau"?(_=M*he+.05*Ht,S=_-l.reach*he-.05*Ht):(S=d*he-hs*Ht,_=d*he+.5*Ht),{kind:t,x:e,z:n,rot:i,hx:o,hz:a,top:_,base:S,lean:m,relief:M-d,wet:p.wet,box:x}}forced(t,e,n,i,o,a,r,l=.05,c=Ex){const h=ss[t],f=Math.cos(i),u=Math.sin(i);for(let m=0;m<=r+1e-9;m+=l){const v=m?Math.max(8,Math.round(Math.PI*2*m/l)):1;let g=null;for(let x=0;x<v;x++){const p=(x+.5)/v*Math.PI*2,d=e+Math.cos(p)*m,M=n+Math.sin(p)*m,_=this.fit(t,d,M,i,o,a,{force:!0});_.relief>h.reach*c||g&&_.relief>=g.relief||_.wet<h.dry||jo(this.g,d,M,f,u,-o,o,-a,a,h.skirt)>Vo||!this.free(_.box)||(g=_)}if(g)return g}return null}heiau(t,e,n,i,o,a,r){const l=ss[t],c=this.g,h=Math.cos(i),f=Math.sin(i),u=l.reach*.94;if(lh(c,e,n,h,f,o,a)>u||jo(c,e,n,h,f,-o,o,-a,a,l.skirt)>Vo)return null;const m=us(c,e,n,h,f,-o,o,-a,a,this.G);if(m.wet<l.dry||m.hi-m.lo>u)return null;const v=(r.rise??1.2)*Ht,g=Math.max(m.mid*he+v,m.hi*he+.3*Ht),x=[0,0,0,0],p=this.downhill(e,n,h,f,o,a),d=this.means,M=g/he-Math.min(...d.filter((H,z)=>z!==p)),_=g-this.edgeLow(e,n,h,f,o,a,x,p)*he,S=Math.min(wx,Math.max(0,Math.round(_/(_x*Ht))-1)),w=[],b=this.B;let A=g;for(let H=0;H<S;H++){const z=x[p],O=z+yx*Ht,k=p===0?-o-O:p===1?o+z:-o,q=p===0?-o-z:p===1?o+O:o,K=p===2?-a-O:p===3?a+z:-a,L=p===2?-a-z:p===3?a+O:a;us(c,e,n,h,f,k,q,K,L,b);const B=Math.max(g-_*(H+1)/(S+1),b.hi*he+Sx*Ht);if(B>A-bx*Ht)break;A=B,x[p]=O,w.push({top:A,ext:x.slice()})}const y=-o-x[0],E=o+x[1],R=-a-x[2],P=a+x[3],N=$s(e,n,i,y,E,R,P);if(!this.free(N))return null;const T=w.length?us(c,e,n,h,f,y,E,R,P,b):m;if(T.wet<l.dry||w.length&&jo(c,e,n,h,f,y,E,R,P,l.skirt)>Vo)return null;const C=T.lo*he-hs*Ht,I=w.length?w[0].top-.15*Ht:C;for(let H=0;H<w.length;H++)w[H].bottom=H+1<w.length?w[H+1].top-.15*Ht:C;return{kind:t,x:e,z:n,rot:i,hx:o,hz:a,top:g,base:C,bottom:I,steps:w,main:p,wall:M,relief:m.hi-m.lo,box:N}}downhill(t,e,n,i,o,a){const r=this.g;let l=0,c=1/0;for(let h=0;h<4;h++){const f=h<2,u=h===0?-o:h===1?o:h===2?-a:a,m=f?a:o,v=Math.max(2,Math.ceil(2*m/.035));let g=0;for(let x=0;x<=v;x++){const p=-m+2*m*x/v,d=f?u:p,M=f?p:u;g+=Math.max(0,r(t+d*n-M*i,e+d*i+M*n))}this.means[h]=g/(v+1),this.means[h]<c&&(c=this.means[h],l=h)}return l}edgeLow(t,e,n,i,o,a,r,l){const c=this.g,h=l<2,f=l===0?-o-r[0]:l===1?o+r[1]:l===2?-a-r[2]:a+r[3],u=h?-a-r[2]:-o-r[0],m=h?a+r[3]:o+r[1],v=Math.max(2,Math.ceil((m-u)/.035));let g=1/0;for(let x=0;x<=v;x++){const p=u+(m-u)*x/v,d=h?f:p,M=h?p:f;g=Math.min(g,Math.max(0,c(t+d*n-M*i,e+d*i+M*n)))}return g}salt(t,e,n,i){const o=this.g,a=o(t,e);if(a<ss.salt.dry||a>4)return null;const r=Math.cos(n),l=Math.sin(n),c=$s(t,e,n,-i.hx,i.hx,-i.hz,i.hz);if(!this.free(c))return null;const h=[],f=this.G;for(const[u,m]of i.pans){const v=t+u*r-m*l,g=e+u*l+m*r;if(us(o,v,g,r,l,-i.ph,i.ph,-i.pv,i.pv,f),f.wet<ss.salt.dry||f.hi-f.lo>ss.salt.reach*.94)return null;h.push({x:v,z:g,top:Math.max(f.mid*he+.2*Ht,f.hi*he+.05*Ht),base:f.lo*he-.25*Ht})}return{kind:"salt",x:t,z:e,rot:n,hx:i.hx,hz:i.hz,pans:h,box:c}}settle(t,e,n,i,o,a,r,l={}){const c=l.keep||(()=>!0);for(const f of i){if(!c(e,n))break;const u=this.fit(t,e,n,f,o,a,l);if(u)return u}const h=l.step||Math.max(.05,Math.min(o,a)*.8);for(let f=(l.from||0)+h;f<=r+1e-9;f+=h){const u=Math.max(8,Math.round(Math.PI*2*f/h));let m=null;for(let v=0;v<u;v++){const g=(v+.5)/u*Math.PI*2,x=e+Math.cos(g)*f,p=n+Math.sin(g)*f;if(c(x,p)){this.steep=0;for(const d of i){const M=this.fit(t,x,p,d,o,a,l);if(M&&(!m||M.relief<m.relief)&&(m=M),this.steep>1.6)break}}}if(m)return m}return null}}const ur=(s,t)=>[(s+sh)*Ht/2,(t+sh)*Ht/2],fr=s=>{const t=Math.sin(s*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Fx(s,t){const{data:e,meta:n}=s,i=(o,a)=>Su(e.height,mn,o,a);return Ix(new zx(i,new Tu),n.sites,n.ahu,()=>Rx(t,n.sites))}function Ix(s,t,e,n){const i=[],o={moved:0,dropped:0},a=d=>[d,d+Math.PI/2],r=(d,M,_,S,w,b,A,y)=>{if(n){const R=s.fit(d,M,_,S[0],w,b,y);if(R)return R;s.watered||(s.K=n(),s.watered=!0)}const E=s.settle(d,M,_,S,w,b,A,y);return E&&(Math.abs(E.x-M)>1e-6||Math.abs(E.z-_)>1e-6)&&o.moved++,E},l=(d,M)=>{d.splice(d.indexOf(M),1),o.dropped++},c=[...t.heiau].sort((d,M)=>(M.model?1:0)-(d.model?1:0));for(const d of c){const M=d.kind==="luakini",_=M?Ri.big:Ri.small,[S,w]=jr(M),b=r(M?"luakini":"heiau",d.x,d.z,[d.rot,d.rot+.25,d.rot-.25],S,w,d.model?2.5:1.2,{rise:_.rise});if(!b){if(d.model){const A=s.take(Ux(s,d,_));d.court=A.top+(_.tiers-1)*_.rise*Ht,i.push(A)}else l(t.heiau,d);continue}d.x=b.x,d.z=b.z,d.rot=b.rot,d.court=b.top+(_.tiers-1)*_.rise*Ht,i.push(s.take({...b,big:M,dims:_,tag:`${d.kind} a${d.id}${d.model?" model":""}`}))}if(t.puuhonua){const d=t.puuhonua,M=Math.cos(d.dir),_=Math.sin(d.dir),S=d.x-M*1.6,w=d.z-_*1.6,b=P=>(N,T)=>(N-S)*M+(T-w)*_>P,A=Ri.small,[y,E]=jr(!1);if(d.heiau!==null){const P=d.heiau||{x:d.x-M*.5,z:d.z-_*.5,rot:d.dir},N=r("heiau",P.x,P.z,[P.rot,P.rot+.25,P.rot-.25],y,E,.9,{rise:A.rise,keep:b(.32)});d.heiau=N?{x:N.x,z:N.z,rot:N.rot,court:N.top+(A.tiers-1)*A.rise*Ht}:null,N&&i.push(s.take({...N,big:!1,dims:A,tag:"puuhonua"}))}const R=[];for(let P=0;P<3;P++){if(d.houses&&!d.houses[P])continue;const[N,T]=ur(6,4),C=d.houses?d.houses[P]:{x:S+M*.5-_*(P-1)*.6,z:w+_*.5+M*(P-1)*.6,rot:d.dir+Math.PI/2},I=r("house",C.x,C.z,a(C.rot),N,T,.5,{keep:b(.15)});R.push(I?{x:I.x,z:I.z,rot:I.rot}:null),I&&i.push(s.take({...I,dims:[6,4,4.2],tag:"puuhonua"}))}d.houses=R}for(const d of t.canoes){if(!d.house)continue;const M=d.shed||{x:d.x-Math.cos(d.dir)*.32,z:d.z-Math.sin(d.dir)*.32,rot:d.dir},_=r("halau",M.x,M.z,[M.rot,M.rot+.3,M.rot-.3],8.2*Ht,3.3*Ht,.5);if(!_){d.house=!1,o.dropped++;continue}d.shed={x:_.x,z:_.z,rot:_.rot},i.push(s.take({..._,tag:`v${d.village}`}))}for(const d of t.ponds){if(d.keeper===null)continue;const M=d.gates[0]<.5?d.wall[0]:d.wall[d.wall.length-1],_=d.keeper||{x:M[0]-d.ax*.16,z:M[1]-d.az*.16,rot:Math.atan2(d.az,d.ax)+Math.PI/2},[S,w]=ur(4,3),b=r("house",_.x,_.z,a(_.rot),S,w,.5);d.keeper=b?{x:b.x,z:b.z,rot:b.rot}:null,b&&i.push(s.take({...b,dims:[4,3,3.4],tag:"pond keeper"}))}for(const d of t.koa){const M=d.rot??fr(d.x*3.1+d.z)*6.28,_=r("koa",d.x,d.z,a(M),1.6*Ht,1.2*Ht,.8)||r("koa",d.x,d.z,a(M),1.6*Ht,1.2*Ht,1.6,{from:.8,step:.08})||s.fit("koa",d.x,d.z,M,1.6*Ht,1.2*Ht,{force:!0});d.x=_.x,d.z=_.z,d.rot=_.rot,i.push(s.take({..._,tag:`a${d.id}`}))}const h=[...t.houses].sort((d,M)=>(M.kind==="alii"?1:0)-(d.kind==="alii"?1:0)),f=new Map(t.villages.map(d=>[d.id,d])),u=new Map,m=[],v=(d,M)=>{const _=d.scale||1,[S,w,b]=ih[d.kind]||ih.noa,[A,y]=ur(S*_,w*_),E=M&&f.get(d.village),R=E?Math.max(.9,Math.hypot(d.x-E.x,d.z-E.z))+.3:1/0,P=E?(T,C)=>Math.hypot(T-E.x,C-E.z)<=R:void 0,N=r("house",d.x,d.z,a(d.rot),A,y,.45,{keep:P})||r("house",d.x,d.z,a(d.rot),A,y,1.1,{from:.45,step:.08,keep:P});return N?(d.x=N.x,d.z=N.z,d.rot=N.rot,u.set(d.village,(u.get(d.village)||0)+1),i.push(s.take({...N,dims:[S*_,w*_,b*_],tag:`${d.kind} v${d.village}`})),!0):!1};for(const d of h)v(d,!0)||m.push(d);for(const d of m)((u.get(d.village)||0)>0||!v(d,!1))&&l(t.houses,d);for(const d of e){const M=d.rot??fr(d.x*3.1+d.z)*6.28,_=d.a===t.model||d.b===t.model;let S=null;if(!d.small&&!d.forced&&(S=r("ahu",d.x,d.z,[M],Hs,Hs,.25,{step:.05})),!S&&!d.small&&(d.forced||_)&&(S=s.forced("ahu",d.x,d.z,M,Hs,Hs,d.forced?0:.25,.05,1),S&&(d.forced=!0)),!S){d.small=!0;const w=Hs*ah;d.forced||(S=r("ahu",d.x,d.z,[M],w,w,.25,{step:.05})),S||(S=s.forced("ahu",d.x,d.z,M,w,w,d.forced?0:.8)||s.fit("ahu",d.x,d.z,M,w,w,{force:!0}),d.forced=!0)}d.x=S.x,d.z=S.z,d.rot=S.rot,i.push(s.take({...S,size:d.small?ah:1,forced:!!d.forced,tag:`${d.a}|${d.b}`}))}for(const d of t.villages){if(d.imu===null)continue;const M=fr(d.id+.5)*Math.PI*2,_=d.imu||{x:d.x+Math.cos(M)*.35,z:d.z+Math.sin(M)*.35},S=r("imu",_.x,_.z,[0],1.3*Ht,1.3*Ht,.35);d.imu=S?{x:S.x,z:S.z}:null,S&&i.push(s.take({...S,tag:`v${d.id}`}))}const g=[];for(let d=0;d<4;d++)for(let M=0;M<3;M++)g.push([(d-1.5)*.11,(M-1)*.09]);const x={pans:g,ph:3.3*Ht,pv:2.7*Ht,hx:.165+.053,hz:.09+.043},p=(d,M)=>t.villages.every(_=>Math.hypot(_.x-d,_.z-M)>.6);for(const d of[...t.saltpans]){const M=r("salt",d.x,d.z,[d.dir+Math.PI/2],x.hx,x.hz,6,{...x,keep:p,step:.15});if(!M){l(t.saltpans,d);continue}d.x=M.x,d.z=M.z,i.push(s.take(M))}return{list:i,...o}}function Ux(s,t,e){const[n,i]=jr(!0),o=Math.cos(t.rot),a=Math.sin(t.rot),r=us(s.g,t.x,t.z,o,a,-n,n,-i,i,{lo:0,hi:0,mid:0,wet:0}),l=Math.max(r.mid*he+e.rise*Ht,r.hi*he+.3*Ht),c=r.lo*he-hs*Ht;return{kind:"luakini",x:t.x,z:t.z,rot:t.rot,hx:n,hz:i,top:l,base:c,bottom:c,steps:[],relief:r.hi-r.lo,box:$s(t.x,t.z,t.rot,-n,n,-i,i),big:!0,dims:e,tag:"luakini model"}}function Au(s,t,e,n=1){let i=Float32Array.from(s),o=new Float32Array(t*t);const a=1/(2*e+1);for(let r=0;r<n;r++){for(let l=0;l<t;l++){const c=l*t;let h=0;for(let f=-e;f<=e;f++)h+=i[c+Math.min(t-1,Math.max(0,f))];for(let f=0;f<t;f++)o[c+f]=h*a,h+=i[c+Math.min(t-1,f+e+1)]-i[c+Math.max(0,f-e)]}for(let l=0;l<t;l++){let c=0;for(let h=-e;h<=e;h++)c+=o[Math.min(t-1,Math.max(0,h))*t+l];for(let h=0;h<t;h++)i[h*t+l]=c*a,c+=o[Math.min(t-1,h+e+1)*t+l]-o[Math.max(0,h-e)*t+l]}}return i}function ch(s,t,e,n,i){let o=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let a=1;a<t;a++){let r=(s[a]+a*a-(s[n[o]]+n[o]*n[o]))/(2*a-2*n[o]);for(;r<=i[o];)o--,r=(s[a]+a*a-(s[n[o]]+n[o]*n[o]))/(2*a-2*n[o]);o++,n[o]=a,i[o]=r,i[o+1]=1/0}o=0;for(let a=0;a<t;a++){for(;i[o+1]<a;)o++;const r=a-n[o];e[a]=r*r+s[n[o]]}}function Nx(s,t){const n=new Float64Array(s*s);for(let c=0;c<s*s;c++)n[c]=t(c)?0:1e20;const i=new Float64Array(s),o=new Float64Array(s),a=new Int32Array(s),r=new Float64Array(s+1);for(let c=0;c<s;c++){for(let h=0;h<s;h++)i[h]=n[h*s+c];ch(i,s,o,a,r);for(let h=0;h<s;h++)n[h*s+c]=o[h]}const l=new Float32Array(s*s);for(let c=0;c<s;c++){const h=c*s;for(let f=0;f<s;f++)i[f]=n[h+f];ch(i,s,o,a,r);for(let f=0;f<s;f++)l[h+f]=Math.sqrt(o[f])}return l}const Ox=[{name:"Koʻolau",gloss:"windward",from:345,to:105},{name:"Puna",gloss:"the sunrise side",from:105,to:165},{name:"Kona",gloss:"leeward",from:165,to:255},{name:"Waialua",gloss:"the northwest side",from:255,to:345}],hh=[{key:"akua",name:"Wao akua",gloss:"realm of the gods"},{key:"nahele",name:"Wao nahele",gloss:"the forest"},{key:"kanaka",name:"Wao kanaka",gloss:"realm of people"},{key:"kula",name:"Kula",gloss:"open dry plains"},{key:"kahakai",name:"Kahakai",gloss:"the shore"},{key:"kohola",name:"Kai kohola",gloss:"reef shallows"},{key:"uli",name:"Kai uli",gloss:"deep blue sea"}];function Bx(s,t,e=!1){for(let n=0;n<t;n++){if(s.length<3)return s;const i=e?[]:[s[0]],o=s.length,a=e?o:o-1;for(let r=0;r<a;r++){const l=s[r],c=s[(r+1)%o];i.push([l[0]*.75+c[0]*.25,l[1]*.75+c[1]*.25]),i.push([l[0]*.25+c[0]*.75,l[1]*.25+c[1]*.75])}e||i.push(s[o-1]),s=i}return s}function Ea(s,t){const e=new Set,n=.2,i=(v,g)=>Math.floor(v/n)*100003+Math.floor(g/n),o=(v,g)=>{for(let x=-2;x<=2;x++)for(let p=-2;p<=2;p++)if(e.has(i(v+p*n,g+x*n)))return!0;return!1},a=v=>{for(let g=1;g<v.length;g++){const[x,p]=v[g-1],[d,M]=v[g],_=Math.ceil(Math.hypot(d-x,M-p)/(n*.5));for(let S=0;S<=_;S++)e.add(i(x+(d-x)*S/_,p+(M-p)*S/_))}},r=le,l=qt/r,c=(v,g)=>{const x=Math.floor((v+ut)/l),p=Math.floor((g+ut)/l);let d=0;for(let M=Math.max(0,p-1);M<=Math.min(r-1,p+1);M++)for(let _=Math.max(0,x-1);_<=Math.min(r-1,x+1);_++)d=Math.max(d,t.area[M*r+_]);return d},h=t.height1024?(v,g)=>Wx(t.height1024,r,v,g):null,f=[],u=Hx(f),m=s.streams.map((v,g)=>({s:v,k:g})).filter(({s:v})=>v.area>=.9&&v.pts.length>=3).sort((v,g)=>g.s.area-v.s.area);for(const{s:v,k:g}of m){let x=v.pts.length;for(let y=0;y<v.pts.length;y++)if(o(v.pts[y][0],v.pts[y][1])){x=y+1;break}if(x<3)continue;let p=v.pts.slice(0,x).map(y=>[y[0],y[1]]);const d=x<v.pts.length||!v.mouth?Gx(v.pts,x,p,f,u,h):null,M=p.length-(d?d.added:0);a(p),p=Bx(p,2);const _=new Float32Array(p.length),S=new Float32Array(p.length),w=d?4*(M-1):p.length;let b=0;for(let y=0;y<p.length;y++)y>0&&(_[y]=_[y-1]+Math.hypot(p[y][0]-p[y-1][0],p[y][1]-p[y-1][1])),y<w&&(b=Math.max(b,c(p[y][0],p[y][1]))),S[y]=b;const A={src:g,pts:p,along:_,area:S,lineA:v.area};d&&(A.join={line:d.line,s:d.s}),f.push(A),u.add(f.length-1)}return f}function Hx(s){const e=new Map,n=(i,o)=>i*100003+o;return{add(i){const{pts:o}=s[i];for(let a=1;a<o.length;a++){const r=Math.floor(Math.min(o[a-1][0],o[a][0])/.5),l=Math.floor(Math.max(o[a-1][0],o[a][0])/.5),c=Math.floor(Math.min(o[a-1][1],o[a][1])/.5),h=Math.floor(Math.max(o[a-1][1],o[a][1])/.5);for(let f=c;f<=h;f++)for(let u=r;u<=l;u++){const m=n(u,f);let v=e.get(m);v||e.set(m,v=[]),v.push(i,a-1)}}},nearest(i,o,a){let r=null;for(let l=Math.floor((o-a)/.5);l<=Math.floor((o+a)/.5);l++)for(let c=Math.floor((i-a)/.5);c<=Math.floor((i+a)/.5);c++){const h=e.get(n(c,l));if(h)for(let f=0;f<h.length;f+=2){const u=h[f],m=h[f+1],{pts:v,along:g}=s[u],x=v[m][0],p=v[m][1],d=v[m+1][0]-x,M=v[m+1][1]-p,_=d*d+M*M||1e-12,S=Math.max(0,Math.min(1,((i-x)*d+(o-p)*M)/_)),w=x+d*S,b=p+M*S,A=Math.hypot(w-i,b-o);A<=a&&(!r||A<r.d)&&(r={li:u,seg:m,t:S,d:A,x:w,z:b,s:g[m]+(g[m+1]-g[m])*S})}}return r}}}function dr(s,t){const{pts:e,along:n}=s;let i=0,o=e.length-1;for(t=Math.max(0,Math.min(n[o],t));o-i>1;){const h=i+o>>1;n[h]<=t?i=h:o=h}const a=(t-n[i])/(n[o]-n[i]||1),r=e[o][0]-e[i][0],l=e[o][1]-e[i][1],c=Math.hypot(r,l)||1;return{x:e[i][0]+r*a,z:e[i][1]+l*a,ux:r/c,uz:l/c}}function Gx(s,t,e,n,i,o){let a=e[e.length-1];const r=i.nearest(a[0],a[1],1);if(!r)return null;let l=n[r.li],c=l.along[l.along.length-1];const h=e[Math.max(0,e.length-3)];let f=a[0]-h[0],u=a[1]-h[1];const m=Math.hypot(f,u)||1;f/=m,u/=m;const{ux:v,uz:g}=dr(l,r.s);let x;if(r.d<1e-4)x=r.s;else{const w=(r.x-a[0])/r.d,b=(r.z-a[1])/r.d,A=f*w+u*b,y=A>.3?r.d/A*(f*v+u*g):r.d*1.2;x=r.s+Math.max(r.d*.4,Math.min(r.d*1.6,y))}if(x=Math.min(x,c),l.join&&x>c-.6){const{line:w,s:b}=l.join;r.li=w,l=n[w],c=l.along[l.along.length-1],x=Math.min(c,b+.1)}if(o){let w=1/0;for(const P of e)w=Math.min(w,o(P[0],P[1]));const b=s[s.length-1],A=i.nearest(b[0],b[1],.6),y=Math.min(c,x+4,Math.max(x,A&&A.li===r.li?A.s+.3:x));let E=x,R=1/0;for(let P=x;P<=y+1e-6;P+=.05){const N=dr(l,P),T=o(N.x,N.z);if(T<R&&(R=T,E=P),T<=w+.5)break}x=E}let p=0;for(let w=t;w<s.length-1;w++){const b=i.nearest(s[w][0],s[w][1],1);if(!b||b.li!==r.li||b.d<.15||b.s+Math.max(.3,b.d*1.6)>=x)break;e.push([s[w][0],s[w][1]]),p++}a=e[e.length-1];const d=dr(l,x),M=e[Math.max(0,e.length-3)];f=a[0]-M[0],u=a[1]-M[1];const _=Math.hypot(f,u)||1;f/=_,u/=_;const S=Math.hypot(d.x-a[0],d.z-a[1]);if(S>1e-4){const w=(d.x-a[0])/S,b=(d.z-a[1])/S;if(f*w+u*b<.3){f=f*.3+w,u=u*.3+b;const I=Math.hypot(f,u);f/=I,u/=I}let A=w+d.ux,y=b+d.uz;const E=Math.hypot(A,y)||1;A/=E,y/=E;const R=a[0]+f*S*.35,P=a[1]+u*S*.35,N=d.x-A*S*.35,T=d.z-y*S*.35,C=Math.max(1,Math.ceil(S/.15));for(let I=1;I<C;I++){const H=I/C,z=1-H;e.push([z*z*z*a[0]+3*z*z*H*R+3*z*H*H*N+H*H*H*d.x,z*z*z*a[1]+3*z*z*H*P+3*z*H*H*T+H*H*H*d.z]),p++}}return S>1e-4?(e.push([d.x,d.z]),p++):e[e.length-1]=[d.x,d.z],{line:r.li,s:x,added:p}}function Wx(s,t,e,n){let i=(e+ut)/qt*t-.5,o=(n+ut)/qt*t-.5;i<0?i=0:i>t-1.001&&(i=t-1.001),o<0?o=0:o>t-1.001&&(o=t-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=r*t+a,f=s[h]+(s[h+1]-s[h])*l,u=s[h+t]+(s[h+t+1]-s[h+t])*l;return f+(u-f)*c}const Vx=`
${qe}
in vec3 aFlow; // x along-stream distance, y perennial (0..1), z steepness (0..1)
in float aSide;
in float aFade; // 1, or less where a waterfall takes over
in float aTau; // seconds the water takes to get here from the source
in vec4 aJoin; // in a confluence: x signed distance off the joined stream's centre, in its half-widths; y its perennial; z its fade there; w how far the drawn ground stands over this water
uniform sampler2D uWeather;
uniform vec4 uWeatherRect;
out vec3 vWorld;
out vec3 vFlow;
out float vSide;
out float vWet;
out float vFade;
out float vTau;
out vec3 vJoin;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  // far off, the terrain's coarser LOD fills the narrow channels in; draw the
  // water a little toward the eye so it isn't swallowed by its own valley
  vec3 toCam = cameraPosition - wp.xyz;
  float dc = length(toCam);
  float lift = min(dc * 0.015, 1.2);
  // and where a tributary runs through the bank of the stream it joins,
  // over a ridge only the drawn terrain has (the beds are cut through it,
  // but the mesh through the texel corners can't show a cut that narrow),
  // draw it over the ridge rather than under it
  lift += aJoin.w * 1.3 * dc / max(toCam.y, 0.25 * dc);
  wp.xyz += toCam / max(dc, 1e-3) * lift;
  vFlow = aFlow;
  vSide = aSide;
  vFade = aFade;
  vTau = aTau;
  vJoin = aJoin.xyz;
  vec4 w = texture(uWeather, (wp.xz - uWeatherRect.xy) / uWeatherRect.zw);
  vWet = w.b; // the ground's memory of recent rain
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,qx=`
${qe}
${ti}
${vn}
${ei}
uniform float uFlowAll; // island-wide recent rain
in vec3 vWorld;
in vec3 vFlow;
in float vSide;
in float vWet;
in float vFade;
in float vTau;
in vec3 vJoin;
void main() {
  if (vFade < 0.003) discard;
  float flow = clamp(vFlow.y + vWet * 1.4 + uFlowAll * 0.5, 0.0, 1.0);
  if (flow < 0.06) discard;
  // the wetted width grows with the flow; edges thin out
  float edge = 1.0 - smoothstep(flow * 0.3, flow * 0.55 + 0.4, abs(vSide));
  if (edge <= 0.01) discard;
  float steep = vFlow.z;
  vec3 V = normalize(cameraPosition - vWorld);
  // the pattern rides with the water: its phase is when the water passing
  // here left the source (so it is drawn out where the stream runs fast)
  float left = uTime - vTau;
  vec2 q = vec2(left * 2.0, vSide * 3.0);
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
  float streaks = mix(1.0, 0.45 + 0.55 * smoothstep(0.2, 0.7, vnoise(vec2(vSide * 9.0, left * 1.3))), steep);
  float a = edge * mix(0.7, 0.55, steep) * streaks * smoothstep(0.06, 0.3, flow) * vFade;
  // fade with distance so far-off falls are a sheen, not a painted line
  a *= 1.0 - smoothstep(12.0, 60.0, distance(cameraPosition, vWorld)) * 0.8;
  // a tributary gives way to the stream it runs into across that stream's
  // wetted width: drawn over it at a (1 - c) / (1 - c a), where the stream
  // covers c, the two together come to what either alone would be, with no
  // bright overlap and no thin seam between them
  // (the distance comes signed, so that it interpolates true across a
  // triangle the stream's centreline runs through)
  float dj = abs(vJoin.x);
  if (dj < 4.0) {
    float flowJ = clamp(vJoin.y + vWet * 1.4 + uFlowAll * 0.5, 0.0, 1.0);
    float c = (1.0 - smoothstep(flowJ * 0.3, flowJ * 0.55 + 0.4, dj)) * smoothstep(0.06, 0.3, flowJ) * vJoin.z;
    a *= (1.0 - c) / max(1.0 - c * a, 1e-3);
  }
  gl_FragColor = vec4(col, a);
}
`;function Xx(s,t){let e=1;for(const n of s){if(t>n.h0&&t<n.h1)return 0;t<=n.h0&&n.r0>0&&(e=Math.min(e,1-Gn(((t-(n.h0-n.r0))/n.r0-.15)/.85))),t>=n.h1&&n.r1>0&&(e=Math.min(e,Gn((t-n.h1)/n.r1/.85)))}return e}const Gn=s=>s<=0?0:s>=1?1:s*s*(3-2*s);function jx(s,t,e=[],n=0){const i=s.pts.length,o=s.along[i-1],a=d=>t.some(M=>d>M.h0+1e-6&&d<M.h1-1e-6),r=t.length?t.flatMap(d=>[d.h0-d.r0,d.h0-d.r0*.85,d.h0-d.r0*.45,d.h0,d.h1,d.h1+d.r1*.4,d.h1+d.r1*.85,d.h1+d.r1]).filter(d=>d>1e-6&&d<o-1e-6).sort((d,M)=>d-M):Yx,l=[],c=[];let h=0;for(let d=0;d<i;d++){const M=s.along[d];if(!(d>0&&d<i-1&&(M<=.008||M>=o-.008||uh(r,M,.004)))){for(;h<r.length&&r[h]<M;h++)l.push(r[h]),c.push(-1);l.push(M),c.push(d)}}let f=l,u=c;if(e.length){f=[],u=[];let d=0;for(const M of e)if(!(M<=1e-6||M>=o-1e-6||uh(l,M,n))){for(;d<l.length&&l[d]<M;d++)f.push(l[d]),u.push(c[d]);f.push(M),u.push(-1)}for(;d<l.length;d++)f.push(l[d]),u.push(c[d])}const m=[],v=[],g=[],x=[];let p=-1/0;for(let d=0;d<f.length;d++){const M=f[d];if(M-p<1e-6)continue;p=M;const _=a(M);m.push(u[d]>=0?s.pts[u[d]]:$x(s,M,[0,0])),v.push(M),g.push(_),x.push(_?0:Xx(t,M))}return{pts:m,along:v,gone:g,fade:x}}const Yx=[];function uh(s,t,e){let n=0,i=s.length;for(;n<i;){const o=n+i>>1;s[o]<t?n=o+1:i=o}return n<s.length&&s[n]-t<e||n>0&&t-s[n-1]<e}function fh(s,t,e,n,i){const o=Math.min(1,Math.max(0,(n-t[e])/(t[e+1]-t[e]||1)));return i[0]=s[e][0]+(s[e+1][0]-s[e][0])*o,i[1]=s[e][1]+(s[e+1][1]-s[e][1])*o,i}function $x(s,t,e){const{pts:n,along:i}=s;let o=0,a=n.length-1;if(t<=0)o=a=0;else if(t>=i[a])o=a;else for(;a-o>1;){const l=o+a>>1;i[l]<=t?o=l:a=l}const r=a===o?0:(t-i[o])/(i[a]-i[o]);return e[0]=n[o][0]+(n[a][0]-n[o][0])*r,e[1]=n[o][1]+(n[a][1]-n[o][1])*r,e}const dh=.11,Kx=.22,ph=[-1,1];function pr(s,t,e,n,i){const{pts:o,along:a}=s;let r=0,l=o.length-1;for(;l-r>1;){const u=r+l>>1;a[u]<=n?r=u:l=u}let c=1/0,h=0,f=0;for(let u=r;u<o.length-1&&a[u]<=i;u++){const m=o[u][0],v=o[u][1],g=o[u+1][0]-m,x=o[u+1][1]-v,p=g*g+x*x||1e-12,d=Math.min(1,Math.max(0,((t-m)*g+(e-v)*x)/p)),M=t-m-g*d,_=e-v-x*d,S=M*M+_*_;S<c&&(c=S,h=a[u]+(a[u+1]-a[u])*d,f=(g*_-x*M)/Math.sqrt(p))}return{d:Math.sqrt(c),s:h,u:f}}function mr(s,t){const{s:e}=s,n=e.length-1;if(n<0||t<e[0]-.05||t>e[n]+.05)return null;let i=0,o=n;if(t<=e[0])o=0;else if(t>=e[n])i=n;else{for(;o-i>1;){const l=i+o>>1;e[l]<=t?i=l:o=l}if(!s.joined[o])return null}const a=o===i?0:(t-e[i])/(e[o]-e[i]),r=l=>l[i]+(l[o]-l[i])*a;return{y:r(s.y),hm:r(s.hm),w:r(s.w),steep:r(s.steep),fade:r(s.fade),y0:r(s.y0),y1:r(s.y1)}}const mh=s=>Math.min(.11,.009*Math.sqrt(s)+.012),gh=.03,xh=.3;class vi{constructor(t,e){this.a=new t(Math.ceil(e)),this.n=0}room(t){if(this.n+t<=this.a.length)return;const e=new this.a.constructor(Math.max(this.a.length*2,this.n+t));e.set(this.a),this.a=e}push1(t){this.room(1),this.a[this.n++]=t}push3(t,e,n){this.room(3);const i=this.a;i[this.n]=t,i[this.n+1]=e,i[this.n+2]=n,this.n+=3}push4(t,e,n,i){this.room(4);const o=this.a;o[this.n]=t,o[this.n+1]=e,o[this.n+2]=n,o[this.n+3]=i,this.n+=4}done(){return this.a.slice(0,this.n)}}class Zx{constructor(t){var E,R,P,N;const e=t.island.meta,n=t.terrain,i=((E=t.wailele)==null?void 0:E.lines)||Ea(e,t.island.data);let o=64;for(const T of i)o+=T.pts.length*2.4;const a=new vi(Float32Array,o*3),r=new vi(Float32Array,o*3),l=new vi(Float32Array,o),c=new vi(Float32Array,o),h=new vi(Float32Array,o),f=new vi(Float32Array,o*4),u=[],m=new vi(Uint32Array,o*3);let v=0;const g=(R=t.wailele)==null?void 0:R.cuts;this.cutTris=0;const x=[],p=[];for(const T of i)T.join&&(p[P=T.join.line]||(p[P]=[])).push(T.join.s);const d=[0,0],M=[0,0],_=[0,0],S=[0,0],w=[0,0],b=[0,0],A=[0,0];for(let T=0;T<i.length;T++){const C=i[T],I=(g==null?void 0:g.get(T))||[],H=C.along[C.along.length-1],z=C.join&&x[C.join.line],O=z&&i[C.join.line],k=[];let q=0,K=0,L=0,B=0;if(z){const ft=C.pts[C.pts.length-1],bt=mr(z,C.join.s);q=bt&&bt.fade>.02&&bt.hm>n.metresAt(ft[0],ft[1])-2?1:2,L=bt?bt.w:mh(O.lineA),K=Math.min(H,q===1?5*L+.04:2*L+.04);const Jt=Math.min(.05,Math.max(.02,L*.8));for(let re=H-K;re<H-Jt*.5;re+=Jt)k.push(re);B=Math.max(.008,Jt*.4)}const G=C.join?C.join.s-K-.1:0,$=C.join?C.join.s+.15:0,{pts:Q,along:st,gone:j,fade:X}=jx(C,I,k,B);let ot=99;if(q===1){const ft=st.findIndex(bt=>bt>=H-K-1e-6);ft>=0&&pr(O,Q[ft][0],Q[ft][1],G,$).u<0&&(ot=-99)}const V=C.lineA,xt=Math.min(1,Math.max(0,(Math.log10(V)-.35)/.9)),pt=mh(V),vt=I.map(ft=>ft.h1),mt=I.some(ft=>ft.h0-ft.r0<xh)?0:xh,Nt=(N=p[T])==null?void 0:N.sort((ft,bt)=>ft-bt),rt=Nt&&{s:[],y:[],hm:[],w:[],steep:[],fade:[],joined:[],y0:[],y1:[],per:xt};rt&&(x[T]=rt);let U=0,D=-2,Z=1/0,ct=-1,lt=!1,dt=1/0,At=1/0;const yt=[1/0,1/0];let gt=0,Ct=0,zt=dh;const ht=C.along,ee=C.pts,Wt=ee.length-1;let Ot=0,Pt=0;for(let ft=0;ft<Q.length;ft++){const bt=st[ft],Jt=Math.max(0,bt-gh),re=Math.min(H,bt+gh);for(;Ot<Wt-1&&ht[Ot+1]<Jt;)Ot++;for(;Pt<Wt-1&&ht[Pt+1]<re;)Pt++;fh(ee,ht,Ot,Jt,d),fh(ee,ht,Pt,re,M);const Xt=M[0]-d[0],Mt=M[1]-d[1],Y=Math.hypot(Xt,Mt)||1,St=-Mt/Y,Et=Xt/Y,Ft=Q[ft][0],Lt=Q[ft][1];let Qt=n.metresAt(Ft,Lt);if(Qt<-.5)break;if(j[ft]){lt=!1,dt=At=yt[0]=yt[1]=1/0;continue}for(const It of I)It.level!==void 0&&Math.abs(bt-It.h1)<1e-6&&(Z=It.level,ct=It.h1+1);bt<=ct&&(Qt=Math.min(Qt,Z),Z=Qt),Qt=dt=Math.min(Qt,dt);const se=Q[Math.min(Q.length-1,ft+2)],Ae=(Qt-n.metresAt(se[0],se[1]))/Math.max(10,Math.hypot(se[0]-Ft,se[1]-Lt)*100);let me=Math.min(1,Math.max(0,(Ae-.08)/.5));for(const It of vt)bt>It-1e-6&&bt<=It+.4&&(me=Math.max(me,1-(bt-It)/.4));let ne=null,Pe=0,Ne=1,Fi=1,Mn=null;if(q&&bt>=H-K-1e-6)if(Mn=pr(O,Ft,Lt,G,$),q===1){ne=mr(z,Mn.s);const It=ne?ne.w:L;Pe=1-Gn((Mn.d/It-1)/1.5),Ne=Gn(Mn.d/It/1.2),ne&&(me+=(ne.steep-me)*Pe)}else Fi=Gn((Mn.d/L-.3)/1.5),Ne=.3+.7*Fi;const Ii=mt?Gn(bt/mt):1,Ui=pt*(1+me*.4)*Ne*(.25+.75*Ii),Ni=Gn(Ne/.3);if(Nt)for(;U<Nt.length&&Nt[U]+.35<bt;)U++;const Ls=Nt&&U<Nt.length&&Nt[U]-1.1<=bt;let Cn=Math.max(Qt,0)*Gt+.012+me*.03;ne&&(Cn+=Math.min(0,ne.y-Cn)*Pe),Cn=At=Math.min(At,Cn);const po=dh+Kx*me;gt+=(bt-Ct)/((po+zt)/2),Ct=bt,zt=po;for(let It=0;It<2;It++){const F=ph[It],J=Ft+St*Ui*F,it=Lt+Et*Ui*F;let nt=Math.max(0,Tn(n,J,it))+.003;I.length&&(nt=Math.min(nt,Cn+.04));let et=ot,Tt=0;if(Mn&&q===1){const Rt=pr(O,J,it,Mn.s-.2,Mn.s+.2),kt=mr(z,Rt.s);if(et=Rt.u/(kt?kt.w:L),kt){Tt=kt.fade;const Bt=Math.min(1,Math.max(0,.5+.5*et));nt+=Math.max(0,kt.y0+(kt.y1-kt.y0)*Bt-nt)*(1-Gn((Math.abs(et)-1)/.3))}}_[It]=J,S[It]=it,w[It]=Math.max(Cn,Math.min(nt,yt[It])),b[It]=et,A[It]=Tt}if(Ne<1){const It=w[0]>w[1]?0:1;w[It]=w[1-It]+(w[It]-w[1-It])*Ne}const Ta=X[ft]*Fi*Ni*(mt?Gn(bt/(mt*.3)):1);for(let It=0;It<2;It++)yt[It]=w[It],Ls&&rt[It?"y1":"y0"].push(w[It]),a.push3(_[It],w[It],S[It]),r.push3(bt,xt,me),l.push1(ph[It]),c.push1(Ta),h.push1(gt),f.push4(b[It],q===1?z.per:0,A[It],0);if(Ls&&(rt.s.push(bt),rt.y.push(Cn),rt.hm.push(Qt),rt.w.push(Ui),rt.steep.push(me),rt.fade.push(X[ft]),rt.joined.push(lt&&D===ft-1),D=ft),lt){m.push3(v-2,v-1,v),m.push3(v-1,v+1,v);const It=st[ft-1];I.some(({h0:F,h1:J})=>It>F+1e-6&&It<J-1e-6||bt>F+1e-6&&bt<J-1e-6||It<F-1e-6&&bt>J+1e-6)&&(this.cutTris+=2)}if(Mn&&q===1){const It=(nt,et,Tt)=>Math.max(0,Tn(n,nt,et)-Tt),F=a.a,J=(F[v*3+1]+F[v*3+4])/2;let it=Math.max(It(Ft,Lt,J),It(F[v*3],F[v*3+2],F[v*3+1]),It(F[v*3+3],F[v*3+5],F[v*3+4]));if(lt&&u.length&&u[u.length-2]===v-2){const nt=(v-2)*3,et=It((F[nt]+F[nt+3]+Ft*2)/4,(F[nt+2]+F[nt+5]+Lt*2)/4,(F[nt+1]+F[nt+4]+J*2)/4);it=Math.max(it,et),u[u.length-1]=Math.max(u[u.length-1],et)}u.push(v,it)}lt=!0,v+=2}for(let ft=0;ft<u.length;ft+=2){let bt=u[ft+1];ft>=2&&u[ft-2]===u[ft]-2&&(bt=Math.max(bt,u[ft-1])),ft+2<u.length&&u[ft+2]===u[ft]+2&&(bt=Math.max(bt,u[ft+3])),f.a[u[ft]*4+3]=f.a[u[ft]*4+7]=Math.min(bt,4*Gt)}u.length=0}const y=new Le;y.setAttribute("position",new oe(a.done(),3)),y.setAttribute("aFlow",new oe(r.done(),3)),y.setAttribute("aSide",new oe(l.done(),1)),y.setAttribute("aFade",new oe(c.done(),1)),y.setAttribute("aTau",new oe(h.done(),1)),y.setAttribute("aJoin",new oe(f.done(),4)),y.setIndex(new oe(v<=65536?Uint16Array.from(m.a.subarray(0,m.n)):m.done(),1)),y.computeBoundingSphere(),this.uniforms={...t.shared.uniforms,uFlowAll:{value:0}},this.material=new be({vertexShader:Vx,fragmentShader:qx,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:tn,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new ae(y,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.app=t}update(){const t=this.app.weather,e=Math.min(1,t.rainTotal/600),n=this.app.time,i=this.lastTime===void 0?1:1-Math.exp(-Math.max(0,n-this.lastTime)/3);this.lastTime=n,this.uniforms.uFlowAll.value+=(e-this.uniforms.uFlowAll.value)*i;const o=this.app.camera.position;this.mesh.visible=o.y-Math.max(0,this.app.terrain.heightAt(o.x,o.z))<90}}const at=.016,tt={plain:0,thatch:1,stone:2,leaf:3,kapa:5,wood:6,skin:7};class de{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.xf=null,this.stack=[]}at(t,e,n,i=0,o=at){this.stack.push(this.xf);const a=Math.cos(i),r=Math.sin(i);return this.xf=l=>[t+(l[0]*a-l[2]*r)*o,e+l[1]*o,n+(l[0]*r+l[2]*a)*o],this}done(){return this.xf=this.stack.pop()||null,this}get count(){return this.pos.length/3}tri(t,e,n,i,o=0,a=!0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const r=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],f=n[1]-t[1],u=n[2]-t[2];let m=l*u-c*f,v=c*h-r*u,g=r*f-l*h;const x=Math.hypot(m,v,g)||1;m/=x,v/=x,g/=x;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(m,v,g),this.col.push(i[0],i[1],i[2]),this.mat.push(o)}quad(t,e,n,i,o,a=0){this.tri(t,e,n,o,a),this.tri(t,n,i,o,a)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],n,i)}box(t,e,n,i,o,a,r,l=0,c=0,h=1){const f=Math.cos(c),u=Math.sin(c),m=(_,S,w)=>[t+_*f-w*u,e+S,n+_*u+w*f],v=i/2,g=a/2,x=v*h,p=g*h,d=[m(-v,0,-g),m(v,0,-g),m(v,0,g),m(-v,0,g)],M=[m(-x,o,-p),m(x,o,-p),m(x,o,p),m(-x,o,p)];o<0?this.hexa(M,d,r,l):this.hexa(d,M,r,l)}cyl(t,e,n,i,o,a=0,r=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,f=c.map(p=>p/h),u=Math.abs(f[1])<.9?[0,1,0]:[1,0,0];let m=[f[1]*u[2]-f[2]*u[1],f[2]*u[0]-f[0]*u[2],f[0]*u[1]-f[1]*u[0]];const v=Math.hypot(...m);m=m.map(p=>p/v);const g=[f[1]*m[2]-f[2]*m[1],f[2]*m[0]-f[0]*m[2],f[0]*m[1]-f[1]*m[0]],x=(p,d,M)=>{const _=M/r*Math.PI*2,S=Math.cos(_)*d,w=Math.sin(_)*d;return[p[0]+m[0]*S+g[0]*w,p[1]+m[1]*S+g[1]*w,p[2]+m[2]*S+g[2]*w]};for(let p=0;p<r;p++){const d=x(t,n,p),M=x(t,n,p+1),_=x(e,i,p),S=x(e,i,p+1);this.quad(d,M,S,_,o,a),l&&this.tri(e,_,S,o,a)}}blob(t,e,n,i,o,a,r,l=0,c=0,h=l===tt.leaf,f=1){const u=(1+Math.sqrt(5))/2,m=[[-1,u,0],[1,u,0],[-1,-u,0],[1,-u,0],[0,-1,u],[0,1,u],[0,-1,-u],[0,1,-u],[u,0,-1],[u,0,1],[-u,0,-1],[-u,0,1]],v=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=_=>.85+.3*Math.abs(Math.sin(_*12.9898+c*78.233)*43758.5453%1),x=m.map((_,S)=>{const w=Math.hypot(..._),b=g(S);return[t+_[0]/w*i*b,e+_[1]/w*o*b,n+_[2]/w*a*b]});if(!h){for(const _ of v)this.tri(x[_[0]],x[_[1]],x[_[2]],r,l);return}const p=(_,S)=>{const w=[(_[0]+S[0])/2,(_[1]+S[1])/2,(_[2]+S[2])/2],b=[(w[0]-t)/i,(w[1]-e)/o,(w[2]-n)/a],A=Math.hypot(...b)||1,y=.9+.2*Math.abs(Math.sin(w[0]*91.7+w[2]*47.3+c)*43758.5453%1);return[t+b[0]/A*i*y,e+b[1]/A*o*y,n+b[2]/A*a*y]},d=_=>{const S=[(_[0]-t)/(i*i),(_[1]-e)/(o*o),(_[2]-n)/(a*a)],w=Math.hypot(...S)||1;return[S[0]/w,S[1]/w,S[2]/w]},M=(_,S,w)=>{const b=this.xf?[this.xf(_),this.xf(S),this.xf(w)]:[_,S,w],A=[d(_),d(S),d(w)];for(let y=0;y<3;y++)this.pos.push(...b[y]),this.nor.push(...A[y]),this.col.push(r[0],r[1],r[2]),this.mat.push(l)};if(f===0){for(const _ of v)M(x[_[0]],x[_[1]],x[_[2]]);return}for(const _ of v){const S=x[_[0]],w=x[_[1]],b=x[_[2]],A=p(S,w),y=p(w,b),E=p(b,S);M(S,A,E),M(A,w,y),M(E,y,b),M(A,y,E)}}wall(t,e,n,i,o=tt.stone,a=.7){const r=t.length;if(r<2)return;const l=r>2&&Math.hypot(t[0][0]-t[r-1][0],t[0][2]-t[r-1][2])<1e-9,c=[];for(let g=0;g<r-1;g++){const x=t[g+1][0]-t[g][0],p=t[g+1][2]-t[g][2],d=Math.hypot(x,p)||1;c.push([-p/d,x/d])}const h=t.map((g,x)=>{let p=c[x-1],d=c[x];if(l&&x===0&&(p=c[r-2]),l&&x===r-1&&(d=c[0]),!p)return d;if(!d)return p;const M=p[0]+d[0],_=p[1]+d[1],S=Math.hypot(M,_);if(S<1e-6)return d;const w=1/Math.max(.35,(M*d[0]+_*d[1])/S);return[M/S*w,_/S*w]}),f=e/2,u=e*a/2,m=(g,x,p,d)=>[g[0]+x[0]*p,g[1]+d,g[2]+x[1]*p],v=g=>[m(t[g],h[g],-f,-n*.3),m(t[g],h[g],f,-n*.3),m(t[g],h[g],u,n),m(t[g],h[g],-u,n)];for(let g=0;g<r-1;g++){const[x,p,d,M]=v(g),[_,S,w,b]=v(g+1);this.quad(M,d,w,b,i,o),this.quad(p,S,w,d,i,o),this.quad(_,x,M,b,i,o)}if(!l){const[g,x,p,d]=v(0),[M,_,S,w]=v(r-1);this.quad(g,x,p,d,i,o),this.quad(_,M,w,S,i,o)}}geometry(){const t=new Le;return t.setAttribute("position",new xe(this.pos,3)),t.setAttribute("normal",new xe(this.nor,3)),t.setAttribute("color",new xe(this.col,3)),t.setAttribute("aMat",new xe(this.mat,1)),t.computeBoundingSphere(),t}}function _t(s,t=0,e=Math.random){const n=new Dt(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Jx=`
${qe}
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
`,Qx=`
${qe}
${ti}
${vn}
${ei}
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
`;function eo(s,t={}){const[e,n]=t.fade||[120,160];return new be({vertexShader:Jx,fragmentShader:Qx,vertexColors:!0,side:t.doubleSide?tn:Zn,uniforms:{...s.uniforms,uWindVec:s.uniforms.uWindVec||{value:new Ut(1,0)},uFadeNear:{value:e},uFadeFar:{value:n},uFadeClose:{value:t.close||0},uFadeIn:{value:new Ut(...t.fadeIn||[0,0])},uSway:{value:t.sway||0},uObjDebug:{value:0}}})}const Se={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",stoneDark:"#4f4844",wood:"#6b4a2f",koa:"#7a4a2a",kapa:"#efe8d8",salt:"#f2ece4"};function Cu(s,t,e=7,n=4.6,i=5.2,o=!0,a=.6){const r=_t(Se.thatch,.18,t),l=_t(Se.thatchDark,.15,t),c=_t(Se.stone,.15,t);s.box(0,-a,0,e+1.8,.45+a,n+1.8,c,tt.stone);const h=.45,f=h+1.05;s.box(0,h,0,e,f-h,n,r,tt.thatch);const u=e/2+.35,m=n/2+.45,v=h+i,g=[-u,f-.15,-m],x=[u,f-.15,-m],p=[-u,v,0],d=[u,v,0],M=[-u,f-.15,m],_=[u,f-.15,m];s.quad(g,p,d,x,r,tt.thatch),s.quad(_,d,p,M,r,tt.thatch),s.quad(x,d,p,g,l,tt.thatch),s.quad(M,p,d,_,l,tt.thatch);const S=e/2;if(s.tri([-S,f,-n/2],[-S,f,n/2],[-S,v-.2,0],r,tt.thatch),s.tri([S,f,n/2],[S,f,-n/2],[S,v-.2,0],r,tt.thatch),s.box(0,v-.12,0,e+.9,.35,.55,l,tt.thatch),o){const w=[.05,.035,.025];s.quad([S+.02,h,-.45],[S+.02,h+1.4,-.45],[S+.02,h+1.4,.45],[S+.02,h,.45],w,0)}}function Ru(s,t,e,n,i){const o=_t(Se.wood,.25,i);s.cyl([t,0,e],[t,n*.62,e],.22,.18,o,tt.wood,5),s.box(t,n*.6,e,.75,n*.28,.6,o,tt.wood,i()*.3,.85),s.box(t,n*.86,e,.35,n*.16,.35,o,tt.wood,0,.6)}function tv(s,t,e,n,i){const o=_t(Se.kapa,.05,i),a=_t(Se.wood,.2,i);s.box(t,0,e,2.6,n,2.6,o,tt.kapa,.1,.62);for(const[r,l]of[[-1.35,-1.35],[1.35,-1.35],[1.35,1.35],[-1.35,1.35]])s.cyl([t+r,0,e+l],[t+r*.55,n+.8,e+l*.55],.12,.08,a,tt.wood,4)}function ev(s,t,e,n){const i=_t(Se.wood,.2,n);for(const[o,a]of[[-.9,-.6],[.9,-.6],[.9,.6],[-.9,.6]])s.cyl([t+o,0,e+a],[t+o,2.6,e+a],.09,.08,i,tt.wood,4);s.box(t,2.5,e,2.2,.18,1.6,i,tt.wood),s.blob(t,2.85,e,.5,.25,.4,_t("#c9a35a",.2,n),tt.plain,1)}function nv(s,t,e,n){const i=_t(Se.stone,.12,e),o=_t(Se.stoneDark,.12,e),a=t.big?Ri.big:Ri.small,{L:r,W:l,tiers:c,rise:h}=a,f=t.big,{x:u,z:m,rot:v}=t,g=t.top-h*n,x=A=>(A-g)/n;s.at(u,g,m,v,n);for(let A=t.steps.length-1;A>=0;A--){const y=t.steps[A],[E,R,P,N]=y.ext.map(C=>C/n),T=x(y.bottom);s.box((R-E)/2,T,(N-P)/2,r+E+R,x(y.top)-T,l+P+N,i,tt.stone)}const p=x(t.bottom);s.box(0,p,0,r,h-p,l,i,tt.stone);let d=h;for(let A=1;A<c;A++){const y=1-A*.14;s.box(0,d,0,r*y,h,l*y,A%2?o:i,tt.stone),d+=h}const M=1-(c-1)*.14,_=r*M/2,S=l*M/2,w=f?2.2:1.5;s.box(0,d,-S+.8,r*M,w,1.6,o,tt.stone),s.box(0,d,S-.8,r*M,w,1.6,o,tt.stone),s.box(-_+.8,d,0,1.6,w,l*M,o,tt.stone),s.done(),s.at(u,g+d*n,m,v,n),tv(s,-_*.55,0,f?11:7.5,e);const b=f?7:4;for(let A=0;A<b;A++){const y=(A/(b-1)-.5)*1.6;Ru(s,-_*.55+Math.cos(y)*(f?8:5),Math.sin(y)*(f?8:5),f?4.2:3.2,e)}return ev(s,_*.15,0,e),s.done(),s.at(u+Math.cos(v)*_*.45*n-Math.sin(v)*S*.35*n,g+d*n,m+Math.sin(v)*_*.45*n+Math.cos(v)*S*.35*n,v,n),Cu(s,e,f?8:6,f?5:4,f?6:4.5,!1),s.done(),d}function Pu(s,t,e=8){const n=_t(Se.koa,.2,t),i=_t("#4a2c18",.2,t),o=e/2;s.box(0,0,0,e*.8,.55,.62,n,tt.wood,0,.9),s.box(o*.85,.05,0,e*.2,.6,.4,i,tt.wood,0,.5),s.box(-o*.85,.05,0,e*.2,.55,.4,i,tt.wood,0,.5);const a=-2.4;for(const r of[-e*.15,e*.15])s.cyl([r,.55,0],[r,.5,a],.06,.06,i,tt.wood,4);s.box(0,.05,a,e*.5,.28,.24,i,tt.wood,0,.8)}function Lu(s,t,e=18){const n=_t(Se.koa,.15,t),i=_t("#4a2c18",.15,t);for(const a of[-2.2,2.2])s.box(0,0,a,e*.82,1,1,n,tt.wood,0,.88),s.box(e*.45,.2,a,e*.14,1.2,.6,i,tt.wood,0,.5),s.box(-e*.45,.2,a,e*.14,1.1,.6,i,tt.wood,0,.5);s.box(0,1,0,e*.42,.2,5.2,i,tt.wood),s.box(-e*.08,1.2,0,3.2,1.4,2.4,_t(Se.thatch,.1,t),tt.thatch,0,.7);const o=_t("#c9ac78",.08,t);s.cyl([e*.1,1.1,0],[e*.05,9.5,0],.12,.08,i,tt.wood,4),s.quad([e*.12,1.4,.05],[e*.36,8.8,.05],[e*.02,10.8,.05],[e*.05,4,.05],o,tt.plain),s.quad([e*.05,4,-.05],[e*.02,10.8,-.05],[e*.36,8.8,-.05],[e*.12,1.4,-.05],o,tt.plain)}function iv(s,t,e=16,n=6){const i=_t(Se.thatch,.15,t),o=_t(Se.thatchDark,.15,t),a=_t(Se.wood,.2,t),r=4.8,l=e/2,c=n/2+.3;s.quad([-l,.3,-c],[-l,r,0],[l,r,0],[l,.3,-c],i,tt.thatch),s.quad([l,.3,c],[l,r,0],[-l,r,0],[-l,.3,c],i,tt.thatch),s.quad([l,.3,-c],[l,r,0],[-l,r,0],[-l,.3,-c],o,tt.thatch),s.quad([-l,.3,c],[-l,r,0],[l,r,0],[l,.3,c],o,tt.thatch),s.tri([-l,.3,c],[-l,.3,-c],[-l,r,0],o,tt.thatch),s.tri([-l,.3,-c],[-l,.3,c],[-l,r,0],i,tt.thatch),s.box(0,r-.1,0,e+.4,.3,.45,o,tt.thatch),s.cyl([l,0,0],[l,r,0],.15,.12,a,tt.wood,5)}function sv(s,t,e=!0,n=.3){const i=_t(Se.stone,.2,t);s.box(0,-n,0,3.2,n+.1,3.2,i,tt.stone,0,.92);for(let o=0;o<9;o++){const a=t()*Math.PI*2,r=1.4*(1-o/10);s.blob(Math.cos(a)*r*.5,o*.28,Math.sin(a)*r*.5,.75,.45,.7,i,tt.stone,o+t())}if(s.box(0,2.3,0,1.6,.25,1.3,_t("#5d5650",.1,t),tt.stone),e){const o=_t("#3b2a1e",.2,t);s.box(0,2.55,0,1,.75,.6,o,tt.wood,0,.8),s.box(.65,2.7,0,.5,.35,.35,o,tt.wood,0,.7),s.box(-.2,3.25,-.2,.15,.3,.12,o,tt.wood),s.box(-.2,3.25,.2,.15,.3,.12,o,tt.wood)}}function ov(s,t,e=7){const n=_t(Se.wood,.1,t),i=_t(Se.kapa,.04,t);s.cyl([0,0,0],[0,e,0],.09,.07,n,tt.wood,5),s.cyl([0,e*.82,-1.6],[0,e*.82,1.6],.06,.06,n,tt.wood,4),s.quad([.02,e*.82,-1.5],[.02,e*.82,1.5],[.02,e*.3,1.3],[.02,e*.3,-1.3],i,tt.kapa),s.quad([-.02,e*.3,-1.3],[-.02,e*.3,1.3],[-.02,e*.82,1.5],[-.02,e*.82,-1.5],i,tt.kapa),s.box(0,e*.85,-1.55,.1,-1.6,.1,_t("#e2b13c",.1,t),tt.plain),s.box(0,e*.85,1.55,.1,-1.6,.1,_t("#e2b13c",.1,t),tt.plain),s.blob(0,e+.2,0,.35,.45,.35,_t("#3d2c1f",.1,t),tt.wood,2)}function av(s,t,e=.3){const n=_t(Se.stone,.2,t);s.box(0,-e,0,3.2,.5+e,2.4,n,tt.stone,0,.85);for(let i=0;i<5;i++)s.blob((t()-.5)*1.4,.7+i*.25,(t()-.5)*1,.45,.3,.4,n,tt.stone,i);s.blob(0,2,0,.45,.35,.45,_t("#f3efe6",.05,t),tt.kapa,3)}function rv(s,t){const e=_t("#4d4642",.2,t);for(let n=0;n<7;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,tt.stone,n)}const vh=.009,lv=`
${qe}
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
`,cv=`
${qe}
${ti}
${vn}
${ei}
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
`;class hv{constructor(t,e,n){this.group=new xn;const i=[],o=[],a=[],r=new de,l=_t("#557d36",.15,Math.random),c=_t("#6e6e42",.1,Math.random),h=.06,f=p=>new Ut(p[0],p[1]),u=[],m=[];for(const p of t.loi){for(const d of p.paddies){const M=(d.level+h)*Gt,_=d.poly;for(const[N,T,C]of rl.triangulateShape(_.map(f),[]))for(const I of[N,T,C])i.push(_[I][0],M,_[I][1]),o.push(d.age),a.push(d.flood);let S=d.level;const w=_.length;let b=0;for(let N=0;N<w;N++)b+=_[N][0]*_[(N+1)%w][1]-_[(N+1)%w][0]*_[N][1];const A=b>0?1:-1;for(let N=0;N<w;N++){const T=_[N],C=_[(N+1)%w],I=Math.hypot(C[0]-T[0],C[1]-T[1])||1,H=(C[1]-T[1])/I*A*.01,z=-(C[0]-T[0])/I*A*.01,O=Math.max(1,Math.ceil(I/.04));for(let k=0;k<O;k++){const q=T[0]+(C[0]-T[0])*k/O,K=T[1]+(C[1]-T[1])*k/O;S=Math.min(S,e.metresAt(q,K),e.metresAt(q+H,K+z),e.metresAt(q+2*H,K+2*z))}}const y=Math.max(S,d.level-8)-.25,R=(d.level+.35-y)/1.3,P=[..._,_[0]].map(N=>[N[0],(y+.3*R)*Gt,N[1]]);r.wall(P,.009,R*Gt,Math.random()<.8?l:c,tt.plain,.6)}for(const d of p.auwai){let M=null;for(let _=0;_<d.length-1;_++){const[S,w]=d[_],[b,A]=d[_+1],y=Math.hypot(b-S,A-w);if(y<1e-6)continue;if(y>1.2){M=null;continue}const E=-(A-w)/y,R=(b-S)/y,P=Math.max(1,Math.ceil(y/.03));for(let N=_===0||!M?0:1;N<=P;N++){const T=S+(b-S)*N/P,C=w+(A-w)*N/P,I=[-1,1].map(H=>{const z=T+E*vh*H,O=C+R*vh*H;return[z,Math.max(0,Tn(e,z,O))+.002,O]});if(M)for(const[H,z]of[[M[0],-1],[M[1],1],[I[1],1],[M[0],-1],[I[1],1],[I[0],-1]])u.push(H[0],H[1],H[2]),m.push(z);M=I}}}}const v=new Le;v.setAttribute("position",new xe(i,3)),v.setAttribute("aAge",new xe(o,1)),v.setAttribute("aFlood",new xe(a,1)),v.computeBoundingSphere();const g=p=>new be({vertexShader:lv,fragmentShader:cv,uniforms:{...n.uniforms},defines:p,side:tn,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2});this.material=g({}),this.paddies=new ae(v,this.material),this.group.add(this.paddies);const x=new Le;x.setAttribute("position",new xe(u,3)),x.setAttribute("aSide",new xe(m,1)),x.computeBoundingSphere(),this.ditchMaterial=g({AUWAI:1}),this.ditches=new ae(x,this.ditchMaterial),this.group.add(this.ditches),this.banksGeometry=r.geometry()}}class uv{constructor(t){var f;const{terrain:e,shared:n}=t,i=t.island.meta,o=i.sites;this.app=t,this.meta=i,this.sites=o,this.group=new xn;const a=Ci(i.seed+77),r=new de,l=(u,m)=>Math.max(e.heightAt(u,m),0),c=((f=t.wailele)==null?void 0:f.lines)||Ea(i,t.island.data),h=Fx(t.island,c).list;this.footings=h;for(const u of h)u.kind==="house"&&os(r,u,a);for(const u of h)u.kind==="imu"&&os(r,u,a);for(const u of h)(u.kind==="heiau"||u.kind==="luakini")&&os(r,u,a);this.beaches=[];for(const u of o.canoes){const m=u.dir,v=m+Math.PI/2;for(let g=0;g<u.n;g++){const x=(g-(u.n-1)/2)*.09,p=u.x+Math.cos(v)*x,d=u.z+Math.sin(v)*x;r.at(p,l(p,d)+.002,d,m),Pu(r,a,7+a()*4),r.done()}this.beaches.push(u)}for(const u of h)u.kind==="halau"&&os(r,u,a);if(o.alii){const u=o.canoes.find(m=>m.village===o.alii.id);if(u){const m=u.dir+Math.PI/2,v=u.x+Math.cos(m)*.45,g=u.z+Math.sin(m)*.45;r.at(v,l(v,g)+.002,g,u.dir),Lu(r,a),r.done()}}for(const u of h)(u.kind==="koa"||u.kind==="ahu")&&os(r,u,a);this.ponds=o.ponds,this.pondMask(t);for(const u of o.ponds)this.buildPond(r,u,a);o.puuhonua&&this.buildPuuhonua(r,o.puuhonua,a),o.holua&&this.buildHolua(r,o.holua,a);for(const u of h)u.kind==="salt"&&os(r,u,a);this.material=eo(n,{fade:[70,110]}),this.structures=new ae(r.geometry(),this.material),this.structures.frustumCulled=!1,this.group.add(this.structures),this.loi=new hv(o,e,n),this.group.add(this.loi.group),this.banks=new ae(this.loi.banksGeometry,this.material),this.banks.frustumCulled=!1,this.group.add(this.banks)}pondMask(t){const e=le,n=t.seaData,i=qt/e;for(const o of this.ponds){const a=o.wall,r=a.map(m=>m[0]),l=a.map(m=>m[1]),c=Math.max(0,Math.floor((Math.min(...r)+ut)/i)),h=Math.min(e-1,Math.ceil((Math.max(...r)+ut)/i)),f=Math.max(0,Math.floor((Math.min(...l)+ut)/i)),u=Math.min(e-1,Math.ceil((Math.max(...l)+ut)/i));for(let m=f;m<=u;m++)for(let v=c;v<=h;v++){const g=-ut+(v+.5)*i,x=-ut+(m+.5)*i;dv(a,g,x)&&(n[(m*e+v)*4]=255)}}t.seaTex.needsUpdate=!0}buildPond(t,e,n){const i=_t("#8a817a",.12,n),o=e.wall,a=o.length,r=[0];for(let d=1;d<a;d++)r.push(r[d-1]+Math.hypot(o[d][0]-o[d-1][0],o[d][1]-o[d-1][1]));const l=r[a-1],c=d=>{const M=d*(a-1),_=Math.min(a-2,Math.floor(M));return r[_]+(r[_+1]-r[_])*(M-_)},h=d=>{let M=0;for(;M<a-2&&r[M+1]<d;)M++;const _=(d-r[M])/Math.max(1e-9,r[M+1]-r[M]);return[o[M][0]+(o[M+1][0]-o[M][0])*_,o[M][1]+(o[M+1][1]-o[M][1])*_]},f=.06,u=e.gates.map(d=>c(d)).map(d=>[Math.max(0,d-f/2),Math.min(l,d+f/2)]);let m=[];const v=()=>{m.length>1&&t.wall(m,.1,.024,i,tt.stone,.72),m=[]},g=d=>m.push([d[0],0,d[1]]);let x=0;for(const[d,M]of u){for(let _=0;_<a;_++)r[_]>x&&r[_]<d&&g(o[_]);g(h(d)),v(),g(h(M)),x=M}for(let d=0;d<a;d++)r[d]>x&&g(o[d]);v();const p=_t(Se.wood,.15,n);for(const[d,M]of u){const _=h(d),S=h(M),w=Math.atan2(S[1]-_[1],S[0]-_[0]),b=Math.hypot(S[0]-_[0],S[1]-_[1])/at;t.at((_[0]+S[0])/2,0,(_[1]+S[1])/2,w);const A=Math.max(3,Math.round(b/.45));for(let y=0;y<=A;y++)t.box(-b/2+.06+(b-.12)*y/A,-.4,0,.12,1.9,.12,p,tt.wood);t.box(0,1.25,0,b,.15,.2,p,tt.wood),t.box(0,.45,0,b,.1,.16,p,tt.wood),t.done()}}buildPuuhonua(t,e,n){const{terrain:i}=this.app,o=e.dir,a=Math.cos(o),r=Math.sin(o),l=-r,c=a,h=e.x-a*1.6,f=e.z-r*1.6,u=p=>{for(let d=.3;d<9;d+=.15)if(i.heightAt(h+l*d*p,f+c*d*p)<=.002)return d;return 4},m=u(-1),v=u(1),g=[];for(let p=-m;p<=v;p+=.12){const d=h+l*p,M=f+c*p;g.push([d,Math.max(0,i.heightAt(d,M)),M])}const x=_t(Se.stoneDark,.1,n);t.wall(g,.08,.06,x,tt.stone,.8);for(let p=0;p<6;p++){const d=(p-2.5)*.12,M=e.x+l*d-a*.05,_=e.z+c*d-r*.05;t.at(M,Math.max(0,Tn(i,M,_)),_,o),Ru(t,0,0,4,n),t.done()}this.puuhonuaWall={a:g[0],b:g[g.length-1]}}buildHolua(t,e,n){const{terrain:i}=this.app,o=Math.hypot(e.x1-e.x0,e.z1-e.z0),a=Math.ceil(o/.08),r=o/a,l=(e.x1-e.x0)/o,c=(e.z1-e.z0)/o,h=(y,E)=>[e.x0+l*y-c*E,e.z0+c*y+l*E],f=(y,E)=>Math.max(i.heightAt(y,E),Tn(i,y,E)),u=.014,m=4,v=[];for(let y=0;y<=a*m;y++){const E=y/m*r;let R=i.heightAt(...h(E,0))+.018;for(let P=-.041;P<.042;P+=.0205)R=Math.max(R,f(...h(E,P))+.003);v.push(R-u)}const g=[];for(let y=0;y<=a;y++)g.push(i.heightAt(...h(y*r,0))+.004);const x=()=>{for(let y=0;y<8;y++){let E=!1;for(let R=0;R<=a*m;R++){const P=Math.min(a-1,Math.floor(R/m)),N=R/m-P,T=v[R]-(g[P]+(g[P+1]-g[P])*N);T>1e-6&&(E=!0,g[N<.5?P:P+1]+=T)}if(!E)break}};x();for(let y=0;y<2;y++){const E=g.slice();for(let R=1;R<a;R++)g[R]=(E[R-1]+2*E[R]+E[R+1])/4;x()}const p=g.map((y,E)=>{const[R,P]=h(E*r,0);return[R,y,P]}),d=_t("#8a817a",.1,n),M=g.map((y,E)=>{const R=E*r,P=[];for(const H of[-1,1]){const z=.055+.6*Math.max(0,y-.0042-f(...h(R,H*.055)));let O=y-.0042;for(const K of[-.5,0,.5]){const[L,B]=h(R+K*r,H*z);O=Math.min(O,i.heightAt(L,B)-.006,Tn(i,L,B)-.006)}const[k,q]=h(R,H*z);P.push([k,O,q])}const[N,T]=h(R,.041),[C,I]=h(R,-.041);return P.push([N,y+u,T],[C,y+u,I]),P});for(let y=0;y<a;y++){const[E,R,P,N]=M[y],[T,C,I,H]=M[y+1];t.quad(N,P,I,H,d,tt.stone),t.quad(R,C,I,P,d,tt.stone),t.quad(T,E,N,H,d,tt.stone)}t.quad(...M[0],d,tt.stone);const[_,S,w,b]=M[a];t.quad(S,_,b,w,d,tt.stone);const A=_t("#c2b25e",.1,n);for(let y=0;y<p.length-1;y++){const E=p[y],R=p[y+1],P=R[0]-E[0],N=R[2]-E[2],T=Math.hypot(P,N)||1,C=-N/T*.034,I=P/T*.034,H=E[1]+.0145,z=R[1]+.0145;t.quad([E[0]-C,H,E[2]-I],[E[0]+C,H,E[2]+I],[R[0]+C,z,R[2]+I],[R[0]-C,z,R[2]-I],A,tt.plain)}this.holuaPath=p}}function os(s,t,e){switch(t.kind){case"house":{const[n,i,o]=t.dims,a=t.top-bu*at;s.at(t.x,a,t.z,t.rot),Cu(s,e,n,i,o,!0,(a-t.base)/at),s.done();break}case"imu":s.at(t.x,t.top-.5*at,t.z,0),rv(s,e),s.done();break;case"heiau":case"luakini":nv(s,t,e,at);break;case"halau":s.at(t.x,t.top-.3*at,t.z,t.rot),fv(s,t.lean),iv(s,e),s.done();break;case"koa":s.at(t.x,t.top-.5*at,t.z,t.rot),av(s,e,(t.top-.5*at-t.base)/at),s.done();break;case"ahu":{const n=at*(t.size||1);s.at(t.x,t.top,t.z,t.rot,n),sv(s,e,!0,(t.top-t.base)/n),s.done();break}case"salt":{const n=_t(Se.salt,.06,e),i=_t("#7d5b44",.12,e);for(const o of t.pans){const a=o.top-.2*at;s.at(o.x,a,o.z,t.rot),s.box(0,(o.base-a)/at,0,6.6,(o.top-o.base)/at,5.4,i,tt.plain),s.box(0,.05,0,5.8,.18,4.6,e()<.7?n:_t("#d9c2b4",.05,e),tt.kapa),s.done()}break}}}function fv(s,t){if(!t)return;const e=s.xf;s.xf=n=>{const i=e(n);return i[1]+=t*n[0]*at,i}}function dv(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function Tn(s,t,e){return Su(s.heights,s.N,t,e)*Gt}function Ks(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function pv(s){const t=new de,e=_t("#8a7a62",.1,s),n=14;let i=[0,0,0];const o=.06;for(let h=1;h<=6;h++){const f=h/6*n,u=[o*Math.pow(f,1.5),f,0];t.cyl(i,u,.28-h*.02,.26-h*.025,e,tt.wood,6),i=u}const a=i,r=_t("#4c7a2c",.12,s),l=_t("#8f9a43",.1,s);for(let h=0;h<13;h++){const f=h/13*Math.PI*2+s()*.3,u=5.2+s()*1.2,m=1.4+s()*.8,v=Math.cos(f),g=Math.sin(f);let x=a;for(let p=1;p<=5;p++){const d=p/5,M=[a[0]+v*u*d,a[1]+m*d-3.8*d*d,a[2]+g*u*d],_=1*Math.sin(Math.PI*Math.min(1,d*1.1))+.15,S=-g*_,w=v*_,b=p>3?l:r;t.quad([x[0],x[1],x[2]],[M[0],M[1],M[2]],[M[0]+S,M[1]-.35*_,M[2]+w],[x[0]+S*.7,x[1]-.25*_,x[2]+w*.7],b,tt.leaf),t.quad([x[0]-S*.7,x[1]-.25*_,x[2]-w*.7],[M[0]-S,M[1]-.35*_,M[2]-w],[M[0],M[1],M[2]],[x[0],x[1],x[2]],b,tt.leaf),x=M}}const c=_t("#5c4a24",.1,s);for(let h=0;h<4;h++)t.blob(a[0]+Math.cos(h*1.7)*.4,a[1]-.6,a[2]+Math.sin(h*1.7)*.4,.3,.35,.3,c,tt.plain,h);return t.geometry()}function Gs(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",blobs:o=3,flatten:a=1,red:r=0}){const l=new de,c=_t(i,.1,s);l.cyl([0,0,0],[.3,t,.1],.35,.22,c,tt.wood,5);const h=[];for(let f=0;f<o;f++){const u=f/o*Math.PI*2+s(),m=f===0?0:e*.45,v=_t(n,.18,s),g=[.3+Math.cos(u)*m,t+e*.35*a+(f===0?e*.2:0),.1+Math.sin(u)*m,e*(f===0?1:.75),e*.62*a];h.push(g),l.blob(g[0],g[1],g[2],g[3],g[4],g[3],v,tt.leaf,f+s())}if(r>0)for(let f=0;f<r;f++){const[u,m,v,g,x]=h[Math.floor(s()*h.length)],p=s()*Math.PI*2,d=.15+s()*.75,M=Math.sqrt(1-d*d),_=_t(s()<.8?"#b3241c":"#d8452a",.2,s),S=.22+s()*.14;l.blob(u+Math.cos(p)*M*g*.97,m+d*x*.97,v+Math.sin(p)*M*g*.97,S,S*.75,S,_,tt.leaf,f,!0,0)}return l.geometry()}function mv(s,{trunkH:t,crownR:e,color:n,trunkColor:i="#5a4636",flatten:o=1}){const a=new de;return a.cyl([0,0,0],[.3,t,.1],.4,.25,_t(i,.1,s),tt.wood,3),a.blob(.3,t+e*.42*o,.1,e*1.18,e*.7*o,e*1.18,_t(n,.12,s),tt.leaf,1,!0,0),a.geometry()}function gv(s,t){const e=new de;return e.blob(0,.55,0,1.3,.8,1.3,_t(t,.15,s),tt.leaf,1,!0,0),e.geometry()}function xv(s){const t=new de,e=_t("#6b5a45",.1,s),n=_t("#4f7036",.12,s);for(let i=0;i<4;i++){const o=i/4*Math.PI*2;t.cyl([Math.cos(o)*1.1,0,Math.sin(o)*1.1],[0,1.4,0],.08,.1,e,tt.wood,4)}t.cyl([0,1.2,0],[0,3.6,0],.22,.18,e,tt.wood,5);for(let i=0;i<3;i++){const o=i/3*Math.PI*2+.4,a=[Math.cos(o)*1.8,5.2,Math.sin(o)*1.8];t.cyl([0,3.5,0],a,.14,.1,e,tt.wood,4);for(let r=0;r<9;r++){const l=r/9*Math.PI*2,c=Math.cos(l),h=Math.sin(l),f=[a[0]+c*1.7,a[1]+.5-Math.abs(Math.sin(l))*.9,a[2]+h*1.7];t.tri([a[0]-h*.14,a[1],a[2]+c*.14],[a[0]+h*.14,a[1],a[2]-c*.14],f,n,tt.leaf)}}return t.geometry()}function vv(s){const t=new de,e=_t("#7c9a4a",.1,s),n=_t("#6aa538",.12,s);for(let i=0;i<4;i++){const o=s()*Math.PI*2,a=s()*.6,r=Math.cos(o)*a,l=Math.sin(o)*a,c=2.4+s()*1.4;t.cyl([r,0,l],[r,c,l],.16,.12,e,tt.leaf,5);for(let h=0;h<4;h++){const f=s()*Math.PI*2,u=Math.cos(f),m=Math.sin(f),v=[r,c,l],g=[r+u*1.6,c+.7,l+m*1.6],x=[r+u*2.6,c-.2,l+m*2.6],p=-m*.45,d=u*.45;t.quad(v,[g[0]+p,g[1],g[2]+d],[x[0]+p*.6,x[1],x[2]+d*.6],x,n,tt.leaf),t.quad(v,x,[x[0]-p*.6,x[1],x[2]-d*.6],[g[0]-p,g[1],g[2]-d],n,tt.leaf)}}return t.geometry()}function Mh(s,t){const e=new de,n=_t("#6b5a40",.1,s),i=_t(t?"#7d2b2f":"#3f7d32",.15,s);e.cyl([0,0,0],[.05,1.6,0],.05,.04,n,tt.wood,4);for(let o=0;o<9;o++){const a=o/9*Math.PI*2,r=Math.cos(a),l=Math.sin(a),c=.3+o%3*.25;e.quad([.05-l*.06,1.6,r*.06],[.05+l*.06,1.6,-r*.06],[.05+r*.9+l*.12,1.6+c,l*.9-r*.12],[.05+r*.9-l*.12,1.6+c,l*.9+r*.12],i,tt.leaf)}return e.geometry()}function _h(s,t){const e=new de;for(let n=0;n<3;n++)e.blob((s()-.5)*1.2,.5,(s()-.5)*1.2,.9,.7,.9,_t(t,.2,s),tt.leaf,n);return e.geometry()}const yh=["niu","hala","ulu","kukui","maia","ki","kiRed","ohia","koa","wiliwili","naupaka","aalii"],Ws=["ohia","koa","kukui","wiliwili","aalii"],Ie=2,gr=13.5,Vs=[3.6,4.6];class Mv{constructor(t){this.app=t;const e=Ci(t.island.meta.seed+5150);this.geoms={niu:pv(e),hala:xv(e),ulu:Gs(e,{trunkH:5,crownR:4.2,color:"#2f5a26",blobs:3}),kukui:Gs(e,{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468",blobs:5}),maia:vv(e),ki:Mh(e,!1),kiRed:Mh(e,!0),ohia:Gs(e,{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038",blobs:5,red:16}),koa:Gs(e,{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",blobs:5,flatten:.7}),wiliwili:Gs(e,{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",blobs:3,flatten:.8}),naupaka:_h(e,"#5f8a42"),aalii:_h(e,"#8b7c4a")};const n={ohia:{trunkH:6,crownR:5.4,color:"#3a5e2c",trunkColor:"#4d4038"},koa:{trunkH:10,crownR:7.5,color:"#5d7449",trunkColor:"#5b4a3a",flatten:.7},kukui:{trunkH:5,crownR:5.6,color:"#6f8a5c",trunkColor:"#7b7468"},wiliwili:{trunkH:5,crownR:3.8,color:"#a3864a",trunkColor:"#8a7255",flatten:.8}};this.farGeoms={...Object.fromEntries(Object.entries(n).map(([i,o])=>[i,mv(e,o)])),aalii:gv(e,"#8b7c4a")},this.fixedMat=eo(t.shared,{fade:[34,48],close:.3,sway:1,doubleSide:!0}),this.forestMat=eo(t.shared,{fade:[Vs[0],Vs[1]],close:.3,sway:1}),this.forestFarMat=eo(t.shared,{fade:[gr-3.5,gr],fadeIn:Vs,sway:1}),this.group=new xn,this.land=t.landTex.image.data,this.cleared=this.clearings(),this.fixed=this.placeFixed(e),this.meshes={};for(const i of yh){const o=this.fixed[i];if(!o.length)continue;const a=new to(this.geoms[i],this.fixedMat,o.length);this.writeInstances(a,o),a.frustumCulled=!1,this.group.add(a),this.meshes[i]=a}this.forest={near:{},far:{}};for(const i of Ws)this.forest.near[i]=this.forestMesh(this.geoms[i],this.forestMat,2500),this.forest.far[i]=this.forestMesh(this.farGeoms[i],this.forestFarMat,9e3);this.tiles=new Map,this.frustum=new Rs,this.projView=new te,this.box=new kn,this.wanted=[],this.lastSelection=""}forestMesh(t,e,n){const i=new to(t,e,n);return i.count=0,i.frustumCulled=!1,i.instanceMatrix.setUsage(vs),i.instanceColor=new $n(new Float32Array(n*3),3),i.instanceColor.setUsage(vs),this.group.add(i),i}clearings(){const t=le,e=new Uint8Array(t*t),n=qt/t,i=(a,r,l)=>{const c=Math.max(0,Math.floor((a-l+ut)/n)),h=Math.min(t-1,Math.floor((a+l+ut)/n)),f=Math.max(0,Math.floor((r-l+ut)/n)),u=Math.min(t-1,Math.floor((r+l+ut)/n));for(let m=f;m<=u;m++)for(let v=c;v<=h;v++)e[m*t+v]=1},o=this.app.island.meta.sites;for(const a of o.loi)for(const r of a.paddies){i(r.c[0],r.c[1],.05);for(const l of r.poly)i(l[0],l[1],.03)}for(const a of o.houses)i(a.x,a.z,.12);for(const a of o.heiau)i(a.x,a.z,.5);for(const a of o.villages)i(a.x,a.z,.3);for(const a of this.app.island.meta.ahu)i(a.x,a.z,.3);for(const a of o.koa)i(a.x,a.z,.15);return e}isCleared(t,e){const n=le,i=Math.floor((t+ut)/qt*n),o=Math.floor((e+ut)/qt*n);return i>=0&&o>=0&&i<n&&o<n&&this.cleared[o*n+i]===1}landAt(t,e){const n=le,i=Math.floor((t+ut)/qt*n),o=Math.floor((e+ut)/qt*n);if(i<0||o<0||i>=n||o>=n)return null;const a=(o*n+i)*4,r=this.land;return{rain:r[a]/255,sand:r[a+1]/255,rip:r[a+2]/255,field:r[a+3]/255}}writeInstances(t,e){const n=new te,i=new Di,o=new W,a=new W,r=new Dt,l=new W(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];o.set(h.x,h.y,h.z),i.setFromAxisAngle(l,h.rot),a.setScalar(h.s),n.compose(o,i,a),t.setMatrixAt(c,n),r.setRGB(h.c,h.c*(.96+.08*((h.x*997+h.z*131)%1+1)%1),h.c),t.setColorAt(c,r)}t.count=e.length,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}placeFixed(t){var f;const{terrain:e}=this.app,n=this.app.island.meta.sites,i=Object.fromEntries(yh.map(u=>[u,[]])),o=n.houses,a=(u,m,v)=>!o.some(g=>Math.abs(g.x-u)<v&&Math.abs(g.z-m)<v&&Math.hypot(g.x-u,g.z-m)<v),r=((f=this.app.features)==null?void 0:f.footings)||[],l=(u,m,v)=>r.some(({box:g})=>{const x=u-g.x,p=m-g.z;return Math.abs(x*g.c+p*g.s)<g.hx+v&&Math.abs(p*g.c-x*g.s)<g.hz+v}),c=(u,m,v,g=1,x=.025)=>{const p=e.heightAt(m,v);if(p<=.003)return!1;const d={x:m,y:p,z:v,rot:t()*Math.PI*2,s:at*g*(.8+t()*.45),c:.85+t()*.3};return l(m,v,x)?!1:(i[u].push(d),!0)};for(const u of n.villages){const m=u.alii?26:u.model?20:12;for(let v=0;v<m;v++){const g=t()*Math.PI*2,x=.12+t()*.7,p=u.x+Math.cos(g)*x,d=u.z+Math.sin(g)*x;if(!a(p,d,.09))continue;const M=this.landAt(p,d),_=M&&M.sand>.3||t()<.3?"niu":t()<.4?"ulu":t()<.5?"kukui":"maia";c(_,p,d)}for(let v=0;v<(u.model?24:10);v++){const g=o[Math.floor(t()*o.length)];if(g.village!==u.id)continue;const x=t()*Math.PI*2;c(t()<.75?"ki":"kiRed",g.x+Math.cos(x)*.08,g.z+Math.sin(x)*.08,.9,.005)}}const h=this.app.island.meta.trail;for(let u=0;u<h.length;u++){const m=h[u];for(let v=0;v<3;v++){const g=m[0]+(t()-.5)*2.6,x=m[1]+(t()-.5)*2.6,p=this.landAt(g,x);if(!p)continue;const d=e.heightAt(g,x);d<=.003||d>.4||(p.sand>.4&&t()<.5?c("naupaka",g,x,.8):p.rain>.42&&t()<.5?c("hala",g,x):t()<.45?c("niu",g,x):p.rain<.3&&t()<.5&&c("aalii",g,x,.8))}}for(const u of n.loi){const m=u.paddies,v=(g,x,p)=>m.some(d=>Math.abs(d.c[0]-g)<.4&&Math.abs(d.c[1]-x)<.4&&(Ks(d.poly,g,x)||d.poly.some(M=>Math.hypot(M[0]-g,M[1]-x)<p)));for(let g=0;g<m.length;g+=2){const x=m[g],p=x.poly[Math.floor(t()*x.poly.length)],d=p[0]-x.c[0],M=p[1]-x.c[1],_=Math.hypot(d,M)||1,S=p[0]+d/_*.04,w=p[1]+M/_*.04;if(v(S,w,.025))continue;const b=t();b<.3?c("maia",S,w):b<.5&&!v(S+d/_*.1,w+M/_*.1,.08)?c("kukui",S+d/_*.1,w+M/_*.1):b<.75&&c(t()<.8?"ki":"kiRed",S,w,.9,.005)}}return i}buildTile(t,e){const{terrain:n}=this.app,i=Math.round(Ie/.17),o=Ie/i,a=Object.fromEntries(Ws.map(v=>[v,[]]));let r=1/0,l=-1/0;for(let v=0;v<i;v++)for(let g=0;g<i;g++){const x=t*i+v,p=e*i+g,d=On(x,p,11),M=On(x,p,12),_=(x+d)*o,S=(p+M)*o,w=this.landAt(_,S);if(!w||w.sand>.2||w.field>.3||this.isCleared(_,S))continue;const b=n.metresAt(_,S);if(b<3)continue;const A=w.rain+(On(x,p,3)-.5)*.12,y=Math.min(1,Math.max(0,(A-.3)/.22)),E=On(x,p,13);let R=null;if(E<y*.85?w.rip>.4&&b<450&&E<.5?R="kukui":b>600&&A>.45?R=On(x,p,7)<.7?"ohia":"koa":b>350?R=On(x,p,8)<.55?"koa":"ohia":R=A>.5?"ohia":"kukui":A<.3&&E<.08&&(R=b<500&&On(x,p,9)<.5?"wiliwili":"aalii"),!R||n.normalAt(_,S).y<.35&&On(x,p,5)<.7)continue;const P=n.heightAt(_,S);a[R].push(_,P,S,d*6.28,at*(.75+M*.6)*(R==="aalii"?.8:1),.82+E*.35,On(x,p,14)),r=Math.min(r,P),l=Math.max(l,P)}const c={};let h=0;for(const v of Ws){const g=a[v],x=g.length/7,p=new Float32Array(x*16),d=new Float32Array(x*3);for(let M=0;M<x;M++){const[_,S,w,b,A,y,E]=g.slice(M*7,M*7+7),R=Math.cos(b)*A,P=Math.sin(b)*A;p.set([R,0,-P,0,0,A,0,0,P,0,R,0,_,S,w,1],M*16),d.set([y,y*(.96+.08*E),y],M*3)}c[v]={mat:p,col:d,n:x},h+=x}const f=t*Ie,u=e*Ie,m=h?new kn(new W(f-.2,r,u-.2),new W(f+Ie+.2,l+.3,u+Ie+.2)):null;return{data:c,box:m,total:h}}update(t){const e=t.position,n=Math.max(0,this.app.terrain.heightAt(e.x,e.z)),i=e.y-n,o=i<14;for(const g in this.meshes)this.meshes[g].visible=i<60;this.group.visible=i<60;for(const g of Ws)this.forest.near[g].visible=o,this.forest.far[g].visible=o;if(!o)return;t.updateMatrixWorld(),this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const a=gr,r=Math.floor((e.x-a)/Ie),l=Math.floor((e.x+a)/Ie),c=Math.floor((e.z-a)/Ie),h=Math.floor((e.z+a)/Ie),f=[],u=[],m=[];let v="";for(let g=r;g<=l;g++)for(let x=c;x<=h;x++){const p=g*Ie,d=x*Ie,M=Math.max(p-e.x,0,e.x-p-Ie),_=Math.max(d-e.z,0,e.z-d-Ie),S=Math.hypot(M,_);if(S>a)continue;const w=g*8192+x,b=this.tiles.get(w);if(!b){m.push([S,g,x]);continue}if(!b.box||!this.frustum.intersectsBox(b.box))continue;const A=Math.hypot(Math.max(Math.abs(p-e.x),Math.abs(p+Ie-e.x)),Math.max(Math.abs(d-e.z),Math.abs(d+Ie-e.z))),y=S<Vs[1]+.3,E=A>Vs[0]-.3;y&&f.push(b),E&&u.push(b),v+=`${w}${y?"n":""}${E?"f":""},`}m.sort((g,x)=>g[0]-x[0]);for(let g=0;g<Math.min(m.length,10);g++){const[,x,p]=m[g];this.tiles.set(x*8192+p,this.buildTile(x,p))}if(this.tiles.size>3e3)for(const[g,x]of this.tiles){const p=Math.floor(g/8192+.5),d=g-p*8192;Math.hypot((p+.5)*Ie-e.x,(d+.5)*Ie-e.z)>a*3&&this.tiles.delete(g)}v!==this.lastSelection&&(this.lastSelection=v,this.fill(this.forest.near,f),this.fill(this.forest.far,u))}fill(t,e){for(const n of Ws){const i=t[n],o=i.instanceMatrix.count,a=i.instanceMatrix,r=i.instanceColor;let l=0;for(const c of e){const h=c.data[n];if(!h.n)continue;const f=Math.min(h.n,o-l);if(f<=0)break;a.array.set(f===h.n?h.mat:h.mat.subarray(0,f*16),l*16),r.array.set(f===h.n?h.col:h.col.subarray(0,f*3),l*3),l+=f}i.count=l,l&&(a.clearUpdateRanges(),a.addUpdateRange(0,l*16),a.needsUpdate=!0,r.clearUpdateRanges(),r.addUpdateRange(0,l*3),r.needsUpdate=!0)}}}const xr=3,Yo=10,_v=.022,$o=.03,wh=1.83*at,bh=.014,dn=1.8*at,yv=.0145,bn=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Mi=s=>s-Math.PI*2*Math.round(s/(Math.PI*2)),Sh=s=>{const t=s<0?1.3:3.5;return-2*s/(t*t)*Math.exp(-s*s/(t*t))};function vr(s,t){const e=new de,n=_t("#7a4b30",.1,t),i=_t("#b08a5a",.15,t);return s==="stand"?(e.box(-.12,0,0,.16,.85,.18,n,tt.skin,0,.8),e.box(.12,0,0,.16,.85,.18,n,tt.skin,0,.8),e.box(0,.78,0,.42,.32,.26,i,tt.plain),e.box(0,1.05,0,.44,.5,.24,n,tt.skin,0,.85),e.box(-.3,.88,0,.11,.62,.12,n,tt.skin),e.box(.3,.88,0,.11,.62,.12,n,tt.skin),e.blob(0,1.68,0,.13,.15,.13,_t("#3a2418",.1,t),tt.skin,1,!1)):(e.box(0,0,0,.6,.2,.42,i,tt.plain),e.box(0,.18,0,.42,.55,.24,n,tt.skin,0,.85),e.box(-.28,.2,.08,.1,.45,.1,n,tt.skin),e.box(.28,.2,.08,.1,.45,.1,n,tt.skin),e.blob(0,.86,0,.13,.15,.13,_t("#3a2418",.1,t),tt.skin,3,!1)),e.geometry()}const wv=.11,Yr=.44,ga=.4,$r=.06,bv=.885,Mr=.11,Eh=.29,_r=.62,ri=.62,yr=.2,wr={step:.5,tau:.62,lift:.08,swing:.5},Sv={step:.32,tau:1,lift:.14,swing:.25},Ev={step:.46,tau:.6,lift:.07,swing:.45},br={step:0,tau:.5,lift:.05,swing:.2},Xe=12,Ko={noa:[7,4.6],mua:[8,5],aina:[6,4.2],kuku:[5,3.6],alii:[12,7]},Tv={niu:.5,hala:1.4,ulu:.8,kukui:.8,maia:1.3,ki:.45,kiRed:.45,naupaka:1.5,aalii:1.1},as=0,qs=1,Av=.024;function Cv(s){const t=_t("#7a4b30",.1,s),e=_t("#b08a5a",.15,s),n=new de;n.box(0,-.1,0,.42,.32,.26,e,tt.plain),n.box(0,.17,0,.44,.5,.24,t,tt.skin,0,.85),n.blob(0,.8,.01,.13,.15,.13,_t("#3a2418",.1,s),tt.skin,1,!1);const i=new de;i.box(0,.02,0,.16,-Yr-.04,.18,t,tt.skin,0,.8);const o=new de;o.box(0,.02,0,.13,-ga-.02,.14,t,tt.skin,0,.85),o.box(0,-ga-$r,.05,.11,.075,.25,t,tt.skin);const a=new de;return a.box(0,.03,0,.11,-ri-.03,.12,t,tt.skin,0,.85),{torso:n.geometry(),thigh:i.geometry(),shin:o.geometry(),arm:a.geometry(),cloth:e}}function Rv(){const s=new de,t=[1,1,1];return s.box(0,.05,0,.05,-.13,.05,t,tt.plain),s.box(0,-.08,0,.085,-.2,.085,t,tt.plain,0,1.35),s.geometry()}function Pv(s){const t=new de,e=_t("#7a5a3a",.1,s),n=_t("#6b4a3a",.15,s),i=_t("#4f7a2e",.15,s);t.box(0,.03,0,.05,.05,1.7,e,tt.wood);for(const o of[-.74,.74])t.box(0,.05,o,.015,-.26,.015,e,tt.plain),t.blob(0,-.3,o,.17,.13,.15,n,tt.plain,7),t.blob(0,-.13,o,.11,.17,.11,i,tt.leaf,8,!1);return t.geometry()}function Lv(s,t){s.box(0,0,0,.6,.2,.42,t,tt.plain)}function kv(s,t){s.box(0,0,.5,1,.09,.44,_t("#6b4a2f",.1,t),tt.wood),s.blob(0,.1,.5,.15,.07,.13,_t("#8c7b86",.1,t),tt.plain,3)}function Dv(s,t){s.box(0,0,.48,1.4,.15,.2,_t("#5e4128",.1,t),tt.wood),s.box(.12,.15,.48,.75,.012,.24,_t("#e8dcc4",.05,t),tt.kapa)}function zv(s,t){const e=_t("#4a3c2c",.1,t);s.box(0,-.02,.95,1.6,.05,1.3,e,tt.plain),s.box(0,-.02,1.62,1.7,.07,.06,_t("#c9b48a",.1,t),tt.plain),s.blob(1.05,.04,.45,.32,.14,.26,e,tt.plain,5)}class rs{constructor(t=0){this.a=t,this.b=t,this.t0=0,this.d=1}at(t){const e=(t-this.t0)/this.d;return e>=1?this.b:e<=0?this.a:this.a+(this.b-this.a)*e*e*(3-2*e)}to(t,e,n){return this.a=this.at(e),this.b=t,this.t0=e,this.d=Math.max(.001,n),e+this.d}set(t){this.a=this.b=t,this.t0=0}}function ms(s,t,e,n,i,o){const a=i-e,r=o-n,l=a*a+r*r,c=l>0?Math.max(0,Math.min(1,((s-e)*a+(t-n)*r)/l)):0,h=s-e-a*c,f=t-n-r*c;return Math.sqrt(h*h+f*f)}function Sr(s,t,e,n,i,o,a,r){const l=(e-s)*(o-t)-(n-t)*(i-s),c=(e-s)*(r-t)-(n-t)*(a-s),h=(a-i)*(t-o)-(r-o)*(s-i),f=(a-i)*(n-o)-(r-o)*(e-i);return l*c<0&&h*f<0?0:Math.min(ms(s,t,i,o,a,r),ms(e,n,i,o,a,r),ms(i,o,s,t,e,n),ms(a,r,s,t,e,n))}function Zo(s,t,e){let n=1/0;for(let i=0,o=s.length-1;i<s.length;o=i++)n=Math.min(n,ms(t,e,s[o][0],s[o][1],s[i][0],s[i][1]));return n}function Fv(s,t){for(const e of t.loi)for(let n=e.model?16:5;n>0;n--)if(e.paddies[Math.floor(s()*e.paddies.length)].flood)for(let i=0;i<4;i++)s();for(const e of t.villages)for(let n=(e.model?12:e.alii?14:4)*5;n>0;n--)s();for(const e of t.heiau)if(e.model||e.kind==="luakini")for(let n=0;n<9;n++)s();for(const e of t.canoes)for(let n=(e.village===t.model?5:2)*4;n>0;n--)s();for(let e=0;e<t.ponds.length;e++)s()}function ln(s,t,e,n,i,o,a){const r=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(r[0],r[1],r[2])||1,c=[r[0]/l,r[1]/l,r[2]/l],h=Math.abs(c[0])<.9?[1,0,0]:[0,0,1],f=h[0]*c[0]+h[1]*c[1]+h[2]*c[2],u=[h[0]-f*c[0],h[1]-f*c[1],h[2]-f*c[2]],m=Math.hypot(u[0],u[1],u[2]);for(let x=0;x<3;x++)u[x]/=m;const v=[u[1]*c[2]-u[2]*c[1],u[2]*c[0]-u[0]*c[2],u[0]*c[1]-u[1]*c[0]],g=x=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([p,d])=>[x[0]+(u[0]*p*n+v[0]*d*i)/2,x[1]+(u[1]*p*n+v[1]*d*i)/2,x[2]+(u[2]*p*n+v[2]*d*i)/2]);s.hexa(g(t),g(e),o,a)}function oa(s,t){const e=new de,n=_t("#7a4b30",.1,t),i=_t("#b08a5a",.15,t),o=_t("#3a2418",.1,t);if(s==="ride"){for(const a of[1,-1])ln(e,[0,0,.38*a],[.1,.46,.3*a],.13,.13,n,tt.skin),ln(e,[.1,.46,.3*a],[0,.86,.12*a],.15,.15,n,tt.skin);e.box(0,.74,0,.28,.24,.42,i,tt.plain),ln(e,[0,.84,0],[.12,1.34,0],.24,.42,n,tt.skin),ln(e,[.1,1.28,.2],[.2,1.1,.8],.1,.1,n,tt.skin),ln(e,[.1,1.28,-.2],[.16,1.2,-.76],.1,.1,n,tt.skin),e.blob(.16,1.5,0,.13,.15,.13,o,tt.skin,4,!1)}else if(s==="sit"){for(const a of[1,-1])ln(e,[.12*a,.04,-.42],[.22*a,-.06,-.02],.15,.15,n,tt.skin),ln(e,[.22*a,-.06,-.02],[.24*a,-.5,.08],.13,.13,n,tt.skin),ln(e,[.25*a,.56,-.44],[.2*a,.1,-.16],.1,.1,n,tt.skin);e.box(0,-.02,-.45,.42,.2,.3,i,tt.plain),e.box(0,.12,-.46,.42,.52,.24,n,tt.skin,0,.85),e.blob(0,.82,-.44,.13,.15,.13,o,tt.skin,5,!1)}else{for(const a of[1,-1])ln(e,[.1*a,.08,-.32],[.1*a,.07,-1.25],.15,.14,n,tt.skin);e.box(0,0,-.3,.4,.2,.3,i,tt.plain),ln(e,[0,.11,-.16],[0,.17,.52],.42,.24,n,tt.skin),e.blob(0,.32,.72,.13,.14,.15,o,tt.skin,6,!1)}return e.geometry()}function Iv(s){const t=new de;return ln(t,[0,0,0],[0,-.62,0],.1,.1,_t("#7a4b30",.1,s),tt.skin),t.geometry()}function Uv(s){const t=new de,e=_t("#6b4630",.1,s);return t.box(0,-.12,-.2,.56,.12,3.2,e,tt.wood),t.hexa([[-.28,-.12,1.4],[.28,-.12,1.4],[.1,-.11,1.85],[-.1,-.11,1.85]],[[-.28,0,1.4],[.28,0,1.4],[.1,-.03,1.85],[-.1,-.03,1.85]],e,tt.wood),t.geometry()}function ku(s,t){const e=_t("#5e3d27",.1,t),n=_t("#9c7a52",.1,t);for(const i of[1,-1])s.box(.09*i,0,-.3,.05,.1,3,e,tt.wood),ln(s,[.09*i,.05,1.18],[.09*i,.22,1.8],.05,.1,e,tt.wood);for(const i of[-1.6,-.95,-.3,.35,1])s.box(0,.1,i,.3,.03,.07,e,tt.wood);s.box(0,.13,-.2,.24,.03,2.4,n,tt.kapa)}const Er=.16;function Nv(s){const t=new de;return ku(t,s),t.geometry()}function Ov(s){const t=new de;ku(t,s);const e=oa("prone",s),n=e.attributes.position.array,i=e.attributes.normal.array,o=e.attributes.color.array,a=e.attributes.aMat.array;for(let l=0;l<n.length;l+=3)t.pos.push(n[l],n[l+1]+Er,n[l+2]+.5),t.nor.push(i[l],i[l+1],i[l+2]),t.col.push(o[l],o[l+1],o[l+2]),t.mat.push(a[l/3]);const r=_t("#7a4b30",.1,s);for(const l of[1,-1])ln(t,[.25*l,Er+.2,.95],[.12*l,Er+.02,1.5],.1,.1,r,tt.skin);return t.geometry()}function Bv(s){const t=new de,e=_t("#1d1d22",.1,s),n=[[[0,0,.6],[-1.1,.25,-.1],[0,0,-.3]],[[0,0,.6],[0,0,-.3],[1.1,.25,-.1]],[[-1.1,.25,-.1],[-2,-.1,-.5],[-.6,.15,-.25]],[[1.1,.25,-.1],[.6,.15,-.25],[2,-.1,-.5]],[[0,0,-.3],[-.25,0,-1],[.25,0,-1]]];for(const[i,o,a]of n)t.tri(i,o,a,e,tt.plain),t.tri(i,a,o,e,tt.plain);return t.geometry()}function Hv(s,t,e,n,i,o,a,r,l){const c=e-s,h=n-t,f=a-i,u=r-o,m=s-i,v=t-o,g=c*c+h*h,x=c*f+h*u,p=f*f+u*u,d=c*m+h*v,M=f*m+u*v,_=g*p-x*x,S=A=>Math.max(0,Math.min(1,A));let w=_>1e-12?S((x*M-p*d)/_):0,b=(x*w+M)/p;return b<0?(b=0,w=S(-d/g)):b>1&&(b=1,w=S((x-d)/g)),l.x=m+c*w-f*b,l.z=v+h*w-u*b,l.d=Math.hypot(l.x,l.z),l}const Gv=`
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
`,Wv=`
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
`;class Vv{constructor(t){this.app=t,this._m=new te,this._q=new Di,this._p=new W,this._s=new W,this._e=new co,this._c=new Dt;const e=t.island.meta,n=e.sites,i=Ci(e.seed+2024);this.rand=i,this.group=new xn,this.mat=eo(t.shared,{fade:[24,34]});const o=t.terrain,a=(b,A)=>Math.max(0,o.heightAt(b,A)),r=Ci(e.seed+2025),l=t.features.holuaPath;this.frand=Ci(e.seed+2026),this.spot={x:0,z:0},this.folk=[],this.folkSites=[],this.placeFolk(n,r,l),Fv(i,n),this.buildFolk(i),this.trail=e.trail.slice();let c=0;for(let b=0;b<this.trail.length;b++){const A=this.trail[b],y=this.trail[(b+1)%this.trail.length];c+=A[0]*y[1]-y[0]*A[1]}c<0&&this.trail.reverse(),this.trailLen=[0];for(let b=1;b<=this.trail.length;b++){const A=this.trail[b-1],y=this.trail[b%this.trail.length];this.trailLen.push(this.trailLen[b-1]+Math.hypot(y[0]-A[0],y[1]-A[1]))}const h=n.alii||n.villages[0];let f=0,u=1/0;for(let b=0;b<this.trail.length;b++){const A=Math.hypot(this.trail[b][0]-h.x,this.trail[b][1]-h.z);A<u&&(u=A,f=this.trailLen[b])}this.procS=f-.6;const m=new de;ov(m,i),this.akua=new ae(m.geometry(),this.mat),this.akua.frustumCulled=!1,this.group.add(this.akua),this.boats=[];const v=(()=>{const b=new de;return Pu(b,i,8),b.geometry()})(),g=vr("sit",i),x=e.ahupuaa.find(b=>b.id===n.model);for(let b=0;b<4;b++){const A=n.canoes[b%n.canoes.length],y=b<3&&x?x.mouth:[A.x,A.z],E=b<3?Math.atan2(x.mouth[1]-x.topZ,x.mouth[0]-x.topX):A.dir,R=5+i()*5,P=y[0]+Math.cos(E)*R+(i()-.5)*3,N=y[1]+Math.sin(E)*R+(i()-.5)*3;if(o.heightAt(P,N)>-.02)continue;const T=new xn,C=new ae(v,this.mat);C.scale.setScalar(at),T.add(C);for(const I of[-1.6,1.4]){const H=new ae(g,this.mat);H.scale.setScalar(at),H.position.set(I*at,.45*at,0),H.rotation.y=Math.PI/2,T.add(H)}T.position.set(P,0,N),T.rotation.y=i()*6.28,this.group.add(T),this.boats.push({g:T,x:P,z:N,ph:i()*6.28,drift:i()*6.28,crew:2})}const p=new de;Lu(p,i),this.voyager=new ae(p.geometry(),this.mat),this.voyager.scale.setScalar(at),this.voyager.frustumCulled=!1,this.group.add(this.voyager),this.voyagerS=0,this.breaks=[],this.surfers=[];for(const b of n.surf){const A=this.layBreak(b,o,n.ponds);if(!A)continue;this.breaks.push(A);let y=A.tx[0]-(A.tx[0]*A.nx[0]+A.tz[0]*A.nz[0])*A.nx[0],E=A.tz[0]-(A.tx[0]*A.nx[0]+A.tz[0]*A.nz[0])*A.nz[0];const R=Math.hypot(y,E)||1;y/=R,E/=R;for(let P=0;P<3;P++){const N=P-1,T=r()*.04,C=A.lineX+y*N*.11+A.nx[0]*T,I=A.lineZ+E*N*.11+A.nz[0]*T,H={brk:A,state:"sit",x:C,z:I,slotX:C,slotZ:I,head:A.seaHead+(r()-.5)*.3,look:(r()-.5)*.3,since:-r()*60};Object.assign(H,{s:0,ph:r()*6.28,scale:.92+r()*.2,pace:.85+r()*.3,tint:r()<.3?2.2:.75+r()*.3,wave:0,take:0,lead:.05,tTake:0,a0:0,dur:0,fall:!1,t:0,sx:0,sz:0,fx:0,fz:0,wx:0,wz:0,leg:0}),Object.assign(H,{pose:"sit",pitch:0,roll:0,stroke:0,tilt:!0,tried:!1}),A.surfers.push(H),this.surfers.push(H)}}const d=Math.max(1,this.surfers.length),M=(b,A)=>{const y=new to(b,this.mat,A);return y.frustumCulled=!1,y.instanceMatrix.setUsage(vs),y.count=0,this.group.add(y),y};if(this.boards=M(Uv(r),d),this.boards.instanceColor=new $n(new Float32Array(d*3).fill(1),3),this.surfPose={ride:M(oa("ride",r),d),sit:M(oa("sit",r),d),prone:M(oa("prone",r),d)},this.arms=M(Iv(r),d*2),this._sw={age:0,height:0,next:0,id:0},this._sep={d:0,x:0,z:0},this._mb=new te,this._ml=new te,this._ma=new te,this.view={x:0,z:0,dist:1/0,remain:0},this.counts={board:0,ride:0,sit:0,prone:0,arm:0},this.holua=null,l&&l.length>1){const b=l.length,A={x:new Float32Array(b),y:new Float32Array(b),z:new Float32Array(b),n:b,riders:[],runner:null,time:0,next:6+r()*20,watching:!1};for(let N=0;N<b;N++)A.x[N]=l[N][0],A.y[N]=l[N][1]+yv,A.z[N]=l[N][2];A.len=Math.hypot(A.x[b-1]-A.x[0],A.z[b-1]-A.z[0]),A.ds=A.len/(b-1),A.dx=(A.x[b-1]-A.x[0])/A.len,A.dz=(A.z[b-1]-A.z[0])/A.len,A.head=Math.atan2(A.dx,A.dz),this.clearTrack(A);const y=10;for(let N=0;N<y;N++){const T=N%2?1:-1,C=(N>>1)*.035,I={state:N<2?"wait":"walk",s:0,v:0,t:0,since:-N,side:T,ph:r()*6.28,pace:.9+r()*.2};I.spotS=-.02-C,I.spotOff=T*(.09+C*.6),I.wayOff=T*(.14+C*.6),I.s=N<2?0:A.len*(.1+.85*(N-2)/(y-2)),A.riders.push(I)}A.tAt=new Float32Array(b),A.vAt=new Float32Array(b);const E={s:dn,v:1.5};let R=0,P=0;for(let N=!1;P<b&&R<600;R+=.05){for(;P<b&&P*A.ds<=E.s;)A.tAt[P]=R,A.vAt[P]=E.v,P++;if(N)break;N=this.slide(A,E,.05)}for(;P<b;P++)A.tAt[P]=R,A.vAt[P]=0;this.holua=A,this._pose={y:0,pitch:0},this.sleds=M(Nv(r),y),this.sledders=M(Ov(r),1)}this.birds=new to(Bv(i),this.mat,12),this.birds.frustumCulled=!1,this.birds.instanceMatrix.setUsage(vs),this.group.add(this.birds),this.birdCentres=[];for(let b=0;b<12;b++){const A=n.villages[Math.floor(i()*n.villages.length)];this.birdCentres.push({x:A.x+(i()-.5)*6,z:A.z+(i()-.5)*6,r:.6+i()*1.4,h:.9+i()*1.4,ph:i()*6.28,sp:.08+i()*.06})}const _=[],S=[];for(const b of n.villages)for(let A=0;A<14;A++)_.push(b.x+.05,a(b.x,b.z)+.01,b.z+.05),S.push(A/14+i()*.05);const w=new Le;w.setAttribute("position",new xe(_,3)),w.setAttribute("aSeed",new xe(S,1)),w.setAttribute("aAge",new xe(new Float32Array(S.length),1)),this.smoke=new lu(w,new be({vertexShader:Gv,fragmentShader:Wv,uniforms:{uTime:t.shared.uniforms.uTime,uWindVec:t.shared.uniforms.uWindVec,uSkyColor:t.shared.uniforms.uSkyColor,uSunColor:t.shared.uniforms.uSunColor},transparent:!0,depthWrite:!1})),this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,this.group.add(this.smoke)}layBreak(t,e,n){const i=this.app.ocean.swellDir,o=(R,P)=>-e.metresAt(R,P),a=.03,r=(R,P)=>(o(R+a,P)-o(R-a,P))/(2*a),l=(R,P)=>(o(R,P+a)-o(R,P-a))/(2*a),c=Math.cos(t.dir),h=Math.sin(t.dir);let f=null,u=0;for(let R=0;R<1.6;R+=.01)if(o(t.x+c*R,t.z+h*R)>=xr){f=t.x+c*R,u=t.z+h*R;break}if(f===null)return null;const m=(R,P,N,T)=>{if(o(R-N*.1,P-T*.1)<.02)return!1;for(const C of n)if(!(Math.hypot(C.cx-R,C.cz-P)>C.r+1.5)){if(Ks(C.wall,R,P))return!1;for(const I of C.wall)if(Math.hypot(I[0]-R,I[1]-P)<.25)return!1}return!0},v=R=>{const P=[];let N=f,T=u;for(let C=0;C<70;C++){const I=r(N,T),H=l(N,T),z=Math.hypot(I,H);if(z<4)break;let O=-H/z,k=I/z;if(O*i[0]+k*i[1]<0&&(O=-O,k=-k),O*i[0]+k*i[1]<.3)break;N+=O*.03*R,T+=k*.03*R;for(let q=0;q<4;q++){const K=r(N,T),L=l(N,T),B=K*K+L*L;if(B<1)break;const G=xr-o(N,T);N+=K*G/B,T+=L*G/B}if(!m(N,T,I/z,H/z))break;P.push([N,T])}return P};if(!m(f,u,c,h))return null;const g=v(-1).reverse(),x=[...g,[f,u],...v(1)],p=[0];for(let R=1;R<x.length;R++)p.push(p[R-1]+Math.hypot(x[R][0]-x[R-1][0],x[R][1]-x[R-1][1]));const d=p[p.length-1];if(d<.5)return null;const M=Math.min(1.4,d),_=Math.min(p[g.length],d-M),S=.03,w=Math.floor(M/S)+1,b={n:w,step:S,len:(w-1)*S,x:new Float32Array(w),z:new Float32Array(w),tx:new Float32Array(w),tz:new Float32Array(w),nx:new Float32Array(w),nz:new Float32Array(w),g:new Float32Array(w),surfers:[],called:-1,lastT:0,watching:!1,eager:!1};let A=0;for(let R=0;R<w;R++){const P=_+R*S;for(;A<p.length-2&&p[A+1]<P;)A++;const N=Math.max(0,Math.min(1,(P-p[A])/Math.max(1e-6,p[A+1]-p[A])));b.x[R]=x[A][0]+(x[A+1][0]-x[A][0])*N,b.z[R]=x[A][1]+(x[A+1][1]-x[A][1])*N}for(let R=0;R<w;R++){const P=r(b.x[R],b.z[R]),N=l(b.x[R],b.z[R]),T=Math.hypot(P,N)||1;b.nx[R]=P/T,b.nz[R]=N/T;const C=Math.max(0,R-1),I=Math.min(w-1,R+1),H=Math.hypot(b.x[I]-b.x[C],b.z[I]-b.z[C])||1;b.tx[R]=(b.x[I]-b.x[C])/H,b.tz[R]=(b.z[I]-b.z[C])/H;const z=(b.x[R]-b.x[0])*i[0]+(b.z[R]-b.z[0])*i[1];b.g[R]=R?Math.max(z,b.g[R-1]+1e-4):0}let y=b.x[0]+b.nx[0]*.1,E=b.z[0]+b.nz[0]*.1;for(let R=0;R<3&&o(y,E)<xr+2;R++)y+=b.nx[0]*.02,E+=b.nz[0]*.02;return b.lineX=y,b.lineZ=E,b.seaHead=Math.atan2(b.nx[0],b.nz[0]),b}clearTrack(t){const e=this.app.vegetation;if(!e||!e.cleared)return;const n=e.cleared,i=le,o=qt/i,a=.24+.5*o*(Math.abs(t.dx)+Math.abs(t.dz)),r=-.2-a,l=t.len+a,c=[t.x[0]+t.dx*r,t.x[0]+t.dx*l],h=[t.z[0]+t.dz*r,t.z[0]+t.dz*l],f=Math.max(0,Math.floor((Math.min(...c)-a+ut)/o)),u=Math.min(i-1,Math.floor((Math.max(...c)+a+ut)/o)),m=Math.max(0,Math.floor((Math.min(...h)-a+ut)/o)),v=Math.min(i-1,Math.floor((Math.max(...h)+a+ut)/o));for(let g=m;g<=v;g++)for(let x=f;x<=u;x++){const p=-ut+(x+.5)*o-t.x[0],d=-ut+(g+.5)*o-t.z[0],M=p*t.dx+d*t.dz;M>r&&M<l&&Math.abs(d*t.dx-p*t.dz)<a&&(n[g*i+x]=1)}e.tiles&&e.tiles.size&&(e.tiles.clear(),e.lastSelection="")}breakNear(t,e){let n=null,i=3;for(const o of this.breaks){const a=Math.hypot(o.x[0]-t,o.z[0]-e);a<i&&(i=a,n=o)}return n}breakS(t,e){const n=t.g;if(e<=0)return 0;if(e>=n[t.n-1])return t.len;let i=0,o=t.n-1;for(;i<o-1;){const a=i+o>>1;n[a]<=e?i=a:o=a}return(i+(e-n[i])/(n[o]-n[i]))*t.step}placeFolk(t,e,n){const i=this.app.terrain,o=this.frand,{open:a,room:r,take:l,clearWalk:c,linesClear:h,plantsClear:f}=this.openGround();this.open=a,this.clearWalk=c,this.linesClear=h;let u=null;const m=(p,d)=>{u={x:p,z:d,y:Math.max(0,i.heightAt(p,d)),r:0,i0:this.folk.length,i1:0},this.folkSites.push(u)},v=()=>{u.i1=this.folk.length;for(let p=u.i0;p<u.i1;p++)u.r=Math.max(u.r,Math.hypot(this.folk[p].x-u.x,this.folk[p].z-u.z));u.i1===u.i0&&this.folkSites.pop()},g=(p,d,M,_,S={})=>{const w=this.figure(p,d,M,_,S);return this.folk.push(w),w},x=(p,d)=>{for(let M=0;M<30&&p.length;M++){const _=p[Math.floor(o()*p.length)];if(d(_))return _}return null};for(const p of t.villages){m(p.x,p.z);const d=p.model||p.alii,M=[];for(const T of t.houses){if(T.village!==p.id||Math.hypot(T.x-p.x,T.z-p.z)>1.6)continue;const[C,I]=Ko[T.kind]||Ko.noa,H=T.scale||1,z=Math.cos(T.rot),O=Math.sin(T.rot),k=(C*H/2+1.7)*at,q=(I*H/2+1.7)*at,K=C*H*at/4;for(const[L,B,G]of[[k,0,!1],[-k,0,!1],[K,q,!0],[-K,q,!0],[K,-q,!0],[-K,-q,!0]]){const $=G?0:Math.sign(L),Q=G?Math.sign(B):0;M.push({x:T.x+L*z-B*O,z:T.z+L*O+B*z,yaw:Math.atan2($*z-Q*O,$*O+Q*z),wall:G})}}const _=[];for(let T=0;T<40;T++){const C=o()*Math.PI*2,I=Math.sqrt(o())*.6;_.push({x:p.x+Math.cos(C)*I,z:p.z+Math.sin(C)*I,yaw:o()*Math.PI*2,wall:!1})}const S=(T,C=.012,I=.35)=>a(T.x,T.z,C,I)&&r(T.x,T.z,C),w=T=>{const C=x(M,I=>{if(!I.wall||!S(I,.011,.2))return!1;const H=I.x+Math.sin(I.yaw)*.5*at,z=I.z+Math.cos(I.yaw)*.5*at;return a(H,z,.012,.2)&&r(H,z,.012)});C&&(g(T,C.x,C.z,C.yaw,{body:"seat"}),l(C.x,C.z,.011),l(C.x+Math.sin(C.yaw)*.5*at,C.z+Math.cos(C.yaw)*.5*at,.012))};(d||o()<.4)&&w("poi"),d&&w("kapa");const b=T=>{const C=x(_,H=>S(H,.034,.2));if(!C)return;const I=o()*Math.PI*2;for(let H=0;H<T;H++){const z=I+H/T*Math.PI*2+(o()-.5)*.5,O=C.x+Math.sin(z)*.019,k=C.z+Math.cos(z)*.019;!a(O,k,.008,.2)||!r(O,k,.008)||(g("sit",O,k,z+Math.PI+(o()-.5)*.4,{body:"sit"}),l(O,k,.009))}};d?b(3):o()<.5&&b(2);const A=x(M,T=>!T.wall&&S(T,.009,.2));A&&(g("sit",A.x,A.z,A.yaw+(o()-.5)*.6,{body:"sit"}),l(A.x,A.z,.009));const y=()=>{for(let T=0;T<10;T++){const C=x(o()<.5?M:_,O=>S(O,.011));if(!C)return;const I=o()*Math.PI*2,H=C.x+Math.sin(I)*.021,z=C.z+Math.cos(I)*.021;if(!(!a(H,z,.011)||!r(H,z,.011))){g("talk",C.x,C.z,I),g("talk",H,z,I+Math.PI),l(C.x,C.z,.011),l(H,z,.011);return}}};for(let T=p.alii?2:d||o()<.5?1:0;T>0;T--)y();const E=x(M,T=>S(T,.011));E&&(g("idle",E.x,E.z,E.yaw+(o()-.5)*.8),l(E.x,E.z,.011));const R=[...M,..._];for(let T=R.length-1;T>0;T--){const C=Math.floor(o()*(T+1)),I=R[T];R[T]=R[C],R[C]=I}const P=[];for(const T of R){if(P.length>=(d?30:12))break;!P.some(C=>Math.hypot(C.x-T.x,C.z-T.z)<.04)&&S(T,.01)&&P.push(T)}const N={n:P.length,x:new Float32Array(P.length),z:new Float32Array(P.length),yaw:new Float32Array(P.length),busy:new Uint8Array(P.length),walkers:[]};P.forEach((T,C)=>{N.x[C]=T.x,N.z[C]=T.z,N.yaw[C]=T.yaw});for(let T=d?3:1,C=0;T>0&&C<N.n;T--,C++){N.busy[C]=1;const I=g("walk",N.x[C],N.z[C],N.yaw[C],{home:N,steps:64});I.spot=C,N.walkers.push(I)}v()}for(const p of t.loi){const d=p.paddies.filter(y=>y.flood);if(!d.length)continue;let M=0,_=0;for(const y of p.paddies)M+=y.c[0]/p.paddies.length,_+=y.c[1]/p.paddies.length;m(M,_);const S=this.thickest(p),w=d.filter(y=>Math.hypot(y.c[0]-S.c[0],y.c[1]-S.c[1])<1.5),b=[];for(let y=p.model?16:5;y>0;y--){const E=w.length&&o()<.6?w:d,R=E[Math.floor(o()*E.length)];if(!this.spotIn(R,b,o,null))continue;const P=g("loi",this.spot.x,this.spot.z,o()*Math.PI*2,{floor:(R.level-.25)*Gt,home:R,steps:24});P.mates=b,b.push(P)}const A=p.model||o()<.4?this.bankWalk(p,S.c[0],S.c[1],h,f):null;if(A){const y=g("carry",A.ax,A.az,Math.atan2(A.bx-A.ax,A.bz-A.az),{floor:A.y,steps:72});Object.assign(y,A)}v()}for(const p of t.canoes){m(p.x,p.z);const d=Math.cos(p.dir),M=Math.sin(p.dir),_=(A,y)=>Math.atan2(A*d-y*M,A*M+y*d),S=[];for(let A=0;A<p.n;A++){const y=(A-(p.n-1)/2)*.09;S.push([y+.017,-1]),A===0&&S.push([y-.06,1])}const w=p.village===t.model,b=[];for(let A=w?4:2;A>0;A--)for(let y=0;y<10;y++){const[E,R]=S[Math.floor(o()*S.length)],P=(o()-.5)*.1,N=p.x+P*d-E*M,T=p.z+P*M+E*d;if(!a(N,T,.008)||!r(N,T,.014))continue;const C=g("crew",N,T,_(0,R),{steps:24});C.face=_(0,R),C.sea=_(1,0),C.home={x:p.x,z:p.z,cs:d,sn:M,lz:E,crew:b},b.push(C),l(N,T,.012);break}if(w)for(let A=0;A<20;A++){const y=-.115-o()*.055,E=(o()-.5)*(p.n*.09+.1),R=p.x+y*d-E*M,P=p.z+y*M+E*d,N=_(1,0)+(o()-.5)*.8,T=R+Math.sin(N)*.95*at,C=P+Math.cos(N)*.95*at;if(!(!a(R,P,.01,.2)||!r(R,P,.012)||!a(T,C,.014,.15)||!r(T,C,.014))){g("mend",R,P,N,{body:"seat"}),l(R,P,.012),l(T,C,.014);break}}v()}for(const p of t.ponds){const d=this.gateSpot(p);m(d.x,d.z),g("keeper",d.x,d.z,d.yaw,{floor:Av}),v()}for(const p of t.heiau){if(!(p.model||p.kind==="luakini"))continue;const d=p.kind==="luakini",M=d?1:.6,_=p.court??Math.max(0,i.heightAt(p.x,p.z))+(d?4.8:2.4)*at,S=Math.cos(p.rot),w=Math.sin(p.rot);m(p.x,p.z);const b=[];for(let A=0,y=0;A<3&&y<30;y++){const E=(.6+o()*3.4)*M*at,R=-(1.6+o()*4)*M*at,P=p.x+E*S-R*w,N=p.z+E*w+R*S;b.some(T=>Math.hypot(T[0]-P,T[1]-N)<.02)||(b.push([P,N]),g("priest",P,N,Math.atan2(-S,-w)+(o()-.5)*.6,{floor:_,tint:2.4}),A++)}v()}if(n&&n.length>1){const p=n[0],d=n[n.length-1],M=Math.hypot(d[0]-p[0],d[2]-p[2]),_=(d[0]-p[0])/M,S=(d[2]-p[2])/M;m((p[0]+d[0])/2,(p[2]+d[2])/2);const w=(b,A,y)=>{const E=p[0]+_*b-S*A,R=p[2]+S*b+_*A,P=Math.atan2(S*A,-_*A)+(e()-.5)*.6;y==="sit"?g("sit",E,R,P,{body:"sit"}):g("watch",E,R,P)};for(let b=0;b<16;b++)w(M-.05-e()*.7,(b%2?-1:1)*(.125+e()*.075),e()<.6?"stand":"sit");for(let b=0;b<4;b++)w(M*(.35+e()*.4),(e()<.5?-1:1)*(.125+e()*.075),"sit");for(let b=0;b<3;b++)w(.04+e()*.12,-(.13+e()*.07),"stand");v()}}openGround(){var K;const t=this.app,e=t.terrain,n=t.island.meta,i=n.sites,o=t.vegetation,a=.25,r=(L,B)=>(L+2048)*4096+B+2048,l=(L,B)=>r(Math.floor(L/a),Math.floor(B/a)),c=(L,B,G,$,Q,st)=>{for(let j=Math.floor(B/a);j<=Math.floor($/a);j++)for(let X=Math.floor(G/a);X<=Math.floor(Q/a);X++){const ot=r(j,X),V=L.get(ot);V?V.push(st):L.set(ot,[st])}},h=Math.ceil(qt)+2,f=new Uint8Array(h*h),u=(L,B)=>(Math.floor(L+ut)+1)*h+Math.floor(B+ut)+1,m=(L,B,G)=>{for(let $=Math.floor(L-G);$<=Math.floor(L+G);$++)for(let Q=Math.floor(B-G);Q<=Math.floor(B+G);Q++)f[u($,Q)]=1};for(const L of i.villages)m(L.x,L.z,2.3);for(const L of i.canoes)m(L.x,L.z,.8);for(const L of i.loi){m(this.thickest(L).c[0],this.thickest(L).c[1],1.2);for(const B of L.paddies)B.flood&&m(B.c[0],B.c[1],.3)}const v=(L,B)=>f[u(L,B)]===1,g=[],x=new Map,p=(L,B,G,$,Q)=>{const st=Math.max(1,Math.ceil(Math.hypot(G-L,$-B)/.5));let j=!1;for(let ot=0;ot<=st&&!j;ot++)j=v(L+(G-L)*ot/st,B+($-B)*ot/st);if(!j)return;const X=Q+.04;c(x,Math.min(L,G)-X,Math.min(B,$)-X,Math.max(L,G)+X,Math.max(B,$)+X,g.length),g.push(L,B,G,$,Q)};for(const L of((K=t.wailele)==null?void 0:K.lines)||Ea(n,t.island.data)){const B=Math.min(.11,.009*Math.sqrt(L.lineA)+.012)*1.4+.008;for(let G=1;G<L.pts.length;G++)p(L.pts[G-1][0],L.pts[G-1][1],L.pts[G][0],L.pts[G][1],B)}for(const L of i.loi)for(const B of L.auwai)for(let G=1;G<B.length;G++)Math.hypot(B[G][0]-B[G-1][0],B[G][1]-B[G-1][1])<1.2&&p(B[G-1][0],B[G-1][1],B[G][0],B[G][1],.013);for(const L of i.ponds)for(let B=1;B<L.wall.length;B++)p(L.wall[B-1][0],L.wall[B-1][1],L.wall[B][0],L.wall[B][1],.06);const d=t.features.holuaPath;if(d)for(let L=1;L<d.length;L++)p(d[L-1][0],d[L-1][2],d[L][0],d[L][2],.065);const M=t.features.puuhonuaWall;M&&p(M.a[0],M.a[2],M.b[0],M.b[2],.05);const _=[],S=new Map,w=(L,B,G,$,Q,st,j)=>{const X=Math.hypot(Math.max(-$,Q),Math.max(-st,j))+.04;c(S,L-X,B-X,L+X,B+X,_.length),_.push(L,B,Math.cos(G),Math.sin(G),$,Q,st,j)};for(const L of i.houses){const[B,G]=Ko[L.kind]||Ko.noa,$=L.scale||1,Q=(B*$+1.8)/2*at,st=(G*$+1.8)/2*at;w(L.x,L.z,L.rot,-Q,Q,-st,st)}const b=(t.features.footings||[]).filter(L=>L.box&&(L.kind==="heiau"||L.kind==="luakini"));for(const L of b)w(L.box.x,L.box.z,Math.atan2(L.box.s,L.box.c),-L.box.hx,L.box.hx,-L.box.hz,L.box.hz);if(!b.length)for(const L of i.heiau){const B=L.kind==="luakini",G=(B?44:26)/2*at,$=(B?30:18)/2*at;w(L.x,L.z,L.rot,-G,G,-$,$)}for(const L of i.canoes){for(let B=0;B<L.n;B++){const G=(B-(L.n-1)/2)*.09;w(L.x,L.z,L.dir,-.095,.095,G-.043,G+.008)}if(L.house){const B=L.shed||{x:L.x-Math.cos(L.dir)*.32,z:L.z-Math.sin(L.dir)*.32,rot:L.dir};w(B.x,B.z,B.rot,-.135,.135,-.055,.055)}}const A=i.alii&&i.canoes.find(L=>L.village===i.alii.id);A&&w(A.x,A.z,A.dir,-.16,.16,.4,.5);for(const L of i.ponds)if(L.keeper)w(L.keeper.x,L.keeper.z,L.keeper.rot,-2.9*at,2.9*at,-2.4*at,2.4*at);else if(L.keeper===void 0){const B=L.wall[Math.round(L.gates[0]*(L.wall.length-1))];w(B[0]-L.ax*.12,B[1]-L.az*.12,0,-.066,.066,-.066,.066)}for(const L of i.villages)L.imu&&w(L.imu.x,L.imu.z,0,-1.3*at,1.3*at,-1.3*at,1.3*at);for(const L of i.saltpans||[])w(L.x,L.z,L.dir+Math.PI/2,-.22,.22,-.135,.135);const y=i.puuhonua;if(y){const L=Math.cos(y.dir),B=Math.sin(y.dir),G=y.heiau===void 0?{x:y.x-L*.5,z:y.z-B*.5,rot:y.dir}:y.heiau;G&&w(G.x,G.z,G.rot,-13*at,13*at,-9*at,9*at),w(y.x-L*.05,y.z-B*.05,y.dir,-.02,.02,-.33,.33);for(let $=0;$<3;$++){const Q=y.houses?y.houses[$]:{x:y.x-L*1.1-B*($-1)*.6,z:y.z-B*1.1+L*($-1)*.6,rot:y.dir+Math.PI/2};Q&&w(Q.x,Q.z,Q.rot,-3.9*at,3.9*at,-2.9*at,2.9*at)}}const E=new Map;if(o&&o.fixed)for(const L in o.fixed){const B=Tv[L]||.8;for(const G of o.fixed[L]){if(!v(G.x,G.z))continue;const $=B*G.s;c(E,G.x-$-.04,G.z-$-.04,G.x+$+.04,G.z+$+.04,[G.x,G.z,$])}}const R=i.loi.map(L=>{let B=1/0,G=-1/0,$=1/0,Q=-1/0;for(const st of L.paddies)for(const j of st.poly)B=Math.min(B,j[0]),G=Math.max(G,j[0]),$=Math.min($,j[1]),Q=Math.max(Q,j[1]);return[B,G,$,Q]}),P=le,N=(L,B)=>{if(!o)return!0;const G=Math.floor((L+ut)/qt*P),$=Math.floor((B+ut)/qt*P);if(G<0||$<0||G>=P||$>=P)return!0;const Q=$*P+G;return o.land[Q*4+1]>.2*255||o.land[Q*4+3]>.3*255||o.cleared[Q]===1||e.metresAt(L,B)<3},T=(L,B,G)=>{const $=x.get(l(L,B));if(!$)return!0;for(let Q=0;Q<$.length;Q++){const st=$[Q];if(ms(L,B,g[st],g[st+1],g[st+2],g[st+3])<g[st+4]+G)return!1}return!0},C=(L,B,G)=>{const $=E.get(l(L,B));if(!$)return!0;for(let Q=0;Q<$.length;Q++)if(Math.hypot($[Q][0]-L,$[Q][1]-B)<$[Q][2]+G)return!1;return!0},I=(L,B,G)=>{const $=S.get(l(L,B));if($)for(let Q=0;Q<$.length;Q++){const st=$[Q],j=L-_[st],X=B-_[st+1],ot=j*_[st+2]+X*_[st+3],V=-j*_[st+3]+X*_[st+2];if(ot>_[st+4]-G&&ot<_[st+5]+G&&V>_[st+6]-G&&V<_[st+7]+G)return!1}return!0},H=(L,B,G,$=.35)=>{if(e.metresAt(L,B)<.6||!C(L,B,G)||!I(L,B,G)||!N(L,B)||!N(L+.015,B)||!N(L-.015,B)||!N(L,B+.015)||!N(L,B-.015))return!1;const Q=.012,st=e.metresAt(L+Q,B)-e.metresAt(L-Q,B),j=e.metresAt(L,B+Q)-e.metresAt(L,B-Q);if(Math.hypot(st,j)/(2*Q/Xs)>$||!T(L,B,G))return!1;for(let X=0;X<i.loi.length;X++){const ot=R[X];if(L<ot[0]-.05||L>ot[1]+.05||B<ot[2]-.05||B>ot[3]+.05)continue;const V=i.loi[X].paddies;for(let xt=0;xt<V.length;xt++){const pt=V[xt];if(!(Math.abs(pt.c[0]-L)>.45||Math.abs(pt.c[1]-B)>.45)&&(Ks(pt.poly,L,B)||Zo(pt.poly,L,B)<G+.006))return!1}}return!0},z=new Map,O=(L,B,G)=>{const $=z.get(l(L,B));if(!$)return!0;for(let Q=0;Q<$.length;Q++)if(Math.hypot($[Q][0]-L,$[Q][1]-B)<G+$[Q][2])return!1;return!0};return{open:H,room:O,take:(L,B,G)=>c(z,L-G-.04,B-G-.04,L+G+.04,B+G+.04,[L,B,G]),clearWalk:(L,B,G,$)=>{const Q=Math.ceil(Math.hypot(G-L,$-B)/.014);for(let st=1;st<Q;st++){const j=L+(G-L)*st/Q,X=B+($-B)*st/Q;if(!H(j,X,.008)||!O(j,X,.008))return!1}return!0},linesClear:T,plantsClear:C,boxesClear:I}}thickest(t){if(this.thick=this.thick||new Map,this.thick.has(t))return this.thick.get(t);let e=t.paddies[0],n=-1;for(let i=0;i<t.paddies.length;i+=4){const o=t.paddies[i];let a=0;for(const r of t.paddies)Math.abs(r.c[0]-o.c[0])<1.6&&Math.abs(r.c[1]-o.c[1])<1.6&&Math.hypot(r.c[0]-o.c[0],r.c[1]-o.c[1])<1.6&&a++;a>n&&(n=a,e=o)}return this.thick.set(t,e),e}spotIn(t,e,n,i){let o=1/0,a=-1/0,r=1/0,l=-1/0;for(const c of t.poly)o=Math.min(o,c[0]),a=Math.max(a,c[0]),r=Math.min(r,c[1]),l=Math.max(l,c[1]);for(let c=0;c<14;c++){let h,f;if(i){const m=n()*Math.PI*2,v=.025+n()*.045;h=i.x+Math.sin(m)*v,f=i.z+Math.cos(m)*v}else h=o+n()*(a-o),f=r+n()*(l-r);if(!Ks(t.poly,h,f)||Zo(t.poly,h,f)<.016||!this.linesClear(h,f,.006)||i&&Zo(t.poly,(h+i.x)/2,(f+i.z)/2)<.016||i&&(!this.linesClear((h+i.x)/2,(f+i.z)/2,.006)||!this.linesClear((h*3+i.x)/4,(f*3+i.z)/4,.006)||!this.linesClear((h+i.x*3)/4,(f+i.z*3)/4,.006)))continue;let u=!0;for(let m=0;m<e.length&&u;m++){const v=e[m];u=v===i||Math.hypot(v.x-h,v.z-f)>=.03&&Math.hypot(v.tx-h,v.tz-f)>=.03&&(!i||Sr(v.x,v.z,v.tx,v.tz,i.x,i.z,h,f)>=.014)}if(u)return this.spot.x=h,this.spot.z=f,!0}return!1}bankWalk(t,e,n,i,o){const a=this.app.terrain,r=u=>{const m=[1/0,-1/0,1/0,-1/0];for(const v of u.poly)m[0]=Math.min(m[0],v[0]),m[1]=Math.max(m[1],v[0]),m[2]=Math.min(m[2],v[1]),m[3]=Math.max(m[3],v[1]);return m},l=new Map(t.paddies.map(u=>[u,r(u)])),c=t.paddies.map(u=>[Math.hypot(u.c[0]-e,u.c[1]-n),u]).sort((u,m)=>u[0]-m[0]).slice(0,16);let h=null,f=-1/0;for(const[,u]of c){const m=l.get(u),v=t.paddies.filter(x=>{const p=l.get(x);return x!==u&&p[0]<m[1]+.02&&p[1]>m[0]-.02&&p[2]<m[3]+.02&&p[3]>m[2]-.02}),g=u.poly;for(let x=0;x<g.length;x++){const p=g[x],d=g[(x+1)%g.length],M=Math.hypot(d[0]-p[0],d[1]-p[1]);if(M<.12)continue;let _=1/0,S=-1/0,w=!0;for(let A=.15;A<.9&&w;A+=.35){const y=p[0]+(d[0]-p[0])*A,E=p[1]+(d[1]-p[1])*A;let R=(u.level+.35)*Gt;for(const P of v)(Zo(P.poly,y,E)<.008||Ks(P.poly,y,E))&&(R=Math.max(R,(P.level+.35)*Gt));R=Math.max(R,Tn(a,y,E)),_=Math.min(_,R),S=Math.max(S,R),w=S-_<.0012&&i(y,E,.01)&&o(y,E,.01)}if(!w)continue;const b=M-Math.hypot((p[0]+d[0])/2-e,(p[1]+d[1])/2-n)*.3;if(b>f){f=b;const A=(d[0]-p[0])/M,y=(d[1]-p[1])/M;h={ax:p[0]+A*.03,az:p[1]+y*.03,bx:d[0]-A*.03,bz:d[1]-y*.03,y:S}}}}return h}gateSpot(t){const e=t.wall,n=e.length,i=[0];for(let v=1;v<n;v++)i.push(i[v-1]+Math.hypot(e[v][0]-e[v-1][0],e[v][1]-e[v-1][1]));const o=t.gates[0]*(n-1),a=Math.min(n-2,Math.floor(o)),r=i[a]+(i[a+1]-i[a])*(o-a),l=v=>{let g=0;for(;g<n-2&&i[g+1]<v;)g++;const x=(v-i[g])/Math.max(1e-9,i[g+1]-i[g]);return[e[g][0]+(e[g+1][0]-e[g][0])*x,e[g][1]+(e[g+1][1]-e[g][1])*x]},c=r>.06?r-.036:r+.036,[h,f]=l(c),[u,m]=l(r);return{x:h,z:f,yaw:Math.atan2(u-h,m-f)}}figure(t,e,n,i,o){const a=this.frand,r=o.body||"rig",l={kind:t,body:r,x:e,z:n,yaw:i,base:i,tint:o.tint??.86+a()*.26,floor:o.floor??null,y:0,lx:0,lz:0,ly:0,rx:0,rz:0,ry:0,torso:-1,leg:-1,arm:-1,tool:-1,pack:-1,sit:-1,steps:r==="rig"?new Float32Array(Xe*((o.steps||12)+1)):null,n:0,k:0,m0:0,gait:wr,span:0,tx:e,tz:n,bend:new rs,crouch:new rs,shift:new rs,twist:new rs,reach:new rs,gest:new rs,state:"",until:a()*5,wake:0,idle:0,drawn:!1,ph:a()*100,side:a()<.7?qs:as,home:o.home??null,mates:null,spot:-1,prev:-1,face:i,sea:i,ax:e,az:n,bx:e,bz:n};return r==="rig"?(this.restFeet(l),l.y=(l.ly+l.ry)/2):l.y=this.footY(l,e,n),l}footY(t,e,n){return t.floor!==null?t.floor:Math.max(0,Tn(this.app.terrain,e,n))}restFeet(t){const e=Mr*at;t.lx=t.x+Math.cos(t.yaw)*e,t.lz=t.z-Math.sin(t.yaw)*e,t.rx=t.x-Math.cos(t.yaw)*e,t.rz=t.z+Math.sin(t.yaw)*e,t.ly=this.footY(t,t.lx,t.lz),t.ry=this.footY(t,t.rx,t.rz)}buildFolk(t){const e=this.frand,n=Cv(e);let i=0,o=0,a=0,r=0,l=0,c=0;for(const g of this.folk){if(g.body==="sit"){g.sit=r++;continue}g.torso=i++,g.arm=a,a+=2,g.body==="rig"&&(g.leg=o,o+=2),(g.kind==="poi"||g.kind==="kapa")&&(g.tool=l++),g.kind==="carry"&&(g.pack=c++)}const h=(g,x)=>{const p=new to(g,this.mat,Math.max(1,x));return p.count=x,p.visible=x>0,p.instanceColor=new $n(new Float32Array(Math.max(1,x)*3).fill(1),3),p.frustumCulled=!1,p.instanceMatrix.setUsage(vs),p.userData={lo:1/0,hi:-1,range:{start:0,count:0}},this.group.add(p),p},f=vr("stand",t);for(let g=0;g<3;g++)t();this.poseMeshes={stand:h(f,40),sit:h(vr("sit",t),r)},this.parts={torso:h(n.torso,i),thigh:h(n.thigh,o),shin:h(n.shin,o),arm:h(n.arm,a),tool:h(Rv(),l),pack:h(Pv(e),c)},this.partList=[...Object.values(this.parts),this.poseMeshes.sit],this._frame=0,this._pv=new te,this._fr=new Rs,this._sph=new zi(new W,.04),this._A=new W,this._B=new W,this._H=new W,this._X=new W,this._Y=new W,this._Z=new W,this._tL=new W,this._tU=new W,this._tF=new W,this._hand=new W,this._J=new W,this._K=new W,this._N=new W,this._Sh=new W,this._D=new W,this._Fw=new W;const u=new Dt("#5d5650"),m=new Dt("#5a3a22"),v=new de;for(const g of this.folk){const x=this._c.setRGB(g.tint,g.tint,g.tint);g.sit>=0&&this.poseMeshes.sit.setColorAt(g.sit,x),g.torso>=0&&this.parts.torso.setColorAt(g.torso,x);for(let p=0;p<2;p++)g.arm>=0&&this.parts.arm.setColorAt(g.arm+p,x),g.leg>=0&&(this.parts.thigh.setColorAt(g.leg+p,x),this.parts.shin.setColorAt(g.leg+p,x));g.tool>=0&&this.parts.tool.setColorAt(g.tool,g.kind==="poi"?u:m),g.body==="seat"&&(v.at(g.x,g.y,g.z,-g.yaw),Lv(v,n.cloth),g.kind==="poi"?kv(v,e):g.kind==="kapa"?Dv(v,e):zv(v,e),v.done()),this.start(g),this.pose(g,0),g.drawn=!1}for(const g of[this.poseMeshes.stand,...this.partList])g.userData.lo=1/0,g.userData.hi=-1,g.instanceMatrix.needsUpdate=!0;this.props=new ae(v.geometry(),this.mat),this.props.frustumCulled=!1,this.group.add(this.props)}start(t){const e=this.frand;t.kind==="loi"&&e()<.75?(t.state="work",t.bend.set(1+e()*.2),t.reach.set(1),t.crouch.set(.35+e()*.15),t.idle=Math.floor(e()*5)):t.kind==="crew"&&e()<.5?(t.state="work",t.bend.set(.55+e()*.25),t.reach.set(1),t.idle=Math.floor(e()*4)):t.kind==="carry"&&e()<.6?(t.state="rest",t.gest.set(1),t.idle=1+Math.floor(e()*3)):t.body==="seat"&&(t.state=e()<.7?"work":"rest",t.reach.set(t.state==="work"?1:0),t.ph=-e()*10,t.until=2+e()*15,t.wake=t.state==="work"?t.until:0),t.body==="rig"&&t.state!=="work"&&t.shift.set((e()-.5)*1.2)}think(t,e){if(t.n&&e-t.m0>=t.steps[t.n*Xe+10]&&this.settle(t),e<t.until)return;t.drawn=!1;const n=this.frand;switch(t.kind){case"loi":return this.thinkLoi(t,e,n);case"walk":return this.thinkWalk(t,e,n);case"talk":return this.thinkTalk(t,e,n);case"crew":return this.thinkCrew(t,e,n);case"keeper":return this.thinkKeeper(t,e,n);case"carry":return this.thinkCarry(t,e,n);case"poi":case"kapa":case"mend":return this.thinkSeat(t,e,n);case"sit":return this.thinkSit(t,e,n);default:return this.thinkStand(t,e,n)}}fidget(t,e,n,i=1){const o=t.shift.b,a=n();let r=e;a<.6?r=t.shift.to((o>.3?-1:o<-.3?1:n()<.5?-1:1)*(.45+n()*.55)*i,e,1.3+n()*.9):a<.8?r=t.shift.to(0,e,1.2+n()*.6):r=t.twist.to(Math.abs(t.twist.b)>.1?0:(n()-.5)*.7*i,e,1.4+n()),t.wake=r,t.until=r+2+n()*6}turnTo(t,e,n){const i=this.plan(t,e,t.x,t.z,n,br);return t.wake=i,i}thinkStand(t,e,n){const i=t.kind==="priest"?.5:t.kind==="watch"?.8:1,o=t.kind==="priest"?.6:t.kind==="watch"?.35:1.1;if(n()<(t.kind==="priest"?.3:.15)){t.until=this.turnTo(t,e,t.base+(n()-.5)*2*o)+2+n()*4;return}this.fidget(t,e,n,i),t.kind==="priest"&&(t.until+=4+n()*8)}thinkTalk(t,e,n){if(t.state==="gesture"){t.state="";const o=t.gest.to(0,e,.9);t.wake=o,t.until=o+1.5+n()*4;return}const i=n();if(i<.25)t.state="gesture",t.side=n()<.7?qs:as,t.wake=t.gest.to(.5+n()*.5,e,.8),t.until=t.wake+.8+n()*2;else if(i<.32){const o=Math.abs(Mi(t.yaw-t.base))<.2;t.until=this.turnTo(t,e,o?t.base+(n()<.5?-1:1)*(.4+n()*.4):t.base)+2+n()*5}else this.fidget(t,e,n)}thinkWalk(t,e,n){const i=t.home;if(t.state!=="stop"&&(t.state="stop",t.idle=1+Math.floor(n()*3)),t.idle>0){t.idle--,this.fidget(t,e,n);return}let o=-1;for(let a=0;a<6&&o<0;a++){const r=Math.floor(n()*i.n),l=Math.hypot(i.x[r]-t.x,i.z[r]-t.z);if(r===t.prev||i.busy[r]||l<.06||l>.34)continue;let c=!0;for(let h=0;h<i.walkers.length&&c;h++){const f=i.walkers[h];c=f===t||Sr(f.x,f.z,f.tx,f.tz,t.x,t.z,i.x[r],i.z[r])>=.012}c&&this.clearWalk(t.x,t.z,i.x[r],i.z[r])&&(o=r)}if(o<0){this.fidget(t,e,n);return}i.busy[t.spot]=0,i.busy[o]=1,t.prev=t.spot,t.spot=o,t.shift.to(0,e,.6),t.twist.to(0,e,.6),t.tx=i.x[o],t.tz=i.z[o],t.until=t.wake=this.plan(t,e,t.tx,t.tz,i.yaw[o]+(n()-.5)*.8,wr),t.state="go"}handsAt(t,e,n){t.idle--;const i=t.gest.b<.5;t.gest.to(i?1:0,e,.8),t.until=e+(i?3+n()*5:2+n()*6),t.wake=i?t.until:e+.8}thinkLoi(t,e,n){if(t.state==="work"&&t.idle>0)return this.handsAt(t,e,n);if(t.state==="work"){const o=t.bend.to(.04,e,1.8+n()*.6);t.reach.to(0,e,1.3),t.crouch.to(0,e,1.8),t.twist.to((n()-.5)*.8,o-.4,1.6),t.state="up",t.wake=o+1.3,t.until=o+2.5+n()*6;return}if(t.twist.to(0,e,.8),t.state==="up"&&n()<.45&&this.spotIn(t.home,t.mates,n,t)){t.tx=this.spot.x,t.tz=this.spot.z,t.until=t.wake=this.plan(t,e,t.tx,t.tz,n()*Math.PI*2,Sv),t.state="wade";return}const i=t.bend.to(1+n()*.2,e,1.8+n()*.6);t.reach.to(1,e+.5,1.4),t.crouch.to(.35+n()*.15,e,1.8),t.gest.to(0,e,.5),t.state="work",t.idle=2+Math.floor(n()*5),t.wake=i,t.until=i+.5+n()*3}thinkCrew(t,e,n){if(t.state==="work"&&t.idle>0)return this.handsAt(t,e,n);if(t.state==="work"){const a=t.bend.to(.04,e,1.5);t.reach.to(0,e,1.2),t.state="stand",t.idle=Math.floor(n()*2),t.wake=a,t.until=a+1+n()*3;return}if(t.idle>0){t.idle--,this.fidget(t,e,n);return}if(t.state==="look"){t.state="stand",t.until=this.turnTo(t,e,t.face)+1+n()*2;return}const i=n();if(i<.25&&this.crewStep(t,e,n))return;if(i<.4){t.state="look",t.until=this.turnTo(t,e,t.sea+(n()-.5)*.8)+3+n()*5;return}if(Math.abs(Mi(t.yaw-t.face))>.2){t.until=this.turnTo(t,e,t.face);return}t.shift.to(0,e,.8);const o=t.bend.to(.55+n()*.25,e,1.6);t.reach.to(1,e+.3,1.3),t.gest.to(0,e,.5),t.state="work",t.idle=2+Math.floor(n()*4),t.wake=o,t.until=o+.5+n()*2}crewStep(t,e,n){const i=t.home,o=t.x-i.x,a=t.z-i.z,r=o*i.cs+a*i.sn;for(let l=0;l<6;l++){const c=Math.max(-.055,Math.min(.055,r+(n()<.5?-1:1)*(.02+n()*.035)));if(Math.abs(c-r)<.015)continue;const h=i.x+c*i.cs-i.lz*i.sn,f=i.z+c*i.sn+i.lz*i.cs;let u=!0;for(let v=0;v<=1&&u;v+=.25)u=this.open(t.x+(h-t.x)*v,t.z+(f-t.z)*v,.008);if(!u)continue;let m=!0;for(let v=0;v<i.crew.length&&m;v++){const g=i.crew[v];m=g===t||Math.hypot(g.x-h,g.z-f)>=.022&&Math.hypot(g.tx-h,g.tz-f)>=.022&&Sr(g.x,g.z,g.tx,g.tz,t.x,t.z,h,f)>=.012}if(m)return t.tx=h,t.tz=f,t.state="stand",t.idle=1,t.until=t.wake=this.plan(t,e,h,f,t.face,wr),!0}return!1}thinkKeeper(t,e,n){if(t.state==="down"){const o=t.crouch.to(0,e,1.5);t.bend.to(.04,e,1.5),t.reach.to(0,e,1.1),t.state="up",t.idle=2+Math.floor(n()*3),t.wake=o,t.until=o+1;return}if(t.idle>0){t.idle--,this.fidget(t,e,n,.7);return}t.shift.to(0,e,.6);const i=t.crouch.to(1,e,1.6);t.bend.to(.45,e,1.6),t.reach.to(1,e+.6,1.2),t.state="down",t.wake=i+.6,t.until=i+4+n()*7}thinkCarry(t,e,n){if(t.state==="go"||t.state==="rest"&&t.idle===0){t.shift.to(0,e,.8),t.twist.to(0,e,.8);const r=t.crouch.to(.85,e,1.4);t.bend.to(.55,e,1.4),t.reach.to(1,e+.2,1.1),t.state==="go"&&t.gest.to(1,e+.3,1.1),t.state=t.state==="go"?"set":"lift",t.until=t.wake=r+.4;return}if(t.state==="set"||t.state==="lift"){const r=t.crouch.to(0,e,1.4);t.bend.to(.04,e,1.4),t.reach.to(0,e,1),t.state==="lift"&&t.gest.to(0,e,1.2),t.wake=r,t.state==="set"?(t.state="rest",t.idle=3+Math.floor(n()*3),t.until=r+1+n()*3):(t.state="up",t.until=r+.5);return}if(t.state==="rest"){t.idle--,this.fidget(t,e,n);return}const i=Math.hypot(t.x-t.ax,t.z-t.az)<Math.hypot(t.x-t.bx,t.z-t.bz),o=i?t.bx:t.ax,a=i?t.bz:t.az;t.until=t.wake=this.plan(t,e,o,a,null,Ev),t.state="go"}thinkSeat(t,e,n){t.state==="work"?(t.reach.to(0,e,1.2),t.state="rest",t.wake=e+1.3,t.until=e+4+n()*9):(t.reach.to(1,e,1),t.state="work",t.ph=e,t.until=e+12+n()*20,t.wake=t.until)}thinkSit(t,e,n){t.twist.to(Math.max(-.7,Math.min(.7,t.twist.b+(n()-.5)*.9)),e,2+n());const i=t.shift.to((n()-.5)*1.4,e,1.8+n());t.wake=Math.max(i,t.twist.t0+t.twist.d),t.until=e+10+n()*25}rec(t,e,n,i,o,a,r,l,c,h,f,u,m,v){const g=e*Xe;t[g]=n,t[g+1]=i,t[g+2]=o,t[g+3]=a,t[g+4]=r,t[g+5]=l,t[g+6]=c,t[g+7]=h,t[g+8]=f,t[g+9]=u,t[g+10]=m,t[g+11]=v}plan(t,e,n,i,o,a){const r=t.steps,l=r.length/Xe-1;this.rec(r,0,t.x,t.z,t.yaw,t.lx,t.lz,t.ly,t.rx,t.rz,t.ry,-1,0,0);let c=0;const h=n-t.x,f=i-t.z,u=Math.hypot(h,f);if(u>.003){const m=Math.atan2(h,f);Math.abs(Mi(m-t.yaw))>.3&&(c=this.turnSteps(t,c,m));const v=h/u,g=f/u,x=Math.max(1,Math.min(Math.round(u/(a.step*at)),l-c-8)),p=u/x,d=Mr*at,M=c*Xe;let _=(r[M+3]-t.x)*v+(r[M+4]-t.z)*g<=(r[M+6]-t.x)*v+(r[M+7]-t.z)*g;for(let S=1;S<=x+1;S++){const w=c*Xe,b=Math.min(S,x)*p,A=S<=x?(S-.5)*p:u,y=_?1:-1,E=t.x+v*b+g*d*y,R=t.z+g*b-v*d*y,P=this.footY(t,E,R);c++,this.rec(r,c,t.x+v*A,t.z+g*A,m,_?E:r[w+3],_?R:r[w+4],_?P:r[w+5],_?r[w+6]:E,_?r[w+7]:R,_?r[w+8]:P,_?as:qs,r[w+10]+a.tau,a.lift),_=!_}}return o!==null&&(c=this.turnSteps(t,c,o)),t.n=c,t.k=1,t.m0=e,t.gait=c?a:t.gait,t.span=u,t.drawn=!1,e+r[c*Xe+10]}turnSteps(t,e,n){const i=t.steps,o=i.length/Xe-1,a=e*Xe,r=i[a],l=i[a+1],c=i[a+2],h=Mi(n-c);if(Math.abs(h)<.05)return e;const f=Math.ceil(Math.abs(h)/.6),u=Mr*at;let m=h>0;for(let v=1;v<=f+1&&e<o;v++){const g=e*Xe,x=c+h*Math.min(v,f)/f,p=m?1:-1,d=r+Math.cos(x)*u*p,M=l-Math.sin(x)*u*p,_=this.footY(t,d,M);e++,this.rec(i,e,r,l,x,m?d:i[g+3],m?M:i[g+4],m?_:i[g+5],m?i[g+6]:d,m?i[g+7]:M,m?i[g+8]:_,m?as:qs,i[g+10]+br.tau,br.lift),m=!m}return e}settle(t){const e=t.steps,n=t.n*Xe;t.x=e[n],t.z=e[n+1],t.yaw=e[n+2],t.lx=e[n+3],t.lz=e[n+4],t.ly=e[n+5],t.rx=e[n+6],t.rz=e[n+7],t.ry=e[n+8],t.y=(t.ly+t.ry)/2,t.n=0,t.span=0}updateFolk(t){const e=this.app.camera,n=e.position;e.updateMatrixWorld(),this._pv.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._fr.setFromProjectionMatrix(this._pv);const i=++this._frame,o=this.folk;for(let a=0;a<this.folkSites.length;a++){const r=this.folkSites[a],l=r.x-n.x,c=r.y-n.y,h=r.z-n.z,f=12+r.r;if(!(l*l+c*c+h*h>f*f))for(let u=r.i0;u<r.i1;u++){const m=o[u];if(this.think(m,t),m.drawn)continue;const v=Math.abs(m.x-n.x)+Math.abs(m.y-n.y)+Math.abs(m.z-n.z);(i+u)%(v<1.5?1:v<4?2:v<8?3:5)||(this._sph.center.set(m.x,m.y+.015,m.z),this._sph.radius=.035+m.span,this._fr.intersectsSphere(this._sph)&&(this.pose(m,t),m.drawn=t>m.wake&&!m.n))}}for(let a=0;a<this.partList.length;a++)this.flush(this.partList[a])}pose(t,e){if(t.body==="rig")this.poseRig(t,e);else if(t.body==="seat")this.poseSeat(t,e);else{const n=this.poseMeshes.sit;this.setInstance(n,t.sit,t.x,t.y,t.z,t.yaw+t.twist.at(e),at,t.tint,0,t.shift.at(e)*.05),this.mark(n,t.sit)}}poseRig(t,e){t.n&&e-t.m0>=t.steps[t.n*Xe+10]&&this.settle(t);let n=t.x,i=t.z,o=t.yaw,a=t.lx,r=t.lz,l=t.ly,c=t.rx,h=t.rz,f=t.ry,u=0,m=0,v=0,g=0;if(t.n){const rt=t.steps,U=e-t.m0;for(;t.k<t.n&&U>=rt[t.k*Xe+10];)t.k++;const D=t.k*Xe,Z=D-Xe,ct=Math.max(0,Math.min(1,(U-rt[Z+10])/Math.max(.001,rt[D+10]-rt[Z+10]))),lt=ct*ct*(3-2*ct);n=rt[Z]+(rt[D]-rt[Z])*ct,i=rt[Z+1]+(rt[D+1]-rt[Z+1])*ct,o=rt[Z+2]+Mi(rt[D+2]-rt[Z+2])*ct,a=rt[Z+3]+(rt[D+3]-rt[Z+3])*lt,r=rt[Z+4]+(rt[D+4]-rt[Z+4])*lt,l=rt[Z+5]+(rt[D+5]-rt[Z+5])*lt,c=rt[Z+6]+(rt[D+6]-rt[Z+6])*lt,h=rt[Z+7]+(rt[D+7]-rt[Z+7])*lt,f=rt[Z+8]+(rt[D+8]-rt[Z+8])*lt;const dt=rt[D+11]*Math.sin(Math.PI*ct);rt[D+9]===as?u=dt:m=dt,v=.02*Math.sin(Math.PI*ct)*(rt[D+9]===as?-1:1),g=rt[D]!==rt[Z]||rt[D+1]!==rt[Z+1]?1:0}const x=t.bend.at(e),p=t.crouch.at(e),d=t.shift.at(e),M=t.twist.at(e),_=t.reach.at(e),S=Math.sin(o),w=Math.cos(o),b=(d*.045+v)*at,A=-(.1*Math.sin(x)+.12*p)*at,y=n+w*b+S*A,E=i-S*b+w*A,R=wv*at,P=y+w*R,N=E-S*R,T=y-w*R,C=E+S*R,I=l+($r+u)*at,H=f+($r+m)*at,z=(Yr+ga)*.998*at,O=Math.min((l+f)/2+(bv-.05*(1-Math.cos(x))-.36*p)*at,I+Math.sqrt(Math.max(0,z*z-(a-P)*(a-P)-(r-N)*(r-N))),H+Math.sqrt(Math.max(0,z*z-(c-T)*(c-T)-(h-C)*(h-C)))),k=.45*p;this.leg(t.leg,this._J.set(P,O,N),this._K.set(a,I,r),this._N.set(S+w*k,0,w-S*k)),this.leg(t.leg+1,this._J.set(T,O,C),this._K.set(c,H,h),this._N.set(S-w*k,0,w+S*k));const q=o+M;this.axes(q,x+.05*g,-d*.03),this._A.set(y,O,E),this.basis(this.parts.torso,t.torso,this._tL,this._tU,this._tF,this._A);const K=t.gait.swing*g,L=Math.max(-1,Math.min(1,((c-y)*S+(h-E)*w)/(.25*at)))*K,B=Math.max(-1,Math.min(1,((a-y)*S+(r-E)*w)/(.25*at)))*K;let G=.07,$=-1,Q=.04+L*.6,st=-.07,j=-1,X=.04+B*.6;if(_>0){let rt=.1,U=-.93,D=.36;t.kind==="loi"?(rt=.12,U=-.85,D=.52):t.kind==="crew"?(rt=.13,U=-.72,D=.68):t.kind==="keeper"&&(rt=.12,U=-.78,D=.6);const Z=t.kind==="keeper"||t.kind==="carry"?0:.13*Math.sin(e*1.7+t.ph)*t.gest.at(e);G+=(rt-G)*_,$+=(U-$)*_,Q+=(D+Z-Q)*_,st+=(-rt-st)*_,j+=(U-j)*_,X+=(D-Z-X)*_}if(t.kind==="talk"){const rt=t.gest.at(e);t.side===qs?(st+=(-.22-st)*rt,j+=(-.4-j)*rt,X+=(.88-X)*rt):(G+=(.22-G)*rt,$+=(-.4-$)*rt,Q+=(.88-Q)*rt)}else if(t.kind==="carry"){const rt=1-t.gest.at(e);st+=(-.04-st)*rt,j+=(.1-j)*rt,X+=(.99-X)*rt}const ot=this._tL,V=this._tU,xt=Eh*at,pt=_r*at,vt=V.x*pt,mt=V.y*pt,Nt=V.z*pt;if(this._Fw.set(Math.sin(q),0,Math.cos(q)),this.arm(t.arm,this._Sh.set(y+ot.x*xt+vt,O+ot.y*xt+mt,E+ot.z*xt+Nt),this._D.set(G,$,Q),this._Fw),this.arm(t.arm+1,this._Sh.set(y-ot.x*xt+vt,O-ot.y*xt+mt,E-ot.z*xt+Nt),this._D.set(st,j,X),this._Fw),t.pack>=0){const rt=.22*at,U=(_r+.05)*at;this._A.set(y-ot.x*rt+V.x*U,O-ot.y*rt+V.y*U,E-ot.z*rt+V.z*U);const D=t.gest.at(e);if(D>0){const Z=Math.sin(t.yaw+.2),ct=Math.cos(t.yaw+.2);this._A.lerp(this._B.set(t.x+Math.sin(t.yaw)*1.2*at,t.floor+.44*at,t.z+Math.cos(t.yaw)*1.2*at),D),this._X.set(ct,0,-Z).lerp(ot,1-D),this._Y.set(0,1,0).lerp(V,1-D),this._Z.set(Z,0,ct).lerp(this._tF,1-D),this.basis(this.parts.pack,t.pack,this._X,this._Y,this._Z,this._A)}else this.basis(this.parts.pack,t.pack,ot,V,this._tF,this._A)}}poseSeat(t,e){const n=t.reach.at(e),i=Math.sin(t.yaw),o=Math.cos(t.yaw),a=t.x,r=t.y+yr*at,l=t.z;let c=0,h;if(t.kind==="poi"){const P=((e-t.ph)/1.7%1+1)%1;c=(P<.55?bn(0,.55,P):P<.68?1-((P-.55)/.13)**2:0)*n,h=.14+.26*n-.14*c}else if(t.kind==="kapa"){const P=((e-t.ph)/1.05%1+1)%1;c=(P<.6?bn(0,.6,P):P<.72?1-((P-.6)/.12)**2:0)*n,h=.14+.22*n-.05*c}else h=.14+.34*n;this.axes(t.yaw,h,0),this._A.set(a,r,l),this.basis(this.parts.torso,t.torso,this._tL,this._tU,this._tF,this._A);const f=this._tL,u=this._tU,m=Eh*at,v=_r*at,g=a+f.x*m+u.x*v,x=r+f.y*m+u.y*v,p=l+f.z*m+u.z*v,d=a-f.x*m+u.x*v,M=r-f.y*m+u.y*v,_=l-f.z*m+u.z*v;let S=.25,w=-.06,b=.2,A=-.25,y=-.06,E=.2;if(t.kind==="poi"){const P=.17+.3*c;S+=(.045-S)*n,w+=(P-w)*n,b+=(.54-b)*n,A+=(-.045-A)*n,y+=(P-y)*n,E+=(.54-E)*n}else if(t.kind==="kapa")S+=(.17-S)*n,w+=(-.03-w)*n,b+=(.45-b)*n;else{const P=.04*Math.sin(e*1.5+t.ph)*n;S+=(.13-S)*n,w+=(-.15-w)*n,b+=(.46+P-b)*n,A+=(-.13-A)*n,y+=(-.15-y)*n,E+=(.46-P-E)*n}this._Fw.set(i,0,o);const R=this._hand.copy(this.armTo(t.arm,this._Sh.set(g,x,p),this._D.set(a+(o*S+i*b)*at,r+w*at,l+(-i*S+o*b)*at),this._Fw));if(t.kind==="kapa"){const P=a+(o*A+i*E)*at,N=r+y*at,T=l+(-i*A+o*E)*at;let C=a+(o*-.05+i*.46)*at-d,I=r-.03*at-M,H=l+(-i*-.05+o*.46)*at-_;const z=Math.sqrt(C*C+I*I+H*H),O=Math.min(ri*at,z-.2*at),k=o*.12+i*.98,q=-i*.12+o*.98,K=c*n;C=C/z*(1-K)+k*K,I=I/z*(1-K)+.08*K,H=H/z*(1-K)+q*K;const L=(O+(ri*at-O)*K)/Math.sqrt(C*C+I*I+H*H),B=d+C*L,G=M+I*L,$=_+H*L;this.armTo(t.arm+1,this._Sh.set(d,M,_),this._D.set(P+(B-P)*n,N+(G-N)*n,T+($-T)*n),this._Fw)}else this.armTo(t.arm+1,this._Sh.set(d,M,_),this._D.set(a+(o*A+i*E)*at,r+y*at,l+(-i*A+o*E)*at),this._Fw);if(t.kind==="poi"){R.add(this._B).multiplyScalar(.5);const P=1-n;R.x+=(a+(o*-.32+i*.5)*at-R.x)*P,R.y+=(r+(.09+.22-yr)*at-R.y)*P,R.z+=(l+(-i*-.32+o*.5)*at-R.z)*P,this._X.set(o,0,-i),this._Y.set(0,1,0),this._Z.set(i,0,o),this.basis(this.parts.tool,t.tool,this._X,this._Y,this._Z,R,1.5*at,.8*at,1.5*at)}else if(t.kind==="kapa"){const P=1-n;P>0&&(this._Y.lerp(this._A.set(-o,0,i),P).normalize(),this._Z.set(0,1,0).addScaledVector(this._Y,-this._Y.y).normalize(),this._X.crossVectors(this._Y,this._Z),this._B.x+=(a+(o*-.6+i*.48)*at-this._B.x)*P,this._B.y+=(r+(.195-yr)*at-this._B.y)*P,this._B.z+=(l+(-i*-.6+o*.48)*at-this._B.z)*P),this.basis(this.parts.tool,t.tool,this._X,this._Y,this._Z,this._B)}}armTo(t,e,n,i){const o=e.x,a=e.y,r=e.z,l=i.x,c=i.z,h=n.x-o,f=n.y-a,u=n.z-r,m=Math.sqrt(h*h+f*f+u*u)||1e-6,v=Math.max(.7*ri*at,Math.min(ri*at,m));return this._A.set(o,a,r),this._B.set(o+h/m*v,a+f/m*v,r+u/m*v),Math.abs(l*h+c*u)>.85*m?this._H.set(0,1,0):this._H.set(l,0,c),this.limb(this.parts.arm,t,this._A,this._B,this._H,v/ri),this._B}axes(t,e,n){const i=Math.sin(t),o=Math.cos(t),a=Math.sin(e),r=Math.cos(e),l=Math.sin(n),c=Math.cos(n),h=i*a,f=r,u=o*a;this._tU.set(h*c+o*l,f*c,u*c-i*l),this._tL.set(o*c-h*l,-f*l,-i*c-u*l),this._tF.set(i*r,-a,o*r)}leg(t,e,n,i){const o=Yr*at,a=ga*at,r=e.x,l=e.y,c=e.z,h=i.x,f=i.z;let u=n.x-r,m=n.y-l,v=n.z-c,g=Math.sqrt(u*u+m*m+v*v);const x=(o+a)*.9999;if(g>x){const R=x/g;u*=R,m*=R,v*=R,g=x}g=Math.max(g,1e-6);const p=u/g,d=m/g,M=v/g,_=(o*o-a*a+g*g)/(2*g),S=Math.sqrt(Math.max(0,o*o-_*_)),w=h*p+f*M;let b=h-w*p,A=-w*d,y=f-w*M;const E=Math.sqrt(b*b+A*A+y*y)||1;b/=E,A/=E,y/=E,this._A.set(r,l,c),this._B.set(r+p*_+b*S,l+d*_+A*S,c+M*_+y*S),this._H.set(h,0,f),this.limb(this.parts.thigh,t,this._A,this._B,this._H),this._A.set(r+u,l+m,c+v),this.limb(this.parts.shin,t,this._B,this._A,this._H)}arm(t,e,n,i){const o=e.x,a=e.y,r=e.z,l=i.x,c=i.z;let h=c*n.x+l*n.z,f=n.y,u=-l*n.x+c*n.z;const m=Math.sqrt(h*h+f*f+u*u)||1,v=ri*at/m;return h*=v,f*=v,u*=v,this._A.set(o,a,r),this._B.set(o+h,a+f,r+u),Math.abs(l*h+c*u)>.85*ri*at?this._H.set(0,1,0):this._H.set(l,0,c),this.limb(this.parts.arm,t,this._A,this._B,this._H),this._B}limb(t,e,n,i,o,a=at){const r=this._Y.subVectors(n,i).normalize(),l=this._Z.copy(o).addScaledVector(r,-o.dot(r));l.lengthSq()<1e-8&&(Math.abs(r.x)<.9?l.set(1,0,0).addScaledVector(r,-r.x):l.set(0,0,1).addScaledVector(r,-r.z)),l.normalize(),this.basis(t,e,this._X.crossVectors(r,l),r,l,n,at,a,at)}basis(t,e,n,i,o,a,r=at,l=at,c=at){const h=t.instanceMatrix.array,f=e*16;h[f]=n.x*r,h[f+1]=n.y*r,h[f+2]=n.z*r,h[f+3]=0,h[f+4]=i.x*l,h[f+5]=i.y*l,h[f+6]=i.z*l,h[f+7]=0,h[f+8]=o.x*c,h[f+9]=o.y*c,h[f+10]=o.z*c,h[f+11]=0,h[f+12]=a.x,h[f+13]=a.y,h[f+14]=a.z,h[f+15]=1,this.mark(t,e)}mark(t,e){const n=t.userData;e<n.lo&&(n.lo=e),e>n.hi&&(n.hi=e)}flush(t){const e=t.userData;if(e.hi<e.lo)return;const n=t.instanceMatrix,i=e.range,o=e.lo*16,a=(e.hi+1)*16;if(n.updateRanges.length){const r=i.start+i.count;i.start=Math.min(i.start,o),i.count=Math.max(r,a)-i.start}else i.start=o,i.count=a-o,n.updateRanges.push(i);n.needsUpdate=!0,e.lo=1/0,e.hi=-1}setInstance(t,e,n,i,o,a,r,l=1,c=0,h=0){this._p.set(n,i,o),this._e.set(c,a,h,"YXZ"),this._q.setFromEuler(this._e),this._s.setScalar(r),this._m.compose(this._p,this._q,this._s),t.setMatrixAt(e,this._m),(l!==1||t.instanceColor)&&t.setColorAt(e,this._c.setRGB(l,l,l))}walkTo(t,e){let n=0,i=1/0;for(let o=0;o<this.trail.length;o++){const a=Math.hypot(this.trail[o][0]-t,this.trail[o][1]-e);a<i&&(i=a,n=this.trailLen[o])}this.procS=n-.12}trailPoint(t){const e=this.trailLen[this.trailLen.length-1];t=(t%e+e)%e;let n=0,i=this.trailLen.length-1;for(;n<i-1;){const l=n+i>>1;this.trailLen[l]<=t?n=l:i=l}const o=this.trail[n%this.trail.length],a=this.trail[(n+1)%this.trail.length],r=(t-this.trailLen[n])/Math.max(1e-6,this.trailLen[n+1]-this.trailLen[n]);return[o[0]+(a[0]-o[0])*r,o[1]+(a[1]-o[1])*r,Math.atan2(a[0]-o[0],a[1]-o[1])]}watch(){const t=this.app.rig,e=t.flight,n=this.view,i=e?e.dest:t.goal;return n.x=i.target.x,n.z=i.target.z,n.dist=i.distance,n.remain=e?(1-e.t)*e.duration:0,n}update(t,e){const n=this.app,i=n.terrain,o=n.camera.position,a=this.watch(),r=n.rig.flight;for(const g of this.breaks){const x=Math.hypot(a.x-g.x[0],a.z-g.z[0])<1.6&&a.dist<5;x&&!g.watching&&(g.due=!0),x?g.due&&(!r||r.t>.3)&&(g.due=!1,this.hurrySet(g,a.remain)):g.due=!1,g.watching=x}const l=this.holua;if(l){l.time+=t;const g=Math.max(0,Math.min(l.len,(a.x-l.x[0])*l.dx+(a.z-l.z[0])*l.dz)),x=Math.hypot(a.x-l.x[0]-l.dx*g,a.z-l.z[0]-l.dz*g)<2&&a.dist<16;x&&!l.watching&&this.holuaFor(l,a),l.watching=x}const c=o.y-Math.max(0,i.heightAt(o.x,o.z))<30;if(this.group.visible=c,!c){l&&l.runner&&l.runner.state==="run"&&this.slide(l,l.runner,t);return}this.updateFolk(e);const h=n.season==="hooilo",f=this.poseMeshes.stand;let u=0;if(this.akua.visible=h,h){this.procS+=t*.0035*Math.max(1,Math.min(8,n.clock.speed/20));for(let g=0;g<11;g++){const[x,p,d]=this.trailPoint(this.procS-g*.035),M=Math.max(0,i.heightAt(x,p))+Math.abs(Math.sin(e*4.2+g))*.0012;this.setInstance(f,u++,x,M,p,d,at,g===5?2.2:1),g===5&&(this.akua.position.set(x,M,p),this.akua.rotation.y=d,this.akua.scale.setScalar(at))}}u=this.updateHolua(t,e,u),f.count=u,f.instanceMatrix.needsUpdate=!0,f.instanceColor&&(f.instanceColor.needsUpdate=!0),this.updateSurf(t,e);for(const g of this.boats)g.g.position.x=g.x+Math.sin(e*.05+g.drift)*.6,g.g.position.z=g.z+Math.cos(e*.04+g.drift)*.6,g.g.position.y=Math.sin(e*1.3+g.ph)*.0015,g.g.rotation.z=Math.sin(e*1.1+g.ph)*.04,g.g.rotation.y+=t*.02;this.voyagerS+=t*.004;const m=155,v=this.voyagerS;this.voyager.position.set(Math.cos(v)*m*.95+10,Math.sin(e*.9)*.002,Math.sin(v)*m*.7),this.voyager.rotation.y=-v-Math.PI/2,this.voyager.rotation.x=.06;for(let g=0;g<this.birdCentres.length;g++){const x=this.birdCentres[g],p=x.ph+e*x.sp,d=x.x+Math.cos(p)*x.r,M=x.z+Math.sin(p)*x.r,_=Math.max(0,i.heightAt(d,M))+x.h+Math.sin(e*.3+g)*.1;this.setInstance(this.birds,g,d,_,M,-p,at*1.4,1,.3)}this.birds.count=this.birdCentres.length,this.birds.instanceMatrix.needsUpdate=!0}hurrySet(t,e){t.eager=!0;let n=!1;for(const r of t.surfers)(r.state==="go"||r.state==="ride")&&(n=!0);if(n||!this.nextUp(t,!0))return;const i=this.app.ocean,o=i.swellTimeAt(t.x[0],t.z[0]),a=Go(o,this._sw);if(e>=1.2&&a.age>7&&a.next>e+9){const r=a.next-(e+8);i.swellT+=r,t.lastT+=r}else a.next<=Yo?this.catchLate(t,o,o+a.next):a.age<8&&this.catchLate(t,o,o-a.age)}catchLate(t,e,n){const i=e>n?this.breakS(t,Yn.speed*(e-n))+.14:0;for(let o=0;o<t.surfers.length;o++){const a=this.nextUp(t,!0);if(!a)break;if(a.tried=!0,this.goFor(a,t,n,i)){t.eager=!1;break}}for(const o of t.surfers)o.tried=!1}nextUp(t,e){let n=null;for(const o of t.surfers)o.state==="sit"&&!o.tried&&(!n||o.since<n.since)&&(n=o);if(n||!e)return n;let i=1/0;for(const o of t.surfers){if(o.state!=="back"||o.leg<1||o.tried)continue;const a=Math.hypot(o.x-t.lineX,o.z-t.lineZ);a<i&&(i=a,n=o)}return n}callWave(t,e,n,i){const o=this.rand;if(!t.eager&&!i&&o()>.25+.7*(n-.5)*2)return;let a=0;for(const l of t.surfers)l.state==="sit"&&a++;const r=this.nextUp(t,t.eager);if(!(!r||a<2&&!t.eager)&&this.goFor(r,t,e,0)&&(t.eager=!1,a>2&&o()<.35)){const l=Math.max(.16+o()*.1,r.take+.12),c=Math.min(t.n-1,Math.round(l/t.step));let h=null,f=1/0;for(const u of t.surfers){const m=Math.hypot(u.x-t.x[c],u.z-t.z[c]);u!==r&&u.state==="sit"&&m<f&&(f=m,h=u)}h&&this.goFor(h,t,e,l)}}goFor(t,e,n,i){const o=e.lastT-n;for(let a=Math.ceil(i/e.step-1e-6);a<e.n;a++){const r=a*e.step;if(r>e.len-.35)return!1;const l=r>.02?.14:.05,c=this.breakG(e,Math.max(0,r-l))/Yn.speed,h=e.x[a]+e.nx[a]*$o,f=e.z[a]+e.nz[a]*$o,u=Math.hypot(h-t.x,f-t.z)/(_v*t.pace);if(c-o<u)continue;const m=this.rand;return Object.assign(t,{state:"go",wave:n,take:r,s:r,lead:l,tTake:c,a0:c-u,sx:t.x,sz:t.z,fx:h,fz:f}),t.dur=10+m()*10,t.fall=m()<.35,t.goofy=m()<.5,!0}return!1}breakG(t,e){const n=Math.max(0,Math.min(t.n-1.001,e/t.step)),i=n|0;return t.g[i]+(t.g[i+1]-t.g[i])*(n-i)}paddleBack(t,e){const n=Math.min(e.n-1,Math.max(0,Math.round(t.s/e.step)));t.state="back",t.leg=0,t.wx=t.x+e.nx[n]*.2,t.wz=t.z+e.nz[n]*.2}updateSurf(t,e){const n=this.app.ocean,i=this._sw,o=this.counts;o.board=o.ride=o.sit=o.prone=o.arm=0;for(const a of this.breaks){const r=n.swellTimeAt(a.x[0],a.z[0]),l=Math.abs(r-a.lastT-t)>1;if(a.lastT=r,Go(r+Yo,i),i.age<=Yo&&i.id!==a.called){a.called=i.id;const c=r+Yo-i.age,h=i.height,f=Go(c+.01,i).next>30;l||this.callWave(a,c,h,f)}for(const c of a.surfers)l&&(c.state==="go"||c.state==="ride")&&this.paddleBack(c,a),this.stepSurfer(c,a,r,t,e);this.separate(a,t);for(const c of a.surfers)this.drawSurfer(c,e)}for(const a in this.surfPose){const r=this.surfPose[a];r.count=o[a],r.visible=o[a]>0,r.instanceMatrix.needsUpdate=!0}this.boards.count=o.board,this.boards.visible=o.board>0,this.boards.instanceMatrix.needsUpdate=!0,this.boards.instanceColor.needsUpdate=!0,this.arms.count=o.arm,this.arms.visible=o.arm>0,this.arms.instanceMatrix.needsUpdate=!0}separate(t,e){const n=t.surfers,i=this._sep;for(let o=0;o<n.length;o++)for(let a=o+1;a<n.length;a++){const r=n[o],l=n[a],c=r.state==="ride"||r.state==="go",h=l.state==="ride"||l.state==="go";if(c&&h)continue;const f=wh*r.scale,u=wh*l.scale,m=Math.sin(r.head)*f,v=Math.cos(r.head)*f,g=Math.sin(l.head)*u,x=Math.cos(l.head)*u;if(Hv(r.x-m,r.z-v,r.x+m,r.z+v,l.x-g,l.z-x,l.x+g,l.z+x,i),i.d>=bh)continue;let p=i.x,d=i.z,M=i.d;M<1e-4&&(p=r.x-l.x,d=r.z-l.z,M=Math.hypot(p,d),M<1e-6&&(p=t.tx[0],d=t.tz[0],M=1));const _=Math.min(bh-i.d,.04*e)/M,S=c?0:h?1:.5;r.x+=p*_*S,r.z+=d*_*S,l.x-=p*_*(1-S),l.z-=d*_*(1-S)}}stepSurfer(t,e,n,i,o){const a=n-t.wave;let r="sit",l=t.head,c=2.5,h=0,f=0,u=0;if(t.tilt=!0,t.state==="go"&&a>=t.tTake&&(t.state="ride",t.s=t.take),t.state==="sit")t.x+=(t.slotX+Math.sin(o*.05+t.ph)*.012-t.x)*Math.min(1,i*.3),t.z+=(t.slotZ+Math.cos(o*.04+t.ph)*.012-t.z)*Math.min(1,i*.3),l=e.seaHead+t.look+Math.sin(o*.05+t.ph)*.15,c=.5,h=-.12;else if(t.state==="go"){const m=Math.min(e.n-1,Math.round(t.take/e.step)),v=Math.atan2(t.fx-t.sx,t.fz-t.sz);if(a<t.a0)l=v,c=1.2,h=-.12;else{const g=Math.min(1,(a-t.a0)/Math.max(.001,t.tTake-t.a0)),x=(g<.2?g*g/.4:g-.1)/.9;t.x=t.sx+(t.fx-t.sx)*x,t.z=t.sz+(t.fz-t.sz)*x;const p=Math.atan2(e.tx[m]*.55-e.nx[m]*.85,e.tz[m]*.55-e.nz[m]*.85);l=v+Mi(p-v)*bn(.6,1,g),c=2.2,r="prone",u=1.4,h=-.04,t.tilt=g<.6}}else if(t.state==="ride"){t.tilt=!1;const m=a-t.tTake,v=this.breakS(e,Yn.speed*a);let g=e.len;for(const P of e.surfers)P!==t&&(P.state==="ride"||P.state==="out"||P.state==="fall")&&P.wave===t.wave&&P.s>t.s&&(g=Math.min(g,P.s-.08));t.s=Math.max(t.s,Math.min(v+t.lead*bn(0,1.5,m),t.s+.13*i,g));const x=Math.min(e.n-1.001,t.s/e.step),p=x|0,d=x-p,M=e.x[p]+(e.x[p+1]-e.x[p])*d,_=e.z[p]+(e.z[p+1]-e.z[p])*d,S=e.nx[p],w=e.nz[p],b=bn(1,3,m),A=$o+(-.03-$o)*bn(0,1.2,m)+.012*Math.sin(m*1.6+t.ph)*b;t.x=M+S*A,t.z=_+w*A;const y=.9*Math.exp(-m*1.4)+.12-.3*Math.cos(m*1.6+t.ph)*b,E=Math.cos(y),R=Math.sin(y);l=Math.atan2(e.tx[p]*E-S*R,e.tz[p]*E-w*R),c=5,r="ride",h=.06*Math.exp(-m),f=.12*Math.sin(y),(m>=t.dur||t.s>=e.len-.01||v>t.s+.08)&&(t.state=t.fall||v>t.s+.08?"fall":"out",t.t=0)}else if(t.state==="out"||t.state==="fall"){t.t+=i;const m=Math.min(e.n-1,Math.round(t.s/e.step));t.state==="out"?(t.x+=e.nx[m]*i*.01,t.z+=e.nz[m]*i*.01,l=e.seaHead,c=1.8,r=t.t<.6?"ride":"sit",h=-.12,t.tilt=t.t>.6):(t.x-=e.nx[m]*i*.02,t.z-=e.nz[m]*i*.02,r=t.t<1.8?null:"prone",f=Math.PI*bn(0,.5,t.t)*(1-bn(1.2,1.8,t.t)),h=.4*Math.sin(Math.min(t.t,1.8)*3.5),c=0,t.tilt=!1),t.t>2.6&&this.paddleBack(t,e)}else if(t.state==="back"){const m=t.leg===0?t.wx:t.slotX+(t.leg===1?e.nx[0]*.12:0),v=t.leg===0?t.wz:t.slotZ+(t.leg===1?e.nz[0]*.12:0),g=m-t.x,x=v-t.z,p=Math.hypot(g,x),d=.017*t.pace*(t.leg===2?.6:1);p<d*i+.003?t.leg===2?(t.state="sit",t.since=o):t.leg++:(t.x+=g/p*d*i,t.z+=x/p*d*i,l=Math.atan2(g,x)),c=1.5,r="prone",u=t.leg===2?.6:.85,h=-.04}t.head+=Mi(l-t.head)*Math.min(1,i*c),t.pose=r,t.pitch=h,t.roll=f,t.stroke=u}drawSurfer(t,e){const n=.0012+Math.sin(e*1.7+t.ph)*4e-4;let i=t.pitch,o=t.roll;if(t.pose!=="ride"&&(i+=Math.sin(e*1.1+t.ph)*.03,o+=Math.sin(e*.9+t.ph*1.3)*.04),t.tilt){const c=this.app.ocean,h=Go(c.swellTimeAt(t.x,t.z),this._sw),f=c.swellDir,u=(Sh(h.age)*h.height+Sh(-h.next))*(.014/Yn.speed);i+=u*(f[0]*Math.sin(t.head)+f[1]*Math.cos(t.head))}const a=this.counts,r=at*t.scale;this.setInstance(this.boards,a.board++,t.x,n,t.z,t.head,r,t.tint,i,o);const l=t.pose;if(l&&(this.setInstance(this.surfPose[l],a[l]++,t.x,n,t.z,t.head+(l==="ride"&&t.goofy?Math.PI:0),r,1,i,o),l==="prone")){this._mb.copy(this._m);for(let c=1;c>=-1;c-=2){const h=(e*t.stroke+t.ph+(c>0?0:.5))%1,f=(h-.55)/.45,u=h<.55?1.3-1.6*h/.55:-.3+1.6*f,m=h<.55?0:Math.sin(Math.PI*f)*1.1;this._ml.makeRotationZ(c*m),this._ma.makeRotationX(-u),this._ml.multiply(this._ma).setPosition(.25*c,.2,.45),this._ma.multiplyMatrices(this._mb,this._ml),this.arms.setMatrixAt(a.arm++,this._ma)}}}trackY(t,e){const n=Math.max(0,Math.min(t.n-1.001,e/t.ds)),i=n|0;return t.y[i]+(t.y[i+1]-t.y[i])*(n-i)}sledOnTrack(t,e,n){const i=this.trackY(t,e+dn),o=this.trackY(t,e-dn);return n.y=Math.max((i+o)/2,this.trackY(t,e)),n.pitch=Math.atan2(o-i,dn*2),n}slide(t,e,n){const i=t.len-dn-.005,o=Math.ceil(n/.02),a=n/o;for(let r=0;r<o;r++){const l=(this.trackY(t,e.s+.02)-this.trackY(t,e.s-.02))/.04*(Xs/Gt),c=Math.atan(-l);let h=9.8*Math.sin(c)-.11*9.8*Math.cos(c)-.003*e.v*e.v;const f=(i-e.s)/Xs,u=e.v*e.v/(2*Math.max(f,.5));u>2.5&&(h=Math.min(h,-u)),e.v=Math.max(e.v+h*a,f>1?1.5:0),e.s=Math.min(i,e.s+e.v*Math.cos(c)*a*Xs)}return e.s>=i-1e-4||e.v<=0}holuaFor(t,e){const n=this.app.camera.position,i=Math.hypot(n.x-(t.x[0]+t.x[t.n-1])/2,n.z-(t.z[0]+t.z[t.n-1])/2)>7;let o=null;for(const f of t.riders)f.state==="wait"&&(!o||f.since<o.since)&&(o=f);if(!o)for(const f of t.riders)(f.state==="home"||f.state==="walk"&&f.s<t.len-3)&&(!o||f.s<o.s)&&(o=f);let a=t.runner;if(!i||e.remain<1.5){a||(t.next=Math.min(t.next,t.time));return}const r=Math.round((t.len-1.3)/t.ds);if(a&&a.state==="run"&&a.s>=r*t.ds&&t.tAt[t.n-1]-t.tAt[Math.min(t.n-1,Math.round(a.s/t.ds))]>e.remain+1.5)return;if(!a||a.state==="rest"||a.state==="run"&&a.s>=r*t.ds){if(!o)return;a&&(a.state="rise"),a=o}for(const f of t.riders)(f.state==="rise"||f.state==="walk"&&f.s>t.len-.3)&&(f.state="walk",f.s=Math.min(f.s,t.len-.3),f.t=0);const l=t.tAt[r]-(e.remain+5);let c=0;for(;c<r&&t.tAt[c]<l;)c++;const h=Math.max(dn,c*t.ds);(a.state!=="run"||a.s<h)&&(a.s=h,a.v=t.vAt[c]),a.state="run",a.t=0,t.runner=a}updateHolua(t,e,n){const i=this.holua;if(!i)return n;const o=this.rand;if(!i.runner&&i.time>=i.next){let r=null;for(const l of i.riders)l.state==="wait"&&(!r||l.since<r.since)&&(r=l);r&&(r.state="walkin",r.t=0,i.runner=r)}this._ns=0;for(const r of i.riders)n=this.stepRider(r,i,t,e,n,o);const a=i.runner?i.runner.state:null;return this.sledders.count=a==="set"||a==="run"||a==="rest"?1:0,this.sledders.visible=this.sledders.count>0,this.sleds.count=this._ns,this.sleds.visible=this._ns>0,this.sleds.instanceMatrix.needsUpdate=!0,this.sledders.instanceMatrix.needsUpdate=!0,n}standY(t,e,n,i,o){const a=Tn(this.app.terrain,i,o);return e<0||e>t.len?a:a+(Math.max(a,this.trackY(t,e))-a)*bn(.056,.032,Math.abs(n))}stepRider(t,e,n,i,o,a){const r=this.app.terrain,l=this.poseMeshes.stand,c=this._pose,h=-e.dz,f=e.dx;t.t+=n;const u=dn;t.state==="rest"&&t.t>2&&(t.state="rise",t.t=0,e.runner=null,e.next=e.time+25+a()*55);let m=0,v=0,g=0,x=!0;if(t.state==="wait"){m=t.spotS,v=t.spotOff,g=e.head+Math.sin(i*.1+t.ph)*.5,x=!1;const _=e.x[0]+e.dx*(m-.012)+h*v,S=e.z[0]+e.dz*(m-.012)+f*v,w=Tn(r,_+h*dn,S+f*dn),b=Tn(r,_-h*dn,S-f*dn);this.setInstance(this.sleds,this._ns++,_,(w+b)/2,S,Math.atan2(h,f),at,1,Math.atan2(b-w,dn*2))}else if(t.state==="walkin"){const _=u*.5,S=.065*t.side,w=_-t.spotS,b=Math.abs(t.spotOff-S),A=t.t*.022*t.pace,y=(w+b)/(.022*t.pace);A<w?(m=t.spotS+A,v=t.spotOff,g=e.head):A<w+b?(m=_,v=t.spotOff+(S-t.spotOff)*((A-w)/b),g=Math.atan2(h*(S-t.spotOff),f*(S-t.spotOff))):(m=_,v=S+(.016*t.side-S)*bn(y,y+1.6,t.t),g=e.head),t.t>y+1.6&&(t.state="set",t.t=0,t.s=u,t.v=0)}else{if(t.state==="set"||t.state==="run"||t.state==="rest")return t.state==="set"&&t.t>1.6&&(t.state="run",t.v=1.5),t.state==="run"&&this.slide(e,t,n)&&(t.state="rest",t.t=0),this.sledOnTrack(e,t.s,c),this.setInstance(this.sledders,0,e.x[0]+e.dx*t.s,c.y,e.z[0]+e.dz*t.s,e.head,at,1,c.pitch),o;if(t.state==="rise")this.sledOnTrack(e,t.s,c),this.setInstance(this.sleds,this._ns++,e.x[0]+e.dx*t.s,c.y,e.z[0]+e.dz*t.s,e.head,at,1,c.pitch),m=t.s,v=.016*t.side,g=e.head+Math.PI+t.side*1.2,x=!1,t.t>3&&(t.state="walk",t.t=0);else if(t.state==="walk"){const _=(this.trackY(e,t.s-.02)-this.trackY(e,t.s+.02))/.04;let S=-1;for(const w of e.riders)w!==t&&(w.state==="walk"||w.state==="home"&&w.t<2)&&w.side===t.side&&w.s<t.s&&w.s>S&&(S=w.s);t.s=Math.max(0,S+.03,t.s-.022*t.pace*n/(1+1.2*Math.abs(_))),m=t.s,v=(.016+.074*bn(0,.15,e.len-t.s))*t.side,g=e.head+Math.PI,t.s<=0&&(t.state="home",t.t=0)}else{const _=.09*t.side,S=Math.abs(t.wayOff-_),w=-t.spotS,b=Math.abs(t.wayOff-t.spotOff),A=t.t*.02*t.pace;let y=0,E=0;A<S?(v=_+(t.wayOff-_)*(A/S),E=t.wayOff-_):A<S+w?(m=S-A,v=t.wayOff,y=-1):(m=t.spotS,v=t.wayOff+(t.spotOff-t.wayOff)*Math.min(1,(A-S-w)/b),E=t.spotOff-t.wayOff),g=Math.atan2(e.dx*y+h*E,e.dz*y+f*E),A>=S+w+b&&(t.state="wait",t.since=i)}}const p=e.x[0]+e.dx*m+h*v,d=e.z[0]+e.dz*m+f*v,M=this.standY(e,m,v,p,d);return x?this.carry(l,o,p,M,d,g,i,t):(this.setInstance(l,o++,p,M,d,g,at),o)}carry(t,e,n,i,o,a,r,l){return i+=Math.abs(Math.sin(r*4.5+l.ph))*6e-4,this.setInstance(t,e++,n,i,o,a,at),this._mb.copy(this._m),this._ml.makeRotationX(-.3).setPosition(.3,1.36,-.2),this._ma.multiplyMatrices(this._mb,this._ml),this.sleds.setMatrixAt(this._ns++,this._ma),e}}const Ze=qt/mn,ie=qt/le,hl=Ze*.5,qv=.12,Du=1.6,ue=(s,t,e)=>s<t?t:s>e?e:s,pn=(s,t,e)=>{const n=ue((e-s)/(t-s),0,1);return n*n*(3-2*n)},Xv=s=>s-Math.PI*2*Math.round(s/(Math.PI*2)),Je=s=>{const t=Math.sin(s*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Th(s,t,e,n){let i=(e+ut)/qt*t-.5,o=(n+ut)/qt*t-.5;i<0&&(i=0),o<0&&(o=0),i>t-1.001&&(i=t-1.001),o>t-1.001&&(o=t-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=r*t+a,f=s[h]+(s[h+1]-s[h])*l,u=s[h+t]+(s[h+t+1]-s[h+t])*l;return f+(u-f)*c}const aa=(s,t)=>{const e=ue(Math.floor((s+ut)/ie),0,le-1);return ue(Math.floor((t+ut)/ie),0,le-1)*le+e};function _s(s,t,e,n,i,o){const a=i-e,r=o-n,l=a*a+r*r||1e-9,c=ue(((s-e)*a+(t-n)*r)/l,0,1);return Math.hypot(e+a*c-s,n+r*c-t)}function jv(s,t,e){let n=1/0;for(let i=1;i<e.length;i++)n=Math.min(n,_s(s,t,e[i-1][0],e[i-1][1],e[i][0],e[i][1]));return n}function zu(s,t){const e=t*t/19.62;return s<=e?Math.sqrt(Math.max(0,s)/4.905):t/9.81+(s-e)/t}function Rn(s,t,e=[0,0]){const{pts:n,along:i}=s,o=n.length;if(t<=0)return e[0]=n[0][0],e[1]=n[0][1],0;let a=0,r=o-1;if(t>=i[r])return e[0]=n[r][0],e[1]=n[r][1],r-1;for(;r-a>1;){const c=a+r>>1;i[c]<=t?a=c:r=c}const l=(t-i[a])/(i[r]-i[a]||1);return e[0]=n[a][0]+(n[r][0]-n[a][0])*l,e[1]=n[a][1]+(n[r][1]-n[a][1])*l,a}const Jo=.1;function Ah(s,t,e){const n=[],i=[0,0];for(let o=0;o<s.length;o++){const a=s[o],r=a.along[a.along.length-1],l=Math.floor(r/Jo)+1;if(l<8)continue;const c=new Float64Array(l),h=new Float64Array(l),f=new Float64Array(l),u=new Int32Array(l);for(let x=0;x<l;x++)u[x]=Rn(a,x*Jo,i),c[x]=i[0],h[x]=i[1],f[x]=t(i[0],i[1]);const m=l-4,v=new Float64Array(l);for(let x=0;x<m;x++)v[x]=(f[x]-f[x+4])/40;let g=0;for(;g<m;){if(!(v[g]>.8)||f[g]<2){g++;continue}const x=g;let p=g;for(;p<m&&v[p]>.8;)p++;let d=p-1;const M=[];for(;;){let E=d+1;for(;E<m&&v[E]<=.8&&E-(d+1)<=5;)E++;if(E<m&&v[E]>.8&&E-(d+1)<=5){for(M.push(d+1);E<m&&v[E]>.8;)E++;d=E-1}else break}g=d+1;let _=x,S=-1/0;for(let E=Math.max(1,x-2);E<=x;E++){const R=v[E+1]-v[E-1];R>S&&(S=R,_=E)}let w=Math.min(l-1,d+4);for(let E=d;E<=Math.min(l-3,d+4);E++)if(v[E]<.3&&v[E+1]<.3&&v[E+2]<.3){w=E;break}const b=f[_]-f[w];if(b<60)continue;let A=!1;for(let E=_;E<=w&&!A;E++)e(c[E],h[E])&&(A=!0);if(A)continue;const y=a.area[u[_]];n.push({laid:o,sLip:_*Jo,sBase:w*Jo,lip:[c[_],f[_],h[_]],base:[c[w],f[w],h[w]],drop:b,A:y,per:ue((Math.log10(y)-.35)/.9,0,1),ledges:M.filter(E=>E>_&&E<w).map(E=>f[_]-f[E]).filter(E=>E>8&&E<b-8),samples:{xs:c,zs:h,hs:f,i0:_,i1:w}})}}return n}function Yv(s,t={}){const e=t.carve!==!1,n=performance.now(),{data:i,meta:o}=s,a=i.height,r=(k,q)=>Th(a,mn,k,q),l=(k,q)=>Th(i.height1024,le,k,q),c=Ea(o,i),h=performance.now(),f=new Uint8Array(le*le);let u=!1;const m=[];for(const k of o.sites.loi)for(const q of k.paddies){const[K,L]=q.c;if(m.push([K,L]),q.level<l(K,L)-25){u=!0;const B=.3;for(let G=Math.floor((L-B+ut)/ie);G<=Math.floor((L+B+ut)/ie);G++)for(let $=Math.floor((K-B+ut)/ie);$<=Math.floor((K+B+ut)/ie);$++)$<0||G<0||$>=le||G>=le||Math.hypot(-ut+($+.5)*ie-K,-ut+(G+.5)*ie-L)<=B&&(f[G*le+$]=1)}}const v=(k,q)=>f[aa(k,q)]?l(k,q):r(k,q),g=[...o.sites.houses.map(k=>[k.x,k.z]),...o.sites.villages.map(k=>[k.x,k.z]),...o.sites.heiau.map(k=>[k.x,k.z]),...m],x=(k,q)=>f[aa(k,q)]===1;let p=Ah(c,v,x);const d=performance.now(),M=o.ahupuaa.find(k=>k.id===o.sites.model),_=(M==null?void 0:M.trunk)||[],S=_.map(k=>[k[0],k[1]]),w=[];for(const k of p){const K=S.length>1&&jv(k.lip[0],k.lip[2],S)<1.5&&k.A>=2&&k.drop>=100;if(!K&&!(k.A>=3&&k.drop>=120))continue;const{xs:L,zs:B,hs:G,i0:$,i1:Q}=k.samples;let st=-1;for(let gt=Q;gt>$;gt--){let Ct=!0;for(let zt=$+1;zt<gt&&Ct;zt++)_s(L[zt],B[zt],L[$],B[$],L[gt],B[gt])>.35&&(Ct=!1);if(Ct){st=gt;break}}if(st<0)continue;const j=[L[$],B[$]],X=[L[st],B[st]],ot=Math.hypot(X[0]-j[0],X[1]-j[1]),V=G[$]-G[st];if(V<100||ot<.6)continue;const xt=(X[0]-j[0])/ot,pt=(X[1]-j[1])/ot,vt=Ch(V,k.A,k.per),mt=[j[0]+xt*vt.sLand,j[1]+pt*vt.sLand],Nt=vt.wBase;let rt=!1;const U=Nt+.5,D=Math.floor((Math.min(j[0],X[0])-U+ut)/ie),Z=Math.floor((Math.max(j[0],X[0])+U+ut)/ie),ct=Math.floor((Math.min(j[1],X[1])-U+ut)/ie),lt=Math.floor((Math.max(j[1],X[1])+U+ut)/ie);for(let gt=Math.max(0,ct);gt<=Math.min(le-1,lt)&&!rt;gt++)for(let Ct=Math.max(0,D);Ct<=Math.min(le-1,Z)&&!rt;Ct++){if(!f[gt*le+Ct])continue;const zt=-ut+(Ct+.5)*ie,ht=-ut+(gt+.5)*ie;(_s(zt,ht,j[0],j[1],X[0],X[1])<=Nt||Math.hypot(zt-mt[0],ht-mt[1])<=vt.poolR+.5)&&(rt=!0)}if(rt||g.some(gt=>_s(gt[0],gt[1],j[0],j[1],X[0],X[1])<=Nt+.3))continue;const dt=G[st],At=G[$],yt=Math.pow(V,.7)*Math.sqrt(k.A)*(dt<650?1.5:.6)*(At<700?1.3:1)*(K?3:1);w.push({f:k,L:j,B:X,len:ot,D:V,b:st,isModel:K,score:yt,ux:xt,uz:pt})}w.sort((k,q)=>q.score-k.score);const b=[];for(const k of w){if(b.length>=4)break;b.some(q=>Math.hypot(q.L[0]-k.L[0],q.L[1]-k.L[1])<8)||b.push(k)}let A=b.findIndex(k=>k.isModel);if(A<0&&b.length){let k=_[0];for(const L of _)Math.abs(L[2]-260)<Math.abs(k[2]-260)&&(k=L);const q=k?k[0]:0,K=k?k[1]:0;A=0;for(let L=1;L<b.length;L++)Math.hypot(b[L].L[0]-q,b[L].L[1]-K)<Math.hypot(b[A].L[0]-q,b[A].L[1]-K)&&(A=L)}A>0&&b.unshift(b.splice(A,1)[0]);const y=[],E=[];for(const k of b){const q=k.f,K=c[q.laid],L=k.f.samples.hs[k.f.samples.i0],B=k.f.samples.hs[k.b],G=Ch(k.D,q.A,q.per);e&&y.push($v(a,i.normals,k.L,k.B,L,B,G,g));const $=r(k.L[0],k.L[1]),Q=r(k.B[0],k.B[1]),st=k.L[0]+k.ux*G.sLand,j=k.L[1]+k.uz*G.sLand;let X=1/0;for(let vt=0;vt<16;vt++){const mt=vt/16*Math.PI*2;X=Math.min(X,r(st+Math.cos(mt)*G.poolR,j+Math.sin(mt)*G.poolR))}const ot=r(st,j),V=Math.max(X-.5,ot+1);let xt=q.sLip,pt=1/0;for(let vt=0;vt<K.pts.length;vt++){const mt=Math.hypot(K.pts[vt][0]-st,K.pts[vt][1]-j);mt<pt&&K.along[vt]>=q.sLip&&(pt=mt,xt=K.along[vt])}E.push({kind:0,laid:q.laid,src:K.src,sLip:q.sLip,sBase:q.sLip+k.len,sPool:xt,lip:[k.L[0],$,k.L[1]],base:[k.B[0],Q,k.B[1]],drop:$-V,A:q.A,per:q.per,ledges:[],model:k.isModel,face:[k.ux,k.uz],pool:[st,V,j],poolR:G.poolR,carve:{faceRun:G.faceRun,faceFrac:G.faceFrac,wFace:G.wFace,wBase:G.wBase,sLand:G.sLand,yF:B+(1-G.faceFrac)*(L-B)}})}const R=performance.now();y.length&&(p=Ah(c,v,x));const P=[];for(const k of p)E.some(q=>q.laid===k.laid&&k.sBase>=q.sLip-.1&&k.sLip<=q.sPool||Math.hypot(q.lip[0]-k.lip[0],q.lip[2]-k.lip[2])<.4)||(delete k.samples,k.kind=1,k.src=c[k.laid].src,P.push(k));P.sort((k,q)=>q.drop-k.drop);const N=[...E,...P].slice(0,ra);for(const k of N)k.rain=i.rain[aa(k.lip[0],k.lip[2])],k.ribbonA=c[k.laid].lineA;const T=performance.now(),C=Kv(c,N,i,r),I=performance.now(),H=new Map,z=(k,q,K,L,B,G)=>{H.has(k)||H.set(k,[]),H.get(k).push({h0:q,h1:K,r0:L,r1:B,level:G})};for(const k of N){let q=k.kind===0?k.sPool:k.sBase;if(k.kind===0&&e){const{pts:$,along:Q}=c[k.laid];for(let st=0;st<$.length;st++){if(Q[st]<=q||Q[st]>k.sPool+1.2)continue;const j=$[st][0]-k.lip[0],X=$[st][1]-k.lip[2],ot=j*k.face[0]+X*k.face[1];if(r($[st][0],$[st][1])-r(k.lip[0]+k.face[0]*ot,k.lip[2]+k.face[1]*ot)>4)q=Q[Math.min($.length-1,st+1)];else break}}const K=Math.max(0,k.sLip-(k.kind===0?.06:.03)),L=k.kind===0?k.sLip:Math.min(k.sLip+.12,(k.sLip+k.sBase)/2),B=k.kind===0?q:Math.max(L,q-.15),G=k.kind===0?.05:q-B;z(k.laid,L,B,L-K,G,k.kind===0?k.pool[1]:void 0),k.hand={a:K,b:L,c:k.kind===0?1/0:B,d:k.kind===0?1/0:B+G}}if(e)for(const k of E){const[q,K]=k.face,L=Math.hypot(k.base[0]-k.lip[0],k.base[2]-k.lip[2]),B=(G,$)=>{const Q=G-k.lip[0],st=$-k.lip[2],j=Q*q+st*K,X=-Q*K+st*q;return j>-.05&&j<L&&Math.abs(X)<.8*(k.carve.wFace+(1.4-k.carve.wFace)*Math.max(0,j)/L)};for(let G=0;G<c.length;G++){if(G===k.laid)continue;const{pts:$,along:Q}=c[G];let st=-1;for(let j=0;j<=$.length;j++){const X=j<$.length&&B($[j][0],$[j][1]);X&&st<0&&(st=j),!X&&st>=0&&(z(G,Q[Math.max(0,st-1)],Q[Math.min($.length-1,j)],.04,.04),st=-1)}}}const O=performance.now();return{falls:N,threads:C,cuts:H,carved:y,lines:c,akua:E.length?0:-1,trench:u,ms:{lay:h-n,detect:d-h,carve:R-d,threads:I-T,total:O-n}}}function Ch(s,t,e){const o=ue(.3+.0025*s,.7,1.1),a=1.4,r=ue(.05+5e-4*s+.02*Math.sqrt(t),.06,.3),l=2.2+3.5*e+1.5,c=hl+ue(l*zu(.82*s,30)*.01,.1+.06,.1+.3);return{faceFrac:.82,faceRun:.1,wFace:o,wBase:a,poolR:r,v0:l,sLand:c}}function $v(s,t,e,n,i,o,a,r){const l=mn,{faceRun:c,faceFrac:h,wFace:f,wBase:u,poolR:m,sLand:v}=a,g=Math.hypot(n[0]-e[0],n[1]-e[1]),x=(n[0]-e[0])/g,p=(n[1]-e[1])/g,d=i-o,M=o+(1-h)*d,_=2,S=Math.max(1,Math.floor((Math.min(e[0],n[0])-_+ut)/Ze)),w=Math.min(l-2,Math.ceil((Math.max(e[0],n[0])+_+ut)/Ze)),b=Math.max(1,Math.floor((Math.min(e[1],n[1])-_+ut)/Ze)),A=Math.min(l-2,Math.ceil((Math.max(e[1],n[1])+_+ut)/Ze)),y=r.filter(P=>P[0]>-ut+S*Ze-.5&&P[0]<-ut+w*Ze+.5&&P[1]>-ut+b*Ze-.5&&P[1]<-ut+A*Ze+.5);let E=0;for(let P=b;P<=A;P++)for(let N=S;N<=w;N++){const T=-ut+(N+.5)*Ze,C=-ut+(P+.5)*Ze,I=T-e[0],H=C-e[1],z=I*x+H*p,O=-I*p+H*x,k=z-hl-Du*O*O;if(k<0||z>g||y.some(Q=>Math.hypot(Q[0]-T,Q[1]-C)<.3))continue;let q=k<c?i+(M-i)*(k/c):M+(o-M)*(k-c)/Math.max(.1,g-c);const K=Math.hypot(z-v,O)/(m*1.1);K<1&&(q-=6*(1-K*K));const L=f+(u-f)*z/g,B=(1-pn(.55*L,L,Math.abs(O)))*(1-pn(g-.45,g,z)),G=P*l+N,$=s[G]+(q-s[G])*B;$<s[G]&&(s[G]=$,E++)}const R=qt/l;for(let P=b-1;P<=A+1;P++)for(let N=S-1;N<=w+1;N++){const T=P*l+N,C=s[P*l+Math.min(l-1,N+1)]-s[P*l+Math.max(0,N-1)],I=s[Math.min(l-1,P+1)*l+N]-s[Math.max(0,P-1)*l+N],H=-C*Gt/(2*R),z=-I*Gt/(2*R),O=Math.hypot(H,1,z);t[T*4]=Math.round((H/O*.5+.5)*255),t[T*4+1]=Math.round((1/O*.5+.5)*255),t[T*4+2]=Math.round((z/O*.5+.5)*255)}return{i0:S,i1:w,j0:b,j1:A,texels:E}}function Kv(s,t,e,n){const i=le,o=e.rain,a=.25,r=(T,C)=>Math.floor((T+ut)/a)*4096+Math.floor((C+ut)/a),l=new Map,c=[0,0];for(const T of s){const C=T.along[T.along.length-1];for(let I=0;I<=C;I+=.1){Rn(T,I,c);const H=r(c[0],c[1]);let z=l.get(H);z||l.set(H,z=[]),z.push(c[0],c[1])}}const h=(T,C,I,H)=>{const z=Math.floor((T+ut)/a),O=Math.floor((C+ut)/a);let k=I,q=!1;for(let K=-1;K<=1;K++)for(let L=-1;L<=1;L++){const B=l.get((z+L)*4096+O+K);if(B)for(let G=0;G<B.length;G+=2){const $=Math.hypot(B[G]-T,B[G+1]-C);$<k&&(k=$,q=!0,H&&(H[0]=B[G],H[1]=B[G+1]))}}return q},f=t.map(T=>{const C=T.kind===0?1.4:.6;return{a:T.lip,b:T.base,r:C,x0:Math.min(T.lip[0],T.base[0])-C,x1:Math.max(T.lip[0],T.base[0])+C,z0:Math.min(T.lip[2],T.base[2])-C,z1:Math.max(T.lip[2],T.base[2])+C}}),u=(T,C)=>f.some(I=>T>I.x0&&T<I.x1&&C>I.z0&&C<I.z1&&_s(T,C,I.a[0],I.a[2],I.b[0],I.b[2])<I.r),m=(T,C,I)=>(I[0]=(n(T+.05,C)-n(T-.05,C))/(2*.05*100),I[1]=(n(T,C+.05)-n(T,C-.05))/(2*.05*100),Math.hypot(I[0],I[1]));let v=i,g=-1,x=i,p=-1;for(let T=0;T<i;T++)for(let C=0;C<i;C++)o[T*i+C]>2500&&(C<v&&(v=C),C>g&&(g=C),T<x&&(x=T),T>p&&(p=T));const d=[],M=[0,0],_=new Float64Array(3*404),S=4*Ze;for(let T=-ut+(x+.5)*ie;T<=-ut+(p+.5)*ie;T+=S)for(let C=-ut+(v+.5)*ie;C<=-ut+(g+.5)*ie;C+=S){const I=C+(Je(C*13.7+T*3.1)-.5)*S,H=T+(Je(C*5.3-T*11.9)-.5)*S,z=o[aa(I,H)];if(z<=2500)continue;const O=n(I,H);if(O<=60||m(I,H,M)<=1.2||h(I,H,.25)||u(I,H))continue;_[0]=I,_[1]=O,_[2]=H;let k=1,q=I,K=H,L=O,B=0,G=0,$=!1;for(let V=0;V<400;V++){const xt=m(q,K,M);if(xt<1e-6)break;const pt=q-M[0]/xt*.05,vt=K-M[1]/xt*.05,mt=n(pt,vt);if(mt>=L)break;if((L-mt)/5>=.9?(G+=L-mt,B=0):B++,q=pt,K=vt,L=mt,_[k*3]=q,_[k*3+1]=L,_[k*3+2]=K,k++,B>=3){$=!0;break}if(V>2&&h(q,K,.25,c)){_[k*3]=c[0],_[k*3+1]=n(c[0],c[1]),_[k*3+2]=c[1],k++;break}if(L<3)break}if(G<140||($&&(k-=3),k<4))continue;let Q=!1;for(let V=2;V<k&&!Q;V+=2)Q=u(_[V*3],_[V*3+2]);if(Q)continue;const st=[];for(let V=0;V<k;V++)st.push([_[V*3],_[V*3+1],_[V*3+2]]);const j=m(I,H,M),X=m(I+M[0]/j*.4,H+M[1]/j*.4,M),ot=st[0][1]-st[st.length-1][1];d.push({pts:st,drop:ot,rain:z,score:ot*Math.sqrt(z/3e3)*(X<.8?1.4:1),room:.35+.5*Je(I*7.1+H*17.3)})}d.sort((T,C)=>C.score-T.score);const w=new Set,b=.3,A=(T,C)=>Math.floor((T+ut)/b)*4096+Math.floor((C+ut)/b),y=[];for(const T of d){if(y.length>=300)break;const[C,,I]=T.pts[0];if(y.some(O=>Math.abs(O.pts[0][0]-C)<1.7&&Math.abs(O.pts[0][2]-I)<1.7&&Math.hypot(O.pts[0][0]-C,O.pts[0][2]-I)<O.room+T.room))continue;const H=new Set;for(let O=3;O<T.pts.length;O++)H.add(A(T.pts[O][0],T.pts[O][2]));let z=0;for(const O of H)w.has(O)&&z++;if(!(z>3)){for(const O of H)w.add(O);y.push(T)}}for(const T of y){const C=T.pts,I=Math.max(6,Math.round(T.drop/25)),H=[C[0]];let z=1;for(let O=1;O<I-1;O++){const k=C[0][1]-T.drop*O/(I-1);for(;z<C.length-1&&C[z][1]>k;)z++;const q=C[z-1],K=C[z],L=ue((q[1]-k)/(q[1]-K[1]||1),0,1);H.push([q[0]+(K[0]-q[0])*L,k,q[2]+(K[2]-q[2])*L])}H.push(C[C.length-1]),T.pts=H}const E=e.area;for(const T of y){const C=T.pts[T.pts.length-1],I=Math.floor((C[0]+ut)/ie),H=Math.floor((C[2]+ut)/ie);let z=0;for(let O=Math.max(0,H-1);O<=Math.min(i-1,H+1);O++)for(let k=Math.max(0,I-1);k<=Math.min(i-1,I+1);k++)z=Math.max(z,E[O*i+k]);T.A=z}const R=[...y].sort((T,C)=>C.A-T.A),P=t.find(T=>T.kind===0),N=y.map(T=>{const C=R.indexOf(T)/Math.max(1,R.length-1),I=Math.round(T.pts[0][0]*37+T.pts[0][2]*101),H=T.pts[1][0]-T.pts[0][0],z=T.pts[1][2]-T.pts[0][2],O=Math.hypot(H,z)||1,k=P&&Math.hypot(T.pts[0][0]-P.pool[0],T.pts[0][2]-P.pool[2])<25;return{kind:2,pts:T.pts,lip:T.pts[0],base:T.pts[T.pts.length-1],drop:T.drop,A:T.A,rain:T.rain,thr:.35+.6*Math.pow(C,.8)+(Je(I)-.5)*.15,prio:T.drop*Math.sqrt(T.rain/3e3)*(k?2:1),catch:[T.pts[0][0],T.pts[0][2],T.pts[0][0]-H/O*1.5,T.pts[0][2]-z/O*1.5]}});return N.sort((T,C)=>C.prio-T.prio),N}const ra=512,Qo=512,Zv=Array.from({length:8},(s,t)=>Math.cos(t/8*Math.PI*2)),Jv=Array.from({length:8},(s,t)=>Math.sin(t/8*Math.PI*2)),Qv=[60,120,220,1e9],tM=[.25,.5,.75,1],eM=`
${qe}
${ti}
${vn}
${ei}
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
  // coverage fade below keeps them from shimmering out there; the last
  // range is the stream curtains' and the pools')
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
`,nM=`
${qe}
${ti}
${vn}
${ei}
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
    // (the drips ride down in flight time too, crowded off the lip and
    // strung out near the foot, so they never seem to climb however long it
    // has run; where they crowd finer than a pixel or two, their average)
    float pd = s * 0.05 - tau * 1.2;
    float thr = 1.0 - flow * 1.6;
    float kd = 1.0 - smoothstep(0.35, 0.7, fwidth(pd));
    a0 *= mix(smoothstep(thr - 0.2, thr + 0.35, 0.5), smoothstep(thr, thr + 0.15, vnoise(vec2(seed * 13.0, pd))), kd);
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
`,iM=`
${qe}
${ti}
${vn}
${ei}
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
`,sM=`
${qe}
${ti}
${vn}
${ei}
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
`;function oM(){const t=new Uint8Array(4096),e=(i,o,a)=>Je((o%i+i)%i*157+(a%i+i)%i*311+i*17);for(let i=0;i<64;i++)for(let o=0;o<64;o++){let a=0,r=.5;for(let l=0;l<4;l++){const c=4<<l,h=o/64*c,f=i/64*c,u=Math.floor(h),m=Math.floor(f),v=h-u,g=f-m,x=v*v*(3-2*v),p=g*g*(3-2*g),d=e(c,u,m)+(e(c,u+1,m)-e(c,u,m))*x,M=e(c,u,m+1)+(e(c,u+1,m+1)-e(c,u,m+1))*x;a+=(d+(M-d)*p)*r,r*=.5}t[i*64+o]=Math.round(ue((a/.9375-.25)/.6,0,1)*255)}const n=new hi(t,64,64,xs,cn);return n.wrapS=n.wrapT=Pi,n.minFilter=fe,n.magFilter=fe,n.needsUpdate=!0,n}class aM{constructor(t,e){const n=performance.now();this.app=t,this.plan=e,this.enabled=!0,this.debugTime=null,this.list=e.falls,this.threads=e.threads.slice(0,Math.max(0,ra-e.falls.length)),this.nCurtain=e.falls.length,this.n=this.nCurtain+this.threads.length,this.stuck=0,this.nodeKey=new Int32Array(16384).fill(-1),this.nodeVal=new Float64Array(16384),this.build(),this.buildState(),this.buildMist(),this.clearVegetation(),this.group=new xn,this.group.add(this.mesh,this.mist),this.heroes=[];for(let o=0;o<this.nCurtain;o++){const a=this.list[o];a.kind===0&&this.heroes.push({index:o,model:a.model,src:a.src,lip:new W(a.lip[0],a.lip[1]*Gt,a.lip[2]),base:new W(a.pool[0],a.pool[1]*Gt,a.pool[2]),pool:new W(a.pool[0],a.pool[1]*Gt,a.pool[2]),poolR:a.poolR,face:a.face,per:a.per,rain:a.rain,mist:new W(a.pool[0],a.pool[1]*Gt+.35*(a.lip[1]-a.pool[1])*Gt,a.pool[2])})}this.hero=this.heroes[0]||null,this.heroView=null;const i=t.terrain.uniforms;if(this.wallWet=[],i.uFallA&&e.carved.length){for(const o of this.heroes.slice(0,i.uFallA.value.length)){const a=this.list[o.index],r=this.wallWet.length,l=Math.hypot(a.base[0]-a.lip[0],a.base[2]-a.lip[2]);i.uFallA.value[r].set(a.lip[0],a.lip[2],a.face[0],a.face[1]),i.uFallB.value[r].set(a.lip[1],a.pool[1],1.1*a.W0,a.carve.sLand),i.uFallC.value[r].set(l,a.drop,a.carve.wFace,this.wet[o.index]),i.uFallD.value[r].set(a.carve.wBase,Du,hl,ue(.5+.002*a.drop,.6,1.1)),this.wallWet.push(i.uFallC.value[r])}i.uFalls.value=this.wallWet.length}this.lastStop=-1,this.frustum=new Rs,this.projView=new te,this.tmp=new W,this.setQuality(t.quality?t.quality.level:2),this.buildMs=performance.now()-n,this.settle()}setHero(t,e=null){this.hero=t,this.heroView=e}fine(t,e){return Math.max(this.app.terrain.metresAt(t,e),this.coarse(0,t,e))}coarse(t,e,n){const i=Ze*(1<<t),o=(e+ut)/i,a=(n+ut)/i,r=Math.floor(o),l=Math.floor(a),c=o-r,h=a-l,f=this.node(t,r,l),u=this.node(t,r+1,l),m=this.node(t,r,l+1),v=this.node(t,r+1,l+1),g=f+(u-f)*c+(m-f)*h+(f-u-m+v)*c*h,x=c+h<=1?f+(u-f)*c+(m-f)*h:v+(m-v)*(1-c)+(u-v)*(1-h),p=c>=h?f+(u-f)*c+(v-u)*h:f+(m-f)*h+(v-m)*c;return Math.max(g,x,p)}node(t,e,n){const i=(t*4096+n)*4096+e|0,o=(Math.imul(e,73856093)^Math.imul(n,19349663)^Math.imul(t,83492791))&16383;if(this.nodeKey[o]===i)return this.nodeVal[o];const a=Ze*(1<<t),r=this.app.terrain.metresAt(-ut+e*a,-ut+n*a);return this.nodeKey[o]=i,this.nodeVal[o]=r,r}axisOf(t){const e=[0,0];if(t.kind===0)return Rn(this.plan.lines[t.laid],Math.max(0,t.sLip-.08),e),{poly:[[e[0],e[1]],[t.lip[0],t.lip[2]],[t.base[0],t.base[2]]],lipAt:Math.hypot(e[0]-t.lip[0],e[1]-t.lip[2])};if(t.kind===1){const r=this.plan.lines[t.laid],l=Math.max(0,t.sLip-.03),c=[];Rn(r,l,e),c.push([e[0],e[1]]);for(let h=0;h<r.pts.length;h++)r.along[h]>l+1e-4&&r.along[h]<t.sBase-1e-4&&c.push([r.pts[h][0],r.pts[h][1]]);return Rn(r,t.sBase,e),c.push([e[0],e[1]]),{poly:c,lipAt:t.sLip-l}}const n=t.pts,i=n[1][0]-n[0][0],o=n[1][2]-n[0][2],a=Math.hypot(i,o)||1;return{poly:[[n[0][0]-i/a*.05,n[0][2]-o/a*.05],...n.map(r=>[r[0],r[2]])],lipAt:.05}}spine(t,e){const n=t.kind,{poly:i,lipAt:o}=this.axisOf(t),a=[],r=[],l=[];let c=0;for(let j=0;j<i.length;j++)j>0&&(c+=Math.hypot(i[j][0]-i[j-1][0],i[j][1]-i[j-1][1])),i[j].s=c;const h=c,f=n===2?.04:.02;for(let j=0;j<=h+1e-6;j+=f){let X=1;for(;X<i.length-1&&i[X].s<j;)X++;const ot=i[X-1],V=i[X],xt=ue((j-ot.s)/(V.s-ot.s||1),0,1);a.push(ot[0]+(V[0]-ot[0])*xt),r.push(ot[1]+(V[1]-ot[1])*xt),l.push(j-o)}const u=a.length,m=(j,X)=>{const ot=(j+o)/f;let V=Math.floor(ot);V<0&&(V=0),V>u-2&&(V=u-2);const xt=ot-V;X[0]=a[V]+(a[V+1]-a[V])*xt,X[1]=r[V]+(r[V+1]-r[V])*xt;const pt=a[V+1]-a[V],vt=r[V+1]-r[V],mt=Math.hypot(pt,vt)||1;return X[2]=pt/mt,X[3]=vt/mt,X},v=Math.round(o/f),g=new Float64Array(u);for(let j=0;j<u;j++)g[j]=this.fine(a[j],r[j])*Gt;const x=g[v];for(let j=v+1;j<u;j++)g[j]=Math.min(g[j],g[j-1]);const p=j=>{for(let X=v+1;X<u;X++)if(g[X]<=j){const ot=(g[X-1]-j)/(g[X-1]-g[X]||1);return l[X-1]+(l[X]-l[X-1])*ot}return l[u-1]},d=t.per??0,M=t.A;let _,S,w,b;n===0?(_=2.2+3.5*d+1.5,S=30,w=ue(.08+.03*Math.sqrt(M),.1,.22),b=1.7):n===1?(_=1.2+2.8*d,S=14+14*d,w=ue(.03+.02*Math.sqrt(M),.04,.12),b=1.4):(_=.6,S=9,w=.005+.012*ue(M/.07,0,1),b=1.25);const A=t.drop,y=n===0?36:n===1?ue(Math.round(A/10),12,28):Math.max(6,Math.round(A/25)),E=[];for(let j=0;j<=y;j++)E.push(n===2?A*j/y:A*(j/y)*(j/y));if(n===0)for(const j of[16,10,5,2.5])E.push(A-j);else if(n===1)for(const j of[20,10,4])A>3*j&&E.push(A-j);const R=(t.ledges||[]).slice(0,3);for(const j of R)E.push(j);E.sort((j,X)=>j-X);for(let j=E.length-2;j>0;j--)E[j+1]-E[j]<1&&!R.includes(E[j])&&E.splice(j,1);const P=n===0?1.05:n===1?.1:1.4,N=n===2?.15:.3,T=[0,0,0,0],C=[],I=j=>{m(j.sig,T),j.fx=T[2],j.fz=T[3],j.x=T[0]-T[3]*j.lat,j.z=T[1]+T[2]*j.lat},H=Math.min(.11,.009*Math.sqrt(t.ribbonA??M)+.012)*(n===0?.9:1.25),z=n===0?(t.pool[0]-t.lip[0])*t.face[0]+(t.pool[2]-t.lip[2])*t.face[1]:1/0,O=n===0?-.06:-.03;m(O,T),C.push({x:T[0],y:this.fine(T[0],T[1])*Gt+(n===0?.035:.012),z:T[1],fx:T[2],fz:T[3],d:0,hw:n===0?Math.min(H,.5*w):H,contact:1,tongue:-1,sig:O}),m(0,T);const k=n===0?Math.min(.5*w,Math.max(H,.35*w)):n===1?H:Math.min(.5*w,H*.4+.3*w);C.push({x:T[0],y:x+.004,z:T[1],fx:T[2],fz:T[3],d:0,hw:k,contact:1,tongue:0,sig:0});for(const j of E){const X=x-j*Gt,ot=_*zu(j,S)*.01,V=p(X);let xt=.5*w*(1+(b-1)*j/Math.max(1,A));n<2&&(xt*=k/(.5*w)+(1-k/(.5*w))*pn(0,n===0?18:20,j));const pt=.006+N*xt,vt=Math.min(V+pt,z),mt=Math.max(ot,vt),Nt=n===0&&V+pt>z?0:1-pn(0,.03,ot+(n===0?qv:0)-vt),rt={y:X,d:j,hw:xt,contact:Nt,ledge:R.includes(j),sig:mt,lat:0};I(rt),C.push(rt)}const q=(j,X)=>{const ot=C[Math.max(0,j-1)],V=C[Math.min(C.length-1,j+1)];X[0]=V.x-ot.x,X[1]=V.y-ot.y,X[2]=V.z-ot.z;const xt=Math.hypot(X[0],X[1],X[2])||1;return X[0]/=xt,X[1]/=xt,X[2]/=xt,X},K=[0,0,0],L=A-(4+.03*A),B=n===2?2:1;for(let j=2;j<C.length;j++){const X=C[j],ot=C[j-1];if(j>2&&ot.sig>X.sig&&(X.sig=ot.sig,X.lat=ot.lat,I(X)),X.d>L||n===0&&X.d<3)continue;q(j,K);const V=-X.fz,xt=X.fx;let pt=K[1]*xt-K[2]*0,vt=K[2]*V-K[0]*xt,mt=K[0]*0-K[1]*V;const Nt=Math.hypot(pt,vt,mt)||1;pt/=Nt,vt/=Nt,mt/=Nt;const rt=n===0?1+(.15+.9*pn(10,150,X.d))*P*(1-pn(.55*A,L,X.d)):1,U=X.hw*rt,D=X.hw*(.45+(.25-.45)*X.contact)*rt,Z=X.sig,ct=X.lat;let lt=0;for(;lt<80;lt++){let dt=!1,At=0;for(let gt=0;gt<8;gt+=B){const Ct=Zv[gt],zt=Jv[gt],ht=X.x+V*U*Ct+pt*D*zt,ee=X.y+vt*D*zt,Wt=X.z+xt*U*Ct+mt*D*zt;ee<this.fine(ht,Wt)*Gt+.004&&(dt=!0,At+=Ct)}if(!dt)break;const yt=n===0?0:At>.5?-.004:At<-.5?.004:0;X.sig+=.005,X.lat+=yt,I(X)}lt>=80&&(this.stuck++,X.sig=Z,X.lat=ct,I(X))}const G=C.length;if(G>4){const j=C.map(X=>X.sig??0);for(let X=0;X<4;X++){let ot=C[2].sig;for(let xt=3;xt<G;xt++){const pt=C[xt].sig,vt=xt+1<G?C[xt+1].sig:pt;C[xt].sig=Math.max(j[xt],(ot+2*pt+vt)/4),ot=pt}let V=C[2].lat;for(let xt=3;xt<G-1;xt++){const pt=C[xt].lat;C[xt].lat=(V+2*pt+C[xt+1].lat)/4,V=pt}}if(n===1){const X=Math.min(25,.25*A);for(let ot=2;ot<G;ot++)C[ot].lat*=1-pn(A-X,A,C[ot].d)}for(let X=2;X<G;X++)I(C[X])}for(const j of C){if(j.hand=1,!t.hand||n===2||n===0&&j.sig>0)continue;const X=t.sLip+j.sig,ot=t.hand;let V=ue((X-ot.a)/Math.max(1e-6,ot.b-ot.a),0,1);n===1&&(V=Math.min(V,1-ue((X-ot.c)/Math.max(1e-6,ot.d-ot.c),0,1))),j.hand=V}let $=_,Q=0,st=0;C[0].T=-.4,C[0].s=-3,C[1].T=0,C[1].s=0;for(let j=2;j<C.length;j++){const X=C[j-1],ot=C[j],V=Math.hypot(ot.x-X.x,ot.z-X.z)*100,xt=(X.y-ot.y)/Gt,pt=Math.hypot(V,xt),vt=Math.max(1,Math.ceil(pt)),mt=xt/Math.max(.5,V),Nt=ot.contact>.5?9+(S-9)*pn(1.5,5,mt):S;for(let rt=0;rt<vt;rt++)$=Math.sqrt(Math.max(.25,$*$+2*9.81*(xt/vt)*(1-$*$/(Nt*Nt)))),Q+=pt/vt/Math.max(.5,$);st+=pt,ot.T=Q,ot.s=st,ot.ledge&&($=2.5)}for(let j=0;j<C.length;j++){const X=C[j];q(j,K),X.tx=K[0],X.ty=K[1],X.tz=K[2];const ot=-X.fz,V=X.fx;X.lift=[0,0,0,0];for(let xt=0;xt<4;xt++){let pt=this.coarse(xt,X.x,X.z)*Gt+.01-X.y;n!==2&&xt<2&&(pt=Math.max(pt,this.coarse(xt,X.x-ot*X.hw,X.z-V*X.hw)*Gt+.01-X.y),pt=Math.max(pt,this.coarse(xt,X.x+ot*X.hw,X.z+V*X.hw)*Gt+.01-X.y)),X.lift[xt]=Math.max(0,pt)}X.along=ue(X.d/Math.max(1,A),0,1),X.toBase=A-X.d}return{st:C,W0:w,yL:x,at:m,sigmaT:p,drop:A}}build(){let t=16384;const e={pos:new Float32Array(t*3),axis:new Float32Array(t*3),face:new Float32Array(t*3),fall:new Float32Array(t*4),meta:new Float32Array(t*4),more:new Float32Array(t*3),lift:new Float32Array(t*4)},n={pos:3,axis:3,face:3,fall:4,meta:4,more:3,lift:4};let i=0;const o=(_,S,w,b,A,y,E,R,P,N,T,C,I,H,z,O,k,q,K,L=1)=>{if(i>=t){t*=2;for(const $ in e){const Q=new Float32Array(t*n[$]);Q.set(e[$]),e[$]=Q}}const B=i*3,G=i*4;return e.pos[B]=_,e.pos[B+1]=S,e.pos[B+2]=w,e.axis[B]=b,e.axis[B+1]=A,e.axis[B+2]=y,e.face[B]=E,e.face[B+2]=R,e.fall[G]=P,e.fall[G+1]=N,e.fall[G+2]=T,e.fall[G+3]=C,e.meta[G]=I,e.meta[G+1]=H,e.meta[G+2]=z,e.meta[G+3]=O,e.more[i*3]=k,e.more[i*3+1]=q,e.more[i*3+2]=L,K&&(e.lift[G]=K[0],e.lift[G+1]=K[1],e.lift[G+2]=K[2],e.lift[G+3]=K[3]),i++},a=[],r=[],l=[],c=[],h=[];this.stations=[],this.pools=[],this.mistSrc=[];const f=(_,S,w,b,A,y,E,R)=>{const P=Math.atan2(E,y),N=o(w,R??this.fine(w,b)*Gt+.003,b,0,1,0,y,E,0,0,A,4,_,S,0,0,1,0,null);for(let T=0;T<=16;T++){const C=T/16*Math.PI*2,I=w+Math.cos(P+C)*A,H=b+Math.sin(P+C)*A;o(I,R??this.fine(I,H)*Gt+.003,H,0,1,0,y,E,0,0,A,4,_,S,1,C,1,0,null),T>0&&a.push(N,N+T,N+T+1)}this.pools.push([w,b,A])},u=(_,S,w,b,A)=>{const y=_.st;let E=-1;for(let R=0;R<y.length;R++){const P=y[R],N=o(P.x,P.y,P.z,P.tx,P.ty,P.tz,P.fx,P.fz,P.s,P.T,P.hw,A,S,w,-1,P.contact,P.along,P.toBase,P.lift,P.hand);o(P.x,P.y,P.z,P.tx,P.ty,P.tz,P.fx,P.fz,P.s,P.T,P.hw,A,S,w,1,P.contact,P.along,P.toBase,P.lift,P.hand),E>=0&&b.push(E,E+1,N,E+1,N+1,N),E=N,A!==2&&this.stations.push(P.x,P.z)}},m=[0,0,0,0];for(let _=0;_<this.nCurtain;_++){const S=this.list[_],w=Je(_*7.13+1.7),b=this.spine(S,_);S.W0=b.W0,u(b,_,w,S.kind===0?r:l,S.kind);const A=this.plan.lines[S.laid],y=S.kind===0?S.sPool:S.sBase,E=[0,0],R=[0,0];Rn(A,y,E),Rn(A,y+.15,R);let P=R[0]-E[0],N=R[1]-E[1];const T=Math.hypot(P,N);T<1e-4?(P=S.face?S.face[0]:1,N=S.face?S.face[1]:0):(P/=T,N/=T);const C=S.drop,I=S.kind===0?S.poolR:ue(.05+5e-4*C+.02*Math.sqrt(S.A),.06,.3),H=b.st[b.st.length-1],z=S.kind===0?S.pool[0]:H.x,O=S.kind===0?S.pool[2]:H.z,k=.05,q=Math.hypot(this.fine(z+k,O)-this.fine(z-k,O),this.fine(z,O+k)-this.fine(z,O-k))/(2*k*100),K=this.list.some(L=>L!==S&&Math.hypot(L.lip[0]-z,L.lip[2]-O)<I+.4);(S.kind===0||q<.35&&!K)&&f(_,w,z,O,I,P,N,S.kind===0?S.pool[1]*Gt:void 0),S.poolAt=[z,S.kind===0?S.pool[1]:this.fine(z,O),O,I];for(const L of(S.ledges||[]).slice(0,3))b.at(b.sigmaT(b.yL-L*Gt),m),Math.hypot(this.fine(m[0]+k,m[1])-this.fine(m[0]-k,m[1]),this.fine(m[0],m[1]+k)-this.fine(m[0],m[1]-k))/(2*k*100)<.35&&f(_,w+.37,m[0],m[1],I*.6,m[2],m[3]);this.mistSrc.push({id:_,f:S,sp:b,ox:P,oz:N})}for(let _=0;_<this.threads.length;_++){const S=this.threads[_],w=this.nCurtain+_,b=this.spine(S,w);h.push(c.length),u(b,w,Je(w*3.77+.3),c,2)}h.push(c.length);const v=a.length+r.length+l.length+c.length,g=i>65535?new Uint32Array(v):new Uint16Array(v);let x=0;for(const _ of[a,r,l,c])g.set(_,x),x+=_.length;const p=v-c.length;this.threadIdx=h.map(_=>p+_);const d=new Le;d.setAttribute("position",new oe(e.pos.slice(0,i*3),3)),d.setAttribute("aAxis",new oe(e.axis.slice(0,i*3),3)),d.setAttribute("aFace",new oe(e.face.slice(0,i*3),3)),d.setAttribute("aFall",new oe(e.fall.slice(0,i*4),4)),d.setAttribute("aMeta",new oe(e.meta.slice(0,i*4),4)),d.setAttribute("aMore",new oe(e.more.slice(0,i*3),3)),d.setAttribute("aLift",new oe(e.lift.slice(0,i*4),4)),d.setIndex(new oe(g,1)),this.verts=i,this.tris=v/3;const M=this.app;this.uniforms={...M.shared.uniforms,uHeight:{value:M.terrain.heightTex},uState:{value:null},uPx:{value:.001},uLodRange:{value:M.terrain.range0},uWaterTime:{value:0},uDebug:{value:0},uPuff:{value:null},uBow:{value:.05},uNightK:{value:.35}},this.material=new be({vertexShader:eM,fragmentShader:nM,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:tn,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new ae(d,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=3}buildState(){const t=this.n,e=this.app.weather;this.state=new Float32Array(ra*4),this.stateTex=new hi(this.state,ra,1,Ve,An),this.stateTex.minFilter=Me,this.stateTex.magFilter=Me,this.stateTex.generateMipmaps=!1,this.stateTex.needsUpdate=!0,this.uniforms.uState.value=this.stateTex,this.kind=new Uint8Array(t),this.per=new Float32Array(t),this.thr=new Float32Array(t),this.cell=new Int32Array(t),this.c1=new Int32Array(t),this.cU1=new Int32Array(t),this.cU2=new Int32Array(t),this.w0=new Float32Array(t),this.lenY=new Float32Array(t),this.flow=new Float32Array(t),this.front=new Float32Array(t),this.wet=new Float32Array(t),this.spate=new Float32Array(t),this.primed=new Float32Array(t),this.turb=new Float32Array(t),this.px=new Float32Array(t),this.pz=new Float32Array(t),this.mid=new Float32Array(t*3);const n=e.G,i=(a,r)=>ue(Math.floor((r-e.origin)/e.cell),0,n-1)*n+ue(Math.floor((a-e.origin)/e.cell),0,n-1),o=[0,0];for(let a=0;a<t;a++){const r=a<this.nCurtain?this.list[a]:this.threads[a-this.nCurtain];if(this.kind[a]=r.kind,this.per[a]=r.per??0,this.thr[a]=r.thr??0,this.cell[a]=i(r.lip[0],r.lip[2]),r.kind!==2){const l=this.plan.lines[r.laid];Rn(l,r.sLip-1,o),this.cU1[a]=i(o[0],o[1]),Rn(l,r.sLip-2.5,o),this.cU2[a]=i(o[0],o[1])}this.lenY[a]=r.drop*Gt,this.px[a]=r.lip[0],this.pz[a]=r.lip[2],this.mid[a*3]=(r.lip[0]+r.base[0])/2,this.mid[a*3+1]=(r.lip[1]+r.base[1])/2*Gt,this.mid[a*3+2]=(r.lip[2]+r.base[2])/2,r.kind===2&&(this.cell[a]=i(r.catch[0],r.catch[1]),this.c1[a]=i(r.catch[2],r.catch[3]),this.w0[a]=.6)}}buildMist(){const t=[],e=this.app.weather.wind,n=[0,0,0,0];this.mistAnchors=[];for(const{id:c,f:h,sp:f,ox:u,oz:m}of this.mistSrc){const v=h.drop,g=h.per??0;if(h.kind>1||v<100||g<.2&&h.kind!==0)continue;const x=f.W0*100,p=ue((15+.25*v)*(.4+.6*Math.max(g,h.kind===0?.4:0))*Math.sqrt(x/10),10,90),d=h.kind===0?Math.round(ue(6+v/25,6,40)*Math.sqrt(x/8)):Math.min(4,Math.round(ue(6+v/25,6,40)*Math.sqrt(x/8))),[M,_,S]=h.poolAt,w=[];for(let b=0;b<d;b++){const A=Je(c*91.3+b*7.7),y=Je(c*13.1+b*3.3+.5),E=(.35+.25*Je(c*5.3+b*1.9))*p*.01,R=A*Math.PI*2,P=Math.sqrt(y)*.3*p*.01;w.push([0,M+Math.cos(R)*P,_*Gt+E*.5,S+Math.sin(R)*P,E,u,m])}if(h.kind===0){const b=Math.round(ue(v/40,2,10));for(let A=0;A<b;A++){const y=v*(.3+.65*Math.sqrt(Je(c*3.1+A*11.7)));let E=2;for(;E<f.st.length-1&&f.st[E].d<y;)E++;const R=f.st[E],P=-R.fz,N=R.fx,T=P*e.x+N*e.y>=0?1:-1,C=(1.2+1.3*Je(c*7.9+A*2.3))*R.hw;w.push([1,R.x+R.fx*.5*R.hw+P*T*R.hw*.5,R.y,R.z+R.fz*.5*R.hw+N*T*R.hw*.5,C,R.fx,R.fz])}}for(const b of(h.ledges||[]).slice(0,3))f.at(f.sigmaT(f.yL-b*Gt),n),w.push([2,n[0],this.fine(n[0],n[1])*Gt+p*.0025,n[1],p*.005,n[2],n[3]]);w.forEach((b,A)=>t.push({m:b,id:c,key:(A+.5)/w.length+.01*Je(c*17.3+A)})),this.mistAnchors.push(M,_*Gt,S)}t.sort((c,h)=>c.key-h.key);const i=Math.min(Qo,t.length),o=new Float32Array(Qo*3),a=new Float32Array(Qo*4),r=new Float32Array(Qo*3);for(let c=0;c<i;c++){const{m:h,id:f}=t[c];o.set([h[1],h[2],h[3]],c*3),a.set([h[0],Je(c*1.618+f*.31),h[4],f],c*4),r.set([h[5],0,h[6]],c*3)}const l=new fu;l.setAttribute("position",new xe([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("iOrigin",new $n(o,3)),l.setAttribute("iKind",new $n(a,4)),l.setAttribute("iFace",new $n(r,3)),l.instanceCount=i,this.nMist=i,this.mistAnchors=new Float32Array(this.mistAnchors),this.uniforms.uPuff.value=oM(),this.mistMaterial=new be({vertexShader:iM,fragmentShader:sM,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:tn}),this.mist=new ae(l,this.mistMaterial),this.mist.frustumCulled=!1,this.mist.renderOrder=4}clearVegetation(){const t=this.app.vegetation;if(!t||!t.cleared)return;const e=le,n=t.cleared,i=(l,c,h,f)=>{const u=Math.max(0,Math.floor((l-h+ut)/ie)),m=Math.min(e-1,Math.floor((l+h+ut)/ie)),v=Math.max(0,Math.floor((c-h+ut)/ie)),g=Math.min(e-1,Math.floor((c+h+ut)/ie));for(let x=v;x<=g;x++)for(let p=u;p<=m;p++){const d=-ut+(p+.5)*ie,M=-ut+(x+.5)*ie;(f?f(d,M):Math.hypot(d-l,M-c)<=h)&&(n[x*e+p]=1)}};for(let l=0;l<this.stations.length;l+=2)i(this.stations[l],this.stations[l+1],.2);for(const[l,c,h]of this.pools)i(l,c,h+.1);const o=[0,0];for(const l of this.list){if(l.kind!==0)continue;const c=this.plan.lines[l.laid];for(let v=l.sPool;v<l.sPool+1.6;v+=.1)Rn(c,v,o),i(o[0],o[1],.32-.12*((v-l.sPool)/1.6));const[h,f]=l.face,u=.75*l.carve.wFace,m=l.carve.faceRun+.6;i(l.lip[0]+h*m*.5,l.lip[2]+f*m*.5,m+u,(v,g)=>{const x=v-l.lip[0],p=g-l.lip[2],d=x*h+p*f,M=-x*f+p*h;return d>=-.1&&d<=m&&Math.abs(M)<u})}const a=this.app.terrain,r=new W;for(const l of this.list){if(l.kind!==0)continue;const[c,,h]=l.lip,[f,,u]=l.pool;i((c+f)/2,(h+u)/2,1.8,(m,v)=>_s(m,v,c,h,f,u)<1.5&&a.normalAt(m,v,r).y<.45)}}clearSight(t,e){const n=this.app.vegetation;if(!n||!n.cleared)return;const i=this.app.terrain,o=n.cleared,a=le;let r=!1;for(const l of e){const c=Math.hypot(l.x-t.x,l.z-t.z),h=Math.ceil(c/(ie*.4));for(let f=1;f<h;f++){const u=f/h,m=t.x+(l.x-t.x)*u,v=t.z+(l.z-t.z)*u;if(!(t.y+(l.y-t.y)*u-Math.max(0,i.heightAt(m,v))>.6))for(const[x,p]of[[0,0],[ie*.5,0],[-ie*.5,0],[0,ie*.5],[0,-ie*.5]]){const d=Math.floor((m+x+ut)/ie),M=Math.floor((v+p+ut)/ie);d<0||M<0||d>=a||M>=a||o[M*a+d]||(o[M*a+d]=1,r=!0)}}}r&&n.tiles&&(n.tiles.clear(),n.lastSelection="")}raw(t){const e=this.app.weather.rain;return Math.min(1.5,(e[this.cell[t]]*this.w0[t]+e[this.c1[t]]*(1-this.w0[t]))/1.2)}targetOf(t,e){if(this.kind[t]===2){const i=Math.max(this.spate[t],this.primed[t]);return pn(this.thr[t],this.thr[t]+.3,i)}const n=this.wetOf(t)*1.4+e*.5;return Math.min(1,this.kind[t]===0?this.per[t]*.5+n*1.5:this.per[t]+n)}wetOf(t){const e=this.app.weather.wet;return(e[this.cell[t]]+e[this.cU1[t]]+e[this.cU2[t]])/3}turbOf(t){if(this.kind[t]===2)return 0;const e=this.app.weather,n=e.rain;return pn(.3,.8,Math.max(n[this.cell[t]],n[this.cU1[t]],n[this.cU2[t]]))*(e.regime==="kona"?1:.25)}prime(t,e,n){const i=this.app.weather;for(let o=this.nCurtain;o<this.n;o++){const a=this.px[o]-t.x,r=this.pz[o]-t.z;if(a*a+r*r>=e*e)continue;const l=n*pn(.1,.45,Math.max(this.raw(o),i.wet[this.cell[o]]));this.primed[o]<l&&(this.primed[o]=l)}}primeStop(){var n;const t=this.app.ui;if(!t||!t.stops)return;this.lastStop=t.index;const e=t.views[(n=t.stops[t.index])==null?void 0:n.id];e&&e.spate&&this.prime(e.target,40,e.spate)}settle(){const t=this.app.streams?this.app.streams.uniforms.uFlowAll.value:0;for(let n=this.nCurtain;n<this.n;n++)this.spate[n]=this.raw(n);const e=this.app.ui;e&&e.index!==this.lastStop&&this.primeStop();for(let n=0;n<this.n;n++){const i=this.targetOf(n,t);this.flow[n]=i,this.front[n]=i>.05?1.15:0,this.wet[n]=i,this.turb[n]=this.turbOf(n),this.state[n*4]=i,this.state[n*4+1]=this.front[n],this.state[n*4+2]=i,this.state[n*4+3]=this.turb[n]}this.stateTex.needsUpdate=!0}update(t){const e=this.app,n=t*e.clock.speed,i=1-Math.exp(-n/1800),o=1-Math.exp(-n/10800),a=1-Math.exp(-t/2),r=Math.exp(-n/21600),l=e.streams.uniforms.uFlowAll.value,c=e.ui;c&&c.index!==this.lastStop&&this.primeStop();const h=this.state;let f=!1;for(let d=0;d<this.n;d++){if(this.kind[d]===2){const w=this.raw(d);this.spate[d]+=(w-this.spate[d])*(w>this.spate[d]?i:o),this.primed[d]-=this.primed[d]*o}const M=this.targetOf(d,l);this.flow[d]+=(M-this.flow[d])*a,M>.05?this.front[d]=Math.min(1.15,this.front[d]+t/(2+4*this.lenY[d])):this.flow[d]<.03&&(this.front[d]=0),this.wet[d]=Math.max(this.flow[d],this.wet[d]*r);const _=this.turbOf(d);this.turb[d]+=(_-this.turb[d])*(_>this.turb[d]?i:o);const S=d*4;(Math.abs(h[S]-this.flow[d])>1e-4||Math.abs(h[S+1]-this.front[d])>1e-4||Math.abs(h[S+2]-this.wet[d])>1e-4||Math.abs(h[S+3]-this.turb[d])>.001)&&(h[S]=this.flow[d],h[S+1]=this.front[d],h[S+2]=this.wet[d],h[S+3]=this.turb[d],f=!0)}f&&(this.stateTex.needsUpdate=!0);for(let d=0;d<this.wallWet.length;d++)this.wallWet[d].w=this.wet[this.heroes[d].index];const u=this.uniforms,m=e.camera;u.uLodRange.value=e.terrain.range0,u.uPx.value=2*Math.tan(m.fov/2*(Math.PI/180))/Math.max(1,e.renderer.domElement.height),u.uWaterTime.value=this.debugTime??e.time;const v=m.position,g=v.y-Math.max(0,e.terrain.heightAt(v.x,v.z));this.group.visible=this.enabled&&g<90;let x=1/0;const p=this.mistAnchors;for(let d=0;d<p.length;d+=3){const M=p[d]-v.x,_=p[d+1]-v.y,S=p[d+2]-v.z,w=M*M+_*_+S*S;w<x&&(x=w)}this.mist.visible=this.group.visible&&x<3600,this.holdOrbit()}holdOrbit(){var f;const t=this.app.ui,e=this.app.rig;if(!t||!t.stops||!e||e.flight||!e.autoOrbit)return;const n=t.views[(f=t.stops[t.index])==null?void 0:f.id];if(!n||!n.orbit)return;const o=typeof innerWidth=="number"&&innerWidth<innerHeight&&n.orbitPortrait||n.orbit,a=o[0]-n.yaw,r=o[1]-n.yaw,l=Xv(e.goal.yaw-n.yaw);let c=e.autoOrbit>0?1:-1;c>0&&l>=r?c=-1:c<0&&l<=a&&(c=1);const h=l<a-.05||l>r+.05?1:Math.max(0,Math.min(r-l,l-a));e.autoOrbit=c*(n.distance<60?.012:.02)*(.15+.85*pn(0,.12,h))}setQuality(t){const e=ue(t|0,0,3),n=Math.min(Qv[e],this.threads.length);this.mesh.geometry.setDrawRange(0,this.threadIdx[n]),this.mist.geometry.instanceCount=Math.round(this.nMist*tM[e])}setDebug(t){this.uniforms.uDebug.value=t|0}frame(t,e,n=0,i=.15,o=0){const a=t<this.nCurtain?this.list[t]:this.threads[t-this.nCurtain],r=a.poolAt||a.base,l=a.face?a.face[0]:a.base[0]-a.lip[0],c=a.face?a.face[1]:a.base[2]-a.lip[2],h=Math.atan2(l,c)+n,f=this.app.rig;for(const u of[f.goal,f.state])u.target.set(r[0],Math.max(0,this.app.terrain.heightAt(r[0],r[2])),r[2]),u.distance=e,u.yaw=h,u.pitch=i,u.lift=o;f.flight=null,f.autoOrbit=0}get stats(){const t=this.app;let e=0,n=0;t.camera&&(t.camera.updateMatrixWorld(),this.projView.multiplyMatrices(t.camera.projectionMatrix,t.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView));for(let o=this.nCurtain;o<this.n;o++)this.flow[o]<=.5||(e++,this.tmp.set(this.mid[o*3],this.mid[o*3+1],this.mid[o*3+2]),this.frustum.containsPoint(this.tmp)&&this.tmp.distanceTo(t.camera.position)<70&&n++);const i=this.list.filter(o=>o.kind===0);return{heroes:i.length,model:i.some(o=>o.model),akuaLine:this.hero?this.hero.src:-1,akuaHero:this.heroes.indexOf(this.hero),akuaView:this.heroView,stream:this.nCurtain-i.length,threads:this.threads.length,threadsOn:e,inView:n,mist:this.nMist,verts:this.verts,tris:this.tris,stuck:this.stuck,carvedTexels:this.plan.carved.reduce((o,a)=>o+a.texels,0),trench:this.plan.trench,planMs:Math.round(this.plan.ms.total),buildMs:Math.round(this.buildMs||0),cutTris:t.streams?t.streams.cutTris:-1}}}function ro(s,t,{filter:e="mip",format:n=Ve}={}){const i=new hi(s,t,t,n,cn);return e==="nearest"?(i.minFilter=Me,i.magFilter=Me):e==="linear"?(i.minFilter=fe,i.magFilter=fe):(i.minFilter=Li,i.magFilter=fe,i.generateMipmaps=!0),i.wrapS=i.wrapT=en,i.needsUpdate=!0,i}function rM(s){const t=le,e=new Uint8Array(t*t*4),n=Math.log(300),i=Math.log(12e3),o=new Float32Array(t*t);for(let r=0;r<t*t;r++)o[r]=Math.max(0,Math.min(1,Math.log10(Math.max(1e-6,s.area[r])/.04)/1.6));const a=Au(o,t,2,2);for(let r=0;r<t*t;r++)e[r*4]=Math.round(255*Math.max(0,Math.min(1,(Math.log(s.rain[r])-n)/(i-n)))),e[r*4+1]=Math.round(255*Math.max(0,Math.min(1,s.sand[r]))),e[r*4+2]=Math.round(255*Math.min(1,a[r]*1.6)),e[r*4+3]=s.region[r*4+3];return ro(e,t)}function lM(s){const t=le,e=new Uint8Array(t*t*4),n=qt/t*100,i=Nx(t,o=>s.height1024[o]>0);for(let o=0;o<t*t;o++)e[o*4+3]=Math.round(255*Math.min(1,i[o]*n/300));return{tex:ro(e,t),data:e}}const lo=["#8d9cc9","#3d8a4c","#a3d05b","#e3b65e","#f3e2b0","#53d6c8","#2a5aa8"],cM=["#000000","#f0a35e","#6fb6e8","#f2d06b","#9ed27a"];function hM(s){const t=le,e=lo.map(r=>new Dt(r)),n=[new Float32Array(t*t),new Float32Array(t*t),new Float32Array(t*t)];for(let r=0;r<t*t;r++){const l=e[s[r*4+2]]||e[6];n[0][r]=l.r,n[1][r]=l.g,n[2][r]=l.b}const i=n.map(r=>Au(r,t,2,2)),o=new Uint8Array(t*t*4);for(let r=0;r<t*t;r++)o[r*4]=Math.round(255*Math.pow(i[0][r],1/2.2)),o[r*4+1]=Math.round(255*Math.pow(i[1][r],1/2.2)),o[r*4+2]=Math.round(255*Math.pow(i[2][r],1/2.2)),o[r*4+3]=255;const a=ro(o,t);return a.colorSpace=Ue,a}class uM{constructor(t,e){this.canvas=t,this.island=e,this.params=new URLSearchParams(location.search);const n=new ru({canvas:t,antialias:!1,powerPreference:"high-performance"});n.setClearColor(0,1),this.renderer=n,this.pipeline=new V1(n),this.scene=new Es,this.camera=new Qe(42,1,.1,9e3),this.light={sunDir:new W(0,1,0),sunColor:new Dt,skyColor:new Dt,groundColor:new Dt,moonDir:new W(0,-1,0),moonColor:new Dt,zenith:new Dt,horizon:new Dt,sunHorizon:new Dt,night:0};const i=new hi(new Uint8Array([0,0,0,0]),1,1);i.needsUpdate=!0;const o=e.data;this.landTex=rM(o),this.regionTex=ro(o.region,le,{filter:"nearest"}),this.linesTex=ro(o.lines,mn,{filter:"linear"}),this.zoneTex=hM(o.region),this.overlay=new pe(0,0,0,0),this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uShadow:{value:null},uWeather:{value:i},uWeatherRect:{value:new pe(-qt,-qt,qt*2,qt*2)},uCloudShadowK:{value:0},uCloudMidY:{value:15},uCloudWind:{value:new Ut},uCloudWindDir:{value:new Ut(1,0)},uFarCover:{value:.32},uWetness:{value:0},uLand:{value:this.landTex},uSkyMap:{value:null},uRegion:{value:this.regionTex},uLines:{value:this.linesTex},uZoneTex:{value:this.zoneTex},uOverlay:{value:this.overlay},uHover:{value:0},uFocus:{value:0},uFocusK:{value:0},uMokuColors:{value:cM.map(m=>new Dt(m))},uWindVec:{value:new Ut(1,0)}}};const a=this.params.get("falls");this.wailele=a==="0"?null:Yv(e,{carve:a!=="flat"}),this.terrain=new k1(o,this.shared),this.scene.add(this.terrain.group),this.shadow=new ax(this.terrain.heightTex),this.shared.uniforms.uShadow.value=this.shadow.texture;const r=lM(o);this.seaTex=r.tex,this.seaData=r.data,this.ocean=new U1(this.shared,this.terrain.heightTex,r.tex),this.scene.add(this.ocean.mesh),this.sky=new nx,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.weather=new xx(o.height1024,le);const[l,c]=e.meta.cloudSizes;this.clouds=new gx({shape:o.cloudShape,shapeSize:l,detail:o.cloudDetail,detailSize:c}),this.clouds.uniforms.uWeather.value=this.weather.texture,this.clouds.uniforms.uWeatherRect.value=this.weather.rect,this.clouds.uniforms.uShadow.value=this.shadow.texture,this.clouds.uniforms.uHeight.value=this.terrain.heightTex,this.shared.uniforms.uWeather.value=this.weather.texture,this.shared.uniforms.uWeatherRect.value=this.weather.rect,this.pipeline.atmosphere=this.clouds,this.features=new uv(this),this.scene.add(this.features.group),this.vegetation=new Mv(this),this.scene.add(this.vegetation.group),this.life=new Vv(this),this.scene.add(this.life.group),this.streams=new Zx(this),this.scene.add(this.streams.mesh),this.wailele&&(this.waterfalls=new aM(this,this.wailele),this.scene.add(this.waterfalls.group)),this.flash={t:-10,next:0,pos:new W,k:0},this.rig=new sx(this.camera,t,this.terrain),this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??9.2),speed:Number(this.params.get("speed")??60)},this.season=this.clock.doy>120&&this.clock.doy<300?"kau":"hooilo",this.params.get("weather")&&this.weather.setMode(this.params.get("weather")),this.sky.update(this.clock.doy,this.clock.hour,0,this.light),this.weather.warm(6,this.light.sunDir.y,this.clock.hour,this.season),this.time=0,this.frames=0,this.updaters=[];const h=n.getContext(),f=h.getExtension("WEBGL_debug_renderer_info"),u=f?String(h.getParameter(f.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(u),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}applyQuality(){var e;const t=[{clouds:.25,steps:26,light:2,range:12,dpr:1},{clouds:.33,steps:34,light:2,range:16,dpr:1.25},{clouds:.42,steps:44,light:3,range:19,dpr:1.5},{clouds:.5,steps:56,light:4,range:22,dpr:2}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.clouds.setScale(t.clouds),this.clouds.uniforms.uSteps.value=t.steps,this.clouds.uniforms.uLightSteps.value=t.light,this.terrain.setRange(t.range),(e=this.waterfalls)==null||e.setQuality(this.quality.level),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}lightning(){const t=this.weather,e=this.flash,n=t.stormiest;n&&(t.regime==="kona"?n.strength>.35:n.strength>.9)&&this.time>e.next&&this.clock.speed>0&&(e.t=this.time,e.pos.set(n.x+(Math.random()-.5)*8,t.base+(t.top-t.base)*(.3+Math.random()*.4),n.z+(Math.random()-.5)*8),e.next=this.time+1.5+Math.random()*(t.regime==="kona"?5:14));const o=this.time-e.t;e.k=o<.6?Math.exp(-o*9)*(.7+.3*Math.sin(o*70))+(o>.12&&o<.22?.6:0):0,this.clouds.uniforms.uFlash.value=e.k,this.clouds.uniforms.uFlashPos.value.copy(e.pos),e.k>0&&this.light.skyColor.offsetHSL(0,0,0).add(new Dt(.25,.27,.35).multiplyScalar(e.k))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.shadow.update(this.renderer,this.light.sunDir),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){var l;const e=this.clock;e.hour+=t*e.speed/3600,e.hour>=24&&(e.hour-=24,e.doy=(e.doy+1)%365),this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t),this.terrain.update(this.camera),this.ocean.update(this.camera,t),this.vegetation.update(this.camera),this.weather.step(t*e.speed,this.light.sunDir.y,e.hour,this.season),this.life.update(t,this.time),this.streams.update(),(l=this.waterfalls)==null||l.update(t),this.lightning();for(const c of this.updaters)c(t,this.time);const n=this.light,i=this.weather,o=this.clouds.uniforms;o.uSunDir.value.copy(n.sunDir),o.uSunColor.value.copy(n.sunColor),o.uSkyColor.value.copy(n.skyColor),o.uGroundColor.value.copy(n.groundColor),o.uFogColor.value.copy(n.horizon),o.uMoonDir.value.copy(n.moonDir),o.uMoonColor.value.copy(n.moonColor),o.uWind.value.copy(i.windOffset),o.uWindDir.value.copy(i.wind),o.uTime.value=this.time,o.uBase.value=i.base,o.uTop.value=i.top;const a=Math.max(0,Math.min(1,(i.state.humidity-1.1)/.3));if(o.uOvercast.value=a,o.uFarCover.value=.32+a*.4,a>0){const c=1-a*.65;n.sunColor.multiplyScalar(c);const h=(n.skyColor.r+n.skyColor.g+n.skyColor.b)/3;n.skyColor.lerp(new Dt(h,h,h*1.04),a*.5).multiplyScalar(1-a*.25)}this.shared.uniforms.uCloudShadowK.value=2.6,this.shared.uniforms.uCloudMidY.value=(i.base+i.top)*.5,this.shared.uniforms.uCloudWind.value.copy(i.windOffset),this.shared.uniforms.uCloudWindDir.value.copy(i.wind),this.shared.uniforms.uFarCover.value=o.uFarCover.value,this.ocean.uniforms.uWind.value.set(i.wind.x/9,i.wind.y/9),this.shared.uniforms.uWindVec.value.set(i.wind.x/9,i.wind.y/9);const r=this.pipeline.uniforms;r.uSunDir.value.copy(n.sunDir),r.uSunColor.value.copy(n.sunHorizon),r.uFogColor.value.copy(n.horizon),r.uExposure.value=.55*(1+2.2*Math.pow(n.night,1.5)),r.uNight.value=n.night,this.sky.group.position.copy(this.camera.position)}}const fM=[{id:"island",icon:"island",title:"Ka Mokupuni",gloss:"the island",text:["A high island raised by two volcanoes and carved by rain. Land is divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili traditionally worked by extended families.","This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones do."]},{id:"rain",icon:"rain",title:"Ka Ua",gloss:"the rain",text:["Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.","So one side of an island is lush and the other dry. Hawaiians have names for hundreds of winds and rains, each belonging to a place. Wai, fresh water, is life — and waiwai, wealth, is water doubled."]},{id:"ahupuaa",icon:"ahupuaa",title:"Ahupuaʻa",gloss:"from the mountain to the sea",zone:null,text:["An ahupuaʻa runs from the uplands to the sea, usually bounded by ridges, so its people have forest, fresh water, farmland, shore and reef within one boundary.","A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.","The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki."]},{id:"akua",icon:"akua",title:"Wao Akua",gloss:"realm of the gods",zone:0,text:["The cloud-wrapped heights are left largely to the gods. People once came only for special purposes — feathers, choice woods, stone for adzes — and with care.","Yet this is the source: mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream."]},{id:"nahele",icon:"nahele",title:"Wao Nahele",gloss:"the forest",zone:1,text:["Below the clouds grow koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.","Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go."]},{id:"loi",icon:"loi",title:"Loʻi Kalo",gloss:"irrigated taro terraces",zone:2,text:["Kalo (taro) is the staff of life, cooked and pounded into poi. Terraces step down the valley floor, fed by an ʻauwai — a ditch that takes part of the stream at a dam and returns it below. The water has to keep moving: cool, flowing water keeps the kalo healthy.","In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo is caring for family."]},{id:"kauhale",icon:"kauhale",title:"Kauhale",gloss:"the family compound",zone:4,text:["A home here is a cluster of hale, each with its purpose: the hale noa, where the family sleeps; the mua, an eating house for men with the family shrine; a separate eating house for women; a house for beating kapa; a canoe house.","Under the ʻai kapu, men and women ate apart. Houses are framed in hardwood, lashed with cordage and thatched with pili grass, on a raised stone paepae."]},{id:"heiau",icon:"heiau",title:"Heiau",gloss:"temple",zone:4,text:["Heiau range from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief. Others are dedicated to Lono for rain and harvests, or to healing and fishing.","On the platform stand the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings."]},{id:"kahakai",icon:"kahakai",title:"Kahakai",gloss:"the shore",zone:4,text:["Most people live near the shore, where the stream meets the sea. Canoes, each hull carved from a single log and steadied by an ama float, are kept out of the sun in a hālau waʻa.","On flat rocks and clay pans, seawater evaporates into paʻakai — salt — for preserving fish."]},{id:"loko",icon:"loko",title:"Loko Iʻa",gloss:"fishpond",zone:5,text:["The most advanced traditional fishponds in the Pacific are Hawaiian. A curved wall of stacked stone, the kuapā, encloses part of the reef flat near a stream mouth, where fresh water mixes with salt.","In the wall are mākāhā — sluice gates of wooden grates. Young fish slip in with the tide, fatten on algae, and grow too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) are raised here."]},{id:"koa",icon:"koa",title:"Koʻa",gloss:"fishing shrine",zone:5,text:["Fishermen build koʻa, stone shrines on the shore, and offer the first fish of a catch to the fishing gods. Offshore fishing grounds are also called koʻa, found by lining up landmarks on land.","Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out."]},{id:"surf",icon:"surf",title:"Heʻe Nalu",gloss:"wave sliding",zone:5,text:["Surfing has always belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.","Each break has its name. The best were sometimes kapu to all but the aliʻi."]},{id:"kula",icon:"kula",title:"Kula",gloss:"the dry plains",zone:3,text:["Where rain is too scarce for loʻi, families farm the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).","Long low walls run across the slopes to break the wind and hold soil and moisture. The great leeward field systems cover tens of square kilometres."]},{id:"ahu",icon:"ahu",title:"Ahu · Makahiki",gloss:"the boundary altar · the season of Lono",zone:4,text:["Where the trail around the island crosses into each ahupuaʻa stands an ahu, a stone altar. When Makaliʻi — the Pleiades — rises at dusk in late autumn, the Makahiki begins: four months honoring Lono, god of rain and growth.","Under chiefly rule, Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden."]},{id:"puuhonua",icon:"puuhonua",title:"Puʻuhonua",gloss:"place of refuge",zone:4,text:["Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.","In wartime, defeated warriors and those who could not fight also found safety there."]},{id:"holua",icon:"holua",title:"Hōlua",gloss:"sledding course",zone:3,text:["During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.","The track is paved with stones and laid with slick grass or leaves; the longest runs for more than a kilometre."]},{id:"malama",icon:"malama",title:"Mālama ʻĀina",gloss:"care for the land",text:["An ahupuaʻa works when each part cares for the next: protected forests make water, water feeds loʻi and fishponds, and people tend it all.","Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles."]}],ta={moae:{name:"Moaʻe",gloss:"trade winds"},kona:{name:"Kona",gloss:"southerly storm"},malie:{name:"Mālie",gloss:"calm"},auto:{name:"Auto",gloss:"let the weather change"}},Tr={kau:{name:"Kau",gloss:"the dry season"},hooilo:{name:"Hoʻoilo",gloss:"the wet season"}},dM={island:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',rain:'<path d="M7 14.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',ahupuaa:'<path d="M12 3.5 4.5 19.5h15z"/><path d="M12 7c-1.2 2.6 1 4.4 0 7s1.2 3 .3 5.5"/><path d="M3 21c2 0 2-.8 4.5-.8S9.5 21 12 21s2-.8 4.5-.8 2 .8 4.5.8"/>',akua:'<path d="M3 19.5l6-9 3 4 2-3 7 8z"/><path d="M8.2 7.5a2.6 2.6 0 0 1 5-1.3A2.2 2.2 0 1 1 15.5 9.6H8.8a1.1 1.1 0 0 1-.6-2.1z"/>',nahele:'<path d="M12 21v-6"/><path d="M12 15c-4.2 0-6.3-2.1-6.3-5a4 4 0 0 1 3-3.9 3.3 3.3 0 0 1 6.6 0 4 4 0 0 1 3 3.9c0 2.9-2.1 5-6.3 5z"/>',loi:'<path d="M12 21v-4.5"/><path d="M12 16.5c-5 0-8-3-8-7 0-2.2 1.2-4 3.2-4 2 0 3 1.8 4.8 1.8s2.8-1.8 4.8-1.8c2 0 3.2 1.8 3.2 4 0 4-3 7-8 7z"/><path d="M12 7.3v9"/>',kauhale:'<path d="M2.5 20.5h19"/><path d="M5 20.5 12 5l7 15.5"/><path d="M10.4 20.5v-4h3.2v4"/>',heiau:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',kahakai:'<path d="M3 14.5h18l-2.2 3.2H5.2z"/><path d="M6 11h12"/><path d="M8.5 11v3.5M15.5 11v3.5"/><path d="M3 20.5c2 0 2-.8 4.5-.8s2 .8 4.5.8 2-.8 4.5-.8 2 .8 4.5.8"/>',loko:'<path d="M3.5 12c3-4.2 9-5 12.5 0-3.5 5-9.5 4.2-12.5 0z"/><path d="M16 12l5-3.2v6.4z"/><circle cx="7.2" cy="11.2" r=".9" fill="currentColor"/><path d="M3 20c3-2 15-2 18 0"/>',koa:'<path d="M6.5 20.5h11"/><ellipse cx="12" cy="17.8" rx="4.3" ry="2"/><ellipse cx="12" cy="13.8" rx="3.2" ry="1.8"/><path d="M12 12V5.2a2.1 2.1 0 1 1 3.1 1.9"/>',surf:'<path d="M2.5 17c3.2 0 4.2-8.5 9.5-8.5 3 0 4.2 2 4.2 4.2-1.2-.2-3.2-.6-4 1.4 3 0 5.6 1 7.8 2.9"/><path d="M2.5 20.5h19"/>',kula:'<path d="M2.5 18.5c2-3 4.5-3 6.5 0M9 18.5c2-3 4.5-3 6.5 0M15.5 18.5c1.6-2.4 4-3 6 0"/><path d="M2.5 21h19"/><path d="M5.8 14.5v-3M12.2 14.5v-4M18.6 14.5v-3"/>',ahu:'<path d="M7.5 20.5h9l-1.2-3.2H8.7z"/><path d="M9.3 17.3l.6-3h4.2l.6 3"/><path d="M10.4 14.3l.6-2.3h2l.6 2.3"/><path d="M18 3.5l.7 1.6 1.6.7-1.6.7L18 8.1l-.7-1.6-1.6-.7 1.6-.7z"/>',puuhonua:'<path d="M2.5 20h19"/><path d="M3 20v-6.5h9.5V20"/><path d="M3 16.2h9.5"/><path d="M14 20l3.6-7.5L21.2 20"/>',holua:'<path d="M3 5.5l18 13.5"/><path d="M7.8 7.6l3.6 2.7"/><path d="M6.6 10.4l5.3 4"/><circle cx="9.6" cy="6.2" r="1.2"/>',malama:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',zones:'<path d="M3 6h18M3 10.5h18M3 15h18M3 19.5h18"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',moae:'<path d="M3 8.5h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16.5h8"/>',kona:'<path d="M7 13.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M12.5 13.5 10 18h3.5l-2 3.5"/>',malie:'<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1"/><path d="M9.5 18.5a3.5 3.5 0 1 1 .7-6.9 4.3 4.3 0 0 1 8.3 2 2.6 2.6 0 0 1-.4 4.9z"/>',auto:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/>',kau:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',hooilo:'<path d="M7 13a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M9 16.5v3M13 16.5v3M17 16.5v3"/>',speed1:'<path d="M8 5.5v13l9-6.5z"/>',speed2:'<path d="M4.5 5.5v13l7.5-6.5zM12 5.5v13l7.5-6.5z"/>',speed3:'<path d="M3 6v12l6-6zM9.5 6v12l6-6zM16 6v12l6-6z"/>',wind:'<path d="M12 3l4 8h-3v10h-2V11H8z" fill="currentColor" stroke="none"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',tour:'<path d="M4 19c4-1 4-6 8-7s5-6 8-7"/><circle cx="4" cy="19" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="20" cy="5" r="1.4" fill="currentColor"/>'};function Te(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${dM[s]||""}</svg>`}const Bn=(s,t)=>Math.atan2(s,t);function pM(s){const t=s.island.meta,e=t.sites,n=s.terrain,i=t.ahupuaa.find(z=>z.id===e.model)||t.ahupuaa[0],[o,a]=i.mouth;let r=i.topX-o,l=i.topZ-a;const c=Math.hypot(r,l)||1;r/=c,l/=c;const h=Bn(-r,-l),f=Bn(r,l),u=(z,O)=>new W(z,Math.max(0,n.heightAt(z,O)),O),m=i.trunk||[],v=z=>{if(!m.length)return[o+r*c*z,a+l*c*z];const O=m[Math.min(m.length-1,Math.floor(z*(m.length-1)))];return[O[0],O[1]]},g=z=>{let O=m[0];for(const k of m)Math.abs(k[2]-z)<Math.abs(O[2]-z)&&(O=k);return O?[O[0],O[1]]:v(.6)},x=e.villages.find(z=>z.model)||e.villages[0],p=e.loi.find(z=>z.model)||e.loi[0],d=e.heiau.find(z=>z.model)||e.heiau[0],M=e.ponds.find(z=>z.model)||e.ponds[0],_=e.canoes.find(z=>z.village===i.id)||e.canoes[0],S=e.koa.find(z=>z.id===i.id)||e.koa[0],w=z=>Math.min(...e.ponds.map(O=>Math.hypot(O.cx-z.x,O.cz-z.z)),99),A=[...e.surf].sort((z,O)=>Math.hypot(z.x-o,z.z-a)-Math.max(0,8-w(z))*20-(Math.hypot(O.x-o,O.z-a)-Math.max(0,8-w(O))*20))[0],y=e.alii||x,E=[...t.ahu].filter(z=>z.a===i.id||z.b===i.id).sort((z,O)=>Math.hypot(z.x-o,z.z-a)-Math.hypot(O.x-o,O.z-a))[0]||t.ahu[0],[R,P]=t.center,N=(()=>{const z=s.island.data.region,O=Math.sqrt(z.length/4);let k=null,q=-1;for(let K=0;K<O;K+=4)for(let L=0;L<O;L+=4)if(z[(K*O+L)*4+3]>q){let G=0;for(let $=-8;$<=8;$+=4)for(let Q=-8;Q<=8;Q+=4)G+=z[(Math.min(O-1,Math.max(0,K+$))*O+Math.min(O-1,Math.max(0,L+Q)))*4+3];G>q&&(q=G,k=[((L+.5)/O-.5)*360,((K+.5)/O-.5)*360])}return k||[y.x,y.z-10]})(),T={};let C=[];T.island={target:u(R+10,P+4),distance:330,yaw:.28,pitch:.78,overlay:[.55,0,.6,0],hour:9.5};{const z=o-r*4,O=a-l*4,[k,q]=Cr(Xr.moae.bearing),K=[];for(const[L,B]of[[24,3],[48,-4]]){const G=z-k*L-q*B,$=O-q*L+k*B;K.push([G,$]);for(let Q=0;Q<6;Q++){const st=Q*Math.PI/3;K.push([G+Math.cos(st)*6,$+Math.sin(st)*6])}}T.rain={target:u(z,O),distance:24,yaw:f,pitch:.1,hour:16.5,weather:"moae",boost:!0,overlay:[0,0,0,0],lookUp:.35,showers:K}}{const[z,O]=v(.45);T.ahupuaa={target:u(z,O),distance:92,yaw:h+.25,pitch:.55,focus:i.id,overlay:[1,.85,.4,.6],hour:11}}{const[z,O]=g(260);T.akua={target:u(z,O),distance:26,yaw:h+.15,pitch:.1,hour:8.2,overlay:[0,0,0,0],lookUp:.55},C=s.waterfalls?wM(s,n,z,O):[]}{const[z,O]=g(520);T.nahele={target:u(z,O),distance:9,yaw:h+.9,pitch:.55,hour:9.5,overlay:[0,0,0,0]}}if(p){let z=p.paddies[0].c,O=-1;for(const k of p.paddies){let q=0;for(const K of p.paddies)Math.hypot(K.c[0]-k.c[0],K.c[1]-k.c[1])<1.6&&q++;q>O&&(O=q,z=k.c)}T.loi={target:u(z[0],z[1]),distance:4.4,yaw:h-.5,pitch:.72,hour:10.2,overlay:[0,0,0,0]}}if(T.kauhale={target:u(x.x,x.z),distance:3.2,yaw:h+.9,pitch:.55,hour:8.8,overlay:[0,0,0,0]},d&&(T.heiau={target:u(d.x,d.z),distance:2.1,yaw:d.rot+2.2,pitch:.42,hour:11.5,overlay:[0,0,0,0]}),_){const z=Math.cos(_.dir),O=Math.sin(_.dir);T.kahakai={target:u(_.x,_.z),distance:2,yaw:Bn(z,O)+.7,pitch:.28,hour:15.8,overlay:[0,0,0,0]}}if(M&&(T.loko={target:u(M.cx+M.ax*M.r*.4,M.cz+M.az*M.r*.4),distance:6,yaw:Bn(M.ax,M.az)+.6,pitch:.5,hour:13,overlay:[0,0,0,0]}),S){const z=_||{dir:0};T.koa={target:u(S.x,S.z),distance:1.8,yaw:Bn(-Math.cos(z.dir),-Math.sin(z.dir))+.3,pitch:.2,hour:6.9,overlay:[0,0,0,0],lookUp:.25}}const I=A&&s.life?s.life.breakNear(A.x,A.z):null;if(I){const z=Math.floor(I.n*.5),O=I.nx[z]*.8+I.tx[z]*.65,k=I.nz[z]*.8+I.tz[z]*.65,q=Math.hypot(O,k),K=new W(I.x[z]+I.nx[z]*.08+k/q*.2,.04,I.z[z]+I.nz[z]*.08-O/q*.2),L=Bn(O,k);T.surf={target:K,distance:1,yaw:L,pitch:.13,hour:O>0?9.4:15.6,overlay:[0,0,0,0],orbit:[L-.3,L+.3]}}else A&&(T.surf={target:u(A.x,A.z),distance:1.3,yaw:Bn(Math.cos(A.dir+.9),Math.sin(A.dir+.9)),pitch:.12,hour:14.5,overlay:[0,0,0,0]});if(T.kula={target:u(N[0],N[1]),distance:11,yaw:.9,pitch:.42,hour:9,overlay:[0,0,0,0]},E){let z=0,O=-1/0;for(let k=0;k<24;k++){const q=k/24*Math.PI*2,K=n.heightAt(E.x+Math.sin(q)*2.2,E.z+Math.cos(q)*2.2);K>O&&(O=K,z=q)}T.ahu={target:u(E.x,E.z),distance:2,yaw:z,pitch:.3,hour:18.2,doy:318,overlay:[0,0,0,.8],lookUp:.6,ahu:E}}if(e.puuhonua){const z=e.puuhonua;T.puuhonua={target:u(z.x-Math.cos(z.dir)*.8,z.z-Math.sin(z.dir)*.8),distance:3.4,yaw:Bn(Math.cos(z.dir+.9),Math.sin(z.dir+.9)),pitch:.42,hour:15,overlay:[0,0,0,0]}}if(e.holua){const z=e.holua,O=z.x1-z.x0,k=z.z1-z.z0,q=Math.hypot(O,k)||1,K=u(z.x1-O/q*.42,z.z1-k/q*.42);K.y+=.03;const L=Bn(O/q,k/q)-.45;T.holua={target:K,distance:1.05,yaw:L,pitch:.4,hour:16,overlay:[0,0,0,0],orbit:[L-.3,L+.3]};const B=u(z.x1-O/q*.5,z.z1-k/q*.5);B.y+=.02,Iu(T.holua,B)}T.malama={target:u(R,P),distance:300,yaw:2.5,pitch:.5,hour:17.4,overlay:[.6,0,.5,0]};for(const z of Object.values(T))mM(z,n);if(C.length){const z=CM(s,n,T,C);z&&(T.akua=z.view,s.waterfalls.setHero(z.h,z.info))}s.waterfalls&&RM(s,T.nahele);const H={akua:[i.topX,i.topZ],nahele:g(520),loi:T.loi?[T.loi.target.x,T.loi.target.z]:null,kauhale:[x.x,x.z],heiau:d?[d.x,d.z]:null,kahakai:_?[_.x,_.z]:null,loko:M?[M.cx+M.ax*M.r*.5,M.cz+M.az*M.r*.5]:null,koa:S?[S.x,S.z]:null,surf:A?[A.x,A.z]:null,kula:N,ahu:E?[E.x,E.z]:null,puuhonua:e.puuhonua?[e.puuhonua.x,e.puuhonua.z]:null,holua:e.holua?[(e.holua.x0+e.holua.x1)/2,(e.holua.z0+e.holua.z1)/2]:null};return{views:T,anchors:H,model:i}}function mM(s,t){for(let e=0;e<8;e++){const n=Math.cos(s.pitch),i=new W(s.target.x+s.distance*n*Math.sin(s.yaw),s.target.y+s.distance*Math.sin(s.pitch),s.target.z+s.distance*n*Math.cos(s.yaw));let o=!1;for(let a=1;a<24;a++){const r=a/24,l=i.x+(s.target.x-i.x)*r,c=i.y+(s.target.y-i.y)*r,h=i.z+(s.target.z-i.z)*r;if(Math.max(0,t.heightAt(l,h))>c-.03){o=!0;break}}if(!o)return;s.pitch=Math.min(1.3,s.pitch+.07)}}const gM=[.1,.14,.18,.22,.26,.3,.34],xM=[.6,.7,.8,.9,1,1.12,1.25,1.4],Kn=.05,xa=41,Kr=Math.tan(21*Math.PI/180),ul=650*Gt,vM=.33,fl=1.47,dl=s=>(t,e)=>Math.max(0,s.heightAt(t,e)),pl=(s,t,e)=>{const n=Math.min(1,Math.max(0,(e-s)/(t-s)));return n*n*(3-2*n)};function MM(s,t,e,n,i,o,a,r=a){for(let l=1;l<o;l++){const c=l/o,h=t.x+(e-t.x)*c,f=t.z+(i-t.z)*c,u=t.y+(n-t.y)*c,m=Math.hypot(e-h,i-f)>1?r:a;if(s(h,f)>u-m)return!1}return!0}const Ts=(s,t,e,n,i)=>s.set(t.x+n*Math.cos(i)*Math.sin(e),t.y+n*Math.sin(i),t.z+n*Math.cos(i)*Math.cos(e)),_M=s=>.12+.03*s+.05;function Ar(s,t,e){const n=Math.hypot(e.x-t.x,e.z-t.z),i=Math.max(16,Math.ceil(n/.25));for(let o=1;o<i;o++){const a=o/i,r=(1-a)*n,l=.03+vM*pl(.4,1.2,r)+(a*n<1?.08:0);if(s(t.x+(e.x-t.x)*a,t.z+(e.z-t.z)*a)>t.y+(e.y-t.y)*a-l)return!1}return!0}function Fu(s,t,e,n,i,o,a){return t.y>a||t.y<s(t.x,t.z)+_M(n)||!MM(s,t,e.x,e.y,e.z,24,.03)?!1:Ar(s,t,e)&&Ar(s,t,o)&&Ar(s,t,i.lip)}function Rh(s,t,e,n,i,o,a,r){const l=new W,c=new Uint8Array(xa);for(let h=0;h<xa;h++)c[h]=Fu(s,Ts(l,e,i+(h-20)*Kn,o,a),e,o,t,n,r)?1:0;return c}function Ph(s,t){if(!s||!s[t])return null;let e=t,n=t;for(;e>0&&s[e-1];)e--;for(;n<xa-1&&s[n+1];)n++;return[(e-t)*Kn,(n-t)*Kn]}const yM=s=>{const t=s.lip.y-s.base.y;return new W(s.base.x+(s.lip.x-s.base.x)*.55,s.base.y+t*.55,s.base.z+(s.lip.z-s.base.z)*.55)};function wM(s,t,e,n){const i=[];return s.waterfalls.heroes.forEach((o,a)=>{const l=.5*Math.min(1,o.per*.5+.6*pl(3e3,8e3,o.rain))-(a===0?0:.004*Math.hypot(o.lip.x-e,o.lip.z-n));for(const c of bM(s,t,o))c.score+=l,i.push(c)}),i.sort((o,a)=>a.score-o.score).slice(0,60)}function bM(s,t,e){const n=dl(t),i=Math.atan2(e.face[0],e.face[1]),o=new W(e.pool.x,n(e.pool.x,e.pool.z),e.pool.z),a=e.lip.y-e.base.y,r=yM(e),l=ul-.6,c=(d,M)=>{const _=d.x+e.face[0]*.08,S=d.z+e.face[1]*.08;for(let w=.1;w<30;w+=.08)if(n(_+M.x*w,S+M.z*w)>d.y+M.y*w)return!1;return!0},h=[],f={};for(let d=7.4;d<=10.61;d+=.2){const M=mu(s.clock.doy,d,f).sun.clone();M.y<.12||h.push({hr:d,sun:M,front:M.x*e.face[0]+M.z*e.face[1],lit:c(r,M),litPool:c(o,M),litLip:c(e.lip,M)})}if(!h.length)return[];const u=a/Math.tan(12*Math.PI/180),m=new W,v=new W,g=new W,x=new W,p=[];for(const d of xM){const M=d*u;for(const _ of gM){const S=Rh(n,e,o,r,i,M,_,l);if(!S.some(b=>b))continue;const w=Rh(n,e,o,r,i,M*fl,_,l);for(let b=0;b<xa;b++){const A=Ph(S,b);if(!A||A[1]-A[0]<.25)continue;const y=Ph(w,b),E=(b-20)*Kn,R=i+E;Ts(m,o,R,M,_);const P=n(m.x,m.z);v.subVectors(e.lip,m).normalize(),g.subVectors(e.base,m).normalize();const N=Math.acos(Math.min(1,v.dot(g)))*180/Math.PI;x.subVectors(e.mist,m).normalize();const T=A[1]-A[0],C=-.04*Math.abs(N-13)-.08*Math.max(0,10.5-N)-.6*Math.max(0,.12-_)-.4*Math.max(0,_-.3)-.25*Math.abs(E)-.35*Math.max(0,1-(m.y-P))+.3*Math.min(.8,T)-(y?.3*Math.max(0,.4-(y[1]-y[0])):.25);let I=-1/0,H=8.2;for(const{hr:z,sun:O,front:k,lit:q,litPool:K,litLip:L}of h){const B=Math.acos(Math.max(-1,Math.min(1,-x.dot(O))))*180/Math.PI,G=(q?Math.max(0,k)+.3:0)+.12*K+.08*L-.6*Math.max(0,.38-O.y)+.15*pl(.45,.8,O.y)-(q&&k>.35?.01*Math.min(20,Math.abs(B-41.5)):0);G>I&&(I=G,H=z)}p.push({h:e,score:C+I,hour:H,yaw:R,dist:M,pitch:_,arc:A,arcP:y,tgt:o,mid:r})}}}return p}function SM(s,t,e){const n=new W().subVectors(e,t).normalize(),i=new W().crossVectors(n,new W(0,1,0)).normalize(),o=new W().crossVectors(i,n),a=new W,r=new W;let l=0;const c=[-.7,-.35,0,.3];for(const h of c){a.copy(n).addScaledVector(i,h*Kr*1.6).addScaledVector(o,.75*Kr).normalize();let f=!1;for(let u=.3;u<15&&(r.copy(t).addScaledVector(a,u),!(r.y>ul));u+=.15+u*.02)if(r.y<s(r.x,r.z)){f=!0;break}f||l++}return l/c.length}function Lh(s,t,e,n,i){if(!n)return!0;const o=new W;for(let a=n[0];a<=n[1]+1e-6;a+=Kn)if(!Fu(s,Ts(o,e,t.yaw+a,i,t.pitch),e,i,t.h,t.mid,ul-.6))return!1;return!0}function EM(s,t){const e=dl(s),n=new W(Math.cos(t.yaw),0,-Math.sin(t.yaw));let i=t.tgt;for(const r of[.08,.05,.025]){const l=t.tgt.clone().addScaledVector(n,r*t.dist);if(l.y=e(l.x,l.z),!(Math.abs(l.y-t.tgt.y)>=.4)&&!(!Lh(e,t,l,t.arc,t.dist)||!Lh(e,t,l,t.arcP,t.dist*fl))){i=l;break}}const o=Math.min(.6,Math.max(0,(t.mid.y-i.y)/(.45*t.dist))),a={target:i,distance:t.dist,yaw:t.yaw,pitch:t.pitch,hour:Math.round(t.hour*10)/10,lookUp:o,weather:"moae",spate:1,overlay:[0,0,0,0]};return a.orbit=[t.yaw+t.arc[0],t.yaw+t.arc[1]],t.arcP&&(a.orbitPortrait=[t.yaw+t.arcP[0],t.yaw+t.arcP[1]]),Iu(a,t.mid),a}function Iu(s,t){const e=s.lookUp,n=Math.cos(s.pitch),i=o=>{const a=s.distance*Math.sqrt(1/o),r=s.target.x+a*n*Math.sin(s.yaw),l=s.target.y+a*Math.sin(s.pitch),c=s.target.z+a*n*Math.cos(s.yaw),h=Math.atan2(t.y-l,Math.hypot(t.x-r,t.z-c))-Math.atan(.42*Kr);return(l+a*n*Math.tan(h)-s.target.y)/(.45*a)};Object.defineProperty(s,"lookUp",{enumerable:!0,get:()=>{const o=typeof innerWidth=="number"?innerWidth/Math.max(1,innerHeight):1.6;return o<1?i(o):e}})}function TM(s,t,e,n,i){const o=Object.create(Object.getPrototypeOf(s.rig)),a=()=>({target:e.target.clone(),distance:e.distance,yaw:e.yaw+i,pitch:e.pitch,lift:e.lookUp||0});Object.assign(o,{camera:new Qe(42,1.6,.1,9e3),terrain:t,state:a(),goal:a(),flight:null,floor:0,autoOrbit:0,lastInput:-1e12,_v:new W,_prevXZ:null}),o.apply(0);for(let v=0;v<30;v++)o.update(1/60);const r=o.floor,l=o.goal.target.distanceTo(n.target),c=Math.min(6,2.2+Math.sqrt(l)*.22+Math.abs(Math.log(n.distance/o.goal.distance))*.35);o.flyTo({target:n.target,distance:n.distance,yaw:n.yaw,pitch:n.pitch,lift:n.lookUp||0},c),o.autoOrbit=n.distance<60?.012:.02;let h=r,f=0,u=o.camera.position.y,m=u;for(let v=Math.round((c+1.5)*60);v>0;v--){o.update(1/60),o.floor>h&&(h=o.floor);const g=o.camera.position.y;f=Math.max(f,Math.abs(g-2*m+u)*3600),u=m,m=g}return{lift:h-r,acc:f}}function AM(s,t,e,n){if(!s.rig)return{acc:0,accNext:0};const i=[e.nahele,e.ahupuaa].filter(Boolean);let o=0,a=0;const r=(l,c,h)=>{const f=TM(s,t,l,c,h);return f.lift>.005?!1:(o=Math.max(o,f.acc),(l===e.nahele||c===e.nahele)&&(a=Math.max(a,f.acc)),!0)};for(const l of i)if(!r(l,n,.048)||!r(l,n,.6)||!r(n,l,0))return null;for(const l of[0,1]){const c=l===0?Kn:-Kn;let h=n.orbit[l]-n.yaw;for(;Math.abs(h)>1e-6&&!i.every(f=>r(n,f,h));)h=Math.abs(h)<=Kn+1e-6?0:h+c;n.orbit[l]=n.yaw+h}return n.orbit[1]-n.orbit[0]<.1?null:(n.orbitPortrait&&(n.orbitPortrait=[Math.max(n.orbitPortrait[0],n.orbit[0]),Math.min(n.orbitPortrait[1],n.orbit[1])]),{acc:o,accNext:a})}function CM(s,t,e,n){const i=dl(t),o=new W,a=new W;for(const m of n)Ts(o,m.tgt,m.yaw,m.dist,m.pitch),a.set(m.tgt.x,m.mid.y,m.tgt.z),m.open=SM(i,o,a),m.score+=.2*m.open;n.sort((m,v)=>v.score-m.score);let r=null;for(const m of n){if(r&&m.score<=r.final)break;const v=EM(t,m),g=AM(s,t,e,v);if(!g)continue;const x=m.score-.004*Math.max(0,g.acc-60)-.003*Math.max(0,g.accNext-15);(!r||x>r.final)&&(r={c:m,v,final:x,acc:g.acc,accNext:g.accNext})}if(!r)return null;const{c:l,v:c}=r,h=l.h;for(const[m,v]of[[c.orbit,c.distance],[c.orbitPortrait,c.distance*fl]])if(m)for(let g=m[0];g<=m[1]+1e-6;g+=Kn)s.waterfalls.clearSight(Ts(o,c.target,g,v,c.pitch).clone(),[h.pool,l.mid,h.lip]);const f=m=>Math.round(m*100)/100,u=m=>m&&m.map(v=>f(v-c.yaw));return{view:c,h,info:{score:f(r.final),open:l.open,arc:u(c.orbit),arcP:u(c.orbitPortrait),acc:Math.round(r.acc),accNext:Math.round(r.accNext)}}}function RM(s,t){if(!t)return;const e=new Qe(42,1.6,.1,9e3);Ts(e.position,t.target,t.yaw,t.distance,t.pitch);const n=new W,i=new W;for(let o=t.lookUp||0;o<=.3+1e-6;o+=.05){e.lookAt(t.target.x,t.target.y+o*t.distance*.45,t.target.z),e.updateMatrixWorld();let a=!1;for(const r of s.waterfalls.heroes)n.copy(r.lip).project(e),i.copy(r.base).project(e),i.z<1&&Math.abs(i.x)<.9&&Math.abs(i.y)<.9&&n.y>.88&&(a=!0);if(!a){o>0&&(t.lookUp=o);return}}}const Ge=(s,t=document)=>t.querySelector(s),we=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,o]of Object.entries(t))i==="class"?n.className=o:i.startsWith("on")?n.addEventListener(i.slice(2),o):n.setAttribute(i,o);return e&&(n.innerHTML=e),n},PM=s=>{const t=Math.floor(s),e=Math.floor((s-t)*60);return`${t}:${String(e).padStart(2,"0")}`},LM=s=>s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;class kM{constructor(t){this.app=t,this.meta=t.island.meta;const e=pM(t);this.views=e.views,this.anchors=e.anchors,this.model=e.model,this.stops=fM.filter(n=>this.views[n.id]),this.mode="tour",this.index=-1,this.playing=!1,this.arrivedAt=0,this.overlayGoal=new pe(0,0,0,0),this.focusGoal=0,this.layer={lines:!1,zones:!1,pins:!0},this.timeTween=null,this.counts=this.countFeatures(),this.build(),this.bind(),t.updaters.push(n=>this.update(n))}countFeatures(){const t=this.meta.sites,e={},n=(i,o,a=1)=>{e[i]=e[i]||{loi:0,hale:0,heiau:0,loko:0,koa:0},e[i][o]+=a};for(const i of t.loi)n(i.id,"loi",i.paddies.length);for(const i of t.houses)n(i.village,"hale");for(const i of t.heiau)n(i.id,"heiau");for(const i of t.ponds)n(i.id,"loko");for(const i of t.koa)n(i.id,"koa");return e}build(){const t=we("div",{id:"ui"});document.body.appendChild(t),this.root=t,t.appendChild(we("div",{class:"brand"},`<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${Te("akua",14)}<span></span>${Te("loko",14)}</div>`)),this.modeEl=we("div",{class:"modes"}),this.modeEl.append(we("button",{class:"mode on","data-mode":"tour",title:"Guided tour","aria-label":"Guided tour"},`${Te("tour",18)}<span>Tour</span>`),we("button",{class:"mode","data-mode":"explore",title:"Explore freely","aria-label":"Explore freely"},`${Te("explore",18)}<span>Explore</span>`)),t.appendChild(this.modeEl),this.tools=we("div",{class:"tools"});const e=(a,r,l)=>we("button",{class:"tool","data-tool":a,title:l,"aria-label":l},Te(r,20));this.tools.append(e("lines","lines","Ahupuaʻa boundaries"),e("zones","zones","Zones, mountain to sea"),e("pins","pins","Places"),e("help","help","About"),e("full","expand","Full screen")),t.appendChild(this.tools),this.legend=we("div",{class:"legend"}),hh.forEach((a,r)=>this.legend.appendChild(we("div",{class:"lg"},`<i style="background:${lo[r]}"></i><b>${a.name}</b><em>${a.gloss}</em>`))),t.appendChild(this.legend),this.card=we("section",{class:"card","aria-live":"polite"}),t.appendChild(this.card),this.rail=we("nav",{class:"rail","aria-label":"Tour stops"}),this.playBtn=we("button",{class:"play",title:"Play the tour","aria-label":"Play the tour"},Te("play",18)),this.rail.appendChild(this.playBtn),this.dots=this.stops.map((a,r)=>{const l=we("button",{class:"dot",title:a.title,"aria-label":a.title,"data-i":r},Te(a.icon,18));return this.rail.appendChild(l),l}),this.progress=we("div",{class:"rail-progress"},"<span></span>"),this.rail.appendChild(this.progress),t.appendChild(this.rail),this.markerLayer=we("div",{class:"markers"}),t.appendChild(this.markerLayer),this.markers=this.stops.filter(a=>this.anchors[a.id]).map(a=>{const r=we("button",{class:"marker",title:a.title,"aria-label":a.title},`${Te(a.icon,18)}<span>${a.title}</span>`);r.addEventListener("click",h=>{h.stopPropagation(),this.openStop(this.stops.indexOf(a),{fly:!0,explore:!0})}),this.markerLayer.appendChild(r);const[l,c]=this.anchors[a.id];return{el:r,stop:a,pos:new W(l,0,c),vis:0}});for(const a of this.markers)a.pos.y=Math.max(0,this.app.terrain.heightAt(a.pos.x,a.pos.z))+.05;this.inspector=we("div",{class:"inspector"}),t.appendChild(this.inspector),this.dock=we("div",{class:"dock"}),this.dock.innerHTML=`
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
      <div class="wind" title="Wind"><span class="wind-arrow">${Te("wind",22)}</span><span class="wind-speed"></span></div>`,t.appendChild(this.dock);const n=Ge(".regimes",this.dock);for(const a of["auto","moae","kona","malie"])n.appendChild(we("button",{class:"chip","data-regime":a,title:`${ta[a].name} — ${ta[a].gloss}`,"aria-label":ta[a].name},Te(a,18)));const i=Ge(".seasons",this.dock);for(const a of["kau","hooilo"])i.appendChild(we("button",{class:"chip","data-season":a,title:`${Tr[a].name} — ${Tr[a].gloss}`,"aria-label":Tr[a].name},Te(a,18)));const o=Ge(".speeds",this.dock);for(const[a,r,l]of[["0",0,"pause"],["1",30,"speed1"],["2",240,"speed2"],["3",1800,"speed3"]])o.appendChild(we("button",{class:"chip","data-speed":r,title:r?`${r}× time`:"Pause time","aria-label":r?`${r} times speed`:"Pause"},Te(l,16)));this.help=we("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${Te("close",18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`,t.appendChild(this.help)}bind(){this.modeEl.addEventListener("click",r=>{const l=r.target.closest("[data-mode]");l&&this.setMode(l.dataset.mode)}),this.tools.addEventListener("click",r=>{var h,f,u;const l=r.target.closest("[data-tool]");if(!l)return;const c=l.dataset.tool;c==="help"?this.help.classList.toggle("hidden"):c==="full"?document.fullscreenElement?(h=document.exitFullscreen)==null||h.call(document):(u=(f=document.documentElement).requestFullscreen)==null||u.call(f).catch(()=>{}):(this.layer[c]=!this.layer[c],this.applyLayers())}),this.help.addEventListener("click",r=>{(r.target===this.help||r.target.closest(".help-close"))&&this.help.classList.add("hidden")}),this.rail.addEventListener("click",r=>{const l=r.target.closest(".dot");l&&(this.setMode("tour",!1),this.goto(Number(l.dataset.i)))}),this.playBtn.addEventListener("click",()=>this.setPlaying(!this.playing)),this.dock.addEventListener("click",r=>{const l=r.target.closest("[data-regime]"),c=r.target.closest("[data-season]"),h=r.target.closest("[data-speed]");l&&this.app.weather.setMode(l.dataset.regime),c&&this.setSeason(c.dataset.season),h&&(this.app.clock.speed=Number(h.dataset.speed)),this.refreshDock()});const t=Ge(".dial-svg",this.dock);let e=!1;const n=r=>{const l=t.getBoundingClientRect(),c=(r.clientX-l.left)/l.width*120,h=(r.clientY-l.top)/l.height*64;let f=Math.atan2(58-h,c-60);f<0&&(f=f<-Math.PI/2?Math.PI:0);const u=6+(Math.PI-f)/Math.PI*12;this.timeTween=null,this.app.clock.hour=u};t.addEventListener("pointerdown",r=>{e=!0,t.setPointerCapture(r.pointerId),n(r)}),t.addEventListener("pointermove",r=>e&&n(r)),t.addEventListener("pointerup",()=>e=!1);const i=this.app.canvas;let o=null;i.addEventListener("pointerdown",r=>o={x:r.clientX,y:r.clientY,t:performance.now()}),i.addEventListener("pointerup",r=>{if(!o)return;Math.hypot(r.clientX-o.x,r.clientY-o.y)<5&&performance.now()-o.t<400&&this.pick(r.clientX,r.clientY),o=null});let a=0;i.addEventListener("pointermove",r=>{if(r.buttons||r.pointerType==="touch")return;const l=performance.now();l-a<60||(a=l,this.hover(r.clientX,r.clientY))}),i.addEventListener("pointerleave",()=>this.hover(null)),addEventListener("keydown",r=>{r.key==="ArrowRight"&&!r.shiftKey&&this.mode==="tour"?(r.preventDefault(),this.goto(this.index+1)):r.key==="ArrowLeft"&&!r.shiftKey&&this.mode==="tour"?(r.preventDefault(),this.goto(this.index-1)):r.key==="Escape"?this.help.classList.contains("hidden")?this.closeCard():this.help.classList.add("hidden"):r.key===" "&&this.mode==="tour"&&r.target===document.body&&(r.preventDefault(),this.setPlaying(!this.playing))}),this.app.rig.onUserInput=()=>{this.playing&&this.setPlaying(!1)}}setMode(t,e=!0){if(this.mode===t&&e){t==="tour"&&this.index<0&&this.goto(0);return}this.mode=t;for(const n of this.modeEl.querySelectorAll(".mode"))n.classList.toggle("on",n.dataset.mode===t);this.root.classList.toggle("exploring",t==="explore"),t==="explore"?(this.setPlaying(!1),this.closeCard(),this.focusGoal=0,this.app.rig.autoOrbit=0,this.app.clock.speed=Math.max(this.app.clock.speed,30),this.applyLayers()):e&&this.goto(Math.max(0,this.index))}applyLayers(){for(const t of this.tools.querySelectorAll("[data-tool]")){const e=t.dataset.tool;e in this.layer&&t.classList.toggle("on",this.layer[e])}this.legend.classList.toggle("show",this.layer.zones),this.markerLayer.classList.toggle("hidden",!this.layer.pins||this.mode!=="explore"),this.mode==="explore"&&this.overlayGoal.set(this.layer.lines?1:0,this.layer.zones?1:0,this.layer.lines?.5:0,this.layer.lines?.8:.35)}setSeason(t){const e=this.app.clock;e.doy=t==="kau"?172:355,this.app.season=t,this.refreshDock()}setPlaying(t){this.playing=t,this.playBtn.innerHTML=Te(t?"pause":"play",18),this.playBtn.classList.toggle("on",t),t&&this.mode!=="tour"&&this.setMode("tour"),t&&(this.arrivedAt=performance.now())}goto(t){if(t<0||t>=this.stops.length){t>=this.stops.length&&this.setPlaying(!1);return}this.openStop(t,{fly:!0,explore:!1})}openStop(t,{fly:e,explore:n}){this.index=t;const i=this.stops[t],o=this.views[i.id];if(this.dots.forEach((u,m)=>{u.classList.toggle("on",m===t),u.classList.toggle("done",m<t)}),this.renderCard(i,n),!o)return;const a=this.app.rig,r=a.goal.target.distanceTo(o.target),l=Math.min(6,2.2+Math.sqrt(r)*.22+Math.abs(Math.log(o.distance/a.goal.distance))*.35),c=innerWidth/Math.max(1,innerHeight),h=o.distance*(c<1?Math.pow(1/c,o.distance>40?1:.5):1);e&&a.flyTo({target:o.target,distance:h,yaw:o.yaw,pitch:o.pitch,lift:o.lookUp||0},l,{onDone:()=>this.arrivedAt=performance.now()}),this.arrivedAt=performance.now()+l*1e3,a.autoOrbit=o.distance<60?.012:.02;const f=this.app.clock;if(o.doy!==void 0&&Math.abs(o.doy-f.doy)>2?f.doy=o.doy:o.doy===void 0&&this.lastDoy!==void 0&&f.doy!==this.lastDoy&&(f.doy=this.lastDoy),o.doy===void 0&&(this.lastDoy=f.doy),o.hour!==void 0){let u=o.hour-f.hour;u<-12&&(u+=24),u>12&&(u-=24),this.timeTween={from:f.hour,by:u,t:0,dur:l}}if(f.speed=20,o.weather&&this.app.weather.setMode(o.weather),this.app.weather.boost=o.boost?1:0,o.showers)for(const[u,m]of o.showers)this.app.weather.spawnShower(u,m,5+Math.random()*3,.7);if(o.ahu&&this.app.life&&this.app.life.walkTo(o.ahu.x,o.ahu.z),!n){const u=o.overlay||[0,0,0,0];this.overlayGoal.set(u[0],u[1],u[2],u[3]),this.focusGoal=o.focus||0}}renderCard(t,e){var o,a,r,l;const n=t.zone!==void 0&&t.zone!==null?hh[t.zone]:null,i=this.stops.length;this.card.innerHTML=`
      <header>
        <div class="card-icon">${Te(t.icon,26)}</div>
        <div class="card-titles"><h1>${t.title}</h1><p class="gloss">${t.gloss}</p></div>
        <button class="card-close" aria-label="Close">${Te("close",18)}</button>
      </header>
      ${n?`<div class="zone-chip"><i style="background:${lo[t.zone]}"></i>${n.name}<em>${n.gloss}</em></div>`:""}
      <div class="card-body">${t.text.map(c=>`<p>${c}</p>`).join("")}</div>
      ${e?"":`<footer>
        <button class="nav prev" aria-label="Previous" ${this.index===0?"disabled":""}>${Te("prev",18)}</button>
        <span class="count">${this.index+1} / ${i}</span>
        ${this.index===i-1?`<button class="nav finish" aria-label="Explore">${Te("explore",18)}<span>Explore</span></button>`:`<button class="nav next" aria-label="Next">${Te("next",18)}</button>`}
      </footer>`}`,this.card.classList.add("show"),this.card.scrollTop=0,(o=Ge(".prev",this.card))==null||o.addEventListener("click",()=>this.goto(this.index-1)),(a=Ge(".next",this.card))==null||a.addEventListener("click",()=>this.goto(this.index+1)),(r=Ge(".finish",this.card))==null||r.addEventListener("click",()=>this.setMode("explore")),(l=Ge(".card-close",this.card))==null||l.addEventListener("click",()=>this.closeCard())}closeCard(){this.card.classList.remove("show")}regionAt(t,e){const n=this.app.island.data.region,i=le,o=Math.floor((t+ut)/qt*i),a=Math.floor((e+ut)/qt*i);return o<0||a<0||o>=i||a>=i?0:n[(a*i+o)*4]}hover(t,e){if(t===null||this.mode!=="explore"){this.app.shared.uniforms.uHover.value=0,this.pinned||this.inspector.classList.remove("show");return}const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(this.app.shared.uniforms.uHover.value=i,!this.pinned){if(!i){this.inspector.classList.remove("show");return}this.showInspector(i,t,e)}}pick(t,e){if(this.mode!=="explore")return;const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(!i||i===this.focusGoal){this.focusGoal=0,this.pinned=!1,this.inspector.classList.remove("show","pinned");return}this.focusGoal=i,this.pinned=!0,this.showInspector(i,t,e,!0)}showInspector(t,e,n,i=!1){const o=this.meta.ahupuaa.find(c=>c.id===t);if(!o)return;if(this.inspectorId!==t){this.inspectorId=t;const c=Ox[o.moku],h=this.counts[t]||{},f=(u,m)=>m?`<span class="st">${Te(u,15)}${m}</span>`:"";this.inspector.innerHTML=`
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${o.moku+1})"></i>${c.name}<em>${c.gloss}</em></span></div>
        ${DM(o.profile)}
        <div class="in-stats"><span class="st">${o.area.toFixed(1)} km²</span><span class="st">${Te("akua",15)}${Math.round(o.top)} m</span>${f("loi",h.loi)}${f("kauhale",h.hale)}${f("heiau",h.heiau)}${f("loko",h.loko)}${f("koa",h.koa)}</div>`}this.inspector.classList.add("show"),this.inspector.classList.toggle("pinned",i);const a=innerWidth,r=Math.min(a-300,e+18),l=Math.max(70,Math.min(innerHeight-220,n+18));this.inspector.style.transform=`translate(${r}px, ${l}px)`}update(t){const e=this.app,n=e.shared.uniforms,i=1-Math.exp(-t*3);if(e.overlay.lerp(this.overlayGoal,i),this.focusGoal?(n.uFocus.value=this.focusGoal,n.uFocusK.value+=(1-n.uFocusK.value)*i):(n.uFocusK.value+=(0-n.uFocusK.value)*i,n.uFocusK.value<.01&&(n.uFocus.value=0)),this.timeTween){const o=this.timeTween;o.t=Math.min(1,o.t+t/o.dur),e.clock.hour=((o.from+o.by*LM(o.t))%24+24)%24,o.t>=1&&(this.timeTween=null)}if(this.playing&&this.mode==="tour"&&!e.rig.flight){const a=this.stops[this.index].text.join(" ").split(/\s+/).length,r=Math.max(9,a*.32)*1e3,l=performance.now()-this.arrivedAt;Ge("span",this.progress).style.width=`${Math.min(100,l/r*100)}%`,l>r&&(this.index<this.stops.length-1?this.goto(this.index+1):this.setPlaying(!1))}else Ge("span",this.progress).style.width="0%";this.updateMarkers(),this.frameN=(this.frameN||0)+1,this.frameN%6===0&&this.refreshDock()}updateMarkers(){if(this.mode!=="explore"||!this.layer.pins)return;const t=this.app.camera,e=innerWidth,n=innerHeight,i=new W,o=[],a=this.markers.map(r=>({m:r,d:t.position.distanceTo(r.pos)})).sort((r,l)=>r.d-l.d);for(const{m:r,d:l}of a){i.copy(r.pos).project(t);const c=i.z>1,h=(i.x+1)/2*e,f=(1-i.y)/2*n;let u=!c&&h>-40&&h<e+40&&f>60&&f<n+40&&l<420;u&&o.some(m=>Math.abs(m[0]-h)<44&&Math.abs(m[1]-f)<40)&&(u=!1),u&&o.push([h,f]),r.el.style.opacity=u?String(Math.min(1,(420-l)/120)):"0",r.el.style.pointerEvents=u?"auto":"none",u&&(r.el.style.transform=`translate(${h}px, ${f}px)`),r.el.classList.toggle("near",l<40)}}refreshDock(){const t=this.app,e=t.clock,n=t.light,i=Ge(".dial-body",this.dock),o=(e.hour-6)/12,a=e.hour<6||e.hour>18;let r;if(!a)r=Math.PI-o*Math.PI;else{const x=(e.hour-18+24)%24/12;r=Math.PI-x*Math.PI}const l=60+Math.cos(r)*52,c=58-Math.sin(r)*52;i.setAttribute("transform",`translate(${l.toFixed(1)} ${c.toFixed(1)})`),i.classList.toggle("moon",a),Ge(".dial-time",this.dock).textContent=PM(e.hour);const h=X1[t.sky.astro.night]||"",f=Ge(".dial-night",this.dock);f.textContent=n.night>.5?`Pō ${h}`:"",f.title="The night of the Hawaiian lunar month";for(const x of this.dock.querySelectorAll("[data-regime]"))x.classList.toggle("on",t.weather.mode===x.dataset.regime);const u=e.doy>120&&e.doy<305?"kau":"hooilo";t.season=u;for(const x of this.dock.querySelectorAll("[data-season]"))x.classList.toggle("on",u===x.dataset.season);for(const x of this.dock.querySelectorAll("[data-speed]"))x.classList.toggle("on",Number(x.dataset.speed)===e.speed||e.speed===20&&x.dataset.speed==="30");const m=t.weather.wind,v=Math.atan2(m.x,-m.y)*180/Math.PI;Ge(".wind-arrow",this.dock).style.transform=`rotate(${v.toFixed(0)}deg)`,Ge(".wind-speed",this.dock).textContent=`${Math.round(m.length()*3.6)} km/h`;const g=ta[t.weather.regime];Ge(".wind",this.dock).title=`${g.name} — ${g.gloss}`}start(){this.setMode("tour",!1),this.applyLayers(),this.goto(0)}}function DM(s){if(!s||s.length<2)return"";const t=260,e=78,n=s[s.length-1][0],i=Math.max(...s.map(u=>u[1]),200),o=Math.min(...s.map(u=>u[1]),-30),a=(e-14)/(i-o),r=u=>t-u/n*(t-4)-2,l=u=>e-6-(u-o)*a,c=l(0);let h="";for(let u=0;u<s.length-1;u++){const m=s[u],v=s[u+1];h+=`<path d="M${r(m[0]).toFixed(1)} ${c.toFixed(1)}L${r(m[0]).toFixed(1)} ${l(m[1]).toFixed(1)}L${r(v[0]).toFixed(1)} ${l(v[1]).toFixed(1)}L${r(v[0]).toFixed(1)} ${c.toFixed(1)}Z" fill="${lo[m[2]]}" stroke="${lo[m[2]]}" stroke-width=".6"/>`}const f=s.map((u,m)=>`${m?"L":"M"}${r(u[0]).toFixed(1)} ${l(u[1]).toFixed(1)}`).join("");return`<svg class="profile" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none">
    <rect x="0" y="${c.toFixed(1)}" width="${t}" height="${(e-c).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${h}
    <path d="${f}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${t}" y1="${c.toFixed(1)}" y2="${c.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`}const va=document.getElementById("boot"),zM=va.querySelector(".boot-bar span"),Uu=va.querySelector(".boot-stage"),FM={shape:["raising the shields",.02,.1],erode:["the rain carves valleys",.1,.42],valleys:["filling the valley floors",.42,.55],coast:["growing the reef",.55,.7],divide:["tracing the ridgelines",.66,.7],detail:["shaping the ridges",.7,.8],people:["the people arrive",.8,.86],light:["reading the light",.86,.94],sky:["gathering clouds",.94,.99],done:["",1,1]};function IM(s){return new Promise((t,e)=>{const n=new Worker(new URL(""+new URL("worker-DYvwdHJS.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=i=>{const o=i.data;if(o.type==="progress"){const a=FM[o.stage];if(!a)return;Uu.textContent=a[0],zM.style.width=`${(a[1]+(a[2]-a[1])*o.p)*100}%`}else o.type==="done"?(n.terminate(),t({data:o.data,meta:o.meta})):o.type==="error"&&(n.terminate(),e(new Error(o.message)))},n.onerror=i=>e(i),n.postMessage({seed:s})})}async function UM(){const s=performance.now(),t=await IM(Bu);console.log(`island generated in ${((performance.now()-s)/1e3).toFixed(1)} s`);const e=new uM(document.getElementById("scene"),t),n=new kM(e);window.__app=e,e.ui=n;let i=0;const o=()=>{if(++i<4)return requestAnimationFrame(o);va.classList.add("gone"),setTimeout(()=>va.remove(),1200),new URLSearchParams(location.search).has("cam")||n.start()};requestAnimationFrame(o)}UM().catch(s=>{console.error(s),Uu.textContent="something went wrong — see the console"});
