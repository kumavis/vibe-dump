(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const Vt=360,ht=Vt/2,lo=.01,C0=1.3,qt=lo*C0,bn=2048,le=1024,R0=20261004,k0=62;function Pa(s){const t=(s+180)*Math.PI/180;return[Math.sin(t),-Math.cos(t)]}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cl="160",P0=0,jl=1,L0=2,gu=1,z0=2,Kn=3,oi=0,en=1,ln=2,Mi=0,Ls=1,sl=2,Yl=3,$l=4,D0=5,Ii=100,F0=101,I0=102,Kl=103,Zl=104,U0=200,N0=201,O0=202,B0=203,ol=204,al=205,H0=206,G0=207,W0=208,V0=209,q0=210,X0=211,j0=212,Y0=213,$0=214,K0=0,Z0=1,J0=2,La=3,Q0=4,tf=5,ef=6,nf=7,xu=0,sf=1,of=2,_i=0,af=1,rf=2,lf=3,cf=4,hf=5,uf=6,vu=300,Is=301,Us=302,rl=303,ll=304,Va=306,Gi=1e3,cn=1001,cl=1002,Se=1003,Jl=1004,sr=1005,ve=1006,ff=1007,Wi=1008,xn=1009,df=1010,pf=1011,Rl=1012,Mu=1013,ei=1014,In=1015,ai=1016,_u=1017,wu=1018,Ni=1020,mf=1021,Ke=1023,gf=1024,xf=1025,Oi=1026,Ns=1027,zs=1028,yu=1029,vf=1030,bu=1031,Su=1033,or=33776,ar=33777,rr=33778,lr=33779,Ql=35840,tc=35841,ec=35842,nc=35843,Eu=36196,ic=37492,sc=37496,oc=37808,ac=37809,rc=37810,lc=37811,cc=37812,hc=37813,uc=37814,fc=37815,dc=37816,pc=37817,mc=37818,gc=37819,xc=37820,vc=37821,cr=36492,Mc=36494,_c=36495,Mf=36283,wc=36284,yc=36285,bc=36286,Au=3e3,Bi=3001,_f=3200,wf=3201,yf=0,bf=1,Sn="",Ge="srgb",ri="srgb-linear",kl="display-p3",qa="display-p3-linear",za="linear",ye="srgb",Da="rec709",Fa="p3",Qi=7680,Sc=519,Sf=512,Ef=513,Af=514,Tu=515,Tf=516,Cf=517,Rf=518,kf=519,Ec=35044,vi=35048,Ac="300 es",hl=1035,ni=2e3,Ia=2001;class Hs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const o=i.indexOf(e);o!==-1&&i.splice(o,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let o=0,a=i.length;o<a;o++)i[o].call(this,t);t.target=null}}}const Xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Tc=1234567;const po=Math.PI/180,_o=180/Math.PI;function Gs(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Xe[s&255]+Xe[s>>8&255]+Xe[s>>16&255]+Xe[s>>24&255]+"-"+Xe[t&255]+Xe[t>>8&255]+"-"+Xe[t>>16&15|64]+Xe[t>>24&255]+"-"+Xe[e&63|128]+Xe[e>>8&255]+"-"+Xe[e>>16&255]+Xe[e>>24&255]+Xe[n&255]+Xe[n>>8&255]+Xe[n>>16&255]+Xe[n>>24&255]).toLowerCase()}function $e(s,t,e){return Math.max(t,Math.min(e,s))}function Pl(s,t){return(s%t+t)%t}function Pf(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Lf(s,t,e){return s!==t?(e-s)/(t-s):0}function mo(s,t,e){return(1-e)*s+e*t}function zf(s,t,e,n){return mo(s,t,1-Math.exp(-e*n))}function Df(s,t=1){return t-Math.abs(Pl(s,t*2)-t)}function Ff(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function If(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Uf(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Nf(s,t){return s+Math.random()*(t-s)}function Of(s){return s*(.5-Math.random())}function Bf(s){s!==void 0&&(Tc=s);let t=Tc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Hf(s){return s*po}function Gf(s){return s*_o}function ul(s){return(s&s-1)===0&&s!==0}function Wf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Ua(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Vf(s,t,e,n,i){const o=Math.cos,a=Math.sin,r=o(e/2),l=a(e/2),c=o((t+n)/2),h=a((t+n)/2),u=o((t-n)/2),f=a((t-n)/2),d=o((n-t)/2),v=a((n-t)/2);switch(i){case"XYX":s.set(r*h,l*u,l*f,r*c);break;case"YZY":s.set(l*f,r*h,l*u,r*c);break;case"ZXZ":s.set(l*u,l*f,r*h,r*c);break;case"XZX":s.set(r*h,l*v,l*d,r*c);break;case"YXY":s.set(l*d,r*h,l*v,r*c);break;case"ZYZ":s.set(l*v,l*d,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function bs(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Qe(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Hn={DEG2RAD:po,RAD2DEG:_o,generateUUID:Gs,clamp:$e,euclideanModulo:Pl,mapLinear:Pf,inverseLerp:Lf,lerp:mo,damp:zf,pingpong:Df,smoothstep:Ff,smootherstep:If,randInt:Uf,randFloat:Nf,randFloatSpread:Of,seededRandom:Bf,degToRad:Hf,radToDeg:Gf,isPowerOfTwo:ul,ceilPowerOfTwo:Wf,floorPowerOfTwo:Ua,setQuaternionFromProperEuler:Vf,normalize:Qe,denormalize:bs};class Ot{constructor(t=0,e=0){Ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*n-a*i+t.x,this.y=o*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qt{constructor(t,e,n,i,o,a,r,l,c){Qt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,l,c)}set(t,e,n,i,o,a,r,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=r,h[3]=e,h[4]=o,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],d=n[5],v=n[8],g=i[0],x=i[3],p=i[6],m=i[1],M=i[4],_=i[7],E=i[2],y=i[5],w=i[8];return o[0]=a*g+r*m+l*E,o[3]=a*x+r*M+l*y,o[6]=a*p+r*_+l*w,o[1]=c*g+h*m+u*E,o[4]=c*x+h*M+u*y,o[7]=c*p+h*_+u*w,o[2]=f*g+d*m+v*E,o[5]=f*x+d*M+v*y,o[8]=f*p+d*_+v*w,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*r*c-n*o*h+n*r*l+i*o*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=h*a-r*c,f=r*l-h*o,d=c*o-a*l,v=e*u+n*f+i*d;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/v;return t[0]=u*g,t[1]=(i*c-h*n)*g,t[2]=(r*n-i*a)*g,t[3]=f*g,t[4]=(h*e-i*l)*g,t[5]=(i*o-r*e)*g,t[6]=d*g,t[7]=(n*l-c*e)*g,t[8]=(a*e-n*o)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,o,a,r){const l=Math.cos(o),c=Math.sin(o);return this.set(n*l,n*c,-n*(l*a+c*r)+a+t,-i*c,i*l,-i*(-c*a+l*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(hr.makeScale(t,e)),this}rotate(t){return this.premultiply(hr.makeRotation(-t)),this}translate(t,e){return this.premultiply(hr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const hr=new Qt;function Cu(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Na(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function qf(){const s=Na("canvas");return s.style.display="block",s}const Cc={};function go(s){s in Cc||(Cc[s]=!0,console.warn(s))}const Rc=new Qt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),kc=new Qt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Fo={[ri]:{transfer:za,primaries:Da,toReference:s=>s,fromReference:s=>s},[Ge]:{transfer:ye,primaries:Da,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[qa]:{transfer:za,primaries:Fa,toReference:s=>s.applyMatrix3(kc),fromReference:s=>s.applyMatrix3(Rc)},[kl]:{transfer:ye,primaries:Fa,toReference:s=>s.convertSRGBToLinear().applyMatrix3(kc),fromReference:s=>s.applyMatrix3(Rc).convertLinearToSRGB()}},Xf=new Set([ri,qa]),de={enabled:!0,_workingColorSpace:ri,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Xf.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=Fo[t].toReference,i=Fo[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Fo[s].primaries},getTransfer:function(s){return s===Sn?za:Fo[s].transfer}};function Ds(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ur(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ts;class Ru{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ts===void 0&&(ts=Na("canvas")),ts.width=t.width,ts.height=t.height;const n=ts.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ts}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Na("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),o=i.data;for(let a=0;a<o.length;a++)o[a]=Ds(o[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ds(e[n]/255)*255):e[n]=Ds(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let jf=0;class ku{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=Gs(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let a=0,r=i.length;a<r;a++)i[a].isDataTexture?o.push(fr(i[a].image)):o.push(fr(i[a]))}else o=fr(i);n.url=o}return e||(t.images[this.uuid]=n),n}}function fr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Ru.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Yf=0;class hn extends Hs{constructor(t=hn.DEFAULT_IMAGE,e=hn.DEFAULT_MAPPING,n=cn,i=cn,o=ve,a=Wi,r=Ke,l=xn,c=hn.DEFAULT_ANISOTROPY,h=Sn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=Gs(),this.name="",this.source=new ku(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=a,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Ot(0,0),this.repeat=new Ot(1,1),this.center=new Ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Qt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(go("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Bi?Ge:Sn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==vu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Gi:t.x=t.x-Math.floor(t.x);break;case cn:t.x=t.x<0?0:1;break;case cl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Gi:t.y=t.y-Math.floor(t.y);break;case cn:t.y=t.y<0?0:1;break;case cl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return go("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Ge?Bi:Au}set encoding(t){go("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Bi?Ge:Sn}}hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=vu;hn.DEFAULT_ANISOTROPY=1;class _e{constructor(t=0,e=0,n=0,i=1){_e.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*o,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*o,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*o,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*o,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,o;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],d=l[5],v=l[9],g=l[2],x=l[6],p=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-g)<.01&&Math.abs(v-x)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+g)<.1&&Math.abs(v+x)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,_=(d+1)/2,E=(p+1)/2,y=(h+f)/4,w=(u+g)/4,A=(v+x)/4;return M>_&&M>E?M<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(M),i=y/n,o=w/n):_>E?_<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(_),n=y/i,o=A/i):E<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(E),n=w/o,i=A/o),this.set(n,i,o,e),this}let m=Math.sqrt((x-v)*(x-v)+(u-g)*(u-g)+(f-h)*(f-h));return Math.abs(m)<.001&&(m=1),this.x=(x-v)/m,this.y=(u-g)/m,this.z=(f-h)/m,this.w=Math.acos((c+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class $f extends Hs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new _e(0,0,t,e),this.scissorTest=!1,this.viewport=new _e(0,0,t,e);const i={width:t,height:e,depth:1};n.encoding!==void 0&&(go("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Bi?Ge:Sn),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ve,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new hn(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new ku(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class vn extends $f{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Pu extends hn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Se,this.minFilter=Se,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fl extends hn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Se,this.minFilter=Se,this.wrapR=cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Kf extends vn{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGLMultipleRenderTargets=!0;const o=this.texture;this.texture=[];for(let a=0;a<n;a++)this.texture[a]=o.clone(),this.texture[a].isRenderTargetTexture=!0}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,o=this.texture.length;i<o;i++)this.texture[i].image.width=t,this.texture[i].image.height=e,this.texture[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}copy(t){this.dispose(),this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.texture.length=0;for(let e=0,n=t.texture.length;e<n;e++)this.texture[e]=t.texture[e].clone(),this.texture[e].isRenderTargetTexture=!0;return this}}class ji{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,o,a,r){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const f=o[a+0],d=o[a+1],v=o[a+2],g=o[a+3];if(r===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=f,t[e+1]=d,t[e+2]=v,t[e+3]=g;return}if(u!==g||l!==f||c!==d||h!==v){let x=1-r;const p=l*f+c*d+h*v+u*g,m=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const E=Math.sqrt(M),y=Math.atan2(E,p*m);x=Math.sin(x*y)/E,r=Math.sin(r*y)/E}const _=r*m;if(l=l*x+f*_,c=c*x+d*_,h=h*x+v*_,u=u*x+g*_,x===1-r){const E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,o,a){const r=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=o[a],f=o[a+1],d=o[a+2],v=o[a+3];return t[e]=r*v+h*u+l*d-c*f,t[e+1]=l*v+h*f+c*u-r*d,t[e+2]=c*v+h*d+r*f-l*u,t[e+3]=h*v-r*u-l*f-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,o=t._z,a=t._order,r=Math.cos,l=Math.sin,c=r(n/2),h=r(i/2),u=r(o/2),f=l(n/2),d=l(i/2),v=l(o/2);switch(a){case"XYZ":this._x=f*h*u+c*d*v,this._y=c*d*u-f*h*v,this._z=c*h*v+f*d*u,this._w=c*h*u-f*d*v;break;case"YXZ":this._x=f*h*u+c*d*v,this._y=c*d*u-f*h*v,this._z=c*h*v-f*d*u,this._w=c*h*u+f*d*v;break;case"ZXY":this._x=f*h*u-c*d*v,this._y=c*d*u+f*h*v,this._z=c*h*v+f*d*u,this._w=c*h*u-f*d*v;break;case"ZYX":this._x=f*h*u-c*d*v,this._y=c*d*u+f*h*v,this._z=c*h*v-f*d*u,this._w=c*h*u+f*d*v;break;case"YZX":this._x=f*h*u+c*d*v,this._y=c*d*u+f*h*v,this._z=c*h*v-f*d*u,this._w=c*h*u-f*d*v;break;case"XZY":this._x=f*h*u-c*d*v,this._y=c*d*u-f*h*v,this._z=c*h*v+f*d*u,this._w=c*h*u+f*d*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],o=e[8],a=e[1],r=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+r+u;if(f>0){const d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-l)*d,this._y=(o-c)*d,this._z=(a-i)*d}else if(n>r&&n>u){const d=2*Math.sqrt(1+n-r-u);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(o+c)/d}else if(r>u){const d=2*Math.sqrt(1+r-n-u);this._w=(o-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+u-n-r);this._w=(a-i)/d,this._x=(o+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs($e(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,o=t._z,a=t._w,r=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*r+i*c-o*l,this._y=i*h+a*l+o*r-n*c,this._z=o*h+a*c+n*l-i*r,this._w=a*h-n*r-i*l-o*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,o=this._z,a=this._w;let r=a*t._w+n*t._x+i*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=n,this._y=i,this._z=o,this;const l=1-r*r;if(l<=Number.EPSILON){const d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*o+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(o),n*Math.cos(o),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class q{constructor(t=0,e=0,n=0){q.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Pc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Pc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*i,this.y=o[1]*e+o[4]*n+o[7]*i,this.z=o[2]*e+o[5]*n+o[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,o=t.elements,a=1/(o[3]*e+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*i+o[12])*a,this.y=(o[1]*e+o[5]*n+o[9]*i+o[13])*a,this.z=(o[2]*e+o[6]*n+o[10]*i+o[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,o=t.x,a=t.y,r=t.z,l=t.w,c=2*(a*i-r*n),h=2*(r*e-o*i),u=2*(o*n-a*e);return this.x=e+l*c+a*u-r*h,this.y=n+l*h+r*c-o*u,this.z=i+l*u+o*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i,this.y=o[1]*e+o[5]*n+o[9]*i,this.z=o[2]*e+o[6]*n+o[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,o=t.z,a=e.x,r=e.y,l=e.z;return this.x=i*l-o*r,this.y=o*a-n*l,this.z=n*r-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return dr.copy(this).projectOnVector(t),this.sub(dr)}reflect(t){return this.sub(dr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos($e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const dr=new q,Pc=new ji;class li{constructor(t=new q(1/0,1/0,1/0),e=new q(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Rn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Rn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Rn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,Rn):Rn.fromBufferAttribute(o,a),Rn.applyMatrix4(t.matrixWorld),this.expandByPoint(Rn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Io.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Io.copy(n.boundingBox)),Io.applyMatrix4(t.matrixWorld),this.union(Io)}const i=t.children;for(let o=0,a=i.length;o<a;o++)this.expandByObject(i[o],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Rn),Rn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(js),Uo.subVectors(this.max,js),es.subVectors(t.a,js),ns.subVectors(t.b,js),is.subVectors(t.c,js),ui.subVectors(ns,es),fi.subVectors(is,ns),Ei.subVectors(es,is);let e=[0,-ui.z,ui.y,0,-fi.z,fi.y,0,-Ei.z,Ei.y,ui.z,0,-ui.x,fi.z,0,-fi.x,Ei.z,0,-Ei.x,-ui.y,ui.x,0,-fi.y,fi.x,0,-Ei.y,Ei.x,0];return!pr(e,es,ns,is,Uo)||(e=[1,0,0,0,1,0,0,0,1],!pr(e,es,ns,is,Uo))?!1:(No.crossVectors(ui,fi),e=[No.x,No.y,No.z],pr(e,es,ns,is,Uo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Rn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Rn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Vn=[new q,new q,new q,new q,new q,new q,new q,new q],Rn=new q,Io=new li,es=new q,ns=new q,is=new q,ui=new q,fi=new q,Ei=new q,js=new q,Uo=new q,No=new q,Ai=new q;function pr(s,t,e,n,i){for(let o=0,a=s.length-3;o<=a;o+=3){Ai.fromArray(s,o);const r=i.x*Math.abs(Ai.x)+i.y*Math.abs(Ai.y)+i.z*Math.abs(Ai.z),l=t.dot(Ai),c=e.dot(Ai),h=n.dot(Ai);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Zf=new li,Ys=new q,mr=new q;class Yi{constructor(t=new q,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Zf.setFromPoints(t).getCenter(n);let i=0;for(let o=0,a=t.length;o<a;o++)i=Math.max(i,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ys.subVectors(t,this.center);const e=Ys.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ys,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(mr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ys.copy(t.center).add(mr)),this.expandByPoint(Ys.copy(t.center).sub(mr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qn=new q,gr=new q,Oo=new q,di=new q,xr=new q,Bo=new q,vr=new q;class Ll{constructor(t=new q,e=new q(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,qn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=qn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(qn.copy(this.origin).addScaledVector(this.direction,e),qn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){gr.copy(t).add(e).multiplyScalar(.5),Oo.copy(e).sub(t).normalize(),di.copy(this.origin).sub(gr);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Oo),r=di.dot(this.direction),l=-di.dot(Oo),c=di.lengthSq(),h=Math.abs(1-a*a);let u,f,d,v;if(h>0)if(u=a*l-r,f=a*r-l,v=o*h,u>=0)if(f>=-v)if(f<=v){const g=1/h;u*=g,f*=g,d=u*(u+a*f+2*r)+f*(a*u+f+2*l)+c}else f=o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*l)+c;else f=-o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*l)+c;else f<=-v?(u=Math.max(0,-(-a*o+r)),f=u>0?-o:Math.min(Math.max(-o,-l),o),d=-u*u+f*(f+2*l)+c):f<=v?(u=0,f=Math.min(Math.max(-o,-l),o),d=f*(f+2*l)+c):(u=Math.max(0,-(a*o+r)),f=u>0?o:Math.min(Math.max(-o,-l),o),d=-u*u+f*(f+2*l)+c);else f=a>0?-o:o,u=Math.max(0,-(a*f+r)),d=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(gr).addScaledVector(Oo,f),d}intersectSphere(t,e){qn.subVectors(t.center,this.origin);const n=qn.dot(this.direction),i=qn.dot(qn)-n*n,o=t.radius*t.radius;if(i>o)return null;const a=Math.sqrt(o-i),r=n-a,l=n+a;return l<0?null:r<0?this.at(l,e):this.at(r,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,o,a,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),h>=0?(o=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(o=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||o>i||((o>n||isNaN(n))&&(n=o),(a<i||isNaN(i))&&(i=a),u>=0?(r=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(r=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||r>i)||((r>n||n!==n)&&(n=r),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,qn)!==null}intersectTriangle(t,e,n,i,o){xr.subVectors(e,t),Bo.subVectors(n,t),vr.crossVectors(xr,Bo);let a=this.direction.dot(vr),r;if(a>0){if(i)return null;r=1}else if(a<0)r=-1,a=-a;else return null;di.subVectors(this.origin,t);const l=r*this.direction.dot(Bo.crossVectors(di,Bo));if(l<0)return null;const c=r*this.direction.dot(xr.cross(di));if(c<0||l+c>a)return null;const h=-r*di.dot(vr);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ie{constructor(t,e,n,i,o,a,r,l,c,h,u,f,d,v,g,x){ie.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,o,a,r,l,c,h,u,f,d,v,g,x)}set(t,e,n,i,o,a,r,l,c,h,u,f,d,v,g,x){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=o,p[5]=a,p[9]=r,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=v,p[11]=g,p[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ie().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/ss.setFromMatrixColumn(t,0).length(),o=1/ss.setFromMatrixColumn(t,1).length(),a=1/ss.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,o=t.z,a=Math.cos(n),r=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const f=a*h,d=a*u,v=r*h,g=r*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=d+v*c,e[5]=f-g*c,e[9]=-r*l,e[2]=g-f*c,e[6]=v+d*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,d=l*u,v=c*h,g=c*u;e[0]=f+g*r,e[4]=v*r-d,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=d*r-v,e[6]=g+f*r,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,d=l*u,v=c*h,g=c*u;e[0]=f-g*r,e[4]=-a*u,e[8]=v+d*r,e[1]=d+v*r,e[5]=a*h,e[9]=g-f*r,e[2]=-a*c,e[6]=r,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,d=a*u,v=r*h,g=r*u;e[0]=l*h,e[4]=v*c-d,e[8]=f*c+g,e[1]=l*u,e[5]=g*c+f,e[9]=d*c-v,e[2]=-c,e[6]=r*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,d=a*c,v=r*l,g=r*c;e[0]=l*h,e[4]=g-f*u,e[8]=v*u+d,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-c*h,e[6]=d*u+v,e[10]=f-g*u}else if(t.order==="XZY"){const f=a*l,d=a*c,v=r*l,g=r*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+g,e[5]=a*h,e[9]=d*u-v,e[2]=v*u-d,e[6]=r*h,e[10]=g*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Jf,t,Qf)}lookAt(t,e,n){const i=this.elements;return dn.subVectors(t,e),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),pi.crossVectors(n,dn),pi.lengthSq()===0&&(Math.abs(n.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),pi.crossVectors(n,dn)),pi.normalize(),Ho.crossVectors(dn,pi),i[0]=pi.x,i[4]=Ho.x,i[8]=dn.x,i[1]=pi.y,i[5]=Ho.y,i[9]=dn.y,i[2]=pi.z,i[6]=Ho.z,i[10]=dn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,o=this.elements,a=n[0],r=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],d=n[13],v=n[2],g=n[6],x=n[10],p=n[14],m=n[3],M=n[7],_=n[11],E=n[15],y=i[0],w=i[4],A=i[8],b=i[12],S=i[1],R=i[5],k=i[9],I=i[13],T=i[2],C=i[6],F=i[10],N=i[14],z=i[3],U=i[7],L=i[11],W=i[15];return o[0]=a*y+r*S+l*T+c*z,o[4]=a*w+r*R+l*C+c*U,o[8]=a*A+r*k+l*F+c*L,o[12]=a*b+r*I+l*N+c*W,o[1]=h*y+u*S+f*T+d*z,o[5]=h*w+u*R+f*C+d*U,o[9]=h*A+u*k+f*F+d*L,o[13]=h*b+u*I+f*N+d*W,o[2]=v*y+g*S+x*T+p*z,o[6]=v*w+g*R+x*C+p*U,o[10]=v*A+g*k+x*F+p*L,o[14]=v*b+g*I+x*N+p*W,o[3]=m*y+M*S+_*T+E*z,o[7]=m*w+M*R+_*C+E*U,o[11]=m*A+M*k+_*F+E*L,o[15]=m*b+M*I+_*N+E*W,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],o=t[12],a=t[1],r=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],d=t[14],v=t[3],g=t[7],x=t[11],p=t[15];return v*(+o*l*u-i*c*u-o*r*f+n*c*f+i*r*d-n*l*d)+g*(+e*l*d-e*c*f+o*a*f-i*a*d+i*c*h-o*l*h)+x*(+e*c*u-e*r*d-o*a*u+n*a*d+o*r*h-n*c*h)+p*(-i*r*h-e*l*u+e*r*f+i*a*u-n*a*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],o=t[3],a=t[4],r=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],d=t[11],v=t[12],g=t[13],x=t[14],p=t[15],m=u*x*c-g*f*c+g*l*d-r*x*d-u*l*p+r*f*p,M=v*f*c-h*x*c-v*l*d+a*x*d+h*l*p-a*f*p,_=h*g*c-v*u*c+v*r*d-a*g*d-h*r*p+a*u*p,E=v*u*l-h*g*l-v*r*f+a*g*f+h*r*x-a*u*x,y=e*m+n*M+i*_+o*E;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/y;return t[0]=m*w,t[1]=(g*f*o-u*x*o-g*i*d+n*x*d+u*i*p-n*f*p)*w,t[2]=(r*x*o-g*l*o+g*i*c-n*x*c-r*i*p+n*l*p)*w,t[3]=(u*l*o-r*f*o-u*i*c+n*f*c+r*i*d-n*l*d)*w,t[4]=M*w,t[5]=(h*x*o-v*f*o+v*i*d-e*x*d-h*i*p+e*f*p)*w,t[6]=(v*l*o-a*x*o-v*i*c+e*x*c+a*i*p-e*l*p)*w,t[7]=(a*f*o-h*l*o+h*i*c-e*f*c-a*i*d+e*l*d)*w,t[8]=_*w,t[9]=(v*u*o-h*g*o-v*n*d+e*g*d+h*n*p-e*u*p)*w,t[10]=(a*g*o-v*r*o+v*n*c-e*g*c-a*n*p+e*r*p)*w,t[11]=(h*r*o-a*u*o-h*n*c+e*u*c+a*n*d-e*r*d)*w,t[12]=E*w,t[13]=(h*g*i-v*u*i+v*n*f-e*g*f-h*n*x+e*u*x)*w,t[14]=(v*r*i-a*g*i-v*n*l+e*g*l+a*n*x-e*r*x)*w,t[15]=(a*u*i-h*r*i+h*n*l-e*u*l-a*n*f+e*r*f)*w,this}scale(t){const e=this.elements,n=t.x,i=t.y,o=t.z;return e[0]*=n,e[4]*=i,e[8]*=o,e[1]*=n,e[5]*=i,e[9]*=o,e[2]*=n,e[6]*=i,e[10]*=o,e[3]*=n,e[7]*=i,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),o=1-n,a=t.x,r=t.y,l=t.z,c=o*a,h=o*r;return this.set(c*a+n,c*r-i*l,c*l+i*r,0,c*r+i*l,h*r+n,h*l-i*a,0,c*l-i*r,h*l+i*a,o*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,o,a){return this.set(1,n,o,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,o=e._x,a=e._y,r=e._z,l=e._w,c=o+o,h=a+a,u=r+r,f=o*c,d=o*h,v=o*u,g=a*h,x=a*u,p=r*u,m=l*c,M=l*h,_=l*u,E=n.x,y=n.y,w=n.z;return i[0]=(1-(g+p))*E,i[1]=(d+_)*E,i[2]=(v-M)*E,i[3]=0,i[4]=(d-_)*y,i[5]=(1-(f+p))*y,i[6]=(x+m)*y,i[7]=0,i[8]=(v+M)*w,i[9]=(x-m)*w,i[10]=(1-(f+g))*w,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let o=ss.set(i[0],i[1],i[2]).length();const a=ss.set(i[4],i[5],i[6]).length(),r=ss.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),t.x=i[12],t.y=i[13],t.z=i[14],kn.copy(this);const c=1/o,h=1/a,u=1/r;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=h,kn.elements[5]*=h,kn.elements[6]*=h,kn.elements[8]*=u,kn.elements[9]*=u,kn.elements[10]*=u,e.setFromRotationMatrix(kn),n.x=o,n.y=a,n.z=r,this}makePerspective(t,e,n,i,o,a,r=ni){const l=this.elements,c=2*o/(e-t),h=2*o/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let d,v;if(r===ni)d=-(a+o)/(a-o),v=-2*a*o/(a-o);else if(r===Ia)d=-a/(a-o),v=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,o,a,r=ni){const l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(a-o),f=(e+t)*c,d=(n+i)*h;let v,g;if(r===ni)v=(a+o)*u,g=-2*u;else if(r===Ia)v=o*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ss=new q,kn=new ie,Jf=new q(0,0,0),Qf=new q(1,1,1),pi=new q,Ho=new q,dn=new q,Lc=new ie,zc=new ji;class Ro{constructor(t=0,e=0,n=0,i=Ro.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,o=i[0],a=i[4],r=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin($e(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin($e(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,d));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Lc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Lc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return zc.setFromEuler(this),this.setFromQuaternion(zc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ro.DEFAULT_ORDER="XYZ";class zl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let td=0;const Dc=new q,os=new ji,Xn=new ie,Go=new q,$s=new q,ed=new q,nd=new ji,Fc=new q(1,0,0),Ic=new q(0,1,0),Uc=new q(0,0,1),id={type:"added"},sd={type:"removed"};class un extends Hs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=Gs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=un.DEFAULT_UP.clone();const t=new q,e=new Ro,n=new ji,i=new q(1,1,1);function o(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ie},normalMatrix:{value:new Qt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=un.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new zl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.multiply(os),this}rotateOnWorldAxis(t,e){return os.setFromAxisAngle(t,e),this.quaternion.premultiply(os),this}rotateX(t){return this.rotateOnAxis(Fc,t)}rotateY(t){return this.rotateOnAxis(Ic,t)}rotateZ(t){return this.rotateOnAxis(Uc,t)}translateOnAxis(t,e){return Dc.copy(t).applyQuaternion(this.quaternion),this.position.add(Dc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Fc,t)}translateY(t){return this.translateOnAxis(Ic,t)}translateZ(t){return this.translateOnAxis(Uc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Go.copy(t):Go.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),$s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt($s,Go,this.up):Xn.lookAt(Go,$s,this.up),this.quaternion.setFromRotationMatrix(Xn),i&&(Xn.extractRotation(i.matrixWorld),os.setFromRotationMatrix(Xn),this.quaternion.premultiply(os.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(id)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(sd)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Xn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let o=0,a=i.length;o<a;o++)i[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,t,ed),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,nd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const o=e[n];(o.matrixWorldAutoUpdate===!0||t===!0)&&o.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let o=0,a=i.length;o<a;o++){const r=i[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function o(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];o(t.shapes,u)}else o(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(o(t.materials,this.material[l]));i.material=r}else i.material=o(t.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];i.animations.push(o(t.animations,l))}}if(e){const r=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),d=a(t.animations),v=a(t.nodes);r.length>0&&(n.geometries=r),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),v.length>0&&(n.nodes=v)}return n.object=i,n;function a(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}un.DEFAULT_UP=new q(0,1,0);un.DEFAULT_MATRIX_AUTO_UPDATE=!0;un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Pn=new q,jn=new q,Mr=new q,Yn=new q,as=new q,rs=new q,Nc=new q,_r=new q,wr=new q,yr=new q;let Wo=!1;class Dn{constructor(t=new q,e=new q,n=new q){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Pn.subVectors(t,e),i.cross(Pn);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(t,e,n,i,o){Pn.subVectors(i,e),jn.subVectors(n,e),Mr.subVectors(t,e);const a=Pn.dot(Pn),r=Pn.dot(jn),l=Pn.dot(Mr),c=jn.dot(jn),h=jn.dot(Mr),u=a*c-r*r;if(u===0)return o.set(0,0,0),null;const f=1/u,d=(c*l-r*h)*f,v=(a*h-r*l)*f;return o.set(1-d-v,v,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getUV(t,e,n,i,o,a,r,l){return Wo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Wo=!0),this.getInterpolation(t,e,n,i,o,a,r,l)}static getInterpolation(t,e,n,i,o,a,r,l){return this.getBarycoord(t,e,n,i,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,Yn.x),l.addScaledVector(a,Yn.y),l.addScaledVector(r,Yn.z),l)}static isFrontFacing(t,e,n,i){return Pn.subVectors(n,e),jn.subVectors(t,e),Pn.cross(jn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Pn.subVectors(this.c,this.b),jn.subVectors(this.a,this.b),Pn.cross(jn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Dn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Dn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,o){return Wo===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Wo=!0),Dn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}getInterpolation(t,e,n,i,o){return Dn.getInterpolation(t,this.a,this.b,this.c,e,n,i,o)}containsPoint(t){return Dn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Dn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,o=this.c;let a,r;as.subVectors(i,n),rs.subVectors(o,n),_r.subVectors(t,n);const l=as.dot(_r),c=rs.dot(_r);if(l<=0&&c<=0)return e.copy(n);wr.subVectors(t,i);const h=as.dot(wr),u=rs.dot(wr);if(h>=0&&u<=h)return e.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(as,a);yr.subVectors(t,o);const d=as.dot(yr),v=rs.dot(yr);if(v>=0&&d<=v)return e.copy(o);const g=d*c-l*v;if(g<=0&&c>=0&&v<=0)return r=c/(c-v),e.copy(n).addScaledVector(rs,r);const x=h*v-d*u;if(x<=0&&u-h>=0&&d-v>=0)return Nc.subVectors(o,i),r=(u-h)/(u-h+(d-v)),e.copy(i).addScaledVector(Nc,r);const p=1/(x+g+f);return a=g*p,r=f*p,e.copy(n).addScaledVector(as,a).addScaledVector(rs,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Lu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mi={h:0,s:0,l:0},Vo={h:0,s:0,l:0};function br(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class It{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ge){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=de.workingColorSpace){if(t=Pl(t,1),e=$e(e,0,1),n=$e(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,a=2*n-o;this.r=br(a,o,t+1/3),this.g=br(a,o,t),this.b=br(a,o,t-1/3)}return de.toWorkingColorSpace(this,i),this}setStyle(t,e=Ge){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=i[1],r=i[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=i[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ge){const n=Lu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ds(t.r),this.g=Ds(t.g),this.b=Ds(t.b),this}copyLinearToSRGB(t){return this.r=ur(t.r),this.g=ur(t.g),this.b=ur(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ge){return de.fromWorkingColorSpace(je.copy(this),t),Math.round($e(je.r*255,0,255))*65536+Math.round($e(je.g*255,0,255))*256+Math.round($e(je.b*255,0,255))}getHexString(t=Ge){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.fromWorkingColorSpace(je.copy(this),e);const n=je.r,i=je.g,o=je.b,a=Math.max(n,i,o),r=Math.min(n,i,o);let l,c;const h=(r+a)/2;if(r===a)l=0,c=0;else{const u=a-r;switch(c=h<=.5?u/(a+r):u/(2-a-r),a){case n:l=(i-o)/u+(i<o?6:0);break;case i:l=(o-n)/u+2;break;case o:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.fromWorkingColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Ge){de.fromWorkingColorSpace(je.copy(this),t);const e=je.r,n=je.g,i=je.b;return t!==Ge?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(mi),this.setHSL(mi.h+t,mi.s+e,mi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(mi),t.getHSL(Vo);const n=mo(mi.h,Vo.h,e),i=mo(mi.s,Vo.s,e),o=mo(mi.l,Vo.l,e);return this.setHSL(n,i,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*i,this.g=o[1]*e+o[4]*n+o[7]*i,this.b=o[2]*e+o[5]*n+o[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const je=new It;It.NAMES=Lu;let od=0;class ko extends Hs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=Gs(),this.name="",this.type="Material",this.blending=Ls,this.side=oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ol,this.blendDst=al,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new It(0,0,0),this.blendAlpha=0,this.depthFunc=La,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qi,this.stencilZFail=Qi,this.stencilZPass=Qi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ls&&(n.blending=this.blending),this.side!==oi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ol&&(n.blendSrc=this.blendSrc),this.blendDst!==al&&(n.blendDst=this.blendDst),this.blendEquation!==Ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==La&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Sc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Qi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Qi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const a=[];for(const r in o){const l=o[r];delete l.metadata,a.push(l)}return a}if(e){const o=i(t.textures),a=i(t.images);o.length>0&&(n.textures=o),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class zu extends ko{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new It(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=xu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ti=ad();function ad(){const s=new ArrayBuffer(4),t=new Float32Array(s),e=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}const o=new Uint32Array(2048),a=new Uint32Array(64),r=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;!(c&8388608);)c<<=1,h-=8388608;c&=-8388609,h+=947912704,o[l]=c|h}for(let l=1024;l<2048;++l)o[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(r[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:o,exponentTable:a,offsetTable:r}}function rd(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=$e(s,-65504,65504),ti.floatView[0]=s;const t=ti.uint32View[0],e=t>>23&511;return ti.baseTable[e]+((t&8388607)>>ti.shiftTable[e])}function ld(s){const t=s>>10;return ti.uint32View[0]=ti.mantissaTable[ti.offsetTable[t]+(s&1023)]+ti.exponentTable[t],ti.floatView[0]}const Oc={toHalfFloat:rd,fromHalfFloat:ld},ze=new q,qo=new Ot;class he{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ec,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=In,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)qo.fromBufferAttribute(this,e),qo.applyMatrix3(t),this.setXY(e,qo.x,qo.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix3(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=bs(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Qe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=bs(e,this.array)),e}setX(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=bs(e,this.array)),e}setY(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=bs(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=bs(e,this.array)),e}setW(t,e){return this.normalized&&(e=Qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array),i=Qe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,o){return t*=this.itemSize,this.normalized&&(e=Qe(e,this.array),n=Qe(n,this.array),i=Qe(i,this.array),o=Qe(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ec&&(t.usage=this.usage),t}}class Du extends he{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Fu extends he{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class pe extends he{constructor(t,e,n){super(new Float32Array(t),e,n)}}let cd=0;const _n=new ie,Sr=new un,ls=new q,pn=new li,Ks=new li,Be=new q;class Fe extends Hs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=Gs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Cu(t)?Fu:Du)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new Qt().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return _n.makeRotationFromQuaternion(t),this.applyMatrix4(_n),this}rotateX(t){return _n.makeRotationX(t),this.applyMatrix4(_n),this}rotateY(t){return _n.makeRotationY(t),this.applyMatrix4(_n),this}rotateZ(t){return _n.makeRotationZ(t),this.applyMatrix4(_n),this}translate(t,e,n){return _n.makeTranslation(t,e,n),this.applyMatrix4(_n),this}scale(t,e,n){return _n.makeScale(t,e,n),this.applyMatrix4(_n),this}lookAt(t){return Sr.lookAt(t),Sr.updateMatrix(),this.applyMatrix4(Sr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ls).negate(),this.translate(ls.x,ls.y,ls.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const o=t[n];e.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new pe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new q(-1/0,-1/0,-1/0),new q(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const o=e[n];pn.setFromBufferAttribute(o),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new q,1/0);return}if(t){const n=this.boundingSphere.center;if(pn.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];Ks.setFromBufferAttribute(r),this.morphTargetsRelative?(Be.addVectors(pn.min,Ks.min),pn.expandByPoint(Be),Be.addVectors(pn.max,Ks.max),pn.expandByPoint(Be)):(pn.expandByPoint(Ks.min),pn.expandByPoint(Ks.max))}pn.getCenter(n);let i=0;for(let o=0,a=t.count;o<a;o++)Be.fromBufferAttribute(t,o),i=Math.max(i,n.distanceToSquared(Be));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)Be.fromBufferAttribute(r,c),l&&(ls.fromBufferAttribute(t,c),Be.add(ls)),i=Math.max(i,n.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,i=e.position.array,o=e.normal.array,a=e.uv.array,r=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new he(new Float32Array(4*r),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let S=0;S<r;S++)c[S]=new q,h[S]=new q;const u=new q,f=new q,d=new q,v=new Ot,g=new Ot,x=new Ot,p=new q,m=new q;function M(S,R,k){u.fromArray(i,S*3),f.fromArray(i,R*3),d.fromArray(i,k*3),v.fromArray(a,S*2),g.fromArray(a,R*2),x.fromArray(a,k*2),f.sub(u),d.sub(u),g.sub(v),x.sub(v);const I=1/(g.x*x.y-x.x*g.y);isFinite(I)&&(p.copy(f).multiplyScalar(x.y).addScaledVector(d,-g.y).multiplyScalar(I),m.copy(d).multiplyScalar(g.x).addScaledVector(f,-x.x).multiplyScalar(I),c[S].add(p),c[R].add(p),c[k].add(p),h[S].add(m),h[R].add(m),h[k].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:n.length}]);for(let S=0,R=_.length;S<R;++S){const k=_[S],I=k.start,T=k.count;for(let C=I,F=I+T;C<F;C+=3)M(n[C+0],n[C+1],n[C+2])}const E=new q,y=new q,w=new q,A=new q;function b(S){w.fromArray(o,S*3),A.copy(w);const R=c[S];E.copy(R),E.sub(w.multiplyScalar(w.dot(R))).normalize(),y.crossVectors(A,R);const I=y.dot(h[S])<0?-1:1;l[S*4]=E.x,l[S*4+1]=E.y,l[S*4+2]=E.z,l[S*4+3]=I}for(let S=0,R=_.length;S<R;++S){const k=_[S],I=k.start,T=k.count;for(let C=I,F=I+T;C<F;C+=3)b(n[C+0]),b(n[C+1]),b(n[C+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new he(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);const i=new q,o=new q,a=new q,r=new q,l=new q,c=new q,h=new q,u=new q;if(t)for(let f=0,d=t.count;f<d;f+=3){const v=t.getX(f+0),g=t.getX(f+1),x=t.getX(f+2);i.fromBufferAttribute(e,v),o.fromBufferAttribute(e,g),a.fromBufferAttribute(e,x),h.subVectors(a,o),u.subVectors(i,o),h.cross(u),r.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),r.add(h),l.add(h),c.add(h),n.setXYZ(v,r.x,r.y,r.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(x,c.x,c.y,c.z)}else for(let f=0,d=e.count;f<d;f+=3)i.fromBufferAttribute(e,f+0),o.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,o),u.subVectors(i,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Be.fromBufferAttribute(t,e),Be.normalize(),t.setXYZ(e,Be.x,Be.y,Be.z)}toNonIndexed(){function t(r,l){const c=r.array,h=r.itemSize,u=r.normalized,f=new c.constructor(l.length*h);let d=0,v=0;for(let g=0,x=l.length;g<x;g++){r.isInterleavedBufferAttribute?d=l[g]*r.data.stride+r.offset:d=l[g]*h;for(let p=0;p<h;p++)f[v++]=c[d++]}return new he(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Fe,n=this.index.array,i=this.attributes;for(const r in i){const l=i[r],c=t(l,n);e.setAttribute(r,c)}const o=this.morphAttributes;for(const r in o){const l=[],c=o[r];for(let h=0,u=c.length;h<u;h++){const f=c[h],d=t(f,n);l.push(d)}e.morphAttributes[r]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,l=a.length;r<l;r++){const c=a[r];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const d=c[u];h.push(d.toJSON(t.data))}h.length>0&&(i[l]=h,o=!0)}o&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const o=t.morphAttributes;for(const c in o){const h=[],u=o[c];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bc=new ie,Ti=new Ll,Xo=new Yi,Hc=new q,cs=new q,hs=new q,us=new q,Er=new q,jo=new q,Yo=new Ot,$o=new Ot,Ko=new Ot,Gc=new q,Wc=new q,Vc=new q,Zo=new q,Jo=new q;class ue extends un{constructor(t=new Fe,e=new zu){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const r=this.morphTargetInfluences;if(o&&r){jo.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=r[l],u=o[l];h!==0&&(Er.fromBufferAttribute(u,t),a?jo.addScaledVector(Er,h):jo.addScaledVector(Er.sub(e),h))}e.add(jo)}return e}raycast(t,e){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xo.copy(n.boundingSphere),Xo.applyMatrix4(o),Ti.copy(t.ray).recast(t.near),!(Xo.containsPoint(Ti.origin)===!1&&(Ti.intersectSphere(Xo,Hc)===null||Ti.origin.distanceToSquared(Hc)>(t.far-t.near)**2))&&(Bc.copy(o).invert(),Ti.copy(t.ray).applyMatrix4(Bc),!(n.boundingBox!==null&&Ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ti)))}_computeIntersections(t,e,n){let i;const o=this.geometry,a=this.material,r=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,d=o.drawRange;if(r!==null)if(Array.isArray(a))for(let v=0,g=f.length;v<g;v++){const x=f[v],p=a[x.materialIndex],m=Math.max(x.start,d.start),M=Math.min(r.count,Math.min(x.start+x.count,d.start+d.count));for(let _=m,E=M;_<E;_+=3){const y=r.getX(_),w=r.getX(_+1),A=r.getX(_+2);i=Qo(this,p,t,n,c,h,u,y,w,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=x.materialIndex,e.push(i))}}else{const v=Math.max(0,d.start),g=Math.min(r.count,d.start+d.count);for(let x=v,p=g;x<p;x+=3){const m=r.getX(x),M=r.getX(x+1),_=r.getX(x+2);i=Qo(this,a,t,n,c,h,u,m,M,_),i&&(i.faceIndex=Math.floor(x/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,g=f.length;v<g;v++){const x=f[v],p=a[x.materialIndex],m=Math.max(x.start,d.start),M=Math.min(l.count,Math.min(x.start+x.count,d.start+d.count));for(let _=m,E=M;_<E;_+=3){const y=_,w=_+1,A=_+2;i=Qo(this,p,t,n,c,h,u,y,w,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=x.materialIndex,e.push(i))}}else{const v=Math.max(0,d.start),g=Math.min(l.count,d.start+d.count);for(let x=v,p=g;x<p;x+=3){const m=x,M=x+1,_=x+2;i=Qo(this,a,t,n,c,h,u,m,M,_),i&&(i.faceIndex=Math.floor(x/3),e.push(i))}}}}function hd(s,t,e,n,i,o,a,r){let l;if(t.side===en?l=n.intersectTriangle(a,o,i,!0,r):l=n.intersectTriangle(i,o,a,t.side===oi,r),l===null)return null;Jo.copy(r),Jo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Jo);return c<e.near||c>e.far?null:{distance:c,point:Jo.clone(),object:s}}function Qo(s,t,e,n,i,o,a,r,l,c){s.getVertexPosition(r,cs),s.getVertexPosition(l,hs),s.getVertexPosition(c,us);const h=hd(s,t,e,n,cs,hs,us,Zo);if(h){i&&(Yo.fromBufferAttribute(i,r),$o.fromBufferAttribute(i,l),Ko.fromBufferAttribute(i,c),h.uv=Dn.getInterpolation(Zo,cs,hs,us,Yo,$o,Ko,new Ot)),o&&(Yo.fromBufferAttribute(o,r),$o.fromBufferAttribute(o,l),Ko.fromBufferAttribute(o,c),h.uv1=Dn.getInterpolation(Zo,cs,hs,us,Yo,$o,Ko,new Ot),h.uv2=h.uv1),a&&(Gc.fromBufferAttribute(a,r),Wc.fromBufferAttribute(a,l),Vc.fromBufferAttribute(a,c),h.normal=Dn.getInterpolation(Zo,cs,hs,us,Gc,Wc,Vc,new q),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:l,c,normal:new q,materialIndex:0};Dn.getNormal(cs,hs,us,u.normal),h.face=u}return h}class Po extends Fe{constructor(t=1,e=1,n=1,i=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:o,depthSegments:a};const r=this;i=Math.floor(i),o=Math.floor(o),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,d=0;v("z","y","x",-1,-1,n,e,t,a,o,0),v("z","y","x",1,-1,n,e,-t,a,o,1),v("x","z","y",1,1,t,n,e,i,a,2),v("x","z","y",1,-1,t,n,-e,i,a,3),v("x","y","z",1,-1,t,e,n,i,o,4),v("x","y","z",-1,-1,t,e,-n,i,o,5),this.setIndex(l),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(h,3)),this.setAttribute("uv",new pe(u,2));function v(g,x,p,m,M,_,E,y,w,A,b){const S=_/w,R=E/A,k=_/2,I=E/2,T=y/2,C=w+1,F=A+1;let N=0,z=0;const U=new q;for(let L=0;L<F;L++){const W=L*R-I;for(let j=0;j<C;j++){const P=j*S-k;U[g]=P*m,U[x]=W*M,U[p]=T,c.push(U.x,U.y,U.z),U[g]=0,U[x]=0,U[p]=y>0?1:-1,h.push(U.x,U.y,U.z),u.push(j/w),u.push(1-L/A),N+=1}}for(let L=0;L<A;L++)for(let W=0;W<w;W++){const j=f+W+C*L,P=f+W+C*(L+1),O=f+(W+1)+C*(L+1),G=f+(W+1)+C*L;l.push(j,P,G),l.push(P,O,G),z+=6}r.addGroup(d,z,b),d+=z,f+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Po(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Os(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function tn(s){const t={};for(let e=0;e<s.length;e++){const n=Os(s[e]);for(const i in n)t[i]=n[i]}return t}function ud(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Iu(s){return s.getRenderTarget()===null?s.outputColorSpace:de.workingColorSpace}const fd={clone:Os,merge:tn};var dd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ce extends ko{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=dd,this.fragmentShader=pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Os(t.uniforms),this.uniformsGroups=ud(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Uu extends un{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=ni}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class rn extends Uu{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=_o*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(po*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _o*2*Math.atan(Math.tan(po*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(po*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,o=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;o+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const fs=-90,ds=1;class md extends un{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new rn(fs,ds,t,e);i.layers=this.layers,this.add(i);const o=new rn(fs,ds,t,e);o.layers=this.layers,this.add(o);const a=new rn(fs,ds,t,e);a.layers=this.layers,this.add(a);const r=new rn(fs,ds,t,e);r.layers=this.layers,this.add(r);const l=new rn(fs,ds,t,e);l.layers=this.layers,this.add(l);const c=new rn(fs,ds,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,o,a,r,l]=e;for(const c of e)this.remove(c);if(t===ni)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ia)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,o),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,r),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,d),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class Nu extends hn{constructor(t,e,n,i,o,a,r,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Is,super(t,e,n,i,o,a,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class gd extends vn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(go("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Bi?Ge:Sn),this.texture=new Nu(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ve}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Po(5,5,5),o=new Ce({name:"CubemapFromEquirect",uniforms:Os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:en,blending:Mi});o.uniforms.tEquirect.value=e;const a=new ue(i,o),r=e.minFilter;return e.minFilter===Wi&&(e.minFilter=ve),new md(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(o)}}const Ar=new q,xd=new q,vd=new Qt;class zi{constructor(t=new q(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Ar.subVectors(n,e).cross(xd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Ar),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||vd.getNormalMatrix(t),i=this.coplanarPoint(Ar).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ci=new Yi,ta=new q;class Ws{constructor(t=new zi,e=new zi,n=new zi,i=new zi,o=new zi,a=new zi){this.planes=[t,e,n,i,o,a]}set(t,e,n,i,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(i),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=ni){const n=this.planes,i=t.elements,o=i[0],a=i[1],r=i[2],l=i[3],c=i[4],h=i[5],u=i[6],f=i[7],d=i[8],v=i[9],g=i[10],x=i[11],p=i[12],m=i[13],M=i[14],_=i[15];if(n[0].setComponents(l-o,f-c,x-d,_-p).normalize(),n[1].setComponents(l+o,f+c,x+d,_+p).normalize(),n[2].setComponents(l+a,f+h,x+v,_+m).normalize(),n[3].setComponents(l-a,f-h,x-v,_-m).normalize(),n[4].setComponents(l-r,f-u,x-g,_-M).normalize(),e===ni)n[5].setComponents(l+r,f+u,x+g,_+M).normalize();else if(e===Ia)n[5].setComponents(r,u,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(t){return Ci.center.set(0,0,0),Ci.radius=.7071067811865476,Ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(ta.x=i.normal.x>0?t.max.x:t.min.x,ta.y=i.normal.y>0?t.max.y:t.min.y,ta.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(ta)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ou(){let s=null,t=!1,e=null,n=null;function i(o,a){e(o,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){s=o}}}function Md(s,t){const e=t.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,f=c.usage,d=u.byteLength,v=s.createBuffer();s.bindBuffer(h,v),s.bufferData(h,u,f),c.onUploadCallback();let g;if(u instanceof Float32Array)g=s.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)g=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)g=s.SHORT;else if(u instanceof Uint32Array)g=s.UNSIGNED_INT;else if(u instanceof Int32Array)g=s.INT;else if(u instanceof Int8Array)g=s.BYTE;else if(u instanceof Uint8Array)g=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)g=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:v,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:d}}function o(c,h,u){const f=h.array,d=h._updateRange,v=h.updateRanges;if(s.bindBuffer(u,c),d.count===-1&&v.length===0&&s.bufferSubData(u,0,f),v.length!==0){for(let g=0,x=v.length;g<x;g++){const p=v[g];e?s.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f,p.start,p.count):s.bufferSubData(u,p.start*f.BYTES_PER_ELEMENT,f.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}d.count!==-1&&(e?s.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f,d.offset,d.count):s.bufferSubData(u,d.offset*f.BYTES_PER_ELEMENT,f.subarray(d.offset,d.offset+d.count)),d.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,i(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,c,h),u.version=c.version}}return{get:a,remove:r,update:l}}class Dl extends Fe{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const o=t/2,a=e/2,r=Math.floor(n),l=Math.floor(i),c=r+1,h=l+1,u=t/r,f=e/l,d=[],v=[],g=[],x=[];for(let p=0;p<h;p++){const m=p*f-a;for(let M=0;M<c;M++){const _=M*u-o;v.push(_,-m,0),g.push(0,0,1),x.push(M/r),x.push(1-p/l)}}for(let p=0;p<l;p++)for(let m=0;m<r;m++){const M=m+c*p,_=m+c*(p+1),E=m+1+c*(p+1),y=m+1+c*p;d.push(M,_,y),d.push(_,E,y)}this.setIndex(d),this.setAttribute("position",new pe(v,3)),this.setAttribute("normal",new pe(g,3)),this.setAttribute("uv",new pe(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dl(t.width,t.height,t.widthSegments,t.heightSegments)}}var _d=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wd=`#ifdef USE_ALPHAHASH
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
#endif`,yd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sd=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Ed=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ad=`#ifdef USE_AOMAP
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
#endif`,Td=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cd=`#ifdef USE_BATCHING
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
#endif`,Rd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,kd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ld=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,zd=`#ifdef USE_IRIDESCENCE
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
#endif`,Dd=`#ifdef USE_BUMPMAP
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
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Id=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ud=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Od=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Gd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Wd=`#define PI 3.141592653589793
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
} // validated`,Vd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,qd=`vec3 transformedNormal = objectNormal;
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
#endif`,Xd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Yd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,$d=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Kd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zd=`
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
}`,Jd=`#ifdef USE_ENVMAP
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
#endif`,Qd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tp=`#ifdef USE_ENVMAP
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
#endif`,ep=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,np=`#ifdef USE_ENVMAP
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
#endif`,ip=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,op=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ap=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rp=`#ifdef USE_GRADIENTMAP
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
}`,lp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,cp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,up=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fp=`uniform bool receiveShadow;
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
#endif`,dp=`#ifdef USE_ENVMAP
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
#endif`,pp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vp=`PhysicalMaterial material;
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
#endif`,Mp=`struct PhysicalMaterial {
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
}`,_p=`
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
#endif`,wp=`#if defined( RE_IndirectDiffuse )
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
#endif`,yp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Sp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ep=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Ap=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Tp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,kp=`#if defined( USE_POINTS_UV )
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
#endif`,Pp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dp=`#ifdef USE_MORPHNORMALS
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
#endif`,Fp=`#ifdef USE_MORPHTARGETS
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
#endif`,Ip=`#ifdef USE_MORPHTARGETS
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
#endif`,Up=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Np=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Op=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gp=`#ifdef USE_NORMALMAP
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
#endif`,Wp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,qp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Yp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$p=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,em=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,im=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sm=`float getShadowMask() {
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
}`,om=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,am=`#ifdef USE_SKINNING
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
#endif`,rm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lm=`#ifdef USE_SKINNING
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
#endif`,cm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,um=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,dm=`#ifdef USE_TRANSMISSION
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
#endif`,pm=`#ifdef USE_TRANSMISSION
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
#endif`,mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Mm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_m=`uniform sampler2D t2D;
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
}`,wm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ym=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Em=`#include <common>
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
}`,Am=`#if DEPTH_PACKING == 3200
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
}`,Tm=`#define DISTANCE
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
}`,Cm=`#define DISTANCE
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
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,km=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pm=`uniform float scale;
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
}`,Lm=`uniform vec3 diffuse;
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
}`,zm=`#include <common>
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
}`,Dm=`uniform vec3 diffuse;
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
}`,Fm=`#define LAMBERT
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
}`,Im=`#define LAMBERT
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
}`,Um=`#define MATCAP
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
}`,Nm=`#define MATCAP
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
}`,Om=`#define NORMAL
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
}`,Bm=`#define NORMAL
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
}`,Hm=`#define PHONG
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
}`,Gm=`#define PHONG
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
}`,Wm=`#define STANDARD
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
}`,Vm=`#define STANDARD
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
}`,qm=`#define TOON
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
}`,Xm=`#define TOON
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
}`,jm=`uniform float size;
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
}`,Ym=`uniform vec3 diffuse;
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
}`,$m=`#include <common>
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
}`,Km=`uniform vec3 color;
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
}`,Zm=`uniform float rotation;
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
}`,Jm=`uniform vec3 diffuse;
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
}`,Kt={alphahash_fragment:_d,alphahash_pars_fragment:wd,alphamap_fragment:yd,alphamap_pars_fragment:bd,alphatest_fragment:Sd,alphatest_pars_fragment:Ed,aomap_fragment:Ad,aomap_pars_fragment:Td,batching_pars_vertex:Cd,batching_vertex:Rd,begin_vertex:kd,beginnormal_vertex:Pd,bsdfs:Ld,iridescence_fragment:zd,bumpmap_pars_fragment:Dd,clipping_planes_fragment:Fd,clipping_planes_pars_fragment:Id,clipping_planes_pars_vertex:Ud,clipping_planes_vertex:Nd,color_fragment:Od,color_pars_fragment:Bd,color_pars_vertex:Hd,color_vertex:Gd,common:Wd,cube_uv_reflection_fragment:Vd,defaultnormal_vertex:qd,displacementmap_pars_vertex:Xd,displacementmap_vertex:jd,emissivemap_fragment:Yd,emissivemap_pars_fragment:$d,colorspace_fragment:Kd,colorspace_pars_fragment:Zd,envmap_fragment:Jd,envmap_common_pars_fragment:Qd,envmap_pars_fragment:tp,envmap_pars_vertex:ep,envmap_physical_pars_fragment:dp,envmap_vertex:np,fog_vertex:ip,fog_pars_vertex:sp,fog_fragment:op,fog_pars_fragment:ap,gradientmap_pars_fragment:rp,lightmap_fragment:lp,lightmap_pars_fragment:cp,lights_lambert_fragment:hp,lights_lambert_pars_fragment:up,lights_pars_begin:fp,lights_toon_fragment:pp,lights_toon_pars_fragment:mp,lights_phong_fragment:gp,lights_phong_pars_fragment:xp,lights_physical_fragment:vp,lights_physical_pars_fragment:Mp,lights_fragment_begin:_p,lights_fragment_maps:wp,lights_fragment_end:yp,logdepthbuf_fragment:bp,logdepthbuf_pars_fragment:Sp,logdepthbuf_pars_vertex:Ep,logdepthbuf_vertex:Ap,map_fragment:Tp,map_pars_fragment:Cp,map_particle_fragment:Rp,map_particle_pars_fragment:kp,metalnessmap_fragment:Pp,metalnessmap_pars_fragment:Lp,morphcolor_vertex:zp,morphnormal_vertex:Dp,morphtarget_pars_vertex:Fp,morphtarget_vertex:Ip,normal_fragment_begin:Up,normal_fragment_maps:Np,normal_pars_fragment:Op,normal_pars_vertex:Bp,normal_vertex:Hp,normalmap_pars_fragment:Gp,clearcoat_normal_fragment_begin:Wp,clearcoat_normal_fragment_maps:Vp,clearcoat_pars_fragment:qp,iridescence_pars_fragment:Xp,opaque_fragment:jp,packing:Yp,premultiplied_alpha_fragment:$p,project_vertex:Kp,dithering_fragment:Zp,dithering_pars_fragment:Jp,roughnessmap_fragment:Qp,roughnessmap_pars_fragment:tm,shadowmap_pars_fragment:em,shadowmap_pars_vertex:nm,shadowmap_vertex:im,shadowmask_pars_fragment:sm,skinbase_vertex:om,skinning_pars_vertex:am,skinning_vertex:rm,skinnormal_vertex:lm,specularmap_fragment:cm,specularmap_pars_fragment:hm,tonemapping_fragment:um,tonemapping_pars_fragment:fm,transmission_fragment:dm,transmission_pars_fragment:pm,uv_pars_fragment:mm,uv_pars_vertex:gm,uv_vertex:xm,worldpos_vertex:vm,background_vert:Mm,background_frag:_m,backgroundCube_vert:wm,backgroundCube_frag:ym,cube_vert:bm,cube_frag:Sm,depth_vert:Em,depth_frag:Am,distanceRGBA_vert:Tm,distanceRGBA_frag:Cm,equirect_vert:Rm,equirect_frag:km,linedashed_vert:Pm,linedashed_frag:Lm,meshbasic_vert:zm,meshbasic_frag:Dm,meshlambert_vert:Fm,meshlambert_frag:Im,meshmatcap_vert:Um,meshmatcap_frag:Nm,meshnormal_vert:Om,meshnormal_frag:Bm,meshphong_vert:Hm,meshphong_frag:Gm,meshphysical_vert:Wm,meshphysical_frag:Vm,meshtoon_vert:qm,meshtoon_frag:Xm,points_vert:jm,points_frag:Ym,shadow_vert:$m,shadow_frag:Km,sprite_vert:Zm,sprite_frag:Jm},yt={common:{diffuse:{value:new It(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Qt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Qt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Qt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Qt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Qt},normalScale:{value:new Ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Qt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Qt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Qt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Qt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new It(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new It(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0},uvTransform:{value:new Qt}},sprite:{diffuse:{value:new It(16777215)},opacity:{value:1},center:{value:new Ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Qt},alphaMap:{value:null},alphaMapTransform:{value:new Qt},alphaTest:{value:0}}},Gn={basic:{uniforms:tn([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:tn([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new It(0)}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:tn([yt.common,yt.specularmap,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,yt.lights,{emissive:{value:new It(0)},specular:{value:new It(1118481)},shininess:{value:30}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:tn([yt.common,yt.envmap,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.roughnessmap,yt.metalnessmap,yt.fog,yt.lights,{emissive:{value:new It(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:tn([yt.common,yt.aomap,yt.lightmap,yt.emissivemap,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.gradientmap,yt.fog,yt.lights,{emissive:{value:new It(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:tn([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,yt.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:tn([yt.points,yt.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:tn([yt.common,yt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:tn([yt.common,yt.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:tn([yt.common,yt.bumpmap,yt.normalmap,yt.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:tn([yt.sprite,yt.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Qt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distanceRGBA:{uniforms:tn([yt.common,yt.displacementmap,{referencePosition:{value:new q},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distanceRGBA_vert,fragmentShader:Kt.distanceRGBA_frag},shadow:{uniforms:tn([yt.lights,yt.fog,{color:{value:new It(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};Gn.physical={uniforms:tn([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Qt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Qt},clearcoatNormalScale:{value:new Ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Qt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Qt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Qt},sheen:{value:0},sheenColor:{value:new It(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Qt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Qt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Qt},transmissionSamplerSize:{value:new Ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Qt},attenuationDistance:{value:0},attenuationColor:{value:new It(0)},specularColor:{value:new It(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Qt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Qt},anisotropyVector:{value:new Ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Qt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};const ea={r:0,b:0,g:0};function Qm(s,t,e,n,i,o,a){const r=new It(0);let l=o===!0?0:1,c,h,u=null,f=0,d=null;function v(x,p){let m=!1,M=p.isScene===!0?p.background:null;M&&M.isTexture&&(M=(p.backgroundBlurriness>0?e:t).get(M)),M===null?g(r,l):M&&M.isColor&&(g(M,1),m=!0);const _=s.xr.getEnvironmentBlendMode();_==="additive"?n.buffers.color.setClear(0,0,0,1,a):_==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||m)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Va)?(h===void 0&&(h=new ue(new Po(1,1,1),new Ce({name:"BackgroundCubeMaterial",uniforms:Os(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,y,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=de.getTransfer(M.colorSpace)!==ye,(u!==M||f!==M.version||d!==s.toneMapping)&&(h.material.needsUpdate=!0,u=M,f=M.version,d=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new ue(new Dl(2,2),new Ce({name:"BackgroundMaterial",uniforms:Os(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=de.getTransfer(M.colorSpace)!==ye,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,f=M.version,d=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function g(x,p){x.getRGB(ea,Iu(s)),n.buffers.color.setClear(ea.r,ea.g,ea.b,p,a)}return{getClearColor:function(){return r},setClearColor:function(x,p=1){r.set(x),l=p,g(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,g(r,l)},render:v}}function t1(s,t,e,n){const i=s.getParameter(s.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||o!==null,r={},l=x(null);let c=l,h=!1;function u(T,C,F,N,z){let U=!1;if(a){const L=g(N,F,C);c!==L&&(c=L,d(c.object)),U=p(T,N,F,z),U&&m(T,N,F,z)}else{const L=C.wireframe===!0;(c.geometry!==N.id||c.program!==F.id||c.wireframe!==L)&&(c.geometry=N.id,c.program=F.id,c.wireframe=L,U=!0)}z!==null&&e.update(z,s.ELEMENT_ARRAY_BUFFER),(U||h)&&(h=!1,A(T,C,F,N),z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function f(){return n.isWebGL2?s.createVertexArray():o.createVertexArrayOES()}function d(T){return n.isWebGL2?s.bindVertexArray(T):o.bindVertexArrayOES(T)}function v(T){return n.isWebGL2?s.deleteVertexArray(T):o.deleteVertexArrayOES(T)}function g(T,C,F){const N=F.wireframe===!0;let z=r[T.id];z===void 0&&(z={},r[T.id]=z);let U=z[C.id];U===void 0&&(U={},z[C.id]=U);let L=U[N];return L===void 0&&(L=x(f()),U[N]=L),L}function x(T){const C=[],F=[],N=[];for(let z=0;z<i;z++)C[z]=0,F[z]=0,N[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:F,attributeDivisors:N,object:T,attributes:{},index:null}}function p(T,C,F,N){const z=c.attributes,U=C.attributes;let L=0;const W=F.getAttributes();for(const j in W)if(W[j].location>=0){const O=z[j];let G=U[j];if(G===void 0&&(j==="instanceMatrix"&&T.instanceMatrix&&(G=T.instanceMatrix),j==="instanceColor"&&T.instanceColor&&(G=T.instanceColor)),O===void 0||O.attribute!==G||G&&O.data!==G.data)return!0;L++}return c.attributesNum!==L||c.index!==N}function m(T,C,F,N){const z={},U=C.attributes;let L=0;const W=F.getAttributes();for(const j in W)if(W[j].location>=0){let O=U[j];O===void 0&&(j==="instanceMatrix"&&T.instanceMatrix&&(O=T.instanceMatrix),j==="instanceColor"&&T.instanceColor&&(O=T.instanceColor));const G={};G.attribute=O,O&&O.data&&(G.data=O.data),z[j]=G,L++}c.attributes=z,c.attributesNum=L,c.index=N}function M(){const T=c.newAttributes;for(let C=0,F=T.length;C<F;C++)T[C]=0}function _(T){E(T,0)}function E(T,C){const F=c.newAttributes,N=c.enabledAttributes,z=c.attributeDivisors;F[T]=1,N[T]===0&&(s.enableVertexAttribArray(T),N[T]=1),z[T]!==C&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](T,C),z[T]=C)}function y(){const T=c.newAttributes,C=c.enabledAttributes;for(let F=0,N=C.length;F<N;F++)C[F]!==T[F]&&(s.disableVertexAttribArray(F),C[F]=0)}function w(T,C,F,N,z,U,L){L===!0?s.vertexAttribIPointer(T,C,F,z,U):s.vertexAttribPointer(T,C,F,N,z,U)}function A(T,C,F,N){if(n.isWebGL2===!1&&(T.isInstancedMesh||N.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const z=N.attributes,U=F.getAttributes(),L=C.defaultAttributeValues;for(const W in U){const j=U[W];if(j.location>=0){let P=z[W];if(P===void 0&&(W==="instanceMatrix"&&T.instanceMatrix&&(P=T.instanceMatrix),W==="instanceColor"&&T.instanceColor&&(P=T.instanceColor)),P!==void 0){const O=P.normalized,G=P.itemSize,K=e.get(P);if(K===void 0)continue;const Q=K.buffer,ot=K.type,$=K.bytesPerElement,Y=n.isWebGL2===!0&&(ot===s.INT||ot===s.UNSIGNED_INT||P.gpuType===Mu);if(P.isInterleavedBufferAttribute){const rt=P.data,X=rt.stride,Mt=P.offset;if(rt.isInstancedInterleavedBuffer){for(let mt=0;mt<j.locationSize;mt++)E(j.location+mt,rt.meshPerAttribute);T.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let mt=0;mt<j.locationSize;mt++)_(j.location+mt);s.bindBuffer(s.ARRAY_BUFFER,Q);for(let mt=0;mt<j.locationSize;mt++)w(j.location+mt,G/j.locationSize,ot,O,X*$,(Mt+G/j.locationSize*mt)*$,Y)}else{if(P.isInstancedBufferAttribute){for(let rt=0;rt<j.locationSize;rt++)E(j.location+rt,P.meshPerAttribute);T.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=P.meshPerAttribute*P.count)}else for(let rt=0;rt<j.locationSize;rt++)_(j.location+rt);s.bindBuffer(s.ARRAY_BUFFER,Q);for(let rt=0;rt<j.locationSize;rt++)w(j.location+rt,G/j.locationSize,ot,O,G*$,G/j.locationSize*rt*$,Y)}}else if(L!==void 0){const O=L[W];if(O!==void 0)switch(O.length){case 2:s.vertexAttrib2fv(j.location,O);break;case 3:s.vertexAttrib3fv(j.location,O);break;case 4:s.vertexAttrib4fv(j.location,O);break;default:s.vertexAttrib1fv(j.location,O)}}}}y()}function b(){k();for(const T in r){const C=r[T];for(const F in C){const N=C[F];for(const z in N)v(N[z].object),delete N[z];delete C[F]}delete r[T]}}function S(T){if(r[T.id]===void 0)return;const C=r[T.id];for(const F in C){const N=C[F];for(const z in N)v(N[z].object),delete N[z];delete C[F]}delete r[T.id]}function R(T){for(const C in r){const F=r[C];if(F[T.id]===void 0)continue;const N=F[T.id];for(const z in N)v(N[z].object),delete N[z];delete F[T.id]}}function k(){I(),h=!0,c!==l&&(c=l,d(c.object))}function I(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:k,resetDefaultState:I,dispose:b,releaseStatesOfGeometry:S,releaseStatesOfProgram:R,initAttributes:M,enableAttribute:_,disableUnusedAttributes:y}}function e1(s,t,e,n){const i=n.isWebGL2;let o;function a(h){o=h}function r(h,u){s.drawArrays(o,h,u),e.update(u,o,1)}function l(h,u,f){if(f===0)return;let d,v;if(i)d=s,v="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[v](o,h,u,f),e.update(u,o,f)}function c(h,u,f){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let v=0;v<f;v++)this.render(h[v],u[v]);else{d.multiDrawArraysWEBGL(o,h,0,u,0,f);let v=0;for(let g=0;g<f;g++)v+=u[g];e.update(v,o,1)}}this.setMode=a,this.render=r,this.renderInstances=l,this.renderMultiDraw=c}function n1(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext";let r=e.precision!==void 0?e.precision:"highp";const l=o(r);l!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",l,"instead."),r=l);const c=a||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_TEXTURE_SIZE),v=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),m=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),M=f>0,_=a||t.has("OES_texture_float"),E=M&&_,y=a?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:d,maxCubemapSize:v,maxAttributes:g,maxVertexUniforms:x,maxVaryings:p,maxFragmentUniforms:m,vertexTextures:M,floatFragmentTextures:_,floatVertexTextures:E,maxSamples:y}}function i1(s){const t=this;let e=null,n=0,i=!1,o=!1;const a=new zi,r=new Qt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const d=u.length!==0||f||n!==0||i;return i=f,n=u.length,d},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,d){const v=u.clippingPlanes,g=u.clipIntersection,x=u.clipShadows,p=s.get(u);if(!i||v===null||v.length===0||o&&!x)o?h(null):c();else{const m=o?0:n,M=m*4;let _=p.clippingState||null;l.value=_,_=h(v,f,M,d);for(let E=0;E!==M;++E)_[E]=e[E];p.clippingState=_,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=m}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,d,v){const g=u!==null?u.length:0;let x=null;if(g!==0){if(x=l.value,v!==!0||x===null){const p=d+g*4,m=f.matrixWorldInverse;r.getNormalMatrix(m),(x===null||x.length<p)&&(x=new Float32Array(p));for(let M=0,_=d;M!==g;++M,_+=4)a.copy(u[M]).applyMatrix4(m,r),a.normal.toArray(x,_),x[_+3]=a.constant}l.value=x,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,x}}function s1(s){let t=new WeakMap;function e(a,r){return r===rl?a.mapping=Is:r===ll&&(a.mapping=Us),a}function n(a){if(a&&a.isTexture){const r=a.mapping;if(r===rl||r===ll)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new gd(l.height/2);return c.fromEquirectangularTexture(s,a),t.set(a,c),a.addEventListener("dispose",i),e(c.texture,a.mapping)}else return null}}return a}function i(a){const r=a.target;r.removeEventListener("dispose",i);const l=t.get(r);l!==void 0&&(t.delete(r),l.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}class Lo extends Uu{constructor(t=-1,e=1,n=1,i=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-t,a=n+t,r=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,a=o+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ts=4,qc=[.125,.215,.35,.446,.526,.582],Ui=20,Tr=new Lo,Xc=new It;let Cr=null,Rr=0,kr=0;const Di=(1+Math.sqrt(5))/2,ps=1/Di,jc=[new q(1,1,1),new q(-1,1,1),new q(1,1,-1),new q(-1,1,-1),new q(0,Di,ps),new q(0,Di,-ps),new q(ps,0,Di),new q(-ps,0,Di),new q(Di,ps,0),new q(-Di,ps,0)];class Yc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Cr=this._renderer.getRenderTarget(),Rr=this._renderer.getActiveCubeFace(),kr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(t,n,i,o),e>0&&this._blur(o,0,0,e),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Cr,Rr,kr),t.scissorTest=!1,na(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Is||t.mapping===Us?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Cr=this._renderer.getRenderTarget(),Rr=this._renderer.getActiveCubeFace(),kr=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ve,minFilter:ve,generateMipmaps:!1,type:ai,format:Ke,colorSpace:ri,depthBuffer:!1},i=$c(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$c(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=o1(o)),this._blurMaterial=a1(o,t,e)}return i}_compileMaterial(t){const e=new ue(this._lodPlanes[0],t);this._renderer.compile(e,Tr)}_sceneToCubeUV(t,e,n,i){const r=new rn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Xc),h.toneMapping=_i,h.autoClear=!1;const d=new zu({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),v=new ue(new Po,d);let g=!1;const x=t.background;x?x.isColor&&(d.color.copy(x),t.background=null,g=!0):(d.color.copy(Xc),g=!0);for(let p=0;p<6;p++){const m=p%3;m===0?(r.up.set(0,l[p],0),r.lookAt(c[p],0,0)):m===1?(r.up.set(0,0,l[p]),r.lookAt(0,c[p],0)):(r.up.set(0,l[p],0),r.lookAt(0,0,c[p]));const M=this._cubeSize;na(i,m*M,p>2?M:0,M,M),h.setRenderTarget(i),g&&h.render(v,r),h.render(t,r)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Is||t.mapping===Us;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kc());const o=i?this._cubemapMaterial:this._equirectMaterial,a=new ue(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const l=this._cubeSize;na(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Tr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const o=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),a=jc[(i-1)%jc.length];this._blur(t,i-1,i,o,a)}e.autoClear=n}_blur(t,e,n,i,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",o),this._halfBlur(a,t,n,n,i,"longitudinal",o)}_halfBlur(t,e,n,i,o,a,r){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ue(this._lodPlanes[i],c),f=c.uniforms,d=this._sizeLods[n]-1,v=isFinite(o)?Math.PI/(2*d):2*Math.PI/(2*Ui-1),g=o/v,x=isFinite(o)?1+Math.floor(h*g):Ui;x>Ui&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Ui}`);const p=[];let m=0;for(let w=0;w<Ui;++w){const A=w/g,b=Math.exp(-A*A/2);p.push(b),w===0?m+=b:w<x&&(m+=2*b)}for(let w=0;w<p.length;w++)p[w]=p[w]/m;f.envMap.value=t.texture,f.samples.value=x,f.weights.value=p,f.latitudinal.value=a==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:M}=this;f.dTheta.value=v,f.mipInt.value=M-n;const _=this._sizeLods[i],E=3*_*(i>M-Ts?i-M+Ts:0),y=4*(this._cubeSize-_);na(e,E,y,3*_,2*_),l.setRenderTarget(e),l.render(u,Tr)}}function o1(s){const t=[],e=[],n=[];let i=s;const o=s-Ts+1+qc.length;for(let a=0;a<o;a++){const r=Math.pow(2,i);e.push(r);let l=1/r;a>s-Ts?l=qc[a-s+Ts-1]:a===0&&(l=0),n.push(l);const c=1/(r-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,v=6,g=3,x=2,p=1,m=new Float32Array(g*v*d),M=new Float32Array(x*v*d),_=new Float32Array(p*v*d);for(let y=0;y<d;y++){const w=y%3*2/3-1,A=y>2?0:-1,b=[w,A,0,w+2/3,A,0,w+2/3,A+1,0,w,A,0,w+2/3,A+1,0,w,A+1,0];m.set(b,g*v*y),M.set(f,x*v*y);const S=[y,y,y,y,y,y];_.set(S,p*v*y)}const E=new Fe;E.setAttribute("position",new he(m,g)),E.setAttribute("uv",new he(M,x)),E.setAttribute("faceIndex",new he(_,p)),t.push(E),i>Ts&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function $c(s,t,e){const n=new vn(s,t,e);return n.texture.mapping=Va,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function na(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function a1(s,t,e){const n=new Float32Array(Ui),i=new q(0,1,0);return new Ce({name:"SphericalGaussianBlur",defines:{n:Ui,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Kc(){return new Ce({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fl(),fragmentShader:`

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
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Zc(){return new Ce({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function Fl(){return`

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
	`}function r1(s){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const l=r.mapping,c=l===rl||l===ll,h=l===Is||l===Us;if(c||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=t.get(r);return e===null&&(e=new Yc(s)),u=c?e.fromEquirectangular(r,u):e.fromCubemap(r,u),t.set(r,u),u.texture}else{if(t.has(r))return t.get(r).texture;{const u=r.image;if(c&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new Yc(s));const f=c?e.fromEquirectangular(r):e.fromCubemap(r);return t.set(r,f),r.addEventListener("dispose",o),f.texture}else return null}}}return r}function i(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function o(r){const l=r.target;l.removeEventListener("dispose",o);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function l1(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function c1(s,t,e,n){const i={},o=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const v in f.attributes)t.remove(f.attributes[v]);for(const v in f.morphAttributes){const g=f.morphAttributes[v];for(let x=0,p=g.length;x<p;x++)t.remove(g[x])}f.removeEventListener("dispose",a),delete i[f.id];const d=o.get(f);d&&(t.remove(d),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function r(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const v in f)t.update(f[v],s.ARRAY_BUFFER);const d=u.morphAttributes;for(const v in d){const g=d[v];for(let x=0,p=g.length;x<p;x++)t.update(g[x],s.ARRAY_BUFFER)}}function c(u){const f=[],d=u.index,v=u.attributes.position;let g=0;if(d!==null){const m=d.array;g=d.version;for(let M=0,_=m.length;M<_;M+=3){const E=m[M+0],y=m[M+1],w=m[M+2];f.push(E,y,y,w,w,E)}}else if(v!==void 0){const m=v.array;g=v.version;for(let M=0,_=m.length/3-1;M<_;M+=3){const E=M+0,y=M+1,w=M+2;f.push(E,y,y,w,w,E)}}else return;const x=new(Cu(f)?Fu:Du)(f,1);x.version=g;const p=o.get(u);p&&t.remove(p),o.set(u,x)}function h(u){const f=o.get(u);if(f){const d=u.index;d!==null&&f.version<d.version&&c(u)}else c(u);return o.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function h1(s,t,e,n){const i=n.isWebGL2;let o;function a(d){o=d}let r,l;function c(d){r=d.type,l=d.bytesPerElement}function h(d,v){s.drawElements(o,v,r,d*l),e.update(v,o,1)}function u(d,v,g){if(g===0)return;let x,p;if(i)x=s,p="drawElementsInstanced";else if(x=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",x===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}x[p](o,v,r,d*l,g),e.update(v,o,g)}function f(d,v,g){if(g===0)return;const x=t.get("WEBGL_multi_draw");if(x===null)for(let p=0;p<g;p++)this.render(d[p]/l,v[p]);else{x.multiDrawElementsWEBGL(o,v,0,r,d,0,g);let p=0;for(let m=0;m<g;m++)p+=v[m];e.update(p,o,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function u1(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,a,r){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=r*(o/3);break;case s.LINES:e.lines+=r*(o/2);break;case s.LINE_STRIP:e.lines+=r*(o-1);break;case s.LINE_LOOP:e.lines+=r*o;break;case s.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function f1(s,t){return s[0]-t[0]}function d1(s,t){return Math.abs(t[1])-Math.abs(s[1])}function p1(s,t,e){const n={},i=new Float32Array(8),o=new WeakMap,a=new _e,r=[];for(let c=0;c<8;c++)r[c]=[c,0];function l(c,h,u){const f=c.morphTargetInfluences;if(t.isWebGL2===!0){const d=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=d!==void 0?d.length:0;let g=o.get(h);if(g===void 0||g.count!==v){let T=function(){k.dispose(),o.delete(h),h.removeEventListener("dispose",T)};g!==void 0&&g.texture.dispose();const m=h.morphAttributes.position!==void 0,M=h.morphAttributes.normal!==void 0,_=h.morphAttributes.color!==void 0,E=h.morphAttributes.position||[],y=h.morphAttributes.normal||[],w=h.morphAttributes.color||[];let A=0;m===!0&&(A=1),M===!0&&(A=2),_===!0&&(A=3);let b=h.attributes.position.count*A,S=1;b>t.maxTextureSize&&(S=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const R=new Float32Array(b*S*4*v),k=new Pu(R,b,S,v);k.type=In,k.needsUpdate=!0;const I=A*4;for(let C=0;C<v;C++){const F=E[C],N=y[C],z=w[C],U=b*S*4*C;for(let L=0;L<F.count;L++){const W=L*I;m===!0&&(a.fromBufferAttribute(F,L),R[U+W+0]=a.x,R[U+W+1]=a.y,R[U+W+2]=a.z,R[U+W+3]=0),M===!0&&(a.fromBufferAttribute(N,L),R[U+W+4]=a.x,R[U+W+5]=a.y,R[U+W+6]=a.z,R[U+W+7]=0),_===!0&&(a.fromBufferAttribute(z,L),R[U+W+8]=a.x,R[U+W+9]=a.y,R[U+W+10]=a.z,R[U+W+11]=z.itemSize===4?a.w:1)}}g={count:v,texture:k,size:new Ot(b,S)},o.set(h,g),h.addEventListener("dispose",T)}let x=0;for(let m=0;m<f.length;m++)x+=f[m];const p=h.morphTargetsRelative?1:1-x;u.getUniforms().setValue(s,"morphTargetBaseInfluence",p),u.getUniforms().setValue(s,"morphTargetInfluences",f),u.getUniforms().setValue(s,"morphTargetsTexture",g.texture,e),u.getUniforms().setValue(s,"morphTargetsTextureSize",g.size)}else{const d=f===void 0?0:f.length;let v=n[h.id];if(v===void 0||v.length!==d){v=[];for(let M=0;M<d;M++)v[M]=[M,0];n[h.id]=v}for(let M=0;M<d;M++){const _=v[M];_[0]=M,_[1]=f[M]}v.sort(d1);for(let M=0;M<8;M++)M<d&&v[M][1]?(r[M][0]=v[M][0],r[M][1]=v[M][1]):(r[M][0]=Number.MAX_SAFE_INTEGER,r[M][1]=0);r.sort(f1);const g=h.morphAttributes.position,x=h.morphAttributes.normal;let p=0;for(let M=0;M<8;M++){const _=r[M],E=_[0],y=_[1];E!==Number.MAX_SAFE_INTEGER&&y?(g&&h.getAttribute("morphTarget"+M)!==g[E]&&h.setAttribute("morphTarget"+M,g[E]),x&&h.getAttribute("morphNormal"+M)!==x[E]&&h.setAttribute("morphNormal"+M,x[E]),i[M]=y,p+=y):(g&&h.hasAttribute("morphTarget"+M)===!0&&h.deleteAttribute("morphTarget"+M),x&&h.hasAttribute("morphNormal"+M)===!0&&h.deleteAttribute("morphNormal"+M),i[M]=0)}const m=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",m),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function m1(s,t,e,n){let i=new WeakMap;function o(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function a(){i=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:o,dispose:a}}class Il extends hn{constructor(t,e,n,i,o,a,r,l,c,h){if(h=h!==void 0?h:Oi,h!==Oi&&h!==Ns)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Oi&&(n=ei),n===void 0&&h===Ns&&(n=Ni),super(null,i,o,a,r,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=r!==void 0?r:Se,this.minFilter=l!==void 0?l:Se,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Bu=new hn,Hu=new Il(1,1);Hu.compareFunction=Tu;const Gu=new Pu,Wu=new fl,Vu=new Nu,Jc=[],Qc=[],th=new Float32Array(16),eh=new Float32Array(9),nh=new Float32Array(4);function Vs(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let o=Jc[i];if(o===void 0&&(o=new Float32Array(i),Jc[i]=o),t!==0){n.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,s[a].toArray(o,r)}return o}function Ue(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Ne(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Xa(s,t){let e=Qc[t];e===void 0&&(e=new Int32Array(t),Qc[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function g1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function x1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;s.uniform2fv(this.addr,t),Ne(e,t)}}function v1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ue(e,t))return;s.uniform3fv(this.addr,t),Ne(e,t)}}function M1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;s.uniform4fv(this.addr,t),Ne(e,t)}}function _1(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;nh.set(n),s.uniformMatrix2fv(this.addr,!1,nh),Ne(e,n)}}function w1(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;eh.set(n),s.uniformMatrix3fv(this.addr,!1,eh),Ne(e,n)}}function y1(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ue(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Ne(e,t)}else{if(Ue(e,n))return;th.set(n),s.uniformMatrix4fv(this.addr,!1,th),Ne(e,n)}}function b1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function S1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;s.uniform2iv(this.addr,t),Ne(e,t)}}function E1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;s.uniform3iv(this.addr,t),Ne(e,t)}}function A1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;s.uniform4iv(this.addr,t),Ne(e,t)}}function T1(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function C1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ue(e,t))return;s.uniform2uiv(this.addr,t),Ne(e,t)}}function R1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ue(e,t))return;s.uniform3uiv(this.addr,t),Ne(e,t)}}function k1(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ue(e,t))return;s.uniform4uiv(this.addr,t),Ne(e,t)}}function P1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const o=this.type===s.SAMPLER_2D_SHADOW?Hu:Bu;e.setTexture2D(t||o,i)}function L1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Wu,i)}function z1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Vu,i)}function D1(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Gu,i)}function F1(s){switch(s){case 5126:return g1;case 35664:return x1;case 35665:return v1;case 35666:return M1;case 35674:return _1;case 35675:return w1;case 35676:return y1;case 5124:case 35670:return b1;case 35667:case 35671:return S1;case 35668:case 35672:return E1;case 35669:case 35673:return A1;case 5125:return T1;case 36294:return C1;case 36295:return R1;case 36296:return k1;case 35678:case 36198:case 36298:case 36306:case 35682:return P1;case 35679:case 36299:case 36307:return L1;case 35680:case 36300:case 36308:case 36293:return z1;case 36289:case 36303:case 36311:case 36292:return D1}}function I1(s,t){s.uniform1fv(this.addr,t)}function U1(s,t){const e=Vs(t,this.size,2);s.uniform2fv(this.addr,e)}function N1(s,t){const e=Vs(t,this.size,3);s.uniform3fv(this.addr,e)}function O1(s,t){const e=Vs(t,this.size,4);s.uniform4fv(this.addr,e)}function B1(s,t){const e=Vs(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function H1(s,t){const e=Vs(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function G1(s,t){const e=Vs(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function W1(s,t){s.uniform1iv(this.addr,t)}function V1(s,t){s.uniform2iv(this.addr,t)}function q1(s,t){s.uniform3iv(this.addr,t)}function X1(s,t){s.uniform4iv(this.addr,t)}function j1(s,t){s.uniform1uiv(this.addr,t)}function Y1(s,t){s.uniform2uiv(this.addr,t)}function $1(s,t){s.uniform3uiv(this.addr,t)}function K1(s,t){s.uniform4uiv(this.addr,t)}function Z1(s,t,e){const n=this.cache,i=t.length,o=Xa(e,i);Ue(n,o)||(s.uniform1iv(this.addr,o),Ne(n,o));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||Bu,o[a])}function J1(s,t,e){const n=this.cache,i=t.length,o=Xa(e,i);Ue(n,o)||(s.uniform1iv(this.addr,o),Ne(n,o));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||Wu,o[a])}function Q1(s,t,e){const n=this.cache,i=t.length,o=Xa(e,i);Ue(n,o)||(s.uniform1iv(this.addr,o),Ne(n,o));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||Vu,o[a])}function tg(s,t,e){const n=this.cache,i=t.length,o=Xa(e,i);Ue(n,o)||(s.uniform1iv(this.addr,o),Ne(n,o));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Gu,o[a])}function eg(s){switch(s){case 5126:return I1;case 35664:return U1;case 35665:return N1;case 35666:return O1;case 35674:return B1;case 35675:return H1;case 35676:return G1;case 5124:case 35670:return W1;case 35667:case 35671:return V1;case 35668:case 35672:return q1;case 35669:case 35673:return X1;case 5125:return j1;case 36294:return Y1;case 36295:return $1;case 36296:return K1;case 35678:case 36198:case 36298:case 36306:case 35682:return Z1;case 35679:case 36299:case 36307:return J1;case 35680:case 36300:case 36308:case 36293:return Q1;case 36289:case 36303:case 36311:case 36292:return tg}}class ng{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=F1(e.type)}}class ig{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=eg(e.type)}}class sg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let o=0,a=i.length;o!==a;++o){const r=i[o];r.setValue(t,e[r.id],n)}}}const Pr=/(\w+)(\])?(\[|\.)?/g;function ih(s,t){s.seq.push(t),s.map[t.id]=t}function og(s,t,e){const n=s.name,i=n.length;for(Pr.lastIndex=0;;){const o=Pr.exec(n),a=Pr.lastIndex;let r=o[1];const l=o[2]==="]",c=o[3];if(l&&(r=r|0),c===void 0||c==="["&&a+2===i){ih(e,c===void 0?new ng(r,s,t):new ig(r,s,t));break}else{let u=e.map[r];u===void 0&&(u=new sg(r),ih(e,u)),e=u}}}class ba{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=t.getActiveUniform(e,i),a=t.getUniformLocation(e,o.name);og(o,a,this)}}setValue(t,e,n,i){const o=this.map[e];o!==void 0&&o.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let o=0,a=e.length;o!==a;++o){const r=e[o],l=n[r.id];l.needsUpdate!==!1&&r.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,o=t.length;i!==o;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function sh(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const ag=37297;let rg=0;function lg(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=i;a<o;a++){const r=a+1;n.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return n.join(`
`)}function cg(s){const t=de.getPrimaries(de.workingColorSpace),e=de.getPrimaries(s);let n;switch(t===e?n="":t===Fa&&e===Da?n="LinearDisplayP3ToLinearSRGB":t===Da&&e===Fa&&(n="LinearSRGBToLinearDisplayP3"),s){case ri:case qa:return[n,"LinearTransferOETF"];case Ge:case kl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function oh(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const o=/ERROR: 0:(\d+)/.exec(i);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+i+`

`+lg(s.getShaderSource(t),a)}else return i}function hg(s,t){const e=cg(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function ug(s,t){let e;switch(t){case af:e="Linear";break;case rf:e="Reinhard";break;case lf:e="OptimizedCineon";break;case cf:e="ACESFilmic";break;case uf:e="AgX";break;case hf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function fg(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Cs).join(`
`)}function dg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Cs).join(`
`)}function pg(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function mg(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=s.getActiveAttrib(t,i),a=o.name;let r=1;o.type===s.FLOAT_MAT2&&(r=2),o.type===s.FLOAT_MAT3&&(r=3),o.type===s.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:s.getAttribLocation(t,a),locationSize:r}}return e}function Cs(s){return s!==""}function ah(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const gg=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(s){return s.replace(gg,vg)}const xg=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function vg(s,t){let e=Kt[t];if(e===void 0){const n=xg.get(t);if(n!==void 0)e=Kt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return dl(e)}const Mg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function lh(s){return s.replace(Mg,_g)}function _g(s,t,e,n){let i="";for(let o=parseInt(t);o<parseInt(e);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function ch(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function wg(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===gu?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===z0?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Kn&&(t="SHADOWMAP_TYPE_VSM"),t}function yg(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Is:case Us:t="ENVMAP_TYPE_CUBE";break;case Va:t="ENVMAP_TYPE_CUBE_UV";break}return t}function bg(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Us:t="ENVMAP_MODE_REFRACTION";break}return t}function Sg(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case xu:t="ENVMAP_BLENDING_MULTIPLY";break;case sf:t="ENVMAP_BLENDING_MIX";break;case of:t="ENVMAP_BLENDING_ADD";break}return t}function Eg(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Ag(s,t,e,n){const i=s.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const l=wg(e),c=yg(e),h=bg(e),u=Sg(e),f=Eg(e),d=e.isWebGL2?"":fg(e),v=dg(e),g=pg(o),x=i.createProgram();let p,m,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Cs).join(`
`),p.length>0&&(p+=`
`),m=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Cs).join(`
`),m.length>0&&(m+=`
`)):(p=[ch(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Cs).join(`
`),m=[d,ch(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==_i?"#define TONE_MAPPING":"",e.toneMapping!==_i?Kt.tonemapping_pars_fragment:"",e.toneMapping!==_i?ug("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,hg("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Cs).join(`
`)),a=dl(a),a=ah(a,e),a=rh(a,e),r=dl(r),r=ah(r,e),r=rh(r,e),a=lh(a),r=lh(r),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Ac?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ac?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=M+p+a,E=M+m+r,y=sh(i,i.VERTEX_SHADER,_),w=sh(i,i.FRAGMENT_SHADER,E);i.attachShader(x,y),i.attachShader(x,w),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function A(k){if(s.debug.checkShaderErrors){const I=i.getProgramInfoLog(x).trim(),T=i.getShaderInfoLog(y).trim(),C=i.getShaderInfoLog(w).trim();let F=!0,N=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(F=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,y,w);else{const z=oh(i,y,"vertex"),U=oh(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Program Info Log: `+I+`
`+z+`
`+U)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(T===""||C==="")&&(N=!1);N&&(k.diagnostics={runnable:F,programLog:I,vertexShader:{log:T,prefix:p},fragmentShader:{log:C,prefix:m}})}i.deleteShader(y),i.deleteShader(w),b=new ba(i,x),S=mg(i,x)}let b;this.getUniforms=function(){return b===void 0&&A(this),b};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(x,ag)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=rg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=y,this.fragmentShader=w,this}let Tg=0;class Cg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),o=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Rg(t),e.set(t,n)),n}}class Rg{constructor(t){this.id=Tg++,this.code=t,this.usedTimes=0}}function kg(s,t,e,n,i,o,a){const r=new zl,l=new Cg,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,f=i.vertexTextures;let d=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(b){return b===0?"uv":`uv${b}`}function x(b,S,R,k,I){const T=k.fog,C=I.geometry,F=b.isMeshStandardMaterial?k.environment:null,N=(b.isMeshStandardMaterial?e:t).get(b.envMap||F),z=N&&N.mapping===Va?N.image.height:null,U=v[b.type];b.precision!==null&&(d=i.getMaxPrecision(b.precision),d!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",d,"instead."));const L=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,W=L!==void 0?L.length:0;let j=0;C.morphAttributes.position!==void 0&&(j=1),C.morphAttributes.normal!==void 0&&(j=2),C.morphAttributes.color!==void 0&&(j=3);let P,O,G,K;if(U){const we=Gn[U];P=we.vertexShader,O=we.fragmentShader}else P=b.vertexShader,O=b.fragmentShader,l.update(b),G=l.getVertexShaderID(b),K=l.getFragmentShaderID(b);const Q=s.getRenderTarget(),ot=I.isInstancedMesh===!0,$=I.isBatchedMesh===!0,Y=!!b.map,rt=!!b.matcap,X=!!N,Mt=!!b.aoMap,mt=!!b.lightMap,_t=!!b.bumpMap,xt=!!b.normalMap,kt=!!b.displacementMap,at=!!b.emissiveMap,B=!!b.metalnessMap,D=!!b.roughnessMap,J=b.anisotropy>0,ut=b.clearcoat>0,ct=b.iridescence>0,ft=b.sheen>0,Rt=b.transmission>0,vt=J&&!!b.anisotropyMap,gt=ut&&!!b.clearcoatMap,Ct=ut&&!!b.clearcoatNormalMap,Lt=ut&&!!b.clearcoatRoughnessMap,dt=ct&&!!b.iridescenceMap,se=ct&&!!b.iridescenceThicknessMap,Xt=ft&&!!b.sheenColorMap,Bt=ft&&!!b.sheenRoughnessMap,zt=!!b.specularMap,pt=!!b.specularColorMap,bt=!!b.specularIntensityMap,ee=Rt&&!!b.transmissionMap,fe=Rt&&!!b.thicknessMap,Yt=!!b.gradientMap,wt=!!b.alphaMap,Z=b.alphaTest>0,St=!!b.alphaHash,Et=!!b.extensions,Ut=!!C.attributes.uv1,Dt=!!C.attributes.uv2,ne=!!C.attributes.uv3;let ce=_i;return b.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(ce=s.toneMapping),{isWebGL2:h,shaderID:U,shaderType:b.type,shaderName:b.name,vertexShader:P,fragmentShader:O,defines:b.defines,customVertexShaderID:G,customFragmentShaderID:K,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:d,batching:$,instancing:ot,instancingColor:ot&&I.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:Q===null?s.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:ri,map:Y,matcap:rt,envMap:X,envMapMode:X&&N.mapping,envMapCubeUVHeight:z,aoMap:Mt,lightMap:mt,bumpMap:_t,normalMap:xt,displacementMap:f&&kt,emissiveMap:at,normalMapObjectSpace:xt&&b.normalMapType===bf,normalMapTangentSpace:xt&&b.normalMapType===yf,metalnessMap:B,roughnessMap:D,anisotropy:J,anisotropyMap:vt,clearcoat:ut,clearcoatMap:gt,clearcoatNormalMap:Ct,clearcoatRoughnessMap:Lt,iridescence:ct,iridescenceMap:dt,iridescenceThicknessMap:se,sheen:ft,sheenColorMap:Xt,sheenRoughnessMap:Bt,specularMap:zt,specularColorMap:pt,specularIntensityMap:bt,transmission:Rt,transmissionMap:ee,thicknessMap:fe,gradientMap:Yt,opaque:b.transparent===!1&&b.blending===Ls,alphaMap:wt,alphaTest:Z,alphaHash:St,combine:b.combine,mapUv:Y&&g(b.map.channel),aoMapUv:Mt&&g(b.aoMap.channel),lightMapUv:mt&&g(b.lightMap.channel),bumpMapUv:_t&&g(b.bumpMap.channel),normalMapUv:xt&&g(b.normalMap.channel),displacementMapUv:kt&&g(b.displacementMap.channel),emissiveMapUv:at&&g(b.emissiveMap.channel),metalnessMapUv:B&&g(b.metalnessMap.channel),roughnessMapUv:D&&g(b.roughnessMap.channel),anisotropyMapUv:vt&&g(b.anisotropyMap.channel),clearcoatMapUv:gt&&g(b.clearcoatMap.channel),clearcoatNormalMapUv:Ct&&g(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Lt&&g(b.clearcoatRoughnessMap.channel),iridescenceMapUv:dt&&g(b.iridescenceMap.channel),iridescenceThicknessMapUv:se&&g(b.iridescenceThicknessMap.channel),sheenColorMapUv:Xt&&g(b.sheenColorMap.channel),sheenRoughnessMapUv:Bt&&g(b.sheenRoughnessMap.channel),specularMapUv:zt&&g(b.specularMap.channel),specularColorMapUv:pt&&g(b.specularColorMap.channel),specularIntensityMapUv:bt&&g(b.specularIntensityMap.channel),transmissionMapUv:ee&&g(b.transmissionMap.channel),thicknessMapUv:fe&&g(b.thicknessMap.channel),alphaMapUv:wt&&g(b.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(xt||J),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,vertexUv1s:Ut,vertexUv2s:Dt,vertexUv3s:ne,pointsUvs:I.isPoints===!0&&!!C.attributes.uv&&(Y||wt),fog:!!T,useFog:b.fog===!0,fogExp2:T&&T.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:I.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:W,morphTextureStride:j,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:ce,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Y&&b.map.isVideoTexture===!0&&de.getTransfer(b.map.colorSpace)===ye,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ln,flipSided:b.side===en,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionDerivatives:Et&&b.extensions.derivatives===!0,extensionFragDepth:Et&&b.extensions.fragDepth===!0,extensionDrawBuffers:Et&&b.extensions.drawBuffers===!0,extensionShaderTextureLOD:Et&&b.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Et&&b.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()}}function p(b){const S=[];if(b.shaderID?S.push(b.shaderID):(S.push(b.customVertexShaderID),S.push(b.customFragmentShaderID)),b.defines!==void 0)for(const R in b.defines)S.push(R),S.push(b.defines[R]);return b.isRawShaderMaterial===!1&&(m(S,b),M(S,b),S.push(s.outputColorSpace)),S.push(b.customProgramCacheKey),S.join()}function m(b,S){b.push(S.precision),b.push(S.outputColorSpace),b.push(S.envMapMode),b.push(S.envMapCubeUVHeight),b.push(S.mapUv),b.push(S.alphaMapUv),b.push(S.lightMapUv),b.push(S.aoMapUv),b.push(S.bumpMapUv),b.push(S.normalMapUv),b.push(S.displacementMapUv),b.push(S.emissiveMapUv),b.push(S.metalnessMapUv),b.push(S.roughnessMapUv),b.push(S.anisotropyMapUv),b.push(S.clearcoatMapUv),b.push(S.clearcoatNormalMapUv),b.push(S.clearcoatRoughnessMapUv),b.push(S.iridescenceMapUv),b.push(S.iridescenceThicknessMapUv),b.push(S.sheenColorMapUv),b.push(S.sheenRoughnessMapUv),b.push(S.specularMapUv),b.push(S.specularColorMapUv),b.push(S.specularIntensityMapUv),b.push(S.transmissionMapUv),b.push(S.thicknessMapUv),b.push(S.combine),b.push(S.fogExp2),b.push(S.sizeAttenuation),b.push(S.morphTargetsCount),b.push(S.morphAttributeCount),b.push(S.numDirLights),b.push(S.numPointLights),b.push(S.numSpotLights),b.push(S.numSpotLightMaps),b.push(S.numHemiLights),b.push(S.numRectAreaLights),b.push(S.numDirLightShadows),b.push(S.numPointLightShadows),b.push(S.numSpotLightShadows),b.push(S.numSpotLightShadowsWithMaps),b.push(S.numLightProbes),b.push(S.shadowMapType),b.push(S.toneMapping),b.push(S.numClippingPlanes),b.push(S.numClipIntersection),b.push(S.depthPacking)}function M(b,S){r.disableAll(),S.isWebGL2&&r.enable(0),S.supportsVertexTextures&&r.enable(1),S.instancing&&r.enable(2),S.instancingColor&&r.enable(3),S.matcap&&r.enable(4),S.envMap&&r.enable(5),S.normalMapObjectSpace&&r.enable(6),S.normalMapTangentSpace&&r.enable(7),S.clearcoat&&r.enable(8),S.iridescence&&r.enable(9),S.alphaTest&&r.enable(10),S.vertexColors&&r.enable(11),S.vertexAlphas&&r.enable(12),S.vertexUv1s&&r.enable(13),S.vertexUv2s&&r.enable(14),S.vertexUv3s&&r.enable(15),S.vertexTangents&&r.enable(16),S.anisotropy&&r.enable(17),S.alphaHash&&r.enable(18),S.batching&&r.enable(19),b.push(r.mask),r.disableAll(),S.fog&&r.enable(0),S.useFog&&r.enable(1),S.flatShading&&r.enable(2),S.logarithmicDepthBuffer&&r.enable(3),S.skinning&&r.enable(4),S.morphTargets&&r.enable(5),S.morphNormals&&r.enable(6),S.morphColors&&r.enable(7),S.premultipliedAlpha&&r.enable(8),S.shadowMapEnabled&&r.enable(9),S.useLegacyLights&&r.enable(10),S.doubleSided&&r.enable(11),S.flipSided&&r.enable(12),S.useDepthPacking&&r.enable(13),S.dithering&&r.enable(14),S.transmission&&r.enable(15),S.sheen&&r.enable(16),S.opaque&&r.enable(17),S.pointsUvs&&r.enable(18),S.decodeVideoTexture&&r.enable(19),b.push(r.mask)}function _(b){const S=v[b.type];let R;if(S){const k=Gn[S];R=fd.clone(k.uniforms)}else R=b.uniforms;return R}function E(b,S){let R;for(let k=0,I=c.length;k<I;k++){const T=c[k];if(T.cacheKey===S){R=T,++R.usedTimes;break}}return R===void 0&&(R=new Ag(s,S,b,o),c.push(R)),R}function y(b){if(--b.usedTimes===0){const S=c.indexOf(b);c[S]=c[c.length-1],c.pop(),b.destroy()}}function w(b){l.remove(b)}function A(){l.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:_,acquireProgram:E,releaseProgram:y,releaseShaderCache:w,programs:c,dispose:A}}function Pg(){let s=new WeakMap;function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function e(o){s.delete(o)}function n(o,a,r){s.get(o)[a]=r}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Lg(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function hh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function uh(){const s=[];let t=0;const e=[],n=[],i=[];function o(){t=0,e.length=0,n.length=0,i.length=0}function a(u,f,d,v,g,x){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:v,renderOrder:u.renderOrder,z:g,group:x},s[t]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=v,p.renderOrder=u.renderOrder,p.z=g,p.group=x),t++,p}function r(u,f,d,v,g,x){const p=a(u,f,d,v,g,x);d.transmission>0?n.push(p):d.transparent===!0?i.push(p):e.push(p)}function l(u,f,d,v,g,x){const p=a(u,f,d,v,g,x);d.transmission>0?n.unshift(p):d.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,f){e.length>1&&e.sort(u||Lg),n.length>1&&n.sort(f||hh),i.length>1&&i.sort(f||hh)}function h(){for(let u=t,f=s.length;u<f;u++){const d=s[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:o,push:r,unshift:l,finish:h,sort:c}}function zg(){let s=new WeakMap;function t(n,i){const o=s.get(n);let a;return o===void 0?(a=new uh,s.set(n,[a])):i>=o.length?(a=new uh,o.push(a)):a=o[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function Dg(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new q,color:new It};break;case"SpotLight":e={position:new q,direction:new q,color:new It,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new q,color:new It,distance:0,decay:0};break;case"HemisphereLight":e={direction:new q,skyColor:new It,groundColor:new It};break;case"RectAreaLight":e={color:new It,position:new q,halfWidth:new q,halfHeight:new q};break}return s[t.id]=e,e}}}function Fg(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Ig=0;function Ug(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Ng(s,t){const e=new Dg,n=Fg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new q);const o=new q,a=new ie,r=new ie;function l(h,u){let f=0,d=0,v=0;for(let k=0;k<9;k++)i.probe[k].set(0,0,0);let g=0,x=0,p=0,m=0,M=0,_=0,E=0,y=0,w=0,A=0,b=0;h.sort(Ug);const S=u===!0?Math.PI:1;for(let k=0,I=h.length;k<I;k++){const T=h[k],C=T.color,F=T.intensity,N=T.distance,z=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)f+=C.r*F*S,d+=C.g*F*S,v+=C.b*F*S;else if(T.isLightProbe){for(let U=0;U<9;U++)i.probe[U].addScaledVector(T.sh.coefficients[U],F);b++}else if(T.isDirectionalLight){const U=e.get(T);if(U.color.copy(T.color).multiplyScalar(T.intensity*S),T.castShadow){const L=T.shadow,W=n.get(T);W.shadowBias=L.bias,W.shadowNormalBias=L.normalBias,W.shadowRadius=L.radius,W.shadowMapSize=L.mapSize,i.directionalShadow[g]=W,i.directionalShadowMap[g]=z,i.directionalShadowMatrix[g]=T.shadow.matrix,_++}i.directional[g]=U,g++}else if(T.isSpotLight){const U=e.get(T);U.position.setFromMatrixPosition(T.matrixWorld),U.color.copy(C).multiplyScalar(F*S),U.distance=N,U.coneCos=Math.cos(T.angle),U.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),U.decay=T.decay,i.spot[p]=U;const L=T.shadow;if(T.map&&(i.spotLightMap[w]=T.map,w++,L.updateMatrices(T),T.castShadow&&A++),i.spotLightMatrix[p]=L.matrix,T.castShadow){const W=n.get(T);W.shadowBias=L.bias,W.shadowNormalBias=L.normalBias,W.shadowRadius=L.radius,W.shadowMapSize=L.mapSize,i.spotShadow[p]=W,i.spotShadowMap[p]=z,y++}p++}else if(T.isRectAreaLight){const U=e.get(T);U.color.copy(C).multiplyScalar(F),U.halfWidth.set(T.width*.5,0,0),U.halfHeight.set(0,T.height*.5,0),i.rectArea[m]=U,m++}else if(T.isPointLight){const U=e.get(T);if(U.color.copy(T.color).multiplyScalar(T.intensity*S),U.distance=T.distance,U.decay=T.decay,T.castShadow){const L=T.shadow,W=n.get(T);W.shadowBias=L.bias,W.shadowNormalBias=L.normalBias,W.shadowRadius=L.radius,W.shadowMapSize=L.mapSize,W.shadowCameraNear=L.camera.near,W.shadowCameraFar=L.camera.far,i.pointShadow[x]=W,i.pointShadowMap[x]=z,i.pointShadowMatrix[x]=T.shadow.matrix,E++}i.point[x]=U,x++}else if(T.isHemisphereLight){const U=e.get(T);U.skyColor.copy(T.color).multiplyScalar(F*S),U.groundColor.copy(T.groundColor).multiplyScalar(F*S),i.hemi[M]=U,M++}}m>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=yt.LTC_FLOAT_1,i.rectAreaLTC2=yt.LTC_FLOAT_2):(i.rectAreaLTC1=yt.LTC_HALF_1,i.rectAreaLTC2=yt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=yt.LTC_FLOAT_1,i.rectAreaLTC2=yt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=yt.LTC_HALF_1,i.rectAreaLTC2=yt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=d,i.ambient[2]=v;const R=i.hash;(R.directionalLength!==g||R.pointLength!==x||R.spotLength!==p||R.rectAreaLength!==m||R.hemiLength!==M||R.numDirectionalShadows!==_||R.numPointShadows!==E||R.numSpotShadows!==y||R.numSpotMaps!==w||R.numLightProbes!==b)&&(i.directional.length=g,i.spot.length=p,i.rectArea.length=m,i.point.length=x,i.hemi.length=M,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=y+w-A,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=b,R.directionalLength=g,R.pointLength=x,R.spotLength=p,R.rectAreaLength=m,R.hemiLength=M,R.numDirectionalShadows=_,R.numPointShadows=E,R.numSpotShadows=y,R.numSpotMaps=w,R.numLightProbes=b,i.version=Ig++)}function c(h,u){let f=0,d=0,v=0,g=0,x=0;const p=u.matrixWorldInverse;for(let m=0,M=h.length;m<M;m++){const _=h[m];if(_.isDirectionalLight){const E=i.directional[f];E.direction.setFromMatrixPosition(_.matrixWorld),o.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(o),E.direction.transformDirection(p),f++}else if(_.isSpotLight){const E=i.spot[v];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(p),E.direction.setFromMatrixPosition(_.matrixWorld),o.setFromMatrixPosition(_.target.matrixWorld),E.direction.sub(o),E.direction.transformDirection(p),v++}else if(_.isRectAreaLight){const E=i.rectArea[g];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(p),r.identity(),a.copy(_.matrixWorld),a.premultiply(p),r.extractRotation(a),E.halfWidth.set(_.width*.5,0,0),E.halfHeight.set(0,_.height*.5,0),E.halfWidth.applyMatrix4(r),E.halfHeight.applyMatrix4(r),g++}else if(_.isPointLight){const E=i.point[d];E.position.setFromMatrixPosition(_.matrixWorld),E.position.applyMatrix4(p),d++}else if(_.isHemisphereLight){const E=i.hemi[x];E.direction.setFromMatrixPosition(_.matrixWorld),E.direction.transformDirection(p),x++}}}return{setup:l,setupView:c,state:i}}function fh(s,t){const e=new Ng(s,t),n=[],i=[];function o(){n.length=0,i.length=0}function a(u){n.push(u)}function r(u){i.push(u)}function l(u){e.setup(n,u)}function c(u){e.setupView(n,u)}return{init:o,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:r}}function Og(s,t){let e=new WeakMap;function n(o,a=0){const r=e.get(o);let l;return r===void 0?(l=new fh(s,t),e.set(o,[l])):a>=r.length?(l=new fh(s,t),r.push(l)):l=r[a],l}function i(){e=new WeakMap}return{get:n,dispose:i}}class Bg extends ko{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_f,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Hg extends ko{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Gg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wg=`uniform sampler2D shadow_pass;
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
}`;function Vg(s,t,e){let n=new Ws;const i=new Ot,o=new Ot,a=new _e,r=new Bg({depthPacking:wf}),l=new Hg,c={},h=e.maxTextureSize,u={[oi]:en,[en]:oi,[ln]:ln},f=new Ce({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ot},radius:{value:4}},vertexShader:Gg,fragmentShader:Wg}),d=f.clone();d.defines.HORIZONTAL_PASS=1;const v=new Fe;v.setAttribute("position",new he(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ue(v,f),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gu;let p=this.type;this.render=function(y,w,A){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||y.length===0)return;const b=s.getRenderTarget(),S=s.getActiveCubeFace(),R=s.getActiveMipmapLevel(),k=s.state;k.setBlending(Mi),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const I=p!==Kn&&this.type===Kn,T=p===Kn&&this.type!==Kn;for(let C=0,F=y.length;C<F;C++){const N=y[C],z=N.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",N,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;i.copy(z.mapSize);const U=z.getFrameExtents();if(i.multiply(U),o.copy(z.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(o.x=Math.floor(h/U.x),i.x=o.x*U.x,z.mapSize.x=o.x),i.y>h&&(o.y=Math.floor(h/U.y),i.y=o.y*U.y,z.mapSize.y=o.y)),z.map===null||I===!0||T===!0){const W=this.type!==Kn?{minFilter:Se,magFilter:Se}:{};z.map!==null&&z.map.dispose(),z.map=new vn(i.x,i.y,W),z.map.texture.name=N.name+".shadowMap",z.camera.updateProjectionMatrix()}s.setRenderTarget(z.map),s.clear();const L=z.getViewportCount();for(let W=0;W<L;W++){const j=z.getViewport(W);a.set(o.x*j.x,o.y*j.y,o.x*j.z,o.y*j.w),k.viewport(a),z.updateMatrices(N,W),n=z.getFrustum(),_(w,A,z.camera,N,this.type)}z.isPointLightShadow!==!0&&this.type===Kn&&m(z,A),z.needsUpdate=!1}p=this.type,x.needsUpdate=!1,s.setRenderTarget(b,S,R)};function m(y,w){const A=t.update(g);f.defines.VSM_SAMPLES!==y.blurSamples&&(f.defines.VSM_SAMPLES=y.blurSamples,d.defines.VSM_SAMPLES=y.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new vn(i.x,i.y)),f.uniforms.shadow_pass.value=y.map.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,s.setRenderTarget(y.mapPass),s.clear(),s.renderBufferDirect(w,null,A,f,g,null),d.uniforms.shadow_pass.value=y.mapPass.texture,d.uniforms.resolution.value=y.mapSize,d.uniforms.radius.value=y.radius,s.setRenderTarget(y.map),s.clear(),s.renderBufferDirect(w,null,A,d,g,null)}function M(y,w,A,b){let S=null;const R=A.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(R!==void 0)S=R;else if(S=A.isPointLight===!0?l:r,s.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const k=S.uuid,I=w.uuid;let T=c[k];T===void 0&&(T={},c[k]=T);let C=T[I];C===void 0&&(C=S.clone(),T[I]=C,w.addEventListener("dispose",E)),S=C}if(S.visible=w.visible,S.wireframe=w.wireframe,b===Kn?S.side=w.shadowSide!==null?w.shadowSide:w.side:S.side=w.shadowSide!==null?w.shadowSide:u[w.side],S.alphaMap=w.alphaMap,S.alphaTest=w.alphaTest,S.map=w.map,S.clipShadows=w.clipShadows,S.clippingPlanes=w.clippingPlanes,S.clipIntersection=w.clipIntersection,S.displacementMap=w.displacementMap,S.displacementScale=w.displacementScale,S.displacementBias=w.displacementBias,S.wireframeLinewidth=w.wireframeLinewidth,S.linewidth=w.linewidth,A.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const k=s.properties.get(S);k.light=A}return S}function _(y,w,A,b,S){if(y.visible===!1)return;if(y.layers.test(w.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&S===Kn)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,y.matrixWorld);const I=t.update(y),T=y.material;if(Array.isArray(T)){const C=I.groups;for(let F=0,N=C.length;F<N;F++){const z=C[F],U=T[z.materialIndex];if(U&&U.visible){const L=M(y,U,b,S);y.onBeforeShadow(s,y,w,A,I,L,z),s.renderBufferDirect(A,null,I,L,y,z),y.onAfterShadow(s,y,w,A,I,L,z)}}}else if(T.visible){const C=M(y,T,b,S);y.onBeforeShadow(s,y,w,A,I,C,null),s.renderBufferDirect(A,null,I,C,y,null),y.onAfterShadow(s,y,w,A,I,C,null)}}const k=y.children;for(let I=0,T=k.length;I<T;I++)_(k[I],w,A,b,S)}function E(y){y.target.removeEventListener("dispose",E);for(const A in c){const b=c[A],S=y.target.uuid;S in b&&(b[S].dispose(),delete b[S])}}}function qg(s,t,e){const n=e.isWebGL2;function i(){let Z=!1;const St=new _e;let Et=null;const Ut=new _e(0,0,0,0);return{setMask:function(Dt){Et!==Dt&&!Z&&(s.colorMask(Dt,Dt,Dt,Dt),Et=Dt)},setLocked:function(Dt){Z=Dt},setClear:function(Dt,ne,ce,Le,we){we===!0&&(Dt*=Le,ne*=Le,ce*=Le),St.set(Dt,ne,ce,Le),Ut.equals(St)===!1&&(s.clearColor(Dt,ne,ce,Le),Ut.copy(St))},reset:function(){Z=!1,Et=null,Ut.set(-1,0,0,0)}}}function o(){let Z=!1,St=null,Et=null,Ut=null;return{setTest:function(Dt){Dt?$(s.DEPTH_TEST):Y(s.DEPTH_TEST)},setMask:function(Dt){St!==Dt&&!Z&&(s.depthMask(Dt),St=Dt)},setFunc:function(Dt){if(Et!==Dt){switch(Dt){case K0:s.depthFunc(s.NEVER);break;case Z0:s.depthFunc(s.ALWAYS);break;case J0:s.depthFunc(s.LESS);break;case La:s.depthFunc(s.LEQUAL);break;case Q0:s.depthFunc(s.EQUAL);break;case tf:s.depthFunc(s.GEQUAL);break;case ef:s.depthFunc(s.GREATER);break;case nf:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Et=Dt}},setLocked:function(Dt){Z=Dt},setClear:function(Dt){Ut!==Dt&&(s.clearDepth(Dt),Ut=Dt)},reset:function(){Z=!1,St=null,Et=null,Ut=null}}}function a(){let Z=!1,St=null,Et=null,Ut=null,Dt=null,ne=null,ce=null,Le=null,we=null;return{setTest:function(oe){Z||(oe?$(s.STENCIL_TEST):Y(s.STENCIL_TEST))},setMask:function(oe){St!==oe&&!Z&&(s.stencilMask(oe),St=oe)},setFunc:function(oe,Ie,We){(Et!==oe||Ut!==Ie||Dt!==We)&&(s.stencilFunc(oe,Ie,We),Et=oe,Ut=Ie,Dt=We)},setOp:function(oe,Ie,We){(ne!==oe||ce!==Ie||Le!==We)&&(s.stencilOp(oe,Ie,We),ne=oe,ce=Ie,Le=We)},setLocked:function(oe){Z=oe},setClear:function(oe){we!==oe&&(s.clearStencil(oe),we=oe)},reset:function(){Z=!1,St=null,Et=null,Ut=null,Dt=null,ne=null,ce=null,Le=null,we=null}}}const r=new i,l=new o,c=new a,h=new WeakMap,u=new WeakMap;let f={},d={},v=new WeakMap,g=[],x=null,p=!1,m=null,M=null,_=null,E=null,y=null,w=null,A=null,b=new It(0,0,0),S=0,R=!1,k=null,I=null,T=null,C=null,F=null;const N=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,U=0;const L=s.getParameter(s.VERSION);L.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec(L)[1]),z=U>=1):L.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),z=U>=2);let W=null,j={};const P=s.getParameter(s.SCISSOR_BOX),O=s.getParameter(s.VIEWPORT),G=new _e().fromArray(P),K=new _e().fromArray(O);function Q(Z,St,Et,Ut){const Dt=new Uint8Array(4),ne=s.createTexture();s.bindTexture(Z,ne),s.texParameteri(Z,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(Z,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ce=0;ce<Et;ce++)n&&(Z===s.TEXTURE_3D||Z===s.TEXTURE_2D_ARRAY)?s.texImage3D(St,0,s.RGBA,1,1,Ut,0,s.RGBA,s.UNSIGNED_BYTE,Dt):s.texImage2D(St+ce,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Dt);return ne}const ot={};ot[s.TEXTURE_2D]=Q(s.TEXTURE_2D,s.TEXTURE_2D,1),ot[s.TEXTURE_CUBE_MAP]=Q(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(ot[s.TEXTURE_2D_ARRAY]=Q(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ot[s.TEXTURE_3D]=Q(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),l.setClear(1),c.setClear(0),$(s.DEPTH_TEST),l.setFunc(La),at(!1),B(jl),$(s.CULL_FACE),xt(Mi);function $(Z){f[Z]!==!0&&(s.enable(Z),f[Z]=!0)}function Y(Z){f[Z]!==!1&&(s.disable(Z),f[Z]=!1)}function rt(Z,St){return d[Z]!==St?(s.bindFramebuffer(Z,St),d[Z]=St,n&&(Z===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=St),Z===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=St)),!0):!1}function X(Z,St){let Et=g,Ut=!1;if(Z)if(Et=v.get(St),Et===void 0&&(Et=[],v.set(St,Et)),Z.isWebGLMultipleRenderTargets){const Dt=Z.texture;if(Et.length!==Dt.length||Et[0]!==s.COLOR_ATTACHMENT0){for(let ne=0,ce=Dt.length;ne<ce;ne++)Et[ne]=s.COLOR_ATTACHMENT0+ne;Et.length=Dt.length,Ut=!0}}else Et[0]!==s.COLOR_ATTACHMENT0&&(Et[0]=s.COLOR_ATTACHMENT0,Ut=!0);else Et[0]!==s.BACK&&(Et[0]=s.BACK,Ut=!0);Ut&&(e.isWebGL2?s.drawBuffers(Et):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Et))}function Mt(Z){return x!==Z?(s.useProgram(Z),x=Z,!0):!1}const mt={[Ii]:s.FUNC_ADD,[F0]:s.FUNC_SUBTRACT,[I0]:s.FUNC_REVERSE_SUBTRACT};if(n)mt[Kl]=s.MIN,mt[Zl]=s.MAX;else{const Z=t.get("EXT_blend_minmax");Z!==null&&(mt[Kl]=Z.MIN_EXT,mt[Zl]=Z.MAX_EXT)}const _t={[U0]:s.ZERO,[N0]:s.ONE,[O0]:s.SRC_COLOR,[ol]:s.SRC_ALPHA,[q0]:s.SRC_ALPHA_SATURATE,[W0]:s.DST_COLOR,[H0]:s.DST_ALPHA,[B0]:s.ONE_MINUS_SRC_COLOR,[al]:s.ONE_MINUS_SRC_ALPHA,[V0]:s.ONE_MINUS_DST_COLOR,[G0]:s.ONE_MINUS_DST_ALPHA,[X0]:s.CONSTANT_COLOR,[j0]:s.ONE_MINUS_CONSTANT_COLOR,[Y0]:s.CONSTANT_ALPHA,[$0]:s.ONE_MINUS_CONSTANT_ALPHA};function xt(Z,St,Et,Ut,Dt,ne,ce,Le,we,oe){if(Z===Mi){p===!0&&(Y(s.BLEND),p=!1);return}if(p===!1&&($(s.BLEND),p=!0),Z!==D0){if(Z!==m||oe!==R){if((M!==Ii||y!==Ii)&&(s.blendEquation(s.FUNC_ADD),M=Ii,y=Ii),oe)switch(Z){case Ls:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case sl:s.blendFunc(s.ONE,s.ONE);break;case Yl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case $l:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",Z);break}else switch(Z){case Ls:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case sl:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Yl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case $l:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",Z);break}_=null,E=null,w=null,A=null,b.set(0,0,0),S=0,m=Z,R=oe}return}Dt=Dt||St,ne=ne||Et,ce=ce||Ut,(St!==M||Dt!==y)&&(s.blendEquationSeparate(mt[St],mt[Dt]),M=St,y=Dt),(Et!==_||Ut!==E||ne!==w||ce!==A)&&(s.blendFuncSeparate(_t[Et],_t[Ut],_t[ne],_t[ce]),_=Et,E=Ut,w=ne,A=ce),(Le.equals(b)===!1||we!==S)&&(s.blendColor(Le.r,Le.g,Le.b,we),b.copy(Le),S=we),m=Z,R=!1}function kt(Z,St){Z.side===ln?Y(s.CULL_FACE):$(s.CULL_FACE);let Et=Z.side===en;St&&(Et=!Et),at(Et),Z.blending===Ls&&Z.transparent===!1?xt(Mi):xt(Z.blending,Z.blendEquation,Z.blendSrc,Z.blendDst,Z.blendEquationAlpha,Z.blendSrcAlpha,Z.blendDstAlpha,Z.blendColor,Z.blendAlpha,Z.premultipliedAlpha),l.setFunc(Z.depthFunc),l.setTest(Z.depthTest),l.setMask(Z.depthWrite),r.setMask(Z.colorWrite);const Ut=Z.stencilWrite;c.setTest(Ut),Ut&&(c.setMask(Z.stencilWriteMask),c.setFunc(Z.stencilFunc,Z.stencilRef,Z.stencilFuncMask),c.setOp(Z.stencilFail,Z.stencilZFail,Z.stencilZPass)),J(Z.polygonOffset,Z.polygonOffsetFactor,Z.polygonOffsetUnits),Z.alphaToCoverage===!0?$(s.SAMPLE_ALPHA_TO_COVERAGE):Y(s.SAMPLE_ALPHA_TO_COVERAGE)}function at(Z){k!==Z&&(Z?s.frontFace(s.CW):s.frontFace(s.CCW),k=Z)}function B(Z){Z!==P0?($(s.CULL_FACE),Z!==I&&(Z===jl?s.cullFace(s.BACK):Z===L0?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Y(s.CULL_FACE),I=Z}function D(Z){Z!==T&&(z&&s.lineWidth(Z),T=Z)}function J(Z,St,Et){Z?($(s.POLYGON_OFFSET_FILL),(C!==St||F!==Et)&&(s.polygonOffset(St,Et),C=St,F=Et)):Y(s.POLYGON_OFFSET_FILL)}function ut(Z){Z?$(s.SCISSOR_TEST):Y(s.SCISSOR_TEST)}function ct(Z){Z===void 0&&(Z=s.TEXTURE0+N-1),W!==Z&&(s.activeTexture(Z),W=Z)}function ft(Z,St,Et){Et===void 0&&(W===null?Et=s.TEXTURE0+N-1:Et=W);let Ut=j[Et];Ut===void 0&&(Ut={type:void 0,texture:void 0},j[Et]=Ut),(Ut.type!==Z||Ut.texture!==St)&&(W!==Et&&(s.activeTexture(Et),W=Et),s.bindTexture(Z,St||ot[Z]),Ut.type=Z,Ut.texture=St)}function Rt(){const Z=j[W];Z!==void 0&&Z.type!==void 0&&(s.bindTexture(Z.type,null),Z.type=void 0,Z.texture=void 0)}function vt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function gt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Ct(){try{s.texSubImage2D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Lt(){try{s.texSubImage3D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function dt(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function se(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Xt(){try{s.texStorage2D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Bt(){try{s.texStorage3D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function zt(){try{s.texImage2D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function pt(){try{s.texImage3D.apply(s,arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function bt(Z){G.equals(Z)===!1&&(s.scissor(Z.x,Z.y,Z.z,Z.w),G.copy(Z))}function ee(Z){K.equals(Z)===!1&&(s.viewport(Z.x,Z.y,Z.z,Z.w),K.copy(Z))}function fe(Z,St){let Et=u.get(St);Et===void 0&&(Et=new WeakMap,u.set(St,Et));let Ut=Et.get(Z);Ut===void 0&&(Ut=s.getUniformBlockIndex(St,Z.name),Et.set(Z,Ut))}function Yt(Z,St){const Ut=u.get(St).get(Z);h.get(St)!==Ut&&(s.uniformBlockBinding(St,Ut,Z.__bindingPointIndex),h.set(St,Ut))}function wt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),f={},W=null,j={},d={},v=new WeakMap,g=[],x=null,p=!1,m=null,M=null,_=null,E=null,y=null,w=null,A=null,b=new It(0,0,0),S=0,R=!1,k=null,I=null,T=null,C=null,F=null,G.set(0,0,s.canvas.width,s.canvas.height),K.set(0,0,s.canvas.width,s.canvas.height),r.reset(),l.reset(),c.reset()}return{buffers:{color:r,depth:l,stencil:c},enable:$,disable:Y,bindFramebuffer:rt,drawBuffers:X,useProgram:Mt,setBlending:xt,setMaterial:kt,setFlipSided:at,setCullFace:B,setLineWidth:D,setPolygonOffset:J,setScissorTest:ut,activeTexture:ct,bindTexture:ft,unbindTexture:Rt,compressedTexImage2D:vt,compressedTexImage3D:gt,texImage2D:zt,texImage3D:pt,updateUBOMapping:fe,uniformBlockBinding:Yt,texStorage2D:Xt,texStorage3D:Bt,texSubImage2D:Ct,texSubImage3D:Lt,compressedTexSubImage2D:dt,compressedTexSubImage3D:se,scissor:bt,viewport:ee,reset:wt}}function Xg(s,t,e,n,i,o,a){const r=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(B,D){return d?new OffscreenCanvas(B,D):Na("canvas")}function g(B,D,J,ut){let ct=1;if((B.width>ut||B.height>ut)&&(ct=ut/Math.max(B.width,B.height)),ct<1||D===!0)if(typeof HTMLImageElement<"u"&&B instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&B instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&B instanceof ImageBitmap){const ft=D?Ua:Math.floor,Rt=ft(ct*B.width),vt=ft(ct*B.height);u===void 0&&(u=v(Rt,vt));const gt=J?v(Rt,vt):u;return gt.width=Rt,gt.height=vt,gt.getContext("2d").drawImage(B,0,0,Rt,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+B.width+"x"+B.height+") to ("+Rt+"x"+vt+")."),gt}else return"data"in B&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+B.width+"x"+B.height+")."),B;return B}function x(B){return ul(B.width)&&ul(B.height)}function p(B){return r?!1:B.wrapS!==cn||B.wrapT!==cn||B.minFilter!==Se&&B.minFilter!==ve}function m(B,D){return B.generateMipmaps&&D&&B.minFilter!==Se&&B.minFilter!==ve}function M(B){s.generateMipmap(B)}function _(B,D,J,ut,ct=!1){if(r===!1)return D;if(B!==null){if(s[B]!==void 0)return s[B];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+B+"'")}let ft=D;if(D===s.RED&&(J===s.FLOAT&&(ft=s.R32F),J===s.HALF_FLOAT&&(ft=s.R16F),J===s.UNSIGNED_BYTE&&(ft=s.R8)),D===s.RED_INTEGER&&(J===s.UNSIGNED_BYTE&&(ft=s.R8UI),J===s.UNSIGNED_SHORT&&(ft=s.R16UI),J===s.UNSIGNED_INT&&(ft=s.R32UI),J===s.BYTE&&(ft=s.R8I),J===s.SHORT&&(ft=s.R16I),J===s.INT&&(ft=s.R32I)),D===s.RG&&(J===s.FLOAT&&(ft=s.RG32F),J===s.HALF_FLOAT&&(ft=s.RG16F),J===s.UNSIGNED_BYTE&&(ft=s.RG8)),D===s.RGBA){const Rt=ct?za:de.getTransfer(ut);J===s.FLOAT&&(ft=s.RGBA32F),J===s.HALF_FLOAT&&(ft=s.RGBA16F),J===s.UNSIGNED_BYTE&&(ft=Rt===ye?s.SRGB8_ALPHA8:s.RGBA8),J===s.UNSIGNED_SHORT_4_4_4_4&&(ft=s.RGBA4),J===s.UNSIGNED_SHORT_5_5_5_1&&(ft=s.RGB5_A1)}return(ft===s.R16F||ft===s.R32F||ft===s.RG16F||ft===s.RG32F||ft===s.RGBA16F||ft===s.RGBA32F)&&t.get("EXT_color_buffer_float"),ft}function E(B,D,J){return m(B,J)===!0||B.isFramebufferTexture&&B.minFilter!==Se&&B.minFilter!==ve?Math.log2(Math.max(D.width,D.height))+1:B.mipmaps!==void 0&&B.mipmaps.length>0?B.mipmaps.length:B.isCompressedTexture&&Array.isArray(B.image)?D.mipmaps.length:1}function y(B){return B===Se||B===Jl||B===sr?s.NEAREST:s.LINEAR}function w(B){const D=B.target;D.removeEventListener("dispose",w),b(D),D.isVideoTexture&&h.delete(D)}function A(B){const D=B.target;D.removeEventListener("dispose",A),R(D)}function b(B){const D=n.get(B);if(D.__webglInit===void 0)return;const J=B.source,ut=f.get(J);if(ut){const ct=ut[D.__cacheKey];ct.usedTimes--,ct.usedTimes===0&&S(B),Object.keys(ut).length===0&&f.delete(J)}n.remove(B)}function S(B){const D=n.get(B);s.deleteTexture(D.__webglTexture);const J=B.source,ut=f.get(J);delete ut[D.__cacheKey],a.memory.textures--}function R(B){const D=B.texture,J=n.get(B),ut=n.get(D);if(ut.__webglTexture!==void 0&&(s.deleteTexture(ut.__webglTexture),a.memory.textures--),B.depthTexture&&B.depthTexture.dispose(),B.isWebGLCubeRenderTarget)for(let ct=0;ct<6;ct++){if(Array.isArray(J.__webglFramebuffer[ct]))for(let ft=0;ft<J.__webglFramebuffer[ct].length;ft++)s.deleteFramebuffer(J.__webglFramebuffer[ct][ft]);else s.deleteFramebuffer(J.__webglFramebuffer[ct]);J.__webglDepthbuffer&&s.deleteRenderbuffer(J.__webglDepthbuffer[ct])}else{if(Array.isArray(J.__webglFramebuffer))for(let ct=0;ct<J.__webglFramebuffer.length;ct++)s.deleteFramebuffer(J.__webglFramebuffer[ct]);else s.deleteFramebuffer(J.__webglFramebuffer);if(J.__webglDepthbuffer&&s.deleteRenderbuffer(J.__webglDepthbuffer),J.__webglMultisampledFramebuffer&&s.deleteFramebuffer(J.__webglMultisampledFramebuffer),J.__webglColorRenderbuffer)for(let ct=0;ct<J.__webglColorRenderbuffer.length;ct++)J.__webglColorRenderbuffer[ct]&&s.deleteRenderbuffer(J.__webglColorRenderbuffer[ct]);J.__webglDepthRenderbuffer&&s.deleteRenderbuffer(J.__webglDepthRenderbuffer)}if(B.isWebGLMultipleRenderTargets)for(let ct=0,ft=D.length;ct<ft;ct++){const Rt=n.get(D[ct]);Rt.__webglTexture&&(s.deleteTexture(Rt.__webglTexture),a.memory.textures--),n.remove(D[ct])}n.remove(D),n.remove(B)}let k=0;function I(){k=0}function T(){const B=k;return B>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+B+" texture units while this GPU supports only "+i.maxTextures),k+=1,B}function C(B){const D=[];return D.push(B.wrapS),D.push(B.wrapT),D.push(B.wrapR||0),D.push(B.magFilter),D.push(B.minFilter),D.push(B.anisotropy),D.push(B.internalFormat),D.push(B.format),D.push(B.type),D.push(B.generateMipmaps),D.push(B.premultiplyAlpha),D.push(B.flipY),D.push(B.unpackAlignment),D.push(B.colorSpace),D.join()}function F(B,D){const J=n.get(B);if(B.isVideoTexture&&kt(B),B.isRenderTargetTexture===!1&&B.version>0&&J.__version!==B.version){const ut=B.image;if(ut===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ut.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{G(J,B,D);return}}e.bindTexture(s.TEXTURE_2D,J.__webglTexture,s.TEXTURE0+D)}function N(B,D){const J=n.get(B);if(B.version>0&&J.__version!==B.version){G(J,B,D);return}e.bindTexture(s.TEXTURE_2D_ARRAY,J.__webglTexture,s.TEXTURE0+D)}function z(B,D){const J=n.get(B);if(B.version>0&&J.__version!==B.version){G(J,B,D);return}e.bindTexture(s.TEXTURE_3D,J.__webglTexture,s.TEXTURE0+D)}function U(B,D){const J=n.get(B);if(B.version>0&&J.__version!==B.version){K(J,B,D);return}e.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture,s.TEXTURE0+D)}const L={[Gi]:s.REPEAT,[cn]:s.CLAMP_TO_EDGE,[cl]:s.MIRRORED_REPEAT},W={[Se]:s.NEAREST,[Jl]:s.NEAREST_MIPMAP_NEAREST,[sr]:s.NEAREST_MIPMAP_LINEAR,[ve]:s.LINEAR,[ff]:s.LINEAR_MIPMAP_NEAREST,[Wi]:s.LINEAR_MIPMAP_LINEAR},j={[Sf]:s.NEVER,[kf]:s.ALWAYS,[Ef]:s.LESS,[Tu]:s.LEQUAL,[Af]:s.EQUAL,[Rf]:s.GEQUAL,[Tf]:s.GREATER,[Cf]:s.NOTEQUAL};function P(B,D,J){if(J?(s.texParameteri(B,s.TEXTURE_WRAP_S,L[D.wrapS]),s.texParameteri(B,s.TEXTURE_WRAP_T,L[D.wrapT]),(B===s.TEXTURE_3D||B===s.TEXTURE_2D_ARRAY)&&s.texParameteri(B,s.TEXTURE_WRAP_R,L[D.wrapR]),s.texParameteri(B,s.TEXTURE_MAG_FILTER,W[D.magFilter]),s.texParameteri(B,s.TEXTURE_MIN_FILTER,W[D.minFilter])):(s.texParameteri(B,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(B,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(B===s.TEXTURE_3D||B===s.TEXTURE_2D_ARRAY)&&s.texParameteri(B,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(D.wrapS!==cn||D.wrapT!==cn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(B,s.TEXTURE_MAG_FILTER,y(D.magFilter)),s.texParameteri(B,s.TEXTURE_MIN_FILTER,y(D.minFilter)),D.minFilter!==Se&&D.minFilter!==ve&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),D.compareFunction&&(s.texParameteri(B,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(B,s.TEXTURE_COMPARE_FUNC,j[D.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const ut=t.get("EXT_texture_filter_anisotropic");if(D.magFilter===Se||D.minFilter!==sr&&D.minFilter!==Wi||D.type===In&&t.has("OES_texture_float_linear")===!1||r===!1&&D.type===ai&&t.has("OES_texture_half_float_linear")===!1)return;(D.anisotropy>1||n.get(D).__currentAnisotropy)&&(s.texParameterf(B,ut.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(D.anisotropy,i.getMaxAnisotropy())),n.get(D).__currentAnisotropy=D.anisotropy)}}function O(B,D){let J=!1;B.__webglInit===void 0&&(B.__webglInit=!0,D.addEventListener("dispose",w));const ut=D.source;let ct=f.get(ut);ct===void 0&&(ct={},f.set(ut,ct));const ft=C(D);if(ft!==B.__cacheKey){ct[ft]===void 0&&(ct[ft]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,J=!0),ct[ft].usedTimes++;const Rt=ct[B.__cacheKey];Rt!==void 0&&(ct[B.__cacheKey].usedTimes--,Rt.usedTimes===0&&S(D)),B.__cacheKey=ft,B.__webglTexture=ct[ft].texture}return J}function G(B,D,J){let ut=s.TEXTURE_2D;(D.isDataArrayTexture||D.isCompressedArrayTexture)&&(ut=s.TEXTURE_2D_ARRAY),D.isData3DTexture&&(ut=s.TEXTURE_3D);const ct=O(B,D),ft=D.source;e.bindTexture(ut,B.__webglTexture,s.TEXTURE0+J);const Rt=n.get(ft);if(ft.version!==Rt.__version||ct===!0){e.activeTexture(s.TEXTURE0+J);const vt=de.getPrimaries(de.workingColorSpace),gt=D.colorSpace===Sn?null:de.getPrimaries(D.colorSpace),Ct=D.colorSpace===Sn||vt===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,D.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,D.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct);const Lt=p(D)&&x(D.image)===!1;let dt=g(D.image,Lt,!1,i.maxTextureSize);dt=at(D,dt);const se=x(dt)||r,Xt=o.convert(D.format,D.colorSpace);let Bt=o.convert(D.type),zt=_(D.internalFormat,Xt,Bt,D.colorSpace,D.isVideoTexture);P(ut,D,se);let pt;const bt=D.mipmaps,ee=r&&D.isVideoTexture!==!0&&zt!==Eu,fe=Rt.__version===void 0||ct===!0,Yt=E(D,dt,se);if(D.isDepthTexture)zt=s.DEPTH_COMPONENT,r?D.type===In?zt=s.DEPTH_COMPONENT32F:D.type===ei?zt=s.DEPTH_COMPONENT24:D.type===Ni?zt=s.DEPTH24_STENCIL8:zt=s.DEPTH_COMPONENT16:D.type===In&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),D.format===Oi&&zt===s.DEPTH_COMPONENT&&D.type!==Rl&&D.type!==ei&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),D.type=ei,Bt=o.convert(D.type)),D.format===Ns&&zt===s.DEPTH_COMPONENT&&(zt=s.DEPTH_STENCIL,D.type!==Ni&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),D.type=Ni,Bt=o.convert(D.type))),fe&&(ee?e.texStorage2D(s.TEXTURE_2D,1,zt,dt.width,dt.height):e.texImage2D(s.TEXTURE_2D,0,zt,dt.width,dt.height,0,Xt,Bt,null));else if(D.isDataTexture)if(bt.length>0&&se){ee&&fe&&e.texStorage2D(s.TEXTURE_2D,Yt,zt,bt[0].width,bt[0].height);for(let wt=0,Z=bt.length;wt<Z;wt++)pt=bt[wt],ee?e.texSubImage2D(s.TEXTURE_2D,wt,0,0,pt.width,pt.height,Xt,Bt,pt.data):e.texImage2D(s.TEXTURE_2D,wt,zt,pt.width,pt.height,0,Xt,Bt,pt.data);D.generateMipmaps=!1}else ee?(fe&&e.texStorage2D(s.TEXTURE_2D,Yt,zt,dt.width,dt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,dt.width,dt.height,Xt,Bt,dt.data)):e.texImage2D(s.TEXTURE_2D,0,zt,dt.width,dt.height,0,Xt,Bt,dt.data);else if(D.isCompressedTexture)if(D.isCompressedArrayTexture){ee&&fe&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Yt,zt,bt[0].width,bt[0].height,dt.depth);for(let wt=0,Z=bt.length;wt<Z;wt++)pt=bt[wt],D.format!==Ke?Xt!==null?ee?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,wt,0,0,0,pt.width,pt.height,dt.depth,Xt,pt.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,wt,zt,pt.width,pt.height,dt.depth,0,pt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?e.texSubImage3D(s.TEXTURE_2D_ARRAY,wt,0,0,0,pt.width,pt.height,dt.depth,Xt,Bt,pt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,wt,zt,pt.width,pt.height,dt.depth,0,Xt,Bt,pt.data)}else{ee&&fe&&e.texStorage2D(s.TEXTURE_2D,Yt,zt,bt[0].width,bt[0].height);for(let wt=0,Z=bt.length;wt<Z;wt++)pt=bt[wt],D.format!==Ke?Xt!==null?ee?e.compressedTexSubImage2D(s.TEXTURE_2D,wt,0,0,pt.width,pt.height,Xt,pt.data):e.compressedTexImage2D(s.TEXTURE_2D,wt,zt,pt.width,pt.height,0,pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ee?e.texSubImage2D(s.TEXTURE_2D,wt,0,0,pt.width,pt.height,Xt,Bt,pt.data):e.texImage2D(s.TEXTURE_2D,wt,zt,pt.width,pt.height,0,Xt,Bt,pt.data)}else if(D.isDataArrayTexture)ee?(fe&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Yt,zt,dt.width,dt.height,dt.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,dt.width,dt.height,dt.depth,Xt,Bt,dt.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,zt,dt.width,dt.height,dt.depth,0,Xt,Bt,dt.data);else if(D.isData3DTexture)ee?(fe&&e.texStorage3D(s.TEXTURE_3D,Yt,zt,dt.width,dt.height,dt.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,dt.width,dt.height,dt.depth,Xt,Bt,dt.data)):e.texImage3D(s.TEXTURE_3D,0,zt,dt.width,dt.height,dt.depth,0,Xt,Bt,dt.data);else if(D.isFramebufferTexture){if(fe)if(ee)e.texStorage2D(s.TEXTURE_2D,Yt,zt,dt.width,dt.height);else{let wt=dt.width,Z=dt.height;for(let St=0;St<Yt;St++)e.texImage2D(s.TEXTURE_2D,St,zt,wt,Z,0,Xt,Bt,null),wt>>=1,Z>>=1}}else if(bt.length>0&&se){ee&&fe&&e.texStorage2D(s.TEXTURE_2D,Yt,zt,bt[0].width,bt[0].height);for(let wt=0,Z=bt.length;wt<Z;wt++)pt=bt[wt],ee?e.texSubImage2D(s.TEXTURE_2D,wt,0,0,Xt,Bt,pt):e.texImage2D(s.TEXTURE_2D,wt,zt,Xt,Bt,pt);D.generateMipmaps=!1}else ee?(fe&&e.texStorage2D(s.TEXTURE_2D,Yt,zt,dt.width,dt.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,Xt,Bt,dt)):e.texImage2D(s.TEXTURE_2D,0,zt,Xt,Bt,dt);m(D,se)&&M(ut),Rt.__version=ft.version,D.onUpdate&&D.onUpdate(D)}B.__version=D.version}function K(B,D,J){if(D.image.length!==6)return;const ut=O(B,D),ct=D.source;e.bindTexture(s.TEXTURE_CUBE_MAP,B.__webglTexture,s.TEXTURE0+J);const ft=n.get(ct);if(ct.version!==ft.__version||ut===!0){e.activeTexture(s.TEXTURE0+J);const Rt=de.getPrimaries(de.workingColorSpace),vt=D.colorSpace===Sn?null:de.getPrimaries(D.colorSpace),gt=D.colorSpace===Sn||Rt===vt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,D.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,D.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const Ct=D.isCompressedTexture||D.image[0].isCompressedTexture,Lt=D.image[0]&&D.image[0].isDataTexture,dt=[];for(let wt=0;wt<6;wt++)!Ct&&!Lt?dt[wt]=g(D.image[wt],!1,!0,i.maxCubemapSize):dt[wt]=Lt?D.image[wt].image:D.image[wt],dt[wt]=at(D,dt[wt]);const se=dt[0],Xt=x(se)||r,Bt=o.convert(D.format,D.colorSpace),zt=o.convert(D.type),pt=_(D.internalFormat,Bt,zt,D.colorSpace),bt=r&&D.isVideoTexture!==!0,ee=ft.__version===void 0||ut===!0;let fe=E(D,se,Xt);P(s.TEXTURE_CUBE_MAP,D,Xt);let Yt;if(Ct){bt&&ee&&e.texStorage2D(s.TEXTURE_CUBE_MAP,fe,pt,se.width,se.height);for(let wt=0;wt<6;wt++){Yt=dt[wt].mipmaps;for(let Z=0;Z<Yt.length;Z++){const St=Yt[Z];D.format!==Ke?Bt!==null?bt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z,0,0,St.width,St.height,Bt,St.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z,pt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z,0,0,St.width,St.height,Bt,zt,St.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z,pt,St.width,St.height,0,Bt,zt,St.data)}}}else{Yt=D.mipmaps,bt&&ee&&(Yt.length>0&&fe++,e.texStorage2D(s.TEXTURE_CUBE_MAP,fe,pt,dt[0].width,dt[0].height));for(let wt=0;wt<6;wt++)if(Lt){bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,0,0,0,dt[wt].width,dt[wt].height,Bt,zt,dt[wt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,0,pt,dt[wt].width,dt[wt].height,0,Bt,zt,dt[wt].data);for(let Z=0;Z<Yt.length;Z++){const Et=Yt[Z].image[wt].image;bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z+1,0,0,Et.width,Et.height,Bt,zt,Et.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z+1,pt,Et.width,Et.height,0,Bt,zt,Et.data)}}else{bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,0,0,0,Bt,zt,dt[wt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,0,pt,Bt,zt,dt[wt]);for(let Z=0;Z<Yt.length;Z++){const St=Yt[Z];bt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z+1,0,0,Bt,zt,St.image[wt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+wt,Z+1,pt,Bt,zt,St.image[wt])}}}m(D,Xt)&&M(s.TEXTURE_CUBE_MAP),ft.__version=ct.version,D.onUpdate&&D.onUpdate(D)}B.__version=D.version}function Q(B,D,J,ut,ct,ft){const Rt=o.convert(J.format,J.colorSpace),vt=o.convert(J.type),gt=_(J.internalFormat,Rt,vt,J.colorSpace);if(!n.get(D).__hasExternalTextures){const Lt=Math.max(1,D.width>>ft),dt=Math.max(1,D.height>>ft);ct===s.TEXTURE_3D||ct===s.TEXTURE_2D_ARRAY?e.texImage3D(ct,ft,gt,Lt,dt,D.depth,0,Rt,vt,null):e.texImage2D(ct,ft,gt,Lt,dt,0,Rt,vt,null)}e.bindFramebuffer(s.FRAMEBUFFER,B),xt(D)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ut,ct,n.get(J).__webglTexture,0,_t(D)):(ct===s.TEXTURE_2D||ct>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ct<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,ut,ct,n.get(J).__webglTexture,ft),e.bindFramebuffer(s.FRAMEBUFFER,null)}function ot(B,D,J){if(s.bindRenderbuffer(s.RENDERBUFFER,B),D.depthBuffer&&!D.stencilBuffer){let ut=r===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(J||xt(D)){const ct=D.depthTexture;ct&&ct.isDepthTexture&&(ct.type===In?ut=s.DEPTH_COMPONENT32F:ct.type===ei&&(ut=s.DEPTH_COMPONENT24));const ft=_t(D);xt(D)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ft,ut,D.width,D.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,ft,ut,D.width,D.height)}else s.renderbufferStorage(s.RENDERBUFFER,ut,D.width,D.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,B)}else if(D.depthBuffer&&D.stencilBuffer){const ut=_t(D);J&&xt(D)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ut,s.DEPTH24_STENCIL8,D.width,D.height):xt(D)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ut,s.DEPTH24_STENCIL8,D.width,D.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,D.width,D.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,B)}else{const ut=D.isWebGLMultipleRenderTargets===!0?D.texture:[D.texture];for(let ct=0;ct<ut.length;ct++){const ft=ut[ct],Rt=o.convert(ft.format,ft.colorSpace),vt=o.convert(ft.type),gt=_(ft.internalFormat,Rt,vt,ft.colorSpace),Ct=_t(D);J&&xt(D)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ct,gt,D.width,D.height):xt(D)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ct,gt,D.width,D.height):s.renderbufferStorage(s.RENDERBUFFER,gt,D.width,D.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function $(B,D){if(D&&D.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,B),!(D.depthTexture&&D.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(D.depthTexture).__webglTexture||D.depthTexture.image.width!==D.width||D.depthTexture.image.height!==D.height)&&(D.depthTexture.image.width=D.width,D.depthTexture.image.height=D.height,D.depthTexture.needsUpdate=!0),F(D.depthTexture,0);const ut=n.get(D.depthTexture).__webglTexture,ct=_t(D);if(D.depthTexture.format===Oi)xt(D)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ut,0,ct):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ut,0);else if(D.depthTexture.format===Ns)xt(D)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ut,0,ct):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ut,0);else throw new Error("Unknown depthTexture format")}function Y(B){const D=n.get(B),J=B.isWebGLCubeRenderTarget===!0;if(B.depthTexture&&!D.__autoAllocateDepthBuffer){if(J)throw new Error("target.depthTexture not supported in Cube render targets");$(D.__webglFramebuffer,B)}else if(J){D.__webglDepthbuffer=[];for(let ut=0;ut<6;ut++)e.bindFramebuffer(s.FRAMEBUFFER,D.__webglFramebuffer[ut]),D.__webglDepthbuffer[ut]=s.createRenderbuffer(),ot(D.__webglDepthbuffer[ut],B,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,D.__webglFramebuffer),D.__webglDepthbuffer=s.createRenderbuffer(),ot(D.__webglDepthbuffer,B,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(B,D,J){const ut=n.get(B);D!==void 0&&Q(ut.__webglFramebuffer,B,B.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),J!==void 0&&Y(B)}function X(B){const D=B.texture,J=n.get(B),ut=n.get(D);B.addEventListener("dispose",A),B.isWebGLMultipleRenderTargets!==!0&&(ut.__webglTexture===void 0&&(ut.__webglTexture=s.createTexture()),ut.__version=D.version,a.memory.textures++);const ct=B.isWebGLCubeRenderTarget===!0,ft=B.isWebGLMultipleRenderTargets===!0,Rt=x(B)||r;if(ct){J.__webglFramebuffer=[];for(let vt=0;vt<6;vt++)if(r&&D.mipmaps&&D.mipmaps.length>0){J.__webglFramebuffer[vt]=[];for(let gt=0;gt<D.mipmaps.length;gt++)J.__webglFramebuffer[vt][gt]=s.createFramebuffer()}else J.__webglFramebuffer[vt]=s.createFramebuffer()}else{if(r&&D.mipmaps&&D.mipmaps.length>0){J.__webglFramebuffer=[];for(let vt=0;vt<D.mipmaps.length;vt++)J.__webglFramebuffer[vt]=s.createFramebuffer()}else J.__webglFramebuffer=s.createFramebuffer();if(ft)if(i.drawBuffers){const vt=B.texture;for(let gt=0,Ct=vt.length;gt<Ct;gt++){const Lt=n.get(vt[gt]);Lt.__webglTexture===void 0&&(Lt.__webglTexture=s.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&B.samples>0&&xt(B)===!1){const vt=ft?D:[D];J.__webglMultisampledFramebuffer=s.createFramebuffer(),J.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,J.__webglMultisampledFramebuffer);for(let gt=0;gt<vt.length;gt++){const Ct=vt[gt];J.__webglColorRenderbuffer[gt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,J.__webglColorRenderbuffer[gt]);const Lt=o.convert(Ct.format,Ct.colorSpace),dt=o.convert(Ct.type),se=_(Ct.internalFormat,Lt,dt,Ct.colorSpace,B.isXRRenderTarget===!0),Xt=_t(B);s.renderbufferStorageMultisample(s.RENDERBUFFER,Xt,se,B.width,B.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+gt,s.RENDERBUFFER,J.__webglColorRenderbuffer[gt])}s.bindRenderbuffer(s.RENDERBUFFER,null),B.depthBuffer&&(J.__webglDepthRenderbuffer=s.createRenderbuffer(),ot(J.__webglDepthRenderbuffer,B,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ct){e.bindTexture(s.TEXTURE_CUBE_MAP,ut.__webglTexture),P(s.TEXTURE_CUBE_MAP,D,Rt);for(let vt=0;vt<6;vt++)if(r&&D.mipmaps&&D.mipmaps.length>0)for(let gt=0;gt<D.mipmaps.length;gt++)Q(J.__webglFramebuffer[vt][gt],B,D,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,gt);else Q(J.__webglFramebuffer[vt],B,D,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+vt,0);m(D,Rt)&&M(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ft){const vt=B.texture;for(let gt=0,Ct=vt.length;gt<Ct;gt++){const Lt=vt[gt],dt=n.get(Lt);e.bindTexture(s.TEXTURE_2D,dt.__webglTexture),P(s.TEXTURE_2D,Lt,Rt),Q(J.__webglFramebuffer,B,Lt,s.COLOR_ATTACHMENT0+gt,s.TEXTURE_2D,0),m(Lt,Rt)&&M(s.TEXTURE_2D)}e.unbindTexture()}else{let vt=s.TEXTURE_2D;if((B.isWebGL3DRenderTarget||B.isWebGLArrayRenderTarget)&&(r?vt=B.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(vt,ut.__webglTexture),P(vt,D,Rt),r&&D.mipmaps&&D.mipmaps.length>0)for(let gt=0;gt<D.mipmaps.length;gt++)Q(J.__webglFramebuffer[gt],B,D,s.COLOR_ATTACHMENT0,vt,gt);else Q(J.__webglFramebuffer,B,D,s.COLOR_ATTACHMENT0,vt,0);m(D,Rt)&&M(vt),e.unbindTexture()}B.depthBuffer&&Y(B)}function Mt(B){const D=x(B)||r,J=B.isWebGLMultipleRenderTargets===!0?B.texture:[B.texture];for(let ut=0,ct=J.length;ut<ct;ut++){const ft=J[ut];if(m(ft,D)){const Rt=B.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,vt=n.get(ft).__webglTexture;e.bindTexture(Rt,vt),M(Rt),e.unbindTexture()}}}function mt(B){if(r&&B.samples>0&&xt(B)===!1){const D=B.isWebGLMultipleRenderTargets?B.texture:[B.texture],J=B.width,ut=B.height;let ct=s.COLOR_BUFFER_BIT;const ft=[],Rt=B.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,vt=n.get(B),gt=B.isWebGLMultipleRenderTargets===!0;if(gt)for(let Ct=0;Ct<D.length;Ct++)e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let Ct=0;Ct<D.length;Ct++){ft.push(s.COLOR_ATTACHMENT0+Ct),B.depthBuffer&&ft.push(Rt);const Lt=vt.__ignoreDepthValues!==void 0?vt.__ignoreDepthValues:!1;if(Lt===!1&&(B.depthBuffer&&(ct|=s.DEPTH_BUFFER_BIT),B.stencilBuffer&&(ct|=s.STENCIL_BUFFER_BIT)),gt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,vt.__webglColorRenderbuffer[Ct]),Lt===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[Rt]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[Rt])),gt){const dt=n.get(D[Ct]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,dt,0)}s.blitFramebuffer(0,0,J,ut,0,0,J,ut,ct,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ft)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),gt)for(let Ct=0;Ct<D.length;Ct++){e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.RENDERBUFFER,vt.__webglColorRenderbuffer[Ct]);const Lt=n.get(D[Ct]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ct,s.TEXTURE_2D,Lt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}}function _t(B){return Math.min(i.maxSamples,B.samples)}function xt(B){const D=n.get(B);return r&&B.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&D.__useRenderToTexture!==!1}function kt(B){const D=a.render.frame;h.get(B)!==D&&(h.set(B,D),B.update())}function at(B,D){const J=B.colorSpace,ut=B.format,ct=B.type;return B.isCompressedTexture===!0||B.isVideoTexture===!0||B.format===hl||J!==ri&&J!==Sn&&(de.getTransfer(J)===ye?r===!1?t.has("EXT_sRGB")===!0&&ut===Ke?(B.format=hl,B.minFilter=ve,B.generateMipmaps=!1):D=Ru.sRGBToLinear(D):(ut!==Ke||ct!==xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",J)),D}this.allocateTextureUnit=T,this.resetTextureUnits=I,this.setTexture2D=F,this.setTexture2DArray=N,this.setTexture3D=z,this.setTextureCube=U,this.rebindTextures=rt,this.setupRenderTarget=X,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=mt,this.setupDepthRenderbuffer=Y,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=xt}function jg(s,t,e){const n=e.isWebGL2;function i(o,a=Sn){let r;const l=de.getTransfer(a);if(o===xn)return s.UNSIGNED_BYTE;if(o===_u)return s.UNSIGNED_SHORT_4_4_4_4;if(o===wu)return s.UNSIGNED_SHORT_5_5_5_1;if(o===df)return s.BYTE;if(o===pf)return s.SHORT;if(o===Rl)return s.UNSIGNED_SHORT;if(o===Mu)return s.INT;if(o===ei)return s.UNSIGNED_INT;if(o===In)return s.FLOAT;if(o===ai)return n?s.HALF_FLOAT:(r=t.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===mf)return s.ALPHA;if(o===Ke)return s.RGBA;if(o===gf)return s.LUMINANCE;if(o===xf)return s.LUMINANCE_ALPHA;if(o===Oi)return s.DEPTH_COMPONENT;if(o===Ns)return s.DEPTH_STENCIL;if(o===hl)return r=t.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===zs)return s.RED;if(o===yu)return s.RED_INTEGER;if(o===vf)return s.RG;if(o===bu)return s.RG_INTEGER;if(o===Su)return s.RGBA_INTEGER;if(o===or||o===ar||o===rr||o===lr)if(l===ye)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===or)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===or)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===ar)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===rr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===lr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===Ql||o===tc||o===ec||o===nc)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===Ql)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===tc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===ec)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===nc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Eu)return r=t.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===ic||o===sc)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(o===ic)return l===ye?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===sc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===oc||o===ac||o===rc||o===lc||o===cc||o===hc||o===uc||o===fc||o===dc||o===pc||o===mc||o===gc||o===xc||o===vc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(o===oc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===ac)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===rc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===lc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===cc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===hc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===uc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===fc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===dc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===pc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===mc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===gc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===xc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===vc)return l===ye?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===cr||o===Mc||o===_c)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(o===cr)return l===ye?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===Mc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===_c)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===Mf||o===wc||o===yc||o===bc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(o===cr)return r.COMPRESSED_RED_RGTC1_EXT;if(o===wc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===yc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===bc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===Ni?n?s.UNSIGNED_INT_24_8:(r=t.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):s[o]!==void 0?s[o]:null}return{convert:i}}class Yg extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class En extends un{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $g={type:"move"};class Lr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new En,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new En,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new q,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new q),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new En,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new q,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new q),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,o=null,a=null;const r=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const x=e.getJointPose(g,n),p=this._getHandJoint(c,g);x!==null&&(p.matrix.fromArray(x.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=x.radius),p.visible=x!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,v=.005;c.inputState.pinching&&f>d+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=d-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent($g)))}return r!==null&&(r.visible=i!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new En;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Kg extends Hs{constructor(t,e){super();const n=this;let i=null,o=1,a=null,r="local-floor",l=1,c=null,h=null,u=null,f=null,d=null,v=null;const g=e.getContextAttributes();let x=null,p=null;const m=[],M=[],_=new Ot;let E=null;const y=new rn;y.layers.enable(1),y.viewport=new _e;const w=new rn;w.layers.enable(2),w.viewport=new _e;const A=[y,w],b=new Yg;b.layers.enable(1),b.layers.enable(2);let S=null,R=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(P){let O=m[P];return O===void 0&&(O=new Lr,m[P]=O),O.getTargetRaySpace()},this.getControllerGrip=function(P){let O=m[P];return O===void 0&&(O=new Lr,m[P]=O),O.getGripSpace()},this.getHand=function(P){let O=m[P];return O===void 0&&(O=new Lr,m[P]=O),O.getHandSpace()};function k(P){const O=M.indexOf(P.inputSource);if(O===-1)return;const G=m[O];G!==void 0&&(G.update(P.inputSource,P.frame,c||a),G.dispatchEvent({type:P.type,data:P.inputSource}))}function I(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",I),i.removeEventListener("inputsourceschange",T);for(let P=0;P<m.length;P++){const O=M[P];O!==null&&(M[P]=null,m[P].disconnect(O))}S=null,R=null,t.setRenderTarget(x),d=null,f=null,u=null,i=null,p=null,j.stop(),n.isPresenting=!1,t.setPixelRatio(E),t.setSize(_.width,_.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(P){o=P,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(P){r=P,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(P){c=P},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(P){if(i=P,i!==null){if(x=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",I),i.addEventListener("inputsourceschange",T),g.xrCompatible!==!0&&await e.makeXRCompatible(),E=t.getPixelRatio(),t.getSize(_),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const O={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};d=new XRWebGLLayer(i,e,O),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),p=new vn(d.framebufferWidth,d.framebufferHeight,{format:Ke,type:xn,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let O=null,G=null,K=null;g.depth&&(K=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,O=g.stencil?Ns:Oi,G=g.stencil?Ni:ei);const Q={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:o};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(Q),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),p=new vn(f.textureWidth,f.textureHeight,{format:Ke,type:xn,depthTexture:new Il(f.textureWidth,f.textureHeight,G,void 0,void 0,void 0,void 0,void 0,void 0,O),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0});const ot=t.properties.get(p);ot.__ignoreDepthValues=f.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(r),j.setContext(i),j.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function T(P){for(let O=0;O<P.removed.length;O++){const G=P.removed[O],K=M.indexOf(G);K>=0&&(M[K]=null,m[K].disconnect(G))}for(let O=0;O<P.added.length;O++){const G=P.added[O];let K=M.indexOf(G);if(K===-1){for(let ot=0;ot<m.length;ot++)if(ot>=M.length){M.push(G),K=ot;break}else if(M[ot]===null){M[ot]=G,K=ot;break}if(K===-1)break}const Q=m[K];Q&&Q.connect(G)}}const C=new q,F=new q;function N(P,O,G){C.setFromMatrixPosition(O.matrixWorld),F.setFromMatrixPosition(G.matrixWorld);const K=C.distanceTo(F),Q=O.projectionMatrix.elements,ot=G.projectionMatrix.elements,$=Q[14]/(Q[10]-1),Y=Q[14]/(Q[10]+1),rt=(Q[9]+1)/Q[5],X=(Q[9]-1)/Q[5],Mt=(Q[8]-1)/Q[0],mt=(ot[8]+1)/ot[0],_t=$*Mt,xt=$*mt,kt=K/(-Mt+mt),at=kt*-Mt;O.matrixWorld.decompose(P.position,P.quaternion,P.scale),P.translateX(at),P.translateZ(kt),P.matrixWorld.compose(P.position,P.quaternion,P.scale),P.matrixWorldInverse.copy(P.matrixWorld).invert();const B=$+kt,D=Y+kt,J=_t-at,ut=xt+(K-at),ct=rt*Y/D*B,ft=X*Y/D*B;P.projectionMatrix.makePerspective(J,ut,ct,ft,B,D),P.projectionMatrixInverse.copy(P.projectionMatrix).invert()}function z(P,O){O===null?P.matrixWorld.copy(P.matrix):P.matrixWorld.multiplyMatrices(O.matrixWorld,P.matrix),P.matrixWorldInverse.copy(P.matrixWorld).invert()}this.updateCamera=function(P){if(i===null)return;b.near=w.near=y.near=P.near,b.far=w.far=y.far=P.far,(S!==b.near||R!==b.far)&&(i.updateRenderState({depthNear:b.near,depthFar:b.far}),S=b.near,R=b.far);const O=P.parent,G=b.cameras;z(b,O);for(let K=0;K<G.length;K++)z(G[K],O);G.length===2?N(b,y,w):b.projectionMatrix.copy(y.projectionMatrix),U(P,b,O)};function U(P,O,G){G===null?P.matrix.copy(O.matrixWorld):(P.matrix.copy(G.matrixWorld),P.matrix.invert(),P.matrix.multiply(O.matrixWorld)),P.matrix.decompose(P.position,P.quaternion,P.scale),P.updateMatrixWorld(!0),P.projectionMatrix.copy(O.projectionMatrix),P.projectionMatrixInverse.copy(O.projectionMatrixInverse),P.isPerspectiveCamera&&(P.fov=_o*2*Math.atan(1/P.projectionMatrix.elements[5]),P.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(f===null&&d===null))return l},this.setFoveation=function(P){l=P,f!==null&&(f.fixedFoveation=P),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=P)};let L=null;function W(P,O){if(h=O.getViewerPose(c||a),v=O,h!==null){const G=h.views;d!==null&&(t.setRenderTargetFramebuffer(p,d.framebuffer),t.setRenderTarget(p));let K=!1;G.length!==b.cameras.length&&(b.cameras.length=0,K=!0);for(let Q=0;Q<G.length;Q++){const ot=G[Q];let $=null;if(d!==null)$=d.getViewport(ot);else{const rt=u.getViewSubImage(f,ot);$=rt.viewport,Q===0&&(t.setRenderTargetTextures(p,rt.colorTexture,f.ignoreDepthValues?void 0:rt.depthStencilTexture),t.setRenderTarget(p))}let Y=A[Q];Y===void 0&&(Y=new rn,Y.layers.enable(Q),Y.viewport=new _e,A[Q]=Y),Y.matrix.fromArray(ot.transform.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.projectionMatrix.fromArray(ot.projectionMatrix),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert(),Y.viewport.set($.x,$.y,$.width,$.height),Q===0&&(b.matrix.copy(Y.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),K===!0&&b.cameras.push(Y)}}for(let G=0;G<m.length;G++){const K=M[G],Q=m[G];K!==null&&Q!==void 0&&Q.update(K,O,c||a)}L&&L(P,O),O.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:O}),v=null}const j=new Ou;j.setAnimationLoop(W),this.setAnimationLoop=function(P){L=P},this.dispose=function(){}}}function Zg(s,t){function e(x,p){x.matrixAutoUpdate===!0&&x.updateMatrix(),p.value.copy(x.matrix)}function n(x,p){p.color.getRGB(x.fogColor.value,Iu(s)),p.isFog?(x.fogNear.value=p.near,x.fogFar.value=p.far):p.isFogExp2&&(x.fogDensity.value=p.density)}function i(x,p,m,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(x,p):p.isMeshToonMaterial?(o(x,p),u(x,p)):p.isMeshPhongMaterial?(o(x,p),h(x,p)):p.isMeshStandardMaterial?(o(x,p),f(x,p),p.isMeshPhysicalMaterial&&d(x,p,_)):p.isMeshMatcapMaterial?(o(x,p),v(x,p)):p.isMeshDepthMaterial?o(x,p):p.isMeshDistanceMaterial?(o(x,p),g(x,p)):p.isMeshNormalMaterial?o(x,p):p.isLineBasicMaterial?(a(x,p),p.isLineDashedMaterial&&r(x,p)):p.isPointsMaterial?l(x,p,m,M):p.isSpriteMaterial?c(x,p):p.isShadowMaterial?(x.color.value.copy(p.color),x.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(x,p){x.opacity.value=p.opacity,p.color&&x.diffuse.value.copy(p.color),p.emissive&&x.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.bumpMap&&(x.bumpMap.value=p.bumpMap,e(p.bumpMap,x.bumpMapTransform),x.bumpScale.value=p.bumpScale,p.side===en&&(x.bumpScale.value*=-1)),p.normalMap&&(x.normalMap.value=p.normalMap,e(p.normalMap,x.normalMapTransform),x.normalScale.value.copy(p.normalScale),p.side===en&&x.normalScale.value.negate()),p.displacementMap&&(x.displacementMap.value=p.displacementMap,e(p.displacementMap,x.displacementMapTransform),x.displacementScale.value=p.displacementScale,x.displacementBias.value=p.displacementBias),p.emissiveMap&&(x.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,x.emissiveMapTransform)),p.specularMap&&(x.specularMap.value=p.specularMap,e(p.specularMap,x.specularMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest);const m=t.get(p).envMap;if(m&&(x.envMap.value=m,x.flipEnvMap.value=m.isCubeTexture&&m.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=p.reflectivity,x.ior.value=p.ior,x.refractionRatio.value=p.refractionRatio),p.lightMap){x.lightMap.value=p.lightMap;const M=s._useLegacyLights===!0?Math.PI:1;x.lightMapIntensity.value=p.lightMapIntensity*M,e(p.lightMap,x.lightMapTransform)}p.aoMap&&(x.aoMap.value=p.aoMap,x.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,x.aoMapTransform))}function a(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform))}function r(x,p){x.dashSize.value=p.dashSize,x.totalSize.value=p.dashSize+p.gapSize,x.scale.value=p.scale}function l(x,p,m,M){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.size.value=p.size*m,x.scale.value=M*.5,p.map&&(x.map.value=p.map,e(p.map,x.uvTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function c(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.rotation.value=p.rotation,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function h(x,p){x.specular.value.copy(p.specular),x.shininess.value=Math.max(p.shininess,1e-4)}function u(x,p){p.gradientMap&&(x.gradientMap.value=p.gradientMap)}function f(x,p){x.metalness.value=p.metalness,p.metalnessMap&&(x.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,x.metalnessMapTransform)),x.roughness.value=p.roughness,p.roughnessMap&&(x.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,x.roughnessMapTransform)),t.get(p).envMap&&(x.envMapIntensity.value=p.envMapIntensity)}function d(x,p,m){x.ior.value=p.ior,p.sheen>0&&(x.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),x.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(x.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,x.sheenColorMapTransform)),p.sheenRoughnessMap&&(x.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,x.sheenRoughnessMapTransform))),p.clearcoat>0&&(x.clearcoat.value=p.clearcoat,x.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(x.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,x.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(x.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===en&&x.clearcoatNormalScale.value.negate())),p.iridescence>0&&(x.iridescence.value=p.iridescence,x.iridescenceIOR.value=p.iridescenceIOR,x.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(x.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,x.iridescenceMapTransform)),p.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),p.transmission>0&&(x.transmission.value=p.transmission,x.transmissionSamplerMap.value=m.texture,x.transmissionSamplerSize.value.set(m.width,m.height),p.transmissionMap&&(x.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,x.transmissionMapTransform)),x.thickness.value=p.thickness,p.thicknessMap&&(x.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=p.attenuationDistance,x.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(x.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(x.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=p.specularIntensity,x.specularColor.value.copy(p.specularColor),p.specularColorMap&&(x.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,x.specularColorMapTransform)),p.specularIntensityMap&&(x.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,x.specularIntensityMapTransform))}function v(x,p){p.matcap&&(x.matcap.value=p.matcap)}function g(x,p){const m=t.get(p).light;x.referencePosition.value.setFromMatrixPosition(m.matrixWorld),x.nearDistance.value=m.shadow.camera.near,x.farDistance.value=m.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Jg(s,t,e,n){let i={},o={},a=[];const r=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(m,M){const _=M.program;n.uniformBlockBinding(m,_)}function c(m,M){let _=i[m.id];_===void 0&&(v(m),_=h(m),i[m.id]=_,m.addEventListener("dispose",x));const E=M.program;n.updateUBOMapping(m,E);const y=t.render.frame;o[m.id]!==y&&(f(m),o[m.id]=y)}function h(m){const M=u();m.__bindingPointIndex=M;const _=s.createBuffer(),E=m.__size,y=m.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,E,y),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,M,_),_}function u(){for(let m=0;m<r;m++)if(a.indexOf(m)===-1)return a.push(m),m;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(m){const M=i[m.id],_=m.uniforms,E=m.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let y=0,w=_.length;y<w;y++){const A=Array.isArray(_[y])?_[y]:[_[y]];for(let b=0,S=A.length;b<S;b++){const R=A[b];if(d(R,y,b,E)===!0){const k=R.__offset,I=Array.isArray(R.value)?R.value:[R.value];let T=0;for(let C=0;C<I.length;C++){const F=I[C],N=g(F);typeof F=="number"||typeof F=="boolean"?(R.__data[0]=F,s.bufferSubData(s.UNIFORM_BUFFER,k+T,R.__data)):F.isMatrix3?(R.__data[0]=F.elements[0],R.__data[1]=F.elements[1],R.__data[2]=F.elements[2],R.__data[3]=0,R.__data[4]=F.elements[3],R.__data[5]=F.elements[4],R.__data[6]=F.elements[5],R.__data[7]=0,R.__data[8]=F.elements[6],R.__data[9]=F.elements[7],R.__data[10]=F.elements[8],R.__data[11]=0):(F.toArray(R.__data,T),T+=N.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,k,R.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(m,M,_,E){const y=m.value,w=M+"_"+_;if(E[w]===void 0)return typeof y=="number"||typeof y=="boolean"?E[w]=y:E[w]=y.clone(),!0;{const A=E[w];if(typeof y=="number"||typeof y=="boolean"){if(A!==y)return E[w]=y,!0}else if(A.equals(y)===!1)return A.copy(y),!0}return!1}function v(m){const M=m.uniforms;let _=0;const E=16;for(let w=0,A=M.length;w<A;w++){const b=Array.isArray(M[w])?M[w]:[M[w]];for(let S=0,R=b.length;S<R;S++){const k=b[S],I=Array.isArray(k.value)?k.value:[k.value];for(let T=0,C=I.length;T<C;T++){const F=I[T],N=g(F),z=_%E;z!==0&&E-z<N.boundary&&(_+=E-z),k.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=_,_+=N.storage}}}const y=_%E;return y>0&&(_+=E-y),m.__size=_,m.__cache={},this}function g(m){const M={boundary:0,storage:0};return typeof m=="number"||typeof m=="boolean"?(M.boundary=4,M.storage=4):m.isVector2?(M.boundary=8,M.storage=8):m.isVector3||m.isColor?(M.boundary=16,M.storage=12):m.isVector4?(M.boundary=16,M.storage=16):m.isMatrix3?(M.boundary=48,M.storage=48):m.isMatrix4?(M.boundary=64,M.storage=64):m.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",m),M}function x(m){const M=m.target;M.removeEventListener("dispose",x);const _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),s.deleteBuffer(i[M.id]),delete i[M.id],delete o[M.id]}function p(){for(const m in i)s.deleteBuffer(i[m]);a=[],i={},o={}}return{bind:l,update:c,dispose:p}}class qu{constructor(t={}){const{canvas:e=qf(),context:n=null,depth:i=!0,stencil:o=!0,alpha:a=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=a;const d=new Uint32Array(4),v=new Int32Array(4);let g=null,x=null;const p=[],m=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ge,this._useLegacyLights=!1,this.toneMapping=_i,this.toneMappingExposure=1;const M=this;let _=!1,E=0,y=0,w=null,A=-1,b=null;const S=new _e,R=new _e;let k=null;const I=new It(0);let T=0,C=e.width,F=e.height,N=1,z=null,U=null;const L=new _e(0,0,C,F),W=new _e(0,0,C,F);let j=!1;const P=new Ws;let O=!1,G=!1,K=null;const Q=new ie,ot=new Ot,$=new q,Y={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function rt(){return w===null?N:1}let X=n;function Mt(H,tt){for(let it=0;it<H.length;it++){const nt=H[it],et=e.getContext(nt,tt);if(et!==null)return et}return null}try{const H={alpha:!0,depth:i,stencil:o,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Cl}`),e.addEventListener("webglcontextlost",wt,!1),e.addEventListener("webglcontextrestored",Z,!1),e.addEventListener("webglcontextcreationerror",St,!1),X===null){const tt=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&tt.shift(),X=Mt(tt,H),X===null)throw Mt(tt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(H){throw console.error("THREE.WebGLRenderer: "+H.message),H}let mt,_t,xt,kt,at,B,D,J,ut,ct,ft,Rt,vt,gt,Ct,Lt,dt,se,Xt,Bt,zt,pt,bt,ee;function fe(){mt=new l1(X),_t=new n1(X,mt,t),mt.init(_t),pt=new jg(X,mt,_t),xt=new qg(X,mt,_t),kt=new u1(X),at=new Pg,B=new Xg(X,mt,xt,at,_t,pt,kt),D=new s1(M),J=new r1(M),ut=new Md(X,_t),bt=new t1(X,mt,ut,_t),ct=new c1(X,ut,kt,bt),ft=new m1(X,ct,ut,kt),Xt=new p1(X,_t,B),Lt=new i1(at),Rt=new kg(M,D,J,mt,_t,bt,Lt),vt=new Zg(M,at),gt=new zg,Ct=new Og(mt,_t),se=new Qm(M,D,J,xt,ft,f,l),dt=new Vg(M,ft,_t),ee=new Jg(X,kt,_t,xt),Bt=new e1(X,mt,kt,_t),zt=new h1(X,mt,kt,_t),kt.programs=Rt.programs,M.capabilities=_t,M.extensions=mt,M.properties=at,M.renderLists=gt,M.shadowMap=dt,M.state=xt,M.info=kt}fe();const Yt=new Kg(M,X);this.xr=Yt,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const H=mt.get("WEBGL_lose_context");H&&H.loseContext()},this.forceContextRestore=function(){const H=mt.get("WEBGL_lose_context");H&&H.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(H){H!==void 0&&(N=H,this.setSize(C,F,!1))},this.getSize=function(H){return H.set(C,F)},this.setSize=function(H,tt,it=!0){if(Yt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=H,F=tt,e.width=Math.floor(H*N),e.height=Math.floor(tt*N),it===!0&&(e.style.width=H+"px",e.style.height=tt+"px"),this.setViewport(0,0,H,tt)},this.getDrawingBufferSize=function(H){return H.set(C*N,F*N).floor()},this.setDrawingBufferSize=function(H,tt,it){C=H,F=tt,N=it,e.width=Math.floor(H*it),e.height=Math.floor(tt*it),this.setViewport(0,0,H,tt)},this.getCurrentViewport=function(H){return H.copy(S)},this.getViewport=function(H){return H.copy(L)},this.setViewport=function(H,tt,it,nt){H.isVector4?L.set(H.x,H.y,H.z,H.w):L.set(H,tt,it,nt),xt.viewport(S.copy(L).multiplyScalar(N).floor())},this.getScissor=function(H){return H.copy(W)},this.setScissor=function(H,tt,it,nt){H.isVector4?W.set(H.x,H.y,H.z,H.w):W.set(H,tt,it,nt),xt.scissor(R.copy(W).multiplyScalar(N).floor())},this.getScissorTest=function(){return j},this.setScissorTest=function(H){xt.setScissorTest(j=H)},this.setOpaqueSort=function(H){z=H},this.setTransparentSort=function(H){U=H},this.getClearColor=function(H){return H.copy(se.getClearColor())},this.setClearColor=function(){se.setClearColor.apply(se,arguments)},this.getClearAlpha=function(){return se.getClearAlpha()},this.setClearAlpha=function(){se.setClearAlpha.apply(se,arguments)},this.clear=function(H=!0,tt=!0,it=!0){let nt=0;if(H){let et=!1;if(w!==null){const At=w.texture.format;et=At===Su||At===bu||At===yu}if(et){const At=w.texture.type,Pt=At===xn||At===ei||At===Rl||At===Ni||At===_u||At===wu,Ft=se.getClearColor(),Ht=se.getClearAlpha(),Zt=Ft.r,jt=Ft.g,$t=Ft.b;Pt?(d[0]=Zt,d[1]=jt,d[2]=$t,d[3]=Ht,X.clearBufferuiv(X.COLOR,0,d)):(v[0]=Zt,v[1]=jt,v[2]=$t,v[3]=Ht,X.clearBufferiv(X.COLOR,0,v))}else nt|=X.COLOR_BUFFER_BIT}tt&&(nt|=X.DEPTH_BUFFER_BIT),it&&(nt|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(nt)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",wt,!1),e.removeEventListener("webglcontextrestored",Z,!1),e.removeEventListener("webglcontextcreationerror",St,!1),gt.dispose(),Ct.dispose(),at.dispose(),D.dispose(),J.dispose(),ft.dispose(),bt.dispose(),ee.dispose(),Rt.dispose(),Yt.dispose(),Yt.removeEventListener("sessionstart",we),Yt.removeEventListener("sessionend",oe),K&&(K.dispose(),K=null),Ie.stop()};function wt(H){H.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),_=!0}function Z(){console.log("THREE.WebGLRenderer: Context Restored."),_=!1;const H=kt.autoReset,tt=dt.enabled,it=dt.autoUpdate,nt=dt.needsUpdate,et=dt.type;fe(),kt.autoReset=H,dt.enabled=tt,dt.autoUpdate=it,dt.needsUpdate=nt,dt.type=et}function St(H){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",H.statusMessage)}function Et(H){const tt=H.target;tt.removeEventListener("dispose",Et),Ut(tt)}function Ut(H){Dt(H),at.remove(H)}function Dt(H){const tt=at.get(H).programs;tt!==void 0&&(tt.forEach(function(it){Rt.releaseProgram(it)}),H.isShaderMaterial&&Rt.releaseShaderCache(H))}this.renderBufferDirect=function(H,tt,it,nt,et,At){tt===null&&(tt=Y);const Pt=et.isMesh&&et.matrixWorld.determinant()<0,Ft=Do(H,tt,it,nt,et);xt.setMaterial(nt,Pt);let Ht=it.index,Zt=1;if(nt.wireframe===!0){if(Ht=ct.getWireframeAttribute(it),Ht===void 0)return;Zt=2}const jt=it.drawRange,$t=it.attributes.position;let ke=jt.start*Zt,fn=(jt.start+jt.count)*Zt;At!==null&&(ke=Math.max(ke,At.start*Zt),fn=Math.min(fn,(At.start+At.count)*Zt)),Ht!==null?(ke=Math.max(ke,0),fn=Math.min(fn,Ht.count)):$t!=null&&(ke=Math.max(ke,0),fn=Math.min(fn,$t.count));const Oe=fn-ke;if(Oe<0||Oe===1/0)return;bt.setup(et,nt,Ft,it,Ht);let Wn,be=Bt;if(Ht!==null&&(Wn=ut.get(Ht),be=zt,be.setIndex(Wn)),et.isMesh)nt.wireframe===!0?(xt.setLineWidth(nt.wireframeLinewidth*rt()),be.setMode(X.LINES)):be.setMode(X.TRIANGLES);else if(et.isLine){let Jt=nt.linewidth;Jt===void 0&&(Jt=1),xt.setLineWidth(Jt*rt()),et.isLineSegments?be.setMode(X.LINES):et.isLineLoop?be.setMode(X.LINE_LOOP):be.setMode(X.LINE_STRIP)}else et.isPoints?be.setMode(X.POINTS):et.isSprite&&be.setMode(X.TRIANGLES);if(et.isBatchedMesh)be.renderMultiDraw(et._multiDrawStarts,et._multiDrawCounts,et._multiDrawCount);else if(et.isInstancedMesh)be.renderInstances(ke,Oe,et.count);else if(it.isInstancedBufferGeometry){const Jt=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,tr=Math.min(it.instanceCount,Jt);be.renderInstances(ke,Oe,tr)}else be.render(ke,Oe)};function ne(H,tt,it){H.transparent===!0&&H.side===ln&&H.forceSinglePass===!1?(H.side=en,H.needsUpdate=!0,Ji(H,tt,it),H.side=oi,H.needsUpdate=!0,Ji(H,tt,it),H.side=ln):Ji(H,tt,it)}this.compile=function(H,tt,it=null){it===null&&(it=H),x=Ct.get(it),x.init(),m.push(x),it.traverseVisible(function(et){et.isLight&&et.layers.test(tt.layers)&&(x.pushLight(et),et.castShadow&&x.pushShadow(et))}),H!==it&&H.traverseVisible(function(et){et.isLight&&et.layers.test(tt.layers)&&(x.pushLight(et),et.castShadow&&x.pushShadow(et))}),x.setupLights(M._useLegacyLights);const nt=new Set;return H.traverse(function(et){const At=et.material;if(At)if(Array.isArray(At))for(let Pt=0;Pt<At.length;Pt++){const Ft=At[Pt];ne(Ft,it,et),nt.add(Ft)}else ne(At,it,et),nt.add(At)}),m.pop(),x=null,nt},this.compileAsync=function(H,tt,it=null){const nt=this.compile(H,tt,it);return new Promise(et=>{function At(){if(nt.forEach(function(Pt){at.get(Pt).currentProgram.isReady()&&nt.delete(Pt)}),nt.size===0){et(H);return}setTimeout(At,10)}mt.get("KHR_parallel_shader_compile")!==null?At():setTimeout(At,10)})};let ce=null;function Le(H){ce&&ce(H)}function we(){Ie.stop()}function oe(){Ie.start()}const Ie=new Ou;Ie.setAnimationLoop(Le),typeof self<"u"&&Ie.setContext(self),this.setAnimationLoop=function(H){ce=H,Yt.setAnimationLoop(H),H===null?Ie.stop():Ie.start()},Yt.addEventListener("sessionstart",we),Yt.addEventListener("sessionend",oe),this.render=function(H,tt){if(tt!==void 0&&tt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(_===!0)return;H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),tt.parent===null&&tt.matrixWorldAutoUpdate===!0&&tt.updateMatrixWorld(),Yt.enabled===!0&&Yt.isPresenting===!0&&(Yt.cameraAutoUpdate===!0&&Yt.updateCamera(tt),tt=Yt.getCamera()),H.isScene===!0&&H.onBeforeRender(M,H,tt,w),x=Ct.get(H,m.length),x.init(),m.push(x),Q.multiplyMatrices(tt.projectionMatrix,tt.matrixWorldInverse),P.setFromProjectionMatrix(Q),G=this.localClippingEnabled,O=Lt.init(this.clippingPlanes,G),g=gt.get(H,p.length),g.init(),p.push(g),We(H,tt,0,M.sortObjects),g.finish(),M.sortObjects===!0&&g.sort(z,U),this.info.render.frame++,O===!0&&Lt.beginShadows();const it=x.state.shadowsArray;if(dt.render(it,H,tt),O===!0&&Lt.endShadows(),this.info.autoReset===!0&&this.info.reset(),se.render(g,H),x.setupLights(M._useLegacyLights),tt.isArrayCamera){const nt=tt.cameras;for(let et=0,At=nt.length;et<At;et++){const Pt=nt[et];$i(g,H,Pt,Pt.viewport)}}else $i(g,H,tt);w!==null&&(B.updateMultisampleRenderTarget(w),B.updateRenderTargetMipmap(w)),H.isScene===!0&&H.onAfterRender(M,H,tt),bt.resetDefaultState(),A=-1,b=null,m.pop(),m.length>0?x=m[m.length-1]:x=null,p.pop(),p.length>0?g=p[p.length-1]:g=null};function We(H,tt,it,nt){if(H.visible===!1)return;if(H.layers.test(tt.layers)){if(H.isGroup)it=H.renderOrder;else if(H.isLOD)H.autoUpdate===!0&&H.update(tt);else if(H.isLight)x.pushLight(H),H.castShadow&&x.pushShadow(H);else if(H.isSprite){if(!H.frustumCulled||P.intersectsSprite(H)){nt&&$.setFromMatrixPosition(H.matrixWorld).applyMatrix4(Q);const Pt=ft.update(H),Ft=H.material;Ft.visible&&g.push(H,Pt,Ft,it,$.z,null)}}else if((H.isMesh||H.isLine||H.isPoints)&&(!H.frustumCulled||P.intersectsObject(H))){const Pt=ft.update(H),Ft=H.material;if(nt&&(H.boundingSphere!==void 0?(H.boundingSphere===null&&H.computeBoundingSphere(),$.copy(H.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),$.copy(Pt.boundingSphere.center)),$.applyMatrix4(H.matrixWorld).applyMatrix4(Q)),Array.isArray(Ft)){const Ht=Pt.groups;for(let Zt=0,jt=Ht.length;Zt<jt;Zt++){const $t=Ht[Zt],ke=Ft[$t.materialIndex];ke&&ke.visible&&g.push(H,Pt,ke,it,$.z,$t)}}else Ft.visible&&g.push(H,Pt,Ft,it,$.z,null)}}const At=H.children;for(let Pt=0,Ft=At.length;Pt<Ft;Pt++)We(At[Pt],tt,it,nt)}function $i(H,tt,it,nt){const et=H.opaque,At=H.transmissive,Pt=H.transparent;x.setupLightsView(it),O===!0&&Lt.setGlobalState(M.clippingPlanes,it),At.length>0&&Cn(et,At,tt,it),nt&&xt.viewport(S.copy(nt)),et.length>0&&Ki(et,tt,it),At.length>0&&Ki(At,tt,it),Pt.length>0&&Ki(Pt,tt,it),xt.buffers.depth.setTest(!0),xt.buffers.depth.setMask(!0),xt.buffers.color.setMask(!0),xt.setPolygonOffset(!1)}function Cn(H,tt,it,nt){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;const At=_t.isWebGL2;K===null&&(K=new vn(1,1,{generateMipmaps:!0,type:mt.has("EXT_color_buffer_half_float")?ai:xn,minFilter:Wi,samples:At?4:0})),M.getDrawingBufferSize(ot),At?K.setSize(ot.x,ot.y):K.setSize(Ua(ot.x),Ua(ot.y));const Pt=M.getRenderTarget();M.setRenderTarget(K),M.getClearColor(I),T=M.getClearAlpha(),T<1&&M.setClearColor(16777215,.5),M.clear();const Ft=M.toneMapping;M.toneMapping=_i,Ki(H,it,nt),B.updateMultisampleRenderTarget(K),B.updateRenderTargetMipmap(K);let Ht=!1;for(let Zt=0,jt=tt.length;Zt<jt;Zt++){const $t=tt[Zt],ke=$t.object,fn=$t.geometry,Oe=$t.material,Wn=$t.group;if(Oe.side===ln&&ke.layers.test(nt.layers)){const be=Oe.side;Oe.side=en,Oe.needsUpdate=!0,Zi(ke,it,nt,fn,Oe,Wn),Oe.side=be,Oe.needsUpdate=!0,Ht=!0}}Ht===!0&&(B.updateMultisampleRenderTarget(K),B.updateRenderTargetMipmap(K)),M.setRenderTarget(Pt),M.setClearColor(I,T),M.toneMapping=Ft}function Ki(H,tt,it){const nt=tt.isScene===!0?tt.overrideMaterial:null;for(let et=0,At=H.length;et<At;et++){const Pt=H[et],Ft=Pt.object,Ht=Pt.geometry,Zt=nt===null?Pt.material:nt,jt=Pt.group;Ft.layers.test(it.layers)&&Zi(Ft,tt,it,Ht,Zt,jt)}}function Zi(H,tt,it,nt,et,At){H.onBeforeRender(M,tt,it,nt,et,At),H.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,H.matrixWorld),H.normalMatrix.getNormalMatrix(H.modelViewMatrix),et.onBeforeRender(M,tt,it,nt,H,At),et.transparent===!0&&et.side===ln&&et.forceSinglePass===!1?(et.side=en,et.needsUpdate=!0,M.renderBufferDirect(it,tt,nt,et,H,At),et.side=oi,et.needsUpdate=!0,M.renderBufferDirect(it,tt,nt,et,H,At),et.side=ln):M.renderBufferDirect(it,tt,nt,et,H,At),H.onAfterRender(M,tt,it,nt,et,At)}function Ji(H,tt,it){tt.isScene!==!0&&(tt=Y);const nt=at.get(H),et=x.state.lights,At=x.state.shadowsArray,Pt=et.state.version,Ft=Rt.getParameters(H,et.state,At,tt,it),Ht=Rt.getProgramCacheKey(Ft);let Zt=nt.programs;nt.environment=H.isMeshStandardMaterial?tt.environment:null,nt.fog=tt.fog,nt.envMap=(H.isMeshStandardMaterial?J:D).get(H.envMap||nt.environment),Zt===void 0&&(H.addEventListener("dispose",Et),Zt=new Map,nt.programs=Zt);let jt=Zt.get(Ht);if(jt!==void 0){if(nt.currentProgram===jt&&nt.lightsStateVersion===Pt)return Nn(H,Ft),jt}else Ft.uniforms=Rt.getUniforms(H),H.onBuild(it,Ft,M),H.onBeforeCompile(Ft,M),jt=Rt.acquireProgram(Ft,Ht),Zt.set(Ht,jt),nt.uniforms=Ft.uniforms;const $t=nt.uniforms;return(!H.isShaderMaterial&&!H.isRawShaderMaterial||H.clipping===!0)&&($t.clippingPlanes=Lt.uniform),Nn(H,Ft),nt.needsLights=Nt(H),nt.lightsStateVersion=Pt,nt.needsLights&&($t.ambientLightColor.value=et.state.ambient,$t.lightProbe.value=et.state.probe,$t.directionalLights.value=et.state.directional,$t.directionalLightShadows.value=et.state.directionalShadow,$t.spotLights.value=et.state.spot,$t.spotLightShadows.value=et.state.spotShadow,$t.rectAreaLights.value=et.state.rectArea,$t.ltc_1.value=et.state.rectAreaLTC1,$t.ltc_2.value=et.state.rectAreaLTC2,$t.pointLights.value=et.state.point,$t.pointLightShadows.value=et.state.pointShadow,$t.hemisphereLights.value=et.state.hemi,$t.directionalShadowMap.value=et.state.directionalShadowMap,$t.directionalShadowMatrix.value=et.state.directionalShadowMatrix,$t.spotShadowMap.value=et.state.spotShadowMap,$t.spotLightMatrix.value=et.state.spotLightMatrix,$t.spotLightMap.value=et.state.spotLightMap,$t.pointShadowMap.value=et.state.pointShadowMap,$t.pointShadowMatrix.value=et.state.pointShadowMatrix),nt.currentProgram=jt,nt.uniformsList=null,jt}function qs(H){if(H.uniformsList===null){const tt=H.currentProgram.getUniforms();H.uniformsList=ba.seqWithValue(tt.seq,H.uniforms)}return H.uniformsList}function Nn(H,tt){const it=at.get(H);it.outputColorSpace=tt.outputColorSpace,it.batching=tt.batching,it.instancing=tt.instancing,it.instancingColor=tt.instancingColor,it.skinning=tt.skinning,it.morphTargets=tt.morphTargets,it.morphNormals=tt.morphNormals,it.morphColors=tt.morphColors,it.morphTargetsCount=tt.morphTargetsCount,it.numClippingPlanes=tt.numClippingPlanes,it.numIntersection=tt.numClipIntersection,it.vertexAlphas=tt.vertexAlphas,it.vertexTangents=tt.vertexTangents,it.toneMapping=tt.toneMapping}function Do(H,tt,it,nt,et){tt.isScene!==!0&&(tt=Y),B.resetTextureUnits();const At=tt.fog,Pt=nt.isMeshStandardMaterial?tt.environment:null,Ft=w===null?M.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:ri,Ht=(nt.isMeshStandardMaterial?J:D).get(nt.envMap||Pt),Zt=nt.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,jt=!!it.attributes.tangent&&(!!nt.normalMap||nt.anisotropy>0),$t=!!it.morphAttributes.position,ke=!!it.morphAttributes.normal,fn=!!it.morphAttributes.color;let Oe=_i;nt.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Oe=M.toneMapping);const Wn=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,be=Wn!==void 0?Wn.length:0,Jt=at.get(nt),tr=x.state.lights;if(O===!0&&(G===!0||H!==b)){const Mn=H===b&&nt.id===A;Lt.setState(nt,H,Mn)}let Ae=!1;nt.version===Jt.__version?(Jt.needsLights&&Jt.lightsStateVersion!==tr.state.version||Jt.outputColorSpace!==Ft||et.isBatchedMesh&&Jt.batching===!1||!et.isBatchedMesh&&Jt.batching===!0||et.isInstancedMesh&&Jt.instancing===!1||!et.isInstancedMesh&&Jt.instancing===!0||et.isSkinnedMesh&&Jt.skinning===!1||!et.isSkinnedMesh&&Jt.skinning===!0||et.isInstancedMesh&&Jt.instancingColor===!0&&et.instanceColor===null||et.isInstancedMesh&&Jt.instancingColor===!1&&et.instanceColor!==null||Jt.envMap!==Ht||nt.fog===!0&&Jt.fog!==At||Jt.numClippingPlanes!==void 0&&(Jt.numClippingPlanes!==Lt.numPlanes||Jt.numIntersection!==Lt.numIntersection)||Jt.vertexAlphas!==Zt||Jt.vertexTangents!==jt||Jt.morphTargets!==$t||Jt.morphNormals!==ke||Jt.morphColors!==fn||Jt.toneMapping!==Oe||_t.isWebGL2===!0&&Jt.morphTargetsCount!==be)&&(Ae=!0):(Ae=!0,Jt.__version=nt.version);let bi=Jt.currentProgram;Ae===!0&&(bi=Ji(nt,tt,et));let ql=!1,Xs=!1,er=!1;const qe=bi.getUniforms(),Si=Jt.uniforms;if(xt.useProgram(bi.program)&&(ql=!0,Xs=!0,er=!0),nt.id!==A&&(A=nt.id,Xs=!0),ql||b!==H){qe.setValue(X,"projectionMatrix",H.projectionMatrix),qe.setValue(X,"viewMatrix",H.matrixWorldInverse);const Mn=qe.map.cameraPosition;Mn!==void 0&&Mn.setValue(X,$.setFromMatrixPosition(H.matrixWorld)),_t.logarithmicDepthBuffer&&qe.setValue(X,"logDepthBufFC",2/(Math.log(H.far+1)/Math.LN2)),(nt.isMeshPhongMaterial||nt.isMeshToonMaterial||nt.isMeshLambertMaterial||nt.isMeshBasicMaterial||nt.isMeshStandardMaterial||nt.isShaderMaterial)&&qe.setValue(X,"isOrthographic",H.isOrthographicCamera===!0),b!==H&&(b=H,Xs=!0,er=!0)}if(et.isSkinnedMesh){qe.setOptional(X,et,"bindMatrix"),qe.setOptional(X,et,"bindMatrixInverse");const Mn=et.skeleton;Mn&&(_t.floatVertexTextures?(Mn.boneTexture===null&&Mn.computeBoneTexture(),qe.setValue(X,"boneTexture",Mn.boneTexture,B)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}et.isBatchedMesh&&(qe.setOptional(X,et,"batchingTexture"),qe.setValue(X,"batchingTexture",et._matricesTexture,B));const nr=it.morphAttributes;if((nr.position!==void 0||nr.normal!==void 0||nr.color!==void 0&&_t.isWebGL2===!0)&&Xt.update(et,it,bi),(Xs||Jt.receiveShadow!==et.receiveShadow)&&(Jt.receiveShadow=et.receiveShadow,qe.setValue(X,"receiveShadow",et.receiveShadow)),nt.isMeshGouraudMaterial&&nt.envMap!==null&&(Si.envMap.value=Ht,Si.flipEnvMap.value=Ht.isCubeTexture&&Ht.isRenderTargetTexture===!1?-1:1),Xs&&(qe.setValue(X,"toneMappingExposure",M.toneMappingExposure),Jt.needsLights&&Qa(Si,er),At&&nt.fog===!0&&vt.refreshFogUniforms(Si,At),vt.refreshMaterialUniforms(Si,nt,N,F,K),ba.upload(X,qs(Jt),Si,B)),nt.isShaderMaterial&&nt.uniformsNeedUpdate===!0&&(ba.upload(X,qs(Jt),Si,B),nt.uniformsNeedUpdate=!1),nt.isSpriteMaterial&&qe.setValue(X,"center",et.center),qe.setValue(X,"modelViewMatrix",et.modelViewMatrix),qe.setValue(X,"normalMatrix",et.normalMatrix),qe.setValue(X,"modelMatrix",et.matrixWorld),nt.isShaderMaterial||nt.isRawShaderMaterial){const Mn=nt.uniformsGroups;for(let ir=0,T0=Mn.length;ir<T0;ir++)if(_t.isWebGL2){const Xl=Mn[ir];ee.update(Xl,bi),ee.bind(Xl,bi)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return bi}function Qa(H,tt){H.ambientLightColor.needsUpdate=tt,H.lightProbe.needsUpdate=tt,H.directionalLights.needsUpdate=tt,H.directionalLightShadows.needsUpdate=tt,H.pointLights.needsUpdate=tt,H.pointLightShadows.needsUpdate=tt,H.spotLights.needsUpdate=tt,H.spotLightShadows.needsUpdate=tt,H.rectAreaLights.needsUpdate=tt,H.hemisphereLights.needsUpdate=tt}function Nt(H){return H.isMeshLambertMaterial||H.isMeshToonMaterial||H.isMeshPhongMaterial||H.isMeshStandardMaterial||H.isShadowMaterial||H.isShaderMaterial&&H.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(H,tt,it){at.get(H.texture).__webglTexture=tt,at.get(H.depthTexture).__webglTexture=it;const nt=at.get(H);nt.__hasExternalTextures=!0,nt.__hasExternalTextures&&(nt.__autoAllocateDepthBuffer=it===void 0,nt.__autoAllocateDepthBuffer||mt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),nt.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(H,tt){const it=at.get(H);it.__webglFramebuffer=tt,it.__useDefaultFramebuffer=tt===void 0},this.setRenderTarget=function(H,tt=0,it=0){w=H,E=tt,y=it;let nt=!0,et=null,At=!1,Pt=!1;if(H){const Ht=at.get(H);Ht.__useDefaultFramebuffer!==void 0?(xt.bindFramebuffer(X.FRAMEBUFFER,null),nt=!1):Ht.__webglFramebuffer===void 0?B.setupRenderTarget(H):Ht.__hasExternalTextures&&B.rebindTextures(H,at.get(H.texture).__webglTexture,at.get(H.depthTexture).__webglTexture);const Zt=H.texture;(Zt.isData3DTexture||Zt.isDataArrayTexture||Zt.isCompressedArrayTexture)&&(Pt=!0);const jt=at.get(H).__webglFramebuffer;H.isWebGLCubeRenderTarget?(Array.isArray(jt[tt])?et=jt[tt][it]:et=jt[tt],At=!0):_t.isWebGL2&&H.samples>0&&B.useMultisampledRTT(H)===!1?et=at.get(H).__webglMultisampledFramebuffer:Array.isArray(jt)?et=jt[it]:et=jt,S.copy(H.viewport),R.copy(H.scissor),k=H.scissorTest}else S.copy(L).multiplyScalar(N).floor(),R.copy(W).multiplyScalar(N).floor(),k=j;if(xt.bindFramebuffer(X.FRAMEBUFFER,et)&&_t.drawBuffers&&nt&&xt.drawBuffers(H,et),xt.viewport(S),xt.scissor(R),xt.setScissorTest(k),At){const Ht=at.get(H.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Ht.__webglTexture,it)}else if(Pt){const Ht=at.get(H.texture),Zt=tt||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,Ht.__webglTexture,it||0,Zt)}A=-1},this.readRenderTargetPixels=function(H,tt,it,nt,et,At,Pt){if(!(H&&H.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ft=at.get(H).__webglFramebuffer;if(H.isWebGLCubeRenderTarget&&Pt!==void 0&&(Ft=Ft[Pt]),Ft){xt.bindFramebuffer(X.FRAMEBUFFER,Ft);try{const Ht=H.texture,Zt=Ht.format,jt=Ht.type;if(Zt!==Ke&&pt.convert(Zt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const $t=jt===ai&&(mt.has("EXT_color_buffer_half_float")||_t.isWebGL2&&mt.has("EXT_color_buffer_float"));if(jt!==xn&&pt.convert(jt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(jt===In&&(_t.isWebGL2||mt.has("OES_texture_float")||mt.has("WEBGL_color_buffer_float")))&&!$t){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}tt>=0&&tt<=H.width-nt&&it>=0&&it<=H.height-et&&X.readPixels(tt,it,nt,et,pt.convert(Zt),pt.convert(jt),At)}finally{const Ht=w!==null?at.get(w).__webglFramebuffer:null;xt.bindFramebuffer(X.FRAMEBUFFER,Ht)}}},this.copyFramebufferToTexture=function(H,tt,it=0){const nt=Math.pow(2,-it),et=Math.floor(tt.image.width*nt),At=Math.floor(tt.image.height*nt);B.setTexture2D(tt,0),X.copyTexSubImage2D(X.TEXTURE_2D,it,0,0,H.x,H.y,et,At),xt.unbindTexture()},this.copyTextureToTexture=function(H,tt,it,nt=0){const et=tt.image.width,At=tt.image.height,Pt=pt.convert(it.format),Ft=pt.convert(it.type);B.setTexture2D(it,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,it.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,it.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,it.unpackAlignment),tt.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,nt,H.x,H.y,et,At,Pt,Ft,tt.image.data):tt.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,nt,H.x,H.y,tt.mipmaps[0].width,tt.mipmaps[0].height,Pt,tt.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,nt,H.x,H.y,Pt,Ft,tt.image),nt===0&&it.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),xt.unbindTexture()},this.copyTextureToTexture3D=function(H,tt,it,nt,et=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const At=H.max.x-H.min.x+1,Pt=H.max.y-H.min.y+1,Ft=H.max.z-H.min.z+1,Ht=pt.convert(nt.format),Zt=pt.convert(nt.type);let jt;if(nt.isData3DTexture)B.setTexture3D(nt,0),jt=X.TEXTURE_3D;else if(nt.isDataArrayTexture||nt.isCompressedArrayTexture)B.setTexture2DArray(nt,0),jt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,nt.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,nt.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,nt.unpackAlignment);const $t=X.getParameter(X.UNPACK_ROW_LENGTH),ke=X.getParameter(X.UNPACK_IMAGE_HEIGHT),fn=X.getParameter(X.UNPACK_SKIP_PIXELS),Oe=X.getParameter(X.UNPACK_SKIP_ROWS),Wn=X.getParameter(X.UNPACK_SKIP_IMAGES),be=it.isCompressedTexture?it.mipmaps[et]:it.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,be.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,be.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,H.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,H.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,H.min.z),it.isDataTexture||it.isData3DTexture?X.texSubImage3D(jt,et,tt.x,tt.y,tt.z,At,Pt,Ft,Ht,Zt,be.data):it.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(jt,et,tt.x,tt.y,tt.z,At,Pt,Ft,Ht,be.data)):X.texSubImage3D(jt,et,tt.x,tt.y,tt.z,At,Pt,Ft,Ht,Zt,be),X.pixelStorei(X.UNPACK_ROW_LENGTH,$t),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,ke),X.pixelStorei(X.UNPACK_SKIP_PIXELS,fn),X.pixelStorei(X.UNPACK_SKIP_ROWS,Oe),X.pixelStorei(X.UNPACK_SKIP_IMAGES,Wn),et===0&&nt.generateMipmaps&&X.generateMipmap(jt),xt.unbindTexture()},this.initTexture=function(H){H.isCubeTexture?B.setTextureCube(H,0):H.isData3DTexture?B.setTexture3D(H,0):H.isDataArrayTexture||H.isCompressedArrayTexture?B.setTexture2DArray(H,0):B.setTexture2D(H,0),xt.unbindTexture()},this.resetState=function(){E=0,y=0,w=null,xt.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ni}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===kl?"display-p3":"srgb",e.unpackColorSpace=de.workingColorSpace===qa?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Ge?Bi:Au}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Bi?Ge:ri}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Qg extends qu{}Qg.prototype.isWebGL1Renderer=!0;class Bs extends un{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class yi extends hn{constructor(t=null,e=1,n=1,i,o,a,r,l,c=Se,h=Se,u,f){super(null,a,r,l,c,h,i,o,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class si extends he{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const ms=new ie,dh=new ie,ia=[],ph=new li,tx=new ie,Zs=new ue,Js=new Yi;class xo extends ue{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new si(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,tx)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new li),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ms),ph.copy(t.boundingBox).applyMatrix4(ms),this.boundingBox.union(ph)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Yi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ms),Js.copy(t.boundingSphere).applyMatrix4(ms),this.boundingSphere.union(Js)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Zs.geometry=this.geometry,Zs.material=this.material,Zs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Js.copy(this.boundingSphere),Js.applyMatrix4(n),t.ray.intersectsSphere(Js)!==!1))for(let o=0;o<i;o++){this.getMatrixAt(o,ms),dh.multiplyMatrices(n,ms),Zs.matrixWorld=dh,Zs.raycast(t,ia);for(let a=0,r=ia.length;a<r;a++){const l=ia[a];l.instanceId=o,l.object=this,e.push(l)}ia.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new si(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class ex extends ko{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new It(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const mh=new ie,pl=new Ll,sa=new Yi,oa=new q;class Xu extends un{constructor(t=new Fe,e=new ex){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,o=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sa.copy(n.boundingSphere),sa.applyMatrix4(i),sa.radius+=o,t.ray.intersectsSphere(sa)===!1)return;mh.copy(i).invert(),pl.copy(t.ray).applyMatrix4(mh);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),l=r*r,c=n.index,u=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let v=f,g=d;v<g;v++){const x=c.getX(v);oa.fromBufferAttribute(u,x),gh(oa,x,l,i,t,e,this)}}else{const f=Math.max(0,a.start),d=Math.min(u.count,a.start+a.count);for(let v=f,g=d;v<g;v++)oa.fromBufferAttribute(u,v),gh(oa,v,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=i.length;o<a;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function gh(s,t,e,n,i,o,a){const r=pl.distanceSqToPoint(s);if(r<e){const l=new q;pl.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;o.push({distance:c,distanceToRay:Math.sqrt(r),point:l,index:t,face:null,object:a})}}class Ul extends Fe{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const o=[],a=[];r(i),c(n),h(),this.setAttribute("position",new pe(o,3)),this.setAttribute("normal",new pe(o.slice(),3)),this.setAttribute("uv",new pe(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function r(m){const M=new q,_=new q,E=new q;for(let y=0;y<e.length;y+=3)d(e[y+0],M),d(e[y+1],_),d(e[y+2],E),l(M,_,E,m)}function l(m,M,_,E){const y=E+1,w=[];for(let A=0;A<=y;A++){w[A]=[];const b=m.clone().lerp(_,A/y),S=M.clone().lerp(_,A/y),R=y-A;for(let k=0;k<=R;k++)k===0&&A===y?w[A][k]=b:w[A][k]=b.clone().lerp(S,k/R)}for(let A=0;A<y;A++)for(let b=0;b<2*(y-A)-1;b++){const S=Math.floor(b/2);b%2===0?(f(w[A][S+1]),f(w[A+1][S]),f(w[A][S])):(f(w[A][S+1]),f(w[A+1][S+1]),f(w[A+1][S]))}}function c(m){const M=new q;for(let _=0;_<o.length;_+=3)M.x=o[_+0],M.y=o[_+1],M.z=o[_+2],M.normalize().multiplyScalar(m),o[_+0]=M.x,o[_+1]=M.y,o[_+2]=M.z}function h(){const m=new q;for(let M=0;M<o.length;M+=3){m.x=o[M+0],m.y=o[M+1],m.z=o[M+2];const _=x(m)/2/Math.PI+.5,E=p(m)/Math.PI+.5;a.push(_,1-E)}v(),u()}function u(){for(let m=0;m<a.length;m+=6){const M=a[m+0],_=a[m+2],E=a[m+4],y=Math.max(M,_,E),w=Math.min(M,_,E);y>.9&&w<.1&&(M<.2&&(a[m+0]+=1),_<.2&&(a[m+2]+=1),E<.2&&(a[m+4]+=1))}}function f(m){o.push(m.x,m.y,m.z)}function d(m,M){const _=m*3;M.x=t[_+0],M.y=t[_+1],M.z=t[_+2]}function v(){const m=new q,M=new q,_=new q,E=new q,y=new Ot,w=new Ot,A=new Ot;for(let b=0,S=0;b<o.length;b+=9,S+=6){m.set(o[b+0],o[b+1],o[b+2]),M.set(o[b+3],o[b+4],o[b+5]),_.set(o[b+6],o[b+7],o[b+8]),y.set(a[S+0],a[S+1]),w.set(a[S+2],a[S+3]),A.set(a[S+4],a[S+5]),E.copy(m).add(M).add(_).divideScalar(3);const R=x(E);g(y,S+0,m,R),g(w,S+2,M,R),g(A,S+4,_,R)}}function g(m,M,_,E){E<0&&m.x===1&&(a[M]=m.x-1),_.x===0&&_.z===0&&(a[M]=E/2/Math.PI+.5)}function x(m){return Math.atan2(m.z,-m.x)}function p(m){return Math.atan2(-m.y,Math.sqrt(m.x*m.x+m.z*m.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ul(t.vertices,t.indices,t.radius,t.details)}}const nx={triangulate:function(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let o=ju(s,0,i,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,l,c,h,u,f,d;if(n&&(o=rx(s,t,o,e)),s.length>80*e){r=c=s[0],l=h=s[1];for(let v=e;v<i;v+=e)u=s[v],f=s[v+1],u<r&&(r=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);d=Math.max(c-r,h-l),d=d!==0?32767/d:0}return wo(o,a,e,r,l,d,0),a}};function ju(s,t,e,n,i){let o,a;if(i===vx(s,t,e,n)>0)for(o=t;o<e;o+=n)a=xh(o,s[o],s[o+1],a);else for(o=e-n;o>=t;o-=n)a=xh(o,s[o],s[o+1],a);return a&&ja(a,a.next)&&(bo(a),a=a.next),a}function Vi(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(ja(e,e.next)||Ee(e.prev,e,e.next)===0)){if(bo(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function wo(s,t,e,n,i,o,a){if(!s)return;!a&&o&&fx(s,n,i,o);let r=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,o?sx(s,n,i,o):ix(s)){t.push(l.i/e|0),t.push(s.i/e|0),t.push(c.i/e|0),bo(s),s=c.next,r=c.next;continue}if(s=c,s===r){a?a===1?(s=ox(Vi(s),t,e),wo(s,t,e,n,i,o,2)):a===2&&ax(s,t,e,n,i,o):wo(Vi(s),t,e,n,i,o,1);break}}}function ix(s){const t=s.prev,e=s,n=s.next;if(Ee(t,e,n)>=0)return!1;const i=t.x,o=e.x,a=n.x,r=t.y,l=e.y,c=n.y,h=i<o?i<a?i:a:o<a?o:a,u=r<l?r<c?r:c:l<c?l:c,f=i>o?i>a?i:a:o>a?o:a,d=r>l?r>c?r:c:l>c?l:c;let v=n.next;for(;v!==t;){if(v.x>=h&&v.x<=f&&v.y>=u&&v.y<=d&&Rs(i,r,o,l,a,c,v.x,v.y)&&Ee(v.prev,v,v.next)>=0)return!1;v=v.next}return!0}function sx(s,t,e,n){const i=s.prev,o=s,a=s.next;if(Ee(i,o,a)>=0)return!1;const r=i.x,l=o.x,c=a.x,h=i.y,u=o.y,f=a.y,d=r<l?r<c?r:c:l<c?l:c,v=h<u?h<f?h:f:u<f?u:f,g=r>l?r>c?r:c:l>c?l:c,x=h>u?h>f?h:f:u>f?u:f,p=ml(d,v,t,e,n),m=ml(g,x,t,e,n);let M=s.prevZ,_=s.nextZ;for(;M&&M.z>=p&&_&&_.z<=m;){if(M.x>=d&&M.x<=g&&M.y>=v&&M.y<=x&&M!==i&&M!==a&&Rs(r,h,l,u,c,f,M.x,M.y)&&Ee(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=d&&_.x<=g&&_.y>=v&&_.y<=x&&_!==i&&_!==a&&Rs(r,h,l,u,c,f,_.x,_.y)&&Ee(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=d&&M.x<=g&&M.y>=v&&M.y<=x&&M!==i&&M!==a&&Rs(r,h,l,u,c,f,M.x,M.y)&&Ee(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=m;){if(_.x>=d&&_.x<=g&&_.y>=v&&_.y<=x&&_!==i&&_!==a&&Rs(r,h,l,u,c,f,_.x,_.y)&&Ee(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function ox(s,t,e){let n=s;do{const i=n.prev,o=n.next.next;!ja(i,o)&&Yu(i,n,n.next,o)&&yo(i,o)&&yo(o,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(o.i/e|0),bo(n),bo(n.next),n=s=o),n=n.next}while(n!==s);return Vi(n)}function ax(s,t,e,n,i,o){let a=s;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&mx(a,r)){let l=$u(a,r);a=Vi(a,a.next),l=Vi(l,l.next),wo(a,t,e,n,i,o,0),wo(l,t,e,n,i,o,0);return}r=r.next}a=a.next}while(a!==s)}function rx(s,t,e,n){const i=[];let o,a,r,l,c;for(o=0,a=t.length;o<a;o++)r=t[o]*n,l=o<a-1?t[o+1]*n:s.length,c=ju(s,r,l,n,!1),c===c.next&&(c.steiner=!0),i.push(px(c));for(i.sort(lx),o=0;o<i.length;o++)e=cx(i[o],e);return e}function lx(s,t){return s.x-t.x}function cx(s,t){const e=hx(s,t);if(!e)return t;const n=$u(e,s);return Vi(n,n.next),Vi(e,e.next)}function hx(s,t){let e=t,n=-1/0,i;const o=s.x,a=s.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const f=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=o&&f>n&&(n=f,i=e.x<e.next.x?e:e.next,f===o))return i}e=e.next}while(e!==t);if(!i)return null;const r=i,l=i.x,c=i.y;let h=1/0,u;e=i;do o>=e.x&&e.x>=l&&o!==e.x&&Rs(a<c?o:n,a,l,c,a<c?n:o,a,e.x,e.y)&&(u=Math.abs(a-e.y)/(o-e.x),yo(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&ux(i,e)))&&(i=e,h=u)),e=e.next;while(e!==r);return i}function ux(s,t){return Ee(s.prev,s,t.prev)<0&&Ee(t.next,s,s.next)<0}function fx(s,t,e,n){let i=s;do i.z===0&&(i.z=ml(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,dx(i)}function dx(s){let t,e,n,i,o,a,r,l,c=1;do{for(e=s,s=null,o=null,a=0;e;){for(a++,n=e,r=0,t=0;t<c&&(r++,n=n.nextZ,!!n);t++);for(l=c;r>0||l>0&&n;)r!==0&&(l===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,r--):(i=n,n=n.nextZ,l--),o?o.nextZ=i:s=i,i.prevZ=o,o=i;e=n}o.nextZ=null,c*=2}while(a>1);return s}function ml(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function px(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function Rs(s,t,e,n,i,o,a,r){return(i-a)*(t-r)>=(s-a)*(o-r)&&(s-a)*(n-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(i-a)*(n-r)}function mx(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!gx(s,t)&&(yo(s,t)&&yo(t,s)&&xx(s,t)&&(Ee(s.prev,s,t.prev)||Ee(s,t.prev,t))||ja(s,t)&&Ee(s.prev,s,s.next)>0&&Ee(t.prev,t,t.next)>0)}function Ee(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function ja(s,t){return s.x===t.x&&s.y===t.y}function Yu(s,t,e,n){const i=ra(Ee(s,t,e)),o=ra(Ee(s,t,n)),a=ra(Ee(e,n,s)),r=ra(Ee(e,n,t));return!!(i!==o&&a!==r||i===0&&aa(s,e,t)||o===0&&aa(s,n,t)||a===0&&aa(e,s,n)||r===0&&aa(e,t,n))}function aa(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function ra(s){return s>0?1:s<0?-1:0}function gx(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Yu(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function yo(s,t){return Ee(s.prev,s,s.next)<0?Ee(s,t,s.next)>=0&&Ee(s,s.prev,t)>=0:Ee(s,t,s.prev)<0||Ee(s,s.next,t)<0}function xx(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,o=(s.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&i<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function $u(s,t){const e=new gl(s.i,s.x,s.y),n=new gl(t.i,t.x,t.y),i=s.next,o=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function xh(s,t,e,n){const i=new gl(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function bo(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function gl(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function vx(s,t,e,n){let i=0;for(let o=t,a=e-n;o<e;o+=n)i+=(s[a]-s[o])*(s[o+1]+s[a+1]),a=o;return i}class Nl{static area(t){const e=t.length;let n=0;for(let i=e-1,o=0;o<e;i=o++)n+=t[i].x*t[o].y-t[o].x*t[i].y;return n*.5}static isClockWise(t){return Nl.area(t)<0}static triangulateShape(t,e){const n=[],i=[],o=[];vh(t),Mh(n,t);let a=t.length;e.forEach(vh);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,Mh(n,e[l]);const r=nx.triangulate(n,i);for(let l=0;l<r.length;l+=3)o.push(r.slice(l,l+3));return o}}function vh(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Mh(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class Ol extends Ul{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ol(t.radius,t.detail)}}class Ku extends Fe{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Mx{constructor(t,e,n=0,i=1/0){this.ray=new Ll(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new zl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return xl(t,this,n,e),n.sort(_h),n}intersectObjects(t,e=!0,n=[]){for(let i=0,o=t.length;i<o;i++)xl(t[i],this,n,e);return n.sort(_h),n}}function _h(s,t){return s.distance-t.distance}function xl(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){const i=s.children;for(let o=0,a=i.length;o<a;o++)xl(i[o],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cl);const zr=s=>Number.isInteger(s)?s.toFixed(1):String(s),Ze=`
#define WORLD ${zr(Vt)}
#define HALF_WORLD ${zr(Vt/2)}
#define HRES ${zr(bn)}
#define Y_PER_M ${qt}
#define PI 3.14159265
`,ci=`
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
`,Tn=`
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
`,Zu=`
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
`,hi=`
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

${Zu}
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
`,Ju=`
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
  // The ahupuaʻa map is in cells 35 m across, read as they are. Out at sea,
  // where each one's fishery ends against the open ocean, its tint would stop
  // in a staircase of cells, so near that limit it follows the smooth
  // contour through them instead (the cells' coverage, interpolated).
  float inside = id > 0.5 ? 1.0 : 0.0;
  if (dO < 0.8) {
    ivec2 hi = textureSize(uRegion, 0) - 1;
    vec2 f = uv * vec2(hi + 1) - 0.5;
    ivec2 c0 = ivec2(floor(f));
    vec2 fr = f - floor(f);
    vec4 t00 = texelFetch(uRegion, clamp(c0, ivec2(0), hi), 0);
    vec4 t10 = texelFetch(uRegion, clamp(c0 + ivec2(1, 0), ivec2(0), hi), 0);
    vec4 t01 = texelFetch(uRegion, clamp(c0 + ivec2(0, 1), ivec2(0), hi), 0);
    vec4 t11 = texelFetch(uRegion, clamp(c0 + ivec2(1, 1), ivec2(0), hi), 0);
    const float e = 0.5 / 255.0;
    float cov = mix(mix(step(e, t00.r), step(e, t10.r), fr.x), mix(step(e, t01.r), step(e, t11.r), fr.x), fr.y);
    // (soft over about a pixel, however near or far)
    float k = clamp(px / (WORLD / float(hi.x + 1)), 0.03, 0.5);
    inside = smoothstep(0.5 - k, 0.5 + k, cov);
    // just outside the cells, take the ahupuaʻa whose edge this is
    if (id < 0.5) {
      vec4 t = t00.r > t10.r ? t00 : t10;
      t = t.r > t01.r ? t : t01;
      t = t.r > t11.r ? t : t11;
      id = floor(t.r * 255.0 + 0.5);
      moku = floor(t.g * 255.0 + 0.5);
    }
  }
  float w = max(px * 0.35, 0.012);
  float edgeFade = smoothstep(w * 1.5, w * 1.5 + 0.35 + px, dA);
  bool hovered = id > 0.5 && abs(id - uHover) < 0.5;
  bool focused = id > 0.5 && abs(id - uFocus) < 0.5;
  // dim the other ahupuaʻa (the open sea beyond them is left alone)
  if (uFocus > 0.5 && !focused && inside > 0.0) {
    float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(col, vec3(l) * 0.7, 0.55 * uFocusK * inside);
  }
  // moku tint and zone bands
  if (inside > 0.0) {
    int m = int(moku + 0.5);
    vec3 mc = uMokuColors[m];
    float tint = uOverlay.z * 0.22 + (hovered ? 0.2 : 0.0) + (focused ? 0.12 * uFocusK : 0.0);
    col = mix(col, mc * (light * 0.6 + 0.25), tint * edgeFade * inside);
    vec3 zc = texture(uZoneTex, uv).rgb;
    col = mix(col, zc * (light * 0.55 + 0.3), uOverlay.y * 0.62 * (0.4 + 0.6 * edgeFade) * inside);
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
`,_x=`
${Ze}
${Tn}
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
`,wx=`
${Ze}
${ci}
${Tn}
${hi}
${Ju}
uniform sampler2D uNormal;
uniform sampler2D uLand;  // r rain (log), g sand, b riparian, a cultivation
uniform int uDebug;
uniform float uKau;   // the season: 0 in hoʻoilo, 1 in kau (vegetation.js season(), from the day of the year)
uniform float uLehua; // how many ʻōhiʻa are in bloom, 1 at the kau peak (as uAccent[0])
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

// The planted groves' patches (vegetation.js groveNoise: keep them in step):
// value noise, its lookup wandered by a finer noise of its own, so a patch's
// edge meanders instead of tracing the noise's lattice in boxes.
float groveNoise(vec2 p) {
  vec2 w = vec2(vnoise(p * 2.7 + vec2(5.2, 1.3)), vnoise(p * 2.7 + vec2(9.7, 6.1))) - 0.5;
  return vnoise(p + 0.8 * w);
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

// A value noise along a line (o shifts it, so that different lines read
// differently).
float vnoise1(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(hash12(vec2(i, 0.37)), hash12(vec2(i + 1.0, 0.37)), f * f * (3.0 - 2.0 * f));
}

// How squarely a face looks along x rather than along z (n: its normal), as
// faceNoise weighs its two planes.
float faceW(vec2 nxz) {
  return smoothstep(0.25, 0.75, nxz.x * nxz.x / max(dot(nxz, nxz), 1e-6));
}

// A noise on the face of a cliff itself: value noise on the two vertical
// planes along x and along z, ku cells to the unit across and v up both
// (height in metres, scaled), each weighted (w, from faceW) by how squarely
// the face looks along it. So unlike anything mapped in plan it never
// smears down a wall, and unlike anything mapped across the face it never
// swirls as the wall turns or breaks where one plane hands over to the
// next. (Where the two blend, their mean is flatter than either; its
// contrast is put back. Most faces look squarely enough along one that the
// other is never worked out: in an if, as a compiler may well work out both
// sides of a ?: whichever it picks, and here and below that's no saving.)
float faceNoise(vec2 xz, float v, float w, float ku) {
  float a = 0.5;
  float b = 0.5;
  if (w > 0.0) a = vnoise(vec2(xz.y * ku, v));
  if (w < 1.0) b = vnoise(vec2(xz.x * ku + 31.7, v + 5.3));
  return 0.5 + (mix(b, a, w) - 0.5) * (1.0 + 1.66 * w * (1.0 - w));
}

// faceNoise along a level line across the face only (o shifts it), for
// what runs along a contact.
float faceNoise1(vec2 xz, float o, float w, float ku) {
  float a = 0.5;
  float b = 0.5;
  if (w > 0.0) a = vnoise1(xz.y * ku + o);
  if (w < 1.0) b = vnoise1(xz.x * ku + 31.7 + o);
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
  float under; // how near the middle of its headwall, under the brink
};

Fall fallAt(float metres) {
  Fall f = Fall(0.0, 0.0, 9.0, 0.0, 0.0, 0.0);
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
  float wide = C.z + (D.x - C.z) * clamp(s / C.x, 0.0, 1.0);
  float across = abs(c) / wide;
  f.zone = smoothstep(-0.9, -0.6, rim) * (1.0 - smoothstep(C.x + 0.4, C.x + 0.8, s)) * (1.0 - smoothstep(1.6, 2.0, across)) * smoothstep(B.y, B.y + 15.0, metres);
  f.under = 1.0 - smoothstep(0.2, 1.0, across);
  // (its outline ragged, in tongues and bays a few tens of metres across,
  // so that no stretch of it runs straight down a wall or along a rim:
  // each wall's edge pushed in and out as it runs down, the brink's and the
  // rim's as they run across. Each moves only along its own edge, so the
  // rock and the fern never break off into islands.)
  if (f.zone > 0.0) {
    float side = c < 0.0 ? 13.0 : 0.0;
    float aw = abs(c / wide + 0.6 * (vnoise(vec2(metres * 0.036, s * 4.0 + side)) - 0.5));
    float rw = vnoise(vec2(c * 5.5, metres * 0.031 + 3.7)) - 0.5;
    float sw = 0.2 * rw;
    float mw = 18.0 * rw;
    f.edge = max(max(aw / 1.25, 0.8 - (rim + sw + 0.22) * 2.0), max((s + sw - B.w) / 0.7, (metres + mw - B.x + 30.0) / 30.0));
  }
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
  // metres per pixel. On a steep face fwidth jumps from one long thin
  // triangle to the next, and so would every width and fade it sets, in
  // faint seams along their edges; there the normal map's slope gives the
  // same measure smoothly (held within a factor of two of the drawn one,
  // which it stands in for)
  float fwM = fwidth(metres);
  if (slope > 0.2) {
    vec2 gM = n.xz / (max(n.y, 0.05) * Y_PER_M);
    fwM = mix(fwM, clamp(abs(dot(gM, dX)) + abs(dot(gM, dY)), 0.5 * fwM, 2.0 * fwM), smoothstep(0.2, 0.45, slope));
  }
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
  vec3 shrub = srgb(vec3(0.42, 0.45, 0.25)); // (the leeward pali's dry shrub)
  vec3 soil = srgb(vec3(0.52, 0.29, 0.17));
  vec3 rock = srgb(vec3(0.33, 0.29, 0.26));
  vec3 lava = srgb(vec3(0.17, 0.16, 0.155));
  vec3 sandC = srgb(vec3(0.90, 0.84, 0.70));

  float r = rain + (nBig - 0.5) * 0.12;
  // (the steep ground below covers this entirely on the pali, and nothing
  // mapped in plan is worth working out there; nor deep in a hero's
  // amphitheatre, all new-cut rock however the normal map eases off, where
  // the forest mapped in plan would stand in lenses down its walls)
  Fall fall = fallAt(metres);
  float steep = max(smoothstep(0.32, 0.62, slope), fall.zone * (1.0 - smoothstep(0.55, 0.8, fall.edge)));
  vec3 col = vec3(0.0);
  float nMid = 0.5;
  if (steep < 1.0) {
    // The canopy beyond the streamed trees (vegetation.js), zone by zone as
    // they're planted there: each albedo the linear mix of the trees that
    // grow in it (sRGB 0..1, as authored; srgb() linearises). Most of the
    // change from wet to dry is in hue, from the olive of the ʻōhiʻa to the
    // yellow-green of the dry scrub, with kukui the one pale tree.
    vec3 scrubC = srgb(mix(vec3(0.41, 0.48, 0.28), vec3(0.44, 0.47, 0.29), uKau)); // ʻaʻaliʻi, lama, dry ʻōhiʻa, wiliwili (bare in kau)
    vec3 mesic = srgb(vec3(0.37, 0.41, 0.25)); // ʻōhiʻa (partly hairy), koa, lama
    vec3 wet = srgb(vec3(0.33, 0.37, 0.21)); // ʻōhiʻa olive over a little hāpuʻu and ʻōlapa
    vec3 cloudF = srgb(vec3(0.33, 0.38, 0.22)); // stunted ʻōhiʻa, ʻōlapa, moss
    vec3 kukuiC = srgb(vec3(0.44, 0.47, 0.33)); // kukui's pale silvery grey-green (as its far crowns, shaded below and floury on top)
    vec3 floorC = srgb(vec3(0.33, 0.43, 0.20)); // ʻōhiʻa ʻai (near-black green) and hau (bright)
    vec3 uluheC = srgb(vec3(0.49, 0.62, 0.31)); // uluhe: matte yellow-green fern
    vec3 bogC = srgb(vec3(0.43, 0.44, 0.27)); // summit bog: sedge, moss, knee-high ʻōhiʻa
    nMid = fbm2(xz * 2.1 + 5.0);
    vec3 ground = mix(grassDry, grassGreen, smoothstep(0.18, 0.42, r + nMid * 0.08));
    // (the leeward pili, straw in kau, greens toward a pale blue-green in the
    // hoʻoilo rains: leeward meaning drier than the island's middle for its
    // height, so the windward coast, nearly as dry, keeps its own green)
    float lee = 1.0 - smoothstep(-0.04, 0.04, r - 0.22 - 0.00043 * metres);
    ground = mix(ground, srgb(vec3(0.54, 0.62, 0.50)), 0.3 * (1.0 - uKau) * lee);
    float forest = smoothstep(0.30, 0.52, r + (nMid - 0.5) * 0.2);
    // c. 1700 the lowland below about 460 m was farmed and burned, and native
    // forest stood untouched only above about 760 m. On the moist side the
    // interfluves lie open in fallow grass and fern, the trees in the gulches
    // and on the steep lower slopes; on the dry side trees keep to the gulches.
    float cult = 1.0 - smoothstep(420.0, 760.0, metres + (nBig - 0.5) * 120.0);
    float gul = smoothstep(0.08, 0.3, rip);
    float moistLow = cult * smoothstep(0.30, 0.40, r);
    // (eased over a wide band of slope: a narrow one cuts the open fallow from
    // the wooded slopes along the slope's own contours, in hard-edged patches)
    forest *= mix(1.0, 0.35 + 0.65 * max(gul, smoothstep(0.17, 0.34, slope)), moistLow);
    forest = max(forest, gul * 0.45 * (1.0 - smoothstep(0.30, 0.40, r)));
    vec3 canopyC = mix(scrubC, mesic, smoothstep(0.36, 0.46, r));
    canopyC = mix(canopyC, wet, smoothstep(0.54, 0.64, r));
    canopyC = mix(canopyC, cloudF, smoothstep(1150.0, 1450.0, metres));
    // (none of the planted or open-ground tints in or round a hero's
    // amphitheatre, see below, nor round its pool and a way down the gorge
    // below, which its spray keeps wild: pale groves there would muddy the
    // foot of the fall)
    float foot = 0.0;
    if (abs(vFall.z - floor(vFall.z + 0.5)) < 1e-3) foot = 1.0 - smoothstep(1.2, 2.2, length(vec2((vFall.x - vFallB.w) * 0.7, vFall.y)));
    float wild = 1.0 - max(fall.zone, foot);
    // groves and gaps, a few tens of metres across: nMid's patches, eased to
    // their mean once a pixel spans one, where they'd only sparkle
    float grove = mix(smoothstep(0.35, 0.65, nMid), 0.5, smoothstep(0.1, 0.3, px));
    // Within about 13 units of the camera the trees themselves stand on this
    // ground (vegetation.js, whose simple crowns dither out over 10 to 13.5),
    // and what's mapped here is what shows between them: there the crowns'
    // own marks (kukui's pallor, the lehua and liko specks) would only lie
    // on the ground like dead grass and spilt paint, so they come in as the
    // trees go
    float treesGo = smoothstep(9.5, 13.0, distance(cameraPosition, vWorld));
    // The planted groves come in patches a couple of hundred metres across,
    // the same ones the trees are planted by (vegetation.js kukuiPatch and
    // aiGrove: keep them in step): kukui's big pale groves, and ʻōhiʻa ʻai's
    // nearly pure dark ones in the moist valleys below about 550 m
    // (worked out only where either can grow: low and moist enough)
    // (their edges eased a little more here than the planting's, about the
    // same middle contour, so the trees thin out across the tint's edge)
    float kp = 0.0;
    float ai = 0.0;
    float offCrest = 1.0;
    if (metres < 690.0 && r > 0.32) {
      kp = smoothstep(0.36, 0.64, groveNoise(xz * 0.5 + vec2(13.1, 7.7)));
      // (its dry edge as soft as the trees', whose rain is jittered tree by tree)
      ai = smoothstep(0.57, 0.71, groveNoise(xz * 0.55 + vec2(41.3, 3.9)))
         * smoothstep(0.38, 0.50, r) * (1.0 - smoothstep(520.0, 560.0, metres)) * cult * wild;
      // Neither grove stands on the farmed lowland's gentler crests, where
      // its trees are ʻōhiʻa, koa and hala (vegetation.js: a ridge stands
      // 20–60 m over a ring ~250 m round it, with no water gathering on it;
      // the steep flanks below, walls to the trees, keep theirs)
      if (ai > 0.01 || (kp > 0.01 && slope > 0.24 && slope < 0.36)) {
        float ring = 0.25 * (metresAt(xz + vec2(2.46, 0.0)) + metresAt(xz - vec2(2.46, 0.0)) + metresAt(xz + vec2(0.0, 2.46)) + metresAt(xz - vec2(0.0, 2.46)));
        offCrest = 1.0 - smoothstep(20.0, 60.0, metres - ring) * (1.0 - smoothstep(0.05, 0.2, rip)) * (1.0 - smoothstep(0.28, 0.36, slope));
        ai *= offCrest;
      }
    }
    // kukui: pale streaks down the gulches and, in the farmed band, groves on
    // the steep lower walls (steep as the trees take it, from about 0.32: on
    // the gentler fallow they stand scattered, and their pallor painted there
    // lies on the open slope in patches); gone above about 680 m and where the
    // rain passes about 4,000 mm
    float kuk = max(gul * (1.0 - smoothstep(0.55, 0.85, rip)) * (0.45 + 0.55 * kp), smoothstep(0.24, 0.40, slope) * kp * cult * offCrest)
              * (1.0 - smoothstep(450.0, 680.0, metres)) * smoothstep(0.32, 0.40, r) * (1.0 - smoothstep(0.66, 0.74, r)) * wild * (1.0 - 0.9 * ai);
    canopyC = mix(canopyC, kukuiC * (0.9 + 0.2 * nMid), kuk * mix(0.3, 0.8, treesGo));
    // (dark ground under the dark groves reads as their shade, so this one
    // holds inside the ring too)
    canopyC = mix(canopyC, srgb(vec3(0.24, 0.32, 0.155)), ai * 0.7);
    // valley floors: ʻōhiʻa ʻai groves and hau along the stream (the loʻi
    // themselves are clearings) — the broad floors, and the flat drained
    // hollows of the moist lowland, where the loʻi valleys' floors carry
    // little blurred drainage (as vegetation.js reads its floors)
    float flo = max(smoothstep(0.55, 0.85, rip) * (1.0 - smoothstep(0.10, 0.22, slope)),
                    (1.0 - smoothstep(0.03, 0.08, slope)) * smoothstep(0.15, 0.3, rip) * moistLow)
              * (1.0 - smoothstep(450.0, 560.0, metres)) * smoothstep(0.34, 0.40, r) * wild;
    canopyC = mix(canopyC, floorC, flo * 0.7);
    // and round a hero's amphitheatre the fern holds the ground (fallAt),
    // the same velvet as on its walls, so the rock stands framed in it
    canopyC = mix(canopyC, mix(srgb(vec3(0.20, 0.34, 0.14)), srgb(vec3(0.29, 0.41, 0.18)), nMid), fall.zone);
    forest = max(forest, 1.0 - wild);

    // tree crowns: each cell a sunlit dome, faded to an average when they'd
    // alias (and only that average worked out once they have), and inside
    // the streamed trees' ring, where it would only lie on the ground between
    // their trunks as a lattice of cobbles
    vec3 canopyFlat = canopyC * 0.84;
    float crownFade = (1.0 - smoothstep(0.02, 0.07, px)) * smoothstep(8.5, 12.0, distance(cameraPosition, vWorld));
    if (crownFade > 0.0) {
      vec2 vc = crowns(xz * 6.0);
      float dome = sqrt(max(0.0, 1.0 - vc.x * vc.x * 1.6));
      // fake per-crown normal: bulge away from the cell centre
      vec2 toC = (xz * 6.0 - (floor(xz * 6.0) + 0.5));
      float lightSide = dot(normalize(vec3(-toC.x, 0.6, -toC.y)), uSunDir) * 0.5 + 0.5;
      float crown = mix(0.84, (0.62 + 0.45 * dome) * (0.78 + 0.4 * lightSide), crownFade);
      // neighbouring ʻōhiʻa run from glossy green to hairy grey: olive to
      // grey, not green to yellow
      vec3 tint = mix(vec3(0.92, 0.96, 0.90), vec3(1.10, 1.06, 1.00), vc.y);
      canopyC *= mix(vec3(1.0), tint, crownFade * 0.7) * crown;
      // ʻōhiʻa country only: lehua a sparse red speck on a few crowns, more
      // of them in kau, and the red flush of new leaves (liko) on others —
      // whole crowns (keyed to the crown's own id), on the top of the dome,
      // and only while a crown is several pixels across, beyond which they
      // would add up to a rash
      float ohiaShare = smoothstep(0.38, 0.5, r) * smoothstep(380.0, 700.0, metres) * (1.0 - kuk) * (1.0 - flo) * (1.0 - ai)
                      * crownFade * treesGo * (1.0 - smoothstep(0.006, 0.018, px));
      float lehua = step(1.0 - 0.035 * uLehua, fract(vc.y * 13.7)) * ohiaShare;
      canopyC = mix(canopyC, srgb(vec3(0.72, 0.20, 0.16)), lehua * 0.75 * smoothstep(0.78, 0.92, dome));
      float liko = step(0.96, fract(vc.y * 7.31 + 0.5)) * ohiaShare;
      canopyC = mix(canopyC, srgb(vec3(0.62, 0.23, 0.17)), liko * 0.12 * smoothstep(0.5, 0.9, dome));
    } else canopyC *= 0.84;
    // grass: no cells, just tussocky variation at a few scales (fbm2's
    // first three octaves and the fourth's mean: the fourth, under a metre
    // across and a few per cent, is the next term's job)
    vec2 gp = xz * 18.0;
    float gF = vnoise(gp) * 0.5;
    gp = gp * 2.03 + 17.1;
    gF += vnoise(gp) * 0.25;
    gp = gp * 2.03 + 17.1;
    gF += vnoise(gp) * 0.125 + 0.03125;
    float gN = gF * 0.6;
    if (px < 0.02) gN += vnoise(xz * 90.0) * 0.4 * (1.0 - smoothstep(0.004, 0.02, px));
    ground *= 0.82 + 0.36 * gN;
    col = mix(ground, canopyC, forest);
    // Under the streamed trees, within ~13 units, what shows between the
    // trunks of the forest above the farmed lowland is its floor, in their
    // shade (the trees cast none on the ground): dark moss, fern and litter
    // in the wet and cloud forest, a shaded version of the canopy in the
    // mesic. It hands back to the sunlit canopy as the trees dither out.
    // (over a wider band than the crowns' own hand-over, and no darker than
    // the trees standing on it can make up for, so no ring shows where the
    // canopy takes over)
    // (the wet floor a moss green that stays green in the warm low sun, not
    // khaki; the mesic one the canopy's mean, without its crown cells)
    float under = (1.0 - smoothstep(8.0, 13.0, distance(cameraPosition, vWorld))) * smoothstep(340.0, 520.0, metres) * smoothstep(0.36, 0.46, r) * wild;
    if (under > 0.0) {
      vec3 floorShade = mix(canopyFlat * 0.68, srgb(vec3(0.19, 0.27, 0.12)) * (0.75 + 0.3 * nMid + 0.3 * gN), smoothstep(0.52, 0.62, r));
      col = mix(col, floorShade, under);
    }
    // uluhe: matte yellow-green fern where the wet forest opens up on the
    // steeper slopes under the pali (whose fern velvet carries on above),
    // lowland to low montane; never down in the gulches, nor under the kukui
    float ulu = smoothstep(0.55, 0.65, r) * smoothstep(0.18, 0.34, slope) * smoothstep(120.0, 300.0, metres)
              * (1.0 - smoothstep(1000.0, 1300.0, metres)) * grove * (1.0 - gul) * (1.0 - kuk) * wild;
    col = mix(col, uluheC * (0.85 + 0.3 * gN), ulu * 0.6);
    // summit bogs: the flat, sodden ground near the top
    float bog = smoothstep(1320.0, 1420.0, metres) * (1.0 - smoothstep(0.03, 0.08, slope)) * smoothstep(0.80, 0.88, r);
    col = mix(col, bogC * (0.85 + 0.3 * nMid), bog * 0.85);

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
  float spray = fall.spray;
  float wetF = spray; // how wet the rock's skin runs, for its sheen
  vec3 nb = n; // the normal, with the flutes pressed in
  if (steep > 0.0) {
    float wetSide = smoothstep(0.25, 0.5, r);
    // the walls of a hero's amphitheatre stand near vertical; the ordinary
    // pali, steep as they are, hold a skin of soil
    float sheer = 1.0 - smoothstep(0.12, 0.3, n.y);
    float fw = faceW(n.xz);
    // the flows, level across a face and dipping gently over hundreds of
    // metres
    float hm = metres + (nBig - 0.5) * 40.0;
    // the grain: clumps of fern, patches of moss, the rock's own blotches;
    // drawn while a clump is several pixels across, and its mean beyond
    float kG = smoothstep(2.5, 5.0, min(0.14 / max(px, 1e-5), 14.0 / max(fwM, 1e-4)));
    float grain = 0.5;
    if (kG > 0.0) grain = mix(0.5, faceNoise(xz, hm * 0.07, fw, 7.0), kG);
    // how much rock shows. Windward, a sheer wall is rock with moss and
    // ferns on its ledges; the ordinary pali hold a velvet of fern,
    // thinning out as the wall steepens. Leeward the rock shows on much
    // gentler slopes, the ledges holding what soil there is. (Where none of
    // it can show, which is most of the windward pali, none of what the rock
    // is made of is worked out: it would all be weighed at nothing.)
    float rockW = smoothstep(0.25, 0.8, sheer + (grain - 0.5) * 0.5);
    bool rocky = rockW > 0.0 || wetSide < 1.0 || fall.zone > 0.0 || fall.sheet > 0.0;
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
    // along the face over tens of metres, each contact in its own stretches,
    // so a ledge tapers out to nothing rather than ending in a cut, and the
    // ledges of one wall never line up. Drawn while a pixel holds less than
    // a few metres of them, and their mean further off, where none of it is
    // worked out.
    float soak = spray * (1.0 - fall.sheet);
    float kS = smoothstep(1.5, 4.0, 4.0 / max(fwM, 1e-4));
    float tone = 0.5; // the flow's own shade
    float notch = 0.1;
    float ledge = 0.08 + 0.1 * soak;
    float reach = 0.5; // how far round an amphitheatre's rim the fern follows this contact in
    if (kS > 0.0 && rocky) {
      // (each contact wanders up and down along the face by a few metres,
      // so the flows thicken, thin and pinch out rather than running level
      // and even like planks)
      vec4 fq = flowsAt(hm + (faceNoise(xz, hm * 0.04, fw, 3.0) - 0.5) * 9.0);
      // (how far from the nearest contact between two flows, in metres: up
      // into the recess above it, or down over the lip of the flow below.
      // One at the top of a cell is numbered as the next cell's first, so
      // both sides of it agree.)
      float bk = floor(fq.x + 0.5);
      float dm = (fq.x - bk) * fq.y;
      float ci = fq.z * 8.0 + (bk < fq.w ? bk : 8.0);
      vec2 cut = hash22(vec2(ci, 1.7));
      float deep = smoothstep(0.1, 0.5, cut.x);
      float pxM = 1.5 * fwM + 0.01; // a pixel and a half
      float run = faceNoise1(xz, ci * 7.31, fw, 2.2);
      float moss = deep * smoothstep(0.35, 0.75, 0.7 * run + 0.3 * grain + 0.4 * (cut.y - 0.5) + 0.35 * soak - 0.1 * (1.0 - wetSide));
      float rw = moss * (2.2 + 2.5 * soak);
      float l = clamp((rw - (dm > 0.0 ? dm : -2.5 * dm)) / max(0.5 * rw, pxM), 0.0, 1.0);
      float o = deep * (0.6 + 0.8 * grain) * smoothstep(-pxM, 0.0, dm) * (1.0 - smoothstep(0.2, 1.4 + grain + pxM, dm));
      // the flows' own shades either side of the contact, eased across it
      // over a metre (or a pixel and a half) so it never steps from one
      // pixel to the next. (The flow above a contact shares its number;
      // below the first contact of a cell lies the top flow of the cell
      // beneath.)
      float ew = max(0.75 * fwM, 0.5);
      float up = smoothstep(-ew, ew, dm);
      float t = up > 0.0 ? hash12(vec2(ci, 4.3)) : 0.0;
      if (up < 1.0) {
        float below = fq.z * 8.0 + bk - 1.0;
        if (bk < 0.5) {
          float hp = hash22(vec2(fq.z - 1.0, 2.9)).x;
          below = fq.z * 8.0 - 9.0 + floor(1.0 + hp * hp * 5.0);
        }
        t = mix(hash12(vec2(below, 4.3)), t, up);
      }
      tone = mix(tone, t, kS);
      notch = mix(notch, o, kS);
      ledge = mix(ledge, l, kS);
      reach = mix(reach, hash12(vec2(ci, 6.1)), kS);
    }
    float bareW = rockW * (1.0 - min(ledge * 1.3 + smoothstep(0.72, 0.9, grain) * 0.3, 1.0));
    // A hero's amphitheatre is new-cut rock, bare round the fall and all
    // down its face and walls, whatever the slope there. Toward the rim of
    // its walls, the brink and the mouth of the cut the fern takes it back,
    // in a ragged edge (fallAt): out along a ledge here and there, down the
    // grooves, onto anything less steep, in clumps and tongues with the
    // grain, the rock going over to moss on the way. None of that reaches
    // deep into the rock or out into the fern, so no islands of either stand
    // apart.
    float Pz = 0.0;
    if (fall.zone > 0.0) {
      float e = fall.edge;
      // (all of it held to a band round the edge, so it frays the edge but
      // never sets fern down in the middle of the rock; what's mapped in
      // plan, which runs straight down a wall, least of all)
      float P = e + (0.7 * (grain - 0.5) + 0.3 * ledge * smoothstep(0.6, 0.85, e) * (0.3 + 1.4 * reach) + 0.12 * (FLUTE_MEAN.x - g) + 0.1 * smoothstep(0.15, 0.45, n.y) + 0.2 * (nBig - 0.5)) * smoothstep(0.55, 0.78, e) * (1.0 - smoothstep(0.85, 1.05, e));
      // (deep in it the rock stays bare however the ground eases off; only
      // toward the rim does a gentler slope hold fern)
      float rz = (1.0 - smoothstep(0.66, 0.9, P)) * mix(1.0, smoothstep(0.38, 0.6, slope), smoothstep(0.6, 0.85, e));
      rockW = mix(rockW, rz, fall.zone);
      bareW = mix(bareW, rz * (1.0 - min(ledge * 1.3, 1.0)), fall.zone);
      Pz = P;
    }
    // (leeward the grass takes the ledges, tapering as they do; and behind
    // a fall's sheet the water keeps the rock bare)
    float exposedDry = smoothstep(0.3, 0.7, 1.0 - smoothstep(0.3, 0.62, n.y)) * (1.0 - 0.7 * ledge);
    float bareWet = smoothstep(0.3, 0.6, fall.sheet + (grain - 0.5) * 0.5);
    float exposed = max(mix(exposedDry, bareW, wetSide), bareWet);
    // a finer grain on the rock, four metres or so across, so that no
    // stretch of it is ever one flat colour close up
    float kF = exposed > 0.0 ? smoothstep(2.5, 5.0, min(0.04 / max(px, 1e-5), 4.0 / max(fwM, 1e-4))) : 0.0;
    float fine = 0.5;
    if (kF > 0.0) fine = mix(0.5, faceNoise(xz, hm * 0.25, fw, 25.0), kF);
    // (round a hero's rim, the rock going over to moss before the fern)
    float mossy = fall.zone > 0.0 ? fall.zone * smoothstep(0.52, 0.8, Pz + 0.15 * (fine - 0.5)) : 0.0;
    // press the ribs into the normal: a couple of metres deep in the fern,
    // and hardly at all on the ordinary pali's rock, where they're the
    // streaks the water stains; a little more on a headwall the water cut
    vec2 bxz = F.y * ax * 0.0175 * (1.0 - 0.85 * rockW * (1.0 - 0.4 * fall.zone));
    vec3 bump = vec3(bxz.x, 0.0, bxz.y);
    nb = normalize(n - (bump - n * dot(n, bump)) * steep);
    // basalt, flow by flow: dark grey windward, one flow a shade or two
    // from the next; leeward the weathered flows run grey-brown to red-brown,
    // the clinker redder
    vec3 basalt = mix(srgb(vec3(0.24, 0.244, 0.234)), srgb(vec3(0.292, 0.288, 0.274)), smoothstep(0.15, 0.85, tone));
    vec3 basaltDry = mix(rock, srgb(vec3(0.49, 0.315, 0.22)), 0.25 + 0.35 * smoothstep(0.1, 0.9, tone));
    basaltDry = mix(basaltDry, srgb(vec3(0.48, 0.25, 0.16)), notch * 0.4);
    basalt = mix(basaltDry, basalt, wetSide) * (0.86 + 0.16 * grain + 0.14 * fine) * (1.0 - 0.35 * notch);
    if (fall.zone > 0.0) {
      // A hero's headwall runs wet all over, darker and cooler than any
      // dry rock, darker still in its spray and darkest behind its sheet;
      // streaked down from the brink with water stains, dark and faintly
      // green, densest under it and thinning out sideways (drawn while a
      // streak is several pixels across, and their mean beyond)
      float soakW = fall.zone * (0.15 + 0.2 * vFallC.w);
      basalt *= (1.0 - max(soakW, 0.45 * spray) - 0.15 * fall.sheet) * mix(vec3(1.0), vec3(0.87, 0.95, 1.07), fall.zone);
      float kT = smoothstep(2.5, 5.0, min(0.05 / max(px, 1e-5), 50.0 / max(fwM, 1e-4)));
      float streak = 0.3;
      if (kT > 0.0 && exposed > 0.0) streak = mix(0.3, smoothstep(0.42, 0.72, faceNoise(xz, hm * 0.016, fw, 15.0)), kT);
      basalt = mix(basalt, basalt * vec3(0.62, 0.68, 0.6), streak * fall.zone * (0.15 + 0.85 * fall.under));
      // and round its rim the rock going over to moss before the fern
      basalt = mix(basalt, srgb(vec3(0.22, 0.36, 0.14)) * (0.8 + 0.4 * fine), mossy * 0.75);
      // (and its film of water gives back as sheen much of the skylight its
      // darker rock loses, so in shade it reads wet rather than black)
      wetF = max(spray, 2.2 * soakW * exposed);
    }
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
  if (wetF > 0.0) {
    // and glistening: a rough wet sheen of sky (a film of water on rock
    // reflects some of it from any angle, more toward grazing), and in the
    // spray the sun's glint, strongest on the rock the sheet runs over
    vec3 V = normalize(cameraPosition - vWorld);
    float e = 1.0 - max(dot(nb, V), 0.0);
    float F = 0.06 + 0.94 * e * e * e * e * e;
    float glint = max(dot(reflect(-V, nb), uSunDir), 0.0);
    glint *= glint;
    glint *= glint;
    glint *= glint;
    glint *= glint;
    // (the film on a headwall out of the spray thinner, so it brightens
    // less toward grazing)
    lit += (1.0 + fall.sheet) * (wetF * uSkyColor * min(F, 0.15 + 0.15 * spray / wetF) * 0.4 * ao + spray * uSunColor * vis * glint * glint * 0.08);
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
`,wh=32,gs=7,yh=1600;class yx{constructor(t,e){this.heights=t.height,this.N=bn,this.leafSize=Vt/2**(gs-1),this.range0=22,this.buildMinMax();const n=new yi(t.height,bn,bn,zs,In);n.minFilter=Se,n.magFilter=Se,n.needsUpdate=!0,this.heightTex=n;const i=new yi(t.normals,bn,bn,Ke,xn);i.minFilter=Wi,i.magFilter=ve,i.generateMipmaps=!0,i.anisotropy=8,i.needsUpdate=!0,this.normalTex=i,this.full=this.makeGrid(wh),this.half=this.makeGrid(wh/2),this.morph=[];for(let a=0;a<8;a++)this.morph.push(new Ot);const o={...e.uniforms,uHeight:{value:n},uNormal:{value:i},uMorph:{value:this.morph},uCamPos:{value:new q},uDebug:{value:0},uFallA:{value:[0,1,2,3].map(()=>new _e)},uFallB:{value:[0,1,2,3].map(()=>new _e)},uFallC:{value:[0,1,2,3].map(()=>new _e)},uFallD:{value:[0,1,2,3].map(()=>new _e)},uFalls:{value:0}};this.uniforms=o,this.group=new En;for(const a of[this.full,this.half])a.material=new Ce({vertexShader:_x,fragmentShader:wx,uniforms:{...o,uGrid:{value:a.dim}}}),a.mesh=new ue(a.geometry,a.material),a.mesh.frustumCulled=!1,a.mesh.matrixAutoUpdate=!1,this.group.add(a.mesh);this._frustum=new Ws,this._m=new ie,this._box=new li,this.setRange(this.range0)}makeGrid(t){const e=new Ku,n=new Float32Array((t+1)*(t+1)*3);for(let r=0;r<=t;r++)for(let l=0;l<=t;l++){const c=(r*(t+1)+l)*3;n[c]=l/t,n[c+2]=r/t}const i=[];for(let r=0;r<t;r++)for(let l=0;l<t;l++){const c=r*(t+1)+l,h=c+1,u=c+t+1,f=u+1;l+r&1?i.push(c,u,h,h,u,f):i.push(c,u,f,c,f,h)}e.setIndex(i),e.setAttribute("position",new he(n,3));const o=new Float32Array(yh*4),a=new si(o,4);return a.setUsage(vi),e.setAttribute("aNode",a),e.instanceCount=0,{dim:t,geometry:e,data:o,attr:a,count:0}}buildMinMax(){const t=this.N,e=2**(gs-1),n=t/e;this.mm=[];let i=new Float32Array(e*e),o=new Float32Array(e*e);for(let r=0;r<e;r++)for(let l=0;l<e;l++){let c=1/0,h=-1/0;for(let u=r*n;u<=Math.min(t-1,(r+1)*n);u++)for(let f=l*n;f<=Math.min(t-1,(l+1)*n);f++){const d=this.heights[u*t+f];d<c&&(c=d),d>h&&(h=d)}i[r*e+l]=c,o[r*e+l]=h}this.mm.push({lo:i,hi:o,n:e});let a=e;for(;a>1;){const r=a/2,l=new Float32Array(r*r),c=new Float32Array(r*r);for(let h=0;h<r;h++)for(let u=0;u<r;u++){const f=2*h*a+2*u;l[h*r+u]=Math.min(i[f],i[f+1],i[f+a],i[f+a+1]),c[h*r+u]=Math.max(o[f],o[f+1],o[f+a],o[f+a+1])}i=l,o=c,a=r,this.mm.push({lo:i,hi:o,n:a})}}setRange(t){this.rangeGoal===void 0&&this.applyRange(t),this.rangeGoal=t}applyRange(t){this.range0=t,this.ranges=[];for(let e=0;e<gs;e++)this.ranges.push(t*2**e);this.ranges[gs-1]=1e6;for(let e=0;e<gs;e++){const n=this.ranges[e],i=e>0?this.ranges[e-1]:0,o=i+(n-i)*.5;this.morph[e].set(o,n*.97)}}heightAt(t,e){return this.metresAt(t,e)*qt}metresAt(t,e){const n=this.N;let i=(t+ht)/Vt*n-.5,o=(e+ht)/Vt*n-.5;i<0&&(i=0),o<0&&(o=0),i>n-1.001&&(i=n-1.001),o>n-1.001&&(o=n-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=this.heights,u=r*n+a,f=h[u]+(h[u+1]-h[u])*l,d=h[u+n]+(h[u+n+1]-h[u+n])*l;return f+(d-f)*c}normalAt(t,e,n=new q){const i=Vt/this.N,o=this.heightAt(t+i,e)-this.heightAt(t-i,e),a=this.heightAt(t,e+i)-this.heightAt(t,e-i);return n.set(-o,2*i,-a).normalize()}update(t){Math.abs(this.rangeGoal-this.range0)>.01&&this.applyRange(this.range0+(this.rangeGoal-this.range0)*.04),this._m.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(this._m),this.cam=t.position,this.uniforms.uCamPos.value.copy(t.position),this.full.count=0,this.half.count=0,this.select(0,0,gs-1);for(const e of[this.full,this.half])e.geometry.instanceCount=e.count,e.attr.needsUpdate=!0}nodeBox(t,e,n){const i=this.mm[n],o=this.leafSize*2**n,a=-ht+t*o,r=-ht+e*o,l=i.lo[e*i.n+t]*qt,c=i.hi[e*i.n+t]*qt;return this._box.min.set(a,l,r),this._box.max.set(a+o,c,r+o),this._box}select(t,e,n){const i=this.nodeBox(t,e,n),o=this.mm[n];if(o.hi[e*o.n+t]<-45)return!0;if(i.distanceToPoint(this.cam)>this.ranges[n])return!1;if(!this._frustum.intersectsBox(i))return!0;const a=this.leafSize*2**n;if(n===0)return this.emit(this.full,t,e,a,0),!0;if(this.nodeBox(t,e,n).distanceToPoint(this.cam)>this.ranges[n-1])return this.emit(this.full,t,e,a,n),!0;for(let r=0;r<4;r++){const l=t*2+(r&1),c=e*2+(r>>1);if(!this.select(l,c,n-1)){const h=this.mm[n-1];if(h.hi[c*h.n+l]<-45)continue;const u=this.nodeBox(l,c,n-1);if(!this._frustum.intersectsBox(u))continue;this.emit(this.half,l,c,a/2,n)}}return!0}emit(t,e,n,i,o){if(t.count>=yh)return;const a=t.count*4;t.data[a]=-ht+e*i,t.data[a+1]=-ht+n*i,t.data[a+2]=i,t.data[a+3]=o,t.count++}}const ii={cycle:140,speed:.05},vl=s=>s.toFixed(4),bx=`
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
  return uSwellT - dot(xz, sd) / ${vl(ii.speed)};
}
// (seconds since the latest set wave arrived, its height, seconds until the next)
vec3 swellAt(float t) {
  const float L = ${vl(ii.cycle)};
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
`,Sx=`
${Ze}
out vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,Ex=`
${Ze}
${ci}
${Tn}
${hi}
${Ju}
${bx}
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
    g -= sd * (swellRidge(sw.x) * sw.y + swellRidge(-sw.z)) * shoal * (0.014 / ${vl(ii.speed)});
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
`,bh=(s,t)=>s-t*Math.floor(s/t),Ya=(s,t,e,n)=>{const i=bh(s,101);return bh(i*i*t+i*e+n,101)/101},Sh=s=>3+Math.floor(Ya(s,37,11,5)*4),Eh=s=>12+4*Ya(s,23,61,17),Dr=s=>12*Ya(s,53,7,29),Ah=(s,t)=>.5+.5*Ya(s*7+t*13,41,3,71);function la(s,t){const e=ii.cycle,n=Math.floor(s/e),i=s-n*e,o=Sh(n),a=Eh(n),r=Dr(n);let l=Math.floor((i-r)/a);if(l>=0)l=Math.min(l,o-1),t.age=i-r-l*a,t.height=Ah(n,l),t.next=l+1<o?r+(l+1)*a-i:e+Dr(n+1)-i,t.id=n*8+l;else{const c=Sh(n-1);t.age=i+e-Dr(n-1)-(c-1)*Eh(n-1),t.height=Ah(n-1,c-1),t.next=r-i,t.id=(n-1)*8+c-1}return t}function Ax(s,t,e,n){const i=[0,0,0];for(let r=0;r<=n;r++){const l=s*Math.pow(t/s,r/n);for(let c=0;c<e;c++){const h=c/e*Math.PI*2;i.push(Math.cos(h)*l,0,Math.sin(h)*l)}}const o=[];for(let r=0;r<e;r++)o.push(0,1+(r+1)%e,1+r);for(let r=0;r<n;r++)for(let l=0;l<e;l++){const c=1+r*e+l,h=1+r*e+(l+1)%e,u=c+e,f=h+e;o.push(c,h,u,h,f,u)}const a=new Fe;return a.setAttribute("position",new pe(i,3)),a.setIndex(o),a}class Tx{constructor(t,e,n){this.uniforms={...t.uniforms,uHeight:{value:e},uSea:{value:n},uCamPos:{value:new q},uWind:{value:new Ot(-.8,.45)},uSwellDir:{value:new Ot(-.6,.8)},uSwell:{value:.6},uSwellT:{value:0},uDebug:{value:0},uHorizonColor:{value:new It},uZenithColor:{value:new It}};const i=Ax(1.5,8e3,96,72);this.material=new Ce({vertexShader:Sx,fragmentShader:Ex,uniforms:this.uniforms,transparent:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}),this.mesh=new ue(i,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,this.swellT=0;const o=this.uniforms.uSwellDir.value,a=Math.hypot(o.x+1e-4,o.y+1e-4);this.swellDir=[(o.x+1e-4)/a,(o.y+1e-4)/a]}swellTimeAt(t,e){return this.swellT-(t*this.swellDir[0]+e*this.swellDir[1])/ii.speed}update(t,e=0){this.swellT+=e,this.uniforms.uSwellT.value=this.swellT,this.uniforms.uCamPos.value.copy(t.position),this.mesh.position.set(t.position.x,0,t.position.z)}}const Cx=[[3.791,24.11,2.87],[3.819,24.05,3.62],[3.747,24.11,3.7],[3.763,24.37,3.87],[3.772,23.95,4.18],[3.753,24.47,4.3],[3.819,24.14,5.05],[5.919,7.41,.5],[5.242,-8.2,.13],[5.419,6.35,1.64],[5.604,-1.2,1.69],[5.679,-1.94,1.74],[5.533,-.3,2.23],[5.796,-9.67,2.07],[6.752,-16.72,-1.46],[7.655,5.22,.34],[5.278,46,.08],[4.599,16.51,.86],[7.755,28.03,1.14],[7.577,31.89,1.58],[5.438,28.61,1.65],[6.628,16.4,1.93],[6.378,-17.96,1.98],[6.977,-28.97,1.5],[7.14,-26.39,1.83],[6.399,-52.7,-.74],[1.629,-57.24,.46],[14.66,-60.83,-.27],[14.064,-60.37,.61],[12.443,-63.1,.77],[12.795,-59.69,1.25],[12.519,-57.11,1.63],[12.252,-58.75,2.8],[9.22,-69.72,1.67],[8.375,-59.51,1.86],[9.133,-43.43,2.21],[8.06,-40,2.25],[14.111,-36.37,2.06],[20.427,-56.74,1.94],[22.137,-46.96,1.74],[16.49,-26.43,.96],[17.56,-37.1,1.62],[17.622,-43,1.86],[16.006,-22.62,2.29],[16.836,-34.29,2.29],[17.512,-37.3,2.7],[17.708,-39.03,2.39],[16.864,-38.05,3],[17.2,-43.24,3.33],[17.793,-40.13,3],[16.09,-19.81,2.62],[15.981,-26.11,2.89],[16.598,-28.22,2.82],[16.353,-25.59,2.88],[18.403,-34.38,1.85],[18.921,-26.3,2.05],[14.261,19.18,-.05],[13.42,-11.16,.97],[18.616,38.78,.03],[19.846,8.87,.76],[20.69,45.28,1.25],[22.961,-29.62,1.16],[10.14,11.97,1.35],[11.818,14.57,2.13],[10.333,19.84,2],[9.46,-8.66,1.98],[17.582,12.56,2.08],[15.578,26.71,2.23],[17.943,51.49,2.23],[20.37,40.26,2.23],[21.736,9.88,2.38],[21.31,62.59,2.45],[2.53,89.26,1.98],[14.845,74.16,2.08],[11.062,61.75,1.79],[11.031,56.38,2.37],[11.897,53.69,2.44],[12.257,57.03,3.31],[12.9,55.96,1.77],[13.399,54.93,2.27],[13.792,49.31,1.86],[.675,56.54,2.24],[.153,59.15,2.28],[.945,60.72,2.15],[1.43,60.24,2.66],[1.907,63.67,3.35],[2.12,23.46,2],[3.405,49.86,1.79],[3.136,40.96,2.1],[.14,29.09,2.06],[23.079,15.21,2.48],[23.063,28.08,2.42],[.22,15.18,2.83],[.727,-17.99,2.04],[1.163,35.62,2.07],[2.065,42.33,2.1]],Rx={ra:12.857,dec:27.13};function wi(s){let t=s>>>0;return function(){t=t+1831565813|0;let n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function ae(s,t,e=0){let n=Math.imul(s|0,374761393)+Math.imul(t|0,668265263)+Math.imul(e|0,1442695041);return n=Math.imul(n^n>>>13,1274126177),n^=n>>>16,(n>>>0)/4294967296}const kx=.5*(Math.sqrt(3)-1),Qs=(3-Math.sqrt(3))/6,xs=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1,.7071,.7071,-.7071,.7071,.7071,-.7071,-.7071,-.7071]);function Th(s){const t=wi(s),e=new Uint8Array(256);for(let o=0;o<256;o++)e[o]=o;for(let o=255;o>0;o--){const a=Math.floor(t()*(o+1)),r=e[o];e[o]=e[a],e[a]=r}const n=new Uint8Array(512),i=new Uint8Array(512);for(let o=0;o<512;o++)n[o]=e[o&255],i[o]=n[o]%12;return function(a,r){const l=(a+r)*kx,c=Math.floor(a+l),h=Math.floor(r+l),u=(c+h)*Qs,f=a-(c-u),d=r-(h-u);let v,g;f>d?(v=1,g=0):(v=0,g=1);const x=f-v+Qs,p=d-g+Qs,m=f-1+2*Qs,M=d-1+2*Qs,_=c&255,E=h&255;let y=0,w=.5-f*f-d*d;if(w>0){const S=i[_+n[E]]*2;w*=w,y+=w*w*(xs[S]*f+xs[S+1]*d)}let A=.5-x*x-p*p;if(A>0){const S=i[_+v+n[E+g]]*2;A*=A,y+=A*A*(xs[S]*x+xs[S+1]*p)}let b=.5-m*m-M*M;if(b>0){const S=i[_+1+n[E+1]]*2;b*=b,y+=b*b*(xs[S]*m+xs[S+1]*M)}return 70*y}}function Px(s,t,e,n,i=.5){let o=0,a=1,r=0,l=1;for(let c=0;c<n;c++)o+=a*s(t*l,e*l),r+=a,a*=i,l*=2.03;return o/r}const Sa=(s,t,e)=>s<t?t:s>e?e:s,Gt=(s,t,e)=>{const n=Sa((e-s)/(t-s),0,1);return n*n*(3-2*n)},Lx=`
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;function $a(){const s=new Fe;return s.setAttribute("position",new he(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),s}const zx=`
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
`;class Dx{constructor(t){this.renderer=t,this.size=new Ot;const e=t.extensions.has("EXT_color_buffer_float")||t.extensions.has("EXT_color_buffer_half_float");this.type=e?ai:xn,this.sceneRT=new vn(1,1,{type:this.type,samples:4,depthBuffer:!0}),this.sceneRT.depthTexture=new Il(1,1,ei),this.quad=new ue($a(),new Ce({vertexShader:Lx,fragmentShader:zx,depthTest:!1,depthWrite:!1,uniforms:{uScene:{value:this.sceneRT.texture},uDepth:{value:this.sceneRT.depthTexture},uClouds:{value:null},uHasClouds:{value:0},uCloudTexel:{value:new Ot},uInvProj:{value:new ie},uCamWorld:{value:new ie},uCamPos:{value:new q},uSunDir:{value:new q(0,1,0)},uSunColor:{value:new It},uFogColor:{value:new It(.6,.7,.8)},uFogDensity:{value:.0016},uFogFalloff:{value:.045},uExposure:{value:.55},uSaturation:{value:1},uNight:{value:0},uSkyMap:{value:null}}})),this.quad.frustumCulled=!1,this.quadScene=new Bs,this.quadScene.add(this.quad),this.quadCam=new Lo(-1,1,1,-1,0,1),this.atmosphere=null}get uniforms(){return this.quad.material.uniforms}setSize(t,e,n){var i;this.size.set(Math.floor(t*n),Math.floor(e*n)),this.sceneRT.setSize(this.size.x,this.size.y),(i=this.atmosphere)==null||i.setSize(this.size.x,this.size.y)}render(t,e){const n=this.renderer;n.setRenderTarget(this.sceneRT),n.render(t,e);const i=this.uniforms;i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.atmosphere?(this.atmosphere.render(n,e,this.sceneRT.depthTexture),i.uClouds.value=this.atmosphere.texture,i.uCloudTexel.value.set(1/this.atmosphere.rt.width,1/this.atmosphere.rt.height),i.uHasClouds.value=1):i.uHasClouds.value=0,n.setRenderTarget(null),n.render(this.quadScene,this.quadCam)}}const Jn=Math.PI/180,co=21*Jn,ca=29.530588,Fx=224.1,Ix=["Hilo","Hoaka","Kūkahi","Kūlua","Kūkolu","Kūpau","ʻOlekūkahi","ʻOlekūlua","ʻOlekūkolu","ʻOlepau","Huna","Mōhalu","Hua","Akua","Hoku","Māhealani","Kulu","Lāʻaukūkahi","Lāʻaukūlua","Lāʻaupau","ʻOlekūkahi","ʻOlekūlua","ʻOlepau","Kāloakūkahi","Kāloakūlua","Kāloapau","Kāne","Lono","Mauli","Muku"];function Ch(s,t,e){const n=Math.cos(s),i=-n*Math.sin(t),o=Math.sin(s)*Math.cos(co)-n*Math.cos(t)*Math.sin(co),a=Math.sin(s)*Math.sin(co)+n*Math.cos(t)*Math.cos(co);return e.set(i,a,-o)}function Qu(s,t,e={}){const n=23.44*Jn*Math.sin(2*Math.PI*(284+s)/365),i=(s-80)/365.25*360*Jn,a=((s-80)/365.25*24%24+24)%24+t-12;e.sun=Ch(n,(t-12)*15*Jn,e.sun||new q);const r=s+t/24,l=((r-Fx)%ca+ca)%ca,c=l/ca,h=i+c*2*Math.PI,u=Math.asin(Math.sin(23.44*Jn)*Math.sin(h)+Math.sin(5.1*Jn)*Math.sin(r*.23)),f=h/(2*Math.PI)*24;return e.moon=Ch(u,(a-f)*15*Jn,e.moon||new q),e.phase=c,e.night=Math.min(29,Math.floor(l)),e.illum=.5-.5*Math.cos(c*2*Math.PI),e.lst=a,e.decl=n,e}const t0=[5804542996261093e-21,13562911419845635e-21,30265902468824876e-21],e0=[18399918514433978e-2,27798023919660528e-2,40790479543861094e-2],Ux=1.6110731556870734,Nx=1.5;function Ox(s){return s=Math.max(-1,Math.min(1,s)),1e3*Math.max(0,1-Math.exp(-((Ux-Math.acos(s))/Nx)))}function Fr(s,t,e,n=[0,0,0]){const i=Ox(t.y),o=.2*e.turbidity*1e-17,a=Math.acos(Math.max(0,s.y)),r=1/(Math.cos(a)+.15*Math.pow(93.885-a*180/Math.PI,-1.253)),l=8400*r,c=1250*r,h=s.x*t.x+s.y*t.y+s.z*t.z,u=3/(16*Math.PI)*(1+Math.pow(h*.5+.5,2)),f=e.mieDirectionalG,d=f*f,v=1/(4*Math.PI)*((1-d)/Math.pow(1-2*f*h+d,1.5)),g=Math.min(1,Math.max(0,Math.pow(1-t.y,5)));for(let x=0;x<3;x++){const p=t0[x]*e.rayleigh,m=.434*o*e0[x]*e.mieCoefficient,M=Math.exp(-(p*l+m*c)),_=(p*u+m*v)/(p+m);let E=Math.pow(i*_*(1-M),1.5);E*=1+(Math.pow(i*_*M,.5)-1)*g;const y=.1*M,w=(E+y)*.04+[0,3e-4,75e-5][x];n[x]=Math.pow(w,1/2.4)}return n}function Bx(s,t,e=[0,0,0]){const n=Math.acos(Math.max(0,s.y)),i=1/(Math.cos(n)+.15*Math.pow(Math.max(.01,93.885-n*180/Math.PI),-1.253)),o=.2*t.turbidity*1e-17;for(let a=0;a<3;a++){const r=t0[a]*t.rayleigh,l=.434*o*e0[a]*t.mieCoefficient;e[a]=Math.exp(-(r*8400*i+l*1250*i))}return e}const Hx=`
out vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * mat4(mat3(viewMatrix)) * vec4(position, 1.0);
  gl_Position = p.xyww;
}
`,n0=`
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
`,Gx=`
${n0}
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
`,Wx=`
${n0}
in vec2 vUv;
void main() {
  float az = (vUv.x - 0.5) * 2.0 * pi;
  float v = vUv.y * 2.0 - 1.0;
  float y = sign(v) * v * v;
  float r = sqrt(max(0.0, 1.0 - y * y));
  vec3 dir = vec3(cos(az) * r, y, sin(az) * r);
  gl_FragColor = vec4(skyRadiance(dir, 0.0), 1.0);
}
`,Vx=`
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
`,qx=`
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
`;class Xx{constructor(){this.params={turbidity:3.2,rayleigh:1.3,mieCoefficient:.005,mieDirectionalG:.82};const t=Rx,e=(c,h)=>{const u=c/24*2*Math.PI,f=h*Jn;return new q(Math.cos(f)*Math.cos(u),Math.cos(f)*Math.sin(u),Math.sin(f))};this.uniforms={uSun:{value:new q(0,1,0)},uMoon:{value:new q(0,-1,0)},uPhase:{value:.5},uIllum:{value:1},uTurbidity:{value:this.params.turbidity},uRayleigh:{value:this.params.rayleigh},uMie:{value:this.params.mieCoefficient},uMieG:{value:this.params.mieDirectionalG},uNight:{value:0},uLst:{value:0},uLat:{value:co},uGalPole:{value:e(t.ra,t.dec)},uGalCentre:{value:e(17.761,-28.94)},uExposureHint:{value:1}};const n=new ue(new Ol(1,5),new Ce({vertexShader:Hx,fragmentShader:Gx,uniforms:this.uniforms,side:en,depthWrite:!1}));n.frustumCulled=!1,n.renderOrder=-2,this.dome=n;const i=wi(4242),o=Cx.map(([c,h,u])=>[c/24*2*Math.PI,h*Jn,u]);for(let c=0;c<2600;c++){const h=i()*2-1;o.push([i()*2*Math.PI,Math.asin(h),3.4+Math.pow(i(),.55)*2.8])}const a=new Float32Array(o.length*3);o.forEach((c,h)=>a.set(c,h*3));const r=new Fe;r.setAttribute("aStar",new he(a,3)),r.setAttribute("position",new he(new Float32Array(o.length*3),3)),this.starUniforms={uLst:this.uniforms.uLst,uLat:this.uniforms.uLat,uNight:{value:0},uTime:{value:0},uPixel:{value:1}},this.stars=new Xu(r,new Ce({vertexShader:Vx,fragmentShader:qx,uniforms:this.starUniforms,transparent:!0,depthWrite:!1,blending:sl})),this.stars.frustumCulled=!1,this.stars.renderOrder=-1,this.group=new En,this.group.add(n,this.stars),this.mapRT=new vn(256,128,{type:ai,depthBuffer:!1}),this.mapRT.texture.wrapS=Gi,this.mapScene=new Bs;const l=new ue($a(),new Ce({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:Wx,uniforms:this.uniforms,depthTest:!1,depthWrite:!1}));l.frustumCulled=!1,this.mapScene.add(l),this.mapCam=new Lo(-1,1,1,-1,0,1),this.astro={},this._v=new q}renderMap(t){const e=t.getRenderTarget();t.setRenderTarget(this.mapRT),t.render(this.mapScene,this.mapCam),t.setRenderTarget(e)}update(t,e,n,i){const o=Qu(t,e,this.astro),a=o.sun,r=this.uniforms;r.uSun.value.copy(a),r.uMoon.value.copy(o.moon),r.uPhase.value=o.phase,r.uIllum.value=o.illum,r.uLst.value=o.lst/24*2*Math.PI;const l=Hn.smoothstep(-a.y,-.02,.2);r.uNight.value=l,this.starUniforms.uNight.value=l,this.starUniforms.uTime.value=n;const c=this.params,h=this._v,u=Fr(h.set(0,1,0),a,c),f=[0,0,0];for(let y=0;y<8;y++){const w=y/8*Math.PI*2,A=Fr(h.set(Math.cos(w),.08,Math.sin(w)).normalize(),a,c);for(let b=0;b<3;b++)f[b]+=A[b]/8}const d=Fr(h.set(a.x,.05,a.z).normalize(),a,c),v=Bx(a,c),g=Hn.smoothstep(a.y,-.04,.06),x=3.2;i.sunColor.setRGB(v[0]*x*g,v[1]*x*g,v[2]*x*g);const p=[.0035,.005,.011],M=Hn.smoothstep(o.moon.y,-.02,.1)*o.illum*l;i.skyColor.setRGB(u[0]*.55+f[0]*.45+p[0]+.012*M,u[1]*.55+f[1]*.45+p[1]+.016*M,u[2]*.55+f[2]*.45+p[2]+.024*M);const _=i.skyColor.r*.2126+i.skyColor.g*.7152+i.skyColor.b*.0722;i.skyColor.lerp(new It(_,_,_),.35),i.zenith.setRGB(u[0],u[1],u[2]),i.horizon.setRGB(f[0]+p[0],f[1]+p[1],f[2]+p[2]),i.sunHorizon.setRGB(d[0],d[1],d[2]);const E=.11;return i.groundColor.setRGB((i.sunColor.r*Math.max(0,a.y)+i.skyColor.r)*E*1.1,(i.sunColor.g*Math.max(0,a.y)+i.skyColor.g)*E,(i.sunColor.b*Math.max(0,a.y)+i.skyColor.b)*E*.8),i.moonColor.setRGB(.05*M,.06*M,.085*M),i.moonDir.copy(o.moon),i.sunDir.copy(a),i.night=l,o}}const Ir=Math.PI*2,jx=s=>s<.5?4*s*s*s:1-Math.pow(-2*s+2,3)/2,Rh=s=>((s+Math.PI)%Ir+Ir)%Ir-Math.PI;class Yx{constructor(t,e,n){this.camera=t,this.dom=e,this.terrain=n,this.state={target:new q(0,0,20),distance:420,yaw:.35,pitch:.62,lift:0},this.goal={target:this.state.target.clone(),distance:420,yaw:.35,pitch:.62,lift:0},this.flight=null,this.floor=0,this.minDistance=.5,this.maxDistance=900,this.autoOrbit=0,this.lastInput=-1e9,this.onUserInput=null,this.enabled=!0,this._ray=new Mx,this._v=new q,this.bind()}bind(){const t=this.dom,e=new Map;let n=null,i=null,o=null;t.addEventListener("contextmenu",r=>r.preventDefault()),t.addEventListener("pointerdown",r=>{this.enabled&&(t.setPointerCapture(r.pointerId),e.set(r.pointerId,{x:r.clientX,y:r.clientY}),e.size===1?(n=r.button===2||r.shiftKey||r.ctrlKey||r.metaKey?"pan":"orbit",i={x:r.clientX,y:r.clientY},this.panAnchor=n==="pan"?this.pickGround(r.clientX,r.clientY):null):e.size===2&&(n="pinch",o=this.pinchState(e)),this.touch())}),t.addEventListener("pointermove",r=>{if(e.has(r.pointerId)){if(e.set(r.pointerId,{x:r.clientX,y:r.clientY}),n==="orbit"&&i){const l=r.clientX-i.x,c=r.clientY-i.y;this.goal.yaw-=l*.005,this.goal.pitch=Hn.clamp(this.goal.pitch+c*.004,.06,1.52),i={x:r.clientX,y:r.clientY},this.touch()}else if(n==="pan"&&i)this.panBy(r.clientX-i.x,r.clientY-i.y),i={x:r.clientX,y:r.clientY},this.touch();else if(n==="pinch"&&e.size===2){const l=this.pinchState(e),c=o.dist/Math.max(20,l.dist);this.goal.distance=Hn.clamp(this.goal.distance*c,this.minDistance,this.maxDistance),this.panBy(l.cx-o.cx,l.cy-o.cy),this.goal.yaw-=Rh(l.angle-o.angle),this.goal.pitch=Hn.clamp(this.goal.pitch+(l.cy-o.cy)*0,.06,1.52),o=l,this.touch()}}});const a=r=>{if(e.delete(r.pointerId),e.size===0)n=null;else if(e.size===1){const[l]=e.values();n="orbit",i={...l}}};t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a),t.addEventListener("wheel",r=>{if(!this.enabled)return;r.preventDefault();const l=Math.exp(Math.sign(r.deltaY)*Math.min(Math.abs(r.deltaY),120)*.0018);this.zoomAt(r.clientX,r.clientY,l),this.touch()},{passive:!1}),t.addEventListener("dblclick",r=>{const l=this.pickGround(r.clientX,r.clientY);l&&this.flyTo({target:l,distance:Math.max(6,this.goal.distance*.45)},1.6)}),addEventListener("keydown",r=>{var h,u;if(!this.enabled||(u=(h=r.target).closest)!=null&&u.call(h,"input, textarea"))return;const l=this.goal.distance*.08,c={ArrowUp:[0,-1],KeyW:[0,-1],ArrowDown:[0,1],KeyS:[0,1],ArrowLeft:[-1,0],KeyA:[-1,0],ArrowRight:[1,0],KeyD:[1,0]}[r.code];if(c&&!r.altKey){const f=Math.sin(this.goal.yaw),d=Math.cos(this.goal.yaw);this.goal.target.x+=(c[0]*d+c[1]*f)*l,this.goal.target.z+=(-c[0]*f+c[1]*d)*l,this.touch()}r.code==="KeyQ"&&(this.goal.yaw+=.12),r.code==="KeyE"&&(this.goal.yaw-=.12),(r.code==="Equal"||r.code==="NumpadAdd")&&(this.goal.distance*=.85),(r.code==="Minus"||r.code==="NumpadSubtract")&&(this.goal.distance/=.85)})}pinchState(t){const[e,n]=[...t.values()];return{dist:Math.hypot(e.x-n.x,e.y-n.y),cx:(e.x+n.x)/2,cy:(e.y+n.y)/2,angle:Math.atan2(n.y-e.y,n.x-e.x)}}touch(){var t;this.flight=null,this.goal.lift=0,this.lastInput=performance.now(),(t=this.onUserInput)==null||t.call(this)}panBy(t,e){const n=this.dom.clientHeight||1,i=this.state.distance*2*Math.tan(this.camera.fov*Math.PI/360)/n,o=Math.sin(this.goal.yaw),a=Math.cos(this.goal.yaw),r=1/Math.max(.35,Math.sin(this.state.pitch));this.goal.target.x+=(-t*a-e*o*r)*i,this.goal.target.z+=(t*o-e*a*r)*i}zoomAt(t,e,n){const i=this.pickGround(t,e),o=this.goal.distance,a=Hn.clamp(o*n,this.minDistance,this.maxDistance);if(i&&a<o){const r=1-a/o;this.goal.target.lerp(i,r)}this.goal.distance=a}pickGround(t,e){const n=this.dom.getBoundingClientRect(),i=new Ot((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1);return this._ray.setFromCamera(i,this.camera),this.marchRay(this._ray.ray.origin,this._ray.ray.direction)}marchRay(t,e,n=3e3){const i=(l,c)=>Math.max(0,this.terrain.heightAt(l,c));let o=0,a=0,r=this._v;for(let l=0;l<400&&o<n;l++){r.copy(t).addScaledVector(e,o);const c=r.y-i(r.x,r.z);if(c<0){let h=a,u=o;for(let f=0;f<20;f++){const d=(h+u)/2;r.copy(t).addScaledVector(e,d),r.y-i(r.x,r.z)<0?u=d:h=d}return r.clone()}a=o,o+=Math.max(.03,c*.45,o*.002)}return null}flyTo(t,e=3,n={}){const i={target:this.goal.target.clone(),distance:this.goal.distance,yaw:this.goal.yaw,pitch:this.goal.pitch,lift:this.goal.lift},o={target:t.target?t.target.clone():i.target.clone(),distance:t.distance??i.distance,yaw:t.yaw??i.yaw,pitch:t.pitch??i.pitch,lift:t.lift??0};o.yaw=i.yaw+Rh(o.yaw-i.yaw);const a=i.target.distanceTo(o.target),r=n.hop??Math.max(0,a*.9-Math.max(i.distance,o.distance)*.6);this.flight={from:i,dest:o,t:0,duration:e,hop:r,onDone:n.onDone}}finishFlight(){var e;if(!this.flight)return;const t=this.flight;this.goal.target.copy(t.dest.target),this.goal.distance=t.dest.distance,this.goal.yaw=t.dest.yaw,this.goal.pitch=t.dest.pitch,this.goal.lift=t.dest.lift,this.state.lift=t.dest.lift,this.state.target.copy(t.dest.target),this.state.distance=t.dest.distance,this.state.yaw=t.dest.yaw,this.state.pitch=t.dest.pitch,this.flight=null,(e=t.onDone)==null||e.call(t),this.apply()}update(t){var o;const e=this.goal;if(this.flight){const a=this.flight;a.t=Math.min(1,a.t+t/a.duration);const r=jx(a.t);e.target.lerpVectors(a.from.target,a.dest.target,r);const l=Math.log(a.from.distance)*(1-r)+Math.log(a.dest.distance)*r;e.distance=Math.exp(l)+a.hop*Math.sin(Math.PI*r),e.yaw=a.from.yaw+(a.dest.yaw-a.from.yaw)*r,e.pitch=a.from.pitch+(a.dest.pitch-a.from.pitch)*r+.25*Math.sin(Math.PI*r)*Math.min(1,a.hop/80),e.lift=a.from.lift+(a.dest.lift-a.from.lift)*r,a.t>=1&&(this.flight=null,(o=a.onDone)==null||o.call(a))}else this.autoOrbit&&performance.now()-this.lastInput>4e3&&(e.yaw+=this.autoOrbit*t);if(e.target.x=Hn.clamp(e.target.x,-ht*1.3,ht*1.3),e.target.z=Hn.clamp(e.target.z,-ht*1.3,ht*1.3),!this.flight){const a=Math.max(0,this.terrain.heightAt(e.target.x,e.target.z));e.target.y+=(a-e.target.y)*(1-Math.exp(-t*6))}const n=this.state,i=this.flight?1:1-Math.exp(-t*7);n.target.lerp(e.target,i),n.distance+=(e.distance-n.distance)*i,n.yaw+=(e.yaw-n.yaw)*i,n.pitch+=(e.pitch-n.pitch)*i,n.lift+=(e.lift-n.lift)*i,this.apply(t)}groundAhead(t,e,n){const i=this.terrain;let o=i.heightAt(t,e);const a=this._prevXZ;if(a&&n>0){const r=(t-a.x)/n,l=(e-a.y)/n,c=Math.hypot(r,l),h=Math.min(2,c*.3);h>.005&&(o=Math.max(o,i.heightAt(t+r/c*h,e+l/c*h)))}return this._prevXZ=(this._prevXZ||new Ot).set(t,e),Math.max(0,o)}apply(t=0){const e=this.state,n=this.camera,i=Math.cos(e.pitch);n.position.set(e.target.x+e.distance*i*Math.sin(e.yaw),e.target.y+e.distance*Math.sin(e.pitch),e.target.z+e.distance*i*Math.cos(e.yaw));const o=.12+e.distance*.03,a=this.groundAhead(n.position.x,n.position.z,t),r=Math.max(0,a+o-n.position.y);t<=0?this.floor=r:this.floor+=(r-this.floor)*(1-Math.exp(-t*(r>this.floor?9:2.5))),n.position.y+=this.floor;const l=Math.max(0,this.terrain.heightAt(n.position.x,n.position.z));n.position.y=Math.max(n.position.y,l+Math.min(.04,o*.3)),this._v.copy(e.target),this._v.y+=e.lift*e.distance*.45,n.lookAt(this._v);const c=n.position.y-l;n.near=Hn.clamp(Math.min(c,e.distance)*.12,.02,4),n.far=9e3,n.updateProjectionMatrix()}}const $x=`
${Ze}
${Tn}
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
`;class Kx{constructor(t,e=1024){this.rt=new vn(e,e,{type:xn,depthBuffer:!1,minFilter:ve,magFilter:ve}),this.material=new Ce({vertexShader:"out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:$x,uniforms:{uHeight:{value:t},uSunDir:{value:new q(0,1,0)}},depthTest:!1,depthWrite:!1}),this.scene=new Bs;const n=new ue($a(),this.material);n.frustumCulled=!1,this.scene.add(n),this.cam=new Lo(-1,1,1,-1,0,1),this.last=new q(0,-2,0),this.size=e,this.strips=4,this.strip=-1}get texture(){return this.rt.texture}update(t,e,n=!1){if(n||!this.drawn){this.drawn=!0,this.draw(t,e,-1);return}if(this.strip<0){if(e.angleTo(this.last)<.004)return;this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e),this.strip=0}this.draw(t,null,this.strip),this.strip=this.strip+1>=this.strips?-1:this.strip+1}draw(t,e,n){e&&(this.material.uniforms.uSunDir.value.copy(e),this.last.copy(e));const i=this.rt;if(n>=0){const a=this.size/this.strips;i.scissor.set(0,n*a,this.size,a),i.scissorTest=!0}else i.scissorTest=!1;const o=t.getRenderTarget();t.setRenderTarget(i),t.render(this.scene,this.cam),t.setRenderTarget(o),i.scissorTest=!1}}const Zx=`
${Ze}
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
uniform float uFar;        // how far out (world units) the march goes
uniform float uMarch;      // and the most steps it may take getting there
uniform float uFlash;      // lightning
uniform vec3 uFlashPos;
uniform float uFrame;      // frame counter, steps the sample offsets
uniform sampler2D uBowLUT;  // raindrop light near the bows (x = degrees from antisolar / 64; rows: showers, light rain, drizzle)
uniform sampler2D uShadow;  // terrain shadow from the sun, top-down
${Tn}
${Zu}
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
    // (none right on top of the camera, where one would fill a tour view)
    float far = tradeCumulus(xz, uWind, uWindDir, uFarCover) * smoothstep(20.0, 50.0, distance(xz, uCamPos.xz));
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
  cloudDepth = vec4(min(sceneDist, uFar));

  float yHi = uTop + 0.5;
  float yLo = 0.0;
  // slab intersection
  float t0, t1;
  if (abs(rd.y) < 1e-5) {
    if (uCamPos.y < yLo || uCamPos.y > yHi) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
    t0 = 0.0; t1 = uFar;
  } else {
    float ta = (yLo - uCamPos.y) / rd.y;
    float tb = (yHi - uCamPos.y) / rd.y;
    t0 = max(0.0, min(ta, tb));
    t1 = max(ta, tb);
  }
  // (far enough that the cumulus over the sea run on to the horizon)
  t1 = min(t1, min(sceneDist, uFar));
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
    if (t >= t1 || T < 0.03 || float(i) >= uMarch) break;
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
`,Jx=`
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
`,Qx=.9,kh="out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }",i0=512,s0=64;function tv(s){if(s>6)return 0;if(s<-7){const a=-s,r=2/3*a*Math.sqrt(a),l=r+Math.PI/4;return(Math.sin(l)-5/(72*r)*Math.cos(l))/(Math.sqrt(Math.PI)*Math.sqrt(Math.sqrt(a)))}const t=s*s*s;let e=1,n=s,i=1,o=s;for(let a=1;a<80&&(i*=t/((3*a-1)*(3*a)),o*=t/(3*a*(3*a+1)),e+=i,n+=o,!(Math.abs(i)+Math.abs(o)<1e-16));a++);return .355028053887817*e-.258819403792807*n}const o0=s=>1.3239+.003125/(s*s);function a0(s,t,e){const n=Math.sqrt(1-e*e),i=Math.sqrt(1-e*e/(s*s)),o=(n-s*i)/(n+s*i),a=(s*n-i)/(s*n+i),r=o*o,l=a*a;return .5*((1-r)**2*r**t+(1-l)**2*l**t)}function Ss(s,t,e){const n=Math.asin(e),i=Math.asin(e/s),o=2*(n-i)+t*(Math.PI-2*i);return t===1?Math.PI-o:o-Math.PI}function Bl(s,t){const e=Math.sqrt(1-(s*s-1)/(t*(t+2))),n=2*e/Math.pow(1-e*e,1.5)-2*(t+1)*e/Math.pow(s*s-e*e,1.5);return{b:e,alpha:Ss(s,t,e),d2:Math.abs(n),eps:a0(s,t,e)}}const Ri=(s,t,e,n)=>Math.exp(-.5*((s-t)/(s<t?e:n))**2),ev=s=>[1.056*Ri(s,599.8,37.9,31)+.362*Ri(s,442,16,26.7)-.065*Ri(s,501.1,20.4,26.2),.821*Ri(s,568.8,46.9,40.5)+.286*Ri(s,530.9,16.3,31.1),1.217*Ri(s,437,11.8,36)+.681*Ri(s,459,26,13.8)],Ph=([s,t,e])=>[3.2406*s-1.5372*t-.4986*e,-.9689*s+1.8758*t+.0415*e,.0557*s-.204*t+1.057*e],Ml=.25;function nv(s,t,e){const n=Bl(s,t);let i=0;for(const[o,a]of[[1e-6,n.b],[n.b,1-1e-9]]){let r=o,l=a;const c=Ss(s,t,r)-e;if(c*(Ss(s,t,l)-e)>0)continue;for(let v=0;v<40;v++){const g=(r+l)/2;(Ss(s,t,g)-e)*c>0?r=g:l=g}const h=(r+l)/2,u=Math.max(h-1e-6,0),f=Math.min(h+1e-6,1),d=Math.abs(Ss(s,t,f)-Ss(s,t,u))/(f-u);i+=2*a0(s,t,h)*h/(d*Math.sin(e))}return i}function iv(){const s=o0(.55);return[1,2].map(t=>{const e=Bl(s,t),n=new Float32Array(Math.ceil(s0/Ml)+1);for(let i=0;i<n.length;i++){const o=Math.max(i*Ml,.5)*Math.PI/180,a=t===1?e.alpha-o:e.alpha+o;if(a<=.01||a>=Math.PI-.01){n[i]=n[i-1]||1;continue}const r=e.eps*e.b*Math.cbrt(4)*Math.pow(e.d2,-2/3)*2/(Math.sqrt(o*Math.cbrt(2/e.d2))*Math.sin(a));n[i]=nv(s,t,a)/r}return n})}const Oa=-20,_l=.01;function sv(){const s=new Float32Array(Math.round((6-Oa)/_l)+2);for(let t=0;t<s.length;t++)s[t]=tv(Oa+t*_l)**2;return s}function Ur(s,t,e){const n=i0,i=s0/n,o=new Float32Array(n*3),a=[.6,.75,.9,1,1.1,1.25,1.45,1.7].map(m=>s*m),r=a.map(m=>Math.exp(-.5*(Math.log(m/s)/.3)**2)*m*m),l=r.reduce((m,M)=>m+M,0),c=new Float32Array(n),h=new Float32Array(n);for(let m=0;m<n;m++)c[m]=Math.max((m+.5)*i,1)*Math.PI/180,h[m]=1/Math.sin(c[m]);const u=[0,0,0],f=new Float32Array(n*3);for(let m=400;m<=700;m+=20){const M=ev(m);for(let E=0;E<3;E++)u[E]+=M[E];const _=o0(m/1e3);for(const E of[1,2]){const y=Bl(_,E),w=t[E-1],A=E===1?1:-1;for(let b=0;b<a.length;b++){const S=2*Math.PI*a[b]*1e6/m,R=Math.cbrt(S),k=R*R*Math.cbrt(2/y.d2),I=y.eps*y.b*Math.cbrt(4)*R*Math.pow(y.d2,-2/3)*4*Math.PI*(r[b]/l);for(let T=E===1?0:n-1;T>=0&&T<n;T+=A){const C=(y.alpha-c[T])*A,F=-C*k;if(F>6)break;let N;if(F<Oa)N=1/(2*Math.PI*Math.sqrt(-F));else{const U=(F-Oa)/_l,L=Math.floor(U);N=e[L]+(e[L+1]-e[L])*(U-L)}let z=I*N*h[T];if(C>0){const U=Math.min(w.length-1.001,C*180/Math.PI/Ml),L=Math.floor(U);z*=w[L]+(w[L+1]-w[L])*(U-L)}f[T*3]+=z*M[0],f[T*3+1]+=z*M[1],f[T*3+2]+=z*M[2]}}}}const d=Ph(u),v=Math.ceil(.2665/i),g=[];for(let m=-v;m<=v;m++)g.push(Math.sqrt(Math.max(0,1-(m*i/.2665)**2)));const x=g.reduce((m,M)=>m+M,0),p=[0,0,0];for(let m=0;m<n;m++){p.fill(0);for(let A=-v;A<=v;A++){const b=Math.min(n-1,Math.max(0,m+A));for(let S=0;S<3;S++)p[S]+=f[b*3+S]*g[A+v]/x}const M=Ph(p).map((A,b)=>A/d[b]),_=.2126*M[0]+.7152*M[1]+.0722*M[2],E=Math.min(M[0],M[1],M[2]),y=E<0?_/Math.max(_-E,1e-6):1,w=1-Math.min(1,Math.max(0,((m+.5)*i-58)/5));for(let A=0;A<3;A++)o[m*3+A]=Math.max(0,_+(M[A]-_)*y)*w}return o}function ov(){performance.now();const s=iv(),t=sv(),e=[Ur(.5,s,t),Ur(.15,s,t),Ur(.05,s,t)],n=i0,i=new Uint16Array(n*3*4),o=Oc.toHalfFloat(1);for(let r=0;r<3;r++)for(let l=0;l<n;l++){const c=(r*n+l)*4;for(let h=0;h<3;h++)i[c+h]=Oc.toHalfFloat(e[r][l*3+h]);i[c+3]=o}const a=new yi(i,n,3,Ke,ai);return a.minFilter=a.magFilter=ve,a.wrapS=a.wrapT=cn,a.needsUpdate=!0,a}class av{constructor(t){const e=new fl(t.shape,t.shapeSize,t.shapeSize,t.shapeSize);e.format=zs,e.minFilter=ve,e.magFilter=ve,e.wrapS=e.wrapT=e.wrapR=Gi,e.unpackAlignment=1,e.needsUpdate=!0;const n=new fl(t.detail,t.detailSize,t.detailSize,t.detailSize);n.format=zs,n.minFilter=ve,n.magFilter=ve,n.wrapS=n.wrapT=n.wrapR=Gi,n.unpackAlignment=1,n.needsUpdate=!0,this.scale=.5;const i={type:ai,depthBuffer:!1};this.march=new Kf(1,1,2,i),this.march.texture[1].format=zs,this.history=[new vn(1,1,i),new vn(1,1,i)],this.current=0,this.frame=0,this.fresh=!0,this.prev={viewProj:new ie,pos:new q,fwd:new q,sun:new q,wind:new Ot},this._fwd=new q,this.uniforms={uDepth:{value:null},uWeather:{value:null},uShape:{value:e},uDetail:{value:n},uWeatherRect:{value:new _e},uInvProj:{value:new ie},uCamWorld:{value:new ie},uCamPos:{value:new q},uSunDir:{value:new q},uSunColor:{value:new It},uSkyColor:{value:new It},uGroundColor:{value:new It},uFogColor:{value:new It},uMoonDir:{value:new q},uMoonColor:{value:new It},uWind:{value:new Ot},uWindDir:{value:new Ot(1,0)},uTime:{value:0},uBase:{value:8},uTop:{value:28},uDensity:{value:1},uFarCover:{value:.32},uOvercast:{value:0},uRainbow:{value:1},uBowLUT:{value:ov()},uShadow:{value:null},uHeight:{value:null},uSteps:{value:56},uLightSteps:{value:4},uFar:{value:3e3},uMarch:{value:260},uFlash:{value:0},uFlashPos:{value:new q},uFrame:{value:0}},this.material=new Ce({vertexShader:kh,fragmentShader:Zx,uniforms:this.uniforms,depthTest:!1,depthWrite:!1});const o=$a();this.scene=new Bs;const a=new ue(o,this.material);a.frustumCulled=!1,this.scene.add(a),this.resolve=new Ce({vertexShader:kh,fragmentShader:Jx,uniforms:{uCur:{value:this.march.texture[0]},uCurDepth:{value:this.march.texture[1]},uHistory:{value:null},uPrevViewProj:{value:new ie},uInvProj:this.uniforms.uInvProj,uCamWorld:this.uniforms.uCamWorld,uCamPos:this.uniforms.uCamPos,uDrift:{value:new q},uBlend:{value:0}},depthTest:!1,depthWrite:!1}),this.resolveScene=new Bs;const r=new ue(o,this.resolve);r.frustumCulled=!1,this.resolveScene.add(r),this.cam=new Lo(-1,1,1,-1,0,1),this.enabled=!0}get rt(){return this.history[this.current]}get texture(){return this.rt.texture}setSize(t,e){this.full=[t,e];const n=Math.max(1,Math.floor(t*this.scale)),i=Math.max(1,Math.floor(e*this.scale));this.march.setSize(n,i);for(const o of this.history)o.setSize(n,i);this.fresh=!0}setScale(t){Math.abs(t-this.scale)<.001||(this.scale=t,this.full&&this.setSize(...this.full))}isCut(t){const e=this.prev,n=t.getWorldDirection(this._fwd),i=t.position,o=this.fresh||i.distanceTo(e.pos)>.5+.25*Math.max(0,i.y)||n.dot(e.fwd)<.85||this.uniforms.uSunDir.value.dot(e.sun)<.9995;return e.pos.copy(i),e.fwd.copy(n),e.sun.copy(this.uniforms.uSunDir.value),this.fresh=!1,o}render(t,e,n){const i=this.uniforms,o=this.isCut(e);i.uDepth.value=n,i.uInvProj.value.copy(e.projectionMatrixInverse),i.uCamWorld.value.copy(e.matrixWorld),i.uCamPos.value.copy(e.position),this.frame=(this.frame+1)%4096,i.uFrame.value=this.frame,t.setRenderTarget(this.march),t.render(this.scene,this.cam);const a=this.resolve.uniforms,r=this.prev;a.uBlend.value=o?0:i.uFlash.value>.02?.5:Qx,a.uPrevViewProj.value.copy(r.viewProj),a.uDrift.value.set(i.uWind.value.x-r.wind.x,0,i.uWind.value.y-r.wind.y),a.uHistory.value=this.history[this.current].texture,this.current^=1,t.setRenderTarget(this.history[this.current]),t.render(this.resolveScene,this.cam),r.viewProj.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),r.wind.copy(i.uWind.value)}}const wl={moae:{name:"Moaʻe",gloss:"trade winds",bearing:62,speed:8.5,humidity:1,lcl:650,inversion:2e3,patch:1,convect:.55},kona:{name:"Kona",gloss:"southerly storm",bearing:205,speed:11,humidity:1.45,lcl:420,inversion:3800,patch:1.6,convect:.8},malie:{name:"Mālie",gloss:"calm, sea breezes",bearing:110,speed:2.4,humidity:.85,lcl:900,inversion:2900,patch:.5,convect:1.5}},nn=160,to=Vt*1.8;class rv{constructor(t,e,n=7){this.G=nn,this.span=to,this.cell=to/nn,this.origin=-to/2;const i=nn*nn;this.terrain=new Float32Array(i),this.land=new Float32Array(i),this.heat=new Float32Array(i);for(let o=0;o<nn;o++)for(let a=0;a<nn;a++){const r=this.origin+(a+.5)*this.cell,l=this.origin+(o+.5)*this.cell;let c=0,h=0,u=0;for(let d=-1;d<=1;d++)for(let v=-1;v<=1;v++){const g=r+v*this.cell*.5,x=l+d*this.cell*.5,p=Math.floor((g+Vt/2)/Vt*e),m=Math.floor((x+Vt/2)/Vt*e),M=p<0||m<0||p>=e||m>=e?-500:t[m*e+p];c+=Math.max(0,M),h=Math.max(h,M),u++}const f=o*nn+a;this.terrain[f]=c/u,this.land[f]=h>0?1:0}this.qv=new Float32Array(i).fill(1),this.qc=new Float32Array(i),this.zp=new Float32Array(i),this.rain=new Float32Array(i),this.wet=new Float32Array(i),this.conv=new Float32Array(i),this.tmp=[new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i),new Float32Array(i)],this.noise=Th(n),this.noise2=Th(n+1),this.mode="auto",this.regime="moae",this.state={...wl.moae},this.wind=new Ot(...Pa(62)).multiplyScalar(8.5),this.windOffset=new Ot,this.simTime=0,this.nextChange=3600*30,this.rainTotal=0,this.data=new Float32Array(i*4),this.texture=new yi(this.data,nn,nn,Ke,In),this.texture.minFilter=ve,this.texture.magFilter=ve,this.texture.wrapS=this.texture.wrapT=cn,this.texture.needsUpdate=!0,this.rect=new _e(this.origin,this.origin,to,to),this.accum=0,this.boost=0}setMode(t){this.mode=t,t!=="auto"&&(this.regime=t)}pickRegime(t){const e=Math.random();return t==="hooilo"?e<.62?"moae":e<.8?"malie":"kona":e<.86?"moae":e<.97?"malie":"kona"}step(t,e,n,i,o=!1){if(t<=0)return;if(this.simTime+=t,this.mode==="auto"&&this.simTime>this.nextChange){this.regime=this.pickRegime(i);const y=this.regime==="moae"?30+Math.random()*60:this.regime==="kona"?14+Math.random()*20:10+Math.random()*16;this.nextChange=this.simTime+y*3600}const a=wl[this.regime],r=1-Math.exp(-t/7200),l=this.state;for(const y of["speed","humidity","lcl","inversion","patch","convect"]){let w=a[y];this.boost&&y==="humidity"&&(w*=1.18),this.boost&&y==="patch"&&(w*=1.6),l[y]+=(w-l[y])*r}let c=a.bearing-l.bearing;c=(c+540)%360-180,l.bearing+=c*r;const h=1+.18*Math.sin((n-9)/24*Math.PI*2),u=1+.12*this.noise(this.simTime/5400,3.3),f=l.bearing+9*this.noise(this.simTime/9e3,7.7),[d,v]=Pa(f),g=l.speed*h*u;this.wind.set(d*g,v*g);const x=d*g/100,p=v*g/100;this.windOffset.x+=x*t,this.windOffset.y+=p*t,this.pending=(this.pending||0)+t;const m=performance.now();if(!o&&m-(this.lastPhysics||0)<80)return;this.lastPhysics=m;const M=this.pending;this.pending=0;const _=Math.hypot(x,p)*M,E=Math.max(1,Math.min(12,Math.ceil(_/(this.cell*1.5))));for(let y=0;y<E;y++)this.substep(M/E,x,p,e);this.pack()}substep(t,e,n,i){const o=nn,a=this.cell,r=this.state,[l,c,h,u,f]=this.tmp,d=e*t/a,v=n*t/a,g=this.windOffset.x,x=this.windOffset.y;for(let _=0;_<o;_++)for(let E=0;E<o;E++){const y=_*o+E,w=E-d,A=_-v;if(w<0||A<0||w>o-1||A>o-1){const z=this.origin+(w+.5)*a-g,U=this.origin+(A+.5)*a-x,L=Math.hypot(e,n)||1,W=(z*e+U*n)/L,j=(-z*n+U*e)/L,P=Px(this.noise2,W/60,j/24,3);l[y]=r.humidity*(1+r.patch*.55*P),c[y]=Math.max(0,P-.05)*.75*r.patch,h[y]=0,u[y]=0,f[y]=0;continue}const b=Math.min(o-2,w|0),S=Math.min(o-2,A|0),R=w-b,k=A-S,I=S*o+b,T=(1-R)*(1-k),C=R*(1-k),F=(1-R)*k,N=R*k;l[y]=this.qv[I]*T+this.qv[I+1]*C+this.qv[I+o]*F+this.qv[I+o+1]*N,c[y]=this.qc[I]*T+this.qc[I+1]*C+this.qc[I+o]*F+this.qc[I+o+1]*N,h[y]=this.zp[I]*T+this.zp[I+1]*C+this.zp[I+o]*F+this.zp[I+o+1]*N,u[y]=this.conv[I]*T+this.conv[I+1]*C+this.conv[I+o]*F+this.conv[I+o+1]*N,f[y]=this.wet[y]}const p=Math.hypot(e,n)*t*100,m=Math.max(0,i)*r.convect,M=r.lcl;for(let _=0;_<o*o;_++){const E=this.terrain[_];let y=l[_],w=c[_];const A=h[_],b=Math.max(E,A-.24*p);if(b>A){const T=Math.max(0,b-Math.max(A,M)),C=Math.min(y,y*T/650);y-=C,w+=C}else if(b<A){const T=Math.min(w,(A-b)*(.0035*w+35e-5));w-=T,y+=T}let S=u[_]*Math.exp(-t/5400);if(this.land[_]){const T=m*Gt(80,700,E)*(1-.6*Gt(.85,1.2,r.humidity))*45e-7,C=Math.min(y*.2,T*t*y);y-=C,w+=C,S=Math.min(1,S+T*t*4)}else{y+=(r.humidity-y)*(1-Math.exp(-t/2400));const T=Math.max(0,y-r.humidity*1.12)*t*12e-5;y-=T,w+=T}const k=Math.max(0,w-.11)*(1-Math.exp(-t/1500));w-=k,w*=Math.exp(-t/21600);const I=k/Math.max(t,.001)*3600;this.rain[_]=this.rain[_]*.6+I*.4,f[_]=Sa(f[_]*Math.exp(-t/(3600*5))+I*t/3600*3,0,1),this.qv[_]=y,this.qc[_]=w,this.zp[_]=b,this.conv[_]=S,this.wet[_]=f[_]}}pack(){const t=this.data;let e=0,n=0,i=0;for(let o=0;o<nn*nn;o++){const a=Sa(this.qc[o]*4.2,0,1);t[o*4]=a;const r=Sa(this.rain[o]*2.2,0,1);t[o*4+1]=r,t[o*4+2]=this.wet[o],t[o*4+3]=this.conv[o],this.land[o]&&(e+=r);const l=r*(.4+this.conv[o]);l>n&&(n=l,i=o)}this.rainTotal=e,this.stormiest={strength:n,x:this.origin+(i%nn+.5)*this.cell,z:this.origin+(Math.floor(i/nn)+.5)*this.cell},this.texture.needsUpdate=!0}spawnShower(t,e,n=6,i=.5){const o=this.G,a=(t-this.origin)/this.cell-.5,r=(e-this.origin)/this.cell-.5,l=n/this.cell;for(let c=Math.max(0,Math.floor(r-l));c<=Math.min(o-1,Math.ceil(r+l));c++)for(let h=Math.max(0,Math.floor(a-l));h<=Math.min(o-1,Math.ceil(a+l));h++){const u=Math.hypot(h-a,c-r)/l;if(u>1)continue;const f=c*o+h,d=(1-u*u)*i;this.qc[f]=Math.max(this.qc[f],.12+d*.3),this.rain[f]=Math.max(this.rain[f],d*.6),this.conv[f]=Math.max(this.conv[f],d)}this.pack()}warm(t,e,n,i){for(let o=0;o<t*3600;o+=600)this.step(600,e,n,i,!0)}get base(){return this.state.lcl*qt}get top(){return this.state.inversion*qt}}const Wt=.016,ge=qt,Fi=Vt/bn,lv=Fi*.6,So=.06,ha=.38,cv=.2,Es=.3,Lh={noa:[7,4.6,5.2],mua:[8,5,5.6],aina:[6,4.2,4.6],kuku:[5,3.6,4],alii:[12,7,7.5]},r0=.45,zh=1.8,Hi={big:{L:44,W:30,tiers:3,rise:1.6},small:{L:26,W:18,tiers:2,rise:1.2}},yl=s=>{const t=s?Hi.big:Hi.small;return[t.L*Wt/2,t.W*Wt/2]},hv=2.6,uv=4.5,fv=2,dv=.8,pv=.15,vs={house:{reach:1.3,dry:.3,skirt:.06},heiau:{reach:6,dry:.5,skirt:.12},luakini:{reach:9,dry:.5,skirt:.12},koa:{reach:1,dry:.3,skirt:.06},ahu:{reach:2,dry:.3,skirt:.06},imu:{reach:.6,dry:.3,skirt:.06},halau:{reach:.6,dry:.05,skirt:.06},salt:{reach:.8,dry:.1,skirt:0}},Dh=.07,eo=1.6*Wt,Fh=.65,mv=1.5;function ua(s,t,e,n){let i=(e+ht)/Vt*t-.5,o=(n+ht)/Vt*t-.5;i<0&&(i=0),o<0&&(o=0),i>t-1.001&&(i=t-1.001),o>t-1.001&&(o=t-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=r*t+a,u=s[h]+(s[h+1]-s[h])*l,f=s[h+t]+(s[h+t+1]-s[h+t])*l;return u+(f-u)*c}function Hl(s,t,e,n){const i=Vt/t,o=(e+ht)/i,a=(n+ht)/i,r=Math.floor(o),l=Math.floor(a),c=o-r,h=a-l;let u,f,d,v;if(r>0&&l>0&&r<t-1&&l<t-1){const g=l*t+r,x=s[g-t-1],p=s[g-t],m=s[g-t+1],M=s[g-1],_=s[g],E=s[g+1],y=s[g+t-1],w=s[g+t],A=s[g+t+1];u=(x+p+M+_)*.25,f=(p+m+_+E)*.25,d=(M+_+y+w)*.25,v=(_+E+w+A)*.25}else{const g=-ht+r*i,x=-ht+l*i;u=ua(s,t,g,x),f=ua(s,t,g+i,x),d=ua(s,t,g,x+i),v=ua(s,t,g+i,x+i)}return r+l&1?c+h<=1?u+(f-u)*c+(d-u)*h:v+(d-v)*(1-c)+(f-v)*(1-h):h>=c?u+(v-d)*c+(d-u)*h:u+(f-u)*c+(v-f)*h}const gv=s=>Math.min(.11,.009*Math.sqrt(s)+.012)*1.4,l0=.5,zn=Math.ceil(Vt/l0),Qn=(s,t)=>t*zn+s,De=s=>Math.floor((s+ht)/l0);let Ea=0,Aa=1;function fa(s,t){if(Math.abs(s)<1e-12)return t>=0;const e=t/s;if(s<0){if(e>Aa)return!1;e>Ea&&(Ea=e)}else{if(e<Ea)return!1;e<Aa&&(Aa=e)}return!0}function ho(s,t,e,n,i,o,a){const r=Math.min(1,Math.max(0,((s-e)*i+(t-n)*o)/a));return Math.hypot(e+i*r-s,n+o*r-t)}const Ih=(s,t,e,n)=>Math.hypot(Math.max(0,Math.abs(s)-e),Math.max(0,Math.abs(t)-n));function xv(s,t,e,n,i,o){const a=e-s,r=n-t;if(Ea=0,Aa=1,fa(-a,s+i)&&fa(a,i-s)&&fa(-r,t+o)&&fa(r,o-t))return 0;const l=a*a+r*r||1e-12;return Math.min(Ih(s,t,i,o),Ih(e,n,i,o),ho(-i,-o,s,t,a,r,l),ho(i,-o,s,t,a,r,l),ho(i,o,s,t,a,r,l),ho(-i,o,s,t,a,r,l))}function vv(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}class c0{constructor(){this.seg=[],this.start=null,this.list=null,this.cells=new Map,this.polys=[],this.polyCells=new Map,this.seen=new Uint32Array(0),this.query=0}line(t,e,n=1,i=0){let o=t[0];for(let a=n;;a+=n){const r=t[Math.min(a,t.length-1)];if(this.segment(o[0],o[1],r[0],r[1],e+i),a>=t.length-1)break;o=r}}segment(t,e,n,i,o){const a=this.seg.length/5;if(this.seg.push(t,e,n,i,o),!this.start)return;const[r,l,c,h]=this.span(a);for(let u=c;u<=h;u++)for(let f=r;f<=l;f++){const d=this.cells.get(Qn(f,u));d?d.push(a):this.cells.set(Qn(f,u),[a])}}span(t,e=[0,0,0,0]){const n=this.seg,i=t*5,o=n[i+4];return e[0]=Math.max(0,De(Math.min(n[i],n[i+2])-o)),e[1]=Math.min(zn-1,De(Math.max(n[i],n[i+2])+o)),e[2]=Math.max(0,De(Math.min(n[i+1],n[i+3])-o)),e[3]=Math.min(zn-1,De(Math.max(n[i+1],n[i+3])+o)),e}freeze(){const t=this.seg.length/5,e=new Int32Array(zn*zn+1),n=[0,0,0,0];for(let a=0;a<t;a++){this.span(a,n);for(let r=n[2];r<=n[3];r++)for(let l=n[0];l<=n[1];l++)e[Qn(l,r)+1]++}for(let a=0;a<zn*zn;a++)e[a+1]+=e[a];const i=e.slice(0,zn*zn),o=new Int32Array(e[zn*zn]);for(let a=0;a<t;a++){this.span(a,n);for(let r=n[2];r<=n[3];r++)for(let l=n[0];l<=n[1];l++)o[i[Qn(l,r)]++]=a}return this.start=e,this.list=o,this}outline(t,e){this.line([...t,t[0]],e);const n=this.polys.length;this.polys.push(t);let i=1/0,o=-1/0,a=1/0,r=-1/0;for(const l of t)i=Math.min(i,l[0]),o=Math.max(o,l[0]),a=Math.min(a,l[1]),r=Math.max(r,l[1]);for(let l=De(a);l<=De(r);l++)for(let c=De(i);c<=De(o);c++){const h=Qn(c,l),u=this.polyCells.get(h);u?u.push(n):this.polyCells.set(h,[n])}}apart(t,e,n,i,o,a,r,l){const c=this.seg,h=t*5,u=c[h+4],f=c[h]-e,d=c[h+1]-n,v=c[h+2]-e,g=c[h+3]-n;return ho(0,0,f,d,v-f,g-d,(v-f)**2+(g-d)**2||1e-12)-l>=u?!0:xv(f*i+d*o,-f*o+d*i,v*i+g*o,-v*o+g*i,a,r)>=u}clear(t,e,n,i,o,a){if(!this.seg.length)return!0;this.start||this.freeze();const r=this.seg.length/5;this.seen.length<r&&(this.seen=new Uint32Array(r+1024));const l=++this.query,c=this.seen,h=Math.abs(n)*o+Math.abs(i)*a,u=Math.abs(i)*o+Math.abs(n)*a,f=Math.hypot(o,a),{start:d,list:v}=this,g=this.cells.size>0;for(let x=De(e-u);x<=De(e+u);x++)for(let p=De(t-h);p<=De(t+h);p++){const m=Qn(p,x);for(let E=d[m];E<d[m+1];E++){const y=v[E];if(c[y]!==l&&(c[y]=l,!this.apart(y,t,e,n,i,o,a,f)))return!1}const M=g&&this.cells.get(m);if(M){for(const E of M)if(c[E]!==l&&(c[E]=l,!this.apart(E,t,e,n,i,o,a,f)))return!1}const _=this.polyCells.get(m);if(_){for(const E of _)if(vv(this.polys[E],t,e))return!1}}return!0}}function Mv(s,t=null){const e=new c0;for(const n of s)e.line(n.pts,Math.max(gv(n.lineA),lv)+So,2,.01);if(t){for(const n of t.loi)_v(e,n);for(const n of t.ponds)wv(e,n);t.holua&&yv(e,t.holua)}return e.freeze()}function _v(s,t){for(const e of t.paddies)s.outline(e.poly,.009+So);for(const e of t.auwai)s.line(e,.008+So)}function wv(s,t){s.line(t.wall,.05+So)}function yv(s,t){s.segment(t.x0,t.z0,t.x1,t.z1,.07+So)}function As(s,t,e,n,i,o,a,r,l,c,h=0){const u=Math.max(2,Math.ceil((a-o)/.012)),f=Math.max(2,Math.ceil((l-r)/.012));let d=1/0,v=-1/0,g=1/0;const x=(b,S)=>{const R=s(t+b*n-S*i,e+b*i+S*n);R<g&&(g=R);const k=(R>0?R:0)-h*b;k<d&&(d=k),k>v&&(v=k)};for(let b=0;b<u;b++){const S=o+(a-o)*b/u;x(S,r),x(a+o-S,l)}for(let b=0;b<f;b++){const S=r+(l-r)*b/f;x(a,S),x(o,l+r-S)}const p=(o+a)/2,m=(r+l)/2,M=t+p*n-m*i,_=e+p*i+m*n,E=(a-o)/2,y=(l-r)/2,w=Math.abs(n)*E+Math.abs(i)*y,A=Math.abs(i)*E+Math.abs(n)*y;for(let b=Math.ceil((_-A+ht)/Fi);b<=Math.floor((_+A+ht)/Fi);b++)for(let S=Math.ceil((M-w+ht)/Fi);S<=Math.floor((M+w+ht)/Fi);S++){const R=-ht+S*Fi-t,k=-ht+b*Fi-e,I=R*n+k*i,T=-R*i+k*n;I>=o&&I<=a&&T>=r&&T<=l&&x(I,T)}return c.lo=d,c.hi=v,c.wet=g,c.mid=Math.max(0,s(M,_)),c}function da(s,t,e,n,i,o,a,r,l,c){const h=(o+a)/2,u=(r+l)/2,f=(a-o)/2,d=(l-r)/2;let v=0;for(let g=0;g<24;g++){const x=g/24*Math.PI*2,p=Math.cos(x),m=Math.sin(x),M=Math.min(f/Math.max(1e-6,Math.abs(p)),d/Math.max(1e-6,Math.abs(m))),_=h+p*M,E=u+m*M,y=h+p*(M+c),w=u+m*(M+c),A=Math.max(0,s(t+_*n-E*i,e+_*i+E*n)),b=Math.max(0,s(t+y*n-w*i,e+y*i+w*n));v=Math.max(v,(A-b)/(c*100))}return v}function Uh(s,t,e,n,i,o,a,r=0){const l=n*o,c=i*o,h=-i*a,u=n*a,f=Math.max(0,s(t-l-h,e-c-u))+r,d=Math.max(0,s(t+l-h,e+c-u))-r,v=Math.max(0,s(t+l+h,e+c+u))-r,g=Math.max(0,s(t-l+h,e-c+u))+r,x=Math.max(0,s(t,e));return Math.max(f,d,v,g,x)-Math.min(f,d,v,g,x)}function uo(s,t,e,n,i,o,a){const r=Math.cos(e),l=Math.sin(e),c=(n+i)/2,h=(o+a)/2;return{x:s+c*r-h*l,z:t+c*l+h*r,c:r,s:l,hx:(i-n)/2,hz:(a-o)/2}}function bv(s,t,e){const n=t.x-s.x,i=t.z-s.z;if(Math.hypot(n,i)>Math.hypot(s.hx,s.hz)+Math.hypot(t.hx,t.hz)+e)return!1;const o=[s.c,s.s,-s.s,s.c,t.c,t.s,-t.s,t.c];for(let a=0;a<8;a+=2){const r=o[a],l=o[a+1],c=s.hx*Math.abs(s.c*r+s.s*l)+s.hz*Math.abs(-s.s*r+s.c*l),h=t.hx*Math.abs(t.c*r+t.s*l)+t.hz*Math.abs(-t.s*r+t.c*l);if(Math.abs(n*r+i*l)>c+h+e)return!1}return!0}class Sv{constructor(t,e){this.g=t,this.K=e,this.taken=[],this.cells=new Map,this.seen=[],this.query=0,this.steep=0,this.watered=!1,this.G={lo:0,hi:0,mid:0,wet:0},this.B={lo:0,hi:0,mid:0,wet:0},this.means=[0,0,0,0]}block(t,e,n,i,o){this.take({box:uo(t,e,n,-i,i,-o,o)})}take(t){const e=t.box,n=this.taken.length;this.taken.push(e),this.seen.push(0);const i=Math.abs(e.c)*e.hx+Math.abs(e.s)*e.hz,o=Math.abs(e.s)*e.hx+Math.abs(e.c)*e.hz;for(let a=De(e.z-o);a<=De(e.z+o);a++)for(let r=De(e.x-i);r<=De(e.x+i);r++){const l=this.cells.get(Qn(r,a));l?l.push(n):this.cells.set(Qn(r,a),[n])}return t}free(t){const e=++this.query,n=Math.abs(t.c)*t.hx+Math.abs(t.s)*t.hz+.02,i=Math.abs(t.s)*t.hx+Math.abs(t.c)*t.hz+.02;for(let o=De(t.z-i);o<=De(t.z+i);o++)for(let a=De(t.x-n);a<=De(t.x+n);a++){const r=this.cells.get(Qn(a,o));if(r){for(const l of r)if(this.seen[l]!==e&&(this.seen[l]=e,bv(this.taken[l],t,.02)))return!1}}return this.K.clear(t.x,t.z,t.c,t.s,t.hx,t.hz)}fit(t,e,n,i,o,a,r={}){if(t==="heiau"||t==="luakini")return this.heiau(t,e,n,i,o,a,r);if(t==="salt")return this.salt(e,n,i,r);const l=vs[t],c=this.g,h=Math.cos(i),u=Math.sin(i),f=l.reach*.94;let d=0;if(t==="halau"){const y=Math.max(0,c(e-h*o,n-u*o)),w=Math.max(0,c(e+h*o,n+u*o));d=Math.max(-Dh,Math.min(Dh,(w-y)*ge/(2*o)))}const v=d/ge*o,g=!!r.force;if(this.steep=Uh(c,e,n,h,u,o,a,v)/f,this.steep>1&&!g)return null;const x=uo(e,n,i,-o,o,-a,a);if(!g&&!this.free(x))return null;const p=As(c,e,n,h,u,-o,o,-a,a,this.G,v/o),m=p.lo,M=p.hi;if(!g&&(p.wet<l.dry||M-m>f)||!g&&l.skirt&&da(c,e,n,h,u,-o,o,-a,a,l.skirt)>ha)return null;let _,E;return t==="house"?(_=Math.max(p.mid*ge+r0*Wt,M*ge+cv*Wt),E=m*ge-Es*Wt):t==="ahu"?(_=Math.max(p.mid*ge,M*ge+.1*Wt),E=m*ge-Es*Wt):t==="koa"?(_=Math.max(p.mid*ge+.5*Wt,M*ge+.15*Wt),E=m*ge-Es*Wt):t==="halau"?(_=M*ge+.05*Wt,E=_-l.reach*ge-.05*Wt):(E=m*ge-Es*Wt,_=m*ge+.5*Wt),{kind:t,x:e,z:n,rot:i,hx:o,hz:a,top:_,base:E,lean:d,relief:M-m,wet:p.wet,box:x}}forced(t,e,n,i,o,a,r,l=.05,c=mv){const h=vs[t],u=Math.cos(i),f=Math.sin(i);for(let d=0;d<=r+1e-9;d+=l){const v=d?Math.max(8,Math.round(Math.PI*2*d/l)):1;let g=null;for(let x=0;x<v;x++){const p=(x+.5)/v*Math.PI*2,m=e+Math.cos(p)*d,M=n+Math.sin(p)*d,_=this.fit(t,m,M,i,o,a,{force:!0});_.relief>h.reach*c||g&&_.relief>=g.relief||_.wet<h.dry||da(this.g,m,M,u,f,-o,o,-a,a,h.skirt)>ha||!this.free(_.box)||(g=_)}if(g)return g}return null}heiau(t,e,n,i,o,a,r){const l=vs[t],c=this.g,h=Math.cos(i),u=Math.sin(i),f=l.reach*.94;if(Uh(c,e,n,h,u,o,a)>f||da(c,e,n,h,u,-o,o,-a,a,l.skirt)>ha)return null;const d=As(c,e,n,h,u,-o,o,-a,a,this.G);if(d.wet<l.dry||d.hi-d.lo>f)return null;const v=(r.rise??1.2)*Wt,g=Math.max(d.mid*ge+v,d.hi*ge+.3*Wt),x=[0,0,0,0],p=this.downhill(e,n,h,u,o,a),m=this.means,M=g/ge-Math.min(...m.filter((N,z)=>z!==p)),_=g-this.edgeLow(e,n,h,u,o,a,x,p)*ge,E=Math.min(fv,Math.max(0,Math.round(_/(hv*Wt))-1)),y=[],w=this.B;let A=g;for(let N=0;N<E;N++){const z=x[p],U=z+uv*Wt,L=p===0?-o-U:p===1?o+z:-o,W=p===0?-o-z:p===1?o+U:o,j=p===2?-a-U:p===3?a+z:-a,P=p===2?-a-z:p===3?a+U:a;As(c,e,n,h,u,L,W,j,P,w);const O=Math.max(g-_*(N+1)/(E+1),w.hi*ge+pv*Wt);if(O>A-dv*Wt)break;A=O,x[p]=U,y.push({top:A,ext:x.slice()})}const b=-o-x[0],S=o+x[1],R=-a-x[2],k=a+x[3],I=uo(e,n,i,b,S,R,k);if(!this.free(I))return null;const T=y.length?As(c,e,n,h,u,b,S,R,k,w):d;if(T.wet<l.dry||y.length&&da(c,e,n,h,u,b,S,R,k,l.skirt)>ha)return null;const C=T.lo*ge-Es*Wt,F=y.length?y[0].top-.15*Wt:C;for(let N=0;N<y.length;N++)y[N].bottom=N+1<y.length?y[N+1].top-.15*Wt:C;return{kind:t,x:e,z:n,rot:i,hx:o,hz:a,top:g,base:C,bottom:F,steps:y,main:p,wall:M,relief:d.hi-d.lo,box:I}}downhill(t,e,n,i,o,a){const r=this.g;let l=0,c=1/0;for(let h=0;h<4;h++){const u=h<2,f=h===0?-o:h===1?o:h===2?-a:a,d=u?a:o,v=Math.max(2,Math.ceil(2*d/.035));let g=0;for(let x=0;x<=v;x++){const p=-d+2*d*x/v,m=u?f:p,M=u?p:f;g+=Math.max(0,r(t+m*n-M*i,e+m*i+M*n))}this.means[h]=g/(v+1),this.means[h]<c&&(c=this.means[h],l=h)}return l}edgeLow(t,e,n,i,o,a,r,l){const c=this.g,h=l<2,u=l===0?-o-r[0]:l===1?o+r[1]:l===2?-a-r[2]:a+r[3],f=h?-a-r[2]:-o-r[0],d=h?a+r[3]:o+r[1],v=Math.max(2,Math.ceil((d-f)/.035));let g=1/0;for(let x=0;x<=v;x++){const p=f+(d-f)*x/v,m=h?u:p,M=h?p:u;g=Math.min(g,Math.max(0,c(t+m*n-M*i,e+m*i+M*n)))}return g}salt(t,e,n,i){const o=this.g,a=o(t,e);if(a<vs.salt.dry||a>4)return null;const r=Math.cos(n),l=Math.sin(n),c=uo(t,e,n,-i.hx,i.hx,-i.hz,i.hz);if(!this.free(c))return null;const h=[],u=this.G;for(const[f,d]of i.pans){const v=t+f*r-d*l,g=e+f*l+d*r;if(As(o,v,g,r,l,-i.ph,i.ph,-i.pv,i.pv,u),u.wet<vs.salt.dry||u.hi-u.lo>vs.salt.reach*.94)return null;h.push({x:v,z:g,top:Math.max(u.mid*ge+.2*Wt,u.hi*ge+.05*Wt),base:u.lo*ge-.25*Wt})}return{kind:"salt",x:t,z:e,rot:n,hx:i.hx,hz:i.hz,pans:h,box:c}}settle(t,e,n,i,o,a,r,l={}){const c=l.keep||(()=>!0);for(const u of i){if(!c(e,n))break;const f=this.fit(t,e,n,u,o,a,l);if(f)return f}const h=l.step||Math.max(.05,Math.min(o,a)*.8);for(let u=(l.from||0)+h;u<=r+1e-9;u+=h){const f=Math.max(8,Math.round(Math.PI*2*u/h));let d=null;for(let v=0;v<f;v++){const g=(v+.5)/f*Math.PI*2,x=e+Math.cos(g)*u,p=n+Math.sin(g)*u;if(c(x,p)){this.steep=0;for(const m of i){const M=this.fit(t,x,p,m,o,a,l);if(M&&(!d||M.relief<d.relief)&&(d=M),this.steep>1.6)break}}}if(d)return d}return null}}const Nr=(s,t)=>[(s+zh)*Wt/2,(t+zh)*Wt/2],Or=s=>{const t=Math.sin(s*127.1+311.7)*43758.5453;return t-Math.floor(t)};function Ev(s,t){const{data:e,meta:n}=s,i=(o,a)=>Hl(e.height,bn,o,a);return Av(new Sv(i,new c0),n.sites,n.ahu,()=>Mv(t,n.sites))}function Av(s,t,e,n){const i=[],o={moved:0,dropped:0},a=m=>[m,m+Math.PI/2],r=(m,M,_,E,y,w,A,b)=>{if(n){const R=s.fit(m,M,_,E[0],y,w,b);if(R)return R;s.watered||(s.K=n(),s.watered=!0)}const S=s.settle(m,M,_,E,y,w,A,b);return S&&(Math.abs(S.x-M)>1e-6||Math.abs(S.z-_)>1e-6)&&o.moved++,S},l=(m,M)=>{m.splice(m.indexOf(M),1),o.dropped++},c=[...t.heiau].sort((m,M)=>(M.model?1:0)-(m.model?1:0));for(const m of c){const M=m.kind==="luakini",_=M?Hi.big:Hi.small,[E,y]=yl(M),w=r(M?"luakini":"heiau",m.x,m.z,[m.rot,m.rot+.25,m.rot-.25],E,y,m.model?2.5:1.2,{rise:_.rise});if(!w){if(m.model){const A=s.take(Tv(s,m,_));m.court=A.top+(_.tiers-1)*_.rise*Wt,i.push(A)}else l(t.heiau,m);continue}m.x=w.x,m.z=w.z,m.rot=w.rot,m.court=w.top+(_.tiers-1)*_.rise*Wt,i.push(s.take({...w,big:M,dims:_,tag:`${m.kind} a${m.id}${m.model?" model":""}`}))}if(t.puuhonua){const m=t.puuhonua,M=Math.cos(m.dir),_=Math.sin(m.dir),E=m.x-M*1.6,y=m.z-_*1.6,w=k=>(I,T)=>(I-E)*M+(T-y)*_>k,A=Hi.small,[b,S]=yl(!1);if(m.heiau!==null){const k=m.heiau||{x:m.x-M*.5,z:m.z-_*.5,rot:m.dir},I=r("heiau",k.x,k.z,[k.rot,k.rot+.25,k.rot-.25],b,S,.9,{rise:A.rise,keep:w(.32)});m.heiau=I?{x:I.x,z:I.z,rot:I.rot,court:I.top+(A.tiers-1)*A.rise*Wt}:null,I&&i.push(s.take({...I,big:!1,dims:A,tag:"puuhonua"}))}const R=[];for(let k=0;k<3;k++){if(m.houses&&!m.houses[k])continue;const[I,T]=Nr(6,4),C=m.houses?m.houses[k]:{x:E+M*.5-_*(k-1)*.6,z:y+_*.5+M*(k-1)*.6,rot:m.dir+Math.PI/2},F=r("house",C.x,C.z,a(C.rot),I,T,.5,{keep:w(.15)});R.push(F?{x:F.x,z:F.z,rot:F.rot}:null),F&&i.push(s.take({...F,dims:[6,4,4.2],tag:"puuhonua"}))}m.houses=R}for(const m of t.canoes){if(!m.house)continue;const M=m.shed||{x:m.x-Math.cos(m.dir)*.32,z:m.z-Math.sin(m.dir)*.32,rot:m.dir},_=r("halau",M.x,M.z,[M.rot,M.rot+.3,M.rot-.3],8.2*Wt,3.3*Wt,.5);if(!_){m.house=!1,o.dropped++;continue}m.shed={x:_.x,z:_.z,rot:_.rot},i.push(s.take({..._,tag:`v${m.village}`}))}for(const m of t.ponds){if(m.keeper===null)continue;const M=m.gates[0]<.5?m.wall[0]:m.wall[m.wall.length-1],_=m.keeper||{x:M[0]-m.ax*.16,z:M[1]-m.az*.16,rot:Math.atan2(m.az,m.ax)+Math.PI/2},[E,y]=Nr(4,3),w=r("house",_.x,_.z,a(_.rot),E,y,.5);m.keeper=w?{x:w.x,z:w.z,rot:w.rot}:null,w&&i.push(s.take({...w,dims:[4,3,3.4],tag:"pond keeper"}))}for(const m of t.koa){const M=m.rot??Or(m.x*3.1+m.z)*6.28,_=r("koa",m.x,m.z,a(M),1.6*Wt,1.2*Wt,.8)||r("koa",m.x,m.z,a(M),1.6*Wt,1.2*Wt,1.6,{from:.8,step:.08})||s.fit("koa",m.x,m.z,M,1.6*Wt,1.2*Wt,{force:!0});m.x=_.x,m.z=_.z,m.rot=_.rot,i.push(s.take({..._,tag:`a${m.id}`}))}const h=[...t.houses].sort((m,M)=>(M.kind==="alii"?1:0)-(m.kind==="alii"?1:0)),u=new Map(t.villages.map(m=>[m.id,m])),f=new Map,d=[],v=(m,M)=>{const _=m.scale||1,[E,y,w]=Lh[m.kind]||Lh.noa,[A,b]=Nr(E*_,y*_),S=M&&u.get(m.village),R=S?Math.max(.9,Math.hypot(m.x-S.x,m.z-S.z))+.3:1/0,k=S?(T,C)=>Math.hypot(T-S.x,C-S.z)<=R:void 0,I=r("house",m.x,m.z,a(m.rot),A,b,.45,{keep:k})||r("house",m.x,m.z,a(m.rot),A,b,1.1,{from:.45,step:.08,keep:k});return I?(m.x=I.x,m.z=I.z,m.rot=I.rot,f.set(m.village,(f.get(m.village)||0)+1),i.push(s.take({...I,dims:[E*_,y*_,w*_],tag:`${m.kind} v${m.village}`})),!0):!1};for(const m of h)v(m,!0)||d.push(m);for(const m of d)((f.get(m.village)||0)>0||!v(m,!1))&&l(t.houses,m);for(const m of e){const M=m.rot??Or(m.x*3.1+m.z)*6.28,_=m.a===t.model||m.b===t.model;let E=null;if(!m.small&&!m.forced&&(E=r("ahu",m.x,m.z,[M],eo,eo,.25,{step:.05})),!E&&!m.small&&(m.forced||_)&&(E=s.forced("ahu",m.x,m.z,M,eo,eo,m.forced?0:.25,.05,1),E&&(m.forced=!0)),!E){m.small=!0;const y=eo*Fh;m.forced||(E=r("ahu",m.x,m.z,[M],y,y,.25,{step:.05})),E||(E=s.forced("ahu",m.x,m.z,M,y,y,m.forced?0:.8)||s.fit("ahu",m.x,m.z,M,y,y,{force:!0}),m.forced=!0)}m.x=E.x,m.z=E.z,m.rot=E.rot,i.push(s.take({...E,size:m.small?Fh:1,forced:!!m.forced,tag:`${m.a}|${m.b}`}))}for(const m of t.villages){if(m.imu===null)continue;const M=Or(m.id+.5)*Math.PI*2,_=m.imu||{x:m.x+Math.cos(M)*.35,z:m.z+Math.sin(M)*.35},E=r("imu",_.x,_.z,[0],1.3*Wt,1.3*Wt,.35);m.imu=E?{x:E.x,z:E.z}:null,E&&i.push(s.take({...E,tag:`v${m.id}`}))}const g=[];for(let m=0;m<4;m++)for(let M=0;M<3;M++)g.push([(m-1.5)*.11,(M-1)*.09]);const x={pans:g,ph:3.3*Wt,pv:2.7*Wt,hx:.165+.053,hz:.09+.043},p=(m,M)=>t.villages.every(_=>Math.hypot(_.x-m,_.z-M)>.6);for(const m of[...t.saltpans]){const M=r("salt",m.x,m.z,[m.dir+Math.PI/2],x.hx,x.hz,6,{...x,keep:p,step:.15});if(!M){l(t.saltpans,m);continue}m.x=M.x,m.z=M.z,i.push(s.take(M))}return{list:i,...o}}function Tv(s,t,e){const[n,i]=yl(!0),o=Math.cos(t.rot),a=Math.sin(t.rot),r=As(s.g,t.x,t.z,o,a,-n,n,-i,i,{lo:0,hi:0,mid:0,wet:0}),l=Math.max(r.mid*ge+e.rise*Wt,r.hi*ge+.3*Wt),c=r.lo*ge-Es*Wt;return{kind:"luakini",x:t.x,z:t.z,rot:t.rot,hx:n,hz:i,top:l,base:c,bottom:c,steps:[],relief:r.hi-r.lo,box:uo(t.x,t.z,t.rot,-n,n,-i,i),big:!0,dims:e,tag:"luakini model"}}function h0(s,t,e,n=1){let i=Float32Array.from(s),o=new Float32Array(t*t);const a=1/(2*e+1);for(let r=0;r<n;r++){for(let l=0;l<t;l++){const c=l*t;let h=0;for(let u=-e;u<=e;u++)h+=i[c+Math.min(t-1,Math.max(0,u))];for(let u=0;u<t;u++)o[c+u]=h*a,h+=i[c+Math.min(t-1,u+e+1)]-i[c+Math.max(0,u-e)]}for(let l=0;l<t;l++){let c=0;for(let h=-e;h<=e;h++)c+=o[Math.min(t-1,Math.max(0,h))*t+l];for(let h=0;h<t;h++)i[h*t+l]=c*a,c+=o[Math.min(t-1,h+e+1)*t+l]-o[Math.max(0,h-e)*t+l]}}return i}function Nh(s,t,e,n,i){let o=0;n[0]=0,i[0]=-1/0,i[1]=1/0;for(let a=1;a<t;a++){let r=(s[a]+a*a-(s[n[o]]+n[o]*n[o]))/(2*a-2*n[o]);for(;r<=i[o];)o--,r=(s[a]+a*a-(s[n[o]]+n[o]*n[o]))/(2*a-2*n[o]);o++,n[o]=a,i[o]=r,i[o+1]=1/0}o=0;for(let a=0;a<t;a++){for(;i[o+1]<a;)o++;const r=a-n[o];e[a]=r*r+s[n[o]]}}function bl(s,t){const n=new Float64Array(s*s);for(let c=0;c<s*s;c++)n[c]=t(c)?0:1e20;const i=new Float64Array(s),o=new Float64Array(s),a=new Int32Array(s),r=new Float64Array(s+1);for(let c=0;c<s;c++){for(let h=0;h<s;h++)i[h]=n[h*s+c];Nh(i,s,o,a,r);for(let h=0;h<s;h++)n[h*s+c]=o[h]}const l=new Float32Array(s*s);for(let c=0;c<s;c++){const h=c*s;for(let u=0;u<s;u++)i[u]=n[h+u];Nh(i,s,o,a,r);for(let u=0;u<s;u++)l[h+u]=Math.sqrt(o[u])}return l}const Cv=[{name:"Koʻolau",gloss:"windward",from:345,to:105},{name:"Puna",gloss:"the sunrise side",from:105,to:165},{name:"Kona",gloss:"leeward",from:165,to:255},{name:"Waialua",gloss:"the northwest side",from:255,to:345}],Oh=[{key:"akua",name:"Wao akua",gloss:"realm of the gods"},{key:"nahele",name:"Wao nahele",gloss:"the forest"},{key:"kanaka",name:"Wao kanaka",gloss:"realm of people"},{key:"kula",name:"Kula",gloss:"open dry plains"},{key:"kahakai",name:"Kahakai",gloss:"the shore"},{key:"kohola",name:"Kai kohola",gloss:"reef shallows"},{key:"uli",name:"Kai uli",gloss:"deep blue sea"}];function Rv(s,t,e=!1){for(let n=0;n<t;n++){if(s.length<3)return s;const i=e?[]:[s[0]],o=s.length,a=e?o:o-1;for(let r=0;r<a;r++){const l=s[r],c=s[(r+1)%o];i.push([l[0]*.75+c[0]*.25,l[1]*.75+c[1]*.25]),i.push([l[0]*.25+c[0]*.75,l[1]*.25+c[1]*.75])}e||i.push(s[o-1]),s=i}return s}function zo(s,t){const e=new Set,n=.2,i=(v,g)=>Math.floor(v/n)*100003+Math.floor(g/n),o=(v,g)=>{for(let x=-2;x<=2;x++)for(let p=-2;p<=2;p++)if(e.has(i(v+p*n,g+x*n)))return!0;return!1},a=v=>{for(let g=1;g<v.length;g++){const[x,p]=v[g-1],[m,M]=v[g],_=Math.ceil(Math.hypot(m-x,M-p)/(n*.5));for(let E=0;E<=_;E++)e.add(i(x+(m-x)*E/_,p+(M-p)*E/_))}},r=le,l=Vt/r,c=(v,g)=>{const x=Math.floor((v+ht)/l),p=Math.floor((g+ht)/l);let m=0;for(let M=Math.max(0,p-1);M<=Math.min(r-1,p+1);M++)for(let _=Math.max(0,x-1);_<=Math.min(r-1,x+1);_++)m=Math.max(m,t.area[M*r+_]);return m},h=t.height1024?(v,g)=>Lv(t.height1024,r,v,g):null,u=[],f=kv(u),d=s.streams.map((v,g)=>({s:v,k:g})).filter(({s:v})=>v.area>=.9&&v.pts.length>=3).sort((v,g)=>g.s.area-v.s.area);for(const{s:v,k:g}of d){let x=v.pts.length;for(let b=0;b<v.pts.length;b++)if(o(v.pts[b][0],v.pts[b][1])){x=b+1;break}if(x<3)continue;let p=v.pts.slice(0,x).map(b=>[b[0],b[1]]);const m=x<v.pts.length||!v.mouth?Pv(v.pts,x,p,u,f,h):null,M=p.length-(m?m.added:0);a(p),p=Rv(p,2);const _=new Float32Array(p.length),E=new Float32Array(p.length),y=m?4*(M-1):p.length;let w=0;for(let b=0;b<p.length;b++)b>0&&(_[b]=_[b-1]+Math.hypot(p[b][0]-p[b-1][0],p[b][1]-p[b-1][1])),b<y&&(w=Math.max(w,c(p[b][0],p[b][1]))),E[b]=w;const A={src:g,pts:p,along:_,area:E,lineA:v.area};m&&(A.join={line:m.line,s:m.s}),u.push(A),f.add(u.length-1)}return u}function kv(s){const e=new Map,n=(i,o)=>i*100003+o;return{add(i){const{pts:o}=s[i];for(let a=1;a<o.length;a++){const r=Math.floor(Math.min(o[a-1][0],o[a][0])/.5),l=Math.floor(Math.max(o[a-1][0],o[a][0])/.5),c=Math.floor(Math.min(o[a-1][1],o[a][1])/.5),h=Math.floor(Math.max(o[a-1][1],o[a][1])/.5);for(let u=c;u<=h;u++)for(let f=r;f<=l;f++){const d=n(f,u);let v=e.get(d);v||e.set(d,v=[]),v.push(i,a-1)}}},nearest(i,o,a){let r=null;for(let l=Math.floor((o-a)/.5);l<=Math.floor((o+a)/.5);l++)for(let c=Math.floor((i-a)/.5);c<=Math.floor((i+a)/.5);c++){const h=e.get(n(c,l));if(h)for(let u=0;u<h.length;u+=2){const f=h[u],d=h[u+1],{pts:v,along:g}=s[f],x=v[d][0],p=v[d][1],m=v[d+1][0]-x,M=v[d+1][1]-p,_=m*m+M*M||1e-12,E=Math.max(0,Math.min(1,((i-x)*m+(o-p)*M)/_)),y=x+m*E,w=p+M*E,A=Math.hypot(y-i,w-o);A<=a&&(!r||A<r.d)&&(r={li:f,seg:d,t:E,d:A,x:y,z:w,s:g[d]+(g[d+1]-g[d])*E})}}return r}}}function Br(s,t){const{pts:e,along:n}=s;let i=0,o=e.length-1;for(t=Math.max(0,Math.min(n[o],t));o-i>1;){const h=i+o>>1;n[h]<=t?i=h:o=h}const a=(t-n[i])/(n[o]-n[i]||1),r=e[o][0]-e[i][0],l=e[o][1]-e[i][1],c=Math.hypot(r,l)||1;return{x:e[i][0]+r*a,z:e[i][1]+l*a,ux:r/c,uz:l/c}}function Pv(s,t,e,n,i,o){let a=e[e.length-1];const r=i.nearest(a[0],a[1],1);if(!r)return null;let l=n[r.li],c=l.along[l.along.length-1];const h=e[Math.max(0,e.length-3)];let u=a[0]-h[0],f=a[1]-h[1];const d=Math.hypot(u,f)||1;u/=d,f/=d;const{ux:v,uz:g}=Br(l,r.s);let x;if(r.d<1e-4)x=r.s;else{const y=(r.x-a[0])/r.d,w=(r.z-a[1])/r.d,A=u*y+f*w,b=A>.3?r.d/A*(u*v+f*g):r.d*1.2;x=r.s+Math.max(r.d*.4,Math.min(r.d*1.6,b))}if(x=Math.min(x,c),l.join&&x>c-.6){const{line:y,s:w}=l.join;r.li=y,l=n[y],c=l.along[l.along.length-1],x=Math.min(c,w+.1)}if(o){let y=1/0;for(const k of e)y=Math.min(y,o(k[0],k[1]));const w=s[s.length-1],A=i.nearest(w[0],w[1],.6),b=Math.min(c,x+4,Math.max(x,A&&A.li===r.li?A.s+.3:x));let S=x,R=1/0;for(let k=x;k<=b+1e-6;k+=.05){const I=Br(l,k),T=o(I.x,I.z);if(T<R&&(R=T,S=k),T<=y+.5)break}x=S}let p=0;for(let y=t;y<s.length-1;y++){const w=i.nearest(s[y][0],s[y][1],1);if(!w||w.li!==r.li||w.d<.15||w.s+Math.max(.3,w.d*1.6)>=x)break;e.push([s[y][0],s[y][1]]),p++}a=e[e.length-1];const m=Br(l,x),M=e[Math.max(0,e.length-3)];u=a[0]-M[0],f=a[1]-M[1];const _=Math.hypot(u,f)||1;u/=_,f/=_;const E=Math.hypot(m.x-a[0],m.z-a[1]);if(E>1e-4){const y=(m.x-a[0])/E,w=(m.z-a[1])/E;if(u*y+f*w<.3){u=u*.3+y,f=f*.3+w;const F=Math.hypot(u,f);u/=F,f/=F}let A=y+m.ux,b=w+m.uz;const S=Math.hypot(A,b)||1;A/=S,b/=S;const R=a[0]+u*E*.35,k=a[1]+f*E*.35,I=m.x-A*E*.35,T=m.z-b*E*.35,C=Math.max(1,Math.ceil(E/.15));for(let F=1;F<C;F++){const N=F/C,z=1-N;e.push([z*z*z*a[0]+3*z*z*N*R+3*z*N*N*I+N*N*N*m.x,z*z*z*a[1]+3*z*z*N*k+3*z*N*N*T+N*N*N*m.z]),p++}}return E>1e-4?(e.push([m.x,m.z]),p++):e[e.length-1]=[m.x,m.z],{line:r.li,s:x,added:p}}function Lv(s,t,e,n){let i=(e+ht)/Vt*t-.5,o=(n+ht)/Vt*t-.5;i<0?i=0:i>t-1.001&&(i=t-1.001),o<0?o=0:o>t-1.001&&(o=t-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=r*t+a,u=s[h]+(s[h+1]-s[h])*l,f=s[h+t]+(s[h+t+1]-s[h+t])*l;return u+(f-u)*c}const zv=`
${Ze}
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
  // (never so far it reaches the eye, close up and nearly level with it)
  wp.xyz += toCam / max(dc, 1e-3) * min(lift, dc * 0.8);
  vFlow = aFlow;
  vSide = aSide;
  vFade = aFade;
  vTau = aTau;
  vJoin = aJoin.xyz;
  vec4 w = texture(uWeather, (wp.xz - uWeatherRect.xy) / uWeatherRect.zw);
  vWet = w.b; // the ground's memory of recent rain
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`,Dv=`
${Ze}
${ci}
${Tn}
${hi}
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
`;function Fv(s,t){let e=1;for(const n of s){if(t>n.h0&&t<n.h1)return 0;t<=n.h0&&n.r0>0&&(e=Math.min(e,1-Zn(((t-(n.h0-n.r0))/n.r0-.15)/.85))),t>=n.h1&&n.r1>0&&(e=Math.min(e,Zn((t-n.h1)/n.r1/.85)))}return e}const Zn=s=>s<=0?0:s>=1?1:s*s*(3-2*s);function Iv(s,t,e=[],n=0){const i=s.pts.length,o=s.along[i-1],a=m=>t.some(M=>m>M.h0+1e-6&&m<M.h1-1e-6),r=t.length?t.flatMap(m=>[m.h0-m.r0,m.h0-m.r0*.85,m.h0-m.r0*.45,m.h0,m.h1,m.h1+m.r1*.4,m.h1+m.r1*.85,m.h1+m.r1]).filter(m=>m>1e-6&&m<o-1e-6).sort((m,M)=>m-M):Uv,l=[],c=[];let h=0;for(let m=0;m<i;m++){const M=s.along[m];if(!(m>0&&m<i-1&&(M<=.008||M>=o-.008||Bh(r,M,.004)))){for(;h<r.length&&r[h]<M;h++)l.push(r[h]),c.push(-1);l.push(M),c.push(m)}}let u=l,f=c;if(e.length){u=[],f=[];let m=0;for(const M of e)if(!(M<=1e-6||M>=o-1e-6||Bh(l,M,n))){for(;m<l.length&&l[m]<M;m++)u.push(l[m]),f.push(c[m]);u.push(M),f.push(-1)}for(;m<l.length;m++)u.push(l[m]),f.push(c[m])}const d=[],v=[],g=[],x=[];let p=-1/0;for(let m=0;m<u.length;m++){const M=u[m];if(M-p<1e-6)continue;p=M;const _=a(M);d.push(f[m]>=0?s.pts[f[m]]:Nv(s,M,[0,0])),v.push(M),g.push(_),x.push(_?0:Fv(t,M))}return{pts:d,along:v,gone:g,fade:x}}const Uv=[];function Bh(s,t,e){let n=0,i=s.length;for(;n<i;){const o=n+i>>1;s[o]<t?n=o+1:i=o}return n<s.length&&s[n]-t<e||n>0&&t-s[n-1]<e}function Hh(s,t,e,n,i){const o=Math.min(1,Math.max(0,(n-t[e])/(t[e+1]-t[e]||1)));return i[0]=s[e][0]+(s[e+1][0]-s[e][0])*o,i[1]=s[e][1]+(s[e+1][1]-s[e][1])*o,i}function Nv(s,t,e){const{pts:n,along:i}=s;let o=0,a=n.length-1;if(t<=0)o=a=0;else if(t>=i[a])o=a;else for(;a-o>1;){const l=o+a>>1;i[l]<=t?o=l:a=l}const r=a===o?0:(t-i[o])/(i[a]-i[o]);return e[0]=n[o][0]+(n[a][0]-n[o][0])*r,e[1]=n[o][1]+(n[a][1]-n[o][1])*r,e}const Gh=.11,Ov=.22,Wh=[-1,1];function Hr(s,t,e,n,i){const{pts:o,along:a}=s;let r=0,l=o.length-1;for(;l-r>1;){const f=r+l>>1;a[f]<=n?r=f:l=f}let c=1/0,h=0,u=0;for(let f=r;f<o.length-1&&a[f]<=i;f++){const d=o[f][0],v=o[f][1],g=o[f+1][0]-d,x=o[f+1][1]-v,p=g*g+x*x||1e-12,m=Math.min(1,Math.max(0,((t-d)*g+(e-v)*x)/p)),M=t-d-g*m,_=e-v-x*m,E=M*M+_*_;E<c&&(c=E,h=a[f]+(a[f+1]-a[f])*m,u=(g*_-x*M)/Math.sqrt(p))}return{d:Math.sqrt(c),s:h,u}}function Gr(s,t){const{s:e}=s,n=e.length-1;if(n<0||t<e[0]-.05||t>e[n]+.05)return null;let i=0,o=n;if(t<=e[0])o=0;else if(t>=e[n])i=n;else{for(;o-i>1;){const l=i+o>>1;e[l]<=t?i=l:o=l}if(!s.joined[o])return null}const a=o===i?0:(t-e[i])/(e[o]-e[i]),r=l=>l[i]+(l[o]-l[i])*a;return{y:r(s.y),hm:r(s.hm),w:r(s.w),steep:r(s.steep),fade:r(s.fade),y0:r(s.y0),y1:r(s.y1)}}const Vh=s=>Math.min(.11,.009*Math.sqrt(s)+.012),qh=.03,Xh=.3;class ki{constructor(t,e){this.a=new t(Math.ceil(e)),this.n=0}room(t){if(this.n+t<=this.a.length)return;const e=new this.a.constructor(Math.max(this.a.length*2,this.n+t));e.set(this.a),this.a=e}push1(t){this.room(1),this.a[this.n++]=t}push3(t,e,n){this.room(3);const i=this.a;i[this.n]=t,i[this.n+1]=e,i[this.n+2]=n,this.n+=3}push4(t,e,n,i){this.room(4);const o=this.a;o[this.n]=t,o[this.n+1]=e,o[this.n+2]=n,o[this.n+3]=i,this.n+=4}done(){return this.a.slice(0,this.n)}}class Bv{constructor(t){var S,R,k,I;const e=t.island.meta,n=t.terrain,i=((S=t.wailele)==null?void 0:S.lines)||zo(e,t.island.data);let o=64;for(const T of i)o+=T.pts.length*2.4;const a=new ki(Float32Array,o*3),r=new ki(Float32Array,o*3),l=new ki(Float32Array,o),c=new ki(Float32Array,o),h=new ki(Float32Array,o),u=new ki(Float32Array,o*4),f=[],d=new ki(Uint32Array,o*3);let v=0;const g=(R=t.wailele)==null?void 0:R.cuts;this.cutTris=0;const x=[],p=[];for(const T of i)T.join&&(p[k=T.join.line]||(p[k]=[])).push(T.join.s);const m=[0,0],M=[0,0],_=[0,0],E=[0,0],y=[0,0],w=[0,0],A=[0,0];for(let T=0;T<i.length;T++){const C=i[T],F=(g==null?void 0:g.get(T))||[],N=C.along[C.along.length-1],z=C.join&&x[C.join.line],U=z&&i[C.join.line],L=[];let W=0,j=0,P=0,O=0;if(z){const pt=C.pts[C.pts.length-1],bt=Gr(z,C.join.s);W=bt&&bt.fade>.02&&bt.hm>n.metresAt(pt[0],pt[1])-2?1:2,P=bt?bt.w:Vh(U.lineA),j=Math.min(N,W===1?5*P+.04:2*P+.04);const ee=Math.min(.05,Math.max(.02,P*.8));for(let fe=N-j;fe<N-ee*.5;fe+=ee)L.push(fe);O=Math.max(.008,ee*.4)}const G=C.join?C.join.s-j-.1:0,K=C.join?C.join.s+.15:0,{pts:Q,along:ot,gone:$,fade:Y}=Iv(C,F,L,O);let rt=99;if(W===1){const pt=ot.findIndex(bt=>bt>=N-j-1e-6);pt>=0&&Hr(U,Q[pt][0],Q[pt][1],G,K).u<0&&(rt=-99)}const X=C.lineA,Mt=Math.min(1,Math.max(0,(Math.log10(X)-.35)/.9)),mt=Vh(X),_t=F.map(pt=>pt.h1),xt=F.some(pt=>pt.h0-pt.r0<Xh)?0:Xh,kt=(I=p[T])==null?void 0:I.sort((pt,bt)=>pt-bt),at=kt&&{s:[],y:[],hm:[],w:[],steep:[],fade:[],joined:[],y0:[],y1:[],per:Mt};at&&(x[T]=at);let B=0,D=-2,J=1/0,ut=-1,ct=!1,ft=1/0,Rt=1/0;const vt=[1/0,1/0];let gt=0,Ct=0,Lt=Gh;const dt=C.along,se=C.pts,Xt=se.length-1;let Bt=0,zt=0;for(let pt=0;pt<Q.length;pt++){const bt=ot[pt],ee=Math.max(0,bt-qh),fe=Math.min(N,bt+qh);for(;Bt<Xt-1&&dt[Bt+1]<ee;)Bt++;for(;zt<Xt-1&&dt[zt+1]<fe;)zt++;Hh(se,dt,Bt,ee,m),Hh(se,dt,zt,fe,M);const Yt=M[0]-m[0],wt=M[1]-m[1],Z=Math.hypot(Yt,wt)||1,St=-wt/Z,Et=Yt/Z,Ut=Q[pt][0],Dt=Q[pt][1];let ne=n.metresAt(Ut,Dt);if(ne<-.5)break;if($[pt]){ct=!1,ft=Rt=vt[0]=vt[1]=1/0;continue}for(const Nt of F)Nt.level!==void 0&&Math.abs(bt-Nt.h1)<1e-6&&(J=Nt.level,ut=Nt.h1+1);bt<=ut&&(ne=Math.min(ne,J),J=ne),ne=ft=Math.min(ne,ft);const ce=Q[Math.min(Q.length-1,pt+2)],Le=(ne-n.metresAt(ce[0],ce[1]))/Math.max(10,Math.hypot(ce[0]-Ut,ce[1]-Dt)*100);let we=Math.min(1,Math.max(0,(Le-.08)/.5));for(const Nt of _t)bt>Nt-1e-6&&bt<=Nt+.4&&(we=Math.max(we,1-(bt-Nt)/.4));let oe=null,Ie=0,We=1,$i=1,Cn=null;if(W&&bt>=N-j-1e-6)if(Cn=Hr(U,Ut,Dt,G,K),W===1){oe=Gr(z,Cn.s);const Nt=oe?oe.w:P;Ie=1-Zn((Cn.d/Nt-1)/1.5),We=Zn(Cn.d/Nt/1.2),oe&&(we+=(oe.steep-we)*Ie)}else $i=Zn((Cn.d/P-.3)/1.5),We=.3+.7*$i;const Ki=xt?Zn(bt/xt):1,Zi=mt*(1+we*.4)*We*(.25+.75*Ki),Ji=Zn(We/.3);if(kt)for(;B<kt.length&&kt[B]+.35<bt;)B++;const qs=kt&&B<kt.length&&kt[B]-1.1<=bt;let Nn=Math.max(ne,0)*qt+.012+we*.03;oe&&(Nn+=Math.min(0,oe.y-Nn)*Ie),Nn=Rt=Math.min(Rt,Nn);const Do=Gh+Ov*we;gt+=(bt-Ct)/((Do+Lt)/2),Ct=bt,Lt=Do;for(let Nt=0;Nt<2;Nt++){const H=Wh[Nt],tt=Ut+St*Zi*H,it=Dt+Et*Zi*H;let nt=Math.max(0,Fn(n,tt,it))+.003;F.length&&(nt=Math.min(nt,Nn+.04));let et=rt,At=0;if(Cn&&W===1){const Pt=Hr(U,tt,it,Cn.s-.2,Cn.s+.2),Ft=Gr(z,Pt.s);if(et=Pt.u/(Ft?Ft.w:P),Ft){At=Ft.fade;const Ht=Math.min(1,Math.max(0,.5+.5*et));nt+=Math.max(0,Ft.y0+(Ft.y1-Ft.y0)*Ht-nt)*(1-Zn((Math.abs(et)-1)/.3))}}_[Nt]=tt,E[Nt]=it,y[Nt]=Math.max(Nn,Math.min(nt,vt[Nt])),w[Nt]=et,A[Nt]=At}if(We<1){const Nt=y[0]>y[1]?0:1;y[Nt]=y[1-Nt]+(y[Nt]-y[1-Nt])*We}const Qa=Y[pt]*$i*Ji*(xt?Zn(bt/(xt*.3)):1);for(let Nt=0;Nt<2;Nt++)vt[Nt]=y[Nt],qs&&at[Nt?"y1":"y0"].push(y[Nt]),a.push3(_[Nt],y[Nt],E[Nt]),r.push3(bt,Mt,we),l.push1(Wh[Nt]),c.push1(Qa),h.push1(gt),u.push4(w[Nt],W===1?z.per:0,A[Nt],0);if(qs&&(at.s.push(bt),at.y.push(Nn),at.hm.push(ne),at.w.push(Zi),at.steep.push(we),at.fade.push(Y[pt]),at.joined.push(ct&&D===pt-1),D=pt),ct){d.push3(v-2,v-1,v),d.push3(v-1,v+1,v);const Nt=ot[pt-1];F.some(({h0:H,h1:tt})=>Nt>H+1e-6&&Nt<tt-1e-6||bt>H+1e-6&&bt<tt-1e-6||Nt<H-1e-6&&bt>tt+1e-6)&&(this.cutTris+=2)}if(Cn&&W===1){const Nt=(nt,et,At)=>Math.max(0,Fn(n,nt,et)-At),H=a.a,tt=(H[v*3+1]+H[v*3+4])/2;let it=Math.max(Nt(Ut,Dt,tt),Nt(H[v*3],H[v*3+2],H[v*3+1]),Nt(H[v*3+3],H[v*3+5],H[v*3+4]));if(ct&&f.length&&f[f.length-2]===v-2){const nt=(v-2)*3,et=Nt((H[nt]+H[nt+3]+Ut*2)/4,(H[nt+2]+H[nt+5]+Dt*2)/4,(H[nt+1]+H[nt+4]+tt*2)/4);it=Math.max(it,et),f[f.length-1]=Math.max(f[f.length-1],et)}f.push(v,it)}ct=!0,v+=2}for(let pt=0;pt<f.length;pt+=2){let bt=f[pt+1];pt>=2&&f[pt-2]===f[pt]-2&&(bt=Math.max(bt,f[pt-1])),pt+2<f.length&&f[pt+2]===f[pt]+2&&(bt=Math.max(bt,f[pt+3])),u.a[f[pt]*4+3]=u.a[f[pt]*4+7]=Math.min(bt,4*qt)}f.length=0}const b=new Fe;b.setAttribute("position",new he(a.done(),3)),b.setAttribute("aFlow",new he(r.done(),3)),b.setAttribute("aSide",new he(l.done(),1)),b.setAttribute("aFade",new he(c.done(),1)),b.setAttribute("aTau",new he(h.done(),1)),b.setAttribute("aJoin",new he(u.done(),4)),b.setIndex(new he(v<=65536?Uint16Array.from(d.a.subarray(0,d.n)):d.done(),1)),b.computeBoundingSphere(),this.uniforms={...t.shared.uniforms,uFlowAll:{value:0}},this.material=new Ce({vertexShader:zv,fragmentShader:Dv,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:ln,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new ue(b,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=2,this.app=t}update(){const t=this.app.weather,e=Math.min(1,t.rainTotal/600),n=this.app.time,i=this.lastTime===void 0?1:1-Math.exp(-Math.max(0,n-this.lastTime)/3);this.lastTime=n,this.uniforms.uFlowAll.value+=(e-this.uniforms.uFlowAll.value)*i;const o=this.app.camera.position;this.mesh.visible=o.y-Math.max(0,this.app.terrain.heightAt(o.x,o.z))<90}}const lt=.016,V={plain:0,thatch:1,stone:2,leaf:3,water:4,kapa:5,wood:6,skin:7,sand:8};for(let s=0;s<9;s++)V["accent"+s]=9+s;class te{constructor(){this.pos=[],this.nor=[],this.col=[],this.mat=[],this.xf=null,this.stack=[]}at(t,e,n,i=0,o=lt){this.stack.push(this.xf);const a=Math.cos(i),r=Math.sin(i);return this.xf=l=>[t+(l[0]*a-l[2]*r)*o,e+l[1]*o,n+(l[0]*r+l[2]*a)*o],this}done(){return this.xf=this.stack.pop()||null,this}get count(){return this.pos.length/3}tri(t,e,n,i,o=0,a=!0){this.xf&&(t=this.xf(t),e=this.xf(e),n=this.xf(n));const r=e[0]-t[0],l=e[1]-t[1],c=e[2]-t[2],h=n[0]-t[0],u=n[1]-t[1],f=n[2]-t[2];let d=l*f-c*u,v=c*h-r*f,g=r*u-l*h;const x=Math.hypot(d,v,g)||1;d/=x,v/=x,g/=x;for(const p of[t,e,n])this.pos.push(p[0],p[1],p[2]),this.nor.push(d,v,g),this.col.push(i[0],i[1],i[2]),this.mat.push(o)}quad(t,e,n,i,o,a=0){this.tri(t,e,n,o,a),this.tri(t,n,i,o,a)}hexa(t,e,n,i=0){this.quad(e[0],e[3],e[2],e[1],n,i),this.quad(t[0],t[1],t[2],t[3],n,i);for(let o=0;o<4;o++)this.quad(t[o],e[o],e[(o+1)%4],t[(o+1)%4],n,i)}box(t,e,n,i,o,a,r,l=0,c=0,h=1){const u=Math.cos(c),f=Math.sin(c),d=(_,E,y)=>[t+_*u-y*f,e+E,n+_*f+y*u],v=i/2,g=a/2,x=v*h,p=g*h,m=[d(-v,0,-g),d(v,0,-g),d(v,0,g),d(-v,0,g)],M=[d(-x,o,-p),d(x,o,-p),d(x,o,p),d(-x,o,p)];o<0?this.hexa(M,m,r,l):this.hexa(m,M,r,l)}cyl(t,e,n,i,o,a=0,r=6,l=!1){const c=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],h=Math.hypot(...c)||1,u=c.map(p=>p/h),f=Math.abs(u[1])<.9?[0,1,0]:[1,0,0];let d=[u[1]*f[2]-u[2]*f[1],u[2]*f[0]-u[0]*f[2],u[0]*f[1]-u[1]*f[0]];const v=Math.hypot(...d);d=d.map(p=>p/v);const g=[u[1]*d[2]-u[2]*d[1],u[2]*d[0]-u[0]*d[2],u[0]*d[1]-u[1]*d[0]],x=(p,m,M)=>{const _=M/r*Math.PI*2,E=Math.cos(_)*m,y=Math.sin(_)*m;return[p[0]+d[0]*E+g[0]*y,p[1]+d[1]*E+g[1]*y,p[2]+d[2]*E+g[2]*y]};for(let p=0;p<r;p++){const m=x(t,n,p),M=x(t,n,p+1),_=x(e,i,p),E=x(e,i,p+1);this.quad(m,M,E,_,o,a),l&&this.tri(e,_,E,o,a)}}blob(t,e,n,i,o,a,r,l=0,c=0,h=l===V.leaf,u=1){const f=(1+Math.sqrt(5))/2,d=[[-1,f,0],[1,f,0],[-1,-f,0],[1,-f,0],[0,-1,f],[0,1,f],[0,-1,-f],[0,1,-f],[f,0,-1],[f,0,1],[-f,0,-1],[-f,0,1]],v=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],g=_=>.85+.3*Math.abs(Math.sin(_*12.9898+c*78.233)*43758.5453%1),x=d.map((_,E)=>{const y=Math.hypot(..._),w=g(E);return[t+_[0]/y*i*w,e+_[1]/y*o*w,n+_[2]/y*a*w]});if(!h){for(const _ of v)this.tri(x[_[0]],x[_[1]],x[_[2]],r,l);return}const p=(_,E)=>{const y=[(_[0]+E[0])/2,(_[1]+E[1])/2,(_[2]+E[2])/2],w=[(y[0]-t)/i,(y[1]-e)/o,(y[2]-n)/a],A=Math.hypot(...w)||1,b=.9+.2*Math.abs(Math.sin(y[0]*91.7+y[2]*47.3+c)*43758.5453%1);return[t+w[0]/A*i*b,e+w[1]/A*o*b,n+w[2]/A*a*b]},m=_=>{const E=[(_[0]-t)/(i*i),(_[1]-e)/(o*o),(_[2]-n)/(a*a)],y=Math.hypot(...E)||1;return[E[0]/y,E[1]/y,E[2]/y]},M=(_,E,y)=>{const w=this.xf?[this.xf(_),this.xf(E),this.xf(y)]:[_,E,y],A=[m(_),m(E),m(y)];for(let b=0;b<3;b++)this.pos.push(...w[b]),this.nor.push(...A[b]),this.col.push(r[0],r[1],r[2]),this.mat.push(l)};if(u===0){for(const _ of v)M(x[_[0]],x[_[1]],x[_[2]]);return}for(const _ of v){const E=x[_[0]],y=x[_[1]],w=x[_[2]],A=p(E,y),b=p(y,w),S=p(w,E);M(E,A,S),M(A,y,b),M(S,b,w),M(A,b,S)}}wall(t,e,n,i,o=V.stone,a=.7){const r=t.length;if(r<2)return;const l=r>2&&Math.hypot(t[0][0]-t[r-1][0],t[0][2]-t[r-1][2])<1e-9,c=[];for(let g=0;g<r-1;g++){const x=t[g+1][0]-t[g][0],p=t[g+1][2]-t[g][2],m=Math.hypot(x,p)||1;c.push([-p/m,x/m])}const h=t.map((g,x)=>{let p=c[x-1],m=c[x];if(l&&x===0&&(p=c[r-2]),l&&x===r-1&&(m=c[0]),!p)return m;if(!m)return p;const M=p[0]+m[0],_=p[1]+m[1],E=Math.hypot(M,_);if(E<1e-6)return m;const y=1/Math.max(.35,(M*m[0]+_*m[1])/E);return[M/E*y,_/E*y]}),u=e/2,f=e*a/2,d=(g,x,p,m)=>[g[0]+x[0]*p,g[1]+m,g[2]+x[1]*p],v=g=>[d(t[g],h[g],-u,-n*.3),d(t[g],h[g],u,-n*.3),d(t[g],h[g],f,n),d(t[g],h[g],-f,n)];for(let g=0;g<r-1;g++){const[x,p,m,M]=v(g),[_,E,y,w]=v(g+1);this.quad(M,m,y,w,i,o),this.quad(p,E,y,m,i,o),this.quad(_,x,M,w,i,o)}if(!l){const[g,x,p,m]=v(0),[M,_,E,y]=v(r-1);this.quad(g,x,p,m,i,o),this.quad(_,M,y,E,i,o)}}geometry(){const t=new Fe;return t.setAttribute("position",new pe(this.pos,3)),t.setAttribute("normal",new pe(this.nor,3)),t.setAttribute("color",new pe(this.col,3)),t.setAttribute("aMat",new pe(this.mat,1)),t.computeBoundingSphere(),t}}function st(s,t=0,e=Math.random){const n=new It(s),i=1+(e()-.5)*t;return[n.r*i,n.g*i,n.b*i]}const Hv=`
${Ze}
in float aMat;
uniform float uTime;
uniform vec2 uWindVec;
uniform float uFadeNear;
uniform float uFadeFar;
uniform vec2 uFadeIn;
uniform float uFadeClose;
uniform float uSway;
uniform float uAccent[9];
uniform float uWoodTint;
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
  // (uWoodTint < 1 keeps bark nearer its own colour under a leaf tint: only
  // the tint's brightness reaches it, and only that share of it, so a hairy
  // grey-blue leaf tint never turns a trunk lilac)
  c *= aMat > 5.5 && aMat < 6.5 && uWoodTint < 1.0 ? mix(vec3(1.0), vec3(dot(instanceColor, vec3(0.299, 0.587, 0.114))), uWoodTint) : instanceColor;
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
    if ((aMat > 2.5 && aMat < 3.5) || aMat > 8.5) {
      // and the leaves flutter a few centimetres on their own
      float f = uTime * 5.0 + dot(p, vec3(1.7, 2.3, 1.1));
      wp.xyz += vec3(sin(f), 0.5 * sin(f * 1.3 + 1.0), cos(f * 0.9)) * (0.05 * min(h, 4.0) / 4.0) * scale * length(uWindVec) * uSway;
    }
  }
  if (aMat > 8.5) {
    // (after the sway, which bends by each vertex's own height and would pull
    // collapsed vertices apart into slivers). The hash is sin-free, so it
    // holds at island-sized coordinates on low-precision GPUs too.
    int g = int(aMat - 9.0 + 0.5);
    vec3 p3 = fract(origin.xzx * vec3(61.31, 47.77, 61.31) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    float hs = fract((p3.x + p3.y) * p3.z);
    // group 2 is the complement of group 3: a wiliwili is bare or in leaf
    // (and group 8, its flowers, only ever on a bare one)
    if (g == 2 || g == 8) hs = 1.0 - hs;
    if (hs >= uAccent[g]) wp.xyz = origin;
    // flowers keep their own colour: the instance tint is for leaf and bark
    c = color * (0.9 + 0.2 * fract(hs * 7.31));
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
`,Gv=`
${Ze}
${ci}
${Tn}
${hi}
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
  } else if (m == 3 || m >= 9) {
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
  if (m == 3 || m >= 9) lit += a * uSunColor * max(dot(-n, uSunDir), 0.0) * 0.25 * vis;
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
`;function ks(s,t={}){const[e,n]=t.fade||[120,160];return new Ce({vertexShader:Hv,fragmentShader:Gv,vertexColors:!0,side:t.doubleSide?ln:oi,uniforms:{...s.uniforms,uWindVec:s.uniforms.uWindVec||{value:new Ot(1,0)},uFadeNear:{value:e},uFadeFar:{value:n},uFadeClose:{value:t.close||0},uFadeIn:{value:new Ot(...t.fadeIn||[0,0])},uSway:{value:t.sway||0},uAccent:s.uniforms.uAccent||{value:new Float32Array(9)},uWoodTint:{value:t.woodTint??1},uObjDebug:{value:0}}})}const Re={thatch:"#b79560",thatchDark:"#8a6a3d",stone:"#6b625b",stoneDark:"#4f4844",wood:"#6b4a2f",koa:"#7a4a2a",kapa:"#efe8d8",salt:"#f2ece4"};function u0(s,t,e=7,n=4.6,i=5.2,o=!0,a=.6){const r=st(Re.thatch,.18,t),l=st(Re.thatchDark,.15,t),c=st(Re.stone,.15,t);s.box(0,-a,0,e+1.8,.45+a,n+1.8,c,V.stone);const h=.45,u=h+1.05;s.box(0,h,0,e,u-h,n,r,V.thatch);const f=e/2+.35,d=n/2+.45,v=h+i,g=[-f,u-.15,-d],x=[f,u-.15,-d],p=[-f,v,0],m=[f,v,0],M=[-f,u-.15,d],_=[f,u-.15,d];s.quad(g,p,m,x,r,V.thatch),s.quad(_,m,p,M,r,V.thatch),s.quad(x,m,p,g,l,V.thatch),s.quad(M,p,m,_,l,V.thatch);const E=e/2;if(s.tri([-E,u,-n/2],[-E,u,n/2],[-E,v-.2,0],r,V.thatch),s.tri([E,u,n/2],[E,u,-n/2],[E,v-.2,0],r,V.thatch),s.box(0,v-.12,0,e+.9,.35,.55,l,V.thatch),o){const y=[.05,.035,.025];s.quad([E+.02,h,-.45],[E+.02,h+1.4,-.45],[E+.02,h+1.4,.45],[E+.02,h,.45],y,0)}}function f0(s,t,e,n,i){const o=st(Re.wood,.25,i);s.cyl([t,0,e],[t,n*.62,e],.22,.18,o,V.wood,5),s.box(t,n*.6,e,.75,n*.28,.6,o,V.wood,i()*.3,.85),s.box(t,n*.86,e,.35,n*.16,.35,o,V.wood,0,.6)}function Wv(s,t,e,n,i){const o=st(Re.kapa,.05,i),a=st(Re.wood,.2,i);s.box(t,0,e,2.6,n,2.6,o,V.kapa,.1,.62);for(const[r,l]of[[-1.35,-1.35],[1.35,-1.35],[1.35,1.35],[-1.35,1.35]])s.cyl([t+r,0,e+l],[t+r*.55,n+.8,e+l*.55],.12,.08,a,V.wood,4)}function Vv(s,t,e,n){const i=st(Re.wood,.2,n);for(const[o,a]of[[-.9,-.6],[.9,-.6],[.9,.6],[-.9,.6]])s.cyl([t+o,0,e+a],[t+o,2.6,e+a],.09,.08,i,V.wood,4);s.box(t,2.5,e,2.2,.18,1.6,i,V.wood),s.blob(t,2.85,e,.5,.25,.4,st("#c9a35a",.2,n),V.plain,1)}function qv(s,t,e,n){const i=st(Re.stone,.12,e),o=st(Re.stoneDark,.12,e),a=t.big?Hi.big:Hi.small,{L:r,W:l,tiers:c,rise:h}=a,u=t.big,{x:f,z:d,rot:v}=t,g=t.top-h*n,x=A=>(A-g)/n;s.at(f,g,d,v,n);for(let A=t.steps.length-1;A>=0;A--){const b=t.steps[A],[S,R,k,I]=b.ext.map(C=>C/n),T=x(b.bottom);s.box((R-S)/2,T,(I-k)/2,r+S+R,x(b.top)-T,l+k+I,i,V.stone)}const p=x(t.bottom);s.box(0,p,0,r,h-p,l,i,V.stone);let m=h;for(let A=1;A<c;A++){const b=1-A*.14;s.box(0,m,0,r*b,h,l*b,A%2?o:i,V.stone),m+=h}const M=1-(c-1)*.14,_=r*M/2,E=l*M/2,y=u?2.2:1.5;s.box(0,m,-E+.8,r*M,y,1.6,o,V.stone),s.box(0,m,E-.8,r*M,y,1.6,o,V.stone),s.box(-_+.8,m,0,1.6,y,l*M,o,V.stone),s.done(),s.at(f,g+m*n,d,v,n),Wv(s,-_*.55,0,u?11:7.5,e);const w=u?7:4;for(let A=0;A<w;A++){const b=(A/(w-1)-.5)*1.6;f0(s,-_*.55+Math.cos(b)*(u?8:5),Math.sin(b)*(u?8:5),u?4.2:3.2,e)}return Vv(s,_*.15,0,e),s.done(),s.at(f+Math.cos(v)*_*.45*n-Math.sin(v)*E*.35*n,g+m*n,d+Math.sin(v)*_*.45*n+Math.cos(v)*E*.35*n,v,n),u0(s,e,u?8:6,u?5:4,u?6:4.5,!1),s.done(),m}function d0(s,t,e=8){const n=st(Re.koa,.2,t),i=st("#4a2c18",.2,t),o=e/2;s.box(0,0,0,e*.8,.55,.62,n,V.wood,0,.9),s.box(o*.85,.05,0,e*.2,.6,.4,i,V.wood,0,.5),s.box(-o*.85,.05,0,e*.2,.55,.4,i,V.wood,0,.5);const a=-2.4;for(const r of[-e*.15,e*.15])s.cyl([r,.55,0],[r,.5,a],.06,.06,i,V.wood,4);s.box(0,.05,a,e*.5,.28,.24,i,V.wood,0,.8)}function p0(s,t,e=18){const n=st(Re.koa,.15,t),i=st("#4a2c18",.15,t);for(const a of[-2.2,2.2])s.box(0,0,a,e*.82,1,1,n,V.wood,0,.88),s.box(e*.45,.2,a,e*.14,1.2,.6,i,V.wood,0,.5),s.box(-e*.45,.2,a,e*.14,1.1,.6,i,V.wood,0,.5);s.box(0,1,0,e*.42,.2,5.2,i,V.wood),s.box(-e*.08,1.2,0,3.2,1.4,2.4,st(Re.thatch,.1,t),V.thatch,0,.7);const o=st("#c9ac78",.08,t);s.cyl([e*.1,1.1,0],[e*.05,9.5,0],.12,.08,i,V.wood,4),s.quad([e*.12,1.4,.05],[e*.36,8.8,.05],[e*.02,10.8,.05],[e*.05,4,.05],o,V.plain),s.quad([e*.05,4,-.05],[e*.02,10.8,-.05],[e*.36,8.8,-.05],[e*.12,1.4,-.05],o,V.plain)}function Xv(s,t,e=16,n=6){const i=st(Re.thatch,.15,t),o=st(Re.thatchDark,.15,t),a=st(Re.wood,.2,t),r=4.8,l=e/2,c=n/2+.3;s.quad([-l,.3,-c],[-l,r,0],[l,r,0],[l,.3,-c],i,V.thatch),s.quad([l,.3,c],[l,r,0],[-l,r,0],[-l,.3,c],i,V.thatch),s.quad([l,.3,-c],[l,r,0],[-l,r,0],[-l,.3,-c],o,V.thatch),s.quad([-l,.3,c],[-l,r,0],[l,r,0],[l,.3,c],o,V.thatch),s.tri([-l,.3,c],[-l,.3,-c],[-l,r,0],o,V.thatch),s.tri([-l,.3,-c],[-l,.3,c],[-l,r,0],i,V.thatch),s.box(0,r-.1,0,e+.4,.3,.45,o,V.thatch),s.cyl([l,0,0],[l,r,0],.15,.12,a,V.wood,5)}function jv(s,t,e=!0,n=.3){const i=st(Re.stone,.2,t);s.box(0,-n,0,3.2,n+.1,3.2,i,V.stone,0,.92);for(let o=0;o<9;o++){const a=t()*Math.PI*2,r=1.4*(1-o/10);s.blob(Math.cos(a)*r*.5,o*.28,Math.sin(a)*r*.5,.75,.45,.7,i,V.stone,o+t())}if(s.box(0,2.3,0,1.6,.25,1.3,st("#5d5650",.1,t),V.stone),e){const o=st("#3b2a1e",.2,t);s.box(0,2.55,0,1,.75,.6,o,V.wood,0,.8),s.box(.65,2.7,0,.5,.35,.35,o,V.wood,0,.7),s.box(-.2,3.25,-.2,.15,.3,.12,o,V.wood),s.box(-.2,3.25,.2,.15,.3,.12,o,V.wood)}}function Yv(s,t,e=7){const n=st(Re.wood,.1,t),i=st(Re.kapa,.04,t);s.cyl([0,0,0],[0,e,0],.09,.07,n,V.wood,5),s.cyl([0,e*.82,-1.6],[0,e*.82,1.6],.06,.06,n,V.wood,4),s.quad([.02,e*.82,-1.5],[.02,e*.82,1.5],[.02,e*.3,1.3],[.02,e*.3,-1.3],i,V.kapa),s.quad([-.02,e*.3,-1.3],[-.02,e*.3,1.3],[-.02,e*.82,1.5],[-.02,e*.82,-1.5],i,V.kapa),s.box(0,e*.85,-1.55,.1,-1.6,.1,st("#e2b13c",.1,t),V.plain),s.box(0,e*.85,1.55,.1,-1.6,.1,st("#e2b13c",.1,t),V.plain),s.blob(0,e+.2,0,.35,.45,.35,st("#3d2c1f",.1,t),V.wood,2)}function $v(s,t,e=.3){const n=st(Re.stone,.2,t);s.box(0,-e,0,3.2,.5+e,2.4,n,V.stone,0,.85);for(let i=0;i<5;i++)s.blob((t()-.5)*1.4,.7+i*.25,(t()-.5)*1,.45,.3,.4,n,V.stone,i);s.blob(0,2,0,.45,.35,.45,st("#f3efe6",.05,t),V.kapa,3)}function Kv(s,t){const e=st("#4d4642",.2,t);for(let n=0;n<7;n++)s.blob((t()-.5)*1.6,0,(t()-.5)*1.6,.5,.35,.5,e,V.stone,n)}const jh=.009,Zv=`
${Ze}
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
`,Jv=`
${Ze}
${ci}
${Tn}
${hi}
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
`;class Qv{constructor(t,e,n){this.group=new En;const i=[],o=[],a=[],r=new te,l=st("#557d36",.15,Math.random),c=st("#6e6e42",.1,Math.random),h=.06,u=p=>new Ot(p[0],p[1]),f=[],d=[];for(const p of t.loi){for(const m of p.paddies){const M=(m.level+h)*qt,_=m.poly;for(const[I,T,C]of Nl.triangulateShape(_.map(u),[]))for(const F of[I,T,C])i.push(_[F][0],M,_[F][1]),o.push(m.age),a.push(m.flood);let E=m.level;const y=_.length;let w=0;for(let I=0;I<y;I++)w+=_[I][0]*_[(I+1)%y][1]-_[(I+1)%y][0]*_[I][1];const A=w>0?1:-1;for(let I=0;I<y;I++){const T=_[I],C=_[(I+1)%y],F=Math.hypot(C[0]-T[0],C[1]-T[1])||1,N=(C[1]-T[1])/F*A*.01,z=-(C[0]-T[0])/F*A*.01,U=Math.max(1,Math.ceil(F/.04));for(let L=0;L<U;L++){const W=T[0]+(C[0]-T[0])*L/U,j=T[1]+(C[1]-T[1])*L/U;E=Math.min(E,e.metresAt(W,j),e.metresAt(W+N,j+z),e.metresAt(W+2*N,j+2*z))}}const b=Math.max(E,m.level-8)-.25,R=(m.level+.35-b)/1.3,k=[..._,_[0]].map(I=>[I[0],(b+.3*R)*qt,I[1]]);r.wall(k,.009,R*qt,Math.random()<.8?l:c,V.plain,.6)}for(const m of p.auwai){let M=null;for(let _=0;_<m.length-1;_++){const[E,y]=m[_],[w,A]=m[_+1],b=Math.hypot(w-E,A-y);if(b<1e-6)continue;if(b>1.2){M=null;continue}const S=-(A-y)/b,R=(w-E)/b,k=Math.max(1,Math.ceil(b/.03));for(let I=_===0||!M?0:1;I<=k;I++){const T=E+(w-E)*I/k,C=y+(A-y)*I/k,F=[-1,1].map(N=>{const z=T+S*jh*N,U=C+R*jh*N;return[z,Math.max(0,Fn(e,z,U))+.002,U]});if(M)for(const[N,z]of[[M[0],-1],[M[1],1],[F[1],1],[M[0],-1],[F[1],1],[F[0],-1]])f.push(N[0],N[1],N[2]),d.push(z);M=F}}}}const v=new Fe;v.setAttribute("position",new pe(i,3)),v.setAttribute("aAge",new pe(o,1)),v.setAttribute("aFlood",new pe(a,1)),v.computeBoundingSphere();const g=p=>new Ce({vertexShader:Zv,fragmentShader:Jv,uniforms:{...n.uniforms},defines:p,side:ln,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2});this.material=g({}),this.paddies=new ue(v,this.material),this.group.add(this.paddies);const x=new Fe;x.setAttribute("position",new pe(f,3)),x.setAttribute("aSide",new pe(d,1)),x.computeBoundingSphere(),this.ditchMaterial=g({AUWAI:1}),this.ditches=new ue(x,this.ditchMaterial),this.group.add(this.ditches),this.banksGeometry=r.geometry()}}class tM{constructor(t){var u;const{terrain:e,shared:n}=t,i=t.island.meta,o=i.sites;this.app=t,this.meta=i,this.sites=o,this.group=new En;const a=wi(i.seed+77),r=new te,l=(f,d)=>Math.max(e.heightAt(f,d),0),c=((u=t.wailele)==null?void 0:u.lines)||zo(i,t.island.data),h=Ev(t.island,c).list;this.footings=h;for(const f of h)f.kind==="house"&&Ms(r,f,a);for(const f of h)f.kind==="imu"&&Ms(r,f,a);for(const f of h)(f.kind==="heiau"||f.kind==="luakini")&&Ms(r,f,a);this.beaches=[];for(const f of o.canoes){const d=f.dir,v=d+Math.PI/2;for(let g=0;g<f.n;g++){const x=(g-(f.n-1)/2)*.09,p=f.x+Math.cos(v)*x,m=f.z+Math.sin(v)*x;r.at(p,l(p,m)+.002,m,d),d0(r,a,7+a()*4),r.done()}this.beaches.push(f)}for(const f of h)f.kind==="halau"&&Ms(r,f,a);if(o.alii){const f=o.canoes.find(d=>d.village===o.alii.id);if(f){const d=f.dir+Math.PI/2,v=f.x+Math.cos(d)*.45,g=f.z+Math.sin(d)*.45;r.at(v,l(v,g)+.002,g,f.dir),p0(r,a),r.done()}}for(const f of h)(f.kind==="koa"||f.kind==="ahu")&&Ms(r,f,a);this.ponds=o.ponds,this.pondMask(t);for(const f of o.ponds)this.buildPond(r,f,a);o.puuhonua&&this.buildPuuhonua(r,o.puuhonua,a),o.holua&&this.buildHolua(r,o.holua,a);for(const f of h)f.kind==="salt"&&Ms(r,f,a);this.material=ks(n,{fade:[70,110]}),this.structures=new ue(r.geometry(),this.material),this.structures.frustumCulled=!1,this.group.add(this.structures),this.loi=new Qv(o,e,n),this.group.add(this.loi.group),this.banks=new ue(this.loi.banksGeometry,this.material),this.banks.frustumCulled=!1,this.group.add(this.banks)}pondMask(t){const e=le,n=t.seaData,i=Vt/e;for(const o of this.ponds){const a=o.wall,r=a.map(d=>d[0]),l=a.map(d=>d[1]),c=Math.max(0,Math.floor((Math.min(...r)+ht)/i)),h=Math.min(e-1,Math.ceil((Math.max(...r)+ht)/i)),u=Math.max(0,Math.floor((Math.min(...l)+ht)/i)),f=Math.min(e-1,Math.ceil((Math.max(...l)+ht)/i));for(let d=u;d<=f;d++)for(let v=c;v<=h;v++){const g=-ht+(v+.5)*i,x=-ht+(d+.5)*i;nM(a,g,x)&&(n[(d*e+v)*4]=255)}}t.seaTex.needsUpdate=!0}buildPond(t,e,n){const i=st("#8a817a",.12,n),o=e.wall,a=o.length,r=[0];for(let m=1;m<a;m++)r.push(r[m-1]+Math.hypot(o[m][0]-o[m-1][0],o[m][1]-o[m-1][1]));const l=r[a-1],c=m=>{const M=m*(a-1),_=Math.min(a-2,Math.floor(M));return r[_]+(r[_+1]-r[_])*(M-_)},h=m=>{let M=0;for(;M<a-2&&r[M+1]<m;)M++;const _=(m-r[M])/Math.max(1e-9,r[M+1]-r[M]);return[o[M][0]+(o[M+1][0]-o[M][0])*_,o[M][1]+(o[M+1][1]-o[M][1])*_]},u=.06,f=e.gates.map(m=>c(m)).map(m=>[Math.max(0,m-u/2),Math.min(l,m+u/2)]);let d=[];const v=()=>{d.length>1&&t.wall(d,.1,.024,i,V.stone,.72),d=[]},g=m=>d.push([m[0],0,m[1]]);let x=0;for(const[m,M]of f){for(let _=0;_<a;_++)r[_]>x&&r[_]<m&&g(o[_]);g(h(m)),v(),g(h(M)),x=M}for(let m=0;m<a;m++)r[m]>x&&g(o[m]);v();const p=st(Re.wood,.15,n);for(const[m,M]of f){const _=h(m),E=h(M),y=Math.atan2(E[1]-_[1],E[0]-_[0]),w=Math.hypot(E[0]-_[0],E[1]-_[1])/lt;t.at((_[0]+E[0])/2,0,(_[1]+E[1])/2,y);const A=Math.max(3,Math.round(w/.45));for(let b=0;b<=A;b++)t.box(-w/2+.06+(w-.12)*b/A,-.4,0,.12,1.9,.12,p,V.wood);t.box(0,1.25,0,w,.15,.2,p,V.wood),t.box(0,.45,0,w,.1,.16,p,V.wood),t.done()}}buildPuuhonua(t,e,n){const{terrain:i}=this.app,o=e.dir,a=Math.cos(o),r=Math.sin(o),l=-r,c=a,h=e.x-a*1.6,u=e.z-r*1.6,f=p=>{for(let m=.3;m<9;m+=.15)if(i.heightAt(h+l*m*p,u+c*m*p)<=.002)return m;return 4},d=f(-1),v=f(1),g=[];for(let p=-d;p<=v;p+=.12){const m=h+l*p,M=u+c*p;g.push([m,Math.max(0,i.heightAt(m,M)),M])}const x=st(Re.stoneDark,.1,n);t.wall(g,.08,.06,x,V.stone,.8);for(let p=0;p<6;p++){const m=(p-2.5)*.12,M=e.x+l*m-a*.05,_=e.z+c*m-r*.05;t.at(M,Math.max(0,Fn(i,M,_)),_,o),f0(t,0,0,4,n),t.done()}this.puuhonuaWall={a:g[0],b:g[g.length-1]}}buildHolua(t,e,n){const{terrain:i}=this.app,o=Math.hypot(e.x1-e.x0,e.z1-e.z0),a=Math.ceil(o/.08),r=o/a,l=(e.x1-e.x0)/o,c=(e.z1-e.z0)/o,h=(b,S)=>[e.x0+l*b-c*S,e.z0+c*b+l*S],u=(b,S)=>Math.max(i.heightAt(b,S),Fn(i,b,S)),f=.014,d=4,v=[];for(let b=0;b<=a*d;b++){const S=b/d*r;let R=i.heightAt(...h(S,0))+.018;for(let k=-.041;k<.042;k+=.0205)R=Math.max(R,u(...h(S,k))+.003);v.push(R-f)}const g=[];for(let b=0;b<=a;b++)g.push(i.heightAt(...h(b*r,0))+.004);const x=()=>{for(let b=0;b<8;b++){let S=!1;for(let R=0;R<=a*d;R++){const k=Math.min(a-1,Math.floor(R/d)),I=R/d-k,T=v[R]-(g[k]+(g[k+1]-g[k])*I);T>1e-6&&(S=!0,g[I<.5?k:k+1]+=T)}if(!S)break}};x();for(let b=0;b<2;b++){const S=g.slice();for(let R=1;R<a;R++)g[R]=(S[R-1]+2*S[R]+S[R+1])/4;x()}const p=g.map((b,S)=>{const[R,k]=h(S*r,0);return[R,b,k]}),m=st("#8a817a",.1,n),M=g.map((b,S)=>{const R=S*r,k=[];for(const N of[-1,1]){const z=.055+.6*Math.max(0,b-.0042-u(...h(R,N*.055)));let U=b-.0042;for(const j of[-.5,0,.5]){const[P,O]=h(R+j*r,N*z);U=Math.min(U,i.heightAt(P,O)-.006,Fn(i,P,O)-.006)}const[L,W]=h(R,N*z);k.push([L,U,W])}const[I,T]=h(R,.041),[C,F]=h(R,-.041);return k.push([I,b+f,T],[C,b+f,F]),k});for(let b=0;b<a;b++){const[S,R,k,I]=M[b],[T,C,F,N]=M[b+1];t.quad(I,k,F,N,m,V.stone),t.quad(R,C,F,k,m,V.stone),t.quad(T,S,I,N,m,V.stone)}t.quad(...M[0],m,V.stone);const[_,E,y,w]=M[a];t.quad(E,_,w,y,m,V.stone);const A=st("#c2b25e",.1,n);for(let b=0;b<p.length-1;b++){const S=p[b],R=p[b+1],k=R[0]-S[0],I=R[2]-S[2],T=Math.hypot(k,I)||1,C=-I/T*.034,F=k/T*.034,N=S[1]+.0145,z=R[1]+.0145;t.quad([S[0]-C,N,S[2]-F],[S[0]+C,N,S[2]+F],[R[0]+C,z,R[2]+F],[R[0]-C,z,R[2]-F],A,V.plain)}this.holuaPath=p}}function Ms(s,t,e){switch(t.kind){case"house":{const[n,i,o]=t.dims,a=t.top-r0*lt;s.at(t.x,a,t.z,t.rot),u0(s,e,n,i,o,!0,(a-t.base)/lt),s.done();break}case"imu":s.at(t.x,t.top-.5*lt,t.z,0),Kv(s,e),s.done();break;case"heiau":case"luakini":qv(s,t,e,lt);break;case"halau":s.at(t.x,t.top-.3*lt,t.z,t.rot),eM(s,t.lean),Xv(s,e),s.done();break;case"koa":s.at(t.x,t.top-.5*lt,t.z,t.rot),$v(s,e,(t.top-.5*lt-t.base)/lt),s.done();break;case"ahu":{const n=lt*(t.size||1);s.at(t.x,t.top,t.z,t.rot,n),jv(s,e,!0,(t.top-t.base)/n),s.done();break}case"salt":{const n=st(Re.salt,.06,e),i=st("#7d5b44",.12,e);for(const o of t.pans){const a=o.top-.2*lt;s.at(o.x,a,o.z,t.rot),s.box(0,(o.base-a)/lt,0,6.6,(o.top-o.base)/lt,5.4,i,V.plain),s.box(0,.05,0,5.8,.18,4.6,e()<.7?n:st("#d9c2b4",.05,e),V.kapa),s.done()}break}}}function eM(s,t){if(!t)return;const e=s.xf;s.xf=n=>{const i=e(n);return i[1]+=t*n[0]*lt,i}}function nM(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}function Fn(s,t,e){return Hl(s.heights,s.N,t,e)*qt}function fo(s,t,e){let n=!1;for(let i=0,o=s.length-1;i<s.length;o=i++){const a=s[i],r=s[o];a[1]>e!=r[1]>e&&t<(r[0]-a[0])*(e-a[1])/(r[1]-a[1])+a[0]&&(n=!n)}return n}const me=Math.PI*2,An=(s,t)=>[Math.cos(s)*Math.cos(t),Math.sin(t),Math.sin(s)*Math.cos(t)],Ve=(s,t,e)=>[s[0]+t[0]*e,s[1]+t[1]*e,s[2]+t[2]*e],Ba=(s,t)=>[s[0]*t,s[1]*t,s[2]*t],Sl="#5A643F",m0="#6E7752",El="#889066";function Gl(s,t,e,n,i,o,a){const r=[t,e+i,n],l=[t-i,e-i*.5,n-i*.6],c=[t+i,e-i*.5,n-i*.6],h=[t,e-i*.5,n+i];s.tri(r,c,l,o,a),s.tri(r,h,c,o,a),s.tri(r,l,h,o,a),s.tri(l,c,h,o,a)}function Un(s,t,e,n,i,o,a,r=.25){for(let l=0;l<n;l++){const c=e[Math.floor(t()*e.length)],h=t()*me,u=r+t()*(.95-r),f=Math.sqrt(1-u*u);Gl(s,c[0]+Math.cos(h)*f*c[3],c[1]+u*c[4],c[2]+Math.sin(h)*f*c[3],i*(.8+.4*t()),o(t()),a)}}function iM(s,t,e,n,i,o,a){s.quad(t,e,n,i,o,a),s.quad(t,i,n,e,o,a)}const vo=[[0,1,0]];for(let s=0;s<10;s++){const t=s*Math.PI/5,e=s%2?-1:1;vo.push([Math.cos(t)*.8944,e*.4472,Math.sin(t)*.8944])}vo.push([0,-1,0]);const g0=[];for(let s=0;s<5;s++){const t=1+2*s,e=t+1,n=1+(2*s+2)%10,i=1+(2*s+3)%10;g0.push([0,t,n],[t,e,n],[n,e,i],[11,e,i])}function Ka(s,t,e,n,i,o,a,r,l,c=0,h=.1,u=1,f=null){const d=vo.map((x,p)=>{const m=p===0||p===11?1:1-h+2*h*Math.abs(Math.sin(p*12.9898+c*78.233)*43758.5453%1);return[t+x[0]*i*m,e+x[1]*o*(p===0?.95+.1*Math.abs(Math.sin(c*3.7)):1),n+x[2]*a*m]});f!==null&&(d[11]=[t,f,n]);const v=vo.map((x,p)=>{const m=h>.1?[(d[p][0]-t)/(i*i),(d[p][1]-e)/(o*o),(d[p][2]-n)/(a*a)]:[x[0]/i,x[1]/o,x[2]/a],M=Math.hypot(...m);return[m[0]/M,m[1]/M,m[2]/M]}),g=vo.map(x=>{const p=u+(1-u)*Gt(-.8,.3,x[1]);return[r[0]*p,r[1]*p,r[2]*p]});for(const x of g0){const[p,m,M]=x.map(A=>d[A]),_=(m[1]-p[1])*(M[2]-p[2])-(m[2]-p[2])*(M[1]-p[1]),E=(m[2]-p[2])*(M[0]-p[0])-(m[0]-p[0])*(M[2]-p[2]),y=(m[0]-p[0])*(M[1]-p[1])-(m[1]-p[1])*(M[0]-p[0]),w=_*(p[0]+m[0]+M[0]-3*t)+E*(p[1]+m[1]+M[1]-3*e)+y*(p[2]+m[2]+M[2]-3*n)>0;for(const A of w?x:[x[0],x[2],x[1]])s.pos.push(d[A][0],d[A][1],d[A][2]),s.nor.push(v[A][0],v[A][1],v[A][2]),s.col.push(g[A][0],g[A][1],g[A][2]),s.mat.push(l)}}function On(s,{stick:t,r0:e=.4,r1:n=.25,bark:i="#6a6058",limbs:o=[],crowns:a}){const r=new te,l=st(i,.1,s);t&&r.cyl([0,0,0],t,e,n,l,V.wood,3);for(const[c,h,u,f]of o)r.cyl(c,h,u,f,l,V.wood,3);for(const[c,h,u,f,d,v,g=V.leaf,x=1,p=1,m=null]of a)Ka(r,c,h,u,f,d,f,typeof v=="string"?st(v,.1,s):v,g,x,.1,p,m);return r.geometry()}function Yh(s){const t=s.userData.tips,e=[];for(let n=0;n+1<t.length;n+=2)e.push([(t[n][0]+t[n+1][0])/2,(t[n][1]+t[n+1][1])/2,(t[n][2]+t[n+1][2])/2]);return e}function sM(s){const t=s.attributes.position.array,e=s.attributes.normal.array,n=s.attributes.color.array,i=s.attributes.aMat.array,o=new Map,a=[],r=[],l=[],c=[],h=[],u=new Float32Array(10),f=new Uint16Array(u.buffer);for(let v=0;v<i.length;v++){for(let p=0;p<3;p++)u[p]=t[v*3+p],u[3+p]=e[v*3+p],u[6+p]=n[v*3+p];u[9]=i[v];const g=String.fromCharCode.apply(null,f);let x=o.get(g);x===void 0&&(x=o.size,o.set(g,x),r.push(u[0],u[1],u[2]),l.push(u[3],u[4],u[5]),c.push(u[6],u[7],u[8]),h.push(u[9])),a.push(x)}const d=new Fe;return d.setAttribute("position",new pe(r,3)),d.setAttribute("normal",new pe(l,3)),d.setAttribute("color",new pe(c,3)),d.setAttribute("aMat",new pe(h,1)),d.setIndex(a),d.computeBoundingSphere(),d.userData=s.userData,d}function oM(s){const t=new te,e=st("#86817A",.12,s);for(let l=0;l<4;l++){const c=l*1.57+s()*.6;t.cyl([Math.cos(c)*1.1,0,Math.sin(c)*1.1],[Math.cos(c)*.25,1.5,Math.sin(c)*.25],.12,.17,e,V.wood,4)}const n=[.4,2.6,.1],i=[-.3,4.8,.3],o=[.1,6.2,0];t.cyl([0,1.2,0],n,.45,.4,e,V.wood,5),t.cyl(n,i,.4,.33,e,V.wood,5),t.cyl(i,o,.33,.28,e,V.wood,5);const a=[];for(let l=0;l<3;l++){const c=l/3*me+(s()-.5)*.9,h=.55+s()*.3,u=3.4+s(),f=Ve(o,An(c,h),u*.6);t.cyl(o,f,.22,.16,e,V.wood,4);for(const d of[-1,1]){const v=Ve(f,An(c+d*.55,h+(s()-.5)*.3),1.7+s()*.6);t.cyl(f,v,.14,.08,e,V.wood,3),a.push(v)}}const r=a.map(l=>[l[0],l[1]+.3+(s()-.5)*.8,l[2],1.8+s()*.6,1+s()*.3]);r.forEach((l,c)=>t.blob(l[0],l[1],l[2],l[3],l[4],l[3]*.9,st("#5C603F",.18,s),V.leaf,c+s()));for(const l of[1,4]){const c=r[l];t.blob(c[0],c[1]+c[4]*.55,c[2],c[3]*.6,c[4]*.35,c[3]*.55,st(s()<.6?"#9E3A2C":"#B8683A",.15,s),V.accent1,l,!0,0)}return Un(t,s,r,24,.17,l=>st(l<.7?"#C8323A":l<.95?"#E0552E":"#F0386A",.15,s),V.accent0),t.geometry()}function aM(s){const t=new te,e=l=>[l[0]+.176*l[1],l[1],l[2]],n=st("#6E6862",.12,s),i=[[[0,0,0],[.6,1.6,.2],[1.1,2.8,0]],[[0,0,0],[-.5,1.4,.4],[-1.2,2.4,.6]]];for(const l of i)t.cyl(e(l[0]),e(l[1]),.25,.18,n,V.wood,4),t.cyl(e(l[1]),e(l[2]),.18,.12,n,V.wood,4);const o=st("#5C6B3A",.15,s);for(const[l,c,h,u]of[[.33,.9,.11,.32],[.85,2.1,.12,.27],[-.45,1.3,.37,.3]])t.blob(...e([l,c,h]),u,u*.9,u,o,V.plain,l*7,!0,0);const a=[[2.1,.1],[-1.9,.8],[.1,-2.1],[.3,2.2],[.1,.2]].map(([l,c],h)=>{const u=h===4?2.4:2.75+s()*.5,f=h===4?1.1:.95+s()*.25,d=h===4?4.5:3.6+s()*.8,v=e([l,d-f,c]);return[v[0],v[1],v[2],u,f]});a.forEach((l,c)=>{c===4?Ka(t,l[0],l[1],l[2],l[3],l[4],l[3],st("#596537",.18,s),V.leaf,7+s(),.15):t.blob(l[0],l[1],l[2],l[3],l[4],l[3]*.92,st("#596537",.18,s),V.leaf,c*3+s(),!0,c===3?0:1)});const r=a[0];return t.blob(r[0],r[1]+r[4]*.55,r[2],r[3]*.6,r[4]*.35,r[3]*.55,st("#9E3A2C",.15,s),V.accent1,5,!0,0),Un(t,s,a,10,.16,l=>st(l<.75?"#C8323A":"#E0552E",.15,s),V.accent0,.4),t.geometry()}function $h(s,t,e,n,i,o,a,r){const l=Math.cos(e),c=Math.sin(e);let h=t,u=o(0);const f=i.length-1;for(let d=1;d<=f;d++){const v=d/f,[g,x]=i[d],p=[t[0]+l*g*n,t[1]+x,t[2]+c*g*n],m=o(v),M=a(v);s.quad(h,p,[p[0]-c*m,p[1]-.3*m,p[2]+l*m],[h[0]-c*u,h[1]-.3*u,h[2]+l*u],M,r),s.quad([h[0]+c*u,h[1]-.3*u,h[2]-l*u],[p[0]+c*m,p[1]-.3*m,p[2]-l*m],p,h,M,r),h=p,u=m}}function rM(s){const t=new te,e=st("#2A241E",.1,s),n=[.1,2.6,.05];t.cyl([0,0,0],n,.32,.22,e,V.wood,5),t.blob(0,.12,0,.5,.35,.5,e,V.wood,1),t.blob(n[0],n[1]+.05,n[2],.3,.3,.3,st("#B07A3A",.1,s),V.plain,2,!0,0);const i=[0,.25,.5,.75,1].map(h=>[h*.92,h<=1/3?.6*Math.sin(1.5*Math.PI*h):.6-Math.pow((h-1/3)/(2/3),2)]),o=h=>h<.4?.15+h:.55-(h-.4)*.75,a=st("#5E7A42",.1,s),r=st("#74904F",.1,s),l=st("#7C8E6C",.1,s);for(let h=0;h<10;h++){const u=h/10*me+(s()-.5)*.4,f=h%3===1&&h<9;$h(t,n,u,2.6*(.9+.2*s()),i,o,d=>d<.5?a:f?l:r,V.leaf)}const c=st("#6B5034",.12,s);for(let h=0;h<3;h++){const u=h/3*me+s();$h(t,[n[0],n[1]-.15,n[2]],u,1.6,[[0,0],[.18,-.75],[.34,-1.5]],f=>.18-f*.08,()=>c,V.leaf)}return t.geometry()}function lM(s){const t=new te,e=st("#5A504B",.15,s),n=[.5,2.2,.2],i=[.2,4,-.3];t.cyl([0,0,0],Ba(n,1.18),.7,.6,e,V.wood,5),t.cyl(n,i,.6,.5,e,V.wood,5);const o=[];for(let l=0;l<4;l++){const c=l/4*me+(s()-.5)*.7,h=.85+s()*.2,u=6.4+s()*1.2,f=[i[0],3.6+s()*.6,i[2]],d=An(c,h),v=Ve(f,d,u*.5),g=c+(s()-.5)*.7,x=An(g,h*.85),p=Ve(v,x,u*.5);t.cyl(f,Ve(v,d,.3),.4,.3,e,V.wood,3),t.cyl(v,Ve(p,x,.18),.3,.18,e,V.wood,3);for(const m of[-1,1]){const M=Ve(p,An(g+m*.5,1+s()*.3),2.4+s()*.6);t.cyl(p,M,.16,.08,e,V.wood,3),o.push(M)}}const a=[];o.forEach((l,c)=>{const h=c%4===1;for(let u=0;u<3;u++){const f=s()*me,d=u===0?.3:.9+s()*.5,v=(u===0?1.7:1.3)+s()*.4,g=[l[0]+Math.cos(f)*d,l[1]+.35+(s()-.5)*.6-(u?.25:0),l[2]+Math.sin(f)*d,v,v*(.55+s()*.08)];a.push(g),Ka(t,g[0],g[1],g[2],g[3],g[4],g[3]*(.8+.25*s()),st(h||s()<.1?"#737B5A":"#5E6A3C",.15,s),V.leaf,c*3+u+s())}}),Un(t,s,a,12,.18,()=>st("#E8DC7A",.1,s),V.accent6,.3);const r=t.geometry();return r.userData.tips=o,r}function cM(s,t,e,n,i,o,a){for(let r=t;r<s.pos.length/3;r++){const l=s.pos[r*3],c=s.pos[r*3+1],h=s.pos[r*3+2],u=Mo(Math.sin(l*12.99+c*78.23+h*37.71)*43758.5),f=.86+.28*Mo(u*7.13);s.pos[r*3]=e+(l-e)*f,s.pos[r*3+1]=n+(c-n)*f,s.pos[r*3+2]=i+(h-i)*f;const d=(a+(1-a)*Gt(-.8,.3,(c-n)/o))*(.78+.38*u);s.col[r*3]*=d,s.col[r*3+1]*=d,s.col[r*3+2]*=d}}function hM(s){const t=new te,e=st("#8E8A80",.1,s),n=[.3,4,.1];t.cyl([0,0,0],n,.45,.34,e,V.wood,5);const i=[],o=(c,h,u,f,d,v,g,x,p=!0)=>{i.push([c,h,u,f,d]);const m=t.pos.length/3;p?t.blob(c,h,u,f,d,f*(.85+.2*s()),st(v,.07,s),V.leaf,g+s(),!0,1):Ka(t,c,h,u,f,d,f*(.85+.2*s()),st(v,.07,s),V.leaf,g+s(),.15),cM(t,m,c,h,u,d,x)};o(.4,8.3+s()*.3,.2,2.25+s()*.3,1.35,El,9,.75);const a=s()*me;o(.3+Math.cos(a)*1.9,7.6+s()*.4,.1+Math.sin(a)*1.9,1.7,1,El,10,.7);const r=[];for(let c=0;c<4;c++){const h=c/4*me+(s()-.5)*.7,u=c===0?.12:.36+s()*.2,f=4.2+s()*1,d=[n[0]*(.8+.2*s()),3.6+s()*.6,n[2]],v=Ve(d,An(h,u),f*.55),g=Ve(v,An(h+(s()-.5)*.4,u-.2),f*.45);t.cyl(d,v,.24,.16,e,V.wood,3),t.cyl(v,g,.16,.08,e,V.wood,3);const x=1.75+s()*.3;o(g[0],g[1]+.4,g[2],x,x*(.56+.08*s()),c%2?m0:Sl,c,.62),r.push(v)}const l=[(r[1][0]+r[2][0])*.4,Math.max(r[1][1],r[2][1])+1.2,(r[1][2]+r[2][2])*.4];return o(l[0],l[1],l[2],1.8,1,Sl,13,.7,!1),Un(t,s,i,6,.17,()=>st("#E8E4CC",.08,s),V.accent6,.35),t.geometry()}function uM(s){const t=new te;t.cyl([0,0,0],[0,2.4,0],.35,.3,st("#8A7458",.1,s),V.wood,6);const e=[[0,6,0,2.45,3.5],[0,4.1,0,2.75,1.9],[0,8.7,0,1.45,1.7]].map(i=>[i[0]+(s()-.5)*.3,i[1],i[2]+(s()-.5)*.3,i[3],i[4]]),n=st("#3E5428",.08,s);e.forEach((i,o)=>t.blob(i[0],i[1],i[2],i[3],i[4],i[3]*.95,Ba(n,.94+.08*o),V.leaf,o+s(),!0,1));for(let i=0;i<12;i++){const o=s()*me,a=1.2+s()*(i<8?1:2.5),r=i<8?.36:.6+s()*.8;Gl(t,Math.cos(o)*r,a,Math.sin(o)*r,.16,st("#C8204E",.12,s),V.accent4)}return Un(t,s,e.slice(0,3),12,.07,()=>st("#B5122E",.1,s),V.accent5,-.4),t.geometry()}function fM(s){const t=new te,e=st("#7E7466",.12,s);for(let i=0;i<4;i++){const o=i/4*me+(s()-.5)*.8,a=3.5+s()*1.5,r=2.5+s()*2,l=[Math.cos(o+.3)*a*.45,r*.6,Math.sin(o+.3)*a*.45],c=[Math.cos(o)*a,r,Math.sin(o)*a];if(t.cyl([0,0,0],l,.22,.16,e,V.wood,3),t.cyl(l,c,.16,.1,e,V.wood,3),i%2===0){const h=5+s();t.cyl(c,[Math.cos(o-.2)*h,-.1,Math.sin(o-.2)*h],.1,.08,e,V.wood,3)}}const n=[];for(let i=0;i<6;i++){const o=i/6*me+s()*.6,a=i===0?.3:2.2+s()*1.3,r=2.2+s()*.6,l=.9+s()*.3;n.push([Math.cos(o)*a,3.5+s()*1.5-l,Math.sin(o)*a,r,l])}return n.forEach((i,o)=>t.blob(i[0],i[1],i[2],i[3],i[4],i[3]*.92,st("#6E8A3E",.15,s),V.leaf,o+s(),!0,o<4?1:0)),Un(t,s,n,12,.18,i=>st(i<.75?"#F2D53C":"#D9622E",.1,s),V.accent6,.4),t.geometry()}function dM(s){const t=new te,e=st("#857C6C",.1,s),n=5+Math.floor(s()*2);for(let d=0;d<n;d++){const v=d/n*me+s()*.4;t.cyl([Math.cos(v)*1.2,0,Math.sin(v)*1.2],[.06,1.3,0],.08,.11,e,V.wood,3)}const i=st("#8E8B82",.08,s),o=st("#77746B",.08,s);for(let d=0;d<4;d++){const v=d/4,g=(d+1)/4;t.cyl([.3*v,1+2.4*v,0],[.3*g,1+2.4*g,0],.22-.04*v,.22-.04*g,d%2?o:i,V.wood,5)}const a=[.3,3.4,0],r=s()*me,l=[];for(const d of[-1,1]){const v=.55+s()*.15,g=[Math.sin(v)*Math.cos(r)*d,Math.cos(v),Math.sin(v)*Math.sin(r)*d],x=Ve(a,g,1.9);t.cyl(a,x,.13,.11,i,V.wood,4);const p=Math.atan2(g[2],g[0]);for(const m of[-1,1]){const M=Ve(x,An(p+m*.6,.75+s()*.4),1.4+s()*.6);t.cyl(x,M,.1,.08,o,V.wood,4),l.push(M)}}const c=st("#5E7E43",.12,s),h=st("#6D914E",.12,s),u=st("#8A6E48",.12,s);l.forEach((d,v)=>{for(let g=0;g<10;g++){const x=g*2.4+s()*.3,p=g/9,m=1.8+s()*.4,M=Math.cos(x),_=Math.sin(x),E=.19,y=[d[0]+M*.9,d[1]+.75-.5*p,d[2]+_*.9],w=[d[0]+M*m*(.75+.15*p),d[1]-.1-1*p,d[2]+_*m*(.75+.15*p)],A=[y[0]-_*E,y[1]+.04,y[2]+M*E],b=[y[0]+_*E,y[1]+.04,y[2]-M*E];t.tri(d,y,A,c,V.leaf),t.tri(d,b,y,c,V.leaf),t.tri(A,y,w,h,V.leaf),t.tri(y,b,w,h,V.leaf)}for(let g=0;g<3;g++){const x=g/3*me+s(),p=Math.cos(x),m=Math.sin(x),M=[d[0]+p*.15,d[1]-.1,d[2]+m*.15],_=[d[0]+p*.4,d[1]-1.5,d[2]+m*.4];t.quad(M,_,[_[0]-m*.12,_[1],_[2]+p*.12],[M[0]-m*.12,M[1],M[2]+p*.12],u,V.leaf)}v<2&&t.blob(d[0],d[1]-.45,d[2],.3,.38,.3,st(s()<.7?"#E8A030":"#D8582A",.1,s),V.plain,v,!0,0)});const f=t.geometry();return f.userData.tips=l,f}function pM(s){const t=new te,e=st("#9C6C44",.1,s),n=st("#8E6448",.1,s),i=st("#7E6450",.12,s),o=[.3,1.6,.1],a=[0,2.6,.2];t.cyl([0,0,0],o,.45,.4,e,V.wood,5),t.cyl(o,a,.4,.35,e,V.wood,5);const r=[];for(let h=0;h<5;h++){const u=h/5*me+(s()-.5)*.6,f=[a[0],2.4+s()*.6,a[2]],d=Ve(f,An(u,.17+s()*.27),3.2+s()*1);t.cyl(f,d,.2,.06,n,V.wood,4),r.push([d,u]);for(const v of[0,1]){const g=u+(v?.6:-.6),x=Math.cos(g)*.9,p=Math.sin(g)*.9;iM(t,[d[0]-x*.2,d[1]-.1,d[2]-p*.2],[d[0]+x,d[1]-.05,d[2]+p],[d[0]+x*1.1,d[1]+.55,d[2]+p*1.1],[d[0],d[1]+.5,d[2]],i,V.wood)}}const l=[];for(let h=0;h<4;h++){const[u]=r[h],f=2.4+s()*.6;l.push([u[0]*.85,4.2+s(),u[2]*.85,f,.7+s()*.2])}l.forEach((h,u)=>t.blob(h[0],h[1],h[2],h[3],h[4],h[3]*.9,st("#788C4A",.15,s),V.accent3,u+s(),!0,u<2?1:0));for(let h=0;h<24;h++){const[u,f]=r[h%5],d=f+(s()-.5)*1.6,v=.3+s()*.9,g=s();Gl(t,u[0]+Math.cos(d)*v,u[1]+.2+s()*.45,u[2]+Math.sin(d)*v,.17,st(g<.9?"#E07A2E":g<.95?"#E8C83A":"#F09070",.12,s),V.accent8)}const c=t.geometry();return c.userData.ends=r.map(([h])=>h),c}function mM(s){const t=new te,e=st("#3E3A36",.1,s),n=[.2,2.8,.1];t.cyl([0,0,0],n,.25,.18,e,V.wood,5);for(let i=0;i<3;i++){const o=i/3*me+s();t.cyl([n[0],2.6,n[2]],Ve(n,An(o,.79),1.6),.13,.07,e,V.wood,4)}for(let i=0;i<4;i++){const o=i/4*me+s()*.8,a=i===3?.1:.9+s()*.3;t.blob(.2+Math.cos(o)*a,i===3?6.3:4.5+s()*1.2,.1+Math.sin(o)*a,1.6+s()*.4,1.3+s()*.3,1.6+s()*.4,st("#4C5E2E",.15,s),V.leaf,i+s())}return t.geometry()}function gM(s){const t=new te,e=st("#6A5A48",.1,s),n=[];for(let i=0;i<3;i++){const o=i/3*me+s(),a=.45+s()*.3,r=.9+s()*.3,l=.7+s()*.2,c=[Math.cos(o)*a,1.6+s()*.8-l,Math.sin(o)*a,r,l];n.push(c),t.cyl([Math.cos(o)*.1,0,Math.sin(o)*.1],[c[0]*.7,c[1]-.2,c[2]*.7],.07,.04,e,V.wood,3)}return n.forEach((i,o)=>t.blob(i[0],i[1],i[2],i[3],i[4],i[3],st("#6F8A4E",.2,s),V.leaf,o+s(),!0,o<2?1:0)),Un(t,s,n,20,.11,i=>st(i<.5?"#B8443A":i<.8?"#8A2E3A":"#D8C890",.12,s),V.accent7,.35),t.geometry()}function xM(s){const t=new te,e=st("#8E8A80",.08,s),n=st("#77736A",.08,s),i=7;for(let h=0;h<7;h++)t.cyl([0,h/7*i,0],[0,(h+1)/7*i,0],.18-h*.004,.18-(h+1)*.004,h%2?n:e,V.wood,5);const o=[0,i,0],a=(h,u,f,d,v)=>{const g=An(h,u),x=[-Math.sin(h),0,Math.cos(h)],p=[g[1]*x[2]-g[2]*x[1],g[2]*x[0]-g[0]*x[2],g[0]*x[1]-g[1]*x[0]],m=Ve(o,g,.5),M=[];for(let _=0;_<=6;_++){const E=(-70+140*_/6)*(Math.PI/180),y=[g[0]*Math.cos(E)+x[0]*Math.sin(E),g[1]*Math.cos(E)+x[1]*Math.sin(E),g[2]*Math.cos(E)+x[2]*Math.sin(E)];M.push(Ve(Ve(m,y,f),p,_%2?.06:-.06))}for(let _=0;_<6;_++)t.tri(m,M[_],M[_+1],u<.17?v:d,V.leaf)},r=st("#4F6440",.1,s),l=st("#A5B4A6",.1,s);for(let h=0;h<16;h++)a(h*2.4+s()*.3,(-20+80*(h%8)/7)*(Math.PI/180),.95,r,l);const c=st("#7A6A4E",.1,s);for(let h=0;h<5;h++){const u=h/5*me+s()*.5,f=[Math.cos(u),0,Math.sin(u)],d=[f[0]*.25,i-.4,f[2]*.25],v=[-f[2],0,f[0]],g=[];for(let x=0;x<=6;x++){const p=(-60+120*x/6)*(Math.PI/180);g.push([d[0]+f[0]*.2+v[0]*Math.sin(p)*.7,d[1]-Math.cos(p)*1,d[2]+f[2]*.2+v[2]*Math.sin(p)*.7])}for(let x=0;x<6;x++)t.tri(d,g[x],g[x+1],c,V.leaf)}return t.geometry()}function Kh(s,t){const e=new te,n=st("#8A8070",.1,s);e.cyl([0,0,0],[.2,2.2,0],.35,.28,n,V.wood,5);for(let a=0;a<3;a++){const r=a/3*me+s(),l=[.15,1.8+s()*.4,0];e.cyl(l,Ve(l,An(r,.1),3+s()),.16,.07,n,V.wood,3)}const i=t?"#4C6630":"#4A6426",o=[[.2,4.8,0,3,2.2]];for(let a=0;a<4;a++){const r=a/4*me+s()*.5;o.push([.2+Math.cos(r)*2.4,3.6+s()*.8,Math.sin(r)*2.4,2.2,1.6])}return o.forEach((a,r)=>e.blob(a[0],a[1],a[2],a[3],a[4],a[3],st(i,.12,s),V.leaf,r+s(),!0,r===4?0:1)),t?(Un(e,s,o,12,.2,()=>st("#F07A1E",.1,s),V.accent6),Un(e,s,o,6,.22,()=>st("#D8B83A",.1,s),V.accent6)):Un(e,s,o,12,.2,()=>st("#EDE08A",.1,s),V.accent6),e.geometry()}function vM(s){const t=new te,e=st("#8a7a62",.1,s),n=14;let i=[0,0,0];const o=.06;for(let u=1;u<=6;u++){const f=u/6*n,d=[o*Math.pow(f,1.5),f,0];t.cyl(i,d,.28-u*.02,.26-u*.025,e,V.wood,6),i=d}const a=i,r=st("#6E7A3E",.12,s),l=st("#8f9a43",.1,s);for(let u=0;u<13;u++){const f=u/13*Math.PI*2+s()*.3,d=5.2+s()*1.2,v=1.4+s()*.8,g=Math.cos(f),x=Math.sin(f);let p=a;for(let m=1;m<=5;m++){const M=m/5,_=[a[0]+g*d*M,a[1]+v*M-3.8*M*M,a[2]+x*d*M],E=1*Math.sin(Math.PI*Math.min(1,M*1.1))+.15,y=-x*E,w=g*E,A=m>3?l:r;t.quad([p[0],p[1],p[2]],[_[0],_[1],_[2]],[_[0]+y,_[1]-.35*E,_[2]+w],[p[0]+y*.7,p[1]-.25*E,p[2]+w*.7],A,V.leaf),t.quad([p[0]-y*.7,p[1]-.25*E,p[2]-w*.7],[_[0]-y,_[1]-.35*E,_[2]-w],[_[0],_[1],_[2]],[p[0],p[1],p[2]],A,V.leaf),p=_}}const c=st("#7C6440",.12,s);for(let u=0;u<2;u++){const f=u*2.6+s(),d=Math.cos(f),v=Math.sin(f),g=[a[0]+d*.25,a[1]-.3,a[2]+v*.25],x=[a[0]+d*.9,a[1]-2.4,a[2]+v*.9],p=[a[0]+d*1,a[1]-4.4,a[2]+v*1];for(const[m,M,_,E]of[[g,x,.2,.5],[x,p,.5,.2]])t.quad(m,M,[M[0]-v*E,M[1],M[2]+d*E],[m[0]-v*_,m[1],m[2]+d*_],c,V.leaf),t.quad([m[0]+v*_,m[1],m[2]-d*_],[M[0]+v*E,M[1],M[2]-d*E],M,m,c,V.leaf)}const h=st("#5c4a24",.1,s);for(let u=0;u<4;u++)t.blob(a[0]+Math.cos(u*1.7)*.4,a[1]-.6,a[2]+Math.sin(u*1.7)*.4,.3,.35,.3,h,V.plain,u);return t.geometry()}function MM(s){const t=new te;t.cyl([0,0,0],[.3,4.6,.1],.4,.3,st("#6E665A",.1,s),V.wood,5);const e="#3B5F24",n=[[.3,7.2,.1,3.6,2.6]];for(let i=0;i<2;i++){const o=i*3.1+s();n.push([.3+Math.cos(o)*2.2,6+s(),.1+Math.sin(o)*2.2,2.9,2.2])}n.forEach((i,o)=>t.blob(i[0],i[1],i[2],i[3],i[4],i[3],st(e,.15,s),V.leaf,o+s()));for(let i=0;i<14;i++){const o=n[i%3],a=s()*me,r=s()*.8-.1,l=Math.sqrt(1-r*r),c=[o[0]+Math.cos(a)*l*o[3]*.95,o[1]+r*o[4]*.95,o[2]+Math.sin(a)*l*o[3]*.95],h=[Math.cos(a)*.9,.2,Math.sin(a)*.9],u=[-Math.sin(a)*.4,0,Math.cos(a)*.4];t.quad([c[0]-u[0],c[1]-.1,c[2]-u[2]],[c[0]+u[0],c[1]-.1,c[2]+u[2]],[c[0]+h[0]+u[0]*.6,c[1]+h[1],c[2]+h[2]+u[2]*.6],[c[0]+h[0]-u[0]*.6,c[1]+h[1],c[2]+h[2]-u[2]*.6],st(e,.2,s),V.leaf)}return Un(t,s,n,10,.24,()=>st("#A8C050",.1,s),V.plain,-.3),t.geometry()}function _M(s){const t=new te,e=st("#7c9a4a",.1,s),n=st("#6E9440",.12,s),i=st("#8A7048",.12,s);for(let o=0;o<4;o++){const a=s()*Math.PI*2,r=s()*.6,l=Math.cos(a)*r,c=Math.sin(a)*r,h=2.4+s()*1.4;t.cyl([l,0,c],[l,h,c],.16,.12,e,V.leaf,5);for(let u=0;u<4;u++){const f=s()*Math.PI*2,d=Math.cos(f),v=Math.sin(f),g=[l,h,c],x=[l+d*1.6,h+.7,c+v*1.6],p=[l+d*2.6,h-.2,c+v*2.6],m=-v*.45,M=d*.45;for(const _ of[1,-1])for(const[E,y]of[[.08,.45],[.55,1]]){const w=(A,b,S)=>[A[0]+m*b*S*_,A[1]-.06*b,A[2]+M*b*S*_];t.quad(w(g,E,.3),w(x,E,1),w(x,y,1),w(g,y,.3),n,V.leaf),t.quad(w(x,E,1),w(p,E,.6),w(p,y,.6),w(x,y,1),n,V.leaf)}}if(o<2){const u=s()*me,f=Math.cos(u),d=Math.sin(u);t.quad([l+f*.1,h-.1,c+d*.1],[l+f*.5,h-1.6,c+d*.5],[l+f*.5-d*.35,h-1.5,c+d*.5+f*.35],[l+f*.1-d*.2,h-.1,c+d*.1+f*.2],i,V.leaf)}}return t.geometry()}function Zh(s,t){const e=new te,n=st("#6b5a40",.1,s),i=st(t?"#7d2b2f":"#3f7d32",.15,s);e.cyl([0,0,0],[.05,1.6,0],.05,.04,n,V.wood,4);for(let o=0;o<9;o++){const a=o/9*Math.PI*2,r=Math.cos(a),l=Math.sin(a),c=.3+o%3*.25;e.quad([.05-l*.06,1.6,r*.06],[.05+l*.06,1.6,-r*.06],[.05+r*.9+l*.12,1.6+c,l*.9-r*.12],[.05+r*.9-l*.12,1.6+c,l*.9+r*.12],i,V.leaf)}return e.geometry()}function wM(s,t){const e=new te;for(let n=0;n<3;n++)e.blob((s()-.5)*1.2,.5,(s()-.5)*1.2,.9,.7,.9,st(t,.2,s),V.leaf,n);return e.geometry()}const Jh=["niu","hala","ulu","kukui","maia","ki","kiRed","naupaka","aalii","ohiaai","hau","milo","kou","loulu"],qi=["ohia","ohiaKrumm","koa","kukui","ohiaai","hau","hala","wiliwili","lama","aalii","hapuu"],Tt=Object.fromEntries(qi.map((s,t)=>[s,t]));Tt.ohiaDry=qi.length;Tt.olapa=qi.length+1;const gi=qi.length,yM={ohia:[3e3,12e3],ohiaKrumm:[2500,8e3],koa:[1500,5e3],kukui:[2e3,6e3],ohiaai:[1200,4e3],hau:[1e3,3e3],hala:[1500,4e3],wiliwili:[800,3e3],lama:[1500,5e3],aalii:[1500,4e3],hapuu:[3e3,0]},He=2,Wr=13.5,Pi=[3.6,4.6],x0=[34,48],Qh=x0[1]+3,tu=.326,eu=.346,no=.387,_s=.436,bM=.5,pa=.575,Vr=.702,SM=.763,nu=[.72,.75,.7],qr=[1.48,1.41,1.8],iu=[.72,.68,.85],EM=[1.32,1.46,1.17],AM=[1.54,1.4,1.68],Me=s=>s?1:0;function io(s,t){let e=0;for(const[,n]of t)e+=Math.max(0,n);if(e<=0)return null;s*=e;for(const[n,i]of t)if(i>0&&(s-=i)<0)return n;return t.filter(([,n])=>n>0).pop()[0]}function TM(s,t){let e=0;for(let i=0;i<t.length;i++)t[i]>0&&(e+=t[i]);if(e<=0)return-1;s*=e;let n=-1;for(let i=0;i<t.length;i++)if(!(t[i]<=0)&&(n=i,(s-=t[i])<0))return i;return n}function Xr(s,t,e,n,i,o){const a=i-e,r=o-n,l=a*a+r*r||1e-12,c=Math.max(0,Math.min(1,((s-e)*a+(t-n)*r)/l));return Math.hypot(e+a*c-s,n+r*c-t)}const sn=Math.fround,Mo=s=>s-Math.floor(s);function ma(s,t){let e=Mo(sn(s*.1031)),n=Mo(sn(t*.1031)),i=e;const o=sn(sn(e*sn(n+33.33))+sn(n*sn(i+33.33))+sn(i*sn(e+33.33)));return e=sn(e+o),n=sn(n+o),i=sn(i+o),Mo(sn(sn(e+n)*i))}function jr(s,t){const e=Math.floor(s),n=Math.floor(t),i=s-e,o=t-n,a=i*i*(3-2*i),r=o*o*(3-2*o),l=ma(e,n),c=ma(e+1,n),h=ma(e,n+1),u=ma(e+1,n+1);return l+(c-l)*a+(h-l+(l-c+u-h)*a)*r}function v0(s,t){const e=jr(s*2.7+5.2,t*2.7+1.3)-.5,n=jr(s*2.7+9.7,t*2.7+6.1)-.5;return jr(s+.8*e,t+.8*n)}const CM=(s,t)=>Gt(.4,.6,v0(s*.5+13.1,t*.5+7.7)),RM=(s,t)=>Gt(.6,.68,v0(s*.55+41.3,t*.55+3.9));function su(s){for(let t=1;t<s.length;t++){const e=s[t];let n=t-1;for(;n>=0&&s[n].d>e.d;)s[n+1]=s[n],n--;s[n+1]=e}}class kM{constructor(t){var r,l,c,h;this.app=t;const e=wi(t.island.meta.seed+5150);this.geoms={niu:vM(e),hala:dM(e),ulu:MM(e),kukui:hM(e),maia:_M(e),ki:Zh(e,!1),kiRed:Zh(e,!0),naupaka:wM(e,"#5f8a42"),aalii:gM(e),ohiaai:uM(e),hau:fM(e),milo:Kh(e,!1),kou:Kh(e,!0),loulu:xM(e),ohia:oM(e),ohiaKrumm:aM(e),koa:lM(e),wiliwili:pM(e),lama:mM(e),hapuu:rM(e)},this.farGeoms={ohia:On(e,{stick:[.3,6.5,.1],bark:"#5A5354",crowns:[[.3,8.6,0,4.6,2.5,Ba(st("#5C603F",0,e),.95)],[2.2,7.7,1,3,1.8,Ba(st("#5C603F",0,e),.95),V.leaf,2]]}),ohiaKrumm:On(e,{crowns:[[.6,2.4,.2,5,1.5,"#596537",V.leaf,1,.75,.3]]}),koa:On(e,{stick:[.2,4,-.3],r0:.6,r1:.45,bark:"#5A504B",limbs:Yh(this.geoms.koa).map(u=>[[.2,3.8,-.3],[u[0]*.9,u[1]-.6,u[2]*.9],.3,.14]),crowns:Yh(this.geoms.koa).map((u,f)=>[u[0],u[1]+.3,u[2],3,1.55,f===1?"#737B5A":"#5E6A3C",V.leaf,f+1])}),kukui:On(e,{stick:[.3,4.2,.1],r0:.45,r1:.35,bark:"#5F5B54",crowns:[[.3,6.5,.1,5.8,3.2,m0,V.leaf,1,.62],[.5,8.6,.3,3.4,1.6,El,V.leaf,5,.8],[-2.9,5.6,1.6,2.8,1.9,Sl,V.leaf,2,.7]]}),ohiaai:On(e,{stick:[0,2.4,0],r0:.35,r1:.3,bark:"#8A7458",crowns:[[0,6,0,2.4,3.6,"#3A5026"]]}),hau:On(e,{crowns:[[0,2.2,0,5,2.2,"#6E8A3E"]]}),hala:On(e,{stick:[.3,3.4,0],r0:.22,r1:.15,bark:"#8E8B82",limbs:[0,2].map(u=>{const[f,d]=this.geoms.hala.userData.tips.slice(u,u+2);return[[.3,3.3,0],[(f[0]+d[0])/2,(f[1]+d[1])/2-.45,(f[2]+d[2])/2],.13,.09]}),crowns:this.geoms.hala.userData.tips.map((u,f)=>[u[0],u[1]-.35,u[2],1.45,.75,"#55703D",V.leaf,f+1])}),wiliwili:On(e,{stick:[.1,2.8,.2],r0:.45,r1:.3,bark:"#9C6C44",limbs:this.geoms.wiliwili.userData.ends.map(u=>[[.05,2.5,.2],u,.2,.08]),crowns:[[0,3.9,.2,4.8,1.25,"#788C4A",V.accent3,3,.75],...this.geoms.wiliwili.userData.ends.map((u,f)=>[u[0],u[1]+.3,u[2],1.25,.5,"#7E7062",V.accent2,4+f,.8])]}),lama:On(e,{stick:[.2,3.2,.1],r0:.25,r1:.18,bark:"#3E3A36",crowns:[[.2,5.4,.1,2.6,2,"#4C5E2E"]]}),aalii:On(e,{crowns:[[0,1.2,0,1.5,1,"#6F8A4E"]]})};for(const u of[this.geoms,this.farGeoms])for(const f in u)u[f]=sM(u[f]);const n=t.shared.uniforms;n.uAccent=n.uAccent||{value:new Float32Array(9)},n.uKau=n.uKau||{value:0},n.uLehua=n.uLehua||{value:0};const i=t.terrain;for(const u of[i==null?void 0:i.uniforms,(l=(r=i==null?void 0:i.full)==null?void 0:r.material)==null?void 0:l.uniforms,(h=(c=i==null?void 0:i.half)==null?void 0:c.material)==null?void 0:h.uniforms])if(u)for(const f of["uAccent","uKau","uLehua"])u[f]=u[f]||n[f];this.season(),this.fixedMat=ks(t.shared,{fade:x0,close:.3,sway:1,doubleSide:!0}),this.forestMat=ks(t.shared,{fade:[Pi[0],Pi[1]],close:.3,sway:1,woodTint:.25}),this.forestMatDS=ks(t.shared,{fade:[Pi[0],Pi[1]],close:.3,sway:1,doubleSide:!0,woodTint:.25}),this.forestFarMat=ks(t.shared,{fade:[Wr-3.5,Wr],fadeIn:Pi,sway:1,woodTint:.25}),this.group=new En,this.land=t.landTex.image.data,this.cleared=this.clearings(),this.terrainHelpers(),this.fixed=this.placeFixed(wi(t.island.meta.seed+5152)),this.meshes={},this.fixedAll={};for(const u of Jh){const f=this.fixed[u];if(!f.length)continue;const d=new xo(this.geoms[u],this.fixedMat,f.length);d.name=u,this.writeInstances(d,f),d.frustumCulled=!1;const v=new Float32Array(f.length*2);f.forEach((g,x)=>v.set([g.x,g.z],x*2)),this.fixedAll[u]={mat:d.instanceMatrix.array.slice(),col:d.instanceColor.array.slice(),xz:v},d.instanceMatrix.setUsage(vi),d.instanceColor.setUsage(vi),this.group.add(d),this.meshes[u]=d}this.fixedAt=[1/0,1/0],this.forest={near:[],far:[]};for(const u of qi){const[f,d]=yM[u];this.forest.near.push(this.forestMesh(this.geoms[u],u==="hala"||u==="hapuu"?this.forestMatDS:this.forestMat,f,u+" near")),this.forest.far.push(d?this.forestMesh(this.farGeoms[u],this.forestFarMat,d,u+" far"):null)}this.tiles=new Map,this.frustum=new Ws,this.projView=new ie,this.near=[],this.far=[],this.missing=[],this.lastSelection="",this.selHash=0,this.selCount=-1,this.nv=new q,this.L={rain:0,sand:0,rip:0,field:0},this.pending=Array.from({length:gi},()=>[]),this.w=new Float32Array(gi+2),this.tint=[1,1,1];const[o,a]=Pa(k0);this.leeRot=Math.atan2(-a,o)}forestMesh(t,e,n,i){const o=new xo(t,e,n);return o.name=i,o.count=0,o.visible=!1,o.frustumCulled=!1,o.instanceMatrix.setUsage(vi),o.instanceColor=new si(new Float32Array(n*3),3),o.instanceColor.setUsage(vi),this.group.add(o),o}season(){const t=this.app.clock,e=t?t.doy+t.hour/24:277,n=Gt(111,131,e)*(1-Gt(294,314,e)),i=this.app.shared.uniforms.uAccent.value;i[0]=.15+.2*n,i[1]=.2+.05*n,i[2]=.1+.75*Gt(50,70,e)*(1-Gt(294,314,e)),i[3]=1-i[2],i[8]=Math.min(i[2],.85*Gt(50,70,e)*(1-Gt(185,205,e))),i[4]=.8*Gt(50,70,e)*(1-Gt(110,130,e)),i[5]=.6*Gt(140,160,e)*(1-Gt(320,340,e)),i[6]=.3-.05*n,i[7]=.45,this.app.shared.uniforms.uKau.value=n,this.app.shared.uniforms.uLehua.value=i[0]/.35}clearings(){const t=le,e=new Uint8Array(t*t),n=Vt/t,i=(a,r,l)=>{const c=Math.max(0,Math.floor((a-l+ht)/n)),h=Math.min(t-1,Math.floor((a+l+ht)/n)),u=Math.max(0,Math.floor((r-l+ht)/n)),f=Math.min(t-1,Math.floor((r+l+ht)/n));for(let d=u;d<=f;d++)for(let v=c;v<=h;v++)e[d*t+v]=1},o=this.app.island.meta.sites;for(const a of o.loi)for(const r of a.paddies){i(r.c[0],r.c[1],.05);for(const l of r.poly)i(l[0],l[1],.03)}for(const a of o.houses)i(a.x,a.z,.12);for(const a of o.heiau)i(a.x,a.z,.5);for(const a of o.villages)i(a.x,a.z,.3);for(const a of this.app.island.meta.ahu)i(a.x,a.z,.3);for(const a of o.koa)i(a.x,a.z,.15);return e}terrainHelpers(){var u;const t=le,e=this.app.island.data.height1024,n=new Float32Array(t*t),i=[];for(let f=0;f<8;f++){const d=f*Math.PI/4;i.push(Math.round(7*Math.sin(d))*t+Math.round(7*Math.cos(d)))}for(let f=7;f<t-7;f++)for(let d=7;d<t-7;d++){const v=f*t+d;let g=0;for(let x=0;x<8;x++)g+=e[v+i[x]];n[v]=e[v]-g/8}this.tpi=n,this.dCult=bl(t,f=>this.cleared[f]===1),this.dField=bl(t,f=>this.land[f*4+3]>5);const o=((u=this.app.wailele)==null?void 0:u.lines)||zo(this.app.island.meta,this.app.island.data),a=[];for(const f of o){const d=Math.min(.11,.009*Math.sqrt(f.lineA)+.012);for(let v=1;v<f.pts.length;v++)a.push(f.pts[v-1][0],f.pts[v-1][1],f.pts[v][0],f.pts[v][1],d)}const r=Vt/t,l=.6,c=new Float32Array(t*t).fill(l),h=new Int32Array(t*t).fill(-1);for(let f=0;f<a.length;f+=5){const[d,v,g,x,p]=[a[f],a[f+1],a[f+2],a[f+3],a[f+4]],m=Math.max(0,Math.floor((Math.min(d,g)-l+ht)/r)),M=Math.min(t-1,Math.floor((Math.max(d,g)+l+ht)/r)),_=Math.max(0,Math.floor((Math.min(v,x)-l+ht)/r)),E=Math.min(t-1,Math.floor((Math.max(v,x)+l+ht)/r));for(let y=_;y<=E;y++)for(let w=m;w<=M;w++){const A=Xr(-ht+(w+.5)*r,-ht+(y+.5)*r,d,v,g,x)-p;A<c[y*t+w]&&(c[y*t+w]=A,h[y*t+w]=f)}}this.streamSegs=new Float32Array(a),this.streamNear=h}bankAt(t,e){const n=le,i=(t+ht)/Vt*n-.5,o=(e+ht)/Vt*n-.5,a=Math.floor(i),r=Math.floor(o),l=this.streamSegs;let c=9;for(let h=r;h<=r+1;h++)for(let u=a;u<=a+1;u++){if(u<0||h<0||u>=n||h>=n)continue;const f=this.streamNear[h*n+u];f<0||(c=Math.min(c,Xr(t,e,l[f],l[f+1],l[f+2],l[f+3])-l[f+4]))}return c}cellOf(t,e){const n=le,i=Math.floor((t+ht)/Vt*n),o=Math.floor((e+ht)/Vt*n);return i>=0&&o>=0&&i<n&&o<n?o*n+i:-1}tpiAt(t,e){const n=this.cellOf(t,e);return n<0?0:this.tpi[n]}dCultAt(t,e){const n=this.cellOf(t,e);return n<0?1e9:this.dCult[n]*(Vt/le)*100}dFieldAt(t,e){const n=this.cellOf(t,e);return n<0?1e9:this.dField[n]*(Vt/le)*100}wildAt(t,e,n){var r;const i=(r=this.app.terrain)==null?void 0:r.uniforms,o=i!=null&&i.uFalls?i.uFalls.value:0;let a=0;for(let l=0;l<o;l++){const c=i.uFallA.value[l],h=i.uFallB.value[l],u=i.uFallC.value[l],f=i.uFallD.value[l],d=t-c.x,v=e-c.y,g=d*c.z+v*c.w,x=-d*c.w+v*c.z;if(a=Math.max(a,1-Gt(1.2,2.2,Math.hypot((g-h.w)*.7,x))),g*g+x*x>(u.x+.8)*(u.x+.8)+2.5)continue;const p=g-f.z-f.y*x*x,m=Math.abs(x)/(u.z+(f.x-u.z)*Math.min(1,Math.max(0,g/u.x)));a=Math.max(a,Gt(-.9,-.6,p)*(1-Gt(u.x+.4,u.x+.8,g))*(1-Gt(1.6,2,m))*Gt(h.y,h.y+15,n))}return a}isCleared(t,e){const n=this.cellOf(t,e);return n>=0&&this.cleared[n]===1}landAt(t,e){const n=this.cellOf(t,e);if(n<0)return null;const i=this.land;return{rain:i[n*4]/255,sand:i[n*4+1]/255,rip:i[n*4+2]/255,field:i[n*4+3]/255}}landInto(t,e,n){const i=this.cellOf(t,e);if(i<0)return null;const o=this.land;return n.rain=o[i*4]/255,n.sand=o[i*4+1]/255,n.rip=o[i*4+2]/255,n.field=o[i*4+3]/255,n}writeInstances(t,e){const n=new ie,i=new ji,o=new q,a=new q,r=new It,l=new q(0,1,0);for(let c=0;c<e.length;c++){const h=e[c];o.set(h.x,h.y,h.z),i.setFromAxisAngle(l,h.rot),a.setScalar(h.s),n.compose(o,i,a),t.setMatrixAt(c,n),r.setRGB(h.c,h.c*(.96+.08*((h.x*997+h.z*131)%1+1)%1),h.c),t.setColorAt(c,r)}t.count=e.length,t.instanceMatrix.needsUpdate=!0,t.instanceColor&&(t.instanceColor.needsUpdate=!0)}placeFixed(t){var E;const{terrain:e}=this.app,n=this.app.island.meta,i=n.sites,o=Object.fromEntries(Jh.map(y=>[y,[]])),a=i.houses,r=(y,w,A)=>!a.some(b=>Math.abs(b.x-y)<A&&Math.abs(b.z-w)<A&&Math.hypot(b.x-y,b.z-w)<A),l=((E=this.app.features)==null?void 0:E.footings)||[],c=(y,w,A)=>l.some(({box:b})=>{const S=y-b.x,R=w-b.z;return Math.abs(S*b.c+R*b.s)<b.hx+A&&Math.abs(R*b.c-S*b.s)<b.hz+A}),h=(y,w,A,b=1,S=.025)=>{if(!y)return!1;const R=e.heightAt(w,A);if(R<=.003)return!1;const k={x:w,y:R,z:A,rot:t()*Math.PI*2,s:lt*b*(.8+t()*.45),c:.85+t()*.3};return c(w,A,S)?!1:(o[y].push(k),!0)},u=(y,w,A)=>i.villages.some(b=>Math.hypot(b.x-y,b.z-w)<A);for(const y of i.villages){const w=this.landAt(y.x,y.z),A=!!w&&w.rain>.3,b=y.alii?26:y.model?20:12;for(let S=0;S<b;S++){const R=t()*Math.PI*2,k=.12+t()*.68,I=y.x+Math.cos(R)*k,T=y.z+Math.sin(R)*k;if(!r(I,T,.09))continue;const C=this.landAt(I,T),F=C&&C.sand>.3?io(t(),[["niu",70],["hala",15*Me(A)],["milo",15*Me(A)],["kou",15*Me(!A)]]):A?io(t(),[["niu",25],["ulu",20],["maia",15],["hala",10],["kukui",10],["milo",10],["ohiaai",5],["hau",5]]):io(t(),[["niu",35],["kou",25],["milo",10],["hala",5],["ulu",5*Me(C&&C.rain>.25)],["aalii",10],["ki",10]]);h(F,I,T)}for(let S=0;S<(y.model?24:10);S++){const R=a[Math.floor(t()*a.length)];if(R.village!==y.id)continue;const k=t()*Math.PI*2;h(t()<.95?"ki":"kiRed",R.x+Math.cos(k)*.08,R.z+Math.sin(k)*.08,.9,.005)}}const f=n.trail;for(let y=0;y<f.length;y++){const w=f[y];for(let A=0;A<3;A++){const b=w[0]+(t()-.5)*2.6,S=w[1]+(t()-.5)*2.6,R=this.landAt(b,S);if(!R)continue;const k=e.heightAt(b,S);if(!(k<=.003||k>.4)){if(R.sand>.4&&t()<.5)h("naupaka",b,S,.8);else if(t()<.7){const I=R.rain>.28?io(t(),[["hala",35],["niu",35],["milo",20],["hau",10*Me(R.rip>.4)]]):io(t(),[["niu",30*Me(u(b,S,.6))],["kou",25],["aalii",30],["naupaka",15]]);h(I,b,S,I==="aalii"||I==="naupaka"?.8:1)}}}}const d=n.streams;for(const y of i.loi){const w=y.paddies,A=(C,F,N)=>w.some(z=>Math.abs(z.c[0]-C)<.4&&Math.abs(z.c[1]-F)<.4&&(fo(z.poly,C,F)||z.poly.some(U=>Math.hypot(U[0]-C,U[1]-F)<N)));let b=1/0,S=-1/0,R=1/0,k=-1/0;for(const C of w)b=Math.min(b,C.c[0]-1),S=Math.max(S,C.c[0]+1),R=Math.min(R,C.c[1]-1),k=Math.max(k,C.c[1]+1);const I=(y.auwai||[]).concat(d.filter(C=>C.pts.some(F=>F[0]>b&&F[0]<S&&F[1]>R&&F[1]<k)).map(C=>C.pts)),T=(C,F,N)=>I.some(z=>z.some((U,L)=>L>0&&Xr(C,F,z[L-1][0],z[L-1][1],U[0],U[1])<N));for(let C=0;C<w.length;C+=2){const F=w[C],N=F.poly[Math.floor(t()*F.poly.length)],z=N[0]-F.c[0],U=N[1]-F.c[1],L=Math.hypot(z,U)||1,W=N[0]+z/L*.04,j=N[1]+U/L*.04;if(A(W,j,.025))continue;const P=this.landAt(W,j),O=t();if(O<.3)h("maia",W,j);else if(O<.55)h(t()<.95?"ki":"kiRed",W,j,.9,.005);else if(O<.7)A(W+z/L*.1,j+U/L*.1,.08)||h("kukui",W+z/L*.1,j+U/L*.1);else if(O<.85){const G=.1+t()*.1;A(W+z/L*G,j+U/L*G,.08)||h("ohiaai",W+z/L*G,j+U/L*G)}else O<.95?P&&P.rain>.3&&h("ulu",W,j):T(W,j,.05)&&h("hau",W,j)}}for(const y of i.ponds){const w=-y.az,A=y.ax,b=(S,R)=>{for(let k=0;k<R;k++){const I=(t()*2-1)*y.r;for(let T=.05+t()*.1;T<.5;T+=.06){const C=y.cx+w*I-y.ax*T,F=y.cz+A*I-y.az*T;if(e.heightAt(C,F)>.004){h(S,C,F);break}}}};b("hau",4+Math.floor(t()*5)),b("milo",2+Math.floor(t()*3))}for(const y of d){if(!y.mouth)continue;const[w,A]=y.pts[y.pts.length-1],b=this.landAt(w,A);if(!b||b.rain<=.25)continue;const S=y.area>7?5+Math.floor(t()*6):1+Math.floor(t()*3);for(let R=0;R<S;R++){const k=t()*me,I=.05+t()*.25,T=w+Math.cos(k)*I,C=A+Math.sin(k)*I,F=this.landAt(T,C);F&&F.sand<.3&&!this.isCleared(T,C)&&h("hau",T,C)}}const v={rain:0,sand:0,rip:0,field:0},g=new q,x=[],p=[],m=[];for(let y=-ht;y<ht;y+=.5)for(let w=-ht;w<ht;w+=.5){const A=this.landInto(w,y,v);if(!A||A.rain<=.3||this.isCleared(w,y))continue;const b=e.metresAt(w,y);b>420&&b<800&&A.rain>_s&&x.push(w,y,this.dCultAt(w,y)<1500?1:.35);const S=A.rain>.55&&b>300&&b<900;if(!S&&!(b>3&&b<80))continue;const R=e.normalAt(w,y,g).y;S&&R>.35&&R<.7?p.push(w,y,1):!S&&R<.6&&m.push(w,y,1)}const M=(y,w,A,b)=>{const S=[];for(let R=0;R<w*12&&S.length<w*2;R++){const k=Math.floor(t()*(y.length/3))*3;if(!y.length||t()>=y[k+2])continue;const I=y[k],T=y[k+1];let C=!0;for(let F=0;F<S.length;F+=2)Math.hypot(S[F]-I,S[F+1]-T)<A&&(C=!1);C&&(S.push(I,T),b(I,T))}};M(x,60,1.5,(y,w)=>{const A=3+Math.floor(t()*4),b=2+Math.floor(t()*3);for(let S=0;S<A+b;S++){const R=t()*me,k=t()*.1,I=y+Math.cos(R)*k,T=w+Math.sin(R)*k;this.isCleared(I,T)||h(S<A?"maia":"ki",I,T,S<A?1:.9,.005)}});const _=(y,w)=>{const A=3+Math.floor(t()*5);for(let b=0;b<A;b++){const S=t()*me,R=t()*.15,k=y+Math.cos(S)*R,I=w+Math.sin(S)*R;e.normalAt(k,I,g).y>=.3&&!this.isCleared(k,I)&&h("loulu",k,I,.9)}};return M(p,30,3,_),M(m,8,3,_),o}buildTile(t,e,n){const{terrain:i}=this.app,o=Math.round(He/.17),a=He/o,r=this.pending;for(let E=0;E<gi;E++)r[E].length=0;const l=this.w,c=this.tint,h=this.nv;let u=1/0,f=-1/0,d=0;for(let E=0;E<o;E++)for(let y=0;y<o;y++){const w=t*o+E,A=e*o+y,b=ae(w,A,11),S=ae(w,A,12),R=(w+b)*a,k=(A+S)*a,I=this.landInto(R,k,this.L);if(!I||I.sand>.2||I.field>.3||this.isCleared(R,k))continue;const T=i.metresAt(R,k);if(T<3)continue;const C=this.bankAt(R,k);if(C<.008)continue;const F=i.normalAt(R,k,h).y,N=I.rain+(ae(w,A,3)-.5)*.12,z=this.tpiAt(R,k),U=RM(R,k),L=CM(R,k),W=N-(.22+43e-5*T),j=Gt(420,260,this.dFieldAt(R,k)),P=Gt(.94,.965,F)*(1-Gt(-26,-16,z))*Gt(.12,.2,I.rip),O=Math.max(Gt(.55,.8,I.rip)*Gt(.82,.92,F)*(1-Gt(-5,15,z)),P),G=Math.max(Gt(.1,.3,I.rip)*(1-O),Gt(25,60,-z)),K=Gt(20,60,z)*(1-Gt(.05,.2,I.rip)),Q=1-Gt(.55,.75,F),ot=1-Gt(420,760,T+(ae(w,A,20)-.5)*120),$=Me(T<670&&N>eu)*(1-Gt(450,670,T))*(1-Gt(Vr-.04,Vr+.02,I.rain)),Y=I.rain-(.22+43e-5*T),rt=Me(T<610&&(W>-.05||T<150)&&(T>150||Y>=0)),X=Me(T<550&&N>_s)*Gt(.42,.5,F)*(O>.5?.8+4*U:.05+7*U),Mt=Me(T<450)*(1-(O>.5?Gt(.1,.28,C):Gt(.05,.2,C))),mt=Me(T>250),_t=Math.max(Gt(0,30,z)*Gt(40,90,this.dCultAt(R,k)),Gt(360,480,T)),xt=this.wildAt(R,k,T);l.fill(0);let kt=1,at=0,B=0;if(xt>ae(w,A,24))B=K>.5||Q>.5?7:8,at=.7,l[Tt.ohia]=50,l[Tt.ohiaKrumm]=20+40*Math.max(Q,K),B===7&&(kt=.5+.3*ae(w,A,14));else if(T>1150+150*ae(w,A,21))T>1350&&F>.97&&N>.85?(B=1,at=.1,l[Tt.ohiaKrumm]=1,kt=.3+.15*ae(w,A,14)):(at=.95,l[Tt.ohiaKrumm]=65,l[Tt.olapa]=28,l[Tt.ohia]=7*Me(z<-20),kt=Q>.5?.5+.25*ae(w,A,14):K>.5?.8+.3*ae(w,A,14):1+.35*ae(w,A,14));else if(N<no?W<.03||j>ae(w,A,23):I.rain<_s&&T<760&&O<.5&&C>.2&&j>ae(w,A,23))B=2,at=(.07+.35*G+.25*Q)*(1-I.field),T<600?(l[Tt.aalii]=35,l[Tt.wiliwili]=25*Me(I.rain<no+.04)*Me(W<0||j>.5&&I.rain<tu+.02&&Y<.055),l[Tt.lama]=25,I.rain<no+.05?l[Tt.ohiaDry]=15:l[Tt.ohia]=15*Me(T>150)*_t):(l[Tt.lama]=35,l[Tt.aalii]=20,l[I.rain<no+.05?Tt.ohiaDry:Tt.ohia]=35,l[Tt.koa]=10*Me(N>tu&&N<no));else if(ot>ae(w,A,22))if(O>.5)B=3,at=.55,l[Tt.ohiaai]=40*X,l[Tt.hau]=60*Mt,l[Tt.kukui]=25*$*(1-.9*U),l[Tt.hala]=5*rt*Math.min(1,(l[Tt.ohiaai]+l[Tt.hau]+l[Tt.kukui])/40);else if(G>.4||Q>.4)B=4,at=.85,l[Tt.kukui]=70*$*(.2+.8*L)*(1-.9*U),l[Tt.hala]=15*rt*(1-.7*U),l[Tt.ohiaai]=10*X,l[Tt.hau]=60*Mt,l[Tt.lama]=15*Me(N<_s&&W<0),l[Tt.ohia]=(5+45*(1-$)*Me(N>eu))*Me(T>150)*_t,l[Tt.ohiaKrumm]=10*(1-$)*Me(N>=pa)*Q;else{B=5;const vt=Gt(460,640,T);at=.3+.5*vt,K>.5?(l[Tt.ohia]=60*Me(T>150),l[Tt.koa]=20*mt,l[Tt.hala]=20*rt*(1-vt)):(l[Tt.kukui]=45*$*(.1+.9*L)*(1-.9*U),l[Tt.hala]=35*rt*(1-.7*U)*(1-.85*vt),l[Tt.ohiaai]=10*X,l[Tt.hau]=60*Mt,l[Tt.ohia]=(10+50*vt)*Me(T>150)*_t,l[Tt.koa]=(10+5*vt)*mt)}else N<pa?(B=6,at=T<760?.55:.85,l[Tt.ohia]=45,l[Tt.koa]=30*Me(T>300),l[Tt.lama]=15,l[Tt.aalii]=5,l[Tt.kukui]=10*$*Me(G>.5)):K>.5||Q>.5?(B=7,at=.6,l[Tt.ohiaKrumm]=50,l[Tt.ohia]=50,kt=.5+.3*ae(w,A,14)):(B=8,at=.95,l[Tt.ohia]=78,l[Tt.koa]=10*Me(N<SM&&F>.8),l[Tt.olapa]=10,l[Tt.kukui]=2*$*Me(G>.5));let D=ae(w,A,13)<at?TM(ae(w,A,7),l):-1;D===Tt.hala&&ae(w,A,25)>.25+.75*Gt(8,18,T)&&(D=-1);let J=null,ut=D;if(D===Tt.ohiaDry)D=Tt.ohia,J=qr,kt=.55+.3*ae(w,A,14);else if(D===Tt.olapa)D=Tt.ohiaKrumm,J=EM,kt=Math.max(kt,.6+.2*ae(w,A,14));else if(D===Tt.ohia)if(N>=pa)J=nu;else{const vt=Math.min(1,Math.max(0,(N-.4)/.18));for(let gt=0;gt<3;gt++)c[gt]=Math.exp(Math.log(qr[gt])*(1-vt)+Math.log(nu[gt])*vt);J=c,kt===1&&(kt=.7+.4*ae(w,A,14))}else D===Tt.ohiaKrumm?J=iu:D===Tt.lama&&ae(w,A,16)<.1&&(J=AM);D===Tt.kukui&&O>.5&&(kt=1.15+.2*ae(w,A,14)),D===Tt.ohiaai&&U>.3&&(kt=1+.3*U);const ct=D===Tt.ohia&&B!==0&&xt<=ae(w,A,24)&&F>=.35&&F<.65&&N>=pa&&T>460&&K<.5;if(ct&&(kt=.7+.3*ae(w,A,14)),D>=0&&F<.35&&ae(w,A,5)<.7&&(D=-1),D===Tt.ohia&&F<.5&&!ct&&(N>=_s&&J!==qr&&(D=ut=Tt.ohiaKrumm,J=iu),kt=.5),D<0)continue;const ft=this.groundY(R,k),Rt=D===Tt.ohiaKrumm?this.leeRot+(b-.5)*1.2:b*me;if(this.emit(D,R,ft,k,Rt,lt*(kt===1?.75+.6*S:kt*(.92+.16*S)),.82+.35*ae(w,A,15),ae(w,A,17),J),d++,u=Math.min(u,ft),f=Math.max(f,ft),n&&n[B][ut]++,B!==1&&N>=_s&&T>250&&T<1700&&(ot<.5||B>=7)&&(D===Tt.ohia||D===Tt.koa||D===Tt.ohiaKrumm)){const vt=(B===0?.25*(1-Gt(1500,1650,T)):Math.min(.65,.15+.5*Gt(bM,Vr,N))*(1-.7*K))*Gt(.4,.7,at)*(F<.35?.4:1),gt=R+(ae(w,A,31)-.5)*a,Ct=k+(ae(w,A,32)-.5)*a;if(ae(w,A,30)<vt&&!this.isCleared(gt,Ct)&&this.bankAt(gt,Ct)>.008){const Lt=this.groundY(gt,Ct);this.emit(Tt.hapuu,gt,Lt,Ct,ae(w,A,34)*me,lt*(.7+.5*ae(w,A,33)),.85+.3*ae(w,A,35),.5,null),d++,u=Math.min(u,Lt),n&&n[B][Tt.hapuu]++}}}const v=new Uint32Array(gi+1),g=new Float32Array(d*16),x=new Float32Array(d*3);let p=0;for(let E=0;E<gi;E++){v[E]=p;const y=r[E];for(let w=0;w<y.length;w+=9){const A=Math.cos(y[w+3])*y[w+4],b=Math.sin(y[w+3])*y[w+4],S=p*16;g[S]=A,g[S+2]=-b,g[S+5]=y[w+4],g[S+8]=b,g[S+10]=A,g[S+12]=y[w],g[S+13]=y[w+1],g[S+14]=y[w+2],g[S+15]=1,x[p*3]=y[w+5],x[p*3+1]=y[w+6],x[p*3+2]=y[w+7],p++}}v[gi]=p;const m=t*He,M=e*He,_=d?new li(new q(m-.24,u,M-.24),new q(m+He+.24,f+.45,M+He+.24)):null;return{off:v,mat:g,col:x,box:_,total:d}}groundY(t,e){const n=this.app.terrain;return n.heights?Hl(n.heights,n.N,t,e)*qt:n.heightAt(t,e)}emit(t,e,n,i,o,a,r,l,c){const h=this.pending[t],u=c?c[0]:1,f=c?c[1]:1,d=c?c[2]:1;h.push(e,n,i,o,a,r*u,r*(.96+.08*l)*f,r*d,0)}update(t){this.season();const e=t.position,n=Math.max(0,this.app.terrain.heightAt(e.x,e.z)),i=e.y-n,o=i<14;if(this.group.visible=i<60,this.group.visible&&Math.max(Math.abs(e.x-this.fixedAt[0]),Math.abs(e.z-this.fixedAt[1]))>2&&(this.fixedAt[0]=e.x,this.fixedAt[1]=e.z,this.fillFixed(e.x,e.z)),!o){for(let x=0;x<gi;x++)this.forest.near[x].visible=!1,this.forest.far[x]&&(this.forest.far[x].visible=!1);this.selCount=-1;return}t.updateMatrixWorld(),this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const a=Wr,r=Math.floor((e.x-a)/He),l=Math.floor((e.x+a)/He),c=Math.floor((e.z-a)/He),h=Math.floor((e.z+a)/He),u=this.near,f=this.far,d=this.missing;u.length=0,f.length=0,d.length=0;let v=2166136261,g=0;for(let x=r;x<=l;x++)for(let p=c;p<=h;p++){const m=x*He,M=p*He,_=Math.max(m-e.x,0,e.x-m-He),E=Math.max(M-e.z,0,e.z-M-He),y=Math.hypot(_,E);if(y>a)continue;const w=x*8192+p,A=this.tiles.get(w);if(!A){d.push(y,x,p);continue}if(!A.box||!this.frustum.intersectsBox(A.box))continue;A.d=y;const b=Math.max(A.box.min.y-e.y,0,e.y-A.box.max.y),S=Math.max(Math.abs(A.box.min.y-e.y),Math.abs(A.box.max.y-e.y)),R=Math.hypot(Math.max(Math.abs(m-e.x),Math.abs(m+He-e.x)),Math.max(Math.abs(M-e.z),Math.abs(M+He-e.z)),S),k=Math.hypot(y,b)<Pi[1]+.3,I=R>Pi[0]-.3;k&&u.push(A),I&&f.push(A),v=Math.imul(v^w*4+(k?1:0)+(I?2:0),16777619),g++}for(let x=0;x<10;x++){let p=-1;for(let _=0;_<d.length;_+=3)d[_]!==1/0&&(p<0||d[_]<d[p])&&(p=_);if(p<0)break;const m=d[p+1],M=d[p+2];this.tiles.set(m*8192+M,this.buildTile(m,M)),d[p]=1/0}if(this.tiles.size>3e3)for(const[x]of this.tiles){const p=Math.floor(x/8192+.5),m=x-p*8192;Math.hypot((p+.5)*He-e.x,(m+.5)*He-e.z)>a*3&&this.tiles.delete(x)}v===this.selHash&&g===this.selCount&&this.lastSelection!==""||(this.selHash=v,this.selCount=g,this.lastSelection="filled",su(u),su(f),this.fill(this.forest.near,u),this.fill(this.forest.far,f))}fillFixed(t,e){const n=Qh*Qh;for(const i in this.meshes){const o=this.meshes[i],a=this.fixedAll[i],r=o.instanceMatrix.array,l=o.instanceColor.array;let c=0;for(let h=0;h<a.xz.length/2;h++){const u=a.xz[h*2]-t,f=a.xz[h*2+1]-e;if(!(u*u+f*f>n)){for(let d=0;d<16;d++)r[c*16+d]=a.mat[h*16+d];for(let d=0;d<3;d++)l[c*3+d]=a.col[h*3+d];c++}}o.count=c,o.visible=c>0,c&&(o.instanceMatrix.clearUpdateRanges(),o.instanceMatrix.addUpdateRange(0,c*16),o.instanceMatrix.needsUpdate=!0,o.instanceColor.clearUpdateRanges(),o.instanceColor.addUpdateRange(0,c*3),o.instanceColor.needsUpdate=!0)}}fill(t,e){for(let n=0;n<gi;n++){const i=t[n];if(!i)continue;const o=i.instanceMatrix.count,a=i.instanceMatrix.array,r=i.instanceColor.array;let l=0;for(let u=0;u<e.length&&l<o;u++){const f=e[u],d=f.off[n],v=Math.min(f.off[n+1]-d,o-l);for(let g=0;g<v*16;g++)a[l*16+g]=f.mat[d*16+g];for(let g=0;g<v*3;g++)r[l*3+g]=f.col[d*3+g];l+=v}if(i.count=l,i.visible=l>0,!l)continue;const c=i.instanceMatrix;c.clearUpdateRanges(),c.addUpdateRange(0,l*16),c.needsUpdate=!0;const h=i.instanceColor;h.clearUpdateRanges(),h.addUpdateRange(0,l*3),h.needsUpdate=!0}}}const Yr=3,ga=10,PM=.022,xa=.03,ou=1.83*lt,au=.014,wn=1.8*lt,LM=.0145,Ln=(s,t,e)=>{const n=Math.max(0,Math.min(1,(e-s)/(t-s)));return n*n*(3-2*n)},Li=s=>s-Math.PI*2*Math.round(s/(Math.PI*2)),ru=s=>{const t=s<0?1.3:3.5;return-2*s/(t*t)*Math.exp(-s*s/(t*t))};function $r(s,t){const e=new te,n=st("#7a4b30",.1,t),i=st("#b08a5a",.15,t);return s==="stand"?(e.box(-.12,0,0,.16,.85,.18,n,V.skin,0,.8),e.box(.12,0,0,.16,.85,.18,n,V.skin,0,.8),e.box(0,.78,0,.42,.32,.26,i,V.plain),e.box(0,1.05,0,.44,.5,.24,n,V.skin,0,.85),e.box(-.3,.88,0,.11,.62,.12,n,V.skin),e.box(.3,.88,0,.11,.62,.12,n,V.skin),e.blob(0,1.68,0,.13,.15,.13,st("#3a2418",.1,t),V.skin,1,!1)):(e.box(0,0,0,.6,.2,.42,i,V.plain),e.box(0,.18,0,.42,.55,.24,n,V.skin,0,.85),e.box(-.28,.2,.08,.1,.45,.1,n,V.skin),e.box(.28,.2,.08,.1,.45,.1,n,V.skin),e.blob(0,.86,0,.13,.15,.13,st("#3a2418",.1,t),V.skin,3,!1)),e.geometry()}const zM=.11,Al=.44,Ha=.4,Tl=.06,DM=.885,Kr=.11,lu=.29,Zr=.62,xi=.62,Jr=.2,Qr={step:.5,tau:.62,lift:.08,swing:.5},FM={step:.32,tau:1,lift:.14,swing:.25},IM={step:.46,tau:.6,lift:.07,swing:.45},tl={step:0,tau:.5,lift:.05,swing:.2},Je=12,va={noa:[7,4.6],mua:[8,5],aina:[6,4.2],kuku:[5,3.6],alii:[12,7]},UM={niu:.5,hala:1.4,ulu:.8,kukui:.8,maia:1.3,ki:.45,kiRed:.45,naupaka:1.5,aalii:1.1},ws=0,so=1,NM=.024;function OM(s){const t=st("#7a4b30",.1,s),e=st("#b08a5a",.15,s),n=new te;n.box(0,-.1,0,.42,.32,.26,e,V.plain),n.box(0,.17,0,.44,.5,.24,t,V.skin,0,.85),n.blob(0,.8,.01,.13,.15,.13,st("#3a2418",.1,s),V.skin,1,!1);const i=new te;i.box(0,.02,0,.16,-Al-.04,.18,t,V.skin,0,.8);const o=new te;o.box(0,.02,0,.13,-Ha-.02,.14,t,V.skin,0,.85),o.box(0,-Ha-Tl,.05,.11,.075,.25,t,V.skin);const a=new te;return a.box(0,.03,0,.11,-xi-.03,.12,t,V.skin,0,.85),{torso:n.geometry(),thigh:i.geometry(),shin:o.geometry(),arm:a.geometry(),cloth:e}}function BM(){const s=new te,t=[1,1,1];return s.box(0,.05,0,.05,-.13,.05,t,V.plain),s.box(0,-.08,0,.085,-.2,.085,t,V.plain,0,1.35),s.geometry()}function HM(s){const t=new te,e=st("#7a5a3a",.1,s),n=st("#6b4a3a",.15,s),i=st("#4f7a2e",.15,s);t.box(0,.03,0,.05,.05,1.7,e,V.wood);for(const o of[-.74,.74])t.box(0,.05,o,.015,-.26,.015,e,V.plain),t.blob(0,-.3,o,.17,.13,.15,n,V.plain,7),t.blob(0,-.13,o,.11,.17,.11,i,V.leaf,8,!1);return t.geometry()}function GM(s,t){s.box(0,0,0,.6,.2,.42,t,V.plain)}function WM(s,t){s.box(0,0,.5,1,.09,.44,st("#6b4a2f",.1,t),V.wood),s.blob(0,.1,.5,.15,.07,.13,st("#8c7b86",.1,t),V.plain,3)}function VM(s,t){s.box(0,0,.48,1.4,.15,.2,st("#5e4128",.1,t),V.wood),s.box(.12,.15,.48,.75,.012,.24,st("#e8dcc4",.05,t),V.kapa)}function qM(s,t){const e=st("#4a3c2c",.1,t);s.box(0,-.02,.95,1.6,.05,1.3,e,V.plain),s.box(0,-.02,1.62,1.7,.07,.06,st("#c9b48a",.1,t),V.plain),s.blob(1.05,.04,.45,.32,.14,.26,e,V.plain,5)}class ys{constructor(t=0){this.a=t,this.b=t,this.t0=0,this.d=1}at(t){const e=(t-this.t0)/this.d;return e>=1?this.b:e<=0?this.a:this.a+(this.b-this.a)*e*e*(3-2*e)}to(t,e,n){return this.a=this.at(e),this.b=t,this.t0=e,this.d=Math.max(.001,n),e+this.d}set(t){this.a=this.b=t,this.t0=0}}function Ps(s,t,e,n,i,o){const a=i-e,r=o-n,l=a*a+r*r,c=l>0?Math.max(0,Math.min(1,((s-e)*a+(t-n)*r)/l)):0,h=s-e-a*c,u=t-n-r*c;return Math.sqrt(h*h+u*u)}function el(s,t,e,n,i,o,a,r){const l=(e-s)*(o-t)-(n-t)*(i-s),c=(e-s)*(r-t)-(n-t)*(a-s),h=(a-i)*(t-o)-(r-o)*(s-i),u=(a-i)*(n-o)-(r-o)*(e-i);return l*c<0&&h*u<0?0:Math.min(Ps(s,t,i,o,a,r),Ps(e,n,i,o,a,r),Ps(i,o,s,t,e,n),Ps(a,r,s,t,e,n))}function Ma(s,t,e){let n=1/0;for(let i=0,o=s.length-1;i<s.length;o=i++)n=Math.min(n,Ps(t,e,s[o][0],s[o][1],s[i][0],s[i][1]));return n}function XM(s,t){for(const e of t.loi)for(let n=e.model?16:5;n>0;n--)if(e.paddies[Math.floor(s()*e.paddies.length)].flood)for(let i=0;i<4;i++)s();for(const e of t.villages)for(let n=(e.model?12:e.alii?14:4)*5;n>0;n--)s();for(const e of t.heiau)if(e.model||e.kind==="luakini")for(let n=0;n<9;n++)s();for(const e of t.canoes)for(let n=(e.village===t.model?5:2)*4;n>0;n--)s();for(let e=0;e<t.ponds.length;e++)s()}function mn(s,t,e,n,i,o,a){const r=[e[0]-t[0],e[1]-t[1],e[2]-t[2]],l=Math.hypot(r[0],r[1],r[2])||1,c=[r[0]/l,r[1]/l,r[2]/l],h=Math.abs(c[0])<.9?[1,0,0]:[0,0,1],u=h[0]*c[0]+h[1]*c[1]+h[2]*c[2],f=[h[0]-u*c[0],h[1]-u*c[1],h[2]-u*c[2]],d=Math.hypot(f[0],f[1],f[2]);for(let x=0;x<3;x++)f[x]/=d;const v=[f[1]*c[2]-f[2]*c[1],f[2]*c[0]-f[0]*c[2],f[0]*c[1]-f[1]*c[0]],g=x=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(([p,m])=>[x[0]+(f[0]*p*n+v[0]*m*i)/2,x[1]+(f[1]*p*n+v[1]*m*i)/2,x[2]+(f[2]*p*n+v[2]*m*i)/2]);s.hexa(g(t),g(e),o,a)}function Ta(s,t){const e=new te,n=st("#7a4b30",.1,t),i=st("#b08a5a",.15,t),o=st("#3a2418",.1,t);if(s==="ride"){for(const a of[1,-1])mn(e,[0,0,.38*a],[.1,.46,.3*a],.13,.13,n,V.skin),mn(e,[.1,.46,.3*a],[0,.86,.12*a],.15,.15,n,V.skin);e.box(0,.74,0,.28,.24,.42,i,V.plain),mn(e,[0,.84,0],[.12,1.34,0],.24,.42,n,V.skin),mn(e,[.1,1.28,.2],[.2,1.1,.8],.1,.1,n,V.skin),mn(e,[.1,1.28,-.2],[.16,1.2,-.76],.1,.1,n,V.skin),e.blob(.16,1.5,0,.13,.15,.13,o,V.skin,4,!1)}else if(s==="sit"){for(const a of[1,-1])mn(e,[.12*a,.04,-.42],[.22*a,-.06,-.02],.15,.15,n,V.skin),mn(e,[.22*a,-.06,-.02],[.24*a,-.5,.08],.13,.13,n,V.skin),mn(e,[.25*a,.56,-.44],[.2*a,.1,-.16],.1,.1,n,V.skin);e.box(0,-.02,-.45,.42,.2,.3,i,V.plain),e.box(0,.12,-.46,.42,.52,.24,n,V.skin,0,.85),e.blob(0,.82,-.44,.13,.15,.13,o,V.skin,5,!1)}else{for(const a of[1,-1])mn(e,[.1*a,.08,-.32],[.1*a,.07,-1.25],.15,.14,n,V.skin);e.box(0,0,-.3,.4,.2,.3,i,V.plain),mn(e,[0,.11,-.16],[0,.17,.52],.42,.24,n,V.skin),e.blob(0,.32,.72,.13,.14,.15,o,V.skin,6,!1)}return e.geometry()}function jM(s){const t=new te;return mn(t,[0,0,0],[0,-.62,0],.1,.1,st("#7a4b30",.1,s),V.skin),t.geometry()}function YM(s){const t=new te,e=st("#6b4630",.1,s);return t.box(0,-.12,-.2,.56,.12,3.2,e,V.wood),t.hexa([[-.28,-.12,1.4],[.28,-.12,1.4],[.1,-.11,1.85],[-.1,-.11,1.85]],[[-.28,0,1.4],[.28,0,1.4],[.1,-.03,1.85],[-.1,-.03,1.85]],e,V.wood),t.geometry()}function M0(s,t){const e=st("#5e3d27",.1,t),n=st("#9c7a52",.1,t);for(const i of[1,-1])s.box(.09*i,0,-.3,.05,.1,3,e,V.wood),mn(s,[.09*i,.05,1.18],[.09*i,.22,1.8],.05,.1,e,V.wood);for(const i of[-1.6,-.95,-.3,.35,1])s.box(0,.1,i,.3,.03,.07,e,V.wood);s.box(0,.13,-.2,.24,.03,2.4,n,V.kapa)}const nl=.16;function $M(s){const t=new te;return M0(t,s),t.geometry()}function KM(s){const t=new te;M0(t,s);const e=Ta("prone",s),n=e.attributes.position.array,i=e.attributes.normal.array,o=e.attributes.color.array,a=e.attributes.aMat.array;for(let l=0;l<n.length;l+=3)t.pos.push(n[l],n[l+1]+nl,n[l+2]+.5),t.nor.push(i[l],i[l+1],i[l+2]),t.col.push(o[l],o[l+1],o[l+2]),t.mat.push(a[l/3]);const r=st("#7a4b30",.1,s);for(const l of[1,-1])mn(t,[.25*l,nl+.2,.95],[.12*l,nl+.02,1.5],.1,.1,r,V.skin);return t.geometry()}function ZM(s){const t=new te,e=st("#1d1d22",.1,s),n=[[[0,0,.6],[-1.1,.25,-.1],[0,0,-.3]],[[0,0,.6],[0,0,-.3],[1.1,.25,-.1]],[[-1.1,.25,-.1],[-2,-.1,-.5],[-.6,.15,-.25]],[[1.1,.25,-.1],[.6,.15,-.25],[2,-.1,-.5]],[[0,0,-.3],[-.25,0,-1],[.25,0,-1]]];for(const[i,o,a]of n)t.tri(i,o,a,e,V.plain),t.tri(i,a,o,e,V.plain);return t.geometry()}function JM(s,t,e,n,i,o,a,r,l){const c=e-s,h=n-t,u=a-i,f=r-o,d=s-i,v=t-o,g=c*c+h*h,x=c*u+h*f,p=u*u+f*f,m=c*d+h*v,M=u*d+f*v,_=g*p-x*x,E=A=>Math.max(0,Math.min(1,A));let y=_>1e-12?E((x*M-p*m)/_):0,w=(x*y+M)/p;return w<0?(w=0,y=E(-m/g)):w>1&&(w=1,y=E((x-m)/g)),l.x=d+c*y-u*w,l.z=v+h*y-f*w,l.d=Math.hypot(l.x,l.z),l}const QM=`
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
`,t2=`
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
`;class e2{constructor(t){this.app=t,this._m=new ie,this._q=new ji,this._p=new q,this._s=new q,this._e=new Ro,this._c=new It;const e=t.island.meta,n=e.sites,i=wi(e.seed+2024);this.rand=i,this.group=new En,this.mat=ks(t.shared,{fade:[24,34]});const o=t.terrain,a=(w,A)=>Math.max(0,o.heightAt(w,A)),r=wi(e.seed+2025),l=t.features.holuaPath;this.frand=wi(e.seed+2026),this.spot={x:0,z:0},this.folk=[],this.folkSites=[],this.placeFolk(n,r,l),XM(i,n),this.buildFolk(i),this.trail=e.trail.slice();let c=0;for(let w=0;w<this.trail.length;w++){const A=this.trail[w],b=this.trail[(w+1)%this.trail.length];c+=A[0]*b[1]-b[0]*A[1]}c<0&&this.trail.reverse(),this.trailLen=[0];for(let w=1;w<=this.trail.length;w++){const A=this.trail[w-1],b=this.trail[w%this.trail.length];this.trailLen.push(this.trailLen[w-1]+Math.hypot(b[0]-A[0],b[1]-A[1]))}const h=n.alii||n.villages[0];let u=0,f=1/0;for(let w=0;w<this.trail.length;w++){const A=Math.hypot(this.trail[w][0]-h.x,this.trail[w][1]-h.z);A<f&&(f=A,u=this.trailLen[w])}this.procS=u-.6;const d=new te;Yv(d,i),this.akua=new ue(d.geometry(),this.mat),this.akua.frustumCulled=!1,this.group.add(this.akua),this.boats=[];const v=(()=>{const w=new te;return d0(w,i,8),w.geometry()})(),g=$r("sit",i),x=e.ahupuaa.find(w=>w.id===n.model);for(let w=0;w<4;w++){const A=n.canoes[w%n.canoes.length],b=w<3&&x?x.mouth:[A.x,A.z],S=w<3?Math.atan2(x.mouth[1]-x.topZ,x.mouth[0]-x.topX):A.dir,R=5+i()*5,k=b[0]+Math.cos(S)*R+(i()-.5)*3,I=b[1]+Math.sin(S)*R+(i()-.5)*3;if(o.heightAt(k,I)>-.02)continue;const T=new En,C=new ue(v,this.mat);C.scale.setScalar(lt),T.add(C);for(const F of[-1.6,1.4]){const N=new ue(g,this.mat);N.scale.setScalar(lt),N.position.set(F*lt,.45*lt,0),N.rotation.y=Math.PI/2,T.add(N)}T.position.set(k,0,I),T.rotation.y=i()*6.28,this.group.add(T),this.boats.push({g:T,x:k,z:I,ph:i()*6.28,drift:i()*6.28,crew:2})}const p=new te;p0(p,i),this.voyager=new ue(p.geometry(),this.mat),this.voyager.scale.setScalar(lt),this.voyager.frustumCulled=!1,this.group.add(this.voyager),this.voyagerS=0,this.breaks=[],this.surfers=[];for(const w of n.surf){const A=this.layBreak(w,o,n.ponds);if(!A)continue;this.breaks.push(A);let b=A.tx[0]-(A.tx[0]*A.nx[0]+A.tz[0]*A.nz[0])*A.nx[0],S=A.tz[0]-(A.tx[0]*A.nx[0]+A.tz[0]*A.nz[0])*A.nz[0];const R=Math.hypot(b,S)||1;b/=R,S/=R;for(let k=0;k<3;k++){const I=k-1,T=r()*.04,C=A.lineX+b*I*.11+A.nx[0]*T,F=A.lineZ+S*I*.11+A.nz[0]*T,N={brk:A,state:"sit",x:C,z:F,slotX:C,slotZ:F,head:A.seaHead+(r()-.5)*.3,look:(r()-.5)*.3,since:-r()*60};Object.assign(N,{s:0,ph:r()*6.28,scale:.92+r()*.2,pace:.85+r()*.3,tint:r()<.3?2.2:.75+r()*.3,wave:0,take:0,lead:.05,tTake:0,a0:0,dur:0,fall:!1,t:0,sx:0,sz:0,fx:0,fz:0,wx:0,wz:0,leg:0}),Object.assign(N,{pose:"sit",pitch:0,roll:0,stroke:0,tilt:!0,tried:!1}),A.surfers.push(N),this.surfers.push(N)}}const m=Math.max(1,this.surfers.length),M=(w,A)=>{const b=new xo(w,this.mat,A);return b.frustumCulled=!1,b.instanceMatrix.setUsage(vi),b.count=0,this.group.add(b),b};if(this.boards=M(YM(r),m),this.boards.instanceColor=new si(new Float32Array(m*3).fill(1),3),this.surfPose={ride:M(Ta("ride",r),m),sit:M(Ta("sit",r),m),prone:M(Ta("prone",r),m)},this.arms=M(jM(r),m*2),this._sw={age:0,height:0,next:0,id:0},this._sep={d:0,x:0,z:0},this._mb=new ie,this._ml=new ie,this._ma=new ie,this.view={x:0,z:0,dist:1/0,remain:0},this.counts={board:0,ride:0,sit:0,prone:0,arm:0},this.holua=null,l&&l.length>1){const w=l.length,A={x:new Float32Array(w),y:new Float32Array(w),z:new Float32Array(w),n:w,riders:[],runner:null,time:0,next:6+r()*20,watching:!1};for(let I=0;I<w;I++)A.x[I]=l[I][0],A.y[I]=l[I][1]+LM,A.z[I]=l[I][2];A.len=Math.hypot(A.x[w-1]-A.x[0],A.z[w-1]-A.z[0]),A.ds=A.len/(w-1),A.dx=(A.x[w-1]-A.x[0])/A.len,A.dz=(A.z[w-1]-A.z[0])/A.len,A.head=Math.atan2(A.dx,A.dz),this.clearTrack(A);const b=10;for(let I=0;I<b;I++){const T=I%2?1:-1,C=(I>>1)*.035,F={state:I<2?"wait":"walk",s:0,v:0,t:0,since:-I,side:T,ph:r()*6.28,pace:.9+r()*.2};F.spotS=-.02-C,F.spotOff=T*(.09+C*.6),F.wayOff=T*(.14+C*.6),F.s=I<2?0:A.len*(.1+.85*(I-2)/(b-2)),A.riders.push(F)}A.tAt=new Float32Array(w),A.vAt=new Float32Array(w);const S={s:wn,v:1.5};let R=0,k=0;for(let I=!1;k<w&&R<600;R+=.05){for(;k<w&&k*A.ds<=S.s;)A.tAt[k]=R,A.vAt[k]=S.v,k++;if(I)break;I=this.slide(A,S,.05)}for(;k<w;k++)A.tAt[k]=R,A.vAt[k]=0;this.holua=A,this._pose={y:0,pitch:0},this.sleds=M($M(r),b),this.sledders=M(KM(r),1)}this.birds=new xo(ZM(i),this.mat,12),this.birds.frustumCulled=!1,this.birds.instanceMatrix.setUsage(vi),this.group.add(this.birds),this.birdCentres=[];for(let w=0;w<12;w++){const A=n.villages[Math.floor(i()*n.villages.length)];this.birdCentres.push({x:A.x+(i()-.5)*6,z:A.z+(i()-.5)*6,r:.6+i()*1.4,h:.9+i()*1.4,ph:i()*6.28,sp:.08+i()*.06})}const _=[],E=[];for(const w of n.villages)for(let A=0;A<14;A++)_.push(w.x+.05,a(w.x,w.z)+.01,w.z+.05),E.push(A/14+i()*.05);const y=new Fe;y.setAttribute("position",new pe(_,3)),y.setAttribute("aSeed",new pe(E,1)),y.setAttribute("aAge",new pe(new Float32Array(E.length),1)),this.smoke=new Xu(y,new Ce({vertexShader:QM,fragmentShader:t2,uniforms:{uTime:t.shared.uniforms.uTime,uWindVec:t.shared.uniforms.uWindVec,uSkyColor:t.shared.uniforms.uSkyColor,uSunColor:t.shared.uniforms.uSunColor},transparent:!0,depthWrite:!1})),this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,this.group.add(this.smoke)}layBreak(t,e,n){const i=this.app.ocean.swellDir,o=(R,k)=>-e.metresAt(R,k),a=.03,r=(R,k)=>(o(R+a,k)-o(R-a,k))/(2*a),l=(R,k)=>(o(R,k+a)-o(R,k-a))/(2*a),c=Math.cos(t.dir),h=Math.sin(t.dir);let u=null,f=0;for(let R=0;R<1.6;R+=.01)if(o(t.x+c*R,t.z+h*R)>=Yr){u=t.x+c*R,f=t.z+h*R;break}if(u===null)return null;const d=(R,k,I,T)=>{if(o(R-I*.1,k-T*.1)<.02)return!1;for(const C of n)if(!(Math.hypot(C.cx-R,C.cz-k)>C.r+1.5)){if(fo(C.wall,R,k))return!1;for(const F of C.wall)if(Math.hypot(F[0]-R,F[1]-k)<.25)return!1}return!0},v=R=>{const k=[];let I=u,T=f;for(let C=0;C<70;C++){const F=r(I,T),N=l(I,T),z=Math.hypot(F,N);if(z<4)break;let U=-N/z,L=F/z;if(U*i[0]+L*i[1]<0&&(U=-U,L=-L),U*i[0]+L*i[1]<.3)break;I+=U*.03*R,T+=L*.03*R;for(let W=0;W<4;W++){const j=r(I,T),P=l(I,T),O=j*j+P*P;if(O<1)break;const G=Yr-o(I,T);I+=j*G/O,T+=P*G/O}if(!d(I,T,F/z,N/z))break;k.push([I,T])}return k};if(!d(u,f,c,h))return null;const g=v(-1).reverse(),x=[...g,[u,f],...v(1)],p=[0];for(let R=1;R<x.length;R++)p.push(p[R-1]+Math.hypot(x[R][0]-x[R-1][0],x[R][1]-x[R-1][1]));const m=p[p.length-1];if(m<.5)return null;const M=Math.min(1.4,m),_=Math.min(p[g.length],m-M),E=.03,y=Math.floor(M/E)+1,w={n:y,step:E,len:(y-1)*E,x:new Float32Array(y),z:new Float32Array(y),tx:new Float32Array(y),tz:new Float32Array(y),nx:new Float32Array(y),nz:new Float32Array(y),g:new Float32Array(y),surfers:[],called:-1,lastT:0,watching:!1,eager:!1};let A=0;for(let R=0;R<y;R++){const k=_+R*E;for(;A<p.length-2&&p[A+1]<k;)A++;const I=Math.max(0,Math.min(1,(k-p[A])/Math.max(1e-6,p[A+1]-p[A])));w.x[R]=x[A][0]+(x[A+1][0]-x[A][0])*I,w.z[R]=x[A][1]+(x[A+1][1]-x[A][1])*I}for(let R=0;R<y;R++){const k=r(w.x[R],w.z[R]),I=l(w.x[R],w.z[R]),T=Math.hypot(k,I)||1;w.nx[R]=k/T,w.nz[R]=I/T;const C=Math.max(0,R-1),F=Math.min(y-1,R+1),N=Math.hypot(w.x[F]-w.x[C],w.z[F]-w.z[C])||1;w.tx[R]=(w.x[F]-w.x[C])/N,w.tz[R]=(w.z[F]-w.z[C])/N;const z=(w.x[R]-w.x[0])*i[0]+(w.z[R]-w.z[0])*i[1];w.g[R]=R?Math.max(z,w.g[R-1]+1e-4):0}let b=w.x[0]+w.nx[0]*.1,S=w.z[0]+w.nz[0]*.1;for(let R=0;R<3&&o(b,S)<Yr+2;R++)b+=w.nx[0]*.02,S+=w.nz[0]*.02;return w.lineX=b,w.lineZ=S,w.seaHead=Math.atan2(w.nx[0],w.nz[0]),w}clearTrack(t){const e=this.app.vegetation;if(!e||!e.cleared)return;const n=e.cleared,i=le,o=Vt/i,a=.24+.5*o*(Math.abs(t.dx)+Math.abs(t.dz)),r=-.2-a,l=t.len+a,c=[t.x[0]+t.dx*r,t.x[0]+t.dx*l],h=[t.z[0]+t.dz*r,t.z[0]+t.dz*l],u=Math.max(0,Math.floor((Math.min(...c)-a+ht)/o)),f=Math.min(i-1,Math.floor((Math.max(...c)+a+ht)/o)),d=Math.max(0,Math.floor((Math.min(...h)-a+ht)/o)),v=Math.min(i-1,Math.floor((Math.max(...h)+a+ht)/o));for(let g=d;g<=v;g++)for(let x=u;x<=f;x++){const p=-ht+(x+.5)*o-t.x[0],m=-ht+(g+.5)*o-t.z[0],M=p*t.dx+m*t.dz;M>r&&M<l&&Math.abs(m*t.dx-p*t.dz)<a&&(n[g*i+x]=1)}e.tiles&&e.tiles.size&&(e.tiles.clear(),e.lastSelection="")}breakNear(t,e){let n=null,i=3;for(const o of this.breaks){const a=Math.hypot(o.x[0]-t,o.z[0]-e);a<i&&(i=a,n=o)}return n}breakS(t,e){const n=t.g;if(e<=0)return 0;if(e>=n[t.n-1])return t.len;let i=0,o=t.n-1;for(;i<o-1;){const a=i+o>>1;n[a]<=e?i=a:o=a}return(i+(e-n[i])/(n[o]-n[i]))*t.step}placeFolk(t,e,n){const i=this.app.terrain,o=this.frand,{open:a,room:r,take:l,clearWalk:c,linesClear:h,plantsClear:u}=this.openGround();this.open=a,this.clearWalk=c,this.linesClear=h;let f=null;const d=(p,m)=>{f={x:p,z:m,y:Math.max(0,i.heightAt(p,m)),r:0,i0:this.folk.length,i1:0},this.folkSites.push(f)},v=()=>{f.i1=this.folk.length;for(let p=f.i0;p<f.i1;p++)f.r=Math.max(f.r,Math.hypot(this.folk[p].x-f.x,this.folk[p].z-f.z));f.i1===f.i0&&this.folkSites.pop()},g=(p,m,M,_,E={})=>{const y=this.figure(p,m,M,_,E);return this.folk.push(y),y},x=(p,m)=>{for(let M=0;M<30&&p.length;M++){const _=p[Math.floor(o()*p.length)];if(m(_))return _}return null};for(const p of t.villages){d(p.x,p.z);const m=p.model||p.alii,M=[];for(const T of t.houses){if(T.village!==p.id||Math.hypot(T.x-p.x,T.z-p.z)>1.6)continue;const[C,F]=va[T.kind]||va.noa,N=T.scale||1,z=Math.cos(T.rot),U=Math.sin(T.rot),L=(C*N/2+1.7)*lt,W=(F*N/2+1.7)*lt,j=C*N*lt/4;for(const[P,O,G]of[[L,0,!1],[-L,0,!1],[j,W,!0],[-j,W,!0],[j,-W,!0],[-j,-W,!0]]){const K=G?0:Math.sign(P),Q=G?Math.sign(O):0;M.push({x:T.x+P*z-O*U,z:T.z+P*U+O*z,yaw:Math.atan2(K*z-Q*U,K*U+Q*z),wall:G})}}const _=[];for(let T=0;T<40;T++){const C=o()*Math.PI*2,F=Math.sqrt(o())*.6;_.push({x:p.x+Math.cos(C)*F,z:p.z+Math.sin(C)*F,yaw:o()*Math.PI*2,wall:!1})}const E=(T,C=.012,F=.35)=>a(T.x,T.z,C,F)&&r(T.x,T.z,C),y=T=>{const C=x(M,F=>{if(!F.wall||!E(F,.011,.2))return!1;const N=F.x+Math.sin(F.yaw)*.5*lt,z=F.z+Math.cos(F.yaw)*.5*lt;return a(N,z,.012,.2)&&r(N,z,.012)});C&&(g(T,C.x,C.z,C.yaw,{body:"seat"}),l(C.x,C.z,.011),l(C.x+Math.sin(C.yaw)*.5*lt,C.z+Math.cos(C.yaw)*.5*lt,.012))};(m||o()<.4)&&y("poi"),m&&y("kapa");const w=T=>{const C=x(_,N=>E(N,.034,.2));if(!C)return;const F=o()*Math.PI*2;for(let N=0;N<T;N++){const z=F+N/T*Math.PI*2+(o()-.5)*.5,U=C.x+Math.sin(z)*.019,L=C.z+Math.cos(z)*.019;!a(U,L,.008,.2)||!r(U,L,.008)||(g("sit",U,L,z+Math.PI+(o()-.5)*.4,{body:"sit"}),l(U,L,.009))}};m?w(3):o()<.5&&w(2);const A=x(M,T=>!T.wall&&E(T,.009,.2));A&&(g("sit",A.x,A.z,A.yaw+(o()-.5)*.6,{body:"sit"}),l(A.x,A.z,.009));const b=()=>{for(let T=0;T<10;T++){const C=x(o()<.5?M:_,U=>E(U,.011));if(!C)return;const F=o()*Math.PI*2,N=C.x+Math.sin(F)*.021,z=C.z+Math.cos(F)*.021;if(!(!a(N,z,.011)||!r(N,z,.011))){g("talk",C.x,C.z,F),g("talk",N,z,F+Math.PI),l(C.x,C.z,.011),l(N,z,.011);return}}};for(let T=p.alii?2:m||o()<.5?1:0;T>0;T--)b();const S=x(M,T=>E(T,.011));S&&(g("idle",S.x,S.z,S.yaw+(o()-.5)*.8),l(S.x,S.z,.011));const R=[...M,..._];for(let T=R.length-1;T>0;T--){const C=Math.floor(o()*(T+1)),F=R[T];R[T]=R[C],R[C]=F}const k=[];for(const T of R){if(k.length>=(m?30:12))break;!k.some(C=>Math.hypot(C.x-T.x,C.z-T.z)<.04)&&E(T,.01)&&k.push(T)}const I={n:k.length,x:new Float32Array(k.length),z:new Float32Array(k.length),yaw:new Float32Array(k.length),busy:new Uint8Array(k.length),walkers:[]};k.forEach((T,C)=>{I.x[C]=T.x,I.z[C]=T.z,I.yaw[C]=T.yaw});for(let T=m?3:1,C=0;T>0&&C<I.n;T--,C++){I.busy[C]=1;const F=g("walk",I.x[C],I.z[C],I.yaw[C],{home:I,steps:64});F.spot=C,I.walkers.push(F)}v()}for(const p of t.loi){const m=p.paddies.filter(b=>b.flood);if(!m.length)continue;let M=0,_=0;for(const b of p.paddies)M+=b.c[0]/p.paddies.length,_+=b.c[1]/p.paddies.length;d(M,_);const E=this.thickest(p),y=m.filter(b=>Math.hypot(b.c[0]-E.c[0],b.c[1]-E.c[1])<1.5),w=[];for(let b=p.model?16:5;b>0;b--){const S=y.length&&o()<.6?y:m,R=S[Math.floor(o()*S.length)];if(!this.spotIn(R,w,o,null))continue;const k=g("loi",this.spot.x,this.spot.z,o()*Math.PI*2,{floor:(R.level-.25)*qt,home:R,steps:24});k.mates=w,w.push(k)}const A=p.model||o()<.4?this.bankWalk(p,E.c[0],E.c[1],h,u):null;if(A){const b=g("carry",A.ax,A.az,Math.atan2(A.bx-A.ax,A.bz-A.az),{floor:A.y,steps:72});Object.assign(b,A)}v()}for(const p of t.canoes){d(p.x,p.z);const m=Math.cos(p.dir),M=Math.sin(p.dir),_=(A,b)=>Math.atan2(A*m-b*M,A*M+b*m),E=[];for(let A=0;A<p.n;A++){const b=(A-(p.n-1)/2)*.09;E.push([b+.017,-1]),A===0&&E.push([b-.06,1])}const y=p.village===t.model,w=[];for(let A=y?4:2;A>0;A--)for(let b=0;b<10;b++){const[S,R]=E[Math.floor(o()*E.length)],k=(o()-.5)*.1,I=p.x+k*m-S*M,T=p.z+k*M+S*m;if(!a(I,T,.008)||!r(I,T,.014))continue;const C=g("crew",I,T,_(0,R),{steps:24});C.face=_(0,R),C.sea=_(1,0),C.home={x:p.x,z:p.z,cs:m,sn:M,lz:S,crew:w},w.push(C),l(I,T,.012);break}if(y)for(let A=0;A<20;A++){const b=-.115-o()*.055,S=(o()-.5)*(p.n*.09+.1),R=p.x+b*m-S*M,k=p.z+b*M+S*m,I=_(1,0)+(o()-.5)*.8,T=R+Math.sin(I)*.95*lt,C=k+Math.cos(I)*.95*lt;if(!(!a(R,k,.01,.2)||!r(R,k,.012)||!a(T,C,.014,.15)||!r(T,C,.014))){g("mend",R,k,I,{body:"seat"}),l(R,k,.012),l(T,C,.014);break}}v()}for(const p of t.ponds){const m=this.gateSpot(p);d(m.x,m.z),g("keeper",m.x,m.z,m.yaw,{floor:NM}),v()}for(const p of t.heiau){if(!(p.model||p.kind==="luakini"))continue;const m=p.kind==="luakini",M=m?1:.6,_=p.court??Math.max(0,i.heightAt(p.x,p.z))+(m?4.8:2.4)*lt,E=Math.cos(p.rot),y=Math.sin(p.rot);d(p.x,p.z);const w=[];for(let A=0,b=0;A<3&&b<30;b++){const S=(.6+o()*3.4)*M*lt,R=-(1.6+o()*4)*M*lt,k=p.x+S*E-R*y,I=p.z+S*y+R*E;w.some(T=>Math.hypot(T[0]-k,T[1]-I)<.02)||(w.push([k,I]),g("priest",k,I,Math.atan2(-E,-y)+(o()-.5)*.6,{floor:_,tint:2.4}),A++)}v()}if(n&&n.length>1){const p=n[0],m=n[n.length-1],M=Math.hypot(m[0]-p[0],m[2]-p[2]),_=(m[0]-p[0])/M,E=(m[2]-p[2])/M;d((p[0]+m[0])/2,(p[2]+m[2])/2);const y=(w,A,b)=>{const S=p[0]+_*w-E*A,R=p[2]+E*w+_*A,k=Math.atan2(E*A,-_*A)+(e()-.5)*.6;b==="sit"?g("sit",S,R,k,{body:"sit"}):g("watch",S,R,k)};for(let w=0;w<16;w++)y(M-.05-e()*.7,(w%2?-1:1)*(.125+e()*.075),e()<.6?"stand":"sit");for(let w=0;w<4;w++)y(M*(.35+e()*.4),(e()<.5?-1:1)*(.125+e()*.075),"sit");for(let w=0;w<3;w++)y(.04+e()*.12,-(.13+e()*.07),"stand");v()}}openGround(){var j;const t=this.app,e=t.terrain,n=t.island.meta,i=n.sites,o=t.vegetation,a=.25,r=(P,O)=>(P+2048)*4096+O+2048,l=(P,O)=>r(Math.floor(P/a),Math.floor(O/a)),c=(P,O,G,K,Q,ot)=>{for(let $=Math.floor(O/a);$<=Math.floor(K/a);$++)for(let Y=Math.floor(G/a);Y<=Math.floor(Q/a);Y++){const rt=r($,Y),X=P.get(rt);X?X.push(ot):P.set(rt,[ot])}},h=Math.ceil(Vt)+2,u=new Uint8Array(h*h),f=(P,O)=>(Math.floor(P+ht)+1)*h+Math.floor(O+ht)+1,d=(P,O,G)=>{for(let K=Math.floor(P-G);K<=Math.floor(P+G);K++)for(let Q=Math.floor(O-G);Q<=Math.floor(O+G);Q++)u[f(K,Q)]=1};for(const P of i.villages)d(P.x,P.z,2.3);for(const P of i.canoes)d(P.x,P.z,.8);for(const P of i.loi){d(this.thickest(P).c[0],this.thickest(P).c[1],1.2);for(const O of P.paddies)O.flood&&d(O.c[0],O.c[1],.3)}const v=(P,O)=>u[f(P,O)]===1,g=[],x=new Map,p=(P,O,G,K,Q)=>{const ot=Math.max(1,Math.ceil(Math.hypot(G-P,K-O)/.5));let $=!1;for(let rt=0;rt<=ot&&!$;rt++)$=v(P+(G-P)*rt/ot,O+(K-O)*rt/ot);if(!$)return;const Y=Q+.04;c(x,Math.min(P,G)-Y,Math.min(O,K)-Y,Math.max(P,G)+Y,Math.max(O,K)+Y,g.length),g.push(P,O,G,K,Q)};for(const P of((j=t.wailele)==null?void 0:j.lines)||zo(n,t.island.data)){const O=Math.min(.11,.009*Math.sqrt(P.lineA)+.012)*1.4+.008;for(let G=1;G<P.pts.length;G++)p(P.pts[G-1][0],P.pts[G-1][1],P.pts[G][0],P.pts[G][1],O)}for(const P of i.loi)for(const O of P.auwai)for(let G=1;G<O.length;G++)Math.hypot(O[G][0]-O[G-1][0],O[G][1]-O[G-1][1])<1.2&&p(O[G-1][0],O[G-1][1],O[G][0],O[G][1],.013);for(const P of i.ponds)for(let O=1;O<P.wall.length;O++)p(P.wall[O-1][0],P.wall[O-1][1],P.wall[O][0],P.wall[O][1],.06);const m=t.features.holuaPath;if(m)for(let P=1;P<m.length;P++)p(m[P-1][0],m[P-1][2],m[P][0],m[P][2],.065);const M=t.features.puuhonuaWall;M&&p(M.a[0],M.a[2],M.b[0],M.b[2],.05);const _=[],E=new Map,y=(P,O,G,K,Q,ot,$)=>{const Y=Math.hypot(Math.max(-K,Q),Math.max(-ot,$))+.04;c(E,P-Y,O-Y,P+Y,O+Y,_.length),_.push(P,O,Math.cos(G),Math.sin(G),K,Q,ot,$)};for(const P of i.houses){const[O,G]=va[P.kind]||va.noa,K=P.scale||1,Q=(O*K+1.8)/2*lt,ot=(G*K+1.8)/2*lt;y(P.x,P.z,P.rot,-Q,Q,-ot,ot)}const w=(t.features.footings||[]).filter(P=>P.box&&(P.kind==="heiau"||P.kind==="luakini"));for(const P of w)y(P.box.x,P.box.z,Math.atan2(P.box.s,P.box.c),-P.box.hx,P.box.hx,-P.box.hz,P.box.hz);if(!w.length)for(const P of i.heiau){const O=P.kind==="luakini",G=(O?44:26)/2*lt,K=(O?30:18)/2*lt;y(P.x,P.z,P.rot,-G,G,-K,K)}for(const P of i.canoes){for(let O=0;O<P.n;O++){const G=(O-(P.n-1)/2)*.09;y(P.x,P.z,P.dir,-.095,.095,G-.043,G+.008)}if(P.house){const O=P.shed||{x:P.x-Math.cos(P.dir)*.32,z:P.z-Math.sin(P.dir)*.32,rot:P.dir};y(O.x,O.z,O.rot,-.135,.135,-.055,.055)}}const A=i.alii&&i.canoes.find(P=>P.village===i.alii.id);A&&y(A.x,A.z,A.dir,-.16,.16,.4,.5);for(const P of i.ponds)if(P.keeper)y(P.keeper.x,P.keeper.z,P.keeper.rot,-2.9*lt,2.9*lt,-2.4*lt,2.4*lt);else if(P.keeper===void 0){const O=P.wall[Math.round(P.gates[0]*(P.wall.length-1))];y(O[0]-P.ax*.12,O[1]-P.az*.12,0,-.066,.066,-.066,.066)}for(const P of i.villages)P.imu&&y(P.imu.x,P.imu.z,0,-1.3*lt,1.3*lt,-1.3*lt,1.3*lt);for(const P of i.saltpans||[])y(P.x,P.z,P.dir+Math.PI/2,-.22,.22,-.135,.135);const b=i.puuhonua;if(b){const P=Math.cos(b.dir),O=Math.sin(b.dir),G=b.heiau===void 0?{x:b.x-P*.5,z:b.z-O*.5,rot:b.dir}:b.heiau;G&&y(G.x,G.z,G.rot,-13*lt,13*lt,-9*lt,9*lt),y(b.x-P*.05,b.z-O*.05,b.dir,-.02,.02,-.33,.33);for(let K=0;K<3;K++){const Q=b.houses?b.houses[K]:{x:b.x-P*1.1-O*(K-1)*.6,z:b.z-O*1.1+P*(K-1)*.6,rot:b.dir+Math.PI/2};Q&&y(Q.x,Q.z,Q.rot,-3.9*lt,3.9*lt,-2.9*lt,2.9*lt)}}const S=new Map;if(o&&o.fixed)for(const P in o.fixed){const O=UM[P]||.8;for(const G of o.fixed[P]){if(!v(G.x,G.z))continue;const K=O*G.s;c(S,G.x-K-.04,G.z-K-.04,G.x+K+.04,G.z+K+.04,[G.x,G.z,K])}}const R=i.loi.map(P=>{let O=1/0,G=-1/0,K=1/0,Q=-1/0;for(const ot of P.paddies)for(const $ of ot.poly)O=Math.min(O,$[0]),G=Math.max(G,$[0]),K=Math.min(K,$[1]),Q=Math.max(Q,$[1]);return[O,G,K,Q]}),k=le,I=(P,O)=>{if(!o)return!0;const G=Math.floor((P+ht)/Vt*k),K=Math.floor((O+ht)/Vt*k);if(G<0||K<0||G>=k||K>=k)return!0;const Q=K*k+G;return o.land[Q*4+1]>.2*255||o.land[Q*4+3]>.3*255||o.cleared[Q]===1||e.metresAt(P,O)<3},T=(P,O,G)=>{const K=x.get(l(P,O));if(!K)return!0;for(let Q=0;Q<K.length;Q++){const ot=K[Q];if(Ps(P,O,g[ot],g[ot+1],g[ot+2],g[ot+3])<g[ot+4]+G)return!1}return!0},C=(P,O,G)=>{const K=S.get(l(P,O));if(!K)return!0;for(let Q=0;Q<K.length;Q++)if(Math.hypot(K[Q][0]-P,K[Q][1]-O)<K[Q][2]+G)return!1;return!0},F=(P,O,G)=>{const K=E.get(l(P,O));if(K)for(let Q=0;Q<K.length;Q++){const ot=K[Q],$=P-_[ot],Y=O-_[ot+1],rt=$*_[ot+2]+Y*_[ot+3],X=-$*_[ot+3]+Y*_[ot+2];if(rt>_[ot+4]-G&&rt<_[ot+5]+G&&X>_[ot+6]-G&&X<_[ot+7]+G)return!1}return!0},N=(P,O,G,K=.35)=>{if(e.metresAt(P,O)<.6||!C(P,O,G)||!F(P,O,G)||!I(P,O)||!I(P+.015,O)||!I(P-.015,O)||!I(P,O+.015)||!I(P,O-.015))return!1;const Q=.012,ot=e.metresAt(P+Q,O)-e.metresAt(P-Q,O),$=e.metresAt(P,O+Q)-e.metresAt(P,O-Q);if(Math.hypot(ot,$)/(2*Q/lo)>K||!T(P,O,G))return!1;for(let Y=0;Y<i.loi.length;Y++){const rt=R[Y];if(P<rt[0]-.05||P>rt[1]+.05||O<rt[2]-.05||O>rt[3]+.05)continue;const X=i.loi[Y].paddies;for(let Mt=0;Mt<X.length;Mt++){const mt=X[Mt];if(!(Math.abs(mt.c[0]-P)>.45||Math.abs(mt.c[1]-O)>.45)&&(fo(mt.poly,P,O)||Ma(mt.poly,P,O)<G+.006))return!1}}return!0},z=new Map,U=(P,O,G)=>{const K=z.get(l(P,O));if(!K)return!0;for(let Q=0;Q<K.length;Q++)if(Math.hypot(K[Q][0]-P,K[Q][1]-O)<G+K[Q][2])return!1;return!0};return{open:N,room:U,take:(P,O,G)=>c(z,P-G-.04,O-G-.04,P+G+.04,O+G+.04,[P,O,G]),clearWalk:(P,O,G,K)=>{const Q=Math.ceil(Math.hypot(G-P,K-O)/.014);for(let ot=1;ot<Q;ot++){const $=P+(G-P)*ot/Q,Y=O+(K-O)*ot/Q;if(!N($,Y,.008)||!U($,Y,.008))return!1}return!0},linesClear:T,plantsClear:C,boxesClear:F}}thickest(t){if(this.thick=this.thick||new Map,this.thick.has(t))return this.thick.get(t);let e=t.paddies[0],n=-1;for(let i=0;i<t.paddies.length;i+=4){const o=t.paddies[i];let a=0;for(const r of t.paddies)Math.abs(r.c[0]-o.c[0])<1.6&&Math.abs(r.c[1]-o.c[1])<1.6&&Math.hypot(r.c[0]-o.c[0],r.c[1]-o.c[1])<1.6&&a++;a>n&&(n=a,e=o)}return this.thick.set(t,e),e}spotIn(t,e,n,i){let o=1/0,a=-1/0,r=1/0,l=-1/0;for(const c of t.poly)o=Math.min(o,c[0]),a=Math.max(a,c[0]),r=Math.min(r,c[1]),l=Math.max(l,c[1]);for(let c=0;c<14;c++){let h,u;if(i){const d=n()*Math.PI*2,v=.025+n()*.045;h=i.x+Math.sin(d)*v,u=i.z+Math.cos(d)*v}else h=o+n()*(a-o),u=r+n()*(l-r);if(!fo(t.poly,h,u)||Ma(t.poly,h,u)<.016||!this.linesClear(h,u,.006)||i&&Ma(t.poly,(h+i.x)/2,(u+i.z)/2)<.016||i&&(!this.linesClear((h+i.x)/2,(u+i.z)/2,.006)||!this.linesClear((h*3+i.x)/4,(u*3+i.z)/4,.006)||!this.linesClear((h+i.x*3)/4,(u+i.z*3)/4,.006)))continue;let f=!0;for(let d=0;d<e.length&&f;d++){const v=e[d];f=v===i||Math.hypot(v.x-h,v.z-u)>=.03&&Math.hypot(v.tx-h,v.tz-u)>=.03&&(!i||el(v.x,v.z,v.tx,v.tz,i.x,i.z,h,u)>=.014)}if(f)return this.spot.x=h,this.spot.z=u,!0}return!1}bankWalk(t,e,n,i,o){const a=this.app.terrain,r=f=>{const d=[1/0,-1/0,1/0,-1/0];for(const v of f.poly)d[0]=Math.min(d[0],v[0]),d[1]=Math.max(d[1],v[0]),d[2]=Math.min(d[2],v[1]),d[3]=Math.max(d[3],v[1]);return d},l=new Map(t.paddies.map(f=>[f,r(f)])),c=t.paddies.map(f=>[Math.hypot(f.c[0]-e,f.c[1]-n),f]).sort((f,d)=>f[0]-d[0]).slice(0,16);let h=null,u=-1/0;for(const[,f]of c){const d=l.get(f),v=t.paddies.filter(x=>{const p=l.get(x);return x!==f&&p[0]<d[1]+.02&&p[1]>d[0]-.02&&p[2]<d[3]+.02&&p[3]>d[2]-.02}),g=f.poly;for(let x=0;x<g.length;x++){const p=g[x],m=g[(x+1)%g.length],M=Math.hypot(m[0]-p[0],m[1]-p[1]);if(M<.12)continue;let _=1/0,E=-1/0,y=!0;for(let A=.15;A<.9&&y;A+=.35){const b=p[0]+(m[0]-p[0])*A,S=p[1]+(m[1]-p[1])*A;let R=(f.level+.35)*qt;for(const k of v)(Ma(k.poly,b,S)<.008||fo(k.poly,b,S))&&(R=Math.max(R,(k.level+.35)*qt));R=Math.max(R,Fn(a,b,S)),_=Math.min(_,R),E=Math.max(E,R),y=E-_<.0012&&i(b,S,.01)&&o(b,S,.01)}if(!y)continue;const w=M-Math.hypot((p[0]+m[0])/2-e,(p[1]+m[1])/2-n)*.3;if(w>u){u=w;const A=(m[0]-p[0])/M,b=(m[1]-p[1])/M;h={ax:p[0]+A*.03,az:p[1]+b*.03,bx:m[0]-A*.03,bz:m[1]-b*.03,y:E}}}}return h}gateSpot(t){const e=t.wall,n=e.length,i=[0];for(let v=1;v<n;v++)i.push(i[v-1]+Math.hypot(e[v][0]-e[v-1][0],e[v][1]-e[v-1][1]));const o=t.gates[0]*(n-1),a=Math.min(n-2,Math.floor(o)),r=i[a]+(i[a+1]-i[a])*(o-a),l=v=>{let g=0;for(;g<n-2&&i[g+1]<v;)g++;const x=(v-i[g])/Math.max(1e-9,i[g+1]-i[g]);return[e[g][0]+(e[g+1][0]-e[g][0])*x,e[g][1]+(e[g+1][1]-e[g][1])*x]},c=r>.06?r-.036:r+.036,[h,u]=l(c),[f,d]=l(r);return{x:h,z:u,yaw:Math.atan2(f-h,d-u)}}figure(t,e,n,i,o){const a=this.frand,r=o.body||"rig",l={kind:t,body:r,x:e,z:n,yaw:i,base:i,tint:o.tint??.86+a()*.26,floor:o.floor??null,y:0,lx:0,lz:0,ly:0,rx:0,rz:0,ry:0,torso:-1,leg:-1,arm:-1,tool:-1,pack:-1,sit:-1,steps:r==="rig"?new Float32Array(Je*((o.steps||12)+1)):null,n:0,k:0,m0:0,gait:Qr,span:0,tx:e,tz:n,bend:new ys,crouch:new ys,shift:new ys,twist:new ys,reach:new ys,gest:new ys,state:"",until:a()*5,wake:0,idle:0,drawn:!1,ph:a()*100,side:a()<.7?so:ws,home:o.home??null,mates:null,spot:-1,prev:-1,face:i,sea:i,ax:e,az:n,bx:e,bz:n};return r==="rig"?(this.restFeet(l),l.y=(l.ly+l.ry)/2):l.y=this.footY(l,e,n),l}footY(t,e,n){return t.floor!==null?t.floor:Math.max(0,Fn(this.app.terrain,e,n))}restFeet(t){const e=Kr*lt;t.lx=t.x+Math.cos(t.yaw)*e,t.lz=t.z-Math.sin(t.yaw)*e,t.rx=t.x-Math.cos(t.yaw)*e,t.rz=t.z+Math.sin(t.yaw)*e,t.ly=this.footY(t,t.lx,t.lz),t.ry=this.footY(t,t.rx,t.rz)}buildFolk(t){const e=this.frand,n=OM(e);let i=0,o=0,a=0,r=0,l=0,c=0;for(const g of this.folk){if(g.body==="sit"){g.sit=r++;continue}g.torso=i++,g.arm=a,a+=2,g.body==="rig"&&(g.leg=o,o+=2),(g.kind==="poi"||g.kind==="kapa")&&(g.tool=l++),g.kind==="carry"&&(g.pack=c++)}const h=(g,x)=>{const p=new xo(g,this.mat,Math.max(1,x));return p.count=x,p.visible=x>0,p.instanceColor=new si(new Float32Array(Math.max(1,x)*3).fill(1),3),p.frustumCulled=!1,p.instanceMatrix.setUsage(vi),p.userData={lo:1/0,hi:-1,range:{start:0,count:0}},this.group.add(p),p},u=$r("stand",t);for(let g=0;g<3;g++)t();this.poseMeshes={stand:h(u,40),sit:h($r("sit",t),r)},this.parts={torso:h(n.torso,i),thigh:h(n.thigh,o),shin:h(n.shin,o),arm:h(n.arm,a),tool:h(BM(),l),pack:h(HM(e),c)},this.partList=[...Object.values(this.parts),this.poseMeshes.sit],this._frame=0,this._pv=new ie,this._fr=new Ws,this._sph=new Yi(new q,.04),this._A=new q,this._B=new q,this._H=new q,this._X=new q,this._Y=new q,this._Z=new q,this._tL=new q,this._tU=new q,this._tF=new q,this._hand=new q,this._J=new q,this._K=new q,this._N=new q,this._Sh=new q,this._D=new q,this._Fw=new q;const f=new It("#5d5650"),d=new It("#5a3a22"),v=new te;for(const g of this.folk){const x=this._c.setRGB(g.tint,g.tint,g.tint);g.sit>=0&&this.poseMeshes.sit.setColorAt(g.sit,x),g.torso>=0&&this.parts.torso.setColorAt(g.torso,x);for(let p=0;p<2;p++)g.arm>=0&&this.parts.arm.setColorAt(g.arm+p,x),g.leg>=0&&(this.parts.thigh.setColorAt(g.leg+p,x),this.parts.shin.setColorAt(g.leg+p,x));g.tool>=0&&this.parts.tool.setColorAt(g.tool,g.kind==="poi"?f:d),g.body==="seat"&&(v.at(g.x,g.y,g.z,-g.yaw),GM(v,n.cloth),g.kind==="poi"?WM(v,e):g.kind==="kapa"?VM(v,e):qM(v,e),v.done()),this.start(g),this.pose(g,0),g.drawn=!1}for(const g of[this.poseMeshes.stand,...this.partList])g.userData.lo=1/0,g.userData.hi=-1,g.instanceMatrix.needsUpdate=!0;this.props=new ue(v.geometry(),this.mat),this.props.frustumCulled=!1,this.group.add(this.props)}start(t){const e=this.frand;t.kind==="loi"&&e()<.75?(t.state="work",t.bend.set(1+e()*.2),t.reach.set(1),t.crouch.set(.35+e()*.15),t.idle=Math.floor(e()*5)):t.kind==="crew"&&e()<.5?(t.state="work",t.bend.set(.55+e()*.25),t.reach.set(1),t.idle=Math.floor(e()*4)):t.kind==="carry"&&e()<.6?(t.state="rest",t.gest.set(1),t.idle=1+Math.floor(e()*3)):t.body==="seat"&&(t.state=e()<.7?"work":"rest",t.reach.set(t.state==="work"?1:0),t.ph=-e()*10,t.until=2+e()*15,t.wake=t.state==="work"?t.until:0),t.body==="rig"&&t.state!=="work"&&t.shift.set((e()-.5)*1.2)}think(t,e){if(t.n&&e-t.m0>=t.steps[t.n*Je+10]&&this.settle(t),e<t.until)return;t.drawn=!1;const n=this.frand;switch(t.kind){case"loi":return this.thinkLoi(t,e,n);case"walk":return this.thinkWalk(t,e,n);case"talk":return this.thinkTalk(t,e,n);case"crew":return this.thinkCrew(t,e,n);case"keeper":return this.thinkKeeper(t,e,n);case"carry":return this.thinkCarry(t,e,n);case"poi":case"kapa":case"mend":return this.thinkSeat(t,e,n);case"sit":return this.thinkSit(t,e,n);default:return this.thinkStand(t,e,n)}}fidget(t,e,n,i=1){const o=t.shift.b,a=n();let r=e;a<.6?r=t.shift.to((o>.3?-1:o<-.3?1:n()<.5?-1:1)*(.45+n()*.55)*i,e,1.3+n()*.9):a<.8?r=t.shift.to(0,e,1.2+n()*.6):r=t.twist.to(Math.abs(t.twist.b)>.1?0:(n()-.5)*.7*i,e,1.4+n()),t.wake=r,t.until=r+2+n()*6}turnTo(t,e,n){const i=this.plan(t,e,t.x,t.z,n,tl);return t.wake=i,i}thinkStand(t,e,n){const i=t.kind==="priest"?.5:t.kind==="watch"?.8:1,o=t.kind==="priest"?.6:t.kind==="watch"?.35:1.1;if(n()<(t.kind==="priest"?.3:.15)){t.until=this.turnTo(t,e,t.base+(n()-.5)*2*o)+2+n()*4;return}this.fidget(t,e,n,i),t.kind==="priest"&&(t.until+=4+n()*8)}thinkTalk(t,e,n){if(t.state==="gesture"){t.state="";const o=t.gest.to(0,e,.9);t.wake=o,t.until=o+1.5+n()*4;return}const i=n();if(i<.25)t.state="gesture",t.side=n()<.7?so:ws,t.wake=t.gest.to(.5+n()*.5,e,.8),t.until=t.wake+.8+n()*2;else if(i<.32){const o=Math.abs(Li(t.yaw-t.base))<.2;t.until=this.turnTo(t,e,o?t.base+(n()<.5?-1:1)*(.4+n()*.4):t.base)+2+n()*5}else this.fidget(t,e,n)}thinkWalk(t,e,n){const i=t.home;if(t.state!=="stop"&&(t.state="stop",t.idle=1+Math.floor(n()*3)),t.idle>0){t.idle--,this.fidget(t,e,n);return}let o=-1;for(let a=0;a<6&&o<0;a++){const r=Math.floor(n()*i.n),l=Math.hypot(i.x[r]-t.x,i.z[r]-t.z);if(r===t.prev||i.busy[r]||l<.06||l>.34)continue;let c=!0;for(let h=0;h<i.walkers.length&&c;h++){const u=i.walkers[h];c=u===t||el(u.x,u.z,u.tx,u.tz,t.x,t.z,i.x[r],i.z[r])>=.012}c&&this.clearWalk(t.x,t.z,i.x[r],i.z[r])&&(o=r)}if(o<0){this.fidget(t,e,n);return}i.busy[t.spot]=0,i.busy[o]=1,t.prev=t.spot,t.spot=o,t.shift.to(0,e,.6),t.twist.to(0,e,.6),t.tx=i.x[o],t.tz=i.z[o],t.until=t.wake=this.plan(t,e,t.tx,t.tz,i.yaw[o]+(n()-.5)*.8,Qr),t.state="go"}handsAt(t,e,n){t.idle--;const i=t.gest.b<.5;t.gest.to(i?1:0,e,.8),t.until=e+(i?3+n()*5:2+n()*6),t.wake=i?t.until:e+.8}thinkLoi(t,e,n){if(t.state==="work"&&t.idle>0)return this.handsAt(t,e,n);if(t.state==="work"){const o=t.bend.to(.04,e,1.8+n()*.6);t.reach.to(0,e,1.3),t.crouch.to(0,e,1.8),t.twist.to((n()-.5)*.8,o-.4,1.6),t.state="up",t.wake=o+1.3,t.until=o+2.5+n()*6;return}if(t.twist.to(0,e,.8),t.state==="up"&&n()<.45&&this.spotIn(t.home,t.mates,n,t)){t.tx=this.spot.x,t.tz=this.spot.z,t.until=t.wake=this.plan(t,e,t.tx,t.tz,n()*Math.PI*2,FM),t.state="wade";return}const i=t.bend.to(1+n()*.2,e,1.8+n()*.6);t.reach.to(1,e+.5,1.4),t.crouch.to(.35+n()*.15,e,1.8),t.gest.to(0,e,.5),t.state="work",t.idle=2+Math.floor(n()*5),t.wake=i,t.until=i+.5+n()*3}thinkCrew(t,e,n){if(t.state==="work"&&t.idle>0)return this.handsAt(t,e,n);if(t.state==="work"){const a=t.bend.to(.04,e,1.5);t.reach.to(0,e,1.2),t.state="stand",t.idle=Math.floor(n()*2),t.wake=a,t.until=a+1+n()*3;return}if(t.idle>0){t.idle--,this.fidget(t,e,n);return}if(t.state==="look"){t.state="stand",t.until=this.turnTo(t,e,t.face)+1+n()*2;return}const i=n();if(i<.25&&this.crewStep(t,e,n))return;if(i<.4){t.state="look",t.until=this.turnTo(t,e,t.sea+(n()-.5)*.8)+3+n()*5;return}if(Math.abs(Li(t.yaw-t.face))>.2){t.until=this.turnTo(t,e,t.face);return}t.shift.to(0,e,.8);const o=t.bend.to(.55+n()*.25,e,1.6);t.reach.to(1,e+.3,1.3),t.gest.to(0,e,.5),t.state="work",t.idle=2+Math.floor(n()*4),t.wake=o,t.until=o+.5+n()*2}crewStep(t,e,n){const i=t.home,o=t.x-i.x,a=t.z-i.z,r=o*i.cs+a*i.sn;for(let l=0;l<6;l++){const c=Math.max(-.055,Math.min(.055,r+(n()<.5?-1:1)*(.02+n()*.035)));if(Math.abs(c-r)<.015)continue;const h=i.x+c*i.cs-i.lz*i.sn,u=i.z+c*i.sn+i.lz*i.cs;let f=!0;for(let v=0;v<=1&&f;v+=.25)f=this.open(t.x+(h-t.x)*v,t.z+(u-t.z)*v,.008);if(!f)continue;let d=!0;for(let v=0;v<i.crew.length&&d;v++){const g=i.crew[v];d=g===t||Math.hypot(g.x-h,g.z-u)>=.022&&Math.hypot(g.tx-h,g.tz-u)>=.022&&el(g.x,g.z,g.tx,g.tz,t.x,t.z,h,u)>=.012}if(d)return t.tx=h,t.tz=u,t.state="stand",t.idle=1,t.until=t.wake=this.plan(t,e,h,u,t.face,Qr),!0}return!1}thinkKeeper(t,e,n){if(t.state==="down"){const o=t.crouch.to(0,e,1.5);t.bend.to(.04,e,1.5),t.reach.to(0,e,1.1),t.state="up",t.idle=2+Math.floor(n()*3),t.wake=o,t.until=o+1;return}if(t.idle>0){t.idle--,this.fidget(t,e,n,.7);return}t.shift.to(0,e,.6);const i=t.crouch.to(1,e,1.6);t.bend.to(.45,e,1.6),t.reach.to(1,e+.6,1.2),t.state="down",t.wake=i+.6,t.until=i+4+n()*7}thinkCarry(t,e,n){if(t.state==="go"||t.state==="rest"&&t.idle===0){t.shift.to(0,e,.8),t.twist.to(0,e,.8);const r=t.crouch.to(.85,e,1.4);t.bend.to(.55,e,1.4),t.reach.to(1,e+.2,1.1),t.state==="go"&&t.gest.to(1,e+.3,1.1),t.state=t.state==="go"?"set":"lift",t.until=t.wake=r+.4;return}if(t.state==="set"||t.state==="lift"){const r=t.crouch.to(0,e,1.4);t.bend.to(.04,e,1.4),t.reach.to(0,e,1),t.state==="lift"&&t.gest.to(0,e,1.2),t.wake=r,t.state==="set"?(t.state="rest",t.idle=3+Math.floor(n()*3),t.until=r+1+n()*3):(t.state="up",t.until=r+.5);return}if(t.state==="rest"){t.idle--,this.fidget(t,e,n);return}const i=Math.hypot(t.x-t.ax,t.z-t.az)<Math.hypot(t.x-t.bx,t.z-t.bz),o=i?t.bx:t.ax,a=i?t.bz:t.az;t.until=t.wake=this.plan(t,e,o,a,null,IM),t.state="go"}thinkSeat(t,e,n){t.state==="work"?(t.reach.to(0,e,1.2),t.state="rest",t.wake=e+1.3,t.until=e+4+n()*9):(t.reach.to(1,e,1),t.state="work",t.ph=e,t.until=e+12+n()*20,t.wake=t.until)}thinkSit(t,e,n){t.twist.to(Math.max(-.7,Math.min(.7,t.twist.b+(n()-.5)*.9)),e,2+n());const i=t.shift.to((n()-.5)*1.4,e,1.8+n());t.wake=Math.max(i,t.twist.t0+t.twist.d),t.until=e+10+n()*25}rec(t,e,n,i,o,a,r,l,c,h,u,f,d,v){const g=e*Je;t[g]=n,t[g+1]=i,t[g+2]=o,t[g+3]=a,t[g+4]=r,t[g+5]=l,t[g+6]=c,t[g+7]=h,t[g+8]=u,t[g+9]=f,t[g+10]=d,t[g+11]=v}plan(t,e,n,i,o,a){const r=t.steps,l=r.length/Je-1;this.rec(r,0,t.x,t.z,t.yaw,t.lx,t.lz,t.ly,t.rx,t.rz,t.ry,-1,0,0);let c=0;const h=n-t.x,u=i-t.z,f=Math.hypot(h,u);if(f>.003){const d=Math.atan2(h,u);Math.abs(Li(d-t.yaw))>.3&&(c=this.turnSteps(t,c,d));const v=h/f,g=u/f,x=Math.max(1,Math.min(Math.round(f/(a.step*lt)),l-c-8)),p=f/x,m=Kr*lt,M=c*Je;let _=(r[M+3]-t.x)*v+(r[M+4]-t.z)*g<=(r[M+6]-t.x)*v+(r[M+7]-t.z)*g;for(let E=1;E<=x+1;E++){const y=c*Je,w=Math.min(E,x)*p,A=E<=x?(E-.5)*p:f,b=_?1:-1,S=t.x+v*w+g*m*b,R=t.z+g*w-v*m*b,k=this.footY(t,S,R);c++,this.rec(r,c,t.x+v*A,t.z+g*A,d,_?S:r[y+3],_?R:r[y+4],_?k:r[y+5],_?r[y+6]:S,_?r[y+7]:R,_?r[y+8]:k,_?ws:so,r[y+10]+a.tau,a.lift),_=!_}}return o!==null&&(c=this.turnSteps(t,c,o)),t.n=c,t.k=1,t.m0=e,t.gait=c?a:t.gait,t.span=f,t.drawn=!1,e+r[c*Je+10]}turnSteps(t,e,n){const i=t.steps,o=i.length/Je-1,a=e*Je,r=i[a],l=i[a+1],c=i[a+2],h=Li(n-c);if(Math.abs(h)<.05)return e;const u=Math.ceil(Math.abs(h)/.6),f=Kr*lt;let d=h>0;for(let v=1;v<=u+1&&e<o;v++){const g=e*Je,x=c+h*Math.min(v,u)/u,p=d?1:-1,m=r+Math.cos(x)*f*p,M=l-Math.sin(x)*f*p,_=this.footY(t,m,M);e++,this.rec(i,e,r,l,x,d?m:i[g+3],d?M:i[g+4],d?_:i[g+5],d?i[g+6]:m,d?i[g+7]:M,d?i[g+8]:_,d?ws:so,i[g+10]+tl.tau,tl.lift),d=!d}return e}settle(t){const e=t.steps,n=t.n*Je;t.x=e[n],t.z=e[n+1],t.yaw=e[n+2],t.lx=e[n+3],t.lz=e[n+4],t.ly=e[n+5],t.rx=e[n+6],t.rz=e[n+7],t.ry=e[n+8],t.y=(t.ly+t.ry)/2,t.n=0,t.span=0}updateFolk(t){const e=this.app.camera,n=e.position;e.updateMatrixWorld(),this._pv.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._fr.setFromProjectionMatrix(this._pv);const i=++this._frame,o=this.folk;for(let a=0;a<this.folkSites.length;a++){const r=this.folkSites[a],l=r.x-n.x,c=r.y-n.y,h=r.z-n.z,u=12+r.r;if(!(l*l+c*c+h*h>u*u))for(let f=r.i0;f<r.i1;f++){const d=o[f];if(this.think(d,t),d.drawn)continue;const v=Math.abs(d.x-n.x)+Math.abs(d.y-n.y)+Math.abs(d.z-n.z);(i+f)%(v<1.5?1:v<4?2:v<8?3:5)||(this._sph.center.set(d.x,d.y+.015,d.z),this._sph.radius=.035+d.span,this._fr.intersectsSphere(this._sph)&&(this.pose(d,t),d.drawn=t>d.wake&&!d.n))}}for(let a=0;a<this.partList.length;a++)this.flush(this.partList[a])}pose(t,e){if(t.body==="rig")this.poseRig(t,e);else if(t.body==="seat")this.poseSeat(t,e);else{const n=this.poseMeshes.sit;this.setInstance(n,t.sit,t.x,t.y,t.z,t.yaw+t.twist.at(e),lt,t.tint,0,t.shift.at(e)*.05),this.mark(n,t.sit)}}poseRig(t,e){t.n&&e-t.m0>=t.steps[t.n*Je+10]&&this.settle(t);let n=t.x,i=t.z,o=t.yaw,a=t.lx,r=t.lz,l=t.ly,c=t.rx,h=t.rz,u=t.ry,f=0,d=0,v=0,g=0;if(t.n){const at=t.steps,B=e-t.m0;for(;t.k<t.n&&B>=at[t.k*Je+10];)t.k++;const D=t.k*Je,J=D-Je,ut=Math.max(0,Math.min(1,(B-at[J+10])/Math.max(.001,at[D+10]-at[J+10]))),ct=ut*ut*(3-2*ut);n=at[J]+(at[D]-at[J])*ut,i=at[J+1]+(at[D+1]-at[J+1])*ut,o=at[J+2]+Li(at[D+2]-at[J+2])*ut,a=at[J+3]+(at[D+3]-at[J+3])*ct,r=at[J+4]+(at[D+4]-at[J+4])*ct,l=at[J+5]+(at[D+5]-at[J+5])*ct,c=at[J+6]+(at[D+6]-at[J+6])*ct,h=at[J+7]+(at[D+7]-at[J+7])*ct,u=at[J+8]+(at[D+8]-at[J+8])*ct;const ft=at[D+11]*Math.sin(Math.PI*ut);at[D+9]===ws?f=ft:d=ft,v=.02*Math.sin(Math.PI*ut)*(at[D+9]===ws?-1:1),g=at[D]!==at[J]||at[D+1]!==at[J+1]?1:0}const x=t.bend.at(e),p=t.crouch.at(e),m=t.shift.at(e),M=t.twist.at(e),_=t.reach.at(e),E=Math.sin(o),y=Math.cos(o),w=(m*.045+v)*lt,A=-(.1*Math.sin(x)+.12*p)*lt,b=n+y*w+E*A,S=i-E*w+y*A,R=zM*lt,k=b+y*R,I=S-E*R,T=b-y*R,C=S+E*R,F=l+(Tl+f)*lt,N=u+(Tl+d)*lt,z=(Al+Ha)*.998*lt,U=Math.min((l+u)/2+(DM-.05*(1-Math.cos(x))-.36*p)*lt,F+Math.sqrt(Math.max(0,z*z-(a-k)*(a-k)-(r-I)*(r-I))),N+Math.sqrt(Math.max(0,z*z-(c-T)*(c-T)-(h-C)*(h-C)))),L=.45*p;this.leg(t.leg,this._J.set(k,U,I),this._K.set(a,F,r),this._N.set(E+y*L,0,y-E*L)),this.leg(t.leg+1,this._J.set(T,U,C),this._K.set(c,N,h),this._N.set(E-y*L,0,y+E*L));const W=o+M;this.axes(W,x+.05*g,-m*.03),this._A.set(b,U,S),this.basis(this.parts.torso,t.torso,this._tL,this._tU,this._tF,this._A);const j=t.gait.swing*g,P=Math.max(-1,Math.min(1,((c-b)*E+(h-S)*y)/(.25*lt)))*j,O=Math.max(-1,Math.min(1,((a-b)*E+(r-S)*y)/(.25*lt)))*j;let G=.07,K=-1,Q=.04+P*.6,ot=-.07,$=-1,Y=.04+O*.6;if(_>0){let at=.1,B=-.93,D=.36;t.kind==="loi"?(at=.12,B=-.85,D=.52):t.kind==="crew"?(at=.13,B=-.72,D=.68):t.kind==="keeper"&&(at=.12,B=-.78,D=.6);const J=t.kind==="keeper"||t.kind==="carry"?0:.13*Math.sin(e*1.7+t.ph)*t.gest.at(e);G+=(at-G)*_,K+=(B-K)*_,Q+=(D+J-Q)*_,ot+=(-at-ot)*_,$+=(B-$)*_,Y+=(D-J-Y)*_}if(t.kind==="talk"){const at=t.gest.at(e);t.side===so?(ot+=(-.22-ot)*at,$+=(-.4-$)*at,Y+=(.88-Y)*at):(G+=(.22-G)*at,K+=(-.4-K)*at,Q+=(.88-Q)*at)}else if(t.kind==="carry"){const at=1-t.gest.at(e);ot+=(-.04-ot)*at,$+=(.1-$)*at,Y+=(.99-Y)*at}const rt=this._tL,X=this._tU,Mt=lu*lt,mt=Zr*lt,_t=X.x*mt,xt=X.y*mt,kt=X.z*mt;if(this._Fw.set(Math.sin(W),0,Math.cos(W)),this.arm(t.arm,this._Sh.set(b+rt.x*Mt+_t,U+rt.y*Mt+xt,S+rt.z*Mt+kt),this._D.set(G,K,Q),this._Fw),this.arm(t.arm+1,this._Sh.set(b-rt.x*Mt+_t,U-rt.y*Mt+xt,S-rt.z*Mt+kt),this._D.set(ot,$,Y),this._Fw),t.pack>=0){const at=.22*lt,B=(Zr+.05)*lt;this._A.set(b-rt.x*at+X.x*B,U-rt.y*at+X.y*B,S-rt.z*at+X.z*B);const D=t.gest.at(e);if(D>0){const J=Math.sin(t.yaw+.2),ut=Math.cos(t.yaw+.2);this._A.lerp(this._B.set(t.x+Math.sin(t.yaw)*1.2*lt,t.floor+.44*lt,t.z+Math.cos(t.yaw)*1.2*lt),D),this._X.set(ut,0,-J).lerp(rt,1-D),this._Y.set(0,1,0).lerp(X,1-D),this._Z.set(J,0,ut).lerp(this._tF,1-D),this.basis(this.parts.pack,t.pack,this._X,this._Y,this._Z,this._A)}else this.basis(this.parts.pack,t.pack,rt,X,this._tF,this._A)}}poseSeat(t,e){const n=t.reach.at(e),i=Math.sin(t.yaw),o=Math.cos(t.yaw),a=t.x,r=t.y+Jr*lt,l=t.z;let c=0,h;if(t.kind==="poi"){const k=((e-t.ph)/1.7%1+1)%1;c=(k<.55?Ln(0,.55,k):k<.68?1-((k-.55)/.13)**2:0)*n,h=.14+.26*n-.14*c}else if(t.kind==="kapa"){const k=((e-t.ph)/1.05%1+1)%1;c=(k<.6?Ln(0,.6,k):k<.72?1-((k-.6)/.12)**2:0)*n,h=.14+.22*n-.05*c}else h=.14+.34*n;this.axes(t.yaw,h,0),this._A.set(a,r,l),this.basis(this.parts.torso,t.torso,this._tL,this._tU,this._tF,this._A);const u=this._tL,f=this._tU,d=lu*lt,v=Zr*lt,g=a+u.x*d+f.x*v,x=r+u.y*d+f.y*v,p=l+u.z*d+f.z*v,m=a-u.x*d+f.x*v,M=r-u.y*d+f.y*v,_=l-u.z*d+f.z*v;let E=.25,y=-.06,w=.2,A=-.25,b=-.06,S=.2;if(t.kind==="poi"){const k=.17+.3*c;E+=(.045-E)*n,y+=(k-y)*n,w+=(.54-w)*n,A+=(-.045-A)*n,b+=(k-b)*n,S+=(.54-S)*n}else if(t.kind==="kapa")E+=(.17-E)*n,y+=(-.03-y)*n,w+=(.45-w)*n;else{const k=.04*Math.sin(e*1.5+t.ph)*n;E+=(.13-E)*n,y+=(-.15-y)*n,w+=(.46+k-w)*n,A+=(-.13-A)*n,b+=(-.15-b)*n,S+=(.46-k-S)*n}this._Fw.set(i,0,o);const R=this._hand.copy(this.armTo(t.arm,this._Sh.set(g,x,p),this._D.set(a+(o*E+i*w)*lt,r+y*lt,l+(-i*E+o*w)*lt),this._Fw));if(t.kind==="kapa"){const k=a+(o*A+i*S)*lt,I=r+b*lt,T=l+(-i*A+o*S)*lt;let C=a+(o*-.05+i*.46)*lt-m,F=r-.03*lt-M,N=l+(-i*-.05+o*.46)*lt-_;const z=Math.sqrt(C*C+F*F+N*N),U=Math.min(xi*lt,z-.2*lt),L=o*.12+i*.98,W=-i*.12+o*.98,j=c*n;C=C/z*(1-j)+L*j,F=F/z*(1-j)+.08*j,N=N/z*(1-j)+W*j;const P=(U+(xi*lt-U)*j)/Math.sqrt(C*C+F*F+N*N),O=m+C*P,G=M+F*P,K=_+N*P;this.armTo(t.arm+1,this._Sh.set(m,M,_),this._D.set(k+(O-k)*n,I+(G-I)*n,T+(K-T)*n),this._Fw)}else this.armTo(t.arm+1,this._Sh.set(m,M,_),this._D.set(a+(o*A+i*S)*lt,r+b*lt,l+(-i*A+o*S)*lt),this._Fw);if(t.kind==="poi"){R.add(this._B).multiplyScalar(.5);const k=1-n;R.x+=(a+(o*-.32+i*.5)*lt-R.x)*k,R.y+=(r+(.09+.22-Jr)*lt-R.y)*k,R.z+=(l+(-i*-.32+o*.5)*lt-R.z)*k,this._X.set(o,0,-i),this._Y.set(0,1,0),this._Z.set(i,0,o),this.basis(this.parts.tool,t.tool,this._X,this._Y,this._Z,R,1.5*lt,.8*lt,1.5*lt)}else if(t.kind==="kapa"){const k=1-n;k>0&&(this._Y.lerp(this._A.set(-o,0,i),k).normalize(),this._Z.set(0,1,0).addScaledVector(this._Y,-this._Y.y).normalize(),this._X.crossVectors(this._Y,this._Z),this._B.x+=(a+(o*-.6+i*.48)*lt-this._B.x)*k,this._B.y+=(r+(.195-Jr)*lt-this._B.y)*k,this._B.z+=(l+(-i*-.6+o*.48)*lt-this._B.z)*k),this.basis(this.parts.tool,t.tool,this._X,this._Y,this._Z,this._B)}}armTo(t,e,n,i){const o=e.x,a=e.y,r=e.z,l=i.x,c=i.z,h=n.x-o,u=n.y-a,f=n.z-r,d=Math.sqrt(h*h+u*u+f*f)||1e-6,v=Math.max(.7*xi*lt,Math.min(xi*lt,d));return this._A.set(o,a,r),this._B.set(o+h/d*v,a+u/d*v,r+f/d*v),Math.abs(l*h+c*f)>.85*d?this._H.set(0,1,0):this._H.set(l,0,c),this.limb(this.parts.arm,t,this._A,this._B,this._H,v/xi),this._B}axes(t,e,n){const i=Math.sin(t),o=Math.cos(t),a=Math.sin(e),r=Math.cos(e),l=Math.sin(n),c=Math.cos(n),h=i*a,u=r,f=o*a;this._tU.set(h*c+o*l,u*c,f*c-i*l),this._tL.set(o*c-h*l,-u*l,-i*c-f*l),this._tF.set(i*r,-a,o*r)}leg(t,e,n,i){const o=Al*lt,a=Ha*lt,r=e.x,l=e.y,c=e.z,h=i.x,u=i.z;let f=n.x-r,d=n.y-l,v=n.z-c,g=Math.sqrt(f*f+d*d+v*v);const x=(o+a)*.9999;if(g>x){const R=x/g;f*=R,d*=R,v*=R,g=x}g=Math.max(g,1e-6);const p=f/g,m=d/g,M=v/g,_=(o*o-a*a+g*g)/(2*g),E=Math.sqrt(Math.max(0,o*o-_*_)),y=h*p+u*M;let w=h-y*p,A=-y*m,b=u-y*M;const S=Math.sqrt(w*w+A*A+b*b)||1;w/=S,A/=S,b/=S,this._A.set(r,l,c),this._B.set(r+p*_+w*E,l+m*_+A*E,c+M*_+b*E),this._H.set(h,0,u),this.limb(this.parts.thigh,t,this._A,this._B,this._H),this._A.set(r+f,l+d,c+v),this.limb(this.parts.shin,t,this._B,this._A,this._H)}arm(t,e,n,i){const o=e.x,a=e.y,r=e.z,l=i.x,c=i.z;let h=c*n.x+l*n.z,u=n.y,f=-l*n.x+c*n.z;const d=Math.sqrt(h*h+u*u+f*f)||1,v=xi*lt/d;return h*=v,u*=v,f*=v,this._A.set(o,a,r),this._B.set(o+h,a+u,r+f),Math.abs(l*h+c*f)>.85*xi*lt?this._H.set(0,1,0):this._H.set(l,0,c),this.limb(this.parts.arm,t,this._A,this._B,this._H),this._B}limb(t,e,n,i,o,a=lt){const r=this._Y.subVectors(n,i).normalize(),l=this._Z.copy(o).addScaledVector(r,-o.dot(r));l.lengthSq()<1e-8&&(Math.abs(r.x)<.9?l.set(1,0,0).addScaledVector(r,-r.x):l.set(0,0,1).addScaledVector(r,-r.z)),l.normalize(),this.basis(t,e,this._X.crossVectors(r,l),r,l,n,lt,a,lt)}basis(t,e,n,i,o,a,r=lt,l=lt,c=lt){const h=t.instanceMatrix.array,u=e*16;h[u]=n.x*r,h[u+1]=n.y*r,h[u+2]=n.z*r,h[u+3]=0,h[u+4]=i.x*l,h[u+5]=i.y*l,h[u+6]=i.z*l,h[u+7]=0,h[u+8]=o.x*c,h[u+9]=o.y*c,h[u+10]=o.z*c,h[u+11]=0,h[u+12]=a.x,h[u+13]=a.y,h[u+14]=a.z,h[u+15]=1,this.mark(t,e)}mark(t,e){const n=t.userData;e<n.lo&&(n.lo=e),e>n.hi&&(n.hi=e)}flush(t){const e=t.userData;if(e.hi<e.lo)return;const n=t.instanceMatrix,i=e.range,o=e.lo*16,a=(e.hi+1)*16;if(n.updateRanges.length){const r=i.start+i.count;i.start=Math.min(i.start,o),i.count=Math.max(r,a)-i.start}else i.start=o,i.count=a-o,n.updateRanges.push(i);n.needsUpdate=!0,e.lo=1/0,e.hi=-1}setInstance(t,e,n,i,o,a,r,l=1,c=0,h=0){this._p.set(n,i,o),this._e.set(c,a,h,"YXZ"),this._q.setFromEuler(this._e),this._s.setScalar(r),this._m.compose(this._p,this._q,this._s),t.setMatrixAt(e,this._m),(l!==1||t.instanceColor)&&t.setColorAt(e,this._c.setRGB(l,l,l))}walkTo(t,e){let n=0,i=1/0;for(let o=0;o<this.trail.length;o++){const a=Math.hypot(this.trail[o][0]-t,this.trail[o][1]-e);a<i&&(i=a,n=this.trailLen[o])}this.procS=n-.12}trailPoint(t){const e=this.trailLen[this.trailLen.length-1];t=(t%e+e)%e;let n=0,i=this.trailLen.length-1;for(;n<i-1;){const l=n+i>>1;this.trailLen[l]<=t?n=l:i=l}const o=this.trail[n%this.trail.length],a=this.trail[(n+1)%this.trail.length],r=(t-this.trailLen[n])/Math.max(1e-6,this.trailLen[n+1]-this.trailLen[n]);return[o[0]+(a[0]-o[0])*r,o[1]+(a[1]-o[1])*r,Math.atan2(a[0]-o[0],a[1]-o[1])]}watch(){const t=this.app.rig,e=t.flight,n=this.view,i=e?e.dest:t.goal;return n.x=i.target.x,n.z=i.target.z,n.dist=i.distance,n.remain=e?(1-e.t)*e.duration:0,n}update(t,e){const n=this.app,i=n.terrain,o=n.camera.position,a=this.watch(),r=n.rig.flight;for(const g of this.breaks){const x=Math.hypot(a.x-g.x[0],a.z-g.z[0])<1.6&&a.dist<5;x&&!g.watching&&(g.due=!0),x?g.due&&(!r||r.t>.3)&&(g.due=!1,this.hurrySet(g,a.remain)):g.due=!1,g.watching=x}const l=this.holua;if(l){l.time+=t;const g=Math.max(0,Math.min(l.len,(a.x-l.x[0])*l.dx+(a.z-l.z[0])*l.dz)),x=Math.hypot(a.x-l.x[0]-l.dx*g,a.z-l.z[0]-l.dz*g)<2&&a.dist<16;x&&!l.watching&&this.holuaFor(l,a),l.watching=x}const c=o.y-Math.max(0,i.heightAt(o.x,o.z))<30;if(this.group.visible=c,!c){l&&l.runner&&l.runner.state==="run"&&this.slide(l,l.runner,t);return}this.updateFolk(e);const h=n.season==="hooilo",u=this.poseMeshes.stand;let f=0;if(this.akua.visible=h,h){this.procS+=t*.0035*Math.max(1,Math.min(8,n.clock.speed/20));for(let g=0;g<11;g++){const[x,p,m]=this.trailPoint(this.procS-g*.035),M=Math.max(0,i.heightAt(x,p))+Math.abs(Math.sin(e*4.2+g))*.0012;this.setInstance(u,f++,x,M,p,m,lt,g===5?2.2:1),g===5&&(this.akua.position.set(x,M,p),this.akua.rotation.y=m,this.akua.scale.setScalar(lt))}}f=this.updateHolua(t,e,f),u.count=f,u.instanceMatrix.needsUpdate=!0,u.instanceColor&&(u.instanceColor.needsUpdate=!0),this.updateSurf(t,e);for(const g of this.boats)g.g.position.x=g.x+Math.sin(e*.05+g.drift)*.6,g.g.position.z=g.z+Math.cos(e*.04+g.drift)*.6,g.g.position.y=Math.sin(e*1.3+g.ph)*.0015,g.g.rotation.z=Math.sin(e*1.1+g.ph)*.04,g.g.rotation.y+=t*.02;this.voyagerS+=t*.004;const d=155,v=this.voyagerS;this.voyager.position.set(Math.cos(v)*d*.95+10,Math.sin(e*.9)*.002,Math.sin(v)*d*.7),this.voyager.rotation.y=-v-Math.PI/2,this.voyager.rotation.x=.06;for(let g=0;g<this.birdCentres.length;g++){const x=this.birdCentres[g],p=x.ph+e*x.sp,m=x.x+Math.cos(p)*x.r,M=x.z+Math.sin(p)*x.r,_=Math.max(0,i.heightAt(m,M))+x.h+Math.sin(e*.3+g)*.1;this.setInstance(this.birds,g,m,_,M,-p,lt*1.4,1,.3)}this.birds.count=this.birdCentres.length,this.birds.instanceMatrix.needsUpdate=!0}hurrySet(t,e){t.eager=!0;let n=!1;for(const r of t.surfers)(r.state==="go"||r.state==="ride")&&(n=!0);if(n||!this.nextUp(t,!0))return;const i=this.app.ocean,o=i.swellTimeAt(t.x[0],t.z[0]),a=la(o,this._sw);if(e>=1.2&&a.age>7&&a.next>e+9){const r=a.next-(e+8);i.swellT+=r,t.lastT+=r}else a.next<=ga?this.catchLate(t,o,o+a.next):a.age<8&&this.catchLate(t,o,o-a.age)}catchLate(t,e,n){const i=e>n?this.breakS(t,ii.speed*(e-n))+.14:0;for(let o=0;o<t.surfers.length;o++){const a=this.nextUp(t,!0);if(!a)break;if(a.tried=!0,this.goFor(a,t,n,i)){t.eager=!1;break}}for(const o of t.surfers)o.tried=!1}nextUp(t,e){let n=null;for(const o of t.surfers)o.state==="sit"&&!o.tried&&(!n||o.since<n.since)&&(n=o);if(n||!e)return n;let i=1/0;for(const o of t.surfers){if(o.state!=="back"||o.leg<1||o.tried)continue;const a=Math.hypot(o.x-t.lineX,o.z-t.lineZ);a<i&&(i=a,n=o)}return n}callWave(t,e,n,i){const o=this.rand;if(!t.eager&&!i&&o()>.25+.7*(n-.5)*2)return;let a=0;for(const l of t.surfers)l.state==="sit"&&a++;const r=this.nextUp(t,t.eager);if(!(!r||a<2&&!t.eager)&&this.goFor(r,t,e,0)&&(t.eager=!1,a>2&&o()<.35)){const l=Math.max(.16+o()*.1,r.take+.12),c=Math.min(t.n-1,Math.round(l/t.step));let h=null,u=1/0;for(const f of t.surfers){const d=Math.hypot(f.x-t.x[c],f.z-t.z[c]);f!==r&&f.state==="sit"&&d<u&&(u=d,h=f)}h&&this.goFor(h,t,e,l)}}goFor(t,e,n,i){const o=e.lastT-n;for(let a=Math.ceil(i/e.step-1e-6);a<e.n;a++){const r=a*e.step;if(r>e.len-.35)return!1;const l=r>.02?.14:.05,c=this.breakG(e,Math.max(0,r-l))/ii.speed,h=e.x[a]+e.nx[a]*xa,u=e.z[a]+e.nz[a]*xa,f=Math.hypot(h-t.x,u-t.z)/(PM*t.pace);if(c-o<f)continue;const d=this.rand;return Object.assign(t,{state:"go",wave:n,take:r,s:r,lead:l,tTake:c,a0:c-f,sx:t.x,sz:t.z,fx:h,fz:u}),t.dur=10+d()*10,t.fall=d()<.35,t.goofy=d()<.5,!0}return!1}breakG(t,e){const n=Math.max(0,Math.min(t.n-1.001,e/t.step)),i=n|0;return t.g[i]+(t.g[i+1]-t.g[i])*(n-i)}paddleBack(t,e){const n=Math.min(e.n-1,Math.max(0,Math.round(t.s/e.step)));t.state="back",t.leg=0,t.wx=t.x+e.nx[n]*.2,t.wz=t.z+e.nz[n]*.2}updateSurf(t,e){const n=this.app.ocean,i=this._sw,o=this.counts;o.board=o.ride=o.sit=o.prone=o.arm=0;for(const a of this.breaks){const r=n.swellTimeAt(a.x[0],a.z[0]),l=Math.abs(r-a.lastT-t)>1;if(a.lastT=r,la(r+ga,i),i.age<=ga&&i.id!==a.called){a.called=i.id;const c=r+ga-i.age,h=i.height,u=la(c+.01,i).next>30;l||this.callWave(a,c,h,u)}for(const c of a.surfers)l&&(c.state==="go"||c.state==="ride")&&this.paddleBack(c,a),this.stepSurfer(c,a,r,t,e);this.separate(a,t);for(const c of a.surfers)this.drawSurfer(c,e)}for(const a in this.surfPose){const r=this.surfPose[a];r.count=o[a],r.visible=o[a]>0,r.instanceMatrix.needsUpdate=!0}this.boards.count=o.board,this.boards.visible=o.board>0,this.boards.instanceMatrix.needsUpdate=!0,this.boards.instanceColor.needsUpdate=!0,this.arms.count=o.arm,this.arms.visible=o.arm>0,this.arms.instanceMatrix.needsUpdate=!0}separate(t,e){const n=t.surfers,i=this._sep;for(let o=0;o<n.length;o++)for(let a=o+1;a<n.length;a++){const r=n[o],l=n[a],c=r.state==="ride"||r.state==="go",h=l.state==="ride"||l.state==="go";if(c&&h)continue;const u=ou*r.scale,f=ou*l.scale,d=Math.sin(r.head)*u,v=Math.cos(r.head)*u,g=Math.sin(l.head)*f,x=Math.cos(l.head)*f;if(JM(r.x-d,r.z-v,r.x+d,r.z+v,l.x-g,l.z-x,l.x+g,l.z+x,i),i.d>=au)continue;let p=i.x,m=i.z,M=i.d;M<1e-4&&(p=r.x-l.x,m=r.z-l.z,M=Math.hypot(p,m),M<1e-6&&(p=t.tx[0],m=t.tz[0],M=1));const _=Math.min(au-i.d,.04*e)/M,E=c?0:h?1:.5;r.x+=p*_*E,r.z+=m*_*E,l.x-=p*_*(1-E),l.z-=m*_*(1-E)}}stepSurfer(t,e,n,i,o){const a=n-t.wave;let r="sit",l=t.head,c=2.5,h=0,u=0,f=0;if(t.tilt=!0,t.state==="go"&&a>=t.tTake&&(t.state="ride",t.s=t.take),t.state==="sit")t.x+=(t.slotX+Math.sin(o*.05+t.ph)*.012-t.x)*Math.min(1,i*.3),t.z+=(t.slotZ+Math.cos(o*.04+t.ph)*.012-t.z)*Math.min(1,i*.3),l=e.seaHead+t.look+Math.sin(o*.05+t.ph)*.15,c=.5,h=-.12;else if(t.state==="go"){const d=Math.min(e.n-1,Math.round(t.take/e.step)),v=Math.atan2(t.fx-t.sx,t.fz-t.sz);if(a<t.a0)l=v,c=1.2,h=-.12;else{const g=Math.min(1,(a-t.a0)/Math.max(.001,t.tTake-t.a0)),x=(g<.2?g*g/.4:g-.1)/.9;t.x=t.sx+(t.fx-t.sx)*x,t.z=t.sz+(t.fz-t.sz)*x;const p=Math.atan2(e.tx[d]*.55-e.nx[d]*.85,e.tz[d]*.55-e.nz[d]*.85);l=v+Li(p-v)*Ln(.6,1,g),c=2.2,r="prone",f=1.4,h=-.04,t.tilt=g<.6}}else if(t.state==="ride"){t.tilt=!1;const d=a-t.tTake,v=this.breakS(e,ii.speed*a);let g=e.len;for(const k of e.surfers)k!==t&&(k.state==="ride"||k.state==="out"||k.state==="fall")&&k.wave===t.wave&&k.s>t.s&&(g=Math.min(g,k.s-.08));t.s=Math.max(t.s,Math.min(v+t.lead*Ln(0,1.5,d),t.s+.13*i,g));const x=Math.min(e.n-1.001,t.s/e.step),p=x|0,m=x-p,M=e.x[p]+(e.x[p+1]-e.x[p])*m,_=e.z[p]+(e.z[p+1]-e.z[p])*m,E=e.nx[p],y=e.nz[p],w=Ln(1,3,d),A=xa+(-.03-xa)*Ln(0,1.2,d)+.012*Math.sin(d*1.6+t.ph)*w;t.x=M+E*A,t.z=_+y*A;const b=.9*Math.exp(-d*1.4)+.12-.3*Math.cos(d*1.6+t.ph)*w,S=Math.cos(b),R=Math.sin(b);l=Math.atan2(e.tx[p]*S-E*R,e.tz[p]*S-y*R),c=5,r="ride",h=.06*Math.exp(-d),u=.12*Math.sin(b),(d>=t.dur||t.s>=e.len-.01||v>t.s+.08)&&(t.state=t.fall||v>t.s+.08?"fall":"out",t.t=0)}else if(t.state==="out"||t.state==="fall"){t.t+=i;const d=Math.min(e.n-1,Math.round(t.s/e.step));t.state==="out"?(t.x+=e.nx[d]*i*.01,t.z+=e.nz[d]*i*.01,l=e.seaHead,c=1.8,r=t.t<.6?"ride":"sit",h=-.12,t.tilt=t.t>.6):(t.x-=e.nx[d]*i*.02,t.z-=e.nz[d]*i*.02,r=t.t<1.8?null:"prone",u=Math.PI*Ln(0,.5,t.t)*(1-Ln(1.2,1.8,t.t)),h=.4*Math.sin(Math.min(t.t,1.8)*3.5),c=0,t.tilt=!1),t.t>2.6&&this.paddleBack(t,e)}else if(t.state==="back"){const d=t.leg===0?t.wx:t.slotX+(t.leg===1?e.nx[0]*.12:0),v=t.leg===0?t.wz:t.slotZ+(t.leg===1?e.nz[0]*.12:0),g=d-t.x,x=v-t.z,p=Math.hypot(g,x),m=.017*t.pace*(t.leg===2?.6:1);p<m*i+.003?t.leg===2?(t.state="sit",t.since=o):t.leg++:(t.x+=g/p*m*i,t.z+=x/p*m*i,l=Math.atan2(g,x)),c=1.5,r="prone",f=t.leg===2?.6:.85,h=-.04}t.head+=Li(l-t.head)*Math.min(1,i*c),t.pose=r,t.pitch=h,t.roll=u,t.stroke=f}drawSurfer(t,e){const n=.0012+Math.sin(e*1.7+t.ph)*4e-4;let i=t.pitch,o=t.roll;if(t.pose!=="ride"&&(i+=Math.sin(e*1.1+t.ph)*.03,o+=Math.sin(e*.9+t.ph*1.3)*.04),t.tilt){const c=this.app.ocean,h=la(c.swellTimeAt(t.x,t.z),this._sw),u=c.swellDir,f=(ru(h.age)*h.height+ru(-h.next))*(.014/ii.speed);i+=f*(u[0]*Math.sin(t.head)+u[1]*Math.cos(t.head))}const a=this.counts,r=lt*t.scale;this.setInstance(this.boards,a.board++,t.x,n,t.z,t.head,r,t.tint,i,o);const l=t.pose;if(l&&(this.setInstance(this.surfPose[l],a[l]++,t.x,n,t.z,t.head+(l==="ride"&&t.goofy?Math.PI:0),r,1,i,o),l==="prone")){this._mb.copy(this._m);for(let c=1;c>=-1;c-=2){const h=(e*t.stroke+t.ph+(c>0?0:.5))%1,u=(h-.55)/.45,f=h<.55?1.3-1.6*h/.55:-.3+1.6*u,d=h<.55?0:Math.sin(Math.PI*u)*1.1;this._ml.makeRotationZ(c*d),this._ma.makeRotationX(-f),this._ml.multiply(this._ma).setPosition(.25*c,.2,.45),this._ma.multiplyMatrices(this._mb,this._ml),this.arms.setMatrixAt(a.arm++,this._ma)}}}trackY(t,e){const n=Math.max(0,Math.min(t.n-1.001,e/t.ds)),i=n|0;return t.y[i]+(t.y[i+1]-t.y[i])*(n-i)}sledOnTrack(t,e,n){const i=this.trackY(t,e+wn),o=this.trackY(t,e-wn);return n.y=Math.max((i+o)/2,this.trackY(t,e)),n.pitch=Math.atan2(o-i,wn*2),n}slide(t,e,n){const i=t.len-wn-.005,o=Math.ceil(n/.02),a=n/o;for(let r=0;r<o;r++){const l=(this.trackY(t,e.s+.02)-this.trackY(t,e.s-.02))/.04*(lo/qt),c=Math.atan(-l);let h=9.8*Math.sin(c)-.11*9.8*Math.cos(c)-.003*e.v*e.v;const u=(i-e.s)/lo,f=e.v*e.v/(2*Math.max(u,.5));f>2.5&&(h=Math.min(h,-f)),e.v=Math.max(e.v+h*a,u>1?1.5:0),e.s=Math.min(i,e.s+e.v*Math.cos(c)*a*lo)}return e.s>=i-1e-4||e.v<=0}holuaFor(t,e){const n=this.app.camera.position,i=Math.hypot(n.x-(t.x[0]+t.x[t.n-1])/2,n.z-(t.z[0]+t.z[t.n-1])/2)>7;let o=null;for(const u of t.riders)u.state==="wait"&&(!o||u.since<o.since)&&(o=u);if(!o)for(const u of t.riders)(u.state==="home"||u.state==="walk"&&u.s<t.len-3)&&(!o||u.s<o.s)&&(o=u);let a=t.runner;if(!i||e.remain<1.5){a||(t.next=Math.min(t.next,t.time));return}const r=Math.round((t.len-1.3)/t.ds);if(a&&a.state==="run"&&a.s>=r*t.ds&&t.tAt[t.n-1]-t.tAt[Math.min(t.n-1,Math.round(a.s/t.ds))]>e.remain+1.5)return;if(!a||a.state==="rest"||a.state==="run"&&a.s>=r*t.ds){if(!o)return;a&&(a.state="rise"),a=o}for(const u of t.riders)(u.state==="rise"||u.state==="walk"&&u.s>t.len-.3)&&(u.state="walk",u.s=Math.min(u.s,t.len-.3),u.t=0);const l=t.tAt[r]-(e.remain+5);let c=0;for(;c<r&&t.tAt[c]<l;)c++;const h=Math.max(wn,c*t.ds);(a.state!=="run"||a.s<h)&&(a.s=h,a.v=t.vAt[c]),a.state="run",a.t=0,t.runner=a}updateHolua(t,e,n){const i=this.holua;if(!i)return n;const o=this.rand;if(!i.runner&&i.time>=i.next){let r=null;for(const l of i.riders)l.state==="wait"&&(!r||l.since<r.since)&&(r=l);r&&(r.state="walkin",r.t=0,i.runner=r)}this._ns=0;for(const r of i.riders)n=this.stepRider(r,i,t,e,n,o);const a=i.runner?i.runner.state:null;return this.sledders.count=a==="set"||a==="run"||a==="rest"?1:0,this.sledders.visible=this.sledders.count>0,this.sleds.count=this._ns,this.sleds.visible=this._ns>0,this.sleds.instanceMatrix.needsUpdate=!0,this.sledders.instanceMatrix.needsUpdate=!0,n}standY(t,e,n,i,o){const a=Fn(this.app.terrain,i,o);return e<0||e>t.len?a:a+(Math.max(a,this.trackY(t,e))-a)*Ln(.056,.032,Math.abs(n))}stepRider(t,e,n,i,o,a){const r=this.app.terrain,l=this.poseMeshes.stand,c=this._pose,h=-e.dz,u=e.dx;t.t+=n;const f=wn;t.state==="rest"&&t.t>2&&(t.state="rise",t.t=0,e.runner=null,e.next=e.time+25+a()*55);let d=0,v=0,g=0,x=!0;if(t.state==="wait"){d=t.spotS,v=t.spotOff,g=e.head+Math.sin(i*.1+t.ph)*.5,x=!1;const _=e.x[0]+e.dx*(d-.012)+h*v,E=e.z[0]+e.dz*(d-.012)+u*v,y=Fn(r,_+h*wn,E+u*wn),w=Fn(r,_-h*wn,E-u*wn);this.setInstance(this.sleds,this._ns++,_,(y+w)/2,E,Math.atan2(h,u),lt,1,Math.atan2(w-y,wn*2))}else if(t.state==="walkin"){const _=f*.5,E=.065*t.side,y=_-t.spotS,w=Math.abs(t.spotOff-E),A=t.t*.022*t.pace,b=(y+w)/(.022*t.pace);A<y?(d=t.spotS+A,v=t.spotOff,g=e.head):A<y+w?(d=_,v=t.spotOff+(E-t.spotOff)*((A-y)/w),g=Math.atan2(h*(E-t.spotOff),u*(E-t.spotOff))):(d=_,v=E+(.016*t.side-E)*Ln(b,b+1.6,t.t),g=e.head),t.t>b+1.6&&(t.state="set",t.t=0,t.s=f,t.v=0)}else{if(t.state==="set"||t.state==="run"||t.state==="rest")return t.state==="set"&&t.t>1.6&&(t.state="run",t.v=1.5),t.state==="run"&&this.slide(e,t,n)&&(t.state="rest",t.t=0),this.sledOnTrack(e,t.s,c),this.setInstance(this.sledders,0,e.x[0]+e.dx*t.s,c.y,e.z[0]+e.dz*t.s,e.head,lt,1,c.pitch),o;if(t.state==="rise")this.sledOnTrack(e,t.s,c),this.setInstance(this.sleds,this._ns++,e.x[0]+e.dx*t.s,c.y,e.z[0]+e.dz*t.s,e.head,lt,1,c.pitch),d=t.s,v=.016*t.side,g=e.head+Math.PI+t.side*1.2,x=!1,t.t>3&&(t.state="walk",t.t=0);else if(t.state==="walk"){const _=(this.trackY(e,t.s-.02)-this.trackY(e,t.s+.02))/.04;let E=-1;for(const y of e.riders)y!==t&&(y.state==="walk"||y.state==="home"&&y.t<2)&&y.side===t.side&&y.s<t.s&&y.s>E&&(E=y.s);t.s=Math.max(0,E+.03,t.s-.022*t.pace*n/(1+1.2*Math.abs(_))),d=t.s,v=(.016+.074*Ln(0,.15,e.len-t.s))*t.side,g=e.head+Math.PI,t.s<=0&&(t.state="home",t.t=0)}else{const _=.09*t.side,E=Math.abs(t.wayOff-_),y=-t.spotS,w=Math.abs(t.wayOff-t.spotOff),A=t.t*.02*t.pace;let b=0,S=0;A<E?(v=_+(t.wayOff-_)*(A/E),S=t.wayOff-_):A<E+y?(d=E-A,v=t.wayOff,b=-1):(d=t.spotS,v=t.wayOff+(t.spotOff-t.wayOff)*Math.min(1,(A-E-y)/w),S=t.spotOff-t.wayOff),g=Math.atan2(e.dx*b+h*S,e.dz*b+u*S),A>=E+y+w&&(t.state="wait",t.since=i)}}const p=e.x[0]+e.dx*d+h*v,m=e.z[0]+e.dz*d+u*v,M=this.standY(e,d,v,p,m);return x?this.carry(l,o,p,M,m,g,i,t):(this.setInstance(l,o++,p,M,m,g,lt),o)}carry(t,e,n,i,o,a,r,l){return i+=Math.abs(Math.sin(r*4.5+l.ph))*6e-4,this.setInstance(t,e++,n,i,o,a,lt),this._mb.copy(this._m),this._ml.makeRotationX(-.3).setPosition(.3,1.36,-.2),this._ma.multiplyMatrices(this._mb,this._ml),this.sleds.setMatrixAt(this._ns++,this._ma),e}}const on=Vt/bn,re=Vt/le,Wl=on*.5,n2=.12,_0=1.6,xe=(s,t,e)=>s<t?t:s>e?e:s,yn=(s,t,e)=>{const n=xe((e-s)/(t-s),0,1);return n*n*(3-2*n)},i2=s=>s-Math.PI*2*Math.round(s/(Math.PI*2)),an=s=>{const t=Math.sin(s*127.1+311.7)*43758.5453;return t-Math.floor(t)};function cu(s,t,e,n){let i=(e+ht)/Vt*t-.5,o=(n+ht)/Vt*t-.5;i<0&&(i=0),o<0&&(o=0),i>t-1.001&&(i=t-1.001),o>t-1.001&&(o=t-1.001);const a=i|0,r=o|0,l=i-a,c=o-r,h=r*t+a,u=s[h]+(s[h+1]-s[h])*l,f=s[h+t]+(s[h+t+1]-s[h+t])*l;return u+(f-u)*c}const Ca=(s,t)=>{const e=xe(Math.floor((s+ht)/re),0,le-1);return xe(Math.floor((t+ht)/re),0,le-1)*le+e};function Fs(s,t,e,n,i,o){const a=i-e,r=o-n,l=a*a+r*r||1e-9,c=xe(((s-e)*a+(t-n)*r)/l,0,1);return Math.hypot(e+a*c-s,n+r*c-t)}function s2(s,t,e){let n=1/0;for(let i=1;i<e.length;i++)n=Math.min(n,Fs(s,t,e[i-1][0],e[i-1][1],e[i][0],e[i][1]));return n}function w0(s,t){const e=t*t/19.62;return s<=e?Math.sqrt(Math.max(0,s)/4.905):t/9.81+(s-e)/t}function Bn(s,t,e=[0,0]){const{pts:n,along:i}=s,o=n.length;if(t<=0)return e[0]=n[0][0],e[1]=n[0][1],0;let a=0,r=o-1;if(t>=i[r])return e[0]=n[r][0],e[1]=n[r][1],r-1;for(;r-a>1;){const c=a+r>>1;i[c]<=t?a=c:r=c}const l=(t-i[a])/(i[r]-i[a]||1);return e[0]=n[a][0]+(n[r][0]-n[a][0])*l,e[1]=n[a][1]+(n[r][1]-n[a][1])*l,a}const _a=.1;function hu(s,t,e){const n=[],i=[0,0];for(let o=0;o<s.length;o++){const a=s[o],r=a.along[a.along.length-1],l=Math.floor(r/_a)+1;if(l<8)continue;const c=new Float64Array(l),h=new Float64Array(l),u=new Float64Array(l),f=new Int32Array(l);for(let x=0;x<l;x++)f[x]=Bn(a,x*_a,i),c[x]=i[0],h[x]=i[1],u[x]=t(i[0],i[1]);const d=l-4,v=new Float64Array(l);for(let x=0;x<d;x++)v[x]=(u[x]-u[x+4])/40;let g=0;for(;g<d;){if(!(v[g]>.8)||u[g]<2){g++;continue}const x=g;let p=g;for(;p<d&&v[p]>.8;)p++;let m=p-1;const M=[];for(;;){let S=m+1;for(;S<d&&v[S]<=.8&&S-(m+1)<=5;)S++;if(S<d&&v[S]>.8&&S-(m+1)<=5){for(M.push(m+1);S<d&&v[S]>.8;)S++;m=S-1}else break}g=m+1;let _=x,E=-1/0;for(let S=Math.max(1,x-2);S<=x;S++){const R=v[S+1]-v[S-1];R>E&&(E=R,_=S)}let y=Math.min(l-1,m+4);for(let S=m;S<=Math.min(l-3,m+4);S++)if(v[S]<.3&&v[S+1]<.3&&v[S+2]<.3){y=S;break}const w=u[_]-u[y];if(w<60)continue;let A=!1;for(let S=_;S<=y&&!A;S++)e(c[S],h[S])&&(A=!0);if(A)continue;const b=a.area[f[_]];n.push({laid:o,sLip:_*_a,sBase:y*_a,lip:[c[_],u[_],h[_]],base:[c[y],u[y],h[y]],drop:w,A:b,per:xe((Math.log10(b)-.35)/.9,0,1),ledges:M.filter(S=>S>_&&S<y).map(S=>u[_]-u[S]).filter(S=>S>8&&S<w-8),samples:{xs:c,zs:h,hs:u,i0:_,i1:y}})}}return n}function o2(s,t={}){const e=t.carve!==!1,n=performance.now(),{data:i,meta:o}=s,a=i.height,r=(L,W)=>cu(a,bn,L,W),l=(L,W)=>cu(i.height1024,le,L,W),c=zo(o,i),h=performance.now(),u=new Uint8Array(le*le);let f=!1;const d=[];for(const L of o.sites.loi)for(const W of L.paddies){const[j,P]=W.c;if(d.push([j,P]),W.level<l(j,P)-25){f=!0;const O=.3;for(let G=Math.floor((P-O+ht)/re);G<=Math.floor((P+O+ht)/re);G++)for(let K=Math.floor((j-O+ht)/re);K<=Math.floor((j+O+ht)/re);K++)K<0||G<0||K>=le||G>=le||Math.hypot(-ht+(K+.5)*re-j,-ht+(G+.5)*re-P)<=O&&(u[G*le+K]=1)}}const v=(L,W)=>u[Ca(L,W)]?l(L,W):r(L,W),g=[...o.sites.houses.map(L=>[L.x,L.z]),...o.sites.villages.map(L=>[L.x,L.z]),...o.sites.heiau.map(L=>[L.x,L.z]),...d],x=(L,W)=>u[Ca(L,W)]===1;let p=hu(c,v,x);const m=performance.now(),M=o.ahupuaa.find(L=>L.id===o.sites.model),_=(M==null?void 0:M.trunk)||[],E=_.map(L=>[L[0],L[1]]),y=[];for(const L of p){const j=E.length>1&&s2(L.lip[0],L.lip[2],E)<1.5&&L.A>=2&&L.drop>=100;if(!j&&!(L.A>=3&&L.drop>=120))continue;const{xs:P,zs:O,hs:G,i0:K,i1:Q}=L.samples;let ot=-1;for(let gt=Q;gt>K;gt--){let Ct=!0;for(let Lt=K+1;Lt<gt&&Ct;Lt++)Fs(P[Lt],O[Lt],P[K],O[K],P[gt],O[gt])>.35&&(Ct=!1);if(Ct){ot=gt;break}}if(ot<0)continue;const $=[P[K],O[K]],Y=[P[ot],O[ot]],rt=Math.hypot(Y[0]-$[0],Y[1]-$[1]),X=G[K]-G[ot];if(X<100||rt<.6)continue;const Mt=(Y[0]-$[0])/rt,mt=(Y[1]-$[1])/rt,_t=uu(X,L.A,L.per),xt=[$[0]+Mt*_t.sLand,$[1]+mt*_t.sLand],kt=_t.wBase;let at=!1;const B=kt+.5,D=Math.floor((Math.min($[0],Y[0])-B+ht)/re),J=Math.floor((Math.max($[0],Y[0])+B+ht)/re),ut=Math.floor((Math.min($[1],Y[1])-B+ht)/re),ct=Math.floor((Math.max($[1],Y[1])+B+ht)/re);for(let gt=Math.max(0,ut);gt<=Math.min(le-1,ct)&&!at;gt++)for(let Ct=Math.max(0,D);Ct<=Math.min(le-1,J)&&!at;Ct++){if(!u[gt*le+Ct])continue;const Lt=-ht+(Ct+.5)*re,dt=-ht+(gt+.5)*re;(Fs(Lt,dt,$[0],$[1],Y[0],Y[1])<=kt||Math.hypot(Lt-xt[0],dt-xt[1])<=_t.poolR+.5)&&(at=!0)}if(at||g.some(gt=>Fs(gt[0],gt[1],$[0],$[1],Y[0],Y[1])<=kt+.3))continue;const ft=G[ot],Rt=G[K],vt=Math.pow(X,.7)*Math.sqrt(L.A)*(ft<650?1.5:.6)*(Rt<700?1.3:1)*(j?3:1);y.push({f:L,L:$,B:Y,len:rt,D:X,b:ot,isModel:j,score:vt,ux:Mt,uz:mt})}y.sort((L,W)=>W.score-L.score);const w=[];for(const L of y){if(w.length>=4)break;w.some(W=>Math.hypot(W.L[0]-L.L[0],W.L[1]-L.L[1])<8)||w.push(L)}let A=w.findIndex(L=>L.isModel);if(A<0&&w.length){let L=_[0];for(const P of _)Math.abs(P[2]-260)<Math.abs(L[2]-260)&&(L=P);const W=L?L[0]:0,j=L?L[1]:0;A=0;for(let P=1;P<w.length;P++)Math.hypot(w[P].L[0]-W,w[P].L[1]-j)<Math.hypot(w[A].L[0]-W,w[A].L[1]-j)&&(A=P)}A>0&&w.unshift(w.splice(A,1)[0]);const b=[],S=[];for(const L of w){const W=L.f,j=c[W.laid],P=L.f.samples.hs[L.f.samples.i0],O=L.f.samples.hs[L.b],G=uu(L.D,W.A,W.per);e&&b.push(a2(a,i.normals,L.L,L.B,P,O,G,g));const K=r(L.L[0],L.L[1]),Q=r(L.B[0],L.B[1]),ot=L.L[0]+L.ux*G.sLand,$=L.L[1]+L.uz*G.sLand;let Y=1/0;for(let _t=0;_t<16;_t++){const xt=_t/16*Math.PI*2;Y=Math.min(Y,r(ot+Math.cos(xt)*G.poolR,$+Math.sin(xt)*G.poolR))}const rt=r(ot,$),X=Math.max(Y-.5,rt+1);let Mt=W.sLip,mt=1/0;for(let _t=0;_t<j.pts.length;_t++){const xt=Math.hypot(j.pts[_t][0]-ot,j.pts[_t][1]-$);xt<mt&&j.along[_t]>=W.sLip&&(mt=xt,Mt=j.along[_t])}S.push({kind:0,laid:W.laid,src:j.src,sLip:W.sLip,sBase:W.sLip+L.len,sPool:Mt,lip:[L.L[0],K,L.L[1]],base:[L.B[0],Q,L.B[1]],drop:K-X,A:W.A,per:W.per,ledges:[],model:L.isModel,face:[L.ux,L.uz],pool:[ot,X,$],poolR:G.poolR,carve:{faceRun:G.faceRun,faceFrac:G.faceFrac,wFace:G.wFace,wBase:G.wBase,sLand:G.sLand,yF:O+(1-G.faceFrac)*(P-O)}})}const R=performance.now();b.length&&(p=hu(c,v,x));const k=[];for(const L of p)S.some(W=>W.laid===L.laid&&L.sBase>=W.sLip-.1&&L.sLip<=W.sPool||Math.hypot(W.lip[0]-L.lip[0],W.lip[2]-L.lip[2])<.4)||(delete L.samples,L.kind=1,L.src=c[L.laid].src,k.push(L));k.sort((L,W)=>W.drop-L.drop);const I=[...S,...k].slice(0,Ra);for(const L of I)L.rain=i.rain[Ca(L.lip[0],L.lip[2])],L.ribbonA=c[L.laid].lineA;const T=performance.now(),C=r2(c,I,i,r),F=performance.now(),N=new Map,z=(L,W,j,P,O,G)=>{N.has(L)||N.set(L,[]),N.get(L).push({h0:W,h1:j,r0:P,r1:O,level:G})};for(const L of I){let W=L.kind===0?L.sPool:L.sBase;if(L.kind===0&&e){const{pts:K,along:Q}=c[L.laid];for(let ot=0;ot<K.length;ot++){if(Q[ot]<=W||Q[ot]>L.sPool+1.2)continue;const $=K[ot][0]-L.lip[0],Y=K[ot][1]-L.lip[2],rt=$*L.face[0]+Y*L.face[1];if(r(K[ot][0],K[ot][1])-r(L.lip[0]+L.face[0]*rt,L.lip[2]+L.face[1]*rt)>4)W=Q[Math.min(K.length-1,ot+1)];else break}}const j=Math.max(0,L.sLip-(L.kind===0?.06:.03)),P=L.kind===0?L.sLip:Math.min(L.sLip+.12,(L.sLip+L.sBase)/2),O=L.kind===0?W:Math.max(P,W-.15),G=L.kind===0?.05:W-O;z(L.laid,P,O,P-j,G,L.kind===0?L.pool[1]:void 0),L.hand={a:j,b:P,c:L.kind===0?1/0:O,d:L.kind===0?1/0:O+G}}if(e)for(const L of S){const[W,j]=L.face,P=Math.hypot(L.base[0]-L.lip[0],L.base[2]-L.lip[2]),O=(G,K)=>{const Q=G-L.lip[0],ot=K-L.lip[2],$=Q*W+ot*j,Y=-Q*j+ot*W;return $>-.05&&$<P&&Math.abs(Y)<.8*(L.carve.wFace+(1.4-L.carve.wFace)*Math.max(0,$)/P)};for(let G=0;G<c.length;G++){if(G===L.laid)continue;const{pts:K,along:Q}=c[G];let ot=-1;for(let $=0;$<=K.length;$++){const Y=$<K.length&&O(K[$][0],K[$][1]);Y&&ot<0&&(ot=$),!Y&&ot>=0&&(z(G,Q[Math.max(0,ot-1)],Q[Math.min(K.length-1,$)],.04,.04),ot=-1)}}}const U=performance.now();return{falls:I,threads:C,cuts:N,carved:b,lines:c,akua:S.length?0:-1,trench:f,ms:{lay:h-n,detect:m-h,carve:R-m,threads:F-T,total:U-n}}}function uu(s,t,e){const o=xe(.3+.0025*s,.7,1.1),a=1.4,r=xe(.05+5e-4*s+.02*Math.sqrt(t),.06,.3),l=2.2+3.5*e+1.5,c=Wl+xe(l*w0(.82*s,30)*.01,.1+.06,.1+.3);return{faceFrac:.82,faceRun:.1,wFace:o,wBase:a,poolR:r,v0:l,sLand:c}}function a2(s,t,e,n,i,o,a,r){const l=bn,{faceRun:c,faceFrac:h,wFace:u,wBase:f,poolR:d,sLand:v}=a,g=Math.hypot(n[0]-e[0],n[1]-e[1]),x=(n[0]-e[0])/g,p=(n[1]-e[1])/g,m=i-o,M=o+(1-h)*m,_=2,E=Math.max(1,Math.floor((Math.min(e[0],n[0])-_+ht)/on)),y=Math.min(l-2,Math.ceil((Math.max(e[0],n[0])+_+ht)/on)),w=Math.max(1,Math.floor((Math.min(e[1],n[1])-_+ht)/on)),A=Math.min(l-2,Math.ceil((Math.max(e[1],n[1])+_+ht)/on)),b=r.filter(k=>k[0]>-ht+E*on-.5&&k[0]<-ht+y*on+.5&&k[1]>-ht+w*on-.5&&k[1]<-ht+A*on+.5);let S=0;for(let k=w;k<=A;k++)for(let I=E;I<=y;I++){const T=-ht+(I+.5)*on,C=-ht+(k+.5)*on,F=T-e[0],N=C-e[1],z=F*x+N*p,U=-F*p+N*x,L=z-Wl-_0*U*U;if(L<0||z>g||b.some(Q=>Math.hypot(Q[0]-T,Q[1]-C)<.3))continue;let W=L<c?i+(M-i)*(L/c):M+(o-M)*(L-c)/Math.max(.1,g-c);const j=Math.hypot(z-v,U)/(d*1.1);j<1&&(W-=6*(1-j*j));const P=u+(f-u)*z/g,O=(1-yn(.55*P,P,Math.abs(U)))*(1-yn(g-.45,g,z)),G=k*l+I,K=s[G]+(W-s[G])*O;K<s[G]&&(s[G]=K,S++)}const R=Vt/l;for(let k=w-1;k<=A+1;k++)for(let I=E-1;I<=y+1;I++){const T=k*l+I,C=s[k*l+Math.min(l-1,I+1)]-s[k*l+Math.max(0,I-1)],F=s[Math.min(l-1,k+1)*l+I]-s[Math.max(0,k-1)*l+I],N=-C*qt/(2*R),z=-F*qt/(2*R),U=Math.hypot(N,1,z);t[T*4]=Math.round((N/U*.5+.5)*255),t[T*4+1]=Math.round((1/U*.5+.5)*255),t[T*4+2]=Math.round((z/U*.5+.5)*255)}return{i0:E,i1:y,j0:w,j1:A,texels:S}}function r2(s,t,e,n){const i=le,o=e.rain,a=.25,r=(T,C)=>Math.floor((T+ht)/a)*4096+Math.floor((C+ht)/a),l=new Map,c=[0,0];for(const T of s){const C=T.along[T.along.length-1];for(let F=0;F<=C;F+=.1){Bn(T,F,c);const N=r(c[0],c[1]);let z=l.get(N);z||l.set(N,z=[]),z.push(c[0],c[1])}}const h=(T,C,F,N)=>{const z=Math.floor((T+ht)/a),U=Math.floor((C+ht)/a);let L=F,W=!1;for(let j=-1;j<=1;j++)for(let P=-1;P<=1;P++){const O=l.get((z+P)*4096+U+j);if(O)for(let G=0;G<O.length;G+=2){const K=Math.hypot(O[G]-T,O[G+1]-C);K<L&&(L=K,W=!0,N&&(N[0]=O[G],N[1]=O[G+1]))}}return W},u=t.map(T=>{const C=T.kind===0?1.4:.6;return{a:T.lip,b:T.base,r:C,x0:Math.min(T.lip[0],T.base[0])-C,x1:Math.max(T.lip[0],T.base[0])+C,z0:Math.min(T.lip[2],T.base[2])-C,z1:Math.max(T.lip[2],T.base[2])+C}}),f=(T,C)=>u.some(F=>T>F.x0&&T<F.x1&&C>F.z0&&C<F.z1&&Fs(T,C,F.a[0],F.a[2],F.b[0],F.b[2])<F.r),d=(T,C,F)=>(F[0]=(n(T+.05,C)-n(T-.05,C))/(2*.05*100),F[1]=(n(T,C+.05)-n(T,C-.05))/(2*.05*100),Math.hypot(F[0],F[1]));let v=i,g=-1,x=i,p=-1;for(let T=0;T<i;T++)for(let C=0;C<i;C++)o[T*i+C]>2500&&(C<v&&(v=C),C>g&&(g=C),T<x&&(x=T),T>p&&(p=T));const m=[],M=[0,0],_=new Float64Array(3*404),E=4*on;for(let T=-ht+(x+.5)*re;T<=-ht+(p+.5)*re;T+=E)for(let C=-ht+(v+.5)*re;C<=-ht+(g+.5)*re;C+=E){const F=C+(an(C*13.7+T*3.1)-.5)*E,N=T+(an(C*5.3-T*11.9)-.5)*E,z=o[Ca(F,N)];if(z<=2500)continue;const U=n(F,N);if(U<=60||d(F,N,M)<=1.2||h(F,N,.25)||f(F,N))continue;_[0]=F,_[1]=U,_[2]=N;let L=1,W=F,j=N,P=U,O=0,G=0,K=!1;for(let X=0;X<400;X++){const Mt=d(W,j,M);if(Mt<1e-6)break;const mt=W-M[0]/Mt*.05,_t=j-M[1]/Mt*.05,xt=n(mt,_t);if(xt>=P)break;if((P-xt)/5>=.9?(G+=P-xt,O=0):O++,W=mt,j=_t,P=xt,_[L*3]=W,_[L*3+1]=P,_[L*3+2]=j,L++,O>=3){K=!0;break}if(X>2&&h(W,j,.25,c)){_[L*3]=c[0],_[L*3+1]=n(c[0],c[1]),_[L*3+2]=c[1],L++;break}if(P<3)break}if(G<140||(K&&(L-=3),L<4))continue;let Q=!1;for(let X=2;X<L&&!Q;X+=2)Q=f(_[X*3],_[X*3+2]);if(Q)continue;const ot=[];for(let X=0;X<L;X++)ot.push([_[X*3],_[X*3+1],_[X*3+2]]);const $=d(F,N,M),Y=d(F+M[0]/$*.4,N+M[1]/$*.4,M),rt=ot[0][1]-ot[ot.length-1][1];m.push({pts:ot,drop:rt,rain:z,score:rt*Math.sqrt(z/3e3)*(Y<.8?1.4:1),room:.35+.5*an(F*7.1+N*17.3)})}m.sort((T,C)=>C.score-T.score);const y=new Set,w=.3,A=(T,C)=>Math.floor((T+ht)/w)*4096+Math.floor((C+ht)/w),b=[];for(const T of m){if(b.length>=300)break;const[C,,F]=T.pts[0];if(b.some(U=>Math.abs(U.pts[0][0]-C)<1.7&&Math.abs(U.pts[0][2]-F)<1.7&&Math.hypot(U.pts[0][0]-C,U.pts[0][2]-F)<U.room+T.room))continue;const N=new Set;for(let U=3;U<T.pts.length;U++)N.add(A(T.pts[U][0],T.pts[U][2]));let z=0;for(const U of N)y.has(U)&&z++;if(!(z>3)){for(const U of N)y.add(U);b.push(T)}}for(const T of b){const C=T.pts,F=Math.max(6,Math.round(T.drop/25)),N=[C[0]];let z=1;for(let U=1;U<F-1;U++){const L=C[0][1]-T.drop*U/(F-1);for(;z<C.length-1&&C[z][1]>L;)z++;const W=C[z-1],j=C[z],P=xe((W[1]-L)/(W[1]-j[1]||1),0,1);N.push([W[0]+(j[0]-W[0])*P,L,W[2]+(j[2]-W[2])*P])}N.push(C[C.length-1]),T.pts=N}const S=e.area;for(const T of b){const C=T.pts[T.pts.length-1],F=Math.floor((C[0]+ht)/re),N=Math.floor((C[2]+ht)/re);let z=0;for(let U=Math.max(0,N-1);U<=Math.min(i-1,N+1);U++)for(let L=Math.max(0,F-1);L<=Math.min(i-1,F+1);L++)z=Math.max(z,S[U*i+L]);T.A=z}const R=[...b].sort((T,C)=>C.A-T.A),k=t.find(T=>T.kind===0),I=b.map(T=>{const C=R.indexOf(T)/Math.max(1,R.length-1),F=Math.round(T.pts[0][0]*37+T.pts[0][2]*101),N=T.pts[1][0]-T.pts[0][0],z=T.pts[1][2]-T.pts[0][2],U=Math.hypot(N,z)||1,L=k&&Math.hypot(T.pts[0][0]-k.pool[0],T.pts[0][2]-k.pool[2])<25;return{kind:2,pts:T.pts,lip:T.pts[0],base:T.pts[T.pts.length-1],drop:T.drop,A:T.A,rain:T.rain,thr:.35+.6*Math.pow(C,.8)+(an(F)-.5)*.15,prio:T.drop*Math.sqrt(T.rain/3e3)*(L?2:1),catch:[T.pts[0][0],T.pts[0][2],T.pts[0][0]-N/U*1.5,T.pts[0][2]-z/U*1.5]}});return I.sort((T,C)=>C.prio-T.prio),I}const Ra=512,wa=512,l2=Array.from({length:8},(s,t)=>Math.cos(t/8*Math.PI*2)),c2=Array.from({length:8},(s,t)=>Math.sin(t/8*Math.PI*2)),h2=[60,120,220,1e9],u2=[.25,.5,.75,1],f2=`
${Ze}
${ci}
${Tn}
${hi}
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
`,d2=`
${Ze}
${ci}
${Tn}
${hi}
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
`,p2=`
${Ze}
${ci}
${Tn}
${hi}
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
`,m2=`
${Ze}
${ci}
${Tn}
${hi}
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
`;function g2(){const t=new Uint8Array(4096),e=(i,o,a)=>an((o%i+i)%i*157+(a%i+i)%i*311+i*17);for(let i=0;i<64;i++)for(let o=0;o<64;o++){let a=0,r=.5;for(let l=0;l<4;l++){const c=4<<l,h=o/64*c,u=i/64*c,f=Math.floor(h),d=Math.floor(u),v=h-f,g=u-d,x=v*v*(3-2*v),p=g*g*(3-2*g),m=e(c,f,d)+(e(c,f+1,d)-e(c,f,d))*x,M=e(c,f,d+1)+(e(c,f+1,d+1)-e(c,f,d+1))*x;a+=(m+(M-m)*p)*r,r*=.5}t[i*64+o]=Math.round(xe((a/.9375-.25)/.6,0,1)*255)}const n=new yi(t,64,64,zs,xn);return n.wrapS=n.wrapT=Gi,n.minFilter=ve,n.magFilter=ve,n.needsUpdate=!0,n}class x2{constructor(t,e){const n=performance.now();this.app=t,this.plan=e,this.enabled=!0,this.debugTime=null,this.list=e.falls,this.threads=e.threads.slice(0,Math.max(0,Ra-e.falls.length)),this.nCurtain=e.falls.length,this.n=this.nCurtain+this.threads.length,this.stuck=0,this.nodeKey=new Int32Array(16384).fill(-1),this.nodeVal=new Float64Array(16384),this.build(),this.buildState(),this.buildMist(),this.clearVegetation(),this.group=new En,this.group.add(this.mesh,this.mist),this.heroes=[];for(let o=0;o<this.nCurtain;o++){const a=this.list[o];a.kind===0&&this.heroes.push({index:o,model:a.model,src:a.src,lip:new q(a.lip[0],a.lip[1]*qt,a.lip[2]),base:new q(a.pool[0],a.pool[1]*qt,a.pool[2]),pool:new q(a.pool[0],a.pool[1]*qt,a.pool[2]),poolR:a.poolR,face:a.face,per:a.per,rain:a.rain,mist:new q(a.pool[0],a.pool[1]*qt+.35*(a.lip[1]-a.pool[1])*qt,a.pool[2])})}this.hero=this.heroes[0]||null,this.heroView=null;const i=t.terrain.uniforms;if(this.wallWet=[],i.uFallA&&e.carved.length){for(const o of this.heroes.slice(0,i.uFallA.value.length)){const a=this.list[o.index],r=this.wallWet.length,l=Math.hypot(a.base[0]-a.lip[0],a.base[2]-a.lip[2]);i.uFallA.value[r].set(a.lip[0],a.lip[2],a.face[0],a.face[1]),i.uFallB.value[r].set(a.lip[1],a.pool[1],1.1*a.W0,a.carve.sLand),i.uFallC.value[r].set(l,a.drop,a.carve.wFace,this.wet[o.index]),i.uFallD.value[r].set(a.carve.wBase,_0,Wl,xe(.5+.002*a.drop,.6,1.1)),this.wallWet.push(i.uFallC.value[r])}i.uFalls.value=this.wallWet.length}this.lastStop=-1,this.frustum=new Ws,this.projView=new ie,this.tmp=new q,this.setQuality(t.quality?t.quality.level:2),this.buildMs=performance.now()-n,this.settle()}setHero(t,e=null){this.hero=t,this.heroView=e}fine(t,e){return Math.max(this.app.terrain.metresAt(t,e),this.coarse(0,t,e))}coarse(t,e,n){const i=on*(1<<t),o=(e+ht)/i,a=(n+ht)/i,r=Math.floor(o),l=Math.floor(a),c=o-r,h=a-l,u=this.node(t,r,l),f=this.node(t,r+1,l),d=this.node(t,r,l+1),v=this.node(t,r+1,l+1),g=u+(f-u)*c+(d-u)*h+(u-f-d+v)*c*h,x=c+h<=1?u+(f-u)*c+(d-u)*h:v+(d-v)*(1-c)+(f-v)*(1-h),p=c>=h?u+(f-u)*c+(v-f)*h:u+(d-u)*h+(v-d)*c;return Math.max(g,x,p)}node(t,e,n){const i=(t*4096+n)*4096+e|0,o=(Math.imul(e,73856093)^Math.imul(n,19349663)^Math.imul(t,83492791))&16383;if(this.nodeKey[o]===i)return this.nodeVal[o];const a=on*(1<<t),r=this.app.terrain.metresAt(-ht+e*a,-ht+n*a);return this.nodeKey[o]=i,this.nodeVal[o]=r,r}axisOf(t){const e=[0,0];if(t.kind===0)return Bn(this.plan.lines[t.laid],Math.max(0,t.sLip-.08),e),{poly:[[e[0],e[1]],[t.lip[0],t.lip[2]],[t.base[0],t.base[2]]],lipAt:Math.hypot(e[0]-t.lip[0],e[1]-t.lip[2])};if(t.kind===1){const r=this.plan.lines[t.laid],l=Math.max(0,t.sLip-.03),c=[];Bn(r,l,e),c.push([e[0],e[1]]);for(let h=0;h<r.pts.length;h++)r.along[h]>l+1e-4&&r.along[h]<t.sBase-1e-4&&c.push([r.pts[h][0],r.pts[h][1]]);return Bn(r,t.sBase,e),c.push([e[0],e[1]]),{poly:c,lipAt:t.sLip-l}}const n=t.pts,i=n[1][0]-n[0][0],o=n[1][2]-n[0][2],a=Math.hypot(i,o)||1;return{poly:[[n[0][0]-i/a*.05,n[0][2]-o/a*.05],...n.map(r=>[r[0],r[2]])],lipAt:.05}}spine(t,e){const n=t.kind,{poly:i,lipAt:o}=this.axisOf(t),a=[],r=[],l=[];let c=0;for(let $=0;$<i.length;$++)$>0&&(c+=Math.hypot(i[$][0]-i[$-1][0],i[$][1]-i[$-1][1])),i[$].s=c;const h=c,u=n===2?.04:.02;for(let $=0;$<=h+1e-6;$+=u){let Y=1;for(;Y<i.length-1&&i[Y].s<$;)Y++;const rt=i[Y-1],X=i[Y],Mt=xe(($-rt.s)/(X.s-rt.s||1),0,1);a.push(rt[0]+(X[0]-rt[0])*Mt),r.push(rt[1]+(X[1]-rt[1])*Mt),l.push($-o)}const f=a.length,d=($,Y)=>{const rt=($+o)/u;let X=Math.floor(rt);X<0&&(X=0),X>f-2&&(X=f-2);const Mt=rt-X;Y[0]=a[X]+(a[X+1]-a[X])*Mt,Y[1]=r[X]+(r[X+1]-r[X])*Mt;const mt=a[X+1]-a[X],_t=r[X+1]-r[X],xt=Math.hypot(mt,_t)||1;return Y[2]=mt/xt,Y[3]=_t/xt,Y},v=Math.round(o/u),g=new Float64Array(f);for(let $=0;$<f;$++)g[$]=this.fine(a[$],r[$])*qt;const x=g[v];for(let $=v+1;$<f;$++)g[$]=Math.min(g[$],g[$-1]);const p=$=>{for(let Y=v+1;Y<f;Y++)if(g[Y]<=$){const rt=(g[Y-1]-$)/(g[Y-1]-g[Y]||1);return l[Y-1]+(l[Y]-l[Y-1])*rt}return l[f-1]},m=t.per??0,M=t.A;let _,E,y,w;n===0?(_=2.2+3.5*m+1.5,E=30,y=xe(.08+.03*Math.sqrt(M),.1,.22),w=1.7):n===1?(_=1.2+2.8*m,E=14+14*m,y=xe(.03+.02*Math.sqrt(M),.04,.12),w=1.4):(_=.6,E=9,y=.005+.012*xe(M/.07,0,1),w=1.25);const A=t.drop,b=n===0?36:n===1?xe(Math.round(A/10),12,28):Math.max(6,Math.round(A/25)),S=[];for(let $=0;$<=b;$++)S.push(n===2?A*$/b:A*($/b)*($/b));if(n===0)for(const $ of[16,10,5,2.5])S.push(A-$);else if(n===1)for(const $ of[20,10,4])A>3*$&&S.push(A-$);const R=(t.ledges||[]).slice(0,3);for(const $ of R)S.push($);S.sort(($,Y)=>$-Y);for(let $=S.length-2;$>0;$--)S[$+1]-S[$]<1&&!R.includes(S[$])&&S.splice($,1);const k=n===0?1.05:n===1?.1:1.4,I=n===2?.15:.3,T=[0,0,0,0],C=[],F=$=>{d($.sig,T),$.fx=T[2],$.fz=T[3],$.x=T[0]-T[3]*$.lat,$.z=T[1]+T[2]*$.lat},N=Math.min(.11,.009*Math.sqrt(t.ribbonA??M)+.012)*(n===0?.9:1.25),z=n===0?(t.pool[0]-t.lip[0])*t.face[0]+(t.pool[2]-t.lip[2])*t.face[1]:1/0,U=n===0?-.06:-.03;d(U,T),C.push({x:T[0],y:this.fine(T[0],T[1])*qt+(n===0?.035:.012),z:T[1],fx:T[2],fz:T[3],d:0,hw:n===0?Math.min(N,.5*y):N,contact:1,tongue:-1,sig:U}),d(0,T);const L=n===0?Math.min(.5*y,Math.max(N,.35*y)):n===1?N:Math.min(.5*y,N*.4+.3*y);C.push({x:T[0],y:x+.004,z:T[1],fx:T[2],fz:T[3],d:0,hw:L,contact:1,tongue:0,sig:0});for(const $ of S){const Y=x-$*qt,rt=_*w0($,E)*.01,X=p(Y);let Mt=.5*y*(1+(w-1)*$/Math.max(1,A));n<2&&(Mt*=L/(.5*y)+(1-L/(.5*y))*yn(0,n===0?18:20,$));const mt=.006+I*Mt,_t=Math.min(X+mt,z),xt=Math.max(rt,_t),kt=n===0&&X+mt>z?0:1-yn(0,.03,rt+(n===0?n2:0)-_t),at={y:Y,d:$,hw:Mt,contact:kt,ledge:R.includes($),sig:xt,lat:0};F(at),C.push(at)}const W=($,Y)=>{const rt=C[Math.max(0,$-1)],X=C[Math.min(C.length-1,$+1)];Y[0]=X.x-rt.x,Y[1]=X.y-rt.y,Y[2]=X.z-rt.z;const Mt=Math.hypot(Y[0],Y[1],Y[2])||1;return Y[0]/=Mt,Y[1]/=Mt,Y[2]/=Mt,Y},j=[0,0,0],P=A-(4+.03*A),O=n===2?2:1;for(let $=2;$<C.length;$++){const Y=C[$],rt=C[$-1];if($>2&&rt.sig>Y.sig&&(Y.sig=rt.sig,Y.lat=rt.lat,F(Y)),Y.d>P||n===0&&Y.d<3)continue;W($,j);const X=-Y.fz,Mt=Y.fx;let mt=j[1]*Mt-j[2]*0,_t=j[2]*X-j[0]*Mt,xt=j[0]*0-j[1]*X;const kt=Math.hypot(mt,_t,xt)||1;mt/=kt,_t/=kt,xt/=kt;const at=n===0?1+(.15+.9*yn(10,150,Y.d))*k*(1-yn(.55*A,P,Y.d)):1,B=Y.hw*at,D=Y.hw*(.45+(.25-.45)*Y.contact)*at,J=Y.sig,ut=Y.lat;let ct=0;for(;ct<80;ct++){let ft=!1,Rt=0;for(let gt=0;gt<8;gt+=O){const Ct=l2[gt],Lt=c2[gt],dt=Y.x+X*B*Ct+mt*D*Lt,se=Y.y+_t*D*Lt,Xt=Y.z+Mt*B*Ct+xt*D*Lt;se<this.fine(dt,Xt)*qt+.004&&(ft=!0,Rt+=Ct)}if(!ft)break;const vt=n===0?0:Rt>.5?-.004:Rt<-.5?.004:0;Y.sig+=.005,Y.lat+=vt,F(Y)}ct>=80&&(this.stuck++,Y.sig=J,Y.lat=ut,F(Y))}const G=C.length;if(G>4){const $=C.map(Y=>Y.sig??0);for(let Y=0;Y<4;Y++){let rt=C[2].sig;for(let Mt=3;Mt<G;Mt++){const mt=C[Mt].sig,_t=Mt+1<G?C[Mt+1].sig:mt;C[Mt].sig=Math.max($[Mt],(rt+2*mt+_t)/4),rt=mt}let X=C[2].lat;for(let Mt=3;Mt<G-1;Mt++){const mt=C[Mt].lat;C[Mt].lat=(X+2*mt+C[Mt+1].lat)/4,X=mt}}if(n===1){const Y=Math.min(25,.25*A);for(let rt=2;rt<G;rt++)C[rt].lat*=1-yn(A-Y,A,C[rt].d)}for(let Y=2;Y<G;Y++)F(C[Y])}for(const $ of C){if($.hand=1,!t.hand||n===2||n===0&&$.sig>0)continue;const Y=t.sLip+$.sig,rt=t.hand;let X=xe((Y-rt.a)/Math.max(1e-6,rt.b-rt.a),0,1);n===1&&(X=Math.min(X,1-xe((Y-rt.c)/Math.max(1e-6,rt.d-rt.c),0,1))),$.hand=X}let K=_,Q=0,ot=0;C[0].T=-.4,C[0].s=-3,C[1].T=0,C[1].s=0;for(let $=2;$<C.length;$++){const Y=C[$-1],rt=C[$],X=Math.hypot(rt.x-Y.x,rt.z-Y.z)*100,Mt=(Y.y-rt.y)/qt,mt=Math.hypot(X,Mt),_t=Math.max(1,Math.ceil(mt)),xt=Mt/Math.max(.5,X),kt=rt.contact>.5?9+(E-9)*yn(1.5,5,xt):E;for(let at=0;at<_t;at++)K=Math.sqrt(Math.max(.25,K*K+2*9.81*(Mt/_t)*(1-K*K/(kt*kt)))),Q+=mt/_t/Math.max(.5,K);ot+=mt,rt.T=Q,rt.s=ot,rt.ledge&&(K=2.5)}for(let $=0;$<C.length;$++){const Y=C[$];W($,j),Y.tx=j[0],Y.ty=j[1],Y.tz=j[2];const rt=-Y.fz,X=Y.fx;Y.lift=[0,0,0,0];for(let Mt=0;Mt<4;Mt++){let mt=this.coarse(Mt,Y.x,Y.z)*qt+.01-Y.y;n!==2&&Mt<2&&(mt=Math.max(mt,this.coarse(Mt,Y.x-rt*Y.hw,Y.z-X*Y.hw)*qt+.01-Y.y),mt=Math.max(mt,this.coarse(Mt,Y.x+rt*Y.hw,Y.z+X*Y.hw)*qt+.01-Y.y)),Y.lift[Mt]=Math.max(0,mt)}Y.along=xe(Y.d/Math.max(1,A),0,1),Y.toBase=A-Y.d}return{st:C,W0:y,yL:x,at:d,sigmaT:p,drop:A}}build(){let t=16384;const e={pos:new Float32Array(t*3),axis:new Float32Array(t*3),face:new Float32Array(t*3),fall:new Float32Array(t*4),meta:new Float32Array(t*4),more:new Float32Array(t*3),lift:new Float32Array(t*4)},n={pos:3,axis:3,face:3,fall:4,meta:4,more:3,lift:4};let i=0;const o=(_,E,y,w,A,b,S,R,k,I,T,C,F,N,z,U,L,W,j,P=1)=>{if(i>=t){t*=2;for(const K in e){const Q=new Float32Array(t*n[K]);Q.set(e[K]),e[K]=Q}}const O=i*3,G=i*4;return e.pos[O]=_,e.pos[O+1]=E,e.pos[O+2]=y,e.axis[O]=w,e.axis[O+1]=A,e.axis[O+2]=b,e.face[O]=S,e.face[O+2]=R,e.fall[G]=k,e.fall[G+1]=I,e.fall[G+2]=T,e.fall[G+3]=C,e.meta[G]=F,e.meta[G+1]=N,e.meta[G+2]=z,e.meta[G+3]=U,e.more[i*3]=L,e.more[i*3+1]=W,e.more[i*3+2]=P,j&&(e.lift[G]=j[0],e.lift[G+1]=j[1],e.lift[G+2]=j[2],e.lift[G+3]=j[3]),i++},a=[],r=[],l=[],c=[],h=[];this.stations=[],this.pools=[],this.mistSrc=[];const u=(_,E,y,w,A,b,S,R)=>{const k=Math.atan2(S,b),I=o(y,R??this.fine(y,w)*qt+.003,w,0,1,0,b,S,0,0,A,4,_,E,0,0,1,0,null);for(let T=0;T<=16;T++){const C=T/16*Math.PI*2,F=y+Math.cos(k+C)*A,N=w+Math.sin(k+C)*A;o(F,R??this.fine(F,N)*qt+.003,N,0,1,0,b,S,0,0,A,4,_,E,1,C,1,0,null),T>0&&a.push(I,I+T,I+T+1)}this.pools.push([y,w,A])},f=(_,E,y,w,A)=>{const b=_.st;let S=-1;for(let R=0;R<b.length;R++){const k=b[R],I=o(k.x,k.y,k.z,k.tx,k.ty,k.tz,k.fx,k.fz,k.s,k.T,k.hw,A,E,y,-1,k.contact,k.along,k.toBase,k.lift,k.hand);o(k.x,k.y,k.z,k.tx,k.ty,k.tz,k.fx,k.fz,k.s,k.T,k.hw,A,E,y,1,k.contact,k.along,k.toBase,k.lift,k.hand),S>=0&&w.push(S,S+1,I,S+1,I+1,I),S=I,A!==2&&this.stations.push(k.x,k.z)}},d=[0,0,0,0];for(let _=0;_<this.nCurtain;_++){const E=this.list[_],y=an(_*7.13+1.7),w=this.spine(E,_);E.W0=w.W0,f(w,_,y,E.kind===0?r:l,E.kind);const A=this.plan.lines[E.laid],b=E.kind===0?E.sPool:E.sBase,S=[0,0],R=[0,0];Bn(A,b,S),Bn(A,b+.15,R);let k=R[0]-S[0],I=R[1]-S[1];const T=Math.hypot(k,I);T<1e-4?(k=E.face?E.face[0]:1,I=E.face?E.face[1]:0):(k/=T,I/=T);const C=E.drop,F=E.kind===0?E.poolR:xe(.05+5e-4*C+.02*Math.sqrt(E.A),.06,.3),N=w.st[w.st.length-1],z=E.kind===0?E.pool[0]:N.x,U=E.kind===0?E.pool[2]:N.z,L=.05,W=Math.hypot(this.fine(z+L,U)-this.fine(z-L,U),this.fine(z,U+L)-this.fine(z,U-L))/(2*L*100),j=this.list.some(P=>P!==E&&Math.hypot(P.lip[0]-z,P.lip[2]-U)<F+.4);(E.kind===0||W<.35&&!j)&&u(_,y,z,U,F,k,I,E.kind===0?E.pool[1]*qt:void 0),E.poolAt=[z,E.kind===0?E.pool[1]:this.fine(z,U),U,F];for(const P of(E.ledges||[]).slice(0,3))w.at(w.sigmaT(w.yL-P*qt),d),Math.hypot(this.fine(d[0]+L,d[1])-this.fine(d[0]-L,d[1]),this.fine(d[0],d[1]+L)-this.fine(d[0],d[1]-L))/(2*L*100)<.35&&u(_,y+.37,d[0],d[1],F*.6,d[2],d[3]);this.mistSrc.push({id:_,f:E,sp:w,ox:k,oz:I})}for(let _=0;_<this.threads.length;_++){const E=this.threads[_],y=this.nCurtain+_,w=this.spine(E,y);h.push(c.length),f(w,y,an(y*3.77+.3),c,2)}h.push(c.length);const v=a.length+r.length+l.length+c.length,g=i>65535?new Uint32Array(v):new Uint16Array(v);let x=0;for(const _ of[a,r,l,c])g.set(_,x),x+=_.length;const p=v-c.length;this.threadIdx=h.map(_=>p+_);const m=new Fe;m.setAttribute("position",new he(e.pos.slice(0,i*3),3)),m.setAttribute("aAxis",new he(e.axis.slice(0,i*3),3)),m.setAttribute("aFace",new he(e.face.slice(0,i*3),3)),m.setAttribute("aFall",new he(e.fall.slice(0,i*4),4)),m.setAttribute("aMeta",new he(e.meta.slice(0,i*4),4)),m.setAttribute("aMore",new he(e.more.slice(0,i*3),3)),m.setAttribute("aLift",new he(e.lift.slice(0,i*4),4)),m.setIndex(new he(g,1)),this.verts=i,this.tris=v/3;const M=this.app;this.uniforms={...M.shared.uniforms,uHeight:{value:M.terrain.heightTex},uState:{value:null},uPx:{value:.001},uLodRange:{value:M.terrain.range0},uWaterTime:{value:0},uDebug:{value:0},uPuff:{value:null},uBow:{value:.05},uNightK:{value:.35}},this.material=new Ce({vertexShader:f2,fragmentShader:d2,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:ln,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-10}),this.mesh=new ue(m,this.material),this.mesh.frustumCulled=!1,this.mesh.renderOrder=3}buildState(){const t=this.n,e=this.app.weather;this.state=new Float32Array(Ra*4),this.stateTex=new yi(this.state,Ra,1,Ke,In),this.stateTex.minFilter=Se,this.stateTex.magFilter=Se,this.stateTex.generateMipmaps=!1,this.stateTex.needsUpdate=!0,this.uniforms.uState.value=this.stateTex,this.kind=new Uint8Array(t),this.per=new Float32Array(t),this.thr=new Float32Array(t),this.cell=new Int32Array(t),this.c1=new Int32Array(t),this.cU1=new Int32Array(t),this.cU2=new Int32Array(t),this.w0=new Float32Array(t),this.lenY=new Float32Array(t),this.flow=new Float32Array(t),this.front=new Float32Array(t),this.wet=new Float32Array(t),this.spate=new Float32Array(t),this.primed=new Float32Array(t),this.turb=new Float32Array(t),this.px=new Float32Array(t),this.pz=new Float32Array(t),this.mid=new Float32Array(t*3);const n=e.G,i=(a,r)=>xe(Math.floor((r-e.origin)/e.cell),0,n-1)*n+xe(Math.floor((a-e.origin)/e.cell),0,n-1),o=[0,0];for(let a=0;a<t;a++){const r=a<this.nCurtain?this.list[a]:this.threads[a-this.nCurtain];if(this.kind[a]=r.kind,this.per[a]=r.per??0,this.thr[a]=r.thr??0,this.cell[a]=i(r.lip[0],r.lip[2]),r.kind!==2){const l=this.plan.lines[r.laid];Bn(l,r.sLip-1,o),this.cU1[a]=i(o[0],o[1]),Bn(l,r.sLip-2.5,o),this.cU2[a]=i(o[0],o[1])}this.lenY[a]=r.drop*qt,this.px[a]=r.lip[0],this.pz[a]=r.lip[2],this.mid[a*3]=(r.lip[0]+r.base[0])/2,this.mid[a*3+1]=(r.lip[1]+r.base[1])/2*qt,this.mid[a*3+2]=(r.lip[2]+r.base[2])/2,r.kind===2&&(this.cell[a]=i(r.catch[0],r.catch[1]),this.c1[a]=i(r.catch[2],r.catch[3]),this.w0[a]=.6)}}buildMist(){const t=[],e=this.app.weather.wind,n=[0,0,0,0];this.mistAnchors=[];for(const{id:c,f:h,sp:u,ox:f,oz:d}of this.mistSrc){const v=h.drop,g=h.per??0;if(h.kind>1||v<100||g<.2&&h.kind!==0)continue;const x=u.W0*100,p=xe((15+.25*v)*(.4+.6*Math.max(g,h.kind===0?.4:0))*Math.sqrt(x/10),10,90),m=h.kind===0?Math.round(xe(6+v/25,6,40)*Math.sqrt(x/8)):Math.min(4,Math.round(xe(6+v/25,6,40)*Math.sqrt(x/8))),[M,_,E]=h.poolAt,y=[];for(let w=0;w<m;w++){const A=an(c*91.3+w*7.7),b=an(c*13.1+w*3.3+.5),S=(.35+.25*an(c*5.3+w*1.9))*p*.01,R=A*Math.PI*2,k=Math.sqrt(b)*.3*p*.01;y.push([0,M+Math.cos(R)*k,_*qt+S*.5,E+Math.sin(R)*k,S,f,d])}if(h.kind===0){const w=Math.round(xe(v/40,2,10));for(let A=0;A<w;A++){const b=v*(.3+.65*Math.sqrt(an(c*3.1+A*11.7)));let S=2;for(;S<u.st.length-1&&u.st[S].d<b;)S++;const R=u.st[S],k=-R.fz,I=R.fx,T=k*e.x+I*e.y>=0?1:-1,C=(1.2+1.3*an(c*7.9+A*2.3))*R.hw;y.push([1,R.x+R.fx*.5*R.hw+k*T*R.hw*.5,R.y,R.z+R.fz*.5*R.hw+I*T*R.hw*.5,C,R.fx,R.fz])}}for(const w of(h.ledges||[]).slice(0,3))u.at(u.sigmaT(u.yL-w*qt),n),y.push([2,n[0],this.fine(n[0],n[1])*qt+p*.0025,n[1],p*.005,n[2],n[3]]);y.forEach((w,A)=>t.push({m:w,id:c,key:(A+.5)/y.length+.01*an(c*17.3+A)})),this.mistAnchors.push(M,_*qt,E)}t.sort((c,h)=>c.key-h.key);const i=Math.min(wa,t.length),o=new Float32Array(wa*3),a=new Float32Array(wa*4),r=new Float32Array(wa*3);for(let c=0;c<i;c++){const{m:h,id:u}=t[c];o.set([h[1],h[2],h[3]],c*3),a.set([h[0],an(c*1.618+u*.31),h[4],u],c*4),r.set([h[5],0,h[6]],c*3)}const l=new Ku;l.setAttribute("position",new pe([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("iOrigin",new si(o,3)),l.setAttribute("iKind",new si(a,4)),l.setAttribute("iFace",new si(r,3)),l.instanceCount=i,this.nMist=i,this.mistAnchors=new Float32Array(this.mistAnchors),this.uniforms.uPuff.value=g2(),this.mistMaterial=new Ce({vertexShader:p2,fragmentShader:m2,uniforms:this.uniforms,transparent:!0,depthWrite:!1,side:ln}),this.mist=new ue(l,this.mistMaterial),this.mist.frustumCulled=!1,this.mist.renderOrder=4}clearVegetation(){const t=this.app.vegetation;if(!t||!t.cleared)return;const e=le,n=t.cleared,i=(l,c,h,u)=>{const f=Math.max(0,Math.floor((l-h+ht)/re)),d=Math.min(e-1,Math.floor((l+h+ht)/re)),v=Math.max(0,Math.floor((c-h+ht)/re)),g=Math.min(e-1,Math.floor((c+h+ht)/re));for(let x=v;x<=g;x++)for(let p=f;p<=d;p++){const m=-ht+(p+.5)*re,M=-ht+(x+.5)*re;(u?u(m,M):Math.hypot(m-l,M-c)<=h)&&(n[x*e+p]=1)}};for(let l=0;l<this.stations.length;l+=2)i(this.stations[l],this.stations[l+1],.2);for(const[l,c,h]of this.pools)i(l,c,h+.1);const o=[0,0];for(const l of this.list){if(l.kind!==0)continue;const c=this.plan.lines[l.laid];for(let v=l.sPool;v<l.sPool+1.6;v+=.1)Bn(c,v,o),i(o[0],o[1],.32-.12*((v-l.sPool)/1.6));const[h,u]=l.face,f=.75*l.carve.wFace,d=l.carve.faceRun+.6;i(l.lip[0]+h*d*.5,l.lip[2]+u*d*.5,d+f,(v,g)=>{const x=v-l.lip[0],p=g-l.lip[2],m=x*h+p*u,M=-x*u+p*h;return m>=-.1&&m<=d&&Math.abs(M)<f})}const a=this.app.terrain,r=new q;for(const l of this.list){if(l.kind!==0)continue;const[c,,h]=l.lip,[u,,f]=l.pool;i((c+u)/2,(h+f)/2,1.8,(d,v)=>Fs(d,v,c,h,u,f)<1.5&&a.normalAt(d,v,r).y<.45)}}clearSight(t,e){const n=this.app.vegetation;if(!n||!n.cleared)return;const i=this.app.terrain,o=n.cleared,a=le;let r=!1;for(const l of e){const c=Math.hypot(l.x-t.x,l.z-t.z),h=Math.ceil(c/(re*.4));for(let u=1;u<h;u++){const f=u/h,d=t.x+(l.x-t.x)*f,v=t.z+(l.z-t.z)*f;if(!(t.y+(l.y-t.y)*f-Math.max(0,i.heightAt(d,v))>.6))for(const[x,p]of[[0,0],[re*.5,0],[-re*.5,0],[0,re*.5],[0,-re*.5]]){const m=Math.floor((d+x+ht)/re),M=Math.floor((v+p+ht)/re);m<0||M<0||m>=a||M>=a||o[M*a+m]||(o[M*a+m]=1,r=!0)}}}r&&n.tiles&&(n.tiles.clear(),n.lastSelection="")}raw(t){const e=this.app.weather.rain;return Math.min(1.5,(e[this.cell[t]]*this.w0[t]+e[this.c1[t]]*(1-this.w0[t]))/1.2)}targetOf(t,e){if(this.kind[t]===2){const i=Math.max(this.spate[t],this.primed[t]);return yn(this.thr[t],this.thr[t]+.3,i)}const n=this.wetOf(t)*1.4+e*.5;return Math.min(1,this.kind[t]===0?this.per[t]*.5+n*1.5:this.per[t]+n)}wetOf(t){const e=this.app.weather.wet;return(e[this.cell[t]]+e[this.cU1[t]]+e[this.cU2[t]])/3}turbOf(t){if(this.kind[t]===2)return 0;const e=this.app.weather,n=e.rain;return yn(.3,.8,Math.max(n[this.cell[t]],n[this.cU1[t]],n[this.cU2[t]]))*(e.regime==="kona"?1:.25)}prime(t,e,n){const i=this.app.weather;for(let o=this.nCurtain;o<this.n;o++){const a=this.px[o]-t.x,r=this.pz[o]-t.z;if(a*a+r*r>=e*e)continue;const l=n*yn(.1,.45,Math.max(this.raw(o),i.wet[this.cell[o]]));this.primed[o]<l&&(this.primed[o]=l)}}primeStop(){var n;const t=this.app.ui;if(!t||!t.stops)return;this.lastStop=t.index;const e=t.views[(n=t.stops[t.index])==null?void 0:n.id];e&&e.spate&&this.prime(e.target,40,e.spate)}settle(){const t=this.app.streams?this.app.streams.uniforms.uFlowAll.value:0;for(let n=this.nCurtain;n<this.n;n++)this.spate[n]=this.raw(n);const e=this.app.ui;e&&e.index!==this.lastStop&&this.primeStop();for(let n=0;n<this.n;n++){const i=this.targetOf(n,t);this.flow[n]=i,this.front[n]=i>.05?1.15:0,this.wet[n]=i,this.turb[n]=this.turbOf(n),this.state[n*4]=i,this.state[n*4+1]=this.front[n],this.state[n*4+2]=i,this.state[n*4+3]=this.turb[n]}this.stateTex.needsUpdate=!0}update(t){const e=this.app,n=t*e.clock.speed,i=1-Math.exp(-n/1800),o=1-Math.exp(-n/10800),a=1-Math.exp(-t/2),r=Math.exp(-n/21600),l=e.streams.uniforms.uFlowAll.value,c=e.ui;c&&c.index!==this.lastStop&&this.primeStop();const h=this.state;let u=!1;for(let m=0;m<this.n;m++){if(this.kind[m]===2){const y=this.raw(m);this.spate[m]+=(y-this.spate[m])*(y>this.spate[m]?i:o),this.primed[m]-=this.primed[m]*o}const M=this.targetOf(m,l);this.flow[m]+=(M-this.flow[m])*a,M>.05?this.front[m]=Math.min(1.15,this.front[m]+t/(2+4*this.lenY[m])):this.flow[m]<.03&&(this.front[m]=0),this.wet[m]=Math.max(this.flow[m],this.wet[m]*r);const _=this.turbOf(m);this.turb[m]+=(_-this.turb[m])*(_>this.turb[m]?i:o);const E=m*4;(Math.abs(h[E]-this.flow[m])>1e-4||Math.abs(h[E+1]-this.front[m])>1e-4||Math.abs(h[E+2]-this.wet[m])>1e-4||Math.abs(h[E+3]-this.turb[m])>.001)&&(h[E]=this.flow[m],h[E+1]=this.front[m],h[E+2]=this.wet[m],h[E+3]=this.turb[m],u=!0)}u&&(this.stateTex.needsUpdate=!0);for(let m=0;m<this.wallWet.length;m++)this.wallWet[m].w=this.wet[this.heroes[m].index];const f=this.uniforms,d=e.camera;f.uLodRange.value=e.terrain.range0,f.uPx.value=2*Math.tan(d.fov/2*(Math.PI/180))/Math.max(1,e.renderer.domElement.height),f.uWaterTime.value=this.debugTime??e.time;const v=d.position,g=v.y-Math.max(0,e.terrain.heightAt(v.x,v.z));this.group.visible=this.enabled&&g<90;let x=1/0;const p=this.mistAnchors;for(let m=0;m<p.length;m+=3){const M=p[m]-v.x,_=p[m+1]-v.y,E=p[m+2]-v.z,y=M*M+_*_+E*E;y<x&&(x=y)}this.mist.visible=this.group.visible&&x<3600,this.holdOrbit()}holdOrbit(){var u;const t=this.app.ui,e=this.app.rig;if(!t||!t.stops||!e||e.flight||!e.autoOrbit)return;const n=t.views[(u=t.stops[t.index])==null?void 0:u.id];if(!n||!n.orbit)return;const o=typeof innerWidth=="number"&&innerWidth<innerHeight&&n.orbitPortrait||n.orbit,a=o[0]-n.yaw,r=o[1]-n.yaw,l=i2(e.goal.yaw-n.yaw);let c=e.autoOrbit>0?1:-1;c>0&&l>=r?c=-1:c<0&&l<=a&&(c=1);const h=l<a-.05||l>r+.05?1:Math.max(0,Math.min(r-l,l-a));e.autoOrbit=c*(n.distance<60?.012:.02)*(.15+.85*yn(0,.12,h))}setQuality(t){const e=xe(t|0,0,3),n=Math.min(h2[e],this.threads.length);this.mesh.geometry.setDrawRange(0,this.threadIdx[n]),this.mist.geometry.instanceCount=Math.round(this.nMist*u2[e])}setDebug(t){this.uniforms.uDebug.value=t|0}frame(t,e,n=0,i=.15,o=0){const a=t<this.nCurtain?this.list[t]:this.threads[t-this.nCurtain],r=a.poolAt||a.base,l=a.face?a.face[0]:a.base[0]-a.lip[0],c=a.face?a.face[1]:a.base[2]-a.lip[2],h=Math.atan2(l,c)+n,u=this.app.rig;for(const f of[u.goal,u.state])f.target.set(r[0],Math.max(0,this.app.terrain.heightAt(r[0],r[2])),r[2]),f.distance=e,f.yaw=h,f.pitch=i,f.lift=o;u.flight=null,u.autoOrbit=0}get stats(){const t=this.app;let e=0,n=0;t.camera&&(t.camera.updateMatrixWorld(),this.projView.multiplyMatrices(t.camera.projectionMatrix,t.camera.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView));for(let o=this.nCurtain;o<this.n;o++)this.flow[o]<=.5||(e++,this.tmp.set(this.mid[o*3],this.mid[o*3+1],this.mid[o*3+2]),this.frustum.containsPoint(this.tmp)&&this.tmp.distanceTo(t.camera.position)<70&&n++);const i=this.list.filter(o=>o.kind===0);return{heroes:i.length,model:i.some(o=>o.model),akuaLine:this.hero?this.hero.src:-1,akuaHero:this.heroes.indexOf(this.hero),akuaView:this.heroView,stream:this.nCurtain-i.length,threads:this.threads.length,threadsOn:e,inView:n,mist:this.nMist,verts:this.verts,tris:this.tris,stuck:this.stuck,carvedTexels:this.plan.carved.reduce((o,a)=>o+a.texels,0),trench:this.plan.trench,planMs:Math.round(this.plan.ms.total),buildMs:Math.round(this.buildMs||0),cutTris:t.streams?t.streams.cutTris:-1}}}function Eo(s,t,{filter:e="mip",format:n=Ke}={}){const i=new yi(s,t,t,n,xn);return e==="nearest"?(i.minFilter=Se,i.magFilter=Se):e==="linear"?(i.minFilter=ve,i.magFilter=ve):(i.minFilter=Wi,i.magFilter=ve,i.generateMipmaps=!0),i.wrapS=i.wrapT=cn,i.needsUpdate=!0,i}function v2(s){const t=le,e=new Uint8Array(t*t*4),n=Math.log(300),i=Math.log(12e3),o=new Float32Array(t*t);for(let r=0;r<t*t;r++)o[r]=Math.max(0,Math.min(1,Math.log10(Math.max(1e-6,s.area[r])/.04)/1.6));const a=h0(o,t,2,2);for(let r=0;r<t*t;r++)e[r*4]=Math.round(255*Math.max(0,Math.min(1,(Math.log(s.rain[r])-n)/(i-n)))),e[r*4+1]=Math.round(255*Math.max(0,Math.min(1,s.sand[r]))),e[r*4+2]=Math.round(255*Math.min(1,a[r]*1.6)),e[r*4+3]=s.region[r*4+3];return Eo(e,t)}function M2(s){const t=le,e=new Uint8Array(t*t*4),n=Vt/t*100,i=bl(t,o=>s.height1024[o]>0);for(let o=0;o<t*t;o++)e[o*4+3]=Math.round(255*Math.min(1,i[o]*n/300));return{tex:Eo(e,t),data:e}}const Ao=["#8d9cc9","#3d8a4c","#a3d05b","#e3b65e","#f3e2b0","#53d6c8","#2a5aa8"],_2=["#000000","#f0a35e","#6fb6e8","#f2d06b","#9ed27a"];function w2(s){const t=le,e=Ao.map(r=>new It(r)),n=[new Float32Array(t*t),new Float32Array(t*t),new Float32Array(t*t)];for(let r=0;r<t*t;r++){const l=e[s[r*4+2]]||e[6];n[0][r]=l.r,n[1][r]=l.g,n[2][r]=l.b}const i=n.map(r=>h0(r,t,2,2)),o=new Uint8Array(t*t*4);for(let r=0;r<t*t;r++)o[r*4]=Math.round(255*Math.pow(i[0][r],1/2.2)),o[r*4+1]=Math.round(255*Math.pow(i[1][r],1/2.2)),o[r*4+2]=Math.round(255*Math.pow(i[2][r],1/2.2)),o[r*4+3]=255;const a=Eo(o,t);return a.colorSpace=Ge,a}class y2{constructor(t,e){this.canvas=t,this.island=e,this.params=new URLSearchParams(location.search);const n=new qu({canvas:t,antialias:!1,powerPreference:"high-performance"});n.setClearColor(0,1),this.renderer=n,this.pipeline=new Dx(n),this.scene=new Bs,this.camera=new rn(42,1,.1,9e3),this.light={sunDir:new q(0,1,0),sunColor:new It,skyColor:new It,groundColor:new It,moonDir:new q(0,-1,0),moonColor:new It,zenith:new It,horizon:new It,sunHorizon:new It,night:0};const i=new yi(new Uint8Array([0,0,0,0]),1,1);i.needsUpdate=!0;const o=e.data;this.landTex=v2(o),this.regionTex=Eo(o.region,le,{filter:"nearest"}),this.linesTex=Eo(o.lines,bn,{filter:"linear"}),this.zoneTex=w2(o.region),this.overlay=new _e(0,0,0,0),this.shared={uniforms:{uSunDir:{value:this.light.sunDir},uSunColor:{value:this.light.sunColor},uSkyColor:{value:this.light.skyColor},uGroundColor:{value:this.light.groundColor},uMoonDir:{value:this.light.moonDir},uMoonColor:{value:this.light.moonColor},uTime:{value:0},uShadow:{value:null},uWeather:{value:i},uWeatherRect:{value:new _e(-Vt,-Vt,Vt*2,Vt*2)},uCloudShadowK:{value:0},uCloudMidY:{value:15},uCloudWind:{value:new Ot},uCloudWindDir:{value:new Ot(1,0)},uFarCover:{value:.32},uWetness:{value:0},uLand:{value:this.landTex},uSkyMap:{value:null},uRegion:{value:this.regionTex},uLines:{value:this.linesTex},uZoneTex:{value:this.zoneTex},uOverlay:{value:this.overlay},uHover:{value:0},uFocus:{value:0},uFocusK:{value:0},uMokuColors:{value:_2.map(d=>new It(d))},uWindVec:{value:new Ot(1,0)}}};const a=this.params.get("falls");this.wailele=a==="0"?null:o2(e,{carve:a!=="flat"}),this.terrain=new yx(o,this.shared),this.scene.add(this.terrain.group),this.shadow=new Kx(this.terrain.heightTex),this.shared.uniforms.uShadow.value=this.shadow.texture;const r=M2(o);this.seaTex=r.tex,this.seaData=r.data,this.ocean=new Tx(this.shared,this.terrain.heightTex,r.tex),this.scene.add(this.ocean.mesh),this.sky=new Xx,this.scene.add(this.sky.group),this.shared.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.pipeline.uniforms.uSkyMap.value=this.sky.mapRT.texture,this.weather=new rv(o.height1024,le);const[l,c]=e.meta.cloudSizes;this.clouds=new av({shape:o.cloudShape,shapeSize:l,detail:o.cloudDetail,detailSize:c}),this.clouds.uniforms.uWeather.value=this.weather.texture,this.clouds.uniforms.uWeatherRect.value=this.weather.rect,this.clouds.uniforms.uShadow.value=this.shadow.texture,this.clouds.uniforms.uHeight.value=this.terrain.heightTex,this.shared.uniforms.uWeather.value=this.weather.texture,this.shared.uniforms.uWeatherRect.value=this.weather.rect,this.pipeline.atmosphere=this.clouds,this.features=new tM(this),this.scene.add(this.features.group),this.vegetation=new kM(this),this.scene.add(this.vegetation.group),this.life=new e2(this),this.scene.add(this.life.group),this.streams=new Bv(this),this.scene.add(this.streams.mesh),this.wailele&&(this.waterfalls=new x2(this,this.wailele),this.scene.add(this.waterfalls.group)),this.flash={t:-10,next:0,pos:new q,k:0},this.rig=new Yx(this.camera,t,this.terrain),this.clock={doy:Number(this.params.get("doy")??277),hour:Number(this.params.get("hour")??9.2),speed:Number(this.params.get("speed")??60)},this.season=this.clock.doy>120&&this.clock.doy<300?"kau":"hooilo",this.params.get("weather")&&this.weather.setMode(this.params.get("weather")),this.sky.update(this.clock.doy,this.clock.hour,0,this.light),this.weather.warm(6,this.light.sunDir.y,this.clock.hour,this.season),this.time=0,this.frames=0,this.updaters=[];const h=n.getContext(),u=h.getExtension("WEBGL_debug_renderer_info"),f=u?String(h.getParameter(u.UNMASKED_RENDERER_WEBGL)):"";this.software=/swiftshader|llvmpipe|software/i.test(f),this.quality={level:2,cap:3,avg:16,since:0,raisedAt:-1e9,fixed:this.software||this.params.has("fixedq")},this.params.get("q")&&(this.quality.level=Number(this.params.get("q"))),this.applyQuality(),this.resize(),addEventListener("resize",()=>this.resize()),this.last=performance.now(),this.frame=this.frame.bind(this),requestAnimationFrame(this.frame)}applyQuality(){var e;const t=[{clouds:.25,steps:26,light:2,range:12,dpr:1,far:2e3,march:200},{clouds:.33,steps:34,light:2,range:16,dpr:1.25,far:2400,march:220},{clouds:.42,steps:44,light:3,range:19,dpr:1.5,far:3e3,march:260},{clouds:.5,steps:56,light:4,range:22,dpr:2,far:3e3,march:260}][Math.max(0,Math.min(3,this.quality.level))];this.qset=t,this.clouds.setScale(t.clouds),this.clouds.uniforms.uSteps.value=t.steps,this.clouds.uniforms.uLightSteps.value=t.light,this.clouds.uniforms.uFar.value=t.far,this.clouds.uniforms.uMarch.value=t.march,this.terrain.setRange(t.range),(e=this.waterfalls)==null||e.setQuality(this.quality.level),this.sized&&this.resize()}govern(t){const e=this.quality;e.fixed||this.time<3||(e.avg+=(t*1e3-e.avg)*.05,e.since+=t,e.avg>34&&e.since>2&&e.level>0?(this.time-e.raisedAt<20&&(e.cap=e.level-1),e.level--,e.since=0,this.applyQuality()):e.avg<15&&e.since>8&&e.level<e.cap&&(e.level++,e.since=0,e.raisedAt=this.time,this.applyQuality()))}lightning(){const t=this.weather,e=this.flash,n=t.stormiest;n&&(t.regime==="kona"?n.strength>.35:n.strength>.9)&&this.time>e.next&&this.clock.speed>0&&(e.t=this.time,e.pos.set(n.x+(Math.random()-.5)*8,t.base+(t.top-t.base)*(.3+Math.random()*.4),n.z+(Math.random()-.5)*8),e.next=this.time+1.5+Math.random()*(t.regime==="kona"?5:14));const o=this.time-e.t;e.k=o<.6?Math.exp(-o*9)*(.7+.3*Math.sin(o*70))+(o>.12&&o<.22?.6:0):0,this.clouds.uniforms.uFlash.value=e.k,this.clouds.uniforms.uFlashPos.value.copy(e.pos),e.k>0&&this.light.skyColor.offsetHSL(0,0,0).add(new It(.25,.27,.35).multiplyScalar(e.k))}resize(){this.sized=!0;const t=innerWidth,e=innerHeight,n=Math.min(devicePixelRatio||1,this.software?1:this.qset?this.qset.dpr:2);this.renderer.setPixelRatio(n),this.renderer.setSize(t,e,!1),this.pipeline.setSize(t,e,n),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.sky.starUniforms.uPixel.value=n}frame(t){const e=Math.max(0,Math.min(.1,(t-this.last)/1e3));this.last=t,this.time+=e,this.camDt=this.camDt===void 0?e:this.camDt+(e-this.camDt)*.3,this.govern(e),this.update(e),this.sky.renderMap(this.renderer),this.shadow.update(this.renderer,this.light.sunDir),this.pipeline.render(this.scene,this.camera),this.frames++,requestAnimationFrame(this.frame)}update(t){var l;const e=this.clock;e.hour+=t*e.speed/3600,e.hour>=24&&(e.hour-=24,e.doy=(e.doy+1)%365),this.sky.update(e.doy,e.hour,this.time,this.light),this.shared.uniforms.uTime.value=this.time,this.rig.update(this.camDt??t),this.terrain.update(this.camera),this.ocean.update(this.camera,t),this.vegetation.update(this.camera),this.weather.step(t*e.speed,this.light.sunDir.y,e.hour,this.season),this.life.update(t,this.time),this.streams.update(),(l=this.waterfalls)==null||l.update(t),this.lightning();for(const c of this.updaters)c(t,this.time);const n=this.light,i=this.weather,o=this.clouds.uniforms;o.uSunDir.value.copy(n.sunDir),o.uSunColor.value.copy(n.sunColor),o.uSkyColor.value.copy(n.skyColor),o.uGroundColor.value.copy(n.groundColor),o.uFogColor.value.copy(n.horizon),o.uMoonDir.value.copy(n.moonDir),o.uMoonColor.value.copy(n.moonColor),o.uWind.value.copy(i.windOffset),o.uWindDir.value.copy(i.wind),o.uTime.value=this.time,o.uBase.value=i.base,o.uTop.value=i.top;const a=Math.max(0,Math.min(1,(i.state.humidity-1.1)/.3));if(o.uOvercast.value=a,o.uFarCover.value=.32+a*.4,a>0){const c=1-a*.65;n.sunColor.multiplyScalar(c);const h=(n.skyColor.r+n.skyColor.g+n.skyColor.b)/3;n.skyColor.lerp(new It(h,h,h*1.04),a*.5).multiplyScalar(1-a*.25)}this.shared.uniforms.uCloudShadowK.value=2.6,this.shared.uniforms.uCloudMidY.value=(i.base+i.top)*.5,this.shared.uniforms.uCloudWind.value.copy(i.windOffset),this.shared.uniforms.uCloudWindDir.value.copy(i.wind),this.shared.uniforms.uFarCover.value=o.uFarCover.value,this.ocean.uniforms.uWind.value.set(i.wind.x/9,i.wind.y/9),this.shared.uniforms.uWindVec.value.set(i.wind.x/9,i.wind.y/9);const r=this.pipeline.uniforms;r.uSunDir.value.copy(n.sunDir),r.uSunColor.value.copy(n.sunHorizon),r.uFogColor.value.copy(n.horizon),r.uExposure.value=.55*(1+2.2*Math.pow(n.night,1.5)),r.uNight.value=n.night,this.sky.group.position.copy(this.camera.position)}}const b2=[{id:"island",icon:"island",title:"Ka Mokupuni",gloss:"the island",text:["A high island raised by two volcanoes and carved by rain. Land is divided in nested parts: the mokupuni (island) into moku (districts), each moku into ahupuaʻa, each ahupuaʻa into ʻili traditionally worked by extended families.","This island is a composite, not a map of any one place — but its boundaries follow the ridgelines of its own watersheds, the way real ones do."]},{id:"rain",icon:"rain",title:"Ka Ua",gloss:"the rain",text:["Most days the moaʻe — the trade wind — pushes moist ocean air against the windward mountains. Forced upward, it cools past about 650 m and condenses into the cloud bank on the summit. Showers fall on the windward side; the air sinking down the far side warms and dries.","So one side of an island is lush and the other dry. Hawaiians have names for hundreds of winds and rains, each belonging to a place. Wai, fresh water, is life — and waiwai, wealth, is water doubled."]},{id:"ahupuaa",icon:"ahupuaa",title:"Ahupuaʻa",gloss:"from the mountain to the sea",zone:null,text:["An ahupuaʻa runs from the uplands to the sea, usually bounded by ridges, so its people have forest, fresh water, farmland, shore and reef within one boundary.","A konohiki managed it for the aliʻi, allotting land and water, and could place a kapu that rested a fishery or forest until it recovered.","The name comes from the ahu, a stone altar at the boundary, where a carved puaʻa (pig) image stood during the Makahiki."]},{id:"akua",icon:"akua",title:"Wao Akua",gloss:"realm of the gods",zone:0,text:["The cloud-wrapped heights are left largely to the gods. People once came only for special purposes — feathers, choice woods, stone for adzes — and with care.","Yet this is the source: mist and rain combed from the clouds by low, mossy ʻōhiʻa and ʻōlapa forest feed every spring and stream below. Keep the uplands whole, and water keeps flowing to everyone downstream."]},{id:"nahele",icon:"nahele",title:"Wao Nahele",gloss:"the forest",zone:1,text:["Below the clouds grows ʻōhiʻa lehua forest, with hāpuʻu tree ferns beneath and koa where the ground drains well. Down the valley, kukui and ʻōhiʻa ʻai (mountain apple) mark planted land. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, felled it with stone koʻi (adzes), and shaped the hull before it was hauled down to the shore.","Kia manu, bird catchers, gathered feathers for the cloaks and helmets of the aliʻi. From the ʻōʻō they took only a few yellow feathers and let the bird go."]},{id:"loi",icon:"loi",title:"Loʻi Kalo",gloss:"irrigated taro terraces",zone:2,text:["Kalo (taro) is the staff of life, cooked and pounded into poi. Terraces step down the valley floor, fed by an ʻauwai — a ditch that takes part of the stream at a dam and returns it below. The water has to keep moving: cool, flowing water keeps the kalo healthy. Kī and maiʻa grow on the banks.","In tradition the first kalo grew from Hāloa, elder brother of the Hawaiian people, so caring for kalo is caring for family."]},{id:"kauhale",icon:"kauhale",title:"Kauhale",gloss:"the family compound",zone:4,text:["A home here is a cluster of hale, each with its purpose: the hale noa, where the family sleeps; the mua, an eating house for men with the family shrine; a separate eating house for women; a house for beating kapa; a canoe house.","Under the ʻai kapu, men and women ate apart. Houses are framed in hardwood, lashed with cordage and thatched with pili grass (in wetter places, lau hala or kī leaves), on a raised stone paepae."]},{id:"heiau",icon:"heiau",title:"Heiau",gloss:"temple",zone:4,text:["Heiau range from simple shrines to massive stone platforms. A luakini, a temple of state dedicated to Kū, could be built only by a ruling chief. Others are dedicated to Lono for rain and harvests, or to healing and fishing.","On the platform stand the ʻanuʻu, a tall frame wrapped in white kapa where the high priest received the gods’ words; carved kiʻi images; and the lele, an altar for offerings."]},{id:"kahakai",icon:"kahakai",title:"Kahakai",gloss:"the shore",zone:4,text:["Most people live near the shore, where the stream meets the sea. Canoes, each hull carved from a single log and steadied by an ama float, are kept out of the sun in a hālau waʻa.","On flat rocks and clay pans, seawater evaporates into paʻakai — salt — for preserving fish."]},{id:"loko",icon:"loko",title:"Loko Iʻa",gloss:"fishpond",zone:5,text:["The most advanced traditional fishponds in the Pacific are Hawaiian. A curved wall of stacked stone, the kuapā, encloses part of the reef flat near a stream mouth, where fresh water mixes with salt.","In the wall are mākāhā — sluice gates of wooden grates. Young fish slip in with the tide, fatten on algae, and grow too big to slip back out. ʻAmaʻama (mullet) and awa (milkfish) are raised here."]},{id:"koa",icon:"koa",title:"Koʻa",gloss:"fishing shrine",zone:5,text:["Fishermen build koʻa, stone shrines on the shore, and offer the first fish of a catch to the fishing gods. Offshore fishing grounds are also called koʻa, found by lining up landmarks on land.","Kapu protected fish in their seasons: aku and ʻōpelu were taken in turns, each closed while the other was open, so neither was fished out."]},{id:"surf",icon:"surf",title:"Heʻe Nalu",gloss:"wave sliding",zone:5,text:["Surfing has always belonged to everyone. Chiefs rode long olo boards of light wiliwili wood; commoners rode shorter alaia of koa. When the surf came up, whole villages went to the water.","Each break has its name. The best were sometimes kapu to all but the aliʻi."]},{id:"kula",icon:"kula",title:"Kula",gloss:"the dry plains",zone:3,text:["Where rain is too scarce for loʻi, families farm the open kula: ʻuala (sweet potato) in mounds, dryland kalo, ipu (gourds) and kō (sugarcane).","Long low walls run across the slopes to break the wind and hold soil and moisture. The great leeward field systems cover tens of square kilometres. Between the fields, fire keeps the pili grass open; ʻaʻaliʻi and lama hold the rocky gulches, with a few wiliwili."]},{id:"ahu",icon:"ahu",title:"Ahu · Makahiki",gloss:"the boundary altar · the season of Lono",zone:4,text:["Where the trail around the island crosses into each ahupuaʻa stands an ahu, a stone altar. When Makaliʻi — the Pleiades — rises at dusk in late autumn, the Makahiki begins: four months honoring Lono, god of rain and growth.","Under chiefly rule, Lono’s image, the akua loa — a tall staff hung with kapa — was carried around the island. At each ahu the people left offerings: kapa, food, feathers, pigs. Then came games, rest and feasting, and war was forbidden."]},{id:"puuhonua",icon:"puuhonua",title:"Puʻuhonua",gloss:"place of refuge",zone:4,text:["Breaking a kapu could mean death — unless you reached a puʻuhonua first. Inside its great walls a kahuna performed rites of absolution, and you could go home forgiven.","In wartime, defeated warriors and those who could not fight also found safety there."]},{id:"holua",icon:"holua",title:"Hōlua",gloss:"sledding course",zone:3,text:["During the Makahiki, chiefs raced down stone-built slides on papa hōlua — long, narrow sleds on hardwood runners — at tremendous speed.","The track is paved with stones and laid with slick grass or leaves; the longest runs for more than a kilometre."]},{id:"malama",icon:"malama",title:"Mālama ʻĀina",gloss:"care for the land",text:["An ahupuaʻa works when each part cares for the next: protected forests make water, water feeds loʻi and fishponds, and people tend it all.","Across Hawaiʻi today, communities are restoring loʻi, fishponds and forests on the same principles."]}],ya={moae:{name:"Moaʻe",gloss:"trade winds"},kona:{name:"Kona",gloss:"southerly storm"},malie:{name:"Mālie",gloss:"calm"},auto:{name:"Auto",gloss:"let the weather change"}},il={kau:{name:"Kau",gloss:"the dry season"},hooilo:{name:"Hoʻoilo",gloss:"the wet season"}},S2={island:'<path d="M3 16c2-1 3.5-6 6-6s3 3 4.5 3 2.5-4 4.5-4 2.5 5 3 7"/><path d="M2 19.5c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1 2-1 4-1"/>',rain:'<path d="M7 14.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M8.5 17.5l-1 2.5M12.5 17.5l-1 2.5M16.5 17.5l-1 2.5"/>',ahupuaa:'<path d="M12 3.5 4.5 19.5h15z"/><path d="M12 7c-1.2 2.6 1 4.4 0 7s1.2 3 .3 5.5"/><path d="M3 21c2 0 2-.8 4.5-.8S9.5 21 12 21s2-.8 4.5-.8 2 .8 4.5.8"/>',akua:'<path d="M3 19.5l6-9 3 4 2-3 7 8z"/><path d="M8.2 7.5a2.6 2.6 0 0 1 5-1.3A2.2 2.2 0 1 1 15.5 9.6H8.8a1.1 1.1 0 0 1-.6-2.1z"/>',nahele:'<path d="M12 21v-6"/><path d="M12 15c-4.2 0-6.3-2.1-6.3-5a4 4 0 0 1 3-3.9 3.3 3.3 0 0 1 6.6 0 4 4 0 0 1 3 3.9c0 2.9-2.1 5-6.3 5z"/>',loi:'<path d="M12 21v-4.5"/><path d="M12 16.5c-5 0-8-3-8-7 0-2.2 1.2-4 3.2-4 2 0 3 1.8 4.8 1.8s2.8-1.8 4.8-1.8c2 0 3.2 1.8 3.2 4 0 4-3 7-8 7z"/><path d="M12 7.3v9"/>',kauhale:'<path d="M2.5 20.5h19"/><path d="M5 20.5 12 5l7 15.5"/><path d="M10.4 20.5v-4h3.2v4"/>',heiau:'<path d="M2.5 20.5h19v-3h-16v-3h13v3"/><path d="M8 14.5V5.5h2.2v9"/><path d="M13.5 14.5v-3M16 14.5v-3"/>',kahakai:'<path d="M3 14.5h18l-2.2 3.2H5.2z"/><path d="M6 11h12"/><path d="M8.5 11v3.5M15.5 11v3.5"/><path d="M3 20.5c2 0 2-.8 4.5-.8s2 .8 4.5.8 2-.8 4.5-.8 2 .8 4.5.8"/>',loko:'<path d="M3.5 12c3-4.2 9-5 12.5 0-3.5 5-9.5 4.2-12.5 0z"/><path d="M16 12l5-3.2v6.4z"/><circle cx="7.2" cy="11.2" r=".9" fill="currentColor"/><path d="M3 20c3-2 15-2 18 0"/>',koa:'<path d="M6.5 20.5h11"/><ellipse cx="12" cy="17.8" rx="4.3" ry="2"/><ellipse cx="12" cy="13.8" rx="3.2" ry="1.8"/><path d="M12 12V5.2a2.1 2.1 0 1 1 3.1 1.9"/>',surf:'<path d="M2.5 17c3.2 0 4.2-8.5 9.5-8.5 3 0 4.2 2 4.2 4.2-1.2-.2-3.2-.6-4 1.4 3 0 5.6 1 7.8 2.9"/><path d="M2.5 20.5h19"/>',kula:'<path d="M2.5 18.5c2-3 4.5-3 6.5 0M9 18.5c2-3 4.5-3 6.5 0M15.5 18.5c1.6-2.4 4-3 6 0"/><path d="M2.5 21h19"/><path d="M5.8 14.5v-3M12.2 14.5v-4M18.6 14.5v-3"/>',ahu:'<path d="M7.5 20.5h9l-1.2-3.2H8.7z"/><path d="M9.3 17.3l.6-3h4.2l.6 3"/><path d="M10.4 14.3l.6-2.3h2l.6 2.3"/><path d="M18 3.5l.7 1.6 1.6.7-1.6.7L18 8.1l-.7-1.6-1.6-.7 1.6-.7z"/>',puuhonua:'<path d="M2.5 20h19"/><path d="M3 20v-6.5h9.5V20"/><path d="M3 16.2h9.5"/><path d="M14 20l3.6-7.5L21.2 20"/>',holua:'<path d="M3 5.5l18 13.5"/><path d="M7.8 7.6l3.6 2.7"/><path d="M6.6 10.4l5.3 4"/><circle cx="9.6" cy="6.2" r="1.2"/>',malama:'<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 7.5-6.5 0 4-3 6.5-7.5 6.5z"/><path d="M12 15.5c0-3.2-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5z"/>',play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13" stroke-width="2.6"/>',prev:'<path d="M15 5l-7 7 7 7"/>',next:'<path d="M9 5l7 7-7 7"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',lines:'<path d="M12 3 4 20M12 3l8 17"/><path d="M12 3v17" stroke-dasharray="2 2.4"/>',zones:'<path d="M3 6h18M3 10.5h18M3 15h18M3 19.5h18"/>',pins:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6v.6"/><circle cx="12" cy="17.2" r=".9" fill="currentColor"/>',expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',mute:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"/>',moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',moae:'<path d="M3 8.5h11a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 12.5h15a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 16.5h8"/>',kona:'<path d="M7 13.5a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M12.5 13.5 10 18h3.5l-2 3.5"/>',malie:'<circle cx="8.5" cy="8.5" r="3"/><path d="M8.5 2.5v1.5M2.5 8.5H4M4.3 4.3l1 1"/><path d="M9.5 18.5a3.5 3.5 0 1 1 .7-6.9 4.3 4.3 0 0 1 8.3 2 2.6 2.6 0 0 1-.4 4.9z"/>',auto:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4.5v4h-4"/>',kau:'<circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>',hooilo:'<path d="M7 13a4 4 0 1 1 .9-7.9 5 5 0 0 1 9.6 2.4 3 3 0 0 1-.5 5.5z"/><path d="M9 16.5v3M13 16.5v3M17 16.5v3"/>',speed1:'<path d="M8 5.5v13l9-6.5z"/>',speed2:'<path d="M4.5 5.5v13l7.5-6.5zM12 5.5v13l7.5-6.5z"/>',speed3:'<path d="M3 6v12l6-6zM9.5 6v12l6-6zM16 6v12l6-6z"/>',wind:'<path d="M12 3l4 8h-3v10h-2V11H8z" fill="currentColor" stroke="none"/>',explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',tour:'<path d="M4 19c4-1 4-6 8-7s5-6 8-7"/><circle cx="4" cy="19" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="20" cy="5" r="1.4" fill="currentColor"/>'};function Pe(s,t=24){return`<svg class="ic" viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${S2[s]||""}</svg>`}const $n=(s,t)=>Math.atan2(s,t);function E2(s){const t=s.island.meta,e=t.sites,n=s.terrain,i=t.ahupuaa.find(z=>z.id===e.model)||t.ahupuaa[0],[o,a]=i.mouth;let r=i.topX-o,l=i.topZ-a;const c=Math.hypot(r,l)||1;r/=c,l/=c;const h=$n(-r,-l),u=$n(r,l),f=(z,U)=>new q(z,Math.max(0,n.heightAt(z,U)),U),d=i.trunk||[],v=z=>{if(!d.length)return[o+r*c*z,a+l*c*z];const U=d[Math.min(d.length-1,Math.floor(z*(d.length-1)))];return[U[0],U[1]]},g=z=>{let U=d[0];for(const L of d)Math.abs(L[2]-z)<Math.abs(U[2]-z)&&(U=L);return U?[U[0],U[1]]:v(.6)},x=e.villages.find(z=>z.model)||e.villages[0],p=e.loi.find(z=>z.model)||e.loi[0],m=e.heiau.find(z=>z.model)||e.heiau[0],M=e.ponds.find(z=>z.model)||e.ponds[0],_=e.canoes.find(z=>z.village===i.id)||e.canoes[0],E=e.koa.find(z=>z.id===i.id)||e.koa[0],y=z=>Math.min(...e.ponds.map(U=>Math.hypot(U.cx-z.x,U.cz-z.z)),99),A=[...e.surf].sort((z,U)=>Math.hypot(z.x-o,z.z-a)-Math.max(0,8-y(z))*20-(Math.hypot(U.x-o,U.z-a)-Math.max(0,8-y(U))*20))[0],b=e.alii||x,S=[...t.ahu].filter(z=>z.a===i.id||z.b===i.id).sort((z,U)=>Math.hypot(z.x-o,z.z-a)-Math.hypot(U.x-o,U.z-a))[0]||t.ahu[0],[R,k]=t.center,I=(()=>{const z=s.island.data.region,U=Math.sqrt(z.length/4);let L=null,W=-1;for(let j=0;j<U;j+=4)for(let P=0;P<U;P+=4)if(z[(j*U+P)*4+3]>W){let G=0;for(let K=-8;K<=8;K+=4)for(let Q=-8;Q<=8;Q+=4)G+=z[(Math.min(U-1,Math.max(0,j+K))*U+Math.min(U-1,Math.max(0,P+Q)))*4+3];G>W&&(W=G,L=[((P+.5)/U-.5)*360,((j+.5)/U-.5)*360])}return L||[b.x,b.z-10]})(),T={};let C=[];T.island={target:f(R+10,k+4),distance:330,yaw:.28,pitch:.78,overlay:[.55,0,.6,0],hour:9.5};{const z=o-r*4,U=a-l*4,[L,W]=Pa(wl.moae.bearing),j=[];for(const[P,O]of[[24,3],[48,-4]]){const G=z-L*P-W*O,K=U-W*P+L*O;j.push([G,K]);for(let Q=0;Q<6;Q++){const ot=Q*Math.PI/3;j.push([G+Math.cos(ot)*6,K+Math.sin(ot)*6])}}T.rain={target:f(z,U),distance:24,yaw:u,pitch:.1,hour:16.5,weather:"moae",boost:!0,overlay:[0,0,0,0],lookUp:.35,showers:j}}{const[z,U]=v(.45);T.ahupuaa={target:f(z,U),distance:92,yaw:h+.25,pitch:.55,focus:i.id,overlay:[1,.85,.4,.6],hour:11}}{const[z,U]=g(260);T.akua={target:f(z,U),distance:26,yaw:h+.15,pitch:.1,hour:8.2,overlay:[0,0,0,0],lookUp:.55},C=s.waterfalls?P2(s,n,z,U):[]}{const[z,U]=g(520);T.nahele=O2(s,n,i,z,U)||{target:f(z,U),distance:9,yaw:h+.9,pitch:.55,hour:9.5,overlay:[0,0,0,0]}}if(p){let z=p.paddies[0].c,U=-1;for(const L of p.paddies){let W=0;for(const j of p.paddies)Math.hypot(j.c[0]-L.c[0],j.c[1]-L.c[1])<1.6&&W++;W>U&&(U=W,z=L.c)}T.loi={target:f(z[0],z[1]),distance:4.4,yaw:h-.5,pitch:.72,hour:10.2,overlay:[0,0,0,0]}}if(T.kauhale={target:f(x.x,x.z),distance:3.2,yaw:h+.9,pitch:.55,hour:8.8,overlay:[0,0,0,0]},m&&(T.heiau={target:f(m.x,m.z),distance:2.1,yaw:m.rot+2.2,pitch:.42,hour:11.5,overlay:[0,0,0,0]}),_){const z=Math.cos(_.dir),U=Math.sin(_.dir);T.kahakai={target:f(_.x,_.z),distance:2,yaw:$n(z,U)+.7,pitch:.28,hour:15.8,overlay:[0,0,0,0]}}if(M&&(T.loko={target:f(M.cx+M.ax*M.r*.4,M.cz+M.az*M.r*.4),distance:6,yaw:$n(M.ax,M.az)+.6,pitch:.5,hour:13,overlay:[0,0,0,0]}),E){const z=_||{dir:0};T.koa={target:f(E.x,E.z),distance:1.8,yaw:$n(-Math.cos(z.dir),-Math.sin(z.dir))+.3,pitch:.2,hour:6.9,overlay:[0,0,0,0],lookUp:.25}}const F=A&&s.life?s.life.breakNear(A.x,A.z):null;if(F){const z=Math.floor(F.n*.5),U=F.nx[z]*.8+F.tx[z]*.65,L=F.nz[z]*.8+F.tz[z]*.65,W=Math.hypot(U,L),j=new q(F.x[z]+F.nx[z]*.08+L/W*.2,.04,F.z[z]+F.nz[z]*.08-U/W*.2),P=$n(U,L);T.surf={target:j,distance:1,yaw:P,pitch:.13,hour:U>0?9.4:15.6,overlay:[0,0,0,0],orbit:[P-.3,P+.3]}}else A&&(T.surf={target:f(A.x,A.z),distance:1.3,yaw:$n(Math.cos(A.dir+.9),Math.sin(A.dir+.9)),pitch:.12,hour:14.5,overlay:[0,0,0,0]});if(T.kula={target:f(I[0],I[1]),distance:11,yaw:.9,pitch:.42,hour:9,overlay:[0,0,0,0]},S){let z=0,U=-1/0;for(let L=0;L<24;L++){const W=L/24*Math.PI*2,j=n.heightAt(S.x+Math.sin(W)*2.2,S.z+Math.cos(W)*2.2);j>U&&(U=j,z=W)}T.ahu={target:f(S.x,S.z),distance:2,yaw:z,pitch:.3,hour:18.2,doy:318,overlay:[0,0,0,.8],lookUp:.6,ahu:S}}if(e.puuhonua){const z=e.puuhonua;T.puuhonua={target:f(z.x-Math.cos(z.dir)*.8,z.z-Math.sin(z.dir)*.8),distance:3.4,yaw:$n(Math.cos(z.dir+.9),Math.sin(z.dir+.9)),pitch:.42,hour:15,overlay:[0,0,0,0]}}if(e.holua){const z=e.holua,U=z.x1-z.x0,L=z.z1-z.z0,W=Math.hypot(U,L)||1,j=f(z.x1-U/W*.42,z.z1-L/W*.42);j.y+=.03;const P=$n(U/W,L/W)-.45;T.holua={target:j,distance:1.05,yaw:P,pitch:.4,hour:16,overlay:[0,0,0,0],orbit:[P-.3,P+.3]};const O=f(z.x1-U/W*.5,z.z1-L/W*.5);O.y+=.02,E0(T.holua,O)}T.malama={target:f(R,k),distance:300,yaw:2.5,pitch:.5,hour:17.4,overlay:[.6,0,.5,0]};for(const z of Object.values(T))A2(z,n);if(C.length){const z=U2(s,n,T,C);z&&(T.akua=z.view,s.waterfalls.setHero(z.h,z.info))}s.waterfalls&&B2(s,T.nahele);const N={akua:[i.topX,i.topZ],nahele:[T.nahele.target.x,T.nahele.target.z],loi:T.loi?[T.loi.target.x,T.loi.target.z]:null,kauhale:[x.x,x.z],heiau:m?[m.x,m.z]:null,kahakai:_?[_.x,_.z]:null,loko:M?[M.cx+M.ax*M.r*.5,M.cz+M.az*M.r*.5]:null,koa:E?[E.x,E.z]:null,surf:A?[A.x,A.z]:null,kula:I,ahu:S?[S.x,S.z]:null,puuhonua:e.puuhonua?[e.puuhonua.x,e.puuhonua.z]:null,holua:e.holua?[(e.holua.x0+e.holua.x1)/2,(e.holua.z0+e.holua.z1)/2]:null};return{views:T,anchors:N,model:i}}function A2(s,t){for(let e=0;e<8;e++){const n=Math.cos(s.pitch),i=new q(s.target.x+s.distance*n*Math.sin(s.yaw),s.target.y+s.distance*Math.sin(s.pitch),s.target.z+s.distance*n*Math.cos(s.yaw));let o=!1;for(let a=1;a<24;a++){const r=a/24,l=i.x+(s.target.x-i.x)*r,c=i.y+(s.target.y-i.y)*r,h=i.z+(s.target.z-i.z)*r;if(Math.max(0,t.heightAt(l,h))>c-.03){o=!0;break}}if(!o)return;s.pitch=Math.min(1.3,s.pitch+.07)}}const T2=[.1,.14,.18,.22,.26,.3,.34],C2=[.6,.7,.8,.9,1,1.12,1.25,1.4],gn=.05,Ga=41,To=Math.tan(21*Math.PI/180),Za=650*qt,R2=.33,Co=1.47,Ja=s=>(t,e)=>Math.max(0,s.heightAt(t,e)),Vl=(s,t,e)=>{const n=Math.min(1,Math.max(0,(e-s)/(t-s)));return n*n*(3-2*n)};function y0(s,t,e,n,i,o,a,r=a){for(let l=1;l<o;l++){const c=l/o,h=t.x+(e-t.x)*c,u=t.z+(i-t.z)*c,f=t.y+(n-t.y)*c,d=Math.hypot(e-h,i-u)>1?r:a;if(s(h,u)>f-d)return!1}return!0}const Xi=(s,t,e,n,i)=>s.set(t.x+n*Math.cos(i)*Math.sin(e),t.y+n*Math.sin(i),t.z+n*Math.cos(i)*Math.cos(e)),b0=s=>.12+.03*s+.05;function ka(s,t,e){const n=Math.hypot(e.x-t.x,e.z-t.z),i=Math.max(16,Math.ceil(n/.25));for(let o=1;o<i;o++){const a=o/i,r=(1-a)*n,l=.03+R2*Vl(.4,1.2,r)+(a*n<1?.08:0);if(s(t.x+(e.x-t.x)*a,t.z+(e.z-t.z)*a)>t.y+(e.y-t.y)*a-l)return!1}return!0}function S0(s,t,e,n,i,o,a){return t.y>a||t.y<s(t.x,t.z)+b0(n)||!y0(s,t,e.x,e.y,e.z,24,.03)?!1:ka(s,t,e)&&ka(s,t,o)&&ka(s,t,i.lip)}function fu(s,t,e,n,i,o,a,r){const l=new q,c=new Uint8Array(Ga);for(let h=0;h<Ga;h++)c[h]=S0(s,Xi(l,e,i+(h-20)*gn,o,a),e,o,t,n,r)?1:0;return c}function du(s,t){if(!s||!s[t])return null;let e=t,n=t;for(;e>0&&s[e-1];)e--;for(;n<Ga-1&&s[n+1];)n++;return[(e-t)*gn,(n-t)*gn]}const k2=s=>{const t=s.lip.y-s.base.y;return new q(s.base.x+(s.lip.x-s.base.x)*.55,s.base.y+t*.55,s.base.z+(s.lip.z-s.base.z)*.55)};function P2(s,t,e,n){const i=[];return s.waterfalls.heroes.forEach((o,a)=>{const l=.5*Math.min(1,o.per*.5+.6*Vl(3e3,8e3,o.rain))-(a===0?0:.004*Math.hypot(o.lip.x-e,o.lip.z-n));for(const c of L2(s,t,o))c.score+=l,i.push(c)}),i.sort((o,a)=>a.score-o.score).slice(0,60)}function L2(s,t,e){const n=Ja(t),i=Math.atan2(e.face[0],e.face[1]),o=new q(e.pool.x,n(e.pool.x,e.pool.z),e.pool.z),a=e.lip.y-e.base.y,r=k2(e),l=Za-.6,c=(m,M)=>{const _=m.x+e.face[0]*.08,E=m.z+e.face[1]*.08;for(let y=.1;y<30;y+=.08)if(n(_+M.x*y,E+M.z*y)>m.y+M.y*y)return!1;return!0},h=[],u={};for(let m=7.4;m<=10.61;m+=.2){const M=Qu(s.clock.doy,m,u).sun.clone();M.y<.12||h.push({hr:m,sun:M,front:M.x*e.face[0]+M.z*e.face[1],lit:c(r,M),litPool:c(o,M),litLip:c(e.lip,M)})}if(!h.length)return[];const f=a/Math.tan(12*Math.PI/180),d=new q,v=new q,g=new q,x=new q,p=[];for(const m of C2){const M=m*f;for(const _ of T2){const E=fu(n,e,o,r,i,M,_,l);if(!E.some(w=>w))continue;const y=fu(n,e,o,r,i,M*Co,_,l);for(let w=0;w<Ga;w++){const A=du(E,w);if(!A||A[1]-A[0]<.25)continue;const b=du(y,w),S=(w-20)*gn,R=i+S;Xi(d,o,R,M,_);const k=n(d.x,d.z);v.subVectors(e.lip,d).normalize(),g.subVectors(e.base,d).normalize();const I=Math.acos(Math.min(1,v.dot(g)))*180/Math.PI;x.subVectors(e.mist,d).normalize();const T=A[1]-A[0],C=-.04*Math.abs(I-13)-.08*Math.max(0,10.5-I)-.6*Math.max(0,.12-_)-.4*Math.max(0,_-.3)-.25*Math.abs(S)-.35*Math.max(0,1-(d.y-k))+.3*Math.min(.8,T)-(b?.3*Math.max(0,.4-(b[1]-b[0])):.25);let F=-1/0,N=8.2;for(const{hr:z,sun:U,front:L,lit:W,litPool:j,litLip:P}of h){const O=Math.acos(Math.max(-1,Math.min(1,-x.dot(U))))*180/Math.PI,G=(W?Math.max(0,L)+.3:0)+.12*j+.08*P-.6*Math.max(0,.38-U.y)+.15*Vl(.45,.8,U.y)-(W&&L>.35?.01*Math.min(20,Math.abs(O-41.5)):0);G>F&&(F=G,N=z)}p.push({h:e,score:C+F,hour:N,yaw:R,dist:M,pitch:_,arc:A,arcP:b,tgt:o,mid:r})}}}return p}function z2(s,t,e){const n=new q().subVectors(e,t).normalize(),i=new q().crossVectors(n,new q(0,1,0)).normalize(),o=new q().crossVectors(i,n),a=new q,r=new q;let l=0;const c=[-.7,-.35,0,.3];for(const h of c){a.copy(n).addScaledVector(i,h*To*1.6).addScaledVector(o,.75*To).normalize();let u=!1;for(let f=.3;f<15&&(r.copy(t).addScaledVector(a,f),!(r.y>Za));f+=.15+f*.02)if(r.y<s(r.x,r.z)){u=!0;break}u||l++}return l/c.length}function pu(s,t,e,n,i){if(!n)return!0;const o=new q;for(let a=n[0];a<=n[1]+1e-6;a+=gn)if(!S0(s,Xi(o,e,t.yaw+a,i,t.pitch),e,i,t.h,t.mid,Za-.6))return!1;return!0}function D2(s,t){const e=Ja(s),n=new q(Math.cos(t.yaw),0,-Math.sin(t.yaw));let i=t.tgt;for(const r of[.08,.05,.025]){const l=t.tgt.clone().addScaledVector(n,r*t.dist);if(l.y=e(l.x,l.z),!(Math.abs(l.y-t.tgt.y)>=.4)&&!(!pu(e,t,l,t.arc,t.dist)||!pu(e,t,l,t.arcP,t.dist*Co))){i=l;break}}const o=Math.min(.6,Math.max(0,(t.mid.y-i.y)/(.45*t.dist))),a={target:i,distance:t.dist,yaw:t.yaw,pitch:t.pitch,hour:Math.round(t.hour*10)/10,lookUp:o,weather:"moae",spate:1,overlay:[0,0,0,0]};return a.orbit=[t.yaw+t.arc[0],t.yaw+t.arc[1]],t.arcP&&(a.orbitPortrait=[t.yaw+t.arcP[0],t.yaw+t.arcP[1]]),E0(a,t.mid),a}function E0(s,t){const e=s.lookUp,n=Math.cos(s.pitch),i=o=>{const a=s.distance*Math.sqrt(1/o),r=s.target.x+a*n*Math.sin(s.yaw),l=s.target.y+a*Math.sin(s.pitch),c=s.target.z+a*n*Math.cos(s.yaw),h=Math.atan2(t.y-l,Math.hypot(t.x-r,t.z-c))-Math.atan(.42*To);return(l+a*n*Math.tan(h)-s.target.y)/(.45*a)};Object.defineProperty(s,"lookUp",{enumerable:!0,get:()=>{const o=typeof innerWidth=="number"?innerWidth/Math.max(1,innerHeight):1.6;return o<1?i(o):e}})}function F2(s,t,e,n,i){const o=Object.create(Object.getPrototypeOf(s.rig)),a=()=>({target:e.target.clone(),distance:e.distance,yaw:e.yaw+i,pitch:e.pitch,lift:e.lookUp||0});Object.assign(o,{camera:new rn(42,1.6,.1,9e3),terrain:t,state:a(),goal:a(),flight:null,floor:0,autoOrbit:0,lastInput:-1e12,_v:new q,_prevXZ:null}),o.apply(0);for(let v=0;v<30;v++)o.update(1/60);const r=o.floor,l=o.goal.target.distanceTo(n.target),c=Math.min(6,2.2+Math.sqrt(l)*.22+Math.abs(Math.log(n.distance/o.goal.distance))*.35);o.flyTo({target:n.target,distance:n.distance,yaw:n.yaw,pitch:n.pitch,lift:n.lookUp||0},c),o.autoOrbit=n.distance<60?.012:.02;let h=r,u=0,f=o.camera.position.y,d=f;for(let v=Math.round((c+1.5)*60);v>0;v--){o.update(1/60),o.floor>h&&(h=o.floor);const g=o.camera.position.y;u=Math.max(u,Math.abs(g-2*d+f)*3600),f=d,d=g}return{lift:h-r,acc:u}}function I2(s,t,e,n){if(!s.rig)return{acc:0,accNext:0};const i=[e.nahele,e.ahupuaa].filter(Boolean);let o=0,a=0;const r=(l,c,h)=>{const u=F2(s,t,l,c,h);return u.lift>.005?!1:(o=Math.max(o,u.acc),(l===e.nahele||c===e.nahele)&&(a=Math.max(a,u.acc)),!0)};for(const l of i)if(!r(l,n,.048)||!r(l,n,.6)||!r(n,l,0))return null;for(const l of[0,1]){const c=l===0?gn:-gn;let h=n.orbit[l]-n.yaw;for(;Math.abs(h)>1e-6&&!i.every(u=>r(n,u,h));)h=Math.abs(h)<=gn+1e-6?0:h+c;n.orbit[l]=n.yaw+h}return n.orbit[1]-n.orbit[0]<.1?null:(n.orbitPortrait&&(n.orbitPortrait=[Math.max(n.orbitPortrait[0],n.orbit[0]),Math.min(n.orbitPortrait[1],n.orbit[1])]),{acc:o,accNext:a})}function U2(s,t,e,n){const i=Ja(t),o=new q,a=new q;for(const d of n)Xi(o,d.tgt,d.yaw,d.dist,d.pitch),a.set(d.tgt.x,d.mid.y,d.tgt.z),d.open=z2(i,o,a),d.score+=.2*d.open;n.sort((d,v)=>v.score-d.score);let r=null;for(const d of n){if(r&&d.score<=r.final)break;const v=D2(t,d),g=I2(s,t,e,v);if(!g)continue;const x=d.score-.004*Math.max(0,g.acc-60)-.003*Math.max(0,g.accNext-15);(!r||x>r.final)&&(r={c:d,v,final:x,acc:g.acc,accNext:g.accNext})}if(!r)return null;const{c:l,v:c}=r,h=l.h;for(const[d,v]of[[c.orbit,c.distance],[c.orbitPortrait,c.distance*Co]])if(d)for(let g=d[0];g<=d[1]+1e-6;g+=gn)s.waterfalls.clearSight(Xi(o,c.target,g,v,c.pitch).clone(),[h.pool,l.mid,h.lip]);const u=d=>Math.round(d*100)/100,f=d=>d&&d.map(v=>u(v-c.yaw));return{view:c,h,info:{score:u(r.final),open:l.open,arc:f(c.orbit),arcP:f(c.orbitPortrait),acc:Math.round(r.acc),accNext:Math.round(r.accNext)}}}const N2={ohia:1,ohiaKrumm:.35,koa:1,hapuu:.7,lama:.2,aalii:-.2,kukui:-.6,ohiaai:-.4,hau:-.4,hala:-.6,wiliwili:-.5},oo=4.5,mu=[.15,.25],ao=9,ro=6;function O2(s,t,e,n,i){var C,F;const o=s.vegetation;if(!o||!o.buildTile)return null;const a=Ja(t),r=Za-.6,l=s.island.data.region,c=Math.sqrt(l.length/4),h=(N,z)=>{const U=Math.floor((N+180)/360*c),L=Math.floor((z+180)/360*c);return U>=0&&L>=0&&U<c&&L<c&&l[(L*c+U)*4]===e.id},u=qi.map(N=>N2[N]||0),f=new Map,d=(N,z)=>{const U=N*8192+z;let L=f.get(U);if(L)return L;const W=o.buildTile(N,z);L=[];for(let j=0;j<u.length;j++)for(let P=W.off[j];P<W.off[j+1];P++){const O=W.mat[P*16+5],G=u[j]*(qi[j]==="ohia"?Math.min(1,O/.016):1);G&&L.push(W.mat[P*16+12],W.mat[P*16+13]+O*8,W.mat[P*16+14],G)}return f.set(U,L),L},v=(F=(C=s.waterfalls)==null?void 0:C.heroes)==null?void 0:F[0],g=new q,x=new q,p=new q,m=new q,M=new q(0,1,0),_=(N,z,U,L)=>{const W=N-g.x,j=z-g.y,P=U-g.z,O=W*x.x+j*x.y+P*x.z;return O<=.05?!1:(L[0]=(W*p.x+j*p.y+P*p.z)/O/(To*1.6),L[1]=(W*m.x+j*m.y+P*m.z)/O/To,L[2]=O,!0)},E=[0,0,0],y=[0,0,0],w=(N,z,U,L)=>(Xi(g,N,z,U,L),g.y<=r&&g.y>=a(g.x,g.z)+b0(U)&&y0(a,g,N.x,N.y,N.z,24,.03)),A=(N,z,U,L)=>{let W=0,j=0;for(;W>-.6&&w(N,z+W-gn,U,L);)W-=gn;for(;j<.6&&w(N,z+j+gn,U,L);)j+=gn;return[W,j]},b=N=>{x.subVectors(N,g).normalize(),p.crossVectors(x,M).normalize(),m.crossVectors(p,x);let z=0;for(let U=Math.floor((g.x-ro)/2);U<=Math.floor((g.x+ro)/2);U++)for(let L=Math.floor((g.z-ro)/2);L<=Math.floor((g.z+ro)/2);L++){const W=(U*2+1-g.x)*x.x+(L*2+1-g.z)*x.z,j=(U*2+1-g.x)*p.x+(L*2+1-g.z)*p.z;if(W<-1.5||j>.25*W+1.5||j<-.62*W-1.5)continue;const P=d(U,L);for(let O=0;O<P.length;O+=4)!_(P[O],P[O+1],P[O+2],E)||E[0]>.4||E[0]<-1||E[1]>1||E[1]<-1||E[2]>ro||(z+=P[O+3]*(E[2]<4.4?2:1)/Math.max(1,E[2]))}return z};let S=null;const R=new q,k=(N,z)=>{if(!w(R,N,oo,z))return;let U=b(R);if(S&&U+40<S.score)return;v&&_(v.lip.x,v.lip.y,v.lip.z,E)&&_(v.base.x,v.base.y,v.base.z,y)&&E[0]>-.9&&E[0]<.4&&E[1]<.95&&y[1]>-.95&&ka(a,g,v.lip)&&(U+=25);const L=A(R,N,oo,z);U+=20*Math.min(.6,L[1]-L[0]),(!S||U>S.score)&&(S={score:U,x:R.x,z:R.z,yaw:N,pitch:z,arc:L})};for(let N=i-ao;N<=i+ao;N+=.75)for(let z=n-ao;z<=n+ao;z+=.75){if(Math.hypot(z-n,N-i)>ao||!h(z,N))continue;const U=t.metresAt(z,N);if(!(U<460||U>640)){R.set(z,a(z,N),N);for(const L of mu)for(let W=0;W<12;W++)k(W/12*Math.PI*2,L)}}if(S){const N=S;R.set(N.x,a(N.x,N.z),N.z);for(const z of mu)for(const U of[-.26,-.13,.13,.26])k(N.yaw+U,z)}if(!S||S.arc[1]-S.arc[0]<.1)return null;const I=new q(S.x,a(S.x,S.z),S.z),T={target:I,distance:oo,yaw:S.yaw,pitch:S.pitch,hour:9.5,overlay:[0,0,0,0]};if(T.orbit=[S.yaw+S.arc[0],S.yaw+S.arc[1]],w(I,S.yaw,oo*Co,S.pitch)){const N=A(I,S.yaw,oo*Co,S.pitch);T.orbitPortrait=[S.yaw+Math.max(N[0],S.arc[0]),S.yaw+Math.min(N[1],S.arc[1])]}return T}function B2(s,t){if(!t)return;const e=new rn(42,1.6,.1,9e3);Xi(e.position,t.target,t.yaw,t.distance,t.pitch);const n=new q,i=new q;for(let o=t.lookUp||0;o<=.3+1e-6;o+=.05){e.lookAt(t.target.x,t.target.y+o*t.distance*.45,t.target.z),e.updateMatrixWorld();let a=!1;for(const r of s.waterfalls.heroes)n.copy(r.lip).project(e),i.copy(r.base).project(e),i.z<1&&Math.abs(i.x)<.9&&Math.abs(i.y)<.9&&n.y>.88&&(a=!0);if(!a){o>0&&(t.lookUp=o);return}}}const Ye=(s,t=document)=>t.querySelector(s),Te=(s,t={},e="")=>{const n=document.createElement(s);for(const[i,o]of Object.entries(t))i==="class"?n.className=o:i.startsWith("on")?n.addEventListener(i.slice(2),o):n.setAttribute(i,o);return e&&(n.innerHTML=e),n},H2=s=>{const t=Math.floor(s),e=Math.floor((s-t)*60);return`${t}:${String(e).padStart(2,"0")}`},G2=s=>s<.5?2*s*s:1-Math.pow(-2*s+2,2)/2;class W2{constructor(t){this.app=t,this.meta=t.island.meta;const e=E2(t);this.views=e.views,this.anchors=e.anchors,this.model=e.model,this.stops=b2.filter(n=>this.views[n.id]),this.mode="tour",this.index=-1,this.playing=!1,this.arrivedAt=0,this.overlayGoal=new _e(0,0,0,0),this.focusGoal=0,this.layer={lines:!1,zones:!1,pins:!0},this.timeTween=null,this.counts=this.countFeatures(),this.build(),this.bind(),t.updaters.push(n=>this.update(n))}countFeatures(){const t=this.meta.sites,e={},n=(i,o,a=1)=>{e[i]=e[i]||{loi:0,hale:0,heiau:0,loko:0,koa:0},e[i][o]+=a};for(const i of t.loi)n(i.id,"loi",i.paddies.length);for(const i of t.houses)n(i.village,"hale");for(const i of t.heiau)n(i.id,"heiau");for(const i of t.ponds)n(i.id,"loko");for(const i of t.koa)n(i.id,"koa");return e}build(){const t=Te("div",{id:"ui"});document.body.appendChild(t),this.root=t,t.appendChild(Te("div",{class:"brand"},`<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${Pe("akua",14)}<span></span>${Pe("loko",14)}</div>`)),this.modeEl=Te("div",{class:"modes"}),this.modeEl.append(Te("button",{class:"mode on","data-mode":"tour",title:"Guided tour","aria-label":"Guided tour"},`${Pe("tour",18)}<span>Tour</span>`),Te("button",{class:"mode","data-mode":"explore",title:"Explore freely","aria-label":"Explore freely"},`${Pe("explore",18)}<span>Explore</span>`)),t.appendChild(this.modeEl),this.tools=Te("div",{class:"tools"});const e=(a,r,l)=>Te("button",{class:"tool","data-tool":a,title:l,"aria-label":l},Pe(r,20));this.tools.append(e("lines","lines","Ahupuaʻa boundaries"),e("zones","zones","Zones, mountain to sea"),e("pins","pins","Places"),e("help","help","About"),e("full","expand","Full screen")),t.appendChild(this.tools),this.legend=Te("div",{class:"legend"}),Oh.forEach((a,r)=>this.legend.appendChild(Te("div",{class:"lg"},`<i style="background:${Ao[r]}"></i><b>${a.name}</b><em>${a.gloss}</em>`))),t.appendChild(this.legend),this.card=Te("section",{class:"card","aria-live":"polite"}),t.appendChild(this.card),this.rail=Te("nav",{class:"rail","aria-label":"Tour stops"}),this.playBtn=Te("button",{class:"play",title:"Play the tour","aria-label":"Play the tour"},Pe("play",18)),this.rail.appendChild(this.playBtn),this.dots=this.stops.map((a,r)=>{const l=Te("button",{class:"dot",title:a.title,"aria-label":a.title,"data-i":r},Pe(a.icon,18));return this.rail.appendChild(l),l}),this.progress=Te("div",{class:"rail-progress"},"<span></span>"),this.rail.appendChild(this.progress),t.appendChild(this.rail),this.markerLayer=Te("div",{class:"markers"}),t.appendChild(this.markerLayer),this.markers=this.stops.filter(a=>this.anchors[a.id]).map(a=>{const r=Te("button",{class:"marker",title:a.title,"aria-label":a.title},`${Pe(a.icon,18)}<span>${a.title}</span>`);r.addEventListener("click",h=>{h.stopPropagation(),this.openStop(this.stops.indexOf(a),{fly:!0,explore:!0})}),this.markerLayer.appendChild(r);const[l,c]=this.anchors[a.id];return{el:r,stop:a,pos:new q(l,0,c),vis:0}});for(const a of this.markers)a.pos.y=Math.max(0,this.app.terrain.heightAt(a.pos.x,a.pos.z))+.05;this.inspector=Te("div",{class:"inspector"}),t.appendChild(this.inspector),this.dock=Te("div",{class:"dock"}),this.dock.innerHTML=`
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
      <div class="wind" title="Wind"><span class="wind-arrow">${Pe("wind",22)}</span><span class="wind-speed"></span></div>`,t.appendChild(this.dock);const n=Ye(".regimes",this.dock);for(const a of["auto","moae","kona","malie"])n.appendChild(Te("button",{class:"chip","data-regime":a,title:`${ya[a].name} — ${ya[a].gloss}`,"aria-label":ya[a].name},Pe(a,18)));const i=Ye(".seasons",this.dock);for(const a of["kau","hooilo"])i.appendChild(Te("button",{class:"chip","data-season":a,title:`${il[a].name} — ${il[a].gloss}`,"aria-label":il[a].name},Pe(a,18)));const o=Ye(".speeds",this.dock);for(const[a,r,l]of[["0",0,"pause"],["1",30,"speed1"],["2",240,"speed2"],["3",1800,"speed3"]])o.appendChild(Te("button",{class:"chip","data-speed":r,title:r?`${r}× time`:"Pause time","aria-label":r?`${r} times speed`:"Pause"},Pe(l,16)));this.help=Te("div",{class:"help hidden"}),this.help.innerHTML=`
      <div class="help-card">
        <button class="help-close" aria-label="Close">${Pe("close",18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`,t.appendChild(this.help)}bind(){this.modeEl.addEventListener("click",r=>{const l=r.target.closest("[data-mode]");l&&this.setMode(l.dataset.mode)}),this.tools.addEventListener("click",r=>{var h,u,f;const l=r.target.closest("[data-tool]");if(!l)return;const c=l.dataset.tool;c==="help"?this.help.classList.toggle("hidden"):c==="full"?document.fullscreenElement?(h=document.exitFullscreen)==null||h.call(document):(f=(u=document.documentElement).requestFullscreen)==null||f.call(u).catch(()=>{}):(this.layer[c]=!this.layer[c],this.applyLayers())}),this.help.addEventListener("click",r=>{(r.target===this.help||r.target.closest(".help-close"))&&this.help.classList.add("hidden")}),this.rail.addEventListener("click",r=>{const l=r.target.closest(".dot");l&&(this.setMode("tour",!1),this.goto(Number(l.dataset.i)))}),this.playBtn.addEventListener("click",()=>this.setPlaying(!this.playing)),this.dock.addEventListener("click",r=>{const l=r.target.closest("[data-regime]"),c=r.target.closest("[data-season]"),h=r.target.closest("[data-speed]");l&&this.app.weather.setMode(l.dataset.regime),c&&this.setSeason(c.dataset.season),h&&(this.app.clock.speed=Number(h.dataset.speed)),this.refreshDock()});const t=Ye(".dial-svg",this.dock);let e=!1;const n=r=>{const l=t.getBoundingClientRect(),c=(r.clientX-l.left)/l.width*120,h=(r.clientY-l.top)/l.height*64;let u=Math.atan2(58-h,c-60);u<0&&(u=u<-Math.PI/2?Math.PI:0);const f=6+(Math.PI-u)/Math.PI*12;this.timeTween=null,this.app.clock.hour=f};t.addEventListener("pointerdown",r=>{e=!0,t.setPointerCapture(r.pointerId),n(r)}),t.addEventListener("pointermove",r=>e&&n(r)),t.addEventListener("pointerup",()=>e=!1);const i=this.app.canvas;let o=null;i.addEventListener("pointerdown",r=>o={x:r.clientX,y:r.clientY,t:performance.now()}),i.addEventListener("pointerup",r=>{if(!o)return;Math.hypot(r.clientX-o.x,r.clientY-o.y)<5&&performance.now()-o.t<400&&this.pick(r.clientX,r.clientY),o=null});let a=0;i.addEventListener("pointermove",r=>{if(r.buttons||r.pointerType==="touch")return;const l=performance.now();l-a<60||(a=l,this.hover(r.clientX,r.clientY))}),i.addEventListener("pointerleave",()=>this.hover(null)),addEventListener("keydown",r=>{r.key==="ArrowRight"&&!r.shiftKey&&this.mode==="tour"?(r.preventDefault(),this.goto(this.index+1)):r.key==="ArrowLeft"&&!r.shiftKey&&this.mode==="tour"?(r.preventDefault(),this.goto(this.index-1)):r.key==="Escape"?this.help.classList.contains("hidden")?this.closeCard():this.help.classList.add("hidden"):r.key===" "&&this.mode==="tour"&&r.target===document.body&&(r.preventDefault(),this.setPlaying(!this.playing))}),this.app.rig.onUserInput=()=>{this.playing&&this.setPlaying(!1)}}setMode(t,e=!0){if(this.mode===t&&e){t==="tour"&&this.index<0&&this.goto(0);return}this.mode=t;for(const n of this.modeEl.querySelectorAll(".mode"))n.classList.toggle("on",n.dataset.mode===t);this.root.classList.toggle("exploring",t==="explore"),t==="explore"?(this.setPlaying(!1),this.closeCard(),this.focusGoal=0,this.app.rig.autoOrbit=0,this.app.clock.speed=Math.max(this.app.clock.speed,30),this.applyLayers()):e&&this.goto(Math.max(0,this.index))}applyLayers(){for(const t of this.tools.querySelectorAll("[data-tool]")){const e=t.dataset.tool;e in this.layer&&t.classList.toggle("on",this.layer[e])}this.legend.classList.toggle("show",this.layer.zones),this.markerLayer.classList.toggle("hidden",!this.layer.pins||this.mode!=="explore"),this.mode==="explore"&&this.overlayGoal.set(this.layer.lines?1:0,this.layer.zones?1:0,this.layer.lines?.5:0,this.layer.lines?.8:.35)}setSeason(t){const e=this.app.clock;e.doy=t==="kau"?172:355,this.app.season=t,this.refreshDock()}setPlaying(t){this.playing=t,this.playBtn.innerHTML=Pe(t?"pause":"play",18),this.playBtn.classList.toggle("on",t),t&&this.mode!=="tour"&&this.setMode("tour"),t&&(this.arrivedAt=performance.now())}goto(t){if(t<0||t>=this.stops.length){t>=this.stops.length&&this.setPlaying(!1);return}this.openStop(t,{fly:!0,explore:!1})}openStop(t,{fly:e,explore:n}){this.index=t;const i=this.stops[t],o=this.views[i.id];if(this.dots.forEach((f,d)=>{f.classList.toggle("on",d===t),f.classList.toggle("done",d<t)}),this.renderCard(i,n),!o)return;const a=this.app.rig,r=a.goal.target.distanceTo(o.target),l=Math.min(6,2.2+Math.sqrt(r)*.22+Math.abs(Math.log(o.distance/a.goal.distance))*.35),c=innerWidth/Math.max(1,innerHeight),h=o.distance*(c<1?Math.pow(1/c,o.distance>40?1:.5):1);e&&a.flyTo({target:o.target,distance:h,yaw:o.yaw,pitch:o.pitch,lift:o.lookUp||0},l,{onDone:()=>this.arrivedAt=performance.now()}),this.arrivedAt=performance.now()+l*1e3,a.autoOrbit=o.distance<60?.012:.02;const u=this.app.clock;if(o.doy!==void 0&&Math.abs(o.doy-u.doy)>2?u.doy=o.doy:o.doy===void 0&&this.lastDoy!==void 0&&u.doy!==this.lastDoy&&(u.doy=this.lastDoy),o.doy===void 0&&(this.lastDoy=u.doy),o.hour!==void 0){let f=o.hour-u.hour;f<-12&&(f+=24),f>12&&(f-=24),this.timeTween={from:u.hour,by:f,t:0,dur:l}}if(u.speed=20,o.weather&&this.app.weather.setMode(o.weather),this.app.weather.boost=o.boost?1:0,o.showers)for(const[f,d]of o.showers)this.app.weather.spawnShower(f,d,5+Math.random()*3,.7);if(o.ahu&&this.app.life&&this.app.life.walkTo(o.ahu.x,o.ahu.z),!n){const f=o.overlay||[0,0,0,0];this.overlayGoal.set(f[0],f[1],f[2],f[3]),this.focusGoal=o.focus||0}}renderCard(t,e){var o,a,r,l;const n=t.zone!==void 0&&t.zone!==null?Oh[t.zone]:null,i=this.stops.length;this.card.innerHTML=`
      <header>
        <div class="card-icon">${Pe(t.icon,26)}</div>
        <div class="card-titles"><h1>${t.title}</h1><p class="gloss">${t.gloss}</p></div>
        <button class="card-close" aria-label="Close">${Pe("close",18)}</button>
      </header>
      ${n?`<div class="zone-chip"><i style="background:${Ao[t.zone]}"></i>${n.name}<em>${n.gloss}</em></div>`:""}
      <div class="card-body">${t.text.map(c=>`<p>${c}</p>`).join("")}</div>
      ${e?"":`<footer>
        <button class="nav prev" aria-label="Previous" ${this.index===0?"disabled":""}>${Pe("prev",18)}</button>
        <span class="count">${this.index+1} / ${i}</span>
        ${this.index===i-1?`<button class="nav finish" aria-label="Explore">${Pe("explore",18)}<span>Explore</span></button>`:`<button class="nav next" aria-label="Next">${Pe("next",18)}</button>`}
      </footer>`}`,this.card.classList.add("show"),this.card.scrollTop=0,(o=Ye(".prev",this.card))==null||o.addEventListener("click",()=>this.goto(this.index-1)),(a=Ye(".next",this.card))==null||a.addEventListener("click",()=>this.goto(this.index+1)),(r=Ye(".finish",this.card))==null||r.addEventListener("click",()=>this.setMode("explore")),(l=Ye(".card-close",this.card))==null||l.addEventListener("click",()=>this.closeCard())}closeCard(){this.card.classList.remove("show")}regionAt(t,e){const n=this.app.island.data.region,i=le,o=Math.floor((t+ht)/Vt*i),a=Math.floor((e+ht)/Vt*i);return o<0||a<0||o>=i||a>=i?0:n[(a*i+o)*4]}hover(t,e){if(t===null||this.mode!=="explore"){this.app.shared.uniforms.uHover.value=0,this.pinned||this.inspector.classList.remove("show");return}const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(this.app.shared.uniforms.uHover.value=i,!this.pinned){if(!i){this.inspector.classList.remove("show");return}this.showInspector(i,t,e)}}pick(t,e){if(this.mode!=="explore")return;const n=this.app.rig.pickGround(t,e),i=n?this.regionAt(n.x,n.z):0;if(!i||i===this.focusGoal){this.focusGoal=0,this.pinned=!1,this.inspector.classList.remove("show","pinned");return}this.focusGoal=i,this.pinned=!0,this.showInspector(i,t,e,!0)}showInspector(t,e,n,i=!1){const o=this.meta.ahupuaa.find(c=>c.id===t);if(!o)return;if(this.inspectorId!==t){this.inspectorId=t;const c=Cv[o.moku],h=this.counts[t]||{},u=(f,d)=>d?`<span class="st">${Pe(f,15)}${d}</span>`:"";this.inspector.innerHTML=`
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${o.moku+1})"></i>${c.name}<em>${c.gloss}</em></span></div>
        ${V2(o.profile)}
        <div class="in-stats"><span class="st">${o.area.toFixed(1)} km²</span><span class="st">${Pe("akua",15)}${Math.round(o.top)} m</span>${u("loi",h.loi)}${u("kauhale",h.hale)}${u("heiau",h.heiau)}${u("loko",h.loko)}${u("koa",h.koa)}</div>`}this.inspector.classList.add("show"),this.inspector.classList.toggle("pinned",i);const a=innerWidth,r=Math.min(a-300,e+18),l=Math.max(70,Math.min(innerHeight-220,n+18));this.inspector.style.transform=`translate(${r}px, ${l}px)`}update(t){const e=this.app,n=e.shared.uniforms,i=1-Math.exp(-t*3);if(e.overlay.lerp(this.overlayGoal,i),this.focusGoal?(n.uFocus.value=this.focusGoal,n.uFocusK.value+=(1-n.uFocusK.value)*i):(n.uFocusK.value+=(0-n.uFocusK.value)*i,n.uFocusK.value<.01&&(n.uFocus.value=0)),this.timeTween){const o=this.timeTween;o.t=Math.min(1,o.t+t/o.dur),e.clock.hour=((o.from+o.by*G2(o.t))%24+24)%24,o.t>=1&&(this.timeTween=null)}if(this.playing&&this.mode==="tour"&&!e.rig.flight){const a=this.stops[this.index].text.join(" ").split(/\s+/).length,r=Math.max(9,a*.32)*1e3,l=performance.now()-this.arrivedAt;Ye("span",this.progress).style.width=`${Math.min(100,l/r*100)}%`,l>r&&(this.index<this.stops.length-1?this.goto(this.index+1):this.setPlaying(!1))}else Ye("span",this.progress).style.width="0%";this.updateMarkers(),this.frameN=(this.frameN||0)+1,this.frameN%6===0&&this.refreshDock()}updateMarkers(){if(this.mode!=="explore"||!this.layer.pins)return;const t=this.app.camera,e=innerWidth,n=innerHeight,i=new q,o=[],a=this.markers.map(r=>({m:r,d:t.position.distanceTo(r.pos)})).sort((r,l)=>r.d-l.d);for(const{m:r,d:l}of a){i.copy(r.pos).project(t);const c=i.z>1,h=(i.x+1)/2*e,u=(1-i.y)/2*n;let f=!c&&h>-40&&h<e+40&&u>60&&u<n+40&&l<420;f&&o.some(d=>Math.abs(d[0]-h)<44&&Math.abs(d[1]-u)<40)&&(f=!1),f&&o.push([h,u]),r.el.style.opacity=f?String(Math.min(1,(420-l)/120)):"0",r.el.style.pointerEvents=f?"auto":"none",f&&(r.el.style.transform=`translate(${h}px, ${u}px)`),r.el.classList.toggle("near",l<40)}}refreshDock(){const t=this.app,e=t.clock,n=t.light,i=Ye(".dial-body",this.dock),o=(e.hour-6)/12,a=e.hour<6||e.hour>18;let r;if(!a)r=Math.PI-o*Math.PI;else{const x=(e.hour-18+24)%24/12;r=Math.PI-x*Math.PI}const l=60+Math.cos(r)*52,c=58-Math.sin(r)*52;i.setAttribute("transform",`translate(${l.toFixed(1)} ${c.toFixed(1)})`),i.classList.toggle("moon",a),Ye(".dial-time",this.dock).textContent=H2(e.hour);const h=Ix[t.sky.astro.night]||"",u=Ye(".dial-night",this.dock);u.textContent=n.night>.5?`Pō ${h}`:"",u.title="The night of the Hawaiian lunar month";for(const x of this.dock.querySelectorAll("[data-regime]"))x.classList.toggle("on",t.weather.mode===x.dataset.regime);const f=e.doy>120&&e.doy<305?"kau":"hooilo";t.season=f;for(const x of this.dock.querySelectorAll("[data-season]"))x.classList.toggle("on",f===x.dataset.season);for(const x of this.dock.querySelectorAll("[data-speed]"))x.classList.toggle("on",Number(x.dataset.speed)===e.speed||e.speed===20&&x.dataset.speed==="30");const d=t.weather.wind,v=Math.atan2(d.x,-d.y)*180/Math.PI;Ye(".wind-arrow",this.dock).style.transform=`rotate(${v.toFixed(0)}deg)`,Ye(".wind-speed",this.dock).textContent=`${Math.round(d.length()*3.6)} km/h`;const g=ya[t.weather.regime];Ye(".wind",this.dock).title=`${g.name} — ${g.gloss}`}start(){this.setMode("tour",!1),this.applyLayers(),this.goto(0)}}function V2(s){if(!s||s.length<2)return"";const t=260,e=78,n=s[s.length-1][0],i=Math.max(...s.map(f=>f[1]),200),o=Math.min(...s.map(f=>f[1]),-30),a=(e-14)/(i-o),r=f=>t-f/n*(t-4)-2,l=f=>e-6-(f-o)*a,c=l(0);let h="";for(let f=0;f<s.length-1;f++){const d=s[f],v=s[f+1];h+=`<path d="M${r(d[0]).toFixed(1)} ${c.toFixed(1)}L${r(d[0]).toFixed(1)} ${l(d[1]).toFixed(1)}L${r(v[0]).toFixed(1)} ${l(v[1]).toFixed(1)}L${r(v[0]).toFixed(1)} ${c.toFixed(1)}Z" fill="${Ao[d[2]]}" stroke="${Ao[d[2]]}" stroke-width=".6"/>`}const u=s.map((f,d)=>`${d?"L":"M"}${r(f[0]).toFixed(1)} ${l(f[1]).toFixed(1)}`).join("");return`<svg class="profile" viewBox="0 0 ${t} ${e}" preserveAspectRatio="none">
    <rect x="0" y="${c.toFixed(1)}" width="${t}" height="${(e-c).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${h}
    <path d="${u}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${t}" y1="${c.toFixed(1)}" y2="${c.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`}const Wa=document.getElementById("boot"),q2=Wa.querySelector(".boot-bar span"),A0=Wa.querySelector(".boot-stage"),X2={shape:["raising the shields",.02,.1],erode:["the rain carves valleys",.1,.42],valleys:["filling the valley floors",.42,.55],coast:["growing the reef",.55,.7],divide:["tracing the ridgelines",.66,.7],detail:["shaping the ridges",.7,.8],people:["the people arrive",.8,.86],light:["reading the light",.86,.94],sky:["gathering clouds",.94,.99],done:["",1,1]};function j2(s){return new Promise((t,e)=>{const n=new Worker(new URL(""+new URL("worker-DYvwdHJS.js",import.meta.url).href,import.meta.url),{type:"module"});n.onmessage=i=>{const o=i.data;if(o.type==="progress"){const a=X2[o.stage];if(!a)return;A0.textContent=a[0],q2.style.width=`${(a[1]+(a[2]-a[1])*o.p)*100}%`}else o.type==="done"?(n.terminate(),t({data:o.data,meta:o.meta})):o.type==="error"&&(n.terminate(),e(new Error(o.message)))},n.onerror=i=>e(i),n.postMessage({seed:s})})}async function Y2(){const s=performance.now(),t=await j2(R0);console.log(`island generated in ${((performance.now()-s)/1e3).toFixed(1)} s`);const e=new y2(document.getElementById("scene"),t),n=new W2(e);window.__app=e,e.ui=n;let i=0;const o=()=>{if(++i<4)return requestAnimationFrame(o);Wa.classList.add("gone"),setTimeout(()=>Wa.remove(),1200),new URLSearchParams(location.search).has("cam")||n.start()};requestAnimationFrame(o)}Y2().catch(s=>{console.error(s),A0.textContent="something went wrong — see the console"});
